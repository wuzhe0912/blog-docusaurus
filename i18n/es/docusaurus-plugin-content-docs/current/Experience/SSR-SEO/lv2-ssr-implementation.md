---
title: '[Lv2] Implementación SSR: Data Fetching y gestión de SEO Meta'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> En un proyecto Nuxt 3: implementar carga de datos en SSR y gestión dinámica de SEO Meta para que los buscadores indexen correctamente rutas dinámicas.

---

## 1. Eje de respuesta en entrevista

1. **Estrategia de data fetching**: usar `useFetch`/`useAsyncData` para precargar en servidor y entregar HTML completo para SEO.
2. **Meta tags dinámicos**: usar `useHead` o `useSeoMeta` para generar metadatos por recurso.
3. **Rendimiento**: aplicar request deduplication, cache en servidor y separar claramente páginas SSR y CSR.

---

## 2. Uso correcto de useFetch / useAsyncData

### 2.1 Por qué es importante el data fetching en SSR

**Escenario típico:**

- Las rutas dinámicas (por ejemplo `/products/[id]`) necesitan datos de API.
- Si solo se carga en cliente, el crawler puede ver contenido incompleto.
- Objetivo: enviar HTML renderizado con datos completos desde servidor.

**Solución:** usar `useFetch` o `useAsyncData` en Nuxt 3.

### 2.2 Ejemplo base de useFetch

**Ruta:** `pages/products/[id].vue`

```typescript
// uso base
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**Opciones importantes:**

| Opcion      | Objetivo                                      | Default  |
| ----------- | --------------------------------------------- | -------- |
| `key`       | Clave única para deduplicar requests          | auto     |
| `lazy`      | Carga diferida (no bloquea SSR)               | `false`  |
| `server`    | Ejecutar en servidor                          | `true`   |
| `default`   | Valor fallback                                | `null`   |
| `transform` | Transformar respuesta antes de consumir       | -        |

### 2.3 Ejemplo completo

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // evita requests duplicados
  lazy: false, // SSR espera los datos
  server: true, // garantiza ejecución en servidor
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // normalizacion de datos
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**Por qué importan estas opciones:**

1. **`key`**
   - Permite deduplication de requests.
   - Mismo key -> un request efectivo.
2. **`lazy: false`**
   - El servidor renderiza después de tener datos.
   - El crawler recibe contenido final.
3. **`server: true`**
   - El fetch corre en ruta SSR.
   - Evita depender solo del cliente.

### 2.4 useAsyncData vs useFetch

| Criterio        | useFetch                    | useAsyncData                       |
| --------------- | --------------------------- | ---------------------------------- |
| Uso principal   | Llamadas API                | Cualquier operación async          |
| Comodidad       | URL/header integrados       | Logica manual                      |
| Escenario común | HTTP data fetching          | DB queries, agregaciones, archivos |

```typescript
// useFetch: centrado en API
const { data } = await useFetch('/api/products/123');

// useAsyncData: lógica async personalizada
const { data } = await useAsyncData('products', async () => {
  const result = await someAsyncOperation();
  return result;
});
```

### 2.5 $fetch vs useFetch

**Regla corta para entrevista:**

- **`$fetch`** para acciones de usuario (click, submit, refresh).
- **`useFetch`** para carga inicial con sincronización SSR/Hydration.

**`$fetch` características:**

- Cliente HTTP puro (`ofetch`)
- No transfiere estado SSR
- Usarlo directo en `setup()` puede causar double fetch

**`useFetch` características:**

- Combina `useAsyncData` + `$fetch`
- Compatible con hydration
- Entrega `data`, `pending`, `error`, `refresh`

**Comparación:**

| Punto               | useFetch                        | $fetch                         |
| ------------------- | ------------------------------- | ------------------------------ |
| Transferencia SSR   | Si                              | No                             |
| Retorno             | Refs reactivas                  | Promise con datos puros        |
| Uso principal       | Carga inicial de página         | Operaciones por evento         |

```typescript
// correcto: carga inicial
const { data } = await useFetch('/api/user');

// correcto: accion de usuario
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// evitar: setup + $fetch directo
const data = await $fetch('/api/user');
```

---

## 3. Gestión SEO Meta con useHead

### 3.1 Por que se necesitan meta tags dinámicos

**Escenario típico:**

- Páginas de producto o articulo son dinámicas.
- Cada URL necesita su propio `title`, `description`, `og:image`, canonical.
- Compartir en redes (Open Graph/Twitter) debe ser consistente.

**Solución:** `useHead` o `useSeoMeta`.

### 3.2 Ejemplo con useHead

```typescript
useHead({
  title: () => product.value?.name,
  meta: [
    { name: 'description', content: () => product.value?.description },
    { property: 'og:title', content: () => product.value?.name },
    { property: 'og:image', content: () => product.value?.image },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://example.com/products/${product.value?.id}`,
    },
  ],
});
```

**Buenas prácticas:**

1. Pasar valores como funciones (`() => ...`) para reaccionar a cambios de datos.
2. Incluir estructura SEO completa: title, description, OG, canonical.
3. Para 404, marcar `noindex, nofollow`.

### 3.3 Variante compacta con useSeoMeta

```typescript
useSeoMeta({
  title: () => product.value?.name,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
});
```

---

## 4. Caso práctico 1: SEO para rutas dinámicas

### 4.1 Contexto

Escenario e-commerce con muchas páginas SKU (`/products/[id]`).

**Retos:**

- Muchas URLs dinámicas
- SEO único por URL
- Manejo correcto de 404
- Evitar contenido duplicado

### 4.2 Estrategia

1. Precargar en servidor (`lazy: false`, `server: true`)
2. Lanzar 404 con `createError`
3. Generar meta y canonical en forma dinámica

```typescript
const { data: product, error } = await useFetch(`/api/products/${id}`, {
  key: `product-${id}`,
  lazy: false,
  server: true,
});

if (error.value || !product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}

useSeoMeta({
  title: () => `${product.value?.name} - Product`,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
});
```

### 4.3 Resultado

**Antes:**
- El crawler ve contenido incompleto
- Varias páginas comparten meta
- 404 inconsistente

**Después:**
- HTML SSR completo para crawler
- Meta único por ruta
- Manejo de error consistente y seguro para SEO

---

## 5. Caso práctico 2: Optimización de rendimiento

### 5.1 Problema

SSR sube carga en servidor. Sin optimización, aumentan latencia y costo.

### 5.2 Estrategias

1. **Request deduplication**

```typescript
const { data } = await useFetch('/api/product/123', {
  key: 'product-123',
});
```

2. **Cache en servidor (Nitro)**

```typescript
export default defineCachedEventHandler(
  async (event) => {
    return await getProductsFromDB();
  },
  {
    maxAge: 60 * 60,
    swr: true,
  },
);
```

3. **Separar SSR/CSR**
- Páginas críticas para SEO: SSR
- Páginas internas sin indexación: CSR

4. **Critical CSS y estrategia de assets**
- Priorizar CSS above-the-fold
- Cargar recursos no criticos después

### 5.3 Impacto

**Antes:**
- Alta carga de servidor
- Requests repetidos
- Sin politica de cache

**Después:**
- Mejor tiempo de respuesta
- Menor presion en backend/DB
- Mejor estabilidad bajo carga

---

## 6. Respuestas de entrevista (versión corta)

### 6.1 useFetch / useAsyncData

> Para carga inicial uso `useFetch` con `key`, `lazy: false` y `server: true` para asegurar SSR completo y HTML útil para buscadores.

### 6.2 Meta tags dinámicos

> Uso `useHead`/`useSeoMeta` con valores en función para que los metadatos se actualicen con los datos, incluyendo OG y canonical.

### 6.3 Rendimiento

> Combino deduplication, cache en servidor y división SSR/CSR para reducir TTFB y mantener calidad SEO.

---

## 7. Best practices

### 7.1 Data fetching

1. Definir siempre `key`.
2. Elegir `lazy` según necesidad SEO.
3. Tratar errores (404/5xx) de forma explicita.

### 7.2 SEO Meta

1. Valores funcionales para updates reactivos.
2. Estructura completa (title/description/OG/canonical).
3. Proteger páginas de error con `noindex, nofollow`.

### 7.3 Rendimiento

1. Aplicar cache en servidor.
2. Usar SSR solo donde SEO lo necesita.
3. Reducir costo de render con estrategia de CSS/assets.

---

## 8. Resumen para entrevista

> En Nuxt 3 implementé data fetching SSR y gestión dinámica de SEO Meta para cubrir dos objetivos: indexación correcta y experiencia rápida. Para eso combine precarga en servidor, metadatos por ruta y optimizaciones como deduplication, cache y separación SSR/CSR.

**Puntos clave:**
- ✅ Uso correcto de `useFetch`/`useAsyncData`
- ✅ Gestión dinámica con `useHead`/`useSeoMeta`
- ✅ SEO para rutas dinámicas
- ✅ Rendimiento en escenarios reales
