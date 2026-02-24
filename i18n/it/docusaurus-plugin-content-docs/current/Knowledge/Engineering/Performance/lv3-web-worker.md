---
id: performance-lv3-web-worker
title: '[Lv3] Web Worker in Pratica: Calcolo in Background Senza Bloccare la UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> Web Worker sposta la logica ad alto utilizzo di CPU dal thread principale in modo che la UI rimanga reattiva.

## 1. Perché Web Worker?

JavaScript sul thread principale è single-threaded per le attività UI. I calcoli pesanti possono bloccare le interazioni.

Candidati tipici:

- Parsing e trasformazione di grandi JSON
- Aggregazione/statistiche su array di grandi dimensioni
- Compressione, crittografia o elaborazione di immagini

## 2. Utilizzo base

### Thread principale

```ts
const worker = new Worker(new URL('./report.worker.ts', import.meta.url), { type: 'module' });

worker.postMessage({ type: 'AGGREGATE', payload: data });

worker.onmessage = (event) => {
  renderChart(event.data);
};
```

### Thread del Worker

```ts
self.onmessage = (event) => {
  const { type, payload } = event.data;
  if (type === 'AGGREGATE') {
    const result = compute(payload);
    self.postMessage(result);
  }
};
```

## 3. Pattern di scambio messaggi

- Request/response con `requestId`
- Eventi di progresso per attività lunghe
- Canale di errore con payload di errore strutturato

```ts
self.postMessage({ requestId, progress: 60 });
```

## 4. Oggetti trasferibili per grandi dati binari

Per `ArrayBuffer` di grandi dimensioni, trasferire la proprietà per evitare copie costose.

```ts
worker.postMessage({ bytes: buffer }, [buffer]);
```

## 5. Pattern worker pool

Per più attività pesanti, creare un piccolo pool di worker invece di generare worker illimitati.

Vantaggi:

- Utilizzo CPU prevedibile
- Migliore controllo della pianificazione
- Minor overhead di avvio

## 6. Vincoli e avvertenze

- I Worker non possono accedere direttamente al DOM
- Esiste un costo di serializzazione per lo structured clone
- Il debug è più difficile rispetto al codice del thread principale
- Non ogni attività dovrebbe essere spostata nei worker

## 7. Pulizia

Terminare sempre quando non più necessario.

```ts
worker.terminate();
```

## Riepilogo per il colloquio

> Utilizzo Web Worker per attività ad alto utilizzo di CPU che bloccherebbero le interazioni. Progetto protocolli di messaggi, uso oggetti trasferibili per grandi payload binari e mantengo il ciclo di vita del worker controllato con pulizia e limiti del pool.
