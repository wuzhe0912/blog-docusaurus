---
id: multi-dimensional-array
title: 📄 Multi Dimensional Array
slug: /multi-dimensional-array
tags: [Coding, Lodash Functions, Medium]
---

## Operar arrays contendo arrays multinível e objetos

### 1. Solução com recursão

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
      // Se item for um array, chamar recursivamente a função findAgeById
      const result = findAgeById(item, targetId);
      // Se encontrado no sub-array, retornar imediatamente
      if (result !== undefined) {
        return result;
      }
    } else if (item.id === targetId) {
      // Se item for um objeto, retornar o age correspondente
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

### 2. Uso de busca em profundidade (DFS)

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

### 3. Uso de busca em largura (BFS)

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
