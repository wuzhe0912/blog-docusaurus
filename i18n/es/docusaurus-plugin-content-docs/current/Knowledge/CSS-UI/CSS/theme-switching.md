---
id: theme-switching
title: '[Medium] \U0001F3A8 Implementacion de cambio de temas multiples'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## Pregunta de escenario para entrevista

**Q: Cuando una pagina necesita 2 estilos diferentes (por ejemplo, tema claro/oscuro), como organizas el CSS?**

Esta es una pregunta que evalua el diseno de arquitectura CSS y la experiencia practica, que involucra:

1. Diseno de arquitectura CSS
2. Estrategia de cambio de temas
3. Aplicacion de herramientas modernas (Tailwind CSS, CSS Variables)
4. Consideraciones de rendimiento y mantenibilidad

---

## Vision general de soluciones

| Solucion                  | Escenario de uso               | Ventajas                         | Desventajas               | Recomendacion        |
| ------------------------- | ------------------------------ | -------------------------------- | ------------------------- | -------------------- |
| **CSS Variables**         | Proyectos con navegadores modernos | Cambio dinamico, buen rendimiento | No soporta IE            | 5/5 Muy recomendado  |
| **Quasar + Pinia + SCSS** | Proyectos Vue 3 + Quasar      | Ecosistema completo, gestion de estado | Requiere Quasar Framework | 5/5 Muy recomendado  |
| **Tailwind CSS**          | Desarrollo rapido, design system | Desarrollo rapido, alta consistencia | Curva de aprendizaje, HTML extenso | 5/5 Muy recomendado  |
| **CSS Class toggle**      | Compatibilidad con navegadores antiguos | Buena compatibilidad            | CSS mas pesado            | 4/5 Recomendado      |
| **CSS Modules**           | Proyectos React/Vue componentizados | Aislamiento de scope             | Requiere herramientas de build | 4/5 Recomendado      |
| **Styled Components**     | Proyectos React               | CSS-in-JS, estilos dinamicos     | Overhead en runtime       | 4/5 Recomendado      |
| **Variables SASS/LESS**   | Tema decidido en compilacion   | Funciones potentes               | No permite cambio dinamico | 3/5 Considerar       |
| **Archivos CSS independientes** | Temas muy diferentes      | Separacion clara                 | Overhead de carga, codigo duplicado | 2/5 No recomendado   |

---

## Solucion 1: CSS Variables

### Concepto central

Usar propiedades personalizadas de CSS (CSS Custom Properties), cambiando los valores de las variables al alternar la class del elemento raiz.

### Implementacion

#### 1. Definir variables de tema

```css
/* styles/themes.css */

/* Tema claro (predeterminado) */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  --color-card: #f9fafb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Tema oscuro */
[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-secondary: #a78bfa;
  --color-background: #1f2937;
  --color-text: #f9fafb;
  --color-border: #374151;
  --color-card: #111827;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Si hay un tercer tema (por ejemplo, modo proteccion visual) */
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

#### 2. Usar variables

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

#### 3. Cambio de tema con JavaScript

```javascript
// utils/theme.js

// Obtener tema actual
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

// Establecer tema
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Alternar tema
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Inicializar (leer preferencia del usuario desde localStorage)
function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);

  // Escuchar cambios del tema del sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // Si el usuario no ha establecido preferencia, seguir el sistema
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Inicializar al cargar la pagina
initTheme();
```

#### 4. Ejemplo de integracion con Vue 3

```vue
<template>
  <div>
    <button @click="toggleTheme" class="theme-toggle">
      <span v-if="currentTheme === 'light'">🌙 Modo oscuro</span>
      <span v-else>☀️ Modo claro</span>
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

### Ventajas

- ✅ **Cambio dinamico**: No necesita recargar archivos CSS
- ✅ **Buen rendimiento**: Soporte nativo del navegador, solo cambia valores de variables
- ✅ **Facil mantenimiento**: Gestion centralizada de temas, modificacion conveniente
- ✅ **Extensible**: Facil agregar un tercer o cuarto tema

### Desventajas

- ❌ **IE no soportado**: Necesita polyfill o solucion alternativa
- ❌ **Integracion con preprocesadores**: Cuidado al mezclar con variables SASS/LESS

---

## Solucion 2: Tailwind CSS

### Concepto central

Usar la variante `dark:` de Tailwind CSS y la configuracion de temas personalizados, combinado con el cambio de class para implementar el tema.

### Implementacion

#### 1. Configurar Tailwind

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Usar estrategia de class (no media query)
  theme: {
    extend: {
      colors: {
        // Colores personalizados (se pueden definir multiples conjuntos de colores de tema)
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

#### 2. Usar clases de tema de Tailwind

```vue
<template>
  <!-- Metodo 1: Usar variante dark: -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h1 class="text-blue-600 dark:text-blue-400">Titulo</h1>

    <button
      class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Boton
    </button>

    <div
      class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg"
    >
      <p class="text-gray-700 dark:text-gray-300">Texto de contenido</p>
    </div>
  </div>

  <!-- Boton de cambio de tema -->
  <button @click="toggleTheme" class="fixed top-4 right-4">
    <svg v-if="isDark" class="w-6 h-6">
      <!-- Icono de sol -->
    </svg>
    <svg v-else class="w-6 h-6">
      <!-- Icono de luna -->
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
  // Leer preferencia de tema guardada
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});
</script>
```

#### 3. Avanzado: Personalizar multiples temas (mas de 2)

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
  <!-- Usar variables de tema personalizadas -->
  <div class="bg-theme-bg text-theme-text">
    <button class="bg-theme-primary">Boton</button>
  </div>

  <!-- Selector de tema -->
  <select @change="setTheme($event.target.value)">
    <option value="light">Claro</option>
    <option value="dark">Oscuro</option>
    <option value="sepia">Proteccion visual</option>
  </select>
</template>

<script setup>
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
</script>
```

### Ventajas de Tailwind

- ✅ **Desarrollo rapido**: utility-first, no necesita escribir CSS
- ✅ **Consistencia**: Design system integrado, mantiene estilo uniforme
- ✅ **tree-shaking**: Elimina automaticamente estilos no usados
- ✅ **Amigable con RWD**: Variantes responsivas `sm:`, `md:`, `lg:`
- ✅ **Variantes de tema**: `dark:`, `hover:`, `focus:` y mas variantes ricas

### Desventajas

- ❌ **HTML extenso**: Muchas clases, puede afectar legibilidad
- ❌ **Curva de aprendizaje**: Necesita familiarizarse con nombres de utility class
- ❌ **Personalizacion**: Personalizacion profunda requiere conocer la configuracion

---

## Solucion 3: Quasar + Pinia + SCSS (experiencia reciente)

> **Experiencia real en proyecto**: Esta es la solucion que utilice en un proyecto real, integrando Quasar Framework, gestion de estado con Pinia y sistema de variables SCSS.

### Concepto central

Adoptar diseno de arquitectura multicapa:

1. **Quasar Dark Mode API** - Soporte de temas a nivel de framework
2. **Pinia Store** - Gestion centralizada del estado del tema
3. **SessionStorage** - Persistencia de preferencias del usuario
4. **SCSS Variables + Mixin** - Variables de tema y gestion de estilos

### Flujo de arquitectura

```
Usuario hace clic en boton de cambio
    ↓
Quasar $q.dark.toggle()
    ↓
Pinia Store actualiza estado
    ↓
Sincronizar con SessionStorage
    ↓
Cambio de class en Body (.body--light / .body--dark)
    ↓
Actualizacion de CSS Variables
    ↓
UI se actualiza automaticamente
```

### Implementacion

#### 1. Pinia Store (gestion de estado)

```typescript
// src/stores/darkModeStore.ts
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // Persistir estado con SessionStorage
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // Actualizar estado de Dark Mode
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

#### 2. Configuracion de Quasar

```javascript
// quasar.config.js
module.exports = configure(function (/* ctx */) {
  return {
    framework: {
      config: {
        dark: 'true', // Habilitar soporte de Dark Mode
      },
      plugins: ['Notify', 'Loading', 'Dialog'],
    },
  };
});
```

#### 3. Sistema de variables de tema SCSS

```scss
// assets/css/_variable.scss

// Definir mapeo de variables para temas Light y Dark
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

// Mixin: Aplicar CSS Variables segun el tema
@mixin theme-vars($theme) {
  @each $key, $value in map-get($themes, $theme) {
    #{$key}: #{$value};
  }
}

// Mixin: Estilos exclusivos para Light Mode
@mixin light {
  .body--light & {
    @content;
  }
}

// Mixin: Estilos exclusivos para Dark Mode
@mixin dark {
  .body--dark & {
    @content;
  }
}
```

#### 4. Aplicacion global del tema

```scss
// src/css/app.scss
@import 'assets/css/_variable.scss';

// Aplicar Light Theme por defecto
:root {
  @include theme-vars('light');
}

// Aplicar Dark Theme en Dark Mode
.body--dark {
  @include theme-vars('dark');
}
```

#### 5. Uso en componentes

**Metodo A: Usar CSS Variables (recomendado)**

```vue
<template>
  <div class="my-card">
    <h2 class="title">Titulo</h2>
    <p class="content">Texto de contenido</p>
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

**Metodo B: Usar SCSS Mixin (avanzado)**

```vue
<template>
  <button class="custom-btn">Boton</button>
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

#### 6. Funcion de cambio

```vue
<template>
  <button @click="toggleDarkMode" class="theme-toggle">
    <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
    {{ isDarkMode ? 'Cambiar a claro' : 'Cambiar a oscuro' }}
  </button>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useDarkModeStore } from 'stores/darkModeStore';

const $q = useQuasar();
const { isDarkMode, updateIsDarkMode } = useDarkModeStore();

// Cambiar tema
const toggleDarkMode = () => {
  $q.dark.toggle(); // Cambio Quasar
  updateIsDarkMode($q.dark.isActive); // Sincronizar con Store
};

// Restaurar preferencia del usuario al cargar pagina
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

### Ventajas

- ✅ **Ecosistema completo**: Quasar + Pinia + VueUse solucion integral
- ✅ **Gestion de estado**: Pinia gestion centralizada, facil de probar y mantener
- ✅ **Persistencia**: SessionStorage guardado automatico, no se pierde al refrescar
- ✅ **Tipo seguro**: Soporte TypeScript, reduce errores
- ✅ **Experiencia de desarrollo**: SCSS Mixin simplifica desarrollo de estilos
- ✅ **Buen rendimiento**: CSS Variables actualizacion dinamica, sin necesidad de recargar

### Desventajas

- ❌ **Dependencia del framework**: Requiere usar Quasar Framework
- ❌ **Costo de aprendizaje**: Necesita familiarizarse con Quasar, Pinia, SCSS
- ❌ **Mayor tamano**: Framework completo es mas pesado que CSS puro

### Mejores practicas

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

### Como presentarlo en una entrevista

> "En mi ultimo proyecto, implementamos un sistema completo de Dark Mode con **Quasar + Pinia + SCSS**:
>
> 1. **Gestion de estado**: Gestion unificada del estado del tema con Pinia Store, persistencia con `useSessionStorage` de VueUse
> 2. **Sistema de estilos**: Variables de tema definidas con Map + Mixin de SCSS, aplicadas en `:root` y `.body--dark`
> 3. **Mecanismo de cambio**: Control a traves de la API `$q.dark` de Quasar, agrega automaticamente la class correspondiente al `<body>`
> 4. **Experiencia de desarrollo**: Mixin `@include light` y `@include dark` para un desarrollo de estilos de componentes mas intuitivo
>
> Esta solucion funciono bien en nuestro proyecto, con cambios fluidos, estado estable y facil mantenimiento."

---

## Solucion 4: Cambio de CSS Class

### Implementacion

```css
/* styles/themes.css */

/* Tema claro */
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

/* Tema oscuro */
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
// Cambiar tema
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
}
```

### Escenarios de uso

- Necesidad de soportar navegadores antiguos como IE
- Las diferencias de tema son grandes, no es adecuado usar variables
- No se quiere introducir dependencias adicionales

---

## Solucion 5: Archivos CSS independientes (no recomendado)

### Implementacion

```html
<!-- Carga dinamica de CSS -->
<link id="theme-stylesheet" rel="stylesheet" href="/styles/theme-light.css" />
```

```javascript
function setTheme(theme) {
  const link = document.getElementById('theme-stylesheet');
  link.href = `/styles/theme-${theme}.css`;
}
```

### Desventajas

- ❌ **Overhead de carga**: Necesita re-descargar CSS al cambiar
- ❌ **FOUC**: Puede aparecer un breve parpadeo sin estilos
- ❌ **Codigo duplicado**: Estilos compartidos necesitan definirse repetidamente

---

## Integracion con diseno responsivo RWD

### Tailwind CSS + RWD + Cambio de tema

```vue
<template>
  <div
    class="
      /* Estilos base */
      p-4 rounded-lg transition-colors

      /* Tema claro */
      bg-white text-gray-900

      /* Tema oscuro */
      dark:bg-gray-800 dark:text-gray-100

      /* RWD: Movil */
      text-sm

      /* RWD: Tableta y superior */
      md:text-base md:p-6

      /* RWD: Escritorio y superior */
      lg:text-lg lg:p-8

      /* Estado de interaccion */
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
      Titulo responsivo
    </h2>

    <p class="mt-2 text-gray-700 dark:text-gray-300">Texto de contenido</p>

    <!-- Grid responsivo -->
    <div
      class="
        grid
        grid-cols-1       /* Movil: 1 columna */
        sm:grid-cols-2    /* Tableta pequena: 2 columnas */
        md:grid-cols-3    /* Tableta: 3 columnas */
        lg:grid-cols-4    /* Escritorio: 4 columnas */
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
/* Variables base */
:root {
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --font-size-base: 16px;
}

/* Ajuste de espaciado para tableta y superior */
@media (min-width: 768px) {
  :root {
    --spacing-sm: 0.75rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
  }
}

/* Ajuste de fuente para escritorio y superior */
@media (min-width: 1024px) {
  :root {
    --font-size-base: 18px;
  }
}

/* Usar variables */
.container {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* Tema oscuro + RWD */
@media (min-width: 768px) {
  [data-theme='dark'] {
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }
}
```

---

## Sugerencias de optimizacion de rendimiento

### 1. Evitar FOUC (Flash of Unstyled Content)

```html
<!-- Ejecutar inmediatamente en <head>, evitar parpadeo -->
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

### 2. Usar prefers-color-scheme

```css
/* Deteccion automatica del tema del sistema */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Si el usuario no ha configurado preferencia, seguir el sistema */
    --color-background: #1f2937;
    --color-text: #f9fafb;
  }
}
```

```javascript
// Deteccion con JavaScript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (!localStorage.getItem('theme')) {
  setTheme(prefersDark ? 'dark' : 'light');
}
```

### 3. Transiciones de animacion CSS

```css
/* Transicion suave */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* O para elementos especificos */
body,
.card,
.button {
  transition: all 0.3s ease;
}
```

### 4. Reducir Reflow

```css
/* Usar transform en vez de cambiar ancho/alto directamente */
.theme-switching {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.theme-switching:hover {
  transform: scale(1.05); /* Aceleracion GPU */
}
```

---

## Arquitectura de proyecto real

### Estructura de archivos

```
src/
├── styles/
│   ├── themes/
│   │   ├── variables.css       # Definicion de CSS Variables
│   │   ├── light.css          # Tema claro
│   │   ├── dark.css           # Tema oscuro
│   │   └── sepia.css          # Tema proteccion visual
│   ├── base.css               # Estilos base
│   └── components/            # Estilos de componentes
│       ├── button.css
│       └── card.css
├── utils/
│   └── theme.js               # Logica de cambio de tema
└── components/
    └── ThemeToggle.vue        # Componente de cambio de tema
```

### Mejores practicas

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

    // Escuchar cambios del tema del sistema
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

## Plantilla de respuesta para entrevista

**Entrevistador: Cuando una pagina necesita 2 estilos diferentes, como organizas el CSS?**

**Metodo de respuesta A: Mostrar experiencia real (recomendado)**

> "Elijo la solucion mas adecuada segun el stack tecnologico del proyecto. **En mi ultimo proyecto**, usamos **Quasar + Pinia + SCSS**:
>
> **1. Gestion de estado (30 segundos)**
>
> - Gestion unificada del estado del tema con Pinia Store
> - Persistencia con `useSessionStorage` de VueUse
> - Control del tema a traves de la API `$q.dark` de Quasar
>
> **2. Sistema de estilos (1 minuto)**
>
> ```scss
> // Definir variables de tema con SCSS Map
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
> // Aplicar a :root y .body--dark
> :root {
>   @include theme-vars('light');
> }
> .body--dark {
>   @include theme-vars('dark');
> }
> ```
>
> - Componentes usan `var(--bg-main)` para cambio automatico
> - Mixin `@include light` / `@include dark` para estilos complejos
>
> **3. Mecanismo de cambio (30 segundos)**
>
> ```typescript
> const toggleTheme = () => {
>   $q.dark.toggle(); // Cambio Quasar
>   store.updateIsDarkMode($q.dark.isActive); // Sincronizar Store
> };
> ```
>
> **4. Resultados reales (30 segundos)**
>
> - Cambio fluido sin parpadeo (actualizacion dinamica de CSS Variables)
> - Estado persistente (el tema no se pierde al refrescar)
> - Facil mantenimiento (gestion centralizada de variables de tema)
> - Alta eficiencia de desarrollo (Mixin simplifica desarrollo de estilos)"

**Metodo de respuesta B: Solucion general (alternativa)**

> "Para proyectos modernos recomiendo usar **CSS Variables + Tailwind CSS**:
>
> **1. Diseno de arquitectura (30 segundos)**
>
> - Definir variables de tema con CSS Variables (colores, espaciado, sombras, etc.)
> - Cambiar el tema del elemento raiz a traves del atributo `data-theme`
> - Combinar con la variante `dark:` de Tailwind para desarrollo rapido
>
> **2. Puntos de implementacion (1 minuto)**
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
> Al cambiar con JavaScript solo se modifica el atributo `data-theme`, y el navegador aplica automaticamente las variables correspondientes.
>
> **3. Integracion RWD (30 segundos)**
>
> ```html
> <div class="text-sm md:text-base lg:text-lg dark:bg-gray-800"></div>
> ```
>
> Se puede manejar RWD y cambio de tema simultaneamente.
>
> **4. Mejores practicas (30 segundos)**
>
> - Ejecutar inicializacion del tema inmediatamente en `<head>` para evitar FOUC
> - Usar `localStorage` para guardar preferencia del usuario
> - Detectar `prefers-color-scheme` para seguir el tema del sistema"

---

## Preguntas adicionales

**Q1: Que hacer si necesitas soportar IE?**

A: Usar la solucion de cambio de CSS Class, o usar el polyfill [css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill).

**Q2: Como evitar el parpadeo al cambiar de tema?**

A: Ejecutar el script inmediatamente en el HTML `<head>`, configurando el tema antes de que la pagina se renderice.

**Q3: Como gestionar multiples temas?**

A: Se recomienda usar un sistema de Design Tokens para gestionar todas las variables de tema de forma unificada, sincronizado con Figma Variables.

**Q4: Como probar diferentes temas?**

A: Usar Storybook con `storybook-addon-themes` para probar visualmente todas las variantes de tema.

---

## Temas relacionados

- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Dark Mode in 5 Minutes](https://web.dev/prefers-color-scheme/)
