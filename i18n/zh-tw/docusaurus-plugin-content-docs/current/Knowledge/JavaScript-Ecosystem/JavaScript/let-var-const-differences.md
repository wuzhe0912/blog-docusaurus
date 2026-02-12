---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## 概述

JavaScript 中有三種宣告變數的關鍵字：`var`、`let` 和 `const`。雖然它們都用於宣告變數，但在作用域、初始化、重複宣告、重新賦值和訪問時機等方面有所不同。

## 主要差異

| 行為       | `var`            | `let`               | `const`             |
| ---------- | ---------------- | ------------------- | ------------------- |
| 作用域     | 函式作用域或全域 | 區塊作用域          | 區塊作用域          |
| 初始化     | 可選             | 可選                | 必須                |
| 重複宣告   | 允許             | 不允許              | 不允許              |
| 重新賦值   | 允許             | 允許                | 不允許              |
| 宣告前訪問 | 返回 undefined   | 拋出 ReferenceError | 拋出 ReferenceError |

## 詳細說明

### 作用域

`var` 的作用域是函式作用域或全域作用域，而 `let` 和 `const` 是區塊作用域（包括函式、if-else 區塊或 for 迴圈）。

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var in block';
  let letInBlock = 'let in block';
  const constInBlock = 'const in block';
}

console.log(varInBlock); // 'var in block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### 初始化

`var` 和 `let` 可以在宣告時不進行初始化，而 `const` 必須在宣告時初始化。

```javascript
var varVariable;  // 有效
let letVariable;  // 有效
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### 重複宣告

在同一作用域內，`var` 允許重複宣告同一變數，而 `let` 和 `const` 不允許。

```javascript
var x = 1;
var x = 2; // 有效，x 現在等於 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### 重新賦值

`var` 和 `let` 宣告的變數可以重新賦值，而 `const` 宣告的變數不能重新賦值。

```javascript
var x = 1;
x = 2; // 有效

let y = 1;
y = 2; // 有效

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

注意：雖然 `const` 宣告的變數不能重新賦值，但如果它是一個物件或陣列，其內容仍然可以修改。

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // 有效
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // 有效
console.log(arr); // [1, 2, 3, 4]
```

### 宣告前訪問（暫時性死區）

`var` 宣告的變數會被提升並自動初始化為 `undefined`，而 `let` 和 `const` 宣告的變數雖然也會被提升，但不會被初始化，在宣告之前訪問會拋出 `ReferenceError`。

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## 面試題目

### 題目：setTimeout + var 的經典陷阱

試判斷以下程式碼的輸出結果：

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### 錯誤答案（常見誤解）

很多人會以為輸出是：`1 2 3 4 5`

#### 實際輸出

```
6
6
6
6
6
```

#### 為什麼？

這個問題涉及三個核心概念：

**1. var 的函數作用域**

```javascript
// var 在迴圈中不會創建塊級作用域
for (var i = 1; i <= 5; i++) {
  // i 是在外層作用域中，所有迭代共享同一個 i
}
console.log(i); // 6（迴圈結束後 i 的值）

// var 的情況
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // 迴圈結束
}
```

**2. setTimeout 的異步執行**

```javascript
// setTimeout 是異步的，會在當前同步程式碼執行完後才執行
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // 這裡的程式碼會被放到 Event Loop 的任務佇列中
    console.log(i);
  }, 0);
}
// 迴圈先執行完（i 變成 6），setTimeout 的回調才開始執行
```

**3. 閉包引用**

```javascript
// 所有的 setTimeout 回調函數都引用同一個 i
// 當回調執行時，i 已經變成 6 了
```

#### 解決方案

**方案 1：使用 let（推薦）★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// 輸出：1 2 3 4 5

// let 的情況
{
  let i = 1; // 第一次迭代的 i
}
{
  let i = 2; // 第二次迭代的 i
}
{
  let i = 3; // 第三次迭代的 i
}
```

**原理**：`let` 在每次迭代時都會創建一個新的塊級作用域，每個 `setTimeout` 回調都會捕獲當前迭代的 `i` 值。

```javascript
// 等價於
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ... 依此類推
```

**方案 2：使用 IIFE（立即執行函數）**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// 輸出：1 2 3 4 5
```

**原理**：IIFE 創建了一個新的函數作用域，每次迭代都會傳入當前的 `i` 值作為參數 `j`，形成閉包。

**方案 3：使用 setTimeout 的第三個參數**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // 第三個參數會被傳給回調函數
}
// 輸出：1 2 3 4 5
```

**原理**：`setTimeout` 的第三個參數及之後的參數會作為回調函數的參數傳入。

**方案 4：使用 bind**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// 輸出：1 2 3 4 5
```

**原理**：`bind` 會創建一個新函數，並將當前的 `i` 值綁定為參數。

#### 方案對比

| 方案            | 優點             | 缺點       | 推薦度       |
| --------------- | ---------------- | ---------- | ------------ |
| `let`           | 簡潔、現代、易懂 | ES6+       | 5/5 強烈推薦 |
| IIFE            | 相容性好         | 語法較複雜 | 3/5 可考慮   |
| setTimeout 參數 | 簡單直接         | 較少人知道 | 4/5 推薦     |
| `bind`          | 函數式風格       | 可讀性稍差 | 3/5 可考慮   |

#### 延伸問題

**Q1: 如果改成這樣呢？**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**答案**：每秒輸出一次 `6`，總共輸出 5 次（分別在 1 秒、2 秒、3 秒、4 秒、5 秒時輸出）。

**Q2: 如果想要每秒依序輸出 1、2、3、4、5 呢？**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// 1 秒後輸出 1
// 2 秒後輸出 2
// 3 秒後輸出 3
// 4 秒後輸出 4
// 5 秒後輸出 5
```

#### 面試重點

這道題考察：

1. ✅ **var 的作用域**：函數作用域 vs 塊級作用域
2. ✅ **Event Loop**：同步 vs 異步執行
3. ✅ **閉包**：函數如何捕獲外部變數
4. ✅ **解決方案**：多種解法及優缺點對比

回答時建議：

- 先說出正確答案（6 6 6 6 6）
- 解釋原因（var 作用域 + setTimeout 異步）
- 提供解決方案（首選 let，並說明其他方案）
- 展示對 JavaScript 底層機制的理解

## 最佳實踐

1. 優先使用 `const`：對於不需要重新賦值的變數，使用 `const` 可以提高代碼的可讀性和可維護性。
2. 其次使用 `let`：當需要重新賦值時，使用 `let`。
3. 避免使用 `var`：由於 `var` 的作用域和提升行為可能導致意外問題，建議在現代 JavaScript 開發中避免使用。
4. 注意瀏覽器兼容性：如果需要支援舊版瀏覽器，可以使用 Babel 等工具將 `let` 和 `const` 轉譯為 `var`。

## 相關主題

- [閉包 (Closure)](/docs/closure)
- [Event Loop](/docs/event-loop)
- [變數提升 (Hoisting)](/docs/hoisting)
