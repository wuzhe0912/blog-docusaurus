---
id: vue-basic-api
title: '[Medium] 📄 Vue Basic & API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> Describe Vue core principles and strengths.

### Core principles

Vue is a progressive JavaScript framework. Its core concepts include:

#### 1. Virtual DOM

Vue uses virtual DOM diffing to update only changed parts of the real DOM.

```js
// simplified virtual DOM concept
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. Reactive data binding

Reactive data updates UI automatically. With form bindings (`v-model`), UI input can also update state.

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue');
</script>
```

#### 3. Component-based architecture

UI is split into reusable, testable components with isolated concerns.

```vue
<!-- Button.vue -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const handleClick = () => emit('click');
</script>
```

#### 4. Lifecycle hooks

Hooks let you run logic at creation/mount/update/unmount times.

```vue
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  console.log('Component mounted');
});

onUpdated(() => {
  console.log('Component updated');
});

onUnmounted(() => {
  console.log('Component unmounted');
});
</script>
```

#### 5. Directive system

Vue directives provide declarative UI logic (`v-if`, `v-for`, `v-bind`, `v-model`, etc.).

```vue
<template>
  <div v-if="isVisible">Visible content</div>

  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <img :src="imageUrl" :alt="imageAlt" />

  <input v-model="username" />
</template>
```

#### 6. Template syntax

Templates support interpolation and expressions while keeping markup readable.

```vue
<template>
  <div>
    <p>{{ message }}</p>
    <p>{{ count + 1 }}</p>
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Vue strengths (often compared with React)

#### 1. Lower onboarding cost

Single-file components (`template/script/style`) are intuitive for many teams.

#### 2. Built-in declarative directives

Common UI tasks are concise with directives.

#### 3. Easy two-way form binding

`v-model` offers a first-class pattern for input synchronization.

#### 4. Clear template/logic separation

Some teams prefer template-first structure over JSX-heavy patterns.

#### 5. Cohesive official ecosystem

Vue Router + Pinia + tooling integration are well-aligned.

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> Explain usage of `v-model`, `v-bind`, and `v-html`.

### `v-model`: two-way binding for form controls

```vue
<template>
  <div>
    <input v-model="message" />
    <p>Message: {{ message }}</p>

    <input type="checkbox" v-model="checked" />
    <p>Checked: {{ checked }}</p>

    <select v-model="selected">
      <option value="A">Option A</option>
      <option value="B">Option B</option>
    </select>
    <p>Selected: {{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      selected: 'A',
    };
  },
};
</script>
```

#### `v-model` modifiers

```vue
<input v-model.lazy="msg" />
<input v-model.number="age" type="number" />
<input v-model.trim="msg" />
```

### `v-bind`: dynamic attribute binding

```vue
<template>
  <div>
    <div :class="{ active: isActive, 'text-danger': hasError }">Dynamic class</div>

    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">Dynamic style</div>

    <img :src="imageUrl" :alt="imageAlt" />

    <a :href="linkUrl">Go to link</a>

    <div :data-id="userId" :data-name="userName"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      textColor: 'red',
      fontSize: 16,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Image description',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### `v-bind` shorthand

```vue
<img v-bind:src="imageUrl" />
<img :src="imageUrl" />
<div v-bind="objectOfAttrs"></div>
```

### `v-html`: render raw HTML string

```vue
<template>
  <div>
    <p>{{ rawHtml }}</p>
    <p v-html="rawHtml"></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">Red text</span>',
    };
  },
};
</script>
```

#### ⚠️ Security warning

Never use `v-html` directly on untrusted user input (XSS risk).

```vue
<!-- unsafe -->
<div v-html="userProvidedContent"></div>

<!-- safer: sanitized content -->
<div v-html="sanitizedHtml"></div>
```

#### Safer approach with sanitizer

```vue
<script>
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      userInput: '<img src=x onerror=alert("XSS")>',
    };
  },
  computed: {
    sanitizedHtml() {
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### Quick comparison

| Directive | Purpose | Shorthand | Example |
| --- | --- | --- | --- |
| `v-model` | Two-way form binding | None | `<input v-model="msg">` |
| `v-bind` | One-way attribute binding | `:` | `<img :src="url">` |
| `v-html` | Render raw HTML | None | `<div v-html="html"></div>` |

## 3. How to access HTML elements (Template Refs)?

> How to manipulate HTML elements in Vue (for example focus input)?

Use template refs instead of `document.querySelector` in components.

### Options API (Vue 2 / Vue 3)

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      this.$refs.inputElement.focus();
    },
  },
  mounted() {
    console.log(this.$refs.inputElement);
  },
};
</script>
```

### Composition API (Vue 3)

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const inputElement = ref(null);

const focusInput = () => {
  inputElement.value?.focus();
};

onMounted(() => {
  console.log(inputElement.value);
});
</script>
```

Notes:

- ref name in template should match script variable
- access after mount (`onMounted` / `mounted`)
- inside `v-for`, refs become arrays

## 4. Please explain the difference between `v-show` and `v-if`

> Explain differences between `v-show` and `v-if`.

### Similarity

Both control visibility based on conditions.

```vue
<template>
  <div v-if="isVisible">Using v-if</div>
  <div v-show="isVisible">Using v-show</div>
</template>
```

### Differences

#### 1) DOM behavior

- `v-if`: mount/unmount node
- `v-show`: always mounted; toggles CSS `display`

#### 2) Performance profile

- `v-if`: lower initial cost when false, higher toggle cost
- `v-show`: higher initial cost, lower toggle cost

#### 3) Lifecycle impact

- `v-if` triggers full child lifecycle on toggle
- `v-show` does not unmount; no mount/unmount on toggle

#### 4) Initial render cost

For heavy components initially hidden:

- `v-if="false"`: component not rendered
- `v-show="false"`: component rendered but hidden

#### 5) Directive combinations

- `v-if` supports `v-else-if` / `v-else`
- `v-show` does not

### When to use each

#### Use `v-if` when

1. condition changes rarely
2. initial false should avoid rendering cost
3. you need conditional branches with `v-else`
4. mount/unmount side effects are desired

#### Use `v-show` when

1. visibility toggles frequently
2. component should stay mounted to preserve internal state
3. lifecycle remounting is unnecessary

### Summary table

| Feature | `v-if` | `v-show` |
| --- | --- | --- |
| Initial cost | Lower (when false) | Higher (always renders) |
| Toggle cost | Higher | Lower |
| Lifecycle on toggle | Yes | No |
| Best for | Rare toggles | Frequent toggles |

### Memory tip

- `v-if`: "render only when needed"
- `v-show`: "render once, hide/show via CSS"

## 5. What's the difference between `computed` and `watch`?

> What is the difference between `computed` and `watch`?

Both react to state changes but solve different problems.

### `computed`

#### Core characteristics

1. derives new data from existing reactive state
2. cached until dependencies change
3. synchronous and return-value oriented
4. directly usable in template

#### Typical use cases

```vue
<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const email = ref('JOHN@EXAMPLE.COM');
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);
const searchText = ref('');
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
]);

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
const emailLowerCase = computed(() => email.value.toLowerCase());
const cartTotal = computed(() =>
  cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
);
const filteredItems = computed(() =>
  !searchText.value
    ? items.value
    : items.value.filter((item) =>
        item.name.toLowerCase().includes(searchText.value.toLowerCase())
      )
);
</script>
```

#### Caching advantage

```vue
<script setup>
import { computed, ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, index) => index));

const expensiveComputed = computed(() => {
  console.log('computed runs only when dependency changes');
  return items.value.reduce((sum, item) => sum + item, 0);
});

const expensiveMethod = () => {
  console.log('method runs every call');
  return items.value.reduce((sum, item) => sum + item, 0);
};
</script>
```

#### Getter + setter form

```vue
<script setup>
import { computed, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    const names = newValue.split(' ');
    firstName.value = names[0] ?? '';
    lastName.value = names[names.length - 1] ?? '';
  },
});
</script>
```

### `watch`

#### Core characteristics

1. explicitly watches source(s)
2. intended for side effects
3. supports async workflows
4. can access `newValue` and `oldValue`

#### Typical use cases

```vue
<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);

const username = ref('');
const usernameError = ref('');

const content = ref('');
const isSaving = ref(false);
const lastSaved = ref(null);

let searchTimer = null;
let saveTimer = null;

// 1) debounce search
watch(searchQuery, (newQuery, oldQuery) => {
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// 2) validation side effect
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = 'Username must be at least 3 characters';
  } else if (newUsername.length > 20) {
    usernameError.value = 'Username must be at most 20 characters';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value =
      'Username can only include letters, numbers, and underscore';
  } else {
    usernameError.value = '';
  }
});

// 3) autosave side effect
watch(content, (newContent) => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    isSaving.value = true;
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content: newContent }),
      });
      lastSaved.value = new Date().toLocaleTimeString();
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### `watch` options

```vue
<script setup>
import { ref, watch } from 'vue';

const user = ref({
  name: 'John',
  profile: { age: 30, city: 'Taipei' },
});
const items = ref([1, 2, 3]);

// immediate: run once right away
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`Name changed from ${oldName} to ${newName}`);
  },
  { immediate: true }
);

// deep: track nested mutations
watch(
  user,
  (newUser) => {
    console.log('nested user object changed', newUser);
  },
  { deep: true }
);

// flush: control timing (pre/post/sync)
watch(
  items,
  () => {
    console.log('items changed');
  },
  { flush: 'post' }
);
</script>
```

#### Watch multiple sources

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Name changed from ${oldFirst} ${oldLast} to ${newFirst} ${newLast}`);
});
</script>
```

### `computed` vs `watch`

| Feature | computed | watch |
| --- | --- | --- |
| Primary goal | derive value | side effect on change |
| Return value | required | optional/none |
| Cache | yes | no |
| Dependency tracking | automatic | explicit source |
| Async side effects | no | yes |
| Old/new values | no | yes |
| Template direct use | yes | no |

### Rule of thumb

- **`computed` calculates data**
- **`watch` performs actions**

### Correct/incorrect comparison

#### Incorrect ❌

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const fullName = ref('');

watch(firstName, (newFirst) => {
  fullName.value = `${newFirst} ${lastName.value}`;
});

watch(lastName, (newLast) => {
  fullName.value = `${firstName.value} ${newLast}`;
});
</script>
```

#### Correct ✅

```vue
<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
</script>
```

### Practice: calculate `x * y`

Given `x = 0`, `y = 5`, and a button increments `x` by 1 each click.

#### Solution A: `computed` (recommended)

```vue
<template>
  <div>
    <p>X: {{ x }}, Y: {{ y }}</p>
    <p>Result (X * Y): {{ result }}</p>
    <button @click="x++">Increment X</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const x = ref(0);
const y = ref(5);

const result = computed(() => x.value * y.value);
</script>
```

#### Solution B: `watch` (works but more verbose)

```vue
<script setup>
import { ref, watch } from 'vue';

const x = ref(0);
const y = ref(5);
const result = ref(0);

watch(
  [x, y],
  ([newX, newY]) => {
    result.value = newX * newY;
  },
  { immediate: true }
);
</script>
```

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
