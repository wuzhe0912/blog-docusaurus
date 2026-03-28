---
slug: fastify-jwt-triple-token-rbac
title: 'Ba JWT + RBAC trong Fastify: Những gì tôi thực sự đã ship'
authors: wuzhe0912
tags: [engineering]
---

Hầu hết các tutorial về JWT chỉ cho bạn thấy một token duy nhất, một route đăng nhập, rồi coi như xong. Dự án thực tế cần nhiều hơn thế: refresh token mà không cần đăng nhập lại, buộc đổi mật khẩu cho tài khoản mới, và hệ thống kiểm soát truy cập theo vai trò mà không sụp đổ khi yêu cầu trở nên phức tạp.

Gần đây tôi đã ship lớp xác thực cho một dự án cá nhân — backend quản trị cho một game RPG cộng đồng. Ba vai trò (Admin, Game Master, Moderator), một cây phân quyền lồng nhau bao gồm quản lý người chơi và nội dung game, cùng quy trình buộc đổi mật khẩu cho các GM mới được thêm vào. Đây là cách triển khai thực tế trông như thế nào trong Fastify + Drizzle ORM.

<!--truncate-->

## Ba Token, ba nhiệm vụ

Thay vì một JWT duy nhất, tôi dùng ba token với thời hạn và mục đích khác nhau:

| Token | Thời hạn | Mục đích |
|-------|----------|----------|
| Access Token | 8 giờ | Xác thực API — mang theo danh tính người dùng và vai trò (quyền được tra cứu tại thời điểm chạy) |
| Refresh Token | 7 ngày | Tái xác thực ngầm — đổi lấy cặp access + refresh mới |
| Temp Token | 15 phút | Giới hạn cho quy trình buộc đổi mật khẩu — không thể dùng để truy cập API |

Tại sao không chỉ dùng access + refresh? Temp token tồn tại vì một yêu cầu UX cụ thể: khi admin tạo tài khoản mới với mật khẩu mặc định, lần đăng nhập đầu tiên phải buộc đổi mật khẩu *trước khi* cấp bất kỳ quyền truy cập API nào. Một temp token với scope `password_change` xử lý việc này mà không làm rối trách nhiệm của access token.

Một lưu ý: temp token không thực sự chỉ dùng một lần — trong khoảng 15 phút, về lý thuyết nó có thể bị replay để bỏ qua bước kiểm tra mật khẩu hiện tại. Trên thực tế, cờ `forcePasswordChange` được đặt thành `false` sau lần đổi thành công đầu tiên, nên các lần đăng nhập tiếp theo sẽ không phát hành temp token mới. Nhưng nếu bạn cần đảm bảo chặt chẽ hơn, bạn sẽ cần thêm server-side nonce hoặc blacklist token sau lần sử dụng đầu tiên.

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

Mỗi loại token sử dụng một secret khác nhau (được dẫn xuất từ một base secret với các hậu tố). Điều này có nghĩa là refresh token không bao giờ có thể được dùng như access token, dù ai đó có cố gắng — việc xác minh thất bại ở tầng mật mã, không chỉ ở tầng payload.

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

Payload của refresh token cố tình tối giản — chỉ có `sub`. Nó không mang dữ liệu về vai trò hay quyền, vì những thứ đó có thể thay đổi giữa lúc phát hành token và lúc refresh. Khi client gửi yêu cầu refresh, server luôn đọc lại vai trò hiện tại của người dùng từ database trước khi ký access token mới. Điều này thu hẹp khoảng thời gian quyền bị lỗi thời xuống còn thời hạn của access token (8 giờ) thay vì của refresh token (7 ngày). Không hoàn hảo — nếu vai trò của admin bị hạ cấp, họ vẫn giữ quyền truy cập cũ cho đến khi access token hiện tại hết hạn. Với một team nhỏ, đây là sự đánh đổi chấp nhận được; ở quy mô lớn hơn bạn sẽ cần danh sách thu hồi hoặc TTL ngắn hơn cho access token.

## Quy trình buộc đổi mật khẩu

Đây là luồng xử lý mà temp token hỗ trợ:

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

Chi tiết quan trọng: endpoint `change-password` chấp nhận *cả* temp token và access token thông thường. Với temp token, nó bỏ qua bước "xác minh mật khẩu hiện tại" (vì người dùng đã được xác thực qua đăng nhập). Với access token, nó yêu cầu mật khẩu hiện tại để xác nhận.

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

Sau khi đổi mật khẩu thành công, server trả về access + refresh token mới ngay lập tức. Client không cần gọi lại `/login` — họ đã vào hệ thống rồi.

## Auth Middleware: luôn kiểm tra sự tồn tại

Một lối tắt phổ biến: xác minh chữ ký JWT rồi tin tưởng payload. Cách này hỏng khi admin bị xóa trong khi token vẫn còn hiệu lực.

Middleware ở đây luôn kiểm tra database:

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

Đúng, điều này thêm một truy vấn database cho mỗi request đã xác thực. Với access token 8 giờ, tôi coi đây là sự đánh đổi chấp nhận được. Nếu thời hạn token ngắn hơn (ví dụ 15 phút), bạn có thể lập luận rằng chỉ cần tin tưởng payload là đủ.

## RBAC: Permission Key, không phải tên vai trò

Hệ thống phân quyền sử dụng các chuỗi key (`dashboard.total_players`, `quests.list.export`) thay vì kiểm tra tên vai trò. Điều này có nghĩa là:

- RBAC middleware không bao giờ thay đổi — luôn là "vai trò này có key này không?" Thêm tính năng mới chỉ cần thêm key vào hằng số cây phân quyền và một migration, không cần viết lại logic phân quyền.
- Việc gán quyền cho vai trò là dữ liệu, không phải logic. Admin có thể sắp xếp lại vai trò nào nhận quyền nào trong CMS mà không cần deploy.
- Middleware chỉ là một hàm duy nhất:

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

Cách dùng trên route:

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### Cay phan quyen (Permission Tree)

Quyền được định nghĩa dưới dạng hằng số lồng nhau — nguồn sự thật duy nhất cho cả việc xác thực backend lẫn hiển thị giao diện frontend:

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

Một hàm tiện ích làm phẳng cây này thành danh sách tất cả các key hợp lệ — dùng cho việc seed database và validation:

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin: nam ngoai cay phan quyen

Một quyết định thiết kế đáng lưu ý: module "System Management" (CRUD tài khoản, CRUD vai trò) *không* nằm trong cây phân quyền. Nó sử dụng một middleware riêng `requireSystemAdmin` kiểm tra danh tính vai trò, không phải permission key:

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

Tại sao? Vì quản lý hệ thống kiểm soát *ai có quyền gì*. Nếu nó nằm trong cây phân quyền, về lý thuyết một vai trò có thể tự cấp thêm quyền cho mình — một lỗ hổng leo thang đặc quyền. Tách riêng ra và gắn với danh tính vai trò ngăn chặn điều này.

## Schema

Để tham khảo, đây là ba bảng hỗ trợ hệ thống này:

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

Cờ `forcePasswordChange` trên `adminUsers` mặc định là `true` — mọi tài khoản mới đều bắt đầu bị khóa sau quy trình đổi mật khẩu.

## Nhung gi toi se lam khac

Hai điều tôi đang theo dõi cho các giai đoạn sau:

1. **Thu hồi token**: Hiện tại chưa có blacklist cho refresh token. Nếu refresh token của ai đó bị lộ, bạn phải đợi nó hết hạn (7 ngày) hoặc xoay JWT secret (điều này sẽ đăng xuất tất cả mọi người). Với một team admin nhỏ, điều này chấp nhận được. Ở quy mô lớn hơn, tôi sẽ thêm danh sách thu hồi được hỗ trợ bởi Redis.

2. **Cache phân quyền**: RBAC middleware truy vấn database mỗi request. Với lượng người dùng hiện tại (< 10 admin), điều này ổn. Nếu tăng lên, tôi sẽ cache bộ quyền theo vai trò trong Redis với TTL ngắn và invalidate khi vai trò được cập nhật.

---

Hệ thống này xử lý 15 endpoint trên 4 module route, được hỗ trợ bởi 53 bài test. Stack đầy đủ là Fastify + TypeScript + Drizzle ORM + PostgreSQL, test với Vitest.
