---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## So sánh sự khác biệt

- **`undefined`**：
  - Cho biết biến đã được khai báo nhưng chưa được gán giá trị.
  - Là giá trị mặc định của các biến chưa được khởi tạo.
  - Nếu hàm không có giá trị trả về tường minh, mặc định sẽ trả về `undefined`.
- **`null`**：
  - Biểu thị một giá trị rỗng hoặc không có giá trị.
  - Thường phải gán tường minh là `null`.
  - Được sử dụng để chỉ ra rằng biến có chủ đích không trỏ đến bất kỳ đối tượng hay giá trị nào.

## Ví dụ

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

## Kiểm tra bằng typeof

```js
console.log(typeof undefined); // 輸出："undefined"
console.log(typeof null); // 輸出："object"

console.log(null == undefined); // 輸出：true
console.log(null === undefined); // 輸出：false
```
