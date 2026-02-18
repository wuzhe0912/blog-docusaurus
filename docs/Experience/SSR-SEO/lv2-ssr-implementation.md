---
title: '[Lv2] SSR Implementation: Data Fetching and SEO Meta Management'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> A practical Nuxt SSR implementation pattern for dynamic pages: fetch data on server, render complete HTML, and generate route-specific metadata.

---

## 1. Interview focus

1. Server-first data fetching strategy
2. Dynamic metadata from fetched content
3. Deduplication and caching for performance

## 2. SSR data fetching patterns

### `useFetch` for direct API usage

```ts
const route = useRoute();

const { data: product, error } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`,
  server: true,
  lazy: false,
});
```

### `useAsyncData` for custom logic

```ts
const { data } = await useAsyncData(`article-${route.params.slug}`, async () => {
  const article = await $fetch(`/api/articles/${route.params.slug}`);
  return normalizeArticle(article);
});
```

## 3. Dynamic head generation

Generate metadata from SSR-fetched content:

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

## 4. Error handling and status codes

For SEO-critical pages, return proper response codes.

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product Not Found' });
}
```

## 5. Performance controls

- Deduplicate same request keys
- Cache stable responses where possible
- Avoid blocking SSR with non-critical API calls
- Move user-specific low-priority data to client fetch

## 6. Production checklist

- SSR HTML includes meaningful content before hydration
- Page title and description are route-specific
- Canonical URL matches public URL
- 404/410 pages return real status codes
- Rendering remains stable under slow API conditions

## Interview-ready summary

> I fetch SEO-critical content during SSR, derive metadata from that content, and enforce proper status codes. Then I optimize with request deduplication and selective caching to balance quality and speed.
