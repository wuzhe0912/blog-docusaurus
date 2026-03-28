---
slug: fastify-jwt-triple-token-rbac
title: 'Три JWT + RBAC в Fastify: что я на самом деле выпустил'
authors: wuzhe0912
tags: [engineering]
---

Большинство туториалов по JWT показывают один токен, маршрут логина — и на этом всё. В реальных проектах нужно больше: обновление токена без повторного входа, принудительная смена пароля для новых аккаунтов, контроль доступа на основе ролей, который не рассыпается при нестандартных требованиях.

Недавно я выпустил слой аутентификации для пет-проекта — админ-панель для комьюнити-RPG. Три роли (Admin, Game Master, Moderator), вложенное дерево прав, охватывающее управление игроками и игровым контентом, и поток принудительной смены пароля для вновь добавленных GM. Вот как реализация выглядит на практике в Fastify + Drizzle ORM.

<!--truncate-->

## Три токена, три задачи

Вместо одного JWT я использую три с разным временем жизни и назначением:

| Токен | Время жизни | Назначение |
|-------|-------------|------------|
| Access Token | 8 часов | Аутентификация API — несёт идентификатор пользователя и роль (права проверяются в runtime) |
| Refresh Token | 7 дней | Бесшовная ре-аутентификация — обменивается на новую пару access + refresh |
| Temp Token | 15 минут | Ограничен потоком принудительной смены пароля — не может использоваться для доступа к API |

Почему не ограничиться access + refresh? Temp Token существует из-за конкретного UX-требования: когда админ создаёт новый аккаунт с паролем по умолчанию, первый вход должен принудительно запросить смену пароля *до* предоставления какого-либо доступа к API. Temp Token со scope `password_change` решает эту задачу, не загрязняя зону ответственности Access Token.

Оговорка: Temp Token не является по-настоящему одноразовым — в течение его 15-минутного окна он теоретически может быть повторно использован для обхода проверки текущего пароля. На практике флаг `forcePasswordChange` устанавливается в `false` после первой успешной смены, поэтому последующие входы не выдадут новый Temp Token. Но если нужны более строгие гарантии, стоит добавить серверный nonce или заблокировать токен после первого использования.

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

Каждый тип токена использует свой secret (производный от базового с суффиксами). Это означает, что Refresh Token никогда не может быть использован как Access Token, даже если кто-то попытается — верификация проваливается на криптографическом уровне, а не только на уровне payload.

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

Payload Refresh Token намеренно минимален — только `sub`. Он не несёт данных о роли или правах, потому что они могут измениться между выпуском токена и его обновлением. Когда клиент отправляет запрос на refresh, сервер всегда перечитывает текущую роль пользователя из базы данных перед подписанием нового Access Token. Это сужает окно устаревших прав до времени жизни Access Token (8 часов) вместо Refresh Token (7 дней). Это не идеально — если роль админа понижена, он сохраняет старый уровень доступа до истечения текущего Access Token. Для маленькой команды это приемлемый компромисс; при масштабировании понадобится список отзыва или более короткий TTL для Access Token.

## Поток принудительной смены пароля

Вот поток, который обеспечивает Temp Token:

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

Ключевой момент: endpoint `change-password` принимает *как* Temp Token, *так и* обычные Access Token. Для Temp Token проверка текущего пароля пропускается (пользователь уже прошёл аутентификацию через логин). Для Access Token требуется текущий пароль в качестве подтверждения.

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

После успешной смены пароля сервер сразу возвращает новые Access Token и Refresh Token. Клиенту не нужно повторно вызывать `/login` — он уже авторизован.

## Auth Middleware: всегда проверяй существование

Распространённый шорткат: проверить подпись JWT и довериться payload. Это ломается, когда админ удалён, а его токен ещё валиден.

Middleware здесь всегда проверяет базу данных:

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

Да, это добавляет запрос к БД на каждый аутентифицированный реквест. С Access Token на 8 часов я счёл это приемлемым компромиссом. Если бы время жизни токена было короче (скажем, 15 минут), можно было бы обойтись доверием к payload.

## RBAC: ключи прав, а не имена ролей

Система прав использует строковые ключи (`dashboard.total_players`, `quests.list.export`) вместо проверки имён ролей. Это означает:

- Middleware RBAC никогда не меняется — это всегда «есть ли у этой роли этот ключ?». Добавление новой функциональности — это добавление ключа в константу дерева прав и migration, а не переписывание логики авторизации.
- Назначения роль-право — это данные, а не логика. Админ может перераспределить, какие права у какой роли, через CMS без деплоя.
- Middleware — это одна функция:

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

Использование на маршруте:

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### Дерево прав

Права определены как вложенная константа — единственный источник истины как для бэкенд-валидации, так и для отрисовки интерфейса на фронтенде:

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

Утилитарная функция разворачивает это дерево в плоский список всех валидных ключей — используется для наполнения БД и валидации:

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin: за пределами дерева прав

Одно проектное решение, которое стоит выделить: модуль «System Management» (CRUD аккаунтов, CRUD ролей) *не* входит в дерево прав. Он использует отдельный middleware `requireSystemAdmin`, который проверяет идентичность роли, а не ключи прав:

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

Почему? Потому что управление системой контролирует, *кто имеет какие права*. Если бы оно было внутри дерева прав, роль теоретически могла бы назначить себе больше прав — вектор эскалации привилегий. Вынесение за пределы дерева и привязка к идентичности роли это предотвращает.

## Schema

Для справки — три таблицы, на которых построена система:

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

Флаг `forcePasswordChange` в `adminUsers` по умолчанию `true` — каждый новый аккаунт стартует заблокированным за потоком смены пароля.

## Что бы я сделал иначе

Две вещи, за которыми я слежу для последующих этапов:

1. **Отзыв токенов**: Сейчас нет blacklist для Refresh Token. Если чей-то Refresh Token скомпрометирован, нужно ждать его истечения (7 дней) или ротировать JWT secret (что разлогинит всех). Для небольшой команды админов это приемлемо. При масштабировании я бы добавил список отзыва на Redis.

2. **Кеширование прав**: Middleware RBAC обращается к БД на каждый запрос. При текущей базе пользователей (< 10 админов) это нормально. Если она вырастет, я бы кешировал набор прав для каждой роли в Redis с коротким TTL и инвалидировал при обновлении роли.

---

Эта система обслуживает 15 endpoints в 4 модулях маршрутов, подкреплённая 53 тестами. Полный стек — Fastify + TypeScript + Drizzle ORM + PostgreSQL, тестирование на Vitest.
