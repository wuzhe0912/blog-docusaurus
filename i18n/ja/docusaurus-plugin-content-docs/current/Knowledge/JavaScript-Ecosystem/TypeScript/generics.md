---
id: generics
title: '[Medium] ジェネリクス（Generics）'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> ジェネリクスとは何ですか？

ジェネリクス（Generics）は TypeScript の強力な機能で、単一の型ではなく複数の型を処理できる再利用可能なコンポーネントを作成することができます。

**コアコンセプト**：関数、インターフェース、クラスを定義する際に具体的な型を事前に指定せず、使用時に型を指定します。

### なぜジェネリクスが必要なのか？

**ジェネリクスがない場合の問題**：

```typescript
// 問題：各型ごとに関数を書く必要がある
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

**ジェネリクスを使った解決策**：

```typescript
// 1つの関数ですべての型を処理
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> 基本的なジェネリクス構文

### ジェネリック関数

```typescript
// 構文：<T> は型パラメータを表す
function identity<T>(arg: T): T {
  return arg;
}

// 使用方法 1：型を明示的に指定
let output1 = identity<string>('hello');  // output1: string

// 使用方法 2：TypeScript に型を推論させる
let output2 = identity('hello');  // output2: string（自動推論）
```

### ジェネリックインターフェース

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

### ジェネリッククラス

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

> ジェネリック制約

### 基本的な制約

**構文**：`extends` キーワードを使用してジェネリック型を制限します。

```typescript
// T は length プロパティを持つ必要がある
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ エラー：number には length プロパティがない
```

### keyof を使った制約

```typescript
// K は T のキーでなければならない
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
getProperty(user, 'id');    // ❌ エラー：'id' は user のキーではない
```

### 複数の制約

```typescript
// T は複数の条件を同時に満たす必要がある
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ エラー：boolean は制約の範囲外
```

## 4. Common Interview Questions

> よくある面接の質問

### 問題 1：ジェネリック関数の実装

配列の最初の要素を返すジェネリック関数 `first` を実装してください。

```typescript
function first<T>(arr: T[]): T | undefined {
  // あなたの実装
}
```

<details>
<summary>クリックして回答を表示</summary>

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// 使用例
const firstString = first<string>(['a', 'b', 'c']);  // 'a'
const firstNumber = first<number>([1, 2, 3]);        // 1
const firstEmpty = first<number>([]);                 // undefined
```

**説明**：
- `<T>` はジェネリック型パラメータを定義
- `arr: T[]` は型 T の配列を表す
- 戻り値 `T | undefined` は T 型または undefined の可能性を表す

</details>

### 問題 2：ジェネリック制約

2つのオブジェクトをマージする関数を実装してください。ただし、最初のオブジェクトに存在するプロパティのみをマージします。

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // あなたの実装
}
```

<details>
<summary>クリックして回答を表示</summary>

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// 使用例
const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31, email: 'john@example.com' };

const merged = merge(obj1, obj2);
// { name: 'John', age: 31, email: 'john@example.com' }
```

**上級バージョン（最初のオブジェクトのプロパティのみをマージ）**：

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // obj1 のプロパティのみ含められる

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### 問題 3：ジェネリックインターフェース

データアクセス操作のためのジェネリックインターフェース `Repository` を定義してください。

```typescript
interface Repository<T> {
  // あなたの定義
}
```

<details>
<summary>クリックして回答を表示</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// 実装例
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

### 問題 4：ジェネリック制約と keyof

キー名に基づいてオブジェクトのプロパティ値を取得する関数を実装し、型安全を確保してください。

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // あなたの実装
}
```

<details>
<summary>クリックして回答を表示</summary>

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 使用例
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const name = getValue(user, 'name');   // string
const age = getValue(user, 'age');     // number
const email = getValue(user, 'email');  // string
// const id = getValue(user, 'id');    // ❌ エラー：'id' は user のキーではない
```

**説明**：
- `K extends keyof T` は K が T のキーの1つであることを保証
- `T[K]` は T オブジェクトの K キーに対応する値の型を表す
- これにより型安全が確保され、コンパイル時にエラーを発見できる

</details>

### 問題 5：条件型とジェネリクス

以下のコードの型推論結果を説明してください。

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>クリックして回答を表示</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**解説**：
- `NonNullable<T>` は条件型（Conditional Type）
- T が `null | undefined` に代入可能であれば `never` を返し、そうでなければ `T` を返す
- `string | null` では、`string` は条件に合わず、`null` は条件に合うため、結果は `string`
- `string | number` では、両方とも条件に合わないため、結果は `string | number`

**実際の応用**：
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

> 上級ジェネリクスパターン

### デフォルト型パラメータ

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // デフォルト型 string を使用
const container2: Container<number> = { value: 42 };
```

### 複数の型パラメータ

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### ジェネリックユーティリティ型

```typescript
// Partial：すべてのプロパティをオプションにする
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required：すべてのプロパティを必須にする
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick：特定のプロパティを選択する
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit：特定のプロパティを除外する
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> ベストプラクティス

### 推奨される方法

```typescript
// 1. 意味のあるジェネリック名を使用
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. 制約を使ってジェネリックの範囲を限定
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. デフォルト型パラメータを提供
interface Config<T = string> {
  value: T;
}

// 4. ジェネリックユーティリティ型を使用
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### 避けるべき方法

```typescript
// 1. ジェネリクスを過度に使用しない
function process<T>(value: T): T {  // ⚠️ 1つの型しかない場合、ジェネリクスは不要
  return value;
}

// 2. 単一文字のジェネリック名を使用しない（シンプルな場合を除く）
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ 意味が不明確
  // ...
}

// 3. 制約を無視しない
function process<T>(value: T) {  // ⚠️ 制限がある場合、制約を追加すべき
  return value.length;  // エラーの可能性
}
```

## 7. Interview Summary

> 面接のまとめ

### クイックリファレンス

**ジェネリクスのコアコンセプト**：
- 定義時に具体的な型を指定せず、使用時に指定
- 構文：`<T>` で型パラメータを定義
- 関数、インターフェース、クラスに適用可能

**ジェネリック制約**：
- `extends` を使ってジェネリックの範囲を制限
- `K extends keyof T` で K が T のキーであることを保証
- 複数の制約を組み合わせ可能

**一般的なパターン**：
- ジェネリック関数：`function identity<T>(arg: T): T`
- ジェネリックインターフェース：`interface Box<T> { value: T; }`
- ジェネリッククラス：`class Container<T> { ... }`

### 面接の回答例

**Q: ジェネリクスとは何ですか？なぜ必要ですか？**

> "ジェネリクスは TypeScript の再利用可能なコンポーネントを作成するメカニズムで、定義時に具体的な型を指定せず、使用時に指定できます。ジェネリクスの主な利点は：1) コードの再利用性を向上させ、1つの関数で複数の型を処理できる；2) 型安全を維持し、コンパイル時に型エラーをチェックできる；3) 重複コードを削減し、各型ごとに関数を書く必要がない。例えば `function identity<T>(arg: T): T` はどの型でも処理でき、string、number などそれぞれに関数を書く必要がありません。"

**Q: ジェネリック制約とは何ですか？どのように使用しますか？**

> "ジェネリック制約は `extends` キーワードを使ってジェネリック型の範囲を制限します。例えば `function getLength<T extends { length: number }>(arg: T)` は T が length プロパティを持つことを保証します。もう1つの一般的な制約は `K extends keyof T` で、K が T のキーの1つであることを保証し、型安全なプロパティアクセスを実現します。制約により、ジェネリクスを使用する際に型安全を維持しつつ、必要な型情報を提供できます。"

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
