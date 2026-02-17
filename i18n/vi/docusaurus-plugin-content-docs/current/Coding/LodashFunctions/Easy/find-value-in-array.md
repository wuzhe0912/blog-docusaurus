---
id: find-value-in-array
title: 📄 Find Value in Array
slug: /find-value-in-array
---

## 1. Tìm giá trị duy nhất trong mảng

### I. Sử dụng `Set(ES6)`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findUniqueValue = (arr) => {
  const uniqueValues = new Set(arr);
  return [...uniqueValues];
};

console.log(findUniqueValue(array)); // [6, 4, 3, 2, 1]
```

### II. Sử dụng `filter`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findUniqueValue = (arr) => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};

console.log(findUniqueValue(array)); // [6, 4, 3, 2, 1]
```

## 2. Tìm giá trị chỉ xuất hiện một lần trong mảng

### I. So sánh `indexOf` và `lastIndexOf`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findSingleValue = (arr) => {
  return arr.filter((value) => arr.indexOf(value) === arr.lastIndexOf(value));
};

console.log(findSingleValue(array)); // [1]
```

### II. Sử dụng `reduce`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2, 8, 9];

const findSingleValue = (arr) => {
  return arr.reduce((acc, value) => {
    if (arr.indexOf(value) === arr.lastIndexOf(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
};

console.log(findSingleValue(array)); // [1, 8, 9]
```

### III. Sử dụng `Map` để tối ưu hiệu suất

> Đạt được mục đích chỉ với một lần duyệt

```js
const arr = [6, 4, 3, 2, 4, 1, 6, 3, 2, 7, 8, 9];

const findUniqueValuesOptimized = (arr) => {
  const uniqueSet = new Set();
  const seenSet = new Set();

  for (const num of arr) {
    if (!seenSet.has(num)) {
      uniqueSet.add(num);
      seenSet.add(num);
    } else {
      uniqueSet.delete(num);
    }
  }

  return Array.from(uniqueSet);
};

console.log(findUniqueValuesOptimized(arr)); // [1, 7, 8, 9]
```

## 3. Tính tổng mảng có kiểu dữ liệu đơn

### I Tính nhanh với vòng lặp `for...of`

```js
const numberArray = [1, 2, 3, 4, 5];

const sumArray = (arr) => {
  let sum = 0;
  for (const num of arr) {
    sum += num;
  }
  return sum;
};
```

### II. Sử dụng vòng lặp `for`

```js
const numberArray = [1, 2, 3, 4, 5];

const sumArray = (arr) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
};

console.log(sumArray(numberArray)); // 15
```

## 4. Tính tổng mảng lồng nhiều cấp

### I. Sử dụng đệ quy

```js
const nestedArray = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

const sumNestedArray = (arr) => {
  return arr.reduce((acc, val) => {
    return acc + (Array.isArray(val) ? sumNestedArray(val) : val);
  }, 0);
};

console.log(sumNestedArray(nestedArray)); // 55
```

### II. Sử dụng `flat` để làm phẳng mảng

> Nếu mảng chứa object thì không thể sử dụng phương thức `flat`

```js
const nestedArray = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

const sumNestedArray = (arr) => {
  return arr.flat(Infinity).reduce((acc, val) => acc + val, 0);
};

console.log(sumNestedArray(nestedArray)); // 55
```

## 5. Tính tổng các số trong mảng có nhiều kiểu dữ liệu

### I. Sử dụng reduce để tính tổng các số

```js
const mixedArray = [1, '2', 3, 'four', 5, true, [6], { num: 7 }, '8.5'];

const sumNumbers = (arr) => {
  return arr.reduce((sum, item) => {
    if (typeof item === 'number') {
      return sum + item;
    } else if (typeof item === 'string' && !isNaN(Number(item))) {
      // Nếu cần chuyển đổi chuỗi thành số thì xử lý ở đây, nếu không cần có thể bỏ điều kiện này
      return sum + Number(item);
    }
    return sum;
  }, 0);
};

console.log(sumNumbers(mixedArray)); // 19.5
```
