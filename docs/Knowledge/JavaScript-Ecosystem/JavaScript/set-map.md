---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Set and Map?

> 什麼是 Set 和 Map？

`Set` 和 `Map` 是 ES6 引入的兩種新的資料結構，它們提供了比傳統物件和陣列更適合特定場景的解決方案。

### Set（集合）

**定義**：`Set` 是一種**值唯一**的集合，類似於數學中的集合概念。

**特點**：

- 儲存的值**不會重複**
- 使用 `===` 來判斷值是否相等
- 保持插入順序
- 可以儲存任何類型的值（原始型別或物件）

**基本用法**：

```javascript
// 建立 Set
const set = new Set();

// 新增值
set.add(1);
set.add(2);
set.add(2); // 重複值不會被加入
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// 檢查值是否存在
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// 刪除值
set.delete(2);
console.log(set.has(2)); // false

// 清空 Set
set.clear();
console.log(set.size); // 0
```

**從陣列建立 Set**：

```javascript
// 去除陣列中的重複值
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// 轉回陣列
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// 簡寫
const uniqueArr2 = [...new Set(arr)];
```

### Map（映射）

**定義**：`Map` 是一種**鍵值對**的集合，類似於物件，但鍵可以是任何類型。

**特點**：

- 鍵可以是任何類型（字串、數字、物件、函式等）
- 保持插入順序
- 有 `size` 屬性
- 迭代順序與插入順序一致

**基本用法**：

```javascript
// 建立 Map
const map = new Map();

// 新增鍵值對
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// 取得值
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// 檢查鍵是否存在
console.log(map.has('name')); // true

// 刪除鍵值對
map.delete('name');

// 取得大小
console.log(map.size); // 3

// 清空 Map
map.clear();
```

**從陣列建立 Map**：

```javascript
// 從二維陣列建立
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// 從物件建立
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Set 與陣列的差異

| 特性     | Set                    | Array                    |
| -------- | ---------------------- | ------------------------ |
| 重複值   | 不允許                 | 允許                     |
| 索引存取 | 不支援                 | 支援                     |
| 查找效能 | O(1)                   | O(n)                     |
| 插入順序 | 保持                   | 保持                     |
| 常用方法 | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**使用場景**：

```javascript
// ✅ 適合使用 Set：需要唯一值
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ 適合使用 Set：快速檢查存在性
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('已訪問過首頁');
}

// ✅ 適合使用 Array：需要索引或重複值
const scores = [100, 95, 100, 90]; // 允許重複
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Map 與物件的差異

| 特性     | Map          | Object               |
| -------- | ------------ | -------------------- |
| 鍵的類型 | 任何類型     | 字串或 Symbol        |
| 大小     | `size` 屬性  | 需手動計算           |
| 預設鍵   | 無           | 有原型鏈             |
| 迭代順序 | 插入順序     | ES2015+ 保持插入順序 |
| 效能     | 頻繁增刪較快 | 一般情況較快         |
| JSON     | 不直接支援   | 原生支援             |

**使用場景**：

```javascript
// ✅ 適合使用 Map：鍵不是字串
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ 適合使用 Map：需要頻繁增刪
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ 適合使用 Object：靜態結構、需要 JSON
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config); // 可直接序列化
```

## 4. Common Interview Questions

> 常見面試題目

### 題目 1：去除陣列重複值

請實作一個函式，去除陣列中的重複值。

```javascript
function removeDuplicates(arr) {
  // 你的實作
}
```

<details>
<summary>點擊查看答案</summary>

**方法 1：使用 Set（推薦）**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**方法 2：使用 filter + indexOf**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**方法 3：使用 reduce**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**效能比較**：

- Set 方法：O(n)，最快
- filter + indexOf：O(n²)，較慢
- reduce + includes：O(n²)，較慢

</details>

### 題目 2：檢查陣列是否有重複值

請實作一個函式，檢查陣列中是否有重複值。

```javascript
function hasDuplicates(arr) {
  // 你的實作
}
```

<details>
<summary>點擊查看答案</summary>

**方法 1：使用 Set（推薦）**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**方法 2：使用 Set 的 has 方法**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**方法 3：使用 indexOf**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**效能比較**：

- Set 方法 1：O(n)，最快
- Set 方法 2：O(n)，平均情況下可能提前結束
- indexOf 方法：O(n²)，較慢

</details>

### 題目 3：計算元素出現次數

請實作一個函式，計算陣列中每個元素出現的次數。

```javascript
function countOccurrences(arr) {
  // 你的實作
}
```

<details>
<summary>點擊查看答案</summary>

**方法 1：使用 Map（推薦）**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**方法 2：使用 reduce + Map**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**方法 3：轉換為物件**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**使用 Map 的優勢**：

- 鍵可以是任何類型（物件、函式等）
- 有 `size` 屬性
- 迭代順序與插入順序一致

</details>

### 題目 4：找出兩個陣列的交集

請實作一個函式，找出兩個陣列的交集（共同元素）。

```javascript
function intersection(arr1, arr2) {
  // 你的實作
}
```

<details>
<summary>點擊查看答案</summary>

**方法 1：使用 Set**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**方法 2：使用 filter + Set**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**方法 3：使用 filter + includes**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**效能比較**：

- Set 方法：O(n + m)，最快
- filter + includes：O(n × m)，較慢

</details>

### 題目 5：找出兩個陣列的差集

請實作一個函式，找出兩個陣列的差集（在 arr1 中但不在 arr2 中的元素）。

```javascript
function difference(arr1, arr2) {
  // 你的實作
}
```

<details>
<summary>點擊查看答案</summary>

**方法 1：使用 Set**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**方法 2：使用 Set 去重後再過濾**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**方法 3：使用 includes**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**效能比較**：

- Set 方法：O(n + m)，最快
- includes 方法：O(n × m)，較慢

</details>

### 題目 6：實作 LRU Cache

請使用 Map 實作一個 LRU（Least Recently Used）快取。

```javascript
class LRUCache {
  constructor(capacity) {
    // 你的實作
  }

  get(key) {
    // 你的實作
  }

  put(key, value) {
    // 你的實作
  }
}
```

<details>
<summary>點擊查看答案</summary>

**實作**：

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // 將該鍵移到最後（表示最近使用）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // 如果鍵已存在，先刪除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // 如果容量已滿，刪除最舊的鍵（第一個）
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // 新增鍵值對（會自動放在最後）
    this.cache.set(key, value);
  }
}

// 使用範例
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // 移除鍵 2
console.log(cache.get(2)); // -1（已被移除）
console.log(cache.get(3)); // 'three'
```

**說明**：

- Map 保持插入順序，第一個鍵是最舊的
- `get` 時將鍵移到最後，表示最近使用
- `put` 時如果容量已滿，刪除第一個鍵

</details>

### 題目 7：使用物件作為 Map 的鍵

請說明以下程式碼的輸出結果。

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>點擊查看答案</summary>

```javascript
// 'first'
// 'second'
// 2
```

**解釋**：

- `obj1` 和 `obj2` 雖然內容相同，但是**不同的物件實例**
- Map 使用**引用比較**（reference comparison），不是值比較
- 因此 `obj1` 和 `obj2` 被視為不同的鍵
- 如果使用普通物件作為 Map，會將物件轉為字串 `[object Object]`，導致所有物件都變成同一個鍵

**對比普通物件**：

```javascript
// 普通物件：鍵會被轉為字串
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second'（被覆蓋）
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]']（只有一個鍵）

// Map：保持物件引用
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet 與 WeakMap

> WeakSet 與 WeakMap 的差異

### WeakSet

**特點**：

- 只能儲存**物件**（不能儲存原始型別）
- **弱引用**：如果物件沒有其他引用，會被垃圾回收
- 沒有 `size` 屬性
- 不可迭代
- 沒有 `clear` 方法

**使用場景**：標記物件，避免記憶體洩漏

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// 當 obj1 沒有其他引用時，會被垃圾回收
// weakSet 中的引用也會自動清除
```

### WeakMap

**特點**：

- 鍵只能是**物件**（不能是原始型別）
- **弱引用**：如果鍵物件沒有其他引用，會被垃圾回收
- 沒有 `size` 屬性
- 不可迭代
- 沒有 `clear` 方法

**使用場景**：儲存物件的私有資料，避免記憶體洩漏

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// 當 obj1 沒有其他引用時，會被垃圾回收
// weakMap 中的鍵值對也會自動清除
```

### WeakSet/WeakMap vs Set/Map 比較

| 特性       | Set/Map      | WeakSet/WeakMap |
| ---------- | ------------ | --------------- |
| 鍵/值類型  | 任何類型     | 只能是物件      |
| 弱引用     | 否           | 是              |
| 可迭代     | 是           | 否              |
| size 屬性  | 有           | 無              |
| clear 方法 | 有           | 無              |
| 垃圾回收   | 不會自動清除 | 會自動清除      |

## 6. Best Practices

> 最佳實踐

### 推薦做法

```javascript
// 1. 需要唯一值時使用 Set
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. 需要快速查找時使用 Set
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // 允許訪問
}

// 3. 鍵不是字串時使用 Map
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. 需要頻繁增刪時使用 Map
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. 需要關聯物件資料且避免記憶體洩漏時使用 WeakMap
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### 避免的做法

```javascript
// 1. 不要用 Set 來取代陣列的所有功能
// ❌ 不好：需要索引時仍用 Set
const set = new Set([1, 2, 3]);
// set[0] // undefined，無法用索引存取

// ✅ 好：需要索引時用陣列
const arr = [1, 2, 3];
arr[0]; // 1

// 2. 不要用 Map 來取代物件的所有功能
// ❌ 不好：簡單的靜態結構用 Map
const config = new Map();
config.set('apiUrl', 'https://api.example.com');
config.set('timeout', 5000);

// ✅ 好：簡單結構用物件
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. 不要混淆 Set 和 Map
// ❌ 錯誤：Set 沒有鍵值對
const set = new Set();
set.set('key', 'value'); // TypeError: set.set is not a function

// ✅ 正確：Map 才有鍵值對
const map = new Map();
map.set('key', 'value');
```

## 7. Interview Summary

> 面試總結

### 快速記憶

**Set（集合）**：

- 值唯一，不重複
- 快速查找：O(1)
- 適合：去重、快速檢查存在性

**Map（映射）**：

- 鍵值對，鍵可以是任何類型
- 保持插入順序
- 適合：非字串鍵、頻繁增刪

**WeakSet/WeakMap**：

- 弱引用，自動垃圾回收
- 鍵/值只能是物件
- 適合：避免記憶體洩漏

### 面試回答範例

**Q: 什麼時候應該使用 Set 而不是陣列？**

> "當需要確保值唯一或需要快速檢查值是否存在時，應該使用 Set。Set 的 `has` 方法是 O(1) 時間複雜度，而陣列的 `includes` 是 O(n)。例如去除陣列重複值或檢查使用者權限時，Set 會更有效率。"

**Q: Map 和物件的差異是什麼？**

> "Map 的鍵可以是任何類型，包括物件、函式等，而物件的鍵只能是字串或 Symbol。Map 有 `size` 屬性可以直接取得大小，而物件需要手動計算。Map 保持插入順序，且沒有原型鏈，適合儲存純資料。當需要將物件作為鍵或需要頻繁增刪時，Map 是更好的選擇。"

**Q: WeakMap 和 Map 的差異是什麼？**

> "WeakMap 的鍵只能是物件，且使用弱引用。當鍵物件沒有其他引用時，WeakMap 中的對應條目會被自動垃圾回收，這可以避免記憶體洩漏。WeakMap 不可迭代，也沒有 `size` 屬性。適合用於儲存物件的私有資料或元資料，當物件被銷毀時，相關資料也會自動清除。"

## Reference

- [MDN - Set](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
