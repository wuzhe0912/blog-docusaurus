---
slug: fastify-jwt-triple-token-rbac
title: 'Fastify 实战：三 Token JWT + RBAC 权限树'
authors: wuzhe0912
tags: [engineering]
---

多数 JWT 教程的套路是：建一个 token，写个登录路由，收工。真实项目远不止这些：需要无感刷新 token、新账号强制改密码、以及需求变复杂时不会崩掉的角色权限控制。

最近我在一个 side project 里落地了认证层——一个社区 RPG 的管理后台。三个角色（Admin、Game Master、Moderator），一棵覆盖玩家管理和游戏内容的嵌套权限树，还有新 GM 上线时的强制改密流程。以下是在 Fastify + Drizzle ORM 中的实际实现。

<!--truncate-->

## 三个 Token，各司其职

我没有只用一个 JWT，而是用了三个，各有不同的生命周期和用途：

| Token | 有效期 | 用途 |
|-------|-------|------|
| Access Token | 8 小时 | API 认证——携带用户身份和角色（权限在运行时查询） |
| Refresh Token | 7 天 | 静默续期——换取新的 Access Token + Refresh Token 对 |
| Temp Token | 15 分钟 | 仅用于强制改密流程——不能用于 API 访问 |

为什么不只用 Access Token + Refresh Token？Temp Token 的存在源于一个具体的 UX 需求：管理员用默认密码创建新账号后，首次登录必须在授予任何 API 访问权限*之前*强制改密。作用域为 `password_change` 的 Temp Token 解决了这个问题，同时不会污染 Access Token 的职责。

有一点需要注意：Temp Token 并非严格意义上的一次性——在 15 分钟窗口内，理论上可以重放来再次绕过当前密码验证。实际上，首次成功修改后 `forcePasswordChange` 标志会被设为 `false`，后续登录不会再签发新的 Temp Token。如果需要更严格的保证，需要添加服务端 nonce 或在首次使用后将 token 加入黑名单。

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

每种 token 使用不同的密钥（在基础密钥上加后缀派生）。这意味着即使有人尝试把 Refresh Token 当 Access Token 用，验证也会在密码学层面失败，而不只是在 payload 层面。

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

Refresh Token 的 payload 刻意做到最小——只有 `sub`。不携带角色或权限数据，因为在 token 签发和刷新之间这些可能已经变了。客户端发起刷新请求时，服务端在签发新 Access Token 之前一定会从数据库重新读取用户当前角色。这样，过期权限的窗口从 Refresh Token 的有效期（7 天）缩短到 Access Token 的有效期（8 小时）。当然不完美——如果管理员的角色被降级，在当前 Access Token 过期前仍保持旧的访问级别。对于小团队这是可接受的折中；大规模场景下需要加入吊销列表或缩短 Access Token 的 TTL。

## 强制改密流程

以下是 Temp Token 支撑的完整流程：

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

关键细节：`change-password` 端点同时接受 Temp Token 和普通 Access Token。对于 Temp Token，跳过"验证当前密码"的检查（因为用户已通过登录完成认证）。对于 Access Token，则要求输入当前密码作为确认。

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

改密成功后，服务端立即返回新的 Access Token + Refresh Token。客户端不需要再调用 `/login`——已经处于登录状态。

## 认证 Middleware：必须验证用户是否存在

一个常见的偷懒做法：验证 JWT 签名后直接信任 payload。问题在于，如果管理员被删除但 token 仍然有效，这就会出问题。

这里的 middleware 每次都查数据库确认：

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

没错，每个认证请求都多了一次数据库查询。考虑到 Access Token 有效期是 8 小时，我认为这是可接受的折中。如果 token 有效期更短（比如 15 分钟），纯信任 payload 也说得过去。

## RBAC：用权限键，不用角色名

权限系统使用字符串键（`dashboard.total_players`、`quests.list.export`）而不是检查角色名。好处是：

- RBAC middleware 不需要改动——永远只做"这个角色有没有这个 key"的判断。新增功能只需往权限树常量里加个 key 再跑 migration，不用改授权逻辑。
- 角色和权限的对应关系是数据，不是代码。管理员可以在 CMS 里随时调整角色拥有哪些权限，无需部署。
- middleware 就一个函数：

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

路由上的用法：

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### 权限树

权限以嵌套常量定义——同时作为后端校验和前端 UI 渲染的唯一数据源：

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

一个工具函数将这棵树拍平为所有有效 key 的列表——用于数据库 seeding 和校验：

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin：权限树之外

有一个设计决策值得强调："系统管理"模块（账号 CRUD、角色 CRUD）*不在*权限树里。它使用单独的 `requireSystemAdmin` middleware，检查的是角色身份而非权限键：

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

为什么？因为系统管理控制的是*谁拥有哪些权限*。如果它在权限树内，角色理论上可以给自己授予更多权限——这就是权限提升漏洞。放在树外、绑定角色身份就能杜绝这个问题。

## Schema

以下是支撑这套系统的三张表：

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

`adminUsers` 上的 `forcePasswordChange` 默认为 `true`——每个新账号都从"锁在改密流程后面"的状态开始。

## 后续改进方向

后续阶段我在关注两件事：

1. **Token 吊销**：目前没有 Refresh Token 黑名单。如果某人的 Refresh Token 泄露，只能等它过期（7 天）或轮换 JWT 密钥（所有人被踢下线）。小规模管理团队可以接受，大规模场景下需要加 Redis 吊销列表。

2. **权限缓存**：RBAC middleware 每次请求都查数据库。当前用户规模（不到 10 个管理员）没问题。如果规模增长，我会按角色把权限集合缓存到 Redis，设短 TTL，角色更新时主动失效。

---

这套系统处理 4 个路由模块中的 15 个端点，有 53 个测试覆盖。技术栈是 Fastify + TypeScript + Drizzle ORM + PostgreSQL，测试用 Vitest。
