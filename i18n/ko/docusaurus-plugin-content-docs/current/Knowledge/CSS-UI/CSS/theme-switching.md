---
id: theme-switching
title: '[Medium] \U0001F3A8 다중 테마 전환 구현'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## 면접 시나리오 문제

**Q: 페이지에 2가지 다른 스타일(예: 라이트/다크 테마)을 적용할 때, CSS를 어떻게 구성하나요?**

이것은 CSS 아키텍처 설계와 실무 경험을 평가하는 질문으로, 다음을 포함합니다:

1. CSS 아키텍처 설계
2. 테마 전환 전략
3. 현대적 도구 활용 (Tailwind CSS, CSS Variables)
4. 성능과 유지보수성 고려

---

## 솔루션 개요

| 방안                      | 적용 시나리오            | 장점                           | 단점                   | 추천도         |
| ------------------------- | ----------------------- | ------------------------------ | ---------------------- | -------------- |
| **CSS Variables**         | 모던 브라우저 프로젝트   | 동적 전환, 성능 우수           | IE 미지원              | 5/5 강력 추천  |
| **Quasar + Pinia + SCSS** | Vue 3 + Quasar 프로젝트 | 완전한 생태계, 상태 관리, 유지보수 용이 | Quasar Framework 필요 | 5/5 강력 추천  |
| **Tailwind CSS**          | 빠른 개발, 디자인 시스템 | 개발 속도 빠름, 일관성 높음    | 학습 곡선, HTML 장황   | 5/5 강력 추천  |
| **CSS Class 전환**        | 구형 브라우저 호환 필요  | 호환성 좋음                    | CSS 용량 큼            | 4/5 추천       |
| **CSS Modules**           | React/Vue 컴포넌트 프로젝트 | 스코프 격리                 | 빌드 도구 필요         | 4/5 추천       |
| **Styled Components**     | React 프로젝트           | CSS-in-JS, 동적 스타일        | Runtime 오버헤드       | 4/5 추천       |
| **SASS/LESS 변수**        | 컴파일 시 테마 결정 필요 | 기능 강력                      | 동적 전환 불가         | 3/5 고려 가능  |
| **독립 CSS 파일**          | 테마 차이가 큰 경우      | 명확한 분리                    | 로딩 오버헤드, 중복 코드 | 2/5 비추천   |

---

## 방안 1: CSS Variables

### 핵심 개념

CSS 사용자 정의 속성(CSS Custom Properties)을 사용하여, 루트 요소의 class를 전환함으로써 변수 값을 변경합니다.

### 구현 방식

#### 1. 테마 변수 정의

```css
/* styles/themes.css */

/* 라이트 테마 (기본) */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  --color-card: #f9fafb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 다크 테마 */
[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-secondary: #a78bfa;
  --color-background: #1f2937;
  --color-text: #f9fafb;
  --color-border: #374151;
  --color-card: #111827;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 세 번째 테마가 있는 경우 (예: 눈 보호 모드) */
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

#### 2. 변수 사용

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

#### 3. JavaScript 테마 전환

```javascript
// utils/theme.js

// 현재 테마 가져오기
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

// 테마 설정
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// 테마 전환
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// 초기화 (localStorage에서 사용자 설정 읽기)
function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);

  // 시스템 테마 변경 감지
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // 사용자가 설정을 하지 않은 경우, 시스템을 따름
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// 페이지 로드 시 초기화
initTheme();
```

#### 4. Vue 3 통합 예시

```vue
<template>
  <div>
    <button @click="toggleTheme" class="theme-toggle">
      <span v-if="currentTheme === 'light'">🌙 다크 모드</span>
      <span v-else>☀️ 라이트 모드</span>
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

### 장점

- ✅ **동적 전환**: CSS 파일을 다시 로드할 필요 없음
- ✅ **성능 우수**: 브라우저 네이티브 지원, 변수 값만 변경
- ✅ **유지보수 용이**: 테마를 집중 관리, 수정이 편리
- ✅ **확장 가능**: 세 번째, 네 번째 테마를 쉽게 추가

### 단점

- ❌ **IE 미지원**: polyfill 또는 대체 방안 필요
- ❌ **전처리기 통합**: SASS/LESS 변수와 혼합 사용 시 주의 필요

---

## 방안 2: Tailwind CSS

### 핵심 개념

Tailwind CSS의 `dark:` 변형과 커스텀 테마 설정을 사용하고, class 전환으로 테마를 구현합니다.

### 구현 방식

#### 1. Tailwind 설정

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // class 전략 사용 (media query가 아닌)
  theme: {
    extend: {
      colors: {
        // 커스텀 색상 (여러 세트의 테마 색상 정의 가능)
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

#### 2. Tailwind 테마 클래스 사용

```vue
<template>
  <!-- 방식 1: dark: 변형 사용 -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h1 class="text-blue-600 dark:text-blue-400">제목</h1>

    <button
      class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      버튼
    </button>

    <div
      class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg"
    >
      <p class="text-gray-700 dark:text-gray-300">내용 텍스트</p>
    </div>
  </div>

  <!-- 테마 전환 버튼 -->
  <button @click="toggleTheme" class="fixed top-4 right-4">
    <svg v-if="isDark" class="w-6 h-6">
      <!-- 태양 아이콘 -->
    </svg>
    <svg v-else class="w-6 h-6">
      <!-- 달 아이콘 -->
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
  // 저장된 테마 설정 읽기
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});
</script>
```

#### 3. 고급: 다중 테마 커스터마이징 (2개 이상)

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
  <!-- 커스텀 테마 변수 사용 -->
  <div class="bg-theme-bg text-theme-text">
    <button class="bg-theme-primary">버튼</button>
  </div>

  <!-- 테마 선택기 -->
  <select @change="setTheme($event.target.value)">
    <option value="light">라이트</option>
    <option value="dark">다크</option>
    <option value="sepia">눈 보호</option>
  </select>
</template>

<script setup>
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
</script>
```

### Tailwind의 장점

- ✅ **빠른 개발**: utility-first, CSS 작성 불필요
- ✅ **일관성**: 디자인 시스템 내장, 스타일 통일 유지
- ✅ **tree-shaking**: 사용하지 않는 스타일 자동 제거
- ✅ **RWD 친화적**: `sm:`, `md:`, `lg:` 반응형 변형
- ✅ **테마 변형**: `dark:`, `hover:`, `focus:` 등 풍부한 변형

### 단점

- ❌ **HTML 장황**: class가 많아 가독성에 영향 가능
- ❌ **학습 곡선**: utility class 명명에 익숙해져야 함
- ❌ **커스터마이징**: 깊은 커스터마이징에는 설정 이해 필요

---

## 방안 3: Quasar + Pinia + SCSS (최근 경험)

> **실제 프로젝트 경험**: 이것은 실제 프로젝트에서 사용한 방안으로, Quasar Framework, Pinia 상태 관리, SCSS 변수 시스템을 통합했습니다.

### 핵심 개념

다층 아키텍처 설계 채택:

1. **Quasar Dark Mode API** - 프레임워크 레벨의 테마 지원
2. **Pinia Store** - 테마 상태 중앙 관리
3. **SessionStorage** - 사용자 설정 영속화
4. **SCSS Variables + Mixin** - 테마 변수와 스타일 관리

### 아키텍처 흐름

```
사용자가 전환 버튼 클릭
    ↓
Quasar $q.dark.toggle()
    ↓
Pinia Store 상태 업데이트
    ↓
SessionStorage에 동기화
    ↓
Body class 전환 (.body--light / .body--dark)
    ↓
CSS 변수 업데이트
    ↓
UI 자동 업데이트
```

### 구현 방식

#### 1. Pinia Store (상태 관리)

```typescript
// src/stores/darkModeStore.ts
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // SessionStorage로 상태 영속화
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // Dark Mode 상태 업데이트
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

#### 2. Quasar 설정

```javascript
// quasar.config.js
module.exports = configure(function (/* ctx */) {
  return {
    framework: {
      config: {
        dark: 'true', // Dark Mode 지원 활성화
      },
      plugins: ['Notify', 'Loading', 'Dialog'],
    },
  };
});
```

#### 3. SCSS 테마 변수 시스템

```scss
// assets/css/_variable.scss

// Light와 Dark 두 가지 테마의 변수 매핑 정의
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

// Mixin: 테마에 따른 CSS 변수 적용
@mixin theme-vars($theme) {
  @each $key, $value in map-get($themes, $theme) {
    #{$key}: #{$value};
  }
}

// Mixin: Light Mode 전용 스타일
@mixin light {
  .body--light & {
    @content;
  }
}

// Mixin: Dark Mode 전용 스타일
@mixin dark {
  .body--dark & {
    @content;
  }
}
```

#### 4. 전역 테마 적용

```scss
// src/css/app.scss
@import 'assets/css/_variable.scss';

// 기본값으로 Light Theme 적용
:root {
  @include theme-vars('light');
}

// Dark Mode에서 Dark Theme 적용
.body--dark {
  @include theme-vars('dark');
}
```

#### 5. 컴포넌트에서 사용

**방식 A: CSS 변수 사용 (추천)**

```vue
<template>
  <div class="my-card">
    <h2 class="title">제목</h2>
    <p class="content">내용 텍스트</p>
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

**방식 B: SCSS Mixin 사용 (고급)**

```vue
<template>
  <button class="custom-btn">버튼</button>
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

#### 6. 전환 기능

```vue
<template>
  <button @click="toggleDarkMode" class="theme-toggle">
    <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
    {{ isDarkMode ? '라이트로 전환' : '다크로 전환' }}
  </button>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useDarkModeStore } from 'stores/darkModeStore';

const $q = useQuasar();
const { isDarkMode, updateIsDarkMode } = useDarkModeStore();

// 테마 전환
const toggleDarkMode = () => {
  $q.dark.toggle(); // Quasar 전환
  updateIsDarkMode($q.dark.isActive); // Store에 동기화
};

// 페이지 로드 시 사용자 설정 복원
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

### 장점

- ✅ **완전한 생태계**: Quasar + Pinia + VueUse 원스톱 솔루션
- ✅ **상태 관리**: Pinia 중앙 관리, 테스트와 유지보수 용이
- ✅ **영속화**: SessionStorage 자동 저장, 새로고침해도 유지
- ✅ **타입 안전**: TypeScript 지원, 오류 감소
- ✅ **개발 경험**: SCSS Mixin으로 스타일 개발 간소화
- ✅ **성능 우수**: CSS Variables 동적 업데이트, 리로드 불필요

### 단점

- ❌ **프레임워크 의존**: Quasar Framework 사용 필요
- ❌ **학습 비용**: Quasar, Pinia, SCSS에 익숙해져야 함
- ❌ **용량 큼**: 완전한 프레임워크는 순수 CSS보다 무거움

### 모범 사례

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

### 면접에서 어떻게 보여줄 것인가

> "이전 프로젝트에서 **Quasar + Pinia + SCSS**로 완전한 Dark Mode 시스템을 구현했습니다:
>
> 1. **상태 관리**: Pinia Store로 테마 상태를 통합 관리하고, VueUse의 `useSessionStorage`로 영속화 구현
> 2. **스타일 시스템**: SCSS의 Map + Mixin으로 테마 변수를 정의하고, `:root`와 `.body--dark`에 적용
> 3. **전환 메커니즘**: Quasar의 `$q.dark` API로 제어하며, `<body>`에 해당 class 자동 추가
> 4. **개발 경험**: `@include light`와 `@include dark` mixin을 제공하여 컴포넌트 스타일 개발을 더 직관적으로
>
> 이 방안은 프로젝트에서 안정적으로 운영되었으며, 전환이 부드럽고 상태가 안정적이며 유지보수가 용이합니다."

---

## 방안 4: CSS Class 전환

### 구현 방식

```css
/* styles/themes.css */

/* 라이트 테마 */
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

/* 다크 테마 */
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
// 테마 전환
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
}
```

### 적용 시나리오

- IE 등 구형 브라우저 지원이 필요한 경우
- 테마 차이가 커서 변수 사용이 부적합한 경우
- 추가 의존성을 도입하고 싶지 않은 경우

---

## 방안 5: 독립 CSS 파일 (비추천)

### 구현 방식

```html
<!-- CSS 동적 로딩 -->
<link id="theme-stylesheet" rel="stylesheet" href="/styles/theme-light.css" />
```

```javascript
function setTheme(theme) {
  const link = document.getElementById('theme-stylesheet');
  link.href = `/styles/theme-${theme}.css`;
}
```

### 단점

- ❌ **로딩 오버헤드**: 전환 시 CSS 다시 다운로드 필요
- ❌ **FOUC**: 짧은 시간 동안 스타일이 없는 깜빡임 발생 가능
- ❌ **중복 코드**: 공용 스타일을 중복 정의해야 함

---

## RWD 반응형 디자인 통합

### Tailwind CSS + RWD + 테마 전환

```vue
<template>
  <div
    class="
      /* 기본 스타일 */
      p-4 rounded-lg transition-colors

      /* 라이트 테마 */
      bg-white text-gray-900

      /* 다크 테마 */
      dark:bg-gray-800 dark:text-gray-100

      /* RWD: 모바일 */
      text-sm

      /* RWD: 태블릿 이상 */
      md:text-base md:p-6

      /* RWD: 데스크톱 이상 */
      lg:text-lg lg:p-8

      /* 인터랙션 상태 */
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
      반응형 제목
    </h2>

    <p class="mt-2 text-gray-700 dark:text-gray-300">내용 텍스트</p>

    <!-- 반응형 그리드 -->
    <div
      class="
        grid
        grid-cols-1       /* 모바일: 1열 */
        sm:grid-cols-2    /* 소형 태블릿: 2열 */
        md:grid-cols-3    /* 태블릿: 3열 */
        lg:grid-cols-4    /* 데스크톱: 4열 */
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
/* 기본 변수 */
:root {
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --font-size-base: 16px;
}

/* 태블릿 이상에서 간격 조정 */
@media (min-width: 768px) {
  :root {
    --spacing-sm: 0.75rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
  }
}

/* 데스크톱 이상에서 폰트 조정 */
@media (min-width: 1024px) {
  :root {
    --font-size-base: 18px;
  }
}

/* 변수 사용 */
.container {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* 다크 테마 + RWD */
@media (min-width: 768px) {
  [data-theme='dark'] {
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }
}
```

---

## 성능 최적화 제안

### 1. FOUC (Flash of Unstyled Content) 방지

```html
<!-- <head>에서 즉시 실행하여 깜빡임 방지 -->
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

### 2. prefers-color-scheme 사용

```css
/* 시스템 테마 자동 감지 */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* 사용자가 설정하지 않은 경우, 시스템을 따름 */
    --color-background: #1f2937;
    --color-text: #f9fafb;
  }
}
```

```javascript
// JavaScript 감지
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (!localStorage.getItem('theme')) {
  setTheme(prefersDark ? 'dark' : 'light');
}
```

### 3. CSS 애니메이션 전환

```css
/* 부드러운 전환 */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* 또는 특정 요소에 적용 */
body,
.card,
.button {
  transition: all 0.3s ease;
}
```

### 4. Reflow 줄이기

```css
/* 너비/높이를 직접 변경하는 대신 transform 사용 */
.theme-switching {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.theme-switching:hover {
  transform: scale(1.05); /* GPU 가속 */
}
```

---

## 실제 프로젝트 아키텍처

### 파일 구조

```
src/
├── styles/
│   ├── themes/
│   │   ├── variables.css       # CSS Variables 정의
│   │   ├── light.css          # 라이트 테마
│   │   ├── dark.css           # 다크 테마
│   │   └── sepia.css          # 눈 보호 테마
│   ├── base.css               # 기본 스타일
│   └── components/            # 컴포넌트 스타일
│       ├── button.css
│       └── card.css
├── utils/
│   └── theme.js               # 테마 전환 로직
└── components/
    └── ThemeToggle.vue        # 테마 전환 컴포넌트
```

### 모범 사례

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

    // 시스템 테마 변경 감지
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

## 면접 답변 템플릿

**면접관: 페이지에 2가지 다른 스타일을 적용할 때, CSS를 어떻게 구성하나요?**

**답변 방식 A: 실제 경험 보여주기 (추천)**

> "프로젝트의 기술 스택에 따라 가장 적합한 방안을 선택합니다. **이전 프로젝트에서** **Quasar + Pinia + SCSS**로 구현했습니다:
>
> **1. 상태 관리 (30초)**
>
> - Pinia Store로 테마 상태를 통합 관리
> - VueUse의 `useSessionStorage`로 영속화
> - Quasar의 `$q.dark` API로 테마 제어
>
> **2. 스타일 시스템 (1분)**
>
> ```scss
> // SCSS Map으로 테마 변수 정의
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
> // :root와 .body--dark에 적용
> :root {
>   @include theme-vars('light');
> }
> .body--dark {
>   @include theme-vars('dark');
> }
> ```
>
> - 컴포넌트에서 `var(--bg-main)` 사용으로 자동 전환
> - `@include light` / `@include dark` mixin으로 복잡한 스타일 처리
>
> **3. 전환 메커니즘 (30초)**
>
> ```typescript
> const toggleTheme = () => {
>   $q.dark.toggle(); // Quasar 전환
>   store.updateIsDarkMode($q.dark.isActive); // Store에 동기화
> };
> ```
>
> **4. 실제 성과 (30초)**
>
> - 전환이 부드럽고 깜빡임 없음 (CSS Variables 동적 업데이트)
> - 상태 영속화 (페이지 새로고침해도 테마 유지)
> - 유지보수 용이 (테마 변수 중앙 관리)
> - 높은 개발 효율 (Mixin으로 스타일 개발 간소화)"

**답변 방식 B: 범용 방안 (대안)**

> "현대 프로젝트에서는 **CSS Variables + Tailwind CSS** 사용을 추천합니다:
>
> **1. 아키텍처 설계 (30초)**
>
> - CSS Variables로 테마 변수 정의 (색상, 간격, 그림자 등)
> - `data-theme` 속성으로 루트 요소의 테마 전환
> - Tailwind의 `dark:` 변형으로 빠른 개발
>
> **2. 구현 포인트 (1분)**
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
> JavaScript 전환 시 `data-theme` 속성만 변경하면, 브라우저가 자동으로 해당 변수를 적용합니다.
>
> **3. RWD 통합 (30초)**
>
> ```html
> <div class="text-sm md:text-base lg:text-lg dark:bg-gray-800"></div>
> ```
>
> RWD와 테마 전환을 동시에 처리할 수 있습니다.
>
> **4. 모범 사례 (30초)**
>
> - `<head>`에서 테마 초기화를 즉시 실행하여 FOUC 방지
> - `localStorage`로 사용자 설정 저장
> - `prefers-color-scheme` 감지로 시스템 테마 따르기"

---

## 추가 질문

**Q1: IE를 지원해야 하는 경우 어떻게 하나요?**

A: CSS Class 전환 방안을 사용하거나, [css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill) polyfill을 사용합니다.

**Q2: 테마 전환 시 깜빡임을 어떻게 방지하나요?**

A: HTML `<head>`에서 스크립트를 즉시 실행하여, 페이지 렌더링 전에 테마를 설정합니다.

**Q3: 여러 테마는 어떻게 관리하나요?**

A: Design Tokens 시스템을 사용하여 모든 테마 변수를 통합 관리하고, Figma Variables와 동기화하는 것을 권장합니다.

**Q4: 다른 테마를 어떻게 테스트하나요?**

A: Storybook과 `storybook-addon-themes`를 사용하여, 모든 테마 변형을 시각적으로 테스트합니다.

---

## 관련 주제

- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Dark Mode in 5 Minutes](https://web.dev/prefers-color-scheme/)
