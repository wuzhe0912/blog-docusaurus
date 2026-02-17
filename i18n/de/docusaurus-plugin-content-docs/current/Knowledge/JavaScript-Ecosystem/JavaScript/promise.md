---
id: promise
title: '[Medium] 📄 Promise'
slug: /promise
tags: [JavaScript, Quiz, Medium]
---

## Was ist ein Promise?

Promise ist eine neue Funktion von ES6, die hauptsächlich dazu dient, das Problem des Callback Hell zu lösen und den Code lesbarer zu machen. Ein Promise repräsentiert den endgültigen Abschluss oder das Fehlschlagen einer asynchronen Operation sowie deren Ergebniswert.

Ein Promise hat drei Zustände:

- **pending** (ausstehend): Initialzustand
- **fulfilled** (erfüllt): Operation erfolgreich abgeschlossen
- **rejected** (abgelehnt): Operation fehlgeschlagen

## Grundlegende Verwendung

### Promise erstellen

```js
const myPromise = new Promise((resolve, reject) => {
  // Asynchrone Operation
  const success = true;

  if (success) {
    resolve('Erfolg!'); // Promise-Status auf fulfilled setzen
  } else {
    reject('Fehlgeschlagen!'); // Promise-Status auf rejected setzen
  }
});

myPromise
  .then((result) => {
    console.log(result); // 'Erfolg!'
  })
  .catch((error) => {
    console.log(error); // 'Fehlgeschlagen!'
  });
```

### Praktische Anwendung: API-Anfragen verarbeiten

```js
// Eine gemeinsame Funktion zur Verarbeitung von API-Anfragen erstellen
function fetchData(url) {
  return fetch(url)
    .then((response) => {
      // Prüfen, ob die Response im Bereich 200 ~ 299 liegt
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Response in JSON umwandeln und zurückgeben
    })
    .catch((error) => {
      // Prüfen, ob das Netzwerk gestört ist oder die Anfrage abgelehnt wurde
      console.log('There has been a problem with your fetch operation:', error);
      throw error; // Fehler weiterwerfen
    });
}

fetchData('https://jsonplaceholder.typicode.com/users/1')
  .then((userData) => {
    console.log('User data received:', userData);
  })
  .catch((error) => {
    console.log('Error:', error.message);
  });
```

## Promise-Methoden

### .then() / .catch() / .finally()

```js
promise
  .then((result) => {
    // Erfolgsfall behandeln
    return result;
  })
  .catch((error) => {
    // Fehler behandeln
    console.error(error);
  })
  .finally(() => {
    // Wird immer ausgeführt, egal ob Erfolg oder Fehler
    console.log('Promise abgeschlossen');
  });
```

### Promise.all()

Wird erst erfüllt, wenn alle Promise erfüllt sind. Schlägt fehl, sobald eines fehlschlägt.

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('foo'), 100)
);
const promise3 = Promise.resolve(42);

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values); // [3, 'foo', 42]
});
```

**Verwendungszeitpunkt**: Wenn auf den Abschluss mehrerer API-Anfragen gewartet werden muss, bevor die Ausführung fortgesetzt wird.

### Promise.race()

Gibt das Ergebnis des ersten abgeschlossenen Promise zurück (egal ob Erfolg oder Fehler).

```js
const promise1 = new Promise((resolve) =>
  setTimeout(() => resolve('Nummer 1'), 500)
);
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Nummer 2'), 100)
);

Promise.race([promise1, promise2]).then((value) => {
  console.log(value); // 'Nummer 2' (weil schneller abgeschlossen)
});
```

**Verwendungszeitpunkt**: Anfrage-Timeout festlegen, nur das schnellste Ergebnis verwenden.

### Promise.allSettled()

Wartet auf den Abschluss aller Promise (egal ob Erfolg oder Fehler) und gibt alle Ergebnisse zurück.

```js
const promise1 = Promise.resolve(3);
const promise2 = Promise.reject('Fehler');
const promise3 = Promise.resolve(42);

Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 3 },
  //   { status: 'rejected', reason: 'Fehler' },
  //   { status: 'fulfilled', value: 42 }
  // ]
});
```

**Verwendungszeitpunkt**: Wenn alle Promise-Ergebnisse benötigt werden, auch wenn einige fehlschlagen.

### Promise.any()

Gibt das erste erfolgreiche Promise zurück. Schlägt nur fehl, wenn alle fehlschlagen.

```js
const promise1 = Promise.reject('Fehler 1');
const promise2 = new Promise((resolve) =>
  setTimeout(() => resolve('Erfolg'), 100)
);
const promise3 = Promise.reject('Fehler 2');

Promise.any([promise1, promise2, promise3]).then((value) => {
  console.log(value); // 'Erfolg'
});
```

**Verwendungszeitpunkt**: Mehrere Backup-Ressourcen, es reicht, wenn eine erfolgreich ist.

## Interview-Fragen

### Frage 1: Promise-Verkettung und Fehlerbehandlung

Bestimmen Sie die Ausgabe des folgenden Codes:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch((e) => console.log('This will not run'));
```

#### Analyse

Lassen Sie uns den Ausführungsprozess Schritt für Schritt analysieren:

```js
Promise.resolve(1) // Rückgabewert: 1
  .then((x) => x + 1) // x = 1, gibt 2 zurück
  .then(() => {
    throw new Error('My Error'); // Fehler werfen, geht zum catch
  })
  .catch((e) => 1) // Fehler abfangen, gibt 1 zurück (Wichtig: hier wird ein normaler Wert zurückgegeben)
  .then((x) => x + 1) // x = 1, gibt 2 zurück
  .then((x) => console.log(x)) // Gibt 2 aus
  .catch((e) => console.log('This will not run')); // Wird nicht ausgeführt
```

**Antwort: 2**

#### Schlüsselkonzepte

1. **catch fängt den Fehler ab und gibt einen normalen Wert zurück**: Wenn `catch()` einen normalen Wert zurückgibt, fährt die Promise-Kette mit den folgenden `.then()` fort
2. **then nach catch wird weiter ausgeführt**: Da der Fehler bereits behandelt wurde, kehrt die Promise-Kette in den Normalzustand zurück
3. **Das letzte catch wird nicht ausgeführt**: Da kein neuer Fehler geworfen wurde

Wenn der Fehler weitergegeben werden soll, muss er im `catch` erneut geworfen werden:

```js
Promise.resolve(1)
  .then((x) => x + 1)
  .then(() => {
    throw new Error('My Error');
  })
  .catch((e) => {
    console.log('Fehler abgefangen');
    throw e; // Fehler erneut werfen
  })
  .then((x) => x + 1) // Wird nicht ausgeführt
  .then((x) => console.log(x)) // Wird nicht ausgeführt
  .catch((e) => console.log('This will run')); // Wird ausgeführt
```

### Frage 2: Event Loop und Ausführungsreihenfolge

> Diese Frage enthält Event-Loop-Konzepte

Bestimmen Sie die Ausgabe des folgenden Codes:

```js
function a() {
  console.log('Warlock');
}

function b() {
  console.log('Druid');
  Promise.resolve().then(() => {
    console.log('Rogue');
  });
}

function c() {
  console.log('Mage');
}

function d() {
  setTimeout(c, 100);
  const temp = Promise.resolve().then(a);
  console.log('Warrior');
  setTimeout(b, 0);
}

d();
```

#### Ausführungsreihenfolge verstehen

Schauen wir uns zunächst `d()` an:

```js
function d() {
  setTimeout(c, 100); // 4. Macro Task, 100ms Verzögerung, wird zuletzt ausgeführt
  const temp = Promise.resolve().then(a); // 2. Micro Task, wird nach synchronem Code ausgeführt
  console.log('Warrior'); // 1. Synchrone Ausführung, sofortige Ausgabe
  setTimeout(b, 0); // 3. Macro Task, 0ms Verzögerung, aber immer noch Macro Task
}
```

Analyse der Ausführungsreihenfolge:

1. **Synchroner Code**: `console.log('Warrior')` → Gibt `Warrior` aus
2. **Micro Task**: `Promise.resolve().then(a)` → Führt `a()` aus, gibt `Warlock` aus
3. **Macro Task**:
   - `setTimeout(b, 0)` wird zuerst ausgeführt (0ms Verzögerung)
   - Führt `b()` aus, gibt `Druid` aus
   - `Promise.resolve().then(...)` in `b()` ist ein Micro Task, wird sofort ausgeführt, gibt `Rogue` aus
4. **Macro Task**: `setTimeout(c, 100)` wird zuletzt ausgeführt (100ms Verzögerung), gibt `Mage` aus

#### Antwort

```
Warrior
Warlock
Druid
Rogue
Mage
```

#### Schlüsselkonzepte

- **Synchroner Code** > **Micro Task (Promise)** > **Macro Task (setTimeout)**
- `.then()` von Promise gehört zu Micro Tasks und wird nach dem aktuellen Macro Task, aber vor dem nächsten Macro Task ausgeführt
- `setTimeout` gehört selbst mit 0 Verzögerung zu Macro Tasks und wird nach allen Micro Tasks ausgeführt

### Frage 3: Synchrones und Asynchrones im Promise-Konstruktor

Bestimmen Sie die Ausgabe des folgenden Codes:

```js
function printing() {
  console.log(1);
  setTimeout(function () {
    console.log(2);
  }, 1000);
  setTimeout(function () {
    console.log(3);
  }, 0);

  new Promise((resolve, reject) => {
    console.log(4);
    resolve(5);
  }).then((foo) => {
    console.log(6);
  });

  console.log(7);
}

printing();

// output ?
```

#### Beachten Sie den Promise-Block

Der Schlüssel zu dieser Frage: **Code im Promise-Konstruktor wird synchron ausgeführt**, nur `.then()` und `.catch()` sind asynchron.

Analyse der Ausführungsreihenfolge:

```js
console.log(1); // 1. Synchron, gibt 1 aus
setTimeout(() => console.log(2), 1000); // 5. Macro Task, 1000ms Verzögerung
setTimeout(() => console.log(3), 0); // 4. Macro Task, 0ms Verzögerung

new Promise((resolve, reject) => {
  console.log(4); // 2. Synchron! Im Promise-Konstruktor ist es synchron, gibt 4 aus
  resolve(5);
}).then((foo) => {
  console.log(6); // 3. Micro Task, gibt 6 aus
});

console.log(7); // 3. Synchron, gibt 7 aus
```

Ausführungsablauf:

1. **Synchrone Ausführung**: 1 → 4 → 7
2. **Micro Task**: 6
3. **Macro Task** (nach Verzögerungszeit): 3 → 2

#### Antwort

```
1
4
7
6
3
2
```

#### Schlüsselkonzepte

1. **Code im Promise-Konstruktor wird synchron ausgeführt**: `console.log(4)` ist nicht asynchron
2. **Nur `.then()` und `.catch()` sind asynchron**: Sie gehören zu Micro Tasks
3. **Ausführungsreihenfolge**: Synchroner Code → Micro Task → Macro Task

## Häufige Fallstricke

### 1. return vergessen

In einer Promise-Kette führt das Vergessen von `return` dazu, dass das folgende `.then()` `undefined` erhält:

```js
// ❌ Falsch
fetchUser()
  .then((user) => {
    fetchPosts(user.id); // return vergessen
  })
  .then((posts) => {
    console.log(posts); // undefined
  });

// ✅ Richtig
fetchUser()
  .then((user) => {
    return fetchPosts(user.id); // return nicht vergessen
  })
  .then((posts) => {
    console.log(posts); // Korrekte Daten
  });
```

### 2. catch für Fehlerbehandlung vergessen

Nicht abgefangene Promise-Fehler führen zu UnhandledPromiseRejection:

```js
// ❌ Kann zu nicht abgefangenen Fehlern führen
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  });

// ✅ catch hinzufügen
fetchData()
  .then((data) => {
    return processData(data);
  })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error('Fehler aufgetreten:', error);
  });
```

### 3. Missbrauch des Promise-Konstruktors

Es ist nicht nötig, Funktionen, die bereits ein Promise zurückgeben, in ein weiteres Promise einzuwickeln:

```js
// ❌ Unnötige Umwicklung
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}

// ✅ Direkt zurückgeben
function fetchData() {
  return fetch(url);
}
```

### 4. Mehrere catch verketten

Jedes `catch()` fängt nur die Fehler vor ihm ab:

```js
Promise.resolve()
  .then(() => {
    throw new Error('Error 1');
  })
  .catch((e) => {
    console.log('Abgefangen:', e.message); // Abgefangen: Error 1
  })
  .then(() => {
    throw new Error('Error 2');
  })
  .catch((e) => {
    console.log('Abgefangen:', e.message); // Abgefangen: Error 2
  });
```

## Verwandte Themen

- [async/await](/docs/async-await) - Eleganterer syntaktischer Zucker für Promise
- [Event Loop](/docs/event-loop) - Tiefes Verständnis des asynchronen Mechanismus von JavaScript

## Reference

- [Promise - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [Using Promises - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Promise - JavaScript.info](https://javascript.info/promise-basics)
