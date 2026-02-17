---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Überblick

In JavaScript gibt es drei Schlüsselwörter zur Deklaration von Variablen: `var`, `let` und `const`. Obwohl sie alle zur Variablendeklaration verwendet werden, unterscheiden sie sich in Bezug auf Geltungsbereich, Initialisierung, Neudeklaration, Neuzuweisung und Zugriffszeitpunkt.

## Hauptunterschiede

| Verhalten             | `var`                             | `let`               | `const`             |
| --------------------- | --------------------------------- | ------------------- | ------------------- |
| Geltungsbereich       | Funktions- oder globaler Bereich  | Blockbereich        | Blockbereich        |
| Initialisierung       | Optional                          | Optional            | Erforderlich        |
| Neudeklaration        | Erlaubt                           | Nicht erlaubt       | Nicht erlaubt       |
| Neuzuweisung          | Erlaubt                           | Erlaubt             | Nicht erlaubt       |
| Zugriff vor Deklaration | Gibt undefined zurück           | Wirft ReferenceError | Wirft ReferenceError |

## Detaillierte Erklärung

### Geltungsbereich

Der Geltungsbereich von `var` ist der Funktions- oder globale Bereich, während `let` und `const` einen Blockbereich haben (einschließlich Funktionen, if-else-Blöcken oder for-Schleifen).

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var in block';
  let letInBlock = 'let in block';
  const constInBlock = 'const in block';
}

console.log(varInBlock); // 'var in block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### Initialisierung

`var` und `let` können ohne Initialisierung deklariert werden, während `const` bei der Deklaration initialisiert werden muss.

```javascript
var varVariable;  // Gültig
let letVariable;  // Gültig
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### Neudeklaration

Im selben Geltungsbereich erlaubt `var` die erneute Deklaration derselben Variable, während `let` und `const` dies nicht erlauben.

```javascript
var x = 1;
var x = 2; // Gültig, x ist jetzt 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Neuzuweisung

Mit `var` und `let` deklarierte Variablen können neu zugewiesen werden, mit `const` deklarierte Variablen jedoch nicht.

```javascript
var x = 1;
x = 2; // Gültig

let y = 1;
y = 2; // Gültig

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Hinweis: Obwohl eine mit `const` deklarierte Variable nicht neu zugewiesen werden kann, können bei Objekten oder Arrays deren Inhalte dennoch geändert werden.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // Gültig
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // Gültig
console.log(arr); // [1, 2, 3, 4]
```

### Zugriff vor der Deklaration (Temporal Dead Zone)

Mit `var` deklarierte Variablen werden gehoben und automatisch mit `undefined` initialisiert. Mit `let` und `const` deklarierte Variablen werden zwar auch gehoben, aber nicht initialisiert. Ein Zugriff vor der Deklaration wirft einen `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Interview-Aufgaben

### Aufgabe: Die klassische Falle mit setTimeout + var

Bestimmen Sie die Ausgabe des folgenden Codes:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Falsche Antwort (häufiges Missverständnis)

Viele denken, die Ausgabe sei: `1 2 3 4 5`

#### Tatsächliche Ausgabe

```
6
6
6
6
6
```

#### Warum?

Dieses Problem betrifft drei Kernkonzepte:

**1. Der Funktionsbereich von var**

```javascript
// var erstellt keinen Blockbereich innerhalb der Schleife
for (var i = 1; i <= 5; i++) {
  // i befindet sich im äußeren Geltungsbereich, alle Iterationen teilen dasselbe i
}
console.log(i); // 6 (Wert von i nach Schleifenende)

// Bei var
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // Schleife beendet
}
```

**2. Die asynchrone Ausführung von setTimeout**

```javascript
// setTimeout ist asynchron und wird erst nach Abschluss des aktuellen synchronen Codes ausgeführt
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Dieser Code wird in die Aufgabenwarteschlange des Event Loop eingereiht
    console.log(i);
  }, 0);
}
// Die Schleife wird zuerst vollständig ausgeführt (i wird zu 6), dann werden die setTimeout-Callbacks ausgeführt
```

**3. Closure-Referenz**

```javascript
// Alle setTimeout-Callback-Funktionen referenzieren dasselbe i
// Wenn die Callbacks ausgeführt werden, ist i bereits 6
```

#### Lösungen

**Lösung 1: let verwenden (empfohlen) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// Ausgabe: 1 2 3 4 5

// Bei let
{
  let i = 1; // i der ersten Iteration
}
{
  let i = 2; // i der zweiten Iteration
}
{
  let i = 3; // i der dritten Iteration
}
```

**Prinzip**: `let` erstellt bei jeder Iteration einen neuen Blockbereich, und jeder `setTimeout`-Callback erfasst den `i`-Wert der aktuellen Iteration.

```javascript
// Äquivalent zu
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ... und so weiter
```

**Lösung 2: IIFE (Immediately Invoked Function Expression) verwenden**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// Ausgabe: 1 2 3 4 5
```

**Prinzip**: IIFE erstellt einen neuen Funktionsbereich, und bei jeder Iteration wird der aktuelle `i`-Wert als Parameter `j` übergeben, wodurch eine Closure entsteht.

**Lösung 3: Den dritten Parameter von setTimeout verwenden**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // Der dritte Parameter wird an die Callback-Funktion übergeben
}
// Ausgabe: 1 2 3 4 5
```

**Prinzip**: Der dritte und alle weiteren Parameter von `setTimeout` werden als Argumente an die Callback-Funktion übergeben.

**Lösung 4: bind verwenden**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// Ausgabe: 1 2 3 4 5
```

**Prinzip**: `bind` erstellt eine neue Funktion und bindet den aktuellen `i`-Wert als Parameter.

#### Lösungsvergleich

| Lösung          | Vorteile                       | Nachteile          | Empfehlung             |
| --------------- | ------------------------------ | ------------------ | ---------------------- |
| `let`           | Prägnant, modern, verständlich | ES6+               | 5/5 Stark empfohlen   |
| IIFE            | Gute Kompatibilität            | Komplexere Syntax  | 3/5 Erwägenswert      |
| setTimeout-Parameter | Einfach und direkt        | Weniger bekannt    | 4/5 Empfohlen          |
| `bind`          | Funktionaler Stil              | Etwas schlechtere Lesbarkeit | 3/5 Erwägenswert |

#### Weiterführende Fragen

**Q1: Was passiert bei dieser Änderung?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Antwort**: Jede Sekunde wird `6` ausgegeben, insgesamt 5 Mal (jeweils nach 1, 2, 3, 4 und 5 Sekunden).

**Q2: Wie gibt man jede Sekunde der Reihe nach 1, 2, 3, 4, 5 aus?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// Nach 1 Sekunde: 1
// Nach 2 Sekunden: 2
// Nach 3 Sekunden: 3
// Nach 4 Sekunden: 4
// Nach 5 Sekunden: 5
```

#### Interview-Schwerpunkte

Diese Aufgabe prüft:

1. **var-Geltungsbereich**: Funktionsbereich vs Blockbereich
2. **Event Loop**: Synchrone vs asynchrone Ausführung
3. **Closure**: Wie Funktionen externe Variablen erfassen
4. **Lösungen**: Verschiedene Lösungsansätze mit Vor- und Nachteilen

Bei der Antwort wird empfohlen:

- Zuerst die richtige Antwort nennen (6 6 6 6 6)
- Die Ursache erklären (var-Geltungsbereich + setTimeout asynchron)
- Lösungen anbieten (bevorzugt let, und andere Ansätze erklären)
- Verständnis der zugrundeliegenden JavaScript-Mechanismen demonstrieren

## Best Practices

1. Bevorzugt `const` verwenden: Für Variablen, die nicht neu zugewiesen werden müssen, verbessert `const` die Lesbarkeit und Wartbarkeit des Codes.
2. Danach `let` verwenden: Wenn eine Neuzuweisung erforderlich ist, `let` verwenden.
3. `var` vermeiden: Da das Geltungsbereich- und Hoisting-Verhalten von `var` zu unerwarteten Problemen führen kann, sollte es in der modernen JavaScript-Entwicklung vermieden werden.
4. Auf Browser-Kompatibilität achten: Falls ältere Browser unterstützt werden müssen, können Tools wie Babel `let` und `const` in `var` transpilieren.

## Verwandte Themen

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
