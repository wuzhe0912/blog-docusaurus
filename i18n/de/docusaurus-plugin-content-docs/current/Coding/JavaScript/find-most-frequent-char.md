---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> Problembeschreibung

Implementieren Sie eine Funktion, die einen String entgegennimmt und das am häufigsten vorkommende Zeichen in diesem String zurückgibt.

### Beispiele

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> Implementierungsmethoden

### Methode 1: Zählung mit Objekt (Basisversion)

**Ansatz**: Den String durchlaufen, mit einem Objekt die Häufigkeit jedes Zeichens erfassen und dann das häufigste Zeichen finden.

```javascript
function findMostFrequentChar(str) {
  // Objekt zur Speicherung von Zeichen und Zählung initialisieren
  const charCount = {};

  // Variablen für maximale Zählung und Zeichen initialisieren
  let maxCount = 0;
  let maxChar = '';

  // String durchlaufen
  for (let char of str) {
    // Wenn das Zeichen nicht im Objekt ist, Zählung auf 0 setzen
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Zählung dieses Zeichens erhöhen
    charCount[char]++;

    // Wenn die Zählung dieses Zeichens größer als die maximale Zählung ist
    // Maximale Zählung und maximales Zeichen aktualisieren
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Maximales Zeichen zurückgeben
  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Zeitkomplexität**: O(n), wobei n die Länge des Strings ist
**Platzkomplexität**: O(k), wobei k die Anzahl verschiedener Zeichen ist

### Methode 2: Erst zählen, dann Maximum finden (Zwei Phasen)

**Ansatz**: Erst einmal durchlaufen, um die Häufigkeit aller Zeichen zu berechnen, dann ein zweites Mal, um den Maximalwert zu finden.

```javascript
function findMostFrequentChar(str) {
  // Phase 1: Häufigkeit jedes Zeichens berechnen
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Phase 2: Das häufigste Zeichen finden
  let maxCount = 0;
  let maxChar = '';

  for (let char in charCount) {
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Vorteile**: Klarere Logik, phasenweise Verarbeitung
**Nachteile**: Zwei Durchläufe erforderlich

### Methode 3: Verwendung von Map (ES6)

**Ansatz**: Map verwenden, um die Zuordnung von Zeichen und Zählung zu speichern.

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Vorteile**: Verwendung von Map entspricht dem modernen JavaScript-Stil
**Nachteile**: Für einfache Szenarien kann ein Objekt intuitiver sein

### Methode 4: Verwendung von reduce (funktionaler Stil)

**Ansatz**: `reduce` und `Object.entries` zur Implementierung verwenden.

```javascript
function findMostFrequentChar(str) {
  // Häufigkeit jedes Zeichens berechnen
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Das häufigste Zeichen finden
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Vorteile**: Funktionaler Stil, kompakter Code
**Nachteile**: Geringere Lesbarkeit, leicht niedrigere Leistung

### Methode 5: Behandlung mehrerer gleicher Maximalwerte

**Ansatz**: Wenn mehrere Zeichen die gleiche höchste Häufigkeit haben, ein Array oder das erste gefundene zurückgeben.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Häufigkeit jedes Zeichens berechnen
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Alle Zeichen mit maximaler Häufigkeit finden
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Das erste gefundene zurückgeben (oder das gesamte Array)
  return mostFrequentChars[0];
  // Oder alle zurückgeben: return mostFrequentChars;
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a' (das erste gefundene)
```

## 3. Edge Cases

> Behandlung von Grenzfällen

### Leerer String

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // Oder throw new Error('String cannot be empty')
  }

  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Groß-/Kleinschreibung

```javascript
function findMostFrequentChar(str, caseSensitive = true) {
  const processedStr = caseSensitive ? str : str.toLowerCase();
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('Hello', false)); // 'l' (Groß-/Kleinschreibung ignoriert)
console.log(findMostFrequentChar('Hello', true)); // 'l' (Groß-/Kleinschreibung beachtet)
```

### Leerzeichen und Sonderzeichen

```javascript
function findMostFrequentChar(str, ignoreSpaces = false) {
  const processedStr = ignoreSpaces ? str.replace(/\s/g, '') : str;
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('hello world', true)); // 'l' (Leerzeichen ignoriert)
console.log(findMostFrequentChar('hello world', false)); // ' ' (Leerzeichen)
```

## 4. Common Interview Questions

> Häufige Interviewfragen

### Aufgabe 1: Grundlegende Implementierung

Implementieren Sie eine Funktion, die das am häufigsten vorkommende Zeichen in einem String findet.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Kernpunkte**:

- Objekt oder Map verwenden, um die Häufigkeit jedes Zeichens zu erfassen
- Während des Durchlaufs gleichzeitig den Maximalwert aktualisieren
- Zeitkomplexität O(n), Platzkomplexität O(k)

</details>

### Aufgabe 2: Optimierte Version

Optimieren Sie die obige Funktion, um mehrere gleiche Maximalwerte behandeln zu können.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Phase 1: Häufigkeit jedes Zeichens berechnen
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Phase 2: Alle Zeichen mit maximaler Häufigkeit finden
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Je nach Anforderung das erste oder alle zurückgeben
  return mostFrequentChars[0]; // Oder mostFrequentChars zurückgeben
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### Aufgabe 3: Implementierung mit Map

Implementieren Sie diese Funktion mit ES6 Map.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object**:

- **Map**: Besser geeignet für dynamische Schlüssel-Wert-Paare, Schlüssel können jeden Typ haben
- **Object**: Einfacher und intuitiver, geeignet für String-Schlüssel

</details>

## 5. Best Practices

> Bewährte Methoden

### Empfohlene Vorgehensweisen

```javascript
// 1. Klare Variablennamen verwenden
function findMostFrequentChar(str) {
  const charCount = {}; // Zweck klar ausdrücken
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Grenzfälle behandeln
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Während des Durchlaufs gleichzeitig den Maximalwert aktualisieren (ein Durchlauf)
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Zu vermeidende Vorgehensweisen

```javascript
// 1. Keine zwei Durchläufe verwenden (es sei denn, es ist notwendig)
// ❌ Schlechtere Leistung
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Zweiter Durchlauf
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. Die Behandlung leerer Strings nicht vergessen
// ❌ Könnte undefined zurückgeben
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // Bei leerem String ist maxChar ''
}

// 3. Keine übermäßig komplexe funktionale Schreibweise verwenden (es sei denn, es ist Teamkonvention)
// ❌ Geringere Lesbarkeit
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> Zusammenfassung für Interviews

### Schnellreferenz

**Implementierungspunkte**:

1. Objekt oder Map verwenden, um die Häufigkeit jedes Zeichens zu erfassen
2. Während des Durchlaufs gleichzeitig den Maximalwert aktualisieren
3. Zeitkomplexität O(n), Platzkomplexität O(k)
4. Grenzfälle behandeln (leerer String, Groß-/Kleinschreibung usw.)

**Optimierungsrichtungen**:

- In einem Durchlauf abschließen (gleichzeitiges Zählen und Maximum finden)
- Map für komplexe Szenarien verwenden
- Mehrere gleiche Maximalwerte behandeln
- Groß-/Kleinschreibung, Leerzeichen und andere Sonderfälle berücksichtigen

### Beispiel für Interviewantworten

**Q: Implementieren Sie eine Funktion, die das am häufigsten vorkommende Zeichen in einem String findet.**

> "Ich würde ein Objekt verwenden, um die Häufigkeit jedes Zeichens zu erfassen, und während des Durchlaufens des Strings gleichzeitig den Maximalwert aktualisieren. Die konkrete Implementierung ist: Ein leeres Objekt charCount zur Speicherung von Zeichen und Zählung initialisieren, Variablen maxCount und maxChar initialisieren. Dann den String durchlaufen, für jedes Zeichen, wenn es nicht im Objekt ist, auf 0 initialisieren, dann die Zählung erhöhen. Wenn die Zählung des aktuellen Zeichens größer als maxCount ist, maxCount und maxChar aktualisieren. Zum Schluss maxChar zurückgeben. Die Zeitkomplexität dieser Methode ist O(n), die Platzkomplexität ist O(k), wobei n die Länge des Strings und k die Anzahl verschiedener Zeichen ist."

## Reference

- [MDN - String](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
