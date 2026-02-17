---
id: find-value-in-array
title: 📄 Find Value in Array
slug: /find-value-in-array
---

## 1. Einzigartige Werte in einem Array finden

### I. Verwendung von `Set(ES6)`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findUniqueValue = (arr) => {
  const uniqueValues = new Set(arr);
  return [...uniqueValues];
};

console.log(findUniqueValue(array)); // [6, 4, 3, 2, 1]
```

### II. Verwendung von `filter`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findUniqueValue = (arr) => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};

console.log(findUniqueValue(array)); // [6, 4, 3, 2, 1]
```

## 2. Werte finden, die nur einmal im Array vorkommen

### I. Vergleich von `indexOf` und `lastIndexOf`

```js
const array = [6, 4, 3, 2, 4, 1, 6, 3, 2];

const findSingleValue = (arr) => {
  return arr.filter((value) => arr.indexOf(value) === arr.lastIndexOf(value));
};

console.log(findSingleValue(array)); // [1]
```

### II. Verwendung von `reduce`

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

### III. Verwendung von `Map` zur Leistungsoptimierung

> Ziel ist es, nur eine einzige Durchlauf zu verwenden

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

## 3. Summe eines Arrays mit einheitlichem Typ berechnen

### I Schnelle Berechnung mit `for...of`-Schleife

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

### II. Verwendung der `for`-Schleife

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

## 4. Summe eines mehrstufig verschachtelten Arrays berechnen

### I. Verwendung von Rekursion

```js
const nestedArray = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

const sumNestedArray = (arr) => {
  return arr.reduce((acc, val) => {
    return acc + (Array.isArray(val) ? sumNestedArray(val) : val);
  }, 0);
};

console.log(sumNestedArray(nestedArray)); // 55
```

### II. Verwendung von `flat` zum Abflachen des Arrays

> Wenn das Array Objekte enthält, kann die `flat`-Methode nicht verwendet werden

```js
const nestedArray = [1, 2, [3, 4, [5, 6], 7], 8, [9, 10]];

const sumNestedArray = (arr) => {
  return arr.flat(Infinity).reduce((acc, val) => acc + val, 0);
};

console.log(sumNestedArray(nestedArray)); // 55
```

## 5. Summe der Zahlen in einem Array mit gemischten Typen berechnen

### I. Verwendung von reduce zur Berechnung der Zahlensumme

```js
const mixedArray = [1, '2', 3, 'four', 5, true, [6], { num: 7 }, '8.5'];

const sumNumbers = (arr) => {
  return arr.reduce((sum, item) => {
    if (typeof item === 'number') {
      return sum + item;
    } else if (typeof item === 'string' && !isNaN(Number(item))) {
      // Falls Strings in Zahlen konvertiert werden sollen, wird dies hier verarbeitet; andernfalls kann diese Bedingung entfernt werden
      return sum + Number(item);
    }
    return sum;
  }, 0);
};

console.log(sumNumbers(mixedArray)); // 19.5
```
