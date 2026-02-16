---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> 什么是 watch 和 watchEffect？

`watch` 和 `watchEffect` 是 Vue 3 Composition API 中用来监听响应式数据变化的两个 API。

### watch

**定义**：明确指定要监听的数据源，当数据变化时执行回调函数。

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// 监听单一数据源
watch(count, (newValue, oldValue) => {
  console.log(`count 从 ${oldValue} 变为 ${newValue}`);
});

// 监听多个数据源
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count 或 message 改变了');
});
</script>
```

### watchEffect

**定义**：自动追踪回调函数中使用的响应式数据，当这些数据变化时自动执行。

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// 自动追踪 count 和 message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // 当 count 或 message 改变时，自动执行
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> watch 与 watchEffect 的主要差异

### 1. 数据源指定

**watch**：明确指定要监听的数据

```typescript
const count = ref(0);
const message = ref('Hello');

// 明确指定监听 count
watch(count, (newVal, oldVal) => {
  console.log('count 改变了');
});

// 明确指定监听多个数据
watch([count, message], ([newCount, newMessage]) => {
  console.log('count 或 message 改变了');
});
```

**watchEffect**：自动追踪使用的数据

```typescript
const count = ref(0);
const message = ref('Hello');

// 自动追踪 count 和 message（因为在回调中使用了）
watchEffect(() => {
  console.log(count.value); // 自动追踪 count
  console.log(message.value); // 自动追踪 message
});
```

### 2. 执行时机

**watch**：默认懒执行（lazy），只在数据变化时执行

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('执行'); // 只在 count 改变时执行
});

count.value = 1; // 触发执行
```

**watchEffect**：立即执行，然后追踪变化

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('执行'); // 立即执行一次
  console.log(count.value);
});

count.value = 1; // 再次执行
```

### 3. 旧值访问

**watch**：可以访问旧值

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`从 ${oldVal} 变为 ${newVal}`);
});
```

**watchEffect**：无法访问旧值

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // 只能访问当前值
  // 无法获取旧值
});
```

### 4. 停止监听

**watch**：返回停止函数

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// 停止监听
stopWatch();
```

**watchEffect**：返回停止函数

```typescript
const count = ref(0);

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

// 停止监听
stopEffect();
```

## 3. When to Use watch vs watchEffect?

> 何时使用 watch？何时使用 watchEffect？

### 使用 watch 的情况

1. **需要明确指定监听的数据**
   ```typescript
   watch(userId, (newId) => {
     fetchUser(newId);
   });
   ```

2. **需要访问旧值**
   ```typescript
   watch(count, (newVal, oldVal) => {
     console.log(`从 ${oldVal} 变为 ${newVal}`);
   });
   ```

3. **需要懒执行（只在变化时执行）**
   ```typescript
   watch(searchQuery, (newQuery) => {
     if (newQuery.length > 2) {
       search(newQuery);
     }
   });
   ```

4. **需要更精细的控制**
   ```typescript
   watch(
     () => user.value.id,
     (newId) => {
       fetchUser(newId);
     },
     { immediate: true, deep: true }
   );
   ```

### 使用 watchEffect 的情况

1. **自动追踪多个相关数据**
   ```typescript
   watchEffect(() => {
     // 自动追踪所有使用的响应式数据
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **不需要旧值**
   ```typescript
   watchEffect(() => {
     console.log(`当前计数：${count.value}`);
   });
   ```

3. **需要立即执行**
   ```typescript
   watchEffect(() => {
     // 立即执行，然后追踪变化
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> 常见面试题目

### 题目 1：基本差异

请说明以下代码的执行顺序和输出结果。

```typescript
const count = ref(0);
const message = ref('Hello');

// watch
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>点击查看答案</summary>

```typescript
const count = ref(0);
const message = ref('Hello');

// watch：懒执行，不会立即执行
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect：立即执行
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // 立即输出：watchEffect: 0 Hello
});

count.value = 1;
// 触发 watch：watch: 1
// 触发 watchEffect：watchEffect: 1 Hello

message.value = 'World';
// watch 不监听 message，不执行
// watchEffect 监听 message，执行：watchEffect: 1 World
```

**输出顺序**：
1. `watchEffect: 0 Hello`（立即执行）
2. `watch: 1`（count 改变）
3. `watchEffect: 1 Hello`（count 改变）
4. `watchEffect: 1 World`（message 改变）

**关键差异**：
- `watch` 懒执行，只在监听的数据变化时执行
- `watchEffect` 立即执行，然后追踪所有使用的数据

</details>

### 题目 2：旧值访问

请说明如何在使用 `watchEffect` 时获取旧值。

<details>
<summary>点击查看答案</summary>

**问题**：`watchEffect` 无法直接访问旧值

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // 只能访问当前值
  // 无法获取旧值
});
```

**解决方案 1：使用 ref 存储旧值**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`从 ${prevCount.value} 变为 ${count.value}`);
  prevCount.value = count.value; // 更新旧值
});
```

**解决方案 2：使用 watch（如果需要旧值）**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`从 ${oldVal} 变为 ${newVal}`);
});
```

**建议**：
- 如果需要旧值，优先使用 `watch`
- `watchEffect` 适合不需要旧值的场景

</details>

### 题目 3：选择 watch 还是 watchEffect？

请说明以下场景应该使用 `watch` 还是 `watchEffect`。

```typescript
// 场景 1：监听用户 ID 变化，重新加载用户数据
const userId = ref(1);
// ?

// 场景 2：当表单验证通过时，自动启用提交按钮
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// 场景 3：监听搜索关键字，执行搜索（需要防抖）
const searchQuery = ref('');
// ?
```

<details>
<summary>点击查看答案</summary>

**场景 1：监听用户 ID**

```typescript
const userId = ref(1);

// ✅ 使用 watch：明确指定监听的数据
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**场景 2：表单验证**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// ✅ 使用 watchEffect：自动追踪相关数据
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**场景 3：搜索（需要防抖）**

```typescript
const searchQuery = ref('');

// ✅ 使用 watch：需要更精细的控制（防抖）
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

**选择原则**：
- 明确指定监听数据 → `watch`
- 自动追踪多个相关数据 → `watchEffect`
- 需要旧值或精细控制 → `watch`
- 需要立即执行 → `watchEffect`

</details>

## 5. Best Practices

> 最佳实践

### 推荐做法

```typescript
// 1. 明确指定监听数据时使用 watch
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. 自动追踪多个相关数据时使用 watchEffect
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3. 需要旧值时使用 watch
watch(count, (newVal, oldVal) => {
  console.log(`从 ${oldVal} 变为 ${newVal}`);
});

// 4. 记得清理监听器
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### 避免的做法

```typescript
// 1. 不要在 watchEffect 中进行异步操作而不处理清理
watchEffect(async () => {
  const data = await fetchData(); // ❌ 可能导致内存泄漏
  // ...
});

// 2. 不要过度使用 watchEffect
// 如果只需要监听特定数据，使用 watch 更明确
watchEffect(() => {
  console.log(count.value); // ⚠️ 如果只需要监听 count，watch 更合适
});

// 3. 不要在 watchEffect 中修改监听的数据（可能造成无限循环）
watchEffect(() => {
  count.value++; // ❌ 可能造成无限循环
});
```

## 6. Interview Summary

> 面试总结

### 快速记忆

**watch**：
- 明确指定监听的数据
- 懒执行（默认）
- 可以访问旧值
- 适合需要精细控制的场景

**watchEffect**：
- 自动追踪使用的数据
- 立即执行
- 无法访问旧值
- 适合自动追踪多个相关数据

**选择原则**：
- 明确指定监听 → `watch`
- 自动追踪 → `watchEffect`
- 需要旧值 → `watch`
- 需要立即执行 → `watchEffect`

### 面试回答示例

**Q: watch 和 watchEffect 的差异是什么？**

> "watch 和 watchEffect 都是 Vue 3 用来监听响应式数据变化的 API。主要差异包括：1) 数据源：watch 需要明确指定要监听的数据，watchEffect 自动追踪回调函数中使用的响应式数据；2) 执行时机：watch 默认懒执行，只在数据变化时执行，watchEffect 立即执行然后追踪变化；3) 旧值访问：watch 可以访问旧值，watchEffect 无法访问旧值；4) 使用场景：watch 适合需要明确指定监听数据或需要旧值的场景，watchEffect 适合自动追踪多个相关数据的场景。"

**Q: 什么时候应该使用 watch？什么时候使用 watchEffect？**

> "使用 watch 的情况：1) 需要明确指定监听的数据；2) 需要访问旧值；3) 需要懒执行，只在变化时执行；4) 需要更精细的控制（如 immediate、deep 选项）。使用 watchEffect 的情况：1) 自动追踪多个相关数据；2) 不需要旧值；3) 需要立即执行。一般来说，如果只需要监听特定数据，使用 watch 更明确；如果需要自动追踪多个相关数据，使用 watchEffect 更方便。"

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
