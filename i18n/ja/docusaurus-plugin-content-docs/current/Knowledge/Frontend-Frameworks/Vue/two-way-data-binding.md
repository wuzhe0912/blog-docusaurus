---
id: vue-two-way-data-binding
title: '[Hard] 📄 双方向データバインディング'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> Vue2 と Vue3 がそれぞれどのように双方向バインディングを実装しているか、その基礎原理を説明してください。

Vue の双方向バインディングを理解するには、まずリアクティブシステムの動作メカニズムと、Vue2 と Vue3 の実装上の違いを把握する必要があります。

### Vue2 の実装方式

Vue2 は `Object.defineProperty` を使って双方向バインディングを実装しています。このメソッドでオブジェクトのプロパティを `getter` と `setter` にラップし、プロパティの変更を監視できます。フローは以下の通りです：

#### 1. Data Hijacking（データハイジャッキング）

Vue2 では、コンポーネント内のデータオブジェクトが作成される際、Vue がオブジェクト内のすべてのプロパティを走査し、`Object.defineProperty` でこれらのプロパティを `getter` と `setter` に変換します。これにより Vue はデータの読み取りと変更を追跡できるようになります。

#### 2. Dependency Collection（依存関係の収集）

コンポーネントのレンダリング関数が実行される際、data 内のプロパティが読み取られると `getter` が発火します。Vue はこれらの依存関係を記録し、データが変化した際に依存するコンポーネントに通知できるようにします。

#### 3. Dispatching Updates（更新のディスパッチ）

データが変更されると `setter` が発火し、Vue はすべての依存コンポーネントに通知してレンダリング関数を再実行し、DOM を更新します。

#### Vue2 コード例

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log(`get ${key}: ${val}`);
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log(`set ${key}: ${newVal}`);
      val = newVal;
    },
  });
}

const data = { name: 'Pitt' };
defineReactive(data, 'name', data.name);

console.log(data.name); // getter が発火、"get name: Pitt" を出力
data.name = 'Vue2 Reactivity'; // setter が発火、"set name: Vue2 Reactivity" を出力
```

#### Vue2 の制限

`Object.defineProperty` には以下の制限があります：

- **オブジェクトプロパティの追加・削除を検知できない**：`Vue.set()` や `Vue.delete()` を使用する必要がある
- **配列のインデックス変更を検知できない**：Vue 提供の配列メソッド（`push`、`pop` など）を使用する必要がある
- **パフォーマンスの問題**：すべてのプロパティを再帰的に走査し、getter と setter を事前定義する必要がある

### Vue3 の実装方式

Vue3 は ES6 の `Proxy` を導入しました。これによりオブジェクトをプロキシでラップし、プロパティの変更を監視でき、同時にパフォーマンスも向上しています。フローは以下の通りです：

#### 1. Proxy によるデータハイジャッキング

Vue3 では `new Proxy` でデータへのプロキシを作成し、プロパティごとに `getter` と `setter` を定義する必要がありません。これにより、より細かいレベルでデータ変更を追跡でき、プロパティの追加や削除など、より多くの種類の操作をインターセプトできます。

#### 2. より効率的な依存関係追跡

Proxy を使用することで、Vue3 はより効率的に依存関係を追跡できます。`getter / setter` を事前定義する必要がなく、Proxy のインターセプト能力はより強力で、最大 13 種類の操作（`get`、`set`、`has`、`deleteProperty` など）をインターセプトできます。

#### 3. 自動的な最小限の再レンダリング

データが変化した際、Vue3 は UI のどの部分を更新する必要があるかをより正確に判断でき、不要な再レンダリングを減らしてパフォーマンスを向上させます。

#### Vue3 コード例

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`取得 ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`設定 ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name); // データ読み取り、Proxy の get が発火、"取得 name: Vue 3" を出力
data.name = 'Vue 3 Reactivity'; // データ変更、Proxy の set が発火、"設定 name: Vue 3 Reactivity" を出力
console.log(data.name); // "取得 name: Vue 3 Reactivity" を出力
```

### Vue2 vs Vue3 比較表

| 特性 | Vue2 | Vue3 |
| --- | --- | --- |
| 実装方式 | `Object.defineProperty` | `Proxy` |
| プロパティ追加の検知 | ❌ `Vue.set()` が必要 | ✅ ネイティブサポート |
| プロパティ削除の検知 | ❌ `Vue.delete()` が必要 | ✅ ネイティブサポート |
| 配列インデックスの検知 | ❌ 特定メソッドが必要 | ✅ ネイティブサポート |
| パフォーマンス | すべてのプロパティを再帰的に走査 | 遅延処理、パフォーマンスが向上 |
| ブラウザサポート | IE9+ | IE11 非サポート |

### 結論

Vue2 は `Object.defineProperty` で双方向バインディングを実装していますが、一定の制限があります（例：オブジェクトプロパティの追加・削除を検知できない）。Vue3 は ES6 の `Proxy` を導入し、より強力で柔軟なリアクティブシステムを提供するとともに、パフォーマンスも向上しています。これは Vue3 が Vue2 と比較した重要な改善点の一つです。

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> なぜ Vue3 は `Object.defineProperty` ではなく `Proxy` を使うのか？

### 主な理由

#### 1. より強力なインターセプト能力

`Proxy` は最大 13 種類の操作をインターセプトでき、`Object.defineProperty` はプロパティの読み取りと設定のみです：

```js
// Proxy がインターセプトできる操作
const handler = {
  get() {},              // プロパティ読み取り
  set() {},              // プロパティ設定
  has() {},              // in 演算子
  deleteProperty() {},   // delete 演算子
  ownKeys() {},          // Object.keys()
  getOwnPropertyDescriptor() {},
  defineProperty() {},
  preventExtensions() {},
  getPrototypeOf() {},
  isExtensible() {},
  setPrototypeOf() {},
  apply() {},            // 関数呼び出し
  construct() {}         // new 演算子
};
```

#### 2. 配列インデックスのネイティブ監視

```js
// Vue2 では検知不可
const arr = [1, 2, 3];
arr[0] = 10; // ❌ 更新がトリガーされない

// Vue3 では検知可能
const arr = reactive([1, 2, 3]);
arr[0] = 10; // ✅ 更新がトリガーされる
```

#### 3. オブジェクトプロパティの動的追加・削除のネイティブサポート

```js
// Vue2 では特殊な処理が必要
Vue.set(obj, 'newKey', 'value'); // ✅
obj.newKey = 'value'; // ❌ 更新がトリガーされない

// Vue3 ではネイティブサポート
const obj = reactive({});
obj.newKey = 'value'; // ✅ 更新がトリガーされる
delete obj.newKey; // ✅ 更新がトリガーされる
```

#### 4. パフォーマンスの向上

```js
// Vue2：すべてのプロパティを再帰的に走査する必要がある
function observe(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
    // 値がオブジェクトの場合、再帰処理が必要
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3：遅延処理、アクセス時にのみプロキシ化
function reactive(obj) {
  return new Proxy(obj, handler); // 再帰不要
}
```

#### 5. よりシンプルなコード

Vue3 のリアクティブ実装はコード量が大幅に削減され、メンテナンスコストが低下しました。

### なぜ Vue2 は Proxy を使わなかったのか？

主な理由は**ブラウザ互換性**です：

- Vue2 リリース時（2016年）、Proxy はまだ広くサポートされていなかった
- Vue2 は IE9+ をサポートする必要があり、Proxy は polyfill できない
- Vue3 は IE11 のサポートを終了したため、Proxy を採用できた

### 実際の例の比較

```js
// ===== Vue2 の制限 =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3]
  }
});

// ❌ 以下の操作では更新がトリガーされない
vm.obj.b = 2;           // プロパティ追加
delete vm.obj.a;        // プロパティ削除
vm.arr[0] = 10;         // 配列インデックスの変更
vm.arr.length = 0;      // 配列長の変更

// ✅ 特殊なメソッドが必要
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Vue3 ネイティブサポート =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3]
});

// ✅ 以下のすべての操作で更新がトリガーされる
state.obj.b = 2;        // プロパティ追加
delete state.obj.a;     // プロパティ削除
state.arr[0] = 10;      // 配列インデックスの変更
state.arr.length = 0;   // 配列長の変更
```

### まとめ

Vue3 が `Proxy` を使用する理由：

1. ✅ より完全なリアクティブサポート（オブジェクトプロパティの追加・削除、配列インデックスなど）
2. ✅ パフォーマンスの向上（遅延処理、事前の再帰走査が不要）
3. ✅ コードの簡素化（実装がよりシンプル）
4. ✅ より良い開発体験（特殊な API を覚える必要がない）

唯一のトレードオフは旧ブラウザ（IE11）のサポートを放棄したことですが、これは価値のある判断です。

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
