---
id: variable-scope
title: '📄 Variable Scope (變數作用域)'
slug: /variable-scope
---

## 1. What’s the difference between `var`, `let`, `const` ?

雖然三種都是宣告變數的方式，但是在作用域上有所不同，`var` 帶有全域性(除了 function 可以限縮外，if 條件或是迴圈則無法)，而 `let` 和 `const` 則是區塊作用域（function, if-else block, 或 for-loop）這三者都會限縮。例如：

```js
function foo() {
  var bar = 'bar';
  let baz = 'baz';
  const qux = 'qux';

  console.log(bar); // bar
  console.log(baz); // baz
  console.log(qux); // qux
}

console.log(bar); // ReferenceError: bar is not defined
console.log(baz); // ReferenceError: baz is not defined
console.log(qux); // ReferenceError: qux is not defined
```

```js
if (true) {
  var bar = 'bar';
  let baz = 'baz';
  const qux = 'qux';
}

// 用 var 宣告的變數可以在整個函式作用域的任何地方訪問。
console.log(bar); // bar
// 用 let 和 const 定義的變數無法在它們被定義的區塊外訪問。
console.log(baz); // ReferenceError: baz is not defined
console.log(qux); // ReferenceError: qux is not defined
```

使用 `var` 重複宣告同一個變數，不會報錯，但是 `let` 和 `const` 則會報錯。

```js
var foo = 'foo';
var foo = 'bar';
console.log(foo); // "bar"

let baz = 'baz';
let baz = 'qux'; // Uncaught SyntaxError: Identifier 'baz' has already been declared
```

在變量提升上，`var` 和 `let` 都會被提升，但是 `const` 則不會。

```js
console.log(foo); // undefined

var foo = 'foo';

console.log(baz); // ReferenceError: can't access lexical declaration 'baz' before initialization

let baz = 'baz';

console.log(bar); // ReferenceError: can't access lexical declaration 'bar' before initialization

const bar = 'bar';
```

`let` 允許重新賦值，而 `const` 則不行(常數)。

```js
// fine
let foo = 'foo';
foo = 'bar';

// error
const baz = 'baz';
baz = 'qux';
```

雖然使用 const 宣告的常數，無法被重新賦值。但在`object` 和 `array` 中，仍可以額外塞入資料。

```js
const a = { player: 'Pitt' };
a.newPlayer = 'Mini';
console.log(a); // { player: "Pitt", newPlayer: "Mini" }
```

```js
const b = [1, 2, 3];
b.push(4);
console.log(b); // [1, 2, 3, 4]
```

由上述可知，`var` 的宣告方式，因為歷史原因，存在較大的缺陷，考慮到現代瀏覽器幾乎多以支持 `let` 和 `const`，因此現在一般開發多已捨棄 `var`。
