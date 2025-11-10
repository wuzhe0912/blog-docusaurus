---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. What's Hoisting ?

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

### Correct

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

### Wrong

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

## 2. What's `name` printed ?

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

### Answer

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

---

## 3. 函式聲明 vs 變數聲明：提升優先級

### 題目：同名的函式和變數

試判斷以下程式碼的輸出結果：

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### 錯誤答案（常見誤解）

很多人會以為：

- 輸出 `undefined`（認為 var 先提升）
- 輸出 `'1'`（認為賦值會影響）
- 報錯（認為同名衝突）

### 實際輸出

```js
[Function: foo]
```

### 為什麼？

這題考察 Hoisting 的**優先級規則**：

**提升優先級：函式聲明 > 變數聲明**

```js
// 原始程式碼
console.log(foo);
var foo = '1';
function foo() {}

// 等價於（經過 Hoisting）
// 階段 1：創造階段（Hoisting）
function foo() {} // 1. 函式聲明先提升
var foo; // 2. 變數聲明提升（但不覆蓋已存在的函式）

// 階段 2：執行階段
console.log(foo); // 此時 foo 是函式，輸出 [Function: foo]
foo = '1'; // 3. 變數賦值（會覆蓋函式）
```

### 關鍵概念

**1. 函式聲明會完整提升**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. var 變數聲明只提升聲明，不提升賦值**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. 當函式聲明和變數聲明同名時**

```js
// 提升後的順序
function foo() {} // 函式先提升並賦值
var foo; // 變數聲明提升，但不會覆蓋已存在的函式

// 因此 foo 是函式
console.log(foo); // [Function: foo]
```

### 完整執行流程

```js
// 原始程式碼
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== 等價於 ========

// 創造階段（Hoisting）
function foo() {} // 1️⃣ 函式聲明提升（完整提升，包含函式體）
var foo; // 2️⃣ 變數聲明提升（但不覆蓋 foo，因為已經是函式了）

// 執行階段
console.log(foo); // [Function: foo] - foo 是函式
foo = '1'; // 3️⃣ 變數賦值（此時才覆蓋函式）
console.log(foo); // '1' - foo 變成字串
```

### 延伸題目

#### 題目 A：順序影響

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**答案：**

```js
[Function: foo] // 第一次輸出
'1' // 第二次輸出
```

**原因：** 程式碼順序不影響 Hoisting 的結果，提升優先級依然是函式 > 變數。

#### 題目 B：多個同名函式

```js
console.log(foo); // ?

function foo() {
  return 1;
}

var foo = '1';

function foo() {
  return 2;
}

console.log(foo); // ?
```

**答案：**

```js
[Function: foo] { return 2; } // 第一次輸出（後面的函式覆蓋前面的）
'1' // 第二次輸出（變數賦值覆蓋函式）
```

**原因：**

```js
// 提升後
function foo() {
  return 1;
} // 第一個函式

function foo() {
  return 2;
} // 第二個函式覆蓋第一個

var foo; // 變數聲明（不覆蓋函式）

console.log(foo); // [Function: foo] { return 2; }
foo = '1'; // 變數賦值（覆蓋函式）
console.log(foo); // '1'
```

#### 題目 C：函式表達式 vs 函式聲明

```js
console.log(foo); // ?
console.log(bar); // ?

var foo = function () {
  return 1;
};

function bar() {
  return 2;
}
```

**答案：**

```js
undefined; // foo 是 undefined
[Function: bar] // bar 是函式
```

**原因：**

```js
// 提升後
var foo; // 變數聲明提升（函式表達式只提升變數名）
function bar() {
  return 2;
} // 函式聲明完整提升

console.log(foo); // undefined
console.log(bar); // [Function: bar]

foo = function () {
  return 1;
}; // 函式表達式賦值
```

**關鍵差異：**

- **函式聲明**：`function foo() {}` → 完整提升（包含函式體）
- **函式表達式**：`var foo = function() {}` → 只提升變數名，函式體不提升

### let/const 不會有這個問題

```js
// ❌ var 會有提升問題
console.log(foo); // undefined
var foo = '1';

// ✅ let/const 有暫時性死區（TDZ）
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = '1';

// ✅ let/const 與函式同名會報錯
function baz() {} // SyntaxError: Identifier 'baz' has already been declared
let baz = '1';
```

### 提升優先級總結

```
Hoisting 優先級（從高到低）：

1. 函式聲明（Function Declaration）
   ├─ function foo() {} ✅ 完整提升
   └─ 優先級最高

2. 變數聲明（Variable Declaration）
   ├─ var foo ⚠️ 只提升聲明，不提升賦值
   └─ 不會覆蓋已存在的函式

3. 變數賦值（Variable Assignment）
   ├─ foo = '1' ✅ 會覆蓋函式
   └─ 執行階段才發生

4. 函式表達式（Function Expression）
   ├─ var foo = function() {} ⚠️ 視為變數賦值
   └─ 只提升變數名，不提升函式體
```

### 面試重點

回答這類問題時，建議：

1. **說明 Hoisting 機制**：分為創造和執行兩階段
2. **強調優先級**：函式聲明 > 變數聲明
3. **畫出提升後的程式碼**：讓面試官看到你的理解
4. **提到最佳實踐**：使用 let/const，避免 var 的提升問題

**面試回答範例：**

> "這道題考察 Hoisting 的優先級。在 JavaScript 中，函式聲明的提升優先級高於變數聲明。
>
> 執行過程分為兩階段：
>
> 1. 創造階段：`function foo() {}` 完整提升到最上方，接著 `var foo` 聲明提升但不覆蓋已存在的函式。
> 2. 執行階段：`console.log(foo)` 此時 foo 是函式，所以輸出 `[Function: foo]`，之後 `foo = '1'` 才將 foo 覆蓋為字串。
>
> 最佳實踐是使用 `let`/`const` 取代 `var`，並將函式聲明放在最上方，避免這類混淆。"

---

## 相關主題

- [var, let, const 差異](/docs/let-var-const-differences)
