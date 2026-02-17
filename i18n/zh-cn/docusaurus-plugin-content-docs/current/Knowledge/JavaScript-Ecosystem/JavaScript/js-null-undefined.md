---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## 比对两者差异

- **`undefined`**：
  - 表示变量已声明但尚未赋值。
  - 是未初始化变量的默认值。
  - 函数如果没有显式返回值，则默认返回 `undefined`。
- **`null`**：
  - 表示一个空值或没有值。
  - 通常必须明确赋值为 `null`。
  - 用于表示一个变量有意地不指向任何对象或值。

## 范例

```js
let x;
console.log(x); // 输出：undefined

function foo() {}
console.log(foo()); // 输出：undefined

let y = null;
console.log(y); // 输出：null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // 输出：null
```

## 使用 typeof 验证

```js
console.log(typeof undefined); // 输出："undefined"
console.log(typeof null); // 输出："object"

console.log(null == undefined); // 输出：true
console.log(null === undefined); // 输出：false
```
