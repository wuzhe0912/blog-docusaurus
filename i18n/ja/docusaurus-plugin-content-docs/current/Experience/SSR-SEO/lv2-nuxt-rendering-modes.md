---
title: '[Lv2] Nuxt 3 Rendering Modes：SSR、SSG、CSR 選択戦略'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Nuxt 3 の Rendering Modes を理解し、プロジェクトの要件に応じて適切なレンダリング戦略（SSR、SSG、CSR）を選択できるようにする。

---

## 1. 面接回答の主軸

1. **Rendering Modes の分類**：Nuxt 3 は SSR、SSG、CSR、Hybrid Rendering の4つのモードをサポート
2. **選択戦略**：SEO 要件、コンテンツの動的性、パフォーマンス要件に基づいて適切なモードを選択
3. **実装経験**：プロジェクトでの Rendering Modes の設定と選択方法

---

## 2. Nuxt 3 Rendering Modes の紹介

### 2.1 4つの Rendering Modes

Nuxt 3 は4つの主要な Rendering Modes をサポートしています：

| モード | 正式名称 | レンダリングタイミング | 適用シーン |
|------|------|---------|---------|
| **SSR** | Server-Side Rendering | リクエストごとに Server 側でレンダリング | SEO + 動的コンテンツが必要 |
| **SSG** | Static Site Generation | ビルド時に HTML を事前生成 | SEO + 固定コンテンツが必要 |
| **CSR** | Client-Side Rendering | ブラウザ側でレンダリング | SEO 不要 + 高いインタラクティブ性 |
| **Hybrid** | Hybrid Rendering | 複数のモードを混合使用 | ページごとに異なる要件 |

### 2.2 SSR (Server-Side Rendering)

**定義：** リクエストごとに Server 側で JavaScript を実行し、完全な HTML を生成してブラウザに送信する。

**設定方法：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // デフォルトは true
});
```

**フロー：**
1. ブラウザがページをリクエスト
2. Server が JavaScript を実行し、完全な HTML を生成
3. HTML をブラウザに送信
4. ブラウザが Hydration（インタラクティブ機能の有効化）

**メリット：**
- ✅ SEO フレンドリー（検索エンジンが完全なコンテンツを認識可能）
- ✅ 初回読み込みが高速（JavaScript の実行を待つ必要なし）
- ✅ 動的コンテンツをサポート（リクエストごとに最新データを取得可能）

**デメリット：**
- ❌ Server の負荷が高い（各リクエストでレンダリングが必要）
- ❌ TTFB（Time To First Byte）が長くなる可能性
- ❌ Server 環境が必要

**適用シーン：**
- EC 商品ページ（SEO + 動的な価格/在庫が必要）
- ニュース記事ページ（SEO + 動的コンテンツが必要）
- ユーザープロフィールページ（SEO + パーソナライズされたコンテンツが必要）

### 2.3 SSG (Static Site Generation)

**定義：** ビルド時（Build Time）にすべての HTML ページを事前生成し、静的ファイルとしてデプロイする。

**設定方法：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSG には SSR が true である必要がある
  nitro: {
    prerender: {
      routes: ['/about', '/contact'], // プリレンダリングするルートを指定
    },
  },
});

// または routeRules を使用
export default defineNuxtConfig({
  routeRules: {
    '/about': { prerender: true },
    '/contact': { prerender: true },
  },
});
```

**フロー：**
1. ビルド時に JavaScript を実行し、すべてのページの HTML を生成
2. HTML ファイルを CDN にデプロイ
3. ブラウザのリクエスト時に事前生成された HTML を直接返す

**メリット：**
- ✅ 最高のパフォーマンス（CDN キャッシュ、高速なレスポンス）
- ✅ SEO フレンドリー（完全な HTML コンテンツ）
- ✅ Server の負荷が最小（ランタイムレンダリング不要）
- ✅ 低コスト（CDN にデプロイ可能）

**デメリット：**
- ❌ 動的コンテンツには不向き（更新にはリビルドが必要）
- ❌ ビルド時間が長くなる可能性（大量のページがある場合）
- ❌ ユーザー固有のコンテンツを処理できない

**適用シーン：**
- 会社概要ページ（固定コンテンツ）
- 製品説明ページ（比較的固定のコンテンツ）
- ブログ記事（公開後に頻繁に変更されない）

### 2.4 CSR (Client-Side Rendering)

**定義：** ブラウザで JavaScript を実行し、動的に HTML コンテンツを生成する。

**設定方法：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // グローバルで SSR を無効化
});

// または特定のルートに対して
export default defineNuxtConfig({
  routeRules: {
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});

// またはページ内で設定
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false,
});
</script>
```

**フロー：**
1. ブラウザが HTML をリクエスト（通常は空の shell）
2. JavaScript bundle をダウンロード
3. JavaScript を実行し、動的にコンテンツを生成
4. ページをレンダリング

**メリット：**
- ✅ 高いインタラクティブ性、SPA に最適
- ✅ Server の負荷を軽減
- ✅ ページ遷移がスムーズ（リロード不要）

**デメリット：**
- ❌ SEO に不利（検索エンジンが正しくインデックスできない可能性）
- ❌ 初回読み込み時間が長い（JavaScript のダウンロードと実行が必要）
- ❌ JavaScript がないとコンテンツが表示されない

**適用シーン：**
- 管理画面（SEO 不要）
- ユーザーダッシュボード（SEO 不要）
- インタラクティブアプリケーション（ゲーム、ツールなど）

### 2.5 Hybrid Rendering（ハイブリッドレンダリング）

**定義：** ページごとの要件に応じて、複数の Rendering Modes を混合使用する。

**設定方法：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // デフォルト SSR
  routeRules: {
    // SEO が必要なページ：SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // 固定コンテンツのページ：SSG
    '/about': { prerender: true },
    '/contact': { prerender: true },

    // SEO 不要のページ：CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**メリット：**
- ✅ ページ特性に応じた適切なモードを選択
- ✅ SEO、パフォーマンス、開発体験のバランス
- ✅ 高い柔軟性

**適用シーン：**
- 大規模プロジェクト（ページごとに異なる要件）
- EC プラットフォーム（商品ページ SSR、管理画面 CSR、会社概要ページ SSG）

### 2.6 ISR (Incremental Static Regeneration)

**定義：** インクリメンタル静的再生成。SSG のパフォーマンスと SSR の動的性を組み合わせたもの。ページはビルド時または最初のリクエスト時に静的 HTML を生成し、一定期間（TTL）キャッシュされる。キャッシュ期限切れ後の次のリクエスト時に、バックグラウンドでページを再生成しつつ、古いキャッシュコンテンツを返す（Stale-While-Revalidate）。

**設定方法：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // ISR を有効化、1時間キャッシュ (3600秒)
    '/blog/**': { swr: 3600 },
    // または isr プロパティを使用 (Netlify/Vercel などのプラットフォームで特定のサポートあり)
    '/products/**': { isr: 600 },
  },
});
```

**フロー：**
1. リクエスト A 到達：Server がページをレンダリングし、返却してキャッシュ (Cache MISS -> HIT)。
2. リクエスト B 到達 (TTL 内)：キャッシュされたコンテンツを直接返す (Cache HIT)。
3. リクエスト C 到達 (TTL 後)：古いキャッシュを返し (Stale)、バックグラウンドで再レンダリングしてキャッシュを更新 (Revalidate)。
4. リクエスト D 到達：新しいキャッシュコンテンツを返す。

**メリット：**
- ✅ SSG に近い究極のパフォーマンス
- ✅ SSG のビルド時間が長い問題を解決
- ✅ コンテンツを定期的に更新可能

**適用シーン：**
- 大規模ブログ
- EC 商品詳細ページ
- ニュースサイト

### 2.7 Route Rules とキャッシュ戦略

Nuxt 3 は `routeRules` を使用して、ハイブリッドレンダリングとキャッシュ戦略を統一管理する。これは Nitro レベルで処理される。

| プロパティ | 意味 | 適用シーン |
|------|------|---------|
| `ssr: true` | Server-Side Rendering を強制 | SEO + 高い動的性 |
| `ssr: false` | Client-Side Rendering (SPA) を強制 | 管理画面、ダッシュボード |
| `prerender: true` | ビルド時にプリレンダリング (SSG) | 会社概要、利用規約ページ |
| `swr: true` | SWR キャッシュを有効化 (有効期限なし、再デプロイまで) | 変更が極めて少ないコンテンツ |
| `swr: 60` | ISR を有効化、60秒キャッシュ | リストページ、イベントページ |
| `cache: { maxAge: 60 }` | Cache-Control header を設定 (ブラウザ/CDN キャッシュ) | 静的リソース |

---

## 3. 選択戦略

### 3.1 要件に基づく Rendering Mode の選択

**意思決定フローチャート：**

```
SEO が必要？
├─ はい → コンテンツは頻繁に変更される？
│   ├─ はい → SSR
│   └─ いいえ → SSG
└─ いいえ → CSR
```

**選択対照表：**

| 要件 | 推奨モード | 理由 |
|------|---------|------|
| **SEO が必要** | SSR / SSG | 検索エンジンが完全なコンテンツを認識可能 |
| **頻繁にコンテンツが変更** | SSR | リクエストごとに最新コンテンツを取得 |
| **比較的固定のコンテンツ** | SSG | 最高のパフォーマンス、最低コスト |
| **SEO 不要** | CSR | 高いインタラクティブ性、スムーズなページ遷移 |
| **大量のページ** | SSG | ビルド時に生成、CDN キャッシュ |
| **ユーザー固有のコンテンツ** | SSR / CSR | 動的な生成が必要 |

### 3.2 実践ケース

#### ケース 1：EC プラットフォーム

**要件：**
- 商品ページに SEO が必要（Google にインデックスさせる）
- 商品内容が頻繁に変動（価格、在庫）
- ユーザー個人ページに SEO は不要

**ソリューション：**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // 商品ページ：SSR（SEO + 動的コンテンツが必要）
    '/products/**': { ssr: true },

    // 会社概要：SSG（固定コンテンツ）
    '/about': { prerender: true },

    // ユーザーページ：CSR（SEO 不要）
    '/user/**': { ssr: false },
  },
});
```

#### ケース 2：ブログサイト

**要件：**
- 記事ページに SEO が必要
- 記事内容は比較的固定（公開後に頻繁に変更されない）
- 高速な読み込みが必要

**ソリューション：**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // 記事ページ：SSG（固定コンテンツ + SEO が必要）
    '/articles/**': { prerender: true },

    // トップページ：SSG（固定コンテンツ）
    '/': { prerender: true },

    // 管理画面：CSR（SEO 不要）
    '/admin/**': { ssr: false },
  },
});
```

---

## 4. 面接の重要ポイント

### 4.1 Nuxt 3 の Rendering Modes

**このように回答できます：**

> Nuxt 3 は4つの Rendering Modes をサポートしています：SSR は Server 側でリクエストごとにレンダリングし、SEO が必要で動的コンテンツのページに適しています；SSG はビルド時に HTML を事前生成し、SEO が必要で固定コンテンツのページに適しており、パフォーマンスが最高です；CSR はブラウザ側でレンダリングし、SEO 不要でインタラクティブ性が高いページに適しています；Hybrid Rendering は複数のモードを混合使用し、ページごとの要件に応じて適切なモードを選択します。

**キーポイント：**
- ✅ 4つのモードの特性と違い
- ✅ 適用シーンと選択の考慮事項
- ✅ Hybrid Rendering の利点

### 4.2 Rendering Mode の選び方

**このように回答できます：**

> Rendering Mode の選択は主に3つの要素を考慮します：SEO 要件、コンテンツの動的性、パフォーマンス要件。SEO が必要なページは SSR または SSG を選択；コンテンツが頻繁に変わるものは SSR を選択；固定コンテンツは SSG を選択；SEO が不要なページは CSR を選択できます。実際のプロジェクトでは通常 Hybrid Rendering を使用し、ページごとの特性に応じて適切なモードを選択します。例えば、EC プラットフォームの商品ページは SSR（SEO + 動的コンテンツが必要）、会社概要ページは SSG（固定コンテンツ）、ユーザー個人ページは CSR（SEO 不要）を使用します。

**キーポイント：**
- ✅ SEO 要件、コンテンツの動的性、パフォーマンス要件に基づく選択
- ✅ 実際のプロジェクトでの複数モードの混合使用
- ✅ 具体的なケーススタディの説明

### 4.3 ISR と Route Rules
**Q: ISR（Incremental Static Regeneration）をどのように実装しますか？Nuxt 3 の caching メカニズムにはどのようなものがありますか？**

> **回答例：**
> Nuxt 3 では、`routeRules` を通じて ISR を実装できます。
> `nuxt.config.ts` で `{ swr: 秒数 }` を設定するだけで、Nitro が自動的に Stale-While-Revalidate メカニズムを有効にします。
> 例えば `'/blog/**': { swr: 3600 }` は、そのパス配下のページが1時間キャッシュされることを意味します。
> `routeRules` は非常に強力で、異なるパスに異なる戦略を設定できます：SSR のページ、SSG (`prerender: true`) のページ、ISR (`swr`) のページ、CSR (`ssr: false`) のページがあり、これが Hybrid Rendering の真髄です。

---

## 5. ベストプラクティス

### 5.1 選択の原則

1. **SEO が必要なページ**
   - 固定コンテンツ → SSG
   - 動的コンテンツ → SSR

2. **SEO が不要なページ**
   - 高いインタラクティブ性 → CSR
   - Server 側ロジックが必要 → SSR

3. **混合戦略**
   - ページ特性に応じた適切なモードの選択
   - `routeRules` で統一管理

### 5.2 設定の推奨事項

1. **デフォルトで SSR を使用**
   - SEO フレンドリーを確保
   - 後から特定のページに対して調整可能

2. **routeRules で統一管理**
   - 設定を集中化、メンテナンスが容易
   - 各ページのレンダリングモードを明確に表示

3. **定期的な見直しと最適化**
   - 実際の使用状況に応じて調整
   - パフォーマンス指標を監視

---

## 6. 面接の総括

**このように回答できます：**

> Nuxt 3 は4つの Rendering Modes をサポートしています：SSR、SSG、CSR、Hybrid Rendering。SSR は SEO が必要で動的コンテンツのページに適しています；SSG は SEO が必要で固定コンテンツのページに適しており、パフォーマンスが最高です；CSR は SEO 不要でインタラクティブ性が高いページに適しています。選択時は主に SEO 要件、コンテンツの動的性、パフォーマンス要件を考慮します。実際のプロジェクトでは通常 Hybrid Rendering を使用し、ページごとの特性に応じて適切なモードを選択します。例えば、EC プラットフォームの商品ページは SSR、会社概要ページは SSG、ユーザー個人ページは CSR を使用します。

**キーポイント：**
- ✅ 4つの Rendering Modes の特性と違い
- ✅ 選択戦略と考慮要素
- ✅ Hybrid Rendering の実装経験
- ✅ 実際のプロジェクトのケーススタディ

---

## 7. Reference

- [Nuxt 3 Rendering Modes](https://nuxt.com/docs/guide/concepts/rendering)
- [Nuxt 3 Route Rules](https://nuxt.com/docs/api/nuxt-config#routerules)
