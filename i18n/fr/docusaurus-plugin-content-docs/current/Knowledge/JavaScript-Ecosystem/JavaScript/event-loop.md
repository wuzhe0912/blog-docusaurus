---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> Pourquoi JavaScript a-t-il besoin du traitement asynchrone ? Et expliquez le callback et l'event loop

JavaScript est essentiellement un langage monothread, car l'une de ses taches est de modifier la structure DOM du navigateur. Si plusieurs threads modifiaient le meme noeud simultanement, la situation deviendrait tres complexe. Pour eviter cela, le monothread a ete adopte.

Le traitement asynchrone est une solution viable dans le contexte du monothread. Si une action necessite 2 secondes d'attente, le navigateur ne peut evidemment pas attendre sur place. Il execute donc d'abord tout le travail synchrone, tandis que les taches asynchrones sont placees dans la task queue (file d'attente des taches).

L'environnement ou le navigateur execute le travail synchrone peut etre compris comme le call stack. Le navigateur execute sequentiellement les taches dans le call stack. Lorsqu'il detecte que le call stack est vide, il prend les taches en attente de la task queue et les place dans le call stack pour les executer sequentiellement.

1. Le navigateur verifie si le call stack est vide => Non => Continue l'execution des taches dans le call stack
2. Le navigateur verifie si le call stack est vide => Oui => Verifie s'il y a des taches en attente dans la task queue => Oui => Les deplace dans le call stack pour execution

Ce processus de repetition continue est le concept de l'event loop.

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

> Pourquoi `setInterval` n'est-il pas precis en termes de timing ?

1. Etant donne que JavaScript est un langage monothread (il ne peut executer qu'une tache a la fois, les autres doivent attendre dans la Queue), lorsque le temps d'execution du callback de setInterval depasse l'intervalle configure, l'execution suivante est retardee. Par exemple, si setInterval est configure pour executer une fonction chaque seconde, mais qu'une action dans la fonction prend deux secondes, la prochaine execution sera retardee d'une seconde. Au fil du temps, le timing de setInterval devient de plus en plus imprecis.

2. Les navigateurs ou environnements d'execution imposent egalement des limites. Dans la plupart des navigateurs principaux (Chrome, Firefox, Safari, etc.), l'intervalle minimum est d'environ 4 millisecondes. Meme avec un reglage a 1 milliseconde, l'execution reelle ne se fait que toutes les 4 millisecondes.

3. Lorsque le systeme execute des taches tres gourmandes en memoire ou en CPU, cela provoque egalement des retards. Des operations comme le montage video ou le traitement d'images ont une forte probabilite de causer des retards.

4. JavaScript possede un mecanisme de Garbage Collection. Si la fonction du setInterval cree de nombreux objets qui ne sont plus utilises apres execution, ils seront collectes par le GC, ce qui cause egalement des retards.

### Alternatives

#### requestAnimationFrame

Si `setInterval` est actuellement utilise pour implementer des animations, `requestAnimationFrame` peut etre envisage comme remplacement.

- Synchronise avec le repaint du navigateur : S'execute lorsque le navigateur est pret a dessiner un nouveau frame. C'est beaucoup plus precis que d'essayer de deviner le moment du repaint avec setInterval ou setTimeout.
- Performance : Etant synchronise avec le repaint, il ne s'execute pas quand le navigateur juge qu'un repaint n'est pas necessaire. Cela economise des ressources de calcul, surtout quand l'onglet n'est pas au premier plan ou est minimise.
- Limitation automatique : Ajuste automatiquement la frequence d'execution selon l'appareil et la situation, generalement 60 frames par seconde.
- Parametre temporel de haute precision : Peut recevoir un parametre temporel de haute precision (type DOMHighResTimeStamp, precis a la microseconde) pour controler plus precisement les animations ou autres operations sensibles au temps.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // Si l'element n'a pas encore atteint sa position cible, continuer l'animation
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` met a jour la position de l'element a chaque frame (generalement 60 frames par seconde) jusqu'a atteindre 500 pixels. Cette methode produit un effet d'animation plus fluide et naturel que `setInterval`.
