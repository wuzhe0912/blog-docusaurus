---
id: lifecycle-basic
title: '☕ Basic'
slug: /lifecycle-basic
---

## ⚙️ Vue

### 1. Please explain the lifecycle of Vue.js (2.x)

主要分為四個階段

#### beforeCreate & created

- beforeCreated：剛完成初始化，資料在這一階段還未產生，一般而言，不會在這階段操作資料。
- created：這個階段已完成資料初始化，因此 data 內的值已經可以調用，另外，如果有需要，也可以在這個階段呼叫 api。

#### beforeMount & mounted

- beforeMount：這個階段處於資料渲染之前，template 還未掛載到 DOM 元素上。
- mounted：tmeplate 已經掛載到 DOM 元素上，如果有需要操作 DOM 元素，這個階段是可以執行的，同時，call api 的 function 常見於此處。

#### beforeUpdate & updated

這個階段是透過資料的更新，來達到重新渲染 DOM 的目的，舉例來說，當我透過 `@click` 事件去執行函式時，資料的狀態可能會由 true -> false 或者相反，但這種狀態切換時，可能有些綁定 `v-bind` 的 class 就會新增或移除，而這個變化的過程中，除了樣式改變同時也意味著頁面被重新繪製。

#### beforeDestroy & destroyed

處於生命週期的尾聲，用於銷毀元件，常見的案例即 `v-if`，操作邏輯如下：

當執行 function 時，常會觸發改變資料狀態，當狀態出現改變時，DOM 元素也會隨之渲染或移除。需要特別注意的是，同 `v-if` 類似的 `v-show`，其底層運作邏輯則不同，僅只是採用 css 的 `display: none` 來做隱藏，元素本身並沒有被銷毀。

不過，一般而言，開發者並不會特別使用 destroyed 這個 api，同時官方也不建議我們直接使用。

#### activated & deactivated

在某些填寫表格的情境下，同時又有 tab 可以切換時，會希望優化使用體驗，保留填寫內容，避免使用者誤觸 tab 時，導致元件觸發銷毀內容。這時，就會使用 `keep-alive` 來維持資料的狀態，除了暫時存放資料，也能優化使用體驗。

### 2. What’s the difference between `created` and `mounted` ?

#### 兩者的最大的差異，在於掛載的順序，以及各階段中資料的狀態

- beforeCreate：在這個階段，資料與元素都尚未取得，因此都還是 undefined 狀態。
- created：資料已經取得，但 DOM 元素依然還無法操作。
- beforeMount：同上一階段，DOM 元素仍為空。
- mounted：DOM 元素素掛載完成，資料渲染到畫面上。

## ⚙️ React
