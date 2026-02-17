---
id: object-path-parsing
title: '[Medium] Object Path Parsing'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> 問題描述

實作物件路徑解析函式，能夠根據路徑字串獲取和設置巢狀物件的值。

### 需求

1. **`get` 函式**：根據路徑獲取物件值

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **`set` 函式**：根據路徑設置物件值

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> 實作 get 函式

### 方法 1：使用 split 和 reduce

**思路**：將路徑字串分割成陣列，然後使用 `reduce` 逐層訪問物件。

```javascript
function get(obj, path, defaultValue) {
  // 處理邊界情況
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // 將路徑字串分割成陣列
  const keys = path.split('.');

  // 使用 reduce 逐層訪問
  const result = keys.reduce((current, key) => {
    // 如果當前值為 null 或 undefined，返回 undefined
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // 如果結果為 undefined，返回預設值
  return result !== undefined ? result : defaultValue;
}

// 測試
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined（需要處理陣列索引）
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### 方法 2：支援陣列索引

**思路**：處理路徑中的陣列索引，如 `'a.b[0].c'`。

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // 正則表達式匹配：屬性名或陣列索引
  // 匹配 'a', 'b', '[0]', 'c' 等
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // 處理陣列索引 [0] -> 0
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// 測試
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
};

console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### 方法 3：完整實作（處理邊界情況）

```javascript
function get(obj, path, defaultValue) {
  // 處理邊界情況
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // 解析路徑：支援 'a.b.c' 和 'a.b[0].c' 格式
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // 如果當前值為 null 或 undefined，返回預設值
    if (result == null) {
      return defaultValue;
    }

    // 處理陣列索引
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// 測試
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
  y: undefined,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(obj, 'y.z', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj（空路徑返回原物件）
```

## 3. Implementation: set Function

> 實作 set 函式

### 方法 1：基本實作

**思路**：根據路徑創建巢狀物件結構，然後設置值。

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // 解析路徑
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // 創建巢狀結構
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // 處理陣列索引
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // 如果鍵不存在或不是物件，創建新物件
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // 設置最後一個鍵的值
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // 如果當前不是陣列，需要轉換
      const temp = { ...current };
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// 測試
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### 方法 2：完整實作（處理陣列和物件）

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // 遍歷到倒數第二個鍵，創建巢狀結構
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // 處理陣列索引
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // 確保是陣列
      if (!Array.isArray(current)) {
        // 將物件轉換為陣列（保留現有索引）
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // 確保索引存在
      if (current[index] == null) {
        // 判斷下一個鍵是陣列還是物件
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // 處理物件鍵
      if (current[key] == null) {
        // 判斷下一個鍵是陣列還是物件
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // 如果已存在但不是物件，需要轉換
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // 設置最後一個鍵的值
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// 測試
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }

set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### 方法 3：簡化版本（只處理物件，不處理陣列索引）

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // 創建巢狀結構（除了最後一個鍵）
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // 設置最後一個鍵的值
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// 測試
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Common Interview Questions

> 常見面試題目

### 題目 1：基本 get 函式實作

請實作一個 `get` 函式，根據路徑字串獲取巢狀物件的值。

<details>
<summary>點擊查看答案</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

// 測試
const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**關鍵點**：

- 處理 null/undefined 的情況
- 使用 split 分割路徑
- 逐層訪問物件屬性
- 返回預設值當路徑不存在時

</details>

### 題目 2：支援陣列索引的 get 函式

請擴展 `get` 函式，使其支援陣列索引，如 `'a.b[0].c'`。

<details>
<summary>點擊查看答案</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // 使用正則表達式解析路徑
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // 處理陣列索引
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// 測試
const obj = {
  a: {
    b: [2, 3, { c: 4 }],
  },
};

console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**關鍵點**：

- 使用正則表達式 `/[^.[\]]+|\[(\d+)\]/g` 解析路徑
- 處理 `[0]` 格式的陣列索引
- 將字串索引轉換為數字

</details>

### 題目 3：set 函式實作

請實作一個 `set` 函式，根據路徑字串設置巢狀物件的值。

<details>
<summary>點擊查看答案</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // 創建巢狀結構（除了最後一個鍵）
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // 設置最後一個鍵的值
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// 測試
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**關鍵點**：

- 逐層創建巢狀物件結構
- 確保中間路徑的物件存在
- 最後設置目標值

</details>

### 題目 4：完整實作 get 和 set

請實作完整的 `get` 和 `set` 函式，支援陣列索引和處理各種邊界情況。

<details>
<summary>點擊查看答案</summary>

```javascript
// get 函式
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') {
    return obj ?? defaultValue;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// set 函式
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // 創建巢狀結構
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      if (!Array.isArray(current)) {
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      if (current[index] == null) {
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      if (current[key] == null) {
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // 設置值
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// 測試
const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1

set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Best Practices

> 最佳實踐

### 推薦做法

```javascript
// 1. 處理邊界情況
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. 使用正則表達式解析複雜路徑
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. 在 set 中判斷下一個鍵的類型
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. 使用 nullish coalescing 處理預設值
return result ?? defaultValue;
```

### 避免的做法

```javascript
// 1. ❌ 不要忘記處理 null/undefined
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // 可能出錯
}

// 2. ❌ 不要直接修改原物件（除非明確要求）
function set(obj, path, value) {
  // 應該返回修改後的物件，而不是直接修改
}

// 3. ❌ 不要忽略陣列和物件的區別
// 需要判斷下一個鍵是陣列索引還是物件鍵
```

## 6. Interview Summary

> 面試總結

### 快速記憶

**物件路徑解析**：

- **get 函式**：根據路徑獲取值，處理 null/undefined，支援預設值
- **set 函式**：根據路徑設置值，自動創建巢狀結構
- **路徑解析**：使用正則表達式處理 `'a.b.c'` 和 `'a.b[0].c'` 格式
- **邊界處理**：處理 null、undefined、空字串等情況

**實作要點**：

1. 路徑解析：`split('.')` 或正則表達式
2. 逐層訪問：使用迴圈或 `reduce`
3. 邊界處理：檢查 null/undefined
4. 陣列支援：處理 `[0]` 格式的索引

### 面試回答範例

**Q: 請實作一個根據路徑獲取物件值的函式。**

> "實作一個 `get` 函式，接收物件、路徑字串和預設值。首先處理邊界情況，如果物件為 null 或路徑不是字串，返回預設值。然後使用 `split('.')` 將路徑分割成鍵的陣列，使用迴圈逐層訪問物件屬性。在每次訪問時檢查當前值是否為 null 或 undefined，如果是則返回預設值。最後如果結果為 undefined，返回預設值，否則返回結果。如果需要支援陣列索引，可以使用正則表達式 `/[^.[\]]+|\[(\d+)\]/g` 來解析路徑，並處理 `[0]` 格式的索引。"

**Q: 如何實作根據路徑設置物件值的函式？**

> "實作一個 `set` 函式，接收物件、路徑字串和值。首先解析路徑成鍵的陣列，然後遍歷到倒數第二個鍵，逐層創建巢狀物件結構。對於每個中間鍵，如果不存在或不是物件，就創建一個新物件。如果下一個鍵是陣列索引格式，則創建陣列。最後設置最後一個鍵的值。這樣可以確保路徑中的所有中間物件都存在，然後正確設置目標值。"

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
