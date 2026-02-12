---
title: '[Lv3] Nuxt 3 效能優化：Bundle Size、SSR 速度與圖片優化'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Nuxt 3 效能優化全攻略：從 Bundle Size 瘦身、SSR 速度優化到圖片載入策略，打造極致效能體驗。

---

## 1. 面試回答主軸

1.  **Bundle Size 優化**：分析 (`nuxi analyze`)、拆分 (`SplitChunks`)、Tree Shaking、延遲載入 (Lazy Loading)。
2.  **SSR 速度優化 (TTFB)**：Redis 快取、Nitro Cache、減少阻塞式 API 呼叫、Streaming SSR。
3.  **圖片優化**：`@nuxt/image`、WebP 格式、CDN、Lazy Loading。
4.  **大量資料優化**：虛擬滾動 (Virtual Scrolling)、無限滾動 (Infinite Scroll)、分頁 (Pagination)。

---

## 2. 如何減少 Nuxt 3 的 Bundle Size？

### 2.1 診斷工具

首先，必須知道瓶頸在哪裡。使用 `nuxi analyze` 來視覺化 Bundle 結構。

```bash
npx nuxi analyze
```

這會產生一個報告，顯示哪些套件佔用了最大空間。

### 2.2 優化策略

#### 1. Code Splitting (代碼拆分)
Nuxt 3 預設已經基於路由 (Route-based) 做 Code Splitting。但對於大型套件（如 ECharts, Lodash），我們需要手動優化。

**Nuxt Config 配置 (Vite/Webpack)：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 將 node_modules 中的大型套件拆分出來
            if (id.includes('node_modules')) {
              if (id.includes('lodash')) return 'lodash';
              if (id.includes('echarts')) return 'echarts';
            }
          },
        },
      },
    },
  },
});
```

#### 2. Tree Shaking & 按需引入
確保只引入需要的模組，而不是整個套件。

```typescript
// ❌ 錯誤：引入整個 lodash
import _ from 'lodash';
_.debounce(() => {}, 100);

// ✅ 正確：只引入 debounce
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// ✅ 推薦：使用 vueuse (Vue 專用且 Tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. 組件 Lazy Loading
對於非首屏需要的組件，使用 `Lazy` 前綴進行動態導入。

```vue
<template>
  <div>
    <!-- 只有當 show 為 true 時才會載入該組件代碼 -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. 移除不必要的 Server-side 套件
確保只在 Server 端使用的套件（如資料庫驅動、fs 操作）不會被打包到 Client 端。Nuxt 3 會自動處理 `.server.ts` 結尾的檔案，或使用 `server/` 目錄。

---

## 3. 如何優化 SSR 速度 (TTFB)？

### 3.1 為什麼 TTFB 會過長？
TTFB (Time To First Byte) 是 SSR 效能的關鍵指標。過長的原因通常是：
1.  **API 回應慢**：Server 需要等待後端 API 回傳資料才能渲染 HTML。
2.  **串行請求**：多個 API 請求依序執行，而非並行。
3.  **繁重的計算**：Server 端執行了過多 CPU 密集型任務。

### 3.2 優化方案

#### 1. Server-Side Caching (Nitro Cache)
使用 Nitro 的快取功能，將 API 回應或渲染結果快取起來。

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 首頁快取 1 小時 (SWR: Stale-While-Revalidate)
    '/': { swr: 3600 },
    // 產品頁快取 10 分鐘
    '/products/**': { swr: 600 },
    // API 快取
    '/api/**': { cache: { maxAge: 60 } },
  },
});
```

#### 2. 並行請求 (Parallel Fetching)
使用 `Promise.all` 並行發送多個請求，而不是 `await` 一個接一個。

```typescript
// ❌ 慢：串行執行 (總時間 = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// ✅ 快：並行執行 (總時間 = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. 延遲非關鍵資料 (Lazy Fetching)
首屏不需要的資料，可以在 Client 端再載入 (`lazy: true`)，避免阻塞 SSR。

```typescript
// 評論資料不需要 SEO，可以在 Client 端載入
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false, // 甚至完全不在 Server 端執行
});
```

#### 4. Streaming SSR (實驗性)
Nuxt 3 支援 HTML Streaming，可以邊渲染邊回傳，讓使用者更快看到內容。

---

## 4. Nuxt 3 圖片優化

### 4.1 使用 @nuxt/image
官方模組 `@nuxt/image` 是最佳解，提供：
-   **自動格式轉換**：自動轉為 WebP/AVIF。
-   **自動縮放**：根據螢幕大小產生對應尺寸圖片。
-   **Lazy Loading**：內建懶加載。
-   **CDN 整合**：支援 Cloudinary, Imgix 等多種 Provider。

### 4.2 實作範例

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    // 預設選項
    format: ['webp'],
  },
});
```

```vue
<template>
  <!-- 自動轉換為 webp，寬度 300px，並啟用 lazy load -->
  <NuxtImg
    src="/hero.jpg"
    format="webp"
    width="300"
    loading="lazy"
    placeholder
  />
</template>
```

---

## 5. 大量資料的分頁與滾動

### 5.1 方案選擇
針對大量資料（如 10,000 筆商品），主要有三種策略，需考量 **SEO**：

| 策略 | 適合場景 | SEO 友善度 |
| :--- | :--- | :--- |
| **傳統分頁 (Pagination)** | 電商列表、文章列表 | ⭐⭐⭐⭐⭐ (最佳) |
| **無限滾動 (Infinite Scroll)** | 社交動態、圖片牆 | ⭐⭐ (需特殊處理) |
| **虛擬滾動 (Virtual Scroll)** | 複雜報表、超長列表 | ⭐ (內容不在 DOM 中) |

### 5.2 如何維持無限滾動的 SEO？
如果是無限滾動，搜尋引擎通常只能爬取第一頁。解決方案：
1.  **結合分頁模式**：提供 `<link rel="next" href="...">` 標籤，讓爬蟲知道有下一頁。
2.  **Noscript Fallback**：提供一個傳統分頁的 `<noscript>` 版本給爬蟲。
3.  **Load More 按鈕**：首屏 SSR 渲染前 20 筆，後續點擊「載入更多」或滾動觸發 Client-side fetch。

### 5.3 實作範例 (Load More + SEO)

```vue
<script setup>
// 首屏資料 (SSR)
const page = ref(1);
const { data: posts } = await useFetch('/api/posts', {
  query: { page: page.value }
});

// Client 端載入更多
const loadMore = async () => {
  page.value++;
  const newPosts = await $fetch('/api/posts', {
      query: { page: page.value }
  });
  posts.value.push(...newPosts);
};
</script>

<template>
  <div>
    <div v-for="post in posts" :key="post.id">{{ post.title }}</div>
    <button @click="loadMore">載入更多</button>
    
    <!-- SEO 優化：告訴爬蟲有下一頁 -->
    <Head>
      <Link rel="next" :href="`/posts?page=${page + 1}`" />
    </Head>
  </div>
</template>
```

---

## 6. SSR 環境下的 Lazy Loading

### 6.1 問題描述
在 SSR 環境中，如果使用 `IntersectionObserver` 實作 Lazy Loading，因為 Server 端沒有 `window` 或 `document`，會導致錯誤或 Hydration Mismatch。

### 6.2 解決方案

#### 1. 使用 Nuxt 內建組件
-   `<LazyComponent>`
-   `<NuxtImg loading="lazy">`

#### 2. 自定義 Directive (需處理 SSR)

```typescript
// plugins/lazy-load.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      // 只在 Client 端執行
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value;
          observer.disconnect();
        }
      });
      observer.observe(el);
    },
    getSSRProps(binding) {
      // Server 端渲染佔位圖或原圖 (視 SEO 需求而定)
      return {
        src: 'placeholder.png'
      };
    }
  });
});
```

---

## 7. SSR 效能監控與追蹤

### 7.1 為什麼需要監控？
SSR 應用程式的效能瓶頸往往發生在 Server 端，瀏覽器的 DevTools 看不到。如果不監控，很難發現 API 回應慢、Memory Leak 或 CPU 飆高是造成 TTFB 變慢的主因。

### 7.2 常用工具

1.  **Nuxt DevTools (開發階段)**：
    -   內建於 Nuxt 3。
    -   可以查看 Server Routes 的回應時間。
    -   **Open Graph** 預覽 SEO。
    -   **Server Routes** 面板監控 API 呼叫耗時。

2.  **Lighthouse / PageSpeed Insights (部署後)**：
    -   監控 Core Web Vitals (LCP, CLS, FID/INP)。
    -   LCP (Largest Contentful Paint) 高度依賴 SSR 的 TTFB。

3.  **Server-Side Monitoring (APM)**：
    -   **Sentry / Datadog**：追蹤 Server 端錯誤與效能。
    -   **OpenTelemetry**：追蹤完整的 Request Trace (從 Nuxt Server -> API Server -> DB)。

### 7.3 實作簡單的時間追蹤

在 `server/middleware` 中可以實作一個簡單的計時器：

```typescript
// server/middleware/timing.ts
export default defineEventHandler((event) => {
  const start = performance.now();
  
  event.node.res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[${event.method}] ${event.path} - ${duration.toFixed(2)}ms`);
    
    // 也可以加入 Server-Timing header，讓瀏覽器 DevTools 看得到
    // event.node.res.setHeader('Server-Timing', `total;dur=${duration}`);
  });
});
```

---

## 8. 面試總結

**Q: 如何追蹤和監控 SSR 的效能問題？**
> 我在開發階段主要使用 **Nuxt DevTools** 來查看 Server Routes 的回應時間和 Payload 大小。
> 在 Production 環境，我會關注 **Core Web Vitals** (特別是 LCP) 和 **TTFB**。
> 如果需要深入追蹤 Server 端瓶頸，我會使用自定義的 Server Middleware 紀錄請求時間，並透過 `Server-Timing` header 將數據傳回瀏覽器，或者整合 **Sentry** / **OpenTelemetry** 進行全鏈路追蹤。

**Q: 如何減少 Nuxt 3 的 bundle size？**
> 我會先用 `nuxi analyze` 分析。針對大型套件（如 lodash）做 Tree Shaking 或手動拆分 (`manualChunks`)。對於非首屏組件，使用 `<LazyComponent>` 進行動態導入。

**Q: 如何優化 SSR 速度？**
> 重點是減少 TTFB。我會使用 Nitro 的 `routeRules` 設定 Server-side caching (SWR)。API 請求盡量用 `Promise.all` 並行處理。非關鍵資料設定 `lazy: true` 移到 Client 端載入。

**Q: Image optimization 怎麼做？**
> 我使用 `@nuxt/image` 模組，它能自動轉檔 WebP、自動縮放尺寸，並支援 Lazy Loading，大幅減少傳輸量。

**Q: 無限滾動如何兼顧 SEO？**
> 無限滾動對 SEO 不友善。如果是內容型網站，我會優先選用傳統分頁。如果必須用無限滾動，我會在 SSR 渲染第一頁，並透過 Meta Tags (`rel="next"`) 告訴爬蟲分頁結構，或者提供 Noscript 的分頁連結。


