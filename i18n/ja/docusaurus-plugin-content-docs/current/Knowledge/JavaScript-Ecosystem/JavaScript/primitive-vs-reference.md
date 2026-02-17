---
id: primitive-vs-reference
title: '[Medium] 📄 Primitive vs Reference Types'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Primitive Types and Reference Types?

> プリミティブ型（Primitive Types）と参照型（Reference Types）とは何か？

JavaScript のデータ型は、**プリミティブ型**と**参照型**の 2 つに大別されます。メモリの格納方法と値の受け渡しの挙動に本質的な違いがあります。

### プリミティブ型（Primitive Types）

**特徴**：

- **スタック（Stack）**に格納される
- 受け渡し時に**値そのものをコピー**する（Call by Value）
- 不変（Immutable）である

**7 種類**：

```javascript
// 1. String（文字列）
const str = 'hello';

// 2. Number（数値）
const num = 42;

// 3. Boolean（真偽値）
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol（ES6）
const sym = Symbol('unique');

// 7. BigInt（ES2020）
const bigInt = 9007199254740991n;
```

### 参照型（Reference Types）

**特徴**：

- **ヒープ（Heap）**に格納される
- 受け渡し時に**参照（メモリアドレス）をコピー**する（Call by Reference）
- 可変（Mutable）である

**種類**：

```javascript
// 1. Object（オブジェクト）
const obj = { name: 'John' };

// 2. Array（配列）
const arr = [1, 2, 3];

// 3. Function（関数）
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> 値渡し（Call by Value）vs 参照渡し（Call by Reference）

### 値渡し（Call by Value）- プリミティブ型

**挙動**：値そのものをコピーし、コピーを変更しても元の値に影響しない。

```javascript
// プリミティブ型：値渡し
let a = 10;
let b = a; // 値をコピー

b = 20; // b を変更

console.log(a); // 10（影響なし）
console.log(b); // 20
```

**メモリ図**：

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ ← 独立した値
├─────────┤
│ b: 20   │ ← 独立した値（コピー後に変更）
└─────────┘
```

### 参照渡し（Call by Reference）- 参照型

**挙動**：メモリアドレスをコピーし、2 つの変数が同じオブジェクトを指す。

```javascript
// 参照型：参照渡し
let obj1 = { name: 'John' };
let obj2 = obj1; // メモリアドレスをコピー

obj2.name = 'Jane'; // obj2 経由で変更

console.log(obj1.name); // 'Jane'（影響あり！）
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true（同じオブジェクトを指す）
```

**メモリ図**：

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (同じオブジェクト)│
└─────────┘                    └──────────────────┘
```

## 3. Common Quiz Questions

> よくあるクイズ問題

### 問題 1：プリミティブ型の受け渡し

```javascript
function changeValue(x) {
  x = 100;
  console.log('関数内 x:', x);
}

let num = 50;
changeValue(num);
console.log('関数外 num:', num);
```

<details>
<summary>クリックして答えを見る</summary>

```javascript
// 関数内 x: 100
// 関数外 num: 50
```

**解説**：

- `num` はプリミティブ型（Number）
- 関数に渡す際に**値をコピー**するため、`x` と `num` は独立した変数
- `x` を変更しても `num` には影響しない

```javascript
// 実行フロー
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50（コピー）
x = 100; // Stack: x = 100（x のみ変更）
console.log(num); // Stack: num = 50（影響なし）
```

</details>

### 問題 2：参照型の受け渡し

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('関数内 obj.name:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('関数外 person.name:', person.name);
```

<details>
<summary>クリックして答えを見る</summary>

```javascript
// 関数内 obj.name: Changed
// 関数外 person.name: Changed
```

**解説**：

- `person` は参照型（Object）
- 関数に渡す際に**メモリアドレスをコピー**
- `obj` と `person` は**同じオブジェクト**を指す
- `obj` 経由でオブジェクトの内容を変更すると、`person` にも影響する

```javascript
// メモリ図
let person = { name: 'Original' }; // Heap: オブジェクト作成 @0x001
changeObject(person); // Stack: obj = @0x001（アドレスコピー）
obj.name = 'Changed'; // Heap: @0x001.name = 'Changed'
console.log(person.name); // Heap: @0x001.name（同じオブジェクト）
```

</details>

### 問題 3：再代入 vs プロパティ変更

```javascript
function test1(obj) {
  obj.name = 'Modified'; // プロパティ変更
}

function test2(obj) {
  obj = { name: 'New Object' }; // 再代入
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>クリックして答えを見る</summary>

```javascript
// A: Modified
// B: Modified（'New Object' ではない！）
```

**解説**：

**test1：プロパティ変更**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // ✅ 元のオブジェクトのプロパティを変更
}
// person と obj は同じオブジェクトを指すため、変更される
```

**test2：再代入**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // ❌ obj の参照先を変えるだけ
}
// obj は新しいオブジェクトを指すが、person は元のオブジェクトを指したまま
```

**メモリ図**：

```text
// test1 の前
person ────> { name: 'Original' }
obj    ────> { name: 'Original' } (同じもの)

// test1 の後
person ────> { name: 'Modified' }
obj    ────> { name: 'Modified' } (同じもの)

// test2 実行中
person ────> { name: 'Modified' }    (変わらず)
obj    ────> { name: 'New Object' }  (新しいオブジェクト)

// test2 終了後
person ────> { name: 'Modified' }    (依然として変わらず)
// obj は破棄され、新しいオブジェクトはガベージコレクションされる
```

</details>

### 問題 4：配列の受け渡し

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>クリックして答えを見る</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**解説**：

- `modifyArray`：元の配列の内容を変更するため、`numbers` に影響する
- `reassignArray`：引数の参照先を変えるだけなので、`numbers` には影響しない

</details>

### 問題 5：比較演算

```javascript
// プリミティブ型の比較
let a = 10;
let b = 10;
console.log('A:', a === b);

// 参照型の比較
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>クリックして答えを見る</summary>

```javascript
// A: true
// B: false
// C: true
```

**解説**：

**プリミティブ型**：値を比較

```javascript
10 === 10; // true（値が同じ）
```

**参照型**：メモリアドレスを比較

```javascript
obj1 === obj2; // false（異なるオブジェクト、異なるアドレス）
obj1 === obj3; // true（同じオブジェクトを指す）
```

**メモリ図**：

```text
obj1 ────> @0x001: { value: 10 }
obj2 ────> @0x002: { value: 10 } (内容は同じだがアドレスが異なる)
obj3 ────> @0x001: { value: 10 } (obj1 と同じアドレス)
```

</details>

## 4. Shallow Copy vs Deep Copy

> シャローコピー vs ディープコピー

### シャローコピー（Shallow Copy）

**定義**：第 1 階層のみコピーし、ネストされたオブジェクトは依然として参照のまま。

#### 方法 1：スプレッド構文（Spread Operator）

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

// 第 1 階層の変更：元のオブジェクトに影響しない
copy.name = 'Jane';
console.log(original.name); // 'John'（影響なし）

// ネストされたオブジェクトの変更：元のオブジェクトに影響する！
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung'（影響あり！）
```

#### 方法 2：Object.assign()

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John'（影響なし）
```

#### 方法 3：配列のシャローコピー

```javascript
const arr1 = [1, 2, 3];

// 方法 1：スプレッド構文
const arr2 = [...arr1];

// 方法 2：slice()
const arr3 = arr1.slice();

// 方法 3：Array.from()
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1（影響なし）
```

### ディープコピー（Deep Copy）

**定義**：ネストされたオブジェクトを含むすべての階層を完全にコピーする。

#### 方法 1：JSON.parse + JSON.stringify（最も一般的）

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

// ネストされたオブジェクトの変更：元のオブジェクトに影響しない
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'（影響なし）

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming']（影響なし）
```

**制約**：

```javascript
const obj = {
  date: new Date(), // ❌ 文字列になる
  func: () => {}, // ❌ 無視される
  undef: undefined, // ❌ 無視される
  symbol: Symbol('test'), // ❌ 無視される
  regexp: /abc/, // ❌ {} になる
  circular: null, // ❌ 循環参照はエラーになる
};
obj.circular = obj; // 循環参照

JSON.parse(JSON.stringify(obj)); // エラーまたはデータの欠損
```

#### 方法 2：structuredClone()（モダンブラウザ）

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

// Date などの特殊なオブジェクトも正しくコピーできる
console.log(copy.date instanceof Date); // true
```

**利点**：

- ✅ Date、RegExp、Map、Set などをサポート
- ✅ 循環参照をサポート
- ✅ パフォーマンスが良い

**制約**：

- ❌ 関数はサポートしない
- ❌ Symbol はサポートしない

#### 方法 3：再帰によるディープコピー実装

```javascript
function deepClone(obj) {
  // null と非オブジェクトの処理
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 配列の処理
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Date の処理
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // RegExp の処理
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // オブジェクトの処理
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// 使用例
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'（影響なし）
```

#### 方法 4：Lodash の使用

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### シャローコピー vs ディープコピーの比較

| 特性           | シャローコピー   | ディープコピー     |
| -------------- | ---------------- | ------------------ |
| コピー階層     | 第 1 階層のみ    | すべての階層       |
| ネストオブジェクト | 参照のまま     | 完全に独立         |
| パフォーマンス | 速い             | 遅い               |
| メモリ         | 少ない           | 多い               |
| 使用場面       | シンプルなオブジェクト | 複雑なネスト構造 |

## 5. Common Pitfalls

> よくある落とし穴

### 落とし穴 1：引数の受け渡しでプリミティブ型を変更できると思い込む

```javascript
// ❌ 間違った理解
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5（6 にはならない！）

// ✅ 正しい書き方
count = increment(count); // 戻り値を受け取る必要がある
console.log(count); // 6
```

### 落とし穴 2：再代入で外部のオブジェクトを変更できると思い込む

```javascript
// ❌ 間違った理解
function resetObject(obj) {
  obj = { name: 'Reset' }; // 引数の参照先を変えるだけ
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original'（リセットされていない！）

// ✅ 正しい書き方 1：プロパティを変更
function resetObject(obj) {
  obj.name = 'Reset';
}

// ✅ 正しい書き方 2：新しいオブジェクトを返す
function resetObject(obj) {
  return { name: 'Reset' };
}
person = resetObject(person);
```

### 落とし穴 3：スプレッド構文がディープコピーだと思い込む

```javascript
// ❌ 間違った理解
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // シャローコピー！

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane'（影響を受けた！）

// ✅ 正しい書き方：ディープコピー
const copy = JSON.parse(JSON.stringify(original));
// または
const copy = structuredClone(original);
```

### 落とし穴 4：const の誤解

```javascript
// const は再代入できないだけで、不変ではない！

const obj = { name: 'John' };

// ❌ 再代入はできない
obj = { name: 'Jane' }; // TypeError: Assignment to constant variable

// ✅ プロパティは変更できる
obj.name = 'Jane'; // 正常に動作
obj.age = 30; // 正常に動作

// 本当に不変にしたい場合
const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane'; // サイレントに失敗（strict モードではエラー）
console.log(immutableObj.name); // 'John'（変更されていない）
```

### 落とし穴 5：ループ内の参照問題

```javascript
// ❌ よくある間違い
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // すべて同じオブジェクトを指す！
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]
// すべて同じオブジェクトで、最終値はすべて 2

// ✅ 正しい書き方：毎回新しいオブジェクトを作成
const arr = [];

for (let i = 0; i < 3; i++) {
  arr.push({ value: i }); // 毎回新しいオブジェクトを作成
}

console.log(arr);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practices

> ベストプラクティス

### ✅ 推奨される方法

```javascript
// 1. オブジェクトをコピーする必要がある場合、明示的にコピー方法を使用する
const original = { name: 'John', age: 30 };

// シャローコピー（シンプルなオブジェクト）
const copy1 = { ...original };

// ディープコピー（ネストされたオブジェクト）
const copy2 = structuredClone(original);

// 2. 関数は副作用に依存して引数を変更しない
// ❌ 良くない
function addItem(arr, item) {
  arr.push(item); // 元の配列を変更
}

// ✅ 良い
function addItem(arr, item) {
  return [...arr, item]; // 新しい配列を返す
}

// 3. const を使用して意図しない再代入を防ぐ
const config = { theme: 'dark' };
// config = {}; // エラーになる

// 4. 不変オブジェクトが必要な場合は Object.freeze を使用
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ 避けるべき方法

```javascript
// 1. 引数の受け渡しでプリミティブ型を変更しようとしない
function increment(num) {
  num++; // ❌ 効果なし
}

// 2. シャローコピーとディープコピーを混同しない
const copy = { ...nested }; // ❌ ディープコピーだと思い込む

// 3. ループ内で同じオブジェクト参照を再利用しない
for (let i = 0; i < 3; i++) {
  arr.push(obj); // ❌ すべて同じオブジェクトを指す
}
```

## 7. Interview Summary

> 面接のまとめ

### 簡単な覚え方

**プリミティブ型（Primitive）**：

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- 値渡し（Call by Value）
- Stack に格納
- 不変（Immutable）

**参照型（Reference）**：

- Object, Array, Function, Date, RegExp, etc.
- 参照渡し（Call by Reference）
- Heap に格納
- 可変（Mutable）

### 面接での回答例

**Q: JavaScript は Call by Value なのか Call by Reference なのか？**

> JavaScript は**すべての型に対して Call by Value** ですが、参照型が渡す「値」はメモリアドレスです。
>
> - プリミティブ型：値のコピーを渡すため、変更しても元の値に影響しない
> - 参照型：アドレスのコピーを渡すため、アドレス経由で元のオブジェクトを変更できる
> - ただし、再代入（アドレスの変更）をしても元のオブジェクトには影響しない

## Reference

- [MDN - Data Structures](https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript の深い理解](https://javascript.info/object-copy)
