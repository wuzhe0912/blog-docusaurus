---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> Warum braucht JavaScript asynchrone Verarbeitung? Und erklären Sie bitte callback und event loop

JavaScript ist von Natur aus eine Single-Thread-Sprache, da eine ihrer Aufgaben die Manipulation der DOM-Struktur des Browsers ist. Wenn mehrere Threads gleichzeitig denselben Knoten ändern würden, würde die Situation sehr komplex werden. Um dies zu vermeiden, wird Single-Threading verwendet.

Asynchrone Verarbeitung ist eine praktikable Lösung im Single-Thread-Kontext. Wenn eine Aktion 2 Sekunden Wartezeit benötigt, kann der Browser natürlich nicht 2 Sekunden an Ort und Stelle warten. Daher werden zuerst alle synchronen Aufgaben ausgeführt, während alle asynchronen Aufgaben in die Task Queue (Aufgabenwarteschlange) eingereiht werden.

Die Umgebung, in der der Browser synchrone Aufgaben ausführt, kann als Call Stack verstanden werden. Der Browser führt zuerst alle Aufgaben im Call Stack der Reihe nach aus. Wenn er feststellt, dass der Call Stack leer ist, holt er die wartenden Aufgaben aus der Task Queue und führt sie im Call Stack der Reihe nach aus.

1. Browser prüft, ob der Call Stack leer ist => Nein => Führt weiterhin Aufgaben im Call Stack aus
2. Browser prüft, ob der Call Stack leer ist => Ja => Prüft die Task Queue auf wartende Aufgaben => Vorhanden => Verschiebt sie in den Call Stack zur Ausführung

Dieser sich ständig wiederholende Prozess ist das Konzept des Event Loop.

```js
console.log(1);

// Diese asynchrone Funktion ist der Callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// Gibt in der Reihenfolge 1 3 2 aus
```

## 2. Why is setInterval not accurate in terms of timing ?

> Warum ist `setInterval` zeitlich nicht präzise?

1. Da JavaScript eine Single-Thread-Programmiersprache ist (es kann nur eine Aufgabe gleichzeitig ausgeführt werden, andere müssen in der Queue warten), führt eine Ausführungszeit des setInterval-Callbacks, die das eingestellte Intervall überschreitet, zu einer Verzögerung des nächsten Callbacks. Wenn setInterval beispielsweise auf eine sekündliche Ausführung eingestellt ist, aber eine Aktion in der Funktion zwei Sekunden dauert, verzögert sich die nächste Ausführung um eine Sekunde. Über die Zeit wird die Ausführungszeit von setInterval immer ungenauer.

2. Browser oder Laufzeitumgebungen setzen ebenfalls Grenzen. In den meisten gängigen Browsern (Chrome, Firefox, Safari usw.) beträgt die minimale Intervallzeit etwa 4 Millisekunden. Selbst bei einer Einstellung von 1 Millisekunde erfolgt die Ausführung tatsächlich nur alle 4 Millisekunden.

3. Wenn das System sehr speicher- oder CPU-intensive Aufgaben ausführt, führt dies ebenfalls zu Verzögerungen. Bei Aktionen wie Videoschnitt oder Bildverarbeitung ist eine Verzögerung sehr wahrscheinlich.

4. Da JavaScript auch einen Garbage-Collection-Mechanismus hat: Wenn innerhalb der setInterval-Funktion viele Objekte erstellt werden und nach der Ausführung nicht mehr verwendet werden, werden diese vom GC eingesammelt. Auch dies verursacht Ausführungsverzögerungen.

### Alternativen

#### requestAnimationFrame

Wenn `setInterval` derzeit für Animationsimplementierungen verwendet wird, kann `requestAnimationFrame` als Ersatz in Betracht gezogen werden.

- Synchron mit dem Browser-Repaint: Wird ausgeführt, wenn der Browser bereit ist, einen neuen Frame zu zeichnen. Dies ist wesentlich präziser als mit setInterval oder setTimeout den Repaint-Zeitpunkt zu schätzen.
- Leistung: Da es mit dem Browser-Repaint synchronisiert ist, wird es nicht ausgeführt, wenn der Browser kein Repaint für nötig hält. Dies spart Rechenressourcen, besonders wenn der Tab nicht im Fokus oder minimiert ist.
- Automatische Drosselung: Passt die Ausführungsfrequenz automatisch an verschiedene Geräte und Situationen an, normalerweise 60 Frames pro Sekunde.
- Hochpräziser Zeitparameter: Kann einen hochpräzisen Zeitparameter (DOMHighResTimeStamp-Typ, mikrosekunden-genau) empfangen, um Animationen oder andere zeitkritische Operationen präziser zu steuern.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // Wenn das Element das Ziel noch nicht erreicht hat, Animation fortsetzen
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` aktualisiert die Position des Elements in jedem Frame (normalerweise 60 Frames pro Sekunde), bis 500 Pixel erreicht sind. Diese Methode erzielt im Vergleich zu `setInterval` einen glatteren und natürlicheren Animationseffekt.
