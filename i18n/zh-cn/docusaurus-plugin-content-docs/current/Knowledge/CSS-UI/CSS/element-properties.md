---
id: element-properties
title: '[Easy] 🏷️ 元素属性'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. What are the inline and block elements ? What's the difference between them ?

> 什么是行内（inline）和块级（block）元素？它们之间有什么区别？

### Block Elements

> 以下行内或块级元素，仅列出较常用的标签，冷门标签有使用需求才做查询

块级元素预设占用一行，因此若有数个块级元素，在尚未使用 CSS 排版的前提下，预设会由上而下垂直排列。块级元素仅能写在 `<body></body>` 中。

#### 常用块级元素列表

div, article, aside, footer, header, footer, main, nav, section, ul, li, ol, video, form.

### Inline Elements

行内元素不会占用整行，因此若有数个行内元素相邻时，会呈现水平排列。块级元素不能放置于行内元素中，仅能用来呈现数据。但可以通过 `CSS` 来改变行内元素的属性，譬如将 `span` 加入 `display : block;`

#### 常用行内元素列表

a, br, button, br, code, img, input, span, strong, svg, textarea, label.

### inline-block

在 display 中有一种 `inline-block` 的属性，可以将块级元素转换成行内元素，但是仍保有块级元素的特性，例如可以设定宽高、margin、padding 等属性。意味着这个元素在排版上，会像行内元素一样水平排列，但又能用 block 属性来达到推开其他元素的排版效果。

### Reference

- [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
- [Block-level elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
- [CSS 教学-关于 display:inline、block、inline-block 的差别](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)

## 2. What does `* { box-sizing: border-box; }` do?
