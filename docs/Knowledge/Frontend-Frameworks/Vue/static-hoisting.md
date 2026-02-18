---
id: static-hoisting
title: '[Medium] Vue3 Static Hoisting'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> Explain static hoisting in Vue 3.

In Vue 3, **static hoisting** is a compile-time optimization.

### Definition

During template compilation, Vue analyzes which nodes are fully static (no reactive dependency).
Those static nodes are hoisted into module-level constants and created once.
On subsequent re-renders, Vue reuses them instead of recreating and diffing them.

### How it works

The compiler analyzes template AST and hoists subtrees that never change.
Only dynamic parts are regenerated during updates.

### Before/after example

**Template before compilation**:

```vue
<template>
  <div>
    <h1>Static title</h1>
    <p>Static content</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

**Compiled JavaScript (simplified)**:

```js
// static nodes hoisted once
const _hoisted_1 = /*#__PURE__*/ h('h1', null, 'Static title');
const _hoisted_2 = /*#__PURE__*/ h('p', null, 'Static content');

function render() {
  return h('div', null, [
    _hoisted_1, // reused
    _hoisted_2, // reused
    h('div', null, dynamicContent.value), // dynamic
  ]);
}
```

### Benefits

1. Lower VNode creation cost
2. Less diff work
3. Better render performance
4. Automatic optimization (no extra code required)

## 2. How Static Hoisting Works

> How does static hoisting operate internally?

### Compiler flow

1. **Detect dynamic bindings**
   - `{{ }}`, `v-bind`, `v-if`, `v-for`, dynamic props, etc.
2. **Mark static nodes**
   - Node and children are static -> hoist candidate
3. **Hoist static nodes**
   - Move static nodes/constants outside `render()`

### Example 1: fully static subtree

```vue
<template>
  <div>
    <h1>Title</h1>
    <p>This is static text</p>
    <div>Static block</div>
  </div>
</template>
```

Compiled (simplified):

```js
const _hoisted_1 = h('h1', null, 'Title');
const _hoisted_2 = h('p', null, 'This is static text');
const _hoisted_3 = h('div', null, 'Static block');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

### Example 2: mixed static and dynamic

```vue
<template>
  <div>
    <h1>Static title</h1>
    <p>{{ message }}</p>
    <div class="static-class">Static content</div>
    <span :class="dynamicClass">Dynamic content</span>
  </div>
</template>
```

Compiled (simplified):

```js
const _hoisted_1 = h('h1', null, 'Static title');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, 'Static content');

function render() {
  return h('div', null, [
    _hoisted_1,
    h('p', null, message.value),
    _hoisted_3,
    h('span', { class: dynamicClass.value }, 'Dynamic content'),
  ]);
}
```

### Example 3: static props hoisting

```vue
<template>
  <div>
    <div class="container" id="main">Content</div>
    <button disabled>Button</button>
  </div>
</template>
```

Compiled (simplified):

```js
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, 'Content');
const _hoisted_4 = h('button', _hoisted_2, 'Button');
```

## 3. `v-once` Directive

> `v-once` directive

If a developer wants to explicitly mark a subtree as render-once, use `v-once`.

### What `v-once` does

`v-once` tells Vue to render this element/subtree once.
Even if expressions are dynamic, they are evaluated only on the first render and never updated again.

### Basic usage

```vue
<template>
  <div>
    <!-- render once -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- normal reactive area -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Initial title');
const content = ref('Initial content');

setTimeout(() => {
  title.value = 'New title';
  content.value = 'New content';
}, 1000);
</script>
```

### `v-once` vs static hoisting

| Feature | Static Hoisting | `v-once` |
| --- | --- | --- |
| Trigger | Automatic compiler analysis | Manual directive |
| Best for | Fully static nodes | Dynamic expressions that should render once |
| Performance | Best for static sections | Good for one-time dynamic render |
| Decision time | Compile-time | Developer intent |

### Typical use cases

```vue
<template>
  <!-- Case 1: one-time display data -->
  <div v-once>
    <p>Created at: {{ createdAt }}</p>
    <p>Created by: {{ creator }}</p>
  </div>

  <!-- Case 2: heavy but stable subtree -->
  <div v-once>
    <div class="header">
      <h1>Title</h1>
      <nav>Navigation</nav>
    </div>
  </div>

  <!-- Case 3: one-time snapshot in list item -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Common Interview Questions

> Common interview questions

### Question 1: static hoisting internals

Explain static hoisting and how it improves performance.

<details>
<summary>Click to view answer</summary>

Static hoisting is a compile-time optimization:

1. compiler scans template for static vs dynamic nodes
2. static nodes are moved outside `render()` as constants
3. update phase reuses hoisted nodes and skips their diff work

Performance gains come from:

- less VNode allocation
- less patch/diff traversal
- less repeated object creation

</details>

### Question 2: static hoisting vs `v-once`

Explain differences and use cases.

<details>
<summary>Click to view answer</summary>

- **Static hoisting**: automatic, for fully static template segments
- **`v-once`**: manual, for dynamic expressions that should never update after first render

Use static hoisting by default (automatic).
Use `v-once` only when you intentionally want first-render-only behavior.

</details>

### Question 3: when performance gains are visible

In what scenarios is static hoisting most effective?

<details>
<summary>Click to view answer</summary>

Most visible when:

1. Component contains a lot of static markup
2. Component updates frequently but only a small part is dynamic
3. Many instances share similar static structure

The higher the static-to-dynamic ratio and update frequency, the larger the win.

</details>

## 5. Best Practices

> Best practices

### Recommended

```vue
<!-- 1) Let compiler auto-hoist static content -->
<template>
  <div>
    <h1>Title</h1>
    <p>Static content</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2) Use v-once only for intentional one-time rendering -->
<template>
  <div v-once>
    <p>Created at: {{ createdAt }}</p>
    <p>Created by: {{ creator }}</p>
  </div>
</template>

<!-- 3) Separate stable layout from dynamic region when possible -->
<template>
  <div class="container">
    <header>Static header</header>
    <main>{{ content }}</main>
  </div>
</template>
```

### Avoid

```vue
<!-- 1) Do not use v-once on content that must update -->
<template>
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2) Do not blindly apply v-once on dynamic list nodes -->
<template>
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>
```

## 6. Interview Summary

> Interview summary

### Quick memory

**Static hoisting**:

- compile-time automatic optimization
- hoist static nodes/constants
- reduce VNode creation and diff cost

**`v-once`**:

- developer-controlled render-once behavior
- can include dynamic expressions
- no updates after first render

### Sample answer

**Q: What is static hoisting in Vue 3?**

> It is a compiler optimization where fully static template nodes are hoisted out of the render function into constants. They are created once and reused across updates, reducing VNode creation and diff overhead.

**Q: How is it different from `v-once`?**

> Static hoisting is automatic and applies to fully static content. `v-once` is manual and can include dynamic expressions, but that block is rendered only once and never updated afterwards.

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
