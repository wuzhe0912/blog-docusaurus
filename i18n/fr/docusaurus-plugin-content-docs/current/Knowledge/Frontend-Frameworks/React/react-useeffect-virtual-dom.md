---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect et Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> Qu'est-ce que `useEffect` ?

### Concept fondamental

`useEffect` est un Hook responsable de la gestion des effets de bord (side effects) dans les composants fonctionnels React. Il s'exécute après le rendu du composant pour effectuer des requêtes de données asynchrones, des abonnements, des manipulations du DOM ou la synchronisation manuelle d'état, correspondant aux méthodes de cycle de vie `componentDidMount`, `componentDidUpdate` et `componentWillUnmount` des composants de classe.

### Cas d'utilisation courants

- Récupérer des données distantes et mettre à jour l'état du composant
- Maintenir des abonnements ou des écouteurs d'événements (comme `resize`, `scroll`)
- Interagir avec les API du navigateur (comme mettre à jour `document.title`, manipuler `localStorage`)
- Nettoyer les ressources résiduelles du rendu précédent (comme annuler des requêtes, supprimer des écouteurs)

<details>
<summary>Cliquez pour voir l'exemple d'utilisation de base</summary>

```javascript
import { useEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Nombre de clics : ${count}`;
  });

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      Cliquez-moi
    </button>
  );
}
```

</details>

## 2. When does `useEffect` run?

> Quand `useEffect` s'exécute-t-il ?

Le deuxième argument de `useEffect` est le **tableau de dépendances (dependency array)**, utilisé pour contrôler le moment d'exécution de l'effet de bord. React compare chaque valeur du tableau une par une et ré-exécute l'effet de bord lorsqu'un changement est détecté, déclenchant la fonction de nettoyage avant la prochaine exécution.

### 2.1 Modèles de dépendances courants

```javascript
// 1. S'exécute après chaque rendu (y compris le premier)
useEffect(() => {
  console.log('Se déclenche à chaque changement de state');
});

// 2. S'exécute une seule fois au premier rendu
useEffect(() => {
  console.log("S'exécute uniquement au montage du composant");
}, []);

// 3. Dépendances spécifiques
useEffect(() => {
  console.log('Se déclenche uniquement quand selectedId change');
}, [selectedId]);
```

### 2.2 Fonction de nettoyage et libération des ressources

```javascript
useEffect(() => {
  const handler = () => {
    console.log('Écoute en cours');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
    console.log('Écoute supprimée');
  };
}, []);
```

L'exemple ci-dessus utilise la fonction de nettoyage pour supprimer l'écouteur d'événement. React exécute la fonction de nettoyage avant le démontage du composant ou avant la mise à jour des variables de dépendance, garantissant qu'il n'y a ni fuite de mémoire ni écouteurs dupliqués.

## 3. What is the difference between Real DOM and Virtual DOM?

> Quelle est la différence entre le Real DOM et le Virtual DOM ?

| Aspect | Real DOM | Virtual DOM |
| -------- | -------------------------------- | ------------------------------ |
| Structure | Nœuds physiques maintenus par le navigateur | Nœuds décrits par des objets JavaScript |
| Coût de mise à jour | La manipulation directe déclenche le reflow et le repaint, coût élevé | Calcule d'abord les différences puis les applique par lots, coût réduit |
| Stratégie de mise à jour | Reflété immédiatement à l'écran | Construit d'abord un nouvel arbre en mémoire puis compare les différences |
| Extensibilité | Nécessite un contrôle manuel du flux de mise à jour | Peut insérer une logique intermédiaire (Diff, traitement par lots) |

### Pourquoi React utilise le Virtual DOM

```javascript
// Illustration simplifiée du processus (pas le code source réel de React)
function renderWithVirtualDOM(newVNode, container) {
  const prevVNode = container.__vnode;
  const patches = diff(prevVNode, newVNode);
  applyPatches(container, patches);
  container.__vnode = newVNode;
}
```

Le Virtual DOM permet à React d'effectuer d'abord le Diff en mémoire, d'obtenir la liste minimale des mises à jour, puis de synchroniser le tout vers le Real DOM en une seule fois, évitant les reflows et repaints fréquents.

## 4. How to coordinate `useEffect` and Virtual DOM?

> Comment `useEffect` et le Virtual DOM collaborent-ils ?

Le flux de rendu de React se divise en Render Phase et Commit Phase. Le point clé de la coordination entre `useEffect` et le Virtual DOM est que les effets de bord doivent attendre que la mise à jour du Real DOM soit terminée avant de s'exécuter.

### Render Phase (Phase de rendu)

- React construit un nouveau Virtual DOM et calcule les différences avec la version précédente
- Cette phase est un calcul de fonctions pures, elle peut être interrompue ou ré-exécutée

### Commit Phase (Phase de validation)

- React applique les différences au Real DOM
- `useLayoutEffect` s'exécute de manière synchrone durant cette phase, garantissant que le DOM est à jour

### Effect Execution (Moment d'exécution des effets de bord)

- `useEffect` s'exécute après la fin de la Commit Phase, une fois que le navigateur a terminé le dessin
- Cela évite que les effets de bord bloquent la mise à jour de l'affichage, améliorant l'expérience utilisateur

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/profile', { signal: controller.signal })
    .then((res) => res.json())
    .then(setProfile)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Échec du chargement', error);
      }
    });

  return () => {
    controller.abort(); // Annule la requête lors de la mise à jour des dépendances ou du démontage du composant
  };
}, [userId]);
```

## 5. Quiz Time

> Quiz
> Simulation d'entretien

### Question : Expliquez l'ordre d'exécution du code suivant et écrivez le résultat de sortie

```javascript
import { useEffect, useState } from 'react';

function Demo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('effect 1');
    return () => {
      console.log('cleanup 1');
    };
  });

  useEffect(() => {
    console.log('effect 2');
  }, [visible]);

  return (
    <>
      <p>État : {visible ? 'Visible' : 'Masqué'}</p>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        Basculer
      </button>
    </>
  );
}
```

<details>
<summary>Cliquez pour voir la réponse</summary>

- Après le premier rendu, `effect 1` puis `effect 2` sont affichés dans l'ordre. Le premier `useEffect` n'a pas de tableau de dépendances, le second dépend de `visible`, dont la valeur initiale `false` déclenche tout de même une exécution.
- Après avoir cliqué sur le bouton, `setVisible` est déclenché. Au rendu suivant, la fonction de nettoyage du tour précédent s'exécute d'abord, affichant `cleanup 1`, puis les nouveaux `effect 1` et `effect 2` s'exécutent.
- Comme `visible` change à chaque basculement, `effect 2` est ré-exécuté après chaque basculement.

L'ordre de sortie final est : `effect 1` → `effect 2` → (après clic) `cleanup 1` → `effect 1` → `effect 2`.

</details>

## 6. Best Practices

> Bonnes pratiques

### Pratiques recommandées

- Maintenez soigneusement le tableau de dépendances, en utilisant la règle ESLint `react-hooks/exhaustive-deps`.
- Séparez les `useEffect` par responsabilité pour réduire le couplage causé par de grands effets de bord.
- Libérez les écouteurs ou annulez les requêtes asynchrones dans la fonction de nettoyage pour éviter les fuites de mémoire.
- Utilisez `useLayoutEffect` lorsque vous devez lire les informations de mise en page immédiatement après la mise à jour du DOM, mais évaluez l'impact sur les performances.

### Exemple : Séparation des responsabilités

```javascript
useEffect(() => {
  document.title = `Utilisateur actuel : ${user.name}`;
}, [user.name]); // Gestion de document.title

useEffect(() => {
  const subscription = chatClient.subscribe(roomId);
  return () => subscription.unsubscribe();
}, [roomId]); // Gestion de la connexion au salon de chat
```

## 7. Interview Summary

> Résumé d'entretien

### Révision rapide

1. `useEffect` contrôle le moment d'exécution via le tableau de dépendances ; la fonction de nettoyage est responsable de la libération des ressources.
2. Le Virtual DOM utilise l'algorithme Diff pour trouver l'ensemble minimal de mises à jour, réduisant le coût des opérations sur le Real DOM.
3. Comprendre la Render Phase et la Commit Phase permet de répondre précisément aux questions sur la relation entre les effets de bord et le flux de rendu.
4. En complément d'entretien, on peut mentionner les stratégies d'optimisation des performances, comme les mises à jour par lots, le chargement différé et la memoization.

### Modèle de réponse en entretien

> "React construit d'abord le Virtual DOM lors du rendu, calcule les différences puis entre dans la Commit Phase pour mettre à jour le Real DOM. `useEffect` s'exécute après la validation et le dessin du navigateur, il est donc adapté au traitement des requêtes asynchrones ou des écouteurs d'événements. Tant que le tableau de dépendances est correctement maintenu et que la fonction de nettoyage est utilisée, on peut éviter les fuites de mémoire et les problèmes de race condition."

## Reference

> Références

- [Documentation officielle React : Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [Documentation officielle React : Rendering](https://react.dev/learn/rendering)
- [Documentation officielle React : Rendering Optimizations](https://react.dev/learn/escape-hatches#removing-effect-dependencies)
