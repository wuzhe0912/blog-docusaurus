---
id: primitive-vs-reference
title: '[Medium] 📄 Primitive vs Reference Types'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Primitive Types and Reference Types?

> 什麼是原始型別（Primitive Types）和參考型別（Reference Types）？

JavaScript 的資料型別分為兩大類：**原始型別**和**參考型別**。它們在記憶體儲存方式和傳遞行為上有本質的差異。

### 原始型別（Primitive Types）

**特點**：

- 儲存在**堆疊（Stack）**中
- 傳遞時**複製值本身**（Call by Value）
- 不可變的（Immutable）

**包含 7 種**：

```javascript
// 1. String（字串）
const str = 'hello';

// 2. Number（數字）
const num = 42;

// 3. Boolean（布林值）
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol（ES6）
const sym = Symbol('unique');

// 7. BigInt（ES2020）
const bigInt = 9007199254740991n;
```

### 參考型別（Reference Types）

**特點**：

- 儲存在**堆積（Heap）**中
- 傳遞時**複製參考（記憶體地址）**（Call by Reference）
- 可變的（Mutable）

**包含**：

```javascript
// 1. Object（物件）
const obj = { name: 'John' };

// 2. Array（陣列）
const arr = [1, 2, 3];

// 3. Function（函式）
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> 傳值（Call by Value）vs 傳址（Call by Reference）

### 傳值（Call by Value）- 原始型別

**行為**：複製值本身，修改副本不影響原值。

```javascript
// 原始型別：傳值
let a = 10;
let b = a; // 複製值

b = 20; // 修改 b

console.log(a); // 10（不受影響）
console.log(b); // 20
```

**記憶體示意圖**：

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ ← 獨立的值
├─────────┤
│ b: 20   │ ← 獨立的值（複製後修改）
└─────────┘
```

### 傳址（Call by Reference）- 參考型別

**行為**：複製記憶體地址，兩個變數指向同一個物件。

```javascript
// 參考型別：傳址
let obj1 = { name: 'John' };
let obj2 = obj1; // 複製記憶體地址

obj2.name = 'Jane'; // 透過 obj2 修改

console.log(obj1.name); // 'Jane'（被影響！）
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true（指向同一個物件）
```

**記憶體示意圖**：

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (同一個物件)     │
└─────────┘                    └──────────────────┘
```

## 3. Common Quiz Questions

> 常見測驗題

### 題目 1：原始型別的傳遞

```javascript
function changeValue(x) {
  x = 100;
  console.log('函式內 x:', x);
}

let num = 50;
changeValue(num);
console.log('函式外 num:', num);
```

<details>
<summary>點擊查看答案</summary>

```javascript
// 函式內 x: 100
// 函式外 num: 50
```

**解釋**：

- `num` 是原始型別（Number）
- 傳入函式時**複製值**，`x` 和 `num` 是兩個獨立的變數
- 修改 `x` 不會影響 `num`

```javascript
// 執行流程
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50（複製）
x = 100; // Stack: x = 100（只修改 x）
console.log(num); // Stack: num = 50（不受影響）
```

</details>

### 題目 2：參考型別的傳遞

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('函式內 obj.name:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('函式外 person.name:', person.name);
```

<details>
<summary>點擊查看答案</summary>

```javascript
// 函式內 obj.name: Changed
// 函式外 person.name: Changed
```

**解釋**：

- `person` 是參考型別（Object）
- 傳入函式時**複製記憶體地址**
- `obj` 和 `person` 指向**同一個物件**
- 透過 `obj` 修改物件內容，`person` 也會被影響

```javascript
// 記憶體示意
let person = { name: 'Original' }; // Heap: 建立物件 @0x001
changeObject(person); // Stack: obj = @0x001（複製地址）
obj.name = 'Changed'; // Heap: @0x001.name = 'Changed'
console.log(person.name); // Heap: @0x001.name（同一個物件）
```

</details>

### 題目 3：重新賦值 vs 修改屬性

```javascript
function test1(obj) {
  obj.name = 'Modified'; // 修改屬性
}

function test2(obj) {
  obj = { name: 'New Object' }; // 重新賦值
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>點擊查看答案</summary>

```javascript
// A: Modified
// B: Modified（不是 'New Object'！）
```

**解釋**：

**test1：修改屬性**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // ✅ 修改原物件的屬性
}
// person 和 obj 指向同一個物件，所以會被修改
```

**test2：重新賦值**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // ❌ 只改變 obj 的指向
}
// obj 現在指向新物件，但 person 仍指向原物件
```

**記憶體示意圖**：

```text
// test1 之前
person ────> { name: 'Original' }
obj    ────> { name: 'Original' } (同一個)

// test1 之後
person ────> { name: 'Modified' }
obj    ────> { name: 'Modified' } (同一個)

// test2 執行
person ────> { name: 'Modified' }    (不變)
obj    ────> { name: 'New Object' }  (新物件)

// test2 結束後
person ────> { name: 'Modified' }    (仍然不變)
// obj 被銷毀，新物件被垃圾回收
```

</details>

### 題目 4：陣列的傳遞

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>點擊查看答案</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**解釋**：

- `modifyArray`：修改原陣列內容，`numbers` 被影響
- `reassignArray`：只改變參數的指向，`numbers` 不受影響

</details>

### 題目 5：比較運算

```javascript
// 原始型別比較
let a = 10;
let b = 10;
console.log('A:', a === b);

// 參考型別比較
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>點擊查看答案</summary>

```javascript
// A: true
// B: false
// C: true
```

**解釋**：

**原始型別**：比較值

```javascript
10 === 10; // true（值相同）
```

**參考型別**：比較記憶體地址

```javascript
obj1 === obj2; // false（不同物件，不同地址）
obj1 === obj3; // true（指向同一個物件）
```

**記憶體示意**：

```text
obj1 ────> @0x001: { value: 10 }
obj2 ────> @0x002: { value: 10 } (內容相同但地址不同)
obj3 ────> @0x001: { value: 10 } (與 obj1 相同地址)
```

</details>

## 4. Shallow Copy vs Deep Copy

> 淺拷貝 vs 深拷貝

### 淺拷貝（Shallow Copy）

**定義**：只複製第一層，巢狀物件仍然是參考。

#### 方法 1：展開運算子（Spread Operator）

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

// 修改第一層：不影響原物件
copy.name = 'Jane';
console.log(original.name); // 'John'（不受影響）

// 修改巢狀物件：影響原物件！
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung'（被影響！）
```

#### 方法 2：Object.assign()

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John'（不受影響）
```

#### 方法 3：陣列的淺拷貝

```javascript
const arr1 = [1, 2, 3];

// 方法 1：展開運算子
const arr2 = [...arr1];

// 方法 2：slice()
const arr3 = arr1.slice();

// 方法 3：Array.from()
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1（不受影響）
```

### 深拷貝（Deep Copy）

**定義**：完全複製所有層級，包括巢狀物件。

#### 方法 1：JSON.parse + JSON.stringify（最常用）

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

// 修改巢狀物件：不影響原物件
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'（不受影響）

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming']（不受影響）
```

**限制**：

```javascript
const obj = {
  date: new Date(), // ❌ 會變成字串
  func: () => {}, // ❌ 會被忽略
  undef: undefined, // ❌ 會被忽略
  symbol: Symbol('test'), // ❌ 會被忽略
  regexp: /abc/, // ❌ 會變成 {}
  circular: null, // ❌ 循環參考會報錯
};
obj.circular = obj; // 循環參考

JSON.parse(JSON.stringify(obj)); // 會出錯或遺失資料
```

#### 方法 2：structuredClone()（現代瀏覽器）

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

// 可以正確複製 Date 等特殊物件
console.log(copy.date instanceof Date); // true
```

**優點**：

- ✅ 支援 Date、RegExp、Map、Set 等
- ✅ 支援循環參考
- ✅ 效能較好

**限制**：

- ❌ 不支援函式
- ❌ 不支援 Symbol

#### 方法 3：遞迴實作深拷貝

```javascript
function deepClone(obj) {
  // 處理 null 和非物件
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 處理陣列
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // 處理 Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // 處理 RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // 處理物件
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// 使用範例
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'（不受影響）
```

#### 方法 4：使用 Lodash

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### 淺拷貝 vs 深拷貝比較

| 特性     | 淺拷貝       | 深拷貝       |
| -------- | ------------ | ------------ |
| 複製層級 | 只複製第一層 | 複製所有層級 |
| 巢狀物件 | 仍是參考     | 完全獨立     |
| 效能     | 快           | 慢           |
| 記憶體   | 省           | 多           |
| 使用場景 | 簡單物件     | 複雜巢狀結構 |

## 5. Common Pitfalls

> 常見陷阱

### 陷阱 1：以為參數傳遞可以改變原始型別

```javascript
// ❌ 錯誤理解
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5（不會變成 6！）

// ✅ 正確寫法
count = increment(count); // 需要接收回傳值
console.log(count); // 6
```

### 陷阱 2：以為重新賦值可以改變外部物件

```javascript
// ❌ 錯誤理解
function resetObject(obj) {
  obj = { name: 'Reset' }; // 只改變參數指向
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original'（沒有被 reset！）

// ✅ 正確寫法 1：修改屬性
function resetObject(obj) {
  obj.name = 'Reset';
}

// ✅ 正確寫法 2：回傳新物件
function resetObject(obj) {
  return { name: 'Reset' };
}
person = resetObject(person);
```

### 陷阱 3：以為展開運算子是深拷貝

```javascript
// ❌ 錯誤理解
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // 淺拷貝！

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane'（被影響了！）

// ✅ 正確寫法：深拷貝
const copy = JSON.parse(JSON.stringify(original));
// 或
const copy = structuredClone(original);
```

### 陷阱 4：const 的誤解

```javascript
// const 只是不能重新賦值，不是不可變！

const obj = { name: 'John' };

// ❌ 不能重新賦值
obj = { name: 'Jane' }; // TypeError: Assignment to constant variable

// ✅ 可以修改屬性
obj.name = 'Jane'; // 正常運作
obj.age = 30; // 正常運作

// 如果要真正的不可變
const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane'; // 靜默失敗（嚴格模式下會報錯）
console.log(immutableObj.name); // 'John'（沒有被修改）
```

### 陷阱 5：迴圈中的參考問題

```javascript
// ❌ 常見錯誤
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // 都指向同一個物件！
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]
// 都是同一個物件，最終值都是 2

// ✅ 正確寫法：每次創建新物件
const arr = [];

for (let i = 0; i < 3; i++) {
  arr.push({ value: i }); // 每次創建新物件
}

console.log(arr);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practices

> 最佳實踐

### ✅ 推薦做法

```javascript
// 1. 需要複製物件時，明確使用拷貝方法
const original = { name: 'John', age: 30 };

// 淺拷貝（簡單物件）
const copy1 = { ...original };

// 深拷貝（巢狀物件）
const copy2 = structuredClone(original);

// 2. 函式不要依賴副作用來修改參數
// ❌ 不好
function addItem(arr, item) {
  arr.push(item); // 修改原陣列
}

// ✅ 好
function addItem(arr, item) {
  return [...arr, item]; // 回傳新陣列
}

// 3. 使用 const 防止意外重新賦值
const config = { theme: 'dark' };
// config = {}; // 會報錯

// 4. 需要不可變物件時使用 Object.freeze
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ 避免的做法

```javascript
// 1. 不要依賴參數傳遞來修改原始型別
function increment(num) {
  num++; // ❌ 無效
}

// 2. 不要混淆淺拷貝和深拷貝
const copy = { ...nested }; // ❌ 以為是深拷貝

// 3. 不要在迴圈中重複使用同一個物件參考
for (let i = 0; i < 3; i++) {
  arr.push(obj); // ❌ 都指向同一個物件
}
```

## 7. Interview Summary

> 面試總結

### 快速記憶

**原始型別（Primitive）**：

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- 傳值（Call by Value）
- 儲存在 Stack
- 不可變（Immutable）

**參考型別（Reference）**：

- Object, Array, Function, Date, RegExp, etc.
- 傳址（Call by Reference）
- 儲存在 Heap
- 可變（Mutable）

### 面試回答範例

**Q: JavaScript 是 Call by Value 還是 Call by Reference？**

> JavaScript **對所有型別都是 Call by Value**，但參考型別傳遞的「值」是記憶體地址。
>
> - 原始型別：傳遞值的副本，修改不影響原值
> - 參考型別：傳遞地址的副本，透過地址可以修改原物件
> - 但如果重新賦值（改變地址），則不影響原物件

## Reference

- [MDN - Data Structures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [深入淺出 JavaScript](https://javascript.info/object-copy)
