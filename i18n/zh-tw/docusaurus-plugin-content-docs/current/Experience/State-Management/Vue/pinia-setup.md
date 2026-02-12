---
id: state-management-vue-pinia-setup
title: 'Pinia 初始化與配置'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> 在多品牌平台專案中，Pinia 的初始化配置與專案結構設計。

---

## 1. 面試回答主軸

1. **Pinia 選擇理由**：更好的 TypeScript 支援、更簡潔的 API、模組化設計、開發體驗更好。
2. **初始化配置**：使用 `piniaPluginPersistedstate` 實現持久化，擴展 `PiniaCustomProperties` 介面。
3. **專案結構**：30+ 個 stores，按功能領域分類管理。

---

## 2. 為什麼選擇 Pinia？

### 2.1 Pinia vs Vuex

**Pinia** 是 Vue 3 的官方狀態管理工具，作為 Vuex 的後繼者，提供了更簡潔的 API 和更好的 TypeScript 支援。

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

### 2.2 Pinia 的核心組成

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

---

## 3. Pinia 初始化配置

### 3.1 基本配置

**檔案位置：** `src/stores/index.ts`

```typescript
import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Router } from 'vue-router';

// 擴展 Pinia 的自定義屬性
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(() => {
  const pinia = createPinia();

  // 註冊持久化插件
  pinia.use(piniaPluginPersistedstate);

  return pinia;
});
```

**面試重點**：
- ✅ 使用 `piniaPluginPersistedstate` 實現狀態持久化
- ✅ 擴展 `PiniaCustomProperties` 介面，讓所有 store 都能訪問 router
- ✅ 透過 Quasar 的 `store` wrapper 整合

### 3.2 Store 檔案結構

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

**設計原則**：
- 每個 Store 負責單一功能領域
- 檔案命名：`功能名稱 + Store.ts`
- 使用 TypeScript 完整型別定義

---

## 4. 面試重點整理

### 4.1 Pinia 選擇理由

**可以這樣回答：**

> 在專案中選擇 Pinia 而非 Vuex，主要有幾個原因：1) 更好的 TypeScript 支援，提供完整的型別推斷，不需要額外配置；2) 更簡潔的 API，不需要 mutations，直接在 actions 中執行同步/非同步操作；3) 模組化設計，無需嵌套模組，每個 store 都是獨立的；4) 開發體驗更好，支援 Vue Devtools、HMR，體積更小；5) Vue 3 官方推薦。

**關鍵點：**
- ✅ TypeScript 支援
- ✅ API 簡潔性
- ✅ 模組化設計
- ✅ 開發體驗

### 4.2 初始化配置重點

**可以這樣回答：**

> 在 Pinia 初始化時，我做了幾個關鍵配置：1) 使用 `piniaPluginPersistedstate` 實現狀態持久化，讓 Store 可以自動保存到 localStorage；2) 擴展 `PiniaCustomProperties` 介面，讓所有 store 都能訪問 router，方便在 actions 中進行路由操作；3) 透過 Quasar 的 `store` wrapper 整合，確保與框架的整合性。

**關鍵點：**
- ✅ 持久化插件配置
- ✅ 自定義屬性擴展
- ✅ 框架整合

---

## 5. 面試總結

**可以這樣回答：**

> 在專案中使用 Pinia 作為狀態管理工具。選擇 Pinia 是因為它提供更好的 TypeScript 支援、更簡潔的 API、以及更好的開發體驗。在初始化配置時，使用 `piniaPluginPersistedstate` 實現持久化，並擴展 `PiniaCustomProperties` 讓所有 store 都能訪問 router。專案中有 30+ 個 stores，按功能領域分類管理，每個 Store 負責單一功能領域。

**關鍵點：**
- ✅ Pinia 選擇理由
- ✅ 初始化配置重點
- ✅ 專案結構設計
- ✅ 實際專案經驗

