---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Обзор (Overview)

В JavaScript есть три ключевых слова для объявления переменных: `var`, `let` и `const`.
Все три объявляют переменные, но различаются по области видимости, требованиям инициализации, поведению при повторном объявлении, правилам переприсваивания и времени доступа.

## Ключевые различия (Key Differences)

| Поведение | `var` | `let` | `const` |
| --- | --- | --- | --- |
| Область видимости (Scope) | Функциональная или глобальная | Блочная | Блочная |
| Инициализация | Необязательна | Необязательна | Обязательна |
| Повторное объявление | Разрешено | Не разрешено | Не разрешено |
| Переприсваивание | Разрешено | Разрешено | Не разрешено |
| Доступ до объявления | Возвращает `undefined` | Выбрасывает `ReferenceError` | Выбрасывает `ReferenceError` |

## Подробное объяснение (Detailed Explanation)

### Область видимости (Scope)

`var` имеет функциональную (или глобальную) область видимости, тогда как `let` и `const` имеют блочную область видимости (включая блоки функций, блоки `if-else` и циклы `for`).

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var in block';
  let letInBlock = 'let in block';
  const constInBlock = 'const in block';
}

console.log(varInBlock); // 'var in block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### Инициализация (Initialization)

`var` и `let` могут быть объявлены без инициализации, но `const` должен быть инициализирован при объявлении.

```javascript
var varVariable; // допустимо
let letVariable; // допустимо
const constVariable; // SyntaxError: Missing initializer in const declaration
```

### Повторное объявление (Redeclaration)

В одной области видимости `var` позволяет повторно объявить ту же переменную, а `let` и `const` — нет.

```javascript
var x = 1;
var x = 2; // допустимо, x теперь 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Переприсваивание (Reassignment)

Переменные, объявленные с `var` и `let`, могут быть переприсвоены, а переменные `const` — нет.

```javascript
var x = 1;
x = 2; // допустимо

let y = 1;
y = 2; // допустимо

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Примечание: хотя переменная `const` не может быть переприсвоена, содержимое объекта/массива всё ещё может быть изменено.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // допустимо
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // допустимо
console.log(arr); // [1, 2, 3, 4]
```

### Доступ до объявления (Temporal Dead Zone)

Переменные, объявленные с `var`, поднимаются и инициализируются как `undefined`.
`let` и `const` тоже поднимаются, но не инициализируются до объявления, поэтому ранний доступ выбрасывает `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Вопрос для собеседования (Interview Question)

### Вопрос: классическая ловушка `setTimeout + var`

Предскажите вывод этого кода:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Распространённый неправильный ответ

Многие думают, что выведется: `1 2 3 4 5`

#### Фактический вывод

```
6
6
6
6
6
```

#### Почему?

Этот вопрос затрагивает три основные концепции:

**1. Функциональная область видимости `var`**

```javascript
// `var` не создаёт блочную область видимости в циклах
for (var i = 1; i <= 5; i++) {
  // `i` находится во внешней области видимости; все итерации используют один и тот же `i`
}
console.log(i); // 6 (после завершения цикла)

// концептуальный эквивалент `var`
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4;
  // цикл завершён
}
```

**2. Асинхронное выполнение `setTimeout`**

```javascript
// `setTimeout` является асинхронным и выполняется после завершения текущего синхронного кода
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Этот callback ставится в очередь event loop
    console.log(i);
  }, 0);
}
// Цикл завершается первым (`i` становится 6), затем выполняются callback
```

**3. Ссылка через замыкание (Closure)**

```javascript
// Все callback ссылаются на один и тот же `i`
// К моменту выполнения `i` уже равен 6
```

#### Решения (Solutions)

**Решение 1: использовать `let` (рекомендуется) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// вывод: 1 2 3 4 5

// `let` концептуально ведёт себя так:
{
  let i = 1; // первая итерация
}
{
  let i = 2; // вторая итерация
}
{
  let i = 3; // третья итерация
}
```

**Почему это работает**: `let` создаёт новую привязку с блочной областью на каждой итерации, поэтому каждый callback захватывает значение этой итерации.

```javascript
// концептуальный эквивалент:
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ...и так далее
```

**Решение 2: использовать IIFE (Immediately Invoked Function Expression)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// вывод: 1 2 3 4 5
```

**Почему это работает**: каждая итерация создаёт новую функциональную область и передаёт текущее `i` как параметр `j`.

**Решение 3: использовать третий параметр `setTimeout`**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // третий аргумент передаётся в callback
}
// вывод: 1 2 3 4 5
```

**Почему это работает**: параметры после задержки передаются в функцию callback.

**Решение 4: использовать `bind`**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// вывод: 1 2 3 4 5
```

**Почему это работает**: `bind` создаёт новую функцию с текущим `i`, привязанным как аргумент.

#### Сравнение решений (Solution Comparison)

| Решение | Плюсы | Минусы | Рекомендация |
| --- | --- | --- | --- |
| `let` | Краткий, современный, понятный | Требует ES6+ | 5/5 настоятельно рекомендуется |
| IIFE | Хорошая совместимость | Более многословный синтаксис | 3/5 приемлемо |
| аргумент `setTimeout` | Простой и прямой | Менее известен многим разработчикам | 4/5 рекомендуется |
| `bind` | Функциональный стиль | Чуть менее читаемый | 3/5 приемлемо |

#### Дополнительные вопросы (Follow-up Questions)

**В1: Что если изменить так?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Ответ**: выводит `6` раз в секунду, всего 5 раз (на 1с, 2с, 3с, 4с и 5с).

**В2: Как вывести 1, 2, 3, 4, 5 по порядку, по одному в секунду?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// выводит 1 после 1с
// выводит 2 после 2с
// выводит 3 после 3с
// выводит 4 после 4с
// выводит 5 после 5с
```

#### Фокус на собеседовании (Interview Focus Points)

Этот вопрос проверяет:

1. ✅ **Область видимости `var`**: функциональная vs блочная область
2. ✅ **Event Loop**: синхронное vs асинхронное выполнение
3. ✅ **Closure**: как функции захватывают внешние переменные
4. ✅ **Решения**: множество подходов и компромиссов

Рекомендуемый порядок ответа на собеседовании:

- Сначала назовите правильный результат (`6 6 6 6 6`)
- Объясните причину (область видимости `var` + асинхронный `setTimeout`)
- Предложите исправления (предпочтите `let`, затем упомяните альтернативы)
- Покажите понимание внутренней работы JavaScript

## Лучшие практики (Best Practices)

1. Предпочитайте `const`: если переменная не требует переприсваивания, `const` улучшает читаемость и сопровождаемость.
2. Используйте `let`, когда требуется переприсваивание.
3. Избегайте `var` в современном JavaScript: его поведение с областью видимости/hoisting часто вызывает неожиданные проблемы.
4. Учитывайте совместимость браузеров: для старых браузеров используйте транспиляторы вроде Babel для преобразования `let`/`const`.

## Связанные темы (Related Topics)

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
