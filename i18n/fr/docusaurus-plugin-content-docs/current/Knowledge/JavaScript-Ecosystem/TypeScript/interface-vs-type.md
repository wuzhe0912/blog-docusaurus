---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> Que sont Interface et Type Alias ?

### Interface

**Definition** : Utilisee pour definir la structure d'un objet, decrivant les proprietes et methodes qu'un objet doit avoir.

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // Propriete optionnelle
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias (Alias de type)

**Definition** : Cree un alias pour un type, utilisable avec n'importe quel type, pas seulement les objets.

```typescript
type User = {
  name: string;
  age: number;
  email?: string;
};

const user: User = {
  name: 'John',
  age: 30,
};
```

## 2. Interface vs Type Alias: Key Differences

> Principales differences entre Interface et Type Alias

### 1. Methode d'extension

**Interface : utilisation de extends**

```typescript
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

**Type Alias : utilisation du type d'intersection**

```typescript
type Animal = { name: string; };
type Dog = Animal & { breed: string; };
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

### 2. Fusion (Declaration Merging)

**Interface : supporte la fusion**

```typescript
interface User { name: string; }
interface User { age: number; }
// Fusionne automatiquement en { name: string; age: number; }
const user: User = { name: 'John', age: 30 };
```

**Type Alias : ne supporte pas la fusion**

```typescript
type User = { name: string; };
type User = { age: number; };  // ❌ Erreur : Duplicate identifier 'User'
```

### 3. Portee d'application

**Interface : principalement pour les structures d'objets**

```typescript
interface User { name: string; age: number; }
```

**Type Alias : utilisable avec n'importe quel type**

```typescript
type ID = string | number;
type Greet = (name: string) => string;
type Status = 'active' | 'inactive' | 'pending';
type Point = [number, number];
type User = { name: string; age: number; };
```

### 4. Proprietes calculees

**Interface : ne supporte pas les proprietes calculees**

```typescript
interface User { [key: string]: any; }
```

**Type Alias : supporte des operations de type plus complexes**

```typescript
type Keys = 'name' | 'age' | 'email';
type User = { [K in Keys]: string; };
```

## 3. When to Use Interface vs Type Alias?

> Quand utiliser Interface ? Quand utiliser Type Alias ?

### Utiliser Interface quand

1. **Definir des structures d'objets** (le plus courant)
2. **La fusion de declarations est necessaire** (ex. etendre les types de packages tiers)
3. **Definir des contrats de classe**

### Utiliser Type Alias quand

1. **Definir des types union ou intersection** : `type ID = string | number;`
2. **Definir des types de fonction** : `type EventHandler = (event: Event) => void;`
3. **Definir des tuples** : `type Point = [number, number];`
4. **Des types mappes ou conditionnels sont necessaires**

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Differences de base

Expliquez les differences entre les deux methodes de definition suivantes.

```typescript
interface User { name: string; age: number; }
type User = { name: string; age: number; };
```

<details>
<summary>Cliquez pour voir la reponse</summary>

**Points communs** : Les deux peuvent definir des structures d'objets, s'utilisent de la meme maniere, les deux peuvent etre etendus.

**Differences** :
1. **Fusion de declarations** : Interface la supporte ; Type Alias non.
2. **Portee** : Interface est principalement pour les objets ; Type Alias pour n'importe quel type.

**Recommandation** : Pour les structures d'objets, les deux conviennent. Pour la fusion de declarations, utilisez Interface. Pour les types non-objet, utilisez Type Alias.

</details>

### Question 2 : Methodes d'extension

Expliquez les differences entre `extends` et l'intersection `&`.

<details>
<summary>Cliquez pour voir la reponse</summary>

- **Syntaxe** : Interface utilise `extends`, Type utilise `&`
- **Resultat** : Les deux produisent le meme resultat
- **Lisibilite** : `extends` d'Interface est plus intuitif
- **Flexibilite** : `&` de Type peut combiner plusieurs types

</details>

### Question 3 : Fusion de declarations

```typescript
interface User { name: string; }
interface User { age: number; }
const user: User = { name: 'John' };  // Il manque age ?
```

<details>
<summary>Cliquez pour voir la reponse</summary>

Les deux declarations sont automatiquement fusionnees. L'absence de `age` genere une erreur. Type Alias ne supporte pas la fusion de declarations.

</details>

### Question 4 : Implementation (implements)

<details>
<summary>Cliquez pour voir la reponse</summary>

Les deux peuvent etre utilises avec `implements`. Interface est plus courant pour les contrats de classe. Les Type Alias de fonctions ne peuvent pas etre implementes.

</details>

## 5. Best Practices

> Meilleures pratiques

### Pratiques recommandees

```typescript
// 1. Pour les objets, privilegier Interface
interface User { name: string; age: number; }

// 2. Pour les types union, utiliser Type Alias
type Status = 'active' | 'inactive' | 'pending';

// 3. Pour les types de fonction, utiliser Type Alias
type EventHandler = (event: Event) => void;

// 4. Pour la fusion de declarations, utiliser Interface
interface Window { customProperty: string; }

// 5. Pour les contrats de classe, utiliser Interface
interface Flyable { fly(): void; }
class Bird implements Flyable { fly(): void {} }
```

### Pratiques a eviter

```typescript
// 1. Ne pas melanger Interface et Type Alias pour la meme structure
// 2. Ne pas utiliser Type Alias pour des objets simples (Interface est plus approprie)
// 3. Ne pas utiliser Interface pour des types non-objet
```

## 6. Interview Summary

> Resume pour l'entretien

### Reference rapide

**Interface** : objets, Declaration Merging, `extends`, contrats de classe.

**Type Alias** : tout type, pas de Declaration Merging, `&` intersection, union/fonction/tuple.

### Exemples de reponses pour l'entretien

**Q : Quelles sont les differences entre Interface et Type Alias ?**

> "Interface et Type Alias peuvent tous deux definir des structures d'objets, mais ont des differences cles : 1) Interface supporte la fusion de declarations ; Type Alias non. 2) Interface est pour les objets ; Type Alias pour tout type. 3) Interface utilise extends ; Type Alias utilise &. 4) Interface est mieux adapte aux contrats de classe. Pour les objets, les deux conviennent. Pour la fusion, utilisez Interface. Pour les types non-objet, utilisez Type Alias."

**Q : Quand utiliser Interface et quand Type Alias ?**

> "Utilisez Interface pour : structures d'objets, fusion de declarations, contrats de classe. Utilisez Type Alias pour : types union/intersection, types de fonction, tuples, types mappes/conditionnels. En resume, privilegiez Interface pour les objets, Type Alias pour le reste."

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)
