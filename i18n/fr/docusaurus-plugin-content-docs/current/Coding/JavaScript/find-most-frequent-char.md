---
id: find-most-frequent-char-js
title: '[Easy] Find Most Frequent Character'
slug: /find-most-frequent-char-js
tags: [JavaScript, Coding, Easy]
---

## 1. Question Description

> Description du probleme

Implementez une fonction qui recoit une chaine de caracteres et retourne le caractere qui apparait le plus souvent.

### Exemples

```javascript
findMostFrequentChar('abcccccccd'); // 'c'
findMostFrequentChar('hello world'); // 'l'
findMostFrequentChar('javascript'); // 'a'
```

## 2. Implementation Methods

> Methodes d'implementation

### Methode 1 : Comptage avec un objet (version de base)

**Approche** : Parcourir la chaine, utiliser un objet pour enregistrer le nombre d'apparitions de chaque caractere, puis trouver celui qui apparait le plus.

```javascript
function findMostFrequentChar(str) {
  // Initialiser l'objet pour stocker les caracteres et les compteurs
  const charCount = {};

  // Initialiser les variables pour le compteur maximum et le caractere
  let maxCount = 0;
  let maxChar = '';

  // Parcourir la chaine
  for (let char of str) {
    // Si le caractere n'est pas dans l'objet, mettre le compteur a 0
    if (!charCount[char]) {
      charCount[char] = 0;
    }

    // Incrementer le compteur de ce caractere
    charCount[char]++;

    // Si le compteur de ce caractere est superieur au compteur maximum
    // Mettre a jour le compteur maximum et le caractere maximum
    if (charCount[char] > maxCount) {
      maxCount = charCount[char];
      maxChar = char;
    }
  }

  // Retourner le caractere maximum
  return maxChar;
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
console.log(findMostFrequentChar('hello world')); // 'l'
```

**Complexite temporelle** : O(n), ou n est la longueur de la chaine
**Complexite spatiale** : O(k), ou k est le nombre de caracteres differents

### Methode 2 : Compter d'abord, puis trouver le maximum (deux phases)

**Approche** : D'abord parcourir une fois pour calculer les apparitions de tous les caracteres, puis une deuxieme fois pour trouver le maximum.

```javascript
function findMostFrequentChar(str) {
  // Phase 1 : Calculer les apparitions de chaque caractere
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Phase 2 : Trouver le caractere le plus frequent
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
**Inconvenients** : Necessite deux parcours

### Methode 3 : Utilisation de Map (ES6)

**Approche** : Utiliser Map pour stocker la correspondance entre caracteres et compteurs.

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
**Inconvenients** : Pour les scenarios simples, un objet peut etre plus intuitif

### Methode 4 : Utilisation de reduce (style fonctionnel)

**Approche** : Utiliser `reduce` et `Object.entries` pour implementer.

```javascript
function findMostFrequentChar(str) {
  // Calculer les apparitions de chaque caractere
  const charCount = str.split('').reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});

  // Trouver le caractere le plus frequent
  return Object.entries(charCount).reduce((max, [char, count]) => {
    return count > max[1] ? [char, count] : max;
  }, ['', 0])[0];
}

// Test
console.log(findMostFrequentChar('abcccccccd')); // 'c'
```

**Avantages** : Style fonctionnel, code concis
**Inconvenients** : Lisibilite reduite, performance legerement inferieure

### Methode 5 : Gestion de plusieurs valeurs maximales egales

**Approche** : Si plusieurs caracteres ont la meme frequence maximale, retourner un tableau ou le premier trouve.

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Calculer les apparitions de chaque caractere
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Trouver tous les caracteres avec la frequence maximale
  const mostFrequentChars = [];
  for (let char in charCount) {
    if (charCount[char] === maxCount) {
      mostFrequentChars.push(char);
    }
  }

  // Retourner le premier trouve (ou retourner le tableau entier)
  return mostFrequentChars[0];
  // Ou retourner tous : return mostFrequentChars;
}

// Test
console.log(findMostFrequentChar('aabbcc')); // 'a' (le premier trouve)
```

## 3. Edge Cases

> Gestion des cas limites

### Chaine vide

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
console.log(findMostFrequentChar('Hello', false)); // 'l' (insensible a la casse)
console.log(findMostFrequentChar('Hello', true)); // 'l' (sensible a la casse)
```

### Espaces et caracteres speciaux

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
console.log(findMostFrequentChar('hello world', true)); // 'l' (espaces ignores)
console.log(findMostFrequentChar('hello world', false)); // ' ' (espace)
```

## 4. Common Interview Questions

> Questions d'entretien frequentes

### Question 1 : Implementation basique

Implementez une fonction qui trouve le caractere le plus frequent dans une chaine.

<details>
<summary>Cliquez pour voir la reponse</summary>

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

**Points cles** :

- Utiliser un objet ou Map pour enregistrer la frequence de chaque caractere
- Mettre a jour le maximum pendant le parcours
- Complexite temporelle O(n), complexite spatiale O(k)

</details>

### Question 2 : Version optimisee

Optimisez la fonction precedente pour gerer plusieurs valeurs maximales egales.

<details>
<summary>Cliquez pour voir la reponse</summary>

```javascript
function findMostFrequentChar(str) {
  const charCount = {};
  let maxCount = 0;

  // Phase 1 : Calculer les apparitions de chaque caractere
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
    maxCount = Math.max(maxCount, charCount[char]);
  }

  // Phase 2 : Trouver tous les caracteres avec la frequence maximale
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

### Question 3 : Implementation avec Map

Implementez cette fonction en utilisant Map d'ES6.

<details>
<summary>Cliquez pour voir la reponse</summary>

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

- **Map** : Plus adapte aux paires cle-valeur dynamiques, les cles peuvent etre de n'importe quel type
- **Object** : Plus simple et intuitif, adapte aux cles de type string

</details>

## 5. Best Practices

> Bonnes pratiques

### Pratiques recommandees

```javascript
// 1. Utiliser des noms de variables clairs
function findMostFrequentChar(str) {
  const charCount = {}; // Exprimer clairement l'objectif
  let maxCount = 0;
  let maxChar = '';
  // ...
}

// 2. Gerer les cas limites
function findMostFrequentChar(str) {
  if (!str || str.length === 0) {
    return '';
  }
  // ...
}

// 3. Mettre a jour le maximum pendant le parcours (un seul parcours)
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

### Pratiques a eviter

```javascript
// 1. Ne pas utiliser deux parcours (sauf si necessaire)
// ❌ Performance inferieure
function findMostFrequentChar(str) {
  const charCount = {};
  for (let char of str) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
  // Deuxieme parcours
  return Object.entries(charCount).sort((a, b) => b[1] - a[1])[0][0];
}

// 2. Ne pas oublier de gerer les chaines vides
// ❌ Pourrait retourner undefined
function findMostFrequentChar(str) {
  const charCount = {};
  // ...
  return maxChar; // Avec une chaine vide, maxChar est ''
}

// 3. Ne pas utiliser un style fonctionnel trop complexe (sauf si c'est une convention d'equipe)
// ❌ Lisibilite reduite
const findMostFrequentChar = (str) =>
  Object.entries(
    str.split('').reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {})
  ).reduce((max, [char, count]) => (count > max[1] ? [char, count] : max), ['', 0])[0];
```

## 6. Interview Summary

> Resume pour les entretiens

### Aide-memoire

**Points d'implementation** :

1. Utiliser un objet ou Map pour enregistrer la frequence de chaque caractere
2. Mettre a jour le maximum pendant le parcours
3. Complexite temporelle O(n), complexite spatiale O(k)
4. Gerer les cas limites (chaine vide, majuscules/minuscules, etc.)

**Directions d'optimisation** :

- Completer en un seul parcours (compter et trouver le maximum simultanement)
- Utiliser Map pour les scenarios complexes
- Gerer plusieurs valeurs maximales egales
- Considerer les majuscules/minuscules, espaces et autres cas speciaux

### Exemple de reponse en entretien

**Q : Implementez une fonction qui trouve le caractere le plus frequent dans une chaine.**

> "J'utiliserais un objet pour enregistrer la frequence de chaque caractere, et je mettrais a jour le maximum pendant le parcours de la chaine. L'implementation concrete est : initialiser un objet vide charCount pour stocker les caracteres et les compteurs, initialiser les variables maxCount et maxChar. Ensuite parcourir la chaine, pour chaque caractere, s'il n'est pas dans l'objet l'initialiser a 0, puis incrementer le compteur. Si le compteur du caractere actuel est superieur a maxCount, mettre a jour maxCount et maxChar. Enfin retourner maxChar. La complexite temporelle de cette methode est O(n) et la complexite spatiale est O(k), ou n est la longueur de la chaine et k est le nombre de caracteres differents."

## Reference

- [MDN - String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String)
- [MDN - Map](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Object.entries()](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)
