---
title: '[Lv2] Funcionalidades de Nuxt 3 Server: Server Routes y Sitemap dinámico'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Dominar las funcionalidades del Nitro Server Engine de Nuxt 3, implementar Server Routes (API Routes), Sitemap dinámico y Robots.txt para mejorar el SEO y la flexibilidad arquitectonica del sitio web.

---

## 1. Puntos clave de respuesta en entrevista

1.  **Server Routes (API Routes)**: Usar `server/api` o `server/routes` para construir lógica backend. Comumente usado para ocultar API Keys, manejar CORS, arquitectura BFF (Backend for Frontend).
2.  **Sitemap dinámico**: Generar XML dinámicamente a través de Server Routes (`server/routes/sitemap.xml.ts`), asegurando que los motores de búsqueda puedan indexar el contenido más reciente.
3.  **Robots.txt**: Igualmente generado dinámicamente a través de Server Routes, o configurado via Nuxt Config, para controlar los permisos de acceso de los crawlers.

---

## 2. Nuxt 3 Server Engine: Nitro

### 2.1 Qué es Nitro?

Nitro es el nuevo motor de servidor de Nuxt 3, que permite desplegar aplicaciones Nuxt en cualquier lugar (Universal Deployment). No es solo un servidor, sino una poderosa herramienta de compilación y tiempo de ejecución.

### 2.2 Características principales de Nitro

1.  **Despliegue multiplataforma (Universal Deployment)**:
    Se puede compilar a Node.js server, Serverless Functions (Vercel, AWS Lambda, Netlify), Service Workers y otros formatos. Despliegue zero-config en las principales plataformas.

2.  **Ligero y rápido (Lightweight & Fast)**:
    Tiempo de cold start extremadamente corto y bundle size generado muy pequeño (mínimo < 1MB).

3.  **División automática de código (Auto Code Splitting)**:
    Analiza automáticamente las dependencias de los Server Routes y realiza code splitting para asegurar la velocidad de inicio.

4.  **HMR (Hot Module Replacement)**:
    No solo el frontend tiene HMR, Nitro permite que el desarrollo de API backend también disfrute de HMR. Modificar archivos `server/` sin reiniciar el servidor.

5.  **Storage Layer (Unstorage)**:
    API de Storage unificada integrada, que permite conectar fácilmente con Redis, GitHub, FS, Memory y otras interfaces de almacenamiento.

6.  **Server Assets**:
    Acceso conveniente a archivos de recursos estáticos en el Server.

---

## 3. Nuxt 3 Server Routes (API Routes)

### 3.1 Qué son los Server Routes?

Nuxt 3 tiene integrado el motor de servidor **Nitro**, que permite a los desarrolladores escribir APIs backend directamente en el proyecto. Estos archivos se colocan en los directorios `server/api` o `server/routes`, y se mapean automáticamente como API endpoints.

- `server/api/hello.ts` -> `/api/hello`
- `server/routes/hello.ts` -> `/hello`

### 2.2 En qué situaciones se usan? (Pregunta común de entrevista)

**1. Ocultar información sensible (Secret Management)**
El frontend no puede almacenar Private API Keys de forma segura. Usando Server Routes como intermediario, se puede acceder a la Key mediante variables de entorno en el Server, devolviendo solo el resultado al frontend.

```typescript
// server/api/weather.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // API Key solo se usa en el Server, no se expone al Client
  const data = await $fetch(
    `https://api.weather.com/v1?key=${config.weatherApiKey}`
  );
  return data;
});
```

**2. Manejo de problemas de CORS (Proxy)**
Cuando una API externa no soporta CORS, se pueden usar Server Routes como Proxy. El navegador solicita al Nuxt Server (mismo origen), y el Nuxt Server solicita a la API externa (sin restricciones CORS).

**3. Backend for Frontend (BFF)**
Agregar, filtrar o transformar datos de múltiples APIs backend en el Nuxt Server, devolviendolos al frontend de una vez. Reduce la cantidad de solicitudes del frontend y el tamaño del Payload.

**4. Manejo de Webhooks**
Recibir notificaciones Webhook de servicios de terceros (como pagos, CMS).

---

## 4. Implementación de Sitemap dinámico

### 3.1 Por que se necesita un Sitemap dinámico?

Para sitios web con contenido que cambia frecuentemente (como e-commerce, noticias), un `sitemap.xml` generado estaticamente se vuelve obsoleto rápidamente. Usando Server Routes se puede generar dinámicamente el Sitemap más reciente en cada solicitud.

### 3.2 Método de implementación: Generación manual

Crear `server/routes/sitemap.xml.ts`:

```typescript
// server/routes/sitemap.xml.ts
import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // 1. Obtener todos los datos de rutas dinámicas desde la base de datos o API
  const posts = await $fetch('https://api.example.com/posts');

  const sitemap = new SitemapStream({
    hostname: 'https://example.com',
  });

  // 2. Agregar páginas estáticas
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

  // 3. Agregar páginas dinámicas
  posts.forEach((post) => {
    sitemap.write({
      url: `/posts/${post.id}`,
      changefreq: 'weekly',
      lastmod: post.updatedAt,
    });
  });

  sitemap.end();

  // 4. Configurar Header y devolver XML
  setHeader(event, 'content-type', 'application/xml');
  return streamToPromise(sitemap);
});
```

### 3.3 Método de implementación: Usando módulo (`@nuxtjs/sitemap`)

Para requisitos estándar, se recomienda usar el módulo oficial:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    siteUrl: 'https://example.com',
    sources: [
      '/api/sitemap-urls', // Especificar una API para proporcionar la lista de URLs dinámicas
    ],
  },
});
```

---

## 5. Implementación de Robots.txt dinámico

### 4.1 Método de implementación

Crear `server/routes/robots.txt.ts`:

```typescript
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProduction = config.public.siteEnv === 'production';

  // Determinar reglas dinámicamente según el entorno
  const robots = isProduction
    ? `User-agent: *
Disallow: /admin
Disallow: /private
Sitemap: https://example.com/sitemap.xml`
    : `User-agent: *
Disallow: /`; // Prohibir indexación en entornos no productivos

  setHeader(event, 'content-type', 'text/plain');
  return robots;
});
```

---

## 6. Puntos clave para la entrevista

### 5.1 Nitro Engine & Server Routes

**Q: Cuál es el server engine de Nuxt 3? Cuáles son las características de Nitro?**

> **Ejemplo de respuesta:**
> El server engine de Nuxt 3 se llama **Nitro**.
> Su mayor característica es **Universal Deployment**, lo que significa que se puede desplegar sin configuración en cualquier entorno (Node.js, Vercel, AWS Lambda, Edge Workers, etc.).
> Otras características incluyen: **HMR** para APIs backend (sin reinicio al modificar), **Auto Code Splitting** (acelerando la velocidad de inicio), y un **Storage Layer** integrado (fácil conexión con Redis o KV Storage).

**Q: Qué son los Server Routes de Nuxt 3? Los has implementado?**

> **Ejemplo de respuesta:**
> Si, los he implementado. Los Server Routes son funcionalidades backend que Nuxt 3 proporciona a través del motor Nitro, ubicados en el directorio `server/api`.
> Los he usado principalmente en estos escenarios:
>
> 1.  **Ocultar API Keys**: Al integrar servicios de terceros, evitando exponer Secret Keys en el código frontend.
> 2.  **CORS Proxy**: Resolviendo problemas de solicitudes entre origenes.
> 3.  **BFF (Backend for Frontend)**: Consolidando múltiples solicitudes API en una, reduciendo solicitudes del frontend y optimizando la estructura de datos.

### 5.2 Sitemap y Robots.txt

**Q: Cómo implementar sitemap y robots.txt dinámicos en Nuxt 3?**

> **Ejemplo de respuesta:**
> Usaría los Server Routes de Nuxt para implementarlos.
> Para el **Sitemap**, crearia `server/routes/sitemap.xml.ts`, llamando a la API backend para obtener la lista más reciente de artículos o productos, luego usando el paquete `sitemap` para generar la cadena XML y devolverla. Esto asegura que los motores de búsqueda obtengan los enlaces más recientes cada vez que rastrean.
> Para **Robots.txt**, crearia `server/routes/robots.txt.ts`, devolviendo dinámicamente diferentes reglas según las variables de entorno (Production o Staging), por ejemplo, configurando `Disallow: /` en el entorno Staging para prevenir la indexación.

### 5.3 SEO Meta Tags (complemento)

**Q: Cómo manejas los SEO meta tags de Nuxt 3? Has usado useHead o useSeoMeta?**

> **Ejemplo de respuesta:**
> Principalmente uso los Composables `useHead` y `useSeoMeta` integrados en Nuxt 3.
> `useHead` me permite definir etiquetas `title`, `meta`, `link`, etc. Para configuración SEO pura, prefiero usar `useSeoMeta` porque su sintaxis es más concisa y tiene Type-safe (sugerencias de tipo), como configurar directamente propiedades `ogTitle`, `description`, etc.
> En páginas dinámicas (como páginas de productos), paso una Getter Function (por ejemplo `title: () => product.value.name`), para que cuando los datos se actualicen, los Meta Tags también se actualicen reactivamente.

---

## 7. References relacionadas

- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt SEO Module](https://nuxtseo.com/)
