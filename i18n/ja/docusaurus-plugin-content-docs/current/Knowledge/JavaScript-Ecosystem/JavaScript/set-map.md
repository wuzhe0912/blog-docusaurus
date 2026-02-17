---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Set and Map?

> Set と Map とは何か？

`Set` と `Map` は ES6 で導入された2つの新しいデータ構造であり、従来のオブジェクトや配列よりも特定のシナリオに適したソリューションを提供します。

### Set（集合）

**定義**：`Set` は**値が一意**な集合であり、数学における集合の概念に似ています。

**特徴**：

- 格納された値は**重複しない**
- `===` を使用して値の等価性を判定する
- 挿入順序を維持する
- あらゆる型の値を格納できる（プリミティブ型またはオブジェクト）

**基本的な使い方**：

```javascript
// Set を作成
const set = new Set();

// 値を追加
set.add(1);
set.add(2);
set.add(2); // 重複した値は追加されない
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// 値が存在するか確認
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// 値を削除
set.delete(2);
console.log(set.has(2)); // false

// Set をクリア
set.clear();
console.log(set.size); // 0
```

**配列から Set を作成**：

```javascript
// 配列から重複値を除去
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// 配列に戻す
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// 省略形
const uniqueArr2 = [...new Set(arr)];
```

### Map（マップ）

**定義**：`Map` は**キーと値のペア**の集合であり、オブジェクトに似ていますが、キーにあらゆる型を使用できます。

**特徴**：

- キーにあらゆる型を使用できる（文字列、数値、オブジェクト、関数など）
- 挿入順序を維持する
- `size` プロパティがある
- イテレーション順序は挿入順序と一致する

**基本的な使い方**：

```javascript
// Map を作成
const map = new Map();

// キーと値のペアを追加
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// 値を取得
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// キーが存在するか確認
console.log(map.has('name')); // true

// キーと値のペアを削除
map.delete('name');

// サイズを取得
console.log(map.size); // 3

// Map をクリア
map.clear();
```

**配列から Map を作成**：

```javascript
// 2次元配列から作成
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// オブジェクトから作成
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Set と配列の違い

| 特性           | Set                    | Array                    |
| -------------- | ---------------------- | ------------------------ |
| 重複値         | 許可しない             | 許可する                 |
| インデックス   | サポートしない         | サポートする             |
| 検索パフォーマンス | O(1)               | O(n)                     |
| 挿入順序       | 維持する               | 維持する                 |
| 主なメソッド   | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**使用シナリオ**：

```javascript
// ✅ Set の使用に適している：一意な値が必要
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Set の使用に適している：高速な存在確認
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('ホームページは訪問済み');
}

// ✅ Array の使用に適している：インデックスや重複値が必要
const scores = [100, 95, 100, 90]; // 重複を許可
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Map とオブジェクトの違い

| 特性           | Map            | Object                 |
| -------------- | -------------- | ---------------------- |
| キーの型       | あらゆる型     | 文字列または Symbol    |
| サイズ         | `size` プロパティ | 手動で計算が必要     |
| デフォルトキー | なし           | プロトタイプチェーンあり |
| イテレーション順序 | 挿入順序   | ES2015+ で挿入順序を維持 |
| パフォーマンス | 頻繁な追加・削除が速い | 一般的な場合は速い |
| JSON           | 直接サポートしない | ネイティブサポート  |

**使用シナリオ**：

```javascript
// ✅ Map の使用に適している：キーが文字列でない
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Map の使用に適している：頻繁な追加・削除が必要
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Object の使用に適している：静的な構造、JSON が必要
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config); // 直接シリアライズ可能
```

## 4. Common Interview Questions

> よくある面接の質問

### 問題 1：配列の重複値を除去する

配列から重複値を除去する関数を実装してください。

```javascript
function removeDuplicates(arr) {
  // あなたの実装
}
```

<details>
<summary>クリックして答えを見る</summary>

**方法 1：Set を使用（推奨）**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**方法 2：filter + indexOf を使用**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**方法 3：reduce を使用**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**パフォーマンス比較**：

- Set 方法：O(n)、最速
- filter + indexOf：O(n²)、遅い
- reduce + includes：O(n²)、遅い

</details>

### 問題 2：配列に重複値があるか確認する

配列に重複値があるかどうかを確認する関数を実装してください。

```javascript
function hasDuplicates(arr) {
  // あなたの実装
}
```

<details>
<summary>クリックして答えを見る</summary>

**方法 1：Set を使用（推奨）**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**方法 2：Set の has メソッドを使用**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**方法 3：indexOf を使用**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**パフォーマンス比較**：

- Set 方法 1：O(n)、最速
- Set 方法 2：O(n)、平均的に早期終了の可能性がある
- indexOf 方法：O(n²)、遅い

</details>

### 問題 3：要素の出現回数を数える

配列内の各要素の出現回数を数える関数を実装してください。

```javascript
function countOccurrences(arr) {
  // あなたの実装
}
```

<details>
<summary>クリックして答えを見る</summary>

**方法 1：Map を使用（推奨）**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**方法 2：reduce + Map を使用**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**方法 3：オブジェクトに変換**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**Map を使用する利点**：

- キーにあらゆる型を使用できる（オブジェクト、関数など）
- `size` プロパティがある
- イテレーション順序は挿入順序と一致する

</details>

### 問題 4：2つの配列の共通部分を見つける

2つの配列の共通部分（共通要素）を見つける関数を実装してください。

```javascript
function intersection(arr1, arr2) {
  // あなたの実装
}
```

<details>
<summary>クリックして答えを見る</summary>

**方法 1：Set を使用**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**方法 2：filter + Set を使用**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**方法 3：filter + includes を使用**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**パフォーマンス比較**：

- Set 方法：O(n + m)、最速
- filter + includes：O(n × m)、遅い

</details>

### 問題 5：2つの配列の差集合を見つける

2つの配列の差集合（arr1 にあって arr2 にない要素）を見つける関数を実装してください。

```javascript
function difference(arr1, arr2) {
  // あなたの実装
}
```

<details>
<summary>クリックして答えを見る</summary>

**方法 1：Set を使用**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**方法 2：Set で重複を除去してからフィルタ**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**方法 3：includes を使用**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**パフォーマンス比較**：

- Set 方法：O(n + m)、最速
- includes 方法：O(n × m)、遅い

</details>

### 問題 6：LRU Cache を実装する

Map を使用して LRU（Least Recently Used）キャッシュを実装してください。

```javascript
class LRUCache {
  constructor(capacity) {
    // あなたの実装
  }

  get(key) {
    // あなたの実装
  }

  put(key, value) {
    // あなたの実装
  }
}
```

<details>
<summary>クリックして答えを見る</summary>

**実装**：

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // キーを最後に移動（最近使用されたことを示す）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // キーが既に存在する場合、まず削除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // 容量が一杯の場合、最も古いキー（最初のキー）を削除
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // キーと値のペアを追加（自動的に最後に配置される）
    this.cache.set(key, value);
  }
}

// 使用例
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // キー 2 を削除
console.log(cache.get(2)); // -1（既に削除済み）
console.log(cache.get(3)); // 'three'
```

**説明**：

- Map は挿入順序を維持し、最初のキーが最も古い
- `get` 時にキーを最後に移動して、最近使用されたことを示す
- `put` 時に容量が一杯であれば、最初のキーを削除する

</details>

### 問題 7：オブジェクトを Map のキーとして使用する

以下のコードの出力結果を説明してください。

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>クリックして答えを見る</summary>

```javascript
// 'first'
// 'second'
// 2
```

**解説**：

- `obj1` と `obj2` は内容が同じでも、**異なるオブジェクトインスタンス**である
- Map は**参照比較**（reference comparison）を使用し、値の比較ではない
- そのため `obj1` と `obj2` は異なるキーとして扱われる
- 通常のオブジェクトを Map として使用すると、オブジェクトが文字列 `[object Object]` に変換され、すべてのオブジェクトが同じキーになってしまう

**通常のオブジェクトとの比較**：

```javascript
// 通常のオブジェクト：キーは文字列に変換される
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second'（上書きされた）
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]']（キーは1つだけ）

// Map：オブジェクト参照を維持
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet と WeakMap

> WeakSet と WeakMap の違い

### WeakSet

**特徴**：

- **オブジェクト**のみ格納可能（プリミティブ型は格納不可）
- **弱参照**：オブジェクトに他の参照がなくなると、ガベージコレクションされる
- `size` プロパティがない
- イテレーション不可
- `clear` メソッドがない

**使用シナリオ**：オブジェクトのマーキング、メモリリークの防止

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// obj1 に他の参照がなくなると、ガベージコレクションされる
// weakSet 内の参照も自動的にクリアされる
```

### WeakMap

**特徴**：

- キーは**オブジェクト**のみ（プリミティブ型は不可）
- **弱参照**：キーオブジェクトに他の参照がなくなると、ガベージコレクションされる
- `size` プロパティがない
- イテレーション不可
- `clear` メソッドがない

**使用シナリオ**：オブジェクトのプライベートデータの格納、メモリリークの防止

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// obj1 に他の参照がなくなると、ガベージコレクションされる
// weakMap 内のキーと値のペアも自動的にクリアされる
```

### WeakSet/WeakMap vs Set/Map の比較

| 特性             | Set/Map        | WeakSet/WeakMap  |
| ---------------- | -------------- | ---------------- |
| キー/値の型      | あらゆる型     | オブジェクトのみ |
| 弱参照           | いいえ         | はい             |
| イテレーション可能 | はい          | いいえ           |
| size プロパティ  | あり           | なし             |
| clear メソッド   | あり           | なし             |
| ガベージコレクション | 自動クリアしない | 自動クリアする |

## 6. Best Practices

> ベストプラクティス

### 推奨される方法

```javascript
// 1. 一意な値が必要な場合は Set を使用
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. 高速な検索が必要な場合は Set を使用
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // アクセスを許可
}

// 3. キーが文字列でない場合は Map を使用
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. 頻繁な追加・削除が必要な場合は Map を使用
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. オブジェクトデータの関連付けでメモリリークを避ける場合は WeakMap を使用
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### 避けるべき方法

```javascript
// 1. Set を配列の全機能の代替として使用しない
// ❌ 良くない：インデックスが必要な場合に Set を使用
const set = new Set([1, 2, 3]);
// set[0] // undefined、インデックスでアクセスできない

// ✅ 良い：インデックスが必要な場合は配列を使用
const arr = [1, 2, 3];
arr[0]; // 1

// 2. Map をオブジェクトの全機能の代替として使用しない
// ❌ 良くない：単純な静的構造に Map を使用
const config = new Map();
config.set('apiUrl', 'https://api.example.com');
config.set('timeout', 5000);

// ✅ 良い：単純な構造にはオブジェクトを使用
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. Set と Map を混同しない
// ❌ 間違い：Set にはキーと値のペアがない
const set = new Set();
set.set('key', 'value'); // TypeError: set.set is not a function

// ✅ 正しい：Map にはキーと値のペアがある
const map = new Map();
map.set('key', 'value');
```

## 7. Interview Summary

> 面接のまとめ

### クイックメモリー

**Set（集合）**：

- 値が一意で重複しない
- 高速検索：O(1)
- 適用：重複除去、存在確認の高速化

**Map（マップ）**：

- キーと値のペア、キーにあらゆる型を使用可能
- 挿入順序を維持
- 適用：文字列以外のキー、頻繁な追加・削除

**WeakSet/WeakMap**：

- 弱参照、自動ガベージコレクション
- キー/値はオブジェクトのみ
- 適用：メモリリークの防止

### 面接回答例

**Q: いつ配列の代わりに Set を使用すべきですか？**

> "値の一意性を保証する必要がある場合や、値の存在を高速に確認する必要がある場合は、Set を使用すべきです。Set の `has` メソッドは O(1) の時間計算量であり、配列の `includes` は O(n) です。例えば、配列の重複値の除去やユーザー権限の確認時には、Set の方が効率的です。"

**Q: Map とオブジェクトの違いは何ですか？**

> "Map のキーにはオブジェクトや関数など、あらゆる型を使用できますが、オブジェクトのキーは文字列または Symbol のみです。Map には `size` プロパティがあり、直接サイズを取得できますが、オブジェクトは手動で計算する必要があります。Map は挿入順序を維持し、プロトタイプチェーンがないため、純粋なデータの格納に適しています。オブジェクトをキーとして使用する必要がある場合や、頻繁な追加・削除が必要な場合は、Map がより良い選択です。"

**Q: WeakMap と Map の違いは何ですか？**

> "WeakMap のキーはオブジェクトのみで、弱参照を使用します。キーオブジェクトに他の参照がなくなると、WeakMap 内の対応するエントリが自動的にガベージコレクションされ、メモリリークを防ぐことができます。WeakMap はイテレーション不可で、`size` プロパティもありません。オブジェクトのプライベートデータやメタデータの格納に適しており、オブジェクトが破棄されると関連データも自動的にクリアされます。"

## Reference

- [MDN - Set](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
