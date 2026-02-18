---
id: basic-types
title: '[Easy] Tipos básicos y anotaciones de tipo'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> Cuáles son los tipos básicos de TypeScript?

TypeScript proporciona una variedad de tipos básicos para definir los tipos de variables, parámetros de funciones y valores de retorno.

### Tipos básicos

```typescript
// 1. number: números (enteros, punto flotante)
let age: number = 30;
let price: number = 99.99;

// 2. string: cadenas de texto
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean: valores booleanos
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null: valor nulo
let data: null = null;

// 5. undefined: no definido
let value: undefined = undefined;

// 6. void: sin valor de retorno (usado principalmente en funciones)
function logMessage(): void {
  console.log('Hello');
}

// 7. any: cualquier tipo (debe evitarse)
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown: tipo desconocido (más seguro que any)
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ Error: se debe verificar el tipo primero

// 9. never: valor que nunca ocurre (para funciones que nunca retornan)
function throwError(): never {
  throw new Error('Error');
}

// 10. object: objeto (poco usado, se recomienda usar interface)
let user: object = { name: 'John' };

// 11. array: arreglo
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple: tupla (arreglo de longitud y tipos fijos)
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> Anotaciones de tipo vs Inferencia de tipo

### Anotaciones de tipo (Type Annotations)

**Definición**: Especificar explícitamente el tipo de una variable.

```typescript
// Especificar el tipo explícitamente
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// Parámetros de función y valores de retorno
function add(a: number, b: number): number {
  return a + b;
}
```

### Inferencia de tipo (Type Inference)

**Definición**: TypeScript infiere automáticamente el tipo basado en el valor inicial.

```typescript
// TypeScript infiere automáticamente como number
let age = 30;        // age: number

// TypeScript infiere automáticamente como string
let name = 'John';   // name: string

// TypeScript infiere automáticamente como boolean
let isActive = true;  // isActive: boolean

// Los valores de retorno de funciones también se infieren automáticamente
function add(a: number, b: number) {
  return a + b;  // El valor de retorno se infiere automáticamente como number
}
```

### Cuándo usar anotaciones de tipo

**Situaciones en las que se debe especificar el tipo explícitamente**:

```typescript
// 1. Declaración de variable sin valor inicial
let value: number;
value = 10;

// 2. Parámetros de función (obligatorio)
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. Valor de retorno de función (se recomienda especificar explícitamente)
function calculate(): number {
  return 42;
}

// 4. Tipos complejos donde la inferencia puede no ser precisa
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> Preguntas frecuentes en entrevistas

### Pregunta 1: Inferencia de tipo

Explique el tipo de cada variable en el siguiente código.

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**Explicación**:
- TypeScript infiere automáticamente el tipo basado en el valor inicial
- Los arreglos se infieren como arreglo del tipo de sus elementos
- Los objetos se infieren como el tipo estructural del objeto

</details>

### Pregunta 2: Errores de tipo

Encuentre los errores de tipo en el siguiente código.

```typescript
let age: number = 30;
age = 'thirty';

let name: string = 'John';
name = 42;

let isActive: boolean = true;
isActive = 'yes';

let numbers: number[] = [1, 2, 3];
numbers.push('4');
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```typescript
let age: number = 30;
age = 'thirty'; // ❌ Type 'string' is not assignable to type 'number'

let name: string = 'John';
name = 42; // ❌ Type 'number' is not assignable to type 'string'

let isActive: boolean = true;
isActive = 'yes'; // ❌ Type 'string' is not assignable to type 'boolean'

let numbers: number[] = [1, 2, 3];
numbers.push('4'); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'
```

**Forma correcta de escribirlo**:
```typescript
let age: number = 30;
age = 30; // ✅

let name: string = 'John';
name = 'Jane'; // ✅

let isActive: boolean = true;
isActive = false; // ✅

let numbers: number[] = [1, 2, 3];
numbers.push(4); // ✅
```

</details>

### Pregunta 3: any vs unknown

Explique la diferencia entre `any` y `unknown`, e indique cuál debería usarse.

```typescript
// Caso 1: usando any
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ?
}

// Caso 2: usando unknown
function processUnknown(value: unknown): void {
  console.log(value.toUpperCase()); // ?
}
```

<details>
<summary>Haga clic para ver la respuesta</summary>

**Caso 1: usando any**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ Compila correctamente, pero puede fallar en tiempo de ejecución
}

processAny('hello');  // ✅ Ejecución normal
processAny(42);       // ❌ Error en tiempo de ejecución: value.toUpperCase is not a function
```

**Caso 2: usando unknown**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ Error de compilación: Object is of type 'unknown'

  // Se debe verificar el tipo primero
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ Seguro
  }
}
```

**Comparación de diferencias**:

| Característica | any | unknown |
| --- | --- | --- |
| Verificación de tipos | Completamente desactivada | Requiere verificación antes de usar |
| Seguridad | Inseguro | Seguro |
| Recomendación | Evitar su uso | Recomendado |

**Mejores prácticas**:
```typescript
// ✅ Recomendado: usar unknown y verificar el tipo
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  }
}

// ❌ Evitar: usar any
function processValue(value: any): void {
  console.log(value.toUpperCase()); // Inseguro
}
```

</details>

### Pregunta 4: Tipos de arreglo

Explique las diferencias en las siguientes declaraciones de tipos de arreglo.

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```typescript
// 1. number[]: arreglo de números (escritura recomendada)
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ Error

// 2. Array<number>: arreglo genérico (equivalente a number[])
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ Error

// 3. [number, string]: tupla (Tuple) - longitud y tipos fijos
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ Error: longitud excede 2
arr3.push('test');   // ⚠️ TypeScript lo permite, pero no se recomienda

// 4. any[]: arreglo de cualquier tipo (no recomendado)
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅ (pero se pierde la verificación de tipos)
```

**Recomendaciones de uso**:
- Arreglos generales: usar `number[]` o `Array<number>`
- Estructura fija: usar tupla `[type1, type2]`
- Evitar `any[]`, preferir tipos concretos o `unknown[]`

</details>

### Pregunta 5: void vs never

Explique las diferencias y casos de uso de `void` y `never`.

```typescript
// Caso 1: void
function logMessage(): void {
  console.log('Hello');
}

// Caso 2: never
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {
    // Bucle infinito
  }
}
```

<details>
<summary>Haga clic para ver la respuesta</summary>

**void**:
- **Uso**: Indica que una función no retorna un valor
- **Característica**: La función termina normalmente, simplemente no retorna un valor
- **Casos de uso**: Manejadores de eventos, funciones con efectos secundarios

```typescript
function logMessage(): void {
  console.log('Hello');
  // La función termina normalmente, no retorna un valor
}

function onClick(): void {
  // Maneja el evento de clic, no necesita valor de retorno
}
```

**never**:
- **Uso**: Indica que una función nunca termina normalmente
- **Característica**: La función lanza un error o entra en un bucle infinito
- **Casos de uso**: Manejo de errores, bucles infinitos, type guards

```typescript
function throwError(): never {
  throw new Error('Error');
  // Nunca se llega aquí
}

function infiniteLoop(): never {
  while (true) {
    // Nunca termina
  }
}

// Uso en type guards
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

**Comparación de diferencias**:

| Característica | void | never |
| --- | --- | --- |
| Fin de función | Termina normalmente | Nunca termina |
| Valor de retorno | undefined | Sin valor de retorno |
| Casos de uso | Funciones sin valor de retorno | Manejo de errores, bucles infinitos |

</details>

## 4. Best Practices

> Mejores prácticas

### Prácticas recomendadas

```typescript
// 1. Preferir la inferencia de tipo
let age = 30;  // ✅ Dejar que TypeScript infiera
let name = 'John';  // ✅

// 2. Especificar explícitamente el tipo de parámetros y retorno de funciones
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. Usar unknown en lugar de any
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. Usar tipos de arreglo específicos
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. Usar tuplas para estructuras fijas
let person: [string, number] = ['John', 30];  // ✅
```

### Prácticas a evitar

```typescript
// 1. Evitar el uso de any
let value: any = 'hello';  // ❌

// 2. Evitar anotaciones de tipo innecesarias
let age: number = 30;  // ⚠️ Se puede simplificar a let age = 30;

// 3. Evitar el tipo object
let user: object = { name: 'John' };  // ❌ Es mejor usar interface

// 4. Evitar arreglos de tipos mixtos (a menos que sea necesario)
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ Considerar si realmente es necesario
```

## 5. Interview Summary

> Resumen para entrevistas

### Referencia rápida

**Tipos básicos**:
- `number`, `string`, `boolean`, `null`, `undefined`
- `void` (sin valor de retorno), `never` (nunca retorna)
- `any` (cualquier tipo, evitar su uso), `unknown` (tipo desconocido, uso recomendado)

**Anotaciones de tipo vs Inferencia**:
- Anotación de tipo: especificar explícitamente `let age: number = 30`
- Inferencia de tipo: inferencia automática `let age = 30`

**Tipos de arreglo**:
- `number[]` o `Array<number>`: arreglo general
- `[number, string]`: tupla (estructura fija)

### Ejemplos de respuestas para entrevistas

**Q: Cuáles son los tipos básicos de TypeScript?**

> "TypeScript proporciona muchos tipos básicos, incluyendo number, string, boolean, null, undefined. También hay algunos tipos especiales: void indica que no hay valor de retorno, usado principalmente en funciones; never indica un valor que nunca ocurre, usado para funciones que nunca retornan; any es cualquier tipo, pero debe evitarse; unknown es un tipo desconocido, más seguro que any, requiere verificación de tipo antes de usarse. Además, existen el tipo de arreglo number[] y el tipo de tupla [number, string]."

**Q: Cuál es la diferencia entre any y unknown?**

> "any desactiva completamente la verificación de tipos, permitiendo usar directamente cualquier propiedad o método, lo cual es inseguro. unknown requiere una verificación de tipo antes de su uso, siendo más seguro. Por ejemplo, al usar unknown, se debe verificar primero con typeof el tipo y luego se pueden llamar los métodos correspondientes. Se recomienda preferir unknown sobre any."

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
