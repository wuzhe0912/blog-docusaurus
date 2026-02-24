---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. Cos'è `this` in JavaScript?

> Cos'è `this` in JavaScript?

`this` è una parola chiave in JavaScript che punta all'oggetto del contesto di esecuzione di una funzione.
Il valore di `this` dipende da **come la funzione viene chiamata**, non da dove è definita.

### Regole di binding di `this`

Ci sono quattro regole di binding per `this` in JavaScript (dalla priorità più alta alla più bassa):

1. **new binding**: funzione chiamata con `new`
2. **binding esplicito**: `call`, `apply` o `bind` impostano esplicitamente `this`
3. **binding implicito**: chiamata come metodo di un oggetto
4. **binding predefinito**: comportamento di fallback in altri siti di chiamata

## 2. Spiega la differenza di `this` in contesti diversi

> Spiega come si comporta `this` in contesti diversi.

### 1. `this` nel contesto globale

```javascript
console.log(this); // browser: window, Node.js: global

function globalFunction() {
  console.log(this); // non-strict: window/global, strict: undefined
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

### 2. `this` nelle funzioni regolari

Per le funzioni regolari, `this` dipende dal **sito di chiamata**:

```javascript
function regularFunction() {
  console.log(this);
}

// chiamata diretta
regularFunction(); // window (non-strict) o undefined (strict)

// chiamata come metodo
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// call/apply/bind
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. `this` nelle arrow function

**Le arrow function non hanno un proprio `this`**.
**Ereditano `this` dallo scope lessicale esterno**.

```javascript
const obj = {
  name: 'Object',

  // metodo regolare
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // funzione regolare interna: this cambia
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // arrow function interna: this è ereditato
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // arrow function come proprietà dell'oggetto
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window/scope lessicale globale
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. `this` nei metodi degli oggetti

```javascript
const person = {
  name: 'John',
  age: 30,

  // funzione regolare: this -> person
  greet: function () {
    console.log(`Ciao, sono ${this.name}`); // "Ciao, sono John"
  },

  // abbreviazione metodo ES6: this -> person
  introduce() {
    console.log(`Sono ${this.name}, ${this.age} anni`);
  },

  // arrow function: this ereditato dallo scope esterno
  arrowGreet: () => {
    console.log(`Ciao, sono ${this.name}`); // solitamente undefined per name
  },
};

person.greet();
person.introduce();
person.arrowGreet();
```

### 5. `this` nelle funzioni costruttore

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.greet = function () {
    console.log(`Ciao, sono ${this.name}`);
  };
}

const john = new Person('John', 30);
john.greet();
console.log(john.name); // "John"
```

### 6. `this` nelle classi

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // metodo regolare: this -> istanza
  greet() {
    console.log(`Ciao, sono ${this.name}`);
  }

  // campo di classe con arrow function: this legato permanentemente all'istanza
  arrowGreet = () => {
    console.log(`Ciao, sono ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Ciao, sono John"

// l'estrazione del metodo perde this
const greet = john.greet;
greet(); // errore in strict mode

// il campo arrow mantiene this
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Ciao, sono John"
```

## 3. Quiz: Cosa verrà stampato?

> Quiz: cosa stamperà il seguente codice?

### Domanda 1: metodo dell'oggetto vs arrow function

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
<summary>Clicca per vedere la risposta</summary>

```javascript
// A: Object
// B: undefined
```

**Spiegazione:**

- `regularFunc` è chiamata come `obj.regularFunc()`, quindi `this` è `obj`
- `arrowFunc` non ha un proprio `this`; eredita il `this` lessicale esterno/globale

</details>

### Domanda 2: passare una funzione come argomento

```javascript
const person = {
  name: 'John',
  greet: function () {
    console.log(`Ciao, ${this.name}`);
  },
};

person.greet(); // 1

const greet = person.greet;
greet(); // 2

setTimeout(person.greet, 1000); // 3
```

<details>
<summary>Clicca per vedere la risposta</summary>

```javascript
// 1: "Ciao, John"
// 2: "Ciao, undefined" o errore in strict mode
// 3: "Ciao, undefined" o errore in strict mode
```

**Spiegazione:**

1. `person.greet()` -> binding implicito, `this` è `person`
2. Chiamata della funzione estratta -> `this` viene perso
3. Callback passata a `setTimeout` -> `this` non è `person`

</details>

### Domanda 3: funzioni annidate

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
<summary>Clicca per vedere la risposta</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**Spiegazione:**

- `A`: `method` è chiamato da `obj`
- `B`: `inner` è una chiamata diretta regolare
- `C`: la arrow function eredita il `this` di `method` esterno

</details>

### Domanda 4: `setTimeout` e arrow function

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
<summary>Clicca per vedere la risposta</summary>

```javascript
// A: undefined
// B: Object
```

**Spiegazione:**

- `A`: il callback regolare in `setTimeout` perde il contesto del metodo
- `B`: il callback arrow eredita `this` da `method2`

</details>

### Domanda 5: binding complesso di `this`

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
console.log('B:', getThis() === window); // assunzione browser

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>Clicca per vedere la risposta</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**Spiegazione:**

- `A`: chiamato da `obj1`
- `B`: chiamata diretta usa il binding predefinito (window nel browser non-strict)
- `C`: chiamato da `obj2`
- `D`: legato esplicitamente con `bind(obj2)`

</details>

### Domanda 6: costruttore e prototype

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log(`Ciao, sono ${this.name}`);
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
<summary>Clicca per vedere la risposta</summary>

```javascript
// A: undefined
// B: John
```

**Spiegazione:**

- `A`: il callback regolare nel timeout usa il binding predefinito/globale
- `B`: il callback arrow nel timeout eredita il `this` dell'istanza

</details>

### Domanda 7: variabile globale vs proprietà dell'oggetto

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
<summary>Clicca per vedere la risposta</summary>

```javascript
// undefined
```

**Spiegazione:**

La chiave è la differenza tra **variabili globali** e **proprietà dell'oggetto**.

1. `this` in `obj.a()` punta a `obj`
2. `name = 'john'` (senza dichiarazione) aggiorna la variabile globale
3. `this.name` legge `obj.name`
4. `obj` non ha una proprietà `name`, quindi è `undefined`

**Flusso di esecuzione:**

```javascript
// iniziale
window.name = 'jjjj';
obj = {
  a: function () {
    /* ... */
  },
  // obj non ha proprietà name
};

obj.a();
  ↓
window.name = 'john'; // valore globale cambiato
this.name; // equivale a obj.name
obj.name; // undefined
```

Se vuoi `'john'`, assegna tramite `this.name = 'john'`.

```javascript
var obj = {
  a: function () {
    this.name = 'john';
    console.log(this.name); // 'john'
  },
};

obj.a();
console.log(obj.name); // 'john'
```

</details>

### Domanda 8: trappola della variabile globale (estesa)

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified';
    console.log('1:', name); // variabile globale
    console.log('2:', this.name); // proprietà dell'oggetto
  },
};

obj.a();
console.log('3:', name); // variabile globale
console.log('4:', obj.name); // proprietà dell'oggetto
```

<details>
<summary>Clicca per vedere la risposta</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**Punto chiave:**

- `name` senza `this.` -> variabile globale
- `this.name` -> proprietà dell'oggetto
- Sono valori diversi

</details>

## 4. Come preservare `this` nei callback?

> Come preservare `this` dentro le funzioni callback?

### Metodo 1: arrow function

```javascript
const obj = {
  name: 'Object',

  method: function () {
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Metodo 2: `bind()`

```javascript
const obj = {
  name: 'Object',

  method: function () {
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

### Metodo 3: salvare `this` in una variabile (pattern legacy)

```javascript
const obj = {
  name: 'Object',

  method: function () {
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Metodo 4: `call()` / `apply()`

```javascript
function greet() {
  console.log(`Ciao, sono ${this.name}`);
}

const person1 = { name: 'John' };
const person2 = { name: 'Jane' };

greet.call(person1); // "Ciao, sono John"
greet.apply(person2); // "Ciao, sono Jane"
```

## 5. Insidie comuni di `this`

> Insidie comuni di `this`

### Insidia 1: estrazione del metodo dell'oggetto

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ this perso

const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### Insidia 2: `this` nei listener di eventi

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ la arrow function qui non si lega al button
  handleClick1: () => {
    console.log(this); // window/scope lessicale globale
  },

  // ✅ la funzione regolare nel listener ottiene l'event target come this
  handleClick2: function () {
    console.log(this); // elemento button
  },

  // ✅ usa un wrapper arrow quando serve il this dell'oggetto dentro il callback
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### Insidia 3: callback nei metodi degli array

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ il callback regolare perde this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item);
    });
  },

  // ✅ il callback arrow mantiene il this lessicale
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item);
    });
  },

  // ✅ usa thisArg
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item);
    }, this);
  },
};
```

## 6. Riepilogo delle regole di binding di `this`

> Riepilogo delle regole di binding di `this`

### Priorità (alta -> bassa)

```javascript
// 1. new binding (più alta)
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. binding esplicito (call/apply/bind)
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. binding implicito (metodo dell'oggetto)
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. binding predefinito (più bassa)
greet(); // undefined (strict) o nome globale (non-strict)
```

### Funzione vs Arrow Function

| Caratteristica | Funzione | Arrow Function |
| --- | --- | --- |
| Ha il proprio `this` | ✅ Sì | ❌ No |
| `this` determinato da | Sito di chiamata | Scope lessicale di definizione |
| `call`/`apply`/`bind` possono cambiare `this` | ✅ Sì | ❌ No |
| Può essere costruttore | ✅ Sì | ❌ No |
| Ha `arguments` | ✅ Sì | ❌ No |
| Migliore per | Metodi di oggetti, costruttori | Callback, `this` esterno ereditato |

### Frase mnemonica

> **"Arrow eredita, function dipende dalla chiamata."**
>
> - Arrow function: `this` è ereditato dallo scope lessicale esterno
> - Funzione regolare: `this` è deciso a runtime dal sito di chiamata

## 7. Best practice

> Best practice

### ✅ Raccomandato

```javascript
// 1. Usa funzione regolare o abbreviazione di metodo per i metodi degli oggetti
const obj = {
  name: 'Object',

  // ✅ buono
  greet: function () {
    console.log(this.name);
  },

  // ✅ buono
  introduce() {
    console.log(this.name);
  },
};

// 2. Usa arrow function per i callback che dovrebbero mantenere il this esterno
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. Usa funzione regolare quando serve un this dinamico
const button = {
  label: 'Cliccami',

  handleClick: function () {
    console.log(this); // event target / oggetto ricevente
  },
};
```

### ❌ Non raccomandato

```javascript
// 1. Evita arrow function come metodi degli oggetti
const obj = {
  name: 'Object',

  greet: () => {
    console.log(this.name); // undefined nella maggior parte dei casi
  },
};

// 2. Evita arrow function come costruttore
const Person = (name) => {
  this.name = name; // sbagliato
};

// 3. Evita arrow quando serve l'oggetto arguments
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Riferimenti

- [MDN - this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
