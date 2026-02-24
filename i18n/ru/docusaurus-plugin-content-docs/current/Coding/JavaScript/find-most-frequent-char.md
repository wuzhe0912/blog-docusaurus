---
id: find-most-frequent-char-js
title: '[Easy] Поиск самого частого символа'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Описание задачи

> Описание задачи

Реализуйте функцию, которая принимает строку и возвращает символ, встречающийся чаще всего.

### Примеры

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Способы реализации

> Способы реализации

### Метод 1: Подсчёт через объект (базовый)

**Подход**: Пройти по строке, использовать объект для подсчёта каждого символа, затем найти символ с максимальным количеством.

```javascript
function findMostFrequentChar(str) {
  // Initialize object to store characters and counts
  const charCount = {};

  // Initialize variables for tracking max count and character
  let maxCount = 0;
  let maxChar = '';

  // Iterate through the string
  for (let char of str) {
    // If the character is not in the object, set count to 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Increment this character's count
    charCount[char]++;

    // If this character's count is greater than the max count,
    // update the max count and max character
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Return the most frequent character
  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Временная сложность**: O(n), где n - длина строки
**Пространственная сложность**: O(k), где k - количество уникальных символов

### Метод 2: Сначала считаем, потом ищем максимум (два этапа)

**Подход**: Сначала один проход для подсчёта всех символов, затем второй проход для поиска максимума.

```javascript
function findMostFrequentChar(str) {
  // Phase 1: Count occurrences of each character
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Phase 2: Find the character with the most occurrences
  let maxCount = 0;
  let maxChar = '';

  for (let char in charCount) {
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Плюсы**: Более понятная логика, поэтапная обработка
**Минусы**: Требуются два прохода

### Метод 3: Использование Map (ES6)

**Подход**: Использовать Map для хранения соответствия символов и их количества.

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Плюсы**: Использование Map более идиоматично для современного JavaScript
**Минусы**: Для простых случаев обычный объект может быть более интуитивным

### Метод 4: Использование reduce (функциональный стиль)

**Подход**: Использовать `reduce` и `Object.entries` для реализации.

```javascript
function findMostFrequentChar(str) {
  // Count occurrences of each character
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Find the character with the most occurrences
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Плюсы**: Функциональный стиль, компактный код
**Минусы**: Ниже читаемость, немного хуже производительность

### Метод 5: Обработка нескольких символов с одинаковым максимумом

**Подход**: Если несколько символов имеют одинаковую максимальную частоту, вернуть массив или первый встреченный символ.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Count occurrences of each character
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Find all characters with the max count
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Возвращаем первый встреченный (или весь массив)
  return mostFrequentChars[0];
  // Or return all: return mostFrequentChars;
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a' (первый встреченный)
```

## 3. Граничные случаи

> Обработка граничных случаев

### Обработка пустых строк

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // Или throw new Error('String cannot be empty')
  }

  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Обработка чувствительности к регистру

```javascript
function findMostFrequentChar(str, caseSensitive = true) {
  const processedStr = caseSensitive ? str : str.toLowerCase();
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('Hello', false)); // 'l' (без учёта регистра)
console.log(findMostFrequentChar('Hello', true)); // 'l' (с учётом регистра)
```

### Обработка пробелов и специальных символов

```javascript
function findMostFrequentChar(str, ignoreSpaces = false) {
  const processedStr = ignoreSpaces ? str.replace(/\s/g, '') : str;
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('hello world', true)); // 'l' (игнорируя пробелы)
console.log(findMostFrequentChar('hello world', false)); // ' ' (пробел)
```

## 4. Частые вопросы на интервью

> Частые вопросы на интервью

### Вопрос 1: Базовая реализация

Реализуйте функцию, которая находит самый частый символ в строке.

<details>
<summary>Нажмите, чтобы показать ответ</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Ключевые моменты**:

- Используйте объект или Map для подсчёта каждого символа
- Обновляйте максимум во время итерации
- Временная сложность O(n), пространственная сложность O(k)

</details>

### Вопрос 2: Оптимизированная версия

Оптимизируйте функцию выше, чтобы обрабатывать несколько символов с одинаковой максимальной частотой.

<details>
<summary>Нажмите, чтобы показать ответ</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Phase 1: Count occurrences of each character
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Phase 2: Find all characters with the max count
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Return first or all based on requirements
  return mostFrequentChars[0]; // Or return mostFrequentChars
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### Вопрос 3: Использование Map

Реализуйте эту функцию с использованием ES6 Map.

<details>
<summary>Нажмите, чтобы показать ответ</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**:

- **Map**: Лучше подходит для динамических пар ключ-значение; ключом может быть любой тип
- **Object**: Проще и интуитивнее; подходит для строковых ключей

</details>

## 5. Лучшие практики

> Лучшие практики

### Рекомендуемые подходы

```javascript
// 1. Use clear variable names
function findMostFrequentChar(str) {
  const charCount = {}; // Clearly expresses purpose
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Handle edge cases
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Обновляйте максимум в ходе итерации (один проход)
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Подходы, которых стоит избегать

```javascript
// 1. Не используйте два прохода (если это не обязательно)
// ❌ Lower performance
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Second iteration
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. Не забывайте обрабатывать пустые строки
// ❌ May return undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // maxChar is '' for empty string
}

// 3. Не используйте чрезмерно сложные функциональные паттерны (если это не принято в команде)
// ❌ Less readable
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Итоги для интервью

> Итоги для интервью

### Краткая памятка

**Шаги реализации**:

1. Используйте объект или Map для подсчёта каждого символа
2. Обновляйте максимум во время итерации
3. Временная сложность O(n), пространственная сложность O(k)
4. Обрабатывайте граничные случаи (пустая строка, чувствительность к регистру и т.д.)

**Направления оптимизации**:

- Выполнять за один проход (подсчёт и поиск максимума одновременно)
- Использовать Map для более сложных сценариев
- Обрабатывать несколько символов с одинаковой максимальной частотой
- Учитывать регистр, пробелы и другие специальные случаи

### Пример ответа на интервью

**Q: Реализуйте функцию, которая находит самый частый символ в строке.**

> "Я бы использовал объект для подсчёта каждого символа, а максимум обновлял прямо во время прохода по строке. Конкретно: инициализируем пустой объект `charCount` для хранения символов и их количества, а также переменные `maxCount` и `maxChar`. Затем итерируемся по строке - для каждого символа, если его ещё нет в объекте, задаём 0, после чего увеличиваем счётчик. Если счётчик текущего символа больше maxCount, обновляем maxCount и maxChar. В конце возвращаем maxChar. Такой подход имеет временную сложность O(n) и пространственную сложность O(k), где n - длина строки, а k - количество уникальных символов."

## Справка

- [MDN - String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
