---
id: 00-closures-basic
title: '📜 Closures Basic'
slug: /00-closures-basic
---

## What is Closures?

大部分的高階語言，都帶有 `Garbage Collection(垃圾回收機制)`，目的是為了避免浪費記憶體，而 `JS` 自然也不例外。

當 `function` 執行完畢後，即會觸發這個機制，將內部作用域內容銷毀。倘若我們希望保留內部的變數，可透過子函式來達成，這個即被稱為閉包。

## 濫用 `Closures` 會導致什麼問題?

## 實作 I

> 建立符合下述條件的 `function`

```javascript
// question
plus(2, 5); // output 7
plus(2)(5); // output 7
```

> 第一種解法，利用分拆的方式處理:

```javascript
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```javascript
// 利用子函式可以保存變數的特性進行 return

function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

當然上述只是一種笨解法，實際上我們肯定要用一個 `function` 來處理。

> 第二種解法，我們導入條件判斷，這樣就能達成一個 `function` 來解決兩個問題:

```javascript
function plus(value, subValue) {
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

上述 `function` 中的 `arguments`，可以用來檢測傳入參數的數量，即可作為條件判斷的依據。

## 實作 II

> Please implement a counter

```javascript
// 利用閉包的特性，將數字遞增

function plus() {
  // code
}

var obj = plus();
obj.add(); // 印出 1
obj.add(); // 印出 2
```

> 第一種解法:

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

透過閉包的特性來保留變數，讓下一次使用該函式時，可以繼續使用該變數。

> 第二種解法:

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

因為沒有宣告新的物件，所以透過物件包裹的形式來 `return`。

## Reference

- [Day6 [JavaScript 基礎] 垃圾回收機制](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - JavaScript 記憶體管理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
