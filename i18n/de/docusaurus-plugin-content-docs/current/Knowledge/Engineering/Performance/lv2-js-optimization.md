---
id: performance-lv2-js-optimization
title: '[Lv2] JavaScript-Rechenleistungsoptimierung: Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Durch Techniken wie Debounce, Throttle, Time Slicing und requestAnimationFrame wird die JavaScript-Rechenleistung optimiert und die Benutzererfahrung verbessert.

---

## Problemhintergrund

Im Plattformprojekt führen Benutzer häufig folgende Aktionen aus:

- **Suche** (Eingabe von Stichworten zur Echtzeitfilterung von 3000+ Produkten)
- **Listen scrollen** (Position verfolgen und mehr Inhalte beim Scrollen laden)
- **Kategorien wechseln** (Filtern zur Anzeige bestimmter Produkttypen)
- **Animationseffekte** (sanftes Scrollen, Geschenkeffekte)

Ohne Optimierung verursachen diese Aktionen Seitenruckeln und hohe CPU-Auslastung.

---

## Strategie 1: Debounce - Sucheingabeoptimierung

```javascript
import { useDebounceFn } from '@vueuse/core';

// Debounce-Funktion: bei erneuter Eingabe innerhalb von 500ms wird der Timer zurückgesetzt
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // Wird erst 500ms nach dem Aufhören der Eingabe ausgeführt
  }
);
```

```md
Vor der Optimierung: Eingabe von "slot game" (9 Zeichen)

- Löst 9 Suchen aus
- Filterung von 3000 Spielen x 9 Mal = 27.000 Operationen
- Dauer: ca. 1,8 Sekunden (Seite ruckelt)

Nach der Optimierung: Eingabe von "slot game"

- Löst 1 Suche aus (nach Ende der Eingabe)
- Filterung von 3000 Spielen x 1 Mal = 3.000 Operationen
- Dauer: ca. 0,2 Sekunden
- Performance-Verbesserung: 90%
```

## Strategie 2: Throttle - Scroll-Event-Optimierung

> Anwendungsszenario: Scroll-Position-Tracking, unendliches Scrollen

```javascript
import { throttle } from 'lodash';

// Throttle-Funktion: innerhalb von 100ms maximal 1 Ausführung
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
Vor der Optimierung:

- Scroll-Event wird 60 Mal pro Sekunde ausgelöst (60 FPS)
- Jede Auslösung berechnet die Scroll-Position
- Dauer: ca. 600ms (Seite ruckelt)

Nach der Optimierung:

- Scroll-Event wird maximal 1 Mal pro Sekunde ausgelöst (100ms zwischen Ausführungen)
- Dauer: ca. 100ms
- Performance-Verbesserung: 90%
```

## Strategie 3: Time Slicing - Verarbeitung großer Datenmengen

> Anwendungsszenario: Tag-Cloud, Menükombinationen, Filterung von 3000+ Spielen, Rendering von Transaktionsverläufen

```javascript
// Benutzerdefinierte Time-Slicing-Funktion
function processInBatches(
  array: GameList, // 3000 Spiele
  batchSize: number, // 200 pro Batch
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // Verarbeitung abgeschlossen

    const batch = array.slice(index, index + batchSize); // Slice
    callback(batch); // Diesen Batch verarbeiten
    index += batchSize;

    setTimeout(processNextBatch, 0); // Nächster Batch in die Microtask-Queue
  }

  processNextBatch();
}
```

Verwendungsbeispiel:

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // 3000 Spiele in 15 Batches aufteilen, je 200
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

## Strategie 4: requestAnimationFrame - Animationsoptimierung

> Anwendungsszenario: sanftes Scrollen, Canvas-Animationen, Geschenkeffekte

```javascript
const scrollToTopAnimated = (el: any, speed = 500) => {
  const startPosition = el.scrollTop;
  const duration = speed;
  let startTime = null;

  // Easing-Funktion
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
      requestAnimationFrame(animateScroll); // Rekursiver Aufruf
    }
  };

  requestAnimationFrame(animateScroll);
};
```

Warum requestAnimationFrame verwenden?

```javascript
// Falscher Ansatz: setInterval verwenden
setInterval(() => {
  el.scrollTop += 10;
}, 16); // Versuch 60fps (1000ms / 60 = 16ms)
// Probleme:
// 1. Nicht mit dem Browser-Repaint synchronisiert (kann mehrmals zwischen Repaints ausgeführt werden)
// 2. Wird auch in Hintergrund-Tabs ausgeführt (Ressourcenverschwendung)
// 3. Kann zu Jank führen (Frame-Verlust)

// Richtiger Ansatz: requestAnimationFrame verwenden
requestAnimationFrame(animateScroll);
// Vorteile:
// 1. Mit dem Browser-Repaint synchronisiert (60fps oder 120fps)
// 2. Pausiert automatisch, wenn Tab nicht sichtbar (Energiesparen)
// 3. Flüssiger, kein Frame-Verlust
```

---

## Interview-Schwerpunkte

### Debounce vs Throttle

| Eigenschaft | Debounce                             | Throttle                              |
| ----------- | ------------------------------------ | ------------------------------------- |
| Auslösezeitpunkt | Nach Beendigung der Aktion, wartet eine Zeitspanne | Maximal eine Ausführung in festem Zeitintervall |
| Geeignetes Szenario | Sucheingabe, Fenster-Resize | Scroll-Events, Mausbewegung |
| Ausführungsanzahl | Kann nicht ausgeführt werden (bei fortlaufender Auslösung) | Garantierte Ausführung (feste Frequenz) |
| Verzögerung | Mit Verzögerung (wartet auf Stopp) | Sofortige Ausführung, anschließend begrenzt |

### Time Slicing vs Web Worker

| Eigenschaft | Time Slicing                          | Web Worker                            |
| ----------- | ------------------------------------- | ------------------------------------- |
| Ausführungsumgebung | Hauptthread                   | Hintergrundthread                     |
| Geeignetes Szenario | Aufgaben mit DOM-Manipulation | Reine Berechnungsaufgaben             |
| Implementierungskomplexität | Einfacher               | Komplexer (Kommunikation erforderlich) |
| Performance-Verbesserung | Verhindert Blockierung des Hauptthreads | Echte parallele Berechnung |

### Häufige Interview-Fragen

**F: Wie wählt man zwischen Debounce und Throttle?**

A: Abhängig vom Anwendungsszenario:

- **Debounce**: Geeignet für Szenarien "Warten, bis der Benutzer die Aktion abgeschlossen hat" (z.B. Sucheingabe)
- **Throttle**: Geeignet für Szenarien "Muss kontinuierlich aktualisieren, aber nicht zu häufig" (z.B. Scroll-Tracking)

**F: Wie wählt man zwischen Time Slicing und Web Worker?**

A:

- **Time Slicing**: DOM-Manipulation erforderlich, einfache Datenverarbeitung
- **Web Worker**: Reine Berechnung, große Datenmengen, keine DOM-Manipulation nötig

**F: Was sind die Vorteile von requestAnimationFrame?**

A:

1. Mit dem Browser-Repaint synchronisiert (60fps)
2. Pausiert automatisch, wenn Tab nicht sichtbar (Energiesparen)
3. Vermeidet Frame-Verlust (Jank)
4. Performance überlegen gegenüber setInterval/setTimeout
