---
slug: fastify-jwt-triple-token-rbac
title: 'Tres JWT + RBAC en Fastify: lo que realmente lancé'
authors: wuzhe0912
tags: [engineering]
---

La mayoría de los tutoriales de JWT te muestran un solo token, una ruta de login, y listo. Los proyectos reales necesitan más: renovación de tokens sin volver a iniciar sesión, cambio de contraseña forzado para cuentas nuevas, y un control de acceso basado en roles que no se desmorone cuando los requisitos se ponen raros.

Hace poco lancé la capa de autenticación de un proyecto personal — el backend de administración de un RPG comunitario. Tres roles (Admin, Game Master, Moderator), un árbol de permisos anidado que cubre la gestión de jugadores y el contenido del juego, y un flujo de cambio de contraseña forzado para GMs recién incorporados. Así es como se ve la implementación real en Fastify + Drizzle ORM.

<!--truncate-->

## Tres tokens, tres trabajos

En lugar de un solo JWT, uso tres con distintas duraciones y propósitos:

| Token | Duración | Propósito |
|-------|----------|-----------|
| Access Token | 8 horas | Autenticación de API — lleva la identidad y el rol del usuario (los permisos se consultan en runtime) |
| Refresh Token | 7 días | Re-autenticación silenciosa — se intercambia por un nuevo par Access + Refresh |
| Temp Token | 15 minutos | Limitado al flujo de cambio de contraseña forzado — no se puede usar para acceso a la API |

¿Por qué no solo Access + Refresh? El Temp Token existe por un requisito de UX concreto: cuando un admin crea una cuenta nueva con una contraseña por defecto, el primer login debe forzar un cambio de contraseña *antes* de otorgar cualquier acceso a la API. Un Temp Token con scope `password_change` resuelve esto sin contaminar las responsabilidades del Access Token.

Una salvedad: el Temp Token no es realmente de un solo uso — dentro de su ventana de 15 minutos, teóricamente podría ser reenviado para saltarse nuevamente la verificación de la contraseña actual. En la práctica, el flag `forcePasswordChange` se pone en `false` tras el primer cambio exitoso, así que los logins posteriores no emitirán un nuevo Temp Token. Pero si necesitas garantías más estrictas, habría que agregar un nonce en el servidor o meter el token en una blacklist después del primer uso.

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

Cada tipo de token usa un secret diferente (derivado de un secret base con sufijos). Esto significa que un Refresh Token nunca puede usarse como Access Token, incluso si alguien lo intenta — la verificación falla a nivel criptográfico, no solo a nivel de payload.

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

El payload del Refresh Token es intencionalmente mínimo — solo `sub`. No lleva datos de rol ni permisos, porque estos podrían cambiar entre la emisión y la renovación del token. Cuando el cliente envía una solicitud de refresh, el servidor siempre relee el rol actual del usuario desde la base de datos antes de firmar un nuevo Access Token. Esto reduce la ventana de permisos obsoletos a la vida útil del Access Token (8 horas) en lugar de la del Refresh Token (7 días). No es perfecto — si el rol de un admin se degrada, conserva su antiguo nivel de acceso hasta que expire el Access Token actual. Para un equipo pequeño es un compromiso aceptable; a escala, habría que agregar una lista de revocación o acortar la TTL del Access Token.

## El flujo de cambio de contraseña forzado

Este es el flujo que el Temp Token hace posible:

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

El detalle clave: el endpoint `change-password` acepta *tanto* Temp Tokens como Access Tokens regulares. Para Temp Tokens, se salta la verificación de la contraseña actual (ya que el usuario se autenticó mediante el login). Para Access Tokens, exige la contraseña actual como confirmación.

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

Tras un cambio de contraseña exitoso, el servidor devuelve inmediatamente nuevos tokens Access + Refresh. El cliente nunca necesita llamar a `/login` de nuevo — ya está dentro.

## Auth Middleware: verificar siempre la existencia

Un atajo común: verificar la firma del JWT y confiar en el payload. Esto falla cuando un admin es eliminado mientras su token aún es válido.

La middleware aquí siempre consulta la base de datos:

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

Sí, esto agrega una consulta a la base de datos por cada solicitud autenticada. Con un Access Token de 8 horas, lo considero un compromiso aceptable. Si la duración del token fuera más corta (digamos 15 minutos), se podría argumentar a favor de confiar solo en el payload.

## RBAC: Permission Keys, no nombres de roles

El sistema de permisos usa claves de tipo string (`dashboard.total_players`, `quests.list.export`) en lugar de verificar nombres de roles. Esto significa:

- La middleware RBAC nunca cambia — siempre es "¿tiene este rol esta clave?". Agregar una funcionalidad nueva significa agregar una clave a la constante del Permission Tree y una migración, no reescribir la lógica de autorización.
- Las asignaciones de roles a permisos son datos, no lógica. Un admin puede reorganizar qué rol tiene qué permisos en el CMS sin necesidad de desplegar.
- La middleware es una sola función:

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

Uso en una ruta:

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### El Permission Tree

Los permisos se definen como una constante anidada — la fuente de verdad única tanto para la validación del backend como para el renderizado de la interfaz frontend:

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

Una función utilitaria aplana este árbol en una lista de todas las claves válidas — usada para el seeding de la base de datos y para validación:

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin: fuera del Permission Tree

Una decisión de diseño que vale la pena destacar: el módulo de "Gestión del sistema" (CRUD de cuentas, CRUD de roles) *no* está en el Permission Tree. Usa una middleware `requireSystemAdmin` separada que verifica la identidad del rol, no los Permission Keys:

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

¿Por qué? Porque la gestión del sistema controla *quién tiene qué permisos*. Si estuviera dentro del Permission Tree, un rol podría teóricamente otorgarse más permisos a sí mismo — un vector de escalada de privilegios. Mantenerla fuera y vincularla a la identidad del rol previene esto.

## Schema

Como referencia, estas son las tres tablas que respaldan este sistema:

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

El flag `forcePasswordChange` en `adminUsers` está en `true` por defecto — cada cuenta nueva comienza bloqueada tras el flujo de cambio de contraseña.

## Qué haría diferente

Dos cosas que tengo en la mira para etapas posteriores:

1. **Revocación de tokens**: Ahora mismo no hay blacklist de Refresh Tokens. Si el Refresh Token de alguien se ve comprometido, hay que esperar a que expire (7 días) o rotar el secret JWT (lo que cierra la sesión de todos). Para un equipo pequeño de admins, es aceptable. A escala, agregaría una lista de revocación respaldada por Redis.

2. **Cache de permisos**: La middleware RBAC consulta la base de datos en cada solicitud. Con la base de usuarios actual (< 10 admins), está bien. Si crece, cachearía el conjunto de permisos por rol en Redis con una TTL corta e invalidaría en cada actualización de rol.

---

Este sistema maneja 15 endpoints distribuidos en 4 módulos de rutas, respaldado por 53 tests. El stack completo es Fastify + TypeScript + Drizzle ORM + PostgreSQL, testeado con Vitest.
