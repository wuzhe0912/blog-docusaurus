---
id: vue3-new-features
title: '[Easy] Vue3 新特性'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> Vue 3 有哪些新特性？

Vue 3 引入了许多新特性和改进，主要包括：

### 主要新特性

1. **Composition API**：新的组件写法
2. **Teleport**：将组件渲染到 DOM 的其他位置
3. **Fragment**：组件可以有多个根节点
4. **Suspense**：处理异步组件加载
5. **多个 v-model**：支持多个 v-model
6. **更好的 TypeScript 支持**
7. **性能优化**：更小的打包体积、更快的渲染速度

## 2. Teleport

> Teleport 是什么？

**定义**：`Teleport` 允许我们将组件的内容渲染到 DOM 树的其他位置，而不改变组件的逻辑结构。

### 使用场景

**常见场景**：Modal、Tooltip、Notification 等需要渲染到 body 的组件

<details>
<summary>点此展开 Teleport 示例</summary>

```vue
<template>
  <div>
    <button @click="showModal = true">打开 Modal</button>

    <!-- 使用 Teleport 将 Modal 渲染到 body -->
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Modal 标题</h2>
          <p>Modal 内容</p>
          <button @click="showModal = false">关闭</button>
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

</details>

### 优势

1. **解决 z-index 问题**：Modal 渲染到 body，不受父组件样式影响
2. **保持逻辑结构**：组件逻辑仍在原位置，只是 DOM 位置不同
3. **更好的可维护性**：Modal 相关代码集中在组件中

## 3. Fragment（多根节点）

> Fragment 是什么？

**定义**：Vue 3 允许组件有多个根节点，不需要包裹在单一元素中。这是一个隐式的 Fragment，不需要像 React 那样使用 `<Fragment>` 标签。

### Vue 2 vs Vue 3

**Vue 2**：必须有单一根节点

```vue
<!-- Vue 2：必须包裹在单一元素中 -->
<template>
  <div>
    <h1>标题</h1>
    <p>内容</p>
  </div>
</template>
```

**Vue 3**：可以有多个根节点

```vue
<!-- Vue 3：可以有多个根节点 -->
<template>
  <h1>标题</h1>
  <p>内容</p>
</template>
```

### 为什么需要 Fragment？

在 Vue 2 中，组件必须有单一根节点，这导致开发者经常需要添加额外的包裹元素（如 `<div>`），这些元素：

1. **破坏语义化 HTML**：添加无意义的包裹元素
2. **增加 DOM 层级**：影响样式选择器和性能
3. **样式控制困难**：需要处理额外包裹元素的样式

### 使用场景

#### 场景 1：语义化 HTML 结构

```vue
<template>
  <!-- 不需要额外的包裹元素 -->
  <header>
    <h1>网站标题</h1>
  </header>
  <main>
    <p>主要内容</p>
  </main>
  <footer>
    <p>页脚</p>
  </footer>
</template>
```

#### 场景 2：列表项组件

```vue
<!-- ListItem.vue -->
<template>
  <li class="item-title">{{ title }}</li>
  <li class="item-description">{{ description }}</li>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
</script>
```

#### 场景 3：条件渲染多个元素

```vue
<template>
  <div v-if="showHeader" class="header">标题</div>
  <div v-if="showContent" class="content">内容</div>
  <div v-if="showFooter" class="footer">页脚</div>
</template>
```

### 属性继承（Attribute Inheritance）

当组件有多个根节点时，属性继承的行为会有所不同。

**单根节点**：属性会自动继承到根元素

```vue
<!-- 父组件 -->
<MyComponent class="custom-class" id="my-id" />

<!-- 子组件（单根） -->
<template>
  <div>内容</div>
</template>

<!-- 渲染结果 -->
<div class="custom-class" id="my-id">内容</div>
```

**多根节点**：属性不会自动继承，需要手动指定

```vue
<!-- 父组件 -->
<MyComponent class="custom-class" id="my-id" />

<!-- 子组件（多根） -->
<template>
  <div>第一个根</div>
  <div>第二个根</div>
</template>

<!-- 渲染结果：属性不会自动继承 -->
<div>第一个根</div>
<div>第二个根</div>
```

**解决方案**：使用 `$attrs` 手动绑定属性

```vue
<!-- 子组件 -->
<template>
  <div v-bind="$attrs">第一个根</div>
  <div>第二个根</div>
</template>

<!-- 渲染结果 -->
<div class="custom-class" id="my-id">第一个根</div>
<div>第二个根</div>
```

**使用 `inheritAttrs: false` 控制继承行为**：

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // 禁用自动继承
});
</script>

<template>
  <div v-bind="$attrs">第一个根</div>
  <div>第二个根</div>
</template>
```

### Fragment vs React Fragment

| 特性         | Vue 3 Fragment     | React Fragment                    |
| ------------ | ------------------ | --------------------------------- |
| **语法**     | 隐式（不需要标签） | 显式（需要 `<Fragment>` 或 `<>`） |
| **Key 属性** | 不需要             | 需要时使用 `<Fragment key={...}>` |
| **属性继承** | 需要手动处理       | 不支持属性                        |

**Vue 3**：

```vue
<!-- Vue 3：隐式 Fragment -->
<template>
  <h1>标题</h1>
  <p>内容</p>
</template>
```

**React**：

```jsx
// React：显式 Fragment
function Component() {
  return (
    <>
      <h1>标题</h1>
      <p>内容</p>
    </>
  );
}
```

### 注意事项

1. **属性继承**：多根节点时，属性不会自动继承，需要使用 `$attrs` 手动绑定
2. **样式作用域**：多根节点时，`scoped` 样式会应用到所有根节点
3. **逻辑包裹**：如果逻辑上需要包裹，还是应该使用单一根节点

```vue
<!-- ✅ 好的做法：逻辑上需要包裹 -->
<template>
  <div class="card">
    <h2>标题</h2>
    <p>内容</p>
  </div>
</template>

<!-- ⚠️ 避免：为了多根而多根 -->
<template>
  <h2>标题</h2>
  <p>内容</p>
  <!-- 如果这两个元素逻辑上应该是一组，应该包裹 -->
</template>
```

## 4. Suspense

> Suspense 是什么？

**定义**：`Suspense` 是一个内置组件，用来处理异步组件加载时的加载状态。

### 基本用法

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>加载中...</div>
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

### 使用场景

1. **异步组件加载**

   ```vue
   <Suspense>
     <AsyncUserProfile :userId="userId" />
     <template #fallback>
       <UserProfileSkeleton />
     </template>
   </Suspense>
   ```

2. **异步数据加载**
   ```vue
   <script setup>
   const data = await fetchData(); // 在 setup 中使用 await
   </script>
   ```

## 5. Multiple v-model

> 多个 v-model

**定义**：Vue 3 允许组件使用多个 `v-model`，每个 `v-model` 对应不同的 prop。

### Vue 2 vs Vue 3

**Vue 2**：只能有一个 `v-model`

```vue
<!-- Vue 2：只能有一个 v-model -->
<CustomInput v-model="value" />
```

**Vue 3**：可以有多个 `v-model`

```vue
<!-- Vue 3：可以有多个 v-model -->
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### 实现示例

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input :value="email" @input="$emit('update:email', $event.target.value)" />
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

> 常见面试题目

### 题目 1：Teleport 的使用场景

请说明什么时候应该使用 `Teleport`？

<details>
<summary>点击查看答案</summary>

**使用 Teleport 的场景**：

1. **Modal 对话框**

   ```vue
   <Teleport to="body">
     <Modal v-if="showModal" />
   </Teleport>
   ```

   - 解决 z-index 问题
   - 不受父组件样式影响

2. **Tooltip 提示**

   ```vue
   <Teleport to="body">
     <Tooltip v-if="showTooltip" />
   </Teleport>
   ```

   - 避免被父组件 overflow 隐藏

3. **Notification 通知**
   ```vue
   <Teleport to="#notifications">
     <Notification v-for="msg in messages" :key="msg.id" />
   </Teleport>
   ```
   - 统一管理通知位置

**不使用 Teleport 的情况**：

- 一般内容不需要
- 不需要特殊 DOM 位置的组件

</details>

### 题目 2：Fragment 的优势

请说明 Vue 3 允许多个根节点的优势。

<details>
<summary>点击查看答案</summary>

**优势**：

1. **减少不必要的 DOM 元素**

   ```vue
   <!-- Vue 2：需要额外的 div -->
   <template>
     <div>
       <header>...</header>
       <main>...</main>
     </div>
   </template>

   <!-- Vue 3：不需要额外的元素 -->
   <template>
     <header>...</header>
     <main>...</main>
   </template>
   ```

2. **更好的语义化 HTML**

   - 不需要为了 Vue 的限制而添加无意义的包裹元素
   - 保持 HTML 结构的语义化

3. **更灵活的样式控制**

   - 不需要处理额外包裹元素的样式
   - 减少 CSS 选择器的复杂度

4. **减少 DOM 层级**

   - 更浅的 DOM 树，性能更好
   - 减少浏览器渲染成本

5. **更好的可维护性**
   - 代码更简洁，不需要额外的包裹元素
   - 组件结构更清晰

</details>

### 题目 3：Fragment 属性继承问题

请说明当组件有多个根节点时，属性继承的行为是什么？如何解决？

<details>
<summary>点击查看答案</summary>

**问题**：

当组件有多个根节点时，父组件传递的属性（如 `class`、`id` 等）不会自动继承到任何一个根节点。

**示例**：

```vue
<!-- 父组件 -->
<MyComponent class="custom-class" id="my-id" />

<!-- 子组件（多根） -->
<template>
  <div>第一个根</div>
  <div>第二个根</div>
</template>

<!-- 渲染结果：属性不会自动继承 -->
<div>第一个根</div>
<div>第二个根</div>
```

**解决方案**：

1. **使用 `$attrs` 手动绑定属性**

```vue
<!-- 子组件 -->
<template>
  <div v-bind="$attrs">第一个根</div>
  <div>第二个根</div>
</template>

<!-- 渲染结果 -->
<div class="custom-class" id="my-id">第一个根</div>
<div>第二个根</div>
```

2. **使用 `inheritAttrs: false` 控制继承行为**

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // 禁用自动继承
});
</script>

<template>
  <div v-bind="$attrs">第一个根</div>
  <div>第二个根</div>
</template>
```

3. **选择性地绑定特定属性**

```vue
<template>
  <div :class="$attrs.class">第一个根</div>
  <div :id="$attrs.id">第二个根</div>
</template>
```

**关键点**：

- 单根节点：属性自动继承
- 多根节点：属性不会自动继承，需要手动处理
- 使用 `$attrs` 可以访问所有未在 `props` 中定义的属性

</details>

### 题目 4：Fragment vs React Fragment

请比较 Vue 3 Fragment 和 React Fragment 的差异。

<details>
<summary>点击查看答案</summary>

**主要差异**：

| 特性         | Vue 3 Fragment           | React Fragment                    |
| ------------ | ------------------------ | --------------------------------- |
| **语法**     | 隐式（不需要标签）       | 显式（需要 `<Fragment>` 或 `<>`） |
| **Key 属性** | 不需要                   | 需要时使用 `<Fragment key={...}>` |
| **属性继承** | 需要手动处理（`$attrs`） | 不支持属性                        |

**Vue 3**：

```vue
<!-- Vue 3：隐式 Fragment，直接写多个根节点 -->
<template>
  <h1>标题</h1>
  <p>内容</p>
</template>
```

**React**：

```jsx
// React：显式 Fragment，需要使用标签
function Component() {
  return (
    <>
      <h1>标题</h1>
      <p>内容</p>
    </>
  );
}

// 或使用 Fragment
import { Fragment } from 'react';
function Component() {
  return (
    <Fragment>
      <h1>标题</h1>
      <p>内容</p>
    </Fragment>
  );
}
```

**优势比较**：

- **Vue 3**：语法更简洁，不需要额外标签
- **React**：更明确，可以添加 key 属性

</details>

### 题目 5：Suspense 的使用

请实现一个使用 `Suspense` 加载异步组件的示例。

<details>
<summary>点击查看答案</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>加载用户数据中...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);

// 定义异步组件
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

**进阶用法：处理错误**

```vue
<template>
  <Suspense @resolve="onResolve" @reject="onReject">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>

<script setup>
const onResolve = () => {
  console.log('组件加载成功');
};

const onReject = (error) => {
  console.error('组件加载失败:', error);
};
</script>
```

</details>

## 7. Best Practices

> 最佳实践

### 推荐做法

```vue
<!-- 1. Modal 使用 Teleport -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2. 多根节点保持语义化 -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3. 异步组件使用 Suspense -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4. 多个 v-model 使用明确的命名 -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### 避免的做法

```vue
<!-- 1. 不要过度使用 Teleport -->
<Teleport to="body">
  <div>一般内容</div> <!-- ❌ 不需要 -->
</Teleport>

<!-- 2. 不要为了多根节点而破坏结构 -->
<template>
  <h1>标题</h1>
  <p>内容</p>
  <!-- ⚠️ 如果逻辑上需要包裹，还是应该使用单一根节点 -->
</template>

<!-- 3. 不要忽略 Suspense 的错误处理 -->
<Suspense>
  <AsyncComponent />
  <!-- ⚠️ 应该处理加载失败的情况 -->
</Suspense>
```

## 8. Interview Summary

> 面试总结

### 快速记忆

**Vue 3 主要新特性**：

- **Composition API**：新的组件写法
- **Teleport**：将组件渲染到其他 DOM 位置
- **Fragment**：支持多个根节点
- **Suspense**：处理异步组件加载
- **多个 v-model**：支持多个 v-model 绑定

**使用场景**：

- Modal/Tooltip → `Teleport`
- 语义化 HTML → `Fragment`
- 异步组件 → `Suspense`
- 表单组件 → 多个 `v-model`

### 面试回答示例

**Q: Vue 3 有哪些主要新特性？**

> "Vue 3 引入了许多新特性，主要包括：1) Composition API，提供新的组件写法，更好的逻辑组织和代码复用；2) Teleport，允许将组件内容渲染到 DOM 树的其他位置，常用于 Modal、Tooltip 等；3) Fragment，组件可以有多个根节点，不需要额外的包裹元素；4) Suspense，处理异步组件加载时的加载状态；5) 多个 v-model，支持组件使用多个 v-model 绑定；6) 更好的 TypeScript 支持和性能优化。这些新特性让 Vue 3 更强大、更灵活，同时保持了向后兼容性。"

**Q: Teleport 的使用场景是什么？**

> "Teleport 主要用于需要将组件渲染到 DOM 树其他位置的场景，常见的使用场景包括：1) Modal 对话框，需要渲染到 body 以避免 z-index 问题；2) Tooltip 提示，避免被父组件的 overflow 隐藏；3) Notification 通知，统一管理通知位置。Teleport 的优势是保持组件的逻辑结构不变，只是改变 DOM 的渲染位置，这样既解决了样式问题，又保持了代码的可维护性。"

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
