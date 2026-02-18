---
id: css-units
title: '[Medium] CSS Units'
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. What is the difference between `px`, `em`, `rem`, `vw`, and `vh`?

### Quick comparison

| Unit | Type | Relative to | Typical use |
| --- | --- | --- | --- |
| `px` | Absolute-like | CSS pixel | Borders, shadows, fine details |
| `em` | Relative | Element font size (or parent for font-size) | Local spacing/scale |
| `rem` | Relative | Root (`html`) font size | Global typography and spacing |
| `vw` | Relative | 1% viewport width | Fluid width/layout |
| `vh` | Relative | 1% viewport height | Full-height sections |

## 2. Unit behavior with examples

### `px`

```css
.card {
  border: 1px solid #d1d5db;
  border-radius: 8px;
}
```

Use for sharp visual details.

### `em`

```css
.button {
  font-size: 1rem;
  padding: 0.5em 1em;
}
```

Padding scales with this element's font size.

### `rem`

```css
html {
  font-size: 16px;
}

h1 {
  font-size: 2rem; /* 32px */
}
```

Great for consistent sizing across components.

### `vw` and `vh`

```css
.hero {
  min-height: 100vh;
  padding-inline: 5vw;
}
```

Use for viewport-driven layouts.

## 3. Other useful units

### `%`

Relative to parent/reference size.

```css
.container {
  width: 80%;
}
```

### `vmin` and `vmax`

- `1vmin`: 1% of smaller viewport side
- `1vmax`: 1% of larger viewport side

### `ch`

Roughly width of the `0` character. Useful for readable line lengths.

```css
.prose {
  max-width: 65ch;
}
```

## 4. Practical rules of thumb

- Use `rem` for fonts and spacing scale
- Use `px` for borders/hairline effects
- Use `%` for fluid containers
- Use `vw`/`vh` for viewport-driven sections
- Use `em` when you want component-local scaling

## 5. Mobile viewport caveat

On mobile browsers, dynamic address bars can make `100vh` unstable.

Prefer newer units where supported:

- `dvh`: dynamic viewport height
- `svh`: small viewport height
- `lvh`: large viewport height

```css
.full-screen {
  min-height: 100dvh;
}
```

## 6. Quick interview answers

### Q1: Why do many teams prefer `rem` over `px` for typography?

It centralizes scaling from root font-size and improves consistency.

### Q2: Why can nested `em` be tricky?

It compounds based on local font sizes, which can snowball unexpectedly.

### Q3: When is `px` still the right choice?

For exact visual details like borders, shadows, and icon alignment tweaks.
