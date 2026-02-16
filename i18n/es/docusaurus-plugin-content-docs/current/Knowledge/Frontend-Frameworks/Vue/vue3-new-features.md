---
id: vue3-new-features
title: '[Easy] Nuevas características de Vue3'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> ¿Cuáles son las nuevas características de Vue 3?

Vue 3 introdujo muchas nuevas características y mejoras, incluyendo principalmente:

### Principales nuevas características

1. **Composition API**: Nueva forma de escribir componentes
2. **Teleport**: Renderizar componentes en otra posición del DOM
3. **Fragment**: Los componentes pueden tener múltiples nodos raíz
4. **Suspense**: Manejar la carga de componentes asíncronos
5. **Múltiples v-model**: Soporte para múltiples v-model
6. **Mejor soporte de TypeScript**
7. **Optimización de rendimiento**: Tamaño de bundle más pequeño, velocidad de renderizado más rápida

## 2. Teleport

> ¿Qué es Teleport?

**Definición**: `Teleport` permite renderizar el contenido de un componente en otra posición del árbol DOM, sin cambiar la estructura lógica del componente.

### Escenarios de uso

**Escenarios comunes**: Modal, Tooltip, Notification y otros componentes que necesitan renderizarse en el body

<details>
<summary>Clic para ver ejemplo de Teleport</summary>

```vue
<template>
  <div>
    <button @click="showModal = true">Abrir Modal</button>

    <!-- Usar Teleport para renderizar el Modal en el body -->
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Título del Modal</h2>
          <p>Contenido del Modal</p>
          <button @click="showModal = false">Cerrar</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

</details>

### Ventajas

1. **Resuelve problemas de z-index**: El Modal se renderiza en el body, sin ser afectado por los estilos del componente padre
2. **Mantiene la estructura lógica**: La lógica del componente permanece en su ubicación original, solo cambia la posición del DOM
3. **Mejor mantenibilidad**: El código relacionado con el Modal se concentra en el componente

## 3. Fragment (múltiples nodos raíz)

> ¿Qué es Fragment?

**Definición**: Vue 3 permite que los componentes tengan múltiples nodos raíz, sin necesidad de envolverlos en un único elemento. Esto es un Fragment implícito, no es necesario usar una etiqueta `<Fragment>` como en React.

### Vue 2 vs Vue 3

**Vue 2**: Debe tener un solo nodo raíz

```vue
<!-- Vue 2: Debe estar envuelto en un solo elemento -->
<template>
  <div>
    <h1>Título</h1>
    <p>Contenido</p>
  </div>
</template>
```

**Vue 3**: Puede tener múltiples nodos raíz

```vue
<!-- Vue 3: Puede tener múltiples nodos raíz -->
<template>
  <h1>Título</h1>
  <p>Contenido</p>
</template>
```

### ¿Por qué se necesita Fragment?

En Vue 2, los componentes debían tener un solo nodo raíz, lo que obligaba a los desarrolladores a agregar frecuentemente elementos de envoltura adicionales (como `<div>`), los cuales:

1. **Rompen el HTML semántico**: Se agregan elementos de envoltura sin significado
2. **Aumentan los niveles del DOM**: Afectan los selectores de estilo y el rendimiento
3. **Dificultan el control de estilos**: Se necesita manejar los estilos del elemento de envoltura adicional

### Escenarios de uso

#### Escenario 1: Estructura HTML semántica

```vue
<template>
  <!-- No necesita elementos de envoltura adicionales -->
  <header>
    <h1>Título del sitio</h1>
  </header>
  <main>
    <p>Contenido principal</p>
  </main>
  <footer>
    <p>Pie de página</p>
  </footer>
</template>
```

#### Escenario 2: Componente de elemento de lista

```vue
<!-- ListItem.vue -->
<template>
  <li class="item-title">{{ title }}</li>
  <li class="item-description">{{ description }}</li>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
</script>
```

#### Escenario 3: Renderizado condicional de múltiples elementos

```vue
<template>
  <div v-if="showHeader" class="header">Título</div>
  <div v-if="showContent" class="content">Contenido</div>
  <div v-if="showFooter" class="footer">Pie de página</div>
</template>
```

### Herencia de atributos (Attribute Inheritance)

Cuando un componente tiene múltiples nodos raíz, el comportamiento de la herencia de atributos cambia.

**Nodo raíz único**: Los atributos se heredan automáticamente al elemento raíz

```vue
<!-- Componente padre -->
<MyComponent class="custom-class" id="my-id" />

<!-- Componente hijo (raíz única) -->
<template>
  <div>Contenido</div>
</template>

<!-- Resultado renderizado -->
<div class="custom-class" id="my-id">Contenido</div>
```

**Múltiples nodos raíz**: Los atributos no se heredan automáticamente, se deben especificar manualmente

```vue
<!-- Componente padre -->
<MyComponent class="custom-class" id="my-id" />

<!-- Componente hijo (múltiples raíces) -->
<template>
  <div>Primera raíz</div>
  <div>Segunda raíz</div>
</template>

<!-- Resultado renderizado: los atributos no se heredan automáticamente -->
<div>Primera raíz</div>
<div>Segunda raíz</div>
```

**Solución**: Usar `$attrs` para enlazar atributos manualmente

```vue
<!-- Componente hijo -->
<template>
  <div v-bind="$attrs">Primera raíz</div>
  <div>Segunda raíz</div>
</template>

<!-- Resultado renderizado -->
<div class="custom-class" id="my-id">Primera raíz</div>
<div>Segunda raíz</div>
```

**Usar `inheritAttrs: false` para controlar el comportamiento de herencia**:

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Desactivar herencia automática
});
</script>

<template>
  <div v-bind="$attrs">Primera raíz</div>
  <div>Segunda raíz</div>
</template>
```

### Fragment vs React Fragment

| Característica | Vue 3 Fragment        | React Fragment                    |
| -------------- | --------------------- | --------------------------------- |
| **Sintaxis**   | Implícita (sin etiqueta) | Explícita (`<Fragment>` o `<>` requerido) |
| **Propiedad Key** | No necesaria       | Cuando se necesita: `<Fragment key={...}>` |
| **Herencia de atributos** | Requiere manejo manual | No soporta atributos      |

**Vue 3**:

```vue
<!-- Vue 3: Fragment implícito -->
<template>
  <h1>Título</h1>
  <p>Contenido</p>
</template>
```

**React**:

```jsx
// React: Fragment explícito
function Component() {
  return (
    <>
      <h1>Título</h1>
      <p>Contenido</p>
    </>
  );
}
```

### Notas importantes

1. **Herencia de atributos**: Con múltiples nodos raíz, los atributos no se heredan automáticamente; se debe usar `$attrs` para enlazar manualmente
2. **Alcance de estilos**: Con múltiples nodos raíz, los estilos `scoped` se aplican a todos los nodos raíz
3. **Envoltura lógica**: Si lógicamente se necesita envolver, se debe usar un solo nodo raíz

```vue
<!-- ✅ Buena práctica: cuando se necesita envoltura lógica -->
<template>
  <div class="card">
    <h2>Título</h2>
    <p>Contenido</p>
  </div>
</template>

<!-- ⚠️ Evitar: múltiples raíces por el simple hecho de tenerlas -->
<template>
  <h2>Título</h2>
  <p>Contenido</p>
  <!-- Si estos dos elementos deben ser lógicamente un grupo, se deben envolver -->
</template>
```

## 4. Suspense

> ¿Qué es Suspense?

**Definición**: `Suspense` es un componente integrado que maneja el estado de carga durante la carga de componentes asíncronos.

### Uso básico

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Cargando...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### Escenarios de uso

1. **Carga de componentes asíncronos**

   ```vue
   <Suspense>
     <AsyncUserProfile :userId="userId" />
     <template #fallback>
       <UserProfileSkeleton />
     </template>
   </Suspense>
   ```

2. **Carga de datos asíncronos**
   ```vue
   <script setup>
   const data = await fetchData(); // Usar await en setup
   </script>
   ```

## 5. Multiple v-model

> Múltiples v-model

**Definición**: Vue 3 permite que los componentes usen múltiples `v-model`, cada uno correspondiente a un prop diferente.

### Vue 2 vs Vue 3

**Vue 2**: Solo un `v-model`

```vue
<!-- Vue 2: Solo un v-model -->
<CustomInput v-model="value" />
```

**Vue 3**: Múltiples `v-model`

```vue
<!-- Vue 3: Múltiples v-model -->
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### Ejemplo de implementación

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input :value="email" @input="$emit('update:email', $event.target.value)" />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Common Interview Questions

> Preguntas comunes de entrevista

### Pregunta 1: Escenarios de uso de Teleport

¿Cuándo se debe usar `Teleport`?

<details>
<summary>Clic para ver la respuesta</summary>

**Escenarios para usar Teleport**:

1. **Modal de diálogo**

   ```vue
   <Teleport to="body">
     <Modal v-if="showModal" />
   </Teleport>
   ```

   - Resuelve problemas de z-index
   - No se ve afectado por los estilos del padre

2. **Tooltip**

   ```vue
   <Teleport to="body">
     <Tooltip v-if="showTooltip" />
   </Teleport>
   ```

   - Evita ser ocultado por el overflow del padre

3. **Notificaciones**
   ```vue
   <Teleport to="#notifications">
     <Notification v-for="msg in messages" :key="msg.id" />
   </Teleport>
   ```
   - Gestión centralizada de la posición de las notificaciones

**Cuándo NO usar Teleport**:

- El contenido general no lo necesita
- Componentes que no requieren una posición DOM especial

</details>

### Pregunta 2: Ventajas de Fragment

Explica las ventajas de que Vue 3 permita múltiples nodos raíz.

<details>
<summary>Clic para ver la respuesta</summary>

**Ventajas**:

1. **Reduce elementos DOM innecesarios**

   ```vue
   <!-- Vue 2: necesita un div adicional -->
   <template>
     <div>
       <header>...</header>
       <main>...</main>
     </div>
   </template>

   <!-- Vue 3: no necesita elementos adicionales -->
   <template>
     <header>...</header>
     <main>...</main>
   </template>
   ```

2. **Mejor HTML semántico**

   - No es necesario agregar elementos de envoltura sin significado por las limitaciones de Vue
   - Mantiene la semántica de la estructura HTML

3. **Control de estilos más flexible**

   - No es necesario manejar los estilos del elemento de envoltura adicional
   - Reduce la complejidad de los selectores CSS

4. **Reduce niveles del DOM**

   - Árbol DOM más superficial, mejor rendimiento
   - Reduce el costo de renderizado del navegador

5. **Mejor mantenibilidad**
   - Código más conciso, sin elementos de envoltura adicionales
   - Estructura del componente más clara

</details>

### Pregunta 3: Problema de herencia de atributos con Fragment

Explica el comportamiento de la herencia de atributos cuando un componente tiene múltiples nodos raíz. ¿Cómo se resuelve?

<details>
<summary>Clic para ver la respuesta</summary>

**Problema**:

Cuando un componente tiene múltiples nodos raíz, los atributos pasados por el componente padre (como `class`, `id`, etc.) no se heredan automáticamente a ningún nodo raíz.

**Ejemplo**:

```vue
<!-- Componente padre -->
<MyComponent class="custom-class" id="my-id" />

<!-- Componente hijo (múltiples raíces) -->
<template>
  <div>Primera raíz</div>
  <div>Segunda raíz</div>
</template>

<!-- Resultado: los atributos no se heredan automáticamente -->
<div>Primera raíz</div>
<div>Segunda raíz</div>
```

**Soluciones**:

1. **Usar `$attrs` para enlazar atributos manualmente**

```vue
<!-- Componente hijo -->
<template>
  <div v-bind="$attrs">Primera raíz</div>
  <div>Segunda raíz</div>
</template>

<!-- Resultado -->
<div class="custom-class" id="my-id">Primera raíz</div>
<div>Segunda raíz</div>
```

2. **Usar `inheritAttrs: false` para controlar la herencia**

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Desactivar herencia automática
});
</script>

<template>
  <div v-bind="$attrs">Primera raíz</div>
  <div>Segunda raíz</div>
</template>
```

3. **Enlazar selectivamente atributos específicos**

```vue
<template>
  <div :class="$attrs.class">Primera raíz</div>
  <div :id="$attrs.id">Segunda raíz</div>
</template>
```

**Puntos clave**:

- Nodo raíz único: los atributos se heredan automáticamente
- Múltiples nodos raíz: los atributos no se heredan automáticamente, se deben manejar manualmente
- `$attrs` permite acceder a todos los atributos no definidos en `props`

</details>

### Pregunta 4: Fragment vs React Fragment

Compara las diferencias entre Vue 3 Fragment y React Fragment.

<details>
<summary>Clic para ver la respuesta</summary>

**Principales diferencias**:

| Característica | Vue 3 Fragment             | React Fragment                    |
| -------------- | -------------------------- | --------------------------------- |
| **Sintaxis**   | Implícita (sin etiqueta)   | Explícita (`<Fragment>` o `<>` requerido) |
| **Propiedad Key** | No necesaria            | Cuando se necesita: `<Fragment key={...}>` |
| **Herencia de atributos** | Requiere manejo manual (`$attrs`) | No soporta atributos |

**Vue 3**:

```vue
<!-- Vue 3: Fragment implícito, escribir directamente múltiples nodos raíz -->
<template>
  <h1>Título</h1>
  <p>Contenido</p>
</template>
```

**React**:

```jsx
// React: Fragment explícito, necesita usar etiquetas
function Component() {
  return (
    <>
      <h1>Título</h1>
      <p>Contenido</p>
    </>
  );
}

// O usar Fragment
import { Fragment } from 'react';
function Component() {
  return (
    <Fragment>
      <h1>Título</h1>
      <p>Contenido</p>
    </Fragment>
  );
}
```

**Comparación de ventajas**:

- **Vue 3**: Sintaxis más concisa, no necesita etiquetas adicionales
- **React**: Más explícito, puede agregar propiedad key

</details>

### Pregunta 5: Uso de Suspense

Implementa un ejemplo que use `Suspense` para cargar un componente asíncrono.

<details>
<summary>Clic para ver la respuesta</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>Cargando datos del usuario...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);

// Definir componente asíncrono
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

**Uso avanzado: manejo de errores**

```vue
<template>
  <Suspense @resolve="onResolve" @reject="onReject">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Cargando...</div>
    </template>
  </Suspense>
</template>

<script setup>
const onResolve = () => {
  console.log('Componente cargado exitosamente');
};

const onReject = (error) => {
  console.error('Error al cargar componente:', error);
};
</script>
```

</details>

## 7. Best Practices

> Mejores prácticas

### Prácticas recomendadas

```vue
<!-- 1. Usar Teleport para Modal -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2. Mantener la semántica con múltiples nodos raíz -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3. Usar Suspense para componentes asíncronos -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4. Usar nombres claros para múltiples v-model -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### Prácticas a evitar

```vue
<!-- 1. No usar Teleport en exceso -->
<Teleport to="body">
  <div>Contenido general</div> <!-- ❌ No es necesario -->
</Teleport>

<!-- 2. No romper la estructura por tener múltiples nodos raíz -->
<template>
  <h1>Título</h1>
  <p>Contenido</p>
  <!-- ⚠️ Si lógicamente necesitan estar envueltos, se debe usar un solo nodo raíz -->
</template>

<!-- 3. No ignorar el manejo de errores de Suspense -->
<Suspense>
  <AsyncComponent />
  <!-- ⚠️ Se debe manejar el caso de fallo en la carga -->
</Suspense>
```

## 8. Interview Summary

> Resumen de entrevista

### Memoria rápida

**Principales nuevas características de Vue 3**:

- **Composition API**: Nueva forma de escribir componentes
- **Teleport**: Renderizar componentes en otra posición del DOM
- **Fragment**: Soporte para múltiples nodos raíz
- **Suspense**: Manejar la carga de componentes asíncronos
- **Múltiples v-model**: Soporte para múltiples enlaces v-model

**Escenarios de uso**:

- Modal/Tooltip → `Teleport`
- HTML semántico → `Fragment`
- Componentes asíncronos → `Suspense`
- Componentes de formulario → Múltiples `v-model`

### Ejemplo de respuesta para entrevista

**Q: ¿Cuáles son las principales nuevas características de Vue 3?**

> "Vue 3 introdujo muchas nuevas características, incluyendo: 1) Composition API, que proporciona una nueva forma de escribir componentes con mejor organización lógica y reutilización de código; 2) Teleport, que permite renderizar el contenido de componentes en otra posición del árbol DOM, comúnmente usado para Modal, Tooltip, etc.; 3) Fragment, que permite a los componentes tener múltiples nodos raíz sin necesidad de elementos de envoltura adicionales; 4) Suspense, que maneja el estado de carga durante la carga de componentes asíncronos; 5) Múltiples v-model, que permite a los componentes usar múltiples enlaces v-model; 6) Mejor soporte de TypeScript y optimización de rendimiento. Estas nuevas características hacen que Vue 3 sea más potente y flexible, manteniendo la compatibilidad hacia atrás."

**Q: ¿Cuál es el escenario de uso de Teleport?**

> "Teleport se usa principalmente en escenarios donde se necesita renderizar componentes en otra posición del árbol DOM. Los escenarios comunes incluyen: 1) Modal de diálogo, que necesita renderizarse en el body para evitar problemas de z-index; 2) Tooltip, para evitar ser ocultado por el overflow del padre; 3) Notificaciones, para gestionar centralizadamente la posición de las notificaciones. La ventaja de Teleport es mantener la estructura lógica del componente sin cambios, solo cambiando la posición de renderizado del DOM, resolviendo problemas de estilo mientras mantiene la mantenibilidad del código."

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
