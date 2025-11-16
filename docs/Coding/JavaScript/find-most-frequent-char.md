---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> 問題描述

實作一個函式，接收一個字串，並回傳該字串中出現次數最多的字元。

### 範例

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> 實作方法

### 方法 1：使用物件計數（基礎版）

**思路**：遍歷字串，使用物件記錄每個字元的出現次數，然後找出出現次數最多的字元。

```javascript
function findMostFrequentChar(str) {
  // 初始化物件來儲存字元和計數
  const charCount = {};

  // 初始化記錄最大計數和字元的變數
  let maxCount = 0;
  let maxChar = '';

  // 遍歷字串
  for (let char of str) {
    // 如果字元不在物件中，設定計數為 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // 增加這個字元的計數
    charCount[char]++;

    // 如果這個字元的計數大於最大計數
    // 更新最大計數和最大字元
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // 回傳最大字元
  return maxChar;
}

// 測試
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**時間複雜度**：O(n)，其中 n 是字串長度  
**空間複雜度**：O(k)，其中 k 是不同字元的數量

### 方法 2：先計數再找最大值（兩階段）

**思路**：先遍歷一次計算所有字元的出現次數，再遍歷一次找出最大值。

```javascript
function findMostFrequentChar(str) {
  // 第一階段：計算每個字元的出現次數
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // 第二階段：找出出現次數最多的字元
  let maxCount = 0;
  let maxChar = '';

  for (let char in charCount) {
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// 測試
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**優點**：邏輯更清晰，分階段處理  
**缺點**：需要兩次遍歷

### 方法 3：使用 Map（ES6）

**思路**：使用 Map 來儲存字元和計數的對應關係。

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// 測試
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**優點**：使用 Map 更符合現代 JavaScript 風格  
**缺點**：對於簡單場景，物件可能更直觀

### 方法 4：使用 reduce（函數式風格）

**思路**：使用 `reduce` 和 `Object.entries` 來實作。

```javascript
function findMostFrequentChar(str) {
  // 計算每個字元的出現次數
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // 找出出現次數最多的字元
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// 測試
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**優點**：函數式風格，程式碼簡潔  
**缺點**：可讀性較差，效能略低

### 方法 5：處理多個相同最大值的情況

**思路**：如果有多個字元出現次數相同且都是最大值，回傳陣列或第一個遇到的。

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // 計算每個字元的出現次數
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // 找出所有出現次數等於最大值的字元
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // 回傳第一個遇到的（或回傳整個陣列）
  return mostFrequentChars[0];
  // 或回傳所有：return mostFrequentChars;
}

// 測試
console.log(findMostFrequentChar('aabbcc')); // 'a'（第一個遇到的）
```

## 3. Edge Cases

> 邊界情況處理

### 處理空字串

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // 或 throw new Error('String cannot be empty')
  }

  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### 處理大小寫

```javascript
function findMostFrequentChar(str, caseSensitive = true) {
  const processedStr = caseSensitive ? str : str.toLowerCase();
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// 測試
console.log(findMostFrequentChar('Hello', false)); // 'l'（不區分大小寫）
console.log(findMostFrequentChar('Hello', true)); // 'l'（區分大小寫）
```

### 處理空格和特殊字元

```javascript
function findMostFrequentChar(str, ignoreSpaces = false) {
  const processedStr = ignoreSpaces ? str.replace(/\s/g, '') : str;
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// 測試
console.log(findMostFrequentChar('hello world', true)); // 'l'（忽略空格）
console.log(findMostFrequentChar('hello world', false)); // ' '（空格）
```

## 4. Common Interview Questions

> 常見面試題目

### 題目 1：基本實作

請實作一個函式，找出字串中出現次數最多的字元。

<details>
<summary>點擊查看答案</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// 測試
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**關鍵點**：

- 使用物件或 Map 來記錄每個字元的出現次數
- 在遍歷過程中同時更新最大值
- 時間複雜度 O(n)，空間複雜度 O(k)

</details>

### 題目 2：優化版本

請優化上述函式，使其能夠處理多個相同最大值的情況。

<details>
<summary>點擊查看答案</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // 第一階段：計算每個字元的出現次數
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // 第二階段：找出所有出現次數等於最大值的字元
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // 根據需求回傳第一個或全部
  return mostFrequentChars[0]; // 或回傳 mostFrequentChars
}

// 測試
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### 題目 3：使用 Map 實作

請使用 ES6 的 Map 來實作這個函式。

<details>
<summary>點擊查看答案</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// 測試
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**：

- **Map**：更適合動態鍵值對，鍵可以是任何型別
- **Object**：更簡單直觀，適合字串鍵

</details>

## 5. Best Practices

> 最佳實踐

### 推薦做法

```javascript
// 1. 使用清晰的變數命名
function findMostFrequentChar(str) {
  const charCount = {}; // 清楚表達用途
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. 處理邊界情況
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. 在遍歷時同時更新最大值（一次遍歷）
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### 避免的做法

```javascript
// 1. 不要使用兩次遍歷（除非必要）
// ❌ 效能較差
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // 第二次遍歷
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. 不要忘記處理空字串
// ❌ 可能回傳 undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // 空字串時 maxChar 是 ''
}

// 3. 不要使用過於複雜的函數式寫法（除非團隊習慣）
// ❌ 可讀性較差
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> 面試總結

### 快速記憶

**實作要點**：

1. 使用物件或 Map 記錄每個字元的出現次數
2. 在遍歷過程中同時更新最大值
3. 時間複雜度 O(n)，空間複雜度 O(k)
4. 處理邊界情況（空字串、大小寫等）

**優化方向**：

- 一次遍歷完成（同時計數和找最大值）
- 使用 Map 處理複雜場景
- 處理多個相同最大值的情況
- 考慮大小寫、空格等特殊情況

### 面試回答範例

**Q: 請實作一個函式，找出字串中出現次數最多的字元。**

> "我會使用一個物件來記錄每個字元的出現次數，然後在遍歷字串的過程中同時更新最大值。具體實作是：初始化一個空物件 charCount 來儲存字元和計數，初始化 maxCount 和 maxChar 變數。然後遍歷字串，對每個字元，如果不在物件中就初始化為 0，然後增加計數。如果當前字元的計數大於 maxCount，就更新 maxCount 和 maxChar。最後回傳 maxChar。這個方法的時間複雜度是 O(n)，空間複雜度是 O(k)，其中 n 是字串長度，k 是不同字元的數量。"

## Reference

- [MDN - String](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)

