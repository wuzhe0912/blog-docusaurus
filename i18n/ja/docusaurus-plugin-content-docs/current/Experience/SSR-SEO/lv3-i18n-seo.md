---
title: '[Lv3] Nuxt 3 多言語 (i18n) と SEO のベストプラクティス'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> SSR アーキテクチャで多言語（Internationalization）を実装するには、テキストの翻訳だけでなく、ルーティング戦略、SEO タグ（hreflang）、状態管理、Hydration の一貫性にも関わります。

---

## 1. 面接回答の要点

1.  **ルーティング戦略**：`@nuxtjs/i18n` の URL プレフィックス戦略（例：`/en/about`, `/jp/about`）を使用して言語を区別する。これが SEO に最も適している。
2.  **SEO タグ**：正しい `<link rel="alternate" hreflang="..." />` と Canonical URL が自動生成されることを確認し、重複コンテンツのペナルティを回避。
3.  **状態管理**：SSR 段階でユーザーの言語を正確に検出（Cookie/Header）し、Client 側の Hydration 時に言語が一致することを確認。

---

## 2. Nuxt 3 i18n 実装戦略

### 2.1 なぜ `@nuxtjs/i18n` を選ぶのか？

公式モジュール `@nuxtjs/i18n` は `vue-i18n` ベースで、Nuxt 向けに最適化されています。手動で i18n を実装する際によく遭遇する課題を解決します：

- 言語プレフィックス付きルートの自動生成 (Auto-generated routes)。
- SEO Meta Tags の自動処理 (hreflang, og:locale)。
- Lazy Loading による言語パックのサポート（Bundle Size の最適化）。

### 2.2 インストールと設定

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
    lazy: true, // Lazy Loading を有効化
    langDir: 'locales', // 言語ファイルのディレクトリ
    strategy: 'prefix_and_default', // 重要なルーティング戦略
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // ルートパスでのみ検出してリダイレクト
    },
  },
});
```

### 2.3 ルーティング戦略 (Routing Strategy)

これが SEO の鍵です。`@nuxtjs/i18n` はいくつかの戦略を提供します：

1.  **prefix_except_default** (推奨)：

    - デフォルト言語 (tw) はプレフィックスなし：`example.com/about`
    - その他の言語 (en) はプレフィックス付き：`example.com/en/about`
    - メリット：URL がクリーン、SEO 重みが集中。

2.  **prefix_and_default**：

    - すべての言語にプレフィックス：`example.com/tw/about`, `example.com/en/about`
    - メリット：構造が統一、リダイレクトの処理が容易。

3.  **no_prefix** (SEO には非推奨)：
    - すべての言語で同じ URL、Cookie で切り替え。
    - デメリット：検索エンジンが異なる言語バージョンをインデックスできない。

---

## 3. SEO の重要な実装

### 3.1 hreflang タグ

検索エンジンは「このページにどの言語バージョンがあるか」を知る必要があります。`@nuxtjs/i18n` は `<head>` 内に自動生成します：

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**注意：** `nuxt.config.ts` で `baseUrl` を設定しないと、hreflang が相対パス（無効）を生成します。

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // 必ず設定すること！
  },
});
```

### 3.2 Canonical URL

各言語バージョンのページが自身を指す Canonical URL を持つことを確認し、重複コンテンツと見なされることを回避。

### 3.3 動的コンテンツの翻訳 (API)

バックエンド API も多言語をサポートする必要があります。通常、リクエスト時に `Accept-Language` header を付加します。

```typescript
// composables/useApi.ts
export const useApi = (url: string) => {
  const { locale } = useI18n();
  return useFetch(url, {
    headers: {
      'Accept-Language': locale.value, // 現在の言語をバックエンドに送信
    },
  });
};
```

---

## 4. よくある課題と解決法

### 4.1 Hydration Mismatch

**問題：** Server 側が英語を検出して英語の HTML をレンダリング。Client 側のブラウザのデフォルトは中国語で、Vue i18n が中国語で初期化され、画面のちらつきや Hydration Error が発生。

**解決法：**

- `detectBrowserLanguage` を設定し、Client 側の初期化時にブラウザの設定ではなく URL や Cookie の設定を尊重するようにする。
- Server と Client の `defaultLocale` の設定が一致することを確認。

### 4.2 言語切り替え

手動で文字列を組み立てるのではなく、`switchLocalePath` を使用してリンクを生成。

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

## 5. 面接のポイント整理

### 5.1 i18n と SEO

**Q: 多言語（i18n）を SSR 環境で実装する際に注意すべき点は？SEO はどう処理しますか？**

> **回答例：**
> SSR 環境で i18n を行う場合、最も重要なのは **SEO** と **Hydration の一貫性**です。
>
> **SEO** について：
>
> 1.  **URL 構造**：「サブパス」戦略（例：`/en/`、`/tw/`）を使用して、異なる言語に独立した URL を持たせます。これにより検索エンジンがインデックスできます。
> 2.  **hreflang**：`<link rel="alternate" hreflang="..." />` を正しく設定し、Google にこれらのページが同じコンテンツの異なる言語バージョンであることを伝え、重複コンテンツのペナルティを回避します。通常、`@nuxtjs/i18n` モジュールを使用してこれらのタグを自動生成します。
>
> **Hydration** について：
> Server 側でレンダリングされる言語と Client 側で初期化される言語が一致することを確認します。URL プレフィックスまたは Cookie から言語を決定し、API リクエストの header に対応する locale を付加します。

### 5.2 ルーティングと状態

**Q: 言語切り替え機能をどのように実装しますか？**

> **回答例：**
> `@nuxtjs/i18n` が提供する `useSwitchLocalePath` composable を使用します。
> 現在のルートに基づいて対応する言語の URL を自動生成し（query parameters を保持）、ルートプレフィックスの変換を処理します。これにより、手動での文字列結合のエラーを回避でき、言語切り替え時にユーザーが元のページコンテンツに留まることも保証されます。

---

## 6. Reference

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
