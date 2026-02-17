---
title: '[Lv2] Nuxt 3 Rendering Modes : Stratégie de sélection SSR, SSG, CSR'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Comprendre les Rendering Modes de Nuxt 3 et pouvoir sélectionner la stratégie de rendu appropriée (SSR, SSG, CSR) en fonction des besoins du projet.

---

## 1. Points clés pour l'entretien

1. **Classification des Rendering Modes** : Nuxt 3 supporte quatre modes : SSR, SSG, CSR, Hybrid Rendering
2. **Stratégie de sélection** : Choisir le mode approprié selon les besoins SEO, le dynamisme du contenu et les exigences de performance
3. **Expérience d'implémentation** : Comment configurer et sélectionner les différents Rendering Modes dans un projet

---

## 2. Présentation des Rendering Modes de Nuxt 3

### 2.1 Quatre Rendering Modes

Nuxt 3 supporte quatre Rendering Modes principaux :

| Mode | Nom complet | Moment du rendu | Scénarios d'application |
|------|------|---------|---------|
| **SSR** | Server-Side Rendering | Rendu côté Server à chaque requête | SEO + contenu dynamique nécessaire |
| **SSG** | Static Site Generation | HTML pré-généré au moment du build | SEO + contenu fixe nécessaire |
| **CSR** | Client-Side Rendering | Rendu côté navigateur | Pas de SEO nécessaire + haute interactivité |
| **Hybrid** | Hybrid Rendering | Utilisation mixte de plusieurs modes | Différentes pages avec différents besoins |

### 2.2 SSR (Server-Side Rendering)

**Définition :** À chaque requête, JavaScript est exécuté côté Server pour générer du HTML complet, puis l'envoyer au navigateur.

**Configuration :**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // true par défaut
});
```

**Processus :**
1. Le navigateur demande la page
2. Le Server exécute JavaScript et génère le HTML complet
3. Le HTML est envoyé au navigateur
4. Le navigateur effectue l'Hydration (activation des fonctions interactives)

**Avantages :**
- ✅ Compatible SEO (les moteurs de recherche peuvent voir le contenu complet)
- ✅ Chargement initial rapide (pas besoin d'attendre l'exécution JavaScript)
- ✅ Support du contenu dynamique (données à jour à chaque requête)

**Inconvénients :**
- ❌ Charge Server plus élevée (chaque requête nécessite un rendu)
- ❌ TTFB (Time To First Byte) potentiellement plus long
- ❌ Environnement Server requis

**Scénarios d'application :**
- Pages produits e-commerce (SEO + prix/stock dynamiques nécessaires)
- Pages d'articles de presse (SEO + contenu dynamique nécessaire)
- Pages de profil utilisateur (SEO + contenu personnalisé nécessaire)

### 2.3 SSG (Static Site Generation)

**Définition :** Au moment du build (Build Time), toutes les pages HTML sont pré-générées et déployées comme fichiers statiques.

**Configuration :**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSG nécessite SSR à true
  nitro: {
    prerender: {
      routes: ['/about', '/contact'], // Spécifier les routes à pré-rendre
    },
  },
});

// Ou avec routeRules
export default defineNuxtConfig({
  routeRules: {
    '/about': { prerender: true },
    '/contact': { prerender: true },
  },
});
```

**Processus :**
1. Lors du build, JavaScript est exécuté pour générer le HTML de toutes les pages
2. Les fichiers HTML sont déployés sur CDN
3. Lors des requêtes, le navigateur reçoit directement le HTML pré-généré

**Avantages :**
- ✅ Meilleures performances (cache CDN, réponse rapide)
- ✅ Compatible SEO (contenu HTML complet)
- ✅ Charge Server minimale (pas de rendu en temps d'exécution)
- ✅ Faible coût (déploiement sur CDN possible)

**Inconvénients :**
- ❌ Non adapté au contenu dynamique (rebuild nécessaire pour mettre à jour)
- ❌ Le temps de build peut être long (avec beaucoup de pages)
- ❌ Ne peut pas gérer le contenu spécifique à l'utilisateur

**Scénarios d'application :**
- Page À propos (contenu fixe)
- Page description de produit (contenu relativement fixe)
- Articles de blog (ne changent pas fréquemment après publication)

### 2.4 CSR (Client-Side Rendering)

**Définition :** JavaScript est exécuté dans le navigateur pour générer dynamiquement le contenu HTML.

**Configuration :**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // Désactiver SSR globalement
});

// Ou pour des routes spécifiques
export default defineNuxtConfig({
  routeRules: {
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});

// Ou configurer dans la page
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false,
});
</script>
```

**Processus :**
1. Le navigateur demande le HTML (généralement un shell vide)
2. Téléchargement du bundle JavaScript
3. Exécution du JavaScript, génération dynamique du contenu
4. Rendu de la page

**Avantages :**
- ✅ Haute interactivité, adapté aux SPA
- ✅ Réduction de la charge Server
- ✅ Transitions de page fluides (pas de rechargement nécessaire)

**Inconvénients :**
- ❌ Non compatible SEO (les moteurs de recherche peuvent ne pas indexer correctement)
- ❌ Temps de chargement initial plus long (téléchargement et exécution de JavaScript nécessaires)
- ❌ JavaScript nécessaire pour voir le contenu

**Scénarios d'application :**
- Systèmes d'administration backend (SEO non nécessaire)
- Tableaux de bord utilisateur (SEO non nécessaire)
- Applications interactives (jeux, outils, etc.)

### 2.5 Hybrid Rendering (Rendu Hybride)

**Définition :** Selon les besoins des différentes pages, plusieurs Rendering Modes sont utilisés de manière mixte.

**Configuration :**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSR par défaut
  routeRules: {
    // Pages nécessitant le SEO : SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // Pages au contenu fixe : SSG
    '/about': { prerender: true },
    '/contact': { prerender: true },

    // Pages sans besoin de SEO : CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**Avantages :**
- ✅ Sélection du mode approprié selon les caractéristiques de la page
- ✅ Équilibre entre SEO, performance et expérience de développement
- ✅ Grande flexibilité

**Scénarios d'application :**
- Grands projets (différentes pages avec différents besoins)
- Plateformes e-commerce (page produit SSR, backend CSR, page à propos SSG)

### 2.6 ISR (Incremental Static Regeneration)

**Définition :** Régénération statique incrémentale. Combine la performance de SSG avec le dynamisme de SSR. Les pages génèrent du HTML statique au moment du build ou lors de la première requête, et sont mises en cache pendant une période (TTL). Après l'expiration du cache, la requête suivante régénère la page en arrière-plan tout en renvoyant l'ancien contenu caché (Stale-While-Revalidate).

**Configuration :**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Activer ISR, cache de 1 heure (3600 secondes)
    '/blog/**': { swr: 3600 },
    // Ou utiliser la propriété isr (support spécifique sur Netlify/Vercel, etc.)
    '/products/**': { isr: 600 },
  },
});
```

**Processus :**
1. Requête A arrive : le Server rend la page, la renvoie et la met en cache (Cache MISS -> HIT).
2. Requête B arrive (dans le TTL) : renvoie directement le contenu caché (Cache HIT).
3. Requête C arrive (après le TTL) : renvoie l'ancien cache (Stale), tout en re-rendant en arrière-plan et en mettant à jour le cache (Revalidate).
4. Requête D arrive : renvoie le nouveau contenu caché.

**Avantages :**
- ✅ Performance proche de l'optimum de SSG
- ✅ Résout le problème du temps de build trop long de SSG
- ✅ Le contenu peut être mis à jour périodiquement

**Scénarios d'application :**
- Grands blogs
- Pages de détail de produits e-commerce
- Sites d'actualités

### 2.7 Route Rules et stratégies de cache

Nuxt 3 utilise `routeRules` pour gérer de manière unifiée le rendu hybride et les stratégies de cache. Cela est traité au niveau de Nitro.

| Propriété | Signification | Scénarios d'application |
|------|------|---------|
| `ssr: true` | Forcer le Server-Side Rendering | SEO + forte dynamicité |
| `ssr: false` | Forcer le Client-Side Rendering (SPA) | Backend, tableau de bord |
| `prerender: true` | Pré-rendu au build (SSG) | À propos, page de conditions |
| `swr: true` | Activer le cache SWR (sans expiration, jusqu'au redéploiement) | Contenu avec très peu de changements |
| `swr: 60` | Activer ISR, cache de 60 secondes | Pages de listes, pages d'événements |
| `cache: { maxAge: 60 }` | Définir l'en-tête Cache-Control (cache navigateur/CDN) | Ressources statiques |

---

## 3. Stratégie de sélection

### 3.1 Choisir le Rendering Mode selon les besoins

**Diagramme de décision :**

```
SEO nécessaire ?
├─ Oui → Le contenu change-t-il fréquemment ?
│   ├─ Oui → SSR
│   └─ Non → SSG
└─ Non → CSR
```

**Tableau de comparaison :**

| Besoin | Mode recommandé | Raison |
|------|---------|------|
| **SEO nécessaire** | SSR / SSG | Les moteurs de recherche peuvent voir le contenu complet |
| **Contenu changeant fréquemment** | SSR | Contenu à jour à chaque requête |
| **Contenu relativement fixe** | SSG | Meilleure performance, coût le plus bas |
| **SEO non nécessaire** | CSR | Haute interactivité, transitions fluides |
| **Beaucoup de pages** | SSG | Générées au build, cache CDN |
| **Contenu spécifique à l'utilisateur** | SSR / CSR | Génération dynamique nécessaire |

### 3.2 Cas pratiques

#### Cas 1 : Plateforme e-commerce

**Besoins :**
- Les pages produits nécessitent le SEO (indexation Google)
- Le contenu des produits change fréquemment (prix, stock)
- Les pages personnelles des utilisateurs ne nécessitent pas de SEO

**Solution :**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // Page produit : SSR (SEO + contenu dynamique nécessaire)
    '/products/**': { ssr: true },

    // À propos : SSG (contenu fixe)
    '/about': { prerender: true },

    // Page utilisateur : CSR (SEO non nécessaire)
    '/user/**': { ssr: false },
  },
});
```

#### Cas 2 : Site de blog

**Besoins :**
- Les pages d'articles nécessitent le SEO
- Le contenu des articles est relativement fixe (ne change pas fréquemment après publication)
- Chargement rapide nécessaire

**Solution :**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // Page d'article : SSG (contenu fixe + SEO nécessaire)
    '/articles/**': { prerender: true },

    // Page d'accueil : SSG (contenu fixe)
    '/': { prerender: true },

    // Administration backend : CSR (SEO non nécessaire)
    '/admin/**': { ssr: false },
  },
});
```

---

## 4. Points clés pour l'entretien

### 4.1 Rendering Modes de Nuxt 3

**Vous pouvez répondre ainsi :**

> Nuxt 3 supporte quatre Rendering Modes : SSR effectue le rendu côté Server à chaque requête, adapté aux pages nécessitant le SEO avec du contenu dynamique ; SSG pré-génère le HTML au moment du build, adapté aux pages nécessitant le SEO avec du contenu fixe, offrant les meilleures performances ; CSR effectue le rendu côté navigateur, adapté aux pages sans besoin de SEO avec une haute interactivité ; Hybrid Rendering mélange plusieurs modes, choisissant le mode approprié selon les besoins de chaque page.

**Points clés :**
- ✅ Caractéristiques et différences des quatre modes
- ✅ Scénarios d'application et critères de sélection
- ✅ Avantages du Hybrid Rendering

### 4.2 Comment choisir le Rendering Mode ?

**Vous pouvez répondre ainsi :**

> Le choix du Rendering Mode repose principalement sur trois facteurs : les besoins SEO, le dynamisme du contenu et les exigences de performance. Les pages nécessitant le SEO choisissent SSR ou SSG ; le contenu changeant fréquemment choisit SSR ; le contenu fixe choisit SSG ; les pages sans besoin de SEO peuvent choisir CSR. Dans les projets réels, on utilise généralement le Hybrid Rendering, en choisissant le mode approprié selon les caractéristiques de chaque page. Par exemple, sur une plateforme e-commerce, les pages produits utilisent SSR (SEO + contenu dynamique), la page à propos utilise SSG (contenu fixe), et les pages personnelles des utilisateurs utilisent CSR (pas de SEO nécessaire).

**Points clés :**
- ✅ Sélection basée sur les besoins SEO, le dynamisme du contenu et la performance
- ✅ Utilisation mixte de plusieurs modes dans les projets réels
- ✅ Explication avec des cas concrets

### 4.3 ISR et Route Rules
**Q : Comment implémenter ISR (Incremental Static Regeneration) ? Quels sont les mécanismes de caching de Nuxt 3 ?**

> **Exemple de réponse :**
> Dans Nuxt 3, nous pouvons implémenter ISR via les `routeRules`.
> Il suffit de configurer `{ swr: secondes }` dans `nuxt.config.ts` pour que Nitro active automatiquement le mécanisme Stale-While-Revalidate.
> Par exemple, `'/blog/**': { swr: 3600 }` signifie que les pages sous ce chemin seront mises en cache pendant 1 heure.
> `routeRules` est très puissant, permettant de configurer différentes stratégies pour différents chemins : certaines pages utilisent SSR, d'autres SSG (`prerender: true`), d'autres ISR (`swr`), d'autres CSR (`ssr: false`), c'est l'essence même du Hybrid Rendering.

---

## 5. Bonnes pratiques

### 5.1 Principes de sélection

1. **Pages nécessitant le SEO**
   - Contenu fixe → SSG
   - Contenu dynamique → SSR

2. **Pages sans besoin de SEO**
   - Haute interactivité → CSR
   - Logique côté Server nécessaire → SSR

3. **Stratégie mixte**
   - Choisir le mode approprié selon les caractéristiques de la page
   - Gestion unifiée avec `routeRules`

### 5.2 Recommandations de configuration

1. **Utiliser SSR par défaut**
   - Assurer la compatibilité SEO
   - Possibilité d'ajuster ultérieurement pour des pages spécifiques

2. **Gestion unifiée avec routeRules**
   - Configuration centralisée, maintenance facile
   - Identification claire du mode de rendu de chaque page

3. **Révision et optimisation régulières**
   - Ajuster selon l'utilisation réelle
   - Surveiller les métriques de performance

---

## 6. Résumé pour l'entretien

**Vous pouvez répondre ainsi :**

> Nuxt 3 supporte quatre Rendering Modes : SSR, SSG, CSR et Hybrid Rendering. SSR convient aux pages nécessitant le SEO avec du contenu dynamique ; SSG convient aux pages nécessitant le SEO avec du contenu fixe, offrant les meilleures performances ; CSR convient aux pages sans besoin de SEO avec une haute interactivité. Le choix repose principalement sur les besoins SEO, le dynamisme du contenu et les exigences de performance. Dans les projets réels, on utilise généralement le Hybrid Rendering, en choisissant le mode approprié selon les caractéristiques de chaque page. Par exemple, sur une plateforme e-commerce, les pages produits utilisent SSR, la page à propos utilise SSG, et les pages utilisateur utilisent CSR.

**Points clés :**
- ✅ Caractéristiques et différences des quatre Rendering Modes
- ✅ Stratégie de sélection et facteurs d'évaluation
- ✅ Expérience d'implémentation du Hybrid Rendering
- ✅ Cas de projets réels

---

## 7. Reference

- [Nuxt 3 Rendering Modes](https://nuxt.com/docs/guide/concepts/rendering)
- [Nuxt 3 Route Rules](https://nuxt.com/docs/api/nuxt-config#routerules)
