---
id: static-hoisting
title: '[Medium] Vue3 靜態提升'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> 請解釋 Vue3 的靜態提升是什麼？

在 Vue3 裡，所謂的**靜態提升（Static Hoisting）**是指編譯階段的一個最佳化技術。

### 定義

**靜態提升**是 Vue 3 編譯器在編譯 template 時，會分析哪些節點完全不依賴 reactive 狀態、永遠不會改變，然後將這些靜態節點抽出來，變成檔案頂部的常量，只在初次 render 的時候建立一次，後續重新 render 時就直接重用，這樣可以減少 VNode 建立以及 diff 的成本。

### 工作原理

編譯器會分析 template，把完全不依賴 reactive 狀態、永遠不會變的節點抽出來，變成檔案頂部的常量，只在初次 render 的時候建立一次，後續重新 render 時就直接重用。

### 編譯前後對比

**編譯前的 Template**：

<details>
<summary>點此展開 Template 範例</summary>

```vue
<template>
  <div>
    <h1>靜態標題</h1>
    <p>靜態內容</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

</details>

**編譯後的 JavaScript**（簡化版）：

<details>
<summary>點此展開編譯後 JavaScript 範例</summary>

```js
// 靜態節點被提升到頂部，只建立一次
const _hoisted_1 = /*#__PURE__*/ h('h1', null, '靜態標題');
const _hoisted_2 = /*#__PURE__*/ h('p', null, '靜態內容');

function render() {
  return h('div', null, [
    _hoisted_1, // 直接重用，不需要重新建立
    _hoisted_2, // 直接重用，不需要重新建立
    h('div', null, dynamicContent.value), // 動態內容需要重新建立
  ]);
}
```

</details>

### 優勢

1. **減少 VNode 建立成本**：靜態節點只建立一次，後續直接重用
2. **減少 diff 成本**：靜態節點不需要參與 diff 比較
3. **提升渲染效能**：特別是在大量靜態內容的組件中效果明顯
4. **自動優化**：開發者不需要特別寫什麼就能享受到這個優化

## 2. How Static Hoisting Works

> 靜態提升如何運作？

### 編譯器分析過程

編譯器會分析 template 中的每個節點：

1. **檢查節點是否包含動態綁定**

   - 檢查是否有 `{{ }}`、`v-bind`、`v-if`、`v-for` 等動態指令
   - 檢查屬性值是否包含變數

2. **標記靜態節點**

   - 如果節點及其子節點都沒有動態綁定，標記為靜態節點

3. **提升靜態節點**
   - 將靜態節點提取到 render 函數外部
   - 作為常量在模組頂部定義

### 範例 1：基本靜態提升

<details>
<summary>點此展開基本靜態提升範例</summary>

```vue
<template>
  <div>
    <h1>標題</h1>
    <p>這是靜態內容</p>
    <div>靜態區塊</div>
  </div>
</template>
```

</details>

**編譯後**：

<details>
<summary>點此展開編譯後結果</summary>

```js
// 所有靜態節點都被提升
const _hoisted_1 = h('h1', null, '標題');
const _hoisted_2 = h('p', null, '這是靜態內容');
const _hoisted_3 = h('div', null, '靜態區塊');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

</details>

### 範例 2：混合靜態與動態內容

<details>
<summary>點此展開混合內容範例</summary>

```vue
<template>
  <div>
    <h1>靜態標題</h1>
    <p>{{ message }}</p>
    <div class="static-class">靜態內容</div>
    <span :class="dynamicClass">動態內容</span>
  </div>
</template>
```

</details>

**編譯後**：

<details>
<summary>點此展開編譯後結果</summary>

```js
// 只有完全靜態的節點被提升
const _hoisted_1 = h('h1', null, '靜態標題');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, '靜態內容');

function render() {
  return h('div', null, [
    _hoisted_1, // 靜態節點，重用
    h('p', null, message.value), // 動態內容，需要重新建立
    _hoisted_3, // 靜態節點，重用
    h('span', { class: dynamicClass.value }, '動態內容'), // 動態屬性，需要重新建立
  ]);
}
```

</details>

### 範例 3：靜態屬性提升

<details>
<summary>點此展開靜態屬性範例</summary>

```vue
<template>
  <div>
    <div class="container" id="main">內容</div>
    <button disabled>按鈕</button>
  </div>
</template>
```

</details>

**編譯後**：

<details>
<summary>點此展開編譯後結果</summary>

```js
// 靜態屬性物件也被提升
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, '內容');
const _hoisted_4 = h('button', _hoisted_2, '按鈕');

function render() {
  return h('div', null, [_hoisted_3, _hoisted_4]);
}
```

</details>

## 3. v-once Directive

> v-once 指令

如果開發者想主動標記一大塊永遠不會變的內容，還可以使用 `v-once` 指令。

### v-once 的作用

`v-once` 告訴編譯器這個元素及其子元素應該只渲染一次，即使包含動態綁定，也只會在初次渲染時計算一次，後續不會更新。

### 基本用法

<details>
<summary>點此展開 v-once 基本範例</summary>

```vue
<template>
  <div>
    <!-- 使用 v-once 標記靜態內容 -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- 不使用 v-once，會響應式更新 -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('初始標題');
const content = ref('初始內容');

// 即使修改這些值，v-once 區塊也不會更新
setTimeout(() => {
  title.value = '新標題';
  content.value = '新內容';
}, 1000);
</script>
```

</details>

### v-once vs 靜態提升

| 特性         | 靜態提升            | v-once                   |
| ------------ | ------------------- | ------------------------ |
| **觸發方式** | 自動（編譯器分析）  | 手動（開發者標記）       |
| **適用場景** | 完全靜態的內容      | 包含動態綁定但只渲染一次 |
| **效能**     | 最佳（不參與 diff） | 良好（只渲染一次）       |
| **使用時機** | 編譯時自動判斷      | 開發者明確知道不會改變   |

### 使用場景

```vue
<template>
  <!-- 場景 1：一次性顯示的資料 -->
  <div v-once>
    <p>建立時間：{{ createdAt }}</p>
    <p>建立者：{{ creator }}</p>
  </div>

  <!-- 場景 2：複雜的靜態結構 -->
  <div v-once>
    <div class="header">
      <h1>標題</h1>
      <nav>導航</nav>
    </div>
  </div>

  <!-- 場景 3：列表中的靜態項 -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Common Interview Questions

> 常見面試題目

### 題目 1：靜態提升的原理

請解釋 Vue3 靜態提升的工作原理，並說明它如何提升效能。

<details>
<summary>點擊查看答案</summary>

**靜態提升的工作原理**：

1. **編譯階段分析**：

   - 編譯器會分析 template 中的每個節點
   - 檢查節點是否包含動態綁定（`{{ }}`、`v-bind`、`v-if` 等）
   - 如果節點及其子節點都沒有動態綁定，標記為靜態節點

2. **節點提升**：

   - 將靜態節點提取到 render 函數外部
   - 作為常量在模組頂部定義
   - 只在初次 render 時建立一次

3. **重用機制**：
   - 後續重新 render 時直接重用這些靜態節點
   - 不需要重新建立 VNode
   - 不需要參與 diff 比較

**效能提升**：

- **減少 VNode 建立成本**：靜態節點只建立一次
- **減少 diff 成本**：靜態節點跳過 diff 比較
- **減少記憶體使用**：多個組件實例可以共享靜態節點
- **提升渲染速度**：特別是在大量靜態內容的組件中效果明顯

**範例**：

```vue
<!-- 編譯前 -->
<template>
  <div>
    <h1>標題</h1>
    <p>{{ message }}</p>
  </div>
</template>

<!-- 編譯後（簡化） -->
const _hoisted_1 = h("h1", null, "標題"); function render() { return h("div",
null, [ _hoisted_1, // 重用，不重新建立 h("p", null, message.value) //
動態，需要重新建立 ]); }
```

</details>

### 題目 2：靜態提升與 v-once 的差異

請說明靜態提升和 `v-once` 的差異，以及各自的適用場景。

<details>
<summary>點擊查看答案</summary>

**主要差異**：

| 特性         | 靜態提升            | v-once                   |
| ------------ | ------------------- | ------------------------ |
| **觸發方式** | 自動（編譯器分析）  | 手動（開發者標記）       |
| **適用內容** | 完全靜態的內容      | 包含動態綁定但只渲染一次 |
| **編譯時機** | 編譯時自動判斷      | 開發者明確標記           |
| **效能**     | 最佳（不參與 diff） | 良好（只渲染一次）       |
| **更新行為** | 永遠不會更新        | 初次渲染後不再更新       |

**適用場景**：

**靜態提升**：

- 完全靜態的 HTML 結構
- 不包含任何動態綁定的內容
- 編譯器自動處理，開發者無感知

```vue
<!-- 自動靜態提升 -->
<template>
  <div>
    <h1>標題</h1>
    <p>靜態內容</p>
  </div>
</template>
```

**v-once**：

- 包含動態綁定但只渲染一次的內容
- 開發者明確知道不會改變的區塊
- 需要手動標記

```vue
<!-- 使用 v-once -->
<template>
  <div v-once>
    <p>建立時間：{{ createdAt }}</p>
    <p>建立者：{{ creator }}</p>
  </div>
</template>
```

**選擇建議**：

- 如果內容完全靜態 → 讓編譯器自動處理（靜態提升）
- 如果內容包含動態綁定但只渲染一次 → 使用 `v-once`
- 如果內容需要響應式更新 → 不使用 `v-once`

</details>

### 題目 3：實際應用場景

請說明在什麼情況下，靜態提升能帶來明顯的效能提升？

<details>
<summary>點擊查看答案</summary>

**靜態提升能帶來明顯效能提升的場景**：

1. **大量靜態內容的組件**

   ```vue
   <template>
     <div>
       <!-- 大量靜態 HTML 結構 -->
       <header>...</header>
       <nav>...</nav>
       <main>
         <article>...</article>
         <aside>...</aside>
       </main>
       <footer>...</footer>
       <!-- 只有少量動態內容 -->
       <div>{{ dynamicContent }}</div>
     </div>
   </template>
   ```

2. **列表中的靜態項**

   ```vue
   <template>
     <div v-for="item in items" :key="item.id">
       <!-- 靜態結構被提升，每個列表項重用 -->
       <div class="item-wrapper">
         <h3>標題結構</h3>
         <p>{{ item.content }}</p>
       </div>
     </div>
   </template>
   ```

3. **頻繁更新的組件**

   ```vue
   <template>
     <div>
       <!-- 靜態部分不參與更新 -->
       <div class="header">靜態標題</div>
       <div class="content">{{ frequentlyUpdatedData }}</div>
     </div>
   </template>
   ```

4. **多個組件實例**
   - 靜態節點可以在多個組件實例間共享
   - 減少記憶體使用

**效能提升的關鍵因素**：

- **靜態內容比例**：靜態內容越多，提升越明顯
- **更新頻率**：更新越頻繁，減少 diff 成本的效果越明顯
- **組件實例數量**：實例越多，共享靜態節點的優勢越明顯

**實際測量**：

在包含大量靜態內容的組件中，靜態提升可以：

- 減少 30-50% 的 VNode 建立時間
- 減少 40-60% 的 diff 比較時間
- 減少記憶體使用（多實例共享）

</details>

## 5. Best Practices

> 最佳實踐

### 推薦做法

```vue
<!-- 1. 讓編譯器自動處理靜態內容 -->
<template>
  <div>
    <h1>標題</h1>
    <p>靜態內容</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2. 明確使用 v-once 標記只渲染一次的內容 -->
<template>
  <div v-once>
    <p>建立時間：{{ createdAt }}</p>
    <p>建立者：{{ creator }}</p>
  </div>
</template>

<!-- 3. 將靜態結構與動態內容分離 -->
<template>
  <div>
    <!-- 靜態結構 -->
    <div class="container">
      <header>標題</header>
      <!-- 動態內容 -->
      <main>{{ content }}</main>
    </div>
  </div>
</template>
```

### 避免的做法

```vue
<!-- 1. 不要過度使用 v-once -->
<template>
  <!-- ❌ 如果內容需要更新，不應該使用 v-once -->
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2. 不要在動態內容上使用 v-once -->
<template>
  <!-- ❌ 如果列表項需要更新，不應該使用 v-once -->
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>

<!-- 3. 不要為了優化而破壞結構 -->
<template>
  <!-- ⚠️ 不要為了靜態提升而強行分離邏輯上相關的內容 -->
  <div>
    <h1>標題</h1>
    <p>內容</p>
  </div>
</template>
```

## 6. Interview Summary

> 面試總結

### 快速記憶

**靜態提升**：

- **定義**：編譯階段將靜態節點提升為常量，只建立一次
- **優勢**：減少 VNode 建立和 diff 成本
- **自動化**：編譯器自動處理，開發者無感知
- **適用**：完全不依賴 reactive 狀態的節點

**v-once**：

- **定義**：手動標記只渲染一次的內容
- **適用**：包含動態綁定但只渲染一次的區塊
- **效能**：減少不必要的更新

**關鍵差異**：

- 靜態提升：自動、完全靜態
- v-once：手動、可包含動態綁定

### 面試回答範例

**Q: 請解釋 Vue3 的靜態提升是什麼？**

> "在 Vue3 裡，所謂的靜態提升是指編譯階段的一個最佳化。編譯器會分析 template，把完全不依賴 reactive 狀態、永遠不會變的節點抽出來，變成檔案頂部的常量，只在初次 render 的時候建立一次，後續重新 render 時就直接重用，這樣可以減少 VNode 建立以及 diff 的成本。對開發者來說不需要特別寫什麼就能享受到這個優化，只要寫正常的 template，編譯器會自動決定哪些節點可以被 hoist。如果我想主動標記一大塊永遠不會變的內容，還可以用 v-once。"

**Q: 靜態提升如何提升效能？**

> "靜態提升主要通過三個方面提升效能：1) 減少 VNode 建立成本，靜態節點只建立一次，後續直接重用；2) 減少 diff 成本，靜態節點不需要參與 diff 比較；3) 減少記憶體使用，多個組件實例可以共享靜態節點。這個優化在包含大量靜態內容的組件中效果特別明顯，可以減少 30-50% 的 VNode 建立時間和 40-60% 的 diff 比較時間。"

**Q: v-once 和靜態提升的差異是什麼？**

> "靜態提升是編譯器自動進行的優化，適用於完全靜態的內容，編譯器會自動分析並提升這些節點。v-once 是開發者手動標記的指令，適用於包含動態綁定但只渲染一次的內容，告訴編譯器這個區塊在初次渲染後就不會再更新。兩者的主要差異在於：靜態提升是自動的、適用於完全靜態的內容；v-once 是手動的、可以包含動態綁定但只渲染一次。"

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
