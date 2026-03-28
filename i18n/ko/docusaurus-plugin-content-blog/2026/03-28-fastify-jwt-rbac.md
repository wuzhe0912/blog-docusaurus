---
slug: fastify-jwt-triple-token-rbac
title: 'Fastify 실전: 3개의 JWT + RBAC 권한 트리'
authors: wuzhe0912
tags: [engineering]
---

대부분의 JWT 튜토리얼은 토큰 하나 만들고, 로그인 라우트 작성하면 끝이다. 실제 프로젝트에서는 그것만으로 부족하다. 재로그인 없는 토큰 갱신, 신규 계정의 비밀번호 강제 변경, 요구사항이 복잡해져도 무너지지 않는 역할 기반 접근 제어가 필요하다.

최근 사이드 프로젝트의 인증 레이어를 구현했다. 커뮤니티 RPG의 어드민 백엔드로, 3개의 역할(Admin, Game Master, Moderator), 플레이어 관리와 게임 콘텐츠를 다루는 중첩된 권한 트리, 그리고 새로 온보딩된 GM을 위한 비밀번호 강제 변경 플로우가 있다. Fastify + Drizzle ORM에서의 실제 구현을 공유한다.

<!--truncate-->

## 3개의 토큰, 3가지 역할

JWT를 하나만 쓰는 대신, 유효 기간과 용도가 다른 3개를 사용한다:

| 토큰 | 유효 기간 | 용도 |
|------|----------|------|
| Access Token | 8시간 | API 인증 — 사용자 ID와 역할을 포함(권한은 런타임에 조회) |
| Refresh Token | 7일 | 자동 재인증 — 새로운 Access Token + Refresh Token 쌍으로 교환 |
| Temp Token | 15분 | 비밀번호 강제 변경 플로우 전용 — API 접근에는 사용 불가 |

왜 Access Token + Refresh Token만으로는 안 되는가? Temp Token은 특정 UX 요구사항 때문에 존재한다. 관리자가 기본 비밀번호로 신규 계정을 생성하면, 첫 로그인 시 API 접근을 허용하기 *전에* 비밀번호 변경을 강제해야 한다. `password_change`로 스코프된 Temp Token이 이를 처리하며, Access Token의 책임을 오염시키지 않는다.

주의할 점이 하나 있다. Temp Token은 엄밀히 말해 일회용이 아니다. 15분 윈도우 내에서 이론적으로 재사용하여 현재 비밀번호 검증을 다시 우회할 수 있다. 실제로는 첫 번째 변경 성공 시 `forcePasswordChange` 플래그가 `false`로 설정되므로, 이후 로그인에서는 새로운 Temp Token이 발급되지 않는다. 더 엄격한 보장이 필요하다면, 서버 측 nonce를 추가하거나 첫 사용 후 토큰을 블랙리스트에 넣어야 한다.

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

각 토큰 타입은 서로 다른 시크릿(기본 시크릿에 접미사를 붙여 파생)을 사용한다. 이로 인해 Refresh Token을 Access Token으로 사용하려 해도 페이로드 레벨이 아닌 암호학 레벨에서 검증이 실패한다.

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

Refresh Token의 페이로드는 의도적으로 최소화했다 — `sub`만 포함한다. 역할이나 권한 데이터는 넣지 않는데, 토큰 발급과 갱신 사이에 변경될 수 있기 때문이다. 클라이언트가 갱신 요청을 보내면, 서버는 새로운 Access Token에 서명하기 전에 반드시 데이터베이스에서 사용자의 현재 역할을 다시 읽는다. 이를 통해 오래된 권한 윈도우가 Refresh Token의 유효 기간(7일)이 아닌 Access Token의 유효 기간(8시간)으로 좁혀진다. 완벽하지는 않다 — 관리자의 역할이 다운그레이드되면, 현재 Access Token이 만료될 때까지 이전 접근 수준이 유지된다. 소규모 팀에서는 허용 가능한 트레이드오프이고, 대규모에서는 취소 목록이나 더 짧은 Access Token TTL이 필요하다.

## 비밀번호 강제 변경 플로우

Temp Token이 가능하게 하는 플로우는 다음과 같다:

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

핵심 포인트: `change-password` 엔드포인트는 Temp Token과 일반 Access Token *모두* 허용한다. Temp Token의 경우, "현재 비밀번호 확인" 검증을 건너뛴다(사용자가 로그인을 통해 이미 인증되었으므로). Access Token의 경우, 확인 차원에서 현재 비밀번호를 요구한다.

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

비밀번호 변경이 성공하면, 서버는 즉시 새로운 Access Token + Refresh Token을 반환한다. 클라이언트는 `/login`을 다시 호출할 필요 없이 이미 로그인된 상태가 된다.

## 인증 Middleware: 반드시 존재 여부를 확인

흔한 지름길: JWT 서명을 검증하고 페이로드를 신뢰한다. 이 방법은 토큰이 아직 유효한 상태에서 관리자가 삭제되면 문제가 생긴다.

여기서의 middleware는 항상 데이터베이스를 확인한다:

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

맞다, 인증된 요청마다 데이터베이스 쿼리가 한 번 추가된다. Access Token의 유효 기간이 8시간인 점을 고려하면 허용 가능한 트레이드오프라고 판단했다. 토큰 유효 기간이 더 짧다면(예를 들어 15분), 페이로드만 신뢰하는 것도 합리적일 수 있다.

## RBAC: 역할 이름이 아닌 권한 키

권한 시스템은 역할 이름을 체크하는 대신 문자열 키(`dashboard.total_players`, `quests.list.export`)를 사용한다. 이를 통해:

- RBAC middleware는 변경할 필요가 없다 — 항상 "이 역할에 이 키가 있는가?"만 확인하면 된다. 새 기능 추가는 권한 트리 상수에 키를 추가하고 마이그레이션하면 되며, 인가 로직을 다시 작성할 필요가 없다.
- 역할과 권한의 할당은 로직이 아닌 데이터이다. 관리자는 배포 없이 CMS에서 어떤 역할에 어떤 권한을 부여할지 재배치할 수 있다.
- middleware는 단일 함수이다:

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

라우트에서의 사용 예시:

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### 권한 트리

권한은 중첩된 상수로 정의된다 — 백엔드 검증과 프론트엔드 UI 렌더링 모두를 위한 단일 진실 공급원:

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

유틸리티 함수가 이 트리를 플래튼하여 모든 유효한 키의 목록으로 만든다 — 데이터베이스 시딩과 검증에 사용된다:

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin: 권한 트리 밖에 위치

여기서 강조할 설계 결정이 하나 있다. "시스템 관리" 모듈(계정 CRUD, 역할 CRUD)은 권한 트리에 포함되어 있지 *않다*. 권한 키가 아닌 역할 ID를 체크하는 별도의 `requireSystemAdmin` middleware를 사용한다:

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

왜 이렇게 했는가? 시스템 관리는 *누가 어떤 권한을 가지는지*를 제어하기 때문이다. 만약 권한 트리 안에 있다면, 역할이 자기 자신에게 더 많은 권한을 부여할 수 있게 되어 권한 상승 공격 벡터가 된다. 트리 밖에 두고 역할 ID에 연결함으로써 이를 방지한다.

## 스키마

참고로, 이 시스템을 뒷받침하는 3개의 테이블은 다음과 같다:

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

`adminUsers`의 `forcePasswordChange` 플래그는 기본값이 `true`이다 — 모든 신규 계정은 비밀번호 변경 플로우 뒤에 잠긴 상태로 시작한다.

## 개선하고 싶은 점

이후 단계에서 주시하고 있는 두 가지가 있다:

1. **토큰 취소**: 현재 Refresh Token 블랙리스트가 없다. 누군가의 Refresh Token이 유출되면, 만료될 때까지(7일) 기다리거나 JWT 시크릿을 로테이션해야 한다(전원 로그아웃됨). 소규모 관리 팀에서는 허용 가능하지만, 대규모에서는 Redis 기반 취소 목록을 추가할 것이다.

2. **권한 캐싱**: RBAC middleware가 요청마다 데이터베이스에 접근한다. 현재 사용자 수(관리자 10명 미만)에서는 문제 없다. 규모가 커지면, 역할별 권한 세트를 짧은 TTL로 Redis에 캐싱하고 역할 업데이트 시 무효화할 것이다.

---

이 시스템은 4개의 라우트 모듈에 걸쳐 15개의 엔드포인트를 처리하며, 53개의 테스트로 뒷받침된다. 풀 스택은 Fastify + TypeScript + Drizzle ORM + PostgreSQL이고, 테스트에는 Vitest를 사용한다.
