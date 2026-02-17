---
title: '[Lv2] Nuxt 3 Server 機能実装：Server Routes と動的 Sitemap'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Nuxt 3 の Nitro Server Engine の機能を習得し、Server Routes (API Routes)、動的 Sitemap、Robots.txt を実装して、ウェブサイトの SEO とアーキテクチャの柔軟性を向上させる。

---

## 1. 面接回答の要点

1.  **Server Routes (API Routes)**：`server/api` または `server/routes` を使用してバックエンドロジックを構築。API Key の隠蔽、CORS の処理、BFF (Backend for Frontend) アーキテクチャに頻繁に使用。
2.  **動的 Sitemap**：Server Routes (`server/routes/sitemap.xml.ts`) を通じて XML を動的に生成し、検索エンジンが最新のコンテンツをインデックスできるようにする。
3.  **Robots.txt**：同様に Server Routes で動的に生成するか、Nuxt Config で設定し、クローラーのアクセス権限を制御。

---

## 2. Nuxt 3 Server Engine: Nitro

### 2.1 Nitro とは？

Nitro は Nuxt 3 の新しいサーバーエンジンで、Nuxt アプリケーションをどこにでもデプロイ可能にします（Universal Deployment）。単なるサーバーではなく、強力なビルドおよびランタイムツールです。

### 2.2 Nitro のコア機能

1.  **クロスプラットフォームデプロイ (Universal Deployment)**：
    Node.js server、Serverless Functions (Vercel, AWS Lambda, Netlify)、Service Workers など、複数のフォーマットにコンパイル可能。Zero-config で主要プラットフォームにデプロイ可能。

2.  **軽量かつ高速 (Lightweight & Fast)**：
    Cold start 時間が非常に短く、生成される bundle size も非常に小さい（最小 < 1MB）。

3.  **自動コード分割 (Auto Code Splitting)**：
    Server Routes の依存関係を自動分析し、code splitting を実行して起動速度を確保。

4.  **HMR (Hot Module Replacement)**：
    フロントエンドだけでなく、Nitro によりバックエンド API 開発でも HMR が利用可能。`server/` ファイルの変更時にサーバーの再起動が不要。

5.  **Storage Layer (Unstorage)**：
    統一された Storage API を内蔵し、Redis、GitHub、FS、Memory など、さまざまなストレージインターフェースに簡単に接続可能。

6.  **Server Assets**：
    Server 側で静的リソースファイルに便利にアクセス可能。

---

## 3. Nuxt 3 Server Routes (API Routes)

### 3.1 Server Routes とは？

Nuxt 3 は **Nitro** サーバーエンジンを内蔵しており、開発者がプロジェクト内でバックエンド API を直接記述できます。これらのファイルは `server/api` または `server/routes` ディレクトリに配置され、自動的に API endpoint にマッピングされます。

- `server/api/hello.ts` -> `/api/hello`
- `server/routes/hello.ts` -> `/hello`

### 2.2 どのような場合に使用するか？（よくある面接問題）

**1. 機密情報の隠蔽 (Secret Management)**
フロントエンドでは Private API Key を安全に保存できません。Server Routes を仲介として使用し、Server 側で環境変数を使って Key にアクセスし、結果のみをフロントエンドに返します。

```typescript
// server/api/weather.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // API Key は Server 側でのみ使用され、Client には公開されない
  const data = await $fetch(
    `https://api.weather.com/v1?key=${config.weatherApiKey}`
  );
  return data;
});
```

**2. CORS 問題の処理 (Proxy)**
外部 API が CORS をサポートしていない場合、Server Routes を Proxy として使用できます。ブラウザは Nuxt Server（同一オリジン）にリクエストし、Nuxt Server が外部 API にリクエスト（CORS 制限なし）します。

**3. Backend for Frontend (BFF)**
複数のバックエンド API のデータを Nuxt Server 側で集約、フィルタリング、フォーマット変換した後、フロントエンドに一括で返します。フロントエンドのリクエスト回数と Payload サイズを削減。

**4. Webhook の処理**
サードパーティサービス（決済、CMS など）からの Webhook 通知を受信。

---

## 4. 動的 Sitemap の実装

### 3.1 なぜ動的 Sitemap が必要なのか？

コンテンツが頻繁に変更されるウェブサイト（EC サイト、ニュースサイトなど）では、静的に生成された `sitemap.xml` はすぐに期限切れになります。Server Routes を使用すると、リクエストごとに最新の Sitemap を動的に生成できます。

### 3.2 実装方法：手動生成

`server/routes/sitemap.xml.ts` を作成：

```typescript
// server/routes/sitemap.xml.ts
import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // 1. データベースまたは API からすべての動的ルートデータを取得
  const posts = await $fetch('https://api.example.com/posts');

  const sitemap = new SitemapStream({
    hostname: 'https://example.com',
  });

  // 2. 静的ページを追加
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

  // 3. 動的ページを追加
  posts.forEach((post) => {
    sitemap.write({
      url: `/posts/${post.id}`,
      changefreq: 'weekly',
      lastmod: post.updatedAt,
    });
  });

  sitemap.end();

  // 4. Header を設定して XML を返す
  setHeader(event, 'content-type', 'application/xml');
  return streamToPromise(sitemap);
});
```

### 3.3 実装方法：モジュールの使用 (`@nuxtjs/sitemap`)

標準的な要件には、公式モジュールの使用を推奨：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    siteUrl: 'https://example.com',
    sources: [
      '/api/sitemap-urls', // 動的 URL リストを提供する API を指定
    ],
  },
});
```

---

## 5. 動的 Robots.txt の実装

### 4.1 実装方法

`server/routes/robots.txt.ts` を作成：

```typescript
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProduction = config.public.siteEnv === 'production';

  // 環境に応じてルールを動的に決定
  const robots = isProduction
    ? `User-agent: *
Disallow: /admin
Disallow: /private
Sitemap: https://example.com/sitemap.xml`
    : `User-agent: *
Disallow: /`; // 非本番環境ではインデックスを禁止

  setHeader(event, 'content-type', 'text/plain');
  return robots;
});
```

---

## 6. 面接のポイント整理

### 5.1 Nitro Engine & Server Routes

**Q: Nuxt 3 の server engine とは？Nitro の特徴は？**

> **回答例：**
> Nuxt 3 の server engine は **Nitro** と呼ばれています。
> 最大の特徴は **Universal Deployment** で、任意の環境（Node.js, Vercel, AWS Lambda, Edge Workers など）にゼロコンフィグでデプロイ可能です。
> その他の特徴として、バックエンド API の **HMR**（変更時に再起動不要）、**Auto Code Splitting**（起動速度の向上）、内蔵の **Storage Layer**（Redis や KV Storage への接続が容易）があります。

**Q: Nuxt 3 の Server Routes とは？実装したことはありますか？**

> **回答例：**
> はい、実装したことがあります。Server Routes は Nuxt 3 が Nitro エンジンを通じて提供するバックエンド機能で、`server/api` ディレクトリに配置します。
> 私は主に以下のシーンで使用しました：
>
> 1.  **API Key の隠蔽**：サードパーティサービスとの連携時に、Secret Key をフロントエンドのコードに公開しないようにする。
> 2.  **CORS Proxy**：クロスオリジンリクエストの問題を解決。
> 3.  **BFF (Backend for Frontend)**：複数の API リクエストを 1 つに統合し、フロントエンドのリクエスト回数を減らしデータ構造を最適化。

### 5.2 Sitemap と Robots.txt

**Q: Nuxt 3 で動的 sitemap と robots.txt をどのように実装しますか？**

> **回答例：**
> Nuxt の Server Routes を使用して実装します。
> **Sitemap** については、`server/routes/sitemap.xml.ts` を作成し、バックエンド API を呼び出して最新の記事や商品リストを取得し、`sitemap` パッケージを使用して XML 文字列を生成して返します。これにより、検索エンジンがクロールするたびに最新のリンクを取得できます。
> **Robots.txt** については、`server/routes/robots.txt.ts` を作成し、環境変数（Production または Staging）に応じて異なるルールを動的に返します。例えば、Staging 環境では `Disallow: /` を設定してインデックスを防止します。

### 5.3 SEO Meta Tags (補足)

**Q: Nuxt 3 の SEO meta tags をどのように処理しますか？useHead や useSeoMeta を使用したことはありますか？**

> **回答例：**
> 主に Nuxt 3 内蔵の `useHead` と `useSeoMeta` Composables を使用しています。
> `useHead` では `title`、`meta`、`link` などのタグを定義できます。純粋な SEO 設定の場合は `useSeoMeta` を優先的に使用します。構文がより簡潔で型ヒント（Type-safe）があり、`ogTitle`、`description` などのプロパティを直接設定できるからです。
> 動的ページ（商品ページなど）では、Getter Function（例：`title: () => product.value.name`）を渡し、データが更新されると Meta Tags も自動的にリアクティブに更新されるようにしています。

---

## 7. 関連 Reference

- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt SEO Module](https://nuxtseo.com/)
