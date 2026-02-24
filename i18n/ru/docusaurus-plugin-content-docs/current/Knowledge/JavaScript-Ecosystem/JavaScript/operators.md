---
id: operators
title: '[Easy] 📄 Операторы JavaScript'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. В чём разница между `==` и `===`?

> В чём разница между `==` и `===`?

Оба являются операторами сравнения.
`==` сравнивает значения с приведением типов, тогда как `===` сравнивает и значение, и тип (строгое равенство).

Из-за правил приведения типов JavaScript `==` может давать неожиданные результаты:

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

Это увеличивает когнитивную нагрузку, поэтому в большинстве случаев рекомендуется `===` для избежания неожиданных ошибок.

**Лучшая практика**: всегда используйте `===` и `!==`, если только вы точно не знаете, зачем нужен `==`.

### Вопросы для собеседования (Interview Questions)

#### Вопрос 1: сравнение примитивов

Предскажите результат:

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**Ответ:**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**Объяснение:**

- **`==` (нестрогое равенство)** выполняет приведение типов
  - `'1'` преобразуется в `1`
  - затем сравнивается `1 == 1` -> `true`
- **`===` (строгое равенство)** не выполняет приведение
  - `number` и `string` — разные типы -> `false`

**Правила приведения типов (распространённые случаи):**

```javascript
// примеры приоритета приведения ==
// 1. если одна сторона — число, другая преобразуется в число
'1' == 1; // true
'2' == 2; // true
'0' == 0; // true

// 2. если одна сторона — boolean, boolean преобразуется в число
true == 1; // true
false == 0; // true
'1' == true; // true

// 3. подводные камни преобразования строки в число
'' == 0; // true
' ' == 0; // true (строка с пробелами преобразуется в 0)
```

#### Вопрос 2: `null` vs `undefined`

Предскажите результат:

```javascript
undefined == null; // ?
undefined === null; // ?
```

**Ответ:**

```javascript
undefined == null; // true
undefined === null; // false
```

**Объяснение:**

Это **специальное правило JavaScript**:

- **`undefined == null`** равно `true`
  - спецификация явно определяет нестрогое равенство между ними
  - это один из допустимых случаев использования `==`: проверка одновременно `null` и `undefined`
- **`undefined === null`** равно `false`
  - разные типы, поэтому строгое равенство не выполняется

**Практическое использование:**

```javascript
// проверка, является ли значение null или undefined
function isNullOrUndefined(value) {
  return value == null;
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// эквивалентная развёрнутая форма
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**Подводные камни:**

```javascript
// null и undefined нестрого равны только друг другу
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// с ===, каждый равен только самому себе
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### Вопрос 3: смешанные сравнения

Предскажите результат:

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**Ответ:**

```javascript
0 == false; // true (false -> 0)
0 === false; // false (number vs boolean)
'' == false; // true ('' -> 0, false -> 0)
'' === false; // false (string vs boolean)
null == false; // false (null нестрого равен только null/undefined)
undefined == false; // false (undefined нестрого равен только null/undefined)
```

**Процесс преобразования:**

```javascript
// 0 == false
0 == false;
0 == 0;
true;

// '' == false
'' == false;
'' == 0;
0 == 0;
true;

// null == false
null == false;
// null не преобразуется в этом пути сравнения
false;
```

#### Вопрос 4: сравнение объектов

Предскажите результат:

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**Ответ:**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**Объяснение:**

- Объекты (включая массивы) сравниваются по **ссылке**, а не по содержимому.
- Два разных экземпляра объекта никогда не равны, даже с одинаковым содержимым.
- Для объектов `==` и `===` оба сравнивают ссылки.

```javascript
// одна и та же ссылка -> равны
const arr1 = [];
const arr2 = arr1;
arr1 == arr2; // true
arr1 === arr2; // true

// одинаковое содержимое, но разные экземпляры -> не равны
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false
arr3 === arr4; // false

// то же для объектов
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### Краткая шпаргалка для собеседования

**Правила приведения `==` (практический порядок):**

1. `null == undefined` -> `true` (специальное правило)
2. `number == string` -> строка преобразуется в число
3. `number == boolean` -> boolean преобразуется в число
4. `string == boolean` -> оба преобразуются в число
5. Объекты сравниваются по ссылке

**Правила `===` (простые):**

1. Разный тип -> `false`
2. Одинаковый тип -> сравниваются значение (примитивы) или ссылка (объекты)

**Лучшие практики:**

```javascript
// ✅ используйте === по умолчанию
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ одно распространённое исключение: проверка null/undefined
if (value == null) {
  // value равно null или undefined
}

// ❌ избегайте == в целом
if (value == 0) {
}
if (name == 'Alice') {
}
```

**Пример ответа на собеседовании:**

> `==` выполняет приведение типов и может давать неожиданные результаты, например `0 == '0'` — это `true`.
> `===` — строгое равенство, поэтому несоответствие типов сразу возвращает `false`.
>
> Лучшая практика — использовать `===` везде, кроме `value == null` для намеренной проверки `null` и `undefined`.
>
> Также обратите внимание: `null == undefined` — это `true`, но `null === undefined` — это `false`.

---

## 2. В чём разница между `&&` и `||`? Объясните вычисление по короткой схеме (Short-Circuit Evaluation)

> В чём разница между `&&` и `||`? Объясните вычисление по короткой схеме.

### Основная идея

- **`&&` (И)**: если левая сторона `falsy`, немедленно возвращает левую сторону (правая не вычисляется)
- **`||` (ИЛИ)**: если левая сторона `truthy`, немедленно возвращает левую сторону (правая не вычисляется)

### Примеры короткой схемы

```js
// короткая схема &&
const user = null;
const name = user && user.name; // user — falsy, возвращает null, user.name не вычисляется
console.log(name); // null (без ошибки)

// короткая схема ||
const defaultName = 'Guest';
const userName = user || defaultName;
console.log(userName); // 'Guest'

// практическое использование
function greet(name) {
  const displayName = name || 'Anonymous';
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### Распространённый подводный камень ⚠️

```js
// проблема: 0 и '' тоже falsy
const count = 0;
const result = count || 10; // возвращает 10
console.log(result); // 10 (возможно, непреднамеренно)

// решение: используйте ??
const betterResult = count ?? 10; // fallback только для null/undefined
console.log(betterResult); // 0
```

---

## 3. Что такое оператор `?.` (Optional Chaining)?

> Что такое optional chaining `?.`?

### Проблемный сценарий

Традиционный доступ может вызвать ошибки:

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ рискованно: выбросит ошибку, если address отсутствует
console.log(user.address.city); // ok
console.log(otherUser.address.city); // TypeError

// ✅ безопасно, но многословно
const city = user && user.address && user.address.city;
```

### Использование optional chaining

```js
// ✅ кратко и безопасно
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined (без ошибки)

// для вызовов методов
user?.getName?.();

// для массивов
const firstItem = users?.[0]?.name;
```

### Практическое использование

```js
// обработка ответа API
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Unknown User';
  const email = response?.data?.user?.email ?? 'No email';

  console.log(`User: ${userName}`);
  console.log(`Email: ${email}`);
}

// доступ к DOM
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. Что такое оператор `??` (Nullish Coalescing)?

> Что такое nullish coalescing `??`?

### Отличие от `||`

```js
// || рассматривает все falsy-значения как триггер для fallback
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? рассматривает только null и undefined как nullish
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### Практическое использование

```js
// сохранение допустимых значений 0
function updateScore(newScore) {
  const score = newScore ?? 100;
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// значения конфигурации по умолчанию
const config = {
  timeout: 0, // допустимая конфигурация
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0
const retries = config.maxRetries ?? 3; // 3
```

### Комбинированное использование

```js
// ?? и ?. часто используются вместе
const userAge = user?.profile?.age ?? 18;

// значения формы по умолчанию
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0,
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. В чём разница между `i++` и `++i`?

> В чём разница между `i++` и `++i`?

### Основное различие

- **`i++` (постфикс)**: сначала возвращает текущее значение, затем увеличивает
- **`++i` (префикс)**: сначала увеличивает, затем возвращает новое значение

### Пример

```js
let a = 5;
let b = a++; // b = 5, a = 6
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6
console.log(c, d); // 6, 6
```

### Практическое влияние

```js
// обычно нет разницы в циклах, если возвращаемое значение не используется
for (let i = 0; i < 5; i++) {}
for (let i = 0; i < 5; ++i) {}

// но есть разница внутри выражений
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1
console.log(arr[++i]); // 3
```

### Лучшая практика

```js
// ✅ понятнее: разбить на шаги
let count = 0;
const value = arr[count];
count++;

// ⚠️ менее читаемо при чрезмерном использовании
const value2 = arr[count++];
```

---

## 6. Что такое тернарный оператор (Ternary Operator)? Когда его использовать?

> Что такое тернарный оператор? Когда его использовать?

### Синтаксис

```js
condition ? valueIfTrue : valueIfFalse;
```

### Простой пример

```js
// if-else
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// ✅ тернарный
const message2 = age >= 18 ? 'Adult' : 'Minor';
```

### Хорошие случаи использования

```js
// 1. простое условное присваивание
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. условный рендеринг в JSX/шаблонах
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. значения по умолчанию с другими операторами
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Welcome, ${displayName}!` : `Hello, ${displayName}`;

// 4. возвращаемое значение функции
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### Случаи, которых следует избегать

```js
// ❌ глубоко вложенный тернарный ухудшает читаемость
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ понятнее с if-else/switch
let result2;
if (condition1) result2 = value1;
else if (condition2) result2 = value2;
else if (condition3) result2 = value3;
else result2 = value4;

// ❌ сложная бизнес-логика в тернарном
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ разбить на читаемые шаги
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess2 = isAdmin || hasReadPermission;
```

---

## Краткая шпаргалка (Quick Cheat Sheet)

| Оператор | Назначение | Подсказка для запоминания |
| --- | --- | --- |
| `===` | Строгое равенство | Используйте по умолчанию, избегайте `==` |
| `&&` | Короткая схема И | Останавливается на левом falsy |
| `\|\|` | Короткая схема ИЛИ | Останавливается на левом truthy |
| `?.` | Optional chaining | Безопасный доступ без выброса ошибок |
| `??` | Nullish coalescing | Fallback только для null/undefined |
| `++i` / `i++` | Инкремент | Префикс — сначала, постфикс — после |
| `? :` | Тернарный оператор | Хорош только для простых условий |

## Ссылки (Reference)

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
