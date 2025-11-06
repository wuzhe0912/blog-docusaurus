---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> 什麼是 Closure ?

要理解閉包，需要先明白 JavaScript 的變數作用域，以及 function 是如何訪問外部變數的。

### Variable Scope(變數作用域)

在 JavaScript 中，變數的作用域分為兩種，分別是 global scope & function scope。

```js
// global scope
let a = 1;

function parentFunction() {
  // function scope
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // print 1 2 3, can access global scope & function scope
  }

  childFunction();
}

parentFunction();
console.log(a); // print 1, can access global scope
console.log(b, c); // 產生錯誤，無法存取 function scope 內的變數
```

### Closure example

Closure 的觸發條件是，有一個子函式定義在父函式內，且透過 return 的方式回傳，達到保存子函式內的環境變數(等於迴避了 `Garbage Collection(垃圾回收機制)`)。

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`目前計數：${count}`);
  };
}

const counter = parentFunction();

counter(); // print 目前計數：1
counter(); // print 目前計數：2
// count 變數不會被回收，因為 childFunction 仍然存在，並且每次呼叫都會更新 count 的值
```

但要注意，因為閉包會將變數保存在記憶體中，所以如果變數過多，會導致記憶體占用過大(不能濫用閉包)，進而影響效能。

## 2. Create a function that meets the following conditions

> 建立符合下述條件的 function(使用閉包觀念來處理)

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

將兩個 function 進行分拆後處理

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// use closure save variable

function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Second Solution : single function

當然第一種解法有不小的機率被 reject，所以需要嘗試合併在同一個 function。

```js
function plus(value, subValue) {
  // 利用每次傳入參數的多寡來判斷
  if (arguments.length > 1) {
    return value + subValue;
  } else {
    return function (item) {
      return value + item;
    };
  }
}

console.log(plus(2, 5));
console.log(plus(2)(5));
```

## 3. Please take advantage of the closure feature to increase the number

> 請利用閉包的特性，將數字遞增

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

這邊不使用 Arrow Function，改用一般 function 的形式。

```js
function plus() {
  let cash = 0;
  let counter = {
    add() {
      cash += 1;
      console.log(cash);
    },
  };
  return counter;
}

var obj = plus();
obj.add();
obj.add();
```

### Second Solution : return object

前一個解法中，也可以直接將 object 包裹在 return 中

```js
function plus() {
  let cash = 0;
  return {
    add: function () {
      cash += 1;
      console.log(cash);
    },
  };
}

var obj = plus();
obj.add();
obj.add();
```

## Reference

- [Closures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [Day6 [JavaScript 基礎] 垃圾回收機制](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - JavaScript 記憶體管理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

