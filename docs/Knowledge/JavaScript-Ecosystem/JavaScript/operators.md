---
id: operators
title: '[Easy] 📄 JavaScript Operators'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. What is the difference between `==` and `===` ?

> What is the difference between `==` and `===`?

Both are comparison operators.
`==` compares values with type coercion, while `===` compares both value and type (strict equality).

Because of JavaScript coercion rules, `==` can produce surprising results:

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

This increases cognitive load, so in most cases `===` is recommended to avoid unexpected bugs.

**Best practice**: always use `===` and `!==`, unless you clearly know why `==` is needed.

### Interview Questions

#### Question 1: primitive comparison

Predict the result:

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**Answer:**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**Explanation:**

- **`==` (loose equality)** performs type coercion
  - `'1'` is converted to `1`
  - then it compares `1 == 1` -> `true`
- **`===` (strict equality)** does not perform coercion
  - `number` and `string` are different types -> `false`

**Coercion rules (common cases):**

```javascript
// == coercion priority examples
// 1. if one side is number, convert the other side to number
'1' == 1; // true
'2' == 2; // true
'0' == 0; // true

// 2. if one side is boolean, convert boolean to number
true == 1; // true
false == 0; // true
'1' == true; // true

// 3. string-to-number pitfalls
'' == 0; // true
' ' == 0; // true (whitespace string converts to 0)
```

#### Question 2: `null` vs `undefined`

Predict the result:

```javascript
undefined == null; // ?
undefined === null; // ?
```

**Answer:**

```javascript
undefined == null; // true
undefined === null; // false
```

**Explanation:**

This is a **special JavaScript rule**:

- **`undefined == null`** is `true`
  - the spec explicitly defines loose equality between them
  - this is one valid use case for `==`: checking both `null` and `undefined`
- **`undefined === null`** is `false`
  - different types, so strict equality fails

**Practical usage:**

```javascript
// check whether value is null or undefined
function isNullOrUndefined(value) {
  return value == null;
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// equivalent verbose form
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**Pitfalls:**

```javascript
// null and undefined are only loosely equal to each other
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// with ===, each only equals itself
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### Question 3: mixed comparisons

Predict the result:

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**Answer:**

```javascript
0 == false; // true (false -> 0)
0 === false; // false (number vs boolean)
'' == false; // true ('' -> 0, false -> 0)
'' === false; // false (string vs boolean)
null == false; // false (null only loosely equals null/undefined)
undefined == false; // false (undefined only loosely equals null/undefined)
```

**Conversion flow:**

```javascript
// 0 == false
0 == false;
0 == 0;
true;

// '' == false
'' == false;
'' == 0;
0 == 0;
true;

// null == false
null == false;
// null does not convert in this comparison path
false;
```

#### Question 4: object comparison

Predict the result:

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**Answer:**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**Explanation:**

- Objects (including arrays) are compared by **reference**, not by content.
- Two different object instances are never equal, even with the same content.
- For objects, `==` and `===` both compare references.

```javascript
// same reference -> equal
const arr1 = [];
const arr2 = arr1;
arr1 == arr2; // true
arr1 === arr2; // true

// same content but different instances -> not equal
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false
arr3 === arr4; // false

// same for objects
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### Quick interview memory

**`==` coercion rules (practical order):**

1. `null == undefined` -> `true` (special rule)
2. `number == string` -> convert string to number
3. `number == boolean` -> convert boolean to number
4. `string == boolean` -> both converted to number
5. Objects compare by reference

**`===` rules (simple):**

1. Different type -> `false`
2. Same type -> compare value (primitives) or reference (objects)

**Best practices:**

```javascript
// ✅ use === by default
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ one common exception: null/undefined check
if (value == null) {
  // value is null or undefined
}

// ❌ avoid == in general
if (value == 0) {
}
if (name == 'Alice') {
}
```

**Sample interview answer:**

> `==` performs type coercion and may produce surprising results, for example `0 == '0'` is `true`.
> `===` is strict equality, so type mismatch returns `false` directly.
>
> Best practice is to use `===` everywhere, except for `value == null` when intentionally checking both `null` and `undefined`.
>
> Also note: `null == undefined` is `true`, but `null === undefined` is `false`.

---

## 2. What is the difference between `&&` and `||` ? Please explain short-circuit evaluation

> What is the difference between `&&` and `||`? Explain short-circuit evaluation.

### Core idea

- **`&&` (AND)**: if the left side is `falsy`, return the left side immediately (right side is not evaluated)
- **`||` (OR)**: if the left side is `truthy`, return the left side immediately (right side is not evaluated)

### Short-circuit examples

```js
// && short-circuit
const user = null;
const name = user && user.name; // user is falsy, returns null, no user.name access
console.log(name); // null (no error)

// || short-circuit
const defaultName = 'Guest';
const userName = user || defaultName;
console.log(userName); // 'Guest'

// practical usage
function greet(name) {
  const displayName = name || 'Anonymous';
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### Common pitfall ⚠️

```js
// problem: 0 and '' are also falsy
const count = 0;
const result = count || 10; // returns 10
console.log(result); // 10 (possibly unintended)

// solution: use ??
const betterResult = count ?? 10; // only null/undefined fallback
console.log(betterResult); // 0
```

---

## 3. What is the `?.` (Optional Chaining) operator ?

> What is optional chaining `?.`?

### Problem scenario

Traditional access can throw errors:

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ risky: throws if address is missing
console.log(user.address.city); // ok
console.log(otherUser.address.city); // TypeError

// ✅ safe but verbose
const city = user && user.address && user.address.city;
```

### Optional chaining usage

```js
// ✅ concise and safe
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined (no error)

// for method calls
user?.getName?.();

// for arrays
const firstItem = users?.[0]?.name;
```

### Practical usage

```js
// API response handling
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Unknown User';
  const email = response?.data?.user?.email ?? 'No email';

  console.log(`User: ${userName}`);
  console.log(`Email: ${email}`);
}

// DOM access
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. What is the `??` (Nullish Coalescing) operator ?

> What is nullish coalescing `??`?

### Difference from `||`

```js
// || treats all falsy values as fallback triggers
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? only treats null and undefined as nullish
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### Practical usage

```js
// preserve valid 0 values
function updateScore(newScore) {
  const score = newScore ?? 100;
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// config defaults
const config = {
  timeout: 0, // valid config
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0
const retries = config.maxRetries ?? 3; // 3
```

### Combined usage

```js
// ?? and ?. are often used together
const userAge = user?.profile?.age ?? 18;

// form defaults
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0,
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. What is the difference between `i++` and `++i` ?

> What is the difference between `i++` and `++i`?

### Core difference

- **`i++` (postfix)**: return current value first, then increment
- **`++i` (prefix)**: increment first, then return new value

### Example

```js
let a = 5;
let b = a++; // b = 5, a = 6
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6
console.log(c, d); // 6, 6
```

### Practical impact

```js
// usually no difference in loops if return value isn't used
for (let i = 0; i < 5; i++) {}
for (let i = 0; i < 5; ++i) {}

// but there is difference inside expressions
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1
console.log(arr[++i]); // 3
```

### Best practice

```js
// ✅ clearer: split into steps
let count = 0;
const value = arr[count];
count++;

// ⚠️ less readable when overused
const value2 = arr[count++];
```

---

## 6. What is the Ternary Operator ? When should you use it ?

> What is the ternary operator? When should you use it?

### Syntax

```js
condition ? valueIfTrue : valueIfFalse;
```

### Simple example

```js
// if-else
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// ✅ ternary
const message2 = age >= 18 ? 'Adult' : 'Minor';
```

### Good use cases

```js
// 1. simple conditional assignment
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. JSX/template conditional rendering
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. defaulting with other operators
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Welcome, ${displayName}!` : `Hello, ${displayName}`;

// 4. function return value
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### Cases to avoid

```js
// ❌ deeply nested ternary hurts readability
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ clearer with if-else/switch
let result2;
if (condition1) result2 = value1;
else if (condition2) result2 = value2;
else if (condition3) result2 = value3;
else result2 = value4;

// ❌ complex business logic in ternary
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ split into readable steps
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess2 = isAdmin || hasReadPermission;
```

---

## Quick Cheat Sheet

| Operator            | Purpose                | Memory Tip |
| ------------------- | ---------------------- | ---------- |
| `===`               | Strict equality        | Use this by default, avoid `==` |
| `&&`                | Short-circuit AND      | Stop on left falsy |
| `\|\|`            | Short-circuit OR       | Stop on left truthy |
| `?.`                | Optional chaining      | Safe access without throwing |
| `??`                | Nullish coalescing     | Only null/undefined fallback |
| `++i` / `i++`       | Increment              | Prefix first, postfix after |
| `? :`               | Ternary operator       | Good for simple conditions only |

## Reference

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
