---
id: static-hoisting
title: '[Medium] Vue3 静的ホイスティング'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> Vue3 の静的ホイスティングとは何か？

Vue3 における**静的ホイスティング（Static Hoisting）**とは、コンパイル段階での最適化技術です。

### 定義

**静的ホイスティング**は、Vue 3 のコンパイラが template をコンパイルする際、どのノードが reactive 状態に完全に依存せず永遠に変化しないかを分析し、これらの静的ノードを抽出してファイルトップレベルの定数に変換します。初回レンダリング時にのみ作成し、以降の再レンダリングではそのまま再利用することで、VNode の作成と diff のコストを削減します。

### 動作原理

コンパイラは template を分析し、reactive 状態に完全に依存せず永遠に変化しないノードを抽出してファイルトップレベルの定数に変換します。初回レンダリング時にのみ作成し、以降はそのまま再利用します。

### コンパイル前後の比較

**コンパイル前の Template**：

<details>
<summary>Template の例を展開</summary>

```vue
<template>
  <div>
    <h1>静的タイトル</h1>
    <p>静的コンテンツ</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

</details>

**コンパイル後の JavaScript**（簡略版）：

<details>
<summary>コンパイル後の JavaScript 例を展開</summary>

```js
// 静的ノードがトップに引き上げられ、一度だけ作成
const _hoisted_1 = /*#__PURE__*/ h('h1', null, '静的タイトル');
const _hoisted_2 = /*#__PURE__*/ h('p', null, '静的コンテンツ');

function render() {
  return h('div', null, [
    _hoisted_1, // そのまま再利用、再作成不要
    _hoisted_2, // そのまま再利用、再作成不要
    h('div', null, dynamicContent.value), // 動的コンテンツは再作成が必要
  ]);
}
```

</details>

### メリット

1. **VNode 作成コストの削減**：静的ノードは一度だけ作成し、以降は再利用
2. **diff コストの削減**：静的ノードは diff 比較に参加不要
3. **レンダリング性能の向上**：特に大量の静的コンテンツを持つコンポーネントで効果が顕著
4. **自動最適化**：開発者が特別なコードを書く必要なく最適化を享受できる

## 2. How Static Hoisting Works

> 静的ホイスティングはどう動作するか？

### コンパイラの分析プロセス

コンパイラは template 内の各ノードを分析します：

1. **ノードに動的バインディングが含まれるか検査**

   - `{{ }}`、`v-bind`、`v-if`、`v-for` などの動的ディレクティブがあるか
   - 属性値に変数が含まれるか

2. **静的ノードのマーク**

   - ノードとその子ノードに動的バインディングがなければ、静的ノードとしてマーク

3. **静的ノードのホイスティング**
   - 静的ノードを render 関数の外部に抽出
   - モジュールトップレベルの定数として定義

### 例 1：基本的な静的ホイスティング

<details>
<summary>基本的な静的ホイスティング例を展開</summary>

```vue
<template>
  <div>
    <h1>タイトル</h1>
    <p>静的コンテンツ</p>
    <div>静的ブロック</div>
  </div>
</template>
```

</details>

**コンパイル後**：

<details>
<summary>コンパイル後の結果を展開</summary>

```js
// すべての静的ノードがホイスティングされる
const _hoisted_1 = h('h1', null, 'タイトル');
const _hoisted_2 = h('p', null, '静的コンテンツ');
const _hoisted_3 = h('div', null, '静的ブロック');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

</details>

### 例 2：静的と動的コンテンツの混在

<details>
<summary>混在コンテンツの例を展開</summary>

```vue
<template>
  <div>
    <h1>静的タイトル</h1>
    <p>{{ message }}</p>
    <div class="static-class">静的コンテンツ</div>
    <span :class="dynamicClass">動的コンテンツ</span>
  </div>
</template>
```

</details>

**コンパイル後**：

<details>
<summary>コンパイル後の結果を展開</summary>

```js
// 完全に静的なノードのみホイスティングされる
const _hoisted_1 = h('h1', null, '静的タイトル');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, '静的コンテンツ');

function render() {
  return h('div', null, [
    _hoisted_1, // 静的ノード、再利用
    h('p', null, message.value), // 動的コンテンツ、再作成が必要
    _hoisted_3, // 静的ノード、再利用
    h('span', { class: dynamicClass.value }, '動的コンテンツ'), // 動的属性、再作成が必要
  ]);
}
```

</details>

### 例 3：静的属性のホイスティング

<details>
<summary>静的属性の例を展開</summary>

```vue
<template>
  <div>
    <div class="container" id="main">コンテンツ</div>
    <button disabled>ボタン</button>
  </div>
</template>
```

</details>

**コンパイル後**：

<details>
<summary>コンパイル後の結果を展開</summary>

```js
// 静的属性オブジェクトもホイスティングされる
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, 'コンテンツ');
const _hoisted_4 = h('button', _hoisted_2, 'ボタン');

function render() {
  return h('div', null, [_hoisted_3, _hoisted_4]);
}
```

</details>

## 3. v-once Directive

> v-once ディレクティブ

開発者が永遠に変化しない大きなブロックを自ら指定したい場合は、`v-once` ディレクティブを使用できます。

### v-once の役割

`v-once` は、この要素とその子要素を一度だけレンダリングするようコンパイラに指示します。動的バインディングを含む場合でも初回レンダリング時にのみ評価し、以降は更新しません。

### 基本的な使い方

<details>
<summary>v-once の基本例を展開</summary>

```vue
<template>
  <div>
    <!-- v-once で静的コンテンツをマーク -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- v-once なし、リアクティブに更新される -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('初期タイトル');
const content = ref('初期コンテンツ');

// これらの値を変更しても v-once ブロックは更新されない
setTimeout(() => {
  title.value = '新しいタイトル';
  content.value = '新しいコンテンツ';
}, 1000);
</script>
```

</details>

### v-once vs 静的ホイスティング

| 特性           | 静的ホイスティング    | v-once                         |
| -------------- | --------------------- | ------------------------------ |
| **トリガー**   | 自動（コンパイラ分析）| 手動（開発者がマーク）         |
| **適用場面**   | 完全に静的なコンテンツ | 動的バインディングを含むが一度だけレンダリング |
| **パフォーマンス** | 最適（diff 不参加） | 良好（一度だけレンダリング）   |
| **使用タイミング** | コンパイル時に自動判断 | 開発者が変化しないと確信した場合 |

### 使用シーン

```vue
<template>
  <!-- シーン 1：一度だけ表示するデータ -->
  <div v-once>
    <p>作成日時：{{ createdAt }}</p>
    <p>作成者：{{ creator }}</p>
  </div>

  <!-- シーン 2：複雑な静的構造 -->
  <div v-once>
    <div class="header">
      <h1>タイトル</h1>
      <nav>ナビゲーション</nav>
    </div>
  </div>

  <!-- シーン 3：リスト内の静的項目 -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Common Interview Questions

> よくある面接質問

### 問題 1：静的ホイスティングの原理

Vue3 の静的ホイスティングの動作原理と、どのようにパフォーマンスを向上させるか説明してください。

<details>
<summary>回答を表示</summary>

**静的ホイスティングの動作原理**：

1. **コンパイル段階の分析**：
   - コンパイラが template 内の各ノードを分析
   - 動的バインディング（`{{ }}`、`v-bind`、`v-if` など）の有無を検査
   - ノードとその子ノードに動的バインディングがなければ静的ノードとしてマーク

2. **ノードのホイスティング**：
   - 静的ノードを render 関数の外部に抽出
   - モジュールトップレベルの定数として定義
   - 初回レンダリング時にのみ作成

3. **再利用メカニズム**：
   - 以降の再レンダリング時にこれらの静的ノードを直接再利用
   - VNode の再作成不要
   - diff 比較に参加不要

**パフォーマンス向上**：

- **VNode 作成コストの削減**：静的ノードは一度だけ作成
- **diff コストの削減**：静的ノードは diff 比較をスキップ
- **メモリ使用量の削減**：複数のコンポーネントインスタンスで静的ノードを共有
- **レンダリング速度の向上**：特に大量の静的コンテンツを持つコンポーネントで効果が顕著

</details>

### 問題 2：静的ホイスティングと v-once の違い

静的ホイスティングと `v-once` の違い、およびそれぞれの適用シーンを説明してください。

<details>
<summary>回答を表示</summary>

**主な違い**：

| 特性           | 静的ホイスティング    | v-once                         |
| -------------- | --------------------- | ------------------------------ |
| **トリガー**   | 自動（コンパイラ分析）| 手動（開発者がマーク）         |
| **対象コンテンツ** | 完全に静的なコンテンツ | 動的バインディングを含むが一度だけレンダリング |
| **パフォーマンス** | 最適（diff 不参加） | 良好（一度だけレンダリング）   |
| **更新動作**   | 永遠に更新されない    | 初回レンダリング後は更新されない |

**選択ガイド**：

- コンテンツが完全に静的 → コンパイラに自動処理させる（静的ホイスティング）
- 動的バインディングを含むが一度だけレンダリング → `v-once` を使用
- リアクティブな更新が必要 → `v-once` を使用しない

</details>

### 問題 3：実際の適用シーン

静的ホイスティングが顕著なパフォーマンス向上をもたらすのはどのような場合か説明してください。

<details>
<summary>回答を表示</summary>

**パフォーマンス向上が顕著なシーン**：

1. **大量の静的コンテンツを持つコンポーネント**
2. **リスト内の静的項目**
3. **頻繁に更新されるコンポーネント**
4. **複数のコンポーネントインスタンス**

**パフォーマンス向上のキーファクター**：

- **静的コンテンツの割合**：静的コンテンツが多いほど効果が大きい
- **更新頻度**：更新が頻繁なほど diff コスト削減の効果が大きい
- **コンポーネントインスタンス数**：インスタンスが多いほど静的ノード共有の効果が大きい

**実測値**：

大量の静的コンテンツを持つコンポーネントでは：

- VNode 作成時間を 30-50% 削減
- diff 比較時間を 40-60% 削減
- メモリ使用量の削減（マルチインスタンス共有）

</details>

## 5. Best Practices

> ベストプラクティス

### 推奨事項

```vue
<!-- 1. 静的コンテンツはコンパイラに自動処理させる -->
<template>
  <div>
    <h1>タイトル</h1>
    <p>静的コンテンツ</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2. 一度だけレンダリングするコンテンツは v-once で明示 -->
<template>
  <div v-once>
    <p>作成日時：{{ createdAt }}</p>
    <p>作成者：{{ creator }}</p>
  </div>
</template>

<!-- 3. 静的構造と動的コンテンツを分離 -->
<template>
  <div>
    <!-- 静的構造 -->
    <div class="container">
      <header>タイトル</header>
      <!-- 動的コンテンツ -->
      <main>{{ content }}</main>
    </div>
  </div>
</template>
```

### 避けるべき事項

```vue
<!-- 1. v-once を過度に使用しない -->
<template>
  <!-- ❌ コンテンツの更新が必要な場合、v-once を使うべきではない -->
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2. 動的コンテンツに v-once を使わない -->
<template>
  <!-- ❌ リスト項目の更新が必要な場合、v-once を使うべきではない -->
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>

<!-- 3. 最適化のために構造を壊さない -->
<template>
  <!-- ⚠️ 静的ホイスティングのために論理的に関連するコンテンツを無理に分離しない -->
  <div>
    <h1>タイトル</h1>
    <p>コンテンツ</p>
  </div>
</template>
```

## 6. Interview Summary

> 面接まとめ

### クイックメモ

**静的ホイスティング**：

- **定義**：コンパイル段階で静的ノードを定数に引き上げ、一度だけ作成
- **メリット**：VNode 作成と diff コストの削減
- **自動化**：コンパイラが自動処理、開発者は意識不要
- **対象**：reactive 状態に全く依存しないノード

**v-once**：

- **定義**：一度だけレンダリングするコンテンツを手動でマーク
- **対象**：動的バインディングを含むが一度だけレンダリングするブロック
- **パフォーマンス**：不要な更新の削減

**重要な違い**：

- 静的ホイスティング：自動、完全に静的
- v-once：手動、動的バインディングを含める可能

### 面接回答例

**Q: Vue3 の静的ホイスティングとは何か？**

> 「Vue3 における静的ホイスティングとは、コンパイル段階での最適化です。コンパイラが template を分析し、reactive 状態に全く依存せず永遠に変化しないノードを抽出してファイルトップレベルの定数に変換します。初回レンダリング時にのみ作成し、以降の再レンダリングではそのまま再利用することで、VNode 作成と diff のコストを削減します。開発者は特別なコードを書く必要なく、通常の template を書くだけでコンパイラが自動的にどのノードをホイスティング可能か判断します。永遠に変化しないコンテンツのブロックを自分で指定したい場合は v-once を使うこともできます。」

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
