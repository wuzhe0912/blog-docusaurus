---
id: js-null-undefined
title: '[Easy] 📄 null & undefined'
slug: /js-null-undefined
tags: [JavaScript, Quiz, Easy]
---

## Comparaison des différences

- **`undefined`** :
  - Indique qu'une variable a été déclarée mais qu'aucune valeur ne lui a encore été attribuée.
  - C'est la valeur par défaut des variables non initialisées.
  - Si une fonction n'a pas de valeur de retour explicite, elle renvoie `undefined` par défaut.
- **`null`** :
  - Représente une valeur vide ou l'absence de valeur.
  - Doit généralement être explicitement assigné à `null`.
  - Utilisé pour indiquer qu'une variable ne pointe intentionnellement vers aucun objet ou valeur.

## Exemple

```js
let x;
console.log(x); // Sortie : undefined

function foo() {}
console.log(foo()); // Sortie : undefined

let y = null;
console.log(y); // Sortie : null

let obj = { x: 5 };
obj.x = null;
console.log(obj.x); // Sortie : null
```

## Vérification avec typeof

```js
console.log(typeof undefined); // Sortie : "undefined"
console.log(typeof null); // Sortie : "object"

console.log(null == undefined); // Sortie : true
console.log(null === undefined); // Sortie : false
```
