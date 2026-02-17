---
title: '[Lv2] Nuxt 3 Server 功能实作：Server Routes 与动态 Sitemap'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> 掌握 Nuxt 3 的 Nitro Server Engine 功能，实作 Server Routes (API Routes)、动态 Sitemap 与 Robots.txt，提升网站的 SEO 与架构弹性。

---

## 1. 面试回答主轴

1.  **Server Routes (API Routes)**：使用 `server/api` 或 `server/routes` 建立后端逻辑。常用于隐藏 API Key、处理 CORS、BFF (Backend for Frontend) 架构。
2.  **动态 Sitemap**：透过 Server Routes (`server/routes/sitemap.xml.ts`) 动态生成 XML，确保搜索引擎能索引最新内容。
3.  **Robots.txt**：同样透过 Server Routes 动态生成，或使用 Nuxt Config 配置，控制爬虫访问权限。

---

## 2. Nuxt 3 Server Engine: Nitro

### 2.1 什么是 Nitro？

Nitro 是 Nuxt 3 的全新服务器引擎，它让 Nuxt 应用程序可以部署到任何地方（Universal Deployment）。它不仅仅是一个服务器，更是一个强大的构建与运行时工具。

### 2.2 Nitro 的核心特色

1.  **跨平台部署 (Universal Deployment)**：
    可以编译成 Node.js server、Serverless Functions (Vercel, AWS Lambda, Netlify)、Service Workers 等多种格式。Zero-config 即可部署到主流平台。

2.  **轻量且快速 (Lightweight & Fast)**：
    Cold start 时间极短，且生成的 bundle size 非常小（最小可达 < 1MB）。

3.  **自动代码分割 (Auto Code Splitting)**：
    自动分析 Server Routes 的依赖性，并进行 code splitting，确保启动速度。

4.  **HMR (Hot Module Replacement)**：
    不仅前端有 HMR，Nitro 让后端 API 开发也能享有 HMR，修改 `server/` 文件无需重启服务器。

5.  **Storage Layer (Unstorage)**：
    内建统一的 Storage API，可以轻松连接 Redis, GitHub, FS, Memory 等不同储存接口。

6.  **Server Assets**：
    可以方便地在 Server 端访问静态资源文件。

---

## 3. Nuxt 3 Server Routes (API Routes)

### 3.1 什么是 Server Routes？

Nuxt 3 内建了 **Nitro** 服务器引擎，允许开发者直接在项目中编写后端 API。这些文件放在 `server/api` 或 `server/routes` 目录下，会自动映射为 API endpoint。

- `server/api/hello.ts` -> `/api/hello`
- `server/routes/hello.ts` -> `/hello`

### 2.2 什么情况下会用？（常见面试题）

**1. 隐藏敏感信息 (Secret Management)**
前端无法安全地储存 Private API Key。透过 Server Routes 作为中介，可以在 Server 端使用环境变量访问 Key，只将结果返回给前端。

```typescript
// server/api/weather.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // API Key 只在 Server 端使用，不会暴露给 Client
  const data = await $fetch(
    `https://api.weather.com/v1?key=${config.weatherApiKey}`
  );
  return data;
});
```

**2. 处理 CORS 问题 (Proxy)**
当外部 API 不支持 CORS 时，可以使用 Server Routes 作为 Proxy。浏览器请求 Nuxt Server (同源)，Nuxt Server 请求外部 API (无 CORS 限制)。

**3. Backend for Frontend (BFF)**
将多个后端 API 的数据在 Nuxt Server 端聚合、过滤或转换格式后，再一次性返回给前端。减少前端请求次数与 Payload 大小。

**4. 处理 Webhook**
接收第三方服务（如金流、CMS）的 Webhook 通知。

---

## 4. 实作动态 Sitemap

### 3.1 为什么需要动态 Sitemap？

对于内容经常变动的网站（如电商、新闻网），静态生成的 `sitemap.xml` 很快就会过期。使用 Server Routes 可以每次请求时动态生成最新的 Sitemap。

### 3.2 实作方式：手动生成

建立 `server/routes/sitemap.xml.ts`：

```typescript
// server/routes/sitemap.xml.ts
import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // 1. 从数据库或 API 取得所有动态路由数据
  const posts = await $fetch('https://api.example.com/posts');

  const sitemap = new SitemapStream({
    hostname: 'https://example.com',
  });

  // 2. 加入静态页面
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

  // 3. 加入动态页面
  posts.forEach((post) => {
    sitemap.write({
      url: `/posts/${post.id}`,
      changefreq: 'weekly',
      lastmod: post.updatedAt,
    });
  });

  sitemap.end();

  // 4. 设定 Header 并返回 XML
  setHeader(event, 'content-type', 'application/xml');
  return streamToPromise(sitemap);
});
```

### 3.3 实作方式：使用模块 (`@nuxtjs/sitemap`)

对于标准需求，推荐使用官方模块：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    siteUrl: 'https://example.com',
    sources: [
      '/api/sitemap-urls', // 指定一个 API 来提供动态 URL 列表
    ],
  },
});
```

---

## 5. 实作动态 Robots.txt

### 4.1 实作方式

建立 `server/routes/robots.txt.ts`：

```typescript
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProduction = config.public.siteEnv === 'production';

  // 根据环境动态决定规则
  const robots = isProduction
    ? `User-agent: *
Disallow: /admin
Disallow: /private
Sitemap: https://example.com/sitemap.xml`
    : `User-agent: *
Disallow: /`; // 非正式环境禁止索引

  setHeader(event, 'content-type', 'text/plain');
  return robots;
});
```

---

## 6. 面试重点整理

### 5.1 Nitro Engine & Server Routes

**Q: Nuxt 3 的 server engine 是什么？Nitro 的特色是什么？**

> **回答范例：**
> Nuxt 3 的 server engine 叫做 **Nitro**。
> 它的最大特色是 **Universal Deployment**，也就是可以零配置部署到任何环境（Node.js, Vercel, AWS Lambda, Edge Workers 等）。
> 其他特色包含：后端 API 的 **HMR**（修改免重启）、**Auto Code Splitting**（加快启动速度）、以及内建的 **Storage Layer**（方便连接 Redis 或 KV Storage）。

**Q: Nuxt 3 的 Server Routes 是什么？你有实作过吗？**

> **回答范例：**
> 是的，我实作过。Server Routes 是 Nuxt 3 透过 Nitro 引擎提供的后端功能，放在 `server/api` 目录下。
> 我主要在以下情境使用：
>
> 1.  **隐藏 API Key**：例如串接第三方服务时，避免将 Secret Key 暴露在前端代码中。
> 2.  **CORS Proxy**：解决跨域请求问题。
> 3.  **BFF (Backend for Frontend)**：将多个 API 请求整合成一个，减少前端请求次数并优化数据结构。

### 5.2 Sitemap 与 Robots.txt

**Q: 如何在 Nuxt 3 实作动态 sitemap 和 robots.txt？**

> **回答范例：**
> 我会使用 Nuxt 的 Server Routes 来实作。
> 对于 **Sitemap**，我会建立 `server/routes/sitemap.xml.ts`，在里面调用后端 API 取得最新的文章或产品列表，然后使用 `sitemap` 套件生成 XML 字符串并返回。这样可以确保搜索引擎每次爬取都能拿到最新的链接。
> 对于 **Robots.txt**，我会建立 `server/routes/robots.txt.ts`，并根据环境变量（Production 或 Staging）动态返回不同的规则，例如在 Staging 环境设定 `Disallow: /` 防止被索引。

### 5.3 SEO Meta Tags (补充)

**Q: 你如何处理 Nuxt 3 的 SEO meta tags？有用过 useHead 或 useSeoMeta 吗？**

> **回答范例：**
> 我主要使用 Nuxt 3 内建的 `useHead` 和 `useSeoMeta` Composables。
> `useHead` 允许我定义 `title`、`meta`、`link` 等标签。如果是单纯的 SEO 设定，我会优先使用 `useSeoMeta`，因为它的语法更简洁且有类型提示（Type-safe），例如直接设定 `ogTitle`、`description` 等属性。
> 在动态页面（如产品页），我会传入一个 Getter Function（例如 `title: () => product.value.name`），这样当数据更新时，Meta Tags 也会自动响应更新。

---

## 7. 相关 Reference

- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt SEO Module](https://nuxtseo.com/)
