---
id: generics
title: '[Medium] Generics'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. Что такое generics (обобщённые типы)?

> Какую проблему решают generics в TypeScript?

Generics позволяют писать переиспользуемый, типобезопасный код без жёсткого указания одного конкретного типа.

Без generics вы часто дублируете функции для каждого типа. С generics одна реализация может работать для многих типов, сохраняя информацию о типе.

## 2. Generic-функции (Generic Functions)

### Базовый синтаксис

```ts
function identity<T>(value: T): T {
  return value;
}

const n = identity<number>(123);
const s = identity('hello'); // тип выведен как string
```

### Generic-помощник для массивов

```ts
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = firstItem([1, 2, 3]);
const firstString = firstItem(['a', 'b']);
```

## 3. Ограничения generics (Generic Constraints)

Иногда нужен generic-тип с обязательными полями.

```ts
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength('TypeScript');
getLength([1, 2, 3]);
// getLength(123); // Ошибка: у number нет length
```

`extends` здесь означает «должен соответствовать этой форме».

## 4. Несколько типовых параметров (Multiple Type Parameters)

```ts
function toPair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const pair = toPair('id', 1001); // [string, number]
```

Это часто используется в map, словарях и утилитах преобразования данных.

## 5. Generic-интерфейсы и псевдонимы типов

### Generic-интерфейс

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

### Generic-псевдоним типа

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };
```

## 6. Generic-классы (Generic Classes)

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

## 7. Generic-типы по умолчанию (Default Generic Types)

Можно определить запасные типы.

```ts
type ApiResult<T = string> = {
  data: T;
  status: number;
};

const a: ApiResult = { data: 'ok', status: 200 };
const b: ApiResult<number> = { data: 1, status: 200 };
```

## 8. `keyof` с generics

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Alex' };
const name = pick(user, 'name'); // string
```

Этот паттерн является основой многих утилитных типов.

## 9. Распространённые ошибки и лучшие практики

### Распространённые ошибки

- Использование слишком большого количества generic-параметров без чёткой цели
- Именование всего `T` в сложных API
- Возврат к `any` вместо правильных ограничений

### Лучшие практики

- Используйте описательные имена в сложных случаях (`TItem`, `TValue`)
- Добавляйте ограничения там, где поведение зависит от формы
- Предпочитайте вывод типов, явные аргументы типов — только когда необходимо
- Сохраняйте generic API маленькими и сфокусированными

## 10. Краткие ответы для собеседования (Quick Interview Answers)

### В1: Каково главное преимущество generics?

Переиспользуемый код с типобезопасностью на этапе компиляции.

### В2: Что означает `T extends U`?

`T` должен быть присваиваем `U`; это ограничение generic.

### В3: Когда следует избегать generics?

Когда абстракция не улучшает ясность или поддерживает только один конкретный тип.
