---
id: frontend-bundler
title: 📄 Bundler
slug: /frontend-bundler
---

## Why is a bundler necessary for front-end development? What is its primary function?

> 為什麼前端開發需要 bundler ? 它主要的作用是什麼？

### module & plugin management

過往在沒有前端打包工具前，我們會使用 CDN 或 `<script>` 標籤來載入我們的檔案(可能包含 js, css, html)，但這樣的做法除了效能上的浪費(http 可能需要請求多次)，同時也容易出現因為順序上的差異，導致錯誤頻發或是難以排除。而 bundler 會協助開發者將多個檔案合併為單一或少數幾個檔案，這種模組化的管理，除了讓開發上更易維護外，同時在未來的擴充上也更加方便。另一方面，因為檔案的合併也同時減少 http 的請求次數，自然也提升效能。

### translation & compatibility

瀏覽器廠商在實作上，不太可能完全跟上新語法的發佈，而新舊語法的差異可能會導致實作上的錯誤，為了更好兼容兩者的差異，我們需要透過 bundler 來將新語法轉換為舊語法，以確保程式碼能夠正常運作。典型的案例就是 babel 會將 ES6+ 的語法轉換為 ES5 的語法。

### Resource Optimization

為了有效減輕專案本身的體積，提升效能優化，透過設定 bundler 進行處理是目前主流的做法：

- Minification(最小化, 醜化)：壓縮 JavaScript、CSS 和 HTML 代碼，刪除不必要的空格、註釋和縮排，以減少檔案大小(畢竟是給機器閱讀而非給人閱讀)。
- Tree Shaking：去除未被使用或無法訪問的代碼，進一步減少 bundle 的大小。
- Code Splitting：將代碼分割成多個小塊（chunks）實現按需載入，盡可能提升頁面載入速度。
- Lazy Loading：延遲載入，當使用者需要時才載入，減少初始載入時間(同樣都是為了使用體驗)。
- 長期 caching：將 bundle 的內容 hash 化，並將其加入檔名中，這樣只要 bundle 的內容沒有改變，就可以永久使用瀏覽器快取，減少請求次數。同時也能達到每次上版時，只變動有變化的檔案，而不是全部重新載入。

### Deploy Environment

在實務上的部屬，會拆分開發, 測試, 正式等環境，為了確保行為是一致的，通常會透過 bundler 來進行設定，促使在對應的環境下，能夠正確的載入。
