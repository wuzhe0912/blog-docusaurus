---
id: basic-types
title: '[Easy] Grundlegende Typen und Typannotationen'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> Welche grundlegenden Typen gibt es in TypeScript?

TypeScript bietet eine Vielzahl von grundlegenden Typen zur Definition von Variablen, Funktionsparametern und Ruckgabewerten.

### Grundlegende Typen

```typescript
// 1. number: Zahlen (Ganzzahlen, Gleitkommazahlen)
let age: number = 30;
let price: number = 99.99;

// 2. string: Zeichenketten
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean: Wahrheitswerte
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null: Leerer Wert
let data: null = null;

// 5. undefined: Undefiniert
let value: undefined = undefined;

// 6. void: Kein Ruckgabewert (hauptsachlich fur Funktionen)
function logMessage(): void {
  console.log('Hello');
}

// 7. any: Beliebiger Typ (sollte vermieden werden)
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown: Unbekannter Typ (sicherer als any)
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ Fehler: Typprufung erforderlich

// 9. never: Wert, der nie auftritt (fur Funktionen, die nie zuruckkehren)
function throwError(): never {
  throw new Error('Error');
}

// 10. object: Objekt (selten verwendet, Interface empfohlen)
let user: object = { name: 'John' };

// 11. array: Array
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple: Tupel (Array mit fester Lange und festen Typen)
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> Typannotationen vs Typinferenz

### Typannotationen (Type Annotations)

**Definition**: Explizite Angabe des Typs einer Variablen.

```typescript
// Typ explizit angeben
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// Funktionsparameter und Ruckgabewerte
function add(a: number, b: number): number {
  return a + b;
}
```

### Typinferenz (Type Inference)

**Definition**: TypeScript leitet den Typ automatisch aus dem Initialwert ab.

```typescript
// TypeScript leitet automatisch number ab
let age = 30;        // age: number

// TypeScript leitet automatisch string ab
let name = 'John';   // name: string

// TypeScript leitet automatisch boolean ab
let isActive = true;  // isActive: boolean

// Ruckgabewerte von Funktionen werden ebenfalls automatisch abgeleitet
function add(a: number, b: number) {
  return a + b;  // Ruckgabewert wird automatisch als number abgeleitet
}
```

### Wann Typannotationen verwendet werden sollten

**Situationen, in denen der Typ explizit angegeben werden sollte**:

```typescript
// 1. Variablendeklaration ohne Initialwert
let value: number;
value = 10;

// 2. Funktionsparameter (mussen angegeben werden)
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. Ruckgabewerte von Funktionen (explizite Angabe empfohlen)
function calculate(): number {
  return 42;
}

// 4. Komplexe Typen, bei denen die Inferenz ungenau sein konnte
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> Haufige Interviewfragen

### Frage 1: Typinferenz

Erklaren Sie den Typ jeder Variablen im folgenden Code.

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**Erklarung**:
- TypeScript leitet den Typ automatisch aus dem Initialwert ab
- Arrays werden als Array des Elementtyps abgeleitet
- Objekte werden als Strukturtyp des Objekts abgeleitet

</details>

### Frage 2: Typfehler

Finden Sie die Typfehler im folgenden Code.

```typescript
let age: number = 30;
age = 'thirty';

let name: string = 'John';
name = 42;

let isActive: boolean = true;
isActive = 'yes';

let numbers: number[] = [1, 2, 3];
numbers.push('4');
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

```typescript
let age: number = 30;
age = 'thirty'; // ❌ Type 'string' is not assignable to type 'number'

let name: string = 'John';
name = 42; // ❌ Type 'number' is not assignable to type 'string'

let isActive: boolean = true;
isActive = 'yes'; // ❌ Type 'string' is not assignable to type 'boolean'

let numbers: number[] = [1, 2, 3];
numbers.push('4'); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'
```

**Korrekte Schreibweise**:
```typescript
let age: number = 30;
age = 30; // ✅

let name: string = 'John';
name = 'Jane'; // ✅

let isActive: boolean = true;
isActive = false; // ✅

let numbers: number[] = [1, 2, 3];
numbers.push(4); // ✅
```

</details>

### Frage 3: any vs unknown

Erklaren Sie den Unterschied zwischen `any` und `unknown` und welches verwendet werden sollte.

```typescript
// Fall 1: any verwenden
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ?
}

// Fall 2: unknown verwenden
function processUnknown(value: unknown): void {
  console.log(value.toUpperCase()); // ?
}
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

**Fall 1: any verwenden**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ Kompilierung erfolgreich, aber Laufzeitfehler moglich
}

processAny('hello');  // ✅ Normale Ausfuhrung
processAny(42);       // ❌ Laufzeitfehler: value.toUpperCase is not a function
```

**Fall 2: unknown verwenden**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ Kompilierfehler: Object is of type 'unknown'

  // Typprufung erforderlich
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ Sicher
  }
}
```

**Vergleich der Unterschiede**:

| Eigenschaft | any | unknown |
| --- | --- | --- |
| Typprufung | Vollstandig deaktiviert | Prufung vor Verwendung erforderlich |
| Sicherheit | Unsicher | Sicher |
| Empfehlung | Vermeiden | Empfohlen |

**Best Practices**:
```typescript
// ✅ Empfohlen: unknown verwenden und Typprufung durchfuhren
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  }
}

// ❌ Vermeiden: any verwenden
function processValue(value: any): void {
  console.log(value.toUpperCase()); // Unsicher
}
```

</details>

### Frage 4: Array-Typen

Erklaren Sie die Unterschiede der folgenden Array-Typdeklarationen.

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

```typescript
// 1. number[]: Zahlen-Array (empfohlene Schreibweise)
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ Fehler

// 2. Array<number>: Generisches Array (aquivalent zu number[])
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ Fehler

// 3. [number, string]: Tupel (Tuple) - feste Lange und Typen
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ Fehler: Lange uberschreitet 2
arr3.push('test');   // ⚠️ TypeScript erlaubt es, aber nicht empfohlen

// 4. any[]: Array mit beliebigem Typ (nicht empfohlen)
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅ (aber Typprufung geht verloren)
```

**Verwendungsempfehlungen**:
- Allgemeine Arrays: `number[]` oder `Array<number>` verwenden
- Feste Struktur: Tupel `[type1, type2]` verwenden
- Vermeiden Sie `any[]`, bevorzugen Sie konkrete Typen oder `unknown[]`

</details>

### Frage 5: void vs never

Erklaren Sie die Unterschiede und Anwendungsfalle von `void` und `never`.

```typescript
// Fall 1: void
function logMessage(): void {
  console.log('Hello');
}

// Fall 2: never
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {
    // Endlosschleife
  }
}
```

<details>
<summary>Klicken, um die Antwort anzuzeigen</summary>

**void**:
- **Verwendung**: Gibt an, dass eine Funktion keinen Wert zuruckgibt
- **Merkmal**: Die Funktion endet normal, gibt aber keinen Wert zuruck
- **Anwendungsfalle**: Event-Handler, Seiteneffekt-Funktionen

```typescript
function logMessage(): void {
  console.log('Hello');
  // Funktion endet normal, gibt keinen Wert zuruck
}

function onClick(): void {
  // Klick-Event verarbeiten, kein Ruckgabewert erforderlich
}
```

**never**:
- **Verwendung**: Gibt an, dass eine Funktion nie normal endet
- **Merkmal**: Die Funktion wirft einen Fehler oder tritt in eine Endlosschleife ein
- **Anwendungsfalle**: Fehlerbehandlung, Endlosschleifen, Type Guards

```typescript
function throwError(): never {
  throw new Error('Error');
  // Wird nie erreicht
}

function infiniteLoop(): never {
  while (true) {
    // Endet nie
  }
}

// Verwendung in Type Guards
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

**Vergleich der Unterschiede**:

| Eigenschaft | void | never |
| --- | --- | --- |
| Funktionsende | Normales Ende | Endet nie |
| Ruckgabewert | undefined | Kein Ruckgabewert |
| Anwendungsfalle | Funktionen ohne Ruckgabewert | Fehlerbehandlung, Endlosschleifen |

</details>

## 4. Best Practices

> Best Practices

### Empfohlene Vorgehensweisen

```typescript
// 1. Typinferenz bevorzugen
let age = 30;  // ✅ TypeScript inferieren lassen
let name = 'John';  // ✅

// 2. Funktionsparameter und Ruckgabewerte explizit typisieren
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. unknown statt any verwenden
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. Konkrete Array-Typen verwenden
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. Tupel fur feste Strukturen verwenden
let person: [string, number] = ['John', 30];  // ✅
```

### Zu vermeidende Vorgehensweisen

```typescript
// 1. any vermeiden
let value: any = 'hello';  // ❌

// 2. Unnotige Typannotationen vermeiden
let age: number = 30;  // ⚠️ Kann zu let age = 30; vereinfacht werden

// 3. object-Typ vermeiden
let user: object = { name: 'John' };  // ❌ Interface ist besser

// 4. Gemischte Typ-Arrays vermeiden (es sei denn, es ist notwendig)
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ Uberlegen, ob wirklich notwendig
```

## 5. Interview Summary

> Zusammenfassung fur das Interview

### Schnellreferenz

**Grundlegende Typen**:
- `number`, `string`, `boolean`, `null`, `undefined`
- `void` (kein Ruckgabewert), `never` (gibt nie zuruck)
- `any` (beliebiger Typ, vermeiden), `unknown` (unbekannter Typ, empfohlen)

**Typannotationen vs Inferenz**:
- Typannotation: Explizit angeben `let age: number = 30`
- Typinferenz: Automatisch ableiten `let age = 30`

**Array-Typen**:
- `number[]` oder `Array<number>`: Allgemeines Array
- `[number, string]`: Tupel (feste Struktur)

### Beispielantworten fur das Interview

**Q: Welche grundlegenden Typen hat TypeScript?**

> "TypeScript bietet viele grundlegende Typen, darunter number, string, boolean, null, undefined. Es gibt auch einige spezielle Typen: void bedeutet keinen Ruckgabewert, hauptsachlich fur Funktionen verwendet; never bedeutet einen Wert, der nie auftritt, fur Funktionen, die nie zuruckkehren; any ist ein beliebiger Typ, sollte aber vermieden werden; unknown ist ein unbekannter Typ, sicherer als any, erfordert eine Typprufung vor der Verwendung. Daruber hinaus gibt es den Array-Typ number[] und den Tupel-Typ [number, string]."

**Q: Was ist der Unterschied zwischen any und unknown?**

> "any deaktiviert die Typprufung vollstandig, sodass beliebige Eigenschaften oder Methoden direkt verwendet werden konnen, was jedoch unsicher ist. unknown erfordert eine Typprufung vor der Verwendung und ist daher sicherer. Beispielsweise muss bei der Verwendung von unknown zuerst mit typeof der Typ gepruft werden, bevor die entsprechenden Methoden aufgerufen werden konnen. Es wird empfohlen, unknown gegenuber any zu bevorzugen."

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
