---
id: performance-lv3-virtual-scroll
title: '[Lv3] Virtual Scrolling: Rendering Efficiente di Liste di Grandi Dimensioni'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Il virtual scrolling mantiene la dimensione del DOM ridotta renderizzando solo la finestra visibile più un buffer.

---

## Situazione

Le tabelle di grandi dimensioni con aggiornamenti frequenti possono generare decine di migliaia di nodi DOM, causando:

- Rendering iniziale lento
- Scatti durante lo scroll
- Elevato utilizzo di memoria
- Aggiornamenti costosi durante eventi in tempo reale

## Concetto chiave

Invece di renderizzare tutte le righe, renderizzare solo:

- Le righe visibili
- Un piccolo overscan prima e dopo il viewport

Quando la posizione di scroll cambia, riciclare i contenitori delle righe e aggiornare la finestra di dati visualizzata.

## Implementazione base (altezza riga fissa)

```ts
const rowHeight = 48;
const viewportHeight = 480;
const visibleCount = Math.ceil(viewportHeight / rowHeight);

const startIndex = Math.floor(scrollTop / rowHeight);
const endIndex = startIndex + visibleCount + 6; // overscan
```

```tsx
<div style={{ height: totalRows * rowHeight }}>
  <div style={{ transform: `translateY(${startIndex * rowHeight}px)` }}>
    {rows.slice(startIndex, endIndex).map(renderRow)}
  </div>
</div>
```

## Considerazioni per altezze riga variabili

Per contenuti dinamici:

- Misurare le altezze delle righe in modo lazy
- Mantenere offset con somme dei prefissi
- Utilizzare la ricerca binaria per mappare `scrollTop` all'indice

Se le altezze delle righe variano molto, il supporto di una libreria è generalmente più sicuro.

## Problemi di interazione e soluzioni

- Mantenere chiavi stabili per prevenire rimontaggio non necessario
- Memoizzare i componenti delle righe
- Applicare debounce agli effetti collaterali pesanti dagli eventi di scroll
- Preservare l'ancora di scroll quando la lista si aggiorna

## Quando evitare il virtual scroll

- Dataset piccoli (la complessità potrebbe non valere la pena)
- Scenari che richiedono tutti i nodi DOM per operazioni native del browser
- Layout altamente irregolari difficili da misurare

## Riepilogo per il colloquio

> Applico il virtual scrolling quando il numero di righe è elevato e il costo di rendering domina. La chiave è il rendering a finestra con overscan, chiavi stabili e una strategia di aggiornamento attenta affinché lo scroll rimanga fluido sotto frequenti cambiamenti dei dati.
