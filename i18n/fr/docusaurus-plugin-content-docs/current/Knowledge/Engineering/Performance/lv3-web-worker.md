---
id: performance-lv3-web-worker
title: '[Lv3] Application de Web Worker : calculs en arriere-plan sans bloquer l UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker** est une API permettant d'executer du JavaScript dans un thread en arriere-plan du navigateur, pour effectuer des calculs lourds sans bloquer le thread principal (thread UI).

## Concept fondamental

### Contexte du probleme

Le JavaScript est a l'origine **mono-thread**, tout le code s'execute sur le thread principal :

```javascript
// ❌ Un calcul lourd bloque le thread principal
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // Calcul complexe
  }
  return result;
}

// La page entiere se fige pendant l'execution
const result = heavyComputation(); // L'UI ne repond plus
```

**Probleme :**

- La page se fige, l'utilisateur ne peut ni cliquer ni defiler
- Les animations s'arretent
- Experience utilisateur catastrophique

### La solution Web Worker

Web Worker apporte la capacite **multi-thread**, permettant aux taches lourdes de s'executer en arriere-plan :

```javascript
// ✅ Execution en arriere-plan avec un Worker
const worker = new Worker('worker.js');

// Le thread principal n'est pas bloque, la page reste interactive
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('Calcul en arriere-plan termine :', e.data);
};
```

---

## Scenario 1 : Traitement de grandes donnees

```javascript
// main.js
const worker = new Worker('worker.js');

// Traitement de gros volumes de donnees JSON
worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('Resultat du traitement :', e.data);
};

// worker.js
self.onmessage = function (e) {
  const { data, action } = e.data;

  if (action === 'process') {
    // Traitement de donnees chronophage
    const result = data.map((item) => {
      // Calcul complexe
      return heavyComputation(item);
    });

    self.postMessage(result);
  }
};
```

## Scenario 2 : Traitement d'images

Filtres d'images, compression, operations pixel par pixel, sans figer l'UI.

## Scenario 3 : Calculs complexes

Operations mathematiques (calcul de nombres premiers, chiffrement/dechiffrement)
Calcul de hash pour fichiers volumineux
Analyse et statistiques de donnees

## Limitations et precautions

### Ce qui est interdit dans un Worker

- Manipuler directement le DOM
- Acceder aux objets window, document, parent
- Utiliser certaines Web API (comme alert)

### Ce qui est utilisable dans un Worker

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- Timers (setTimeout, setInterval)
- Certaines API navigateur

```javascript
// Cas ou le Worker n'est pas adapte
// 1. Calculs simples et rapides (la creation du Worker est plus couteuse que le calcul)
const result = 1 + 1; // Pas besoin de Worker

// 2. Communication frequente necessaire avec le thread principal
// Le cout de communication peut annuler les avantages du multi-threading

// Cas ou le Worker est adapte
// 1. Calcul unique et de longue duree
const result = calculatePrimes(1000000);

// 2. Traitement par lots de grandes quantites de donnees
const processed = largeArray.map(complexOperation);
```

---

## Cas d'application en projet reel

### Cas : Chiffrement des donnees de jeu

Dans une plateforme de jeu, nous devons chiffrer/dechiffrer des donnees sensibles :

```javascript
// main.js - Thread principal
const cryptoWorker = new Worker('/workers/crypto-worker.js');

// Chiffrer les donnees du joueur
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
// La page ne rame pas, l'utilisateur peut continuer a naviguer

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

### Cas : Filtrage massif de donnees de jeux

```javascript
// Filtrage complexe parmi 3000+ jeux
const filterWorker = new Worker('/workers/game-filter.js');

// Criteres de filtrage
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
  displayGames(e.data.filtered); // Afficher les resultats filtres
};

// Le thread principal ne rame pas, l'utilisateur peut continuer a defiler et cliquer
```

---

## Points cles pour l'entretien

### Questions courantes en entretien

**Q1 : Comment un Web Worker et le thread principal communiquent-ils ?**

R : Via `postMessage` et `onmessage` :

```javascript
// Thread principal → Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker → Thread principal
self.postMessage({ type: 'RESULT', result: processedData });

// Attention : les donnees sont copiees via "Structured Clone"
// Cela signifie :
// ✅ Transmissible : Number, String, Object, Array, Date, RegExp
// ❌ Non transmissible : Function, elements DOM, Symbol
```

**Q2 : Quel est le cout de performance d'un Web Worker ?**

R : Deux couts principaux :

```javascript
// 1. Cout de creation du Worker (environ 30-50 ms)
const worker = new Worker('worker.js'); // Necessite le chargement d'un fichier

// 2. Cout de communication (copie des donnees)
worker.postMessage(largeData); // La copie de gros volumes prend du temps

// Solutions :
// 1. Reutiliser les Workers (ne pas en creer a chaque fois)
// 2. Utiliser les Transferable Objects (transfert de propriete, pas de copie)
const buffer = new ArrayBuffer(1024 * 1024); // 1 Mo
worker.postMessage(buffer, [buffer]); // Transfert de propriete
```

**Q3 : Que sont les Transferable Objects ?**

R : Transfert de propriete des donnees au lieu de les copier :

```javascript
// ❌ Methode classique : copie des donnees (lent)
const largeArray = new Uint8Array(10000000); // 10 Mo
worker.postMessage(largeArray); // Copie de 10 Mo (chronophage)

// ✅ Transferable : transfert de propriete (rapide)
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // Transfert de propriete (en millisecondes)

// Attention : apres le transfert, le thread principal ne peut plus utiliser ces donnees
console.log(largeArray.length); // 0 (transfere)
```

**Types Transferable supportes :**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**Q4 : Quand utiliser un Web Worker ?**

R : Arbre de decision :

```
Le calcul est-il chronophage (> 50 ms) ?
├─ Non → Pas besoin de Worker
└─ Oui → Continuer l'evaluation
    │
    ├─ Necessite-t-il la manipulation du DOM ?
    │   ├─ Oui → Impossible d'utiliser un Worker (envisager requestIdleCallback)
    │   └─ Non → Continuer l'evaluation
    │
    └─ La frequence de communication est-elle tres elevee (> 60 fois/seconde) ?
        ├─ Oui → Probablement inadapte (cout de communication trop eleve)
        └─ Non → ✅ Adapte a l'utilisation d'un Worker
```

**Scenarios adaptes :**

- Chiffrement/dechiffrement
- Traitement d'images (filtres, compression)
- Tri/filtrage de grandes quantites de donnees
- Calculs mathematiques complexes
- Parsing de fichiers (JSON, CSV)

**Scenarios inadaptes :**

- Calculs simples (le surcout depasse le benefice)
- Communication frequente necessaire
- Manipulation du DOM requise
- API non supportees necessaires

**Q5 : Quels sont les types de Web Worker ?**

R : Trois types :

```javascript
// 1. Dedicated Worker (dedie)
const worker = new Worker('worker.js');
// Ne peut communiquer qu'avec la page qui l'a cree

// 2. Shared Worker (partage)
const sharedWorker = new SharedWorker('shared-worker.js');
// Peut etre partage par plusieurs pages/onglets

// 3. Service Worker
navigator.serviceWorker.register('sw.js');
// Utilise pour le cache, le support hors ligne, les notifications push
```

**Comparaison :**

| Caracteristique | Dedicated  | Shared               | Service    |
| --------------- | ---------- | -------------------- | ---------- |
| Partage         | Page unique | Multi-pages          | Site entier |
| Cycle de vie    | Ferme avec la page | Derniere page fermee | Independant de la page |
| Usage principal | Calcul en arriere-plan | Communication inter-pages | Cache, hors ligne |

**Q6 : Comment deboguer un Web Worker ?**

R : Chrome DevTools le supporte :

```javascript
// 1. Le fichier Worker est visible dans le panneau Sources
// 2. On peut y placer des breakpoints
// 3. On peut executer du code dans la Console

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

### Donnees de test reelles (traitement de 1 million de lignes)

| Methode                    | Temps d'execution | UI figee ?         | Pic memoire |
| -------------------------- | ----------------- | ------------------ | ----------- |
| Thread principal (synchrone) | 2,5 s            | Completement fige  | 250 Mo      |
| Thread principal (Time Slicing) | 3,2 s         | Saccades occasionnelles | 280 Mo  |
| Web Worker                 | 2,3 s             | Completement fluide | 180 Mo      |

**Conclusion :**

- Le Web Worker ne bloque pas l'UI et est meme plus rapide grace au parallelisme multi-coeur
- Utilisation memoire reduite (le thread principal n'a pas besoin de conserver les gros volumes de donnees)

---

## Technologies connexes

### Web Worker vs autres solutions

```javascript
// 1. setTimeout (faux asynchrone)
setTimeout(() => heavyTask(), 0);
// ❌ Toujours sur le thread principal, peut bloquer

// 2. requestIdleCallback (execution en temps d'inactivite)
requestIdleCallback(() => heavyTask());
// ⚠️ Execute uniquement en periode d'inactivite, pas de garantie de delai

// 3. Web Worker (veritable multi-threading)
worker.postMessage(task);
// ✅ Veritable parallelisme, ne bloque pas l'UI
```

### Avance : simplifier la communication Worker avec Comlink

[Comlink](https://github.com/GoogleChromeLabs/comlink) permet d'utiliser un Worker comme une fonction ordinaire :

```javascript
// Methode traditionnelle (fastidieuse)
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

**Preparation a l'entretien :**

1. Comprendre "pourquoi le Worker est necessaire" (probleme du mono-thread)
2. Savoir "quand l'utiliser" (calculs chronophages)
3. Connaitre "le mecanisme de communication" (postMessage)
4. Connaitre "les limitations" (impossible de manipuler le DOM)
5. Avoir implemente au moins un cas avec un Worker

**Conseils pratiques :**

- Commencer par un cas simple (comme le calcul de nombres premiers)
- Utiliser Chrome DevTools pour le debogage
- Mesurer les differences de performance
- Envisager des outils comme Comlink

---

## Sujets connexes

- [Optimisation au niveau des routes ->](/docs/experience/performance/lv1-route-optimization)
- [Optimisation du chargement des images ->](/docs/experience/performance/lv1-image-optimization)
- [Implementation du Virtual Scrolling ->](/docs/experience/performance/lv3-virtual-scroll)
- [Strategies d'optimisation pour de grandes quantites de donnees ->](/docs/experience/performance/lv3-large-data-optimization)
