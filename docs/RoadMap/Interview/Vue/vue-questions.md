---
id: vue-questions
title: '☕ Questions List'
slug: /vue-questions
---

## ⚙️ Basic

## ⚙️ Lifecycle

### 1. Please explain the lifecycle of vue

<details><summary>Vue 2.x version</summary>
<p>

主要分為四個階段

#### beforeCreate & created

- beforeCreated：剛完成初始化，資料在這一階段還未產生，一般而言，不會在這階段操作資料。
- created：這個階段已完成資料初始化，因此 data 內的值已經可以調用，另外，如果有需要，也可以在這個階段呼叫 api。

#### beforeMount & mounted

- beforeMount：這個階段處於資料渲染之前

</p>
</details>

<!-- ### `Vue` 的資料綁定機制是如何實現的 ? 在 `2.0` 版本和 `3.0` 版本又有怎樣的差異 ?

### `nextTick` 是如何實現的 ?

### 請試說明 `computed` 和 `watch` 的差異 ?

### `keep-alive` 是什麼 ? 如何實作的 ? -->
