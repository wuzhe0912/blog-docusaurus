---
id: temp-01
title: '🏷️ Temp 01'
slug: /temp-01
---

目前還沒想好分類上如何擺放的題目，先統一存放在 other。

## HTML & CSS

### 1. What's the difference between .jpg, .png, and .webp files ?

#### jpg

採用有損壓縮的方式來儲存圖片，既然為了縮減圖片體積，自然就也就犧牲細節，因此圖片質量會隨之下滑。

#### png

使用無損壓縮，因此在保留最小細節的同時，相對檔案體積也就變大，但好處是可以擁有 jpg 缺少的特性，譬如圖片本身的透明度。

#### webp

2010 年 google 創建的新格式，同時支援無損和有損壓縮，且壓縮的體積和效率都優於前兩者，可以節省儲存空間。兼容性方面，雖然已支援多數瀏覽器，但舊版本則不支援。

#### 應用

考慮到 webp 可以大幅縮減圖片體積同時又能不失真，理論上來說，如果移動端的網頁遊戲，需要大量圖片時，採用這種方案，應該會是不錯的選擇。

### 2. 如何透過 html, css 將兩張圖片進行重疊 ?

- 使用 position 來定位，再結合 z-index 來決定要將哪一張圖片置於上方。
- 早期的備選方案，會使用 float 語法來進行浮動，接著可以透過負邊距的方式推擠。

### 3. 請敘述如何處理切版 ?

- 原生語法，採用 flex 為基底處理，會適當搭配 grid，預處理器的部分則使用 scss 來協助控管樣式變數。
- 框架，依據使用的 js 框架，尋找相應的配套 Library，但目前也會考慮採用市場主流的 TailwindCSS。

## Vue.js

### 1. Ｖ ue 底層原理

Vue2 -> diff 算法 -> Object.defineProperty 實作 setter, getter1
Vue3 -> proxy

### 2. Vue 如何處理跨域問題 ?

本地代理，透過 vue.config.js 設定

```js
module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://www.google.com',
        chageOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
```

Prod 環境下需要設定 nginx，/etc/nginx/nginx.conf，proxy_pass 要設定你要代理的域名，但 nginx 如果 dist folder 沒有和 nginx 放一起的話，可能會遇到許可權的問題跳 403 error，這時候會需要特別去 nginx.conf 設定。

早期的備選方案，使用 JSONP，因為 script 標籤不會被同源阻擋，但這種方式只能處理 `get`，無法處理複雜的情境，出現錯誤時也很難處理與判斷。

### 3. 如何使用 JS 實作 Vue 框架

## Network

### CDN 是什麼 ? 對前端有什麼效能幫助 ?

內容傳遞網路 => 解決 **如何更快地把內容傳遞到網站另一頭的使用者電腦上**

地理位置上，越臨近 client 端的節點，自然反應的速度也就越快，尤其對前端來說，靜態資源可以緩存在鄰近的節點上。

假設網站本身帶有大量圖片，透過 cdn 加速在 render 體驗上也比較好。

靜態資源不需要 cookie，也可以減少 cookie 的消耗。

### XSS 是什麼 ? 如何解決 ?

跨站腳本攻擊，透過輸入表單的欄位，輸入 html 標籤 或 js script 來執行特定語法。

1. 應對這種攻擊的最基本方式，自然是所有表單都要進行驗證，因為要在輸入框打入 script 或 html 都會導致攻擊方的輸入內容很長，透過限制長度或是限制輸入類型，都能一定程度上阻擋攻擊。
2. 從防守方的角度，驗證一些特殊字元．可以或多或少對方的惡意攻擊，但人力畢竟有限，很難完全設想所有情境，因此會透過現代框架已提供的防禦方式，盡可能分攤掉這部分的工。
3. 白名單(CSP)，在 meta 設定專案中要引入的資源來源網址，包含 js, css, image 等等，主要是避免對方直接從 inline 塞 js 進來攻擊。
4. 減輕損害，可以透過設定 httpOnly 避免前端頁面可以透過 `document.cookie` 直接拿到。
5. 一些相對重要的操作，譬如更改密碼可以使用雙重驗證來增加攻擊難度，譬如需提供原密碼或是手機收驗證碼。

## Tools

### 能否使用 webpack ? 請敘述你的使用經驗

基本的 plugin 安裝與 loader 簡單帶過即可。

1. 查看編譯進度，progress-bar-webpack-plugin
2. 打包後的體積分析，webpack-bundle-analyzer
3. webpack-dev-server，hot reload
4. 打包或運行有時候可能會因為錯誤被中斷，透過緩存的方式，可以在重跑時縮短時間 `cache: { type: 'filesystem', }`
5. alias 優化引入的名稱路徑
6. Tree Shaking，除了設定之外，部分引用整個 library 的方式可以透過 es 模式，例如 import `{ throttle } from 'lodash-es'`
7. 透過設定添加 hash 在 prod 環境，當有版更時，內容通常會產生變化ｌｌ，重新生成 hash id，可以讓使用者未察覺的狀況下更新。另外設定 deterministic 可以避免沒改的部分也重新生成 hash，這樣沒有變動的內容仍會維持緩存，增加網站載入速度。
8. 靜態資源先放在 CDN，透過設定 publicPath 去找網址

### 請敘述對 git 的理解，以及所知道的指令

git config => 設定 E-mail, username

本地建立往上推
git init -> git remote add (origin) (git@~.git) git push -u (origin) (master)

遠端建立往下拉
git clone Url
git fetch
git pull

查詢分支
git branch
切換
git checkout

## 已分類至筆記

- [Vue2 的生命週期](./../JS-Frameworks/Lifecycle/vue-lifecycle.md)
- [Vue 組件之間的傳遞資料方式](./../JS-Frameworks/Props/vue-props.md)
- [watch 和 computed 的差異](./../JS-Frameworks/Vue/api.md#4-whats-the-difference-between-computed-and-watch-)
- [在 vuex 中, state, action, mutation 如何互動彼此關係 ?](./../JS-Frameworks/Store/vuex.md)
