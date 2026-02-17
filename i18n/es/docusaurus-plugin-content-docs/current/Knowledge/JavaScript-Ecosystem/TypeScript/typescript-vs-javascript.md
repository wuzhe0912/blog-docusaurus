---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> Que es TypeScript?

TypeScript es un lenguaje de programacion de codigo abierto desarrollado por Microsoft, y es un **superconjunto (Superset)** de JavaScript. Esto significa que todo codigo JavaScript valido es tambien codigo TypeScript valido.

**Caracteristicas principales**:

- Agrega un **sistema de tipos estaticos** sobre JavaScript
- Realiza verificacion de tipos en tiempo de compilacion
- Se convierte en JavaScript puro despues de la compilacion
- Proporciona mejor experiencia de desarrollo y soporte de herramientas

## 2. What are the differences between TypeScript and JavaScript?

> Cuales son las diferencias entre TypeScript y JavaScript?

### Diferencias principales

| Caracteristica | JavaScript              | TypeScript              |
| -------------- | ----------------------- | ----------------------- |
| Sistema de tipos | Dinamico (verificacion en ejecucion) | Estatico (verificacion en compilacion) |
| Compilacion    | No necesaria            | Requiere compilacion a JavaScript |
| Anotaciones    | No soportadas           | Soporta anotaciones de tipo |
| Deteccion de errores | En tiempo de ejecucion | En tiempo de compilacion |
| Soporte IDE    | Basico                  | Autocompletado y refactorizacion potentes |
| Curva de aprendizaje | Baja               | Alta                    |

### Diferencias del sistema de tipos

**JavaScript (tipos dinamicos)**:

```javascript
let value = 10;
value = 'hello'; // Puede cambiar de tipo
function add(a, b) { return a + b; }
add(1, 2); // 3
add('1', '2'); // '12' (concatenacion de cadenas)
add(1, '2'); // '12' (conversion de tipo)
```

**TypeScript (tipos estaticos)**:

```typescript
let value: number = 10;
value = 'hello'; // ❌ Error de compilacion

function add(a: number, b: number): number { return a + b; }
add(1, 2); // ✅ 3
add('1', '2'); // ❌ Error de compilacion
```

### Proceso de compilacion

```typescript
// Codigo fuente TypeScript
let message: string = 'Hello World';
console.log(message);

// ↓ Despues de compilar se convierte en JavaScript
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> Por que usar TypeScript?

### Ventajas

1. **Deteccion temprana de errores** - Detectar errores de tipo en compilacion
2. **Mejor soporte IDE** - Autocompletado y refactorizacion
3. **Legibilidad del codigo** - Las anotaciones de tipo aclaran la intencion de las funciones
4. **Refactorizacion mas segura** - Deteccion automatica de ubicaciones que necesitan actualizacion

### Desventajas

1. **Requiere paso de compilacion** - Aumenta la complejidad del flujo de desarrollo
2. **Curva de aprendizaje** - Necesita aprender el sistema de tipos
3. **Tamano de archivo** - La informacion de tipos aumenta el tamano del codigo fuente (sin efecto despues de compilar)
4. **Configuracion compleja** - Necesita configurar `tsconfig.json`

## 4. Common Interview Questions

> Preguntas frecuentes en entrevistas

### Pregunta 1: Momento de la verificacion de tipos

<details>
<summary>Haga clic para ver la respuesta</summary>

- JavaScript realiza conversiones de tipo en **tiempo de ejecucion**, lo que puede producir resultados inesperados
- TypeScript verifica tipos en **tiempo de compilacion**, detectando errores anticipadamente

</details>

### Pregunta 2: Inferencia de tipos

<details>
<summary>Haga clic para ver la respuesta</summary>

TypeScript infiere automaticamente el tipo a partir del valor inicial. Despues de la inferencia, no se puede cambiar el tipo (a menos que se declare explicitamente como `any` o tipo `union`).

</details>

### Pregunta 3: Comportamiento en tiempo de ejecucion

<details>
<summary>Haga clic para ver la respuesta</summary>

- Las **anotaciones de tipo de TypeScript desaparecen completamente despues de la compilacion**
- El JavaScript compilado es identico al JavaScript puro
- TypeScript solo proporciona verificacion de tipos en la **fase de desarrollo**, sin afectar el rendimiento en ejecucion

</details>

### Pregunta 4: Errores de tipo vs Errores de ejecucion

<details>
<summary>Haga clic para ver la respuesta</summary>

- **Error de compilacion TypeScript**: Detectado en la fase de desarrollo, no se puede ejecutar el programa
- **Error de ejecucion JavaScript**: Detectado durante el uso, causa caida del programa

TypeScript puede prevenir muchos errores de ejecucion mediante la verificacion de tipos.

</details>

## 5. Best Practices

> Mejores practicas

### Practicas recomendadas

```typescript
// 1. Especificar explicitamente el tipo de retorno de funciones
function add(a: number, b: number): number { return a + b; }

// 2. Usar interface para estructuras de objetos complejas
interface User { name: string; age: number; email?: string; }

// 3. Preferir unknown sobre any
function processValue(value: unknown): void {
  if (typeof value === 'string') { console.log(value.toUpperCase()); }
}

// 4. Usar alias de tipo para mejorar la legibilidad
type UserID = string;
```

## 6. Interview Summary

> Resumen para entrevistas

**Q: Cuales son las principales diferencias entre TypeScript y JavaScript?**

> "TypeScript es un superconjunto de JavaScript, la principal diferencia es que agrega un sistema de tipos estaticos. JavaScript es un lenguaje de tipos dinamicos con verificacion en tiempo de ejecucion; TypeScript es un lenguaje de tipos estaticos con verificacion en tiempo de compilacion. Esto permite detectar errores relacionados con tipos en la fase de desarrollo. Despues de la compilacion, TypeScript se convierte en JavaScript puro, por lo que el comportamiento en ejecucion es identico al de JavaScript."

**Q: Por que usar TypeScript?**

> "Las principales ventajas son: 1) Deteccion temprana de errores en tiempo de compilacion; 2) Mejor soporte IDE con autocompletado y refactorizacion; 3) Mejor legibilidad del codigo con anotaciones de tipo; 4) Refactorizacion mas segura con deteccion automatica de ubicaciones a actualizar. Sin embargo, hay que considerar la curva de aprendizaje y el costo adicional del paso de compilacion."

## Reference

- [Documentacion oficial de TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
