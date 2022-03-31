---
id: closures
title: '📜 Closures'
slug: /closures
---

## What is Closures ?

closures 除了包含本身是一個 function 外，也含括了自身內部的環境，同時也能去獲取外部 function 的變數。

因此可以理解為，closures 本身是一個 child function，用來保存處理 parent function 的變數。

之所以需要這個功能，在於多數高階語言，大多帶有 `Garbage Collection(垃圾回收機制)`，JS 自然也不例外。

每當 function 執行完畢後，即會觸發這個機制，將內部作用域內容銷毀。

## Scope

先從作用域的角度來看待 closures 的運作

```javascript
// global scope
let a = 1;

function parentFunction() {
  // local scope
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c);
  }

  childFunction();
}

parentFunction();
console.log(a, b, c);
```

在 child 中，因為變數還能正常獲取，所以可以 print 1 2 3，但一回到 global 環境中，因為 b c 變數都已被銷毀，也就無法 print。

倘若今天要進行疊加計算之類的作法，無論 call 幾次 parentFunction 都會拿到相同的結果，所以為了處理這個需求，可以更改如下:

```javascript
// global scope
let a = 1;

const parentFunction = () => {
  // local scope
  let b = 2;

  const childFunction = () => {
    console.log((a += 2));
    console.log((b += 4));
  };

  return childFunction;
};

const result = parentFunction();
result(); // 3, 6
result(); // 5, 10
console.log(a); // print 5
```

這樣一來，無論 call 幾次 function，都能持續計算 global variable 的疊加結果。

但如果在這邊 `console.log(b)` 則會拿到 error，因為 b 這個變數其作用域仍在 function 內。

## Example 1

> 建立符合下述條件的 function

```javascript
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

將兩個 function 進行分拆後處理

```javascript
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```javascript
// use closures save variable

function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Second Solution : single function

當然第一種解法有不小的機率被 reject，所以需要嘗試合併在同一個 function。

```javascript
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

## Example 2

> 請利用閉包的特性，將數字遞增

```javascript
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

這邊不使用 [Arrow Function](../ES6+/arrow-function.md)，改用一般 function 的形式。

```javascript
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

```javascript
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
