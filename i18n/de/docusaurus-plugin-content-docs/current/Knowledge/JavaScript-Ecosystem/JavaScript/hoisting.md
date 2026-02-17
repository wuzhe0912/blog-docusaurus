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
// 原始程式碼
console.log(foo);
var foo = '1';
function foo() {}

// 等價於（經過 Hoisting）
// 階段 1：創造階段（Hoisting）
function foo() {} // 1. 函式聲明先提升
var foo; // 2. 變數聲明提升（但不覆蓋已存在的函式）

// 階段 2：執行階段
console.log(foo); // 此時 foo 是函式，輸出 [Function: foo]
foo = '1'; // 3. 變數賦值（會覆蓋函式）
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
// 提升後的順序
function foo() {} // 函式先提升並賦值
var foo; // 變數聲明提升，但不會覆蓋已存在的函式

// 因此 foo 是函式
console.log(foo); // [Function: foo]
```

### Vollständiger Ausführungsablauf

```js
// 原始程式碼
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== 等價於 ========

// 創造階段（Hoisting）
function foo() {} // 1️⃣ 函式聲明提升（完整提升，包含函式體）
var foo; // 2️⃣ 變數聲明提升（但不覆蓋 foo，因為已經是函式了）

// 執行階段
console.log(foo); // [Function: foo] - foo 是函式
foo = '1'; // 3️⃣ 變數賦值（此時才覆蓋函式）
console.log(foo); // '1' - foo 變成字串
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
[Function: foo] // 第一次輸出
'1' // 第二次輸出
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
[Function: foo] { return 2; } // 第一次輸出（後面的函式覆蓋前面的）
'1' // 第二次輸出（變數賦值覆蓋函式）
```

**Begründung:**

```js
// 提升後
function foo() {
  return 1;
} // 第一個函式

function foo() {
  return 2;
} // 第二個函式覆蓋第一個

var foo; // 變數聲明（不覆蓋函式）

console.log(foo); // [Function: foo] { return 2; }
foo = '1'; // 變數賦值（覆蓋函式）
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
undefined; // foo 是 undefined
[Function: bar] // bar 是函式
```

**Begründung:**

```js
// 提升後
var foo; // 變數聲明提升（函式表達式只提升變數名）
function bar() {
  return 2;
} // 函式聲明完整提升

console.log(foo); // undefined
console.log(bar); // [Function: bar]

foo = function () {
  return 1;
}; // 函式表達式賦值
```

**Wesentlicher Unterschied:**

- **Funktionsdeklaration**: `function foo() {}` → wird vollständig gehoben (einschließlich Funktionskörper)
- **Funktionsausdruck**: `var foo = function() {}` → nur der Variablenname wird gehoben, der Funktionskörper nicht

### let/const haben dieses Problem nicht

```js
// ❌ var 會有提升問題
console.log(foo); // undefined
var foo = '1';

// ✅ let/const 有暫時性死區（TDZ）
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = '1';

// ✅ let/const 與函式同名會報錯
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
