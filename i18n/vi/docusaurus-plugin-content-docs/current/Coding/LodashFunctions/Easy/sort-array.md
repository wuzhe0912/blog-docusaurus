---
id: sort-array
title: 📄 Sort Array
slug: /sort-array
---

## Question Description

Cho một mảng gồm nhiều số, hãy sử dụng hàm `sort` để sắp xếp mảng. Cung cấp giải pháp cho hai trường hợp sau:

1. Sắp xếp từ nhỏ đến lớn (tăng dần)
2. Sắp xếp từ lớn đến nhỏ (giảm dần)

### Sắp xếp tăng dần

```js
const numbers = [10, 5, 50, 2, 200];

// Sử dụng hàm so sánh
numbers.sort(function (a, b) {
  return a - b;
});

console.log(numbers); // [2, 5, 10, 50, 200]
```

### Sắp xếp giảm dần

```js
const numbers = [10, 5, 50, 2, 200];

numbers.sort(function (a, b) {
  return b - a;
});

console.log(numbers); // [200, 50, 10, 5, 2]
```

### Cố tình chèn string

```js
const mixedNumbers = [10, '5', 50, '2', 200];

mixedNumbers.sort(function (a, b) {
  return Number(a) - Number(b);
});

console.log(mixedNumbers); // ['2', '5', 10, 50, 200]
```

Tuy nhiên, giải pháp này không thể loại trừ các chuỗi không thể chuyển đổi thành số, ví dụ như `'iphone'`, `'ipad'`, v.v. Các chuỗi này sẽ được chuyển thành `NaN`, mặc dù có thể nằm ở cuối kết quả sắp xếp, nhưng cũng có thể cho ra kết quả khác nhau tùy thuộc vào trình duyệt. Trong trường hợp này, nên cân nhắc sử dụng `filter` để loại trừ trước rồi tái tổ chức mảng.

### Sắp xếp Object

```js
const mockArray = [
  { type: 'a', label: 1 },
  { type: 'a', label: 2 },
  { type: 'c', label: 1 },
  { type: 'c', label: 3 },
  { type: 'b', label: 2 },
];
```
