---
id: vue-basic-api
title: '[Medium] Principes de base et API de Vue'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> Décrivez les principes fondamentaux et les avantages du framework Vue.

### Principes fondamentaux

Vue est un framework JavaScript progressif dont les principes fondamentaux comprennent les concepts importants suivants :

#### 1. Virtual DOM

Utilise le Virtual DOM pour améliorer les performances. Il ne met à jour que les nœuds DOM qui ont changé, au lieu de re-rendre l'ensemble de l'arbre DOM. L'algorithme diff compare les différences entre l'ancien et le nouveau Virtual DOM, et n'effectue des opérations DOM réelles que sur les parties modifiées.

```js
// Illustration conceptuelle du Virtual DOM
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. Liaison bidirectionnelle des données (Two-way Data Binding)

Utilise la liaison bidirectionnelle des données : lorsque le modèle (Model) change, la vue (View) se met à jour automatiquement, et inversement. Cela permet aux développeurs de ne pas manipuler le DOM manuellement et de se concentrer uniquement sur les changements de données.

```vue
<!-- Vue 3 écriture recommandée : <script setup> -->
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue');
</script>
```

<details>
<summary>Écriture Options API</summary>

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },
};
</script>
```

</details>

#### 3. Architecture par composants (Component-based)

Découpe l'application entière en composants individuels, ce qui améliore la réutilisabilité et facilite la maintenance et le développement. Chaque composant possède son propre état, ses styles et sa logique, et peut être développé et testé de manière indépendante.

```vue
<!-- Button.vue - Vue 3 <script setup> -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>
```

#### 4. Hooks de cycle de vie (Lifecycle Hooks)

Possède son propre cycle de vie. Lorsque les données changent, les hooks de cycle de vie correspondants sont déclenchés, permettant d'effectuer des opérations spécifiques à chaque étape du cycle de vie.

```vue
<!-- Vue 3 écriture <script setup> -->
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  // Exécuté après le montage du composant
  console.log('Component mounted!');
});

onUpdated(() => {
  // Exécuté après la mise à jour des données
  console.log('Component updated!');
});

onUnmounted(() => {
  // Exécuté après le démontage du composant
  console.log('Component unmounted!');
});
</script>
```

#### 5. Système de directives (Directives)

Fournit des directives courantes telles que `v-if`, `v-for`, `v-bind`, `v-model`, etc., permettant aux développeurs de développer plus rapidement.

```vue
<template>
  <!-- Rendu conditionnel -->
  <div v-if="isVisible">Contenu affiché</div>

  <!-- Rendu de liste -->
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <!-- Liaison d'attributs -->
  <img :src="imageUrl" :alt="imageAlt" />

  <!-- Liaison bidirectionnelle -->
  <input v-model="username" />
</template>
```

#### 6. Syntaxe de template (Template Syntax)

Utilise des templates pour écrire le HTML, permettant de rendre les données directement dans le template via l'interpolation.

```vue
<template>
  <div>
    <!-- Interpolation de texte -->
    <p>{{ message }}</p>

    <!-- Expression -->
    <p>{{ count + 1 }}</p>

    <!-- Appel de méthode -->
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Avantages uniques de Vue (par rapport à React)

#### 1. Courbe d'apprentissage plus faible

L'écart de niveau entre les membres d'une équipe est moins important, et le style d'écriture est uniformisé par les directives officielles, évitant une trop grande liberté. Cela facilite également la prise en main lors de la maintenance de différents projets.

```vue
<!-- Structure claire des composants mono-fichier Vue -->
<template>
  <!-- Template HTML -->
</template>

<script>
// Logique JavaScript
</script>

<style>
/* Styles CSS */
</style>
```

#### 2. Syntaxe de directives unique

Bien que cela soit discutable, le système de directives de Vue offre un moyen plus intuitif de gérer la logique d'interface courante :

```vue
<!-- Directives Vue -->
<div v-if="isLoggedIn">Bienvenue</div>
<button @click="handleClick">Cliquer</button>

<!-- React JSX -->
<div>{isLoggedIn && 'Bienvenue'}</div>
<button onClick="{handleClick}">Cliquer</button>
```

#### 3. Liaison bidirectionnelle plus facile à implémenter

Grâce à ses directives, les développeurs peuvent implémenter la liaison bidirectionnelle très facilement (`v-model`). Bien que React puisse aussi le faire, ce n'est pas aussi intuitif qu'avec Vue.

```vue
<!-- Liaison bidirectionnelle Vue -->
<input v-model="username" />

<!-- React nécessite un traitement manuel -->
<input value={username} onChange={(e) => setUsername(e.target.value)} />
```

#### 4. Séparation du template et de la logique

Le JSX de React est encore critiqué par certains développeurs. Dans certains contextes de développement, séparer la logique et l'interface utilisateur rend le code plus lisible et maintenable.

```vue
<!-- Vue : structure claire -->
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: 'John',
        email: 'john@example.com',
      },
    };
  },
};
</script>
```

#### 5. Écosystème officiel complet

Vue fournit un écosystème de solutions complet (Vue Router, Vuex/Pinia, Vue CLI), sans avoir à choisir parmi de nombreux packages tiers.

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> Expliquez l'utilisation de `v-model`, `v-bind` et `v-html`.

### `v-model` : Liaison bidirectionnelle des données

Lorsque les données changent, le contenu rendu dans le template est immédiatement mis à jour. Inversement, modifier le contenu du template met également à jour les données.

```vue
<template>
  <div>
    <!-- Champ de texte -->
    <input v-model="message" />
    <p>Contenu saisi : {{ message }}</p>

    <!-- Case à cocher -->
    <input type="checkbox" v-model="checked" />
    <p>Est coché : {{ checked }}</p>

    <!-- Liste déroulante -->
    <select v-model="selected">
      <option value="A">Option A</option>
      <option value="B">Option B</option>
    </select>
    <p>Option sélectionnée : {{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      selected: 'A',
    };
  },
};
</script>
```

#### Modificateurs de `v-model`

```vue
<!-- .lazy : mise à jour après l'événement change -->
<input v-model.lazy="msg" />

<!-- .number : conversion automatique en nombre -->
<input v-model.number="age" type="number" />

<!-- .trim : suppression automatique des espaces en début et fin -->
<input v-model.trim="msg" />
```

### `v-bind` : Liaison dynamique d'attributs

Couramment utilisé pour lier des classes, des liens, des images, etc. Lorsqu'une classe est liée via `v-bind`, sa présence peut être contrôlée par les données. De même, les chemins d'images ou les URLs retournés par une API peuvent être mis à jour dynamiquement via la liaison.

```vue
<template>
  <div>
    <!-- Liaison de class (raccourci :class) -->
    <div :class="{ active: isActive, 'text-danger': hasError }">Classe dynamique</div>

    <!-- Liaison de style -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">Style dynamique</div>

    <!-- Liaison de chemin d'image -->
    <img :src="imageUrl" :alt="imageAlt" />

    <!-- Liaison de lien -->
    <a :href="linkUrl">Aller au lien</a>

    <!-- Liaison d'attributs personnalisés -->
    <div :data-id="userId" :data-name="userName"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      textColor: 'red',
      fontSize: 16,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Description de l\'image',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### Raccourci de `v-bind`

```vue
<!-- Écriture complète -->
<img v-bind:src="imageUrl" />

<!-- Raccourci -->
<img :src="imageUrl" />

<!-- Liaison de plusieurs attributs -->
<div v-bind="objectOfAttrs"></div>
```

### `v-html` : Rendu de chaînes HTML

Lorsque les données retournées contiennent des balises HTML, cette directive permet de les rendre. Par exemple, pour afficher du contenu Markdown ou des chemins d'images contenant des balises `<img>`.

```vue
<template>
  <div>
    <!-- Interpolation normale : affiche les balises HTML -->
    <p>{{ rawHtml }}</p>
    <!-- Sortie : <span style="color: red">Texte rouge</span> -->

    <!-- v-html : rend le HTML -->
    <p v-html="rawHtml"></p>
    <!-- Sortie : Texte rouge (rendu en rouge) -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">Texte rouge</span>',
    };
  },
};
</script>
```

#### Avertissement de sécurité

**N'utilisez jamais `v-html` avec du contenu fourni par l'utilisateur**, cela entraînerait des vulnérabilités XSS (Cross-Site Scripting) !

```vue
<!-- Dangereux : l'utilisateur peut injecter des scripts malveillants -->
<div v-html="userProvidedContent"></div>

<!-- Sûr : uniquement pour du contenu de confiance -->
<div v-html="markdownRenderedContent"></div>
```

#### Alternative sécurisée

```vue
<template>
  <div>
    <!-- Utiliser un package pour assainir le HTML -->
    <div v-html="sanitizedHtml"></div>
  </div>
</template>

<script>
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      userInput: '<img src=x onerror=alert("XSS")>',
    };
  },
  computed: {
    sanitizedHtml() {
      // Utiliser DOMPurify pour nettoyer le HTML
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### Résumé comparatif des trois directives

| Directive | Usage                                   | Raccourci | Exemple                       |
| --------- | --------------------------------------- | --------- | ----------------------------- |
| `v-model` | Liaison bidirectionnelle des formulaires | Aucun     | `<input v-model="msg">`       |
| `v-bind`  | Liaison unidirectionnelle d'attributs   | `:`       | `<img :src="url">`            |
| `v-html`  | Rendu de chaînes HTML                   | Aucun     | `<div v-html="html"></div>`   |

## 3. How to access HTML elements (Template Refs)?

> Comment accéder aux éléments HTML dans Vue, par exemple obtenir un élément input et le mettre en focus ?

Dans Vue, il est déconseillé d'utiliser `document.querySelector` pour obtenir des éléments DOM. Il faut utiliser les **Template Refs**.

### Options API (Vue 2 / Vue 3)

Utilisez l'attribut `ref` pour marquer un élément dans le template, puis accédez-y via `this.$refs`.

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      // Accéder à l'élément DOM
      this.$refs.inputElement.focus();
    },
  },
  mounted() {
    // S'assurer que le composant est monté avant d'accéder
    console.log(this.$refs.inputElement);
  },
};
</script>
```

### Composition API (Vue 3)

Dans `<script setup>`, déclarez une variable `ref` portant le même nom pour obtenir l'élément.

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. Déclarer une variable du même nom que le template ref, initialisée à null
const inputElement = ref(null);

const focusInput = () => {
  // 2. Accéder au DOM via .value
  inputElement.value?.focus();
};

onMounted(() => {
  // 3. S'assurer que le composant est monté avant d'accéder
  console.log(inputElement.value);
});
</script>
```

**Remarques** :

- Le nom de la variable doit correspondre exactement à la valeur de l'attribut `ref` dans le template.
- L'élément DOM n'est accessible qu'après le montage du composant (`onMounted`), sinon il sera `null`.
- Dans une boucle `v-for`, le ref sera un tableau.

## 4. Please explain the difference between `v-show` and `v-if`

> Expliquez la différence entre `v-show` et `v-if`.

### Similarités

Les deux servent à contrôler l'affichage et le masquage des éléments DOM, en décidant si le contenu est affiché selon certaines conditions.

```vue
<template>
  <!-- Quand isVisible est true, les deux affichent le contenu -->
  <div v-if="isVisible">Utilise v-if</div>
  <div v-show="isVisible">Utilise v-show</div>
</template>
```

### Différences

#### 1. Mode d'opération DOM différent

```vue
<template>
  <div>
    <!-- v-show : contrôle via la propriété CSS display -->
    <div v-show="false">Cet élément existe toujours dans le DOM, mais avec display: none</div>

    <!-- v-if : supprime ou ajoute directement dans le DOM -->
    <div v-if="false">Cet élément n'apparaît pas dans le DOM</div>
  </div>
</template>
```

Résultat du rendu :

```html
<!-- Résultat v-show -->
<div style="display: none;">Cet élément existe toujours dans le DOM, mais avec display: none</div>

<!-- Résultat v-if : n'existe pas quand false -->
<!-- Aucun nœud DOM -->
```

#### 2. Différences de performance

**`v-show`** :

- Le coût de rendu initial est plus élevé (l'élément est toujours créé)
- Le coût de basculement est faible (seul le CSS change)
- Adapté aux scénarios de **basculement fréquent**

**`v-if`** :

- Le coût de rendu initial est plus faible (pas de rendu quand la condition est false)
- Le coût de basculement est plus élevé (destruction/recréation de l'élément)
- Adapté aux scénarios où la **condition change rarement**

```vue
<template>
  <div>
    <!-- Basculement fréquent : utiliser v-show -->
    <button @click="toggleModal">Basculer la modale</button>
    <div v-show="showModal" class="modal">
      Contenu de la modale (ouverture/fermeture fréquente, v-show est plus performant)
    </div>

    <!-- Changement rare : utiliser v-if -->
    <div v-if="userRole === 'admin'" class="admin-panel">
      Panneau d'administration (change rarement après connexion, utiliser v-if)
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      userRole: 'user',
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
  },
};
</script>
```

#### 3. Déclenchement du cycle de vie

**`v-if`** :

- Déclenche le **cycle de vie complet** du composant
- Quand la condition est false, le hook `unmounted` s'exécute
- Quand la condition est true, le hook `mounted` s'exécute

```vue
<template>
  <child-component v-if="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('Composant monté'); // S'exécute quand v-if passe de false à true
  },
  unmounted() {
    console.log('Composant démonté'); // S'exécute quand v-if passe de true à false
  },
};
</script>
```

**`v-show`** :

- **Ne déclenche pas** le cycle de vie du composant
- Le composant reste toujours monté
- Uniquement masqué via CSS

```vue
<template>
  <child-component v-show="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('Composant monté'); // S'exécute une seule fois lors du premier rendu
  },
  unmounted() {
    console.log('Composant démonté'); // Ne s'exécute pas (sauf si le composant parent est détruit)
  },
};
</script>
```

#### 4. Coût de rendu initial

```vue
<template>
  <div>
    <!-- v-if : si initialement false, pas de rendu du tout -->
    <heavy-component v-if="false" />

    <!-- v-show : si initialement false, rendu mais masqué -->
    <heavy-component v-show="false" />
  </div>
</template>
```

Si `heavy-component` est un composant lourd :

- `v-if="false"` : chargement initial plus rapide (pas de rendu)
- `v-show="false"` : chargement initial plus lent (rendu, mais masqué)

#### 5. Combinaison avec d'autres directives

`v-if` peut être combiné avec `v-else-if` et `v-else` :

```vue
<template>
  <div>
    <div v-if="type === 'A'">Type A</div>
    <div v-else-if="type === 'B'">Type B</div>
    <div v-else>Autre type</div>
  </div>
</template>
```

`v-show` ne peut pas être combiné avec `v-else` :

```vue
<!-- Erreur : v-show ne peut pas utiliser v-else -->
<div v-show="type === 'A'">Type A</div>
<div v-else>Autre type</div>

<!-- Correct : définir les conditions séparément -->
<div v-show="type === 'A'">Type A</div>
<div v-show="type !== 'A'">Autre type</div>
```

### Recommandations d'utilisation de computed et watch

#### Scénarios d'utilisation de `v-if`

1. La condition change rarement
2. La condition initiale est false et pourrait ne jamais devenir true
3. Besoin de combiner avec `v-else-if` ou `v-else`
4. Le composant a des ressources à nettoyer (comme des timers, des écouteurs d'événements)

```vue
<template>
  <!-- Contrôle des permissions : change rarement après connexion -->
  <admin-panel v-if="isAdmin" />

  <!-- Lié au routage : change uniquement lors de la navigation -->
  <home-page v-if="currentRoute === 'home'" />
  <about-page v-else-if="currentRoute === 'about'" />
</template>
```

#### Scénarios d'utilisation de `v-show`

1. Basculement fréquent de l'état d'affichage
2. Coût d'initialisation élevé du composant, souhait de préserver l'état
3. Pas besoin de déclencher les hooks de cycle de vie

```vue
<template>
  <!-- Changement d'onglet : l'utilisateur bascule fréquemment -->
  <div v-show="activeTab === 'profile'">Profil</div>
  <div v-show="activeTab === 'settings'">Paramètres</div>

  <!-- Modale : ouverture/fermeture fréquente -->
  <modal v-show="isModalVisible" />

  <!-- Animation de chargement : affichage/masquage fréquent -->
  <loading-spinner v-show="isLoading" />
</template>
```

### Résumé comparatif des performances

| Caractéristique      | v-if                                     | v-show                             |
| -------------------- | ---------------------------------------- | ---------------------------------- |
| Coût de rendu initial | Faible (pas de rendu si condition false) | Élevé (toujours rendu)             |
| Coût de basculement  | Élevé (destruction/recréation)           | Faible (changement CSS uniquement) |
| Scénario adapté      | Condition changeant rarement             | Basculement fréquent               |
| Cycle de vie         | Déclenché                                | Non déclenché                      |
| Combinaisons         | v-else-if, v-else                        | Aucune                             |

### Exemple comparatif pratique

```vue
<template>
  <div>
    <!-- Exemple 1 : Panneau d'administration (utiliser v-if) -->
    <!-- Raison : change rarement après connexion, contrôle de permissions -->
    <div v-if="userRole === 'admin'">
      <h2>Panneau d'administration</h2>
      <button @click="deleteUser">Supprimer l'utilisateur</button>
    </div>

    <!-- Exemple 2 : Modale (utiliser v-show) -->
    <!-- Raison : l'utilisateur ouvre/ferme fréquemment -->
    <div v-show="isModalOpen" class="modal">
      <h2>Titre de la modale</h2>
      <p>Contenu de la modale</p>
      <button @click="isModalOpen = false">Fermer</button>
    </div>

    <!-- Exemple 3 : Animation de chargement (utiliser v-show) -->
    <!-- Raison : affiché/masqué fréquemment lors des requêtes API -->
    <div v-show="isLoading" class="loading">
      <spinner />
    </div>

    <!-- Exemple 4 : Message d'erreur (utiliser v-if) -->
    <!-- Raison : rarement affiché, et nécessite un nouveau rendu -->
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: 'user',
      isModalOpen: false,
      isLoading: false,
      errorMessage: '',
    };
  },
};
</script>
```

### Points clés v-if et v-show

> - `v-if` : pas de rendu quand non affiché, adapté aux conditions changeant rarement
> - `v-show` : rendu dès le départ, toujours prêt à s'afficher, adapté au basculement fréquent

## 5. What's the difference between `computed` and `watch`?

> Quelle est la différence entre `computed` et `watch` ?

Ce sont deux fonctionnalités réactives très importantes dans Vue. Bien que les deux puissent surveiller les changements de données, leurs cas d'utilisation et caractéristiques sont très différents.

### `computed` (propriétés calculées)

#### Caractéristiques principales (computed)

1. **Mise en cache** : le résultat de `computed` est mis en cache et n'est recalculé que lorsque les données réactives dont il dépend changent
2. **Suivi automatique des dépendances** : suit automatiquement les données réactives utilisées dans le calcul
3. **Calcul synchrone** : doit être une opération synchrone et doit retourner une valeur
4. **Syntaxe concise** : peut être utilisé directement dans le template, comme une propriété de data

#### Cas d'utilisation courants (computed)

```vue
<!-- Vue 3 écriture <script setup> -->
<template>
  <div>
    <!-- Exemple 1 : Formatage de données -->
    <p>Nom complet : {{ fullName }}</p>
    <p>E-mail : {{ emailLowerCase }}</p>

    <!-- Exemple 2 : Calcul du total du panier -->
    <ul>
      <li v-for="item in cart" :key="item.id">
        {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
      </li>
    </ul>
    <p>Total : ${{ cartTotal }}</p>

    <!-- Exemple 3 : Filtrage de liste -->
    <input v-model="searchText" placeholder="Rechercher..." />
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const email = ref('JOHN@EXAMPLE.COM');
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);
const searchText = ref('');
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
]);

// Exemple 1 : Combinaison de données
const fullName = computed(() => {
  console.log('Calcul de fullName'); // S'exécute uniquement quand les dépendances changent
  return `${firstName.value} ${lastName.value}`;
});

// Exemple 2 : Formatage de données
const emailLowerCase = computed(() => {
  return email.value.toLowerCase();
});

// Exemple 3 : Calcul du total
const cartTotal = computed(() => {
  console.log('Calcul de cartTotal'); // S'exécute uniquement quand cart change
  return cart.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// Exemple 4 : Filtrage de liste
const filteredItems = computed(() => {
  if (!searchText.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});
</script>
```

#### Avantage de `computed` : mise en cache

```vue
<template>
  <div>
    <!-- Utilisation multiple de computed, mais un seul calcul -->
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>

    <!-- Utilisation de method, recalcul à chaque fois -->
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, index) => index));

const expensiveComputed = computed(() => {
  console.log('computed exécuté'); // S'exécute une seule fois
  return items.value.reduce((sum, item) => sum + item, 0);
});

const expensiveMethod = () => {
  console.log('method exécuté'); // Recalcul à chaque appel
  return items.value.reduce((sum, item) => sum + item, 0);
};
</script>
```

#### getter et setter de `computed`

```vue
<script setup>
import { computed, onMounted, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  // getter : exécuté lors de la lecture
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  // setter : exécuté lors de l'affectation
  set(newValue) {
    const names = newValue.split(' ');
    firstName.value = names[0] ?? '';
    lastName.value = names[names.length - 1] ?? '';
  },
});

onMounted(() => {
  console.log(fullName.value); // 'John Doe' (déclenche le getter)
  fullName.value = 'Jane Smith'; // Déclenche le setter
  console.log(firstName.value); // 'Jane'
  console.log(lastName.value); // 'Smith'
});
</script>
```

### `watch` (surveillance de propriétés)

#### Caractéristiques principales (watch)

1. **Suivi manuel des changements** : nécessite de spécifier explicitement quelle donnée surveiller
2. **Peut exécuter des opérations asynchrones** : adapté aux appels API, aux timers, etc.
3. **Pas besoin de valeur de retour** : principalement utilisé pour exécuter des effets secondaires (side effects)
4. **Peut surveiller plusieurs données** : via des tableaux ou une surveillance en profondeur d'objets
5. **Fournit l'ancienne et la nouvelle valeur** : permet d'obtenir les valeurs avant et après le changement

#### Cas d'utilisation courants (watch)

```vue
<!-- Vue 3 écriture <script setup> -->
<template>
  <div>
    <!-- Exemple 1 : Recherche en temps réel -->
    <input v-model="searchQuery" placeholder="Rechercher des utilisateurs..." />
    <div v-if="isSearching">Recherche en cours...</div>
    <ul>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.name }}
      </li>
    </ul>

    <!-- Exemple 2 : Validation de formulaire -->
    <input v-model="username" placeholder="Nom d'utilisateur" />
    <p v-if="usernameError" class="error">{{ usernameError }}</p>

    <!-- Exemple 3 : Sauvegarde automatique -->
    <textarea v-model="content" placeholder="Saisir le contenu..."></textarea>
    <p v-if="isSaving">Sauvegarde en cours...</p>
    <p v-if="lastSaved">Dernière sauvegarde : {{ lastSaved }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const username = ref('');
const usernameError = ref('');
const content = ref('');
const isSaving = ref(false);
const lastSaved = ref(null);

let searchTimer = null;
let saveTimer = null;

// Exemple 1 : Recherche en temps réel (debounce)
watch(searchQuery, async (newQuery, oldQuery) => {
  console.log(`Recherche passée de "${oldQuery}" à "${newQuery}"`);

  // Annuler le timer précédent
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  // Debounce : exécuter la recherche après 500ms
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } catch (error) {
      console.error('Échec de la recherche', error);
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// Exemple 2 : Validation de formulaire
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
  } else if (newUsername.length > 20) {
    usernameError.value = 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores';
  } else {
    usernameError.value = '';
  }
});

// Exemple 3 : Sauvegarde automatique
watch(content, (newContent) => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    isSaving.value = true;
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content: newContent }),
      });
      lastSaved.value = new Date().toLocaleTimeString();
    } catch (error) {
      console.error('Échec de la sauvegarde', error);
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  // Nettoyage des timers
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### Options de `watch`

```vue
<!-- Vue 3 écriture <script setup> -->
<script setup>
import { ref, watch, onMounted } from 'vue';

const user = ref({
  name: 'John',
  profile: {
    age: 30,
    city: 'Taipei',
  },
});
const items = ref([1, 2, 3]);

// Option 1 : immediate (exécution immédiate)
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`Nom changé de ${oldName} à ${newName}`);
  },
  { immediate: true } // Exécuter immédiatement à la création du composant
);

// Option 2 : deep (surveillance en profondeur)
watch(
  user,
  (newUser, oldUser) => {
    console.log('L\'objet user a changé en interne');
    console.log('Nouvelle valeur :', newUser);
  },
  { deep: true } // Surveiller les changements de toutes les propriétés internes
);

// Option 3 : flush (moment d'exécution)
watch(
  items,
  (newItems) => {
    console.log('items a changé');
  },
  { flush: 'post' } // Exécuter après la mise à jour du DOM (par défaut 'pre')
);

onMounted(() => {
  // Tester la surveillance en profondeur
  setTimeout(() => {
    user.value.profile.age = 31; // Déclenchera le deep watch
  }, 1000);
});
</script>
```

#### Surveiller plusieurs sources de données

```vue
<!-- Vue 3 écriture <script setup> -->
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// Vue 3 Composition API : surveiller plusieurs données
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Nom changé de ${oldFirst} ${oldLast} à ${newFirst} ${newLast}`);
});
</script>
```

### Comparaison `computed` vs `watch`

| Caractéristique        | computed                               | watch                                           |
| ---------------------- | -------------------------------------- | ----------------------------------------------- |
| **Usage principal**    | Calculer de nouvelles données          | Surveiller les changements et exécuter des effets |
| **Valeur de retour**   | Obligatoire                            | Non nécessaire                                  |
| **Cache**              | Oui                                    | Non                                             |
| **Suivi des dépendances** | Automatique                         | Manuel                                          |
| **Opérations asynchrones** | Non supporté                       | Supporté                                        |
| **Ancienne/nouvelle valeur** | Non disponible                  | Disponible                                      |
| **Utilisation dans le template** | Directement utilisable        | Non utilisable directement                      |
| **Moment d'exécution** | Quand les dépendances changent         | Quand les données surveillées changent           |

### Recommandations d'utilisation

#### Scénarios d'utilisation de `computed`

1. Besoin de **calculer de nouvelles données à partir de données existantes**
2. Le résultat est **utilisé plusieurs fois** dans le template (utilise le cache)
3. **Calcul synchrone**, pas d'opération asynchrone nécessaire
4. Besoin de **formater, filtrer, trier** des données

```vue
<script setup>
import { computed, ref } from 'vue';

const timestamp = ref(Date.now());
const users = ref([
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false },
  { id: 3, name: 'Carol', isActive: true },
]);
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);

// Formatage de données
const formattedDate = computed(() => {
  return new Date(timestamp.value).toLocaleDateString();
});

// Filtrage de liste
const activeUsers = computed(() => {
  return users.value.filter((user) => user.isActive);
});

// Calcul de somme
const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});
</script>
```

#### Scénarios d'utilisation de `watch`

1. Besoin d'**exécuter des opérations asynchrones** (comme des requêtes API)
2. Besoin d'**exécuter des effets secondaires** (comme mettre à jour localStorage)
3. Besoin de **debounce ou throttle**
4. Besoin d'**obtenir les anciennes et nouvelles valeurs pour comparaison**
5. Besoin d'**exécuter conditionnellement** une logique complexe

```vue
<script setup>
import { ref, watch } from 'vue';

const userId = ref(1);
const user = ref(null);

// Requête API
watch(userId, async (newId) => {
  user.value = await fetch(`/api/users/${newId}`).then((response) =>
    response.json()
  );
});

const settings = ref({
  theme: 'dark',
  notifications: true,
});

// Synchronisation avec localStorage
watch(
  settings,
  (newSettings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings));
  },
  { deep: true }
);

const searchQuery = ref('');
let searchTimer = null;

const performSearch = (keyword) => {
  console.log(`Recherche : ${keyword}`);
};

// Recherche avec debounce
watch(searchQuery, (newQuery) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    performSearch(newQuery);
  }, 500);
});
</script>
```

### Exemple comparatif pratique

#### Mauvaise utilisation

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const fullName = ref('');

// Erreur : devrait utiliser computed au lieu de watch
watch(firstName, (newFirst) => {
  fullName.value = `${newFirst} ${lastName.value}`;
});

watch(lastName, (newLast) => {
  fullName.value = `${firstName.value} ${newLast}`;
});
</script>
```

#### Bonne utilisation

```vue
<script setup>
import { computed, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// Correct : utiliser computed pour les données dérivées
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
</script>
```

### Points clés computed et watch

> **"computed calcule des données, watch exécute des actions"**
>
> - `computed` : pour **calculer de nouvelles données** (formatage, filtrage, sommes)
> - `watch` : pour **exécuter des actions** (requêtes API, sauvegarde de données, affichage de notifications)

### Exercice pratique : calculer x \* y

> Énoncé : x=0, y=5. Un bouton incrémente x de 1 à chaque clic. Utilisez computed ou watch pour implémenter le résultat de x \* y.

#### Solution 1 : Utiliser `computed` (recommandé)

C'est le scénario le plus adapté, car le résultat est une nouvelle donnée calculée à partir de x et y.

```vue
<template>
  <div>
    <p>X: {{ x }}, Y: {{ y }}</p>
    <p>Result (X * Y): {{ result }}</p>
    <button @click="x++">Increment X</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const x = ref(0);
const y = ref(5);

// Recommandé : simple, intuitif, suivi automatique des dépendances
const result = computed(() => x.value * y.value);
</script>
```

#### Solution 2 : Utiliser `watch` (plus verbeux)

Bien que possible, cela nécessite de maintenir manuellement la variable `result` et de gérer la valeur initiale.

```vue
<script setup>
import { ref, watch } from 'vue';

const x = ref(0);
const y = ref(5);
const result = ref(0);

// Moins recommandé : mise à jour manuelle, nécessite immediate pour le calcul initial
watch(
  [x, y],
  ([newX, newY]) => {
    result.value = newX * newY;
  },
  { immediate: true }
);
</script>
```

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
