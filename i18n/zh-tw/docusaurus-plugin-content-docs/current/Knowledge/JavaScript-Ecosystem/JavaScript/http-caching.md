---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> 什麼是 HTTP 快取？為什麼它很重要？

HTTP 快取是一種在用戶端（瀏覽器）或中間伺服器暫時儲存 HTTP 回應的技術，目的是在後續請求時可以直接使用快取的資料，而不需要再次向伺服器請求。

### 快取 vs 暫存：有什麼不同？

在繁體中文技術文件中，這兩個詞經常被混用，但實際上有不同的含義：

#### Cache（快取）

**定義**：為了**效能優化**而儲存的資料副本，強調「重複使用」和「加速存取」。

**特點**：

- ✅ 目的是提升效能
- ✅ 資料可以被重複使用
- ✅ 有明確的過期策略
- ✅ 通常是原始資料的副本

**範例**：

```javascript
// HTTP Cache - 快取 API 回應
Cache-Control: max-age=3600  // 快取 1 小時

// Memory Cache - 快取計算結果
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);  // 重複使用快取
  const result = /* 計算 */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage（暫存）

**定義**：**臨時儲存**的資料，強調「暫時性」和「會被清除」。

**特點**：

- ✅ 目的是臨時保存
- ✅ 不一定會被重複使用
- ✅ 生命週期通常較短
- ✅ 可能包含中間狀態

**範例**：

```javascript
// sessionStorage - 暫存使用者輸入
sessionStorage.setItem('formData', JSON.stringify(form)); // 關閉分頁即清除

// 暫存檔案上傳
const tempFile = await uploadToTemp(file); // 處理完就刪除
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### 對照表

| 特性         | Cache（快取）            | Temporary Storage（暫存） |
| ------------ | ------------------------ | ------------------------- |
| **主要目的** | 效能優化                 | 臨時保存                  |
| **重複使用** | 是，多次讀取             | 不一定                    |
| **生命週期** | 根據策略決定             | 通常較短                  |
| **典型用途** | HTTP Cache, Memory Cache | sessionStorage, 暫存檔案  |
| **英文對應** | Cache                    | Temp / Temporary / Buffer |

#### 實際應用中的區別

```javascript
// ===== Cache（快取）的使用場景 =====

// 1. HTTP 快取：重複使用 API 回應
fetch('/api/users') // 第一次請求
  .then((response) => response.json());

fetch('/api/users') // 第二次從快取讀取
  .then((response) => response.json());

// 2. 計算結果快取
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // 重複使用
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Temporary Storage（暫存）的使用場景 =====

// 1. 表單資料暫存（防止意外關閉）
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2. 上傳檔案暫存
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file); // 暫存
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath); // 用完即刪
  return processed;
}

// 3. 中間計算結果暫存
const tempResults = []; // 暫存中間結果
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults); // 用完就不需要了
```

#### 在 Web 開發中的應用

```javascript
// HTTP Cache（快取）- 長期儲存，重複使用
Cache-Control: public, max-age=31536000, immutable
// → 瀏覽器會快取這個檔案一年，重複使用

// sessionStorage（暫存）- 臨時儲存，關閉即清
sessionStorage.setItem('tempData', data);
// → 只在當前分頁有效，關閉就清除

// localStorage（長期儲存）- 介於兩者之間
localStorage.setItem('userPreferences', prefs);
// → 持久化儲存，但不是為了效能優化
```

### 為什麼區分這兩個概念很重要？

1. **設計決策**：

   - 需要效能優化？ → 使用快取
   - 需要臨時保存？ → 使用暫存

2. **資源管理**：

   - 快取：注重命中率、過期策略
   - 暫存：注重清理時機、容量限制

3. **面試回答**：

   - 問「如何優化效能」→ 談快取策略
   - 問「如何處理臨時資料」→ 談暫存方案

在本文中，我們主要討論的是 **Cache（快取）**，特別是 HTTP 快取機制。

### 快取的好處

1. **減少網路請求**：直接從本地快取讀取，不需要發送 HTTP 請求
2. **降低伺服器負載**：減少伺服器需要處理的請求數量
3. **加快頁面載入速度**：本地快取讀取速度遠快於網路請求
4. **節省頻寬**：減少資料傳輸量
5. **改善使用者體驗**：頁面回應更快，使用更流暢

### 快取的類型

```text
┌─────────────────────────────────────┐
│          瀏覽器快取層級              │
├─────────────────────────────────────┤
│  1. Memory Cache (記憶體快取)       │
│     - 最快，容量小                   │
│     - 關閉分頁即清除                 │
├─────────────────────────────────────┤
│  2. Disk Cache (磁碟快取)           │
│     - 較慢，容量大                   │
│     - 持久化儲存                     │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - 開發者完全控制                 │
│     - 離線應用支援                   │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> HTTP 快取策略有哪些？

### 快取策略分類

```text
HTTP 快取策略
├── 強快取 (Strong Cache)
│   ├── Cache-Control
│   └── Expires
└── 協商快取 (Negotiation Cache)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. 強快取（Strong Cache / Fresh）

**特點**：瀏覽器直接從本地快取讀取，不會向伺服器發送請求。

#### Cache-Control（HTTP/1.1）

```http
Cache-Control: max-age=3600
```

**常用指令**：

```javascript
// 1. max-age：快取有效時間（秒）
Cache-Control: max-age=3600  // 快取 1 小時

// 2. no-cache：需要向伺服器驗證（使用協商快取）
Cache-Control: no-cache

// 3. no-store：完全不快取
Cache-Control: no-store

// 4. public：可被任何快取（瀏覽器、CDN）
Cache-Control: public, max-age=31536000

// 5. private：只能被瀏覽器快取
Cache-Control: private, max-age=3600

// 6. immutable：資源永不改變（配合 hash 檔名）
Cache-Control: public, max-age=31536000, immutable

// 7. must-revalidate：過期後必須向伺服器驗證
Cache-Control: max-age=3600, must-revalidate
```

#### Expires（HTTP/1.0，已過時）

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**問題**：

- 使用絕對時間，依賴客戶端時間
- 客戶端時間不準確會導致快取失效
- 已被 `Cache-Control` 取代

### 2. 協商快取（Negotiation Cache / Validation）

**特點**：瀏覽器會向伺服器發送請求，詢問資源是否有更新。

#### Last-Modified / If-Modified-Since

```http
# 伺服器回應（首次請求）
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# 瀏覽器請求（後續請求）
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**流程**：

1. 首次請求：伺服器回傳 `Last-Modified`
2. 後續請求：瀏覽器帶上 `If-Modified-Since`
3. 資源未修改：伺服器回傳 `304 Not Modified`
4. 資源已修改：伺服器回傳 `200 OK` 和新資源

#### ETag / If-None-Match

```http
# 伺服器回應（首次請求）
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 瀏覽器請求（後續請求）
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**優點**：

- 比 `Last-Modified` 更精確
- 不依賴時間，使用內容 hash
- 可偵測到秒級以下的變化

### Last-Modified vs ETag

| 特性     | Last-Modified | ETag                |
| -------- | ------------- | ------------------- |
| 精確度   | 秒級          | 內容 hash，更精確   |
| 效能     | 較快          | 需要計算 hash，較慢 |
| 適用場景 | 一般靜態資源  | 需要精確控制的資源  |
| 優先級   | 低            | 高（ETag 優先）     |

## 3. How does browser caching work?

> 瀏覽器快取的運作流程是什麼？

### 完整快取流程

```text
┌──────────────────────────────────────────────┐
│            瀏覽器請求資源流程                 │
└──────────────────────────────────────────────┘
                    ↓
         1. 檢查 Memory Cache
                    ↓
            ┌───────┴────────┐
            │   找到快取？    │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. 檢查 Disk Cache
                    ↓
            ┌───────┴────────┐
            │   找到快取？    │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. 檢查 Service Worker
                    ↓
            ┌───────┴────────┐
            │   找到快取？    │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. 檢查快取是否過期
                    ↓
            ┌───────┴────────┐
            │    已過期？     │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. 使用協商快取驗證
                    ↓
            ┌───────┴────────┐
            │  資源已修改？   │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. 向伺服器請求新資源
                    ↓
            ┌───────┴────────┐
            │  回傳新資源     │
            │  (200 OK)       │
            └────────────────┘
```

### 實際範例

```javascript
// 首次請求
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// ========== 1 小時內再次請求 ==========
// 強快取：直接從本地讀取，不發送請求
// Status: 200 OK (from disk cache)

// ========== 1 小時後再次請求 ==========
// 協商快取：發送驗證請求
GET /api/data.json
If-None-Match: "abc123"

// 資源未修改
Response:
  304 Not Modified
  (不返回 body，使用本地快取)

// 資源已修改
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are the common caching strategies?

> 常見的快取策略有哪些？

### 1. 永久快取策略（適用於靜態資源）

```javascript
// HTML：不快取，每次都檢查
Cache-Control: no-cache

// CSS/JS（帶 hash）：永久快取
Cache-Control: public, max-age=31536000, immutable
// 檔名：main.abc123.js
```

**原理**：

- HTML 不快取，確保使用者拿到最新版本
- CSS/JS 使用 hash 檔名，內容改變時檔名也改變
- 舊版本不會被使用，新版本會被重新下載

### 2. 頻繁更新資源策略

```javascript
// API 資料：短時間快取 + 協商快取
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. 圖片資源策略

```javascript
// 使用者頭像：中期快取
Cache-Control: public, max-age=86400  // 1 天

// Logo、圖示：長期快取
Cache-Control: public, max-age=2592000  // 30 天

// 動態圖片：協商快取
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. 不同資源類型的快取建議

```javascript
const cachingStrategies = {
  // HTML 文件
  html: 'Cache-Control: no-cache',

  // 帶 hash 的靜態資源
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',

  // 不常更新的靜態資源
  staticAssets: 'Cache-Control: public, max-age=2592000',

  // API 資料
  apiData: 'Cache-Control: private, max-age=60',

  // 使用者特定資料
  userData: 'Cache-Control: private, no-cache',

  // 敏感資料
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Service Worker 快取

Service Worker 提供了最靈活的快取控制，開發者可以完全控制快取邏輯。

### 基本使用

```javascript
// 註冊 Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js - Service Worker 檔案
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// 安裝事件：快取靜態資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 請求攔截：使用快取策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 快取優先策略
      return response || fetch(event.request);
    })
  );
});

// 更新事件：清理舊快取
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

### 常見快取策略

#### 1. Cache First（快取優先）

```javascript
// 適用：靜態資源
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First（網路優先）

```javascript
// 適用：API 請求
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 更新快取
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // 網路失敗，使用快取
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate（過期重新驗證）

```javascript
// 適用：需要快速回應但也要保持更新的資源
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // 回傳快取，背景更新
      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. How to implement cache busting?

> 如何實現快取破壞（Cache Busting）？

快取破壞是確保使用者獲取最新資源的技術。

### 方法 1：檔名 Hash（推薦）

```javascript
// 使用 Webpack/Vite 等打包工具
// 輸出：main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<!-- 自動更新引用 -->
<script src="/js/main.abc123.js"></script>
```

**優點**：

- ✅ 檔名改變，強制下載新檔案
- ✅ 舊版本仍可快取，不浪費
- ✅ 最佳實踐

### 方法 2：Query String 版本號

```html
<!-- 手動更新版本號 -->
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**缺點**：

- ❌ 部分 CDN 不快取帶 query string 的資源
- ❌ 需要手動維護版本號

### 方法 3：時間戳

```javascript
// 開發環境使用
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**用途**：

- 開發環境避免快取
- 不適合生產環境（每次都是新請求）

## 7. Common caching interview questions

> 常見快取面試題

### 題目 1：如何讓 HTML 不被快取？

<details>
<summary>點擊查看答案</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

或者使用 meta 標籤：

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### 題目 2：為什麼要使用 ETag 而不只用 Last-Modified？

<details>
<summary>點擊查看答案</summary>

**ETag 的優勢**：

1. **更精確**：可以偵測到秒級以下的變化
2. **內容驅動**：基於內容 hash，而不是時間
3. **避免時間問題**：
   - 檔案內容沒變但時間改變（如重新部署）
   - 循環更新的資源（週期性回到相同內容）
4. **分散式系統**：不同伺服器的時間可能不同步

**範例**：

```javascript
// 檔案內容沒變，但 Last-Modified 改變
// 2024-01-01 12:00 - 部署版本 A（內容：abc）
// 2024-01-02 12:00 - 重新部署版本 A（內容：abc）
// Last-Modified 改變，但內容相同！

// ETag 不會有這個問題
ETag: 'hash-of-abc'; // 永遠一樣
```

</details>

### 題目 3：from disk cache 和 from memory cache 的區別？

<details>
<summary>點擊查看答案</summary>

| 特性     | Memory Cache   | Disk Cache  |
| -------- | -------------- | ----------- |
| 儲存位置 | 記憶體（RAM）  | 硬碟        |
| 速度     | 極快           | 較慢        |
| 容量     | 小（MB 級）    | 大（GB 級） |
| 持久性   | 關閉分頁即清除 | 持久化儲存  |
| 優先級   | 高（優先使用） | 低          |

**載入優先順序**：

```text
1. Memory Cache（最快）
2. Service Worker Cache
3. Disk Cache
4. HTTP Cache
5. 網路請求（最慢）
```

**觸發條件**：

- **Memory Cache**：剛訪問過的資源（如重新整理頁面）
- **Disk Cache**：較久前訪問的資源，或檔案較大的資源

</details>

### 題目 4：如何強制瀏覽器重新載入資源？

<details>
<summary>點擊查看答案</summary>

**開發階段**：

```javascript
// 1. Hard Reload（Ctrl/Cmd + Shift + R）
// 2. 清除快取並重新載入

// 3. 程式碼中加時間戳
const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**生產環境**：

```javascript
// 1. 使用檔名 hash（最佳實踐）
main.abc123.js  // Webpack/Vite 自動產生

// 2. 更新版本號
<script src="/js/main.js?v=2.0.0"></script>

// 3. 設定 Cache-Control
Cache-Control: no-cache  // 強制驗證
Cache-Control: no-store  // 完全不快取
```

</details>

### 題目 5：PWA 離線快取如何實現？

<details>
<summary>點擊查看答案</summary>

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

// 安裝時快取離線頁面
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

// 請求攔截
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // 網路失敗，顯示離線頁面
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**完整 PWA 快取策略**：

```javascript
// 1. 快取靜態資源
caches.addAll(['/css/', '/js/', '/images/']);

// 2. API 請求：Network First
// 3. 圖片：Cache First
// 4. HTML：Network First，失敗顯示離線頁面
```

</details>

## 8. Best practices

> 最佳實踐

### ✅ 推薦做法

```javascript
// 1. HTML - 不快取，確保使用者拿到最新版本
// Response Headers:
Cache-Control: no-cache

// 2. CSS/JS（帶 hash）- 永久快取
// 檔名：main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. 圖片 - 長期快取
Cache-Control: public, max-age=2592000  // 30 天

// 4. API 資料 - 短期快取 + 協商快取
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. 使用 Service Worker 實現離線支援
```

### ❌ 避免的做法

```javascript
// ❌ 壞：HTML 設定長期快取
Cache-Control: max-age=31536000  // 使用者可能看到舊版本

// ❌ 壞：使用 Expires 而不是 Cache-Control
Expires: Wed, 21 Oct 2025 07:28:00 GMT  // HTTP/1.0，已過時

// ❌ 壞：完全不設定快取
// 沒有快取頭，瀏覽器行為不確定

// ❌ 壞：對所有資源使用相同策略
Cache-Control: max-age=3600  // 應該根據資源類型調整
```

### 快取策略決策樹

```text
是靜態資源？
├─ 是 → 檔名有 hash？
│      ├─ 是 → 永久快取（max-age=31536000, immutable）
│      └─ 否 → 中長期快取（max-age=2592000）
└─ 否 → 是 HTML？
       ├─ 是 → 不快取（no-cache）
       └─ 否 → 是 API？
              ├─ 是 → 短期快取 + 協商（max-age=60, ETag）
              └─ 否 → 根據更新頻率決定
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/zh-TW/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
