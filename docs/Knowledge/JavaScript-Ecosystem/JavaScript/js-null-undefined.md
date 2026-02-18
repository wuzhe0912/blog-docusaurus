---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Key Differences

- **`undefined`**：
  - Indicates a variable has been declared but not assigned.
  - It is the default value for uninitialized variables.
  - A function returns `undefined` if no explicit return value is provided.
- **`null`**：
  - Represents an empty value or no value.
  - Usually assigned explicitly as `null`.
  - Used to indicate a variable intentionally points to nothing.

## Example

```js
let x;
console.log(x); // output: undefined

function foo() {}
console.log(foo()); // output: undefined

let y = null;
console.log(y); // output: null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // output: null
```

## Validation with `typeof`

```js
console.log(typeof undefined); // output: "undefined"
console.log(typeof null); // output: "object"

console.log(null == undefined); // output: true
console.log(null === undefined); // output: false
```
