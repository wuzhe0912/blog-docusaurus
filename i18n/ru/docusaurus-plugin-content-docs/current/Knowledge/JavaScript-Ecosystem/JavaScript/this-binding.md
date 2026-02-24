---
id: this-binding
title: '[Medium] 📄 Привязка this'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. Что такое `this` в JavaScript?

> Что такое `this` в JavaScript?

`this` — это ключевое слово в JavaScript, которое указывает на объект контекста выполнения функции.
Значение `this` зависит от **того, как функция вызвана**, а не от того, где она определена.

### Правила привязки `this`

В JavaScript существует четыре правила привязки `this` (от высшего к низшему приоритету):

1. **Привязка new**: функция вызвана с `new`
2. **Явная привязка**: `call`, `apply` или `bind` явно устанавливают `this`
3. **Неявная привязка**: вызывается как метод объекта
4. **Привязка по умолчанию**: поведение по умолчанию в других местах вызова

## 2. Объясните различие `this` в разных контекстах

> Объясните, как ведёт себя `this` в разных контекстах.

### 1. `this` в глобальном контексте

```javascript
console.log(this); // браузер: window, Node.js: global

function globalFunction() {
  console.log(this); // не strict: window/global, strict: undefined
}

globalFunction();
```

```javascript
'use strict';

function strictFunction() {
  console.log(this); // undefined
}

strictFunction();
```

### 2. `this` в обычных функциях

Для обычных функций `this` зависит от **места вызова**:

```javascript
function regularFunction() {
  console.log(this);
}

// прямой вызов
regularFunction(); // window (не strict) или undefined (strict)

// вызов как метод
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// call/apply/bind
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. `this` в стрелочных функциях

**Стрелочные функции не имеют собственного `this`**.
Они **наследуют `this` из внешней лексической области**.

```javascript
const obj = {
  name: 'Object',

  // обычный метод
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // внутренняя обычная функция: this меняется
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // внутренняя стрелочная функция: this наследуется
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // стрелочная функция как свойство объекта
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window/global лексическая область
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. `this` в методах объекта

```javascript
const person = {
  name: 'John',
  age: 30,

  // обычная функция: this -> person
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },

  // сокращённый синтаксис ES6: this -> person
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },

  // стрелочная функция: this наследуется из внешней области
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // обычно undefined для name
  },
};

person.greet();
person.introduce();
person.arrowGreet();
```

### 5. `this` в функциях-конструкторах

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.greet = function () {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const john = new Person('John', 30);
john.greet();
console.log(john.name); // "John"
```

### 6. `this` в классах

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // обычный метод: this -> экземпляр
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // стрелочная функция в поле класса: this постоянно привязан к экземпляру
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// извлечение метода теряет this
const greet = john.greet;
greet(); // ошибка в strict mode

// стрелочное поле сохраняет this
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Задачи: что будет выведено?

> Задачи: что выведет следующий код?

### Задача 1: метод объекта vs стрелочная функция

```javascript
const obj = {
  name: 'Object',
  regularFunc: function () {
    console.log('A:', this.name);
  },
  arrowFunc: () => {
    console.log('B:', this.name);
  },
};

obj.regularFunc();
obj.arrowFunc();
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// A: Object
// B: undefined
```

**Объяснение:**

- `regularFunc` вызвана как `obj.regularFunc()`, поэтому `this` равен `obj`
- `arrowFunc` не имеет собственного `this`; наследует внешний/глобальный лексический `this`

</details>

### Задача 2: передача функции как аргумента

```javascript
const person = {
  name: 'John',
  greet: function () {
    console.log(`Hello, ${this.name}`);
  },
};

person.greet(); // 1

const greet = person.greet;
greet(); // 2

setTimeout(person.greet, 1000); // 3
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" или ошибка в strict mode
// 3: "Hello, undefined" или ошибка в strict mode
```

**Объяснение:**

1. `person.greet()` -> неявная привязка, `this` равен `person`
2. Извлечённая функция -> `this` потерян
3. Callback, переданный в `setTimeout` -> `this` не равен `person`

</details>

### Задача 3: вложенные функции

```javascript
const obj = {
  name: 'Outer',
  method: function () {
    console.log('A:', this.name);

    function inner() {
      console.log('B:', this.name);
    }
    inner();

    const arrow = () => {
      console.log('C:', this.name);
    };
    arrow();
  },
};

obj.method();
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**Объяснение:**

- `A`: `method` вызван от `obj`
- `B`: `inner` — обычный прямой вызов
- `C`: стрелочная функция наследует `this` внешнего `method`

</details>

### Задача 4: `setTimeout` и стрелочная функция

```javascript
const obj = {
  name: 'Object',

  method1: function () {
    setTimeout(function () {
      console.log('A:', this.name);
    }, 100);
  },

  method2: function () {
    setTimeout(() => {
      console.log('B:', this.name);
    }, 100);
  },
};

obj.method1();
obj.method2();
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// A: undefined
// B: Object
```

**Объяснение:**

- `A`: обычный callback в `setTimeout` теряет контекст метода
- `B`: стрелочный callback наследует `this` из `method2`

</details>

### Задача 5: сложная привязка `this`

```javascript
const obj1 = {
  name: 'obj1',
  getThis: function () {
    return this;
  },
};

const obj2 = {
  name: 'obj2',
};

console.log('A:', obj1.getThis().name);

const getThis = obj1.getThis;
console.log('B:', getThis() === window); // предполагается браузер

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**Объяснение:**

- `A`: вызван от `obj1`
- `B`: прямой вызов использует привязку по умолчанию (window в не-strict браузере)
- `C`: вызван от `obj2`
- `D`: явно привязан через `bind(obj2)`

</details>

### Задача 6: конструктор и prototype

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log(`Hello, I'm ${this.name}`);
};

Person.prototype.delayedGreet = function () {
  setTimeout(function () {
    console.log('A:', this.name);
  }, 100);
};

Person.prototype.arrowDelayedGreet = function () {
  setTimeout(() => {
    console.log('B:', this.name);
  }, 100);
};

const john = new Person('John');
john.delayedGreet();
john.arrowDelayedGreet();
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// A: undefined
// B: John
```

**Объяснение:**

- `A`: обычный callback в setTimeout использует глобальную/стандартную привязку
- `B`: стрелочный callback наследует `this` экземпляра

</details>

### Задача 7: глобальная переменная vs свойство объекта

```javascript
var name = 'jjjj';

var obj = {
  a: function () {
    name = 'john';
    console.log(this.name);
  },
};

obj.a();
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// undefined
```

**Объяснение:**

Ключ — в разнице между **глобальными переменными** и **свойствами объекта**.

1. `this` в `obj.a()` указывает на `obj`
2. `name = 'john'` (без объявления) обновляет глобальную переменную
3. `this.name` читает `obj.name`
4. У `obj` нет свойства `name`, поэтому это `undefined`

**Порядок выполнения:**

```javascript
// начальное состояние
window.name = 'jjjj';
obj = {
  a: function () {
    /* ... */
  },
  // у obj нет свойства name
};

obj.a();
  ↓
window.name = 'john'; // глобальное значение изменено
this.name; // равно obj.name
obj.name; // undefined
```

Если хотите `'john'`, присваивайте через `this.name = 'john'`.

```javascript
var obj = {
  a: function () {
    this.name = 'john';
    console.log(this.name); // 'john'
  },
};

obj.a();
console.log(obj.name); // 'john'
```

</details>

### Задача 8: ловушка глобальной переменной (расширенная)

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified';
    console.log('1:', name); // глобальная переменная
    console.log('2:', this.name); // свойство объекта
  },
};

obj.a();
console.log('3:', name); // глобальная переменная
console.log('4:', obj.name); // свойство объекта
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**Ключевой момент:**

- `name` без `this.` -> глобальная переменная
- `this.name` -> свойство объекта
- Это разные значения

</details>

## 4. Как сохранить `this` в callback?

> Как сохранить `this` внутри callback-функций?

### Способ 1: стрелочная функция

```javascript
const obj = {
  name: 'Object',

  method: function () {
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Способ 2: `bind()`

```javascript
const obj = {
  name: 'Object',

  method: function () {
    setTimeout(
      function () {
        console.log(this.name); // "Object"
      }.bind(this),
      1000
    );
  },
};

obj.method();
```

### Способ 3: сохранение `this` в переменную (устаревший паттерн)

```javascript
const obj = {
  name: 'Object',

  method: function () {
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Способ 4: `call()` / `apply()`

```javascript
function greet() {
  console.log(`Hello, I'm ${this.name}`);
}

const person1 = { name: 'John' };
const person2 = { name: 'Jane' };

greet.call(person1); // "Hello, I'm John"
greet.apply(person2); // "Hello, I'm Jane"
```

## 5. Распространённые подводные камни `this`

> Распространённые подводные камни `this`

### Подводный камень 1: извлечение метода объекта

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ this потерян

const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### Подводный камень 2: `this` в обработчиках событий

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ стрелочная функция здесь не привязывается к button
  handleClick1: () => {
    console.log(this); // window/global лексическая область
  },

  // ✅ обычная функция в обработчике получает элемент события как this
  handleClick2: function () {
    console.log(this); // элемент button
  },

  // ✅ используйте стрелочную обёртку, когда нужен this объекта внутри callback
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### Подводный камень 3: callback в методах массивов

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ обычный callback теряет this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item);
    });
  },

  // ✅ стрелочный callback сохраняет лексический this
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item);
    });
  },

  // ✅ используйте thisArg
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item);
    }, this);
  },
};
```

## 6. Сводка правил привязки `this`

> Сводка правил привязки `this`

### Приоритет (высокий -> низкий)

```javascript
// 1. привязка new (высший)
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. явная привязка (call/apply/bind)
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. неявная привязка (метод объекта)
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. привязка по умолчанию (низший)
greet(); // undefined (strict) или глобальное name (не-strict)
```

### Обычная функция vs стрелочная функция (Function vs Arrow Function)

| Характеристика | Функция | Стрелочная функция |
| --- | --- | --- |
| Имеет собственный `this` | ✅ Да | ❌ Нет |
| `this` определяется | Местом вызова | Лексической областью определения |
| `call`/`apply`/`bind` могут изменить `this` | ✅ Да | ❌ Нет |
| Может быть конструктором | ✅ Да | ❌ Нет |
| Имеет `arguments` | ✅ Да | ❌ Нет |
| Лучше для | Методов объектов, конструкторов | Callback, наследование внешнего `this` |

### Фраза для запоминания

> **"Стрелочная наследует, обычная зависит от вызова."**
>
> - Стрелочная функция: `this` наследуется из внешней лексической области
> - Обычная функция: `this` определяется в момент вызова местом вызова

## 7. Лучшие практики (Best Practices)

> Лучшие практики

### ✅ Рекомендуется

```javascript
// 1. Используйте обычную функцию или сокращённый синтаксис для методов объектов
const obj = {
  name: 'Object',

  // ✅ хорошо
  greet: function () {
    console.log(this.name);
  },

  // ✅ хорошо
  introduce() {
    console.log(this.name);
  },
};

// 2. Используйте стрелочные функции для callback, которые должны сохранить внешний this
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. Используйте обычную функцию, когда нужен динамический this
const button = {
  label: 'Click me',

  handleClick: function () {
    console.log(this); // элемент события / объект-получатель
  },
};
```

### ❌ Не рекомендуется

```javascript
// 1. Избегайте стрелочных функций как методов объектов
const obj = {
  name: 'Object',

  greet: () => {
    console.log(this.name); // undefined в большинстве случаев
  },
};

// 2. Избегайте стрелочных функций как конструкторов
const Person = (name) => {
  this.name = name; // неправильно
};

// 3. Избегайте стрелочных функций, когда нужен объект arguments
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Ссылки (Reference)

- [MDN - this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
