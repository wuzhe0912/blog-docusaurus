---
title: '[Lv1] SEO 基础实作：Router 模式与 Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> 在多品牌平台项目中，实作 SEO 基础配置：Router History Mode、Meta Tags 结构与静态页面 SEO。

---

## 1. 面试回答主轴

1. **Router 模式选择**：使用 History Mode 而非 Hash Mode，提供干净的 URL 结构。
2. **Meta Tags 基础**：实作完整的 SEO meta tags，包含 Open Graph 和 Twitter Card。
3. **静态页面 SEO**：为 Landing Page 配置完整的 SEO 元素。

---

## 2. Router History Mode 配置

### 2.1 为什么选择 History Mode？

**文件位置：** `quasar.config.js`

```javascript
// 第 82 行
vueRouterMode: "history", // 使用 history 模式而非 hash 模式
```

**SEO 优势：**

| 模式             | URL 范例  | SEO 影响                |
| ---------------- | --------- | ----------------------- |
| **Hash Mode**    | `/#/home` | ❌ 搜索引擎较难索引     |
| **History Mode** | `/home`   | ✅ 干净的 URL，易于索引 |

**关键差异：**

- History Mode 产生干净的 URL（如：`/home` 而非 `/#/home`）
- 搜索引擎更容易索引和爬取
- 更好的用户体验和分享体验
- 需要后端支持（避免 404 错误）

### 2.2 后端配置需求

使用 History Mode 时，需要后端配置：

```nginx
# Nginx 范例
location / {
  try_files $uri $uri/ /index.html;
}
```

这样可以确保所有路由都返回 `index.html`，由前端 Router 处理。

---

## 3. Meta Tags 基础结构

### 3.1 基本 SEO Meta Tags

**文件位置：** `template/*/public/landingPage/index.html`

```html
<!-- 基本 Meta Tags -->
<meta charset="UTF-8" />
<title>AMUSE VIP</title>
<meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
<meta
  name="description"
  content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
/>
```

**说明：**

- `title`：页面标题，影响搜索结果显示
- `keywords`：关键字（现代 SEO 重要性较低，但仍建议设定）
- `description`：页面描述，会显示在搜索结果中

### 3.2 Open Graph Tags（社交媒体分享）

```html
<!-- Open Graph Tags -->
<meta property="og:site_name" content="AMUSE VIP" />
<meta property="og:title" content="AMUSE VIP" />
<meta property="og:type" content="website" />
<meta property="og:url" content="#" />
<meta property="og:description" content="..." />
<meta property="og:image" content="images/amuse.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

**用途：**

- Facebook、LinkedIn 等社交媒体分享时显示的预览
- `og:image` 建议尺寸：1200x630px
- `og:type` 可设定为 `website`、`article` 等

### 3.3 Twitter Card Tags

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AMUSE VIP" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="images/amuse.webp" />
```

**Twitter Card 类型：**

- `summary`：小卡片
- `summary_large_image`：大图片卡片（推荐）

---

## 4. 静态 Landing Page SEO 实作

### 4.1 完整的 SEO 元素清单

在项目的 Landing Page 中，实作了以下 SEO 元素：

```html
✅ Title 标签 ✅ Keywords meta tag ✅ Description meta tag ✅ Open Graph
tags（Facebook、LinkedIn 等） ✅ Twitter Card tags ✅ Canonical URL ✅ Favicon
设定
```

### 4.2 实作范例

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- 基本 SEO -->
    <title>AMUSE VIP</title>
    <meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
    <meta
      name="description"
      content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
    />

    <!-- Open Graph -->
    <meta property="og:site_name" content="AMUSE VIP" />
    <meta property="og:title" content="AMUSE VIP" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://example.com" />
    <meta property="og:description" content="..." />
    <meta property="og:image" content="images/amuse.webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="AMUSE VIP" />
    <meta name="twitter:description" content="..." />
    <meta name="twitter:image" content="images/amuse.webp" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://example.com" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="favicon.png" />
  </head>
  <body>
    <!-- 页面内容 -->
  </body>
</html>
```

---

## 5. 面试重点整理

### 5.1 Router 模式选择

**为什么选择 History Mode？**

- 提供干净的 URL，提升 SEO 效果
- 搜索引擎更容易索引
- 更好的用户体验

**需要注意什么？**

- 需要后端配置支持（避免直接访问路由时出现 404）
- 需要设定 fallback 机制

### 5.2 Meta Tags 的重要性

**基本 Meta Tags：**

- `title`：影响搜索结果显示
- `description`：影响点击率
- `keywords`：现代 SEO 重要性较低，但仍建议设定

**社交媒体 Meta Tags：**

- Open Graph：Facebook、LinkedIn 等平台分享预览
- Twitter Card：Twitter 分享预览
- 图片尺寸建议：1200x630px

---

## 6. 最佳实践

1. **Title 标签**

   - 长度控制在 50-60 字符
   - 包含主要关键字
   - 每个页面都应该有独特的 title

2. **Description**

   - 长度控制在 150-160 字符
   - 简洁描述页面内容
   - 包含行动号召（CTA）

3. **Open Graph 图片**

   - 尺寸：1200x630px
   - 文件大小：< 1MB
   - 使用高质量图片

4. **Canonical URL**
   - 避免重复内容问题
   - 指向主要版本的 URL

---

## 7. 面试总结

**可以这样回答：**

> 在项目中，我选择使用 Vue Router 的 History Mode 而非 Hash Mode，因为 History Mode 提供干净的 URL 结构，对 SEO 更友好。同时，我也为 Landing Page 实作了完整的 SEO meta tags，包含基本的 title、description、keywords，以及 Open Graph 和 Twitter Card tags，确保在社交媒体分享时能正确显示预览内容。

**关键点：**

- ✅ Router History Mode 的选择与原因
- ✅ Meta Tags 的完整结构
- ✅ 社交媒体分享优化
- ✅ 实际项目经验
