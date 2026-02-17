---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> 什么是 HTTP 缓存？为什么它很重要？

HTTP 缓存是一种在客户端（浏览器）或中间服务器暂时存储 HTTP 响应的技术，目的是在后续请求时可以直接使用缓存的数据，而不需要再次向服务器请求。

### 缓存 vs 暂存：有什么不同？

在中文技术文档中，这两个词经常被混用，但实际上有不同的含义：

#### Cache（缓存）

**定义**：为了**性能优化**而存储的数据副本，强调「重复使用」和「加速访问」。

**特点**：

- ✅ 目的是提升性能
- ✅ 数据可以被重复使用
- ✅ 有明确的过期策略
- ✅ 通常是原始数据的副本

**示例**：

```javascript
// HTTP Cache - 缓存 API 响应
Cache-Control: max-age=3600  // 缓存 1 小时

// Memory Cache - 缓存计算结果
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);  // 重复使用缓存
  const result = /* 计算 */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage（暂存）

**定义**：**临时存储**的数据，强调「暂时性」和「会被清除」。

**特点**：

- ✅ 目的是临时保存
- ✅ 不一定会被重复使用
- ✅ 生命周期通常较短
- ✅ 可能包含中间状态

**示例**：

```javascript
// sessionStorage - 暂存用户输入
sessionStorage.setItem('formData', JSON.stringify(form)); // 关闭标签页即清除

// 暂存文件上传
const tempFile = await uploadToTemp(file); // 处理完就删除
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### 对照表

| 特性         | Cache（缓存）            | Temporary Storage（暂存） |
| ------------ | ------------------------ | ------------------------- |
| **主要目的** | 性能优化                 | 临时保存                  |
| **重复使用** | 是，多次读取             | 不一定                    |
| **生命周期** | 根据策略决定             | 通常较短                  |
| **典型用途** | HTTP Cache, Memory Cache | sessionStorage, 暂存文件  |
| **英文对应** | Cache                    | Temp / Temporary / Buffer |

#### 实际应用中的区别

```javascript
// ===== Cache（缓存）的使用场景 =====

// 1. HTTP 缓存：重复使用 API 响应
fetch('/api/users') // 第一次请求
  .then((response) => response.json());

fetch('/api/users') // 第二次从缓存读取
  .then((response) => response.json());

// 2. 计算结果缓存
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // 重复使用
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Temporary Storage（暂存）的使用场景 =====

// 1. 表单数据暂存（防止意外关闭）
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2. 上传文件暂存
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file); // 暂存
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath); // 用完即删
  return processed;
}

// 3. 中间计算结果暂存
const tempResults = []; // 暂存中间结果
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults); // 用完就不需要了
```

#### 在 Web 开发中的应用

```javascript
// HTTP Cache（缓存）- 长期存储，重复使用
Cache-Control: public, max-age=31536000, immutable
// → 浏览器会缓存这个文件一年，重复使用

// sessionStorage（暂存）- 临时存储，关闭即清
sessionStorage.setItem('tempData', data);
// → 只在当前标签页有效，关闭就清除

// localStorage（长期存储）- 介于两者之间
localStorage.setItem('userPreferences', prefs);
// → 持久化存储，但不是为了性能优化
```

### 为什么区分这两个概念很重要？

1. **设计决策**：

   - 需要性能优化？ → 使用缓存
   - 需要临时保存？ → 使用暂存

2. **资源管理**：

   - 缓存：注重命中率、过期策略
   - 暂存：注重清理时机、容量限制

3. **面试回答**：

   - 问「如何优化性能」→ 谈缓存策略
   - 问「如何处理临时数据」→ 谈暂存方案

在本文中，我们主要讨论的是 **Cache（缓存）**，特别是 HTTP 缓存机制。

### 缓存的好处

1. **减少网络请求**：直接从本地缓存读取，不需要发送 HTTP 请求
2. **降低服务器负载**：减少服务器需要处理的请求数量
3. **加快页面加载速度**：本地缓存读取速度远快于网络请求
4. **节省带宽**：减少数据传输量
5. **改善用户体验**：页面响应更快，使用更流畅

### 缓存的类型

```text
┌─────────────────────────────────────┐
│          浏览器缓存层级              │
├─────────────────────────────────────┤
│  1. Memory Cache (内存缓存)         │
│     - 最快，容量小                   │
│     - 关闭标签页即清除               │
├─────────────────────────────────────┤
│  2. Disk Cache (磁盘缓存)           │
│     - 较慢，容量大                   │
│     - 持久化存储                     │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - 开发者完全控制                 │
│     - 离线应用支持                   │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> HTTP 缓存策略有哪些？

### 缓存策略分类

```text
HTTP 缓存策略
├── 强缓存 (Strong Cache)
│   ├── Cache-Control
│   └── Expires
└── 协商缓存 (Negotiation Cache)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. 强缓存（Strong Cache / Fresh）

**特点**：浏览器直接从本地缓存读取，不会向服务器发送请求。

#### Cache-Control（HTTP/1.1）

```http
Cache-Control: max-age=3600
```

**常用指令**：

```javascript
// 1. max-age：缓存有效时间（秒）
Cache-Control: max-age=3600  // 缓存 1 小时

// 2. no-cache：需要向服务器验证（使用协商缓存）
Cache-Control: no-cache

// 3. no-store：完全不缓存
Cache-Control: no-store

// 4. public：可被任何缓存（浏览器、CDN）
Cache-Control: public, max-age=31536000

// 5. private：只能被浏览器缓存
Cache-Control: private, max-age=3600

// 6. immutable：资源永不改变（配合 hash 文件名）
Cache-Control: public, max-age=31536000, immutable

// 7. must-revalidate：过期后必须向服务器验证
Cache-Control: max-age=3600, must-revalidate
```

#### Expires（HTTP/1.0，已过时）

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**问题**：

- 使用绝对时间，依赖客户端时间
- 客户端时间不准确会导致缓存失效
- 已被 `Cache-Control` 取代

### 2. 协商缓存（Negotiation Cache / Validation）

**特点**：浏览器会向服务器发送请求，询问资源是否有更新。

#### Last-Modified / If-Modified-Since

```http
# 服务器响应（首次请求）
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# 浏览器请求（后续请求）
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**流程**：

1. 首次请求：服务器返回 `Last-Modified`
2. 后续请求：浏览器带上 `If-Modified-Since`
3. 资源未修改：服务器返回 `304 Not Modified`
4. 资源已修改：服务器返回 `200 OK` 和新资源

#### ETag / If-None-Match

```http
# 服务器响应（首次请求）
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 浏览器请求（后续请求）
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**优点**：

- 比 `Last-Modified` 更精确
- 不依赖时间，使用内容 hash
- 可检测到秒级以下的变化

### Last-Modified vs ETag

| 特性     | Last-Modified | ETag                |
| -------- | ------------- | ------------------- |
| 精确度   | 秒级          | 内容 hash，更精确   |
| 性能     | 较快          | 需要计算 hash，较慢 |
| 适用场景 | 一般静态资源  | 需要精确控制的资源  |
| 优先级   | 低            | 高（ETag 优先）     |

## 3. How does browser caching work?

> 浏览器缓存的运作流程是什么？

### 完整缓存流程

```text
┌──────────────────────────────────────────────┐
│            浏览器请求资源流程                 │
└──────────────────────────────────────────────┘
                    ↓
         1. 检查 Memory Cache
                    ↓
            ┌───────┴────────┐
            │   找到缓存？    │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. 检查 Disk Cache
                    ↓
            ┌───────┴────────┐
            │   找到缓存？    │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. 检查 Service Worker
                    ↓
            ┌───────┴────────┐
            │   找到缓存？    │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. 检查缓存是否过期
                    ↓
            ┌───────┴────────┐
            │    已过期？     │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. 使用协商缓存验证
                    ↓
            ┌───────┴────────┐
            │  资源已修改？   │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. 向服务器请求新资源
                    ↓
            ┌───────┴────────┐
            │  返回新资源     │
            │  (200 OK)       │
            └────────────────┘
```

### 实际示例

```javascript
// 首次请求
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// ========== 1 小时内再次请求 ==========
// 强缓存：直接从本地读取，不发送请求
// Status: 200 OK (from disk cache)

// ========== 1 小时后再次请求 ==========
// 协商缓存：发送验证请求
GET /api/data.json
If-None-Match: "abc123"

// 资源未修改
Response:
  304 Not Modified
  (不返回 body，使用本地缓存)

// 资源已修改
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are the common caching strategies?

> 常见的缓存策略有哪些？

### 1. 永久缓存策略（适用于静态资源）

```javascript
// HTML：不缓存，每次都检查
Cache-Control: no-cache

// CSS/JS（带 hash）：永久缓存
Cache-Control: public, max-age=31536000, immutable
// 文件名：main.abc123.js
```

**原理**：

- HTML 不缓存，确保用户拿到最新版本
- CSS/JS 使用 hash 文件名，内容改变时文件名也改变
- 旧版本不会被使用，新版本会被重新下载

### 2. 频繁更新资源策略

```javascript
// API 数据：短时间缓存 + 协商缓存
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. 图片资源策略

```javascript
// 用户头像：中期缓存
Cache-Control: public, max-age=86400  // 1 天

// Logo、图标：长期缓存
Cache-Control: public, max-age=2592000  // 30 天

// 动态图片：协商缓存
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. 不同资源类型的缓存建议

```javascript
const cachingStrategies = {
  // HTML 文件
  html: 'Cache-Control: no-cache',

  // 带 hash 的静态资源
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',

  // 不常更新的静态资源
  staticAssets: 'Cache-Control: public, max-age=2592000',

  // API 数据
  apiData: 'Cache-Control: private, max-age=60',

  // 用户特定数据
  userData: 'Cache-Control: private, no-cache',

  // 敏感数据
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Service Worker 缓存

Service Worker 提供了最灵活的缓存控制，开发者可以完全控制缓存逻辑。

### 基本使用

```javascript
// 注册 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js - Service Worker 文件
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// 安装事件：缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 请求拦截：使用缓存策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存优先策略
      return response || fetch(event.request);
    })
  );
});

// 更新事件：清理旧缓存
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

### 常见缓存策略

#### 1. Cache First（缓存优先）

```javascript
// 适用：静态资源
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First（网络优先）

```javascript
// 适用：API 请求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 更新缓存
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // 网络失败，使用缓存
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate（过期重新验证）

```javascript
// 适用：需要快速响应但也要保持更新的资源
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // 返回缓存，后台更新
      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. How to implement cache busting?

> 如何实现缓存破坏（Cache Busting）？

缓存破坏是确保用户获取最新资源的技术。

### 方法 1：文件名 Hash（推荐）

```javascript
// 使用 Webpack/Vite 等打包工具
// 输出：main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<!-- 自动更新引用 -->
<script src="/js/main.abc123.js"></script>
```

**优点**：

- ✅ 文件名改变，强制下载新文件
- ✅ 旧版本仍可缓存，不浪费
- ✅ 最佳实践

### 方法 2：Query String 版本号

```html
<!-- 手动更新版本号 -->
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**缺点**：

- ❌ 部分 CDN 不缓存带 query string 的资源
- ❌ 需要手动维护版本号

### 方法 3：时间戳

```javascript
// 开发环境使用
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**用途**：

- 开发环境避免缓存
- 不适合生产环境（每次都是新请求）

## 7. Common caching interview questions

> 常见缓存面试题

### 题目 1：如何让 HTML 不被缓存？

<details>
<summary>点击查看答案</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

或者使用 meta 标签：

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### 题目 2：为什么要使用 ETag 而不只用 Last-Modified？

<details>
<summary>点击查看答案</summary>

**ETag 的优势**：

1. **更精确**：可以检测到秒级以下的变化
2. **内容驱动**：基于内容 hash，而不是时间
3. **避免时间问题**：
   - 文件内容没变但时间改变（如重新部署）
   - 循环更新的资源（周期性回到相同内容）
4. **分布式系统**：不同服务器的时间可能不同步

**示例**：

```javascript
// 文件内容没变，但 Last-Modified 改变
// 2024-01-01 12:00 - 部署版本 A（内容：abc）
// 2024-01-02 12:00 - 重新部署版本 A（内容：abc）
// Last-Modified 改变，但内容相同！

// ETag 不会有这个问题
ETag: 'hash-of-abc'; // 永远一样
```

</details>

### 题目 3：from disk cache 和 from memory cache 的区别？

<details>
<summary>点击查看答案</summary>

| 特性     | Memory Cache   | Disk Cache  |
| -------- | -------------- | ----------- |
| 存储位置 | 内存（RAM）    | 硬盘        |
| 速度     | 极快           | 较慢        |
| 容量     | 小（MB 级）    | 大（GB 级） |
| 持久性   | 关闭标签页即清除 | 持久化存储  |
| 优先级   | 高（优先使用） | 低          |

**加载优先顺序**：

```text
1. Memory Cache（最快）
2. Service Worker Cache
3. Disk Cache
4. HTTP Cache
5. 网络请求（最慢）
```

**触发条件**：

- **Memory Cache**：刚访问过的资源（如刷新页面）
- **Disk Cache**：较久前访问的资源，或文件较大的资源

</details>

### 题目 4：如何强制浏览器重新加载资源？

<details>
<summary>点击查看答案</summary>

**开发阶段**：

```javascript
// 1. Hard Reload（Ctrl/Cmd + Shift + R）
// 2. 清除缓存并重新加载

// 3. 代码中加时间戳
const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**生产环境**：

```javascript
// 1. 使用文件名 hash（最佳实践）
main.abc123.js  // Webpack/Vite 自动生成

// 2. 更新版本号
<script src="/js/main.js?v=2.0.0"></script>

// 3. 设置 Cache-Control
Cache-Control: no-cache  // 强制验证
Cache-Control: no-store  // 完全不缓存
```

</details>

### 题目 5：PWA 离线缓存如何实现？

<details>
<summary>点击查看答案</summary>

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

// 安装时缓存离线页面
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

// 请求拦截
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // 网络失败，显示离线页面
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**完整 PWA 缓存策略**：

```javascript
// 1. 缓存静态资源
caches.addAll(['/css/', '/js/', '/images/']);

// 2. API 请求：Network First
// 3. 图片：Cache First
// 4. HTML：Network First，失败显示离线页面
```

</details>

## 8. Best practices

> 最佳实践

### ✅ 推荐做法

```javascript
// 1. HTML - 不缓存，确保用户拿到最新版本
// Response Headers:
Cache-Control: no-cache

// 2. CSS/JS（带 hash）- 永久缓存
// 文件名：main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. 图片 - 长期缓存
Cache-Control: public, max-age=2592000  // 30 天

// 4. API 数据 - 短期缓存 + 协商缓存
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. 使用 Service Worker 实现离线支持
```

### ❌ 避免的做法

```javascript
// ❌ 差：HTML 设置长期缓存
Cache-Control: max-age=31536000  // 用户可能看到旧版本

// ❌ 差：使用 Expires 而不是 Cache-Control
Expires: Wed, 21 Oct 2025 07:28:00 GMT  // HTTP/1.0，已过时

// ❌ 差：完全不设置缓存
// 没有缓存头，浏览器行为不确定

// ❌ 差：对所有资源使用相同策略
Cache-Control: max-age=3600  // 应该根据资源类型调整
```

### 缓存策略决策树

```text
是静态资源？
├─ 是 → 文件名有 hash？
│      ├─ 是 → 永久缓存（max-age=31536000, immutable）
│      └─ 否 → 中长期缓存（max-age=2592000）
└─ 否 → 是 HTML？
       ├─ 是 → 不缓存（no-cache）
       └─ 否 → 是 API？
              ├─ 是 → 短期缓存 + 协商（max-age=60, ETag）
              └─ 否 → 根据更新频率决定
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
