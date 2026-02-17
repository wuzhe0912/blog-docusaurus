---
id: multi-dimensional-array
title: 📄 Multi Dimensional Array
slug: /multi-dimensional-array
tags: [Coding, Lodash Functions, Medium]
---

## 다층 배열과 객체를 포함하는 배열 조작

### 1. 재귀를 사용한 해법

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
      // item이 배열이면 findAgeById 함수를 재귀적으로 호출
      const result = findAgeById(item, targetId);
      // 하위 배열에서 찾으면 즉시 반환
      if (result !== undefined) {
        return result;
      }
    } else if (item.id === targetId) {
      // item이 객체이면 해당 age를 반환
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

### 2. 깊이 우선 탐색(DFS) 사용

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

### 3. 너비 우선 탐색(BFS) 사용

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
