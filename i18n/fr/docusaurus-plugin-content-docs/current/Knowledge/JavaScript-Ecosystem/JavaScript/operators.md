---
id: operators
title: '[Easy] 📄 JavaScript Operators'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. What is the difference between `==` and `===` ?

> Quelle est la différence entre `==` et `===` ?

Les deux sont des opérateurs de comparaison. `==` compare si deux valeurs sont égales, tandis que `===` compare si deux valeurs sont égales et du même type. Le second peut donc être considéré comme le mode strict.

Le premier, en raison de la conception de JavaScript, effectue automatiquement une conversion de type, ce qui entraîne de nombreux résultats peu intuitifs. Par exemple :

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

Cela représente une charge cognitive importante pour les développeurs. Il est donc généralement recommandé d'utiliser `===` à la place de `==` pour éviter les erreurs inattendues.

**Meilleures pratiques** : Utilisez toujours `===` et `!==`, sauf si vous savez très clairement pourquoi vous devez utiliser `==`.

### Questions d'entretien

#### Question 1 : Comparaison de types basiques

Déterminez le résultat des expressions suivantes :

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**Réponse :**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**Explication :**

- **`==` (opérateur d'égalité)** : Effectue une conversion de type
  - La chaîne `'1'` est convertie en nombre `1`
  - Puis compare `1 == 1`, le résultat est `true`
- **`===` (opérateur d'égalité stricte)** : N'effectue pas de conversion de type
  - `number` et `string` sont des types différents, renvoie directement `false`

**Règles de conversion de type :**

```javascript
// Ordre de priorité de conversion de type avec ==
// 1. S'il y a un number, convertir l'autre côté en number
'1' == 1; // '1' → 1, résultat true
'2' == 2; // '2' → 2, résultat true
'0' == 0; // '0' → 0, résultat true

// 2. S'il y a un boolean, convertir le boolean en number
true == 1; // true → 1, résultat true
false == 0; // false → 0, résultat true
'1' == true; // '1' → 1, true → 1, résultat true

// 3. Piège de la conversion chaîne vers nombre
'' == 0; // '' → 0, résultat true
' ' == 0; // ' ' → 0, résultat true (chaîne avec espaces convertie en 0)
```

#### Question 2 : Comparaison de null et undefined

Déterminez le résultat des expressions suivantes :

```javascript
undefined == null; // ?
undefined === null; // ?
```

**Réponse :**

```javascript
undefined == null; // true
undefined === null; // false
```

**Explication :**

C'est une **règle spéciale** de JavaScript :

- **`undefined == null`** : `true`
  - La spécification ES l'établit spécialement : `null` et `undefined` sont égaux lorsqu'on les compare avec `==`
  - C'est le seul scénario où `==` est utile : vérifier si une variable est `null` ou `undefined`
- **`undefined === null`** : `false`
  - Ce sont des types différents (`undefined` est de type `undefined`, `null` est de type `object`)
  - Non égaux en comparaison stricte

**Application pratique :**

```javascript
// Vérifier si une variable est null ou undefined
function isNullOrUndefined(value) {
  return value == null; // Vérifie null et undefined simultanément
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// Équivalent (mais plus concis)
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**Pièges à connaître :**

```javascript
// null et undefined ne sont égaux qu'entre eux
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// Mais avec ===, ils ne sont égaux qu'à eux-mêmes
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### Question 3 : Comparaison complète

Déterminez le résultat des expressions suivantes :

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**Réponse :**

```javascript
0 == false; // true (false → 0)
0 === false; // false (types différents : number vs boolean)
'' == false; // true ('' → 0, false → 0)
'' === false; // false (types différents : string vs boolean)
null == false; // false (null n'est égal qu'à null et undefined)
undefined == false; // false (undefined n'est égal qu'à null et undefined)
```

**Diagramme du flux de conversion :**

```javascript
// Processus de conversion de 0 == false
0 == false;
0 == 0; // false est converti en nombre 0
true; // résultat

// Processus de conversion de '' == false
'' == false;
'' == 0; // false est converti en nombre 0
0 == 0; // '' est converti en nombre 0
true; // résultat

// Cas spécial de null == false
null == false;
// null n'est pas converti ! Selon la spécification, null n'est égal qu'à null et undefined
false; // résultat
```

#### Question 4 : Comparaison d'objets

Déterminez le résultat des expressions suivantes :

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**Réponse :**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**Explication :**

- La comparaison d'objets (y compris les tableaux et objets) est une **comparaison par référence**
- Même si le contenu est identique, s'il s'agit d'instances différentes, elles ne sont pas égales
- `==` et `===` ont le même comportement pour les objets (les deux comparent les références)

```javascript
// Seules les mêmes références sont égales
const arr1 = [];
const arr2 = arr1; // Référence au même tableau
arr1 == arr2; // true
arr1 === arr2; // true

// Même contenu, mais instances différentes
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false (différentes références)
arr3 === arr4; // false (différentes références)

// Même chose pour les objets
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### Mémo rapide pour les entretiens

**Règles de conversion de type de `==` (priorité de haut en bas) :**

1. `null == undefined` → `true` (règle spéciale)
2. `number == string` → convertir string en number
3. `number == boolean` → convertir boolean en number
4. `string == boolean` → convertir les deux en number
5. Les objets comparent les références, pas de conversion

**Règles de `===` (simple) :**

1. Types différents → `false`
2. Même type → comparer la valeur (types basiques) ou la référence (types d'objet)

**Meilleures pratiques :**

```javascript
// ✅ Toujours utiliser ===
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ Seule exception : vérifier null/undefined
if (value == null) {
  // value est null ou undefined
}

// ❌ Éviter d'utiliser == (sauf l'exception ci-dessus)
if (value == 0) {
} // déconseillé
if (name == 'Alice') {
} // déconseillé
```

**Exemple de réponse en entretien :**

> "`==` effectue une conversion de type, ce qui peut entraîner des résultats peu intuitifs, comme `0 == '0'` qui donne `true`. `===` est une comparaison stricte qui n'effectue pas de conversion de type ; si les types sont différents, il renvoie directement `false`.
>
> La meilleure pratique est de toujours utiliser `===`, la seule exception étant `value == null` pour vérifier `null` et `undefined` simultanément.
>
> Il est important de noter que `null == undefined` est `true`, mais `null === undefined` est `false`, c'est une règle spéciale de JavaScript."

---

## 2. What is the difference between `&&` and `||` ? Please explain short-circuit evaluation

> Quelle est la différence entre `&&` et `||` ? Expliquez l'évaluation en court-circuit

### Concept de base

- **`&&` (AND)** : Quand le côté gauche est `falsy`, renvoie directement la valeur de gauche sans exécuter le côté droit
- **`||` (OR)** : Quand le côté gauche est `truthy`, renvoie directement la valeur de gauche sans exécuter le côté droit

### Exemple d'évaluation en court-circuit

```js
// && évaluation en court-circuit
const user = null;
const name = user && user.name; // user est falsy, renvoie null directement, n'accède pas à user.name
console.log(name); // null (pas d'erreur)

// || évaluation en court-circuit
const defaultName = 'Guest';
const userName = user || defaultName; // user est falsy, renvoie defaultName à droite
console.log(userName); // 'Guest'

// Application pratique
function greet(name) {
  const displayName = name || 'Anonymous'; // Si name n'est pas fourni, utilise la valeur par défaut
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### Pièges courants ⚠️

```js
// Problème : 0 et '' sont aussi falsy
const count = 0;
const result = count || 10; // 0 est falsy, renvoie 10
console.log(result); // 10 (peut ne pas être le résultat souhaité)

// Solution : Utiliser ?? (Nullish Coalescing)
const betterResult = count ?? 10; // Ne renvoie 10 que pour null/undefined
console.log(betterResult); // 0
```

---

## 3. What is the `?.` (Optional Chaining) operator ?

> Qu'est-ce que l'opérateur Optional Chaining `?.` ?

### Scénario du problème

L'écriture traditionnelle est susceptible de produire des erreurs :

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ Dangereux : Si address n'existe pas, une erreur survient
console.log(user.address.city); // Normal
console.log(otherUser.address.city); // TypeError: Cannot read property 'city' of undefined

// ✅ Sûr mais verbeux
const city = user && user.address && user.address.city;
```

### Utilisation d'Optional Chaining

```js
// ✅ Concis et sûr
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined (pas d'erreur)

// Peut aussi être utilisé pour les appels de méthodes
user?.getName?.(); // S'exécute seulement si getName existe

// Peut aussi être utilisé pour les tableaux
const firstItem = users?.[0]?.name; // Accès sûr au nom du premier utilisateur
```

### Application pratique

```js
// Traitement de la réponse API
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Unknown User';
  const email = response?.data?.user?.email ?? 'No email';

  console.log(`User: ${userName}`);
  console.log(`Email: ${email}`);
}

// Opérations DOM
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. What is the `??` (Nullish Coalescing) operator ?

> Qu'est-ce que l'opérateur Nullish Coalescing `??` ?

### Différence avec `||`

```js
// || traite toutes les valeurs falsy comme fausses
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? ne traite que null et undefined comme valeurs vides
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### Application pratique

```js
// Traitement de valeurs pouvant être 0
function updateScore(newScore) {
  // ✅ Correct : 0 est un score valide
  const score = newScore ?? 100; // Si c'est 0, conserve 0 ; utilise 100 uniquement pour null/undefined
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// Traitement des valeurs de configuration
const config = {
  timeout: 0, // 0 milliseconde est une configuration valide
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0 (conserve la configuration à 0)
const retries = config.maxRetries ?? 3; // 3 (null utilise la valeur par défaut)
```

### Utilisation combinée

```js
// ?? et ?. sont souvent utilisés ensemble
const userAge = user?.profile?.age ?? 18; // Si pas de données d'âge, par défaut 18

// Cas pratique : Valeurs par défaut de formulaire
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0, // 0 est un âge valide
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. What is the difference between `i++` and `++i` ?

> Quelle est la différence entre `i++` et `++i` ?

### Différence de base

- **`i++` (postfixe)** : Renvoie d'abord la valeur actuelle, puis ajoute 1
- **`++i` (préfixe)** : Ajoute d'abord 1, puis renvoie la nouvelle valeur

### Exemple

```js
let a = 5;
let b = a++; // b = 5, a = 6 (d'abord assigne à b, puis incrémente)
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6 (d'abord incrémente, puis assigne à d)
console.log(c, d); // 6, 6
```

### Impact pratique

```js
// Dans les boucles, il n'y a généralement pas de différence (car la valeur de retour n'est pas utilisée)
for (let i = 0; i < 5; i++) {} // ✅ Courant
for (let i = 0; i < 5; ++i) {} // ✅ Aussi valide, certains pensent que c'est légèrement plus rapide (en réalité pas de différence avec les moteurs JS modernes)

// Mais dans les expressions, il y a une différence
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1 (d'abord obtient la valeur avec i=0, puis i devient 1)
console.log(arr[++i]); // 3 (i devient d'abord 2, puis obtient la valeur)
```

### Meilleures pratiques

```js
// ✅ Clair : écrire séparément
let count = 0;
const value = arr[count];
count++;

// ⚠️ Déconseillé : facile à confondre
const value = arr[count++];
```

---

## 6. What is the Ternary Operator ? When should you use it ?

> Qu'est-ce que l'opérateur ternaire ? Quand devrait-on l'utiliser ?

### Syntaxe de base

```js
condition ? valueIfTrue : valueIfFalse;
```

### Exemple simple

```js
// if-else traditionnel
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// ✅ Opérateur ternaire : plus concis
const message = age >= 18 ? 'Adult' : 'Minor';
```

### Scénarios d'utilisation appropriés

```js
// 1. Assignation conditionnelle simple
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. Rendu conditionnel dans JSX/templates
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. Valeurs par défaut (combiné avec d'autres opérateurs)
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Welcome, ${displayName}!` : `Hello, ${displayName}`;

// 4. Valeur de retour de fonction
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### Scénarios à éviter

```js
// ❌ Imbrication trop profonde, difficile à lire
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ Utiliser if-else ou switch est plus clair
let result;
if (condition1) result = value1;
else if (condition2) result = value2;
else if (condition3) result = value3;
else result = value4;

// ❌ Logique complexe
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ Décomposer en plusieurs lignes
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess = isAdmin || hasReadPermission;
```

---

## Carte mémo rapide

| Opérateur     | Usage                | Point clé                                    |
| ------------- | -------------------- | -------------------------------------------- |
| `===`         | Égalité stricte      | Toujours utiliser celui-ci, oublier `==`      |
| `&&`          | Court-circuit AND    | Gauche faux : arrêt, renvoie valeur fausse   |
| `\|\|`        | Court-circuit OR     | Gauche vrai : arrêt, renvoie valeur vraie    |
| `?.`          | Optional Chaining    | Accès sûr, pas d'erreur                      |
| `??`          | Nullish Coalescing   | Ne gère que null/undefined                   |
| `++i` / `i++` | Auto-incrémentation | Préfixe : incrémente d'abord ; postfixe : après |
| `? :`         | Opérateur ternaire   | Pour conditions simples, éviter l'imbrication |

## Reference

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
