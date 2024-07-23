---
id: js-null-undefined
title: 📄 Please explain the difference between null and undefined
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Comparing the differences

- **`undefined`**:
  - Indicates that a variable has been declared but not yet assigned a value.
  - Is the default value of uninitialized variables.
  - Functions return `undefined` by default if no return value is explicitly specified.
- **`null`**:
  - Represents an empty value or no value.
  - Usually must be explicitly assigned as `null`.
  - Used to indicate that a variable intentionally does not point to any object or value.

## Examples

```js
let x;
console.log(x); // Output: undefined

function foo() {}
console.log(foo()); // Output: undefined

let y = null;
console.log(y); // Output: null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // Output: null
```

## Use `typeof` for verification

```js
console.log(typeof undefined); // Output: "undefined"
console.log(typeof null); // Output: "object"

console.log(null == undefined); // Output: true
console.log(null === undefined); // Output: false
```
