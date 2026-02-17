---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Descripcion general

En JavaScript hay tres palabras clave para declarar variables: `var`, `let` y `const`. Aunque todas se usan para declarar variables, difieren en alcance, inicializacion, redeclaracion, reasignacion y momento de acceso.

## Principales diferencias

| Comportamiento       | `var`                         | `let`               | `const`             |
| -------------------- | ----------------------------- | ------------------- | ------------------- |
| Alcance              | Funcion o global              | Bloque              | Bloque              |
| Inicializacion       | Opcional                      | Opcional            | Obligatoria         |
| Redeclaracion        | Permitida                     | No permitida        | No permitida        |
| Reasignacion         | Permitida                     | Permitida           | No permitida        |
| Acceso antes de declarar | Devuelve undefined        | Lanza ReferenceError | Lanza ReferenceError |

## Explicacion detallada

### Alcance

El alcance de `var` es de funcion o global, mientras que `let` y `const` tienen alcance de bloque (incluyendo funciones, bloques if-else o bucles for).

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var in block';
  let letInBlock = 'let in block';
  const constInBlock = 'const in block';
}

console.log(varInBlock); // 'var in block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### Inicializacion

`var` y `let` pueden declararse sin inicializacion, mientras que `const` debe inicializarse en el momento de la declaracion.

```javascript
var varVariable;  // Valido
let letVariable;  // Valido
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### Redeclaracion

Dentro del mismo alcance, `var` permite la redeclaracion de la misma variable, mientras que `let` y `const` no lo permiten.

```javascript
var x = 1;
var x = 2; // Valido, x ahora es 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Reasignacion

Las variables declaradas con `var` y `let` pueden ser reasignadas, pero las declaradas con `const` no.

```javascript
var x = 1;
x = 2; // Valido

let y = 1;
y = 2; // Valido

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Nota: Aunque una variable declarada con `const` no puede ser reasignada, si es un objeto o un array, su contenido aun puede ser modificado.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // Valido
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // Valido
console.log(arr); // [1, 2, 3, 4]
```

### Acceso antes de la declaracion (Temporal Dead Zone)

Las variables declaradas con `var` son elevadas y automaticamente inicializadas como `undefined`. Las variables declaradas con `let` y `const` tambien son elevadas, pero no son inicializadas, por lo que acceder a ellas antes de la declaracion lanza un `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Preguntas de entrevista

### Pregunta: La trampa clasica de setTimeout + var

Determine el resultado de salida del siguiente codigo:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Respuesta incorrecta (malentendido comun)

Muchas personas creen que la salida es: `1 2 3 4 5`

#### Salida real

```
6
6
6
6
6
```

#### ¿Por que?

Este problema involucra tres conceptos fundamentales:

**1. El alcance de funcion de var**

```javascript
// var no crea un alcance de bloque dentro del bucle
for (var i = 1; i <= 5; i++) {
  // i esta en el alcance externo, todas las iteraciones comparten el mismo i
}
console.log(i); // 6 (valor de i despues de terminar el bucle)

// En el caso de var
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // bucle terminado
}
```

**2. La ejecucion asincrona de setTimeout**

```javascript
// setTimeout es asincrono, se ejecuta despues de que el codigo sincrono actual termine
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Este codigo se coloca en la cola de tareas del Event Loop
    console.log(i);
  }, 0);
}
// El bucle se ejecuta primero (i se convierte en 6), luego los callbacks de setTimeout comienzan a ejecutarse
```

**3. Referencia del Closure**

```javascript
// Todas las funciones callback de setTimeout referencian el mismo i
// Cuando los callbacks se ejecutan, i ya es 6
```

#### Soluciones

**Solucion 1: Usar let (recomendado) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// Salida: 1 2 3 4 5

// En el caso de let
{
  let i = 1; // i de la primera iteracion
}
{
  let i = 2; // i de la segunda iteracion
}
{
  let i = 3; // i de la tercera iteracion
}
```

**Principio**: `let` crea un nuevo alcance de bloque en cada iteracion, y cada callback de `setTimeout` captura el valor de `i` de la iteracion actual.

```javascript
// Equivalente a
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ... y asi sucesivamente
```

**Solucion 2: Usar IIFE (Expresion de Funcion Inmediatamente Invocada)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// Salida: 1 2 3 4 5
```

**Principio**: IIFE crea un nuevo alcance de funcion, y en cada iteracion se pasa el valor actual de `i` como parametro `j`, formando un Closure.

**Solucion 3: Usar el tercer parametro de setTimeout**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // El tercer parametro se pasa a la funcion callback
}
// Salida: 1 2 3 4 5
```

**Principio**: El tercer parametro y los siguientes de `setTimeout` se pasan como argumentos a la funcion callback.

**Solucion 4: Usar bind**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// Salida: 1 2 3 4 5
```

**Principio**: `bind` crea una nueva funcion y vincula el valor actual de `i` como parametro.

#### Comparacion de soluciones

| Solucion          | Ventajas                      | Desventajas       | Recomendacion          |
| ----------------- | ----------------------------- | ------------------ | ---------------------- |
| `let`             | Conciso, moderno, facil de entender | ES6+          | 5/5 Muy recomendado    |
| IIFE              | Buena compatibilidad          | Sintaxis compleja  | 3/5 Considerable       |
| Parametro setTimeout | Simple y directo           | Poco conocido      | 4/5 Recomendado        |
| `bind`            | Estilo funcional              | Legibilidad algo menor | 3/5 Considerable   |

#### Preguntas adicionales

**Q1: ¿Que pasa si cambiamos a esto?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Respuesta**: Se imprime `6` una vez por segundo, un total de 5 veces (respectivamente a los 1, 2, 3, 4 y 5 segundos).

**Q2: ¿Como imprimir 1, 2, 3, 4, 5 secuencialmente cada segundo?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// Despues de 1 segundo: 1
// Despues de 2 segundos: 2
// Despues de 3 segundos: 3
// Despues de 4 segundos: 4
// Despues de 5 segundos: 5
```

#### Puntos clave en entrevistas

Esta pregunta evalua:

1. **Alcance de var**: Alcance de funcion vs alcance de bloque
2. **Event Loop**: Ejecucion sincrona vs asincrona
3. **Closure**: Como las funciones capturan variables externas
4. **Soluciones**: Multiples enfoques con sus ventajas y desventajas

Al responder se recomienda:

- Primero dar la respuesta correcta (6 6 6 6 6)
- Explicar la razon (alcance de var + setTimeout asincrono)
- Proporcionar soluciones (preferir let y explicar otras opciones)
- Demostrar comprension de los mecanismos internos de JavaScript

## Mejores practicas

1. Priorizar `const`: Para variables que no necesitan reasignacion, `const` mejora la legibilidad y mantenibilidad del codigo.
2. Luego usar `let`: Cuando se necesita reasignacion, usar `let`.
3. Evitar `var`: Dado que el alcance y el comportamiento de Hoisting de `var` pueden causar problemas inesperados, se recomienda evitarlo en el desarrollo moderno de JavaScript.
4. Tener en cuenta la compatibilidad del navegador: Si se necesita soportar navegadores antiguos, se pueden usar herramientas como Babel para transpilar `let` y `const` a `var`.

## Temas relacionados

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
