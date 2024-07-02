---
id: let-var-const-differences
title: 'What are the differences between variables created using let, var or const ?'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## 概述

JavaScript 中有三種宣告變數的關鍵字：`var`、`let` 和 `const`。雖然它們都用於宣告變數，但在作用域、初始化、重複宣告、重新賦值和訪問時機等方面有所不同。

## 主要差異

| 行為       | var              | let                 | const               |
| ---------- | ---------------- | ------------------- | ------------------- |
| 作用域     | 函式作用域或全域 | 區塊作用域          | 區塊作用域          |
| 初始化     | 可選             | 可選                | 必須                |
| 重複宣告   | 允許             | 不允許              | 不允許              |
| 重新賦值   | 允許             | 允許                | 不允許              |
| 宣告前訪問 | 返回 undefined   | 拋出 ReferenceError | 拋出 ReferenceError |

## 詳細說明

### 1. 作用域

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

### 2. 初始化

`var` 和 `let` 可以在宣告時不進行初始化，而 `const` 必須在宣告時初始化。

```javascript
var varVariable;  // 有效
let letVariable;  // 有效
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### 3. 重複宣告

在同一作用域內，`var` 允許重複宣告同一變數，而 `let` 和 `const` 不允許。

```javascript
var x = 1;
var x = 2; // 有效，x 現在等於 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### 4. 重新賦值

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

### 5. 宣告前訪問（暫時性死區）

`var` 宣告的變數會被提升並自動初始化為 `undefined`，而 `let` 和 `const` 宣告的變數雖然也會被提升，但不會被初始化，在宣告之前訪問會拋出 `ReferenceError`。

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## 最佳實踐

1. 優先使用 `const`：對於不需要重新賦值的變數，使用 `const` 可以提高代碼的可讀性和可維護性。
2. 其次使用 `let`：當需要重新賦值時，使用 `let`。
3. 避免使用 `var`：由於 `var` 的作用域和提升行為可能導致意外問題，建議在現代 JavaScript 開發中避免使用。
4. 注意瀏覽器兼容性：如果需要支援舊版瀏覽器，可以使用 Babel 等工具將 `let` 和 `const` 轉譯為 `var`。
