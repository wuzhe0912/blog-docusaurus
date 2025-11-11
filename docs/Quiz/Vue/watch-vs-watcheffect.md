---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> 什麼是 watch 和 watchEffect？

`watch` 和 `watchEffect` 是 Vue 3 Composition API 中用來監聽響應式資料變化的兩個 API。

### watch

**定義**：明確指定要監聽的資料來源，當資料變化時執行回調函式。

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// 監聽單一資料來源
watch(count, (newValue, oldValue) => {
  console.log(`count 從 ${oldValue} 變為 ${newValue}`);
});

// 監聽多個資料來源
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count 或 message 改變了');
});
</script>
```

### watchEffect

**定義**：自動追蹤回調函式中使用的響應式資料，當這些資料變化時自動執行。

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// 自動追蹤 count 和 message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // 當 count 或 message 改變時，自動執行
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> watch 與 watchEffect 的主要差異

### 1. 資料來源指定

**watch**：明確指定要監聽的資料

```typescript
const count = ref(0);
const message = ref('Hello');

// 明確指定監聽 count
watch(count, (newVal, oldVal) => {
  console.log('count 改變了');
});

// 明確指定監聽多個資料
watch([count, message], ([newCount, newMessage]) => {
  console.log('count 或 message 改變了');
});
```

**watchEffect**：自動追蹤使用的資料

```typescript
const count = ref(0);
const message = ref('Hello');

// 自動追蹤 count 和 message（因為在回調中使用了）
watchEffect(() => {
  console.log(count.value); // 自動追蹤 count
  console.log(message.value); // 自動追蹤 message
});
```

### 2. 執行時機

**watch**：預設懶執行（lazy），只在資料變化時執行

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('執行'); // 只在 count 改變時執行
});

count.value = 1; // 觸發執行
```

**watchEffect**：立即執行，然後追蹤變化

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('執行'); // 立即執行一次
  console.log(count.value);
});

count.value = 1; // 再次執行
```

### 3. 舊值存取

**watch**：可以存取舊值

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`從 ${oldVal} 變為 ${newVal}`);
});
```

**watchEffect**：無法存取舊值

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // 只能存取當前值
  // 無法取得舊值
});
```

### 4. 停止監聽

**watch**：回傳停止函式

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// 停止監聽
stopWatch();
```

**watchEffect**：回傳停止函式

```typescript
const count = ref(0);

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

// 停止監聽
stopEffect();
```

## 3. When to Use watch vs watchEffect?

> 何時使用 watch？何時使用 watchEffect？

### 使用 watch 的情況

1. **需要明確指定監聽的資料**
   ```typescript
   watch(userId, (newId) => {
     fetchUser(newId);
   });
   ```

2. **需要存取舊值**
   ```typescript
   watch(count, (newVal, oldVal) => {
     console.log(`從 ${oldVal} 變為 ${newVal}`);
   });
   ```

3. **需要懶執行（只在變化時執行）**
   ```typescript
   watch(searchQuery, (newQuery) => {
     if (newQuery.length > 2) {
       search(newQuery);
     }
   });
   ```

4. **需要更精細的控制**
   ```typescript
   watch(
     () => user.value.id,
     (newId) => {
       fetchUser(newId);
     },
     { immediate: true, deep: true }
   );
   ```

### 使用 watchEffect 的情況

1. **自動追蹤多個相關資料**
   ```typescript
   watchEffect(() => {
     // 自動追蹤所有使用的響應式資料
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **不需要舊值**
   ```typescript
   watchEffect(() => {
     console.log(`當前計數：${count.value}`);
   });
   ```

3. **需要立即執行**
   ```typescript
   watchEffect(() => {
     // 立即執行，然後追蹤變化
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> 常見面試題目

### 題目 1：基本差異

請說明以下程式碼的執行順序和輸出結果。

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
<summary>點擊查看答案</summary>

```typescript
const count = ref(0);
const message = ref('Hello');

// watch：懶執行，不會立即執行
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect：立即執行
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // 立即輸出：watchEffect: 0 Hello
});

count.value = 1;
// 觸發 watch：watch: 1
// 觸發 watchEffect：watchEffect: 1 Hello

message.value = 'World';
// watch 不監聽 message，不執行
// watchEffect 監聽 message，執行：watchEffect: 1 World
```

**輸出順序**：
1. `watchEffect: 0 Hello`（立即執行）
2. `watch: 1`（count 改變）
3. `watchEffect: 1 Hello`（count 改變）
4. `watchEffect: 1 World`（message 改變）

**關鍵差異**：
- `watch` 懶執行，只在監聽的資料變化時執行
- `watchEffect` 立即執行，然後追蹤所有使用的資料

</details>

### 題目 2：舊值存取

請說明如何在使用 `watchEffect` 時取得舊值。

<details>
<summary>點擊查看答案</summary>

**問題**：`watchEffect` 無法直接存取舊值

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // 只能存取當前值
  // 無法取得舊值
});
```

**解決方案 1：使用 ref 儲存舊值**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`從 ${prevCount.value} 變為 ${count.value}`);
  prevCount.value = count.value; // 更新舊值
});
```

**解決方案 2：使用 watch（如果需要舊值）**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`從 ${oldVal} 變為 ${newVal}`);
});
```

**建議**：
- 如果需要舊值，優先使用 `watch`
- `watchEffect` 適合不需要舊值的場景

</details>

### 題目 3：選擇 watch 還是 watchEffect？

請說明以下場景應該使用 `watch` 還是 `watchEffect`。

```typescript
// 場景 1：監聽使用者 ID 變化，重新載入使用者資料
const userId = ref(1);
// ?

// 場景 2：當表單驗證通過時，自動啟用提交按鈕
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// 場景 3：監聽搜尋關鍵字，執行搜尋（需要防抖）
const searchQuery = ref('');
// ?
```

<details>
<summary>點擊查看答案</summary>

**場景 1：監聽使用者 ID**

```typescript
const userId = ref(1);

// ✅ 使用 watch：明確指定監聽的資料
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**場景 2：表單驗證**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// ✅ 使用 watchEffect：自動追蹤相關資料
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**場景 3：搜尋（需要防抖）**

```typescript
const searchQuery = ref('');

// ✅ 使用 watch：需要更精細的控制（防抖）
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

**選擇原則**：
- 明確指定監聽資料 → `watch`
- 自動追蹤多個相關資料 → `watchEffect`
- 需要舊值或精細控制 → `watch`
- 需要立即執行 → `watchEffect`

</details>

## 5. Best Practices

> 最佳實踐

### 推薦做法

```typescript
// 1. 明確指定監聽資料時使用 watch
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. 自動追蹤多個相關資料時使用 watchEffect
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3. 需要舊值時使用 watch
watch(count, (newVal, oldVal) => {
  console.log(`從 ${oldVal} 變為 ${newVal}`);
});

// 4. 記得清理監聽器
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### 避免的做法

```typescript
// 1. 不要在 watchEffect 中進行非同步操作而不處理清理
watchEffect(async () => {
  const data = await fetchData(); // ❌ 可能導致記憶體洩漏
  // ...
});

// 2. 不要過度使用 watchEffect
// 如果只需要監聽特定資料，使用 watch 更明確
watchEffect(() => {
  console.log(count.value); // ⚠️ 如果只需要監聽 count，watch 更合適
});

// 3. 不要在 watchEffect 中修改監聽的資料（可能造成無限迴圈）
watchEffect(() => {
  count.value++; // ❌ 可能造成無限迴圈
});
```

## 6. Interview Summary

> 面試總結

### 快速記憶

**watch**：
- 明確指定監聽的資料
- 懶執行（預設）
- 可以存取舊值
- 適合需要精細控制的場景

**watchEffect**：
- 自動追蹤使用的資料
- 立即執行
- 無法存取舊值
- 適合自動追蹤多個相關資料

**選擇原則**：
- 明確指定監聽 → `watch`
- 自動追蹤 → `watchEffect`
- 需要舊值 → `watch`
- 需要立即執行 → `watchEffect`

### 面試回答範例

**Q: watch 和 watchEffect 的差異是什麼？**

> "watch 和 watchEffect 都是 Vue 3 用來監聽響應式資料變化的 API。主要差異包括：1) 資料來源：watch 需要明確指定要監聽的資料，watchEffect 自動追蹤回調函式中使用的響應式資料；2) 執行時機：watch 預設懶執行，只在資料變化時執行，watchEffect 立即執行然後追蹤變化；3) 舊值存取：watch 可以存取舊值，watchEffect 無法存取舊值；4) 使用場景：watch 適合需要明確指定監聽資料或需要舊值的場景，watchEffect 適合自動追蹤多個相關資料的場景。"

**Q: 什麼時候應該使用 watch？什麼時候使用 watchEffect？**

> "使用 watch 的情況：1) 需要明確指定監聽的資料；2) 需要存取舊值；3) 需要懶執行，只在變化時執行；4) 需要更精細的控制（如 immediate、deep 選項）。使用 watchEffect 的情況：1) 自動追蹤多個相關資料；2) 不需要舊值；3) 需要立即執行。一般來說，如果只需要監聽特定資料，使用 watch 更明確；如果需要自動追蹤多個相關資料，使用 watchEffect 更方便。"

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)

