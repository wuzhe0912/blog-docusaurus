---
id: 04-float
title: '📜 Float'
slug: /float
---

## Intro

> 目前筆者的排版方式皆已採用 flex or grid，float 僅用於記錄可能的 css 面試考題。

浮動元素是早期用於排版的屬性，一但設置 `float` 屬性，就會讓元素脫離 `normal flow`，跑到前一個元素旁邊，因此多用於文字環繞圖片的效果。

### 左右浮動

一但使用浮動後，可以設置 `left` 或 `right` 屬性，讓其跑到網頁的左側或右側，但缺點就是可能會蓋掉原本位置的元素，另外使用當浮動元素碰到另一個浮動元素時，並不會覆蓋掉，所以可以形成水平排列效果。

### 父元素高度坍塌

因為脫離文檔流，所以原本子元素的高度可以撐開父元素，也因此而失效，進而造成父元素缺少相應高度。