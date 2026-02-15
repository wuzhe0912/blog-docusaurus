---
id: css-pseudo-elements
title: '[Easy] 🏷️ Pseudo-Elemente'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## Was sind Pseudo-Elemente

Pseudo-Elemente (Pseudo-elements) sind CSS-Schluesselwoerter, die verwendet werden, um bestimmte Teile eines Elements auszuwaehlen oder Inhalte vor oder nach einem Element einzufuegen. Sie verwenden die **Doppelpunkt**-Syntax `::` (CSS3-Standard), um sich von Pseudo-Klassen (pseudo-classes) mit der Einzelpunkt-Syntax `:` zu unterscheiden.

## Gaengige Pseudo-Elemente

### 1. ::before und ::after

Die am haeufigsten verwendeten Pseudo-Elemente, die zum Einfuegen von Inhalten vor oder nach dem Elementinhalt verwendet werden.

```css
.icon::before {
  content: '📌';
  margin-right: 8px;
}

.external-link::after {
  content: ' ↗';
  font-size: 0.8em;
}
```

**Eigenschaften**:

- Muessen die Eigenschaft `content` enthalten (auch wenn es ein leerer String ist)
- Sind standardmaessig `inline`-Elemente
- Erscheinen nicht im DOM, koennen nicht von JavaScript ausgewaehlt werden

### 2. ::first-letter

Waehlt den ersten Buchstaben des Elements aus, haeufig fuer Initialen im Magazinstil verwendet.

```css
.article::first-letter {
  font-size: 3em;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 8px;
}
```

### 3. ::first-line

Waehlt die erste Textzeile des Elements aus.

```css
.intro::first-line {
  font-weight: bold;
  color: #333;
}
```

**Hinweis**: `::first-line` kann nur fuer Block-Level-Elemente verwendet werden.

### 4. ::selection

Passt den Stil an, wenn der Benutzer Text auswaehlt.

```css
::selection {
  background-color: #ffeb3b;
  color: #000;
}

/* Firefox benoetigt Praefix */
::-moz-selection {
  background-color: #ffeb3b;
  color: #000;
}
```

### 5. ::placeholder

Passt den Stil des Formular-Placeholders an.

```css
input::placeholder {
  color: #999;
  font-style: italic;
  opacity: 0.7;
}
```

### 6. ::marker

Passt den Stil des Listenzeichens (list marker) an.

```css
li::marker {
  content: '✓ ';
  color: green;
  font-size: 1.2em;
}
```

### 7. ::backdrop

Wird fuer die Hintergrundmaske von Vollbild-Elementen verwendet (wie `<dialog>` oder Vollbild-Videos).

```css
dialog::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
}
```

## Praktische Anwendungsszenarien

### 1. Dekorative Icons und Symbole

Ohne zusaetzliche HTML-Elemente, reine CSS-Implementierung:

```css
.success::before {
  content: '✓';
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: green;
  color: white;
  border-radius: 50%;
  text-align: center;
  margin-right: 8px;
}
```

**Anwendungsfall**: Wenn man keine rein dekorativen Elemente im HTML hinzufuegen moechte.

### 2. Clearfix (Float-Bereinigung)

Die klassische Float-Bereinigungstechnik:

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

**Anwendungsfall**: Wenn das Elternelement gefloatete Kindelemente enthaelt und die Hoehe des Elternelements expandiert werden muss.

### 3. Anfuehrungszeichen-Dekoration

Automatisch Anfuehrungszeichen zu zitiertem Text hinzufuegen:

```css
blockquote::before {
  content: open-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote::after {
  content: close-quote;
  font-size: 2em;
  color: #ccc;
}

blockquote {
  quotes: '"' '"' '' ' ' '';
}
```

**Anwendungsfall**: Zitatbloecke verschoenern, ohne manuell Anfuehrungszeichen einzugeben.

### 4. Reine CSS-Formen

Pseudo-Elemente nutzen, um geometrische Formen zu erstellen:

```css
.arrow {
  position: relative;
  width: 100px;
  height: 40px;
  background: #3498db;
}

.arrow::after {
  content: '';
  position: absolute;
  right: -20px;
  top: 0;
  width: 0;
  height: 0;
  border-left: 20px solid #3498db;
  border-top: 20px solid transparent;
  border-bottom: 20px solid transparent;
}
```

**Anwendungsfall**: Pfeile, Dreiecke und andere einfache Formen ohne Bilder oder SVG erstellen.

### 5. Pflichtfeld-Markierung

Roten Stern zu Pflichtfeldern im Formular hinzufuegen:

```css
.required::after {
  content: ' *';
  color: red;
  font-weight: bold;
}
```

**Anwendungsfall**: Pflichtfelder kennzeichnen und dabei die HTML-Semantik sauber halten.

### 6. Externer-Link-Kennzeichnung

Automatisch Symbol fuer externe Links hinzufuegen:

```css
a[href^='http']::after {
  content: ' 🔗';
  font-size: 0.8em;
  opacity: 0.6;
}

/* Oder mit Icon Font */
a[target='_blank']::after {
  content: '\f08e'; /* Font Awesome Externer-Link-Symbol */
  font-family: 'FontAwesome';
  margin-left: 4px;
}
```

**Anwendungsfall**: Die Benutzererfahrung verbessern, indem der Benutzer weiss, dass ein neuer Tab geoeffnet wird.

### 7. Zaehler-Nummerierung

CSS-Zaehler fuer automatische Nummerierung verwenden:

```css
.faq-list {
  counter-reset: faq-counter;
}

.faq-item::before {
  counter-increment: faq-counter;
  content: 'Q' counter(faq-counter) '. ';
  font-weight: bold;
  color: #3498db;
}
```

**Anwendungsfall**: Automatisch Nummerierungen generieren, ohne manuelle Pflege.

### 8. Overlay-Effekt

Hover-Overlay fuer Bilder hinzufuegen:

```css
.image-card {
  position: relative;
}

.image-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0);
  transition: background 0.3s;
}

.image-card:hover::after {
  background: rgba(0, 0, 0, 0.5);
}
```

**Anwendungsfall**: Wenn man keine zusaetzlichen HTML-Elemente fuer Overlay-Effekte hinzufuegen moechte.

## Pseudo-Elemente vs Pseudo-Klassen

| Eigenschaft | Pseudo-Elemente (::)                            | Pseudo-Klassen (:)                          |
| ----------- | ----------------------------------------------- | ------------------------------------------- |
| **Syntax**  | Doppelpunkt `::before`                          | Einzelpunkt `:hover`                        |
| **Funktion** | Erstellen/Auswaehlen bestimmter Elementteile   | Auswaehlen bestimmter Elementzustaende      |
| **Beispiele** | `::before`, `::after`, `::first-letter`       | `:hover`, `:active`, `:nth-child()`         |
| **DOM**     | Existieren nicht im DOM                         | Waehlen tatsaechliche DOM-Elemente aus      |

## Haeufige Fallstricke

### 1. Die content-Eigenschaft muss vorhanden sein

`::before` und `::after` muessen die Eigenschaft `content` haben, andernfalls werden sie nicht angezeigt:

```css
/* Wird nicht angezeigt */
.box::before {
  width: 20px;
  height: 20px;
  background: red;
}

/* Korrekt */
.box::before {
  content: ''; /* Auch ein leerer String muss hinzugefuegt werden */
  display: block;
  width: 20px;
  height: 20px;
  background: red;
}
```

### 2. Kann nicht fuer ersetzte Elemente verwendet werden

Bestimmte Elemente (wie `<img>`, `<input>`, `<iframe>`) koennen `::before` und `::after` nicht verwenden:

```css
/* Ungueltig */
img::before {
  content: 'Photo:';
}

/* Verwenden Sie ein Wrapper-Element */
.image-wrapper::before {
  content: 'Photo:';
}
```

### 3. Standardmaessig inline-Elemente

`::before` und `::after` sind standardmaessig `inline`-Elemente. Beim Setzen von Breite und Hoehe ist Vorsicht geboten:

```css
.box::before {
  content: '';
  display: block; /* oder inline-block */
  width: 100px;
  height: 100px;
}
```

### 4. z-index Schichtungsprobleme

Der `z-index` des Pseudo-Elements ist relativ zum Elternelement:

```css
.parent {
  position: relative;
}

.parent::before {
  content: '';
  position: absolute;
  z-index: -1; /* Liegt unter dem Elternelement, aber ueber dessen Hintergrund */
}
```

### 5. Rueckwaertskompatibilitaet mit einzelnem Doppelpunkt

Die CSS3-Spezifikation verwendet doppelte Doppelpunkte `::` zur Unterscheidung von Pseudo-Elementen und Pseudo-Klassen, aber einzelne Doppelpunkte `:` funktionieren weiterhin (Rueckwaertskompatibilitaet mit CSS2):

```css
/* CSS3-Standardschreibweise (empfohlen) */
.box::before {
}

/* CSS2-Schreibweise (funktioniert weiterhin) */
.box:before {
}
```

## Interview-Schwerpunkte

1. **Doppelpunkt-Syntax der Pseudo-Elemente**: Unterscheidung von Pseudo-Elementen `::` und Pseudo-Klassen `:`
2. **Die content-Eigenschaft muss vorhanden sein**: Schluessel fuer `::before` und `::after`
3. **Nicht im DOM**: Koennen nicht direkt von JavaScript ausgewaehlt oder manipuliert werden
4. **Nicht verwendbar fuer ersetzte Elemente**: `<img>`, `<input>` usw. funktionieren nicht
5. **Praktische Anwendungsszenarien**: Dekorative Icons, Clearfix, Formenzeichnung usw.

## Reference

- [Pseudo-elements - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)
- [CSS Pseudo-elements - W3Schools](https://www.w3schools.com/css/css_pseudo_elements.asp)
- [A Whole Bunch of Amazing Stuff Pseudo Elements Can Do](https://css-tricks.com/pseudo-element-roundup/)
