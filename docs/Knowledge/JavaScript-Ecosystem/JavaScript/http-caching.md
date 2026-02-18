---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> What is HTTP caching? Why is it important?

HTTP caching is a technique that stores HTTP responses temporarily in clients (browsers) or intermediate servers, so later requests can reuse cached data instead of hitting the origin again.

### Cache vs Temporary Storage

In Chinese technical context, these two terms are often mixed, but they represent different purposes.

#### Cache

**Definition**: a stored copy used for **performance optimization**, focusing on reuse and faster access.

**Characteristics**:

- ✅ Goal: performance improvement
- ✅ Data is expected to be reused
- ✅ Explicit expiration/revalidation strategy
- ✅ Usually a copy of original data

**Examples**:

```javascript
// HTTP Cache - cache API responses
Cache-Control: max-age=3600 // cache 1 hour

// Memory Cache - cache computation result
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n); // reuse cache
  const result = /* compute */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage

**Definition**: data stored for temporary workflow needs, emphasizing short-lived lifecycle.

**Characteristics**:

- ✅ Goal: temporary retention
- ✅ Reuse is optional
- ✅ Usually shorter lifecycle
- ✅ May hold intermediate state

**Examples**:

```javascript
// sessionStorage - temporary form data
sessionStorage.setItem('formData', JSON.stringify(form));

// temporary upload file path
const tempFile = await uploadToTemp(file);
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### Comparison

| Feature | Cache | Temporary Storage |
| ------- | ----- | ----------------- |
| Primary goal | Performance | Temporary retention |
| Reuse | Yes, often repeated | Not guaranteed |
| Lifecycle | Policy-driven | Usually short |
| Typical use | HTTP cache, memory cache | sessionStorage, temp files |
| English term | Cache | Temp / Temporary / Buffer |

#### Practical distinction

```javascript
// ===== Cache scenarios =====

// 1) HTTP cache: reuse API response
fetch('/api/users').then((response) => response.json());
fetch('/api/users').then((response) => response.json());

// 2) memoization cache
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

// ===== Temporary storage scenarios =====

// 1) save draft on unload
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2) temporary upload processing
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file);
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath);
  return processed;
}

// 3) temporary intermediate results
const tempResults = [];
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults);
```

#### In web development

```javascript
// HTTP Cache (long-lived, reusable)
Cache-Control: public, max-age=31536000, immutable

// sessionStorage (temporary, tab-scoped)
sessionStorage.setItem('tempData', data)

// localStorage (persistent storage, not primarily a cache optimization layer)
localStorage.setItem('userPreferences', prefs)
```

### Why this distinction matters

1. **Design decisions**:
   - Need performance optimization -> cache
   - Need temporary persistence -> temp storage
2. **Resource management**:
   - Cache focuses on hit rate and expiration strategy
   - Temp storage focuses on cleanup timing and size limits
3. **Interview clarity**:
   - Performance question -> discuss caching strategy
   - Temporary data question -> discuss temp storage strategy

This article mainly focuses on **cache**, especially HTTP caching.

### Benefits of caching

1. **Fewer network requests**
2. **Lower server load**
3. **Faster page loads**
4. **Lower bandwidth usage**
5. **Better user experience**

### Browser cache layers

```text
┌─────────────────────────────────────┐
│         Browser Cache Layers        │
├─────────────────────────────────────┤
│  1. Memory Cache                    │
│     - Fastest, small capacity       │
│     - Cleared with tab/session end  │
├─────────────────────────────────────┤
│  2. Disk Cache                      │
│     - Slower, larger capacity       │
│     - Persistent storage            │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - Fully controlled by app       │
│     - Enables offline behavior      │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> What caching strategies exist in HTTP?

### Strategy categories

```text
HTTP Caching Strategies
├── Strong Cache (Fresh)
│   ├── Cache-Control
│   └── Expires
└── Validation Cache (Negotiation)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. Strong cache (fresh cache)

**Behavior**: browser serves from local cache directly without sending request to origin.

#### `Cache-Control` (HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**Common directives**:

```javascript
// 1) max-age: freshness lifetime in seconds
Cache-Control: max-age=3600

// 2) no-cache: allow caching but require revalidation before reuse
Cache-Control: no-cache

// 3) no-store: do not cache at all
Cache-Control: no-store

// 4) public: cacheable by browser/CDN/proxy
Cache-Control: public, max-age=31536000

// 5) private: browser cache only
Cache-Control: private, max-age=3600

// 6) immutable: content will not change during freshness lifetime
Cache-Control: public, max-age=31536000, immutable

// 7) must-revalidate: once stale, must revalidate
Cache-Control: max-age=3600, must-revalidate
```

#### `Expires` (HTTP/1.0, legacy)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Issues**:

- Uses absolute time
- Depends on client clock correctness
- Mostly replaced by `Cache-Control`

### 2. Validation cache (negotiation)

**Behavior**: browser asks server whether resource changed.

#### `Last-Modified` / `If-Modified-Since`

```http
# first response
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# subsequent request
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**Flow**:

1. First request: server sends `Last-Modified`
2. Next request: browser sends `If-Modified-Since`
3. Unchanged: server returns `304 Not Modified`
4. Changed: server returns `200 OK` + new body

#### `ETag` / `If-None-Match`

```http
# first response
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# subsequent request
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Advantages**:

- More precise than `Last-Modified`
- Content-driven (hash or version token)
- Can detect changes not visible in second-level timestamps

### Last-Modified vs ETag

| Feature | Last-Modified | ETag |
| ------- | ------------- | ---- |
| Precision | Second-level | Content token/hash, more precise |
| Cost | Lower | May require extra computation |
| Good for | General static files | Exact validation control |
| Priority | Lower | Higher (`ETag` preferred when both exist) |

## 3. How does browser caching work?

> What is the browser cache workflow?

### Full workflow

```text
┌──────────────────────────────────────────────┐
│            Browser Resource Request Flow      │
└──────────────────────────────────────────────┘
                    ↓
         1. Check Memory Cache
                    ↓
            ┌───────┴────────┐
            │   Hit cache?   │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. Check Disk Cache
                    ↓
            ┌───────┴────────┐
            │   Hit cache?   │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. Check Service Worker
                    ↓
            ┌───────┴────────┐
            │   Hit cache?   │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. Check freshness
                    ↓
            ┌───────┴────────┐
            │   Is stale?    │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. Revalidate with server
                    ↓
            ┌───────┴────────┐
            │   Modified?     │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. Request new content
                    ↓
            ┌───────┴────────┐
            │   Return 200    │
            │   with new body │
            └────────────────┘
```

### Practical example

```javascript
// first request
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// within 1 hour
// strong cache hit -> local use, no request
// status shown by devtools: from disk cache or from memory cache

// after 1 hour
GET /api/data.json
If-None-Match: "abc123"

// unchanged
Response:
  304 Not Modified

// changed
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are common caching strategies?

> Common practical caching strategies

### 1. Long-lived static assets

```javascript
// HTML: no long cache, always validate
Cache-Control: no-cache

// CSS/JS with hash: long immutable cache
Cache-Control: public, max-age=31536000, immutable
// filename: main.abc123.js
```

**Principle**:

- HTML should stay fresh to reference latest asset hashes
- Hashed static assets can be cached for a long time
- Content change -> filename change -> new download

### 2. Frequently updated resources

```javascript
// API data: short cache + revalidation
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. Image strategies

```javascript
// user avatars: medium cache
Cache-Control: public, max-age=86400

// logo/icons: longer cache
Cache-Control: public, max-age=2592000

// dynamic images: validation
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. Suggested policies by resource type

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

## 5. Service Worker caching

> Service Worker caching

Service Worker gives full control over runtime caching and offline behavior.

### Basic usage

```javascript
// register Service Worker
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

// install: precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// fetch: cache-first example
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// activate: cleanup old caches
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

### Common SW strategies

#### 1. Cache First

```javascript
// best for static assets
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
// best for API requests
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
// best for fast response + background update
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

## 6. How to implement cache busting?

> How to implement cache busting?

Cache busting ensures users fetch the latest assets when content changes.

### Method 1: filename hashing (recommended)

```javascript
// with Webpack/Vite
// output: main.abc123.js

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

**Pros**:

- ✅ New filename forces download
- ✅ Old files remain cacheable
- ✅ Industry best practice

### Method 2: query version

```html
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**Cons**:

- ❌ Some CDNs/proxies treat query-string caching differently
- ❌ Manual version maintenance

### Method 3: timestamp

```javascript
// common in development only
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**Use case**:

- development cache bypass
- not ideal for production

## 7. Common caching interview questions

> Common caching interview questions

### Question 1: How to prevent HTML from being cached?

<details>
<summary>Click to view answer</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

or HTML meta tags:

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### Question 2: Why use ETag instead of only Last-Modified?

<details>
<summary>Click to view answer</summary>

**Advantages of ETag**:

1. More precise
2. Content-based validation
3. Avoids timestamp edge cases (re-deploy with same content)
4. Better in distributed systems with unsynced clocks

**Example**:

```javascript
// content unchanged, deployment time changed
// Last-Modified changes, but content is identical

ETag: 'hash-of-abc'; // stable if content unchanged
```

</details>

### Question 3: difference between `from disk cache` and `from memory cache`?

<details>
<summary>Click to view answer</summary>

| Feature | Memory Cache | Disk Cache |
| ------- | ------------ | ---------- |
| Storage | RAM | Disk |
| Speed | Very fast | Slower |
| Capacity | Smaller | Larger |
| Persistence | Usually short-lived | Persistent |
| Priority | Higher | Lower |

Typical loading order (conceptual):

```text
1. Memory Cache
2. Service Worker Cache
3. Disk Cache
4. Revalidation / Network
```

</details>

### Question 4: how to force browser reload resources?

<details>
<summary>Click to view answer</summary>

**Development**:

```javascript
// Hard Reload
// Disable cache in DevTools

const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**Production**:

```javascript
// hashed filenames (best)
main.abc123.js

// version query
<script src="/js/main.js?v=2.0.0"></script>

// cache policy
Cache-Control: no-cache
Cache-Control: no-store
```

</details>

### Question 5: how to implement offline cache in PWA?

<details>
<summary>Click to view answer</summary>

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

Full PWA strategy often combines:

```javascript
// 1) static assets: cache-first
// 2) API: network-first
// 3) images: cache-first
// 4) HTML navigation: network-first + offline fallback
```

</details>

## 8. Best practices

> Best practices

### ✅ Recommended

```javascript
// 1. HTML: no long cache to ensure latest entry document
Cache-Control: no-cache

// 2. CSS/JS with hash: long immutable cache
// filename example: main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. Images: medium/long cache
Cache-Control: public, max-age=2592000

// 4. API data: short cache + validation
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Service Worker for offline support
```

### ❌ Avoid

```javascript
// bad: long cache for HTML entry document
Cache-Control: max-age=31536000

// bad: relying only on Expires
Expires: Wed, 21 Oct 2025 07:28:00 GMT

// bad: no explicit cache headers

// bad: same policy for all resource types
Cache-Control: max-age=3600
```

### Cache strategy decision tree

```text
Is it static asset?
├─ Yes -> filename has hash?
│        ├─ Yes -> long immutable cache (max-age=31536000, immutable)
│        └─ No -> medium/long cache (e.g. max-age=2592000)
└─ No -> Is it HTML?
         ├─ Yes -> no-cache
         └─ No -> Is it API?
                ├─ Yes -> short cache + validation (max-age=60 + ETag)
                └─ No -> decide by update frequency
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
