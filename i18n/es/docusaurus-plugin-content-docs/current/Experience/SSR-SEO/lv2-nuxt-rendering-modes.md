---
title: '[Lv2] Nuxt 3 Rendering Modes: Estrategia de selección SSR, SSG, CSR'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Comprender los Rendering Modes de Nuxt 3 y poder seleccionar la estrategia de renderizado adecuada (SSR, SSG, CSR) según los requisitos del proyecto.

---

## 1. Puntos clave para la entrevista

1. **Clasificación de Rendering Modes**: Nuxt 3 soporta cuatro modos: SSR, SSG, CSR, Hybrid Rendering
2. **Estrategia de selección**: Elegir el modo adecuado según requisitos de SEO, dinamismo del contenido y requisitos de rendimiento
3. **Experiencia de implementación**: Cómo configurar y seleccionar diferentes Rendering Modes en el proyecto

---

## 2. Introducción a los Rendering Modes de Nuxt 3

### 2.1 Cuatro Rendering Modes

Nuxt 3 soporta cuatro Rendering Modes principales:

| Modo | Nombre completo | Momento de renderizado | Escenarios de aplicación |
|------|------|---------|---------|
| **SSR** | Server-Side Rendering | Renderizado en el Server en cada solicitud | SEO + contenido dinámico necesario |
| **SSG** | Static Site Generation | HTML pre-generado en tiempo de build | SEO + contenido fijo necesario |
| **CSR** | Client-Side Rendering | Renderizado en el navegador | Sin necesidad de SEO + alta interactividad |
| **Hybrid** | Hybrid Rendering | Uso mixto de múltiples modos | Diferentes páginas con diferentes requisitos |

### 2.2 SSR (Server-Side Rendering)

**Definición:** En cada solicitud, se ejecuta JavaScript en el Server para generar HTML completo y luego enviarlo al navegador.

**Configuración:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Por defecto es true
});
```

**Flujo:**
1. El navegador solicita la página
2. El Server ejecuta JavaScript y genera HTML completo
3. Se envía el HTML al navegador
4. El navegador realiza Hydration (activación de funciones interactivas)

**Ventajas:**
- ✅ Compatible con SEO (los motores de búsqueda pueden ver el contenido completo)
- ✅ Carga inicial rápida (no es necesario esperar la ejecución de JavaScript)
- ✅ Soporte para contenido dinámico (datos actualizados en cada solicitud)

**Desventajas:**
- ❌ Mayor carga del Server (cada solicitud requiere renderizado)
- ❌ TTFB (Time To First Byte) puede ser más largo
- ❌ Requiere entorno de Server

**Escenarios de aplicación:**
- Páginas de productos de e-commerce (SEO + precios/stock dinámicos)
- Páginas de artículos de noticias (SEO + contenido dinámico)
- Páginas de perfil de usuario (SEO + contenido personalizado)

### 2.3 SSG (Static Site Generation)

**Definición:** En tiempo de build (Build Time) se pre-generan todas las páginas HTML y se despliegan como archivos estáticos.

**Configuración:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSG requiere SSR en true
  nitro: {
    prerender: {
      routes: ['/about', '/contact'], // Especificar rutas para pre-renderizar
    },
  },
});

// O usando routeRules
export default defineNuxtConfig({
  routeRules: {
    '/about': { prerender: true },
    '/contact': { prerender: true },
  },
});
```

**Flujo:**
1. Durante el build se ejecuta JavaScript y se genera HTML para todas las páginas
2. Los archivos HTML se despliegan en CDN
3. Al solicitar, el navegador recibe directamente el HTML pre-generado

**Ventajas:**
- ✅ Mejor rendimiento (caché CDN, respuesta rápida)
- ✅ Compatible con SEO (contenido HTML completo)
- ✅ Mínima carga del Server (no requiere renderizado en tiempo de ejecución)
- ✅ Bajo costo (se puede desplegar en CDN)

**Desventajas:**
- ❌ No apto para contenido dinámico (requiere rebuild para actualizar)
- ❌ El tiempo de build puede ser largo (con muchas páginas)
- ❌ No puede manejar contenido específico del usuario

**Escenarios de aplicación:**
- Página "Sobre nosotros" (contenido fijo)
- Página de descripción de producto (contenido relativamente fijo)
- Artículos de blog (no cambian frecuentemente después de publicarse)

### 2.4 CSR (Client-Side Rendering)

**Definición:** Se ejecuta JavaScript en el navegador para generar dinámicamente el contenido HTML.

**Configuración:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // Desactivar SSR globalmente
});

// O para rutas específicas
export default defineNuxtConfig({
  routeRules: {
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});

// O configurar en la página
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false,
});
</script>
```

**Flujo:**
1. El navegador solicita HTML (normalmente un shell vacío)
2. Descarga el bundle de JavaScript
3. Ejecuta JavaScript y genera contenido dinámicamente
4. Renderiza la página

**Ventajas:**
- ✅ Alta interactividad, ideal para SPA
- ✅ Reduce la carga del Server
- ✅ Transiciones de página fluidas (sin necesidad de recargar)

**Desventajas:**
- ❌ No compatible con SEO (los motores de búsqueda pueden no indexar correctamente)
- ❌ Tiempo de carga inicial más largo (necesita descargar y ejecutar JavaScript)
- ❌ Se requiere JavaScript para ver el contenido

**Escenarios de aplicación:**
- Sistemas de administración backend (no requiere SEO)
- Dashboards de usuario (no requiere SEO)
- Aplicaciones interactivas (juegos, herramientas, etc.)

### 2.5 Hybrid Rendering (Renderizado Híbrido)

**Definición:** Según los requisitos de diferentes páginas, se mezclan múltiples Rendering Modes.

**Configuración:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSR por defecto
  routeRules: {
    // Páginas que necesitan SEO: SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // Páginas con contenido fijo: SSG
    '/about': { prerender: true },
    '/contact': { prerender: true },

    // Páginas sin necesidad de SEO: CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**Ventajas:**
- ✅ Selección del modo adecuado según las características de la página
- ✅ Equilibrio entre SEO, rendimiento y experiencia de desarrollo
- ✅ Alta flexibilidad

**Escenarios de aplicación:**
- Proyectos grandes (diferentes páginas con diferentes requisitos)
- Plataformas de e-commerce (página de producto SSR, backend CSR, página sobre nosotros SSG)

### 2.6 ISR (Incremental Static Regeneration)

**Definición:** Regeneración estática incremental. Combina el rendimiento de SSG con la dinamicidad de SSR. Las páginas generan HTML estático en tiempo de build o en la primera solicitud, y se cachean durante un período (TTL). Cuando el caché expira, la siguiente solicitud regenera la página en segundo plano mientras devuelve el contenido cacheado antiguo (Stale-While-Revalidate).

**Configuración:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Habilitar ISR, cachear 1 hora (3600 segundos)
    '/blog/**': { swr: 3600 },
    // O usar la propiedad isr (soporte específico en Netlify/Vercel, etc.)
    '/products/**': { isr: 600 },
  },
});
```

**Flujo:**
1. Solicitud A llega: Server renderiza la página, la devuelve y cachea (Cache MISS -> HIT).
2. Solicitud B llega (dentro del TTL): Devuelve directamente el contenido cacheado (Cache HIT).
3. Solicitud C llega (después del TTL): Devuelve el caché antiguo (Stale), mientras regenera en segundo plano y actualiza el caché (Revalidate).
4. Solicitud D llega: Devuelve el nuevo contenido cacheado.

**Ventajas:**
- ✅ Rendimiento cercano al óptimo de SSG
- ✅ Resuelve el problema del largo tiempo de build de SSG
- ✅ El contenido puede actualizarse periódicamente

**Escenarios de aplicación:**
- Blogs grandes
- Páginas de detalle de productos de e-commerce
- Sitios de noticias

### 2.7 Route Rules y estrategias de caché

Nuxt 3 usa `routeRules` para gestionar de forma unificada el renderizado híbrido y las estrategias de caché. Esto se maneja a nivel de Nitro.

| Propiedad | Significado | Escenarios de aplicación |
|------|------|---------|
| `ssr: true` | Forzar Server-Side Rendering | SEO + alta dinamicidad |
| `ssr: false` | Forzar Client-Side Rendering (SPA) | Backend, dashboard |
| `prerender: true` | Pre-renderizar en build (SSG) | Sobre nosotros, página de términos |
| `swr: true` | Habilitar caché SWR (sin tiempo de expiración, hasta redespliegue) | Contenido con cambios mínimos |
| `swr: 60` | Habilitar ISR, cachear 60 segundos | Páginas de listados, páginas de eventos |
| `cache: { maxAge: 60 }` | Establecer header Cache-Control (caché navegador/CDN) | Recursos estáticos |

---

## 3. Estrategia de selección

### 3.1 Seleccionar Rendering Mode según requisitos

**Diagrama de decisión:**

```
¿Necesita SEO?
├─ Sí → ¿El contenido cambia frecuentemente?
│   ├─ Sí → SSR
│   └─ No → SSG
└─ No → CSR
```

**Tabla de comparación:**

| Requisito | Modo recomendado | Razón |
|------|---------|------|
| **Necesita SEO** | SSR / SSG | Los motores de búsqueda pueden ver el contenido completo |
| **Contenido cambia frecuentemente** | SSR | Obtener contenido actualizado en cada solicitud |
| **Contenido relativamente fijo** | SSG | Mejor rendimiento, menor costo |
| **No necesita SEO** | CSR | Alta interactividad, transiciones fluidas |
| **Muchas páginas** | SSG | Generadas en build, caché CDN |
| **Contenido específico del usuario** | SSR / CSR | Requiere generación dinámica |

### 3.2 Casos prácticos

#### Caso 1: Plataforma de e-commerce

**Requisitos:**
- Las páginas de productos necesitan SEO (indexación de Google)
- El contenido de productos cambia frecuentemente (precios, stock)
- Las páginas personales de usuarios no necesitan SEO

**Solución:**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // Página de producto: SSR (SEO + contenido dinámico necesario)
    '/products/**': { ssr: true },

    // Sobre nosotros: SSG (contenido fijo)
    '/about': { prerender: true },

    // Página de usuario: CSR (no necesita SEO)
    '/user/**': { ssr: false },
  },
});
```

#### Caso 2: Sitio web de blog

**Requisitos:**
- Las páginas de artículos necesitan SEO
- El contenido de los artículos es relativamente fijo (no cambia frecuentemente después de publicarse)
- Se necesita carga rápida

**Solución:**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // Página de artículo: SSG (contenido fijo + SEO necesario)
    '/articles/**': { prerender: true },

    // Página principal: SSG (contenido fijo)
    '/': { prerender: true },

    // Administración backend: CSR (no necesita SEO)
    '/admin/**': { ssr: false },
  },
});
```

---

## 4. Puntos clave para la entrevista

### 4.1 Rendering Modes de Nuxt 3

**Puedes responder así:**

> Nuxt 3 soporta cuatro Rendering Modes: SSR renderiza en el Server en cada solicitud, adecuado para páginas que necesitan SEO y contenido dinámico; SSG pre-genera HTML en tiempo de build, adecuado para páginas con SEO y contenido fijo, con el mejor rendimiento; CSR renderiza en el navegador, adecuado para páginas sin necesidad de SEO y alta interactividad; Hybrid Rendering mezcla múltiples modos, eligiendo el modo adecuado según los requisitos de cada página.

**Puntos clave:**
- ✅ Características y diferencias de los cuatro modos
- ✅ Escenarios de aplicación y consideraciones de selección
- ✅ Ventajas del Hybrid Rendering

### 4.2 ¿Cómo elegir el Rendering Mode?

**Puedes responder así:**

> La selección del Rendering Mode considera principalmente tres factores: requisitos de SEO, dinamismo del contenido y requisitos de rendimiento. Las páginas que necesitan SEO eligen SSR o SSG; el contenido que cambia frecuentemente elige SSR; el contenido fijo elige SSG; las páginas sin necesidad de SEO pueden elegir CSR. En proyectos reales se suele usar Hybrid Rendering, eligiendo el modo adecuado según las características de cada página. Por ejemplo, en una plataforma de e-commerce, las páginas de producto usan SSR (SEO + contenido dinámico), la página sobre nosotros usa SSG (contenido fijo), y las páginas personales de usuarios usan CSR (sin necesidad de SEO).

**Puntos clave:**
- ✅ Selección basada en requisitos de SEO, dinamismo del contenido y rendimiento
- ✅ Uso mixto de múltiples modos en proyectos reales
- ✅ Explicación con casos concretos

### 4.3 ISR y Route Rules
**Q: ¿Cómo se implementa ISR (Incremental Static Regeneration)? ¿Cuáles son los mecanismos de caching de Nuxt 3?**

> **Ejemplo de respuesta:**
> En Nuxt 3, podemos implementar ISR a través de `routeRules`.
> Simplemente configurando `{ swr: segundos }` en `nuxt.config.ts`, Nitro habilitará automáticamente el mecanismo Stale-While-Revalidate.
> Por ejemplo, `'/blog/**': { swr: 3600 }` significa que las páginas bajo esa ruta se cachearán durante 1 hora.
> `routeRules` es muy potente, permitiendo configurar diferentes estrategias para diferentes rutas: algunas páginas usan SSR, otras SSG (`prerender: true`), otras ISR (`swr`), y otras CSR (`ssr: false`), esa es la esencia del Hybrid Rendering.

---

## 5. Mejores prácticas

### 5.1 Principios de selección

1. **Páginas que necesitan SEO**
   - Contenido fijo → SSG
   - Contenido dinámico → SSR

2. **Páginas sin necesidad de SEO**
   - Alta interactividad → CSR
   - Necesita lógica del Server → SSR

3. **Estrategia mixta**
   - Elegir el modo adecuado según las características de la página
   - Gestión unificada con `routeRules`

### 5.2 Recomendaciones de configuración

1. **Usar SSR por defecto**
   - Asegurar compatibilidad con SEO
   - Se puede ajustar posteriormente para páginas específicas

2. **Gestión unificada con routeRules**
   - Configuración centralizada, fácil mantenimiento
   - Identificación clara del modo de renderizado de cada página

3. **Revisión y optimización periódica**
   - Ajustar según el uso real
   - Monitorear métricas de rendimiento

---

## 6. Resumen para la entrevista

**Puedes responder así:**

> Nuxt 3 soporta cuatro Rendering Modes: SSR, SSG, CSR y Hybrid Rendering. SSR es adecuado para páginas con SEO y contenido dinámico; SSG es adecuado para páginas con SEO y contenido fijo, con el mejor rendimiento; CSR es adecuado para páginas sin SEO y alta interactividad. La selección considera principalmente requisitos de SEO, dinamismo del contenido y rendimiento. En proyectos reales se suele usar Hybrid Rendering, eligiendo el modo adecuado según las características de cada página. Por ejemplo, en una plataforma de e-commerce, las páginas de producto usan SSR, la página sobre nosotros usa SSG, y las páginas de usuario usan CSR.

**Puntos clave:**
- ✅ Características y diferencias de los cuatro Rendering Modes
- ✅ Estrategia de selección y factores de evaluación
- ✅ Experiencia de implementación con Hybrid Rendering
- ✅ Casos de proyectos reales

---

## 7. Reference

- [Nuxt 3 Rendering Modes](https://nuxt.com/docs/guide/concepts/rendering)
- [Nuxt 3 Route Rules](https://nuxt.com/docs/api/nuxt-config#routerules)
