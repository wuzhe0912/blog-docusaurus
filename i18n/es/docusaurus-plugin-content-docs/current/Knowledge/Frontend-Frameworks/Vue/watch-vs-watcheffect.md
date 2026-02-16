---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> ¿Qué son watch y watchEffect?

`watch` y `watchEffect` son dos APIs en Vue 3 Composition API para observar cambios en datos reactivos.

### watch

**Definición**: Especifica explícitamente la fuente de datos a observar, y ejecuta una función callback cuando los datos cambian.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Observar una sola fuente de datos
watch(count, (newValue, oldValue) => {
  console.log(`count cambió de ${oldValue} a ${newValue}`);
});

// Observar múltiples fuentes de datos
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count o message cambió');
});
</script>
```

### watchEffect

**Definición**: Rastrea automáticamente los datos reactivos usados en la función callback, y se ejecuta automáticamente cuando esos datos cambian.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Rastrea automáticamente count y message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // Se ejecuta automáticamente cuando count o message cambian
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> Principales diferencias entre watch y watchEffect

### 1. Especificación de fuente de datos

**watch**: Especifica explícitamente los datos a observar

```typescript
const count = ref(0);
const message = ref('Hello');

// Especificar explícitamente observar count
watch(count, (newVal, oldVal) => {
  console.log('count cambió');
});

// Especificar explícitamente observar múltiples datos
watch([count, message], ([newCount, newMessage]) => {
  console.log('count o message cambió');
});
```

**watchEffect**: Rastrea automáticamente los datos usados

```typescript
const count = ref(0);
const message = ref('Hello');

// Rastrea automáticamente count y message (porque se usan en el callback)
watchEffect(() => {
  console.log(count.value); // Rastrea count automáticamente
  console.log(message.value); // Rastrea message automáticamente
});
```

### 2. Momento de ejecución

**watch**: Ejecución diferida (lazy) por defecto, solo se ejecuta cuando los datos cambian

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('Ejecutado'); // Solo se ejecuta cuando count cambia
});

count.value = 1; // Dispara la ejecución
```

**watchEffect**: Se ejecuta inmediatamente, luego rastrea cambios

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('Ejecutado'); // Se ejecuta inmediatamente una vez
  console.log(count.value);
});

count.value = 1; // Se ejecuta de nuevo
```

### 3. Acceso al valor anterior

**watch**: Puede acceder al valor anterior

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Cambió de ${oldVal} a ${newVal}`);
});
```

**watchEffect**: No puede acceder al valor anterior

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // Solo puede acceder al valor actual
  // No puede obtener el valor anterior
});
```

### 4. Detener la observación

**watch**: Retorna una función de detención

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// Detener la observación
stopWatch();
```

**watchEffect**: Retorna una función de detención

```typescript
const count = ref(0);

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

// Detener la observación
stopEffect();
```

## 3. When to Use watch vs watchEffect?

> ¿Cuándo usar watch? ¿Cuándo usar watchEffect?

### Situaciones para usar watch

1. **Se necesita especificar explícitamente los datos a observar**
   ```typescript
   watch(userId, (newId) => {
     fetchUser(newId);
   });
   ```

2. **Se necesita acceder al valor anterior**
   ```typescript
   watch(count, (newVal, oldVal) => {
     console.log(`Cambió de ${oldVal} a ${newVal}`);
   });
   ```

3. **Se necesita ejecución diferida (solo ejecutar cuando cambie)**
   ```typescript
   watch(searchQuery, (newQuery) => {
     if (newQuery.length > 2) {
       search(newQuery);
     }
   });
   ```

4. **Se necesita un control más preciso**
   ```typescript
   watch(
     () => user.value.id,
     (newId) => {
       fetchUser(newId);
     },
     { immediate: true, deep: true }
   );
   ```

### Situaciones para usar watchEffect

1. **Rastrear automáticamente múltiples datos relacionados**
   ```typescript
   watchEffect(() => {
     // Rastrea automáticamente todos los datos reactivos usados
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **No se necesita el valor anterior**
   ```typescript
   watchEffect(() => {
     console.log(`Conteo actual: ${count.value}`);
   });
   ```

3. **Se necesita ejecución inmediata**
   ```typescript
   watchEffect(() => {
     // Se ejecuta inmediatamente, luego rastrea cambios
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> Preguntas comunes de entrevista

### Pregunta 1: Diferencia básica

Explica el orden de ejecución y el resultado de salida del siguiente código.

```typescript
const count = ref(0);
const message = ref('Hello');

// watch
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>Clic para ver la respuesta</summary>

```typescript
const count = ref(0);
const message = ref('Hello');

// watch: ejecución diferida, no se ejecuta inmediatamente
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect: se ejecuta inmediatamente
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // Salida inmediata: watchEffect: 0 Hello
});

count.value = 1;
// Dispara watch: watch: 1
// Dispara watchEffect: watchEffect: 1 Hello

message.value = 'World';
// watch no observa message, no se ejecuta
// watchEffect observa message, se ejecuta: watchEffect: 1 World
```

**Orden de salida**:
1. `watchEffect: 0 Hello` (ejecución inmediata)
2. `watch: 1` (count cambió)
3. `watchEffect: 1 Hello` (count cambió)
4. `watchEffect: 1 World` (message cambió)

**Diferencias clave**:
- `watch` se ejecuta de forma diferida, solo cuando los datos observados cambian
- `watchEffect` se ejecuta inmediatamente, luego rastrea todos los datos usados

</details>

### Pregunta 2: Acceso al valor anterior

Explica cómo obtener el valor anterior al usar `watchEffect`.

<details>
<summary>Clic para ver la respuesta</summary>

**Problema**: `watchEffect` no puede acceder directamente al valor anterior

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // Solo puede acceder al valor actual
  // No puede obtener el valor anterior
});
```

**Solución 1: Usar ref para almacenar el valor anterior**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`Cambió de ${prevCount.value} a ${count.value}`);
  prevCount.value = count.value; // Actualizar valor anterior
});
```

**Solución 2: Usar watch (si se necesita el valor anterior)**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Cambió de ${oldVal} a ${newVal}`);
});
```

**Recomendación**:
- Si necesitas el valor anterior, usa preferentemente `watch`
- `watchEffect` es adecuado para escenarios donde no se necesita el valor anterior

</details>

### Pregunta 3: ¿Elegir watch o watchEffect?

Indica si se debe usar `watch` o `watchEffect` en los siguientes escenarios.

```typescript
// Escenario 1: Observar cambio de ID de usuario, recargar datos
const userId = ref(1);
// ?

// Escenario 2: Cuando la validación del formulario pasa, habilitar automáticamente el botón de envío
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// Escenario 3: Observar palabra clave de búsqueda, ejecutar búsqueda (necesita debounce)
const searchQuery = ref('');
// ?
```

<details>
<summary>Clic para ver la respuesta</summary>

**Escenario 1: Observar ID de usuario**

```typescript
const userId = ref(1);

// ✅ Usar watch: especificar explícitamente los datos a observar
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Escenario 2: Validación de formulario**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// ✅ Usar watchEffect: rastrear automáticamente datos relacionados
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**Escenario 3: Búsqueda (necesita debounce)**

```typescript
const searchQuery = ref('');

// ✅ Usar watch: necesita control más preciso (debounce)
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

**Principios de selección**:
- Especificar explícitamente datos a observar → `watch`
- Rastrear automáticamente múltiples datos relacionados → `watchEffect`
- Necesitar valor anterior o control preciso → `watch`
- Necesitar ejecución inmediata → `watchEffect`

</details>

## 5. Best Practices

> Mejores prácticas

### Prácticas recomendadas

```typescript
// 1. Usar watch cuando se especifican datos a observar
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. Usar watchEffect para rastrear automáticamente múltiples datos relacionados
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3. Usar watch cuando se necesita el valor anterior
watch(count, (newVal, oldVal) => {
  console.log(`Cambió de ${oldVal} a ${newVal}`);
});

// 4. Recordar limpiar los observadores
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### Prácticas a evitar

```typescript
// 1. No realizar operaciones asíncronas en watchEffect sin manejar la limpieza
watchEffect(async () => {
  const data = await fetchData(); // ❌ Puede causar fuga de memoria
  // ...
});

// 2. No abusar de watchEffect
// Si solo necesitas observar datos específicos, watch es más claro
watchEffect(() => {
  console.log(count.value); // ⚠️ Si solo necesitas observar count, watch es más adecuado
});

// 3. No modificar datos observados en watchEffect (puede causar bucle infinito)
watchEffect(() => {
  count.value++; // ❌ Puede causar bucle infinito
});
```

## 6. Interview Summary

> Resumen de entrevista

### Memoria rápida

**watch**:
- Especifica explícitamente los datos a observar
- Ejecución diferida (por defecto)
- Puede acceder al valor anterior
- Adecuado para escenarios que requieren control preciso

**watchEffect**:
- Rastrea automáticamente los datos usados
- Ejecución inmediata
- No puede acceder al valor anterior
- Adecuado para rastrear automáticamente múltiples datos relacionados

**Principios de selección**:
- Observación explícita → `watch`
- Rastreo automático → `watchEffect`
- Necesitar valor anterior → `watch`
- Necesitar ejecución inmediata → `watchEffect`

### Ejemplo de respuesta para entrevista

**Q: ¿Cuál es la diferencia entre watch y watchEffect?**

> "watch y watchEffect son ambas APIs de Vue 3 para observar cambios en datos reactivos. Las principales diferencias incluyen: 1) Fuente de datos: watch necesita especificar explícitamente los datos a observar, watchEffect rastrea automáticamente los datos reactivos usados en la función callback; 2) Momento de ejecución: watch se ejecuta de forma diferida por defecto, solo cuando los datos cambian, watchEffect se ejecuta inmediatamente y luego rastrea cambios; 3) Acceso al valor anterior: watch puede acceder al valor anterior, watchEffect no puede; 4) Escenarios de uso: watch es adecuado para escenarios donde se necesita especificar explícitamente los datos a observar o necesitar el valor anterior, watchEffect es adecuado para rastrear automáticamente múltiples datos relacionados."

**Q: ¿Cuándo se debe usar watch? ¿Cuándo watchEffect?**

> "Usar watch en: 1) cuando se necesita especificar explícitamente los datos a observar; 2) cuando se necesita acceder al valor anterior; 3) cuando se necesita ejecución diferida, solo ejecutar cuando cambie; 4) cuando se necesita control más preciso (como opciones immediate, deep). Usar watchEffect en: 1) cuando se necesita rastrear automáticamente múltiples datos relacionados; 2) cuando no se necesita el valor anterior; 3) cuando se necesita ejecución inmediata. En general, si solo necesitas observar datos específicos, watch es más claro; si necesitas rastrear automáticamente múltiples datos relacionados, watchEffect es más conveniente."

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
