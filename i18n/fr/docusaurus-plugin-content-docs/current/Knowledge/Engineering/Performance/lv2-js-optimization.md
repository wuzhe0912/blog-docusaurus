---
id: performance-lv2-js-optimization
title: '[Lv2] Optimisation des performances JavaScript : Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Optimisation des performances JavaScript grâce au Debounce, Throttle, Time Slicing et requestAnimationFrame, pour améliorer l'expérience utilisateur.

---

## Contexte du problème

Dans un projet de plateforme, les utilisateurs effectuent fréquemment les opérations suivantes :

- **Recherche** (filtrage en temps réel parmi 3000+ produits lors de la saisie)
- **Défilement de listes** (suivi de la position et chargement supplémentaire lors du scroll)
- **Changement de catégorie** (filtrage de l'affichage par type de produit)
- **Effets d'animation** (défilement fluide, effets de cadeaux)

Sans optimisation, ces opérations provoquent des saccades et une utilisation excessive du CPU.

---

## Stratégie 1 : Debounce (anti-rebond) - Optimisation de la saisie de recherche

```javascript
import { useDebounceFn } from '@vueuse/core';

// Fonction debounce : si une nouvelle saisie intervient dans les 500 ms, le compteur repart
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // Ne s'exécute que 500 ms après l'arrêt de la saisie
  }
);
```

```md
Avant optimisation : saisie de "slot game" (9 caractères)

- 9 recherches déclenchées
- Filtrage de 3000 jeux × 9 fois = 27 000 opérations
- Durée : environ 1,8 seconde (saccades de la page)

Après optimisation : saisie de "slot game"

- 1 seule recherche (après l'arrêt de la saisie)
- Filtrage de 3000 jeux × 1 fois = 3 000 opérations
- Durée : environ 0,2 seconde
- Amélioration des performances : 90 %
```

## Stratégie 2 : Throttle (limitation) - Optimisation des événements de défilement

> Cas d'utilisation : suivi de la position de défilement, chargement infini

```javascript
import { throttle } from 'lodash';

// Fonction throttle : exécution maximum 1 fois par 100 ms
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
Avant optimisation :

- L'événement scroll se déclenche 60 fois par seconde (60 FPS)
- Chaque déclenchement calcule la position de défilement
- Durée : environ 600 ms (saccades de la page)

Après optimisation :

- L'événement scroll se déclenche au maximum 1 fois par 100 ms
- Durée : environ 100 ms
- Amélioration des performances : 90 %
```

## Stratégie 3 : Time Slicing (découpage temporel) - Traitement de grandes quantités de données

> Cas d'utilisation : nuage de tags, combinaisons de menus, filtrage de 3000+ jeux, historique de transactions

```javascript
// Fonction de Time Slicing personnalisée
function processInBatches(
  array: GameList, // 3000 jeux
  batchSize: number, // 200 jeux par lot
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // Traitement terminé

    const batch = array.slice(index, index + batchSize); // Découpage
    callback(batch); // Traitement de ce lot
    index += batchSize;

    setTimeout(processNextBatch, 0); // Le lot suivant est placé dans la file de micro-tâches
  }

  processNextBatch();
}
```

Exemple d'utilisation :

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // Découpage des 3000 jeux en 15 lots de 200
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

## Stratégie 4 : requestAnimationFrame - Optimisation des animations

> Cas d'utilisation : défilement fluide, animations Canvas, effets de cadeaux

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
      requestAnimationFrame(animateScroll); // Appel récursif
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
// Problèmes :
// 1. Non synchronisé avec le rafraîchissement du navigateur (peut s'exécuter plusieurs fois entre deux rafraîchissements)
// 2. Continue à s'exécuter dans les onglets en arrière-plan (gaspillage de ressources)
// 3. Peut provoquer des saccades (Jank)

// Bonne pratique : utiliser requestAnimationFrame
requestAnimationFrame(animateScroll);
// Avantages :
// 1. Synchronisé avec le rafraîchissement du navigateur (60fps ou 120fps)
// 2. Mise en pause automatique quand l'onglet n'est pas visible (économie d'énergie)
// 3. Plus fluide, pas de saccades
```

---

## Points clés pour l'entretien

### Debounce vs Throttle

| Caractéristique  | Debounce                              | Throttle                              |
| ---------------- | ------------------------------------- | ------------------------------------- |
| Moment de déclenchement | Après un délai sans activité   | Une seule exécution par intervalle fixe |
| Cas d'utilisation | Saisie de recherche, resize de fenêtre | Événements scroll, déplacement de souris |
| Nombre d'exécutions | Peut ne pas s'exécuter (si activité continue) | Garantie d'exécution (fréquence fixe) |
| Latence          | Latente (attente d'arrêt)             | Exécution immédiate, puis limitation  |

### Time Slicing vs Web Worker

| Caractéristique    | Time Slicing                          | Web Worker                            |
| ------------------ | ------------------------------------- | ------------------------------------- |
| Environnement d'exécution | Thread principal              | Thread en arrière-plan                |
| Cas d'utilisation  | Tâches nécessitant la manipulation du DOM | Tâches de calcul pur             |
| Complexité d'implémentation | Plus simple                   | Plus complexe (nécessite de la communication) |
| Gain de performance | Évite le blocage du thread principal  | Véritable parallélisme                |

### Questions courantes en entretien

**Q : Comment choisir entre Debounce et Throttle ?**

R : Selon le cas d'utilisation :

- **Debounce** : adapté aux scénarios "attendre que l'utilisateur ait terminé" (comme la saisie de recherche)
- **Throttle** : adapté aux scénarios "mise à jour continue mais pas trop fréquente" (comme le suivi de défilement)

**Q : Comment choisir entre Time Slicing et Web Worker ?**

R :

- **Time Slicing** : quand on doit manipuler le DOM, traitement de données simple
- **Web Worker** : calcul pur, traitement massif de données, pas besoin du DOM

**Q : Quels sont les avantages de requestAnimationFrame ?**

R :

1. Synchronisation avec le rafraîchissement du navigateur (60fps)
2. Pause automatique quand l'onglet n'est pas visible (économie d'énergie)
3. Pas de saccades (Jank)
4. Plus performant que setInterval/setTimeout
