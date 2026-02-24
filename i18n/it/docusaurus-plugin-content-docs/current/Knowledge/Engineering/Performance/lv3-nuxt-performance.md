---
title: '[Lv3] Ottimizzazione delle Prestazioni in Nuxt 3: Dimensione del Bundle, Velocità SSR e Distribuzione delle Immagini'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Una guida pratica per le prestazioni in Nuxt 3 che copre output di build, latenza del server rendering e distribuzione dei media.

---

## 1. Struttura del colloquio

1. Ottimizzazione della dimensione del bundle
2. Ottimizzazione SSR/TTFB
3. Ottimizzazione delle immagini
4. Strategia di rendering per grandi volumi di dati

## 2. Ottimizzazione della dimensione del bundle

### Analizzare prima

```bash
npx nuxi analyze
```

Identificare le dipendenze pesanti e la crescita dei chunk condivisi.

### Suddividere e caricare in modo lazy intenzionalmente

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('echarts')) return 'vendor-echarts';
            if (id.includes('lodash')) return 'vendor-lodash';
          },
        },
      },
    },
  },
});
```

- Utilizzare il lazy loading a livello di route e di componente
- Preferire import selettivi rispetto all'importazione dell'intera libreria

## 3. Velocità SSR e TTFB

### Evitare il waterfall bloccante del SSR

- Parallelizzare le chiamate API indipendenti
- Aggiungere caching per le API di lettura costose
- Spostare le richieste non critiche alla fase di hydration lato client

```ts
const [profile, metrics] = await Promise.all([
  $fetch('/api/profile'),
  $fetch('/api/metrics'),
]);
```

### Utilizzare il caching di Nitro dove appropriato

```ts
export default cachedEventHandler(
  async () => {
    return await fetchDashboardSnapshot();
  },
  { maxAge: 60 }
);
```

## 4. Distribuzione delle immagini

- Utilizzare `@nuxt/image` con formati moderni
- Impostare larghezza/altezza e `sizes` appropriati
- Caricare in modo lazy i media sotto la piega
- Servire da CDN vicino agli utenti

```vue
<NuxtImg
  src="/hero/banner.jpg"
  format="webp"
  width="1200"
  height="630"
  sizes="sm:100vw md:100vw lg:1200px"
  loading="lazy"
/>
```

## 5. Checklist di monitoraggio a runtime

- Payload JS per route
- TTFB e LCP in produzione
- Rapporto di cache hit
- Latenza p95 delle API
- Dimensione del trasferimento delle immagini e header di cache

## Riepilogo per il colloquio

> In Nuxt 3, ottimizzo analizzando prima la composizione del bundle, poi riducendo il JS di avvio tramite lazy loading e strategia dei chunk, migliorando il TTFB del SSR con fetch paralleli più cache, e distribuendo le immagini tramite `@nuxt/image` + CDN. Verifico con metriche di produzione, non con supposizioni.
