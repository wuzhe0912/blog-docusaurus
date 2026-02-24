---
title: '[Lv2] Режимы рендеринга Nuxt 3: SSR, SSG, CSR и гибридная стратегия'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Выбор правильного режима рендеринга — это продуктовое решение, а не только техническое предпочтение.

---

## 1. Фокус на интервью

1. Четко объяснить SSR/SSG/CSR/hybrid
2. Связать бизнес-сценарии с выбором рендеринга
3. Обсудить trade-off'ы по SEO, актуальности данных и стоимости

## 2. Сравнение режимов рендеринга

| Mode | Render timing | SEO | Runtime server cost | Best for |
| --- | --- | --- | --- | --- |
| SSR | Per request | Strong | Higher | Dynamic SEO pages |
| SSG | Build time | Strong | Low | Mostly static content |
| CSR | Browser runtime | Weaker by default | Low | App-like dashboards |
| Hybrid | Per-route mix | Depends on route | Balanced | Large mixed products |

## 3. Базовая конфигурация Nuxt 3

### SSR включен

```ts
export default defineNuxtConfig({
  ssr: true,
});
```

### Только CSR режим

```ts
export default defineNuxtConfig({
  ssr: false,
});
```

### Гибридные правила маршрутов

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

## 4. Практическое руководство по выбору

Используйте SSR, когда:

- Контент страницы динамический и критичен для SEO
- Метаданные зависят от runtime-данных

Используйте SSG, когда:

- Контент меняется нечасто
- Нужна быстрая глобальная доставка через CDN

Используйте CSR, когда:

- SEO не в приоритете
- Приложение сильно интерактивно после логина

Используйте hybrid, когда:

- Публичным страницам нужно SEO
- Авторизованные зоны ведут себя как SPA

## 5. Частые ошибки

- Использование CSR для страниц, важных для индексации
- Использование SSR везде без стратегии кэширования
- Отсутствие разделения требований к маршрутам по их назначению

## Краткое резюме для интервью

> Я выбираю режим рендеринга по каждому маршруту на основе важности для SEO, свежести данных и инфраструктурной стоимости. В Nuxt 3 гибридные route rules обычно дают лучший баланс для реальных продуктов.
