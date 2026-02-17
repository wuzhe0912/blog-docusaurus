---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> Closure とは何ですか？

クロージャを理解するには、まず JavaScript の変数スコープと、関数がどのように外部変数にアクセスするかを理解する必要があります。

### Variable Scope（変数スコープ）

JavaScript では、変数のスコープは global scope と function scope の2種類に分かれます。

```js
// global scope
let a = 1;

function parentFunction() {
  // function scope
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // print 1 2 3, can access global scope & function scope
  }

  childFunction();
}

parentFunction();
console.log(a); // print 1, can access global scope
console.log(b, c); // エラーが発生、function scope 内の変数にはアクセスできない
```

### Closure example

Closure の発動条件は、子関数が親関数の内部で定義され、return を通じて返されることで、子関数内の環境変数を保持する（つまり `Garbage Collection（ガベージコレクション）` を回避する）ことです。

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`現在のカウント：${count}`);
  };
}

const counter = parentFunction();

counter(); // print 現在のカウント：1
counter(); // print 現在のカウント：2
// count 変数は回収されない。childFunction がまだ存在し、呼び出すたびに count の値が更新されるため
```

ただし注意が必要です。クロージャは変数をメモリに保持するため、変数が多すぎるとメモリの使用量が過大になり（クロージャの乱用は禁物）、パフォーマンスに影響を及ぼします。

## 2. Create a function that meets the following conditions

> 以下の条件を満たす function を作成してください（クロージャの概念を使用して処理）

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

2つの function に分割して処理します

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// use closure save variable

function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Second Solution : single function

もちろん最初の解法は reject される可能性が高いので、同一の function にまとめる必要があります。

```js
function plus(value, subValue) {
  // 毎回渡される引数の数で判断する
  if (arguments.length > 1) {
    return value + subValue;
  } else {
    return function (item) {
      return value + item;
    };
  }
}

console.log(plus(2, 5));
console.log(plus(2)(5));
```

## 3. Please take advantage of the closure feature to increase the number

> クロージャの特性を利用して、数値をインクリメントしてください

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

ここでは Arrow Function を使わず、通常の function 形式を使用します。

```js
function plus() {
  let cash = 0;
  let counter = {
    add() {
      cash += 1;
      console.log(cash);
    },
  };
  return counter;
}

var obj = plus();
obj.add();
obj.add();
```

### Second Solution : return object

前の解法では、object を直接 return の中に含めることもできます

```js
function plus() {
  let cash = 0;
  return {
    add: function () {
      cash += 1;
      console.log(cash);
    },
  };
}

var obj = plus();
obj.add();
obj.add();
```

## 4. What will be printed in this nested function call?

> このネストされた関数呼び出しは何を出力しますか？

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

a(b(c));
```

### 解析

**実行結果**：

```
hello
TypeError: aa is not a function
```

### 詳細な実行フロー

```js
// a(b(c)) を実行
// JavaScript は内側から外側へ関数を実行する

// ステップ 1：最も内側の b(c) を実行
b(c)
  ↓
// c 関数が引数として b に渡される
// b 関数の内部で bb()、つまり c() が実行される
c() // 'hello' を出力
  ↓
// b 関数には return 文がない
// そのため undefined を返す
return undefined

// ステップ 2：a(undefined) を実行
a(undefined)
  ↓
// undefined が引数として a に渡される
// a 関数の内部で aa() を実行しようとする
// つまり undefined()
undefined() // ❌ エラー：TypeError: aa is not a function
```

### なぜこうなるのか？

#### 1. 関数の実行順序（内側から外側へ）

```js
// 例
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. まず multiply(2, 3) を実行 → 6
           └────── 3. 次に add(6) を実行

// 同じ概念
a(b(c))
  ↑ ↑
  | └─ 1. まず b(c) を実行
  └─── 2. 次に a(b(c) の結果) を実行
```

#### 2. 関数に return がない場合は undefined を返す

```js
function b(bb) {
  bb(); // 実行したが return がない
} // 暗黙的に return undefined

// 以下と同等
function b(bb) {
  bb();
  return undefined; // JavaScript が自動的に追加
}
```

#### 3. 関数でないものを呼び出すとエラーが発生する

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// エラーが発生するその他のケース
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### 修正方法

#### 方法 1：b 関数が関数を返すようにする

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
  return function () {
    console.log('b executed');
  };
}

function c() {
  console.log('hello');
}

a(b(c));
// 出力：
// hello
// b executed
```

#### 方法 2：関数を直接渡し、先に実行しない

```js
function a(aa) {
  aa();
}

function b(bb) {
  return function () {
    bb();
  };
}

function c() {
  console.log('hello');
}

a(b(c)); // 'hello' のみ出力

// または以下のように書く
a(() => b(c)); // 'hello' を出力
```

#### 方法 3：実行ロジックを変更する

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

// 分けて実行
b(c); // 'hello' を出力
a(() => console.log('a executed')); // 'a executed' を出力
```

### 関連問題

#### 問題 1：以下のように変更したらどうなりますか？

```js
function a(aa) {
  return aa();
}

function b(bb) {
  return bb();
}

function c() {
  console.log('hello');
  return 'world';
}

console.log(a(b(c)));
```

<details>
<summary>クリックして答えを見る</summary>

```
hello
TypeError: aa is not a function
```

**解析**：

1. `b(c)` → `c()` を実行し、`'hello'` を出力、`'world'` を返す
2. `a('world')` → `'world'()` を実行... 待って、これもエラーになります！

**正解**：

```
hello
TypeError: aa is not a function
```

`b(c)` は `'world'`（文字列）を返し、`a('world')` は `'world'()` を実行しようとしますが、文字列は関数ではないためエラーになります。

</details>

#### 問題 2：すべてに return がある場合は？

```js
function a(aa) {
  return aa;
}

function b(bb) {
  return bb;
}

function c() {
  return 'hello';
}

const result = a(b(c));
console.log(result);
console.log(result());
```

<details>
<summary>クリックして答えを見る</summary>

```
[Function: c]
hello
```

**解析**：

1. `b(c)` → `c` 関数自体を返す（実行しない）
2. `a(c)` → `c` 関数自体を返す
3. `result` は `c` 関数
4. `result()` → `c()` を実行し、`'hello'` を返す

</details>

### 記憶のポイント

```javascript
// 関数呼び出しの優先順位
a(b(c))
  ↓
// 1. まず最も内側を実行
b(c) // b に return がなければ undefined
  ↓
// 2. 次に外側を実行
a(undefined) // undefined() を実行しようとするとエラー

// 解決方法
// ✅ 1. 中間関数が関数を返すようにする
// ✅ 2. またはアロー関数でラップする
a(() => b(c))
```

## Reference

- [Closures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [Day6 [JavaScript 基礎] 垃圾回収メカニズム](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - JavaScript メモリ管理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [MDN - Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Functions)
- [MDN - TypeError](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
