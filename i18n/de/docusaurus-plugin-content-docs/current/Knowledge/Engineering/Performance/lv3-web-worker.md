---
id: performance-lv3-web-worker
title: '[Lv3] Web Worker Anwendung: Hintergrundberechnung ohne UI-Blockierung'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker** ist eine API, die JavaScript in einem Hintergrund-Thread des Browsers ausfuehrt und zeitaufwaendige Berechnungen ermoeglicht, ohne den Hauptthread (UI-Thread) zu blockieren.

## Kernkonzept

### Problemhintergrund

JavaScript ist urspruenglich **single-threaded**, der gesamte Code wird im Hauptthread ausgefuehrt:

```javascript
// Zeitaufwaendige Berechnung blockiert den Hauptthread
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // Komplexe Berechnung
  }
  return result;
}

// Die gesamte Seite friert waehrend der Ausfuehrung ein
const result = heavyComputation(); // UI kann nicht interagieren
```

**Problem:**

- Seite eingefroren, Benutzer kann nicht klicken oder scrollen
- Animationen stoppen
- Extrem schlechte Benutzererfahrung

### Web Worker Loesung

Web Worker bietet **Multi-Threading**-Faehigkeit fuer zeitaufwaendige Aufgaben im Hintergrund:

```javascript
// Worker fuer Hintergrundausfuehrung verwenden
const worker = new Worker('worker.js');

// Hauptthread blockiert nicht, Seite bleibt interaktiv
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('Hintergrundberechnung abgeschlossen:', e.data);
};
```

---

## Szenario 1: Verarbeitung großer Datenmengen

```javascript
// main.js
const worker = new Worker('worker.js');

// Große JSON-Daten verarbeiten
worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('Verarbeitungsergebnis:', e.data);
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

## Szenario 2: Bildverarbeitung

Bildfilter, Komprimierung, Pixeloperationen - ohne UI-Einfrieren.

## Szenario 3: Komplexe Berechnungen

Mathematische Operationen (Primzahlenberechnung, Verschluesselung/Entschluesselung)
Hash-Berechnung großer Dateien
Datenanalyse und Statistik

## Einschraenkungen und Hinweise

### Was im Worker NICHT geht

- Direkte DOM-Manipulation
- Zugriff auf window, document, parent Objekte
- Verwendung bestimmter Web APIs (wie alert)

### Was im Worker GEHT

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- Timer (setTimeout, setInterval)
- Einige Browser-APIs

```javascript
// Situationen, in denen Worker NICHT sinnvoll ist
// 1. Einfache, schnelle Berechnungen (Worker-Erstellung hat Overhead)
const result = 1 + 1; // Braucht keinen Worker

// 2. Haeufige Kommunikation mit dem Hauptthread noetig
// Kommunikationskosten koennen den Multi-Threading-Vorteil aufheben

// Situationen, in denen Worker sinnvoll ist
// 1. Einmalige laengere Berechnung
const result = calculatePrimes(1000000);

// 2. Batch-Verarbeitung großer Datenmengen
const processed = largeArray.map(complexOperation);
```

---

## Reale Projektanwendungsfaelle

### Fall: Verschluesselungsverarbeitung von Spieldaten

Auf der Spieleplattform muessen sensible Daten ver-/entschluesselt werden:

```javascript
// main.js - Hauptthread
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
// Seite friert nicht ein, Benutzer kann weiter operieren

// crypto-worker.js - Worker Thread
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

### Fall: Filterung großer Spieldatenmengen

```javascript
const filterWorker = new Worker('/workers/game-filter.js');

const filters = {
  provider: ['PG', 'PP', 'EVO'],
  type: ['slot', 'live'],
  minRTP: 96.5,
  tags: ['popular', 'new'],
};

filterWorker.postMessage({
  games: allGames, // 3000+ Spiele
  filters: filters,
});

filterWorker.onmessage = (e) => {
  displayGames(e.data.filtered);
};

// Hauptthread friert nicht ein, Benutzer kann weiter scrollen und klicken
```

---

## Interview-Schwerpunkte

### Haeufige Interview-Fragen

**F1: Wie kommunizieren Web Worker und Hauptthread?**

A: Ueber `postMessage` und `onmessage`:

```javascript
// Hauptthread -> Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker -> Hauptthread
self.postMessage({ type: 'RESULT', result: processedData });

// Hinweis: Daten werden "strukturiert geklont" (Structured Clone)
// Uebertragbar: Number, String, Object, Array, Date, RegExp
// Nicht uebertragbar: Function, DOM-Elemente, Symbol
```

**F2: Was ist der Performance-Overhead von Web Worker?**

A: Zwei Hauptkosten:

```javascript
// 1. Worker-Erstellungskosten (ca. 30-50ms)
const worker = new Worker('worker.js'); // Muss Datei laden

// 2. Kommunikationskosten (Datenkopie)
worker.postMessage(largeData); // Große Datenkopie braucht Zeit

// Loesungen:
// 1. Worker wiederverwenden (nicht jedes Mal neu erstellen)
// 2. Transferable Objects verwenden (Eigentumsuebergabe, keine Kopie)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // Eigentum uebertragen
```

**F3: Was sind Transferable Objects?**

A: Datenbesitz uebertragen statt kopieren:

```javascript
// Normaler Ansatz: Daten kopieren (langsam)
const largeArray = new Uint8Array(10000000); // 10MB
worker.postMessage(largeArray); // 10MB kopieren (zeitaufwaendig)

// Transferable: Eigentum uebertragen (schnell)
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // Eigentum uebertragen (Millisekunden)

// Achtung: Nach der Uebertragung kann der Hauptthread die Daten nicht mehr verwenden
console.log(largeArray.length); // 0 (bereits uebertragen)
```

**Unterstuetzte Transferable-Typen:**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**F4: Wann sollte man Web Worker verwenden?**

A: Entscheidungsbaum:

```
Ist es eine zeitaufwaendige Berechnung (> 50ms)?
|- Nein -> Kein Worker noetig
|- Ja -> Weiter pruefen
    |
    |- Muss DOM manipuliert werden?
    |   |- Ja -> Worker nicht moeglich (requestIdleCallback erwaegen)
    |   |- Nein -> Weiter pruefen
    |
    |- Ist die Kommunikationsfrequenz hoch (> 60 Mal/Sekunde)?
        |- Ja -> Vermutlich nicht geeignet (Kommunikationsoverhead)
        |- Nein -> Geeignet fuer Worker
```

**Geeignete Szenarien:**

- Verschluesselung/Entschluesselung
- Bildverarbeitung (Filter, Komprimierung)
- Sortierung/Filterung großer Datenmengen
- Komplexe mathematische Berechnungen
- Datei-Parsing (JSON, CSV)

**Nicht geeignete Szenarien:**

- Einfache Berechnungen (Overhead groesser als Nutzen)
- Haeufige Kommunikation noetig
- DOM-Manipulation noetig
- Nicht unterstuetzte APIs noetig

**F5: Welche Typen von Web Worker gibt es?**

A: Drei Typen:

```javascript
// 1. Dedicated Worker (dediziert)
const worker = new Worker('worker.js');
// Kann nur mit der erstellenden Seite kommunizieren

// 2. Shared Worker (geteilt)
const sharedWorker = new SharedWorker('shared-worker.js');
// Kann von mehreren Seiten/Tabs geteilt werden

// 3. Service Worker (Dienst)
navigator.serviceWorker.register('sw.js');
// Fuer Cache, Offline-Unterstuetzung, Push-Benachrichtigungen
```

**Vergleich:**

| Eigenschaft | Dedicated | Shared | Service |
| ----------- | --------- | ------ | ------- |
| Sharing | Einzelne Seite | Mehrere Seiten | Gesamte Website |
| Lebenszyklus | Schließt mit der Seite | Letzte Seite schließt | Unabhaengig von Seite |
| Hauptverwendung | Hintergrundberechnung | Seitenuebergreifende Kommunikation | Cache, Offline |

**F6: Wie debuggt man Web Worker?**

A: Chrome DevTools unterstuetzt:

```javascript
// 1. Im Sources-Panel sind Worker-Dateien sichtbar
// 2. Breakpoints koennen gesetzt werden
// 3. Code kann in der Console ausgefuehrt werden

// Nuetzlicher Tipp: console im Worker verwenden
self.addEventListener('message', (e) => {
  console.log('Worker empfangen:', e.data);
  // Im DevTools Console sichtbar
});

// Fehlerbehandlung
worker.onerror = (error) => {
  console.error('Worker-Fehler:', error.message);
  console.error('Datei:', error.filename);
  console.error('Zeile:', error.lineno);
};
```

---

## Performance-Vergleich

### Reale Testdaten (Verarbeitung von 1 Million Eintraegen)

| Methode | Ausfuehrungszeit | UI friert ein? | Speicher-Spitze |
| ------- | ---------------- | -------------- | --------------- |
| Hauptthread (synchron) | 2,5 s | Komplett eingefroren | 250 MB |
| Hauptthread (Time Slicing) | 3,2 s | Gelegentliches Ruckeln | 280 MB |
| Web Worker | 2,3 s | Komplett fluessig | 180 MB |

**Fazit:**

- Web Worker blockiert nicht nur die UI nicht, sondern ist auch schneller durch Multi-Core-Parallelitaet
- Weniger Speicherverbrauch (Hauptthread muss große Datenmengen nicht vorhalten)

---

## Verwandte Technologien

### Web Worker vs andere Loesungen

```javascript
// 1. setTimeout (Pseudo-Asynchron)
setTimeout(() => heavyTask(), 0);
// Immer noch im Hauptthread, wird ruckeln

// 2. requestIdleCallback (Ausfuehrung in Leerlaufzeit)
requestIdleCallback(() => heavyTask());
// Nur in Leerlaufzeiten, keine Abschlussgarantie

// 3. Web Worker (echtes Multi-Threading)
worker.postMessage(task);
// Echt parallel, blockiert UI nicht
```

### Fortgeschritten: Worker-Kommunikation mit Comlink vereinfachen

[Comlink](https://github.com/GoogleChromeLabs/comlink) laesst Worker wie normale Funktionen verwenden:

```javascript
// Traditionell (umstaendlich)
worker.postMessage({ action: 'add', a: 1, b: 2 });
worker.onmessage = (e) => console.log(e.data);

// Mit Comlink (schlank)
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap(worker);

// Wie eine normale Funktion aufrufen
const result = await api.add(1, 2);
console.log(result); // 3
```

---

## Lernempfehlungen

**Interview-Vorbereitung:**

1. Verstehen, "warum Worker noetig ist" (Single-Thread-Problem)
2. Wissen, "wann man ihn verwendet" (zeitaufwaendige Berechnung)
3. "Kommunikationsmechanismus" verstehen (postMessage)
4. "Einschraenkungen" kennen (kein DOM-Zugriff)
5. Mindestens einen Worker-Fall implementiert haben

**Praxistipps:**

- Mit einfachen Faellen beginnen (z.B. Primzahlenberechnung)
- Chrome DevTools zum Debuggen nutzen
- Performance-Unterschiede messen
- Tools wie Comlink in Betracht ziehen

---

## Verwandte Themen

- [Routing-Optimierung ->](/docs/experience/performance/lv1-route-optimization)
- [Bildladungsoptimierung ->](/docs/experience/performance/lv1-image-optimization)
- [Virtual Scroll Implementierung ->](/docs/experience/performance/lv3-virtual-scroll)
- [Optimierungsstrategien fuer große Datenmengen ->](/docs/experience/performance/lv3-large-data-optimization)
