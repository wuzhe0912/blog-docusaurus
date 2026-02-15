---
title: '[Lv3] Optimizacion de rendimiento en Nuxt 3: Bundle Size, velocidad SSR y optimizacion de imagenes'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Guia completa de optimizacion de rendimiento en Nuxt 3: Desde la reduccion del Bundle Size, optimizacion de velocidad SSR hasta estrategias de carga de imagenes para lograr una experiencia de rendimiento excepcional.

---

## 1. Ejes principales de la respuesta

1. **Optimizacion de Bundle Size**: Analisis (`nuxi analyze`), division (`SplitChunks`), Tree Shaking, Lazy Loading.
2. **Optimizacion de velocidad SSR (TTFB)**: Cache Redis, Nitro Cache, reduccion de llamadas API bloqueantes, Streaming SSR.
3. **Optimizacion de imagenes**: `@nuxt/image`, formato WebP, CDN, Lazy Loading.
4. **Optimizacion de grandes volumenes de datos**: Virtual Scrolling, Infinite Scroll, Pagination.

---

## 2. Como reducir el Bundle Size de Nuxt 3?

### 2.1 Herramientas de diagnostico

Primero, es necesario saber donde esta el cuello de botella. Usa `nuxi analyze` para visualizar la estructura del Bundle.

```bash
npx nuxi analyze
```

Esto genera un reporte que muestra que paquetes ocupan mas espacio.

### 2.2 Estrategias de optimizacion

#### 1. Code Splitting
Nuxt 3 ya realiza Code Splitting basado en rutas por defecto. Pero para paquetes grandes (como ECharts, Lodash), necesitamos optimizacion manual.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lodash')) return 'lodash';
              if (id.includes('echarts')) return 'echarts';
            }
          },
        },
      },
    },
  },
});
```

#### 2. Tree Shaking e importacion bajo demanda

```typescript
// ❌ Incorrecto: Importar todo lodash
import _ from 'lodash';
_.debounce(() => {}, 100);

// ✅ Correcto: Solo importar debounce
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// ✅ Recomendado: Usar vueuse (especifico para Vue y Tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. Lazy Loading de componentes

```vue
<template>
  <div>
    <!-- Solo carga el codigo del componente cuando show es true -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. Eliminar paquetes innecesarios del lado del servidor
Asegurar que los paquetes solo usados en el servidor (drivers de base de datos, operaciones fs) no se empaqueten en el cliente.

---

## 3. Como optimizar la velocidad SSR (TTFB)?

### 3.1 Por que el TTFB es muy largo?
TTFB (Time To First Byte) es el indicador clave de rendimiento SSR. Las causas comunes son:
1. **APIs lentas**: El servidor debe esperar la respuesta de la API para renderizar HTML.
2. **Solicitudes seriales**: Multiples solicitudes API se ejecutan secuencialmente en lugar de en paralelo.
3. **Calculos pesados**: Demasiadas tareas intensivas de CPU en el servidor.

### 3.2 Soluciones de optimizacion

#### 1. Server-Side Caching (Nitro Cache)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { swr: 3600 }, // Cache de 1 hora
    '/products/**': { swr: 600 }, // Cache de 10 minutos
    '/api/**': { cache: { maxAge: 60 } },
  },
});
```

#### 2. Solicitudes paralelas (Parallel Fetching)

```typescript
// ❌ Lento: Ejecucion serial (tiempo total = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// ✅ Rapido: Ejecucion paralela (tiempo total = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. Carga diferida de datos no criticos

```typescript
// Los comentarios no necesitan SEO, se pueden cargar en el cliente
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false,
});
```

#### 4. Streaming SSR (Experimental)
Nuxt 3 soporta HTML Streaming, permite renderizar y enviar al mismo tiempo para que el usuario vea contenido mas rapido.

---

## 4. Optimizacion de imagenes en Nuxt 3

### 4.1 Uso de @nuxt/image
El modulo oficial `@nuxt/image` es la mejor solucion:
- **Conversion automatica de formato**: Conversion automatica a WebP/AVIF.
- **Escalado automatico**: Genera imagenes del tamano adecuado segun la pantalla.
- **Lazy Loading**: Lazy loading integrado.
- **Integracion CDN**: Soporte para Cloudinary, Imgix y otros providers.

### 4.2 Ejemplo de implementacion

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    format: ['webp'],
  },
});
```

```vue
<template>
  <NuxtImg
    src="/hero.jpg"
    format="webp"
    width="300"
    loading="lazy"
    placeholder
  />
</template>
```

---

## 5. Paginacion y scroll para grandes volumenes de datos

### 5.1 Seleccion de solucion
Para grandes volumenes de datos (como 10,000 productos), hay tres estrategias principales, considerando **SEO**:

| Estrategia | Escenario adecuado | Compatibilidad SEO |
| :--- | :--- | :--- |
| **Paginacion tradicional** | Listas de e-commerce, articulos | La mejor |
| **Scroll infinito** | Feeds sociales, galerias de fotos | Requiere tratamiento especial |
| **Virtual Scroll** | Reportes complejos, listas muy largas | Contenido no esta en el DOM |

### 5.2 Como mantener el SEO con scroll infinito?

1. **Combinar con paginacion**: Proporcionar tags `<link rel="next" href="...">`.
2. **Noscript Fallback**: Proporcionar una version de paginacion tradicional en `<noscript>`.
3. **Boton Load More**: Renderizar las primeras 20 entradas con SSR, luego cargar mas con Client-side fetch.

### 5.3 Ejemplo de implementacion (Load More + SEO)

```vue
<script setup>
const page = ref(1);
const { data: posts } = await useFetch('/api/posts', {
  query: { page: page.value }
});

const loadMore = async () => {
  page.value++;
  const newPosts = await $fetch('/api/posts', {
      query: { page: page.value }
  });
  posts.value.push(...newPosts);
};
</script>

<template>
  <div>
    <div v-for="post in posts" :key="post.id">{{ post.title }}</div>
    <button @click="loadMore">Cargar mas</button>

    <Head>
      <Link rel="next" :href="`/posts?page=${page + 1}`" />
    </Head>
  </div>
</template>
```

---

## 6. Lazy Loading en entorno SSR

### 6.1 Descripcion del problema
En entornos SSR, si se usa `IntersectionObserver` para implementar Lazy Loading, como el servidor no tiene `window` ni `document`, se produciran errores o Hydration Mismatch.

### 6.2 Soluciones

#### 1. Usar componentes integrados de Nuxt
- `<LazyComponent>`
- `<NuxtImg loading="lazy">`

#### 2. Directive personalizado (necesita manejar SSR)

```typescript
// plugins/lazy-load.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value;
          observer.disconnect();
        }
      });
      observer.observe(el);
    },
    getSSRProps(binding) {
      return { src: 'placeholder.png' };
    }
  });
});
```

---

## 7. Monitoreo y seguimiento del rendimiento SSR

### 7.1 Por que es necesario el monitoreo?
Los cuellos de botella de rendimiento de aplicaciones SSR suelen ocurrir en el servidor, invisibles para DevTools del navegador.

### 7.2 Herramientas comunes

1. **Nuxt DevTools (Desarrollo)**: Integrado en Nuxt 3, monitorea tiempos de respuesta de Server Routes.
2. **Lighthouse / PageSpeed Insights (Post-despliegue)**: Monitorea Core Web Vitals (LCP, CLS, FID/INP).
3. **Server-Side Monitoring (APM)**: **Sentry / Datadog** para seguimiento de errores y rendimiento del servidor.

### 7.3 Implementacion simple de seguimiento de tiempo

```typescript
// server/middleware/timing.ts
export default defineEventHandler((event) => {
  const start = performance.now();

  event.node.res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[${event.method}] ${event.path} - ${duration.toFixed(2)}ms`);
  });
});
```

---

## 8. Resumen para entrevistas

**P: Como rastrear y monitorear problemas de rendimiento SSR?**
> En desarrollo uso **Nuxt DevTools**. En produccion, me enfoco en **Core Web Vitals** (especialmente LCP) y **TTFB**. Para rastreo profundo, uso Server Middleware personalizado o integro **Sentry** / **OpenTelemetry**.

**P: Como reducir el Bundle Size de Nuxt 3?**
> Primero analizo con `nuxi analyze`. Aplico Tree Shaking o division manual (`manualChunks`) a paquetes grandes. Para componentes no criticos, uso `<LazyComponent>`.

**P: Como optimizar la velocidad SSR?**
> La clave es reducir TTFB. Configuro Server-side caching (SWR) con `routeRules` de Nitro. Las solicitudes API se paralelizan con `Promise.all`. Los datos no criticos se mueven al cliente con `lazy: true`.

**P: Como se optimizan las imagenes?**
> Uso el modulo `@nuxt/image`, que convierte automaticamente a WebP, escala automaticamente y soporta Lazy Loading.

**P: Como mantener el SEO con scroll infinito?**
> El scroll infinito no es amigable con SEO. Para sitios de contenido, prefiero paginacion tradicional. Si es necesario el scroll infinito, renderizo la primera pagina con SSR y uso Meta Tags (`rel="next"`) para indicar la estructura de paginacion a los crawlers.
