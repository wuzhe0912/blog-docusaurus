---
id: deep-clone
title: '[Medium] Глубокое копирование'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. Что такое Deep Clone?

> Что такое Deep Clone?

**Deep Clone** создаёт новый объект и рекурсивно копирует все свойства исходного объекта, включая все вложенные объекты и массивы. После глубокого копирования новый объект полностью независим от исходного: изменение одного не влияет на другой.

### Shallow Clone vs Deep Clone

**Shallow Clone**: Копирует только первый уровень свойств объекта. Вложенные объекты по-прежнему разделяют ссылки.

```javascript
// Shallow clone example
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ Исходный объект тоже был изменён
```

**Deep Clone**: Рекурсивно копирует все уровни свойств, создавая полностью независимую копию.

```javascript
// Deep clone example
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ Исходный объект не затронут
```

## 2. Способы реализации

> Способы реализации

### Метод 1: Использование JSON.parse и JSON.stringify

**Плюсы**: Простой и быстрый
**Минусы**: Не может обрабатывать функции, undefined, Symbol, Date, RegExp, Map, Set и другие специальные типы

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Test
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**Ограничения**:

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date becomes an empty object
console.log(cloned.func); // undefined ❌ Функция теряется
console.log(cloned.undefined); // undefined ✅ но JSON.stringify удаляет свойство
console.log(cloned.symbol); // undefined ❌ Symbol теряется
console.log(cloned.regex); // {} ❌ RegExp becomes an empty object
```

### Метод 2: Рекурсивная реализация (обработка базовых типов и объектов)

```javascript
function deepClone(obj) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Handle objects
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Test
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ Unaffected
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Метод 3: Полная реализация (обработка Map, Set, Symbol и т.д.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Handle Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  // Handle Symbol properties
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Copy regular properties
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Copy Symbol properties
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// Test
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### Метод 4: Обработка циклических ссылок

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test circular references
const original = {
  name: 'John',
};
original.self = original; // Circular reference

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Циклическая ссылка обработана корректно
console.log(cloned !== original); // true ✅ Это другой объект
```

## 3. Частые вопросы на интервью

> Частые вопросы на интервью

### Вопрос 1: Базовая реализация Deep Clone

Реализуйте функцию `deepClone`, которая умеет глубоко копировать объекты и массивы.

<details>
<summary>Нажмите, чтобы показать ответ</summary>

```javascript
function deepClone(obj) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Handle objects
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Test
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### Вопрос 2: Обработка циклических ссылок

Реализуйте функцию `deepClone`, которая умеет работать с циклическими ссылками.

<details>
<summary>Нажмите, чтобы показать ответ</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Handle null and primitive types
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle circular references
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Handle objects
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test circular references
const original = {
  name: 'John',
};
original.self = original; // Circular reference

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Ключевые моменты**:

- Используйте `WeakMap` для отслеживания уже обработанных объектов
- Проверяйте наличие объекта в map перед созданием новой копии
- Если объект уже есть в map, возвращайте ссылку из map, чтобы избежать бесконечной рекурсии

</details>

### Вопрос 3: Ограничения JSON.parse и JSON.stringify

Объясните ограничения использования `JSON.parse(JSON.stringify())` для глубокого копирования и предложите решения.

<details>
<summary>Нажмите, чтобы показать ответ</summary>

**Ограничения**:

1. **Не умеет обрабатывать функции**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **Не умеет обрабатывать undefined**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (но свойство удаляется) ❌
   ```

3. **Не умеет обрабатывать Symbol**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Свойство Symbol теряется
   ```

4. **Date превращается в строку**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Становится строкой
   ```

5. **RegExp превращается в пустой объект**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Становится пустым объектом
   ```

6. **Не умеет обрабатывать Map, Set**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Становится пустым объектом
   ```

7. **Не умеет обрабатывать циклические ссылки**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Ошибка: Converting circular structure to JSON
   ```

**Решение**: Используйте рекурсивную реализацию со специальной обработкой разных типов.

</details>

## 4. Лучшие практики

> Лучшие практики

### Рекомендуемые подходы

```javascript
// 1. Choose the appropriate method based on requirements
// For basic objects and arrays only, use a simple recursive implementation
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. For complex types, use the complete implementation
function completeDeepClone(obj, map = new WeakMap()) {
  // ... complete implementation
}

// 3. Use WeakMap to handle circular references
// WeakMap doesn't prevent garbage collection, making it suitable for tracking object references
```

### Подходы, которых стоит избегать

```javascript
// 1. Не злоупотребляйте JSON.parse(JSON.stringify())
// ❌ Loses functions, Symbol, Date, and other special types
const cloned = JSON.parse(JSON.stringify(obj));

// 2. Не забывайте обрабатывать циклические ссылки
// ❌ Will cause stack overflow
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // Infinite recursion
  }
  return cloned;
}

// 3. Не забывайте обрабатывать Date, RegExp и другие специальные типы
// ❌ These types require special handling
```

## 5. Итоги для интервью

> Итоги для интервью

### Краткая памятка

**Deep Clone**:

- **Определение**: Рекурсивно копирует объект и все его вложенные свойства, создавая полностью независимую копию
- **Методы**: Рекурсивная реализация, JSON.parse(JSON.stringify()), structuredClone()
- **Ключевые моменты**: Обработка специальных типов, циклических ссылок, Symbol-свойств

**Шаги реализации**:

1. Обработать примитивные типы и null
2. Обработать Date, RegExp и другие специальные объекты
3. Обработать массивы и объекты
4. Обработать циклические ссылки (с помощью WeakMap)
5. Обработать Symbol-свойства

### Пример ответа на интервью

**Q: Пожалуйста, реализуйте функцию Deep Clone.**

> "Глубокое копирование создаёт полностью независимый новый объект, рекурсивно копируя все вложенные свойства. В моей реализации сначала обрабатываются примитивные типы и null, затем добавляется специальная обработка для Date, RegExp, массивов и объектов. Для циклических ссылок я использую WeakMap, чтобы отслеживать уже обработанные объекты. Для Symbol-свойств применяю Object.getOwnPropertySymbols, чтобы получить и скопировать их. Это гарантирует, что глубокая копия полностью независима от исходного объекта: изменение одного не повлияет на другой."

**Q: Какие ограничения есть у JSON.parse(JSON.stringify())?**

> "Основные ограничения такие: 1) не поддерживаются функции - они удаляются; 2) не поддерживаются undefined и Symbol - эти свойства игнорируются; 3) объекты Date превращаются в строки; 4) RegExp превращается в пустой объект; 5) не поддерживаются Map, Set и другие специальные структуры данных; 6) не поддерживаются циклические ссылки - выбрасывается ошибка. Для таких случаев лучше использовать рекурсивную реализацию."

## Справка

- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
