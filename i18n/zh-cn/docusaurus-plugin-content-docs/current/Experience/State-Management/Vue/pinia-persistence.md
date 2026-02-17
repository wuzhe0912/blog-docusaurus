---
id: state-management-vue-pinia-persistence
title: 'Pinia 持久化策略'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> 在多品牌平台项目中，Pinia Store 的持久化策略：使用 `piniaPluginPersistedstate` 和 VueUse 的 `useSessionStorage`。

---

## 1. 面试回答主轴

1. **三种持久化方式**：`persist: true`、`useSessionStorage`、手动持久化。
2. **选择策略**：整个 Store 需持久化用 `persist: true`，特定字段用 `useSessionStorage`。
3. **安全考量**：敏感信息不持久化，用户偏好持久化。

---

## 2. 持久化方式

### 2.1 Pinia Plugin Persistedstate

**Options API：**

```typescript
export const useLanguageStore = defineStore('languageStore', {
  state: () => ({ lang: '', defaultLang: '' }),
  persist: true, // 自动持久化到 localStorage
});
```

**自定义配置：**

```typescript
persist: {
  key: 'my-store',
  storage: sessionStorage,
  paths: ['lang'], // 只持久化特定字段
}
```

### 2.2 VueUse 的 useSessionStorage / useLocalStorage

```typescript
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // 自动持久化到 sessionStorage
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);
  return { isDarkMode };
});
```

### 2.3 手动持久化（不推荐）

```typescript
export const useCustomStore = defineStore('custom', {
  state: () => ({ token: '' }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // 手动保存
    },
  },
});
```

---

## 3. 对比表格

| 方式                  | 优点           | 缺点                | 使用场景            |
| --------------------- | -------------- | ------------------- | ------------------- |
| **persist: true**     | 自动、简单     | 整个 state 都持久化 | 整个 Store 需持久化 |
| **useSessionStorage** | 灵活、类型安全 | 需要逐个定义        | 特定字段持久化      |
| **手动持久化**        | 完全控制       | 容易出错、维护困难  | 不推荐              |

---

## 4. 重置 Store 状态

### 4.1 使用 Pinia 内建的 `$reset()`

```typescript
// Options API Store 支持
const store = useMyStore();
store.$reset(); // 重置为初始状态
```

### 4.2 自定义重置方法

```typescript
// Composition API Store
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({
    list: [],
    favoriteList: [],
  });

  function resetGameStore() {
    gameState.list = [];
    gameState.favoriteList = [];
  }

  return { gameState, resetGameStore };
});
```

### 4.3 批量重置（实际案例）

```typescript
// src/common/hooks/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  function reset() {
    // 重置多个 store
    authStore.$reset();
    userInfoStore.$reset();
    gameStore.resetGameStore();
  }

  async function handleLogout() {
    await api.logout();
    reset(); // 登出时重置所有状态
    router.push('/');
  }

  return { reset, handleLogout };
}
```

---

## 5. 最佳实践

### 5.1 持久化策略

```typescript
// ✅ 敏感信息不持久化
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined, // 持久化
    user_password: undefined, // ❌ 绝对不要持久化密码
  }),
  persist: {
    paths: ['access_token'], // 只持久化 token
  },
});
```

### 5.2 使用 `$patch` 批量更新

```typescript
// ❌ 不推荐：多次更新（触发多次响应）
authStore.access_token = data.access_token;
authStore.user_id = data.user_id;
authStore.agent_id = data.agent_id;

// ✅ 推荐：批量更新（只触发一次响应）
authStore.$patch({
  access_token: data.access_token,
  user_id: data.user_id,
  agent_id: data.agent_id,
});

// ✅ 也可以使用函数形式
authStore.$patch((state) => {
  state.access_token = data.access_token;
  state.user_id = data.user_id;
  state.agent_id = data.agent_id;
});
```

---

## 6. 面试重点整理

### 6.1 持久化方式选择

**可以这样回答：**

> 在项目中使用三种持久化方式：1) `persist: true`，整个 Store 自动持久化到 localStorage，适合整个 Store 都需要持久化的场景；2) `useSessionStorage` 或 `useLocalStorage`，特定字段持久化，更灵活且类型安全；3) 手动持久化，不推荐。选择上，敏感信息不持久化，用户偏好持久化。

**关键点：**
- ✅ 三种持久化方式
- ✅ 选择策略
- ✅ 安全考量

### 6.2 批量更新与重置

**可以这样回答：**

> 在更新 Store 状态时，使用 `$patch` 批量更新，只触发一次响应，提升性能。在重置状态时，Options API Store 可以使用 `$reset()`，Composition API Store 需要自定义重置方法。登出时可以批量重置多个 Store，确保状态清理干净。

**关键点：**
- ✅ `$patch` 批量更新
- ✅ 重置状态的方法
- ✅ 批量重置策略

---

## 7. 面试总结

**可以这样回答：**

> 在项目中实作 Pinia Store 持久化时，使用 `persist: true` 实现整个 Store 的自动持久化，或使用 `useSessionStorage` 实现特定字段的持久化。选择策略是敏感信息不持久化，用户偏好持久化。在更新状态时使用 `$patch` 批量更新，提升性能。重置状态时，Options API 使用 `$reset()`，Composition API 自定义重置方法。

**关键点：**
- ✅ 持久化方式与选择
- ✅ 批量更新策略
- ✅ 重置状态方法
- ✅ 实际项目经验
