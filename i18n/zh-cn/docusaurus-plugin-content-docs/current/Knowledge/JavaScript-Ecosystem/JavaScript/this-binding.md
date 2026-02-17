---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. What is `this` in JavaScript?

> JavaScript 中的 `this` 是什么？

`this` 是 JavaScript 中的一个关键字，它指向函数执行时的上下文对象。`this` 的值取决于**函数如何被调用**，而不是在哪里定义。

### `this` 的绑定规则

JavaScript 中 `this` 的绑定有四种规则（按优先级从高到低）：

1. **new 绑定**：使用 `new` 关键字调用构造函数
2. **显式绑定**：使用 `call`、`apply`、`bind` 明确指定 `this`
3. **隐式绑定**：通过对象方法调用
4. **默认绑定**：其他情况下的默认行为

## 2. Please explain the difference of `this` in different contexts

> 请解释 `this` 在不同情境下的差异

### 1. 全局环境中的 `this`

```javascript
console.log(this); // 浏览器：window，Node.js：global

function globalFunction() {
  console.log(this); // 非严格模式：window/global，严格模式：undefined
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

### 2. 普通函数（Function）中的 `this`

普通函数的 `this` 取决于**调用方式**：

```javascript
function regularFunction() {
  console.log(this);
}

// 直接调用：this 指向全局对象（非严格模式）或 undefined（严格模式）
regularFunction(); // window (非严格模式) 或 undefined (严格模式)

// 作为对象方法调用：this 指向该对象
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// 使用 call/apply/bind：this 指向指定的对象
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. 箭头函数（Arrow Function）中的 `this`

**箭头函数没有自己的 `this`**，它会**继承外层作用域的 `this`**（词法作用域）。

```javascript
const obj = {
  name: 'Object',

  // 普通函数
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // 内部普通函数：this 会改变
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // 内部箭头函数：this 继承外层
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // 箭头函数
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window（继承全局）
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. 对象方法中的 `this`

```javascript
const person = {
  name: 'John',
  age: 30,

  // 普通函数：this 指向 person
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },

  // ES6 简写方法：this 指向 person
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },

  // 箭头函数：this 继承外层（这里是全局）
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm undefined"
  },
};

person.greet(); // "Hello, I'm John"
person.introduce(); // "I'm John, 30 years old"
person.arrowGreet(); // "Hello, I'm undefined"
```

### 5. 构造函数中的 `this`

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.greet = function () {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const john = new Person('John', 30);
john.greet(); // "Hello, I'm John"
console.log(john.name); // "John"
```

### 6. Class 中的 `this`

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // 普通方法：this 指向实例
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // 箭头函数属性：this 绑定到实例
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// 方法赋值给变量会失去 this 绑定
const greet = john.greet;
greet(); // 错误：Cannot read property 'name' of undefined

// 箭头函数属性不会失去 this 绑定
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Quiz: What will be printed?

> 测验题：以下代码会打印什么？

### 题目 1：对象方法与箭头函数

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
<summary>点击查看答案</summary>

```javascript
// A: Object
// B: undefined
```

**解释**：
- `regularFunc` 是普通函数，通过 `obj.regularFunc()` 调用，`this` 指向 `obj`，所以打印 `"A: Object"`
- `arrowFunc` 是箭头函数，没有自己的 `this`，继承外层（全局）的 `this`，全局没有 `name` 属性，所以打印 `"B: undefined"`

</details>

### 题目 2：函数作为参数传递

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
<summary>点击查看答案</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" 或错误（严格模式）
// 3: "Hello, undefined" 或错误（严格模式）
```

**解释**：
1. `person.greet()` - 通过对象调用，`this` 指向 `person`
2. `greet()` - 将方法赋值给变量后直接调用，`this` 丢失，指向全局或 `undefined`
3. `setTimeout(person.greet, 1000)` - 方法作为回调函数传递，`this` 丢失

</details>

### 题目 3：嵌套函数

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
<summary>点击查看答案</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**解释**：
- `A` - `method` 通过 `obj` 调用，`this` 指向 `obj`
- `B` - `inner` 是普通函数，直接调用，`this` 指向全局或 `undefined`
- `C` - `arrow` 是箭头函数，继承外层 `method` 的 `this`，指向 `obj`

</details>

### 题目 4：setTimeout 与箭头函数

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
<summary>点击查看答案</summary>

```javascript
// A: undefined
// B: Object
```

**解释**：
- `A` - `setTimeout` 的回调是普通函数，执行时 `this` 指向全局
- `B` - `setTimeout` 的回调是箭头函数，继承外层 `method2` 的 `this`，指向 `obj`

</details>

### 题目 5：复杂的 this 绑定

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
console.log('B:', getThis() === window); // 假设在浏览器环境

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>点击查看答案</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**解释**：
- `A` - 通过 `obj1` 调用，`this` 指向 `obj1`
- `B` - 直接调用，`this` 指向全局（window）
- `C` - 通过 `obj2` 调用，`this` 指向 `obj2`
- `D` - 使用 `bind` 绑定 `this` 为 `obj2`

</details>

### 题目 6：构造函数与原型

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
<summary>点击查看答案</summary>

```javascript
// A: undefined
// B: John
```

**解释**：
- `A` - `setTimeout` 的普通函数回调，`this` 指向全局
- `B` - `setTimeout` 的箭头函数回调，继承外层 `arrowDelayedGreet` 的 `this`，指向 `john`

</details>

### 题目 7：全局变量 vs 对象属性

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
<summary>点击查看答案</summary>

```javascript
// undefined
```

**解释**：

这道题的关键在于理解**全局变量**和**对象属性**的差异：

1. **`obj.a()` 的 `this` 指向**：
   - 通过 `obj.a()` 调用，`this` 指向 `obj`

2. **`name = 'john'` 修改的是全局变量**：
   ```javascript
   name = 'john'; // 没有 var/let/const，修改全局 name
   // 等同于
   window.name = 'john'; // 浏览器环境
   ```

3. **`this.name` 访问的是对象属性**：
   ```javascript
   console.log(this.name); // 等同于 console.log(obj.name)
   ```

4. **`obj` 对象没有 `name` 属性**：
   ```javascript
   obj.name; // undefined（obj 对象内没有定义 name）
   ```

**完整执行过程**：

```javascript
// 初始状态
window.name = 'jjjj'; // 全局变量
obj = {
  a: function () { /* ... */ },
  // 注意：obj 没有 name 属性！
};

// 执行 obj.a()
obj.a();
  ↓
// 1. name = 'john' → 修改全局 window.name
window.name = 'john'; // ✅ 全局变量被修改

// 2. this.name → 访问 obj.name
this.name; // 等于 obj.name
obj.name; // undefined（obj 没有 name 属性）
```

**常见误解**：

很多人以为会打印 `'john'`，因为：
- ❌ 误以为 `name = 'john'` 会给 `obj` 增加属性
- ❌ 误以为 `this.name` 会访问全局变量

**正确理解**：
- ✅ `name = 'john'` 只修改全局变量，不影响 `obj`
- ✅ `this.name` 访问的是 `obj.name`，而非全局 `name`

**如果要打印 `'john'`，应该这样写**：

```javascript
var obj = {
  a: function () {
    this.name = 'john'; // ✅ 给 obj 增加 name 属性
    console.log(this.name); // 'john'
  },
};

obj.a(); // 打印 'john'
console.log(obj.name); // 'john'
```

</details>

### 题目 8：全局变量陷阱（延伸）

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified'; // 注意：没有 var/let/const
    console.log('1:', name); // 访问全局变量
    console.log('2:', this.name); // 访问对象属性
  },
};

obj.a();
console.log('3:', name); // 全局变量
console.log('4:', obj.name); // 对象属性
```

<details>
<summary>点击查看答案</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**解释**：

```javascript
// 初始状态
window.name = 'global'; // 全局变量
obj.name = 'object'; // 对象属性

// 执行 obj.a()
name = 'modified'; // 修改全局 window.name

console.log('1:', name); // 访问全局：'modified'
console.log('2:', this.name); // 访问 obj.name：'object'

// 执行完毕后
console.log('3:', name); // 全局：'modified'
console.log('4:', obj.name); // 对象：'object'（未被修改）
```

**关键概念**：
- `name`（没有 `this.`）→ 访问全局变量
- `this.name`（有 `this.`）→ 访问对象属性
- 两者是**完全不同的变量**！

</details>

## 4. How to preserve `this` in callbacks?

> 如何在回调函数中保留 `this`？

### 方法 1：使用箭头函数

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ 箭头函数会继承外层的 this
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### 方法 2：使用 `bind()`

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ bind 绑定 this
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

### 方法 3：保存 `this` 到变量（旧方法）

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ 将 this 保存到变量
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### 方法 4：使用 `call()` 或 `apply()`

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

> 常见的 `this` 陷阱

### 陷阱 1：对象方法赋值给变量

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ undefined（this 丢失）

// 解决方法：使用 bind
const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### 陷阱 2：事件监听器中的 `this`

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ 箭头函数：this 不指向 button
  handleClick1: () => {
    console.log(this); // window
  },

  // ✅ 普通函数：this 指向触发事件的元素
  handleClick2: function () {
    console.log(this); // button 元素
  },

  // ✅ 如果需要访问对象的 this，使用箭头函数包装
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### 陷阱 3：数组方法中的回调

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ 普通函数回调会失去 this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // undefined 1, undefined 2, undefined 3
    });
  },

  // ✅ 箭头函数回调保留 this
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    });
  },

  // ✅ 使用 forEach 的 thisArg 参数
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    }, this); // 第二个参数指定 this
  },
};
```

## 6. `this` binding rules summary

> `this` 绑定规则总结

### 优先级（从高到低）

```javascript
// 1. new 绑定（最高优先级）
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. 显式绑定（call/apply/bind）
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. 隐式绑定（对象方法）
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. 默认绑定（最低优先级）
greet(); // undefined（严格模式）或 window.name
```

### Function vs Arrow Function 比较表

| 特性 | Function | Arrow Function |
| --- | --- | --- |
| 有自己的 `this` | ✅ 有 | ❌ 没有 |
| `this` 取决于 | 调用方式 | 定义位置（词法作用域）|
| 可用 `call`/`apply`/`bind` 改变 `this` | ✅ 可以 | ❌ 不可以 |
| 可作为构造函数 | ✅ 可以 | ❌ 不可以 |
| 有 `arguments` 对象 | ✅ 有 | ❌ 没有 |
| 适合场景 | 对象方法、构造函数 | 回调函数、需要继承外层 this |

### 记忆口诀

> **「箭头继承，函数调用」**
>
> - **箭头函数**：`this` 继承外层作用域，定义时就决定
> - **普通函数**：`this` 取决于调用方式，执行时才决定

## 7. Best practices

> 最佳实践

### ✅ 推荐做法

```javascript
// 1. 对象方法使用普通函数或 ES6 方法简写
const obj = {
  name: 'Object',

  // ✅ 好：普通函数
  greet: function () {
    console.log(this.name);
  },

  // ✅ 好：ES6 简写
  introduce() {
    console.log(this.name);
  },
};

// 2. 回调函数使用箭头函数
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    // ✅ 好：箭头函数保留 this
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. 需要动态 this 时使用普通函数
const button = {
  label: 'Click me',

  // ✅ 好：需要访问 DOM 元素的 this
  handleClick: function () {
    console.log(this); // button DOM 元素
  },
};
```

### ❌ 不推荐做法

```javascript
// 1. 对象方法不要使用箭头函数
const obj = {
  name: 'Object',

  // ❌ 坏：this 不指向 obj
  greet: () => {
    console.log(this.name); // undefined
  },
};

// 2. 构造函数不要使用箭头函数
// ❌ 坏：箭头函数不能作为构造函数
const Person = (name) => {
  this.name = name; // 错误！
};

// 3. 需要访问 arguments 时不要使用箭头函数
// ❌ 坏：箭头函数没有 arguments
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Reference

- [MDN - this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
