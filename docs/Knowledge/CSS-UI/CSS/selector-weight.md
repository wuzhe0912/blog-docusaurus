---
id: selector-weight
title: '[Easy] Selector Specificity'
slug: /selector-weight
tags: [CSS, Quiz, Easy]
---

## 1. How do you calculate selector specificity?

Specificity decides which CSS rule wins when multiple rules target the same element.

A simple mental model:

`inline style` > `ID` > `class/attribute/pseudo-class` > `element/pseudo-element`

## 2. Specificity scoring

Think in columns:

- A: inline style
- B: IDs
- C: classes, attributes, pseudo-classes
- D: element names and pseudo-elements

Compare from left to right.

```html
<div id="app" class="wrapper">Text</div>
```

```css
#app {
  color: blue;
}

.wrapper {
  color: red;
}
```

`#app` wins because ID specificity is higher.

## 3. Common examples

```css
p {}                /* 0-0-0-1 */
.card p {}          /* 0-0-1-1 */
#root .card p {}    /* 0-1-1-1 */
```

## 4. What about `!important`?

`!important` overrides normal cascade order within same origin/layer, but using it everywhere makes CSS hard to maintain.

Prefer:

- Better selector structure
- Lower nesting depth
- Predictable component scope

## 5. Best practices

- Keep specificity low and consistent
- Avoid deep chained selectors
- Prefer class-based styling for reusable UI
- Use utility classes or component scopes to avoid selector wars

## 6. Quick interview answers

### Q1: Does order matter if specificity is equal?

Yes. Later declarations win.

### Q2: Is ID-based styling recommended?

Usually no for scalable UI systems; classes are more reusable.

### Q3: Why avoid frequent `!important`?

It breaks predictable cascade and increases maintenance cost.
