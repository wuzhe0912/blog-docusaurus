---
id: IIFE
title: '[Hard] 📄 IIFE'
slug: /IIFE
tags: [JavaScript, Quiz, Hard]
---

## 1. What's the IIFE ?

IIFE, también conocida como expresión de función ejecutada inmediatamente, tiene una sintaxis diferente a las funciones normales. Necesita envolverse con una capa adicional de `()` y posee la característica de ejecutarse inmediatamente:

```js
(() => {
  console.log(1);
})();

# or

(function () {
  console.log(2);
})();
```

Además, también se puede ejecutar repetidamente mediante recursion (recursión) hasta que se cumpla una condición de interrupción. Los `()` finales permiten pasar parámetros.

```js
(function myIIFE() {
  num += 1;
  console.log(num);
  return num < 5 ? myIIFE(num) : console.log('finished!!');
})((num = 0));
```

Hay que tener en cuenta que un IIFE solo puede ejecutarse en la inicialización o llamarse recursivamente desde su interior; no puede ser invocado nuevamente desde el exterior.

## 2. Why use IIFE ?

### scope

Basándose en la característica de que las variables se destruyen dentro de una function, se puede usar IIFE para lograr un efecto de aislamiento y evitar contaminar las variables globales. Véase el siguiente ejemplo:

```js
// global
const name = 'Yumi';
const Hello = () => {
  return `Hello ${name}!`;
};

(() => {
  const name = 'Pitt';
  const Hello = () => {
    return `Hello ${name}!`;
  };
  console.log(name); // result Pitt
  console.log(Hello()); // result Hello Pitt!
})();

console.log(name); // result Yumi
console.log(Hello()); // result Hello Yumi!
```

### private variable and methods

Usando IIFE junto con closure se pueden crear Private variable and methods, lo que significa que se pueden guardar variables dentro de una function. Cada vez que se llama a esa function, se puede ajustar el valor basándose en el resultado anterior, por ejemplo, incrementando o decrementando.

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

Hay que tener en cuenta que, dado que las variables no se destruyen, si se abusa de esto, se ocupará memoria y se afectará el rendimiento.

### module

También se puede ejecutar en forma de objeto. En el siguiente ejemplo se puede ver que, además de incrementar variables, también es posible realizar una inicialización:

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
console.log(Score.current()); // result 1 => 0 + 1 = 1
Score.increment();
console.log(Score.current()); // result 2 => 1 + 1 = 2
Score.reset();
console.log(Score.current()); // result 0 => reset = 0
```

Otra forma de escribirlo:

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

Por último, hay que prestar especial atención a que, debido a la característica de ejecución inmediata de IIFE, si hay dos funciones inmediatas consecutivas, la regla de `ASI (Automatic Semicolon Insertion)` puede no funcionar correctamente. Por lo tanto, cuando hay dos IIFE consecutivos, es necesario agregar el punto y coma manualmente.
