---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. What's Hoisting ?

L'exécution de JS peut être décomposée en deux phases : la phase de création et la phase d'exécution :

```js
var name = 'Pitt';
console.log(name); // print Pitt
```

En raison de la caractéristique du Hoisting, le code ci-dessus doit être compris comme : d'abord la variable est déclarée, puis la valeur est assignée.

```js
// create
var name;

// execute
name = 'Pitt';
console.log(name);
```

Les fonctions diffèrent des variables : elles sont attribuées en mémoire dès la phase de création. Une déclaration de fonction se présente ainsi :

```js
getName();

function getName() {
  console.log('string'); // print string
}
```

Le code ci-dessus peut s'exécuter normalement et afficher console.log sans générer d'erreur grâce à la logique suivante : la function est d'abord remontée en haut, puis l'appel de la function est effectué.

```js
// create
function getName() {
  console.log('string');
}

// execute
getName();
```

Cependant, il faut noter que cette caractéristique de Hoisting nécessite de prêter attention à l'ordre d'écriture lors de l'utilisation d'expressions.

Lors de la phase de création, la function a la priorité la plus élevée, suivie des variables.

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
console.log(name); // print undefined，car la valeur n'a pas encore été assignée, seul le undefined par défaut est obtenu
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

name dans `whoseName()` reçoit undefined, donc la condition n'est pas remplie.

Cependant, comme il y a une autre assignation en dessous de la déclaration de fonction, même si la condition dans la function était remplie, Pitt serait finalement affiché.

---

## 3. Déclaration de fonction vs Déclaration de variable : Priorité du Hoisting

### Question : Fonction et variable portant le même nom

Déterminez le résultat de sortie du code suivant :

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### Mauvaise réponse (malentendu courant)

Beaucoup de gens pensent que :

- La sortie est `undefined` (pensant que var est remonté en premier)
- La sortie est `'1'` (pensant que l'assignation a un impact)
- Une erreur se produit (pensant que le même nom crée un conflit)

### Sortie réelle

```js
[Function: foo]
```

### Pourquoi ?

Cette question examine les **règles de priorité** du Hoisting :

**Priorité du Hoisting : Déclaration de fonction > Déclaration de variable**

```js
// Code original
console.log(foo);
var foo = '1';
function foo() {}

// Equivalent (apres Hoisting)
// Etape 1 : phase de creation (Hoisting)
function foo() {} // 1. La declaration de fonction est remontee en premier
var foo; // 2. La declaration de variable est remontee (n'ecrase pas la fonction existante)

// Etape 2 : phase d'execution
console.log(foo); // Ici, foo est une fonction, sortie [Function: foo]
foo = '1'; // 3. L'assignation de variable ecrase la fonction
```

### Concepts clés

**1. Les déclarations de fonction sont entièrement remontées**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. Les déclarations de variable avec var ne remontent que la déclaration, pas l'assignation**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. Quand une déclaration de fonction et une déclaration de variable portent le même nom**

```js
// Ordre apres Hoisting
function foo() {} // La fonction est remontee et initialisee en premier
var foo; // La declaration de variable est remontee, sans ecraser la fonction

// Donc foo est une fonction
console.log(foo); // [Function: foo]
```

### Flux d'exécution complet

```js
// Code original
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== Equivalent ========

// Phase de creation (Hoisting)
function foo() {} // 1) La declaration de fonction est entierement remontee (y compris le corps)
var foo; // 2) La declaration de variable est remontee (n'ecrase pas foo, deja fonction)

// Phase d'execution
console.log(foo); // [Function: foo] - foo est une fonction
foo = '1'; // 3) L'assignation de variable ecrase la fonction a ce moment
console.log(foo); // '1' - foo devient une chaine
```

### Exercices avancés

#### Exercice A : Influence de l'ordre

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**Réponse :**

```js
[Function: foo] // Premiere sortie
'1' // Deuxieme sortie
```

**Raison :** L'ordre du code n'affecte pas le résultat du Hoisting. La priorité de remontée reste : fonction > variable.

#### Exercice B : Plusieurs fonctions portant le même nom

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

**Réponse :**

```js
[Function: foo] { return 2; } // Premiere sortie (la fonction suivante ecrase la precedente)
'1' // Deuxieme sortie (l'assignation de variable ecrase la fonction)
```

**Raison :**

```js
// Apres Hoisting
function foo() {
  return 1;
} // Premiere fonction

function foo() {
  return 2;
} // Deuxieme fonction ecrase la premiere

var foo; // Declaration de variable (n'ecrase pas la fonction)

console.log(foo); // [Function: foo] { return 2; }
foo = '1'; // Assignation de variable (ecrase la fonction)
console.log(foo); // '1'
```

#### Exercice C : Expression de fonction vs Déclaration de fonction

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

**Réponse :**

```js
undefined; // foo vaut undefined
[Function: bar] // bar est une fonction
```

**Raison :**

```js
// Apres Hoisting
var foo; // La declaration de variable est remontee (l'expression de fonction ne remonte que le nom)
function bar() {
  return 2;
} // La declaration de fonction est entierement remontee

console.log(foo); // undefined
console.log(bar); // [Function: bar]

foo = function () {
  return 1;
}; // Assignation de l'expression de fonction
```

**Différence clé :**

- **Déclaration de fonction** : `function foo() {}` → remontée complète (y compris le corps de la fonction)
- **Expression de fonction** : `var foo = function() {}` → seul le nom de la variable est remonté, le corps de la fonction ne l'est pas

### let/const n'ont pas ce problème

```js
// ❌ var peut provoquer des problemes de Hoisting
console.log(foo); // undefined
var foo = '1';

// ✅ let/const ont une zone morte temporaire (TDZ)
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = '1';

// ✅ let/const avec le meme nom qu'une fonction provoquent une erreur
function baz() {} // SyntaxError: Identifier 'baz' has already been declared
let baz = '1';
```

### Résumé de la priorité du Hoisting

```
Priorité du Hoisting (de la plus haute à la plus basse) :

1. Déclaration de fonction (Function Declaration)
   ├─ function foo() {} ✅ remontée complète
   └─ priorité la plus élevée

2. Déclaration de variable (Variable Declaration)
   ├─ var foo ⚠️ seule la déclaration est remontée, pas l'assignation
   └─ ne remplace pas une fonction existante

3. Assignation de variable (Variable Assignment)
   ├─ foo = '1' ✅ remplace la fonction
   └─ se produit lors de la phase d'exécution

4. Expression de fonction (Function Expression)
   ├─ var foo = function() {} ⚠️ traitée comme une assignation de variable
   └─ seul le nom de variable est remonté, pas le corps de la fonction
```

### Points clés en entretien

Pour répondre à ce type de questions, il est recommandé de :

1. **Expliquer le mécanisme du Hoisting** : Divisé en phase de création et phase d'exécution
2. **Souligner la priorité** : Déclaration de fonction > Déclaration de variable
3. **Dessiner le code après Hoisting** : Montrer votre compréhension à l'intervieweur
4. **Mentionner les bonnes pratiques** : Utiliser let/const pour éviter les problèmes de Hoisting avec var

**Exemple de réponse en entretien :**

> "Cette question examine la priorité du Hoisting. En JavaScript, la déclaration de fonction a une priorité de remontée plus élevée que la déclaration de variable.
>
> Le processus d'exécution se divise en deux phases :
>
> 1. Phase de création : `function foo() {}` est entièrement remontée en haut, puis la déclaration `var foo` est remontée mais ne remplace pas la fonction existante.
> 2. Phase d'exécution : Lors de `console.log(foo)`, foo est une fonction à ce moment, donc `[Function: foo]` est affiché. Ensuite, `foo = '1'` remplace foo par une chaîne de caractères.
>
> La bonne pratique est d'utiliser `let`/`const` au lieu de `var`, et de placer les déclarations de fonction en haut pour éviter ce type de confusions."

---

## Sujets connexes

- [Différences entre var, let, const](/docs/let-var-const-differences)
