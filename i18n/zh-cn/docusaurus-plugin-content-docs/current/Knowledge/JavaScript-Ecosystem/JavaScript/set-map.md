---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Set and Map?

> 什么是 Set 和 Map？

`Set` 和 `Map` 是 ES6 引入的两种新的数据结构，它们提供了比传统对象和数组更适合特定场景的解决方案。

### Set（集合）

**定义**：`Set` 是一种**值唯一**的集合，类似于数学中的集合概念。

**特点**：

- 储存的值**不会重复**
- 使用 `===` 来判断值是否相等
- 保持插入顺序
- 可以储存任何类型的值（原始类型或对象）

**基本用法**：

```javascript
// 创建 Set
const set = new Set();

// 添加值
set.add(1);
set.add(2);
set.add(2); // 重复值不会被加入
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// 检查值是否存在
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// 删除值
set.delete(2);
console.log(set.has(2)); // false

// 清空 Set
set.clear();
console.log(set.size); // 0
```

**从数组创建 Set**：

```javascript
// 去除数组中的重复值
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// 转回数组
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// 简写
const uniqueArr2 = [...new Set(arr)];
```

### Map（映射）

**定义**：`Map` 是一种**键值对**的集合，类似于对象，但键可以是任何类型。

**特点**：

- 键可以是任何类型（字符串、数字、对象、函数等）
- 保持插入顺序
- 有 `size` 属性
- 迭代顺序与插入顺序一致

**基本用法**：

```javascript
// 创建 Map
const map = new Map();

// 添加键值对
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// 获取值
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// 检查键是否存在
console.log(map.has('name')); // true

// 删除键值对
map.delete('name');

// 获取大小
console.log(map.size); // 3

// 清空 Map
map.clear();
```

**从数组创建 Map**：

```javascript
// 从二维数组创建
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// 从对象创建
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Set 与数组的差异

| 特性     | Set                    | Array                    |
| -------- | ---------------------- | ------------------------ |
| 重复值   | 不允许                 | 允许                     |
| 索引访问 | 不支持                 | 支持                     |
| 查找性能 | O(1)                   | O(n)                     |
| 插入顺序 | 保持                   | 保持                     |
| 常用方法 | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**使用场景**：

```javascript
// ✅ 适合使用 Set：需要唯一值
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ 适合使用 Set：快速检查存在性
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('已访问过首页');
}

// ✅ 适合使用 Array：需要索引或重复值
const scores = [100, 95, 100, 90]; // 允许重复
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Map 与对象的差异

| 特性     | Map          | Object               |
| -------- | ------------ | -------------------- |
| 键的类型 | 任何类型     | 字符串或 Symbol      |
| 大小     | `size` 属性  | 需手动计算           |
| 默认键   | 无           | 有原型链             |
| 迭代顺序 | 插入顺序     | ES2015+ 保持插入顺序 |
| 性能     | 频繁增删较快 | 一般情况较快         |
| JSON     | 不直接支持   | 原生支持             |

**使用场景**：

```javascript
// ✅ 适合使用 Map：键不是字符串
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ 适合使用 Map：需要频繁增删
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ 适合使用 Object：静态结构、需要 JSON
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config); // 可直接序列化
```

## 4. Common Interview Questions

> 常见面试题目

### 题目 1：去除数组重复值

请实现一个函数，去除数组中的重复值。

```javascript
function removeDuplicates(arr) {
  // 你的实现
}
```

<details>
<summary>点击查看答案</summary>

**方法 1：使用 Set（推荐）**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**方法 2：使用 filter + indexOf**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**方法 3：使用 reduce**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**性能比较**：

- Set 方法：O(n)，最快
- filter + indexOf：O(n²)，较慢
- reduce + includes：O(n²)，较慢

</details>

### 题目 2：检查数组是否有重复值

请实现一个函数，检查数组中是否有重复值。

```javascript
function hasDuplicates(arr) {
  // 你的实现
}
```

<details>
<summary>点击查看答案</summary>

**方法 1：使用 Set（推荐）**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**方法 2：使用 Set 的 has 方法**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**方法 3：使用 indexOf**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**性能比较**：

- Set 方法 1：O(n)，最快
- Set 方法 2：O(n)，平均情况下可能提前结束
- indexOf 方法：O(n²)，较慢

</details>

### 题目 3：计算元素出现次数

请实现一个函数，计算数组中每个元素出现的次数。

```javascript
function countOccurrences(arr) {
  // 你的实现
}
```

<details>
<summary>点击查看答案</summary>

**方法 1：使用 Map（推荐）**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**方法 2：使用 reduce + Map**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**方法 3：转换为对象**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**使用 Map 的优势**：

- 键可以是任何类型（对象、函数等）
- 有 `size` 属性
- 迭代顺序与插入顺序一致

</details>

### 题目 4：找出两个数组的交集

请实现一个函数，找出两个数组的交集（共同元素）。

```javascript
function intersection(arr1, arr2) {
  // 你的实现
}
```

<details>
<summary>点击查看答案</summary>

**方法 1：使用 Set**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**方法 2：使用 filter + Set**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**方法 3：使用 filter + includes**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**性能比较**：

- Set 方法：O(n + m)，最快
- filter + includes：O(n × m)，较慢

</details>

### 题目 5：找出两个数组的差集

请实现一个函数，找出两个数组的差集（在 arr1 中但不在 arr2 中的元素）。

```javascript
function difference(arr1, arr2) {
  // 你的实现
}
```

<details>
<summary>点击查看答案</summary>

**方法 1：使用 Set**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**方法 2：使用 Set 去重后再过滤**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**方法 3：使用 includes**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**性能比较**：

- Set 方法：O(n + m)，最快
- includes 方法：O(n × m)，较慢

</details>

### 题目 6：实现 LRU Cache

请使用 Map 实现一个 LRU（Least Recently Used）缓存。

```javascript
class LRUCache {
  constructor(capacity) {
    // 你的实现
  }

  get(key) {
    // 你的实现
  }

  put(key, value) {
    // 你的实现
  }
}
```

<details>
<summary>点击查看答案</summary>

**实现**：

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // 将该键移到最后（表示最近使用）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // 如果键已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // 如果容量已满，删除最旧的键（第一个）
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // 添加键值对（会自动放在最后）
    this.cache.set(key, value);
  }
}

// 使用示例
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // 移除键 2
console.log(cache.get(2)); // -1（已被移除）
console.log(cache.get(3)); // 'three'
```

**说明**：

- Map 保持插入顺序，第一个键是最旧的
- `get` 时将键移到最后，表示最近使用
- `put` 时如果容量已满，删除第一个键

</details>

### 题目 7：使用对象作为 Map 的键

请说明以下代码的输出结果。

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>点击查看答案</summary>

```javascript
// 'first'
// 'second'
// 2
```

**解释**：

- `obj1` 和 `obj2` 虽然内容相同，但是**不同的对象实例**
- Map 使用**引用比较**（reference comparison），不是值比较
- 因此 `obj1` 和 `obj2` 被视为不同的键
- 如果使用普通对象作为 Map，会将对象转为字符串 `[object Object]`，导致所有对象都变成同一个键

**对比普通对象**：

```javascript
// 普通对象：键会被转为字符串
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second'（被覆盖）
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]']（只有一个键）

// Map：保持对象引用
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet 与 WeakMap

> WeakSet 与 WeakMap 的差异

### WeakSet

**特点**：

- 只能储存**对象**（不能储存原始类型）
- **弱引用**：如果对象没有其他引用，会被垃圾回收
- 没有 `size` 属性
- 不可迭代
- 没有 `clear` 方法

**使用场景**：标记对象，避免内存泄漏

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// 当 obj1 没有其他引用时，会被垃圾回收
// weakSet 中的引用也会自动清除
```

### WeakMap

**特点**：

- 键只能是**对象**（不能是原始类型）
- **弱引用**：如果键对象没有其他引用，会被垃圾回收
- 没有 `size` 属性
- 不可迭代
- 没有 `clear` 方法

**使用场景**：储存对象的私有数据，避免内存泄漏

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// 当 obj1 没有其他引用时，会被垃圾回收
// weakMap 中的键值对也会自动清除
```

### WeakSet/WeakMap vs Set/Map 比较

| 特性       | Set/Map      | WeakSet/WeakMap |
| ---------- | ------------ | --------------- |
| 键/值类型  | 任何类型     | 只能是对象      |
| 弱引用     | 否           | 是              |
| 可迭代     | 是           | 否              |
| size 属性  | 有           | 无              |
| clear 方法 | 有           | 无              |
| 垃圾回收   | 不会自动清除 | 会自动清除      |

## 6. Best Practices

> 最佳实践

### 推荐做法

```javascript
// 1. 需要唯一值时使用 Set
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. 需要快速查找时使用 Set
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // 允许访问
}

// 3. 键不是字符串时使用 Map
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. 需要频繁增删时使用 Map
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. 需要关联对象数据且避免内存泄漏时使用 WeakMap
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### 避免的做法

```javascript
// 1. 不要用 Set 来取代数组的所有功能
// ❌ 不好：需要索引时仍用 Set
const set = new Set([1, 2, 3]);
// set[0] // undefined，无法用索引访问

// ✅ 好：需要索引时用数组
const arr = [1, 2, 3];
arr[0]; // 1

// 2. 不要用 Map 来取代对象的所有功能
// ❌ 不好：简单的静态结构用 Map
const config = new Map();
config.set('apiUrl', 'https://api.example.com');
config.set('timeout', 5000);

// ✅ 好：简单结构用对象
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. 不要混淆 Set 和 Map
// ❌ 错误：Set 没有键值对
const set = new Set();
set.set('key', 'value'); // TypeError: set.set is not a function

// ✅ 正确：Map 才有键值对
const map = new Map();
map.set('key', 'value');
```

## 7. Interview Summary

> 面试总结

### 快速记忆

**Set（集合）**：

- 值唯一，不重复
- 快速查找：O(1)
- 适合：去重、快速检查存在性

**Map（映射）**：

- 键值对，键可以是任何类型
- 保持插入顺序
- 适合：非字符串键、频繁增删

**WeakSet/WeakMap**：

- 弱引用，自动垃圾回收
- 键/值只能是对象
- 适合：避免内存泄漏

### 面试回答示例

**Q: 什么时候应该使用 Set 而不是数组？**

> "当需要确保值唯一或需要快速检查值是否存在时，应该使用 Set。Set 的 `has` 方法是 O(1) 时间复杂度，而数组的 `includes` 是 O(n)。例如去除数组重复值或检查用户权限时，Set 会更有效率。"

**Q: Map 和对象的差异是什么？**

> "Map 的键可以是任何类型，包括对象、函数等，而对象的键只能是字符串或 Symbol。Map 有 `size` 属性可以直接获取大小，而对象需要手动计算。Map 保持插入顺序，且没有原型链，适合储存纯数据。当需要将对象作为键或需要频繁增删时，Map 是更好的选择。"

**Q: WeakMap 和 Map 的差异是什么？**

> "WeakMap 的键只能是对象，且使用弱引用。当键对象没有其他引用时，WeakMap 中的对应条目会被自动垃圾回收，这可以避免内存泄漏。WeakMap 不可迭代，也没有 `size` 属性。适合用于储存对象的私有数据或元数据，当对象被销毁时，相关数据也会自动清除。"

## Reference

- [MDN - Set](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
