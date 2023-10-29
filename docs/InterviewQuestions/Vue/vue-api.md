---
id: vue-api
title: 📄 Basic & API
slug: /vue-api
---

## 1. Can you describe the core principles and advantages of the framework Vue ?

> 請描述 Vue 框架的核心原理和優勢

### 核心原理

1. 虛擬 DOM：使用虛擬 DOM 來提升性能。它只會更新有變化的 DOM 節點，而不是重新渲染整個 DOM Tree。
2. 資料雙向綁定：使用雙向資料綁定，當模型（Model）更改時，視圖（View）會自動更新，反之亦然。
3. 組件化：將整個應用切分成一個個組件，意味著重用性提升，這對維護開發會更為省工。
4. 生命週期：有自己的生命週期，當資料發生變化時，會觸發相應的生命週期，這樣就可以在特定的生命週期中，做出相應的操作。
5. 指令：提供了一些常用的指令，例如 `v-if`、`v-for`、`v-bind`、`v-model` 等，可以讓開發者更快速的開發。
6. Template：使用 template 來撰寫 HTML，允許將資料透過插值的方式，直接渲染到 template 中。

### 獨有優勢(和 React 相比)

1. 學習曲線較低，對團隊成員彼此程度的掌控落差不會太大，同時在書寫風格上，由官方統一規定，避免過於自由奔放，同時對不同專案的維護也能更快上手。
2. 擁有自己的獨特指令語法，雖然這點可能見仁見智。
3. 承上點，因為有自己的指令，所以開發者實現資料雙向綁定可以非常容易(`v-model`)，而 React 雖然也能實作類似的功能，但沒有 Vue 來的直覺。
4. 模板和邏輯分離，React 的 JSX 仍為部分開發者所詬病，在部分開發情境下，將邏輯和 UI 進行分離會顯得更易閱讀與維護。

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

- `v-model`：資料雙向綁定，當改變資料的同時，隨即驅動改變 template 上渲染的內容。
- `v-bind`：動態綁定，常見於綁定 class 或連結、圖片等。當通過 `v-bind` 綁定 class 後，可以透過資料變動，來決定該 class 樣式是否被綁定，同理 api 回傳的圖片路徑、連結網址，也能透過綁定的形式來維持動態更新。
- `v-html`：如果資料回傳的內容中帶有 HTML 的標籤時，可以透過這個指令來渲染，例如顯示 Markdown 語法又或是對方直接回傳含有 img 標籤的圖片路徑。

## 3. Please explain the difference between `v-show` and `v-if`

> 請解釋 `v-show` 和 `v-if` 的區別

### Similarities (相同點)

都是用於操作 DOM 元素，根據狀態的不同，決定是否顯示。

### Differences (相異點)

`v-show` 會在 DOM 中保留元素，只是改變 CSS 的 `display: none;` 屬性，而 `v-if` 則是直接從 DOM 中移除元素。`v-if` 會觸發 Vue 的生命週期，銷毀或重新創建元素，必然會在性能上消耗較大，因此在頻繁切換的場景下，使用 `v-show` 會更好。

## 4. What’s the difference between `computed` and `watch` ?

computed 除了計算屬性的特性外，其主要目的，是為了在目前已有的資料上進行更新，所以本身帶有緩存的特性，而 watch 則僅是監聽資料的變化。

所以使用上，要考慮到應用情境，如果某筆資料必須相依另外一筆資料來計算的話，則使用 computed，反之，如果只是要單純監聽資料變化，則使用 watch。
