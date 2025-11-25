---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> 什麼是 Closure ?

要理解閉包，需要先明白 JavaScript 的變數作用域，以及 function 是如何訪問外部變數的。

### Variable Scope(變數作用域)

在 JavaScript 中，變數的作用域分為兩種，分別是 global scope & function scope。

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
console.log(b, c); // 產生錯誤，無法存取 function scope 內的變數
```

### Closure example

Closure 的觸發條件是，有一個子函式定義在父函式內，且透過 return 的方式回傳，達到保存子函式內的環境變數(等於迴避了 `Garbage Collection(垃圾回收機制)`)。

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`目前計數：${count}`);
  };
}

const counter = parentFunction();

counter(); // print 目前計數：1
counter(); // print 目前計數：2
// count 變數不會被回收，因為 childFunction 仍然存在，並且每次呼叫都會更新 count 的值
```

但要注意，因為閉包會將變數保存在記憶體中，所以如果變數過多，會導致記憶體占用過大(不能濫用閉包)，進而影響效能。

## 2. Create a function that meets the following conditions

> 建立符合下述條件的 function(使用閉包觀念來處理)

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

將兩個 function 進行分拆後處理

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

當然第一種解法有不小的機率被 reject，所以需要嘗試合併在同一個 function。

```js
function plus(value, subValue) {
  // 利用每次傳入參數的多寡來判斷
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

> 請利用閉包的特性，將數字遞增

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

這邊不使用 Arrow Function，改用一般 function 的形式。

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

前一個解法中，也可以直接將 object 包裹在 return 中

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

> 這段巢狀函式呼叫會印出什麼？

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

**執行結果**：

```
hello
TypeError: aa is not a function
```

### 詳細執行流程

```js
// 執行 a(b(c))
// JavaScript 從內到外執行函式

// 步驟 1：執行最內層 b(c)
b(c)
  ↓
// c 函式被當作參數傳入 b
// b 函式內部執行 bb()，也就是 c()
c() // 印出 'hello'
  ↓
// b 函式沒有 return 語句
// 所以返回 undefined
return undefined

// 步驟 2：執行 a(undefined)
a(undefined)
  ↓
// undefined 被當作參數傳入 a
// a 函式內部嘗試執行 aa()
// 也就是 undefined()
undefined() // ❌ 報錯：TypeError: aa is not a function
```

### 為什麼會這樣？

#### 1. 函式執行順序（從內到外）

```js
// 範例
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. 先執行 multiply(2, 3) → 6
           └────── 3. 再執行 add(6)

// 相同概念
a(b(c))
  ↑ ↑
  | └─ 1. 先執行 b(c)
  └─── 2. 再執行 a(b(c) 的結果)
```

#### 2. 函式沒有 return 時返回 undefined

```js
function b(bb) {
  bb(); // 執行了，但沒有 return
} // 隱含 return undefined

// 等同於
function b(bb) {
  bb();
  return undefined; // JavaScript 自動加上
}
```

#### 3. 嘗試呼叫非函式會報錯

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// 其他會報錯的情況
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### 如何修正？

#### 方法 1：讓 b 函式回傳一個函式

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
// 輸出：
// hello
// b executed
```

#### 方法 2：直接傳入函式，不要先執行

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

a(b(c)); // 只印出 'hello'

// 或者這樣寫
a(() => b(c)); // 印出 'hello'
```

#### 方法 3：改變執行邏輯

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

// 分開執行
b(c); // 印出 'hello'
a(() => console.log('a executed')); // 印出 'a executed'
```

### 相關考題

#### 題目 1：如果改成這樣呢？

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
<summary>點擊查看答案</summary>

```
hello
world
```

**解析**：

1. `b(c)` → 執行 `c()`，印出 `'hello'`，回傳 `'world'`
2. `a('world')` → 執行 `'world'()`... 等等，這還是會報錯！

**正確答案**：

```
hello
TypeError: aa is not a function
```

因為 `b(c)` 回傳 `'world'`（字串），`a('world')` 嘗試執行 `'world'()`，字串不是函式，所以報錯。

</details>

#### 題目 2：如果全部都有 return 呢？

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
<summary>點擊查看答案</summary>

```
[Function: c]
hello
```

**解析**：

1. `b(c)` → 回傳 `c` 函式本身（沒有執行）
2. `a(c)` → 回傳 `c` 函式本身
3. `result` 是 `c` 函式
4. `result()` → 執行 `c()`，回傳 `'hello'`

</details>

### 記憶重點

```javascript
// 函式呼叫優先級
a(b(c))
  ↓
// 1. 先執行最內層
b(c) // 如果 b 沒有 return，就是 undefined
  ↓
// 2. 再執行外層
a(undefined) // 嘗試執行 undefined() 會報錯

// 解決方法
// ✅ 1. 確保中間函式有回傳函式
// ✅ 2. 或使用箭頭函式包裝
a(() => b(c))
```

## Reference

- [Closures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [Day6 [JavaScript 基礎] 垃圾回收機制](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - JavaScript 記憶體管理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [MDN - Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Functions)
- [MDN - TypeError](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
