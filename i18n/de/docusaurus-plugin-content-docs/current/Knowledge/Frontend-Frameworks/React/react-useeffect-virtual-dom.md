---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect und Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> Was ist `useEffect`?

### Kernkonzept

`useEffect` ist der Hook in funktionalen React-Komponenten, der fuer die Verwaltung von Seiteneffekten (Side Effects) zustaendig ist. Er fuehrt nach dem Rendern der Komponente asynchrone Datenanfragen, Subscriptions, DOM-Manipulationen oder manuelle Zustandssynchronisation aus und entspricht den Lifecycle-Methoden `componentDidMount`, `componentDidUpdate` und `componentWillUnmount` von Klassenkomponenten.

### Haeufige Anwendungsfaelle

- Entfernte Daten abrufen und den Komponentenzustand aktualisieren
- Subscriptions oder Event-Listener verwalten (wie `resize`, `scroll`)
- Mit Browser-APIs interagieren (wie `document.title` aktualisieren, `localStorage` verwenden)
- Ressourcen aus der vorherigen Renderung bereinigen (wie Anfragen abbrechen, Listener entfernen)

<details>
<summary>Klicken Sie hier, um das grundlegende Beispiel zu erweitern</summary>

```javascript
import { useEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Klicks: ${count}`;
  });

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      Klick mich
    </button>
  );
}
```

</details>

## 2. When does `useEffect` run?

> Wann wird `useEffect` ausgefuehrt?

Der zweite Parameter von `useEffect` ist das **Abhaengigkeits-Array (Dependency Array)**, das den Ausfuehrungszeitpunkt des Seiteneffekts steuert. React vergleicht jeden Wert im Array einzeln und fuehrt den Seiteneffekt bei erkannten Aenderungen erneut aus, wobei vor der naechsten Ausfuehrung die Bereinigungsfunktion ausgeloest wird.

### 2.1 Haeufige Abhaengigkeitsmuster

```javascript
// 1. Nach jeder Renderung ausfuehren (einschliesslich der ersten)
useEffect(() => {
  console.log('Jede State-Aenderung loest dies aus');
});

// 2. Nur einmal bei der initialen Renderung ausfuehren
useEffect(() => {
  console.log('Wird nur beim Mounten der Komponente ausgefuehrt');
}, []);

// 3. Abhaengigkeitsvariablen angeben
useEffect(() => {
  console.log('Wird nur bei Aenderung von selectedId ausgeloest');
}, [selectedId]);
```

### 2.2 Bereinigungsfunktion und Ressourcenfreigabe

```javascript
useEffect(() => {
  const handler = () => {
    console.log('Ueberwachung aktiv');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
    console.log('Listener entfernt');
  };
}, []);
```

Das obige Beispiel verwendet die Bereinigungsfunktion, um den Event-Listener zu entfernen. React fuehrt die Bereinigungsfunktion vor dem Unmounten der Komponente oder vor der Aktualisierung der Abhaengigkeitsvariablen aus, um Speicherlecks und doppelte Listener zu vermeiden.

## 3. What is the difference between Real DOM and Virtual DOM?

> Was ist der Unterschied zwischen Real DOM und Virtual DOM?

| Aspekt | Real DOM | Virtual DOM |
| -------- | -------------------------------- | ------------------------------ |
| Struktur | Physische Knoten, die vom Browser verwaltet werden | Knoten, die durch JavaScript-Objekte beschrieben werden |
| Aktualisierungskosten | Direkte Manipulation loest Layout und Repaint aus, hohe Kosten | Berechnet zuerst Unterschiede und wendet sie stapelweise an, niedrige Kosten |
| Aktualisierungsstrategie | Sofortige Darstellung auf dem Bildschirm | Erstellt neuen Baum im Speicher und vergleicht Unterschiede |
| Erweiterbarkeit | Erfordert manuelle Steuerung des Aktualisierungsflusses | Kann Zwischenlogik einfuegen (Diff, Stapelverarbeitung) |

### Warum React Virtual DOM verwendet

```javascript
// Vereinfachte Flussdarstellung (kein echter React-Quellcode)
function renderWithVirtualDOM(newVNode, container) {
  const prevVNode = container.__vnode;
  const patches = diff(prevVNode, newVNode);
  applyPatches(container, patches);
  container.__vnode = newVNode;
}
```

Das Virtual DOM ermoeglicht es React, den Diff im Speicher durchzufuehren, die minimale Aktualisierungsliste zu erhalten und dann einmalig mit dem realen DOM zu synchronisieren, um haeufige Reflows und Repaints zu vermeiden.

## 4. How to coordinate `useEffect` and Virtual DOM?

> Wie arbeiten `useEffect` und Virtual DOM zusammen?

Der Rendering-Fluss von React wird in Render Phase und Commit Phase unterteilt. Der Kernpunkt der Zusammenarbeit zwischen `useEffect` und Virtual DOM ist: Seiteneffekte muessen warten, bis die Aktualisierung des realen DOM abgeschlossen ist, bevor sie ausgefuehrt werden koennen.

### Render Phase (Renderphase)

- React erstellt das neue Virtual DOM und berechnet die Unterschiede zum vorherigen Virtual DOM
- Diese Phase ist eine reine Funktionsberechnung, die unterbrochen oder erneut ausgefuehrt werden kann

### Commit Phase (Commit-Phase)

- React wendet die Unterschiede auf das reale DOM an
- `useLayoutEffect` wird in dieser Phase synchron ausgefuehrt, um sicherzustellen, dass das DOM bereits aktualisiert wurde

### Effect Execution (Ausfuehrungszeitpunkt der Seiteneffekte)

- `useEffect` wird nach dem Ende der Commit Phase ausgefuehrt, nachdem der Browser das Zeichnen abgeschlossen hat
- Dies verhindert, dass Seiteneffekte die Bildschirmaktualisierung blockieren, und verbessert die Benutzererfahrung

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/profile', { signal: controller.signal })
    .then((res) => res.json())
    .then(setProfile)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Laden fehlgeschlagen', error);
      }
    });

  return () => {
    controller.abort(); // Stellt sicher, dass die Anfrage bei Abhaengigkeitsaenderungen oder beim Unmounten abgebrochen wird
  };
}, [userId]);
```

## 5. Quiz Time

> Quizzeit
> Simulation eines Interviewszenarios

### Frage: Erklaeren Sie die Ausfuehrungsreihenfolge des folgenden Codes und schreiben Sie das Ausgabeergebnis

```javascript
import { useEffect, useState } from 'react';

function Demo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('effect 1');
    return () => {
      console.log('cleanup 1');
    };
  });

  useEffect(() => {
    console.log('effect 2');
  }, [visible]);

  return (
    <>
      <p>Status: {visible ? 'sichtbar' : 'verborgen'}</p>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        Umschalten
      </button>
    </>
  );
}
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

- Nach der initialen Renderung wird nacheinander `effect 1`, `effect 2` ausgegeben. Der erste `useEffect` hat kein Abhaengigkeits-Array, der zweite `useEffect` haengt von `visible` ab, aber der Initialwert `false` fuehrt trotzdem zu einer einmaligen Ausfuehrung.
- Nach dem Klicken auf den Button wird `setVisible` ausgeloest, und in der naechsten Renderung wird zuerst die Bereinigungsfunktion der vorherigen Renderung ausgefuehrt, was `cleanup 1` ausgibt, gefolgt von `effect 1` und `effect 2`.
- Da sich `visible` bei jedem Umschalten aendert, wird `effect 2` nach jedem Umschalten erneut ausgefuehrt.

Die endgueltige Ausgabereihenfolge ist: `effect 1` -> `effect 2` -> (nach Klick) `cleanup 1` -> `effect 1` -> `effect 2`.

</details>

## 6. Best Practices

> Beste Praktiken

### Empfohlene Vorgehensweisen

- Das Abhaengigkeits-Array sorgfaeltig pflegen und die ESLint-Regel `react-hooks/exhaustive-deps` verwenden.
- Mehrere `useEffect` nach Verantwortlichkeiten aufteilen, um die Kopplung durch grosse Seiteneffekte zu reduzieren.
- Listener freigeben oder asynchrone Anfragen in der Bereinigungsfunktion abbrechen, um Speicherlecks zu vermeiden.
- `useLayoutEffect` verwenden, wenn Layout-Informationen sofort nach der DOM-Aktualisierung gelesen werden muessen, aber den Performance-Einfluss bewerten.

### Beispiel: Verschiedene Verantwortlichkeiten trennen

```javascript
useEffect(() => {
  document.title = `Aktueller Benutzer: ${user.name}`;
}, [user.name]); // Verwaltet document.title

useEffect(() => {
  const subscription = chatClient.subscribe(roomId);
  return () => subscription.unsubscribe();
}, [roomId]); // Verwaltet Chat-Raum-Verbindung
```

## 7. Interview Summary

> Interview-Zusammenfassung

### Schnelle Wiederholung

1. `useEffect` steuert den Ausfuehrungszeitpunkt ueber das Abhaengigkeits-Array, und die Bereinigungsfunktion ist fuer die Ressourcenfreigabe verantwortlich.
2. Das Virtual DOM findet den minimalen Aktualisierungssatz durch den Diff-Algorithmus und reduziert die Kosten fuer Operationen am realen DOM.
3. Das Verstaendnis von Render Phase und Commit Phase ermoeglicht praezise Antworten ueber den Zusammenhang zwischen Seiteneffekten und dem Renderfluss.
4. In Interviews kann man mit Performance-Optimierungsstrategien ergaenzen, wie Stapelaktualisierungen, Lazy Loading und Memoization.

### Antwortvorlage fuer Interviews

> "React erstellt waehrend des Renderns zunaechst das Virtual DOM, berechnet die Unterschiede und geht dann in die Commit Phase ueber, um das reale DOM zu aktualisieren. `useEffect` wird nach Abschluss des Commits und dem Zeichnen durch den Browser ausgefuehrt und eignet sich daher fuer die Verarbeitung asynchroner Anfragen oder Event-Listener. Solange man das Abhaengigkeits-Array korrekt pflegt und an die Bereinigungsfunktion denkt, lassen sich Speicherlecks und Race Conditions vermeiden."

## Reference

> Referenzen

- [Offizielle React-Dokumentation: Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [Offizielle React-Dokumentation: Rendering](https://react.dev/learn/rendering)
- [Offizielle React-Dokumentation: Rendering Optimizations](https://react.dev/learn/escape-hatches#removing-effect-dependencies)
