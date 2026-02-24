---
id: find-most-frequent-char-js
title: '[Easy] Trova il carattere più frequente'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Descrizione della domanda

> Descrizione della domanda

Implementa una funzione che riceva una stringa e restituisca il carattere che compare più frequentemente.

### Esempi

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Metodi di implementazione

> Metodi di implementazione

### Metodo 1: conteggio con oggetto (base)

**Approccio**: itera la stringa, usa un oggetto per registrare il conteggio di ogni carattere, poi trova il carattere con il conteggio più alto.

```javascript
function findMostFrequentChar(str) {
  // Initialize object to store characters and counts
  const charCount = {};

  // Initialize variables for tracking max count and character
  let maxCount = 0;
  let maxChar = '';

  // Iterate through the string
  for (let char of str) {
    // If the character is not in the object, set count to 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Increment this character's count
    charCount[char]++;

    // If this character's count is greater than the max count,
    // update the max count and max character
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Return the most frequent character
  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Complessità temporale**: O(n), dove n è la lunghezza della stringa
**Complessità spaziale**: O(k), dove k è il numero di caratteri distinti

### Metodo 2: prima conta, poi trova il massimo (due fasi)

**Approccio**: prima itera una volta per contare tutti i caratteri, poi itera di nuovo per trovare il massimo.

```javascript
function findMostFrequentChar(str) {
  // Phase 1: Count occurrences of each character
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Phase 2: Find the character with the most occurrences
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

**Pro**: logica più chiara, elaborazione per fasi
**Contro**: richiede due iterazioni

### Metodo 3: uso di Map (ES6)

**Approccio**: usa una Map per memorizzare l'associazione tra caratteri e conteggi.

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

**Pro**: usare Map è più idiomatico nel JavaScript moderno
**Contro**: per casi semplici, un oggetto plain può essere più intuitivo

### Metodo 4: uso di reduce (stile funzionale)

**Approccio**: usa `reduce` e `Object.entries` per l'implementazione.

```javascript
function findMostFrequentChar(str) {
  // Count occurrences of each character
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Find the character with the most occurrences
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Pro**: stile funzionale, codice conciso
**Contro**: meno leggibile, performance leggermente inferiori

### Metodo 5: gestione di più caratteri con lo stesso conteggio massimo

**Approccio**: se più caratteri hanno lo stesso conteggio massimo, restituisci un array oppure il primo incontrato.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Count occurrences of each character
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Find all characters with the max count
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Return the first encountered (or return the entire array)
  return mostFrequentChars[0];
  // Or return all: return mostFrequentChars;
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a' (first encountered)
```

## 3. Casi limite

> Gestione dei casi limite

### Gestione delle stringhe vuote

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // Or throw new Error('String cannot be empty')
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

### Gestione della distinzione maiuscole/minuscole

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
console.log(findMostFrequentChar('Hello', false)); // 'l' (case-insensitive)
console.log(findMostFrequentChar('Hello', true)); // 'l' (case-sensitive)
```

### Gestione di spazi e caratteri speciali

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
console.log(findMostFrequentChar('hello world', true)); // 'l' (ignoring spaces)
console.log(findMostFrequentChar('hello world', false)); // ' ' (space)
```

## 4. Domande comuni da colloquio

> Domande comuni da colloquio

### Domanda 1: implementazione base

Implementa una funzione che trovi il carattere più frequente in una stringa.

<details>
<summary>Clicca per mostrare la risposta</summary>

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

**Punti chiave**:

- Usa un oggetto o una Map per registrare il conteggio di ogni carattere
- Aggiorna il massimo durante l'iterazione
- Complessità temporale O(n), complessità spaziale O(k)

</details>

### Domanda 2: versione ottimizzata

Ottimizza la funzione precedente per gestire più caratteri con lo stesso conteggio massimo.

<details>
<summary>Clicca per mostrare la risposta</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Phase 1: Count occurrences of each character
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Phase 2: Find all characters with the max count
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Return first or all based on requirements
  return mostFrequentChars[0]; // Or return mostFrequentChars
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### Domanda 3: uso di Map

Implementa questa funzione usando ES6 Map.

<details>
<summary>Clicca per mostrare la risposta</summary>

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

- **Map**: più adatta a coppie chiave-valore dinamiche; le chiavi possono essere di qualsiasi tipo
- **Object**: più semplice e intuitivo; adatto a chiavi stringa

</details>

## 5. Best practice

> Best practice

### Approcci consigliati

```javascript
// 1. Use clear variable names
function findMostFrequentChar(str) {
  const charCount = {}; // Clearly expresses purpose
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Handle edge cases
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Update max during iteration (single pass)
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

### Approcci da evitare

```javascript
// 1. Don't use two iterations (unless necessary)
// ❌ Lower performance
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Second iteration
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. Don't forget to handle empty strings
// ❌ May return undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // maxChar is '' for empty string
}

// 3. Don't use overly complex functional patterns (unless team convention)
// ❌ Less readable
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Riepilogo da colloquio

> Riepilogo da colloquio

### Riferimento rapido

**Passi di implementazione**:

1. Usa un oggetto o una Map per registrare il conteggio di ogni carattere
2. Aggiorna il massimo durante l'iterazione
3. Complessità temporale O(n), complessità spaziale O(k)
4. Gestisci i casi limite (stringa vuota, case sensitivity, ecc.)

**Direzioni di ottimizzazione**:

- Completa in un solo passaggio (conta e trova il massimo contemporaneamente)
- Usa Map per scenari complessi
- Gestisci più caratteri con lo stesso conteggio massimo
- Considera case sensitivity, spazi e altri casi speciali

### Esempio di risposta da colloquio

**Q: Implementa una funzione che trovi il carattere più frequente in una stringa.**

> "Userei un oggetto per registrare il conteggio di ogni carattere, poi aggiornerei il massimo durante l'iterazione della stringa. In pratica: inizializzo un oggetto vuoto `charCount` per memorizzare caratteri e conteggi, e inizializzo le variabili `maxCount` e `maxChar`. Poi itero la stringa: per ogni carattere, se non è presente lo inizializzo a 0, quindi incremento il conteggio. Se il conteggio del carattere corrente supera maxCount, aggiorno maxCount e maxChar. Infine, restituisco maxChar. Questo approccio ha complessità temporale O(n) e spaziale O(k), dove n è la lunghezza della stringa e k è il numero di caratteri distinti."

## Riferimenti

- [MDN - String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
