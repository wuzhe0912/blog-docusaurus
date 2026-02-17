---
title: '[Lv3] Defis d implementation SSR et solutions'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> Defis frequents lors d'une implementation SSR et approches robustes: Hydration Mismatch, variables d'environnement, compatibilite des bibliotheques tierces, performance et architecture de deploiement.

---

## Scenario d'entretien

**Question: Quels problemes avez-vous rencontres en SSR, et comment les avez-vous resolus?**

Ce que l'interviewer cherche a evaluer:

1. **Experience reelle**: SSR deja implemente en production ou non.
2. **Capacite de resolution**: analyse des causes et priorisation.
3. **Profondeur technique**: rendu, hydration, cache, exploitation.
4. **Bonnes pratiques**: solutions maintenables, mesurables, securisees.

---

## Defi 1: Hydration Mismatch

### Description du probleme

Alerte classique:

```text
[Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
```

Causes courantes:

- HTML genere cote serveur different de celui du client
- APIs navigateur utilisees sur le chemin SSR (`window`, `document`, `localStorage`)
- Valeurs non deterministes (`Date.now()`, `Math.random()`)

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

#### Option B: guard cote client

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

**Message entretien:** la sortie SSR doit etre deterministe; la logique navigateur doit etre isolee cote client.

---

## Defi 2: gestion des variables d environnement

### Description du probleme

- Les secrets serveur ne doivent jamais fuiter vers le client.
- Usage non structure de `process.env` -> comportement difficile a tracer.

### Solution

Separer via runtime config:

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

**Message entretien:** separer explicitement config publique et secrets d'exploitation.

---

## Defi 3: bibliotheques tierces non compatibles SSR

### Description du probleme

- Certaines libs accedent au DOM pendant le rendu SSR.
- Resultat: erreurs runtime/build ou mismatch d'hydration.

### Solutions

1. Charger uniquement cote client (plugin `.client.ts`)
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

## Defi 4: cookies et headers en SSR

### Description du probleme

- L'auth SSR depend de cookies lisibles cote serveur.
- Les headers doivent rester coherents entre client, SSR et API.

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

**Message entretien:** sans transmission correcte du contexte auth, le SSR devient incoherent.

---

## Defi 5: timing du chargement asynchrone

### Description du probleme

- Plusieurs composants demandent les memes donnees.
- Requetes dupliquees et etats de chargement incoherents.

### Solution

- `key` stable pour deduplication
- Composables partages pour centraliser la logique data
- Separation claire initial load vs user action

```ts
const { data, refresh } = await useFetch('/api/products', {
  key: 'products-list',
  lazy: false,
  server: true,
});
```

**Message entretien:** mutualiser le data flow au lieu de charger partout localement.

---

## Defi 6: performance et charge serveur

### Description du probleme

- Le SSR augmente la charge CPU/I/O.
- Sous charge, TTFB et stabilite se degradent.

### Solutions

1. Cache Nitro
2. Optimisation des requetes DB
3. Decoupage SSR/CSR selon l'enjeu SEO
4. Couche CDN correctement configuree

```ts
export default defineCachedEventHandler(
  async () => await getProductsFromDB(),
  { maxAge: 60 * 10, swr: true },
);
```

**Message entretien:** la performance SSR releve de l'architecture applicative et d'exploitation.

---

## Defi 7: gestion des erreurs et pages 404

### Description du probleme

- Les IDs de routes dynamiques peuvent etre invalides.
- Sans vrai status 404, risque d'indexation SEO erronee.

### Solution

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}
```

Complements:

- `error.vue` pour une UX claire
- pages d'erreur en `noindex, nofollow`

**Message entretien:** aligner HTTP status, UX et SEO.

---

## Defi 8: APIs navigateur uniquement

### Description du probleme

- En SSR, `window`/`document` n'existent pas.
- Acces direct -> erreurs runtime.

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

## Defi 9: Server-side Memory Leak

### Description du probleme

- Process Node long-lived avec consommation memoire croissante.
- Causes frequentes: etat global mutable, timers/listeners non nettoyes.

### Solutions

1. Eviter le state global lie aux requetes
2. Nettoyer listeners et intervals
3. Mesurer via heap snapshots + `process.memoryUsage()`

```ts
setInterval(() => {
  const mem = process.memoryUsage();
  console.log('rss', mem.rss);
}, 60_000);
```

**Message entretien:** en SSR, un leak memoire est un risque d'exploitation majeur.

---

## Defi 10: scripts publicitaires et tracking

### Description du probleme

- Les scripts tiers peuvent bloquer le main thread ou perturber hydration.
- Impact direct sur CLS/FID/INP.

### Solutions

- Chargement async et injection tardive
- Placeholders reserves pour stabiliser le layout
- Isoler les zones non critiques du parcours principal

```ts
useHead({
  script: [
    { src: 'https://example.com/tracker.js', async: true, tagPosition: 'bodyClose' },
  ],
});
```

**Message entretien:** monetisation et tracking ne doivent pas casser la stabilite du rendu.

---

## Defi 11: architecture de deploiement (SSR vs SPA)

### Description du probleme

- Le deploiement SPA est statique et simple.
- Le SSR exige couche compute, observabilite, process management.

### Comparatif

| Aspect           | SPA (Static)             | SSR (Node/Edge)                       |
| ---------------- | ------------------------ | ------------------------------------- |
| Infra            | Storage + CDN            | Compute + CDN                         |
| Exploitation     | Tres simple              | Complexite moyenne                    |
| Cout             | Faible                   | Plus eleve (temps compute)            |
| Monitoring       | Minimal                  | Logs, metrics, memoire, cold start    |

### Recommandations pratiques

1. PM2/containers pour stabilite process
2. CDN + Cache-Control bien calibres
3. Staging avec tests de charge avant prod
4. Alerting + error budget definis

**Message entretien:** le SSR est aussi un sujet d'exploitation, pas seulement de rendu.

---

## Synthese entretien

**Reponse possible en 30-45 secondes:**

> En SSR, je structure les risques en quatre blocs: rendu deterministe pour eviter les mismatch d'hydration, separation stricte des contextes serveur/client (config, cookies, headers), performance via deduplication + cache + SSR/CSR split, et robustesse d'exploitation avec gestion d'erreurs, monitoring memoire et architecture de deploiement adaptee.

**Checklist de reponse:**
- ✅ Nommer un probleme concret + sa cause
- ✅ Montrer la contre-mesure technique
- ✅ Expliquer l'impact SEO/perf/exploitation
- ✅ Conclure avec un contexte projet realiste
