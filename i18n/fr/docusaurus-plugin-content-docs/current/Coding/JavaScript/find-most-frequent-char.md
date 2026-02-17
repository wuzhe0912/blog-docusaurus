---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> Description du problème

Implémentez une fonction qui reçoit une chaîne de caractères et retourne le caractère qui apparaît le plus souvent.

### Exemples

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> Méthodes d'implémentation

### Méthode 1 : Comptage avec un objet (version de base)

**Approche** : Parcourir la chaîne, utiliser un objet pour enregistrer le nombre d'apparitions de chaque caractère, puis trouver celui qui apparaît le plus.

```javascript
function findMostFrequentChar(str) {
  // Initialiser l'objet pour stocker les caractères et les compteurs
  const charCount = {};

  // Initialiser les variables pour le compteur maximum et le caractère
  let maxCount = 0;
  let maxChar = '';

  // Parcourir la chaîne
  for (let char of str) {
    // Si le caractère n'est pas dans l'objet, mettre le compteur à 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Incrémenter le compteur de ce caractère
    charCount[char]++;

    // Si le compteur de ce caractère est supérieur au compteur maximum
    // Mettre à jour le compteur maximum et le caractère maximum
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Retourner le caractère maximum
  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Complexité temporelle** : O(n), où n est la longueur de la chaîne
**Complexité spatiale** : O(k), où k est le nombre de caractères différents

### Méthode 2 : Compter d'abord, puis trouver le maximum (deux phases)

**Approche** : D'abord parcourir une fois pour calculer les apparitions de tous les caractères, puis une deuxième fois pour trouver le maximum.

```javascript
function findMostFrequentChar(str) {
  // Phase 1 : Calculer les apparitions de chaque caractère
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Phase 2 : Trouver le caractère le plus fréquent
  let maxCount = 0;
  let maxChar = '';

  for (let char in charCount) {
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Avantages** : Logique plus claire, traitement par phases
**Inconvénients** : Nécessite deux parcours

### Méthode 3 : Utilisation de Map (ES6)

**Approche** : Utiliser Map pour stocker la correspondance entre caractères et compteurs.

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Avantages** : Utiliser Map est plus conforme au style JavaScript moderne
**Inconvénients** : Pour les scénarios simples, un objet peut être plus intuitif

### Méthode 4 : Utilisation de reduce (style fonctionnel)

**Approche** : Utiliser `reduce` et `Object.entries` pour implémenter.

```javascript
function findMostFrequentChar(str) {
  // Calculer les apparitions de chaque caractère
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Trouver le caractère le plus fréquent
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Avantages** : Style fonctionnel, code concis
**Inconvénients** : Lisibilité réduite, performance légèrement inférieure

### Méthode 5 : Gestion de plusieurs valeurs maximales égales

**Approche** : Si plusieurs caractères ont la même fréquence maximale, retourner un tableau ou le premier trouvé.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Calculer les apparitions de chaque caractère
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Trouver tous les caractères avec la fréquence maximale
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Retourner le premier trouvé (ou retourner le tableau entier)
  return mostFrequentChars[0];
  // Ou retourner tous : return mostFrequentChars;
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a' (le premier trouvé)
```

## 3. Edge Cases

> Gestion des cas limites

### Chaîne vide

```javascript
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return ''; // Ou throw new Error('String cannot be empty')
  }

  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Majuscules et minuscules

```javascript
function findMostFrequentChar(str, caseSensitive = true) {
  const processedStr = caseSensitive ? str : str.toLowerCase();
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('Hello', false)); // 'l' (insensible à la casse)
console.log(findMostFrequentChar('Hello', true)); // 'l' (sensible à la casse)
```

### Espaces et caractères spéciaux

```javascript
function findMostFrequentChar(str, ignoreSpaces = false) {
  const processedStr = ignoreSpaces ? str.replace(/\s/g, '') : str;
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of processedStr) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('hello world', true)); // 'l' (espaces ignorés)
console.log(findMostFrequentChar('hello world', false)); // ' ' (espace)
```

## 4. Common Interview Questions

> Questions d'entretien fréquentes

### Question 1 : Implémentation basique

Implémentez une fonction qui trouve le caractère le plus fréquent dans une chaîne.

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Points clés** :

- Utiliser un objet ou Map pour enregistrer la fréquence de chaque caractère
- Mettre à jour le maximum pendant le parcours
- Complexité temporelle O(n), complexité spatiale O(k)

</details>

### Question 2 : Version optimisée

Optimisez la fonction précédente pour gérer plusieurs valeurs maximales égales.

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Phase 1 : Calculer les apparitions de chaque caractère
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Phase 2 : Trouver tous les caractères avec la fréquence maximale
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Retourner le premier ou tous selon le besoin
  return mostFrequentChars[0]; // Ou retourner mostFrequentChars
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a'
```

</details>

### Question 3 : Implémentation avec Map

Implémentez cette fonction en utilisant Map d'ES6.

<details>
<summary>Cliquez pour voir la réponse</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = new Map();
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    const count = (charCount.get(char) || 0) + 1;
    charCount.set(char, count);

    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Map vs Object** :

- **Map** : Plus adapté aux paires clé-valeur dynamiques, les clés peuvent être de n'importe quel type
- **Object** : Plus simple et intuitif, adapté aux clés de type string

</details>

## 5. Best Practices

> Bonnes pratiques

### Pratiques recommandées

```javascript
// 1. Utiliser des noms de variables clairs
function findMostFrequentChar(str) {
  const charCount = {}; // Exprimer clairement l'objectif
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Gérer les cas limites
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Mettre à jour le maximum pendant le parcours (un seul parcours)
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;
  let maxChar = '';

  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  return maxChar;
}
```

### Pratiques à éviter

```javascript
// 1. Ne pas utiliser deux parcours (sauf si nécessaire)
// ❌ Performance inférieure
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Deuxième parcours
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. Ne pas oublier de gérer les chaînes vides
// ❌ Pourrait retourner undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // Avec une chaîne vide, maxChar est ''
}

// 3. Ne pas utiliser un style fonctionnel trop complexe (sauf si c'est une convention d'équipe)
// ❌ Lisibilité réduite
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> Résumé pour les entretiens

### Aide-mémoire

**Points d'implémentation** :

1. Utiliser un objet ou Map pour enregistrer la fréquence de chaque caractère
2. Mettre à jour le maximum pendant le parcours
3. Complexité temporelle O(n), complexité spatiale O(k)
4. Gérer les cas limites (chaîne vide, majuscules/minuscules, etc.)

**Directions d'optimisation** :

- Compléter en un seul parcours (compter et trouver le maximum simultanément)
- Utiliser Map pour les scénarios complexes
- Gérer plusieurs valeurs maximales égales
- Considérer les majuscules/minuscules, espaces et autres cas spéciaux

### Exemple de réponse en entretien

**Q : Implémentez une fonction qui trouve le caractère le plus fréquent dans une chaîne.**

> "J'utiliserais un objet pour enregistrer la fréquence de chaque caractère, et je mettrais à jour le maximum pendant le parcours de la chaîne. L'implémentation concrète est : initialiser un objet vide charCount pour stocker les caractères et les compteurs, initialiser les variables maxCount et maxChar. Ensuite parcourir la chaîne, pour chaque caractère, s'il n'est pas dans l'objet l'initialiser à 0, puis incrémenter le compteur. Si le compteur du caractère actuel est supérieur à maxCount, mettre à jour maxCount et maxChar. Enfin retourner maxChar. La complexité temporelle de cette méthode est O(n) et la complexité spatiale est O(k), où n est la longueur de la chaîne et k est le nombre de caractères différents."

## Référence

- [MDN - String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
