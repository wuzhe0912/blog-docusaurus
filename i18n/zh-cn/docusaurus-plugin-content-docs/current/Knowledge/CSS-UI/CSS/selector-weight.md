---
id: selector-weight
title: '[Easy] 🏷️ 选择器权重'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. How to calculate the weight of a selector ?

> 如何计算选择器的权重 ?

CSS 选择器的优先级别判断，是为了解决元素最终采用哪一个样式的问题，如下 :

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

这个案例中，最终会出现蓝色，因为这边应用了 ID 和 class 两个选择器，而 ID 的权重大于 class，因此 class 的样式会被覆盖。

### Weight Sequence

> inline style > ID > class > tag

如果一段 HTML 的程序中，在标签内写有行内样式，那预设他的权重会最大，盖过 css 文件中的样式，如下 :

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

但一般开发中，不会使用这种撰写方式，因为既不易维护，同时也容易产生污染样式的问题。

### 特例

如果真的遇到行内样式，且无法移除，希望能通过 css 文件来覆盖，可以采用 `!important` :

```html
<div id="app" class="wrapper" style="color: #f00">What color ?</div>
```

```css
#app {
  color: blue !important;
}
```

当然，如果可以的话，也是尽可能不要使用 `!important`。虽然行内样式同样也能添加 `!important`，但个人是不考虑这样的样式撰写方式。同时，除非有特例情境，否则也不采用 ID 选择器，基本以 class 来构建整个样式表。
