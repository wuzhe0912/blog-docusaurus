---
id: state-management-vue-pinia-store-patterns
title: 'Pinia Store 實作模式'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> 在多品牌平台專案中，使用 Options API 和 Composition API 兩種寫法實作 Pinia Store，根據場景選擇合適的模式。

---

## 1. 面試回答主軸

1. **兩種寫法**：Options API 和 Composition API，根據場景選擇。
2. **選擇策略**：簡單 Store 用 Composition API，需持久化的用 Options API，複雜邏輯用 Composition API。
3. **關鍵差異**：State 必須是函數、Actions 中 `this` 指向 store、Getters 的兩種寫法。

---

## 2. Options API（傳統寫法）

### 2.1 基本結構

```typescript
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';
import { computed } from 'vue';

type State = Response.login & {
  onBoarding: boolean;
  totpStatus: Response.GetTotpStatus;
};

export const useAuthStore = defineStore('authStore', {
  // 1️⃣ State: 定義狀態
  state: (): Partial<State> => ({
    access_token: undefined,
    agent_id: undefined,
    user_id: undefined,
    onBoarding: false,
    totpStatus: undefined,
  }),

  // 2️⃣ Actions: 定義方法
  actions: {
    setTotpStatus(data: Response.GetTotpStatus) {
      this.totpStatus = data;
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status;
    },
  },

  // 3️⃣ Getters: 定義計算屬性
  getters: {
    isLogin: (state) => !!state.access_token,
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) =>
      computed(() => state.totpStatus?.is_enabled ?? false),
  },

  // 4️⃣ 持久化配置
  persist: true, // 自動持久化到 localStorage
});
```

### 2.2 關鍵重點

**1. State 必須是函數**

```typescript
// ✅ 正確
state: () => ({ count: 0 });

// ❌ 錯誤（會導致多個實例共享狀態）
state: {
  count: 0;
}
```

**2. Actions 中的 `this` 指向 store 實例**

```typescript
actions: {
  increment() {
    this.count++; // 直接修改 state
  },
};
```

**3. Getters 的兩種寫法**

```typescript
getters: {
  // 方式一：直接返回值（推薦）
  doubleCount: (state) => state.count * 2,

  // 方式二：返回 computed（響應式更新）
  tripleCount: (state) => computed(() => state.count * 3),
};
```

---

## 3. Composition API / Setup（現代寫法）

### 3.1 簡單 Store 範例

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

**面試重點**：
- 使用 `@vueuse/core` 的 `useSessionStorage` 實現持久化
- 更接近 Composition API 的寫法
- 所有 `ref` 或 `reactive` 都是 state
- 所有函數都是 actions
- 所有 `computed` 都是 getters

### 3.2 複雜 Store 範例

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
    gameState.favoriteList.length = 0; // 保持響應性
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

**關鍵重點**：

**1. 使用 `reactive` vs `ref`**

```typescript
// 📌 使用 reactive（推薦用於複雜物件）
const state = reactive({
  count: 0,
  user: { name: 'John' },
});
state.count++; // 直接訪問

// 📌 使用 ref（推薦用於基本類型）
const count = ref(0);
count.value++; // 需要 .value
```

**2. 為什麼使用 `.length = 0` 清空陣列？**

```typescript
// ✅ 保持響應性（推薦）
gameState.favoriteList.length = 0;

// ❌ 會失去響應性
gameState.favoriteList = [];
```

---

## 4. 兩種寫法的對比

| 特性                | Options API        | Composition API (Setup)        |
| ------------------- | ------------------ | ------------------------------ |
| **語法風格**        | 物件配置           | 函數式                         |
| **學習曲線**        | 較低（類似 Vue 2） | 較高（需理解 Composition API） |
| **TypeScript 支援** | 好                 | 更好                           |
| **靈活性**          | 中等               | 高（可自由組合邏輯）           |
| **可讀性**          | 結構清晰           | 需良好組織                     |
| **推薦場景**        | 簡單 Store         | 複雜邏輯、需組合功能           |

**本專案的選擇策略**：
- **簡單 Store（< 5 個 state）**: Composition API
- **需持久化的 Store**: Options API + `persist: true`
- **複雜業務邏輯**: Composition API（更靈活）
- **需要 Getter 的 Store**: Options API（語法更清晰）

---

## 5. 面試重點整理

### 5.1 兩種寫法的選擇

**可以這樣回答：**

> 在專案中使用兩種 Store 定義方式：Options API 和 Composition API。Options API 使用物件配置，語法類似 Vue 2，學習曲線較低，適合簡單 Store 和需要持久化的 Store。Composition API 使用函數式寫法，更靈活，TypeScript 支援更好，適合複雜邏輯。選擇策略是：簡單 Store 用 Composition API，需持久化的用 Options API，複雜業務邏輯用 Composition API。

**關鍵點：**
- ✅ 兩種寫法的差異
- ✅ 選擇策略
- ✅ 實際專案經驗

### 5.2 關鍵技術點

**可以這樣回答：**

> 在實作 Store 時，有幾個關鍵技術點：1) State 必須是函數，避免多實例共享狀態；2) Actions 中的 `this` 指向 store 實例，可以直接修改 state；3) Getters 有兩種寫法，可以直接返回值或返回 computed；4) 使用 `reactive` 處理複雜物件，使用 `ref` 處理基本類型；5) 清空陣列時使用 `.length = 0` 保持響應性。

**關鍵點：**
- ✅ State 必須是函數
- ✅ Actions 中 `this` 的使用
- ✅ Getters 的寫法
- ✅ reactive vs ref
- ✅ 響應性保持

---

## 6. 面試總結

**可以這樣回答：**

> 在專案中使用 Options API 和 Composition API 兩種寫法實作 Pinia Store。Options API 適合簡單 Store 和需要持久化的 Store，語法清晰。Composition API 適合複雜邏輯，更靈活且 TypeScript 支援更好。選擇策略是根據 Store 的複雜度和需求來決定。關鍵技術點包括：State 必須是函數、Actions 中 `this` 的使用、Getters 的兩種寫法、以及響應性的保持。

**關鍵點：**
- ✅ 兩種寫法的差異與選擇
- ✅ 關鍵技術點
- ✅ 實際專案經驗

