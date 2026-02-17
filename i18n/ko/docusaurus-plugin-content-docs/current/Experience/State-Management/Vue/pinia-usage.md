---
id: state-management-vue-pinia-usage
title: 'Pinia 使用實踐'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> 在多品牌平台專案中，Pinia Store 在組件和 Composables 中的使用方式，以及 Store 之間的通訊模式。

---

## 1. 面試回答主軸

1. **組件使用**：使用 `storeToRefs` 保持響應性，Actions 可以直接解構。
2. **Composables 組合**：在 Composables 中組合多個 Store，封裝業務邏輯。
3. **Store 通訊**：推薦在 Composable 中組合，避免循環依賴。

---

## 2. 在組件中使用 Store

### 2.1 基本使用

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';

// 直接使用 store 實例
const authStore = useAuthStore();

// 訪問 state
console.log(authStore.access_token);

// 調用 action
authStore.setToptVerified(true);

// 訪問 getter
console.log(authStore.isLogin);
</script>
```

### 2.2 使用 `storeToRefs` 解構（重要！）

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

// ❌ 錯誤：會失去響應性
const { access_token, isLogin } = authStore;

// ✅ 正確：保持響應性
const { access_token, isLogin } = storeToRefs(authStore);

// ✅ Actions 可以直接解構（不需要 storeToRefs）
const { setToptVerified } = authStore;
</script>
```

**為什麼直接解構會失去響應性？**

- Pinia 的 state 和 getters 是響應式的
- 直接解構會破壞響應式連接
- `storeToRefs` 會將每個屬性轉換為 `ref`，保持響應性
- Actions 本身不是響應式的，所以可以直接解構

---

## 3. 在 Composables 中使用 Store

### 3.1 實際案例：useGame.ts

Composables 是組合 Store 邏輯的最佳場所。

```typescript
import { useGameStore } from 'stores/gameStore';
import { useProductStore } from 'stores/productStore';
import { storeToRefs } from 'pinia';

export function useGame() {
  // 1️⃣ 引入多個 stores
  const gameStore = useGameStore();
  const productStore = useProductStore();

  // 2️⃣ 解構 state 和 getters（使用 storeToRefs）
  const { gameState } = storeToRefs(gameStore);
  const { productState } = storeToRefs(productStore);

  // 3️⃣ 解構 actions（直接解構）
  const { initAllGameList, updateAllGameList } = gameStore;

  // 4️⃣ 組合邏輯
  async function initGameTypeList() {
    const { status, data } = await useApi(getGameTypes);
    if (status) {
      setGameTypeList(data.list);
      setGameTypeMap(data.map);
    }
  }

  // 5️⃣ 返回給組件使用
  return {
    gameState,
    productState,
    initGameTypeList,
    initAllGameList,
  };
}
```

**面試重點**：
- Composables 是組合 Store 邏輯的最佳場所
- 使用 `storeToRefs` 確保響應性
- Actions 可以直接解構
- 將複雜的業務邏輯封裝在 composable 中

---

## 4. Store 之間的通訊

### 4.1 方法一：在 Store 內部調用其他 Store

```typescript
import { defineStore } from 'pinia';
import { useUserInfoStore } from './userInfoStore';

export const useAuthStore = defineStore('authStore', {
  actions: {
    async login(credentials) {
      const { status, data } = await api.login(credentials);
      if (status) {
        this.access_token = data.access_token;

        // 調用其他 store 的方法
        const userInfoStore = useUserInfoStore();
        userInfoStore.setStoreUserInfo(data.user);
      }
    },
  },
});
```

### 4.2 方法二：在 Composable 中組合多個 Store（推薦）

```typescript
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  async function initialize() {
    // 依序執行多個 store 的初始化
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
      await gameStore.initGameList();
    }
  }

  return { initialize };
}
```

**面試重點**：
- ✅ 推薦在 Composable 中組合多個 Store
- ❌ 避免 Store 之間的循環依賴
- 🎯 保持 Store 的單一職責原則

---

## 5. 實戰案例：用戶登入流程

這是一個完整的 Store 使用流程，涵蓋了多個 Store 的協作。

### 5.1 流程圖

```
用戶點擊登入按鈕
     ↓
調用 useAuth().handleLogin()
     ↓
API 請求登入
     ↓
成功 → authStore 儲存 token
     ↓
useUserInfo().getUserInfo()
     ↓
userInfoStore 儲存用戶資訊
     ↓
useGame().initGameList()
     ↓
gameStore 儲存遊戲列表
     ↓
跳轉到首頁
```

### 5.2 程式碼實作

```typescript
// 1️⃣ authStore.ts - 管理認證狀態
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined as string | undefined,
    user_id: undefined as number | undefined,
  }),
  getters: {
    isLogin: (state) => !!state.access_token,
  },
  persist: true, // 持久化認證資訊
});

// 2️⃣ userInfoStore.ts - 管理用戶資訊
export const useUserInfoStore = defineStore('useInfoStore', {
  state: () => ({
    info: {} as Response.UserInfo,
  }),
  actions: {
    setStoreUserInfo(userInfo: Response.UserInfo) {
      this.info = userInfo;
    },
  },
  persist: false, // 不持久化（敏感資訊）
});

// 3️⃣ useAuth.ts - 組合認證邏輯
export function useAuth() {
  const authStore = useAuthStore();
  const { access_token } = storeToRefs(authStore);
  const { isLogin } = storeToRefs(authStore);

  async function handleLogin(credentials: LoginCredentials) {
    const { status, data } = await api.login(credentials);
    if (status) {
      // 更新 authStore
      authStore.$patch({
        access_token: data.access_token,
        user_id: data.user_id,
      });
      return true;
    }
    return false;
  }

  return {
    access_token,
    isLogin,
    handleLogin,
  };
}

// 4️⃣ LoginPage.vue - 登入頁面
<script setup lang="ts">
import { useAuth } from 'src/common/hooks/useAuth';
import { useUserInfo } from 'src/common/composables/useUserInfo';
import { useGame } from 'src/common/composables/useGame';
import { useRouter } from 'vue-router';

const { handleLogin } = useAuth();
const { getUserInfo } = useUserInfo();
const { initGameList } = useGame();
const router = useRouter();

const onSubmit = async (formData: LoginForm) => {
  // 步驟 1: 登入
  const success = await handleLogin(formData);
  if (success) {
    // 步驟 2: 獲取用戶資訊
    await getUserInfo();
    // 步驟 3: 初始化遊戲列表
    await initGameList();
    // 步驟 4: 跳轉首頁
    router.push('/');
  }
};
</script>
```

**面試重點**：

1. **職責分離**
   - `authStore`: 只管理認證狀態
   - `userInfoStore`: 只管理用戶資訊
   - `useAuth`: 封裝認證相關業務邏輯
   - `useUserInfo`: 封裝用戶資訊相關業務邏輯

2. **響應式數據流**
   - 使用 `storeToRefs` 保持響應性
   - Store 更新會自動觸發組件更新

3. **持久化策略**
   - `authStore` 持久化（用戶刷新頁面後保持登入）
   - `userInfoStore` 不持久化（安全考量）

---

## 6. 面試重點整理

### 6.1 storeToRefs 的使用

**可以這樣回答：**

> 在組件中使用 Pinia Store 時，如果要解構 state 和 getters，必須使用 `storeToRefs` 保持響應性。直接解構會破壞響應式連接，因為 Pinia 的 state 和 getters 是響應式的。`storeToRefs` 會將每個屬性轉換為 `ref`，保持響應性。Actions 可以直接解構，不需要 `storeToRefs`，因為它們本身不是響應式的。

**關鍵點：**
- ✅ `storeToRefs` 的作用
- ✅ 為什麼需要 `storeToRefs`
- ✅ Actions 可以直接解構

### 6.2 Store 之間通訊

**可以這樣回答：**

> Store 之間的通訊有兩種方式：1) 在 Store 內部調用其他 Store，但要注意避免循環依賴；2) 在 Composable 中組合多個 Store，這是推薦的方式。最佳實踐是保持 Store 的單一職責原則，將複雜的業務邏輯封裝在 Composable 中，避免 Store 之間的直接依賴。

**關鍵點：**
- ✅ 兩種通訊方式
- ✅ 推薦在 Composable 中組合
- ✅ 避免循環依賴

---

## 7. 面試總結

**可以這樣回答：**

> 在專案中使用 Pinia Store 時，有幾個關鍵實踐：1) 在組件中使用 `storeToRefs` 解構 state 和 getters，保持響應性；2) 在 Composables 中組合多個 Store，封裝業務邏輯；3) Store 之間的通訊推薦在 Composable 中組合，避免循環依賴；4) 保持 Store 的單一職責原則，將複雜邏輯放在 Composable 中。

**關鍵點：**
- ✅ `storeToRefs` 的使用
- ✅ Composables 組合 Store
- ✅ Store 通訊模式
- ✅ 職責分離原則

