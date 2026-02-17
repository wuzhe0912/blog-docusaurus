---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> 什么是 TypeScript？

TypeScript 是由 Microsoft 开发的开源编程语言，它是 JavaScript 的**超集（Superset）**，意味着所有有效的 JavaScript 代码都是有效的 TypeScript 代码。

**核心特点**：

- 在 JavaScript 基础上加入**静态类型系统**
- 编译时进行类型检查
- 编译后转换为纯 JavaScript
- 提供更好的开发体验和工具支持

## 2. What are the differences between TypeScript and JavaScript?

> TypeScript 与 JavaScript 的差异是什么？

### 主要差异

| 特性     | JavaScript             | TypeScript             |
| -------- | ---------------------- | ---------------------- |
| 类型系统 | 动态类型（运行时检查） | 静态类型（编译时检查） |
| 编译     | 不需要编译             | 需要编译为 JavaScript  |
| 类型注解 | 不支持                 | 支持类型注解           |
| 错误检查 | 运行时发现错误         | 编译时发现错误         |
| IDE 支持 | 基本支持               | 强大的自动完成和重构   |
| 学习曲线 | 较低                   | 较高                   |

### 类型系统差异

**JavaScript（动态类型）**：

```javascript
// JavaScript：运行时才检查类型
let value = 10;
value = 'hello'; // 可以改变类型
value = true; // 可以改变类型

function add(a, b) {
  return a + b;
}

add(1, 2); // 3
add('1', '2'); // '12'（字符串连接）
add(1, '2'); // '12'（类型转换）
```

**TypeScript（静态类型）**：

```typescript
// TypeScript：编译时检查类型
let value: number = 10;
value = 'hello'; // ❌ 编译错误：Type 'string' is not assignable to type 'number'

function add(a: number, b: number): number {
  return a + b;
}

add(1, 2); // ✅ 3
add('1', '2'); // ❌ 编译错误：Argument of type 'string' is not assignable to parameter of type 'number'
add(1, '2'); // ❌ 编译错误
```

### 编译过程

**JavaScript**：

```javascript
// 直接执行，不需要编译
console.log('Hello World');
```

**TypeScript**：

```typescript
// TypeScript 源代码
let message: string = 'Hello World';
console.log(message);

// ↓ 编译后转换为 JavaScript
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> 为什么要使用 TypeScript？

### 优点

1. **早期发现错误**

   ```typescript
   // 编译时就能发现错误，不需要等到运行时
   function calculateArea(width: number, height: number): number {
     return width * height;
   }

   calculateArea('10', 20); // ❌ 编译错误：立即发现问题
   ```

2. **更好的 IDE 支持**

   ```typescript
   interface User {
     name: string;
     age: number;
     email: string;
   }

   const user: User = {
     name: 'John',
     age: 30,
     // IDE 会自动提示缺少 email 属性
   };
   ```

3. **代码可读性**

   ```typescript
   // 类型注解让函数意图更清楚
   function processUser(user: User, callback: (result: string) => void): void {
     // ...
   }
   ```

4. **重构更安全**
   ```typescript
   // 修改接口时，TypeScript 会找出所有需要更新的地方
   interface User {
     name: string;
     age: number;
     // 新增 email 属性时，所有使用 User 的地方都会报错
   }
   ```

### 缺点

1. **需要编译步骤**：增加开发流程复杂度
2. **学习曲线**：需要学习类型系统
3. **文件大小**：类型信息会增加源代码大小（但编译后不会影响）
4. **配置复杂**：需要配置 `tsconfig.json`

## 4. Common Interview Questions

> 常见面试题目

### 题目 1：类型检查时机

请说明以下代码在 JavaScript 和 TypeScript 中的行为差异。

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
<summary>点击查看答案</summary>

**JavaScript 输出**：

```javascript
console.log(add(1, 2)); // 3
console.log(add('1', '2')); // '12'（字符串连接）
console.log(add(1, '2')); // '12'（类型转换）
```

**TypeScript 行为**：

```typescript
console.log(add(1, 2)); // ✅ 3（编译通过）
console.log(add('1', '2')); // ❌ 编译错误：Argument of type 'string' is not assignable to parameter of type 'number'
console.log(add(1, '2')); // ❌ 编译错误：Argument of type 'string' is not assignable to parameter of type 'number'
```

**解释**：

- JavaScript 在**运行时**进行类型转换，可能产生非预期结果
- TypeScript 在**编译时**检查类型，提前发现错误

</details>

### 题目 2：类型推断

请说明以下代码中 TypeScript 如何推断类型。

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;

value1 = 'world'; // ?
value2 = 20; // ?
value3 = 'yes'; // ?
```

<details>
<summary>点击查看答案</summary>

```typescript
let value1 = 10; // TypeScript 推断为 number
let value2 = 'hello'; // TypeScript 推断为 string
let value3 = true; // TypeScript 推断为 boolean

value1 = 'world'; // ❌ 编译错误：Type 'string' is not assignable to type 'number'
value2 = 20; // ❌ 编译错误：Type 'number' is not assignable to type 'string'
value3 = 'yes'; // ❌ 编译错误：Type 'string' is not assignable to type 'boolean'
```

**解释**：

- TypeScript 会根据初始值**自动推断类型**
- 推断后无法改变类型（除非明确声明为 `any` 或 `union` 类型）

**明确指定类型**：

```typescript
let value1: number = 10;
let value2: string = 'hello';
let value3: boolean = true;
```

</details>

### 题目 3：运行时行为

请说明 TypeScript 编译后的 JavaScript 代码与原始 TypeScript 的差异。

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
<summary>点击查看答案</summary>

**编译后的 JavaScript**：

```javascript
// 所有类型信息都被移除
function greet(user) {
  return `Hello, ${user.name}!`;
}

const user = { name: 'John', age: 30 };
console.log(greet(user));
```

**关键点**：

- TypeScript 的**类型注解在编译后完全消失**
- 编译后的 JavaScript 与纯 JavaScript 完全相同
- TypeScript 只在**开发阶段**提供类型检查，不影响运行时性能
- 这就是为什么 TypeScript 是"编译时类型系统"而非"运行时类型系统"

</details>

### 题目 4：类型错误 vs 运行时错误

请比较以下两种错误的差异。

```typescript
// 情况 1：TypeScript 编译时错误
function calculate(a: number, b: number): number {
  return a + b;
}

calculate('1', '2'); // ❌ 编译错误

// 情况 2：JavaScript 运行时错误
function process(data) {
  return data.value.toUpperCase();
}

process(null); // ❌ 运行时错误：Cannot read property 'toUpperCase' of null
```

<details>
<summary>点击查看答案</summary>

**情况 1：TypeScript 编译时错误**

- **发现时机**：编译时（开发阶段）
- **影响**：无法编译成功，必须修正才能执行
- **优点**：提前发现问题，避免部署错误代码

**情况 2：JavaScript 运行时错误**

- **发现时机**：运行时（用户使用时）
- **影响**：程序崩溃，影响用户体验
- **缺点**：需要实际执行才能发现问题

**TypeScript 的解决方案**：

```typescript
function process(data: { value: string } | null) {
  if (data === null) {
    return '';
  }
  return data.value.toUpperCase();
}

process(null); // ✅ 编译通过，运行时安全
```

</details>

## 5. Best Practices

> 最佳实践

### 推荐做法

```typescript
// 1. 明确指定函数返回类型
function add(a: number, b: number): number {
  return a + b;
}

// 2. 使用接口定义复杂对象结构
interface User {
  name: string;
  age: number;
  email?: string; // 可选属性
}

// 3. 避免使用 any，优先使用 unknown
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. 使用类型别名提高可读性
type UserID = string;
type UserName = string;

function getUser(id: UserID): User {
  // ...
}
```

### 避免的做法

```typescript
// 1. 不要过度使用 any
function process(data: any) {
  // ❌ 失去类型检查的意义
  return data.value;
}

// 2. 不要忽略类型错误
function add(a: number, b: number): number {
  return a + b; // ❌ 如果这里有错误，不要用 @ts-ignore 忽略
}

// 3. 不要混合类型注解和推断
let value: number = 10; // ✅ 明确指定
let value = 10; // ✅ 让 TypeScript 推断
let value: number = 10; // ⚠️ 两者都有时，确保一致
```

## 6. Interview Summary

> 面试总结

### 快速记忆

**TypeScript 核心概念**：

- JavaScript 的超集，加入静态类型系统
- 编译时检查类型，运行时与 JavaScript 相同
- 提供更好的开发体验和错误预防

**主要差异**：

- **类型系统**：静态（TypeScript）vs 动态（JavaScript）
- **错误发现**：编译时（TypeScript）vs 运行时（JavaScript）
- **开发工具**：强大的 IDE 支持（TypeScript）vs 基本支持（JavaScript）

### 面试回答范例

**Q: TypeScript 和 JavaScript 的主要差异是什么？**

> "TypeScript 是 JavaScript 的超集，主要差异在于 TypeScript 加入了静态类型系统。JavaScript 是动态类型语言，类型检查在运行时进行；而 TypeScript 是静态类型语言，类型检查在编译时进行。这让开发者能够在开发阶段就发现类型相关的错误，而不是等到运行时才发现。TypeScript 编译后会转换为纯 JavaScript，所以运行时的行为与 JavaScript 完全相同。"

**Q: 为什么要使用 TypeScript？**

> "TypeScript 的主要优点包括：1) 早期发现错误，在编译时就能发现类型错误；2) 更好的 IDE 支持，提供自动完成和重构功能；3) 提高代码可读性，类型注解让函数意图更清楚；4) 重构更安全，修改类型时会自动找出所有需要更新的地方。不过也需要考虑学习曲线和编译步骤的额外成本。"

## Reference

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
