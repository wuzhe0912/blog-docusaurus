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
