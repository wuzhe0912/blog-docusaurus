---
title: '[Lv1] Основы SEO: Режим роутера и мета-теги'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> Базовая SEO-реализация для веб-приложений: чистые URL, базовые метаданные и структура страницы, удобная для краулеров.

---

## 1. Фокус на интервью

1. Почему режим роутинга важен для crawlability
2. Как структурировать базовые meta tags
3. Как валидировать SEO-результат в продакшене

## 2. Выбор режима роутера

### Почему предпочтителен history mode

Используйте history mode для чистых URL:

- Предпочтительно: `/products/123`
- Менее удачно: `/#/products/123`

Чистые URL удобнее для поисковых систем и пользователей.

### Необходимый server fallback

При использовании history mode настройте fallback на `index.html`:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Без этого deep link'и могут отдавать 404 при обновлении страницы.

## 3. Базовая настройка meta tags

Минимально включите:

- `title`
- `meta[name="description"]`
- Canonical URL
- Open Graph tags
- Twitter card tags

```html
<title>Product Detail | Brand</title>
<meta name="description" content="Compare product features, pricing, and delivery options." />
<link rel="canonical" href="https://example.com/products/123" />
<meta property="og:title" content="Product Detail | Brand" />
<meta property="og:description" content="Compare product features and pricing." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.com/products/123" />
<meta property="og:image" content="https://example.com/og/product-123.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

## 4. Чеклист для статических страниц

Для landing pages и campaign pages:

- Один понятный `h1`
- Семантическая иерархия заголовков
- Информативные title и description
- Осмысленный alt-текст для ключевых изображений
- Внутренние ссылки на связанные разделы

## 5. Частые ошибки

- Дублирующиеся title на разных страницах
- Отсутствующие или дублирующиеся canonical tags
- Переспам ключевыми словами в description
- Случайная блокировка индексируемых страниц в robots

## 6. Процесс валидации

- Просмотрите исходный код страницы и проверьте финальные head tags
- Используйте валидаторы предпросмотра соцсетей для OG tags
- Проверьте покрытие индексации в search console
- Отслеживайте органические страницы через performance-отчеты

## Краткое резюме для интервью

> Я начинаю с чистых URL на history-mode, полных базовых meta tags и корректного server fallback. Затем валидирую source output и поведение индексации, чтобы и краулеры, и пользователи получали стабильные и качественные метаданные страницы.
