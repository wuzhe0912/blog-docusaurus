---
id: multi-dimensional-array
title: 📄 Multi Dimensional Array
slug: /multi-dimensional-array
tags: [Coding, Lodash Functions, Medium]
---

## 操作陣列中包含多層陣列與物件

### 1. 使用遞迴解法

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
      // 如果 item 是陣列，則遞迴呼叫 findAgeById 函式
      const result = findAgeById(item, targetId);
      // 如果子陣列中找到，則立即回傳
      if (result !== undefined) {
        return result;
      }
    } else if (item.id === targetId) {
      // 如果 item 是物件，則回傳對應的 age
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

### 2. 使用深度優先搜尋(DFS)

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

### 3. 使用廣度優先搜尋(BFS)

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
