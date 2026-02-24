---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. Что такое `interface` и `type`?

> Чем отличаются `interface` и `type` в TypeScript?

Оба определяют типы, и они пересекаются во многих случаях описания формы объекта.

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

Для базового моделирования объектов оба подхода допустимы.

## 2. Ключевые различия (Key Differences)

| Тема | `interface` | `type` |
| --- | --- | --- |
| Форма объекта | Отлично | Отлично |
| Псевдоним примитива | Не поддерживается | Поддерживается |
| Union тип | Напрямую не поддерживается | Поддерживается |
| Tuple тип | Напрямую не поддерживается | Поддерживается |
| Слияние объявлений | Поддерживается | Не поддерживается |
| Mapped/conditional типы | Ограничено | Первоклассная поддержка |

## 3. Слияние объявлений (Declaration Merging)

Объявления `interface` с одинаковым именем объединяются.

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

`type` не может быть повторно открыт с тем же именем.

## 4. Union, tuple и расширенная композиция

Это естественно для `type`.

```ts
type Status = 'idle' | 'loading' | 'success' | 'error';
type Point = [number, number];

type ApiSuccess<T> = { ok: true; data: T };
type ApiFail = { ok: false; message: string };
type ApiResult<T> = ApiSuccess<T> | ApiFail;
```

## 5. Расширение и комбинирование (Extending and Combining)

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

Оба паттерна распространены. Выбирайте тот, который соответствует соглашениям вашей команды.

## 6. Типы функций (Function Types)

```ts
interface Formatter {
  (value: string): string;
}

type Parser = (input: string) => number;
```

Оба хорошо работают для сигнатур функций.

## 7. Практическое руководство по выбору (Practical Decision Guide)

Используйте `interface`, когда:

- Вы в первую очередь моделируете контракты объектов
- Вам нужно поведение слияния объявлений
- Вы определяете контракты публичного API в библиотеках

Используйте `type`, когда:

- Вам нужны union/tuple/примитивные псевдонимы
- Вы полагаетесь на mapped или conditional типы
- Вы хотите составлять расширенную логику типов

## 8. Рекомендация для большинства команд

- Начинайте с `interface` для простых контрактов объектов
- Используйте `type` для union, tuple и программирования на уровне типов
- Поддерживайте единообразие в каждой кодовой базе для снижения когнитивной нагрузки

## 9. Краткие ответы для собеседования (Quick Interview Answers)

### В1: Один строго лучше другого?

Нет. Они во многом пересекаются; различия проявляются в продвинутых сценариях.

### В2: Почему авторы библиотек могут предпочитать `interface`?

Слияние объявлений может улучшить расширяемость для потребителей.

### В3: Почему код приложения может предпочитать `type`?

Код приложения часто использует union и композицию в стиле утилит.
