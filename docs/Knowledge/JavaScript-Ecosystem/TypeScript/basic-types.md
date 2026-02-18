---
id: basic-types
title: '[Easy] Basic Types and Type Annotations'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript basic types?

> What basic types does TypeScript provide?

TypeScript adds a static type system on top of JavaScript. You can annotate variables, function parameters, and return values to catch mistakes before runtime.

### Common primitive types

```ts
let age: number = 30;
let price: number = 99.99;

let userName: string = 'John';
let message: string = `Hello, ${userName}`;

let isActive: boolean = true;
```

### `null` and `undefined`

```ts
let emptyValue: null = null;
let notAssigned: undefined = undefined;
```

With `strictNullChecks` enabled, `null` and `undefined` are not assignable to every type.

## 2. What are object, array, and tuple types?

### Object type

```ts
type User = {
  id: number;
  name: string;
  email?: string;
};

const user: User = {
  id: 1,
  name: 'Pitt',
};
```

### Array type

```ts
const scores: number[] = [80, 90, 100];
const tags: Array<string> = ['ts', 'react'];
```

### Tuple type

A tuple has fixed length and fixed positions.

```ts
const point: [number, number] = [10, 20];
const userRecord: [number, string, boolean] = [1, 'Alice', true];
```

## 3. What are union and literal types?

### Union type

```ts
let id: string | number = 'A001';
id = 1001;
```

### Literal type

```ts
type Status = 'idle' | 'loading' | 'success' | 'error';

let requestStatus: Status = 'idle';
requestStatus = 'success';
```

Unions and literals are useful for modeling finite states.

## 4. What are `any`, `unknown`, `void`, and `never`?

### `any`

`any` disables type safety. Use only as a temporary escape hatch.

```ts
let data: any = 10;
data = 'text';
data = { ok: true };
```

### `unknown`

`unknown` is safer than `any`. You must narrow before use.

```ts
function printLength(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.length);
  }
}
```

### `void`

`void` usually means a function does not return a value.

```ts
function logMessage(message: string): void {
  console.log(message);
}
```

### `never`

`never` means a value can never happen.

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

## 5. How do function type annotations work?

```ts
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;
```

### Optional and default parameters

```ts
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}

function formatPrice(price: number, currency: string = 'USD'): string {
  return `${currency} ${price.toFixed(2)}`;
}
```

## 6. What is type inference?

TypeScript can infer types from values.

```ts
let count = 0; // inferred as number
const framework = 'React'; // inferred as string literal 'React'
```

You do not need annotations everywhere. Add explicit annotations where APIs or boundaries should be clear.

## 7. Common mistakes and best practices

### Common mistakes

- Overusing `any`
- Forgetting `strict` mode
- Using broad types where literal unions are better

### Best practices

- Enable strict mode in `tsconfig.json`
- Prefer `unknown` over `any`
- Use union/literal types for state modeling
- Keep public function signatures explicit

## 8. Quick interview answers

### Q1: Why use TypeScript basic types?

To catch type mismatches at compile time and improve IDE tooling.

### Q2: `any` vs `unknown`?

`any` opts out of checking. `unknown` forces type narrowing before usage.

### Q3: When should I use tuple instead of array?

Use tuple when position and length are fixed and meaningful.
