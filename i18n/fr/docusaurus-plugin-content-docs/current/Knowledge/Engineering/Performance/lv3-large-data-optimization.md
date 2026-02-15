---
id: performance-lv3-large-data-optimization
title: '[Lv3] Strategies d optimisation pour de grandes quantites de donnees : choix de solution et implementation'
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> Lorsque l'interface doit afficher des dizaines de milliers de donnees, comment trouver l'equilibre entre performances, experience utilisateur et cout de developpement ?

## Question type en entretien

**Q : Lorsque l'interface affiche des dizaines de milliers de donnees, comment les optimiser ?**

C'est une question ouverte. L'intervieweur s'attend a entendre plus qu'une seule solution :

1. **Evaluation des besoins** : est-il vraiment necessaire d'afficher autant de donnees d'un coup ?
2. **Choix de la solution** : quelles sont les options ? Quels sont leurs avantages et inconvenients ?
3. **Reflexion globale** : front-end + back-end + UX de maniere combinee
4. **Experience reelle** : raisons du choix et resultats obtenus

---

## Premiere etape : Evaluation des besoins

Avant de choisir une solution technique, posez-vous ces questions :

### Questions fondamentales

```markdown
❓ L'utilisateur a-t-il vraiment besoin de voir toutes les donnees ?
→ Dans la plupart des cas, l'utilisateur ne s'interesse qu'aux 50 a 100 premieres lignes
→ On peut reduire le perimetre par le filtrage, la recherche et le tri

❓ Les donnees doivent-elles etre mises a jour en temps reel ?
→ WebSocket en temps reel vs polling periodique vs chargement initial unique

❓ Quel est le mode d'interaction de l'utilisateur ?
→ Navigation principalement → Virtual Scrolling
→ Recherche de donnees specifiques → recherche + pagination
→ Consultation ligne par ligne → defilement infini

❓ La structure des donnees est-elle fixe ?
→ Hauteur fixe → Virtual Scrolling facile a implementer
→ Hauteur variable → calcul dynamique de la hauteur necessaire

❓ Faut-il pouvoir tout selectionner, imprimer ou exporter ?
→ Oui → le Virtual Scrolling a des limitations
→ Non → le Virtual Scrolling est le meilleur choix
```

### Analyses de cas reels

```javascript
// Cas 1 : Historique des transactions (10 000+ lignes)
Comportement utilisateur : consulter les transactions recentes, recherche ponctuelle par date
Meilleure solution : pagination back-end + recherche

// Cas 2 : Liste de jeux en temps reel (3 000+ titres)
Comportement utilisateur : navigation, filtrage par categorie, defilement fluide
Meilleure solution : Virtual Scrolling + filtrage front-end

// Cas 3 : Fil d'actualite social (croissance infinie)
Comportement utilisateur : defilement continu vers le bas, pas besoin de changer de page
Meilleure solution : defilement infini + chargement par lots

// Cas 4 : Rapport de donnees (tableaux complexes)
Comportement utilisateur : consultation, tri, export
Meilleure solution : pagination back-end + API d'export
```

---

## Vue d'ensemble des solutions d'optimisation

### Tableau comparatif des solutions

| Solution         | Cas d'utilisation            | Avantages                | Inconvenients            | Difficulte | Performance |
| ---------------- | ---------------------------- | ------------------------ | ------------------------ | ---------- | ----------- |
| **Pagination back-end** | La plupart des cas     | Simple et fiable, SEO friendly | Besoin de tourner les pages, interruption de l'experience | 1/5 Simple | 3/5 Moyen |
| **Virtual Scrolling** | Grandes quantites a hauteur fixe | Performance maximale, defilement fluide | Implementation complexe, pas de recherche native | 4/5 Complexe | 5/5 Excellent |
| **Defilement infini** | Reseaux sociaux, fil d'actualites | Experience continue, implementation simple | Accumulation de memoire, pas de saut de page | 2/5 Simple | 3/5 Moyen |
| **Chargement par lots** | Optimisation du premier chargement | Chargement progressif, combinable avec skeleton screen | Necessite la cooperation du back-end | 2/5 Simple | 3/5 Moyen |
| **Web Worker** | Calculs massifs, tri, filtrage | Ne bloque pas le thread principal | Cout de communication, debogage difficile | 3/5 Moyen | 4/5 Bon |
| **Solution hybride** | Besoins complexes | Combine les avantages de plusieurs solutions | Haute complexite | 4/5 Complexe | 4/5 Bon |

---

## Details des solutions

### 1. Pagination back-end (Pagination) - Solution privilegiee

> **Note de recommandation : 5/5 (fortement recommandee)**
> Solution la plus courante et la plus fiable, adaptee a 80 % des cas

#### Implementation

```javascript
// Requete front-end
async function fetchData(page = 1, pageSize = 20) {
  const response = await fetch(`/api/data?page=${page}&pageSize=${pageSize}`);
  return response.json();
}

// API back-end (exemple Node.js + MongoDB)
app.get('/api/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;

  const data = await Collection.find().skip(skip).limit(pageSize).lean(); // Retourne uniquement des objets simples, sans methodes Mongoose

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
// Adaptee aux donnees mises a jour en temps reel, evite les doublons ou les omissions
const data = await Collection.find({ _id: { $gt: cursor } })
  .limit(20)
  .sort({ _id: 1 });

// 2. Mise en cache des pages populaires
const cacheKey = `data:page:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// 3. Ne retourner que les champs necessaires
const data = await Collection.find()
  .select('id name price status') // Selection des champs necessaires uniquement
  .skip(skip)
  .limit(pageSize);
```

#### Cas d'utilisation

```markdown
✅ Adapte
├─ Back-office d'administration (listes de commandes, listes d'utilisateurs)
├─ Systemes de consultation de donnees (historiques)
├─ Sites publics (blogs, actualites)
└─ Pages necessitant le SEO

❌ Non adapte
├─ Experience de defilement fluide necessaire
├─ Listes en temps reel (la pagination peut "sauter")
└─ Applications type reseaux sociaux
```

---

### 2. Virtual Scrolling - Performance maximale

> **Note de recommandation : 4/5 (recommandee)**
> Meilleures performances, adaptee aux grandes quantites de donnees a hauteur fixe

Le Virtual Scrolling est une technique qui ne rend que la zone visible, reduisant les noeuds DOM de 10 000+ a 20-30, et l'utilisation memoire de 80 %.

#### Concept fondamental

```javascript
// Ne rendre que les donnees de la zone visible
const itemHeight = 50; // Hauteur de chaque element
const containerHeight = 600; // Hauteur du conteneur
const visibleCount = Math.ceil(containerHeight / itemHeight); // Nombre d'elements visibles = 12

// Calculer quels elements doivent etre affiches
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// Ne rendre que cette plage
const visibleItems = allItems.slice(startIndex, endIndex);

// Compenser la hauteur avec du padding (pour une barre de defilement correcte)
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

#### Implementation

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

| Indicateur     | Rendu traditionnel | Virtual Scrolling | Amelioration |
| -------------- | ------------------ | ----------------- | ------------ |
| Noeuds DOM     | 10 000+            | 20-30             | ↓ 99,7 %    |
| Utilisation memoire | 150 Mo          | 30 Mo             | ↓ 80 %      |
| Premier rendu  | 3-5 s              | 0,3 s             | ↑ 90 %      |
| FPS defilement | < 20               | 55-60             | ↑ 200 %     |

#### Pour en savoir plus

Pour une implementation detaillee : [Implementation complete du Virtual Scrolling ->](/docs/experience/performance/lv3-virtual-scroll)

---

### 3. Defilement infini (Infinite Scroll) - Experience continue

> **Note de recommandation : 3/5 (a considerer)**
> Adapte aux reseaux sociaux, fils d'actualites et autres scenarios de navigation continue

#### Implementation

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

// Charger plus de donnees
async function loadMore() {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  const { data, hasNext } = await fetchData(currentPage.value);
  displayedItems.value.push(...data);
  hasMore.value = hasNext;
  currentPage.value++;
  loading.value = false;
}

// Ecoute du defilement
function handleScroll(e) {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  // Declenchement du chargement a 100px du bas
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
  { rootMargin: '100px' } // Declenchement 100px a l'avance
);

// Observer le dernier element
const lastItem = document.querySelector('.item:last-child');
observer.observe(lastItem);

// 2. Controle par throttle (eviter les declenchements multiples lors d'un defilement rapide)
import { throttle } from 'lodash';
const handleScroll = throttle(checkAndLoadMore, 200);

// 3. Dechargement virtuel (eviter l'accumulation de memoire)
// Lorsque les donnees depassent 500 lignes, supprimer les plus anciennes
if (displayedItems.value.length > 500) {
  displayedItems.value = displayedItems.value.slice(-500);
}
```

#### Cas d'utilisation

```markdown
✅ Adapte
├─ Fil d'actualite social (Facebook, Twitter)
├─ Listes d'actualites, d'articles
├─ Flux de produits en cascade
└─ Scenarios de navigation continue

❌ Non adapte
├─ Besoin de sauter a une page specifique
├─ Affichage du total necessaire (ex. "10 000 resultats au total")
└─ Besoin de revenir en haut (trop long apres un long defilement)
```

---

### 4. Chargement progressif (Progressive Loading)

> **Note de recommandation : 3/5 (a considerer)**
> Chargement progressif pour ameliorer l'experience du premier ecran

#### Implementation

```javascript
// Strategie de chargement par lots
async function loadDataInBatches() {
  const batchSize = 50;
  const totalBatches = Math.ceil(totalItems / batchSize);

  // Premier lot : chargement immediat (donnees du premier ecran)
  const firstBatch = await fetchBatch(0, batchSize);
  displayedItems.value = firstBatch;

  // Lots suivants : chargement differe
  for (let i = 1; i < totalBatches; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Intervalle de 100 ms
    const batch = await fetchBatch(i * batchSize, batchSize);
    displayedItems.value.push(...batch);
  }
}

// Combine avec un skeleton screen
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
// Charger les donnees suivantes pendant les temps d'inactivite du navigateur
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

> **Note de recommandation : 4/5 (recommandee)**
> Calculs massifs sans bloquer le thread principal

#### Cas d'utilisation

```markdown
✅ Adapte
├─ Tri de grandes quantites de donnees (10 000+ lignes)
├─ Filtrage complexe, recherche
├─ Conversion de formats de donnees
└─ Calculs statistiques (ex. traitement de donnees pour graphiques)

❌ Non adapte
├─ Manipulation du DOM necessaire (inaccessible depuis le Worker)
├─ Calculs simples (le cout de communication depasse le calcul lui-meme)
└─ Interactions necessitant un retour immediat
```

#### Implementation

```javascript
// worker.js
self.addEventListener('message', (e) => {
  const { data, keyword } = e.data;

  // Filtrage de grandes quantites de donnees dans le Worker
  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );

  // Renvoi du resultat
  self.postMessage(filtered);
});

// main.js
const worker = new Worker('/worker.js');

function searchData(keyword) {
  worker.postMessage({ data: allData, keyword });

  worker.onmessage = (e) => {
    displayedItems.value = e.data;
    console.log('Filtrage termine, le thread principal ne rame pas');
  };
}
```

Pour plus de details : [Application de Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

### 6. Solution hybride (Hybrid Approach)

Pour les scenarios complexes, combiner plusieurs solutions :

#### Solution A : Virtual Scrolling + pagination back-end

```javascript
// Recuperer 500 lignes a chaque fois depuis le back-end
// Rendre cote front-end avec le Virtual Scrolling
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

#### Solution B : Defilement infini + dechargement virtuel

```javascript
// Chargement de donnees par defilement infini
// Mais quand les donnees depassent 1000 lignes, supprimer les plus anciennes

function loadMore() {
  // Charger plus de donnees
  items.value.push(...newItems);

  // Dechargement virtuel (garder les 1000 plus recentes)
  if (items.value.length > 1000) {
    items.value = items.value.slice(-1000);
  }
}
```

#### Solution C : Optimisation de la recherche + Virtual Scrolling

```javascript
// Utiliser l'API back-end pour la recherche
// Rendre les resultats avec le Virtual Scrolling

async function search(keyword) {
  if (keyword) {
    // Avec mot-cle : recherche back-end (recherche floue, full-text)
    searchResults.value = await apiSearch(keyword);
  } else {
    // Sans mot-cle : afficher tout (Virtual Scrolling)
    searchResults.value = allItems.value;
  }
}
```

---

## Arbre de decision

```
Debut : des dizaines de milliers de donnees a afficher
    ↓
Q1 : L'utilisateur a-t-il besoin de voir toutes les donnees ?
    ├─ Non → Pagination back-end + recherche/filtrage ✅
    ↓
    Oui
    ↓
Q2 : La hauteur des donnees est-elle fixe ?
    ├─ Oui → Virtual Scrolling ✅
    ├─ Non → Virtual Scrolling a hauteur dynamique (complexe) ou defilement infini ✅
    ↓
Q3 : Une experience de navigation continue est-elle necessaire ?
    ├─ Oui → Defilement infini ✅
    ├─ Non → Pagination back-end ✅
    ↓
Q4 : Y a-t-il des besoins de calculs massifs (tri, filtrage) ?
    ├─ Oui → Web Worker + Virtual Scrolling ✅
    ├─ Non → Virtual Scrolling ✅
```

---

## Strategies d'optimisation complementaires

Quelle que soit la solution choisie, ces optimisations sont applicables :

### 1. Controle de la frequence de mise a jour des donnees

```javascript
// RequestAnimationFrame (adapte aux animations, defilement)
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

// Throttle (adapte a la recherche, resize)
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
    <!-- Donnees reelles -->
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
// Creation d'un index cote front-end (acceleration de la recherche)
const indexedData = new Map();
data.forEach((item) => {
  indexedData.set(item.id, item);
});

// Recherche rapide
const item = indexedData.get(targetId); // O(1) au lieu de O(n)

// Utilisation d'IndexedDB pour mettre en cache de grandes quantites de donnees
import { openDB } from 'idb';

const db = await openDB('myDB', 1, {
  upgrade(db) {
    db.createObjectStore('items', { keyPath: 'id' });
  },
});

// Sauvegarde des donnees
await db.put('items', item);

// Lecture des donnees
const item = await db.get('items', id);
```

### 4. Optimisation de l'API back-end

```javascript
// 1. Ne retourner que les champs necessaires
GET /api/items?fields=id,name,price

// 2. Utiliser la compression (gzip/brotli)
// Dans Express
app.use(compression());

// 3. HTTP/2 Server Push
// Pre-envoyer les donnees susceptibles d'etre necessaires

// 4. GraphQL (requetes precises)
query {
  items(first: 20) {
    id
    name
    price
  }
}
```

---

## Indicateurs d'evaluation des performances

Apres le choix de la solution, evaluez les resultats avec ces indicateurs :

### Indicateurs techniques

```markdown
1. Temps du premier affichage (FCP) : < 1 seconde
2. Temps d'interactivite (TTI) : < 3 secondes
3. FPS de defilement : > 50 (objectif 60)
4. Utilisation memoire : < 50 Mo
5. Nombre de noeuds DOM : < 1000
```

### Indicateurs d'experience utilisateur

```markdown
1. Taux de rebond : reduction de 20 %+
2. Temps de sejour : augmentation de 30 %+
3. Nombre d'interactions : augmentation de 40 %+
4. Taux d'erreur : < 0,1 %
```

### Outils de mesure

```markdown
1. Chrome DevTools
   ├─ Performance : Long Task, FPS
   ├─ Memory : utilisation memoire
   └─ Network : nombre et taille des requetes

2. Lighthouse
   ├─ Performance Score
   ├─ FCP / LCP / TTI
   └─ CLS

3. Monitoring personnalise
   ├─ Performance API
   ├─ User Timing API
   └─ RUM (Real User Monitoring)
```

---

## Modele de reponse en entretien

### Reponse structuree (methode STAR)

**Intervieweur : Comment optimiser lorsqu'il y a des dizaines de milliers de donnees a l'ecran ?**

**Reponse :**

> "C'est une excellente question. Avant de choisir une solution, j'evalue d'abord les besoins reels :
>
> **1. Analyse des besoins (30 secondes)**
>
> - L'utilisateur a-t-il besoin de voir toutes les donnees ? Dans la plupart des cas, non
> - La hauteur des donnees est-elle fixe ? Cela impacte le choix technique
> - Quelle est l'interaction principale de l'utilisateur ? Navigation, recherche ou consultation specifique
>
> **2. Choix de la solution (1 minute)**
>
> Selon le scenario :
>
> - **Back-office d'administration** -> pagination back-end (le plus simple et fiable)
> - **Defilement fluide necessaire** -> Virtual Scrolling (meilleures performances)
> - **Type reseaux sociaux** -> defilement infini (meilleure experience)
> - **Besoins de calculs complexes** -> Web Worker + Virtual Scrolling
>
> **3. Cas concret (1 minute)**
>
> Dans mon projet precedent, nous devions afficher une liste de plus de 3000 jeux.
> J'ai choisi le Virtual Scrolling, avec les resultats suivants :
>
> - Noeuds DOM de 10 000+ a 20-30 (↓ 99,7 %)
> - Utilisation memoire reduite de 80 % (150 Mo → 30 Mo)
> - Premier rendu de 3-5 s a 0,3 s
> - Fluidite du defilement a 60 FPS
>
> Avec le filtrage front-end, le controle des mises a jour via RAF et le skeleton screen, l'experience utilisateur a ete nettement amelioree.
>
> **4. Optimisations complementaires (30 secondes)**
>
> Quelle que soit la solution, j'y associe :
>
> - Optimisation de l'API back-end (champs necessaires uniquement, compression, cache)
> - Skeleton screen pour l'experience de chargement
> - Debounce et throttle pour controler la frequence de mise a jour
> - Outils comme Lighthouse pour le suivi continu des performances"

### Questions de suivi courantes

**Q : Et si on ne peut pas utiliser de librairie tierce ?**

R : Le principe fondamental du Virtual Scrolling n'est pas complexe et peut etre implemente manuellement. Il s'agit essentiellement de calculer la plage visible (startIndex/endIndex), charger les donnees dynamiquement (slice) et compenser la hauteur (padding top/bottom). En pratique, j'evalue le cout de developpement : si le planning le permet, on peut l'implementer soi-meme, mais je recommande en priorite les librairies matures pour eviter les pieges.

**Q : Quels sont les inconvenients du Virtual Scrolling ?**

R : Il y a des compromis a considerer :

1. Impossible d'utiliser la recherche native du navigateur (Ctrl+F)
2. La selection de tous les elements necessite un traitement special
3. Complexite d'implementation elevee
4. L'accessibilite necessite un traitement supplementaire

Il faut donc evaluer si cela en vaut la peine selon les besoins reels.

**Q : Comment tester l'effet de l'optimisation ?**

R : En combinant plusieurs outils :

- Chrome DevTools Performance (Long Task, FPS)
- Lighthouse (score global)
- Monitoring de performance personnalise (Performance API)
- Suivi du comportement utilisateur (taux de rebond, temps de sejour)

---

## Notes connexes

- [Implementation complete du Virtual Scrolling ->](/docs/experience/performance/lv3-virtual-scroll)
- [Vue d'ensemble de l'optimisation des performances web ->](/docs/experience/performance)
- [Application de Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

## Resume

Face a la question "optimiser des dizaines de milliers de donnees" :

1. **Evaluez d'abord les besoins** : ne vous precipitez pas sur la technique
2. **Connaissez plusieurs solutions** : pagination back-end, Virtual Scrolling, defilement infini, etc.
3. **Pesez les compromis** : performances vs cout de developpement vs experience utilisateur
4. **Optimisez en continu** : utilisez des outils de monitoring pour ameliorer continuellement
5. **Laissez parler les chiffres** : prouvez l'efficacite de l'optimisation par des donnees de performance reelles

Retenez : **il n'y a pas de solution miracle, seulement la solution la plus adaptee au scenario actuel**.
