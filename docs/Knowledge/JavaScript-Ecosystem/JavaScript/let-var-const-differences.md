---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Overview

JavaScript has three keywords for declaring variables: `var`, `let`, and `const`.
All three declare variables, but they differ in scope, initialization requirements, redeclaration behavior, reassignment rules, and access timing.

## Key Differences

| Behavior             | `var`                     | `let`                     | `const`                   |
| -------------------- | ------------------------- | ------------------------- | ------------------------- |
| Scope                | Function or global scope  | Block scope               | Block scope               |
| Initialization       | Optional                  | Optional                  | Required                  |
| Redeclaration        | Allowed                   | Not allowed               | Not allowed               |
| Reassignment         | Allowed                   | Allowed                   | Not allowed               |
| Access before declare| Returns `undefined`       | Throws `ReferenceError`   | Throws `ReferenceError`   |

## Detailed Explanation

### Scope

`var` is function-scoped (or global-scoped), while `let` and `const` are block-scoped (including function blocks, `if-else` blocks, and `for` loops).

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var in block';
  let letInBlock = 'let in block';
  const constInBlock = 'const in block';
}

console.log(varInBlock); // 'var in block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### Initialization

`var` and `let` can be declared without initialization, but `const` must be initialized at declaration time.

```javascript
var varVariable; // valid
let letVariable; // valid
const constVariable; // SyntaxError: Missing initializer in const declaration
```

### Redeclaration

Within the same scope, `var` allows redeclaration of the same variable, while `let` and `const` do not.

```javascript
var x = 1;
var x = 2; // valid, x is now 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Reassignment

Variables declared with `var` and `let` can be reassigned, while `const` variables cannot.

```javascript
var x = 1;
x = 2; // valid

let y = 1;
y = 2; // valid

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Note: although a `const` variable cannot be reassigned, object/array contents can still be mutated.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // valid
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // valid
console.log(arr); // [1, 2, 3, 4]
```

### Access Before Declaration (Temporal Dead Zone)

Variables declared with `var` are hoisted and initialized to `undefined`.
`let` and `const` are also hoisted, but they are not initialized before declaration, so accessing them early throws `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Interview Question

### Question: the classic `setTimeout + var` trap

Predict the output of this code:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Common wrong answer

Many people think it outputs: `1 2 3 4 5`

#### Actual output

```
6
6
6
6
6
```

#### Why?

This question involves three core concepts:

**1. `var` function scope**

```javascript
// `var` does not create block scope in loops
for (var i = 1; i <= 5; i++) {
  // `i` is in the outer scope; all iterations share the same `i`
}
console.log(i); // 6 (after loop ends)

// `var` equivalent idea
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4;
  // loop ends
}
```

**2. `setTimeout` asynchronous execution**

```javascript
// `setTimeout` is asynchronous and runs after current sync code finishes
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // This callback is queued in the event loop
    console.log(i);
  }, 0);
}
// The loop finishes first (`i` becomes 6), then callbacks run
```

**3. Closure reference**

```javascript
// All callbacks reference the same `i`
// By execution time, `i` is already 6
```

#### Solutions

**Solution 1: Use `let` (recommended) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// output: 1 2 3 4 5

// `let` conceptually behaves like:
{
  let i = 1; // first iteration
}
{
  let i = 2; // second iteration
}
{
  let i = 3; // third iteration
}
```

**Why it works**: `let` creates a new block-scoped binding on each iteration, so each callback captures that iteration's value.

```javascript
// conceptually equivalent to:
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ...and so on
```

**Solution 2: Use IIFE (Immediately Invoked Function Expression)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// output: 1 2 3 4 5
```

**Why it works**: each iteration creates a new function scope and passes the current `i` as parameter `j`.

**Solution 3: Use the third parameter of `setTimeout`**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // the third argument is passed to the callback
}
// output: 1 2 3 4 5
```

**Why it works**: parameters after delay are passed to the callback function.

**Solution 4: Use `bind`**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// output: 1 2 3 4 5
```

**Why it works**: `bind` creates a new function with the current `i` bound as an argument.

#### Solution Comparison

| Solution             | Pros                     | Cons                     | Recommendation |
| -------------------- | ------------------------ | ------------------------ | -------------- |
| `let`                | Concise, modern, clear   | Requires ES6+            | 5/5 strongly recommended |
| IIFE                 | Good compatibility       | More verbose syntax      | 3/5 acceptable |
| `setTimeout` arg     | Simple and direct        | Less known by many devs  | 4/5 recommended |
| `bind`               | Functional style         | Slightly less readable   | 3/5 acceptable |

#### Follow-up Questions

**Q1: What if we change it to this?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Answer**: it prints `6` once per second, for a total of 5 times (at 1s, 2s, 3s, 4s, and 5s).

**Q2: How do we print 1, 2, 3, 4, 5 in order, one per second?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// prints 1 after 1s
// prints 2 after 2s
// prints 3 after 3s
// prints 4 after 4s
// prints 5 after 5s
```

#### Interview Focus Points

This question tests:

1. ✅ **`var` scope**: function scope vs block scope
2. ✅ **Event Loop**: synchronous vs asynchronous execution
3. ✅ **Closure**: how functions capture outer variables
4. ✅ **Solutions**: multiple approaches and trade-offs

Recommended answer flow in interviews:

- State the correct result first (`6 6 6 6 6`)
- Explain the cause (`var` scope + asynchronous `setTimeout`)
- Provide fixes (prefer `let`, then mention alternatives)
- Show understanding of JavaScript internals

## Best Practices

1. Prefer `const` first: if a variable does not need reassignment, `const` improves readability and maintainability.
2. Use `let` when reassignment is required.
3. Avoid `var` in modern JavaScript: its scope/hoisting behavior often causes unexpected issues.
4. Consider browser compatibility: for old browsers, use transpilers like Babel to convert `let`/`const`.

## Related Topics

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
