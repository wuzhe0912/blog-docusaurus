---
id: primitive-vs-reference
title: '[Medium] 📄 Primitive vs Reference Types'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Primitive Types and Reference Types?

> Que sont les types primitifs (Primitive Types) et les types de référence (Reference Types) ?

Les types de données en JavaScript se divisent en deux grandes catégories : les **types primitifs** et les **types de référence**. Ils présentent des différences fondamentales dans leur mode de stockage en mémoire et leur comportement lors du passage.

### Types primitifs (Primitive Types)

**Caractéristiques** :

- Stockés dans le **Stack (pile)**
- Lors du passage, **la valeur elle-même est copiée** (Call by Value)
- Immuables (Immutable)

**Comprennent 7 types** :

```javascript
// 1. String (chaîne de caractères)
const str = 'hello';

// 2. Number (nombre)
const num = 42;

// 3. Boolean (booléen)
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol (ES6)
const sym = Symbol('unique');

// 7. BigInt (ES2020)
const bigInt = 9007199254740991n;
```

### Types de référence (Reference Types)

**Caractéristiques** :

- Stockés dans le **Heap (tas)**
- Lors du passage, **la référence (adresse mémoire) est copiée** (Call by Reference)
- Mutables (Mutable)

**Comprennent** :

```javascript
// 1. Object (objet)
const obj = { name: 'John' };

// 2. Array (tableau)
const arr = [1, 2, 3];

// 3. Function (fonction)
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> Passage par valeur (Call by Value) vs Passage par référence (Call by Reference)

### Passage par valeur (Call by Value) - Types primitifs

**Comportement** : La valeur elle-même est copiée ; modifier la copie n'affecte pas la valeur originale.

```javascript
// Type primitif : passage par valeur
let a = 10;
let b = a; // Copier la valeur

b = 20; // Modifier b

console.log(a); // 10 (non affecté)
console.log(b); // 20
```

**Diagramme mémoire** :

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ ← Valeur indépendante
├─────────┤
│ b: 20   │ ← Valeur indépendante (modifiée après copie)
└─────────┘
```

### Passage par référence (Call by Reference) - Types de référence

**Comportement** : L'adresse mémoire est copiée ; deux variables pointent vers le même objet.

```javascript
// Type de référence : passage par référence
let obj1 = { name: 'John' };
let obj2 = obj1; // Copier l'adresse mémoire

obj2.name = 'Jane'; // Modifier via obj2

console.log(obj1.name); // 'Jane' (affecté !)
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true (pointent vers le même objet)
```

**Diagramme mémoire** :

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (même objet)     │
└─────────┘                    └──────────────────┘
```

## 3. Common Quiz Questions

> Questions de quiz courantes

### Question 1 : Passage de types primitifs

```javascript
function changeValue(x) {
  x = 100;
  console.log('x dans la fonction :', x);
}

let num = 50;
changeValue(num);
console.log('num hors de la fonction :', num);
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
// x dans la fonction : 100
// num hors de la fonction : 50
```

**Explication** :

- `num` est un type primitif (Number)
- Lors du passage à la fonction, **la valeur est copiée**, `x` et `num` sont des variables indépendantes
- Modifier `x` n'affecte pas `num`

```javascript
// Flux d'exécution
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50 (copie)
x = 100; // Stack: x = 100 (seul x est modifié)
console.log(num); // Stack: num = 50 (non affecté)
```

</details>

### Question 2 : Passage de types de référence

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('obj.name dans la fonction :', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('person.name hors de la fonction :', person.name);
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
// obj.name dans la fonction : Changed
// person.name hors de la fonction : Changed
```

**Explication** :

- `person` est un type de référence (Object)
- Lors du passage à la fonction, **l'adresse mémoire est copiée**
- `obj` et `person` pointent vers le **même objet**
- Modifier le contenu de l'objet via `obj` affecte également `person`

```javascript
// Diagramme mémoire
let person = { name: 'Original' }; // Heap: créer objet @0x001
changeObject(person); // Stack: obj = @0x001 (copier l'adresse)
obj.name = 'Changed'; // Heap: @0x001.name = 'Changed'
console.log(person.name); // Heap: @0x001.name (même objet)
```

</details>

### Question 3 : Réassignation vs modification de propriété

```javascript
function test1(obj) {
  obj.name = 'Modified'; // Modifier la propriété
}

function test2(obj) {
  obj = { name: 'New Object' }; // Réassigner
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
// A: Modified
// B: Modified (pas 'New Object' !)
```

**Explication** :

**test1 : Modification de propriété**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // ✅ Modifie la propriété de l'objet original
}
// person et obj pointent vers le même objet, donc il est modifié
```

**test2 : Réassignation**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // ❌ Change seulement la référence de obj
}
// obj pointe maintenant vers un nouvel objet, mais person pointe toujours vers l'original
```

**Diagramme mémoire** :

```text
// Avant test1
person ────> { name: 'Original' }
obj    ────> { name: 'Original' } (le même)

// Après test1
person ────> { name: 'Modified' }
obj    ────> { name: 'Modified' } (le même)

// Exécution de test2
person ────> { name: 'Modified' }    (inchangé)
obj    ────> { name: 'New Object' }  (nouvel objet)

// Après test2
person ────> { name: 'Modified' }    (toujours inchangé)
// obj est détruit, le nouvel objet est récupéré par le garbage collector
```

</details>

### Question 4 : Passage de tableaux

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**Explication** :

- `modifyArray` : Modifie le contenu du tableau original, `numbers` est affecté
- `reassignArray` : Change seulement la référence du paramètre, `numbers` n'est pas affecté

</details>

### Question 5 : Opérations de comparaison

```javascript
// Comparaison de types primitifs
let a = 10;
let b = 10;
console.log('A:', a === b);

// Comparaison de types de référence
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
// A: true
// B: false
// C: true
```

**Explication** :

**Types primitifs** : Comparent les valeurs

```javascript
10 === 10; // true (même valeur)
```

**Types de référence** : Comparent les adresses mémoire

```javascript
obj1 === obj2; // false (objets différents, adresses différentes)
obj1 === obj3; // true (pointent vers le même objet)
```

**Diagramme mémoire** :

```text
obj1 ────> @0x001: { value: 10 }
obj2 ────> @0x002: { value: 10 } (même contenu mais adresse différente)
obj3 ────> @0x001: { value: 10 } (même adresse que obj1)
```

</details>

## 4. Shallow Copy vs Deep Copy

> Copie superficielle vs Copie profonde

### Copie superficielle (Shallow Copy)

**Définition** : Copie uniquement le premier niveau ; les objets imbriqués restent des références.

#### Méthode 1 : Opérateur de décomposition (Spread Operator)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

// Modifier le premier niveau : n'affecte pas l'objet original
copy.name = 'Jane';
console.log(original.name); // 'John' (non affecté)

// Modifier l'objet imbriqué : affecte l'objet original !
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung' (affecté !)
```

#### Méthode 2 : Object.assign()

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John' (non affecté)
```

#### Méthode 3 : Copie superficielle de tableaux

```javascript
const arr1 = [1, 2, 3];

// Méthode 1 : Opérateur de décomposition
const arr2 = [...arr1];

// Méthode 2 : slice()
const arr3 = arr1.slice();

// Méthode 3 : Array.from()
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1 (non affecté)
```

### Copie profonde (Deep Copy)

**Définition** : Copie complètement tous les niveaux, y compris les objets imbriqués.

#### Méthode 1 : JSON.parse + JSON.stringify (la plus courante)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

// Modifier l'objet imbriqué : n'affecte pas l'objet original
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (non affecté)

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming'] (non affecté)
```

**Limitations** :

```javascript
const obj = {
  date: new Date(), // ❌ Sera converti en chaîne
  func: () => {}, // ❌ Sera ignoré
  undef: undefined, // ❌ Sera ignoré
  symbol: Symbol('test'), // ❌ Sera ignoré
  regexp: /abc/, // ❌ Sera converti en {}
  circular: null, // ❌ Les références circulaires causent une erreur
};
obj.circular = obj; // Référence circulaire

JSON.parse(JSON.stringify(obj)); // Erreur ou perte de données
```

#### Méthode 2 : structuredClone() (navigateurs modernes)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

// Peut copier correctement les objets spéciaux comme Date
console.log(copy.date instanceof Date); // true
```

**Avantages** :

- ✅ Supporte Date, RegExp, Map, Set, etc.
- ✅ Supporte les références circulaires
- ✅ Meilleures performances

**Limitations** :

- ❌ Ne supporte pas les fonctions
- ❌ Ne supporte pas Symbol

#### Méthode 3 : Implémentation récursive de la copie profonde

```javascript
function deepClone(obj) {
  // Gérer null et les non-objets
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Gérer les tableaux
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Gérer Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // Gérer RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Gérer les objets
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Exemple d'utilisation
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (non affecté)
```

#### Méthode 4 : Utiliser Lodash

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### Comparaison : Copie superficielle vs Copie profonde

| Caractéristique  | Copie superficielle | Copie profonde            |
| ---------------- | ------------------- | ------------------------- |
| Niveaux copiés   | Premier niveau seulement | Tous les niveaux       |
| Objets imbriqués | Restent des références | Complètement indépendants |
| Performance      | Rapide              | Lente                     |
| Mémoire          | Peu                 | Beaucoup                  |
| Cas d'utilisation| Objets simples      | Structures imbriquées complexes |

## 5. Common Pitfalls

> Pièges courants

### Piège 1 : Croire que le passage de paramètres peut modifier les types primitifs

```javascript
// ❌ Compréhension incorrecte
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5 (ne devient pas 6 !)

// ✅ Écriture correcte
count = increment(count); // Il faut recevoir la valeur de retour
console.log(count); // 6
```

### Piège 2 : Croire que la réassignation peut modifier l'objet externe

```javascript
// ❌ Compréhension incorrecte
function resetObject(obj) {
  obj = { name: 'Reset' }; // Change seulement la référence du paramètre
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original' (n'a pas été réinitialisé !)

// ✅ Écriture correcte 1 : Modifier les propriétés
function resetObject(obj) {
  obj.name = 'Reset';
}

// ✅ Écriture correcte 2 : Retourner un nouvel objet
function resetObject(obj) {
  return { name: 'Reset' };
}
person = resetObject(person);
```

### Piège 3 : Croire que l'opérateur de décomposition fait une copie profonde

```javascript
// ❌ Compréhension incorrecte
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // Copie superficielle !

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane' (a été affecté !)

// ✅ Écriture correcte : Copie profonde
const copy = JSON.parse(JSON.stringify(original));
// ou
const copy = structuredClone(original);
```

### Piège 4 : Malentendu sur const

```javascript
// const empêche seulement la réassignation, ce n'est pas l'immutabilité !

const obj = { name: 'John' };

// ❌ Ne peut pas être réassigné
obj = { name: 'Jane' }; // TypeError: Assignment to constant variable

// ✅ Les propriétés peuvent être modifiées
obj.name = 'Jane'; // Fonctionne normalement
obj.age = 30; // Fonctionne normalement

// Pour une vraie immutabilité
const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane'; // Échoue silencieusement (en mode strict, lance une erreur)
console.log(immutableObj.name); // 'John' (n'a pas été modifié)
```

### Piège 5 : Problème de référence dans les boucles

```javascript
// ❌ Erreur courante
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // Tous pointent vers le même objet !
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]
// Tous sont le même objet, la valeur finale est toujours 2

// ✅ Écriture correcte : Créer un nouvel objet à chaque fois
const arr = [];

for (let i = 0; i < 3; i++) {
  arr.push({ value: i }); // Créer un nouvel objet à chaque fois
}

console.log(arr);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practices

> Meilleures pratiques

### ✅ Approches recommandées

```javascript
// 1. Lors de la copie d'objets, utiliser explicitement des méthodes de copie
const original = { name: 'John', age: 30 };

// Copie superficielle (objets simples)
const copy1 = { ...original };

// Copie profonde (objets imbriqués)
const copy2 = structuredClone(original);

// 2. Les fonctions ne doivent pas dépendre des effets de bord pour modifier les paramètres
// ❌ Mauvais
function addItem(arr, item) {
  arr.push(item); // Modifie le tableau original
}

// ✅ Bon
function addItem(arr, item) {
  return [...arr, item]; // Retourne un nouveau tableau
}

// 3. Utiliser const pour prévenir les réassignations accidentelles
const config = { theme: 'dark' };
// config = {}; // Lancera une erreur

// 4. Utiliser Object.freeze quand des objets immuables sont nécessaires
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ Approches à éviter

```javascript
// 1. Ne pas dépendre du passage de paramètres pour modifier les types primitifs
function increment(num) {
  num++; // ❌ Sans effet
}

// 2. Ne pas confondre copie superficielle et copie profonde
const copy = { ...nested }; // ❌ Croire que c'est une copie profonde

// 3. Ne pas réutiliser la même référence d'objet dans les boucles
for (let i = 0; i < 3; i++) {
  arr.push(obj); // ❌ Tous pointent vers le même objet
}
```

## 7. Interview Summary

> Résumé pour l'entretien

### Mémorisation rapide

**Types primitifs (Primitive)** :

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- Passage par valeur (Call by Value)
- Stockés dans le Stack
- Immuables (Immutable)

**Types de référence (Reference)** :

- Object, Array, Function, Date, RegExp, etc.
- Passage par référence (Call by Reference)
- Stockés dans le Heap
- Mutables (Mutable)

### Exemple de réponse en entretien

**Q : JavaScript est-il Call by Value ou Call by Reference ?**

> JavaScript est **Call by Value pour tous les types**, mais la « valeur » passée pour les types de référence est l'adresse mémoire.
>
> - Types primitifs : Une copie de la valeur est passée, les modifications n'affectent pas la valeur originale
> - Types de référence : Une copie de l'adresse est passée, via l'adresse on peut modifier l'objet original
> - Cependant, si on réassigne (change l'adresse), l'objet original n'est pas affecté

## Reference

- [MDN - Data Structures](https://developer.mozilla.org/fr/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [JavaScript en profondeur](https://javascript.info/object-copy)
