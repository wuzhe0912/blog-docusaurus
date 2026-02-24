---
title: '[Lv3] Лучшие практики Nuxt i18n и SEO'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> В SSR-проектах i18n SEO — это не только перевод. Сюда входят стратегия маршрутов, alternate-ссылки, canonical-политика и безопасное для hydration locale-состояние.

---

## 1. Фокус на интервью

1. Стратегия locale-маршрутов и crawlability
2. Корректность `hreflang` и canonical
3. SSR-определение locale и консистентность hydration

## 2. Стратегия маршрутов для многоязычного SEO

Предпочтительные подходы:

- Locale-префикс в каждом маршруте (`/en/about`, `/ja/about`)
- Стабильные URL для каждого locale
- Один canonical для каждой locale-страницы

Пример конфигурации Nuxt:

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'ja', iso: 'ja-JP', file: 'ja.json', name: 'Japanese' },
      { code: 'zh-tw', iso: 'zh-TW', file: 'zh-tw.json', name: 'Traditional Chinese' },
    ],
    lazy: true,
    langDir: 'locales',
  },
});
```

## 3. Alternate links и canonical tags

Каждая locale-страница должна отдавать:

- `rel="alternate"` с корректным `hreflang`
- `x-default` при необходимости
- Locale-specific canonical URL

Концепция output-примера:

- canonical для `en` страницы: `https://example.com/about`
- canonical для `ja` страницы: `https://example.com/ja/about`

## 4. SSR-определение locale

Типичные источники:

- URL-префикс
- Предпочтение в cookie
- Fallback по заголовку `Accept-Language`

Правила:

- Определяйте locale на сервере до рендера
- Сохраняйте тот же определенный locale для hydration
- Избегайте переключения locale во время первичной hydration

## 5. Политика контента и индексации

- Переводите содержательный контент, а не только UI-лейблы
- Локализуйте structured data там, где это важно
- Убедитесь, что sitemap включает локализованные URL
- Избегайте низкокачественных машинных переводов с thin content

## 6. Частые ошибки

- Нет парных `hreflang` между локалями
- Canonical всегда указывает на дефолтную локаль
- Неконсистентная locale между SSR и клиентом
- Не локализованы meta title/description

## Краткое резюме для интервью

> Я рассматриваю i18n SEO как архитектуру URL плюс корректность метаданных. Я фиксирую locale-specific маршруты, canonical и alternate ссылки и SSR-first определение locale, чтобы индексация и hydration оставались консистентными.
