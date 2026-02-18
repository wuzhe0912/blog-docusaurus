---
title: '[Lv1] Implementación básica de SEO: Modos de Router y Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> En un proyecto de plataforma multi-marca, implementación de la configuración básica de SEO: Router History Mode, estructura de Meta Tags y SEO de páginas estáticas.

---

## 1. Puntos clave de respuesta en entrevista

1. **Selección del modo de Router**: Usar History Mode en lugar de Hash Mode para proporcionar una estructura de URL limpia.
2. **Fundamentos de Meta Tags**: Implementar meta tags SEO completos, incluyendo Open Graph y Twitter Card.
3. **SEO de páginas estáticas**: Configurar elementos SEO completos para la Landing Page.

---

## 2. Configuración de Router History Mode

### 2.1 Por qué elegir History Mode?

**Ubicación del archivo:** `quasar.config.js`

```javascript
// Línea 82
vueRouterMode: "history", // Usar modo history en lugar de modo hash
```

**Ventajas para SEO:**

| Modo             | Ejemplo de URL | Impacto en SEO                        |
| ---------------- | -------------- | ------------------------------------- |
| **Hash Mode**    | `/#/home`      | ❌ Difícil de indexar por buscadores   |
| **History Mode** | `/home`        | ✅ URL limpia, fácil de indexar        |

**Diferencias clave:**

- History Mode genera URLs limpias (ej: `/home` en lugar de `/#/home`)
- Los motores de búsqueda pueden indexar y rastrear más fácilmente
- Mejor experiencia de usuario y al compartir
- Requiere configuración del backend (para evitar errores 404)

### 2.2 Requisitos de configuración del backend

Al usar History Mode, se necesita configuración del backend:

```nginx
# Ejemplo de Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Esto asegura que todas las rutas devuelvan `index.html`, y el Router del frontend se encargue del enrutamiento.

---

## 3. Estructura básica de Meta Tags

### 3.1 Meta Tags SEO básicos

**Ubicación del archivo:** `template/*/public/landingPage/index.html`

```html
<!-- Meta Tags básicos -->
<meta charset="UTF-8" />
<title>AMUSE VIP</title>
<meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
<meta
  name="description"
  content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
/>
```

**Explicacion:**

- `title`: Titulo de la página, afecta la visualización en resultados de búsqueda
- `keywords`: Palabras clave (importancia menor en SEO moderno, pero se recomienda configurar)
- `description`: Descripción de la página, se muestra en los resultados de búsqueda

### 3.2 Open Graph Tags (compartir en redes sociales)

```html
<!-- Open Graph Tags -->
<meta property="og:site_name" content="AMUSE VIP" />
<meta property="og:title" content="AMUSE VIP" />
<meta property="og:type" content="website" />
<meta property="og:url" content="#" />
<meta property="og:description" content="..." />
<meta property="og:image" content="images/amuse.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

**Uso:**

- Vista previa mostrada al compartir en redes sociales como Facebook, LinkedIn
- Tamaño recomendado de `og:image`: 1200x630px
- `og:type` se puede configurar como `website`, `article`, etc.

### 3.3 Twitter Card Tags

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AMUSE VIP" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="images/amuse.webp" />
```

**Tipos de Twitter Card:**

- `summary`: Tarjeta pequeña
- `summary_large_image`: Tarjeta con imagen grande (recomendado)

---

## 4. Implementación de SEO para Landing Page estática

### 4.1 Lista completa de elementos SEO

En la Landing Page del proyecto, se implementaron los siguientes elementos SEO:

```html
✅ Etiqueta Title ✅ Keywords meta tag ✅ Description meta tag ✅ Open Graph
tags (Facebook, LinkedIn, etc.) ✅ Twitter Card tags ✅ Canonical URL ✅ Configuracion
de Favicon
```

### 4.2 Ejemplo de implementación

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO básico -->
    <title>AMUSE VIP</title>
    <meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
    <meta
      name="description"
      content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
    />

    <!-- Open Graph -->
    <meta property="og:site_name" content="AMUSE VIP" />
    <meta property="og:title" content="AMUSE VIP" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://example.com" />
    <meta property="og:description" content="..." />
    <meta property="og:image" content="images/amuse.webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="AMUSE VIP" />
    <meta name="twitter:description" content="..." />
    <meta name="twitter:image" content="images/amuse.webp" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://example.com" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="favicon.png" />
  </head>
  <body>
    <!-- Contenido de la página -->
  </body>
</html>
```

---

## 5. Puntos clave para la entrevista

### 5.1 Selección del modo de Router

**Por qué elegir History Mode?**

- Proporciona URLs limpias, mejorando el efecto SEO
- Los motores de búsqueda pueden indexar más fácilmente
- Mejor experiencia de usuario

**Qué hay que tener en cuenta?**

- Necesita soporte de configuración del backend (evitar 404 al acceder directamente a rutas)
- Necesita configurar mecanismo de fallback

### 5.2 Importancia de los Meta Tags

**Meta Tags básicos:**

- `title`: Afecta la visualización en resultados de búsqueda
- `description`: Afecta la tasa de clics
- `keywords`: Importancia menor en SEO moderno, pero se recomienda configurar

**Meta Tags para redes sociales:**

- Open Graph: Vista previa al compartir en plataformas como Facebook, LinkedIn
- Twitter Card: Vista previa al compartir en Twitter
- Tamaño de imagen recomendado: 1200x630px

---

## 6. Mejores prácticas

1. **Etiqueta Title**

   - Controlar la longitud entre 50-60 caracteres
   - Incluir palabras clave principales
   - Cada página debe tener un title único

2. **Description**

   - Controlar la longitud entre 150-160 caracteres
   - Describir el contenido de la página de forma concisa
   - Incluir llamada a la accion (CTA)

3. **Imagen Open Graph**

   - Tamaño: 1200x630px
   - Tamaño de archivo: < 1MB
   - Usar imágenes de alta calidad

4. **Canonical URL**
   - Evitar problemas de contenido duplicado
   - Apuntar a la URL de la versión principal

---

## 7. Resumen de entrevista

**Puedes responder así:**

> En el proyecto, elegí usar History Mode de Vue Router en lugar de Hash Mode, porque History Mode proporciona una estructura de URL limpia que es más amigable para SEO. Al mismo tiempo, implementé meta tags SEO completos para la Landing Page, incluyendo title, description, keywords básicos, así como Open Graph y Twitter Card tags, asegurando que la vista previa se muestre correctamente al compartir en redes sociales.

**Puntos clave:**

- ✅ Selección y razones del Router History Mode
- ✅ Estructura completa de Meta Tags
- ✅ Optimización para compartir en redes sociales
- ✅ Experiencia real en proyectos
