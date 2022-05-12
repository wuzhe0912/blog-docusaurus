---
id: render-page
title: '📜 Process of rendering page'
slug: /render-page
---

## 結構

browser 構建頁面的動作流程，就如同真實世界中構建房屋的類似觀念。搭建房子之前，需要打地基建立梁柱骨架，網頁也是同理，需要先向 server 端請求 HTML file，但此時拿到的 HTML file 只是由字節所組成，需要轉譯成字符，即一般開發者能閱讀的 HTML 程式碼。

但開發者能閱讀的程式碼，對機器而言卻無法理解，所以瀏覽器會透過一種 token 化的形式，先將字符轉成 token 再轉為節點，一旦轉換成節點後，就可以構建 DOM 結構，即我們所熟知的 DOM Tree。

```javascript
(字節) => (字符) => (Token) => (節點) => DOM;
```

## Style

房屋在興建的過程中，不可避免要在牆體添上水泥，或者準備管線等等，這些進一步的裝潢修繕動作，在網頁端就可以理解為添加樣式。

瀏覽器在構建 DOM 的同時，也會讀取 link，而這一步就會向 server 端請求 css 相關文件。這個 css 文件的轉換流程和 HTML 雷同。

```javascript
(字節) => (字符) => (Token) => (節點) => CSSOM;
```

## Render Tree

當瀏覽器將 DOM 和 CSSOM 進行合併後，就會產生出 Render Tree(渲染樹)，這個合併的歷程中，完成了下面幾件事

1. 遍歷 DOM Tree 的每個可見的 node(link, meta 之類的標籤，屬於不可見的節點，因此轉譯的過程會被省略)，另外就是如果該節點的 CSS 規則設定隱藏的話，也不會被顯示。
2. 每個可見的 node 都會找到相符的 CSSOM 規則，並套上樣式。
3. 送出所有可見的 node，包含其內容與計算後的樣式。

## Layout

隨著 Render Tree 的完成，瀏覽器接下來需要考慮整個頁面如何排版，就如同房屋需要考慮幾房的佈局，以及使用多少的水泥與磚頭等等。在排列 Layout 的過程中，除了會考慮節點的大小，也要根據 Box Model 來處理，每一個 element 都可以視為一個 box，每個 box 在進行排列和嵌套，同時，佈局排列完成後，瀏覽器就會開始進行繪製。

## Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="stylesheet" href="style.css" />
    <script src="index.js"></script>
    <title>Document</title>
  </head>
  <body></body>
</html>
```

執行過程 =>

1. browser 請求 html 文件，server 回傳 html 文件，browser 開始構建 DOM
2. 在解析到 link 標籤時，請求 css 文件，server 回傳 css 文件，準備構建 CSSOM
3. 接著解析

## Reference

- [Render-tree Construction, Layout, and Paint](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn)
