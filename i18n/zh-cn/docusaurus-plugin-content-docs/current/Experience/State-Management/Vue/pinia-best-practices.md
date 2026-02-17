---
id: state-management-vue-pinia-best-practices
title: 'Pinia 最佳实践与常见错误'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> 在多品牌平台项目中，Pinia Store 的最佳实践与常见错误处理。

---

## 1. 面试回答主轴

1. **设计原则**：单一职责原则、保持 Store 精简、避免在 Store 中直接调用 API。
2. **常见错误**：直接解构失去响应性、在 Setup 外部调用 Store、修改 State 破坏响应性、循环依赖。
3. **最佳实践**：使用 TypeScript、职责分离、在 Composable 中组合多个 Store。

---

## 2. Store 设计原则

### 2.1 单一职责原则

```typescript
// ✅ 好的设计：每个 Store 只负责一个领域
useAuthStore(); // 只管认证
useUserInfoStore(); // 只管用户信息
useGameStore(); // 只管游戏信息

// ❌ 坏的设计：一个 Store 管理所有东西
useAppStore(); // 管理认证、用户、游戏、设定...
```

### 2.2 保持 Store 精简

```typescript
// ✅ 推荐
export const useBannerStore = defineStore('bannerStore', () => {
  const bannerState = reactive({ list: [] });
  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list;
  }
  return { bannerState, setStoreBannerList };
});

// ❌ 不推荐：Store 中包含复杂的业务逻辑
// 应该放在 composable 中
```

### 2.3 避免在 Store 中直接调用 API

```typescript
// ❌ 不推荐：在 Store 中直接调用 API
export const useGameStore = defineStore('gameStore', {
  actions: {
    async fetchGames() {
      const data = await api.getGames(); // API 调用
      this.list = data;
    },
  },
});

// ✅ 推荐：在 Composable 中调用 API，Store 只负责存储
export const useGameStore = defineStore('gameStore', {
  actions: {
    setGameList(list: Game[]) {
      this.list = list;
    },
  },
});

export function useGame() {
  const gameStore = useGameStore();
  async function fetchGames() {
    const { status, data } = await api.getGames(); // Composable 中调用 API
    if (status) {
      gameStore.setGameList(data); // Store 只负责存储
    }
  }
  return { fetchGames };
}
```

---

## 3. 使用 TypeScript

```typescript
// ✅ 完整的类型定义
type UserState = {
  info: Response.UserInfo;
  walletList: Response.UserWalletList;
};

export const useUserInfoStore = defineStore('useInfoStore', () => {
  const state = reactive<UserState>({
    info: {} as Response.UserInfo,
    walletList: [],
  });
  return { state };
});
```

---

## 4. 常见错误

### 4.1 错误 1：直接解构导致响应性丢失

```typescript
// ❌ 错误
const { count } = useCounterStore();
count; // 不是响应式的

// ✅ 正确
const { count } = storeToRefs(useCounterStore());
count.value; // 响应式的
```

### 4.2 错误 2：在 Setup 外部调用 Store

```typescript
// ❌ 错误：在模块顶层调用
const authStore = useAuthStore(); // ❌ 错误时机

export function useAuth() {
  return {
    isLogin: authStore.isLogin,
  };
}

// ✅ 正确：在函数内部调用
export function useAuth() {
  const authStore = useAuthStore(); // ✅ 正确时机
  return {
    isLogin: authStore.isLogin,
  };
}
```

### 4.3 错误 3：修改 State 时破坏响应性

```typescript
// ❌ 错误：直接赋值新数组
function updateList(newList) {
  gameState.list = newList; // 可能失去响应性
}

// ✅ 正确：使用 splice 或 push
function updateList(newList) {
  gameState.list.length = 0;
  gameState.list.push(...newList);
}

// ✅ 也可以使用 reactive 的赋值
function updateList(newList) {
  Object.assign(gameState, { list: newList });
}
```

### 4.4 错误 4：循环依赖

```typescript
// ❌ 错误：Store 之间相互依赖
// authStore.ts
import { useUserInfoStore } from './userInfoStore';
export const useAuthStore = defineStore('authStore', () => {
  const userInfoStore = useUserInfoStore(); // 依赖 userInfoStore
});

// userInfoStore.ts
import { useAuthStore } from './authStore';
export const useUserInfoStore = defineStore('useInfoStore', () => {
  const authStore = useAuthStore(); // 依赖 authStore ❌ 循环依赖
});

// ✅ 正确：在 Composable 中组合
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  async function initialize() {
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
    }
  }
  return { initialize };
}
```

### 4.5 错误 5：忘记 return

```typescript
// ❌ 错误：忘记 return
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  // ❌ 忘记 return，组件无法访问
});

// ✅ 正确
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  return { gameState, updateList }; // ✅ 必须 return
});
```

---

## 5. 面试重点整理

### 5.1 Store 设计原则

**可以这样回答：**

> 在设计 Pinia Store 时，遵循几个原则：1) 单一职责原则，每个 Store 只负责一个领域；2) 保持 Store 精简，不要包含复杂的业务逻辑；3) 避免在 Store 中直接调用 API，应该在 Composable 中调用 API，Store 只负责存储；4) 使用 TypeScript 完整类型定义，提升开发体验。

**关键点：**
- ✅ 单一职责原则
- ✅ Store 精简
- ✅ 职责分离
- ✅ TypeScript 使用

### 5.2 常见错误与避免

**可以这样回答：**

> 在使用 Pinia 时，常见的错误包括：1) 直接解构导致响应性丢失，必须使用 `storeToRefs`；2) 在 Setup 外部调用 Store，应该在函数内部调用；3) 修改 State 时破坏响应性，使用 `.length = 0` 或 `Object.assign`；4) 循环依赖，在 Composable 中组合多个 Store；5) 忘记 return，Composition API Store 必须 return。

**关键点：**
- ✅ 响应性保持
- ✅ 调用时机
- ✅ 状态修改方式
- ✅ 避免循环依赖

---

## 6. 面试总结

**可以这样回答：**

> 在项目中使用 Pinia 时，遵循几个最佳实践：1) Store 设计遵循单一职责原则，保持精简；2) 避免在 Store 中直接调用 API，在 Composable 中调用；3) 使用 TypeScript 完整类型定义；4) 注意常见错误，如响应性丢失、循环依赖等。这些实践确保 Store 的可维护性和扩展性。

**关键点：**
- ✅ Store 设计原则
- ✅ 常见错误与避免
- ✅ 最佳实践
- ✅ 实际项目经验
