---
id: performance-lv3-virtual-scroll
title: '[Lv3] Virtual Scroll Implementierung: Umgang mit großen Datenmengen beim Rendering'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Wenn eine Seite 1000+ Datensätze rendern muss, kann Virtual Scroll die DOM-Knoten von 1000+ auf 20-30 reduzieren, mit 80% weniger Speicherverbrauch.

---

## Interview-Szenario

**F: Wenn die Seite mehr als eine Tabelle hat, jede mit über hundert Einträgen, und es häufig DOM-aktualisierende Events gibt - welche Methode würden Sie zur Performance-Optimierung verwenden?**

---

## Problemanalyse (Situation)

### Reales Projektszenario

Im Plattformprojekt haben wir Seiten mit großen Datenmengen:

```markdown
Seite mit Transaktionsverlauf
- Einzahlungstabelle: 1000+ Einträge
- Auszahlungstabelle: 800+ Einträge
- Wetttabelle: 5000+ Einträge
- Jeder Eintrag hat 8-10 Felder (Zeit, Betrag, Status etc.)

Probleme ohne Optimierung
- DOM-Knoten: 1000 Einträge x 10 Felder = 10.000+ Knoten
- Speicherverbrauch: ca. 150-200 MB
- Erstrendering-Zeit: 3-5 Sekunden (weißer Bildschirm)
- Scroll-Ruckeln: FPS < 20
- WebSocket-Updates: gesamte Tabelle wird neu gerendert (sehr langsam)
```

### Schwere des Problems

```javascript
// Traditioneller Ansatz
<tr v-for="record in allRecords">  // 1000+ Einträge alle gerendert
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8-10 Felder
</tr>

// Ergebnis:
// - Initiales Rendering: 10.000+ DOM-Knoten
// - Für Benutzer sichtbar: 20-30 Einträge
// - Verschwendung: 99% der Knoten sieht der Benutzer nie
```

---

## Lösung (Action)

### Virtual Scrolling

Beim Virtual Scroll gibt es zwei Richtungen: die offiziell unterstützte Drittanbieter-Bibliothek [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller) verwenden, oder selbst implementieren. Unter Berücksichtigung der realen Entwicklungskosten und abgedeckten Szenarien würde ich die offiziell unterstützte Bibliothek bevorzugen.

```js
// Nur sichtbare Zeilen rendern, z.B.:
// - 100 Einträge, nur die sichtbaren 20 rendern
// - Drastische Reduzierung der DOM-Knoten
```

### Datenaktualisierungsfrequenz-Kontrolle

> Lösung 1: requestAnimationFrame (RAF)
> Konzept: Der Browser zeichnet maximal 60 Mal pro Sekunde (60 FPS) neu. Schnellere Updates sind für das Auge unsichtbar, daher passen wir uns der Bildschirmaktualisierungsrate an.

```js
// Vorher: sofortige Aktualisierung bei Datenempfang (möglicherweise 100 Mal/Sekunde)
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// Verbessert: Daten sammeln, mit Bildschirmaktualisierungsrate aktualisieren (maximal 60 Mal/Sekunde)
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

Lösung 2: Throttle
Konzept: Aktualisierungsfrequenz erzwungen begrenzen, z.B. "maximal 1 Aktualisierung pro 100ms"

```js
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100);

socket.on('price', updatePrice);
```

### Vue3-spezifische Optimierungen

```js
// 1. v-memo - selten ändernde Spalten memoieren
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // Nur bei Änderung dieser Felder neu rendern
</tr>

// 2. Statische Daten einfrieren, um reaktiven Overhead zu vermeiden
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef für große Arrays
const tableData = shallowRef([...])  // Nur das Array verfolgen, nicht die inneren Objekte

// 4. key für optimierten Diff-Algorithmus verwenden
<tr v-for="row in data" :key="row.id">  // Stabiler key
```

### DOM-Rendering-Optimierung

```scss
// CSS transform statt top/left verwenden
.row-update {
  transform: translateY(0); /* GPU-Beschleunigung auslösen */
  will-change: transform; /* Browser-Hinweis zur Optimierung */
}

// CSS containment zur Isolierung des Render-Bereichs
.table-container {
  contain: layout style paint;
}
```

---

## Optimierungsergebnis (Result)

### Performance-Vergleich

| Indikator | Vorher | Nachher | Verbesserung |
| --------- | ------ | ------- | ------------ |
| DOM-Knoten | 10.000+ | 20-30 | -99,7% |
| Speicherverbrauch | 150-200 MB | 30-40 MB | -80% |
| Erstrendering | 3-5 s | 0,3-0,5 s | +90% |
| Scroll-FPS | < 20 | 55-60 | +200% |
| Aktualisierungsreaktion | 500-800 ms | 16-33 ms | +95% |

---

## Interview-Schwerpunkte

### Häufige Erweiterungsfragen

**F: Was wenn man keine Drittanbieter-Bibliotheken verwenden darf?**
A: Die Kernlogik des Virtual Scroll selbst implementieren:

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

**F: Wie geht man mit WebSocket-Reconnect um?**
A: Exponentielle Backoff-Strategie implementieren:

```javascript
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000;

function reconnect() {
  if (retryCount >= maxRetries) {
    showError('Verbindung nicht möglich, bitte Seite neu laden');
    return;
  }

  const delay = baseDelay * Math.pow(2, retryCount);

  setTimeout(() => {
    retryCount++;
    connectWebSocket();
  }, delay);
}

socket.on('connect', () => {
  retryCount = 0;
  syncData();
  showSuccess('Verbindung wiederhergestellt');
});
```

**F: Welche Nachteile hat Virtual Scroll?**
A: Trade-offs zu beachten:

```markdown
Nachteile
- Keine native Browsersuche möglich (Ctrl+F)
- Keine "Alles auswählen"-Funktion (Sonderbehandlung nötig)
- Höhere Implementierungskomplexität
- Feste Höhe oder Vorberechnung nötig
- Barrierefreiheit erfordert zusätzliche Behandlung

Geeignete Szenarien
- Datenmenge > 100 Einträge
- Ähnliche Datenstruktur pro Eintrag (feste Höhe)
- Hochperformantes Scrollen nötig
- Hauptsächlich Ansicht (nicht Bearbeitung)

Nicht geeignete Szenarien
- Datenmenge < 50 Einträge (Over-Engineering)
- Variable Höhe (schwierige Implementierung)
- Viel Interaktion nötig (Mehrfachauswahl, Drag & Drop)
- Gesamte Tabelle drucken nötig
```

**F: Wie optimiert man Listen mit variabler Höhe?**
A: Virtual Scroll mit dynamischer Höhe verwenden:

```javascript
// Option 1: geschätzte Höhe + tatsächliche Messung
const estimatedHeight = 50;
const measuredHeights = {};

onMounted(() => {
  const elements = document.querySelectorAll('.list-item');
  elements.forEach((el, index) => {
    measuredHeights[index] = el.offsetHeight;
  });
});

// Option 2: Bibliothek mit dynamischer Höhenunterstützung
<DynamicScroller
  :items="items"
  :min-item-size="50"
  :buffer="200"
/>
```

---

## Technischer Vergleich

### Virtual Scroll vs Paginierung

| Vergleichskriterium | Virtual Scroll | Traditionelle Paginierung |
| ------------------- | -------------- | ------------------------- |
| Benutzererfahrung | Durchgängiges Scrollen (besser) | Seitenwechsel nötig (unterbrochen) |
| Performance | Rendert immer nur sichtbaren Bereich | Rendert ganze Seite |
| Implementierungskomplexität | Komplexer | Einfach |
| SEO-freundlich | Schlechter | Besser |
| Barrierefreiheit | Sonderbehandlung nötig | Native Unterstützung |

**Empfehlung:**

- Backend-Systeme, Dashboard -> Virtual Scroll
- Öffentliche Websites, Blogs -> Traditionelle Paginierung
- Hybridlösung: Virtual Scroll + "Mehr laden"-Button
