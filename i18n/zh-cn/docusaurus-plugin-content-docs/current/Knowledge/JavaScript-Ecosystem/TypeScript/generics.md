---
id: generics
title: '[Medium] 泛型（Generics）'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> 什么是泛型？

泛型（Generics）是 TypeScript 中一种强大的功能，允许我们创建可重用的组件，这些组件可以处理多种类型，而不是单一类型。

**核心概念**：在定义函数、接口或类时，不预先指定具体的类型，而是在使用时再指定类型。

### 为什么需要泛型？

**没有泛型的问题**：

```typescript
// 问题：需要为每种类型写一个函数
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

**使用泛型的解决方案**：

```typescript
// 一个函数处理所有类型
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> 基本泛型语法

### 泛型函数

```typescript
// 语法：<T> 表示类型参数
function identity<T>(arg: T): T {
  return arg;
}

// 使用方式 1：明确指定类型
let output1 = identity<string>('hello');  // output1: string

// 使用方式 2：让 TypeScript 推断类型
let output2 = identity('hello');  // output2: string（自动推断）
```

### 泛型接口

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

### 泛型类

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

> 泛型约束

### 基本约束

**语法**：使用 `extends` 关键字限制泛型类型。

```typescript
// 约束 T 必须有 length 属性
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ 错误：number 没有 length 属性
```

### 使用 keyof 约束

```typescript
// 约束 K 必须是 T 的键
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
getProperty(user, 'id');    // ❌ 错误：'id' 不是 user 的键
```

### 多个约束

```typescript
// T 必须同时满足多个条件
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ 错误：boolean 不在约束范围内
```

## 4. Common Interview Questions

> 常见面试题目

### 题目 1：实现泛型函数

请实现一个泛型函数 `first`，返回数组的第一个元素。

```typescript
function first<T>(arr: T[]): T | undefined {
  // 你的实现
}
```

<details>
<summary>点击查看答案</summary>

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// 使用示例
const firstString = first<string>(['a', 'b', 'c']);  // 'a'
const firstNumber = first<number>([1, 2, 3]);        // 1
const firstEmpty = first<number>([]);                 // undefined
```

**说明**：
- `<T>` 定义泛型类型参数
- `arr: T[]` 表示类型为 T 的数组
- 返回值 `T | undefined` 表示可能是 T 类型或 undefined

</details>

### 题目 2：泛型约束

请实现一个函数，合并两个对象，但只合并第一个对象中存在的属性。

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // 你的实现
}
```

<details>
<summary>点击查看答案</summary>

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// 使用示例
const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31, email: 'john@example.com' };

const merged = merge(obj1, obj2);
// { name: 'John', age: 31, email: 'john@example.com' }
```

**进阶版本（只合并第一个对象的属性）**：

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // 只能包含 obj1 的属性

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### 题目 3：泛型接口

请定义一个泛型接口 `Repository`，用于数据访问操作。

```typescript
interface Repository<T> {
  // 你的定义
}
```

<details>
<summary>点击查看答案</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// 实现示例
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

### 题目 4：泛型约束与 keyof

请实现一个函数，根据键名获取对象的属性值，并确保类型安全。

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // 你的实现
}
```

<details>
<summary>点击查看答案</summary>

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 使用示例
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const name = getValue(user, 'name');   // string
const age = getValue(user, 'age');     // number
const email = getValue(user, 'email');  // string
// const id = getValue(user, 'id');    // ❌ 错误：'id' 不是 user 的键
```

**说明**：
- `K extends keyof T` 确保 K 必须是 T 的键之一
- `T[K]` 表示 T 对象中 K 键对应的值的类型
- 这样可以确保类型安全，编译时就能发现错误

</details>

### 题目 5：条件类型与泛型

请说明以下代码的类型推断结果。

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>点击查看答案</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**解释**：
- `NonNullable<T>` 是一个条件类型（Conditional Type）
- 如果 T 可以赋值给 `null | undefined`，则返回 `never`，否则返回 `T`
- `string | null` 中，`string` 不符合条件，`null` 符合条件，所以结果是 `string`
- `string | number` 中，两者都不符合条件，所以结果是 `string | number`

**实际应用**：
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

> 进阶泛型模式

### 默认类型参数

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // 使用默认类型 string
const container2: Container<number> = { value: 42 };
```

### 多个类型参数

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### 泛型工具类型

```typescript
// Partial：所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required：所有属性变为必填
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick：选取特定属性
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit：排除特定属性
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> 最佳实践

### 推荐做法

```typescript
// 1. 使用有意义的泛型名称
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. 使用约束限制泛型范围
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. 提供默认类型参数
interface Config<T = string> {
  value: T;
}

// 4. 使用泛型工具类型
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### 避免的做法

```typescript
// 1. 不要过度使用泛型
function process<T>(value: T): T {  // ⚠️ 如果只有一种类型，不需要泛型
  return value;
}

// 2. 不要使用单字母泛型名称（除非是简单情况）
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ 不清楚含义
  // ...
}

// 3. 不要忽略约束
function process<T>(value: T) {  // ⚠️ 如果有限制，应该加上约束
  return value.length;  // 可能出错
}
```

## 7. Interview Summary

> 面试总结

### 快速记忆

**泛型核心概念**：
- 定义时不指定具体类型，使用时再指定
- 语法：`<T>` 定义类型参数
- 可以应用于函数、接口、类

**泛型约束**：
- 使用 `extends` 限制泛型范围
- `K extends keyof T` 确保 K 是 T 的键
- 可以组合多个约束

**常见模式**：
- 泛型函数：`function identity<T>(arg: T): T`
- 泛型接口：`interface Box<T> { value: T; }`
- 泛型类：`class Container<T> { ... }`

### 面试回答范例

**Q: 什么是泛型？为什么需要泛型？**

> "泛型是 TypeScript 中一种创建可重用组件的机制，允许我们在定义时不指定具体类型，而是在使用时再指定。泛型的主要优点是：1) 提高代码重用性，一个函数可以处理多种类型；2) 保持类型安全，编译时就能检查类型错误；3) 减少重复代码，不需要为每种类型写一个函数。例如 `function identity<T>(arg: T): T` 可以处理任何类型，而不需要为 string、number 等各写一个函数。"

**Q: 泛型约束是什么？如何使用？**

> "泛型约束使用 `extends` 关键字来限制泛型类型的范围。例如 `function getLength<T extends { length: number }>(arg: T)` 确保 T 必须有 length 属性。另一个常见的约束是 `K extends keyof T`，确保 K 必须是 T 的键之一，这样可以实现类型安全的属性访问。约束可以帮助我们在使用泛型时保持类型安全，同时提供必要的类型信息。"

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
