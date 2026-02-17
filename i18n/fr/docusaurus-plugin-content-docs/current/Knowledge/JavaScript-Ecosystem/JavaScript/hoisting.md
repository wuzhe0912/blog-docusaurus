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
// 提升後的順序
function foo() {} // 函式先提升並賦值
var foo; // 變數聲明提升，但不會覆蓋已存在的函式

// 因此 foo 是函式
console.log(foo); // [Function: foo]
```

### Flux d'exécution complet

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
[Function: foo] // 第一次輸出
'1' // 第二次輸出
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
[Function: foo] { return 2; } // 第一次輸出（後面的函式覆蓋前面的）
'1' // 第二次輸出（變數賦值覆蓋函式）
```

**Raison :**

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
undefined; // foo 是 undefined
[Function: bar] // bar 是函式
```

**Raison :**

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

**Différence clé :**

- **Déclaration de fonction** : `function foo() {}` → remontée complète (y compris le corps de la fonction)
- **Expression de fonction** : `var foo = function() {}` → seul le nom de la variable est remonté, le corps de la fonction ne l'est pas

### let/const n'ont pas ce problème

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
