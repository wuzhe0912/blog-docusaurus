---
id: primitive-vs-reference
title: '[Medium] 📄 Primitive vs Reference Types'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Primitive Types and Reference Types?

> Was sind primitive Typen (Primitive Types) und Referenztypen (Reference Types)?

Die Datentypen in JavaScript werden in zwei große Kategorien unterteilt: **primitive Typen** und **Referenztypen**. Sie unterscheiden sich grundlegend in der Art der Speicherung im Speicher und im Übergabeverhalten.

### Primitive Typen (Primitive Types)

**Merkmale**:

- Werden im **Stack (Stapel)** gespeichert
- Bei der Übergabe wird **der Wert selbst kopiert** (Call by Value)
- Sind unveränderlich (Immutable)

**Umfassen 7 Typen**:

```javascript
// 1. String (Zeichenkette)
const str = 'hello';

// 2. Number (Zahl)
const num = 42;

// 3. Boolean (Wahrheitswert)
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol (ES6)
const sym = Symbol('unique');

// 7. BigInt (ES2020)
const bigInt = 9007199254740991n;
```

### Referenztypen (Reference Types)

**Merkmale**:

- Werden im **Heap (Halde)** gespeichert
- Bei der Übergabe wird **die Referenz (Speicheradresse) kopiert** (Call by Reference)
- Sind veränderlich (Mutable)

**Umfassen**:

```javascript
// 1. Object (Objekt)
const obj = { name: 'John' };

// 2. Array (Array)
const arr = [1, 2, 3];

// 3. Function (Funktion)
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> Wertübergabe (Call by Value) vs Referenzübergabe (Call by Reference)

### Wertübergabe (Call by Value) - Primitive Typen

**Verhalten**: Der Wert selbst wird kopiert; das Ändern der Kopie beeinflusst den Originalwert nicht.

```javascript
// Primitiver Typ: Wertübergabe
let a = 10;
let b = a; // Wert kopieren

b = 20; // b ändern

console.log(a); // 10 (nicht beeinflusst)
console.log(b); // 20
```

**Speicherdiagramm**:

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ ← Unabhängiger Wert
├─────────┤
│ b: 20   │ ← Unabhängiger Wert (nach Kopie geändert)
└─────────┘
```

### Referenzübergabe (Call by Reference) - Referenztypen

**Verhalten**: Die Speicheradresse wird kopiert; zwei Variablen zeigen auf dasselbe Objekt.

```javascript
// Referenztyp: Referenzübergabe
let obj1 = { name: 'John' };
let obj2 = obj1; // Speicheradresse kopieren

obj2.name = 'Jane'; // Über obj2 ändern

console.log(obj1.name); // 'Jane' (beeinflusst!)
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true (zeigen auf dasselbe Objekt)
```

**Speicherdiagramm**:

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (dasselbe Objekt)│
└─────────┘                    └──────────────────┘
```

## 3. Common Quiz Questions

> Häufige Quizfragen

### Frage 1: Übergabe primitiver Typen

```javascript
function changeValue(x) {
  x = 100;
  console.log('x in der Funktion:', x);
}

let num = 50;
changeValue(num);
console.log('num außerhalb der Funktion:', num);
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

```javascript
// x in der Funktion: 100
// num außerhalb der Funktion: 50
```

**Erklärung**:

- `num` ist ein primitiver Typ (Number)
- Bei der Übergabe an die Funktion wird **der Wert kopiert**, `x` und `num` sind unabhängige Variablen
- Das Ändern von `x` beeinflusst `num` nicht

```javascript
// Ausführungsablauf
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50 (Kopie)
x = 100; // Stack: x = 100 (nur x wird geändert)
console.log(num); // Stack: num = 50 (nicht beeinflusst)
```

</details>

### Frage 2: Übergabe von Referenztypen

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('obj.name in der Funktion:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('person.name außerhalb der Funktion:', person.name);
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

```javascript
// obj.name in der Funktion: Changed
// person.name außerhalb der Funktion: Changed
```

**Erklärung**:

- `person` ist ein Referenztyp (Object)
- Bei der Übergabe an die Funktion wird **die Speicheradresse kopiert**
- `obj` und `person` zeigen auf **dasselbe Objekt**
- Wird der Objektinhalt über `obj` geändert, ist auch `person` betroffen

```javascript
// Speicherdiagramm
let person = { name: 'Original' }; // Heap: Objekt erstellen @0x001
changeObject(person); // Stack: obj = @0x001 (Adresse kopieren)
obj.name = 'Changed'; // Heap: @0x001.name = 'Changed'
console.log(person.name); // Heap: @0x001.name (dasselbe Objekt)
```

</details>

### Frage 3: Neuzuweisung vs Eigenschaftsänderung

```javascript
function test1(obj) {
  obj.name = 'Modified'; // Eigenschaft ändern
}

function test2(obj) {
  obj = { name: 'New Object' }; // Neuzuweisung
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

```javascript
// A: Modified
// B: Modified (nicht 'New Object'!)
```

**Erklärung**:

**test1: Eigenschaftsänderung**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // ✅ Ändert die Eigenschaft des Originalobjekts
}
// person und obj zeigen auf dasselbe Objekt, daher wird es geändert
```

**test2: Neuzuweisung**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // ❌ Ändert nur die Referenz von obj
}
// obj zeigt jetzt auf ein neues Objekt, aber person zeigt weiterhin auf das Original
```

**Speicherdiagramm**:

```text
// Vor test1
person ────> { name: 'Original' }
obj    ────> { name: 'Original' } (dasselbe)

// Nach test1
person ────> { name: 'Modified' }
obj    ────> { name: 'Modified' } (dasselbe)

// test2 Ausführung
person ────> { name: 'Modified' }    (unverändert)
obj    ────> { name: 'New Object' }  (neues Objekt)

// Nach test2
person ────> { name: 'Modified' }    (weiterhin unverändert)
// obj wird zerstört, das neue Objekt wird vom Garbage Collector freigegeben
```

</details>

### Frage 4: Übergabe von Arrays

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**Erklärung**:

- `modifyArray`: Ändert den Inhalt des Original-Arrays, `numbers` wird beeinflusst
- `reassignArray`: Ändert nur die Referenz des Parameters, `numbers` bleibt unbeeinflusst

</details>

### Frage 5: Vergleichsoperationen

```javascript
// Vergleich primitiver Typen
let a = 10;
let b = 10;
console.log('A:', a === b);

// Vergleich von Referenztypen
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>Klicke, um die Antwort zu sehen</summary>

```javascript
// A: true
// B: false
// C: true
```

**Erklärung**:

**Primitive Typen**: Vergleichen Werte

```javascript
10 === 10; // true (gleicher Wert)
```

**Referenztypen**: Vergleichen Speicheradressen

```javascript
obj1 === obj2; // false (verschiedene Objekte, verschiedene Adressen)
obj1 === obj3; // true (zeigen auf dasselbe Objekt)
```

**Speicherdiagramm**:

```text
obj1 ────> @0x001: { value: 10 }
obj2 ────> @0x002: { value: 10 } (gleicher Inhalt, aber verschiedene Adressen)
obj3 ────> @0x001: { value: 10 } (gleiche Adresse wie obj1)
```

</details>

## 4. Shallow Copy vs Deep Copy

> Flache Kopie vs Tiefe Kopie

### Flache Kopie (Shallow Copy)

**Definition**: Kopiert nur die erste Ebene; verschachtelte Objekte bleiben Referenzen.

#### Methode 1: Spread-Operator (Spread Operator)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

// Erste Ebene ändern: beeinflusst das Originalobjekt nicht
copy.name = 'Jane';
console.log(original.name); // 'John' (nicht beeinflusst)

// Verschachteltes Objekt ändern: beeinflusst das Originalobjekt!
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung' (beeinflusst!)
```

#### Methode 2: Object.assign()

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John' (nicht beeinflusst)
```

#### Methode 3: Flache Kopie von Arrays

```javascript
const arr1 = [1, 2, 3];

// Methode 1: Spread-Operator
const arr2 = [...arr1];

// Methode 2: slice()
const arr3 = arr1.slice();

// Methode 3: Array.from()
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1 (nicht beeinflusst)
```

### Tiefe Kopie (Deep Copy)

**Definition**: Kopiert alle Ebenen vollständig, einschließlich verschachtelter Objekte.

#### Methode 1: JSON.parse + JSON.stringify (am häufigsten)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

// Verschachteltes Objekt ändern: beeinflusst das Originalobjekt nicht
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (nicht beeinflusst)

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming'] (nicht beeinflusst)
```

**Einschränkungen**:

```javascript
const obj = {
  date: new Date(), // ❌ Wird zu String
  func: () => {}, // ❌ Wird ignoriert
  undef: undefined, // ❌ Wird ignoriert
  symbol: Symbol('test'), // ❌ Wird ignoriert
  regexp: /abc/, // ❌ Wird zu {}
  circular: null, // ❌ Zirkuläre Referenzen verursachen Fehler
};
obj.circular = obj; // Zirkuläre Referenz

JSON.parse(JSON.stringify(obj)); // Fehler oder Datenverlust
```

#### Methode 2: structuredClone() (moderne Browser)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

// Kann spezielle Objekte wie Date korrekt kopieren
console.log(copy.date instanceof Date); // true
```

**Vorteile**:

- ✅ Unterstützt Date, RegExp, Map, Set usw.
- ✅ Unterstützt zirkuläre Referenzen
- ✅ Bessere Performance

**Einschränkungen**:

- ❌ Unterstützt keine Funktionen
- ❌ Unterstützt kein Symbol

#### Methode 3: Rekursive Implementierung der tiefen Kopie

```javascript
function deepClone(obj) {
  // null und Nicht-Objekte behandeln
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Arrays behandeln
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Date behandeln
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // RegExp behandeln
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Objekte behandeln
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Verwendungsbeispiel
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (nicht beeinflusst)
```

#### Methode 4: Lodash verwenden

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### Vergleich: Flache Kopie vs Tiefe Kopie

| Merkmal          | Flache Kopie       | Tiefe Kopie             |
| ---------------- | ------------------- | ----------------------- |
| Kopierte Ebenen  | Nur erste Ebene     | Alle Ebenen             |
| Verschachtelte Objekte | Bleiben Referenzen | Vollständig unabhängig |
| Performance      | Schnell             | Langsam                 |
| Speicher         | Wenig               | Viel                    |
| Anwendungsfall   | Einfache Objekte    | Komplexe verschachtelte Strukturen |

## 5. Common Pitfalls

> Häufige Fallen

### Falle 1: Glauben, dass Parameterübergabe primitive Typen ändern kann

```javascript
// ❌ Falsches Verständnis
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5 (wird nicht zu 6!)

// ✅ Richtige Schreibweise
count = increment(count); // Rückgabewert muss empfangen werden
console.log(count); // 6
```

### Falle 2: Glauben, dass Neuzuweisung das externe Objekt ändern kann

```javascript
// ❌ Falsches Verständnis
function resetObject(obj) {
  obj = { name: 'Reset' }; // Ändert nur die Referenz des Parameters
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original' (wurde nicht zurückgesetzt!)

// ✅ Richtige Schreibweise 1: Eigenschaften ändern
function resetObject(obj) {
  obj.name = 'Reset';
}

// ✅ Richtige Schreibweise 2: Neues Objekt zurückgeben
function resetObject(obj) {
  return { name: 'Reset' };
}
person = resetObject(person);
```

### Falle 3: Glauben, dass der Spread-Operator eine tiefe Kopie erstellt

```javascript
// ❌ Falsches Verständnis
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // Flache Kopie!

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane' (wurde beeinflusst!)

// ✅ Richtige Schreibweise: Tiefe Kopie
const copy = JSON.parse(JSON.stringify(original));
// oder
const copy = structuredClone(original);
```

### Falle 4: Missverständnis über const

```javascript
// const verhindert nur die Neuzuweisung, nicht die Veränderbarkeit!

const obj = { name: 'John' };

// ❌ Neuzuweisung nicht möglich
obj = { name: 'Jane' }; // TypeError: Assignment to constant variable

// ✅ Eigenschaften können geändert werden
obj.name = 'Jane'; // Funktioniert normal
obj.age = 30; // Funktioniert normal

// Für echte Unveränderlichkeit
const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane'; // Stille Fehlfunktion (im Strict-Modus wird ein Fehler ausgelöst)
console.log(immutableObj.name); // 'John' (wurde nicht geändert)
```

### Falle 5: Referenzproblem in Schleifen

```javascript
// ❌ Häufiger Fehler
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // Alle zeigen auf dasselbe Objekt!
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]
// Alle sind dasselbe Objekt, der Endwert ist immer 2

// ✅ Richtige Schreibweise: Jedes Mal ein neues Objekt erstellen
const arr = [];

for (let i = 0; i < 3; i++) {
  arr.push({ value: i }); // Jedes Mal ein neues Objekt erstellen
}

console.log(arr);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practices

> Bewährte Methoden

### ✅ Empfohlene Vorgehensweisen

```javascript
// 1. Beim Kopieren von Objekten explizit Kopiermethoden verwenden
const original = { name: 'John', age: 30 };

// Flache Kopie (einfache Objekte)
const copy1 = { ...original };

// Tiefe Kopie (verschachtelte Objekte)
const copy2 = structuredClone(original);

// 2. Funktionen sollten nicht auf Seiteneffekte zur Parameteränderung angewiesen sein
// ❌ Schlecht
function addItem(arr, item) {
  arr.push(item); // Ändert das Original-Array
}

// ✅ Gut
function addItem(arr, item) {
  return [...arr, item]; // Gibt ein neues Array zurück
}

// 3. const verwenden, um versehentliche Neuzuweisung zu verhindern
const config = { theme: 'dark' };
// config = {}; // Wird Fehler auslösen

// 4. Object.freeze verwenden, wenn unveränderliche Objekte benötigt werden
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ Zu vermeidende Vorgehensweisen

```javascript
// 1. Nicht auf Parameterübergabe zur Änderung primitiver Typen vertrauen
function increment(num) {
  num++; // ❌ Ohne Wirkung
}

// 2. Flache Kopie und tiefe Kopie nicht verwechseln
const copy = { ...nested }; // ❌ Glauben, es sei eine tiefe Kopie

// 3. Nicht dieselbe Objektreferenz in Schleifen wiederverwenden
for (let i = 0; i < 3; i++) {
  arr.push(obj); // ❌ Alle zeigen auf dasselbe Objekt
}
```

## 7. Interview Summary

> Zusammenfassung für das Vorstellungsgespräch

### Schnelles Merken

**Primitive Typen (Primitive)**:

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- Wertübergabe (Call by Value)
- Im Stack gespeichert
- Unveränderlich (Immutable)

**Referenztypen (Reference)**:

- Object, Array, Function, Date, RegExp, etc.
- Referenzübergabe (Call by Reference)
- Im Heap gespeichert
- Veränderlich (Mutable)

### Beispielantwort im Vorstellungsgespräch

**Q: Ist JavaScript Call by Value oder Call by Reference?**

> JavaScript ist **für alle Typen Call by Value**, aber der "Wert", der bei Referenztypen übergeben wird, ist die Speicheradresse.
>
> - Primitive Typen: Eine Kopie des Wertes wird übergeben, Änderungen beeinflussen den Originalwert nicht
> - Referenztypen: Eine Kopie der Adresse wird übergeben, über die Adresse kann das Originalobjekt geändert werden
> - Wird jedoch neu zugewiesen (Adresse geändert), bleibt das Originalobjekt unbeeinflusst

## Reference

- [MDN - Data Structures](https://developer.mozilla.org/de/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript im Detail](https://javascript.info/object-copy)
