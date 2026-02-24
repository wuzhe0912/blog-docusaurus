---
id: css-box-model
title: '[Easy] Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## 1. Что такое CSS Box Model?

CSS Box Model описывает, как рассчитываются размеры и отступы элемента.

Каждый элемент состоит из:

- `content`: непосредственно текст или медиа
- `padding`: пространство между содержимым и рамкой
- `border`: обводка вокруг содержимого + padding
- `margin`: внешнее пространство между элементами

```css
.card {
  width: 240px;
  padding: 16px;
  border: 1px solid #ddd;
  margin: 12px;
}
```

## 2. Что контролирует `box-sizing`?

`box-sizing` определяет, включаются ли `padding` и `border` в объявленные width/height.

### `content-box` (по умолчанию)

Объявленная ширина = только content.

Отрендеренная ширина = `width + левый/правый padding + левый/правый border`.

```css
.box {
  box-sizing: content-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

Итоговая ширина составляет `100 + 20 + 2 = 122px`.

### `border-box`

Объявленная ширина включает content + padding + border.

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

Итоговая ширина остаётся `100px`.

## 3. Почему `border-box` часто используется?

Это делает расчёты макета предсказуемыми и упрощает адаптивный дизайн.

Распространённый сброс:

```css
* {
  box-sizing: border-box;
}
```

Многие команды также применяют его к псевдоэлементам:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## 4. Схлопывание margin (важный момент на собеседовании)

Вертикальные margin между блочными элементами могут схлопываться.

```css
.a {
  margin-bottom: 24px;
}

.b {
  margin-top: 16px;
}
```

Зазор составит `24px`, а не `40px`.

Способы избежать схлопывания margin:

- Добавить `padding` или `border` родительскому элементу
- Использовать `display: flow-root` у родителя
- Использовать `flex` или `grid` макет

## 5. Советы по отладке Box Model

- Используйте панель Box Model в DevTools браузера
- Временно добавьте `outline: 1px solid red` для проверки границ
- Предпочитайте системы отступов (например, шкала 4/8) для единообразия

## 6. Быстрые ответы для собеседования

### Q1: В чём разница между margin и padding?

`padding` находится внутри рамки; `margin` — снаружи.

### Q2: Зачем устанавливать `box-sizing: border-box` глобально?

Это предотвращает неожиданности с width/height и упрощает расчёты макета.

### Q3: Всегда ли соблюдается width?

Он может быть ограничен `min-width`, `max-width`, макетом родителя и поведением содержимого.
