---
id: generics
title: '[Medium] Generics'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are generics?

> What problem do generics solve in TypeScript?

Generics let you write reusable, type-safe code without hard-coding one concrete type.

Without generics, you often duplicate functions for each type. With generics, one implementation can work for many types while preserving type information.

## 2. Generic functions

### Basic syntax

```ts
function identity<T>(value: T): T {
  return value;
}

const n = identity<number>(123);
const s = identity('hello'); // type is inferred as string
```

### Generic array helper

```ts
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = firstItem([1, 2, 3]);
const firstString = firstItem(['a', 'b']);
```

## 3. Generic constraints

Sometimes you need a generic type with required fields.

```ts
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength('TypeScript');
getLength([1, 2, 3]);
// getLength(123); // Error: number has no length
```

`extends` here means "must satisfy this shape".

## 4. Multiple type parameters

```ts
function toPair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const pair = toPair('id', 1001); // [string, number]
```

This is common in maps, dictionaries, and data transformation utilities.

## 5. Generic interfaces and type aliases

### Generic interface

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const userResponse: ApiResponse<{ id: number; name: string }> = {
  success: true,
  data: { id: 1, name: 'Pitt' },
};
```

### Generic type alias

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };
```

## 6. Generic classes

```ts
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }
}

const numberQueue = new Queue<number>();
numberQueue.enqueue(10);
```

## 7. Default generic types

You can define fallback types.

```ts
type ApiResult<T = string> = {
  data: T;
  status: number;
};

const a: ApiResult = { data: 'ok', status: 200 };
const b: ApiResult<number> = { data: 1, status: 200 };
```

## 8. `keyof` with generics

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Alex' };
const name = pick(user, 'name'); // string
```

This pattern is core to many utility types.

## 9. Common mistakes and best practices

### Common mistakes

- Using too many generic parameters without clear purpose
- Naming everything `T` in complex APIs
- Falling back to `any` instead of proper constraints

### Best practices

- Use descriptive names in complex cases (`TItem`, `TValue`)
- Add constraints where behavior depends on shape
- Prefer inference first, explicit type arguments only when needed
- Keep generic APIs small and focused

## 10. Quick interview answers

### Q1: What is the biggest benefit of generics?

Reusable code with compile-time type safety.

### Q2: What does `T extends U` mean?

`T` must be assignable to `U`; it is a generic constraint.

### Q3: When should I avoid generics?

When the abstraction does not improve clarity or only supports one concrete type.
