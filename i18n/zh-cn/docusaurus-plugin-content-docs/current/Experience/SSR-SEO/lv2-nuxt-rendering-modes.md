---
title: '[Lv2] Nuxt 3 Rendering Modes：SSR、SSG、CSR 选择策略'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> 理解 Nuxt 3 的 Rendering Modes，能够根据项目需求选择合适的渲染策略（SSR、SSG、CSR）。

---

## 1. 面试回答主轴

1. **Rendering Modes 分类**：Nuxt 3 支持 SSR、SSG、CSR、Hybrid Rendering 四种模式
2. **选择策略**：根据 SEO 需求、内容动态性、性能要求选择合适的模式
3. **实作经验**：在项目中如何配置与选择不同的 Rendering Modes

---

## 2. Nuxt 3 Rendering Modes 介绍

### 2.1 四种 Rendering Modes

Nuxt 3 支持四种主要的 Rendering Modes：

| 模式 | 全名 | 渲染时机 | 适用场景 |
|------|------|---------|---------|
| **SSR** | Server-Side Rendering | 每次请求时在 Server 端渲染 | 需要 SEO + 动态内容 |
| **SSG** | Static Site Generation | 构建时预先生成 HTML | 需要 SEO + 内容固定 |
| **CSR** | Client-Side Rendering | 在浏览器端渲染 | 不需要 SEO + 交互性高 |
| **Hybrid** | Hybrid Rendering | 混合使用多种模式 | 不同页面有不同需求 |

### 2.2 SSR (Server-Side Rendering)

**定义：** 每次请求时，在 Server 端执行 JavaScript，生成完整的 HTML，然后发送给浏览器。

**配置方式：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // 默认为 true
});
```

**流程：**
1. 浏览器请求页面
2. Server 执行 JavaScript，生成完整 HTML
3. 发送 HTML 给浏览器
4. 浏览器 Hydration（启用交互功能）

**优点：**
- ✅ SEO 友好（搜索引擎可以看到完整内容）
- ✅ 首次加载速度快（不需要等待 JavaScript 执行）
- ✅ 支持动态内容（每次请求都能获取最新数据）

**缺点：**
- ❌ Server 负担较重（每个请求都需要执行渲染）
- ❌ TTFB（Time To First Byte）可能较长
- ❌ 需要 Server 环境

**适用场景：**
- 电商产品页（需要 SEO + 动态价格/库存）
- 新闻文章页（需要 SEO + 动态内容）
- 用户个人页面（需要 SEO + 个性化内容）

### 2.3 SSG (Static Site Generation)

**定义：** 在构建时（Build Time）预先生成所有 HTML 页面，部署为静态文件。

**配置方式：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSG 需要 SSR 为 true
  nitro: {
    prerender: {
      routes: ['/about', '/contact'], // 指定要预渲染的路由
    },
  },
});

// 或使用 routeRules
export default defineNuxtConfig({
  routeRules: {
    '/about': { prerender: true },
    '/contact': { prerender: true },
  },
});
```

**流程：**
1. 构建时执行 JavaScript，生成所有页面的 HTML
2. 将 HTML 文件部署到 CDN
3. 浏览器请求时直接返回预先生成的 HTML

**优点：**
- ✅ 性能最佳（CDN 缓存，响应速度快）
- ✅ SEO 友好（完整 HTML 内容）
- ✅ Server 负担最小（不需要运行时渲染）
- ✅ 成本低（可以部署到 CDN）

**缺点：**
- ❌ 不适合动态内容（需要重新构建才能更新）
- ❌ 构建时间可能较长（大量页面时）
- ❌ 无法处理用户特定的内容

**适用场景：**
- 关于我们页面（内容固定）
- 产品说明页（内容相对固定）
- 博客文章（发布后不会频繁变动）

### 2.4 CSR (Client-Side Rendering)

**定义：** 在浏览器中执行 JavaScript，动态生成 HTML 内容。

**配置方式：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // 全局关闭 SSR
});

// 或针对特定路由
export default defineNuxtConfig({
  routeRules: {
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});

// 或在页面中设定
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false,
});
</script>
```

**流程：**
1. 浏览器请求 HTML（通常是空的 shell）
2. 下载 JavaScript bundle
3. 执行 JavaScript，动态生成内容
4. 渲染页面

**优点：**
- ✅ 交互性高，适合 SPA
- ✅ 减少 Server 负担
- ✅ 页面切换流畅（不需要重新加载）

**缺点：**
- ❌ SEO 不友好（搜索引擎可能无法正确索引）
- ❌ 首次加载时间较长（需要下载并执行 JavaScript）
- ❌ 需要 JavaScript 才能看到内容

**适用场景：**
- 后台管理系统（不需要 SEO）
- 用户仪表盘（不需要 SEO）
- 交互式应用（如游戏、工具）

### 2.5 Hybrid Rendering（混合渲染）

**定义：** 根据不同页面的需求，混合使用多种 Rendering Modes。

**配置方式：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // 默认 SSR
  routeRules: {
    // 需要 SEO 的页面：SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // 内容固定的页面：SSG
    '/about': { prerender: true },
    '/contact': { prerender: true },

    // 不需要 SEO 的页面：CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**优点：**
- ✅ 根据页面特性选择合适的模式
- ✅ 平衡 SEO、性能、开发体验
- ✅ 灵活度高

**适用场景：**
- 大型项目（不同页面有不同需求）
- 电商平台（产品页 SSR、后台 CSR、关于页 SSG）

### 2.6 ISR (Incremental Static Regeneration)

**定义：** 增量静态再生。结合了 SSG 的性能与 SSR 的动态性。页面在构建时或第一次请求时生成静态 HTML，并在一段时间（TTL）内缓存。当缓存过期后的下一次请求，会触发后台重新生成页面，同时返回旧的缓存内容（Stale-While-Revalidate）。

**配置方式：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 启用 ISR，缓存 1 小时 (3600 秒)
    '/blog/**': { swr: 3600 },
    // 或者使用 isr 属性 (在 Netlify/Vercel 等平台有特定支持)
    '/products/**': { isr: 600 },
  },
});
```

**流程：**
1. 请求 A 到达：Server 渲染页面，返回并缓存 (Cache MISS -> HIT)。
2. 请求 B 到达 (TTL 内)：直接返回缓存内容 (Cache HIT)。
3. 请求 C 到达 (TTL 后)：直接返回旧缓存 (Stale)，同时在后台重新渲染并更新缓存 (Revalidate)。
4. 请求 D 到达：返回新的缓存内容。

**优点：**
- ✅ 接近 SSG 的极致性能
- ✅ 解决 SSG 构建时间过长的问题
- ✅ 内容可以定期更新

**适用场景：**
- 大型博客
- 电商产品详情页
- 新闻网站

### 2.7 Route Rules 与缓存策略

Nuxt 3 使用 `routeRules` 来统一管理混合渲染与缓存策略。这是在 Nitro 层级处理的。

| 属性 | 意义 | 适用场景 |
|------|------|---------|
| `ssr: true` | 强制 Server-Side Rendering | SEO + 高度动态 |
| `ssr: false` | 强制 Client-Side Rendering (SPA) | 后台、仪表盘 |
| `prerender: true` | 构建时预渲染 (SSG) | 关于我们、条款页 |
| `swr: true` | 启用 SWR 缓存 (无过期时间，直到重新部署) | 变动极少的内容 |
| `swr: 60` | 启用 ISR，缓存 60 秒 | 列表页、活动页 |
| `cache: { maxAge: 60 }` | 设定 Cache-Control header (浏览器/CDN 缓存) | 静态资源 |

---

## 3. 选择策略

### 3.1 根据需求选择 Rendering Mode

**决策流程图：**

```
需要 SEO？
├─ 是 → 内容经常变动？
│   ├─ 是 → SSR
│   └─ 否 → SSG
└─ 否 → CSR
```

**选择对照表：**

| 需求 | 推荐模式 | 原因 |
|------|---------|------|
| **需要 SEO** | SSR / SSG | 搜索引擎可以看到完整内容 |
| **内容经常变动** | SSR | 每次请求都能获取最新内容 |
| **内容相对固定** | SSG | 性能最佳，成本最低 |
| **不需要 SEO** | CSR | 交互性高，页面切换流畅 |
| **大量页面** | SSG | 构建时生成，CDN 缓存 |
| **用户特定内容** | SSR / CSR | 需要动态生成 |

### 3.2 实战案例

#### 案例 1：电商平台

**需求：**
- 产品页需要 SEO（让 Google 索引）
- 产品内容经常变动（价格、库存）
- 用户个人页面不需要 SEO

**解决方案：**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // 产品页：SSR（需要 SEO + 动态内容）
    '/products/**': { ssr: true },

    // 关于我们：SSG（内容固定）
    '/about': { prerender: true },

    // 用户页面：CSR（不需要 SEO）
    '/user/**': { ssr: false },
  },
});
```

#### 案例 2：博客网站

**需求：**
- 文章页需要 SEO
- 文章内容相对固定（发布后不会频繁变动）
- 需要快速加载

**解决方案：**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // 文章页：SSG（内容固定 + 需要 SEO）
    '/articles/**': { prerender: true },

    // 首页：SSG（内容固定）
    '/': { prerender: true },

    // 后台管理：CSR（不需要 SEO）
    '/admin/**': { ssr: false },
  },
});
```

---

## 4. 面试重点整理

### 4.1 Nuxt 3 的 Rendering Modes

**可以这样回答：**

> Nuxt 3 支持四种 Rendering Modes：SSR 是在 Server 端每次请求时渲染，适合需要 SEO 且内容动态的页面；SSG 是在构建时预先生成 HTML，适合需要 SEO 且内容固定的页面，性能最佳；CSR 是在浏览器端渲染，适合不需要 SEO 且交互性高的页面；Hybrid Rendering 是混合使用多种模式，根据不同页面的需求选择合适的模式。

**关键点：**
- ✅ 四种模式的特性与差异
- ✅ 适用场景与选择考量
- ✅ Hybrid Rendering 的优势

### 4.2 如何选择 Rendering Mode？

**可以这样回答：**

> 选择 Rendering Mode 主要考量三个因素：SEO 需求、内容动态性、性能要求。需要 SEO 的页面选择 SSR 或 SSG；内容经常变动的选择 SSR；内容固定的选择 SSG；不需要 SEO 的页面可以选择 CSR。实际项目中通常会使用 Hybrid Rendering，根据不同页面的特性选择合适的模式。例如，电商平台的产品页使用 SSR（需要 SEO + 动态内容），关于我们页面使用 SSG（内容固定），用户个人页面使用 CSR（不需要 SEO）。

**关键点：**
- ✅ 根据 SEO 需求、内容动态性、性能要求选择
- ✅ 实际项目中混合使用多种模式
- ✅ 具体案例说明

### 4.3 ISR 与 Route Rules
**Q: 如何实现 ISR（Incremental Static Regeneration）？Nuxt 3 的 caching 机制有哪些？**

> **回答范例：**
> 在 Nuxt 3 中，我们可以通过 `routeRules` 来实现 ISR。
> 只要在 `nuxt.config.ts` 中设定 `{ swr: 秒数 }`，Nitro 就会自动启用 Stale-While-Revalidate 机制。
> 例如 `'/blog/**': { swr: 3600 }` 代表该路径下的页面会被缓存 1 小时。
> `routeRules` 非常强大，可以针对不同路径设定不同的策略：有的页面走 SSR，有的走 SSG (`prerender: true`)，有的走 ISR (`swr`)，有的走 CSR (`ssr: false`)，这就是 Hybrid Rendering 的精髓。

---

## 5. 最佳实践

### 5.1 选择原则

1. **需要 SEO 的页面**
   - 内容固定 → SSG
   - 内容动态 → SSR

2. **不需要 SEO 的页面**
   - 交互性高 → CSR
   - 需要 Server 端逻辑 → SSR

3. **混合策略**
   - 根据页面特性选择合适的模式
   - 使用 `routeRules` 统一管理

### 5.2 配置建议

1. **默认使用 SSR**
   - 确保 SEO 友好
   - 可以后续针对特定页面调整

2. **使用 routeRules 统一管理**
   - 集中配置，易于维护
   - 清楚标示每个页面的渲染模式

3. **定期检视与优化**
   - 根据实际使用情况调整
   - 监控性能指标

---

## 6. 面试总结

**可以这样回答：**

> Nuxt 3 支持四种 Rendering Modes：SSR、SSG、CSR 和 Hybrid Rendering。SSR 适合需要 SEO 且内容动态的页面；SSG 适合需要 SEO 且内容固定的页面，性能最佳；CSR 适合不需要 SEO 且交互性高的页面。选择时主要考量 SEO 需求、内容动态性和性能要求。实际项目中通常会使用 Hybrid Rendering，根据不同页面的特性选择合适的模式。例如，电商平台的产品页使用 SSR，关于我们页面使用 SSG，用户个人页面使用 CSR。

**关键点：**
- ✅ 四种 Rendering Modes 的特性与差异
- ✅ 选择策略与考量因素
- ✅ Hybrid Rendering 的实作经验
- ✅ 实际项目案例

---

## 7. Reference

- [Nuxt 3 Rendering Modes](https://nuxt.com/docs/guide/concepts/rendering)
- [Nuxt 3 Route Rules](https://nuxt.com/docs/api/nuxt-config#routerules)
