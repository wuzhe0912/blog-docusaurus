---
id: hoisting-basic
title: '☕ Basic'
slug: /hoisting-basic
---

### What’s Hoisting ?

JS 的運行可以拆解為兩階段，分別是創造與執行：

```js
var name = 'Pitt';
console.log(name); // print Pitt
```

在 Hoisting 特性下，上面這段程式實際運作上，需要理解為先宣告變數再執行賦值。

```js
// create
var name;

// execute
name = 'Pitt';
console.log(name);
```

而 function 又和變數不同，在創造階段就會指給記憶體，陳述式如下：

```js
getName();

function getName() {
  console.log('string'); // print string
}
```

上面這段之所以能正常運行印出 console.log，而不會報錯，在於以下邏輯，function 先被提升到最上方，接著才做呼叫 function 的動作。

```js
// create
function getName() {
  console.log('string');
}

// execute
getName();
```

但需要注意的是，這種 Hoisting 特性，在表達式時需要注意撰寫順序。

在創造階段時，function 是最優先的，其次才是變數。

### Correct and wrong writing style

#### Correct

```js
name = 'Yumy';
console.log(name); // print Yumy
var name;

// --- Equal to ---

// create
var name;

// execute
name = 'Yumy';
console.log(name); // print Yumy
```

#### Wrong

```js
console.log(name); // print undefined
var name = 'Jane';

// --- Equal to ---

// create
var name;

// execute
console.log(name); // print undefined，因為還未拿到賦值，只拿到預設的 undefined
name = 'Pitt';
```

### Example

#### What's `name` printed ?

```js
whoseName();

function whoseName() {
  if (name) {
    name = 'Nini';
  }
}

var name = 'Pitt';
console.log(name);
```

#### Answer

```js
// create
function whoseName() {
  if (name) {
    name = 'Nini';
  }
}
var name;

// execute
whoseName();
name = 'Pitt';
console.log(name); // print Pitt
```

name 在 `whoseName()` 中，雖然因為拿到 undefined，不會往下走判斷。

但因為陳述式的下方，又有一個賦值，所以即使在 function 有進入判斷條件，最終仍會印出 Pitt。
