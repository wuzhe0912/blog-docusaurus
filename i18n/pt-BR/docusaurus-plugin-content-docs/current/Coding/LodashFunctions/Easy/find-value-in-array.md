---
id: find-value-in-array
title: 📄 Find Value in Array
slug: /find-value-in-array
---

## 1. Encontrar valores únicos em um array

### I. Uso de `Set(ES6)`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findUniqueValue = (arr) => {
  const uniqueValues = new Set(arr);
  return [...uniqueValues];
};

console.log(findUniqueValue(array)); // [6, 4, 3, 2, 1]
```

### II. Uso de `filter`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findUniqueValue = (arr) => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};

console.log(findUniqueValue(array)); // [6, 4, 3, 2, 1]
```

## 2. Encontrar valores que aparecem apenas uma vez no array

### I. Comparação de `indexOf` e `lastIndexOf`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findSingleValue = (arr) => {
  return arr.filter((value) => arr.indexOf(value) === arr.lastIndexOf(value));
};

console.log(findSingleValue(array)); // [1]
```

### II. Uso de `reduce`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2, 8, 9];

const findSingleValue = (arr) => {
  return arr.reduce((acc, value) => {
    if (arr.indexOf(value) === arr.lastIndexOf(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
};

console.log(findSingleValue(array)); // [1, 8, 9]
```

### III. Uso de `Map` para otimizar a performance

> Alcançar o objetivo usando apenas uma iteração

```js
const arr = [6, 4, 3, 2, 4, 1, 6, 3, 2, 7, 8, 9];

const findUniqueValuesOptimized = (arr) => {
  const uniqueSet = new Set();
  const seenSet = new Set();

  for (const num of arr) {
    if (!seenSet.has(num)) {
      uniqueSet.add(num);
      seenSet.add(num);
    } else {
      uniqueSet.delete(num);
    }
  }

  return Array.from(uniqueSet);
};

console.log(findUniqueValuesOptimized(arr)); // [1, 7, 8, 9]
```

## 3. Calcular a soma de um array de tipo único

### I Cálculo rápido com loop `for...of`

```js
const numberArray = [1, 2, 3, 4, 5];

const sumArray = (arr) => {
  let sum = 0;
  for (const num of arr) {
    sum += num;
  }
  return sum;
};
```

### II. Uso do loop `for`

```js
const numberArray = [1, 2, 3, 4, 5];

const sumArray = (arr) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
};

console.log(sumArray(numberArray)); // 15
```

## 4. Calcular a soma de um array com múltiplos níveis de aninhamento

### I. Uso de recursão

```js
const nestedArray = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

const sumNestedArray = (arr) => {
  return arr.reduce((acc, val) => {
    return acc + (Array.isArray(val) ? sumNestedArray(val) : val);
  }, 0);
};

console.log(sumNestedArray(nestedArray)); // 55
```

### II. Uso de `flat` para achatar o array

> Se o array contiver objetos, o método `flat` não pode ser usado

```js
const nestedArray = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

const sumNestedArray = (arr) => {
  return arr.flat(Infinity).reduce((acc, val) => acc + val, 0);
};

console.log(sumNestedArray(nestedArray)); // 55
```

## 5. Calcular a soma dos números em um array de tipos mistos

### I. Uso de reduce para calcular a soma dos números

```js
const mixedArray = [1, '2', 3, 'four', 5, true, [6], { num: 7 }, '8.5'];

const sumNumbers = (arr) => {
  return arr.reduce((sum, item) => {
    if (typeof item === 'number') {
      return sum + item;
    } else if (typeof item === 'string' && !isNaN(Number(item))) {
      // Se precisar converter strings em números, faça este processamento; caso contrário, pode remover esta condição
      return sum + Number(item);
    }
    return sum;
  }, 0);
};

console.log(sumNumbers(mixedArray)); // 19.5
```
