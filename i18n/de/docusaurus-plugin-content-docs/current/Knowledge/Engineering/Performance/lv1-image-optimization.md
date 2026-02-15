---
id: performance-lv1-image-optimization
title: '[Lv1] Bildladungsoptimierung: Vier Ebenen des Lazy Load'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Durch eine vierstufige Lazy-Loading-Strategie fuer Bilder wurde der Bilder-Traffic der ersten Ansicht von 60 MB auf 2 MB reduziert, mit einer Ladezeitverbesserung von 85%.

---

## Problemhintergrund (Situation)

> Stellen Sie sich vor, Sie scrollen auf dem Handy durch eine Webseite. Der Bildschirm zeigt nur 10 Bilder, aber die Seite laedt alle 500 Bilder komplett. Ihr Handy wuerde einfrieren und das Datenvolumen wuerde sofort 50 MB verbrauchen.

**Tatsaechliche Projektsituation:**

```markdown
Statistiken einer Startseite
- 300+ Thumbnails (je 150-300 KB)
- 50+ Werbebanner
- Wenn alles geladen wird: 300 x 200 KB = 60 MB+ Bilddaten

Tatsaechliche Probleme
- Erste Ansicht zeigt nur 8-12 Bilder
- Benutzer scrollt moeglicherweise nur bis Bild 30 und verlaesst die Seite
- Restliche 270 Bilder werden voellig umsonst geladen (Traffic-Verschwendung + Verlangsamung)

Auswirkungen
- Erstladezeit: 15-20 Sekunden
- Datenverbrauch: 60 MB+ (Nutzerbeschwerden)
- Seitenruckeln: Scrollen nicht fluessig
- Absprungrate: 42% (sehr hoch)
```

## Optimierungsziel (Task)

1. **Nur Bilder im sichtbaren Bereich laden**
2. **Bilder vorladen, die kurz vor dem Viewport stehen** (50 px vorher mit dem Laden beginnen)
3. **Parallelitaet kontrollieren** (vermeiden, dass zu viele Bilder gleichzeitig geladen werden)
4. **Ressourcenverschwendung durch schnelles Wechseln verhindern**
5. **Bilder-Traffic der ersten Ansicht < 3 MB**

## Loesung (Action)

### v-lazy-load.ts Implementierung

> Vier Ebenen des Image Lazy Load

#### Erste Ebene: Viewport-Sichtbarkeitserkennung (IntersectionObserver)

```js
// Observer erstellen, der ueberwacht, ob ein Bild den Viewport betritt
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Bild ist im sichtbaren Bereich
        // Laden des Bildes starten
      }
    });
  },
  {
    rootMargin: '50px 0px', // 50 px vorher mit dem Laden beginnen (Vorladen)
    threshold: 0.1, // Ausloesen, sobald 10% sichtbar sind
  }
);
```

- Verwendet die native IntersectionObserver API des Browsers (Performance weit ueberlegen gegenueber Scroll-Events)
- rootMargin: "50px" -> Wenn das Bild noch 50 px unterhalb ist, beginnt bereits das Laden; wenn der Benutzer dort ankommt, ist es bereits fertig (fuehlbar fluessiger)
- Bilder außerhalb des Viewports werden nicht geladen

#### Zweite Ebene: Parallelitaetskontrollmechanismus (Queue-Management)

```js
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent = 6  // Maximal 6 Bilder gleichzeitig laden
  private queue: (() => void)[] = []

  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)  // Platz frei, sofort laden
    } else {
      this.queue.push(loadFn)   // Kein Platz, in Warteschlange einreihen
    }
  }
}
```

- Auch wenn 20 Bilder gleichzeitig den Viewport betreten, werden nur 6 gleichzeitig geladen
- Vermeidet "Kaskaden-Laden", das den Browser blockiert (Chrome erlaubt standardmaessig maximal 6 gleichzeitige Anfragen)
- Nach Abschluss wird automatisch das naechste aus der Warteschlange verarbeitet

```md
Benutzer scrollt schnell zum Ende -> 30 Bilder gleichzeitig ausgeloest
Ohne Queue-Management: 30 Anfragen gleichzeitig -> Browser friert ein
Mit Queue-Management: Erste 6 laden -> nach Abschluss naechste 6 -> fluessig
```

#### Dritte Ebene: Loesung des Ressourcen-Race-Condition-Problems (Versionskontrolle)

```js
// Versionsnummer beim Laden setzen
el.setAttribute('data-version', Date.now().toString());

// Version nach dem Laden ueberpruefen
img.onload = () => {
  const currentVersion = img.getAttribute('data-version');
  if (loadVersion === currentVersion) {
    // Version stimmt ueberein, Bild anzeigen
  } else {
    // Version stimmt nicht ueberein, Benutzer hat bereits gewechselt, nicht anzeigen
  }
};
```

Praxisbeispiel:

```md
Benutzeraktionen:

1. Klickt auf Kategorie "Nachrichten" -> Laden von 100 Bildern ausgeloest (Version 1001)
2. 0,5 Sekunden spaeter klickt auf "Aktionen" -> Laden von 80 Bildern ausgeloest (Version 1002)
3. Nachrichtenbilder sind erst 1 Sekunde spaeter fertig geladen

Ohne Versionskontrolle: Nachrichtenbilder werden angezeigt (falsch!)
Mit Versionskontrolle: Versionspruefung ergibt Unstimmigkeit, Nachrichtenbilder werden verworfen (korrekt!)
```

#### Vierte Ebene: Platzhalter-Strategie (Base64 transparentes Bild)

```js
// Standardmaessig 1x1 transparentes SVG anzeigen, um Layout-Verschiebung zu vermeiden
el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi...';

// Echte Bild-URL in data-src speichern
el.setAttribute('data-src', realImageUrl);
```

- Verwendet Base64-kodiertes transparentes SVG (nur 100 Bytes)
- Vermeidet CLS (Cumulative Layout Shift)
- Benutzer sieht kein "ploetzlich erscheinendes Bild"

## Optimierungsergebnis (Result)

**Vor der Optimierung:**

```markdown
Bilder der ersten Ansicht: Alle 300 Bilder auf einmal (60 MB)
Ladezeit: 15-20 Sekunden
Scroll-Fluessigkeit: starkes Ruckeln
Absprungrate: 42%
```

**Nach der Optimierung:**

```markdown
Bilder der ersten Ansicht: Nur 8-12 Bilder (2 MB) -97%
Ladezeit: 2-3 Sekunden +85%
Scroll-Fluessigkeit: fluessig (60 fps)
Absprungrate: 28% -33%
```

**Konkrete Daten:**

- Bilder-Traffic der ersten Ansicht: **60 MB -> 2 MB (Reduktion um 97%)**
- Bildladezeit: **15 Sekunden -> 2 Sekunden (Verbesserung um 85%)**
- Seiten-Scroll-FPS: **Von 20-30 auf 55-60**
- Speicherverbrauch: **Reduktion um 65%** (nicht geladene Bilder belegen keinen Speicher)

**Technische Indikatoren:**

- IntersectionObserver Performance: weit ueberlegen gegenueber traditionellem Scroll-Event (CPU-Nutzung um 80% reduziert)
- Effekt der Parallelitaetskontrolle: Verhindert Anfragenblockierung des Browsers
- Trefferquote der Versionskontrolle: 99,5% (auesserst selten falsche Bilder)

## Interview-Schwerpunkte

**Haeufige Erweiterungsfragen:**

1. **F: Warum nicht einfach das `loading="lazy"`-Attribut verwenden?**
   A: Das native `loading="lazy"` hat einige Einschraenkungen:

   - Keine Kontrolle ueber die Vorladeentfernung (Browser entscheidet)
   - Keine Kontrolle ueber die Parallelitaetsmenge
   - Kein Umgang mit Versionskontrolle (Problem bei schnellem Wechsel)
   - Aeltere Browser unterstuetzen es nicht

   Eine benutzerdefinierte Directive bietet feinere Kontrolle, geeignet fuer unsere komplexen Szenarien.

2. **F: Was ist am IntersectionObserver besser als an Scroll-Events?**
   A:

   ```javascript
   // Traditionelles Scroll-Event
   window.addEventListener('scroll', () => {
     // Wird bei jedem Scrollen ausgeloest (60 Mal/Sekunde)
     // Muss Elementposition berechnen (getBoundingClientRect)
     // Kann erzwungenen Reflow verursachen (Performance-Killer)
   });

   // IntersectionObserver
   const observer = new IntersectionObserver(callback);
   // Wird nur ausgeloest, wenn Element den Viewport betritt/verlaesst
   // Native Browser-Optimierung, blockiert nicht den Hauptthread
   // 80% Performance-Verbesserung
   ```

3. **F: Woher kommt das 6-Bilder-Limit bei der Parallelitaetskontrolle?**
   A: Basiert auf dem **HTTP/1.1 Same-Origin-Parallelitaetslimit** des Browsers:

   - Chrome/Firefox: Maximal 6 gleichzeitige Verbindungen pro Domain
   - Anfragen ueber dem Limit werden in die Warteschlange gestellt
   - HTTP/2 erlaubt mehr, aber aus Kompatibilitaetsgruenden halten wir bei 6
   - Reale Tests: 6 gleichzeitige Bilder sind das optimale Gleichgewicht zwischen Performance und Erlebnis

4. **F: Warum Timestamp statt UUID fuer die Versionskontrolle?**
   A:

   - Timestamp: `Date.now()` (einfach, ausreichend, sortierbar)
   - UUID: `crypto.randomUUID()` (strenger, aber Over-Engineering)
   - Unser Szenario: Timestamp ist ausreichend eindeutig (Millisekundenebene)
   - Performance-Ueberlegung: Timestamp-Generierung ist schneller

5. **F: Wie wird mit fehlgeschlagenem Bildladen umgegangen?**
   A: Mehrstufiges Fallback implementiert:

   ```javascript
   img.onerror = () => {
     if (retryCount < 3) {
       // 1. 3 Mal wiederholen
       setTimeout(() => reload(), 1000 * retryCount);
     } else {
       // 2. Standardbild anzeigen
       img.src = '/images/game-placeholder.png';
     }
   };
   ```

6. **F: Gibt es CLS-Probleme (Cumulative Layout Shift)?**
   A: Drei Strategien zur Vermeidung:

   ```html
   <!-- 1. Standard-Platzhalter-SVG -->
   <img src="data:image/svg+xml..." />

   <!-- 2. CSS aspect-ratio fuer festes Verhaeltnis -->
   <img style="aspect-ratio: 16/9;" />

   <!-- 3. Skeleton Screen -->
   <div class="skeleton-box"></div>
   ```

   Endgueltiger CLS-Score: < 0,1 (ausgezeichnet)
