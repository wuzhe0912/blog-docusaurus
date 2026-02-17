---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> 問題の説明

文字列を受け取り、その文字列内で最も多く出現する文字を返す関数を実装してください。

### 例

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> 実装方法

### 方法 1：オブジェクトによるカウント（基本版）

**考え方**：文字列を走査し、オブジェクトを使って各文字の出現回数を記録し、最も多く出現する文字を見つけます。

```javascript
function findMostFrequentChar(str) {
  // 文字とカウントを保存するオブジェクトを初期化
  const charCount = {};

  // 最大カウントと文字を記録する変数を初期化
  let maxCount = 0;
  let maxChar = '';

  // 文字列を走査
  for (let char of str) {
    // 文字がオブジェクトにない場合、カウントを 0 に設定
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // この文字のカウントを増やす
    charCount[char]++;

    // この文字のカウントが最大カウントより大きい場合
    // 最大カウントと最大文字を更新
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // 最大文字を返す
  return maxChar;
}

// テスト
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**時間計算量**：O(n)、n は文字列の長さ
**空間計算量**：O(k)、k は異なる文字の数

### 方法 2：先にカウントしてから最大値を見つける（2段階）

**考え方**：まず一度走査して全ての文字の出現回数を計算し、もう一度走査して最大値を見つけます。

```javascript
function findMostFrequentChar(str) {
  // 第1段階：各文字の出現回数を計算
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // 第2段階：最も多く出現する文字を見つける
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

// テスト
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**メリット**：ロジックがより明確で、段階的に処理
**デメリット**：2回の走査が必要

### 方法 3：Map を使用（ES6）

**考え方**：Map を使って文字とカウントの対応関係を保存します。

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

// テスト
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**メリット**：Map を使うことでより現代的な JavaScript スタイルに
**デメリット**：シンプルなシナリオでは、オブジェクトの方が直感的な場合がある

### 方法 4：reduce を使用（関数型スタイル）

**考え方**：`reduce` と `Object.entries` を使って実装します。

```javascript
function findMostFrequentChar(str) {
  // 各文字の出現回数を計算
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // 最も多く出現する文字を見つける
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// テスト
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**メリット**：関数型スタイルで、コードが簡潔
**デメリット**：可読性が低く、パフォーマンスもやや劣る

### 方法 5：同じ最大値が複数ある場合の処理

**考え方**：複数の文字の出現回数が同じで、すべて最大値の場合、配列を返すか最初に見つかったものを返します。

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // 各文字の出現回数を計算
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // 出現回数が最大値と等しい全ての文字を見つける
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // 最初に見つかったものを返す（または配列全体を返す）
  return mostFrequentChars[0];
  // または全て返す：return mostFrequentChars;
}

// テスト
console.log(findMostFrequentChar('aabbcc')); // 'a'（最初に見つかったもの）
```

## 3. Edge Cases

> エッジケースの処理

### 空文字列の処理

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // または throw new Error('String cannot be empty')
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

### 大文字小文字の処理

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

// テスト
console.log(findMostFrequentChar('Hello', false)); // 'l'（大文字小文字を区別しない）
console.log(findMostFrequentChar('Hello', true)); // 'l'（大文字小文字を区別する）
```

### スペースと特殊文字の処理

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

// テスト
console.log(findMostFrequentChar('hello world', true)); // 'l'（スペースを無視）
console.log(findMostFrequentChar('hello world', false)); // ' '（スペース）
```

## 4. Common Interview Questions

> よくある面接の質問

### 問題 1：基本的な実装

文字列内で最も多く出現する文字を見つける関数を実装してください。

<details>
<summary>クリックして回答を表示</summary>

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

// テスト
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**ポイント**：

- オブジェクトまたは Map を使って各文字の出現回数を記録
- 走査中に同時に最大値を更新
- 時間計算量 O(n)、空間計算量 O(k)

</details>

### 問題 2：最適化版

上記の関数を最適化し、同じ最大値が複数ある場合を処理できるようにしてください。

<details>
<summary>クリックして回答を表示</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // 第1段階：各文字の出現回数を計算
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // 第2段階：出現回数が最大値と等しい全ての文字を見つける
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // 必要に応じて最初のものまたは全てを返す
  return mostFrequentChars[0]; // または mostFrequentChars を返す
}

// テスト
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### 問題 3：Map を使った実装

ES6 の Map を使ってこの関数を実装してください。

<details>
<summary>クリックして回答を表示</summary>

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

// テスト
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**：

- **Map**：動的なキーバリューペアに適しており、キーは任意の型が可能
- **Object**：よりシンプルで直感的、文字列キーに適している

</details>

## 5. Best Practices

> ベストプラクティス

### 推奨される方法

```javascript
// 1. 明確な変数名を使用
function findMostFrequentChar(str) {
  const charCount = {}; // 用途を明確に表現
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. エッジケースを処理
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. 走査中に同時に最大値を更新（1回の走査）
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

### 避けるべき方法

```javascript
// 1. 2回の走査を使用しない（必要な場合を除く）
// ❌ パフォーマンスが劣る
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // 2回目の走査
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. 空文字列の処理を忘れない
// ❌ undefined を返す可能性がある
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // 空文字列の場合 maxChar は ''
}

// 3. 過度に複雑な関数型の書き方を使用しない（チームの慣習でない限り）
// ❌ 可読性が低い
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> 面接のまとめ

### クイックメモ

**実装のポイント**：

1. オブジェクトまたは Map を使って各文字の出現回数を記録
2. 走査中に同時に最大値を更新
3. 時間計算量 O(n)、空間計算量 O(k)
4. エッジケースの処理（空文字列、大文字小文字など）

**最適化の方向性**：

- 1回の走査で完了（カウントと最大値の検索を同時に）
- Map を使って複雑なシナリオに対応
- 同じ最大値が複数ある場合の処理
- 大文字小文字、スペースなどの特殊なケースを考慮

### 面接回答の例

**Q: 文字列内で最も多く出現する文字を見つける関数を実装してください。**

> "各文字の出現回数を記録するためにオブジェクトを使用し、文字列を走査する過程で同時に最大値を更新します。具体的な実装は：空のオブジェクト charCount を初期化して文字とカウントを保存し、maxCount と maxChar 変数を初期化します。次に文字列を走査し、各文字について、オブジェクトにない場合は 0 に初期化し、カウントを増やします。現在の文字のカウントが maxCount より大きければ、maxCount と maxChar を更新します。最後に maxChar を返します。この方法の時間計算量は O(n)、空間計算量は O(k) です。n は文字列の長さ、k は異なる文字の数です。"

## Reference

- [MDN - String](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
