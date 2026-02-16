---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> watch と watchEffect とは？

`watch` と `watchEffect` は Vue 3 Composition API でリアクティブデータの変化を監視するための2つの API です。

### watch

**定義**：監視するデータソースを明示的に指定し、データが変化した時にコールバック関数を実行します。

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// 単一のデータソースを監視
watch(count, (newValue, oldValue) => {
  console.log(`count が ${oldValue} から ${newValue} に変化`);
});

// 複数のデータソースを監視
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count または message が変更された');
});
</script>
```

### watchEffect

**定義**：コールバック関数内で使用されるリアクティブデータを自動追跡し、それらのデータが変化した時に自動的に実行します。

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// count と message を自動追跡
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // count または message が変更された時、自動実行
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> watch と watchEffect の主な違い

### 1. データソースの指定

**watch**：監視するデータを明示的に指定

```typescript
const count = ref(0);
const message = ref('Hello');

// count の監視を明示的に指定
watch(count, (newVal, oldVal) => {
  console.log('count が変更された');
});

// 複数のデータの監視を明示的に指定
watch([count, message], ([newCount, newMessage]) => {
  console.log('count または message が変更された');
});
```

**watchEffect**：使用するデータを自動追跡

```typescript
const count = ref(0);
const message = ref('Hello');

// count と message を自動追跡（コールバック内で使用しているため）
watchEffect(() => {
  console.log(count.value); // count を自動追跡
  console.log(message.value); // message を自動追跡
});
```

### 2. 実行タイミング

**watch**：デフォルトで遅延実行（lazy）、データ変化時のみ実行

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('実行'); // count が変更された時のみ実行
});

count.value = 1; // 実行をトリガー
```

**watchEffect**：即時実行し、その後変化を追跡

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('実行'); // 即座に一度実行
  console.log(count.value);
});

count.value = 1; // 再度実行
```

### 3. 旧値のアクセス

**watch**：旧値にアクセス可能

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`${oldVal} から ${newVal} に変化`);
});
```

**watchEffect**：旧値にアクセス不可

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // 現在の値のみアクセス可能
  // 旧値は取得不可
});
```

### 4. 監視の停止

**watch**：停止関数を返す

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// 監視を停止
stopWatch();
```

**watchEffect**：停止関数を返す

```typescript
const count = ref(0);

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

// 監視を停止
stopEffect();
```

## 3. When to Use watch vs watchEffect?

> watch と watchEffect をいつ使うべきか？

### watch を使用する場合

1. **監視するデータを明示的に指定する必要がある**
   ```typescript
   watch(userId, (newId) => {
     fetchUser(newId);
   });
   ```

2. **旧値へのアクセスが必要**
   ```typescript
   watch(count, (newVal, oldVal) => {
     console.log(`${oldVal} から ${newVal} に変化`);
   });
   ```

3. **遅延実行が必要（変化時のみ実行）**
   ```typescript
   watch(searchQuery, (newQuery) => {
     if (newQuery.length > 2) {
       search(newQuery);
     }
   });
   ```

4. **より細かい制御が必要**
   ```typescript
   watch(
     () => user.value.id,
     (newId) => {
       fetchUser(newId);
     },
     { immediate: true, deep: true }
   );
   ```

### watchEffect を使用する場合

1. **複数の関連データを自動追跡**
   ```typescript
   watchEffect(() => {
     // 使用するすべてのリアクティブデータを自動追跡
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **旧値が不要**
   ```typescript
   watchEffect(() => {
     console.log(`現在のカウント：${count.value}`);
   });
   ```

3. **即時実行が必要**
   ```typescript
   watchEffect(() => {
     // 即時実行し、その後変化を追跡
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> よくある面接質問

### 問題 1：基本的な違い

以下のコードの実行順序と出力結果を説明してください。

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
<summary>回答を表示</summary>

```typescript
const count = ref(0);
const message = ref('Hello');

// watch：遅延実行、即座には実行されない
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect：即時実行
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // 即座に出力：watchEffect: 0 Hello
});

count.value = 1;
// watch をトリガー：watch: 1
// watchEffect をトリガー：watchEffect: 1 Hello

message.value = 'World';
// watch は message を監視していないため、実行されない
// watchEffect は message を監視しているため、実行：watchEffect: 1 World
```

**出力順序**：
1. `watchEffect: 0 Hello`（即時実行）
2. `watch: 1`（count が変更）
3. `watchEffect: 1 Hello`（count が変更）
4. `watchEffect: 1 World`（message が変更）

**主な違い**：
- `watch` は遅延実行で、監視するデータが変化した時のみ実行
- `watchEffect` は即時実行し、使用するすべてのデータを追跡

</details>

### 問題 2：旧値のアクセス

`watchEffect` 使用時に旧値を取得する方法を説明してください。

<details>
<summary>回答を表示</summary>

**問題**：`watchEffect` は旧値に直接アクセスできない

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // 現在の値のみアクセス可能
  // 旧値は取得不可
});
```

**解決策 1：ref で旧値を保存**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`${prevCount.value} から ${count.value} に変化`);
  prevCount.value = count.value; // 旧値を更新
});
```

**解決策 2：watch を使用（旧値が必要な場合）**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`${oldVal} から ${newVal} に変化`);
});
```

**推奨**：
- 旧値が必要な場合は、優先的に `watch` を使用
- `watchEffect` は旧値が不要な場面に適している

</details>

### 問題 3：watch と watchEffect のどちらを選ぶか？

以下の場面で `watch` と `watchEffect` のどちらを使うべきか説明してください。

```typescript
// 場面 1：ユーザー ID の変化を監視し、ユーザーデータを再読み込み
const userId = ref(1);
// ?

// 場面 2：フォームバリデーションが通った時、送信ボタンを自動的に有効化
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// 場面 3：検索キーワードを監視し、検索を実行（デバウンスが必要）
const searchQuery = ref('');
// ?
```

<details>
<summary>回答を表示</summary>

**場面 1：ユーザー ID の監視**

```typescript
const userId = ref(1);

// ✅ watch を使用：監視するデータを明示的に指定
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**場面 2：フォームバリデーション**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// ✅ watchEffect を使用：関連データを自動追跡
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**場面 3：検索（デバウンスが必要）**

```typescript
const searchQuery = ref('');

// ✅ watch を使用：より細かい制御が必要（デバウンス）
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

**選択の原則**：
- 監視データを明示的に指定 → `watch`
- 複数の関連データを自動追跡 → `watchEffect`
- 旧値や細かい制御が必要 → `watch`
- 即時実行が必要 → `watchEffect`

</details>

## 5. Best Practices

> ベストプラクティス

### 推奨する方法

```typescript
// 1. 監視データを明示的に指定する時は watch を使用
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. 複数の関連データを自動追跡する時は watchEffect を使用
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3. 旧値が必要な時は watch を使用
watch(count, (newVal, oldVal) => {
  console.log(`${oldVal} から ${newVal} に変化`);
});

// 4. 監視器のクリーンアップを忘れずに
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### 避けるべき方法

```typescript
// 1. watchEffect 内で非同期操作をクリーンアップ処理なしで行わない
watchEffect(async () => {
  const data = await fetchData(); // ❌ メモリリークの可能性
  // ...
});

// 2. watchEffect を過度に使用しない
// 特定のデータだけを監視する場合、watch の方が明確
watchEffect(() => {
  console.log(count.value); // ⚠️ count だけを監視するなら watch の方が適切
});

// 3. watchEffect 内で監視するデータを変更しない（無限ループの可能性）
watchEffect(() => {
  count.value++; // ❌ 無限ループの可能性
});
```

## 6. Interview Summary

> 面接まとめ

### クイックメモ

**watch**：
- 監視するデータを明示的に指定
- 遅延実行（デフォルト）
- 旧値にアクセス可能
- 細かい制御が必要な場面に適している

**watchEffect**：
- 使用するデータを自動追跡
- 即時実行
- 旧値にアクセス不可
- 複数の関連データの自動追跡に適している

**選択の原則**：
- 明示的な監視指定 → `watch`
- 自動追跡 → `watchEffect`
- 旧値が必要 → `watch`
- 即時実行が必要 → `watchEffect`

### 面接回答例

**Q: watch と watchEffect の違いは？**

> 「watch と watchEffect はどちらも Vue 3 でリアクティブデータの変化を監視する API です。主な違いは：1) データソース：watch は監視するデータを明示的に指定する必要があり、watchEffect はコールバック関数内で使用するリアクティブデータを自動追跡；2) 実行タイミング：watch はデフォルトで遅延実行でデータ変化時のみ実行、watchEffect は即時実行してその後変化を追跡；3) 旧値アクセス：watch は旧値にアクセス可能、watchEffect は旧値にアクセス不可；4) 使用場面：watch は監視データを明示指定する必要がある場面や旧値が必要な場面に適しており、watchEffect は複数の関連データを自動追跡する場面に適しています。」

**Q: watch と watchEffect をいつ使うべきか？**

> 「watch を使用する場合：1) 監視するデータを明示的に指定する必要がある；2) 旧値へのアクセスが必要；3) 遅延実行で変化時のみ実行したい；4) より細かい制御が必要（immediate、deep オプションなど）。watchEffect を使用する場合：1) 複数の関連データを自動追跡；2) 旧値が不要；3) 即時実行が必要。一般的に、特定のデータのみ監視する場合は watch の方が明確で、複数の関連データを自動追跡する必要がある場合は watchEffect の方が便利です。」

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
