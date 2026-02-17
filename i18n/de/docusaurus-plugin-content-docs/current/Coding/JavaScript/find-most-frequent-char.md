---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> Problembeschreibung

Implementieren Sie eine Funktion, die einen String entgegennimmt und das am haeufigsten vorkommende Zeichen in diesem String zurueckgibt.

### Beispiele

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> Implementierungsmethoden

### Methode 1: Zaehlung mit Objekt (Basisversion)

**Ansatz**: Den String durchlaufen, mit einem Objekt die Haeufigkeit jedes Zeichens erfassen und dann das haeufigste Zeichen finden.

```javascript
function findMostFrequentChar(str) {
  // Objekt zur Speicherung von Zeichen und Zaehlung initialisieren
  const charCount = {};

  // Variablen fuer maximale Zaehlung und Zeichen initialisieren
  let maxCount = 0;
  let maxChar = '';

  // String durchlaufen
  for (let char of str) {
    // Wenn das Zeichen nicht im Objekt ist, Zaehlung auf 0 setzen
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Zaehlung dieses Zeichens erhoehen
    charCount[char]++;

    // Wenn die Zaehlung dieses Zeichens groesser als die maximale Zaehlung ist
    // Maximale Zaehlung und maximales Zeichen aktualisieren
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Maximales Zeichen zurueckgeben
  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Zeitkomplexitaet**: O(n), wobei n die Laenge des Strings ist
**Platzkomplexitaet**: O(k), wobei k die Anzahl verschiedener Zeichen ist

### Methode 2: Erst zaehlen, dann Maximum finden (Zwei Phasen)

**Ansatz**: Erst einmal durchlaufen, um die Haeufigkeit aller Zeichen zu berechnen, dann ein zweites Mal, um den Maximalwert zu finden.

```javascript
function findMostFrequentChar(str) {
  // Phase 1: Haeufigkeit jedes Zeichens berechnen
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Phase 2: Das haeufigste Zeichen finden
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
**Nachteile**: Zwei Durchlaeufe erforderlich

### Methode 3: Verwendung von Map (ES6)

**Ansatz**: Map verwenden, um die Zuordnung von Zeichen und Zaehlung zu speichern.

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
**Nachteile**: Fuer einfache Szenarien kann ein Objekt intuitiver sein

### Methode 4: Verwendung von reduce (funktionaler Stil)

**Ansatz**: `reduce` und `Object.entries` zur Implementierung verwenden.

```javascript
function findMostFrequentChar(str) {
  // Haeufigkeit jedes Zeichens berechnen
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Das haeufigste Zeichen finden
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

**Ansatz**: Wenn mehrere Zeichen die gleiche hoechste Haeufigkeit haben, ein Array oder das erste gefundene zurueckgeben.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Haeufigkeit jedes Zeichens berechnen
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Alle Zeichen mit maximaler Haeufigkeit finden
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Das erste gefundene zurueckgeben (oder das gesamte Array)
  return mostFrequentChars[0];
  // Oder alle zurueckgeben: return mostFrequentChars;
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a' (das erste gefundene)
```

## 3. Edge Cases

> Behandlung von Grenzfaellen

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

### Gross-/Kleinschreibung

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
console.log(findMostFrequentChar('Hello', false)); // 'l' (Gross-/Kleinschreibung ignoriert)
console.log(findMostFrequentChar('Hello', true)); // 'l' (Gross-/Kleinschreibung beachtet)
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

> Haeufige Interviewfragen

### Aufgabe 1: Grundlegende Implementierung

Implementieren Sie eine Funktion, die das am haeufigsten vorkommende Zeichen in einem String findet.

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

- Objekt oder Map verwenden, um die Haeufigkeit jedes Zeichens zu erfassen
- Waehrend des Durchlaufs gleichzeitig den Maximalwert aktualisieren
- Zeitkomplexitaet O(n), Platzkomplexitaet O(k)

</details>

### Aufgabe 2: Optimierte Version

Optimieren Sie die obige Funktion, um mehrere gleiche Maximalwerte behandeln zu koennen.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Phase 1: Haeufigkeit jedes Zeichens berechnen
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Phase 2: Alle Zeichen mit maximaler Haeufigkeit finden
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Je nach Anforderung das erste oder alle zurueckgeben
  return mostFrequentChars[0]; // Oder mostFrequentChars zurueckgeben
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

- **Map**: Besser geeignet fuer dynamische Schluessel-Wert-Paare, Schluessel koennen jeden Typ haben
- **Object**: Einfacher und intuitiver, geeignet fuer String-Schluessel

</details>

## 5. Best Practices

> Bewaehrte Methoden

### Empfohlene Vorgehensweisen

```javascript
// 1. Klare Variablennamen verwenden
function findMostFrequentChar(str) {
  const charCount = {}; // Zweck klar ausdruecken
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Grenzfaelle behandeln
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Waehrend des Durchlaufs gleichzeitig den Maximalwert aktualisieren (ein Durchlauf)
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
// 1. Keine zwei Durchlaeufe verwenden (es sei denn, es ist notwendig)
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
// ❌ Koennte undefined zurueckgeben
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // Bei leerem String ist maxChar ''
}

// 3. Keine uebermaeig komplexe funktionale Schreibweise verwenden (es sei denn, es ist Teamkonvention)
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

> Zusammenfassung fuer Interviews

### Schnellreferenz

**Implementierungspunkte**:

1. Objekt oder Map verwenden, um die Haeufigkeit jedes Zeichens zu erfassen
2. Waehrend des Durchlaufs gleichzeitig den Maximalwert aktualisieren
3. Zeitkomplexitaet O(n), Platzkomplexitaet O(k)
4. Grenzfaelle behandeln (leerer String, Gross-/Kleinschreibung usw.)

**Optimierungsrichtungen**:

- In einem Durchlauf abschliessen (gleichzeitiges Zaehlen und Maximum finden)
- Map fuer komplexe Szenarien verwenden
- Mehrere gleiche Maximalwerte behandeln
- Gross-/Kleinschreibung, Leerzeichen und andere Sonderfaelle beruecksichtigen

### Beispiel fuer Interviewantworten

**Q: Implementieren Sie eine Funktion, die das am haeufigsten vorkommende Zeichen in einem String findet.**

> "Ich wuerde ein Objekt verwenden, um die Haeufigkeit jedes Zeichens zu erfassen, und waehrend des Durchlaufens des Strings gleichzeitig den Maximalwert aktualisieren. Die konkrete Implementierung ist: Ein leeres Objekt charCount zur Speicherung von Zeichen und Zaehlung initialisieren, Variablen maxCount und maxChar initialisieren. Dann den String durchlaufen, fuer jedes Zeichen, wenn es nicht im Objekt ist, auf 0 initialisieren, dann die Zaehlung erhoehen. Wenn die Zaehlung des aktuellen Zeichens groesser als maxCount ist, maxCount und maxChar aktualisieren. Zum Schluss maxChar zurueckgeben. Die Zeitkomplexitaet dieser Methode ist O(n), die Platzkomplexitaet ist O(k), wobei n die Laenge des Strings und k die Anzahl verschiedener Zeichen ist."

## Reference

- [MDN - String](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
