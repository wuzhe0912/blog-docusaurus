---
id: performance-lv2-js-optimization
title: '[Lv2] Optimisation des performances JavaScript : Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Optimisation des performances JavaScript grace au Debounce, Throttle, Time Slicing et requestAnimationFrame, pour ameliorer l'experience utilisateur.

---

## Contexte du probleme

Dans un projet de plateforme, les utilisateurs effectuent frequemment les operations suivantes :

- **Recherche** (filtrage en temps reel parmi 3000+ produits lors de la saisie)
- **Defilement de listes** (suivi de la position et chargement supplementaire lors du scroll)
- **Changement de categorie** (filtrage de l'affichage par type de produit)
- **Effets d'animation** (defilement fluide, effets de cadeaux)

Sans optimisation, ces operations provoquent des saccades et une utilisation excessive du CPU.

---

## Strategie 1 : Debounce (anti-rebond) - Optimisation de la saisie de recherche

```javascript
import { useDebounceFn } from '@vueuse/core';

// Fonction debounce : si une nouvelle saisie intervient dans les 500 ms, le compteur repart
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // Ne s'execute que 500 ms apres l'arret de la saisie
  }
);
```

```md
Avant optimisation : saisie de "slot game" (9 caracteres)

- 9 recherches declenchees
- Filtrage de 3000 jeux × 9 fois = 27 000 operations
- Duree : environ 1,8 seconde (saccades de la page)

Apres optimisation : saisie de "slot game"

- 1 seule recherche (apres l'arret de la saisie)
- Filtrage de 3000 jeux × 1 fois = 3 000 operations
- Duree : environ 0,2 seconde
- Amelioration des performances : 90 %
```

## Strategie 2 : Throttle (limitation) - Optimisation des evenements de defilement

> Cas d'utilisation : suivi de la position de defilement, chargement infini

```javascript
import { throttle } from 'lodash';

// Fonction throttle : execution maximum 1 fois par 100 ms
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
Avant optimisation :

- L'evenement scroll se declenche 60 fois par seconde (60 FPS)
- Chaque declenchement calcule la position de defilement
- Duree : environ 600 ms (saccades de la page)

Apres optimisation :

- L'evenement scroll se declenche au maximum 1 fois par 100 ms
- Duree : environ 100 ms
- Amelioration des performances : 90 %
```

## Strategie 3 : Time Slicing (decoupage temporel) - Traitement de grandes quantites de donnees

> Cas d'utilisation : nuage de tags, combinaisons de menus, filtrage de 3000+ jeux, historique de transactions

```javascript
// Fonction de Time Slicing personnalisee
function processInBatches(
  array: GameList, // 3000 jeux
  batchSize: number, // 200 jeux par lot
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // Traitement termine

    const batch = array.slice(index, index + batchSize); // Decoupage
    callback(batch); // Traitement de ce lot
    index += batchSize;

    setTimeout(processNextBatch, 0); // Le lot suivant est place dans la file de micro-taches
  }

  processNextBatch();
}
```

Exemple d'utilisation :

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // Decoupage des 3000 jeux en 15 lots de 200
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

## Strategie 4 : requestAnimationFrame - Optimisation des animations

> Cas d'utilisation : defilement fluide, animations Canvas, effets de cadeaux

```javascript
const scrollToTopAnimated = (el: any, speed = 500) => {
  const startPosition = el.scrollTop;
  const duration = speed;
  let startTime = null;

  // Utilisation d'une fonction d'assouplissement (Easing Function)
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(
      timeElapsed,
      startPosition,
      -startPosition,
      duration
    );
    el.scrollTop = run;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll); // Appel recursif
    }
  };

  requestAnimationFrame(animateScroll);
};
```

Pourquoi utiliser requestAnimationFrame ?

```javascript
// Mauvaise pratique : utiliser setInterval
setInterval(() => {
  el.scrollTop += 10;
}, 16); // Vise 60fps (1000ms / 60 ≈ 16ms)
// Problemes :
// 1. Non synchronise avec le rafraichissement du navigateur (peut s'executer plusieurs fois entre deux rafraichissements)
// 2. Continue a s'executer dans les onglets en arriere-plan (gaspillage de ressources)
// 3. Peut provoquer des saccades (Jank)

// Bonne pratique : utiliser requestAnimationFrame
requestAnimationFrame(animateScroll);
// Avantages :
// 1. Synchronise avec le rafraichissement du navigateur (60fps ou 120fps)
// 2. Mise en pause automatique quand l'onglet n'est pas visible (economie d'energie)
// 3. Plus fluide, pas de saccades
```

---

## Points cles pour l'entretien

### Debounce vs Throttle

| Caracteristique  | Debounce                              | Throttle                              |
| ---------------- | ------------------------------------- | ------------------------------------- |
| Moment de declenchement | Apres un delai sans activite   | Une seule execution par intervalle fixe |
| Cas d'utilisation | Saisie de recherche, resize de fenetre | Evenements scroll, deplacement de souris |
| Nombre d'executions | Peut ne pas s'executer (si activite continue) | Garantie d'execution (frequence fixe) |
| Latence          | Latente (attente d'arret)             | Execution immediate, puis limitation  |

### Time Slicing vs Web Worker

| Caracteristique    | Time Slicing                          | Web Worker                            |
| ------------------ | ------------------------------------- | ------------------------------------- |
| Environnement d'execution | Thread principal              | Thread en arriere-plan                |
| Cas d'utilisation  | Taches necessitant la manipulation du DOM | Taches de calcul pur             |
| Complexite d'implementation | Plus simple                   | Plus complexe (necessite de la communication) |
| Gain de performance | Evite le blocage du thread principal  | Veritable parallelisme                |

### Questions courantes en entretien

**Q : Comment choisir entre Debounce et Throttle ?**

R : Selon le cas d'utilisation :

- **Debounce** : adapte aux scenarios "attendre que l'utilisateur ait termine" (comme la saisie de recherche)
- **Throttle** : adapte aux scenarios "mise a jour continue mais pas trop frequente" (comme le suivi de defilement)

**Q : Comment choisir entre Time Slicing et Web Worker ?**

R :

- **Time Slicing** : quand on doit manipuler le DOM, traitement de donnees simple
- **Web Worker** : calcul pur, traitement massif de donnees, pas besoin du DOM

**Q : Quels sont les avantages de requestAnimationFrame ?**

R :

1. Synchronisation avec le rafraichissement du navigateur (60fps)
2. Pause automatique quand l'onglet n'est pas visible (economie d'energie)
3. Pas de saccades (Jank)
4. Plus performant que setInterval/setTimeout
