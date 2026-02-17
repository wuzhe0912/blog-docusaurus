---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## So sanh su khac biet

- **`undefined`**：
  - Cho biet bien da duoc khai bao nhung chua duoc gan gia tri.
  - La gia tri mac dinh cua cac bien chua duoc khoi tao.
  - Neu ham khong co gia tri tra ve tuong minh, mac dinh se tra ve `undefined`.
- **`null`**：
  - Bieu thi mot gia tri rong hoac khong co gia tri.
  - Thuong phai gan tuong minh la `null`.
  - Duoc su dung de chi ra rang bien co chu dich khong tro den bat ky doi tuong hay gia tri nao.

## Vi du

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

## Kiem tra bang typeof

```js
console.log(typeof undefined); // 輸出："undefined"
console.log(typeof null); // 輸出："object"

console.log(null == undefined); // 輸出：true
console.log(null === undefined); // 輸出：false
```
