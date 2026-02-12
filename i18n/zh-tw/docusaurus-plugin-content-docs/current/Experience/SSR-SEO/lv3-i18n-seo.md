---
title: '[Lv3] Nuxt 3 多語系 (i18n) 與 SEO 最佳實踐'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> 在 SSR 架構下實作多語系（Internationalization），不只是翻譯文字，更涉及路由策略、SEO 標籤（hreflang）、狀態管理與 Hydration 一致性。

---

## 1. 面試回答主軸

1.  **路由策略**：使用 `@nuxtjs/i18n` 的 URL 前綴策略（如 `/en/about`, `/jp/about`）來區分語系，這對 SEO 最友善。
2.  **SEO 標籤**：確保自動生成正確的 `<link rel="alternate" hreflang="..." />` 與 Canonical URL，避免重複內容懲罰。
3.  **狀態管理**：在 SSR 階段正確偵測使用者語系（Cookie/Header），並確保 Client 端 Hydration 時語系一致。

---

## 2. Nuxt 3 i18n 實作策略

### 2.1 為什麼選擇 `@nuxtjs/i18n`？

官方模組 `@nuxtjs/i18n` 是基於 `vue-i18n`，專為 Nuxt 優化。它解決了手動實作 i18n 常遇到的痛點：

- 自動產生帶語系前綴的路由 (Auto-generated routes)。
- 自動處理 SEO Meta Tags (hreflang, og:locale)。
- 支援 Lazy Loading 語言包（優化 Bundle Size）。

### 2.2 安裝與配置

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
    lazy: true, // 啟用 Lazy Loading
    langDir: 'locales', // 語言檔目錄
    strategy: 'prefix_and_default', // 關鍵路由策略
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // 只在根路徑偵測並轉導
    },
  },
});
```

### 2.3 路由策略 (Routing Strategy)

這是 SEO 的關鍵。`@nuxtjs/i18n` 提供幾種策略：

1.  **prefix_except_default** (推薦)：

    - 預設語系 (tw) 不加前綴：`example.com/about`
    - 其他語系 (en) 加前綴：`example.com/en/about`
    - 優點：URL 乾淨，權重集中。

2.  **prefix_and_default**：

    - 所有語系都加前綴：`example.com/tw/about`, `example.com/en/about`
    - 優點：結構統一，容易處理重導向。

3.  **no_prefix** (不推薦用於 SEO)：
    - 所有語系網址一樣，靠 Cookie 切換。
    - 缺點：搜尋引擎無法索引不同語言的版本。

---

## 3. SEO 關鍵實作

### 3.1 hreflang 標籤

搜尋引擎需要知道「這個頁面有哪些語言版本」。`@nuxtjs/i18n` 會自動在 `<head>` 生成：

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**注意：** 必須在 `nuxt.config.ts` 設定 `baseUrl`，否則 hreflang 會產生相對路徑（無效）。

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // 必須設定！
  },
});
```

### 3.2 Canonical URL

確保每個語言版本的頁面都有指向自己的 Canonical URL，避免被視為重複內容。

### 3.3 動態內容翻譯 (API)

後端 API 也需要支援多語系。通常會在請求時帶上 `Accept-Language` header。

```typescript
// composables/useApi.ts
export const useApi = (url: string) => {
  const { locale } = useI18n();
  return useFetch(url, {
    headers: {
      'Accept-Language': locale.value, // 傳送當前語系給後端
    },
  });
};
```

---

## 4. 常見挑戰與解法

### 4.1 Hydration Mismatch

**問題：** Server 端偵測到英文，渲染英文 HTML；Client 端瀏覽器預設是中文，Vue i18n 初始為中文，導致畫面閃爍或 Hydration Error。

**解法：**

- 使用 `detectBrowserLanguage` 設定，讓 Client 端初始化時尊重 URL 或 Cookie 的設定，而不是瀏覽器設定。
- 確保 Server 與 Client 的 `defaultLocale` 設定一致。

### 4.2 語言切換

使用 `switchLocalePath` 來生成連結，而不是手動組字串。

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

## 5. 面試重點整理

### 5.1 i18n 與 SEO

**Q: 多語系（i18n）在 SSR 環境下要注意什麼？如何處理 SEO？**

> **回答範例：**
> 在 SSR 環境下做 i18n，最重要的是 **SEO** 和 **Hydration 一致性**。
>
> 關於 **SEO**：
>
> 1.  **URL 結構**：我會使用「子路徑」策略（如 `/en/`、`/tw/`），讓不同語言有獨立的 URL，這樣搜尋引擎才能索引。
> 2.  **hreflang**：必須正確設定 `<link rel="alternate" hreflang="..." />`，告訴 Google 這些頁面是同一內容的不同語言版本，避免重複內容懲罰。我通常使用 `@nuxtjs/i18n` 模組自動生成這些標籤。
>
> 關於 **Hydration**：
> 確保 Server 端渲染的語言與 Client 端初始化的語言一致。我會設定從 URL 前綴或 Cookie 決定語言，並在 API 請求 header 帶上對應的 locale。

### 5.2 路由與狀態

**Q: 如何實作語言切換功能？**

> **回答範例：**
> 我會使用 `@nuxtjs/i18n` 提供的 `useSwitchLocalePath` composable。
> 它會自動根據當前路由生成對應語言的 URL（保留 query parameters），並處理路由前綴的轉換。這樣可以避免手動處理字串拼接的錯誤，也確保切換語言時使用者還停留在原本的頁面內容。

---

## 6. Reference

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
