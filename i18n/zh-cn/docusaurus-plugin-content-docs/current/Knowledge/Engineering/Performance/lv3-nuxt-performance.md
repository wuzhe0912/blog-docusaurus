---
title: '[Lv3] Nuxt 3 性能优化：Bundle Size、SSR 速度与图片优化'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Nuxt 3 性能优化全攻略：从 Bundle Size 瘦身、SSR 速度优化到图片加载策略，打造极致性能体验。

---

## 1. 面试回答主轴

1.  **Bundle Size 优化**：分析 (`nuxi analyze`)、拆分 (`SplitChunks`)、Tree Shaking、延迟加载 (Lazy Loading)。
2.  **SSR 速度优化 (TTFB)**：Redis 缓存、Nitro Cache、减少阻塞式 API 调用、Streaming SSR。
3.  **图片优化**：`@nuxt/image`、WebP 格式、CDN、Lazy Loading。
4.  **大量数据优化**：虚拟滚动 (Virtual Scrolling)、无限滚动 (Infinite Scroll)、分页 (Pagination)。

---

## 2. 如何减少 Nuxt 3 的 Bundle Size？

### 2.1 诊断工具

首先，必须知道瓶颈在哪里。使用 `nuxi analyze` 来可视化 Bundle 结构。

```bash
npx nuxi analyze
```

这会产生一个报告，显示哪些套件占用了最大空间。

### 2.2 优化策略

#### 1. Code Splitting (代码拆分)
Nuxt 3 默认已经基于路由 (Route-based) 做 Code Splitting。但对于大型套件（如 ECharts, Lodash），我们需要手动优化。

**Nuxt Config 配置 (Vite/Webpack)：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // 将 node_modules 中的大型套件拆分出来
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
确保只引入需要的模块，而不是整个套件。

```typescript
// ❌ 错误：引入整个 lodash
import _ from 'lodash';
_.debounce(() => {}, 100);

// ✅ 正确：只引入 debounce
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// ✅ 推荐：使用 vueuse (Vue 专用且 Tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. 组件 Lazy Loading
对于非首屏需要的组件，使用 `Lazy` 前缀进行动态导入。

```vue
<template>
  <div>
    <!-- 只有当 show 为 true 时才会加载该组件代码 -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. 移除不必要的 Server-side 套件
确保只在 Server 端使用的套件（如数据库驱动、fs 操作）不会被打包到 Client 端。Nuxt 3 会自动处理 `.server.ts` 结尾的文件，或使用 `server/` 目录。

---

## 3. 如何优化 SSR 速度 (TTFB)？

### 3.1 为什么 TTFB 会过长？
TTFB (Time To First Byte) 是 SSR 性能的关键指标。过长的原因通常是：
1.  **API 响应慢**：Server 需要等待后端 API 返回数据才能渲染 HTML。
2.  **串行请求**：多个 API 请求依序执行，而非并行。
3.  **繁重的计算**：Server 端执行了过多 CPU 密集型任务。

### 3.2 优化方案

#### 1. Server-Side Caching (Nitro Cache)
使用 Nitro 的缓存功能，将 API 响应或渲染结果缓存起来。

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 首页缓存 1 小时 (SWR: Stale-While-Revalidate)
    '/': { swr: 3600 },
    // 产品页缓存 10 分钟
    '/products/**': { swr: 600 },
    // API 缓存
    '/api/**': { cache: { maxAge: 60 } },
  },
});
```

#### 2. 并行请求 (Parallel Fetching)
使用 `Promise.all` 并行发送多个请求，而不是 `await` 一个接一个。

```typescript
// ❌ 慢：串行执行 (总时间 = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// ✅ 快：并行执行 (总时间 = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. 延迟非关键数据 (Lazy Fetching)
首屏不需要的数据，可以在 Client 端再加载 (`lazy: true`)，避免阻塞 SSR。

```typescript
// 评论数据不需要 SEO，可以在 Client 端加载
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false, // 甚至完全不在 Server 端执行
});
```

#### 4. Streaming SSR (实验性)
Nuxt 3 支持 HTML Streaming，可以边渲染边返回，让用户更快看到内容。

---

## 4. Nuxt 3 图片优化

### 4.1 使用 @nuxt/image
官方模块 `@nuxt/image` 是最佳解，提供：
-   **自动格式转换**：自动转为 WebP/AVIF。
-   **自动缩放**：根据屏幕大小产生对应尺寸图片。
-   **Lazy Loading**：内建懒加载。
-   **CDN 集成**：支持 Cloudinary, Imgix 等多种 Provider。

### 4.2 实现示例

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    // 默认选项
    format: ['webp'],
  },
});
```

```vue
<template>
  <!-- 自动转换为 webp，宽度 300px，并启用 lazy load -->
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

## 5. 大量数据的分页与滚动

### 5.1 方案选择
针对大量数据（如 10,000 条商品），主要有三种策略，需考量 **SEO**：

| 策略 | 适合场景 | SEO 友好度 |
| :--- | :--- | :--- |
| **传统分页 (Pagination)** | 电商列表、文章列表 | 最佳 |
| **无限滚动 (Infinite Scroll)** | 社交动态、图片墙 | 需特殊处理 |
| **虚拟滚动 (Virtual Scroll)** | 复杂报表、超长列表 | 内容不在 DOM 中 |

### 5.2 如何维持无限滚动的 SEO？
如果是无限滚动，搜索引擎通常只能爬取第一页。解决方案：
1.  **结合分页模式**：提供 `<link rel="next" href="...">` 标签，让爬虫知道有下一页。
2.  **Noscript Fallback**：提供一个传统分页的 `<noscript>` 版本给爬虫。
3.  **Load More 按钮**：首屏 SSR 渲染前 20 条，后续点击「加载更多」或滚动触发 Client-side fetch。

### 5.3 实现示例 (Load More + SEO)

```vue
<script setup>
// 首屏数据 (SSR)
const page = ref(1);
const { data: posts } = await useFetch('/api/posts', {
  query: { page: page.value }
});

// Client 端加载更多
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
    <button @click="loadMore">加载更多</button>

    <!-- SEO 优化：告诉爬虫有下一页 -->
    <Head>
      <Link rel="next" :href="`/posts?page=${page + 1}`" />
    </Head>
  </div>
</template>
```

---

## 6. SSR 环境下的 Lazy Loading

### 6.1 问题描述
在 SSR 环境中，如果使用 `IntersectionObserver` 实现 Lazy Loading，因为 Server 端没有 `window` 或 `document`，会导致错误或 Hydration Mismatch。

### 6.2 解决方案

#### 1. 使用 Nuxt 内建组件
-   `<LazyComponent>`
-   `<NuxtImg loading="lazy">`

#### 2. 自定义 Directive (需处理 SSR)

```typescript
// plugins/lazy-load.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      // 只在 Client 端执行
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value;
          observer.disconnect();
        }
      });
      observer.observe(el);
    },
    getSSRProps(binding) {
      // Server 端渲染占位图或原图 (视 SEO 需求而定)
      return {
        src: 'placeholder.png'
      };
    }
  });
});
```

---

## 7. SSR 性能监控与追踪

### 7.1 为什么需要监控？
SSR 应用程序的性能瓶颈往往发生在 Server 端，浏览器的 DevTools 看不到。如果不监控，很难发现 API 响应慢、Memory Leak 或 CPU 飙高是造成 TTFB 变慢的主因。

### 7.2 常用工具

1.  **Nuxt DevTools (开发阶段)**：
    -   内建于 Nuxt 3。
    -   可以查看 Server Routes 的响应时间。
    -   **Open Graph** 预览 SEO。
    -   **Server Routes** 面板监控 API 调用耗时。

2.  **Lighthouse / PageSpeed Insights (部署后)**：
    -   监控 Core Web Vitals (LCP, CLS, FID/INP)。
    -   LCP (Largest Contentful Paint) 高度依赖 SSR 的 TTFB。

3.  **Server-Side Monitoring (APM)**：
    -   **Sentry / Datadog**：追踪 Server 端错误与性能。
    -   **OpenTelemetry**：追踪完整的 Request Trace (从 Nuxt Server -> API Server -> DB)。

### 7.3 实现简单的时间追踪

在 `server/middleware` 中可以实现一个简单的计时器：

```typescript
// server/middleware/timing.ts
export default defineEventHandler((event) => {
  const start = performance.now();

  event.node.res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[${event.method}] ${event.path} - ${duration.toFixed(2)}ms`);

    // 也可以加入 Server-Timing header，让浏览器 DevTools 看得到
    // event.node.res.setHeader('Server-Timing', `total;dur=${duration}`);
  });
});
```

---

## 8. 面试总结

**Q: 如何追踪和监控 SSR 的性能问题？**
> 我在开发阶段主要使用 **Nuxt DevTools** 来查看 Server Routes 的响应时间和 Payload 大小。
> 在 Production 环境，我会关注 **Core Web Vitals** (特别是 LCP) 和 **TTFB**。
> 如果需要深入追踪 Server 端瓶颈，我会使用自定义的 Server Middleware 记录请求时间，并通过 `Server-Timing` header 将数据传回浏览器，或者集成 **Sentry** / **OpenTelemetry** 进行全链路追踪。

**Q: 如何减少 Nuxt 3 的 bundle size？**
> 我会先用 `nuxi analyze` 分析。针对大型套件（如 lodash）做 Tree Shaking 或手动拆分 (`manualChunks`)。对于非首屏组件，使用 `<LazyComponent>` 进行动态导入。

**Q: 如何优化 SSR 速度？**
> 重点是减少 TTFB。我会使用 Nitro 的 `routeRules` 设置 Server-side caching (SWR)。API 请求尽量用 `Promise.all` 并行处理。非关键数据设置 `lazy: true` 移到 Client 端加载。

**Q: Image optimization 怎么做？**
> 我使用 `@nuxt/image` 模块，它能自动转档 WebP、自动缩放尺寸，并支持 Lazy Loading，大幅减少传输量。

**Q: 无限滚动如何兼顾 SEO？**
> 无限滚动对 SEO 不友好。如果是内容型网站，我会优先选用传统分页。如果必须用无限滚动，我会在 SSR 渲染第一页，并通过 Meta Tags (`rel="next"`) 告诉爬虫分页结构，或者提供 Noscript 的分页链接。
