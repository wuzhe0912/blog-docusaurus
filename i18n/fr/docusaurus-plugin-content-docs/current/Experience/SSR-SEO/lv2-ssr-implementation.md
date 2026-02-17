---
title: '[Lv2] Implémentation SSR: Data Fetching et gestion des Meta SEO'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Dans un projet Nuxt 3: mettre en place le chargement de données SSR et la gestion dynamique des meta SEO pour que les routes dynamiques soient correctement indexées.

---

## 1. Axe de réponse en entretien

1. **Stratégie de Data Fetching**: utiliser `useFetch`/`useAsyncData` côté serveur pour prérendre un contenu SEO complet.
2. **Meta tags dynamiques**: générer les meta avec `useHead` ou `useSeoMeta` selon les données de la page.
3. **Performance**: déduplication des requêtes, cache serveur et séparation claire SSR/CSR.

---

## 2. Bien utiliser useFetch / useAsyncData

### 2.1 Pourquoi SSR Data Fetching est nécessaire

**Situation typique:**

- Les routes dynamiques (ex: `/products/[id]`) dépendent d'une API.
- Si le chargement est uniquement client, le crawler voit un contenu incomplet.
- L'objectif est un HTML complet déjà rendu côté serveur.

**Solution:** utiliser `useFetch` ou `useAsyncData` dans Nuxt 3.

### 2.2 Exemple de base avec useFetch

**Fichier:** `pages/products/[id].vue`

```typescript
// usage de base
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**Options importantes:**

| Option      | Rôle                                           | Défaut     |
| ----------- | ---------------------------------------------- | ---------- |
| `key`       | Clé unique pour la déduplication des requêtes  | auto       |
| `lazy`      | Charge en différé (sans bloquer SSR)           | `false`    |
| `server`    | Exécuté côté serveur                           | `true`     |
| `default`   | Valeur de fallback                             | `null`     |
| `transform` | Transformation de réponse                      | -          |

### 2.3 Exemple complet

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // évite les requêtes dupliquées
  lazy: false, // SSR attend la fin du chargement
  server: true, // force l'exécution serveur
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // normalisation de données
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**Pourquoi ces options sont critiques:**

1. **`key`**
   - Active la déduplication de requêtes
   - Même key => une seule requête effective
2. **`lazy: false`**
   - Le rendu SSR attend les données
   - Le crawler voit un contenu déjà complet
3. **`server: true`**
   - Garantit l'exécution dans le pipeline SSR

### 2.4 useAsyncData vs useFetch

| Critère          | useFetch                       | useAsyncData                      |
| ---------------- | ------------------------------ | --------------------------------- |
| Usage principal  | Appels API                     | Toute logique asynchrone          |
| Ergonomie        | URL/headers simplifiés         | Logique manuelle plus libre       |
| Cas courant      | Chargement de données HTTP     | Requêtes DB, agrégation, fichiers|

```typescript
// useFetch: centré API
const { data } = await useFetch('/api/products/123');

// useAsyncData: logique asynchrone libre
const { data } = await useAsyncData('products', async () => {
  const result = await someAsyncOperation();
  return result;
});
```

### 2.5 $fetch vs useFetch

**Règle simple en entretien:**

- **`$fetch`** pour les actions utilisateur (click, submit, load more).
- **`useFetch`** pour le chargement initial avec sync SSR/Hydration.

**`$fetch` en bref:**

- Client HTTP bas niveau (`ofetch`)
- Pas de transfert d'état SSR vers client
- Utilisé directement dans `setup()` -> risque de double fetch

**`useFetch` en bref:**

- Enveloppe `useAsyncData` + `$fetch`
- Compatible Hydration
- Retourne `data`, `pending`, `error`, `refresh`

**Comparatif:**

| Aspect               | useFetch                           | $fetch                          |
| -------------------- | ---------------------------------- | ------------------------------- |
| Sync état SSR        | Oui                                | Non                             |
| Retour               | refs réactifs                      | Promise avec données brutes     |
| Cas principal        | Data Fetching au chargement page   | Opérations déclenchées par UI   |

```typescript
// Correct: chargement initial
const { data } = await useFetch('/api/user');

// Correct: action utilisateur
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// À éviter: $fetch direct dans setup
const data = await $fetch('/api/user');
```

---

## 3. Gestion des meta SEO avec useHead

### 3.1 Pourquoi des meta tags dynamiques

**Situation typique:**

- Pages produit/article générées dynamiquement.
- Chaque URL doit avoir son `title`, `description`, `og:image`, canonical.
- Les aperçus sociaux (Open Graph/Twitter) doivent être cohérents.

**Solution:** `useHead` ou `useSeoMeta`.

### 3.2 Exemple useHead

```typescript
useHead({
  title: () => product.value?.name,
  meta: [
    { name: 'description', content: () => product.value?.description },
    { property: 'og:title', content: () => product.value?.name },
    { property: 'og:image', content: () => product.value?.image },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://example.com/products/${product.value?.id}`,
    },
  ],
});
```

**Bonnes pratiques:**

1. Fournir des fonctions (`() => ...`) pour garder des meta réactifs.
2. Couvrir title, description, OG et canonical.
3. Sur les 404, ajouter `noindex, nofollow`.

### 3.3 Variante compacte avec useSeoMeta

```typescript
useSeoMeta({
  title: () => product.value?.name,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
});
```

---

## 4. Cas pratique 1: SEO des routes dynamiques

### 4.1 Contexte

Scénario e-commerce avec beaucoup de pages SKU (`/products/[id]`).

**Défis:**

- Beaucoup d'URLs dynamiques
- Meta uniques par page
- Gestion propre des 404
- Éviter le duplicate content

### 4.2 Stratégie

1. Charger les données côté serveur (`lazy: false`, `server: true`)
2. Lever une 404 propre (`createError`) si nécessaire
3. Générer meta + canonical dynamiquement

```typescript
const { data: product, error } = await useFetch(`/api/products/${id}`, {
  key: `product-${id}`,
  lazy: false,
  server: true,
});

if (error.value || !product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}

useSeoMeta({
  title: () => `${product.value?.name} - Product`,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
});
```

### 4.3 Résultat

**Avant:**
- Contenu incomplet pour les crawlers
- Meta identiques sur plusieurs pages
- 404 mal gérées

**Après:**
- HTML SSR complet pour les crawlers
- Meta uniques par route
- Erreurs traitées proprement

---

## 5. Cas pratique 2: optimisation performance

### 5.1 Problème

Le SSR augmente la charge serveur. Sans optimisation, les temps de réponse et les coûts montent.

### 5.2 Stratégies appliquées

1. **Déduplication de requêtes**

```typescript
const { data } = await useFetch('/api/product/123', {
  key: 'product-123',
});
```

2. **Cache serveur (Nitro)**

```typescript
export default defineCachedEventHandler(
  async (event) => {
    return await getProductsFromDB();
  },
  {
    maxAge: 60 * 60,
    swr: true,
  },
);
```

3. **Séparations SSR/CSR**
- Pages SEO critiques: SSR
- Pages internes non indexables: CSR

4. **Stratégie CSS/Assets**
- Prioriser le critical CSS
- Charger le non critique plus tard

### 5.3 Impact

**Avant:**
- Charge serveur élevée
- Requêtes dupliquées
- Pas de cache

**Après:**
- Temps de réponse réduits
- Charge backend/DB mieux maîtrisée
- Performance plus stable sous charge

---

## 6. Réponses courtes pour entretien

### 6.1 useFetch / useAsyncData

> Pour le chargement initial, j'utilise `useFetch` avec `key`, `lazy: false` et `server: true` pour garantir un rendu SSR complet et SEO-friendly.

### 6.2 Meta dynamiques

> Je gère les meta avec `useHead`/`useSeoMeta` et des valeurs sous forme de fonctions pour rester réactif sur les pages dynamiques.

### 6.3 Performance

> Je combine déduplication, cache serveur et répartition SSR/CSR pour réduire la charge tout en conservant la qualité SEO.

---

## 7. Bonnes pratiques

### 7.1 Data Fetching

1. Toujours définir un `key`.
2. Choisir `lazy` selon l'objectif SEO.
3. Traiter les erreurs (404/5xx) explicitement.

### 7.2 Meta SEO

1. Utiliser des fonctions pour des meta réactifs.
2. Couvrir title/description/OG/canonical.
3. Protéger les pages d'erreur avec `noindex, nofollow`.

### 7.3 Performance

1. Activer le cache serveur.
2. Limiter SSR aux pages qui en ont besoin.
3. Optimiser le rendu initial (critical CSS, chargement différé).

---

## 8. Synthèse d'entretien

> Dans Nuxt 3, j'ai mis en place un pipeline SSR complet: chargement serveur des données, meta SEO dynamiques par route et optimisations de performance (déduplication, cache, SSR/CSR split). Le résultat est à la fois SEO-friendly et scalable en production.

**Points clefs:**
- ✅ Bon usage de `useFetch`/`useAsyncData`
- ✅ Meta dynamiques avec `useHead`/`useSeoMeta`
- ✅ SEO des routes dynamiques
- ✅ Optimisation performance basée sur des cas réels
