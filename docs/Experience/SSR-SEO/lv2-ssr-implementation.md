---
title: '[Lv2] SSR 實作：Data Fetching 與 SEO Meta 管理'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> 在 Nuxt 3 專案中，實作 SSR 資料載入與 SEO Meta Tags 動態管理，確保搜尋引擎能正確索引動態路由頁面。

---

## 1. 面試回答主軸

1. **Data Fetching 策略**：使用 `useFetch`/`useAsyncData` 在 Server Side 預先載入資料，確保 SEO 內容完整。
2. **動態 Meta Tags**：使用 `useHead` 根據資料動態生成 SEO meta tags，支援動態路由頁面。
3. **效能優化**：實作 request deduplication、server-side caching，區分 SSR/CSR 頁面。

---

## 2. useFetch / useAsyncData 的正確使用

### 2.1 為什麼需要 SSR Data Fetching？

**問題情境：**

- 動態路由頁面（如：`/products/[id]`）需要從 API 載入資料
- 如果只在客戶端載入，搜尋引擎無法看到完整內容
- 需要確保 Server Side 預先載入資料，生成完整的 HTML

**解決方案：** 使用 Nuxt 3 的 `useFetch` 或 `useAsyncData`

### 2.2 useFetch 基礎使用

**檔案位置：** `pages/products/[id].vue`

```typescript
// 基本用法
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**關鍵參數說明：**

| 參數        | 說明                                   | 預設值   |
| ----------- | -------------------------------------- | -------- |
| `key`       | 唯一識別碼，用於 request deduplication | 自動生成 |
| `lazy`      | 是否延遲載入（不阻塞 SSR）             | `false`  |
| `server`    | 是否在 Server Side 執行                | `true`   |
| `default`   | 預設值                                 | `null`   |
| `transform` | 資料轉換函式                           | -        |

### 2.3 完整實作範例

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // 避免重複請求
  lazy: false, // SSR 時等待完成
  server: true, // 確保 server side 執行
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // 資料轉換邏輯
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**關鍵點說明：**

1. **`key` 參數**

   - 用於 request deduplication（避免重複請求）
   - 相同 key 的請求會被合併
   - 建議使用唯一識別碼（如：`product-${id}`）

2. **`lazy: false`**

   - SSR 時會等待資料載入完成才渲染
   - 確保搜尋引擎能看到完整內容
   - 如果設為 `true`，SSR 時不會等待，可能導致內容不完整

3. **`server: true`**
   - 確保在 Server Side 執行
   - 這是 SSR 的關鍵設定
   - 如果設為 `false`，只會在客戶端執行

### 2.4 useAsyncData vs useFetch

**差異對比：**

| 功能         | useFetch                 | useAsyncData           |
| ------------ | ------------------------ | ---------------------- |
| **用途**     | 直接呼叫 API             | 執行任意非同步操作     |
| **自動處理** | ✅ 自動處理 URL、headers | ❌ 需要手動處理        |
| **適用場景** | API 請求                 | 資料庫查詢、檔案讀取等 |

**使用範例：**

```typescript
// useFetch：適合 API 請求
const { data } = await useFetch('/api/products/123');

// useAsyncData：適合其他非同步操作
const { data } = await useAsyncData('products', async () => {
  // 可以執行任何非同步操作
  const result = await someAsyncOperation();
  return result;
});
```

### 2.5 $fetch vs useFetch

**面試常考題：什麼時候該用 `$fetch`，什麼時候該用 `useFetch`？**

**1. $fetch**

- **定義**：Nuxt 3 底層使用的 HTTP 客戶端（基於 `ofetch`）。
- **行為**：單純發送 HTTP 請求，**不會**處理 SSR 狀態同步（Hydration）。
- **風險**：如果在 `setup()` 中直接使用 `$fetch`，Server 端會請求一次，Client 端 Hydration 時會**再次請求**（Double Fetch），且可能導致 Hydration Mismatch。
- **適用場景**：
  - 使用者互動觸發的請求（如：點擊按鈕送出表單、載入更多）。
  - Client-side only 的邏輯。
  - Middleware 或 Server API route 內部。

**2. useFetch**

- **定義**：包裝了 `useAsyncData` + `$fetch` 的 Composable。
- **行為**：
  - 自動產生 key 進行 Request Deduplication。
  - 處理 SSR 狀態傳輸（將 Server 取得的資料傳給 Client，避免 Client 再次請求）。
  - 提供響應式回傳值（`data`, `pending`, `error`, `refresh`）。
- **適用場景**：
  - 頁面初始化需要的資料（Page Load）。
  - 依賴 URL 參數變動的資料取得。

**總結比較：**

| 特性             | useFetch                     | $fetch                         |
| ---------------- | ---------------------------- | ------------------------------ |
| **SSR 狀態同步** | ✅ 有 (Hydration Friendly)   | ❌ 無 (可能 Double Fetch)      |
| **響應式 (Ref)** | ✅ 回傳 Ref 物件             | ❌ 回傳 Promise (Raw Data)     |
| **主要用途**     | 頁面資料載入 (Data Fetching) | 事件處理、操作型請求 (Actions) |

```typescript
// ⭕️ 正確：頁面載入使用 useFetch
const { data } = await useFetch('/api/user');

// ⭕️ 正確：點擊事件使用 $fetch
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// ❌ 錯誤：在 setup 中直接使用 $fetch (導致 Double Fetch)
const data = await $fetch('/api/user');
```

---

## 3. SEO Meta 管理（useHead）

### 3.1 為什麼需要動態 Meta Tags？

**問題情境：**

- 動態路由頁面（如：產品頁、文章頁）需要根據資料動態生成 Meta Tags
- 每個頁面應該有獨特的 title、description、og:image
- 需要支援 Open Graph、Twitter Card 等社交媒體標籤

**解決方案：** 使用 Nuxt 3 的 `useHead` 或 `useSeoMeta`

### 3.2 useHead 基礎使用

**檔案位置：** `pages/products/[id].vue`

```typescript
useHead({
  title: () => product.value?.name,
  meta: [
    { name: 'description', content: () => product.value?.description },
    { property: 'og:title', content: () => product.value?.name },
    { property: 'og:image', content: () => product.value?.image },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://example.com/products/${product.value?.id}`,
    },
  ],
});
```

**關鍵點說明：**

1. **使用函式回傳值**

   - 使用 `() => product.value?.name` 而非直接 `product.value?.name`
   - 確保資料更新時 Meta Tags 也會更新
   - 支援響應式更新

2. **完整的 SEO Meta Tags**
   - `title`：頁面標題
   - `meta`：description、keywords、og tags 等
   - `link`：canonical URL、alternate 等

### 3.3 useSeoMeta 簡化寫法

Nuxt 3 也提供了 `useSeoMeta`，專門用於 SEO meta tags：

```typescript
useSeoMeta({
  title: () => product.value?.name,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
  twitterCard: 'summary_large_image',
});
```

**優點：**

- ✅ 語法更簡潔
- ✅ 自動處理 Open Graph 和 Twitter Card
- ✅ 支援響應式更新

### 3.4 完整實作範例

```typescript
// pages/products/[id].vue
<script setup lang="ts">
const route = useRoute();

// 1. 載入產品資料（SSR）
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`,
  lazy: false,
  server: true,
});

// 2. 動態生成 SEO Meta Tags
useHead({
  title: () => product.value?.name || '產品頁',
  meta: [
    {
      name: 'description',
      content: () => product.value?.description || '',
    },
    {
      property: 'og:title',
      content: () => product.value?.name || '',
    },
    {
      property: 'og:description',
      content: () => product.value?.description || '',
    },
    {
      property: 'og:image',
      content: () => product.value?.image || '',
    },
    {
      property: 'og:type',
      content: 'product',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://example.com/products/${product.value?.id}`,
    },
  ],
});
</script>
```

---

## 4. 實戰 Case 1：動態路由 SEO 優化

### 4.1 問題背景

**情境：** 電商平台有 10 萬+ SKU，需要確保每個產品頁都能被 Google 正確索引。

**挑戰：**

- 大量動態路由頁面（`/products/[id]`）
- 每個頁面需要獨特的 SEO 內容
- 需要處理 404 情境
- 避免重複內容問題

### 4.2 解決方案

#### Step 1: 使用 useFetch 預先載入資料

```typescript
// pages/products/[id].vue
const { data: product, error } = await useFetch(
  `/api/products/${route.params.id}`,
  {
    key: `product-${route.params.id}`,
    lazy: false, // SSR 時等待完成
    server: true, // 確保 server side 執行
  }
);

// 處理 404 情境
if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}
```

**關鍵點：**

- ✅ 使用 `lazy: false` 確保 SSR 時等待資料載入
- ✅ 正確處理 404，返回 404 status code
- ✅ 使用 `key` 避免重複請求

#### Step 2: 動態生成 Meta Tags

```typescript
useHead({
  title: () => `${product.value?.name} - 產品頁`,
  meta: [
    {
      name: 'description',
      content: () => product.value?.description || '',
    },
    {
      property: 'og:title',
      content: () => product.value?.name || '',
    },
    {
      property: 'og:image',
      content: () => product.value?.image || '',
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://example.com/products/${product.value?.id}`,
    },
  ],
});
```

**關鍵點：**

- ✅ 每個產品頁都有獨特的 title、description
- ✅ 設定 canonical URL 避免重複內容
- ✅ 支援 Open Graph 標籤

#### Step 3: 處理 404 情境

```typescript
// 在 useFetch 後檢查
if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}

// 或在 error.vue 中處理
// error.vue
<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage: string;
  };
}>();

// 設定 404 頁面的 SEO
useHead({
  title: '404 - 找不到頁面',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow', // 告訴搜尋引擎不要索引 404 頁面
    },
  ],
});
</script>
```

**關鍵點：**

- ✅ 正確返回 404 status code
- ✅ 404 頁面設定 `noindex, nofollow`
- ✅ 提供友善的錯誤訊息

### 4.3 實作效果

**優化前：**

- ❌ 搜尋引擎無法看到產品內容（只在客戶端載入）
- ❌ 所有產品頁共用相同的 Meta Tags
- ❌ 404 頁面沒有正確處理

**優化後：**

- ✅ 搜尋引擎能看到完整的產品內容
- ✅ 每個產品頁都有獨特的 SEO Meta Tags
- ✅ 正確處理 404，避免索引錯誤頁面
- ✅ 設定 canonical URL，避免重複內容問題

---

## 5. 實戰 Case 2：效能優化

### 5.1 問題背景

**情境：** SSR 會增加 server loading，需要優化效能。

**挑戰：**

- Server Side 需要處理大量請求
- 避免重複請求相同資料
- 需要快取機制
- 區分需要 SSR 的頁面和可以 CSR 的頁面

### 5.2 解決方案

#### 策略 1: Request Deduplication

**使用 `key` 參數避免重複請求：**

```typescript
// 多個組件同時請求相同資料時，只會發送一次請求
const { data: product } = await useFetch(`/api/products/${id}`, {
  key: `product-${id}`, // 相同 key 的請求會被合併
});
```

**效果：**

- ✅ 多個組件同時請求相同資料時，只會發送一次請求
- ✅ 減少 server loading
- ✅ 提升效能

#### 策略 2: Server-Side Caching

**使用 Nitro Cache：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/products/**': {
        cache: {
          maxAge: 60 * 60, // 快取 1 小時
        },
      },
    },
  },
});
```

**或在 API 中使用：**

```typescript
// server/api/products/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  // 使用 Nitro Cache
  const cached = await useStorage('cache').getItem(`product-${id}`);
  if (cached) {
    return cached;
  }

  const product = await fetchProduct(id);

  // 設定快取
  await useStorage('cache').setItem(`product-${id}`, product, {
    ttl: 60 * 60, // 1 小時
  });

  return product;
});
```

**關鍵點：**

- ✅ 減少資料庫查詢
- ✅ 提升回應速度
- ✅ 降低 server loading

#### 策略 3: 區分 SSR / CSR 頁面

**不需要 SEO 的頁面使用 CSR：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // 預設 SSR
  routeRules: {
    // 需要 SEO 的頁面：SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // 不需要 SEO 的頁面：CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**或在頁面中設定：**

```typescript
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false, // 此頁面不使用 SSR
});
</script>
```

**關鍵點：**

- ✅ 減少不必要的 SSR 處理
- ✅ 提升效能
- ✅ 根據需求選擇 SSR/CSR

#### 策略 4: Critical CSS Inline

**減少 FCP（First Contentful Paint）時間：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'preload',
          as: 'style',
          href: '/critical.css',
        },
      ],
    },
  },
  css: ['~/assets/css/critical.css'], // Critical CSS
});
```

**關鍵點：**

- ✅ 減少首次渲染時間
- ✅ 提升 FCP 指標
- ✅ 改善使用者體驗

### 5.3 實作效果

**優化前：**

- ❌ Server loading 過高
- ❌ 重複請求相同資料
- ❌ 沒有快取機制
- ❌ 所有頁面都使用 SSR

**優化後：**

- ✅ Request deduplication 減少重複請求
- ✅ Server-side caching 提升回應速度
- ✅ 區分 SSR/CSR 頁面，減少不必要的 SSR
- ✅ Critical CSS inline 減少 FCP 時間

---

## 6. 面試重點整理

### 6.1 useFetch / useAsyncData

**可以這樣回答：**

> 在 Nuxt 3 專案中，使用 `useFetch` 在 Server Side 預先載入資料。關鍵設定包括：`key` 用於 request deduplication，避免重複請求；`lazy: false` 確保 SSR 時等待資料載入完成；`server: true` 確保在 Server Side 執行。這樣可以確保搜尋引擎能看到完整的頁面內容。

**關鍵點：**

- ✅ `key` 參數的作用（request deduplication）
- ✅ `lazy: false` 的重要性（SSR 時等待完成）
- ✅ `server: true` 確保 Server Side 執行

### 6.2 動態 Meta Tags

**可以這樣回答：**

> 使用 `useHead` 或 `useSeoMeta` 根據資料動態生成 SEO Meta Tags。關鍵是使用函式回傳值（如：`() => product.value?.name`），確保資料更新時 Meta Tags 也會更新。同時設定完整的 SEO 元素，包括 title、description、Open Graph、canonical URL 等。

**關鍵點：**

- ✅ 使用函式回傳值支援響應式更新
- ✅ 完整的 SEO Meta Tags 結構
- ✅ 動態路由頁面的 SEO 處理

### 6.3 效能優化

**可以這樣回答：**

> 為了優化 SSR 效能，實作了幾個策略：首先，使用 `key` 參數做 request deduplication，避免重複請求；其次，使用 Nitro Cache 做 server-side caching，減少資料庫查詢；最後，區分需要 SEO 的頁面和不需要 SEO 的頁面，不需要 SEO 的頁面使用 CSR，減少不必要的 SSR 處理。

**關鍵點：**

- ✅ Request deduplication
- ✅ Server-side caching
- ✅ 區分 SSR/CSR 頁面

---

## 7. 最佳實踐

### 7.1 Data Fetching

1. **總是設定 `key`**

   - 避免重複請求
   - 提升效能

2. **根據需求選擇 `lazy`**

   - 需要 SEO 的頁面：`lazy: false`
   - 不需要 SEO 的頁面：`lazy: true`

3. **處理錯誤情境**
   - 正確處理 404
   - 提供友善的錯誤訊息

### 7.2 SEO Meta Tags

1. **使用函式回傳值**

   - 支援響應式更新
   - 確保資料更新時 Meta Tags 也會更新

2. **設定完整的 SEO 元素**

   - title、description
   - Open Graph、Twitter Card
   - canonical URL

3. **處理 404 頁面**
   - 設定 `noindex, nofollow`
   - 避免索引錯誤頁面

### 7.3 效能優化

1. **使用快取機制**

   - Server-side caching
   - 減少資料庫查詢

2. **區分 SSR/CSR**

   - 需要 SEO 的頁面：SSR
   - 不需要 SEO 的頁面：CSR

3. **Critical CSS**
   - Inline critical CSS
   - 減少 FCP 時間

---

## 8. 面試總結

**可以這樣回答：**

> 在 Nuxt 3 專案中，實作了完整的 SSR 資料載入與 SEO Meta Tags 管理。首先，使用 `useFetch` 在 Server Side 預先載入資料，確保搜尋引擎能看到完整內容。關鍵設定包括 `key` 用於 request deduplication、`lazy: false` 確保 SSR 時等待完成、`server: true` 確保在 Server Side 執行。其次，使用 `useHead` 根據資料動態生成 SEO Meta Tags，支援動態路由頁面。最後，為了優化效能，實作了 request deduplication、server-side caching，以及區分 SSR/CSR 頁面。

**關鍵點：**

- ✅ useFetch/useAsyncData 的正確使用
- ✅ 動態 Meta Tags 管理（useHead）
- ✅ 動態路由 SEO 優化
- ✅ 效能優化策略
- ✅ 實際專案經驗
