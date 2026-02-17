---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> 什么是 Interface 和 Type Alias？

### Interface（接口）

**定义**：用于定义对象的结构，描述对象应该有哪些属性和方法。

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // 可选属性
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias（类型别名）

**定义**：为类型创建一个别名，可以用于任何类型，不仅限于对象。

```typescript
type User = {
  name: string;
  age: number;
  email?: string;
};

const user: User = {
  name: 'John',
  age: 30,
};
```

## 2. Interface vs Type Alias: Key Differences

> Interface 与 Type Alias 的主要差异

### 1. 扩展方式

**Interface：使用 extends**

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const dog: Dog = {
  name: 'Buddy',
  breed: 'Golden Retriever',
};
```

**Type Alias：使用交叉类型（Intersection）**

```typescript
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

const dog: Dog = {
  name: 'Buddy',
  breed: 'Golden Retriever',
};
```

### 2. 合并（Declaration Merging）

**Interface：支持合并**

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 自动合并为 { name: string; age: number; }
const user: User = {
  name: 'John',
  age: 30,
};
```

**Type Alias：不支持合并**

```typescript
type User = {
  name: string;
};

type User = {  // ❌ 错误：Duplicate identifier 'User'
  age: number;
};
```

### 3. 适用范围

**Interface：主要用于对象结构**

```typescript
interface User {
  name: string;
  age: number;
}
```

**Type Alias：可用于任何类型**

```typescript
// 基本类型
type ID = string | number;

// 函数类型
type Greet = (name: string) => string;

// 联合类型
type Status = 'active' | 'inactive' | 'pending';

// 元组
type Point = [number, number];

// 对象
type User = {
  name: string;
  age: number;
};
```

### 4. 计算属性

**Interface：不支持计算属性**

```typescript
interface User {
  [key: string]: any;  // 索引签名
}
```

**Type Alias：支持更复杂的类型运算**

```typescript
type Keys = 'name' | 'age' | 'email';

type User = {
  [K in Keys]: string;  // 映射类型
};
```

## 3. When to Use Interface vs Type Alias?

> 何时使用 Interface？何时使用 Type Alias？

### 使用 Interface 的情况

1. **定义对象结构**（最常见）
   ```typescript
   interface User {
     name: string;
     age: number;
   }
   ```

2. **需要声明合并**
   ```typescript
   // 扩展第三方包的类型定义
   interface Window {
     myCustomProperty: string;
   }
   ```

3. **定义类（Class）的契约**
   ```typescript
   interface Flyable {
     fly(): void;
   }

   class Bird implements Flyable {
     fly(): void {
       console.log('Flying');
     }
   }
   ```

### 使用 Type Alias 的情况

1. **定义联合类型或交叉类型**
   ```typescript
   type ID = string | number;
   type Status = 'active' | 'inactive';
   ```

2. **定义函数类型**
   ```typescript
   type EventHandler = (event: Event) => void;
   ```

3. **定义元组**
   ```typescript
   type Point = [number, number];
   ```

4. **需要映射类型或条件类型**
   ```typescript
   type Partial<T> = {
     [P in keyof T]?: T[P];
   };
   ```

## 4. Common Interview Questions

> 常见面试题目

### 题目 1：基本差异

请说明以下两种定义方式的差异。

```typescript
// 方式 1：使用 Interface
interface User {
  name: string;
  age: number;
}

// 方式 2：使用 Type Alias
type User = {
  name: string;
  age: number;
};
```

<details>
<summary>点击查看答案</summary>

**相同点**：
- 两者都可以用来定义对象结构
- 使用方式完全相同
- 都可以扩展和继承

**不同点**：

1. **声明合并**：
   ```typescript
   // Interface 支持
   interface User {
     name: string;
   }
   interface User {
     age: number;
   }
   // 自动合并为 { name: string; age: number; }

   // Type Alias 不支持
   type User = { name: string; };
   type User = { age: number; }; // ❌ 错误
   ```

2. **适用范围**：
   ```typescript
   // Interface 主要用于对象
   interface User { ... }

   // Type Alias 可用于任何类型
   type ID = string | number;
   type Handler = (event: Event) => void;
   type Point = [number, number];
   ```

**建议**：
- 定义对象结构时，两者都可以使用
- 如果需要声明合并，使用 Interface
- 如果需要定义非对象类型，使用 Type Alias

</details>

### 题目 2：扩展方式

请说明以下两种扩展方式的差异。

```typescript
// 方式 1：Interface extends
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 方式 2：Type intersection
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};
```

<details>
<summary>点击查看答案</summary>

**Interface extends**：
```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 等价于
interface Dog {
  name: string;
  breed: string;
}
```

**Type intersection**：
```typescript
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};

// 等价于
type Dog = {
  name: string;
  breed: string;
};
```

**差异**：
- **语法**：Interface 使用 `extends`，Type 使用 `&`
- **结果**：两者结果相同
- **可读性**：Interface 的 `extends` 更直观
- **灵活性**：Type 的 `&` 可以组合多个类型

**示例**：
```typescript
// Interface：只能 extends 一个
interface Dog extends Animal {
  breed: string;
}

// Type：可以组合多个
type Dog = Animal & Canine & {
  breed: string;
};
```

</details>

### 题目 3：声明合并

请说明以下代码的行为。

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

const user: User = {
  name: 'John',
  // 缺少 age 会如何？
};
```

<details>
<summary>点击查看答案</summary>

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 两个声明会自动合并为：
// interface User {
//   name: string;
//   age: number;
// }

const user: User = {
  name: 'John',
  // ❌ 错误：Property 'age' is missing in type '{ name: string; }' but required in type 'User'
};
```

**正确写法**：
```typescript
const user: User = {
  name: 'John',
  age: 30,  // ✅ 必须包含 age
};
```

**声明合并的应用场景**：
```typescript
// 扩展第三方包的类型定义
interface Window {
  myCustomProperty: string;
}

// 现在可以使用
window.myCustomProperty = 'value';
```

**注意**：Type Alias 不支持声明合并
```typescript
type User = { name: string; };
type User = { age: number; }; // ❌ 错误：Duplicate identifier
```

</details>

### 题目 4：实现（implements）

请说明 Interface 和 Type Alias 在类实现上的差异。

```typescript
// 情况 1：Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}

// 情况 2：Type Alias
type Flyable = {
  fly(): void;
};

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}
```

<details>
<summary>点击查看答案</summary>

**两者都可以用于 implements**：

```typescript
// Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}

// Type Alias（对象类型）
type Flyable = {
  fly(): void;
};

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}
```

**差异**：
- **Interface**：传统上更常用于定义类的契约
- **Type Alias**：也可以使用，但语义上 Interface 更合适

**建议**：
- 定义类契约时，优先使用 Interface
- 如果已经使用 Type Alias 定义，也可以实现

**注意**：Type Alias 定义的函数类型不能实现
```typescript
type Flyable = () => void;

class Bird implements Flyable {  // ❌ 错误：只能实现对象类型
  // ...
}
```

</details>

## 5. Best Practices

> 最佳实践

### 推荐做法

```typescript
// 1. 定义对象结构时，优先使用 Interface
interface User {
  name: string;
  age: number;
}

// 2. 定义联合类型时，使用 Type Alias
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

// 3. 定义函数类型时，使用 Type Alias
type EventHandler = (event: Event) => void;

// 4. 需要声明合并时，使用 Interface
interface Window {
  customProperty: string;
}

// 5. 定义类契约时，使用 Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {}
}
```

### 避免的做法

```typescript
// 1. 不要混用 Interface 和 Type Alias 定义相同的结构
interface User { ... }
type User = { ... };  // ❌ 造成混淆

// 2. 不要用 Type Alias 定义简单的对象结构（除非有特殊需求）
type User = {  // ⚠️ Interface 更合适
  name: string;
};

// 3. 不要用 Interface 定义非对象类型
interface ID extends string {}  // ❌ 不支持
type ID = string | number;  // ✅ 正确
```

## 6. Interview Summary

> 面试总结

### 快速记忆

**Interface（接口）**：
- 主要用于定义对象结构
- 支持声明合并（Declaration Merging）
- 使用 `extends` 扩展
- 适合定义类契约

**Type Alias（类型别名）**：
- 可用于任何类型
- 不支持声明合并
- 使用 `&` 交叉类型扩展
- 适合定义联合类型、函数类型、元组

### 面试回答范例

**Q: Interface 和 Type Alias 的差异是什么？**

> "Interface 和 Type Alias 都可以用来定义对象结构，但有一些关键差异：1) Interface 支持声明合并，可以多次声明同一个 Interface 并自动合并；Type Alias 不支持。2) Interface 主要用于对象结构；Type Alias 可以用于任何类型，包括联合类型、函数类型、元组等。3) Interface 使用 extends 扩展；Type Alias 使用交叉类型 & 扩展。4) Interface 更适合定义类的契约。一般来说，定义对象结构时两者都可以，但需要声明合并时必须使用 Interface，定义非对象类型时必须使用 Type Alias。"

**Q: 什么时候应该使用 Interface？什么时候应该使用 Type Alias？**

> "使用 Interface 的情况：定义对象结构、需要声明合并（如扩展第三方包类型）、定义类契约。使用 Type Alias 的情况：定义联合类型或交叉类型、定义函数类型、定义元组、需要映射类型或条件类型。简单来说，对象结构优先考虑 Interface，其他类型使用 Type Alias。"

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)
