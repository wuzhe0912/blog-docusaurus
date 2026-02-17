---
id: this-binding
title: '[Medium] 📄 this Binding'
slug: /this-binding
tags: [JavaScript, Quiz, Medium]
---

## 1. What is `this` in JavaScript?

> Qu'est-ce que `this` en JavaScript ?

`this` est un mot-clé en JavaScript qui pointe vers l'objet de contexte dans lequel une fonction est exécutée. La valeur de `this` dépend de **la manière dont la fonction est appelée**, et non de l'endroit où elle est définie.

### Règles de binding de `this`

Il existe quatre règles de binding pour `this` en JavaScript (par ordre de priorité décroissante) :

1. **Binding new** : Appeler une fonction constructeur avec le mot-clé `new`
2. **Binding explicite** : Spécifier explicitement `this` avec `call`, `apply`, `bind`
3. **Binding implicite** : Appeler comme méthode d'un objet
4. **Binding par défaut** : Comportement par défaut dans les autres cas

## 2. Please explain the difference of `this` in different contexts

> Veuillez expliquer la différence de `this` dans différents contextes

### 1. `this` dans l'environnement global

```javascript
console.log(this); // Navigateur : window, Node.js : global

function globalFunction() {
  console.log(this); // Mode non strict : window/global, mode strict : undefined
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

### 2. `this` dans les fonctions régulières (Function)

Le `this` d'une fonction régulière dépend de **la manière dont elle est appelée** :

```javascript
function regularFunction() {
  console.log(this);
}

// Appel direct : this pointe vers l'objet global (mode non strict) ou undefined (mode strict)
regularFunction(); // window (mode non strict) ou undefined (mode strict)

// Appel comme méthode d'objet : this pointe vers cet objet
const obj = {
  method: regularFunction,
};
obj.method(); // obj

// Avec call/apply/bind : this pointe vers l'objet spécifié
const customObj = { name: 'Custom' };
regularFunction.call(customObj); // customObj
```

### 3. `this` dans les Arrow Functions

**Les Arrow Functions n'ont pas leur propre `this`**. Elles **héritent du `this` de la portée englobante** (portée lexicale).

```javascript
const obj = {
  name: 'Object',

  // Fonction régulière
  regularMethod: function () {
    console.log('regularMethod this:', this); // obj

    // Fonction régulière interne : this change
    function innerRegular() {
      console.log('innerRegular this:', this); // window/undefined
    }
    innerRegular();

    // Arrow Function interne : this est hérité de l'extérieur
    const innerArrow = () => {
      console.log('innerArrow this:', this); // obj
    };
    innerArrow();
  },

  // Arrow Function
  arrowMethod: () => {
    console.log('arrowMethod this:', this); // window (hérité du global)
  },
};

obj.regularMethod();
obj.arrowMethod();
```

### 4. `this` dans les méthodes d'objet

```javascript
const person = {
  name: 'John',
  age: 30,

  // Fonction régulière : this pointe vers person
  greet: function () {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm John"
  },

  // Méthode abrégée ES6 : this pointe vers person
  introduce() {
    console.log(`I'm ${this.name}, ${this.age} years old`);
  },

  // Arrow Function : this hérite de l'extérieur (ici le global)
  arrowGreet: () => {
    console.log(`Hello, I'm ${this.name}`); // "Hello, I'm undefined"
  },
};

person.greet(); // "Hello, I'm John"
person.introduce(); // "I'm John, 30 years old"
person.arrowGreet(); // "Hello, I'm undefined"
```

### 5. `this` dans les fonctions constructeurs

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

### 6. `this` dans les classes

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  // Méthode régulière : this pointe vers l'instance
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }

  // Propriété Arrow Function : this est lié à l'instance
  arrowGreet = () => {
    console.log(`Hi, I'm ${this.name}`);
  };
}

const john = new Person('John');
john.greet(); // "Hello, I'm John"

// Assigner la méthode à une variable perd le binding de this
const greet = john.greet;
greet(); // Erreur : Cannot read property 'name' of undefined

// La propriété Arrow Function ne perd pas le binding de this
const arrowGreet = john.arrowGreet;
arrowGreet(); // "Hi, I'm John"
```

## 3. Quiz: What will be printed?

> Quiz : Qu'est-ce que le code suivant affichera ?

### Question 1 : Méthodes d'objet et Arrow Functions

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
<summary>Cliquez pour voir la réponse</summary>

```javascript
// A: Object
// B: undefined
```

**Explication** :
- `regularFunc` est une fonction régulière, appelée via `obj.regularFunc()`, `this` pointe vers `obj`, donc elle affiche `"A: Object"`
- `arrowFunc` est une Arrow Function, elle n'a pas son propre `this`, elle hérite du `this` extérieur (global). Il n'y a pas de propriété `name` dans le global, donc elle affiche `"B: undefined"`

</details>

### Question 2 : Fonction passée en argument

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
<summary>Cliquez pour voir la réponse</summary>

```javascript
// 1: "Hello, John"
// 2: "Hello, undefined" ou erreur (mode strict)
// 3: "Hello, undefined" ou erreur (mode strict)
```

**Explication** :
1. `person.greet()` - Appelée via l'objet, `this` pointe vers `person`
2. `greet()` - Après avoir assigné la méthode à une variable et l'avoir appelée directement, `this` est perdu, pointe vers global ou `undefined`
3. `setTimeout(person.greet, 1000)` - La méthode est passée comme callback, `this` est perdu

</details>

### Question 3 : Fonctions imbriquées

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
<summary>Cliquez pour voir la réponse</summary>

```javascript
// A: Outer
// B: undefined
// C: Outer
```

**Explication** :
- `A` - `method` est appelée via `obj`, `this` pointe vers `obj`
- `B` - `inner` est une fonction régulière, appelée directement, `this` pointe vers global ou `undefined`
- `C` - `arrow` est une Arrow Function, hérite du `this` de `method` extérieur, pointe vers `obj`

</details>

### Question 4 : setTimeout et Arrow Functions

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
<summary>Cliquez pour voir la réponse</summary>

```javascript
// A: undefined
// B: Object
```

**Explication** :
- `A` - Le callback de `setTimeout` est une fonction régulière, à l'exécution `this` pointe vers le global
- `B` - Le callback de `setTimeout` est une Arrow Function, hérite du `this` de `method2` extérieur, pointe vers `obj`

</details>

### Question 5 : Binding complexe de this

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
console.log('B:', getThis() === window); // En supposant un environnement navigateur

obj2.getThis = obj1.getThis;
console.log('C:', obj2.getThis().name);

const boundGetThis = obj1.getThis.bind(obj2);
console.log('D:', boundGetThis().name);
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
// A: obj1
// B: true
// C: obj2
// D: obj2
```

**Explication** :
- `A` - Appelée via `obj1`, `this` pointe vers `obj1`
- `B` - Appel direct, `this` pointe vers global (window)
- `C` - Appelée via `obj2`, `this` pointe vers `obj2`
- `D` - Utilisation de `bind` pour lier `this` à `obj2`

</details>

### Question 6 : Fonction constructeur et prototype

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
<summary>Cliquez pour voir la réponse</summary>

```javascript
// A: undefined
// B: John
```

**Explication** :
- `A` - Callback de fonction régulière de `setTimeout`, `this` pointe vers le global
- `B` - Callback Arrow Function de `setTimeout`, hérite du `this` de `arrowDelayedGreet` extérieur, pointe vers `john`

</details>

### Question 7 : Variable globale vs propriété d'objet

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
<summary>Cliquez pour voir la réponse</summary>

```javascript
// undefined
```

**Explication** :

La clé de cette question réside dans la compréhension de la différence entre les **variables globales** et les **propriétés d'objet** :

1. **Vers quoi pointe `this` dans `obj.a()`** :
   - Appelée via `obj.a()`, `this` pointe vers `obj`

2. **`name = 'john'` modifie la variable globale** :
   ```javascript
   name = 'john'; // Sans var/let/const, modifie le name global
   // Équivaut à
   window.name = 'john'; // Environnement navigateur
   ```

3. **`this.name` accède à la propriété de l'objet** :
   ```javascript
   console.log(this.name); // Équivaut à console.log(obj.name)
   ```

4. **L'objet `obj` n'a pas de propriété `name`** :
   ```javascript
   obj.name; // undefined (name n'est pas défini dans l'objet obj)
   ```

**Processus d'exécution complet** :

```javascript
// État initial
window.name = 'jjjj'; // Variable globale
obj = {
  a: function () { /* ... */ },
  // Note : obj n'a pas de propriété name !
};

// Exécution de obj.a()
obj.a();
  ↓
// 1. name = 'john' → Modifie le window.name global
window.name = 'john'; // ✅ Variable globale modifiée

// 2. this.name → Accède à obj.name
this.name; // Équivaut à obj.name
obj.name; // undefined (obj n'a pas de propriété name)
```

**Malentendus courants** :

Beaucoup pensent que `'john'` sera affiché, parce que :
- ❌ Ils croient à tort que `name = 'john'` ajoutera une propriété à `obj`
- ❌ Ils croient à tort que `this.name` accédera à la variable globale

**Compréhension correcte** :
- ✅ `name = 'john'` ne modifie que la variable globale, n'affecte pas `obj`
- ✅ `this.name` accède à `obj.name`, pas au `name` global

**Pour afficher `'john'`, il faudrait écrire ainsi** :

```javascript
var obj = {
  a: function () {
    this.name = 'john'; // ✅ Ajoute une propriété name à obj
    console.log(this.name); // 'john'
  },
};

obj.a(); // Affiche 'john'
console.log(obj.name); // 'john'
```

</details>

### Question 8 : Piège des variables globales (extension)

```javascript
var name = 'global';

var obj = {
  name: 'object',
  a: function () {
    name = 'modified'; // Note : sans var/let/const
    console.log('1:', name); // Accède à la variable globale
    console.log('2:', this.name); // Accède à la propriété de l'objet
  },
};

obj.a();
console.log('3:', name); // Variable globale
console.log('4:', obj.name); // Propriété de l'objet
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
// 1: modified
// 2: object
// 3: modified
// 4: object
```

**Explication** :

```javascript
// État initial
window.name = 'global'; // Variable globale
obj.name = 'object'; // Propriété de l'objet

// Exécution de obj.a()
name = 'modified'; // Modifie le window.name global

console.log('1:', name); // Accès global : 'modified'
console.log('2:', this.name); // Accès à obj.name : 'object'

// Après l'exécution
console.log('3:', name); // Global : 'modified'
console.log('4:', obj.name); // Objet : 'object' (non modifié)
```

**Concepts clés** :
- `name` (sans `this.`) → Accède à la variable globale
- `this.name` (avec `this.`) → Accède à la propriété de l'objet
- Les deux sont des **variables complètement différentes** !

</details>

## 4. How to preserve `this` in callbacks?

> Comment préserver `this` dans les fonctions callback ?

### Méthode 1 : Utiliser les Arrow Functions

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ L'Arrow Function hérite du this extérieur
    setTimeout(() => {
      console.log(this.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Méthode 2 : Utiliser `bind()`

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ bind lie this
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

### Méthode 3 : Sauvegarder `this` dans une variable (ancienne méthode)

```javascript
const obj = {
  name: 'Object',

  method: function () {
    // ✅ Sauvegarder this dans une variable
    const self = this;
    setTimeout(function () {
      console.log(self.name); // "Object"
    }, 1000);
  },
};

obj.method();
```

### Méthode 4 : Utiliser `call()` ou `apply()`

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

> Pièges courants de `this`

### Piège 1 : Assigner une méthode d'objet à une variable

```javascript
const obj = {
  name: 'Object',
  greet: function () {
    console.log(this.name);
  },
};

obj.greet(); // ✅ "Object"

const greet = obj.greet;
greet(); // ❌ undefined (this est perdu)

// Solution : utiliser bind
const boundGreet = obj.greet.bind(obj);
boundGreet(); // ✅ "Object"
```

### Piège 2 : `this` dans les écouteurs d'événements

```javascript
const button = document.querySelector('button');

const obj = {
  name: 'Object',

  // ❌ Arrow Function : this ne pointe pas vers button
  handleClick1: () => {
    console.log(this); // window
  },

  // ✅ Fonction régulière : this pointe vers l'élément qui a déclenché l'événement
  handleClick2: function () {
    console.log(this); // élément button
  },

  // ✅ Si vous avez besoin d'accéder au this de l'objet, enveloppez avec une Arrow Function
  handleClick3: function () {
    button.addEventListener('click', () => {
      console.log(this.name); // "Object"
    });
  },
};
```

### Piège 3 : Callbacks dans les méthodes de tableaux

```javascript
const obj = {
  name: 'Object',
  items: [1, 2, 3],

  // ❌ Le callback de fonction régulière perd this
  processItems1: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // undefined 1, undefined 2, undefined 3
    });
  },

  // ✅ Le callback Arrow Function préserve this
  processItems2: function () {
    this.items.forEach((item) => {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    });
  },

  // ✅ Utiliser le paramètre thisArg de forEach
  processItems3: function () {
    this.items.forEach(function (item) {
      console.log(this.name, item); // "Object" 1, "Object" 2, "Object" 3
    }, this); // Le deuxième paramètre spécifie this
  },
};
```

## 6. `this` binding rules summary

> Résumé des règles de binding de `this`

### Priorité (de la plus haute à la plus basse)

```javascript
// 1. Binding new (priorité la plus haute)
function Person(name) {
  this.name = name;
}
const john = new Person('John');
console.log(john.name); // "John"

// 2. Binding explicite (call/apply/bind)
function greet() {
  console.log(this.name);
}
const obj = { name: 'Object' };
greet.call(obj); // "Object"

// 3. Binding implicite (méthode d'objet)
const obj2 = {
  name: 'Object2',
  greet: greet,
};
obj2.greet(); // "Object2"

// 4. Binding par défaut (priorité la plus basse)
greet(); // undefined (mode strict) ou window.name
```

### Tableau comparatif : Function vs Arrow Function

| Caractéristique | Function | Arrow Function |
| --- | --- | --- |
| A son propre `this` | ✅ Oui | ❌ Non |
| `this` dépend de | La manière d'appeler | L'endroit de définition (portée lexicale) |
| Peut changer `this` avec `call`/`apply`/`bind` | ✅ Oui | ❌ Non |
| Peut servir de constructeur | ✅ Oui | ❌ Non |
| A l'objet `arguments` | ✅ Oui | ❌ Non |
| Adaptée pour | Méthodes d'objet, constructeurs | Callbacks, quand il faut hériter du this extérieur |

### Moyen mnémotechnique

> **« Arrow hérite, fonction appelle »**
>
> - **Arrow Function** : `this` hérite de la portée englobante, déterminé à la définition
> - **Fonction régulière** : `this` dépend de la manière d'appeler, déterminé à l'exécution

## 7. Best practices

> Bonnes pratiques

### ✅ Pratiques recommandées

```javascript
// 1. Utiliser des fonctions régulières ou la syntaxe abrégée ES6 pour les méthodes d'objet
const obj = {
  name: 'Object',

  // ✅ Bien : Fonction régulière
  greet: function () {
    console.log(this.name);
  },

  // ✅ Bien : Abréviation ES6
  introduce() {
    console.log(this.name);
  },
};

// 2. Utiliser des Arrow Functions pour les callbacks
class Component {
  constructor() {
    this.name = 'Component';
  }

  mount() {
    // ✅ Bien : L'Arrow Function préserve this
    setTimeout(() => {
      console.log(this.name);
    }, 1000);
  }
}

// 3. Utiliser des fonctions régulières quand un this dynamique est nécessaire
const button = {
  label: 'Click me',

  // ✅ Bien : Besoin d'accéder au this de l'élément DOM
  handleClick: function () {
    console.log(this); // élément DOM button
  },
};
```

### ❌ Pratiques non recommandées

```javascript
// 1. Ne pas utiliser d'Arrow Functions pour les méthodes d'objet
const obj = {
  name: 'Object',

  // ❌ Mauvais : this ne pointe pas vers obj
  greet: () => {
    console.log(this.name); // undefined
  },
};

// 2. Ne pas utiliser d'Arrow Functions comme constructeurs
// ❌ Mauvais : Les Arrow Functions ne peuvent pas être des constructeurs
const Person = (name) => {
  this.name = name; // Erreur !
};

// 3. Ne pas utiliser d'Arrow Functions quand on a besoin d'accéder à arguments
// ❌ Mauvais : Les Arrow Functions n'ont pas d'arguments
const sum = () => {
  console.log(arguments); // ReferenceError
};
```

## Reference

- [MDN - this](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/this)
- [MDN - Arrow Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN - Function.prototype.bind()](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [You Don't Know JS: this & Object Prototypes](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed/this%20%26%20object%20prototypes)
