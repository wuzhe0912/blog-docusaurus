---
id: element-properties
title: '[Easy] 🏷️ 要素プロパティ'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. What are the inline and block elements ? What's the difference between them ?

> インライン (inline) 要素とブロック (block) 要素とは何か？それらの違いは何か？

### Block Elements

> 以下のインライン要素とブロック要素は、よく使われるタグのみを記載しています。あまり使われないタグは必要に応じて調べてください

ブロックレベル要素はデフォルトで1行を占有するため、複数のブロック要素がある場合、CSS でレイアウトを指定していない状態では、デフォルトで上から下に垂直に並びます。ブロック要素は `<body></body>` 内にのみ記述できます。

#### よく使われるブロック要素のリスト

div, article, aside, footer, header, footer, main, nav, section, ul, li, ol, video, form.

### Inline Elements

インライン要素は行全体を占有しないため、複数のインライン要素が隣接している場合、水平に並びます。ブロック要素はインライン要素内に配置できず、データの表示にのみ使用できます。ただし、`CSS` を使用してインライン要素の属性を変更することは可能で、例えば `span` に `display : block;` を追加できます。

#### よく使われるインライン要素のリスト

a, br, button, br, code, img, input, span, strong, svg, textarea, label.

### inline-block

display には `inline-block` という属性があり、ブロック要素をインライン要素に変換しつつ、ブロック要素の特性（幅と高さの設定、margin、padding など）を保持できます。つまり、この要素はレイアウト上ではインライン要素のように水平に並びますが、block 属性を使用して他の要素を押しのけるレイアウト効果を実現できます。

### Reference

- [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
- [Block-level elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
- [CSS 教学 - display:inline、block、inline-block の違いについて](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)

## 2. What does `* { box-sizing: border-box; }` do?
