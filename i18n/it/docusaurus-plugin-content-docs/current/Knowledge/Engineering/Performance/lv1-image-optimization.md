---
id: performance-lv1-image-optimization
title: '[Lv1] Ottimizzazione del Caricamento Immagini: Lazy Load a Quattro Livelli'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Una strategia di lazy loading delle immagini a quattro livelli che riduce significativamente il traffico della prima schermata e migliora la velocità di caricamento percepita.

---

## Situazione

Una pagina galleria può includere centinaia di immagini, ma gli utenti di solito visualizzano solo i primi elementi.

Problemi tipici senza ottimizzazione:

- Carico iniziale enorme dovuto alle richieste di immagini
- Tempo di caricamento lungo per la prima schermata
- Scatti durante lo scroll su dispositivi meno performanti
- Banda sprecata per immagini che gli utenti non vedono mai

## Obiettivo

1. Caricare solo le immagini vicine al viewport
2. Precaricare appena prima di entrare nella vista
3. Controllare le richieste di immagini concorrenti
4. Evitare download ridondanti durante la navigazione rapida
5. Mantenere il traffico delle immagini della prima schermata entro un budget rigoroso

## Azione: Strategia a quattro livelli

### Livello 1: Rilevamento della visibilità con IntersectionObserver

```ts
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadImage(entry.target as HTMLImageElement);
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '120px 0px', threshold: 0.01 }
);
```

Questo attiva il caricamento solo quando un'immagine è vicina alla vista.

### Livello 2: Placeholder ed esperienza progressiva

- Utilizzare miniature sfocate / placeholder skeleton
- Riservare larghezza/altezza per evitare spostamenti del layout
- Sostituire il placeholder dopo la decodifica dell'immagine

```html
<img src="/placeholder.webp" data-src="/real-image.webp" width="320" height="180" alt="cover" />
```

### Livello 3: Coda di concorrenza

```ts
const MAX_CONCURRENT = 6;
const queue: Array<() => Promise<void>> = [];
let active = 0;

async function runQueue() {
  if (active >= MAX_CONCURRENT || queue.length === 0) return;
  const task = queue.shift();
  if (!task) return;

  active += 1;
  try {
    await task();
  } finally {
    active -= 1;
    runQueue();
  }
}
```

Limita la pressione sulla rete ed evita picchi di richieste.

### Livello 4: Cancellazione e deduplicazione

- Annullare le richieste obsolete tramite `AbortController`
- Utilizzare una mappa in memoria a livello di URL per deduplicare i caricamenti
- Saltare le richieste già completate con successo

```ts
const inflight = new Map<string, Promise<void>>();
```

## Risultato

Impatto di esempio dopo il rilascio:

- Carico delle immagini della prima schermata ridotto drasticamente
- First meaningful paint più veloce
- Migliore fluidità durante lo scroll
- Minor tasso di abbandono sulle reti mobili

## Riepilogo per il colloquio

> Combino rilevamento del viewport, rendering dei placeholder, controllo della coda delle richieste e cancellazione/deduplicazione. Questo evita di caricare immagini che gli utenti non vedono mai e mantiene sia la rete che la UI reattive.
