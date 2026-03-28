---
slug: fastify-jwt-triple-token-rbac
title: 'Tre JWT + RBAC in Fastify: cosa ho effettivamente rilasciato'
authors: wuzhe0912
tags: [engineering]
---

La maggior parte dei tutorial sui JWT ti mostra un singolo token, una rotta di login e finisce lì. I progetti reali richiedono di più: refresh del token senza richiedere un nuovo login, cambio password forzato per i nuovi account, controllo degli accessi basato sui ruoli che non si sfaldi quando i requisiti diventano particolari.

Di recente ho rilasciato il layer di autenticazione per un progetto personale — il backend amministrativo per un RPG di community. Tre ruoli (Admin, Game Master, Moderator), un albero di permessi annidato che copre la gestione dei giocatori e dei contenuti di gioco, e un flusso di cambio password forzato per i GM appena inseriti. Ecco come si presenta concretamente l'implementazione in Fastify + Drizzle ORM.

<!--truncate-->

## Tre Token, tre compiti

Invece di un singolo JWT, ne utilizzo tre con durate e scopi diversi:

| Token | Durata | Scopo |
|-------|--------|-------|
| Access Token | 8 ore | Autenticazione API — contiene l'identità dell'utente e il ruolo (i permessi vengono verificati a runtime) |
| Refresh Token | 7 giorni | Re-autenticazione silenziosa — viene scambiato per una nuova coppia access + refresh |
| Temp Token | 15 minuti | Limitato al flusso di cambio password forzato — non può essere usato per l'accesso API |

Perché non usare solo access + refresh? Il Temp Token esiste per un requisito UX specifico: quando un admin crea un nuovo account con una password di default, il primo login deve forzare il cambio password *prima* di concedere qualsiasi accesso API. Un Temp Token con scope `password_change` gestisce questo senza inquinare le responsabilità dell'Access Token.

Un'avvertenza: il Temp Token non è veramente monouso — entro la sua finestra di 15 minuti, potrebbe teoricamente essere riutilizzato per bypassare nuovamente il controllo della password corrente. In pratica, il flag `forcePasswordChange` viene impostato a `false` al primo cambio riuscito, quindi i login successivi non emetteranno un nuovo Temp Token. Ma se servono garanzie più rigide, si potrebbe aggiungere un nonce lato server o invalidare il token dopo il primo utilizzo.

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

Ogni tipo di token utilizza un secret diverso (derivato da un secret base con suffissi). Questo significa che un Refresh Token non potrà mai essere usato come Access Token, anche se qualcuno ci prova — la verifica fallisce a livello crittografico, non solo a livello di payload.

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

Il payload del Refresh Token è volutamente minimale — solo `sub`. Non porta dati su ruolo o permessi, perché questi potrebbero cambiare tra l'emissione del token e il refresh. Quando il client invia una richiesta di refresh, il server rilegge sempre il ruolo corrente dell'utente dal database prima di firmare un nuovo Access Token. Questo restringe la finestra di permessi obsoleti alla durata dell'Access Token (8 ore) anziché a quella del Refresh Token (7 giorni). Non è perfetto — se il ruolo di un admin viene declassato, mantiene il vecchio livello di accesso fino alla scadenza dell'Access Token corrente. Per un piccolo team è un compromesso accettabile; su larga scala si vorrebbe una lista di revoca o un TTL più breve per l'Access Token.

## Il flusso di cambio password forzato

Ecco il flusso che il Temp Token rende possibile:

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

Il dettaglio chiave: l'endpoint `change-password` accetta *sia* Temp Token che Access Token regolari. Per i Temp Token, salta il controllo "verifica password corrente" (dato che l'utente è già stato autenticato tramite il login). Per gli Access Token, richiede la password corrente come conferma.

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

Dopo un cambio password riuscito, il server restituisce immediatamente nuovi Access Token e Refresh Token. Il client non ha bisogno di richiamare `/login` — è già dentro.

## Auth Middleware: verificare sempre l'esistenza

Una scorciatoia comune: verificare la firma del JWT e fidarsi del payload. Questo si rompe quando un admin viene eliminato mentre il suo token è ancora valido.

Il middleware qui controlla sempre il database:

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

Sì, questo aggiunge una query al database per ogni richiesta autenticata. Con un Access Token di 8 ore, ho considerato questo un compromesso accettabile. Se la durata del token fosse più breve (diciamo 15 minuti), si potrebbe argomentare a favore del fidarsi solo del payload.

## RBAC: chiavi di permesso, non nomi di ruolo

Il sistema di permessi utilizza chiavi stringa (`dashboard.total_players`, `quests.list.export`) invece di verificare i nomi dei ruoli. Questo significa:

- Il middleware RBAC non cambia mai — è sempre "questo ruolo ha questa chiave?". Aggiungere una nuova funzionalità significa aggiungere una chiave alla costante dell'albero dei permessi e una migration, non riscrivere la logica di autorizzazione.
- Le assegnazioni ruolo-permesso sono dati, non logica. Un admin può riorganizzare quali permessi ha ciascun ruolo nel CMS senza un deploy.
- Il middleware è una singola funzione:

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

Utilizzo su una rotta:

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### L'albero dei permessi

I permessi sono definiti come una costante annidata — l'unica fonte di verità sia per la validazione backend che per il rendering dell'interfaccia frontend:

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

Una funzione utility appiattisce questo albero in una lista di tutte le chiavi valide — usata per il seeding del database e per la validazione:

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin: fuori dall'albero dei permessi

Una decisione di design che vale la pena evidenziare: il modulo "System Management" (CRUD account, CRUD ruoli) *non* è nell'albero dei permessi. Utilizza un middleware `requireSystemAdmin` separato che verifica l'identità del ruolo, non le chiavi di permesso:

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

Perché? Perché la gestione del sistema controlla *chi ha quali permessi*. Se fosse dentro l'albero dei permessi, un ruolo potrebbe teoricamente assegnarsi più permessi — un vettore di escalation dei privilegi. Tenerlo fuori e legato all'identità del ruolo previene questo problema.

## Schema

Per riferimento, ecco le tre tabelle che supportano questo sistema:

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

Il flag `forcePasswordChange` su `adminUsers` ha come valore predefinito `true` — ogni nuovo account parte bloccato dietro il flusso di cambio password.

## Cosa farei diversamente

Due cose che sto monitorando per le fasi successive:

1. **Revoca dei token**: Al momento non c'è una blacklist per i Refresh Token. Se il Refresh Token di qualcuno viene compromesso, bisogna aspettare che scada (7 giorni) o ruotare il secret JWT (che disconnette tutti). Per un piccolo team admin, è accettabile. Su larga scala, aggiungerei una lista di revoca con Redis.

2. **Cache dei permessi**: Il middleware RBAC interroga il database ad ogni richiesta. Con la base utenti attuale (< 10 admin), va bene. Se crescesse, metterei in cache il set di permessi per ruolo in Redis con un TTL breve e lo invaliderei all'aggiornamento del ruolo.

---

Questo sistema gestisce 15 endpoint distribuiti su 4 moduli di rotte, supportato da 53 test. Lo stack completo è Fastify + TypeScript + Drizzle ORM + PostgreSQL, testato con Vitest.
