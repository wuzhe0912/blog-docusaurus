---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> Qu'est-ce que TypeScript ?

TypeScript est un langage de programmation open source developpe par Microsoft, et c'est un **surensemble (Superset)** de JavaScript. Cela signifie que tout code JavaScript valide est aussi du code TypeScript valide.

**Caracteristiques principales** :

- Ajoute un **systeme de types statiques** a JavaScript
- Effectue la verification des types a la compilation
- Se convertit en JavaScript pur apres compilation
- Offre une meilleure experience de developpement et un meilleur support d'outils

## 2. What are the differences between TypeScript and JavaScript?

> Quelles sont les differences entre TypeScript et JavaScript ?

### Differences principales

| Caracteristique | JavaScript              | TypeScript              |
| --------------- | ----------------------- | ----------------------- |
| Systeme de types | Dynamique (verification a l'execution) | Statique (verification a la compilation) |
| Compilation     | Non necessaire          | Compilation vers JavaScript requise |
| Annotations     | Non supportees          | Annotations de type supportees |
| Detection d'erreurs | A l'execution       | A la compilation        |
| Support IDE     | Basique                 | Autocompletion et refactoring puissants |
| Courbe d'apprentissage | Basse              | Plus elevee             |

### Differences du systeme de types

**JavaScript (typage dynamique)** :

```javascript
let value = 10;
value = 'hello'; // Changement de type possible
function add(a, b) { return a + b; }
add(1, 2); // 3
add('1', '2'); // '12' (concatenation de chaines)
add(1, '2'); // '12' (conversion de type)
```

**TypeScript (typage statique)** :

```typescript
let value: number = 10;
value = 'hello'; // ❌ Erreur de compilation

function add(a: number, b: number): number { return a + b; }
add(1, 2); // ✅ 3
add('1', '2'); // ❌ Erreur de compilation
```

### Processus de compilation

```typescript
// Code source TypeScript
let message: string = 'Hello World';
console.log(message);

// ↓ Apres compilation, converti en JavaScript
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> Pourquoi utiliser TypeScript ?

### Avantages

1. **Detection precoce des erreurs** - Detection des erreurs de type a la compilation
2. **Meilleur support IDE** - Autocompletion et refactoring
3. **Lisibilite du code** - Les annotations de type clarifient l'intention des fonctions
4. **Refactoring plus sur** - Detection automatique des emplacements a mettre a jour

### Inconvenients

1. **Etape de compilation requise** - Augmente la complexite du flux de developpement
2. **Courbe d'apprentissage** - Necessite d'apprendre le systeme de types
3. **Taille des fichiers** - Les informations de type augmentent la taille du code source (sans effet apres compilation)
4. **Configuration complexe** - Necessite de configurer `tsconfig.json`

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Moment de la verification des types

<details>
<summary>Cliquez pour voir la reponse</summary>

- JavaScript effectue les conversions de type a **l'execution**, ce qui peut produire des resultats inattendus
- TypeScript verifie les types a **la compilation**, detectant les erreurs en amont

</details>

### Question 2 : Inference de type

<details>
<summary>Cliquez pour voir la reponse</summary>

TypeScript infere automatiquement le type a partir de la valeur initiale. Apres l'inference, le type ne peut pas etre change (sauf si declare explicitement comme `any` ou type `union`).

</details>

### Question 3 : Comportement a l'execution

<details>
<summary>Cliquez pour voir la reponse</summary>

- Les **annotations de type TypeScript disparaissent completement apres compilation**
- Le JavaScript compile est identique au JavaScript pur
- TypeScript ne fournit la verification de types que pendant la **phase de developpement**, sans affecter les performances a l'execution

</details>

### Question 4 : Erreurs de type vs Erreurs d'execution

<details>
<summary>Cliquez pour voir la reponse</summary>

- **Erreur de compilation TypeScript** : Detectee en phase de developpement, le programme ne peut pas s'executer
- **Erreur d'execution JavaScript** : Detectee pendant l'utilisation, provoque un crash du programme

TypeScript peut prevenir de nombreuses erreurs d'execution grace a la verification de types.

</details>

## 5. Best Practices

> Meilleures pratiques

### Pratiques recommandees

```typescript
// 1. Specifier explicitement le type de retour des fonctions
function add(a: number, b: number): number { return a + b; }

// 2. Utiliser interface pour les structures d'objets complexes
interface User { name: string; age: number; email?: string; }

// 3. Preferer unknown a any
function processValue(value: unknown): void {
  if (typeof value === 'string') { console.log(value.toUpperCase()); }
}

// 4. Utiliser des alias de type pour ameliorer la lisibilite
type UserID = string;
```

## 6. Interview Summary

> Resume pour l'entretien

**Q : Quelles sont les principales differences entre TypeScript et JavaScript ?**

> "TypeScript est un surensemble de JavaScript, la principale difference est l'ajout d'un systeme de types statiques. JavaScript est un langage a typage dynamique avec verification a l'execution ; TypeScript est un langage a typage statique avec verification a la compilation. Cela permet de detecter les erreurs liees aux types des la phase de developpement. Apres compilation, TypeScript se convertit en JavaScript pur, donc le comportement a l'execution est identique a celui de JavaScript."

**Q : Pourquoi utiliser TypeScript ?**

> "Les principaux avantages sont : 1) Detection precoce des erreurs a la compilation ; 2) Meilleur support IDE avec autocompletion et refactoring ; 3) Meilleure lisibilite du code grace aux annotations de type ; 4) Refactoring plus sur avec detection automatique des emplacements a mettre a jour. Cependant, il faut prendre en compte la courbe d'apprentissage et le cout supplementaire de l'etape de compilation."

## Reference

- [Documentation officielle TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
