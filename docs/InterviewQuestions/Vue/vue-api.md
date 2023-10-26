---
id: vue-api
title: 📄 API
slug: /vue-api
---

## 1. Please explain the usage of `v-model`, `v-bind` and `v-html`

- `v-model`：資料雙向綁定，當改變資料的同時，隨即驅動改變 template 上渲染的內容。
- `v-bind`：動態綁定，常見於綁定 class 或連結、圖片等。當通過 `v-bind` 綁定 class 後，可以透過資料變動，來決定該 class 樣式是否被綁定，同理 api 回傳的圖片路徑、連結網址，也能透過綁定的形式來維持動態更新。
- `v-html`：如果資料回傳的內容中帶有 HTML 的標籤時，可以透過這個指令來渲染，例如顯示 Markdown 語法又或是對方直接回傳含有 img 標籤的圖片路徑。

## 2. Please explain the difference between `v-show` and `v-if`

> 請解釋 `v-show` 和 `v-if` 的區別

### Similarities (相同點)

都是用於操作 DOM 元素，根據狀態的不同，決定是否顯示。

### Differences (相異點)

`v-show` 會在 DOM 中保留元素，只是改變 CSS 的 `display: none;` 屬性，而 `v-if` 則是直接從 DOM 中移除元素。`v-if` 會觸發 Vue 的生命週期，銷毀或重新創建元素，必然會在性能上消耗較大，因此在頻繁切換的場景下，使用 `v-show` 會更好。
