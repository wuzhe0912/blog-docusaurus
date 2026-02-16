---
id: static-hoisting
title: '[Medium] Elevación estática en Vue3'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> ¿Qué es la elevación estática en Vue3?

En Vue3, la **elevación estática (Static Hoisting)** es una técnica de optimización en la fase de compilación.

### Definición

La **elevación estática** es cuando el compilador de Vue 3, al compilar el template, analiza qué nodos no dependen en absoluto del estado reactivo y nunca cambiarán, y luego los extrae como constantes en la parte superior del archivo. Estos nodos se crean una sola vez durante el renderizado inicial, y en los renderizados posteriores se reutilizan directamente, reduciendo así el costo de creación de VNode y de diff.

### Principio de funcionamiento

El compilador analiza el template y extrae los nodos que no dependen del estado reactivo y nunca cambiarán, convirtiéndolos en constantes en la parte superior del archivo. Se crean una sola vez en el renderizado inicial y se reutilizan directamente en los renderizados posteriores.

### Comparación antes y después de la compilación

**Template antes de compilar**:

<details>
<summary>Clic para ver ejemplo de Template</summary>

```vue
<template>
  <div>
    <h1>Título estático</h1>
    <p>Contenido estático</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

</details>

**JavaScript después de compilar** (versión simplificada):

<details>
<summary>Clic para ver ejemplo de JavaScript compilado</summary>

```js
// Los nodos estáticos se elevan a la parte superior, se crean una sola vez
const _hoisted_1 = /*#__PURE__*/ h('h1', null, 'Título estático');
const _hoisted_2 = /*#__PURE__*/ h('p', null, 'Contenido estático');

function render() {
  return h('div', null, [
    _hoisted_1, // Reutilización directa, no necesita recreación
    _hoisted_2, // Reutilización directa, no necesita recreación
    h('div', null, dynamicContent.value), // El contenido dinámico necesita recreación
  ]);
}
```

</details>

### Ventajas

1. **Reduce el costo de creación de VNode**: Los nodos estáticos se crean una sola vez y luego se reutilizan directamente
2. **Reduce el costo de diff**: Los nodos estáticos no participan en la comparación diff
3. **Mejora el rendimiento de renderizado**: El efecto es especialmente notable en componentes con gran cantidad de contenido estático
4. **Optimización automática**: Los desarrolladores no necesitan escribir nada especial para disfrutar de esta optimización

## 2. How Static Hoisting Works

> ¿Cómo funciona la elevación estática?

### Proceso de análisis del compilador

El compilador analiza cada nodo del template:

1. **Verifica si el nodo contiene bindings dinámicos**

   - Verifica si hay directivas dinámicas como `{{ }}`, `v-bind`, `v-if`, `v-for`
   - Verifica si los valores de los atributos contienen variables

2. **Marca los nodos estáticos**

   - Si el nodo y sus hijos no tienen bindings dinámicos, se marca como nodo estático

3. **Eleva los nodos estáticos**
   - Extrae los nodos estáticos fuera de la función render
   - Se definen como constantes en la parte superior del módulo

### Ejemplo 1: Elevación estática básica

<details>
<summary>Clic para ver ejemplo de elevación estática básica</summary>

```vue
<template>
  <div>
    <h1>Título</h1>
    <p>Este es contenido estático</p>
    <div>Bloque estático</div>
  </div>
</template>
```

</details>

**Después de compilar**:

<details>
<summary>Clic para ver resultado compilado</summary>

```js
// Todos los nodos estáticos son elevados
const _hoisted_1 = h('h1', null, 'Título');
const _hoisted_2 = h('p', null, 'Este es contenido estático');
const _hoisted_3 = h('div', null, 'Bloque estático');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

</details>

### Ejemplo 2: Contenido mixto estático y dinámico

<details>
<summary>Clic para ver ejemplo de contenido mixto</summary>

```vue
<template>
  <div>
    <h1>Título estático</h1>
    <p>{{ message }}</p>
    <div class="static-class">Contenido estático</div>
    <span :class="dynamicClass">Contenido dinámico</span>
  </div>
</template>
```

</details>

**Después de compilar**:

<details>
<summary>Clic para ver resultado compilado</summary>

```js
// Solo los nodos completamente estáticos son elevados
const _hoisted_1 = h('h1', null, 'Título estático');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, 'Contenido estático');

function render() {
  return h('div', null, [
    _hoisted_1, // Nodo estático, reutilización
    h('p', null, message.value), // Contenido dinámico, necesita recreación
    _hoisted_3, // Nodo estático, reutilización
    h('span', { class: dynamicClass.value }, 'Contenido dinámico'), // Atributo dinámico, necesita recreación
  ]);
}
```

</details>

### Ejemplo 3: Elevación de atributos estáticos

<details>
<summary>Clic para ver ejemplo de atributos estáticos</summary>

```vue
<template>
  <div>
    <div class="container" id="main">Contenido</div>
    <button disabled>Botón</button>
  </div>
</template>
```

</details>

**Después de compilar**:

<details>
<summary>Clic para ver resultado compilado</summary>

```js
// Los objetos de atributos estáticos también son elevados
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, 'Contenido');
const _hoisted_4 = h('button', _hoisted_2, 'Botón');

function render() {
  return h('div', null, [_hoisted_3, _hoisted_4]);
}
```

</details>

## 3. v-once Directive

> Directiva v-once

Si el desarrollador quiere marcar activamente un bloque grande de contenido que nunca cambiará, puede usar la directiva `v-once`.

### Función de v-once

`v-once` le dice al compilador que este elemento y sus hijos deben renderizarse solo una vez. Incluso si contiene bindings dinámicos, solo se calculará una vez en el renderizado inicial y no se actualizará posteriormente.

### Uso básico

<details>
<summary>Clic para ver ejemplo básico de v-once</summary>

```vue
<template>
  <div>
    <!-- Usar v-once para marcar contenido estático -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- Sin v-once, se actualizará reactivamente -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Título inicial');
const content = ref('Contenido inicial');

// Aunque se modifiquen estos valores, el bloque v-once no se actualizará
setTimeout(() => {
  title.value = 'Nuevo título';
  content.value = 'Nuevo contenido';
}, 1000);
</script>
```

</details>

### v-once vs Elevación estática

| Característica | Elevación estática      | v-once                    |
| -------------- | ----------------------- | ------------------------- |
| **Activación** | Automática (análisis del compilador) | Manual (marcado por el desarrollador) |
| **Escenario**  | Contenido completamente estático | Incluye bindings dinámicos pero se renderiza una sola vez |
| **Rendimiento** | Óptimo (no participa en diff) | Bueno (solo se renderiza una vez) |
| **Momento de uso** | Determinado automáticamente en compilación | El desarrollador sabe con certeza que no cambiará |

### Escenarios de uso

```vue
<template>
  <!-- Escenario 1: Datos que se muestran una sola vez -->
  <div v-once>
    <p>Fecha de creación: {{ createdAt }}</p>
    <p>Creador: {{ creator }}</p>
  </div>

  <!-- Escenario 2: Estructura estática compleja -->
  <div v-once>
    <div class="header">
      <h1>Título</h1>
      <nav>Navegación</nav>
    </div>
  </div>

  <!-- Escenario 3: Elementos estáticos en listas -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Common Interview Questions

> Preguntas comunes de entrevista

### Pregunta 1: Principio de la elevación estática

Explica el principio de funcionamiento de la elevación estática en Vue3 y cómo mejora el rendimiento.

<details>
<summary>Clic para ver la respuesta</summary>

La elevación estática mejora el rendimiento principalmente en tres aspectos: 1) Reduce el costo de creación de VNode, los nodos estáticos se crean una sola vez y luego se reutilizan directamente; 2) Reduce el costo de diff, los nodos estáticos no participan en la comparación diff; 3) Reduce el uso de memoria, múltiples instancias de componentes pueden compartir nodos estáticos. Esta optimización es especialmente notable en componentes con gran cantidad de contenido estático, pudiendo reducir un 30-50% del tiempo de creación de VNode y un 40-60% del tiempo de comparación diff.

</details>

### Pregunta 2: Diferencia entre elevación estática y v-once

Explica las diferencias y los escenarios de uso de la elevación estática y `v-once`.

<details>
<summary>Clic para ver la respuesta</summary>

**Principales diferencias**:

- La elevación estática es una optimización automática del compilador, aplicable a contenido completamente estático
- v-once es un marcado manual del desarrollador, aplicable a contenido con bindings dinámicos que solo se renderiza una vez
- La elevación estática ofrece el mejor rendimiento ya que no participa en diff
- v-once ofrece buen rendimiento ya que solo se renderiza una vez

**Recomendación de selección**: Si el contenido es completamente estático, dejar que el compilador lo maneje automáticamente; si contiene bindings dinámicos pero solo se renderiza una vez, usar v-once; si necesita actualización reactiva, no usar v-once.

</details>

## 5. Best Practices

> Mejores prácticas

### Recomendaciones

```vue
<!-- 1. Dejar que el compilador maneje automáticamente el contenido estático -->
<template>
  <div>
    <h1>Título</h1>
    <p>Contenido estático</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2. Usar v-once explícitamente para marcar contenido de un solo renderizado -->
<template>
  <div v-once>
    <p>Fecha de creación: {{ createdAt }}</p>
    <p>Creador: {{ creator }}</p>
  </div>
</template>

<!-- 3. Separar estructura estática y contenido dinámico -->
<template>
  <div>
    <div class="container">
      <header>Título</header>
      <main>{{ content }}</main>
    </div>
  </div>
</template>
```

### Prácticas a evitar

```vue
<!-- 1. No abusar de v-once -->
<template>
  <!-- ❌ Si el contenido necesita actualización, no se debe usar v-once -->
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2. No usar v-once en contenido dinámico -->
<template>
  <!-- ❌ Si los elementos de la lista necesitan actualización, no se debe usar v-once -->
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>
```

## 6. Interview Summary

> Resumen de entrevista

### Puntos clave para recordar

**Elevación estática**: Optimización automática del compilador, eleva nodos estáticos como constantes, reduce costos de VNode y diff.

**v-once**: Marcado manual del desarrollador para contenido que solo se renderiza una vez, puede incluir bindings dinámicos.

**Diferencia clave**: La elevación estática es automática y para contenido completamente estático; v-once es manual y puede incluir bindings dinámicos.

### Ejemplo de respuesta para entrevista

**Q: ¿Qué es la elevación estática en Vue3?**

> "En Vue3, la elevación estática es una optimización en la fase de compilación. El compilador analiza el template y extrae los nodos que no dependen del estado reactivo y nunca cambiarán, convirtiéndolos en constantes en la parte superior del archivo. Se crean una sola vez en el renderizado inicial y se reutilizan directamente en los renderizados posteriores, reduciendo el costo de creación de VNode y de diff. Los desarrolladores no necesitan escribir nada especial, solo escribir el template normalmente y el compilador decidirá automáticamente qué nodos se pueden hacer hoist. Si se quiere marcar activamente un bloque de contenido que nunca cambiará, se puede usar v-once."

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
