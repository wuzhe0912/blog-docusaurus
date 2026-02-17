---
id: multi-dimensional-array
title: 📄 Multi Dimensional Array
slug: /multi-dimensional-array
tags: [Coding, Lodash Functions, Medium]
---

## 多層配列とオブジェクトを含む配列の操作

### 1. 再帰を使った解法

```js
const multiArray = [
  { id: 1, name: 'Amy' },
  [
    { id: 2, name: 'Pitt', detail: { age: 30 } },
    { id: 3, name: 'Riley', detail: { age: 25 } },
  ],
];

const findAgeById = (array, targetId) => {
  for (let item of array) {
    if (Array.isArray(item)) {
      // item が配列の場合、findAgeById 関数を再帰的に呼び出す
      const result = findAgeById(item, targetId);
      // 子配列で見つかった場合、すぐに返す
      if (result !== undefined) {
        return result;
      }
    } else if (item.id === targetId) {
      // item がオブジェクトの場合、対応する age を返す
      return item.detail && item.detail.age !== undefined
        ? item.detail.age
        : 'No age';
    }
  }
  return 'No age';
};

console.log(findAgeById(multiArray, 2)); // 30
console.log(findAgeById(multiArray, 4)); // No age
console.log(findAgeById(multiArray, 3)); // 25
console.log(findAgeById(multiArray, 1)); // No age
```

### 2. 深さ優先探索(DFS)を使用

```js
const multiArray = [
  { id: 1, name: 'Amy' },
  [
    { id: 2, name: 'Pitt', detail: { age: 30 } },
    { id: 3, name: 'Riley', detail: { age: 25 } },
  ],
];

const dfsFindAgeById = (array, targetId) => {
  const stack = [...array];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else if (item.id === targetId) {
      return item.detail && item.detail.age !== undefined
        ? item.detail.age
        : 'No age';
    }
  }
  return 'No age';
};

console.log(dfsFindAgeById(multiArray, 2)); // 30
console.log(dfsFindAgeById(multiArray, 4)); // No age
console.log(dfsFindAgeById(multiArray, 3)); // 25
console.log(dfsFindAgeById(multiArray, 1)); // No age
```

### 3. 幅優先探索(BFS)を使用

```js
const multiArray = [
  { id: 1, name: 'Amy' },
  [
    { id: 2, name: 'Pitt', detail: { age: 30 } },
    { id: 3, name: 'Riley', detail: { age: 25 } },
  ],
];

const bfsFindAgeById = (array, targetId) => {
  const queue = [...array];
  while (queue.length) {
    const item = queue.shift();
    if (Array.isArray(item)) {
      queue.push(...item);
    } else if (item.id === targetId) {
      return item.detail && item.detail.age !== undefined
        ? item.detail.age
        : 'No age';
    }
  }
  return 'No age';
};

console.log(bfsFindAgeById(multiArray, 2)); // 30
console.log(bfsFindAgeById(multiArray, 4)); // No age
console.log(bfsFindAgeById(multiArray, 3)); // 25
console.log(bfsFindAgeById(multiArray, 1)); // No age
```
