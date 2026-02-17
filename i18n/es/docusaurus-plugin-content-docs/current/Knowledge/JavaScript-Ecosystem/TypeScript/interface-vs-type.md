---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> Que son Interface y Type Alias?

### Interface (Interfaz)

**Definicion**: Se utiliza para definir la estructura de un objeto, describiendo que propiedades y metodos debe tener.

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // Propiedad opcional
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias (Alias de tipo)

**Definicion**: Crea un alias para un tipo, que se puede usar con cualquier tipo, no solo objetos.

```typescript
type User = {
  name: string;
  age: number;
  email?: string;
};

const user: User = {
  name: 'John',
  age: 30,
};
```

## 2. Interface vs Type Alias: Key Differences

> Principales diferencias entre Interface y Type Alias

### 1. Metodo de extension

**Interface: usando extends**

```typescript
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

**Type Alias: usando tipo de interseccion**

```typescript
type Animal = { name: string; };
type Dog = Animal & { breed: string; };
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

### 2. Fusion (Declaration Merging)

**Interface: soporta fusion**

```typescript
interface User { name: string; }
interface User { age: number; }
// Se fusiona automaticamente en { name: string; age: number; }
const user: User = { name: 'John', age: 30 };
```

**Type Alias: no soporta fusion**

```typescript
type User = { name: string; };
type User = { age: number; };  // ❌ Error: Duplicate identifier 'User'
```

### 3. Alcance de aplicacion

**Interface: principalmente para estructuras de objetos**

```typescript
interface User { name: string; age: number; }
```

**Type Alias: utilizable con cualquier tipo**

```typescript
type ID = string | number;
type Greet = (name: string) => string;
type Status = 'active' | 'inactive' | 'pending';
type Point = [number, number];
type User = { name: string; age: number; };
```

### 4. Propiedades computadas

**Interface: no soporta propiedades computadas**

```typescript
interface User { [key: string]: any; }
```

**Type Alias: soporta operaciones de tipo mas complejas**

```typescript
type Keys = 'name' | 'age' | 'email';
type User = { [K in Keys]: string; };
```

## 3. When to Use Interface vs Type Alias?

> Cuando usar Interface? Cuando usar Type Alias?

### Usar Interface cuando

1. **Definir estructuras de objetos** (lo mas comun)
2. **Se necesita fusion de declaraciones** (ej. extender tipos de paquetes de terceros)
3. **Definir contratos de clase**

### Usar Type Alias cuando

1. **Definir tipos union o interseccion**: `type ID = string | number;`
2. **Definir tipos de funcion**: `type EventHandler = (event: Event) => void;`
3. **Definir tuplas**: `type Point = [number, number];`
4. **Se necesitan tipos mapeados o condicionales**

## 4. Common Interview Questions

> Preguntas frecuentes en entrevistas

### Pregunta 1: Diferencias basicas

Explique las diferencias entre las siguientes dos formas de definicion.

```typescript
interface User { name: string; age: number; }
type User = { name: string; age: number; };
```

<details>
<summary>Haga clic para ver la respuesta</summary>

**Similitudes**: Ambos pueden definir estructuras de objetos, se usan de la misma manera, ambos pueden extenderse.

**Diferencias**:
1. **Fusion de declaraciones**: Interface la soporta; Type Alias no.
2. **Alcance**: Interface es principalmente para objetos; Type Alias para cualquier tipo.

**Recomendacion**: Para estructuras de objetos ambos sirven. Para fusion de declaraciones use Interface. Para tipos no-objeto use Type Alias.

</details>

### Pregunta 2: Metodos de extension

Explique las diferencias entre `extends` e intersection `&`.

<details>
<summary>Haga clic para ver la respuesta</summary>

- **Sintaxis**: Interface usa `extends`, Type usa `&`
- **Resultado**: Ambos producen el mismo resultado
- **Legibilidad**: `extends` de Interface es mas intuitivo
- **Flexibilidad**: `&` de Type puede combinar multiples tipos

</details>

### Pregunta 3: Fusion de declaraciones

```typescript
interface User { name: string; }
interface User { age: number; }
const user: User = { name: 'John' };  // Falta age?
```

<details>
<summary>Haga clic para ver la respuesta</summary>

Las dos declaraciones se fusionan automaticamente. Faltara `age` generando un error. Type Alias no soporta fusion de declaraciones.

</details>

### Pregunta 4: Implementacion (implements)

<details>
<summary>Haga clic para ver la respuesta</summary>

Ambos pueden usarse con `implements`. Interface es mas comun para contratos de clase. Type Alias de funciones no puede implementarse.

</details>

## 5. Best Practices

> Mejores practicas

### Practicas recomendadas

```typescript
// 1. Para objetos, preferir Interface
interface User { name: string; age: number; }

// 2. Para tipos union, usar Type Alias
type Status = 'active' | 'inactive' | 'pending';

// 3. Para tipos de funcion, usar Type Alias
type EventHandler = (event: Event) => void;

// 4. Para fusion de declaraciones, usar Interface
interface Window { customProperty: string; }

// 5. Para contratos de clase, usar Interface
interface Flyable { fly(): void; }
class Bird implements Flyable { fly(): void {} }
```

### Practicas a evitar

```typescript
// 1. No mezclar Interface y Type Alias para la misma estructura
// 2. No usar Type Alias para objetos simples (Interface es mas apropiado)
// 3. No usar Interface para tipos no-objeto
```

## 6. Interview Summary

> Resumen para entrevistas

### Referencia rapida

**Interface**: objetos, Declaration Merging, `extends`, contratos de clase.

**Type Alias**: cualquier tipo, sin Declaration Merging, `&` interseccion, union/funcion/tupla.

### Ejemplos de respuestas para entrevistas

**Q: Cuales son las diferencias entre Interface y Type Alias?**

> "Interface y Type Alias pueden usarse para definir estructuras de objetos, pero tienen diferencias clave: 1) Interface soporta fusion de declaraciones; Type Alias no. 2) Interface es para objetos; Type Alias para cualquier tipo. 3) Interface usa extends; Type Alias usa &. 4) Interface es mejor para contratos de clase. Para objetos ambos sirven, para fusion use Interface, para tipos no-objeto use Type Alias."

**Q: Cuando usar Interface y cuando Type Alias?**

> "Use Interface para: estructuras de objetos, fusion de declaraciones, contratos de clase. Use Type Alias para: tipos union/interseccion, tipos de funcion, tuplas, tipos mapeados/condicionales. En resumen, para objetos prefiera Interface, para el resto use Type Alias."

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)
