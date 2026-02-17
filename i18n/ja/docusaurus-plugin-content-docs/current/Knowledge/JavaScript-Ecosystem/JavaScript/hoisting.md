---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. What's Hoisting ?

JS の実行は、作成フェーズと実行フェーズの2段階に分けることができます：

```js
var name = 'Pitt';
console.log(name); // print Pitt
```

Hoisting の特性により、上記のコードは実際には先に変数を宣言し、その後に値を代入するという流れで理解する必要があります。

```js
// create
var name;

// execute
name = 'Pitt';
console.log(name);
```

一方、function は変数とは異なり、作成フェーズでメモリに割り当てられます。関数宣言は以下のようになります：

```js
getName();

function getName() {
  console.log('string'); // print string
}
```

上記のコードが正常に実行され console.log を出力できるのは、以下のロジックによるものです。function がまず最上部に引き上げられ、その後に function の呼び出しが行われます。

```js
// create
function getName() {
  console.log('string');
}

// execute
getName();
```

ただし注意が必要なのは、この Hoisting の特性において、式で使用する場合は記述順序に注意する必要があるということです。

作成フェーズでは、function が最も優先され、次に変数が処理されます。

### Correct

```js
name = 'Yumy';
console.log(name); // print Yumy
var name;

// --- Equal to ---

// create
var name;

// execute
name = 'Yumy';
console.log(name); // print Yumy
```

### Wrong

```js
console.log(name); // print undefined
var name = 'Jane';

// --- Equal to ---

// create
var name;

// execute
console.log(name); // print undefined，まだ値が代入されていないため、デフォルトの undefined が返される
name = 'Pitt';
```

## 2. What's `name` printed ?

```js
whoseName();

function whoseName() {
  if (name) {
    name = 'Nini';
  }
}

var name = 'Pitt';
console.log(name);
```

### Answer

```js
// create
function whoseName() {
  if (name) {
    name = 'Nini';
  }
}
var name;

// execute
whoseName();
name = 'Pitt';
console.log(name); // print Pitt
```

name は `whoseName()` の中で undefined を受け取るため、条件分岐には入りません。

しかし、関数宣言の下に再度代入があるため、たとえ function 内の条件分岐に入ったとしても、最終的には Pitt が出力されます。

---

## 3. 関数宣言 vs 変数宣言：Hoisting の優先順位

### 問題：同名の関数と変数

以下のコードの出力結果を判定してください：

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### 誤答（よくある誤解）

多くの人が以下のように考えます：

- `undefined` を出力する（var が先に引き上げられると考える）
- `'1'` を出力する（代入が影響すると考える）
- エラーになる（同名が衝突すると考える）

### 実際の出力

```js
[Function: foo]
```

### なぜ？

この問題は Hoisting の**優先順位ルール**を問うものです：

**Hoisting の優先順位：関数宣言 > 変数宣言**

```js
// 元のコード
console.log(foo);
var foo = '1';
function foo() {}

// 等価（Hoisting後）
// フェーズ1：生成フェーズ（Hoisting）
function foo() {} // 1. 関数宣言が先に巻き上げ
var foo; // 2. 変数宣言が巻き上げ（既存の関数を上書きしない）

// フェーズ2：実行フェーズ
console.log(foo); // この時点でfooは関数、出力 [Function: foo]
foo = '1'; // 3. 変数代入（関数を上書き）
```

### 重要な概念

**1. 関数宣言は完全に引き上げられる**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. var 変数宣言は宣言のみ引き上げられ、代入は引き上げられない**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. 関数宣言と変数宣言が同名の場合**

```js
// 巻き上げ後の順序
function foo() {} // 関数が先に巻き上げられ値が設定される
var foo; // 変数宣言が巻き上げられるが、既存の関数を上書きしない

// したがってfooは関数
console.log(foo); // [Function: foo]
```

### 完全な実行フロー

```js
// 元のコード
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== 等価 ========

// 生成フェーズ（Hoisting）
function foo() {} // 1️⃣ 関数宣言が巻き上げ（完全に巻き上げ、関数本体を含む）
var foo; // 2️⃣ 変数宣言が巻き上げ（fooを上書きしない、既に関数であるため）

// 実行フェーズ
console.log(foo); // [Function: foo] - fooは関数
foo = '1'; // 3️⃣ 変数代入（この時点で関数を上書き）
console.log(foo); // '1' - fooは文字列になる
```

### 発展問題

#### 問題 A：順序の影響

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**答え：**

```js
[Function: foo] // 1回目の出力
'1' // 2回目の出力
```

**理由：** コードの順序は Hoisting の結果に影響しません。引き上げの優先順位は依然として関数 > 変数です。

#### 問題 B：同名の複数の関数

```js
console.log(foo); // ?

function foo() {
  return 1;
}

var foo = '1';

function foo() {
  return 2;
}

console.log(foo); // ?
```

**答え：**

```js
[Function: foo] { return 2; } // 1回目の出力（後の関数が前の関数を上書き）
'1' // 2回目の出力（変数代入が関数を上書き）
```

**理由：**

```js
// 巻き上げ後
function foo() {
  return 1;
} // 1番目の関数

function foo() {
  return 2;
} // 2番目の関数が1番目を上書き

var foo; // 変数宣言（関数を上書きしない）

console.log(foo); // [Function: foo] { return 2; }
foo = '1'; // 変数代入（関数を上書き）
console.log(foo); // '1'
```

#### 問題 C：関数式 vs 関数宣言

```js
console.log(foo); // ?
console.log(bar); // ?

var foo = function () {
  return 1;
};

function bar() {
  return 2;
}
```

**答え：**

```js
undefined; // fooはundefined
[Function: bar] // barは関数
```

**理由：**

```js
// 巻き上げ後
var foo; // 変数宣言が巻き上げ（関数式は変数名のみ巻き上げ）
function bar() {
  return 2;
} // 関数宣言が完全に巻き上げ

console.log(foo); // undefined
console.log(bar); // [Function: bar]

foo = function () {
  return 1;
}; // 関数式の代入
```

**重要な違い：**

- **関数宣言**：`function foo() {}` → 完全に引き上げられる（関数本体を含む）
- **関数式**：`var foo = function() {}` → 変数名のみ引き上げられ、関数本体は引き上げられない

### let/const ではこの問題は発生しない

```js
// ❌ varには巻き上げ問題がある
console.log(foo); // undefined
var foo = '1';

// ✅ let/constにはTDZ（一時的デッドゾーン）がある
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = '1';

// ✅ let/constと関数が同名の場合エラーになる
function baz() {} // SyntaxError: Identifier 'baz' has already been declared
let baz = '1';
```

### Hoisting 優先順位のまとめ

```
Hoisting 優先順位（高い順）：

1. 関数宣言（Function Declaration）
   ├─ function foo() {} ✅ 完全に引き上げられる
   └─ 最も優先度が高い

2. 変数宣言（Variable Declaration）
   ├─ var foo ⚠️ 宣言のみ引き上げ、代入は引き上げられない
   └─ 既存の関数を上書きしない

3. 変数代入（Variable Assignment）
   ├─ foo = '1' ✅ 関数を上書きする
   └─ 実行フェーズで発生

4. 関数式（Function Expression）
   ├─ var foo = function() {} ⚠️ 変数代入として扱われる
   └─ 変数名のみ引き上げ、関数本体は引き上げられない
```

### 面接のポイント

この種の問題に回答する際は、以下を推奨します：

1. **Hoisting のメカニズムを説明する**：作成と実行の2段階に分かれる
2. **優先順位を強調する**：関数宣言 > 変数宣言
3. **引き上げ後のコードを描く**：面接官に理解を示す
4. **ベストプラクティスに言及する**：let/const を使用し、var の Hoisting 問題を回避する

**面接回答の例：**

> "この問題は Hoisting の優先順位を問うものです。JavaScript では、関数宣言の引き上げ優先順位は変数宣言より高くなっています。
>
> 実行プロセスは2段階に分かれます：
>
> 1. 作成フェーズ：`function foo() {}` が完全に最上部に引き上げられ、次に `var foo` の宣言が引き上げられますが、既存の関数は上書きされません。
> 2. 実行フェーズ：`console.log(foo)` の時点で foo は関数なので、`[Function: foo]` が出力されます。その後 `foo = '1'` で foo が文字列に上書きされます。
>
> ベストプラクティスは `let`/`const` で `var` を置き換え、関数宣言を最上部に配置して、このような混乱を避けることです。"

---

## 関連トピック

- [var, let, const の違い](/docs/let-var-const-differences)
