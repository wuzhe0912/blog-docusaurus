---
id: vue-lifecycle
title: '[Medium] 📄 Vue 生命周期钩子'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Please explain Vue lifecycle hooks (include Vue 2 & Vue 3)

> 请解释 Vue 的生命周期钩子（包含 Vue 2 和 Vue 3）

Vue 组件从创建到销毁会经历一系列的过程，在这些过程中会自动调用特定的函数，这些函数就是「生命周期钩子」。理解生命周期对于掌握组件的行为非常重要。

### Vue 生命周期图解

```
创建阶段 → 挂载阶段 → 更新阶段 → 销毁阶段
   ↓          ↓          ↓          ↓
Created    Mounted    Updated   Unmounted
```

### Vue 2 vs Vue 3 生命周期对照表

| Vue 2 (Options API) | Vue 3 (Options API) | Vue 3 (Composition API) | 说明                  |
| ------------------- | ------------------- | ----------------------- | --------------------- |
| `beforeCreate`      | `beforeCreate`      | `setup()`               | 组件实例初始化之前    |
| `created`           | `created`           | `setup()`               | 组件实例创建完成      |
| `beforeMount`       | `beforeMount`       | `onBeforeMount`         | 挂载到 DOM 之前       |
| `mounted`           | `mounted`           | `onMounted`             | 挂载到 DOM 之后       |
| `beforeUpdate`      | `beforeUpdate`      | `onBeforeUpdate`        | 数据更新前            |
| `updated`           | `updated`           | `onUpdated`             | 数据更新后            |
| `beforeDestroy`     | `beforeUnmount`     | `onBeforeUnmount`       | 组件卸载之前          |
| `destroyed`         | `unmounted`         | `onUnmounted`           | 组件卸载之后          |
| `activated`         | `activated`         | `onActivated`           | keep-alive 组件激活时 |
| `deactivated`       | `deactivated`       | `onDeactivated`         | keep-alive 组件停用时 |
| `errorCaptured`     | `errorCaptured`     | `onErrorCaptured`       | 捕获子组件错误时      |

### 1. 创建阶段（Creation Phase）

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
    // ❌ 此时 data、methods 都还未初始化
    console.log('beforeCreate');
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // ✅ 此时 data、computed、methods、watch 都已初始化
    console.log('created');
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined（尚未挂载到 DOM）

    // ✅ 适合在这里发送 API 请求
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

**使用时机：**

- `beforeCreate`：很少使用，通常用于插件开发
- `created`：
  - ✅ 发送 API 请求
  - ✅ 初始化非响应式的数据
  - ✅ 设置事件监听器
  - ❌ 无法操作 DOM（尚未挂载）

### 2. 挂载阶段（Mounting Phase）

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
    return {
      title: 'Vue Lifecycle',
    };
  },

  beforeMount() {
    // ❌ 此时虚拟 DOM 已创建，但尚未渲染到真实 DOM
    console.log('beforeMount');
    console.log(this.$el); // 存在，但内容是旧的（如果有的话）
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    // ✅ 此时组件已挂载到 DOM，可以操作 DOM 元素
    console.log('mounted');
    console.log(this.$el); // 真实的 DOM 元素
    console.log(this.$refs.myElement); // 可以访问 ref

    // ✅ 适合在这里操作 DOM
    this.initCanvas();

    // ✅ 适合在这里使用第三方 DOM 库
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // 绘制 canvas...
    },

    initChart() {
      // 初始化图表库（如 Chart.js, ECharts）
      new Chart(this.$refs.myCanvas, {
        type: 'bar',
        data: {
          /* ... */
        },
      });
    },
  },
};
</script>
```

**使用时机：**

- `beforeMount`：很少使用
- `mounted`：
  - ✅ 操作 DOM 元素
  - ✅ 初始化第三方 DOM 库（如图表、地图）
  - ✅ 设置需要 DOM 的事件监听器
  - ✅ 启动计时器
  - ⚠️ **注意**：子组件的 `mounted` 会在父组件的 `mounted` 之前执行

### 3. 更新阶段（Updating Phase）

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>计数：{{ count }}</p>
    <button @click="count++">增加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },

  beforeUpdate() {
    // ✅ 数据已更新，但 DOM 尚未更新
    console.log('beforeUpdate');
    console.log('data count:', this.count); // 新的值
    console.log('DOM count:', this.$el.querySelector('p').textContent); // 旧的值

    // 可以在这里访问更新前的 DOM 状态
  },

  updated() {
    // ✅ 数据和 DOM 都已更新
    console.log('updated');
    console.log('data count:', this.count); // 新的值
    console.log('DOM count:', this.$el.querySelector('p').textContent); // 新的值

    // ⚠️ 注意：不要在这里修改数据，会导致无限循环
    // this.count++; // ❌ 错误！会导致无限更新
  },
};
</script>
```

**使用时机：**

- `beforeUpdate`：需要在 DOM 更新前访问旧的 DOM 状态
- `updated`：
  - ✅ DOM 更新后需要执行的操作（如重新计算元素尺寸）
  - ❌ **不要在这里修改数据**，会导致无限更新循环
  - ⚠️ 如果需要在数据变化后执行操作，建议使用 `watch` 或 `nextTick`

### 4. 销毁阶段（Unmounting Phase）

#### `beforeUnmount` / `unmounted` (Vue 3) / `beforeDestroy` / `destroyed` (Vue 2)

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
    // 设置计时器
    this.timer = setInterval(() => {
      console.log('计时器执行中...');
    }, 1000);

    // 创建 WebSocket 连接
    this.ws = new WebSocket('ws://example.com');
    this.ws.onmessage = (event) => {
      console.log('收到消息:', event.data);
    };

    // 设置事件监听器
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  },

  beforeUnmount() {
    // Vue 3 使用 beforeUnmount
    // Vue 2 使用 beforeDestroy
    console.log('beforeUnmount');
    // 组件即将被销毁，但还可以访问数据和 DOM
  },

  unmounted() {
    // Vue 3 使用 unmounted
    // Vue 2 使用 destroyed
    console.log('unmounted');

    // ✅ 清理计时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // ✅ 关闭 WebSocket 连接
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // ✅ 移除事件监听器
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  },

  methods: {
    handleResize() {
      console.log('窗口大小改变');
    },
    handleClick() {
      console.log('点击事件');
    },
  },
};
</script>
```

**使用时机：**

- `beforeUnmount` / `beforeDestroy`：很少使用
- `unmounted` / `destroyed`：
  - ✅ 清理计时器（`setInterval`、`setTimeout`）
  - ✅ 移除事件监听器
  - ✅ 关闭 WebSocket 连接
  - ✅ 取消未完成的 API 请求
  - ✅ 清理第三方库实例

### 5. 特殊组件：KeepAlive

#### 什么是 `<KeepAlive>`？

`<KeepAlive>` 是一个 Vue 的内置组件，主要功能是**缓存组件实例**，避免组件在切换时被销毁。

- **默认行为**：当组件切换（例如路由切换或 `v-if` 切换）时，Vue 会销毁旧组件并创建新组件。
- **KeepAlive 行为**：被 `<KeepAlive>` 包裹的组件在切换时，状态会被保留在内存中，不会被销毁。

#### 核心功能与特性

1. **状态缓存**：保留表单输入内容、滚动位置等。
2. **性能优化**：避免重复渲染和重复的 API 请求。
3. **专属生命周期**：提供 `activated` 和 `deactivated` 两个独有的钩子。

#### 适用场景

1. **多标签页切换**：例如后台管理系统的 Tabs。
2. **列表与详情页切换**：从列表页进入详情页后返回，希望能保留列表的滚动位置和筛选条件。
3. **复杂表单**：填写到一半切换到其他页面查看数据，返回时表单内容不应丢失。

#### 使用示例

```vue
<template>
  <KeepAlive include="UserList,ProductList">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

- `include`：只有名称匹配的组件会被缓存。
- `exclude`：名称匹配的组件**不会**被缓存。
- `max`：最多缓存多少个组件实例。

### 6. 特殊生命周期钩子

#### `activated` / `deactivated` (配合 `<KeepAlive>` 使用)

```vue
<template>
  <div>
    <button @click="toggleComponent">切换组件</button>

    <!-- keep-alive 会缓存组件，不会重新创建 -->
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script>
// ChildComponent.vue
export default {
  name: 'ChildComponent',

  mounted() {
    console.log('mounted - 只会执行一次');
  },

  activated() {
    console.log('activated - 每次组件被激活时执行');
    // ✅ 适合在这里重新获取数据
    this.refreshData();
  },

  deactivated() {
    console.log('deactivated - 每次组件被停用时执行');
    // ✅ 适合在这里暂停操作（如视频播放）
    this.pauseVideo();
  },

  unmounted() {
    console.log('unmounted - 不会执行（因为被 keep-alive 缓存）');
  },

  methods: {
    refreshData() {
      // 重新获取数据
    },
    pauseVideo() {
      // 暂停视频播放
    },
  },
};
</script>
```

#### `errorCaptured` (错误处理)

```vue
<script>
// ParentComponent.vue
export default {
  errorCaptured(err, instance, info) {
    console.error('捕获到子组件错误:', err);
    console.log('错误来源组件:', instance);
    console.log('错误信息:', info);

    // 返回 false 可以阻止错误继续向上传播
    return false;
  },
};
</script>
```

### Vue 3 Composition API 的生命周期

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

// setup() 本身相当于 beforeCreate + created
console.log('setup 执行');

onBeforeMount(() => {
  console.log('onBeforeMount');
});

onMounted(() => {
  console.log('onMounted');
  // ✅ 操作 DOM、初始化库
});

onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
});

onUpdated(() => {
  console.log('onUpdated');
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
});

onUnmounted(() => {
  console.log('onUnmounted');
  // ✅ 清理资源
});

onActivated(() => {
  console.log('onActivated');
});

onDeactivated(() => {
  console.log('onDeactivated');
});

onErrorCaptured((err, instance, info) => {
  console.error('错误:', err);
  return false;
});
</script>
```

## 2. What's the execution order of parent and child component lifecycle hooks?

> 父子组件的生命周期执行顺序是什么？

这是一个非常重要的面试问题，理解父子组件的生命周期执行顺序有助于掌握组件之间的交互。

### 执行顺序

```
父 beforeCreate
→ 父 created
→ 父 beforeMount
→ 子 beforeCreate
→ 子 created
→ 子 beforeMount
→ 子 mounted
→ 父 mounted
```

**记忆点：「创建从外到内，挂载从内到外」**

### 实际示例

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>父组件</h1>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentComponent',
  components: { ChildComponent },

  beforeCreate() {
    console.log('1. 父 beforeCreate');
  },
  created() {
    console.log('2. 父 created');
  },
  beforeMount() {
    console.log('3. 父 beforeMount');
  },
  mounted() {
    console.log('8. 父 mounted');
  },
  beforeUpdate() {
    console.log('父 beforeUpdate');
  },
  updated() {
    console.log('父 updated');
  },
  beforeUnmount() {
    console.log('9. 父 beforeUnmount');
  },
  unmounted() {
    console.log('12. 父 unmounted');
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>子组件</h2>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',

  beforeCreate() {
    console.log('4. 子 beforeCreate');
  },
  created() {
    console.log('5. 子 created');
  },
  beforeMount() {
    console.log('6. 子 beforeMount');
  },
  mounted() {
    console.log('7. 子 mounted');
  },
  beforeUpdate() {
    console.log('子 beforeUpdate');
  },
  updated() {
    console.log('子 updated');
  },
  beforeUnmount() {
    console.log('10. 子 beforeUnmount');
  },
  unmounted() {
    console.log('11. 子 unmounted');
  },
};
</script>
```

### 各阶段执行顺序

#### 1. 创建和挂载阶段

```
1. 父 beforeCreate
2. 父 created
3. 父 beforeMount
4. 子 beforeCreate
5. 子 created
6. 子 beforeMount
7. 子 mounted        ← 子组件先完成挂载
8. 父 mounted        ← 父组件后完成挂载
```

**原因**：父组件需要等待子组件完成挂载后，才能确保整个组件树已经完整渲染。

#### 2. 更新阶段

```
父组件数据变化：
1. 父 beforeUpdate
2. 子 beforeUpdate  ← 如果子组件有使用父组件的数据
3. 子 updated
4. 父 updated

子组件数据变化：
1. 子 beforeUpdate
2. 子 updated
（父组件不会触发更新）
```

#### 3. 销毁阶段

```
9. 父 beforeUnmount
10. 子 beforeUnmount
11. 子 unmounted     ← 子组件先销毁
12. 父 unmounted     ← 父组件后销毁
```

### 多个子组件的情况

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-a />
    <child-b />
    <child-c />
  </div>
</template>
```

执行顺序：

```
1. 父 beforeCreate
2. 父 created
3. 父 beforeMount
4. 子A beforeCreate
5. 子A created
6. 子A beforeMount
7. 子B beforeCreate
8. 子B created
9. 子B beforeMount
10. 子C beforeCreate
11. 子C created
12. 子C beforeMount
13. 子A mounted
14. 子B mounted
15. 子C mounted
16. 父 mounted
```

### 为什么是这个顺序？

#### 挂载阶段（Mounting）

Vue 的挂载过程类似「深度优先遍历」：

1. 父组件开始创建
2. 解析模板时发现子组件
3. 先完成子组件的完整挂载
4. 子组件都挂载完成后，父组件才完成挂载

```
父组件准备挂载
    ↓
发现子组件
    ↓
子组件完整挂载（beforeMount → mounted）
    ↓
父组件完成挂载（mounted）
```

#### 销毁阶段（Unmounting）

销毁顺序则是「先通知父组件即将销毁，再依序销毁子组件」：

```
父组件准备销毁（beforeUnmount）
    ↓
通知子组件准备销毁（beforeUnmount）
    ↓
子组件完成销毁（unmounted）
    ↓
父组件完成销毁（unmounted）
```

### 实际应用场景

#### 场景 1：父组件需要等待子组件数据加载完成

```vue
<!-- ParentComponent.vue -->
<script>
export default {
  data() {
    return {
      childrenReady: false,
    };
  },

  mounted() {
    // ✅ 此时所有子组件都已挂载完成
    console.log('所有子组件已准备好');
    this.childrenReady = true;
  },
};
</script>
```

#### 场景 2：子组件需要访问父组件提供的数据

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  inject: ['parentData'], // 接收父组件提供的数据

  created() {
    // ✅ 此时可以访问父组件的数据（父组件的 created 已执行）
    console.log('父组件数据:', this.parentData);
  },
};
</script>
```

#### 场景 3：避免在 `mounted` 中访问尚未挂载的子组件

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="child" />
</template>

<script>
export default {
  mounted() {
    // ✅ 此时子组件已挂载，可以安全访问
    this.$refs.child.someMethod();
  },
};
</script>
```

### 常见错误

#### 错误 1：在父组件的 `created` 中访问子组件的 ref

```vue
<!-- ❌ 错误 -->
<script>
export default {
  created() {
    // 此时子组件还未创建
    console.log(this.$refs.child); // undefined
  },
};
</script>

<!-- ✅ 正确 -->
<script>
export default {
  mounted() {
    // 此时子组件已挂载
    console.log(this.$refs.child); // 可以访问
  },
};
</script>
```

#### 错误 2：假设子组件会在父组件之前挂载

```vue
<!-- ❌ 错误 -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // 假设父组件已挂载（错误！）
    this.$parent.someMethod(); // 可能会出错
  },
};
</script>

<!-- ✅ 正确 -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // 使用 $nextTick 确保父组件也已挂载
    this.$nextTick(() => {
      this.$parent.someMethod();
    });
  },
};
</script>
```

## 3. When should we use each lifecycle hook?

> 我们应该在什么时候使用各个生命周期钩子？

这里整理了各个生命周期钩子的最佳使用场景。

### 生命周期使用场景总结表

| 生命周期    | 常见用途             | 可访问内容              |
| ----------- | -------------------- | ----------------------- |
| `created`   | API 请求、初始化数据 | ✅ data, methods ❌ DOM |
| `mounted`   | 操作 DOM、初始化库   | ✅ data, methods, DOM   |
| `updated`   | DOM 更新后的操作     | ✅ 新的 DOM             |
| `unmounted` | 清理资源             | ✅ 清理计时器、事件     |
| `activated` | keep-alive 激活时    | ✅ 重新获取数据         |

### 实际应用示例

#### 1. `created`：发送 API 请求

```vue
<script>
export default {
  data() {
    return {
      users: [],
      loading: true,
      error: null,
    };
  },

  created() {
    // ✅ 适合在这里发送 API 请求
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

#### 2. `mounted`：初始化第三方库

```vue
<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartInstance: null,
    };
  },

  mounted() {
    // ✅ 适合在这里初始化需要 DOM 的库
    this.initChart();
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: { text: '销售数据' },
        xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: {},
        series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
      });
    },
  },

  unmounted() {
    // ✅ 记得清理图表实例
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>
```

#### 3. `unmounted`：清理资源

```vue
<script>
export default {
  data() {
    return {
      intervalId: null,
      observer: null,
    };
  },

  mounted() {
    // 启动计时器
    this.intervalId = setInterval(() => {
      console.log('执行中...');
    }, 1000);

    // 创建 Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      console.log(entries);
    });
    this.observer.observe(this.$el);

    // 监听全局事件
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    // ✅ 清理计时器
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // ✅ 清理 Observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // ✅ 移除事件监听器
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      console.log('窗口大小改变');
    },
  },
};
</script>
```

### 记忆技巧

1. **`created`**：「创建完成，可以用数据」→ API 请求
2. **`mounted`**：「挂载完成，可以用 DOM」→ DOM 操作、第三方库
3. **`updated`**：「更新完成，DOM 已同步」→ DOM 更新后的操作
4. **`unmounted`**：「卸载完成，记得清理」→ 清理资源

## Reference

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Vue 2 Lifecycle Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Vue 3 Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html)
- [Composition API: Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
