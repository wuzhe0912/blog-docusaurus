---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> 什麼是 Deep Clone？

**深拷貝（Deep Clone）**是指創建一個新物件，並且遞迴地複製原始物件及其所有巢狀物件和陣列的所有屬性。深拷貝後的物件與原始物件完全獨立，修改其中一個不會影響另一個。

### 淺拷貝 vs 深拷貝

**淺拷貝（Shallow Clone）**：只複製物件的第一層屬性，巢狀物件仍然共享引用。

```javascript
// 淺拷貝範例
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ 原始物件也被修改了
```

**深拷貝（Deep Clone）**：遞迴複製所有層級的屬性，完全獨立。

```javascript
// 深拷貝範例
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ 原始物件不受影響
```

## 2. Implementation Methods

> 實作方法

### 方法 1：使用 JSON.parse 和 JSON.stringify

**優點**：簡單快速  
**缺點**：無法處理函式、undefined、Symbol、Date、RegExp、Map、Set 等特殊型別

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 測試
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**限制**：

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date 變成空物件
console.log(cloned.func); // undefined ❌ 函式遺失
console.log(cloned.undefined); // undefined ✅ 但 JSON.stringify 會移除
console.log(cloned.symbol); // undefined ❌ Symbol 遺失
console.log(cloned.regex); // {} ❌ RegExp 變成空物件
```

### 方法 2：遞迴實作（處理基本型別和物件）

```javascript
function deepClone(obj) {
  // 處理 null 和基本型別
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 處理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 處理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 處理陣列
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // 處理物件
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// 測試
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ 不受影響
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### 方法 3：完整實作（處理 Map、Set、Symbol 等）

```javascript
function deepClone(obj, map = new WeakMap()) {
  // 處理 null 和基本型別
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 處理循環引用
  if (map.has(obj)) {
    return map.get(obj);
  }

  // 處理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 處理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 處理 Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // 處理 Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // 處理陣列
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // 處理物件
  const cloned = {};
  map.set(obj, cloned);

  // 處理 Symbol 屬性
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // 複製一般屬性
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // 複製 Symbol 屬性
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// 測試
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### 方法 4：處理循環引用

```javascript
function deepClone(obj, map = new WeakMap()) {
  // 處理 null 和基本型別
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 處理循環引用
  if (map.has(obj)) {
    return map.get(obj);
  }

  // 處理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 處理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 處理陣列
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // 處理物件
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// 測試循環引用
const original = {
  name: 'John',
};
original.self = original; // 循環引用

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ 正確處理循環引用
console.log(cloned !== original); // true ✅ 是不同的物件
```

## 3. Common Interview Questions

> 常見面試題目

### 題目 1：基本深拷貝實作

請實作一個 `deepClone` 函式，能夠深拷貝物件和陣列。

<details>
<summary>點擊查看答案</summary>

```javascript
function deepClone(obj) {
  // 處理 null 和基本型別
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 處理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 處理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 處理陣列
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // 處理物件
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// 測試
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### 題目 2：處理循環引用

請實作一個能夠處理循環引用的 `deepClone` 函式。

<details>
<summary>點擊查看答案</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // 處理 null 和基本型別
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 處理循環引用
  if (map.has(obj)) {
    return map.get(obj);
  }

  // 處理 Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // 處理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 處理陣列
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // 處理物件
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// 測試循環引用
const original = {
  name: 'John',
};
original.self = original; // 循環引用

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**關鍵點**：

- 使用 `WeakMap` 來追蹤已經處理過的物件
- 在建立新物件前先檢查是否已經存在於 map 中
- 如果存在，直接返回 map 中的引用，避免無限遞迴

</details>

### 題目 3：JSON.parse 和 JSON.stringify 的限制

請說明使用 `JSON.parse(JSON.stringify())` 進行深拷貝的限制，並提供解決方案。

<details>
<summary>點擊查看答案</summary>

**限制**：

1. **無法處理函式**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **無法處理 undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined（但屬性會被移除）❌
   ```

3. **無法處理 Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Symbol 屬性遺失
   ```

4. **Date 變成字串**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ 變成字串
   ```

5. **RegExp 變成空物件**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ 變成空物件
   ```

6. **無法處理 Map、Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ 變成空物件
   ```

7. **無法處理循環引用**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ 報錯：Converting circular structure to JSON
   ```

**解決方案**：使用遞迴實作，針對不同型別進行特殊處理。

</details>

## 4. Best Practices

> 最佳實踐

### 推薦做法

```javascript
// 1. 根據需求選擇合適的方法
// 如果只需要處理基本物件和陣列，使用簡單的遞迴實作
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));
  
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. 如果需要處理複雜型別，使用完整實作
function completeDeepClone(obj, map = new WeakMap()) {
  // ... 完整實作
}

// 3. 使用 WeakMap 處理循環引用
// WeakMap 不會阻止垃圾回收，適合用於追蹤物件引用
```

### 避免的做法

```javascript
// 1. 不要過度使用 JSON.parse(JSON.stringify())
// ❌ 會遺失函式、Symbol、Date 等特殊型別
const cloned = JSON.parse(JSON.stringify(obj));

// 2. 不要忘記處理循環引用
// ❌ 會導致堆疊溢出
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // 無限遞迴
  }
  return cloned;
}

// 3. 不要忘記處理 Date、RegExp 等特殊型別
// ❌ 這些型別需要特殊處理
```

## 5. Interview Summary

> 面試總結

### 快速記憶

**深拷貝**：

- **定義**：遞迴複製物件及其所有巢狀屬性，完全獨立
- **方法**：遞迴實作、JSON.parse(JSON.stringify())、structuredClone()
- **關鍵**：處理特殊型別、循環引用、Symbol 屬性

**實作要點**：

1. 處理基本型別和 null
2. 處理 Date、RegExp 等特殊物件
3. 處理陣列和物件
4. 處理循環引用（使用 WeakMap）
5. 處理 Symbol 屬性

### 面試回答範例

**Q: 請實作一個 Deep Clone 函式。**

> "深拷貝是指創建一個完全獨立的新物件，遞迴複製所有巢狀屬性。我的實作會先處理基本型別和 null，然後針對 Date、RegExp、陣列、物件等不同型別進行特殊處理。為了處理循環引用，我會使用 WeakMap 來追蹤已經處理過的物件。對於 Symbol 屬性，我會使用 Object.getOwnPropertySymbols 來獲取並複製。這樣可以確保深拷貝後的物件與原始物件完全獨立，修改其中一個不會影響另一個。"

**Q: JSON.parse(JSON.stringify()) 有什麼限制？**

> "這個方法的主要限制包括：1) 無法處理函式，函式會被移除；2) 無法處理 undefined 和 Symbol，這些屬性會被忽略；3) Date 物件會變成字串；4) RegExp 會變成空物件；5) 無法處理 Map、Set 等特殊資料結構；6) 無法處理循環引用，會報錯。如果需要處理這些特殊情況，應該使用遞迴實作的方式。"

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/zh-TW/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)

