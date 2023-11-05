---
id: web-browsing-process
title: 📄 Web Browsing Process
slug: /web-browsing-process
---

## 1. Please explain how the browser obtains HTML from the server and how the browser renders the HTML on the screen

> 請說明瀏覽器如何從 server 端取得 HTML，並如何在瀏覽器上渲染 HTML

### 1. 發起請求

- **網址輸入**：使用者在瀏覽器上輸入網址，或是點擊一個連結，瀏覽器會開始解析這串 URL，確認要向哪個伺服器發起請求。
- **DNS 查找**：瀏覽器開始執行查找 DNS，以及對應的伺服器 IP 地址。
- **建立連結**：瀏覽器透過網際網路使用 HTTP 或 HTTPS 協議，向伺服器的 IP 地址發出請求，同時如果是 HTTPS 協議，還需要進行 SSL/TLS 連接。

### 2. Server 端響應

- **處理請求**：伺服器接收到請求後，會根據請求的路徑與參數，從資料庫中讀取對應的資料數據。
- **發送 Response**：接著會將 HTML 文件作為 HTTP Response 的一部分發送回瀏覽器，Response 本身還會包含諸如狀態碼或其他參數(cors, content-type)等。

### 3. 解析 HTML

- **構建 DOM Tree**：瀏覽器開始讀取 HTML 文件，並根據 HTML 文件的標籤與屬性，轉換成 DOM 並開始在記憶體中構建 DOM Tree。
- **requesting subresources(請求子資源)**：解析 HTML 文件時，如果遇到外部資源，例如 CSS、JavaScript、圖片等，瀏覽器會進一步向伺服器發起請求，獲取這些資料。

### 4. Render Page(渲染頁面)

- **構建 CSSOM Tree**：瀏覽器開始解析 CSS 文件，構建 CSSOM Tree。
- **Render Tree**：瀏覽器將 DOM Tree 和 CSSOM Tree 合併成一個 Render Tree，包含所有要渲染的節點與對應樣式。
- **Layout(佈局)**：瀏覽器開始進行版面設定(Layout 或 Reflow)，計算每個節點的位置與大小。
- **Paint(繪製)**：最後瀏覽器經過繪製(painting)階段，將每個節點的內容畫到頁面上。

### 5. JavaScript 交互

- **執行 JavaScript**：如果 HTML 中包含有 JavaScript，則瀏覽器會解析並執行，這個動作可能會改變 DOM 和修改樣式。

整個流程上是一種漸進的狀態，理論上，使用者會會先看到部分網頁內容，最後才看到完整的網頁，這個過程中，可能會觸發多次回流與重繪，尤其是網頁本身包含複雜的樣式或是交互效果尤為明顯。這時除了瀏覽器本身執行的優化外，開發者通常也會盡可能採用一些手段，讓使用體驗更為平滑。

## 2. Please describe Reflow and Repaint

### Reflow(回流/重排)

泛指網頁中的 DOM 產生變化，導致瀏覽器需要重新計算元素的位置，將其擺放到正確位置，比較白話來說，就是 Layout 要重新產生排列元素。

#### 觸發 Reflow

回流存在兩種情境，一種是全域整個頁面都出現變化，另一，則是部分 component 區塊產生變化。

- 初始進入頁面時，是影響最大的一次回流
- 添加或刪除 DOM 元素。
- 針對元素改變它的尺寸大小，譬如內文增加，或是文字大小變化等等。
- 元素的排版方式調整，譬如透過 margin 或 padding 來調整移動。
- 瀏覽器本身的視窗大小出現變化。
- 觸發偽類，例如 hover 效果。

### Repaint(重繪)

沒有改變 Layout，單純更新或改變元素，因為元素本身是內含在 Layout 中，所以如果觸發回流必然會導致重繪，反之，僅觸發重繪則不一定會回流。

#### 觸發 Repaint

- 改變元素的顏色或背景，譬如添加 color 或是調整 background 的屬性等等。
- 改變元素的陰影或是 border 也屬於重繪。

### 如何優化 Reflow 或 Repaint

- 不要使用 table 排版，table 的屬性容易因為改動屬性，而導致排版會重新排列，若不得已需要使用的話，建議添加以下屬性，使其每次僅渲染一行，避免影響整個表單範圍，例如 `table-layout: auto;` or `table-layout: fixed;`。
- 不應該操作 DOM 去逐一調整樣式，而是應該將需要改變的樣式透過 class 定義好之後，再透過 JS 進行切換。
  - 以 Vue 框架為例，可以用綁定 class 的方式來切換樣式，而不是用 function 來直接修改樣式。
- 如果是一個需要頻繁切換的場景，譬如 tab 切換，應該優先考慮使用 `v-show` 而非 `v-if`，前者僅使用 css 的 `display: none;` 屬性來做隱藏，而後者卻會觸發生命週期，重新創建或銷毀元素，自然會有更大的性能消耗。
- 如果真的不得已需要觸發回流，可以透過 `requestAnimationFrame` 來進行優化(主要是因為這個 api 有針對動畫來設計，可以和瀏覽器繪製的帧數同步)，這樣可以將多次回流合併成一次，減少重繪的次數。
  - 譬如某個動畫，需要在頁面上向目標移動，這邊就可以透過 `requestAnimationFrame` 來計算每一次移動。
  - 同樣的，CSS3 的部分屬性，可以觸發 client 端的硬體加速，可以提升動畫的效能，例如 `transform` `opacity` `filters` `Will-change`。
- 如果條件允許，盡可能在較低層級的 DOM 節點上來改動樣式，避免因為觸發父元素樣式變動，導致其下所有子元素全部被影響。
- 如果需要執行動畫，可以在絕對定位的元素 `absolute` , `fixed` 上使用，這樣對其他元素影響不大，僅會觸發重繪，可以避免回流。

### Example

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

### Reference

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
- [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)
