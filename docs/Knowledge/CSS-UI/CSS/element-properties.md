---
id: element-properties
title: '[Easy] Element Properties'
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. What are block and inline elements?

### Block elements

Block elements usually start on a new line and expand to available width.

Common examples:

`div`, `section`, `article`, `header`, `footer`, `main`, `nav`, `ul`, `ol`, `li`, `form`.

### Inline elements

Inline elements flow within text and do not start a new line by default.

Common examples:

`span`, `a`, `strong`, `em`, `img`, `label`, `code`.

## 2. What is `inline-block`?

`inline-block` sits inline but keeps block-like sizing behavior.

```css
.tag {
  display: inline-block;
  padding: 4px 8px;
  margin-right: 8px;
}
```

Use it when elements should align horizontally while keeping width/height/padding control.

## 3. What does `* { box-sizing: border-box; }` do?

It changes sizing so declared width/height include `padding` and `border`.

```css
* {
  box-sizing: border-box;
}
```

This makes layout calculations more predictable.

## 4. Quick interview answers

### Q1: Can inline elements set width/height?

Usually no (except replaced elements like `img`). Use `inline-block` or `block` if needed.

### Q2: Can block elements appear inline?

Yes, by changing `display` with CSS.

### Q3: Why is `border-box` popular?

It reduces sizing surprises and simplifies responsive layouts.

## References

- [MDN: Block-level content](https://developer.mozilla.org/en-US/docs/Glossary/Block-level_content)
- [MDN: Inline-level content](https://developer.mozilla.org/en-US/docs/Glossary/Inline-level_content)
- [MDN: box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)
