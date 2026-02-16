---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> 什么是 ref 和 reactive？

`ref` 和 `reactive` 是 Vue 3 Composition API 中用来创建响应式数据的两个核心 API。

### ref

**定义**：`ref` 用来创建一个响应式的**基本类型值**或**对象引用**。

<details>
<summary>点此展开 ref 基本示例</summary>

```vue
<script setup>
import { ref } from 'vue';

// 基本类型
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// 对象（也可以使用 ref）
const user = ref({
  name: 'John',
  age: 30,
});

// 访问时需要使用 .value
console.log(count.value); // 0
count.value++; // 修改值
</script>
```

</details>

### reactive

**定义**：`reactive` 用来创建一个响应式的**对象**（不能直接用于基本类型）。

<details>
<summary>点此展开 reactive 基本示例</summary>

```vue
<script setup>
import { reactive } from 'vue';

// 只能用于对象
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// 直接访问属性，不需要 .value
console.log(state.count); // 0
state.count++; // 修改值
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> ref 与 reactive 的主要差异

### 1. 适用类型

**ref**：可以用于任何类型

```typescript
const count = ref(0); // ✅ 数字
const message = ref('Hello'); // ✅ 字符串
const isActive = ref(true); // ✅ 布尔值
const user = ref({ name: 'John' }); // ✅ 对象
const items = ref([1, 2, 3]); // ✅ 数组
```

**reactive**：只能用于对象

```typescript
const state = reactive({ count: 0 }); // ✅ 对象
const state = reactive([1, 2, 3]); // ✅ 数组（也是对象）
const count = reactive(0); // ❌ 错误：基本类型不行
const message = reactive('Hello'); // ❌ 错误：基本类型不行
```

### 2. 访问方式

**ref**：需要使用 `.value` 访问

<details>
<summary>点此展开 ref 访问示例</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

// 在 JavaScript 中需要使用 .value
console.log(count.value); // 0
count.value = 10;

// 在模板中自动解包，不需要 .value
</script>

<template>
  <div>{{ count }}</div>
  <!-- 自动解包，不需要 .value -->
</template>
```

</details>

**reactive**：直接访问属性

<details>
<summary>点此展开 reactive 访问示例</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

// 直接访问属性
console.log(state.count); // 0
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. 重新赋值

**ref**：可以重新赋值

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // ✅ 可以重新赋值
```

**reactive**：不能重新赋值（会失去响应式）

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // ❌ 失去响应式，不会触发更新
```

### 4. 解构

**ref**：解构后仍保持响应式

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // 解构基本值，失去响应式

// 但可以解构 ref 本身
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive**：解构后失去响应式

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // ❌ 失去响应式

// 需要使用 toRefs 保持响应式
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // ✅ 保持响应式
```

## 3. When to Use ref vs reactive?

> 何时使用 ref？何时使用 reactive？

### 使用 ref 的情况

1. **基本类型值**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **需要重新赋值的对象**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // 可以重新赋值
   ```

3. **模板引用（Template Refs）**

   ```vue
   <template>
     <div ref="container"></div>
   </template>
   <script setup>
   const container = ref(null);
   </script>
   ```

4. **需要解构的情况**
   ```typescript
   const state = ref({ count: 0, message: 'Hello' });
   // 解构基本值没问题
   ```

### 使用 reactive 的情况

1. **复杂的对象状态**

   ```typescript
   const formState = reactive({
     username: '',
     password: '',
     errors: {},
   });
   ```

2. **不需要重新赋值的状态**

   ```typescript
   const config = reactive({
     apiUrl: 'https://api.example.com',
     timeout: 5000,
   });
   ```

3. **多个相关属性组织在一起**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> 常见面试题目

### 题目 1：基本差异

请说明以下代码的差异和输出结果。

```typescript
// 情况 1：使用 ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// 情况 2：使用 reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// 情况 3：reactive 重新赋值
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>点击查看答案</summary>

```typescript
// 情况 1：使用 ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // 10 ✅

// 情况 2：使用 reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // 10 ✅

// 情况 3：reactive 重新赋值
let state2 = reactive({ count: 0 });
state2 = { count: 10 }; // ❌ 失去响应式
console.log(state2.count); // 10（值正确，但失去响应式）
// 后续修改 state2.count 不会触发视图更新
```

**关键差异**：

- `ref` 需要 `.value` 访问
- `reactive` 直接访问属性
- `reactive` 不能重新赋值，会失去响应式

</details>

### 题目 2：解构问题

请说明以下代码的问题并提供解决方案。

```typescript
// 情况 1：ref 解构
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// 情况 2：reactive 解构
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>点击查看答案</summary>

**情况 1：ref 解构**

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ❌ 不会更新 user.value.name

// 正确做法：修改 ref 的值
user.value.name = 'Jane'; // ✅
// 或重新赋值
user.value = { name: 'Jane', age: 30 }; // ✅
```

**情况 2：reactive 解构**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ❌ 失去响应式，不会触发更新

// 正确做法 1：直接修改属性
state.count = 10; // ✅

// 正确做法 2：使用 toRefs 保持响应式
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // ✅ 现在是 ref，需要使用 .value
```

**总结**：

- 解构基本值会失去响应式
- `reactive` 解构需要使用 `toRefs` 保持响应式
- `ref` 解构对象属性也会失去响应式，应该直接修改 `.value`

</details>

### 题目 3：选择 ref 还是 reactive？

请说明以下场景应该使用 `ref` 还是 `reactive`。

```typescript
// 场景 1：计数器
const count = ?;

// 场景 2：表单状态
const form = ?;

// 场景 3：用户数据（可能需要重新赋值）
const user = ?;

// 场景 4：模板引用
const inputRef = ?;
```

<details>
<summary>点击查看答案</summary>

```typescript
// 场景 1：计数器（基本类型）
const count = ref(0); // ✅ ref

// 场景 2：表单状态（复杂对象，不需要重新赋值）
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // ✅ reactive

// 场景 3：用户数据（可能需要重新赋值）
const user = ref({ name: 'John', age: 30 }); // ✅ ref（可以重新赋值）

// 场景 4：模板引用
const inputRef = ref(null); // ✅ ref（模板引用必须用 ref）
```

**选择原则**：

- 基本类型 → `ref`
- 需要重新赋值的对象 → `ref`
- 模板引用 → `ref`
- 复杂对象状态，不需要重新赋值 → `reactive`

</details>

## 5. Best Practices

> 最佳实践

### 推荐做法

```typescript
// 1. 基本类型使用 ref
const count = ref(0);
const message = ref('Hello');

// 2. 复杂状态使用 reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3. 需要重新赋值使用 ref
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // ✅

// 4. reactive 解构使用 toRefs
import { toRefs } from 'vue';
const { count, message } = toRefs(state);

// 5. 统一风格：团队可以选择主要使用 ref 或 reactive
```

### 避免的做法

```typescript
// 1. 不要用 reactive 创建基本类型
const count = reactive(0); // ❌ 错误

// 2. 不要重新赋值 reactive
let state = reactive({ count: 0 });
state = { count: 10 }; // ❌ 失去响应式

// 3. 不要直接解构 reactive
const { count } = reactive({ count: 0 }); // ❌ 失去响应式

// 4. 不要在模板中忘记 .value（ref 的情况）
// 模板中不需要 .value，但 JavaScript 中需要
```

## 6. Interview Summary

> 面试总结

### 快速记忆

**ref**：

- 适用于任何类型
- 需要使用 `.value` 访问
- 可以重新赋值
- 模板中自动解包

**reactive**：

- 只能用于对象
- 直接访问属性
- 不能重新赋值
- 解构需要使用 `toRefs`

**选择原则**：

- 基本类型 → `ref`
- 需要重新赋值 → `ref`
- 复杂对象状态 → `reactive`

### 面试回答示例

**Q: ref 和 reactive 的差异是什么？**

> "ref 和 reactive 都是 Vue 3 用来创建响应式数据的 API。主要差异包括：1) 适用类型：ref 可以用于任何类型，reactive 只能用于对象；2) 访问方式：ref 需要使用 .value 访问，reactive 直接访问属性；3) 重新赋值：ref 可以重新赋值，reactive 不能重新赋值否则会失去响应式；4) 解构：reactive 解构需要使用 toRefs 保持响应式。一般来说，基本类型和需要重新赋值的对象使用 ref，复杂的对象状态使用 reactive。"

**Q: 什么时候应该使用 ref？什么时候使用 reactive？**

> "使用 ref 的情况：1) 基本类型值（数字、字符串、布尔值）；2) 需要重新赋值的对象；3) 模板引用。使用 reactive 的情况：1) 复杂的对象状态，多个相关属性组织在一起；2) 不需要重新赋值的状态。实际开发中，很多团队会统一使用 ref，因为它更灵活且适用范围更广。"

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
