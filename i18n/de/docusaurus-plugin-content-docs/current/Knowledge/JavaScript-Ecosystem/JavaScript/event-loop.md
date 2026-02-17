---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> Warum braucht JavaScript asynchrone Verarbeitung? Und erklaeren Sie bitte callback und event loop

JavaScript ist von Natur aus eine Single-Thread-Sprache, da eine ihrer Aufgaben die Manipulation der DOM-Struktur des Browsers ist. Wenn mehrere Threads gleichzeitig denselben Knoten aendern wuerden, wuerde die Situation sehr komplex werden. Um dies zu vermeiden, wird Single-Threading verwendet.

Asynchrone Verarbeitung ist eine praktikable Loesung im Single-Thread-Kontext. Wenn eine Aktion 2 Sekunden Wartezeit benoetigt, kann der Browser natuerlich nicht 2 Sekunden an Ort und Stelle warten. Daher werden zuerst alle synchronen Aufgaben ausgefuehrt, waehrend alle asynchronen Aufgaben in die Task Queue (Aufgabenwarteschlange) eingereiht werden.

Die Umgebung, in der der Browser synchrone Aufgaben ausfuehrt, kann als Call Stack verstanden werden. Der Browser fuehrt zuerst alle Aufgaben im Call Stack der Reihe nach aus. Wenn er feststellt, dass der Call Stack leer ist, holt er die wartenden Aufgaben aus der Task Queue und fuehrt sie im Call Stack der Reihe nach aus.

1. Browser prueft, ob der Call Stack leer ist => Nein => Fuehrt weiterhin Aufgaben im Call Stack aus
2. Browser prueft, ob der Call Stack leer ist => Ja => Prueft die Task Queue auf wartende Aufgaben => Vorhanden => Verschiebt sie in den Call Stack zur Ausfuehrung

Dieser sich staendig wiederholende Prozess ist das Konzept des Event Loop.

```js
console.log(1);

// 這個非同步的函式就是 callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// 依序印出 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> Warum ist `setInterval` zeitlich nicht praezise?

1. Da JavaScript eine Single-Thread-Programmiersprache ist (es kann nur eine Aufgabe gleichzeitig ausgefuehrt werden, andere muessen in der Queue warten), fuehrt eine Ausfuehrungszeit des setInterval-Callbacks, die das eingestellte Intervall ueberschreitet, zu einer Verzoegerung des naechsten Callbacks. Wenn setInterval beispielsweise auf eine sekuendliche Ausfuehrung eingestellt ist, aber eine Aktion in der Funktion zwei Sekunden dauert, verzoegert sich die naechste Ausfuehrung um eine Sekunde. Ueber die Zeit wird die Ausfuehrungszeit von setInterval immer ungenauer.

2. Browser oder Laufzeitumgebungen setzen ebenfalls Grenzen. In den meisten gaengigen Browsern (Chrome, Firefox, Safari usw.) betraegt die minimale Intervallzeit etwa 4 Millisekunden. Selbst bei einer Einstellung von 1 Millisekunde erfolgt die Ausfuehrung tatsaechlich nur alle 4 Millisekunden.

3. Wenn das System sehr speicher- oder CPU-intensive Aufgaben ausfuehrt, fuehrt dies ebenfalls zu Verzoegerungen. Bei Aktionen wie Videoschnitt oder Bildverarbeitung ist eine Verzoegerung sehr wahrscheinlich.

4. Da JavaScript auch einen Garbage-Collection-Mechanismus hat: Wenn innerhalb der setInterval-Funktion viele Objekte erstellt werden und nach der Ausfuehrung nicht mehr verwendet werden, werden diese vom GC eingesammelt. Auch dies verursacht Ausfuehrungsverzoegerungen.

### Alternativen

#### requestAnimationFrame

Wenn `setInterval` derzeit fuer Animationsimplementierungen verwendet wird, kann `requestAnimationFrame` als Ersatz in Betracht gezogen werden.

- Synchron mit dem Browser-Repaint: Wird ausgefuehrt, wenn der Browser bereit ist, einen neuen Frame zu zeichnen. Dies ist wesentlich praeziser als mit setInterval oder setTimeout den Repaint-Zeitpunkt zu schaetzen.
- Leistung: Da es mit dem Browser-Repaint synchronisiert ist, wird es nicht ausgefuehrt, wenn der Browser kein Repaint fuer noetig haelt. Dies spart Rechenressourcen, besonders wenn der Tab nicht im Fokus oder minimiert ist.
- Automatische Drosselung: Passt die Ausfuehrungsfrequenz automatisch an verschiedene Geraete und Situationen an, normalerweise 60 Frames pro Sekunde.
- Hochpraeziser Zeitparameter: Kann einen hochpraezisen Zeitparameter (DOMHighResTimeStamp-Typ, mikrosekunden-genau) empfangen, um Animationen oder andere zeitkritische Operationen praeziser zu steuern.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // 如果元素還沒有到達目的地，繼續動畫
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` aktualisiert die Position des Elements in jedem Frame (normalerweise 60 Frames pro Sekunde), bis 500 Pixel erreicht sind. Diese Methode erzielt im Vergleich zu `setInterval` einen glatteren und natuerlicheren Animationseffekt.
