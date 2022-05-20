---
id: vue-vuex
title: '☕ Vuex'
slug: /vue-vuex
---

### 1. What's the properties of vuex ?

- actions：將資料透過 commit 提交，若有額外參數(payload)也可以傳入。
- mutations：接收到傳過來的資料後，賦值給 state。
- state：保存全域使用的變數狀態，方便 component 可以直接使用。
- getters：可以理解為 vuex 的 computed，只是將保存的值放在 vuex 計算。
- modules：讓 vuex 可以更為結構化。

#### about modules

需要聲明`namespaced: true`，讓路徑根據模組自動調整命名。但在應用上需要注意路徑名稱，譬如：

```js
this.$store.dispatch('user/setCurrentChannel', this.isCurrentChannel);
```

同時在根目錄上需要添加 `modules: { user: user }`。

### 2. Please explain how vuex work ?

1. state 會先存放初始化的資料。
2. 當 component 呼叫 vuex 中的函式，首先會到 actions 找對應的函式，當然如果 component 呼叫時有傳入參數，那這個參數就透過 payload 傳入函式。
3. 透過 commit 的方式來改變 mutations 內的函式，而 mutations 這時就會將傳來的資料賦值給 state，進而改變全域狀態。

### 3. Why save data in vuex store ?

現代網頁專案中，通常以多個 component 構建而成，而彼此所處的層級可能不同，假設某一筆資料，在多個 component 需要使用，代表這個資料或狀態，需要存放在全域環境，方便不同組件之間可以快速引入使用。
