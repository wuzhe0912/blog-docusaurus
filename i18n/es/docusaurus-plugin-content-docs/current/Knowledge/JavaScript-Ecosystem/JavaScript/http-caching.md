---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> ¿Qué es la caché HTTP? ¿Por qué es importante?

La caché HTTP es una técnica que almacena temporalmente las respuestas HTTP en el cliente (navegador) o en servidores intermedios, con el fin de utilizar directamente los datos en caché en solicitudes posteriores sin necesidad de volver a solicitarlos al servidor.

### Caché vs. almacenamiento temporal: ¿Cuál es la diferencia?

En la documentación técnica, estos dos términos se utilizan a menudo de forma indistinta, pero en realidad tienen significados diferentes:

#### Cache (Caché)

**Definición**: Copias de datos almacenadas para **optimización del rendimiento**, con énfasis en la "reutilización" y el "acceso más rápido".

**Características**:

- ✅ El objetivo es mejorar el rendimiento
- ✅ Los datos pueden reutilizarse
- ✅ Tiene políticas de expiración claras
- ✅ Generalmente son copias de los datos originales

**Ejemplo**:

```javascript
// HTTP Cache - Cachear respuestas de API
Cache-Control: max-age=3600  // Cachear 1 hora

// Memory Cache - Cachear resultados de cálculos
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);  // Reutilizar caché
  const result = /* cálculo */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage (Almacenamiento temporal)

**Definición**: Datos almacenados **temporalmente**, con énfasis en la "temporalidad" y "serán eliminados".

**Características**:

- ✅ El objetivo es el almacenamiento temporal
- ✅ No necesariamente se reutiliza
- ✅ El ciclo de vida suele ser corto
- ✅ Puede contener estados intermedios

**Ejemplo**:

```javascript
// sessionStorage - Almacenar temporalmente entradas del usuario
sessionStorage.setItem('formData', JSON.stringify(form)); // Se elimina al cerrar la pestaña

// Almacenamiento temporal de archivos subidos
const tempFile = await uploadToTemp(file); // Eliminar después de procesar
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### Tabla comparativa

| Característica | Cache (Caché)            | Temporary Storage (Almacenamiento temporal) |
| -------------- | ------------------------ | ------------------------------------------- |
| **Propósito principal** | Optimización del rendimiento | Almacenamiento temporal             |
| **Reutilización** | Sí, lecturas múltiples | No necesariamente                           |
| **Ciclo de vida** | Según la política      | Generalmente corto                          |
| **Uso típico** | HTTP Cache, Memory Cache | sessionStorage, archivos temporales         |
| **Equivalente en inglés** | Cache              | Temp / Temporary / Buffer                   |

#### Diferencias en la aplicación práctica

```javascript
// ===== Escenarios de uso de Cache =====

// 1. HTTP Cache: Reutilizar respuestas de API
fetch('/api/users') // Primera solicitud
  .then((response) => response.json());

fetch('/api/users') // Segunda lectura desde la caché
  .then((response) => response.json());

// 2. Caché de resultados de cálculos
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // Reutilizar
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Escenarios de uso de Temporary Storage =====

// 1. Almacenamiento temporal de datos de formulario (prevenir cierre accidental)
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2. Almacenamiento temporal de archivos subidos
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file); // Almacenamiento temporal
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath); // Eliminar después de usar
  return processed;
}

// 3. Almacenamiento temporal de resultados intermedios
const tempResults = []; // Almacenar resultados intermedios
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults); // Ya no se necesita después de usar
```

#### Aplicación en desarrollo web

```javascript
// HTTP Cache (Caché) - Almacenamiento a largo plazo, reutilización
Cache-Control: public, max-age=31536000, immutable
// → El navegador cacheará este archivo durante un año y lo reutilizará

// sessionStorage (Almacenamiento temporal) - Almacenamiento temporal, se elimina al cerrar
sessionStorage.setItem('tempData', data);
// → Solo válido en la pestaña actual, se elimina al cerrar

// localStorage (Almacenamiento a largo plazo) - Entre ambos
localStorage.setItem('userPreferences', prefs);
// → Almacenamiento persistente, pero no para optimización del rendimiento
```

### ¿Por qué es importante distinguir estos dos conceptos?

1. **Decisiones de diseño**:

   - ¿Se necesita optimización del rendimiento? → Usar caché
   - ¿Se necesita almacenamiento temporal? → Usar almacenamiento temporal

2. **Gestión de recursos**:

   - Caché: Enfocarse en la tasa de aciertos y políticas de expiración
   - Almacenamiento temporal: Enfocarse en el momento de limpieza y límites de capacidad

3. **Respuestas en entrevistas**:

   - "¿Cómo optimizar el rendimiento?" → Hablar sobre estrategias de caché
   - "¿Cómo manejar datos temporales?" → Hablar sobre soluciones de almacenamiento temporal

En este artículo, discutiremos principalmente **Cache (Caché)**, especialmente el mecanismo de caché HTTP.

### Beneficios del caché

1. **Reducción de solicitudes de red**: Leer directamente desde la caché local, sin enviar solicitudes HTTP
2. **Reducción de la carga del servidor**: Menos solicitudes que el servidor necesita procesar
3. **Velocidad de carga de página más rápida**: La lectura de la caché local es mucho más rápida que las solicitudes de red
4. **Ahorro de ancho de banda**: Reducción del volumen de transferencia de datos
5. **Mejora de la experiencia del usuario**: Respuestas de página más rápidas, uso más fluido

### Tipos de caché

```text
┌─────────────────────────────────────┐
│     Jerarquía de caché del          │
│           navegador                 │
├─────────────────────────────────────┤
│  1. Memory Cache (Caché de memoria) │
│     - Más rápido, capacidad pequeña │
│     - Se elimina al cerrar la       │
│       pestaña                       │
├─────────────────────────────────────┤
│  2. Disk Cache (Caché de disco)     │
│     - Más lento, mayor capacidad    │
│     - Almacenamiento persistente    │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - Control total del             │
│       desarrollador                 │
│     - Soporte para aplicaciones     │
│       offline                       │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> ¿Cuáles son las estrategias de caché HTTP?

### Clasificación de estrategias de caché

```text
Estrategias de caché HTTP
├── Caché fuerte (Strong Cache)
│   ├── Cache-Control
│   └── Expires
└── Caché de negociación (Negotiation Cache)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. Caché fuerte (Strong Cache / Fresh)

**Característica**: El navegador lee directamente de la caché local sin enviar solicitudes al servidor.

#### Cache-Control (HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**Directivas comunes**:

```javascript
// 1. max-age: Tiempo de validez de la caché (segundos)
Cache-Control: max-age=3600  // Cachear 1 hora

// 2. no-cache: Se requiere validación con el servidor (usar caché de negociación)
Cache-Control: no-cache

// 3. no-store: No cachear en absoluto
Cache-Control: no-store

// 4. public: Puede ser cacheado por cualquier caché (navegador, CDN)
Cache-Control: public, max-age=31536000

// 5. private: Solo el navegador puede cachear
Cache-Control: private, max-age=3600

// 6. immutable: El recurso nunca cambia (con nombre de archivo hash)
Cache-Control: public, max-age=31536000, immutable

// 7. must-revalidate: Después de expirar, se debe validar con el servidor
Cache-Control: max-age=3600, must-revalidate
```

#### Expires (HTTP/1.0, obsoleto)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**Problemas**:

- Usa tiempo absoluto, depende de la hora del cliente
- La hora inexacta del cliente causa fallos en la caché
- Ha sido reemplazado por `Cache-Control`

### 2. Caché de negociación (Negotiation Cache / Validation)

**Característica**: El navegador envía una solicitud al servidor para verificar si el recurso ha sido actualizado.

#### Last-Modified / If-Modified-Since

```http
# Respuesta del servidor (primera solicitud)
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# Solicitud del navegador (solicitudes posteriores)
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**Flujo**:

1. Primera solicitud: El servidor devuelve `Last-Modified`
2. Solicitudes posteriores: El navegador incluye `If-Modified-Since`
3. Recurso no modificado: El servidor devuelve `304 Not Modified`
4. Recurso modificado: El servidor devuelve `200 OK` y el nuevo recurso

#### ETag / If-None-Match

```http
# Respuesta del servidor (primera solicitud)
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# Solicitud del navegador (solicitudes posteriores)
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Ventajas**:

- Más preciso que `Last-Modified`
- No depende del tiempo, utiliza hash del contenido
- Puede detectar cambios por debajo del nivel de segundo

### Last-Modified vs ETag

| Característica | Last-Modified           | ETag                            |
| -------------- | ----------------------- | ------------------------------- |
| Precisión      | Nivel de segundo        | Hash del contenido, más preciso |
| Rendimiento    | Más rápido              | Requiere cálculo de hash, más lento |
| Caso de uso    | Recursos estáticos generales | Recursos que requieren control preciso |
| Prioridad      | Baja                    | Alta (ETag tiene prioridad)     |

## 3. How does browser caching work?

> ¿Cómo funciona la caché del navegador?

### Flujo completo de caché

```text
┌──────────────────────────────────────────────┐
│    Flujo de solicitud de recursos del         │
│              navegador                        │
└──────────────────────────────────────────────┘
                    ↓
         1. Verificar Memory Cache
                    ↓
            ┌───────┴────────┐
            │ ¿Caché          │
            │  encontrada?    │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. Verificar Disk Cache
                    ↓
            ┌───────┴────────┐
            │ ¿Caché          │
            │  encontrada?    │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. Verificar Service Worker
                    ↓
            ┌───────┴────────┐
            │ ¿Caché          │
            │  encontrada?    │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. Verificar si la caché ha expirado
                    ↓
            ┌───────┴────────┐
            │  ¿Expirada?     │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. Validar con caché de negociación
                    ↓
            ┌───────┴────────┐
            │ ¿Recurso        │
            │  modificado?    │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. Solicitar nuevo recurso al servidor
                    ↓
            ┌───────┴────────┐
            │ Devolver nuevo  │
            │ recurso         │
            │ (200 OK)        │
            └────────────────┘
```

### Ejemplo práctico

```javascript
// Primera solicitud
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// ========== Nueva solicitud dentro de 1 hora ==========
// Caché fuerte: Leer directamente del local, sin enviar solicitud
// Status: 200 OK (from disk cache)

// ========== Nueva solicitud después de 1 hora ==========
// Caché de negociación: Enviar solicitud de validación
GET /api/data.json
If-None-Match: "abc123"

// Recurso no modificado
Response:
  304 Not Modified
  (Sin body, usar caché local)

// Recurso modificado
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are the common caching strategies?

> ¿Cuáles son las estrategias de caché más comunes?

### 1. Estrategia de caché permanente (para recursos estáticos)

```javascript
// HTML: No cachear, verificar cada vez
Cache-Control: no-cache

// CSS/JS (con hash): Caché permanente
Cache-Control: public, max-age=31536000, immutable
// Nombre de archivo: main.abc123.js
```

**Principio**:

- HTML no se cachea, asegurando que el usuario obtenga la versión más reciente
- CSS/JS usan nombres de archivo con hash, el nombre cambia cuando el contenido cambia
- Las versiones antiguas no se usan, las nuevas se descargan de nuevo

### 2. Estrategia para recursos de actualización frecuente

```javascript
// Datos de API: Caché de corto plazo + caché de negociación
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. Estrategia para recursos de imagen

```javascript
// Avatar de usuario: Caché a mediano plazo
Cache-Control: public, max-age=86400  // 1 día

// Logo, iconos: Caché a largo plazo
Cache-Control: public, max-age=2592000  // 30 días

// Imágenes dinámicas: Caché de negociación
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. Recomendaciones de caché por tipo de recurso

```javascript
const cachingStrategies = {
  // Archivos HTML
  html: 'Cache-Control: no-cache',

  // Recursos estáticos con hash
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',

  // Recursos estáticos que se actualizan poco
  staticAssets: 'Cache-Control: public, max-age=2592000',

  // Datos de API
  apiData: 'Cache-Control: private, max-age=60',

  // Datos específicos del usuario
  userData: 'Cache-Control: private, no-cache',

  // Datos sensibles
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Caché con Service Worker

Service Worker proporciona el control de caché más flexible, permitiendo a los desarrolladores controlar completamente la lógica de caché.

### Uso básico

```javascript
// Registrar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js - Archivo de Service Worker
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// Evento de instalación: Cachear recursos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar solicitudes: Usar estrategia de caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Estrategia Cache First
      return response || fetch(event.request);
    })
  );
});

// Evento de activación: Limpiar caché antigua
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### Estrategias de caché comunes

#### 1. Cache First (Caché primero)

```javascript
// Adecuado para: Recursos estáticos
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First (Red primero)

```javascript
// Adecuado para: Solicitudes de API
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Actualizar caché
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Red fallida, usar caché
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate (Obsoleto mientras se revalida)

```javascript
// Adecuado para: Recursos que necesitan respuestas rápidas pero también mantenerse actualizados
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // Devolver caché, actualizar en segundo plano
      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. How to implement cache busting?

> ¿Cómo implementar Cache Busting?

Cache Busting es una técnica que asegura que los usuarios obtengan los recursos más recientes.

### Método 1: Hash en el nombre de archivo (recomendado)

```javascript
// Usar herramientas de empaquetado como Webpack/Vite
// Salida: main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<!-- Actualizar referencia automáticamente -->
<script src="/js/main.abc123.js"></script>
```

**Ventajas**:

- ✅ El nombre del archivo cambia, forzando la descarga del nuevo archivo
- ✅ La versión antigua permanece en caché, sin desperdicio
- ✅ Mejor práctica

### Método 2: Número de versión con Query String

```html
<!-- Actualizar número de versión manualmente -->
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**Desventajas**:

- ❌ Algunos CDN no cachean recursos con query string
- ❌ Requiere mantenimiento manual del número de versión

### Método 3: Marca de tiempo

```javascript
// Usar en entorno de desarrollo
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**Uso**:

- Evitar caché en el entorno de desarrollo
- No adecuado para producción (cada vez es una nueva solicitud)

## 7. Common caching interview questions

> Preguntas frecuentes de entrevista sobre caché

### Pregunta 1: ¿Cómo evitar que HTML sea cacheado?

<details>
<summary>Haz clic para ver la respuesta</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

O usar etiquetas meta:

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### Pregunta 2: ¿Por qué usar ETag en lugar de solo Last-Modified?

<details>
<summary>Haz clic para ver la respuesta</summary>

**Ventajas de ETag**:

1. **Más preciso**: Puede detectar cambios por debajo del nivel de segundo
2. **Basado en contenido**: Basado en el hash del contenido, no en el tiempo
3. **Evitar problemas de tiempo**:
   - El contenido del archivo no cambió pero el tiempo sí (como al redesplegar)
   - Recursos que vuelven cíclicamente al mismo contenido
4. **Sistemas distribuidos**: Los tiempos de diferentes servidores pueden no estar sincronizados

**Ejemplo**:

```javascript
// El contenido del archivo no cambió, pero Last-Modified sí
// 2024-01-01 12:00 - Desplegar versión A (contenido: abc)
// 2024-01-02 12:00 - Redesplegar versión A (contenido: abc)
// Last-Modified cambió, ¡pero el contenido es el mismo!

// ETag no tiene este problema
ETag: 'hash-of-abc'; // Siempre igual
```

</details>

### Pregunta 3: ¿Cuál es la diferencia entre from disk cache y from memory cache?

<details>
<summary>Haz clic para ver la respuesta</summary>

| Característica | Memory Cache              | Disk Cache          |
| -------------- | ------------------------- | ------------------- |
| Ubicación      | Memoria (RAM)             | Disco duro          |
| Velocidad      | Extremadamente rápido     | Más lento           |
| Capacidad      | Pequeña (nivel MB)        | Grande (nivel GB)   |
| Persistencia   | Se elimina al cerrar la pestaña | Almacenamiento persistente |
| Prioridad      | Alta (uso preferente)     | Baja                |

**Orden de prioridad de carga**:

```text
1. Memory Cache (más rápido)
2. Service Worker Cache
3. Disk Cache
4. HTTP Cache
5. Solicitud de red (más lento)
```

**Condiciones de activación**:

- **Memory Cache**: Recursos accedidos recientemente (como recargar la página)
- **Disk Cache**: Recursos accedidos hace tiempo o archivos grandes

</details>

### Pregunta 4: ¿Cómo forzar al navegador a recargar recursos?

<details>
<summary>Haz clic para ver la respuesta</summary>

**Fase de desarrollo**:

```javascript
// 1. Hard Reload (Ctrl/Cmd + Shift + R)
// 2. Borrar caché y recargar

// 3. Añadir marca de tiempo en el código
const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**Entorno de producción**:

```javascript
// 1. Usar hash en el nombre de archivo (mejor práctica)
main.abc123.js  // Generado automáticamente por Webpack/Vite

// 2. Actualizar número de versión
<script src="/js/main.js?v=2.0.0"></script>

// 3. Configurar Cache-Control
Cache-Control: no-cache  // Forzar validación
Cache-Control: no-store  // No cachear en absoluto
```

</details>

### Pregunta 5: ¿Cómo implementar caché offline en PWA?

<details>
<summary>Haz clic para ver la respuesta</summary>

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

// Cachear página offline durante la instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/styles/offline.css',
        '/images/offline-icon.png',
      ]);
    })
  );
});

// Interceptar solicitudes
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Red fallida, mostrar página offline
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**Estrategia completa de caché PWA**:

```javascript
// 1. Cachear recursos estáticos
caches.addAll(['/css/', '/js/', '/images/']);

// 2. Solicitudes de API: Network First
// 3. Imágenes: Cache First
// 4. HTML: Network First, mostrar página offline si falla
```

</details>

## 8. Best practices

> Mejores prácticas

### ✅ Prácticas recomendadas

```javascript
// 1. HTML - No cachear, asegurar que el usuario obtenga la versión más reciente
// Response Headers:
Cache-Control: no-cache

// 2. CSS/JS (con hash) - Caché permanente
// Nombre de archivo: main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. Imágenes - Caché a largo plazo
Cache-Control: public, max-age=2592000  // 30 días

// 4. Datos de API - Caché a corto plazo + caché de negociación
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Usar Service Worker para implementar soporte offline
```

### ❌ Prácticas a evitar

```javascript
// ❌ Malo: Configurar caché a largo plazo para HTML
Cache-Control: max-age=31536000  // El usuario podría ver una versión antigua

// ❌ Malo: Usar Expires en lugar de Cache-Control
Expires: Wed, 21 Oct 2025 07:28:00 GMT  // HTTP/1.0, obsoleto

// ❌ Malo: No configurar caché en absoluto
// Sin encabezados de caché, el comportamiento del navegador es indeterminado

// ❌ Malo: Usar la misma estrategia para todos los recursos
Cache-Control: max-age=3600  // Se debería ajustar según el tipo de recurso
```

### Árbol de decisión de estrategia de caché

```text
¿Es un recurso estático?
├─ Sí → ¿El nombre de archivo tiene hash?
│      ├─ Sí → Caché permanente (max-age=31536000, immutable)
│      └─ No → Caché a mediano-largo plazo (max-age=2592000)
└─ No → ¿Es HTML?
       ├─ Sí → No cachear (no-cache)
       └─ No → ¿Es una API?
              ├─ Sí → Caché a corto plazo + negociación (max-age=60, ETag)
              └─ No → Decidir según la frecuencia de actualización
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/es/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/es/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/es/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
