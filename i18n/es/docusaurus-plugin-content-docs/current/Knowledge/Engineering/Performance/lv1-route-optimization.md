---
id: performance-lv1-route-optimization
title: '[Lv1] Optimizacion a nivel de rutas: Lazy Loading en 3 niveles'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Mediante Lazy Loading de rutas en 3 niveles, se redujo la carga inicial de 12.5MB a 850KB, acortando el tiempo de primera pantalla en un 70%.

---

## Contexto del problema (Situation)

Caracteristicas del proyecto:

- **27+ plantillas multi-tenant diferentes** (arquitectura multi-tenant)
- **Cada plantilla tiene 20-30 paginas** (inicio, lobby, promociones, agentes, noticias, etc.)
- **Si se carga todo el codigo de una vez**: Se necesita descargar **10MB+ de archivos JS** en la primera entrada
- **Tiempo de espera del usuario superior a 10 segundos** (especialmente en redes moviles)

## Objetivo de optimizacion (Task)

1. **Reducir el volumen de JavaScript en la carga inicial** (objetivo: < 1MB)
2. **Acortar el tiempo de primera pantalla** (objetivo: < 3 segundos)
3. **Carga bajo demanda** (el usuario solo descarga lo que necesita)
4. **Mantener la experiencia de desarrollo** (sin afectar la eficiencia de desarrollo)

## Solucion (Action)

Adoptamos una estrategia de **Lazy Loading de rutas en 3 niveles**, optimizando desde "plantilla" → "pagina" → "permisos".

### Nivel 1: Carga dinamica de plantillas

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // Cargar dinamicamente las rutas de la plantilla correspondiente segun variables de entorno
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

Explicacion:

- El proyecto tiene 27 plantillas, pero el usuario solo usa 1
- Se determina la marca actual mediante environment.json
- Solo se carga la configuracion de rutas de esa marca, las otras 26 plantillas no se cargan en absoluto

Efecto:

- Reduccion de aproximadamente el 85% del codigo de configuracion de rutas en la carga inicial

### Nivel 2: Lazy Loading de paginas

```typescript
// Forma tradicional (X - no recomendada)
import HomePage from './pages/HomePage.vue';
component: HomePage; // Todas las paginas se empaquetan en main.js

// Nuestra forma (✓ - recomendada)
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- Cada ruta usa funcion flecha + import()
- Solo cuando el usuario visita realmente esa pagina se descarga el chunk JS correspondiente
- Vite empaqueta automaticamente cada pagina como un archivo independiente

### Nivel 3: Estrategia de carga bajo demanda

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // Usuarios no autenticados no cargan paginas que requieren login como "Centro de agentes"
    return next({ name: 'HomePage' });
  }
  next();
});
```

## Resultados de la optimizacion (Result)

**Antes de la optimizacion:**

```
Carga inicial: main.js (12.5 MB)
Tiempo primera pantalla: 8-12 segundos
Incluye las 27 plantillas + todas las paginas
```

**Despues de la optimizacion:**

```markdown
Carga inicial: main.js (850 KB) ↓ 93%
Tiempo primera pantalla: 1.5-2.5 segundos ↑ 70%
Solo codigo esencial + pagina de inicio actual
```

**Datos concretos:**

- Reduccion de JavaScript: **12.5 MB → 850 KB (reduccion del 93%)**
- Reduccion del tiempo de primera pantalla: **10 segundos → 2 segundos (mejora del 70%)**
- Carga de paginas posteriores: **Promedio 300-500 KB por pagina**
- Puntuacion de experiencia de usuario: **De 45 a 92 puntos (Lighthouse)**

**Valor comercial:**

- Tasa de rebote reducida en 35%
- Tiempo de permanencia aumentado en 50%
- Tasa de conversion mejorada en 25%

## Puntos clave para entrevistas

**Preguntas de extension frecuentes:**

1. **P: Por que no usar React.lazy() o componentes asincronos de Vue?**
   R: De hecho usamos componentes asincronos de Vue (`() => import()`), pero la clave es la **arquitectura de 3 niveles**:

   - Nivel 1 (plantilla): Determinado en tiempo de compilacion (configuracion Vite)
   - Nivel 2 (pagina): Lazy Loading en tiempo de ejecucion
   - Nivel 3 (permisos): Control por Navigation Guard

   Un Lazy Loading simple solo llega al nivel 2; nosotros agregamos la separacion a nivel de plantilla.

2. **P: Como se decide que codigo poner en main.js?**
   R: Usando la configuracion `manualChunks` de Vite:

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

   Principio: Solo lo que "todas las paginas usan" va en el vendor chunk.

3. **P: El Lazy Loading no afecta la experiencia del usuario (tiempo de espera)?**
   R: Dos estrategias para contrarrestarlo:

   - **Prefetch**: Precargar paginas que probablemente se visitaran durante el tiempo inactivo
   - **Estado de carga**: Usar Skeleton Screen en lugar de pantalla blanca

   Pruebas reales: Tiempo promedio de carga de paginas posteriores < 500ms, imperceptible para el usuario.

4. **P: Como se mide el efecto de la optimizacion?**
   R: Usando multiples herramientas:

   - **Lighthouse**: Performance Score (45 → 92)
   - **Webpack Bundle Analyzer**: Analisis visual del tamano de chunks
   - **Chrome DevTools**: Network waterfall, Coverage
   - **Real User Monitoring (RUM)**: Datos de usuarios reales

5. **P: Cuales son los Trade-offs?**
   R:
   - Posibles problemas de dependencias circulares durante el desarrollo (requiere ajustar estructura de modulos)
   - Breve tiempo de carga en el primer cambio de ruta (resuelto con prefetch)
   - Pero en general los beneficios superan las desventajas, especialmente la mejora notable en la experiencia de usuarios moviles
