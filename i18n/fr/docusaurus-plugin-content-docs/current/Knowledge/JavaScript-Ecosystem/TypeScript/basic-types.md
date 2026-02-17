---
id: basic-types
title: '[Easy] Types de base et annotations de type'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> Quels sont les types de base de TypeScript ?

TypeScript fournit une variete de types de base pour definir les types de variables, de parametres de fonctions et de valeurs de retour.

### Types de base

```typescript
// 1. number : nombres (entiers, nombres a virgule flottante)
let age: number = 30;
let price: number = 99.99;

// 2. string : chaines de caracteres
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean : valeurs booleennes
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null : valeur nulle
let data: null = null;

// 5. undefined : non defini
let value: undefined = undefined;

// 6. void : pas de valeur de retour (utilise principalement pour les fonctions)
function logMessage(): void {
  console.log('Hello');
}

// 7. any : type quelconque (a eviter)
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown : type inconnu (plus sur que any)
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ Erreur : verification de type necessaire

// 9. never : valeur qui ne se produit jamais (pour les fonctions qui ne retournent jamais)
function throwError(): never {
  throw new Error('Error');
}

// 10. object : objet (rarement utilise, interface recommande)
let user: object = { name: 'John' };

// 11. array : tableau
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple : tuple (tableau de longueur et types fixes)
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> Annotations de type vs Inference de type

### Annotations de type (Type Annotations)

**Definition** : Specifier explicitement le type d'une variable.

```typescript
// Specifier le type explicitement
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// Parametres de fonction et valeurs de retour
function add(a: number, b: number): number {
  return a + b;
}
```

### Inference de type (Type Inference)

**Definition** : TypeScript infere automatiquement le type a partir de la valeur initiale.

```typescript
// TypeScript infere automatiquement comme number
let age = 30;        // age: number

// TypeScript infere automatiquement comme string
let name = 'John';   // name: string

// TypeScript infere automatiquement comme boolean
let isActive = true;  // isActive: boolean

// Les valeurs de retour des fonctions sont egalement inferees automatiquement
function add(a: number, b: number) {
  return a + b;  // La valeur de retour est automatiquement inferee comme number
}
```

### Quand utiliser les annotations de type

**Situations ou le type doit etre specifie explicitement** :

```typescript
// 1. Declaration de variable sans valeur initiale
let value: number;
value = 10;

// 2. Parametres de fonction (obligatoire)
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. Valeur de retour de fonction (specification explicite recommandee)
function calculate(): number {
  return 42;
}

// 4. Types complexes ou l'inference peut etre imprecise
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Inference de type

Expliquez le type de chaque variable dans le code suivant.

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>Cliquez pour voir la reponse</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**Explication** :
- TypeScript infere automatiquement le type a partir de la valeur initiale
- Les tableaux sont inferes comme tableau du type de leurs elements
- Les objets sont inferes comme le type structurel de l'objet

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
<summary>Cliquez pour voir la reponse</summary>

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

**Ecriture correcte** :
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

Expliquez la difference entre `any` et `unknown`, et indiquez lequel utiliser.

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
<summary>Cliquez pour voir la reponse</summary>

**Cas 1 : utilisation de any**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ La compilation reussit, mais peut echouer a l'execution
}

processAny('hello');  // ✅ Execution normale
processAny(42);       // ❌ Erreur a l'execution : value.toUpperCase is not a function
```

**Cas 2 : utilisation de unknown**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ Erreur de compilation : Object is of type 'unknown'

  // La verification du type est necessaire
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ Sur
  }
}
```

**Comparaison des differences** :

| Caracteristique | any | unknown |
| --- | --- | --- |
| Verification de type | Completement desactivee | Verification necessaire avant utilisation |
| Securite | Non securise | Securise |
| Recommandation | A eviter | Recommande |

**Meilleures pratiques** :
```typescript
// ✅ Recommande : utiliser unknown et verifier le type
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  }
}

// ❌ A eviter : utiliser any
function processValue(value: any): void {
  console.log(value.toUpperCase()); // Non securise
}
```

</details>

### Question 4 : Types de tableau

Expliquez les differences des declarations de types de tableau suivantes.

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>Cliquez pour voir la reponse</summary>

```typescript
// 1. number[] : tableau de nombres (ecriture recommandee)
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ Erreur

// 2. Array<number> : tableau generique (equivalent a number[])
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ Erreur

// 3. [number, string] : tuple (Tuple) - longueur et types fixes
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ Erreur : la longueur depasse 2
arr3.push('test');   // ⚠️ TypeScript l'autorise, mais ce n'est pas recommande

// 4. any[] : tableau de type quelconque (non recommande)
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅ (mais la verification de type est perdue)
```

**Recommandations d'utilisation** :
- Tableaux generaux : utiliser `number[]` ou `Array<number>`
- Structure fixe : utiliser un tuple `[type1, type2]`
- Eviter `any[]`, preferer des types concrets ou `unknown[]`

</details>

### Question 5 : void vs never

Expliquez les differences et les cas d'utilisation de `void` et `never`.

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
<summary>Cliquez pour voir la reponse</summary>

**void** :
- **Usage** : Indique qu'une fonction ne retourne pas de valeur
- **Caracteristique** : La fonction se termine normalement, mais ne retourne pas de valeur
- **Cas d'utilisation** : Gestionnaires d'evenements, fonctions a effets de bord

```typescript
function logMessage(): void {
  console.log('Hello');
  // La fonction se termine normalement, ne retourne pas de valeur
}

function onClick(): void {
  // Gestion de l'evenement de clic, pas besoin de valeur de retour
}
```

**never** :
- **Usage** : Indique qu'une fonction ne se termine jamais normalement
- **Caracteristique** : La fonction lance une erreur ou entre dans une boucle infinie
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

**Comparaison des differences** :

| Caracteristique | void | never |
| --- | --- | --- |
| Fin de fonction | Terminaison normale | Ne se termine jamais |
| Valeur de retour | undefined | Pas de valeur de retour |
| Cas d'utilisation | Fonctions sans valeur de retour | Gestion d'erreurs, boucles infinies |

</details>

## 4. Best Practices

> Meilleures pratiques

### Pratiques recommandees

```typescript
// 1. Privilegier l'inference de type
let age = 30;  // ✅ Laisser TypeScript inferer
let name = 'John';  // ✅

// 2. Specifier explicitement le type des parametres et retours de fonction
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. Utiliser unknown plutot que any
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. Utiliser des types de tableau specifiques
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. Utiliser des tuples pour les structures fixes
let person: [string, number] = ['John', 30];  // ✅
```

### Pratiques a eviter

```typescript
// 1. Eviter l'utilisation de any
let value: any = 'hello';  // ❌

// 2. Eviter les annotations de type inutiles
let age: number = 30;  // ⚠️ Peut etre simplifie en let age = 30;

// 3. Eviter le type object
let user: object = { name: 'John' };  // ❌ Utiliser interface est mieux

// 4. Eviter les tableaux de types mixtes (sauf si necessaire)
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ Verifier si c'est vraiment necessaire
```

## 5. Interview Summary

> Resume pour l'entretien

### Reference rapide

**Types de base** :
- `number`, `string`, `boolean`, `null`, `undefined`
- `void` (pas de valeur de retour), `never` (ne retourne jamais)
- `any` (type quelconque, a eviter), `unknown` (type inconnu, recommande)

**Annotations de type vs Inference** :
- Annotation de type : specifier explicitement `let age: number = 30`
- Inference de type : inference automatique `let age = 30`

**Types de tableau** :
- `number[]` ou `Array<number>` : tableau general
- `[number, string]` : tuple (structure fixe)

### Exemples de reponses pour l'entretien

**Q : Quels sont les types de base de TypeScript ?**

> "TypeScript fournit de nombreux types de base, incluant number, string, boolean, null, undefined. Il existe aussi quelques types speciaux : void indique l'absence de valeur de retour, utilise principalement pour les fonctions ; never indique une valeur qui ne se produit jamais, utilise pour les fonctions qui ne retournent jamais ; any est un type quelconque, mais doit etre evite ; unknown est un type inconnu, plus sur que any, necessitant une verification de type avant utilisation. De plus, il y a le type de tableau number[] et le type de tuple [number, string]."

**Q : Quelle est la difference entre any et unknown ?**

> "any desactive completement la verification de type, permettant d'utiliser directement n'importe quelle propriete ou methode, ce qui n'est pas securise. unknown necessite une verification de type avant utilisation, ce qui est plus sur. Par exemple, lors de l'utilisation de unknown, il faut d'abord verifier le type avec typeof avant de pouvoir appeler les methodes correspondantes. Il est recommande de privilegier unknown plutot que any."

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
