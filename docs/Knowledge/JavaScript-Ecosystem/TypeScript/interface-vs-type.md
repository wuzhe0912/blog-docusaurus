---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are `interface` and `type`?

> How do `interface` and `type` differ in TypeScript?

Both define types, and they overlap for many object-shape use cases.

### `interface`

```ts
interface User {
  id: number;
  name: string;
  email?: string;
}
```

### `type`

```ts
type User = {
  id: number;
  name: string;
  email?: string;
};
```

For basic object modeling, both are valid.

## 2. Key differences

| Topic | `interface` | `type` |
| --- | --- | --- |
| Object shape | Excellent | Excellent |
| Primitive alias | Not supported | Supported |
| Union type | Not supported directly | Supported |
| Tuple type | Not supported directly | Supported |
| Declaration merging | Supported | Not supported |
| Mapped/conditional types | Limited | First-class |

## 3. Declaration merging

`interface` declarations with the same name are merged.

```ts
interface Config {
  apiBase: string;
}

interface Config {
  timeout: number;
}

const cfg: Config = {
  apiBase: '/api',
  timeout: 5000,
};
```

`type` cannot be reopened with the same name.

## 4. Union, tuple, and advanced composition

These are natural with `type`.

```ts
type Status = 'idle' | 'loading' | 'success' | 'error';
type Point = [number, number];

type ApiSuccess<T> = { ok: true; data: T };
type ApiFail = { ok: false; message: string };
type ApiResult<T> = ApiSuccess<T> | ApiFail;
```

## 5. Extending and combining

### Interface extends

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}
```

### Type intersection

```ts
type Animal = { name: string };
type Dog = Animal & { bark(): void };
```

Both patterns are common. Choose the one that fits your team conventions.

## 6. Function types

```ts
interface Formatter {
  (value: string): string;
}

type Parser = (input: string) => number;
```

Both work well for function signatures.

## 7. Practical decision guide

Use `interface` when:

- You primarily model object contracts
- You want declaration merging behavior
- You define public API contracts in libraries

Use `type` when:

- You need union/tuple/primitive aliases
- You rely on mapped or conditional types
- You want to compose advanced type logic

## 8. Recommendation for most teams

- Start with `interface` for simple object contracts
- Use `type` for unions, tuples, and type-level programming
- Keep consistency in each codebase to reduce cognitive load

## 9. Quick interview answers

### Q1: Is one strictly better?

No. They overlap heavily; differences appear in advanced scenarios.

### Q2: Why might library authors prefer `interface`?

Declaration merging can improve extensibility for consumers.

### Q3: Why might app code prefer `type`?

App code often uses unions and utility-style composition.
