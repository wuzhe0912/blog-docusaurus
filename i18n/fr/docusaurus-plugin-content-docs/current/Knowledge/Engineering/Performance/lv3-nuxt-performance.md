---
title: '[Lv3] Optimisation des performances Nuxt 3 : Bundle Size, vitesse SSR et optimisation des images'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Guide complet d'optimisation des performances Nuxt 3 : de la reduction du Bundle Size a l'optimisation de la vitesse SSR et des strategies de chargement des images, pour une experience de performance optimale.

---

## 1. Axes principaux de la reponse en entretien

1. **Optimisation du Bundle Size** : analyse (`nuxi analyze`), decoupage (`SplitChunks`), Tree Shaking, chargement differe (Lazy Loading).
2. **Optimisation de la vitesse SSR (TTFB)** : cache Redis, Nitro Cache, reduction des appels API bloquants, Streaming SSR.
3. **Optimisation des images** : `@nuxt/image`, format WebP, CDN, Lazy Loading.
4. **Optimisation des grandes quantites de donnees** : Virtual Scrolling, defilement infini (Infinite Scroll), pagination (Pagination).

---

## 2. Comment reduire le Bundle Size de Nuxt 3 ?

### 2.1 Outils de diagnostic

Tout d'abord, il faut identifier ou se situe le goulot d'etranglement. Utilisez `nuxi analyze` pour visualiser la structure du Bundle.

```bash
npx nuxi analyze
```

Cela genere un rapport montrant quels paquets occupent le plus d'espace.

### 2.2 Strategies d'optimisation

#### 1. Code Splitting (decoupage du code)
Nuxt 3 effectue deja par defaut un Code Splitting base sur les routes (Route-based). Mais pour les gros paquets (comme ECharts, Lodash), une optimisation manuelle est necessaire.

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

#### 2. Tree Shaking et import a la demande
Assurez-vous d'importer uniquement les modules necessaires, et non le paquet entier.

```typescript
// ❌ Mauvais : importer tout lodash
import _ from 'lodash';
_.debounce(() => {}, 100);

// ✅ Correct : importer uniquement debounce
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// ✅ Recommande : utiliser vueuse (specifique a Vue et Tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. Lazy Loading des composants
Pour les composants non necessaires au premier ecran, utilisez le prefixe `Lazy` pour l'import dynamique.

```vue
<template>
  <div>
    <!-- Le code du composant n'est charge que lorsque show est true -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. Supprimer les paquets inutiles cote Server
Assurez-vous que les paquets utilises uniquement cote Server (pilotes de base de donnees, operations fs) ne sont pas inclus dans le bundle Client. Nuxt 3 gere automatiquement les fichiers se terminant par `.server.ts`, ou utilise le repertoire `server/`.

---

## 3. Comment optimiser la vitesse SSR (TTFB) ?

### 3.1 Pourquoi le TTFB est-il trop long ?
Le TTFB (Time To First Byte) est l'indicateur cle des performances SSR. Les causes courantes d'un TTFB trop long :
1. **API lentes** : le Server attend la reponse du back-end avant de pouvoir rendre le HTML.
2. **Requetes en serie** : les appels API sont executes les uns apres les autres au lieu d'etre parallelises.
3. **Calculs lourds** : le Server execute trop de taches intensives en CPU.

### 3.2 Solutions d'optimisation

#### 1. Cache cote Server (Nitro Cache)
Utilisez les fonctionnalites de cache de Nitro pour mettre en cache les reponses API ou les resultats du rendu.

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

#### 2. Requetes paralleles (Parallel Fetching)
Utilisez `Promise.all` pour envoyer plusieurs requetes en parallele, au lieu de les `await` une par une.

```typescript
// ❌ Lent : execution en serie (temps total = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// ✅ Rapide : execution parallele (temps total = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. Differement des donnees non critiques (Lazy Fetching)
Les donnees non necessaires au premier ecran peuvent etre chargees cote Client (`lazy: true`), evitant ainsi de bloquer le SSR.

```typescript
// Les commentaires n'ont pas besoin de SEO, chargement cote Client
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false, // Ne pas executer du tout cote Server
});
```

#### 4. Streaming SSR (experimental)
Nuxt 3 supporte le HTML Streaming, permettant d'envoyer le contenu au fur et a mesure du rendu, pour que l'utilisateur voie le contenu plus rapidement.

---

## 4. Optimisation des images avec Nuxt 3

### 4.1 Utilisation de @nuxt/image
Le module officiel `@nuxt/image` est la meilleure solution, offrant :
- **Conversion automatique de format** : conversion automatique en WebP/AVIF.
- **Redimensionnement automatique** : generation d'images aux dimensions adaptees a la taille de l'ecran.
- **Lazy Loading** : chargement differe integre.
- **Integration CDN** : support de Cloudinary, Imgix et d'autres fournisseurs.

### 4.2 Exemple d'implementation

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    // Options par defaut
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

## 5. Pagination et defilement pour de grandes quantites de donnees

### 5.1 Choix de la solution
Pour de grandes quantites de donnees (ex. 10 000 produits), trois strategies principales, avec prise en compte du **SEO** :

| Strategie | Cas d'utilisation | Compatibilite SEO |
| :--- | :--- | :--- |
| **Pagination traditionnelle** | Listes e-commerce, listes d'articles | Excellente (meilleure) |
| **Defilement infini** | Fil social, mur d'images | Faible (traitement special necessaire) |
| **Virtual Scrolling** | Rapports complexes, listes tres longues | Tres faible (contenu absent du DOM) |

### 5.2 Comment maintenir le SEO avec le defilement infini ?
Avec le defilement infini, les moteurs de recherche ne peuvent generalement indexer que la premiere page. Solutions :
1. **Combiner avec un mode pagine** : fournir la balise `<link rel="next" href="...">` pour que le crawler connaisse la page suivante.
2. **Fallback Noscript** : fournir une version paginee traditionnelle dans `<noscript>` pour les crawlers.
3. **Bouton "Charger plus"** : le SSR rend les 20 premieres lignes, le reste est charge par un clic sur "Charger plus" ou par defilement via un Client-side fetch.

### 5.3 Exemple d'implementation (Load More + SEO)

```vue
<script setup>
// Donnees du premier ecran (SSR)
const page = ref(1);
const { data: posts } = await useFetch('/api/posts', {
  query: { page: page.value }
});

// Chargement supplementaire cote Client
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

### 6.1 Description du probleme
En environnement SSR, l'utilisation d'`IntersectionObserver` pour le Lazy Loading provoque des erreurs ou un Hydration Mismatch, car le Server n'a pas d'objet `window` ou `document`.

### 6.2 Solutions

#### 1. Utiliser les composants integres de Nuxt
- `<LazyComponent>`
- `<NuxtImg loading="lazy">`

#### 2. Directive personnalisee (avec gestion du SSR)

```typescript
// plugins/lazy-load.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      // Execution uniquement cote Client
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value;
          observer.disconnect();
        }
      });
      observer.observe(el);
    },
    getSSRProps(binding) {
      // Rendu cote Server : placeholder ou image originale (selon les besoins SEO)
      return {
        src: 'placeholder.png'
      };
    }
  });
});
```

---

## 7. Monitoring et suivi des performances SSR

### 7.1 Pourquoi le monitoring est-il necessaire ?
Les goulots d'etranglement des applications SSR se situent souvent cote Server, invisibles dans les DevTools du navigateur. Sans monitoring, il est difficile de determiner si des reponses API lentes, des Memory Leaks ou une charge CPU elevee sont responsables d'un TTFB degrade.

### 7.2 Outils courants

1. **Nuxt DevTools (phase de developpement)** :
    - Integre a Nuxt 3.
    - Permet de visualiser les temps de reponse des Server Routes.
    - Previsualisation **Open Graph** pour le SEO.
    - Panneau **Server Routes** pour surveiller les temps des appels API.

2. **Lighthouse / PageSpeed Insights (apres deploiement)** :
    - Monitoring des Core Web Vitals (LCP, CLS, FID/INP).
    - Le LCP (Largest Contentful Paint) depend fortement du TTFB du SSR.

3. **Monitoring cote Server (APM)** :
    - **Sentry / Datadog** : suivi des erreurs et performances cote Server.
    - **OpenTelemetry** : trace complete des requetes (de Nuxt Server -> API Server -> DB).

### 7.3 Implementation d'un simple suivi temporel

Un timer simple peut etre implemente dans `server/middleware` :

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

## 8. Resume pour l'entretien

**Q : Comment suivre et surveiller les problemes de performances SSR ?**
> En developpement, j'utilise principalement **Nuxt DevTools** pour visualiser les temps de reponse des Server Routes et la taille des Payloads.
> En production, je surveille les **Core Web Vitals** (surtout le LCP) et le **TTFB**.
> Pour une analyse approfondie des goulots d'etranglement cote Server, j'utilise un Server Middleware personnalise pour enregistrer les temps de requete et transmettre les donnees au navigateur via le header `Server-Timing`, ou j'integre **Sentry** / **OpenTelemetry** pour un suivi de bout en bout.

**Q : Comment reduire le Bundle Size de Nuxt 3 ?**
> Je commence par analyser avec `nuxi analyze`. Pour les gros paquets (comme lodash), je fais du Tree Shaking ou un decoupage manuel (`manualChunks`). Pour les composants non visibles au premier ecran, j'utilise `<LazyComponent>` pour l'import dynamique.

**Q : Comment optimiser la vitesse SSR ?**
> L'essentiel est de reduire le TTFB. J'utilise les `routeRules` de Nitro pour configurer le cache cote Server (SWR). Les requetes API sont parallelisees avec `Promise.all`. Les donnees non critiques sont configurees avec `lazy: true` pour etre chargees cote Client.

**Q : Comment faire l'optimisation des images ?**
> J'utilise le module `@nuxt/image`, qui convertit automatiquement en WebP, adapte les dimensions et prend en charge le Lazy Loading, ce qui reduit considerablement le volume transfere.

**Q : Comment concilier defilement infini et SEO ?**
> Le defilement infini est defavorable au SEO. Pour les sites de contenu, je privilegie la pagination traditionnelle. Si le defilement infini est obligatoire, je rends la premiere page en SSR et j'indique la structure paginee aux crawlers via les Meta Tags (`rel="next"`), ou je fournis des liens de pagination en Noscript.
