---
id: ssr-seo-lv3-ssr-challenges
title: '[Lv3] SSR 實作難題與解決方案'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> 在 SSR 實作過程中，常見的難題與解決方案：Hydration Mismatch、環境變數處理、第三方套件相容性、效能優化等。

---

## 📋 面試情境題

**Q: 在實作 SSR 時，有遇到哪些難題？如何解決？**

這是面試中經常會被問到的問題，面試官想了解：

1. **實際經驗**：是否真的實作過 SSR
2. **問題解決能力**：遇到問題時的思考過程
3. **技術深度**：對 SSR 原理的理解程度
4. **最佳實踐**：是否有採用業界標準做法

---

## 難題 1：Hydration Mismatch 錯誤

### 問題描述

**錯誤訊息：**
```
[Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
```

**發生原因：**
- Server Side 渲染的 HTML 與 Client Side 渲染的 HTML 不一致
- 常見於使用瀏覽器專用 API（`window`、`document`、`localStorage` 等）
- 時間相關的內容（如：`new Date()`）在 Server 和 Client 執行時間不同

### 解決方案

#### 方案 1: 使用 `ClientOnly` 組件

**適用場景：** 組件只在客戶端渲染

```vue
<template>
  <div>
    <h1>主要內容（SSR）</h1>
    <ClientOnly>
      <BrowserOnlyComponent />
      <template #fallback>
        <div>載入中...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

**優點：**
- ✅ 簡單直接
- ✅ Nuxt 內建支援

**缺點：**
- ⚠️ 該部分內容不會在 SSR 中渲染
- ⚠️ 可能影響 SEO

#### 方案 2: 使用 `process.client` 檢查

**適用場景：** 條件式渲染客戶端專用內容

```vue
<script setup lang="ts">
const userAgent = ref('');

onMounted(() => {
  // 只在客戶端執行
  if (process.client) {
    userAgent.value = navigator.userAgent;
  }
});
</script>

<template>
  <div>
    <p v-if="userAgent">User Agent: {{ userAgent }}</p>
  </div>
</template>
```

**關鍵點：**
- ✅ 使用 `process.client` 檢查執行環境
- ✅ 避免在 Server Side 存取瀏覽器 API

#### 方案 3: 使用 `onMounted` Hook

**適用場景：** 需要在客戶端執行的初始化邏輯

```vue
<script setup lang="ts">
const isClient = ref(false);

onMounted(() => {
  isClient.value = true;
  // 客戶端專用的初始化邏輯
  initializeClientOnlyFeature();
});
</script>

<template>
  <div>
    <div v-if="isClient">客戶端內容</div>
    <div v-else>伺服器端內容（或載入中）</div>
  </div>
</template>
```

#### 方案 4: 統一 Server 和 Client 的資料來源

**適用場景：** 時間、隨機數等會導致不一致的內容

```vue
<script setup lang="ts">
// ❌ 錯誤：Server 和 Client 時間不同
const currentTime = new Date().toISOString();

// ✅ 正確：從 API 取得統一時間
const { data: serverTime } = await useFetch('/api/time');
const currentTime = serverTime.value;
</script>
```

### 面試回答範例

> 在實作 SSR 時，最常遇到的是 Hydration Mismatch 錯誤。這通常發生在使用瀏覽器專用 API 時，例如 `window`、`localStorage` 等。我的解決方式是：首先，使用 `ClientOnly` 組件包裹只在客戶端渲染的內容；其次，使用 `process.client` 檢查執行環境，避免在 Server Side 存取瀏覽器 API；最後，對於時間、隨機數等會導致不一致的內容，統一從 Server Side API 取得，確保 Server 和 Client 的資料一致。

---

## 難題 2：環境變數處理

### 問題描述

**問題情境：**
- Server Side 和 Client Side 需要不同的環境變數
- 敏感資訊（如：API Key）不應該暴露到客戶端
- 需要區分開發、測試、生產環境

### 解決方案

#### 方案 1: 使用 Nuxt 的環境變數

**Server Side 環境變數：**

```typescript
// .env
NUXT_API_SECRET_KEY=secret_key_123
NUXT_DATABASE_URL=postgresql://...

// server/api/example.ts
export default defineEventHandler(async (event) => {
  // 只在 Server Side 可用
  const secretKey = process.env.NUXT_API_SECRET_KEY;
  // ...
});
```

**Client Side 環境變數：**

```typescript
// .env
NUXT_PUBLIC_API_URL=https://api.example.com

// 客戶端可以使用
const apiUrl = useRuntimeConfig().public.apiUrl;
```

**關鍵點：**
- ✅ `NUXT_` 開頭的變數在 Server Side 可用
- ✅ `NUXT_PUBLIC_` 開頭的變數在 Client Side 也可用
- ✅ 敏感資訊使用 `NUXT_`（不帶 `PUBLIC`）

#### 方案 2: 使用 `useRuntimeConfig`

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 私有變數（只在 Server Side 可用）
    apiSecret: process.env.API_SECRET,
    
    // 公開變數（Client Side 也可用）
    public: {
      apiUrl: process.env.PUBLIC_API_URL || 'https://api.example.com',
    },
  },
});

// 使用方式
const config = useRuntimeConfig();
// Server Side: config.apiSecret 可用
// Client Side: config.public.apiUrl 可用
```

### 面試回答範例

> 在 SSR 專案中，環境變數的處理很重要。我使用 Nuxt 的環境變數機制：`NUXT_` 開頭的變數只在 Server Side 可用，用於存放敏感資訊如 API Key、資料庫連線等；`NUXT_PUBLIC_` 開頭的變數在 Client Side 也可用，用於存放公開資訊如 API URL。同時使用 `useRuntimeConfig` 統一管理，確保環境變數的正確使用。

---

## 難題 3：第三方套件不支援 SSR

### 問題描述

**問題情境：**
- 某些第三方套件（如：圖表庫、動畫庫）不支援 SSR
- 直接使用會導致 Hydration Mismatch
- 需要找到 SSR 相容的替代方案

### 解決方案

#### 方案 1: 使用 `ClientOnly` 包裹

```vue
<template>
  <ClientOnly>
    <ChartComponent :data="chartData" />
    <template #fallback>
      <div class="chart-skeleton">載入中...</div>
    </template>
  </ClientOnly>
</template>
```

#### 方案 2: 動態導入（Dynamic Import）

```vue
<script setup lang="ts">
const ChartComponent = ref(null);

onMounted(async () => {
  // 只在客戶端動態導入
  if (process.client) {
    const module = await import('chart-library');
    ChartComponent.value = module.default;
  }
});
</script>

<template>
  <component v-if="ChartComponent" :is="ChartComponent" :data="chartData" />
</template>
```

#### 方案 3: 使用 SSR 相容的替代方案

**範例：圖表庫選擇**

```typescript
// ❌ 不支援 SSR
import Chart from 'chart.js';

// ✅ 支援 SSR
import { Chart } from 'vue-chartjs';
// 或使用其他 SSR 相容的圖表庫
```

### 面試回答範例

> 在實作 SSR 時，遇到某些第三方套件不支援 SSR 的問題。我的解決方式是：首先，使用 `ClientOnly` 組件包裹不支援 SSR 的組件，並提供 fallback 內容；其次，對於複雜的套件，使用動態導入（Dynamic Import）在客戶端載入；最後，優先選擇 SSR 相容的替代方案，例如使用 `vue-chartjs` 而非直接使用 `chart.js`。

---

## 難題 4：Cookie 和 Header 處理

### 問題描述

**問題情境：**
- Server Side 需要讀取 Cookie 進行身份驗證
- 需要將 Cookie 傳遞給 API 請求
- Client Side 和 Server Side 的 Cookie 處理方式不同

### 解決方案

#### 方案 1: 使用 `useCookie`

```typescript
// 讀取 Cookie
const token = useCookie('auth-token');

// 設定 Cookie
token.value = 'new-token-value';

// 設定 Cookie 選項
const token = useCookie('auth-token', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7, // 7 天
});
```

**關鍵點：**
- ✅ `useCookie` 在 Server Side 和 Client Side 都可使用
- ✅ 自動處理 Cookie 的讀寫
- ✅ 支援 Cookie 選項設定

#### 方案 2: 在 Server API 中讀取 Cookie

```typescript
// server/api/user.ts
export default defineEventHandler(async (event) => {
  // 讀取 Cookie
  const token = getCookie(event, 'auth-token');
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }
  
  // 使用 token 驗證使用者
  const user = await verifyToken(token);
  return user;
});
```

#### 方案 3: 在 useFetch 中傳遞 Cookie

```typescript
// 自動傳遞 Cookie
const { data } = await useFetch('/api/user', {
  credentials: 'include', // 自動包含 Cookie
});
```

### 面試回答範例

> 在 SSR 專案中，Cookie 和 Header 的處理很重要。我使用 Nuxt 的 `useCookie` 統一處理 Cookie，它在 Server Side 和 Client Side 都可使用，自動處理 Cookie 的讀寫。在 Server API 中，使用 `getCookie` 讀取 Cookie 進行身份驗證。同時，在 `useFetch` 中設定 `credentials: 'include'` 確保 Cookie 自動傳遞給 API 請求。

---

## 難題 5：非同步資料載入時機

### 問題描述

**問題情境：**
- 多個組件需要相同的資料
- 避免重複請求
- 確保資料在 SSR 時正確載入

### 解決方案

#### 方案 1: 使用 `key` 參數做 Request Deduplication

```typescript
// 多個組件使用相同的 key，只會發送一次請求
const { data: product } = await useFetch(`/api/products/${id}`, {
  key: `product-${id}`, // 關鍵：使用相同的 key
});
```

#### 方案 2: 使用 Composables 統一管理資料

```typescript
// composables/useProduct.ts
export const useProduct = (id: string) => {
  return useFetch(`/api/products/${id}`, {
    key: `product-${id}`,
    lazy: false,
    server: true,
  });
};

// 在多個組件中使用
const { data: product } = useProduct('123');
```

#### 方案 3: 使用 `useAsyncData` 的 `getCachedData`

```typescript
// 檢查是否有快取的資料
const cachedData = useNuxtApp().payload.data[`product-${id}`];

if (cachedData) {
  // 使用快取的資料
  product.value = cachedData;
} else {
  // 載入新資料
  const { data } = await useFetch(`/api/products/${id}`, {
    key: `product-${id}`,
  });
  product.value = data.value;
}
```

### 面試回答範例

> 在 SSR 專案中，非同步資料載入的時機很重要。我使用 `useFetch` 的 `key` 參數做 request deduplication，確保多個組件請求相同資料時只會發送一次請求。同時，將資料載入邏輯封裝成 Composables，統一管理資料載入邏輯。這樣可以避免重複請求，提升效能，並確保資料在 SSR 時正確載入。

---

## 難題 6：效能優化（Server Loading）

### 問題描述

**問題情境：**
- SSR 會增加 Server 負載
- 需要處理大量併發請求
- 需要優化回應時間

### 解決方案

#### 方案 1: Server-Side Caching

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

#### 方案 2: 區分 SSR / CSR 頁面

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 需要 SEO 的頁面：SSR
    '/products/**': { ssr: true },
    
    // 不需要 SEO 的頁面：CSR
    '/dashboard/**': { ssr: false },
  },
});
```

#### 方案 3: 使用 CDN 快取

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/products/**': {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      },
    },
  },
});
```

#### 方案 4: 資料庫查詢優化

```typescript
// server/api/products/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  // 使用資料庫索引優化查詢
  const product = await db.products.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      // 只選擇需要的欄位
    },
  });
  
  return product;
});
```

### 面試回答範例

> 在 SSR 專案中，效能優化很重要。我實作了幾個策略：首先，使用 Nitro Cache 做 server-side caching，減少資料庫查詢；其次，區分需要 SEO 的頁面和不需要 SEO 的頁面，不需要 SEO 的頁面使用 CSR，減少不必要的 SSR 處理；最後，使用 CDN 快取靜態內容，並優化資料庫查詢，只選擇需要的欄位。這些優化可以大幅降低 Server Loading，提升回應速度。

---

## 難題 7：錯誤處理與 404 頁面

### 問題描述

**問題情境：**
- 動態路由可能不存在（如：`/products/99999`）
- 需要正確返回 404 status code
- 需要處理 API 錯誤

### 解決方案

#### 方案 1: 使用 `createError`

```typescript
// pages/products/[id].vue
const { data: product, error } = await useFetch(`/api/products/${route.params.id}`);

if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}
```

#### 方案 2: 在 Server API 中處理錯誤

```typescript
// server/api/products/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const product = await db.products.findUnique({ where: { id } });
  
  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    });
  }
  
  return product;
});
```

#### 方案 3: 自訂錯誤頁面

```vue
<!-- error.vue -->
<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage: string;
  };
}>();

// 設定錯誤頁面的 SEO
useHead({
  title: `${props.error.statusCode} - 錯誤`,
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow', // 404 頁面不要被索引
    },
  ],
});
</script>

<template>
  <div class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage }}</p>
    <NuxtLink to="/">返回首頁</NuxtLink>
  </div>
</template>
```

### 面試回答範例

> 在 SSR 專案中，錯誤處理很重要。我使用 `createError` 統一處理錯誤，確保正確返回 HTTP status code（如：404）。在 Server API 中，當資料不存在時拋出 404 錯誤。同時，建立自訂錯誤頁面（`error.vue`），設定 `noindex, nofollow` 避免搜尋引擎索引錯誤頁面，並提供友善的錯誤訊息和返回連結。

---

## 難題 8：瀏覽器專用 API 的使用

### 問題描述

**問題情境：**
- `window`、`document`、`localStorage` 等 API 在 Server Side 不存在
- 直接使用會導致錯誤
- 需要安全地使用這些 API

### 解決方案

#### 方案 1: 使用 `process.client` 檢查

```typescript
if (process.client) {
  // 安全使用瀏覽器 API
  const userAgent = navigator.userAgent;
  localStorage.setItem('key', 'value');
}
```

#### 方案 2: 使用 `onMounted` Hook

```vue
<script setup lang="ts">
const windowWidth = ref(0);

onMounted(() => {
  // 只在客戶端執行
  windowWidth.value = window.innerWidth;
  
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
  });
});
</script>
```

#### 方案 3: 使用 Composables 封裝

```typescript
// composables/useLocalStorage.ts
export const useLocalStorage = (key: string) => {
  const value = ref<string | null>(null);
  
  if (process.client) {
    value.value = localStorage.getItem(key);
    
    const setValue = (newValue: string) => {
      localStorage.setItem(key, newValue);
      value.value = newValue;
    };
    
    return { value, setValue };
  }
  
  return { value, setValue: () => {} };
};
```

### 面試回答範例

> 在 SSR 專案中，瀏覽器專用 API 的使用需要特別注意。我使用 `process.client` 檢查執行環境，確保只在客戶端使用這些 API。對於需要在客戶端執行的初始化邏輯，使用 `onMounted` Hook。同時，將瀏覽器 API 的使用封裝成 Composables，統一管理，確保程式碼的可維護性和安全性。

---

## 面試總結

**可以這樣回答：**

> 在實作 SSR 時，我遇到了幾個主要難題。首先是 Hydration Mismatch 錯誤，解決方式是使用 `ClientOnly` 組件、`process.client` 檢查，以及統一 Server 和 Client 的資料來源。其次是環境變數處理，使用 Nuxt 的環境變數機制區分 Server Side 和 Client Side 的變數。第三是第三方套件不支援 SSR，使用 `ClientOnly` 包裹或動態導入。第四是 Cookie 和 Header 處理，使用 `useCookie` 統一處理。第五是非同步資料載入時機，使用 `key` 參數做 request deduplication。第六是效能優化，使用 server-side caching、區分 SSR/CSR 頁面。第七是錯誤處理，使用 `createError` 統一處理。最後是瀏覽器專用 API 的使用，使用 `process.client` 檢查和 `onMounted` Hook。

**關鍵點：**
- ✅ Hydration Mismatch 的解決方案
- ✅ 環境變數的正確處理
- ✅ 第三方套件的 SSR 相容性
- ✅ Cookie 和 Header 處理
- ✅ 非同步資料載入優化
- ✅ 效能優化策略
- ✅ 錯誤處理機制
- ✅ 瀏覽器 API 的安全使用

