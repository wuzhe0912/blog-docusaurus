---
id: find-most-frequent-char
title: 📄 Find Most Frequent Char
slug: /find-most-frequent-char
---

## Question Description

建立一個 function，接收一個字串，並回傳該字串中出現次數最多的字元。

## 1. JavaScript Version

```js
function findMostFrequentChar(str) {
  // init object to store char and count
  const charCount = {};

  // init record of max count and char variable
  let maxCount = 0;
  let maxChar = '';

  // loop through string
  for (let char of str) {
    // if char is not in object, set count to 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // increment this char count + 1
    charCount[char]++;

    // if this char count is greater than max count
    // update max count and max char
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // return max char
  return maxChar;
}

console.log(findMostFrequentChar('abcccccccd')); // c
```
