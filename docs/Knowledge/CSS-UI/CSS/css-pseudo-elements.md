---
id: css-pseudo-elements
title: '[Easy] Pseudo-elements'
slug: /css-pseudo-elements
tags: [CSS, Quiz, Easy]
---

## 1. What are pseudo-elements?

Pseudo-elements style a specific part of an element or create virtual content before/after it.

They use double-colon syntax:

- `::before`
- `::after`
- `::first-letter`
- `::first-line`
- `::selection`

## 2. `::before` and `::after`

These are the most common pseudo-elements.

```css
.link::after {
  content: ' (external)';
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

Notes:

- `content` is required (can be empty string)
- They are part of rendering, not real DOM nodes
- They can be positioned and styled like regular elements

## 3. Text-related pseudo-elements

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

## 4. Form and list pseudo-elements

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

## 5. Pseudo-element vs pseudo-class

- Pseudo-class (`:hover`, `:focus`) targets a state
- Pseudo-element (`::before`, `::after`) targets a virtual part

## 6. Best practices

- Do not place critical semantic content only in `::before/::after`
- Keep decorative content decorative
- Test accessibility and screen reader behavior
- Avoid overusing generated content for business logic

## 7. Quick interview answers

### Q1: Why use `::before` instead of extra HTML?

For purely decorative UI, it reduces DOM noise.

### Q2: Can JavaScript select pseudo-elements directly?

Not as DOM nodes; you style them via CSS rules.

### Q3: Why double colon?

CSS3 standardized pseudo-elements with `::` to distinguish from pseudo-classes.
