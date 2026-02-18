---
title: '[Lv3] Nuxt 3 Performance Optimization: Bundle Size, SSR Speed, and Image Delivery'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> A practical Nuxt 3 performance playbook across build output, server rendering latency, and media delivery.

---

## 1. Interview structure

1. Bundle-size optimization
2. SSR/TTFB optimization
3. Image optimization
4. Large-data rendering strategy

## 2. Bundle-size optimization

### Analyze first

```bash
npx nuxi analyze
```

Identify heavy dependencies and shared chunk growth.

### Split and lazy-load intentionally

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

- Use route-level and component-level lazy loading
- Prefer selective imports over whole-library imports

## 3. SSR speed and TTFB

### Avoid blocking SSR waterfall

- Parallelize independent API calls
- Add caching for expensive read APIs
- Move non-critical requests to client-side hydration phase

```ts
const [profile, metrics] = await Promise.all([
  $fetch('/api/profile'),
  $fetch('/api/metrics'),
]);
```

### Use Nitro caching where suitable

```ts
export default cachedEventHandler(
  async () => {
    return await fetchDashboardSnapshot();
  },
  { maxAge: 60 }
);
```

## 4. Image delivery

- Use `@nuxt/image` with modern formats
- Set width/height and proper `sizes`
- Lazy-load below-the-fold media
- Serve from CDN near users

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

## 5. Runtime monitoring checklist

- Route-level JS payload
- TTFB and LCP in production
- Cache hit ratio
- API p95 latency
- Image transfer size and cache headers

## Interview-ready summary

> In Nuxt 3, I optimize by first analyzing bundle composition, then reducing startup JS through lazy loading and chunk strategy, improving SSR TTFB with parallel fetch plus cache, and delivering images via `@nuxt/image` + CDN. I validate with production metrics, not assumptions.
