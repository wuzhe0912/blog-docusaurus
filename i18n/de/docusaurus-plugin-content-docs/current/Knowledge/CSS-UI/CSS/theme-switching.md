---
id: theme-switching
title: '[Medium] 🎨 Implementierung des Theme-Wechsels'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## Interview-Szenario

**F: Wenn eine Seite 2 verschiedene Stile haben soll (z.B. helles/dunkles Theme), wie organisiert man das CSS?**

Dies ist eine Frage, die CSS-Architekturdesign und praktische Erfahrung prüft und folgende Bereiche umfasst:

1. CSS-Architekturdesign
2. Theme-Wechselstrategie
3. Anwendung moderner Tools (Tailwind CSS, CSS Variables)
4. Performance- und Wartbarkeitsüberlegungen

---

## Lösungsüberblick

| Lösung                   | Einsatzszenario             | Vorteile                                   | Nachteile                    | Empfehlung           |
| ------------------------- | --------------------------- | ------------------------------------------ | ---------------------------- | -------------------- |
| **CSS Variables**         | Moderne Browser-Projekte    | Dynamischer Wechsel, gute Performance      | Kein IE-Support              | 5/5 Sehr empfohlen   |
| **Quasar + Pinia + SCSS** | Vue 3 + Quasar Projekte     | Komplettes Ökosystem, Zustandsverwaltung  | Erfordert Quasar Framework   | 5/5 Sehr empfohlen   |
| **Tailwind CSS**          | Schnelle Entwicklung, Design System | Schnelle Entwicklung, hohe Konsistenz | Lernkurve, HTML-Overhead     | 5/5 Sehr empfohlen   |
| **CSS-Class-Wechsel**     | Kompatibilität mit alten Browsern | Gute Kompatibilität                 | Größeres CSS               | 4/5 Empfohlen        |
| **CSS Modules**           | React/Vue Komponentenprojekte | Scope-Isolation                          | Erfordert Bundler            | 4/5 Empfohlen        |
| **Styled Components**     | React-Projekte              | CSS-in-JS, dynamische Stile                | Runtime-Overhead             | 4/5 Empfohlen        |
| **SASS/LESS Variablen**   | Theme zur Compile-Time      | Leistungsstarke Funktionen                 | Kein dynamischer Wechsel     | 3/5 Erwägbar        |
| **Separate CSS-Dateien**  | Große Theme-Unterschiede   | Klare Trennung                             | Ladezeitkosten, doppelter Code | 2/5 Nicht empfohlen |

---

## Lösung 1: CSS Variables

### Kernkonzept

Verwendung von CSS Custom Properties, um durch Wechsel der Class am Root-Element die Variablenwerte zu ändern.

### Implementierung

#### 1. Theme-Variablen definieren

```css
/* styles/themes.css */

/* Helles Theme (Standard) */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  --color-card: #f9fafb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Dunkles Theme */
[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-secondary: #a78bfa;
  --color-background: #1f2937;
  --color-text: #f9fafb;
  --color-border: #374151;
  --color-card: #111827;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Wenn ein drittes Theme vorhanden ist (z.B. Augenschonmodus) */
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

#### 2. Variablen verwenden

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

#### 3. Theme-Wechsel mit JavaScript

```javascript
// utils/theme.js

// Aktuelles Theme abrufen
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

// Theme setzen
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Theme umschalten
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Initialisieren (Benutzerpräferenz aus localStorage lesen)
function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);

  // System-Theme-Änderung überwachen
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // Wenn der Benutzer keine Präferenz festgelegt hat, dem System folgen
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Beim Laden der Seite initialisieren
initTheme();
```

#### 4. Vue 3 Integrationsbeispiel

```vue
<template>
  <div>
    <button @click="toggleTheme" class="theme-toggle">
      <span v-if="currentTheme === 'light'">🌙 Dunkler Modus</span>
      <span v-else>☀️ Heller Modus</span>
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

### Vorteile

- **Dynamischer Wechsel**: Kein Neuladen von CSS-Dateien erforderlich
- **Gute Performance**: Nativer Browser-Support, ändert nur Variablenwerte
- **Einfache Wartung**: Themes zentral verwaltet, leicht änderbar
- **Erweiterbar**: Einfach drittes, viertes Theme hinzufügen

### Nachteile

- **Kein IE-Support**: Benötigt Polyfill oder Fallback-Lösung
- **Präprozessor-Integration**: Vorsicht beim Mischen mit SASS/LESS-Variablen

---

## Lösung 2: Tailwind CSS

### Kernkonzept

Verwendung der `dark:`-Variante von Tailwind CSS und benutzerdefinierter Theme-Konfiguration, kombiniert mit Class-Wechsel zur Implementierung von Themes.

### Implementierung

#### 1. Tailwind konfigurieren

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Class-Strategie verwenden (statt Media Query)
  theme: {
    extend: {
      colors: {
        // Benutzerdefinierte Farben (mehrere Theme-Farbsets definierbar)
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

#### 2. Tailwind Theme-Klassen verwenden

```vue
<template>
  <!-- Methode 1: dark: Variante verwenden -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h1 class="text-blue-600 dark:text-blue-400">Überschrift</h1>

    <button
      class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Button
    </button>

    <div
      class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg"
    >
      <p class="text-gray-700 dark:text-gray-300">Inhaltstext</p>
    </div>
  </div>

  <!-- Theme-Wechsel-Button -->
  <button @click="toggleTheme" class="fixed top-4 right-4">
    <svg v-if="isDark" class="w-6 h-6">
      <!-- Sonnensymbol -->
    </svg>
    <svg v-else class="w-6 h-6">
      <!-- Mondsymbol -->
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
  // Gespeicherte Theme-Präferenz lesen
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});
</script>
```

#### 3. Fortgeschritten: Benutzerdefinierte Multi-Themes (mehr als 2)

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
  <!-- Benutzerdefinierte Theme-Variablen verwenden -->
  <div class="bg-theme-bg text-theme-text">
    <button class="bg-theme-primary">Button</button>
  </div>

  <!-- Theme-Auswahl -->
  <select @change="setTheme($event.target.value)">
    <option value="light">Hell</option>
    <option value="dark">Dunkel</option>
    <option value="sepia">Augenschonend</option>
  </select>
</template>

<script setup>
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
</script>
```

### Vorteile von Tailwind

- **Schnelle Entwicklung**: Utility-first, kein CSS schreiben nötig
- **Konsistenz**: Integriertes Design System, einheitlicher Stil
- **Tree-shaking**: Entfernt automatisch nicht verwendete Stile
- **RWD-freundlich**: Responsive Varianten `sm:`, `md:`, `lg:`
- **Theme-Varianten**: Reichhaltige Varianten wie `dark:`, `hover:`, `focus:`

### Nachteile

- **HTML-Overhead**: Viele Klassen, kann die Lesbarkeit beeinträchtigen
- **Lernkurve**: Utility-Class-Benennung muss erlernt werden
- **Anpassung**: Tiefe Anpassung erfordert Konfigurationskenntnisse

---

## Lösung 3: Quasar + Pinia + SCSS (Aktuelle Erfahrung)

> **Tatsächliche Projekterfahrung**: Dies ist die Lösung, die ich in einem realen Projekt verwendet habe, die Quasar Framework, Pinia Zustandsverwaltung und SCSS Variablensystem integriert.

### Kernkonzept

Verwendet ein mehrschichtiges Architekturdesign:

1. **Quasar Dark Mode API** - Theme-Unterstützung auf Framework-Ebene
2. **Pinia Store** - Zentralisierte Verwaltung des Theme-Zustands
3. **SessionStorage** - Persistierung der Benutzerpräferenz
4. **SCSS Variables + Mixin** - Theme-Variablen und Stilverwaltung

### Architekturablauf

```
Benutzer klickt auf Wechsel-Button
    ↓
Quasar $q.dark.toggle()
    ↓
Pinia Store aktualisiert Zustand
    ↓
Synchronisierung mit SessionStorage
    ↓
Body-Class wechselt (.body--light / .body--dark)
    ↓
CSS Variables aktualisieren
    ↓
UI aktualisiert sich automatisch
```

### Implementierung

#### 1. Pinia Store (Zustandsverwaltung)

```typescript
// src/stores/darkModeStore.ts
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // SessionStorage zur Zustandspersistierung verwenden
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // Dark Mode Zustand aktualisieren
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

#### 2. Quasar-Konfiguration

```javascript
// quasar.config.js
module.exports = configure(function (/* ctx */) {
  return {
    framework: {
      config: {
        dark: 'true', // Dark Mode Support aktivieren
      },
      plugins: ['Notify', 'Loading', 'Dialog'],
    },
  };
});
```

#### 3. SCSS Theme-Variablensystem

```scss
// assets/css/_variable.scss

// Variablen-Mapping für Light- und Dark-Themes definieren
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

// Mixin: Entsprechende CSS-Variablen je nach Theme anwenden
@mixin theme-vars($theme) {
  @each $key, $value in map-get($themes, $theme) {
    #{$key}: #{$value};
  }
}

// Mixin: Exklusiv für Light Mode
@mixin light {
  .body--light & {
    @content;
  }
}

// Mixin: Exklusiv für Dark Mode
@mixin dark {
  .body--dark & {
    @content;
  }
}
```

#### 4. Theme global anwenden

```scss
// src/css/app.scss
@import 'assets/css/_variable.scss';

// Standardmäßig Light Theme anwenden
:root {
  @include theme-vars('light');
}

// Dark Mode wendet Dark Theme an
.body--dark {
  @include theme-vars('dark');
}
```

#### 5. Verwendung in Komponenten

**Methode A: CSS Variables verwenden (Empfohlen)**

```vue
<template>
  <div class="my-card">
    <h2 class="title">Überschrift</h2>
    <p class="content">Inhaltstext</p>
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

**Methode B: SCSS Mixin verwenden (Fortgeschritten)**

```vue
<template>
  <button class="custom-btn">Button</button>
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

#### 6. Wechselfunktionalität

```vue
<template>
  <button @click="toggleDarkMode" class="theme-toggle">
    <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
    {{ isDarkMode ? 'Zu Hell wechseln' : 'Zu Dunkel wechseln' }}
  </button>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useDarkModeStore } from 'stores/darkModeStore';

const $q = useQuasar();
const { isDarkMode, updateIsDarkMode } = useDarkModeStore();

// Theme umschalten
const toggleDarkMode = () => {
  $q.dark.toggle(); // Quasar umschalten
  updateIsDarkMode($q.dark.isActive); // Mit Store synchronisieren
};

// Benutzerpräferenz beim Laden der Seite wiederherstellen
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

### Vorteile

- **Komplettes Ökosystem**: Quasar + Pinia + VueUse als Komplettlösung
- **Zustandsverwaltung**: Pinia zentralisiert Verwaltung, leicht testbar und wartbar
- **Persistierung**: SessionStorage speichert automatisch, geht bei Aktualisierung nicht verloren
- **Typsicherheit**: TypeScript-Unterstützung, weniger Fehler
- **Entwicklungserfahrung**: SCSS Mixin vereinfacht Stilentwicklung
- **Gute Performance**: CSS Variables aktualisieren dynamisch, kein Neuladen

### Nachteile

- **Framework-Abhängigkeit**: Erfordert Quasar Framework
- **Lernaufwand**: Quasar, Pinia, SCSS müssen erlernt werden
- **Größere Paketgröße**: Komplettes Framework schwerer als reines CSS

### Best Practices

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

### Wie man es im Interview präsentiert

> "In meinem letzten Projekt haben wir ein vollständiges Dark Mode System mit **Quasar + Pinia + SCSS** implementiert:
>
> 1. **Zustandsverwaltung**: Einheitliche Verwaltung des Theme-Zustands über Pinia Store, mit VueUse's `useSessionStorage` für Persistierung
> 2. **Stilsystem**: Verwendung von SCSS Map + Mixin zur Definition von Theme-Variablen, angewendet in `:root` und `.body--dark`
> 3. **Wechselmechanismus**: Gesteuert über Quasars `$q.dark` API, die automatisch die entsprechende Class am `<body>` hinzufügt
> 4. **Entwicklungserfahrung**: Bereitstellung von `@include light` und `@include dark` Mixins, die die Stilentwicklung von Komponenten intuitiver machen
>
> Diese Lösung funktionierte in unserem Projekt hervorragend: fließender Wechsel, stabiler Zustand und einfache Wartung."

---

## Lösung 4: CSS-Class-Wechsel

### Implementierung

```css
/* styles/themes.css */

/* Helles Theme */
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

/* Dunkles Theme */
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
// Theme wechseln
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
}
```

### Einsatzszenarien

- Unterstützung alter Browser wie IE erforderlich
- Theme-Unterschiede sind groß, Variablen nicht geeignet
- Keine zusätzlichen Abhängigkeiten gewünscht

---

## Lösung 5: Separate CSS-Dateien (Nicht empfohlen)

### Implementierung

```html
<!-- Dynamisches Laden von CSS -->
<link id="theme-stylesheet" rel="stylesheet" href="/styles/theme-light.css" />
```

```javascript
function setTheme(theme) {
  const link = document.getElementById('theme-stylesheet');
  link.href = `/styles/theme-${theme}.css`;
}
```

### Nachteile

- **Ladekosten**: Beim Wechsel muss neues CSS heruntergeladen werden
- **FOUC**: Mögliches kurzes Aufblitzen ohne Stile
- **Doppelter Code**: Gemeinsame Stile müssen wiederholt definiert werden

---

## RWD (Responsive Design) Integration

### Tailwind CSS + RWD + Theme-Wechsel

```vue
<template>
  <div
    class="
      /* Grundstile */
      p-4 rounded-lg transition-colors

      /* Helles Theme */
      bg-white text-gray-900

      /* Dunkles Theme */
      dark:bg-gray-800 dark:text-gray-100

      /* RWD: Mobilgerät */
      text-sm

      /* RWD: Tablet aufwärts */
      md:text-base md:p-6

      /* RWD: Desktop aufwärts */
      lg:text-lg lg:p-8

      /* Interaktionszustände */
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
      Responsive Überschrift
    </h2>

    <p class="mt-2 text-gray-700 dark:text-gray-300">Inhaltstext</p>

    <!-- Responsives Grid -->
    <div
      class="
        grid
        grid-cols-1       /* Mobil: 1 Spalte */
        sm:grid-cols-2    /* Kleines Tablet: 2 Spalten */
        md:grid-cols-3    /* Tablet: 3 Spalten */
        lg:grid-cols-4    /* Desktop: 4 Spalten */
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
/* Grundvariablen */
:root {
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --font-size-base: 16px;
}

/* Tablet aufwärts: Abstände anpassen */
@media (min-width: 768px) {
  :root {
    --spacing-sm: 0.75rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
  }
}

/* Desktop aufwärts: Schrift anpassen */
@media (min-width: 1024px) {
  :root {
    --font-size-base: 18px;
  }
}

/* Variablen verwenden */
.container {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* Dunkles Theme + RWD */
@media (min-width: 768px) {
  [data-theme='dark'] {
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }
}
```

---

## Performance-Optimierungsempfehlungen

### 1. FOUC vermeiden (Flash of Unstyled Content)

```html
<!-- Im <head> sofort ausführen, um Aufblitzen zu vermeiden -->
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

### 2. prefers-color-scheme verwenden

```css
/* System-Theme automatisch erkennen */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Wenn der Benutzer keine Präferenz hat, dem System folgen */
    --color-background: #1f2937;
    --color-text: #f9fafb;
  }
}
```

```javascript
// JavaScript-Erkennung
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (!localStorage.getItem('theme')) {
  setTheme(prefersDark ? 'dark' : 'light');
}
```

### 3. CSS-Animationsübergang

```css
/* Sanfter Übergang */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* Oder für bestimmte Elemente */
body,
.card,
.button {
  transition: all 0.3s ease;
}
```

### 4. Reflow reduzieren

```css
/* transform statt direkter Änderung von Breite/Höhe verwenden */
.theme-switching {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.theme-switching:hover {
  transform: scale(1.05); /* GPU-Beschleunigung */
}
```

---

## Reale Projektarchitektur

### Dateistruktur

```
src/
├── styles/
│   ├── themes/
│   │   ├── variables.css       # CSS Variables Definition
│   │   ├── light.css          # Helles Theme
│   │   ├── dark.css           # Dunkles Theme
│   │   └── sepia.css          # Augenschon-Theme
│   ├── base.css               # Grundstile
│   └── components/            # Komponentenstile
│       ├── button.css
│       └── card.css
├── utils/
│   └── theme.js               # Theme-Wechsellogik
└── components/
    └── ThemeToggle.vue        # Theme-Wechsel-Komponente
```

### Best Practices

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

    // System-Theme-Änderung überwachen
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

## Interview-Antwortvorlage

**Interviewer: Wenn eine Seite 2 verschiedene Stile haben soll, wie organisiert man das CSS?**

**Antwortmethode A: Reale Erfahrung zeigen (Empfohlen)**

> "Ich wähle die am besten geeignete Lösung basierend auf dem Technologie-Stack des Projekts. **In meinem letzten Projekt** haben wir **Quasar + Pinia + SCSS** implementiert:
>
> **1. Zustandsverwaltung (30 Sekunden)**
>
> - Einheitliche Verwaltung des Theme-Zustands über Pinia Store
> - Persistierung mit VueUse's `useSessionStorage`
> - Theme-Steuerung über Quasars `$q.dark` API
>
> **2. Stilsystem (1 Minute)**
>
> ```scss
> // SCSS Map zur Definition von Theme-Variablen
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
> // Anwendung auf :root und .body--dark
> :root {
>   @include theme-vars('light');
> }
> .body--dark {
>   @include theme-vars('dark');
> }
> ```
>
> - Komponenten verwenden `var(--bg-main)` für automatischen Wechsel
> - Bereitstellung von `@include light` / `@include dark` Mixins für komplexe Stile
>
> **3. Wechselmechanismus (30 Sekunden)**
>
> ```typescript
> const toggleTheme = () => {
>   $q.dark.toggle(); // Quasar umschalten
>   store.updateIsDarkMode($q.dark.isActive); // Store synchronisieren
> };
> ```
>
> **4. Tatsächliche Ergebnisse (30 Sekunden)**
>
> - Fließender Wechsel ohne Aufblitzen (CSS Variables dynamisch aktualisiert)
> - Zustand persistent (Theme geht bei Seitenaktualisierung nicht verloren)
> - Einfache Wartung (Theme-Variablen zentral verwaltet)
> - Hohe Entwicklungseffizienz (Mixin vereinfacht Stilentwicklung)"

**Antwortmethode B: Universelle Lösung (Alternative)**

> "Für moderne Projekte empfehle ich **CSS Variables + Tailwind CSS**:
>
> **1. Architekturdesign (30 Sekunden)**
>
> - CSS Variables zur Definition von Theme-Variablen verwenden (Farben, Abstände, Schatten usw.)
> - Theme über `data-theme`-Attribut am Root-Element wechseln
> - Mit Tailwinds `dark:` Variante für schnelle Entwicklung kombinieren
>
> **2. Implementierungsschwerpunkte (1 Minute)**
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
> Beim JavaScript-Wechsel muss nur das `data-theme`-Attribut geändert werden, und der Browser wendet automatisch die entsprechenden Variablen an.
>
> **3. RWD-Integration (30 Sekunden)**
>
> ```html
> <div class="text-sm md:text-base lg:text-lg dark:bg-gray-800"></div>
> ```
>
> Kann gleichzeitig RWD und Theme-Wechsel behandeln.
>
> **4. Best Practices (30 Sekunden)**
>
> - Theme-Initialisierung sofort im `<head>` ausführen, um FOUC zu vermeiden
> - `localStorage` zum Speichern der Benutzerpräferenz verwenden
> - `prefers-color-scheme` erkennen, um dem System-Theme zu folgen"

---

## Erweiterungsfragen

**F1: Was, wenn IE unterstützt werden muss?**

A: CSS-Class-Wechsel-Lösung verwenden oder das Polyfill [css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill) einsetzen.

**F2: Wie vermeidet man das Aufblitzen beim Theme-Wechsel?**

A: Skript sofort im HTML-`<head>` ausführen, damit das Theme vor dem Seitenrendering gesetzt wird.

**F3: Wie verwaltet man mehrere Themes?**

A: Es wird empfohlen, ein Design Tokens System zu verwenden, alle Theme-Variablen einheitlich zu verwalten und mit Figma Variables zu synchronisieren.

**F4: Wie testet man verschiedene Themes?**

A: Storybook mit `storybook-addon-themes` verwenden, um alle Theme-Varianten visuell zu testen.

---

## Verwandte Themen

- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Dark Mode in 5 Minutes](https://web.dev/prefers-color-scheme/)
