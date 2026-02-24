---
id: find-value-in-array
title: 📄 Поиск значений в массиве
slug: /find-value-in-array
---

## 1. Поиск уникальных значений в массиве

### I. С использованием `Set` (ES6)

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findUniqueValue = (arr) => {
  const uniqueValues = new Set(arr);
  return [...uniqueValues];
};

console.log(findUniqueValue(array)); // [6, 4, 3, 2, 1]
```

### II. С использованием `filter`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findUniqueValue = (arr) => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};

console.log(findUniqueValue(array)); // [6, 4, 3, 2, 1]
```

## 2. Поиск значений, которые встречаются в массиве только один раз

### I. Сравнение `indexOf` и `lastIndexOf`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findSingleValue = (arr) => {
  return arr.filter((value) => arr.indexOf(value) === arr.lastIndexOf(value));
};

console.log(findSingleValue(array)); // [1]
```

### II. С использованием `reduce`

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

### III. С использованием `Map` для оптимизации производительности

> Достигает цели за один проход

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

## 3. Сумма числового массива одного типа

### I. Быстрое решение с циклом `for...of`

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

### II. С использованием цикла `for`

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

## 4. Сумма глубоко вложенного массива

### I. С использованием рекурсии

```js
const nestedArray = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

const sumNestedArray = (arr) => {
  return arr.reduce((acc, val) => {
    return acc + (Array.isArray(val) ? sumNestedArray(val) : val);
  }, 0);
};

console.log(sumNestedArray(nestedArray)); // 55
```

### II. С использованием `flat` для выравнивания массива

> Нельзя использовать `flat`, если в массиве есть объекты

```js
const nestedArray = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

const sumNestedArray = (arr) => {
  return arr.flat(Infinity).reduce((acc, val) => acc + val, 0);
};

console.log(sumNestedArray(nestedArray)); // 55
```

## 5. Сумма только чисел в массиве смешанных типов

### I. Использование reduce для суммирования чисел

```js
const mixedArray = [1, '2', 3, 'four', 5, true, [6], { num: 7 }, '8.5'];

const sumNumbers = (arr) => {
  return arr.reduce((sum, item) => {
    if (typeof item === 'number') {
      return sum + item;
    } else if (typeof item === 'string' && !isNaN(Number(item))) {
      // If string-to-number conversion is needed, handle it here; otherwise remove this check
      return sum + Number(item);
    }
    return sum;
  }, 0);
};

console.log(sumNumbers(mixedArray)); // 19.5
```
