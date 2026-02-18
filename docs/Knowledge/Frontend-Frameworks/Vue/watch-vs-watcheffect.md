---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> What are `watch` and `watchEffect`?

`watch` and `watchEffect` are Vue 3 APIs for reacting to changes in reactive state.

### watch

**Definition**: explicitly watches one or more sources, and runs callback when they change.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// watch a single source
watch(count, (newValue, oldValue) => {
  console.log(`count changed from ${oldValue} to ${newValue}`);
});

// watch multiple sources
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count or message changed');
});
</script>
```

### watchEffect

**Definition**: runs immediately and automatically tracks reactive dependencies used inside its callback.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// auto-tracks count and message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // re-runs when count/message changes
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> Main differences between `watch` and `watchEffect`

### 1. Source declaration

**watch**: explicit source(s).

```typescript
const count = ref(0);
const message = ref('Hello');

watch(count, (newVal, oldVal) => {
  console.log('count changed');
});

watch([count, message], ([newCount, newMessage]) => {
  console.log('count or message changed');
});
```

**watchEffect**: implicit dependency tracking.

```typescript
const count = ref(0);
const message = ref('Hello');

watchEffect(() => {
  console.log(count.value); // tracked automatically
  console.log(message.value); // tracked automatically
});
```

### 2. Execution timing

**watch**: lazy by default; runs only after source changes.

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('run');
});

count.value = 1; // triggers callback
```

**watchEffect**: runs immediately, then re-runs on dependency updates.

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('run'); // immediate first run
  console.log(count.value);
});

count.value = 1; // runs again
```

### 3. Access to old value

**watch**: gives `newValue` and `oldValue`.

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`from ${oldVal} to ${newVal}`);
});
```

**watchEffect**: no direct old value.

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // current value only
});
```

### 4. Stopping watchers

Both return a stop function.

```typescript
const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

stopWatch();
stopEffect();
```

## 3. When to use watch vs watchEffect?

> When should you choose each API?

### Use `watch` when

1. You need explicit sources.

```typescript
watch(userId, (newId) => {
  fetchUser(newId);
});
```

2. You need old value.

```typescript
watch(count, (newVal, oldVal) => {
  console.log(`from ${oldVal} to ${newVal}`);
});
```

3. You need lazy execution.

```typescript
watch(searchQuery, (newQuery) => {
  if (newQuery.length > 2) {
    search(newQuery);
  }
});
```

4. You need fine-grained control (`immediate`, `deep`, etc.).

```typescript
watch(
  () => user.value.id,
  (newId) => {
    fetchUser(newId);
  },
  { immediate: true, deep: true }
);
```

### Use `watchEffect` when

1. You want automatic dependency tracking.

```typescript
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});
```

2. You do not need old value.

```typescript
watchEffect(() => {
  console.log(`current count: ${count.value}`);
});
```

3. You want immediate first run.

```typescript
watchEffect(() => {
  updateChart(count.value, message.value);
});
```

## 4. Common Interview Questions

> Common interview questions

### Question 1: execution order

Explain output and order:

```typescript
const count = ref(0);
const message = ref('Hello');

watch(count, (newVal) => {
  console.log('watch:', newVal);
});

watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>Click to view answer</summary>

`watch` is lazy (no immediate run), but `watchEffect` runs immediately.

Expected sequence:

1. `watchEffect: 0 Hello` (initial run)
2. `watch: 1` (count changed)
3. `watchEffect: 1 Hello` (count changed)
4. `watchEffect: 1 World` (message changed)

Key points:

- `watch` only reacts to explicitly watched source
- `watchEffect` reacts to any reactive dependency used in callback

</details>

### Question 2: old value with watchEffect

How do you access old value when using `watchEffect`?

<details>
<summary>Click to view answer</summary>

`watchEffect` does not provide old value directly.

**Option 1: keep your own previous ref**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`from ${prevCount.value} to ${count.value}`);
  prevCount.value = count.value;
});
```

**Option 2: use watch**

```typescript
watch(count, (newVal, oldVal) => {
  console.log(`from ${oldVal} to ${newVal}`);
});
```

Recommendation: if old value is required, prefer `watch`.

</details>

### Question 3: choose watch or watchEffect

Choose API for each scenario:

```typescript
// Scenario 1: reload user data when userId changes
const userId = ref(1);

// Scenario 2: enable submit when form is valid
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// Scenario 3: search with debounce on keyword changes
const searchQuery = ref('');
```

<details>
<summary>Click to view answer</summary>

**Scenario 1: userId changes** -> `watch`

```typescript
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Scenario 2: form validity side effect** -> `watchEffect`

```typescript
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**Scenario 3: debounced search** -> `watch`

```typescript
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

Selection rule:

- explicit source / old value / control options -> `watch`
- auto dependency tracking + immediate run -> `watchEffect`

</details>

## 5. Best Practices

> Best practices

### Recommended

```typescript
// 1) explicit source -> watch
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2) auto track multiple dependencies -> watchEffect
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3) need old value -> watch
watch(count, (newVal, oldVal) => {
  console.log(`from ${oldVal} to ${newVal}`);
});

// 4) cleanup
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### Avoid

```typescript
// 1) avoid unmanaged async side effects in watchEffect
watchEffect(async () => {
  const data = await fetchData();
  // potential race/leak if not managed
});

// 2) avoid overusing watchEffect
watchEffect(() => {
  console.log(count.value); // watch(count, ...) may be clearer
});

// 3) avoid mutating tracked source in same effect (risk loops)
watchEffect(() => {
  count.value++; // may cause infinite loop
});
```

## 6. Interview Summary

> Interview summary

### Quick memory

**watch**:

- explicit source declaration
- lazy by default
- old value available
- best for controlled scenarios

**watchEffect**:

- automatic dependency tracking
- immediate execution
- no old value
- best for concise reactive side effects

**Rule of thumb**:

- explicit control -> `watch`
- automatic tracking -> `watchEffect`
- old value needed -> `watch`
- immediate initial run -> `watchEffect`

### Sample answer

**Q: What is the difference between watch and watchEffect?**

> Both react to reactive changes in Vue 3. `watch` tracks explicitly declared sources and gives old/new values; it is lazy by default.
> `watchEffect` runs immediately and auto-tracks dependencies used inside the callback, but it does not provide old value.
> Use `watch` for precision and control; use `watchEffect` for automatic dependency collection.

**Q: When should I use each?**

> Use `watch` when you need explicit source control, old values, or options like debounce/deep/immediate.
> Use `watchEffect` when you want an immediate run and automatic tracking across multiple related reactive values.

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
