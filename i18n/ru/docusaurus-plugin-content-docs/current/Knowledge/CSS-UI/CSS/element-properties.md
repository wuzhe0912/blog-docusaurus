---
id: element-properties
title: '[Easy] Element Properties (Свойства элементов)'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. Что такое block и inline элементы?

### Block элементы

Block элементы обычно начинаются с новой строки и расширяются на всю доступную ширину.

Распространённые примеры:

`div`, `section`, `article`, `header`, `footer`, `main`, `nav`, `ul`, `ol`, `li`, `form`.

### Inline элементы

Inline элементы располагаются внутри текста и по умолчанию не начинают новую строку.

Распространённые примеры:

`span`, `a`, `strong`, `em`, `img`, `label`, `code`.

## 2. Что такое `inline-block`?

`inline-block` располагается в строке, но сохраняет блочное поведение при определении размеров.

```css
.tag {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 8px;
}
```

Используйте его, когда элементы должны выстраиваться горизонтально, сохраняя при этом контроль над width/height/padding.

## 3. Что делает `* { box-sizing: border-box; }`?

Это изменяет расчёт размеров так, что объявленные width/height включают `padding` и `border`.

```css
* {
  box-sizing: border-box;
}
```

Это делает расчёты макета более предсказуемыми.

## 4. Быстрые ответы для собеседования

### Q1: Могут ли inline элементы задавать width/height?

Обычно нет (кроме замещаемых элементов, таких как `img`). При необходимости используйте `inline-block` или `block`.

### Q2: Могут ли block элементы отображаться inline?

Да, путём изменения `display` через CSS.

### Q3: Почему `border-box` так популярен?

Он устраняет неожиданности с размерами и упрощает адаптивные макеты.

## Ссылки

- [MDN: Block-level content](https://developer.mozilla.org/en-US/docs/Glossary/Block-level_content)
- [MDN: Inline-level content](https://developer.mozilla.org/en-US/docs/Glossary/Inline-level_content)
- [MDN: box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)
