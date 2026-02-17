---
id: operators
title: '[Easy] 📄 JavaScript Operators'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. What is the difference between `==` and `===` ?

> ¿Cuál es la diferencia entre `==` y `===`?

Ambos son operadores de comparación. `==` compara si dos valores son iguales, mientras que `===` compara si dos valores son iguales y además si son del mismo tipo. Por lo tanto, el segundo puede considerarse como el modo estricto.

El primero, debido al diseño de JavaScript, realiza conversión de tipos automáticamente, lo que genera muchos resultados poco intuitivos. Por ejemplo:

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

Esto supone una gran carga cognitiva para los desarrolladores, por lo que se recomienda generalmente usar `===` en lugar de `==` para evitar errores inesperados.

**Mejores prácticas**: Usa siempre `===` y `!==`, a menos que tengas muy claro por qué necesitas usar `==`.

### Preguntas de entrevista

#### Pregunta 1: Comparación de tipos básicos

Determina el resultado de las siguientes expresiones:

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**Respuesta:**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**Explicación:**

- **`==` (operador de igualdad)**: Realiza conversión de tipos
  - La cadena `'1'` se convierte al número `1`
  - Luego compara `1 == 1`, el resultado es `true`
- **`===` (operador de igualdad estricta)**: No realiza conversión de tipos
  - `number` y `string` son tipos diferentes, devuelve directamente `false`

**Reglas de conversión de tipos:**

```javascript
// Orden de prioridad de conversión de tipos con ==
// 1. Si hay un number, convertir el otro lado a number
'1' == 1; // '1' → 1, resultado true
'2' == 2; // '2' → 2, resultado true
'0' == 0; // '0' → 0, resultado true

// 2. Si hay un boolean, convertir boolean a number
true == 1; // true → 1, resultado true
false == 0; // false → 0, resultado true
'1' == true; // '1' → 1, true → 1, resultado true

// 3. Trampa en la conversión de cadena a número
'' == 0; // '' → 0, resultado true
' ' == 0; // ' ' → 0, resultado true (cadena con espacios se convierte a 0)
```

#### Pregunta 2: Comparación de null y undefined

Determina el resultado de las siguientes expresiones:

```javascript
undefined == null; // ?
undefined === null; // ?
```

**Respuesta:**

```javascript
undefined == null; // true
undefined === null; // false
```

**Explicación:**

Esta es una **regla especial** de JavaScript:

- **`undefined == null`**: `true`
  - La especificación ES lo establece especialmente: `null` y `undefined` son iguales cuando se comparan con `==`
  - Este es el único escenario donde `==` es útil: verificar si una variable es `null` o `undefined`
- **`undefined === null`**: `false`
  - Son tipos diferentes (`undefined` es de tipo `undefined`, `null` es de tipo `object`)
  - No son iguales en comparación estricta

**Aplicación práctica:**

```javascript
// Verificar si una variable es null o undefined
function isNullOrUndefined(value) {
  return value == null; // Verifica null y undefined simultáneamente
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// Equivalente (pero más conciso)
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**Trampas a tener en cuenta:**

```javascript
// null y undefined solo son iguales entre sí
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// Pero con ===, solo son iguales a sí mismos
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### Pregunta 3: Comparación integral

Determina el resultado de las siguientes expresiones:

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**Respuesta:**

```javascript
0 == false; // true (false → 0)
0 === false; // false (tipos diferentes: number vs boolean)
'' == false; // true ('' → 0, false → 0)
'' === false; // false (tipos diferentes: string vs boolean)
null == false; // false (null solo es igual a null y undefined)
undefined == false; // false (undefined solo es igual a null y undefined)
```

**Diagrama del flujo de conversión:**

```javascript
// Proceso de conversión de 0 == false
0 == false;
0 == 0; // false se convierte al número 0
true; // resultado

// Proceso de conversión de '' == false
'' == false;
'' == 0; // false se convierte al número 0
0 == 0; // '' se convierte al número 0
true; // resultado

// Caso especial de null == false
null == false;
// ¡null no se convierte! Según la especificación, null solo es igual a null y undefined
false; // resultado
```

#### Pregunta 4: Comparación de objetos

Determina el resultado de las siguientes expresiones:

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**Respuesta:**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**Explicación:**

- La comparación de objetos (incluyendo arrays y objetos) es por **referencia**
- Aunque el contenido sea el mismo, si son instancias diferentes, no son iguales
- `==` y `===` se comportan igual para objetos (ambos comparan referencias)

```javascript
// Solo son iguales si la referencia es la misma
const arr1 = [];
const arr2 = arr1; // Referencia al mismo array
arr1 == arr2; // true
arr1 === arr2; // true

// Aunque el contenido sea el mismo, son instancias diferentes
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false (diferente referencia)
arr3 === arr4; // false (diferente referencia)

// Lo mismo aplica para objetos
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### Memoria rápida para entrevistas

**Reglas de conversión de tipos de `==` (prioridad de arriba a abajo):**

1. `null == undefined` → `true` (regla especial)
2. `number == string` → convertir string a number
3. `number == boolean` → convertir boolean a number
4. `string == boolean` → ambos se convierten a number
5. Objetos comparan referencias, sin conversión

**Reglas de `===` (simple):**

1. Tipos diferentes → `false`
2. Mismo tipo → comparar valor (tipos básicos) o referencia (tipos de objeto)

**Mejores prácticas:**

```javascript
// ✅ Siempre usar ===
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ Única excepción: verificar null/undefined
if (value == null) {
  // value es null o undefined
}

// ❌ Evitar usar == (excepto en el caso anterior)
if (value == 0) {
} // no recomendado
if (name == 'Alice') {
} // no recomendado
```

**Ejemplo de respuesta en entrevista:**

> "`==` realiza conversión de tipos, lo que puede llevar a resultados poco intuitivos, como que `0 == '0'` sea `true`. `===` es una comparación estricta que no realiza conversión de tipos; si los tipos son diferentes, devuelve directamente `false`.
>
> La mejor práctica es usar siempre `===`, con la única excepción de `value == null` para verificar `null` y `undefined` simultáneamente.
>
> Es importante notar que `null == undefined` es `true`, pero `null === undefined` es `false`, esto es una regla especial de JavaScript."

---

## 2. What is the difference between `&&` and `||` ? Please explain short-circuit evaluation

> ¿Cuál es la diferencia entre `&&` y `||`? Explica la evaluación de cortocircuito

### Concepto básico

- **`&&` (AND)**: Cuando el lado izquierdo es `falsy`, devuelve directamente el valor de la izquierda sin ejecutar el lado derecho
- **`||` (OR)**: Cuando el lado izquierdo es `truthy`, devuelve directamente el valor de la izquierda sin ejecutar el lado derecho

### Ejemplo de evaluación de cortocircuito

```js
// && evaluación de cortocircuito
const user = null;
const name = user && user.name; // user es falsy, devuelve null directamente, no accede a user.name
console.log(name); // null (sin error)

// || evaluación de cortocircuito
const defaultName = 'Guest';
const userName = user || defaultName; // user es falsy, devuelve el defaultName de la derecha
console.log(userName); // 'Guest'

// Aplicación práctica
function greet(name) {
  const displayName = name || 'Anonymous'; // Si no se pasa name, usa el valor predeterminado
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### Trampas comunes ⚠️

```js
// Problema: 0 y '' también son falsy
const count = 0;
const result = count || 10; // 0 es falsy, devuelve 10
console.log(result); // 10 (puede no ser el resultado esperado)

// Solución: Usar ?? (Nullish Coalescing)
const betterResult = count ?? 10; // Solo devuelve 10 para null/undefined
console.log(betterResult); // 0
```

---

## 3. What is the `?.` (Optional Chaining) operator ?

> ¿Qué es el operador Optional Chaining `?.`?

### Escenario del problema

La forma tradicional de escribir es propensa a errores:

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ Peligroso: Si address no existe, genera un error
console.log(user.address.city); // Normal
console.log(otherUser.address.city); // TypeError: Cannot read property 'city' of undefined

// ✅ Seguro pero verbose
const city = user && user.address && user.address.city;
```

### Uso de Optional Chaining

```js
// ✅ Conciso y seguro
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined (sin error)

// También se puede usar para llamadas a métodos
user?.getName?.(); // Solo se ejecuta si getName existe

// También se puede usar para arrays
const firstItem = users?.[0]?.name; // Acceso seguro al nombre del primer usuario
```

### Aplicación práctica

```js
// Procesamiento de respuesta API
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Unknown User';
  const email = response?.data?.user?.email ?? 'No email';

  console.log(`User: ${userName}`);
  console.log(`Email: ${email}`);
}

// Operaciones DOM
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. What is the `??` (Nullish Coalescing) operator ?

> ¿Qué es el operador Nullish Coalescing `??`?

### Diferencia con `||`

```js
// || trata todos los valores falsy como falsos
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? solo trata null y undefined como valores vacíos
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### Aplicación práctica

```js
// Manejo de valores que pueden ser 0
function updateScore(newScore) {
  // ✅ Correcto: 0 es una puntuación válida
  const score = newScore ?? 100; // Si es 0 mantiene 0, solo usa 100 para null/undefined
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// Manejo de valores de configuración
const config = {
  timeout: 0, // 0 milisegundos es una configuración válida
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0 (mantiene la configuración de 0)
const retries = config.maxRetries ?? 3; // 3 (null usa el valor predeterminado)
```

### Uso combinado

```js
// ?? y ?. se usan frecuentemente juntos
const userAge = user?.profile?.age ?? 18; // Si no hay datos de edad, predeterminado 18

// Caso práctico: Valores predeterminados de formulario
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0, // 0 es una edad válida
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. What is the difference between `i++` and `++i` ?

> ¿Cuál es la diferencia entre `i++` y `++i`?

### Diferencia básica

- **`i++` (postfijo)**: Primero devuelve el valor actual, luego suma 1
- **`++i` (prefijo)**: Primero suma 1, luego devuelve el nuevo valor

### Ejemplo

```js
let a = 5;
let b = a++; // b = 5, a = 6 (primero asigna a b, luego incrementa)
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6 (primero incrementa, luego asigna a d)
console.log(c, d); // 6, 6
```

### Impacto práctico

```js
// En bucles normalmente no hay diferencia (porque no se usa el valor de retorno)
for (let i = 0; i < 5; i++) {} // ✅ Común
for (let i = 0; i < 5; ++i) {} // ✅ También válido, algunos creen que es ligeramente más rápido (en realidad no hay diferencia en los motores JS modernos)

// Pero en expresiones sí hay diferencia
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1 (primero obtiene el valor con i=0, luego i se convierte en 1)
console.log(arr[++i]); // 3 (i primero se convierte en 2, luego obtiene el valor)
```

### Mejores prácticas

```js
// ✅ Claro: escribir por separado
let count = 0;
const value = arr[count];
count++;

// ⚠️ No recomendado: fácil de confundir
const value = arr[count++];
```

---

## 6. What is the Ternary Operator ? When should you use it ?

> ¿Qué es el operador ternario? ¿Cuándo debería usarse?

### Sintaxis básica

```js
condition ? valueIfTrue : valueIfFalse;
```

### Ejemplo simple

```js
// if-else tradicional
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// ✅ Operador ternario: más conciso
const message = age >= 18 ? 'Adult' : 'Minor';
```

### Escenarios adecuados para su uso

```js
// 1. Asignación condicional simple
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. Renderizado condicional en JSX/plantillas
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. Establecer valores predeterminados (combinado con otros operadores)
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Welcome, ${displayName}!` : `Hello, ${displayName}`;

// 4. Valor de retorno de función
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### Escenarios donde no se recomienda

```js
// ❌ Anidamiento excesivo, difícil de leer
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ Usar if-else o switch es más claro
let result;
if (condition1) result = value1;
else if (condition2) result = value2;
else if (condition3) result = value3;
else result = value4;

// ❌ Lógica compleja
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ Dividir en múltiples líneas
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess = isAdmin || hasReadPermission;
```

---

## Tarjeta de memoria rápida

| Operador      | Uso                  | Punto clave                                  |
| ------------- | -------------------- | -------------------------------------------- |
| `===`         | Igualdad estricta    | Usa siempre este, olvida `==`                |
| `&&`          | Cortocircuito AND    | Izquierda falsa: para y devuelve valor falso |
| `\|\|`        | Cortocircuito OR     | Izquierda verdadera: para y devuelve valor verdadero |
| `?.`          | Optional Chaining    | Acceso seguro, sin errores                   |
| `??`          | Nullish Coalescing   | Solo maneja null/undefined                   |
| `++i` / `i++` | Auto-incremento     | Prefijo: primero incrementa; postfijo: después incrementa |
| `? :`         | Operador ternario    | Usar para condiciones simples, evitar anidamiento |

## Reference

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
