---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> Interface と Type Alias とは何ですか？

### Interface（インターフェース）

**定義**：オブジェクトの構造を定義し、オブジェクトが持つべきプロパティとメソッドを記述します。

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // オプションプロパティ
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias（型エイリアス）

**定義**：型にエイリアスを作成し、オブジェクトに限らず任意の型に使用できます。

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

> Interface と Type Alias の主な違い

### 1. 拡張方法

**Interface：extends を使用**

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

**Type Alias：交差型（Intersection）を使用**

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

### 2. マージ（Declaration Merging）

**Interface：マージをサポート**

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 自動的に { name: string; age: number; } にマージされる
const user: User = {
  name: 'John',
  age: 30,
};
```

**Type Alias：マージをサポートしない**

```typescript
type User = {
  name: string;
};

type User = {  // ❌ エラー：Duplicate identifier 'User'
  age: number;
};
```

### 3. 適用範囲

**Interface：主にオブジェクト構造に使用**

```typescript
interface User {
  name: string;
  age: number;
}
```

**Type Alias：任意の型に使用可能**

```typescript
// 基本型
type ID = string | number;

// 関数型
type Greet = (name: string) => string;

// ユニオン型
type Status = 'active' | 'inactive' | 'pending';

// タプル
type Point = [number, number];

// オブジェクト
type User = {
  name: string;
  age: number;
};
```

### 4. 計算プロパティ

**Interface：計算プロパティをサポートしない**

```typescript
interface User {
  [key: string]: any;  // インデックスシグネチャ
}
```

**Type Alias：より複雑な型演算をサポート**

```typescript
type Keys = 'name' | 'age' | 'email';

type User = {
  [K in Keys]: string;  // マッピング型
};
```

## 3. When to Use Interface vs Type Alias?

> いつ Interface を使うか？いつ Type Alias を使うか？

### Interface を使用する場合

1. **オブジェクト構造の定義**（最も一般的）
   ```typescript
   interface User {
     name: string;
     age: number;
   }
   ```

2. **宣言マージが必要な場合**
   ```typescript
   // サードパーティパッケージの型定義を拡張
   interface Window {
     myCustomProperty: string;
   }
   ```

3. **クラスのコントラクトを定義する場合**
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

### Type Alias を使用する場合

1. **ユニオン型や交差型の定義**
   ```typescript
   type ID = string | number;
   type Status = 'active' | 'inactive';
   ```

2. **関数型の定義**
   ```typescript
   type EventHandler = (event: Event) => void;
   ```

3. **タプルの定義**
   ```typescript
   type Point = [number, number];
   ```

4. **マッピング型や条件型が必要な場合**
   ```typescript
   type Partial<T> = {
     [P in keyof T]?: T[P];
   };
   ```

## 4. Common Interview Questions

> よくある面接の質問

### 問題 1：基本的な違い

以下の2つの定義方法の違いを説明してください。

```typescript
// 方法 1：Interface を使用
interface User {
  name: string;
  age: number;
}

// 方法 2：Type Alias を使用
type User = {
  name: string;
  age: number;
};
```

<details>
<summary>クリックして回答を表示</summary>

**共通点**：
- どちらもオブジェクト構造の定義に使用可能
- 使用方法は完全に同じ
- どちらも拡張と継承が可能

**相違点**：

1. **宣言マージ**：
   ```typescript
   // Interface はサポート
   interface User {
     name: string;
   }
   interface User {
     age: number;
   }
   // 自動的に { name: string; age: number; } にマージ

   // Type Alias はサポートしない
   type User = { name: string; };
   type User = { age: number; }; // ❌ エラー
   ```

2. **適用範囲**：
   ```typescript
   // Interface は主にオブジェクトに使用
   interface User { ... }

   // Type Alias は任意の型に使用可能
   type ID = string | number;
   type Handler = (event: Event) => void;
   type Point = [number, number];
   ```

**推奨**：
- オブジェクト構造の定義時はどちらも使用可能
- 宣言マージが必要な場合は Interface
- 非オブジェクト型の定義には Type Alias

</details>

### 問題 2：拡張方法

以下の2つの拡張方法の違いを説明してください。

```typescript
// 方法 1：Interface extends
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 方法 2：Type intersection
type Animal = {
  name: string;
};

type Dog = Animal & {
  breed: string;
};
```

<details>
<summary>クリックして回答を表示</summary>

**Interface extends**：
```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 等価
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

// 等価
type Dog = {
  name: string;
  breed: string;
};
```

**違い**：
- **構文**：Interface は `extends` を使用、Type は `&` を使用
- **結果**：両者の結果は同じ
- **可読性**：Interface の `extends` の方が直感的
- **柔軟性**：Type の `&` は複数の型を組み合わせ可能

**例**：
```typescript
// Interface：1つしか extends できない
interface Dog extends Animal {
  breed: string;
}

// Type：複数を組み合わせ可能
type Dog = Animal & Canine & {
  breed: string;
};
```

</details>

### 問題 3：宣言マージ

以下のコードの動作を説明してください。

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

const user: User = {
  name: 'John',
  // age が欠けるとどうなるか？
};
```

<details>
<summary>クリックして回答を表示</summary>

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 2つの宣言が自動的にマージされる：
// interface User {
//   name: string;
//   age: number;
// }

const user: User = {
  name: 'John',
  // ❌ エラー：Property 'age' is missing in type '{ name: string; }' but required in type 'User'
};
```

**正しい書き方**：
```typescript
const user: User = {
  name: 'John',
  age: 30,  // ✅ age を含める必要がある
};
```

**宣言マージの活用シーン**：
```typescript
// サードパーティパッケージの型定義を拡張
interface Window {
  myCustomProperty: string;
}

// 使用可能になる
window.myCustomProperty = 'value';
```

**注意**：Type Alias は宣言マージをサポートしない
```typescript
type User = { name: string; };
type User = { age: number; }; // ❌ エラー：Duplicate identifier
```

</details>

### 問題 4：実装（implements）

Interface と Type Alias のクラス実装における違いを説明してください。

```typescript
// ケース 1：Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}

// ケース 2：Type Alias
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
<summary>クリックして回答を表示</summary>

**どちらも implements に使用可能**：

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

// Type Alias（オブジェクト型）
type Flyable = {
  fly(): void;
};

class Bird implements Flyable {
  fly(): void {
    console.log('Flying');
  }
}
```

**違い**：
- **Interface**：伝統的にクラスのコントラクト定義に多く使用
- **Type Alias**：使用可能だが、意味的には Interface の方が適切

**推奨**：
- クラスのコントラクト定義には Interface を優先
- Type Alias で定義済みの場合も実装可能

**注意**：Type Alias で定義した関数型は実装不可
```typescript
type Flyable = () => void;

class Bird implements Flyable {  // ❌ エラー：オブジェクト型のみ実装可能
  // ...
}
```

</details>

## 5. Best Practices

> ベストプラクティス

### 推奨される方法

```typescript
// 1. オブジェクト構造の定義には Interface を優先
interface User {
  name: string;
  age: number;
}

// 2. ユニオン型の定義には Type Alias
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

// 3. 関数型の定義には Type Alias
type EventHandler = (event: Event) => void;

// 4. 宣言マージが必要な場合は Interface
interface Window {
  customProperty: string;
}

// 5. クラスのコントラクト定義には Interface
interface Flyable {
  fly(): void;
}

class Bird implements Flyable {
  fly(): void {}
}
```

### 避けるべき方法

```typescript
// 1. Interface と Type Alias を混在させて同じ構造を定義しない
interface User { ... }
type User = { ... };  // ❌ 混乱を招く

// 2. Type Alias でシンプルなオブジェクト構造を定義しない（特別な要件がない限り）
type User = {  // ⚠️ Interface の方が適切
  name: string;
};

// 3. Interface で非オブジェクト型を定義しない
interface ID extends string {}  // ❌ サポートされない
type ID = string | number;  // ✅ 正しい
```

## 6. Interview Summary

> 面接のまとめ

### クイックリファレンス

**Interface（インターフェース）**：
- 主にオブジェクト構造の定義に使用
- 宣言マージ（Declaration Merging）をサポート
- `extends` で拡張
- クラスのコントラクト定義に適している

**Type Alias（型エイリアス）**：
- 任意の型に使用可能
- 宣言マージをサポートしない
- `&` 交差型で拡張
- ユニオン型、関数型、タプルの定義に適している

### 面接の回答例

**Q: Interface と Type Alias の違いは何ですか？**

> "Interface と Type Alias はどちらもオブジェクト構造の定義に使用できますが、いくつかの重要な違いがあります：1) Interface は宣言マージをサポートし、同じ Interface を複数回宣言して自動マージできます。Type Alias はサポートしません。2) Interface は主にオブジェクト構造に使用されます。Type Alias はユニオン型、関数型、タプルなど任意の型に使用できます。3) Interface は extends で拡張、Type Alias は交差型 & で拡張します。4) Interface はクラスのコントラクト定義に適しています。一般的に、オブジェクト構造の定義にはどちらも使えますが、宣言マージが必要な場合は Interface、非オブジェクト型の定義には Type Alias を使う必要があります。"

**Q: いつ Interface を使い、いつ Type Alias を使うべきですか？**

> "Interface を使う場合：オブジェクト構造の定義、宣言マージが必要な場合（サードパーティパッケージの型拡張など）、クラスのコントラクト定義。Type Alias を使う場合：ユニオン型や交差型の定義、関数型の定義、タプルの定義、マッピング型や条件型が必要な場合。簡単に言えば、オブジェクト構造には Interface を優先し、その他の型には Type Alias を使用します。"

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)
