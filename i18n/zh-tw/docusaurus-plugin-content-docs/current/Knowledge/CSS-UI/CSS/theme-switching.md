---
id: theme-switching
title: '[Medium] 🎨 多主題切換實作'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## 📋 面試情境題

**Q: 當一個頁面要做 2 種不同風格（例如亮色/暗色主題），怎麼安排 CSS？**

這是一個考察 CSS 架構設計和實務經驗的問題，涉及：

1. CSS 架構設計
2. 主題切換策略
3. 現代化工具應用（Tailwind CSS、CSS Variables）
4. 效能與維護性考量

---

## 解決方案總覽

| 方案                      | 適用場景             | 優點                       | 缺點                 | 推薦度       |
| ------------------------- | -------------------- | -------------------------- | -------------------- | ------------ |
| **CSS Variables**         | 現代瀏覽器專案       | 動態切換、效能好           | IE 不支援            | 5/5 強烈推薦 |
| **Quasar + Pinia + SCSS** | Vue 3 + Quasar 專案  | 完整生態、狀態管理、易維護 | 需 Quasar Framework  | 5/5 強烈推薦 |
| **Tailwind CSS**          | 快速開發、設計系統   | 開發快速、一致性高         | 學習曲線、HTML 冗長  | 5/5 強烈推薦 |
| **CSS Class 切換**        | 需相容舊瀏覽器       | 相容性好                   | CSS 體積較大         | 4/5 推薦     |
| **CSS Modules**           | React/Vue 元件化專案 | 作用域隔離                 | 需打包工具           | 4/5 推薦     |
| **Styled Components**     | React 專案           | CSS-in-JS、動態樣式        | Runtime 開銷         | 4/5 推薦     |
| **SASS/LESS 變數**        | 需編譯時決定主題     | 功能強大                   | 無法動態切換         | 3/5 可考慮   |
| **獨立 CSS 檔案**         | 主題差異大、完全獨立 | 清晰分離                   | 載入開銷、重複程式碼 | 2/5 不推薦   |

---

## 方案 1：CSS Variables

### 核心概念

使用 CSS 自訂屬性（CSS Custom Properties），透過切換根元素的 class 來改變變數值。

### 實作方式

#### 1. 定義主題變數

```css
/* styles/themes.css */

/* 亮色主題（預設） */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  --color-card: #f9fafb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 暗色主題 */
[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-secondary: #a78bfa;
  --color-background: #1f2937;
  --color-text: #f9fafb;
  --color-border: #374151;
  --color-card: #111827;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 如果有第三種主題（例如護眼模式） */
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

#### 2. 使用變數

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

#### 3. JavaScript 切換主題

```javascript
// utils/theme.js

// 取得當前主題
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

// 設定主題
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// 切換主題
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// 初始化（從 localStorage 讀取使用者偏好）
function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);

  // 監聽系統主題變化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // 如果使用者沒有設定偏好，跟隨系統
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// 頁面載入時初始化
initTheme();
```

#### 4. Vue 3 整合範例

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

### 優點

- ✅ **動態切換**：無需重新載入 CSS 檔案
- ✅ **效能好**：瀏覽器原生支援，只改變變數值
- ✅ **易維護**：主題集中管理，修改方便
- ✅ **可擴展**：輕鬆添加第三、第四種主題

### 缺點

- ❌ **IE 不支援**：需要 polyfill 或降級方案
- ❌ **預處理器整合**：與 SASS/LESS 變數混用需注意

---

## 方案 2：Tailwind CSS

### 核心概念

使用 Tailwind CSS 的 `dark:` 變體和自訂主題配置，搭配 class 切換實現主題。

### 實作方式

#### 1. 配置 Tailwind

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // 使用 class 策略（而非 media query）
  theme: {
    extend: {
      colors: {
        // 自訂顏色（可定義多組主題色）
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

#### 2. 使用 Tailwind 的主題類別

```vue
<template>
  <!-- 方式 1：使用 dark: 變體 -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h1 class="text-blue-600 dark:text-blue-400">標題</h1>

    <button
      class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      按鈕
    </button>

    <div
      class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg"
    >
      <p class="text-gray-700 dark:text-gray-300">內容文字</p>
    </div>
  </div>

  <!-- 主題切換按鈕 -->
  <button @click="toggleTheme" class="fixed top-4 right-4">
    <svg v-if="isDark" class="w-6 h-6">
      <!-- 太陽圖示 -->
    </svg>
    <svg v-else class="w-6 h-6">
      <!-- 月亮圖示 -->
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
  // 讀取儲存的主題偏好
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});
</script>
```

#### 3. 進階：自訂多主題（超過 2 種）

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
  <!-- 使用自訂的主題變數 -->
  <div class="bg-theme-bg text-theme-text">
    <button class="bg-theme-primary">按鈕</button>
  </div>

  <!-- 主題選擇器 -->
  <select @change="setTheme($event.target.value)">
    <option value="light">亮色</option>
    <option value="dark">暗色</option>
    <option value="sepia">護眼</option>
  </select>
</template>

<script setup>
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
</script>
```

### Tailwind 的優勢

- ✅ **快速開發**：utility-first，不需寫 CSS
- ✅ **一致性**：設計系統內建，保持風格統一
- ✅ **tree-shaking**：自動移除未使用的樣式
- ✅ **RWD 友好**：`sm:`, `md:`, `lg:` 響應式變體
- ✅ **主題變體**：`dark:`, `hover:`, `focus:` 等豐富的變體

### 缺點

- ❌ **HTML 冗長**：class 很多，可能影響可讀性
- ❌ **學習曲線**：需要熟悉 utility class 命名
- ❌ **客製化**：深度客製需要了解配置

---

## 方案 3：Quasar + Pinia + SCSS（近期經驗）

> 💼 **實際專案經驗**：這是我在實際專案中使用的方案，整合了 Quasar Framework、Pinia 狀態管理和 SCSS 變數系統。

### 核心概念

採用多層架構設計：

1. **Quasar Dark Mode API** - 框架層級的主題支援
2. **Pinia Store** - 集中管理主題狀態
3. **SessionStorage** - 持久化使用者偏好
4. **SCSS Variables + Mixin** - 主題變數與樣式管理

### 架構流程

```
使用者點擊切換按鈕
    ↓
Quasar $q.dark.toggle()
    ↓
Pinia Store 更新狀態
    ↓
同步至 SessionStorage
    ↓
Body class 切換 (.body--light / .body--dark)
    ↓
CSS 變數更新
    ↓
UI 自動更新
```

### 實作方式

#### 1. Pinia Store（狀態管理）

```typescript
// src/stores/darkModeStore.ts
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // 使用 SessionStorage 持久化狀態
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // 更新 Dark Mode 狀態
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
        dark: 'true', // 啟用 Dark Mode 支援
      },
      plugins: ['Notify', 'Loading', 'Dialog'],
    },
  };
});
```

#### 3. SCSS 主題變數系統

```scss
// assets/css/_variable.scss

// 定義 Light 和 Dark 兩種主題的變數映射
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

// Mixin: 根據主題套用對應的 CSS 變數
@mixin theme-vars($theme) {
  @each $key, $value in map-get($themes, $theme) {
    #{$key}: #{$value};
  }
}

// Mixin: Light Mode 專用樣式
@mixin light {
  .body--light & {
    @content;
  }
}

// Mixin: Dark Mode 專用樣式
@mixin dark {
  .body--dark & {
    @content;
  }
}
```

#### 4. 全域應用主題

```scss
// src/css/app.scss
@import 'assets/css/_variable.scss';

// 預設套用 Light Theme
:root {
  @include theme-vars('light');
}

// Dark Mode 套用 Dark Theme
.body--dark {
  @include theme-vars('dark');
}
```

#### 5. 元件中使用

**方式 A：使用 CSS 變數（推薦）**

```vue
<template>
  <div class="my-card">
    <h2 class="title">標題</h2>
    <p class="content">內容文字</p>
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

**方式 B：使用 SCSS Mixin（進階）**

```vue
<template>
  <button class="custom-btn">按鈕</button>
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

#### 6. 切換功能

```vue
<template>
  <button @click="toggleDarkMode" class="theme-toggle">
    <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
    {{ isDarkMode ? '切換至淺色' : '切換至深色' }}
  </button>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useDarkModeStore } from 'stores/darkModeStore';

const $q = useQuasar();
const { isDarkMode, updateIsDarkMode } = useDarkModeStore();

// 切換主題
const toggleDarkMode = () => {
  $q.dark.toggle(); // Quasar 切換
  updateIsDarkMode($q.dark.isActive); // 同步至 Store
};

// 頁面載入時恢復使用者偏好
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

### 優點

- ✅ **完整生態系統**：Quasar + Pinia + VueUse 一站式解決方案
- ✅ **狀態管理**：Pinia 集中管理，易於測試和維護
- ✅ **持久化**：SessionStorage 自動保存，刷新不丟失
- ✅ **類型安全**：TypeScript 支援，減少錯誤
- ✅ **開發體驗**：SCSS Mixin 簡化樣式開發
- ✅ **效能優良**：CSS Variables 動態更新，無需重載

### 缺點

- ❌ **框架依賴**：需要使用 Quasar Framework
- ❌ **學習成本**：需熟悉 Quasar、Pinia、SCSS
- ❌ **體積較大**：完整框架比單純 CSS 重

### 最佳實踐

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

### 面試時如何展現

> "在我上一個專案中，我們使用 **Quasar + Pinia + SCSS** 實作了完整的 Dark Mode 系統：
>
> 1. **狀態管理**：透過 Pinia Store 統一管理主題狀態，配合 VueUse 的 `useSessionStorage` 實現持久化
> 2. **樣式系統**：使用 SCSS 的 Map + Mixin 定義主題變數，在 `:root` 和 `.body--dark` 中套用
> 3. **切換機制**：透過 Quasar 的 `$q.dark` API 控制，自動在 `<body>` 加上對應 class
> 4. **開發體驗**：提供 `@include light` 和 `@include dark` mixin，讓元件樣式開發更直觀
>
> 這套方案在我們專案中運行良好，切換流暢、狀態穩定、易於維護。"

---

## 方案 4：CSS Class 切換

### 實作方式

```css
/* styles/themes.css */

/* 亮色主題 */
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

/* 暗色主題 */
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
// 切換主題
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
}
```

### 適用場景

- 需要支援 IE 等舊瀏覽器
- 主題差異較大，不適合用變數
- 不想引入額外依賴

---

## 方案 5：獨立 CSS 檔案（不推薦）

### 實作方式

```html
<!-- 動態載入 CSS -->
<link id="theme-stylesheet" rel="stylesheet" href="/styles/theme-light.css" />
```

```javascript
function setTheme(theme) {
  const link = document.getElementById('theme-stylesheet');
  link.href = `/styles/theme-${theme}.css`;
}
```

### 缺點

- ❌ **載入開銷**：切換時需重新下載 CSS
- ❌ **FOUC**：可能出現短暫的無樣式閃爍
- ❌ **重複程式碼**：共用樣式需要重複定義

---

## RWD 響應式設計整合

### Tailwind CSS + RWD + 主題切換

```vue
<template>
  <div
    class="
      /* 基礎樣式 */
      p-4 rounded-lg transition-colors
      
      /* 亮色主題 */
      bg-white text-gray-900
      
      /* 暗色主題 */
      dark:bg-gray-800 dark:text-gray-100
      
      /* RWD: 手機 */
      text-sm
      
      /* RWD: 平板以上 */
      md:text-base md:p-6
      
      /* RWD: 桌機以上 */
      lg:text-lg lg:p-8
      
      /* 互動狀態 */
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
      響應式標題
    </h2>

    <p class="mt-2 text-gray-700 dark:text-gray-300">內容文字</p>

    <!-- 響應式網格 -->
    <div
      class="
        grid 
        grid-cols-1       /* 手機: 1 列 */
        sm:grid-cols-2    /* 小平板: 2 列 */
        md:grid-cols-3    /* 平板: 3 列 */
        lg:grid-cols-4    /* 桌機: 4 列 */
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
/* 基礎變數 */
:root {
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --font-size-base: 16px;
}

/* 平板以上調整間距 */
@media (min-width: 768px) {
  :root {
    --spacing-sm: 0.75rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
  }
}

/* 桌機以上調整字體 */
@media (min-width: 1024px) {
  :root {
    --font-size-base: 18px;
  }
}

/* 使用變數 */
.container {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* 暗色主題 + RWD */
@media (min-width: 768px) {
  [data-theme='dark'] {
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }
}
```

---

## 效能優化建議

### 1. 避免 FOUC（Flash of Unstyled Content）

```html
<!-- 在 <head> 中立即執行，避免閃爍 -->
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
/* 自動偵測系統主題 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* 如果使用者沒有設定偏好，跟隨系統 */
    --color-background: #1f2937;
    --color-text: #f9fafb;
  }
}
```

```javascript
// JavaScript 偵測
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (!localStorage.getItem('theme')) {
  setTheme(prefersDark ? 'dark' : 'light');
}
```

### 3. CSS 動畫過渡

```css
/* 平滑過渡 */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* 或針對特定元素 */
body,
.card,
.button {
  transition: all 0.3s ease;
}
```

### 4. 減少重排（Reflow）

```css
/* 使用 transform 而非直接改變寬高 */
.theme-switching {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.theme-switching:hover {
  transform: scale(1.05); /* GPU 加速 */
}
```

---

## 實際專案架構

### 檔案結構

```
src/
├── styles/
│   ├── themes/
│   │   ├── variables.css       # CSS Variables 定義
│   │   ├── light.css          # 亮色主題
│   │   ├── dark.css           # 暗色主題
│   │   └── sepia.css          # 護眼主題
│   ├── base.css               # 基礎樣式
│   └── components/            # 元件樣式
│       ├── button.css
│       └── card.css
├── utils/
│   └── theme.js               # 主題切換邏輯
└── components/
    └── ThemeToggle.vue        # 主題切換元件
```

### 最佳實踐

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

    // 監聽系統主題變化
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

## 面試回答範本

**面試官：當一個頁面要做 2 種不同風格，怎麼安排 CSS？**

**回答方式 A：展現實際經驗（推薦）**

> "我會根據專案技術棧選擇最適合的方案。**在我上一個專案中**，我們使用 **Quasar + Pinia + SCSS** 實作：
>
> **1. 狀態管理（30 秒）**
>
> - 使用 Pinia Store 統一管理主題狀態
> - 配合 VueUse 的 `useSessionStorage` 持久化
> - 透過 Quasar 的 `$q.dark` API 控制主題
>
> **2. 樣式系統（1 分鐘）**
>
> ```scss
> // SCSS Map 定義主題變數
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
> - 元件使用 `var(--bg-main)` 自動切換
> - 提供 `@include light` / `@include dark` mixin 處理複雜樣式
>
> **3. 切換機制（30 秒）**
>
> ```typescript
> const toggleTheme = () => {
>   $q.dark.toggle(); // Quasar 切換
>   store.updateIsDarkMode($q.dark.isActive); // 同步 Store
> };
> ```
>
> **4. 實際成效（30 秒）**
>
> - 切換流暢無閃爍（CSS Variables 動態更新）
> - 狀態持久化（刷新頁面主題不丟失）
> - 易於維護（主題變數集中管理）
> - 開發效率高（Mixin 簡化樣式開發）"

**回答方式 B：通用方案（備選）**

> "現代專案我推薦使用 **CSS Variables + Tailwind CSS**：
>
> **1. 架構設計（30 秒）**
>
> - 使用 CSS Variables 定義主題變數（顏色、間距、陰影等）
> - 透過 `data-theme` 屬性切換根元素的主題
> - 搭配 Tailwind 的 `dark:` 變體快速開發
>
> **2. 實作重點（1 分鐘）**
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
> JavaScript 切換時只需改變 `data-theme` 屬性，瀏覽器自動套用對應變數。
>
> **3. RWD 整合（30 秒）**
>
> ```html
> <div class="text-sm md:text-base lg:text-lg dark:bg-gray-800"></div>
> ```
>
> 可以同時處理 RWD 和主題切換。
>
> **4. 最佳實踐（30 秒）**
>
> - 在 `<head>` 中立即執行主題初始化，避免 FOUC
> - 使用 `localStorage` 儲存使用者偏好
> - 偵測 `prefers-color-scheme` 跟隨系統主題"

---

## 延伸問題

**Q1: 如果要支援 IE 怎麼辦？**

A: 使用 CSS Class 切換方案，或使用 [css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill) polyfill。

**Q2: 如何避免主題切換時的閃爍？**

A: 在 HTML `<head>` 中立即執行腳本，在頁面渲染前就設定好主題。

**Q3: 多個主題如何管理？**

A: 建議使用 Design Tokens 系統，統一管理所有主題變數，配合 Figma Variables 同步。

**Q4: 如何測試不同主題？**

A: 使用 Storybook 配合 `storybook-addon-themes`，可視化測試所有主題變體。

---

## 相關主題

- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Dark Mode in 5 Minutes](https://web.dev/prefers-color-scheme/)
