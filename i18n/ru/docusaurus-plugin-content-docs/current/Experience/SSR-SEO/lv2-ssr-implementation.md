---
title: '[Lv2] Реализация SSR: Загрузка данных и управление SEO-метаданными'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Практический паттерн SSR-реализации в Nuxt для динамических страниц: получать данные на сервере, рендерить полный HTML и генерировать route-specific метаданные.

---

## 1. Фокус на интервью

1. Стратегия server-first загрузки данных
2. Динамические метаданные из загруженного контента
3. Дедупликация и кэширование для производительности

## 2. Паттерны загрузки данных в SSR

### `useFetch` для прямой работы с API

```ts
const route = useRoute();

const { data: product, error } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`,
  server: true,
  lazy: false,
});
```

### `useAsyncData` для кастомной логики

```ts
const { data } = await useAsyncData(`article-${route.params.slug}`, async () => {
  const article = await $fetch(`/api/articles/${route.params.slug}`);
  return normalizeArticle(article);
});
```

## 3. Генерация dynamic head

Генерируйте метаданные из контента, полученного в SSR:

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

## 4. Обработка ошибок и status codes

Для SEO-критичных страниц возвращайте корректные коды ответа.

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product Not Found' });
}
```

## 5. Контроль производительности

- Дедуплицируйте одинаковые request keys
- Где возможно, кэшируйте стабильные ответы
- Не блокируйте SSR некритичными API-запросами
- Переносите пользовательские низкоприоритетные данные в клиентскую загрузку

## 6. Продакшен-чеклист

- SSR HTML содержит осмысленный контент до hydration
- Title и description специфичны для маршрута
- Canonical URL совпадает с публичным URL
- Страницы 404/410 возвращают реальные status codes
- Рендер остается стабильным при медленном API

## Краткое резюме для интервью

> Я загружаю SEO-критичный контент во время SSR, формирую из него метаданные и обеспечиваю корректные status codes. Затем оптимизирую через дедупликацию запросов и выборочное кэширование, чтобы сбалансировать качество и скорость.
