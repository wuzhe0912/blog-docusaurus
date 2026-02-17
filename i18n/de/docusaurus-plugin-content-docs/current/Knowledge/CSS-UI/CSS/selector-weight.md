---
id: selector-weight
title: '[Easy] 🏷️ Selektor-Gewichtung'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. Wie berechnet man die Gewichtung eines Selektors?

> Wie berechnet man die Gewichtung eines Selektors?

Die Bestimmung der Priorität von CSS-Selektoren dient dazu, die Frage zu klären, welcher Stil letztendlich auf ein Element angewendet wird, wie im folgenden Beispiel:

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

In diesem Fall wird das Ergebnis Blau sein, da hier zwei Selektoren angewendet werden: ID und class. Da die Gewichtung von ID größer als die von class ist, wird der Stil von class überschrieben.

### Gewichtungsreihenfolge

> inline style > ID > class > tag

Wenn in einem HTML-Abschnitt ein Inline-Stil direkt im Tag geschrieben ist, hat dieser standardmäßig die höchste Gewichtung und überschreibt die Stile aus der CSS-Datei, wie im Beispiel:

```html
<div id="app" class="wrapper" style="color: #f00">Welche Farbe?</div>
```

In der normalen Entwicklung wird diese Schreibweise jedoch nicht verwendet, da sie schwer zu warten ist und leicht zu Stilkontaminationsproblemen führt.

### Sonderfall

Wenn man tatsächlich auf einen Inline-Stil stößt, der nicht entfernt werden kann, und ihn über die CSS-Datei überschreiben möchte, kann `!important` verwendet werden:

```html
<div id="app" class="wrapper" style="color: #f00">Welche Farbe?</div>
```

```css
#app {
  color: blue !important;
}
```

Natürlich ist es vorzuziehen, die Verwendung von `!important` möglichst zu vermeiden. Obwohl Inline-Stile ebenfalls `!important` hinzufügen können, ziehe ich persönlich diese Art der Stilschreibweise nicht in Betracht. Außerdem verwende ich, außer in Sonderfällen, keine ID-Selektoren und baue das gesamte Stylesheet grundsätzlich mit class auf.
