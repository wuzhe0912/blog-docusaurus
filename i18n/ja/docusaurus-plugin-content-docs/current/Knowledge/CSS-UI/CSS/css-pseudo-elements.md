---
id: css-pseudo-elements
title: '[Easy] 🏷️ 擬似要素 (Pseudo-elements)'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## 擬似要素とは

擬似要素 (Pseudo-elements) は CSS のキーワードで、要素の特定の部分を選択したり、要素の前後にコンテンツを挿入するために使用します。CSS3 標準では**ダブルコロン** `::` 構文を使用し、擬似クラス (pseudo-classes) のシングルコロン `:` 構文と区別します。

## よく使われる擬似要素

### 1. ::before と ::after

最もよく使われる擬似要素で、要素のコンテンツの前後にコンテンツを挿入するために使用します。

```css
.icon::before {
  content: '📌';
  margin-right: 8px;
}

.external-link::after {
  content: ' ↗';
  font-size: 0.8em;
}
```

**特徴**：

- `content` プロパティが必須（空文字列であっても）
- デフォルトでは `inline` 要素
- DOM には存在せず、JavaScript で選択不可

### 2. ::first-letter

要素の最初の文字を選択します。雑誌スタイルの頭文字拡大効果によく使用されます。

```css
.article::first-letter {
  font-size: 3em;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 8px;
}
```

### 3. ::first-line

要素の最初の行のテキストを選択します。

```css
.intro::first-line {
  font-weight: bold;
  color: #333;
}
```

**注意**：`::first-line` はブロックレベル要素にのみ使用できます。

### 4. ::selection

ユーザーがテキストを選択した時のスタイルをカスタマイズします。

```css
::selection {
  background-color: #ffeb3b;
  color: #000;
}

/* Firefox ではプレフィックスが必要 */
::-moz-selection {
  background-color: #ffeb3b;
  color: #000;
}
```

### 5. ::placeholder

フォームの placeholder のスタイルをカスタマイズします。

```css
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 0.7;
}
```

### 6. ::marker

リストマーカー (list marker) のスタイルをカスタマイズします。

```css
li::marker {
  content: '✓ ';
  color: green;
  font-size: 1.2em;
}
```

### 7. ::backdrop

フルスクリーン要素（`<dialog>` やフルスクリーンビデオなど）の背景オーバーレイに使用します。

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}
```

## 実際の使用シーン

### 1. 装飾的なアイコン

追加の HTML 要素なしで、純粋な CSS で実現：

```css
.success::before {
  content: '✓';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: green;
  color: white;
  border-radius: 50%;
  text-align: center;
  margin-right: 8px;
}
```

**使用タイミング**：HTML に純粋に装飾的な要素を追加したくない場合。

### 2. フロートのクリア (Clearfix)

クラシックなフロートクリアの手法：

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

**使用タイミング**：親要素内にフロートした子要素があり、親要素の高さを確保する必要がある場合。

### 3. 引用符の装飾

引用テキストに自動的に引用符を追加：

```css
blockquote::before {
  content: open-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote::after {
  content: close-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote {
  quotes: '"' '"' '' ' ' '';
}
```

**使用タイミング**：引用ブロックを装飾し、手動で引用符を入力したくない場合。

### 4. 純粋な CSS 図形

擬似要素を使用して幾何学的図形を作成：

```css
.arrow {
  position: relative;
  width: 100px;
  height: 40px;
  background: #3498db;
}

.arrow::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  width: 0;
  height: 0;
  border-left: 20px solid #3498db;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
}
```

**使用タイミング**：矢印や三角形などの簡単な図形を作成し、画像や SVG を使用しない場合。

### 5. 必須フィールドの表示

必須フォームフィールドに赤いアスタリスクを追加：

```css
.required::after {
  content: ' *';
  color: red;
  font-weight: bold;
}
```

**使用タイミング**：必須フィールドを表示し、HTML のセマンティクスを明確に保つ場合。

### 6. 外部リンクの表示

外部リンクに自動的にアイコンを追加：

```css
a[href^='http']::after {
  content: ' 🔗';
  font-size: 0.8em;
  opacity: 0.6;
}

/* または icon font を使用 */
a[target='_blank']::after {
  content: '\f08e'; /* Font Awesome 外部リンクアイコン */
  font-family: 'FontAwesome';
  margin-left: 4px;
}
```

**使用タイミング**：ユーザー体験を向上させ、新しいタブが開かれることをユーザーに知らせる場合。

### 7. カウンター番号

CSS カウンターを使用した自動番号付け：

```css
.faq-list {
  counter-reset: faq-counter;
}

.faq-item::before {
  counter-increment: faq-counter;
  content: 'Q' counter(faq-counter) '. ';
  font-weight: bold;
  color: #3498db;
}
```

**使用タイミング**：自動的に番号を生成し、手動でのメンテナンスが不要な場合。

### 8. オーバーレイ効果

画像に hover オーバーレイを追加：

```css
.image-card {
  position: relative;
}

.image-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s;
}

.image-card:hover::after {
  background: rgba(0, 0, 0, 0.5);
}
```

**使用タイミング**：追加の HTML 要素なしでオーバーレイ効果を実現したい場合。

## 擬似要素 vs 擬似クラス

| 特性       | 擬似要素 (::)                           | 擬似クラス (:)                      |
| ---------- | --------------------------------------- | ----------------------------------- |
| **構文**   | ダブルコロン `::before`                 | シングルコロン `:hover`             |
| **機能**   | 要素の特定部分を作成/選択               | 要素の特定状態を選択                |
| **例**     | `::before`, `::after`, `::first-letter` | `:hover`, `:active`, `:nth-child()` |
| **DOM**    | DOM には存在しない                      | 実際の DOM 要素を選択               |

## よくある落とし穴

### 1. content プロパティが必須

`::before` と `::after` には `content` プロパティが必要です。ないと表示されません：

```css
/* ❌ 表示されない */
.box::before {
  width: 20px;
  height: 20px;
  background: red;
}

/* ✅ 正しい */
.box::before {
  content: ''; /* 空文字列でも必要 */
  display: block;
  width: 20px;
  height: 20px;
  background: red;
}
```

### 2. 置換要素には使用不可

一部の要素（`<img>`、`<input>`、`<iframe>` など）では `::before` と `::after` を使用できません：

```css
/* ❌ 無効 */
img::before {
  content: 'Photo:';
}

/* ✅ ラッパー要素を使用 */
.image-wrapper::before {
  content: 'Photo:';
}
```

### 3. デフォルトでは inline 要素

`::before` と `::after` はデフォルトでは `inline` 要素なので、幅と高さを設定する際は注意が必要です：

```css
.box::before {
  content: '';
  display: block; /* または inline-block */
  width: 100px;
  height: 100px;
}
```

### 4. z-index の階層問題

擬似要素の `z-index` は親要素に対する相対値です：

```css
.parent {
  position: relative;
}

.parent::before {
  content: '';
  position: absolute;
  z-index: -1; /* 親要素の下に表示されるが、親要素の背景の上に表示される */
}
```

### 5. シングルコロンの後方互換性

CSS3 仕様ではダブルコロン `::` を使用して擬似要素と擬似クラスを区別しますが、シングルコロン `:` も依然として動作します（CSS2 との後方互換性）：

```css
/* CSS3 標準の書き方（推奨） */
.box::before {
}

/* CSS2 の書き方（引き続き動作） */
.box:before {
}
```

## 面接のポイント

1. **擬似要素のダブルコロン構文**：擬似要素 `::` と擬似クラス `:` の区別
2. **content プロパティが必須**：`::before` と `::after` の要点
3. **DOM に存在しない**：JavaScript で直接選択や操作ができない
4. **置換要素には使用不可**：`<img>`、`<input>` などの要素では無効
5. **実際の使用シーン**：装飾的アイコン、フロートクリア、図形描画など

## Reference

- [Pseudo-elements - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [CSS Pseudo-elements - W3Schools](https://www.w3schools.com/css/css_pseudo_elements.asp)
- [A Whole Bunch of Amazing Stuff Pseudo Elements Can Do](https://css-tricks.com/pseudo-element-roundup/)
