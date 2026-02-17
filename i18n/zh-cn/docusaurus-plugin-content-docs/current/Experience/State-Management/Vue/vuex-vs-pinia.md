---
id: state-management-vue-vuex-vs-pinia
title: 'Vuex vs Pinia 差异比较'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> 比较 Vuex 和 Pinia 的核心差异，包含 API 设计、TypeScript 支援、模组化方式等，并提供迁移指南。

---

## 1. 面试回答主轴

1. **核心差异**：Vuex 需要 mutations，Pinia 不需要；Pinia 有更好的 TypeScript 支援；模组化方式不同。
2. **选择建议**：Vue 3 新专案推荐 Pinia，Vue 2 专案使用 Vuex。
3. **迁移考量**：从 Vuex 迁移到 Pinia 的步骤与注意事项。

---

## 2. 核心差异总览

| 特性                | Vuex                     | Pinia                      |
| ------------------- | ------------------------ | -------------------------- |
| **Vue 版本**        | Vue 2                    | Vue 3                      |
| **API 复杂度**      | 较复杂（需要 mutations） | 更简洁（不需要 mutations） |
| **TypeScript 支援** | 需要额外配置             | 原生完整支援               |
| **模组化**          | 嵌套模组                 | 扁平化，每个 store 独立    |
| **体积**            | 较大                     | 更小（约 1KB）             |
| **开发体验**        | 良好                     | 更好（HMR、Devtools）      |

---

## 3. API 差异比较

### 3.1 Mutations vs Actions

**Vuex**：需要 `mutations` 来同步修改 state

```javascript
// Vuex
export default createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
  },
});
```

**Pinia**：不需要 `mutations`，直接在 `actions` 中修改 state

```typescript
// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++; // 直接修改
    },
  },
});
```

**关键差异**：
- **Vuex**：必须透过 `mutations` 同步修改 state，`actions` 透过 `commit` 调用 `mutations`
- **Pinia**：不需要 `mutations`，`actions` 可以直接修改 state（同步或非同步都可以）

### 3.2 State 定义

**Vuex**：`state` 可以是物件或函数

```javascript
state: {
  count: 0,
}
```

**Pinia**：`state` **必须是函数**，避免多实例共享状态

```typescript
state: () => ({
  count: 0,
})
```

### 3.3 Getters

**Vuex**：getters 接收 `(state, getters)` 作为参数

```javascript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne: (state, getters) => getters.doubleCount + 1,
}
```

**Pinia**：getters 可以使用 `this` 访问其他 getters

```typescript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne(): number {
    return this.doubleCount + 1;
  },
}
```

### 3.4 在组件中使用

**Vuex**：使用 `mapState`、`mapGetters`、`mapActions` 辅助函数

```javascript
computed: {
  ...mapState(['count']),
  ...mapGetters(['doubleCount']),
},
methods: {
  ...mapActions(['increment']),
}
```

**Pinia**：直接使用 store 实例，使用 `storeToRefs` 保持响应性

```typescript
const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store);
const { increment } = store;
```

---

## 4. 模组化差异

### 4.1 Vuex Modules（嵌套模组）

**Vuex**：使用嵌套模组，需要 `namespaced: true`

```javascript
// stores/user.js
export default {
  namespaced: true,
  state: { name: 'John' },
  mutations: {
    SET_NAME(state, name) {
      state.name = name;
    },
  },
};

// 在组件中使用
this.$store.dispatch('user/SET_NAME', 'Jane'); // 需要命名空间前缀
```

### 4.2 Pinia Stores（扁平化）

**Pinia**：每个 store 都是独立的，无需嵌套

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({ name: 'John' }),
  actions: {
    setName(name: string) {
      this.name = name;
    },
  },
});

// 在组件中使用
const userStore = useUserStore();
userStore.setName('Jane'); // 直接调用，无需命名空间
```

**关键差异**：
- **Vuex**：需要嵌套模组，使用 `namespaced: true`，调用时需要命名空间前缀
- **Pinia**：每个 store 独立，无需命名空间，直接调用

---

## 5. TypeScript 支援差异

### 5.1 Vuex TypeScript 支援

**Vuex**：需要额外配置型别

```typescript
// stores/types.ts
export interface State {
  count: number;
  user: { name: string; age: number };
}

// stores/index.ts
import { createStore, Store } from 'vuex';
import { State } from './types';

export default createStore<State>({
  state: { count: 0, user: { name: 'John', age: 30 } },
});

// 在组件中使用
const store = useStore<State>();
// 需要手动定义型别，没有完整的型别推断
```

### 5.2 Pinia TypeScript 支援

**Pinia**：原生完整支援，自动型别推断

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: { name: 'John', age: 30 },
  }),
  getters: {
    doubleCount: (state) => state.count * 2, // 自动推断型别
  },
  actions: {
    increment() {
      this.count++; // 完整的型别推断和自动完成
    },
  },
});

// 在组件中使用
const store = useCounterStore();
store.count; // 完整的型别推断
store.doubleCount; // 完整的型别推断
store.increment(); // 完整的型别推断
```

**关键差异**：
- **Vuex**：需要手动定义型别，型别推断不完整
- **Pinia**：原生完整支援，自动型别推断，开发体验更好

---

## 6. 迁移指南

### 6.1 基本迁移步骤

1. **安装 Pinia**

```bash
npm install pinia
```

2. **替换 Vuex Store**

```javascript
// 旧的 Vuex
import { createStore } from 'vuex';
export default createStore({ ... });

// 新的 Pinia
import { createPinia } from 'pinia';
const pinia = createPinia();
app.use(pinia);
```

3. **转换 Store 定义**

```javascript
// Vuex
export default createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
  },
});

// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

4. **更新组件使用方式**

```javascript
// Vuex
import { mapState, mapActions } from 'vuex';
computed: { ...mapState(['count']) },
methods: { ...mapActions(['increment']) },

// Pinia
import { storeToRefs } from 'pinia';
const store = useCounterStore();
const { count } = storeToRefs(store);
const { increment } = store;
```

### 6.2 常见迁移问题

**问题 1：如何处理 Vuex modules？**

```javascript
// Vuex modules
modules: {
  user: userModule,
  product: productModule,
}

// Pinia：每个模组变成独立的 store
// stores/user.ts
export const useUserStore = defineStore('user', { ... });

// stores/product.ts
export const useProductStore = defineStore('product', { ... });
```

**问题 2：如何处理命名空间？**

```javascript
// Vuex：需要命名空间前缀
this.$store.dispatch('user/SET_NAME', 'John');

// Pinia：直接调用，无需命名空间
const userStore = useUserStore();
userStore.setName('John');
```

---

## 7. 为什么 Pinia 不需要 mutations？

**原因**：

1. **Vue 3 的响应式系统**
   - Vue 3 使用 Proxy，可以直接追踪物件的修改
   - 不需要像 Vue 2 那样透过 mutations 来追踪状态变化

2. **简化 API**
   - 移除 mutations 可以简化 API，减少样板程式码
   - Actions 可以直接修改 state，无论是同步还是非同步操作

3. **开发体验**
   - 减少一层抽象，开发者更容易理解和使用
   - 不需要记住 `commit` 和 `dispatch` 的区别

**范例**：

```typescript
// Vuex：需要 mutations
mutations: { SET_COUNT(state, count) { state.count = count; } },
actions: { setCount({ commit }, count) { commit('SET_COUNT', count); } },

// Pinia：直接修改
actions: { setCount(count) { this.count = count; } },
```

---

## 8. 如何选择使用 Vuex 还是 Pinia？

**选择建议**：

1. **新专案**
   - Vue 3 专案：**推荐使用 Pinia**
   - Vue 2 专案：使用 Vuex

2. **现有专案**
   - Vue 2 + Vuex：可以继续使用 Vuex，或考虑升级到 Vue 3 + Pinia
   - Vue 3 + Vuex：可以考虑迁移到 Pinia（但非必须）

3. **专案需求**
   - 需要完整 TypeScript 支援：**选择 Pinia**
   - 需要更简洁的 API：**选择 Pinia**
   - 团队熟悉 Vuex：可以继续使用 Vuex

**总结**：
- Vue 3 新专案：**强烈推荐 Pinia**
- Vue 2 专案：使用 Vuex
- 现有 Vue 3 + Vuex 专案：可以考虑迁移，但非必须

---

## 9. 面试重点整理

### 9.1 核心差异

**可以这样回答：**

> Vuex 和 Pinia 都是 Vue 的状态管理工具，主要差异包括：1) API 复杂度：Vuex 需要 mutations 来同步修改 state，Pinia 不需要 mutations，actions 可以直接修改 state；2) TypeScript 支援：Vuex 需要额外配置，型别推断不完整，Pinia 原生完整支援，自动型别推断；3) 模组化：Vuex 使用嵌套模组，需要 namespaced，Pinia 每个 store 独立，无需命名空间；4) 开发体验：Pinia 体积更小、支援 HMR、更好的 Devtools 支援；5) Vue 版本：Vuex 主要用于 Vue 2，Pinia 是 Vue 3 的官方推荐。对于 Vue 3 新专案，我推荐使用 Pinia。

**关键点：**
- ✅ API 复杂度差异
- ✅ TypeScript 支援差异
- ✅ 模组化方式差异
- ✅ 选择建议

### 9.2 为什么 Pinia 不需要 mutations？

**可以这样回答：**

> Pinia 不需要 mutations 主要有三个原因：1) Vue 3 使用 Proxy 作为响应式系统，可以直接追踪物件的修改，不需要像 Vue 2 那样透过 mutations 来追踪状态变化；2) 简化 API，移除 mutations 可以减少样板程式码，actions 可以直接修改 state，无论是同步还是非同步操作；3) 提升开发体验，减少一层抽象，开发者更容易理解和使用，不需要记住 commit 和 dispatch 的区别。

**关键点：**
- ✅ Vue 3 响应式系统
- ✅ API 简化
- ✅ 开发体验提升

---

## 10. 面试总结

**可以这样回答：**

> Vuex 和 Pinia 的主要差异在于 API 设计、TypeScript 支援和模组化方式。Vuex 需要 mutations，Pinia 不需要；Pinia 有更好的 TypeScript 支援；Vuex 使用嵌套模组，Pinia 使用扁平化设计。对于 Vue 3 新专案，我推荐使用 Pinia，因为它提供更好的开发体验和更简洁的 API。如果专案需要从 Vuex 迁移到 Pinia，主要步骤是移除 mutations，将 modules 转换为独立的 stores，并更新组件使用方式。

**关键点：**
- ✅ 核心差异总结
- ✅ 选择建议
- ✅ 迁移指南
- ✅ 实际专案经验

## Reference

- [Vuex 官方文档](https://vuex.vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [从 Vuex 迁移到 Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)
