---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. What is `this` in JavaScript?

> What is `this` in JavaScript?

`this` is a keyword in JavaScript that points to the execution context object of a function.
The value of `this` depends on **how the function is called**, not where it is defined.

### `this` binding rules

There are four binding rules for `this` in JavaScript (highest to lowest priority):

1. **new binding**: function called with `new`
2. **explicit binding**: `call`, `apply`, or `bind` explicitly sets `this`
3. **implicit binding**: called as an object method
4. **default binding**: fallback behavior in other call sites

## 2. Please explain the difference of `this` in different contexts

> Explain how `this` behaves in different contexts.

### 1. `this` in global context

```javascript
console.log(this); // browser: window, Node.js: global

function globalFunction() {
  console.log(this); // non-strict: window/global, strict: undefined
}

globalFunction();
```

```javascript
'use strict';

function strictFunction() {
  console.log(this); // undefined
}

strictFunction();
```

### 2. `this` in regular functions

For regular functions, `this` depends on **call site**:

```javascript
function regularFunction() {
  console.log(this);
}

// direct call
regularFunction(); // window (non-strict) or undefined (strict)

// method call
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// call/apply/bind
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. `this` in arrow functions

**Arrow functions do not have their own `this`**.
They **inherit `this` from outer lexical scope**.

```javascript
const obj = {
  name: 'Object',

  // regular method
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // inner regular function: this changes
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // inner arrow function: this is inherited
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // arrow function as object property
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window/global lexical scope
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. `this` in object methods

```javascript
const person = {
  name: 'John',
  age: 30,

  // regular function: this -> person
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },

  // ES6 method shorthand: this -> person
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },

  // arrow function: this inherited from outer scope
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // usually undefined for name
  },
};

person.greet();
person.introduce();
person.arrowGreet();
```

### 5. `this` in constructor functions

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.greet = function () {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const john = new Person('John', 30);
john.greet();
console.log(john.name); // "John"
```

### 6. `this` in classes

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // regular method: this -> instance
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // arrow function class field: this permanently bound to instance
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// method extraction loses this
const greet = john.greet;
greet(); // error in strict mode

// arrow field keeps this
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Quiz: What will be printed?

> Quiz: what will the following code print?

### Question 1: object method vs arrow function

```javascript
const obj = {
  name: 'Object',
  regularFunc: function () {
    console.log('A:', this.name);
  },
  arrowFunc: () => {
    console.log('B:', this.name);
  },
};

obj.regularFunc();
obj.arrowFunc();
```

<details>
<summary>Click to view answer</summary>

```javascript
// A: Object
// B: undefined
```

**Explanation:**

- `regularFunc` is called as `obj.regularFunc()`, so `this` is `obj`
- `arrowFunc` has no own `this`; it inherits outer/global lexical `this`

</details>

### Question 2: passing function as argument

```javascript
const person = {
  name: 'John',
  greet: function () {
    console.log(`Hello, ${this.name}`);
  },
};

person.greet(); // 1

const greet = person.greet;
greet(); // 2

setTimeout(person.greet, 1000); // 3
```

<details>
<summary>Click to view answer</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" or error in strict mode
// 3: "Hello, undefined" or error in strict mode
```

**Explanation:**

1. `person.greet()` -> implicit binding, `this` is `person`
2. Extracted function call -> `this` is lost
3. Callback passed to `setTimeout` -> `this` is not `person`

</details>

### Question 3: nested functions

```javascript
const obj = {
  name: 'Outer',
  method: function () {
    console.log('A:', this.name);

    function inner() {
      console.log('B:', this.name);
    }
    inner();

    const arrow = () => {
      console.log('C:', this.name);
    };
    arrow();
  },
};

obj.method();
```

<details>
<summary>Click to view answer</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**Explanation:**

- `A`: `method` is called by `obj`
- `B`: `inner` is a regular direct call
- `C`: arrow function inherits outer `method` `this`

</details>

### Question 4: `setTimeout` and arrow function

```javascript
const obj = {
  name: 'Object',

  method1: function () {
    setTimeout(function () {
      console.log('A:', this.name);
    }, 100);
  },

  method2: function () {
    setTimeout(() => {
      console.log('B:', this.name);
    }, 100);
  },
};

obj.method1();
obj.method2();
```

<details>
<summary>Click to view answer</summary>

```javascript
// A: undefined
// B: Object
```

**Explanation:**

- `A`: regular callback in `setTimeout` loses method context
- `B`: arrow callback inherits `this` from `method2`

</details>

### Question 5: complex `this` binding

```javascript
const obj1 = {
  name: 'obj1',
  getThis: function () {
    return this;
  },
};

const obj2 = {
  name: 'obj2',
};

console.log('A:', obj1.getThis().name);

const getThis = obj1.getThis;
console.log('B:', getThis() === window); // browser assumption

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>Click to view answer</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**Explanation:**

- `A`: called from `obj1`
- `B`: direct call uses default binding (window in browser non-strict)
- `C`: called from `obj2`
- `D`: explicitly bound with `bind(obj2)`

</details>

### Question 6: constructor and prototype

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log(`Hello, I'm ${this.name}`);
};

Person.prototype.delayedGreet = function () {
  setTimeout(function () {
    console.log('A:', this.name);
  }, 100);
};

Person.prototype.arrowDelayedGreet = function () {
  setTimeout(() => {
    console.log('B:', this.name);
  }, 100);
};

const john = new Person('John');
john.delayedGreet();
john.arrowDelayedGreet();
```

<details>
<summary>Click to view answer</summary>

```javascript
// A: undefined
// B: John
```

**Explanation:**

- `A`: regular timeout callback uses default/global binding
- `B`: arrow timeout callback inherits instance `this`

</details>

### Question 7: global variable vs object property

```javascript
var name = 'jjjj';

var obj = {
  a: function () {
    name = 'john';
    console.log(this.name);
  },
};

obj.a();
```

<details>
<summary>Click to view answer</summary>

```javascript
// undefined
```

**Explanation:**

The key is the difference between **global variables** and **object properties**.

1. `this` in `obj.a()` points to `obj`
2. `name = 'john'` (without declaration) updates the global variable
3. `this.name` reads `obj.name`
4. `obj` has no `name` property, so it is `undefined`

**Execution flow:**

```javascript
// initial
window.name = 'jjjj';
obj = {
  a: function () {
    /* ... */
  },
  // obj has no name property
};

obj.a();
  ↓
window.name = 'john'; // global value changed
this.name; // equals obj.name
obj.name; // undefined
```

If you want `'john'`, assign via `this.name = 'john'`.

```javascript
var obj = {
  a: function () {
    this.name = 'john';
    console.log(this.name); // 'john'
  },
};

obj.a();
console.log(obj.name); // 'john'
```

</details>

### Question 8: global variable trap (extended)

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified';
    console.log('1:', name); // global variable
    console.log('2:', this.name); // object property
  },
};

obj.a();
console.log('3:', name); // global variable
console.log('4:', obj.name); // object property
```

<details>
<summary>Click to view answer</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**Key point:**

- `name` without `this.` -> global variable
- `this.name` -> object property
- They are different values

</details>

## 4. How to preserve `this` in callbacks?

> How to preserve `this` inside callback functions?

### Method 1: arrow function

```javascript
const obj = {
  name: 'Object',

  method: function () {
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Method 2: `bind()`

```javascript
const obj = {
  name: 'Object',

  method: function () {
    setTimeout(
      function () {
        console.log(this.name); // "Object"
      }.bind(this),
      1000
    );
  },
};

obj.method();
```

### Method 3: store `this` in variable (legacy pattern)

```javascript
const obj = {
  name: 'Object',

  method: function () {
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Method 4: `call()` / `apply()`

```javascript
function greet() {
  console.log(`Hello, I'm ${this.name}`);
}

const person1 = { name: 'John' };
const person2 = { name: 'Jane' };

greet.call(person1); // "Hello, I'm John"
greet.apply(person2); // "Hello, I'm Jane"
```

## 5. Common `this` pitfalls

> Common `this` pitfalls

### Pitfall 1: extracting object method

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ this lost

const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### Pitfall 2: `this` in event listeners

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ arrow function here does not bind to button
  handleClick1: () => {
    console.log(this); // window/global lexical
  },

  // ✅ regular function in listener gets event target as this
  handleClick2: function () {
    console.log(this); // button element
  },

  // ✅ use arrow wrapper when you need object this inside callback
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### Pitfall 3: callback in array methods

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ regular callback loses this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item);
    });
  },

  // ✅ arrow callback keeps lexical this
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item);
    });
  },

  // ✅ use thisArg
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item);
    }, this);
  },
};
```

## 6. `this` binding rules summary

> Summary of `this` binding rules

### Priority (high -> low)

```javascript
// 1. new binding (highest)
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. explicit binding (call/apply/bind)
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. implicit binding (object method)
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. default binding (lowest)
greet(); // undefined (strict) or global name (non-strict)
```

### Function vs Arrow Function

| Feature | Function | Arrow Function |
| --- | --- | --- |
| Has its own `this` | ✅ Yes | ❌ No |
| `this` determined by | Call site | Lexical definition scope |
| `call`/`apply`/`bind` can change `this` | ✅ Yes | ❌ No |
| Can be constructor | ✅ Yes | ❌ No |
| Has `arguments` | ✅ Yes | ❌ No |
| Best for | Object methods, constructors | Callbacks, inherited outer `this` |

### Memory phrase

> **“Arrow inherits, function depends on call.”**
>
> - Arrow function: `this` is inherited from outer lexical scope
> - Regular function: `this` is decided at runtime by call site

## 7. Best practices

> Best practices

### ✅ Recommended

```javascript
// 1. Use regular function or method shorthand for object methods
const obj = {
  name: 'Object',

  // ✅ good
  greet: function () {
    console.log(this.name);
  },

  // ✅ good
  introduce() {
    console.log(this.name);
  },
};

// 2. Use arrow functions for callbacks that should keep outer this
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. Use regular function when dynamic this is needed
const button = {
  label: 'Click me',

  handleClick: function () {
    console.log(this); // event target / receiver object
  },
};
```

### ❌ Not recommended

```javascript
// 1. Avoid arrow function as object methods
const obj = {
  name: 'Object',

  greet: () => {
    console.log(this.name); // undefined in most cases
  },
};

// 2. Avoid arrow function as constructor
const Person = (name) => {
  this.name = name; // wrong
};

// 3. Avoid arrow when you need arguments object
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Reference

- [MDN - this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
