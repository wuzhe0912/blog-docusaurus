---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> ¿Qué son ref y reactive?

`ref` y `reactive` son las dos APIs principales en Vue 3 Composition API para crear datos reactivos.

### ref

**Definición**: `ref` se usa para crear un **valor de tipo primitivo** o una **referencia a objeto** reactiva.

<details>
<summary>Clic para ver ejemplo básico de ref</summary>

```vue
<script setup>
import { ref } from 'vue';

// Tipos primitivos
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// Objetos (también se puede usar ref)
const user = ref({ name: 'John', age: 30 });

// Se necesita usar .value para acceder
console.log(count.value); // 0
count.value++; // Modificar valor
</script>
```

</details>

### reactive

**Definición**: `reactive` se usa para crear un **objeto** reactivo (no se puede usar directamente con tipos primitivos).

<details>
<summary>Clic para ver ejemplo básico de reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

// Solo se puede usar con objetos
const state = reactive({
  count: 0,
  message: 'Hello',
  user: { name: 'John', age: 30 },
});

// Acceso directo a propiedades, sin necesidad de .value
console.log(state.count); // 0
state.count++; // Modificar valor
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> Principales diferencias entre ref y reactive

### 1. Tipos aplicables

**ref**: Se puede usar con cualquier tipo

```typescript
const count = ref(0); // ✅ Número
const message = ref('Hello'); // ✅ Cadena
const isActive = ref(true); // ✅ Booleano
const user = ref({ name: 'John' }); // ✅ Objeto
const items = ref([1, 2, 3]); // ✅ Arreglo
```

**reactive**: Solo se puede usar con objetos

```typescript
const state = reactive({ count: 0 }); // ✅ Objeto
const state = reactive([1, 2, 3]); // ✅ Arreglo (también es un objeto)
const count = reactive(0); // ❌ Error: no se puede con tipos primitivos
const message = reactive('Hello'); // ❌ Error: no se puede con tipos primitivos
```

### 2. Forma de acceso

**ref**: Se necesita usar `.value` para acceder

<details>
<summary>Clic para ver ejemplo de acceso con ref</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

// En JavaScript se necesita usar .value
console.log(count.value); // 0
count.value = 10;

// En la plantilla se desenvuelve automáticamente, no necesita .value
</script>

<template>
  <div>{{ count }}</div>
  <!-- Desenvuelve automáticamente, no necesita .value -->
</template>
```

</details>

**reactive**: Acceso directo a propiedades

<details>
<summary>Clic para ver ejemplo de acceso con reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

// Acceso directo a propiedades
console.log(state.count); // 0
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. Reasignación

**ref**: Se puede reasignar

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // ✅ Se puede reasignar
```

**reactive**: No se puede reasignar (pierde la reactividad)

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // ❌ Pierde la reactividad, no se actualiza la vista
```

### 4. Desestructuración

**ref**: Mantiene la reactividad después de desestructurar

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // Desestructura valores primitivos, pierde reactividad

// Pero se puede desestructurar el ref en sí
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive**: Pierde la reactividad después de desestructurar

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // ❌ Pierde reactividad

// Se necesita usar toRefs para mantener la reactividad
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // ✅ Mantiene reactividad
```

## 3. When to Use ref vs reactive?

> ¿Cuándo usar ref? ¿Cuándo usar reactive?

### Situaciones para usar ref

1. **Valores de tipo primitivo**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **Objetos que necesitan reasignación**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // Se puede reasignar
   ```

3. **Template Refs**

   ```vue
   <template>
     <div ref="container"></div>
   </template>
   <script setup>
   const container = ref(null);
   </script>
   ```

4. **Cuando se necesita desestructuración**
   ```typescript
   const state = ref({ count: 0, message: 'Hello' });
   // La desestructuración de valores primitivos no tiene problema
   ```

### Situaciones para usar reactive

1. **Estado de objeto complejo**

   ```typescript
   const formState = reactive({
     username: '',
     password: '',
     errors: {},
   });
   ```

2. **Estado que no necesita reasignación**

   ```typescript
   const config = reactive({
     apiUrl: 'https://api.example.com',
     timeout: 5000,
   });
   ```

3. **Múltiples propiedades relacionadas organizadas juntas**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> Preguntas comunes de entrevista

### Pregunta 1: Diferencias básicas

Explica las diferencias y resultados de salida del siguiente código.

```typescript
// Caso 1: Usando ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// Caso 2: Usando reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// Caso 3: Reasignación de reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>Clic para ver la respuesta</summary>

```typescript
// Caso 1: Usando ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // 10 ✅

// Caso 2: Usando reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // 10 ✅

// Caso 3: Reasignación de reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 }; // ❌ Pierde reactividad
console.log(state2.count); // 10 (el valor es correcto, pero pierde reactividad)
// Las modificaciones posteriores de state2.count no activarán actualización de la vista
```

**Diferencias clave**:

- `ref` necesita `.value` para acceder
- `reactive` accede directamente a las propiedades
- `reactive` no se puede reasignar, de lo contrario pierde la reactividad

</details>

### Pregunta 2: Problema de desestructuración

Explica el problema del siguiente código y proporciona una solución.

```typescript
// Caso 1: Desestructuración de ref
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// Caso 2: Desestructuración de reactive
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>Clic para ver la respuesta</summary>

**Caso 1: Desestructuración de ref**

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ❌ No actualiza user.value.name

// Forma correcta: modificar el valor de ref
user.value.name = 'Jane'; // ✅
// O reasignar
user.value = { name: 'Jane', age: 30 }; // ✅
```

**Caso 2: Desestructuración de reactive**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ❌ Pierde reactividad, no activa actualización

// Forma correcta 1: modificar la propiedad directamente
state.count = 10; // ✅

// Forma correcta 2: usar toRefs para mantener reactividad
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // ✅ Ahora es ref, necesita usar .value
```

**Resumen**:

- Desestructurar valores primitivos pierde la reactividad
- La desestructuración de `reactive` necesita usar `toRefs` para mantener la reactividad
- La desestructuración de propiedades de objeto de `ref` también pierde reactividad, se debe modificar `.value` directamente

</details>

### Pregunta 3: ¿Elegir ref o reactive?

Indica si se debe usar `ref` o `reactive` en los siguientes escenarios.

```typescript
// Escenario 1: Contador
const count = ?;

// Escenario 2: Estado de formulario
const form = ?;

// Escenario 3: Datos de usuario (puede necesitar reasignación)
const user = ?;

// Escenario 4: Referencia de plantilla
const inputRef = ?;
```

<details>
<summary>Clic para ver la respuesta</summary>

```typescript
// Escenario 1: Contador (tipo primitivo)
const count = ref(0); // ✅ ref

// Escenario 2: Estado de formulario (objeto complejo, no necesita reasignación)
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // ✅ reactive

// Escenario 3: Datos de usuario (puede necesitar reasignación)
const user = ref({ name: 'John', age: 30 }); // ✅ ref (se puede reasignar)

// Escenario 4: Referencia de plantilla
const inputRef = ref(null); // ✅ ref (las referencias de plantilla deben usar ref)
```

**Principios de selección**:

- Tipo primitivo → `ref`
- Objeto que necesita reasignación → `ref`
- Referencia de plantilla → `ref`
- Estado de objeto complejo, sin necesidad de reasignación → `reactive`

</details>

## 5. Best Practices

> Mejores prácticas

### Recomendaciones

```typescript
// 1. Tipos primitivos usan ref
const count = ref(0);
const message = ref('Hello');

// 2. Estados complejos usan reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3. Necesidad de reasignación usa ref
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // ✅

// 4. Desestructuración de reactive usa toRefs
import { toRefs } from 'vue';
const { count, message } = toRefs(state);

// 5. Unificar estilo: el equipo puede elegir usar principalmente ref o reactive
```

### Prácticas a evitar

```typescript
// 1. No usar reactive para crear tipos primitivos
const count = reactive(0); // ❌ Error

// 2. No reasignar reactive
let state = reactive({ count: 0 });
state = { count: 10 }; // ❌ Pierde reactividad

// 3. No desestructurar reactive directamente
const { count } = reactive({ count: 0 }); // ❌ Pierde reactividad

// 4. No olvidar .value en la plantilla (para ref)
// En la plantilla no necesita .value, pero en JavaScript sí
```

## 6. Interview Summary

> Resumen de entrevista

### Puntos clave para recordar

**ref**:

- Aplicable a cualquier tipo
- Se necesita `.value` para acceder
- Se puede reasignar
- Se desenvuelve automáticamente en la plantilla

**reactive**:

- Solo para objetos
- Acceso directo a propiedades
- No se puede reasignar
- La desestructuración necesita `toRefs`

**Principios de selección**:

- Tipo primitivo → `ref`
- Necesita reasignación → `ref`
- Estado de objeto complejo → `reactive`

### Ejemplo de respuesta para entrevista

**Q: ¿Cuál es la diferencia entre ref y reactive?**

> "ref y reactive son APIs de Vue 3 para crear datos reactivos. Las principales diferencias incluyen: 1) Tipos aplicables: ref se puede usar con cualquier tipo, reactive solo con objetos; 2) Forma de acceso: ref necesita .value para acceder, reactive accede directamente a las propiedades; 3) Reasignación: ref se puede reasignar, reactive no se puede reasignar o pierde la reactividad; 4) Desestructuración: la desestructuración de reactive necesita usar toRefs para mantener la reactividad. En general, los tipos primitivos y los objetos que necesitan reasignación usan ref, y los estados de objetos complejos usan reactive."

**Q: ¿Cuándo se debe usar ref? ¿Cuándo reactive?**

> "Usar ref en: 1) valores de tipo primitivo (números, cadenas, booleanos); 2) objetos que necesitan reasignación; 3) referencias de plantilla. Usar reactive en: 1) estados de objetos complejos, organizando múltiples propiedades relacionadas juntas; 2) estados que no necesitan reasignación. En la práctica, muchos equipos unifican el uso de ref porque es más flexible y tiene un rango de aplicación más amplio."

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
