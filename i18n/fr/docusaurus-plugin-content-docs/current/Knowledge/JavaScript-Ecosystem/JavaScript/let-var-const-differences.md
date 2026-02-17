---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Vue d'ensemble

En JavaScript, il existe trois mots-clés pour déclarer des variables : `var`, `let` et `const`. Bien qu'ils servent tous à déclarer des variables, ils diffèrent en termes de portée, d'initialisation, de redéclaration, de réassignation et de moment d'accès.

## Principales différences

| Comportement            | `var`                          | `let`                | `const`              |
| ----------------------- | ------------------------------ | -------------------- | -------------------- |
| Portée                  | Fonction ou globale            | Bloc                 | Bloc                 |
| Initialisation          | Optionnelle                    | Optionnelle          | Obligatoire          |
| Redéclaration           | Autorisée                      | Non autorisée        | Non autorisée        |
| Réassignation           | Autorisée                      | Autorisée            | Non autorisée        |
| Accès avant déclaration | Retourne undefined             | Lance ReferenceError | Lance ReferenceError |

## Explication détaillée

### Portée

La portée de `var` est la fonction ou la portée globale, tandis que `let` et `const` ont une portée de bloc (y compris les fonctions, les blocs if-else ou les boucles for).

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

`var` et `let` peuvent être déclarés sans initialisation, tandis que `const` doit être initialisé au moment de la déclaration.

```javascript
var varVariable;  // Valide
let letVariable;  // Valide
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### Redéclaration

Dans la même portée, `var` permet la redéclaration de la même variable, tandis que `let` et `const` ne le permettent pas.

```javascript
var x = 1;
var x = 2; // Valide, x vaut maintenant 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Réassignation

Les variables déclarées avec `var` et `let` peuvent être réassignées, mais celles déclarées avec `const` ne le peuvent pas.

```javascript
var x = 1;
x = 2; // Valide

let y = 1;
y = 2; // Valide

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Remarque : Bien qu'une variable déclarée avec `const` ne puisse pas être réassignée, si c'est un objet ou un tableau, son contenu peut toujours être modifié.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // Valide
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // Valide
console.log(arr); // [1, 2, 3, 4]
```

### Accès avant la déclaration (Temporal Dead Zone)

Les variables déclarées avec `var` sont remontées et automatiquement initialisées à `undefined`. Les variables déclarées avec `let` et `const` sont également remontées, mais pas initialisées. Y accéder avant la déclaration lance un `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Questions d'entretien

### Question : Le piège classique de setTimeout + var

Déterminez le résultat de sortie du code suivant :

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Mauvaise réponse (malentendu courant)

Beaucoup pensent que la sortie est : `1 2 3 4 5`

#### Sortie réelle

```
6
6
6
6
6
```

#### Pourquoi ?

Ce problème implique trois concepts fondamentaux :

**1. La portée de fonction de var**

```javascript
// var ne crée pas de portée de bloc dans la boucle
for (var i = 1; i <= 5; i++) {
  // i est dans la portée externe, toutes les itérations partagent le même i
}
console.log(i); // 6 (valeur de i après la fin de la boucle)

// Dans le cas de var
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // boucle terminée
}
```

**2. L'exécution asynchrone de setTimeout**

```javascript
// setTimeout est asynchrone, il s'exécute après la fin du code synchrone actuel
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Ce code est placé dans la file d'attente du Event Loop
    console.log(i);
  }, 0);
}
// La boucle s'exécute d'abord complètement (i devient 6), puis les callbacks de setTimeout commencent à s'exécuter
```

**3. Référence du Closure**

```javascript
// Toutes les fonctions callback de setTimeout référencent le même i
// Quand les callbacks s'exécutent, i est déjà devenu 6
```

#### Solutions

**Solution 1 : Utiliser let (recommandé) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// Sortie : 1 2 3 4 5

// Dans le cas de let
{
  let i = 1; // i de la première itération
}
{
  let i = 2; // i de la deuxième itération
}
{
  let i = 3; // i de la troisième itération
}
```

**Principe** : `let` crée une nouvelle portée de bloc à chaque itération, et chaque callback `setTimeout` capture la valeur de `i` de l'itération en cours.

```javascript
// Équivalent à
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

**Solution 2 : Utiliser une IIFE (Expression de Fonction Immédiatement Invoquée)**

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

**Principe** : L'IIFE crée une nouvelle portée de fonction, et à chaque itération, la valeur actuelle de `i` est passée en tant que paramètre `j`, formant un Closure.

**Solution 3 : Utiliser le troisième paramètre de setTimeout**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // Le troisième paramètre est passé à la fonction callback
}
// Sortie : 1 2 3 4 5
```

**Principe** : Le troisième paramètre et les suivants de `setTimeout` sont passés comme arguments à la fonction callback.

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

**Principe** : `bind` crée une nouvelle fonction et lie la valeur actuelle de `i` en tant que paramètre.

#### Comparaison des solutions

| Solution            | Avantages                        | Inconvénients          | Recommandation           |
| ------------------- | -------------------------------- | ---------------------- | ------------------------ |
| `let`               | Concis, moderne, compréhensible  | ES6+                   | 5/5 Fortement recommandé |
| IIFE                | Bonne compatibilité              | Syntaxe complexe       | 3/5 À considérer         |
| Paramètre setTimeout | Simple et direct                | Peu connu              | 4/5 Recommandé           |
| `bind`              | Style fonctionnel                | Lisibilité un peu moindre | 3/5 À considérer      |

#### Questions supplémentaires

**Q1 : Que se passe-t-il avec cette modification ?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Réponse** : `6` est affiché une fois par seconde, au total 5 fois (respectivement à 1, 2, 3, 4 et 5 secondes).

**Q2 : Comment afficher séquentiellement 1, 2, 3, 4, 5 chaque seconde ?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// Après 1 seconde : 1
// Après 2 secondes : 2
// Après 3 secondes : 3
// Après 4 secondes : 4
// Après 5 secondes : 5
```

#### Points clés en entretien

Cette question évalue :

1. **Portée de var** : Portée de fonction vs portée de bloc
2. **Event Loop** : Exécution synchrone vs asynchrone
3. **Closure** : Comment les fonctions capturent les variables externes
4. **Solutions** : Plusieurs approches avec leurs avantages et inconvénients

Lors de la réponse, il est recommandé de :

- D'abord donner la bonne réponse (6 6 6 6 6)
- Expliquer la raison (portée de var + setTimeout asynchrone)
- Fournir des solutions (préférer let et expliquer les autres options)
- Démontrer sa compréhension des mécanismes internes de JavaScript

## Bonnes pratiques

1. Privilégier `const` : Pour les variables qui n'ont pas besoin d'être réassignées, `const` améliore la lisibilité et la maintenabilité du code.
2. Ensuite utiliser `let` : Quand une réassignation est nécessaire, utiliser `let`.
3. Éviter `var` : Étant donné que la portée et le comportement de Hoisting de `var` peuvent causer des problèmes inattendus, il est recommandé de l'éviter dans le développement JavaScript moderne.
4. Attention à la compatibilité des navigateurs : Si le support de navigateurs anciens est nécessaire, des outils comme Babel peuvent transpiler `let` et `const` en `var`.

## Sujets connexes

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
