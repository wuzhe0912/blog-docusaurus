---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Set and Map?

> Was sind Set und Map?

`Set` und `Map` sind zwei neue Datenstrukturen, die in ES6 eingeführt wurden. Sie bieten für bestimmte Szenarien geeignetere Lösungen als traditionelle Objekte und Arrays.

### Set (Menge)

**Definition**: `Set` ist eine Sammlung von **eindeutigen Werten**, ähnlich dem mathematischen Konzept einer Menge.

**Eigenschaften**:

- Gespeicherte Werte **wiederholen sich nicht**
- Verwendet `===` zur Gleichheitsprüfung
- Behält die Einfügereihenfolge bei
- Kann jeden Werttyp speichern (primitive Typen oder Objekte)

**Grundlegende Verwendung**:

```javascript
// Set erstellen
const set = new Set();

// Werte hinzufügen
set.add(1);
set.add(2);
set.add(2); // Doppelte Werte werden nicht hinzugefügt
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// Prüfen, ob ein Wert existiert
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// Wert löschen
set.delete(2);
console.log(set.has(2)); // false

// Set leeren
set.clear();
console.log(set.size); // 0
```

**Set aus einem Array erstellen**:

```javascript
// Doppelte Werte aus einem Array entfernen
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// Zurück in ein Array konvertieren
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// Kurzform
const uniqueArr2 = [...new Set(arr)];
```

### Map (Zuordnung)

**Definition**: `Map` ist eine Sammlung von **Schlüssel-Wert-Paaren**, ähnlich einem Objekt, aber die Schlüssel können jeden Typ haben.

**Eigenschaften**:

- Schlüssel können jeden Typ haben (Strings, Zahlen, Objekte, Funktionen usw.)
- Behält die Einfügereihenfolge bei
- Hat die Eigenschaft `size`
- Iterationsreihenfolge entspricht der Einfügereihenfolge

**Grundlegende Verwendung**:

```javascript
// Map erstellen
const map = new Map();

// Schlüssel-Wert-Paare hinzufügen
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// Werte abrufen
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// Prüfen, ob ein Schlüssel existiert
console.log(map.has('name')); // true

// Schlüssel-Wert-Paar löschen
map.delete('name');

// Größe abrufen
console.log(map.size); // 3

// Map leeren
map.clear();
```

**Map aus einem Array erstellen**:

```javascript
// Aus einem zweidimensionalen Array erstellen
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// Aus einem Objekt erstellen
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Unterschiede zwischen Set und Array

| Eigenschaft     | Set                    | Array                    |
| --------------- | ---------------------- | ------------------------ |
| Doppelte Werte  | Nicht erlaubt          | Erlaubt                  |
| Indexzugriff    | Nicht unterstützt      | Unterstützt              |
| Suchleistung    | O(1)                   | O(n)                     |
| Einfügereihenfolge | Beibehalten         | Beibehalten              |
| Gängige Methoden | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**Anwendungsszenarien**:

```javascript
// ✅ Geeignet für Set: Eindeutige Werte benötigt
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Geeignet für Set: Schnelle Existenzprüfung
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('Startseite wurde bereits besucht');
}

// ✅ Geeignet für Array: Index oder doppelte Werte benötigt
const scores = [100, 95, 100, 90]; // Duplikate erlaubt
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Unterschiede zwischen Map und Object

| Eigenschaft     | Map                | Object                     |
| --------------- | ------------------ | -------------------------- |
| Schlüsseltyp    | Jeder Typ          | String oder Symbol         |
| Größe           | `size` Eigenschaft | Manuelle Berechnung nötig  |
| Standardschlüssel | Keine            | Hat Prototypenkette        |
| Iterationsreihenfolge | Einfügereihenfolge | ES2015+ behält Einfügereihenfolge |
| Leistung        | Schneller bei häufigem Hinzufügen/Löschen | Schneller im Allgemeinen |
| JSON            | Nicht direkt unterstützt | Nativ unterstützt       |

**Anwendungsszenarien**:

```javascript
// ✅ Geeignet für Map: Schlüssel sind keine Strings
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Geeignet für Map: Häufiges Hinzufügen/Löschen nötig
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Geeignet für Object: Statische Struktur, JSON benötigt
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config); // Kann direkt serialisiert werden
```

## 4. Common Interview Questions

> Häufige Interviewfragen

### Frage 1: Doppelte Werte aus einem Array entfernen

Implementiere eine Funktion, die doppelte Werte aus einem Array entfernt.

```javascript
function removeDuplicates(arr) {
  // Deine Implementierung
}
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

**Methode 1: Set verwenden (empfohlen)**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**Methode 2: filter + indexOf verwenden**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**Methode 3: reduce verwenden**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**Leistungsvergleich**:

- Set-Methode: O(n), am schnellsten
- filter + indexOf: O(n²), langsamer
- reduce + includes: O(n²), langsamer

</details>

### Frage 2: Prüfen, ob ein Array doppelte Werte hat

Implementiere eine Funktion, die prüft, ob ein Array doppelte Werte enthält.

```javascript
function hasDuplicates(arr) {
  // Deine Implementierung
}
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

**Methode 1: Set verwenden (empfohlen)**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**Methode 2: Set's has-Methode verwenden**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**Methode 3: indexOf verwenden**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**Leistungsvergleich**:

- Set-Methode 1: O(n), am schnellsten
- Set-Methode 2: O(n), kann im Durchschnitt früher beendet werden
- indexOf-Methode: O(n²), langsamer

</details>

### Frage 3: Häufigkeit von Elementen zählen

Implementiere eine Funktion, die zählt, wie oft jedes Element in einem Array vorkommt.

```javascript
function countOccurrences(arr) {
  // Deine Implementierung
}
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

**Methode 1: Map verwenden (empfohlen)**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**Methode 2: reduce + Map verwenden**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**Methode 3: In Objekt konvertieren**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**Vorteile der Verwendung von Map**:

- Schlüssel können jeden Typ haben (Objekte, Funktionen usw.)
- Hat die Eigenschaft `size`
- Iterationsreihenfolge entspricht der Einfügereihenfolge

</details>

### Frage 4: Schnittmenge zweier Arrays finden

Implementiere eine Funktion, die die Schnittmenge (gemeinsame Elemente) zweier Arrays findet.

```javascript
function intersection(arr1, arr2) {
  // Deine Implementierung
}
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

**Methode 1: Set verwenden**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**Methode 2: filter + Set verwenden**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**Methode 3: filter + includes verwenden**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**Leistungsvergleich**:

- Set-Methode: O(n + m), am schnellsten
- filter + includes: O(n × m), langsamer

</details>

### Frage 5: Differenzmenge zweier Arrays finden

Implementiere eine Funktion, die die Differenzmenge zweier Arrays findet (Elemente in arr1, die nicht in arr2 sind).

```javascript
function difference(arr1, arr2) {
  // Deine Implementierung
}
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

**Methode 1: Set verwenden**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**Methode 2: Set zum Deduplizieren und dann filtern**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**Methode 3: includes verwenden**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**Leistungsvergleich**:

- Set-Methode: O(n + m), am schnellsten
- includes-Methode: O(n × m), langsamer

</details>

### Frage 6: LRU Cache implementieren

Verwende Map, um einen LRU (Least Recently Used) Cache zu implementieren.

```javascript
class LRUCache {
  constructor(capacity) {
    // Deine Implementierung
  }

  get(key) {
    // Deine Implementierung
  }

  put(key, value) {
    // Deine Implementierung
  }
}
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

**Implementierung**:

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // Schlüssel ans Ende verschieben (zeigt kürzliche Nutzung an)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // Wenn der Schlüssel bereits existiert, zuerst löschen
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Wenn die Kapazität voll ist, ältesten Schlüssel (den ersten) löschen
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // Schlüssel-Wert-Paar hinzufügen (wird automatisch ans Ende gesetzt)
    this.cache.set(key, value);
  }
}

// Anwendungsbeispiel
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // Entfernt Schlüssel 2
console.log(cache.get(2)); // -1 (bereits entfernt)
console.log(cache.get(3)); // 'three'
```

**Erklärung**:

- Map behält die Einfügereihenfolge bei, der erste Schlüssel ist der älteste
- Bei `get` wird der Schlüssel ans Ende verschoben, um kürzliche Nutzung anzuzeigen
- Bei `put` wird der erste Schlüssel gelöscht, wenn die Kapazität voll ist

</details>

### Frage 7: Objekte als Map-Schlüssel verwenden

Erkläre die Ausgabe des folgenden Codes.

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

```javascript
// 'first'
// 'second'
// 2
```

**Erklärung**:

- `obj1` und `obj2` haben den gleichen Inhalt, sind aber **verschiedene Objektinstanzen**
- Map verwendet **Referenzvergleich** (reference comparison), nicht Wertvergleich
- Daher werden `obj1` und `obj2` als verschiedene Schlüssel behandelt
- Wenn ein normales Objekt als Map verwendet wird, wird das Objekt in den String `[object Object]` konvertiert, wodurch alle Objekte zum gleichen Schlüssel werden

**Vergleich mit normalen Objekten**:

```javascript
// Normales Objekt: Schlüssel werden in Strings konvertiert
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second' (überschrieben)
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]'] (nur ein Schlüssel)

// Map: Behält Objektreferenz bei
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet und WeakMap

> Unterschiede zwischen WeakSet und WeakMap

### WeakSet

**Eigenschaften**:

- Kann nur **Objekte** speichern (keine primitiven Typen)
- **Schwache Referenz**: Wenn das Objekt keine anderen Referenzen hat, wird es vom Garbage Collector erfasst
- Hat keine `size` Eigenschaft
- Nicht iterierbar
- Hat keine `clear` Methode

**Anwendungsszenario**: Objekte markieren, Speicherlecks vermeiden

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// Wenn obj1 keine anderen Referenzen hat, wird es vom Garbage Collector erfasst
// Die Referenz im weakSet wird ebenfalls automatisch entfernt
```

### WeakMap

**Eigenschaften**:

- Schlüssel können nur **Objekte** sein (keine primitiven Typen)
- **Schwache Referenz**: Wenn das Schlüsselobjekt keine anderen Referenzen hat, wird es vom Garbage Collector erfasst
- Hat keine `size` Eigenschaft
- Nicht iterierbar
- Hat keine `clear` Methode

**Anwendungsszenario**: Private Daten von Objekten speichern, Speicherlecks vermeiden

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// Wenn obj1 keine anderen Referenzen hat, wird es vom Garbage Collector erfasst
// Das Schlüssel-Wert-Paar im weakMap wird ebenfalls automatisch entfernt
```

### Vergleich WeakSet/WeakMap vs Set/Map

| Eigenschaft        | Set/Map              | WeakSet/WeakMap        |
| ------------------ | -------------------- | ---------------------- |
| Schlüssel-/Werttyp | Jeder Typ            | Nur Objekte            |
| Schwache Referenz  | Nein                 | Ja                     |
| Iterierbar         | Ja                   | Nein                   |
| size Eigenschaft   | Vorhanden            | Nicht vorhanden        |
| clear Methode      | Vorhanden            | Nicht vorhanden        |
| Garbage Collection | Keine automatische Bereinigung | Automatische Bereinigung |

## 6. Best Practices

> Bewährte Praktiken

### Empfohlene Vorgehensweise

```javascript
// 1. Set verwenden, wenn eindeutige Werte benötigt werden
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. Set verwenden, wenn schnelle Suche benötigt wird
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // Zugriff erlauben
}

// 3. Map verwenden, wenn Schlüssel keine Strings sind
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. Map verwenden, wenn häufiges Hinzufügen/Löschen nötig ist
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. WeakMap verwenden, um Objektdaten zu verknüpfen und Speicherlecks zu vermeiden
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### Zu vermeidende Vorgehensweise

```javascript
// 1. Set nicht als Ersatz für alle Array-Funktionen verwenden
// ❌ Schlecht: Set verwenden, wenn Indexzugriff benötigt wird
const set = new Set([1, 2, 3]);
// set[0] // undefined, kein Indexzugriff möglich

// ✅ Gut: Array verwenden, wenn Indexzugriff benötigt wird
const arr = [1, 2, 3];
arr[0]; // 1

// 2. Map nicht als Ersatz für alle Objektfunktionen verwenden
// ❌ Schlecht: Map für einfache statische Strukturen verwenden
const config = new Map();
config.set('apiUrl', 'https://api.example.com');
config.set('timeout', 5000);

// ✅ Gut: Objekt für einfache Strukturen verwenden
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. Set und Map nicht verwechseln
// ❌ Fehler: Set hat keine Schlüssel-Wert-Paare
const set = new Set();
set.set('key', 'value'); // TypeError: set.set is not a function

// ✅ Richtig: Map hat Schlüssel-Wert-Paare
const map = new Map();
map.set('key', 'value');
```

## 7. Interview Summary

> Zusammenfassung für Interviews

### Schnelle Merkhilfe

**Set (Menge)**:

- Eindeutige Werte, keine Duplikate
- Schnelle Suche: O(1)
- Geeignet für: Deduplizierung, schnelle Existenzprüfung

**Map (Zuordnung)**:

- Schlüssel-Wert-Paare, Schlüssel können jeden Typ haben
- Behält Einfügereihenfolge bei
- Geeignet für: Nicht-String-Schlüssel, häufiges Hinzufügen/Löschen

**WeakSet/WeakMap**:

- Schwache Referenz, automatische Garbage Collection
- Schlüssel/Werte können nur Objekte sein
- Geeignet für: Vermeidung von Speicherlecks

### Beispielantwort im Interview

**Q: Wann sollte man Set statt eines Arrays verwenden?**

> "Man sollte Set verwenden, wenn die Eindeutigkeit der Werte gewährleistet sein muss oder wenn schnell geprüft werden soll, ob ein Wert existiert. Die `has`-Methode von Set hat eine Zeitkomplexität von O(1), während `includes` eines Arrays O(n) ist. Zum Beispiel ist Set beim Entfernen von Duplikaten aus Arrays oder bei der Prüfung von Benutzerberechtigungen effizienter."

**Q: Was ist der Unterschied zwischen Map und Object?**

> "Die Schlüssel von Map können jeden Typ haben, einschließlich Objekte, Funktionen usw., während die Schlüssel eines Objekts nur Strings oder Symbols sein können. Map hat die Eigenschaft `size`, um die Größe direkt abzurufen, während ein Objekt manuelle Berechnung erfordert. Map behält die Einfügereihenfolge bei und hat keine Prototypenkette, was es für die Speicherung reiner Daten geeignet macht. Wenn Objekte als Schlüssel verwendet werden müssen oder häufiges Hinzufügen/Löschen erforderlich ist, ist Map die bessere Wahl."

**Q: Was ist der Unterschied zwischen WeakMap und Map?**

> "Die Schlüssel von WeakMap können nur Objekte sein und verwenden schwache Referenzen. Wenn das Schlüsselobjekt keine anderen Referenzen hat, wird der entsprechende Eintrag in WeakMap automatisch vom Garbage Collector erfasst, was Speicherlecks verhindert. WeakMap ist nicht iterierbar und hat keine `size`-Eigenschaft. Es eignet sich zur Speicherung privater Daten oder Metadaten von Objekten; wenn das Objekt zerstört wird, werden die zugehörigen Daten automatisch bereinigt."

## Reference

- [MDN - Set](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
