---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> ref と reactive とは何か？

`ref` と `reactive` は Vue 3 Composition API でリアクティブなデータを作成するための2つのコア API です。

### ref

**定義**：`ref` はリアクティブな**プリミティブ型の値**または**オブジェクト参照**を作成するために使用します。

<details>
<summary>ref の基本例を展開</summary>

```vue
<script setup>
import { ref } from 'vue';

// プリミティブ型
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// オブジェクト（ref も使用可能）
const user = ref({
  name: 'John',
  age: 30,
});

// アクセス時は .value が必要
console.log(count.value); // 0
count.value++; // 値を変更
</script>
```

</details>

### reactive

**定義**：`reactive` はリアクティブな**オブジェクト**を作成するために使用します（プリミティブ型には直接使用不可）。

<details>
<summary>reactive の基本例を展開</summary>

```vue
<script setup>
import { reactive } from 'vue';

// オブジェクトにのみ使用可能
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// プロパティに直接アクセス、.value 不要
console.log(state.count); // 0
state.count++; // 値を変更
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> ref と reactive の主な違い

### 1. 適用可能な型

**ref**：あらゆる型に使用可能

```typescript
const count = ref(0); // ✅ 数値
const message = ref('Hello'); // ✅ 文字列
const isActive = ref(true); // ✅ 真偽値
const user = ref({ name: 'John' }); // ✅ オブジェクト
const items = ref([1, 2, 3]); // ✅ 配列
```

**reactive**：オブジェクトにのみ使用可能

```typescript
const state = reactive({ count: 0 }); // ✅ オブジェクト
const state = reactive([1, 2, 3]); // ✅ 配列（オブジェクトの一種）
const count = reactive(0); // ❌ エラー：プリミティブ型は不可
const message = reactive('Hello'); // ❌ エラー：プリミティブ型は不可
```

### 2. アクセス方法

**ref**：`.value` でアクセスが必要

<details>
<summary>ref のアクセス例を展開</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

// JavaScript 内では .value が必要
console.log(count.value); // 0
count.value = 10;

// テンプレート内では自動アンラップ、.value 不要
</script>

<template>
  <div>{{ count }}</div>
  <!-- 自動アンラップ、.value 不要 -->
</template>
```

</details>

**reactive**：プロパティに直接アクセス

<details>
<summary>reactive のアクセス例を展開</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

// プロパティに直接アクセス
console.log(state.count); // 0
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. 再代入

**ref**：再代入可能

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // ✅ 再代入可能
```

**reactive**：再代入不可（リアクティビティが失われる）

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // ❌ リアクティビティが失われ、更新がトリガーされない
```

### 4. 分割代入

**ref**：分割代入後もリアクティビティを維持

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // プリミティブ値の分割代入はリアクティビティを失う

// ref 自体は分割代入可能
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive**：分割代入後リアクティビティが失われる

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // ❌ リアクティビティが失われる

// toRefs でリアクティビティを維持
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // ✅ リアクティビティを維持
```

## 3. When to Use ref vs reactive?

> ref と reactive をいつ使うべきか？

### ref を使う場合

1. **プリミティブ型の値**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **再代入が必要なオブジェクト**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // 再代入可能
   ```

3. **テンプレート参照（Template Refs）**

   ```vue
   <template>
     <div ref="container"></div>
   </template>
   <script setup>
   const container = ref(null);
   </script>
   ```

4. **分割代入が必要な場合**
   ```typescript
   const state = ref({ count: 0, message: 'Hello' });
   // プリミティブ値の分割代入は問題なし
   ```

### reactive を使う場合

1. **複雑なオブジェクト状態**

   ```typescript
   const formState = reactive({
     username: '',
     password: '',
     errors: {},
   });
   ```

2. **再代入が不要な状態**

   ```typescript
   const config = reactive({
     apiUrl: 'https://api.example.com',
     timeout: 5000,
   });
   ```

3. **複数の関連プロパティをまとめる**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> よくある面接質問

### 問題 1：基本的な違い

以下のコードの違いと出力結果を説明してください。

```typescript
// ケース 1：ref を使用
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// ケース 2：reactive を使用
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// ケース 3：reactive の再代入
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>回答を表示</summary>

```typescript
// ケース 1：ref を使用
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // 10 ✅

// ケース 2：reactive を使用
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // 10 ✅

// ケース 3：reactive の再代入
let state2 = reactive({ count: 0 });
state2 = { count: 10 }; // ❌ リアクティビティが失われる
console.log(state2.count); // 10（値は正しいが、リアクティビティは失われている）
// 以降 state2.count を変更してもビューは更新されない
```

**重要な違い**：

- `ref` は `.value` でアクセスが必要
- `reactive` はプロパティに直接アクセス
- `reactive` は再代入できない（リアクティビティが失われる）

</details>

### 問題 2：分割代入の問題

以下のコードの問題点を説明し、解決策を提示してください。

```typescript
// ケース 1：ref の分割代入
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// ケース 2：reactive の分割代入
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>回答を表示</summary>

**ケース 1：ref の分割代入**

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ❌ user.value.name は更新されない

// 正しい方法：ref の値を直接変更
user.value.name = 'Jane'; // ✅
// または再代入
user.value = { name: 'Jane', age: 30 }; // ✅
```

**ケース 2：reactive の分割代入**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ❌ リアクティビティが失われ、更新がトリガーされない

// 正しい方法 1：プロパティを直接変更
state.count = 10; // ✅

// 正しい方法 2：toRefs でリアクティビティを維持
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // ✅ ref になるため .value が必要
```

**まとめ**：

- プリミティブ値の分割代入はリアクティビティを失う
- `reactive` の分割代入には `toRefs` が必要
- `ref` のオブジェクトプロパティの分割代入もリアクティビティを失うため、`.value` を直接変更すべき

</details>

### 問題 3：ref と reactive のどちらを選ぶか？

以下のシナリオで `ref` と `reactive` のどちらを使うべきか説明してください。

```typescript
// シナリオ 1：カウンター
const count = ?;

// シナリオ 2：フォーム状態
const form = ?;

// シナリオ 3：ユーザーデータ（再代入の可能性あり）
const user = ?;

// シナリオ 4：テンプレート参照
const inputRef = ?;
```

<details>
<summary>回答を表示</summary>

```typescript
// シナリオ 1：カウンター（プリミティブ型）
const count = ref(0); // ✅ ref

// シナリオ 2：フォーム状態（複雑なオブジェクト、再代入不要）
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // ✅ reactive

// シナリオ 3：ユーザーデータ（再代入の可能性あり）
const user = ref({ name: 'John', age: 30 }); // ✅ ref（再代入可能）

// シナリオ 4：テンプレート参照
const inputRef = ref(null); // ✅ ref（テンプレート参照は ref 必須）
```

**選択の原則**：

- プリミティブ型 → `ref`
- 再代入が必要なオブジェクト → `ref`
- テンプレート参照 → `ref`
- 複雑なオブジェクト状態、再代入不要 → `reactive`

</details>

## 5. Best Practices

> ベストプラクティス

### 推奨事項

```typescript
// 1. プリミティブ型は ref を使用
const count = ref(0);
const message = ref('Hello');

// 2. 複雑な状態は reactive を使用
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3. 再代入が必要な場合は ref を使用
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // ✅

// 4. reactive の分割代入は toRefs を使用
import { toRefs } from 'vue';
const { count, message } = toRefs(state);

// 5. スタイルの統一：チームで ref か reactive のどちらかを主に使用するか決める
```

### 避けるべき事項

```typescript
// 1. reactive でプリミティブ型を作成しない
const count = reactive(0); // ❌ エラー

// 2. reactive を再代入しない
let state = reactive({ count: 0 });
state = { count: 10 }; // ❌ リアクティビティが失われる

// 3. reactive を直接分割代入しない
const { count } = reactive({ count: 0 }); // ❌ リアクティビティが失われる

// 4. テンプレートで .value を忘れない（ref の場合）
// テンプレートでは .value 不要だが、JavaScript では必要
```

## 6. Interview Summary

> 面接まとめ

### クイックメモ

**ref**：

- あらゆる型に適用可能
- `.value` でアクセスが必要
- 再代入可能
- テンプレートで自動アンラップ

**reactive**：

- オブジェクトにのみ使用可能
- プロパティに直接アクセス
- 再代入不可
- 分割代入には `toRefs` が必要

**選択の原則**：

- プリミティブ型 → `ref`
- 再代入が必要 → `ref`
- 複雑なオブジェクト状態 → `reactive`

### 面接回答例

**Q: ref と reactive の違いは？**

> 「ref と reactive はどちらも Vue 3 でリアクティブなデータを作成する API です。主な違いは：1) 適用型：ref はあらゆる型に使用でき、reactive はオブジェクトにのみ使用可能；2) アクセス方法：ref は .value でのアクセスが必要、reactive はプロパティに直接アクセス；3) 再代入：ref は再代入可能、reactive は再代入するとリアクティビティが失われる；4) 分割代入：reactive の分割代入は toRefs でリアクティビティを維持する必要がある。一般的に、プリミティブ型と再代入が必要なオブジェクトには ref を、複雑なオブジェクト状態には reactive を使用します。」

**Q: ref と reactive をいつ使うべきか？**

> 「ref を使う場合：1) プリミティブ型の値（数値、文字列、真偽値）；2) 再代入が必要なオブジェクト；3) テンプレート参照。reactive を使う場合：1) 複雑なオブジェクト状態で、複数の関連プロパティをまとめたい場合；2) 再代入が不要な状態。実際の開発では、多くのチームが ref に統一しています。ref のほうが柔軟で適用範囲が広いためです。」

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
