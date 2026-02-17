---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> Qu'est-ce qu'une Closure ?

Pour comprendre les closures, il faut d'abord comprendre la portée des variables en JavaScript et comment les fonctions accèdent aux variables externes.

### Variable Scope (Portée des variables)

En JavaScript, la portée des variables se divise en deux types : global scope et function scope.

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
console.log(b, c); // Erreur générée, impossible d'accéder aux variables dans le function scope
```

### Closure example

La condition de déclenchement d'une Closure est qu'une fonction enfant soit définie à l'intérieur d'une fonction parent et retournée via return, permettant de conserver les variables d'environnement de la fonction enfant (ce qui évite le `Garbage Collection`).

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`Compteur actuel : ${count}`);
  };
}

const counter = parentFunction();

counter(); // print Compteur actuel : 1
counter(); // print Compteur actuel : 2
// La variable count n'est pas récupérée par le garbage collector, car childFunction existe toujours et met à jour la valeur de count à chaque appel
```

Cependant, il faut noter que les closures conservent les variables en mémoire. Si les variables sont trop nombreuses, cela peut entraîner une utilisation excessive de la mémoire (il ne faut pas abuser des closures), affectant ainsi les performances.

## 2. Create a function that meets the following conditions

> Créez une fonction qui remplit les conditions suivantes (en utilisant le concept de closure)

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

On sépare le traitement en deux fonctions

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

Bien sûr, la première solution a de fortes chances d'être rejetée, il faut donc essayer de tout combiner dans une seule fonction.

```js
function plus(value, subValue) {
  // On détermine en fonction du nombre de paramètres passés
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

> Utilisez la caractéristique de closure pour incrémenter un nombre

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

Ici, on n'utilise pas les Arrow Functions, mais la forme classique de function.

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

Dans la solution précédente, on peut aussi inclure directement l'objet dans le return

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

> Qu'affichera cet appel de fonctions imbriquées ?

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

**Résultat d'exécution** :

```
hello
TypeError: aa is not a function
```

### Flux d'exécution détaillé

```js
// Exécution de a(b(c))
// JavaScript exécute les fonctions de l'intérieur vers l'extérieur

// Étape 1 : Exécuter la fonction la plus interne b(c)
b(c)
  ↓
// La fonction c est passée en paramètre à b
// À l'intérieur de b, bb() est exécuté, c'est-à-dire c()
c() // Affiche 'hello'
  ↓
// La fonction b n'a pas d'instruction return
// Elle retourne donc undefined
return undefined

// Étape 2 : Exécuter a(undefined)
a(undefined)
  ↓
// undefined est passé en paramètre à a
// À l'intérieur de a, on tente d'exécuter aa()
// C'est-à-dire undefined()
undefined() // ❌ Erreur : TypeError: aa is not a function
```

### Pourquoi cela se produit-il ?

#### 1. Ordre d'exécution des fonctions (de l'intérieur vers l'extérieur)

```js
// Exemple
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. D'abord exécuter multiply(2, 3) → 6
           └────── 3. Ensuite exécuter add(6)

// Même concept
a(b(c))
  ↑ ↑
  | └─ 1. D'abord exécuter b(c)
  └─── 2. Ensuite exécuter a(résultat de b(c))
```

#### 2. Les fonctions sans return retournent undefined

```js
function b(bb) {
  bb(); // Exécuté, mais pas de return
} // return undefined implicite

// Équivalent à
function b(bb) {
  bb();
  return undefined; // Ajouté automatiquement par JavaScript
}
```

#### 3. Essayer d'appeler quelque chose qui n'est pas une fonction provoque une erreur

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// Autres cas qui provoquent des erreurs
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### Comment corriger ?

#### Méthode 1 : Faire en sorte que la fonction b retourne une fonction

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
// Sortie :
// hello
// b executed
```

#### Méthode 2 : Passer la fonction directement, sans l'exécuter d'abord

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

a(b(c)); // N'affiche que 'hello'

// Ou écrire de cette façon
a(() => b(c)); // Affiche 'hello'
```

#### Méthode 3 : Modifier la logique d'exécution

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

// Exécuter séparément
b(c); // Affiche 'hello'
a(() => console.log('a executed')); // Affiche 'a executed'
```

### Questions connexes

#### Question 1 : Que se passe-t-il si on modifie comme ceci ?

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
<summary>Cliquez pour voir la réponse</summary>

```
hello
TypeError: aa is not a function
```

**Analyse** :

1. `b(c)` → Exécute `c()`, affiche `'hello'`, retourne `'world'`
2. `a('world')` → Exécute `'world'()`... attendez, ça provoque aussi une erreur !

**Bonne réponse** :

```
hello
TypeError: aa is not a function
```

Parce que `b(c)` retourne `'world'` (une chaîne), `a('world')` tente d'exécuter `'world'()`, une chaîne n'est pas une fonction, d'où l'erreur.

</details>

#### Question 2 : Et si tous ont un return ?

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
<summary>Cliquez pour voir la réponse</summary>

```
[Function: c]
hello
```

**Analyse** :

1. `b(c)` → Retourne la fonction `c` elle-même (sans l'exécuter)
2. `a(c)` → Retourne la fonction `c` elle-même
3. `result` est la fonction `c`
4. `result()` → Exécute `c()`, retourne `'hello'`

</details>

### Points clés à retenir

```javascript
// Priorité des appels de fonctions
a(b(c))
  ↓
// 1. D'abord exécuter la plus interne
b(c) // Si b n'a pas de return, c'est undefined
  ↓
// 2. Ensuite exécuter l'externe
a(undefined) // Tenter d'exécuter undefined() provoque une erreur

// Solutions
// ✅ 1. S'assurer que les fonctions intermédiaires retournent une fonction
// ✅ 2. Ou utiliser des arrow functions pour encapsuler
a(() => b(c))
```

## Reference

- [Closures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [Day6 [JavaScript Fondamentaux] Mécanisme de ramasse-miettes](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - Gestion de la mémoire en JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [MDN - Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Functions)
- [MDN - TypeError](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
