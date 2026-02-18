---
id: performance-lv3-web-worker
title: '[Lv3] Aplicación de Web Worker: Computo en segundo plano sin bloquear la UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker** es una API que ejecuta JavaScript en un hilo en segundo plano del navegador, permitiendo realizar operaciones costosas sin bloquear el hilo principal (hilo de UI).

## Concepto central

### Contexto del problema

JavaScript es originalmente **de hilo único**, todo el código se ejecuta en el hilo principal:

```javascript
// ❌ Operación costosa bloquea el hilo principal
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // Calculo complejo
  }
  return result;
}

// Al ejecutarse, toda la página se congela
const result = heavyComputation(); // UI no puede interactuar
```

**Problemas:**

- La página se congela, el usuario no puede hacer clic ni desplazarse
- Las animaciones se detienen
- Experiencia de usuario muy mala

### Solución con Web Worker

Web Worker proporciona capacidad **multi-hilo**, permitiendo ejecutar tareas costosas en segundo plano:

```javascript
// ✅ Usar Worker para ejecutar en segundo plano
const worker = new Worker('worker.js');

// El hilo principal no se bloquea, la página sigue siendo interactiva
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('Operacion en segundo plano completada:', e.data);
};
```

---

## Escenario 1: Procesamiento de grandes volúmenes de datos

```javascript
// main.js
const worker = new Worker('worker.js');

// Procesar datos JSON grandes
worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('Resultado:', e.data);
};

// worker.js
self.onmessage = function (e) {
  const { data, action } = e.data;

  if (action === 'process') {
    const result = data.map((item) => {
      return heavyComputation(item);
    });

    self.postMessage(result);
  }
};
```

## Escenario 2: Procesamiento de imágenes

Procesamiento de filtros, compresion y operaciones de pixeles sin congelar la UI.

## Escenario 3: Calculos complejos

Operaciones matemáticas (cálculo de números primos, cifrado/descifrado)
Calculo de hash de archivos grandes
Analisis de datos y estadísticas

## Limitaciones y precauciones

### Lo que NO se puede hacer en un Worker

- Manipular el DOM directamente
- Acceder a objetos window, document, parent
- Usar ciertas Web APIs (como alert)

### Lo que SI se puede usar en un Worker

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- Temporizadores (setTimeout, setInterval)
- Algunas APIs del navegador

```javascript
// Casos donde NO conviene usar Worker
// 1. Calculos simples y rapidos (crear un Worker tiene overhead)
const result = 1 + 1; // No necesita Worker

// 2. Comunicación frecuente con el hilo principal
// El costo de comunicación puede superar la ventaja del multi-hilo

// Casos donde SI conviene usar Worker
// 1. Una sola operación de larga duración
const result = calculatePrimes(1000000);

// 2. Procesamiento por lotes de grandes volúmenes
const processed = largeArray.map(complexOperation);
```

---

## Caso de aplicación real

### Caso: Cifrado de datos de juego

En una plataforma de juegos, necesitamos cifrar/descifrar datos sensibles:

```javascript
// main.js - Hilo principal
const cryptoWorker = new Worker('/workers/crypto-worker.js');

function encryptPlayerData(data) {
  return new Promise((resolve, reject) => {
    cryptoWorker.postMessage({
      action: 'encrypt',
      data: data,
      key: SECRET_KEY,
    });

    cryptoWorker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.encrypted);
      } else {
        reject(e.data.error);
      }
    };
  });
}

const encrypted = await encryptPlayerData(sensitiveData);
// La página no se congela, el usuario puede seguir interactuando

// crypto-worker.js - Hilo Worker
self.onmessage = function (e) {
  const { action, data, key } = e.data;

  try {
    if (action === 'encrypt') {
      const encrypted = performHeavyEncryption(data, key);
      self.postMessage({ success: true, encrypted });
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
```

### Caso: Filtrado masivo de datos de juegos

```javascript
// Filtrado complejo en 3000+ juegos
const filterWorker = new Worker('/workers/game-filter.js');

const filters = {
  provider: ['PG', 'PP', 'EVO'],
  type: ['slot', 'live'],
  minRTP: 96.5,
  tags: ['popular', 'new'],
};

filterWorker.postMessage({
  games: allGames, // 3000+
  filters: filters,
});

filterWorker.onmessage = (e) => {
  displayGames(e.data.filtered);
};

// El hilo principal no se congela, el usuario puede seguir desplazandose y haciendo clic
```

---

## Puntos clave para entrevistas

### Preguntas frecuentes

**P1: Cómo se comunican Web Worker y el hilo principal?**

R: Mediante `postMessage` y `onmessage`:

```javascript
// Hilo principal → Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker → Hilo principal
self.postMessage({ type: 'RESULT', result: processedData });

// Nota: Los datos se "clonan estructuralmente" (Structured Clone)
// Esto significa:
// ✅ Se pueden enviar: Number, String, Object, Array, Date, RegExp
// ❌ No se pueden enviar: Function, elementos DOM, Symbol
```

**P2: Cuál es el overhead de rendimiento de Web Worker?**

R: Principalmente dos overheads:

```javascript
// 1. Overhead de creación del Worker (~30-50ms)
const worker = new Worker('worker.js'); // Necesita cargar archivo

// 2. Overhead de comunicación (copia de datos)
worker.postMessage(largeData); // Copiar datos grandes toma tiempo

// Soluciones:
// 1. Reutilizar Workers (no crear uno nuevo cada vez)
// 2. Usar Transferable Objects (transferir propiedad, sin copia)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // Transferir propiedad
```

**P3: Qué son los Transferable Objects?**

R: Transferir la propiedad de los datos en lugar de copiarlos:

```javascript
// ❌ Método normal: Copiar datos (lento)
const largeArray = new Uint8Array(10000000); // 10MB
worker.postMessage(largeArray); // Copia 10MB (costoso)

// ✅ Transferable: Transferir propiedad (rápido)
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // Transferir propiedad (milisegundos)

// Nota: Después de transferir, el hilo principal ya no puede usar esos datos
console.log(largeArray.length); // 0 (ya transferido)
```

**P4: Cuando se debe usar Web Worker?**

R: Arbol de decision:

```
Es una operacion costosa (> 50ms)?
├─ No → No necesita Worker
└─ Si → Seguir evaluando
    │
    ├─ Necesita manipular DOM?
    │   ├─ Si → No puede usar Worker (considerar requestIdleCallback)
    │   └─ No → Seguir evaluando
    │
    └─ La frecuencia de comunicacion es muy alta (> 60 veces/segundo)?
        ├─ Si → Probablemente no sea adecuado (overhead de comunicacion alto)
        └─ No → ✅ Adecuado para Worker
```

**Escenarios adecuados:**

- Cifrado/descifrado
- Procesamiento de imágenes (filtros, compresion)
- Ordenamiento/filtrado de grandes datos
- Calculos matematicos complejos
- Parseo de archivos (JSON, CSV)

**Escenarios no adecuados:**

- Calculos simples (overhead mayor que beneficio)
- Comunicación frecuente necesaria
- Manipulacion de DOM necesaria
- APIs no soportadas necesarias

**P5: Qué tipos de Web Worker existen?**

R: Tres tipos:

```javascript
// 1. Dedicated Worker (Dedicado)
const worker = new Worker('worker.js');
// Solo se comunica con la página que lo creo

// 2. Shared Worker (Compartido)
const sharedWorker = new SharedWorker('shared-worker.js');
// Puede ser compartido por múltiples páginas/pestanas

// 3. Service Worker (De servicio)
navigator.serviceWorker.register('sw.js');
// Usado para cache, soporte offline, notificaciones push
```

**Comparación:**

| Característica | Dedicated  | Shared           | Service    |
| -------------- | ---------- | ---------------- | ---------- |
| Compartibilidad | Página única | Múltiples páginas | Todo el sitio |
| Ciclo de vida  | Se cierra con la página | Al cerrar la última página | Independiente de la página |
| Uso principal  | Computo en segundo plano | Comunicación entre páginas | Cache, offline |

**P6: Cómo depurar Web Workers?**

R: Chrome DevTools lo soporta:

```javascript
// 1. En el panel Sources se pueden ver los archivos Worker
// 2. Se pueden establecer breakpoints
// 3. Se puede ejecutar código en la Console

// Consejo práctico: Usar console en el Worker
self.addEventListener('message', (e) => {
  console.log('Worker received:', e.data);
  // Visible en la Console de DevTools
});

// Manejo de errores
worker.onerror = (error) => {
  console.error('Worker error:', error.message);
  console.error('File:', error.filename);
  console.error('Line:', error.lineno);
};
```

---

## Comparativa de rendimiento

### Datos de prueba real (procesando 1 millon de registros)

| Método                  | Tiempo    | UI se congela? | Pico de memoria |
| ----------------------- | --------- | -------------- | --------------- |
| Hilo principal (síncrono) | 2.5s    | Completamente congelado | 250 MB |
| Hilo principal (Time Slicing) | 3.2s | Lag ocasional  | 280 MB          |
| Web Worker              | 2.3s      | Completamente fluido | 180 MB      |

**Conclusión:**

- Web Worker no solo no congela la UI, sino que es más rápido gracias al paralelismo multi-núcleo
- Menor uso de memoria (el hilo principal no necesita retener grandes volúmenes de datos)

---

## Tecnologías relacionadas

### Web Worker vs otras soluciones

```javascript
// 1. setTimeout (pseudo-asíncrono)
setTimeout(() => heavyTask(), 0);
// ❌ Sigue en el hilo principal, causara lag

// 2. requestIdleCallback (ejecutar en tiempo libre)
requestIdleCallback(() => heavyTask());
// ⚠️ Solo se ejecuta en tiempo libre, no garantiza completitud

// 3. Web Worker (verdadero multi-hilo)
worker.postMessage(task);
// ✅ Verdadero paralelismo, no bloquea UI
```

### Avanzado: Simplificar comunicación con Comlink

[Comlink](https://github.com/GoogleChromeLabs/comlink) permite usar Workers como funciones normales:

```javascript
// Forma tradicional (engorrosa)
worker.postMessage({ action: 'add', a: 1, b: 2 });
worker.onmessage = (e) => console.log(e.data);

// Con Comlink (conciso)
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap(worker);

// Usar como una llamada a función normal
const result = await api.add(1, 2);
console.log(result); // 3
```

---

## Guia de aprendizaje

**Preparacion para entrevistas:**

1. Entender "por que se necesitan Workers" (problema de hilo único)
2. Saber "cuando usarlos" (operaciones costosas)
3. Comprender "mecanismo de comunicación" (postMessage)
4. Conocer "limitaciones" (no puede manipular DOM)
5. Haber implementado al menos un caso con Worker

**Consejos practicos:**

- Comenzar con casos simples (como cálculo de primos)
- Usar Chrome DevTools para depurar
- Medir diferencias de rendimiento
- Considerar herramientas como Comlink

---

## Temas relacionados

- [Optimización a nivel de rutas →](/docs/experience/performance/lv1-route-optimization)
- [Optimización de carga de imágenes →](/docs/experience/performance/lv1-image-optimization)
- [Implementación de Virtual Scroll →](/docs/experience/performance/lv3-virtual-scroll)
- [Estrategias de optimización para grandes volúmenes de datos →](/docs/experience/performance/lv3-large-data-optimization)
