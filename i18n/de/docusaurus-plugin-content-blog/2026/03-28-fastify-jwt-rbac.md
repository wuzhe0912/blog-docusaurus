---
slug: fastify-jwt-triple-token-rbac
title: 'Drei JWTs + RBAC in Fastify: Was ich tatsächlich ausgeliefert habe'
authors: wuzhe0912
tags: [engineering]
---

Die meisten JWT-Tutorials zeigen dir ein einzelnes Token, eine Login-Route und das war's. Echte Projekte brauchen mehr: Token-Erneuerung ohne erneuten Login, erzwungene Passwortänderung bei neuen Konten und eine rollenbasierte Zugriffskontrolle, die nicht auseinanderfällt, sobald die Anforderungen seltsam werden.

Ich habe kürzlich die Auth-Schicht für ein Nebenprojekt ausgeliefert — das Admin-Backend für ein Community-RPG. Drei Rollen (Admin, Game Master, Moderator), ein verschachtelter Berechtigungsbaum für Spielerverwaltung und Spielinhalte, und ein erzwungener Passwortänderungs-Flow für neu eingeführte GMs. So sieht die Implementierung in Fastify + Drizzle ORM tatsächlich aus.

<!--truncate-->

## Drei Tokens, drei Aufgaben

Statt eines einzigen JWT verwende ich drei mit unterschiedlichen Laufzeiten und Zwecken:

| Token | Laufzeit | Zweck |
|-------|----------|-------|
| Access Token | 8 Stunden | API-Authentifizierung — enthält Benutzeridentität und Rolle (Berechtigungen werden zur Laufzeit nachgeschlagen) |
| Refresh Token | 7 Tage | Stille Neuauthentifizierung — tauscht sich gegen ein neues Access + Refresh Paar |
| Temp Token | 15 Minuten | Beschränkt auf den erzwungenen Passwortänderungs-Flow — kann nicht für API-Zugriff verwendet werden |

Warum nicht einfach Access + Refresh? Das Temp Token existiert wegen einer bestimmten UX-Anforderung: Wenn ein Admin ein neues Konto mit einem Standardpasswort erstellt, soll der erste Login eine Passwortänderung erzwingen, *bevor* irgendeinen API-Zugriff gewährt wird. Ein Temp Token mit dem Scope `password_change` erledigt das, ohne die Verantwortlichkeiten des Access Tokens zu verwässern.

Ein Vorbehalt: Das Temp Token ist nicht wirklich einmalig verwendbar — innerhalb seines 15-Minuten-Fensters könnte es theoretisch erneut abgespielt werden, um die aktuelle Passwortprüfung zu umgehen. In der Praxis wird das `forcePasswordChange`-Flag bei der ersten erfolgreichen Änderung auf `false` gesetzt, sodass nachfolgende Logins kein neues Temp Token ausstellen. Wenn du aber strengere Garantien brauchst, würdest du eine serverseitige Nonce hinzufügen oder das Token nach dem ersten Gebrauch auf eine Blacklist setzen.

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

Jeder Token-Typ verwendet ein eigenes Secret (abgeleitet von einem Basis-Secret mit Suffixen). Das bedeutet, ein Refresh Token kann niemals als Access Token verwendet werden, selbst wenn jemand es versucht — die Verifikation scheitert auf kryptografischer Ebene, nicht nur auf Payload-Ebene.

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

Der Payload des Refresh Tokens ist bewusst minimal — nur `sub`. Er enthält keine Rollen- oder Berechtigungsdaten, weil sich diese zwischen Token-Ausstellung und Erneuerung ändern könnten. Wenn der Client eine Refresh-Anfrage sendet, liest der Server immer die aktuelle Rolle des Benutzers aus der Datenbank, bevor er ein neues Access Token signiert. Das verengt das Fenster veralteter Berechtigungen auf die Lebensdauer des Access Tokens (8 Stunden) statt auf die des Refresh Tokens (7 Tage). Perfekt ist das nicht — wenn die Rolle eines Admins herabgestuft wird, behält er seine alte Zugriffsebene, bis das aktuelle Access Token abläuft. Für ein kleines Team ist das ein akzeptabler Kompromiss; bei größerem Maßstab bräuchte man eine Widerrufsliste oder eine kürzere Access Token TTL.

## Der erzwungene Passwortänderungs-Flow

So sieht der Flow aus, den das Temp Token ermöglicht:

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

Das entscheidende Detail: Der `change-password` Endpoint akzeptiert *sowohl* Temp Tokens als auch reguläre Access Tokens. Bei Temp Tokens wird die Prüfung des aktuellen Passworts übersprungen (da der Benutzer sich bereits über den Login authentifiziert hat). Bei Access Tokens wird das aktuelle Passwort als Bestätigung verlangt.

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

Nach einer erfolgreichen Passwortänderung gibt der Server sofort neue Access + Refresh Tokens zurück. Der Client muss nie erneut `/login` aufrufen — er ist bereits drin.

## Auth Middleware: Existenz immer verifizieren

Eine häufige Abkürzung: JWT-Signatur verifizieren und dem Payload vertrauen. Das bricht zusammen, wenn ein Admin gelöscht wird, während sein Token noch gültig ist.

Die Middleware hier prüft immer die Datenbank:

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

Ja, das fügt pro authentifizierter Anfrage eine Datenbankabfrage hinzu. Bei einem 8-Stunden Access Token halte ich das für einen akzeptablen Kompromiss. Wäre die Token-Laufzeit kürzer (sagen wir 15 Minuten), könnte man argumentieren, dem Payload allein zu vertrauen.

## RBAC: Permission Keys statt Rollennamen

Das Berechtigungssystem verwendet String-Keys (`dashboard.total_players`, `quests.list.export`) statt Rollennamen zu prüfen. Das bedeutet:

- Die RBAC Middleware ändert sich nie — es ist immer die Frage „Hat diese Rolle diesen Key?". Ein neues Feature hinzuzufügen heißt, einen Key zur Permission-Tree-Konstante und einer Migration hinzuzufügen, nicht die Autorisierungslogik umzuschreiben.
- Rollen-zu-Berechtigungs-Zuordnungen sind Daten, keine Logik. Ein Admin kann im CMS umordnen, welche Rolle welche Berechtigungen bekommt — ohne Deployment.
- Die Middleware ist eine einzige Funktion:

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

Verwendung an einer Route:

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### Der Permission Tree

Berechtigungen werden als verschachtelte Konstante definiert — die einzige Wahrheitsquelle sowohl für die Backend-Validierung als auch das Frontend-UI-Rendering:

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

Eine Hilfsfunktion flacht diesen Baum in eine Liste aller gültigen Keys ab — verwendet zum Seeding der Datenbank und zur Validierung:

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin: Außerhalb des Permission Trees

Eine erwähnenswerte Designentscheidung: Das Modul „Systemverwaltung" (Account-CRUD, Rollen-CRUD) befindet sich *nicht* im Permission Tree. Es verwendet eine separate `requireSystemAdmin` Middleware, die die Rollenidentität prüft, nicht die Permission Keys:

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

Warum? Weil die Systemverwaltung kontrolliert, *wer welche Berechtigungen hat*. Wäre sie innerhalb des Permission Trees, könnte eine Rolle sich theoretisch selbst mehr Berechtigungen zuweisen — ein Vektor für Rechteeskalation. Sie außerhalb zu halten und an die Rollenidentität zu binden, verhindert das.

## Schema

Zur Referenz hier die drei Tabellen, auf denen dieses System basiert:

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

Das `forcePasswordChange`-Flag auf `adminUsers` ist standardmäßig `true` — jedes neue Konto startet hinter dem Passwortänderungs-Flow gesperrt.

## Was ich anders machen würde

Zwei Dinge, die ich für spätere Phasen im Auge behalte:

1. **Token-Widerruf**: Aktuell gibt es keine Refresh Token Blacklist. Wenn jemandes Refresh Token kompromittiert wird, muss man warten, bis es abläuft (7 Tage), oder das JWT Secret rotieren (was alle ausloggt). Für ein kleines Admin-Team ist das akzeptabel. Bei größerem Maßstab würde ich eine Redis-gestützte Widerrufsliste hinzufügen.

2. **Permission Caching**: Die RBAC Middleware fragt bei jeder Anfrage die Datenbank ab. Bei der aktuellen Nutzerbasis (< 10 Admins) ist das kein Problem. Wenn sie wächst, würde ich den Berechtigungssatz pro Rolle in Redis mit einer kurzen TTL cachen und bei Rollenänderungen invalidieren.

---

Dieses System bedient 15 Endpoints über 4 Route-Module, abgesichert durch 53 Tests. Der vollständige Stack ist Fastify + TypeScript + Drizzle ORM + PostgreSQL, getestet mit Vitest.
