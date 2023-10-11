---
id: vue-api
title: 📄 API
slug: /vue-api
---

## 1. Please explain the usage of `v-model`, `v-bind`, `v-bind` and `v-html`

## 2. Please explain the difference between `v-show` and `v-if`

### Similarities

都是用於操作 DOM 元素，根據狀態的不同，決定是否顯示。

### Differences

- `v-show` 會在 DOM 中保留元素，只是改變 CSS 的 `display: none;` 屬性，而 `v-if` 則是直接從 DOM 中移除元素。
- `v-if` 會觸發 Vue 的生命週期，銷毀或重新創建元素，必然會在性能上消耗較大，因此在頻繁切換的場景下，使用 `v-show` 會更好。
