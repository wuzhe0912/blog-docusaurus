---
title: '[Lv3] Nuxt 3 多语系 (i18n) 与 SEO 最佳实践'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> 在 SSR 架构下实作多语系（Internationalization），不只是翻译文字，更涉及路由策略、SEO 标签（hreflang）、状态管理与 Hydration 一致性。

---

## 1. 面试回答主轴

1.  **路由策略**：使用 `@nuxtjs/i18n` 的 URL 前缀策略（如 `/en/about`, `/jp/about`）来区分语系，这对 SEO 最友好。
2.  **SEO 标签**：确保自动生成正确的 `<link rel="alternate" hreflang="..." />` 与 Canonical URL，避免重复内容惩罚。
3.  **状态管理**：在 SSR 阶段正确侦测用户语系（Cookie/Header），并确保 Client 端 Hydration 时语系一致。

---

## 2. Nuxt 3 i18n 实作策略

### 2.1 为什么选择 `@nuxtjs/i18n`？

官方模块 `@nuxtjs/i18n` 是基于 `vue-i18n`，专为 Nuxt 优化。它解决了手动实作 i18n 常遇到的痛点：

- 自动产生带语系前缀的路由 (Auto-generated routes)。
- 自动处理 SEO Meta Tags (hreflang, og:locale)。
- 支持 Lazy Loading 语言包（优化 Bundle Size）。

### 2.2 安装与配置

```bash
npm install @nuxtjs/i18n
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'tw', iso: 'zh-TW', file: 'tw.json', name: '繁體中文' },
    ],
    defaultLocale: 'tw',
    lazy: true, // 启用 Lazy Loading
    langDir: 'locales', // 语言文件目录
    strategy: 'prefix_and_default', // 关键路由策略
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // 只在根路径侦测并转导
    },
  },
});
```

### 2.3 路由策略 (Routing Strategy)

这是 SEO 的关键。`@nuxtjs/i18n` 提供几种策略：

1.  **prefix_except_default** (推荐)：

    - 默认语系 (tw) 不加前缀：`example.com/about`
    - 其他语系 (en) 加前缀：`example.com/en/about`
    - 优点：URL 干净，权重集中。

2.  **prefix_and_default**：

    - 所有语系都加前缀：`example.com/tw/about`, `example.com/en/about`
    - 优点：结构统一，容易处理重定向。

3.  **no_prefix** (不推荐用于 SEO)：
    - 所有语系网址一样，靠 Cookie 切换。
    - 缺点：搜索引擎无法索引不同语言的版本。

---

## 3. SEO 关键实作

### 3.1 hreflang 标签

搜索引擎需要知道「这个页面有哪些语言版本」。`@nuxtjs/i18n` 会自动在 `<head>` 生成：

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**注意：** 必须在 `nuxt.config.ts` 设定 `baseUrl`，否则 hreflang 会产生相对路径（无效）。

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // 必须设定！
  },
});
```

### 3.2 Canonical URL

确保每个语言版本的页面都有指向自己的 Canonical URL，避免被视为重复内容。

### 3.3 动态内容翻译 (API)

后端 API 也需要支持多语系。通常会在请求时带上 `Accept-Language` header。

```typescript
// composables/useApi.ts
export const useApi = (url: string) => {
  const { locale } = useI18n();
  return useFetch(url, {
    headers: {
      'Accept-Language': locale.value, // 传送当前语系给后端
    },
  });
};
```

---

## 4. 常见挑战与解法

### 4.1 Hydration Mismatch

**问题：** Server 端侦测到英文，渲染英文 HTML；Client 端浏览器默认是中文，Vue i18n 初始为中文，导致画面闪烁或 Hydration Error。

**解法：**

- 使用 `detectBrowserLanguage` 设定，让 Client 端初始化时尊重 URL 或 Cookie 的设定，而不是浏览器设定。
- 确保 Server 与 Client 的 `defaultLocale` 设定一致。

### 4.2 语言切换

使用 `switchLocalePath` 来生成链接，而不是手动拼字符串。

```vue
<script setup>
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <nav>
    <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
    <NuxtLink :to="switchLocalePath('tw')">繁體中文</NuxtLink>
  </nav>
</template>
```

---

## 5. 面试重点整理

### 5.1 i18n 与 SEO

**Q: 多语系（i18n）在 SSR 环境下要注意什么？如何处理 SEO？**

> **回答范例：**
> 在 SSR 环境下做 i18n，最重要的是 **SEO** 和 **Hydration 一致性**。
>
> 关于 **SEO**：
>
> 1.  **URL 结构**：我会使用「子路径」策略（如 `/en/`、`/tw/`），让不同语言有独立的 URL，这样搜索引擎才能索引。
> 2.  **hreflang**：必须正确设定 `<link rel="alternate" hreflang="..." />`，告诉 Google 这些页面是同一内容的不同语言版本，避免重复内容惩罚。我通常使用 `@nuxtjs/i18n` 模块自动生成这些标签。
>
> 关于 **Hydration**：
> 确保 Server 端渲染的语言与 Client 端初始化的语言一致。我会设定从 URL 前缀或 Cookie 决定语言，并在 API 请求 header 带上对应的 locale。

### 5.2 路由与状态

**Q: 如何实作语言切换功能？**

> **回答范例：**
> 我会使用 `@nuxtjs/i18n` 提供的 `useSwitchLocalePath` composable。
> 它会自动根据当前路由生成对应语言的 URL（保留 query parameters），并处理路由前缀的转换。这样可以避免手动处理字符串拼接的错误，也确保切换语言时用户还停留在原本的页面内容。

---

## 6. Reference

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
