---
id: generics
title: '[Medium] 泛型（Generics）'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> 什麼是泛型？

泛型（Generics）是 TypeScript 中一種強大的功能，允許我們建立可重用的元件，這些元件可以處理多種型別，而不是單一型別。

**核心概念**：在定義函式、介面或類別時，不預先指定具體的型別，而是在使用時再指定型別。

### 為什麼需要泛型？

**沒有泛型的問題**：

```typescript
// 問題：需要為每種型別寫一個函式
function getStringItem(arr: string[]): string {
  return arr[0];
}

function getNumberItem(arr: number[]): number {
  return arr[0];
}

function getBooleanItem(arr: boolean[]): boolean {
  return arr[0];
}
```

**使用泛型的解決方案**：

```typescript
// 一個函式處理所有型別
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> 基本泛型語法

### 泛型函式

```typescript
// 語法：<T> 表示型別參數
function identity<T>(arg: T): T {
  return arg;
}

// 使用方式 1：明確指定型別
let output1 = identity<string>('hello');  // output1: string

// 使用方式 2：讓 TypeScript 推斷型別
let output2 = identity('hello');  // output2: string（自動推斷）
```

### 泛型介面

```typescript
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = {
  value: 'hello',
};

const numberBox: Box<number> = {
  value: 42,
};
```

### 泛型類別

```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }
}

const stringContainer = new Container<string>();
stringContainer.add('hello');
stringContainer.add('world');

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
```

## 3. Generic Constraints

> 泛型約束

### 基本約束

**語法**：使用 `extends` 關鍵字限制泛型型別。

```typescript
// 約束 T 必須有 length 屬性
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ 錯誤：number 沒有 length 屬性
```

### 使用 keyof 約束

```typescript
// 約束 K 必須是 T 的鍵
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

getProperty(user, 'name');  // ✅ 'John'
getProperty(user, 'age');   // ✅ 30
getProperty(user, 'id');    // ❌ 錯誤：'id' 不是 user 的鍵
```

### 多個約束

```typescript
// T 必須同時滿足多個條件
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ 錯誤：boolean 不在約束範圍內
```

## 4. Common Interview Questions

> 常見面試題目

### 題目 1：實作泛型函式

請實作一個泛型函式 `first`，回傳陣列的第一個元素。

```typescript
function first<T>(arr: T[]): T | undefined {
  // 你的實作
}
```

<details>
<summary>點擊查看答案</summary>

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// 使用範例
const firstString = first<string>(['a', 'b', 'c']);  // 'a'
const firstNumber = first<number>([1, 2, 3]);        // 1
const firstEmpty = first<number>([]);                 // undefined
```

**說明**：
- `<T>` 定義泛型型別參數
- `arr: T[]` 表示型別為 T 的陣列
- 回傳值 `T | undefined` 表示可能是 T 型別或 undefined

</details>

### 題目 2：泛型約束

請實作一個函式，合併兩個物件，但只合併第一個物件中存在的屬性。

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // 你的實作
}
```

<details>
<summary>點擊查看答案</summary>

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// 使用範例
const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31, email: 'john@example.com' };

const merged = merge(obj1, obj2);
// { name: 'John', age: 31, email: 'john@example.com' }
```

**進階版本（只合併第一個物件的屬性）**：

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // 只能包含 obj1 的屬性

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### 題目 3：泛型介面

請定義一個泛型介面 `Repository`，用於資料存取操作。

```typescript
interface Repository<T> {
  // 你的定義
}
```

<details>
<summary>點擊查看答案</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// 實作範例
class UserRepository implements Repository<User> {
  private users: User[] = [];

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findAll(): User[] {
    return this.users;
  }

  save(entity: User): void {
    const index = this.users.findIndex(user => user.id === entity.id);
    if (index >= 0) {
      this.users[index] = entity;
    } else {
      this.users.push(entity);
    }
  }

  delete(id: string): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}
```

</details>

### 題目 4：泛型約束與 keyof

請實作一個函式，根據鍵名取得物件的屬性值，並確保型別安全。

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // 你的實作
}
```

<details>
<summary>點擊查看答案</summary>

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 使用範例
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const name = getValue(user, 'name');   // string
const age = getValue(user, 'age');     // number
const email = getValue(user, 'email');  // string
// const id = getValue(user, 'id');    // ❌ 錯誤：'id' 不是 user 的鍵
```

**說明**：
- `K extends keyof T` 確保 K 必須是 T 的鍵之一
- `T[K]` 表示 T 物件中 K 鍵對應的值的型別
- 這樣可以確保型別安全，編譯時就能發現錯誤

</details>

### 題目 5：條件型別與泛型

請說明以下程式碼的型別推斷結果。

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>點擊查看答案</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**解釋**：
- `NonNullable<T>` 是一個條件型別（Conditional Type）
- 如果 T 可以賦值給 `null | undefined`，則回傳 `never`，否則回傳 `T`
- `string | null` 中，`string` 不符合條件，`null` 符合條件，所以結果是 `string`
- `string | number` 中，兩者都不符合條件，所以結果是 `string | number`

**實際應用**：
```typescript
function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined');
  }
  return value as NonNullable<T>;
}

const result = processValue<string | null>('hello');  // string
```

</details>

## 5. Advanced Generic Patterns

> 進階泛型模式

### 預設型別參數

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // 使用預設型別 string
const container2: Container<number> = { value: 42 };
```

### 多個型別參數

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### 泛型工具型別

```typescript
// Partial：所有屬性變為可選
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required：所有屬性變為必填
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick：選取特定屬性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit：排除特定屬性
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> 最佳實踐

### 推薦做法

```typescript
// 1. 使用有意義的泛型名稱
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. 使用約束限制泛型範圍
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. 提供預設型別參數
interface Config<T = string> {
  value: T;
}

// 4. 使用泛型工具型別
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### 避免的做法

```typescript
// 1. 不要過度使用泛型
function process<T>(value: T): T {  // ⚠️ 如果只有一種型別，不需要泛型
  return value;
}

// 2. 不要使用單字母泛型名稱（除非是簡單情況）
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ 不清楚含義
  // ...
}

// 3. 不要忽略約束
function process<T>(value: T) {  // ⚠️ 如果有限制，應該加上約束
  return value.length;  // 可能出錯
}
```

## 7. Interview Summary

> 面試總結

### 快速記憶

**泛型核心概念**：
- 定義時不指定具體型別，使用時再指定
- 語法：`<T>` 定義型別參數
- 可以應用於函式、介面、類別

**泛型約束**：
- 使用 `extends` 限制泛型範圍
- `K extends keyof T` 確保 K 是 T 的鍵
- 可以組合多個約束

**常見模式**：
- 泛型函式：`function identity<T>(arg: T): T`
- 泛型介面：`interface Box<T> { value: T; }`
- 泛型類別：`class Container<T> { ... }`

### 面試回答範例

**Q: 什麼是泛型？為什麼需要泛型？**

> "泛型是 TypeScript 中一種建立可重用元件的機制，允許我們在定義時不指定具體型別，而是在使用時再指定。泛型的主要優點是：1) 提高程式碼重用性，一個函式可以處理多種型別；2) 保持型別安全，編譯時就能檢查型別錯誤；3) 減少重複程式碼，不需要為每種型別寫一個函式。例如 `function identity<T>(arg: T): T` 可以處理任何型別，而不需要為 string、number 等各寫一個函式。"

**Q: 泛型約束是什麼？如何使用？**

> "泛型約束使用 `extends` 關鍵字來限制泛型型別的範圍。例如 `function getLength<T extends { length: number }>(arg: T)` 確保 T 必須有 length 屬性。另一個常見的約束是 `K extends keyof T`，確保 K 必須是 T 的鍵之一，這樣可以實現型別安全的屬性存取。約束可以幫助我們在使用泛型時保持型別安全，同時提供必要的型別資訊。"

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)

