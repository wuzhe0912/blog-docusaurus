---
id: vue3-new-features
title: '[Easy] Vue3 New Features'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> What are the major new features in Vue 3?

Vue 3 introduced multiple important upgrades:

### Major features

1. **Composition API**
2. **Teleport**
3. **Fragment (multiple root nodes)**
4. **Suspense**
5. **Multiple `v-model` bindings**
6. **Better TypeScript support**
7. **Performance improvements** (smaller bundle, faster rendering)

## 2. Teleport

> What is Teleport?

`Teleport` lets you render part of a component to another location in the DOM tree without changing component ownership or logic structure.

### Typical use cases

Modal, Tooltip, Notification, Popover, overlay layers.

```vue
<template>
  <div>
    <button @click="showModal = true">Open Modal</button>

    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Modal Title</h2>
          <p>Modal Content</p>
          <button @click="showModal = false">Close</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

### Why Teleport helps

1. Solves stacking context / z-index issues
2. Avoids clipping by ancestor overflow
3. Keeps component logic colocated while rendering elsewhere

## 3. Fragment (Multiple Root Nodes)

> What is Fragment in Vue 3?

Vue 3 allows a component template to have multiple root nodes.
Unlike React, Vue uses implicit fragments (no extra `<Fragment>` tag needed).

### Vue 2 vs Vue 3

**Vue 2**: single root required.

```vue
<template>
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
</template>
```

**Vue 3**: multiple roots allowed.

```vue
<template>
  <h1>Title</h1>
  <p>Content</p>
</template>
```

### Why Fragment matters

1. Fewer unnecessary wrapper elements
2. Better semantic HTML
3. Shallower DOM tree
4. Cleaner styling and selectors

### Attribute inheritance in multi-root components

With multi-root templates, parent attributes (`class`, `id`, etc.) are not auto-applied to a specific root.
Use `$attrs` manually.

```vue
<!-- Parent -->
<MyComponent class="custom-class" id="my-id" />

<!-- Child -->
<template>
  <div v-bind="$attrs">First root</div>
  <div>Second root</div>
</template>
```

You can control behavior with:

```vue
<script setup>
defineOptions({
  inheritAttrs: false,
});
</script>
```

### Fragment vs React Fragment

| Feature | Vue 3 Fragment | React Fragment |
| --- | --- | --- |
| Syntax | Implicit (no tag needed) | Explicit (`<>` or `<Fragment>`) |
| Key handling | Normal vnode/key rules in lists | Key supported on `<Fragment key=...>` |
| Attr forwarding | Use `$attrs` manually in multi-root | No direct fragment attrs |

## 4. Suspense

> What is Suspense?

`Suspense` is a built-in component for async dependency loading states.
It renders fallback UI while async component/setup resolves.

### Basic usage

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### Typical use cases

1. Async component loading
2. Async `setup()` data requirements
3. Route-level or section-level skeleton UIs

## 5. Multiple v-model

> Multiple `v-model` bindings

Vue 3 supports multiple `v-model` bindings on one component.
Each binding maps to a prop + `update:propName` event.

### Vue 2 vs Vue 3

**Vue 2**: one `v-model` pattern per component.

```vue
<CustomInput v-model="value" />
```

**Vue 3**: multiple named `v-model` bindings.

```vue
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### Component implementation example

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input
      :value="email"
      @input="$emit('update:email', $event.target.value)"
    />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Common Interview Questions

> Common interview questions

### Question 1: when should you use Teleport?

<details>
<summary>Click to view answer</summary>

Use Teleport when visual rendering must escape local DOM constraints:

1. **Modal dialogs** to avoid parent stacking/overflow issues
2. **Tooltips/popovers** that should not be clipped
3. **Global notifications** rendered in a dedicated root container

Avoid Teleport for normal in-flow content.

</details>

### Question 2: benefits of Fragment

<details>
<summary>Click to view answer</summary>

Benefits:

1. fewer wrapper nodes
2. better semantic structure
3. simpler CSS in many layouts
4. less DOM depth and overhead

</details>

### Question 3: multi-root attribute inheritance

<details>
<summary>Click to view answer</summary>

For multi-root components, attrs are not auto-inherited onto a single root.
Handle them explicitly with `$attrs` and optionally `inheritAttrs: false`.

```vue
<template>
  <div v-bind="$attrs">Root A</div>
  <div>Root B</div>
</template>
```

</details>

### Question 4: Fragment in Vue vs React

<details>
<summary>Click to view answer</summary>

Vue uses implicit fragment behavior in templates.
React requires explicit fragment syntax (`<>...</>` or `<Fragment>`).

</details>

### Question 5: Suspense implementation example

<details>
<summary>Click to view answer</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>Loading user profile...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

</details>

## 7. Best Practices

> Best practices

### Recommended

```vue
<!-- 1) Use Teleport for overlays -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2) Keep semantic multi-root templates where appropriate -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3) Wrap async parts with Suspense -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4) Use explicit names for multiple v-model -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### Avoid

```vue
<!-- 1) Do not overuse Teleport for regular content -->
<Teleport to="body">
  <div>Normal content</div>
</Teleport>

<!-- 2) Do not use multi-root just for style; keep logical grouping -->
<template>
  <h1>Title</h1>
  <p>Content</p>
</template>

<!-- 3) Do not ignore async error/loading handling -->
<Suspense>
  <AsyncComponent />
</Suspense>
```

## 8. Interview Summary

> Interview summary

### Quick memory

**Vue 3 key features**:

- Composition API
- Teleport
- Fragment
- Suspense
- Multiple `v-model`

### Sample answer

**Q: What are major Vue 3 features?**

> Composition API for better logic organization and reuse, Teleport for rendering overlays outside local DOM containers, Fragment for multiple root nodes, Suspense for async loading states, multiple `v-model` bindings, and stronger TypeScript/performance improvements.

**Q: What is a practical Teleport use case?**

> Modal/overlay rendering to `body` to avoid clipping and stacking issues, while keeping modal logic inside the original component tree.

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
