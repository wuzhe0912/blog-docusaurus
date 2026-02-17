---
title: '[Lv2] SSR 实现：Data Fetching 与 SEO Meta 管理'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> 在 Nuxt 3 项目中，实现 SSR 数据加载与 SEO Meta Tags 动态管理，确保搜索引擎能正确索引动态路由页面。

---

## 1. 面试回答主轴

1. **Data Fetching 策略**：使用 `useFetch`/`useAsyncData` 在 Server Side 预先加载数据，确保 SEO 内容完整。
2. **动态 Meta Tags**：使用 `useHead` 根据数据动态生成 SEO meta tags，支持动态路由页面。
3. **性能优化**：实现 request deduplication、server-side caching，区分 SSR/CSR 页面。

---

## 2. useFetch / useAsyncData 的正确使用

### 2.1 为什么需要 SSR Data Fetching？

**问题情境：**

- 动态路由页面（如：`/products/[id]`）需要从 API 加载数据
- 如果只在客户端加载，搜索引擎无法看到完整内容
- 需要确保 Server Side 预先加载数据，生成完整的 HTML

**解决方案：** 使用 Nuxt 3 的 `useFetch` 或 `useAsyncData`

### 2.2 useFetch 基础使用

**文件位置：** `pages/products/[id].vue`

```typescript
// 基本用法
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**关键参数说明：**

| 参数        | 说明                                   | 默认值   |
| ----------- | -------------------------------------- | -------- |
| `key`       | 唯一标识码，用于 request deduplication | 自动生成 |
| `lazy`      | 是否延迟加载（不阻塞 SSR）             | `false`  |
| `server`    | 是否在 Server Side 执行                | `true`   |
| `default`   | 默认值                                 | `null`   |
| `transform` | 数据转换函数                           | -        |

### 2.3 完整实现范例

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // 避免重复请求
  lazy: false, // SSR 时等待完成
  server: true, // 确保 server side 执行
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // 数据转换逻辑
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**关键点说明：**

1. **`key` 参数**

   - 用于 request deduplication（避免重复请求）
   - 相同 key 的请求会被合并
   - 建议使用唯一标识码（如：`product-${id}`）

2. **`lazy: false`**

   - SSR 时会等待数据加载完成才渲染
   - 确保搜索引擎能看到完整内容
   - 如果设为 `true`，SSR 时不会等待，可能导致内容不完整

3. **`server: true`**
   - 确保在 Server Side 执行
   - 这是 SSR 的关键设定
   - 如果设为 `false`，只会在客户端执行

### 2.4 useAsyncData vs useFetch

**差异对比：**

| 功能         | useFetch                 | useAsyncData           |
| ------------ | ------------------------ | ---------------------- |
| **用途**     | 直接调用 API             | 执行任意异步操作     |
| **自动处理** | ✅ 自动处理 URL、headers | ❌ 需要手动处理        |
| **适用场景** | API 请求                 | 数据库查询、文件读取等 |

**使用范例：**

```typescript
// useFetch：适合 API 请求
const { data } = await useFetch('/api/products/123');

// useAsyncData：适合其他异步操作
const { data } = await useAsyncData('products', async () => {
  // 可以执行任何异步操作
  const result = await someAsyncOperation();
  return result;
});
```

### 2.5 $fetch vs useFetch

**面试常考题：什么时候该用 `$fetch`，什么时候该用 `useFetch`？**

**1. $fetch**

- **定义**：Nuxt 3 底层使用的 HTTP 客户端（基于 `ofetch`）。
- **行为**：单纯发送 HTTP 请求，**不会**处理 SSR 状态同步（Hydration）。
- **风险**：如果在 `setup()` 中直接使用 `$fetch`，Server 端会请求一次，Client 端 Hydration 时会**再次请求**（Double Fetch），且可能导致 Hydration Mismatch。
- **适用场景**：
  - 用户交互触发的请求（如：点击按钮提交表单、加载更多）。
  - Client-side only 的逻辑。
  - Middleware 或 Server API route 内部。

**2. useFetch**

- **定义**：封装了 `useAsyncData` + `$fetch` 的 Composable。
- **行为**：
  - 自动生成 key 进行 Request Deduplication。
  - 处理 SSR 状态传输（将 Server 获取的数据传给 Client，避免 Client 再次请求）。
  - 提供响应式返回值（`data`, `pending`, `error`, `refresh`）。
- **适用场景**：
  - 页面初始化需要的数据（Page Load）。
  - 依赖 URL 参数变动的数据获取。

**总结比较：**

| 特性             | useFetch                     | $fetch                         |
| ---------------- | ---------------------------- | ------------------------------ |
| **SSR 状态同步** | ✅ 有 (Hydration Friendly)   | ❌ 无 (可能 Double Fetch)      |
| **响应式 (Ref)** | ✅ 返回 Ref 对象             | ❌ 返回 Promise (Raw Data)     |
| **主要用途**     | 页面数据加载 (Data Fetching) | 事件处理、操作型请求 (Actions) |

```typescript
// ⭕️ 正确：页面加载使用 useFetch
const { data } = await useFetch('/api/user');

// ⭕️ 正确：点击事件使用 $fetch
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// ❌ 错误：在 setup 中直接使用 $fetch (导致 Double Fetch)
const data = await $fetch('/api/user');
```

---

## 3. SEO Meta 管理（useHead）

### 3.1 为什么需要动态 Meta Tags？

**问题情境：**

- 动态路由页面（如：产品页、文章页）需要根据数据动态生成 Meta Tags
- 每个页面应该有独特的 title、description、og:image
- 需要支持 Open Graph、Twitter Card 等社交媒体标签

**解决方案：** 使用 Nuxt 3 的 `useHead` 或 `useSeoMeta`

### 3.2 useHead 基础使用

**文件位置：** `pages/products/[id].vue`

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

**关键点说明：**

1. **使用函数返回值**

   - 使用 `() => product.value?.name` 而非直接 `product.value?.name`
   - 确保数据更新时 Meta Tags 也会更新
   - 支持响应式更新

2. **完整的 SEO Meta Tags**
   - `title`：页面标题
   - `meta`：description、keywords、og tags 等
   - `link`：canonical URL、alternate 等

### 3.3 useSeoMeta 简化写法

Nuxt 3 也提供了 `useSeoMeta`，专门用于 SEO meta tags：

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

**优点：**

- ✅ 语法更简洁
- ✅ 自动处理 Open Graph 和 Twitter Card
- ✅ 支持响应式更新

### 3.4 完整实现范例

```typescript
// pages/products/[id].vue
<script setup lang="ts">
const route = useRoute();

// 1. 加载产品数据（SSR）
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`,
  lazy: false,
  server: true,
});

// 2. 动态生成 SEO Meta Tags
useHead({
  title: () => product.value?.name || '产品页',
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

## 4. 实战 Case 1：动态路由 SEO 优化

### 4.1 问题背景

**情境：** 电商平台有 10 万+ SKU，需要确保每个产品页都能被 Google 正确索引。

**挑战：**

- 大量动态路由页面（`/products/[id]`）
- 每个页面需要独特的 SEO 内容
- 需要处理 404 情境
- 避免重复内容问题

### 4.2 解决方案

#### Step 1: 使用 useFetch 预先加载数据

```typescript
// pages/products/[id].vue
const { data: product, error } = await useFetch(
  `/api/products/${route.params.id}`,
  {
    key: `product-${route.params.id}`,
    lazy: false, // SSR 时等待完成
    server: true, // 确保 server side 执行
  }
);

// 处理 404 情境
if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}
```

**关键点：**

- ✅ 使用 `lazy: false` 确保 SSR 时等待数据加载
- ✅ 正确处理 404，返回 404 status code
- ✅ 使用 `key` 避免重复请求

#### Step 2: 动态生成 Meta Tags

```typescript
useHead({
  title: () => `${product.value?.name} - 产品页`,
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

**关键点：**

- ✅ 每个产品页都有独特的 title、description
- ✅ 设定 canonical URL 避免重复内容
- ✅ 支持 Open Graph 标签

#### Step 3: 处理 404 情境

```typescript
// 在 useFetch 后检查
if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}

// 或在 error.vue 中处理
// error.vue
<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage: string;
  };
}>();

// 设定 404 页面的 SEO
useHead({
  title: '404 - 找不到页面',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow', // 告诉搜索引擎不要索引 404 页面
    },
  ],
});
</script>
```

**关键点：**

- ✅ 正确返回 404 status code
- ✅ 404 页面设定 `noindex, nofollow`
- ✅ 提供友好的错误信息

### 4.3 实现效果

**优化前：**

- ❌ 搜索引擎无法看到产品内容（只在客户端加载）
- ❌ 所有产品页共用相同的 Meta Tags
- ❌ 404 页面没有正确处理

**优化后：**

- ✅ 搜索引擎能看到完整的产品内容
- ✅ 每个产品页都有独特的 SEO Meta Tags
- ✅ 正确处理 404，避免索引错误页面
- ✅ 设定 canonical URL，避免重复内容问题

---

## 5. 实战 Case 2：性能优化

### 5.1 问题背景

**情境：** SSR 会增加 server loading，需要优化性能。

**挑战：**

- Server Side 需要处理大量请求
- 避免重复请求相同数据
- 需要缓存机制
- 区分需要 SSR 的页面和可以 CSR 的页面

### 5.2 解决方案

#### 策略 1: Request Deduplication

**使用 `key` 参数避免重复请求：**

```typescript
// 多个组件同时请求相同数据时，只会发送一次请求
const { data: product } = await useFetch(`/api/products/${id}`, {
  key: `product-${id}`, // 相同 key 的请求会被合并
});
```

**效果：**

- ✅ 多个组件同时请求相同数据时，只会发送一次请求
- ✅ 减少 server loading
- ✅ 提升性能

#### 策略 2: Server-Side Caching

**使用 Nitro Cache：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/products/**': {
        cache: {
          maxAge: 60 * 60, // 缓存 1 小时
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

  // 设定缓存
  await useStorage('cache').setItem(`product-${id}`, product, {
    ttl: 60 * 60, // 1 小时
  });

  return product;
});
```

**关键点：**

- ✅ 减少数据库查询
- ✅ 提升响应速度
- ✅ 降低 server loading

#### 策略 3: 区分 SSR / CSR 页面

**不需要 SEO 的页面使用 CSR：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // 默认 SSR
  routeRules: {
    // 需要 SEO 的页面：SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // 不需要 SEO 的页面：CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**或在页面中设定：**

```typescript
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false, // 此页面不使用 SSR
});
</script>
```

**关键点：**

- ✅ 减少不必要的 SSR 处理
- ✅ 提升性能
- ✅ 根据需求选择 SSR/CSR

#### 策略 4: Critical CSS Inline

**减少 FCP（First Contentful Paint）时间：**

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

**关键点：**

- ✅ 减少首次渲染时间
- ✅ 提升 FCP 指标
- ✅ 改善用户体验

### 5.3 实现效果

**优化前：**

- ❌ Server loading 过高
- ❌ 重复请求相同数据
- ❌ 没有缓存机制
- ❌ 所有页面都使用 SSR

**优化后：**

- ✅ Request deduplication 减少重复请求
- ✅ Server-side caching 提升响应速度
- ✅ 区分 SSR/CSR 页面，减少不必要的 SSR
- ✅ Critical CSS inline 减少 FCP 时间

---

## 6. 面试重点整理

### 6.1 useFetch / useAsyncData

**可以这样回答：**

> 在 Nuxt 3 项目中，使用 `useFetch` 在 Server Side 预先加载数据。关键设定包括：`key` 用于 request deduplication，避免重复请求；`lazy: false` 确保 SSR 时等待数据加载完成；`server: true` 确保在 Server Side 执行。这样可以确保搜索引擎能看到完整的页面内容。

**关键点：**

- ✅ `key` 参数的作用（request deduplication）
- ✅ `lazy: false` 的重要性（SSR 时等待完成）
- ✅ `server: true` 确保 Server Side 执行

### 6.2 动态 Meta Tags

**可以这样回答：**

> 使用 `useHead` 或 `useSeoMeta` 根据数据动态生成 SEO Meta Tags。关键是使用函数返回值（如：`() => product.value?.name`），确保数据更新时 Meta Tags 也会更新。同时设定完整的 SEO 元素，包括 title、description、Open Graph、canonical URL 等。

**关键点：**

- ✅ 使用函数返回值支持响应式更新
- ✅ 完整的 SEO Meta Tags 结构
- ✅ 动态路由页面的 SEO 处理

### 6.3 性能优化

**可以这样回答：**

> 为了优化 SSR 性能，实现了几个策略：首先，使用 `key` 参数做 request deduplication，避免重复请求；其次，使用 Nitro Cache 做 server-side caching，减少数据库查询；最后，区分需要 SEO 的页面和不需要 SEO 的页面，不需要 SEO 的页面使用 CSR，减少不必要的 SSR 处理。

**关键点：**

- ✅ Request deduplication
- ✅ Server-side caching
- ✅ 区分 SSR/CSR 页面

---

## 7. 最佳实践

### 7.1 Data Fetching

1. **总是设定 `key`**

   - 避免重复请求
   - 提升性能

2. **根据需求选择 `lazy`**

   - 需要 SEO 的页面：`lazy: false`
   - 不需要 SEO 的页面：`lazy: true`

3. **处理错误情境**
   - 正确处理 404
   - 提供友好的错误信息

### 7.2 SEO Meta Tags

1. **使用函数返回值**

   - 支持响应式更新
   - 确保数据更新时 Meta Tags 也会更新

2. **设定完整的 SEO 元素**

   - title、description
   - Open Graph、Twitter Card
   - canonical URL

3. **处理 404 页面**
   - 设定 `noindex, nofollow`
   - 避免索引错误页面

### 7.3 性能优化

1. **使用缓存机制**

   - Server-side caching
   - 减少数据库查询

2. **区分 SSR/CSR**

   - 需要 SEO 的页面：SSR
   - 不需要 SEO 的页面：CSR

3. **Critical CSS**
   - Inline critical CSS
   - 减少 FCP 时间

---

## 8. 面试总结

**可以这样回答：**

> 在 Nuxt 3 项目中，实现了完整的 SSR 数据加载与 SEO Meta Tags 管理。首先，使用 `useFetch` 在 Server Side 预先加载数据，确保搜索引擎能看到完整内容。关键设定包括 `key` 用于 request deduplication、`lazy: false` 确保 SSR 时等待完成、`server: true` 确保在 Server Side 执行。其次，使用 `useHead` 根据数据动态生成 SEO Meta Tags，支持动态路由页面。最后，为了优化性能，实现了 request deduplication、server-side caching，以及区分 SSR/CSR 页面。

**关键点：**

- ✅ useFetch/useAsyncData 的正确使用
- ✅ 动态 Meta Tags 管理（useHead）
- ✅ 动态路由 SEO 优化
- ✅ 性能优化策略
- ✅ 实际项目经验
