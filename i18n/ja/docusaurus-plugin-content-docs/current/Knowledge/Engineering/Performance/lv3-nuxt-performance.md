---
title: '[Lv3] Nuxt 3 パフォーマンス最適化：Bundle Size、SSR 速度と画像最適化'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Nuxt 3 パフォーマンス最適化の完全ガイド：Bundle Size の削減、SSR 速度の最適化から画像読み込み戦略まで、究極のパフォーマンス体験を実現。

---

## 1. 面接回答の主軸

1.  **Bundle Size の最適化**：分析 (`nuxi analyze`)、分割 (`SplitChunks`)、Tree Shaking、遅延読み込み (Lazy Loading)。
2.  **SSR 速度の最適化 (TTFB)**：Redis キャッシュ、Nitro Cache、ブロッキング API 呼び出しの削減、Streaming SSR。
3.  **画像の最適化**：`@nuxt/image`、WebP フォーマット、CDN、Lazy Loading。
4.  **大量データの最適化**：仮想スクロール (Virtual Scrolling)、無限スクロール (Infinite Scroll)、ページネーション (Pagination)。

---

## 2. Nuxt 3 の Bundle Size を減らすには？

### 2.1 診断ツール

まず、ボトルネックがどこにあるかを知る必要があります。`nuxi analyze` で Bundle 構造を可視化します。

```bash
npx nuxi analyze
```

これにより、どのパッケージが最も容量を占めているかを示すレポートが生成されます。

### 2.2 最適化戦略

#### 1. Code Splitting（コード分割）
Nuxt 3 はデフォルトでルートベースの Code Splitting を行います。ただし、大規模パッケージ（ECharts、Lodash など）は手動での最適化が必要です。

**Nuxt Config 設定 (Vite/Webpack)：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // node_modules 内の大規模パッケージを分離
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

#### 2. Tree Shaking & オンデマンドインポート
パッケージ全体ではなく、必要なモジュールのみをインポートすること。

```typescript
// ❌ 間違い：lodash 全体をインポート
import _ from 'lodash';
_.debounce(() => {}, 100);

// ✅ 正しい：debounce のみをインポート
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// ✅ 推奨：vueuse を使用（Vue 専用かつ Tree-shakable）
import { useDebounceFn } from '@vueuse/core';
```

#### 3. コンポーネントの Lazy Loading
ファーストビューに不要なコンポーネントには `Lazy` プレフィックスを使用して動的インポート。

```vue
<template>
  <div>
    <!-- show が true の場合のみコンポーネントコードが読み込まれる -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. 不要な Server-side パッケージの除去
Server 端でのみ使用するパッケージ（データベースドライバ、fs 操作など）が Client 端にバンドルされないようにします。Nuxt 3 は `.server.ts` で終わるファイルや `server/` ディレクトリを自動的に処理します。

---

## 3. SSR 速度 (TTFB) を最適化するには？

### 3.1 なぜ TTFB が長くなるのか？
TTFB (Time To First Byte) は SSR パフォーマンスの重要指標です。長くなる原因は通常：
1.  **API レスポンスが遅い**：Server がバックエンド API のデータ返却を待ってから HTML をレンダリングする必要がある。
2.  **直列リクエスト**：複数の API リクエストが順番に実行され、並列でない。
3.  **重い計算**：Server 端で CPU 集約型タスクが多すぎる。

### 3.2 最適化方法

#### 1. Server-Side Caching (Nitro Cache)
Nitro のキャッシュ機能で API レスポンスやレンダリング結果をキャッシュ。

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // トップページを 1 時間キャッシュ (SWR: Stale-While-Revalidate)
    '/': { swr: 3600 },
    // 商品ページを 10 分キャッシュ
    '/products/**': { swr: 600 },
    // API キャッシュ
    '/api/**': { cache: { maxAge: 60 } },
  },
});
```

#### 2. 並列リクエスト (Parallel Fetching)
`Promise.all` で複数リクエストを並列送信。`await` で1つずつではなく。

```typescript
// ❌ 遅い：直列実行（合計時間 = A + B）
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// ✅ 速い：並列実行（合計時間 = Max(A, B)）
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. 非重要データの遅延取得 (Lazy Fetching)
ファーストビューに不要なデータは Client 端で読み込み (`lazy: true`)、SSR のブロックを回避。

```typescript
// コメントデータは SEO 不要、Client 端で読み込み可能
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false, // Server 端では全く実行しない
});
```

#### 4. Streaming SSR（実験的）
Nuxt 3 は HTML Streaming をサポートしており、レンダリングしながら返却することで、ユーザーがより早くコンテンツを見られるようになります。

---

## 4. Nuxt 3 画像最適化

### 4.1 @nuxt/image の使用
公式モジュール `@nuxt/image` が最適解です：
-   **自動フォーマット変換**：WebP/AVIF に自動変換。
-   **自動リサイズ**：画面サイズに応じた画像サイズを生成。
-   **Lazy Loading**：遅延読み込み内蔵。
-   **CDN 統合**：Cloudinary、Imgix など多くの Provider に対応。

### 4.2 実装例

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    // デフォルトオプション
    format: ['webp'],
  },
});
```

```vue
<template>
  <!-- webp に自動変換、幅 300px、lazy load を有効化 -->
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

## 5. 大量データのページネーションとスクロール

### 5.1 方式の選択
大量データ（例：10,000 件の商品）には主に3つの戦略があり、**SEO** を考慮する必要があります：

| 戦略 | 適合シーン | SEO 対応度 |
| :--- | :--- | :--- |
| **従来のページネーション (Pagination)** | EC リスト、記事リスト | 最高 |
| **無限スクロール (Infinite Scroll)** | SNS フィード、画像ギャラリー | 特別な対応が必要 |
| **仮想スクロール (Virtual Scroll)** | 複雑なレポート、超長リスト | コンテンツが DOM にない |

### 5.2 無限スクロールで SEO を維持するには？
無限スクロールでは、検索エンジンは通常最初のページしかクロールできません。解決策：
1.  **ページネーションモードとの併用**：`<link rel="next" href="...">` タグでクローラーに次のページを通知。
2.  **Noscript Fallback**：クローラー向けに従来のページネーションの `<noscript>` バージョンを提供。
3.  **Load More ボタン**：ファーストビューは SSR で最初の 20 件をレンダリングし、後続は「もっと見る」クリックやスクロールで Client-side fetch をトリガー。

### 5.3 実装例 (Load More + SEO)

```vue
<script setup>
// ファーストビューデータ (SSR)
const page = ref(1);
const { data: posts } = await useFetch('/api/posts', {
  query: { page: page.value }
});

// Client 端で追加読み込み
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
    <button @click="loadMore">もっと見る</button>

    <!-- SEO 最適化：クローラーに次のページを通知 -->
    <Head>
      <Link rel="next" :href="`/posts?page=${page + 1}`" />
    </Head>
  </div>
</template>
```

---

## 6. SSR 環境での Lazy Loading

### 6.1 問題の説明
SSR 環境で `IntersectionObserver` を使って Lazy Loading を実装すると、Server 端には `window` や `document` がないため、エラーや Hydration Mismatch が発生します。

### 6.2 解決策

#### 1. Nuxt 内蔵コンポーネントの使用
-   `<LazyComponent>`
-   `<NuxtImg loading="lazy">`

#### 2. カスタム Directive（SSR 対応が必要）

```typescript
// plugins/lazy-load.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      // Client 端でのみ実行
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value;
          observer.disconnect();
        }
      });
      observer.observe(el);
    },
    getSSRProps(binding) {
      // Server 端ではプレースホルダーまたは元画像をレンダリング（SEO 要件に応じて）
      return {
        src: 'placeholder.png'
      };
    }
  });
});
```

---

## 7. SSR パフォーマンスの監視と追跡

### 7.1 なぜ監視が必要か？
SSR アプリケーションのパフォーマンスボトルネックは Server 端で発生することが多く、ブラウザの DevTools では見えません。監視しないと、API レスポンスの遅延、Memory Leak、CPU の急上昇が TTFB 悪化の原因であることを発見するのが困難です。

### 7.2 よく使われるツール

1.  **Nuxt DevTools（開発段階）**：
    -   Nuxt 3 に内蔵。
    -   Server Routes のレスポンス時間を確認可能。
    -   **Open Graph** で SEO プレビュー。
    -   **Server Routes** パネルで API 呼び出しの所要時間を監視。

2.  **Lighthouse / PageSpeed Insights（デプロイ後）**：
    -   Core Web Vitals (LCP, CLS, FID/INP) を監視。
    -   LCP (Largest Contentful Paint) は SSR の TTFB に大きく依存。

3.  **Server-Side Monitoring (APM)**：
    -   **Sentry / Datadog**：Server 端のエラーとパフォーマンスを追跡。
    -   **OpenTelemetry**：完全な Request Trace を追跡（Nuxt Server -> API Server -> DB）。

### 7.3 シンプルなタイム追跡の実装

`server/middleware` でシンプルなタイマーを実装できます：

```typescript
// server/middleware/timing.ts
export default defineEventHandler((event) => {
  const start = performance.now();

  event.node.res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[${event.method}] ${event.path} - ${duration.toFixed(2)}ms`);

    // Server-Timing header を追加してブラウザの DevTools でも確認可能に
    // event.node.res.setHeader('Server-Timing', `total;dur=${duration}`);
  });
});
```

---

## 8. 面接まとめ

**Q: SSR のパフォーマンス問題をどう追跡・監視しますか？**
> 開発段階では主に **Nuxt DevTools** を使用して Server Routes のレスポンス時間と Payload サイズを確認します。
> Production 環境では **Core Web Vitals**（特に LCP）と **TTFB** に注目します。
> Server 端のボトルネックを深く追跡する必要がある場合は、カスタムの Server Middleware でリクエスト時間を記録し、`Server-Timing` header でブラウザにデータを返すか、**Sentry** / **OpenTelemetry** を統合してフルチェーントレーシングを行います。

**Q: Nuxt 3 の bundle size を減らすには？**
> まず `nuxi analyze` で分析します。大規模パッケージ（lodash など）に対して Tree Shaking や手動分割 (`manualChunks`) を行います。ファーストビューに不要なコンポーネントには `<LazyComponent>` で動的インポートを使用します。

**Q: SSR 速度を最適化するには？**
> ポイントは TTFB の削減です。Nitro の `routeRules` で Server-side caching (SWR) を設定します。API リクエストはできる限り `Promise.all` で並列処理します。非重要データは `lazy: true` を設定して Client 端で読み込みます。

**Q: Image optimization はどうしますか？**
> `@nuxt/image` モジュールを使用します。WebP への自動変換、自動リサイズ、Lazy Loading をサポートし、転送量を大幅に削減します。

**Q: 無限スクロールで SEO を両立するには？**
> 無限スクロールは SEO に不向きです。コンテンツ型サイトでは従来のページネーションを優先します。無限スクロールが必須の場合は、SSR で最初のページをレンダリングし、Meta Tags (`rel="next"`) でクローラーにページネーション構造を通知するか、Noscript のページネーションリンクを提供します。
