---
id: browser-dom
title: 📄 DOM
slug: /browser-dom
---

## 1. Please explain the process of generating the DOM tree on the web page

> 請說明瀏覽器如何生成 DOM Tree

1. DOM Tree：browser 向 server 端請求 HTML file，但此時拿到的 HTML file，根據接受到 HTML 進行解析，並轉換成 DOM Tree。
2. CSSOM tree：解析生成完 DOM tree 後，browser 會開始解析 CSS file，並與 DOM tree 一起轉換成 CSSOM tree。
3. Render Tree：前兩者建立後，browser 會將兩者合併成一個 Render Tree。
4. Layout(佈局)：擁有 Render Tree 後，browser 就可以開始計算每個節點的佈局。
5. Paint(繪製)：根據 Render Tree 和 Layout，browser 就可以開始繪製頁面。
6. 最終渲染完成，網頁會在瀏覽器上呈現。
