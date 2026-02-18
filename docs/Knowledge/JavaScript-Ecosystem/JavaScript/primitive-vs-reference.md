---
id: primitive-vs-reference
title: '[Medium] 📄 Primitive vs Reference Types'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Primitive Types and Reference Types?

> What are Primitive Types and Reference Types?

JavaScript data types can be grouped into two categories: **primitive types** and **reference types**.
They differ fundamentally in memory behavior and passing semantics.

### Primitive Types

**Characteristics**:

- Stored as direct values (commonly conceptualized in **stack**)
- Passed by **value copy**
- Immutable

**7 primitive types**:

```javascript
// 1. String
const str = 'hello';

// 2. Number
const num = 42;

// 3. Boolean
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol (ES6)
const sym = Symbol('unique');

// 7. BigInt (ES2020)
const bigInt = 9007199254740991n;
```

### Reference Types

**Characteristics**:

- Objects are allocated in **heap** memory
- Variables hold references (addresses)
- Mutable

**Examples**:

```javascript
// 1. Object
const obj = { name: 'John' };

// 2. Array
const arr = [1, 2, 3];

// 3. Function
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> Call by Value vs Call by Reference

### Call by Value (primitive behavior)

**Behavior**: value is copied; editing the copy does not affect the original.

```javascript
let a = 10;
let b = a; // copy value

b = 20;

console.log(a); // 10
console.log(b); // 20
```

**Memory diagram**:

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ <- independent value
├─────────┤
│ b: 20   │ <- independent value after copy/update
└─────────┘
```

### Reference behavior (objects)

**Behavior**: reference is copied; both variables can point to the same object.

```javascript
let obj1 = { name: 'John' };
let obj2 = obj1; // copy reference

obj2.name = 'Jane';

console.log(obj1.name); // 'Jane'
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true
```

**Memory diagram**:

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (same object)    │
└─────────┘                    └──────────────────┘
```

## 3. Common Quiz Questions

> Common quiz questions

### Question 1: passing primitive values

```javascript
function changeValue(x) {
  x = 100;
  console.log('Inside function x:', x);
}

let num = 50;
changeValue(num);
console.log('Outside function num:', num);
```

<details>
<summary>Click to view answer</summary>

```javascript
// Inside function x: 100
// Outside function num: 50
```

**Explanation:**

- `num` is primitive (`Number`)
- function argument gets a copied value
- changing `x` does not change `num`

```javascript
// flow
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50 (copy)
x = 100; // only x changes
console.log(num); // still 50
```

</details>

### Question 2: passing objects

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('Inside function obj.name:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('Outside function person.name:', person.name);
```

<details>
<summary>Click to view answer</summary>

```javascript
// Inside function obj.name: Changed
// Outside function person.name: Changed
```

**Explanation:**

- `person` is a reference type (`Object`)
- function argument copies the reference
- `obj` and `person` point to the same object

```javascript
// memory sketch
let person = { name: 'Original' }; // heap @0x001
changeObject(person); // obj -> @0x001
obj.name = 'Changed'; // mutate @0x001
console.log(person.name); // reads from @0x001
```

</details>

### Question 3: reassignment vs property mutation

```javascript
function test1(obj) {
  obj.name = 'Modified'; // mutate property
}

function test2(obj) {
  obj = { name: 'New Object' }; // reassign local parameter
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>Click to view answer</summary>

```javascript
// A: Modified
// B: Modified (not 'New Object')
```

**Explanation:**

**test1: property mutation**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // mutates original object
}
```

**test2: reassignment**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // changes only local binding
}
// person still points to original object
```

**Memory sketch**:

```text
// before test1
person ---> { name: 'Original' }
obj    ---> { name: 'Original' } (same)

// after test1
person ---> { name: 'Modified' }
obj    ---> { name: 'Modified' } (same)

// inside test2
person ---> { name: 'Modified' } (unchanged)
obj    ---> { name: 'New Object' } (new object)

// after test2
person ---> { name: 'Modified' }
// local obj is gone
```

</details>

### Question 4: array passing

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>Click to view answer</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**Explanation:**

- `modifyArray`: mutates original array
- `reassignArray`: only rebinds local parameter

</details>

### Question 5: equality comparison

```javascript
// primitives
let a = 10;
let b = 10;
console.log('A:', a === b);

// references
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>Click to view answer</summary>

```javascript
// A: true
// B: false
// C: true
```

**Explanation:**

Primitives compare by value; objects compare by reference.

```javascript
obj1 === obj2; // false (different references)
obj1 === obj3; // true (same reference)
```

</details>

## 4. Shallow Copy vs Deep Copy

> Shallow copy vs deep copy

### Shallow Copy

**Definition**: only top level is copied; nested objects remain shared references.

#### Method 1: spread operator

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

copy.name = 'Jane';
console.log(original.name); // 'John'

copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung' (affected)
```

#### Method 2: `Object.assign()`

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John'
```

#### Method 3: array shallow copy

```javascript
const arr1 = [1, 2, 3];

const arr2 = [...arr1];
const arr3 = arr1.slice();
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1
```

### Deep Copy

**Definition**: all levels are copied recursively.

#### Method 1: `JSON.parse(JSON.stringify(...))`

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming']
```

**Limitations**:

```javascript
const obj = {
  date: new Date(), // -> string
  func: () => {}, // ignored
  undef: undefined, // ignored
  symbol: Symbol('test'), // ignored
  regexp: /abc/, // -> {}
  circular: null, // circular reference throws
};
obj.circular = obj;

JSON.parse(JSON.stringify(obj)); // error or data loss
```

#### Method 2: `structuredClone()`

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

console.log(copy.date instanceof Date); // true
```

**Pros**:

- Supports Date, RegExp, Map, Set, etc.
- Supports circular references
- Usually better performance than manual deep clone

**Limitations**:

- Does not clone functions
- Does not clone Symbol values in all usage patterns

#### Method 3: recursive deep clone

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'
```

#### Method 4: Lodash

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### Shallow vs Deep comparison

| Feature | Shallow Copy | Deep Copy |
| ------- | ------------ | --------- |
| Copy depth | Top level only | All levels |
| Nested objects | Shared references | Fully independent |
| Performance | Faster | Slower |
| Memory use | Lower | Higher |
| Use case | Simple structures | Complex nested structures |

## 5. Common Pitfalls

> Common pitfalls

### Pitfall 1: expecting primitive args to mutate outer value

```javascript
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5

count = increment(count);
console.log(count); // 6
```

### Pitfall 2: expecting reassignment to replace outer object

```javascript
function resetObject(obj) {
  obj = { name: 'Reset' }; // local rebinding only
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original'

// correct approach 1: mutate property
function resetObject1(obj) {
  obj.name = 'Reset';
}

// correct approach 2: return new object
function resetObject2(obj) {
  return { name: 'Reset' };
}
person = resetObject2(person);
```

### Pitfall 3: assuming spread is deep copy

```javascript
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // shallow

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane'

const deep = structuredClone(original);
```

### Pitfall 4: misunderstanding `const`

```javascript
const obj = { name: 'John' };

// obj = { name: 'Jane' }; // TypeError

obj.name = 'Jane'; // allowed
obj.age = 30; // allowed

const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane';
console.log(immutableObj.name); // 'John'
```

### Pitfall 5: shared reference in loops

```javascript
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // same object reference each time
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]

const arr2 = [];
for (let i = 0; i < 3; i++) {
  arr2.push({ value: i }); // new object each iteration
}

console.log(arr2);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practices

> Best practices

### ✅ Recommended

```javascript
// 1. choose explicit copy strategy
const original = { name: 'John', age: 30 };

const copy1 = { ...original }; // shallow
const copy2 = structuredClone(original); // deep

// 2. avoid mutation side effects in functions
function addItem(arr, item) {
  return [...arr, item]; // immutable style
}

// 3. use const to prevent accidental rebinding
const config = { theme: 'dark' };

// 4. use Object.freeze for immutable constants
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ Avoid

```javascript
function increment(num) {
  num++; // ineffective for outer primitive
}

const copy = { ...nested }; // not deep copy

for (let i = 0; i < 3; i++) {
  arr.push(obj); // same object reference reused
}
```

## 7. Interview Summary

> Interview summary

### Quick memory

**Primitive**:

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- Passed by value
- Immutable

**Reference**:

- Object, Array, Function, Date, RegExp, etc.
- Variable stores reference to heap object
- Mutable

### Sample interview answer

**Q: Is JavaScript call-by-value or call-by-reference?**

> JavaScript is call-by-value for all arguments.
> For objects, the value being copied is the reference (memory address).
>
> - Primitive arguments: copying value does not affect outer variable.
> - Object arguments: copying reference allows mutation of the same object.
> - Reassigning the local parameter does not change the outer binding.

## Reference

- [MDN - Data Structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript.info - Object copy](https://javascript.info/object-copy)
