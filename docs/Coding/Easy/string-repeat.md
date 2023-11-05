---
id: string-repeat
title: 📄 String Repeat
slug: /string-repeat
---

## Question Description

嘗試設計一個 function，允許將 string 重複指定的次數。

### `repeat()` solution(ES6+)

因為現在 String 已經支援 `repeat()`，所以可以直接使用。

```js
const repeatedString = 'Pitt';

console.log(`Name Repeat : ${repeatedString.repeat(3)}`); // "Name Repeat : PittPittPitt"
```

### Reference

[String.prototype.repeat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat)

### function solution

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
