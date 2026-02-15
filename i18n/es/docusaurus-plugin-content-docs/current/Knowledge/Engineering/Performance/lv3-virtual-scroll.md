---
id: performance-lv3-virtual-scroll
title: '[Lv3] Implementacion de Virtual Scroll: Manejo de renderizado de grandes volumenes de datos'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Cuando la pagina necesita renderizar mas de 1000 registros, Virtual Scroll puede reducir los nodos DOM de 1000+ a 20-30, disminuyendo el uso de memoria en un 80%.

---

## Pregunta de entrevista

**P: Si la pantalla tiene mas de una tabla, cada una con mas de cien registros, y ademas hay eventos que actualizan el DOM frecuentemente, que metodo usarias para optimizar el rendimiento de esta pagina?**

---

## Analisis del problema (Situation)

### Escenario real del proyecto

En el proyecto de plataforma, hay paginas que necesitan manejar grandes volumenes de datos:

```markdown
📊 Pagina de historial de transacciones
├─ Tabla de depositos: 1000+ registros
├─ Tabla de retiros: 800+ registros
├─ Tabla de apuestas: 5000+ registros
└─ Cada registro tiene 8-10 campos (fecha, monto, estado, etc.)

❌ Problemas sin optimizar
├─ Nodos DOM: 1000 registros × 10 campos = 10,000+ nodos
├─ Uso de memoria: ~150-200 MB
├─ Tiempo de primer renderizado: 3-5 segundos (pantalla blanca)
├─ Scroll con lag: FPS < 20
└─ Al actualizar por WebSocket: Toda la tabla se re-renderiza (muy lento)
```

---

## Solucion (Action)

### Virtual Scrolling

Primero consideremos la optimizacion con Virtual Scroll. Hay dos enfoques: usar el paquete de terceros con soporte oficial [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller), o implementarlo manualmente. Considerando el costo de desarrollo y los escenarios a cubrir, me inclinaria por adoptar el paquete con soporte oficial.

```js
// Solo renderizar las filas visibles, por ejemplo:
// - De 100 registros, solo renderizar los 20 visibles
// - Reduccion significativa de nodos DOM
```

### Control de frecuencia de actualizacion de datos

> Solucion 1: requestAnimationFrame (RAF)
> Concepto: El navegador repinta maximo 60 veces por segundo (60 FPS); actualizar mas rapido es invisible para el ojo humano, asi que nos sincronizamos con la tasa de refresco de la pantalla

```js
// ❌ Original: Actualizar inmediatamente al recibir datos (100 veces/segundo posible)
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// ✅ Mejorado: Recopilar datos y actualizar sincronizado con el refresco de pantalla (maximo 60/segundo)
let latestPrice = null;
let isScheduled = false;

socket.on('price', (newPrice) => {
  latestPrice = newPrice;

  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(() => {
      btcPrice.value = latestPrice;
      isScheduled = false;
    });
  }
});
```

Solucion 2: Throttle
Concepto: Limitar forzosamente la frecuencia de actualizacion, por ejemplo "maximo 1 actualizacion cada 100ms"

```js
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100);

socket.on('price', updatePrice);
```

### Optimizaciones especificas de Vue3

Algunas utilidades de Vue3 proporcionan optimizaciones de rendimiento, como v-memo, aunque personalmente lo uso raramente.

```js
// 1. v-memo - Memoizar columnas que no cambian frecuentemente
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // Solo re-renderizar cuando estos campos cambien
</tr>

// 2. Congelar datos estaticos, evitar overhead de reactividad
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef para arrays grandes
const tableData = shallowRef([...])  // Solo rastrear el array, no los objetos internos

// 4. Usar key para optimizar el algoritmo diff
<tr v-for="row in data" :key="row.id">  // key estable
```

### Optimizacion de renderizado DOM

```scss
// Usar CSS transform en vez de top/left
.row-update {
  transform: translateY(0); /* Activa aceleracion GPU */
  will-change: transform; /* Pista al navegador para optimizar */
}

// CSS containment para aislar el alcance del renderizado
.table-container {
  contain: layout style paint;
}
```

---

## Resultados de la optimizacion (Result)

### Comparativa de rendimiento

| Indicador  | Antes      | Despues     | Mejora   |
| ---------- | ---------- | ----------- | -------- |
| Nodos DOM  | 10,000+    | 20-30       | ↓ 99.7%  |
| Memoria    | 150-200 MB | 30-40 MB    | ↓ 80%    |
| Primer renderizado | 3-5s | 0.3-0.5s   | ↑ 90%    |
| FPS scroll | < 20       | 55-60       | ↑ 200%   |
| Respuesta de actualizacion | 500-800 ms | 16-33 ms | ↑ 95% |

---

## Puntos clave para entrevistas

### Preguntas de extension frecuentes

**P: Si no puedes usar bibliotecas de terceros?**
R: Implementar la logica central de Virtual Scroll manualmente:

```javascript
const itemHeight = 50;
const containerHeight = 600;
const visibleCount = Math.ceil(containerHeight / itemHeight);

const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

const visibleItems = allItems.slice(startIndex, endIndex);

const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

**P: Cuales son las desventajas de Virtual Scroll?**
R: Trade-offs a considerar:

```markdown
❌ Desventajas
├─ No se puede usar busqueda nativa del navegador (Ctrl+F)
├─ No se puede usar "seleccionar todo" (requiere tratamiento especial)
├─ Alta complejidad de implementacion
├─ Requiere altura fija o calculo previo de altura
└─ Accesibilidad requiere tratamiento adicional

✅ Escenarios adecuados
├─ Volumen de datos > 100 registros
├─ Estructura de datos similar (altura fija)
├─ Necesidad de scroll de alto rendimiento
└─ Principalmente consulta (no edicion)

❌ Escenarios no adecuados
├─ Volumen de datos < 50 (sobrediseno)
├─ Altura variable (dificil implementacion)
├─ Mucha interaccion (seleccion multiple, arrastrar)
└─ Necesidad de imprimir tabla completa
```

**P: Como optimizar listas con alturas desiguales?**
R: Usar Virtual Scroll con altura dinamica:

```javascript
// Opcion 1: Altura estimada + medicion real
const estimatedHeight = 50;
const measuredHeights = {};

onMounted(() => {
  const elements = document.querySelectorAll('.list-item');
  elements.forEach((el, index) => {
    measuredHeights[index] = el.offsetHeight;
  });
});

// Opcion 2: Usar paquete que soporte altura dinamica
<DynamicScroller
  :items="items"
  :min-item-size="50"
  :buffer="200"
/>
```

---

## Comparativa tecnica

### Virtual Scroll vs Paginacion

| Aspecto    | Virtual Scroll     | Paginacion tradicional |
| ---------- | ------------------ | ---------------------- |
| Experiencia | Scroll continuo (mejor) | Requiere cambiar pagina (interrupcion) |
| Rendimiento | Solo renderiza area visible | Renderiza toda la pagina |
| Dificultad | Mas complejo       | Simple                 |
| SEO        | Menos favorable    | Mas favorable          |
| Accesibilidad | Tratamiento especial | Soporte nativo       |

**Recomendaciones:**

- Sistemas back-office, Dashboard → Virtual Scroll
- Sitios web publicos, blogs → Paginacion tradicional
- Solucion hibrida: Virtual Scroll + boton "Cargar mas"
