---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## ¿Qué es un Promise?

Promise es una nueva característica de ES6, utilizada principalmente para resolver el problema del callback hell y hacer el código más fácil de leer. Un Promise representa la finalización o el fallo eventual de una operación asíncrona, junto con su valor resultante.

Un Promise tiene tres estados:

- **pending** (pendiente): Estado inicial
- **fulfilled** (cumplido): Operación completada exitosamente
- **rejected** (rechazado): Operación fallida

## Uso básico

### Crear un Promise

```js
const myPromise = new Promise((resolve, reject) => {
  // Operación asíncrona
  const success = true;

  if (success) {
    resolve('¡Éxito!'); // Cambiar el estado del Promise a fulfilled
  } else {
    reject('¡Fallo!'); // Cambiar el estado del Promise a rejected
  }
});

myPromise
  .then((result) => {
    console.log(result); // '¡Éxito!'
  })
  .catch((error) => {
    console.log(error); // '¡Fallo!'
  });
```

### Aplicación práctica: Manejar solicitudes API

```js
// Crear una función común para manejar solicitudes API
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // Verificar si la response está en el rango 200 ~ 299
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Convertir la response a JSON y devolver
    })
    .catch((error) => {
      // Verificar si hay problemas de red o si la solicitud fue rechazada
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // Lanzar el error
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

## Métodos de Promise

### .then() / .catch() / .finally()

```js
promise
  .then((result) => {
    // Manejar el caso de éxito
    return result;
  })
  .catch((error) => {
    // Manejar errores
    console.error(error);
  })
  .finally(() => {
    // Se ejecuta siempre, sin importar éxito o fallo
    console.log('Promise completado');
  });
```

### Promise.all()

Se cumple solo cuando todos los Promise se completan. Falla si cualquiera falla.

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

**Cuándo usar**: Cuando es necesario esperar a que múltiples solicitudes API se completen antes de continuar la ejecución.

### Promise.race()

Devuelve el resultado del primer Promise completado (ya sea éxito o fallo).

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('Número 1'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Número 2'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // 'Número 2' (porque se completó más rápido)
});
```

**Cuándo usar**: Establecer timeout para solicitudes, obtener solo la respuesta más rápida.

### Promise.allSettled()

Espera a que todos los Promise se completen (éxito o fallo) y devuelve todos los resultados.

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

**Cuándo usar**: Cuando se necesita conocer los resultados de todos los Promise, incluso si algunos fallan.

### Promise.any()

Devuelve el primer Promise exitoso. Solo falla si todos fallan.

```js
const promise1 = Promise.reject('Error 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Éxito'), 100)
);
const promise3 = Promise.reject('Error 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // 'Éxito'
});
```

**Cuándo usar**: Múltiples recursos de respaldo, con que uno tenga éxito es suficiente.

## Preguntas de entrevista

### Pregunta 1: Encadenamiento de Promise y manejo de errores

Determine la salida del siguiente código:

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

#### Análisis

Analicemos el proceso de ejecución paso a paso:

```js
Promise.resolve(1) // Valor de retorno: 1
  .then((x) => x + 1) // x = 1, retorna 2
  .then(() => {
    throw new Error('My Error'); // Lanza error, va al catch
  })
  .catch((e) => 1) // Captura error, retorna 1 (Importante: aquí se retorna un valor normal)
  .then((x) => x + 1) // x = 1, retorna 2
  .then((x) => console.log(x)) // Muestra 2
  .catch((e) => console.log('This will not run')); // No se ejecuta
```

**Respuesta: 2**

#### Conceptos clave

1. **catch captura el error y devuelve un valor normal**: Cuando `catch()` devuelve un valor normal, la cadena de Promise continúa ejecutando los `.then()` siguientes
2. **then después de catch continúa ejecutándose**: Porque el error ya fue manejado, la cadena de Promise vuelve al estado normal
3. **El último catch no se ejecuta**: Porque no se lanzó ningún error nuevo

Si se quiere que el error continúe propagándose, se debe relanzar en el `catch`:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('Error capturado');
    throw e; // Relanzar el error
  })
  .then((x) => x + 1) // No se ejecuta
  .then((x) => console.log(x)) // No se ejecuta
  .catch((e) => console.log('This will run')); // Se ejecuta
```

### Pregunta 2: Event Loop y orden de ejecución

> Esta pregunta incluye conceptos del Event Loop

Determine la salida del siguiente código:

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

#### Entender el orden de ejecución

Primero veamos `d()`:

```js
function d() {
  setTimeout(c, 100); // 4. Macro task, retraso 100ms, se ejecuta al final
  const temp = Promise.resolve().then(a); // 2. Micro task, se ejecuta después del código síncrono
  console.log('Warrior'); // 1. Ejecución síncrona, salida inmediata
  setTimeout(b, 0); // 3. Macro task, retraso 0ms, pero sigue siendo macro task
}
```

Análisis del orden de ejecución:

1. **Código síncrono**: `console.log('Warrior')` → Muestra `Warrior`
2. **Micro task**: `Promise.resolve().then(a)` → Ejecuta `a()`, muestra `Warlock`
3. **Macro task**:
   - `setTimeout(b, 0)` se ejecuta primero (retraso 0ms)
   - Ejecuta `b()`, muestra `Druid`
   - `Promise.resolve().then(...)` dentro de `b()` es un micro task, se ejecuta inmediatamente, muestra `Rogue`
4. **Macro task**: `setTimeout(c, 100)` se ejecuta al final (retraso 100ms), muestra `Mage`

#### Respuesta

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### Conceptos clave

- **Código síncrono** > **Micro task (Promise)** > **Macro task (setTimeout)**
- `.then()` de Promise pertenece a micro task, se ejecuta después de que el macro task actual termine y antes de que comience el siguiente macro task
- `setTimeout` incluso con retraso de 0 sigue siendo macro task, se ejecuta después de todos los micro tasks

### Pregunta 3: Sincronía y asincronía en el constructor de Promise

Determine la salida del siguiente código:

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

// output ?
```

#### Atención al bloque Promise

La clave de esta pregunta: **El código dentro del constructor de Promise se ejecuta sincrónicamente**, solo `.then()` y `.catch()` son asíncronos.

Análisis del orden de ejecución:

```js
console.log(1); // 1. Síncrono, muestra 1
setTimeout(() => console.log(2), 1000); // 5. Macro task, retraso 1000ms
setTimeout(() => console.log(3), 0); // 4. Macro task, retraso 0ms

new Promise((resolve, reject) => {
  console.log(4); // 2. ¡Síncrono! Dentro del constructor de Promise es síncrono, muestra 4
  resolve(5);
}).then((foo) => {
  console.log(6); // 3. Micro task, muestra 6
});

console.log(7); // 3. Síncrono, muestra 7
```

Flujo de ejecución:

1. **Ejecución síncrona**: 1 → 4 → 7
2. **Micro task**: 6
3. **Macro task** (por tiempo de retraso): 3 → 2

#### Respuesta

```
1
4
7
6
3
2
```

#### Conceptos clave

1. **El código dentro del constructor de Promise se ejecuta sincrónicamente**: `console.log(4)` no es asíncrono
2. **Solo `.then()` y `.catch()` son asíncronos**: Pertenecen a micro tasks
3. **Orden de ejecución**: Código síncrono → micro task → macro task

## Trampas comunes

### 1. Olvidar return

Olvidar `return` en una cadena de Promise hace que el siguiente `.then()` reciba `undefined`:

```js
// ❌ Incorrecto
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // Olvidó return
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ Correcto
fetchUser()
  .then((user) => {
    return fetchPosts(user.id); // Recordar return
  })
  .then((posts) => {
    console.log(posts); // Datos correctos
  });
```

### 2. Olvidar catch para errores

Errores de Promise no capturados causan UnhandledPromiseRejection:

```js
// ❌ Puede causar errores no capturados
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ Agregar catch
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Ocurrió un error:', error);
  });
```

### 3. Abuso del constructor de Promise

No es necesario envolver en Promise funciones que ya devuelven un Promise:

```js
// ❌ Envoltorio innecesario
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ Devolver directamente
function fetchData() {
  return fetch(url);
}
```

### 4. Encadenar múltiples catch

Cada `catch()` solo captura errores anteriores a él:

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('Capturado:', e.message); // Capturado: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('Capturado:', e.message); // Capturado: Error 2
  });
```

## Temas relacionados

- [async/await](/docs/async-await) - Azúcar sintáctico más elegante para Promise
- [Event Loop](/docs/event-loop) - Comprensión profunda del mecanismo asíncrono de JavaScript

## Reference

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
