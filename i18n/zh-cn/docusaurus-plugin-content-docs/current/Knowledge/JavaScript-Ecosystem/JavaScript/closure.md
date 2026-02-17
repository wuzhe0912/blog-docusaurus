---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> 什么是 Closure ?

要理解闭包，需要先明白 JavaScript 的变量作用域，以及 function 是如何访问外部变量的。

### Variable Scope（变量作用域）

在 JavaScript 中，变量的作用域分为两种，分别是 global scope 和 function scope。

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
console.log(b, c); // 产生错误，无法访问 function scope 内的变量
```

### Closure example

Closure 的触发条件是，有一个子函数定义在父函数内，且通过 return 的方式返回，达到保存子函数内的环境变量（等于规避了 `Garbage Collection（垃圾回收机制）`）。

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`目前计数：${count}`);
  };
}

const counter = parentFunction();

counter(); // print 目前计数：1
counter(); // print 目前计数：2
// count 变量不会被回收，因为 childFunction 仍然存在，并且每次调用都会更新 count 的值
```

但要注意，因为闭包会将变量保存在内存中，所以如果变量过多，会导致内存占用过大（不能滥用闭包），进而影响性能。

## 2. Create a function that meets the following conditions

> 创建符合下述条件的 function（使用闭包概念来处理）

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

将两个 function 进行拆分后处理

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

当然第一种解法有不小的概率被 reject，所以需要尝试合并在同一个 function。

```js
function plus(value, subValue) {
  // 利用每次传入参数的多少来判断
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

> 请利用闭包的特性，将数字递增

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

这里不使用 Arrow Function，改用一般 function 的形式。

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

前一个解法中，也可以直接将 object 包裹在 return 中

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

> 这段嵌套函数调用会打印出什么？

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

**执行结果**：

```
hello
TypeError: aa is not a function
```

### 详细执行流程

```js
// 执行 a(b(c))
// JavaScript 从内到外执行函数

// 步骤 1：执行最内层 b(c)
b(c)
  ↓
// c 函数被当作参数传入 b
// b 函数内部执行 bb()，也就是 c()
c() // 打印 'hello'
  ↓
// b 函数没有 return 语句
// 所以返回 undefined
return undefined

// 步骤 2：执行 a(undefined)
a(undefined)
  ↓
// undefined 被当作参数传入 a
// a 函数内部尝试执行 aa()
// 也就是 undefined()
undefined() // ❌ 报错：TypeError: aa is not a function
```

### 为什么会这样？

#### 1. 函数执行顺序（从内到外）

```js
// 范例
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. 先执行 multiply(2, 3) → 6
           └────── 3. 再执行 add(6)

// 相同概念
a(b(c))
  ↑ ↑
  | └─ 1. 先执行 b(c)
  └─── 2. 再执行 a(b(c) 的结果)
```

#### 2. 函数没有 return 时返回 undefined

```js
function b(bb) {
  bb(); // 执行了，但没有 return
} // 隐含 return undefined

// 等同于
function b(bb) {
  bb();
  return undefined; // JavaScript 自动加上
}
```

#### 3. 尝试调用非函数会报错

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// 其他会报错的情况
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### 如何修正？

#### 方法 1：让 b 函数返回一个函数

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
// 输出：
// hello
// b executed
```

#### 方法 2：直接传入函数，不要先执行

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

a(b(c)); // 只打印 'hello'

// 或者这样写
a(() => b(c)); // 打印 'hello'
```

#### 方法 3：改变执行逻辑

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

// 分开执行
b(c); // 打印 'hello'
a(() => console.log('a executed')); // 打印 'a executed'
```

### 相关考题

#### 题目 1：如果改成这样呢？

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
<summary>点击查看答案</summary>

```
hello
TypeError: aa is not a function
```

**解析**：

1. `b(c)` → 执行 `c()`，打印 `'hello'`，返回 `'world'`
2. `a('world')` → 执行 `'world'()`... 等等，这还是会报错！

**正确答案**：

```
hello
TypeError: aa is not a function
```

因为 `b(c)` 返回 `'world'`（字符串），`a('world')` 尝试执行 `'world'()`，字符串不是函数，所以报错。

</details>

#### 题目 2：如果全部都有 return 呢？

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
<summary>点击查看答案</summary>

```
[Function: c]
hello
```

**解析**：

1. `b(c)` → 返回 `c` 函数本身（没有执行）
2. `a(c)` → 返回 `c` 函数本身
3. `result` 是 `c` 函数
4. `result()` → 执行 `c()`，返回 `'hello'`

</details>

### 记忆重点

```javascript
// 函数调用优先级
a(b(c))
  ↓
// 1. 先执行最内层
b(c) // 如果 b 没有 return，就是 undefined
  ↓
// 2. 再执行外层
a(undefined) // 尝试执行 undefined() 会报错

// 解决方法
// ✅ 1. 确保中间函数有返回函数
// ✅ 2. 或使用箭头函数包装
a(() => b(c))
```

## Reference

- [Closures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [Day6 [JavaScript 基础] 垃圾回收机制](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - JavaScript 内存管理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [MDN - Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Functions)
- [MDN - TypeError](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
