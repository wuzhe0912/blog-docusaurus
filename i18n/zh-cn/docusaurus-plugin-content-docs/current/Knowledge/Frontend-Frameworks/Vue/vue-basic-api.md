---
id: vue-basic-api
title: '[Medium] 📄 Vue 基础与 API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> 请描述 Vue 框架的核心原理和优势

### 核心原理

Vue 是一个渐进式的 JavaScript 框架，其核心原理包含以下几个重要概念：

#### 1. 虚拟 DOM（Virtual DOM）

使用虚拟 DOM 来提升性能。它只会更新有变化的 DOM 节点，而不是重新渲染整个 DOM Tree。通过 diff 算法比较新旧虚拟 DOM 的差异，只针对差异部分进行实际 DOM 操作。

```js
// 虚拟 DOM 概念示意
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. 数据双向绑定（Two-way Data Binding）

使用双向数据绑定，当模型（Model）更改时，视图（View）会自动更新，反之亦然。这让开发者不需要手动操作 DOM，只需关注数据的变化。

```vue
<!-- Vue 3 推荐写法：<script setup> -->
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue');
</script>
```

<details>
<summary>Options API 写法</summary>

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },
};
</script>
```

</details>

#### 3. 组件化（Component-based）

将整个应用拆分成一个个组件，意味着复用性提升，这对维护开发会更加省工。每个组件都有自己的状态、样式和逻辑，可以独立开发和测试。

```vue
<!-- Button.vue - Vue 3 <script setup> -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>
```

#### 4. 生命周期（Lifecycle Hooks）

有自己的生命周期，当数据发生变化时，会触发相应的生命周期钩子，这样就可以在特定的生命周期中，做出相应的操作。

```vue
<!-- Vue 3 <script setup> 写法 -->
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  // 组件挂载后执行
  console.log('Component mounted!');
});

onUpdated(() => {
  // 数据更新后执行
  console.log('Component updated!');
});

onUnmounted(() => {
  // 组件卸载后执行
  console.log('Component unmounted!');
});
</script>
```

#### 5. 指令系统（Directives）

提供了一些常用的指令，例如 `v-if`、`v-for`、`v-bind`、`v-model` 等，可以让开发者更快速地开发。

```vue
<template>
  <!-- 条件渲染 -->
  <div v-if="isVisible">显示内容</div>

  <!-- 列表渲染 -->
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <!-- 属性绑定 -->
  <img :src="imageUrl" :alt="imageAlt" />

  <!-- 双向绑定 -->
  <input v-model="username" />
</template>
```

#### 6. 模板语法（Template Syntax）

使用 template 来编写 HTML，允许将数据通过插值的方式，直接渲染到 template 中。

```vue
<template>
  <div>
    <!-- 文字插值 -->
    <p>{{ message }}</p>

    <!-- 表达式 -->
    <p>{{ count + 1 }}</p>

    <!-- 方法调用 -->
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Vue 的独有优势（和 React 相比）

#### 1. 学习曲线较低

对团队成员彼此程度的掌控落差不会太大，同时在书写风格上，由官方统一规定，避免过于自由奔放，同时对不同项目的维护也能更快上手。

```vue
<!-- Vue 的单文件组件结构清晰 -->
<template>
  <!-- HTML 模板 -->
</template>

<script>
// JavaScript 逻辑
</script>

<style>
/* CSS 样式 */
</style>
```

#### 2. 拥有自己的独特指令语法

虽然这点可能见仁见智，但 Vue 的指令系统提供了更直观的方式来处理常见的 UI 逻辑：

```vue
<!-- Vue 指令 -->
<div v-if="isLoggedIn">欢迎回来</div>
<button @click="handleClick">点击</button>

<!-- React JSX -->
<div>{isLoggedIn && '欢迎回来'}</div>
<button onClick="{handleClick}">点击</button>
```

#### 3. 数据双向绑定更容易实现

因为有自己的指令，所以开发者实现数据双向绑定可以非常容易（`v-model`），而 React 虽然也能实现类似的功能，但没有 Vue 来得直觉。

```vue
<!-- Vue 双向绑定 -->
<input v-model="username" />

<!-- React 需要手动处理 -->
<input value={username} onChange={(e) => setUsername(e.target.value)} />
```

#### 4. 模板和逻辑分离

React 的 JSX 仍为部分开发者所诟病，在部分开发场景下，将逻辑和 UI 进行分离会显得更易阅读与维护。

```vue
<!-- Vue：结构清晰 -->
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: 'John',
        email: 'john@example.com',
      },
    };
  },
};
</script>
```

#### 5. 官方生态系统完整

Vue 官方提供了完整的解决方案（Vue Router、Vuex/Pinia、Vue CLI），不需要在众多第三方包中选择。

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> 请解释 `v-model`、`v-bind` 和 `v-html` 的使用方式

### `v-model`：数据双向绑定

当改变数据的同时，随即驱动改变 template 上渲染的内容，反之改变 template 的内容，也会更新数据。

```vue
<template>
  <div>
    <!-- 文字输入框 -->
    <input v-model="message" />
    <p>输入的内容：{{ message }}</p>

    <!-- 复选框 -->
    <input type="checkbox" v-model="checked" />
    <p>是否勾选：{{ checked }}</p>

    <!-- 选项列表 -->
    <select v-model="selected">
      <option value="A">选项 A</option>
      <option value="B">选项 B</option>
    </select>
    <p>选择的选项：{{ selected }}</p>
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

#### `v-model` 的修饰符

```vue
<!-- .lazy：改为在 change 事件后更新 -->
<input v-model.lazy="msg" />

<!-- .number：自动转为数字 -->
<input v-model.number="age" type="number" />

<!-- .trim：自动过滤首尾空白字符 -->
<input v-model.trim="msg" />
```

### `v-bind`：动态绑定属性

常见于绑定 class 或链接、图片等。当通过 `v-bind` 绑定 class 后，可以通过数据变动，来决定该 class 样式是否被绑定，同理 API 返回的图片路径、链接网址，也能通过绑定的形式来维持动态更新。

```vue
<template>
  <div>
    <!-- 绑定 class（可以简写为 :class） -->
    <div :class="{ active: isActive, 'text-danger': hasError }">动态 class</div>

    <!-- 绑定 style -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">动态样式</div>

    <!-- 绑定图片路径 -->
    <img :src="imageUrl" :alt="imageAlt" />

    <!-- 绑定链接 -->
    <a :href="linkUrl">前往链接</a>

    <!-- 绑定自定义属性 -->
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
      imageAlt: '图片描述',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### `v-bind` 的简写

```vue
<!-- 完整写法 -->
<img v-bind:src="imageUrl" />

<!-- 简写 -->
<img :src="imageUrl" />

<!-- 绑定多个属性 -->
<div v-bind="objectOfAttrs"></div>
```

### `v-html`：渲染 HTML 字符串

如果数据返回的内容中带有 HTML 的标签时，可以通过这个指令来渲染，例如显示 Markdown 语法又或是对方直接返回含有 `<img>` 标签的图片路径。

```vue
<template>
  <div>
    <!-- 普通插值：会显示 HTML 标签 -->
    <p>{{ rawHtml }}</p>
    <!-- 输出：<span style="color: red">红色文字</span> -->

    <!-- v-html：会渲染 HTML -->
    <p v-html="rawHtml"></p>
    <!-- 输出：红色文字（实际渲染为红色） -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">红色文字</span>',
    };
  },
};
</script>
```

#### ⚠️ 安全性警告

**千万不要对用户提供的内容使用 `v-html`**，这会导致 XSS（跨站脚本攻击）漏洞！

```vue
<!-- ❌ 危险：用户可以注入恶意脚本 -->
<div v-html="userProvidedContent"></div>

<!-- ✅ 安全：只用于可信任的内容 -->
<div v-html="markdownRenderedContent"></div>
```

#### 安全的替代方案

```vue
<template>
  <div>
    <!-- 使用库进行 HTML 净化 -->
    <div v-html="sanitizedHtml"></div>
  </div>
</template>

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
      // 使用 DOMPurify 清理 HTML
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### 三者比较总结

| 指令      | 用途             | 简写 | 示例                        |
| --------- | ---------------- | ---- | --------------------------- |
| `v-model` | 双向绑定表单元素 | 无   | `<input v-model="msg">`     |
| `v-bind`  | 单向绑定属性     | `:`  | `<img :src="url">`          |
| `v-html`  | 渲染 HTML 字符串 | 无   | `<div v-html="html"></div>` |

## 3. How to access HTML elements (Template Refs)?

> Vue 若要操作 HTML 元素，例如获取 input 元素并让其聚焦 (focus) 该如何使用？

在 Vue 中，我们不建议使用 `document.querySelector` 来获取 DOM 元素，而是使用 **Template Refs**。

### Options API (Vue 2 / Vue 3)

使用 `ref` 属性在模板中标记元素，然后通过 `this.$refs` 访问。

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
      // 访问 DOM 元素
      this.$refs.inputElement.focus();
    },
  },
  mounted() {
    // 确保组件挂载后再访问
    console.log(this.$refs.inputElement);
  },
};
</script>
```

### Composition API (Vue 3)

在 `<script setup>` 中，我们声明一个同名的 `ref` 变量来获取元素。

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. 声明一个与 template ref 同名的变量，初始值为 null
const inputElement = ref(null);

const focusInput = () => {
  // 2. 通过 .value 访问 DOM
  inputElement.value?.focus();
};

onMounted(() => {
  // 3. 确保组件挂载后再访问
  console.log(inputElement.value);
});
</script>
```

**注意**：

- 变量名称必须与 template 中的 `ref` 属性值完全一致。
- 必须在组件挂载 (`onMounted`) 后才能访问到 DOM 元素，否则会是 `null`。
- 如果是用在 `v-for` 循环中，ref 会是一个数组。

## 4. Please explain the difference between `v-show` and `v-if`

> 请解释 `v-show` 和 `v-if` 的区别

### 相同点（Similarities）

两者都是用于操作 DOM 元素的显示与隐藏，根据条件的不同，决定是否显示内容。

```vue
<template>
  <!-- 当 isVisible 为 true 时，都会显示内容 -->
  <div v-if="isVisible">使用 v-if</div>
  <div v-show="isVisible">使用 v-show</div>
</template>
```

### 相异点（Differences）

#### 1. DOM 操作方式不同

```vue
<template>
  <div>
    <!-- v-show：通过 CSS display 属性控制 -->
    <div v-show="false">这个元素仍存在于 DOM 中，只是 display: none</div>

    <!-- v-if：直接从 DOM 中移除或新增 -->
    <div v-if="false">这个元素不会出现在 DOM 中</div>
  </div>
</template>
```

实际渲染结果：

```html
<!-- v-show 渲染结果 -->
<div style="display: none;">这个元素仍存在于 DOM 中，只是 display: none</div>

<!-- v-if 渲染结果：false 时完全不存在 -->
<!-- 没有任何 DOM 节点 -->
```

#### 2. 性能差异

**`v-show`**：

- ✅ 初次渲染开销较大（元素一定会被创建）
- ✅ 切换开销较小（只改变 CSS）
- ✅ 适合**频繁切换**的场景

**`v-if`**：

- ✅ 初次渲染开销较小（条件为 false 时不渲染）
- ❌ 切换开销较大（需要销毁/重建元素）
- ✅ 适合**条件不常改变**的场景

```vue
<template>
  <div>
    <!-- 频繁切换：使用 v-show -->
    <button @click="toggleModal">切换弹窗</button>
    <div v-show="showModal" class="modal">
      弹窗内容（频繁开关，使用 v-show 性能更好）
    </div>

    <!-- 不常切换：使用 v-if -->
    <div v-if="userRole === 'admin'" class="admin-panel">
      管理员面板（登录后几乎不变，使用 v-if）
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      userRole: 'user',
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
  },
};
</script>
```

#### 3. 生命周期触发

**`v-if`**：

- 会触发组件的**完整生命周期**
- 条件为 false 时，会执行 `unmounted` 钩子
- 条件为 true 时，会执行 `mounted` 钩子

```vue
<template>
  <child-component v-if="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('组件已挂载'); // v-if 从 false 变 true 时会执行
  },
  unmounted() {
    console.log('组件已卸载'); // v-if 从 true 变 false 时会执行
  },
};
</script>
```

**`v-show`**：

- **不会触发**组件的生命周期
- 组件始终保持挂载状态
- 只是通过 CSS 隐藏

```vue
<template>
  <child-component v-show="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('组件已挂载'); // 只在第一次渲染时执行一次
  },
  unmounted() {
    console.log('组件已卸载'); // 不会执行（除非父组件被销毁）
  },
};
</script>
```

#### 4. 初始渲染成本

```vue
<template>
  <div>
    <!-- v-if：初始为 false 时，完全不渲染 -->
    <heavy-component v-if="false" />

    <!-- v-show：初始为 false 时，仍会渲染但隐藏 -->
    <heavy-component v-show="false" />
  </div>
</template>
```

如果 `heavy-component` 是一个很重的组件：

- `v-if="false"`：初始加载更快（不渲染）
- `v-show="false"`：初始加载较慢（会渲染，只是隐藏）

#### 5. 与其他指令搭配

`v-if` 可以搭配 `v-else-if` 和 `v-else`：

```vue
<template>
  <div>
    <div v-if="type === 'A'">类型 A</div>
    <div v-else-if="type === 'B'">类型 B</div>
    <div v-else>其他类型</div>
  </div>
</template>
```

`v-show` 无法搭配 `v-else`：

```vue
<!-- ❌ 错误：v-show 不能使用 v-else -->
<div v-show="type === 'A'">类型 A</div>
<div v-else>其他类型</div>

<!-- ✅ 正确：需要分别设置条件 -->
<div v-show="type === 'A'">类型 A</div>
<div v-show="type !== 'A'">其他类型</div>
```

### computed 与 watch 的使用建议

#### 使用 `v-if` 的情境

1. ✅ 条件很少改变
2. ✅ 初始条件为 false，且可能永远不会变成 true
3. ✅ 需要配合 `v-else-if` 或 `v-else` 使用
4. ✅ 组件内有需要清理的资源（如计时器、事件监听）

```vue
<template>
  <!-- 权限控制：登录后几乎不变 -->
  <admin-panel v-if="isAdmin" />

  <!-- 路由相关：页面切换时才改变 -->
  <home-page v-if="currentRoute === 'home'" />
  <about-page v-else-if="currentRoute === 'about'" />
</template>
```

#### 使用 `v-show` 的情境

1. ✅ 需要频繁切换显示状态
2. ✅ 组件初始化成本高，希望保留状态
3. ✅ 不需要触发生命周期钩子

```vue
<template>
  <!-- Tab 切换：用户经常切换 -->
  <div v-show="activeTab === 'profile'">个人资料</div>
  <div v-show="activeTab === 'settings'">设置</div>

  <!-- 弹窗：频繁开关 -->
  <modal v-show="isModalVisible" />

  <!-- 加载动画：频繁显示/隐藏 -->
  <loading-spinner v-show="isLoading" />
</template>
```

### 性能比较总结

| 特性         | v-if                      | v-show           |
| ------------ | ------------------------- | ---------------- |
| 初始渲染开销 | 小（条件为 false 不渲染） | 大（一定会渲染） |
| 切换开销     | 大（销毁/重建元素）       | 小（只改变 CSS） |
| 适用场景     | 条件不常改变              | 需要频繁切换     |
| 生命周期     | 会触发                    | 不触发           |
| 搭配使用     | v-else-if, v-else         | 无               |

### 实际示例对比

```vue
<template>
  <div>
    <!-- 示例 1：管理员面板（使用 v-if） -->
    <!-- 原因：登录后几乎不变，且有权限控制 -->
    <div v-if="userRole === 'admin'">
      <h2>管理员面板</h2>
      <button @click="deleteUser">删除用户</button>
    </div>

    <!-- 示例 2：弹窗（使用 v-show） -->
    <!-- 原因：用户会频繁开关弹窗 -->
    <div v-show="isModalOpen" class="modal">
      <h2>弹窗标题</h2>
      <p>弹窗内容</p>
      <button @click="isModalOpen = false">关闭</button>
    </div>

    <!-- 示例 3：加载动画（使用 v-show） -->
    <!-- 原因：API 请求时会频繁显示/隐藏 -->
    <div v-show="isLoading" class="loading">
      <spinner />
    </div>

    <!-- 示例 4：错误信息（使用 v-if） -->
    <!-- 原因：不常出现，且出现时需要重新渲染 -->
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: 'user',
      isModalOpen: false,
      isLoading: false,
      errorMessage: '',
    };
  },
};
</script>
```

### v-if 与 v-show 记忆点

> - `v-if`：不显示时就不渲染，适合不常改变的条件
> - `v-show`：一开始就渲染好，随时准备显示，适合频繁切换

## 5. What's the difference between `computed` and `watch`?

> `computed` 和 `watch` 有什么区别？

这是 Vue 中两个非常重要的响应式功能，虽然都能监听数据变化，但使用场景和特性截然不同。

### `computed`（计算属性）

#### 核心特性（computed）

1. **缓存机制**：`computed` 计算出来的结果会被缓存，只有当依赖的响应式数据改变时才会重新计算
2. **自动追踪依赖**：会自动追踪计算过程中使用到的响应式数据
3. **同步计算**：必须是同步操作，且必须有返回值
4. **简洁的语法**：可以直接在 template 中使用，如同 data 中的属性

#### 常见使用场景（computed）

```vue
<!-- Vue 3 <script setup> 写法 -->
<template>
  <div>
    <!-- 示例 1：格式化数据 -->
    <p>全名：{{ fullName }}</p>
    <p>邮箱：{{ emailLowerCase }}</p>

    <!-- 示例 2：计算购物车总价 -->
    <ul>
      <li v-for="item in cart" :key="item.id">
        {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
      </li>
    </ul>
    <p>总计：${{ cartTotal }}</p>

    <!-- 示例 3：过滤列表 -->
    <input v-model="searchText" placeholder="搜索..." />
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

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

// 示例 1：组合数据
const fullName = computed(() => {
  console.log('计算 fullName'); // 只在依赖改变时才执行
  return `${firstName.value} ${lastName.value}`;
});

// 示例 2：格式化数据
const emailLowerCase = computed(() => {
  return email.value.toLowerCase();
});

// 示例 3：计算总价
const cartTotal = computed(() => {
  console.log('计算 cartTotal'); // 只在 cart 改变时才执行
  return cart.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// 示例 4：过滤列表
const filteredItems = computed(() => {
  if (!searchText.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});
</script>
```

#### `computed` 的优势：缓存机制

```vue
<template>
  <div>
    <!-- 多次使用 computed，但只计算一次 -->
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>

    <!-- 使用 method，每次都会重新计算 -->
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, index) => index));

const expensiveComputed = computed(() => {
  console.log('computed 执行'); // 只执行一次
  return items.value.reduce((sum, item) => sum + item, 0);
});

const expensiveMethod = () => {
  console.log('method 执行'); // 每次调用都会重新计算
  return items.value.reduce((sum, item) => sum + item, 0);
};
</script>
```

#### `computed` 的 getter 和 setter

```vue
<script setup>
import { computed, onMounted, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  // getter：读取时执行
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  // setter：设置时执行
  set(newValue) {
    const names = newValue.split(' ');
    firstName.value = names[0] ?? '';
    lastName.value = names[names.length - 1] ?? '';
  },
});

onMounted(() => {
  console.log(fullName.value); // 'John Doe'（触发 getter）
  fullName.value = 'Jane Smith'; // 触发 setter
  console.log(firstName.value); // 'Jane'
  console.log(lastName.value); // 'Smith'
});
</script>
```

### `watch`（监听属性）

#### 核心特性（watch）

1. **手动追踪数据变化**：需要明确指定要监听哪个数据
2. **可执行异步操作**：适合调用 API、设置计时器等
3. **不需要返回值**：主要用于执行副作用（side effects）
4. **可以监听多个数据**：通过数组或对象深度监听
5. **提供新旧值**：可以拿到变化前后的值

#### 常见使用场景（watch）

```vue
<!-- Vue 3 <script setup> 写法 -->
<template>
  <div>
    <!-- 示例 1：即时搜索 -->
    <input v-model="searchQuery" placeholder="搜索用户..." />
    <div v-if="isSearching">搜索中...</div>
    <ul>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.name }}
      </li>
    </ul>

    <!-- 示例 2：表单验证 -->
    <input v-model="username" placeholder="用户名" />
    <p v-if="usernameError" class="error">{{ usernameError }}</p>

    <!-- 示例 3：自动保存 -->
    <textarea v-model="content" placeholder="输入内容..."></textarea>
    <p v-if="isSaving">保存中...</p>
    <p v-if="lastSaved">最后保存：{{ lastSaved }}</p>
  </div>
</template>

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

// 示例 1：即时搜索（防抖）
watch(searchQuery, async (newQuery, oldQuery) => {
  console.log(`搜索从 "${oldQuery}" 变更为 "${newQuery}"`);

  // 清除之前的计时器
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  // 设置防抖：500ms 后才执行搜索
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } catch (error) {
      console.error('搜索失败', error);
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// 示例 2：表单验证
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = '用户名至少需要 3 个字符';
  } else if (newUsername.length > 20) {
    usernameError.value = '用户名不能超过 20 个字符';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value = '用户名只能包含字母、数字和下划线';
  } else {
    usernameError.value = '';
  }
});

// 示例 3：自动保存
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
    } catch (error) {
      console.error('保存失败', error);
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  // 清理计时器
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### `watch` 的选项

```vue
<!-- Vue 3 <script setup> 写法 -->
<script setup>
import { ref, watch, onMounted } from 'vue';

const user = ref({
  name: 'John',
  profile: {
    age: 30,
    city: 'Taipei',
  },
});
const items = ref([1, 2, 3]);

// 选项 1：immediate（立即执行）
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`名字从 ${oldName} 变更为 ${newName}`);
  },
  { immediate: true } // 组件创建时立即执行一次
);

// 选项 2：deep（深度监听）
watch(
  user,
  (newUser, oldUser) => {
    console.log('user 对象内部发生变化');
    console.log('新值：', newUser);
  },
  { deep: true } // 监听对象内部所有属性的变化
);

// 选项 3：flush（执行时机）
watch(
  items,
  (newItems) => {
    console.log('items 变化');
  },
  { flush: 'post' } // 在 DOM 更新后执行（默认是 'pre'）
);

onMounted(() => {
  // 测试深度监听
  setTimeout(() => {
    user.value.profile.age = 31; // 会触发 deep watch
  }, 1000);
});
</script>
```

#### 监听多个数据源

```vue
<!-- Vue 3 <script setup> 写法 -->
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// Vue 3 Composition API：监听多个数据
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`名字从 ${oldFirst} ${oldLast} 变更为 ${newFirst} ${newLast}`);
});
</script>
```

### `computed` vs `watch` 比较

| 特性              | computed               | watch                  |
| ----------------- | ---------------------- | ---------------------- |
| **主要用途**      | 基于已有数据计算新数据 | 监听数据变化执行副作用 |
| **返回值**        | 必须有返回值           | 不需要返回值           |
| **缓存**          | ✅ 有缓存机制          | ❌ 没有缓存            |
| **依赖追踪**      | ✅ 自动追踪            | ❌ 手动指定            |
| **异步操作**      | ❌ 不支持              | ✅ 支持                |
| **新旧值**        | ❌ 无法获取            | ✅ 可以获取            |
| **Template 使用** | ✅ 可以直接使用        | ❌ 不能直接使用        |
| **执行时机**      | 依赖改变时             | 监听的数据改变时       |

### 使用场景建议

#### 使用 `computed` 的情境

1. ✅ 需要**基于现有数据计算新数据**
2. ✅ 计算结果会在 template 中**多次使用**（利用缓存）
3. ✅ **同步计算**，不需要异步操作
4. ✅ 需要**格式化、过滤、排序**数据

```vue
<script setup>
import { computed, ref } from 'vue';

const timestamp = ref(Date.now());
const users = ref([
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false },
  { id: 3, name: 'Carol', isActive: true },
]);
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);

// ✅ 格式化数据
const formattedDate = computed(() => {
  return new Date(timestamp.value).toLocaleDateString();
});

// ✅ 过滤列表
const activeUsers = computed(() => {
  return users.value.filter((user) => user.isActive);
});

// ✅ 计算总和
const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});
</script>
```

#### 使用 `watch` 的情境

1. ✅ 需要**执行异步操作**（如 API 请求）
2. ✅ 需要**执行副作用**（如更新 localStorage）
3. ✅ 需要**防抖或节流**
4. ✅ 需要**拿到新旧值进行比较**
5. ✅ 需要**条件性执行**复杂逻辑

```vue
<script setup>
import { ref, watch } from 'vue';

const userId = ref(1);
const user = ref(null);

// ✅ API 请求
watch(userId, async (newId) => {
  user.value = await fetch(`/api/users/${newId}`).then((response) =>
    response.json()
  );
});

const settings = ref({
  theme: 'dark',
  notifications: true,
});

// ✅ localStorage 同步
watch(
  settings,
  (newSettings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings));
  },
  { deep: true }
);

const searchQuery = ref('');
let searchTimer = null;

const performSearch = (keyword) => {
  console.log(`搜索：${keyword}`);
};

// ✅ 防抖搜索
watch(searchQuery, (newQuery) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    performSearch(newQuery);
  }, 500);
});
</script>
```

### 实际案例对比

#### 错误用法 ❌

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const fullName = ref('');

// ❌ 错误：应该用 computed，而非 watch
watch(firstName, (newFirst) => {
  fullName.value = `${newFirst} ${lastName.value}`;
});

watch(lastName, (newLast) => {
  fullName.value = `${firstName.value} ${newLast}`;
});
</script>
```

#### 正确用法 ✅

```vue
<script setup>
import { computed, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// ✅ 正确：用 computed 计算派生数据
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
</script>
```

### computed 与 watch 记忆点

> **「`computed` 算数据，`watch` 做事情」**
>
> - `computed`：用来**计算新的数据**（如格式化、过滤、总和）
> - `watch`：用来**执行动作**（如 API 请求、保存数据、显示通知）

### 实践练习题：计算 x \* y

> 题目：x=0, y=5 现在有一个按钮每点击一次，x 就加 1。请使用 Vue 的 computed 或 watch 其中一个功能来实现「x \* y 的结果」。

#### 解法一：使用 `computed` (推荐)

这是最适合的场景，因为结果是依赖 x 和 y 计算出来的新数据。

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

// ✅ 推荐：简单、直观、自动追踪依赖
const result = computed(() => x.value * y.value);
</script>
```

#### 解法二：使用 `watch` (较繁琐)

虽然也可以做到，但需要手动维护 `result` 变量，且需要考虑初始值问题。

```vue
<script setup>
import { ref, watch } from 'vue';

const x = ref(0);
const y = ref(5);
const result = ref(0);

// ❌ 较不推荐：需要手动更新，且要设置 immediate 才会在初始时计算
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
