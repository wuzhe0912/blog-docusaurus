---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> ¿Qué es una Closure?

Para entender los closures, primero hay que comprender el ámbito de las variables en JavaScript y cómo las funciones acceden a variables externas.

### Variable Scope (Ámbito de variables)

En JavaScript, el ámbito de las variables se divide en dos tipos: global scope y function scope.

```js
// global scope
let a = 1;

function parentFunction() {
  // function scope
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // print 1 2 3, can access global scope & function scope
  }

  childFunction();
}

parentFunction();
console.log(a); // print 1, can access global scope
console.log(b, c); // Se produce un error, no se puede acceder a las variables dentro del function scope
```

### Closure example

La condición para activar un Closure es que una función hija se defina dentro de una función padre y se devuelva mediante return, logrando preservar las variables de entorno de la función hija (es decir, evitando el `Garbage Collection`).

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`Conteo actual: ${count}`);
  };
}

const counter = parentFunction();

counter(); // print Conteo actual: 1
counter(); // print Conteo actual: 2
// La variable count no se recolecta, porque childFunction aún existe y cada llamada actualiza el valor de count
```

Sin embargo, hay que tener en cuenta que los closures mantienen las variables en memoria, por lo que si hay demasiadas variables, el uso de memoria puede ser excesivo (no se debe abusar de los closures), afectando así el rendimiento.

## 2. Create a function that meets the following conditions

> Cree una función que cumpla las siguientes condiciones (utilizando el concepto de closure)

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

Se separan en dos funciones para su procesamiento

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// use closure save variable

function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Second Solution : single function

Por supuesto, la primera solución tiene una alta probabilidad de ser rechazada, por lo que es necesario intentar combinarlas en una sola función.

```js
function plus(value, subValue) {
  // Se determina según la cantidad de parámetros pasados cada vez
  if (arguments.length > 1) {
    return value + subValue;
  } else {
    return function (item) {
      return value + item;
    };
  }
}

console.log(plus(2, 5));
console.log(plus(2)(5));
```

## 3. Please take advantage of the closure feature to increase the number

> Utilice la característica de closure para incrementar un número

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

Aquí no se usa Arrow Function, sino la forma de function normal.

```js
function plus() {
  let cash = 0;
  let counter = {
    add() {
      cash += 1;
      console.log(cash);
    },
  };
  return counter;
}

var obj = plus();
obj.add();
obj.add();
```

### Second Solution : return object

En la solución anterior, también se puede incluir el object directamente dentro del return

```js
function plus() {
  let cash = 0;
  return {
    add: function () {
      cash += 1;
      console.log(cash);
    },
  };
}

var obj = plus();
obj.add();
obj.add();
```

## 4. What will be printed in this nested function call?

> ¿Qué imprimirá esta llamada a funciones anidadas?

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

a(b(c));
```

### Análisis

**Resultado de ejecución**:

```
hello
TypeError: aa is not a function
```

### Flujo de ejecución detallado

```js
// Ejecutar a(b(c))
// JavaScript ejecuta las funciones de adentro hacia afuera

// Paso 1: Ejecutar la función más interna b(c)
b(c)
  ↓
// La función c se pasa como parámetro a b
// Dentro de b se ejecuta bb(), es decir c()
c() // Imprime 'hello'
  ↓
// La función b no tiene sentencia return
// Por lo tanto devuelve undefined
return undefined

// Paso 2: Ejecutar a(undefined)
a(undefined)
  ↓
// undefined se pasa como parámetro a a
// Dentro de a se intenta ejecutar aa()
// Es decir undefined()
undefined() // ❌ Error: TypeError: aa is not a function
```

### ¿Por qué sucede esto?

#### 1. Orden de ejecución de funciones (de adentro hacia afuera)

```js
// Ejemplo
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. Primero se ejecuta multiply(2, 3) → 6
           └────── 3. Luego se ejecuta add(6)

// Mismo concepto
a(b(c))
  ↑ ↑
  | └─ 1. Primero se ejecuta b(c)
  └─── 2. Luego se ejecuta a(resultado de b(c))
```

#### 2. Las funciones sin return devuelven undefined

```js
function b(bb) {
  bb(); // Se ejecutó, pero no hay return
} // Implícitamente return undefined

// Equivalente a
function b(bb) {
  bb();
  return undefined; // JavaScript lo añade automáticamente
}
```

#### 3. Intentar llamar algo que no es una función produce un error

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// Otros casos que producen error
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### ¿Cómo corregirlo?

#### Método 1: Hacer que la función b devuelva una función

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
  return function () {
    console.log('b executed');
  };
}

function c() {
  console.log('hello');
}

a(b(c));
// Salida:
// hello
// b executed
```

#### Método 2: Pasar la función directamente, sin ejecutarla primero

```js
function a(aa) {
  aa();
}

function b(bb) {
  return function () {
    bb();
  };
}

function c() {
  console.log('hello');
}

a(b(c)); // Solo imprime 'hello'

// O escribirlo así
a(() => b(c)); // Imprime 'hello'
```

#### Método 3: Cambiar la lógica de ejecución

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

// Ejecutar por separado
b(c); // Imprime 'hello'
a(() => console.log('a executed')); // Imprime 'a executed'
```

### Preguntas relacionadas

#### Pregunta 1: ¿Qué pasa si se cambia a esto?

```js
function a(aa) {
  return aa();
}

function b(bb) {
  return bb();
}

function c() {
  console.log('hello');
  return 'world';
}

console.log(a(b(c)));
```

<details>
<summary>Haz clic para ver la respuesta</summary>

```
hello
TypeError: aa is not a function
```

**Análisis**:

1. `b(c)` → Ejecuta `c()`, imprime `'hello'`, devuelve `'world'`
2. `a('world')` → Ejecuta `'world'()`... ¡un momento, esto también da error!

**Respuesta correcta**:

```
hello
TypeError: aa is not a function
```

Porque `b(c)` devuelve `'world'` (un string), `a('world')` intenta ejecutar `'world'()`, un string no es una función, por lo que se produce un error.

</details>

#### Pregunta 2: ¿Qué pasa si todos tienen return?

```js
function a(aa) {
  return aa;
}

function b(bb) {
  return bb;
}

function c() {
  return 'hello';
}

const result = a(b(c));
console.log(result);
console.log(result());
```

<details>
<summary>Haz clic para ver la respuesta</summary>

```
[Function: c]
hello
```

**Análisis**:

1. `b(c)` → Devuelve la función `c` misma (sin ejecutarla)
2. `a(c)` → Devuelve la función `c` misma
3. `result` es la función `c`
4. `result()` → Ejecuta `c()`, devuelve `'hello'`

</details>

### Puntos clave para recordar

```javascript
// Prioridad de llamadas a funciones
a(b(c))
  ↓
// 1. Primero ejecutar la más interna
b(c) // Si b no tiene return, es undefined
  ↓
// 2. Luego ejecutar la externa
a(undefined) // Intentar ejecutar undefined() produce un error

// Soluciones
// ✅ 1. Asegurar que las funciones intermedias devuelvan una función
// ✅ 2. O usar arrow functions para envolver
a(() => b(c))
```

## Reference

- [Closures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [Day6 [JavaScript Fundamentos] Mecanismo de recolección de basura](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - Gestión de memoria en JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [MDN - Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Functions)
- [MDN - TypeError](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
