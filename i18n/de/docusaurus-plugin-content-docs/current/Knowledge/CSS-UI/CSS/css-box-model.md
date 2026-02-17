---
id: css-box-model
title: '[Easy] 🏷️ Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## Standard

Das `Box Model` ist ein Begriff in `CSS`, der verwendet wird, um zu diskutieren, wie Layouts gestaltet werden. Es kann als eine Box verstanden werden, die `HTML`-Elemente umhuellt, mit vier Haupteigenschaften:

- content: Wird hauptsaechlich zur Anzeige des Elementinhalts verwendet, z.B. Text.
- padding: Der Abstand zwischen dem Inhalt des Elements und seiner Grenze.
- margin: Der Abstand des Elements zu anderen externen Elementen.
- border: Die Randlinie des Elements selbst.

## box-sizing

Der verwendete `Box Model`-Typ wird durch die Eigenschaft `box-sizing` bestimmt.

Das bedeutet, dass bei der Berechnung von Breite und Hoehe eines Elements die Eigenschaften `padding` und `border` entweder nach innen auffuellen oder nach aussen erweitern.

Der Standardwert ist `content-box`, der die Erweiterung nach aussen verwendet. Unter dieser Bedingung muessen neben der Breite und Hoehe des Elements selbst auch zusaetzliche `padding`- und `border`-Werte in die Berechnung einbezogen werden. Siehe:

```css
div {
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

Die Breite dieses `div` wird berechnet als `100px(width)` + `20px(linkes und rechtes padding)` + `2px(linker und rechter border)` = `122px`.

## border-box

Offensichtlich ist die obige Methode nicht zuverlaessig, da sie Frontend-Entwickler zwingt, staendig Breite und Hoehe der Elemente zu berechnen. Um die Entwicklungserfahrung zu verbessern, wird natuerlich der andere Modus verwendet: `border-box`.

Wie im folgenden Beispiel wird bei der Stil-Initialisierung das `box-sizing` aller Elemente auf `border-box` gesetzt:

```css
* {
  box-sizing: border-box; // global style
}
```

Dadurch wird die Form der inneren Auffuellung uebernommen, was das Design von Breite und Hoehe der Elemente intuitiver macht, ohne Zahlen wegen `padding` oder `border` anpassen zu muessen.

## Vergleichsbeispiel

Angenommen, die folgenden identischen Stileinstellungen:

```css
.box {
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 5px solid #000;
  margin: 20px;
}
```

### content-box (Standardwert)

- **Tatsaechlich belegte Breite** = `100px(width)` + `20px(linkes und rechtes padding)` + `10px(linker und rechter border)` = `130px`
- **Tatsaechlich belegte Hoehe** = `100px(height)` + `20px(oberes und unteres padding)` + `10px(oberer und unterer border)` = `130px`
- **Content-Bereich** = `100px x 100px`
- **Hinweis**: `margin` wird nicht in die Elementbreite eingerechnet, beeinflusst aber den Abstand zu anderen Elementen

### border-box

- **Tatsaechlich belegte Breite** = `100px` (padding und border werden nach innen komprimiert)
- **Tatsaechlich belegte Hoehe** = `100px`
- **Content-Bereich** = `100px` - `20px(linkes und rechtes padding)` - `10px(linker und rechter border)` = `70px x 70px`
- **Hinweis**: `margin` wird ebenfalls nicht in die Elementbreite eingerechnet

### Visuelle Gegenuberstellung

```
content-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (100×100)       │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
Gesamtbreite: 130px (ohne margin)

border-box:
┌─────────── margin (20px) ───────────┐
│  ┌──────── border (5px) ──────────┐ │
│  │  ┌──── padding (10px) ──────┐ │ │
│  │  │                           │ │ │
│  │  │   content (70×70)         │ │ │
│  │  │                           │ │ │
│  │  └───────────────────────────┘ │ │
│  └─────────────────────────────────┘ │
└─────────────────────────────────────┘
Gesamtbreite: 100px (ohne margin)
```

## Haeufige Fallstricke

### 1. Umgang mit margin

Unabhaengig davon, ob `content-box` oder `border-box` verwendet wird, **wird margin niemals in die Breite und Hoehe des Elements eingerechnet**. Die beiden Modi beeinflussen nur die Berechnung von `padding` und `border`.

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 5px solid;
  margin: 20px; /* Wird nicht in width eingerechnet */
}
/* Die tatsaechliche Breite des Elements ist immer noch 100px, aber der Abstand zu anderen Elementen betraegt 20px mehr */
```

### 2. Prozentuale Breite

Bei der Verwendung prozentualer Breite wird die Berechnung ebenfalls durch `box-sizing` beeinflusst:

```css
.parent {
  width: 200px;
}

.child {
  width: 50%; /* 50% des Elternelements = 100px */
  padding: 10px;
  border: 5px solid;
}

/* content-box: Tatsaechliche Breite 130px (koennte das Elternelement ueberschreiten) */
/* border-box: Tatsaechliche Breite 100px (genau 50% des Elternelements) */
```

### 3. inline-Elemente

`box-sizing` hat keine Wirkung auf `inline`-Elemente, da die Einstellung von `width` und `height` bei inline-Elementen ohnehin wirkungslos ist.

```css
span {
  display: inline;
  width: 100px; /* Wirkungslos */
  box-sizing: border-box; /* Ebenfalls wirkungslos */
}
```

### 4. min-width / max-width

`min-width` und `max-width` werden ebenfalls durch `box-sizing` beeinflusst:

```css
.box {
  box-sizing: border-box;
  min-width: 100px; /* Einschliesslich padding und border */
  padding: 10px;
  border: 5px solid;
}
/* Minimale Content-Breite = 100 - 20 - 10 = 70px */
```

## Reference

- [The box model](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model)
- [CSS-Layout lernen](https://zh-tw.learnlayout.com/box-sizing.html)
- [CSS Box Model](https://www.w3schools.com/css/css_boxmodel.asp)
