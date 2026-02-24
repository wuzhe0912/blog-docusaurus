---
id: basic-types
title: '[Easy] Базовые типы и аннотации типов'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. Какие базовые типы есть в TypeScript?

> Какие базовые типы предоставляет TypeScript?

TypeScript добавляет систему статической типизации поверх JavaScript. Вы можете аннотировать переменные, параметры функций и возвращаемые значения для обнаружения ошибок до времени выполнения.

### Общие примитивные типы (Common Primitive Types)

```ts
let age: number = 30;
let price: number = 99.99;

let userName: string = 'John';
let message: string = `Hello, ${userName}`;

let isActive: boolean = true;
```

### `null` и `undefined`

```ts
let emptyValue: null = null;
let notAssigned: undefined = undefined;
```

С включённым `strictNullChecks` значения `null` и `undefined` не могут быть присвоены каждому типу.

## 2. Что такое типы object, array и tuple?

### Тип object

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

### Тип array

```ts
const scores: number[] = [80, 90, 100];
const tags: Array<string> = ['ts', 'react'];
```

### Тип tuple

Tuple имеет фиксированную длину и фиксированные позиции.

```ts
const point: [number, number] = [10, 20];
const userRecord: [number, string, boolean] = [1, 'Alice', true];
```

## 3. Что такое union и literal типы?

### Union тип

```ts
let id: string | number = 'A001';
id = 1001;
```

### Literal тип

```ts
type Status = 'idle' | 'loading' | 'success' | 'error';

let requestStatus: Status = 'idle';
requestStatus = 'success';
```

Union и literal типы полезны для моделирования конечных состояний.

## 4. Что такое `any`, `unknown`, `void` и `never`?

### `any`

`any` отключает безопасность типов. Используйте только как временный выход.

```ts
let data: any = 10;
data = 'text';
data = { ok: true };
```

### `unknown`

`unknown` безопаснее, чем `any`. Вы должны сузить тип перед использованием.

```ts
function printLength(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.length);
  }
}
```

### `void`

`void` обычно означает, что функция не возвращает значение.

```ts
function logMessage(message: string): void {
  console.log(message);
}
```

### `never`

`never` означает, что значение никогда не может возникнуть.

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

## 5. Как работают аннотации типов функций?

```ts
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;
```

### Необязательные и параметры по умолчанию

```ts
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}

function formatPrice(price: number, currency: string = 'USD'): string {
  return `${currency} ${price.toFixed(2)}`;
}
```

## 6. Что такое вывод типов (Type Inference)?

TypeScript может выводить типы из значений.

```ts
let count = 0; // выведен как number
const framework = 'React'; // выведен как строковый литерал 'React'
```

Вам не нужно добавлять аннотации везде. Добавляйте явные аннотации там, где API или границы должны быть чёткими.

## 7. Распространённые ошибки и лучшие практики

### Распространённые ошибки

- Чрезмерное использование `any`
- Забывание включить `strict` режим
- Использование широких типов там, где литеральные union лучше

### Лучшие практики

- Включите strict режим в `tsconfig.json`
- Предпочитайте `unknown` вместо `any`
- Используйте union/literal типы для моделирования состояний
- Делайте сигнатуры публичных функций явными

## 8. Краткие ответы для собеседования (Quick Interview Answers)

### В1: Зачем использовать базовые типы TypeScript?

Для обнаружения несоответствий типов во время компиляции и улучшения инструментов IDE.

### В2: `any` vs `unknown`?

`any` отключает проверку. `unknown` заставляет сузить тип перед использованием.

### В3: Когда использовать tuple вместо array?

Используйте tuple, когда позиция и длина фиксированы и имеют смысловое значение.
