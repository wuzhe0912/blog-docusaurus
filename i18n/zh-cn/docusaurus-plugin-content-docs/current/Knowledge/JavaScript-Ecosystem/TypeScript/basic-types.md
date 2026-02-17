---
id: basic-types
title: '[Easy] 基本类型与类型注解'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> TypeScript 的基本类型有哪些？

TypeScript 提供了多种基本类型，用于定义变量、函数参数和返回值的类型。

### 基本类型

```typescript
// 1. number：数字（整数、浮点数）
let age: number = 30;
let price: number = 99.99;

// 2. string：字符串
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean：布尔值
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null：空值
let data: null = null;

// 5. undefined：未定义
let value: undefined = undefined;

// 6. void：无返回值（主要用于函数）
function logMessage(): void {
  console.log('Hello');
}

// 7. any：任意类型（应避免使用）
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown：未知类型（比 any 更安全）
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ 错误：需要先检查类型

// 9. never：永远不会发生的值（用于永远不会返回的函数）
function throwError(): never {
  throw new Error('Error');
}

// 10. object：对象（不常用，建议使用接口）
let user: object = { name: 'John' };

// 11. array：数组
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple：元组（固定长度和类型的数组）
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> 类型注解 vs 类型推断

### 类型注解（Type Annotations）

**定义**：明确指定变量的类型。

```typescript
// 明确指定类型
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// 函数参数和返回值
function add(a: number, b: number): number {
  return a + b;
}
```

### 类型推断（Type Inference）

**定义**：TypeScript 根据初始值自动推断类型。

```typescript
// TypeScript 自动推断为 number
let age = 30;        // age: number

// TypeScript 自动推断为 string
let name = 'John';   // name: string

// TypeScript 自动推断为 boolean
let isActive = true;  // isActive: boolean

// 函数返回值也会自动推断
function add(a: number, b: number) {
  return a + b;  // 自动推断返回值为 number
}
```

### 何时使用类型注解

**需要明确指定类型的情况**：

```typescript
// 1. 变量声明时没有初始值
let value: number;
value = 10;

// 2. 函数参数（必须指定）
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. 函数返回值（建议明确指定）
function calculate(): number {
  return 42;
}

// 4. 复杂类型，推断可能不准确
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> 常见面试题目

### 题目 1：类型推断

请说明以下代码中每个变量的类型。

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>点击查看答案</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**解释**：
- TypeScript 会根据初始值自动推断类型
- 数组推断为元素类型的数组
- 对象推断为对象的结构类型

</details>

### 题目 2：类型错误

请找出以下代码中的类型错误。

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
<summary>点击查看答案</summary>

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

**正确写法**：
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

### 题目 3：any vs unknown

请说明 `any` 和 `unknown` 的差异，并说明应该使用哪一个。

```typescript
// 情况 1：使用 any
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ?
}

// 情况 2：使用 unknown
function processUnknown(value: unknown): void {
  console.log(value.toUpperCase()); // ?
}
```

<details>
<summary>点击查看答案</summary>

**情况 1：使用 any**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ 编译通过，但运行时可能出错
}

processAny('hello');  // ✅ 正常执行
processAny(42);       // ❌ 运行时错误：value.toUpperCase is not a function
```

**情况 2：使用 unknown**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ 编译错误：Object is of type 'unknown'

  // 需要先检查类型
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ 安全
  }
}
```

**差异比较**：

| 特性 | any | unknown |
| --- | --- | --- |
| 类型检查 | 完全关闭 | 需要先检查才能使用 |
| 安全性 | 不安全 | 安全 |
| 使用建议 | 避免使用 | 推荐使用 |

**最佳实践**：
```typescript
// ✅ 推荐：使用 unknown，然后进行类型检查
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

### 题目 4：数组类型

请说明以下数组类型声明的差异。

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>点击查看答案</summary>

```typescript
// 1. number[]：数字数组（推荐写法）
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ 错误

// 2. Array<number>：泛型数组（与 number[] 等价）
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ 错误

// 3. [number, string]：元组（Tuple）- 固定长度和类型
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ 错误：长度超过 2
arr3.push('test');   // ⚠️ TypeScript 允许，但不建议

// 4. any[]：任意类型数组（不推荐）
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅（但失去类型检查）
```

**使用建议**：
- 一般数组：使用 `number[]` 或 `Array<number>`
- 固定结构：使用元组 `[type1, type2]`
- 避免使用 `any[]`，优先使用具体类型或 `unknown[]`

</details>

### 题目 5：void vs never

请说明 `void` 和 `never` 的差异和使用场景。

```typescript
// 情况 1：void
function logMessage(): void {
  console.log('Hello');
}

// 情况 2：never
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {
    // 无限循环
  }
}
```

<details>
<summary>点击查看答案</summary>

**void**：
- **用途**：表示函数没有返回值
- **特点**：函数可以正常结束，只是不返回值
- **使用场景**：事件处理函数、副作用函数

```typescript
function logMessage(): void {
  console.log('Hello');
  // 函数正常结束，不返回值
}

function onClick(): void {
  // 处理点击事件，不需要返回值
}
```

**never**：
- **用途**：表示函数永远不会正常结束
- **特点**：函数会抛出错误或进入无限循环
- **使用场景**：错误处理、无限循环、类型守卫

```typescript
function throwError(): never {
  throw new Error('Error');
  // 永远不会执行到这里
}

function infiniteLoop(): never {
  while (true) {
    // 永远不会结束
  }
}

// 类型守卫中使用
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

**差异比较**：

| 特性 | void | never |
| --- | --- | --- |
| 函数结束 | 正常结束 | 永远不会结束 |
| 返回值 | undefined | 没有返回值 |
| 使用场景 | 无返回值的函数 | 错误处理、无限循环 |

</details>

## 4. Best Practices

> 最佳实践

### 推荐做法

```typescript
// 1. 优先使用类型推断
let age = 30;  // ✅ 让 TypeScript 推断
let name = 'John';  // ✅

// 2. 函数参数和返回值明确指定类型
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. 使用 unknown 而非 any
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. 使用具体的数组类型
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. 使用元组表示固定结构
let person: [string, number] = ['John', 30];  // ✅
```

### 避免的做法

```typescript
// 1. 避免使用 any
let value: any = 'hello';  // ❌

// 2. 避免不必要的类型注解
let age: number = 30;  // ⚠️ 可以简化为 let age = 30;

// 3. 避免使用 object 类型
let user: object = { name: 'John' };  // ❌ 使用接口更好

// 4. 避免混合类型数组（除非必要）
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ 考虑是否真的需要
```

## 5. Interview Summary

> 面试总结

### 快速记忆

**基本类型**：
- `number`, `string`, `boolean`, `null`, `undefined`
- `void`（无返回值）, `never`（永远不返回）
- `any`（任意类型，避免使用）, `unknown`（未知类型，推荐使用）

**类型注解 vs 推断**：
- 类型注解：明确指定 `let age: number = 30`
- 类型推断：自动推断 `let age = 30`

**数组类型**：
- `number[]` 或 `Array<number>`：一般数组
- `[number, string]`：元组（固定结构）

### 面试回答范例

**Q: TypeScript 有哪些基本类型？**

> "TypeScript 提供了多种基本类型，包括 number、string、boolean、null、undefined。还有一些特殊类型：void 表示无返回值，主要用于函数；never 表示永远不会发生的值，用于永远不会返回的函数；any 是任意类型，但应该避免使用；unknown 是未知类型，比 any 更安全，需要先检查类型才能使用。另外还有数组类型 number[] 和元组类型 [number, string]。"

**Q: any 和 unknown 的差异是什么？**

> "any 会完全关闭类型检查，可以直接使用任何属性或方法，但这是不安全的。unknown 则需要先进行类型检查才能使用，更安全。例如使用 unknown 时，需要先用 typeof 检查类型，确认后才能调用对应的方法。建议优先使用 unknown 而非 any。"

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
