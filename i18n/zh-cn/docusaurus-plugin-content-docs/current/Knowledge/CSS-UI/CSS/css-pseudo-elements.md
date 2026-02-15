---
id: css-pseudo-elements
title: '[Easy] 🏷️ 伪元素 (Pseudo-elements)'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## 什么是伪元素

伪元素 (Pseudo-elements) 是 CSS 的一个关键字，用来选取元素的特定部分或在元素前后插入内容。它们使用**双冒号** `::` 语法（CSS3 标准），以区别于伪类 (pseudo-classes) 的单冒号 `:` 语法。

## 常见的伪元素

### 1. ::before 和 ::after

最常用的伪元素，用于在元素内容的前面或后面插入内容。

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

**特点**：

- 必须包含 `content` 属性（即使是空字符串）
- 预设为 `inline` 元素
- 不会出现在 DOM 中，无法被 JavaScript 选取

### 2. ::first-letter

选取元素的第一个字母，常用于杂志风格的首字放大效果。

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

选取元素的第一行文字。

```css
.intro::first-line {
  font-weight: bold;
  color: #333;
}
```

**注意**：`::first-line` 只能用于块级元素。

### 4. ::selection

自定义用户选取文字时的样式。

```css
::selection {
  background-color: #ffeb3b;
  color: #000;
}

/* Firefox 需要加上前缀 */
::-moz-selection {
  background-color: #ffeb3b;
  color: #000;
}
```

### 5. ::placeholder

自定义表单 placeholder 的样式。

```css
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 0.7;
}
```

### 6. ::marker

自定义列表标记 (list marker) 的样式。

```css
li::marker {
  content: '✓ ';
  color: green;
  font-size: 1.2em;
}
```

### 7. ::backdrop

用于全屏元素（如 `<dialog>` 或全屏视频）的背景遮罩。

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}
```

## 实际应用场景

### 1. 装饰性图标

不需要额外的 HTML 元素，纯 CSS 实现：

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

**使用时机**：不想在 HTML 中加入纯装饰性的元素。

### 2. 清除浮动 (Clearfix)

经典的清除浮动技巧：

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

**使用时机**：父元素内有浮动子元素，需要撑开父元素高度。

### 3. 引号装饰

为引用文字自动添加引号：

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

**使用时机**：美化引用区块，不想手动输入引号。

### 4. 纯 CSS 图形

利用伪元素创建几何图形：

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

**使用时机**：创建箭头、三角形等简单图形，无需图片或 SVG。

### 5. 必填字段标记

为必填表单字段添加红色星号：

```css
.required::after {
  content: ' *';
  color: red;
  font-weight: bold;
}
```

**使用时机**：标示必填字段，保持 HTML 语义清晰。

### 6. 外部链接标示

自动为外部链接添加图标：

```css
a[href^='http']::after {
  content: ' 🔗';
  font-size: 0.8em;
  opacity: 0.6;
}

/* 或使用 icon font */
a[target='_blank']::after {
  content: '\f08e'; /* Font Awesome 外部链接图标 */
  font-family: 'FontAwesome';
  margin-left: 4px;
}
```

**使用时机**：提升用户体验，让用户知道将打开新标签页。

### 7. 计数器编号

使用 CSS 计数器自动编号：

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

**使用时机**：自动产生编号，无需手动维护。

### 8. 遮罩层效果

为图片添加 hover 遮罩：

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

**使用时机**：不想额外增加 HTML 元素来实现遮罩效果。

## 伪元素 vs 伪类

| 特性     | 伪元素 (::)                             | 伪类 (:)                            |
| -------- | --------------------------------------- | ----------------------------------- |
| **语法** | 双冒号 `::before`                       | 单冒号 `:hover`                     |
| **功能** | 创建/选取元素的特定部分                 | 选取元素的特定状态                  |
| **范例** | `::before`, `::after`, `::first-letter` | `:hover`, `:active`, `:nth-child()` |
| **DOM**  | 不存在于 DOM 中                         | 选取实际的 DOM 元素                 |

## 常见陷阱

### 1. content 属性必须存在

`::before` 和 `::after` 必须有 `content` 属性，否则不会显示：

```css
/* ❌ 不会显示 */
.box::before {
  width: 20px;
  height: 20px;
  background: red;
}

/* ✅ 正确 */
.box::before {
  content: ''; /* 即使是空字符串也要加 */
  display: block;
  width: 20px;
  height: 20px;
  background: red;
}
```

### 2. 无法用于替换元素

某些元素（如 `<img>`、`<input>`、`<iframe>`）无法使用 `::before` 和 `::after`：

```css
/* ❌ 无效 */
img::before {
  content: 'Photo:';
}

/* ✅ 改用包裹元素 */
.image-wrapper::before {
  content: 'Photo:';
}
```

### 3. 预设为 inline 元素

`::before` 和 `::after` 预设是 `inline` 元素，设定宽高时要注意：

```css
.box::before {
  content: '';
  display: block; /* 或 inline-block */
  width: 100px;
  height: 100px;
}
```

### 4. z-index 层级问题

伪元素的 `z-index` 是相对于父元素的：

```css
.parent {
  position: relative;
}

.parent::before {
  content: '';
  position: absolute;
  z-index: -1; /* 会在父元素下方，但在父元素的背景上方 */
}
```

### 5. 单冒号的向后兼容

CSS3 规范使用双冒号 `::` 来区分伪元素和伪类，但单冒号 `:` 仍可运作（向后兼容 CSS2）：

```css
/* CSS3 标准写法（建议） */
.box::before {
}

/* CSS2 写法（仍可运作） */
.box:before {
}
```

## 面试重点

1. **伪元素的双冒号语法**：区分伪元素 `::` 和伪类 `:`
2. **content 属性必须存在**：`::before` 和 `::after` 的关键
3. **不在 DOM 中**：无法被 JavaScript 直接选取或操作
4. **无法用于替换元素**：`<img>`、`<input>` 等元素无效
5. **实际应用场景**：装饰性图标、清除浮动、图形绘制等

## Reference

- [Pseudo-elements - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [CSS Pseudo-elements - W3Schools](https://www.w3schools.com/css/css_pseudo_elements.asp)
- [A Whole Bunch of Amazing Stuff Pseudo Elements Can Do](https://css-tricks.com/pseudo-element-roundup/)
