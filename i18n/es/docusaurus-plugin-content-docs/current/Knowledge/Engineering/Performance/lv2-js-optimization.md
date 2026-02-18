---
id: performance-lv2-js-optimization
title: '[Lv2] Optimización de rendimiento JavaScript: Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Mediante técnicas como Debounce, Throttle, Time Slicing y requestAnimationFrame, se optimiza el rendimiento de las operaciones JavaScript y se mejora la experiencia del usuario.

---

## Contexto del problema

En el proyecto de plataforma, los usuarios realizan frecuentemente las siguientes operaciones:

- **Busqueda** (filtrado en tiempo real de 3000+ productos al escribir palabras clave)
- **Desplazamiento de listas** (seguimiento de posición al desplazar, carga de más contenido)
- **Cambio de categorías** (filtrar para mostrar tipos específicos de productos)
- **Efectos de animación** (desplazamiento suave, efectos de regalos)

Sin optimización, estas operaciones causan congelamiento de la página y alto uso de CPU.

---

## Estrategia 1: Debounce - Optimización de entrada de búsqueda

```javascript
import { useDebounceFn } from '@vueuse/core';

// Función Debounce: Si se escribe de nuevo dentro de 500ms, se reinicia el temporizador
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // Solo se ejecuta 500ms después de dejar de escribir
  }
);
```

```md
Antes de optimizar: Escribir "slot game" (9 caracteres)

- Se activan 9 busquedas
- Filtrar 3000 juegos × 9 veces = 27,000 operaciones
- Tiempo: ~1.8 segundos (página se congela)

Después de optimizar: Escribir "slot game"

- Se activa 1 búsqueda (después de dejar de escribir)
- Filtrar 3000 juegos × 1 vez = 3,000 operaciones
- Tiempo: ~0.2 segundos
- Mejora de rendimiento: 90%
```

## Estrategia 2: Throttle - Optimización de eventos de desplazamiento

> Escenario de aplicación: Seguimiento de posición de scroll, carga infinita

```javascript
import { throttle } from 'lodash';

// Función Throttle: Solo se ejecuta 1 vez cada 100ms
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
Antes de optimizar:

- Evento de scroll se activa 60 veces por segundo (60 FPS)
- Cada activacion calcula la posicion de scroll
- Tiempo: ~600ms (página se congela)

Después de optimizar:

- Evento de scroll máximo 1 vez por segundo (solo 1 ejecución cada 100ms)
- Tiempo: ~100ms
- Mejora de rendimiento: 90%
```

## Estrategia 3: Time Slicing - Procesamiento de grandes volúmenes de datos

> Escenario de aplicación: Nube de tags, combinación de menus, filtrado de 3000+ juegos, renderizado de historial de transacciones

```javascript
// Función personalizada de Time Slicing
function processInBatches(
  array: GameList, // 3000 juegos
  batchSize: number, // 200 por lote
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // Procesamiento completado

    const batch = array.slice(index, index + batchSize); // División
    callback(batch); // Procesar este lote
    index += batchSize;

    setTimeout(processNextBatch, 0); // Siguiente lote en la cola de microtareas
  }

  processNextBatch();
}
```

Ejemplo de uso:

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // Dividir 3000 juegos en 15 lotes de 200 cada uno
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

## Estrategia 4: requestAnimationFrame - Optimización de animaciones

> Escenario de aplicación: Desplazamiento suave, animaciones Canvas, efectos de regalos

```javascript
const scrollToTopAnimated = (el: any, speed = 500) => {
  const startPosition = el.scrollTop;
  const duration = speed;
  let startTime = null;

  // Uso de Easing Function (función de suavizado)
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(
      timeElapsed,
      startPosition,
      -startPosition,
      duration
    );
    el.scrollTop = run;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll); // Llamada recursiva
    }
  };

  requestAnimationFrame(animateScroll);
};
```

Por qué usar requestAnimationFrame?

```javascript
// Forma incorrecta: usar setInterval
setInterval(() => {
  el.scrollTop += 10;
}, 16); // Objetivo 60fps (1000ms / 60 ≈ 16ms)
// Problemas:
// 1. No se sincroniza con el repintado del navegador (puede ejecutarse múltiples veces entre repintados)
// 2. Se ejecuta incluso en pestanas en segundo plano (desperdicio de recursos)
// 3. Puede causar pérdida de frames (Jank)

// Forma correcta: usar requestAnimationFrame
requestAnimationFrame(animateScroll);
// Ventajas:
// 1. Sincronizado con el repintado del navegador (60fps o 120fps)
// 2. Se pausa automáticamente cuando la pestana no es visible (ahorro de energía)
// 3. Más fluido, sin pérdida de frames
```

---

## Puntos clave para entrevistas

### Debounce vs Throttle

| Característica | Debounce                       | Throttle                        |
| -------------- | ------------------------------ | ------------------------------- |
| Momento de activación | Espera un tiempo tras detener la operación | Solo se ejecuta 1 vez en un intervalo fijo |
| Escenario de uso | Entrada de búsqueda, resize de ventana | Eventos de scroll, movimiento del ratón |
| Número de ejecuciones | Puede no ejecutarse (si se activa continuamente) | Ejecución garantizada (frecuencia fija) |
| Latencia | Hay latencia (espera a que se detenga) | Ejecución inmediata, luego se limita |

### Time Slicing vs Web Worker

| Característica | Time Slicing                   | Web Worker                      |
| -------------- | ------------------------------ | ------------------------------- |
| Entorno de ejecución | Hilo principal              | Hilo en segundo plano           |
| Escenario de uso | Tareas que necesitan manipular DOM | Tareas de cálculo puro         |
| Complejidad de implementación | Relativamente simple | Relativamente complejo (requiere comunicación) |
| Mejora de rendimiento | Evita bloquear hilo principal | Computo verdaderamente paralelo |

### Preguntas frecuentes de entrevista

**P: Cómo elegir entre Debounce y Throttle?**

R: Según el escenario:

- **Debounce**: Adecuado para escenarios de "esperar a que el usuario complete la operación" (como entrada de búsqueda)
- **Throttle**: Adecuado para escenarios de "actualización continua pero no tan frecuente" (como seguimiento de scroll)

**P: Cómo elegir entre Time Slicing y Web Worker?**

R:

- **Time Slicing**: Cuando se necesita manipular DOM o procesamiento de datos simple
- **Web Worker**: Calculo puro, procesamiento de grandes volúmenes de datos, sin necesidad de manipular DOM

**P: Cuáles son las ventajas de requestAnimationFrame?**

R:

1. Sincronizado con el repintado del navegador (60fps)
2. Se pausa automáticamente cuando la pestana no es visible (ahorro de energía)
3. Evita pérdida de frames (Jank)
4. Rendimiento superior a setInterval/setTimeout
