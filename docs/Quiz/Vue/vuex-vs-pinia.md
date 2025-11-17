---
id: vuex-vs-pinia
title: '[Medium] Vuex vs Pinia 差異比較'
slug: /vuex-vs-pinia
tags: [Vue, Quiz, Medium, Vuex, Pinia]
---

## 1. What are Vuex and Pinia?

> 什麼是 Vuex 和 Pinia？

**Vuex** 是 Vue 2 的官方狀態管理工具，提供集中式狀態管理。

**Pinia** 是 Vue 3 的官方狀態管理工具，作為 Vuex 的後繼者，提供了更簡潔的 API 和更好的 TypeScript 支援。

### 核心差異總覽

| 特性                | Vuex                     | Pinia                      |
| ------------------- | ------------------------ | -------------------------- |
| **Vue 版本**        | Vue 2                    | Vue 3                      |
| **API 複雜度**      | 較複雜（需要 mutations） | 更簡潔（不需要 mutations） |
| **TypeScript 支援** | 需要額外配置             | 原生完整支援               |
| **模組化**          | 嵌套模組                 | 扁平化，每個 store 獨立    |
| **體積**            | 較大                     | 更小（約 1KB）             |
| **開發體驗**        | 良好                     | 更好（HMR、Devtools）      |

## 2. API 差異比較

> API 差異比較

### 2.1 State（狀態）

**Vuex**：

<details>
<summary>點此展開 Vuex state 範例</summary>

```javascript
// Vuex Store
import { createStore } from 'vuex';

export default createStore({
  state: {
    count: 0,
    user: {
      name: 'John',
      age: 30,
    },
  },
  // ...
});
```

</details>

**Pinia**：

<details>
<summary>點此展開 Pinia state 範例</summary>

```typescript
// Pinia Store
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: {
      name: 'John',
      age: 30,
    },
  }),
  // ...
});
```

</details>

**關鍵差異**：

- **Vuex**：`state` 可以是物件或函數
- **Pinia**：`state` **必須是函數**，避免多實例共享狀態

### 2.2 Mutations vs Actions

**Vuex**：需要 `mutations` 來同步修改 state

<details>
<summary>點此展開 Vuex mutations/actions 範例</summary>

```javascript
// Vuex
export default createStore({
  state: {
    count: 0,
  },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
    SET_COUNT(state, payload) {
      state.count = payload;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
    async fetchCount({ commit }) {
      const count = await api.getCount();
      commit('SET_COUNT', count);
    },
  },
});
```

</details>

**Pinia**：不需要 `mutations`，直接在 `actions` 中修改 state

<details>
<summary>點此展開 Pinia actions 範例</summary>

```typescript
// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++; // 直接修改
    },
    async fetchCount() {
      const count = await api.getCount();
      this.count = count; // 直接修改
    },
  },
});
```

</details>

**關鍵差異**：

- **Vuex**：必須透過 `mutations` 同步修改 state，`actions` 透過 `commit` 調用 `mutations`
- **Pinia**：不需要 `mutations`，`actions` 可以直接修改 state（同步或非同步都可以）

### 2.3 Getters（計算屬性）

**Vuex**：

<details>
<summary>點此展開 Vuex getters 範例</summary>

```javascript
// Vuex
export default createStore({
  state: {
    count: 0,
  },
  getters: {
    doubleCount: (state) => state.count * 2,
    // 使用其他 getters
    doubleCountPlusOne: (state, getters) => getters.doubleCount + 1,
  },
});
```

</details>

**Pinia**：

<details>
<summary>點此展開 Pinia getters 範例</summary>

```typescript
// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    // 使用 this 訪問其他 getters
    doubleCountPlusOne(): number {
      return this.doubleCount + 1;
    },
  },
});
```

</details>

**關鍵差異**：

- **Vuex**：getters 接收 `(state, getters)` 作為參數
- **Pinia**：getters 可以使用 `this` 訪問其他 getters，更符合 JavaScript 習慣

### 2.4 在組件中使用

**Vuex**：

<details>
<summary>點此展開 Vuex 組件使用範例</summary>

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    // 使用 mapState
    ...mapState(['count']),
    // 使用 mapGetters
    ...mapGetters(['doubleCount']),
  },
  methods: {
    // 使用 mapActions
    ...mapActions(['increment']),
  },
};
</script>
```

</details>

**Pinia**：

<details>
<summary>點此展開 Pinia 組件使用範例</summary>

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/stores/counter';

const store = useCounterStore();
// 解構 state 和 getters 需要使用 storeToRefs
const { count, doubleCount } = storeToRefs(store);
// actions 可以直接解構
const { increment } = store;
</script>
```

</details>

**關鍵差異**：

- **Vuex**：使用 `mapState`、`mapGetters`、`mapActions` 輔助函數
- **Pinia**：直接使用 store 實例，使用 `storeToRefs` 保持響應性

## 3. 模組化差異

> 模組化差異

### 3.1 Vuex Modules（嵌套模組）

**Vuex**：使用嵌套模組，需要 `namespaced: true`

<details>
<summary>點此展開 Vuex 模組化範例</summary>

```javascript
// stores/user.js
export default {
  namespaced: true,
  state: {
    name: 'John',
  },
  mutations: {
    SET_NAME(state, name) {
      state.name = name;
    },
  },
};

// stores/index.js
import { createStore } from 'vuex';
import user from './user';

export default createStore({
  modules: {
    user, // 嵌套模組
  },
});

// 在組件中使用
this.$store.dispatch('user/SET_NAME', 'Jane'); // 需要命名空間前綴
```

</details>

### 3.2 Pinia Stores（扁平化）

**Pinia**：每個 store 都是獨立的，無需嵌套

<details>
<summary>點此展開 Pinia store 範例</summary>

```typescript
// stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'John',
  }),
  actions: {
    setName(name: string) {
      this.name = name;
    },
  },
});

// 在組件中使用
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
userStore.setName('Jane'); // 直接調用，無需命名空間
```

</details>

**關鍵差異**：

- **Vuex**：需要嵌套模組，使用 `namespaced: true`，調用時需要命名空間前綴
- **Pinia**：每個 store 獨立，無需命名空間，直接調用

## 4. TypeScript 支援差異

> TypeScript 支援差異

### 4.1 Vuex TypeScript 支援

**Vuex**：需要額外配置型別

<details>
<summary>點此展開 Vuex TypeScript 範例</summary>

```typescript
// stores/types.ts
import { Store } from 'vuex';

export interface State {
  count: number;
  user: {
    name: string;
    age: number;
  };
}

// stores/index.ts
import { createStore, Store } from 'vuex';
import { State } from './types';

export default createStore<State>({
  state: {
    count: 0,
    user: {
      name: 'John',
      age: 30,
    },
  },
});

// 在組件中使用
import { useStore } from 'vuex';
import { State } from '@/stores/types';

const store = useStore<State>();
// 需要手動定義型別，沒有完整的型別推斷
```

</details>

### 4.2 Pinia TypeScript 支援

**Pinia**：原生完整支援，自動型別推斷

<details>
<summary>點此展開 Pinia TypeScript 範例</summary>

```typescript
// stores/counter.ts
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: {
      name: 'John',
      age: 30,
    },
  }),
  getters: {
    doubleCount: (state) => state.count * 2, // 自動推斷型別
  },
  actions: {
    increment() {
      this.count++; // 完整的型別推斷和自動完成
    },
  },
});

// 在組件中使用
import { useCounterStore } from '@/stores/counter';

const store = useCounterStore();
store.count; // 完整的型別推斷
store.doubleCount; // 完整的型別推斷
store.increment(); // 完整的型別推斷
```

</details>

**關鍵差異**：

- **Vuex**：需要手動定義型別，型別推斷不完整
- **Pinia**：原生完整支援，自動型別推斷，開發體驗更好

## 5. 完整範例對比

> 完整範例對比

### 5.1 Vuex 完整範例

<details>
<summary>點此展開 Vuex 完整範例</summary>

```javascript
// stores/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    count: 0,
    todos: [],
  },
  getters: {
    doubleCount: (state) => state.count * 2,
    completedTodos: (state) => state.todos.filter((todo) => todo.completed),
  },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
    SET_COUNT(state, payload) {
      state.count = payload;
    },
    ADD_TODO(state, todo) {
      state.todos.push(todo);
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
    async fetchCount({ commit }) {
      const count = await api.getCount();
      commit('SET_COUNT', count);
    },
    addTodo({ commit }, todo) {
      commit('ADD_TODO', todo);
    },
  },
});
```

</details>

<details>
<summary>點此展開 Vuex 組件完整範例</summary>

```vue
<!-- 組件中使用 Vuex -->
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
    <button @click="fetchCount">Fetch Count</button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['count']),
    ...mapGetters(['doubleCount']),
  },
  methods: {
    ...mapActions(['increment', 'fetchCount']),
  },
};
</script>
```

</details>

### 5.2 Pinia 完整範例

<details>
<summary>點此展開 Pinia 完整範例</summary>

```typescript
// stores/counter.ts
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    todos: [] as Array<{ id: number; text: string; completed: boolean }>,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    completedTodos(): Array<{ id: number; text: string; completed: boolean }> {
      return this.todos.filter((todo) => todo.completed);
    },
  },
  actions: {
    increment() {
      this.count++;
    },
    async fetchCount() {
      const count = await api.getCount();
      this.count = count;
    },
    addTodo(todo: { id: number; text: string; completed: boolean }) {
      this.todos.push(todo);
    },
  },
});
```

</details>

<details>
<summary>點此展開 Pinia 組件完整範例</summary>

```vue
<!-- 組件中使用 Pinia -->
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
    <button @click="fetchCount">Fetch Count</button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCounterStore } from '@/stores/counter';

const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store);
const { increment, fetchCount } = store;
</script>
```

</details>

## 6. 遷移指南

> 從 Vuex 遷移到 Pinia

### 6.1 基本遷移步驟

1. **安裝 Pinia**

```bash
npm install pinia
```

2. **替換 Vuex Store**

```javascript
// 舊的 Vuex
import { createStore } from 'vuex';
export default createStore({ ... });

// 新的 Pinia
import { createPinia } from 'pinia';
const pinia = createPinia();
app.use(pinia);
```

3. **轉換 Store 定義**

<details>
<summary>點此展開遷移程式碼對照</summary>

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

</details>

4. **更新組件使用方式**

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

### 6.2 常見遷移問題

**問題 1：如何處理 Vuex modules？**

```javascript
// Vuex modules
modules: {
  user: userModule,
  product: productModule,
}

// Pinia：每個模組變成獨立的 store
// stores/user.ts
export const useUserStore = defineStore('user', { ... });

// stores/product.ts
export const useProductStore = defineStore('product', { ... });
```

**問題 2：如何處理命名空間？**

```javascript
// Vuex：需要命名空間前綴
this.$store.dispatch('user/SET_NAME', 'John');

// Pinia：直接調用，無需命名空間
const userStore = useUserStore();
userStore.setName('John');
```

## 7. Common Interview Questions

> 常見面試題目

### 題目 1：Vuex 和 Pinia 的主要差異是什麼？

<details>
<summary>點擊查看答案</summary>

**主要差異**：

1. **API 複雜度**

   - Vuex 需要 `mutations` 來同步修改 state
   - Pinia 不需要 `mutations`，`actions` 可以直接修改 state

2. **TypeScript 支援**

   - Vuex 需要額外配置，型別推斷不完整
   - Pinia 原生完整支援，自動型別推斷

3. **模組化**

   - Vuex 使用嵌套模組，需要 `namespaced: true`
   - Pinia 每個 store 獨立，無需命名空間

4. **開發體驗**

   - Pinia 體積更小、支援 HMR、更好的 Devtools 支援

5. **Vue 版本**
   - Vuex 主要用於 Vue 2
   - Pinia 是 Vue 3 的官方推薦

</details>

### 題目 2：為什麼 Pinia 不需要 mutations？

<details>
<summary>點擊查看答案</summary>

**原因**：

1. **Vue 3 的響應式系統**

   - Vue 3 使用 Proxy，可以直接追蹤物件的修改
   - 不需要像 Vue 2 那樣透過 mutations 來追蹤狀態變化

2. **簡化 API**

   - 移除 mutations 可以簡化 API，減少樣板程式碼
   - Actions 可以直接修改 state，無論是同步還是非同步操作

3. **開發體驗**
   - 減少一層抽象，開發者更容易理解和使用
   - 不需要記住 `commit` 和 `dispatch` 的區別

**範例**：

```typescript
// Vuex：需要 mutations
mutations: { SET_COUNT(state, count) { state.count = count; } },
actions: { setCount({ commit }, count) { commit('SET_COUNT', count); } },

// Pinia：直接修改
actions: { setCount(count) { this.count = count; } },
```

</details>

### 題目 3：如何選擇使用 Vuex 還是 Pinia？

<details>
<summary>點擊查看答案</summary>

**選擇建議**：

1. **新專案**

   - Vue 3 專案：**推薦使用 Pinia**
   - Vue 2 專案：使用 Vuex

2. **現有專案**

   - Vue 2 + Vuex：可以繼續使用 Vuex，或考慮升級到 Vue 3 + Pinia
   - Vue 3 + Vuex：可以考慮遷移到 Pinia（但非必須）

3. **專案需求**
   - 需要完整 TypeScript 支援：**選擇 Pinia**
   - 需要更簡潔的 API：**選擇 Pinia**
   - 團隊熟悉 Vuex：可以繼續使用 Vuex

**總結**：

- Vue 3 新專案：**強烈推薦 Pinia**
- Vue 2 專案：使用 Vuex
- 現有 Vue 3 + Vuex 專案：可以考慮遷移，但非必須

</details>

## 8. Best Practices

> 最佳實踐

### 推薦做法

```typescript
// 1. Pinia：使用 TypeScript 和明確的型別定義
export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: '',
    age: 0,
  }),
  // ...
});

// 2. Pinia：使用 storeToRefs 保持響應性
const { count, doubleCount } = storeToRefs(store);

// 3. Pinia：每個 store 保持單一職責
export const useAuthStore = defineStore('auth', { ... });
export const useUserStore = defineStore('user', { ... });
```

### 避免的做法

```typescript
// 1. ❌ 不要忘記使用 storeToRefs
const { count } = store; // 失去響應性

// 2. ❌ 不要建立過大的 store
// 應該拆分成多個小的 store

// 3. ❌ 不要在 actions 中直接修改其他 store
// 應該在 composable 中組合多個 store
```

## 9. Interview Summary

> 面試總結

### 快速記憶

**Vuex vs Pinia**：

| 特性           | Vuex        | Pinia       |
| -------------- | ----------- | ----------- |
| **Mutations**  | ✅ 需要     | ❌ 不需要   |
| **TypeScript** | ⚠️ 需要配置 | ✅ 原生支援 |
| **模組化**     | 嵌套模組    | 扁平化      |
| **API**        | 較複雜      | 更簡潔      |
| **Vue 版本**   | Vue 2       | Vue 3       |

**關鍵差異**：

1. Pinia 不需要 mutations，actions 可以直接修改 state
2. Pinia 有更好的 TypeScript 支援
3. Pinia 模組化更簡單，無需命名空間
4. Pinia 是 Vue 3 的官方推薦

### 面試回答範例

**Q: Vuex 和 Pinia 的主要差異是什麼？**

> "Vuex 和 Pinia 都是 Vue 的狀態管理工具，主要差異包括：1) API 複雜度：Vuex 需要 mutations 來同步修改 state，Pinia 不需要 mutations，actions 可以直接修改 state；2) TypeScript 支援：Vuex 需要額外配置，型別推斷不完整，Pinia 原生完整支援，自動型別推斷；3) 模組化：Vuex 使用嵌套模組，需要 namespaced，Pinia 每個 store 獨立，無需命名空間；4) 開發體驗：Pinia 體積更小、支援 HMR、更好的 Devtools 支援；5) Vue 版本：Vuex 主要用於 Vue 2，Pinia 是 Vue 3 的官方推薦。對於 Vue 3 新專案，我推薦使用 Pinia。"

**Q: 為什麼 Pinia 不需要 mutations？**

> "Pinia 不需要 mutations 主要有三個原因：1) Vue 3 使用 Proxy 作為響應式系統，可以直接追蹤物件的修改，不需要像 Vue 2 那樣透過 mutations 來追蹤狀態變化；2) 簡化 API，移除 mutations 可以減少樣板程式碼，actions 可以直接修改 state，無論是同步還是非同步操作；3) 提升開發體驗，減少一層抽象，開發者更容易理解和使用，不需要記住 commit 和 dispatch 的區別。"

## Reference

- [Vuex 官方文檔](https://vuex.vuejs.org/)
- [Pinia 官方文檔](https://pinia.vuejs.org/)
- [從 Vuex 遷移到 Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)
