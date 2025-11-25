---
id: css-pseudo-elements
title: '[Easy] 🏷️ 偽元素 (Pseudo-elements)'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## 什麼是偽元素

偽元素 (Pseudo-elements) 是 CSS 的一個關鍵字，用來選取元素的特定部分或在元素前後插入內容。它們使用**雙冒號** `::` 語法（CSS3 標準），以區別於偽類 (pseudo-classes) 的單冒號 `:` 語法。

## 常見的偽元素

### 1. ::before 和 ::after

最常用的偽元素，用於在元素內容的前面或後面插入內容。

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

**特點**：

- 必須包含 `content` 屬性（即使是空字串）
- 預設為 `inline` 元素
- 不會出現在 DOM 中，無法被 JavaScript 選取

### 2. ::first-letter

選取元素的第一個字母，常用於雜誌風格的首字放大效果。

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

選取元素的第一行文字。

```css
.intro::first-line {
  font-weight: bold;
  color: #333;
}
```

**注意**：`::first-line` 只能用於區塊級元素。

### 4. ::selection

自訂使用者選取文字時的樣式。

```css
::selection {
  background-color: #ffeb3b;
  color: #000;
}

/* Firefox 需要加上前綴 */
::-moz-selection {
  background-color: #ffeb3b;
  color: #000;
}
```

### 5. ::placeholder

自訂表單 placeholder 的樣式。

```css
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 0.7;
}
```

### 6. ::marker

自訂列表標記 (list marker) 的樣式。

```css
li::marker {
  content: '✓ ';
  color: green;
  font-size: 1.2em;
}
```

### 7. ::backdrop

用於全螢幕元素（如 `<dialog>` 或全螢幕影片）的背景遮罩。

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}
```

## 實際應用場景

### 1. 裝飾性圖示與圖標

不需要額外的 HTML 元素，純 CSS 實現：

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

**使用時機**：不想在 HTML 中加入純裝飾性的元素。

### 2. 清除浮動 (Clearfix)

經典的清除浮動技巧：

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

**使用時機**：父元素內有浮動子元素，需要撐開父元素高度。

### 3. 引號裝飾

為引用文字自動添加引號：

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

**使用時機**：美化引用區塊，不想手動輸入引號。

### 4. 純 CSS 圖形

利用偽元素創建幾何圖形：

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

**使用時機**：創建箭頭、三角形等簡單圖形，無需圖片或 SVG。

### 5. 必填欄位標記

為必填表單欄位添加紅色星號：

```css
.required::after {
  content: ' *';
  color: red;
  font-weight: bold;
}
```

**使用時機**：標示必填欄位，保持 HTML 語意清晰。

### 6. 外部連結標示

自動為外部連結添加圖示：

```css
a[href^='http']::after {
  content: ' 🔗';
  font-size: 0.8em;
  opacity: 0.6;
}

/* 或使用 icon font */
a[target='_blank']::after {
  content: '\f08e'; /* Font Awesome 外部連結圖示 */
  font-family: 'FontAwesome';
  margin-left: 4px;
}
```

**使用時機**：提升使用者體驗，讓使用者知道將開啟新分頁。

### 7. 計數器編號

使用 CSS 計數器自動編號：

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

**使用時機**：自動產生編號，無需手動維護。

### 8. 遮罩層效果

為圖片添加 hover 遮罩：

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

**使用時機**：不想額外增加 HTML 元素來實現遮罩效果。

## 偽元素 vs 偽類

| 特性     | 偽元素 (::)                             | 偽類 (:)                            |
| -------- | --------------------------------------- | ----------------------------------- |
| **語法** | 雙冒號 `::before`                       | 單冒號 `:hover`                     |
| **功能** | 創建/選取元素的特定部分                 | 選取元素的特定狀態                  |
| **範例** | `::before`, `::after`, `::first-letter` | `:hover`, `:active`, `:nth-child()` |
| **DOM**  | 不存在於 DOM 中                         | 選取實際的 DOM 元素                 |

## 常見陷阱

### 1. content 屬性必須存在

`::before` 和 `::after` 必須有 `content` 屬性，否則不會顯示：

```css
/* ❌ 不會顯示 */
.box::before {
  width: 20px;
  height: 20px;
  background: red;
}

/* ✅ 正確 */
.box::before {
  content: ''; /* 即使是空字串也要加 */
  display: block;
  width: 20px;
  height: 20px;
  background: red;
}
```

### 2. 無法用於替換元素

某些元素（如 `<img>`、`<input>`、`<iframe>`）無法使用 `::before` 和 `::after`：

```css
/* ❌ 無效 */
img::before {
  content: 'Photo:';
}

/* ✅ 改用包裹元素 */
.image-wrapper::before {
  content: 'Photo:';
}
```

### 3. 預設為 inline 元素

`::before` 和 `::after` 預設是 `inline` 元素，設定寬高時要注意：

```css
.box::before {
  content: '';
  display: block; /* 或 inline-block */
  width: 100px;
  height: 100px;
}
```

### 4. z-index 層級問題

偽元素的 `z-index` 是相對於父元素的：

```css
.parent {
  position: relative;
}

.parent::before {
  content: '';
  position: absolute;
  z-index: -1; /* 會在父元素下方，但在父元素的背景上方 */
}
```

### 5. 單冒號的向後相容

CSS3 規範使用雙冒號 `::` 來區分偽元素和偽類，但單冒號 `:` 仍可運作（向後相容 CSS2）：

```css
/* CSS3 標準寫法（建議） */
.box::before {
}

/* CSS2 寫法（仍可運作） */
.box:before {
}
```

## 面試重點

1. **偽元素的雙冒號語法**：區分偽元素 `::` 和偽類 `:`
2. **content 屬性必須存在**：`::before` 和 `::after` 的關鍵
3. **不在 DOM 中**：無法被 JavaScript 直接選取或操作
4. **無法用於替換元素**：`<img>`、`<input>` 等元素無效
5. **實際應用場景**：裝飾性圖示、清除浮動、圖形繪製等

## Reference

- [Pseudo-elements - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [CSS Pseudo-elements - W3Schools](https://www.w3schools.com/css/css_pseudo_elements.asp)
- [A Whole Bunch of Amazing Stuff Pseudo Elements Can Do](https://css-tricks.com/pseudo-element-roundup/)
