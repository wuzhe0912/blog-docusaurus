---
id: element-properties
title: '[Easy] 🏷️ Element Properties'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. What are the inline and block elements ? What's the difference between them ?

> 什麼是行內（inline）和區塊（block）元素？它們之間有什麼區別？

### Block Elements

> 以下行內或區塊元素，僅列出較常用的標籤，冷門標籤有使用需求才做查詢

區塊級元素預設占用一行，因此若有數個區塊元素，在尚未使用 CSS 排版的前提下，預設會由上而下垂直排列。區塊元素僅能寫在 `<body></body>` 中。

#### 常用區塊元素列表

div, article, aside, footer, header, footer, main, nav, section, ul, li, ol, video, form.

### Inline Elements

行內元素不會占用整行，因此若有數個行內元素相鄰時，會呈現水平排列。區塊元素不能置放於行內元素中，僅能用來呈現資料或數據。但可以透過 `CSS` 來改變行內元素的屬性，譬如將 `span` 加入 `display : block;`

#### 常用行內元素列表

a, br, button, br, code, img, input, span, strong, svg, textarea, label.

### inline-block

在 display 中有一種 `inline-block` 的屬性，可以將區塊元素轉換成行內元素，但是仍保有區塊元素的特性，例如可以設定寬高、margin、padding 等屬性。意味著這個元素在排版上，會像行內元素一樣水平排列，但又能 block 屬性來達到推開其他元素的排版效果。

### Reference

- [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
- [Block-level elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
- [CSS 教學-關於 display:inline、block、inline-block 的差別](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)

## 2. What does `* { box-sizing: border-box; }` do?

