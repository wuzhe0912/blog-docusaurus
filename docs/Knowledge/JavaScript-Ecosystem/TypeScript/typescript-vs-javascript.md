---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> How is TypeScript related to JavaScript?

TypeScript is a superset of JavaScript that adds static typing and developer tooling.

- All valid JavaScript is valid TypeScript
- TypeScript code is compiled to JavaScript before running
- Type errors are found during development, not only at runtime

## 2. TypeScript vs JavaScript at a glance

| Topic | JavaScript | TypeScript |
| --- | --- | --- |
| Type system | Dynamic | Static + inferred |
| Compile step | Not required | Required (`tsc` or bundler) |
| Error detection | Mostly runtime | Compile time + runtime |
| Refactoring support | Basic | Strong |
| Learning curve | Lower | Higher |

## 3. Example comparison

### JavaScript

```js
function add(a, b) {
  return a + b;
}

console.log(add(1, '2')); // "12" (maybe unintended)
```

### TypeScript

```ts
function add(a: number, b: number): number {
  return a + b;
}

// add(1, '2'); // compile-time error
console.log(add(1, 2));
```

TypeScript helps prevent accidental coercion bugs.

## 4. Compilation flow

1. Write `.ts` or `.tsx`
2. Type check with TypeScript compiler
3. Emit JavaScript
4. Run JavaScript in browser or Node.js

You still ship JavaScript to production.

## 5. Advantages of TypeScript

- Earlier bug detection
- Better autocomplete and IDE navigation
- Safer large-scale refactoring
- Clearer API contracts across teams

## 6. Trade-offs of TypeScript

- Requires setup (`tsconfig`, build pipeline)
- Adds type syntax and concepts
- Can be over-verbose if misused

## 7. When to choose which

Choose JavaScript when:

- Prototype speed is the top priority
- Project scope is small and short-lived

Choose TypeScript when:

- Project size or team size is medium or large
- Long-term maintenance matters
- Public APIs need strong contracts

## 8. Migration strategy from JavaScript

1. Enable TypeScript with `allowJs`
2. Convert high-risk modules first
3. Turn on `strict` gradually
4. Replace `any` with precise types over time

This incremental path minimizes disruption.

## 9. Quick interview answers

### Q1: Is TypeScript executed directly by browsers?

No. Browsers execute JavaScript, so TypeScript must be compiled first.

### Q2: Does TypeScript guarantee zero runtime bugs?

No. It catches many type-related bugs, but runtime logic errors can still happen.

### Q3: Is TypeScript mandatory for React?

No. React works with JavaScript and TypeScript; TypeScript is optional but common in production apps.
