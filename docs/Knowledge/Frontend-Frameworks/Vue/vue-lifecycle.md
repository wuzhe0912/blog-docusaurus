---
id: vue-lifecycle
title: '[Medium] 📄 Vue Lifecycle Hooks'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Please explain Vue lifecycle hooks (include Vue 2 & Vue 3)

> Explain Vue lifecycle hooks in both Vue 2 and Vue 3.

A Vue component goes through phases from creation to unmount.
Lifecycle hooks are framework callbacks fired at each phase.

### Lifecycle timeline

```text
Creation -> Mounting -> Updating -> Unmounting
   ↓           ↓           ↓           ↓
Created     Mounted     Updated    Unmounted
```

### Vue 2 vs Vue 3 mapping

| Vue 2 (Options) | Vue 3 (Options) | Vue 3 (Composition) | Meaning |
| --- | --- | --- | --- |
| `beforeCreate` | `beforeCreate` | `setup()` | before instance fully initialized |
| `created` | `created` | `setup()` | instance state ready |
| `beforeMount` | `beforeMount` | `onBeforeMount` | before first DOM mount |
| `mounted` | `mounted` | `onMounted` | after first DOM mount |
| `beforeUpdate` | `beforeUpdate` | `onBeforeUpdate` | before reactive update flush |
| `updated` | `updated` | `onUpdated` | after DOM update |
| `beforeDestroy` | `beforeUnmount` | `onBeforeUnmount` | before component teardown |
| `destroyed` | `unmounted` | `onUnmounted` | after teardown |
| `activated` | `activated` | `onActivated` | KeepAlive activated |
| `deactivated` | `deactivated` | `onDeactivated` | KeepAlive deactivated |
| `errorCaptured` | `errorCaptured` | `onErrorCaptured` | capture descendant errors |

### 1) Creation phase

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // data/methods not yet initialized
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // state APIs available, but DOM not mounted yet
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined

    // good place for API requests
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**Typical usage**:

- `created`: API requests, non-DOM initialization
- avoid DOM operations here

### 2) Mounting phase

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return { title: 'Vue Lifecycle' };
  },

  beforeMount() {
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    console.log(this.$refs.myElement); // available

    // DOM-dependent setup
    this.initCanvas();
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // draw...
    },
    initChart() {
      // third-party DOM library initialization
    },
  },
};
</script>
```

**Typical usage**:

- DOM operations
- third-party UI/chart libs
- attaching DOM listeners

### 3) Updating phase

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">Increase</button>
  </div>
</template>

<script>
export default {
  data() {
    return { count: 0 };
  },

  beforeUpdate() {
    // data changed, DOM not flushed yet
  },

  updated() {
    // DOM updated
    // avoid mutating reactive state here to prevent loops
  },
};
</script>
```

**Typical usage**:

- post-DOM-update measurements/reposition
- avoid reactive mutations directly in `updated`

### 4) Unmounting phase

#### `beforeUnmount` / `unmounted` (Vue 3)
#### `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    this.timer = setInterval(() => {}, 1000);
    this.ws = new WebSocket('ws://example.com');
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    if (this.timer) clearInterval(this.timer);
    if (this.ws) this.ws.close();
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {},
  },
};
</script>
```

**Typical usage**:

- clear timers
- remove listeners
- close sockets/subscriptions
- dispose third-party instances

### 5) Special case: KeepAlive

`<KeepAlive>` caches component instances instead of destroying them on switch.

#### Why use it

1. Preserve local state (form input, scroll state)
2. Avoid repeated initialization/API calls
3. Improve tab/page switch UX

#### Example

```vue
<template>
  <KeepAlive include="UserList,ProductList" :max="10">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

### 6) Special lifecycle hooks

#### `activated` / `deactivated` (with KeepAlive)

```vue
<script>
export default {
  mounted() {
    console.log('mounted once');
  },
  activated() {
    // called each time component becomes active from cache
    this.refreshData();
  },
  deactivated() {
    // called each time component is cached/deactivated
    this.pauseTasks();
  },
  methods: {
    refreshData() {},
    pauseTasks() {},
  },
};
</script>
```

#### `errorCaptured`

```vue
<script>
export default {
  errorCaptured(err, instance, info) {
    console.error('captured child error:', err, info);
    return false; // stop upward propagation if needed
  },
};
</script>
```

### Vue 3 Composition API lifecycle

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() acts like beforeCreate + created phase logic

onBeforeMount(() => {});
onMounted(() => {});
onBeforeUpdate(() => {});
onUpdated(() => {});
onBeforeUnmount(() => {});
onUnmounted(() => {});
onActivated(() => {});
onDeactivated(() => {});
onErrorCaptured((err, instance, info) => {
  return false;
});
</script>
```

## 2. What's the execution order of parent and child component lifecycle hooks?

> What is lifecycle execution order for parent and child components?

### Mount order

```text
Parent beforeCreate
→ Parent created
→ Parent beforeMount
→ Child beforeCreate
→ Child created
→ Child beforeMount
→ Child mounted
→ Parent mounted
```

Memory trick: **creation starts outside-in, mounting completes inside-out**.

### Concrete example

```vue
<!-- ParentComponent.vue -->
<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: { ChildComponent },
  beforeCreate() { console.log('1. parent beforeCreate'); },
  created() { console.log('2. parent created'); },
  beforeMount() { console.log('3. parent beforeMount'); },
  mounted() { console.log('8. parent mounted'); },
  beforeUnmount() { console.log('9. parent beforeUnmount'); },
  unmounted() { console.log('12. parent unmounted'); },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  beforeCreate() { console.log('4. child beforeCreate'); },
  created() { console.log('5. child created'); },
  beforeMount() { console.log('6. child beforeMount'); },
  mounted() { console.log('7. child mounted'); },
  beforeUnmount() { console.log('10. child beforeUnmount'); },
  unmounted() { console.log('11. child unmounted'); },
};
</script>
```

### Update order

If parent reactive data affecting child changes:

```text
Parent beforeUpdate
→ Child beforeUpdate
→ Child updated
→ Parent updated
```

If only child-local state changes, parent update hooks are not triggered.

### Unmount order

```text
Parent beforeUnmount
→ Child beforeUnmount
→ Child unmounted
→ Parent unmounted
```

### Why this order

- Mounting is depth-first: parent render discovers children, children finish mount first
- Unmounting notifies parent intent first, then tears down children, then finalizes parent

### Practical implications

1. Accessing child refs is safe in parent `mounted`, not in `created`
2. Child `mounted` may run before parent `mounted`
3. For parent-child readiness coordination, use events/props or `nextTick`

### Common mistakes

1. Accessing `this.$refs.child` in parent `created`
2. Assuming parent is already fully mounted when child `mounted` runs

## 3. When should we use each lifecycle hook?

> When should each lifecycle hook be used?

### Quick usage table

| Hook | Typical use | DOM availability |
| --- | --- | --- |
| `created` / `setup` | API request, state init | No |
| `mounted` / `onMounted` | DOM work, third-party init | Yes |
| `updated` / `onUpdated` | post-update DOM sync | Yes (updated) |
| `unmounted` / `onUnmounted` | cleanup resources | teardown stage |
| `activated` | re-enter cached view | Yes |

### Practical examples

#### 1) `created`: fetch API data

```vue
<script>
export default {
  data() {
    return { users: [], loading: true, error: null };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2) `mounted`: init third-party library

```vue
<template>
  <div ref="chart" style="width: 600px; height: 400px"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return { chartInstance: null };
  },
  mounted() {
    this.chartInstance = echarts.init(this.$refs.chart);
    this.chartInstance.setOption({
      title: { text: 'Sales' },
      xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      yAxis: {},
      series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
    });
  },
  unmounted() {
    if (this.chartInstance) this.chartInstance.dispose();
  },
};
</script>
```

#### 3) `unmounted`: cleanup resources

```vue
<script>
export default {
  data() {
    return { intervalId: null, observer: null };
  },
  mounted() {
    this.intervalId = setInterval(() => {}, 1000);
    this.observer = new IntersectionObserver(() => {});
    this.observer.observe(this.$el);
    window.addEventListener('resize', this.handleResize);
  },
  unmounted() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.observer) this.observer.disconnect();
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {},
  },
};
</script>
```

### Memory tips

1. `created`: state ready, DOM not ready
2. `mounted`: DOM ready
3. `updated`: DOM updated
4. `unmounted`: cleanup everything

## Reference

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Vue 2 Lifecycle Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Vue 3 Lifecycle Guide](https://vuejs.org/guide/essentials/lifecycle.html)
