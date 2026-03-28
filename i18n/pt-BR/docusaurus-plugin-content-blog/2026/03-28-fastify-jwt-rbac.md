---
slug: fastify-jwt-triple-token-rbac
title: 'Três JWTs + RBAC no Fastify: o que eu realmente entreguei'
authors: wuzhe0912
tags: [engineering]
---

A maioria dos tutoriais de JWT te mostra um token único, uma rota de login e pronto. Projetos reais precisam de mais: refresh de token sem forcar novo login, troca de senha obrigatória para contas novas, controle de acesso baseado em papéis que não desmorone quando os requisitos ficam estranhos.

Recentemente entreguei a camada de autenticação de um projeto pessoal — o backend administrativo de um RPG comunitário. Três papéis (Admin, Game Master, Moderator), uma árvore de permissões aninhada cobrindo gerenciamento de jogadores e conteúdo do jogo, e um fluxo de troca de senha obrigatória para GMs recém-integrados. Veja como a implementação realmente ficou em Fastify + Drizzle ORM.

<!--truncate-->

## Três Tokens, três funções

Em vez de um único JWT, uso três com durações e propósitos diferentes:

| Token | Duração | Propósito |
|-------|---------|-----------|
| Access Token | 8 horas | Autenticação de API — carrega identidade e papel do usuário (permissões são consultadas em runtime) |
| Refresh Token | 7 dias | Re-autenticação silenciosa — troca por um novo par access + refresh |
| Temp Token | 15 minutos | Limitado ao fluxo de troca de senha obrigatória — não pode ser usado para acesso à API |

Por que não usar apenas access + refresh? O Temp Token existe por um requisito de UX específico: quando um admin cria uma nova conta com senha padrão, o primeiro login deve forçar a troca de senha *antes* de conceder qualquer acesso à API. Um Temp Token com escopo `password_change` resolve isso sem poluir as responsabilidades do Access Token.

Uma ressalva: o Temp Token não é verdadeiramente de uso único — dentro da sua janela de 15 minutos, ele poderia teoricamente ser reutilizado para contornar a verificação de senha atual novamente. Na prática, o flag `forcePasswordChange` é setado como `false` na primeira troca bem-sucedida, então logins subsequentes não emitirão um novo Temp Token. Mas se você precisar de garantias mais rigorosas, seria necessário adicionar um nonce no lado do servidor ou invalidar o token após o primeiro uso.

```typescript
export interface AdminTokenPayload {
  sub: string
  email: string
  roleId: string
  isSuperAdmin: boolean
}

export interface TempTokenPayload {
  sub: string
  type: 'password_change'
}
```

Cada tipo de token usa um secret diferente (derivado de um secret base com sufixos). Isso significa que um Refresh Token nunca pode ser usado como Access Token, mesmo que alguém tente — a verificação falha no nível criptográfico, não apenas no nível do payload.

```typescript
export function signAdminAccessToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload as object, env.JWT_ADMIN_SECRET, {
    expiresIn: env.JWT_ADMIN_EXPIRES_IN,  // '8h'
  })
}

export function signAdminRefreshToken(payload: { sub: string }): string {
  return jwt.sign(payload as object, env.JWT_ADMIN_SECRET + '_refresh', {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,  // '7d'
  })
}

export function signTempToken(payload: TempTokenPayload): string {
  return jwt.sign(payload as object, env.JWT_ADMIN_SECRET + '_temp', {
    expiresIn: '15m',
  })
}
```

O payload do Refresh Token é intencionalmente mínimo — apenas `sub`. Ele não carrega dados de papel ou permissão, porque esses podem mudar entre a emissão do token e o refresh. Quando o client envia uma requisição de refresh, o servidor sempre relê o papel atual do usuário no banco de dados antes de assinar um novo Access Token. Isso estreita a janela de permissões desatualizadas para a duração do Access Token (8 horas) em vez da do Refresh Token (7 dias). Não é perfeito — se o papel de um admin for rebaixado, ele mantém o nível de acesso antigo até o Access Token atual expirar. Para um time pequeno, é um trade-off aceitável; em escala, seria necessário uma lista de revogação ou um TTL mais curto para o Access Token.

## O fluxo de troca de senha obrigatória

Este é o fluxo que o Temp Token viabiliza:

```
Client                          Server
  |                                |
  |  POST /login (email+password)  |
  |------------------------------->|
  |                                |  User has forcePasswordChange = true
  |  { requirePasswordChange: true,|
  |    tempToken: "..." }          |
  |<-------------------------------|
  |                                |
  |  PUT /change-password           |
  |  Authorization: Bearer <temp>  |
  |  { newPassword: "..." }        |
  |------------------------------->|
  |                                |  Verifies temp token (not access token)
  |                                |  Hashes new password
  |                                |  Sets forcePasswordChange = false
  |  { accessToken, refreshToken,  |
  |    user: {...} }               |
  |<-------------------------------|
```

O detalhe-chave: o endpoint `change-password` aceita *tanto* Temp Tokens quanto Access Tokens regulares. Para Temp Tokens, pula a verificação "confirme a senha atual" (já que o usuário já foi autenticado via login). Para Access Tokens, exige a senha atual como confirmação.

```typescript
export async function changePassword(request: FastifyRequest, reply: FastifyReply) {
  const body = changePasswordSchema.parse(request.body)
  const authHeader = request.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ message: 'Missing auth token' })
  }

  const token = authHeader.slice(7)
  let userId: string
  let isTemp = false

  try {
    const tempPayload = verifyTempToken(token)
    userId = tempPayload.sub
    isTemp = true
  } catch {
    // Not a temp token — try access token
    const adminPayload = verifyAdminAccessToken(token)
    userId = adminPayload.sub
  }

  // Look up the actual user — we need their current password hash and role
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, userId))
    .limit(1)

  if (!user) {
    return reply.status(401).send({ message: 'Account no longer exists' })
  }

  // Temp token: skip current password check
  // Access token: require current password
  if (!isTemp) {
    if (!body.currentPassword) {
      return reply.status(400).send({ message: 'Current password required' })
    }
    const valid = await verifyPassword(body.currentPassword, user.passwordHash)
    if (!valid) {
      return reply.status(400).send({ message: 'Current password incorrect' })
    }
  }

  // Update password, clear force flag
  await db.update(adminUsers)
    .set({ passwordHash: await hashPassword(body.newPassword), forcePasswordChange: false })
    .where(eq(adminUsers.id, userId))

  // Re-read current role and sign fresh tokens based on DB state, not stale token claims
  const tokenPayload = {
    sub: user.id,
    email: user.email,
    roleId: user.roleId,
    isSuperAdmin: user.isSuperAdmin,
  }

  return reply.send({
    accessToken: signAdminAccessToken(tokenPayload),
    refreshToken: signAdminRefreshToken({ sub: user.id }),
    user: { id: user.id, email: user.email, /* ... */ },
  })
}
```

Após uma troca de senha bem-sucedida, o servidor retorna novos Access Token e Refresh Token imediatamente. O client nunca precisa chamar `/login` de novo — já está dentro.

## Auth Middleware: sempre verificar a existência

Um atalho comum: verificar a assinatura do JWT e confiar no payload. Isso quebra quando um admin é excluído enquanto seu token ainda é válido.

O middleware aqui sempre consulta o banco de dados:

```typescript
export async function authAdmin(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization?.slice(7)
  const payload = verifyAdminAccessToken(token!)

  // Token is valid, but does the user still exist?
  const [user] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.id, payload.sub))
    .limit(1)

  if (!user) {
    return reply.status(401).send({ message: 'Account no longer exists' })
  }

  request.adminUser = {
    id: payload.sub,
    email: payload.email,
    roleId: payload.roleId,
    isSuperAdmin: payload.isSuperAdmin,
  }
}
```

Sim, isso adiciona uma consulta ao banco por requisição autenticada. Com um Access Token de 8 horas, considerei um trade-off aceitável. Se a duração do token fosse menor (digamos 15 minutos), daria para argumentar a favor de confiar apenas no payload.

## RBAC: chaves de permissão, não nomes de papel

O sistema de permissões usa chaves em string (`dashboard.total_players`, `quests.list.export`) em vez de verificar nomes de papéis. Isso significa:

- O middleware RBAC nunca muda — é sempre "este papel tem esta chave?". Adicionar uma funcionalidade nova significa adicionar uma chave à constante da árvore de permissões e uma migration, não reescrever lógica de autorização.
- Atribuições de papel-permissão são dados, não lógica. Um admin pode reorganizar quais permissões cada papel tem pelo CMS sem precisar de deploy.
- O middleware é uma única função:

```typescript
export function rbac(requiredPermission: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const adminUser = request.adminUser!

    // Super Admin bypasses everything
    if (adminUser.isSuperAdmin) return

    const [perm] = await db
      .select({ id: rolePermissions.id })
      .from(rolePermissions)
      .where(
        and(
          eq(rolePermissions.roleId, adminUser.roleId),
          eq(rolePermissions.permissionKey, requiredPermission),
        ),
      )
      .limit(1)

    if (!perm) {
      return reply.status(403).send({ message: 'Insufficient permissions' })
    }
  }
}
```

Uso em uma rota:

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### A árvore de permissões

As permissões são definidas como uma constante aninhada — a fonte única de verdade tanto para a validação no backend quanto para a renderização da interface no frontend:

```typescript
export const PERMISSION_TREE = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    children: [
      { key: 'dashboard.total_players', label: 'Total Players' },
      { key: 'dashboard.rank_distribution', label: 'Rank Distribution' },
      {
        key: 'dashboard.pending_reviews',
        label: 'Pending Reviews',
        children: [
          { key: 'dashboard.pending_reviews.edit', label: 'Edit' },
        ],
      },
    ],
  },
  // ... players, quests, shop modules
] as const
```

Uma função utilitária achata essa árvore em uma lista com todas as chaves válidas — usada para o seeding do banco de dados e para validação:

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin: fora da árvore de permissões

Uma decisão de design que vale destacar: o módulo "System Management" (CRUD de contas, CRUD de papéis) *não* está na árvore de permissões. Ele usa um middleware `requireSystemAdmin` separado que verifica a identidade do papel, não chaves de permissão:

```typescript
export async function requireSystemAdmin(request: FastifyRequest, reply: FastifyReply) {
  const adminUser = request.adminUser!

  if (adminUser.isSuperAdmin) return

  const [role] = await db
    .select({ name: adminRoles.name, isSystemRole: adminRoles.isSystemRole })
    .from(adminRoles)
    .where(eq(adminRoles.id, adminUser.roleId))
    .limit(1)

  if (role?.isSystemRole && role.name === 'Administrator') return

  return reply.status(403).send({ message: 'System admin access only' })
}
```

Por quê? Porque o gerenciamento do sistema controla *quem tem quais permissões*. Se estivesse dentro da árvore de permissões, um papel poderia teoricamente conceder mais permissões a si mesmo — um vetor de escalação de privilégios. Mantê-lo fora e vinculado à identidade do papel evita isso.

## Schema

Para referência, aqui estão as três tabelas que sustentam este sistema:

```typescript
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 100 }),
  roleId: uuid('role_id').notNull().references(() => adminRoles.id),
  isSuperAdmin: boolean('is_super_admin').notNull().default(false),
  forcePasswordChange: boolean('force_password_change').notNull().default(true),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const adminRoles = pgTable('admin_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description').notNull(),
  isSystemRole: boolean('is_system_role').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const rolePermissions = pgTable('role_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  roleId: uuid('role_id').notNull().references(() => adminRoles.id, { onDelete: 'cascade' }),
  permissionKey: varchar('permission_key', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
```

O flag `forcePasswordChange` em `adminUsers` tem como padrão `true` — toda conta nova começa bloqueada atrás do fluxo de troca de senha.

## O que eu faria diferente

Duas coisas que estou monitorando para fases posteriores:

1. **Revogação de token**: Agora não existe uma blacklist de Refresh Token. Se o Refresh Token de alguém for comprometido, é preciso esperar expirar (7 dias) ou rotacionar o secret JWT (o que desloga todo mundo). Para um time admin pequeno, é aceitável. Em escala, eu adicionaria uma lista de revogação com Redis.

2. **Cache de permissões**: O middleware RBAC consulta o banco em toda requisição. Com a base de usuários atual (< 10 admins), funciona bem. Se crescer, eu faria cache do conjunto de permissões por papel no Redis com um TTL curto e invalidaria na atualização do papel.

---

Este sistema atende 15 endpoints distribuídos em 4 módulos de rotas, sustentado por 53 testes. A stack completa é Fastify + TypeScript + Drizzle ORM + PostgreSQL, testado com Vitest.
