---
id: selector-weight
title: '[Easy] 🏷️ セレクタの優先度'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. How to calculate the weight of a selector ?

> セレクタの優先度をどのように計算するか？

CSS セレクタの優先度判定は、要素が最終的にどのスタイルを採用するかという問題を解決するためのものです。以下の例を参照してください：

```html
<div id="app" class="wrapper">What color ?</div>
```

```css
#app {
  color: blue;
}

.wrapper {
  color: red;
}
```

このケースでは、最終的に青色が表示されます。ここでは ID と class の2つのセレクタが適用されており、ID の優先度は class よりも高いため、class のスタイルが上書きされます。

### Weight Sequence

> inline style > ID > class > tag

HTML コードにおいて、タグ内にインラインスタイルが記述されている場合、デフォルトでその優先度が最も高くなり、CSS ファイル内のスタイルを上書きします。以下の例を参照してください：

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

ただし、一般的な開発では、このような記述方法は使用しません。メンテナンスが難しく、スタイルの汚染問題が発生しやすいためです。

### 特殊なケース

インラインスタイルに遭遇し、それを削除できない場合に、CSS ファイルで上書きしたい場合は、`!important` を使用できます：

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

```css
#app {
  color: blue !important;
}
```

もちろん、可能であれば `!important` の使用もできるだけ避けるべきです。インラインスタイルにも `!important` を追加できますが、個人的にはそのようなスタイルの記述方法は考慮しません。また、特殊なケースを除き、ID セレクタも使用せず、基本的に class でスタイルシート全体を構築します。
