---
title: '[Lv2] Nuxt 3 Lifecycle y principios de Hydration'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Comprender en profundidad el ciclo de vida (Lifecycle), la gestión de estado (State Management) y el mecanismo de Hydration de Nuxt 3, evitando problemas comunes de Hydration Mismatch.

---

## 1. Puntos clave de respuesta en entrevista

1. **Diferencias de Lifecycle**: Distinguir los Hooks que se ejecutan en Server-side vs Client-side. `setup` se ejecuta en ambos lados, `onMounted` solo se ejecuta en el Client.
2. **Gestión de estado**: Entender las diferencias entre `useState` y `ref` en escenarios SSR. `useState` puede sincronizar el estado entre Server y Client, evitando Hydration Mismatch.
3. **Mecanismo de Hydration**: Explicar cómo Hydration convierte HTML estático en una aplicación interactiva, y las causas comunes de Mismatch (inconsistencia en estructura HTML, contenido aleatorio, etc.).

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Entorno de ejecución de Lifecycle Hooks

En Nuxt 3 (Vue 3 SSR), diferentes Hooks se ejecutan en diferentes entornos:

| Lifecycle Hook | Server-side | Client-side | Descripción |
|----------------|-------------|-------------|-------------|
| **setup()** | ✅ Se ejecuta | ✅ Se ejecuta | Logica de inicializacion del componente. **Nota: evitar usar APIs exclusivas del Client (como window, document) en setup**. |
| **onBeforeMount** | ❌ No se ejecuta | ✅ Se ejecuta | Antes del montaje. |
| **onMounted** | ❌ No se ejecuta | ✅ Se ejecuta | Montaje completado. **Las operaciones DOM y llamadas a Browser API deben ir aquí**. |
| **onBeforeUpdate** | ❌ No se ejecuta | ✅ Se ejecuta | Antes de actualizar datos. |
| **onUpdated** | ❌ No se ejecuta | ✅ Se ejecuta | Después de actualizar datos. |
| **onBeforeUnmount** | ❌ No se ejecuta | ✅ Se ejecuta | Antes de desmontar. |
| **onUnmounted** | ❌ No se ejecuta | ✅ Se ejecuta | Después de desmontar. |

### 2.2 Pregunta común de entrevista: Se ejecuta onMounted en el Server?

**Respuesta:**
No. `onMounted` solo se ejecuta en el Client (navegador). El renderizado del lado del servidor solo se encarga de generar la cadena HTML, no realiza el montaje (Mounting) del DOM.

**Pregunta de seguimiento: Qué hacer si necesitas ejecutar lógica específica en el Server?**
- Usar `setup()` o `useAsyncData` / `useFetch`.
- Si necesitas distinguir el entorno, puedes usar `process.server` o `process.client` para determinar.

```typescript
<script setup>
// Se ejecuta tanto en Server como en Client
console.log('Setup executed');

if (process.server) {
  console.log('Only on Server');
}

onMounted(() => {
  // Solo se ejecuta en el Client
  console.log('Mounted (Client Only)');
  // Uso seguro de window
  window.alert('Hello');
});
</script>
```

---

## 3. Nuxt 3 useState vs Vue ref

### 3.1 Por qué Nuxt necesita useState?

En aplicaciones SSR, después de que el Server renderiza el HTML, serializa el estado (State) y lo envía al Client para que este realice la Hydration (asumir el estado).

- **Vue `ref`**: Es un estado local dentro del componente. En el proceso SSR, el valor de `ref` creado en el Server **no se transfiere automáticamente** al Client. Al inicializarse el Client, se recrea el `ref` (normalmente se reinicia al valor inicial), causando inconsistencia entre el contenido renderizado por el Server y el estado inicial del Client, produciendo Hydration Mismatch.
- **Nuxt `useState`**: Es una gestión de estado amigable con SSR. Almacena el estado en `NuxtPayload`, enviandolo junto con el HTML al Client. Al inicializarse el Client, lee este Payload y restaura el estado, asegurando consistencia entre Server y Client.

### 3.2 Tabla comparativa

| Característica | Vue `ref` / `reactive` | Nuxt `useState` |
|----------------|------------------------|-----------------|
| **Alcance** | Dentro del componente / módulo | Global (compartible a través de key en toda la App) |
| **Sincronizacion de estado SSR** | ❌ No se sincroniza | ✅ Serializa y sincroniza automáticamente al Client |
| **Escenarios de uso** | Solo estado de interacción del Client, datos que no necesitan sincronización SSR | Estado entre componentes, datos que deben pasar del Server al Client (como User Info) |

### 3.3 Ejemplo de implementación

**Ejemplo incorrecto (usar ref para estado entre plataformas):**

```typescript
// Server genera número aleatorio -> HTML muestra 5
const count = ref(Math.random());

// Client re-ejecuta -> genera nuevo número aleatorio 3
// Resultado: Hydration Mismatch (Server: 5, Client: 3)
```

**Ejemplo correcto (usar useState):**

```typescript
// Server genera número aleatorio -> almacena en Payload (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client lee Payload -> obtiene el valor generado por el Server
// Resultado: Estado consistente
```

---

## 4. Hydration y Hydration Mismatch

### 4.1 Qué es Hydration?

Hydration (hidratacion) es el proceso en el que el JavaScript del Client toma el control del HTML estático renderizado por el Server.

1. **Server Rendering**: El Server ejecuta la aplicación Vue y genera una cadena HTML (incluyendo contenido y CSS).
2. **Descarga de HTML**: El navegador descarga y muestra el HTML estático (First Paint).
3. **Descarga y ejecución de JS**: El navegador descarga el bundle JS de Vue/Nuxt.
4. **Hydration**: Vue reconstruye el DOM virtual (Virtual DOM) en el Client y lo compara con el DOM real existente. Si la estructura coincide, Vue "activa" estos elementos DOM (vinculando event listeners), haciendo la página interactiva.

### 4.2 Qué es Hydration Mismatch?

Cuando la estructura del Virtual DOM generada en el Client **no coincide** con la estructura HTML renderizada por el Server, Vue emite una advertencia de Hydration Mismatch. Esto normalmente significa que el Client debe descartar el HTML del Server y re-renderizar, causando degradacion del rendimiento y parpadeo de pantalla.

### 4.3 Causas comunes de Mismatch y soluciones

#### 1. Estructura HTML inválida
El navegador corrige automáticamente la estructura HTML incorrecta, causando inconsistencia con lo esperado por Vue.
- **Ejemplo**: `<div>` dentro de `<p>`.
- **Solución**: Verificar la sintaxis HTML y asegurar que la estructura anidada sea válida.

#### 2. Contenido aleatorio o marcas de tiempo
El Server y el Client generan contenido diferente al ejecutarse.
- **Ejemplo**: `new Date()`, `Math.random()`.
- **Solución**:
    - Usar `useState` para fijar el valor.
    - O mover esta lógica a `onMounted` (solo renderizar en el Client, dejar en blanco o mostrar Placeholder en el Server).

```typescript
// Incorrecto
const time = new Date().toISOString();

// Correcto (usando onMounted)
const time = ref('');
onMounted(() => {
  time.value = new Date().toISOString();
});

// O usar <ClientOnly>
<ClientOnly>
  <div>{{ new Date() }}</div>
</ClientOnly>
```

#### 3. Renderizado condicional dependiente de window/document
- **Ejemplo**: `v-if="window.innerWidth > 768"`
- **Causa**: Server no tiene window, se evalua como false; Client se evalua como true.
- **Solución**: Actualizar estado en `onMounted`, o usar hooks exclusivos del Client como `useWindowSize`.

---

## 5. Resumen de entrevista

**Puedes responder así:**

> La principal diferencia entre Server-side y Client-side radica en la ejecución de los Lifecycle Hooks. El Server ejecuta principalmente `setup`, mientras que `onMounted` y otros Hooks relacionados con el DOM solo se ejecutan en el Client. Esto lleva al concepto de Hydration, es decir, el proceso en el que el Client toma el control del HTML del Server.
>
> Para evitar Hydration Mismatch, debemos asegurar que el contenido del renderizado inicial del Server y del Client sea consistente. Por eso Nuxt proporciona `useState`. A diferencia del `ref` de Vue, `useState` serializa el estado y lo envía al Client, asegurando la sincronización del estado en ambos lados. Si se usa `ref` para almacenar datos generados en el Server, se producira inconsistencia cuando el Client se reinicie.
>
> Los Mismatch comunes incluyen números aleatorios, marcas de tiempo o estructuras HTML anidadas inválidas. La solución es mover el contenido variable a `onMounted` o usar el componente `<ClientOnly>`.

**Puntos clave:**
- ✅ `onMounted` solo se ejecuta en el Client
- ✅ `useState` soporta sincronización de estado SSR, `ref` no
- ✅ Causas de Hydration Mismatch (estructura, valores aleatorios) y soluciones (`<ClientOnly>`, `onMounted`)
