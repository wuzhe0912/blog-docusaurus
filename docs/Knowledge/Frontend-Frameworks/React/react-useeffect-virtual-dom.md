---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect and Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> What does `useEffect` do in React?

`useEffect` runs side effects after React commits UI updates.

Typical side effects:

- Fetching remote data
- Subscribing to browser events
- Syncing with APIs like `document.title` or `localStorage`
- Starting and cleaning timers

```tsx
import { useEffect, useState } from 'react';

export default function CounterTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <button type="button" onClick={() => setCount((v) => v + 1)}>
      Click {count}
    </button>
  );
}
```

## 2. How does the dependency array work?

### No dependency array

Runs after every render.

```tsx
useEffect(() => {
  console.log('runs after every render');
});
```

### Empty dependency array `[]`

Runs once on mount and cleanup on unmount.

```tsx
useEffect(() => {
  console.log('mount only');
  return () => console.log('unmount cleanup');
}, []);
```

### Specific dependencies

Runs on mount and whenever one of those values changes.

```tsx
useEffect(() => {
  console.log('query changed:', query);
}, [query]);
```

## 3. Why cleanup matters

Return a function from `useEffect` to release resources.

```tsx
useEffect(() => {
  const onResize = () => console.log(window.innerWidth);
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
  };
}, []);
```

Without cleanup, you can leak listeners, timers, or stale async work.

## 4. Common `useEffect` mistakes

### 1) Infinite re-renders

```tsx
// bad: updates state every render
useEffect(() => {
  setCount((v) => v + 1);
});
```

Fix by adding the right dependency array or moving logic elsewhere.

### 2) Missing dependencies

If you use a variable inside effect, include it in dependencies unless intentionally stable.

### 3) Stale closures

Effects capture values from the render that created them. Use refs or dependency updates when needed.

### 4) Doing derived calculations in effect

If a value can be computed directly from props/state, prefer `useMemo` or plain computation over `useEffect`.

## 5. What is the Virtual DOM?

The Virtual DOM is an in-memory representation of UI. React compares the previous and next virtual trees, then updates only necessary real DOM parts.

### Why it helps

- Reduces manual DOM updates
- Gives predictable UI updates from state
- Works with reconciliation heuristics for efficiency

It is not always "free"; creating and comparing trees still has cost.

## 6. Reconciliation in simple terms

When state changes:

1. React builds a new virtual tree
2. React diffs it with the previous tree
3. React commits minimal real DOM changes

Keys in lists are crucial because they help React match old and new nodes correctly.

```tsx
{items.map((item) => (
  <li key={item.id}>{item.label}</li>
))}
```

Stable keys prevent incorrect reuse and unnecessary remounts.

## 7. Relationship between `useEffect` and Virtual DOM

- Virtual DOM diffing happens during render/reconciliation
- `useEffect` runs after commit phase
- So `useEffect` does not block painting in most cases

If you must read/write layout synchronously before paint, use `useLayoutEffect` carefully.

## 8. Practical patterns

### Data fetch with cancellation guard

```tsx
useEffect(() => {
  let cancelled = false;

  async function load() {
    const res = await fetch('/api/user');
    const data = await res.json();
    if (!cancelled) setUser(data);
  }

  load();

  return () => {
    cancelled = true;
  };
}, []);
```

### Extract reusable effect logic into custom hooks

```tsx
function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

## 9. Quick interview answers

### Q1: Is `useEffect` equivalent to class lifecycle methods?

Conceptually yes for side effects, but the mental model is "after render" with dependency-driven reruns.

### Q2: Does Virtual DOM mean React updates are always fast?

Not always. Performance still depends on component structure, render frequency, memoization, and key stability.

### Q3: When should I avoid `useEffect`?

Avoid it for pure derived values and event handlers that do not require external synchronization.
