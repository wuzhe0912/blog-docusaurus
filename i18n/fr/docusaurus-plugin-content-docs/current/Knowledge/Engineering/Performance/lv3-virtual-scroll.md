---
id: performance-lv3-virtual-scroll
title: '[Lv3] Implémentation du Virtual Scrolling : gestion du rendu de grandes quantités de données'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Lorsqu'une page doit afficher plus de 1000 lignes de données, le Virtual Scrolling permet de réduire les nœuds DOM de 1000+ à 20-30 et l'utilisation mémoire de 80 %.

---

## Question type en entretien

**Q : Lorsqu'une page contient plusieurs tables, chacune avec plus de cent lignes de données, et que des événements de mise à jour fréquente du DOM existent, quelle méthode utiliseriez-vous pour optimiser les performances de cette page ?**

---

## Analyse du problème (Situation)

### Scénario réel du projet

Dans un projet de plateforme, certaines pages doivent traiter de grandes quantités de données :

```markdown
📊 Page d'historique
├─ Table des dépôts : 1000+ lignes
├─ Table des retraits : 800+ lignes
├─ Table des mises : 5000+ lignes
└─ Chaque ligne comporte 8 à 10 colonnes (date, montant, statut, etc.)

❌ Problèmes sans optimisation
├─ Nombre de nœuds DOM : 1000 lignes × 10 colonnes = 10 000+ nœuds
├─ Consommation mémoire : environ 150-200 Mo
├─ Temps du premier rendu : 3-5 secondes (écran blanc)
├─ Saccades au défilement : FPS < 20
└─ Lors des mises à jour WebSocket : la table entière est re-rendue (très lent)
```

### Gravité du problème

```javascript
// ❌ Approche traditionnelle
<tr v-for="record in allRecords">  // 1000+ lignes toutes rendues
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8 à 10 colonnes
</tr>

// Résultat :
// - Rendu initial : 10 000+ nœuds DOM
// - Réellement visible pour l'utilisateur : 20-30 lignes
// - Gaspillage : 99 % des nœuds sont invisibles pour l'utilisateur
```

---

## Solution (Action)

### Virtual Scrolling

Concernant l'optimisation du Virtual Scrolling, deux directions principales : la première est d'utiliser une librairie tierce officiellement recommandée comme [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller), qui détermine les lignes visibles en fonction des paramètres et des besoins.

```js
// Ne rendre que les lignes visibles, par exemple :
// - 100 lignes de données, seules les 20 visibles sont rendues
// - Réduction considérable du nombre de nœuds DOM
```

L'autre option est de l'implémenter soi-même, mais compte tenu du coût de développement réel et de la couverture des cas d'utilisation, je pencherais davantage pour la librairie tierce recommandée.

### Contrôle de la fréquence de mise à jour des données

> Solution 1 : requestAnimationFrame (RAF)
> Concept : le navigateur ne peut rafraîchir que 60 fois par seconde maximum (60 FPS). Les mises à jour plus rapides sont invisibles à l'œil, donc on synchronise avec le taux de rafraîchissement de l'écran.

```js
// ❌ Avant : mise à jour immédiate à chaque réception (potentiellement 100 fois/seconde)
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// ✅ Amélioré : collecter les données, mise à jour synchronisée avec le rafraîchissement (max 60 fois/seconde)
let latestPrice = null;
let isScheduled = false;

socket.on('price', (newPrice) => {
  latestPrice = newPrice; // Stocker le dernier prix

  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(() => {
      btcPrice.value = latestPrice; // Mise à jour au moment du rafraîchissement du navigateur
      isScheduled = false;
    });
  }
});
```

Solution 2 : Throttle
Concept : limiter de force la fréquence des mises à jour, par exemple "maximum 1 mise à jour par 100 ms"

```js
// throttle de lodash (si déjà utilisé dans le projet)
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100); // Maximum 1 exécution par 100 ms

socket.on('price', updatePrice);
```

### Optimisations spécifiques à Vue 3

Certains sucres syntaxiques de Vue 3 offrent des optimisations de performance, comme v-memo, bien que personnellement j'utilise rarement ce cas.

```js
// 1. v-memo - mémoriser les colonnes qui changent rarement
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // Re-rendu uniquement quand ces champs changent
</tr>

// 2. Geler les données statiques pour éviter le surcoût du système réactif
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef pour les grands tableaux
const tableData = shallowRef([...])  // Ne suit que le tableau lui-même, pas les objets internes

// 4. Utiliser key pour optimiser l'algorithme de diff (un id unique par item pour limiter les mises à jour DOM aux nœuds modifiés)
<tr v-for="row in data" :key="row.id">  // Key stable**
```

RAF : synchronisé avec le rafraîchissement écran (~16 ms), adapté aux animations et au défilement
Throttle : intervalle personnalisé (ex. 100 ms), adapté à la recherche et au resize

### Optimisation du rendu DOM

```scss
// Utiliser CSS transform au lieu de top/left
.row-update {
  transform: translateY(0); /* Déclenche l'accélération GPU */
  will-change: transform; /* Indique au navigateur d'optimiser */
}

// CSS containment pour isoler la zone de rendu
.table-container {
  contain: layout style paint;
}
```

---

## Résultats de l'optimisation (Result)

### Comparaison des performances

| Indicateur     | Avant optimisation | Après optimisation | Amélioration |
| -------------- | ------------------ | ------------------ | ------------ |
| Nœuds DOM     | 10 000+            | 20-30              | ↓ 99,7 %    |
| Utilisation mémoire | 150-200 Mo      | 30-40 Mo           | ↓ 80 %      |
| Premier rendu  | 3-5 s              | 0,3-0,5 s          | ↑ 90 %      |
| FPS défilement | < 20               | 55-60              | ↑ 200 %     |
| Réponse aux mises à jour | 500-800 ms | 16-33 ms          | ↑ 95 %      |

### Résultats concrets

```markdown
✅ Virtual Scrolling
├─ Seules les 20-30 lignes visibles sont rendues
├─ Mise à jour dynamique de la zone visible pendant le défilement
├─ Imperceptible pour l'utilisateur (expérience fluide)
└─ Mémoire stable (ne croît pas avec le volume de données)

✅ Mise à jour des données via RAF
├─ WebSocket : 100 mises à jour/seconde → maximum 60 rendus
├─ Synchronisé avec le taux de rafraîchissement (60 FPS)
└─ Utilisation CPU réduite de 60 %

✅ Optimisations Vue 3
├─ v-memo : évite les re-rendus inutiles
├─ shallowRef : réduit le surcoût réactif
└─ :key stable : optimise l'algorithme de diff
```

---

## Points clés pour l'entretien

### Questions d'approfondissement courantes

**Q : Et si on ne peut pas utiliser de librairie tierce ?**
R : Implémenter la logique fondamentale du Virtual Scrolling soi-même :

```javascript
// Concept fondamental
const itemHeight = 50; // Hauteur de chaque ligne
const containerHeight = 600; // Hauteur du conteneur
const visibleCount = Math.ceil(containerHeight / itemHeight); // Nombre visible

// Calculer quels éléments doivent être affichés
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// Ne rendre que la zone visible
const visibleItems = allItems.slice(startIndex, endIndex);

// Compenser la hauteur avec du padding (pour une barre de défilement correcte)
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

**Points clés :**

- Calcul de la zone visible (startIndex -> endIndex)
- Chargement dynamique des données (slice)
- Compensation de la hauteur (padding top/bottom)
- Écoute de l'événement scroll (optimisation throttle)

**Q : Comment gérer la reconnexion après une déconnexion WebSocket ?**
R : Implémenter une stratégie de reconnexion avec backoff exponentiel :

```javascript
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000; // 1 seconde

function reconnect() {
  if (retryCount >= maxRetries) {
    showError('Connexion impossible, veuillez rafraîchir la page');
    return;
  }

  // Backoff exponentiel : 1s → 2s → 4s → 8s → 16s
  const delay = baseDelay * Math.pow(2, retryCount);

  setTimeout(() => {
    retryCount++;
    connectWebSocket();
  }, delay);
}

// Après une reconnexion réussie
socket.on('connect', () => {
  retryCount = 0; // Réinitialiser le compteur
  syncData(); // Synchroniser les données
  showSuccess('Connexion rétablie');
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
// - Snapshot après le rendu
// - Comparer la différence de mémoire

// 3. Lighthouse / Performance Tab
// - Temps des Long Tasks
// - Total Blocking Time
// - Cumulative Layout Shift

// 4. Tests automatisés (Playwright)
const { test } = require('@playwright/test');

test('virtual scroll performance', async ({ page }) => {
  await page.goto('/records');

  // Mesurer le temps du premier rendu
  const renderTime = await page.evaluate(() => {
    const start = performance.now();
    // Déclencher le rendu
    const end = performance.now();
    return end - start;
  });

  expect(renderTime).toBeLessThan(500); // < 500ms
});
```

**Q : Quels sont les inconvénients du Virtual Scroll ?**
R : Des compromis à noter :

```markdown
❌ Inconvénients
├─ Impossible d'utiliser la recherche native du navigateur (Ctrl+F)
├─ La fonction "tout sélectionner" nécessite un traitement spécial
├─ Complexité d'implémentation élevée
├─ Nécessite une hauteur fixe ou un calcul préalable de la hauteur
└─ L'accessibilité nécessite un traitement supplémentaire

✅ Cas adaptés
├─ Volume de données > 100 lignes
├─ Structure de données similaire (hauteur fixe)
├─ Défilement haute performance requis
└─ Consultation principalement (pas d'édition)

❌ Cas non adaptés
├─ Volume < 50 lignes (sur-ingénierie)
├─ Hauteur variable (implémentation difficile)
├─ Beaucoup d'interactions (multi-sélection, drag & drop)
└─ Besoin d'imprimer la table entière
```

**Q : Comment optimiser une liste à hauteur variable ?**
R : Utiliser le Virtual Scrolling à hauteur dynamique :

```javascript
// Solution 1 : hauteur estimée + mesure réelle
const estimatedHeight = 50; // Hauteur estimée
const measuredHeights = {}; // Hauteurs réelles enregistrées

// Mesurer après le rendu
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

| Critère          | Virtual Scroll             | Pagination traditionnelle |
| ---------------- | -------------------------- | ------------------------- |
| Expérience utilisateur | Défilement continu (meilleur) | Changement de page nécessaire (interrompu) |
| Performance      | Toujours uniquement la zone visible | Rendu complet de chaque page |
| Difficulté d'implémentation | Plus complexe      | Simple                    |
| SEO              | Moins bon                  | Meilleur                  |
| Accessibilité    | Traitement spécial nécessaire | Support natif            |

**Recommandation :**

- Back-office, Dashboard -> Virtual Scroll
- Site public, blog -> Pagination traditionnelle
- Solution hybride : Virtual Scroll + bouton "Charger plus"
