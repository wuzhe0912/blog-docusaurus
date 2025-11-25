---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> 什麼是 Interface 和 Type Alias？

### Interface（介面）

**定義**：用於定義物件的結構，描述物件應該有哪些屬性和方法。

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // 可選屬性
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias（型別別名）

**定義**：為型別建立一個別名，可以用於任何型別，不僅限於物件。

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

> Interface 與 Type Alias 的主要差異

### 1. 擴展方式

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

**Type Alias：使用交叉型別（Intersection）**

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

### 2. 合併（Declaration Merging）

**Interface：支援合併**

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 自動合併為 { name: string; age: number; }
const user: User = {
  name: 'John',
  age: 30,
};
```

**Type Alias：不支援合併**

```typescript
type User = {
  name: string;
};

type User = {  // ❌ 錯誤：Duplicate identifier 'User'
  age: number;
};
```

### 3. 適用範圍

**Interface：主要用於物件結構**

```typescript
interface User {
  name: string;
  age: number;
}
```

**Type Alias：可用於任何型別**

```typescript
// 基本型別
type ID = string | number;

// 函式型別
type Greet = (name: string) => string;

// 聯合型別
type Status = 'active' | 'inactive' | 'pending';

// 元組
type Point = [number, number];

// 物件
type User = {
  name: string;
  age: number;
};
```

### 4. 計算屬性

**Interface：不支援計算屬性**

```typescript
interface User {
  [key: string]: any;  // 索引簽名
}
```

**Type Alias：支援更複雜的型別運算**

```typescript
type Keys = 'name' | 'age' | 'email';

type User = {
  [K in Keys]: string;  // 映射型別
};
```

## 3. When to Use Interface vs Type Alias?

> 何時使用 Interface？何時使用 Type Alias？

### 使用 Interface 的情況

1. **定義物件結構**（最常見）
   ```typescript
   interface User {
     name: string;
     age: number;
   }
   ```

2. **需要宣告合併**
   ```typescript
   // 擴展第三方套件的型別定義
   interface Window {
     myCustomProperty: string;
   }
   ```

3. **定義類別（Class）的契約**
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

### 使用 Type Alias 的情況

1. **定義聯合型別或交叉型別**
   ```typescript
   type ID = string | number;
   type Status = 'active' | 'inactive';
   ```

2. **定義函式型別**
   ```typescript
   type EventHandler = (event: Event) => void;
   ```

3. **定義元組**
   ```typescript
   type Point = [number, number];
   ```

4. **需要映射型別或條件型別**
   ```typescript
   type Partial<T> = {
     [P in keyof T]?: T[P];
   };
   ```

## 4. Common Interview Questions

> 常見面試題目

### 題目 1：基本差異

請說明以下兩種定義方式的差異。

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
<summary>點擊查看答案</summary>

**相同點**：
- 兩者都可以用來定義物件結構
- 使用方式完全相同
- 都可以擴展和繼承

**不同點**：

1. **宣告合併**：
   ```typescript
   // Interface 支援
   interface User {
     name: string;
   }
   interface User {
     age: number;
   }
   // 自動合併為 { name: string; age: number; }
   
   // Type Alias 不支援
   type User = { name: string; };
   type User = { age: number; }; // ❌ 錯誤
   ```

2. **適用範圍**：
   ```typescript
   // Interface 主要用於物件
   interface User { ... }
   
   // Type Alias 可用於任何型別
   type ID = string | number;
   type Handler = (event: Event) => void;
   type Point = [number, number];
   ```

**建議**：
- 定義物件結構時，兩者都可以使用
- 如果需要宣告合併，使用 Interface
- 如果需要定義非物件型別，使用 Type Alias

</details>

### 題目 2：擴展方式

請說明以下兩種擴展方式的差異。

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
<summary>點擊查看答案</summary>

**Interface extends**：
```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 等價於
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

// 等價於
type Dog = {
  name: string;
  breed: string;
};
```

**差異**：
- **語法**：Interface 使用 `extends`，Type 使用 `&`
- **結果**：兩者結果相同
- **可讀性**：Interface 的 `extends` 更直觀
- **靈活性**：Type 的 `&` 可以組合多個型別

**範例**：
```typescript
// Interface：只能 extends 一個
interface Dog extends Animal {
  breed: string;
}

// Type：可以組合多個
type Dog = Animal & Canine & {
  breed: string;
};
```

</details>

### 題目 3：宣告合併

請說明以下程式碼的行為。

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

const user: User = {
  name: 'John',
  // 缺少 age 會如何？
};
```

<details>
<summary>點擊查看答案</summary>

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 兩個宣告會自動合併為：
// interface User {
//   name: string;
//   age: number;
// }

const user: User = {
  name: 'John',
  // ❌ 錯誤：Property 'age' is missing in type '{ name: string; }' but required in type 'User'
};
```

**正確寫法**：
```typescript
const user: User = {
  name: 'John',
  age: 30,  // ✅ 必須包含 age
};
```

**宣告合併的應用場景**：
```typescript
// 擴展第三方套件的型別定義
interface Window {
  myCustomProperty: string;
}

// 現在可以使用
window.myCustomProperty = 'value';
```

**注意**：Type Alias 不支援宣告合併
```typescript
type User = { name: string; };
type User = { age: number; }; // ❌ 錯誤：Duplicate identifier
```

</details>

### 題目 4：實作（implements）

請說明 Interface 和 Type Alias 在類別實作上的差異。

```typescript
// 情況 1：Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}

// 情況 2：Type Alias
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
<summary>點擊查看答案</summary>

**兩者都可以用於 implements**：

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

// Type Alias（物件型別）
type Flyable = {
  fly(): void;
};

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}
```

**差異**：
- **Interface**：傳統上更常用於定義類別的契約
- **Type Alias**：也可以使用，但語意上 Interface 更適合

**建議**：
- 定義類別契約時，優先使用 Interface
- 如果已經使用 Type Alias 定義，也可以實作

**注意**：Type Alias 定義的函式型別不能實作
```typescript
type Flyable = () => void;

class Bird implements Flyable {  // ❌ 錯誤：只能實作物件型別
  // ...
}
```

</details>

## 5. Best Practices

> 最佳實踐

### 推薦做法

```typescript
// 1. 定義物件結構時，優先使用 Interface
interface User {
  name: string;
  age: number;
}

// 2. 定義聯合型別時，使用 Type Alias
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

// 3. 定義函式型別時，使用 Type Alias
type EventHandler = (event: Event) => void;

// 4. 需要宣告合併時，使用 Interface
interface Window {
  customProperty: string;
}

// 5. 定義類別契約時，使用 Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {}
}
```

### 避免的做法

```typescript
// 1. 不要混用 Interface 和 Type Alias 定義相同的結構
interface User { ... }
type User = { ... };  // ❌ 造成混淆

// 2. 不要用 Type Alias 定義簡單的物件結構（除非有特殊需求）
type User = {  // ⚠️ Interface 更適合
  name: string;
};

// 3. 不要用 Interface 定義非物件型別
interface ID extends string {}  // ❌ 不支援
type ID = string | number;  // ✅ 正確
```

## 6. Interview Summary

> 面試總結

### 快速記憶

**Interface（介面）**：
- 主要用於定義物件結構
- 支援宣告合併（Declaration Merging）
- 使用 `extends` 擴展
- 適合定義類別契約

**Type Alias（型別別名）**：
- 可用於任何型別
- 不支援宣告合併
- 使用 `&` 交叉型別擴展
- 適合定義聯合型別、函式型別、元組

### 面試回答範例

**Q: Interface 和 Type Alias 的差異是什麼？**

> "Interface 和 Type Alias 都可以用來定義物件結構，但有一些關鍵差異：1) Interface 支援宣告合併，可以多次宣告同一個 Interface 並自動合併；Type Alias 不支援。2) Interface 主要用於物件結構；Type Alias 可以用於任何型別，包括聯合型別、函式型別、元組等。3) Interface 使用 extends 擴展；Type Alias 使用交叉型別 & 擴展。4) Interface 更適合定義類別的契約。一般來說，定義物件結構時兩者都可以，但需要宣告合併時必須使用 Interface，定義非物件型別時必須使用 Type Alias。"

**Q: 什麼時候應該使用 Interface？什麼時候應該使用 Type Alias？**

> "使用 Interface 的情況：定義物件結構、需要宣告合併（如擴展第三方套件型別）、定義類別契約。使用 Type Alias 的情況：定義聯合型別或交叉型別、定義函式型別、定義元組、需要映射型別或條件型別。簡單來說，物件結構優先考慮 Interface，其他型別使用 Type Alias。"

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)

