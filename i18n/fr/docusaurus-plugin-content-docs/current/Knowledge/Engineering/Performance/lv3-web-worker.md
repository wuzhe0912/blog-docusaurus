---
id: performance-lv3-web-worker
title: '[Lv3] Application de Web Worker : calculs en arrière-plan sans bloquer l UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker** est une API permettant d'exécuter du JavaScript dans un thread en arrière-plan du navigateur, pour effectuer des calculs lourds sans bloquer le thread principal (thread UI).

## Concept fondamental

### Contexte du problème

Le JavaScript est à l'origine **mono-thread**, tout le code s'exécute sur le thread principal :

```javascript
// ❌ Un calcul lourd bloque le thread principal
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // Calcul complexe
  }
  return result;
}

// La page entière se fige pendant l'exécution
const result = heavyComputation(); // L'UI ne répond plus
```

**Problème :**

- La page se fige, l'utilisateur ne peut ni cliquer ni défiler
- Les animations s'arrêtent
- Expérience utilisateur catastrophique

### La solution Web Worker

Web Worker apporte la capacité **multi-thread**, permettant aux tâches lourdes de s'exécuter en arrière-plan :

```javascript
// ✅ Exécution en arrière-plan avec un Worker
const worker = new Worker('worker.js');

// Le thread principal n'est pas bloqué, la page reste interactive
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('Calcul en arrière-plan terminé :', e.data);
};
```

---

## Scénario 1 : Traitement de grandes données

```javascript
// main.js
const worker = new Worker('worker.js');

// Traitement de gros volumes de données JSON
worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('Résultat du traitement :', e.data);
};

// worker.js
self.onmessage = function (e) {
  const { data, action } = e.data;

  if (action === 'process') {
    // Traitement de données chronophage
    const result = data.map((item) => {
      // Calcul complexe
      return heavyComputation(item);
    });

    self.postMessage(result);
  }
};
```

## Scénario 2 : Traitement d'images

Filtres d'images, compression, opérations pixel par pixel, sans figer l'UI.

## Scénario 3 : Calculs complexes

Opérations mathématiques (calcul de nombres premiers, chiffrement/déchiffrement)
Calcul de hash pour fichiers volumineux
Analyse et statistiques de données

## Limitations et précautions

### Ce qui est interdit dans un Worker

- Manipuler directement le DOM
- Accéder aux objets window, document, parent
- Utiliser certaines Web API (comme alert)

### Ce qui est utilisable dans un Worker

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- Timers (setTimeout, setInterval)
- Certaines API navigateur

```javascript
// Cas où le Worker n'est pas adapté
// 1. Calculs simples et rapides (la création du Worker est plus coûteuse que le calcul)
const result = 1 + 1; // Pas besoin de Worker

// 2. Communication fréquente nécessaire avec le thread principal
// Le coût de communication peut annuler les avantages du multi-threading

// Cas où le Worker est adapté
// 1. Calcul unique et de longue durée
const result = calculatePrimes(1000000);

// 2. Traitement par lots de grandes quantités de données
const processed = largeArray.map(complexOperation);
```

---

## Cas d'application en projet réel

### Cas : Chiffrement des données de jeu

Dans une plateforme de jeu, nous devons chiffrer/déchiffrer des données sensibles :

```javascript
// main.js - Thread principal
const cryptoWorker = new Worker('/workers/crypto-worker.js');

// Chiffrer les données du joueur
function encryptPlayerData(data) {
  return new Promise((resolve, reject) => {
    cryptoWorker.postMessage({
      action: 'encrypt',
      data: data,
      key: SECRET_KEY,
    });

    cryptoWorker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.encrypted);
      } else {
        reject(e.data.error);
      }
    };
  });
}

// Utilisation
const encrypted = await encryptPlayerData(sensitiveData);
// La page ne rame pas, l'utilisateur peut continuer à naviguer

// crypto-worker.js - Thread Worker
self.onmessage = function (e) {
  const { action, data, key } = e.data;

  try {
    if (action === 'encrypt') {
      // Chiffrement chronophage
      const encrypted = performHeavyEncryption(data, key);
      self.postMessage({ success: true, encrypted });
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
```

### Cas : Filtrage massif de données de jeux

```javascript
// Filtrage complexe parmi 3000+ jeux
const filterWorker = new Worker('/workers/game-filter.js');

// Critères de filtrage
const filters = {
  provider: ['PG', 'PP', 'EVO'],
  type: ['slot', 'live'],
  minRTP: 96.5,
  tags: ['popular', 'new'],
};

filterWorker.postMessage({
  games: allGames, // 3000+ titres
  filters: filters,
});

filterWorker.onmessage = (e) => {
  displayGames(e.data.filtered); // Afficher les résultats filtrés
};

// Le thread principal ne rame pas, l'utilisateur peut continuer à défiler et cliquer
```

---

## Points clés pour l'entretien

### Questions courantes en entretien

**Q1 : Comment un Web Worker et le thread principal communiquent-ils ?**

R : Via `postMessage` et `onmessage` :

```javascript
// Thread principal → Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker → Thread principal
self.postMessage({ type: 'RESULT', result: processedData });

// Attention : les données sont copiées via "Structured Clone"
// Cela signifie :
// ✅ Transmissible : Number, String, Object, Array, Date, RegExp
// ❌ Non transmissible : Function, éléments DOM, Symbol
```

**Q2 : Quel est le coût de performance d'un Web Worker ?**

R : Deux coûts principaux :

```javascript
// 1. Coût de création du Worker (environ 30-50 ms)
const worker = new Worker('worker.js'); // Nécessite le chargement d'un fichier

// 2. Coût de communication (copie des données)
worker.postMessage(largeData); // La copie de gros volumes prend du temps

// Solutions :
// 1. Réutiliser les Workers (ne pas en créer à chaque fois)
// 2. Utiliser les Transferable Objects (transfert de propriété, pas de copie)
const buffer = new ArrayBuffer(1024 * 1024); // 1 Mo
worker.postMessage(buffer, [buffer]); // Transfert de propriété
```

**Q3 : Que sont les Transferable Objects ?**

R : Transfert de propriété des données au lieu de les copier :

```javascript
// ❌ Méthode classique : copie des données (lent)
const largeArray = new Uint8Array(10000000); // 10 Mo
worker.postMessage(largeArray); // Copie de 10 Mo (chronophage)

// ✅ Transferable : transfert de propriété (rapide)
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // Transfert de propriété (en millisecondes)

// Attention : après le transfert, le thread principal ne peut plus utiliser ces données
console.log(largeArray.length); // 0 (transféré)
```

**Types Transferable supportés :**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**Q4 : Quand utiliser un Web Worker ?**

R : Arbre de décision :

```
Le calcul est-il chronophage (> 50 ms) ?
├─ Non → Pas besoin de Worker
└─ Oui → Continuer l'évaluation
    │
    ├─ Nécessite-t-il la manipulation du DOM ?
    │   ├─ Oui → Impossible d'utiliser un Worker (envisager requestIdleCallback)
    │   └─ Non → Continuer l'évaluation
    │
    └─ La fréquence de communication est-elle très élevée (> 60 fois/seconde) ?
        ├─ Oui → Probablement inadapté (coût de communication trop élevé)
        └─ Non → ✅ Adapté à l'utilisation d'un Worker
```

**Scénarios adaptés :**

- Chiffrement/déchiffrement
- Traitement d'images (filtres, compression)
- Tri/filtrage de grandes quantités de données
- Calculs mathématiques complexes
- Parsing de fichiers (JSON, CSV)

**Scénarios inadaptés :**

- Calculs simples (le surcoût dépasse le bénéfice)
- Communication fréquente nécessaire
- Manipulation du DOM requise
- API non supportées nécessaires

**Q5 : Quels sont les types de Web Worker ?**

R : Trois types :

```javascript
// 1. Dedicated Worker (dédié)
const worker = new Worker('worker.js');
// Ne peut communiquer qu'avec la page qui l'a créé

// 2. Shared Worker (partagé)
const sharedWorker = new SharedWorker('shared-worker.js');
// Peut être partagé par plusieurs pages/onglets

// 3. Service Worker
navigator.serviceWorker.register('sw.js');
// Utilisé pour le cache, le support hors ligne, les notifications push
```

**Comparaison :**

| Caractéristique | Dedicated  | Shared               | Service    |
| --------------- | ---------- | -------------------- | ---------- |
| Partage         | Page unique | Multi-pages          | Site entier |
| Cycle de vie    | Fermé avec la page | Dernière page fermée | Indépendant de la page |
| Usage principal | Calcul en arrière-plan | Communication inter-pages | Cache, hors ligne |

**Q6 : Comment déboguer un Web Worker ?**

R : Chrome DevTools le supporte :

```javascript
// 1. Le fichier Worker est visible dans le panneau Sources
// 2. On peut y placer des breakpoints
// 3. On peut exécuter du code dans la Console

// Astuce pratique : utiliser console dans le Worker
self.addEventListener('message', (e) => {
  console.log('Worker received:', e.data);
  // Visible dans la Console DevTools
});

// Gestion des erreurs
worker.onerror = (error) => {
  console.error('Worker error:', error.message);
  console.error('File:', error.filename);
  console.error('Line:', error.lineno);
};
```

---

## Comparaison des performances

### Données de test réelles (traitement de 1 million de lignes)

| Méthode                    | Temps d'exécution | UI figée ?         | Pic mémoire |
| -------------------------- | ----------------- | ------------------ | ----------- |
| Thread principal (synchrone) | 2,5 s            | Complètement figé  | 250 Mo      |
| Thread principal (Time Slicing) | 3,2 s         | Saccades occasionnelles | 280 Mo  |
| Web Worker                 | 2,3 s             | Complètement fluide | 180 Mo      |

**Conclusion :**

- Le Web Worker ne bloque pas l'UI et est même plus rapide grâce au parallélisme multi-cœur
- Utilisation mémoire réduite (le thread principal n'a pas besoin de conserver les gros volumes de données)

---

## Technologies connexes

### Web Worker vs autres solutions

```javascript
// 1. setTimeout (faux asynchrone)
setTimeout(() => heavyTask(), 0);
// ❌ Toujours sur le thread principal, peut bloquer

// 2. requestIdleCallback (exécution en temps d'inactivité)
requestIdleCallback(() => heavyTask());
// ⚠️ Exécuté uniquement en période d'inactivité, pas de garantie de délai

// 3. Web Worker (véritable multi-threading)
worker.postMessage(task);
// ✅ Véritable parallélisme, ne bloque pas l'UI
```

### Avancé : simplifier la communication Worker avec Comlink

[Comlink](https://github.com/GoogleChromeLabs/comlink) permet d'utiliser un Worker comme une fonction ordinaire :

```javascript
// Méthode traditionnelle (fastidieuse)
worker.postMessage({ action: 'add', a: 1, b: 2 });
worker.onmessage = (e) => console.log(e.data);

// Avec Comlink (concis)
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap(worker);

// Appel comme une fonction normale
const result = await api.add(1, 2);
console.log(result); // 3
```

---

## Conseils d'apprentissage

**Préparation à l'entretien :**

1. Comprendre "pourquoi le Worker est nécessaire" (problème du mono-thread)
2. Savoir "quand l'utiliser" (calculs chronophages)
3. Connaître "le mécanisme de communication" (postMessage)
4. Connaître "les limitations" (impossible de manipuler le DOM)
5. Avoir implémenté au moins un cas avec un Worker

**Conseils pratiques :**

- Commencer par un cas simple (comme le calcul de nombres premiers)
- Utiliser Chrome DevTools pour le débogage
- Mesurer les différences de performance
- Envisager des outils comme Comlink

---

## Sujets connexes

- [Optimisation au niveau des routes ->](/docs/experience/performance/lv1-route-optimization)
- [Optimisation du chargement des images ->](/docs/experience/performance/lv1-image-optimization)
- [Implémentation du Virtual Scrolling ->](/docs/experience/performance/lv3-virtual-scroll)
- [Stratégies d'optimisation pour de grandes quantités de données ->](/docs/experience/performance/lv3-large-data-optimization)
