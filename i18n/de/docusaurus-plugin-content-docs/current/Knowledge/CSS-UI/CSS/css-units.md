---
id: css-units
title: '[Medium] 🏷️ CSS-Einheiten'
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. Erklären Sie die Unterschiede zwischen `px`, `em`, `rem`, `vw` und `vh`

### Schnelle Vergleichstabelle

| Einheit | Typ      | Relativ zu                       | Vom Elternelement beeinflusst? | Häufige Verwendung                        |
| ------- | -------- | -------------------------------- | ------------------------------ | ------------------------------------------ |
| `px`    | Absolut  | Bildschirmpixel                  | Nein                           | Ränder, Schatten, kleine Details          |
| `em`    | Relativ  | font-size des **Elternelements** | Ja                             | Padding, Margin (Schriftgröße folgend)   |
| `rem`   | Relativ  | font-size des **Wurzelelements** | Nein                           | Schriften, Abstände, allgemeine Größen  |
| `vw`    | Relativ  | 1% der Viewport-Breite           | Nein                           | Responsive Breite, Full-Width-Elemente     |
| `vh`    | Relativ  | 1% der Viewport-Höhe            | Nein                           | Responsive Höhe, Full-Screen-Bereiche     |

### Detaillierte Erklärung

#### `px` (Pixels)

**Definition**: Absolute Einheit, 1px = ein Pixel auf dem Bildschirm

**Eigenschaften**:

- Feste Größe, ändert sich durch keine Einstellung
- Präzise Kontrolle, aber wenig Flexibilität
- Ungünstig für responsives Design und Barrierefreiheit

**Anwendungsfälle**:

```css
/* Geeignet für */
border: 1px solid #000; /* Ränder */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Schatten */
border-radius: 4px; /* Kleine abgerundete Ecken */

/* Nicht empfohlen für */
font-size: 16px; /* Schrift: besser rem verwenden */
width: 1200px; /* Breite: besser % oder vw verwenden */
```

#### `em`

**Definition**: Vielfaches des font-size des **Elternelements**

**Eigenschaften**:

- Kumuliert durch Vererbung (verschachtelte Strukturen addieren sich)
- Hohe Flexibilität, kann aber schwer kontrollierbar werden
- Geeignet für Szenarien, in denen die Skalierung dem Elternelement folgen soll

**Berechnungsbeispiel**:

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
  padding: 1em; /* 24px × 1 = 24px (relativ zum eigenen font-size) */
}

.grandchild {
  font-size: 1.5em; /* 24px × 1.5 = 36px (Kumulationseffekt!) */
}
```

**Anwendungsfälle**:

```css
/* Geeignet für */
.button {
  font-size: 1rem;
  padding: 0.5em 1em; /* Padding folgt der Schriftgröße des Buttons */
}

.card-title {
  font-size: 1.2em; /* Relativ zur Basisschrift der Card */
  margin-bottom: 0.5em; /* Abstand folgt der Titelgröße */
}

/* Vorsicht bei Verschachtelungskumulation */
```

#### `rem` (Root em)

**Definition**: Vielfaches des font-size des **Wurzelelements** (`<html>`)

**Eigenschaften**:

- Kumuliert nicht durch Vererbung (immer relativ zum Wurzelelement)
- Einfach zu verwalten und zu warten
- Praktisch für die Implementierung globaler Skalierung
- Eine der am meisten empfohlenen Einheiten

**Berechnungsbeispiel**:

```css
html {
  font-size: 16px; /* Browser-Standard */
}

.element {
  font-size: 1.5rem; /* 16px × 1.5 = 24px */
  padding: 2rem; /* 16px × 2 = 32px */
  margin: 1rem 0; /* 16px × 1 = 16px */
}

.nested .element {
  font-size: 1.5rem; /* Immer noch 24px, keine Kumulation! */
}
```

**Anwendungsfälle**:

```css
/* Am meisten empfohlen für */
html {
  font-size: 16px; /* Basis festlegen */
}

body {
  font-size: 1rem; /* Fließtext 16px */
}

h1 {
  font-size: 2.5rem; /* 40px */
}

p {
  font-size: 1rem; /* 16px */
  margin-bottom: 1rem; /* 16px */
}

.container {
  padding: 2rem; /* 32px */
  max-width: 75rem; /* 1200px */
}

/* Praktisch für Dark Mode oder Barrierefreiheitsanpassungen */
@media (prefers-reduced-motion: reduce) {
  html {
    font-size: 18px; /* Alle rem-Einheiten skalieren automatisch */
  }
}
```

#### `vw` (Viewport Width)

**Definition**: Relativ zu 1% der Viewport-Breite (100vw = Viewport-Breite)

**Eigenschaften**:

- Wirklich responsive Einheit
- Ändert sich in Echtzeit mit der Browsergröße
- Achtung: 100vw beinhaltet die Scrollbar-Breite

**Berechnungsbeispiel**:

```css
/* Angenommen Viewport-Breite 1920px */
.element {
  width: 50vw; /* 1920px × 50% = 960px */
  font-size: 5vw; /* 1920px × 5% = 96px */
}

/* Angenommen Viewport-Breite 375px (Mobilgerät) */
.element {
  width: 50vw; /* 375px × 50% = 187.5px */
  font-size: 5vw; /* 375px × 5% = 18.75px */
}
```

**Anwendungsfälle**:

```css
/* Geeignet für */
.hero {
  width: 100vw; /* Full-Width-Banner */
  margin-left: calc(-50vw + 50%); /* Container-Begrenzung durchbrechen */
}

.hero-title {
  font-size: clamp(2rem, 5vw, 5rem); /* Responsive Schrift */
}

.responsive-box {
  width: 80vw;
  max-width: 1200px; /* Maximale Begrenzung hinzufügen */
}

/* Vermeiden */
body {
  width: 100vw; /* Verursacht horizontale Scrollbar (weil Scrollbar-Breite eingeschlossen) */
}
```

#### `vh` (Viewport Height)

**Definition**: Relativ zu 1% der Viewport-Höhe (100vh = Viewport-Höhe)

**Eigenschaften**:

- Geeignet für Fullscreen-Effekte
- Bei Mobilgeräten auf das Adressleisten-Problem achten
- Kann durch das Ausfahren der Tastatur beeinflusst werden

**Anwendungsfälle**:

```css
/* Geeignet für */
.hero-section {
  height: 100vh; /* Fullscreen-Startseite */
}

.fullscreen-modal {
  height: 100vh;
  width: 100vw;
}

.sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
}

/* Alternative für Mobilgeräte */
.hero-section {
  height: 100vh;
  height: 100dvh; /* Dynamische Viewport-Höhe (neuere Einheit) */
}

/* Vertikale Zentrierung */
.center-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Praktische Tipps und Best Practices

#### 1. Responsives Schriftsystem aufbauen

```css
/* Basis festlegen */
html {
  font-size: 16px; /* Desktop-Standard */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* Tablet */
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px; /* Mobilgerät */
  }
}

/* Alle Elemente mit rem skalieren automatisch */
h1 {
  font-size: 2.5rem;
} /* Desktop 40px, Mobil 30px */
p {
  font-size: 1rem;
} /* Desktop 16px, Mobil 12px */
```

#### 2. Verschiedene Einheiten kombinieren

```css
.card {
  /* Responsive Breite + Bereichsbegrenzung */
  width: 90vw;
  max-width: 75rem;

  /* rem für Abstände */
  padding: 2rem;
  margin: 1rem auto;

  /* px für Details */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  /* clamp kombiniert mehrere Einheiten für fließende Skalierung */
  font-size: clamp(1.25rem, 3vw, 2rem);
}
```

### Muster für die Interview-Antwort

**Antwortstruktur**:

```markdown
1. **px**: Pixel-Kleindetails -> Ränder, Schatten, kleine abgerundete Ecken
2. **rem**: Stabile und unveränderliche Basis -> Schriften, Abstände, Hauptgrößen
3. **em**: Folgt dem Elternelement
4. **vw**: Ändert sich mit der Viewport-Breite -> Responsive Breite
5. **vh**: Füllt die Viewport-Höhe -> Fullscreen-Bereiche
```

1. **Schnelle Definition**

   - px ist eine absolute Einheit, die anderen sind relative Einheiten
   - em ist relativ zum Elternelement, rem ist relativ zum Wurzelelement
   - vw/vh sind relativ zu den Viewport-Dimensionen

2. **Hauptunterschied**

   - rem kumuliert nicht, em kumuliert (das ist der Hauptunterschied)
   - vw/vh sind wirklich responsiv, aber auf das Scrollbar-Problem achten

3. **Praktische Anwendung**

   - **px**: 1px-Ränder, Schatten und andere Details
   - **rem**: Schriften, Abstände, Container (am häufigsten verwendet, einfach zu warten)
   - **em**: Button-Padding (wenn es der Schriftskalierung folgen soll)
   - **vw/vh**: Full-Width-Banner, Fullscreen-Bereiche, responsive Schriften mit clamp

4. **Best Practices**
   - html font-size als Basis festlegen
   - clamp() mit verschiedenen Einheiten kombinieren
   - Auf das vh-Problem bei Mobilgeräten achten (dvh verwenden)

### Reference

- [MDN - CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Units - A Complete Guide](https://www.freecodecamp.org/news/css-unit-guide/)
- [Modern CSS Solutions](https://moderncss.dev/generating-font-size-css-rules-and-creating-a-fluid-type-scale/)
