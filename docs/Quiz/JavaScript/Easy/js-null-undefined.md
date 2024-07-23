---
id: js-null-undefined
title: 📄 請解釋 null 和 undefined 的差異
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## 比對兩者差異

- **`undefined`**：
  - 表示變量已聲明但尚未賦值。
  - 是未初始化變量的默認值。
  - 函式如果沒有顯示返回值，則默認返回 `undefined`。
- **`null`**：
  - 表示一個空值或沒有值。
  - 通常必須明確賦值為 `null`。
  - 用於表示一個變量有意地不指向任何物件或值。

## 範例

```js
let x;
console.log(x); // 輸出：undefined

function foo() {}
console.log(foo()); // 輸出：undefined

let y = null;
console.log(y); // 輸出：null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // 輸出：null
```

## 使用 typeof 驗證

```js
console.log(typeof undefined); // 輸出："undefined"
console.log(typeof null); // 輸出："object"

console.log(null == undefined); // 輸出：true
console.log(null === undefined); // 輸出：false
```
