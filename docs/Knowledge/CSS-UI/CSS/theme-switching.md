---
id: theme-switching
title: '[Medium] Multi-theme Switching Implementation'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## 1. Interview scenario

> A product needs at least two visual themes (for example, light and dark). How would you design the CSS architecture?

This question evaluates:

- CSS architecture decisions
- Theme token strategy
- Runtime switching approach
- Performance and maintainability

## 2. Recommended strategy at a glance

| Strategy | Best for | Runtime switch | Complexity | Recommendation |
| --- | --- | --- | --- | --- |
| CSS custom properties | Most modern apps | Yes | Medium | Strongly recommended |
| Utility framework theme mode | Utility-first stacks | Yes | Medium | Recommended |
| Class-based duplicated styles | Legacy compatibility | Yes | High | Acceptable fallback |
| Build-time variables only (Sass/Less) | Fixed brand builds | No | Low | Not ideal for live toggle |

## 3. Core architecture: design tokens + CSS variables

Define semantic tokens instead of hard-coded colors in components.

```css
:root {
  --bg: #ffffff;
  --surface: #f9fafb;
  --text: #111827;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --primary: #2563eb;
}

[data-theme='dark'] {
  --bg: #0b1220;
  --surface: #111827;
  --text: #f3f4f6;
  --text-muted: #9ca3af;
  --border: #374151;
  --primary: #60a5fa;
}
```

Consume tokens everywhere:

```css
.page {
  background: var(--bg);
  color: var(--text);
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
}

.button-primary {
  background: var(--primary);
  color: #fff;
}
```

## 4. Runtime theme switch implementation

### HTML baseline

```html
<html data-theme="light">
  <body>
    <button id="theme-toggle" type="button">Toggle theme</button>
  </body>
</html>
```

### JavaScript logic

```js
const STORAGE_KEY = 'theme';
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
}

function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function initTheme() {
  applyTheme(getPreferredTheme());
}

function toggleTheme() {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
}

initTheme();
document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
```

## 5. Prevent theme flash on first paint

Apply initial theme before the app renders.

```html
<script>
  (function () {
    var key = 'theme';
    var saved = localStorage.getItem(key);
    var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved === 'light' || saved === 'dark' ? saved : dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

Place this script in `<head>` before CSS/JS bundles when possible.

## 6. Scalable token layering

A practical token model:

1. Global primitives (`--gray-100`, `--blue-500`)
2. Semantic tokens (`--text`, `--bg`, `--border`)
3. Component tokens (`--btn-bg`, `--card-shadow`)

Example:

```css
:root {
  --gray-50: #f9fafb;
  --gray-900: #111827;
  --blue-600: #2563eb;

  --bg: var(--gray-50);
  --text: var(--gray-900);
  --link: var(--blue-600);
}
```

This keeps system-wide changes manageable.

## 7. Accessibility requirements

- Meet contrast requirements (WCAG)
- Keep focus states visible in all themes
- Do not rely on color alone for status
- Support system preference (`prefers-color-scheme`)

Useful media query:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

## 8. Animation and transition guidance

Theme transitions can be subtle but should avoid heavy repaints.

```css
:root,
[data-theme='dark'] {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}
```

Avoid animating large blur/shadow on every element during theme toggle.

## 9. Framework examples

### React

```tsx
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const initial = saved === 'dark' ? 'dark' : 'light';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  function onToggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }

  return <button onClick={onToggle}>Theme: {theme}</button>;
}
```

### Vue 3

```ts
import { ref, watchEffect } from 'vue';

const theme = ref<'light' | 'dark'>('light');

watchEffect(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
  localStorage.setItem('theme', theme.value);
});
```

## 10. Common mistakes

- Hard-coding colors directly in components
- Mixing semantic and primitive token naming
- Ignoring chart/code-block theme differences
- Toggling too many classes across deep trees
- Forgetting to persist user preference

## 11. Testing checklist

- Theme persists after refresh
- No flash on first paint
- Contrast checks pass
- Focus/hover/disabled states are all clear
- Third-party components are themed consistently
- Mobile and desktop appearance both validated

## 12. Interview-ready answer template

> I use CSS custom properties with semantic tokens and switch themes using a root attribute like `data-theme`. I initialize theme before first paint to avoid flicker, persist preference in localStorage, and fall back to system preference. I also enforce contrast and state visibility across themes. This keeps theme switching fast, maintainable, and scalable.

## 13. Quick interview answers

### Q1: Why choose CSS variables over duplicated class rules?

Less duplication, runtime flexibility, and better maintainability.

### Q2: How do you avoid initial flicker?

Set theme in a small inline script before rendering the app.

### Q3: Should theme be global state?

Usually yes, because many pages/components depend on it.

### Q4: Can Sass variables handle runtime theme switching?

Not by themselves. Sass variables are resolved at build time.
