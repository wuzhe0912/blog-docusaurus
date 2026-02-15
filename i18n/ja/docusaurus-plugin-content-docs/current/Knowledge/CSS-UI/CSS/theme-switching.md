---
id: theme-switching
title: '[Medium] 🎨 マルチテーマ切り替え実装'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## 📋 面接シナリオ問題

**Q: ページに2種類の異なるスタイル（例：ライト/ダークテーマ）を実装する場合、CSS をどのように設計しますか？**

これは CSS のアーキテクチャ設計と実務経験を問う問題で、以下を含みます：

1. CSS アーキテクチャ設計
2. テーマ切り替え戦略
3. モダンツールの活用（Tailwind CSS、CSS Variables）
4. パフォーマンスとメンテナンス性の考慮

---

## ソリューション一覧

| ソリューション              | 適用シーン                 | メリット                     | デメリット           | 推奨度         |
| --------------------------- | -------------------------- | ---------------------------- | -------------------- | -------------- |
| **CSS Variables**           | モダンブラウザプロジェクト | 動的切替、高パフォーマンス   | IE 非対応            | 5/5 強く推奨   |
| **Quasar + Pinia + SCSS**   | Vue 3 + Quasar プロジェクト| 完全なエコシステム、状態管理 | Quasar Framework 必須| 5/5 強く推奨   |
| **Tailwind CSS**            | 高速開発、デザインシステム | 開発が速い、一貫性が高い     | 学習コスト、HTML 冗長| 5/5 強く推奨   |
| **CSS Class 切替**          | レガシーブラウザ対応が必要 | 互換性が良い                 | CSS サイズが大きい   | 4/5 推奨       |
| **CSS Modules**             | React/Vue コンポーネント型 | スコープ分離                 | ビルドツールが必要   | 4/5 推奨       |
| **Styled Components**       | React プロジェクト         | CSS-in-JS、動的スタイル      | ランタイムオーバーヘッド | 4/5 推奨   |
| **SASS/LESS 変数**          | コンパイル時にテーマ決定   | 機能が豊富                   | 動的切替ができない   | 3/5 検討の余地 |
| **独立 CSS ファイル**       | テーマの差異が大きい       | 明確な分離                   | 読み込みコスト、重複コード | 2/5 非推奨 |

---

## ソリューション 1：CSS Variables

### コアコンセプト

CSS カスタムプロパティ（CSS Custom Properties）を使用し、ルート要素の class を切り替えることで変数値を変更します。

### 実装方法

#### 1. テーマ変数の定義

```css
/* styles/themes.css */

/* ライトテーマ（デフォルト） */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  --color-card: #f9fafb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* ダークテーマ */
[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-secondary: #a78bfa;
  --color-background: #1f2937;
  --color-text: #f9fafb;
  --color-border: #374151;
  --color-card: #111827;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 第3のテーマがある場合（例：目に優しいモード） */
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

#### 2. 変数の使用

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

#### 3. JavaScript でテーマを切り替え

```javascript
// utils/theme.js

// 現在のテーマを取得
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

// テーマを設定
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// テーマを切り替え
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// 初期化（localStorage からユーザーの好みを読み取り）
function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);

  // システムテーマの変更を監視
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // ユーザーが好みを設定していない場合、システムに追従
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// ページ読み込み時に初期化
initTheme();
```

#### 4. Vue 3 統合例

```vue
<template>
  <div>
    <button @click="toggleTheme" class="theme-toggle">
      <span v-if="currentTheme === 'light'">🌙 ダークモード</span>
      <span v-else>☀️ ライトモード</span>
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

### メリット

- ✅ **動的切替**：CSS ファイルの再読み込みが不要
- ✅ **高パフォーマンス**：ブラウザネイティブサポート、変数値の変更のみ
- ✅ **メンテナンスが容易**：テーマの一元管理、変更が簡単
- ✅ **拡張性**：第3、第4のテーマを容易に追加可能

### デメリット

- ❌ **IE 非対応**：polyfill またはフォールバック方案が必要
- ❌ **プリプロセッサとの統合**：SASS/LESS 変数との混用に注意が必要

---

## ソリューション 2：Tailwind CSS

### コアコンセプト

Tailwind CSS の `dark:` バリアントとカスタムテーマ設定を使用し、class の切り替えでテーマを実現します。

### 実装方法

#### 1. Tailwind の設定

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // class 戦略を使用（media query ではなく）
  theme: {
    extend: {
      colors: {
        // カスタムカラー（複数のテーマカラーセットを定義可能）
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

#### 2. Tailwind のテーマクラスを使用

```vue
<template>
  <!-- 方法 1：dark: バリアントを使用 -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h1 class="text-blue-600 dark:text-blue-400">タイトル</h1>

    <button
      class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      ボタン
    </button>

    <div
      class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg"
    >
      <p class="text-gray-700 dark:text-gray-300">コンテンツテキスト</p>
    </div>
  </div>

  <!-- テーマ切替ボタン -->
  <button @click="toggleTheme" class="fixed top-4 right-4">
    <svg v-if="isDark" class="w-6 h-6">
      <!-- 太陽アイコン -->
    </svg>
    <svg v-else class="w-6 h-6">
      <!-- 月アイコン -->
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
  // 保存されたテーマの好みを読み取り
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});
</script>
```

#### 3. 上級編：カスタムマルチテーマ（2種類以上）

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
  <!-- カスタムテーマ変数を使用 -->
  <div class="bg-theme-bg text-theme-text">
    <button class="bg-theme-primary">ボタン</button>
  </div>

  <!-- テーマセレクタ -->
  <select @change="setTheme($event.target.value)">
    <option value="light">ライト</option>
    <option value="dark">ダーク</option>
    <option value="sepia">目に優しい</option>
  </select>
</template>

<script setup>
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
</script>
```

### Tailwind の利点

- ✅ **高速開発**：utility-first で CSS を書く必要なし
- ✅ **一貫性**：デザインシステム内蔵、スタイルの統一性を維持
- ✅ **tree-shaking**：未使用のスタイルを自動的に削除
- ✅ **RWD フレンドリー**：`sm:`, `md:`, `lg:` レスポンシブバリアント
- ✅ **テーマバリアント**：`dark:`, `hover:`, `focus:` など豊富なバリアント

### デメリット

- ❌ **HTML が冗長**：class が多く、可読性に影響する可能性
- ❌ **学習コスト**：utility class の命名に慣れる必要がある
- ❌ **カスタマイズ**：深いカスタマイズには設定の理解が必要

---

## ソリューション 3：Quasar + Pinia + SCSS（最近の経験）

> 💼 **実際のプロジェクト経験**：これは実際のプロジェクトで使用したソリューションで、Quasar Framework、Pinia 状態管理、SCSS 変数システムを統合しています。

### コアコンセプト

多層アーキテクチャ設計を採用：

1. **Quasar Dark Mode API** - フレームワークレベルのテーマサポート
2. **Pinia Store** - テーマ状態の一元管理
3. **SessionStorage** - ユーザー好みの永続化
4. **SCSS Variables + Mixin** - テーマ変数とスタイル管理

### アーキテクチャフロー

```
ユーザーが切替ボタンをクリック
    ↓
Quasar $q.dark.toggle()
    ↓
Pinia Store の状態更新
    ↓
SessionStorage に同期
    ↓
Body class の切替 (.body--light / .body--dark)
    ↓
CSS 変数の更新
    ↓
UI の自動更新
```

### 実装方法

#### 1. Pinia Store（状態管理）

```typescript
// src/stores/darkModeStore.ts
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // SessionStorage で状態を永続化
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // Dark Mode 状態の更新
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

#### 2. Quasar 設定

```javascript
// quasar.config.js
module.exports = configure(function (/* ctx */) {
  return {
    framework: {
      config: {
        dark: 'true', // Dark Mode サポートを有効化
      },
      plugins: ['Notify', 'Loading', 'Dialog'],
    },
  };
});
```

#### 3. SCSS テーマ変数システム

```scss
// assets/css/_variable.scss

// Light と Dark 2つのテーマの変数マッピングを定義
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

// Mixin: テーマに応じて対応する CSS 変数を適用
@mixin theme-vars($theme) {
  @each $key, $value in map-get($themes, $theme) {
    #{$key}: #{$value};
  }
}

// Mixin: Light Mode 専用スタイル
@mixin light {
  .body--light & {
    @content;
  }
}

// Mixin: Dark Mode 専用スタイル
@mixin dark {
  .body--dark & {
    @content;
  }
}
```

#### 4. グローバルテーマの適用

```scss
// src/css/app.scss
@import 'assets/css/_variable.scss';

// デフォルトで Light Theme を適用
:root {
  @include theme-vars('light');
}

// Dark Mode で Dark Theme を適用
.body--dark {
  @include theme-vars('dark');
}
```

#### 5. コンポーネントでの使用

**方法 A：CSS 変数を使用（推奨）**

```vue
<template>
  <div class="my-card">
    <h2 class="title">タイトル</h2>
    <p class="content">コンテンツテキスト</p>
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

**方法 B：SCSS Mixin を使用（上級）**

```vue
<template>
  <button class="custom-btn">ボタン</button>
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

#### 6. 切替機能

```vue
<template>
  <button @click="toggleDarkMode" class="theme-toggle">
    <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
    {{ isDarkMode ? 'ライトモードに切替' : 'ダークモードに切替' }}
  </button>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useDarkModeStore } from 'stores/darkModeStore';

const $q = useQuasar();
const { isDarkMode, updateIsDarkMode } = useDarkModeStore();

// テーマの切替
const toggleDarkMode = () => {
  $q.dark.toggle(); // Quasar 切替
  updateIsDarkMode($q.dark.isActive); // Store に同期
};

// ページ読み込み時にユーザーの好みを復元
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

### メリット

- ✅ **完全なエコシステム**：Quasar + Pinia + VueUse ワンストップソリューション
- ✅ **状態管理**：Pinia で一元管理、テストとメンテナンスが容易
- ✅ **永続化**：SessionStorage で自動保存、リフレッシュしても失われない
- ✅ **型安全**：TypeScript サポート、エラーの削減
- ✅ **開発体験**：SCSS Mixin でスタイル開発を簡素化
- ✅ **高パフォーマンス**：CSS Variables の動的更新、再読み込み不要

### デメリット

- ❌ **フレームワーク依存**：Quasar Framework が必要
- ❌ **学習コスト**：Quasar、Pinia、SCSS の習得が必要
- ❌ **サイズが大きい**：フル機能のフレームワークは純粋な CSS より重い

### ベストプラクティス

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

### 面接での伝え方

> "前のプロジェクトでは、**Quasar + Pinia + SCSS** で完全な Dark Mode システムを実装しました：
>
> 1. **状態管理**：Pinia Store でテーマ状態を一元管理し、VueUse の `useSessionStorage` で永続化を実現
> 2. **スタイルシステム**：SCSS の Map + Mixin でテーマ変数を定義し、`:root` と `.body--dark` で適用
> 3. **切替メカニズム**：Quasar の `$q.dark` API で制御、自動的に `<body>` に対応する class を追加
> 4. **開発体験**：`@include light` と `@include dark` mixin を提供し、コンポーネントスタイル開発をより直感的に
>
> このソリューションはプロジェクトで良好に動作し、スムーズな切替、安定した状態、メンテナンスの容易さを実現しました。"

---

## ソリューション 4：CSS Class 切替

### 実装方法

```css
/* styles/themes.css */

/* ライトテーマ */
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

/* ダークテーマ */
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
// テーマの切替
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
}
```

### 適用シーン

- IE などのレガシーブラウザのサポートが必要な場合
- テーマの差異が大きく、変数での対応が不適切な場合
- 追加の依存関係を導入したくない場合

---

## ソリューション 5：独立 CSS ファイル（非推奨）

### 実装方法

```html
<!-- 動的に CSS を読み込み -->
<link id="theme-stylesheet" rel="stylesheet" href="/styles/theme-light.css" />
```

```javascript
function setTheme(theme) {
  const link = document.getElementById('theme-stylesheet');
  link.href = `/styles/theme-${theme}.css`;
}
```

### デメリット

- ❌ **読み込みコスト**：切替時に CSS の再ダウンロードが必要
- ❌ **FOUC**：一瞬のスタイル未適用のちらつきが発生する可能性
- ❌ **重複コード**：共通スタイルの重複定義が必要

---

## RWD レスポンシブデザインとの統合

### Tailwind CSS + RWD + テーマ切替

```vue
<template>
  <div
    class="
      /* 基本スタイル */
      p-4 rounded-lg transition-colors

      /* ライトテーマ */
      bg-white text-gray-900

      /* ダークテーマ */
      dark:bg-gray-800 dark:text-gray-100

      /* RWD: スマートフォン */
      text-sm

      /* RWD: タブレット以上 */
      md:text-base md:p-6

      /* RWD: デスクトップ以上 */
      lg:text-lg lg:p-8

      /* インタラクション状態 */
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
      レスポンシブタイトル
    </h2>

    <p class="mt-2 text-gray-700 dark:text-gray-300">コンテンツテキスト</p>

    <!-- レスポンシブグリッド -->
    <div
      class="
        grid
        grid-cols-1       /* スマートフォン: 1列 */
        sm:grid-cols-2    /* 小型タブレット: 2列 */
        md:grid-cols-3    /* タブレット: 3列 */
        lg:grid-cols-4    /* デスクトップ: 4列 */
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
/* 基本変数 */
:root {
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --font-size-base: 16px;
}

/* タブレット以上で間隔を調整 */
@media (min-width: 768px) {
  :root {
    --spacing-sm: 0.75rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
  }
}

/* デスクトップ以上でフォントを調整 */
@media (min-width: 1024px) {
  :root {
    --font-size-base: 18px;
  }
}

/* 変数を使用 */
.container {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* ダークテーマ + RWD */
@media (min-width: 768px) {
  [data-theme='dark'] {
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }
}
```

---

## パフォーマンス最適化のアドバイス

### 1. FOUC（Flash of Unstyled Content）の回避

```html
<!-- <head> 内で即座に実行し、ちらつきを防止 -->
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

### 2. prefers-color-scheme の使用

```css
/* システムテーマを自動検出 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* ユーザーが好みを設定していない場合、システムに追従 */
    --color-background: #1f2937;
    --color-text: #f9fafb;
  }
}
```

```javascript
// JavaScript での検出
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (!localStorage.getItem('theme')) {
  setTheme(prefersDark ? 'dark' : 'light');
}
```

### 3. CSS アニメーショントランジション

```css
/* スムーズなトランジション */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* または特定の要素に対して */
body,
.card,
.button {
  transition: all 0.3s ease;
}
```

### 4. リフロー（Reflow）の削減

```css
/* 幅や高さを直接変更する代わりに transform を使用 */
.theme-switching {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.theme-switching:hover {
  transform: scale(1.05); /* GPU アクセラレーション */
}
```

---

## 実際のプロジェクトアーキテクチャ

### ファイル構造

```
src/
├── styles/
│   ├── themes/
│   │   ├── variables.css       # CSS Variables 定義
│   │   ├── light.css          # ライトテーマ
│   │   ├── dark.css           # ダークテーマ
│   │   └── sepia.css          # 目に優しいテーマ
│   ├── base.css               # 基本スタイル
│   └── components/            # コンポーネントスタイル
│       ├── button.css
│       └── card.css
├── utils/
│   └── theme.js               # テーマ切替ロジック
└── components/
    └── ThemeToggle.vue        # テーマ切替コンポーネント
```

### ベストプラクティス

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

    // システムテーマの変更を監視
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

## 面接回答テンプレート

**面接官：ページに2種類の異なるスタイルを実装する場合、CSS をどのように設計しますか？**

**回答方法 A：実際の経験を示す（推奨）**

> "プロジェクトの技術スタックに応じて最適なソリューションを選択します。**前のプロジェクトでは**、**Quasar + Pinia + SCSS** で実装しました：
>
> **1. 状態管理（30 秒）**
>
> - Pinia Store でテーマ状態を統一管理
> - VueUse の `useSessionStorage` で永続化
> - Quasar の `$q.dark` API でテーマを制御
>
> **2. スタイルシステム（1 分）**
>
> ```scss
> // SCSS Map でテーマ変数を定義
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
> // :root と .body--dark に適用
> :root {
>   @include theme-vars('light');
> }
> .body--dark {
>   @include theme-vars('dark');
> }
> ```
>
> - コンポーネントは `var(--bg-main)` で自動切替
> - `@include light` / `@include dark` mixin で複雑なスタイルを処理
>
> **3. 切替メカニズム（30 秒）**
>
> ```typescript
> const toggleTheme = () => {
>   $q.dark.toggle(); // Quasar 切替
>   store.updateIsDarkMode($q.dark.isActive); // Store に同期
> };
> ```
>
> **4. 実際の成果（30 秒）**
>
> - ちらつきのないスムーズな切替（CSS Variables の動的更新）
> - 状態の永続化（ページリフレッシュしてもテーマが失われない）
> - メンテナンスが容易（テーマ変数の一元管理）
> - 高い開発効率（Mixin でスタイル開発を簡素化）"

**回答方法 B：汎用ソリューション（代替）**

> "モダンなプロジェクトでは **CSS Variables + Tailwind CSS** を推奨します：
>
> **1. アーキテクチャ設計（30 秒）**
>
> - CSS Variables でテーマ変数を定義（色、間隔、シャドウなど）
> - `data-theme` 属性でルート要素のテーマを切替
> - Tailwind の `dark:` バリアントで高速開発
>
> **2. 実装ポイント（1 分）**
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
> JavaScript で切替時は `data-theme` 属性を変更するだけで、ブラウザが自動的に対応する変数を適用します。
>
> **3. RWD 統合（30 秒）**
>
> ```html
> <div class="text-sm md:text-base lg:text-lg dark:bg-gray-800"></div>
> ```
>
> RWD とテーマ切替を同時に処理できます。
>
> **4. ベストプラクティス（30 秒）**
>
> - `<head>` 内でテーマの初期化を即座に実行し、FOUC を回避
> - `localStorage` でユーザーの好みを保存
> - `prefers-color-scheme` でシステムテーマに追従"

---

## 発展的な質問

**Q1: IE をサポートする必要がある場合はどうしますか？**

A: CSS Class 切替ソリューションを使用するか、[css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill) polyfill を使用します。

**Q2: テーマ切替時のちらつきをどう防ぎますか？**

A: HTML の `<head>` 内でスクリプトを即座に実行し、ページのレンダリング前にテーマを設定します。

**Q3: 複数のテーマをどう管理しますか？**

A: Design Tokens システムを使用して、すべてのテーマ変数を統一管理し、Figma Variables と同期させることを推奨します。

**Q4: 異なるテーマをどうテストしますか？**

A: Storybook に `storybook-addon-themes` を組み合わせて使用し、すべてのテーマバリエーションを視覚的にテストします。

---

## 関連トピック

- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Dark Mode in 5 Minutes](https://web.dev/prefers-color-scheme/)
