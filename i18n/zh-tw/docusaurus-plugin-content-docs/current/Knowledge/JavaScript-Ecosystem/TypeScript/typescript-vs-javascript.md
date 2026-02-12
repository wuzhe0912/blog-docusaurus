---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> 什麼是 TypeScript？

TypeScript 是由 Microsoft 開發的開源程式語言，它是 JavaScript 的**超集（Superset）**，意味著所有有效的 JavaScript 程式碼都是有效的 TypeScript 程式碼。

**核心特點**：

- 在 JavaScript 基礎上加入**靜態型別系統**
- 編譯時進行型別檢查
- 編譯後轉換為純 JavaScript
- 提供更好的開發體驗和工具支援

## 2. What are the differences between TypeScript and JavaScript?

> TypeScript 與 JavaScript 的差異是什麼？

### 主要差異

| 特性     | JavaScript             | TypeScript             |
| -------- | ---------------------- | ---------------------- |
| 型別系統 | 動態型別（執行時檢查） | 靜態型別（編譯時檢查） |
| 編譯     | 不需要編譯             | 需要編譯為 JavaScript  |
| 型別註解 | 不支援                 | 支援型別註解           |
| 錯誤檢查 | 執行時發現錯誤         | 編譯時發現錯誤         |
| IDE 支援 | 基本支援               | 強大的自動完成和重構   |
| 學習曲線 | 較低                   | 較高                   |

### 型別系統差異

**JavaScript（動態型別）**：

```javascript
// JavaScript：執行時才檢查型別
let value = 10;
value = 'hello'; // 可以改變型別
value = true; // 可以改變型別

function add(a, b) {
  return a + b;
}

add(1, 2); // 3
add('1', '2'); // '12'（字串連接）
add(1, '2'); // '12'（型別轉換）
```

**TypeScript（靜態型別）**：

```typescript
// TypeScript：編譯時檢查型別
let value: number = 10;
value = 'hello'; // ❌ 編譯錯誤：Type 'string' is not assignable to type 'number'

function add(a: number, b: number): number {
  return a + b;
}

add(1, 2); // ✅ 3
add('1', '2'); // ❌ 編譯錯誤：Argument of type 'string' is not assignable to parameter of type 'number'
add(1, '2'); // ❌ 編譯錯誤
```

### 編譯過程

**JavaScript**：

```javascript
// 直接執行，不需要編譯
console.log('Hello World');
```

**TypeScript**：

```typescript
// TypeScript 原始碼
let message: string = 'Hello World';
console.log(message);

// ↓ 編譯後轉換為 JavaScript
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> 為什麼要使用 TypeScript？

### 優點

1. **早期發現錯誤**

   ```typescript
   // 編譯時就能發現錯誤，不需要等到執行時
   function calculateArea(width: number, height: number): number {
     return width * height;
   }

   calculateArea('10', 20); // ❌ 編譯錯誤：立即發現問題
   ```

2. **更好的 IDE 支援**

   ```typescript
   interface User {
     name: string;
     age: number;
     email: string;
   }

   const user: User = {
     name: 'John',
     age: 30,
     // IDE 會自動提示缺少 email 屬性
   };
   ```

3. **程式碼可讀性**

   ```typescript
   // 型別註解讓函式意圖更清楚
   function processUser(user: User, callback: (result: string) => void): void {
     // ...
   }
   ```

4. **重構更安全**
   ```typescript
   // 修改介面時，TypeScript 會找出所有需要更新的地方
   interface User {
     name: string;
     age: number;
     // 新增 email 屬性時，所有使用 User 的地方都會報錯
   }
   ```

### 缺點

1. **需要編譯步驟**：增加開發流程複雜度
2. **學習曲線**：需要學習型別系統
3. **檔案大小**：型別資訊會增加原始碼大小（但編譯後不會影響）
4. **設定複雜**：需要配置 `tsconfig.json`

## 4. Common Interview Questions

> 常見面試題目

### 題目 1：型別檢查時機

請說明以下程式碼在 JavaScript 和 TypeScript 中的行為差異。

```javascript
// JavaScript
function add(a, b) {
  return a + b;
}

console.log(add(1, 2)); // ?
console.log(add('1', '2')); // ?
console.log(add(1, '2')); // ?
```

```typescript
// TypeScript
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(1, 2)); // ?
console.log(add('1', '2')); // ?
console.log(add(1, '2')); // ?
```

<details>
<summary>點擊查看答案</summary>

**JavaScript 輸出**：

```javascript
console.log(add(1, 2)); // 3
console.log(add('1', '2')); // '12'（字串連接）
console.log(add(1, '2')); // '12'（型別轉換）
```

**TypeScript 行為**：

```typescript
console.log(add(1, 2)); // ✅ 3（編譯通過）
console.log(add('1', '2')); // ❌ 編譯錯誤：Argument of type 'string' is not assignable to parameter of type 'number'
console.log(add(1, '2')); // ❌ 編譯錯誤：Argument of type 'string' is not assignable to parameter of type 'number'
```

**解釋**：

- JavaScript 在**執行時**進行型別轉換，可能產生非預期結果
- TypeScript 在**編譯時**檢查型別，提前發現錯誤

</details>

### 題目 2：型別推斷

請說明以下程式碼中 TypeScript 如何推斷型別。

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;

value1 = 'world'; // ?
value2 = 20; // ?
value3 = 'yes'; // ?
```

<details>
<summary>點擊查看答案</summary>

```typescript
let value1 = 10; // TypeScript 推斷為 number
let value2 = 'hello'; // TypeScript 推斷為 string
let value3 = true; // TypeScript 推斷為 boolean

value1 = 'world'; // ❌ 編譯錯誤：Type 'string' is not assignable to type 'number'
value2 = 20; // ❌ 編譯錯誤：Type 'number' is not assignable to type 'string'
value3 = 'yes'; // ❌ 編譯錯誤：Type 'string' is not assignable to type 'boolean'
```

**解釋**：

- TypeScript 會根據初始值**自動推斷型別**
- 推斷後無法改變型別（除非明確宣告為 `any` 或 `union` 型別）

**明確指定型別**：

```typescript
let value1: number = 10;
let value2: string = 'hello';
let value3: boolean = true;
```

</details>

### 題目 3：執行時行為

請說明 TypeScript 編譯後的 JavaScript 程式碼與原始 TypeScript 的差異。

```typescript
// TypeScript
interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  return `Hello, ${user.name}!`;
}

const user: User = { name: 'John', age: 30 };
console.log(greet(user));
```

<details>
<summary>點擊查看答案</summary>

**編譯後的 JavaScript**：

```javascript
// 所有型別資訊都被移除
function greet(user) {
  return `Hello, ${user.name}!`;
}

const user = { name: 'John', age: 30 };
console.log(greet(user));
```

**關鍵點**：

- TypeScript 的**型別註解在編譯後完全消失**
- 編譯後的 JavaScript 與純 JavaScript 完全相同
- TypeScript 只在**開發階段**提供型別檢查，不影響執行時效能
- 這就是為什麼 TypeScript 是「編譯時型別系統」而非「執行時型別系統」

</details>

### 題目 4：型別錯誤 vs 執行時錯誤

請比較以下兩種錯誤的差異。

```typescript
// 情況 1：TypeScript 編譯時錯誤
function calculate(a: number, b: number): number {
  return a + b;
}

calculate('1', '2'); // ❌ 編譯錯誤

// 情況 2：JavaScript 執行時錯誤
function process(data) {
  return data.value.toUpperCase();
}

process(null); // ❌ 執行時錯誤：Cannot read property 'toUpperCase' of null
```

<details>
<summary>點擊查看答案</summary>

**情況 1：TypeScript 編譯時錯誤**

- **發現時機**：編譯時（開發階段）
- **影響**：無法編譯成功，必須修正才能執行
- **優點**：提前發現問題，避免部署錯誤程式碼

**情況 2：JavaScript 執行時錯誤**

- **發現時機**：執行時（使用者使用時）
- **影響**：程式崩潰，影響使用者體驗
- **缺點**：需要實際執行才能發現問題

**TypeScript 的解決方案**：

```typescript
function process(data: { value: string } | null) {
  if (data === null) {
    return '';
  }
  return data.value.toUpperCase();
}

process(null); // ✅ 編譯通過，執行時安全
```

</details>

## 5. Best Practices

> 最佳實踐

### 推薦做法

```typescript
// 1. 明確指定函式回傳型別
function add(a: number, b: number): number {
  return a + b;
}

// 2. 使用介面定義複雜物件結構
interface User {
  name: string;
  age: number;
  email?: string; // 可選屬性
}

// 3. 避免使用 any，優先使用 unknown
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. 使用型別別名提高可讀性
type UserID = string;
type UserName = string;

function getUser(id: UserID): User {
  // ...
}
```

### 避免的做法

```typescript
// 1. 不要過度使用 any
function process(data: any) {
  // ❌ 失去型別檢查的意義
  return data.value;
}

// 2. 不要忽略型別錯誤
function add(a: number, b: number): number {
  return a + b; // ❌ 如果這裡有錯誤，不要用 @ts-ignore 忽略
}

// 3. 不要混合型別註解和推斷
let value: number = 10; // ✅ 明確指定
let value = 10; // ✅ 讓 TypeScript 推斷
let value: number = 10; // ⚠️ 兩者都有時，確保一致
```

## 6. Interview Summary

> 面試總結

### 快速記憶

**TypeScript 核心概念**：

- JavaScript 的超集，加入靜態型別系統
- 編譯時檢查型別，執行時與 JavaScript 相同
- 提供更好的開發體驗和錯誤預防

**主要差異**：

- **型別系統**：靜態（TypeScript）vs 動態（JavaScript）
- **錯誤發現**：編譯時（TypeScript）vs 執行時（JavaScript）
- **開發工具**：強大的 IDE 支援（TypeScript）vs 基本支援（JavaScript）

### 面試回答範例

**Q: TypeScript 和 JavaScript 的主要差異是什麼？**

> "TypeScript 是 JavaScript 的超集，主要差異在於 TypeScript 加入了靜態型別系統。JavaScript 是動態型別語言，型別檢查在執行時進行；而 TypeScript 是靜態型別語言，型別檢查在編譯時進行。這讓開發者能夠在開發階段就發現型別相關的錯誤，而不是等到執行時才發現。TypeScript 編譯後會轉換為純 JavaScript，所以執行時的行為與 JavaScript 完全相同。"

**Q: 為什麼要使用 TypeScript？**

> "TypeScript 的主要優點包括：1) 早期發現錯誤，在編譯時就能發現型別錯誤；2) 更好的 IDE 支援，提供自動完成和重構功能；3) 提高程式碼可讀性，型別註解讓函式意圖更清楚；4) 重構更安全，修改型別時會自動找出所有需要更新的地方。不過也需要考慮學習曲線和編譯步驟的額外成本。"

## Reference

- [TypeScript 官方文件](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
