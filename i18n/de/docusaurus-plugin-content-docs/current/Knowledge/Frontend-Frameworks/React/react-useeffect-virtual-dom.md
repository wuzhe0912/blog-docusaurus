---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect und Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> Was ist `useEffect`?

### Kernkonzept

`useEffect` ist der Hook in funktionalen React-Komponenten, der für die Verwaltung von Seiteneffekten (Side Effects) zuständig ist. Er führt nach dem Rendern der Komponente asynchrone Datenanfragen, Subscriptions, DOM-Manipulationen oder manuelle Zustandssynchronisation aus und entspricht den Lifecycle-Methoden `componentDidMount`, `componentDidUpdate` und `componentWillUnmount` von Klassenkomponenten.

### Häufige Anwendungsfälle

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

> Wann wird `useEffect` ausgeführt?

Der zweite Parameter von `useEffect` ist das **Abhängigkeits-Array (Dependency Array)**, das den Ausführungszeitpunkt des Seiteneffekts steuert. React vergleicht jeden Wert im Array einzeln und führt den Seiteneffekt bei erkannten Änderungen erneut aus, wobei vor der nächsten Ausführung die Bereinigungsfunktion ausgelöst wird.

### 2.1 Häufige Abhängigkeitsmuster

```javascript
// 1. Nach jeder Renderung ausführen (einschließlich der ersten)
useEffect(() => {
  console.log('Jede State-Änderung löst dies aus');
});

// 2. Nur einmal bei der initialen Renderung ausführen
useEffect(() => {
  console.log('Wird nur beim Mounten der Komponente ausgeführt');
}, []);

// 3. Abhängigkeitsvariablen angeben
useEffect(() => {
  console.log('Wird nur bei Änderung von selectedId ausgelöst');
}, [selectedId]);
```

### 2.2 Bereinigungsfunktion und Ressourcenfreigabe

```javascript
useEffect(() => {
  const handler = () => {
    console.log('Überwachung aktiv');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
    console.log('Listener entfernt');
  };
}, []);
```

Das obige Beispiel verwendet die Bereinigungsfunktion, um den Event-Listener zu entfernen. React führt die Bereinigungsfunktion vor dem Unmounten der Komponente oder vor der Aktualisierung der Abhängigkeitsvariablen aus, um Speicherlecks und doppelte Listener zu vermeiden.

## 3. What is the difference between Real DOM and Virtual DOM?

> Was ist der Unterschied zwischen Real DOM und Virtual DOM?

| Aspekt | Real DOM | Virtual DOM |
| -------- | -------------------------------- | ------------------------------ |
| Struktur | Physische Knoten, die vom Browser verwaltet werden | Knoten, die durch JavaScript-Objekte beschrieben werden |
| Aktualisierungskosten | Direkte Manipulation löst Layout und Repaint aus, hohe Kosten | Berechnet zuerst Unterschiede und wendet sie stapelweise an, niedrige Kosten |
| Aktualisierungsstrategie | Sofortige Darstellung auf dem Bildschirm | Erstellt neuen Baum im Speicher und vergleicht Unterschiede |
| Erweiterbarkeit | Erfordert manuelle Steuerung des Aktualisierungsflusses | Kann Zwischenlogik einfügen (Diff, Stapelverarbeitung) |

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

Das Virtual DOM ermöglicht es React, den Diff im Speicher durchzuführen, die minimale Aktualisierungsliste zu erhalten und dann einmalig mit dem realen DOM zu synchronisieren, um häufige Reflows und Repaints zu vermeiden.

## 4. How to coordinate `useEffect` and Virtual DOM?

> Wie arbeiten `useEffect` und Virtual DOM zusammen?

Der Rendering-Fluss von React wird in Render Phase und Commit Phase unterteilt. Der Kernpunkt der Zusammenarbeit zwischen `useEffect` und Virtual DOM ist: Seiteneffekte müssen warten, bis die Aktualisierung des realen DOM abgeschlossen ist, bevor sie ausgeführt werden können.

### Render Phase (Renderphase)

- React erstellt das neue Virtual DOM und berechnet die Unterschiede zum vorherigen Virtual DOM
- Diese Phase ist eine reine Funktionsberechnung, die unterbrochen oder erneut ausgeführt werden kann

### Commit Phase (Commit-Phase)

- React wendet die Unterschiede auf das reale DOM an
- `useLayoutEffect` wird in dieser Phase synchron ausgeführt, um sicherzustellen, dass das DOM bereits aktualisiert wurde

### Effect Execution (Ausführungszeitpunkt der Seiteneffekte)

- `useEffect` wird nach dem Ende der Commit Phase ausgeführt, nachdem der Browser das Zeichnen abgeschlossen hat
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
    controller.abort(); // Stellt sicher, dass die Anfrage bei Abhängigkeitsänderungen oder beim Unmounten abgebrochen wird
  };
}, [userId]);
```

## 5. Quiz Time

> Quizzeit
> Simulation eines Interviewszenarios

### Frage: Erklären Sie die Ausführungsreihenfolge des folgenden Codes und schreiben Sie das Ausgabeergebnis

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

- Nach der initialen Renderung wird nacheinander `effect 1`, `effect 2` ausgegeben. Der erste `useEffect` hat kein Abhängigkeits-Array, der zweite `useEffect` hängt von `visible` ab, aber der Initialwert `false` führt trotzdem zu einer einmaligen Ausführung.
- Nach dem Klicken auf den Button wird `setVisible` ausgelöst, und in der nächsten Renderung wird zuerst die Bereinigungsfunktion der vorherigen Renderung ausgeführt, was `cleanup 1` ausgibt, gefolgt von `effect 1` und `effect 2`.
- Da sich `visible` bei jedem Umschalten ändert, wird `effect 2` nach jedem Umschalten erneut ausgeführt.

Die endgültige Ausgabereihenfolge ist: `effect 1` -> `effect 2` -> (nach Klick) `cleanup 1` -> `effect 1` -> `effect 2`.

</details>

## 6. Best Practices

> Beste Praktiken

### Empfohlene Vorgehensweisen

- Das Abhängigkeits-Array sorgfältig pflegen und die ESLint-Regel `react-hooks/exhaustive-deps` verwenden.
- Mehrere `useEffect` nach Verantwortlichkeiten aufteilen, um die Kopplung durch große Seiteneffekte zu reduzieren.
- Listener freigeben oder asynchrone Anfragen in der Bereinigungsfunktion abbrechen, um Speicherlecks zu vermeiden.
- `useLayoutEffect` verwenden, wenn Layout-Informationen sofort nach der DOM-Aktualisierung gelesen werden müssen, aber den Performance-Einfluss bewerten.

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

1. `useEffect` steuert den Ausführungszeitpunkt über das Abhängigkeits-Array, und die Bereinigungsfunktion ist für die Ressourcenfreigabe verantwortlich.
2. Das Virtual DOM findet den minimalen Aktualisierungssatz durch den Diff-Algorithmus und reduziert die Kosten für Operationen am realen DOM.
3. Das Verständnis von Render Phase und Commit Phase ermöglicht präzise Antworten über den Zusammenhang zwischen Seiteneffekten und dem Renderfluss.
4. In Interviews kann man mit Performance-Optimierungsstrategien ergänzen, wie Stapelaktualisierungen, Lazy Loading und Memoization.

### Antwortvorlage für Interviews

> "React erstellt während des Renderns zunächst das Virtual DOM, berechnet die Unterschiede und geht dann in die Commit Phase über, um das reale DOM zu aktualisieren. `useEffect` wird nach Abschluss des Commits und dem Zeichnen durch den Browser ausgeführt und eignet sich daher für die Verarbeitung asynchroner Anfragen oder Event-Listener. Solange man das Abhängigkeits-Array korrekt pflegt und an die Bereinigungsfunktion denkt, lassen sich Speicherlecks und Race Conditions vermeiden."

## Reference

> Referenzen

- [Offizielle React-Dokumentation: Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [Offizielle React-Dokumentation: Rendering](https://react.dev/learn/rendering)
- [Offizielle React-Dokumentation: Rendering Optimizations](https://react.dev/learn/escape-hatches#removing-effect-dependencies)
