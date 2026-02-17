---
id: operators
title: '[Easy] 📄 JavaScript Operators'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. What is the difference between `==` and `===` ?

> `==` 和 `===` 有什么差异？

两者都是比较运算符号，`==` 是比较两个值是否相等，`===` 是比较两个值是否相等且类型也相等。因此后者也可以视为严格模式。

其中前者受限于 JavaScript 的设计，会自动转换类型，导致出现很多不直觉的结果，例如：

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

这对开发者来说，是很大的心智负担，因此普遍建议使用 `===` 来取代 `==`，避免预期外的错误。

**最佳实践**：永远使用 `===` 和 `!==`，除非你非常清楚为什么要用 `==`。

### 面试题目

#### 题目 1：基本类型比较

试判断以下表达式的结果：

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

- **`==`（相等运算符）**：会进行类型转换
  - 字串 `'1'` 会被转换为数字 `1`
  - 然后比较 `1 == 1`，结果为 `true`
- **`===`（严格相等运算符）**：不进行类型转换
  - `number` 和 `string` 类型不同，直接返回 `false`

**类型转换规则：**

```javascript
// == 的类型转换优先顺序
// 1. 如果有 number，将另一边转为 number
'1' == 1; // '1' → 1，结果 true
'2' == 2; // '2' → 2，结果 true
'0' == 0; // '0' → 0，结果 true

// 2. 如果有 boolean，将 boolean 转为 number
true == 1; // true → 1，结果 true
false == 0; // false → 0，结果 true
'1' == true; // '1' → 1, true → 1，结果 true

// 3. 字串转数字的陷阱
'' == 0; // '' → 0，结果 true
' ' == 0; // ' ' → 0，结果 true（空白字串转为 0）
```

#### 题目 2：null 和 undefined 的比较

试判断以下表达式的结果：

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

这是 JavaScript 的**特殊规则**：

- **`undefined == null`**：`true`
  - ES 规范特别规定：`null` 和 `undefined` 用 `==` 比较时相等
  - 这是唯一一个 `==` 有用的场景：检查变量是否为 `null` 或 `undefined`
- **`undefined === null`**：`false`
  - 它们是不同类型（`undefined` 是 `undefined` 类型，`null` 是 `object` 类型）
  - 严格比较时不相等

**实务应用：**

```javascript
// 检查变量是否为 null 或 undefined
function isNullOrUndefined(value) {
  return value == null; // 同时检查 null 和 undefined
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// 等价于（但更简洁）
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**注意陷阱：**

```javascript
// null 和 undefined 只与彼此相等
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// 但用 === 时，只与自己相等
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### 题目 3：综合比较

试判断以下表达式的结果：

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
0 === false; // false（类型不同：number vs boolean）
'' == false; // true（'' → 0, false → 0）
'' === false; // false（类型不同：string vs boolean）
null == false; // false（null 只等于 null 和 undefined）
undefined == false; // false（undefined 只等于 null 和 undefined）
```

**转换流程图：**

```javascript
// 0 == false 的转换过程
0 == false;
0 == 0; // false 转为数字 0
true; // 结果

// '' == false 的转换过程
'' == false;
'' == 0; // false 转为数字 0
0 == 0; // '' 转为数字 0
true; // 结果

// null == false 的特殊情况
null == false;
// null 不会转换！根据规范，null 只等于 null 和 undefined
false; // 结果
```

#### 题目 4：对象比较

试判断以下表达式的结果：

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

- 对象（包括数组、对象）的比较是**引用比较**
- 即使内容相同，但如果是不同的对象实例，就不相等
- `==` 和 `===` 对对象的行为一致（都比较引用）

```javascript
// 只有引用相同才相等
const arr1 = [];
const arr2 = arr1; // 引用相同的数组
arr1 == arr2; // true
arr1 === arr2; // true

// 即使内容相同，但是不同实例
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false（不同引用）
arr3 === arr4; // false（不同引用）

// 对象同理
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### 面试快速记忆

**`==` 的类型转换规则（从上到下优先）：**

1. `null == undefined` → `true`（特殊规则）
2. `number == string` → 将 string 转为 number
3. `number == boolean` → 将 boolean 转为 number
4. `string == boolean` → 都转为 number
5. 对象比较引用，不进行转换

**`===` 的规则（简单）：**

1. 类型不同 → `false`
2. 类型相同 → 比较值（基本类型）或引用（对象类型）

**最佳实践：**

```javascript
// ✅ 永远使用 ===
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ 唯一例外：检查 null/undefined
if (value == null) {
  // value 是 null 或 undefined
}

// ❌ 避免使用 ==（除了上述例外）
if (value == 0) {
} // 不好
if (name == 'Alice') {
} // 不好
```

**面试回答范例：**

> "`==` 会进行类型转换，可能导致不直觉的结果，例如 `0 == '0'` 为 `true`。`===` 是严格比较，不进行类型转换，类型不同就直接返回 `false`。
>
> 最佳实践是永远使用 `===`，唯一例外是 `value == null` 可以同时检查 `null` 和 `undefined`。
>
> 特别注意 `null == undefined` 为 `true`，但 `null === undefined` 为 `false`，这是 JavaScript 的特殊规定。"

---

## 2. What is the difference between `&&` and `||` ? Please explain short-circuit evaluation

> `&&` 和 `||` 有什么差异？请解释短路求值

### 基本概念

- **`&&`（AND）**：当左边为 `falsy` 时，直接返回左边的值，不会执行右边
- **`||`（OR）**：当左边为 `truthy` 时，直接返回左边的值，不会执行右边

### 短路求值范例

```js
// && 短路求值
const user = null;
const name = user && user.name; // user 为 falsy，直接返回 null，不会访问 user.name
console.log(name); // null（不会报错）

// || 短路求值
const defaultName = 'Guest';
const userName = user || defaultName; // user 为 falsy，返回右边的 defaultName
console.log(userName); // 'Guest'

// 实务应用
function greet(name) {
  const displayName = name || 'Anonymous'; // 如果没传 name，使用预设值
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### 常见陷阱 ⚠️

```js
// 问题：0 和 '' 也是 falsy
const count = 0;
const result = count || 10; // 0 是 falsy，返回 10
console.log(result); // 10（可能不是你想要的结果）

// 解决方案：使用 ?? (Nullish Coalescing)
const betterResult = count ?? 10; // 只有 null/undefined 才会返回 10
console.log(betterResult); // 0
```

---

## 3. What is the `?.` (Optional Chaining) operator ?

> 可选链运算符 `?.` 是什么？

### 问题场景

传统写法容易出错：

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ 危险：如果 address 不存在会报错
console.log(user.address.city); // 正常
console.log(otherUser.address.city); // TypeError: Cannot read property 'city' of undefined

// ✅ 安全但冗长
const city = user && user.address && user.address.city;
```

### 使用 Optional Chaining

```js
// ✅ 简洁且安全
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined（不会报错）

// 也可用于方法调用
user?.getName?.(); // 如果 getName 存在才执行

// 也可用于数组
const firstItem = users?.[0]?.name; // 安全访问第一个用户的名字
```

### 实务应用

```js
// API 回应处理
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

> 空值合并运算符 `??` 是什么？

### 与 `||` 的差异

```js
// || 会把所有 falsy 值视为假
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? 只把 null 和 undefined 视为空值
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### 实务应用

```js
// 处理可能为 0 的数值
function updateScore(newScore) {
  // ✅ 正确：0 是有效分数
  const score = newScore ?? 100; // 如果是 0 保留 0，只有 null/undefined 才用 100
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// 处理设定值
const config = {
  timeout: 0, // 0 毫秒是有效设定
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0（保留 0 的设定）
const retries = config.maxRetries ?? 3; // 3（null 使用预设值）
```

### 组合使用

```js
// ?? 和 ?. 常常一起使用
const userAge = user?.profile?.age ?? 18; // 如果没有年龄资料，预设 18

// 实务案例：表单预设值
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0, // 0 是有效年龄
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. What is the difference between `i++` and `++i` ?

> `i++` 和 `++i` 有什么差异？

### 基本差异

- **`i++`（后缀）**：先返回当前值，再加 1
- **`++i`（前缀）**：先加 1，再返回新值

### 范例

```js
let a = 5;
let b = a++; // b = 5, a = 6（先赋值给 b，再自增）
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6（先自增，再赋值给 d）
console.log(c, d); // 6, 6
```

### 实务影响

```js
// 在循环中通常没差异（因为不使用返回值）
for (let i = 0; i < 5; i++) {} // ✅ 常见
for (let i = 0; i < 5; ++i) {} // ✅ 也可以，某些人认为稍快（实际上现代 JS 引擎没差）

// 但在表达式中有差异
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1（先用 i=0 取值，再 i 变 1）
console.log(arr[++i]); // 3（i 先变 2，再取值）
```

### 最佳实践

```js
// ✅ 清晰：分开写
let count = 0;
const value = arr[count];
count++;

// ⚠️ 不建议：容易混淆
const value = arr[count++];
```

---

## 6. What is the Ternary Operator ? When should you use it ?

> 三元运算符是什么？什么时候应该使用？

### 基本语法

```js
condition ? valueIfTrue : valueIfFalse;
```

### 简单范例

```js
// 传统 if-else
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// ✅ 三元运算符：更简洁
const message = age >= 18 ? 'Adult' : 'Minor';
```

### 适合使用的场景

```js
// 1. 简单的条件赋值
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. JSX/模板中的条件渲染
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. 设定预设值（配合其他运算符）
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Welcome, ${displayName}!` : `Hello, ${displayName}`;

// 4. 函数返回值
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### 不建议使用的场景

```js
// ❌ 嵌套过深，难以阅读
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

// ❌ 复杂逻辑
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

## 快速记忆卡

| 运算符        | 用途       | 记忆点                 |
| ------------- | ---------- | ---------------------- |
| `===`         | 严格相等   | 永远用这个，忘掉 `==`  |
| `&&`          | 短路 AND   | 左假即停，返回假值     |
| `\|\|`        | 短路 OR    | 左真即停，返回真值     |
| `?.`          | 可选链     | 安全访问，不报错       |
| `??`          | 空值合并   | 只管 null/undefined    |
| `++i` / `i++` | 自增       | 前缀先加，后缀后加     |
| `? :`         | 三元运算符 | 简单条件用，嵌套要避免 |

## Reference

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
