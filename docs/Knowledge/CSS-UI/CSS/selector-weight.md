---
id: selector-weight
title: '[Easy] 🏷️ Selector Weight'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. How to calculate the weight of a selector ?

> 如何計算選擇器的權重 ?

CSS 選擇器的優先級別判斷，是為了解決元素最終採用哪一個樣式的問題，如下 :

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

這個案例中，最終會出現藍色，因為這邊應用了 ID 和 class 兩個選擇器，而 ID 的權重大於 class，因此 class 的樣式會被覆蓋。

### Weight Sequence

> inline style > ID > class > tag

如果一段 HTML 的程式中，在標籤內寫有行內樣式，那預設他的權重會最大，蓋過 css 文件中的樣式，如下 :

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

但一般開發中，不會使用這種撰寫方式，因為既不易維護，同時也容易產生污染樣式的問題。

### 特例

如果真的遇到行內樣式，且無法移除，希望能透過 css 文件來覆蓋，可以採用 `!important` :

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

```css
#app {
  color: blue !important;
}
```

當然，如果可以的話，也是盡可能不要使用 `!important`。雖然行內樣式同樣也能添加 `!important`，但個人是不考慮這樣的樣式撰寫方式。同時，除非有特例情境，否則也不採用 ID 選擇器，基本以 class 來構建整個樣式表。

