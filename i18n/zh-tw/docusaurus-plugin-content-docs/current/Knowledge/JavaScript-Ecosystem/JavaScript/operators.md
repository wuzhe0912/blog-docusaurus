---
id: operators
title: '[Easy] 📄 JavaScript Operators'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. What is the difference between `==` and `===` ?

> `==` 和 `===` 有什麼差異？

兩者都是比較運算符號，`==` 是比較兩個值是否相等，`===` 是比較兩個值是否相等且型別也相等。因此後者也可以視為嚴格模式。

其中前者受限於 JavaScript 的設計，會自動轉換類型，導致出現很多不直覺的結果，例如：

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

這對開發者來說，是很大的心智負擔，因此普遍建議使用 `===` 來取代 `==`，避免預期外的錯誤。

**最佳實踐**：永遠使用 `===` 和 `!==`，除非你非常清楚為什麼要用 `==`。

### 面試題目

#### 題目 1：基本類型比較

試判斷以下表達式的結果：

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**答案：**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**解析：**

- **`==`（相等運算符）**：會進行類型轉換
  - 字串 `'1'` 會被轉換為數字 `1`
  - 然後比較 `1 == 1`，結果為 `true`
- **`===`（嚴格相等運算符）**：不進行類型轉換
  - `number` 和 `string` 類型不同，直接返回 `false`

**類型轉換規則：**

```javascript
// == 的類型轉換優先順序
// 1. 如果有 number，將另一邊轉為 number
'1' == 1; // '1' → 1，結果 true
'2' == 2; // '2' → 2，結果 true
'0' == 0; // '0' → 0，結果 true

// 2. 如果有 boolean，將 boolean 轉為 number
true == 1; // true → 1，結果 true
false == 0; // false → 0，結果 true
'1' == true; // '1' → 1, true → 1，結果 true

// 3. 字串轉數字的陷阱
'' == 0; // '' → 0，結果 true
' ' == 0; // ' ' → 0，結果 true（空白字串轉為 0）
```

#### 題目 2：null 和 undefined 的比較

試判斷以下表達式的結果：

```javascript
undefined == null; // ?
undefined === null; // ?
```

**答案：**

```javascript
undefined == null; // true
undefined === null; // false
```

**解析：**

這是 JavaScript 的**特殊規則**：

- **`undefined == null`**：`true`
  - ES 規範特別規定：`null` 和 `undefined` 用 `==` 比較時相等
  - 這是唯一一個 `==` 有用的場景：檢查變數是否為 `null` 或 `undefined`
- **`undefined === null`**：`false`
  - 它們是不同類型（`undefined` 是 `undefined` 類型，`null` 是 `object` 類型）
  - 嚴格比較時不相等

**實務應用：**

```javascript
// 檢查變數是否為 null 或 undefined
function isNullOrUndefined(value) {
  return value == null; // 同時檢查 null 和 undefined
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// 等價於（但更簡潔）
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**注意陷阱：**

```javascript
// null 和 undefined 只與彼此相等
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// 但用 === 時，只與自己相等
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### 題目 3：綜合比較

試判斷以下表達式的結果：

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**答案：**

```javascript
0 == false; // true（false → 0）
0 === false; // false（類型不同：number vs boolean）
'' == false; // true（'' → 0, false → 0）
'' === false; // false（類型不同：string vs boolean）
null == false; // false（null 只等於 null 和 undefined）
undefined == false; // false（undefined 只等於 null 和 undefined）
```

**轉換流程圖：**

```javascript
// 0 == false 的轉換過程
0 == false;
0 == 0; // false 轉為數字 0
true; // 結果

// '' == false 的轉換過程
'' == false;
'' == 0; // false 轉為數字 0
0 == 0; // '' 轉為數字 0
true; // 結果

// null == false 的特殊情況
null == false;
// null 不會轉換！根據規範，null 只等於 null 和 undefined
false; // 結果
```

#### 題目 4：對象比較

試判斷以下表達式的結果：

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**答案：**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**解析：**

- 對象（包括陣列、物件）的比較是**引用比較**
- 即使內容相同，但如果是不同的對象實例，就不相等
- `==` 和 `===` 對對象的行為一致（都比較引用）

```javascript
// 只有引用相同才相等
const arr1 = [];
const arr2 = arr1; // 引用相同的陣列
arr1 == arr2; // true
arr1 === arr2; // true

// 即使內容相同，但是不同實例
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false（不同引用）
arr3 === arr4; // false（不同引用）

// 物件同理
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### 面試快速記憶

**`==` 的類型轉換規則（從上到下優先）：**

1. `null == undefined` → `true`（特殊規則）
2. `number == string` → 將 string 轉為 number
3. `number == boolean` → 將 boolean 轉為 number
4. `string == boolean` → 都轉為 number
5. 對象比較引用，不進行轉換

**`===` 的規則（簡單）：**

1. 類型不同 → `false`
2. 類型相同 → 比較值（基本類型）或引用（對象類型）

**最佳實踐：**

```javascript
// ✅ 永遠使用 ===
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ 唯一例外：檢查 null/undefined
if (value == null) {
  // value 是 null 或 undefined
}

// ❌ 避免使用 ==（除了上述例外）
if (value == 0) {
} // 不好
if (name == 'Alice') {
} // 不好
```

**面試回答範例：**

> "`==` 會進行類型轉換，可能導致不直覺的結果，例如 `0 == '0'` 為 `true`。`===` 是嚴格比較，不進行類型轉換，類型不同就直接返回 `false`。
>
> 最佳實踐是永遠使用 `===`，唯一例外是 `value == null` 可以同時檢查 `null` 和 `undefined`。
>
> 特別注意 `null == undefined` 為 `true`，但 `null === undefined` 為 `false`，這是 JavaScript 的特殊規定。"

---

## 2. What is the difference between `&&` and `||` ? Please explain short-circuit evaluation

> `&&` 和 `||` 有什麼差異？請解釋短路求值

### 基本概念

- **`&&`（AND）**：當左邊為 `falsy` 時，直接返回左邊的值，不會執行右邊
- **`||`（OR）**：當左邊為 `truthy` 時，直接返回左邊的值，不會執行右邊

### 短路求值範例

```js
// && 短路求值
const user = null;
const name = user && user.name; // user 為 falsy，直接返回 null，不會訪問 user.name
console.log(name); // null（不會報錯）

// || 短路求值
const defaultName = 'Guest';
const userName = user || defaultName; // user 為 falsy，返回右邊的 defaultName
console.log(userName); // 'Guest'

// 實務應用
function greet(name) {
  const displayName = name || 'Anonymous'; // 如果沒傳 name，使用預設值
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### 常見陷阱 ⚠️

```js
// 問題：0 和 '' 也是 falsy
const count = 0;
const result = count || 10; // 0 是 falsy，返回 10
console.log(result); // 10（可能不是你想要的結果）

// 解決方案：使用 ?? (Nullish Coalescing)
const betterResult = count ?? 10; // 只有 null/undefined 才會返回 10
console.log(betterResult); // 0
```

---

## 3. What is the `?.` (Optional Chaining) operator ?

> 可選鏈運算符 `?.` 是什麼？

### 問題場景

傳統寫法容易出錯：

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ 危險：如果 address 不存在會報錯
console.log(user.address.city); // 正常
console.log(otherUser.address.city); // TypeError: Cannot read property 'city' of undefined

// ✅ 安全但冗長
const city = user && user.address && user.address.city;
```

### 使用 Optional Chaining

```js
// ✅ 簡潔且安全
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined（不會報錯）

// 也可用於方法調用
user?.getName?.(); // 如果 getName 存在才執行

// 也可用於陣列
const firstItem = users?.[0]?.name; // 安全訪問第一個用戶的名字
```

### 實務應用

```js
// API 回應處理
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Unknown User';
  const email = response?.data?.user?.email ?? 'No email';

  console.log(`User: ${userName}`);
  console.log(`Email: ${email}`);
}

// DOM 操作
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. What is the `??` (Nullish Coalescing) operator ?

> 空值合併運算符 `??` 是什麼？

### 與 `||` 的差異

```js
// || 會把所有 falsy 值視為假
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? 只把 null 和 undefined 視為空值
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### 實務應用

```js
// 處理可能為 0 的數值
function updateScore(newScore) {
  // ✅ 正確：0 是有效分數
  const score = newScore ?? 100; // 如果是 0 保留 0，只有 null/undefined 才用 100
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// 處理設定值
const config = {
  timeout: 0, // 0 毫秒是有效設定
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0（保留 0 的設定）
const retries = config.maxRetries ?? 3; // 3（null 使用預設值）
```

### 組合使用

```js
// ?? 和 ?. 常常一起使用
const userAge = user?.profile?.age ?? 18; // 如果沒有年齡資料，預設 18

// 實務案例：表單預設值
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0, // 0 是有效年齡
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. What is the difference between `i++` and `++i` ?

> `i++` 和 `++i` 有什麼差異？

### 基本差異

- **`i++`（後綴）**：先返回當前值，再加 1
- **`++i`（前綴）**：先加 1，再返回新值

### 範例

```js
let a = 5;
let b = a++; // b = 5, a = 6（先賦值給 b，再自增）
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6（先自增，再賦值給 d）
console.log(c, d); // 6, 6
```

### 實務影響

```js
// 在迴圈中通常沒差異（因為不使用返回值）
for (let i = 0; i < 5; i++) {} // ✅ 常見
for (let i = 0; i < 5; ++i) {} // ✅ 也可以，某些人認為稍快（實際上現代 JS 引擎沒差）

// 但在表達式中有差異
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1（先用 i=0 取值，再 i 變 1）
console.log(arr[++i]); // 3（i 先變 2，再取值）
```

### 最佳實踐

```js
// ✅ 清晰：分開寫
let count = 0;
const value = arr[count];
count++;

// ⚠️ 不建議：容易混淆
const value = arr[count++];
```

---

## 6. What is the Ternary Operator ? When should you use it ?

> 三元運算符是什麼？什麼時候應該使用？

### 基本語法

```js
condition ? valueIfTrue : valueIfFalse;
```

### 簡單範例

```js
// 傳統 if-else
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// ✅ 三元運算符：更簡潔
const message = age >= 18 ? 'Adult' : 'Minor';
```

### 適合使用的場景

```js
// 1. 簡單的條件賦值
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. JSX/模板中的條件渲染
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. 設定預設值（配合其他運算符）
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Welcome, ${displayName}!` : `Hello, ${displayName}`;

// 4. 函數返回值
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### 不建議使用的場景

```js
// ❌ 巢狀過深，難以閱讀
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ 使用 if-else 或 switch 更清楚
let result;
if (condition1) result = value1;
else if (condition2) result = value2;
else if (condition3) result = value3;
else result = value4;

// ❌ 複雜邏輯
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ 拆解成多行
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess = isAdmin || hasReadPermission;
```

---

## 快速記憶卡

| 運算符        | 用途       | 記憶點                 |
| ------------- | ---------- | ---------------------- |
| `===`         | 嚴格相等   | 永遠用這個，忘掉 `==`  |
| `&&`          | 短路 AND   | 左假即停，返回假值     |
| `\|\|`        | 短路 OR    | 左真即停，返回真值     |
| `?.`          | 可選鏈     | 安全訪問，不報錯       |
| `??`          | 空值合併   | 只管 null/undefined    |
| `++i` / `i++` | 自增       | 前綴先加，後綴後加     |
| `? :`         | 三元運算符 | 簡單條件用，巢狀要避免 |

## Reference

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
