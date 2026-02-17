---
title: '[Lv3] Nuxt 3 Multilenguaje (i18n) y mejores practicas de SEO'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> Implementar multilenguaje (Internationalization) bajo una arquitectura SSR no solo implica traducir texto, sino tambien estrategias de enrutamiento, etiquetas SEO (hreflang), gestion de estado y consistencia de Hydration.

---

## 1. Puntos clave de respuesta en entrevista

1.  **Estrategia de enrutamiento**: Usar la estrategia de prefijo URL de `@nuxtjs/i18n` (como `/en/about`, `/jp/about`) para distinguir idiomas. Esto es lo mas amigable para SEO.
2.  **Etiquetas SEO**: Asegurar la generacion automatica correcta de `<link rel="alternate" hreflang="..." />` y Canonical URL, evitando penalizaciones por contenido duplicado.
3.  **Gestion de estado**: Detectar correctamente el idioma del usuario en la fase SSR (Cookie/Header) y asegurar que el idioma sea consistente durante la Hydration del Client.

---

## 2. Estrategia de implementacion de i18n en Nuxt 3

### 2.1 Por que elegir `@nuxtjs/i18n`?

El modulo oficial `@nuxtjs/i18n` esta basado en `vue-i18n`, optimizado especificamente para Nuxt. Resuelve los problemas comunes de implementar i18n manualmente:

- Generacion automatica de rutas con prefijo de idioma (Auto-generated routes).
- Manejo automatico de SEO Meta Tags (hreflang, og:locale).
- Soporte para Lazy Loading de paquetes de idiomas (optimizacion del Bundle Size).

### 2.2 Instalacion y configuracion

```bash
npm install @nuxtjs/i18n
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'tw', iso: 'zh-TW', file: 'tw.json', name: '繁體中文' },
    ],
    defaultLocale: 'tw',
    lazy: true, // Habilitar Lazy Loading
    langDir: 'locales', // Directorio de archivos de idioma
    strategy: 'prefix_and_default', // Estrategia de enrutamiento clave
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // Solo detectar y redirigir en la ruta raiz
    },
  },
});
```

### 2.3 Estrategia de enrutamiento (Routing Strategy)

Esta es la clave para SEO. `@nuxtjs/i18n` ofrece varias estrategias:

1.  **prefix_except_default** (recomendado):

    - El idioma predeterminado (tw) sin prefijo: `example.com/about`
    - Otros idiomas (en) con prefijo: `example.com/en/about`
    - Ventaja: URL limpia, peso SEO concentrado.

2.  **prefix_and_default**:

    - Todos los idiomas con prefijo: `example.com/tw/about`, `example.com/en/about`
    - Ventaja: Estructura uniforme, facil manejo de redireccionamientos.

3.  **no_prefix** (no recomendado para SEO):
    - Todos los idiomas con la misma URL, cambio por Cookie.
    - Desventaja: Los motores de busqueda no pueden indexar las diferentes versiones de idioma.

---

## 3. Implementacion clave de SEO

### 3.1 Etiqueta hreflang

Los motores de busqueda necesitan saber "que versiones de idioma tiene esta pagina". `@nuxtjs/i18n` genera automaticamente en `<head>`:

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**Nota:** Se debe configurar `baseUrl` en `nuxt.config.ts`, de lo contrario hreflang generara rutas relativas (invalidas).

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // Debe configurarse!
  },
});
```

### 3.2 Canonical URL

Asegurar que cada version de idioma de la pagina tenga un Canonical URL que apunte a si misma, evitando ser considerada contenido duplicado.

### 3.3 Traduccion de contenido dinamico (API)

La API backend tambien necesita soportar multilenguaje. Normalmente se incluye el header `Accept-Language` en las solicitudes.

```typescript
// composables/useApi.ts
export const useApi = (url: string) => {
  const { locale } = useI18n();
  return useFetch(url, {
    headers: {
      'Accept-Language': locale.value, // Enviar idioma actual al backend
    },
  });
};
```

---

## 4. Desafios comunes y soluciones

### 4.1 Hydration Mismatch

**Problema:** El Server detecta ingles y renderiza HTML en ingles; el navegador del Client tiene chino como predeterminado, Vue i18n se inicializa en chino, causando parpadeo de pantalla o Hydration Error.

**Solucion:**

- Usar la configuracion `detectBrowserLanguage` para que el Client al inicializarse respete la configuracion de URL o Cookie, en lugar de la configuracion del navegador.
- Asegurar que la configuracion de `defaultLocale` del Server y Client sea consistente.

### 4.2 Cambio de idioma

Usar `switchLocalePath` para generar enlaces en lugar de construir cadenas manualmente.

```vue
<script setup>
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <nav>
    <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
    <NuxtLink :to="switchLocalePath('tw')">繁體中文</NuxtLink>
  </nav>
</template>
```

---

## 5. Puntos clave para la entrevista

### 5.1 i18n y SEO

**Q: Que hay que tener en cuenta con multilenguaje (i18n) en un entorno SSR? Como manejar el SEO?**

> **Ejemplo de respuesta:**
> Al hacer i18n en un entorno SSR, lo mas importante es el **SEO** y la **consistencia de Hydration**.
>
> Sobre **SEO**:
>
> 1.  **Estructura de URL**: Uso la estrategia de "subruta" (como `/en/`, `/tw/`), dando a cada idioma una URL independiente para que los motores de busqueda puedan indexar.
> 2.  **hreflang**: Se debe configurar correctamente `<link rel="alternate" hreflang="..." />`, indicando a Google que estas paginas son versiones en diferentes idiomas del mismo contenido, evitando penalizaciones por contenido duplicado. Normalmente uso el modulo `@nuxtjs/i18n` para generar automaticamente estas etiquetas.
>
> Sobre **Hydration**:
> Asegurar que el idioma renderizado por el Server y el idioma inicializado por el Client sean consistentes. Configuro la determinacion del idioma desde el prefijo URL o Cookie, y agrego el locale correspondiente en el header de solicitudes API.

### 5.2 Enrutamiento y estado

**Q: Como implementar la funcionalidad de cambio de idioma?**

> **Ejemplo de respuesta:**
> Uso el composable `useSwitchLocalePath` proporcionado por `@nuxtjs/i18n`.
> Genera automaticamente la URL del idioma correspondiente basandose en la ruta actual (manteniendo query parameters), y maneja la conversion de prefijos de ruta. Esto evita errores de concatenacion manual de cadenas, y asegura que el usuario permanezca en el contenido de la pagina original al cambiar de idioma.

---

## 6. Reference

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
