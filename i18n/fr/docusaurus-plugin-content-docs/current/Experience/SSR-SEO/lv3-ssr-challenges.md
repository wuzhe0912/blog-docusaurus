---
title: '[Lv3] Défis d implementation SSR et solutions'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> Défis fréquents lors d'une implémentation SSR et approches robustes: Hydration Mismatch, variables d'environnement, compatibilité des bibliothèques tierces, performance et architecture de déploiement.

---

## Scénario d'entretien

**Question: Quels problèmes avez-vous rencontrés en SSR, et comment les avez-vous résolus?**

Ce que l'interviewer cherche à évaluer:

1. **Expérience réelle**: SSR déjà implémenté en production ou non.
2. **Capacité de résolution**: analyse des causes et priorisation.
3. **Profondeur technique**: rendu, hydration, cache, exploitation.
4. **Bonnes pratiques**: solutions maintenables, mesurables, sécurisées.

---

## Défi 1: Hydration Mismatch

### Description du problème

Alerte classique:

```text
[Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
```

Causes courantes:

- HTML généré côté serveur différent de celui du client
- APIs navigateur utilisées sur le chemin SSR (`window`, `document`, `localStorage`)
- Valeurs non déterministes (`Date.now()`, `Math.random()`)

### Solutions

#### Option A: encapsuler avec `ClientOnly`

```vue
<template>
  <div>
    <h1>Contenu SSR</h1>
    <ClientOnly>
      <BrowserOnlyComponent />
      <template #fallback>
        <div>Chargement...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

#### Option B: guard côté client

```vue
<script setup lang="ts">
const ua = ref('');

onMounted(() => {
  if (process.client) {
    ua.value = window.navigator.userAgent;
  }
});
</script>
```

**Message entretien:** la sortie SSR doit être déterministe; la logique navigateur doit être isolée côté client.

---

## Défi 2: gestion des variables d'environnement

### Description du problème

- Les secrets serveur ne doivent jamais fuiter vers le client.
- Usage non structuré de `process.env` -> comportement difficile à tracer.

### Solution

Séparer via runtime config:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
});
```

```ts
const config = useRuntimeConfig();
const apiBase = config.public.apiBase; // client + server
const secret = config.apiSecret; // server only
```

**Message entretien:** séparer explicitement config publique et secrets d'exploitation.

---

## Défi 3: bibliothèques tierces non compatibles SSR

### Description du problème

- Certaines libs accèdent au DOM pendant le rendu SSR.
- Résultat: erreurs runtime/build ou mismatch d'hydration.

### Solutions

1. Charger uniquement côté client (plugin `.client.ts`)
2. Import dynamique dans un contexte client
3. Remplacer par une alternative SSR-friendly

```ts
let chartLib: any;
if (process.client) {
  chartLib = await import('chart.js/auto');
}
```

**Message entretien:** isoler la cause, puis choisir entre encapsulation client et remplacement de lib.

---

## Défi 4: cookies et headers en SSR

### Description du problème

- L'auth SSR dépend de cookies lisibles côté serveur.
- Les headers doivent rester cohérents entre client, SSR et API.

### Solution

```ts
const token = useCookie('access_token');

const { data } = await useFetch('/api/me', {
  headers: process.server
    ? useRequestHeaders(['cookie'])
    : undefined,
  credentials: 'include',
});
```

**Message entretien:** sans transmission correcte du contexte auth, le SSR devient incohérent.

---

## Défi 5: timing du chargement asynchrone

### Description du problème

- Plusieurs composants demandent les mêmes données.
- Requêtes dupliquées et états de chargement incohérents.

### Solution

- `key` stable pour déduplication
- Composables partagés pour centraliser la logique data
- Séparation claire initial load vs user action

```ts
const { data, refresh } = await useFetch('/api/products', {
  key: 'products-list',
  lazy: false,
  server: true,
});
```

**Message entretien:** mutualiser le data flow au lieu de charger partout localement.

---

## Défi 6: performance et charge serveur

### Description du problème

- Le SSR augmente la charge CPU/I/O.
- Sous charge, TTFB et stabilité se dégradent.

### Solutions

1. Cache Nitro
2. Optimisation des requêtes DB
3. Découpage SSR/CSR selon l'enjeu SEO
4. Couche CDN correctement configurée

```ts
export default defineCachedEventHandler(
  async () => await getProductsFromDB(),
  { maxAge: 60 * 10, swr: true },
);
```

**Message entretien:** la performance SSR relève de l'architecture applicative et d'exploitation.

---

## Défi 7: gestion des erreurs et pages 404

### Description du problème

- Les IDs de routes dynamiques peuvent être invalides.
- Sans vrai status 404, risque d'indexation SEO erronée.

### Solution

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}
```

Compléments:

- `error.vue` pour une UX claire
- pages d'erreur en `noindex, nofollow`

**Message entretien:** aligner HTTP status, UX et SEO.

---

## Défi 8: APIs navigateur uniquement

### Description du problème

- En SSR, `window`/`document` n'existent pas.
- Accès direct -> erreurs runtime.

### Solution

```ts
const width = ref<number | null>(null);

onMounted(() => {
  width.value = window.innerWidth;
});
```

Ou guard explicite:

```ts
if (process.client) {
  localStorage.setItem('theme', 'dark');
}
```

**Message entretien:** isoler strictement les APIs navigateur dans les phases client.

---

## Défi 9: Server-side Memory Leak

### Description du problème

- Process Node long-lived avec consommation mémoire croissante.
- Causes fréquentes: état global mutable, timers/listeners non nettoyés.

### Solutions

1. Éviter le state global lié aux requêtes
2. Nettoyer listeners et intervals
3. Mesurer via heap snapshots + `process.memoryUsage()`

```ts
setInterval(() => {
  const mem = process.memoryUsage();
  console.log('rss', mem.rss);
}, 60_000);
```

**Message entretien:** en SSR, un leak mémoire est un risque d'exploitation majeur.

---

## Défi 10: scripts publicitaires et tracking

### Description du problème

- Les scripts tiers peuvent bloquer le main thread ou perturber hydration.
- Impact direct sur CLS/FID/INP.

### Solutions

- Chargement async et injection tardive
- Placeholders réservés pour stabiliser le layout
- Isoler les zones non critiques du parcours principal

```ts
useHead({
  script: [
    { src: 'https://example.com/tracker.js', async: true, tagPosition: 'bodyClose' },
  ],
});
```

**Message entretien:** monétisation et tracking ne doivent pas casser la stabilité du rendu.

---

## Défi 11: architecture de déploiement (SSR vs SPA)

### Description du problème

- Le déploiement SPA est statique et simple.
- Le SSR exige couche compute, observabilité, process management.

### Comparatif

| Aspect           | SPA (Static)             | SSR (Node/Edge)                       |
| ---------------- | ------------------------ | ------------------------------------- |
| Infra            | Storage + CDN            | Compute + CDN                         |
| Exploitation     | Très simple              | Complexité moyenne                    |
| Coût             | Faible                   | Plus élevé (temps compute)            |
| Monitoring       | Minimal                  | Logs, metrics, mémoire, cold start    |

### Recommandations pratiques

1. PM2/containers pour stabilité process
2. CDN + Cache-Control bien calibrés
3. Staging avec tests de charge avant prod
4. Alerting + error budget définis

**Message entretien:** le SSR est aussi un sujet d'exploitation, pas seulement de rendu.

---

## Synthèse entretien

**Réponse possible en 30-45 secondes:**

> En SSR, je structure les risques en quatre blocs: rendu déterministe pour éviter les mismatch d'hydration, séparation stricte des contextes serveur/client (config, cookies, headers), performance via déduplication + cache + SSR/CSR split, et robustesse d'exploitation avec gestion d'erreurs, monitoring mémoire et architecture de déploiement adaptée.

**Checklist de réponse:**
- ✅ Nommer un problème concret + sa cause
- ✅ Montrer la contre-mesure technique
- ✅ Expliquer l'impact SEO/perf/exploitation
- ✅ Conclure avec un contexte projet réaliste
