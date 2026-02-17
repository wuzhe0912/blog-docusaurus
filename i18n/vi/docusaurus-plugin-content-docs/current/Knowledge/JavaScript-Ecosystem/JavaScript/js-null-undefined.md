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
console.log(x); // Đầu ra: undefined

function foo() {}
console.log(foo()); // Đầu ra: undefined

let y = null;
console.log(y); // Đầu ra: null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // Đầu ra: null
```

## Kiểm tra bằng typeof

```js
console.log(typeof undefined); // Đầu ra: "undefined"
console.log(typeof null); // Đầu ra: "object"

console.log(null == undefined); // Đầu ra: true
console.log(null === undefined); // Đầu ra: false
```
