---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 Рекомендуется: сначала прочитайте [Promise](/docs/promise) для понимания основных концепций.

## Что такое async/await?

`async/await` — это синтаксический сахар, введённый в ES2017 (ES8), построенный поверх Promise.
Он позволяет писать асинхронный код, который выглядит как синхронный, что улучшает читаемость и сопровождаемость.

**Основные концепции:**

- Функция `async` всегда возвращает Promise.
- `await` можно использовать только внутри функции `async`.
- `await` приостанавливает выполнение функции до завершения Promise.

## Базовый синтаксис (Базовый синтаксис)

### Функция `async`

Ключевое слово `async` автоматически заставляет функцию возвращать Promise:

```js
// Традиционный стиль Promise
function fetchData() {
  return Promise.resolve('data');
}

// Стиль async (эквивалентен)
async function fetchData() {
  return 'data'; // автоматически оборачивается как Promise.resolve('data')
}

// одинаковый паттерн вызова
fetchData().then((data) => console.log(data)); // 'data'
```

### Ключевое слово `await`

`await` ожидает Promise и возвращает его resolved-значение:

```js
async function getData() {
  const result = await Promise.resolve('done');
  console.log(result); // 'done'
}
```

## Promise vs async/await

### Пример 1: простой API-запрос

**Стиль Promise:**

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
}
```

**Стиль async/await:**

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Пример 2: цепочка нескольких асинхронных операций

**Стиль Promise:**

```js
function processUserData(userId) {
  return fetchUser(userId)
    .then((user) => {
      return fetchPosts(user.id);
    })
    .then((posts) => {
      return fetchComments(posts[0].id);
    })
    .then((comments) => {
      console.log(comments);
      return comments;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
```

**Стиль async/await:**

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Обработка ошибок (Error Handling)

### `try/catch` vs `.catch()`

**Использование `try/catch` с async/await:**

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Запрос не удался:', error);
    // Здесь можно обрабатывать разные типы ошибок
    if (error.name === 'NetworkError') {
      // обработка сетевой ошибки
    }
    throw error; // повторный выброс или возврат запасного значения
  }
}
```

**Смешанное использование (не рекомендуется, но работает):**

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('Запрос не удался:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### Вложенный `try/catch`

Используйте многоуровневый `try/catch`, когда разные этапы требуют разного поведения при ошибках:

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('Не удалось получить пользователя:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('Не удалось получить посты:', error);
    return []; // запасной пустой массив
  }
}
```

## Практические примеры (Practical Examples)

### Пример: рабочий процесс оценивания

> Поток: оценить задание -> проверить награду -> выдать награду -> отчисление или штраф

```js
// оценить задание
function correctTest(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const score = Math.round(Math.random() * 100);
      if (score >= 60) {
        resolve({
          name,
          score,
        });
      } else {
        reject('Вы достигли порога отчисления');
      }
    }, 2000);
  });
}

// проверить награду
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} получает билеты в кино`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} получает грамоту`);
      } else {
        reject('Нет награды');
      }
    }, 2000);
  });
}
```

**Стиль Promise:**

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**Переписано с async/await:**

```js
async function processStudent(name) {
  try {
    const data = await correctTest(name);
    const reward = await checkReward(data);
    console.log(reward);
    return reward;
  } catch (error) {
    console.log(error);
    return null;
  }
}

processStudent('John Doe');
```

### Пример: параллельные запросы (Concurrent Requests)

Когда запросы независимы друг от друга, выполняйте их параллельно.

**❌ Неправильно: последовательное выполнение (медленнее):**

```js
async function fetchAllData() {
  const users = await fetchUsers(); // ждём 1 сек
  const posts = await fetchPosts(); // ещё 1 сек
  const comments = await fetchComments(); // ещё 1 сек
  // итого 3 сек
  return { users, posts, comments };
}
```

**✅ Правильно: параллельное выполнение (быстрее):**

```js
async function fetchAllData() {
  // запускаем три запроса одновременно
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // занимает время только самого медленного запроса
  return { users, posts, comments };
}
```

**Используйте `Promise.allSettled()` при частичных ошибках:**

```js
async function fetchAllData() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);

  const users = results[0].status === 'fulfilled' ? results[0].value : [];
  const posts = results[1].status === 'fulfilled' ? results[1].value : [];
  const comments = results[2].status === 'fulfilled' ? results[2].value : [];

  return { users, posts, comments };
}
```

## Распространённые ошибки (Common Pitfalls)

### 1. Использование `await` внутри циклов (случайная последовательность)

**❌ Неправильно: ожидание на каждой итерации, плохая производительность:**

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // последовательно, медленно
    results.push(user);
  }
  return results;
}
// 10 пользователей * 1 сек каждый = 10 секунд
```

**✅ Правильно: `Promise.all()` для параллельности:**

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// параллельные запросы, около 1 секунды в сумме
```

**Компромисс: ограничение параллельности:**

```js
async function processUsersWithLimit(userIds, limit = 3) {
  const results = [];
  for (let i = 0; i < userIds.length; i += limit) {
    const batch = userIds.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map((id) => fetchUser(id)));
    results.push(...batchResults);
  }
  return results;
}
// обрабатываем по 3 за раз, чтобы избежать слишком большого числа одновременных запросов
```

### 2. Забытый `await`

Без `await` вы получаете Promise вместо resolved-значения.

```js
// ❌ неправильно
async function getUser() {
  const user = fetchUser(1); // забыли await, user — это Promise
  console.log(user.name); // undefined (у Promise нет свойства name)
}

// ✅ правильно
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // правильное имя
}
```

### 3. Использование `await` без `async`

`await` можно использовать только внутри функции `async`.

```js
// ❌ неправильно: синтаксическая ошибка
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ правильно
async function getData() {
  const data = await fetchData();
  return data;
}
```

**Top-level await:**

В модульных средах ES2022 можно использовать `await` на верхнем уровне модуля:

```js
// ES2022 module
const data = await fetchData();
console.log(data);
```

### 4. Отсутствие обработки ошибок

Без `try/catch` ошибки могут стать необработанными rejection.

```js
// ❌ может вызвать необработанные ошибки
async function fetchData() {
  const response = await fetch('/api/data'); // выбрасывает ошибку при неудаче
  return response.json();
}

// ✅ добавьте обработку ошибок
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Error:', error);
    return null; // или запасное значение
  }
}
```

### 5. `async` всегда возвращает Promise

Даже без `await` функция `async` всё равно возвращает Promise.

```js
async function getValue() {
  return 42; // на самом деле Promise.resolve(42)
}

// используйте .then() или await для получения значения
getValue().then((value) => console.log(value)); // 42

// или
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## Продвинутое использование (Advanced Usage)

### Обработка тайм-аутов (Timeout Handling)

Реализация тайм-аута с `Promise.race()`:

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Превышено время ожидания')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('Запрос не удался:', error.message);
    throw error;
  }
}

// использование
fetchWithTimeout('/api/data', 3000); // тайм-аут 3 секунды
```

### Механизм повторных попыток (Retry Mechanism)

Автоматическая повторная попытка при ошибке:

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;

      console.log(`Попытка ${i + 1} не удалась, повторная через ${delay}мс...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// использование
fetchWithRetry('/api/data', 3, 2000); // до 3 попыток, интервал 2 сек
```

### Последовательная обработка с сохранением состояния

Иногда требуется последовательное выполнение с сохранением всех промежуточных результатов:

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // решение о следующем шаге на основе предыдущего результата
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## async/await в Event Loop

`async/await` по-прежнему основан на Promise, поэтому подчиняется тем же правилам Event Loop:

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// порядок вывода: 1, 2, 4, 3
```

Объяснение:

1. `console.log('1')` — синхронно
2. Вызывается `test()`, `console.log('2')` — синхронно
3. `await Promise.resolve()` — оставшийся код планируется как микрозадача
4. `console.log('4')` — синхронно
5. Выполняется микрозадача, `console.log('3')`

## Ключевые моменты для собеседования (Interview Key Points)

1. **`async/await` — это синтаксический сахар над Promise**: более чистый синтаксис, та же модель под капотом.
2. **Используйте `try/catch` для обработки ошибок**: предпочтительнее цепочки `.catch()` в стиле async/await.
3. **Параллельность vs последовательность важны**: избегайте бездумного `await` внутри циклов.
4. **`async` всегда возвращает Promise**: даже без явного return Promise.
5. **`await` требует контекст async**: за исключением top-level await в модулях ES2022.
6. **Понимайте поведение Event Loop**: код после `await` выполняется как микрозадача.

## Связанные темы (Related Topics)

- [Promise](/docs/promise) — основа async/await
- [Event Loop](/docs/event-loop) — модель порядка выполнения

## Ссылки (Reference)

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
