---
title: '[Lv3] Retos de implementacion SSR y soluciones'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> Problemas comunes en SSR y soluciones practicas: Hydration Mismatch, variables de entorno, compatibilidad de librerias, rendimiento y arquitectura de despliegue.

---

## Escenario de entrevista

**Pregunta: Que problemas encontraste al implementar SSR y como los resolviste?**

Que quiere validar el entrevistador:

1. **Experiencia real**: si implementaste SSR en un entorno real.
2. **Metodo de resolucion**: como detectas causa raiz y priorizas.
3. **Profundidad tecnica**: rendering, hydration, cache, despliegue.
4. **Buenas practicas**: soluciones mantenibles y medibles.

---

## Reto 1: Hydration Mismatch

### Problema

Mensaje comun:

```text
[Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
```

Causas frecuentes:

- Render diferente entre servidor y cliente
- Uso de APIs solo navegador en ruta SSR (`window`, `document`, `localStorage`)
- Valores no deterministas (`Date.now()`, `Math.random()`)

### Soluciones

#### Opcion A: encapsular con `ClientOnly`

```vue
<template>
  <div>
    <h1>Contenido SSR</h1>
    <ClientOnly>
      <BrowserOnlyComponent />
      <template #fallback>
        <div>Cargando...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

#### Opcion B: guardas en cliente

```vue
<script setup lang="ts">
const ua = ref('');

onMounted(() => {
  if (process.client) {
    ua.value = window.navigator.userAgent;
  }
});
</script>
```

**Idea clave de entrevista:** salida SSR determinista; toda logica browser-only aislada en cliente.

---

## Reto 2: Variables de entorno

### Problema

- Secretos de servidor expuestos accidentalmente al cliente.
- Uso desordenado de `process.env` complica trazabilidad.

### Solucion

Separar con runtime config:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
});
```

```ts
// uso
const config = useRuntimeConfig();
const apiBase = config.public.apiBase; // cliente + servidor
const secret = config.apiSecret; // solo servidor
```

**Idea clave:** secretos solo en servidor, valores publicos en bloque `public`.

---

## Reto 3: Librerias de terceros sin soporte SSR

### Problema

- Algunas librerias tocan DOM durante SSR.
- Resultado: errores de build/runtime o hydration inconsistente.

### Soluciones

1. Cargar libreria solo en cliente (plugin `.client.ts`)
2. Import dinamico en contexto cliente
3. Evaluar alternativa SSR-friendly

```ts
let chartLib: any;
if (process.client) {
  chartLib = await import('chart.js/auto');
}
```

**Idea clave:** primero aislar causa, luego aplicar client-isolation o cambiar libreria.

---

## Reto 4: Manejo de cookies y headers

### Problema

- SSR con auth requiere leer cookies en servidor.
- Headers deben mantenerse consistentes entre cliente, SSR y API.

### Solucion

```ts
const token = useCookie('access_token');

const { data } = await useFetch('/api/me', {
  headers: process.server
    ? useRequestHeaders(['cookie'])
    : undefined,
  credentials: 'include',
});
```

**Idea clave:** una request SSR no debe perder contexto de autenticacion.

---

## Reto 5: Timing en carga asincrona

### Problema

- Multiples componentes piden el mismo recurso.
- Hay requests duplicados y estados de carga inconsistentes.

### Solucion

- Definir keys unificados para deduplication
- Centralizar acceso a datos en composables
- Separar carga inicial y acciones de usuario

```ts
const { data, refresh } = await useFetch('/api/products', {
  key: 'products-list',
  lazy: false,
  server: true,
});
```

**Idea clave:** centralizar flujo de datos en vez de repetir fetch por componente.

---

## Reto 6: Rendimiento y carga de servidor

### Problema

- SSR incrementa CPU e I/O.
- Bajo carga, TTFB empeora.

### Soluciones

1. Nitro cache
2. Optimizar queries a DB
3. Dividir SSR/CSR por necesidad SEO
4. Poner CDN correctamente

```ts
export default defineCachedEventHandler(
  async () => await getProductsFromDB(),
  { maxAge: 60 * 10, swr: true },
);
```

**Idea clave:** performance es tema de arquitectura, no solo de componente frontend.

---

## Reto 7: Error handling y 404

### Problema

- IDs dinamicos invalidos.
- Sin semantica 404 correcta, SEO indexa paginas invalidas.

### Solucion

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}
```

Adicional:

- `error.vue` para UX de error clara
- En error page usar `noindex, nofollow`

**Idea clave:** status HTTP, UX y SEO deben ser consistentes.

---

## Reto 8: APIs solo de navegador

### Problema

- En SSR no existe `window` ni `document`.
- Acceso directo rompe en runtime.

### Solucion

```ts
const width = ref<number | null>(null);

onMounted(() => {
  width.value = window.innerWidth;
});
```

O con guarda:

```ts
if (process.client) {
  localStorage.setItem('theme', 'dark');
}
```

**Idea clave:** APIs de navegador solo en fases cliente bien acotadas.

---

## Reto 9: Memory leak en servidor

### Problema

- Proceso Node de larga vida crece en memoria.
- Causas: estado global mutable, timers/listeners sin limpieza.

### Soluciones

1. Evitar estado global por request
2. Limpiar listeners/intervals
3. Observar con heap snapshots y `process.memoryUsage()`

```ts
setInterval(() => {
  const mem = process.memoryUsage();
  console.log('rss', mem.rss);
}, 60_000);
```

**Idea clave:** un leak en SSR es riesgo operativo y tambien de seguridad.

---

## Reto 10: Scripts de ads y tracking

### Problema

- Scripts de terceros bloquean main thread o rompen hydration.
- CLS/FID/INP empeoran.

### Solucion

- Cargar scripts de forma asincrona y tardia
- Reservar espacio para ads para evitar layout shift
- No depender de tracking para UI critica

```ts
useHead({
  script: [
    { src: 'https://example.com/tracker.js', async: true, tagPosition: 'bodyClose' },
  ],
});
```

**Idea clave:** monetizacion no puede degradar estabilidad de rendering.

---

## Reto 11: Arquitectura de despliegue (SSR vs SPA)

### Problema

- SPA se despliega como estatico y es simple.
- SSR necesita capa de computo, observabilidad y gestion de procesos.

### Comparacion

| Aspecto        | SPA (Static)         | SSR (Node/Edge)                  |
| -------------- | -------------------- | -------------------------------- |
| Infraestructura| Storage + CDN        | Compute + CDN                    |
| Operacion      | Muy simple           | Complejidad media                |
| Costo          | Bajo                 | Mas alto por tiempo de computo   |
| Monitoreo      | Minimo               | Logs, metrics, memory, cold start|

### Recomendaciones

1. PM2 o containers para estabilidad
2. CDN y Cache-Control bien configurados
3. Staging con pruebas de carga antes de produccion
4. Definir error budget y alerting

**Idea clave:** SSR no es solo render; tambien es arquitectura operativa.

---

## Resumen para entrevista

**Respuesta posible (30-45 segundos):**

> En SSR suelo dividir los riesgos en cuatro grupos: rendering determinista para evitar hydration mismatch, separacion estricta entre configuracion de servidor y cliente, optimizacion de performance con deduplication/cache/splitting, y operacion robusta con manejo de errores, monitoreo de memoria y arquitectura de despliegue adecuada.

**Checklist:**
- ✅ Mencionar un problema concreto con causa
- ✅ Explicar contramedidas tecnicas
- ✅ Conectar impacto en SEO/performance/operacion
- ✅ Cerrar con contexto real de proyecto
