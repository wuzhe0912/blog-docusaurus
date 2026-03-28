---
slug: fastify-jwt-triple-token-rbac
title: 'Trois JWT + RBAC dans Fastify : ce que j''ai réellement livré'
authors: wuzhe0912
tags: [engineering]
---

La plupart des tutoriels JWT vous montrent un seul token, une route de login, et basta. Les vrais projets exigent davantage : renouvellement de token sans re-login, changement de mot de passe forcé pour les nouveaux comptes, et un contrôle d'accès basé sur les rôles qui ne s'effondre pas quand les exigences deviennent bizarres.

J'ai récemment livré la couche d'authentification d'un projet personnel — le backend admin d'un RPG communautaire. Trois rôles (Admin, Game Master, Moderator), un arbre de permissions imbriqué couvrant la gestion des joueurs et le contenu du jeu, et un flux de changement de mot de passe forcé pour les GMs nouvellement intégrés. Voici ce que l'implémentation donne concrètement avec Fastify + Drizzle ORM.

<!--truncate-->

## Trois tokens, trois missions

Au lieu d'un seul JWT, j'en utilise trois avec des durées de vie et des objectifs différents :

| Token | Durée de vie | Objectif |
|-------|-------------|----------|
| Access Token | 8 heures | Authentification API — porte l'identité et le rôle de l'utilisateur (les permissions sont vérifiées au runtime) |
| Refresh Token | 7 jours | Ré-authentification silencieuse — s'échange contre une nouvelle paire Access + Refresh |
| Temp Token | 15 minutes | Limité au flux de changement de mot de passe forcé — ne peut pas servir pour l'accès API |

Pourquoi ne pas se contenter d'Access + Refresh ? Le Temp Token existe en raison d'une exigence UX spécifique : quand un admin crée un nouveau compte avec un mot de passe par défaut, le premier login doit forcer un changement de mot de passe *avant* d'accorder le moindre accès API. Un Temp Token scopé à `password_change` gère cela sans polluer les responsabilités de l'Access Token.

Une nuance : le Temp Token n'est pas réellement à usage unique — dans sa fenêtre de 15 minutes, il pourrait théoriquement être rejoué pour contourner à nouveau la vérification du mot de passe actuel. En pratique, le flag `forcePasswordChange` passe à `false` dès le premier changement réussi, donc les logins suivants n'émettront pas de nouveau Temp Token. Mais si vous avez besoin de garanties plus strictes, il faudrait ajouter un nonce côté serveur ou blacklister le token après la première utilisation.

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

Chaque type de token utilise un secret différent (dérivé d'un secret de base avec des suffixes). Cela signifie qu'un Refresh Token ne peut jamais être utilisé comme Access Token, même si quelqu'un essaie — la vérification échoue au niveau cryptographique, pas seulement au niveau du payload.

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

Le payload du Refresh Token est volontairement minimal — juste `sub`. Il ne contient ni rôle ni données de permissions, car ceux-ci peuvent changer entre l'émission et le renouvellement du token. Quand le client envoie une requête de refresh, le serveur relit toujours le rôle actuel de l'utilisateur depuis la base de données avant de signer un nouveau Access Token. Cela réduit la fenêtre de permissions obsolètes à la durée de vie de l'Access Token (8 heures) plutôt qu'à celle du Refresh Token (7 jours). Ce n'est pas parfait — si le rôle d'un admin est rétrogradé, il conserve son ancien niveau d'accès jusqu'à l'expiration de l'Access Token en cours. Pour une petite équipe, c'est un compromis acceptable ; à grande échelle, il faudrait une liste de révocation ou une TTL d'Access Token plus courte.

## Le flux de changement de mot de passe forcé

Voici le flux que le Temp Token rend possible :

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

Le détail clé : l'endpoint `change-password` accepte *aussi bien* les Temp Tokens que les Access Tokens classiques. Pour les Temp Tokens, il saute la vérification du mot de passe actuel (puisque l'utilisateur s'est déjà authentifié via le login). Pour les Access Tokens, il exige le mot de passe actuel comme confirmation.

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

Après un changement de mot de passe réussi, le serveur renvoie immédiatement de nouveaux tokens Access + Refresh. Le client n'a jamais besoin de rappeler `/login` — il est déjà connecté.

## Auth Middleware : toujours vérifier l'existence

Un raccourci courant : vérifier la signature JWT et faire confiance au payload. Cela casse quand un admin est supprimé alors que son token est encore valide.

La middleware ici vérifie toujours la base de données :

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

Oui, cela ajoute une requête en base par requête authentifiée. Avec un Access Token de 8 heures, j'ai considéré cela comme un compromis acceptable. Si la durée de vie du token était plus courte (disons 15 minutes), on pourrait défendre l'idée de faire confiance au payload seul.

## RBAC : Permission Keys, pas des noms de rôles

Le système de permissions utilise des clés sous forme de chaînes (`dashboard.total_players`, `quests.list.export`) au lieu de vérifier des noms de rôles. Cela signifie :

- La middleware RBAC ne change jamais — c'est toujours « est-ce que ce rôle possède cette clé ? ». Ajouter une nouvelle fonctionnalité revient à ajouter une clé à la constante du Permission Tree et une migration, pas à réécrire la logique d'autorisation.
- Les associations rôle-permissions sont des données, pas de la logique. Un admin peut réorganiser quelles permissions vont à quel rôle dans le CMS sans déploiement.
- La middleware est une seule fonction :

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

Utilisation sur une route :

```typescript
app.get('/admin/players', {
  preHandler: [authAdmin, rbac('players.list')]
}, listPlayersHandler)
```

### Le Permission Tree

Les permissions sont définies comme une constante imbriquée — la source de vérité unique pour la validation backend et le rendu de l'interface frontend :

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

Une fonction utilitaire aplatit cet arbre en une liste de toutes les clés valides — utilisée pour le seeding de la base de données et la validation :

```typescript
function flattenKeys(nodes: readonly PermNode[]): string[] {
  return nodes.flatMap((n) =>
    n.children ? [n.key, ...flattenKeys(n.children)] : [n.key],
  )
}
export const ALL_PERMISSION_KEYS = flattenKeys(PERMISSION_TREE)
```

### System Admin : en dehors du Permission Tree

Une décision de conception qui mérite d'être soulignée : le module « Gestion système » (CRUD des comptes, CRUD des rôles) n'est *pas* dans le Permission Tree. Il utilise une middleware `requireSystemAdmin` séparée qui vérifie l'identité du rôle, pas les Permission Keys :

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

Pourquoi ? Parce que la gestion système contrôle *qui détient quelles permissions*. Si elle se trouvait dans le Permission Tree, un rôle pourrait théoriquement s'attribuer davantage de permissions — un vecteur d'escalade de privilèges. La maintenir à l'extérieur et la lier à l'identité du rôle empêche cela.

## Schema

Pour référence, voici les trois tables qui soutiennent ce système :

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

Le flag `forcePasswordChange` sur `adminUsers` est à `true` par défaut — chaque nouveau compte démarre verrouillé derrière le flux de changement de mot de passe.

## Ce que je ferais différemment

Deux points que je surveille pour les phases suivantes :

1. **Révocation de tokens** : Actuellement, il n'y a pas de blacklist pour les Refresh Tokens. Si le Refresh Token de quelqu'un est compromis, il faut attendre son expiration (7 jours) ou faire une rotation du secret JWT (ce qui déconnecte tout le monde). Pour une petite équipe d'admins, c'est acceptable. A grande échelle, j'ajouterais une liste de révocation adossée à Redis.

2. **Cache des permissions** : La middleware RBAC interroge la base de données à chaque requête. Avec la base d'utilisateurs actuelle (< 10 admins), ça va. Si elle grossit, je cacherais l'ensemble des permissions par rôle dans Redis avec une TTL courte, avec invalidation à chaque mise à jour de rôle.

---

Ce système gère 15 endpoints répartis sur 4 modules de routes, couverts par 53 tests. La stack complète est Fastify + TypeScript + Drizzle ORM + PostgreSQL, testée avec Vitest.
