---
id: selector-weight
title: '[Easy] 🏷️ Selektor-Gewichtung'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. Wie berechnet man die Gewichtung eines Selektors?

> Wie berechnet man die Gewichtung eines Selektors?

Die Bestimmung der Prioritaet von CSS-Selektoren dient dazu, die Frage zu klaeren, welcher Stil letztendlich auf ein Element angewendet wird, wie im folgenden Beispiel:

```html
<div id="app" class="wrapper">Welche Farbe?</div>
```

```css
#app {
  color: blue;
}

.wrapper {
  color: red;
}
```

In diesem Fall wird das Ergebnis Blau sein, da hier zwei Selektoren angewendet werden: ID und class. Da die Gewichtung von ID groesser als die von class ist, wird der Stil von class ueberschrieben.

### Gewichtungsreihenfolge

> inline style > ID > class > tag

Wenn in einem HTML-Abschnitt ein Inline-Stil direkt im Tag geschrieben ist, hat dieser standardmaessig die hoechste Gewichtung und ueberschreibt die Stile aus der CSS-Datei, wie im Beispiel:

```html
<div id="app" class="wrapper" style="color: #f00">Welche Farbe?</div>
```

In der normalen Entwicklung wird diese Schreibweise jedoch nicht verwendet, da sie schwer zu warten ist und leicht zu Stilkontaminationsproblemen fuehrt.

### Sonderfall

Wenn man tatsaechlich auf einen Inline-Stil stoesst, der nicht entfernt werden kann, und ihn ueber die CSS-Datei ueberschreiben moechte, kann `!important` verwendet werden:

```html
<div id="app" class="wrapper" style="color: #f00">Welche Farbe?</div>
```

```css
#app {
  color: blue !important;
}
```

Natuerlich ist es vorzuziehen, die Verwendung von `!important` moeglichst zu vermeiden. Obwohl Inline-Stile ebenfalls `!important` hinzufuegen koennen, ziehe ich persoenlich diese Art der Stilschreibweise nicht in Betracht. Ausserdem verwende ich, ausser in Sonderfaellen, keine ID-Selektoren und baue das gesamte Stylesheet grundsaetzlich mit class auf.

