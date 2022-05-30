---
id: props-basic
title: '☕ Props'
slug: /props-basic
---

## ⚙️ Vue

### 1. Why say `Vue.js` is one-way data flow ?

在父子組件傳值中，父組件可以送資料給子組件，但子組件只能接收不能傳資料給父組件，但子組件可以透過`@emit`方法，促使父組件執行 function 來改變狀態。

舉例來說，常見的 modal(彈窗)，通常會被封裝到 component，而每個頁面引入 model 後，所需要顯示的內容各有不同，包含標題和內文都有所差異，這時就會透過父組件傳入資料來顯示對應內容，同時子組件顯示的內容中，也能透過`@emit`來觸發一些預期行為，可能是關閉視窗，也可能是改變某些狀態。

### 2. What are the ways of props data between component ?

#### 狹義，主要是父子組件傳值、同層級傳值、全域管理

- 父子組件，通過`props`接收父組件傳下來的資料，同時也能透過`@emit`來呼叫父組件執行函式。
- 兄弟組件，同層級組件可以透過`EventBus`傳遞資料`(Vue 2.x)`。
- vuex 是常見的專案狀態管理，如果有多個組件需要複用的狀態或是函式，可以統一由全域來管理。

#### 廣義，還有兩種也算是傳遞資料的方式

- cookie, localStorage, sessionStorage 存放的資料，組件間也是能調用。
- `router.push()`中例如 query 或是 params 也是可以帶入參數，等同是傳遞資料給進入的下一個組件。

### 3. Please explain slot

理解 slot 之前，需要先確認為什麼需要它？它解決什麼問題？

從表面上來看， slot 和 props 頗為相似，皆能將資料傳給 component，那在同質性高的情況下，為何需要使用 slot？

因為 props 傳遞資料時，需要一定的書寫格式，但如果今日只是想將某個 component 在相同樣式的條件下更改內容，使用 slot 會相對更輕量簡潔。

使用方法上，接受傳值的子組件需要在 template 上使用 slot 標籤，這個標籤內的內容，則會渲染父組件傳過來的內容或 DOM 元素。當然，如果父組件沒有傳值，也可以顯示子組件的預設內容。

#### Useage

```js
// father component
<template lang="pug">
.container
  slot-list {{ content }}
</template>

<script>
import slotList from '../components/list';

export default {
  name: 'Video',
  components: {
    slotList,
  },

  data: () => ({
    content: '傳遞內容',
  }),
};
</script>

// child component
<template lang="pug">
v-btn
  slot 預設內容
</template>

<script>
export default {
  name: 'list',
  data: () => ({}),
};
</script>
```

在上述中，button 會顯示`傳遞內容`文字，但如果今天將父層的資料移除，則會顯示`預設內容`文字。額外需要注意一點，如果引入的 component 採用駝峰式命名，在 template 時需要改為 dash 的間隔形式，避免和 HTML 標籤產生相同命名的錯誤。

## ⚙️ React

### 1. What’s the difference between `state` and `props` ?
