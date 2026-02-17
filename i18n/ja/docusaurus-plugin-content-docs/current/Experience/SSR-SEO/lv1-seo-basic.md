---
title: '[Lv1] SEO 基礎実装：Router モードと Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> マルチブランドプラットフォームプロジェクトにおいて、SEO の基礎設定を実装：Router History Mode、Meta Tags 構造、静的ページの SEO。

---

## 1. 面接回答の要点

1. **Router モードの選択**：Hash Mode ではなく History Mode を使用し、クリーンな URL 構造を提供。
2. **Meta Tags の基礎**：Open Graph と Twitter Card を含む完全な SEO meta tags を実装。
3. **静的ページの SEO**：Landing Page に完全な SEO 要素を設定。

---

## 2. Router History Mode の設定

### 2.1 なぜ History Mode を選択するのか？

**ファイル場所：** `quasar.config.js`

```javascript
// 第 82 行
vueRouterMode: "history", // history モードを使用（hash モードではなく）
```

**SEO のメリット：**

| モード           | URL 例    | SEO への影響                      |
| ---------------- | --------- | --------------------------------- |
| **Hash Mode**    | `/#/home` | ❌ 検索エンジンがインデックスしにくい |
| **History Mode** | `/home`   | ✅ クリーンな URL、インデックスしやすい |

**主な違い：**

- History Mode はクリーンな URL を生成（例：`/#/home` ではなく `/home`）
- 検索エンジンがインデックス・クロールしやすい
- より良いユーザー体験と共有体験
- バックエンドの設定が必要（404 エラーを防ぐため）

### 2.2 バックエンド設定の要件

History Mode を使用する場合、バックエンドの設定が必要：

```nginx
# Nginx の例
location / {
  try_files $uri $uri/ /index.html;
}
```

これにより、すべてのルートが `index.html` を返し、フロントエンドの Router が処理します。

---

## 3. Meta Tags の基本構造

### 3.1 基本 SEO Meta Tags

**ファイル場所：** `template/*/public/landingPage/index.html`

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

**説明：**

- `title`：ページタイトル、検索結果の表示に影響
- `keywords`：キーワード（現代 SEO では重要性が低いが、設定を推奨）
- `description`：ページの説明、検索結果に表示される

### 3.2 Open Graph Tags（ソーシャルメディア共有）

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

- Facebook、LinkedIn などのソーシャルメディアで共有時に表示されるプレビュー
- `og:image` の推奨サイズ：1200x630px
- `og:type` は `website`、`article` などに設定可能

### 3.3 Twitter Card Tags

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AMUSE VIP" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="images/amuse.webp" />
```

**Twitter Card の種類：**

- `summary`：小さなカード
- `summary_large_image`：大きな画像カード（推奨）

---

## 4. 静的 Landing Page SEO の実装

### 4.1 完全な SEO 要素リスト

プロジェクトの Landing Page で、以下の SEO 要素を実装：

```html
✅ Title タグ ✅ Keywords meta tag ✅ Description meta tag ✅ Open Graph
tags（Facebook、LinkedIn など） ✅ Twitter Card tags ✅ Canonical URL ✅ Favicon
設定
```

### 4.2 実装例

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
    <!-- ページコンテンツ -->
  </body>
</html>
```

---

## 5. 面接のポイント整理

### 5.1 Router モードの選択

**なぜ History Mode を選択するのか？**

- クリーンな URL を提供し、SEO 効果を向上
- 検索エンジンがインデックスしやすい
- より良いユーザー体験

**注意すべき点は？**

- バックエンドの設定が必要（ルートに直接アクセスした際の 404 を防止）
- fallback メカニズムの設定が必要

### 5.2 Meta Tags の重要性

**基本 Meta Tags：**

- `title`：検索結果の表示に影響
- `description`：クリック率に影響
- `keywords`：現代 SEO では重要性が低いが、設定を推奨

**ソーシャルメディア Meta Tags：**

- Open Graph：Facebook、LinkedIn などのプラットフォームでの共有プレビュー
- Twitter Card：Twitter での共有プレビュー
- 画像サイズの推奨：1200x630px

---

## 6. ベストプラクティス

1. **Title タグ**

   - 長さを 50-60 文字に制御
   - 主要キーワードを含める
   - 各ページにユニークな title を設定

2. **Description**

   - 長さを 150-160 文字に制御
   - ページ内容を簡潔に記述
   - CTA（行動喚起）を含める

3. **Open Graph 画像**

   - サイズ：1200x630px
   - ファイルサイズ：< 1MB
   - 高品質な画像を使用

4. **Canonical URL**
   - 重複コンテンツの問題を回避
   - メインバージョンの URL を指定

---

## 7. 面接のまとめ

**このように回答できます：**

> プロジェクトでは、Vue Router の Hash Mode ではなく History Mode を選択しました。History Mode はクリーンな URL 構造を提供し、SEO により適しているからです。同時に、Landing Page に完全な SEO meta tags を実装しました。基本的な title、description、keywords に加え、Open Graph と Twitter Card tags も含め、ソーシャルメディアで共有する際にプレビューが正しく表示されるようにしました。

**キーポイント：**

- ✅ Router History Mode の選択理由
- ✅ Meta Tags の完全な構造
- ✅ ソーシャルメディア共有の最適化
- ✅ 実際のプロジェクト経験
