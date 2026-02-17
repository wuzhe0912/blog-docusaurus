---
id: async-await
title: '[Medium] 📄 Async/Await'
slug: /async-await
tags: [JavaScript, Quiz, Medium]
---

> 💡 Es wird empfohlen, zuerst [Promise](/docs/promise) zu lesen, um die Grundkonzepte zu verstehen

## Was ist async/await?

`async/await` ist ein in ES2017 (ES8) eingeführter syntaktischer Zucker, der auf Promise aufbaut und asynchronen Code wie synchronen Code aussehen lässt, wodurch er leichter zu lesen und zu warten ist.

**Kernkonzepte**:

- `async`-Funktionen geben immer ein Promise zurück
- `await` kann nur innerhalb von `async`-Funktionen verwendet werden
- `await` pausiert die Funktionsausführung und wartet auf die Fertigstellung des Promise

## Grundlegende Syntax

### async-Funktion

Das Schlüsselwort `async` lässt eine Funktion automatisch ein Promise zurückgeben:

```js
// Traditionelle Promise-Schreibweise
function fetchData() {
  return Promise.resolve('Daten');
}

// async-Schreibweise (äquivalent)
async function fetchData() {
  return 'Daten'; // Wird automatisch in Promise.resolve('Daten') eingewickelt
}

// Aufruf ist identisch
fetchData().then((data) => console.log(data)); // 'Daten'
```

### await-Schlüsselwort

`await` wartet auf die Fertigstellung eines Promise und gibt das Ergebnis zurück:

```js
async function getData() {
  const result = await Promise.resolve('Fertig');
  console.log(result); // 'Fertig'
}
```

## Promise vs async/await Vergleich

### Beispiel 1: Einfache API-Anfrage

**Promise-Schreibweise**:

```js
function getUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error('Fehler:', error);
      throw error;
    });
}
```

**async/await-Schreibweise**:

```js
async function getUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error('Fehler:', error);
    throw error;
  }
}
```

### Beispiel 2: Verkettung mehrerer asynchroner Operationen

**Promise-Schreibweise**:

```js
function processUserData(userId) {
  return fetchUser(userId)
    .then((user) => {
      return fetchPosts(user.id);
    })
    .then((posts) => {
      return fetchComments(posts[0].id);
    })
    .then((comments) => {
      console.log(comments);
      return comments;
    })
    .catch((error) => {
      console.error('Fehler:', error);
    });
}
```

**async/await-Schreibweise**:

```js
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    console.log(comments);
    return comments;
  } catch (error) {
    console.error('Fehler:', error);
  }
}
```

## Fehlerbehandlung

### try/catch vs .catch()

**async/await mit try/catch**:

```js
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Anfrage fehlgeschlagen:', error);
    // Hier können verschiedene Fehlertypen behandelt werden
    if (error.name === 'NetworkError') {
      // Netzwerkfehler behandeln
    }
    throw error; // Erneut werfen oder Standardwert zurückgeben
  }
}
```

**Gemischte Verwendung (nicht empfohlen, aber funktioniert)**:

```js
async function fetchData() {
  const response = await fetch('/api/data').catch((error) => {
    console.error('Anfrage fehlgeschlagen:', error);
    return null;
  });

  if (!response) return null;

  const data = await response.json();
  return data;
}
```

### Mehrschichtiges try/catch

Für Fehler in verschiedenen Phasen können mehrere try/catch-Blöcke verwendet werden:

```js
async function complexOperation() {
  let user;
  try {
    user = await fetchUser();
  } catch (error) {
    console.error('Benutzer abrufen fehlgeschlagen:', error);
    return null;
  }

  try {
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error('Beiträge abrufen fehlgeschlagen:', error);
    return []; // Leeres Array als Standardwert zurückgeben
  }
}
```

## Praktische Anwendungsbeispiele

### Beispiel: Prüfungsbewertungsprozess

> Ablauf: Prüfung bewerten → Belohnung prüfen → Belohnung vergeben → Exmatrikulation oder Bestrafung

```js
// Prüfung bewerten
function correctTest(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const score = Math.round(Math.random() * 100);
      if (score >= 60) {
        resolve({
          name,
          score,
        });
      } else {
        reject('Sie haben die Exmatrikulationsschwelle erreicht');
      }
    }, 2000);
  });
}

// Belohnung prüfen
function checkReward(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.score >= 90) {
        resolve(`${data.name} erhält Kinotickets`);
      } else if (data.score >= 60 && data.score < 90) {
        resolve(`${data.name} erhält eine Auszeichnung`);
      } else {
        reject('Keine Belohnung für Sie');
      }
    }, 2000);
  });
}
```

**Promise-Schreibweise**:

```js
correctTest('John Doe')
  .then((data) => checkReward(data))
  .then((reward) => console.log(reward))
  .catch((error) => console.log(error));
```

**async/await-Umschreibung**:

```js
async function processStudent(name) {
  try {
    const data = await correctTest(name);
    const reward = await checkReward(data);
    console.log(reward);
    return reward;
  } catch (error) {
    console.log(error);
    return null;
  }
}

processStudent('John Doe');
```

### Beispiel: Gleichzeitige Ausführung mehrerer Anfragen

Wenn mehrere Anfragen keine Abhängigkeiten zueinander haben, sollten sie gleichzeitig ausgeführt werden:

**❌ Falsch: Sequenzielle Ausführung (langsamer)**:

```js
async function fetchAllData() {
  const users = await fetchUsers(); // 1 Sekunde warten
  const posts = await fetchPosts(); // Weitere 1 Sekunde warten
  const comments = await fetchComments(); // Weitere 1 Sekunde warten
  // Insgesamt 3 Sekunden
  return { users, posts, comments };
}
```

**✅ Richtig: Gleichzeitige Ausführung (schneller)**:

```js
async function fetchAllData() {
  // Drei Anfragen gleichzeitig starten
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);
  // Nur 1 Sekunde nötig (die Zeit der langsamsten Anfrage)
  return { users, posts, comments };
}
```

**Promise.allSettled() für teilweises Fehlschlagen**:

```js
async function fetchAllData() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);

  const users = results[0].status === 'fulfilled' ? results[0].value : [];
  const posts = results[1].status === 'fulfilled' ? results[1].value : [];
  const comments = results[2].status === 'fulfilled' ? results[2].value : [];

  return { users, posts, comments };
}
```

## Häufige Fallstricke

### 1. await in Schleifen verwenden (sequenzielle Ausführung)

**❌ Falsch: Bei jeder Iteration warten, ineffizient**:

```js
async function processUsers(userIds) {
  const results = [];
  for (const id of userIds) {
    const user = await fetchUser(id); // Sequenzielle Ausführung, sehr langsam!
    results.push(user);
  }
  return results;
}
// Bei 10 Benutzern und 1 Sekunde pro Anfrage dauert es insgesamt 10 Sekunden
```

**✅ Richtig: Gleichzeitige Ausführung mit Promise.all()**:

```js
async function processUsers(userIds) {
  const promises = userIds.map((id) => fetchUser(id));
  const results = await Promise.all(promises);
  return results;
}
// 10 Benutzer gleichzeitig abfragen, nur 1 Sekunde
```

**Kompromiss: Gleichzeitigkeitslimit**:

```js
async function processUsersWithLimit(userIds, limit = 3) {
  const results = [];
  for (let i = 0; i < userIds.length; i += limit) {
    const batch = userIds.slice(i, i + limit);
    const batchResults = await Promise.all(batch.map((id) => fetchUser(id)));
    results.push(...batchResults);
  }
  return results;
}
// Jeweils 3 verarbeiten, um zu viele gleichzeitige Anfragen zu vermeiden
```

### 2. await vergessen

Wenn `await` vergessen wird, erhält man ein Promise statt des tatsächlichen Werts:

```js
// ❌ Falsch
async function getUser() {
  const user = fetchUser(1); // await vergessen, user ist ein Promise
  console.log(user.name); // undefined (Promise hat keine name-Eigenschaft)
}

// ✅ Richtig
async function getUser() {
  const user = await fetchUser(1);
  console.log(user.name); // Korrekter Name
}
```

### 3. await ohne async verwenden

`await` kann nur innerhalb von `async`-Funktionen verwendet werden:

```js
// ❌ Falsch: Syntaxfehler
function getData() {
  const data = await fetchData(); // SyntaxError
  return data;
}

// ✅ Richtig
async function getData() {
  const data = await fetchData();
  return data;
}
```

**Top-Level await**:

In ES2022 und Modulumgebungen kann await auf der obersten Ebene eines Moduls verwendet werden:

```js
// ES2022 module
const data = await fetchData(); // Kann auf Modulebene verwendet werden
console.log(data);
```

### 4. Fehlende Fehlerbehandlung

Ohne try/catch bleiben Fehler unbehandelt:

```js
// ❌ Kann zu unbehandelten Fehlern führen
async function fetchData() {
  const response = await fetch('/api/data'); // Bei Fehler wird eine Exception geworfen
  return response.json();
}

// ✅ Mit Fehlerbehandlung
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    return response.json();
  } catch (error) {
    console.error('Fehler:', error);
    return null; // Oder Standardwert zurückgeben
  }
}
```

### 5. async-Funktionen geben immer ein Promise zurück

Auch ohne `await` gibt eine `async`-Funktion ein Promise zurück:

```js
async function getValue() {
  return 42; // Gibt tatsächlich Promise.resolve(42) zurück
}

// Muss .then() oder await verwenden, um den Wert zu erhalten
getValue().then((value) => console.log(value)); // 42

// Oder
async function printValue() {
  const value = await getValue();
  console.log(value); // 42
}
```

## Fortgeschrittene Anwendungen

### Timeout-Behandlung

Implementierung eines Timeout-Mechanismus mit Promise.race():

```js
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Anfrage-Timeout')), ms);
  });
}

async function fetchWithTimeout(url, ms = 5000) {
  try {
    const response = await Promise.race([fetch(url), timeout(ms)]);
    return await response.json();
  } catch (error) {
    console.error('Anfrage fehlgeschlagen:', error.message);
    throw error;
  }
}

// Verwendung
fetchWithTimeout('/api/data', 3000); // 3 Sekunden Timeout
```

### Wiederholungsmechanismus

Implementierung automatischer Wiederholung bei Fehlschlägen:

```js
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error; // Letzter Versuch fehlgeschlagen, Fehler werfen

      console.log(`Versuch ${i + 1} fehlgeschlagen, Wiederholung in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// Verwendung
fetchWithRetry('/api/data', 3, 2000); // Maximal 3 Versuche, 2 Sekunden Abstand
```

### Sequenzielle Verarbeitung mit Zustandserhaltung

Manchmal muss man sequenziell ausführen, aber alle Ergebnisse behalten:

```js
async function processInOrder(items) {
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);

    // Kann basierend auf dem vorherigen Ergebnis den nächsten Schritt entscheiden
    if (result.shouldStop) {
      break;
    }
  }

  return results;
}
```

## async/await im Event Loop

async/await ist im Kern immer noch Promise und folgt daher denselben Event-Loop-Regeln:

```js
console.log('1');

async function test() {
  console.log('2');
  await Promise.resolve();
  console.log('3');
}

test();

console.log('4');

// Ausgabereihenfolge: 1, 2, 4, 3
```

Analyse:

1. `console.log('1')` - Synchrone Ausführung
2. `test()` wird aufgerufen, `console.log('2')` - Synchrone Ausführung
3. `await Promise.resolve()` - Nachfolgender Code wird in die Micro-Task-Queue eingereiht
4. `console.log('4')` - Synchrone Ausführung
5. Micro Task wird ausgeführt, `console.log('3')`

## Interview-Schwerpunkte

1. **async/await ist syntaktischer Zucker für Promise**: Besser lesbar, aber im Kern identisch
2. **Fehlerbehandlung mit try/catch**: Nicht mit `.catch()`
3. **Gleichzeitige vs. sequenzielle Ausführung beachten**: Nicht blind await in Schleifen verwenden
4. **async-Funktionen geben immer ein Promise zurück**: Auch ohne explizites return Promise
5. **await nur in async-Funktionen verwendbar**: Außer Top-Level await (ES2022)
6. **Event Loop verstehen**: Code nach await ist ein Micro Task

## Verwandte Themen

- [Promise](/docs/promise) - Grundlage von async/await
- [Event Loop](/docs/event-loop) - Ausführungsreihenfolge verstehen

## Reference

- [async function - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [await - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await)
- [Async/await - JavaScript.info](https://javascript.info/async-await)
