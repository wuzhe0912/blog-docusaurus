---
id: theme-switching
title: '[Medium] 🎨 Implementação de Troca de Temas'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## Cenário de Entrevista

**P: Quando uma página precisa ter 2 estilos diferentes (por exemplo, tema claro/escuro), como organizar o CSS?**

Esta é uma pergunta que avalia design de arquitetura CSS e experiência prática, envolvendo:

1. Design de arquitetura CSS
2. Estratégia de troca de temas
3. Aplicação de ferramentas modernas (Tailwind CSS, CSS Variables)
4. Considerações de performance e manutenibilidade

---

## Visão Geral das Soluções

| Solução                   | Cenário de uso          | Vantagens                                | Desvantagens                | Recomendação        |
| ------------------------- | ----------------------- | ---------------------------------------- | --------------------------- | ------------------- |
| **CSS Variables**         | Projetos com browsers modernos | Troca dinâmica, boa performance     | IE não suporta              | 5/5 Altamente recomendado |
| **Quasar + Pinia + SCSS** | Projetos Vue 3 + Quasar | Ecossistema completo, gerenciamento de estado, fácil manutenção | Requer Quasar Framework | 5/5 Altamente recomendado |
| **Tailwind CSS**          | Desenvolvimento rápido, design system | Desenvolvimento rápido, alta consistência | Curva de aprendizado, HTML verboso | 5/5 Altamente recomendado |
| **Troca de CSS Class**    | Compatibilidade com browsers antigos | Boa compatibilidade                 | CSS maior                   | 4/5 Recomendado     |
| **CSS Modules**           | Projetos React/Vue componentizados | Isolamento de escopo                | Requer bundler              | 4/5 Recomendado     |
| **Styled Components**     | Projetos React          | CSS-in-JS, estilos dinâmicos             | Custo em runtime            | 4/5 Recomendado     |
| **Variáveis SASS/LESS**   | Tema definido em compile-time | Funcionalidades poderosas          | Não permite troca dinâmica  | 3/5 Pode considerar |
| **Arquivos CSS Separados** | Temas muito diferentes  | Separação clara                         | Custo de carregamento, código duplicado | 2/5 Não recomendado |

---

## Solução 1: CSS Variables

### Conceito Principal

Usar CSS Custom Properties (propriedades customizadas do CSS), trocando os valores das variáveis ao alternar a class do elemento raiz.

### Implementação

#### 1. Definir Variáveis de Tema

```css
/* styles/themes.css */

/* Tema Claro (padrão) */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  --color-card: #f9fafb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Tema Escuro */
[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-secondary: #a78bfa;
  --color-background: #1f2937;
  --color-text: #f9fafb;
  --color-border: #374151;
  --color-card: #111827;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Se houver um terceiro tema (por exemplo, modo proteção visual) */
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

#### 2. Usar as Variáveis

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

#### 3. Troca de Tema com JavaScript

```javascript
// utils/theme.js

// Obter tema atual
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

// Definir tema
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

// Inicializar (ler preferência do usuário do localStorage)
function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);

  // Monitorar mudança de tema do sistema
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // Se o usuário não definiu preferência, seguir o sistema
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Inicializar ao carregar a página
initTheme();
```

#### 4. Exemplo de Integração com Vue 3

```vue
<template>
  <div>
    <button @click="toggleTheme" class="theme-toggle">
      <span v-if="currentTheme === 'light'">🌙 Modo Escuro</span>
      <span v-else>☀️ Modo Claro</span>
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

### Vantagens

- **Troca dinâmica**: Sem necessidade de recarregar arquivos CSS
- **Boa performance**: Suporte nativo do navegador, apenas altera valores de variáveis
- **Fácil manutenção**: Temas centralizados, fácil de modificar
- **Extensível**: Fácil de adicionar terceiro, quarto tema

### Desvantagens

- **IE não suporta**: Necessita polyfill ou solução de fallback
- **Integração com pré-processadores**: Cuidado ao misturar com variáveis SASS/LESS

---

## Solução 2: Tailwind CSS

### Conceito Principal

Usar a variante `dark:` do Tailwind CSS e configuração de tema customizado, combinado com troca de class para implementar temas.

### Implementação

#### 1. Configurar Tailwind

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Usar estratégia de class (em vez de media query)
  theme: {
    extend: {
      colors: {
        // Cores customizadas (pode definir múltiplos conjuntos de cores de tema)
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

#### 2. Usar Classes de Tema do Tailwind

```vue
<template>
  <!-- Método 1: Usar variante dark: -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h1 class="text-blue-600 dark:text-blue-400">Título</h1>

    <button
      class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Botão
    </button>

    <div
      class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg"
    >
      <p class="text-gray-700 dark:text-gray-300">Texto do conteúdo</p>
    </div>
  </div>

  <!-- Botão de troca de tema -->
  <button @click="toggleTheme" class="fixed top-4 right-4">
    <svg v-if="isDark" class="w-6 h-6">
      <!-- Ícone de sol -->
    </svg>
    <svg v-else class="w-6 h-6">
      <!-- Ícone de lua -->
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
  // Ler preferência de tema salva
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});
</script>
```

#### 3. Avançado: Múltiplos Temas Customizados (mais de 2)

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
  <!-- Usar variáveis de tema customizadas -->
  <div class="bg-theme-bg text-theme-text">
    <button class="bg-theme-primary">Botão</button>
  </div>

  <!-- Seletor de tema -->
  <select @change="setTheme($event.target.value)">
    <option value="light">Claro</option>
    <option value="dark">Escuro</option>
    <option value="sepia">Proteção visual</option>
  </select>
</template>

<script setup>
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
</script>
```

### Vantagens do Tailwind

- **Desenvolvimento rápido**: Utility-first, sem necessidade de escrever CSS
- **Consistência**: Design system integrado, mantém estilo uniforme
- **Tree-shaking**: Remove automaticamente estilos não utilizados
- **RWD amigável**: Variantes responsivas `sm:`, `md:`, `lg:`
- **Variantes de tema**: Variantes ricas como `dark:`, `hover:`, `focus:`

### Desvantagens

- **HTML verboso**: Muitas classes, pode afetar a legibilidade
- **Curva de aprendizado**: Necessário familiarizar-se com a nomenclatura de utility classes
- **Customização**: Customização profunda requer conhecer a configuração

---

## Solução 3: Quasar + Pinia + SCSS (Experiência Recente)

> **Experiência real em projeto**: Esta é a solução que usei em um projeto real, integrando Quasar Framework, gerenciamento de estado com Pinia e sistema de variáveis SCSS.

### Conceito Principal

Adota um design de arquitetura multicamadas:

1. **Quasar Dark Mode API** - Suporte a tema no nível do framework
2. **Pinia Store** - Gerenciamento centralizado do estado do tema
3. **SessionStorage** - Persistência da preferência do usuário
4. **SCSS Variables + Mixin** - Variáveis de tema e gerenciamento de estilos

### Fluxo da Arquitetura

```
Usuário clica no botão de troca
    ↓
Quasar $q.dark.toggle()
    ↓
Pinia Store atualiza o estado
    ↓
Sincroniza com SessionStorage
    ↓
Class do Body muda (.body--light / .body--dark)
    ↓
CSS Variables atualizam
    ↓
UI atualiza automaticamente
```

### Implementação

#### 1. Pinia Store (Gerenciamento de Estado)

```typescript
// src/stores/darkModeStore.ts
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // Usar SessionStorage para persistir o estado
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // Atualizar estado do Dark Mode
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

#### 2. Configuração do Quasar

```javascript
// quasar.config.js
module.exports = configure(function (/* ctx */) {
  return {
    framework: {
      config: {
        dark: 'true', // Habilitar suporte a Dark Mode
      },
      plugins: ['Notify', 'Loading', 'Dialog'],
    },
  };
});
```

#### 3. Sistema de Variáveis de Tema SCSS

```scss
// assets/css/_variable.scss

// Definir mapeamento de variáveis para temas Light e Dark
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

// Mixin: Aplicar CSS Variables correspondentes ao tema
@mixin theme-vars($theme) {
  @each $key, $value in map-get($themes, $theme) {
    #{$key}: #{$value};
  }
}

// Mixin: Estilos exclusivos do Light Mode
@mixin light {
  .body--light & {
    @content;
  }
}

// Mixin: Estilos exclusivos do Dark Mode
@mixin dark {
  .body--dark & {
    @content;
  }
}
```

#### 4. Aplicação Global do Tema

```scss
// src/css/app.scss
@import 'assets/css/_variable.scss';

// Aplicar Light Theme por padrão
:root {
  @include theme-vars('light');
}

// Dark Mode aplica Dark Theme
.body--dark {
  @include theme-vars('dark');
}
```

#### 5. Uso nos Componentes

**Método A: Usar CSS Variables (Recomendado)**

```vue
<template>
  <div class="my-card">
    <h2 class="title">Título</h2>
    <p class="content">Texto do conteúdo</p>
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

**Método B: Usar SCSS Mixin (Avançado)**

```vue
<template>
  <button class="custom-btn">Botão</button>
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

#### 6. Funcionalidade de Troca

```vue
<template>
  <button @click="toggleDarkMode" class="theme-toggle">
    <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
    {{ isDarkMode ? 'Mudar para claro' : 'Mudar para escuro' }}
  </button>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useDarkModeStore } from 'stores/darkModeStore';

const $q = useQuasar();
const { isDarkMode, updateIsDarkMode } = useDarkModeStore();

// Alternar tema
const toggleDarkMode = () => {
  $q.dark.toggle(); // Quasar alterna
  updateIsDarkMode($q.dark.isActive); // Sincronizar com Store
};

// Restaurar preferência do usuário ao carregar a página
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

### Vantagens

- **Ecossistema completo**: Quasar + Pinia + VueUse como solução integrada
- **Gerenciamento de estado**: Pinia centraliza o gerenciamento, fácil de testar e manter
- **Persistência**: SessionStorage salva automaticamente, não perde ao atualizar
- **Segurança de tipos**: Suporte TypeScript, reduz erros
- **Experiência de desenvolvimento**: SCSS Mixin simplifica o desenvolvimento de estilos
- **Boa performance**: CSS Variables atualizam dinamicamente, sem recarregamento

### Desvantagens

- **Dependência do framework**: Requer uso do Quasar Framework
- **Custo de aprendizado**: Necessário familiarizar-se com Quasar, Pinia, SCSS
- **Tamanho maior**: Framework completo é mais pesado que CSS puro

### Melhores Práticas

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

### Como Apresentar na Entrevista

> "No meu projeto anterior, implementamos um sistema completo de Dark Mode usando **Quasar + Pinia + SCSS**:
>
> 1. **Gerenciamento de estado**: Gerenciamento unificado do estado do tema via Pinia Store, com `useSessionStorage` do VueUse para persistência
> 2. **Sistema de estilos**: Usando SCSS Map + Mixin para definir variáveis de tema, aplicadas em `:root` e `.body--dark`
> 3. **Mecanismo de troca**: Controlado pela API `$q.dark` do Quasar, que automaticamente adiciona a class correspondente no `<body>`
> 4. **Experiência de desenvolvimento**: Fornecemos mixins `@include light` e `@include dark`, tornando o desenvolvimento de estilos dos componentes mais intuitivo
>
> Esta solução funcionou bem em nosso projeto, com troca fluida, estado estável e fácil manutenção."

---

## Solução 4: Troca de CSS Class

### Implementação

```css
/* styles/themes.css */

/* Tema Claro */
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

/* Tema Escuro */
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
// Trocar tema
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
}
```

### Cenários de Uso

- Necessidade de suportar browsers antigos como IE
- Diferenças de tema são grandes, não adequado para variáveis
- Não deseja introduzir dependências adicionais

---

## Solução 5: Arquivos CSS Separados (Não Recomendado)

### Implementação

```html
<!-- Carregamento dinâmico de CSS -->
<link id="theme-stylesheet" rel="stylesheet" href="/styles/theme-light.css" />
```

```javascript
function setTheme(theme) {
  const link = document.getElementById('theme-stylesheet');
  link.href = `/styles/theme-${theme}.css`;
}
```

### Desvantagens

- **Custo de carregamento**: Precisa baixar novo CSS ao trocar
- **FOUC**: Pode ocorrer flash momentâneo sem estilos
- **Código duplicado**: Estilos compartilhados precisam ser definidos repetidamente

---

## Integração com RWD (Design Responsivo)

### Tailwind CSS + RWD + Troca de Tema

```vue
<template>
  <div
    class="
      /* Estilos base */
      p-4 rounded-lg transition-colors

      /* Tema claro */
      bg-white text-gray-900

      /* Tema escuro */
      dark:bg-gray-800 dark:text-gray-100

      /* RWD: Celular */
      text-sm

      /* RWD: Tablet acima */
      md:text-base md:p-6

      /* RWD: Desktop acima */
      lg:text-lg lg:p-8

      /* Estados de interação */
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
      Título Responsivo
    </h2>

    <p class="mt-2 text-gray-700 dark:text-gray-300">Texto do conteúdo</p>

    <!-- Grid responsivo -->
    <div
      class="
        grid
        grid-cols-1       /* Celular: 1 coluna */
        sm:grid-cols-2    /* Tablet pequeno: 2 colunas */
        md:grid-cols-3    /* Tablet: 3 colunas */
        lg:grid-cols-4    /* Desktop: 4 colunas */
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
/* Variáveis base */
:root {
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --font-size-base: 16px;
}

/* Tablet acima: ajustar espaçamentos */
@media (min-width: 768px) {
  :root {
    --spacing-sm: 0.75rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
  }
}

/* Desktop acima: ajustar fontes */
@media (min-width: 1024px) {
  :root {
    --font-size-base: 18px;
  }
}

/* Usar variáveis */
.container {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* Tema escuro + RWD */
@media (min-width: 768px) {
  [data-theme='dark'] {
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }
}
```

---

## Sugestões de Otimização de Performance

### 1. Evitar FOUC (Flash of Unstyled Content)

```html
<!-- Executar imediatamente no <head> para evitar flash -->
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
/* Detectar automaticamente o tema do sistema */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Se o usuário não definiu preferência, seguir o sistema */
    --color-background: #1f2937;
    --color-text: #f9fafb;
  }
}
```

```javascript
// Detecção via JavaScript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (!localStorage.getItem('theme')) {
  setTheme(prefersDark ? 'dark' : 'light');
}
```

### 3. Transição CSS com Animação

```css
/* Transição suave */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* Ou para elementos específicos */
body,
.card,
.button {
  transition: all 0.3s ease;
}
```

### 4. Reduzir Reflow

```css
/* Usar transform em vez de alterar largura/altura diretamente */
.theme-switching {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.theme-switching:hover {
  transform: scale(1.05); /* Aceleração GPU */
}
```

---

## Arquitetura de Projeto Real

### Estrutura de Arquivos

```
src/
├── styles/
│   ├── themes/
│   │   ├── variables.css       # Definição de CSS Variables
│   │   ├── light.css          # Tema claro
│   │   ├── dark.css           # Tema escuro
│   │   └── sepia.css          # Tema proteção visual
│   ├── base.css               # Estilos base
│   └── components/            # Estilos de componentes
│       ├── button.css
│       └── card.css
├── utils/
│   └── theme.js               # Lógica de troca de tema
└── components/
    └── ThemeToggle.vue        # Componente de troca de tema
```

### Melhores Práticas

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

    // Monitorar mudança de tema do sistema
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

## Modelo de Resposta para Entrevista

**Entrevistador: Quando uma página precisa ter 2 estilos diferentes, como organizar o CSS?**

**Modo de resposta A: Demonstrar experiência real (Recomendado)**

> "Eu escolho a solução mais adequada com base na stack tecnológica do projeto. **No meu projeto anterior**, implementamos usando **Quasar + Pinia + SCSS**:
>
> **1. Gerenciamento de estado (30 segundos)**
>
> - Gerenciamento unificado do estado do tema via Pinia Store
> - Persistência com `useSessionStorage` do VueUse
> - Controle do tema via API `$q.dark` do Quasar
>
> **2. Sistema de estilos (1 minuto)**
>
> ```scss
> // SCSS Map para definir variáveis de tema
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
> // Aplicar em :root e .body--dark
> :root {
>   @include theme-vars('light');
> }
> .body--dark {
>   @include theme-vars('dark');
> }
> ```
>
> - Componentes usam `var(--bg-main)` para troca automática
> - Fornecemos mixins `@include light` / `@include dark` para estilos complexos
>
> **3. Mecanismo de troca (30 segundos)**
>
> ```typescript
> const toggleTheme = () => {
>   $q.dark.toggle(); // Quasar alterna
>   store.updateIsDarkMode($q.dark.isActive); // Sincronizar Store
> };
> ```
>
> **4. Resultados reais (30 segundos)**
>
> - Troca fluida sem flash (CSS Variables com atualização dinâmica)
> - Estado persistente (tema não se perde ao atualizar a página)
> - Fácil manutenção (variáveis de tema centralizadas)
> - Alta eficiência de desenvolvimento (Mixin simplifica desenvolvimento de estilos)"

**Modo de resposta B: Solução universal (Alternativa)**

> "Para projetos modernos, recomendo **CSS Variables + Tailwind CSS**:
>
> **1. Design de arquitetura (30 segundos)**
>
> - Usar CSS Variables para definir variáveis de tema (cores, espaçamentos, sombras etc.)
> - Trocar tema alterando o atributo `data-theme` do elemento raiz
> - Combinar com variante `dark:` do Tailwind para desenvolvimento rápido
>
> **2. Pontos-chave da implementação (1 minuto)**
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
> Ao trocar via JavaScript, basta alterar o atributo `data-theme`, e o navegador aplica automaticamente as variáveis correspondentes.
>
> **3. Integração RWD (30 segundos)**
>
> ```html
> <div class="text-sm md:text-base lg:text-lg dark:bg-gray-800"></div>
> ```
>
> Pode lidar simultaneamente com RWD e troca de tema.
>
> **4. Melhores práticas (30 segundos)**
>
> - Executar inicialização do tema imediatamente no `<head>` para evitar FOUC
> - Usar `localStorage` para salvar preferência do usuário
> - Detectar `prefers-color-scheme` para seguir o tema do sistema"

---

## Perguntas de Extensão

**P1: E se precisar suportar IE?**

R: Usar a solução de troca de CSS Class, ou usar o polyfill [css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill).

**P2: Como evitar o flash ao trocar de tema?**

R: Executar o script imediatamente no `<head>` do HTML, definindo o tema antes da renderização da página.

**P3: Como gerenciar múltiplos temas?**

R: Recomenda-se usar um sistema de Design Tokens, gerenciando todas as variáveis de tema de forma unificada, combinado com Figma Variables para sincronização.

**P4: Como testar diferentes temas?**

R: Usar Storybook com `storybook-addon-themes` para testes visuais de todas as variantes de tema.

---

## Tópicos Relacionados

- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Dark Mode in 5 Minutes](https://web.dev/prefers-color-scheme/)
