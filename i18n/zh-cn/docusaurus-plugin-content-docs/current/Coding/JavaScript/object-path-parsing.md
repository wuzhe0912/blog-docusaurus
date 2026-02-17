---
id: object-path-parsing
title: '[Medium] Object Path Parsing'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> 问题描述

实现对象路径解析函数，能够根据路径字符串获取和设置嵌套对象的值。

### 需求

1. **`get` 函数**：根据路径获取对象值

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **`set` 函数**：根据路径设置对象值

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> 实现 get 函数

### 方法 1：使用 split 和 reduce

**思路**：将路径字符串分割成数组，然后使用 `reduce` 逐层访问对象。

```javascript
function get(obj, path, defaultValue) {
  // 处理边界情况
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // 将路径字符串分割成数组
  const keys = path.split('.');

  // 使用 reduce 逐层访问
  const result = keys.reduce((current, key) => {
    // 如果当前值为 null 或 undefined，返回 undefined
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // 如果结果为 undefined，返回默认值
  return result !== undefined ? result : defaultValue;
}

// 测试
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined（需要处理数组索引）
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### 方法 2：支持数组索引

**思路**：处理路径中的数组索引，如 `'a.b[0].c'`。

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // 正则表达式匹配：属性名或数组索引
  // 匹配 'a', 'b', '[0]', 'c' 等
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // 处理数组索引 [0] -> 0
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// 测试
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
};

console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### 方法 3：完整实现（处理边界情况）

```javascript
function get(obj, path, defaultValue) {
  // 处理边界情况
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // 解析路径：支持 'a.b.c' 和 'a.b[0].c' 格式
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // 如果当前值为 null 或 undefined，返回默认值
    if (result == null) {
      return defaultValue;
    }

    // 处理数组索引
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// 测试
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
  y: undefined,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(obj, 'y.z', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj（空路径返回原对象）
```

## 3. Implementation: set Function

> 实现 set 函数

### 方法 1：基本实现

**思路**：根据路径创建嵌套对象结构，然后设置值。

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // 解析路径
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // 创建嵌套结构
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // 处理数组索引
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // 如果键不存在或不是对象，创建新对象
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // 设置最后一个键的值
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // 如果当前不是数组，需要转换
      const temp = { ...current };
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// 测试
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### 方法 2：完整实现（处理数组和对象）

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // 遍历到倒数第二个键，创建嵌套结构
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // 处理数组索引
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // 确保是数组
      if (!Array.isArray(current)) {
        // 将对象转换为数组（保留现有索引）
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // 确保索引存在
      if (current[index] == null) {
        // 判断下一个键是数组还是对象
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // 处理对象键
      if (current[key] == null) {
        // 判断下一个键是数组还是对象
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // 如果已存在但不是对象，需要转换
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // 设置最后一个键的值
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// 测试
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }

set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### 方法 3：简化版本（只处理对象，不处理数组索引）

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // 创建嵌套结构（除了最后一个键）
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // 设置最后一个键的值
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// 测试
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Common Interview Questions

> 常见面试题目

### 题目 1：基本 get 函数实现

请实现一个 `get` 函数，根据路径字符串获取嵌套对象的值。

<details>
<summary>点击查看答案</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

// 测试
const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**关键点**：

- 处理 null/undefined 的情况
- 使用 split 分割路径
- 逐层访问对象属性
- 当路径不存在时返回默认值

</details>

### 题目 2：支持数组索引的 get 函数

请扩展 `get` 函数，使其支持数组索引，如 `'a.b[0].c'`。

<details>
<summary>点击查看答案</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // 使用正则表达式解析路径
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // 处理数组索引
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// 测试
const obj = {
  a: {
    b: [2, 3, { c: 4 }],
  },
};

console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**关键点**：

- 使用正则表达式 `/[^.[\]]+|\[(\d+)\]/g` 解析路径
- 处理 `[0]` 格式的数组索引
- 将字符串索引转换为数字

</details>

### 题目 3：set 函数实现

请实现一个 `set` 函数，根据路径字符串设置嵌套对象的值。

<details>
<summary>点击查看答案</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // 创建嵌套结构（除了最后一个键）
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // 设置最后一个键的值
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// 测试
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**关键点**：

- 逐层创建嵌套对象结构
- 确保中间路径的对象存在
- 最后设置目标值

</details>

### 题目 4：完整实现 get 和 set

请实现完整的 `get` 和 `set` 函数，支持数组索引和处理各种边界情况。

<details>
<summary>点击查看答案</summary>

```javascript
// get 函数
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') {
    return obj ?? defaultValue;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// set 函数
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // 创建嵌套结构
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      if (!Array.isArray(current)) {
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      if (current[index] == null) {
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      if (current[key] == null) {
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // 设置值
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// 测试
const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1

set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Best Practices

> 最佳实践

### 推荐做法

```javascript
// 1. 处理边界情况
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. 使用正则表达式解析复杂路径
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. 在 set 中判断下一个键的类型
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. 使用 nullish coalescing 处理默认值
return result ?? defaultValue;
```

### 避免的做法

```javascript
// 1. ❌ 不要忘记处理 null/undefined
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // 可能出错
}

// 2. ❌ 不要直接修改原对象（除非明确要求）
function set(obj, path, value) {
  // 应该返回修改后的对象，而不是直接修改
}

// 3. ❌ 不要忽略数组和对象的区别
// 需要判断下一个键是数组索引还是对象键
```

## 6. Interview Summary

> 面试总结

### 快速记忆

**对象路径解析**：

- **get 函数**：根据路径获取值，处理 null/undefined，支持默认值
- **set 函数**：根据路径设置值，自动创建嵌套结构
- **路径解析**：使用正则表达式处理 `'a.b.c'` 和 `'a.b[0].c'` 格式
- **边界处理**：处理 null、undefined、空字符串等情况

**实现要点**：

1. 路径解析：`split('.')` 或正则表达式
2. 逐层访问：使用循环或 `reduce`
3. 边界处理：检查 null/undefined
4. 数组支持：处理 `[0]` 格式的索引

### 面试回答示例

**Q: 请实现一个根据路径获取对象值的函数。**

> "实现一个 `get` 函数，接收对象、路径字符串和默认值。首先处理边界情况，如果对象为 null 或路径不是字符串，返回默认值。然后使用 `split('.')` 将路径分割成键的数组，使用循环逐层访问对象属性。在每次访问时检查当前值是否为 null 或 undefined，如果是则返回默认值。最后如果结果为 undefined，返回默认值，否则返回结果。如果需要支持数组索引，可以使用正则表达式 `/[^.[\]]+|\[(\d+)\]/g` 来解析路径，并处理 `[0]` 格式的索引。"

**Q: 如何实现根据路径设置对象值的函数？**

> "实现一个 `set` 函数，接收对象、路径字符串和值。首先解析路径成键的数组，然后遍历到倒数第二个键，逐层创建嵌套对象结构。对于每个中间键，如果不存在或不是对象，就创建一个新对象。如果下一个键是数组索引格式，则创建数组。最后设置最后一个键的值。这样可以确保路径中的所有中间对象都存在，然后正确设置目标值。"

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
