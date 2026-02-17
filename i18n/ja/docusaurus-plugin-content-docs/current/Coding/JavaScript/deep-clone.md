---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> Deep Clone とは？

**ディープクローン（Deep Clone）**とは、新しいオブジェクトを作成し、元のオブジェクトとそのすべてのネストされたオブジェクトや配列のすべてのプロパティを再帰的にコピーすることです。ディープクローン後のオブジェクトは元のオブジェクトと完全に独立しており、一方を変更しても他方には影響しません。

### シャローコピー vs ディープコピー

**シャローコピー（Shallow Clone）**：オブジェクトの第一階層のプロパティのみをコピーし、ネストされたオブジェクトは依然として参照を共有します。

```javascript
// シャローコピーの例
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ 元のオブジェクトも変更された
```

**ディープコピー（Deep Clone）**：すべての階層のプロパティを再帰的にコピーし、完全に独立させます。

```javascript
// ディープコピーの例
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ 元のオブジェクトは影響を受けない
```

## 2. Implementation Methods

> 実装方法

### 方法 1：JSON.parse と JSON.stringify を使用

**メリット**：シンプルで高速
**デメリット**：関数、undefined、Symbol、Date、RegExp、Map、Set などの特殊な型を処理できない

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// テスト
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

**制限**：

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date が空オブジェクトになる
console.log(cloned.func); // undefined ❌ 関数が失われる
console.log(cloned.undefined); // undefined ✅ ただし JSON.stringify が除去する
console.log(cloned.symbol); // undefined ❌ Symbol が失われる
console.log(cloned.regex); // {} ❌ RegExp が空オブジェクトになる
```

### 方法 2：再帰的実装（基本型とオブジェクトの処理）

```javascript
function deepClone(obj) {
  // null と基本型の処理
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Date の処理
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp の処理
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 配列の処理
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // オブジェクトの処理
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// テスト
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

console.log(original.date.getFullYear()); // 2024 ✅ 影響を受けない
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### 方法 3：完全な実装（Map、Set、Symbol などの処理）

```javascript
function deepClone(obj, map = new WeakMap()) {
  // null と基本型の処理
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 循環参照の処理
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Date の処理
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp の処理
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Map の処理
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Set の処理
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // 配列の処理
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // オブジェクトの処理
  const cloned = {};
  map.set(obj, cloned);

  // Symbol プロパティの処理
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // 通常のプロパティをコピー
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Symbol プロパティをコピー
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// テスト
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

### 方法 4：循環参照の処理

```javascript
function deepClone(obj, map = new WeakMap()) {
  // null と基本型の処理
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 循環参照の処理
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Date の処理
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp の処理
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 配列の処理
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // オブジェクトの処理
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// 循環参照のテスト
const original = {
  name: 'John',
};
original.self = original; // 循環参照

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ 循環参照を正しく処理
console.log(cloned !== original); // true ✅ 異なるオブジェクト
```

## 3. Common Interview Questions

> よくある面接の質問

### 問題 1：基本的なディープクローンの実装

オブジェクトと配列をディープクローンできる `deepClone` 関数を実装してください。

<details>
<summary>クリックして回答を表示</summary>

```javascript
function deepClone(obj) {
  // null と基本型の処理
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Date の処理
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp の処理
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 配列の処理
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // オブジェクトの処理
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// テスト
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

### 問題 2：循環参照の処理

循環参照を処理できる `deepClone` 関数を実装してください。

<details>
<summary>クリックして回答を表示</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // null と基本型の処理
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 循環参照の処理
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Date の処理
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // RegExp の処理
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // 配列の処理
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // オブジェクトの処理
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// 循環参照のテスト
const original = {
  name: 'John',
};
original.self = original; // 循環参照

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**ポイント**：

- `WeakMap` を使用して処理済みのオブジェクトを追跡する
- 新しいオブジェクトを作成する前に、すでに map に存在するかチェックする
- 存在する場合は、map 内の参照を直接返し、無限再帰を回避する

</details>

### 問題 3：JSON.parse と JSON.stringify の制限

`JSON.parse(JSON.stringify())` を使用したディープクローンの制限を説明し、解決策を提示してください。

<details>
<summary>クリックして回答を表示</summary>

**制限**：

1. **関数を処理できない**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **undefined を処理できない**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined（ただしプロパティは除去される）❌
   ```

3. **Symbol を処理できない**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Symbol プロパティが失われる
   ```

4. **Date が文字列になる**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ 文字列になる
   ```

5. **RegExp が空オブジェクトになる**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ 空オブジェクトになる
   ```

6. **Map、Set を処理できない**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ 空オブジェクトになる
   ```

7. **循環参照を処理できない**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ エラー：Converting circular structure to JSON
   ```

**解決策**：再帰的な実装を使用し、異なる型に対して特別な処理を行います。

</details>

## 4. Best Practices

> ベストプラクティス

### 推奨される方法

```javascript
// 1. 要件に合った方法を選択する
// 基本的なオブジェクトと配列のみを処理する場合は、シンプルな再帰実装を使用
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

// 2. 複雑な型を処理する必要がある場合は、完全な実装を使用
function completeDeepClone(obj, map = new WeakMap()) {
  // ... 完全な実装
}

// 3. WeakMap を使用して循環参照を処理
// WeakMap はガベージコレクションを妨げないため、オブジェクト参照の追跡に適している
```

### 避けるべき方法

```javascript
// 1. JSON.parse(JSON.stringify()) を過度に使用しない
// ❌ 関数、Symbol、Date などの特殊な型が失われる
const cloned = JSON.parse(JSON.stringify(obj));

// 2. 循環参照の処理を忘れない
// ❌ スタックオーバーフローを引き起こす
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // 無限再帰
  }
  return cloned;
}

// 3. Date、RegExp などの特殊な型の処理を忘れない
// ❌ これらの型は特別な処理が必要
```

## 5. Interview Summary

> 面接のまとめ

### クイックメモ

**ディープクローン**：

- **定義**：オブジェクトとそのすべてのネストされたプロパティを再帰的にコピーし、完全に独立させる
- **方法**：再帰的実装、JSON.parse(JSON.stringify())、structuredClone()
- **キーポイント**：特殊な型の処理、循環参照、Symbol プロパティ

**実装のポイント**：

1. 基本型と null の処理
2. Date、RegExp などの特殊オブジェクトの処理
3. 配列とオブジェクトの処理
4. 循環参照の処理（WeakMap を使用）
5. Symbol プロパティの処理

### 面接回答の例

**Q: Deep Clone 関数を実装してください。**

> "ディープクローンとは、完全に独立した新しいオブジェクトを作成し、すべてのネストされたプロパティを再帰的にコピーすることです。私の実装では、まず基本型と null を処理し、次に Date、RegExp、配列、オブジェクトなどの異なる型に対して特別な処理を行います。循環参照を処理するために、WeakMap を使用して処理済みのオブジェクトを追跡します。Symbol プロパティについては、Object.getOwnPropertySymbols を使用して取得しコピーします。これにより、ディープクローン後のオブジェクトが元のオブジェクトと完全に独立し、一方を変更しても他方に影響しないことが保証されます。"

**Q: JSON.parse(JSON.stringify()) にはどのような制限がありますか？**

> "この方法の主な制限は以下の通りです：1) 関数を処理できず、関数が除去される；2) undefined と Symbol を処理できず、これらのプロパティが無視される；3) Date オブジェクトが文字列になる；4) RegExp が空オブジェクトになる；5) Map、Set などの特殊なデータ構造を処理できない；6) 循環参照を処理できず、エラーが発生する。これらの特殊なケースを処理する必要がある場合は、再帰的な実装を使用すべきです。"

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/ja/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
