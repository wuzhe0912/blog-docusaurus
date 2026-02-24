---
title: '[Lv2] Серверные возможности Nuxt 3: Server Routes и динамический Sitemap'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Серверные возможности Nuxt 3 Nitro позволяют строить SEO-ориентированные backend-возможности прямо в том же репозитории.

---

## 1. Фокус на интервью

1. Server routes для безопасной backend-логики
2. Динамическая генерация sitemap
3. Конфигурация robots и контроль краулеров

## 2. Server routes в Nuxt 3

Примеры file mapping:

- `server/api/products.ts` -> `/api/products`
- `server/routes/health.ts` -> `/health`

Типичные сценарии использования:

- Скрытие приватных API-ключей
- Нормализация ответов сторонних сервисов
- Реализация BFF-паттернов для фронтенда
- Обработка CORS и валидация запросов

```ts
// server/api/weather.ts
export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  return await $fetch(`https://example-weather.com?key=${config.weatherApiKey}`);
});
```

## 3. Динамический sitemap

Sitemap должен отражать актуальные индексируемые маршруты.

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

## 4. Стратегия robots.txt

Используйте environment-aware политику robots.

- Production: разрешить индексацию публичных страниц
- Staging/test: блокировать всех краулеров

```txt
User-agent: *
Disallow: /admin
Sitemap: https://example.com/sitemap.xml
```

## 5. Операционные best practices

- Кэшируйте ответ sitemap с коротким TTL
- Валидируйте XML-формат в CI
- Держите canonical URL консистентными с sitemap
- Мониторьте crawl и ошибки индексации в search console

## Краткое резюме для интервью

> Я использую server routes Nuxt, чтобы держать секреты на сервере, генерировать динамические sitemap/robots и синхронизировать контроль краулеров с окружением и владением маршрутов.
