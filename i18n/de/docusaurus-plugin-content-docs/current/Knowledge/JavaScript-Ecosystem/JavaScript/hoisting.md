---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. What's Hoisting ?

Die Ausführung von JS kann in zwei Phasen unterteilt werden: die Erstellungsphase und die Ausführungsphase:

```js
var name = 'Pitt';
console.log(name); // print Pitt
```

Aufgrund der Hoisting-Eigenschaft muss der obige Code so verstanden werden, dass zuerst die Variable deklariert und dann der Wert zugewiesen wird.

```js
// create
var name;

// execute
name = 'Pitt';
console.log(name);
```

Funktionen unterscheiden sich von Variablen – sie werden bereits in der Erstellungsphase dem Speicher zugewiesen. Eine Funktionsdeklaration sieht wie folgt aus:

```js
getName();

function getName() {
  console.log('string'); // print string
}
```

Der obige Code kann normal ausgeführt werden und console.log ausgeben, ohne einen Fehler zu werfen, weil folgende Logik greift: Die function wird zuerst nach oben gehoben, und erst dann wird der Funktionsaufruf durchgeführt.

```js
// create
function getName() {
  console.log('string');
}

// execute
getName();
```

Es ist jedoch zu beachten, dass bei dieser Hoisting-Eigenschaft die Reihenfolge bei Ausdrücken wichtig ist.

In der Erstellungsphase hat die function die höchste Priorität, gefolgt von Variablen.

### Correct

```js
name = 'Yumy';
console.log(name); // print Yumy
var name;

// --- Equal to ---

// create
var name;

// execute
name = 'Yumy';
console.log(name); // print Yumy
```

### Wrong

```js
console.log(name); // print undefined
var name = 'Jane';

// --- Equal to ---

// create
var name;

// execute
console.log(name); // print undefined，da noch kein Wert zugewiesen wurde, wird nur der Standardwert undefined zurückgegeben
name = 'Pitt';
```

## 2. What's `name` printed ?

```js
whoseName();

function whoseName() {
  if (name) {
    name = 'Nini';
  }
}

var name = 'Pitt';
console.log(name);
```

### Answer

```js
// create
function whoseName() {
  if (name) {
    name = 'Nini';
  }
}
var name;

// execute
whoseName();
name = 'Pitt';
console.log(name); // print Pitt
```

name erhält in `whoseName()` den Wert undefined, wodurch die Bedingung nicht erfüllt wird.

Da jedoch unterhalb der Funktionsdeklaration eine weitere Zuweisung erfolgt, wird letztendlich Pitt ausgegeben, selbst wenn die Bedingung in der function erfüllt worden wäre.

---

## 3. Funktionsdeklaration vs Variablendeklaration: Hoisting-Priorität

### Aufgabe: Gleichnamige Funktion und Variable

Bestimmen Sie die Ausgabe des folgenden Codes:

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### Falsche Antwort (häufiges Missverständnis)

Viele denken:

- Ausgabe `undefined` (Annahme: var wird zuerst gehoben)
- Ausgabe `'1'` (Annahme: die Zuweisung wirkt sich aus)
- Fehler (Annahme: Namenskonflikt)

### Tatsächliche Ausgabe

```js
[Function: foo]
```

### Warum?

Diese Frage prüft die **Prioritätsregeln** des Hoisting:

**Hoisting-Priorität: Funktionsdeklaration > Variablendeklaration**

```js
// Originalcode
console.log(foo);
var foo = '1';
function foo() {}

// Entspricht (nach Hoisting)
// Phase 1: Erstellungsphase (Hoisting)
function foo() {} // 1. Funktionsdeklaration wird zuerst gehoben
var foo; // 2. Variablendeklaration wird gehoben (überschreibt vorhandene Funktion nicht)

// Phase 2: Ausführungsphase
console.log(foo); // foo ist hier eine Funktion, Ausgabe [Function: foo]
foo = '1'; // 3. Variablenzuweisung (überschreibt die Funktion)
```

### Schlüsselkonzepte

**1. Funktionsdeklarationen werden vollständig gehoben**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. var-Variablendeklarationen heben nur die Deklaration, nicht die Zuweisung**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. Wenn Funktionsdeklaration und Variablendeklaration denselben Namen haben**

```js
// Reihenfolge nach Hoisting
function foo() {} // Funktion wird zuerst gehoben und initialisiert
var foo; // Variablendeklaration wird gehoben, überschreibt vorhandene Funktion nicht

// Deshalb ist foo eine Funktion
console.log(foo); // [Function: foo]
```

### Vollständiger Ausführungsablauf

```js
// Originalcode
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== Entspricht ========

// Erstellungsphase (Hoisting)
function foo() {} // 1) Funktionsdeklaration wird vollständig gehoben (inkl. Funktionskörper)
var foo; // 2) Variablendeklaration wird gehoben (überschreibt foo nicht, da bereits Funktion)

// Ausführungsphase
console.log(foo); // [Function: foo] - foo ist eine Funktion
foo = '1'; // 3) Variablenzuweisung (überschreibt die Funktion erst jetzt)
console.log(foo); // '1' - foo wird zu einer Zeichenkette
```

### Weiterführende Aufgaben

#### Aufgabe A: Einfluss der Reihenfolge

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**Antwort:**

```js
[Function: foo] // Erste Ausgabe
'1' // Zweite Ausgabe
```

**Begründung:** Die Code-Reihenfolge beeinflusst das Hoisting-Ergebnis nicht. Die Hoisting-Priorität bleibt: Funktion > Variable.

#### Aufgabe B: Mehrere gleichnamige Funktionen

```js
console.log(foo); // ?

function foo() {
  return 1;
}

var foo = '1';

function foo() {
  return 2;
}

console.log(foo); // ?
```

**Antwort:**

```js
[Function: foo] { return 2; } // Erste Ausgabe (spätere Funktion überschreibt frühere)
'1' // Zweite Ausgabe (Variablenzuweisung überschreibt Funktion)
```

**Begründung:**

```js
// Nach Hoisting
function foo() {
  return 1;
} // Erste Funktion

function foo() {
  return 2;
} // Zweite Funktion überschreibt erste

var foo; // Variablendeklaration (überschreibt Funktion nicht)

console.log(foo); // [Function: foo] { return 2; }
foo = '1'; // Variablenzuweisung (überschreibt Funktion)
console.log(foo); // '1'
```

#### Aufgabe C: Funktionsausdruck vs Funktionsdeklaration

```js
console.log(foo); // ?
console.log(bar); // ?

var foo = function () {
  return 1;
};

function bar() {
  return 2;
}
```

**Antwort:**

```js
undefined; // foo ist undefined
[Function: bar] // bar ist eine Funktion
```

**Begründung:**

```js
// Nach Hoisting
var foo; // Variablendeklaration wird gehoben (Funktionsausdruck hebt nur den Namen)
function bar() {
  return 2;
} // Funktionsdeklaration wird vollständig gehoben

console.log(foo); // undefined
console.log(bar); // [Function: bar]

foo = function () {
  return 1;
}; // Zuweisung des Funktionsausdrucks
```

**Wesentlicher Unterschied:**

- **Funktionsdeklaration**: `function foo() {}` → wird vollständig gehoben (einschließlich Funktionskörper)
- **Funktionsausdruck**: `var foo = function() {}` → nur der Variablenname wird gehoben, der Funktionskörper nicht

### let/const haben dieses Problem nicht

```js
// ❌ var kann Hoisting-Probleme verursachen
console.log(foo); // undefined
var foo = '1';

// ✅ let/const haben eine Temporal Dead Zone (TDZ)
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = '1';

// ✅ Gleichnamige let/const und Funktion erzeugen Fehler
function baz() {} // SyntaxError: Identifier 'baz' has already been declared
let baz = '1';
```

### Zusammenfassung der Hoisting-Priorität

```
Hoisting-Priorität (von hoch nach niedrig):

1. Funktionsdeklaration (Function Declaration)
   ├─ function foo() {} ✅ vollständig gehoben
   └─ höchste Priorität

2. Variablendeklaration (Variable Declaration)
   ├─ var foo ⚠️ nur Deklaration gehoben, nicht die Zuweisung
   └─ überschreibt keine bestehende Funktion

3. Variablenzuweisung (Variable Assignment)
   ├─ foo = '1' ✅ überschreibt Funktion
   └─ geschieht in der Ausführungsphase

4. Funktionsausdruck (Function Expression)
   ├─ var foo = function() {} ⚠️ wird als Variablenzuweisung behandelt
   └─ nur der Variablenname wird gehoben, nicht der Funktionskörper
```

### Interview-Schwerpunkte

Bei der Beantwortung solcher Fragen wird empfohlen:

1. **Hoisting-Mechanismus erklären**: Unterteilt in Erstellungs- und Ausführungsphase
2. **Priorität betonen**: Funktionsdeklaration > Variablendeklaration
3. **Code nach dem Hoisting aufzeichnen**: Dem Interviewer das Verständnis demonstrieren
4. **Best Practices erwähnen**: let/const verwenden, um Hoisting-Probleme mit var zu vermeiden

**Beispiel für eine Interview-Antwort:**

> "Diese Frage prüft die Priorität des Hoisting. In JavaScript hat die Funktionsdeklaration eine höhere Hoisting-Priorität als die Variablendeklaration.
>
> Der Ausführungsprozess ist in zwei Phasen unterteilt:
>
> 1. Erstellungsphase: `function foo() {}` wird vollständig nach oben gehoben, dann wird die `var foo`-Deklaration gehoben, überschreibt aber nicht die bestehende Funktion.
> 2. Ausführungsphase: Bei `console.log(foo)` ist foo zu diesem Zeitpunkt eine Funktion, daher wird `[Function: foo]` ausgegeben. Erst danach überschreibt `foo = '1'` foo mit einem String.
>
> Best Practice ist, `let`/`const` anstelle von `var` zu verwenden und Funktionsdeklarationen an den Anfang zu setzen, um solche Verwirrungen zu vermeiden."

---

## Verwandte Themen

- [Unterschiede zwischen var, let, const](/docs/let-var-const-differences)
