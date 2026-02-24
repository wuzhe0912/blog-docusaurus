---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. Что такое IIFE?

IIFE расшифровывается как Immediately Invoked Function Expression (немедленно вызываемое функциональное выражение).
В отличие от обычного объявления функции, оно оборачивает функцию дополнительными `()` и немедленно выполняет:

```js
(() => {
  console.log(1);
})();

# или

(function () {
  console.log(2);
})();
```

Оно также может выполняться повторно через рекурсию до достижения условия остановки, а завершающие `()` могут передавать параметры.

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

Обратите внимание, что IIFE выполняется во время инициализации (или через внутренние самовызовы), но не может быть вызвано повторно напрямую извне.

## 2. Зачем использовать IIFE?

### Область видимости (Scope)

Поскольку переменные, объявленные внутри функции, имеют область видимости этой функции, IIFE может изолировать состояние и избежать загрязнения глобальной области:

```js
// глобальная область
const name = 'Yumi';
const Hello = () => {
  return `Hello ${name}!`;
};

(() => {
  const name = 'Pitt';
  const Hello = () => {
    return `Hello ${name}!`;
  };
  console.log(name); // результат Pitt
  console.log(Hello()); // результат Hello Pitt!
})();

console.log(name); // результат Yumi
console.log(Hello()); // результат Hello Yumi!
```

### Приватные переменные и методы (Private Variables and Methods)

Используя IIFE в сочетании с замыканием (closure), можно создавать приватные переменные и методы.
Это означает, что состояние может сохраняться внутри функции и обновляться при каждом вызове (например, увеличение/уменьшение).

```js
const increment = (() => {
  let result = 0;
  console.log(result);
  const credits = (num) => {
    console.log(`I have ${num} credits.`);
  };
  return () => {
    result += 1;
    credits(result);
  };
})();

increment(); // I have 1 credits.
increment(); // I have 2 credits.
```

Будьте осторожны: поскольку эти переменные сохраняются, чрезмерное использование может потреблять память и снижать производительность.

### Модульный паттерн (Module)

Можно предоставить функциональность в форме объекта как модульный паттерн.
В примере ниже можно увеличивать значение, а также сбрасывать состояние:

```js
const Score = (() => {
  let result = 0;

  return {
    current: () => {
      return result;
    },

    increment: () => {
      result += 1;
    },

    reset: () => {
      result = 0;
    },
  };
})();

Score.increment();
console.log(Score.current()); // результат 1 => 0 + 1 = 1
Score.increment();
console.log(Score.current()); // результат 2 => 1 + 1 = 2
Score.reset();
console.log(Score.current()); // результат 0 => reset = 0
```

Другой стиль:

```js
const Score = (() => {
  let result = 0;
  const current = () => {
    return result;
  };

  const increment = () => {
    result += 1;
  };

  const reset = () => {
    result = 0;
  };

  return {
    current: current,
    increment: increment,
    reset: reset,
  };
})();

Score.increment();
console.log(Score.current());
Score.increment();
console.log(Score.current());
Score.reset();
console.log(Score.current());
```

Ещё одно замечание: поскольку IIFE выполняются немедленно, размещение двух IIFE подряд может нарушить `ASI` (Automatic Semicolon Insertion — автоматическая вставка точки с запятой).
При цепочке IIFE добавляйте точки с запятой явно.
