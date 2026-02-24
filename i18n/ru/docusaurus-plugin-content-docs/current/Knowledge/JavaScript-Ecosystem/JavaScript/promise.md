---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## Что такое Promise?

Promise — это возможность ES6, введённая в основном для решения проблемы callback hell и упрощения чтения и сопровождения асинхронного кода.
Promise представляет собой конечное завершение (или неудачу) асинхронной операции и её результирующее значение.

Promise имеет три состояния:

- **pending**: начальное состояние
- **fulfilled**: операция завершена успешно
- **rejected**: операция завершилась ошибкой

## Базовое использование (Basic Usage)

### Создание Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // асинхронная операция
  const success = true;

  if (success) {
    resolve('Success!'); // Promise переходит в состояние fulfilled
  } else {
    reject('Failed!'); // Promise переходит в состояние rejected
  }
});

myPromise
  .then((result) => {
    console.log(result); // 'Success!'
  })
  .catch((error) => {
    console.log(error); // 'Failed!'
  });
```

### Реальный пример: обработка API-запросов

```js
// общая функция для API-запросов
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // проверяем, находится ли ответ в диапазоне 200~299
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // преобразуем ответ в JSON и возвращаем
    })
    .catch((error) => {
      // обработка сетевых проблем или ошибок запроса
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // повторный выброс для обработки вызывающим кодом
    });
}

fetchData('https://jsonplaceholder.typicode.com/users/1')
  .then((userData) => {
    console.log('User data received:', userData);
  })
  .catch((error) => {
    console.log('Error:', error.message);
  });
```

## Методы Promise (Promise Methods)

### `.then()` / `.catch()` / `.finally()`

```js
promise
  .then((result) => {
    // обработка успеха
    return result;
  })
  .catch((error) => {
    // обработка ошибки
    console.error(error);
  })
  .finally(() => {
    // выполняется независимо от успеха или неудачи
    console.log('Promise completed');
  });
```

### `Promise.all()`

Разрешается, когда все Promise разрешены, и отклоняется немедленно при отклонении любого Promise.

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('foo'), 100)
);
const promise3 = Promise.resolve(42);

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [3, 'foo', 42]
});
```

**Когда использовать**: продолжать только после того, как все API-вызовы завершатся успешно.

### `Promise.race()`

Возвращает результат первого завершившегося Promise (fulfilled или rejected).

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('first'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('second'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // 'second' (быстрее)
});
```

**Когда использовать**: обработка тайм-аута запроса или получение самого быстрого ответа.

### `Promise.allSettled()`

Ожидает завершения всех Promise (fulfilled/rejected), затем возвращает все результаты.

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('Error');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'Error' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**Когда использовать**: когда нужны все результаты, даже если некоторые завершились ошибкой.

### `Promise.any()`

Разрешается с первым fulfilled Promise. Отклоняется только если все Promise отклонены.

```js
const promise1 = Promise.reject('Error 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Success'), 100)
);
const promise3 = Promise.reject('Error 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // 'Success'
});
```

**Когда использовать**: запасные ресурсы, где достаточно одного успеха.

## Вопросы для собеседования (Interview Questions)

### Вопрос 1: цепочка Promise и обработка ошибок

Предскажите вывод:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch((e) => console.log('This will not run'));
```

#### Разбор

```js
Promise.resolve(1) // возвращает 1
  .then((x) => x + 1) // x = 1, возвращает 2
  .then(() => {
    throw new Error('My Error'); // выбрасывает -> переход в catch
  })
  .catch((e) => 1) // перехватывает и возвращает нормальное значение 1
  .then((x) => x + 1) // x = 1, возвращает 2
  .then((x) => console.log(x)) // выводит 2
  .catch((e) => console.log('This will not run')); // не выполняется
```

**Ответ: `2`**

#### Ключевые концепции

1. **`catch` может восстановить нормальным значением**: когда `catch()` возвращает нормальное значение, цепочка продолжается в режиме fulfilled.
2. **`then` после `catch` всё равно выполняется**: потому что ошибка была обработана.
3. **Финальный `catch` не выполняется**: новая ошибка не выбрасывается.

Если хотите, чтобы ошибка продолжила распространяться, повторно выбросьте её в `catch`:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('Error caught');
    throw e; // повторный выброс
  })
  .then((x) => x + 1) // не выполнится
  .then((x) => console.log(x)) // не выполнится
  .catch((e) => console.log('This will run')); // выполнится
```

### Вопрос 2: Event Loop и порядок выполнения

> Этот вопрос также проверяет понимание Event Loop.

Предскажите вывод:

```js
function a() {
  console.log('Warlock');
}

function b() {
  console.log('Druid');
  Promise.resolve().then(() => {
    console.log('Rogue');
  });
}

function c() {
  console.log('Mage');
}

function d() {
  setTimeout(c, 100);
  const temp = Promise.resolve().then(a);
  console.log('Warrior');
  setTimeout(b, 0);
}

d();
```

#### Порядок выполнения в `d()`

```js
function d() {
  setTimeout(c, 100); // 4. макрозадача (задержка 100мс)
  const temp = Promise.resolve().then(a); // 2. микрозадача (после синхронного кода)
  console.log('Warrior'); // 1. синхронный код
  setTimeout(b, 0); // 3. макрозадача (0мс, но всё равно макро)
}
```

Порядок выполнения:

1. **Синхронный код**: `console.log('Warrior')` -> `Warrior`
2. **Микрозадача**: `Promise.resolve().then(a)` -> выполняется `a()` -> `Warlock`
3. **Макрозадачи**:
   - `setTimeout(b, 0)` выполняется первым
   - выполняется `b()` -> `Druid`
   - внутри `b`, `Promise.resolve().then(...)` — микрозадача -> `Rogue`
4. **Макрозадача**: `setTimeout(c, 100)` выполняется позже -> `Mage`

#### Ответ

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### Ключевые концепции

- **Синхронный код** > **Микрозадачи (`Promise`)** > **Макрозадачи (`setTimeout`)**
- Callback `.then()` — микрозадачи: выполняются после текущей макрозадачи, перед следующей макрозадачей
- `setTimeout(..., 0)` — всё равно макрозадача и выполняется после микрозадач

### Вопрос 3: конструктор Promise — синхронное vs асинхронное поведение

Предскажите вывод:

```js
function printing() {
  console.log(1);
  setTimeout(function () {
    console.log(2);
  }, 1000);
  setTimeout(function () {
    console.log(3);
  }, 0);

  new Promise((resolve, reject) => {
    console.log(4);
    resolve(5);
  }).then((foo) => {
    console.log(6);
  });

  console.log(7);
}

printing();

// вывод ?
```

#### Важная деталь

Ключевой момент: **код внутри конструктора Promise выполняется синхронно**.
Только callback `.then()` / `.catch()` являются асинхронными.

Анализ выполнения:

```js
console.log(1); // 1. синхронно
setTimeout(() => console.log(2), 1000); // 5. макрозадача (1000мс)
setTimeout(() => console.log(3), 0); // 4. макрозадача (0мс)

new Promise((resolve, reject) => {
  console.log(4); // 2. синхронно (внутри конструктора)
  resolve(5);
}).then((foo) => {
  console.log(6); // микрозадача
});

console.log(7); // 3. синхронно
```

Порядок выполнения:

1. **Синхронно**: 1 -> 4 -> 7
2. **Микрозадача**: 6
3. **Макрозадачи** (по задержке): 3 -> 2

#### Ответ

```
1
4
7
6
3
2
```

#### Ключевые концепции

1. **Тело конструктора Promise — синхронное**: `console.log(4)` не является асинхронным.
2. **Только `.then()` и `.catch()` — асинхронные микрозадачи**.
3. **Порядок**: синхронный код -> микрозадачи -> макрозадачи.

## Распространённые подводные камни (Common Pitfalls)

### 1. Забыли `return`

Если забыть `return` в цепочке Promise, следующий `.then()` получает `undefined`.

```js
// ❌ неправильно
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // забыли return
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ правильно
fetchUser()
  .then((user) => {
    return fetchPosts(user.id);
  })
  .then((posts) => {
    console.log(posts); // корректные данные
  });
```

### 2. Забыли перехватить ошибки

Необработанные отклонения Promise могут нарушить поток и создать шумные ошибки во время выполнения.

```js
// ❌ может вызвать необработанное отклонение
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ добавьте catch
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Error occurred:', error);
  });
```

### 3. Чрезмерное использование `new Promise(...)`

Не оборачивайте функцию, которая уже возвращает Promise.

```js
// ❌ ненужная обёртка
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ возвращайте напрямую
function fetchData() {
  return fetch(url);
}
```

### 4. Неправильная цепочка нескольких catch

Каждый `catch()` обрабатывает ошибки из предшествующих частей цепочки.

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('Caught:', e.message); // Caught: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('Caught:', e.message); // Caught: Error 2
  });
```

## Связанные темы (Related Topics)

- [async/await](/docs/async-await) — более чистый синтаксический сахар для Promise
- [Event Loop](/docs/event-loop) — более глубокое понимание асинхронной модели

## Ссылки (Reference)

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
