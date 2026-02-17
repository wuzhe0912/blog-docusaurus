---
id: script-loading-strategies
title: '[Easy] 📄 <script>, <script async>, <script defer>'
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## Überblick

In HTML gibt es drei Hauptmethoden, um JavaScript-Dateien zu laden:

1. `<script>`
2. `<script async>`
3. `<script defer>`

Diese drei Methoden unterscheiden sich im Verhalten beim Laden und Ausführen von Skripten.

## Detaillierter Vergleich

### `<script>`

- **Verhalten**: Wenn der Browser auf dieses Tag trifft, stoppt er das Parsen von HTML, lädt das Skript herunter, führt es aus und setzt dann das Parsen von HTML fort.
- **Einsatzzeitpunkt**: Geeignet für Skripte, die für das Rendern der Seite unerlässlich sind.
- **Vorteil**: Stellt sicher, dass Skripte in der richtigen Reihenfolge ausgeführt werden.
- **Nachteil**: Kann das Rendern der Seite verzögern.

```html
<script src="important.js"></script>
```

### `<script async>`

- **Verhalten**: Der Browser lädt das Skript im Hintergrund herunter und setzt gleichzeitig das Parsen von HTML fort. Sobald der Download abgeschlossen ist, wird das Skript sofort ausgeführt und kann das Parsen von HTML unterbrechen.
- **Einsatzzeitpunkt**: Geeignet für unabhängige Skripte wie Analyse- oder Werbeskripte.
- **Vorteil**: Blockiert nicht das HTML-Parsen und kann die Seitenladegeschwindigkeit verbessern.
- **Nachteil**: Die Ausführungsreihenfolge ist nicht garantiert; das Skript kann ausgeführt werden, bevor das DOM vollständig geladen ist.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **Verhalten**: Der Browser lädt das Skript im Hintergrund herunter, wartet aber mit der Ausführung, bis das HTML-Parsen abgeschlossen ist. Mehrere defer-Skripte werden in der Reihenfolge ausgeführt, in der sie im HTML stehen.
- **Einsatzzeitpunkt**: Geeignet für Skripte, die die vollständige DOM-Struktur benötigen, aber nicht sofort gebraucht werden.
- **Vorteil**: Blockiert nicht das HTML-Parsen, garantiert die Ausführungsreihenfolge und eignet sich für DOM-abhängige Skripte.
- **Nachteil**: Wenn das Skript wichtig ist, kann es die Zeit bis zur Interaktivität der Seite verzögern.

```html
<script defer src="ui-enhancements.js"></script>
```

## Beispiel

Stell dir vor, du bereitest dich auf ein Date vor:

1. **`<script>`**:
   So als würdest du alle Vorbereitungen unterbrechen, um deinen Partner anzurufen und die Date-Details zu bestätigen. Die Kommunikation ist gesichert, aber deine Vorbereitung verzögert sich möglicherweise.

2. **`<script async>`**:
   Vergleichbar damit, dich vorzubereiten und gleichzeitig über Bluetooth-Kopfhörer mit deinem Partner zu telefonieren. Die Effizienz steigt, aber vielleicht ziehst du vor lauter Telefonieren die falschen Klamotten an.

3. **`<script defer>`**:
   Entspricht dem Senden einer Nachricht an deinen Partner, dass du nach den Vorbereitungen zurückrufst. So kannst du dich voll auf die Vorbereitung konzentrieren und danach in Ruhe kommunizieren.

## Aktuelle Nutzung

In der Entwicklung mit modernen Frameworks muss `<script>` in der Regel nicht manuell konfiguriert werden. Vite verwendet beispielsweise standardmäßig module, was dem defer-Verhalten entspricht.

```javascript
<script type="module" src="/src/main.js"></script>
```

Ausgenommen sind spezielle Drittanbieter-Skripte wie Google Analytics.

```javascript
<script async src="https://www.google-analytics.com/analytics.js"></script>
```
