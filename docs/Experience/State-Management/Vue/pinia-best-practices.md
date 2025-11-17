---
id: state-management-vue-pinia-best-practices
title: 'Pinia 最佳實踐與常見錯誤'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> 在多品牌平台專案中，Pinia Store 的最佳實踐與常見錯誤處理。

---

## 1. 面試回答主軸

1. **設計原則**：單一職責原則、保持 Store 精簡、避免在 Store 中直接調用 API。
2. **常見錯誤**：直接解構失去響應性、在 Setup 外部調用 Store、修改 State 破壞響應性、循環依賴。
3. **最佳實踐**：使用 TypeScript、職責分離、在 Composable 中組合多個 Store。

---

## 2. Store 設計原則

### 2.1 單一職責原則

```typescript
// ✅ 好的設計：每個 Store 只負責一個領域
useAuthStore(); // 只管認證
useUserInfoStore(); // 只管用戶資訊
useGameStore(); // 只管遊戲資訊

// ❌ 壞的設計：一個 Store 管理所有東西
useAppStore(); // 管理認證、用戶、遊戲、設定...
```

### 2.2 保持 Store 精簡

```typescript
// ✅ 推薦
export const useBannerStore = defineStore('bannerStore', () => {
  const bannerState = reactive({ list: [] });
  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list;
  }
  return { bannerState, setStoreBannerList };
});

// ❌ 不推薦：Store 中包含複雜的業務邏輯
// 應該放在 composable 中
```

### 2.3 避免在 Store 中直接調用 API

```typescript
// ❌ 不推薦：在 Store 中直接調用 API
export const useGameStore = defineStore('gameStore', {
  actions: {
    async fetchGames() {
      const data = await api.getGames(); // API 調用
      this.list = data;
    },
  },
});

// ✅ 推薦：在 Composable 中調用 API，Store 只負責存儲
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
    const { status, data } = await api.getGames(); // Composable 中調用 API
    if (status) {
      gameStore.setGameList(data); // Store 只負責存儲
    }
  }
  return { fetchGames };
}
```

---

## 3. 使用 TypeScript

```typescript
// ✅ 完整的型別定義
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

## 4. 常見錯誤

### 4.1 錯誤 1：直接解構導致響應性丟失

```typescript
// ❌ 錯誤
const { count } = useCounterStore();
count; // 不是響應式的

// ✅ 正確
const { count } = storeToRefs(useCounterStore());
count.value; // 響應式的
```

### 4.2 錯誤 2：在 Setup 外部調用 Store

```typescript
// ❌ 錯誤：在模組頂層調用
const authStore = useAuthStore(); // ❌ 錯誤時機

export function useAuth() {
  return {
    isLogin: authStore.isLogin,
  };
}

// ✅ 正確：在函數內部調用
export function useAuth() {
  const authStore = useAuthStore(); // ✅ 正確時機
  return {
    isLogin: authStore.isLogin,
  };
}
```

### 4.3 錯誤 3：修改 State 時破壞響應性

```typescript
// ❌ 錯誤：直接賦值新陣列
function updateList(newList) {
  gameState.list = newList; // 可能失去響應性
}

// ✅ 正確：使用 splice 或 push
function updateList(newList) {
  gameState.list.length = 0;
  gameState.list.push(...newList);
}

// ✅ 也可以使用 reactive 的賦值
function updateList(newList) {
  Object.assign(gameState, { list: newList });
}
```

### 4.4 錯誤 4：循環依賴

```typescript
// ❌ 錯誤：Store 之間相互依賴
// authStore.ts
import { useUserInfoStore } from './userInfoStore';
export const useAuthStore = defineStore('authStore', () => {
  const userInfoStore = useUserInfoStore(); // 依賴 userInfoStore
});

// userInfoStore.ts
import { useAuthStore } from './authStore';
export const useUserInfoStore = defineStore('useInfoStore', () => {
  const authStore = useAuthStore(); // 依賴 authStore ❌ 循環依賴
});

// ✅ 正確：在 Composable 中組合
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

### 4.5 錯誤 5：忘記 return

```typescript
// ❌ 錯誤：忘記 return
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  // ❌ 忘記 return，組件無法訪問
});

// ✅ 正確
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  return { gameState, updateList }; // ✅ 必須 return
});
```

---

## 5. 面試重點整理

### 5.1 Store 設計原則

**可以這樣回答：**

> 在設計 Pinia Store 時，遵循幾個原則：1) 單一職責原則，每個 Store 只負責一個領域；2) 保持 Store 精簡，不要包含複雜的業務邏輯；3) 避免在 Store 中直接調用 API，應該在 Composable 中調用 API，Store 只負責存儲；4) 使用 TypeScript 完整型別定義，提升開發體驗。

**關鍵點：**
- ✅ 單一職責原則
- ✅ Store 精簡
- ✅ 職責分離
- ✅ TypeScript 使用

### 5.2 常見錯誤與避免

**可以這樣回答：**

> 在使用 Pinia 時，常見的錯誤包括：1) 直接解構導致響應性丟失，必須使用 `storeToRefs`；2) 在 Setup 外部調用 Store，應該在函數內部調用；3) 修改 State 時破壞響應性，使用 `.length = 0` 或 `Object.assign`；4) 循環依賴，在 Composable 中組合多個 Store；5) 忘記 return，Composition API Store 必須 return。

**關鍵點：**
- ✅ 響應性保持
- ✅ 調用時機
- ✅ 狀態修改方式
- ✅ 避免循環依賴

---

## 6. 面試總結

**可以這樣回答：**

> 在專案中使用 Pinia 時，遵循幾個最佳實踐：1) Store 設計遵循單一職責原則，保持精簡；2) 避免在 Store 中直接調用 API，在 Composable 中調用；3) 使用 TypeScript 完整型別定義；4) 注意常見錯誤，如響應性丟失、循環依賴等。這些實踐確保 Store 的可維護性和擴展性。

**關鍵點：**
- ✅ Store 設計原則
- ✅ 常見錯誤與避免
- ✅ 最佳實踐
- ✅ 實際專案經驗

