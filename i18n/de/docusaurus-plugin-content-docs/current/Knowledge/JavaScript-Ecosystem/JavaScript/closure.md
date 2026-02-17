---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> Was ist eine Closure?

Um Closures zu verstehen, muss man zuerst den Variablenbereich (Scope) in JavaScript verstehen und wie Funktionen auf externe Variablen zugreifen.

### Variable Scope (Variablenbereich)

In JavaScript gibt es zwei Arten von Variablenbereichen: global scope und function scope.

```js
// global scope
let a = 1;

function parentFunction() {
  // function scope
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // print 1 2 3, can access global scope & function scope
  }

  childFunction();
}

parentFunction();
console.log(a); // print 1, can access global scope
console.log(b, c); // Fehler – auf Variablen im function scope kann nicht zugegriffen werden
```

### Closure example

Die Auslösebedingung für eine Closure ist, dass eine innere Funktion innerhalb einer äußeren Funktion definiert und über return zurückgegeben wird, wodurch die Umgebungsvariablen der inneren Funktion erhalten bleiben (d. h. die `Garbage Collection` wird umgangen).

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`Aktueller Zählerstand: ${count}`);
  };
}

const counter = parentFunction();

counter(); // print Aktueller Zählerstand: 1
counter(); // print Aktueller Zählerstand: 2
// Die Variable count wird nicht freigegeben, da childFunction weiterhin existiert und bei jedem Aufruf den Wert von count aktualisiert
```

Es ist jedoch zu beachten, dass Closures Variablen im Speicher halten. Wenn zu viele Variablen vorhanden sind, kann dies zu einem übermäßigen Speicherverbrauch führen (Closures sollten nicht missbraucht werden), was die Leistung beeinträchtigen kann.

## 2. Create a function that meets the following conditions

> Erstellen Sie eine Funktion, die die folgenden Bedingungen erfüllt (unter Verwendung des Closure-Konzepts)

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

Die beiden Funktionen werden getrennt verarbeitet

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// use closure save variable

function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Second Solution : single function

Natürlich besteht bei der ersten Lösung eine hohe Wahrscheinlichkeit, abgelehnt zu werden. Daher sollte versucht werden, alles in einer einzigen Funktion zusammenzufassen.

```js
function plus(value, subValue) {
  // Anhand der Anzahl der übergebenen Parameter entscheiden
  if (arguments.length > 1) {
    return value + subValue;
  } else {
    return function (item) {
      return value + item;
    };
  }
}

console.log(plus(2, 5));
console.log(plus(2)(5));
```

## 3. Please take advantage of the closure feature to increase the number

> Nutzen Sie die Closure-Eigenschaft, um eine Zahl zu inkrementieren

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

Hier wird keine Arrow Function verwendet, sondern die normale function-Syntax.

```js
function plus() {
  let cash = 0;
  let counter = {
    add() {
      cash += 1;
      console.log(cash);
    },
  };
  return counter;
}

var obj = plus();
obj.add();
obj.add();
```

### Second Solution : return object

In der vorherigen Lösung kann das Objekt auch direkt im return eingebettet werden

```js
function plus() {
  let cash = 0;
  return {
    add: function () {
      cash += 1;
      console.log(cash);
    },
  };
}

var obj = plus();
obj.add();
obj.add();
```

## 4. What will be printed in this nested function call?

> Was wird bei diesem verschachtelten Funktionsaufruf ausgegeben?

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

a(b(c));
```

### Analyse

**Ausführungsergebnis**:

```
hello
TypeError: aa is not a function
```

### Detaillierter Ausführungsablauf

```js
// Ausführung von a(b(c))
// JavaScript führt Funktionen von innen nach außen aus

// Schritt 1: Ausführung der innersten Funktion b(c)
b(c)
  ↓
// Die Funktion c wird als Parameter an b übergeben
// Innerhalb von b wird bb(), also c(), ausgeführt
c() // Gibt 'hello' aus
  ↓
// Die Funktion b hat keine return-Anweisung
// Daher wird undefined zurückgegeben
return undefined

// Schritt 2: Ausführung von a(undefined)
a(undefined)
  ↓
// undefined wird als Parameter an a übergeben
// Innerhalb von a wird versucht, aa() auszuführen
// Also undefined()
undefined() // ❌ Fehler: TypeError: aa is not a function
```

### Warum passiert das?

#### 1. Ausführungsreihenfolge der Funktionen (von innen nach außen)

```js
// Beispiel
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. Zuerst multiply(2, 3) ausführen → 6
           └────── 3. Dann add(6) ausführen

// Gleiches Konzept
a(b(c))
  ↑ ↑
  | └─ 1. Zuerst b(c) ausführen
  └─── 2. Dann a(Ergebnis von b(c)) ausführen
```

#### 2. Funktionen ohne return geben undefined zurück

```js
function b(bb) {
  bb(); // Wurde ausgeführt, aber kein return
} // Implizites return undefined

// Entspricht
function b(bb) {
  bb();
  return undefined; // Wird von JavaScript automatisch hinzugefügt
}
```

#### 3. Der Versuch, etwas aufzurufen, das keine Funktion ist, verursacht einen Fehler

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// Weitere Fälle, die Fehler verursachen
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### Wie kann man das beheben?

#### Methode 1: Die Funktion b eine Funktion zurückgeben lassen

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
  return function () {
    console.log('b executed');
  };
}

function c() {
  console.log('hello');
}

a(b(c));
// Ausgabe:
// hello
// b executed
```

#### Methode 2: Die Funktion direkt übergeben, ohne sie vorher auszuführen

```js
function a(aa) {
  aa();
}

function b(bb) {
  return function () {
    bb();
  };
}

function c() {
  console.log('hello');
}

a(b(c)); // Gibt nur 'hello' aus

// Oder so schreiben
a(() => b(c)); // Gibt 'hello' aus
```

#### Methode 3: Die Ausführungslogik ändern

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

// Getrennt ausführen
b(c); // Gibt 'hello' aus
a(() => console.log('a executed')); // Gibt 'a executed' aus
```

### Verwandte Aufgaben

#### Aufgabe 1: Was passiert, wenn man es so ändert?

```js
function a(aa) {
  return aa();
}

function b(bb) {
  return bb();
}

function c() {
  console.log('hello');
  return 'world';
}

console.log(a(b(c)));
```

<details>
<summary>Klicken, um die Antwort zu sehen</summary>

```
hello
TypeError: aa is not a function
```

**Analyse**:

1. `b(c)` → Führt `c()` aus, gibt `'hello'` aus, gibt `'world'` zurück
2. `a('world')` → Führt `'world'()` aus... Moment, das verursacht auch einen Fehler!

**Richtige Antwort**:

```
hello
TypeError: aa is not a function
```

Da `b(c)` `'world'` (ein String) zurückgibt, versucht `a('world')` `'world'()` auszuführen. Ein String ist keine Funktion, daher tritt ein Fehler auf.

</details>

#### Aufgabe 2: Was passiert, wenn alle ein return haben?

```js
function a(aa) {
  return aa;
}

function b(bb) {
  return bb;
}

function c() {
  return 'hello';
}

const result = a(b(c));
console.log(result);
console.log(result());
```

<details>
<summary>Klicken, um die Antwort zu sehen</summary>

```
[Function: c]
hello
```

**Analyse**:

1. `b(c)` → Gibt die Funktion `c` selbst zurück (ohne sie auszuführen)
2. `a(c)` → Gibt die Funktion `c` selbst zurück
3. `result` ist die Funktion `c`
4. `result()` → Führt `c()` aus, gibt `'hello'` zurück

</details>

### Wichtige Punkte zum Merken

```javascript
// Priorität der Funktionsaufrufe
a(b(c))
  ↓
// 1. Zuerst die innerste ausführen
b(c) // Wenn b kein return hat, ist es undefined
  ↓
// 2. Dann die äußere ausführen
a(undefined) // Der Versuch, undefined() auszuführen, verursacht einen Fehler

// Lösungsansätze
// ✅ 1. Sicherstellen, dass Zwischenfunktionen eine Funktion zurückgeben
// ✅ 2. Oder mit Arrow Functions umhüllen
a(() => b(c))
```

## Reference

- [Closures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [Day6 [JavaScript Grundlagen] Garbage-Collection-Mechanismus](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - JavaScript Speicherverwaltung](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [MDN - Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Functions)
- [MDN - TypeError](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
