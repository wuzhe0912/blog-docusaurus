---
id: state-management-vue-pinia-persistence
title: 'Pinia 持久化策略'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> 在多品牌平台專案中，Pinia Store 的持久化策略：使用 `piniaPluginPersistedstate` 和 VueUse 的 `useSessionStorage`。

---

## 1. 面試回答主軸

1. **三種持久化方式**：`persist: true`、`useSessionStorage`、手動持久化。
2. **選擇策略**：整個 Store 需持久化用 `persist: true`，特定欄位用 `useSessionStorage`。
3. **安全考量**：敏感資訊不持久化，用戶偏好持久化。

---

## 2. 持久化方式

### 2.1 Pinia Plugin Persistedstate

**Options API：**

```typescript
export const useLanguageStore = defineStore('languageStore', {
  state: () => ({ lang: '', defaultLang: '' }),
  persist: true, // 自動持久化到 localStorage
});
```

**自定義配置：**

```typescript
persist: {
  key: 'my-store',
  storage: sessionStorage,
  paths: ['lang'], // 只持久化特定欄位
}
```

### 2.2 VueUse 的 useSessionStorage / useLocalStorage

```typescript
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // 自動持久化到 sessionStorage
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);
  return { isDarkMode };
});
```

### 2.3 手動持久化（不推薦）

```typescript
export const useCustomStore = defineStore('custom', {
  state: () => ({ token: '' }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // 手動保存
    },
  },
});
```

---

## 3. 對比表格

| 方式                  | 優點           | 缺點                | 使用場景            |
| --------------------- | -------------- | ------------------- | ------------------- |
| **persist: true**     | 自動、簡單     | 整個 state 都持久化 | 整個 Store 需持久化 |
| **useSessionStorage** | 靈活、類型安全 | 需要逐個定義        | 特定欄位持久化      |
| **手動持久化**        | 完全控制       | 容易出錯、維護困難  | 不推薦              |

---

## 4. 重置 Store 狀態

### 4.1 使用 Pinia 內建的 `$reset()`

```typescript
// Options API Store 支援
const store = useMyStore();
store.$reset(); // 重置為初始狀態
```

### 4.2 自定義重置方法

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

### 4.3 批量重置（實際案例）

```typescript
// src/common/hooks/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  function reset() {
    // 重置多個 store
    authStore.$reset();
    userInfoStore.$reset();
    gameStore.resetGameStore();
  }

  async function handleLogout() {
    await api.logout();
    reset(); // 登出時重置所有狀態
    router.push('/');
  }

  return { reset, handleLogout };
}
```

---

## 5. 最佳實踐

### 5.1 持久化策略

```typescript
// ✅ 敏感資訊不持久化
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined, // 持久化
    user_password: undefined, // ❌ 絕對不要持久化密碼
  }),
  persist: {
    paths: ['access_token'], // 只持久化 token
  },
});
```

### 5.2 使用 `$patch` 批量更新

```typescript
// ❌ 不推薦：多次更新（觸發多次響應）
authStore.access_token = data.access_token;
authStore.user_id = data.user_id;
authStore.agent_id = data.agent_id;

// ✅ 推薦：批量更新（只觸發一次響應）
authStore.$patch({
  access_token: data.access_token,
  user_id: data.user_id,
  agent_id: data.agent_id,
});

// ✅ 也可以使用函數形式
authStore.$patch((state) => {
  state.access_token = data.access_token;
  state.user_id = data.user_id;
  state.agent_id = data.agent_id;
});
```

---

## 6. 面試重點整理

### 6.1 持久化方式選擇

**可以這樣回答：**

> 在專案中使用三種持久化方式：1) `persist: true`，整個 Store 自動持久化到 localStorage，適合整個 Store 都需要持久化的場景；2) `useSessionStorage` 或 `useLocalStorage`，特定欄位持久化，更靈活且類型安全；3) 手動持久化，不推薦。選擇上，敏感資訊不持久化，用戶偏好持久化。

**關鍵點：**
- ✅ 三種持久化方式
- ✅ 選擇策略
- ✅ 安全考量

### 6.2 批量更新與重置

**可以這樣回答：**

> 在更新 Store 狀態時，使用 `$patch` 批量更新，只觸發一次響應，提升效能。在重置狀態時，Options API Store 可以使用 `$reset()`，Composition API Store 需要自定義重置方法。登出時可以批量重置多個 Store，確保狀態清理乾淨。

**關鍵點：**
- ✅ `$patch` 批量更新
- ✅ 重置狀態的方法
- ✅ 批量重置策略

---

## 7. 面試總結

**可以這樣回答：**

> 在專案中實作 Pinia Store 持久化時，使用 `persist: true` 實現整個 Store 的自動持久化，或使用 `useSessionStorage` 實現特定欄位的持久化。選擇策略是敏感資訊不持久化，用戶偏好持久化。在更新狀態時使用 `$patch` 批量更新，提升效能。重置狀態時，Options API 使用 `$reset()`，Composition API 自定義重置方法。

**關鍵點：**
- ✅ 持久化方式與選擇
- ✅ 批量更新策略
- ✅ 重置狀態方法
- ✅ 實際專案經驗

