---
id: primitive-vs-reference
title: '[Medium] 📄 Primitive vs Reference Types'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Primitive Types and Reference Types?

> ¿Qué son los tipos primitivos (Primitive Types) y los tipos de referencia (Reference Types)?

Los tipos de datos en JavaScript se dividen en dos grandes categorías: **tipos primitivos** y **tipos de referencia**. Tienen diferencias fundamentales en cómo se almacenan en memoria y cómo se comportan al ser pasados.

### Tipos primitivos (Primitive Types)

**Características**:

- Se almacenan en el **Stack (pila)**
- Al pasarlos se **copia el valor en sí** (Call by Value)
- Son inmutables (Immutable)

**Incluyen 7 tipos**:

```javascript
// 1. String (cadena de texto)
const str = 'hello';

// 2. Number (número)
const num = 42;

// 3. Boolean (booleano)
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol (ES6)
const sym = Symbol('unique');

// 7. BigInt (ES2020)
const bigInt = 9007199254740991n;
```

### Tipos de referencia (Reference Types)

**Características**:

- Se almacenan en el **Heap (montículo)**
- Al pasarlos se **copia la referencia (dirección de memoria)** (Call by Reference)
- Son mutables (Mutable)

**Incluyen**:

```javascript
// 1. Object (objeto)
const obj = { name: 'John' };

// 2. Array (arreglo)
const arr = [1, 2, 3];

// 3. Function (función)
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> Paso por valor (Call by Value) vs Paso por referencia (Call by Reference)

### Paso por valor (Call by Value) - Tipos primitivos

**Comportamiento**: Se copia el valor en sí; modificar la copia no afecta al valor original.

```javascript
// Tipo primitivo: paso por valor
let a = 10;
let b = a; // Copiar valor

b = 20; // Modificar b

console.log(a); // 10 (sin efecto)
console.log(b); // 20
```

**Diagrama de memoria**:

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ ← Valor independiente
├─────────┤
│ b: 20   │ ← Valor independiente (modificado después de copiar)
└─────────┘
```

### Paso por referencia (Call by Reference) - Tipos de referencia

**Comportamiento**: Se copia la dirección de memoria; dos variables apuntan al mismo objeto.

```javascript
// Tipo de referencia: paso por referencia
let obj1 = { name: 'John' };
let obj2 = obj1; // Copiar dirección de memoria

obj2.name = 'Jane'; // Modificar a través de obj2

console.log(obj1.name); // 'Jane' (¡afectado!)
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true (apuntan al mismo objeto)
```

**Diagrama de memoria**:

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (mismo objeto)   │
└─────────┘                    └──────────────────┘
```

## 3. Common Quiz Questions

> Preguntas frecuentes de examen

### Pregunta 1: Paso de tipos primitivos

```javascript
function changeValue(x) {
  x = 100;
  console.log('x dentro de la función:', x);
}

let num = 50;
changeValue(num);
console.log('num fuera de la función:', num);
```

<details>
<summary>Haz clic para ver la respuesta</summary>

```javascript
// x dentro de la función: 100
// num fuera de la función: 50
```

**Explicación**:

- `num` es un tipo primitivo (Number)
- Al pasarlo a la función se **copia el valor**, `x` y `num` son variables independientes
- Modificar `x` no afecta a `num`

```javascript
// Flujo de ejecución
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50 (copia)
x = 100; // Stack: x = 100 (solo modifica x)
console.log(num); // Stack: num = 50 (sin efecto)
```

</details>

### Pregunta 2: Paso de tipos de referencia

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('obj.name dentro de la función:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('person.name fuera de la función:', person.name);
```

<details>
<summary>Haz clic para ver la respuesta</summary>

```javascript
// obj.name dentro de la función: Changed
// person.name fuera de la función: Changed
```

**Explicación**:

- `person` es un tipo de referencia (Object)
- Al pasarlo a la función se **copia la dirección de memoria**
- `obj` y `person` apuntan al **mismo objeto**
- Modificar el contenido del objeto a través de `obj` también afecta a `person`

```javascript
// Diagrama de memoria
let person = { name: 'Original' }; // Heap: crear objeto @0x001
changeObject(person); // Stack: obj = @0x001 (copiar dirección)
obj.name = 'Changed'; // Heap: @0x001.name = 'Changed'
console.log(person.name); // Heap: @0x001.name (mismo objeto)
```

</details>

### Pregunta 3: Reasignación vs modificación de propiedades

```javascript
function test1(obj) {
  obj.name = 'Modified'; // Modificar propiedad
}

function test2(obj) {
  obj = { name: 'New Object' }; // Reasignar
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>Haz clic para ver la respuesta</summary>

```javascript
// A: Modified
// B: Modified (¡no es 'New Object'!)
```

**Explicación**:

**test1: Modificación de propiedad**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // ✅ Modifica la propiedad del objeto original
}
// person y obj apuntan al mismo objeto, por lo que se modifica
```

**test2: Reasignación**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // ❌ Solo cambia la referencia de obj
}
// obj ahora apunta a un nuevo objeto, pero person sigue apuntando al original
```

**Diagrama de memoria**:

```text
// Antes de test1
person ────> { name: 'Original' }
obj    ────> { name: 'Original' } (el mismo)

// Después de test1
person ────> { name: 'Modified' }
obj    ────> { name: 'Modified' } (el mismo)

// Ejecución de test2
person ────> { name: 'Modified' }    (sin cambio)
obj    ────> { name: 'New Object' }  (nuevo objeto)

// Después de test2
person ────> { name: 'Modified' }    (sigue sin cambio)
// obj se destruye, el nuevo objeto es recolectado por el garbage collector
```

</details>

### Pregunta 4: Paso de arreglos

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>Haz clic para ver la respuesta</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**Explicación**:

- `modifyArray`: Modifica el contenido del arreglo original, `numbers` se ve afectado
- `reassignArray`: Solo cambia la referencia del parámetro, `numbers` no se ve afectado

</details>

### Pregunta 5: Operaciones de comparación

```javascript
// Comparación de tipos primitivos
let a = 10;
let b = 10;
console.log('A:', a === b);

// Comparación de tipos de referencia
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>Haz clic para ver la respuesta</summary>

```javascript
// A: true
// B: false
// C: true
```

**Explicación**:

**Tipos primitivos**: Comparan valores

```javascript
10 === 10; // true (mismo valor)
```

**Tipos de referencia**: Comparan direcciones de memoria

```javascript
obj1 === obj2; // false (objetos diferentes, direcciones diferentes)
obj1 === obj3; // true (apuntan al mismo objeto)
```

**Diagrama de memoria**:

```text
obj1 ────> @0x001: { value: 10 }
obj2 ────> @0x002: { value: 10 } (mismo contenido pero dirección diferente)
obj3 ────> @0x001: { value: 10 } (misma dirección que obj1)
```

</details>

## 4. Shallow Copy vs Deep Copy

> Copia superficial vs Copia profunda

### Copia superficial (Shallow Copy)

**Definición**: Solo copia el primer nivel; los objetos anidados siguen siendo referencias.

#### Método 1: Operador de propagación (Spread Operator)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

// Modificar primer nivel: no afecta al objeto original
copy.name = 'Jane';
console.log(original.name); // 'John' (sin efecto)

// Modificar objeto anidado: ¡afecta al objeto original!
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung' (¡afectado!)
```

#### Método 2: Object.assign()

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John' (sin efecto)
```

#### Método 3: Copia superficial de arreglos

```javascript
const arr1 = [1, 2, 3];

// Método 1: Operador de propagación
const arr2 = [...arr1];

// Método 2: slice()
const arr3 = arr1.slice();

// Método 3: Array.from()
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1 (sin efecto)
```

### Copia profunda (Deep Copy)

**Definición**: Copia completamente todos los niveles, incluyendo objetos anidados.

#### Método 1: JSON.parse + JSON.stringify (el más común)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

// Modificar objeto anidado: no afecta al objeto original
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (sin efecto)

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming'] (sin efecto)
```

**Limitaciones**:

```javascript
const obj = {
  date: new Date(), // ❌ Se convierte en string
  func: () => {}, // ❌ Se ignora
  undef: undefined, // ❌ Se ignora
  symbol: Symbol('test'), // ❌ Se ignora
  regexp: /abc/, // ❌ Se convierte en {}
  circular: null, // ❌ Referencias circulares causan error
};
obj.circular = obj; // Referencia circular

JSON.parse(JSON.stringify(obj)); // Error o pérdida de datos
```

#### Método 2: structuredClone() (navegadores modernos)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

// Puede copiar correctamente objetos especiales como Date
console.log(copy.date instanceof Date); // true
```

**Ventajas**:

- ✅ Soporta Date, RegExp, Map, Set, etc.
- ✅ Soporta referencias circulares
- ✅ Mejor rendimiento

**Limitaciones**:

- ❌ No soporta funciones
- ❌ No soporta Symbol

#### Método 3: Implementación recursiva de copia profunda

```javascript
function deepClone(obj) {
  // Manejar null y no-objetos
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Manejar arreglos
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Manejar Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // Manejar RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Manejar objetos
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Ejemplo de uso
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (sin efecto)
```

#### Método 4: Usar Lodash

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### Comparación: Copia superficial vs Copia profunda

| Característica | Copia superficial | Copia profunda        |
| -------------- | ----------------- | --------------------- |
| Niveles copiados | Solo primer nivel | Todos los niveles   |
| Objetos anidados | Siguen siendo referencias | Completamente independientes |
| Rendimiento    | Rápido            | Lento                 |
| Memoria        | Poca              | Mucha                 |
| Caso de uso    | Objetos simples   | Estructuras anidadas complejas |

## 5. Common Pitfalls

> Trampas comunes

### Trampa 1: Creer que pasar parámetros puede cambiar tipos primitivos

```javascript
// ❌ Entendimiento incorrecto
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5 (¡no se convierte en 6!)

// ✅ Forma correcta
count = increment(count); // Necesita recibir el valor de retorno
console.log(count); // 6
```

### Trampa 2: Creer que reasignar puede cambiar el objeto externo

```javascript
// ❌ Entendimiento incorrecto
function resetObject(obj) {
  obj = { name: 'Reset' }; // Solo cambia la referencia del parámetro
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original' (¡no se reseteó!)

// ✅ Forma correcta 1: Modificar propiedades
function resetObject(obj) {
  obj.name = 'Reset';
}

// ✅ Forma correcta 2: Retornar nuevo objeto
function resetObject(obj) {
  return { name: 'Reset' };
}
person = resetObject(person);
```

### Trampa 3: Creer que el operador de propagación es una copia profunda

```javascript
// ❌ Entendimiento incorrecto
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // ¡Copia superficial!

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane' (¡fue afectado!)

// ✅ Forma correcta: Copia profunda
const copy = JSON.parse(JSON.stringify(original));
// o
const copy = structuredClone(original);
```

### Trampa 4: Malentendido sobre const

```javascript
// ¡const solo impide la reasignación, no la inmutabilidad!

const obj = { name: 'John' };

// ❌ No se puede reasignar
obj = { name: 'Jane' }; // TypeError: Assignment to constant variable

// ✅ Se pueden modificar propiedades
obj.name = 'Jane'; // Funciona normalmente
obj.age = 30; // Funciona normalmente

// Para verdadera inmutabilidad
const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane'; // Falla silenciosamente (en modo estricto lanza error)
console.log(immutableObj.name); // 'John' (no fue modificado)
```

### Trampa 5: Problema de referencias en bucles

```javascript
// ❌ Error común
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // ¡Todos apuntan al mismo objeto!
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]
// Todos son el mismo objeto, el valor final es 2

// ✅ Forma correcta: Crear nuevo objeto cada vez
const arr = [];

for (let i = 0; i < 3; i++) {
  arr.push({ value: i }); // Crear nuevo objeto cada vez
}

console.log(arr);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practices

> Mejores prácticas

### ✅ Métodos recomendados

```javascript
// 1. Cuando necesites copiar objetos, usa métodos de copia explícitos
const original = { name: 'John', age: 30 };

// Copia superficial (objetos simples)
const copy1 = { ...original };

// Copia profunda (objetos anidados)
const copy2 = structuredClone(original);

// 2. Las funciones no deben depender de efectos secundarios para modificar parámetros
// ❌ Mal
function addItem(arr, item) {
  arr.push(item); // Modifica el arreglo original
}

// ✅ Bien
function addItem(arr, item) {
  return [...arr, item]; // Retorna nuevo arreglo
}

// 3. Usar const para prevenir reasignación accidental
const config = { theme: 'dark' };
// config = {}; // Lanzará error

// 4. Usar Object.freeze cuando se necesiten objetos inmutables
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ Métodos a evitar

```javascript
// 1. No depender del paso de parámetros para modificar tipos primitivos
function increment(num) {
  num++; // ❌ Sin efecto
}

// 2. No confundir copia superficial con copia profunda
const copy = { ...nested }; // ❌ Creer que es copia profunda

// 3. No reutilizar la misma referencia de objeto en bucles
for (let i = 0; i < 3; i++) {
  arr.push(obj); // ❌ Todos apuntan al mismo objeto
}
```

## 7. Interview Summary

> Resumen para entrevistas

### Memorización rápida

**Tipos primitivos (Primitive)**:

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- Paso por valor (Call by Value)
- Almacenados en Stack
- Inmutables (Immutable)

**Tipos de referencia (Reference)**:

- Object, Array, Function, Date, RegExp, etc.
- Paso por referencia (Call by Reference)
- Almacenados en Heap
- Mutables (Mutable)

### Ejemplo de respuesta en entrevista

**Q: ¿JavaScript es Call by Value o Call by Reference?**

> JavaScript es **Call by Value para todos los tipos**, pero el "valor" que se pasa para los tipos de referencia es la dirección de memoria.
>
> - Tipos primitivos: Se pasa una copia del valor, las modificaciones no afectan al valor original
> - Tipos de referencia: Se pasa una copia de la dirección, a través de la dirección se puede modificar el objeto original
> - Sin embargo, si se reasigna (se cambia la dirección), no afecta al objeto original

## Reference

- [MDN - Data Structures](https://developer.mozilla.org/es/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript a fondo](https://javascript.info/object-copy)
