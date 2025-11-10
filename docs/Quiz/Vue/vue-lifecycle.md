---
id: vue-lifecycle
title: '[Medium] 📄 Vue Lifecycle Hooks'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Please explain Vue lifecycle hooks (include Vue 2 & Vue 3)

> 請解釋 Vue 的生命週期鉤子（包含 Vue 2 和 Vue 3）

Vue 組件從創建到銷毀會經歷一系列的過程，在這些過程中會自動呼叫特定的函式，這些函式就是「生命週期鉤子」。理解生命週期對於掌握組件的行為非常重要。

### Vue 生命週期圖解

```
建立階段 → 掛載階段 → 更新階段 → 銷毀階段
   ↓          ↓          ↓          ↓
Created    Mounted    Updated   Unmounted
```

### Vue 2 vs Vue 3 生命週期對照表

| Vue 2 (Options API) | Vue 3 (Options API) | Vue 3 (Composition API) | 說明                  |
| ------------------- | ------------------- | ----------------------- | --------------------- |
| `beforeCreate`      | `beforeCreate`      | `setup()`               | 組件實例初始化之前    |
| `created`           | `created`           | `setup()`               | 組件實例創建完成      |
| `beforeMount`       | `beforeMount`       | `onBeforeMount`         | 掛載到 DOM 之前       |
| `mounted`           | `mounted`           | `onMounted`             | 掛載到 DOM 之後       |
| `beforeUpdate`      | `beforeUpdate`      | `onBeforeUpdate`        | 資料更新前            |
| `updated`           | `updated`           | `onUpdated`             | 資料更新後            |
| `beforeDestroy`     | `beforeUnmount`     | `onBeforeUnmount`       | 組件卸載之前          |
| `destroyed`         | `unmounted`         | `onUnmounted`           | 組件卸載之後          |
| `activated`         | `activated`         | `onActivated`           | keep-alive 組件激活時 |
| `deactivated`       | `deactivated`       | `onDeactivated`         | keep-alive 組件停用時 |
| `errorCaptured`     | `errorCaptured`     | `onErrorCaptured`       | 捕獲子組件錯誤時      |

### 1. 建立階段（Creation Phase）

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
    // ❌ 此時 data、methods 都還未初始化
    console.log('beforeCreate');
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // ✅ 此時 data、computed、methods、watch 都已初始化
    console.log('created');
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined（尚未掛載到 DOM）

    // ✅ 適合在這裡發送 API 請求
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

**使用時機：**

- `beforeCreate`：很少使用，通常用於插件開發
- `created`：
  - ✅ 發送 API 請求
  - ✅ 初始化非響應式的資料
  - ✅ 設定事件監聽器
  - ❌ 無法操作 DOM（尚未掛載）

### 2. 掛載階段（Mounting Phase）

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
    // ❌ 此時虛擬 DOM 已建立，但尚未渲染到真實 DOM
    console.log('beforeMount');
    console.log(this.$el); // 存在，但內容是舊的（如果有的話）
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    // ✅ 此時組件已掛載到 DOM，可以操作 DOM 元素
    console.log('mounted');
    console.log(this.$el); // 真實的 DOM 元素
    console.log(this.$refs.myElement); // 可以存取 ref

    // ✅ 適合在這裡操作 DOM
    this.initCanvas();

    // ✅ 適合在這裡使用第三方 DOM 套件
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // 繪製 canvas...
    },

    initChart() {
      // 初始化圖表套件（如 Chart.js, ECharts）
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

**使用時機：**

- `beforeMount`：很少使用
- `mounted`：
  - ✅ 操作 DOM 元素
  - ✅ 初始化第三方 DOM 套件（如圖表、地圖）
  - ✅ 設定需要 DOM 的事件監聽器
  - ✅ 啟動計時器
  - ⚠️ **注意**：子組件的 `mounted` 會在父組件的 `mounted` 之前執行

### 3. 更新階段（Updating Phase）

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>計數：{{ count }}</p>
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
    // ✅ 資料已更新，但 DOM 尚未更新
    console.log('beforeUpdate');
    console.log('data count:', this.count); // 新的值
    console.log('DOM count:', this.$el.querySelector('p').textContent); // 舊的值

    // 可以在這裡存取更新前的 DOM 狀態
  },

  updated() {
    // ✅ 資料和 DOM 都已更新
    console.log('updated');
    console.log('data count:', this.count); // 新的值
    console.log('DOM count:', this.$el.querySelector('p').textContent); // 新的值

    // ⚠️ 注意：不要在這裡修改資料，會導致無限循環
    // this.count++; // ❌ 錯誤！會導致無限更新
  },
};
</script>
```

**使用時機：**

- `beforeUpdate`：需要在 DOM 更新前存取舊的 DOM 狀態
- `updated`：
  - ✅ DOM 更新後需要執行的操作（如重新計算元素尺寸）
  - ❌ **不要在這裡修改資料**，會導致無限更新循環
  - ⚠️ 如果需要在資料變化後執行操作，建議使用 `watch` 或 `nextTick`

### 4. 銷毀階段（Unmounting Phase）

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
    // 設定計時器
    this.timer = setInterval(() => {
      console.log('計時器執行中...');
    }, 1000);

    // 建立 WebSocket 連接
    this.ws = new WebSocket('ws://example.com');
    this.ws.onmessage = (event) => {
      console.log('收到訊息:', event.data);
    };

    // 設定事件監聽器
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  },

  beforeUnmount() {
    // Vue 3 使用 beforeUnmount
    // Vue 2 使用 beforeDestroy
    console.log('beforeUnmount');
    // 組件即將被銷毀，但還可以存取資料和 DOM
  },

  unmounted() {
    // Vue 3 使用 unmounted
    // Vue 2 使用 destroyed
    console.log('unmounted');

    // ✅ 清理計時器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // ✅ 關閉 WebSocket 連接
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // ✅ 移除事件監聽器
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  },

  methods: {
    handleResize() {
      console.log('視窗大小改變');
    },
    handleClick() {
      console.log('點擊事件');
    },
  },
};
</script>
```

**使用時機：**

- `beforeUnmount` / `beforeDestroy`：很少使用
- `unmounted` / `destroyed`：
  - ✅ 清理計時器（`setInterval`、`setTimeout`）
  - ✅ 移除事件監聽器
  - ✅ 關閉 WebSocket 連接
  - ✅ 取消未完成的 API 請求
  - ✅ 清理第三方套件實例

### 5. 特殊生命週期鉤子

#### `activated` / `deactivated` (配合 `<keep-alive>` 使用)

```vue
<template>
  <div>
    <button @click="toggleComponent">切換組件</button>

    <!-- keep-alive 會緩存組件，不會重新創建 -->
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
    console.log('mounted - 只會執行一次');
  },

  activated() {
    console.log('activated - 每次組件被激活時執行');
    // ✅ 適合在這裡重新獲取資料
    this.refreshData();
  },

  deactivated() {
    console.log('deactivated - 每次組件被停用時執行');
    // ✅ 適合在這裡暫停操作（如影片播放）
    this.pauseVideo();
  },

  unmounted() {
    console.log('unmounted - 不會執行（因為被 keep-alive 緩存）');
  },

  methods: {
    refreshData() {
      // 重新獲取資料
    },
    pauseVideo() {
      // 暫停影片播放
    },
  },
};
</script>
```

#### `errorCaptured` (錯誤處理)

```vue
<script>
// ParentComponent.vue
export default {
  errorCaptured(err, instance, info) {
    console.error('捕獲到子組件錯誤:', err);
    console.log('錯誤來源組件:', instance);
    console.log('錯誤資訊:', info);

    // 回傳 false 可以阻止錯誤繼續向上傳播
    return false;
  },
};
</script>
```

### Vue 3 Composition API 的生命週期

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

// setup() 本身相當於 beforeCreate + created
console.log('setup 執行');

onBeforeMount(() => {
  console.log('onBeforeMount');
});

onMounted(() => {
  console.log('onMounted');
  // ✅ 操作 DOM、初始化套件
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
  // ✅ 清理資源
});

onActivated(() => {
  console.log('onActivated');
});

onDeactivated(() => {
  console.log('onDeactivated');
});

onErrorCaptured((err, instance, info) => {
  console.error('錯誤:', err);
  return false;
});
</script>
```

## 2. What's the execution order of parent and child component lifecycle hooks?

> 父子組件的生命週期執行順序是什麼？

這是一個非常重要的面試問題，理解父子組件的生命週期執行順序有助於掌握組件之間的互動。

### 執行順序

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

**記憶點：「創建從外到內，掛載從內到外」**

### 實際範例

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>父組件</h1>
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
    <h2>子組件</h2>
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

### 各階段執行順序

#### 1. 建立和掛載階段

```
1. 父 beforeCreate
2. 父 created
3. 父 beforeMount
4. 子 beforeCreate
5. 子 created
6. 子 beforeMount
7. 子 mounted        ← 子組件先完成掛載
8. 父 mounted        ← 父組件後完成掛載
```

**原因**：父組件需要等待子組件完成掛載後，才能確保整個組件樹已經完整渲染。

#### 2. 更新階段

```
父組件資料變化：
1. 父 beforeUpdate
2. 子 beforeUpdate  ← 如果子組件有使用父組件的資料
3. 子 updated
4. 父 updated

子組件資料變化：
1. 子 beforeUpdate
2. 子 updated
（父組件不會觸發更新）
```

#### 3. 銷毀階段

```
9. 父 beforeUnmount
10. 子 beforeUnmount
11. 子 unmounted     ← 子組件先銷毀
12. 父 unmounted     ← 父組件後銷毀
```

### 多個子組件的情況

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

執行順序：

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

### 為什麼是這個順序？

#### 掛載階段（Mounting）

Vue 的掛載過程類似「深度優先遍歷」：

1. 父組件開始建立
2. 解析模板時發現子組件
3. 先完成子組件的完整掛載
4. 子組件都掛載完成後，父組件才完成掛載

```
父組件準備掛載
    ↓
發現子組件
    ↓
子組件完整掛載（beforeMount → mounted）
    ↓
父組件完成掛載（mounted）
```

#### 銷毀階段（Unmounting）

銷毀順序則是「先通知父組件即將銷毀，再依序銷毀子組件」：

```
父組件準備銷毀（beforeUnmount）
    ↓
通知子組件準備銷毀（beforeUnmount）
    ↓
子組件完成銷毀（unmounted）
    ↓
父組件完成銷毀（unmounted）
```

### 實際應用場景

#### 場景 1：父組件需要等待子組件資料載入完成

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
    // ✅ 此時所有子組件都已掛載完成
    console.log('所有子組件已準備好');
    this.childrenReady = true;
  },
};
</script>
```

#### 場景 2：子組件需要存取父組件提供的資料

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  inject: ['parentData'], // 接收父組件提供的資料

  created() {
    // ✅ 此時可以存取父組件的資料（父組件的 created 已執行）
    console.log('父組件資料:', this.parentData);
  },
};
</script>
```

#### 場景 3：避免在 `mounted` 中存取尚未掛載的子組件

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="child" />
</template>

<script>
export default {
  mounted() {
    // ✅ 此時子組件已掛載，可以安全存取
    this.$refs.child.someMethod();
  },
};
</script>
```

### 常見錯誤

#### 錯誤 1：在父組件的 `created` 中存取子組件的 ref

```vue
<!-- ❌ 錯誤 -->
<script>
export default {
  created() {
    // 此時子組件還未建立
    console.log(this.$refs.child); // undefined
  },
};
</script>

<!-- ✅ 正確 -->
<script>
export default {
  mounted() {
    // 此時子組件已掛載
    console.log(this.$refs.child); // 可以存取
  },
};
</script>
```

#### 錯誤 2：假設子組件會在父組件之前掛載

```vue
<!-- ❌ 錯誤 -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // 假設父組件已掛載（錯誤！）
    this.$parent.someMethod(); // 可能會出錯
  },
};
</script>

<!-- ✅ 正確 -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // 使用 $nextTick 確保父組件也已掛載
    this.$nextTick(() => {
      this.$parent.someMethod();
    });
  },
};
</script>
```

## 3. When should we use each lifecycle hook?

> 我們應該在什麼時候使用各個生命週期鉤子？

這裡整理了各個生命週期鉤子的最佳使用場景。

### 生命週期使用場景總結表

| 生命週期    | 常見用途             | 可存取內容              |
| ----------- | -------------------- | ----------------------- |
| `created`   | API 請求、初始化資料 | ✅ data, methods ❌ DOM |
| `mounted`   | 操作 DOM、初始化套件 | ✅ data, methods, DOM   |
| `updated`   | DOM 更新後的操作     | ✅ 新的 DOM             |
| `unmounted` | 清理資源             | ✅ 清理計時器、事件     |
| `activated` | keep-alive 激活時    | ✅ 重新獲取資料         |

### 實際應用範例

#### 1. `created`：發送 API 請求

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
    // ✅ 適合在這裡發送 API 請求
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

#### 2. `mounted`：初始化第三方套件

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
    // ✅ 適合在這裡初始化需要 DOM 的套件
    this.initChart();
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: { text: '銷售數據' },
        xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: {},
        series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
      });
    },
  },

  unmounted() {
    // ✅ 記得清理圖表實例
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>
```

#### 3. `unmounted`：清理資源

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
    // 啟動計時器
    this.intervalId = setInterval(() => {
      console.log('執行中...');
    }, 1000);

    // 創建 Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      console.log(entries);
    });
    this.observer.observe(this.$el);

    // 監聽全域事件
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    // ✅ 清理計時器
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // ✅ 清理 Observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // ✅ 移除事件監聽器
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      console.log('視窗大小改變');
    },
  },
};
</script>
```

### 記憶技巧

1. **`created`**：「創建完成，可以用資料」→ API 請求
2. **`mounted`**：「掛載完成，可以用 DOM」→ DOM 操作、第三方套件
3. **`updated`**：「更新完成，DOM 已同步」→ DOM 更新後的操作
4. **`unmounted`**：「卸載完成，記得清理」→ 清理資源

## Reference

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Vue 2 Lifecycle Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Vue 3 Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html)
- [Composition API: Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
