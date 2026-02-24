---
id: primitive-vs-reference
title: '[Medium] 📄 Примитивные и ссылочные типы'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. Что такое примитивные и ссылочные типы (Primitive Types и Reference Types)?

> Что такое примитивные и ссылочные типы?

Типы данных JavaScript можно разделить на две категории: **примитивные типы** и **ссылочные типы**.
Они принципиально различаются в поведении памяти и семантике передачи.

### Примитивные типы (Primitive Types)

**Характеристики**:

- Хранятся как непосредственные значения (концептуально в **стеке**)
- Передаются **копированием значения**
- Неизменяемы (immutable)

**7 примитивных типов**:

```javascript
// 1. String
const str = 'hello';

// 2. Number
const num = 42;

// 3. Boolean
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol (ES6)
const sym = Symbol('unique');

// 7. BigInt (ES2020)
const bigInt = 9007199254740991n;
```

### Ссылочные типы (Reference Types)

**Характеристики**:

- Объекты размещаются в **куче** (heap)
- Переменные хранят ссылки (адреса)
- Изменяемы (mutable)

**Примеры**:

```javascript
// 1. Object
const obj = { name: 'John' };

// 2. Array
const arr = [1, 2, 3];

// 3. Function
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Передача по значению vs передача по ссылке (Call by Value vs Call by Reference)

> Передача по значению vs передача по ссылке

### Передача по значению (поведение примитивов)

**Поведение**: значение копируется; изменение копии не влияет на оригинал.

```javascript
let a = 10;
let b = a; // копирование значения

b = 20;

console.log(a); // 10
console.log(b); // 20
```

**Диаграмма памяти**:

```text
┌─────────┐
│ Стек    │
├─────────┤
│ a: 10   │ <- независимое значение
├─────────┤
│ b: 20   │ <- независимое значение после копирования/обновления
└─────────┘
```

### Поведение ссылок (объекты)

**Поведение**: копируется ссылка; обе переменные могут указывать на один и тот же объект.

```javascript
let obj1 = { name: 'John' };
let obj2 = obj1; // копирование ссылки

obj2.name = 'Jane';

console.log(obj1.name); // 'Jane'
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true
```

**Диаграмма памяти**:

```text
┌─────────┐                    ┌──────────────────┐
│ Стек    │                    │ Куча             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (тот же объект)  │
└─────────┘                    └──────────────────┘
```

## 3. Распространённые задачи (Common Quiz Questions)

> Распространённые задачи

### Задача 1: передача примитивных значений

```javascript
function changeValue(x) {
  x = 100;
  console.log('Inside function x:', x);
}

let num = 50;
changeValue(num);
console.log('Outside function num:', num);
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// Inside function x: 100
// Outside function num: 50
```

**Объяснение:**

- `num` — примитив (`Number`)
- аргумент функции получает скопированное значение
- изменение `x` не влияет на `num`

```javascript
// процесс
let num = 50; // Стек: num = 50
changeValue(num); // Стек: x = 50 (копия)
x = 100; // изменяется только x
console.log(num); // всё ещё 50
```

</details>

### Задача 2: передача объектов

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('Inside function obj.name:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('Outside function person.name:', person.name);
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// Inside function obj.name: Changed
// Outside function person.name: Changed
```

**Объяснение:**

- `person` — ссылочный тип (`Object`)
- аргумент функции копирует ссылку
- `obj` и `person` указывают на один и тот же объект

```javascript
// схема памяти
let person = { name: 'Original' }; // куча @0x001
changeObject(person); // obj -> @0x001
obj.name = 'Changed'; // мутация @0x001
console.log(person.name); // чтение из @0x001
```

</details>

### Задача 3: переприсваивание vs мутация свойства

```javascript
function test1(obj) {
  obj.name = 'Modified'; // мутация свойства
}

function test2(obj) {
  obj = { name: 'New Object' }; // переприсваивание локального параметра
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// A: Modified
// B: Modified (не 'New Object')
```

**Объяснение:**

**test1: мутация свойства**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // мутирует оригинальный объект
}
```

**test2: переприсваивание**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // изменяет только локальную привязку
}
// person по-прежнему указывает на оригинальный объект
```

**Схема памяти**:

```text
// до test1
person ---> { name: 'Original' }
obj    ---> { name: 'Original' } (тот же)

// после test1
person ---> { name: 'Modified' }
obj    ---> { name: 'Modified' } (тот же)

// внутри test2
person ---> { name: 'Modified' } (не изменился)
obj    ---> { name: 'New Object' } (новый объект)

// после test2
person ---> { name: 'Modified' }
// локальный obj удалён
```

</details>

### Задача 4: передача массива

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**Объяснение:**

- `modifyArray`: мутирует оригинальный массив
- `reassignArray`: только перепривязывает локальный параметр

</details>

### Задача 5: сравнение на равенство

```javascript
// примитивы
let a = 10;
let b = 10;
console.log('A:', a === b);

// ссылки
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// A: true
// B: false
// C: true
```

**Объяснение:**

Примитивы сравниваются по значению; объекты сравниваются по ссылке.

```javascript
obj1 === obj2; // false (разные ссылки)
obj1 === obj3; // true (одна ссылка)
```

</details>

## 4. Поверхностное копирование vs глубокое копирование (Shallow Copy vs Deep Copy)

> Поверхностное копирование vs глубокое копирование

### Поверхностное копирование (Shallow Copy)

**Определение**: копируется только верхний уровень; вложенные объекты остаются общими ссылками.

#### Способ 1: оператор spread

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

copy.name = 'Jane';
console.log(original.name); // 'John'

copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung' (затронут)
```

#### Способ 2: `Object.assign()`

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John'
```

#### Способ 3: поверхностное копирование массива

```javascript
const arr1 = [1, 2, 3];

const arr2 = [...arr1];
const arr3 = arr1.slice();
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1
```

### Глубокое копирование (Deep Copy)

**Определение**: все уровни копируются рекурсивно.

#### Способ 1: `JSON.parse(JSON.stringify(...))`

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming']
```

**Ограничения**:

```javascript
const obj = {
  date: new Date(), // -> строка
  func: () => {}, // игнорируется
  undef: undefined, // игнорируется
  symbol: Symbol('test'), // игнорируется
  regexp: /abc/, // -> {}
  circular: null, // циклическая ссылка выбрасывает ошибку
};
obj.circular = obj;

JSON.parse(JSON.stringify(obj)); // ошибка или потеря данных
```

#### Способ 2: `structuredClone()`

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

console.log(copy.date instanceof Date); // true
```

**Плюсы**:

- Поддерживает Date, RegExp, Map, Set и т.д.
- Поддерживает циклические ссылки
- Обычно лучшая производительность, чем ручное глубокое клонирование

**Ограничения**:

- Не клонирует функции
- Не клонирует значения Symbol во всех паттернах использования

#### Способ 3: рекурсивное глубокое клонирование

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  if (obj instanceof Date) {
    return new Date(obj);
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei'
```

#### Способ 4: Lodash

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### Сравнение поверхностного и глубокого копирования

| Характеристика | Поверхностное копирование | Глубокое копирование |
| --- | --- | --- |
| Глубина копирования | Только верхний уровень | Все уровни |
| Вложенные объекты | Общие ссылки | Полностью независимые |
| Производительность | Быстрее | Медленнее |
| Использование памяти | Ниже | Выше |
| Случай использования | Простые структуры | Сложные вложенные структуры |

## 5. Распространённые подводные камни (Common Pitfalls)

> Распространённые подводные камни

### Подводный камень 1: ожидание мутации внешнего значения через примитивный аргумент

```javascript
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5

count = increment(count);
console.log(count); // 6
```

### Подводный камень 2: ожидание замены внешнего объекта через переприсваивание

```javascript
function resetObject(obj) {
  obj = { name: 'Reset' }; // только локальная перепривязка
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original'

// правильный подход 1: мутировать свойство
function resetObject1(obj) {
  obj.name = 'Reset';
}

// правильный подход 2: вернуть новый объект
function resetObject2(obj) {
  return { name: 'Reset' };
}
person = resetObject2(person);
```

### Подводный камень 3: предположение, что spread — это глубокое копирование

```javascript
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // поверхностное

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane'

const deep = structuredClone(original);
```

### Подводный камень 4: непонимание `const`

```javascript
const obj = { name: 'John' };

// obj = { name: 'Jane' }; // TypeError

obj.name = 'Jane'; // допустимо
obj.age = 30; // допустимо

const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane';
console.log(immutableObj.name); // 'John'
```

### Подводный камень 5: общая ссылка в циклах

```javascript
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // одна и та же ссылка на объект каждый раз
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]

const arr2 = [];
for (let i = 0; i < 3; i++) {
  arr2.push({ value: i }); // новый объект на каждой итерации
}

console.log(arr2);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Лучшие практики (Best Practices)

> Лучшие практики

### ✅ Рекомендуется

```javascript
// 1. выбирайте явную стратегию копирования
const original = { name: 'John', age: 30 };

const copy1 = { ...original }; // поверхностное
const copy2 = structuredClone(original); // глубокое

// 2. избегайте побочных эффектов мутации в функциях
function addItem(arr, item) {
  return [...arr, item]; // иммутабельный стиль
}

// 3. используйте const для предотвращения случайной перепривязки
const config = { theme: 'dark' };

// 4. используйте Object.freeze для неизменяемых констант
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ Избегайте

```javascript
function increment(num) {
  num++; // не влияет на внешний примитив
}

const copy = { ...nested }; // не глубокое копирование

for (let i = 0; i < 3; i++) {
  arr.push(obj); // одна и та же ссылка на объект используется повторно
}
```

## 7. Итоги для собеседования (Interview Summary)

> Итоги для собеседования

### Краткая шпаргалка

**Примитивные (Primitive)**:

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- Передаются по значению
- Неизменяемы

**Ссылочные (Reference)**:

- Object, Array, Function, Date, RegExp и т.д.
- Переменная хранит ссылку на объект в куче
- Изменяемы

### Пример ответа на собеседовании

**В: JavaScript — это передача по значению или по ссылке?**

> JavaScript передаёт все аргументы по значению.
> Для объектов копируемым значением является ссылка (адрес в памяти).
>
> - Примитивные аргументы: копирование значения не влияет на внешнюю переменную.
> - Аргументы-объекты: копирование ссылки позволяет мутировать один и тот же объект.
> - Переприсваивание локального параметра не изменяет внешнюю привязку.

## Ссылки (Reference)

- [MDN - Data Structures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript.info - Object copy](https://javascript.info/object-copy)
