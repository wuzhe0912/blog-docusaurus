---
id: theme-switching
title: "[Medium] \U0001F3A8 Implémentation du changement de thème"
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## Question d'entretien

**Q : Quand une page doit supporter 2 styles différents (par exemple thème clair/sombre), comment organisez-vous le CSS ?**

C'est une question qui évalue la conception d'architecture CSS et l'expérience pratique, impliquant :

1. Conception d'architecture CSS
2. Stratégie de changement de thème
3. Application d'outils modernes (Tailwind CSS, CSS Variables)
4. Considérations de performance et maintenabilité

---

## Vue d'ensemble des solutions

| Solution                    | Cas d'usage              | Avantages                              | Inconvénients              | Recommandation        |
| --------------------------- | ------------------------ | -------------------------------------- | -------------------------- | --------------------- |
| **CSS Variables**           | Projets navigateurs modernes | Changement dynamique, bonnes performances | Pas de support IE          | 5/5 Fortement recommandé |
| **Quasar + Pinia + SCSS**  | Projets Vue 3 + Quasar  | Écosystème complet, gestion d'état     | Nécessite Quasar Framework | 5/5 Fortement recommandé |
| **Tailwind CSS**            | Développement rapide     | Rapide, haute cohérence                | Courbe d'apprentissage, HTML verbeux | 5/5 Fortement recommandé |
| **Changement de class CSS** | Compatibilité anciens navigateurs | Bonne compatibilité                   | CSS volumineux             | 4/5 Recommandé       |
| **CSS Modules**             | Projets React/Vue        | Isolation de portée                    | Nécessite un bundler       | 4/5 Recommandé       |
| **Styled Components**       | Projets React            | CSS-in-JS, styles dynamiques           | Surcoût runtime            | 4/5 Recommandé       |
| **Variables SASS/LESS**     | Thème décidé à la compilation | Puissant                              | Pas de changement dynamique | 3/5 À considérer     |
| **Fichiers CSS séparés**    | Thèmes très différents   | Séparation claire                      | Coût de chargement, code dupliqué | 2/5 Non recommandé   |

---

## Solution 1 : CSS Variables

### Concept clé

Utilisation des propriétés CSS personnalisées (CSS Custom Properties), en changeant la class de l'élément racine pour modifier les valeurs des variables.

### Implémentation

#### 1. Définir les variables de thème

```css
/* styles/themes.css */

/* Thème clair (par défaut) */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  --color-card: #f9fafb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Thème sombre */
[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-secondary: #a78bfa;
  --color-background: #1f2937;
  --color-text: #f9fafb;
  --color-border: #374151;
  --color-card: #111827;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Si un troisième thème existe (par ex. mode protection des yeux) */
[data-theme='sepia'] {
  --color-primary: #92400e;
  --color-secondary: #78350f;
  --color-background: #fef3c7;
  --color-text: #451a03;
  --color-border: #fde68a;
  --color-card: #fef9e7;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
```

#### 2. Utiliser les variables

```css
/* components/Button.css */
.button {
  background-color: var(--color-primary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.card {
  background-color: var(--color-card);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

body {
  background-color: var(--color-background);
  color: var(--color-text);
}
```

#### 3. Changement de thème en JavaScript

```javascript
// utils/theme.js

// Obtenir le thème actuel
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

// Définir le thème
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Basculer le thème
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Initialisation (lecture des préférences utilisateur depuis localStorage)
function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);

  // Écouter les changements de thème système
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // Si l'utilisateur n'a pas défini de préférence, suivre le système
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Initialiser au chargement de la page
initTheme();
```

#### 4. Exemple d'intégration Vue 3

```vue
<template>
  <div>
    <button @click="toggleTheme" class="theme-toggle">
      <span v-if="currentTheme === 'light'">🌙 Mode sombre</span>
      <span v-else>☀️ Mode clair</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentTheme = ref('light');

function toggleTheme() {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light';
  currentTheme.value = newTheme;
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  currentTheme.value = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
});
</script>
```

### Avantages

- **Changement dynamique** : Pas besoin de recharger les fichiers CSS
- **Bonnes performances** : Support natif du navigateur, seules les valeurs des variables changent
- **Facile à maintenir** : Gestion centralisée des thèmes, modifications aisées
- **Extensible** : Ajout facile d'un troisième ou quatrième thème

### Inconvénients

- **Pas de support IE** : Nécessite un polyfill ou une solution de repli
- **Intégration avec les préprocesseurs** : Attention lors de l'utilisation mixte avec les variables SASS/LESS

---

## Solution 2 : Tailwind CSS

### Concept clé

Utilisation de la variante `dark:` de Tailwind CSS et de la configuration de thème personnalisée, combinées avec le changement de class pour implémenter le thème.

### Implémentation

#### 1. Configurer Tailwind

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Utiliser la stratégie class (et non media query)
  theme: {
    extend: {
      colors: {
        // Couleurs personnalisées (possibilité de définir plusieurs jeux de couleurs)
        primary: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
        background: {
          light: '#ffffff',
          dark: '#1f2937',
        },
        text: {
          light: '#1f2937',
          dark: '#f9fafb',
        },
      },
    },
  },
  plugins: [],
};
```

#### 2. Utiliser les classes de thème Tailwind

```vue
<template>
  <!-- Méthode 1 : utiliser la variante dark: -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h1 class="text-blue-600 dark:text-blue-400">Titre</h1>

    <button
      class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Bouton
    </button>

    <div
      class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg"
    >
      <p class="text-gray-700 dark:text-gray-300">Contenu textuel</p>
    </div>
  </div>

  <!-- Bouton de changement de thème -->
  <button @click="toggleTheme" class="fixed top-4 right-4">
    <svg v-if="isDark" class="w-6 h-6">
      <!-- Icône soleil -->
    </svg>
    <svg v-else class="w-6 h-6">
      <!-- Icône lune -->
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isDark = ref(false);

function toggleTheme() {
  isDark.value = !isDark.value;
  updateTheme();
}

function updateTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

onMounted(() => {
  // Lire la préférence de thème enregistrée
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});
</script>
```

#### 3. Avancé : Multi-thèmes personnalisés (plus de 2)

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--theme-bg)',
          text: 'var(--theme-text)',
          primary: 'var(--theme-primary)',
        },
      },
    },
  },
};
```

```css
/* styles/themes.css */
:root {
  --theme-bg: #ffffff;
  --theme-text: #000000;
  --theme-primary: #3b82f6;
}

[data-theme='dark'] {
  --theme-bg: #1f2937;
  --theme-text: #f9fafb;
  --theme-primary: #60a5fa;
}

[data-theme='sepia'] {
  --theme-bg: #fef3c7;
  --theme-text: #451a03;
  --theme-primary: #92400e;
}
```

```vue
<template>
  <!-- Utiliser les variables de thème personnalisées -->
  <div class="bg-theme-bg text-theme-text">
    <button class="bg-theme-primary">Bouton</button>
  </div>

  <!-- Sélecteur de thème -->
  <select @change="setTheme($event.target.value)">
    <option value="light">Clair</option>
    <option value="dark">Sombre</option>
    <option value="sepia">Protection des yeux</option>
  </select>
</template>

<script setup>
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
</script>
```

### Avantages de Tailwind

- **Développement rapide** : utility-first, pas besoin d'écrire du CSS
- **Cohérence** : système de design intégré, maintien d'un style uniforme
- **tree-shaking** : suppression automatique des styles inutilisés
- **RWD friendly** : variantes responsive `sm:`, `md:`, `lg:`
- **Variantes de thème** : `dark:`, `hover:`, `focus:` et autres variantes riches

### Inconvénients

- **HTML verbeux** : beaucoup de classes, peut affecter la lisibilité
- **Courbe d'apprentissage** : nécessite de maîtriser la nomenclature des utility classes
- **Personnalisation** : la personnalisation poussée nécessite de comprendre la configuration

---

## Solution 3 : Quasar + Pinia + SCSS (expérience récente)

> **Expérience de projet réel** : C'est la solution que j'ai utilisée dans un projet réel, intégrant Quasar Framework, la gestion d'état Pinia et le système de variables SCSS.

### Concept clé

Architecture multi-couches :

1. **Quasar Dark Mode API** - Support de thème au niveau du framework
2. **Pinia Store** - Gestion centralisée de l'état du thème
3. **SessionStorage** - Persistance des préférences utilisateur
4. **SCSS Variables + Mixin** - Variables de thème et gestion des styles

### Flux d'architecture

```
L'utilisateur clique sur le bouton de changement
    ↓
Quasar $q.dark.toggle()
    ↓
Pinia Store met à jour l'état
    ↓
Synchronisation avec SessionStorage
    ↓
Changement de class sur Body (.body--light / .body--dark)
    ↓
Mise à jour des variables CSS
    ↓
L'interface se met à jour automatiquement
```

### Implémentation

#### 1. Pinia Store (gestion d'état)

```typescript
// src/stores/darkModeStore.ts
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // Utiliser SessionStorage pour persister l'état
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // Mettre à jour l'état Dark Mode
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

#### 2. Configuration Quasar

```javascript
// quasar.config.js
module.exports = configure(function (/* ctx */) {
  return {
    framework: {
      config: {
        dark: 'true', // Activer le support Dark Mode
      },
      plugins: ['Notify', 'Loading', 'Dialog'],
    },
  };
});
```

#### 3. Système de variables de thème SCSS

```scss
// assets/css/_variable.scss

// Définition du mappage de variables pour les thèmes Light et Dark
$themes: (
  light: (
    --bg-main: #ffffff,
    --bg-side: #f0f1f4,
    --text-primary: #000000,
    --text-secondary: #666666,
    --primary-color: #2d7eff,
    --border-color: #e5ebf2,
  ),
  dark: (
    --bg-main: #081f2d,
    --bg-side: #0d2533,
    --text-primary: #ffffff,
    --text-secondary: #b0b0b0,
    --primary-color: #2d7eff,
    --border-color: #14384d,
  ),
);

// Mixin : Appliquer les variables CSS selon le thème
@mixin theme-vars($theme) {
  @each $key, $value in map-get($themes, $theme) {
    #{$key}: #{$value};
  }
}

// Mixin : Styles spécifiques au Light Mode
@mixin light {
  .body--light & {
    @content;
  }
}

// Mixin : Styles spécifiques au Dark Mode
@mixin dark {
  .body--dark & {
    @content;
  }
}
```

#### 4. Application globale du thème

```scss
// src/css/app.scss
@import 'assets/css/_variable.scss';

// Appliquer le Light Theme par défaut
:root {
  @include theme-vars('light');
}

// Appliquer le Dark Theme en Dark Mode
.body--dark {
  @include theme-vars('dark');
}
```

#### 5. Utilisation dans les composants

**Méthode A : Utiliser les CSS Variables (recommandée)**

```vue
<template>
  <div class="my-card">
    <h2 class="title">Titre</h2>
    <p class="content">Contenu textuel</p>
  </div>
</template>

<style scoped lang="scss">
.my-card {
  background: var(--bg-main);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 1rem;
}

.title {
  color: var(--primary-color);
  font-size: 1.5rem;
}

.content {
  color: var(--text-secondary);
}
</style>
```

**Méthode B : Utiliser les SCSS Mixins (avancée)**

```vue
<template>
  <button class="custom-btn">Bouton</button>
</template>

<style scoped lang="scss">
@import 'assets/css/_variable.scss';

.custom-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  @include light {
    background: #2d7eff;
    color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      background: #1a5fd9;
    }
  }

  @include dark {
    background: #1677ff;
    color: #ffffff;
    box-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);

    &:hover {
      background: #0d5acc;
    }
  }
}
</style>
```

#### 6. Fonctionnalité de changement

```vue
<template>
  <button @click="toggleDarkMode" class="theme-toggle">
    <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
    {{ isDarkMode ? 'Passer au mode clair' : 'Passer au mode sombre' }}
  </button>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useDarkModeStore } from 'stores/darkModeStore';

const $q = useQuasar();
const { isDarkMode, updateIsDarkMode } = useDarkModeStore();

// Changer de thème
const toggleDarkMode = () => {
  $q.dark.toggle(); // Changement Quasar
  updateIsDarkMode($q.dark.isActive); // Synchroniser avec le Store
};

// Restaurer les préférences utilisateur au chargement de la page
onMounted(() => {
  if (isDarkMode.value) {
    $q.dark.set(true);
  }
});
</script>

<style scoped lang="scss">
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: var(--text-primary);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}
</style>
```

### Avantages

- **Écosystème complet** : Solution tout-en-un Quasar + Pinia + VueUse
- **Gestion d'état** : Pinia centralise la gestion, facile à tester et maintenir
- **Persistance** : SessionStorage sauvegarde automatiquement, pas de perte au rafraîchissement
- **Sûreté des types** : Support TypeScript, réduction des erreurs
- **Expérience de développement** : Les SCSS Mixins simplifient le développement de styles
- **Bonnes performances** : CSS Variables mise à jour dynamique, pas besoin de rechargement

### Inconvénients

- **Dépendance au framework** : Nécessite Quasar Framework
- **Coût d'apprentissage** : Nécessite de maîtriser Quasar, Pinia, SCSS
- **Volume plus important** : Le framework complet est plus lourd que du CSS simple

### Bonnes pratiques

```typescript
// composables/useTheme.ts
import { computed } from 'vue';
import { useQuasar } from 'quasar';
import { useDarkModeStore } from 'stores/darkModeStore';

export function useTheme() {
  const $q = useQuasar();
  const store = useDarkModeStore();

  const isDark = computed(() => store.isDarkMode);

  const toggleTheme = () => {
    $q.dark.toggle();
    store.updateIsDarkMode($q.dark.isActive);
  };

  const setTheme = (dark: boolean) => {
    $q.dark.set(dark);
    store.updateIsDarkMode(dark);
  };

  return {
    isDark,
    toggleTheme,
    setTheme,
  };
}
```

### Comment le présenter en entretien

> "Dans mon dernier projet, nous avons implémenté un système complet de Dark Mode avec **Quasar + Pinia + SCSS** :
>
> 1. **Gestion d'état** : Gestion unifiée de l'état du thème via Pinia Store, avec persistance via `useSessionStorage` de VueUse
> 2. **Système de styles** : Définition des variables de thème avec SCSS Map + Mixin, appliquées dans `:root` et `.body--dark`
> 3. **Mécanisme de changement** : Contrôle via l'API `$q.dark` de Quasar, ajout automatique de la class correspondante sur `<body>`
> 4. **Expérience de développement** : Fourniture des mixins `@include light` et `@include dark` pour un développement de styles plus intuitif
>
> Cette solution a bien fonctionné dans notre projet : changement fluide, état stable, facile à maintenir."

---

## Solution 4 : Changement de class CSS

### Implémentation

```css
/* styles/themes.css */

/* Thème clair */
body.theme-light {
  background-color: #ffffff;
  color: #000000;
}

body.theme-light .button {
  background-color: #3b82f6;
  color: #ffffff;
}

body.theme-light .card {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
}

/* Thème sombre */
body.theme-dark {
  background-color: #1f2937;
  color: #f9fafb;
}

body.theme-dark .button {
  background-color: #60a5fa;
  color: #000000;
}

body.theme-dark .card {
  background-color: #111827;
  border: 1px solid #374151;
}
```

```javascript
// Changer de thème
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
}
```

### Cas d'utilisation

- Besoin de supporter IE et les anciens navigateurs
- Différences de thème trop importantes pour utiliser des variables
- Ne pas vouloir introduire de dépendances supplémentaires

---

## Solution 5 : Fichiers CSS séparés (non recommandé)

### Implémentation

```html
<!-- Chargement dynamique du CSS -->
<link id="theme-stylesheet" rel="stylesheet" href="/styles/theme-light.css" />
```

```javascript
function setTheme(theme) {
  const link = document.getElementById('theme-stylesheet');
  link.href = `/styles/theme-${theme}.css`;
}
```

### Inconvénients

- **Coût de chargement** : Le CSS doit être retéléchargé lors du changement
- **FOUC** : Possibilité de flash de contenu sans style
- **Code dupliqué** : Les styles communs doivent être définis en double

---

## Intégration du design responsive (RWD)

### Tailwind CSS + RWD + Changement de thème

```vue
<template>
  <div
    class="
      /* Styles de base */
      p-4 rounded-lg transition-colors

      /* Thème clair */
      bg-white text-gray-900

      /* Thème sombre */
      dark:bg-gray-800 dark:text-gray-100

      /* RWD: Mobile */
      text-sm

      /* RWD: Tablette et plus */
      md:text-base md:p-6

      /* RWD: Desktop et plus */
      lg:text-lg lg:p-8

      /* États d'interaction */
      hover:shadow-lg hover:scale-105
    "
  >
    <h2
      class="
        font-bold
        text-xl md:text-2xl lg:text-3xl
        text-blue-600 dark:text-blue-400
      "
    >
      Titre responsive
    </h2>

    <p class="mt-2 text-gray-700 dark:text-gray-300">Contenu textuel</p>

    <!-- Grille responsive -->
    <div
      class="
        grid
        grid-cols-1       /* Mobile: 1 colonne */
        sm:grid-cols-2    /* Petite tablette: 2 colonnes */
        md:grid-cols-3    /* Tablette: 3 colonnes */
        lg:grid-cols-4    /* Desktop: 4 colonnes */
        gap-4
      "
    >
      <div
        v-for="item in items"
        :key="item.id"
        class="
          p-4 rounded
          bg-gray-100 dark:bg-gray-700
          hover:bg-gray-200 dark:hover:bg-gray-600
        "
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
```

### CSS Variables + Media Queries

```css
/* Variables de base */
:root {
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --font-size-base: 16px;
}

/* Ajustement de l'espacement pour tablette et plus */
@media (min-width: 768px) {
  :root {
    --spacing-sm: 0.75rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
  }
}

/* Ajustement de la police pour desktop et plus */
@media (min-width: 1024px) {
  :root {
    --font-size-base: 18px;
  }
}

/* Utilisation des variables */
.container {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* Thème sombre + RWD */
@media (min-width: 768px) {
  [data-theme='dark'] {
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }
}
```

---

## Conseils d'optimisation des performances

### 1. Éviter le FOUC (Flash of Unstyled Content)

```html
<!-- Exécuter immédiatement dans le <head>, éviter le flash -->
<script>
  (function () {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

### 2. Utiliser prefers-color-scheme

```css
/* Détection automatique du thème système */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Si l'utilisateur n'a pas défini de préférence, suivre le système */
    --color-background: #1f2937;
    --color-text: #f9fafb;
  }
}
```

```javascript
// Détection JavaScript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (!localStorage.getItem('theme')) {
  setTheme(prefersDark ? 'dark' : 'light');
}
```

### 3. Transitions CSS animées

```css
/* Transition fluide */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* Ou pour des éléments spécifiques */
body,
.card,
.button {
  transition: all 0.3s ease;
}
```

### 4. Réduire le Reflow

```css
/* Utiliser transform plutôt que de modifier directement la largeur/hauteur */
.theme-switching {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.theme-switching:hover {
  transform: scale(1.05); /* Accélération GPU */
}
```

---

## Architecture de projet réel

### Structure de fichiers

```
src/
├── styles/
│   ├── themes/
│   │   ├── variables.css       # Définition des CSS Variables
│   │   ├── light.css          # Thème clair
│   │   ├── dark.css           # Thème sombre
│   │   └── sepia.css          # Thème protection des yeux
│   ├── base.css               # Styles de base
│   └── components/            # Styles des composants
│       ├── button.css
│       └── card.css
├── utils/
│   └── theme.js               # Logique de changement de thème
└── components/
    └── ThemeToggle.vue        # Composant de changement de thème
```

### Bonnes pratiques

```javascript
// composables/useTheme.js (Vue 3 Composition API)
import { ref, onMounted, watch } from 'vue';

export function useTheme() {
  const theme = ref('light');
  const themes = ['light', 'dark', 'sepia'];

  function setTheme(newTheme) {
    if (!themes.includes(newTheme)) return;

    theme.value = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Tailwind dark mode
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  function toggleTheme() {
    const currentIndex = themes.indexOf(theme.value);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    }
  }

  onMounted(() => {
    initTheme();

    // Écouter les changements de thème système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  });

  return {
    theme,
    themes,
    setTheme,
    toggleTheme,
  };
}
```

---

## Modèle de réponse d'entretien

**Interviewer : Quand une page doit supporter 2 styles différents, comment organisez-vous le CSS ?**

**Réponse type A : Montrer l'expérience réelle (recommandé)**

> "Je choisis la solution la plus adaptée en fonction de la stack technique du projet. **Dans mon dernier projet**, nous avons utilisé **Quasar + Pinia + SCSS** :
>
> **1. Gestion d'état (30 sec)**
>
> - Gestion unifiée de l'état du thème via Pinia Store
> - Persistance avec `useSessionStorage` de VueUse
> - Contrôle du thème via l'API `$q.dark` de Quasar
>
> **2. Système de styles (1 min)**
>
> ```scss
> // Définition des variables de thème avec SCSS Map
> $themes: (
>   light: (
>     --bg-main: #fff,
>     --text: #000,
>   ),
>   dark: (
>     --bg-main: #081f2d,
>     --text: #fff,
>   ),
> );
>
> // Application dans :root et .body--dark
> :root {
>   @include theme-vars('light');
> }
> .body--dark {
>   @include theme-vars('dark');
> }
> ```
>
> - Les composants utilisent `var(--bg-main)` pour le changement automatique
> - Fourniture des mixins `@include light` / `@include dark` pour les styles complexes
>
> **3. Mécanisme de changement (30 sec)**
>
> ```typescript
> const toggleTheme = () => {
>   $q.dark.toggle(); // Changement Quasar
>   store.updateIsDarkMode($q.dark.isActive); // Synchronisation Store
> };
> ```
>
> **4. Résultats concrets (30 sec)**
>
> - Changement fluide sans flash (mise à jour dynamique CSS Variables)
> - État persistant (le thème est conservé au rafraîchissement)
> - Facile à maintenir (variables de thème centralisées)
> - Haute productivité (les Mixins simplifient le développement de styles)"

**Réponse type B : Solution universelle (alternative)**

> "Pour les projets modernes, je recommande **CSS Variables + Tailwind CSS** :
>
> **1. Architecture (30 sec)**
>
> - Définition des variables de thème avec CSS Variables (couleurs, espacement, ombres, etc.)
> - Changement de thème via l'attribut `data-theme` sur l'élément racine
> - Développement rapide avec la variante `dark:` de Tailwind
>
> **2. Points clés d'implémentation (1 min)**
>
> ```css
> :root {
>   --color-bg: #fff;
>   --color-text: #000;
> }
> [data-theme='dark'] {
>   --color-bg: #1f2937;
>   --color-text: #f9fafb;
> }
> ```
>
> En JavaScript, il suffit de changer l'attribut `data-theme` pour que le navigateur applique automatiquement les variables correspondantes.
>
> **3. Intégration RWD (30 sec)**
>
> ```html
> <div class="text-sm md:text-base lg:text-lg dark:bg-gray-800"></div>
> ```
>
> Permet de gérer simultanément le RWD et le changement de thème.
>
> **4. Bonnes pratiques (30 sec)**
>
> - Initialisation immédiate du thème dans le `<head>` pour éviter le FOUC
> - Utilisation de `localStorage` pour sauvegarder les préférences utilisateur
> - Détection de `prefers-color-scheme` pour suivre le thème système"

---

## Questions de suivi

**Q1 : Comment supporter IE ?**

R : Utiliser la solution de changement de class CSS, ou utiliser le polyfill [css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill).

**Q2 : Comment éviter le flash lors du changement de thème ?**

R : Exécuter immédiatement un script dans le `<head>` HTML pour définir le thème avant le rendu de la page.

**Q3 : Comment gérer plusieurs thèmes ?**

R : Il est recommandé d'utiliser un système de Design Tokens pour gérer uniformément toutes les variables de thème, avec synchronisation via Figma Variables.

**Q4 : Comment tester les différents thèmes ?**

R : Utiliser Storybook avec `storybook-addon-themes` pour tester visuellement toutes les variantes de thème.

---

## Sujets connexes

- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Dark Mode in 5 Minutes](https://web.dev/prefers-color-scheme/)
