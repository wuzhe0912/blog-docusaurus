---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> Qu'est-ce que TypeScript ?

TypeScript est un langage de programmation open source développé par Microsoft, et c'est un **surensemble (Superset)** de JavaScript. Cela signifie que tout code JavaScript valide est aussi du code TypeScript valide.

**Caractéristiques principales** :

- Ajoute un **système de types statiques** à JavaScript
- Effectue la vérification des types à la compilation
- Se convertit en JavaScript pur après compilation
- Offre une meilleure expérience de développement et un meilleur support d'outils

## 2. What are the differences between TypeScript and JavaScript?

> Quelles sont les différences entre TypeScript et JavaScript ?

### Différences principales

| Caractéristique | JavaScript              | TypeScript              |
| --------------- | ----------------------- | ----------------------- |
| Système de types | Dynamique (vérification à l'exécution) | Statique (vérification à la compilation) |
| Compilation     | Non nécessaire          | Compilation vers JavaScript requise |
| Annotations     | Non supportées          | Annotations de type supportées |
| Détection d'erreurs | À l'exécution       | À la compilation        |
| Support IDE     | Basique                 | Autocomplétion et refactoring puissants |
| Courbe d'apprentissage | Basse              | Plus élevée             |

### Différences du système de types

**JavaScript (typage dynamique)** :

```javascript
let value = 10;
value = 'hello'; // Changement de type possible
function add(a, b) { return a + b; }
add(1, 2); // 3
add('1', '2'); // '12' (concaténation de chaînes)
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

// ↓ Après compilation, converti en JavaScript
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> Pourquoi utiliser TypeScript ?

### Avantages

1. **Détection précoce des erreurs** - Détection des erreurs de type à la compilation
2. **Meilleur support IDE** - Autocomplétion et refactoring
3. **Lisibilité du code** - Les annotations de type clarifient l'intention des fonctions
4. **Refactoring plus sûr** - Détection automatique des emplacements à mettre à jour

### Inconvénients

1. **Étape de compilation requise** - Augmente la complexité du flux de développement
2. **Courbe d'apprentissage** - Nécessite d'apprendre le système de types
3. **Taille des fichiers** - Les informations de type augmentent la taille du code source (sans effet après compilation)
4. **Configuration complexe** - Nécessite de configurer `tsconfig.json`

## 4. Common Interview Questions

> Questions d'entretien courantes

### Question 1 : Moment de la vérification des types

<details>
<summary>Cliquez pour voir la réponse</summary>

- JavaScript effectue les conversions de type à **l'exécution**, ce qui peut produire des résultats inattendus
- TypeScript vérifie les types à **la compilation**, détectant les erreurs en amont

</details>

### Question 2 : Inférence de type

<details>
<summary>Cliquez pour voir la réponse</summary>

TypeScript infère automatiquement le type à partir de la valeur initiale. Après l'inférence, le type ne peut pas être changé (sauf si déclaré explicitement comme `any` ou type `union`).

</details>

### Question 3 : Comportement à l'exécution

<details>
<summary>Cliquez pour voir la réponse</summary>

- Les **annotations de type TypeScript disparaissent complètement après compilation**
- Le JavaScript compilé est identique au JavaScript pur
- TypeScript ne fournit la vérification de types que pendant la **phase de développement**, sans affecter les performances à l'exécution

</details>

### Question 4 : Erreurs de type vs Erreurs d'exécution

<details>
<summary>Cliquez pour voir la réponse</summary>

- **Erreur de compilation TypeScript** : Détectée en phase de développement, le programme ne peut pas s'exécuter
- **Erreur d'exécution JavaScript** : Détectée pendant l'utilisation, provoque un crash du programme

TypeScript peut prévenir de nombreuses erreurs d'exécution grâce à la vérification de types.

</details>

## 5. Best Practices

> Meilleures pratiques

### Pratiques recommandées

```typescript
// 1. Spécifier explicitement le type de retour des fonctions
function add(a: number, b: number): number { return a + b; }

// 2. Utiliser interface pour les structures d'objets complexes
interface User { name: string; age: number; email?: string; }

// 3. Préférer unknown à any
function processValue(value: unknown): void {
  if (typeof value === 'string') { console.log(value.toUpperCase()); }
}

// 4. Utiliser des alias de type pour améliorer la lisibilité
type UserID = string;
```

## 6. Interview Summary

> Résumé pour l'entretien

**Q : Quelles sont les principales différences entre TypeScript et JavaScript ?**

> "TypeScript est un surensemble de JavaScript, la principale différence est l'ajout d'un système de types statiques. JavaScript est un langage à typage dynamique avec vérification à l'exécution ; TypeScript est un langage à typage statique avec vérification à la compilation. Cela permet de détecter les erreurs liées aux types dès la phase de développement. Après compilation, TypeScript se convertit en JavaScript pur, donc le comportement à l'exécution est identique à celui de JavaScript."

**Q : Pourquoi utiliser TypeScript ?**

> "Les principaux avantages sont : 1) Détection précoce des erreurs à la compilation ; 2) Meilleur support IDE avec autocomplétion et refactoring ; 3) Meilleure lisibilité du code grâce aux annotations de type ; 4) Refactoring plus sûr avec détection automatique des emplacements à mettre à jour. Cependant, il faut prendre en compte la courbe d'apprentissage et le coût supplémentaire de l'étape de compilation."

## Reference

- [Documentation officielle TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
