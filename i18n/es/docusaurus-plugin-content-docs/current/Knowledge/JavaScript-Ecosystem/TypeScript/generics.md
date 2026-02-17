---
id: generics
title: '[Medium] Genericos (Generics)'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> Que son los genericos?

Los genericos (Generics) son una caracteristica poderosa de TypeScript que nos permite crear componentes reutilizables que pueden manejar multiples tipos en lugar de un solo tipo.

**Concepto central**: Al definir funciones, interfaces o clases, no se especifica un tipo concreto de antemano, sino que se especifica al momento de usarlo.

### Por que se necesitan los genericos?

**Problema sin genericos**:

```typescript
// Problema: se necesita escribir una funcion para cada tipo
function getStringItem(arr: string[]): string {
  return arr[0];
}

function getNumberItem(arr: number[]): number {
  return arr[0];
}

function getBooleanItem(arr: boolean[]): boolean {
  return arr[0];
}
```

**Solucion con genericos**:

```typescript
// Una funcion para todos los tipos
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> Sintaxis basica de genericos

### Funciones genericas

```typescript
// Sintaxis: <T> representa el parametro de tipo
function identity<T>(arg: T): T {
  return arg;
}

// Uso 1: especificar el tipo explicitamente
let output1 = identity<string>('hello');  // output1: string

// Uso 2: dejar que TypeScript infiera el tipo
let output2 = identity('hello');  // output2: string (inferencia automatica)
```

### Interfaces genericas

```typescript
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = {
  value: 'hello',
};

const numberBox: Box<number> = {
  value: 42,
};
```

### Clases genericas

```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }
}

const stringContainer = new Container<string>();
stringContainer.add('hello');
stringContainer.add('world');

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
```

## 3. Generic Constraints

> Restricciones genericas

### Restricciones basicas

**Sintaxis**: Uso de la palabra clave `extends` para restringir el tipo generico.

```typescript
// T debe tener la propiedad length
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ Error: number no tiene la propiedad length
```

### Restriccion con keyof

```typescript
// K debe ser una clave de T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

getProperty(user, 'name');  // ✅ 'John'
getProperty(user, 'age');   // ✅ 30
getProperty(user, 'id');    // ❌ Error: 'id' no es una clave de user
```

### Multiples restricciones

```typescript
// T debe cumplir multiples condiciones simultaneamente
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ Error: boolean esta fuera del alcance de la restriccion
```

## 4. Common Interview Questions

> Preguntas frecuentes en entrevistas

### Pregunta 1: Implementar funcion generica

Implemente una funcion generica `first` que devuelva el primer elemento de un arreglo.

```typescript
function first<T>(arr: T[]): T | undefined {
  // Su implementacion
}
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// Ejemplo de uso
const firstString = first<string>(['a', 'b', 'c']);  // 'a'
const firstNumber = first<number>([1, 2, 3]);        // 1
const firstEmpty = first<number>([]);                 // undefined
```

**Explicacion**:
- `<T>` define el parametro de tipo generico
- `arr: T[]` representa un arreglo de tipo T
- El valor de retorno `T | undefined` indica que puede ser de tipo T o undefined

</details>

### Pregunta 2: Restricciones genericas

Implemente una funcion que fusione dos objetos, pero solo fusionando las propiedades existentes en el primer objeto.

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // Su implementacion
}
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// Ejemplo de uso
const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31, email: 'john@example.com' };

const merged = merge(obj1, obj2);
// { name: 'John', age: 31, email: 'john@example.com' }
```

**Version avanzada (solo fusionar propiedades del primer objeto)**:

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // Solo puede contener propiedades de obj1

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### Pregunta 3: Interface generica

Defina una interface generica `Repository` para operaciones de acceso a datos.

```typescript
interface Repository<T> {
  // Su definicion
}
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// Ejemplo de implementacion
class UserRepository implements Repository<User> {
  private users: User[] = [];

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findAll(): User[] {
    return this.users;
  }

  save(entity: User): void {
    const index = this.users.findIndex(user => user.id === entity.id);
    if (index >= 0) {
      this.users[index] = entity;
    } else {
      this.users.push(entity);
    }
  }

  delete(id: string): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}
```

</details>

### Pregunta 4: Restricciones genericas y keyof

Implemente una funcion que obtenga el valor de una propiedad de un objeto segun el nombre de la clave, asegurando la seguridad de tipos.

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // Su implementacion
}
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Ejemplo de uso
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const name = getValue(user, 'name');   // string
const age = getValue(user, 'age');     // number
const email = getValue(user, 'email');  // string
// const id = getValue(user, 'id');    // ❌ Error: 'id' no es una clave de user
```

**Explicacion**:
- `K extends keyof T` asegura que K debe ser una de las claves de T
- `T[K]` representa el tipo del valor correspondiente a la clave K en el objeto T
- Esto garantiza la seguridad de tipos, permitiendo descubrir errores en tiempo de compilacion

</details>

### Pregunta 5: Tipos condicionales y genericos

Explique los resultados de la inferencia de tipos del siguiente codigo.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>Haga clic para ver la respuesta</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**Explicacion**:
- `NonNullable<T>` es un tipo condicional (Conditional Type)
- Si T es asignable a `null | undefined`, devuelve `never`; de lo contrario, devuelve `T`
- En `string | null`, `string` no cumple la condicion y `null` si, por lo que el resultado es `string`
- En `string | number`, ninguno cumple la condicion, por lo que el resultado es `string | number`

**Aplicacion practica**:
```typescript
function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined');
  }
  return value as NonNullable<T>;
}

const result = processValue<string | null>('hello');  // string
```

</details>

## 5. Advanced Generic Patterns

> Patrones avanzados de genericos

### Parametros de tipo por defecto

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // Usa el tipo por defecto string
const container2: Container<number> = { value: 42 };
```

### Multiples parametros de tipo

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### Tipos de utilidad genericos

```typescript
// Partial: todas las propiedades se vuelven opcionales
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required: todas las propiedades se vuelven obligatorias
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick: seleccionar propiedades especificas
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit: excluir propiedades especificas
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> Mejores practicas

### Practicas recomendadas

```typescript
// 1. Usar nombres de genericos significativos
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. Usar restricciones para limitar el alcance de los genericos
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. Proporcionar parametros de tipo por defecto
interface Config<T = string> {
  value: T;
}

// 4. Usar tipos de utilidad genericos
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### Practicas a evitar

```typescript
// 1. No abusar de los genericos
function process<T>(value: T): T {  // ⚠️ Si solo hay un tipo, los genericos no son necesarios
  return value;
}

// 2. No usar nombres de genericos de una sola letra (excepto en casos simples)
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ Significado poco claro
  // ...
}

// 3. No ignorar las restricciones
function process<T>(value: T) {  // ⚠️ Si hay limitaciones, se deben agregar restricciones
  return value.length;  // Posible error
}
```

## 7. Interview Summary

> Resumen para entrevistas

### Referencia rapida

**Conceptos centrales de genericos**:
- No especificar un tipo concreto al definir, sino al usar
- Sintaxis: `<T>` define el parametro de tipo
- Aplicable a funciones, interfaces, clases

**Restricciones genericas**:
- Usar `extends` para limitar el alcance de los genericos
- `K extends keyof T` asegura que K es una clave de T
- Se pueden combinar multiples restricciones

**Patrones comunes**:
- Funcion generica: `function identity<T>(arg: T): T`
- Interface generica: `interface Box<T> { value: T; }`
- Clase generica: `class Container<T> { ... }`

### Ejemplos de respuestas para entrevistas

**Q: Que son los genericos? Por que se necesitan?**

> "Los genericos son un mecanismo en TypeScript para crear componentes reutilizables, donde no se especifica un tipo concreto al definir, sino al usar. Las principales ventajas de los genericos son: 1) Mayor reutilizacion del codigo - una funcion puede manejar multiples tipos; 2) Mantener la seguridad de tipos - verificar errores de tipo en tiempo de compilacion; 3) Reducir codigo duplicado - no es necesario escribir una funcion para cada tipo. Por ejemplo, `function identity<T>(arg: T): T` puede manejar cualquier tipo sin necesidad de escribir funciones separadas para string, number, etc."

**Q: Que son las restricciones genericas? Como se usan?**

> "Las restricciones genericas usan la palabra clave `extends` para limitar el alcance del tipo generico. Por ejemplo, `function getLength<T extends { length: number }>(arg: T)` asegura que T debe tener la propiedad length. Otra restriccion comun es `K extends keyof T`, que asegura que K debe ser una de las claves de T, permitiendo un acceso de propiedades con seguridad de tipos. Las restricciones ayudan a mantener la seguridad de tipos al usar genericos, proporcionando la informacion de tipos necesaria."

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
