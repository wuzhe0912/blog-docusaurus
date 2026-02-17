---
id: state-management-vue-pinia-store-patterns
title: 'Pinia Store 实作模式'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> 在多品牌平台项目中，使用 Options API 和 Composition API 两种写法实作 Pinia Store，根据场景选择合适的模式。

---

## 1. 面试回答主轴

1. **两种写法**：Options API 和 Composition API，根据场景选择。
2. **选择策略**：简单 Store 用 Composition API，需持久化的用 Options API，复杂逻辑用 Composition API。
3. **关键差异**：State 必须是函数、Actions 中 `this` 指向 store、Getters 的两种写法。

---

## 2. Options API（传统写法）

### 2.1 基本结构

```typescript
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';
import { computed } from 'vue';

type State = Response.login & {
  onBoarding: boolean;
  totpStatus: Response.GetTotpStatus;
};

export const useAuthStore = defineStore('authStore', {
  // 1️⃣ State: 定义状态
  state: (): Partial<State> => ({
    access_token: undefined,
    agent_id: undefined,
    user_id: undefined,
    onBoarding: false,
    totpStatus: undefined,
  }),

  // 2️⃣ Actions: 定义方法
  actions: {
    setTotpStatus(data: Response.GetTotpStatus) {
      this.totpStatus = data;
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status;
    },
  },

  // 3️⃣ Getters: 定义计算属性
  getters: {
    isLogin: (state) => !!state.access_token,
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) =>
      computed(() => state.totpStatus?.is_enabled ?? false),
  },

  // 4️⃣ 持久化配置
  persist: true, // 自动持久化到 localStorage
});
```

### 2.2 关键重点

**1. State 必须是函数**

```typescript
// ✅ 正确
state: () => ({ count: 0 });

// ❌ 错误（会导致多个实例共享状态）
state: {
  count: 0;
}
```

**2. Actions 中的 `this` 指向 store 实例**

```typescript
actions: {
  increment() {
    this.count++; // 直接修改 state
  },
};
```

**3. Getters 的两种写法**

```typescript
getters: {
  // 方式一：直接返回值（推荐）
  doubleCount: (state) => state.count * 2,

  // 方式二：返回 computed（响应式更新）
  tripleCount: (state) => computed(() => state.count * 3),
};
```

---

## 3. Composition API / Setup（现代写法）

### 3.1 简单 Store 范例

```typescript
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // 📦 State
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // 🔧 Actions
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  // 📤 Export
  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

**面试重点**：
- 使用 `@vueuse/core` 的 `useSessionStorage` 实现持久化
- 更接近 Composition API 的写法
- 所有 `ref` 或 `reactive` 都是 state
- 所有函数都是 actions
- 所有 `computed` 都是 getters

### 3.2 复杂 Store 范例

```typescript
import { reactive } from 'vue';
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';

type GameState = {
  list: Response.GameList;
  allGameList: Response.AllGameList;
  favoriteList: Response.FavoriteList;
  favoriteMap: Response.FavoriteMap;
};

export const useGameStore = defineStore('gameStore', () => {
  // 📦 State (使用 reactive)
  const gameState = reactive<GameState>({
    list: [],
    allGameList: {
      FISHING: [],
      LIVE_CASINO: [],
      SLOT: [],
    },
    favoriteList: [],
    favoriteMap: {},
  });

  // 🔧 Actions
  function updateAllGameList(data: Response.AllGameList) {
    gameState.allGameList.FISHING = data.FISHING;
    gameState.allGameList.LIVE_CASINO = data.LIVE_CASINO;
    gameState.allGameList.SLOT = data.SLOT;
  }

  function updateFavoriteList(data: Response.FavoriteList) {
    gameState.favoriteList = data;
    gameState.favoriteMap = {};
    data.forEach((gameId) => {
      gameState.favoriteMap[gameId] = true;
    });
  }

  function removeFavoriteList() {
    gameState.favoriteList.length = 0; // 保持响应性
    gameState.favoriteMap = {};
  }

  // 📤 Export
  return {
    gameState,
    updateAllGameList,
    updateFavoriteList,
    removeFavoriteList,
  };
});
```

**关键重点**：

**1. 使用 `reactive` vs `ref`**

```typescript
// 📌 使用 reactive（推荐用于复杂对象）
const state = reactive({
  count: 0,
  user: { name: 'John' },
});
state.count++; // 直接访问

// 📌 使用 ref（推荐用于基本类型）
const count = ref(0);
count.value++; // 需要 .value
```

**2. 为什么使用 `.length = 0` 清空数组？**

```typescript
// ✅ 保持响应性（推荐）
gameState.favoriteList.length = 0;

// ❌ 会失去响应性
gameState.favoriteList = [];
```

---

## 4. 两种写法的对比

| 特性                | Options API        | Composition API (Setup)        |
| ------------------- | ------------------ | ------------------------------ |
| **语法风格**        | 对象配置           | 函数式                         |
| **学习曲线**        | 较低（类似 Vue 2） | 较高（需理解 Composition API） |
| **TypeScript 支持** | 好                 | 更好                           |
| **灵活性**          | 中等               | 高（可自由组合逻辑）           |
| **可读性**          | 结构清晰           | 需良好组织                     |
| **推荐场景**        | 简单 Store         | 复杂逻辑、需组合功能           |

**本项目的选择策略**：
- **简单 Store（< 5 个 state）**: Composition API
- **需持久化的 Store**: Options API + `persist: true`
- **复杂业务逻辑**: Composition API（更灵活）
- **需要 Getter 的 Store**: Options API（语法更清晰）

---

## 5. 面试重点整理

### 5.1 两种写法的选择

**可以这样回答：**

> 在项目中使用两种 Store 定义方式：Options API 和 Composition API。Options API 使用对象配置，语法类似 Vue 2，学习曲线较低，适合简单 Store 和需要持久化的 Store。Composition API 使用函数式写法，更灵活，TypeScript 支持更好，适合复杂逻辑。选择策略是：简单 Store 用 Composition API，需持久化的用 Options API，复杂业务逻辑用 Composition API。

**关键点：**
- ✅ 两种写法的差异
- ✅ 选择策略
- ✅ 实际项目经验

### 5.2 关键技术点

**可以这样回答：**

> 在实作 Store 时，有几个关键技术点：1) State 必须是函数，避免多实例共享状态；2) Actions 中的 `this` 指向 store 实例，可以直接修改 state；3) Getters 有两种写法，可以直接返回值或返回 computed；4) 使用 `reactive` 处理复杂对象，使用 `ref` 处理基本类型；5) 清空数组时使用 `.length = 0` 保持响应性。

**关键点：**
- ✅ State 必须是函数
- ✅ Actions 中 `this` 的使用
- ✅ Getters 的写法
- ✅ reactive vs ref
- ✅ 响应性保持

---

## 6. 面试总结

**可以这样回答：**

> 在项目中使用 Options API 和 Composition API 两种写法实作 Pinia Store。Options API 适合简单 Store 和需要持久化的 Store，语法清晰。Composition API 适合复杂逻辑，更灵活且 TypeScript 支持更好。选择策略是根据 Store 的复杂度和需求来决定。关键技术点包括：State 必须是函数、Actions 中 `this` 的使用、Getters 的两种写法、以及响应性的保持。

**关键点：**
- ✅ 两种写法的差异与选择
- ✅ 关键技术点
- ✅ 实际项目经验
