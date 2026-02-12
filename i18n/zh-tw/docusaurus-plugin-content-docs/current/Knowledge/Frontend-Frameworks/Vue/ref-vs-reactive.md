---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> 什麼是 ref 和 reactive？

`ref` 和 `reactive` 是 Vue 3 Composition API 中用來建立響應式資料的兩個核心 API。

### ref

**定義**：`ref` 用來建立一個響應式的**基本型別值**或**物件引用**。

<details>
<summary>點此展開 ref 基本範例</summary>

```vue
<script setup>
import { ref } from 'vue';

// 基本型別
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// 物件（也可以使用 ref）
const user = ref({
  name: 'John',
  age: 30,
});

// 存取時需要使用 .value
console.log(count.value); // 0
count.value++; // 修改值
</script>
```

</details>

### reactive

**定義**：`reactive` 用來建立一個響應式的**物件**（不能直接用於基本型別）。

<details>
<summary>點此展開 reactive 基本範例</summary>

```vue
<script setup>
import { reactive } from 'vue';

// 只能用於物件
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// 直接存取屬性，不需要 .value
console.log(state.count); // 0
state.count++; // 修改值
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> ref 與 reactive 的主要差異

### 1. 適用型別

**ref**：可以用於任何型別

```typescript
const count = ref(0); // ✅ 數字
const message = ref('Hello'); // ✅ 字串
const isActive = ref(true); // ✅ 布林值
const user = ref({ name: 'John' }); // ✅ 物件
const items = ref([1, 2, 3]); // ✅ 陣列
```

**reactive**：只能用於物件

```typescript
const state = reactive({ count: 0 }); // ✅ 物件
const state = reactive([1, 2, 3]); // ✅ 陣列（也是物件）
const count = reactive(0); // ❌ 錯誤：基本型別不行
const message = reactive('Hello'); // ❌ 錯誤：基本型別不行
```

### 2. 存取方式

**ref**：需要使用 `.value` 存取

<details>
<summary>點此展開 ref 存取範例</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

// 在 JavaScript 中需要使用 .value
console.log(count.value); // 0
count.value = 10;

// 在模板中自動解包，不需要 .value
</script>

<template>
  <div>{{ count }}</div>
  <!-- 自動解包，不需要 .value -->
</template>
```

</details>

**reactive**：直接存取屬性

<details>
<summary>點此展開 reactive 存取範例</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

// 直接存取屬性
console.log(state.count); // 0
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. 重新賦值

**ref**：可以重新賦值

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // ✅ 可以重新賦值
```

**reactive**：不能重新賦值（會失去響應式）

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // ❌ 失去響應式，不會觸發更新
```

### 4. 解構

**ref**：解構後仍保持響應式

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // 解構基本值，失去響應式

// 但可以解構 ref 本身
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive**：解構後失去響應式

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // ❌ 失去響應式

// 需要使用 toRefs 保持響應式
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // ✅ 保持響應式
```

## 3. When to Use ref vs reactive?

> 何時使用 ref？何時使用 reactive？

### 使用 ref 的情況

1. **基本型別值**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **需要重新賦值的物件**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // 可以重新賦值
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

4. **需要解構的情況**
   ```typescript
   const state = ref({ count: 0, message: 'Hello' });
   // 解構基本值沒問題
   ```

### 使用 reactive 的情況

1. **複雜的物件狀態**

   ```typescript
   const formState = reactive({
     username: '',
     password: '',
     errors: {},
   });
   ```

2. **不需要重新賦值的狀態**

   ```typescript
   const config = reactive({
     apiUrl: 'https://api.example.com',
     timeout: 5000,
   });
   ```

3. **多個相關屬性組織在一起**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> 常見面試題目

### 題目 1：基本差異

請說明以下程式碼的差異和輸出結果。

```typescript
// 情況 1：使用 ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// 情況 2：使用 reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// 情況 3：reactive 重新賦值
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>點擊查看答案</summary>

```typescript
// 情況 1：使用 ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // 10 ✅

// 情況 2：使用 reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // 10 ✅

// 情況 3：reactive 重新賦值
let state2 = reactive({ count: 0 });
state2 = { count: 10 }; // ❌ 失去響應式
console.log(state2.count); // 10（值正確，但失去響應式）
// 後續修改 state2.count 不會觸發視圖更新
```

**關鍵差異**：

- `ref` 需要 `.value` 存取
- `reactive` 直接存取屬性
- `reactive` 不能重新賦值，會失去響應式

</details>

### 題目 2：解構問題

請說明以下程式碼的問題並提供解決方案。

```typescript
// 情況 1：ref 解構
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// 情況 2：reactive 解構
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>點擊查看答案</summary>

**情況 1：ref 解構**

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ❌ 不會更新 user.value.name

// 正確做法：修改 ref 的值
user.value.name = 'Jane'; // ✅
// 或重新賦值
user.value = { name: 'Jane', age: 30 }; // ✅
```

**情況 2：reactive 解構**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ❌ 失去響應式，不會觸發更新

// 正確做法 1：直接修改屬性
state.count = 10; // ✅

// 正確做法 2：使用 toRefs 保持響應式
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // ✅ 現在是 ref，需要使用 .value
```

**總結**：

- 解構基本值會失去響應式
- `reactive` 解構需要使用 `toRefs` 保持響應式
- `ref` 解構物件屬性也會失去響應式，應該直接修改 `.value`

</details>

### 題目 3：選擇 ref 還是 reactive？

請說明以下場景應該使用 `ref` 還是 `reactive`。

```typescript
// 場景 1：計數器
const count = ?;

// 場景 2：表單狀態
const form = ?;

// 場景 3：使用者資料（可能需要重新賦值）
const user = ?;

// 場景 4：模板引用
const inputRef = ?;
```

<details>
<summary>點擊查看答案</summary>

```typescript
// 場景 1：計數器（基本型別）
const count = ref(0); // ✅ ref

// 場景 2：表單狀態（複雜物件，不需要重新賦值）
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // ✅ reactive

// 場景 3：使用者資料（可能需要重新賦值）
const user = ref({ name: 'John', age: 30 }); // ✅ ref（可以重新賦值）

// 場景 4：模板引用
const inputRef = ref(null); // ✅ ref（模板引用必須用 ref）
```

**選擇原則**：

- 基本型別 → `ref`
- 需要重新賦值的物件 → `ref`
- 模板引用 → `ref`
- 複雜物件狀態，不需要重新賦值 → `reactive`

</details>

## 5. Best Practices

> 最佳實踐

### 推薦做法

```typescript
// 1. 基本型別使用 ref
const count = ref(0);
const message = ref('Hello');

// 2. 複雜狀態使用 reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3. 需要重新賦值使用 ref
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // ✅

// 4. reactive 解構使用 toRefs
import { toRefs } from 'vue';
const { count, message } = toRefs(state);

// 5. 統一風格：團隊可以選擇主要使用 ref 或 reactive
```

### 避免的做法

```typescript
// 1. 不要用 reactive 建立基本型別
const count = reactive(0); // ❌ 錯誤

// 2. 不要重新賦值 reactive
let state = reactive({ count: 0 });
state = { count: 10 }; // ❌ 失去響應式

// 3. 不要直接解構 reactive
const { count } = reactive({ count: 0 }); // ❌ 失去響應式

// 4. 不要在模板中忘記 .value（ref 的情況）
// 模板中不需要 .value，但 JavaScript 中需要
```

## 6. Interview Summary

> 面試總結

### 快速記憶

**ref**：

- 適用於任何型別
- 需要使用 `.value` 存取
- 可以重新賦值
- 模板中自動解包

**reactive**：

- 只能用於物件
- 直接存取屬性
- 不能重新賦值
- 解構需要使用 `toRefs`

**選擇原則**：

- 基本型別 → `ref`
- 需要重新賦值 → `ref`
- 複雜物件狀態 → `reactive`

### 面試回答範例

**Q: ref 和 reactive 的差異是什麼？**

> "ref 和 reactive 都是 Vue 3 用來建立響應式資料的 API。主要差異包括：1) 適用型別：ref 可以用於任何型別，reactive 只能用於物件；2) 存取方式：ref 需要使用 .value 存取，reactive 直接存取屬性；3) 重新賦值：ref 可以重新賦值，reactive 不能重新賦值否則會失去響應式；4) 解構：reactive 解構需要使用 toRefs 保持響應式。一般來說，基本型別和需要重新賦值的物件使用 ref，複雜的物件狀態使用 reactive。"

**Q: 什麼時候應該使用 ref？什麼時候使用 reactive？**

> "使用 ref 的情況：1) 基本型別值（數字、字串、布林值）；2) 需要重新賦值的物件；3) 模板引用。使用 reactive 的情況：1) 複雜的物件狀態，多個相關屬性組織在一起；2) 不需要重新賦值的狀態。實際開發中，很多團隊會統一使用 ref，因為它更靈活且適用範圍更廣。"

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
