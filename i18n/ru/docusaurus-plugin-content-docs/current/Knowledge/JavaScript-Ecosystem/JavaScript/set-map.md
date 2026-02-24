---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. Что такое Set и Map?

> Что такое Set и Map?

`Set` и `Map` — две структуры данных, введённые в ES6.
Они лучше решают определённые задачи, чем обычные массивы/объекты.

### Set

**Определение**: `Set` — это коллекция **уникальных значений**, аналогичная множеству в математике.

**Характеристики**:

- Хранимые значения **уникальны**
- Проверка равенства использует семантику `===` для большинства значений
- Сохраняет порядок вставки
- Может хранить значения любого типа (примитивы или объекты)

**Базовое использование**:

```javascript
// создание Set
const set = new Set();

// добавление значений
set.add(1);
set.add(2);
set.add(2); // дубликат игнорируется
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// проверка наличия
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// удаление
set.delete(2);
console.log(set.has(2)); // false

// очистка
set.clear();
console.log(set.size); // 0
```

**Создание Set из массива**:

```javascript
// удаление дубликатов из массива
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// преобразование обратно в массив
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// сокращённая запись
const uniqueArr2 = [...new Set(arr)];
```

### Map

**Определение**: `Map` — это коллекция ключ-значение, аналогичная объектам, но ключи могут быть любого типа.

**Характеристики**:

- Ключи могут быть любого типа (строка, число, объект, функция и т.д.)
- Сохраняет порядок вставки
- Имеет свойство `size`
- Итерация следует порядку вставки

**Базовое использование**:

```javascript
// создание Map
const map = new Map();

// установка пар ключ-значение
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// получение значения
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// проверка наличия ключа
console.log(map.has('name')); // true

// удаление
map.delete('name');

// размер
console.log(map.size); // 3

// очистка
map.clear();
```

**Создание Map из массива**:

```javascript
// из двумерного массива
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// из объекта
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Разница между Set и Array

| Характеристика | Set | Array |
| --- | --- | --- |
| Дубликаты | Не допускаются | Допускаются |
| Доступ по индексу | Не поддерживается | Поддерживается |
| Сложность поиска | O(1) в среднем | O(n) |
| Порядок вставки | Сохраняется | Сохраняется |
| Основные методы | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**Случаи использования**:

```javascript
// ✅ Set для уникальных значений
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Set для быстрой проверки наличия
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('Homepage already visited');
}

// ✅ Array, когда нужны индексы или дубликаты
const scores = [100, 95, 100, 90];
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Разница между Map и Object

| Характеристика | Map | Object |
| --- | --- | --- |
| Тип ключа | Любой тип | String или Symbol |
| Размер | Свойство `size` | Ручной подсчёт |
| Ключи по умолчанию | Нет | Цепочка прототипов существует |
| Порядок итерации | Порядок вставки | Порядок вставки в современном JS |
| Производительность | Лучше при частом добавлении/удалении | Часто хорош для статических/простых структур |
| JSON | Напрямую не сериализуется | Нативная поддержка JSON |

**Случаи использования**:

```javascript
// ✅ Map, когда ключи не строки
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Map для частого добавления/удаления
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Object для статических структур + JSON
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config);
```

## 4. Распространённые вопросы для собеседования (Common Interview Questions)

> Распространённые вопросы для собеседования

### Вопрос 1: удаление дубликатов из массива

Реализуйте функцию для удаления дубликатов.

```javascript
function removeDuplicates(arr) {
  // ваша реализация
}
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Способ 1: Set (рекомендуется)**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**Способ 2: filter + indexOf**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**Способ 3: reduce**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**Производительность**:

- Set: O(n), быстрейший
- filter + indexOf: O(n²), медленнее
- reduce + includes: O(n²), медленнее

</details>

### Вопрос 2: проверка наличия дубликатов в массиве

Реализуйте функцию для проверки наличия дубликатов.

```javascript
function hasDuplicates(arr) {
  // ваша реализация
}
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Способ 1: Set (рекомендуется)**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**Способ 2: Set с ранним выходом**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**Способ 3: indexOf**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**Производительность**:

- Set способ 1: O(n), быстрейший
- Set способ 2: O(n), может остановиться раньше
- indexOf: O(n²), медленнее

</details>

### Вопрос 3: подсчёт вхождений

Реализуйте функцию для подсчёта вхождений каждого элемента.

```javascript
function countOccurrences(arr) {
  // ваша реализация
}
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Способ 1: Map (рекомендуется)**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**Способ 2: reduce + Map**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**Способ 3: обычный объект**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**Почему Map помогает**:

- Ключи могут быть любого типа
- Встроенный `size`
- Стабильная итерация в порядке вставки

</details>

### Вопрос 4: пересечение двух массивов

Реализуйте пересечение массивов.

```javascript
function intersection(arr1, arr2) {
  // ваша реализация
}
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Способ 1: Set**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**Способ 2: filter + Set**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**Способ 3: filter + includes**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**Производительность**:

- Set: O(n + m), быстрее
- filter + includes: O(n × m), медленнее

</details>

### Вопрос 5: разность двух массивов

Реализуйте разность массивов (значения в `arr1`, отсутствующие в `arr2`).

```javascript
function difference(arr1, arr2) {
  // ваша реализация
}
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Способ 1: Set**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**Способ 2: дедупликация + фильтрация**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**Способ 3: includes**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**Производительность**:

- Set: O(n + m), быстрее
- includes: O(n × m), медленнее

</details>

### Вопрос 6: реализация LRU-кеша

Реализуйте LRU-кеш с помощью `Map`.

```javascript
class LRUCache {
  constructor(capacity) {
    // ваша реализация
  }

  get(key) {
    // ваша реализация
  }

  put(key, value) {
    // ваша реализация
  }
}
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

**Реализация:**

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // перемещаем ключ в конец (последний использованный)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // если ключ существует, сначала удаляем
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // если полон, вытесняем самый старый (первый ключ)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // добавляем в конец (самый последний)
    this.cache.set(key, value);
  }
}

// использование
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // вытесняет ключ 2
console.log(cache.get(2)); // -1
console.log(cache.get(3)); // 'three'
```

**Объяснение:**

- Map сохраняет порядок вставки
- первый ключ — самый старый
- `get` обновляет актуальность через delete+set
- `put` вытесняет самый старый при достижении ёмкости

</details>

### Вопрос 7: объект как ключ Map

Объясните вывод:

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>Нажмите, чтобы увидеть ответ</summary>

```javascript
// 'first'
// 'second'
// 2
```

**Объяснение:**

- `obj1` и `obj2` — разные экземпляры объектов
- `Map` сравнивает ключи-объекты по ссылке
- поэтому они рассматриваются как разные ключи

**Сравнение с обычным объектом:**

```javascript
// ключи обычного объекта становятся строками
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second' (перезаписан)
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]']

// Map сохраняет ссылки
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet и WeakMap

> Разница между WeakSet и WeakMap

### WeakSet

**Характеристики**:

- Может хранить только **объекты**
- Использует **слабые ссылки**
- Нет свойства `size`
- Не итерируемый
- Нет метода `clear`

**Случай использования**: маркировка объектов без утечек памяти.

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// если obj1 не имеет других ссылок, он может быть собран сборщиком мусора
```

### WeakMap

**Характеристики**:

- Ключи должны быть **объектами**
- Использует **слабые ссылки** для ключей
- Нет свойства `size`
- Не итерируемый
- Нет метода `clear`

**Случай использования**: приватные метаданные, привязанные к жизненному циклу объекта.

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// если obj1 не имеет других ссылок, запись может быть собрана сборщиком мусора
```

### Слабые vs сильные коллекции (Weak vs Strong Collections)

| Характеристика | Set/Map | WeakSet/WeakMap |
| --- | --- | --- |
| Тип ключа/значения | Любой тип | Только объекты |
| Слабая ссылка | Нет | Да |
| Итерируемый | Да | Нет |
| `size` | Да | Нет |
| `clear` | Да | Нет |
| Автоматическая очистка GC | Нет | Да |

## 6. Лучшие практики (Best Practices)

> Лучшие практики

### Рекомендуется

```javascript
// 1. Используйте Set для уникальности
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. Используйте Set для быстрого поиска
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // доступ разрешён
}

// 3. Используйте Map, когда ключи не строки
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. Используйте Map при частом добавлении/удалении
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. Используйте WeakMap для приватных данных, привязанных к объектам
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### Избегайте

```javascript
// 1. Не используйте Set как полную замену массива
const set = new Set([1, 2, 3]);
// set[0] -> undefined

const arr = [1, 2, 3];
arr[0]; // 1

// 2. Не используйте Map для простых статических структур
const configMap = new Map();
configMap.set('apiUrl', 'https://api.example.com');
configMap.set('timeout', 5000);

const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. Не путайте API Set и Map
const set2 = new Set();
// set2.set('key', 'value'); // TypeError

const map = new Map();
map.set('key', 'value');
```

## 7. Итоги для собеседования (Interview Summary)

> Итоги для собеседования

### Краткая шпаргалка

**Set**:

- Только уникальные значения
- Быстрый поиск O(1)
- Отлично подходит для дедупликации и проверки принадлежности

**Map**:

- Хранилище ключ-значение с ключами любого типа
- Сохраняет порядок вставки
- Отлично подходит для нестроковых ключей и частых обновлений

**WeakSet / WeakMap**:

- Слабые ссылки, дружественные к GC
- Ключи/значения только объекты
- Отлично подходят для метаданных объектов без утечек

### Примеры ответов на собеседовании

**В: Когда использовать Set вместо Array?**

> Используйте Set, когда нужна уникальность или быстрая проверка наличия.
> `Set.has` — O(1) в среднем, тогда как `includes` массива — O(n).
> Типичные примеры — дедупликация и проверка прав доступа.

**В: В чём разница между Map и Object?**

> Ключи Map могут быть любого типа, включая объекты/функции.
> Ключи Object — только строка или Symbol.
> Map имеет `size`, сохраняет порядок вставки и избегает проблем с ключами цепочки прототипов.
> Map лучше, когда ключи динамические или обновления частые.

**В: В чём разница между WeakMap и Map?**

> Ключи WeakMap должны быть объектами и являются слабыми ссылками.
> Если объект-ключ больше нигде не используется, его запись может быть автоматически собрана сборщиком мусора.
> WeakMap не итерируемый и не имеет `size`.
> Он полезен для приватных данных и предотвращения утечек памяти.

## Ссылки (Reference)

- [MDN - Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
