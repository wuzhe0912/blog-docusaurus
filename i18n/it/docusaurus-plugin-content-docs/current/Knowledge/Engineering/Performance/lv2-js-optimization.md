---
id: performance-lv2-js-optimization
title: '[Lv2] Ottimizzazione del Runtime JavaScript: Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Ottimizzare il costo del runtime JavaScript controllando la frequenza, pianificando le attività pesanti e prevenendo il blocco del thread principale.

---

## 1. Debounce per input a raffica

Utilizzare il debounce quando aggiornamenti frequenti devono essere eseguiti solo dopo una pausa dell'utente.

```ts
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
```

Casi d'uso:

- Filtraggio dell'input di ricerca
- Suggerimenti API
- Validazione in tempo reale

## 2. Throttle per eventi continui

Utilizzare il throttle quando gli eventi sono continui e devono essere eseguiti a una frequenza fissa.

```ts
function throttle<T extends (...args: any[]) => void>(fn: T, wait = 100) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```

Casi d'uso:

- Aggiornamenti della posizione di scroll
- Ricalcolo al ridimensionamento
- Tracciamento del movimento del mouse

## 3. `requestAnimationFrame` per aggiornamenti visivi

```ts
let rafId = 0;
window.addEventListener('scroll', () => {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    updateStickyHeader();
  });
});
```

Allinea gli aggiornamenti visivi con i cicli di rendering del browser.

## 4. Time slicing per cicli di grandi dimensioni

```ts
async function processInChunks<T>(items: T[], chunkSize = 500) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(handleItem);
    await new Promise((r) => setTimeout(r, 0));
  }
}
```

Mantiene la UI reattiva durante elaborazioni pesanti.

## 5. Delegare il lavoro pesante al Web Worker

```ts
const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
worker.postMessage({ action: 'aggregate', payload: largeData });
worker.onmessage = (event) => {
  renderResult(event.data);
};
```

Il thread principale rimane interattivo mentre il calcolo viene eseguito in background.

## 6. Prima misurare

Tracciare i miglioramenti con:

- Pannello Performance (long task)
- Web Vitals
- Mark/measure personalizzati

```ts
performance.mark('filter-start');
runFilter();
performance.mark('filter-end');
performance.measure('filter-cost', 'filter-start', 'filter-end');
```

## Riepilogo per il colloquio

> Utilizzo debounce per input a raffica, throttle per eventi continui, `requestAnimationFrame` per aggiornamenti visivi, time slicing per cicli di grandi dimensioni e Web Worker per attività ad alto utilizzo di CPU. Verifico i miglioramenti con metriche di performance concrete.
