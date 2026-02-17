---
id: generics
title: '[Medium] Generiques (Generics)'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> Que sont les generiques ?

Les generiques (Generics) sont une fonctionnalite puissante de TypeScript qui permet de creer des composants reutilisables capables de gerer plusieurs types plutot qu'un seul.

**Concept central** : Lors de la definition de fonctions, interfaces ou classes, on ne specifie pas de type concret a l'avance, mais on le specifie au moment de l'utilisation.

### Pourquoi a-t-on besoin des generiques ?

**Probleme sans generiques** :

```typescript
// Probleme : il faut ecrire une fonction pour chaque type
function getStringItem(arr: string[]): string {
  return arr[0];
}

function getNumberItem(arr: number[]): number {
  return arr[0];
}

function getBooleanItem(arr: boolean[]): boolean {
  return arr[0];
}
```

**Solution avec les generiques** :

```typescript
// Une seule fonction pour tous les types
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> Syntaxe de base des generiques

### Fonctions generiques

```typescript
// Syntaxe : <T> represente le parametre de type
function identity<T>(arg: T): T {
  return arg;
}

// Utilisation 1 : specifier le type explicitement
let output1 = identity<string>('hello');  // output1: string

// Utilisation 2 : laisser TypeScript inferer le type
let output2 = identity('hello');  // output2: string (inference automatique)
```

### Interfaces generiques

```typescript
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = {
  value: 'hello',
};

const numberBox: Box<number> = {
  value: 42,
};
```

### Classes generiques

```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }
}

const stringContainer = new Container<string>();
stringContainer.add('hello');
stringContainer.add('world');

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
```

## 3. Generic Constraints

> Contraintes generiques

### Contraintes de base

**Syntaxe** : Utilisation du mot-cle `extends` pour restreindre le type generique.

```typescript
// T doit avoir la propriete length
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ Erreur : number n'a pas de propriete length
```

### Contrainte avec keyof

```typescript
// K doit etre une cle de T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

getProperty(user, 'name');  // ✅ 'John'
getProperty(user, 'age');   // ✅ 30
getProperty(user, 'id');    // ❌ Erreur : 'id' n'est pas une cle de user
```

### Contraintes multiples

```typescript
// T doit satisfaire plusieurs conditions simultanement
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ Erreur : boolean est hors de la portee de la contrainte
```

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Implementer une fonction generique

Implementez une fonction generique `first` qui retourne le premier element d'un tableau.

```typescript
function first<T>(arr: T[]): T | undefined {
  // Votre implementation
}
```

<details>
<summary>Cliquez pour voir la reponse</summary>

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// Exemple d'utilisation
const firstString = first<string>(['a', 'b', 'c']);  // 'a'
const firstNumber = first<number>([1, 2, 3]);        // 1
const firstEmpty = first<number>([]);                 // undefined
```

**Explication** :
- `<T>` definit le parametre de type generique
- `arr: T[]` represente un tableau de type T
- La valeur de retour `T | undefined` indique qu'elle peut etre de type T ou undefined

</details>

### Question 2 : Contraintes generiques

Implementez une fonction qui fusionne deux objets, mais ne fusionne que les proprietes existantes dans le premier objet.

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // Votre implementation
}
```

<details>
<summary>Cliquez pour voir la reponse</summary>

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// Exemple d'utilisation
const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31, email: 'john@example.com' };

const merged = merge(obj1, obj2);
// { name: 'John', age: 31, email: 'john@example.com' }
```

**Version avancee (ne fusionner que les proprietes du premier objet)** :

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // Ne peut contenir que les proprietes de obj1

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### Question 3 : Interface generique

Definissez une interface generique `Repository` pour les operations d'acces aux donnees.

```typescript
interface Repository<T> {
  // Votre definition
}
```

<details>
<summary>Cliquez pour voir la reponse</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// Exemple d'implementation
class UserRepository implements Repository<User> {
  private users: User[] = [];

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findAll(): User[] {
    return this.users;
  }

  save(entity: User): void {
    const index = this.users.findIndex(user => user.id === entity.id);
    if (index >= 0) {
      this.users[index] = entity;
    } else {
      this.users.push(entity);
    }
  }

  delete(id: string): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}
```

</details>

### Question 4 : Contraintes generiques et keyof

Implementez une fonction qui obtient la valeur d'une propriete d'un objet selon le nom de la cle, en assurant la securite des types.

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // Votre implementation
}
```

<details>
<summary>Cliquez pour voir la reponse</summary>

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Exemple d'utilisation
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const name = getValue(user, 'name');   // string
const age = getValue(user, 'age');     // number
const email = getValue(user, 'email');  // string
// const id = getValue(user, 'id');    // ❌ Erreur : 'id' n'est pas une cle de user
```

**Explication** :
- `K extends keyof T` assure que K doit etre l'une des cles de T
- `T[K]` represente le type de la valeur correspondant a la cle K dans l'objet T
- Cela garantit la securite des types, permettant de decouvrir les erreurs a la compilation

</details>

### Question 5 : Types conditionnels et generiques

Expliquez les resultats de l'inference de types du code suivant.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>Cliquez pour voir la reponse</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**Explication** :
- `NonNullable<T>` est un type conditionnel (Conditional Type)
- Si T est assignable a `null | undefined`, retourne `never` ; sinon retourne `T`
- Dans `string | null`, `string` ne remplit pas la condition, `null` la remplit, donc le resultat est `string`
- Dans `string | number`, aucun des deux ne remplit la condition, donc le resultat est `string | number`

**Application pratique** :
```typescript
function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined');
  }
  return value as NonNullable<T>;
}

const result = processValue<string | null>('hello');  // string
```

</details>

## 5. Advanced Generic Patterns

> Modeles avances de generiques

### Parametres de type par defaut

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // Utilise le type par defaut string
const container2: Container<number> = { value: 42 };
```

### Parametres de types multiples

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### Types utilitaires generiques

```typescript
// Partial : toutes les proprietes deviennent optionnelles
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required : toutes les proprietes deviennent obligatoires
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick : selectionner des proprietes specifiques
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit : exclure des proprietes specifiques
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> Meilleures pratiques

### Pratiques recommandees

```typescript
// 1. Utiliser des noms de generiques significatifs
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. Utiliser des contraintes pour limiter la portee des generiques
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. Fournir des parametres de type par defaut
interface Config<T = string> {
  value: T;
}

// 4. Utiliser les types utilitaires generiques
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### Pratiques a eviter

```typescript
// 1. Ne pas abuser des generiques
function process<T>(value: T): T {  // ⚠️ S'il n'y a qu'un seul type, les generiques ne sont pas necessaires
  return value;
}

// 2. Ne pas utiliser de noms de generiques a une seule lettre (sauf dans les cas simples)
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ Signification peu claire
  // ...
}

// 3. Ne pas ignorer les contraintes
function process<T>(value: T) {  // ⚠️ S'il y a des restrictions, des contraintes doivent etre ajoutees
  return value.length;  // Erreur possible
}
```

## 7. Interview Summary

> Resume pour l'entretien

### Reference rapide

**Concepts centraux des generiques** :
- Ne pas specifier de type concret a la definition, mais a l'utilisation
- Syntaxe : `<T>` definit le parametre de type
- Applicable aux fonctions, interfaces, classes

**Contraintes generiques** :
- Utiliser `extends` pour limiter la portee des generiques
- `K extends keyof T` assure que K est une cle de T
- Possibilite de combiner plusieurs contraintes

**Modeles courants** :
- Fonction generique : `function identity<T>(arg: T): T`
- Interface generique : `interface Box<T> { value: T; }`
- Classe generique : `class Container<T> { ... }`

### Exemples de reponses pour l'entretien

**Q : Que sont les generiques ? Pourquoi sont-ils necessaires ?**

> "Les generiques sont un mecanisme en TypeScript pour creer des composants reutilisables, ou le type concret n'est pas specifie a la definition mais a l'utilisation. Les principaux avantages des generiques sont : 1) Meilleure reutilisabilite du code - une fonction peut gerer plusieurs types ; 2) Maintien de la securite des types - verification des erreurs de type a la compilation ; 3) Reduction du code duplique - pas besoin d'ecrire une fonction pour chaque type. Par exemple, `function identity<T>(arg: T): T` peut gerer n'importe quel type sans ecrire des fonctions separees pour string, number, etc."

**Q : Que sont les contraintes generiques ? Comment les utiliser ?**

> "Les contraintes generiques utilisent le mot-cle `extends` pour limiter la portee du type generique. Par exemple, `function getLength<T extends { length: number }>(arg: T)` assure que T doit avoir la propriete length. Une autre contrainte courante est `K extends keyof T`, qui assure que K doit etre l'une des cles de T, permettant un acces aux proprietes avec securite de types. Les contraintes aident a maintenir la securite des types lors de l'utilisation de generiques tout en fournissant les informations de type necessaires."

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
