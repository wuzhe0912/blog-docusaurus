---
id: object-path-parsing
title: '[Medium] Object Path Parsing'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> 問題の説明

オブジェクトパス解析関数を実装し、パス文字列に基づいてネストされたオブジェクトの値を取得および設定できるようにします。

### 要件

1. **`get` 関数**：パスに基づいてオブジェクトの値を取得

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **`set` 関数**：パスに基づいてオブジェクトの値を設定

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> get 関数の実装

### 方法 1：split と reduce を使用

**考え方**：パス文字列を配列に分割し、`reduce` を使ってオブジェクトを階層的にアクセスします。

```javascript
function get(obj, path, defaultValue) {
  // 境界条件の処理
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // パス文字列を配列に分割
  const keys = path.split('.');

  // reduce を使って階層的にアクセス
  const result = keys.reduce((current, key) => {
    // 現在の値が null または undefined の場合、undefined を返す
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // 結果が undefined の場合、デフォルト値を返す
  return result !== undefined ? result : defaultValue;
}

// テスト
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
console.log(get(obj, 'a.b.d[2].e')); // undefined（配列インデックスの処理が必要）
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### 方法 2：配列インデックスのサポート

**考え方**：パス内の配列インデックス（`'a.b[0].c'` など）を処理します。

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // 正規表現でマッチ：プロパティ名または配列インデックス
  // 'a', 'b', '[0]', 'c' などにマッチ
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // 配列インデックスの処理 [0] -> 0
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// テスト
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

### 方法 3：完全な実装（境界条件の処理）

```javascript
function get(obj, path, defaultValue) {
  // 境界条件の処理
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // パスの解析：'a.b.c' と 'a.b[0].c' 形式をサポート
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // 現在の値が null または undefined の場合、デフォルト値を返す
    if (result == null) {
      return defaultValue;
    }

    // 配列インデックスの処理
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// テスト
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
console.log(get(obj, '', obj)); // obj（空のパスは元のオブジェクトを返す）
```

## 3. Implementation: set Function

> set 関数の実装

### 方法 1：基本的な実装

**考え方**：パスに基づいてネストされたオブジェクト構造を作成し、値を設定します。

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // パスの解析
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // ネスト構造の作成
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // 配列インデックスの処理
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // キーが存在しないかオブジェクトでない場合、新しいオブジェクトを作成
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // 最後のキーの値を設定
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // 現在が配列でない場合、変換が必要
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

// テスト
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### 方法 2：完全な実装（配列とオブジェクトの処理）

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

  // 最後から2番目のキーまで走査し、ネスト構造を作成
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // 配列インデックスの処理
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // 配列であることを確認
      if (!Array.isArray(current)) {
        // オブジェクトを配列に変換（既存のインデックスを保持）
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // インデックスが存在することを確認
      if (current[index] == null) {
        // 次のキーが配列かオブジェクトかを判断
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // オブジェクトキーの処理
      if (current[key] == null) {
        // 次のキーが配列かオブジェクトかを判断
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // 既に存在するがオブジェクトでない場合、変換が必要
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // 最後のキーの値を設定
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

// テスト
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }

set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### 方法 3：簡略版（オブジェクトのみ、配列インデックスなし）

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // ネスト構造の作成（最後のキーを除く）
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // 最後のキーの値を設定
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// テスト
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Common Interview Questions

> よくある面接の質問

### 問題 1：基本的な get 関数の実装

パス文字列に基づいてネストされたオブジェクトの値を取得する `get` 関数を実装してください。

<details>
<summary>クリックして回答を表示</summary>

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

// テスト
const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**ポイント**：

- null/undefined のケースを処理
- split でパスを分割
- オブジェクトのプロパティに階層的にアクセス
- パスが存在しない場合はデフォルト値を返す

</details>

### 問題 2：配列インデックスをサポートする get 関数

`get` 関数を拡張して、`'a.b[0].c'` のような配列インデックスをサポートしてください。

<details>
<summary>クリックして回答を表示</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // 正規表現でパスを解析
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // 配列インデックスの処理
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// テスト
const obj = {
  a: {
    b: [2, 3, { c: 4 }],
  },
};

console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**ポイント**：

- 正規表現 `/[^.[\]]+|\[(\d+)\]/g` でパスを解析
- `[0]` 形式の配列インデックスを処理
- 文字列インデックスを数値に変換

</details>

### 問題 3：set 関数の実装

パス文字列に基づいてネストされたオブジェクトの値を設定する `set` 関数を実装してください。

<details>
<summary>クリックして回答を表示</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // ネスト構造の作成（最後のキーを除く）
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // 最後のキーの値を設定
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// テスト
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**ポイント**：

- ネストされたオブジェクト構造を階層的に作成
- 中間パスのオブジェクトが存在することを確認
- 最後に目標値を設定

</details>

### 問題 4：get と set の完全な実装

配列インデックスのサポートと各種境界条件の処理を含む、完全な `get` と `set` 関数を実装してください。

<details>
<summary>クリックして回答を表示</summary>

```javascript
// get 関数
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

// set 関数
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // ネスト構造の作成
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

  // 値を設定
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

// テスト
const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1

set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Best Practices

> ベストプラクティス

### 推奨される方法

```javascript
// 1. 境界条件を処理する
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. 正規表現で複雑なパスを解析する
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. set で次のキーの型を判断する
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. nullish coalescing でデフォルト値を処理する
return result ?? defaultValue;
```

### 避けるべき方法

```javascript
// 1. ❌ null/undefined の処理を忘れない
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // エラーの可能性
}

// 2. ❌ 元のオブジェクトを直接変更しない（明示的に要求されない限り）
function set(obj, path, value) {
  // 直接変更するのではなく、変更後のオブジェクトを返すべき
}

// 3. ❌ 配列とオブジェクトの違いを無視しない
// 次のキーが配列インデックスかオブジェクトキーかを判断する必要がある
```

## 6. Interview Summary

> 面接のまとめ

### クイックメモ

**オブジェクトパス解析**：

- **get 関数**：パスに基づいて値を取得、null/undefined を処理、デフォルト値をサポート
- **set 関数**：パスに基づいて値を設定、ネスト構造を自動作成
- **パス解析**：正規表現で `'a.b.c'` と `'a.b[0].c'` 形式を処理
- **境界処理**：null、undefined、空文字列などのケースを処理

**実装のポイント**：

1. パス解析：`split('.')` または正規表現
2. 階層的アクセス：ループまたは `reduce` を使用
3. 境界処理：null/undefined をチェック
4. 配列サポート：`[0]` 形式のインデックスを処理

### 面接回答の例

**Q: パスに基づいてオブジェクトの値を取得する関数を実装してください。**

> "`get` 関数を実装します。オブジェクト、パス文字列、デフォルト値を受け取ります。まず境界条件を処理し、オブジェクトが null またはパスが文字列でない場合はデフォルト値を返します。次に `split('.')` でパスをキーの配列に分割し、ループを使ってオブジェクトのプロパティに階層的にアクセスします。各アクセス時に現在の値が null または undefined かチェックし、そうであればデフォルト値を返します。最後に結果が undefined であればデフォルト値を、そうでなければ結果を返します。配列インデックスをサポートする必要がある場合は、正規表現 `/[^.[\]]+|\[(\d+)\]/g` を使ってパスを解析し、`[0]` 形式のインデックスを処理できます。"

**Q: パスに基づいてオブジェクトの値を設定する関数はどのように実装しますか？**

> "`set` 関数を実装します。オブジェクト、パス文字列、値を受け取ります。まずパスをキーの配列に解析し、最後から2番目のキーまで走査して、ネストされたオブジェクト構造を階層的に作成します。各中間キーについて、存在しないかオブジェクトでない場合は新しいオブジェクトを作成します。次のキーが配列インデックス形式の場合は配列を作成します。最後に最後のキーの値を設定します。これにより、パス内のすべての中間オブジェクトが存在することが確認され、目標値が正しく設定されます。"

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
