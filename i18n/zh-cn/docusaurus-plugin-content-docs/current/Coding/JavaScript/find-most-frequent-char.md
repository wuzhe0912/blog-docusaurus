---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> 问题描述

实现一个函数，接收一个字符串，并返回该字符串中出现次数最多的字符。

### 示例

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> 实现方法

### 方法 1：使用对象计数（基础版）

**思路**：遍历字符串，使用对象记录每个字符的出现次数，然后找出出现次数最多的字符。

```javascript
function findMostFrequentChar(str) {
  // 初始化对象来存储字符和计数
  const charCount = {};

  // 初始化记录最大计数和字符的变量
  let maxCount = 0;
  let maxChar = '';

  // 遍历字符串
  for (let char of str) {
    // 如果字符不在对象中，设置计数为 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // 增加这个字符的计数
    charCount[char]++;

    // 如果这个字符的计数大于最大计数
    // 更新最大计数和最大字符
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // 返回最大字符
  return maxChar;
}

// 测试
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**时间复杂度**：O(n)，其中 n 是字符串长度
**空间复杂度**：O(k)，其中 k 是不同字符的数量

### 方法 2：先计数再找最大值（两阶段）

**思路**：先遍历一次计算所有字符的出现次数，再遍历一次找出最大值。

```javascript
function findMostFrequentChar(str) {
  // 第一阶段：计算每个字符的出现次数
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // 第二阶段：找出出现次数最多的字符
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

// 测试
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**优点**：逻辑更清晰，分阶段处理
**缺点**：需要两次遍历

### 方法 3：使用 Map（ES6）

**思路**：使用 Map 来存储字符和计数的对应关系。

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

// 测试
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**优点**：使用 Map 更符合现代 JavaScript 风格
**缺点**：对于简单场景，对象可能更直观

### 方法 4：使用 reduce（函数式风格）

**思路**：使用 `reduce` 和 `Object.entries` 来实现。

```javascript
function findMostFrequentChar(str) {
  // 计算每个字符的出现次数
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // 找出出现次数最多的字符
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// 测试
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**优点**：函数式风格，代码简洁
**缺点**：可读性较差，性能略低

### 方法 5：处理多个相同最大值的情况

**思路**：如果有多个字符出现次数相同且都是最大值，返回数组或第一个遇到的。

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // 计算每个字符的出现次数
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // 找出所有出现次数等于最大值的字符
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // 返回第一个遇到的（或返回整个数组）
  return mostFrequentChars[0];
  // 或返回所有：return mostFrequentChars;
}

// 测试
console.log(findMostFrequentChar('aabbcc')); // 'a'（第一个遇到的）
```

## 3. Edge Cases

> 边界情况处理

### 处理空字符串

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

### 处理大小写

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

// 测试
console.log(findMostFrequentChar('Hello', false)); // 'l'（不区分大小写）
console.log(findMostFrequentChar('Hello', true)); // 'l'（区分大小写）
```

### 处理空格和特殊字符

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

// 测试
console.log(findMostFrequentChar('hello world', true)); // 'l'（忽略空格）
console.log(findMostFrequentChar('hello world', false)); // ' '（空格）
```

## 4. Common Interview Questions

> 常见面试题目

### 题目 1：基本实现

请实现一个函数，找出字符串中出现次数最多的字符。

<details>
<summary>点击查看答案</summary>

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

// 测试
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**关键点**：

- 使用对象或 Map 来记录每个字符的出现次数
- 在遍历过程中同时更新最大值
- 时间复杂度 O(n)，空间复杂度 O(k)

</details>

### 题目 2：优化版本

请优化上述函数，使其能够处理多个相同最大值的情况。

<details>
<summary>点击查看答案</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // 第一阶段：计算每个字符的出现次数
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // 第二阶段：找出所有出现次数等于最大值的字符
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // 根据需求返回第一个或全部
  return mostFrequentChars[0]; // 或返回 mostFrequentChars
}

// 测试
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### 题目 3：使用 Map 实现

请使用 ES6 的 Map 来实现这个函数。

<details>
<summary>点击查看答案</summary>

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

// 测试
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**：

- **Map**：更适合动态键值对，键可以是任何类型
- **Object**：更简单直观，适合字符串键

</details>

## 5. Best Practices

> 最佳实践

### 推荐做法

```javascript
// 1. 使用清晰的变量命名
function findMostFrequentChar(str) {
  const charCount = {}; // 清楚表达用途
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. 处理边界情况
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. 在遍历时同时更新最大值（一次遍历）
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
// 1. 不要使用两次遍历（除非必要）
// ❌ 性能较差
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // 第二次遍历
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. 不要忘记处理空字符串
// ❌ 可能返回 undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // 空字符串时 maxChar 是 ''
}

// 3. 不要使用过于复杂的函数式写法（除非团队习惯）
// ❌ 可读性较差
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> 面试总结

### 快速记忆

**实现要点**：

1. 使用对象或 Map 记录每个字符的出现次数
2. 在遍历过程中同时更新最大值
3. 时间复杂度 O(n)，空间复杂度 O(k)
4. 处理边界情况（空字符串、大小写等）

**优化方向**：

- 一次遍历完成（同时计数和找最大值）
- 使用 Map 处理复杂场景
- 处理多个相同最大值的情况
- 考虑大小写、空格等特殊情况

### 面试回答示例

**Q: 请实现一个函数，找出字符串中出现次数最多的字符。**

> "我会使用一个对象来记录每个字符的出现次数，然后在遍历字符串的过程中同时更新最大值。具体实现是：初始化一个空对象 charCount 来存储字符和计数，初始化 maxCount 和 maxChar 变量。然后遍历字符串，对每个字符，如果不在对象中就初始化为 0，然后增加计数。如果当前字符的计数大于 maxCount，就更新 maxCount 和 maxChar。最后返回 maxChar。这个方法的时间复杂度是 O(n)，空间复杂度是 O(k)，其中 n 是字符串长度，k 是不同字符的数量。"

## Reference

- [MDN - String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
