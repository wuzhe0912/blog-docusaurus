---
id: css-pseudo-elements
title: '[Easy] Pseudo-elements (Псевдоэлементы)'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## 1. Что такое псевдоэлементы?

Псевдоэлементы стилизуют определённую часть элемента или создают виртуальное содержимое до/после него.

Они используют синтаксис с двойным двоеточием:

- `::before`
- `::after`
- `::first-letter`
- `::first-line`
- `::selection`

## 2. `::before` и `::after`

Это самые распространённые псевдоэлементы.

```css
.link::after {
  content: ' (внешняя)';
  color: #6b7280;
}

.badge::before {
  content: 'NEW';
  margin-right: 8px;
  background: #111827;
  color: #fff;
  padding: 2px 6px;
  border-radius: 999px;
}
```

Примечания:

- `content` обязателен (может быть пустой строкой)
- Они являются частью рендеринга, а не реальными узлами DOM
- Их можно позиционировать и стилизовать как обычные элементы

## 3. Псевдоэлементы для текста

### `::first-letter`

```css
.article p::first-letter {
  font-size: 2rem;
  font-weight: 700;
}
```

### `::first-line`

```css
.article p::first-line {
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
```

### `::selection`

```css
::selection {
  background: #fef08a;
  color: #111827;
}
```

## 4. Псевдоэлементы для форм и списков

### `::placeholder`

```css
input::placeholder {
  color: #9ca3af;
}
```

### `::marker`

```css
li::marker {
  color: #2563eb;
  font-weight: 700;
}
```

### `::file-selector-button`

```css
input[type='file']::file-selector-button {
  border: 0;
  background: #2563eb;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
}
```

## 5. Псевдоэлемент vs псевдокласс

- Псевдокласс (`:hover`, `:focus`) нацелен на состояние
- Псевдоэлемент (`::before`, `::after`) нацелен на виртуальную часть

## 6. Лучшие практики

- Не размещайте критически важное семантическое содержимое только в `::before/::after`
- Оставляйте декоративное содержимое декоративным
- Проверяйте доступность и поведение экранных дикторов
- Избегайте чрезмерного использования генерируемого содержимого для бизнес-логики

## 7. Быстрые ответы для собеседования

### Q1: Почему использовать `::before` вместо дополнительного HTML?

Для чисто декоративного UI это уменьшает засорение DOM.

### Q2: Может ли JavaScript напрямую обращаться к псевдоэлементам?

Нет, как к узлам DOM; вы стилизуете их через CSS-правила.

### Q3: Почему двойное двоеточие?

CSS3 стандартизировал псевдоэлементы с `::`, чтобы отличать их от псевдоклассов.
