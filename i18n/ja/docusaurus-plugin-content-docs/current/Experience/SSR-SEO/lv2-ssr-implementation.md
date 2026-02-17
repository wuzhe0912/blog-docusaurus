---
title: '[Lv2] SSR 実装：Data Fetching と SEO Meta 管理'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Nuxt 3 プロジェクトにおいて、SSR データ読み込みと SEO Meta Tags の動的管理を実装し、検索エンジンが動的ルートページを正しくインデックスできるようにする。

---

## 1. 面接回答の主軸

1. **Data Fetching 戦略**：`useFetch`/`useAsyncData` を使用して Server Side でデータを事前読み込みし、SEO コンテンツの完全性を確保。
2. **動的 Meta Tags**：`useHead` を使用してデータに基づいた SEO meta tags を動的に生成し、動的ルートページをサポート。
3. **パフォーマンス最適化**：request deduplication、server-side caching を実装し、SSR/CSR ページを区別。

---

## 2. useFetch / useAsyncData の正しい使用方法

### 2.1 なぜ SSR Data Fetching が必要か？

**問題シーン：**

- 動的ルートページ（例：`/products/[id]`）で API からデータを読み込む必要がある
- クライアント側のみで読み込むと、検索エンジンが完全なコンテンツを認識できない
- Server Side でデータを事前読み込みし、完全な HTML を生成する必要がある

**ソリューション：** Nuxt 3 の `useFetch` または `useAsyncData` を使用

### 2.2 useFetch の基本使用法

**ファイル場所：** `pages/products/[id].vue`

```typescript
// 基本的な使い方
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**主要パラメータの説明：**

| パラメータ        | 説明                                   | デフォルト値   |
| ----------- | -------------------------------------- | -------- |
| `key`       | 一意の識別子、request deduplication に使用 | 自動生成 |
| `lazy`      | 遅延読み込みするか（SSR をブロックしない）             | `false`  |
| `server`    | Server Side で実行するか                | `true`   |
| `default`   | デフォルト値                                 | `null`   |
| `transform` | データ変換関数                           | -        |

### 2.3 完全な実装例

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // 重複リクエストを回避
  lazy: false, // SSR 時に完了を待つ
  server: true, // server side で実行を確保
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // データ変換ロジック
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**キーポイントの説明：**

1. **`key` パラメータ**

   - request deduplication（重複リクエストの回避）に使用
   - 同じ key のリクエストは統合される
   - ユニークな識別子の使用を推奨（例：`product-${id}`）

2. **`lazy: false`**

   - SSR 時にデータ読み込み完了まで待ってからレンダリング
   - 検索エンジンが完全なコンテンツを認識できることを確保
   - `true` に設定すると、SSR 時に待たず、コンテンツが不完全になる可能性

3. **`server: true`**
   - Server Side での実行を確保
   - SSR の重要な設定
   - `false` に設定すると、クライアント側でのみ実行

### 2.4 useAsyncData vs useFetch

**違いの比較：**

| 機能         | useFetch                 | useAsyncData           |
| ------------ | ------------------------ | ---------------------- |
| **用途**     | API を直接呼び出す             | 任意の非同期操作を実行     |
| **自動処理** | ✅ URL、headers を自動処理 | ❌ 手動処理が必要        |
| **適用シーン** | API リクエスト                 | データベースクエリ、ファイル読み取りなど |

**使用例：**

```typescript
// useFetch：API リクエストに適合
const { data } = await useFetch('/api/products/123');

// useAsyncData：その他の非同期操作に適合
const { data } = await useAsyncData('products', async () => {
  // 任意の非同期操作を実行可能
  const result = await someAsyncOperation();
  return result;
});
```

### 2.5 $fetch vs useFetch

**面接頻出：いつ `$fetch` を使い、いつ `useFetch` を使うべきか？**

**1. $fetch**

- **定義**：Nuxt 3 が内部で使用する HTTP クライアント（`ofetch` ベース）。
- **挙動**：純粋に HTTP リクエストを送信し、SSR 状態同期（Hydration）を**処理しない**。
- **リスク**：`setup()` で直接 `$fetch` を使用すると、Server 側で1回リクエストし、Client 側の Hydration 時に**再度リクエスト**（Double Fetch）し、Hydration Mismatch を引き起こす可能性がある。
- **適用シーン**：
  - ユーザーインタラクションで発生するリクエスト（例：ボタンクリックでフォーム送信、もっと読み込む）。
  - Client-side only のロジック。
  - Middleware または Server API route 内部。

**2. useFetch**

- **定義**：`useAsyncData` + `$fetch` をラップした Composable。
- **挙動**：
  - 自動的に key を生成し Request Deduplication を実行。
  - SSR 状態転送を処理（Server で取得したデータを Client に渡し、Client の再リクエストを回避）。
  - リアクティブな戻り値を提供（`data`, `pending`, `error`, `refresh`）。
- **適用シーン**：
  - ページ初期化に必要なデータ（Page Load）。
  - URL パラメータの変動に依存するデータ取得。

**まとめ比較：**

| 特性             | useFetch                     | $fetch                         |
| ---------------- | ---------------------------- | ------------------------------ |
| **SSR 状態同期** | ✅ あり (Hydration Friendly)   | ❌ なし (Double Fetch の可能性)      |
| **リアクティブ (Ref)** | ✅ Ref オブジェクトを返す             | ❌ Promise を返す (Raw Data)     |
| **主な用途**     | ページデータ読み込み (Data Fetching) | イベント処理、操作型リクエスト (Actions) |

```typescript
// ⭕️ 正しい：ページ読み込みには useFetch を使用
const { data } = await useFetch('/api/user');

// ⭕️ 正しい：クリックイベントには $fetch を使用
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// ❌ 誤り：setup 内で直接 $fetch を使用 (Double Fetch を引き起こす)
const data = await $fetch('/api/user');
```

---

## 3. SEO Meta 管理（useHead）

### 3.1 なぜ動的 Meta Tags が必要か？

**問題シーン：**

- 動的ルートページ（例：商品ページ、記事ページ）でデータに基づいて Meta Tags を動的に生成する必要がある
- 各ページに固有の title、description、og:image が必要
- Open Graph、Twitter Card などのソーシャルメディアタグのサポートが必要

**ソリューション：** Nuxt 3 の `useHead` または `useSeoMeta` を使用

### 3.2 useHead の基本使用法

**ファイル場所：** `pages/products/[id].vue`

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

**キーポイントの説明：**

1. **関数の戻り値を使用**

   - `product.value?.name` を直接使うのではなく、`() => product.value?.name` を使用
   - データ更新時に Meta Tags も更新されることを確保
   - リアクティブな更新をサポート

2. **完全な SEO Meta Tags**
   - `title`：ページタイトル
   - `meta`：description、keywords、og tags など
   - `link`：canonical URL、alternate など

### 3.3 useSeoMeta の簡略記法

Nuxt 3 は SEO meta tags 専用の `useSeoMeta` も提供しています：

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

**メリット：**

- ✅ よりシンプルな構文
- ✅ Open Graph と Twitter Card を自動処理
- ✅ リアクティブな更新をサポート

### 3.4 完全な実装例

```typescript
// pages/products/[id].vue
<script setup lang="ts">
const route = useRoute();

// 1. 商品データの読み込み（SSR）
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`,
  lazy: false,
  server: true,
});

// 2. SEO Meta Tags の動的生成
useHead({
  title: () => product.value?.name || '商品ページ',
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

## 4. 実践 Case 1：動的ルート SEO 最適化

### 4.1 問題の背景

**状況：** EC プラットフォームに 10 万以上の SKU があり、各商品ページが Google に正しくインデックスされる必要がある。

**課題：**

- 大量の動的ルートページ（`/products/[id]`）
- 各ページに固有の SEO コンテンツが必要
- 404 のシナリオ処理が必要
- 重複コンテンツ問題の回避

### 4.2 ソリューション

#### Step 1: useFetch でデータを事前読み込み

```typescript
// pages/products/[id].vue
const { data: product, error } = await useFetch(
  `/api/products/${route.params.id}`,
  {
    key: `product-${route.params.id}`,
    lazy: false, // SSR 時に完了を待つ
    server: true, // server side で実行を確保
  }
);

// 404 シナリオの処理
if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}
```

#### Step 2: Meta Tags の動的生成

```typescript
useHead({
  title: () => `${product.value?.name} - 商品ページ`,
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

#### Step 3: 404 シナリオの処理

```typescript
// useFetch 後にチェック
if (error.value || !product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Product not found',
  });
}

// または error.vue で処理
// error.vue
<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number;
    statusMessage: string;
  };
}>();

// 404 ページの SEO を設定
useHead({
  title: '404 - ページが見つかりません',
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow', // 検索エンジンに 404 ページをインデックスしないよう指示
    },
  ],
});
</script>
```

### 4.3 実装結果

**最適化前：**

- ❌ 検索エンジンが商品コンテンツを認識できない（クライアント側のみで読み込み）
- ❌ すべての商品ページが同じ Meta Tags を共有
- ❌ 404 ページが正しく処理されていない

**最適化後：**

- ✅ 検索エンジンが完全な商品コンテンツを認識可能
- ✅ 各商品ページに固有の SEO Meta Tags
- ✅ 404 を正しく処理し、エラーページのインデックスを回避
- ✅ canonical URL を設定し、重複コンテンツ問題を回避

---

## 5. 実践 Case 2：パフォーマンス最適化

### 5.1 問題の背景

**状況：** SSR は server loading を増加させるため、パフォーマンスの最適化が必要。

**課題：**

- Server Side で大量のリクエストを処理する必要がある
- 同じデータの重複リクエストを回避
- キャッシュメカニズムが必要
- SSR が必要なページと CSR で対応できるページの区別

### 5.2 ソリューション

#### 戦略 1: Request Deduplication

```typescript
// 複数のコンポーネントが同時に同じデータをリクエストしても、1回のリクエストのみ送信
const { data: product } = await useFetch(`/api/products/${id}`, {
  key: `product-${id}`, // 同じ key のリクエストは統合される
});
```

#### 戦略 2: Server-Side Caching

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      '/api/products/**': {
        cache: {
          maxAge: 60 * 60, // 1時間キャッシュ
        },
      },
    },
  },
});
```

#### 戦略 3: SSR / CSR ページの区別

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // デフォルト SSR
  routeRules: {
    // SEO が必要なページ：SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // SEO 不要のページ：CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

#### 戦略 4: Critical CSS Inline

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

---

## 6. 面接の重要ポイント

### 6.1 useFetch / useAsyncData

**このように回答できます：**

> Nuxt 3 プロジェクトで、`useFetch` を使用して Server Side でデータを事前読み込みしています。重要な設定として、`key` は request deduplication（重複リクエストの回避）に使用し、`lazy: false` は SSR 時にデータ読み込み完了を待つことを確保し、`server: true` は Server Side での実行を確保します。これにより、検索エンジンが完全なページコンテンツを認識できます。

### 6.2 動的 Meta Tags

**このように回答できます：**

> `useHead` または `useSeoMeta` を使用してデータに基づいた SEO Meta Tags を動的に生成しています。重要なのは関数の戻り値（例：`() => product.value?.name`）を使用し、データ更新時に Meta Tags も更新されることを確保することです。同時に、title、description、Open Graph、canonical URL などの完全な SEO 要素を設定しています。

### 6.3 パフォーマンス最適化

**このように回答できます：**

> SSR パフォーマンスを最適化するために、いくつかの戦略を実装しました：まず、`key` パラメータで request deduplication を行い重複リクエストを回避；次に、Nitro Cache で server-side caching を行いデータベースクエリを削減；最後に、SEO が必要なページと不要なページを区別し、SEO 不要のページは CSR を使用して不必要な SSR 処理を削減しています。

---

## 7. ベストプラクティス

### 7.1 Data Fetching

1. **常に `key` を設定** - 重複リクエストの回避、パフォーマンス向上
2. **要件に応じて `lazy` を選択** - SEO が必要：`lazy: false`、不要：`lazy: true`
3. **エラーシナリオの処理** - 404 の正しい処理、フレンドリーなエラーメッセージ

### 7.2 SEO Meta Tags

1. **関数の戻り値を使用** - リアクティブな更新をサポート
2. **完全な SEO 要素の設定** - title、description、Open Graph、canonical URL
3. **404 ページの処理** - `noindex, nofollow` を設定

### 7.3 パフォーマンス最適化

1. **キャッシュメカニズムの使用** - Server-side caching
2. **SSR/CSR の区別** - SEO が必要：SSR、不要：CSR
3. **Critical CSS** - Inline critical CSS、FCP 時間の短縮

---

## 8. 面接の総括

**このように回答できます：**

> Nuxt 3 プロジェクトで、完全な SSR データ読み込みと SEO Meta Tags 管理を実装しました。まず、`useFetch` を使用して Server Side でデータを事前読み込みし、検索エンジンが完全なコンテンツを認識できるようにしました。次に、`useHead` を使用してデータに基づいた SEO Meta Tags を動的に生成し、動的ルートページをサポートしました。最後に、パフォーマンス最適化のために request deduplication、server-side caching、SSR/CSR ページの区別を実装しました。

**キーポイント：**

- ✅ useFetch/useAsyncData の正しい使用
- ✅ 動的 Meta Tags 管理（useHead）
- ✅ 動的ルート SEO 最適化
- ✅ パフォーマンス最適化戦略
- ✅ 実際のプロジェクト経験
