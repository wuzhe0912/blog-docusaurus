---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. What's Hoisting ?

JavaScript execution can be viewed as two phases: creation and execution.

```js
var name = 'Pitt';
console.log(name); // print Pitt
```

With hoisting, the engine conceptually handles declaration first and assignment later:

```js
// create
var name;

// execute
name = 'Pitt';
console.log(name);
```

Functions behave differently from variables. A function declaration is bound during the creation phase:

```js
getName();

function getName() {
  console.log('string'); // print string
}
```

This works because the function declaration is hoisted before runtime calls:

```js
// create
function getName() {
  console.log('string');
}

// execute
getName();
```

Note: with function expressions, declaration and assignment order still matters.

In the creation phase, function declarations have higher priority than variable declarations.

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
console.log(name); // print undefined, because assignment has not happened yet
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

Inside `whoseName()`, `name` starts as `undefined`, so the `if (name)` branch does not run.
After that, `name` gets assigned `'Pitt'`, so the final output is still `Pitt`.

---

## 3. Function Declaration vs Variable Declaration: Hoisting Priority

### Question: function and variable with the same name

Predict the output of this code:

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### Common wrong answers

Many people think it will:

- Output `undefined` (assuming `var` is hoisted first)
- Output `'1'` (assuming assignment already took effect)
- Throw an error (assuming same-name conflict)

### Actual output

```js
[Function: foo]
```

### Why?

This question tests the **hoisting priority rule**:

**Hoisting priority: function declaration > variable declaration**

```js
// Original code
console.log(foo);
var foo = '1';
function foo() {}

// Equivalent after hoisting
// Phase 1: creation (hoisting)
function foo() {} // 1. function declaration is hoisted first
var foo; // 2. variable declaration is hoisted (does not overwrite function)

// Phase 2: execution
console.log(foo); // foo is a function here
foo = '1'; // 3. assignment overwrites function
```

### Key Concepts

**1. Function declarations are fully hoisted**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. `var` hoists declaration only, not assignment**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. When function and variable declarations share a name**

```js
// Hoisted order
function foo() {} // function is hoisted and initialized first
var foo; // declaration hoisted, but does not overwrite function

// Therefore foo is still a function
console.log(foo); // [Function: foo]
```

### Full Execution Flow

```js
// Original code
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== Equivalent ========

// Creation phase (hoisting)
function foo() {} // 1️⃣ function declaration is fully hoisted
var foo; // 2️⃣ variable declaration is hoisted but does not replace function

// Execution phase
console.log(foo); // [Function: foo]
foo = '1'; // 3️⃣ assignment now overwrites function
console.log(foo); // '1'
```

### Extended Questions

#### Question A: does order change the result?

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**Answer:**

```js
[Function: foo] // first output
'1' // second output
```

**Reason:** source order does not change hoisting priority. Function declaration still wins over variable declaration in creation phase.

#### Question B: multiple functions with the same name

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

**Answer:**

```js
[Function: foo] // first output (later function declaration overrides earlier one)
'1' // second output (assignment overrides function)
```

**Reason:**

```js
// After hoisting
function foo() {
  return 1;
} // first function

function foo() {
  return 2;
} // second function overrides first

var foo; // declaration only (does not overwrite function)

console.log(foo); // function returning 2
foo = '1'; // assignment overwrites function
console.log(foo); // '1'
```

#### Question C: function expression vs function declaration

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

**Answer:**

```js
undefined // foo is undefined
[Function: bar] // bar is a function
```

**Reason:**

```js
// After hoisting
var foo; // variable declaration is hoisted (function body is not)
function bar() {
  return 2;
} // function declaration is fully hoisted

console.log(foo); // undefined
console.log(bar); // function

foo = function () {
  return 1;
}; // assignment at runtime
```

**Key difference:**

- **Function declaration**: `function foo() {}` -> fully hoisted (including body)
- **Function expression**: `var foo = function() {}` -> only variable name is hoisted

### `let`/`const` avoid this pattern

```js
// ❌ `var` has hoisting pitfalls
console.log(foo); // undefined
var foo = '1';

// ✅ let/const are in TDZ before initialization
console.log(bar); // ReferenceError
let bar = '1';

// ✅ using same name with function and let/const throws
function baz() {}
let baz = '1'; // SyntaxError: Identifier 'baz' has already been declared
```

### Hoisting Priority Summary

```
Hoisting priority (high -> low):

1. Function Declaration
   - function foo() {} ✅ fully hoisted
   - highest priority

2. Variable Declaration
   - var foo ⚠️ declaration only (no assignment)
   - does not overwrite existing function declaration

3. Variable Assignment
   - foo = '1' ✅ can overwrite function
   - happens only in execution phase

4. Function Expression
   - var foo = function() {} ⚠️ treated as assignment
   - only variable name is hoisted
```

### Interview Focus

When answering this type of question, you can follow this structure:

1. Explain hoisting as two phases: creation and execution.
2. Emphasize priority: function declaration > variable declaration.
3. Rewrite the code into the hoisted form to show reasoning.
4. Mention best practices: prefer `let`/`const`, and avoid confusing `var` patterns.

**Sample interview answer:**

> This question is about hoisting priority. In JavaScript, function declarations are hoisted before variable declarations.
>
> The engine goes through two phases:
>
> 1. Creation phase: `function foo() {}` is hoisted first, then `var foo` is hoisted without overwriting the function.
> 2. Execution phase: `console.log(foo)` prints the function, and only later `foo = '1'` overwrites it.
>
> In practice, use `let`/`const` instead of `var` to avoid this confusion.

---

## Related Topics

- [var, let, const differences](/docs/let-var-const-differences)
