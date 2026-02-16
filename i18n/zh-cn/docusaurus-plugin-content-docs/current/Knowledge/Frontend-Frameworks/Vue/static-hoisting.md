---
id: static-hoisting
title: '[Medium] Vue3 静态提升'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> 请解释 Vue3 的静态提升是什么？

在 Vue3 里，所谓的**静态提升（Static Hoisting）**是指编译阶段的一个优化技术。

### 定义

**静态提升**是 Vue 3 编译器在编译 template 时，会分析哪些节点完全不依赖 reactive 状态、永远不会改变，然后将这些静态节点抽出来，变成文件顶部的常量，只在初次 render 的时候创建一次，后续重新 render 时就直接重用，这样可以减少 VNode 创建以及 diff 的成本。

### 工作原理

编译器会分析 template，把完全不依赖 reactive 状态、永远不会变的节点抽出来，变成文件顶部的常量，只在初次 render 的时候创建一次，后续重新 render 时就直接重用。

### 编译前后对比

**编译前的 Template**：

<details>
<summary>点此展开 Template 示例</summary>

```vue
<template>
  <div>
    <h1>静态标题</h1>
    <p>静态内容</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

</details>

**编译后的 JavaScript**（简化版）：

<details>
<summary>点此展开编译后 JavaScript 示例</summary>

```js
// 静态节点被提升到顶部，只创建一次
const _hoisted_1 = /*#__PURE__*/ h('h1', null, '静态标题');
const _hoisted_2 = /*#__PURE__*/ h('p', null, '静态内容');

function render() {
  return h('div', null, [
    _hoisted_1, // 直接重用，不需要重新创建
    _hoisted_2, // 直接重用，不需要重新创建
    h('div', null, dynamicContent.value), // 动态内容需要重新创建
  ]);
}
```

</details>

### 优势

1. **减少 VNode 创建成本**：静态节点只创建一次，后续直接重用
2. **减少 diff 成本**：静态节点不需要参与 diff 比较
3. **提升渲染性能**：特别是在大量静态内容的组件中效果明显
4. **自动优化**：开发者不需要特别写什么就能享受到这个优化

## 2. How Static Hoisting Works

> 静态提升如何运作？

### 编译器分析过程

编译器会分析 template 中的每个节点：

1. **检查节点是否包含动态绑定**

   - 检查是否有 `{{ }}`、`v-bind`、`v-if`、`v-for` 等动态指令
   - 检查属性值是否包含变量

2. **标记静态节点**

   - 如果节点及其子节点都没有动态绑定，标记为静态节点

3. **提升静态节点**
   - 将静态节点提取到 render 函数外部
   - 作为常量在模块顶部定义

### 示例 1：基本静态提升

<details>
<summary>点此展开基本静态提升示例</summary>

```vue
<template>
  <div>
    <h1>标题</h1>
    <p>这是静态内容</p>
    <div>静态区块</div>
  </div>
</template>
```

</details>

**编译后**：

<details>
<summary>点此展开编译后结果</summary>

```js
// 所有静态节点都被提升
const _hoisted_1 = h('h1', null, '标题');
const _hoisted_2 = h('p', null, '这是静态内容');
const _hoisted_3 = h('div', null, '静态区块');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

</details>

### 示例 2：混合静态与动态内容

<details>
<summary>点此展开混合内容示例</summary>

```vue
<template>
  <div>
    <h1>静态标题</h1>
    <p>{{ message }}</p>
    <div class="static-class">静态内容</div>
    <span :class="dynamicClass">动态内容</span>
  </div>
</template>
```

</details>

**编译后**：

<details>
<summary>点此展开编译后结果</summary>

```js
// 只有完全静态的节点被提升
const _hoisted_1 = h('h1', null, '静态标题');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, '静态内容');

function render() {
  return h('div', null, [
    _hoisted_1, // 静态节点，重用
    h('p', null, message.value), // 动态内容，需要重新创建
    _hoisted_3, // 静态节点，重用
    h('span', { class: dynamicClass.value }, '动态内容'), // 动态属性，需要重新创建
  ]);
}
```

</details>

### 示例 3：静态属性提升

<details>
<summary>点此展开静态属性示例</summary>

```vue
<template>
  <div>
    <div class="container" id="main">内容</div>
    <button disabled>按钮</button>
  </div>
</template>
```

</details>

**编译后**：

<details>
<summary>点此展开编译后结果</summary>

```js
// 静态属性对象也被提升
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, '内容');
const _hoisted_4 = h('button', _hoisted_2, '按钮');

function render() {
  return h('div', null, [_hoisted_3, _hoisted_4]);
}
```

</details>

## 3. v-once Directive

> v-once 指令

如果开发者想主动标记一大块永远不会变的内容，还可以使用 `v-once` 指令。

### v-once 的作用

`v-once` 告诉编译器这个元素及其子元素应该只渲染一次，即使包含动态绑定，也只会在初次渲染时计算一次，后续不会更新。

### 基本用法

<details>
<summary>点此展开 v-once 基本示例</summary>

```vue
<template>
  <div>
    <!-- 使用 v-once 标记静态内容 -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- 不使用 v-once，会响应式更新 -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('初始标题');
const content = ref('初始内容');

// 即使修改这些值，v-once 区块也不会更新
setTimeout(() => {
  title.value = '新标题';
  content.value = '新内容';
}, 1000);
</script>
```

</details>

### v-once vs 静态提升

| 特性         | 静态提升            | v-once                   |
| ------------ | ------------------- | ------------------------ |
| **触发方式** | 自动（编译器分析）  | 手动（开发者标记）       |
| **适用场景** | 完全静态的内容      | 包含动态绑定但只渲染一次 |
| **性能**     | 最佳（不参与 diff） | 良好（只渲染一次）       |
| **使用时机** | 编译时自动判断      | 开发者明确知道不会改变   |

### 使用场景

```vue
<template>
  <!-- 场景 1：一次性显示的数据 -->
  <div v-once>
    <p>创建时间：{{ createdAt }}</p>
    <p>创建者：{{ creator }}</p>
  </div>

  <!-- 场景 2：复杂的静态结构 -->
  <div v-once>
    <div class="header">
      <h1>标题</h1>
      <nav>导航</nav>
    </div>
  </div>

  <!-- 场景 3：列表中的静态项 -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Common Interview Questions

> 常见面试题目

### 题目 1：静态提升的原理

请解释 Vue3 静态提升的工作原理，并说明它如何提升性能。

<details>
<summary>点击查看答案</summary>

**静态提升的工作原理**：

1. **编译阶段分析**：

   - 编译器会分析 template 中的每个节点
   - 检查节点是否包含动态绑定（`{{ }}`、`v-bind`、`v-if` 等）
   - 如果节点及其子节点都没有动态绑定，标记为静态节点

2. **节点提升**：

   - 将静态节点提取到 render 函数外部
   - 作为常量在模块顶部定义
   - 只在初次 render 时创建一次

3. **重用机制**：
   - 后续重新 render 时直接重用这些静态节点
   - 不需要重新创建 VNode
   - 不需要参与 diff 比较

**性能提升**：

- **减少 VNode 创建成本**：静态节点只创建一次
- **减少 diff 成本**：静态节点跳过 diff 比较
- **减少内存使用**：多个组件实例可以共享静态节点
- **提升渲染速度**：特别是在大量静态内容的组件中效果明显

**示例**：

```vue
<!-- 编译前 -->
<template>
  <div>
    <h1>标题</h1>
    <p>{{ message }}</p>
  </div>
</template>

<!-- 编译后（简化） -->
const _hoisted_1 = h("h1", null, "标题"); function render() { return h("div",
null, [ _hoisted_1, // 重用，不重新创建 h("p", null, message.value) //
动态，需要重新创建 ]); }
```

</details>

### 题目 2：静态提升与 v-once 的差异

请说明静态提升和 `v-once` 的差异，以及各自的适用场景。

<details>
<summary>点击查看答案</summary>

**主要差异**：

| 特性         | 静态提升            | v-once                   |
| ------------ | ------------------- | ------------------------ |
| **触发方式** | 自动（编译器分析）  | 手动（开发者标记）       |
| **适用内容** | 完全静态的内容      | 包含动态绑定但只渲染一次 |
| **编译时机** | 编译时自动判断      | 开发者明确标记           |
| **性能**     | 最佳（不参与 diff） | 良好（只渲染一次）       |
| **更新行为** | 永远不会更新        | 初次渲染后不再更新       |

**适用场景**：

**静态提升**：

- 完全静态的 HTML 结构
- 不包含任何动态绑定的内容
- 编译器自动处理，开发者无感知

```vue
<!-- 自动静态提升 -->
<template>
  <div>
    <h1>标题</h1>
    <p>静态内容</p>
  </div>
</template>
```

**v-once**：

- 包含动态绑定但只渲染一次的内容
- 开发者明确知道不会改变的区块
- 需要手动标记

```vue
<!-- 使用 v-once -->
<template>
  <div v-once>
    <p>创建时间：{{ createdAt }}</p>
    <p>创建者：{{ creator }}</p>
  </div>
</template>
```

**选择建议**：

- 如果内容完全静态 → 让编译器自动处理（静态提升）
- 如果内容包含动态绑定但只渲染一次 → 使用 `v-once`
- 如果内容需要响应式更新 → 不使用 `v-once`

</details>

### 题目 3：实际应用场景

请说明在什么情况下，静态提升能带来明显的性能提升？

<details>
<summary>点击查看答案</summary>

**静态提升能带来明显性能提升的场景**：

1. **大量静态内容的组件**

   ```vue
   <template>
     <div>
       <!-- 大量静态 HTML 结构 -->
       <header>...</header>
       <nav>...</nav>
       <main>
         <article>...</article>
         <aside>...</aside>
       </main>
       <footer>...</footer>
       <!-- 只有少量动态内容 -->
       <div>{{ dynamicContent }}</div>
     </div>
   </template>
   ```

2. **列表中的静态项**

   ```vue
   <template>
     <div v-for="item in items" :key="item.id">
       <!-- 静态结构被提升，每个列表项重用 -->
       <div class="item-wrapper">
         <h3>标题结构</h3>
         <p>{{ item.content }}</p>
       </div>
     </div>
   </template>
   ```

3. **频繁更新的组件**

   ```vue
   <template>
     <div>
       <!-- 静态部分不参与更新 -->
       <div class="header">静态标题</div>
       <div class="content">{{ frequentlyUpdatedData }}</div>
     </div>
   </template>
   ```

4. **多个组件实例**
   - 静态节点可以在多个组件实例间共享
   - 减少内存使用

**性能提升的关键因素**：

- **静态内容比例**：静态内容越多，提升越明显
- **更新频率**：更新越频繁，减少 diff 成本的效果越明显
- **组件实例数量**：实例越多，共享静态节点的优势越明显

**实际测量**：

在包含大量静态内容的组件中，静态提升可以：

- 减少 30-50% 的 VNode 创建时间
- 减少 40-60% 的 diff 比较时间
- 减少内存使用（多实例共享）

</details>

## 5. Best Practices

> 最佳实践

### 推荐做法

```vue
<!-- 1. 让编译器自动处理静态内容 -->
<template>
  <div>
    <h1>标题</h1>
    <p>静态内容</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2. 明确使用 v-once 标记只渲染一次的内容 -->
<template>
  <div v-once>
    <p>创建时间：{{ createdAt }}</p>
    <p>创建者：{{ creator }}</p>
  </div>
</template>

<!-- 3. 将静态结构与动态内容分离 -->
<template>
  <div>
    <!-- 静态结构 -->
    <div class="container">
      <header>标题</header>
      <!-- 动态内容 -->
      <main>{{ content }}</main>
    </div>
  </div>
</template>
```

### 避免的做法

```vue
<!-- 1. 不要过度使用 v-once -->
<template>
  <!-- ❌ 如果内容需要更新，不应该使用 v-once -->
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2. 不要在动态内容上使用 v-once -->
<template>
  <!-- ❌ 如果列表项需要更新，不应该使用 v-once -->
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>

<!-- 3. 不要为了优化而破坏结构 -->
<template>
  <!-- ⚠️ 不要为了静态提升而强行分离逻辑上相关的内容 -->
  <div>
    <h1>标题</h1>
    <p>内容</p>
  </div>
</template>
```

## 6. Interview Summary

> 面试总结

### 快速记忆

**静态提升**：

- **定义**：编译阶段将静态节点提升为常量，只创建一次
- **优势**：减少 VNode 创建和 diff 成本
- **自动化**：编译器自动处理，开发者无感知
- **适用**：完全不依赖 reactive 状态的节点

**v-once**：

- **定义**：手动标记只渲染一次的内容
- **适用**：包含动态绑定但只渲染一次的区块
- **性能**：减少不必要的更新

**关键差异**：

- 静态提升：自动、完全静态
- v-once：手动、可包含动态绑定

### 面试回答示例

**Q: 请解释 Vue3 的静态提升是什么？**

> "在 Vue3 里，所谓的静态提升是指编译阶段的一个优化。编译器会分析 template，把完全不依赖 reactive 状态、永远不会变的节点抽出来，变成文件顶部的常量，只在初次 render 的时候创建一次，后续重新 render 时就直接重用，这样可以减少 VNode 创建以及 diff 的成本。对开发者来说不需要特别写什么就能享受到这个优化，只要写正常的 template，编译器会自动决定哪些节点可以被 hoist。如果我想主动标记一大块永远不会变的内容，还可以用 v-once。"

**Q: 静态提升如何提升性能？**

> "静态提升主要通过三个方面提升性能：1) 减少 VNode 创建成本，静态节点只创建一次，后续直接重用；2) 减少 diff 成本，静态节点不需要参与 diff 比较；3) 减少内存使用，多个组件实例可以共享静态节点。这个优化在包含大量静态内容的组件中效果特别明显，可以减少 30-50% 的 VNode 创建时间和 40-60% 的 diff 比较时间。"

**Q: v-once 和静态提升的差异是什么？**

> "静态提升是编译器自动进行的优化，适用于完全静态的内容，编译器会自动分析并提升这些节点。v-once 是开发者手动标记的指令，适用于包含动态绑定但只渲染一次的内容，告诉编译器这个区块在初次渲染后就不会再更新。两者的主要差异在于：静态提升是自动的、适用于完全静态的内容；v-once 是手动的、可以包含动态绑定但只渲染一次。"

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
