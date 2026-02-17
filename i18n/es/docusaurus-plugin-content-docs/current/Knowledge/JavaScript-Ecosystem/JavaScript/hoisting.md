---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. What's Hoisting ?

La ejecución de JS se puede dividir en dos fases: la fase de creación y la fase de ejecución:

```js
var name = 'Pitt';
console.log(name); // print Pitt
```

Debido a la característica de Hoisting, el código anterior debe entenderse como: primero se declara la variable y luego se ejecuta la asignación.

```js
// create
var name;

// execute
name = 'Pitt';
console.log(name);
```

Las funciones son diferentes a las variables: se asignan a la memoria durante la fase de creación. La declaración de función es la siguiente:

```js
getName();

function getName() {
  console.log('string'); // print string
}
```

La razón por la que el código anterior puede ejecutarse normalmente e imprimir console.log sin generar un error es la siguiente lógica: la function se eleva primero a la parte superior, y luego se ejecuta la llamada a la function.

```js
// create
function getName() {
  console.log('string');
}

// execute
getName();
```

Sin embargo, hay que tener en cuenta que con esta característica de Hoisting, es necesario prestar atención al orden de escritura cuando se usan expresiones.

En la fase de creación, la function tiene la máxima prioridad, seguida por las variables.

### Correct

```js
name = 'Yumy';
console.log(name); // print Yumy
var name;

// --- Equal to ---

// create
var name;

// execute
name = 'Yumy';
console.log(name); // print Yumy
```

### Wrong

```js
console.log(name); // print undefined
var name = 'Jane';

// --- Equal to ---

// create
var name;

// execute
console.log(name); // print undefined，porque aún no se ha asignado un valor, solo se obtiene el undefined por defecto
name = 'Pitt';
```

## 2. What's `name` printed ?

```js
whoseName();

function whoseName() {
  if (name) {
    name = 'Nini';
  }
}

var name = 'Pitt';
console.log(name);
```

### Answer

```js
// create
function whoseName() {
  if (name) {
    name = 'Nini';
  }
}
var name;

// execute
whoseName();
name = 'Pitt';
console.log(name); // print Pitt
```

name en `whoseName()` recibe undefined, por lo que no entra en la condición.

Sin embargo, como hay otra asignación debajo de la declaración de función, incluso si la condición en la function se cumpliera, finalmente se imprimiría Pitt.

---

## 3. Declaración de función vs Declaración de variable: Prioridad de Hoisting

### Pregunta: Función y variable con el mismo nombre

Determine el resultado de salida del siguiente código:

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### Respuesta incorrecta (malentendido común)

Muchas personas creen que:

- Se imprime `undefined` (pensando que var se eleva primero)
- Se imprime `'1'` (pensando que la asignación afecta)
- Da error (pensando que el mismo nombre causa conflicto)

### Salida real

```js
[Function: foo]
```

### ¿Por qué?

Esta pregunta examina las **reglas de prioridad** del Hoisting:

**Prioridad de Hoisting: Declaración de función > Declaración de variable**

```js
// Codigo original
console.log(foo);
var foo = '1';
function foo() {}

// Equivalente a (despues del Hoisting)
// Fase 1: Fase de creacion (Hoisting)
function foo() {} // 1. La declaracion de funcion se eleva primero
var foo; // 2. La declaracion de variable se eleva (pero no sobrescribe la funcion existente)

// Fase 2: Fase de ejecucion
console.log(foo); // En este momento foo es una funcion, salida [Function: foo]
foo = '1'; // 3. Asignacion de variable (sobrescribe la funcion)
```

### Conceptos clave

**1. Las declaraciones de función se elevan completamente**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. Las declaraciones de variable con var solo elevan la declaración, no la asignación**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. Cuando la declaración de función y la declaración de variable tienen el mismo nombre**

```js
// Orden despues del hoisting
function foo() {} // La funcion se eleva y se asigna primero
var foo; // La declaracion de variable se eleva, pero no sobrescribe la funcion existente

// Por lo tanto foo es una funcion
console.log(foo); // [Function: foo]
```

### Flujo de ejecución completo

```js
// Codigo original
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== Equivalente a ========

// Fase de creacion (Hoisting)
function foo() {} // 1. Elevacion de declaracion de funcion (elevacion completa, incluyendo el cuerpo)
var foo; // 2. Elevacion de declaracion de variable (pero no sobrescribe foo, porque ya es una funcion)

// Fase de ejecucion
console.log(foo); // [Function: foo] - foo es una funcion
foo = '1'; // 3. Asignacion de variable (ahora si sobrescribe la funcion)
console.log(foo); // '1' - foo se convierte en string
```

### Ejercicios avanzados

#### Ejercicio A: Influencia del orden

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**Respuesta:**

```js
[Function: foo] // Primera salida
'1' // Segunda salida
```

**Razón:** El orden del código no afecta el resultado del Hoisting. La prioridad de elevación sigue siendo: función > variable.

#### Ejercicio B: Múltiples funciones con el mismo nombre

```js
console.log(foo); // ?

function foo() {
  return 1;
}

var foo = '1';

function foo() {
  return 2;
}

console.log(foo); // ?
```

**Respuesta:**

```js
[Function: foo] { return 2; } // Primera salida (la funcion posterior sobrescribe la anterior)
'1' // Segunda salida (la asignacion de variable sobrescribe la funcion)
```

**Razón:**

```js
// Despues del hoisting
function foo() {
  return 1;
} // Primera funcion

function foo() {
  return 2;
} // La segunda funcion sobrescribe la primera

var foo; // Declaracion de variable (no sobrescribe la funcion)

console.log(foo); // [Function: foo] { return 2; }
foo = '1'; // Asignacion de variable (sobrescribe la funcion)
console.log(foo); // '1'
```

#### Ejercicio C: Expresión de función vs Declaración de función

```js
console.log(foo); // ?
console.log(bar); // ?

var foo = function () {
  return 1;
};

function bar() {
  return 2;
}
```

**Respuesta:**

```js
undefined; // foo es undefined
[Function: bar] // bar es una funcion
```

**Razón:**

```js
// Despues del hoisting
var foo; // Elevacion de declaracion de variable (la expresion de funcion solo eleva el nombre de variable)
function bar() {
  return 2;
} // Elevacion completa de declaracion de funcion

console.log(foo); // undefined
console.log(bar); // [Function: bar]

foo = function () {
  return 1;
}; // Asignacion de expresion de funcion
```

**Diferencia clave:**

- **Declaración de función**: `function foo() {}` → se eleva completamente (incluyendo el cuerpo de la función)
- **Expresión de función**: `var foo = function() {}` → solo se eleva el nombre de la variable, el cuerpo de la función no se eleva

### let/const no tienen este problema

```js
// var tiene problemas de hoisting
console.log(foo); // undefined
var foo = '1';

// let/const tienen zona muerta temporal (TDZ)
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = '1';

// let/const con el mismo nombre que una funcion genera error
function baz() {} // SyntaxError: Identifier 'baz' has already been declared
let baz = '1';
```

### Resumen de prioridad de Hoisting

```
Prioridad de Hoisting (de mayor a menor):

1. Declaración de función (Function Declaration)
   ├─ function foo() {} ✅ se eleva completamente
   └─ prioridad más alta

2. Declaración de variable (Variable Declaration)
   ├─ var foo ⚠️ solo se eleva la declaración, no la asignación
   └─ no sobrescribe funciones existentes

3. Asignación de variable (Variable Assignment)
   ├─ foo = '1' ✅ sobrescribe la función
   └─ ocurre en la fase de ejecución

4. Expresión de función (Function Expression)
   ├─ var foo = function() {} ⚠️ se trata como asignación de variable
   └─ solo se eleva el nombre de variable, no el cuerpo de la función
```

### Puntos clave en entrevistas

Al responder este tipo de preguntas, se recomienda:

1. **Explicar el mecanismo de Hoisting**: Se divide en fase de creación y fase de ejecución
2. **Enfatizar la prioridad**: Declaración de función > Declaración de variable
3. **Dibujar el código después del Hoisting**: Mostrar al entrevistador tu comprensión
4. **Mencionar las mejores prácticas**: Usar let/const para evitar problemas de Hoisting con var

**Ejemplo de respuesta en entrevista:**

> "Esta pregunta examina la prioridad del Hoisting. En JavaScript, la declaración de función tiene mayor prioridad de elevación que la declaración de variable.
>
> El proceso de ejecución se divide en dos fases:
>
> 1. Fase de creación: `function foo() {}` se eleva completamente a la parte superior, luego la declaración `var foo` se eleva pero no sobrescribe la función existente.
> 2. Fase de ejecución: En `console.log(foo)`, foo es una función en ese momento, por lo que se imprime `[Function: foo]`. Después, `foo = '1'` sobrescribe foo con un string.
>
> La mejor práctica es usar `let`/`const` en lugar de `var`, y colocar las declaraciones de función en la parte superior para evitar este tipo de confusiones."

---

## Temas relacionados

- [Diferencias entre var, let, const](/docs/let-var-const-differences)
