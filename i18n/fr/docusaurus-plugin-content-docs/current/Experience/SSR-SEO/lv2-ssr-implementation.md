---
title: '[Lv2] Implementation SSR: Data Fetching et gestion des Meta SEO'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Dans un projet Nuxt 3: mettre en place le chargement de donnees SSR et la gestion dynamique des meta SEO pour que les routes dynamiques soient correctement indexees.

---

## 1. Axe de reponse en entretien

1. **Strategie de Data Fetching**: utiliser `useFetch`/`useAsyncData` cote serveur pour prerendre un contenu SEO complet.
2. **Meta tags dynamiques**: generer les meta avec `useHead` ou `useSeoMeta` selon les donnees de la page.
3. **Performance**: deduplication des requetes, cache serveur et separation claire SSR/CSR.

---

## 2. Bien utiliser useFetch / useAsyncData

### 2.1 Pourquoi SSR Data Fetching est necessaire

**Situation typique:**

- Les routes dynamiques (ex: `/products/[id]`) dependent d'une API.
- Si le chargement est uniquement client, le crawler voit un contenu incomplet.
- L'objectif est un HTML complet deja rendu cote serveur.

**Solution:** utiliser `useFetch` ou `useAsyncData` dans Nuxt 3.

### 2.2 Exemple de base avec useFetch

**Fichier:** `pages/products/[id].vue`

```typescript
// usage de base
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**Options importantes:**

| Option      | Role                                           | Defaut     |
| ----------- | ---------------------------------------------- | ---------- |
| `key`       | Cle unique pour la deduplication des requetes  | auto       |
| `lazy`      | Charge en differe (sans bloquer SSR)           | `false`    |
| `server`    | Execute cote serveur                           | `true`     |
| `default`   | Valeur de fallback                             | `null`     |
| `transform` | Transformation de reponse                      | -          |

### 2.3 Exemple complet

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // evite les requetes dupliquees
  lazy: false, // SSR attend la fin du chargement
  server: true, // force l'execution serveur
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // normalisation de donnees
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**Pourquoi ces options sont critiques:**

1. **`key`**
   - Active la deduplication de requetes
   - Meme key => une seule requete effective
2. **`lazy: false`**
   - Le rendu SSR attend les donnees
   - Le crawler voit un contenu deja complet
3. **`server: true`**
   - Garantit l'execution dans le pipeline SSR

### 2.4 useAsyncData vs useFetch

| Critere          | useFetch                       | useAsyncData                      |
| ---------------- | ------------------------------ | --------------------------------- |
| Usage principal  | Appels API                     | Toute logique asynchrone          |
| Ergonomie        | URL/headers simplifies         | Logique manuelle plus libre       |
| Cas courant      | Chargement de donnees HTTP     | Requetes DB, aggregation, fichiers|

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

**Regle simple en entretien:**

- **`$fetch`** pour les actions utilisateur (click, submit, load more).
- **`useFetch`** pour le chargement initial avec sync SSR/Hydration.

**`$fetch` en bref:**

- Client HTTP bas niveau (`ofetch`)
- Pas de transfert d'etat SSR vers client
- Utilise directement dans `setup()` -> risque de double fetch

**`useFetch` en bref:**

- Enveloppe `useAsyncData` + `$fetch`
- Compatible Hydration
- Retourne `data`, `pending`, `error`, `refresh`

**Comparatif:**

| Aspect               | useFetch                           | $fetch                          |
| -------------------- | ---------------------------------- | ------------------------------- |
| Sync etat SSR        | Oui                                | Non                             |
| Retour               | refs reactifs                      | Promise avec donnees brutes     |
| Cas principal        | Data Fetching au chargement page   | Operations declenchees par UI   |

```typescript
// Correct: chargement initial
const { data } = await useFetch('/api/user');

// Correct: action utilisateur
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// A eviter: $fetch direct dans setup
const data = await $fetch('/api/user');
```

---

## 3. Gestion des meta SEO avec useHead

### 3.1 Pourquoi des meta tags dynamiques

**Situation typique:**

- Pages produit/article generees dynamiquement.
- Chaque URL doit avoir son `title`, `description`, `og:image`, canonical.
- Les apercus sociaux (Open Graph/Twitter) doivent etre coherents.

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

1. Fournir des fonctions (`() => ...`) pour garder des meta reactifs.
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

Scenario e-commerce avec beaucoup de pages SKU (`/products/[id]`).

**Defis:**

- Beaucoup d'URLs dynamiques
- Meta uniques par page
- Gestion propre des 404
- Eviter le duplicate content

### 4.2 Strategie

1. Charger les donnees cote serveur (`lazy: false`, `server: true`)
2. Lever une 404 propre (`createError`) si necessaire
3. Generer meta + canonical dynamiquement

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

### 4.3 Resultat

**Avant:**
- Contenu incomplet pour les crawlers
- Meta identiques sur plusieurs pages
- 404 mal gerees

**Apres:**
- HTML SSR complet pour les crawlers
- Meta uniques par route
- Erreurs traitees proprement

---

## 5. Cas pratique 2: optimisation performance

### 5.1 Probleme

Le SSR augmente la charge serveur. Sans optimisation, les temps de reponse et les couts montent.

### 5.2 Strategies appliquees

1. **Deduplication de requetes**

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

3. **Separations SSR/CSR**
- Pages SEO critiques: SSR
- Pages internes non indexables: CSR

4. **Strategie CSS/Assets**
- Prioriser le critical CSS
- Charger le non critique plus tard

### 5.3 Impact

**Avant:**
- Charge serveur elevee
- Requetes dupliquees
- Pas de cache

**Apres:**
- Temps de reponse reduits
- Charge backend/DB mieux maitrisee
- Performance plus stable sous charge

---

## 6. Reponses courtes pour entretien

### 6.1 useFetch / useAsyncData

> Pour le chargement initial, j'utilise `useFetch` avec `key`, `lazy: false` et `server: true` pour garantir un rendu SSR complet et SEO-friendly.

### 6.2 Meta dynamiques

> Je gere les meta avec `useHead`/`useSeoMeta` et des valeurs sous forme de fonctions pour rester reactif sur les pages dynamiques.

### 6.3 Performance

> Je combine deduplication, cache serveur et repartition SSR/CSR pour reduire la charge tout en conservant la qualite SEO.

---

## 7. Bonnes pratiques

### 7.1 Data Fetching

1. Toujours definir un `key`.
2. Choisir `lazy` selon l'objectif SEO.
3. Traiter les erreurs (404/5xx) explicitement.

### 7.2 Meta SEO

1. Utiliser des fonctions pour des meta reactifs.
2. Couvrir title/description/OG/canonical.
3. Proteger les pages d'erreur avec `noindex, nofollow`.

### 7.3 Performance

1. Activer le cache serveur.
2. Limiter SSR aux pages qui en ont besoin.
3. Optimiser le rendu initial (critical CSS, chargement differe).

---

## 8. Synthese d'entretien

> Dans Nuxt 3, j'ai mis en place un pipeline SSR complet: chargement serveur des donnees, meta SEO dynamiques par route et optimisations de performance (deduplication, cache, SSR/CSR split). Le resultat est a la fois SEO-friendly et scalable en production.

**Points clefs:**
- ✅ Bon usage de `useFetch`/`useAsyncData`
- ✅ Meta dynamiques avec `useHead`/`useSeoMeta`
- ✅ SEO des routes dynamiques
- ✅ Optimisation performance basee sur des cas reels
