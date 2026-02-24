---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. Что такое Closure?

> Что такое замыкание (closure)?

Чтобы понять замыкания, сначала нужно разобраться в области видимости переменных в JavaScript и в том, как функция получает доступ к внешним переменным.

### Область видимости переменных (Variable Scope)

В JavaScript область видимости обычно обсуждается как глобальная и функциональная (а также блочная с `let`/`const`).

```js
// глобальная область видимости
let a = 1;

function parentFunction() {
  // область видимости функции
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // выводит 1 2 3, доступ к глобальной и внешней области
  }

  childFunction();
}

parentFunction();
console.log(a); // выводит 1, доступ к глобальной области
console.log(b, c); // ошибка: нет доступа к переменным внутри функции
```

### Пример замыкания (Closure Example)

Замыкание формируется, когда дочерняя функция определяется внутри родительской и возвращается, сохраняя доступ к лексическому окружению родителя (что предотвращает немедленную сборку мусора для захваченных переменных).

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`Текущий счётчик: ${count}`);
  };
}

const counter = parentFunction();

counter(); // выводит Текущий счётчик: 1
counter(); // выводит Текущий счётчик: 2
// `count` сохраняется, потому что childFunction всё ещё существует и хранит ссылку
```

Будьте осторожны: замыкания удерживают переменные в памяти. Чрезмерное использование может увеличить потребление памяти и снизить производительность.

## 2. Создайте функцию, удовлетворяющую следующим условиям

> Создайте функцию (с использованием концепции замыканий), которая удовлетворяет:

```js
plus(2, 5); // вывод 7
plus(2)(5); // вывод 7
```

### Первое решение: две функции

Разделение на два стиля функций:

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// используем замыкание для сохранения value
function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Второе решение: одна функция

Первый подход может быть отклонён на собеседовании, если просят одну функцию для обоих стилей вызова.

```js
function plus(value, subValue) {
  // определяем поведение по количеству аргументов
  if (arguments.length > 1) {
    return value + subValue;
  } else {
    return function (item) {
      return value + item;
    };
  }
}

console.log(plus(2, 5));
console.log(plus(2)(5));
```

## 3. Используйте замыкание для инкрементального подсчёта

> Используйте замыкания для реализации инкрементального счётчика:

```js
function plus() {
  // код
}

var obj = plus();
obj.add(); // выводит 1
obj.add(); // выводит 2
```

### Первое решение: возврат контейнера переменных

Используем обычный стиль функций (стрелочная функция не требуется).

```js
function plus() {
  let cash = 0;
  let counter = {
    add() {
      cash += 1;
      console.log(cash);
    },
  };
  return counter;
}

var obj = plus();
obj.add();
obj.add();
```

### Второе решение: прямой возврат объекта

Можно также обернуть объект непосредственно в `return`.

```js
function plus() {
  let cash = 0;
  return {
    add: function () {
      cash += 1;
      console.log(cash);
    },
  };
}

var obj = plus();
obj.add();
obj.add();
```

## 4. Что будет выведено при вложенном вызове функций?

> Что выведет следующий код с вложенным вызовом функций?

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

a(b(c));
```

### Анализ

**Вывод:**

```
hello
TypeError: aa is not a function
```

### Подробный порядок выполнения

```js
// Выполняется a(b(c))
// JavaScript вычисляет вызовы функций изнутри наружу

// Шаг 1: вычисление внутреннего b(c)
b(c)
  ↓
// c передаётся в b
// внутри b, bb() означает c()
c() // выводит 'hello'
  ↓
// b не имеет оператора return
// поэтому возвращает undefined
return undefined

// Шаг 2: вычисление a(undefined)
a(undefined)
  ↓
// undefined передаётся в a
// a пытается вызвать aa(), т.е. undefined()
undefined() // ❌ TypeError: aa is not a function
```

### Почему?

#### 1. Порядок вычисления функций (изнутри наружу)

```js
// Пример
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. сначала выполняется multiply(2, 3) -> 6
           └────── 3. затем выполняется add(6)

// Та же идея
a(b(c))
  ↑ ↑
  | └─ 1. вычисляется b(c)
  └─── 2. затем вычисляется a(результат b(c))
```

#### 2. Функция без `return` возвращает `undefined`

```js
function b(bb) {
  bb(); // выполняется, но нет return
} // неявно возвращает undefined

// Эквивалентно
function b(bb) {
  bb();
  return undefined; // добавляется неявно JavaScript
}
```

#### 3. Вызов не-функции выбрасывает TypeError

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// другие случаи ошибок
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### Как исправить?

#### Способ 1: сделать `b` возвращающей функцию

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
  return function () {
    console.log('b выполнена');
  };
}

function c() {
  console.log('hello');
}

a(b(c));
// вывод:
// hello
// b выполнена
```

#### Способ 2: передать ссылку на функцию, не вызывая преждевременно

```js
function a(aa) {
  aa();
}

function b(bb) {
  return function () {
    bb();
  };
}

function c() {
  console.log('hello');
}

a(b(c)); // выводит 'hello'

// или
a(() => b(c)); // выводит 'hello'
```

#### Способ 3: изменить порядок выполнения

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

// выполнить раздельно
b(c); // выводит 'hello'
a(() => console.log('a выполнена')); // выводит 'a выполнена'
```

### Вариации вопросов на собеседовании (Related Interview Variations)

#### Вопрос 1: что если изменить так?

```js
function a(aa) {
  return aa();
}

function b(bb) {
  return bb();
}

function c() {
  console.log('hello');
  return 'world';
}

console.log(a(b(c)));
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```
hello
TypeError: aa is not a function
```

**Объяснение:**

1. `b(c)` -> выполняет `c()`, выводит `'hello'`, возвращает `'world'`
2. `a('world')` -> пытается вызвать `'world'()`
3. `'world'` — строка, а не функция, поэтому выбрасывается TypeError

</details>

#### Вопрос 2: что если все функции возвращают значения?

```js
function a(aa) {
  return aa;
}

function b(bb) {
  return bb;
}

function c() {
  return 'hello';
}

const result = a(b(c));
console.log(result);
console.log(result());
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```
[Function: c]
hello
```

**Объяснение:**

1. `b(c)` -> возвращает функцию `c` саму по себе (не вызывая)
2. `a(c)` -> возвращает функцию `c`
3. `result` — это функция `c`
4. `result()` -> выполняет `c()`, возвращает `'hello'`

</details>

### Ключевые выводы (Key Takeaways)

```javascript
// приоритет вызова функций
a(b(c))
  ↓
// 1. сначала вычисляется внутренний вызов
b(c) // если b не имеет return, результат — undefined
  ↓
// 2. затем вычисляется внешний вызов
a(undefined) // вызов undefined() выбрасывает ошибку

// исправления
// ✅ 1. убедитесь, что промежуточная функция возвращает функцию
// ✅ 2. или оберните в стрелочную функцию
a(() => b(c))
```

## Ссылки (Reference)

- [Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [Memory management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [TypeError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
