---
id: css-box-model
title: '[Easy] Box Model'
slug: /css-box-model
tags: [CSS, Quiz, Easy]
---

## 1. What is the CSS Box Model?

The CSS Box Model describes how an element's size and spacing are calculated.

Every element is made of:

- `content`: the actual text or media
- `padding`: space between content and border
- `border`: the outline around content + padding
- `margin`: outer space between elements

```css
.card {
  width: 240px;
  padding: 16px;
  border: 1px solid #ddd;
  margin: 12px;
}
```

## 2. What does `box-sizing` control?

`box-sizing` defines whether `padding` and `border` are included in the declared width/height.

### `content-box` (default)

Declared width = content only.

Rendered width = `width + left/right padding + left/right border`.

```css
.box {
  box-sizing: content-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

Final width is `100 + 20 + 2 = 122px`.

### `border-box`

Declared width includes content + padding + border.

```css
.box {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #000;
}
```

Final width remains `100px`.

## 3. Why is `border-box` commonly used?

It makes layout math predictable and easier for responsive design.

A common reset:

```css
* {
  box-sizing: border-box;
}
```

Many teams also apply it to pseudo-elements:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## 4. Margin collapse (important interview point)

Vertical margins between block elements can collapse.

```css
.a {
  margin-bottom: 24px;
}

.b {
  margin-top: 16px;
}
```

The gap is `24px`, not `40px`.

Ways to avoid margin collapse:

- Add `padding` or `border` to parent
- Use `display: flow-root` on parent
- Use `flex` or `grid` layout

## 5. Box Model debugging tips

- Use browser DevTools box model panel
- Temporarily add `outline: 1px solid red` to inspect boundaries
- Prefer spacing systems (e.g., 4/8 scale) for consistency

## 6. Quick interview answers

### Q1: What is the difference between margin and padding?

`padding` is inside the border; `margin` is outside the border.

### Q2: Why set `box-sizing: border-box` globally?

It prevents width/height surprises and simplifies layout calculations.

### Q3: Is width always respected?

It can be constrained by `min-width`, `max-width`, parent layout, and content behavior.
