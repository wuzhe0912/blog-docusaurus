---
title: '[Lv3] Optimisation des performances Nuxt 3 : Bundle Size, vitesse SSR et optimisation des images'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Guide complet d'optimisation des performances Nuxt 3 : de la réduction du Bundle Size à l'optimisation de la vitesse SSR et des stratégies de chargement des images, pour une expérience de performance optimale.

---

## 1. Axes principaux de la réponse en entretien

1. **Optimisation du Bundle Size** : analyse (`nuxi analyze`), découpage (`SplitChunks`), Tree Shaking, chargement différé (Lazy Loading).
2. **Optimisation de la vitesse SSR (TTFB)** : cache Redis, Nitro Cache, réduction des appels API bloquants, Streaming SSR.
3. **Optimisation des images** : `@nuxt/image`, format WebP, CDN, Lazy Loading.
4. **Optimisation des grandes quantités de données** : Virtual Scrolling, défilement infini (Infinite Scroll), pagination (Pagination).

---

## 2. Comment réduire le Bundle Size de Nuxt 3 ?

### 2.1 Outils de diagnostic

Tout d'abord, il faut identifier où se situe le goulot d'étranglement. Utilisez `nuxi analyze` pour visualiser la structure du Bundle.

```bash
npx nuxi analyze
```

Cela génère un rapport montrant quels paquets occupent le plus d'espace.

### 2.2 Stratégies d'optimisation

#### 1. Code Splitting (découpage du code)
Nuxt 3 effectue déjà par défaut un Code Splitting basé sur les routes (Route-based). Mais pour les gros paquets (comme ECharts, Lodash), une optimisation manuelle est nécessaire.

**Configuration Nuxt (Vite/Webpack) :**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Isoler les gros paquets de node_modules
            if (id.includes('node_modules')) {
              if (id.includes('lodash')) return 'lodash';
              if (id.includes('echarts')) return 'echarts';
            }
          },
        },
      },
    },
  },
});
```

#### 2. Tree Shaking et import à la demande
Assurez-vous d'importer uniquement les modules nécessaires, et non le paquet entier.

```typescript
// ❌ Mauvais : importer tout lodash
import _ from 'lodash';
_.debounce(() => {}, 100);

// ✅ Correct : importer uniquement debounce
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// ✅ Recommandé : utiliser vueuse (spécifique à Vue et Tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. Lazy Loading des composants
Pour les composants non nécessaires au premier écran, utilisez le préfixe `Lazy` pour l'import dynamique.

```vue
<template>
  <div>
    <!-- Le code du composant n'est chargé que lorsque show est true -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. Supprimer les paquets inutiles côté Server
Assurez-vous que les paquets utilisés uniquement côté Server (pilotes de base de données, opérations fs) ne sont pas inclus dans le bundle Client. Nuxt 3 gère automatiquement les fichiers se terminant par `.server.ts`, ou utilise le répertoire `server/`.

---

## 3. Comment optimiser la vitesse SSR (TTFB) ?

### 3.1 Pourquoi le TTFB est-il trop long ?
Le TTFB (Time To First Byte) est l'indicateur clé des performances SSR. Les causes courantes d'un TTFB trop long :
1. **API lentes** : le Server attend la réponse du back-end avant de pouvoir rendre le HTML.
2. **Requêtes en série** : les appels API sont exécutés les uns après les autres au lieu d'être parallélisés.
3. **Calculs lourds** : le Server exécute trop de tâches intensives en CPU.

### 3.2 Solutions d'optimisation

#### 1. Cache côté Server (Nitro Cache)
Utilisez les fonctionnalités de cache de Nitro pour mettre en cache les réponses API ou les résultats du rendu.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Page d'accueil en cache 1 heure (SWR: Stale-While-Revalidate)
    '/': { swr: 3600 },
    // Page produit en cache 10 minutes
    '/products/**': { swr: 600 },
    // Cache des API
    '/api/**': { cache: { maxAge: 60 } },
  },
});
```

#### 2. Requêtes parallèles (Parallel Fetching)
Utilisez `Promise.all` pour envoyer plusieurs requêtes en parallèle, au lieu de les `await` une par une.

```typescript
// ❌ Lent : exécution en série (temps total = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// ✅ Rapide : exécution parallèle (temps total = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. Différement des données non critiques (Lazy Fetching)
Les données non nécessaires au premier écran peuvent être chargées côté Client (`lazy: true`), évitant ainsi de bloquer le SSR.

```typescript
// Les commentaires n'ont pas besoin de SEO, chargement côté Client
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false, // Ne pas exécuter du tout côté Server
});
```

#### 4. Streaming SSR (expérimental)
Nuxt 3 supporte le HTML Streaming, permettant d'envoyer le contenu au fur et à mesure du rendu, pour que l'utilisateur voie le contenu plus rapidement.

---

## 4. Optimisation des images avec Nuxt 3

### 4.1 Utilisation de @nuxt/image
Le module officiel `@nuxt/image` est la meilleure solution, offrant :
- **Conversion automatique de format** : conversion automatique en WebP/AVIF.
- **Redimensionnement automatique** : génération d'images aux dimensions adaptées à la taille de l'écran.
- **Lazy Loading** : chargement différé intégré.
- **Intégration CDN** : support de Cloudinary, Imgix et d'autres fournisseurs.

### 4.2 Exemple d'implémentation

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    // Options par défaut
    format: ['webp'],
  },
});
```

```vue
<template>
  <!-- Conversion automatique en webp, largeur 300px, avec lazy load -->
  <NuxtImg
    src="/hero.jpg"
    format="webp"
    width="300"
    loading="lazy"
    placeholder
  />
</template>
```

---

## 5. Pagination et défilement pour de grandes quantités de données

### 5.1 Choix de la solution
Pour de grandes quantités de données (ex. 10 000 produits), trois stratégies principales, avec prise en compte du **SEO** :

| Stratégie | Cas d'utilisation | Compatibilité SEO |
| :--- | :--- | :--- |
| **Pagination traditionnelle** | Listes e-commerce, listes d'articles | Excellente (meilleure) |
| **Défilement infini** | Fil social, mur d'images | Faible (traitement spécial nécessaire) |
| **Virtual Scrolling** | Rapports complexes, listes très longues | Très faible (contenu absent du DOM) |

### 5.2 Comment maintenir le SEO avec le défilement infini ?
Avec le défilement infini, les moteurs de recherche ne peuvent généralement indexer que la première page. Solutions :
1. **Combiner avec un mode paginé** : fournir la balise `<link rel="next" href="...">` pour que le crawler connaisse la page suivante.
2. **Fallback Noscript** : fournir une version paginée traditionnelle dans `<noscript>` pour les crawlers.
3. **Bouton "Charger plus"** : le SSR rend les 20 premières lignes, le reste est chargé par un clic sur "Charger plus" ou par défilement via un Client-side fetch.

### 5.3 Exemple d'implémentation (Load More + SEO)

```vue
<script setup>
// Données du premier écran (SSR)
const page = ref(1);
const { data: posts } = await useFetch('/api/posts', {
  query: { page: page.value }
});

// Chargement supplémentaire côté Client
const loadMore = async () => {
  page.value++;
  const newPosts = await $fetch('/api/posts', {
      query: { page: page.value }
  });
  posts.value.push(...newPosts);
};
</script>

<template>
  <div>
    <div v-for="post in posts" :key="post.id">{{ post.title }}</div>
    <button @click="loadMore">Charger plus</button>

    <!-- Optimisation SEO : indiquer au crawler qu'il y a une page suivante -->
    <Head>
      <Link rel="next" :href="`/posts?page=${page + 1}`" />
    </Head>
  </div>
</template>
```

---

## 6. Lazy Loading en environnement SSR

### 6.1 Description du problème
En environnement SSR, l'utilisation d'`IntersectionObserver` pour le Lazy Loading provoque des erreurs ou un Hydration Mismatch, car le Server n'a pas d'objet `window` ou `document`.

### 6.2 Solutions

#### 1. Utiliser les composants intégrés de Nuxt
- `<LazyComponent>`
- `<NuxtImg loading="lazy">`

#### 2. Directive personnalisée (avec gestion du SSR)

```typescript
// plugins/lazy-load.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      // Exécution uniquement côté Client
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value;
          observer.disconnect();
        }
      });
      observer.observe(el);
    },
    getSSRProps(binding) {
      // Rendu côté Server : placeholder ou image originale (selon les besoins SEO)
      return {
        src: 'placeholder.png'
      };
    }
  });
});
```

---

## 7. Monitoring et suivi des performances SSR

### 7.1 Pourquoi le monitoring est-il nécessaire ?
Les goulots d'étranglement des applications SSR se situent souvent côté Server, invisibles dans les DevTools du navigateur. Sans monitoring, il est difficile de déterminer si des réponses API lentes, des Memory Leaks ou une charge CPU élevée sont responsables d'un TTFB dégradé.

### 7.2 Outils courants

1. **Nuxt DevTools (phase de développement)** :
    - Intégré à Nuxt 3.
    - Permet de visualiser les temps de réponse des Server Routes.
    - Prévisualisation **Open Graph** pour le SEO.
    - Panneau **Server Routes** pour surveiller les temps des appels API.

2. **Lighthouse / PageSpeed Insights (après déploiement)** :
    - Monitoring des Core Web Vitals (LCP, CLS, FID/INP).
    - Le LCP (Largest Contentful Paint) dépend fortement du TTFB du SSR.

3. **Monitoring côté Server (APM)** :
    - **Sentry / Datadog** : suivi des erreurs et performances côté Server.
    - **OpenTelemetry** : trace complète des requêtes (de Nuxt Server -> API Server -> DB).

### 7.3 Implémentation d'un simple suivi temporel

Un timer simple peut être implémenté dans `server/middleware` :

```typescript
// server/middleware/timing.ts
export default defineEventHandler((event) => {
  const start = performance.now();

  event.node.res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[${event.method}] ${event.path} - ${duration.toFixed(2)}ms`);

    // On peut aussi ajouter un header Server-Timing, visible dans les DevTools du navigateur
    // event.node.res.setHeader('Server-Timing', `total;dur=${duration}`);
  });
});
```

---

## 8. Résumé pour l'entretien

**Q : Comment suivre et surveiller les problèmes de performances SSR ?**
> En développement, j'utilise principalement **Nuxt DevTools** pour visualiser les temps de réponse des Server Routes et la taille des Payloads.
> En production, je surveille les **Core Web Vitals** (surtout le LCP) et le **TTFB**.
> Pour une analyse approfondie des goulots d'étranglement côté Server, j'utilise un Server Middleware personnalisé pour enregistrer les temps de requête et transmettre les données au navigateur via le header `Server-Timing`, ou j'intègre **Sentry** / **OpenTelemetry** pour un suivi de bout en bout.

**Q : Comment réduire le Bundle Size de Nuxt 3 ?**
> Je commence par analyser avec `nuxi analyze`. Pour les gros paquets (comme lodash), je fais du Tree Shaking ou un découpage manuel (`manualChunks`). Pour les composants non visibles au premier écran, j'utilise `<LazyComponent>` pour l'import dynamique.

**Q : Comment optimiser la vitesse SSR ?**
> L'essentiel est de réduire le TTFB. J'utilise les `routeRules` de Nitro pour configurer le cache côté Server (SWR). Les requêtes API sont parallélisées avec `Promise.all`. Les données non critiques sont configurées avec `lazy: true` pour être chargées côté Client.

**Q : Comment faire l'optimisation des images ?**
> J'utilise le module `@nuxt/image`, qui convertit automatiquement en WebP, adapte les dimensions et prend en charge le Lazy Loading, ce qui réduit considérablement le volume transféré.

**Q : Comment concilier défilement infini et SEO ?**
> Le défilement infini est défavorable au SEO. Pour les sites de contenu, je privilégie la pagination traditionnelle. Si le défilement infini est obligatoire, je rends la première page en SSR et j'indique la structure paginée aux crawlers via les Meta Tags (`rel="next"`), ou je fournis des liens de pagination en Noscript.
