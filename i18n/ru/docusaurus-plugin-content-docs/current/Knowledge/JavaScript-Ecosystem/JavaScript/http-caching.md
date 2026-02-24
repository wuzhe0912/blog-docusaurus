---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. Что такое HTTP-кеширование и почему оно важно?

> Что такое HTTP-кеширование? Почему оно важно?

HTTP-кеширование — это техника, которая временно сохраняет HTTP-ответы на клиентах (в браузерах) или промежуточных серверах, чтобы последующие запросы могли повторно использовать кешированные данные вместо обращения к серверу-источнику.

### Кеш vs Временное хранилище (Cache vs Temporary Storage)

В техническом контексте эти два термина часто путают, но они служат разным целям.

#### Кеш (Cache)

**Определение**: сохранённая копия, используемая для **оптимизации производительности**, с фокусом на повторное использование и быстрый доступ.

**Характеристики**:

- ✅ Цель: улучшение производительности
- ✅ Данные предполагается повторно использовать
- ✅ Явная стратегия истечения/ревалидации
- ✅ Обычно копия исходных данных

**Примеры**:

```javascript
// HTTP Cache — кеширование ответов API
Cache-Control: max-age=3600 // кеш на 1 час

// Memory Cache — кеширование результата вычисления
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n); // повторное использование кеша
  const result = /* вычисление */;
  cache.set(n, result);
  return result;
}
```

#### Временное хранилище (Temporary Storage)

**Определение**: данные, сохранённые для временных рабочих нужд, с акцентом на короткий жизненный цикл.

**Характеристики**:

- ✅ Цель: временное хранение
- ✅ Повторное использование не обязательно
- ✅ Обычно более короткий жизненный цикл
- ✅ Может содержать промежуточное состояние

**Примеры**:

```javascript
// sessionStorage — временные данные формы
sessionStorage.setItem('formData', JSON.stringify(form));

// временный путь загруженного файла
const tempFile = await uploadToTemp(file);
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### Сравнение (Comparison)

| Характеристика | Кеш | Временное хранилище |
| --- | --- | --- |
| Основная цель | Производительность | Временное хранение |
| Повторное использование | Да, часто многократное | Не гарантировано |
| Жизненный цикл | Управляется политикой | Обычно короткий |
| Типичное использование | HTTP cache, memory cache | sessionStorage, временные файлы |
| Английский термин | Cache | Temp / Temporary / Buffer |

#### Практическое разграничение

```javascript
// ===== Сценарии кеширования =====

// 1) HTTP cache: повторное использование ответа API
fetch('/api/users').then((response) => response.json());
fetch('/api/users').then((response) => response.json());

// 2) мемоизация (memoization cache)
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Сценарии временного хранения =====

// 1) сохранение черновика при закрытии страницы
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2) временная обработка загрузки
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file);
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath);
  return processed;
}

// 3) временные промежуточные результаты
const tempResults = [];
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults);
```

#### В веб-разработке

```javascript
// HTTP Cache (долгоживущий, повторно используемый)
Cache-Control: public, max-age=31536000, immutable

// sessionStorage (временный, привязан к вкладке)
sessionStorage.setItem('tempData', data)

// localStorage (постоянное хранение, не является в первую очередь слоем оптимизации кеша)
localStorage.setItem('userPreferences', prefs)
```

### Почему это различие важно

1. **Проектные решения**:
   - Нужна оптимизация производительности -> кеш
   - Нужно временное хранение -> временное хранилище
2. **Управление ресурсами**:
   - Кеш фокусируется на проценте попаданий и стратегии истечения
   - Временное хранилище фокусируется на времени очистки и ограничениях размера
3. **Ясность на собеседовании**:
   - Вопрос о производительности -> обсуждайте стратегию кеширования
   - Вопрос о временных данных -> обсуждайте стратегию временного хранения

Эта статья в основном фокусируется на **кеше**, особенно HTTP-кешировании.

### Преимущества кеширования (Benefits of Caching)

1. **Меньше сетевых запросов**
2. **Ниже нагрузка на сервер**
3. **Быстрее загрузка страниц**
4. **Меньше использование полосы пропускания**
5. **Лучший пользовательский опыт**

### Уровни кеша браузера (Browser Cache Layers)

```text
┌─────────────────────────────────────┐
│      Уровни кеша браузера           │
├─────────────────────────────────────┤
│  1. Memory Cache                    │
│     - Быстрейший, малая ёмкость     │
│     - Очищается при закрытии вкладки│
├─────────────────────────────────────┤
│  2. Disk Cache                      │
│     - Медленнее, большая ёмкость    │
│     - Постоянное хранение           │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - Полный контроль приложения    │
│     - Обеспечивает offline-поведение│
└─────────────────────────────────────┘
```

## 2. Какие стратегии HTTP-кеширования существуют?

> Какие стратегии кеширования существуют в HTTP?

### Категории стратегий (Strategy Categories)

```text
Стратегии HTTP-кеширования
├── Сильный кеш (Strong Cache / Fresh)
│   ├── Cache-Control
│   └── Expires
└── Кеш с валидацией (Validation Cache / Negotiation)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. Сильный кеш (Strong Cache)

**Поведение**: браузер отдаёт данные из локального кеша напрямую, не отправляя запрос на сервер.

#### `Cache-Control` (HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**Распространённые директивы**:

```javascript
// 1) max-age: время свежести в секундах
Cache-Control: max-age=3600

// 2) no-cache: разрешить кеширование, но требовать ревалидацию перед использованием
Cache-Control: no-cache

// 3) no-store: не кешировать совсем
Cache-Control: no-store

// 4) public: может кешироваться браузером/CDN/прокси
Cache-Control: public, max-age=31536000

// 5) private: кеш только в браузере
Cache-Control: private, max-age=3600

// 6) immutable: контент не изменится в течение срока свежести
Cache-Control: public, max-age=31536000, immutable

// 7) must-revalidate: после истечения необходимо ревалидировать
Cache-Control: max-age=3600, must-revalidate
```

#### `Expires` (HTTP/1.0, устаревший)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Проблемы**:

- Использует абсолютное время
- Зависит от корректности часов клиента
- В основном заменён `Cache-Control`

### 2. Кеш с валидацией (Validation Cache)

**Поведение**: браузер спрашивает сервер, изменился ли ресурс.

#### `Last-Modified` / `If-Modified-Since`

```http
# первый ответ
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# последующий запрос
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**Процесс**:

1. Первый запрос: сервер отправляет `Last-Modified`
2. Следующий запрос: браузер отправляет `If-Modified-Since`
3. Не изменился: сервер возвращает `304 Not Modified`
4. Изменился: сервер возвращает `200 OK` + новое тело

#### `ETag` / `If-None-Match`

```http
# первый ответ
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# последующий запрос
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Преимущества**:

- Более точный, чем `Last-Modified`
- Основан на контенте (хеш или токен версии)
- Может обнаруживать изменения, невидимые в секундных метках времени

### Last-Modified vs ETag

| Характеристика | Last-Modified | ETag |
| --- | --- | --- |
| Точность | Уровень секунд | Токен/хеш контента, более точный |
| Стоимость | Ниже | Может требовать дополнительных вычислений |
| Подходит для | Общих статических файлов | Точного контроля валидации |
| Приоритет | Ниже | Выше (`ETag` предпочтительнее при наличии обоих) |

## 3. Как работает кеширование браузера?

> Каков рабочий процесс кеша браузера?

### Полный рабочий процесс

```text
┌──────────────────────────────────────────────┐
│     Процесс запроса ресурсов браузером       │
└──────────────────────────────────────────────┘
                    ↓
         1. Проверить Memory Cache
                    ↓
            ┌───────┴────────┐
            │  Попадание?    │
            └───────┬────────┘
                Да  │ Нет
                    ↓
         2. Проверить Disk Cache
                    ↓
            ┌───────┴────────┐
            │  Попадание?    │
            └───────┬────────┘
                Да  │ Нет
                    ↓
         3. Проверить Service Worker
                    ↓
            ┌───────┴────────┐
            │  Попадание?    │
            └───────┬────────┘
                Да  │ Нет
                    ↓
         4. Проверить свежесть
                    ↓
            ┌───────┴────────┐
            │  Устарел?      │
            └───────┬────────┘
                Да  │ Нет
                    ↓
         5. Ревалидация с сервером
                    ↓
            ┌───────┴────────┐
            │  Изменён?      │
            └───────┬────────┘
                Да  │ Нет (304)
                    ↓
         6. Запросить новый контент
                    ↓
            ┌───────┴────────┐
            │  Вернуть 200   │
            │  с новым телом │
            └────────────────┘
```

### Практический пример

```javascript
// первый запрос
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// в течение 1 часа
// попадание в сильный кеш -> локальное использование, без запроса
// статус в devtools: from disk cache или from memory cache

// после 1 часа
GET /api/data.json
If-None-Match: "abc123"

// не изменился
Response:
  304 Not Modified

// изменился
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. Какие распространённые стратегии кеширования существуют?

> Распространённые практические стратегии кеширования

### 1. Долгоживущие статические ресурсы

```javascript
// HTML: без длительного кеширования, всегда валидировать
Cache-Control: no-cache

// CSS/JS с хешем: длительный неизменяемый кеш
Cache-Control: public, max-age=31536000, immutable
// имя файла: main.abc123.js
```

**Принцип**:

- HTML должен оставаться свежим для ссылки на последние хеши ресурсов
- Статические ресурсы с хешами могут кешироваться надолго
- Изменение контента -> изменение имени файла -> новая загрузка

### 2. Часто обновляемые ресурсы

```javascript
// Данные API: короткий кеш + ревалидация
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. Стратегии для изображений

```javascript
// аватары пользователей: средний кеш
Cache-Control: public, max-age=86400

// логотипы/иконки: более длительный кеш
Cache-Control: public, max-age=2592000

// динамические изображения: валидация
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. Рекомендуемые политики по типу ресурса

```javascript
const cachingStrategies = {
  html: 'Cache-Control: no-cache',
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',
  staticAssets: 'Cache-Control: public, max-age=2592000',
  apiData: 'Cache-Control: private, max-age=60',
  userData: 'Cache-Control: private, no-cache',
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Кеширование с Service Worker

> Кеширование с Service Worker

Service Worker даёт полный контроль над кешированием во время выполнения и offline-поведением.

### Базовое использование

```javascript
// регистрация Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// install: предварительное кеширование статических ресурсов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// fetch: пример cache-first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// activate: очистка старых кешей
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### Распространённые стратегии SW

#### 1. Cache First

```javascript
// лучше всего для статических ресурсов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First

```javascript
// лучше всего для API-запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate

```javascript
// лучше всего для быстрого ответа + фоновое обновление
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. Как реализовать cache busting?

> Как реализовать cache busting?

Cache busting гарантирует, что пользователи получают последние ресурсы при изменении контента.

### Способ 1: хеширование имени файла (рекомендуется)

```javascript
// с Webpack/Vite
// вывод: main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<script src="/js/main.abc123.js"></script>
```

**Плюсы**:

- ✅ Новое имя файла принуждает к загрузке
- ✅ Старые файлы остаются кешируемыми
- ✅ Лучшая практика индустрии

### Способ 2: версия через query-параметр

```html
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**Минусы**:

- ❌ Некоторые CDN/прокси по-разному обрабатывают кеширование с query-строкой
- ❌ Ручное управление версиями

### Способ 3: метка времени

```javascript
// обычно используется только в разработке
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**Случай использования**:

- обход кеша при разработке
- не идеально для продакшна

## 7. Распространённые вопросы по кешированию на собеседовании

> Распространённые вопросы по кешированию на собеседовании

### Вопрос 1: Как предотвратить кеширование HTML?

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

или HTML мета-теги:

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### Вопрос 2: Почему стоит использовать ETag вместо одного Last-Modified?

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Преимущества ETag**:

1. Более точный
2. Валидация на основе контента
3. Избегает пограничных случаев с меткой времени (повторный деплой с тем же контентом)
4. Лучше работает в распределённых системах с несинхронизированными часами

**Пример**:

```javascript
// контент не изменился, время деплоя изменилось
// Last-Modified меняется, но контент идентичен

ETag: 'hash-of-abc'; // стабилен, если контент не изменился
```

</details>

### Вопрос 3: разница между `from disk cache` и `from memory cache`?

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

| Характеристика | Memory Cache | Disk Cache |
| --- | --- | --- |
| Хранение | ОЗУ | Диск |
| Скорость | Очень быстрый | Медленнее |
| Ёмкость | Меньше | Больше |
| Постоянство | Обычно кратковременный | Постоянный |
| Приоритет | Выше | Ниже |

Типичный порядок загрузки (концептуально):

```text
1. Memory Cache
2. Service Worker Cache
3. Disk Cache
4. Ревалидация / Сеть
```

</details>

### Вопрос 4: как принудительно обновить ресурсы в браузере?

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Разработка**:

```javascript
// Hard Reload
// Отключить кеш в DevTools

const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**Продакшн**:

```javascript
// хешированные имена файлов (лучше всего)
main.abc123.js

// версия через query
<script src="/js/main.js?v=2.0.0"></script>

// политика кеширования
Cache-Control: no-cache
Cache-Control: no-store
```

</details>

### Вопрос 5: как реализовать offline-кеш в PWA?

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// sw.js
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/styles/offline.css',
        '/images/offline-icon.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

Полная стратегия PWA обычно сочетает:

```javascript
// 1) статические ресурсы: cache-first
// 2) API: network-first
// 3) изображения: cache-first
// 4) HTML-навигация: network-first + offline fallback
```

</details>

## 8. Лучшие практики (Best Practices)

> Лучшие практики

### ✅ Рекомендуется

```javascript
// 1. HTML: без длительного кеша для получения актуального входного документа
Cache-Control: no-cache

// 2. CSS/JS с хешем: длительный неизменяемый кеш
// пример имени файла: main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. Изображения: средний/длительный кеш
Cache-Control: public, max-age=2592000

// 4. Данные API: короткий кеш + валидация
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Service Worker для offline-поддержки
```

### ❌ Избегайте

```javascript
// плохо: длительный кеш для входного HTML-документа
Cache-Control: max-age=31536000

// плохо: полагаться только на Expires
Expires: Wed, 21 Oct 2025 07:28:00 GMT

// плохо: нет явных заголовков кеширования

// плохо: одна политика для всех типов ресурсов
Cache-Control: max-age=3600
```

### Дерево решений по стратегии кеширования

```text
Это статический ресурс?
├─ Да -> имя файла содержит хеш?
│        ├─ Да -> длительный неизменяемый кеш (max-age=31536000, immutable)
│        └─ Нет -> средний/длительный кеш (напр. max-age=2592000)
└─ Нет -> Это HTML?
         ├─ Да -> no-cache
         └─ Нет -> Это API?
                ├─ Да -> короткий кеш + валидация (max-age=60 + ETag)
                └─ Нет -> решайте по частоте обновлений
```

## Ссылки (Reference)

- [MDN - HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
