---
id: find-value-in-array
title: 📄 Find Value in Array
slug: /find-value-in-array
---

## 1. Encontrar valores únicos en un array

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

## 2. Encontrar valores que aparecen solo una vez en el array

### I. Comparación de `indexOf` y `lastIndexOf`

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

### III. Uso de `Map` para optimizar el rendimiento

> Lograr el objetivo usando solo un recorrido

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

## 3. Calcular la suma de un array de tipo único

### I Cálculo rápido con bucle `for...of`

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

### II. Uso del bucle `for`

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

## 4. Calcular la suma de un array con múltiples niveles de anidamiento

### I. Uso de recursión

```js
const nestedArray = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

const sumNestedArray = (arr) => {
  return arr.reduce((acc, val) => {
    return acc + (Array.isArray(val) ? sumNestedArray(val) : val);
  }, 0);
};

console.log(sumNestedArray(nestedArray)); // 55
```

### II. Uso de `flat` para aplanar el array

> Si el array contiene objetos, no se puede usar el método `flat`

```js
const nestedArray = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

const sumNestedArray = (arr) => {
  return arr.flat(Infinity).reduce((acc, val) => acc + val, 0);
};

console.log(sumNestedArray(nestedArray)); // 55
```

## 5. Calcular la suma de números en un array de tipos mixtos

### I. Uso de reduce para calcular la suma de números

```js
const mixedArray = [1, '2', 3, 'four', 5, true, [6], { num: 7 }, '8.5'];

const sumNumbers = (arr) => {
  return arr.reduce((sum, item) => {
    if (typeof item === 'number') {
      return sum + item;
    } else if (typeof item === 'string' && !isNaN(Number(item))) {
      // Si necesitas convertir strings a números, realiza este procesamiento; de lo contrario, puedes eliminar esta condición
      return sum + Number(item);
    }
    return sum;
  }, 0);
};

console.log(sumNumbers(mixedArray)); // 19.5
```
