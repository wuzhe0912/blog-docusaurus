---
slug: fastify-jwt-triple-token-rbac
title: 'Tiga JWT + RBAC di Fastify: Yang Benar-Benar Saya Kirimkan'
authors: wuzhe0912
tags: [engineering]
---

Kebanyakan tutorial JWT hanya menunjukkan satu token, satu route login, dan selesai. Proyek nyata butuh lebih dari itu: refresh token tanpa harus login ulang, paksa ganti password untuk akun baru, dan kontrol akses berbasis peran yang tidak berantakan ketika kebutuhannya jadi aneh.

Baru-baru ini saya mengirimkan layer autentikasi untuk proyek sampingan — backend admin untuk sebuah game RPG komunitas. Tiga peran (Admin, Game Master, Moderator), pohon permission bersarang yang mencakup manajemen pemain dan konten game, serta alur paksa ganti password untuk GM yang baru bergabung. Begini tampilan implementasi sebenarnya di Fastify + Drizzle ORM.

<!--truncate-->

## Tiga Token, tiga tugas

Alih-alih satu JWT, saya menggunakan tiga token dengan masa berlaku dan tujuan berbeda:

| Token | Masa Berlaku | Tujuan |
|-------|--------------|--------|
| Access Token | 8 jam | Autentikasi API — membawa identitas pengguna dan peran (permission dicari saat runtime) |
| Refresh Token | 7 hari | Re-autentikasi tanpa interaksi — ditukar dengan pasangan access + refresh baru |
| Temp Token | 15 menit | Terbatas untuk alur paksa ganti password — tidak bisa digunakan untuk akses API |

Kenapa tidak cukup access + refresh saja? Temp token ada karena kebutuhan UX yang spesifik: ketika admin membuat akun baru dengan password default, login pertama harus memaksa ganti password *sebelum* memberikan akses API apa pun. Sebuah temp token dengan scope `password_change` menangani ini tanpa mengotori tanggung jawab access token.

Satu catatan: temp token ini tidak benar-benar sekali pakai — dalam jendela 15 menitnya, secara teori bisa di-replay untuk melewati pengecekan password saat ini lagi. Dalam praktiknya, flag `forcePasswordChange` di-set ke `false` pada pergantian pertama yang berhasil, jadi login berikutnya tidak akan menerbitkan temp token baru. Tapi jika Anda butuh jaminan lebih ketat, Anda perlu menambahkan server-side nonce atau blacklist token setelah penggunaan pertama.

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

Setiap tipe token menggunakan secret yang berbeda (diturunkan dari base secret dengan akhiran). Ini berarti refresh token tidak pernah bisa digunakan sebagai access token, meskipun seseorang mencoba — verifikasi gagal di level kriptografi, bukan hanya di level payload.

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

Payload refresh token sengaja dibuat minimal — hanya `sub`. Tidak membawa data peran atau permission, karena hal-hal tersebut bisa berubah antara saat token diterbitkan dan saat refresh. Ketika client mengirim permintaan refresh, server selalu membaca ulang peran terkini pengguna dari database sebelum menandatangani access token baru. Ini mempersempit jendela permission yang kedaluwarsa menjadi sebatas masa berlaku access token (8 jam) bukan refresh token (7 hari). Tidak sempurna — jika peran admin diturunkan, mereka tetap memiliki level akses lama sampai access token saat ini kedaluwarsa. Untuk tim kecil ini trade-off yang bisa diterima; pada skala besar Anda perlu daftar pencabutan atau TTL access token yang lebih pendek.

## Alur paksa ganti password

Berikut alur yang dimungkinkan oleh temp token:

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

Detail kuncinya: endpoint `change-password` menerima *baik* temp token maupun access token biasa. Untuk temp token, pengecekan "verifikasi password saat ini" dilewati (karena pengguna sudah terautentikasi lewat login). Untuk access token, password saat ini wajib sebagai konfirmasi.

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

Setelah ganti password berhasil, server langsung mengembalikan access + refresh token baru. Client tidak perlu memanggil `/login` lagi — mereka sudah masuk.

## Auth Middleware: selalu verifikasi keberadaan

Jalan pintas yang umum: verifikasi tanda tangan JWT lalu percaya payload-nya. Ini rusak ketika admin dihapus sementara token-nya masih berlaku.

Middleware di sini selalu mengecek database:

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

Ya, ini menambah satu query database per request yang terautentikasi. Dengan access token 8 jam, saya menganggap ini trade-off yang bisa diterima. Jika masa berlaku token lebih pendek (misalnya 15 menit), bisa diargumentasikan bahwa cukup percaya payload saja.

## RBAC: Permission Key, bukan nama peran

Sistem permission menggunakan string key (`dashboard.total_players`, `quests.list.export`) alih-alih mengecek nama peran. Ini berarti:

- RBAC middleware tidak pernah berubah — selalu "apakah peran ini punya key ini?" Menambah fitur baru cukup menambahkan key ke konstanta pohon permission dan sebuah migration, bukan menulis ulang logika otorisasi.
- Penugasan permission ke peran adalah data, bukan logika. Admin bisa mengatur ulang peran mana mendapat permission apa di CMS tanpa perlu deploy.
- Middleware-nya hanya satu fungsi:

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

Penggunaan pada route:

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### Pohon Permission (Permission Tree)

Permission didefinisikan sebagai konstanta bersarang — satu-satunya sumber kebenaran untuk validasi backend maupun rendering UI frontend:

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

Sebuah fungsi utilitas meratakan pohon ini menjadi daftar semua key yang valid — digunakan untuk seeding database dan validasi:

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin: di luar pohon permission

Satu keputusan desain yang perlu disorot: modul "System Management" (CRUD akun, CRUD peran) *tidak* ada dalam pohon permission. Modul ini menggunakan middleware terpisah `requireSystemAdmin` yang mengecek identitas peran, bukan permission key:

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

Kenapa? Karena manajemen sistem mengontrol *siapa punya permission apa*. Jika berada di dalam pohon permission, secara teori sebuah peran bisa memberikan lebih banyak permission kepada dirinya sendiri — sebuah vektor eskalasi hak istimewa. Memisahkannya dan mengikatnya ke identitas peran mencegah hal ini.

## Schema

Sebagai referensi, berikut tiga tabel yang mendukung sistem ini:

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

Flag `forcePasswordChange` pada `adminUsers` default-nya `true` — setiap akun baru dimulai dalam keadaan terkunci di balik alur ganti password.

## Yang akan saya lakukan berbeda

Dua hal yang saya pantau untuk tahap selanjutnya:

1. **Pencabutan token**: Saat ini belum ada blacklist untuk refresh token. Jika refresh token seseorang bocor, Anda harus menunggu sampai kedaluwarsa (7 hari) atau merotasi JWT secret (yang akan me-logout semua orang). Untuk tim admin kecil, ini bisa diterima. Pada skala besar, saya akan menambahkan daftar pencabutan yang didukung Redis.

2. **Cache permission**: RBAC middleware menghantam database di setiap request. Dengan basis pengguna saat ini (< 10 admin), ini tidak masalah. Jika bertambah, saya akan meng-cache set permission per peran di Redis dengan TTL pendek dan melakukan invalidasi saat peran diperbarui.

---

Sistem ini menangani 15 endpoint di 4 modul route, didukung oleh 53 test. Stack lengkapnya adalah Fastify + TypeScript + Drizzle ORM + PostgreSQL, ditest dengan Vitest.
