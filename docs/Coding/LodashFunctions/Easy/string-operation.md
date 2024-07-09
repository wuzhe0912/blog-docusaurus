---
id: string-operation
title: 📄 String Operation
slug: /string-operation
---

## 1. 操作 String 重複指定的次數

嘗試設計一個 function，允許將 string 重複指定的次數。

### 解法一：`repeat()` solution(ES6+)

因為現在 String 已經支援 `repeat()`，所以可以直接使用。

```js
const repeatedString = 'Pitt';

console.log(`Name Repeat : ${repeatedString.repeat(3)}`); // "Name Repeat : PittPittPitt"
```

### Reference

[String.prototype.repeat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

### 解法二：使用迴圈

如果不使用 `repeat()`，也可以使用迴圈，透過傳參數的方式，約束在正整數的條件下達成。

```js
function repeatString(str, num) {
  // 檢查是否為非正整數
  if (num < 0 || !Number.isInteger(num)) {
    throw new Error('請輸入正整數');
  }

  let repeatedString = '';
  for (let i = 0; i < num; i++) {
    repeatedString += str;
  }
  return repeatedString;
}
```

## 2. 處理 string 中的檔案名或副檔名

嘗試設計一個 `getFileExtension()`，可以從參數中取得影片的副檔名格式，若沒有副檔名則回傳檔案名稱。

```js
const fileName = 'video.mp4';
const fileNameWithoutExtension = 'file';
const fileNameWithoutExtension2 = 'example.flv';
const fileNameWithoutExtension3 = 'movie.mov';
const fileNameWithoutExtension4 = '.gitignore';
```

### 解法一：使用 split 取得檔案名稱

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

## 3. 尋找陣列中的最長字串

嘗試設計一個 function，可以找出陣列中最長的字串。

### 解法一：使用 `reduce()` 方法

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

### 解法二：使用 `sort()` 方法

```js
const stringArray = ['apple', 'banana', 'orange', 'kiwi', 'strawberry'];

const longestString = (stringArray) => {
  return stringArray.sort((a, b) => b.length - a.length)[0];
};

console.log(longestString(stringArray)); // "strawberry"
```

## 4. 將字串轉換為駝峰式大小寫

嘗試設計一個 function，可以將字串轉換為駝峰式大小寫。

### 解法一：使用 `replace()` 方法

```js
const camelCase = (str) => {
  return str.replace(/-([a-z])/g, (match, char) => char.toUpperCase());
};

console.log(camelCase('hello-world')); // "helloWorld"
```

### 解法二：使用 `split()` 方法

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

## 5. 找出陣列中的重複字串次數

### 解法一：使用 `reduce()` 方法找出重複字串次數

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
