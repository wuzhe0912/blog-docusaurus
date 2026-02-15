---
id: performance-lv3-virtual-scroll
title: '[Lv3] Virtual Scroll Implementierung: Umgang mit großen Datenmengen beim Rendering'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Wenn eine Seite 1000+ Datensaetze rendern muss, kann Virtual Scroll die DOM-Knoten von 1000+ auf 20-30 reduzieren, mit 80% weniger Speicherverbrauch.

---

## Interview-Szenario

**F: Wenn die Seite mehr als eine Tabelle hat, jede mit ueber hundert Eintraegen, und es haeufig DOM-aktualisierende Events gibt - welche Methode wuerden Sie zur Performance-Optimierung verwenden?**

---

## Problemanalyse (Situation)

### Reales Projektszenario

Im Plattformprojekt haben wir Seiten mit großen Datenmengen:

```markdown
Seite mit Transaktionsverlauf
- Einzahlungstabelle: 1000+ Eintraege
- Auszahlungstabelle: 800+ Eintraege
- Wetttabelle: 5000+ Eintraege
- Jeder Eintrag hat 8-10 Felder (Zeit, Betrag, Status etc.)

Probleme ohne Optimierung
- DOM-Knoten: 1000 Eintraege x 10 Felder = 10.000+ Knoten
- Speicherverbrauch: ca. 150-200 MB
- Erstrendering-Zeit: 3-5 Sekunden (weißer Bildschirm)
- Scroll-Ruckeln: FPS < 20
- WebSocket-Updates: gesamte Tabelle wird neu gerendert (sehr langsam)
```

### Schwere des Problems

```javascript
// Traditioneller Ansatz
<tr v-for="record in allRecords">  // 1000+ Eintraege alle gerendert
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8-10 Felder
</tr>

// Ergebnis:
// - Initiales Rendering: 10.000+ DOM-Knoten
// - Fuer Benutzer sichtbar: 20-30 Eintraege
// - Verschwendung: 99% der Knoten sieht der Benutzer nie
```

---

## Loesung (Action)

### Virtual Scrolling

Beim Virtual Scroll gibt es zwei Richtungen: die offiziell unterstuetzte Drittanbieter-Bibliothek [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller) verwenden, oder selbst implementieren. Unter Beruecksichtigung der realen Entwicklungskosten und abgedeckten Szenarien wuerde ich die offiziell unterstuetzte Bibliothek bevorzugen.

```js
// Nur sichtbare Zeilen rendern, z.B.:
// - 100 Eintraege, nur die sichtbaren 20 rendern
// - Drastische Reduzierung der DOM-Knoten
```

### Datenaktualisierungsfrequenz-Kontrolle

> Loesung 1: requestAnimationFrame (RAF)
> Konzept: Der Browser zeichnet maximal 60 Mal pro Sekunde (60 FPS) neu. Schnellere Updates sind fuer das Auge unsichtbar, daher passen wir uns der Bildschirmaktualisierungsrate an.

```js
// Vorher: sofortige Aktualisierung bei Datenempfang (moeglicherweise 100 Mal/Sekunde)
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

Loesung 2: Throttle
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
// 1. v-memo - selten aendernde Spalten memoieren
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // Nur bei Aenderung dieser Felder neu rendern
</tr>

// 2. Statische Daten einfrieren, um reaktiven Overhead zu vermeiden
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef fuer große Arrays
const tableData = shallowRef([...])  // Nur das Array verfolgen, nicht die inneren Objekte

// 4. key fuer optimierten Diff-Algorithmus verwenden
<tr v-for="row in data" :key="row.id">  // Stabiler key
```

### DOM-Rendering-Optimierung

```scss
// CSS transform statt top/left verwenden
.row-update {
  transform: translateY(0); /* GPU-Beschleunigung ausloesen */
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

### Haeufige Erweiterungsfragen

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
    showError('Verbindung nicht moeglich, bitte Seite neu laden');
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
- Keine native Browsersuche moeglich (Ctrl+F)
- Keine "Alles auswaehlen"-Funktion (Sonderbehandlung noetig)
- Hoehere Implementierungskomplexitaet
- Feste Hoehe oder Vorberechnung noetig
- Barrierefreiheit erfordert zusaetzliche Behandlung

Geeignete Szenarien
- Datenmenge > 100 Eintraege
- Aehnliche Datenstruktur pro Eintrag (feste Hoehe)
- Hochperformantes Scrollen noetig
- Hauptsaechlich Ansicht (nicht Bearbeitung)

Nicht geeignete Szenarien
- Datenmenge < 50 Eintraege (Over-Engineering)
- Variable Hoehe (schwierige Implementierung)
- Viel Interaktion noetig (Mehrfachauswahl, Drag & Drop)
- Gesamte Tabelle drucken noetig
```

**F: Wie optimiert man Listen mit variabler Hoehe?**
A: Virtual Scroll mit dynamischer Hoehe verwenden:

```javascript
// Option 1: geschaetzte Hoehe + tatsaechliche Messung
const estimatedHeight = 50;
const measuredHeights = {};

onMounted(() => {
  const elements = document.querySelectorAll('.list-item');
  elements.forEach((el, index) => {
    measuredHeights[index] = el.offsetHeight;
  });
});

// Option 2: Bibliothek mit dynamischer Hoehenunterstuetzung
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
| Benutzererfahrung | Durchgaengiges Scrollen (besser) | Seitenwechsel noetig (unterbrochen) |
| Performance | Rendert immer nur sichtbaren Bereich | Rendert ganze Seite |
| Implementierungskomplexitaet | Komplexer | Einfach |
| SEO-freundlich | Schlechter | Besser |
| Barrierefreiheit | Sonderbehandlung noetig | Native Unterstuetzung |

**Empfehlung:**

- Backend-Systeme, Dashboard -> Virtual Scroll
- Oeffentliche Websites, Blogs -> Traditionelle Paginierung
- Hybridloesung: Virtual Scroll + "Mehr laden"-Button
