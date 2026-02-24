---
id: object-path-parsing
title: '[Medium] Разбор пути объекта'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Описание задачи

> Описание задачи

Реализуйте функции разбора пути объекта, которые могут получать и устанавливать значения вложенных объектов на основе строки пути.

### Требования

1. **Функция `get`**: Получить значение из объекта по пути

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **Функция `set`**: Установить значение в объект по пути

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Реализация: функция get

> Реализация функции get

### Метод 1: Использование split и reduce

**Подход**: Разбить строку пути в массив, затем с помощью `reduce` получать доступ к объекту уровень за уровнем.

```javascript
function get(obj, path, defaultValue) {
  // Обработка граничных случаев
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Разбиваем строку пути в массив
  const keys = path.split('.');

  // Используем reduce для прохода по уровням
  const result = keys.reduce((current, key) => {
    // Если текущее значение null или undefined, возвращаем undefined
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // Если result равен undefined, возвращаем значение по умолчанию
  return result !== undefined ? result : defaultValue;
}

// Тест
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined (нужно обработать индексы массива)
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### Метод 2: Поддержка индексов массива

**Подход**: Обрабатывать индексы массива в пути, например `'a.b[0].c'`.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Регулярное выражение для сопоставления имён свойств или индексов массива
  // Совпадает с 'a', 'b', '[0]', 'c' и т.д.
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // Обработка индекса массива [0] -> 0
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// Тест
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
};

console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### Метод 3: Полная реализация (обработка граничных случаев)

```javascript
function get(obj, path, defaultValue) {
  // Обработка граничных случаев
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // Разбор пути: поддержка форматов 'a.b.c' и 'a.b[0].c'
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Если текущее значение null или undefined, возвращаем default value
    if (result == null) {
      return defaultValue;
    }

    // Обработка индекса массива
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Тест
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
  y: undefined,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(obj, 'y.z', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj (пустой путь возвращает исходный объект)
```

## 3. Реализация: функция set

> Реализация функции set

### Метод 1: Базовая реализация

**Подход**: Создать вложенную структуру объекта на основе пути, затем установить значение.

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // Разбор пути
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // Создание вложенной структуры
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Обработка индекса массива
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // Если ключ не существует или не является объектом, создаём новый объект
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // Устанавливаем значение для последнего ключа
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // Если current не массив, преобразуем его
      const temp = { ...current };
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Тест
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### Метод 2: Полная реализация (обработка массивов и объектов)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Идём до предпоследнего ключа, создавая вложенную структуру
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Обработка индекса массива
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // Гарантируем, что это массив
      if (!Array.isArray(current)) {
        // Преобразуем объект в массив (с сохранением существующих индексов)
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // Гарантируем наличие индекса
      if (current[index] == null) {
        // Определяем, следующий ключ - массив или объект
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // Обработка объектного ключа
      if (current[key] == null) {
        // Определяем, следующий ключ - массив или объект
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // Если существует, но не объект, преобразуем
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Устанавливаем значение для последнего ключа
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Тест
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }

set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### Метод 3: Упрощённая версия (только объекты, без индексов массива)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Создаём вложенную структуру (кроме последнего ключа)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Устанавливаем значение для последнего ключа
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Тест
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Частые вопросы на интервью

> Частые вопросы на интервью

### Вопрос 1: Базовая функция get

Реализуйте функцию `get`, которая получает значение вложенного объекта по строке пути.

<details>
<summary>Нажмите, чтобы показать ответ</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

// Тест
const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**Ключевые моменты**:

- Обрабатывайте случаи null/undefined
- Используйте split для разбора пути
- Получайте доступ к свойствам объекта уровень за уровнем
- Возвращайте значение по умолчанию, если путь не существует

</details>

### Вопрос 2: Функция get с поддержкой индексов массива

Расширьте функцию `get`, чтобы поддерживать индексы массива вида `'a.b[0].c'`.

<details>
<summary>Нажмите, чтобы показать ответ</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // Используем regex для разбора пути
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // Обработка индекса массива
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Тест
const obj = {
  a: {
    b: [2, 3, { c: 4 }],
  },
};

console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**Ключевые моменты**:

- Используйте regex `/[^.[\]]+|\[(\d+)\]/g` для разбора пути
- Обрабатывайте индексы массива в формате `[0]`
- Преобразуйте строковый индекс в число

</details>

### Вопрос 3: Функция set

Реализуйте функцию `set`, которая устанавливает значение вложенного объекта по строке пути.

<details>
<summary>Нажмите, чтобы показать ответ</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Создаём вложенную структуру (кроме последнего ключа)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Устанавливаем значение для последнего ключа
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Тест
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**Ключевые моменты**:

- Создавайте вложенную структуру объекта по уровням
- Убеждайтесь, что промежуточные объекты пути существуют
- Устанавливайте целевое значение в конце

</details>

### Вопрос 4: Полная реализация get и set

Реализуйте полные функции `get` и `set` с поддержкой индексов массива и обработкой граничных случаев.

<details>
<summary>Нажмите, чтобы показать ответ</summary>

```javascript
// функция get
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') {
    return obj ?? defaultValue;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// функция set
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Создаём вложенную структуру
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      if (!Array.isArray(current)) {
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      if (current[index] == null) {
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      if (current[key] == null) {
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Устанавливаем значение
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Тест
const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1

set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Лучшие практики

> Лучшие практики

### Рекомендуемые подходы

```javascript
// 1. Обрабатывайте граничные случаи
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. Используйте regex для разбора сложных путей
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. Определяйте тип следующего ключа в set
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. Используйте nullish coalescing для значений по умолчанию
return result ?? defaultValue;
```

### Подходы, которых стоит избегать

```javascript
// 1. ❌ Не забывайте обрабатывать null/undefined
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // Может выбросить исключение
}

// 2. ❌ Не изменяйте исходный объект напрямую (если это явно не требуется)
function set(obj, path, value) {
  // Нужно возвращать изменённый объект, а не просто мутировать напрямую
}

// 3. ❌ Не игнорируйте разницу между массивами и объектами
// Нужно определять, является ли следующий ключ индексом массива или ключом объекта
```

## 6. Итоги для интервью

> Итоги для интервью

### Краткая памятка

**Object Path Parsing**:

- **Функция get**: Получение значения по пути, обработка null/undefined, поддержка значений по умолчанию
- **Функция set**: Установка значения по пути, автоматическое создание вложенной структуры
- **Разбор пути**: Использование regex для поддержки форматов `'a.b.c'` и `'a.b[0].c'`
- **Обработка граничных случаев**: Работа с null, undefined, пустыми строками и т.д.

**Шаги реализации**:

1. Разбор пути: `split('.')` или regex
2. Доступ по уровням: циклы или `reduce`
3. Обработка граничных случаев: проверка на null/undefined
4. Поддержка массивов: обработка индексов формата `[0]`

### Пример ответа на интервью

**Q: Реализуйте функцию, которая получает значение объекта по пути.**

> "Я бы реализовал функцию `get`, которая принимает объект, строку пути и значение по умолчанию. Сначала обрабатываем граничные случаи - если объект равен null или путь не строка, возвращаем значение по умолчанию. Затем с помощью `split('.')` разбиваем путь в массив ключей и в цикле получаем доступ к свойствам объекта уровень за уровнем. На каждом шаге проверяем, не является ли текущее значение null или undefined; если да - возвращаем значение по умолчанию. В конце, если итоговое значение равно undefined, возвращаем значение по умолчанию, иначе возвращаем результат. Для поддержки индексов массива используем regex `/[^.[\]]+|\[(\d+)\]/g` и отдельно обрабатываем ключи вида `[0]`."

**Q: Как бы вы реализовали функцию, которая устанавливает значение объекта по пути?**

> "Я бы реализовал функцию `set`, которая принимает объект, строку пути и значение. Сначала разбираем путь в массив ключей, затем итерируемся до предпоследнего ключа, по ходу создавая вложенную структуру объектов. Для каждого промежуточного ключа, если его нет или это не объект, создаём новый объект. Если следующий ключ имеет формат индекса массива, создаём массив вместо объекта. В конце устанавливаем значение по последнему ключу. Так мы гарантируем, что все промежуточные объекты пути существуют, и целевое значение устанавливается корректно."

## Справка

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
