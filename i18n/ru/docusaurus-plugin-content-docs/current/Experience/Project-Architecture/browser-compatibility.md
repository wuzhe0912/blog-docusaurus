---
id: project-architecture-browser-compatibility
title: 'Обеспечение совместимости с браузерами'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Практические стратегии совместимости с браузерами с фокусом на Safari и поведение viewport на мобильных устройствах.

---

## 1. Совместимость единиц viewport

Современные единицы viewport:

- `svh`: small viewport height
- `lvh`: large viewport height
- `dvh`: dynamic viewport height

Если есть поддержка, `dvh` помогает исправить скачки из-за адресной строки в mobile Safari.

Для поддержки устаревших браузеров используйте fallback с расчетом высоты через JavaScript.

## 2. Предотвращение авто-изменения размера текста в iOS Safari

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

Используйте осторожно и проверяйте влияние на доступность.

## 3. Стратегия vendor-префиксов

По умолчанию используйте Autoprefixer и добавляйте ручные префиксы только для особых edge-case'ов.

Рекомендуется:

- Определять browser targets в одном месте
- Явно фиксировать стратегию polyfill
- Проверять критичные флоу в Safari и Android WebView

## Краткое резюме для интервью

> Я обеспечиваю совместимость через многоуровневые fallback'и: сначала современный CSS, затем точечные префиксы и polyfill'ы, и JS-fallback только там, где поведение платформы нестабильно.
