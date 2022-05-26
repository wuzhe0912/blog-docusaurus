---
id: reflow-repaint
title: '📜 Reflow & Repaint'
slug: /reflow-repaint
---

> Questions

## 回流 / 重排(reflow)

> 泛指網頁中的 DOM 產生變化，導致瀏覽器需要重新計算元素的位置，將其擺放到正確位置，比較白話來說，就是 Layout 要重新產生排列元素。

### 觸發回流

> 回流存在兩種情境，一種是全域整個頁面都出現變化，另一則是部分 component 區塊產生變化。

- 初始進入頁面時，是影響最大的一次回流
- 添加或刪除 DOM 元素。
- 針對元素改變它的尺寸大小，譬如內文增加，或是文字大小變化等等。
- 元素的排版方式調整，譬如透過 margin 或 padding 來調整移動。
- 瀏覽器本身的視窗大小出現變化。
- 觸發偽類，例如 hover 效果。

## 重繪(repaint)

> 沒有改變 Layout，單純更新或改變元素，因為元素本身是內含在 Layout 中，所以如果觸發回流必然會導致重繪，反之，僅觸發重繪則不一定會回流。

### 觸發重繪

- 改變元素的顏色或背景，譬如添加 color 或是調整 background 的屬性等等。
- 改變元素的陰影或是 border 也屬於重繪。

## 優化回流或重繪的做法

- 不要使用 table 排版，table 的屬性容易因為改動屬性，而導致排版會重新排列，若不得已需要使用的話，建議添加以下屬性，使其每次僅渲染一行，避免影響整個表單範圍 :

```css
table-layout: auto;
# or
table-layout: fixed;
```

- 盡可能在較低層級的 DOM 節點上來改動樣式，避免因為觸發父元素樣式變動，導致其下所有子元素全部被影響。
- 不應該操作 DOM 去逐一調整樣式，而是應該將需要改變的樣式透過 class 定義好之後，再透過 JS 進行切換。

```js
// bad
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// good
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

- 如果需要執行動畫，可以在絕對定位的元素(absolute, fixed)上使用，這樣對其他元素影響不大，僅會觸發重繪，可以避免回流。
- 透過使用 CSS3 的部分屬性，可以觸發 client 端的硬體加速，可以提升動畫的效能。
  - `transform`, `opacity`, `filters`, `Will-change`。

## Reference

- [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
- [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)
