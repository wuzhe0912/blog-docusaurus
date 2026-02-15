---
id: css-units
title: '[Medium] 🏷️ CSS 単位'
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. `px`, `em`, `rem`, `vw`, `vh` の違いを説明してください

### クイック比較表

| 単位  | タイプ   | 基準                   | 親要素の影響を受けるか | よくある用途                       |
| ----- | -------- | ---------------------- | ---------------------- | ---------------------------------- |
| `px`  | 絶対単位 | スクリーンピクセル     | ❌                     | ボーダー、シャドウ、細かいディテール |
| `em`  | 相対単位 | **親要素**の font-size | ✅                     | パディング、マージン（フォントサイズに連動） |
| `rem` | 相対単位 | **ルート要素**の font-size | ❌                 | フォント、間隔、汎用サイズ         |
| `vw`  | 相対単位 | ビューポート幅の 1%    | ❌                     | レスポンシブ幅、全幅要素           |
| `vh`  | 相対単位 | ビューポート高さの 1%  | ❌                     | レスポンシブ高さ、フルスクリーンセクション |

### 詳細説明

#### `px` (Pixels)

**定義**：絶対単位、1px = スクリーン上の1ピクセル

**特性**：

- 固定サイズで、いかなる設定でも変わらない
- 精密な制御が可能だが、柔軟性に欠ける
- レスポンシブデザインやアクセシビリティに不向き

**使用タイミング**：

```css
/* ✅ 適している用途 */
border: 1px solid #000; /* ボーダー */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* シャドウ */
border-radius: 4px; /* 小さな角丸 */

/* ❌ 推奨しない用途 */
font-size: 16px; /* フォントには rem を推奨 */
width: 1200px; /* 幅には % や vw を推奨 */
```

#### `em`

**定義**：**親要素**の font-size に対する倍率

**特性**：

- 継承が累積する（ネスト構造で重なる）
- 柔軟性は高いが制御が難しくなりやすい
- 親要素に連動してスケールさせたい場合に適している

**計算例**：

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
  padding: 1em; /* 24px × 1 = 24px（自身の font-size に対する相対値）*/
}

.grandchild {
  font-size: 1.5em; /* 24px × 1.5 = 36px（累積効果！）*/
}
```

**使用タイミング**：

```css
/* ✅ 適している用途 */
.button {
  font-size: 1rem;
  padding: 0.5em 1em; /* パディングがボタンのフォントサイズに連動 */
}

.card-title {
  font-size: 1.2em; /* カードのベースフォントに対する相対値 */
  margin-bottom: 0.5em; /* 間隔がタイトルサイズに連動 */
}

/* ⚠️ ネストの累積に注意 */
```

#### `rem` (Root em)

**定義**：**ルート要素**（`<html>`）の font-size に対する倍率

**特性**：

- 継承が累積しない（常にルート要素に対する相対値）
- 管理とメンテナンスが容易
- グローバルスケーリングの実装が便利
- 最も推奨される単位の1つ

**計算例**：

```css
html {
  font-size: 16px; /* ブラウザのデフォルト */
}

.element {
  font-size: 1.5rem; /* 16px × 1.5 = 24px */
  padding: 2rem; /* 16px × 2 = 32px */
  margin: 1rem 0; /* 16px × 1 = 16px */
}

.nested .element {
  font-size: 1.5rem; /* やはり 24px、累積しない！ */
}
```

**使用タイミング**：

```css
/* ✅ 最も推奨される用途 */
html {
  font-size: 16px; /* 基準を設定 */
}

body {
  font-size: 1rem; /* 本文 16px */
}

h1 {
  font-size: 2.5rem; /* 40px */
}

p {
  font-size: 1rem; /* 16px */
  margin-bottom: 1rem; /* 16px */
}

.container {
  padding: 2rem; /* 32px */
  max-width: 75rem; /* 1200px */
}

/* ✅ ダークモードやアクセシビリティ調整に便利 */
@media (prefers-reduced-motion: reduce) {
  html {
    font-size: 18px; /* すべての rem 単位が自動的に拡大 */
  }
}
```

#### `vw` (Viewport Width)

**定義**：ビューポート幅の 1%（100vw = ビューポート幅）

**特性**：

- 真のレスポンシブ単位
- ブラウザのウィンドウサイズに応じてリアルタイムに変化
- 注意：100vw にはスクロールバーの幅が含まれる

**計算例**：

```css
/* ビューポート幅 1920px の場合 */
.element {
  width: 50vw; /* 1920px × 50% = 960px */
  font-size: 5vw; /* 1920px × 5% = 96px */
}

/* ビューポート幅 375px の場合（スマートフォン） */
.element {
  width: 50vw; /* 375px × 50% = 187.5px */
  font-size: 5vw; /* 375px × 5% = 18.75px */
}
```

**使用タイミング**：

```css
/* ✅ 適している用途 */
.hero {
  width: 100vw; /* 全幅バナー */
  margin-left: calc(-50vw + 50%); /* コンテナの制限を超える */
}

.hero-title {
  font-size: clamp(2rem, 5vw, 5rem); /* レスポンシブフォント */
}

.responsive-box {
  width: 80vw;
  max-width: 1200px; /* 最大値の制限を追加 */
}

/* ❌ 避けるべき */
body {
  width: 100vw; /* 水平スクロールバーが表示される（スクロールバーの幅を含むため）*/
}
```

#### `vh` (Viewport Height)

**定義**：ビューポート高さの 1%（100vh = ビューポート高さ）

**特性**：

- フルスクリーン効果の作成に適している
- モバイルデバイスではアドレスバーの問題に注意が必要
- キーボードの表示による影響を受ける可能性がある

**使用タイミング**：

```css
/* ✅ 適している用途 */
.hero-section {
  height: 100vh; /* フルスクリーンのヒーローセクション */
}

.fullscreen-modal {
  height: 100vh;
  width: 100vw;
}

.sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
}

/* ⚠️ モバイルデバイスの代替案 */
.hero-section {
  height: 100vh;
  height: 100dvh; /* 動的ビューポート高さ（新しい単位）*/
}

/* ✅ 垂直中央揃え */
.center-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 実務的なアドバイスとベストプラクティス

#### 1. レスポンシブフォントシステムの構築

```css
/* 基準の設定 */
html {
  font-size: 16px; /* デスクトップのデフォルト */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* タブレット */
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px; /* スマートフォン */
  }
}

/* rem を使用するすべての要素が自動的にスケーリング */
h1 {
  font-size: 2.5rem;
} /* デスクトップ 40px, スマートフォン 30px */
p {
  font-size: 1rem;
} /* デスクトップ 16px, スマートフォン 12px */
```

#### 2. 異なる単位の混合使用

```css
.card {
  /* レスポンシブ幅 + 範囲制限 */
  width: 90vw;
  max-width: 75rem;

  /* rem を間隔に使用 */
  padding: 2rem;
  margin: 1rem auto;

  /* px をディテールに使用 */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  /* clamp で複数の単位を組み合わせ、スムーズなスケーリングを実現 */
  font-size: clamp(1.25rem, 3vw, 2rem);
}
```

### 面接回答の例

**回答の構成**：

```markdown
1. **px**：ピクセルの細かいディテール → ボーダー、シャドウ、小さな角丸
2. **rem**：安定した基準 → フォント、間隔、主要なサイズ
3. **em**：親要素に連動
4. **vw**：ビューポート幅に連動 → レスポンシブ幅
5. **vh**：ビューポート高さに連動 → フルスクリーンセクション
```

1. **クイック定義**

   - px は絶対単位、その他はすべて相対単位
   - em は親要素に対する相対値、rem はルート要素に対する相対値
   - vw/vh はビューポートサイズに対する相対値

2. **主な違い**

   - rem は累積しない、em は累積する（これが主な違い）
   - vw/vh は真のレスポンシブだが、スクロールバーの問題に注意

3. **実務での適用**

   - **px**：1px のボーダー、シャドウなどのディテール
   - **rem**：フォント、間隔、コンテナ（最もよく使用、メンテナンスが容易）
   - **em**：ボタンのパディング（フォントスケーリングに連動させたい場合）
   - **vw/vh**：全幅バナー、フルスクリーンセクション、clamp と組み合わせたレスポンシブフォント

4. **ベストプラクティス**
   - html の font-size を基準として設定
   - clamp() で異なる単位を組み合わせる
   - モバイルデバイスの vh の問題に注意（dvh を使用可能）

### Reference

- [MDN - CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Units - A Complete Guide](https://www.freecodecamp.org/news/css-unit-guide/)
- [Modern CSS Solutions](https://moderncss.dev/generating-font-size-css-rules-and-creating-a-fluid-type-scale/)
