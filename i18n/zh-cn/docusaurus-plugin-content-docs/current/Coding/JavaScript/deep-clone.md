---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> 什么是 Deep Clone？

**深拷贝（Deep Clone）**是指创建一个新对象，并且递归地复制原始对象及其所有嵌套对象和数组的所有属性。深拷贝后的对象与原始对象完全独立，修改其中一个不会影响另一个。

### 浅拷贝 vs 深拷贝

**浅拷贝（Shallow Clone）**：只复制对象的第一层属性，嵌套对象仍然共享引用。

```javascript
// 浅拷贝示例
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ 原始对象也被修改了
```

**深拷贝（Deep Clone）**：递归复制所有层级的属性，完全独立。

```javascript
// 深拷贝示例
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ 原始对象不受影响
```

## 2. Implementation Methods

> 实现方法

### 方法 1：使用 JSON.parse 和 JSON.stringify

**优点**：简单快速
**缺点**：无法处理函数、undefined、Symbol、Date、RegExp、Map、Set 等特殊类型

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 测试
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**限制**：

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date 变成空对象
console.log(cloned.func); // undefined ❌ 函数丢失
console.log(cloned.undefined); // undefined ✅ 但 JSON.stringify 会移除
console.log(cloned.symbol); // undefined ❌ Symbol 丢失
console.log(cloned.regex); // {} ❌ RegExp 变成空对象
```

### 方法 2：递归实现（处理基本类型和对象）

```javascript
function deepClone(obj) {
  // 处理 null 和基本类型
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // 处理对象
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// 测试
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ 不受影响
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### 方法 3：完整实现（处理 Map、Set、Symbol 等）

```javascript
function deepClone(obj, map = new WeakMap()) {
  // 处理 null 和基本类型
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理循环引用
  if (map.has(obj)) {
    return map.get(obj);
  }

  // 处理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 处理 Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // 处理 Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // 处理对象
  const cloned = {};
  map.set(obj, cloned);

  // 处理 Symbol 属性
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // 复制普通属性
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // 复制 Symbol 属性
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// 测试
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### 方法 4：处理循环引用

```javascript
function deepClone(obj, map = new WeakMap()) {
  // 处理 null 和基本类型
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理循环引用
  if (map.has(obj)) {
    return map.get(obj);
  }

  // 处理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // 处理对象
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// 测试循环引用
const original = {
  name: 'John',
};
original.self = original; // 循环引用

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ 正确处理循环引用
console.log(cloned !== original); // true ✅ 是不同的对象
```

## 3. Common Interview Questions

> 常见面试题目

### 题目 1：基本深拷贝实现

请实现一个 `deepClone` 函数，能够深拷贝对象和数组。

<details>
<summary>点击查看答案</summary>

```javascript
function deepClone(obj) {
  // 处理 null 和基本类型
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // 处理对象
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// 测试
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### 题目 2：处理循环引用

请实现一个能够处理循环引用的 `deepClone` 函数。

<details>
<summary>点击查看答案</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // 处理 null 和基本类型
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理循环引用
  if (map.has(obj)) {
    return map.get(obj);
  }

  // 处理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 处理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 处理数组
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // 处理对象
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// 测试循环引用
const original = {
  name: 'John',
};
original.self = original; // 循环引用

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**关键点**：

- 使用 `WeakMap` 来追踪已经处理过的对象
- 在创建新对象前先检查是否已经存在于 map 中
- 如果存在，直接返回 map 中的引用，避免无限递归

</details>

### 题目 3：JSON.parse 和 JSON.stringify 的限制

请说明使用 `JSON.parse(JSON.stringify())` 进行深拷贝的限制，并提供解决方案。

<details>
<summary>点击查看答案</summary>

**限制**：

1. **无法处理函数**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **无法处理 undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined（但属性会被移除）❌
   ```

3. **无法处理 Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Symbol 属性丢失
   ```

4. **Date 变成字符串**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ 变成字符串
   ```

5. **RegExp 变成空对象**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ 变成空对象
   ```

6. **无法处理 Map、Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ 变成空对象
   ```

7. **无法处理循环引用**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ 报错：Converting circular structure to JSON
   ```

**解决方案**：使用递归实现，针对不同类型进行特殊处理。

</details>

## 4. Best Practices

> 最佳实践

### 推荐做法

```javascript
// 1. 根据需求选择合适的方法
// 如果只需要处理基本对象和数组，使用简单的递归实现
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. 如果需要处理复杂类型，使用完整实现
function completeDeepClone(obj, map = new WeakMap()) {
  // ... 完整实现
}

// 3. 使用 WeakMap 处理循环引用
// WeakMap 不会阻止垃圾回收，适合用于追踪对象引用
```

### 避免的做法

```javascript
// 1. 不要过度使用 JSON.parse(JSON.stringify())
// ❌ 会丢失函数、Symbol、Date 等特殊类型
const cloned = JSON.parse(JSON.stringify(obj));

// 2. 不要忘记处理循环引用
// ❌ 会导致栈溢出
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // 无限递归
  }
  return cloned;
}

// 3. 不要忘记处理 Date、RegExp 等特殊类型
// ❌ 这些类型需要特殊处理
```

## 5. Interview Summary

> 面试总结

### 快速记忆

**深拷贝**：

- **定义**：递归复制对象及其所有嵌套属性，完全独立
- **方法**：递归实现、JSON.parse(JSON.stringify())、structuredClone()
- **关键**：处理特殊类型、循环引用、Symbol 属性

**实现要点**：

1. 处理基本类型和 null
2. 处理 Date、RegExp 等特殊对象
3. 处理数组和对象
4. 处理循环引用（使用 WeakMap）
5. 处理 Symbol 属性

### 面试回答示例

**Q: 请实现一个 Deep Clone 函数。**

> "深拷贝是指创建一个完全独立的新对象，递归复制所有嵌套属性。我的实现会先处理基本类型和 null，然后针对 Date、RegExp、数组、对象等不同类型进行特殊处理。为了处理循环引用，我会使用 WeakMap 来追踪已经处理过的对象。对于 Symbol 属性，我会使用 Object.getOwnPropertySymbols 来获取并复制。这样可以确保深拷贝后的对象与原始对象完全独立，修改其中一个不会影响另一个。"

**Q: JSON.parse(JSON.stringify()) 有什么限制？**

> "这个方法的主要限制包括：1) 无法处理函数，函数会被移除；2) 无法处理 undefined 和 Symbol，这些属性会被忽略；3) Date 对象会变成字符串；4) RegExp 会变成空对象；5) 无法处理 Map、Set 等特殊数据结构；6) 无法处理循环引用，会报错。如果需要处理这些特殊情况，应该使用递归实现的方式。"

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/zh-CN/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
