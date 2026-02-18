---
id: performance-lv1-route-optimization
title: '[Lv1] Optimización a nivel de rutas: Lazy Loading en 3 niveles'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Mediante Lazy Loading de rutas en 3 niveles, se redujo la carga inicial de 12.5MB a 850KB, acortando el tiempo de primera pantalla en un 70%.

---

## Contexto del problema (Situation)

Características del proyecto:

- **27+ plantillas multi-tenant diferentes** (arquitectura multi-tenant)
- **Cada plantilla tiene 20-30 páginas** (inicio, lobby, promociones, agentes, noticias, etc.)
- **Si se carga todo el código de una vez**: Se necesita descargar **10MB+ de archivos JS** en la primera entrada
- **Tiempo de espera del usuario superior a 10 segundos** (especialmente en redes móviles)

## Objetivo de optimización (Task)

1. **Reducir el volumen de JavaScript en la carga inicial** (objetivo: < 1MB)
2. **Acortar el tiempo de primera pantalla** (objetivo: < 3 segundos)
3. **Carga bajo demanda** (el usuario solo descarga lo que necesita)
4. **Mantener la experiencia de desarrollo** (sin afectar la eficiencia de desarrollo)

## Solución (Action)

Adoptamos una estrategia de **Lazy Loading de rutas en 3 niveles**, optimizando desde "plantilla" → "página" → "permisos".

### Nivel 1: Carga dinámica de plantillas

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // Cargar dinámicamente las rutas de la plantilla correspondiente según variables de entorno
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

Explicacion:

- El proyecto tiene 27 plantillas, pero el usuario solo usa 1
- Se determina la marca actual mediante environment.json
- Solo se carga la configuración de rutas de esa marca, las otras 26 plantillas no se cargan en absoluto

Efecto:

- Reducción de aproximadamente el 85% del código de configuración de rutas en la carga inicial

### Nivel 2: Lazy Loading de páginas

```typescript
// Forma tradicional (X - no recomendada)
import HomePage from './pages/HomePage.vue';
component: HomePage; // Todas las páginas se empaquetan en main.js

// Nuestra forma (✓ - recomendada)
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- Cada ruta usa función flecha + import()
- Solo cuando el usuario visita realmente esa página se descarga el chunk JS correspondiente
- Vite empaqueta automáticamente cada página como un archivo independiente

### Nivel 3: Estrategia de carga bajo demanda

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // Usuarios no autenticados no cargan páginas que requieren login como "Centro de agentes"
    return next({ name: 'HomePage' });
  }
  next();
});
```

## Resultados de la optimización (Result)

**Antes de la optimización:**

```
Carga inicial: main.js (12.5 MB)
Tiempo primera pantalla: 8-12 segundos
Incluye las 27 plantillas + todas las páginas
```

**Después de la optimización:**

```markdown
Carga inicial: main.js (850 KB) ↓ 93%
Tiempo primera pantalla: 1.5-2.5 segundos ↑ 70%
Solo código esencial + página de inicio actual
```

**Datos concretos:**

- Reducción de JavaScript: **12.5 MB → 850 KB (reducción del 93%)**
- Reducción del tiempo de primera pantalla: **10 segundos → 2 segundos (mejora del 70%)**
- Carga de páginas posteriores: **Promedio 300-500 KB por página**
- Puntuacion de experiencia de usuario: **De 45 a 92 puntos (Lighthouse)**

**Valor comercial:**

- Tasa de rebote reducida en 35%
- Tiempo de permanencia aumentado en 50%
- Tasa de conversión mejorada en 25%

## Puntos clave para entrevistas

**Preguntas de extensión frecuentes:**

1. **P: Por que no usar React.lazy() o componentes asincronos de Vue?**
   R: De hecho usamos componentes asincronos de Vue (`() => import()`), pero la clave es la **arquitectura de 3 niveles**:

   - Nivel 1 (plantilla): Determinado en tiempo de compilación (configuración Vite)
   - Nivel 2 (página): Lazy Loading en tiempo de ejecución
   - Nivel 3 (permisos): Control por Navigation Guard

   Un Lazy Loading simple solo llega al nivel 2; nosotros agregamos la separación a nivel de plantilla.

2. **P: Cómo se decide qué código poner en main.js?**
   R: Usando la configuración `manualChunks` de Vite:

   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor': ['vue', 'pinia', 'vue-router'],
           'ui': ['element-plus'],
         }
       }
     }
   }
   ```

   Principio: Solo lo que "todas las páginas usan" va en el vendor chunk.

3. **P: El Lazy Loading no afecta la experiencia del usuario (tiempo de espera)?**
   R: Dos estrategias para contrarrestarlo:

   - **Prefetch**: Precargar páginas que probablemente se visitaran durante el tiempo inactivo
   - **Estado de carga**: Usar Skeleton Screen en lugar de pantalla blanca

   Pruebas reales: Tiempo promedio de carga de páginas posteriores < 500ms, imperceptible para el usuario.

4. **P: Cómo se mide el efecto de la optimización?**
   R: Usando múltiples herramientas:

   - **Lighthouse**: Performance Score (45 → 92)
   - **Webpack Bundle Analyzer**: Analisis visual del tamaño de chunks
   - **Chrome DevTools**: Network waterfall, Coverage
   - **Real User Monitoring (RUM)**: Datos de usuarios reales

5. **P: Cuáles son los Trade-offs?**
   R:
   - Posibles problemas de dependencias circulares durante el desarrollo (requiere ajustar estructura de modulos)
   - Breve tiempo de carga en el primer cambio de ruta (resuelto con prefetch)
   - Pero en general los beneficios superan las desventajas, especialmente la mejora notable en la experiencia de usuarios móviles
