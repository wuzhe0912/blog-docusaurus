---
id: vue3-new-features
title: '[Easy] Vue3 新機能'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> Vue 3 にはどのような新機能があるか？

Vue 3 は多くの新機能と改善を導入しました。主なものは以下の通りです：

### 主要な新機能

1. **Composition API**：新しいコンポーネントの書き方
2. **Teleport**：コンポーネントを DOM の別の位置にレンダリング
3. **Fragment**：コンポーネントが複数のルートノードを持てる
4. **Suspense**：非同期コンポーネントの読み込み処理
5. **複数の v-model**：複数の v-model をサポート
6. **より良い TypeScript サポート**
7. **パフォーマンス最適化**：より小さなバンドルサイズ、より高速なレンダリング

## 2. Teleport

> Teleport とは？

**定義**：`Teleport` を使用すると、コンポーネントの内容を DOM ツリーの別の位置にレンダリングでき、コンポーネントのロジック構造は変更されません。

### 使用場面

**よくある場面**：Modal、Tooltip、Notification など、body にレンダリングする必要があるコンポーネント

<details>
<summary>Teleport の例を展開</summary>

```vue
<template>
  <div>
    <button @click="showModal = true">Modal を開く</button>

    <!-- Teleport を使って Modal を body にレンダリング -->
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Modal タイトル</h2>
          <p>Modal 内容</p>
          <button @click="showModal = false">閉じる</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

</details>

### 利点

1. **z-index の問題を解決**：Modal を body にレンダリングし、親コンポーネントのスタイルの影響を受けない
2. **ロジック構造を維持**：コンポーネントのロジックは元の位置のまま、DOM の位置だけが異なる
3. **より良い保守性**：Modal 関連のコードがコンポーネント内に集中

## 3. Fragment（複数ルートノード）

> Fragment とは？

**定義**：Vue 3 ではコンポーネントが複数のルートノードを持つことができ、単一の要素で囲む必要がありません。これは暗黙的な Fragment であり、React のように `<Fragment>` タグを使用する必要はありません。

### Vue 2 vs Vue 3

**Vue 2**：単一のルートノードが必須

```vue
<!-- Vue 2：単一の要素で囲む必要がある -->
<template>
  <div>
    <h1>タイトル</h1>
    <p>内容</p>
  </div>
</template>
```

**Vue 3**：複数のルートノードが可能

```vue
<!-- Vue 3：複数のルートノードが可能 -->
<template>
  <h1>タイトル</h1>
  <p>内容</p>
</template>
```

### なぜ Fragment が必要なのか？

Vue 2 ではコンポーネントが単一のルートノードを持つ必要があり、開発者は頻繁に余分なラッパー要素（`<div>` など）を追加する必要がありました。これらの要素は：

1. **セマンティック HTML の破壊**：無意味なラッパー要素の追加
2. **DOM 階層の増加**：スタイルセレクターとパフォーマンスへの影響
3. **スタイル制御の困難**：余分なラッパー要素のスタイル処理が必要

### 使用場面

#### 場面 1：セマンティック HTML 構造

```vue
<template>
  <!-- 余分なラッパー要素が不要 -->
  <header>
    <h1>サイトタイトル</h1>
  </header>
  <main>
    <p>メインコンテンツ</p>
  </main>
  <footer>
    <p>フッター</p>
  </footer>
</template>
```

#### 場面 2：リスト項目コンポーネント

```vue
<!-- ListItem.vue -->
<template>
  <li class="item-title">{{ title }}</li>
  <li class="item-description">{{ description }}</li>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
</script>
```

#### 場面 3：条件付きレンダリングで複数の要素

```vue
<template>
  <div v-if="showHeader" class="header">タイトル</div>
  <div v-if="showContent" class="content">内容</div>
  <div v-if="showFooter" class="footer">フッター</div>
</template>
```

### 属性の継承（Attribute Inheritance）

コンポーネントが複数のルートノードを持つ場合、属性の継承動作が異なります。

**単一ルートノード**：属性はルート要素に自動継承される

```vue
<!-- 親コンポーネント -->
<MyComponent class="custom-class" id="my-id" />

<!-- 子コンポーネント（単一ルート） -->
<template>
  <div>内容</div>
</template>

<!-- レンダリング結果 -->
<div class="custom-class" id="my-id">内容</div>
```

**複数ルートノード**：属性は自動継承されない、手動で指定が必要

```vue
<!-- 親コンポーネント -->
<MyComponent class="custom-class" id="my-id" />

<!-- 子コンポーネント（複数ルート） -->
<template>
  <div>最初のルート</div>
  <div>2番目のルート</div>
</template>

<!-- レンダリング結果：属性は自動継承されない -->
<div>最初のルート</div>
<div>2番目のルート</div>
```

**解決策**：`$attrs` で手動で属性をバインド

```vue
<!-- 子コンポーネント -->
<template>
  <div v-bind="$attrs">最初のルート</div>
  <div>2番目のルート</div>
</template>

<!-- レンダリング結果 -->
<div class="custom-class" id="my-id">最初のルート</div>
<div>2番目のルート</div>
```

**`inheritAttrs: false` で継承動作を制御**：

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // 自動継承を無効化
});
</script>

<template>
  <div v-bind="$attrs">最初のルート</div>
  <div>2番目のルート</div>
</template>
```

### Fragment vs React Fragment

| 特性         | Vue 3 Fragment       | React Fragment                    |
| ------------ | -------------------- | --------------------------------- |
| **構文**     | 暗黙的（タグ不要）   | 明示的（`<Fragment>` または `<>` が必要） |
| **Key 属性** | 不要                 | 必要に応じて `<Fragment key={...}>` を使用 |
| **属性継承** | 手動処理が必要       | 属性非対応                        |

**Vue 3**：

```vue
<!-- Vue 3：暗黙的 Fragment -->
<template>
  <h1>タイトル</h1>
  <p>内容</p>
</template>
```

**React**：

```jsx
// React：明示的 Fragment
function Component() {
  return (
    <>
      <h1>タイトル</h1>
      <p>内容</p>
    </>
  );
}
```

### 注意事項

1. **属性の継承**：複数ルートノード時、属性は自動継承されないため、`$attrs` で手動バインドが必要
2. **スタイルのスコープ**：複数ルートノード時、`scoped` スタイルはすべてのルートノードに適用される
3. **ロジックのラッピング**：ロジック上ラッピングが必要な場合は、単一ルートノードを使用すべき

```vue
<!-- ✅ 良い方法：ロジック上ラッピングが必要 -->
<template>
  <div class="card">
    <h2>タイトル</h2>
    <p>内容</p>
  </div>
</template>

<!-- ⚠️ 避ける：複数ルートのために複数ルートにしない -->
<template>
  <h2>タイトル</h2>
  <p>内容</p>
  <!-- これら2つの要素がロジック上一組であるべきなら、ラッピングすべき -->
</template>
```

## 4. Suspense

> Suspense とは？

**定義**：`Suspense` は組み込みコンポーネントで、非同期コンポーネントの読み込み時のローディング状態を処理するために使用されます。

### 基本的な使い方

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>読み込み中...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### 使用場面

1. **非同期コンポーネントの読み込み**

   ```vue
   <Suspense>
     <AsyncUserProfile :userId="userId" />
     <template #fallback>
       <UserProfileSkeleton />
     </template>
   </Suspense>
   ```

2. **非同期データの読み込み**
   ```vue
   <script setup>
   const data = await fetchData(); // setup 内で await を使用
   </script>
   ```

## 5. Multiple v-model

> 複数の v-model

**定義**：Vue 3 ではコンポーネントで複数の `v-model` を使用でき、各 `v-model` が異なる prop に対応します。

### Vue 2 vs Vue 3

**Vue 2**：1つの `v-model` のみ

```vue
<!-- Vue 2：1つの v-model のみ -->
<CustomInput v-model="value" />
```

**Vue 3**：複数の `v-model` が可能

```vue
<!-- Vue 3：複数の v-model が可能 -->
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### 実装例

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input :value="email" @input="$emit('update:email', $event.target.value)" />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Common Interview Questions

> よくある面接質問

### 問題 1：Teleport の使用場面

`Teleport` をいつ使用すべきか説明してください。

<details>
<summary>回答を表示</summary>

**Teleport を使用する場面**：

1. **Modal ダイアログ**

   ```vue
   <Teleport to="body">
     <Modal v-if="showModal" />
   </Teleport>
   ```

   - z-index の問題を解決
   - 親コンポーネントのスタイルの影響を受けない

2. **Tooltip ヒント**

   ```vue
   <Teleport to="body">
     <Tooltip v-if="showTooltip" />
   </Teleport>
   ```

   - 親コンポーネントの overflow で隠れることを回避

3. **Notification 通知**
   ```vue
   <Teleport to="#notifications">
     <Notification v-for="msg in messages" :key="msg.id" />
   </Teleport>
   ```
   - 通知位置を統一管理

**Teleport を使用しない場合**：

- 一般的なコンテンツには不要
- 特別な DOM 位置が不要なコンポーネント

</details>

### 問題 2：Fragment の利点

Vue 3 が複数のルートノードを許可する利点を説明してください。

<details>
<summary>回答を表示</summary>

**利点**：

1. **不要な DOM 要素の削減**

   ```vue
   <!-- Vue 2：余分な div が必要 -->
   <template>
     <div>
       <header>...</header>
       <main>...</main>
     </div>
   </template>

   <!-- Vue 3：余分な要素が不要 -->
   <template>
     <header>...</header>
     <main>...</main>
   </template>
   ```

2. **よりよいセマンティック HTML**

   - Vue の制約のために無意味なラッパー要素を追加する必要がない
   - HTML 構造のセマンティクスを維持

3. **より柔軟なスタイル制御**

   - 余分なラッパー要素のスタイル処理が不要
   - CSS セレクターの複雑さを軽減

4. **DOM 階層の削減**

   - より浅い DOM ツリー、パフォーマンスが向上
   - ブラウザのレンダリングコストを削減

5. **より良い保守性**
   - コードがより簡潔で、余分なラッパー要素が不要
   - コンポーネント構造がより明確

</details>

### 問題 3：Fragment の属性継承問題

コンポーネントが複数のルートノードを持つ場合、属性継承の動作は何か？どのように解決するか？

<details>
<summary>回答を表示</summary>

**問題**：

コンポーネントが複数のルートノードを持つ場合、親コンポーネントから渡された属性（`class`、`id` など）はどのルートノードにも自動継承されません。

**例**：

```vue
<!-- 親コンポーネント -->
<MyComponent class="custom-class" id="my-id" />

<!-- 子コンポーネント（複数ルート） -->
<template>
  <div>最初のルート</div>
  <div>2番目のルート</div>
</template>

<!-- レンダリング結果：属性は自動継承されない -->
<div>最初のルート</div>
<div>2番目のルート</div>
```

**解決策**：

1. **`$attrs` で手動で属性をバインド**

```vue
<!-- 子コンポーネント -->
<template>
  <div v-bind="$attrs">最初のルート</div>
  <div>2番目のルート</div>
</template>

<!-- レンダリング結果 -->
<div class="custom-class" id="my-id">最初のルート</div>
<div>2番目のルート</div>
```

2. **`inheritAttrs: false` で継承動作を制御**

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // 自動継承を無効化
});
</script>

<template>
  <div v-bind="$attrs">最初のルート</div>
  <div>2番目のルート</div>
</template>
```

3. **特定の属性を選択的にバインド**

```vue
<template>
  <div :class="$attrs.class">最初のルート</div>
  <div :id="$attrs.id">2番目のルート</div>
</template>
```

**ポイント**：

- 単一ルートノード：属性は自動継承
- 複数ルートノード：属性は自動継承されない、手動処理が必要
- `$attrs` で `props` に定義されていないすべての属性にアクセス可能

</details>

### 問題 4：Fragment vs React Fragment

Vue 3 Fragment と React Fragment の違いを比較してください。

<details>
<summary>回答を表示</summary>

**主な違い**：

| 特性         | Vue 3 Fragment             | React Fragment                    |
| ------------ | -------------------------- | --------------------------------- |
| **構文**     | 暗黙的（タグ不要）         | 明示的（`<Fragment>` または `<>` が必要） |
| **Key 属性** | 不要                       | 必要に応じて `<Fragment key={...}>` を使用 |
| **属性継承** | 手動処理が必要（`$attrs`） | 属性非対応                        |

**Vue 3**：

```vue
<!-- Vue 3：暗黙的 Fragment、複数ルートノードを直接記述 -->
<template>
  <h1>タイトル</h1>
  <p>内容</p>
</template>
```

**React**：

```jsx
// React：明示的 Fragment、タグの使用が必要
function Component() {
  return (
    <>
      <h1>タイトル</h1>
      <p>内容</p>
    </>
  );
}

// または Fragment を使用
import { Fragment } from 'react';
function Component() {
  return (
    <Fragment>
      <h1>タイトル</h1>
      <p>内容</p>
    </Fragment>
  );
}
```

**利点の比較**：

- **Vue 3**：構文がより簡潔で、余分なタグが不要
- **React**：より明示的で、key 属性を追加できる

</details>

### 問題 5：Suspense の使用

`Suspense` を使って非同期コンポーネントを読み込む例を実装してください。

<details>
<summary>回答を表示</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>ユーザーデータを読み込み中...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);

// 非同期コンポーネントを定義
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

**応用：エラー処理**

```vue
<template>
  <Suspense @resolve="onResolve" @reject="onReject">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>読み込み中...</div>
    </template>
  </Suspense>
</template>

<script setup>
const onResolve = () => {
  console.log('コンポーネントの読み込み成功');
};

const onReject = (error) => {
  console.error('コンポーネントの読み込み失敗:', error);
};
</script>
```

</details>

## 7. Best Practices

> ベストプラクティス

### 推奨する方法

```vue
<!-- 1. Modal には Teleport を使用 -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2. 複数ルートノードはセマンティクスを維持 -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3. 非同期コンポーネントには Suspense を使用 -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4. 複数の v-model には明確な命名を使用 -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### 避けるべき方法

```vue
<!-- 1. Teleport を過度に使用しない -->
<Teleport to="body">
  <div>一般的なコンテンツ</div> <!-- ❌ 不要 -->
</Teleport>

<!-- 2. 複数ルートノードのために構造を壊さない -->
<template>
  <h1>タイトル</h1>
  <p>内容</p>
  <!-- ⚠️ ロジック上ラッピングが必要なら、単一ルートノードを使用すべき -->
</template>

<!-- 3. Suspense のエラー処理を無視しない -->
<Suspense>
  <AsyncComponent />
  <!-- ⚠️ 読み込み失敗の場合を処理すべき -->
</Suspense>
```

## 8. Interview Summary

> 面接まとめ

### クイックメモ

**Vue 3 の主な新機能**：

- **Composition API**：新しいコンポーネントの書き方
- **Teleport**：コンポーネントを別の DOM 位置にレンダリング
- **Fragment**：複数のルートノードをサポート
- **Suspense**：非同期コンポーネントの読み込み処理
- **複数の v-model**：複数の v-model バインディングをサポート

**使用場面**：

- Modal/Tooltip → `Teleport`
- セマンティック HTML → `Fragment`
- 非同期コンポーネント → `Suspense`
- フォームコンポーネント → 複数の `v-model`

### 面接回答例

**Q: Vue 3 にはどのような主な新機能がありますか？**

> 「Vue 3 は多くの新機能を導入しました。主なものは：1) Composition API、新しいコンポーネントの書き方を提供し、ロジックの整理とコードの再利用が向上；2) Teleport、コンポーネントの内容を DOM ツリーの別の位置にレンダリングでき、Modal や Tooltip などでよく使用；3) Fragment、コンポーネントが複数のルートノードを持てるようになり、余分なラッパー要素が不要；4) Suspense、非同期コンポーネント読み込み時のローディング状態を処理；5) 複数の v-model、コンポーネントで複数の v-model バインディングをサポート；6) より良い TypeScript サポートとパフォーマンス最適化。これらの新機能により Vue 3 はより強力で柔軟になり、同時に後方互換性も維持しています。」

**Q: Teleport の使用場面は？**

> 「Teleport は主にコンポーネントを DOM ツリーの別の位置にレンダリングする必要がある場面で使用します。よくある使用場面：1) Modal ダイアログ、z-index の問題を避けるために body にレンダリング；2) Tooltip ヒント、親コンポーネントの overflow で隠れることを回避；3) Notification 通知、通知位置の統一管理。Teleport の利点は、コンポーネントのロジック構造を変えずに DOM のレンダリング位置のみを変更できることで、スタイルの問題を解決しつつコードの保守性も維持できます。」

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
