---
title: '[Lv2] Modalità di rendering Nuxt 3: SSR, SSG, CSR e strategia ibrida'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Scegliere la modalità di rendering corretta è una decisione di prodotto, non solo una preferenza tecnica.

---

## 1. Focus da colloquio

1. Spiegare chiaramente SSR/SSG/CSR/ibrido
2. Mappare gli scenari di business alle scelte di rendering
3. Discutere i trade-off tra SEO, freschezza dei dati e costo

## 2. Confronto tra modalità di rendering

| Modalità | Momento del rendering | SEO | Costo server a runtime | Ideale per |
| --- | --- | --- | --- | --- |
| SSR | Per richiesta | Forte | Più alto | Pagine SEO dinamiche |
| SSG | Build time | Forte | Basso | Contenuti per lo più statici |
| CSR | Runtime browser | Più debole di default | Basso | Dashboard tipo app |
| Hybrid | Mix per rotta | Dipende dalla rotta | Bilanciato | Prodotti ampi e misti |

## 3. Basi di configurazione Nuxt 3

### SSR abilitato

```ts
export default defineNuxtConfig({
  ssr: true,
});
```

### Modalità solo CSR

```ts
export default defineNuxtConfig({
  ssr: false,
});
```

### Route rules ibride

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { prerender: true },
    '/products/**': { ssr: true },
    '/dashboard/**': { ssr: false },
  },
});
```

## 4. Guida pratica alla scelta

Usa SSR quando:

- Il contenuto pagina è dinamico e critico per la SEO
- I metadata dipendono da dati a runtime

Usa SSG quando:

- Il contenuto cambia raramente
- Vuoi una distribuzione globale rapida con CDN

Usa CSR quando:

- La SEO non è una priorità
- L'app è altamente interattiva dopo il login

Usa l'ibrido quando:

- Le pagine pubbliche richiedono SEO
- Le aree autenticate si comportano come una SPA

## 5. Errori comuni

- Usare CSR per pagine critiche per l'indicizzazione
- Usare SSR ovunque senza strategia di cache
- Non separare i requisiti delle rotte in base all'intento

## Sintesi pronta per il colloquio

> Scelgo la modalità di rendering per rotta in base all'importanza SEO, alla freschezza dei dati e al costo infrastrutturale. In Nuxt 3, le route rules ibride offrono di solito il miglior equilibrio per prodotti reali.
