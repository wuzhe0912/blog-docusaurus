---
id: box-model
title: '📜 Box Model'
slug: /box-model
---

## Default

`Box Model` 在 `CSS` 當中是被用來討論如何設計佈局的術語。他本身可以理解為一個包裹 `HTML` 元素的盒子，中間有四個主要的屬性 :

- content : 主要用於顯示元素的內容，譬如文字。
- padding : 元素的內容和元素邊界的距離
- margin : 元素對外其他元素的距離
- border : 元素本身的邊線

## box-sizing

決定 `Box Model` 使用的類型，會透過 `box-sizing` 這個語法。

意思是指，當元素計算寬度和高度時，`padding`, `border` 這兩個屬性是採用對內填充還是對外擴充。

其預設值為 `content-box`，採用對外擴充，在這個條件下，除了元素自己的寬高外，額外的 `padding`, `border` 都要加入計算。如下 :

```css
div {
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

這個 `div` 的寬度計算是 `100px(width)` + `20px(左右 padding)` + `2px(左右 border)` = `122px`。

## border-box

顯然這種方式並不可靠，會使前端開發時被迫需要一直計算寬高，為了改善開發體驗，需要改採另一模式。

如下，在初始化時將 `box-sizing` 的值設為 `border-box` :

```css
* {
  box-sizing: border-box; // global style
}
```

如此一來，就會改採對內填充的形式，元素的寬高設計更為直覺，不必為了 `padding` 或 `border` 去增減數字。

## Reference

- [The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [學習 CSS 版面配置](https://zh-tw.learnlayout.com/box-sizing.html)
- [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
