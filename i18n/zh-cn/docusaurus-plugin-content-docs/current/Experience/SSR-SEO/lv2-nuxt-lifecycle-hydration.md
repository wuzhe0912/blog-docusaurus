---
title: '[Lv2] Nuxt 3 Lifecycle 与 Hydration 原理'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> 深入理解 Nuxt 3 的生命周期（Lifecycle）、状态管理（State Management）与 Hydration 机制，避免常见的 Hydration Mismatch 问题。

---

## 1. 面试回答主轴

1. **Lifecycle 差异**：区分 Server-side 与 Client-side 执行的 Hooks。`setup` 两端都会执行，`onMounted` 仅在 Client 端执行。
2. **状态管理**：理解 `useState` 与 `ref` 在 SSR 场景下的差异。`useState` 能在 Server 与 Client 间同步状态，避免 Hydration Mismatch。
3. **Hydration 机制**：解释 Hydration 是如何让静态 HTML 变为可互动应用，以及常见的 Mismatch 原因（HTML 结构不一致、随机内容等）。

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Lifecycle Hooks 执行环境

在 Nuxt 3 (Vue 3 SSR) 中，不同的 Hooks 会在不同的环境下执行：

| Lifecycle Hook | Server-side | Client-side | 说明 |
|----------------|-------------|-------------|------|
| **setup()** | ✅ 执行 | ✅ 执行 | 组件初始化逻辑。**注意：避免在 setup 中使用仅 Client 端的 API（如 window, document）**。 |
| **onBeforeMount** | ❌ 不执行 | ✅ 执行 | 挂载前。 |
| **onMounted** | ❌ 不执行 | ✅ 执行 | 挂载完成。**DOM 操作、Browser API 调用应放在这里**。 |
| **onBeforeUpdate** | ❌ 不执行 | ✅ 执行 | 数据更新前。 |
| **onUpdated** | ❌ 不执行 | ✅ 执行 | 数据更新后。 |
| **onBeforeUnmount** | ❌ 不执行 | ✅ 执行 | 卸载前。 |
| **onUnmounted** | ❌ 不执行 | ✅ 执行 | 卸载后。 |

### 2.2 常见面试题：onMounted 在 Server 端会执行吗？

**回答：**
不会。`onMounted` 只会在 Client 端（浏览器）执行。Server 端渲染只负责生成 HTML 字符串，不会进行 DOM 的挂载（Mounting）。

**延伸问题：如果在 Server 端需要执行特定逻辑怎么办？**
- 使用 `setup()` 或 `useAsyncData` / `useFetch`。
- 如果需要区分环境，可以使用 `process.server` 或 `process.client` 判断。

```typescript
<script setup>
// Server 和 Client 都会执行
console.log('Setup executed');

if (process.server) {
  console.log('Only on Server');
}

onMounted(() => {
  // 只有 Client 会执行
  console.log('Mounted (Client Only)');
  // 安全地使用 window
  window.alert('Hello');
});
</script>
```

---

## 3. Nuxt 3 useState vs Vue ref

### 3.1 为什么 Nuxt 需要 useState？

在 SSR 应用中，Server 端渲染完 HTML 后，会将状态（State）序列化并传送给 Client 端，以便 Client 端进行 Hydration（接手状态）。

- **Vue `ref`**：是组件内的局部状态。在 SSR 过程中，Server 端建立的 `ref` 值**不会**自动传输给 Client 端。Client 端初始化时会重新建立 `ref`（通常重置为初始值），导致 Server 渲染的内容与 Client 初始状态不一致，产生 Hydration Mismatch。
- **Nuxt `useState`**：是 SSR 友好的状态管理。它会将状态储存在 `NuxtPayload` 中，随着 HTML 一起传送给 Client。Client 端初始化时会读取这个 Payload，还原状态，确保 Server 与 Client 状态一致。

### 3.2 比较表

| 特性 | Vue `ref` / `reactive` | Nuxt `useState` |
|------|------------------------|-----------------|
| **作用域** | 组件内 / 模块内 | 全局（App 范围内可透过 key 共享） |
| **SSR 状态同步** | ❌ 不会同步 | ✅ 自动序列化并同步到 Client |
| **适用场景** | 仅 Client 端互动状态、不需要 SSR 同步的数据 | 跨组件状态、需要从 Server 带到 Client 的数据（如 User Info） |

### 3.3 实作范例

**错误示范（使用 ref 做跨端状态）：**

```typescript
// Server 端产生随机数 -> HTML 显示 5
const count = ref(Math.random());

// Client 端重新执行 -> 产生新的随机数 3
// 结果：Hydration Mismatch (Server: 5, Client: 3)
```

**正确示范（使用 useState）：**

```typescript
// Server 端产生随机数 -> 存入 Payload (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client 端读取 Payload -> 取得 Server 产生的值
// 结果：状态一致
```

---

## 4. Hydration 与 Hydration Mismatch

### 4.1 什么是 Hydration？

Hydration（注水）是指 Client 端 JavaScript 接管由 Server 端渲染的静态 HTML 的过程。

1. **Server Rendering**：Server 执行 Vue 应用，生成 HTML 字符串（包含内容与 CSS）。
2. **HTML 下载**：浏览器下载并显示静态 HTML（First Paint）。
3. **JS 下载与执行**：浏览器下载 Vue/Nuxt 的 JS bundle。
4. **Hydration**：Vue 在 Client 端重新建立虚拟 DOM (Virtual DOM)，比对现有的真实 DOM。如果结构一致，Vue 就会「启用」这些 DOM 元素（绑定事件监听器），让页面变为可互动。

### 4.2 什么是 Hydration Mismatch？

当 Client 端生成的 Virtual DOM 结构与 Server 端渲染的 HTML 结构**不一致**时，Vue 就会报出 Hydration Mismatch 警告。这通常意味着 Client 端必须丢弃 Server 的 HTML 并重新渲染，导致性能下降与画面闪烁。

### 4.3 常见的 Mismatch 原因与解法

#### 1. HTML 结构不合法
浏览器会自动修正错误的 HTML 结构，导致与 Vue 预期不符。
- **例子**：`<p>` 标签内包含 `<div>`。
- **解法**：检查 HTML 语法，确保嵌套结构合法。

#### 2. 随机内容或时间戳记
Server 与 Client 执行时产生不同的内容。
- **例子**：`new Date()`、`Math.random()`。
- **解法**：
    - 使用 `useState` 固定值。
    - 或将这类逻辑移到 `onMounted` 中执行（只在 Client 渲染，Server 留白或显示 Placeholder）。

```typescript
// 错误
const time = new Date().toISOString();

// 正确 (使用 onMounted)
const time = ref('');
onMounted(() => {
  time.value = new Date().toISOString();
});

// 或使用 <ClientOnly>
<ClientOnly>
  <div>{{ new Date() }}</div>
</ClientOnly>
```

#### 3. 条件渲染依赖于 window/document
- **例子**：`v-if="window.innerWidth > 768"`
- **原因**：Server 端没有 window，判定为 false；Client 端判定为 true。
- **解法**：在 `onMounted` 更新状态，或使用 `useWindowSize` 等 Client-only hooks。

---

## 5. 面试总结

**可以这样回答：**

> Server-side 与 Client-side 的主要差异在于 Lifecycle Hooks 的执行。Server 端主要执行 `setup`，而 `onMounted` 等 DOM 相关 Hooks 只在 Client 端执行。这也引出了 Hydration 的概念，即 Client 端接管 Server HTML 的过程。
>
> 为了避免 Hydration Mismatch，我们必须确保 Server 与 Client 初始渲染的内容一致。这就是为什么 Nuxt 提供了 `useState`。不同于 Vue 的 `ref`，`useState` 会将状态序列化传给 Client，确保两端状态同步。如果使用了 `ref` 储存 Server 端生成的数据，Client 端重置时就会发生不一致。
>
> 常见的 Mismatch 像是随机数、时间戳记或不合法的 HTML 嵌套结构。解决方式是将变动内容移至 `onMounted` 或使用 `<ClientOnly>` 组件。

**关键点：**
- ✅ `onMounted` 仅在 Client 执行
- ✅ `useState` 支持 SSR 状态同步，`ref` 不支持
- ✅ Hydration Mismatch 的原因（结构、随机值）与解法（`<ClientOnly>`、`onMounted`）
