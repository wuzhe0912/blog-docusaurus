---
id: deep-clone
title: '[Medium] Deep Clone'
slug: /deep-clone
tags: [JavaScript, Coding, Medium]
---

## 1. What is Deep Clone?

> Was ist Deep Clone?

**Deep Clone (Tiefe Kopie)** bedeutet, ein neues Objekt zu erstellen und rekursiv alle Eigenschaften des Originalobjekts sowie aller verschachtelten Objekte und Arrays zu kopieren. Das nach dem Deep Clone erstellte Objekt ist vollständig unabhängig vom Original -- eine Änderung an einem beeinflusst das andere nicht.

### Shallow Copy vs Deep Copy

**Shallow Clone (Flache Kopie)**: Kopiert nur die Eigenschaften der ersten Ebene des Objekts; verschachtelte Objekte teilen sich weiterhin dieselbe Referenz.

```javascript
// Beispiel für flache Kopie
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const shallowCopy = { ...original };
shallowCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Kaohsiung' ❌ Das Originalobjekt wurde ebenfalls geändert
```

**Deep Clone (Tiefe Kopie)**: Kopiert rekursiv alle Ebenen der Eigenschaften und macht sie vollständig unabhängig.

```javascript
// Beispiel für tiefe Kopie
const original = {
  name: 'John',
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
};

const deepCopy = deepClone(original);
deepCopy.address.city = 'Kaohsiung';

console.log(original.address.city); // 'Taipei' ✅ Das Originalobjekt ist nicht betroffen
```

## 2. Implementation Methods

> Implementierungsmethoden

### Methode 1: Verwendung von JSON.parse und JSON.stringify

**Vorteile**: Einfach und schnell
**Nachteile**: Kann Funktionen, undefined, Symbol, Date, RegExp, Map, Set und andere Spezialtypen nicht verarbeiten

```javascript
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Test
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

**Einschränkungen**:

```javascript
const obj = {
  date: new Date(),
  func: function () {},
  undefined: undefined,
  symbol: Symbol('test'),
  regex: /test/g,
};

const cloned = deepClone(obj);
console.log(cloned.date); // {} ❌ Date wird zu leerem Objekt
console.log(cloned.func); // undefined ❌ Funktion geht verloren
console.log(cloned.undefined); // undefined ✅ Aber JSON.stringify entfernt es
console.log(cloned.symbol); // undefined ❌ Symbol geht verloren
console.log(cloned.regex); // {} ❌ RegExp wird zu leerem Objekt
```

### Methode 2: Rekursive Implementierung (Verarbeitung von Basistypen und Objekten)

```javascript
function deepClone(obj) {
  // Verarbeitung von null und Basistypen
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Verarbeitung von Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Verarbeitung von RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Verarbeitung von Arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Verarbeitung von Objekten
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Test
const original = {
  name: 'John',
  date: new Date(),
  regex: /test/g,
  hobbies: ['reading', 'coding'],
  address: {
    city: 'Taipei',
  },
};

const cloned = deepClone(original);
cloned.date.setFullYear(2025);
cloned.hobbies.push('swimming');

console.log(original.date.getFullYear()); // 2024 ✅ Nicht betroffen
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

### Methode 3: Vollständige Implementierung (Verarbeitung von Map, Set, Symbol usw.)

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Verarbeitung von null und Basistypen
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Verarbeitung von Zirkularreferenzen
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Verarbeitung von Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Verarbeitung von RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Verarbeitung von Map
  if (obj instanceof Map) {
    const clonedMap = new Map();
    map.set(obj, clonedMap);
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key, map), deepClone(value, map));
    });
    return clonedMap;
  }

  // Verarbeitung von Set
  if (obj instanceof Set) {
    const clonedSet = new Set();
    map.set(obj, clonedSet);
    obj.forEach((value) => {
      clonedSet.add(deepClone(value, map));
    });
    return clonedSet;
  }

  // Verarbeitung von Arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Verarbeitung von Objekten
  const cloned = {};
  map.set(obj, cloned);

  // Verarbeitung von Symbol-Eigenschaften
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  const stringKeys = Object.keys(obj);

  // Kopieren normaler Eigenschaften
  stringKeys.forEach((key) => {
    cloned[key] = deepClone(obj[key], map);
  });

  // Kopieren von Symbol-Eigenschaften
  symbolKeys.forEach((symbolKey) => {
    cloned[symbolKey] = deepClone(obj[symbolKey], map);
  });

  return cloned;
}

// Test
const symbolKey = Symbol('test');
const original = {
  name: 'John',
  [symbolKey]: 'symbol value',
  date: new Date(),
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3]),
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
console.log(cloned[symbolKey]); // 'symbol value' ✅
console.log(cloned.map.get('key')); // 'value' ✅
console.log(cloned.set.has(1)); // true ✅
```

### Methode 4: Verarbeitung von Zirkularreferenzen

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Verarbeitung von null und Basistypen
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Verarbeitung von Zirkularreferenzen
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Verarbeitung von Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Verarbeitung von RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Verarbeitung von Arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Verarbeitung von Objekten
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test von Zirkularreferenzen
const original = {
  name: 'John',
};
original.self = original; // Zirkularreferenz

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅ Zirkularreferenz korrekt verarbeitet
console.log(cloned !== original); // true ✅ Verschiedene Objekte
```

## 3. Common Interview Questions

> Häufige Interviewfragen

### Aufgabe 1: Grundlegende Deep-Clone-Implementierung

Implementieren Sie eine `deepClone`-Funktion, die Objekte und Arrays tief kopieren kann.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

```javascript
function deepClone(obj) {
  // Verarbeitung von null und Basistypen
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Verarbeitung von Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Verarbeitung von RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Verarbeitung von Arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Verarbeitung von Objekten
  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Test
const original = {
  name: 'John',
  age: 30,
  address: {
    city: 'Taipei',
    country: 'Taiwan',
  },
  hobbies: ['reading', 'coding'],
};

const cloned = deepClone(original);
cloned.address.city = 'Kaohsiung';
cloned.hobbies.push('swimming');

console.log(original.address.city); // 'Taipei' ✅
console.log(original.hobbies); // ['reading', 'coding'] ✅
```

</details>

### Aufgabe 2: Verarbeitung von Zirkularreferenzen

Implementieren Sie eine `deepClone`-Funktion, die Zirkularreferenzen verarbeiten kann.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

```javascript
function deepClone(obj, map = new WeakMap()) {
  // Verarbeitung von null und Basistypen
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Verarbeitung von Zirkularreferenzen
  if (map.has(obj)) {
    return map.get(obj);
  }

  // Verarbeitung von Date
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  // Verarbeitung von RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  // Verarbeitung von Arrays
  if (Array.isArray(obj)) {
    const clonedArray = [];
    map.set(obj, clonedArray);
    obj.forEach((item) => {
      clonedArray.push(deepClone(item, map));
    });
    return clonedArray;
  }

  // Verarbeitung von Objekten
  const cloned = {};
  map.set(obj, cloned);

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key], map);
    }
  }

  return cloned;
}

// Test von Zirkularreferenzen
const original = {
  name: 'John',
};
original.self = original; // Zirkularreferenz

const cloned = deepClone(original);
console.log(cloned.self === cloned); // true ✅
console.log(cloned !== original); // true ✅
```

**Kernpunkte**:

- Verwendung einer `WeakMap`, um bereits verarbeitete Objekte zu verfolgen
- Vor dem Erstellen eines neuen Objekts prüfen, ob es bereits in der Map existiert
- Falls vorhanden, die Referenz aus der Map direkt zurückgeben, um unendliche Rekursion zu vermeiden

</details>

### Aufgabe 3: Einschränkungen von JSON.parse und JSON.stringify

Erklären Sie die Einschränkungen bei der Verwendung von `JSON.parse(JSON.stringify())` für Deep Clone und bieten Sie Lösungen an.

<details>
<summary>Klicken Sie hier, um die Antwort anzuzeigen</summary>

**Einschränkungen**:

1. **Kann Funktionen nicht verarbeiten**
   ```javascript
   const obj = { func: function () {} };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.func); // undefined ❌
   ```

2. **Kann undefined nicht verarbeiten**
   ```javascript
   const obj = { value: undefined };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.value); // undefined (aber die Eigenschaft wird entfernt) ❌
   ```

3. **Kann Symbol nicht verarbeiten**
   ```javascript
   const obj = { [Symbol('key')]: 'value' };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned); // {} ❌ Symbol-Eigenschaft geht verloren
   ```

4. **Date wird zu String**
   ```javascript
   const obj = { date: new Date() };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.date); // "2024-01-01T00:00:00.000Z" ❌ Wird zu String
   ```

5. **RegExp wird zu leerem Objekt**
   ```javascript
   const obj = { regex: /test/g };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.regex); // {} ❌ Wird zu leerem Objekt
   ```

6. **Kann Map, Set nicht verarbeiten**
   ```javascript
   const obj = { map: new Map([['key', 'value']]) };
   const cloned = JSON.parse(JSON.stringify(obj));
   console.log(cloned.map); // {} ❌ Wird zu leerem Objekt
   ```

7. **Kann Zirkularreferenzen nicht verarbeiten**
   ```javascript
   const obj = { name: 'John' };
   obj.self = obj;
   JSON.parse(JSON.stringify(obj)); // ❌ Fehler: Converting circular structure to JSON
   ```

**Lösung**: Verwenden Sie eine rekursive Implementierung mit spezieller Behandlung für verschiedene Typen.

</details>

## 4. Best Practices

> Bewährte Methoden

### Empfohlene Vorgehensweisen

```javascript
// 1. Wählen Sie die geeignete Methode basierend auf den Anforderungen
// Wenn nur einfache Objekte und Arrays verarbeitet werden müssen, verwenden Sie eine einfache rekursive Implementierung
function simpleDeepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((item) => simpleDeepClone(item));

  const cloned = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = simpleDeepClone(obj[key]);
    }
  }
  return cloned;
}

// 2. Wenn komplexe Typen verarbeitet werden müssen, verwenden Sie die vollständige Implementierung
function completeDeepClone(obj, map = new WeakMap()) {
  // ... Vollständige Implementierung
}

// 3. Verwenden Sie WeakMap zur Verarbeitung von Zirkularreferenzen
// WeakMap verhindert nicht die Garbage Collection und eignet sich zur Verfolgung von Objektreferenzen
```

### Zu vermeidende Vorgehensweisen

```javascript
// 1. Verwenden Sie JSON.parse(JSON.stringify()) nicht übermäßig
// ❌ Funktionen, Symbol, Date und andere Spezialtypen gehen verloren
const cloned = JSON.parse(JSON.stringify(obj));

// 2. Vergessen Sie nicht, Zirkularreferenzen zu behandeln
// ❌ Führt zu Stack Overflow
function deepClone(obj) {
  const cloned = {};
  for (let key in obj) {
    cloned[key] = deepClone(obj[key]); // Unendliche Rekursion
  }
  return cloned;
}

// 3. Vergessen Sie nicht, Date, RegExp und andere Spezialtypen zu behandeln
// ❌ Diese Typen erfordern eine spezielle Behandlung
```

## 5. Interview Summary

> Zusammenfassung für Interviews

### Schnellreferenz

**Deep Clone**:

- **Definition**: Rekursives Kopieren eines Objekts und aller verschachtelten Eigenschaften, vollständig unabhängig
- **Methoden**: Rekursive Implementierung, JSON.parse(JSON.stringify()), structuredClone()
- **Kernpunkte**: Verarbeitung spezieller Typen, Zirkularreferenzen, Symbol-Eigenschaften

**Implementierungspunkte**:

1. Verarbeitung von Basistypen und null
2. Verarbeitung von Date, RegExp und anderen speziellen Objekten
3. Verarbeitung von Arrays und Objekten
4. Verarbeitung von Zirkularreferenzen (mit WeakMap)
5. Verarbeitung von Symbol-Eigenschaften

### Beispiel für Interviewantworten

**Q: Bitte implementieren Sie eine Deep Clone Funktion.**

> "Deep Clone bedeutet, ein vollständig unabhängiges neues Objekt zu erstellen und alle verschachtelten Eigenschaften rekursiv zu kopieren. Meine Implementierung verarbeitet zuerst Basistypen und null, dann führt sie eine spezielle Behandlung für verschiedene Typen wie Date, RegExp, Arrays und Objekte durch. Um Zirkularreferenzen zu behandeln, verwende ich eine WeakMap zur Verfolgung bereits verarbeiteter Objekte. Für Symbol-Eigenschaften verwende ich Object.getOwnPropertySymbols zum Abrufen und Kopieren. Dies stellt sicher, dass das tief kopierte Objekt vollständig unabhängig vom Originalobjekt ist und eine Änderung an einem das andere nicht beeinflusst."

**Q: Welche Einschränkungen hat JSON.parse(JSON.stringify())?**

> "Die Haupteinschränkungen dieser Methode sind: 1) Funktionen können nicht verarbeitet werden und gehen verloren; 2) undefined und Symbol können nicht verarbeitet werden, diese Eigenschaften werden ignoriert; 3) Date-Objekte werden zu Strings; 4) RegExp wird zu leerem Objekt; 5) Map, Set und andere spezielle Datenstrukturen können nicht verarbeitet werden; 6) Zirkularreferenzen können nicht verarbeitet werden und verursachen einen Fehler. Wenn diese Sonderfälle behandelt werden müssen, sollte eine rekursive Implementierung verwendet werden."

## Reference

- [MDN - structuredClone()](https://developer.mozilla.org/de/docs/Web/API/structuredClone)
- [MDN - WeakMap](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
- [MDN - Object.getOwnPropertySymbols()](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertySymbols)
