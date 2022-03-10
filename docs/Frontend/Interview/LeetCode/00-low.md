---
id: 00-low-I
title: 📜 Low Level 1 - 10
slug: /low-I
---

> _A word before is worth two behind._

## 1. Divide by whole number

<!-- 請回答 1-10000000 這個範圍內，能被3或7整除，並且不能同時被3和7整除的整數數量。 -->

### Description

> Please Answer the number of integers in the range 1 to 1,000,000 that are divisible by 3 or 7 and not divisible by both 3 and 7.

### Answer

```javascript
const filterArray = [];
const num = 1000000;

for (i = 1; i <= num; i++) {
  if (i % 3 === 0 || i % 7 === 0) {
    let checkSame = i % 3 === 0 && i % 7 === 0;
    if (!checkSame) {
      filterArray.push(i);
    }
  }
}

console.log(filterArray);
```

## 2. FizzBuzz

<!-- 給一個數字 n，印出 1~n，但如果碰到 3 的倍數，印出 Fizz，碰到 5 的倍數，改印 Buzz，若同時碰到 3 跟 5 的倍數，印出 FizzBuzz。 -->

- <strong>Description</strong>

> Given a number n, print out 1~n, but if a multiple of 3 is encountered, print out Fizz, if a multiple of 5 is encountered, print out Buzz instead, and if a multiple of both 3 and 5 is encountered, print out FizzBuzz.

- <strong>Answer</strong>

```javascript
const num = 100;

for (let i = 1; i < num + 1; i++) {
  if (i % 3 === 0 && i % 5 === 0) {
    console.log(`${i}：FizzBuzz`);
  } else if (i % 3 === 0) {
    console.log(`${i}：Fizz`);
  } else if (i % 5 === 0) {
    console.log(`${i}：Buzz`);
  } else {
    console.log(i);
  }
}
```

## 3. Determining odd or even numbers

<!-- 如何印出 1~100？並判斷某個數是偶數？或是奇數？ -->

- <strong>Description</strong>

> How to print out 1~100 and determine if a number is even? Or is it an odd number?

- <strong>Answer</strong>

```javascript
for (let i = 1; i < 101; i++) {
  if (i % 2 === 0) {
    console.log(`${i} is even number.`);
  } else {
    console.log(`${i} is odd number.`);
  }
}
```

## 4. Calculate the sun of N numbers

<!-- 假設有一個數字 N，我們要求 1+…_+N 的總和。 -->

- <strong>Description</strong>

> Suppose there is a number N and we require the sum of 1+...\_+N.

- <strong>Answer</strong>

```javascript
// use closure to save variable
function solve(num) {
  let sumNumber = 0;
  for (let i = 1; i <= num; i++) {
    sumNumber += i;
  }
  return sumNumber;
}

console.log(solve(10));
```

<!-- ## 5. -->

<!-- 給定兩個正整數 a 與 b，輸出 a + b 的結果。 -->

<!-- - <strong>Description</strong> -->

<!-- > Given two positive integers a and b, output the result of a + b. -->
