---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## 両者の違いを比較

- **`undefined`**：
  - 変数が宣言されたが、まだ値が代入されていないことを示します。
  - 初期化されていない変数のデフォルト値です。
  - 関数が明示的に値を返さない場合、デフォルトで `undefined` を返します。
- **`null`**：
  - 空の値、または値がないことを示します。
  - 通常、明示的に `null` を代入する必要があります。
  - 変数が意図的にオブジェクトや値を参照しないことを示すために使用されます。

## 例

```js
let x;
console.log(x); // 出力：undefined

function foo() {}
console.log(foo()); // 出力：undefined

let y = null;
console.log(y); // 出力：null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // 出力：null
```

## typeof による検証

```js
console.log(typeof undefined); // 出力："undefined"
console.log(typeof null); // 出力："object"

console.log(null == undefined); // 出力：true
console.log(null === undefined); // 出力：false
```
