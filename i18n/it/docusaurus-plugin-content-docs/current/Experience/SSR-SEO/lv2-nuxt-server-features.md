---
title: '[Lv2] Funzionalità server Nuxt 3: server route e sitemap dinamica'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Le funzionalità server Nitro di Nuxt 3 ti permettono di sviluppare capacità backend orientate alla SEO direttamente nello stesso repository.

---

## 1. Focus da colloquio

1. Server route per logica backend sicura
2. Generazione dinamica della sitemap
3. Configurazione robots e controllo crawler

## 2. Server route in Nuxt 3

Esempi di mapping file:

- `server/api/products.ts` -> `/api/products`
- `server/routes/health.ts` -> `/health`

Casi d'uso tipici:

- Nascondere chiavi API private
- Normalizzare le risposte di terze parti
- Implementare pattern BFF per il frontend
- Gestire CORS e validazione richieste

```ts
// server/api/weather.ts
export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  return await $fetch(`https://example-weather.com?key=${config.weatherApiKey}`);
});
```

## 3. Sitemap dinamica

Una sitemap dovrebbe riflettere le rotte attualmente indicizzate.

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

## 4. Strategia Robots.txt

Usa una policy robots consapevole dell'ambiente.

- Produzione: consenti l'indicizzazione delle pagine pubbliche
- Staging/test: blocca tutti i crawler

```txt
User-agent: *
Disallow: /admin
Sitemap: https://example.com/sitemap.xml
```

## 5. Best practice operative

- Metti in cache la risposta sitemap con TTL breve
- Valida il formato XML in CI
- Mantieni gli URL canonical coerenti con la sitemap
- Monitora errori di crawl e indicizzazione nella search console

## Sintesi pronta per il colloquio

> Uso le server route di Nuxt per tenere i segreti lato server, generare output dinamici di sitemap/robots e allineare il controllo dei crawler con ambiente e ownership delle rotte.
