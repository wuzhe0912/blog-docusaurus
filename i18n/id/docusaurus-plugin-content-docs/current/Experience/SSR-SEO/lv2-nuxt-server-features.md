---
title: '[Lv2] Fitur Server Nuxt 3: Server Routes dan Sitemap Dinamis'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Fitur server Nitro di Nuxt 3 memungkinkan Anda membangun kapabilitas backend yang sadar SEO langsung dalam repository yang sama.

---

## 1. Fokus wawancara

1. Server routes untuk logika backend yang aman
2. Pembuatan sitemap dinamis
3. Konfigurasi robots dan kontrol crawler

## 2. Server routes di Nuxt 3

Contoh pemetaan file:

- `server/api/products.ts` -> `/api/products`
- `server/routes/health.ts` -> `/health`

Use case umum:

- Menyembunyikan API key privat
- Menormalkan response pihak ketiga
- Mengimplementasikan pola BFF untuk frontend
- Menangani CORS dan validasi request

```ts
// server/api/weather.ts
export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  return await $fetch(`https://example-weather.com?key=${config.weatherApiKey}`);
});
```

## 3. Sitemap dinamis

Sitemap harus mencerminkan route yang saat ini terindeks.

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

## 4. Strategi Robots.txt

Gunakan kebijakan robots yang sadar environment.

- Production: izinkan indexing untuk halaman publik
- Staging/test: blokir semua crawler

```txt
User-agent: *
Disallow: /admin
Sitemap: https://example.com/sitemap.xml
```

## 5. Praktik operasional terbaik

- Cache response sitemap dengan TTL pendek
- Validasi format XML di CI
- Jaga canonical URL konsisten dengan sitemap
- Pantau error crawl dan indexing di search console

## Ringkasan siap wawancara

> Saya menggunakan server routes Nuxt untuk menjaga secret tetap di server, menghasilkan output sitemap/robots dinamis, dan menyelaraskan kontrol crawler dengan environment serta kepemilikan route.
