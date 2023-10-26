---
id: vue-api-old
title: '🏷️ API'
slug: /vue-api-old
---

### 4. What’s the difference between `computed` and `watch` ?

`computed` 除了計算屬性的特性外，其主要目的，是為了在目前已有的資料上進行更新，所以本身帶有緩存的特性，而 `watch` 則僅是監聽資料的變化。

所以使用上，要考慮到應用情境，如果某筆資料必須相依另外一筆資料來計算的話，則使用 `computed`，反之，如果只是要單純監聽資料變化，則使用 `watch`。

### 5. Why `v-for` must setting key value ?

倘若沒有設定唯一值的 Key ，當我們對陣列進行操作時，就會造成實際結果和預期結果不同。

舉例而言：

Array A 中有三種水果，依序為蘋果、西瓜、葡萄，假如刪除了西瓜的目錄位置，index 上固然是改成 1、3，但對程式而言，在遍歷中它只會認為是目錄 2 被改成 3，同時元素仍未被刪除，在就地複用的原則下，就變成`1: 蘋果、3: 西瓜`。所以透過唯一值的 Key，可以讓增刪陣列中的資料時，拿到預期的結果。

另外，key 作為唯一值時，對底層虛擬`DOM`渲染也有幫助(涉及`diff`演算法)，當擁有唯一值時，即便陣列或物件中加入新的資料，也可以避免重複渲染的問題，對效能提升有幫助。

### 6. What’s the `Vue.use()` ?

如果有安裝依賴在 Vue 的 plugin，可以透過`Vue.use()`的方法，把套件註冊到全域環境，讓其他 component 可以直接使用，而不需要每頁都 import 該插件。

### 7. What’s `keep-alive` ? How to use ?

一種暫存資料的方式，常見於填寫表格資料時，因為內容繁多，可能在設計上會有 tab 這類的設計，當使用者不小心誤觸，或是想透過切換來查看此前填寫的內容時，若未將其內容進行暫存，則會導致原先填寫的資料消失，這在使用體驗上不佳。

透過 `keep-alive` 去包裹需要暫存的區塊，除了能緩存資料，也能優化使用體驗。

#### Usage

準備兩個組件，一個組件單純顯示列表，另一個組件則顯示 textarea，並在引入組件時進行動態渲染，接著使用 keep-alive 進行包裹，當點擊兩個 button 進行切換，可以看到組件來回切換顯示，接著在 textarea 中輸入一些內容，並再次進行切換，即可看到輸入內容被緩存的結果。

```js
<template lang="pug">
.container
  v-btn(@click="handle('List')") List
  v-btn(@click="handle('Form')") Form
  keep-alive
    component(:is="content")
</template>

<script>
import List from '../components/list';
import Form from '../components/form';

export default {
  name: 'Video',
  components: {
    List,
    Form,
  },

  data: () => ({
    content: 'List',
  }),

  methods: {
    handle(value) {
      this.content = value;
    },
  },
};
</script>
```
