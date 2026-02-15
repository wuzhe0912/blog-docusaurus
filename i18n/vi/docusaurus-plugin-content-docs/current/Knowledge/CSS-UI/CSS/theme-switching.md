---
id: theme-switching
title: "[Medium] \U0001F3A8 Triển khai chuyển đổi giao diện"
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## Câu hỏi phỏng vấn tình huống

**Q: Khi một trang cần hỗ trợ 2 phong cách khác nhau (ví dụ giao diện sáng/tối), bạn sắp xếp CSS như thế nào?**

Đây là câu hỏi đánh giá thiết kế kiến trúc CSS và kinh nghiệm thực tế, bao gồm:

1. Thiết kế kiến trúc CSS
2. Chiến lược chuyển đổi giao diện
3. Ứng dụng công cụ hiện đại (Tailwind CSS, CSS Variables)
4. Cân nhắc về hiệu năng và khả năng bảo trì

---

## Tổng quan các giải pháp

| Giải pháp                   | Trường hợp sử dụng         | Ưu điểm                              | Nhược điểm                  | Đề xuất              |
| --------------------------- | --------------------------- | ------------------------------------- | --------------------------- | -------------------- |
| **CSS Variables**           | Dự án trình duyệt hiện đại | Chuyển đổi động, hiệu năng tốt       | IE không hỗ trợ             | 5/5 Rất khuyên dùng  |
| **Quasar + Pinia + SCSS**  | Dự án Vue 3 + Quasar       | Hệ sinh thái hoàn chỉnh, quản lý state | Cần Quasar Framework       | 5/5 Rất khuyên dùng  |
| **Tailwind CSS**            | Phát triển nhanh            | Nhanh, tính nhất quán cao             | Đường cong học tập, HTML dài | 5/5 Rất khuyên dùng  |
| **Chuyển đổi class CSS**   | Tương thích trình duyệt cũ | Tương thích tốt                       | CSS cồng kềnh               | 4/5 Khuyên dùng     |
| **CSS Modules**             | Dự án React/Vue             | Cách ly phạm vi                       | Cần bundler                 | 4/5 Khuyên dùng     |
| **Styled Components**       | Dự án React                 | CSS-in-JS, style động                 | Chi phí runtime             | 4/5 Khuyên dùng     |
| **Biến SASS/LESS**         | Giao diện quyết định lúc build | Mạnh mẽ                            | Không chuyển đổi động được  | 3/5 Có thể cân nhắc |
| **File CSS riêng biệt**    | Giao diện khác biệt lớn    | Phân tách rõ ràng                     | Chi phí tải, code trùng lặp | 2/5 Không khuyên    |

---

## Giải pháp 1: CSS Variables

### Khái niệm cốt lõi

Sử dụng CSS Custom Properties, chuyển đổi class của phần tử gốc để thay đổi giá trị biến.

### Cách triển khai

#### 1. Định nghĩa biến giao diện

```css
/* styles/themes.css */

/* Giao diện sáng (mặc định) */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-background: #ffffff;
  --color-text: #1f2937;
  --color-border: #e5e7eb;
  --color-card: #f9fafb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Giao diện tối */
[data-theme='dark'] {
  --color-primary: #60a5fa;
  --color-secondary: #a78bfa;
  --color-background: #1f2937;
  --color-text: #f9fafb;
  --color-border: #374151;
  --color-card: #111827;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Nếu có giao diện thứ ba (ví dụ chế độ bảo vệ mắt) */
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

#### 2. Sử dụng biến

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

#### 3. Chuyển đổi giao diện bằng JavaScript

```javascript
// utils/theme.js

// Lấy giao diện hiện tại
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}

// Đặt giao diện
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

// Chuyển đổi giao diện
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// Khởi tạo (đọc tùy chọn người dùng từ localStorage)
function initTheme() {
  const savedTheme = getCurrentTheme();
  setTheme(savedTheme);

  // Lắng nghe thay đổi giao diện hệ thống
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // Nếu người dùng chưa đặt tùy chọn, theo hệ thống
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Khởi tạo khi tải trang
initTheme();
```

#### 4. Ví dụ tích hợp Vue 3

```vue
<template>
  <div>
    <button @click="toggleTheme" class="theme-toggle">
      <span v-if="currentTheme === 'light'">🌙 Chế độ tối</span>
      <span v-else>☀️ Chế độ sáng</span>
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

### Ưu điểm

- **Chuyển đổi động** : Không cần tải lại file CSS
- **Hiệu năng tốt** : Trình duyệt hỗ trợ native, chỉ thay đổi giá trị biến
- **Dễ bảo trì** : Quản lý giao diện tập trung, dễ chỉnh sửa
- **Mở rộng được** : Dễ dàng thêm giao diện thứ ba, thứ tư

### Nhược điểm

- **IE không hỗ trợ** : Cần polyfill hoặc phương án dự phòng
- **Tích hợp preprocessor** : Cần lưu ý khi dùng chung với biến SASS/LESS

---

## Giải pháp 2: Tailwind CSS

### Khái niệm cốt lõi

Sử dụng variant `dark:` của Tailwind CSS và cấu hình theme tùy chỉnh, kết hợp chuyển đổi class để triển khai giao diện.

### Cách triển khai

#### 1. Cấu hình Tailwind

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Sử dụng chiến lược class (không phải media query)
  theme: {
    extend: {
      colors: {
        // Màu tùy chỉnh (có thể định nghĩa nhiều bộ màu)
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

#### 2. Sử dụng class giao diện Tailwind

```vue
<template>
  <!-- Cách 1: Sử dụng variant dark: -->
  <div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
    <h1 class="text-blue-600 dark:text-blue-400">Tiêu đề</h1>

    <button
      class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Nút
    </button>

    <div
      class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md dark:shadow-lg"
    >
      <p class="text-gray-700 dark:text-gray-300">Nội dung văn bản</p>
    </div>
  </div>

  <!-- Nút chuyển đổi giao diện -->
  <button @click="toggleTheme" class="fixed top-4 right-4">
    <svg v-if="isDark" class="w-6 h-6">
      <!-- Biểu tượng mặt trời -->
    </svg>
    <svg v-else class="w-6 h-6">
      <!-- Biểu tượng mặt trăng -->
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
  // Đọc tùy chọn giao diện đã lưu
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
});
</script>
```

#### 3. Nâng cao: Đa giao diện tùy chỉnh (hơn 2)

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
  <!-- Sử dụng biến giao diện tùy chỉnh -->
  <div class="bg-theme-bg text-theme-text">
    <button class="bg-theme-primary">Nút</button>
  </div>

  <!-- Bộ chọn giao diện -->
  <select @change="setTheme($event.target.value)">
    <option value="light">Sáng</option>
    <option value="dark">Tối</option>
    <option value="sepia">Bảo vệ mắt</option>
  </select>
</template>

<script setup>
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}
</script>
```

### Ưu điểm của Tailwind

- **Phát triển nhanh** : utility-first, không cần viết CSS
- **Nhất quán** : hệ thống design tích hợp, giữ phong cách thống nhất
- **tree-shaking** : tự động loại bỏ style không sử dụng
- **RWD friendly** : variant responsive `sm:`, `md:`, `lg:`
- **Variant giao diện** : `dark:`, `hover:`, `focus:` và nhiều variant phong phú

### Nhược điểm

- **HTML dài** : nhiều class, có thể ảnh hưởng khả năng đọc
- **Đường cong học tập** : cần quen với quy tắc đặt tên utility class
- **Tùy chỉnh** : tùy chỉnh sâu cần hiểu cấu hình

---

## Giải pháp 3: Quasar + Pinia + SCSS (kinh nghiệm gần đây)

> **Kinh nghiệm dự án thực tế** : Đây là giải pháp tôi đã sử dụng trong dự án thực tế, tích hợp Quasar Framework, quản lý state Pinia và hệ thống biến SCSS.

### Khái niệm cốt lõi

Thiết kế kiến trúc đa tầng:

1. **Quasar Dark Mode API** - Hỗ trợ giao diện ở cấp framework
2. **Pinia Store** - Quản lý tập trung state giao diện
3. **SessionStorage** - Lưu trữ tùy chọn người dùng
4. **SCSS Variables + Mixin** - Biến giao diện và quản lý style

### Luồng kiến trúc

```
Người dùng nhấp nút chuyển đổi
    ↓
Quasar $q.dark.toggle()
    ↓
Pinia Store cập nhật state
    ↓
Đồng bộ với SessionStorage
    ↓
Chuyển class trên Body (.body--light / .body--dark)
    ↓
Cập nhật CSS Variables
    ↓
UI tự động cập nhật
```

### Cách triển khai

#### 1. Pinia Store (quản lý state)

```typescript
// src/stores/darkModeStore.ts
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // Sử dụng SessionStorage để lưu trữ state
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // Cập nhật state Dark Mode
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

#### 2. Cấu hình Quasar

```javascript
// quasar.config.js
module.exports = configure(function (/* ctx */) {
  return {
    framework: {
      config: {
        dark: 'true', // Bật hỗ trợ Dark Mode
      },
      plugins: ['Notify', 'Loading', 'Dialog'],
    },
  };
});
```

#### 3. Hệ thống biến giao diện SCSS

```scss
// assets/css/_variable.scss

// Định nghĩa ánh xạ biến cho giao diện Light và Dark
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

// Mixin: Áp dụng CSS Variables theo giao diện
@mixin theme-vars($theme) {
  @each $key, $value in map-get($themes, $theme) {
    #{$key}: #{$value};
  }
}

// Mixin: Style riêng cho Light Mode
@mixin light {
  .body--light & {
    @content;
  }
}

// Mixin: Style riêng cho Dark Mode
@mixin dark {
  .body--dark & {
    @content;
  }
}
```

#### 4. Áp dụng giao diện toàn cục

```scss
// src/css/app.scss
@import 'assets/css/_variable.scss';

// Mặc định áp dụng Light Theme
:root {
  @include theme-vars('light');
}

// Dark Mode áp dụng Dark Theme
.body--dark {
  @include theme-vars('dark');
}
```

#### 5. Sử dụng trong component

**Cách A: Sử dụng CSS Variables (khuyên dùng)**

```vue
<template>
  <div class="my-card">
    <h2 class="title">Tiêu đề</h2>
    <p class="content">Nội dung văn bản</p>
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

**Cách B: Sử dụng SCSS Mixin (nâng cao)**

```vue
<template>
  <button class="custom-btn">Nút</button>
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

#### 6. Chức năng chuyển đổi

```vue
<template>
  <button @click="toggleDarkMode" class="theme-toggle">
    <q-icon :name="isDarkMode ? 'light_mode' : 'dark_mode'" />
    {{ isDarkMode ? 'Chuyển sang sáng' : 'Chuyển sang tối' }}
  </button>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { onMounted } from 'vue';
import { useDarkModeStore } from 'stores/darkModeStore';

const $q = useQuasar();
const { isDarkMode, updateIsDarkMode } = useDarkModeStore();

// Chuyển đổi giao diện
const toggleDarkMode = () => {
  $q.dark.toggle(); // Chuyển đổi Quasar
  updateIsDarkMode($q.dark.isActive); // Đồng bộ với Store
};

// Khôi phục tùy chọn người dùng khi tải trang
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

### Ưu điểm

- **Hệ sinh thái hoàn chỉnh** : Giải pháp trọn gói Quasar + Pinia + VueUse
- **Quản lý state** : Pinia quản lý tập trung, dễ test và bảo trì
- **Lưu trữ bền vững** : SessionStorage tự động lưu, không mất khi refresh
- **An toàn kiểu** : Hỗ trợ TypeScript, giảm lỗi
- **Trải nghiệm phát triển** : SCSS Mixin đơn giản hóa phát triển style
- **Hiệu năng tốt** : CSS Variables cập nhật động, không cần tải lại

### Nhược điểm

- **Phụ thuộc framework** : Cần sử dụng Quasar Framework
- **Chi phí học tập** : Cần nắm Quasar, Pinia, SCSS
- **Dung lượng lớn hơn** : Framework hoàn chỉnh nặng hơn CSS thuần

### Best practice

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

### Cách trình bày trong phỏng vấn

> "Trong dự án gần nhất, chúng tôi đã triển khai hệ thống Dark Mode hoàn chỉnh với **Quasar + Pinia + SCSS**:
>
> 1. **Quản lý state** : Quản lý thống nhất state giao diện qua Pinia Store, kết hợp `useSessionStorage` của VueUse để lưu trữ bền vững
> 2. **Hệ thống style** : Sử dụng SCSS Map + Mixin để định nghĩa biến giao diện, áp dụng trong `:root` và `.body--dark`
> 3. **Cơ chế chuyển đổi** : Điều khiển qua API `$q.dark` của Quasar, tự động thêm class tương ứng trên `<body>`
> 4. **Trải nghiệm phát triển** : Cung cấp mixin `@include light` và `@include dark`, giúp phát triển style component trực quan hơn
>
> Giải pháp này hoạt động tốt trong dự án của chúng tôi: chuyển đổi mượt mà, state ổn định, dễ bảo trì."

---

## Giải pháp 4: Chuyển đổi class CSS

### Cách triển khai

```css
/* styles/themes.css */

/* Giao diện sáng */
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

/* Giao diện tối */
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
// Chuyển đổi giao diện
function setTheme(theme) {
  document.body.className = `theme-${theme}`;
  localStorage.setItem('theme', theme);
}
```

### Trường hợp sử dụng

- Cần hỗ trợ IE và trình duyệt cũ
- Sự khác biệt giao diện quá lớn, không phù hợp dùng biến
- Không muốn thêm dependency

---

## Giải pháp 5: File CSS riêng biệt (không khuyên dùng)

### Cách triển khai

```html
<!-- Tải CSS động -->
<link id="theme-stylesheet" rel="stylesheet" href="/styles/theme-light.css" />
```

```javascript
function setTheme(theme) {
  const link = document.getElementById('theme-stylesheet');
  link.href = `/styles/theme-${theme}.css`;
}
```

### Nhược điểm

- **Chi phí tải** : Cần tải lại CSS khi chuyển đổi
- **FOUC** : Có thể xuất hiện nhấp nháy không có style
- **Code trùng lặp** : Style dùng chung cần định nghĩa lại

---

## Tích hợp thiết kế responsive (RWD)

### Tailwind CSS + RWD + Chuyển đổi giao diện

```vue
<template>
  <div
    class="
      /* Style cơ bản */
      p-4 rounded-lg transition-colors

      /* Giao diện sáng */
      bg-white text-gray-900

      /* Giao diện tối */
      dark:bg-gray-800 dark:text-gray-100

      /* RWD: Điện thoại */
      text-sm

      /* RWD: Tablet trở lên */
      md:text-base md:p-6

      /* RWD: Desktop trở lên */
      lg:text-lg lg:p-8

      /* Trạng thái tương tác */
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
      Tiêu đề responsive
    </h2>

    <p class="mt-2 text-gray-700 dark:text-gray-300">Nội dung văn bản</p>

    <!-- Grid responsive -->
    <div
      class="
        grid
        grid-cols-1       /* Điện thoại: 1 cột */
        sm:grid-cols-2    /* Tablet nhỏ: 2 cột */
        md:grid-cols-3    /* Tablet: 3 cột */
        lg:grid-cols-4    /* Desktop: 4 cột */
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
/* Biến cơ bản */
:root {
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --font-size-base: 16px;
}

/* Điều chỉnh khoảng cách cho tablet trở lên */
@media (min-width: 768px) {
  :root {
    --spacing-sm: 0.75rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
  }
}

/* Điều chỉnh font cho desktop trở lên */
@media (min-width: 1024px) {
  :root {
    --font-size-base: 18px;
  }
}

/* Sử dụng biến */
.container {
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}

/* Giao diện tối + RWD */
@media (min-width: 768px) {
  [data-theme='dark'] {
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  }
}
```

---

## Gợi ý tối ưu hiệu năng

### 1. Tránh FOUC (Flash of Unstyled Content)

```html
<!-- Thực thi ngay trong <head>, tránh nhấp nháy -->
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

### 2. Sử dụng prefers-color-scheme

```css
/* Tự động phát hiện giao diện hệ thống */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* Nếu người dùng chưa đặt tùy chọn, theo hệ thống */
    --color-background: #1f2937;
    --color-text: #f9fafb;
  }
}
```

```javascript
// Phát hiện bằng JavaScript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (!localStorage.getItem('theme')) {
  setTheme(prefersDark ? 'dark' : 'light');
}
```

### 3. Chuyển tiếp animation CSS

```css
/* Chuyển tiếp mượt mà */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

/* Hoặc cho phần tử cụ thể */
body,
.card,
.button {
  transition: all 0.3s ease;
}
```

### 4. Giảm Reflow

```css
/* Dùng transform thay vì trực tiếp thay đổi chiều rộng/cao */
.theme-switching {
  transform: scale(1);
  transition: transform 0.3s ease;
}

.theme-switching:hover {
  transform: scale(1.05); /* Tăng tốc GPU */
}
```

---

## Kiến trúc dự án thực tế

### Cấu trúc file

```
src/
├── styles/
│   ├── themes/
│   │   ├── variables.css       # Định nghĩa CSS Variables
│   │   ├── light.css          # Giao diện sáng
│   │   ├── dark.css           # Giao diện tối
│   │   └── sepia.css          # Giao diện bảo vệ mắt
│   ├── base.css               # Style cơ bản
│   └── components/            # Style component
│       ├── button.css
│       └── card.css
├── utils/
│   └── theme.js               # Logic chuyển đổi giao diện
└── components/
    └── ThemeToggle.vue        # Component chuyển đổi giao diện
```

### Best practice

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

    // Lắng nghe thay đổi giao diện hệ thống
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

## Mẫu trả lời phỏng vấn

**Người phỏng vấn: Khi một trang cần hỗ trợ 2 phong cách khác nhau, bạn sắp xếp CSS như thế nào?**

**Cách trả lời A: Thể hiện kinh nghiệm thực tế (khuyên dùng)**

> "Tôi sẽ chọn giải pháp phù hợp nhất dựa trên tech stack của dự án. **Trong dự án gần nhất**, chúng tôi sử dụng **Quasar + Pinia + SCSS**:
>
> **1. Quản lý state (30 giây)**
>
> - Quản lý thống nhất state giao diện qua Pinia Store
> - Kết hợp `useSessionStorage` của VueUse để lưu trữ bền vững
> - Điều khiển giao diện qua API `$q.dark` của Quasar
>
> **2. Hệ thống style (1 phút)**
>
> ```scss
> // Định nghĩa biến giao diện bằng SCSS Map
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
> // Áp dụng vào :root và .body--dark
> :root {
>   @include theme-vars('light');
> }
> .body--dark {
>   @include theme-vars('dark');
> }
> ```
>
> - Component sử dụng `var(--bg-main)` tự động chuyển đổi
> - Cung cấp mixin `@include light` / `@include dark` xử lý style phức tạp
>
> **3. Cơ chế chuyển đổi (30 giây)**
>
> ```typescript
> const toggleTheme = () => {
>   $q.dark.toggle(); // Chuyển đổi Quasar
>   store.updateIsDarkMode($q.dark.isActive); // Đồng bộ Store
> };
> ```
>
> **4. Kết quả thực tế (30 giây)**
>
> - Chuyển đổi mượt mà không nhấp nháy (CSS Variables cập nhật động)
> - State được lưu trữ (giao diện không mất khi refresh trang)
> - Dễ bảo trì (biến giao diện quản lý tập trung)
> - Hiệu suất phát triển cao (Mixin đơn giản hóa phát triển style)"

**Cách trả lời B: Giải pháp chung (dự phòng)**

> "Cho dự án hiện đại tôi khuyên dùng **CSS Variables + Tailwind CSS**:
>
> **1. Thiết kế kiến trúc (30 giây)**
>
> - Sử dụng CSS Variables định nghĩa biến giao diện (màu, khoảng cách, bóng đổ, v.v.)
> - Chuyển đổi giao diện qua thuộc tính `data-theme` trên phần tử gốc
> - Kết hợp variant `dark:` của Tailwind để phát triển nhanh
>
> **2. Điểm triển khai chính (1 phút)**
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
> Khi chuyển đổi bằng JavaScript chỉ cần thay đổi thuộc tính `data-theme`, trình duyệt tự động áp dụng biến tương ứng.
>
> **3. Tích hợp RWD (30 giây)**
>
> ```html
> <div class="text-sm md:text-base lg:text-lg dark:bg-gray-800"></div>
> ```
>
> Có thể xử lý đồng thời RWD và chuyển đổi giao diện.
>
> **4. Best practice (30 giây)**
>
> - Khởi tạo giao diện ngay trong `<head>` để tránh FOUC
> - Dùng `localStorage` lưu tùy chọn người dùng
> - Phát hiện `prefers-color-scheme` để theo giao diện hệ thống"

---

## Câu hỏi mở rộng

**Q1: Nếu cần hỗ trợ IE thì sao?**

A: Sử dụng giải pháp chuyển đổi class CSS, hoặc dùng polyfill [css-vars-ponyfill](https://github.com/jhildenbiddle/css-vars-ponyfill).

**Q2: Làm sao tránh nhấp nháy khi chuyển đổi giao diện?**

A: Thực thi script ngay trong `<head>` HTML để đặt giao diện trước khi trang render.

**Q3: Quản lý nhiều giao diện như thế nào?**

A: Khuyên dùng hệ thống Design Tokens, quản lý thống nhất tất cả biến giao diện, kết hợp đồng bộ với Figma Variables.

**Q4: Làm sao test các giao diện khác nhau?**

A: Sử dụng Storybook kết hợp `storybook-addon-themes`, test trực quan tất cả biến thể giao diện.

---

## Chủ đề liên quan

- [CSS Variables (Custom Properties)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

## Reference

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties Guide](https://css-tricks.com/a-complete-guide-to-custom-properties/)
- [Dark Mode in 5 Minutes](https://web.dev/prefers-color-scheme/)
