---
id: performance-lv3-web-worker
title: '[Lv3] Web Worker Anwendung: Hintergrundberechnung ohne UI-Blockierung'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker** ist eine API, die JavaScript in einem Hintergrund-Thread des Browsers ausführt und zeitaufwändige Berechnungen ermöglicht, ohne den Hauptthread (UI-Thread) zu blockieren.

## Kernkonzept

### Problemhintergrund

JavaScript ist ursprünglich **single-threaded**, der gesamte Code wird im Hauptthread ausgeführt:

```javascript
// Zeitaufwändige Berechnung blockiert den Hauptthread
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // Komplexe Berechnung
  }
  return result;
}

// Die gesamte Seite friert während der Ausführung ein
const result = heavyComputation(); // UI kann nicht interagieren
```

**Problem:**

- Seite eingefroren, Benutzer kann nicht klicken oder scrollen
- Animationen stoppen
- Extrem schlechte Benutzererfahrung

### Web Worker Lösung

Web Worker bietet **Multi-Threading**-Fähigkeit für zeitaufwändige Aufgaben im Hintergrund:

```javascript
// Worker für Hintergrundausführung verwenden
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

Mathematische Operationen (Primzahlenberechnung, Verschlüsselung/Entschlüsselung)
Hash-Berechnung großer Dateien
Datenanalyse und Statistik

## Einschränkungen und Hinweise

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

// 2. Häufige Kommunikation mit dem Hauptthread nötig
// Kommunikationskosten können den Multi-Threading-Vorteil aufheben

// Situationen, in denen Worker sinnvoll ist
// 1. Einmalige längere Berechnung
const result = calculatePrimes(1000000);

// 2. Batch-Verarbeitung großer Datenmengen
const processed = largeArray.map(complexOperation);
```

---

## Reale Projektanwendungsfälle

### Fall: Verschlüsselungsverarbeitung von Spieldaten

Auf der Spieleplattform müssen sensible Daten ver-/entschlüsselt werden:

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

### Häufige Interview-Fragen

**F1: Wie kommunizieren Web Worker und Hauptthread?**

A: Über `postMessage` und `onmessage`:

```javascript
// Hauptthread -> Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker -> Hauptthread
self.postMessage({ type: 'RESULT', result: processedData });

// Hinweis: Daten werden "strukturiert geklont" (Structured Clone)
// Übertragbar: Number, String, Object, Array, Date, RegExp
// Nicht übertragbar: Function, DOM-Elemente, Symbol
```

**F2: Was ist der Performance-Overhead von Web Worker?**

A: Zwei Hauptkosten:

```javascript
// 1. Worker-Erstellungskosten (ca. 30-50ms)
const worker = new Worker('worker.js'); // Muss Datei laden

// 2. Kommunikationskosten (Datenkopie)
worker.postMessage(largeData); // Große Datenkopie braucht Zeit

// Lösungen:
// 1. Worker wiederverwenden (nicht jedes Mal neu erstellen)
// 2. Transferable Objects verwenden (Eigentumsübergabe, keine Kopie)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // Eigentum übertragen
```

**F3: Was sind Transferable Objects?**

A: Datenbesitz übertragen statt kopieren:

```javascript
// Normaler Ansatz: Daten kopieren (langsam)
const largeArray = new Uint8Array(10000000); // 10MB
worker.postMessage(largeArray); // 10MB kopieren (zeitaufwändig)

// Transferable: Eigentum übertragen (schnell)
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // Eigentum übertragen (Millisekunden)

// Achtung: Nach der Übertragung kann der Hauptthread die Daten nicht mehr verwenden
console.log(largeArray.length); // 0 (bereits übertragen)
```

**Unterstützte Transferable-Typen:**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**F4: Wann sollte man Web Worker verwenden?**

A: Entscheidungsbaum:

```
Ist es eine zeitaufwändige Berechnung (> 50ms)?
|- Nein -> Kein Worker nötig
|- Ja -> Weiter prüfen
    |
    |- Muss DOM manipuliert werden?
    |   |- Ja -> Worker nicht möglich (requestIdleCallback erwägen)
    |   |- Nein -> Weiter prüfen
    |
    |- Ist die Kommunikationsfrequenz hoch (> 60 Mal/Sekunde)?
        |- Ja -> Vermutlich nicht geeignet (Kommunikationsoverhead)
        |- Nein -> Geeignet für Worker
```

**Geeignete Szenarien:**

- Verschlüsselung/Entschlüsselung
- Bildverarbeitung (Filter, Komprimierung)
- Sortierung/Filterung großer Datenmengen
- Komplexe mathematische Berechnungen
- Datei-Parsing (JSON, CSV)

**Nicht geeignete Szenarien:**

- Einfache Berechnungen (Overhead größer als Nutzen)
- Häufige Kommunikation nötig
- DOM-Manipulation nötig
- Nicht unterstützte APIs nötig

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
// Für Cache, Offline-Unterstützung, Push-Benachrichtigungen
```

**Vergleich:**

| Eigenschaft | Dedicated | Shared | Service |
| ----------- | --------- | ------ | ------- |
| Sharing | Einzelne Seite | Mehrere Seiten | Gesamte Website |
| Lebenszyklus | Schließt mit der Seite | Letzte Seite schließt | Unabhängig von Seite |
| Hauptverwendung | Hintergrundberechnung | Seitenübergreifende Kommunikation | Cache, Offline |

**F6: Wie debuggt man Web Worker?**

A: Chrome DevTools unterstützt:

```javascript
// 1. Im Sources-Panel sind Worker-Dateien sichtbar
// 2. Breakpoints können gesetzt werden
// 3. Code kann in der Console ausgeführt werden

// Nützlicher Tipp: console im Worker verwenden
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

### Reale Testdaten (Verarbeitung von 1 Million Einträgen)

| Methode | Ausführungszeit | UI friert ein? | Speicher-Spitze |
| ------- | ---------------- | -------------- | --------------- |
| Hauptthread (synchron) | 2,5 s | Komplett eingefroren | 250 MB |
| Hauptthread (Time Slicing) | 3,2 s | Gelegentliches Ruckeln | 280 MB |
| Web Worker | 2,3 s | Komplett flüssig | 180 MB |

**Fazit:**

- Web Worker blockiert nicht nur die UI nicht, sondern ist auch schneller durch Multi-Core-Parallelität
- Weniger Speicherverbrauch (Hauptthread muss große Datenmengen nicht vorhalten)

---

## Verwandte Technologien

### Web Worker vs andere Lösungen

```javascript
// 1. setTimeout (Pseudo-Asynchron)
setTimeout(() => heavyTask(), 0);
// Immer noch im Hauptthread, wird ruckeln

// 2. requestIdleCallback (Ausführung in Leerlaufzeit)
requestIdleCallback(() => heavyTask());
// Nur in Leerlaufzeiten, keine Abschlussgarantie

// 3. Web Worker (echtes Multi-Threading)
worker.postMessage(task);
// Echt parallel, blockiert UI nicht
```

### Fortgeschritten: Worker-Kommunikation mit Comlink vereinfachen

[Comlink](https://github.com/GoogleChromeLabs/comlink) lässt Worker wie normale Funktionen verwenden:

```javascript
// Traditionell (umständlich)
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

1. Verstehen, "warum Worker nötig ist" (Single-Thread-Problem)
2. Wissen, "wann man ihn verwendet" (zeitaufwändige Berechnung)
3. "Kommunikationsmechanismus" verstehen (postMessage)
4. "Einschränkungen" kennen (kein DOM-Zugriff)
5. Mindestens einen Worker-Fall implementiert haben

**Praxistipps:**

- Mit einfachen Fällen beginnen (z.B. Primzahlenberechnung)
- Chrome DevTools zum Debuggen nutzen
- Performance-Unterschiede messen
- Tools wie Comlink in Betracht ziehen

---

## Verwandte Themen

- [Routing-Optimierung ->](/docs/experience/performance/lv1-route-optimization)
- [Bildladungsoptimierung ->](/docs/experience/performance/lv1-image-optimization)
- [Virtual Scroll Implementierung ->](/docs/experience/performance/lv3-virtual-scroll)
- [Optimierungsstrategien für große Datenmengen ->](/docs/experience/performance/lv3-large-data-optimization)
