---
id: performance-lv3-large-data-optimization
title: '[Lv3] Large-data Optimization Strategy: Choosing and Implementing the Right Approach'
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> When a UI needs to handle thousands or millions of records, success depends on choosing the right combination of product, backend, and frontend strategies.

## Interview Scenario

**Q: How do you optimize a page that displays very large datasets?**

A strong answer should include:

1. Requirement validation
2. Trade-off analysis
3. End-to-end architecture
4. Implementation and measurable results

---

## 1. Requirement validation first

Before selecting a technique, ask:

- Do users truly need all rows at once?
- Is real-time update required?
- Is the dominant behavior browsing, searching, or exporting?
- Are row heights fixed or dynamic?
- Do we need bulk select/print/export across all records?

This determines whether pagination, infinite loading, virtualization, or server push is the right fit.

## 2. Strategy matrix

| Strategy | Best for | Strengths | Trade-offs |
| --- | --- | --- | --- |
| Server-side pagination | Search-heavy admin data | Low memory, predictable | Extra navigation overhead |
| Infinite scroll | Feed-style browsing | Smooth exploration | Harder footer/jump actions |
| Virtual scrolling | Very large visible list | Minimal DOM nodes | Complexity with dynamic row height |
| Server filtering/sorting | Large data and strict correctness | Less client CPU | Backend load increases |
| Cache + incremental fetch | Frequent revisit flows | Faster repeat usage | Cache invalidation complexity |

## 3. Recommended architecture pattern

### Data pipeline

1. Query parameters define sort/filter/page
2. Backend returns minimal fields and total count
3. Frontend normalizes and caches by query key
4. UI renders visible rows only

### Rendering

- Prefer virtualization once row count is large
- Memoize row components
- Keep per-row reactive dependencies small

### Interaction

- Debounce search input
- Cancel stale requests
- Preserve scroll position during refresh

## 4. Implementation example (virtualized list + server query)

```ts
const query = reactive({ keyword: '', page: 1, pageSize: 50, sort: 'createdAt:desc' });

const { data, isLoading } = useQuery({
  queryKey: ['records', query],
  queryFn: () => fetchRecords(query),
});
```

```tsx
<VirtualList
  data={data.items}
  itemHeight={48}
  overscan={8}
  renderItem={(row) => <RecordRow row={row} />}
/>
```

## 5. Performance guardrails

- Keep DOM node count stable under heavy scrolling
- Use request cancellation with `AbortController`
- Batch updates to reduce render bursts
- Prefer background computation for expensive transforms

## 6. Metrics to report

- Initial render time
- Time-to-interactive
- Scroll FPS stability
- Memory usage trend
- API latency and request count

## Interview-ready summary

> I start from user behavior, then choose a strategy matrix rather than one fixed solution. For large data views, I typically combine server-side query optimization with virtualization, request cancellation, and measurable performance guardrails.
