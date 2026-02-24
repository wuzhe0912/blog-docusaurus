---
id: theme-switching
title: '[Medium] Multi-theme Switching Implementation (Реализация переключения тем)'
slug: /theme-switching
tags: [CSS, Quiz, Medium, RWD]
---

## 1. Сценарий на собеседовании

> Продукту необходимо как минимум две визуальные темы (например, светлая и тёмная). Как бы вы спроектировали CSS-архитектуру?

Этот вопрос оценивает:

- Решения по CSS-архитектуре
- Стратегию токенов темы
- Подход к переключению в рантайме
- Производительность и поддерживаемость

## 2. Рекомендуемая стратегия — обзор

| Стратегия | Лучше всего для | Переключение в рантайме | Сложность | Рекомендация |
| --- | --- | --- | --- | --- |
| CSS custom properties | Большинства современных приложений | Да | Средняя | Настоятельно рекомендуется |
| Режим тем утилитарного фреймворка | Стеков с utility-first подходом | Да | Средняя | Рекомендуется |
| Дублированные стили на основе классов | Совместимости с legacy | Да | Высокая | Допустимый запасной вариант |
| Только переменные на этапе сборки (Sass/Less) | Фиксированных брендовых сборок | Нет | Низкая | Не идеален для переключения вживую |

## 3. Основная архитектура: дизайн-токены + CSS-переменные

Определяйте семантические токены вместо жёстко закодированных цветов в компонентах.

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

Используйте токены повсюду:

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

## 4. Реализация переключения темы в рантайме

### Базовый HTML

```html
<html data-theme="light">
  <body>
    <button id="theme-toggle" type="button">Переключить тему</button>
  </body>
</html>
```

### Логика на JavaScript

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

## 5. Предотвращение мигания темы при первом отображении

Примените начальную тему до рендеринга приложения.

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

Разместите этот скрипт в `<head>` перед CSS/JS бандлами, если это возможно.

## 6. Масштабируемая иерархия токенов

Практичная модель токенов:

1. Глобальные примитивы (`--gray-100`, `--blue-500`)
2. Семантические токены (`--text`, `--bg`, `--border`)
3. Токены компонентов (`--btn-bg`, `--card-shadow`)

Пример:

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

Это упрощает управление изменениями на уровне всей системы.

## 7. Требования доступности

- Соблюдайте требования к контрастности (WCAG)
- Обеспечьте видимость состояний фокуса во всех темах
- Не полагайтесь только на цвет для обозначения статуса
- Поддерживайте системные предпочтения (`prefers-color-scheme`)

Полезный медиазапрос:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
```

## 8. Руководство по анимациям и переходам

Переходы между темами могут быть тонкими, но должны избегать тяжёлых перерисовок.

```css
:root,
[data-theme='dark'] {
  transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
}
```

Избегайте анимации больших размытий/теней на каждом элементе при переключении темы.

## 9. Примеры для фреймворков

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

  return <button onClick={onToggle}>Тема: {theme}</button>;
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

## 10. Распространённые ошибки

- Жёсткое кодирование цветов непосредственно в компонентах
- Смешивание семантических и примитивных имён токенов
- Игнорирование различий тем для графиков/блоков кода
- Переключение слишком большого количества классов в глубоких деревьях
- Забывание сохранять предпочтение пользователя

## 11. Чек-лист тестирования

- Тема сохраняется после обновления страницы
- Нет мигания при первом отображении
- Проверки контрастности проходят
- Состояния focus/hover/disabled хорошо видны
- Сторонние компоненты стилизованы единообразно
- Внешний вид на мобильных и десктопных устройствах проверен

## 12. Шаблон ответа для собеседования

> Я использую CSS custom properties с семантическими токенами и переключаю темы с помощью атрибута корневого элемента, такого как `data-theme`. Я инициализирую тему до первого отображения, чтобы избежать мигания, сохраняю предпочтение в localStorage и использую системные предпочтения как запасной вариант. Также я обеспечиваю контрастность и видимость состояний во всех темах. Это делает переключение тем быстрым, поддерживаемым и масштабируемым.

## 13. Быстрые ответы для собеседования

### Q1: Почему выбрать CSS-переменные вместо дублированных правил классов?

Меньше дублирования, гибкость в рантайме и лучшая поддерживаемость.

### Q2: Как избежать начального мигания?

Установите тему в небольшом inline-скрипте перед рендерингом приложения.

### Q3: Должна ли тема быть глобальным состоянием?

Обычно да, потому что от неё зависят многие страницы/компоненты.

### Q4: Могут ли Sass-переменные обрабатывать переключение тем в рантайме?

Сами по себе нет. Sass-переменные разрешаются на этапе сборки.
