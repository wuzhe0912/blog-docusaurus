---
id: collection
title: ⚔️ Collection
slug: /collection
---

> 種一棵樹最好的時間是十年前，其次則是現在。
>
> <!-- > _The best time to plant a tree was 20 years ago. The second best time is now._ -->

## ⚙️ CSS World

- [ ] `CSS` 有那些選擇器 ?
- [x] [`CSS` 的優先級別是如何判斷的 ?](./CSS-World/select-weight.md)
- [ ] 能否提出 `CSS` 的樣式隔離方法 ?
- [x] [行內元素和塊級元素有哪些 ? 它們的區別又是什麼 ?](./CSS-World/inline-block.md)
- [x] [`CSS3` 有哪些新特性 ?](./CSS-World/css3-features.md)
- [ ] 層疊上下文是什麼 ?

### 🛠️ Layout

- [x] [請說明盒子模型。](./CSS-World/Layout/box-model.md)
- [ ] 請說明什麼是 `BFC` ? 有什麼作用 ? 如何形成 ?
- [ ] 浮動元素會造成什麼影響 ? 如何清除浮動 ?
- [x] [`CSS` 中 `position` 有哪些值 ? 作用分別是什麼 ?](./CSS-World/Layout/position.md)
- [ ] 能否提出 `flex` 排版有什麼優點 ?
- [ ] 請實作一個雙飛翼佈局。
- [ ] 請實作一個聖杯佈局。
- [ ] 請嘗試提出各種讓 `div` 置中的解法。

## ⚙️ JS Basics

- [x] [What is `DOM tree` ?](./JS-Basics/DOM.md)
- [x] [Why `0.1 + 0.2 !== 0.3` ?](./JS-Basics/decimal-points.md)
- [ ] `apply` 和 `call` 的作用與區別 ?
- [ ] 請解釋什麼是 `Prototype Chain(原型鏈)` ?
- [ ] 請解釋 `instance` 原理。
- [ ] 請解釋什麼是事件模型 ?
- [ ] 試說明 `generator` 的原理。
- [ ] 請解釋渲染合成層是什麼 ?
- [ ] `new` 運算符具體做了什麼事情 ?
- [ ] 請解釋事件循環機制。
- [ ] `uglify` 原理是什麼 ?
- [ ] 什麼情境下會需要使用策略模式 ?
- [ ] `history` 和 `hash` 兩種路由方式最大的區別是什麼 ?
- [ ] 適配器和外觀模式的區別 ?
- [ ] 請實作一個 `trim` 方法。

### 🛠️ Variable Related

1. [x] [What's `variable scope(變數作用域)` ?](./JS-Basics/variable-scope.md)
2. [x] [What's `Closures(閉包)` ?](./JS-Basics/closures.md)
3. [ ] What's `Hoisting(變量提升)` ?

### 🛠️ IIFE

1. [x] [What's `IIFE(立即執行函式)` ?](./JS-Basics/IIFE.md)

### 🛠️ Function

- [ ] 請實作 `add(1)(2)(3)` (柯里化)。
- [ ] 如何用 `ES5` 語法實作繼承 ?
- [ ] 請實作 `bind` 的功能。

## ⚙️ Asynchronous

- [ ] 請實作一個 `promise`。

## ⚙️ Network

- [x] [請說明三次握手的過程。](./Network/three-way-handshake.md)
- [ ] 承上題，請說明從輸入網址到渲染畫面這段過程中，經歷了那些事情 ?
- [ ] `http 2.0` 做了那些改進 ?
- [ ] 承上題，`http 2.0` 有哪些不足 ? `http 3.0` 則又是什麼 ?
- [ ] 請說明 `https` 的加密過程是如何運作的 ?

### 🛠️ WebSocket

- [ ] 請嘗試說明 `WebSocket` 建立連線的過程。

## ⚙️ Browser

- [ ] [Please explain the process of rendering the page by browser.](./Browser/render-page.md)
- [x] [What are `reflow(重排)` and `repaint(重繪)` ? What's the difference ?](./Browser/reflow-repaint.md)
- [ ] 請解釋瀏覽器的緩存策略是如何運作的 ?
- [ ] 如何檢查內存是否洩漏 ?
- [ ] 請問 `TCP` 滑動視窗是什麼 ?
- [ ] 請解釋 `TCP` 重試機制 ?
- [ ] 請說明你所知道的瀏覽器架構。
- [ ] 請說明 `V8` 引擎的垃圾回收機制。

## ⚙️ Vue.js

- [ ] `Vue` 的資料綁定機制是如何實現的 ? 在 `2.0` 版本和 `3.0` 版本又有怎樣的差異 ?
- [ ] `nextTick` 是如何實現的 ?
- [ ] 請試說明 `computed` 和 `watch` 的差異 ?
- [ ] `keep-alive` 是什麼 ? 如何實作的 ?

## ⚙️ React

- [ ] 請舉例解釋什麼是 `HOC(高階組件)` ?
- [ ] `React` 的合成事件是什麼 ? 與原生事件的差別 ?
- [ ] `React` 中為什麼需要合成事件 ?
- [ ] 為什麼有時候 `React` 兩次 `setState` 只執行一次 ?
- [ ] `React` 如何處理異常狀態 ?
- [ ] `React` 為何需要 `fiber` ? 它有哪些優點 ?
- [ ] 承上題，它是如何實現的 ?
- [ ] `React` 有哪些性能優化的點 ?

### 🛠️ Redux

- [ ] `Redux` 有哪些規則 ?
- [ ] 請試說明 `Redux` 的中間機制如何運作 ?

## ⚙️ Engineering

- [ ] 試說明前端模組化的機制有哪些 ? 如何應用 ?
- [ ] `babel`是什麼 ? 它如何做到轉譯的 ?
- [ ] 請解釋 `Webpack` 的 `loader` 機制如何運作 ?
- [ ] 是否有寫過 `Webpack` 的插件 ?
- [ ] `tree shaking` 是什麼 ? 有什麼功用 ? 其原理又是什麼 ?
- [ ] 請解釋 `Webpack` 的工作流程是如何運作的 ?

## ⚙️ Tools

## ⚙️ Performance Optimization

- [ ] 請實作節流函式。
- [ ] 請實作防抖函式。
- [ ]
- [ ] 如何減少白屏時間 ?
- [ ] 請試說明前端性能優化指標(RAIL)。
- [ ] 承上題，你能提出哪些前端性能優化的方法 ?
- [ ] 承前，是否有具體應用在此前的工作專案中，試說明。
- [ ] 從 `CSS` 的角度出發，能做到那些相關的性能優化 ?
- [ ] 網站首頁預期會有大量圖片，導致載入速度緩慢，該如何優化 ?
- [ ] 動畫效能如何優化 ?

## ⚙️ Design Patterns

- [ ] 實作一個發佈訂閱模式。

## ⚙️ LeetCode

- [ ] 判斷鏈表是否有環 ?
- [ ] 求解平方根(二分查找求解平方根)。
- [ ] 實作一個斐波那契數列。
- [ ] 爬樓梯問題。
- [ ] 層次遍歷二元樹。
- [ ] 合併二維有序數組成一個有序數組。
- [ ] 找出數組中和為 `sum` 的 `n` 個數。
- [ ] 判斷括號字符串是否有效。
- [ ] 數組去重。

## ⚙️ Backend

- [ ] 進程和線程的區別 ?
- [ ] 請嘗試提出進程通信有哪些方式 ?

### 🛠️ Node.js

- [ ] 請試說明 `node` 的模塊機制。
- [ ] `require` 的功用是什麼 ? 具體怎麼做 ?
- [ ] `node` 的事件循環機制和瀏覽器有哪些不同 ?
- [ ] 請試說明 `cluster` 的原理。
- [ ] 請試說明 `pipe` 的原理。
- [ ] `node` 是如何處理異常錯誤狀況 ?

## ⚙️ Other

- [ ] 聊聊近期閱讀了那些書籍 ? 有什麼心得 ?
- [ ] 平常會使用那些途徑自學 ?
- [ ] 你比較擅長是哪一部分 ? 不足的地方又是哪裡 ?
- [ ] 重構的手段有哪些 ?

## Reference

- [前端工程師一定要會的 JS 觀念題-中英對照之上篇](https://medium.com/starbugs/%E9%9D%A2%E8%A9%A6-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%AB%E4%B8%80%E5%AE%9A%E8%A6%81%E6%9C%83%E7%9A%84-js-%E8%A7%80%E5%BF%B5%E9%A1%8C-%E4%B8%AD%E8%8B%B1%E5%B0%8D%E7%85%A7%E4%B9%8B%E4%B8%8A%E7%AF%87-3b0a3feda14f)
- [前端工程師一定要會的 JS 觀念題-中英對照之下篇](https://medium.com/starbugs/%E9%9D%A2%E8%A9%A6-%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%AB%E4%B8%80%E5%AE%9A%E8%A6%81%E6%9C%83%E7%9A%84-js-%E8%A7%80%E5%BF%B5%E9%A1%8C-%E4%B8%AD%E8%8B%B1%E5%B0%8D%E7%85%A7%E4%B9%8B%E4%B8%8B%E7%AF%87-fd46292e374b)