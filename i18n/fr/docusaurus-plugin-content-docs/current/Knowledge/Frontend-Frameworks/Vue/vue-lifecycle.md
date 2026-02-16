---
id: vue-lifecycle
title: '[Medium] Hooks de cycle de vie Vue'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Please explain Vue lifecycle hooks (include Vue 2 & Vue 3)

> Expliquez les hooks de cycle de vie de Vue (incluant Vue 2 et Vue 3).

Les composants Vue traversent une série d'étapes de la création à la destruction. Des fonctions spécifiques sont automatiquement appelées au cours de ces étapes : ce sont les "hooks de cycle de vie". Comprendre le cycle de vie est essentiel pour maîtriser le comportement des composants.

### Schéma du cycle de vie Vue

```
Phase de création → Phase de montage → Phase de mise à jour → Phase de destruction
       ↓                  ↓                   ↓                    ↓
    Created            Mounted             Updated             Unmounted
```

### Tableau comparatif des cycles de vie Vue 2 vs Vue 3

| Vue 2 (Options API) | Vue 3 (Options API) | Vue 3 (Composition API) | Description                          |
| ------------------- | ------------------- | ----------------------- | ------------------------------------ |
| `beforeCreate`      | `beforeCreate`      | `setup()`               | Avant l'initialisation de l'instance |
| `created`           | `created`           | `setup()`               | Instance créée                       |
| `beforeMount`       | `beforeMount`       | `onBeforeMount`         | Avant le montage au DOM              |
| `mounted`           | `mounted`           | `onMounted`             | Après le montage au DOM              |
| `beforeUpdate`      | `beforeUpdate`      | `onBeforeUpdate`        | Avant la mise à jour des données     |
| `updated`           | `updated`           | `onUpdated`             | Après la mise à jour des données     |
| `beforeDestroy`     | `beforeUnmount`     | `onBeforeUnmount`       | Avant le démontage du composant      |
| `destroyed`         | `unmounted`         | `onUnmounted`           | Après le démontage du composant      |
| `activated`         | `activated`         | `onActivated`           | Activation d'un composant keep-alive |
| `deactivated`       | `deactivated`       | `onDeactivated`         | Désactivation d'un composant keep-alive |
| `errorCaptured`     | `errorCaptured`     | `onErrorCaptured`       | Capture d'erreur d'un composant enfant |

### 1. Phase de création (Creation Phase)

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // Les data et methods ne sont pas encore initialisés
    console.log('beforeCreate');
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // data, computed, methods et watch sont initialisés
    console.log('created');
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined (pas encore monté au DOM)

    // Bon moment pour envoyer des requêtes API
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**Quand l'utiliser :**

- `beforeCreate` : rarement utilisé, généralement pour le développement de plugins
- `created` :
  - Envoyer des requêtes API
  - Initialiser des données non réactives
  - Configurer des écouteurs d'événements
  - Impossible de manipuler le DOM (pas encore monté)

### 2. Phase de montage (Mounting Phase)

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Vue Lifecycle',
    };
  },

  beforeMount() {
    // Le Virtual DOM est créé, mais pas encore rendu dans le DOM réel
    console.log('beforeMount');
    console.log(this.$el); // Existe, mais le contenu est ancien
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    // Le composant est monté au DOM, on peut manipuler les éléments DOM
    console.log('mounted');
    console.log(this.$el); // Élément DOM réel
    console.log(this.$refs.myElement); // Accessible via ref

    // Bon moment pour manipuler le DOM
    this.initCanvas();

    // Bon moment pour utiliser des packages DOM tiers
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // Dessiner sur le canvas...
    },

    initChart() {
      // Initialiser un package de graphiques (comme Chart.js, ECharts)
      new Chart(this.$refs.myCanvas, {
        type: 'bar',
        data: {
          /* ... */
        },
      });
    },
  },
};
</script>
```

**Quand l'utiliser :**

- `beforeMount` : rarement utilisé
- `mounted` :
  - Manipuler les éléments DOM
  - Initialiser des packages DOM tiers (graphiques, cartes)
  - Configurer des écouteurs d'événements nécessitant le DOM
  - Démarrer des timers
  - **Attention** : le `mounted` des composants enfants s'exécute avant celui du composant parent

### 3. Phase de mise à jour (Updating Phase)

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>Compteur : {{ count }}</p>
    <button @click="count++">Incrémenter</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },

  beforeUpdate() {
    // Les données sont mises à jour, mais le DOM pas encore
    console.log('beforeUpdate');
    console.log('data count:', this.count); // Nouvelle valeur
    console.log('DOM count:', this.$el.querySelector('p').textContent); // Ancienne valeur

    // On peut accéder à l'état du DOM avant la mise à jour
  },

  updated() {
    // Les données et le DOM sont mis à jour
    console.log('updated');
    console.log('data count:', this.count); // Nouvelle valeur
    console.log('DOM count:', this.$el.querySelector('p').textContent); // Nouvelle valeur

    // Attention : ne pas modifier les données ici, cela causerait une boucle infinie
    // this.count++; // Erreur ! Causerait une mise à jour infinie
  },
};
</script>
```

**Quand l'utiliser :**

- `beforeUpdate` : quand on a besoin de l'état du DOM avant la mise à jour
- `updated` :
  - Opérations après la mise à jour du DOM (comme recalculer les dimensions)
  - **Ne pas modifier les données ici**, cela causerait une boucle de mise à jour infinie
  - Si besoin d'exécuter des opérations après un changement de données, préférer `watch` ou `nextTick`

### 4. Phase de destruction (Unmounting Phase)

#### `beforeUnmount` / `unmounted` (Vue 3) / `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    // Configurer un timer
    this.timer = setInterval(() => {
      console.log('Timer en cours d\'exécution...');
    }, 1000);

    // Établir une connexion WebSocket
    this.ws = new WebSocket('ws://example.com');
    this.ws.onmessage = (event) => {
      console.log('Message reçu :', event.data);
    };

    // Configurer des écouteurs d'événements
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  },

  beforeUnmount() {
    // Vue 3 utilise beforeUnmount
    // Vue 2 utilise beforeDestroy
    console.log('beforeUnmount');
    // Le composant va être détruit, mais les données et le DOM sont encore accessibles
  },

  unmounted() {
    // Vue 3 utilise unmounted
    // Vue 2 utilise destroyed
    console.log('unmounted');

    // Nettoyer le timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Fermer la connexion WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Supprimer les écouteurs d'événements
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  },

  methods: {
    handleResize() {
      console.log('Taille de la fenêtre modifiée');
    },
    handleClick() {
      console.log('Événement clic');
    },
  },
};
</script>
```

**Quand l'utiliser :**

- `beforeUnmount` / `beforeDestroy` : rarement utilisé
- `unmounted` / `destroyed` :
  - Nettoyer les timers (`setInterval`, `setTimeout`)
  - Supprimer les écouteurs d'événements
  - Fermer les connexions WebSocket
  - Annuler les requêtes API en cours
  - Nettoyer les instances de packages tiers

### 5. Composant spécial : KeepAlive

#### Qu'est-ce que `<KeepAlive>` ?

`<KeepAlive>` est un composant intégré de Vue dont la fonction principale est de **mettre en cache les instances de composants**, évitant leur destruction lors du basculement.

- **Comportement par défaut** : quand un composant est basculé (par exemple, changement de route ou `v-if`), Vue détruit l'ancien composant et en crée un nouveau.
- **Comportement KeepAlive** : les composants enveloppés par `<KeepAlive>` conservent leur état en mémoire lors du basculement et ne sont pas détruits.

#### Fonctionnalités et caractéristiques principales

1. **Mise en cache de l'état** : conserve le contenu des formulaires, la position de défilement, etc.
2. **Optimisation des performances** : évite le rendu répété et les requêtes API redondantes.
3. **Cycle de vie dédié** : fournit deux hooks spécifiques `activated` et `deactivated`.

#### Cas d'utilisation

1. **Basculement multi-onglets** : par exemple, les onglets d'un système d'administration.
2. **Basculement liste/détail** : en revenant de la page de détail vers la liste, conserver la position de défilement et les filtres.
3. **Formulaires complexes** : un formulaire rempli à moitié ne doit pas perdre son contenu lors d'un changement de page.

#### Exemple d'utilisation

```vue
<template>
  <KeepAlive include="UserList,ProductList">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

- `include` : seuls les composants dont le nom correspond seront mis en cache.
- `exclude` : les composants dont le nom correspond **ne seront pas** mis en cache.
- `max` : nombre maximum d'instances de composants à mettre en cache.

### 6. Hooks de cycle de vie spéciaux

#### `activated` / `deactivated` (avec `<KeepAlive>`)

```vue
<template>
  <div>
    <button @click="toggleComponent">Basculer le composant</button>

    <!-- keep-alive met en cache le composant, pas de recréation -->
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script>
// ChildComponent.vue
export default {
  name: 'ChildComponent',

  mounted() {
    console.log('mounted - s\'exécute une seule fois');
  },

  activated() {
    console.log('activated - s\'exécute à chaque activation du composant');
    // Bon moment pour rafraîchir les données
    this.refreshData();
  },

  deactivated() {
    console.log('deactivated - s\'exécute à chaque désactivation du composant');
    // Bon moment pour mettre en pause des opérations (comme la lecture vidéo)
    this.pauseVideo();
  },

  unmounted() {
    console.log('unmounted - ne s\'exécute pas (car mis en cache par keep-alive)');
  },

  methods: {
    refreshData() {
      // Rafraîchir les données
    },
    pauseVideo() {
      // Mettre en pause la lecture vidéo
    },
  },
};
</script>
```

#### `errorCaptured` (gestion des erreurs)

```vue
<script>
// ParentComponent.vue
export default {
  errorCaptured(err, instance, info) {
    console.error('Erreur capturée dans un composant enfant :', err);
    console.log('Composant source de l\'erreur :', instance);
    console.log('Informations sur l\'erreur :', info);

    // Retourner false empêche l'erreur de se propager
    return false;
  },
};
</script>
```

### Cycle de vie avec Composition API de Vue 3

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() lui-même équivaut à beforeCreate + created
console.log('setup exécuté');

onBeforeMount(() => {
  console.log('onBeforeMount');
});

onMounted(() => {
  console.log('onMounted');
  // Manipuler le DOM, initialiser des packages
});

onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
});

onUpdated(() => {
  console.log('onUpdated');
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
});

onUnmounted(() => {
  console.log('onUnmounted');
  // Nettoyer les ressources
});

onActivated(() => {
  console.log('onActivated');
});

onDeactivated(() => {
  console.log('onDeactivated');
});

onErrorCaptured((err, instance, info) => {
  console.error('Erreur :', err);
  return false;
});
</script>
```

## 2. What's the execution order of parent and child component lifecycle hooks?

> Quel est l'ordre d'exécution des hooks de cycle de vie des composants parent et enfant ?

C'est une question d'entretien très importante. Comprendre l'ordre d'exécution du cycle de vie parent-enfant aide à maîtriser les interactions entre composants.

### Ordre d'exécution

```
Parent beforeCreate
→ Parent created
→ Parent beforeMount
→ Enfant beforeCreate
→ Enfant created
→ Enfant beforeMount
→ Enfant mounted
→ Parent mounted
```

**Point clé : "Création de l'extérieur vers l'intérieur, montage de l'intérieur vers l'extérieur"**

### Exemple pratique

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>Composant parent</h1>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentComponent',
  components: { ChildComponent },

  beforeCreate() {
    console.log('1. Parent beforeCreate');
  },
  created() {
    console.log('2. Parent created');
  },
  beforeMount() {
    console.log('3. Parent beforeMount');
  },
  mounted() {
    console.log('8. Parent mounted');
  },
  beforeUpdate() {
    console.log('Parent beforeUpdate');
  },
  updated() {
    console.log('Parent updated');
  },
  beforeUnmount() {
    console.log('9. Parent beforeUnmount');
  },
  unmounted() {
    console.log('12. Parent unmounted');
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>Composant enfant</h2>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',

  beforeCreate() {
    console.log('4. Enfant beforeCreate');
  },
  created() {
    console.log('5. Enfant created');
  },
  beforeMount() {
    console.log('6. Enfant beforeMount');
  },
  mounted() {
    console.log('7. Enfant mounted');
  },
  beforeUpdate() {
    console.log('Enfant beforeUpdate');
  },
  updated() {
    console.log('Enfant updated');
  },
  beforeUnmount() {
    console.log('10. Enfant beforeUnmount');
  },
  unmounted() {
    console.log('11. Enfant unmounted');
  },
};
</script>
```

### Ordre d'exécution par phase

#### 1. Phase de création et de montage

```
1. Parent beforeCreate
2. Parent created
3. Parent beforeMount
4. Enfant beforeCreate
5. Enfant created
6. Enfant beforeMount
7. Enfant mounted        ← L'enfant termine le montage en premier
8. Parent mounted        ← Le parent termine le montage en dernier
```

**Raison** : le composant parent doit attendre que le composant enfant ait terminé son montage pour s'assurer que l'arbre de composants complet est rendu.

#### 2. Phase de mise à jour

```
Changement de données du parent :
1. Parent beforeUpdate
2. Enfant beforeUpdate  ← Si l'enfant utilise les données du parent
3. Enfant updated
4. Parent updated

Changement de données de l'enfant :
1. Enfant beforeUpdate
2. Enfant updated
(Le parent ne déclenche pas de mise à jour)
```

#### 3. Phase de destruction

```
9. Parent beforeUnmount
10. Enfant beforeUnmount
11. Enfant unmounted     ← L'enfant est détruit en premier
12. Parent unmounted     ← Le parent est détruit en dernier
```

### Cas de composants enfants multiples

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-a />
    <child-b />
    <child-c />
  </div>
</template>
```

Ordre d'exécution :

```
1. Parent beforeCreate
2. Parent created
3. Parent beforeMount
4. EnfantA beforeCreate
5. EnfantA created
6. EnfantA beforeMount
7. EnfantB beforeCreate
8. EnfantB created
9. EnfantB beforeMount
10. EnfantC beforeCreate
11. EnfantC created
12. EnfantC beforeMount
13. EnfantA mounted
14. EnfantB mounted
15. EnfantC mounted
16. Parent mounted
```

### Pourquoi cet ordre ?

#### Phase de montage (Mounting)

Le processus de montage de Vue est similaire à un "parcours en profondeur d'abord" :

1. Le composant parent commence sa création
2. Lors de l'analyse du template, il découvre les composants enfants
3. Il complète d'abord le montage complet des composants enfants
4. Une fois tous les enfants montés, le parent termine son montage

```
Le parent se prépare au montage
    ↓
Découverte des composants enfants
    ↓
Montage complet des enfants (beforeMount → mounted)
    ↓
Le parent termine son montage (mounted)
```

#### Phase de destruction (Unmounting)

L'ordre de destruction est "notification au parent d'abord, puis destruction séquentielle des enfants" :

```
Le parent se prépare à être détruit (beforeUnmount)
    ↓
Notification aux enfants de se préparer (beforeUnmount)
    ↓
Les enfants terminent leur destruction (unmounted)
    ↓
Le parent termine sa destruction (unmounted)
```

### Scénarios d'application pratiques

#### Scénario 1 : Le parent doit attendre le chargement des données des enfants

```vue
<!-- ParentComponent.vue -->
<script>
export default {
  data() {
    return {
      childrenReady: false,
    };
  },

  mounted() {
    // Tous les composants enfants sont montés
    console.log('Tous les composants enfants sont prêts');
    this.childrenReady = true;
  },
};
</script>
```

#### Scénario 2 : L'enfant doit accéder aux données fournies par le parent

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  inject: ['parentData'], // Recevoir les données fournies par le parent

  created() {
    // Les données du parent sont accessibles (le created du parent a déjà été exécuté)
    console.log('Données du parent :', this.parentData);
  },
};
</script>
```

#### Scénario 3 : Éviter d'accéder à un enfant non encore monté dans mounted

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="child" />
</template>

<script>
export default {
  mounted() {
    // L'enfant est monté, accès sécurisé
    this.$refs.child.someMethod();
  },
};
</script>
```

### Erreurs courantes

#### Erreur 1 : Accéder au ref d'un enfant dans le created du parent

```vue
<!-- Erreur -->
<script>
export default {
  created() {
    // L'enfant n'est pas encore créé
    console.log(this.$refs.child); // undefined
  },
};
</script>

<!-- Correct -->
<script>
export default {
  mounted() {
    // L'enfant est monté
    console.log(this.$refs.child); // Accessible
  },
};
</script>
```

#### Erreur 2 : Supposer que l'enfant est monté avant le parent

```vue
<!-- Erreur -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // Supposer que le parent est monté (faux !)
    this.$parent.someMethod(); // Peut échouer
  },
};
</script>

<!-- Correct -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // Utiliser $nextTick pour s'assurer que le parent est aussi monté
    this.$nextTick(() => {
      this.$parent.someMethod();
    });
  },
};
</script>
```

## 3. When should we use each lifecycle hook?

> Quand devons-nous utiliser chaque hook de cycle de vie ?

Voici un résumé des meilleurs cas d'utilisation pour chaque hook de cycle de vie.

### Tableau récapitulatif des cas d'utilisation

| Cycle de vie  | Usages courants                        | Contenu accessible                  |
| ------------- | -------------------------------------- | ----------------------------------- |
| `created`     | Requêtes API, initialisation de données | data, methods (pas le DOM)         |
| `mounted`     | Manipulation du DOM, initialisation de packages | data, methods, DOM           |
| `updated`     | Opérations après mise à jour du DOM    | Nouveau DOM                         |
| `unmounted`   | Nettoyage des ressources               | Nettoyage des timers, événements    |
| `activated`   | Activation keep-alive                  | Rafraîchissement des données        |

### Exemples d'application pratiques

#### 1. `created` : Requêtes API

```vue
<script>
export default {
  data() {
    return {
      users: [],
      loading: true,
      error: null,
    };
  },

  created() {
    // Bon moment pour envoyer des requêtes API
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2. `mounted` : Initialisation de packages tiers

```vue
<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartInstance: null,
    };
  },

  mounted() {
    // Bon moment pour initialiser les packages nécessitant le DOM
    this.initChart();
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: { text: 'Données de ventes' },
        xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: {},
        series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
      });
    },
  },

  unmounted() {
    // Penser à nettoyer l'instance du graphique
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>
```

#### 3. `unmounted` : Nettoyage des ressources

```vue
<script>
export default {
  data() {
    return {
      intervalId: null,
      observer: null,
    };
  },

  mounted() {
    // Démarrer un timer
    this.intervalId = setInterval(() => {
      console.log('En cours d\'exécution...');
    }, 1000);

    // Créer un Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      console.log(entries);
    });
    this.observer.observe(this.$el);

    // Écouter les événements globaux
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    // Nettoyer le timer
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Nettoyer l'Observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Supprimer les écouteurs d'événements
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      console.log('Taille de la fenêtre modifiée');
    },
  },
};
</script>
```

### Astuces de mémorisation

1. **`created`** : "Création terminée, les données sont disponibles" → Requêtes API
2. **`mounted`** : "Montage terminé, le DOM est disponible" → Manipulation du DOM, packages tiers
3. **`updated`** : "Mise à jour terminée, le DOM est synchronisé" → Opérations post-mise à jour du DOM
4. **`unmounted`** : "Démontage terminé, penser à nettoyer" → Nettoyage des ressources

## Reference

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Vue 2 Lifecycle Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Vue 3 Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html)
- [Composition API: Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
