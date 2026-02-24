---
title: '[Lv2] Implementazione SSR: data fetching e gestione meta SEO'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Un pattern pratico di implementazione SSR con Nuxt per pagine dinamiche: recupera dati sul server, renderizza HTML completo e genera metadata specifici per rotta.

---

## 1. Focus da colloquio

1. Strategia di data fetching server-first
2. Metadata dinamici dal contenuto recuperato
3. Deduplicazione e caching per le performance

## 2. Pattern di data fetching SSR

### `useFetch` per uso diretto delle API

```ts
const route = useRoute();

const { data: product, error } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`,
  server: true,
  lazy: false,
});
```

### `useAsyncData` per logica personalizzata

```ts
const { data } = await useAsyncData(`article-${route.params.slug}`, async () => {
  const article = await $fetch(`/api/articles/${route.params.slug}`);
  return normalizeArticle(article);
});
```

## 3. Generazione dinamica della head

Genera metadata dal contenuto recuperato via SSR:

```ts
useHead(() => ({
  title: product.value?.name || 'Product',
  meta: [
    { name: 'description', content: product.value?.summary || '' },
    { property: 'og:title', content: product.value?.name || '' },
    { property: 'og:description', content: product.value?.summary || '' },
    { property: 'og:image', content: product.value?.image || '' },
  ],
  link: [{ rel: 'canonical', href: `https://example.com/products/${route.params.id}` }],
}));
```

## 4. Gestione errori e status code

Per le pagine critiche per SEO, restituisci codici di risposta corretti.

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product Not Found' });
}
```

## 5. Controlli di performance

- Deduplica le stesse request key
- Metti in cache le risposte stabili quando possibile
- Evita di bloccare SSR con chiamate API non critiche
- Sposta i dati utente a bassa priorità nel fetch client

## 6. Checklist di produzione

- L'HTML SSR include contenuto significativo prima della hydration
- Titolo e descrizione pagina sono specifici per rotta
- L'URL canonical coincide con l'URL pubblico
- Le pagine 404/410 restituiscono status code reali
- Il rendering resta stabile con API lente

## Sintesi pronta per il colloquio

> Recupero il contenuto critico per SEO durante SSR, derivo i metadata da quel contenuto e applico status code corretti. Poi ottimizzo con deduplicazione delle richieste e caching selettivo per bilanciare qualità e velocità.
