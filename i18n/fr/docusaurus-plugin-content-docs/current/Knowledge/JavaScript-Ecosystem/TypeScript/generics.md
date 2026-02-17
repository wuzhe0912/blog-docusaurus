---
id: generics
title: '[Medium] Génériques (Generics)'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> Que sont les génériques ?

Les génériques (Generics) sont une fonctionnalité puissante de TypeScript qui permet de créer des composants réutilisables capables de gérer plusieurs types plutôt qu'un seul.

**Concept central** : Lors de la définition de fonctions, interfaces ou classes, on ne spécifie pas de type concret à l'avance, mais on le spécifie au moment de l'utilisation.

### Pourquoi a-t-on besoin des génériques ?

**Problème sans génériques** :

```typescript
// Problème : il faut écrire une fonction pour chaque type
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

**Solution avec les génériques** :

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

> Syntaxe de base des génériques

### Fonctions génériques

```typescript
// Syntaxe : <T> représente le paramètre de type
function identity<T>(arg: T): T {
  return arg;
}

// Utilisation 1 : spécifier le type explicitement
let output1 = identity<string>('hello');  // output1: string

// Utilisation 2 : laisser TypeScript inférer le type
let output2 = identity('hello');  // output2: string (inférence automatique)
```

### Interfaces génériques

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

### Classes génériques

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

> Contraintes génériques

### Contraintes de base

**Syntaxe** : Utilisation du mot-clé `extends` pour restreindre le type générique.

```typescript
// T doit avoir la propriété length
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ Erreur : number n'a pas de propriété length
```

### Contrainte avec keyof

```typescript
// K doit être une clé de T
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
getProperty(user, 'id');    // ❌ Erreur : 'id' n'est pas une clé de user
```

### Contraintes multiples

```typescript
// T doit satisfaire plusieurs conditions simultanément
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ Erreur : boolean est hors de la portée de la contrainte
```

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Implémenter une fonction générique

Implémentez une fonction générique `first` qui retourne le premier élément d'un tableau.

```typescript
function first<T>(arr: T[]): T | undefined {
  // Votre implémentation
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

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
- `<T>` définit le paramètre de type générique
- `arr: T[]` représente un tableau de type T
- La valeur de retour `T | undefined` indique qu'elle peut être de type T ou undefined

</details>

### Question 2 : Contraintes génériques

Implémentez une fonction qui fusionne deux objets, mais ne fusionne que les propriétés existantes dans le premier objet.

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // Votre implémentation
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

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

**Version avancée (ne fusionner que les propriétés du premier objet)** :

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // Ne peut contenir que les propriétés de obj1

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### Question 3 : Interface générique

Définissez une interface générique `Repository` pour les opérations d'accès aux données.

```typescript
interface Repository<T> {
  // Votre définition
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// Exemple d'implémentation
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

### Question 4 : Contraintes génériques et keyof

Implémentez une fonction qui obtient la valeur d'une propriété d'un objet selon le nom de la clé, en assurant la sécurité des types.

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // Votre implémentation
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

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
// const id = getValue(user, 'id');    // ❌ Erreur : 'id' n'est pas une clé de user
```

**Explication** :
- `K extends keyof T` assure que K doit être l'une des clés de T
- `T[K]` représente le type de la valeur correspondant à la clé K dans l'objet T
- Cela garantit la sécurité des types, permettant de découvrir les erreurs à la compilation

</details>

### Question 5 : Types conditionnels et génériques

Expliquez les résultats de l'inférence de types du code suivant.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>Cliquez pour voir la réponse</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**Explication** :
- `NonNullable<T>` est un type conditionnel (Conditional Type)
- Si T est assignable à `null | undefined`, retourne `never` ; sinon retourne `T`
- Dans `string | null`, `string` ne remplit pas la condition, `null` la remplit, donc le résultat est `string`
- Dans `string | number`, aucun des deux ne remplit la condition, donc le résultat est `string | number`

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

> Modèles avancés de génériques

### Paramètres de type par défaut

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // Utilise le type par défaut string
const container2: Container<number> = { value: 42 };
```

### Paramètres de types multiples

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### Types utilitaires génériques

```typescript
// Partial : toutes les propriétés deviennent optionnelles
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required : toutes les propriétés deviennent obligatoires
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick : sélectionner des propriétés spécifiques
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit : exclure des propriétés spécifiques
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> Meilleures pratiques

### Pratiques recommandées

```typescript
// 1. Utiliser des noms de génériques significatifs
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. Utiliser des contraintes pour limiter la portée des génériques
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. Fournir des paramètres de type par défaut
interface Config<T = string> {
  value: T;
}

// 4. Utiliser les types utilitaires génériques
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### Pratiques à éviter

```typescript
// 1. Ne pas abuser des génériques
function process<T>(value: T): T {  // ⚠️ S'il n'y a qu'un seul type, les génériques ne sont pas nécessaires
  return value;
}

// 2. Ne pas utiliser de noms de génériques à une seule lettre (sauf dans les cas simples)
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ Signification peu claire
  // ...
}

// 3. Ne pas ignorer les contraintes
function process<T>(value: T) {  // ⚠️ S'il y a des restrictions, des contraintes doivent être ajoutées
  return value.length;  // Erreur possible
}
```

## 7. Interview Summary

> Résumé pour l'entretien

### Référence rapide

**Concepts centraux des génériques** :
- Ne pas spécifier de type concret à la définition, mais à l'utilisation
- Syntaxe : `<T>` définit le paramètre de type
- Applicable aux fonctions, interfaces, classes

**Contraintes génériques** :
- Utiliser `extends` pour limiter la portée des génériques
- `K extends keyof T` assure que K est une clé de T
- Possibilité de combiner plusieurs contraintes

**Modèles courants** :
- Fonction générique : `function identity<T>(arg: T): T`
- Interface générique : `interface Box<T> { value: T; }`
- Classe générique : `class Container<T> { ... }`

### Exemples de réponses pour l'entretien

**Q : Que sont les génériques ? Pourquoi sont-ils nécessaires ?**

> "Les génériques sont un mécanisme en TypeScript pour créer des composants réutilisables, où le type concret n'est pas spécifié à la définition mais à l'utilisation. Les principaux avantages des génériques sont : 1) Meilleure réutilisabilité du code - une fonction peut gérer plusieurs types ; 2) Maintien de la sécurité des types - vérification des erreurs de type à la compilation ; 3) Réduction du code dupliqué - pas besoin d'écrire une fonction pour chaque type. Par exemple, `function identity<T>(arg: T): T` peut gérer n'importe quel type sans écrire des fonctions séparées pour string, number, etc."

**Q : Que sont les contraintes génériques ? Comment les utiliser ?**

> "Les contraintes génériques utilisent le mot-clé `extends` pour limiter la portée du type générique. Par exemple, `function getLength<T extends { length: number }>(arg: T)` assure que T doit avoir la propriété length. Une autre contrainte courante est `K extends keyof T`, qui assure que K doit être l'une des clés de T, permettant un accès aux propriétés avec sécurité de types. Les contraintes aident à maintenir la sécurité des types lors de l'utilisation de génériques tout en fournissant les informations de type nécessaires."

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
