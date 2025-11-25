---
id: basic-types
title: '[Easy] 基本型別與型別註解'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> TypeScript 的基本型別有哪些？

TypeScript 提供了多種基本型別，用於定義變數、函式參數和回傳值的型別。

### 基本型別

```typescript
// 1. number：數字（整數、浮點數）
let age: number = 30;
let price: number = 99.99;

// 2. string：字串
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean：布林值
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null：空值
let data: null = null;

// 5. undefined：未定義
let value: undefined = undefined;

// 6. void：無回傳值（主要用於函式）
function logMessage(): void {
  console.log('Hello');
}

// 7. any：任意型別（應避免使用）
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown：未知型別（比 any 更安全）
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ 錯誤：需要先檢查型別

// 9. never：永遠不會發生的值（用於永遠不會回傳的函式）
function throwError(): never {
  throw new Error('Error');
}

// 10. object：物件（不常用，建議使用介面）
let user: object = { name: 'John' };

// 11. array：陣列
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple：元組（固定長度和型別的陣列）
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> 型別註解 vs 型別推斷

### 型別註解（Type Annotations）

**定義**：明確指定變數的型別。

```typescript
// 明確指定型別
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// 函式參數和回傳值
function add(a: number, b: number): number {
  return a + b;
}
```

### 型別推斷（Type Inference）

**定義**：TypeScript 根據初始值自動推斷型別。

```typescript
// TypeScript 自動推斷為 number
let age = 30;        // age: number

// TypeScript 自動推斷為 string
let name = 'John';   // name: string

// TypeScript 自動推斷為 boolean
let isActive = true;  // isActive: boolean

// 函式回傳值也會自動推斷
function add(a: number, b: number) {
  return a + b;  // 自動推斷回傳值為 number
}
```

### 何時使用型別註解

**需要明確指定型別的情況**：

```typescript
// 1. 變數宣告時沒有初始值
let value: number;
value = 10;

// 2. 函式參數（必須指定）
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. 函式回傳值（建議明確指定）
function calculate(): number {
  return 42;
}

// 4. 複雜型別，推斷可能不準確
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> 常見面試題目

### 題目 1：型別推斷

請說明以下程式碼中每個變數的型別。

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>點擊查看答案</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**解釋**：
- TypeScript 會根據初始值自動推斷型別
- 陣列推斷為元素型別的陣列
- 物件推斷為物件的結構型別

</details>

### 題目 2：型別錯誤

請找出以下程式碼中的型別錯誤。

```typescript
let age: number = 30;
age = 'thirty';

let name: string = 'John';
name = 42;

let isActive: boolean = true;
isActive = 'yes';

let numbers: number[] = [1, 2, 3];
numbers.push('4');
```

<details>
<summary>點擊查看答案</summary>

```typescript
let age: number = 30;
age = 'thirty'; // ❌ Type 'string' is not assignable to type 'number'

let name: string = 'John';
name = 42; // ❌ Type 'number' is not assignable to type 'string'

let isActive: boolean = true;
isActive = 'yes'; // ❌ Type 'string' is not assignable to type 'boolean'

let numbers: number[] = [1, 2, 3];
numbers.push('4'); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'
```

**正確寫法**：
```typescript
let age: number = 30;
age = 30; // ✅

let name: string = 'John';
name = 'Jane'; // ✅

let isActive: boolean = true;
isActive = false; // ✅

let numbers: number[] = [1, 2, 3];
numbers.push(4); // ✅
```

</details>

### 題目 3：any vs unknown

請說明 `any` 和 `unknown` 的差異，並說明應該使用哪一個。

```typescript
// 情況 1：使用 any
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ?
}

// 情況 2：使用 unknown
function processUnknown(value: unknown): void {
  console.log(value.toUpperCase()); // ?
}
```

<details>
<summary>點擊查看答案</summary>

**情況 1：使用 any**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ 編譯通過，但執行時可能出錯
}

processAny('hello');  // ✅ 正常執行
processAny(42);       // ❌ 執行時錯誤：value.toUpperCase is not a function
```

**情況 2：使用 unknown**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ 編譯錯誤：Object is of type 'unknown'
  
  // 需要先檢查型別
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ 安全
  }
}
```

**差異比較**：

| 特性 | any | unknown |
| --- | --- | --- |
| 型別檢查 | 完全關閉 | 需要先檢查才能使用 |
| 安全性 | 不安全 | 安全 |
| 使用建議 | 避免使用 | 推薦使用 |

**最佳實踐**：
```typescript
// ✅ 推薦：使用 unknown，然後進行型別檢查
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  }
}

// ❌ 避免：使用 any
function processValue(value: any): void {
  console.log(value.toUpperCase()); // 不安全
}
```

</details>

### 題目 4：陣列型別

請說明以下陣列型別宣告的差異。

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>點擊查看答案</summary>

```typescript
// 1. number[]：數字陣列（推薦寫法）
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ 錯誤

// 2. Array<number>：泛型陣列（與 number[] 等價）
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ 錯誤

// 3. [number, string]：元組（Tuple）- 固定長度和型別
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ 錯誤：長度超過 2
arr3.push('test');   // ⚠️ TypeScript 允許，但不建議

// 4. any[]：任意型別陣列（不推薦）
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅（但失去型別檢查）
```

**使用建議**：
- 一般陣列：使用 `number[]` 或 `Array<number>`
- 固定結構：使用元組 `[type1, type2]`
- 避免使用 `any[]`，優先使用具體型別或 `unknown[]`

</details>

### 題目 5：void vs never

請說明 `void` 和 `never` 的差異和使用場景。

```typescript
// 情況 1：void
function logMessage(): void {
  console.log('Hello');
}

// 情況 2：never
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {
    // 無限迴圈
  }
}
```

<details>
<summary>點擊查看答案</summary>

**void**：
- **用途**：表示函式沒有回傳值
- **特點**：函式可以正常結束，只是不回傳值
- **使用場景**：事件處理函式、副作用函式

```typescript
function logMessage(): void {
  console.log('Hello');
  // 函式正常結束，不回傳值
}

function onClick(): void {
  // 處理點擊事件，不需要回傳值
}
```

**never**：
- **用途**：表示函式永遠不會正常結束
- **特點**：函式會拋出錯誤或進入無限迴圈
- **使用場景**：錯誤處理、無限迴圈、型別守衛

```typescript
function throwError(): never {
  throw new Error('Error');
  // 永遠不會執行到這裡
}

function infiniteLoop(): never {
  while (true) {
    // 永遠不會結束
  }
}

// 型別守衛中使用
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

**差異比較**：

| 特性 | void | never |
| --- | --- | --- |
| 函式結束 | 正常結束 | 永遠不會結束 |
| 回傳值 | undefined | 沒有回傳值 |
| 使用場景 | 無回傳值的函式 | 錯誤處理、無限迴圈 |

</details>

## 4. Best Practices

> 最佳實踐

### 推薦做法

```typescript
// 1. 優先使用型別推斷
let age = 30;  // ✅ 讓 TypeScript 推斷
let name = 'John';  // ✅

// 2. 函式參數和回傳值明確指定型別
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. 使用 unknown 而非 any
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. 使用具體的陣列型別
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. 使用元組表示固定結構
let person: [string, number] = ['John', 30];  // ✅
```

### 避免的做法

```typescript
// 1. 避免使用 any
let value: any = 'hello';  // ❌

// 2. 避免不必要的型別註解
let age: number = 30;  // ⚠️ 可以簡化為 let age = 30;

// 3. 避免使用 object 型別
let user: object = { name: 'John' };  // ❌ 使用介面更好

// 4. 避免混合型別陣列（除非必要）
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ 考慮是否真的需要
```

## 5. Interview Summary

> 面試總結

### 快速記憶

**基本型別**：
- `number`, `string`, `boolean`, `null`, `undefined`
- `void`（無回傳值）, `never`（永遠不回傳）
- `any`（任意型別，避免使用）, `unknown`（未知型別，推薦使用）

**型別註解 vs 推斷**：
- 型別註解：明確指定 `let age: number = 30`
- 型別推斷：自動推斷 `let age = 30`

**陣列型別**：
- `number[]` 或 `Array<number>`：一般陣列
- `[number, string]`：元組（固定結構）

### 面試回答範例

**Q: TypeScript 有哪些基本型別？**

> "TypeScript 提供了多種基本型別，包括 number、string、boolean、null、undefined。還有一些特殊型別：void 表示無回傳值，主要用於函式；never 表示永遠不會發生的值，用於永遠不會回傳的函式；any 是任意型別，但應該避免使用；unknown 是未知型別，比 any 更安全，需要先檢查型別才能使用。另外還有陣列型別 number[] 和元組型別 [number, string]。"

**Q: any 和 unknown 的差異是什麼？**

> "any 會完全關閉型別檢查，可以直接使用任何屬性或方法，但這是不安全的。unknown 則需要先進行型別檢查才能使用，更安全。例如使用 unknown 時，需要先用 typeof 檢查型別，確認後才能呼叫對應的方法。建議優先使用 unknown 而非 any。"

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)

