---
id: performance-lv3-virtual-scroll
title: '[Lv3] Implementation du Virtual Scrolling : gestion du rendu de grandes quantites de donnees'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Lorsqu'une page doit afficher plus de 1000 lignes de donnees, le Virtual Scrolling permet de reduire les noeuds DOM de 1000+ a 20-30 et l'utilisation memoire de 80 %.

---

## Question type en entretien

**Q : Lorsqu'une page contient plusieurs tables, chacune avec plus de cent lignes de donnees, et que des evenements de mise a jour frequente du DOM existent, quelle methode utiliseriez-vous pour optimiser les performances de cette page ?**

---

## Analyse du probleme (Situation)

### Scenario reel du projet

Dans un projet de plateforme, certaines pages doivent traiter de grandes quantites de donnees :

```markdown
📊 Page d'historique
├─ Table des depots : 1000+ lignes
├─ Table des retraits : 800+ lignes
├─ Table des mises : 5000+ lignes
└─ Chaque ligne comporte 8 a 10 colonnes (date, montant, statut, etc.)

❌ Problemes sans optimisation
├─ Nombre de noeuds DOM : 1000 lignes × 10 colonnes = 10 000+ noeuds
├─ Consommation memoire : environ 150-200 Mo
├─ Temps du premier rendu : 3-5 secondes (ecran blanc)
├─ Saccades au defilement : FPS < 20
└─ Lors des mises a jour WebSocket : la table entiere est re-rendue (tres lent)
```

### Gravite du probleme

```javascript
// ❌ Approche traditionnelle
<tr v-for="record in allRecords">  // 1000+ lignes toutes rendues
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8 a 10 colonnes
</tr>

// Resultat :
// - Rendu initial : 10 000+ noeuds DOM
// - Reellement visible pour l'utilisateur : 20-30 lignes
// - Gaspillage : 99 % des noeuds sont invisibles pour l'utilisateur
```

---

## Solution (Action)

### Virtual Scrolling

Concernant l'optimisation du Virtual Scrolling, deux directions principales : la premiere est d'utiliser une librairie tierce officiellement recommandee comme [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller), qui determine les lignes visibles en fonction des parametres et des besoins.

```js
// Ne rendre que les lignes visibles, par exemple :
// - 100 lignes de donnees, seules les 20 visibles sont rendues
// - Reduction considerable du nombre de noeuds DOM
```

L'autre option est de l'implementer soi-meme, mais compte tenu du cout de developpement reel et de la couverture des cas d'utilisation, je pencherais davantage pour la librairie tierce recommandee.

### Controle de la frequence de mise a jour des donnees

> Solution 1 : requestAnimationFrame (RAF)
> Concept : le navigateur ne peut rafraichir que 60 fois par seconde maximum (60 FPS). Les mises a jour plus rapides sont invisibles a l'oeil, donc on synchronise avec le taux de rafraichissement de l'ecran.

```js
// ❌ Avant : mise a jour immediate a chaque reception (potentiellement 100 fois/seconde)
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// ✅ Ameliore : collecter les donnees, mise a jour synchronisee avec le rafraichissement (max 60 fois/seconde)
let latestPrice = null;
let isScheduled = false;

socket.on('price', (newPrice) => {
  latestPrice = newPrice; // Stocker le dernier prix

  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(() => {
      btcPrice.value = latestPrice; // Mise a jour au moment du rafraichissement du navigateur
      isScheduled = false;
    });
  }
});
```

Solution 2 : Throttle
Concept : limiter de force la frequence des mises a jour, par exemple "maximum 1 mise a jour par 100 ms"

```js
// throttle de lodash (si deja utilise dans le projet)
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100); // Maximum 1 execution par 100 ms

socket.on('price', updatePrice);
```

### Optimisations specifiques a Vue 3

Certains sucres syntaxiques de Vue 3 offrent des optimisations de performance, comme v-memo, bien que personnellement j'utilise rarement ce cas.

```js
// 1. v-memo - memoriser les colonnes qui changent rarement
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // Re-rendu uniquement quand ces champs changent
</tr>

// 2. Geler les donnees statiques pour eviter le surcout du systeme reactif
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef pour les grands tableaux
const tableData = shallowRef([...])  // Ne suit que le tableau lui-meme, pas les objets internes

// 4. Utiliser key pour optimiser l'algorithme de diff (un id unique par item pour limiter les mises a jour DOM aux noeuds modifies)
<tr v-for="row in data" :key="row.id">  // Key stable**
```

RAF : synchronise avec le rafraichissement ecran (~16 ms), adapte aux animations et au defilement
Throttle : intervalle personnalise (ex. 100 ms), adapte a la recherche et au resize

### Optimisation du rendu DOM

```scss
// Utiliser CSS transform au lieu de top/left
.row-update {
  transform: translateY(0); /* Declenche l'acceleration GPU */
  will-change: transform; /* Indique au navigateur d'optimiser */
}

// CSS containment pour isoler la zone de rendu
.table-container {
  contain: layout style paint;
}
```

---

## Resultats de l'optimisation (Result)

### Comparaison des performances

| Indicateur     | Avant optimisation | Apres optimisation | Amelioration |
| -------------- | ------------------ | ------------------ | ------------ |
| Noeuds DOM     | 10 000+            | 20-30              | ↓ 99,7 %    |
| Utilisation memoire | 150-200 Mo      | 30-40 Mo           | ↓ 80 %      |
| Premier rendu  | 3-5 s              | 0,3-0,5 s          | ↑ 90 %      |
| FPS defilement | < 20               | 55-60              | ↑ 200 %     |
| Reponse aux mises a jour | 500-800 ms | 16-33 ms          | ↑ 95 %      |

### Resultats concrets

```markdown
✅ Virtual Scrolling
├─ Seules les 20-30 lignes visibles sont rendues
├─ Mise a jour dynamique de la zone visible pendant le defilement
├─ Imperceptible pour l'utilisateur (experience fluide)
└─ Memoire stable (ne croit pas avec le volume de donnees)

✅ Mise a jour des donnees via RAF
├─ WebSocket : 100 mises a jour/seconde → maximum 60 rendus
├─ Synchronise avec le taux de rafraichissement (60 FPS)
└─ Utilisation CPU reduite de 60 %

✅ Optimisations Vue 3
├─ v-memo : evite les re-rendus inutiles
├─ shallowRef : reduit le surcout reactif
└─ :key stable : optimise l'algorithme de diff
```

---

## Points cles pour l'entretien

### Questions d'approfondissement courantes

**Q : Et si on ne peut pas utiliser de librairie tierce ?**
R : Implementer la logique fondamentale du Virtual Scrolling soi-meme :

```javascript
// Concept fondamental
const itemHeight = 50; // Hauteur de chaque ligne
const containerHeight = 600; // Hauteur du conteneur
const visibleCount = Math.ceil(containerHeight / itemHeight); // Nombre visible

// Calculer quels elements doivent etre affiches
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// Ne rendre que la zone visible
const visibleItems = allItems.slice(startIndex, endIndex);

// Compenser la hauteur avec du padding (pour une barre de defilement correcte)
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

**Points cles :**

- Calcul de la zone visible (startIndex -> endIndex)
- Chargement dynamique des donnees (slice)
- Compensation de la hauteur (padding top/bottom)
- Ecoute de l'evenement scroll (optimisation throttle)

**Q : Comment gerer la reconnexion apres une deconnexion WebSocket ?**
R : Implementer une strategie de reconnexion avec backoff exponentiel :

```javascript
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000; // 1 seconde

function reconnect() {
  if (retryCount >= maxRetries) {
    showError('Connexion impossible, veuillez rafraichir la page');
    return;
  }

  // Backoff exponentiel : 1s → 2s → 4s → 8s → 16s
  const delay = baseDelay * Math.pow(2, retryCount);

  setTimeout(() => {
    retryCount++;
    connectWebSocket();
  }, delay);
}

// Apres une reconnexion reussie
socket.on('connect', () => {
  retryCount = 0; // Reinitialiser le compteur
  syncData(); // Synchroniser les donnees
  showSuccess('Connexion retablie');
});
```

**Q : Comment tester les effets de l'optimisation des performances ?**
R : En combinant plusieurs outils :

```javascript
// 1. Mesure du FPS avec la Performance API
let lastTime = performance.now();
let frames = 0;

function measureFPS() {
  frames++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    console.log(`FPS: ${frames}`);
    frames = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(measureFPS);
}

// 2. Memory Profiling (Chrome DevTools)
// - Snapshot avant le rendu
// - Snapshot apres le rendu
// - Comparer la difference de memoire

// 3. Lighthouse / Performance Tab
// - Temps des Long Tasks
// - Total Blocking Time
// - Cumulative Layout Shift

// 4. Tests automatises (Playwright)
const { test } = require('@playwright/test');

test('virtual scroll performance', async ({ page }) => {
  await page.goto('/records');

  // Mesurer le temps du premier rendu
  const renderTime = await page.evaluate(() => {
    const start = performance.now();
    // Declencher le rendu
    const end = performance.now();
    return end - start;
  });

  expect(renderTime).toBeLessThan(500); // < 500ms
});
```

**Q : Quels sont les inconvenients du Virtual Scroll ?**
R : Des compromis a noter :

```markdown
❌ Inconvenients
├─ Impossible d'utiliser la recherche native du navigateur (Ctrl+F)
├─ La fonction "tout selectionner" necessite un traitement special
├─ Complexite d'implementation elevee
├─ Necessite une hauteur fixe ou un calcul prealable de la hauteur
└─ L'accessibilite necessite un traitement supplementaire

✅ Cas adaptes
├─ Volume de donnees > 100 lignes
├─ Structure de donnees similaire (hauteur fixe)
├─ Defilement haute performance requis
└─ Consultation principalement (pas d'edition)

❌ Cas non adaptes
├─ Volume < 50 lignes (sur-ingenierie)
├─ Hauteur variable (implementation difficile)
├─ Beaucoup d'interactions (multi-selection, drag & drop)
└─ Besoin d'imprimer la table entiere
```

**Q : Comment optimiser une liste a hauteur variable ?**
R : Utiliser le Virtual Scrolling a hauteur dynamique :

```javascript
// Solution 1 : hauteur estimee + mesure reelle
const estimatedHeight = 50; // Hauteur estimee
const measuredHeights = {}; // Hauteurs reelles enregistrees

// Mesurer apres le rendu
onMounted(() => {
  const elements = document.querySelectorAll('.list-item');
  elements.forEach((el, index) => {
    measuredHeights[index] = el.offsetHeight;
  });
});

// Solution 2 : utiliser une librairie supportant la hauteur dynamique
// vue-virtual-scroller supporte le dynamic-height
<DynamicScroller
  :items="items"
  :min-item-size="50"  // Hauteur minimale
  :buffer="200"        // Zone tampon
/>
```

---

## Comparaison technique

### Virtual Scroll vs Pagination

| Critere          | Virtual Scroll             | Pagination traditionnelle |
| ---------------- | -------------------------- | ------------------------- |
| Experience utilisateur | Defilement continu (meilleur) | Changement de page necessaire (interrompu) |
| Performance      | Toujours uniquement la zone visible | Rendu complet de chaque page |
| Difficulte d'implementation | Plus complexe      | Simple                    |
| SEO              | Moins bon                  | Meilleur                  |
| Accessibilite    | Traitement special necessaire | Support natif            |

**Recommandation :**

- Back-office, Dashboard -> Virtual Scroll
- Site public, blog -> Pagination traditionnelle
- Solution hybride : Virtual Scroll + bouton "Charger plus"
