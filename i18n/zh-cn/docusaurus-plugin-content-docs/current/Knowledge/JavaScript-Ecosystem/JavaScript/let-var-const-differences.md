---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## 概述

JavaScript 中有三种声明变量的关键字：`var`、`let` 和 `const`。虽然它们都用于声明变量，但在作用域、初始化、重复声明、重新赋值和访问时机等方面有所不同。

## 主要差异

| 行为       | `var`            | `let`               | `const`             |
| ---------- | ---------------- | ------------------- | ------------------- |
| 作用域     | 函数作用域或全局 | 块级作用域          | 块级作用域          |
| 初始化     | 可选             | 可选                | 必须                |
| 重复声明   | 允许             | 不允许              | 不允许              |
| 重新赋值   | 允许             | 允许                | 不允许              |
| 声明前访问 | 返回 undefined   | 抛出 ReferenceError | 抛出 ReferenceError |

## 详细说明

### 作用域

`var` 的作用域是函数作用域或全局作用域，而 `let` 和 `const` 是块级作用域（包括函数、if-else 块或 for 循环）。

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

`var` 和 `let` 可以在声明时不进行初始化，而 `const` 必须在声明时初始化。

```javascript
var varVariable;  // 有效
let letVariable;  // 有效
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### 重复声明

在同一作用域内，`var` 允许重复声明同一变量，而 `let` 和 `const` 不允许。

```javascript
var x = 1;
var x = 2; // 有效，x 现在等于 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### 重新赋值

`var` 和 `let` 声明的变量可以重新赋值，而 `const` 声明的变量不能重新赋值。

```javascript
var x = 1;
x = 2; // 有效

let y = 1;
y = 2; // 有效

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

注意：虽然 `const` 声明的变量不能重新赋值，但如果它是一个对象或数组，其内容仍然可以修改。

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // 有效
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // 有效
console.log(arr); // [1, 2, 3, 4]
```

### 声明前访问（暂时性死区）

`var` 声明的变量会被提升并自动初始化为 `undefined`，而 `let` 和 `const` 声明的变量虽然也会被提升，但不会被初始化，在声明之前访问会抛出 `ReferenceError`。

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## 面试题目

### 题目：setTimeout + var 的经典陷阱

试判断以下代码的输出结果：

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### 错误答案（常见误解）

很多人会以为输出是：`1 2 3 4 5`

#### 实际输出

```
6
6
6
6
6
```

#### 为什么？

这个问题涉及三个核心概念：

**1. var 的函数作用域**

```javascript
// var 在循环中不会创建块级作用域
for (var i = 1; i <= 5; i++) {
  // i 是在外层作用域中，所有迭代共享同一个 i
}
console.log(i); // 6（循环结束后 i 的值）

// var 的情况
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // 循环结束
}
```

**2. setTimeout 的异步执行**

```javascript
// setTimeout 是异步的，会在当前同步代码执行完后才执行
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // 这里的代码会被放到 Event Loop 的任务队列中
    console.log(i);
  }, 0);
}
// 循环先执行完（i 变成 6），setTimeout 的回调才开始执行
```

**3. 闭包引用**

```javascript
// 所有的 setTimeout 回调函数都引用同一个 i
// 当回调执行时，i 已经变成 6 了
```

#### 解决方案

**方案 1：使用 let（推荐）★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// 输出：1 2 3 4 5

// let 的情况
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

**原理**：`let` 在每次迭代时都会创建一个新的块级作用域，每个 `setTimeout` 回调都会捕获当前迭代的 `i` 值。

```javascript
// 等价于
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
// ... 依此类推
```

**方案 2：使用 IIFE（立即执行函数）**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// 输出：1 2 3 4 5
```

**原理**：IIFE 创建了一个新的函数作用域，每次迭代都会传入当前的 `i` 值作为参数 `j`，形成闭包。

**方案 3：使用 setTimeout 的第三个参数**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // 第三个参数会被传给回调函数
}
// 输出：1 2 3 4 5
```

**原理**：`setTimeout` 的第三个参数及之后的参数会作为回调函数的参数传入。

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
// 输出：1 2 3 4 5
```

**原理**：`bind` 会创建一个新函数，并将当前的 `i` 值绑定为参数。

#### 方案对比

| 方案            | 优点             | 缺点       | 推荐度       |
| --------------- | ---------------- | ---------- | ------------ |
| `let`           | 简洁、现代、易懂 | ES6+       | 5/5 强烈推荐 |
| IIFE            | 兼容性好         | 语法较复杂 | 3/5 可考虑   |
| setTimeout 参数 | 简单直接         | 较少人知道 | 4/5 推荐     |
| `bind`          | 函数式风格       | 可读性稍差 | 3/5 可考虑   |

#### 延伸问题

**Q1: 如果改成这样呢？**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**答案**：每秒输出一次 `6`，总共输出 5 次（分别在 1 秒、2 秒、3 秒、4 秒、5 秒时输出）。

**Q2: 如果想要每秒依序输出 1、2、3、4、5 呢？**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// 1 秒后输出 1
// 2 秒后输出 2
// 3 秒后输出 3
// 4 秒后输出 4
// 5 秒后输出 5
```

#### 面试重点

这道题考察：

1. **var 的作用域**：函数作用域 vs 块级作用域
2. **Event Loop**：同步 vs 异步执行
3. **闭包**：函数如何捕获外部变量
4. **解决方案**：多种解法及优缺点对比

回答时建议：

- 先说出正确答案（6 6 6 6 6）
- 解释原因（var 作用域 + setTimeout 异步）
- 提供解决方案（首选 let，并说明其他方案）
- 展示对 JavaScript 底层机制的理解

## 最佳实践

1. 优先使用 `const`：对于不需要重新赋值的变量，使用 `const` 可以提高代码的可读性和可维护性。
2. 其次使用 `let`：当需要重新赋值时，使用 `let`。
3. 避免使用 `var`：由于 `var` 的作用域和提升行为可能导致意外问题，建议在现代 JavaScript 开发中避免使用。
4. 注意浏览器兼容性：如果需要支持旧版浏览器，可以使用 Babel 等工具将 `let` 和 `const` 转译为 `var`。

## 相关主题

- [闭包 (Closure)](/docs/closure)
- [Event Loop](/docs/event-loop)
- [变量提升 (Hoisting)](/docs/hoisting)
