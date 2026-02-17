---
title: '[Lv2] Nuxt 3 Server 功能實作：Server Routes 與動態 Sitemap'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> 掌握 Nuxt 3 的 Nitro Server Engine 功能，實作 Server Routes (API Routes)、動態 Sitemap 與 Robots.txt，提升網站的 SEO 與架構彈性。

---

## 1. 面試回答主軸

1.  **Server Routes (API Routes)**：使用 `server/api` 或 `server/routes` 建立後端邏輯。常用於隱藏 API Key、處理 CORS、BFF (Backend for Frontend) 架構。
2.  **動態 Sitemap**：透過 Server Routes (`server/routes/sitemap.xml.ts`) 動態生成 XML，確保搜尋引擎能索引最新內容。
3.  **Robots.txt**：同樣透過 Server Routes 動態生成，或使用 Nuxt Config 配置，控制爬蟲存取權限。

---

## 2. Nuxt 3 Server Engine: Nitro

### 2.1 什麼是 Nitro？

Nitro 是 Nuxt 3 的全新伺服器引擎，它讓 Nuxt 應用程式可以部署到任何地方（Universal Deployment）。它不僅僅是一個伺服器，更是一個強大的建置與執行時工具。

### 2.2 Nitro 的核心特色

1.  **跨平台部署 (Universal Deployment)**：
    可以編譯成 Node.js server、Serverless Functions (Vercel, AWS Lambda, Netlify)、Service Workers 等多種格式。Zero-config 即可部署到主流平台。

2.  **輕量且快速 (Lightweight & Fast)**：
    Cold start 時間極短，且生成的 bundle size 非常小（最小可達 < 1MB）。

3.  **自動程式碼分割 (Auto Code Splitting)**：
    自動分析 Server Routes 的相依性，並進行 code splitting，確保啟動速度。

4.  **HMR (Hot Module Replacement)**：
    不僅前端有 HMR，Nitro 讓後端 API 開發也能享有 HMR，修改 `server/` 檔案無需重啟伺服器。

5.  **Storage Layer (Unstorage)**：
    內建統一的 Storage API，可以輕鬆連接 Redis, GitHub, FS, Memory 等不同儲存介面。

6.  **Server Assets**：
    可以方便地在 Server 端存取靜態資源檔案。

---

## 3. Nuxt 3 Server Routes (API Routes)

### 3.1 什麼是 Server Routes？

Nuxt 3 內建了 **Nitro** 伺服器引擎，允許開發者直接在專案中編寫後端 API。這些檔案放在 `server/api` 或 `server/routes` 目錄下，會自動映射為 API endpoint。

- `server/api/hello.ts` -> `/api/hello`
- `server/routes/hello.ts` -> `/hello`

### 2.2 什麼情況下會用？（常見面試題）

**1. 隱藏敏感資訊 (Secret Management)**
前端無法安全地儲存 Private API Key。透過 Server Routes 作為中介，可以在 Server 端使用環境變數存取 Key，只將結果回傳給前端。

```typescript
// server/api/weather.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // API Key 只在 Server 端使用，不會暴露給 Client
  const data = await $fetch(
    `https://api.weather.com/v1?key=${config.weatherApiKey}`
  );
  return data;
});
```

**2. 處理 CORS 問題 (Proxy)**
當外部 API 不支援 CORS 時，可以使用 Server Routes 作為 Proxy。瀏覽器請求 Nuxt Server (同源)，Nuxt Server 請求外部 API (無 CORS 限制)。

**3. Backend for Frontend (BFF)**
將多個後端 API 的資料在 Nuxt Server 端聚合、過濾或轉換格式後，再一次性回傳給前端。減少前端請求次數與 Payload 大小。

**4. 處理 Webhook**
接收第三方服務（如金流、CMS）的 Webhook 通知。

---

## 4. 實作動態 Sitemap

### 3.1 為什麼需要動態 Sitemap？

對於內容經常變動的網站（如電商、新聞網），靜態生成的 `sitemap.xml` 很快就會過期。使用 Server Routes 可以每次請求時動態生成最新的 Sitemap。

### 3.2 實作方式：手動生成

建立 `server/routes/sitemap.xml.ts`：

```typescript
// server/routes/sitemap.xml.ts
import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // 1. 從資料庫或 API 取得所有動態路由資料
  const posts = await $fetch('https://api.example.com/posts');

  const sitemap = new SitemapStream({
    hostname: 'https://example.com',
  });

  // 2. 加入靜態頁面
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

  // 3. 加入動態頁面
  posts.forEach((post) => {
    sitemap.write({
      url: `/posts/${post.id}`,
      changefreq: 'weekly',
      lastmod: post.updatedAt,
    });
  });

  sitemap.end();

  // 4. 設定 Header 並回傳 XML
  setHeader(event, 'content-type', 'application/xml');
  return streamToPromise(sitemap);
});
```

### 3.3 實作方式：使用模組 (`@nuxtjs/sitemap`)

對於標準需求，推薦使用官方模組：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    siteUrl: 'https://example.com',
    sources: [
      '/api/sitemap-urls', // 指定一個 API 來提供動態 URL 列表
    ],
  },
});
```

---

## 5. 實作動態 Robots.txt

### 4.1 實作方式

建立 `server/routes/robots.txt.ts`：

```typescript
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProduction = config.public.siteEnv === 'production';

  // 根據環境動態決定規則
  const robots = isProduction
    ? `User-agent: *
Disallow: /admin
Disallow: /private
Sitemap: https://example.com/sitemap.xml`
    : `User-agent: *
Disallow: /`; // 非正式環境禁止索引

  setHeader(event, 'content-type', 'text/plain');
  return robots;
});
```

---

## 6. 面試重點整理

### 5.1 Nitro Engine & Server Routes

**Q: Nuxt 3 的 server engine 是什麼？Nitro 的特色是什麼？**

> **回答範例：**
> Nuxt 3 的 server engine 叫做 **Nitro**。
> 它的最大特色是 **Universal Deployment**，也就是可以零配置部署到任何環境（Node.js, Vercel, AWS Lambda, Edge Workers 等）。
> 其他特色包含：後端 API 的 **HMR**（修改免重啟）、**Auto Code Splitting**（加快啟動速度）、以及內建的 **Storage Layer**（方便連接 Redis 或 KV Storage）。

**Q: Nuxt 3 的 Server Routes 是什麼？你有實作過嗎？**

> **回答範例：**
> 是的，我實作過。Server Routes 是 Nuxt 3 透過 Nitro 引擎提供的後端功能，放在 `server/api` 目錄下。
> 我主要在以下情境使用：
>
> 1.  **隱藏 API Key**：例如串接第三方服務時，避免將 Secret Key 暴露在前端程式碼中。
> 2.  **CORS Proxy**：解決跨域請求問題。
> 3.  **BFF (Backend for Frontend)**：將多個 API 請求整合成一個，減少前端請求次數並優化資料結構。

### 5.2 Sitemap 與 Robots.txt

**Q: 如何在 Nuxt 3 實作動態 sitemap 和 robots.txt？**

> **回答範例：**
> 我會使用 Nuxt 的 Server Routes 來實作。
> 對於 **Sitemap**，我會建立 `server/routes/sitemap.xml.ts`，在裡面呼叫後端 API 取得最新的文章或產品列表，然後使用 `sitemap` 套件生成 XML 字串並回傳。這樣可以確保搜尋引擎每次爬取都能拿到最新的連結。
> 對於 **Robots.txt**，我會建立 `server/routes/robots.txt.ts`，並根據環境變數（Production 或 Staging）動態回傳不同的規則，例如在 Staging 環境設定 `Disallow: /` 防止被索引。

### 5.3 SEO Meta Tags (補充)

**Q: 你如何處理 Nuxt 3 的 SEO meta tags？有用過 useHead 或 useSeoMeta 嗎？**

> **回答範例：**
> 我主要使用 Nuxt 3 內建的 `useHead` 和 `useSeoMeta` Composables。
> `useHead` 允許我定義 `title`、`meta`、`link` 等標籤。如果是單純的 SEO 設定，我會優先使用 `useSeoMeta`，因為它的語法更簡潔且有型別提示（Type-safe），例如直接設定 `ogTitle`、`description` 等屬性。
> 在動態頁面（如產品頁），我會傳入一個 Getter Function（例如 `title: () => product.value.name`），這樣當資料更新時，Meta Tags 也會自動響應更新。

---

## 7. 相關 Reference

- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt SEO Module](https://nuxtseo.com/)
