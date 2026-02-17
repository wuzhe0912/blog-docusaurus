---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. What is `this` in JavaScript?

> Was ist `this` in JavaScript?

`this` ist ein Schlüsselwort in JavaScript, das auf das Kontextobjekt verweist, in dem eine Funktion ausgeführt wird. Der Wert von `this` hängt davon ab, **wie die Funktion aufgerufen wird**, und nicht davon, wo sie definiert wurde.

### Binding-Regeln für `this`

Es gibt vier Regeln für das Binding von `this` in JavaScript (nach Priorität von hoch nach niedrig):

1. **new-Binding**: Aufruf einer Konstruktorfunktion mit dem Schlüsselwort `new`
2. **Explizites Binding**: Explizite Angabe von `this` mit `call`, `apply`, `bind`
3. **Implizites Binding**: Aufruf als Objektmethode
4. **Standard-Binding**: Standardverhalten in allen anderen Fällen

## 2. Please explain the difference of `this` in different contexts

> Bitte erklären Sie den Unterschied von `this` in verschiedenen Kontexten

### 1. `this` im globalen Kontext

```javascript
console.log(this); // Browser: window, Node.js: global

function globalFunction() {
  console.log(this); // Nicht-Strict-Modus: window/global, Strict-Modus: undefined
}

globalFunction();
```

```javascript
'use strict';

function strictFunction() {
  console.log(this); // undefined
}

strictFunction();
```

### 2. `this` in regulären Funktionen (Function)

Das `this` einer regulären Funktion hängt von der **Aufrufart** ab:

```javascript
function regularFunction() {
  console.log(this);
}

// Direkter Aufruf: this zeigt auf das globale Objekt (Nicht-Strict-Modus) oder undefined (Strict-Modus)
regularFunction(); // window (Nicht-Strict-Modus) oder undefined (Strict-Modus)

// Aufruf als Objektmethode: this zeigt auf das Objekt
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// Mit call/apply/bind: this zeigt auf das angegebene Objekt
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. `this` in Arrow Functions

**Arrow Functions haben kein eigenes `this`**. Sie **erben das `this` des umgebenden Gültigkeitsbereichs** (lexikalischer Gültigkeitsbereich).

```javascript
const obj = {
  name: 'Object',

  // Reguläre Funktion
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // Innere reguläre Funktion: this ändert sich
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // Innere Arrow Function: this wird vom äußeren Bereich geerbt
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // Arrow Function
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window (erbt vom globalen Bereich)
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. `this` in Objektmethoden

```javascript
const person = {
  name: 'John',
  age: 30,

  // Reguläre Funktion: this zeigt auf person
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },

  // ES6-Kurzschreibweise: this zeigt auf person
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },

  // Arrow Function: this erbt vom äußeren Bereich (hier global)
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm undefined"
  },
};

person.greet(); // "Hello, I'm John"
person.introduce(); // "I'm John, 30 years old"
person.arrowGreet(); // "Hello, I'm undefined"
```

### 5. `this` in Konstruktorfunktionen

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.greet = function () {
    console.log(`Hello, I'm ${this.name}`);
  };
}

const john = new Person('John', 30);
john.greet(); // "Hello, I'm John"
console.log(john.name); // "John"
```

### 6. `this` in Klassen

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // Reguläre Methode: this zeigt auf die Instanz
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // Arrow-Function-Eigenschaft: this ist an die Instanz gebunden
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// Zuweisung der Methode an eine Variable verliert das this-Binding
const greet = john.greet;
greet(); // Fehler: Cannot read property 'name' of undefined

// Arrow-Function-Eigenschaft verliert das this-Binding nicht
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Quiz: What will be printed?

> Quiz: Was wird ausgegeben?

### Frage 1: Objektmethoden und Arrow Functions

```javascript
const obj = {
  name: 'Object',
  regularFunc: function () {
    console.log('A:', this.name);
  },
  arrowFunc: () => {
    console.log('B:', this.name);
  },
};

obj.regularFunc();
obj.arrowFunc();
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```javascript
// A: Object
// B: undefined
```

**Erklärung**:
- `regularFunc` ist eine reguläre Funktion, die über `obj.regularFunc()` aufgerufen wird. `this` zeigt auf `obj`, daher wird `"A: Object"` ausgegeben
- `arrowFunc` ist eine Arrow Function ohne eigenes `this`. Sie erbt das `this` des äußeren (globalen) Bereichs. Da es global kein `name`-Attribut gibt, wird `"B: undefined"` ausgegeben

</details>

### Frage 2: Funktion als Argument übergeben

```javascript
const person = {
  name: 'John',
  greet: function () {
    console.log(`Hello, ${this.name}`);
  },
};

person.greet(); // 1

const greet = person.greet;
greet(); // 2

setTimeout(person.greet, 1000); // 3
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" oder Fehler (Strict-Modus)
// 3: "Hello, undefined" oder Fehler (Strict-Modus)
```

**Erklärung**:
1. `person.greet()` - Aufruf über das Objekt, `this` zeigt auf `person`
2. `greet()` - Nach Zuweisung der Methode an eine Variable geht `this` verloren und zeigt auf global oder `undefined`
3. `setTimeout(person.greet, 1000)` - Die Methode wird als Callback übergeben, `this` geht verloren

</details>

### Frage 3: Verschachtelte Funktionen

```javascript
const obj = {
  name: 'Outer',
  method: function () {
    console.log('A:', this.name);

    function inner() {
      console.log('B:', this.name);
    }
    inner();

    const arrow = () => {
      console.log('C:', this.name);
    };
    arrow();
  },
};

obj.method();
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**Erklärung**:
- `A` - `method` wird über `obj` aufgerufen, `this` zeigt auf `obj`
- `B` - `inner` ist eine reguläre Funktion, die direkt aufgerufen wird. `this` zeigt auf global oder `undefined`
- `C` - `arrow` ist eine Arrow Function, die das `this` der äußeren `method` erbt und auf `obj` zeigt

</details>

### Frage 4: setTimeout und Arrow Functions

```javascript
const obj = {
  name: 'Object',

  method1: function () {
    setTimeout(function () {
      console.log('A:', this.name);
    }, 100);
  },

  method2: function () {
    setTimeout(() => {
      console.log('B:', this.name);
    }, 100);
  },
};

obj.method1();
obj.method2();
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```javascript
// A: undefined
// B: Object
```

**Erklärung**:
- `A` - Der Callback von `setTimeout` ist eine reguläre Funktion. Bei der Ausführung zeigt `this` auf das globale Objekt
- `B` - Der Callback von `setTimeout` ist eine Arrow Function, die das `this` der äußeren `method2` erbt und auf `obj` zeigt

</details>

### Frage 5: Komplexes this-Binding

```javascript
const obj1 = {
  name: 'obj1',
  getThis: function () {
    return this;
  },
};

const obj2 = {
  name: 'obj2',
};

console.log('A:', obj1.getThis().name);

const getThis = obj1.getThis;
console.log('B:', getThis() === window); // Annahme: Browser-Umgebung

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**Erklärung**:
- `A` - Aufruf über `obj1`, `this` zeigt auf `obj1`
- `B` - Direkter Aufruf, `this` zeigt auf global (window)
- `C` - Aufruf über `obj2`, `this` zeigt auf `obj2`
- `D` - Mit `bind` wird `this` an `obj2` gebunden

</details>

### Frage 6: Konstruktorfunktion und Prototyp

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log(`Hello, I'm ${this.name}`);
};

Person.prototype.delayedGreet = function () {
  setTimeout(function () {
    console.log('A:', this.name);
  }, 100);
};

Person.prototype.arrowDelayedGreet = function () {
  setTimeout(() => {
    console.log('B:', this.name);
  }, 100);
};

const john = new Person('John');
john.delayedGreet();
john.arrowDelayedGreet();
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```javascript
// A: undefined
// B: John
```

**Erklärung**:
- `A` - Regulärer Funktions-Callback von `setTimeout`, `this` zeigt auf global
- `B` - Arrow-Function-Callback von `setTimeout`, erbt das `this` der äußeren `arrowDelayedGreet` und zeigt auf `john`

</details>

### Frage 7: Globale Variable vs Objekteigenschaft

```javascript
var name = 'jjjj';

var obj = {
  a: function () {
    name = 'john';
    console.log(this.name);
  },
};

obj.a();
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```javascript
// undefined
```

**Erklärung**:

Der Schlüssel zu dieser Frage liegt im Verständnis des Unterschieds zwischen **globalen Variablen** und **Objekteigenschaften**:

1. **Worauf zeigt `this` bei `obj.a()`**:
   - Aufruf über `obj.a()`, `this` zeigt auf `obj`

2. **`name = 'john'` ändert die globale Variable**:
   ```javascript
   name = 'john'; // Ohne var/let/const wird die globale name geändert
   // Entspricht
   window.name = 'john'; // Browser-Umgebung
   ```

3. **`this.name` greift auf die Objekteigenschaft zu**:
   ```javascript
   console.log(this.name); // Entspricht console.log(obj.name)
   ```

4. **Das `obj`-Objekt hat keine `name`-Eigenschaft**:
   ```javascript
   obj.name; // undefined (im obj-Objekt ist name nicht definiert)
   ```

**Vollständiger Ausführungsablauf**:

```javascript
// Anfangszustand
window.name = 'jjjj'; // Globale Variable
obj = {
  a: function () { /* ... */ },
  // Beachte: obj hat keine name-Eigenschaft!
};

// Ausführung von obj.a()
obj.a();
  ↓
// 1. name = 'john' → Ändert globales window.name
window.name = 'john'; // ✅ Globale Variable wurde geändert

// 2. this.name → Zugriff auf obj.name
this.name; // Entspricht obj.name
obj.name; // undefined (obj hat keine name-Eigenschaft)
```

**Häufige Missverständnisse**:

Viele denken, es wird `'john'` ausgegeben, weil:
- ❌ Sie annehmen, dass `name = 'john'` dem `obj` eine Eigenschaft hinzufügt
- ❌ Sie annehmen, dass `this.name` auf die globale Variable zugreift

**Richtiges Verständnis**:
- ✅ `name = 'john'` ändert nur die globale Variable und hat keinen Einfluss auf `obj`
- ✅ `this.name` greift auf `obj.name` zu, nicht auf die globale `name`

**Um `'john'` auszugeben, sollte man so schreiben**:

```javascript
var obj = {
  a: function () {
    this.name = 'john'; // ✅ Fügt obj eine name-Eigenschaft hinzu
    console.log(this.name); // 'john'
  },
};

obj.a(); // Gibt 'john' aus
console.log(obj.name); // 'john'
```

</details>

### Frage 8: Globale-Variablen-Falle (Erweiterung)

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified'; // Beachte: Kein var/let/const
    console.log('1:', name); // Zugriff auf globale Variable
    console.log('2:', this.name); // Zugriff auf Objekteigenschaft
  },
};

obj.a();
console.log('3:', name); // Globale Variable
console.log('4:', obj.name); // Objekteigenschaft
```

<details>
<summary>Klicken Sie hier, um die Antwort zu sehen</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**Erklärung**:

```javascript
// Anfangszustand
window.name = 'global'; // Globale Variable
obj.name = 'object'; // Objekteigenschaft

// Ausführung von obj.a()
name = 'modified'; // Ändert globales window.name

console.log('1:', name); // Zugriff auf global: 'modified'
console.log('2:', this.name); // Zugriff auf obj.name: 'object'

// Nach der Ausführung
console.log('3:', name); // Global: 'modified'
console.log('4:', obj.name); // Objekt: 'object' (nicht geändert)
```

**Schlüsselkonzepte**:
- `name` (ohne `this.`) → Zugriff auf globale Variable
- `this.name` (mit `this.`) → Zugriff auf Objekteigenschaft
- Die beiden sind **völlig verschiedene Variablen**!

</details>

## 4. How to preserve `this` in callbacks?

> Wie bewahrt man `this` in Callback-Funktionen?

### Methode 1: Arrow Functions verwenden

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ Arrow Function erbt this vom äußeren Bereich
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Methode 2: `bind()` verwenden

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ bind bindet this
    setTimeout(
      function () {
        console.log(this.name); // "Object"
      }.bind(this),
      1000
    );
  },
};

obj.method();
```

### Methode 3: `this` in einer Variablen speichern (alte Methode)

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ this in einer Variablen speichern
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Methode 4: `call()` oder `apply()` verwenden

```javascript
function greet() {
  console.log(`Hello, I'm ${this.name}`);
}

const person1 = { name: 'John' };
const person2 = { name: 'Jane' };

greet.call(person1); // "Hello, I'm John"
greet.apply(person2); // "Hello, I'm Jane"
```

## 5. Common `this` pitfalls

> Häufige Fallstricke bei `this`

### Fallstrick 1: Objektmethode einer Variablen zuweisen

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ undefined (this geht verloren)

// Lösung: bind verwenden
const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### Fallstrick 2: `this` in Event-Listenern

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ Arrow Function: this zeigt nicht auf button
  handleClick1: () => {
    console.log(this); // window
  },

  // ✅ Reguläre Funktion: this zeigt auf das Element, das das Event ausgelöst hat
  handleClick2: function () {
    console.log(this); // button-Element
  },

  // ✅ Wenn auf das this des Objekts zugegriffen werden muss, Arrow Function als Wrapper verwenden
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### Fallstrick 3: Callbacks in Array-Methoden

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ Regulärer Funktions-Callback verliert this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // undefined 1, undefined 2, undefined 3
    });
  },

  // ✅ Arrow-Function-Callback behält this bei
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    });
  },

  // ✅ thisArg-Parameter von forEach verwenden
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    }, this); // Zweiter Parameter gibt this an
  },
};
```

## 6. `this` binding rules summary

> Zusammenfassung der `this`-Binding-Regeln

### Priorität (von hoch nach niedrig)

```javascript
// 1. new-Binding (höchste Priorität)
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. Explizites Binding (call/apply/bind)
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. Implizites Binding (Objektmethode)
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. Standard-Binding (niedrigste Priorität)
greet(); // undefined (Strict-Modus) oder window.name
```

### Vergleichstabelle: Function vs Arrow Function

| Eigenschaft | Function | Arrow Function |
| --- | --- | --- |
| Hat eigenes `this` | ✅ Ja | ❌ Nein |
| `this` hängt ab von | Aufrufart | Definitionsort (lexikalischer Gültigkeitsbereich) |
| `this` änderbar mit `call`/`apply`/`bind` | ✅ Ja | ❌ Nein |
| Kann als Konstruktor verwendet werden | ✅ Ja | ❌ Nein |
| Hat `arguments`-Objekt | ✅ Ja | ❌ Nein |
| Geeignet für | Objektmethoden, Konstruktoren | Callbacks, wenn äußeres this geerbt werden muss |

### Merkregel

> **„Arrow erbt, Funktion ruft auf"**
>
> - **Arrow Function**: `this` erbt vom äußeren Gültigkeitsbereich, wird bei der Definition festgelegt
> - **Reguläre Funktion**: `this` hängt von der Aufrufart ab, wird zur Laufzeit festgelegt

## 7. Best practices

> Best Practices

### ✅ Empfohlene Vorgehensweisen

```javascript
// 1. Für Objektmethoden reguläre Funktionen oder ES6-Methodenkurzschreibweise verwenden
const obj = {
  name: 'Object',

  // ✅ Gut: Reguläre Funktion
  greet: function () {
    console.log(this.name);
  },

  // ✅ Gut: ES6-Kurzschreibweise
  introduce() {
    console.log(this.name);
  },
};

// 2. Für Callback-Funktionen Arrow Functions verwenden
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    // ✅ Gut: Arrow Function behält this bei
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. Bei Bedarf an dynamischem this reguläre Funktionen verwenden
const button = {
  label: 'Click me',

  // ✅ Gut: Zugriff auf this des DOM-Elements erforderlich
  handleClick: function () {
    console.log(this); // button-DOM-Element
  },
};
```

### ❌ Nicht empfohlene Vorgehensweisen

```javascript
// 1. Arrow Functions nicht für Objektmethoden verwenden
const obj = {
  name: 'Object',

  // ❌ Schlecht: this zeigt nicht auf obj
  greet: () => {
    console.log(this.name); // undefined
  },
};

// 2. Arrow Functions nicht als Konstruktoren verwenden
// ❌ Schlecht: Arrow Functions können nicht als Konstruktoren verwendet werden
const Person = (name) => {
  this.name = name; // Fehler!
};

// 3. Arrow Functions nicht verwenden, wenn Zugriff auf arguments benötigt wird
// ❌ Schlecht: Arrow Functions haben kein arguments
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Reference

- [MDN - this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
