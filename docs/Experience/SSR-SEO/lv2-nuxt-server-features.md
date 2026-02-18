---
title: '[Lv2] Nuxt 3 Server Features: Server Routes and Dynamic Sitemap'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Nuxt 3 Nitro server features let you build SEO-aware backend capabilities directly in the same repository.

---

## 1. Interview focus

1. Server routes for secure backend logic
2. Dynamic sitemap generation
3. Robots configuration and crawler control

## 2. Server routes in Nuxt 3

File mapping examples:

- `server/api/products.ts` -> `/api/products`
- `server/routes/health.ts` -> `/health`

Typical use cases:

- Hide private API keys
- Normalize third-party responses
- Implement BFF patterns for frontend
- Handle CORS and request validation

```ts
// server/api/weather.ts
export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  return await $fetch(`https://example-weather.com?key=${config.weatherApiKey}`);
});
```

## 3. Dynamic sitemap

A sitemap should reflect current indexed routes.

```ts
// server/routes/sitemap.xml.ts
export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8');
  const urls = await getPublishedUrls();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`)
  .join('')}
</urlset>`;
  return body;
});
```

## 4. Robots.txt strategy

Use environment-aware robots policy.

- Production: allow indexing for public pages
- Staging/test: block all crawlers

```txt
User-agent: *
Disallow: /admin
Sitemap: https://example.com/sitemap.xml
```

## 5. Operational best practices

- Cache sitemap response for a short TTL
- Validate XML format in CI
- Keep canonical URLs consistent with sitemap
- Monitor crawl and indexing errors in search console

## Interview-ready summary

> I use Nuxt server routes to keep secrets server-side, generate dynamic sitemap/robots outputs, and align crawler controls with environment and route ownership.
