---
id: pinia-store-management
title: '[Medium] Pinia Store 管理與實作'
slug: /pinia-store-management
tags: [Vue, Quiz, Medium, Pinia]
---

## 1. What is Pinia?

> 什麼是 Pinia？

Pinia 是 Vue 3 的官方狀態管理工具，作為 Vuex 的後繼者，提供了更簡潔的 API 和更好的 TypeScript 支援。

### 為什麼選擇 Pinia 而不是 Vuex？

**面試重點答案**：

1. **更好的 TypeScript 支援**
   - Pinia 提供完整的型別推斷
   - 不需要額外的輔助函數（如 `mapState`、`mapGetters`）

2. **更簡潔的 API**
   - 不需要 mutations（Vuex 中的同步操作層）
   - 直接在 actions 中執行同步/非同步操作

3. **模組化設計**
   - 無需嵌套模組
   - 每個 store 都是獨立的

4. **開發體驗更好**
   - 支援 Vue Devtools
   - Hot Module Replacement (HMR)
   - 體積更小（約 1KB）

5. **Vue 3 官方推薦**
   - Pinia 是 Vue 3 的官方狀態管理工具

### Pinia 的核心組成

```typescript
// Store 的三大核心
{
  state: () => ({ ... }),      // 狀態數據
  getters: { ... },            // 計算屬性
  actions: { ... }             // 方法（同步/非同步）
}
```

**與 Vue 組件的對應關係**：
- `state` ≈ `data`
- `getters` ≈ `computed`
- `actions` ≈ `methods`

## 2. Pinia 初始化配置

> Pinia 初始化配置

### 基本配置

```typescript
// src/stores/index.ts
import { store } from "quasar/wrappers"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import { Router } from "vue-router"

// 擴展 Pinia 的自定義屬性
declare module "pinia" {
  export interface PiniaCustomProperties {
    readonly router: Router
  }
}

export default store(() => {
  const pinia = createPinia()
  
  // 註冊持久化插件
  pinia.use(piniaPluginPersistedstate)
  
  return pinia
})
```

**面試重點**：
- ✅ 使用 `piniaPluginPersistedstate` 實現狀態持久化
- ✅ 擴展 `PiniaCustomProperties` 介面，讓所有 store 都能訪問 router
- ✅ 透過 Quasar 的 `store` wrapper 整合

### Store 檔案結構

```
src/stores/
├── index.ts                    # Pinia 實例配置
├── store-flag.d.ts            # TypeScript 型別聲明
│
├── authStore.ts               # 認證相關
├── userInfoStore.ts           # 用戶資訊
├── gameStore.ts               # 遊戲資訊
├── productStore.ts            # 產品資訊
├── languageStore.ts           # 語言設定
├── darkModeStore.ts          # 主題模式
├── envStore.ts               # 環境配置
└── ... (共 30+ 個 stores)
```

## 3. Store 實作方式

> Store 實作方式

本專案使用兩種 Store 定義方式：**Options API** 和 **Composition API (Setup)**

### 方式一：Options API（傳統寫法）

#### 基本結構

```typescript
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"
import { computed } from "vue"

type State = Response.login & {
  onBoarding: boolean
  totpStatus: Response.GetTotpStatus
}

export const useAuthStore = defineStore("authStore", {
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
      this.totpStatus = data
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status
    }
  },

  // 3️⃣ Getters: 定義計算屬性
  getters: {
    isLogin: (state) => !!state.access_token,
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) => computed(() => state.totpStatus?.is_enabled ?? false)
  },

  // 4️⃣ 持久化配置
  persist: true // 自動持久化到 localStorage
})
```

**面試重點**：

1. **State 必須是函數**
   ```typescript
   // ✅ 正確
   state: () => ({ count: 0 })
   
   // ❌ 錯誤（會導致多個實例共享狀態）
   state: {
     count: 0
   }
   ```

2. **Actions 中的 `this` 指向 store 實例**
   ```typescript
   actions: {
     increment() {
       this.count++  // 直接修改 state
     }
   }
   ```

3. **Getters 的兩種寫法**
   ```typescript
   getters: {
     // 方式一：直接返回值（推薦）
     doubleCount: (state) => state.count * 2,
     
     // 方式二：返回 computed（響應式更新）
     tripleCount: (state) => computed(() => state.count * 3)
   }
   ```

4. **持久化選項**
   ```typescript
   persist: true                    // 全部持久化
   persist: false                   // 不持久化
   persist: {                       // 自定義持久化
     key: 'my-custom-key',
     storage: sessionStorage,
     paths: ['access_token']        // 只持久化特定欄位
   }
   ```

### 方式二：Composition API / Setup（現代寫法）

#### 簡單 Store 範例

```typescript
import { defineStore } from "pinia"
import { useSessionStorage } from "@vueuse/core"

export const useDarkModeStore = defineStore("darkMode", () => {
  // 📦 State
  const isDarkMode = useSessionStorage<boolean>("isDarkMode", false)

  // 🔧 Actions
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status
  }

  // 📤 Export
  return {
    isDarkMode,
    updateIsDarkMode
  }
})
```

**面試重點**：
- 使用 `@vueuse/core` 的 `useSessionStorage` 實現持久化
- 更接近 Composition API 的寫法
- 所有 `ref` 或 `reactive` 都是 state
- 所有函數都是 actions
- 所有 `computed` 都是 getters

#### 複雜 Store 範例

```typescript
import { reactive } from "vue"
import { defineStore } from "pinia"
import type * as Response from "src/api/response.type"

type GameState = {
  list: Response.GameList
  allGameList: Response.AllGameList
  favoriteList: Response.FavoriteList
  favoriteMap: Response.FavoriteMap
}

export const useGameStore = defineStore("gameStore", () => {
  // 📦 State (使用 reactive)
  const gameState = reactive<GameState>({
    list: [],
    allGameList: {
      FISHING: [],
      LIVE_CASINO: [],
      SLOT: []
    },
    favoriteList: [],
    favoriteMap: {}
  })

  // 🔧 Actions
  function updateAllGameList(data: Response.AllGameList) {
    gameState.allGameList.FISHING = data.FISHING
    gameState.allGameList.LIVE_CASINO = data.LIVE_CASINO
    gameState.allGameList.SLOT = data.SLOT
  }

  function updateFavoriteList(data: Response.FavoriteList) {
    gameState.favoriteList = data
    gameState.favoriteMap = {}
    data.forEach((gameId) => {
      gameState.favoriteMap[gameId] = true
    })
  }

  function removeFavoriteList() {
    gameState.favoriteList.length = 0  // 保持響應性
    gameState.favoriteMap = {}
  }

  // 📤 Export
  return {
    gameState,
    updateAllGameList,
    updateFavoriteList,
    removeFavoriteList
  }
})
```

**面試重點**：

1. **使用 `reactive` vs `ref`**
   ```typescript
   // 📌 使用 reactive（推薦用於複雜物件）
   const state = reactive({
     count: 0,
     user: { name: "John" }
   })
   state.count++ // 直接訪問
   
   // 📌 使用 ref（推薦用於基本類型）
   const count = ref(0)
   count.value++ // 需要 .value
   ```

2. **為什麼使用 `.length = 0` 清空陣列？**
   ```typescript
   // ✅ 保持響應性（推薦）
   gameState.favoriteList.length = 0
   
   // ❌ 會失去響應性
   gameState.favoriteList = []
   ```

### 兩種寫法的對比

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

## 4. 在組件中使用 Store

> 在組件中使用 Store

### 基本使用

```vue
<script setup lang="ts">
import { useAuthStore } from "stores/authStore"

// 直接使用 store 實例
const authStore = useAuthStore()

// 訪問 state
console.log(authStore.access_token)

// 調用 action
authStore.setToptVerified(true)

// 訪問 getter
console.log(authStore.isLogin)
</script>
```

### 使用 `storeToRefs` 解構（重要！）

```vue
<script setup lang="ts">
import { useAuthStore } from "stores/authStore"
import { storeToRefs } from "pinia"

const authStore = useAuthStore()

// ❌ 錯誤：會失去響應性
const { access_token, isLogin } = authStore

// ✅ 正確：保持響應性
const { access_token, isLogin } = storeToRefs(authStore)

// ✅ Actions 可以直接解構（不需要 storeToRefs）
const { setToptVerified } = authStore
</script>
```

<details>
<summary>面試陷阱：為什麼直接解構會失去響應性？</summary>

```typescript
// 問題：為什麼下面的程式碼不會響應更新？
const { count } = useCounterStore()

// 答案：直接解構會失去響應性，必須使用 storeToRefs
const { count } = storeToRefs(useCounterStore())
```

**原因**：
- Pinia 的 state 和 getters 是響應式的
- 直接解構會破壞響應式連接
- `storeToRefs` 會將每個屬性轉換為 `ref`，保持響應性
- Actions 本身不是響應式的，所以可以直接解構

</details>

## 5. 在 Composables 中使用 Store

> 在 Composables 中使用 Store

Composables 是組合 Store 邏輯的最佳場所。

### 實際案例：useGame.ts

```typescript
import { useGameStore } from "stores/gameStore"
import { useProductStore } from "stores/productStore"
import { storeToRefs } from "pinia"

export function useGame() {
  // 1️⃣ 引入多個 stores
  const gameStore = useGameStore()
  const productStore = useProductStore()

  // 2️⃣ 解構 state 和 getters（使用 storeToRefs）
  const { gameState } = storeToRefs(gameStore)
  const { productState } = storeToRefs(productStore)

  // 3️⃣ 解構 actions（直接解構）
  const { initAllGameList, updateAllGameList } = gameStore

  // 4️⃣ 組合邏輯
  async function initGameTypeList() {
    const { status, data } = await useApi(getGameTypes)
    if (status) {
      setGameTypeList(data.list)
      setGameTypeMap(data.map)
    }
  }

  // 5️⃣ 返回給組件使用
  return {
    gameState,
    productState,
    initGameTypeList,
    initAllGameList
  }
}
```

**面試重點**：
- Composables 是組合 Store 邏輯的最佳場所
- 使用 `storeToRefs` 確保響應性
- Actions 可以直接解構
- 將複雜的業務邏輯封裝在 composable 中

## 6. Store 之間的通訊

> Store 之間如何通訊？

### 方法一：在 Store 內部調用其他 Store

```typescript
import { defineStore } from "pinia"
import { useUserInfoStore } from "./userInfoStore"

export const useAuthStore = defineStore("authStore", {
  actions: {
    async login(credentials) {
      const { status, data } = await api.login(credentials)
      if (status) {
        this.access_token = data.access_token
        
        // 調用其他 store 的方法
        const userInfoStore = useUserInfoStore()
        userInfoStore.setStoreUserInfo(data.user)
      }
    }
  }
})
```

### 方法二：在 Composable 中組合多個 Store（推薦）

```typescript
export function useInit() {
  const authStore = useAuthStore()
  const userInfoStore = useUserInfoStore()
  const gameStore = useGameStore()

  async function initialize() {
    // 依序執行多個 store 的初始化
    await authStore.checkAuth()
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo()
      await gameStore.initGameList()
    }
  }

  return { initialize }
}
```

**面試重點**：
- ✅ 推薦在 Composable 中組合多個 Store
- ❌ 避免 Store 之間的循環依賴
- 🎯 保持 Store 的單一職責原則

## 7. 持久化策略

> Store 持久化策略

本專案使用三種持久化方式：

### 方式一：Pinia Plugin Persistedstate

```typescript
// Options API
export const useLanguageStore = defineStore("languageStore", {
  state: () => ({ lang: "", defaultLang: "" }),
  persist: true  // 自動持久化到 localStorage
})

// 自定義配置
persist: {
  key: 'my-store',
  storage: sessionStorage,
  paths: ['lang']  // 只持久化特定欄位
}
```

### 方式二：VueUse 的 useSessionStorage / useLocalStorage

```typescript
import { useSessionStorage } from "@vueuse/core"

export const useDarkModeStore = defineStore("darkMode", () => {
  // 自動持久化到 sessionStorage
  const isDarkMode = useSessionStorage<boolean>("isDarkMode", false)
  return { isDarkMode }
})
```

### 方式三：手動持久化（不推薦）

```typescript
export const useCustomStore = defineStore("custom", {
  state: () => ({ token: "" }),
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem("token", token) // 手動保存
    }
  }
})
```

**對比表格**：

| 方式                  | 優點           | 缺點                | 使用場景            |
| --------------------- | -------------- | ------------------- | ------------------- |
| **persist: true**     | 自動、簡單     | 整個 state 都持久化 | 整個 Store 需持久化 |
| **useSessionStorage** | 靈活、類型安全 | 需要逐個定義        | 特定欄位持久化      |
| **手動持久化**        | 完全控制       | 容易出錯、維護困難  | 不推薦              |

## 8. 重置 Store 狀態

> 如何重置 Store 狀態？

### 方法一：使用 Pinia 內建的 `$reset()`

```typescript
// Options API Store 支援
const store = useMyStore()
store.$reset() // 重置為初始狀態
```

### 方法二：自定義重置方法

```typescript
// Composition API Store
export const useGameStore = defineStore("gameStore", () => {
  const gameState = reactive({
    list: [],
    favoriteList: []
  })

  function resetGameStore() {
    gameState.list = []
    gameState.favoriteList = []
  }

  return { gameState, resetGameStore }
})
```

### 方法三：批量重置（實際案例）

```typescript
// src/common/hooks/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore()
  const userInfoStore = useUserInfoStore()
  const gameStore = useGameStore()

  function reset() {
    // 重置多個 store
    authStore.$reset()
    userInfoStore.$reset()
    gameStore.resetGameStore()
  }

  async function handleLogout() {
    await api.logout()
    reset() // 登出時重置所有狀態
    router.push("/")
  }

  return { reset, handleLogout }
}
```

## 9. 實戰案例分析

> 實戰案例分析

### 案例一：用戶登入流程

這是一個完整的 Store 使用流程，涵蓋了多個 Store 的協作。

#### 流程圖

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

#### 程式碼實作

```typescript
// 1️⃣ authStore.ts - 管理認證狀態
export const useAuthStore = defineStore("authStore", {
  state: () => ({
    access_token: undefined as string | undefined,
    user_id: undefined as number | undefined
  }),
  getters: {
    isLogin: (state) => !!state.access_token
  },
  persist: true  // 持久化認證資訊
})

// 2️⃣ userInfoStore.ts - 管理用戶資訊
export const useUserInfoStore = defineStore("useInfoStore", {
  state: () => ({
    info: {} as Response.UserInfo
  }),
  actions: {
    setStoreUserInfo(userInfo: Response.UserInfo) {
      this.info = userInfo
    }
  },
  persist: false  // 不持久化（敏感資訊）
})

// 3️⃣ useAuth.ts - 組合認證邏輯
export function useAuth() {
  const authStore = useAuthStore()
  const { access_token } = storeToRefs(authStore)
  const { isLogin } = storeToRefs(authStore)

  async function handleLogin(credentials: LoginCredentials) {
    const { status, data } = await api.login(credentials)
    if (status) {
      // 更新 authStore
      authStore.$patch({
        access_token: data.access_token,
        user_id: data.user_id
      })
      return true
    }
    return false
  }

  return {
    access_token,
    isLogin,
    handleLogin
  }
}

// 4️⃣ LoginPage.vue - 登入頁面
<script setup lang="ts">
import { useAuth } from "src/common/hooks/useAuth"
import { useUserInfo } from "src/common/composables/useUserInfo"
import { useGame } from "src/common/composables/useGame"
import { useRouter } from "vue-router"

const { handleLogin } = useAuth()
const { getUserInfo } = useUserInfo()
const { initGameList } = useGame()
const router = useRouter()

const onSubmit = async (formData: LoginForm) => {
  // 步驟 1: 登入
  const success = await handleLogin(formData)
  if (success) {
    // 步驟 2: 獲取用戶資訊
    await getUserInfo()
    // 步驟 3: 初始化遊戲列表
    await initGameList()
    // 步驟 4: 跳轉首頁
    router.push("/")
  }
}
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

### 案例二：遊戲收藏功能

#### 流程圖

```
用戶點擊收藏按鈕
     ↓
調用 addfavoriteGame(gameId)
     ↓
API 請求添加收藏
     ↓
成功 → gameStore.updateFavoriteList()
     ↓
UI 自動更新（收藏按鈕變色）
```

#### 程式碼實作

```typescript
// 1️⃣ gameStore.ts
export const useGameStore = defineStore("gameStore", () => {
  const gameState = reactive({
    favoriteList: [] as number[],
    favoriteMap: {} as Record<number, boolean>
  })

  function updateFavoriteList(data: number[]) {
    gameState.favoriteList = data
    // 建立 Map 以快速查詢
    gameState.favoriteMap = {}
    data.forEach((gameId) => {
      gameState.favoriteMap[gameId] = true
    })
  }

  return { gameState, updateFavoriteList }
})

// 2️⃣ useGame.ts
export function useGame() {
  const gameStore = useGameStore()
  const { gameState } = storeToRefs(gameStore)
  const { updateFavoriteList } = gameStore

  async function addfavoriteGame(gameId: number) {
    const { status } = await api.addFavorite(gameId)
    if (status) {
      // 樂觀更新 UI
      gameState.value.favoriteList.push(gameId)
      gameState.value.favoriteMap[gameId] = true
      // 重新獲取完整列表（確保數據一致性）
      await getFavoriteGames()
    }
  }

  async function getFavoriteGames() {
    const { status, data } = await api.getFavorites()
    if (status) {
      updateFavoriteList(data)
    }
  }

  return {
    gameState,
    addfavoriteGame,
    getFavoriteGames
  }
}

// 3️⃣ GameCard.vue
<template>
  <div class="game-card">
    <button
      @click="toggleFavorite"
      :class="{ 'is-favorite': isFavorite }"
    >
      {{ isFavorite ? '❤️' : '🤍' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useGame } from "src/common/composables/useGame"

const props = defineProps<{ game: Game }>()
const { gameState, addfavoriteGame, removefavoriteGame } = useGame()

// 使用 favoriteMap 快速判斷是否已收藏
const isFavorite = computed(() =>
  gameState.value.favoriteMap[props.game.id] ?? false
)

const toggleFavorite = () => {
  if (isFavorite.value) {
    removefavoriteGame(props.game.id)
  } else {
    addfavoriteGame(props.game.id)
  }
}
</script>
```

**面試重點**：

1. **為什麼使用 `favoriteMap`？**
   ```typescript
   // ❌ 每次都遍歷陣列（O(n)）
   const isFavorite = favoriteList.includes(gameId)
   
   // ✅ 使用 Map 快速查詢（O(1)）
   const isFavorite = favoriteMap[gameId]
   ```

2. **樂觀更新 (Optimistic Update)**
   - 先更新 UI（提供即時反饋）
   - 再發送 API 請求
   - 請求成功後重新獲取數據（確保一致性）

3. **響應式更新**
   - `gameState` 更新後，所有使用它的組件都會自動更新
   - 不需要手動觸發更新

## 10. Best Practices

> 最佳實踐

### 1. Store 設計原則

#### ✅ 單一職責原則

```typescript
// ✅ 好的設計：每個 Store 只負責一個領域
useAuthStore() // 只管認證
useUserInfoStore() // 只管用戶資訊
useGameStore() // 只管遊戲資訊

// ❌ 壞的設計：一個 Store 管理所有東西
useAppStore() // 管理認證、用戶、遊戲、設定...
```

#### ✅ 保持 Store 精簡

```typescript
// ✅ 推薦
export const useBannerStore = defineStore("bannerStore", () => {
  const bannerState = reactive({ list: [] })
  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list
  }
  return { bannerState, setStoreBannerList }
})

// ❌ 不推薦：Store 中包含複雜的業務邏輯
// 應該放在 composable 中
```

### 2. 使用 TypeScript

```typescript
// ✅ 完整的型別定義
type UserState = {
  info: Response.UserInfo
  walletList: Response.UserWalletList
}

export const useUserInfoStore = defineStore("useInfoStore", () => {
  const state = reactive<UserState>({
    info: {} as Response.UserInfo,
    walletList: []
  })
  return { state }
})
```

### 3. 持久化策略

```typescript
// ✅ 敏感資訊不持久化
export const useAuthStore = defineStore("authStore", {
  state: () => ({
    access_token: undefined, // 持久化
    user_password: undefined // ❌ 絕對不要持久化密碼
  }),
  persist: {
    paths: ["access_token"] // 只持久化 token
  }
})
```

### 4. 避免在 Store 中直接調用 API

```typescript
// ❌ 不推薦：在 Store 中直接調用 API
export const useGameStore = defineStore("gameStore", {
  actions: {
    async fetchGames() {
      const data = await api.getGames() // API 調用
      this.list = data
    }
  }
})

// ✅ 推薦：在 Composable 中調用 API，Store 只負責存儲
export const useGameStore = defineStore("gameStore", {
  actions: {
    setGameList(list: Game[]) {
      this.list = list
    }
  }
})

export function useGame() {
  const gameStore = useGameStore()
  async function fetchGames() {
    const { status, data } = await api.getGames() // Composable 中調用 API
    if (status) {
      gameStore.setGameList(data) // Store 只負責存儲
    }
  }
  return { fetchGames }
}
```

### 5. 使用 `$patch` 批量更新

```typescript
// ❌ 不推薦：多次更新（觸發多次響應）
authStore.access_token = data.access_token
authStore.user_id = data.user_id
authStore.agent_id = data.agent_id

// ✅ 推薦：批量更新（只觸發一次響應）
authStore.$patch({
  access_token: data.access_token,
  user_id: data.user_id,
  agent_id: data.agent_id
})

// ✅ 也可以使用函數形式
authStore.$patch((state) => {
  state.access_token = data.access_token
  state.user_id = data.user_id
  state.agent_id = data.agent_id
})
```

## 11. 常見錯誤

> 常見錯誤

### 錯誤 1：直接解構導致響應性丟失

```typescript
// ❌ 錯誤
const { count } = useCounterStore()
count // 不是響應式的

// ✅ 正確
const { count } = storeToRefs(useCounterStore())
count.value // 響應式的
```

### 錯誤 2：在 Setup 外部調用 Store

```typescript
// ❌ 錯誤：在模組頂層調用
const authStore = useAuthStore() // ❌ 錯誤時機

export function useAuth() {
  return {
    isLogin: authStore.isLogin
  }
}

// ✅ 正確：在函數內部調用
export function useAuth() {
  const authStore = useAuthStore() // ✅ 正確時機
  return {
    isLogin: authStore.isLogin
  }
}
```

### 錯誤 3：修改 State 時破壞響應性

```typescript
// ❌ 錯誤：直接賦值新陣列
function updateList(newList) {
  gameState.list = newList // 可能失去響應性
}

// ✅ 正確：使用 splice 或 push
function updateList(newList) {
  gameState.list.length = 0
  gameState.list.push(...newList)
}

// ✅ 也可以使用 reactive 的賦值
function updateList(newList) {
  Object.assign(gameState, { list: newList })
}
```

### 錯誤 4：循環依賴

```typescript
// ❌ 錯誤：Store 之間相互依賴
// authStore.ts
import { useUserInfoStore } from "./userInfoStore"
export const useAuthStore = defineStore("authStore", () => {
  const userInfoStore = useUserInfoStore() // 依賴 userInfoStore
})

// userInfoStore.ts
import { useAuthStore } from "./authStore"
export const useUserInfoStore = defineStore("useInfoStore", () => {
  const authStore = useAuthStore() // 依賴 authStore ❌ 循環依賴
})

// ✅ 正確：在 Composable 中組合
export function useInit() {
  const authStore = useAuthStore()
  const userInfoStore = useUserInfoStore()
  async function initialize() {
    await authStore.checkAuth()
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo()
    }
  }
  return { initialize }
}
```

### 錯誤 5：忘記 return

```typescript
// ❌ 錯誤：忘記 return
export const useGameStore = defineStore("gameStore", () => {
  const gameState = reactive({ list: [] })
  function updateList(list) {
    gameState.list = list
  }
  // ❌ 忘記 return，組件無法訪問
})

// ✅ 正確
export const useGameStore = defineStore("gameStore", () => {
  const gameState = reactive({ list: [] })
  function updateList(list) {
    gameState.list = list
  }
  return { gameState, updateList } // ✅ 必須 return
})
```

## 12. Interview Summary

> 面試總結

### 快速記憶

**Pinia 核心概念**：
- `state`: 狀態數據（類似 `data`）
- `getters`: 計算屬性（類似 `computed`）
- `actions`: 方法（類似 `methods`）

**兩種寫法**：
- **Options API**: 物件配置，適合簡單 Store
- **Composition API**: 函數式，適合複雜邏輯

**關鍵 API**：
- `storeToRefs()`: 保持 State 和 Getters 的響應性
- `$patch()`: 批量更新狀態
- `$reset()`: 重置狀態（僅 Options API）

**持久化方式**：
- `persist: true`: 整個 Store 持久化
- `useSessionStorage`: 特定欄位持久化
- 手動持久化: 不推薦

### 面試回答範例

**Q: 為什麼使用 Pinia 而不是 Vuex？**

> "Pinia 是 Vue 3 的官方狀態管理工具，相比 Vuex 有以下優勢：1) 更好的 TypeScript 支援，提供完整的型別推斷；2) 更簡潔的 API，不需要 mutations，直接在 actions 中執行同步/非同步操作；3) 模組化設計，無需嵌套模組，每個 store 都是獨立的；4) 開發體驗更好，支援 Vue Devtools、HMR，體積更小；5) Vue 3 官方推薦。"

**Q: 什麼時候使用 `storeToRefs`？**

> "`storeToRefs` 用於解構 Store 的 state 和 getters，保持響應性。當我們需要從 Store 中解構出多個 state 或 getters 時，必須使用 `storeToRefs`，否則會失去響應性。Actions 可以直接解構，不需要 `storeToRefs`，因為它們本身不是響應式的。"

**Q: Options API 和 Composition API 的 Store 有什麼區別？**

> "Options API Store 使用物件配置，包含 state、getters、actions 三個選項，語法類似 Vue 2，學習曲線較低。Composition API Store 使用函數式寫法，所有 ref/reactive 都是 state，所有函數都是 actions，所有 computed 都是 getters，更靈活但需要理解 Composition API。選擇上，簡單 Store 用 Options API，複雜邏輯用 Composition API。"

**Q: Store 之間如何通訊？最佳實踐是什麼？**

> "Store 之間的通訊有兩種方式：1) 在 Store 內部調用其他 Store，但要注意避免循環依賴；2) 在 Composable 中組合多個 Store，這是推薦的方式。最佳實踐是保持 Store 的單一職責原則，將複雜的業務邏輯封裝在 Composable 中，避免 Store 之間的直接依賴。"

**Q: 如何實現 Store 的持久化？**

> "本專案使用三種持久化方式：1) `persist: true`，整個 Store 自動持久化到 localStorage，適合整個 Store 都需要持久化的場景；2) `useSessionStorage` 或 `useLocalStorage`，特定欄位持久化，更靈活且類型安全；3) 手動持久化，不推薦。選擇上，敏感資訊不持久化，用戶偏好持久化。"

### Pinia Store 操作流程總覽

```
1. 定義 Store
   ├── Options API：state + actions + getters
   └── Composition API：ref/reactive + functions + computed

2. 配置持久化
   ├── persist: true（整個 Store）
   ├── useSessionStorage（特定欄位）
   └── 手動持久化（不推薦）

3. 在組件/Composable 中使用
   ├── 引入 Store：const store = useXxxStore()
   ├── 解構 State/Getters：const { ... } = storeToRefs(store)
   └── 解構 Actions：const { ... } = store

4. Store 通訊
   ├── 在 Composable 中組合多個 Store（推薦）
   └── 在 Store 內部調用其他 Store（謹慎使用）

5. 重置狀態
   ├── Options API：store.$reset()
   └── Composition API：自定義 reset 方法
```

### 核心要點

1. **State 必須是函數**，避免多實例共享狀態
2. **使用 `storeToRefs`** 保持 State 和 Getters 的響應性
3. **Actions 可以直接解構**，不需要 storeToRefs
4. **持久化選擇**：敏感資訊不持久化，用戶偏好持久化
5. **職責分離**：Store 負責狀態，Composable 負責業務邏輯
6. **避免循環依賴**：在 Composable 中組合多個 Store

## Reference

- [Pinia 官方文檔](https://pinia.vuejs.org/)
- [Pinia Plugin Persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)
- [VueUse useSessionStorage](https://vueuse.org/core/useSessionStorage/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

