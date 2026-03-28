---
slug: fastify-jwt-triple-token-rbac
title: 'Fastify 實戰：三 Token JWT + RBAC 權限樹'
authors: wuzhe0912
tags: [engineering]
---

多數 JWT 教學都只示範一個 token、一條 login route，然後就結束了。但實際專案需要的遠不止這些：token 過期後不能叫使用者重新登入、新帳號首次登入要強制改密碼、角色權限在需求變動時不能每次都改 code。

最近在做一個社群 RPG 的後台，有三種管理角色（Admin / GM / Moderator）、一棵巢狀的權限樹（涵蓋玩家管理和遊戲內容）、以及新 GM 帳號強制改密碼的流程。這篇記錄我實際 ship 出去的 auth 架構，技術棧是 Fastify + Drizzle ORM + PostgreSQL。

<!--truncate-->

## 三種 Token，三種用途

不是一支 JWT 打天下，而是依用途分成三支：

| Token | 有效期 | 用途 |
|-------|-------|------|
| Access Token | 8 小時 | API 認證——payload 帶使用者身份和角色（權限在 runtime 查 DB） |
| Refresh Token | 7 天 | 靜默換發——用來換取新的 access + refresh 組合 |
| Temp Token | 15 分鐘 | 限定用在強制改密碼流程——不能拿來存取 API |

為什麼不是只用 access + refresh？因為有一個 UX 需求：管理員開帳號時給預設密碼，使用者第一次登入**必須先改密碼**才能進系統。Temp token 只被 scope 到 `password_change`，不會授予任何 API 存取權，職責分明。

有一個要注意的地方：temp token 不是真正的「一次性」——在 15 分鐘內理論上可以被重複使用來繞過舊密碼檢查。實務上，第一次改密碼成功後 `forcePasswordChange` 就會被設成 `false`，後續登入不會再發 temp token。但如果需要更嚴格的保證，可以加 server-side nonce 或在首次使用後將 token 加入黑名單。

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

三種 token 各自用不同的 secret（以 base secret 加後綴區分）。這代表就算有人拿 refresh token 試圖當 access token 用，在密碼學層級就會驗證失敗，不是靠 payload 檢查。

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

Refresh token 的 payload 刻意只放 `sub`（使用者 ID），不帶角色或權限。因為角色可能在 token 發出之後被修改，refresh 時 server 一律重讀 DB 再簽新的 access token。這把過期權限的風險窗口從 refresh token 的 7 天縮短到 access token 的 8 小時。不完美——如果管理員的角色被降權，在目前的 access token 過期之前還是保有舊權限。以小團隊來說可以接受，量大的話需要加 revocation list 或縮短 access token TTL。

## 強制改密碼流程

Temp token 讓這個流程變得乾淨：

```
Client                          Server
  |                                |
  |  POST /login (email+password)  |
  |------------------------------->|
  |                                |  forcePasswordChange = true
  |  { requirePasswordChange: true,|
  |    tempToken: "..." }          |
  |<-------------------------------|
  |                                |
  |  PUT /change-password           |
  |  Authorization: Bearer <temp>  |
  |  { newPassword: "..." }        |
  |------------------------------->|
  |                                |  驗證 temp token（不是 access token）
  |                                |  Hash 新密碼、關閉 force flag
  |  { accessToken, refreshToken,  |
  |    user: {...} }               |
  |<-------------------------------|
```

重點設計：`change-password` 這支 endpoint 同時接受 temp token 和一般的 access token。如果是 temp token，跳過「驗證舊密碼」（因為剛才 login 已經驗過了）。如果是 access token，要求輸入舊密碼做二次確認。

```typescript
export async function changePassword(request: FastifyRequest, reply: FastifyReply) {
  const body = changePasswordSchema.parse(request.body)
  const authHeader = request.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ message: '未提供認證 token' })
  }

  const token = authHeader.slice(7)
  let userId: string
  let isTemp = false

  try {
    const tempPayload = verifyTempToken(token)
    userId = tempPayload.sub
    isTemp = true
  } catch {
    // 不是 temp token，嘗試 access token
    const adminPayload = verifyAdminAccessToken(token)
    userId = adminPayload.sub
  }

  // 從 DB 撈出 user——需要當前的 password hash 和角色
  const [user] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, userId))
    .limit(1)

  if (!user) {
    return reply.status(401).send({ message: '帳號不存在' })
  }

  // Temp token: 跳過舊密碼檢查
  // Access token: 要求輸入舊密碼
  if (!isTemp) {
    if (!body.currentPassword) {
      return reply.status(400).send({ message: '請提供目前密碼' })
    }
    const valid = await verifyPassword(body.currentPassword, user.passwordHash)
    if (!valid) {
      return reply.status(400).send({ message: '目前密碼不正確' })
    }
  }

  // 更新密碼、關閉 force flag
  await db.update(adminUsers)
    .set({ passwordHash: await hashPassword(body.newPassword), forcePasswordChange: false })
    .where(eq(adminUsers.id, userId))

  // 依 DB 當前角色重建 tokenPayload，不用 token 裡的舊值
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

改完密碼後直接回傳新的 access + refresh token，client 不需要再打一次 `/login`，直接進系統。

## Auth Middleware：每次都驗證帳號是否存在

常見偷懶做法：驗完 JWT 簽章就信任 payload。但如果某個管理員在 token 還沒過期時被刪除了呢？

這裡的 middleware 每次都查 DB 確認帳號還在：

```typescript
export async function authAdmin(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization?.slice(7)
  const payload = verifyAdminAccessToken(token!)

  // Token 合法，但帳號還在嗎？
  const [user] = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.id, payload.sub))
    .limit(1)

  if (!user) {
    return reply.status(401).send({ message: '帳號不存在' })
  }

  request.adminUser = {
    id: payload.sub,
    email: payload.email,
    roleId: payload.roleId,
    isSuperAdmin: payload.isSuperAdmin,
  }
}
```

對，這多了一次 DB query。但 access token 有效期 8 小時，在小型後台（< 10 個管理員）這完全可以接受。如果是高流量場景，可以考慮把 user existence 快取在 Redis，或縮短 token 有效期後改為信任 payload。

## RBAC：用 Permission Key，不是 Role Name

權限用字串 key 來比對（`dashboard.total_players`、`quests.list.export`），不是檢查角色名稱。好處：

- RBAC middleware 永遠不用改——永遠是「這個角色有沒有這個 key？」。新增功能就是在權限樹常數加一個 key + 跑一次 migration，不用重寫授權邏輯
- 角色對應哪些權限是資料不是邏輯，管理員可以在後台自己調，不用重新部署
- Middleware 就一支 function：

```typescript
export function rbac(requiredPermission: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const adminUser = request.adminUser!

    // Super Admin 直接通過
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
      return reply.status(403).send({ message: '權限不足' })
    }
  }
}
```

掛到 route 上就是一行：

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### 權限樹

權限定義成一棵巢狀常數——同時是後端驗證和前端 UI 渲染的 single source of truth：

```typescript
export const PERMISSION_TREE = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    children: [
      { key: 'dashboard.total_players', label: '玩家總數' },
      { key: 'dashboard.rank_distribution', label: '等級分布' },
      {
        key: 'dashboard.pending_reviews',
        label: '待審核',
        children: [
          { key: 'dashboard.pending_reviews.edit', label: '編輯' },
        ],
      },
    ],
  },
  // ... players, quests, shop 模組
] as const
```

再用一支 utility 把樹攤平成所有合法 key 的清單，拿來 seed DB 和做驗證：

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### 系統管理：在權限樹之外

有一個刻意的設計：「系統管理」模組（帳號 CRUD、角色 CRUD）不放在權限樹裡，改用獨立的 `requireSystemAdmin` middleware 檢查角色身份：

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

  return reply.status(403).send({ message: '僅管理員可存取系統管理' })
}
```

原因？因為系統管理控制的是「誰有什麼權限」。如果它在權限樹裡面，理論上某個角色可以自己授予自己更多權限——這是提權漏洞。把它拉出來綁定角色身份，從結構上杜絕。

## Schema

三張表的完整 Drizzle schema：

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

注意 `adminUsers` 上的 `forcePasswordChange` 預設是 `true`——每個新帳號一開始就會被鎖在改密碼的流程裡。

## 未來會調整的地方

兩個後續階段要注意的 trade-off：

1. **Token 撤銷**：目前沒有 refresh token 黑名單。如果有人的 refresh token 外洩，只能等它自然過期（7 天）或換掉整個 JWT secret（會登出所有人）。以目前的規模（< 10 個管理員）可以接受，量大的話需要加 Redis-backed revocation list。

2. **權限快取**：RBAC middleware 每次都打 DB。以目前的使用者量無感，但如果後台人數增加，可以考慮把每個角色的權限集快取到 Redis，設短 TTL，角色更新時 invalidate。

---

這套系統目前涵蓋 15 支 endpoint、跨 4 個 route 模組，有 53 個測試。完整技術棧：Fastify + TypeScript + Drizzle ORM + PostgreSQL，測試框架是 Vitest。
