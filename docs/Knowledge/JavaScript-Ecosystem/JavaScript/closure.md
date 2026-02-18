---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> What is a closure?

To understand closures, you should first understand JavaScript variable scope and how a function accesses outer variables.

### Variable Scope

In JavaScript, variable scope is commonly discussed as global scope and function scope (and block scope with `let`/`const`).

```js
// global scope
let a = 1;

function parentFunction() {
  // function scope
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // print 1 2 3, can access global + outer function scope
  }

  childFunction();
}

parentFunction();
console.log(a); // print 1, can access global scope
console.log(b, c); // error: cannot access variables inside function scope
```

### Closure Example

A closure is formed when a child function is defined inside a parent function and returned, so the child function keeps access to the parent's lexical environment (which avoids immediate garbage collection for captured variables).

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`Current count: ${count}`);
  };
}

const counter = parentFunction();

counter(); // print Current count: 1
counter(); // print Current count: 2
// `count` is preserved because childFunction still exists and keeps a reference
```

Be careful: closures keep variables in memory. Overuse can increase memory usage and hurt performance.

## 2. Create a function that meets the following conditions

> Create a function (using closure concepts) that satisfies:

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution: two functions

Split into two function styles:

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// use closure to save value
function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Second Solution: single function

The first approach may be rejected in interviews if they ask for one function that handles both styles.

```js
function plus(value, subValue) {
  // determine behavior by number of arguments
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

> Use closures to implement incremental counting:

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution: return variable container

Use a normal function style here (no arrow function required).

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

### Second Solution: return object directly

You can also wrap the object directly in `return`.

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

## 4. What will be printed in this nested function call?

> What is the output of this nested function call?

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

a(b(c));
```

### Analysis

**Output:**

```
hello
TypeError: aa is not a function
```

### Detailed Execution Flow

```js
// Execute a(b(c))
// JavaScript evaluates function calls from inner to outer

// Step 1: evaluate inner b(c)
b(c)
  ↓
// c is passed into b
// inside b, bb() means c()
c() // prints 'hello'
  ↓
// b has no return statement
// so it returns undefined
return undefined

// Step 2: evaluate a(undefined)
a(undefined)
  ↓
// undefined is passed into a
// a tries aa(), i.e. undefined()
undefined() // ❌ TypeError: aa is not a function
```

### Why?

#### 1. Function evaluation order (inner -> outer)

```js
// Example
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. execute multiply(2, 3) first -> 6
           └────── 3. then execute add(6)

// Same idea
a(b(c))
  ↑ ↑
  | └─ 1. evaluate b(c)
  └─── 2. then evaluate a(result of b(c))
```

#### 2. A function without `return` returns `undefined`

```js
function b(bb) {
  bb(); // executes, but no return
} // implicit return undefined

// Equivalent to
function b(bb) {
  bb();
  return undefined; // added implicitly by JavaScript
}
```

#### 3. Calling a non-function throws TypeError

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// other error cases
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### How to fix it?

#### Method 1: make `b` return a function

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
  return function () {
    console.log('b executed');
  };
}

function c() {
  console.log('hello');
}

a(b(c));
// output:
// hello
// b executed
```

#### Method 2: pass a function reference, do not execute too early

```js
function a(aa) {
  aa();
}

function b(bb) {
  return function () {
    bb();
  };
}

function c() {
  console.log('hello');
}

a(b(c)); // prints 'hello'

// or
a(() => b(c)); // prints 'hello'
```

#### Method 3: change execution flow

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

// execute separately
b(c); // prints 'hello'
a(() => console.log('a executed')); // prints 'a executed'
```

### Related Interview Variations

#### Question 1: what if we change it like this?

```js
function a(aa) {
  return aa();
}

function b(bb) {
  return bb();
}

function c() {
  console.log('hello');
  return 'world';
}

console.log(a(b(c)));
```

<details>
<summary>Click to view answer</summary>

```
hello
TypeError: aa is not a function
```

**Explanation:**

1. `b(c)` -> runs `c()`, prints `'hello'`, returns `'world'`
2. `a('world')` -> tries to execute `'world'()`
3. `'world'` is a string, not a function, so it throws TypeError

</details>

#### Question 2: what if all functions return values?

```js
function a(aa) {
  return aa;
}

function b(bb) {
  return bb;
}

function c() {
  return 'hello';
}

const result = a(b(c));
console.log(result);
console.log(result());
```

<details>
<summary>Click to view answer</summary>

```
[Function: c]
hello
```

**Explanation:**

1. `b(c)` -> returns function `c` itself (not executed)
2. `a(c)` -> returns function `c`
3. `result` is function `c`
4. `result()` -> executes `c()`, returns `'hello'`

</details>

### Key Takeaways

```javascript
// function call precedence
a(b(c))
  ↓
// 1. evaluate inner call first
b(c) // if b has no return, result is undefined
  ↓
// 2. then evaluate outer call
a(undefined) // calling undefined() throws

// fixes
// ✅ 1. ensure the middle function returns a function
// ✅ 2. or wrap with an arrow function
a(() => b(c))
```

## Reference

- [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [TypeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
