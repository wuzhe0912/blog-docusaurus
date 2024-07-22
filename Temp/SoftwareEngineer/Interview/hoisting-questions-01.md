---
id: hoisting-questions-01
title: '☕ Questions I'
slug: /hoisting-questions-01
---

### 1. What's the result of the following code block ?

```js
(function () {
  var a;
  console.log(typeof a);
  function a() {}
  a = 'hello';
  console.log(typeof a);
  var a;
  console.log(typeof a);
})();
```

```js
// Answer
function
string
string
```

需要特別注意 function 會被提升到最前面，所以 a 在第一個 `conosle.log()` 時已經被賦值。

### 2. What will the variables be printed in order ?

```js
myName = 'global';

function func() {
  console.log(myName); // output？
  var myName = 'local';
  console.log(myName); // output？
}

func();
```

```js
// Answer
undefined;
local;
```

同樣是 function 被提升到最前面，這時函式外的賦值還未觸發，僅有函式內的賦值，所以這一段程式碼實際運作邏輯如下：

```js
function func() {
  var myName;
  console.log(myName); // print undefined (myName 已宣告但未賦值)
  myName = 'local'; // define
  console.log(myName); // print local
}

// 函式結束，變數銷毀
myName = 'global';

func();
```

### 3. Please print output result in order

```js
a = undefined;
console.log(a === b);

var a = null;
console.log(a === b);

b = null;
console.log(a === b);

var b = undefined;
console.log(a === b);
```

```js
// Answer
true;
false;
true;
false;
```

這一段程式碼實際運作邏輯如下：

```js
// create
var a; // get default undefined
var b; // get default undefined
// execute
a = undefined;
console.log(a === b); // true

a = null;
console.log(a === b); // false

b = null;
console.log(a === b); // true

b = undefined;
console.log(a === b); // false
```

第一行，宣告變數但尚未賦值時，預設皆為 undefined，因此這時兩者相等，結果為 true。

第二行，a 被賦值為 null，而 b 仍是 undefined，因此兩者不相等，結果為 false。

第三行，b 也被賦值為 null，兩者相等，結果為 true。

第四行，b 被更改為 undefined，兩者再次不相符，結果為 false。
