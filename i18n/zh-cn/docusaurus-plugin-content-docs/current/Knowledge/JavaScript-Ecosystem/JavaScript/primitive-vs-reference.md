---
id: primitive-vs-reference
title: '[Medium] 📄 Primitive vs Reference Types'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Primitive Types and Reference Types?

> 什么是原始类型（Primitive Types）和引用类型（Reference Types）？

JavaScript 的数据类型分为两大类：**原始类型**和**引用类型**。它们在内存存储方式和传递行为上有本质的差异。

### 原始类型（Primitive Types）

**特点**：

- 存储在**栈（Stack）**中
- 传递时**复制值本身**（Call by Value）
- 不可变的（Immutable）

**包含 7 种**：

```javascript
// 1. String（字符串）
const str = 'hello';

// 2. Number（数字）
const num = 42;

// 3. Boolean（布尔值）
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol（ES6）
const sym = Symbol('unique');

// 7. BigInt（ES2020）
const bigInt = 9007199254740991n;
```

### 引用类型（Reference Types）

**特点**：

- 存储在**堆（Heap）**中
- 传递时**复制引用（内存地址）**（Call by Reference）
- 可变的（Mutable）

**包含**：

```javascript
// 1. Object（对象）
const obj = { name: 'John' };

// 2. Array（数组）
const arr = [1, 2, 3];

// 3. Function（函数）
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

> 传值（Call by Value）vs 传址（Call by Reference）

### 传值（Call by Value）- 原始类型

**行为**：复制值本身，修改副本不影响原值。

```javascript
// 原始类型：传值
let a = 10;
let b = a; // 复制值

b = 20; // 修改 b

console.log(a); // 10（不受影响）
console.log(b); // 20
```

**内存示意图**：

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ ← 独立的值
├─────────┤
│ b: 20   │ ← 独立的值（复制后修改）
└─────────┘
```

### 传址（Call by Reference）- 引用类型

**行为**：复制内存地址，两个变量指向同一个对象。

```javascript
// 引用类型：传址
let obj1 = { name: 'John' };
let obj2 = obj1; // 复制内存地址

obj2.name = 'Jane'; // 通过 obj2 修改

console.log(obj1.name); // 'Jane'（被影响！）
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true（指向同一个对象）
```

**内存示意图**：

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (同一个对象)     │
└─────────┘                    └──────────────────┘
```

## 3. Common Quiz Questions

> 常见测验题

### 题目 1：原始类型的传递

```javascript
function changeValue(x) {
  x = 100;
  console.log('函数内 x:', x);
}

let num = 50;
changeValue(num);
console.log('函数外 num:', num);
```

<details>
<summary>点击查看答案</summary>

```javascript
// 函数内 x: 100
// 函数外 num: 50
```

**解释**：

- `num` 是原始类型（Number）
- 传入函数时**复制值**，`x` 和 `num` 是两个独立的变量
- 修改 `x` 不会影响 `num`

```javascript
// 执行流程
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50（复制）
x = 100; // Stack: x = 100（只修改 x）
console.log(num); // Stack: num = 50（不受影响）
```

</details>

### 题目 2：引用类型的传递

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('函数内 obj.name:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('函数外 person.name:', person.name);
```

<details>
<summary>点击查看答案</summary>

```javascript
// 函数内 obj.name: Changed
// 函数外 person.name: Changed
```

**解释**：

- `person` 是引用类型（Object）
- 传入函数时**复制内存地址**
- `obj` 和 `person` 指向**同一个对象**
- 通过 `obj` 修改对象内容，`person` 也会被影响

```javascript
// 内存示意
let person = { name: 'Original' }; // Heap: 创建对象 @0x001
changeObject(person); // Stack: obj = @0x001（复制地址）
obj.name = 'Changed'; // Heap: @0x001.name = 'Changed'
console.log(person.name); // Heap: @0x001.name（同一个对象）
```

</details>

### 题目 3：重新赋值 vs 修改属性

```javascript
function test1(obj) {
  obj.name = 'Modified'; // 修改属性
}

function test2(obj) {
  obj = { name: 'New Object' }; // 重新赋值
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>点击查看答案</summary>

```javascript
// A: Modified
// B: Modified（不是 'New Object'！）
```

**解释**：

**test1：修改属性**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // ✅ 修改原对象的属性
}
// person 和 obj 指向同一个对象，所以会被修改
```

**test2：重新赋值**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // ❌ 只改变 obj 的指向
}
// obj 现在指向新对象，但 person 仍指向原对象
```

**内存示意图**：

```text
// test1 之前
person ────> { name: 'Original' }
obj    ────> { name: 'Original' } (同一个)

// test1 之后
person ────> { name: 'Modified' }
obj    ────> { name: 'Modified' } (同一个)

// test2 执行
person ────> { name: 'Modified' }    (不变)
obj    ────> { name: 'New Object' }  (新对象)

// test2 结束后
person ────> { name: 'Modified' }    (仍然不变)
// obj 被销毁，新对象被垃圾回收
```

</details>

### 题目 4：数组的传递

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
<summary>点击查看答案</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**解释**：

- `modifyArray`：修改原数组内容，`numbers` 被影响
- `reassignArray`：只改变参数的指向，`numbers` 不受影响

</details>

### 题目 5：比较运算

```javascript
// 原始类型比较
let a = 10;
let b = 10;
console.log('A:', a === b);

// 引用类型比较
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>点击查看答案</summary>

```javascript
// A: true
// B: false
// C: true
```

**解释**：

**原始类型**：比较值

```javascript
10 === 10; // true（值相同）
```

**引用类型**：比较内存地址

```javascript
obj1 === obj2; // false（不同对象，不同地址）
obj1 === obj3; // true（指向同一个对象）
```

**内存示意**：

```text
obj1 ────> @0x001: { value: 10 }
obj2 ────> @0x002: { value: 10 } (内容相同但地址不同)
obj3 ────> @0x001: { value: 10 } (与 obj1 相同地址)
```

</details>

## 4. Shallow Copy vs Deep Copy

> 浅拷贝 vs 深拷贝

### 浅拷贝（Shallow Copy）

**定义**：只复制第一层，嵌套对象仍然是引用。

#### 方法 1：展开运算符（Spread Operator）

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

// 修改第一层：不影响原对象
copy.name = 'Jane';
console.log(original.name); // 'John'（不受影响）

// 修改嵌套对象：影响原对象！
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung'（被影响！）
```

#### 方法 2：Object.assign()

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John'（不受影响）
```

#### 方法 3：数组的浅拷贝

```javascript
const arr1 = [1, 2, 3];

// 方法 1：展开运算符
const arr2 = [...arr1];

// 方法 2：slice()
const arr3 = arr1.slice();

// 方法 3：Array.from()
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1（不受影响）
```

### 深拷贝（Deep Copy）

**定义**：完全复制所有层级，包括嵌套对象。

#### 方法 1：JSON.parse + JSON.stringify（最常用）

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

// 修改嵌套对象：不影响原对象
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'（不受影响）

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming']（不受影响）
```

**限制**：

```javascript
const obj = {
  date: new Date(), // ❌ 会变成字符串
  func: () => {}, // ❌ 会被忽略
  undef: undefined, // ❌ 会被忽略
  symbol: Symbol('test'), // ❌ 会被忽略
  regexp: /abc/, // ❌ 会变成 {}
  circular: null, // ❌ 循环引用会报错
};
obj.circular = obj; // 循环引用

JSON.parse(JSON.stringify(obj)); // 会出错或丢失数据
```

#### 方法 2：structuredClone()（现代浏览器）

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

// 可以正确复制 Date 等特殊对象
console.log(copy.date instanceof Date); // true
```

**优点**：

- ✅ 支持 Date、RegExp、Map、Set 等
- ✅ 支持循环引用
- ✅ 性能较好

**限制**：

- ❌ 不支持函数
- ❌ 不支持 Symbol

#### 方法 3：递归实现深拷贝

```javascript
function deepClone(obj) {
  // 处理 null 和非对象
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // 处理 Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 处理对象
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// 使用示例
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'（不受影响）
```

#### 方法 4：使用 Lodash

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### 浅拷贝 vs 深拷贝比较

| 特性     | 浅拷贝       | 深拷贝       |
| -------- | ------------ | ------------ |
| 复制层级 | 只复制第一层 | 复制所有层级 |
| 嵌套对象 | 仍是引用     | 完全独立     |
| 性能     | 快           | 慢           |
| 内存     | 省           | 多           |
| 使用场景 | 简单对象     | 复杂嵌套结构 |

## 5. Common Pitfalls

> 常见陷阱

### 陷阱 1：以为参数传递可以改变原始类型

```javascript
// ❌ 错误理解
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5（不会变成 6！）

// ✅ 正确写法
count = increment(count); // 需要接收返回值
console.log(count); // 6
```

### 陷阱 2：以为重新赋值可以改变外部对象

```javascript
// ❌ 错误理解
function resetObject(obj) {
  obj = { name: 'Reset' }; // 只改变参数指向
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original'（没有被 reset！）

// ✅ 正确写法 1：修改属性
function resetObject(obj) {
  obj.name = 'Reset';
}

// ✅ 正确写法 2：返回新对象
function resetObject(obj) {
  return { name: 'Reset' };
}
person = resetObject(person);
```

### 陷阱 3：以为展开运算符是深拷贝

```javascript
// ❌ 错误理解
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // 浅拷贝！

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane'（被影响了！）

// ✅ 正确写法：深拷贝
const copy = JSON.parse(JSON.stringify(original));
// 或
const copy = structuredClone(original);
```

### 陷阱 4：const 的误解

```javascript
// const 只是不能重新赋值，不是不可变！

const obj = { name: 'John' };

// ❌ 不能重新赋值
obj = { name: 'Jane' }; // TypeError: Assignment to constant variable

// ✅ 可以修改属性
obj.name = 'Jane'; // 正常运作
obj.age = 30; // 正常运作

// 如果要真正的不可变
const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane'; // 静默失败（严格模式下会报错）
console.log(immutableObj.name); // 'John'（没有被修改）
```

### 陷阱 5：循环中的引用问题

```javascript
// ❌ 常见错误
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // 都指向同一个对象！
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]
// 都是同一个对象，最终值都是 2

// ✅ 正确写法：每次创建新对象
const arr = [];

for (let i = 0; i < 3; i++) {
  arr.push({ value: i }); // 每次创建新对象
}

console.log(arr);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practices

> 最佳实践

### ✅ 推荐做法

```javascript
// 1. 需要复制对象时，明确使用拷贝方法
const original = { name: 'John', age: 30 };

// 浅拷贝（简单对象）
const copy1 = { ...original };

// 深拷贝（嵌套对象）
const copy2 = structuredClone(original);

// 2. 函数不要依赖副作用来修改参数
// ❌ 不好
function addItem(arr, item) {
  arr.push(item); // 修改原数组
}

// ✅ 好
function addItem(arr, item) {
  return [...arr, item]; // 返回新数组
}

// 3. 使用 const 防止意外重新赋值
const config = { theme: 'dark' };
// config = {}; // 会报错

// 4. 需要不可变对象时使用 Object.freeze
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ 避免的做法

```javascript
// 1. 不要依赖参数传递来修改原始类型
function increment(num) {
  num++; // ❌ 无效
}

// 2. 不要混淆浅拷贝和深拷贝
const copy = { ...nested }; // ❌ 以为是深拷贝

// 3. 不要在循环中重复使用同一个对象引用
for (let i = 0; i < 3; i++) {
  arr.push(obj); // ❌ 都指向同一个对象
}
```

## 7. Interview Summary

> 面试总结

### 快速记忆

**原始类型（Primitive）**：

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- 传值（Call by Value）
- 存储在 Stack
- 不可变（Immutable）

**引用类型（Reference）**：

- Object, Array, Function, Date, RegExp, etc.
- 传址（Call by Reference）
- 存储在 Heap
- 可变（Mutable）

### 面试回答示例

**Q: JavaScript 是 Call by Value 还是 Call by Reference？**

> JavaScript **对所有类型都是 Call by Value**，但引用类型传递的「值」是内存地址。
>
> - 原始类型：传递值的副本，修改不影响原值
> - 引用类型：传递地址的副本，通过地址可以修改原对象
> - 但如果重新赋值（改变地址），则不影响原对象

## Reference

- [MDN - Data Structures](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [深入浅出 JavaScript](https://javascript.info/object-copy)
