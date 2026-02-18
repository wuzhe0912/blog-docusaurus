---
title: '[Lv3] Optimización de rendimiento en Nuxt 3: Bundle Size, velocidad SSR y optimización de imágenes'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Guia completa de optimización de rendimiento en Nuxt 3: Desde la reducción del Bundle Size, optimización de velocidad SSR hasta estrategias de carga de imágenes para lograr una experiencia de rendimiento excepcional.

---

## 1. Ejes principales de la respuesta

1. **Optimización de Bundle Size**: Analisis (`nuxi analyze`), división (`SplitChunks`), Tree Shaking, Lazy Loading.
2. **Optimización de velocidad SSR (TTFB)**: Cache Redis, Nitro Cache, reducción de llamadas API bloqueantes, Streaming SSR.
3. **Optimización de imágenes**: `@nuxt/image`, formato WebP, CDN, Lazy Loading.
4. **Optimización de grandes volúmenes de datos**: Virtual Scrolling, Infinite Scroll, Pagination.

---

## 2. Cómo reducir el Bundle Size de Nuxt 3?

### 2.1 Herramientas de diagnóstico

Primero, es necesario saber dónde esta el cuello de botella. Usa `nuxi analyze` para visualizar la estructura del Bundle.

```bash
npx nuxi analyze
```

Esto genera un reporte que muestra qué paquetes ocupan más espacio.

### 2.2 Estrategias de optimización

#### 1. Code Splitting
Nuxt 3 ya realiza Code Splitting basado en rutas por defecto. Pero para paquetes grandes (como ECharts, Lodash), necesitamos optimización manual.

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

// ✅ Recomendado: Usar vueuse (específico para Vue y Tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. Lazy Loading de componentes

```vue
<template>
  <div>
    <!-- Solo carga el código del componente cuando show es true -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. Eliminar paquetes innecesarios del lado del servidor
Asegurar que los paquetes solo usados en el servidor (drivers de base de datos, operaciones fs) no se empaqueten en el cliente.

---

## 3. Cómo optimizar la velocidad SSR (TTFB)?

### 3.1 Por que el TTFB es muy largo?
TTFB (Time To First Byte) es el indicador clave de rendimiento SSR. Las causas comunes son:
1. **APIs lentas**: El servidor debe esperar la respuesta de la API para renderizar HTML.
2. **Solicitudes seriales**: Múltiples solicitudes API se ejecutan secuencialmente en lugar de en paralelo.
3. **Calculos pesados**: Demasiadas tareas intensivas de CPU en el servidor.

### 3.2 Soluciones de optimización

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
// ❌ Lento: Ejecución serial (tiempo total = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// ✅ Rápido: Ejecución paralela (tiempo total = Max(A, B))
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
Nuxt 3 soporta HTML Streaming, permite renderizar y enviar al mismo tiempo para que el usuario vea contenido más rápido.

---

## 4. Optimización de imágenes en Nuxt 3

### 4.1 Uso de @nuxt/image
El modulo oficial `@nuxt/image` es la mejor solución:
- **Conversión automática de formato**: Conversión automática a WebP/AVIF.
- **Escalado automático**: Genera imágenes del tamaño adecuado según la pantalla.
- **Lazy Loading**: Lazy loading integrado.
- **Integración CDN**: Soporte para Cloudinary, Imgix y otros providers.

### 4.2 Ejemplo de implementación

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

## 5. Paginación y scroll para grandes volúmenes de datos

### 5.1 Selección de solución
Para grandes volúmenes de datos (como 10,000 productos), hay tres estrategias principales, considerando **SEO**:

| Estrategia | Escenario adecuado | Compatibilidad SEO |
| :--- | :--- | :--- |
| **Paginación tradicional** | Listas de e-commerce, articulos | La mejor |
| **Scroll infinito** | Feeds sociales, galerias de fotos | Requiere tratamiento especial |
| **Virtual Scroll** | Reportes complejos, listas muy largas | Contenido no esta en el DOM |

### 5.2 Cómo mantener el SEO con scroll infinito?

1. **Combinar con paginación**: Proporcionar tags `<link rel="next" href="...">`.
2. **Noscript Fallback**: Proporcionar una versión de paginación tradicional en `<noscript>`.
3. **Boton Load More**: Renderizar las primeras 20 entradas con SSR, luego cargar más con Client-side fetch.

### 5.3 Ejemplo de implementación (Load More + SEO)

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

### 6.1 Descripción del problema
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

### 7.1 Por qué es necesario el monitoreo?
Los cuellos de botella de rendimiento de aplicaciones SSR suelen ocurrir en el servidor, invisibles para DevTools del navegador.

### 7.2 Herramientas comunes

1. **Nuxt DevTools (Desarrollo)**: Integrado en Nuxt 3, monitorea tiempos de respuesta de Server Routes.
2. **Lighthouse / PageSpeed Insights (Post-despliegue)**: Monitorea Core Web Vitals (LCP, CLS, FID/INP).
3. **Server-Side Monitoring (APM)**: **Sentry / Datadog** para seguimiento de errores y rendimiento del servidor.

### 7.3 Implementación simple de seguimiento de tiempo

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

**P: Cómo rastrear y monitorear problemas de rendimiento SSR?**
> En desarrollo uso **Nuxt DevTools**. En produccion, me enfoco en **Core Web Vitals** (especialmente LCP) y **TTFB**. Para rastreo profundo, uso Server Middleware personalizado o integro **Sentry** / **OpenTelemetry**.

**P: Cómo reducir el Bundle Size de Nuxt 3?**
> Primero analizo con `nuxi analyze`. Aplico Tree Shaking o división manual (`manualChunks`) a paquetes grandes. Para componentes no criticos, uso `<LazyComponent>`.

**P: Cómo optimizar la velocidad SSR?**
> La clave es reducir TTFB. Configuro Server-side caching (SWR) con `routeRules` de Nitro. Las solicitudes API se paralelizan con `Promise.all`. Los datos no criticos se mueven al cliente con `lazy: true`.

**P: Cómo se optimizan las imágenes?**
> Uso el modulo `@nuxt/image`, que convierte automáticamente a WebP, escala automáticamente y soporta Lazy Loading.

**P: Cómo mantener el SEO con scroll infinito?**
> El scroll infinito no es amigable con SEO. Para sitios de contenido, prefiero paginación tradicional. Si es necesario el scroll infinito, renderizo la primera página con SSR y uso Meta Tags (`rel="next"`) para indicar la estructura de paginación a los crawlers.
