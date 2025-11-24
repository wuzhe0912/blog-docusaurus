---
title: '[Lv1] SEO 基礎實作：Router 模式與 Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> 在多品牌平台專案中，實作 SEO 基礎配置：Router History Mode、Meta Tags 結構與靜態頁面 SEO。

---

## 1. 面試回答主軸

1. **Router 模式選擇**：使用 History Mode 而非 Hash Mode，提供乾淨的 URL 結構。
2. **Meta Tags 基礎**：實作完整的 SEO meta tags，包含 Open Graph 和 Twitter Card。
3. **靜態頁面 SEO**：為 Landing Page 配置完整的 SEO 元素。

---

## 2. Router History Mode 配置

### 2.1 為什麼選擇 History Mode？

**檔案位置：** `quasar.config.js`

```javascript
// 第 82 行
vueRouterMode: "history", // 使用 history 模式而非 hash 模式
```

**SEO 優勢：**

| 模式             | URL 範例  | SEO 影響                |
| ---------------- | --------- | ----------------------- |
| **Hash Mode**    | `/#/home` | ❌ 搜尋引擎較難索引     |
| **History Mode** | `/home`   | ✅ 乾淨的 URL，易於索引 |

**關鍵差異：**

- History Mode 產生乾淨的 URL（如：`/home` 而非 `/#/home`）
- 搜尋引擎更容易索引和爬取
- 更好的使用者體驗和分享體驗
- 需要後端支援（避免 404 錯誤）

### 2.2 後端配置需求

使用 History Mode 時，需要後端配置：

```nginx
# Nginx 範例
location / {
  try_files $uri $uri/ /index.html;
}
```

這樣可以確保所有路由都回傳 `index.html`，由前端 Router 處理。

---

## 3. Meta Tags 基礎結構

### 3.1 基本 SEO Meta Tags

**檔案位置：** `template/*/public/landingPage/index.html`

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

**說明：**

- `title`：頁面標題，影響搜尋結果顯示
- `keywords`：關鍵字（現代 SEO 重要性較低，但仍建議設定）
- `description`：頁面描述，會顯示在搜尋結果中

### 3.2 Open Graph Tags（社交媒體分享）

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

- Facebook、LinkedIn 等社交媒體分享時顯示的預覽
- `og:image` 建議尺寸：1200x630px
- `og:type` 可設定為 `website`、`article` 等

### 3.3 Twitter Card Tags

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AMUSE VIP" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="images/amuse.webp" />
```

**Twitter Card 類型：**

- `summary`：小卡片
- `summary_large_image`：大圖片卡片（推薦）

---

## 4. 靜態 Landing Page SEO 實作

### 4.1 完整的 SEO 元素清單

在專案的 Landing Page 中，實作了以下 SEO 元素：

```html
✅ Title 標籤 ✅ Keywords meta tag ✅ Description meta tag ✅ Open Graph
tags（Facebook、LinkedIn 等） ✅ Twitter Card tags ✅ Canonical URL ✅ Favicon
設定
```

### 4.2 實作範例

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
    <!-- 頁面內容 -->
  </body>
</html>
```

---

## 5. 面試重點整理

### 5.1 Router 模式選擇

**為什麼選擇 History Mode？**

- 提供乾淨的 URL，提升 SEO 效果
- 搜尋引擎更容易索引
- 更好的使用者體驗

**需要注意什麼？**

- 需要後端配置支援（避免直接存取路由時出現 404）
- 需要設定 fallback 機制

### 5.2 Meta Tags 的重要性

**基本 Meta Tags：**

- `title`：影響搜尋結果顯示
- `description`：影響點擊率
- `keywords`：現代 SEO 重要性較低，但仍建議設定

**社交媒體 Meta Tags：**

- Open Graph：Facebook、LinkedIn 等平台分享預覽
- Twitter Card：Twitter 分享預覽
- 圖片尺寸建議：1200x630px

---

## 6. 最佳實踐

1. **Title 標籤**

   - 長度控制在 50-60 字元
   - 包含主要關鍵字
   - 每個頁面都應該有獨特的 title

2. **Description**

   - 長度控制在 150-160 字元
   - 簡潔描述頁面內容
   - 包含行動呼籲（CTA）

3. **Open Graph 圖片**

   - 尺寸：1200x630px
   - 檔案大小：< 1MB
   - 使用高品質圖片

4. **Canonical URL**
   - 避免重複內容問題
   - 指向主要版本的 URL

---

## 7. 面試總結

**可以這樣回答：**

> 在專案中，我選擇使用 Vue Router 的 History Mode 而非 Hash Mode，因為 History Mode 提供乾淨的 URL 結構，對 SEO 更友善。同時，我也為 Landing Page 實作了完整的 SEO meta tags，包含基本的 title、description、keywords，以及 Open Graph 和 Twitter Card tags，確保在社交媒體分享時能正確顯示預覽內容。

**關鍵點：**

- ✅ Router History Mode 的選擇與原因
- ✅ Meta Tags 的完整結構
- ✅ 社交媒體分享優化
- ✅ 實際專案經驗
