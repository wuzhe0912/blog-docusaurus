---
slug: fastify-jwt-triple-token-rbac
title: 'Three JWTs + RBAC in Fastify: What I Actually Shipped'
authors: wuzhe0912
tags: [engineering]
---

Most JWT tutorials show you a single token, a login route, and call it a day. Real projects need more: token refresh without re-login, forced password changes for new accounts, role-based access control that doesn't fall apart when requirements get weird.

I recently shipped the auth layer for a side project — the admin backend for a community RPG. Three roles (Admin, Game Master, Moderator), a nested permission tree covering player management and game content, and a forced password change flow for newly onboarded GMs. Here's what the implementation actually looks like in Fastify + Drizzle ORM.

<!--truncate-->

## Three Tokens, Three Jobs

Instead of one JWT, I use three with different lifespans and purposes:

| Token | Lifespan | Purpose |
|-------|----------|---------|
| Access Token | 8 hours | API authentication — carries user identity and role (permissions are looked up at runtime) |
| Refresh Token | 7 days | Silent re-authentication — exchanges for a new access + refresh pair |
| Temp Token | 15 minutes | Scoped to the forced password change flow — cannot be used for API access |

Why not just access + refresh? The temp token exists because of a specific UX requirement: when an admin creates a new account with a default password, the first login should force a password change *before* granting any API access. A temp token scoped to `password_change` handles this without polluting the access token's responsibilities.

One caveat: the temp token isn't truly single-use — within its 15-minute window, it could theoretically be replayed to bypass the current password check again. In practice, the `forcePasswordChange` flag gets set to `false` on the first successful change, so subsequent logins won't issue a new temp token. But if you need stricter guarantees, you'd add a server-side nonce or blacklist the token after first use.

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

Each token type uses a different secret (derived from a base secret with suffixes). This means a refresh token can never be used as an access token, even if someone tries — verification fails at the cryptographic level, not just at the payload level.

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

The refresh token payload is intentionally minimal — just `sub`. It doesn't carry role or permission data, because those could change between token issuance and refresh. When the client sends a refresh request, the server always re-reads the user's current role from the database before signing a new access token. This narrows the stale-permission window to the access token's lifespan (8 hours) rather than the refresh token's (7 days). It's not perfect — if an admin's role gets downgraded, they keep their old access level until the current access token expires. For a small team this is an acceptable trade-off; at scale you'd want a revocation list or shorter access token TTL.

## The Forced Password Change Flow

Here's the flow that the temp token enables:

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

The key detail: the `change-password` endpoint accepts *both* temp tokens and regular access tokens. For temp tokens, it skips the "verify current password" check (since the user was already authenticated via login). For access tokens, it requires the current password as confirmation.

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

After a successful password change, the server returns fresh access + refresh tokens immediately. The client never needs to call `/login` again — they're already in.

## Auth Middleware: Always Verify Existence

A common shortcut: verify the JWT signature and trust the payload. This breaks when an admin is deleted while their token is still valid.

The middleware here always checks the database:

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

Yes, this adds a database query per authenticated request. With an 8-hour access token, I considered this an acceptable trade-off. If the token lifespan were shorter (say 15 minutes), you could argue for trusting the payload alone.

## RBAC: Permission Keys, Not Role Names

The permission system uses string keys (`dashboard.total_players`, `quests.list.export`) instead of checking role names. This means:

- The RBAC middleware never changes — it's always "does this role have this key?" Adding a new feature means adding a key to the permission tree constant and a migration, not rewriting authorization logic.
- Role-to-permission assignments are data, not logic. An admin can rearrange which role gets which permissions in the CMS without a deploy.
- The middleware is a single function:

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

Usage on a route:

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### The Permission Tree

Permissions are defined as a nested constant — the single source of truth for both backend validation and frontend UI rendering:

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

A utility function flattens this tree into a list of all valid keys — used for seeding the database and for validation:

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin: Outside the Permission Tree

One design decision worth highlighting: the "System Management" module (account CRUD, role CRUD) is *not* in the permission tree. It uses a separate `requireSystemAdmin` middleware that checks role identity, not permission keys:

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

Why? Because system management controls *who has which permissions*. If it were inside the permission tree, a role could theoretically grant itself more permissions — a privilege escalation vector. Keeping it outside and tied to role identity prevents this.

## Schema

For reference, here are the three tables that back this system:

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

The `forcePasswordChange` flag on `adminUsers` defaults to `true` — every new account starts locked behind the password change flow.

## What I'd Do Differently

Two things I'm watching for in later stages:

1. **Token revocation**: Right now, there's no refresh token blacklist. If someone's refresh token is compromised, you have to wait for it to expire (7 days) or rotate the JWT secret (which logs everyone out). For a small admin team, this is acceptable. At scale, I'd add a Redis-backed revocation list.

2. **Permission caching**: The RBAC middleware hits the database on every request. With the current user base (< 10 admins), this is fine. If it grows, I'd cache the permission set per role in Redis with a short TTL and invalidate on role update.

---

This system handles 15 endpoints across 4 route modules, backed by 53 tests. The full stack is Fastify + TypeScript + Drizzle ORM + PostgreSQL, tested with Vitest.
