---
id: performance-lv3-large-data-optimization
title: '[Lv3] Stratégies d optimisation pour de grandes quantités de données : choix de solution et implémentation'
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> Lorsque l'interface doit afficher des dizaines de milliers de données, comment trouver l'équilibre entre performances, expérience utilisateur et coût de développement ?

## Question type en entretien

**Q : Lorsque l'interface affiche des dizaines de milliers de données, comment les optimiser ?**

C'est une question ouverte. L'intervieweur s'attend à entendre plus qu'une seule solution :

1. **Évaluation des besoins** : est-il vraiment nécessaire d'afficher autant de données d'un coup ?
2. **Choix de la solution** : quelles sont les options ? Quels sont leurs avantages et inconvénients ?
3. **Réflexion globale** : front-end + back-end + UX de manière combinée
4. **Expérience réelle** : raisons du choix et résultats obtenus

---

## Première étape : Évaluation des besoins

Avant de choisir une solution technique, posez-vous ces questions :

### Questions fondamentales

```markdown
❓ L'utilisateur a-t-il vraiment besoin de voir toutes les données ?
→ Dans la plupart des cas, l'utilisateur ne s'intéresse qu'aux 50 à 100 premières lignes
→ On peut réduire le périmètre par le filtrage, la recherche et le tri

❓ Les données doivent-elles être mises à jour en temps réel ?
→ WebSocket en temps réel vs polling périodique vs chargement initial unique

❓ Quel est le mode d'interaction de l'utilisateur ?
→ Navigation principalement → Virtual Scrolling
→ Recherche de données spécifiques → recherche + pagination
→ Consultation ligne par ligne → défilement infini

❓ La structure des données est-elle fixe ?
→ Hauteur fixe → Virtual Scrolling facile à implémenter
→ Hauteur variable → calcul dynamique de la hauteur nécessaire

❓ Faut-il pouvoir tout sélectionner, imprimer ou exporter ?
→ Oui → le Virtual Scrolling a des limitations
→ Non → le Virtual Scrolling est le meilleur choix
```

### Analyses de cas réels

```javascript
// Cas 1 : Historique des transactions (10 000+ lignes)
Comportement utilisateur : consulter les transactions récentes, recherche ponctuelle par date
Meilleure solution : pagination back-end + recherche

// Cas 2 : Liste de jeux en temps réel (3 000+ titres)
Comportement utilisateur : navigation, filtrage par catégorie, défilement fluide
Meilleure solution : Virtual Scrolling + filtrage front-end

// Cas 3 : Fil d'actualité social (croissance infinie)
Comportement utilisateur : défilement continu vers le bas, pas besoin de changer de page
Meilleure solution : défilement infini + chargement par lots

// Cas 4 : Rapport de données (tableaux complexes)
Comportement utilisateur : consultation, tri, export
Meilleure solution : pagination back-end + API d'export
```

---

## Vue d'ensemble des solutions d'optimisation

### Tableau comparatif des solutions

| Solution         | Cas d'utilisation            | Avantages                | Inconvénients            | Difficulté | Performance |
| ---------------- | ---------------------------- | ------------------------ | ------------------------ | ---------- | ----------- |
| **Pagination back-end** | La plupart des cas     | Simple et fiable, SEO friendly | Besoin de tourner les pages, interruption de l'expérience | 1/5 Simple | 3/5 Moyen |
| **Virtual Scrolling** | Grandes quantités à hauteur fixe | Performance maximale, défilement fluide | Implémentation complexe, pas de recherche native | 4/5 Complexe | 5/5 Excellent |
| **Défilement infini** | Réseaux sociaux, fil d'actualités | Expérience continue, implémentation simple | Accumulation de mémoire, pas de saut de page | 2/5 Simple | 3/5 Moyen |
| **Chargement par lots** | Optimisation du premier chargement | Chargement progressif, combinable avec skeleton screen | Nécessite la coopération du back-end | 2/5 Simple | 3/5 Moyen |
| **Web Worker** | Calculs massifs, tri, filtrage | Ne bloque pas le thread principal | Coût de communication, débogage difficile | 3/5 Moyen | 4/5 Bon |
| **Solution hybride** | Besoins complexes | Combine les avantages de plusieurs solutions | Haute complexité | 4/5 Complexe | 4/5 Bon |

---

## Détails des solutions

### 1. Pagination back-end (Pagination) - Solution privilégiée

> **Note de recommandation : 5/5 (fortement recommandée)**
> Solution la plus courante et la plus fiable, adaptée à 80 % des cas

#### Implémentation

```javascript
// Requête front-end
async function fetchData(page = 1, pageSize = 20) {
  const response = await fetch(`/api/data?page=${page}&pageSize=${pageSize}`);
  return response.json();
}

// API back-end (exemple Node.js + MongoDB)
app.get('/api/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;

  const data = await Collection.find().skip(skip).limit(pageSize).lean(); // Retourne uniquement des objets simples, sans méthodes Mongoose

  const total = await Collection.countDocuments();

  res.json({
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});
```

#### Astuces d'optimisation

```javascript
// 1. Pagination par curseur (Cursor-based Pagination)
// Adaptée aux données mises à jour en temps réel, évite les doublons ou les omissions
const data = await Collection.find({ _id: { $gt: cursor } })
  .limit(20)
  .sort({ _id: 1 });

// 2. Mise en cache des pages populaires
const cacheKey = `data:page:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// 3. Ne retourner que les champs nécessaires
const data = await Collection.find()
  .select('id name price status') // Sélection des champs nécessaires uniquement
  .skip(skip)
  .limit(pageSize);
```

#### Cas d'utilisation

```markdown
✅ Adapté
├─ Back-office d'administration (listes de commandes, listes d'utilisateurs)
├─ Systèmes de consultation de données (historiques)
├─ Sites publics (blogs, actualités)
└─ Pages nécessitant le SEO

❌ Non adapté
├─ Expérience de défilement fluide nécessaire
├─ Listes en temps réel (la pagination peut "sauter")
└─ Applications type réseaux sociaux
```

---

### 2. Virtual Scrolling - Performance maximale

> **Note de recommandation : 4/5 (recommandée)**
> Meilleures performances, adaptée aux grandes quantités de données à hauteur fixe

Le Virtual Scrolling est une technique qui ne rend que la zone visible, réduisant les nœuds DOM de 10 000+ à 20-30, et l'utilisation mémoire de 80 %.

#### Concept fondamental

```javascript
// Ne rendre que les données de la zone visible
const itemHeight = 50; // Hauteur de chaque élément
const containerHeight = 600; // Hauteur du conteneur
const visibleCount = Math.ceil(containerHeight / itemHeight); // Nombre d'éléments visibles = 12

// Calculer quels éléments doivent être affichés
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// Ne rendre que cette plage
const visibleItems = allItems.slice(startIndex, endIndex);

// Compenser la hauteur avec du padding (pour une barre de défilement correcte)
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

#### Implémentation

```vue
<!-- Utilisation de vue-virtual-scroller -->
<template>
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">{{ item.name }}</div>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }))
);
</script>
```

#### Comparaison des performances

| Indicateur     | Rendu traditionnel | Virtual Scrolling | Amélioration |
| -------------- | ------------------ | ----------------- | ------------ |
| Nœuds DOM     | 10 000+            | 20-30             | ↓ 99,7 %    |
| Utilisation mémoire | 150 Mo          | 30 Mo             | ↓ 80 %      |
| Premier rendu  | 3-5 s              | 0,3 s             | ↑ 90 %      |
| FPS défilement | < 20               | 55-60             | ↑ 200 %     |

#### Pour en savoir plus

Pour une implémentation détaillée : [Implémentation complète du Virtual Scrolling ->](/docs/experience/performance/lv3-virtual-scroll)

---

### 3. Défilement infini (Infinite Scroll) - Expérience continue

> **Note de recommandation : 3/5 (à considérer)**
> Adapté aux réseaux sociaux, fils d'actualités et autres scénarios de navigation continue

#### Implémentation

```vue
<template>
  <div ref="scrollContainer" @scroll="handleScroll">
    <div v-for="item in displayedItems" :key="item.id">
      {{ item.name }}
    </div>
    <div v-if="loading" class="loading">Chargement...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const displayedItems = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);

// Chargement initial
onMounted(() => {
  loadMore();
});

// Charger plus de données
async function loadMore() {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  const { data, hasNext } = await fetchData(currentPage.value);
  displayedItems.value.push(...data);
  hasMore.value = hasNext;
  currentPage.value++;
  loading.value = false;
}

// Écoute du défilement
function handleScroll(e) {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  // Déclenchement du chargement à 100px du bas
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore();
  }
}
</script>
```

#### Astuces d'optimisation

```javascript
// 1. Utilisation d'IntersectionObserver (meilleures performances)
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMore();
    }
  },
  { rootMargin: '100px' } // Déclenchement 100px à l'avance
);

// Observer le dernier élément
const lastItem = document.querySelector('.item:last-child');
observer.observe(lastItem);

// 2. Contrôle par throttle (éviter les déclenchements multiples lors d'un défilement rapide)
import { throttle } from 'lodash';
const handleScroll = throttle(checkAndLoadMore, 200);

// 3. Déchargement virtuel (éviter l'accumulation de mémoire)
// Lorsque les données dépassent 500 lignes, supprimer les plus anciennes
if (displayedItems.value.length > 500) {
  displayedItems.value = displayedItems.value.slice(-500);
}
```

#### Cas d'utilisation

```markdown
✅ Adapté
├─ Fil d'actualité social (Facebook, Twitter)
├─ Listes d'actualités, d'articles
├─ Flux de produits en cascade
└─ Scénarios de navigation continue

❌ Non adapté
├─ Besoin de sauter à une page spécifique
├─ Affichage du total nécessaire (ex. "10 000 résultats au total")
└─ Besoin de revenir en haut (trop long après un long défilement)
```

---

### 4. Chargement progressif (Progressive Loading)

> **Note de recommandation : 3/5 (à considérer)**
> Chargement progressif pour améliorer l'expérience du premier écran

#### Implémentation

```javascript
// Stratégie de chargement par lots
async function loadDataInBatches() {
  const batchSize = 50;
  const totalBatches = Math.ceil(totalItems / batchSize);

  // Premier lot : chargement immédiat (données du premier écran)
  const firstBatch = await fetchBatch(0, batchSize);
  displayedItems.value = firstBatch;

  // Lots suivants : chargement différé
  for (let i = 1; i < totalBatches; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Intervalle de 100 ms
    const batch = await fetchBatch(i * batchSize, batchSize);
    displayedItems.value.push(...batch);
  }
}

// Combiné avec un skeleton screen
<template>
  <div v-if="loading">
    <SkeletonItem v-for="i in 10" :key="i" />
  </div>
  <div v-else>
    <Item v-for="item in items" :key="item.id" :data="item" />
  </div>
</template>
```

#### Utilisation de requestIdleCallback

```javascript
// Charger les données suivantes pendant les temps d'inactivité du navigateur
function loadBatchWhenIdle(batch) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      displayedItems.value.push(...batch);
    });
  } else {
    // Fallback : utiliser setTimeout
    setTimeout(() => {
      displayedItems.value.push(...batch);
    }, 0);
  }
}
```

---

### 5. Traitement par Web Worker (Heavy Computation)

> **Note de recommandation : 4/5 (recommandée)**
> Calculs massifs sans bloquer le thread principal

#### Cas d'utilisation

```markdown
✅ Adapté
├─ Tri de grandes quantités de données (10 000+ lignes)
├─ Filtrage complexe, recherche
├─ Conversion de formats de données
└─ Calculs statistiques (ex. traitement de données pour graphiques)

❌ Non adapté
├─ Manipulation du DOM nécessaire (inaccessible depuis le Worker)
├─ Calculs simples (le coût de communication dépasse le calcul lui-même)
└─ Interactions nécessitant un retour immédiat
```

#### Implémentation

```javascript
// worker.js
self.addEventListener('message', (e) => {
  const { data, keyword } = e.data;

  // Filtrage de grandes quantités de données dans le Worker
  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );

  // Renvoi du résultat
  self.postMessage(filtered);
});

// main.js
const worker = new Worker('/worker.js');

function searchData(keyword) {
  worker.postMessage({ data: allData, keyword });

  worker.onmessage = (e) => {
    displayedItems.value = e.data;
    console.log('Filtrage terminé, le thread principal ne rame pas');
  };
}
```

Pour plus de détails : [Application de Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

### 6. Solution hybride (Hybrid Approach)

Pour les scénarios complexes, combiner plusieurs solutions :

#### Solution A : Virtual Scrolling + pagination back-end

```javascript
// Récupérer 500 lignes à chaque fois depuis le back-end
// Rendre côté front-end avec le Virtual Scrolling
// Charger les 500 suivantes en arrivant en bas

const pageSize = 500;
const currentBatch = ref([]);

async function loadNextBatch() {
  const data = await fetchData(currentPage.value, pageSize);
  currentBatch.value.push(...data);
  currentPage.value++;
}

// Utiliser le Virtual Scrolling pour rendre currentBatch
```

#### Solution B : Défilement infini + déchargement virtuel

```javascript
// Chargement de données par défilement infini
// Mais quand les données dépassent 1000 lignes, supprimer les plus anciennes

function loadMore() {
  // Charger plus de données
  items.value.push(...newItems);

  // Déchargement virtuel (garder les 1000 plus récentes)
  if (items.value.length > 1000) {
    items.value = items.value.slice(-1000);
  }
}
```

#### Solution C : Optimisation de la recherche + Virtual Scrolling

```javascript
// Utiliser l'API back-end pour la recherche
// Rendre les résultats avec le Virtual Scrolling

async function search(keyword) {
  if (keyword) {
    // Avec mot-clé : recherche back-end (recherche floue, full-text)
    searchResults.value = await apiSearch(keyword);
  } else {
    // Sans mot-clé : afficher tout (Virtual Scrolling)
    searchResults.value = allItems.value;
  }
}
```

---

## Arbre de décision

```
Début : des dizaines de milliers de données à afficher
    ↓
Q1 : L'utilisateur a-t-il besoin de voir toutes les données ?
    ├─ Non → Pagination back-end + recherche/filtrage ✅
    ↓
    Oui
    ↓
Q2 : La hauteur des données est-elle fixe ?
    ├─ Oui → Virtual Scrolling ✅
    ├─ Non → Virtual Scrolling à hauteur dynamique (complexe) ou défilement infini ✅
    ↓
Q3 : Une expérience de navigation continue est-elle nécessaire ?
    ├─ Oui → Défilement infini ✅
    ├─ Non → Pagination back-end ✅
    ↓
Q4 : Y a-t-il des besoins de calculs massifs (tri, filtrage) ?
    ├─ Oui → Web Worker + Virtual Scrolling ✅
    ├─ Non → Virtual Scrolling ✅
```

---

## Stratégies d'optimisation complémentaires

Quelle que soit la solution choisie, ces optimisations sont applicables :

### 1. Contrôle de la fréquence de mise à jour des données

```javascript
// RequestAnimationFrame (adapté aux animations, défilement)
let latestData = null;
let scheduled = false;

socket.on('update', (data) => {
  latestData = data;
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(() => {
      updateUI(latestData);
      scheduled = false;
    });
  }
});

// Throttle (adapté à la recherche, resize)
import { throttle } from 'lodash';
const handleSearch = throttle(performSearch, 300);
```

### 2. Skeleton Screen

```vue
<template>
  <div v-if="loading">
    <!-- Affichage du skeleton pendant le chargement -->
    <div class="skeleton-item" v-for="i in 10" :key="i">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-text"></div>
    </div>
  </div>
  <div v-else>
    <!-- Données réelles -->
    <Item v-for="item in items" :key="item.id" />
  </div>
</template>

<style>
.skeleton-item {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
```

### 3. Indexation et cache

```javascript
// Création d'un index côté front-end (accélération de la recherche)
const indexedData = new Map();
data.forEach((item) => {
  indexedData.set(item.id, item);
});

// Recherche rapide
const item = indexedData.get(targetId); // O(1) au lieu de O(n)

// Utilisation d'IndexedDB pour mettre en cache de grandes quantités de données
import { openDB } from 'idb';

const db = await openDB('myDB', 1, {
  upgrade(db) {
    db.createObjectStore('items', { keyPath: 'id' });
  },
});

// Sauvegarde des données
await db.put('items', item);

// Lecture des données
const item = await db.get('items', id);
```

### 4. Optimisation de l'API back-end

```javascript
// 1. Ne retourner que les champs nécessaires
GET /api/items?fields=id,name,price

// 2. Utiliser la compression (gzip/brotli)
// Dans Express
app.use(compression());

// 3. HTTP/2 Server Push
// Pré-envoyer les données susceptibles d'être nécessaires

// 4. GraphQL (requêtes précises)
query {
  items(first: 20) {
    id
    name
    price
  }
}
```

---

## Indicateurs d'évaluation des performances

Après le choix de la solution, évaluez les résultats avec ces indicateurs :

### Indicateurs techniques

```markdown
1. Temps du premier affichage (FCP) : < 1 seconde
2. Temps d'interactivité (TTI) : < 3 secondes
3. FPS de défilement : > 50 (objectif 60)
4. Utilisation mémoire : < 50 Mo
5. Nombre de nœuds DOM : < 1000
```

### Indicateurs d'expérience utilisateur

```markdown
1. Taux de rebond : réduction de 20 %+
2. Temps de séjour : augmentation de 30 %+
3. Nombre d'interactions : augmentation de 40 %+
4. Taux d'erreur : < 0,1 %
```

### Outils de mesure

```markdown
1. Chrome DevTools
   ├─ Performance : Long Task, FPS
   ├─ Memory : utilisation mémoire
   └─ Network : nombre et taille des requêtes

2. Lighthouse
   ├─ Performance Score
   ├─ FCP / LCP / TTI
   └─ CLS

3. Monitoring personnalisé
   ├─ Performance API
   ├─ User Timing API
   └─ RUM (Real User Monitoring)
```

---

## Modèle de réponse en entretien

### Réponse structurée (méthode STAR)

**Intervieweur : Comment optimiser lorsqu'il y a des dizaines de milliers de données à l'écran ?**

**Réponse :**

> "C'est une excellente question. Avant de choisir une solution, j'évalue d'abord les besoins réels :
>
> **1. Analyse des besoins (30 secondes)**
>
> - L'utilisateur a-t-il besoin de voir toutes les données ? Dans la plupart des cas, non
> - La hauteur des données est-elle fixe ? Cela impacte le choix technique
> - Quelle est l'interaction principale de l'utilisateur ? Navigation, recherche ou consultation spécifique
>
> **2. Choix de la solution (1 minute)**
>
> Selon le scénario :
>
> - **Back-office d'administration** -> pagination back-end (le plus simple et fiable)
> - **Défilement fluide nécessaire** -> Virtual Scrolling (meilleures performances)
> - **Type réseaux sociaux** -> défilement infini (meilleure expérience)
> - **Besoins de calculs complexes** -> Web Worker + Virtual Scrolling
>
> **3. Cas concret (1 minute)**
>
> Dans mon projet précédent, nous devions afficher une liste de plus de 3000 jeux.
> J'ai choisi le Virtual Scrolling, avec les résultats suivants :
>
> - Nœuds DOM de 10 000+ à 20-30 (↓ 99,7 %)
> - Utilisation mémoire réduite de 80 % (150 Mo → 30 Mo)
> - Premier rendu de 3-5 s à 0,3 s
> - Fluidité du défilement à 60 FPS
>
> Avec le filtrage front-end, le contrôle des mises à jour via RAF et le skeleton screen, l'expérience utilisateur a été nettement améliorée.
>
> **4. Optimisations complémentaires (30 secondes)**
>
> Quelle que soit la solution, j'y associe :
>
> - Optimisation de l'API back-end (champs nécessaires uniquement, compression, cache)
> - Skeleton screen pour l'expérience de chargement
> - Debounce et throttle pour contrôler la fréquence de mise à jour
> - Outils comme Lighthouse pour le suivi continu des performances"

### Questions de suivi courantes

**Q : Et si on ne peut pas utiliser de librairie tierce ?**

R : Le principe fondamental du Virtual Scrolling n'est pas complexe et peut être implémenté manuellement. Il s'agit essentiellement de calculer la plage visible (startIndex/endIndex), charger les données dynamiquement (slice) et compenser la hauteur (padding top/bottom). En pratique, j'évalue le coût de développement : si le planning le permet, on peut l'implémenter soi-même, mais je recommande en priorité les librairies matures pour éviter les pièges.

**Q : Quels sont les inconvénients du Virtual Scrolling ?**

R : Il y a des compromis à considérer :

1. Impossible d'utiliser la recherche native du navigateur (Ctrl+F)
2. La sélection de tous les éléments nécessite un traitement spécial
3. Complexité d'implémentation élevée
4. L'accessibilité nécessite un traitement supplémentaire

Il faut donc évaluer si cela en vaut la peine selon les besoins réels.

**Q : Comment tester l'effet de l'optimisation ?**

R : En combinant plusieurs outils :

- Chrome DevTools Performance (Long Task, FPS)
- Lighthouse (score global)
- Monitoring de performance personnalisé (Performance API)
- Suivi du comportement utilisateur (taux de rebond, temps de séjour)

---

## Notes connexes

- [Implémentation complète du Virtual Scrolling ->](/docs/experience/performance/lv3-virtual-scroll)
- [Vue d'ensemble de l'optimisation des performances web ->](/docs/experience/performance)
- [Application de Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

## Résumé

Face à la question "optimiser des dizaines de milliers de données" :

1. **Évaluez d'abord les besoins** : ne vous précipitez pas sur la technique
2. **Connaissez plusieurs solutions** : pagination back-end, Virtual Scrolling, défilement infini, etc.
3. **Pesez les compromis** : performances vs coût de développement vs expérience utilisateur
4. **Optimisez en continu** : utilisez des outils de monitoring pour améliorer continuellement
5. **Laissez parler les chiffres** : prouvez l'efficacité de l'optimisation par des données de performance réelles

Retenez : **il n'y a pas de solution miracle, seulement la solution la plus adaptée au scénario actuel**.
