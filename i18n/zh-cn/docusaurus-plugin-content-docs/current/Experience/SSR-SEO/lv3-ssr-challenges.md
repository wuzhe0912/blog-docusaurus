---
title: '[Lv3] SSR 实作难题与解决方案'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> 在 SSR 实作过程中，常见的难题与解决方案：Hydration Mismatch、环境变数处理、第三方套件兼容性、效能优化等。

---

## 📋 面试情境题

**Q: 在实作 SSR 时，有遇到哪些难题？如何解决？**

这是面试中经常会被问到的问题，面试官想了解：

1. **实际经验**：是否真的实作过 SSR
2. **问题解决能力**：遇到问题时的思考过程
3. **技术深度**：对 SSR 原理的理解程度
4. **最佳实践**：是否有采用业界标准做法

---

## 难题 1：Hydration Mismatch 错误

### 问题描述

**错误讯息：**

```
[Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
```

**发生原因：**

- Server Side 渲染的 HTML 与 Client Side 渲染的 HTML 不一致
- 常见于使用浏览器专用 API（`window`、`document`、`localStorage` 等）
- 时间相关的内容（如：`new Date()`）在 Server 和 Client 执行时间不同

### 解决方案

#### 方案 1: 使用 `ClientOnly` 组件

**适用场景：** 组件只在客户端渲染

```vue
<template>
  <div>
    <h1>主要内容（SSR）</h1>
    <ClientOnly>
      <BrowserOnlyComponent />
      <template #fallback>
        <div>载入中...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

**优点：**

- ✅ 简单直接
- ✅ Nuxt 内建支援

**缺点：**

- ⚠️ 该部分内容不会在 SSR 中渲染
- ⚠️ 可能影响 SEO

#### 方案 2: 使用 `process.client` 检查

**适用场景：** 条件式渲染客户端专用内容

```vue
<script setup lang="ts">
const userAgent = ref('');

onMounted(() => {
  // 只在客户端执行
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

**关键点：**

- ✅ 使用 `process.client` 检查执行环境
- ✅ 避免在 Server Side 存取浏览器 API

#### 方案 3: 使用 `onMounted` Hook

**适用场景：** 需要在客户端执行的初始化逻辑

```vue
<script setup lang="ts">
const isClient = ref(false);

onMounted(() => {
  isClient.value = true;
  // 客户端专用的初始化逻辑
  initializeClientOnlyFeature();
});
</script>

<template>
  <div>
    <div v-if="isClient">客户端内容</div>
    <div v-else>伺服器端内容（或载入中）</div>
  </div>
</template>
```

#### 方案 4: 统一 Server 和 Client 的资料来源

**适用场景：** 时间、随机数等会导致不一致的内容

```vue
<script setup lang="ts">
// ❌ 错误：Server 和 Client 时间不同
const currentTime = new Date().toISOString();

// ✅ 正确：从 API 取得统一时间
const { data: serverTime } = await useFetch('/api/time');
const currentTime = serverTime.value;
</script>
```

### 面试回答范例

> 在实作 SSR 时，最常遇到的是 Hydration Mismatch 错误。这通常发生在使用浏览器专用 API 时，例如 `window`、`localStorage` 等。我的解决方式是：首先，使用 `ClientOnly` 组件包裹只在客户端渲染的内容；其次，使用 `process.client` 检查执行环境，避免在 Server Side 存取浏览器 API；最后，对于时间、随机数等会导致不一致的内容，统一从 Server Side API 取得，确保 Server 和 Client 的资料一致。

---

## 难题 2：环境变数处理

### 问题描述

**问题情境：**

- Server Side 和 Client Side 需要不同的环境变数
- 敏感资讯（如：API Key）不应该暴露到客户端
- 需要区分开发、测试、生产环境

### 解决方案

#### 方案 1: 使用 Nuxt 的环境变数

**Server Side 环境变数：**

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

**Client Side 环境变数：**

```typescript
// .env
NUXT_PUBLIC_API_URL=https://api.example.com

// 客户端可以使用
const apiUrl = useRuntimeConfig().public.apiUrl;
```

**关键点：**

- ✅ `NUXT_` 开头的变数在 Server Side 可用
- ✅ `NUXT_PUBLIC_` 开头的变数在 Client Side 也可用
- ✅ 敏感资讯使用 `NUXT_`（不带 `PUBLIC`）

#### 方案 2: 使用 `useRuntimeConfig`

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // 私有变数（只在 Server Side 可用）
    apiSecret: process.env.API_SECRET,

    // 公开变数（Client Side 也可用）
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

### 面试回答范例

> 在 SSR 专案中，环境变数的处理很重要。我使用 Nuxt 的环境变数机制：`NUXT_` 开头的变数只在 Server Side 可用，用于存放敏感资讯如 API Key、资料库连线等；`NUXT_PUBLIC_` 开头的变数在 Client Side 也可用，用于存放公开资讯如 API URL。同时使用 `useRuntimeConfig` 统一管理，确保环境变数的正确使用。

---

## 难题 3：第三方套件不支援 SSR

### 问题描述

**问题情境：**

- 某些第三方套件（如：图表库、动画库）不支援 SSR
- 直接使用会导致 Hydration Mismatch
- 需要找到 SSR 兼容的替代方案

### 解决方案

#### 方案 1: 使用 `ClientOnly` 包裹

```vue
<template>
  <ClientOnly>
    <ChartComponent :data="chartData" />
    <template #fallback>
      <div class="chart-skeleton">载入中...</div>
    </template>
  </ClientOnly>
</template>
```

#### 方案 2: 动态导入（Dynamic Import）

```vue
<script setup lang="ts">
const ChartComponent = ref(null);

onMounted(async () => {
  // 只在客户端动态导入
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

#### 方案 3: 使用 SSR 兼容的替代方案

**范例：图表库选择**

```typescript
// ❌ 不支援 SSR
import Chart from 'chart.js';

// ✅ 支援 SSR
import { Chart } from 'vue-chartjs';
// 或使用其他 SSR 兼容的图表库
```

### 面试回答范例

> 在实作 SSR 时，遇到某些第三方套件不支援 SSR 的问题。我的解决方式是：首先，使用 `ClientOnly` 组件包裹不支援 SSR 的组件，并提供 fallback 内容；其次，对于复杂的套件，使用动态导入（Dynamic Import）在客户端载入；最后，优先选择 SSR 兼容的替代方案，例如使用 `vue-chartjs` 而非直接使用 `chart.js`。

---

## 难题 4：Cookie 和 Header 处理

### 问题描述

**问题情境：**

- Server Side 需要读取 Cookie 进行身份验证
- 需要将 Cookie 传递给 API 请求
- Client Side 和 Server Side 的 Cookie 处理方式不同

### 解决方案

#### 方案 1: 使用 `useCookie`

```typescript
// 读取 Cookie
const token = useCookie('auth-token');

// 设定 Cookie
token.value = 'new-token-value';

// 设定 Cookie 选项
const token = useCookie('auth-token', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7, // 7 天
});
```

**关键点：**

- ✅ `useCookie` 在 Server Side 和 Client Side 都可使用
- ✅ 自动处理 Cookie 的读写
- ✅ 支援 Cookie 选项设定

#### 方案 2: 在 Server API 中读取 Cookie

```typescript
// server/api/user.ts
export default defineEventHandler(async (event) => {
  // 读取 Cookie
  const token = getCookie(event, 'auth-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  // 使用 token 验证使用者
  const user = await verifyToken(token);
  return user;
});
```

#### 方案 3: 在 useFetch 中传递 Cookie

```typescript
// 自动传递 Cookie
const { data } = await useFetch('/api/user', {
  credentials: 'include', // 自动包含 Cookie
});
```

### 面试回答范例

> 在 SSR 专案中，Cookie 和 Header 的处理很重要。我使用 Nuxt 的 `useCookie` 统一处理 Cookie，它在 Server Side 和 Client Side 都可使用，自动处理 Cookie 的读写。在 Server API 中，使用 `getCookie` 读取 Cookie 进行身份验证。同时，在 `useFetch` 中设定 `credentials: 'include'` 确保 Cookie 自动传递给 API 请求。

---

## 难题 5：非同步资料载入时机

### 问题描述

**问题情境：**

- 多个组件需要相同的资料
- 避免重复请求
- 确保资料在 SSR 时正确载入

### 解决方案

#### 方案 1: 使用 `key` 参数做 Request Deduplication

```typescript
// 多个组件使用相同的 key，只会发送一次请求
const { data: product } = await useFetch(`/api/products/${id}`, {
  key: `product-${id}`, // 关键：使用相同的 key
});
```

#### 方案 2: 使用 Composables 统一管理资料

```typescript
// composables/useProduct.ts
export const useProduct = (id: string) => {
  return useFetch(`/api/products/${id}`, {
    key: `product-${id}`,
    lazy: false,
    server: true,
  });
};

// 在多个组件中使用
const { data: product } = useProduct('123');
```

#### 方案 3: 使用 `useAsyncData` 的 `getCachedData`

```typescript
// 检查是否有快取的资料
const cachedData = useNuxtApp().payload.data[`product-${id}`];

if (cachedData) {
  // 使用快取的资料
  product.value = cachedData;
} else {
  // 载入新资料
  const { data } = await useFetch(`/api/products/${id}`, {
    key: `product-${id}`,
  });
  product.value = data.value;
}
```

### 面试回答范例

> 在 SSR 专案中，非同步资料载入的时机很重要。我使用 `useFetch` 的 `key` 参数做 request deduplication，确保多个组件请求相同资料时只会发送一次请求。同时，将资料载入逻辑封装成 Composables，统一管理资料载入逻辑。这样可以避免重复请求，提升效能，并确保资料在 SSR 时正确载入。

---

## 难题 6：效能优化（Server Loading）

### 问题描述

**问题情境：**

- SSR 会增加 Server 负载
- 需要处理大量并发请求
- 需要优化回应时间

### 解决方案

#### 方案 1: Server-Side Caching

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/products/**': {
        cache: {
          maxAge: 60 * 60, // 快取 1 小时
        },
      },
    },
  },
});
```

#### 方案 2: 区分 SSR / CSR 页面

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 需要 SEO 的页面：SSR
    '/products/**': { ssr: true },

    // 不需要 SEO 的页面：CSR
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

#### 方案 4: 资料库查询优化

```typescript
// server/api/products/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  // 使用资料库索引优化查询
  const product = await db.products.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      // 只选择需要的栏位
    },
  });

  return product;
});
```

### 面试回答范例

> 在 SSR 专案中，效能优化很重要。我实作了几个策略：首先，使用 Nitro Cache 做 server-side caching，减少资料库查询；其次，区分需要 SEO 的页面和不需要 SEO 的页面，不需要 SEO 的页面使用 CSR，减少不必要的 SSR 处理；最后，使用 CDN 快取静态内容，并优化资料库查询，只选择需要的栏位。这些优化可以大幅降低 Server Loading，提升回应速度。

---

## 难题 7：错误处理与 404 页面

### 问题描述

**问题情境：**

- 动态路由可能不存在（如：`/products/99999`）
- 需要正确返回 404 status code
- 需要处理 API 错误

### 解决方案

#### 方案 1: 使用 `createError`

```typescript
// pages/products/[id].vue
const { data: product, error } = await useFetch(
  `/api/products/${route.params.id}`
);

if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}
```

#### 方案 2: 在 Server API 中处理错误

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

#### 方案 3: 自订错误页面

```vue
<!-- error.vue -->
<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage: string;
  };
}>();

// 设定错误页面的 SEO
useHead({
  title: `${props.error.statusCode} - 错误`,
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow', // 404 页面不要被索引
    },
  ],
});
</script>

<template>
  <div class="error-page">
    <h1>{{ error.statusCode }}</h1>
    <p>{{ error.statusMessage }}</p>
    <NuxtLink to="/">返回首页</NuxtLink>
  </div>
</template>
```

### 面试回答范例

> 在 SSR 专案中，错误处理很重要。我使用 `createError` 统一处理错误，确保正确返回 HTTP status code（如：404）。在 Server API 中，当资料不存在时抛出 404 错误。同时，建立自订错误页面（`error.vue`），设定 `noindex, nofollow` 避免搜寻引擎索引错误页面，并提供友善的错误讯息和返回连结。

---

## 难题 8：浏览器专用 API 的使用

### 问题描述

**问题情境：**

- `window`、`document`、`localStorage` 等 API 在 Server Side 不存在
- 直接使用会导致错误
- 需要安全地使用这些 API

### 解决方案

#### 方案 1: 使用 `process.client` 检查

```typescript
if (process.client) {
  // 安全使用浏览器 API
  const userAgent = navigator.userAgent;
  localStorage.setItem('key', 'value');
}
```

#### 方案 2: 使用 `onMounted` Hook

```vue
<script setup lang="ts">
const windowWidth = ref(0);

onMounted(() => {
  // 只在客户端执行
  windowWidth.value = window.innerWidth;

  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
  });
});
</script>
```

#### 方案 3: 使用 Composables 封装

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

### 面试回答范例

> 在 SSR 专案中，浏览器专用 API 的使用需要特别注意。我使用 `process.client` 检查执行环境，确保只在客户端使用这些 API。对于需要在客户端执行的初始化逻辑，使用 `onMounted` Hook。同时，将浏览器 API 的使用封装成 Composables，统一管理，确保程式码的可维护性和安全性。

---

---

## 难题 9：Server-side Memory Leak

### 问题描述

**问题情境：**

- Node.js Server 的记忆体使用量随时间持续增加，最终导致 Crash (OOM)。
- 常见原因：全域变数 (Global State)、未清除的 Timer、未释放的 Event Listener。
- 在 SPA 中，页面重新整理记忆体就会释放；但在 SSR 中，Server Process 是长期运行的，Memory Leak 累积起来很致命。

### 解决方案

#### 方案 1: 避免全域变数 (Singletons)

在 SSR 环境下，模组层级的变数是「跨请求共享」的。如果把使用者特定的资料存在模组变数中，不仅会造成 Memory Leak，还会导致资料污染（A 使用者看到 B 使用者的资料）。

```typescript
// ❌ 错误：全域变数会一直留在记忆体中
const globalCache = new Map();

export default defineEventHandler((event) => {
  // ...
});

// ✅ 正确：使用 Nuxt 的 useRuntimeConfig 或每个请求独立的变数
```

#### 方案 2: 正确清除副作用

虽然 Server 端通常不执行 `onMounted`，但若在 plugin 或 middleware 中使用了 `setInterval` 或 `EventBus`，必须确保能正确清除。

#### 3. 定位工具

- **Node.js `--inspect`**：结合 Chrome DevTools 的 Memory Tab 进行 Heap Snapshot 比对。
- **`process.memoryUsage()`**：简易监控 RSS (Resident Set Size) 变化。
- **Stress Test**：使用 k6 或 Apache Benchmark 进行压力测试，观察记忆体变化曲线。

---

## 难题 10：第三方广告与追踪码

### 问题描述

**问题情境：**

- 广告代码（如 Google AdSense）或追踪码（GTM）通常包含大量的 DOM 操作或 `document.write`。
- 这些脚本如果在 Hydration 过程中执行，容易阻塞 Main Thread 或导致 Mismatch。
- 影响 Core Web Vitals (FID/INP, CLS)。

### 解决方案

#### 方案 1: 使用 `useHead` 注入 Script

```typescript
useHead({
  script: [
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=UA-XXXX',
      async: true, // 非同步载入
      tagPosition: 'bodyClose', // 放在 body 底部
    },
  ],
});
```

#### 方案 2: 使用 `<ClientOnly>` 与 Placeholder

对于广告区块，Server 端只渲染一个占位区块（设定好固定高度，避免 CLS），Client 端再载入广告。

```vue
<template>
  <div class="ad-container">
    <ClientOnly>
      <GoogleAdSense />
      <template #fallback>
        <!-- 占位区块，避免 Layout Shift -->
        <div style="height: 250px; background: #f0f0f0;"></div>
      </template>
    </ClientOnly>
  </div>
</template>
```

---

## 难题 11：部署架构 (SSR vs SPA)

### 问题描述

**问题情境：**

- 过去习惯部署 SPA 到 S3/CDN，现在 Nuxt 3 SSR 需要 Node.js 环境。
- 需要考量 Cold Start (Serverless) 或 Process Management (VPS)。

### 比较与策略

| 特性         | SPA (Static)       | SSR (Node.js/Edge)                       |
| ------------ | ------------------ | ---------------------------------------- |
| **基础设施** | Storage (S3) + CDN | Compute (EC2, Lambda) + CDN              |
| **部署难度** | 低 (只需上传档案)  | 中 (需管理 Server Process / Environment) |
| **成本**     | 极低               | 较高 (运算资源)                          |
| **维护**     | 无需维护 Server    | 需监控 Error Logs, Memory, CPU           |

### 部署注意事项

1.  **Process Management**：在 VPS 上使用 **PM2** 来管理 Node.js process（自动重启、Cluster mode）。
    ```bash
    pm2 start .output/server/index.mjs --name "nuxt-app"
    ```
2.  **Environment Variables**：确保 CI/CD 流程中正确注入 `NUXT_` 开头的环境变数。
3.  **CDN 快取**：SSR Server 前面一定要挂一层 CDN (Cloudflare/CloudFront)，设定适当的 Cache-Control，减轻 Server 负担。

---

## 面试总结

**可以这样回答：**

> 在实作 SSR 时，我遇到了几个主要难题。首先是 Hydration Mismatch，透过 `ClientOnly` 和 `useState` 解决。其次是 Server-side Memory Leak，这需要避免全域变数并使用工具监控 Heap。第三是第三方脚本处理，我会将广告放在 `ClientOnly` 中并预留空间避免 CLS。最后是部署架构，SSR 需要 Node.js 环境（或 Edge），我会使用 PM2 管理 process，并配置 CDN 来分担流量。

**关键点：**

- ✅ Hydration Mismatch 的解法
- ✅ Memory Leak 的定位 (Global State, Heap Snapshot)
- ✅ 第三方脚本优化 (ClientOnly, Async)
- ✅ SSR 部署架构 (Process Management, CDN)
