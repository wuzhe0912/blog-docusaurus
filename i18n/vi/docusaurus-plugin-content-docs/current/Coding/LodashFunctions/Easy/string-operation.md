---
id: string-operation
title: 📄 String Operation
slug: /string-operation
---

## 1. Lặp lại String theo số lần chỉ định

Thử thiết kế một hàm cho phép lặp lại string theo số lần chỉ định.

### I. Sử dụng `repeat()` solution(ES6+)

Vì String hiện đã hỗ trợ `repeat()`, nên có thể sử dụng trực tiếp.

```js
const repeatedString = 'Pitt';

console.log(`Name Repeat : ${repeatedString.repeat(3)}`); // "Name Repeat : PittPittPitt"
```

#### Reference

[String.prototype.repeat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

### II. Sử dụng vòng lặp

Nếu không sử dụng `repeat()`, cũng có thể dùng vòng lặp, ràng buộc qua tham số chỉ cho phép số nguyên dương.

```js
function repeatString(str, num) {
  // Kiểm tra xem có phải số nguyên dương không
  if (num < 0 || !Number.isInteger(num)) {
    throw new Error('Vui lòng nhập số nguyên dương');
  }

  let repeatedString = '';
  for (let i = 0; i < num; i++) {
    repeatedString += str;
  }
  return repeatedString;
}
```

## 2. Xử lý tên tệp hoặc phần mở rộng trong string

Thử thiết kế hàm `getFileExtension()` để lấy phần mở rộng của tệp từ tham số. Nếu không có phần mở rộng thì trả về tên tệp.

```js
const fileName = 'video.mp4';
const fileNameWithoutExtension = 'file';
const fileNameWithoutExtension2 = 'example.flv';
const fileNameWithoutExtension3 = 'movie.mov';
const fileNameWithoutExtension4 = '.gitignore';
```

### I. Sử dụng split để lấy tên tệp

```js
const getFileExtension = (fileName) => {
  const fileNameSplit = fileName.split('.');
  return fileNameSplit[fileNameSplit.length - 1];
};

console.log(getFileExtension(fileName)); // "mp4"
console.log(getFileExtension(fileNameWithoutExtension)); // "file"
console.log(getFileExtension(fileNameWithoutExtension2)); // "flv"
console.log(getFileExtension(fileNameWithoutExtension3)); // "mov"
console.log(getFileExtension(fileNameWithoutExtension4)); // ""
```

## 3. Tìm chuỗi dài nhất trong mảng

### I. Sử dụng phương thức `sort()`

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const longestString = (stringArray) => {
  return stringArray.sort((a, b) => b.length - a.length)[0];
};

console.log(longestString(stringArray)); // "strawberry"
```

### II. Sử dụng phương thức `reduce()`

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const longestString = (stringArray) => {
  return stringArray.reduce(
    (acc, cur) => (acc.length > cur.length ? acc : cur),
    ''
  );
};

console.log(longestString(stringArray)); // "strawberry"
```

## 4. Chuyển đổi chuỗi sang camelCase

Thử thiết kế một hàm có thể chuyển đổi chuỗi sang camelCase.

### I. Sử dụng phương thức `replace()`

```js
const camelCase = (str) => {
  return str.replace(/-([a-z])/g, (match, char) => char.toUpperCase());
};

console.log(camelCase('hello-world')); // "helloWorld"
```

### II. Sử dụng phương thức `split()`

```js
const camelCase = (str) => {
  return str
    .split('-')
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
};

console.log(camelCase('hello-world')); // "helloWorld"
```

## 5. Tìm số lần xuất hiện của chuỗi trùng lặp trong mảng

### I. Sử dụng phương thức `Map()`

```js
const stringArray = [
  'apple',
  'banana',
  'orange',
  'kiwi',
  'strawberry',
  'apple',
];

const countDuplicateString = (stringArray) => {
  const map = new Map();
  stringArray.forEach((item) => {
    map.set(item, (map.get(item) || 0) + 1);
  });
  return Object.fromEntries(map);
};

console.log(countDuplicateString(stringArray)); // { apple: 2, banana: 1, orange: 1, kiwi: 1, strawberry: 1 }
```

### II. Sử dụng phương thức `reduce()` để tìm số lần chuỗi trùng lặp

```js
const stringArray = [
  'apple',
  'banana',
  'orange',
  'kiwi',
  'strawberry',
  'apple',
];

const countDuplicateString = (stringArray) => {
  return stringArray.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {});
};

console.log(countDuplicateString(stringArray)); // { apple: 2, banana: 1, orange: 1, kiwi: 1, strawberry: 1 }
```

### III. Sử dụng phương thức `Object.groupBy()`(ES2023+)

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const countDuplicateString = (stringArray) => {
  return Object.groupBy(stringArray);
};

console.log(countDuplicateString(stringArray)); // { apple: 2, banana: 1, orange: 1, kiwi: 1, strawberry: 1 }
```

## 6. Tìm phần mở rộng của chuỗi trong mảng và lọc các phần mở rộng trùng lặp

### I. Sử dụng phương thức `split()`

```js
const files = [
  'document.docx',
  'image.jpg',
  'script.js',
  'style.css',
  'data.json',
  'image.png',
  'new-image.png',
];

const getFileExtension = (files) => {
  return files
    .map((file) => file.split('.').pop())
    .filter((file, index, self) => self.indexOf(file) === index);
};

console.log(getFileExtension(files)); // ["docx", "jpg", "js", "css", "json", "png"]
```
