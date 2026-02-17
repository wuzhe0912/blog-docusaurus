---
title: '[Lv1] Implementacion basica de SEO: Modos de Router y Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> En un proyecto de plataforma multi-marca, implementacion de la configuracion basica de SEO: Router History Mode, estructura de Meta Tags y SEO de paginas estaticas.

---

## 1. Puntos clave de respuesta en entrevista

1. **Seleccion del modo de Router**: Usar History Mode en lugar de Hash Mode para proporcionar una estructura de URL limpia.
2. **Fundamentos de Meta Tags**: Implementar meta tags SEO completos, incluyendo Open Graph y Twitter Card.
3. **SEO de paginas estaticas**: Configurar elementos SEO completos para la Landing Page.

---

## 2. Configuracion de Router History Mode

### 2.1 Por que elegir History Mode?

**Ubicacion del archivo:** `quasar.config.js`

```javascript
// Linea 82
vueRouterMode: "history", // Usar modo history en lugar de modo hash
```

**Ventajas para SEO:**

| Modo             | Ejemplo de URL | Impacto en SEO                        |
| ---------------- | -------------- | ------------------------------------- |
| **Hash Mode**    | `/#/home`      | ❌ Dificil de indexar por buscadores   |
| **History Mode** | `/home`        | ✅ URL limpia, facil de indexar        |

**Diferencias clave:**

- History Mode genera URLs limpias (ej: `/home` en lugar de `/#/home`)
- Los motores de busqueda pueden indexar y rastrear mas facilmente
- Mejor experiencia de usuario y al compartir
- Requiere configuracion del backend (para evitar errores 404)

### 2.2 Requisitos de configuracion del backend

Al usar History Mode, se necesita configuracion del backend:

```nginx
# Ejemplo de Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Esto asegura que todas las rutas devuelvan `index.html`, y el Router del frontend se encargue del enrutamiento.

---

## 3. Estructura basica de Meta Tags

### 3.1 Meta Tags SEO basicos

**Ubicacion del archivo:** `template/*/public/landingPage/index.html`

```html
<!-- Meta Tags basicos -->
<meta charset="UTF-8" />
<title>AMUSE VIP</title>
<meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
<meta
  name="description"
  content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
/>
```

**Explicacion:**

- `title`: Titulo de la pagina, afecta la visualizacion en resultados de busqueda
- `keywords`: Palabras clave (importancia menor en SEO moderno, pero se recomienda configurar)
- `description`: Descripcion de la pagina, se muestra en los resultados de busqueda

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
- Tamano recomendado de `og:image`: 1200x630px
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

- `summary`: Tarjeta pequena
- `summary_large_image`: Tarjeta con imagen grande (recomendado)

---

## 4. Implementacion de SEO para Landing Page estatica

### 4.1 Lista completa de elementos SEO

En la Landing Page del proyecto, se implementaron los siguientes elementos SEO:

```html
✅ Etiqueta Title ✅ Keywords meta tag ✅ Description meta tag ✅ Open Graph
tags (Facebook, LinkedIn, etc.) ✅ Twitter Card tags ✅ Canonical URL ✅ Configuracion
de Favicon
```

### 4.2 Ejemplo de implementacion

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO basico -->
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
    <!-- Contenido de la pagina -->
  </body>
</html>
```

---

## 5. Puntos clave para la entrevista

### 5.1 Seleccion del modo de Router

**Por que elegir History Mode?**

- Proporciona URLs limpias, mejorando el efecto SEO
- Los motores de busqueda pueden indexar mas facilmente
- Mejor experiencia de usuario

**Que hay que tener en cuenta?**

- Necesita soporte de configuracion del backend (evitar 404 al acceder directamente a rutas)
- Necesita configurar mecanismo de fallback

### 5.2 Importancia de los Meta Tags

**Meta Tags basicos:**

- `title`: Afecta la visualizacion en resultados de busqueda
- `description`: Afecta la tasa de clics
- `keywords`: Importancia menor en SEO moderno, pero se recomienda configurar

**Meta Tags para redes sociales:**

- Open Graph: Vista previa al compartir en plataformas como Facebook, LinkedIn
- Twitter Card: Vista previa al compartir en Twitter
- Tamano de imagen recomendado: 1200x630px

---

## 6. Mejores practicas

1. **Etiqueta Title**

   - Controlar la longitud entre 50-60 caracteres
   - Incluir palabras clave principales
   - Cada pagina debe tener un title unico

2. **Description**

   - Controlar la longitud entre 150-160 caracteres
   - Describir el contenido de la pagina de forma concisa
   - Incluir llamada a la accion (CTA)

3. **Imagen Open Graph**

   - Tamano: 1200x630px
   - Tamano de archivo: < 1MB
   - Usar imagenes de alta calidad

4. **Canonical URL**
   - Evitar problemas de contenido duplicado
   - Apuntar a la URL de la version principal

---

## 7. Resumen de entrevista

**Puedes responder asi:**

> En el proyecto, elegi usar History Mode de Vue Router en lugar de Hash Mode, porque History Mode proporciona una estructura de URL limpia que es mas amigable para SEO. Al mismo tiempo, implemente meta tags SEO completos para la Landing Page, incluyendo title, description, keywords basicos, asi como Open Graph y Twitter Card tags, asegurando que la vista previa se muestre correctamente al compartir en redes sociales.

**Puntos clave:**

- ✅ Seleccion y razones del Router History Mode
- ✅ Estructura completa de Meta Tags
- ✅ Optimizacion para compartir en redes sociales
- ✅ Experiencia real en proyectos
