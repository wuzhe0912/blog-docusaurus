---
id: basic-types
title: '[Easy] Types de base et annotations de type'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> Quels sont les types de base de TypeScript ?

TypeScript fournit une variété de types de base pour définir les types de variables, de paramètres de fonctions et de valeurs de retour.

### Types de base

```typescript
// 1. number : nombres (entiers, nombres à virgule flottante)
let age: number = 30;
let price: number = 99.99;

// 2. string : chaînes de caractères
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean : valeurs booléennes
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null : valeur nulle
let data: null = null;

// 5. undefined : non défini
let value: undefined = undefined;

// 6. void : pas de valeur de retour (utilisé principalement pour les fonctions)
function logMessage(): void {
  console.log('Hello');
}

// 7. any : type quelconque (à éviter)
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown : type inconnu (plus sûr que any)
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ Erreur : vérification de type nécessaire

// 9. never : valeur qui ne se produit jamais (pour les fonctions qui ne retournent jamais)
function throwError(): never {
  throw new Error('Error');
}

// 10. object : objet (rarement utilisé, interface recommandé)
let user: object = { name: 'John' };

// 11. array : tableau
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple : tuple (tableau de longueur et types fixes)
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> Annotations de type vs Inférence de type

### Annotations de type (Type Annotations)

**Définition** : Spécifier explicitement le type d'une variable.

```typescript
// Spécifier le type explicitement
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// Paramètres de fonction et valeurs de retour
function add(a: number, b: number): number {
  return a + b;
}
```

### Inférence de type (Type Inference)

**Définition** : TypeScript infère automatiquement le type à partir de la valeur initiale.

```typescript
// TypeScript infère automatiquement comme number
let age = 30;        // age: number

// TypeScript infère automatiquement comme string
let name = 'John';   // name: string

// TypeScript infère automatiquement comme boolean
let isActive = true;  // isActive: boolean

// Les valeurs de retour des fonctions sont également inférées automatiquement
function add(a: number, b: number) {
  return a + b;  // La valeur de retour est automatiquement inférée comme number
}
```

### Quand utiliser les annotations de type

**Situations où le type doit être spécifié explicitement** :

```typescript
// 1. Déclaration de variable sans valeur initiale
let value: number;
value = 10;

// 2. Paramètres de fonction (obligatoire)
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. Valeur de retour de fonction (spécification explicite recommandée)
function calculate(): number {
  return 42;
}

// 4. Types complexes où l'inférence peut être imprécise
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Inférence de type

Expliquez le type de chaque variable dans le code suivant.

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**Explication** :
- TypeScript infère automatiquement le type à partir de la valeur initiale
- Les tableaux sont inférés comme tableau du type de leurs éléments
- Les objets sont inférés comme le type structurel de l'objet

</details>

### Question 2 : Erreurs de type

Trouvez les erreurs de type dans le code suivant.

```typescript
let age: number = 30;
age = 'thirty';

let name: string = 'John';
name = 42;

let isActive: boolean = true;
isActive = 'yes';

let numbers: number[] = [1, 2, 3];
numbers.push('4');
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```typescript
let age: number = 30;
age = 'thirty'; // ❌ Type 'string' is not assignable to type 'number'

let name: string = 'John';
name = 42; // ❌ Type 'number' is not assignable to type 'string'

let isActive: boolean = true;
isActive = 'yes'; // ❌ Type 'string' is not assignable to type 'boolean'

let numbers: number[] = [1, 2, 3];
numbers.push('4'); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'
```

**Écriture correcte** :
```typescript
let age: number = 30;
age = 30; // ✅

let name: string = 'John';
name = 'Jane'; // ✅

let isActive: boolean = true;
isActive = false; // ✅

let numbers: number[] = [1, 2, 3];
numbers.push(4); // ✅
```

</details>

### Question 3 : any vs unknown

Expliquez la différence entre `any` et `unknown`, et indiquez lequel utiliser.

```typescript
// Cas 1 : utilisation de any
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ?
}

// Cas 2 : utilisation de unknown
function processUnknown(value: unknown): void {
  console.log(value.toUpperCase()); // ?
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

**Cas 1 : utilisation de any**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ La compilation réussit, mais peut échouer à l'exécution
}

processAny('hello');  // ✅ Exécution normale
processAny(42);       // ❌ Erreur à l'exécution : value.toUpperCase is not a function
```

**Cas 2 : utilisation de unknown**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ Erreur de compilation : Object is of type 'unknown'

  // La vérification du type est nécessaire
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ Sûr
  }
}
```

**Comparaison des différences** :

| Caractéristique | any | unknown |
| --- | --- | --- |
| Vérification de type | Complètement désactivée | Vérification nécessaire avant utilisation |
| Sécurité | Non sécurisé | Sécurisé |
| Recommandation | À éviter | Recommandé |

**Meilleures pratiques** :
```typescript
// ✅ Recommandé : utiliser unknown et vérifier le type
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  }
}

// ❌ À éviter : utiliser any
function processValue(value: any): void {
  console.log(value.toUpperCase()); // Non sécurisé
}
```

</details>

### Question 4 : Types de tableau

Expliquez les différences des déclarations de types de tableau suivantes.

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```typescript
// 1. number[] : tableau de nombres (écriture recommandée)
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ Erreur

// 2. Array<number> : tableau générique (équivalent à number[])
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ Erreur

// 3. [number, string] : tuple (Tuple) - longueur et types fixes
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ Erreur : la longueur dépasse 2
arr3.push('test');   // ⚠️ TypeScript l'autorise, mais ce n'est pas recommandé

// 4. any[] : tableau de type quelconque (non recommandé)
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅ (mais la vérification de type est perdue)
```

**Recommandations d'utilisation** :
- Tableaux généraux : utiliser `number[]` ou `Array<number>`
- Structure fixe : utiliser un tuple `[type1, type2]`
- Éviter `any[]`, préférer des types concrets ou `unknown[]`

</details>

### Question 5 : void vs never

Expliquez les différences et les cas d'utilisation de `void` et `never`.

```typescript
// Cas 1 : void
function logMessage(): void {
  console.log('Hello');
}

// Cas 2 : never
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {
    // Boucle infinie
  }
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

**void** :
- **Usage** : Indique qu'une fonction ne retourne pas de valeur
- **Caractéristique** : La fonction se termine normalement, mais ne retourne pas de valeur
- **Cas d'utilisation** : Gestionnaires d'événements, fonctions à effets de bord

```typescript
function logMessage(): void {
  console.log('Hello');
  // La fonction se termine normalement, ne retourne pas de valeur
}

function onClick(): void {
  // Gestion de l'événement de clic, pas besoin de valeur de retour
}
```

**never** :
- **Usage** : Indique qu'une fonction ne se termine jamais normalement
- **Caractéristique** : La fonction lance une erreur ou entre dans une boucle infinie
- **Cas d'utilisation** : Gestion d'erreurs, boucles infinies, type guards

```typescript
function throwError(): never {
  throw new Error('Error');
  // On n'arrivera jamais ici
}

function infiniteLoop(): never {
  while (true) {
    // Ne se termine jamais
  }
}

// Utilisation dans les type guards
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

**Comparaison des différences** :

| Caractéristique | void | never |
| --- | --- | --- |
| Fin de fonction | Terminaison normale | Ne se termine jamais |
| Valeur de retour | undefined | Pas de valeur de retour |
| Cas d'utilisation | Fonctions sans valeur de retour | Gestion d'erreurs, boucles infinies |

</details>

## 4. Best Practices

> Meilleures pratiques

### Pratiques recommandées

```typescript
// 1. Privilégier l'inférence de type
let age = 30;  // ✅ Laisser TypeScript inférer
let name = 'John';  // ✅

// 2. Spécifier explicitement le type des paramètres et retours de fonction
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. Utiliser unknown plutôt que any
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. Utiliser des types de tableau spécifiques
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. Utiliser des tuples pour les structures fixes
let person: [string, number] = ['John', 30];  // ✅
```

### Pratiques à éviter

```typescript
// 1. Éviter l'utilisation de any
let value: any = 'hello';  // ❌

// 2. Éviter les annotations de type inutiles
let age: number = 30;  // ⚠️ Peut être simplifié en let age = 30;

// 3. Éviter le type object
let user: object = { name: 'John' };  // ❌ Utiliser interface est mieux

// 4. Éviter les tableaux de types mixtes (sauf si nécessaire)
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ Vérifier si c'est vraiment nécessaire
```

## 5. Interview Summary

> Résumé pour l'entretien

### Référence rapide

**Types de base** :
- `number`, `string`, `boolean`, `null`, `undefined`
- `void` (pas de valeur de retour), `never` (ne retourne jamais)
- `any` (type quelconque, à éviter), `unknown` (type inconnu, recommandé)

**Annotations de type vs Inférence** :
- Annotation de type : spécifier explicitement `let age: number = 30`
- Inférence de type : inférence automatique `let age = 30`

**Types de tableau** :
- `number[]` ou `Array<number>` : tableau général
- `[number, string]` : tuple (structure fixe)

### Exemples de réponses pour l'entretien

**Q : Quels sont les types de base de TypeScript ?**

> "TypeScript fournit de nombreux types de base, incluant number, string, boolean, null, undefined. Il existe aussi quelques types spéciaux : void indique l'absence de valeur de retour, utilisé principalement pour les fonctions ; never indique une valeur qui ne se produit jamais, utilisé pour les fonctions qui ne retournent jamais ; any est un type quelconque, mais doit être évité ; unknown est un type inconnu, plus sûr que any, nécessitant une vérification de type avant utilisation. De plus, il y a le type de tableau number[] et le type de tuple [number, string]."

**Q : Quelle est la différence entre any et unknown ?**

> "any désactive complètement la vérification de type, permettant d'utiliser directement n'importe quelle propriété ou méthode, ce qui n'est pas sécurisé. unknown nécessite une vérification de type avant utilisation, ce qui est plus sûr. Par exemple, lors de l'utilisation de unknown, il faut d'abord vérifier le type avec typeof avant de pouvoir appeler les méthodes correspondantes. Il est recommandé de privilégier unknown plutôt que any."

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
