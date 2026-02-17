---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 Se recomienda leer primero [Promise](/docs/promise) para entender los conceptos básicos

## ¿Qué es async/await?

`async/await` es un azúcar sintáctico introducido en ES2017 (ES8), construido sobre Promise, que hace que el código asíncrono parezca código síncrono, facilitando su lectura y mantenimiento.

**Conceptos clave**:

- Las funciones `async` siempre devuelven un Promise
- `await` solo puede usarse dentro de funciones `async`
- `await` pausa la ejecución de la función y espera a que el Promise se complete

## Sintaxis básica

### Función async

La palabra clave `async` hace que la función devuelva automáticamente un Promise:

```js
// Escritura tradicional con Promise
function fetchData() {
  return Promise.resolve('datos');
}

// Escritura con async (equivalente)
async function fetchData() {
  return 'datos'; // Se envuelve automáticamente en Promise.resolve('datos')
}

// La forma de llamada es la misma
fetchData().then((data) => console.log(data)); // 'datos'
```

### Palabra clave await

`await` espera a que un Promise se complete y devuelve el resultado:

```js
async function getData() {
  const result = await Promise.resolve('completado');
  console.log(result); // 'completado'
}
```

## Comparación Promise vs async/await

### Ejemplo 1: Solicitud API simple

**Escritura con Promise**:

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

**Escritura con async/await**:

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

### Ejemplo 2: Encadenar múltiples operaciones asíncronas

**Escritura con Promise**:

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

**Escritura con async/await**:

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

## Manejo de errores

### try/catch vs .catch()

**async/await con try/catch**:

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Solicitud fallida:', error);
    // Aquí se pueden manejar diferentes tipos de errores
    if (error.name === 'NetworkError') {
      // Manejar error de red
    }
    throw error; // Relanzar o devolver valor por defecto
  }
}
```

**Uso mixto (no recomendado pero funcional)**:

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('Solicitud fallida:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### try/catch multinivel

Para errores en diferentes etapas, se pueden usar múltiples bloques try/catch:

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    return []; // Devolver array vacío como valor por defecto
  }
}
```

## Ejemplos de aplicación práctica

### Ejemplo: Proceso de calificación de exámenes

> Flujo: Calificar examen → Verificar recompensa → Otorgar recompensa → Expulsión o castigo

```js
// Calificar examen
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
        reject('Ha alcanzado el umbral de expulsión');
      }
    }, 2000);
  });
}

// Verificar recompensa
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} obtiene entradas de cine`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} obtiene un reconocimiento`);
      } else {
        reject('No hay premio para usted');
      }
    }, 2000);
  });
}
```

**Escritura con Promise**:

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**Reescritura con async/await**:

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

### Ejemplo: Ejecución concurrente de múltiples solicitudes

Cuando no hay dependencias entre múltiples solicitudes, deben ejecutarse concurrentemente:

**❌ Incorrecto: Ejecución secuencial (más lento)**:

```js
async function fetchAllData() {
  const users = await fetchUsers(); // Esperar 1 segundo
  const posts = await fetchPosts(); // Esperar otro 1 segundo
  const comments = await fetchComments(); // Esperar otro 1 segundo
  // Total 3 segundos
  return { users, posts, comments };
}
```

**✅ Correcto: Ejecución concurrente (más rápido)**:

```js
async function fetchAllData() {
  // Iniciar tres solicitudes simultáneamente
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // Solo necesita 1 segundo (el tiempo de la solicitud más lenta)
  return { users, posts, comments };
}
```

**Usar Promise.allSettled() para manejar fallos parciales**:

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

## Trampas comunes

### 1. Usar await en bucles (ejecución secuencial)

**❌ Incorrecto: Esperar en cada iteración, ineficiente**:

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // Ejecución secuencial, ¡muy lento!
    results.push(user);
  }
  return results;
}
// Si hay 10 usuarios y cada solicitud toma 1 segundo, tarda 10 segundos en total
```

**✅ Correcto: Ejecución concurrente con Promise.all()**:

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// 10 usuarios con solicitudes concurrentes, solo 1 segundo
```

**Solución intermedia: Limitar la concurrencia**:

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
// Procesar 3 a la vez, evitando enviar demasiadas solicitudes simultáneas
```

### 2. Olvidar usar await

Olvidar `await` devuelve un Promise en lugar del valor real:

```js
// ❌ Incorrecto
async function getUser() {
  const user = fetchUser(1); // Olvidó await, user es un Promise
  console.log(user.name); // undefined (Promise no tiene propiedad name)
}

// ✅ Correcto
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // Nombre correcto
}
```

### 3. Usar await sin async

`await` solo puede usarse dentro de funciones `async`:

```js
// ❌ Incorrecto: Error de sintaxis
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ Correcto
async function getData() {
  const data = await fetchData();
  return data;
}
```

**await de nivel superior (Top-level await)**:

En ES2022 y entornos de módulos, se puede usar await en el nivel superior del módulo:

```js
// ES2022 module
const data = await fetchData(); // Se puede usar en el nivel superior del módulo
console.log(data);
```

### 4. Omisión del manejo de errores

Sin try/catch los errores no serán capturados:

```js
// ❌ Puede causar errores no capturados
async function fetchData() {
  const response = await fetch('/api/data'); // Si falla, lanzará un error
  return response.json();
}

// ✅ Agregar manejo de errores
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Error:', error);
    return null; // O devolver valor por defecto
  }
}
```

### 5. Las funciones async siempre devuelven Promise

Incluso sin usar `await`, las funciones `async` devuelven un Promise:

```js
async function getValue() {
  return 42; // En realidad devuelve Promise.resolve(42)
}

// Debe usar .then() o await para obtener el valor
getValue().then((value) => console.log(value)); // 42

// O
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## Aplicaciones avanzadas

### Manejo de timeout

Implementación de mecanismo de timeout usando Promise.race():

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Tiempo de solicitud agotado')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('Solicitud fallida:', error.message);
    throw error;
  }
}

// Uso
fetchWithTimeout('/api/data', 3000); // Timeout de 3 segundos
```

### Mecanismo de reintento

Implementación de reintento automático en caso de fallo:

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // Último intento fallido, lanzar error

      console.log(`Intento ${i + 1} fallido, reintentando en ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Uso
fetchWithRetry('/api/data', 3, 2000); // Máximo 3 reintentos, intervalo de 2 segundos
```

### Procesamiento secuencial manteniendo el estado

A veces se necesita ejecutar secuencialmente pero conservar todos los resultados:

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // Se puede decidir el siguiente paso basándose en el resultado anterior
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## async/await en el Event Loop

async/await sigue siendo esencialmente Promise, por lo que sigue las mismas reglas del Event Loop:

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// Orden de salida: 1, 2, 4, 3
```

Análisis:

1. `console.log('1')` - Ejecución síncrona
2. Se llama a `test()`, `console.log('2')` - Ejecución síncrona
3. `await Promise.resolve()` - El código posterior se coloca en la cola de micro tasks
4. `console.log('4')` - Ejecución síncrona
5. Se ejecuta el micro task, `console.log('3')`

## Puntos clave para entrevistas

1. **async/await es azúcar sintáctico de Promise**: Más legible pero esencialmente igual
2. **El manejo de errores usa try/catch**: No `.catch()`
3. **Atención a concurrente vs secuencial**: No usar await indiscriminadamente en bucles
4. **Las funciones async siempre devuelven Promise**: Incluso sin return Promise explícito
5. **await solo puede usarse dentro de funciones async**: Excepto top-level await (ES2022)
6. **Entender el Event Loop**: El código después de await es un micro task

## Temas relacionados

- [Promise](/docs/promise) - Base de async/await
- [Event Loop](/docs/event-loop) - Entender el orden de ejecución

## Reference

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
