---
id: vue-router
title: '🏷️ Vue Router'
slug: /vue-router
---

### 1. Which api are commonly used ?

- `router-link`：本質上是 a 標籤，在 template 中使用這個方式，`router-link(:to="/pathname")`。
- `router.push()`：主要透過 function 來執行跳轉到對應頁面，同時也可以在其中的 query 埋下參數，方便跳轉後的頁面直接使用。
- `router.go()`：根據填入的參數，決定前進後退，譬如`router.go(-1)`就是回到上一頁。
- `router.replace()`：雖然同樣是跳轉到指定 url，但這個 api 不會在 history 留下紀錄，因此點擊瀏覽器上一頁時，會跳轉到上上一個頁面，而非上一頁。

### 2. How does Vue Router achieve the SPA effect ?

SPA 頁面的重點就在於由前端來模擬路由，讓使用者看似在切換頁面，實際上只是切換組件。

而 Vue Router 就是透過`router-view`的方法來包裝顯示組件，再透過`router-link`或是`router.push()`等方法來進出頁面。看起來雖然像是從 A 頁面進入 B 頁面，但實際上卻是將 A 組件改為顯示 B 組件。

### 3. What’s the difference between route and router ?

#### route

本身是一個物件，這個物件內容包含了路由本身的所有資訊，諸如 name、meta、path、query，所以可以印出參數或是路徑，可以透過進入這個頁面時拿到資料參數，甚至可以透過參數來決定是否觸發 function。

#### router

在 Vue Router 中，是插件提供的 api，可以透過呼叫 api 來決定要做什麼事情，譬如`router.push()`前往某個頁面，`router.go()`選擇前進或後退，`router.replace()`替換目前的頁面。

### 4. How many modes ?

主要是`hash`和`history`，還有一種`abstract`模式，主要使用在 node.js，當發現環境沒有瀏覽器支援時，會被強制切換到這個模式，所以總共是 3 種模式。

### 5. What’s the difference between hash mode and history mode ?

當設置 hash 模式時，網址會多出一個 #，而 history 則沒有，從畫面上來看，設置 history 比較合理，畢竟除了網址比較美化外，對 SEO 也有影響，但設置 history 模式需要後端配合設定`url rewrite`，具體的設定方式附在[官網 HTML5 History Mode](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)，換言之，如果後端不願意配合，那就只能退而求其次使用 hash 模式。

當後端沒有配合設置的狀況下，為什麼使用 hash 模式可行？因為網址列中的 #，在它後面的內容不會經過 server 端，單純只會在 client 處理，因此不受影響。

#### Usage

倘若專案本身是用來搭建後台 CMS，其實 hash 模式亦不受影響，因為網址美醜不影響使用者。反之，如果今天是產品網頁，會面向一般使用者，則需要配合使用 history 模式。

### 6. What's the Navigation Guards ?

- `router.beforeEach`：常見的用法，譬如檢查目前前往的頁面是否需要登入狀態，若是已登入帶有 token，則正常進入`next()`，反之則退到指定頁面，譬如 login page。

- `beforeEnter`：在特定的 route 內，依照需求決定是否要觸發 function，或前往指定的頁面。

<!-- ### 7. How many Navigation Guards ?

- `router.beforeEach`：註冊在全域的`router`檢測，`to`代表要前往的`router`，`from`則是來自哪裡？`next`選擇調用的方法，常見是選擇前往某頁面或是選擇中斷。
- `router.beforeEnter`：參數同`router.beforeEach`相同，但使用在單一的`router`內。
- 下述守衛則較少使用：
  - `router.beforeResolve`
  - `router.beforeRouteEnter`
  - `router.beforeRouteUpdate`
  - `router.beforeRouteLeave` -->
