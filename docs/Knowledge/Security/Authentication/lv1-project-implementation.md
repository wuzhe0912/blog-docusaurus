---
id: login-lv1-project-implementation
title: '[Lv1] 過往專案的登入機制是怎麼實作的？'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> 目標：用 3 ～ 5 分鐘清楚交代「前端如何處理登入、狀態維護與保護頁面」，方便面試時快速回想。

---

## 1. 面試回答主軸

1. **登入流程三階段**：送出表單 → 後端驗證 → 儲存 Token 與導頁。
2. **狀態與 Token 管理**：Pinia 搭配持久化，Axios Interceptor 自動附加 Bearer Token。
3. **後續處理與保護**：初始化共用資料、路由守衛、登出與例外情境（OTP、強制換密碼）。

先以這三個重點破題，再依需求展開細節，讓面試官感受到你具備整體視角。

---

## 2. 系統組成與責任分工

| 模組           | 位置                                | 角色                                         |
| -------------- | ----------------------------------- | -------------------------------------------- |
| `authStore`    | `src/stores/authStore.ts`           | 儲存登入狀態、持久化 Token、提供 getter      |
| `useAuth` Hook | `src/common/hooks/useAuth.ts`       | 封裝登入 / 登出流程、統一回傳格式            |
| 登入 API       | `src/api/login.ts`                  | 呼叫後端 `POST /login`、`POST /logout`       |
| Axios 工具     | `src/common/utils/request.ts`       | Request / Response Interceptor、統一錯誤處理 |
| 路由守衛       | `src/router/index.ts`               | 依 `meta` 判斷是否需要登入、導向登入頁       |
| 初始化流程     | `src/common/composables/useInit.ts` | App 啟動時判斷是否已有 Token、載入必要資料   |

> 記憶法：**「Store 管狀態、Hook 管流程、Interceptor 管通道、Guard 管頁面」**。

---

## 3. 登入流程（一步步拆解）

### Step 0. 表單與前置驗證

- 支援一般密碼與 SMS 驗證碼兩種登入方式。
- 送出前先做基本驗證（必填、格式、防重送）。

### Step 1. 呼叫登入 API

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` 統一錯誤處理與 loading 管理。
- 成功時 `data` 會帶回 Token 與使用者核心資訊。

### Step 2. 處理後端回應

| 情況                                     | 行為                                              |
| ---------------------------------------- | ------------------------------------------------- |
| **需要補驗證**（例如首次登入要身分確認） | 將 `authStore.onBoarding` 設為 `true`，導向驗證頁 |
| **強制修改密碼**                         | 依回傳旗標導向變更密碼流程並帶入必要參數          |
| **一般成功**                             | 呼叫 `authStore.$patch()` 儲存 Token 與使用者資訊 |

### Step 3. 登入完成後的共用動作

1. 取得使用者基本資料與錢包清單。
2. 初始化個人化內容（例如禮物列表、通知）。
3. 依 `redirect` 或既定路由導向內頁。

> 登入成功只是一半，**後續共用資料要在這個時機補齊**，避免每個頁面再各自打一次 API。

---

## 4. Token 生命週期管理

### 4.1 儲存策略

- `authStore` 啟用 `persist: true`，將關鍵欄位寫入 `localStorage`。
- 優點：重新整理後狀態自動恢復；缺點：需自行注意 XSS 與安全性。

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- 需要授權的 API 會自動帶入 Bearer Token。
- 若 API 明確標記 `needToken: false`（登入、註冊等），則跳過帶入流程。

### 4.3 過期與例外處理

- 後端若回傳 Token 過期或無效，Response Interceptor 會統一轉為錯誤提示並觸發登出流程。
- 若要延伸可加入 Refresh Token 機制，目前專案採用簡化策略。

---

## 5. 路由保護與初始化

### 5.1 路由守衛

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- 透過 `meta.needAuth` 決定是否檢查登入狀態。
- 未登入時導向登入頁或指定公共頁面。

### 5.2 應用啟動初始化

`useInit` 在 App 啟動時處理：

1. 檢查 URL 是否帶有 `login_token` 或 `platform_token`，若有就自動登入或設定 Token。
2. 如果 Store 已有 Token，就載入使用者資訊與共用資料。
3. 沒有 Token 則停留在公共頁面，等待使用者手動登入。

---

## 6. 登出流程（收尾與清理）

1. 呼叫 `POST /logout` 告知後端。
2. 執行 `reset()`：
   - `authStore.$reset()` 清除登入資訊。
   - 相關 Store（使用者資訊、收藏、邀請碼等）一併重置。
3. 清理瀏覽器端暫存（例如 localStorage 中的快取）。
4. 導回登入頁或首頁。

> 登出是登入的鏡射：不只是刪 Token，還要確保所有依賴狀態被清除，避免殘留資料。

---

## 7. 常見問題與最佳實務

- **流程拆解**：登入與登入後初始化分開，讓 hook 保持精簡。
- **錯誤處理**：統一透過 `useApi` 與 Response Interceptor，確保 UI 顯示一致。
- **安全性**：
  - 全程使用 HTTPS。
  - Token 放在 `localStorage` 時，敏感操作需留意 XSS。
  - 視情況延伸 httpOnly Cookie 或 Refresh Token。
- **延伸備案**：OTP、強制換密碼等情境保留彈性，由 hook 回傳狀態交由畫面處理。

---

## 8. 面試快速備忘口訣

1. **「輸入 → 驗證 → 儲存 → 導頁」**：用這個順序描述整體流程。
2. **「Store 記狀態、Interceptor 幫帶頭、Guard 擋路人」**：凸顯架構分工。
3. **「登入後立刻補齊共用資料」**：展現對使用者體驗的敏感度。
4. **「登出是一鍵重置 + 導回安全頁」**：顧到安全與流程收斂。

