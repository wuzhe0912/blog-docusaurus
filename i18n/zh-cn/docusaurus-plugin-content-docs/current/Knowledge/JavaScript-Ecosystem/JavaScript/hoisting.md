---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. What's Hoisting ?

JS 的运行可以拆解为两个阶段，分别是创建与执行：

```js
var name = 'Pitt';
console.log(name); // print Pitt
```

在 Hoisting 特性下，上面这段代码实际运作上，需要理解为先声明变量再执行赋值。

```js
// create
var name;

// execute
name = 'Pitt';
console.log(name);
```

而 function 又和变量不同，在创建阶段就会指给内存，声明式如下：

```js
getName();

function getName() {
  console.log('string'); // print string
}
```

上面这段之所以能正常运行并打印出 console.log，而不会报错，在于以下逻辑，function 先被提升到最上方，接着才做调用 function 的动作。

```js
// create
function getName() {
  console.log('string');
}

// execute
getName();
```

但需要注意的是，这种 Hoisting 特性，在表达式时需要注意书写顺序。

在创建阶段时，function 是最优先的，其次才是变量。

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
console.log(name); // print undefined，因为还未拿到赋值，只拿到默认的 undefined
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

name 在 `whoseName()` 中，虽然因为拿到 undefined，不会往下走判断。

但因为声明式的下方，又有一个赋值，所以即使在 function 有进入判断条件，最终仍会打印出 Pitt。

---

## 3. 函数声明 vs 变量声明：提升优先级

### 题目：同名的函数和变量

试判断以下代码的输出结果：

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### 错误答案（常见误解）

很多人会以为：

- 输出 `undefined`（认为 var 先提升）
- 输出 `'1'`（认为赋值会影响）
- 报错（认为同名冲突）

### 实际输出

```js
[Function: foo]
```

### 为什么？

这题考察 Hoisting 的**优先级规则**：

**提升优先级：函数声明 > 变量声明**

```js
// 原始程式码
console.log(foo);
var foo = '1';
function foo() {}

// 等价于（经过 Hoisting）
// 阶段 1：创造阶段（Hoisting）
function foo() {} // 1. 函数声明先提升
var foo; // 2. 变量声明提升（但不覆盖已存在的函数）

// 阶段 2：执行阶段
console.log(foo); // 此时 foo 是函数，输出 [Function: foo]
foo = '1'; // 3. 变量赋值（会覆盖函数）
```

### 关键概念

**1. 函数声明会完整提升**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. var 变量声明只提升声明，不提升赋值**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. 当函数声明和变量声明同名时**

```js
// 提升后的顺序
function foo() {} // 函数先提升并赋值
var foo; // 变量声明提升，但不会覆盖已存在的函数

// 因此 foo 是函数
console.log(foo); // [Function: foo]
```

### 完整执行流程

```js
// 原始程式码
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== 等价于 ========

// 创造阶段（Hoisting）
function foo() {} // 1️⃣ 函数声明提升（完整提升，包含函数体）
var foo; // 2️⃣ 变量声明提升（但不覆盖 foo，因为已经是函数了）

// 执行阶段
console.log(foo); // [Function: foo] - foo 是函数
foo = '1'; // 3️⃣ 变量赋值（此时才覆盖函数）
console.log(foo); // '1' - foo 变成字串
```

### 延伸题目

#### 题目 A：顺序影响

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**答案：**

```js
[Function: foo] // 第一次输出
'1' // 第二次输出
```

**原因：** 代码顺序不影响 Hoisting 的结果，提升优先级依然是函数 > 变量。

#### 题目 B：多个同名函数

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

**答案：**

```js
[Function: foo] { return 2; } // 第一次输出（后面的函数覆盖前面的）
'1' // 第二次输出（变量赋值覆盖函数）
```

**原因：**

```js
// 提升后
function foo() {
  return 1;
} // 第一个函数

function foo() {
  return 2;
} // 第二个函数覆盖第一个

var foo; // 变量声明（不覆盖函数）

console.log(foo); // [Function: foo] { return 2; }
foo = '1'; // 变量赋值（覆盖函数）
console.log(foo); // '1'
```

#### 题目 C：函数表达式 vs 函数声明

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

**答案：**

```js
undefined; // foo 是 undefined
[Function: bar] // bar 是函数
```

**原因：**

```js
// 提升后
var foo; // 变量声明提升（函数表达式只提升变量名）
function bar() {
  return 2;
} // 函数声明完整提升

console.log(foo); // undefined
console.log(bar); // [Function: bar]

foo = function () {
  return 1;
}; // 函数表达式赋值
```

**关键差异：**

- **函数声明**：`function foo() {}` → 完整提升（包含函数体）
- **函数表达式**：`var foo = function() {}` → 只提升变量名，函数体不提升

### let/const 不会有这个问题

```js
// ❌ var 会有提升问题
console.log(foo); // undefined
var foo = '1';

// ✅ let/const 有暂时性死区（TDZ）
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = '1';

// ✅ let/const 与函数同名会报错
function baz() {} // SyntaxError: Identifier 'baz' has already been declared
let baz = '1';
```

### 提升优先级总结

```
Hoisting 优先级（从高到低）：

1. 函数声明（Function Declaration）
   ├─ function foo() {} ✅ 完整提升
   └─ 优先级最高

2. 变量声明（Variable Declaration）
   ├─ var foo ⚠️ 只提升声明，不提升赋值
   └─ 不会覆盖已存在的函数

3. 变量赋值（Variable Assignment）
   ├─ foo = '1' ✅ 会覆盖函数
   └─ 执行阶段才发生

4. 函数表达式（Function Expression）
   ├─ var foo = function() {} ⚠️ 视为变量赋值
   └─ 只提升变量名，不提升函数体
```

### 面试重点

回答这类问题时，建议：

1. **说明 Hoisting 机制**：分为创建和执行两阶段
2. **强调优先级**：函数声明 > 变量声明
3. **画出提升后的代码**：让面试官看到你的理解
4. **提到最佳实践**：使用 let/const，避免 var 的提升问题

**面试回答范例：**

> "这道题考察 Hoisting 的优先级。在 JavaScript 中，函数声明的提升优先级高于变量声明。
>
> 执行过程分为两阶段：
>
> 1. 创建阶段：`function foo() {}` 完整提升到最上方，接着 `var foo` 声明提升但不覆盖已存在的函数。
> 2. 执行阶段：`console.log(foo)` 此时 foo 是函数，所以输出 `[Function: foo]`，之后 `foo = '1'` 才将 foo 覆盖为字符串。
>
> 最佳实践是使用 `let`/`const` 取代 `var`，并将函数声明放在最上方，避免这类混淆。"

---

## 相关主题

- [var, let, const 差异](/docs/let-var-const-differences)
