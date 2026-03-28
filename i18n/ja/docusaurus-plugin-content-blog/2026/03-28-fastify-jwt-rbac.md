---
slug: fastify-jwt-triple-token-rbac
title: 'Fastify 実践：3つのJWT + RBAC権限ツリー'
authors: wuzhe0912
tags: [engineering]
---

JWT のチュートリアルの大半は、トークンを1つ作ってログインルートを書いたら終わり。実際のプロジェクトではそれだけでは足りない。再ログインなしのトークンリフレッシュ、新規アカウントへのパスワード強制変更、要件が複雑になっても崩れないロールベースのアクセス制御が必要になる。

最近、サイドプロジェクトの認証レイヤーを実装した。コミュニティ RPG の管理画面バックエンドで、3つのロール（Admin、Game Master、Moderator）、プレイヤー管理とゲームコンテンツをカバーするネストされた権限ツリー、そして新しくオンボーディングされた GM 向けのパスワード強制変更フローがある。Fastify + Drizzle ORM での実装を紹介する。

<!--truncate-->

## 3つのトークン、3つの役割

JWT を1つだけ使うのではなく、有効期間と用途が異なる3つを使い分ける：

| トークン | 有効期間 | 用途 |
|---------|---------|------|
| Access Token | 8時間 | API 認証 — ユーザー ID とロールを保持（権限は実行時にルックアップ） |
| Refresh Token | 7日間 | サイレント再認証 — 新しい Access Token + Refresh Token のペアと交換 |
| Temp Token | 15分 | パスワード強制変更フロー専用 — API アクセスには使用不可 |

なぜ Access Token + Refresh Token だけではダメなのか？ Temp Token が存在するのは、特定の UX 要件があるからだ。管理者がデフォルトパスワードで新規アカウントを作成した場合、初回ログイン時に API アクセスを許可する*前に*パスワード変更を強制する必要がある。`password_change` にスコープされた Temp Token がこれを担い、Access Token の責務を汚さずに済む。

注意点が1つ：Temp Token は厳密には1回限りではない。15分のウィンドウ内では、理論上は再利用して現在のパスワードチェックを再度バイパスできる。実際には、最初の変更成功時に `forcePasswordChange` フラグが `false` になるため、以降のログインでは新しい Temp Token は発行されない。より厳密な保証が必要な場合は、サーバーサイドの nonce を追加するか、初回使用後にトークンをブラックリストに入れる必要がある。

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

各トークンタイプはそれぞれ異なるシークレット（ベースシークレットにサフィックスを付加して派生）を使用する。これにより、Refresh Token を Access Token として使おうとしても、ペイロードレベルではなく暗号レベルで検証に失敗する。

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

Refresh Token のペイロードは意図的に最小限にしている — `sub` のみ。ロールや権限データは含めない。トークン発行からリフレッシュまでの間にそれらが変更される可能性があるからだ。クライアントがリフレッシュリクエストを送信すると、サーバーは新しい Access Token に署名する前に、必ずデータベースからユーザーの現在のロールを再読み込みする。これにより、古い権限のウィンドウが Refresh Token の有効期間（7日間）ではなく、Access Token の有効期間（8時間）に狭まる。完璧ではない — 管理者のロールがダウングレードされた場合、現在の Access Token が期限切れになるまで旧アクセスレベルが維持される。小規模チームではこれは許容範囲内だが、大規模では失効リストやより短い Access Token の TTL が必要になる。

## パスワード強制変更フロー

Temp Token が実現するフローは以下の通り：

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

重要なポイント：`change-password` エンドポイントは Temp Token と通常の Access Token の*両方*を受け付ける。Temp Token の場合は「現在のパスワードを確認」するチェックをスキップする（ユーザーはログインで既に認証済みのため）。Access Token の場合は、確認として現在のパスワードを要求する。

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

パスワード変更が成功すると、サーバーは即座に新しい Access Token + Refresh Token を返す。クライアントは再度 `/login` を呼ぶ必要がない — 既にログイン済みの状態になる。

## 認証 Middleware：存在確認を必ず行う

よくあるショートカット：JWT の署名を検証してペイロードを信頼する。これは、トークンがまだ有効な状態で管理者が削除された場合に破綻する。

ここでの middleware は必ずデータベースを確認する：

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

確かに、認証済みリクエストごとにデータベースクエリが1回追加される。Access Token の有効期間が8時間であることを考慮して、許容範囲内と判断した。トークンの有効期間がもっと短い場合（例えば15分）、ペイロードだけを信頼するという議論も成り立つだろう。

## RBAC：ロール名ではなく権限キー

権限システムはロール名のチェックではなく、文字列キー（`dashboard.total_players`、`quests.list.export`）を使用する。これにより：

- RBAC middleware は変更不要 — 常に「このロールにこのキーがあるか？」を確認するだけ。新機能の追加は、権限ツリー定数へのキー追加とマイグレーションだけで、認可ロジックの書き換えは不要。
- ロールと権限の割り当てはロジックではなくデータ。管理者はデプロイなしで、CMS 上でどのロールにどの権限を付与するか再編成できる。
- middleware は単一の関数：

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

ルートでの使用例：

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### 権限ツリー

権限はネストされた定数として定義される — バックエンドのバリデーションとフロントエンドの UI レンダリング双方の単一の信頼できるソース：

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

ユーティリティ関数がこのツリーをフラット化して全有効キーのリストにする — データベースのシーディングとバリデーションに使用される：

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin：権限ツリーの外側

ここで強調すべき設計判断が1つある。「システム管理」モジュール（アカウント CRUD、ロール CRUD）は権限ツリーに含まれて*いない*。権限キーではなくロールの ID をチェックする別の `requireSystemAdmin` middleware を使用する：

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

なぜか？ システム管理は*誰がどの権限を持つか*を制御するからだ。もし権限ツリーの中にあったら、ロールが自分自身により多くの権限を付与できてしまう — 権限昇格の攻撃ベクトルだ。ツリーの外側に置き、ロール ID に紐づけることでこれを防ぐ。

## スキーマ

参考として、このシステムを支える3つのテーブルを示す：

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

`adminUsers` の `forcePasswordChange` フラグはデフォルトで `true` — すべての新規アカウントはパスワード変更フローの裏側でロックされた状態で始まる。

## 今後改善したい点

後のフェーズで注視している点が2つある：

1. **トークン失効**：現状、Refresh Token のブラックリストがない。誰かの Refresh Token が漏洩した場合、期限切れを待つ（7日間）か、JWT シークレットをローテーションする（全員がログアウトされる）しかない。小規模な管理チームであれば許容範囲内だが、大規模では Redis ベースの失効リストを追加する。

2. **権限キャッシュ**：RBAC middleware はリクエストごとにデータベースにアクセスする。現在のユーザー数（管理者10人未満）では問題ない。規模が拡大したら、ロールごとの権限セットを短い TTL で Redis にキャッシュし、ロール更新時に無効化する。

---

このシステムは4つのルートモジュールにまたがる15のエンドポイントを処理し、53のテストに支えられている。フルスタックは Fastify + TypeScript + Drizzle ORM + PostgreSQL で、テストには Vitest を使用している。
