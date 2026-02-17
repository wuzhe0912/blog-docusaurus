---
id: object-path-parsing
title: '[Medium] Object Path Parsing'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> Problembeschreibung

Implementieren Sie Funktionen zur Objektpfadanalyse, die Werte verschachtelter Objekte anhand von Pfadstrings abrufen und setzen können.

### Anforderungen

1. **`get`-Funktion**: Wert anhand eines Pfads abrufen

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **`set`-Funktion**: Wert anhand eines Pfads setzen

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> Implementierung der get-Funktion

### Methode 1: Verwendung von split und reduce

**Ansatz**: Den Pfadstring in ein Array aufteilen und dann mit `reduce` das Objekt Ebene für Ebene durchlaufen.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined (Array-Index-Behandlung erforderlich)
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### Methode 2: Unterstützung von Array-Indizes

**Ansatz**: Array-Indizes im Pfad behandeln, z.B. `'a.b[0].c'`.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
};

console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### Methode 3: Vollständige Implementierung (Behandlung von Grenzfällen)

```javascript
function get(obj, path, defaultValue) {
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (result == null) {
      return defaultValue;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Test
const obj = {
  a: { b: { c: 1, d: [2, 3, { e: 4 }] } },
  x: null,
  y: undefined,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(obj, 'y.z', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj (leerer Pfad gibt Originalobjekt zurück)
```

## 3. Implementation: set Function

> Implementierung der set-Funktion

### Methode 1: Grundlegende Implementierung

**Ansatz**: Anhand des Pfads eine verschachtelte Objektstruktur erstellen und dann den Wert setzen.

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      const temp = { ...current };
      current = [];
      Object.keys(temp).forEach((k) => { current[k] = temp[k]; });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### Methode 2: Vollständige Implementierung (Behandlung von Arrays und Objekten)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  if (keys.length === 0) return obj;

  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current)) {
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => { current[k] = temp[k]; });
      }
      if (current[index] == null) {
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }
      current = current[index];
    } else {
      if (current[key] == null) {
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }
      current = current[key];
    }
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => { current[k] = temp[k]; });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }
set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### Methode 3: Vereinfachte Version (nur Objekte, keine Array-Indizes)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') return obj;

  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  return obj;
}

// Test
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }
set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Common Interview Questions

> Häufige Interviewfragen

### Aufgabe 1: Grundlegende get-Funktion

Implementieren Sie eine `get`-Funktion, die den Wert eines verschachtelten Objekts anhand eines Pfadstrings abruft.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') return defaultValue;
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }
  return result !== undefined ? result : defaultValue;
}

const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**Kernpunkte**: null/undefined behandeln, Pfad mit split aufteilen, Ebene für Ebene auf Eigenschaften zugreifen, Standardwert zurückgeben wenn Pfad nicht existiert.

</details>

### Aufgabe 2: get-Funktion mit Array-Index-Unterstützung

Erweitern Sie die `get`-Funktion um Unterstützung für Array-Indizes wie `'a.b[0].c'`.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') return defaultValue;
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }
  return result !== undefined ? result : defaultValue;
}

const obj = { a: { b: [2, 3, { c: 4 }] } };
console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**Kernpunkte**: Regulären Ausdruck `/[^.[\]]+|\[(\d+)\]/g` zur Pfadanalyse verwenden, `[0]`-Format für Array-Indizes behandeln, String-Index in Zahl umwandeln.

</details>

### Aufgabe 3: set-Funktion

Implementieren Sie eine `set`-Funktion, die den Wert eines verschachtelten Objekts anhand eines Pfadstrings setzt.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') return obj;
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') current[key] = {};
    current = current[key];
  }
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  return obj;
}

const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }
set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**Kernpunkte**: Verschachtelte Objektstruktur Ebene für Ebene erstellen, sicherstellen dass Zwischenobjekte existieren, Zielwert am Ende setzen.

</details>

### Aufgabe 4: Vollständige Implementierung von get und set

Implementieren Sie vollständige `get`- und `set`-Funktionen mit Array-Index-Unterstützung und Behandlung verschiedener Grenzfälle.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') return obj ?? defaultValue;
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    if (key.startsWith('[') && key.endsWith(']')) {
      result = result[parseInt(key.slice(1, -1), 10)];
    } else {
      result = result[key];
    }
  }
  return result !== undefined ? result : defaultValue;
}

function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') return obj;
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  if (keys.length === 0) return obj;
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current)) {
        const temp = current; current = [];
        Object.keys(temp).forEach((k) => { current[k] = temp[k]; });
      }
      if (current[index] == null) current[index] = nextKey.startsWith('[') ? [] : {};
      current = current[index];
    } else {
      if (current[key] == null) current[key] = nextKey.startsWith('[') ? [] : {};
      else if (typeof current[key] !== 'object') current[key] = nextKey.startsWith('[') ? [] : {};
      current = current[key];
    }
  }
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      const temp = current; current = [];
      Object.keys(temp).forEach((k) => { current[k] = temp[k]; });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }
  return obj;
}

const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1
set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Best Practices

> Bewährte Methoden

### Empfohlene Vorgehensweisen

```javascript
// 1. Grenzfälle behandeln
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') return defaultValue;
  // ...
}

// 2. Reguläre Ausdrücke für komplexe Pfade verwenden
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. In set den Typ des nächsten Schlüssels bestimmen
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. Nullish Coalescing für Standardwerte verwenden
return result ?? defaultValue;
```

### Zu vermeidende Vorgehensweisen

```javascript
// 1. ❌ null/undefined-Behandlung nicht vergessen
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // Kann Fehler verursachen
}

// 2. ❌ Originalobjekt nicht direkt ändern (es sei denn, ausdrücklich gefordert)

// 3. ❌ Unterschied zwischen Arrays und Objekten nicht ignorieren
```

## 6. Interview Summary

> Zusammenfassung für Interviews

### Schnellreferenz

**Objektpfadanalyse**:

- **get-Funktion**: Wert anhand des Pfads abrufen, null/undefined behandeln, Standardwert unterstützen
- **set-Funktion**: Wert anhand des Pfads setzen, verschachtelte Struktur automatisch erstellen
- **Pfadanalyse**: Reguläre Ausdrücke für `'a.b.c'`- und `'a.b[0].c'`-Formate verwenden
- **Grenzfallbehandlung**: null, undefined, leere Strings usw. behandeln

**Implementierungspunkte**:

1. Pfadanalyse: `split('.')` oder regulärer Ausdruck
2. Ebenenzugriff: Schleife oder `reduce` verwenden
3. Grenzfallbehandlung: null/undefined prüfen
4. Array-Unterstützung: `[0]`-Format-Indizes behandeln

### Beispiel für Interviewantworten

**Q: Implementieren Sie eine Funktion, die den Wert eines Objekts anhand eines Pfads abruft.**

> "Ich implementiere eine `get`-Funktion, die ein Objekt, einen Pfadstring und einen Standardwert entgegennimmt. Zuerst behandle ich Grenzfälle -- wenn das Objekt null oder der Pfad kein String ist, gebe ich den Standardwert zurück. Dann teile ich den Pfad mit `split('.')` in ein Array von Schlüsseln auf und greife mit einer Schleife Ebene für Ebene auf die Objekteigenschaften zu. Bei jedem Zugriff prüfe ich, ob der aktuelle Wert null oder undefined ist, und gebe in diesem Fall den Standardwert zurück. Am Ende gebe ich den Standardwert zurück, wenn das Ergebnis undefined ist, andernfalls das Ergebnis. Für Array-Index-Unterstützung kann ich den regulären Ausdruck `/[^.[\]]+|\[(\d+)\]/g` zur Pfadanalyse verwenden."

**Q: Wie implementiert man eine Funktion, die den Wert eines Objekts anhand eines Pfads setzt?**

> "Ich implementiere eine `set`-Funktion, die ein Objekt, einen Pfadstring und einen Wert entgegennimmt. Zuerst analysiere ich den Pfad in ein Array von Schlüsseln, dann durchlaufe ich bis zum vorletzten Schlüssel und erstelle Ebene für Ebene die verschachtelte Objektstruktur. Für jeden Zwischenschlüssel, der nicht existiert oder kein Objekt ist, erstelle ich ein neues Objekt. Wenn der nächste Schlüssel ein Array-Index-Format hat, erstelle ich ein Array. Am Ende setze ich den Wert des letzten Schlüssels."

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
