---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. What is `this` in JavaScript?

> JavaScript 中的 `this` 是什麼？

`this` 是 JavaScript 中的一個關鍵字，它指向函式執行時的上下文物件。`this` 的值取決於**函式如何被呼叫**，而不是在哪裡定義。

### `this` 的綁定規則

JavaScript 中 `this` 的綁定有四種規則（按優先級從高到低）：

1. **new 綁定**：使用 `new` 關鍵字呼叫建構函式
2. **顯式綁定**：使用 `call`、`apply`、`bind` 明確指定 `this`
3. **隱式綁定**：透過物件方法呼叫
4. **預設綁定**：其他情況下的預設行為

## 2. Please explain the difference of `this` in different contexts

> 請解釋 `this` 在不同情境下的差異

### 1. 全域環境中的 `this`

```javascript
console.log(this); // 瀏覽器：window，Node.js：global

function globalFunction() {
  console.log(this); // 非嚴格模式：window/global，嚴格模式：undefined
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

### 2. 一般函式（Function）中的 `this`

一般函式的 `this` 取決於**呼叫方式**：

```javascript
function regularFunction() {
  console.log(this);
}

// 直接呼叫：this 指向全域物件（非嚴格模式）或 undefined（嚴格模式）
regularFunction(); // window (非嚴格模式) 或 undefined (嚴格模式)

// 作為物件方法呼叫：this 指向該物件
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// 使用 call/apply/bind：this 指向指定的物件
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. 箭頭函式（Arrow Function）中的 `this`

**箭頭函式沒有自己的 `this`**，它會**繼承外層作用域的 `this`**（詞法作用域）。

```javascript
const obj = {
  name: 'Object',
  
  // 一般函式
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj
    
    // 內部一般函式：this 會改變
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();
    
    // 內部箭頭函式：this 繼承外層
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },
  
  // 箭頭函式
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window（繼承全域）
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. 物件方法中的 `this`

```javascript
const person = {
  name: 'John',
  age: 30,
  
  // 一般函式：this 指向 person
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },
  
  // ES6 簡寫方法：this 指向 person
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },
  
  // 箭頭函式：this 繼承外層（這裡是全域）
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm undefined"
  },
};

person.greet(); // "Hello, I'm John"
person.introduce(); // "I'm John, 30 years old"
person.arrowGreet(); // "Hello, I'm undefined"
```

### 5. 建構函式中的 `this`

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
  
  // 一般方法：this 指向實例
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
  
  // 箭頭函式屬性：this 綁定到實例
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// 方法賦值給變數會失去 this 綁定
const greet = john.greet;
greet(); // 錯誤：Cannot read property 'name' of undefined

// 箭頭函式屬性不會失去 this 綁定
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Quiz: What will be printed?

> 測驗題：以下程式碼會印出什麼？

### 題目 1：物件方法與箭頭函式

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
<summary>點擊查看答案</summary>

```javascript
// A: Object
// B: undefined
```

**解釋**：
- `regularFunc` 是一般函式，透過 `obj.regularFunc()` 呼叫，`this` 指向 `obj`，所以印出 `"A: Object"`
- `arrowFunc` 是箭頭函式，沒有自己的 `this`，繼承外層（全域）的 `this`，全域沒有 `name` 屬性，所以印出 `"B: undefined"`

</details>

### 題目 2：函式作為參數傳遞

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
<summary>點擊查看答案</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" 或錯誤（嚴格模式）
// 3: "Hello, undefined" 或錯誤（嚴格模式）
```

**解釋**：
1. `person.greet()` - 透過物件呼叫，`this` 指向 `person`
2. `greet()` - 將方法賦值給變數後直接呼叫，`this` 丟失，指向全域或 `undefined`
3. `setTimeout(person.greet, 1000)` - 方法作為回呼函式傳遞，`this` 丟失

</details>

### 題目 3：巢狀函式

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
<summary>點擊查看答案</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**解釋**：
- `A` - `method` 透過 `obj` 呼叫，`this` 指向 `obj`
- `B` - `inner` 是一般函式，直接呼叫，`this` 指向全域或 `undefined`
- `C` - `arrow` 是箭頭函式，繼承外層 `method` 的 `this`，指向 `obj`

</details>

### 題目 4：setTimeout 與箭頭函式

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
<summary>點擊查看答案</summary>

```javascript
// A: undefined
// B: Object
```

**解釋**：
- `A` - `setTimeout` 的回呼是一般函式，執行時 `this` 指向全域
- `B` - `setTimeout` 的回呼是箭頭函式，繼承外層 `method2` 的 `this`，指向 `obj`

</details>

### 題目 5：複雜的 this 綁定

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
console.log('B:', getThis() === window); // 假設在瀏覽器環境

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>點擊查看答案</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**解釋**：
- `A` - 透過 `obj1` 呼叫，`this` 指向 `obj1`
- `B` - 直接呼叫，`this` 指向全域（window）
- `C` - 透過 `obj2` 呼叫，`this` 指向 `obj2`
- `D` - 使用 `bind` 綁定 `this` 為 `obj2`

</details>

### 題目 6：建構函式與原型

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
<summary>點擊查看答案</summary>

```javascript
// A: undefined
// B: John
```

**解釋**：
- `A` - `setTimeout` 的一般函式回呼，`this` 指向全域
- `B` - `setTimeout` 的箭頭函式回呼，繼承外層 `arrowDelayedGreet` 的 `this`，指向 `john`

</details>

### 題目 7：全域變數 vs 物件屬性

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
<summary>點擊查看答案</summary>

```javascript
// undefined
```

**解釋**：

這題的關鍵在於理解**全域變數**和**物件屬性**的差異：

1. **`obj.a()` 的 `this` 指向**：
   - 透過 `obj.a()` 呼叫，`this` 指向 `obj`

2. **`name = 'john'` 修改的是全域變數**：
   ```javascript
   name = 'john'; // 沒有 var/let/const，修改全域 name
   // 等同於
   window.name = 'john'; // 瀏覽器環境
   ```

3. **`this.name` 訪問的是物件屬性**：
   ```javascript
   console.log(this.name); // 等同於 console.log(obj.name)
   ```

4. **`obj` 物件沒有 `name` 屬性**：
   ```javascript
   obj.name; // undefined（obj 物件內沒有定義 name）
   ```

**完整執行過程**：

```javascript
// 初始狀態
window.name = 'jjjj'; // 全域變數
obj = {
  a: function () { /* ... */ },
  // 注意：obj 沒有 name 屬性！
};

// 執行 obj.a()
obj.a();
  ↓
// 1. name = 'john' → 修改全域 window.name
window.name = 'john'; // ✅ 全域變數被修改

// 2. this.name → 訪問 obj.name
this.name; // 等於 obj.name
obj.name; // undefined（obj 沒有 name 屬性）
```

**常見誤解**：

很多人以為會印出 `'john'`，因為：
- ❌ 誤以為 `name = 'john'` 會給 `obj` 增加屬性
- ❌ 誤以為 `this.name` 會訪問全域變數

**正確理解**：
- ✅ `name = 'john'` 只修改全域變數，不影響 `obj`
- ✅ `this.name` 訪問的是 `obj.name`，而非全域 `name`

**如果要印出 `'john'`，應該這樣寫**：

```javascript
var obj = {
  a: function () {
    this.name = 'john'; // ✅ 給 obj 增加 name 屬性
    console.log(this.name); // 'john'
  },
};

obj.a(); // 印出 'john'
console.log(obj.name); // 'john'
```

</details>

### 題目 8：全域變數陷阱（延伸）

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified'; // 注意：沒有 var/let/const
    console.log('1:', name); // 訪問全域變數
    console.log('2:', this.name); // 訪問物件屬性
  },
};

obj.a();
console.log('3:', name); // 全域變數
console.log('4:', obj.name); // 物件屬性
```

<details>
<summary>點擊查看答案</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**解釋**：

```javascript
// 初始狀態
window.name = 'global'; // 全域變數
obj.name = 'object'; // 物件屬性

// 執行 obj.a()
name = 'modified'; // 修改全域 window.name

console.log('1:', name); // 訪問全域：'modified'
console.log('2:', this.name); // 訪問 obj.name：'object'

// 執行完畢後
console.log('3:', name); // 全域：'modified'
console.log('4:', obj.name); // 物件：'object'（未被修改）
```

**關鍵概念**：
- `name`（沒有 `this.`）→ 訪問全域變數
- `this.name`（有 `this.`）→ 訪問物件屬性
- 兩者是**完全不同的變數**！

</details>

## 4. How to preserve `this` in callbacks?

> 如何在回呼函式中保留 `this`？

### 方法 1：使用箭頭函式

```javascript
const obj = {
  name: 'Object',
  
  method: function () {
    // ✅ 箭頭函式會繼承外層的 this
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
    // ✅ bind 綁定 this
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

### 方法 3：儲存 `this` 到變數（舊方法）

```javascript
const obj = {
  name: 'Object',
  
  method: function () {
    // ✅ 將 this 儲存到變數
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

> 常見的 `this` 陷阱

### 陷阱 1：物件方法賦值給變數

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ undefined（this 丟失）

// 解決方法：使用 bind
const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### 陷阱 2：事件監聽器中的 `this`

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',
  
  // ❌ 箭頭函式：this 不指向 button
  handleClick1: () => {
    console.log(this); // window
  },
  
  // ✅ 一般函式：this 指向觸發事件的元素
  handleClick2: function () {
    console.log(this); // button 元素
  },
  
  // ✅ 如果需要存取物件的 this，使用箭頭函式包裝
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### 陷阱 3：陣列方法中的回呼

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],
  
  // ❌ 一般函式回呼會失去 this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // undefined 1, undefined 2, undefined 3
    });
  },
  
  // ✅ 箭頭函式回呼保留 this
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    });
  },
  
  // ✅ 使用 forEach 的 thisArg 參數
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    }, this); // 第二個參數指定 this
  },
};
```

## 6. `this` binding rules summary

> `this` 綁定規則總結

### 優先級（從高到低）

```javascript
// 1. new 綁定（最高優先級）
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. 顯式綁定（call/apply/bind）
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. 隱式綁定（物件方法）
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. 預設綁定（最低優先級）
greet(); // undefined（嚴格模式）或 window.name
```

### Function vs Arrow Function 比較表

| 特性 | Function | Arrow Function |
| --- | --- | --- |
| 有自己的 `this` | ✅ 有 | ❌ 沒有 |
| `this` 取決於 | 呼叫方式 | 定義位置（詞法作用域）|
| 可用 `call`/`apply`/`bind` 改變 `this` | ✅ 可以 | ❌ 不可以 |
| 可作為建構函式 | ✅ 可以 | ❌ 不可以 |
| 有 `arguments` 物件 | ✅ 有 | ❌ 沒有 |
| 適合場景 | 物件方法、建構函式 | 回呼函式、需要繼承外層 this |

### 記憶口訣

> **「箭頭繼承，函式呼叫」**
>
> - **箭頭函式**：`this` 繼承外層作用域，定義時就決定
> - **一般函式**：`this` 取決於呼叫方式，執行時才決定

## 7. Best practices

> 最佳實踐

### ✅ 推薦做法

```javascript
// 1. 物件方法使用一般函式或 ES6 方法簡寫
const obj = {
  name: 'Object',
  
  // ✅ 好：一般函式
  greet: function () {
    console.log(this.name);
  },
  
  // ✅ 好：ES6 簡寫
  introduce() {
    console.log(this.name);
  },
};

// 2. 回呼函式使用箭頭函式
class Component {
  constructor() {
    this.name = 'Component';
  }
  
  mount() {
    // ✅ 好：箭頭函式保留 this
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. 需要動態 this 時使用一般函式
const button = {
  label: 'Click me',
  
  // ✅ 好：需要存取 DOM 元素的 this
  handleClick: function () {
    console.log(this); // button DOM 元素
  },
};
```

### ❌ 不推薦做法

```javascript
// 1. 物件方法不要使用箭頭函式
const obj = {
  name: 'Object',
  
  // ❌ 壞：this 不指向 obj
  greet: () => {
    console.log(this.name); // undefined
  },
};

// 2. 建構函式不要使用箭頭函式
// ❌ 壞：箭頭函式不能作為建構函式
const Person = (name) => {
  this.name = name; // 錯誤！
};

// 3. 需要存取 arguments 時不要使用箭頭函式
// ❌ 壞：箭頭函式沒有 arguments
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Reference

- [MDN - this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)

