---
id: theme-switching
title: '[Medium] 🎨 多主题切换实作'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## 📋 面试情境题

**Q: 当一个页面要做 2 种不同风格（例如亮色/暗色主题），怎么安排 CSS？**

这是一个考察 CSS 架构设计和实务经验的问题，涉及：

1. CSS 架构设计
2. 主题切换策略
3. 现代化工具应用（Tailwind CSS、CSS Variables）
4. 性能与维护性考量

---

## 解决方案总览

| 方案                      | 适用场景             | 优点                       | 缺点                 | 推荐度       |
| ------------------------- | -------------------- | -------------------------- | -------------------- | ------------ |
| **CSS Variables**         | 现代浏览器项目       | 动态切换、性能好           | IE 不支持            | 5/5 强烈推荐 |
| **Quasar + Pinia + SCSS** | Vue 3 + Quasar 项目  | 完整生态、状态管理、易维护 | 需 Quasar Framework  | 5/5 强烈推荐 |
| **Tailwind CSS**          | 快速开发、设计系统   | 开发快速、一致性高         | 学习曲线、HTML 冗长  | 5/5 强烈推荐 |
| **CSS Class 切换**        | 需兼容旧浏览器       | 兼容性好                   | CSS 体积较大         | 4/5 推荐     |
| **CSS Modules**           | React/Vue 组件化项目 | 作用域隔离                 | 需打包工具           | 4/5 推荐     |
| **Styled Components**     | React 项目           | CSS-in-JS、动态样式        | Runtime 开销         | 4/5 推荐     |
| **SASS/LESS 变量**        | 需编译时决定主题     | 功能强大                   | 无法动态切换         | 3/5 可考虑   |
| **独立 CSS 文件**         | 主题差异大、完全独立 | 清晰分离                   | 加载开销、重复代码   | 2/5 不推荐   |

---

## 方案 1：CSS Variables

### 核心概念

使用 CSS 自定义属性（CSS Custom Properties），通过切换根元素的 class 来改变变量值。

### 实作方式

#### 1. 定义主题变量

```css
/* styles/themes.css */

/* 亮色主题（预设） */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  --color-card: #f9fafb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 暗色主题 */
[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-secondary: #a78bfa;
  --color-background: #1f2937;
  --color-text: #f9fafb;
  --color-border: #374151;
  --color-card: #111827;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 如果有第三种主题（例如护眼模式） */
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

#### 2. 使用变量

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

#### 3. JavaScript 切换主题

```javascript
// utils/theme.js

// 取得当前主题
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

// 设定主题
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// 切换主题
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// 初始化（从 localStorage 读取用户偏好）
function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // 如果用户没有设定偏好，跟随系统
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// 页面加载时初始化
initTheme();
```

#### 4. Vue 3 整合范例

```vue
<template>
  <div>
    <button @click="toggleTheme" class="theme-toggle">
      <span v-if="currentTheme === 'light'">🌙 暗色模式</span>
      <span v-else>☀️ 亮色模式</span>
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

### 优点

- ✅ **动态切换**：无需重新加载 CSS 文件
- ✅ **性能好**：浏览器原生支持，只改变变量值
- ✅ **易维护**：主题集中管理，修改方便
- ✅ **可扩展**：轻松添加第三、第四种主题

### 缺点

- ❌ **IE 不支持**：需要 polyfill 或降级方案
- ❌ **预处理器整合**：与 SASS/LESS 变量混用需注意

---

## 方案 2：Tailwind CSS

### 核心概念

使用 Tailwind CSS 的 `dark:` 变体和自定义主题配置，搭配 class 切换实现主题。

### 实作方式

#### 1. 配置 Tailwind

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // 使用 class 策略（而非 media query）
  theme: {
    extend: {
      colors: {
        // 自定义颜色（可定义多组主题色）
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

#### 2. 使用 Tailwind 的主题类别

```vue
<template>
  <!-- 方式 1：使用 dark: 变体 -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h1 class="text-blue-600 dark:text-blue-400">标题</h1>

    <button
      class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      按钮
    </button>

    <div
      class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg"
    >
      <p class="text-gray-700 dark:text-gray-300">内容文字</p>
    </div>
  </div>

  <!-- 主题切换按钮 -->
  <button @click="toggleTheme" class="fixed top-4 right-4">
    <svg v-if="isDark" class="w-6 h-6">
      <!-- 太阳图标 -->
    </svg>
    <svg v-else class="w-6 h-6">
      <!-- 月亮图标 -->
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
  // 读取储存的主题偏好
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});
</script>
```

#### 3. 进阶：自定义多主题（超过 2 种）

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
  <!-- 使用自定义的主题变量 -->
  <div class="bg-theme-bg text-theme-text">
    <button class="bg-theme-primary">按钮</button>
  </div>

  <!-- 主题选择器 -->
  <select @change="setTheme($event.target.value)">
    <option value="light">亮色</option>
    <option value="dark">暗色</option>
    <option value="sepia">护眼</option>
  </select>
</template>

<script setup>
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
</script>
```

### Tailwind 的优势

- ✅ **快速开发**：utility-first，不需写 CSS
- ✅ **一致性**：设计系统内建，保持风格统一
- ✅ **tree-shaking**：自动移除未使用的样式
- ✅ **RWD 友好**：`sm:`, `md:`, `lg:` 响应式变体
- ✅ **主题变体**：`dark:`, `hover:`, `focus:` 等丰富的变体

### 缺点

- ❌ **HTML 冗长**：class 很多，可能影响可读性
- ❌ **学习曲线**：需要熟悉 utility class 命名
- ❌ **定制化**：深度定制需要了解配置

---

## 方案 3：Quasar + Pinia + SCSS（近期经验）

> 💼 **实际项目经验**：这是我在实际项目中使用的方案，整合了 Quasar Framework、Pinia 状态管理和 SCSS 变量系统。

### 核心概念

采用多层架构设计：

1. **Quasar Dark Mode API** - 框架层级的主题支持
2. **Pinia Store** - 集中管理主题状态
3. **SessionStorage** - 持久化用户偏好
4. **SCSS Variables + Mixin** - 主题变量与样式管理

### 架构流程

```
用户点击切换按钮
    ↓
Quasar $q.dark.toggle()
    ↓
Pinia Store 更新状态
    ↓
同步至 SessionStorage
    ↓
Body class 切换 (.body--light / .body--dark)
    ↓
CSS 变量更新
    ↓
UI 自动更新
```

### 实作方式

#### 1. Pinia Store（状态管理）

```typescript
// src/stores/darkModeStore.ts
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // 使用 SessionStorage 持久化状态
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // 更新 Dark Mode 状态
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

#### 2. Quasar 配置

```javascript
// quasar.config.js
module.exports = configure(function (/* ctx */) {
  return {
    framework: {
      config: {
        dark: 'true', // 启用 Dark Mode 支持
      },
      plugins: ['Notify', 'Loading', 'Dialog'],
    },
  };
});
```

#### 3. SCSS 主题变量系统

```scss
// assets/css/_variable.scss

// 定义 Light 和 Dark 两种主题的变量映射
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

// Mixin: 根据主题套用对应的 CSS 变量
@mixin theme-vars($theme) {
  @each $key, $value in map-get($themes, $theme) {
    #{$key}: #{$value};
  }
}

// Mixin: Light Mode 专用样式
@mixin light {
  .body--light & {
    @content;
  }
}

// Mixin: Dark Mode 专用样式
@mixin dark {
  .body--dark & {
    @content;
  }
}
```

#### 4. 全局应用主题

```scss
// src/css/app.scss
@import 'assets/css/_variable.scss';

// 预设套用 Light Theme
:root {
  @include theme-vars('light');
}

// Dark Mode 套用 Dark Theme
.body--dark {
  @include theme-vars('dark');
}
```

#### 5. 组件中使用

**方式 A：使用 CSS 变量（推荐）**

```vue
<template>
  <div class="my-card">
    <h2 class="title">标题</h2>
    <p class="content">内容文字</p>
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

**方式 B：使用 SCSS Mixin（进阶）**

```vue
<template>
  <button class="custom-btn">按钮</button>
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

#### 6. 切换功能

```vue
<template>
  <button @click="toggleDarkMode" class="theme-toggle">
    <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
    {{ isDarkMode ? '切换至浅色' : '切换至深色' }}
  </button>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useDarkModeStore } from 'stores/darkModeStore';

const $q = useQuasar();
const { isDarkMode, updateIsDarkMode } = useDarkModeStore();

// 切换主题
const toggleDarkMode = () => {
  $q.dark.toggle(); // Quasar 切换
  updateIsDarkMode($q.dark.isActive); // 同步至 Store
};

// 页面加载时恢复用户偏好
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

### 优点

- ✅ **完整生态系统**：Quasar + Pinia + VueUse 一站式解决方案
- ✅ **状态管理**：Pinia 集中管理，易于测试和维护
- ✅ **持久化**：SessionStorage 自动保存，刷新不丢失
- ✅ **类型安全**：TypeScript 支持，减少错误
- ✅ **开发体验**：SCSS Mixin 简化样式开发
- ✅ **性能优良**：CSS Variables 动态更新，无需重载

### 缺点

- ❌ **框架依赖**：需要使用 Quasar Framework
- ❌ **学习成本**：需熟悉 Quasar、Pinia、SCSS
- ❌ **体积较大**：完整框架比单纯 CSS 重

### 最佳实践

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

### 面试时如何展现

> "在我上一个项目中，我们使用 **Quasar + Pinia + SCSS** 实作了完整的 Dark Mode 系统：
>
> 1. **状态管理**：通过 Pinia Store 统一管理主题状态，配合 VueUse 的 `useSessionStorage` 实现持久化
> 2. **样式系统**：使用 SCSS 的 Map + Mixin 定义主题变量，在 `:root` 和 `.body--dark` 中套用
> 3. **切换机制**：通过 Quasar 的 `$q.dark` API 控制，自动在 `<body>` 加上对应 class
> 4. **开发体验**：提供 `@include light` 和 `@include dark` mixin，让组件样式开发更直观
>
> 这套方案在我们项目中运行良好，切换流畅、状态稳定、易于维护。"

---

## 方案 4：CSS Class 切换

### 实作方式

```css
/* styles/themes.css */

/* 亮色主题 */
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

/* 暗色主题 */
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
// 切换主题
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
}
```

### 适用场景

- 需要支持 IE 等旧浏览器
- 主题差异较大，不适合用变量
- 不想引入额外依赖

---

## 方案 5：独立 CSS 文件（不推荐）

### 实作方式

```html
<!-- 动态加载 CSS -->
<link id="theme-stylesheet" rel="stylesheet" href="/styles/theme-light.css" />
```

```javascript
function setTheme(theme) {
  const link = document.getElementById('theme-stylesheet');
  link.href = `/styles/theme-${theme}.css`;
}
```

### 缺点

- ❌ **加载开销**：切换时需重新下载 CSS
- ❌ **FOUC**：可能出现短暂的无样式闪烁
- ❌ **重复代码**：共用样式需要重复定义

---

## RWD 响应式设计整合

### Tailwind CSS + RWD + 主题切换

```vue
<template>
  <div
    class="
      /* 基础样式 */
      p-4 rounded-lg transition-colors

      /* 亮色主题 */
      bg-white text-gray-900

      /* 暗色主题 */
      dark:bg-gray-800 dark:text-gray-100

      /* RWD: 手机 */
      text-sm

      /* RWD: 平板以上 */
      md:text-base md:p-6

      /* RWD: 桌机以上 */
      lg:text-lg lg:p-8

      /* 交互状态 */
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
      响应式标题
    </h2>

    <p class="mt-2 text-gray-700 dark:text-gray-300">内容文字</p>

    <!-- 响应式网格 -->
    <div
      class="
        grid
        grid-cols-1       /* 手机: 1 列 */
        sm:grid-cols-2    /* 小平板: 2 列 */
        md:grid-cols-3    /* 平板: 3 列 */
        lg:grid-cols-4    /* 桌机: 4 列 */
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
/* 基础变量 */
:root {
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --font-size-base: 16px;
}

/* 平板以上调整间距 */
@media (min-width: 768px) {
  :root {
    --spacing-sm: 0.75rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
  }
}

/* 桌机以上调整字体 */
@media (min-width: 1024px) {
  :root {
    --font-size-base: 18px;
  }
}

/* 使用变量 */
.container {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* 暗色主题 + RWD */
@media (min-width: 768px) {
  [data-theme='dark'] {
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }
}
```

---

## 性能优化建议

### 1. 避免 FOUC（Flash of Unstyled Content）

```html
<!-- 在 <head> 中立即执行，避免闪烁 -->
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

### 2. 使用 prefers-color-scheme

```css
/* 自动侦测系统主题 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* 如果用户没有设定偏好，跟随系统 */
    --color-background: #1f2937;
    --color-text: #f9fafb;
  }
}
```

```javascript
// JavaScript 侦测
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (!localStorage.getItem('theme')) {
  setTheme(prefersDark ? 'dark' : 'light');
}
```

### 3. CSS 动画过渡

```css
/* 平滑过渡 */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* 或针对特定元素 */
body,
.card,
.button {
  transition: all 0.3s ease;
}
```

### 4. 减少重排（Reflow）

```css
/* 使用 transform 而非直接改变宽高 */
.theme-switching {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.theme-switching:hover {
  transform: scale(1.05); /* GPU 加速 */
}
```

---

## 实际项目架构

### 文件结构

```
src/
├── styles/
│   ├── themes/
│   │   ├── variables.css       # CSS Variables 定义
│   │   ├── light.css          # 亮色主题
│   │   ├── dark.css           # 暗色主题
│   │   └── sepia.css          # 护眼主题
│   ├── base.css               # 基础样式
│   └── components/            # 组件样式
│       ├── button.css
│       └── card.css
├── utils/
│   └── theme.js               # 主题切换逻辑
└── components/
    └── ThemeToggle.vue        # 主题切换组件
```

### 最佳实践

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

    // 监听系统主题变化
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

## 面试回答范本

**面试官：当一个页面要做 2 种不同风格，怎么安排 CSS？**

**回答方式 A：展现实际经验（推荐）**

> "我会根据项目技术栈选择最适合的方案。**在我上一个项目中**，我们使用 **Quasar + Pinia + SCSS** 实作：
>
> **1. 状态管理（30 秒）**
>
> - 使用 Pinia Store 统一管理主题状态
> - 配合 VueUse 的 `useSessionStorage` 持久化
> - 通过 Quasar 的 `$q.dark` API 控制主题
>
> **2. 样式系统（1 分钟）**
>
> ```scss
> // SCSS Map 定义主题变量
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
> // 套用到 :root 和 .body--dark
> :root {
>   @include theme-vars('light');
> }
> .body--dark {
>   @include theme-vars('dark');
> }
> ```
>
> - 组件使用 `var(--bg-main)` 自动切换
> - 提供 `@include light` / `@include dark` mixin 处理复杂样式
>
> **3. 切换机制（30 秒）**
>
> ```typescript
> const toggleTheme = () => {
>   $q.dark.toggle(); // Quasar 切换
>   store.updateIsDarkMode($q.dark.isActive); // 同步 Store
> };
> ```
>
> **4. 实际成效（30 秒）**
>
> - 切换流畅无闪烁（CSS Variables 动态更新）
> - 状态持久化（刷新页面主题不丢失）
> - 易于维护（主题变量集中管理）
> - 开发效率高（Mixin 简化样式开发）"

**回答方式 B：通用方案（备选）**

> "现代项目我推荐使用 **CSS Variables + Tailwind CSS**：
>
> **1. 架构设计（30 秒）**
>
> - 使用 CSS Variables 定义主题变量（颜色、间距、阴影等）
> - 通过 `data-theme` 属性切换根元素的主题
> - 搭配 Tailwind 的 `dark:` 变体快速开发
>
> **2. 实作重点（1 分钟）**
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
> JavaScript 切换时只需改变 `data-theme` 属性，浏览器自动套用对应变量。
>
> **3. RWD 整合（30 秒）**
>
> ```html
> <div class="text-sm md:text-base lg:text-lg dark:bg-gray-800"></div>
> ```
>
> 可以同时处理 RWD 和主题切换。
>
> **4. 最佳实践（30 秒）**
>
> - 在 `<head>` 中立即执行主题初始化，避免 FOUC
> - 使用 `localStorage` 储存用户偏好
> - 侦测 `prefers-color-scheme` 跟随系统主题"

---

## 延伸问题

**Q1: 如果要支持 IE 怎么办？**

A: 使用 CSS Class 切换方案，或使用 [css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill) polyfill。

**Q2: 如何避免主题切换时的闪烁？**

A: 在 HTML `<head>` 中立即执行脚本，在页面渲染前就设定好主题。

**Q3: 多个主题如何管理？**

A: 建议使用 Design Tokens 系统，统一管理所有主题变量，配合 Figma Variables 同步。

**Q4: 如何测试不同主题？**

A: 使用 Storybook 配合 `storybook-addon-themes`，可视化测试所有主题变体。

---

## 相关主题

- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Dark Mode in 5 Minutes](https://web.dev/prefers-color-scheme/)
