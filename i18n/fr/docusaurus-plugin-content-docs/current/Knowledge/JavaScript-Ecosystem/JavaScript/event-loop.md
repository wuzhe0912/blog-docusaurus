---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> Pourquoi JavaScript a-t-il besoin du traitement asynchrone ? Et expliquez le callback et l'event loop

JavaScript est essentiellement un langage monothread, car l'une de ses tâches est de modifier la structure DOM du navigateur. Si plusieurs threads modifiaient le même nœud simultanément, la situation deviendrait très complexe. Pour éviter cela, le monothread a été adopté.

Le traitement asynchrone est une solution viable dans le contexte du monothread. Si une action nécessite 2 secondes d'attente, le navigateur ne peut évidemment pas attendre sur place. Il exécute donc d'abord tout le travail synchrone, tandis que les tâches asynchrones sont placées dans la task queue (file d'attente des tâches).

L'environnement où le navigateur exécute le travail synchrone peut être compris comme le call stack. Le navigateur exécute séquentiellement les tâches dans le call stack. Lorsqu'il détecte que le call stack est vide, il prend les tâches en attente de la task queue et les place dans le call stack pour les exécuter séquentiellement.

1. Le navigateur vérifie si le call stack est vide => Non => Continue l'exécution des tâches dans le call stack
2. Le navigateur vérifie si le call stack est vide => Oui => Vérifie s'il y a des tâches en attente dans la task queue => Oui => Les déplace dans le call stack pour exécution

Ce processus de répétition continue est le concept de l'event loop.

```js
console.log(1);

// Cette fonction asynchrone est le callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// Affiche 1 3 2 dans l'ordre
```

## 2. Why is setInterval not accurate in terms of timing ?

> Pourquoi `setInterval` n'est-il pas précis en termes de timing ?

1. Étant donné que JavaScript est un langage monothread (il ne peut exécuter qu'une tâche à la fois, les autres doivent attendre dans la Queue), lorsque le temps d'exécution du callback de setInterval dépasse l'intervalle configuré, l'exécution suivante est retardée. Par exemple, si setInterval est configuré pour exécuter une fonction chaque seconde, mais qu'une action dans la fonction prend deux secondes, la prochaine exécution sera retardée d'une seconde. Au fil du temps, le timing de setInterval devient de plus en plus imprécis.

2. Les navigateurs ou environnements d'exécution imposent également des limites. Dans la plupart des navigateurs principaux (Chrome, Firefox, Safari, etc.), l'intervalle minimum est d'environ 4 millisecondes. Même avec un réglage à 1 milliseconde, l'exécution réelle ne se fait que toutes les 4 millisecondes.

3. Lorsque le système exécute des tâches très gourmandes en mémoire ou en CPU, cela provoque également des retards. Des opérations comme le montage vidéo ou le traitement d'images ont une forte probabilité de causer des retards.

4. JavaScript possède un mécanisme de Garbage Collection. Si la fonction du setInterval crée de nombreux objets qui ne sont plus utilisés après exécution, ils seront collectés par le GC, ce qui cause également des retards.

### Alternatives

#### requestAnimationFrame

Si `setInterval` est actuellement utilisé pour implémenter des animations, `requestAnimationFrame` peut être envisagé comme remplacement.

- Synchronisé avec le repaint du navigateur : S'exécute lorsque le navigateur est prêt à dessiner un nouveau frame. C'est beaucoup plus précis que d'essayer de deviner le moment du repaint avec setInterval ou setTimeout.
- Performance : Étant synchronisé avec le repaint, il ne s'exécute pas quand le navigateur juge qu'un repaint n'est pas nécessaire. Cela économise des ressources de calcul, surtout quand l'onglet n'est pas au premier plan ou est minimisé.
- Limitation automatique : Ajuste automatiquement la fréquence d'exécution selon l'appareil et la situation, généralement 60 frames par seconde.
- Paramètre temporel de haute précision : Peut recevoir un paramètre temporel de haute précision (type DOMHighResTimeStamp, précis à la microseconde) pour contrôler plus précisément les animations ou autres opérations sensibles au temps.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // Si l'élément n'a pas encore atteint sa position cible, continuer l'animation
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` met à jour la position de l'élément à chaque frame (généralement 60 frames par seconde) jusqu'à atteindre 500 pixels. Cette méthode produit un effet d'animation plus fluide et naturel que `setInterval`.
