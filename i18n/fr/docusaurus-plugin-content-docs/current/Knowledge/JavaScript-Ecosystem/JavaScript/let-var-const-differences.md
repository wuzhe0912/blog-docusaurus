---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Vue d'ensemble

En JavaScript, il existe trois mots-cles pour declarer des variables : `var`, `let` et `const`. Bien qu'ils servent tous a declarer des variables, ils different en termes de portee, d'initialisation, de redeclaration, de reassignation et de moment d'acces.

## Principales differences

| Comportement            | `var`                          | `let`                | `const`              |
| ----------------------- | ------------------------------ | -------------------- | -------------------- |
| Portee                  | Fonction ou globale            | Bloc                 | Bloc                 |
| Initialisation          | Optionnelle                    | Optionnelle          | Obligatoire          |
| Redeclaration           | Autorisee                      | Non autorisee        | Non autorisee        |
| Reassignation           | Autorisee                      | Autorisee            | Non autorisee        |
| Acces avant declaration | Retourne undefined             | Lance ReferenceError | Lance ReferenceError |

## Explication detaillee

### Portee

La portee de `var` est la fonction ou la portee globale, tandis que `let` et `const` ont une portee de bloc (y compris les fonctions, les blocs if-else ou les boucles for).

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

### Initialisation

`var` et `let` peuvent etre declares sans initialisation, tandis que `const` doit etre initialise au moment de la declaration.

```javascript
var varVariable;  // Valide
let letVariable;  // Valide
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### Redeclaration

Dans la meme portee, `var` permet la redeclaration de la meme variable, tandis que `let` et `const` ne le permettent pas.

```javascript
var x = 1;
var x = 2; // Valide, x vaut maintenant 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Reassignation

Les variables declarees avec `var` et `let` peuvent etre reassignees, mais celles declarees avec `const` ne le peuvent pas.

```javascript
var x = 1;
x = 2; // Valide

let y = 1;
y = 2; // Valide

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Remarque : Bien qu'une variable declaree avec `const` ne puisse pas etre reassignee, si c'est un objet ou un tableau, son contenu peut toujours etre modifie.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // Valide
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // Valide
console.log(arr); // [1, 2, 3, 4]
```

### Acces avant la declaration (Temporal Dead Zone)

Les variables declarees avec `var` sont remontees et automatiquement initialisees a `undefined`. Les variables declarees avec `let` et `const` sont egalement remontees, mais pas initialisees. Y acceder avant la declaration lance un `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Questions d'entretien

### Question : Le piege classique de setTimeout + var

Determinez le resultat de sortie du code suivant :

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Mauvaise reponse (malentendu courant)

Beaucoup pensent que la sortie est : `1 2 3 4 5`

#### Sortie reelle

```
6
6
6
6
6
```

#### Pourquoi ?

Ce probleme implique trois concepts fondamentaux :

**1. La portee de fonction de var**

```javascript
// var ne cree pas de portee de bloc dans la boucle
for (var i = 1; i <= 5; i++) {
  // i est dans la portee externe, toutes les iterations partagent le meme i
}
console.log(i); // 6 (valeur de i apres la fin de la boucle)

// Dans le cas de var
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // boucle terminee
}
```

**2. L'execution asynchrone de setTimeout**

```javascript
// setTimeout est asynchrone, il s'execute apres la fin du code synchrone actuel
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Ce code est place dans la file d'attente du Event Loop
    console.log(i);
  }, 0);
}
// La boucle s'execute d'abord completement (i devient 6), puis les callbacks de setTimeout commencent a s'executer
```

**3. Reference du Closure**

```javascript
// Toutes les fonctions callback de setTimeout referencent le meme i
// Quand les callbacks s'executent, i est deja devenu 6
```

#### Solutions

**Solution 1 : Utiliser let (recommande) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// Sortie : 1 2 3 4 5

// Dans le cas de let
{
  let i = 1; // i de la premiere iteration
}
{
  let i = 2; // i de la deuxieme iteration
}
{
  let i = 3; // i de la troisieme iteration
}
```

**Principe** : `let` cree une nouvelle portee de bloc a chaque iteration, et chaque callback `setTimeout` capture la valeur de `i` de l'iteration en cours.

```javascript
// Equivalent a
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
// ... et ainsi de suite
```

**Solution 2 : Utiliser une IIFE (Expression de Fonction Immediatement Invoquee)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// Sortie : 1 2 3 4 5
```

**Principe** : L'IIFE cree une nouvelle portee de fonction, et a chaque iteration, la valeur actuelle de `i` est passee en tant que parametre `j`, formant un Closure.

**Solution 3 : Utiliser le troisieme parametre de setTimeout**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // Le troisieme parametre est passe a la fonction callback
}
// Sortie : 1 2 3 4 5
```

**Principe** : Le troisieme parametre et les suivants de `setTimeout` sont passes comme arguments a la fonction callback.

**Solution 4 : Utiliser bind**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// Sortie : 1 2 3 4 5
```

**Principe** : `bind` cree une nouvelle fonction et lie la valeur actuelle de `i` en tant que parametre.

#### Comparaison des solutions

| Solution            | Avantages                        | Inconvenients          | Recommandation           |
| ------------------- | -------------------------------- | ---------------------- | ------------------------ |
| `let`               | Concis, moderne, comprehensible  | ES6+                   | 5/5 Fortement recommande |
| IIFE                | Bonne compatibilite              | Syntaxe complexe       | 3/5 A considerer         |
| Parametre setTimeout | Simple et direct                | Peu connu              | 4/5 Recommande           |
| `bind`              | Style fonctionnel                | Lisibilite un peu moindre | 3/5 A considerer      |

#### Questions supplementaires

**Q1 : Que se passe-t-il avec cette modification ?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Reponse** : `6` est affiche une fois par seconde, au total 5 fois (respectivement a 1, 2, 3, 4 et 5 secondes).

**Q2 : Comment afficher sequentiellement 1, 2, 3, 4, 5 chaque seconde ?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// Apres 1 seconde : 1
// Apres 2 secondes : 2
// Apres 3 secondes : 3
// Apres 4 secondes : 4
// Apres 5 secondes : 5
```

#### Points cles en entretien

Cette question evalue :

1. **Portee de var** : Portee de fonction vs portee de bloc
2. **Event Loop** : Execution synchrone vs asynchrone
3. **Closure** : Comment les fonctions capturent les variables externes
4. **Solutions** : Plusieurs approches avec leurs avantages et inconvenients

Lors de la reponse, il est recommande de :

- D'abord donner la bonne reponse (6 6 6 6 6)
- Expliquer la raison (portee de var + setTimeout asynchrone)
- Fournir des solutions (preferer let et expliquer les autres options)
- Demontrer sa comprehension des mecanismes internes de JavaScript

## Bonnes pratiques

1. Privilegier `const` : Pour les variables qui n'ont pas besoin d'etre reassignees, `const` ameliore la lisibilite et la maintenabilite du code.
2. Ensuite utiliser `let` : Quand une reassignation est necessaire, utiliser `let`.
3. Eviter `var` : Etant donne que la portee et le comportement de Hoisting de `var` peuvent causer des problemes inattendus, il est recommande de l'eviter dans le developpement JavaScript moderne.
4. Attention a la compatibilite des navigateurs : Si le support de navigateurs anciens est necessaire, des outils comme Babel peuvent transpiler `let` et `const` en `var`.

## Sujets connexes

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
