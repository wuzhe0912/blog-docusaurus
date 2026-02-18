---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> What are `ref` and `reactive`?

`ref` and `reactive` are two core APIs in Vue 3 Composition API for creating reactive state.

### ref

**Definition**: `ref` creates a reactive wrapper for a **primitive value** or **object reference**.

<details>
<summary>Click to expand basic ref example</summary>

```vue
<script setup>
import { ref } from 'vue';

// primitives
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// object also works with ref
const user = ref({
  name: 'John',
  age: 30,
});

// access with .value in JavaScript
console.log(count.value); // 0
count.value++;
</script>
```

</details>

### reactive

**Definition**: `reactive` creates a reactive **object proxy** (not for primitive values directly).

<details>
<summary>Click to expand basic reactive example</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// direct property access
console.log(state.count); // 0
state.count++;
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> Main differences between `ref` and `reactive`

### 1. Supported types

**ref**: works with any type.

```typescript
const count = ref(0); // number
const message = ref('Hello'); // string
const isActive = ref(true); // boolean
const user = ref({ name: 'John' }); // object
const items = ref([1, 2, 3]); // array
```

**reactive**: works with objects (including arrays), not primitives.

```typescript
const state = reactive({ count: 0 }); // object
const list = reactive([1, 2, 3]); // array

const count = reactive(0); // invalid usage
const message = reactive('Hello'); // invalid usage
```

### 2. Access style

**ref**: use `.value` in JavaScript.

<details>
<summary>Click to expand ref access example</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

console.log(count.value);
count.value = 10;
</script>

<template>
  <div>{{ count }}</div>
  <!-- auto-unwrapped in template -->
</template>
```

</details>

**reactive**: direct property access.

<details>
<summary>Click to expand reactive access example</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

console.log(state.count);
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. Reassignment behavior

**ref**: can be reassigned.

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // valid
```

**reactive**: should not be reassigned to a new object variable binding.

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // loses reactivity connection
```

### 4. Destructuring

**ref**: destructuring `ref.value` gives plain values (not reactive).

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // plain values
```

**reactive**: direct destructuring loses reactivity.

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // loses reactivity

import { toRefs } from 'vue';
const refs = toRefs(state);
// refs.count and refs.message keep reactivity
```

## 3. When to use ref vs reactive?

> When should you choose each API?

### Use `ref` when

1. State is primitive.

```typescript
const count = ref(0);
const message = ref('Hello');
```

2. You may replace the whole value/object.

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' };
```

3. You need template refs.

```vue
<template>
  <div ref="container"></div>
</template>
<script setup>
const container = ref(null);
</script>
```

4. You want consistent `.value` style across values.

### Use `reactive` when

1. Managing complex object state.

```typescript
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});
```

2. Grouping related fields together without replacing object identity.

```typescript
const userState = reactive({
  user: null,
  loading: false,
  error: null,
});
```

3. You prefer direct property access for nested structures.

## 4. Common Interview Questions

> Common interview questions

### Question 1: basic differences

Explain outputs and behavior:

```typescript
// case 1: ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// case 2: reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// case 3: reactive reassignment
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>Click to view answer</summary>

```typescript
console.log(count1.value); // 10
console.log(state.count); // 10
console.log(state2.count); // 10 (value exists but no longer reactive)
```

Key points:

- `ref` requires `.value`
- `reactive` uses direct property access
- reassigning `reactive` object binding breaks reactive tracking

</details>

### Question 2: destructuring pitfall

What is wrong here and how to fix it?

```typescript
// case 1: ref destructuring
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// case 2: reactive destructuring
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>Click to view answer</summary>

**Case 1 (`ref`)**:

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // does not update user.value.name

// correct
user.value.name = 'Jane';
// or
user.value = { name: 'Jane', age: 30 };
```

**Case 2 (`reactive`)**:

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // loses reactivity

// correct approach 1
state.count = 10;

// correct approach 2
import { toRefs } from 'vue';
const refs = toRefs(state);
refs.count.value = 10;
```

Summary:

- destructured plain values are not reactive
- use `toRefs` for reactive object destructuring

</details>

### Question 3: choose ref or reactive

Choose API for each scenario:

```typescript
// Scenario 1: counter
const count = ?;

// Scenario 2: form state
const form = ?;

// Scenario 3: user object that may be replaced
const user = ?;

// Scenario 4: template ref
const inputRef = ?;
```

<details>
<summary>Click to view answer</summary>

```typescript
const count = ref(0); // primitive

const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // grouped object state

const user = ref({ name: 'John', age: 30 }); // easier full replacement

const inputRef = ref(null); // template ref must use ref
```

Rule of thumb:

- primitive -> `ref`
- full-object replacement needed -> `ref`
- complex grouped object state -> `reactive`
- template refs -> `ref`

</details>

## 5. Best Practices

> Best practices

### Recommended

```typescript
// 1) primitives with ref
const count = ref(0);
const message = ref('Hello');

// 2) structured object state with reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3) use ref when full replacement is common
const user = ref({ name: 'John' });
user.value = { name: 'Jane' };

// 4) use toRefs when destructuring reactive object
import { toRefs } from 'vue';
const { username, password } = toRefs(formState);
```

### Avoid

```typescript
// 1) do not use reactive for primitives
const count = reactive(0); // invalid

// 2) do not reassign reactive binding
let state = reactive({ count: 0 });
state = { count: 10 }; // breaks tracking

// 3) avoid direct destructuring of reactive when you need reactivity
const { count } = reactive({ count: 0 }); // loses tracking
```

## 6. Interview Summary

> Interview summary

### Quick memory

**ref**:

- any type
- `.value` in JavaScript
- easy full replacement
- auto-unwrapped in template

**reactive**:

- object/array only
- direct property access
- keep object identity
- use `toRefs` when destructuring

**Selection guide**:

- primitive -> `ref`
- replacement-heavy object -> `ref`
- grouped object state -> `reactive`

### Sample answer

**Q: What is the difference between ref and reactive?**

> `ref` wraps a value and is accessed via `.value` in JavaScript, while `reactive` returns a proxy object with direct property access.
> `ref` works with primitives and objects; `reactive` is for objects/arrays.
> Reassigning `ref.value` is fine; reassigning a `reactive` binding breaks tracking.

**Q: When should I use each?**

> Use `ref` for primitives, template refs, and object states that are often replaced as a whole.
> Use `reactive` for complex grouped object state where stable object identity is preferred.

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
