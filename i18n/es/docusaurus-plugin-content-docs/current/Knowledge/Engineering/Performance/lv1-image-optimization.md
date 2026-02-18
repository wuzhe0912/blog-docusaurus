---
id: performance-lv1-image-optimization
title: '[Lv1] Optimización de carga de imágenes: Lazy Load en 4 niveles'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Mediante una estrategia de Lazy Loading de imágenes en 4 niveles, se redujo el trafico de imágenes de la primera pantalla de 60MB a 2MB, mejorando el tiempo de carga en un 85%.

---

## Contexto del problema (Situation)

> Imagina que estas navegando una página web en tu telefono, la pantalla solo muestra 10 imágenes, pero la página carga los datos completos de 500 imágenes de golpe. Tu telefono se congela y el consumo de datos se dispara a 50MB instantaneamente.

**Situacion real del proyecto:**

```markdown
📊 Estadísticas de una página principal
├─ 300+ miniaturas (cada una 150-300KB)
├─ 50+ banners promocionales
└─ Si se cargan todas: 300 × 200KB = 60MB+ de datos de imagen

❌ Problemas reales
├─ Primera pantalla solo muestra 8-12 imágenes
├─ El usuario puede desplazarse solo hasta la imagen 30 y salir
└─ Las 270 imágenes restantes son carga desperdiciada (trafico + velocidad)

📉 Impacto
├─ Tiempo de primera carga: 15-20 segundos
├─ Consumo de trafico: 60MB+ (usuarios molestos)
├─ Página lenta: desplazamiento no fluido
└─ Tasa de rebote: 42% (muy alta)
```

## Objetivo de optimización (Task)

1. **Cargar solo imágenes dentro del area visible**
2. **Precargar imágenes que estan por entrar al viewport** (comenzar a cargar 50px antes)
3. **Controlar la cantidad de cargas simultaneas** (evitar cargar demasiadas imágenes a la vez)
4. **Prevenir desperdicio de recursos por cambio rápido**
5. **Trafico de imágenes de primera pantalla < 3MB**

## Solución (Action)

### Implementación de v-lazy-load.ts

> Lazy load de imágenes en 4 niveles

#### Nivel 1: Detección de visibilidad en viewport (IntersectionObserver)

```js
// Crear observador, monitorear si la imagen entra al viewport
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // La imagen entro al area visible
        // Comenzar a cargar la imagen
      }
    });
  },
  {
    rootMargin: '50px 0px', // Comenzar a cargar 50px antes (precarga)
    threshold: 0.1, // Se activa con solo el 10% visible
  }
);
```

- Uso de la API nativa IntersectionObserver del navegador (rendimiento muy superior al evento scroll)
- rootMargin: "50px" → Cuándo la imagen esta a 50px debajo, comienza a cargar; cuando el usuario llega, ya esta lista (experiencia más fluida)
- Las imágenes fuera del viewport no se cargan en absoluto

#### Nivel 2: Mecanismo de control de concurrencia (Gestión de cola)

```js
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent = 6  // Máximo 6 cargas simultaneas
  private queue: (() => void)[] = []

  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)  // Hay espacio, cargar inmediatamente
    } else {
      this.queue.push(loadFn)   // Sin espacio, esperar en cola
    }
  }
}
```

- Aunque 20 imágenes entren al viewport simultaneamente, solo se cargan 6 a la vez
- Evita la "carga en cascada" que bloquea el navegador (Chrome permite máximo 6 solicitudes simultaneas)
- Al completar una carga, se procesa automáticamente la siguiente en cola

```md
Usuario desplaza rápidamente hasta el final → 30 imágenes se activan simultaneamente
Sin gestión de cola: 30 solicitudes simultaneas → Navegador se congela
Con gestión de cola: Primeras 6 se cargan → Al completar, las siguientes 6 → Fluido
```

#### Nivel 3: Resolución de condiciones de carrera (Control de versión)

```js
// Establecer número de versión al cargar
el.setAttribute('data-version', Date.now().toString());

// Verificar versión al completar la carga
img.onload = () => {
  const currentVersion = img.getAttribute('data-version');
  if (loadVersion === currentVersion) {
    // Versión coincide, mostrar imagen
  } else {
    // Versión no coincide, el usuario ya cambio a otro contenido, no mostrar
  }
};
```

Caso real:

```md
Operaciones del usuario:

1. Clic en categoría "Noticias" → Activa carga de 100 imágenes (versión 1001)
2. 0.5 segundos después clic en "Promociones" → Activa carga de 80 imágenes (versión 1002)
3. Las imágenes de noticias terminan de cargar 1 segundo después

Sin control de versión: Muestra imágenes de noticias (incorrecto!)
Con control de versión: Detecta versión diferente, descarta imágenes de noticias (correcto!)
```

#### Nivel 4: Estrategia de placeholder (Imagen transparente Base64)

```js
// Por defecto muestra SVG transparente 1×1, evita desplazamiento de layout
el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi...';

// URL real de la imagen almacenada en data-src
el.setAttribute('data-src', realImageUrl);
```

- Uso de SVG transparente codificado en Base64 (solo 100 bytes)
- Evita CLS (Cumulative Layout Shift)
- El usuario no ve el fenómeno de "imágenes apareciendo de repente"

## Resultados de la optimización (Result)

**Antes de la optimización:**

```markdown
Imágenes primera pantalla: Carga de 300 imágenes de golpe (60MB)
Tiempo de carga: 15-20 segundos
Fluidez de desplazamiento: Muy lento
Tasa de rebote: 42%
```

**Después de la optimización:**

```markdown
Imágenes primera pantalla: Solo 8-12 imágenes (2MB) ↓ 97%
Tiempo de carga: 2-3 segundos ↑ 85%
Fluidez de desplazamiento: Fluido (60fps)
Tasa de rebote: 28% ↓ 33%
```

**Datos concretos:**

- Trafico de imágenes primera pantalla: **60 MB → 2 MB (reducción del 97%)**
- Tiempo de carga de imágenes: **15 segundos → 2 segundos (mejora del 85%)**
- FPS de desplazamiento: **De 20-30 a 55-60**
- Uso de memoria: **Reducción del 65%** (imágenes no cargadas no ocupan memoria)

**Indicadores técnicos:**

- Rendimiento de IntersectionObserver: Muy superior al evento scroll tradicional (CPU reducido en 80%)
- Efecto del control de concurrencia: Evita bloqueo de solicitudes del navegador
- Tasa de acierto del control de versión: 99.5% (imágenes incorrectas casi inexistentes)

## Puntos clave para entrevistas

**Preguntas de extensión frecuentes:**

1. **P: Por que no usar directamente el atributo `loading="lazy"`?**
   R: El `loading="lazy"` nativo tiene varias limitaciones:

   - No se puede controlar la distancia de precarga (lo decide el navegador)
   - No se puede controlar la cantidad de cargas simultaneas
   - No se puede manejar el control de versión (problema de cambio rápido)
   - Navegadores antiguos no lo soportan

   La directiva personalizada proporciona un control más fino, adecuado para nuestros escenarios complejos.

2. **P: En qué es mejor IntersectionObserver que el evento scroll?**
   R:

   ```javascript
   // ❌ Evento scroll tradicional
   window.addEventListener('scroll', () => {
     // Se activa en cada desplazamiento (60 veces/segundo)
     // Necesita calcular posición del elemento (getBoundingClientRect)
     // Puede causar reflow forzado (asesino de rendimiento)
   });

   // ✅ IntersectionObserver
   const observer = new IntersectionObserver(callback);
   // Solo se activa cuando el elemento entra/sale del viewport
   // Optimizado nativamente por el navegador, no bloquea el hilo principal
   // Mejora de rendimiento del 80%
   ```

3. **P: De dónde viene el límite de 6 imágenes simultaneas?**
   R: Esta basado en el **límite de conexiones simultaneas HTTP/1.1 del mismo origen** del navegador:

   - Chrome/Firefox: Máximo 6 conexiones simultaneas por dominio
   - Solicitudes que excedan el límite esperan en cola
   - HTTP/2 permite más, pero por compatibilidad se controla en 6
   - Pruebas reales: 6 cargas simultaneas es el punto óptimo de equilibrio entre rendimiento y experiencia

4. **P: Por que se usa timestamp en lugar de UUID para el control de versión?**
   R:

   - Timestamp: `Date.now()` (simple, suficiente, ordenable)
   - UUID: `crypto.randomUUID()` (más riguroso, pero sobrediseñado)
   - Nuestro escenario: Timestamp es suficientemente único (nivel de milisegundos)
   - Consideración de rendimiento: Generar timestamp es más rápido

5. **P: Cómo se manejan las fallas de carga de imágenes?**
   R: Se implemento un fallback multinivel:

   ```javascript
   img.onerror = () => {
     if (retryCount < 3) {
       // 1. Reintentar 3 veces
       setTimeout(() => reload(), 1000 * retryCount);
     } else {
       // 2. Mostrar imagen por defecto
       img.src = '/images/game-placeholder.png';
     }
   };
   ```

6. **P: Puede haber problemas de CLS (Cumulative Layout Shift)?**
   R: Tres estrategias para evitarlo:

   ```html
   <!-- 1. SVG placeholder por defecto -->
   <img src="data:image/svg+xml..." />

   <!-- 2. CSS aspect-ratio para fijar proporcion -->
   <img style="aspect-ratio: 16/9;" />

   <!-- 3. Skeleton Screen -->
   <div class="skeleton-box"></div>
   ```

   Puntuacion CLS final: < 0.1 (excelente)
