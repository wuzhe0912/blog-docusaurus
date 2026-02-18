---
id: performance-lv3-virtual-scroll
title: '[Lv3] Virtual Scrolling: Rendering Large Lists Efficiently'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Virtual scrolling keeps DOM size small by rendering only the visible window plus a buffer.

---

## Situation

Large tables with frequent updates can generate tens of thousands of DOM nodes, causing:

- Slow initial render
- Scroll stutter
- High memory usage
- Expensive updates during real-time events

## Core idea

Instead of rendering all rows, render only:

- Visible rows
- Small overscan before and after viewport

As scroll position changes, recycle row containers and update displayed data window.

## Basic implementation (fixed row height)

```ts
const rowHeight = 48;
const viewportHeight = 480;
const visibleCount = Math.ceil(viewportHeight / rowHeight);

const startIndex = Math.floor(scrollTop / rowHeight);
const endIndex = startIndex + visibleCount + 6; // overscan
```

```tsx
<div style={{ height: totalRows * rowHeight }}>
  <div style={{ transform: `translateY(${startIndex * rowHeight}px)` }}>
    {rows.slice(startIndex, endIndex).map(renderRow)}
  </div>
</div>
```

## Variable row height considerations

For dynamic content:

- Measure row heights lazily
- Maintain prefix-sum offsets
- Use binary search to map `scrollTop` to index

If row heights vary heavily, library support is usually safer.

## Interaction pitfalls and fixes

- Keep stable keys to prevent unnecessary remount
- Memoize row components
- Debounce heavy side effects from scroll events
- Preserve scroll anchor when list updates

## When to avoid virtual scroll

- Small datasets (complexity may not be worth it)
- Scenarios requiring all DOM nodes for browser-native operations
- Highly irregular layouts that are difficult to measure

## Interview-ready summary

> I apply virtual scrolling when row count is high and rendering cost dominates. The key is windowed rendering with overscan, stable keys, and careful update strategy so scroll remains smooth under frequent data changes.
