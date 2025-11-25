---
id: performance-lv1-route-optimization
title: '[Lv1] 路由層級優化：三層 Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> 透過三層路由 Lazy Loading，將首次載入從 12.5MB 降至 850KB，首屏時間縮短 70%。

---

## 問題背景（Situation）

專案特性：

- 📦 **27+ 個不同的多租戶版型**（多租戶架構）
- 📄 **每個版型有 20-30 個頁面**（首頁、大廳、促銷、代理、新聞等）
- 💾 **如果一次載入所有程式碼**：首次進入需要下載 **10MB+ 的 JS 檔案**
- ⏱️ **使用者等待時間超過 10 秒**（尤其在手機網路環境下）

## 優化目標（Task）

1. **減少首次載入的 JavaScript 體積**（目標：< 1MB）
2. **縮短首屏時間**（目標：< 3 秒）
3. **按需載入**（使用者只下載需要的內容）
4. **維持開發體驗**（不能影響開發效率）

## 解決方案（Action）

我們採用了**三層路由 Lazy Loading** 的策略，從「版型」→「頁面」→「權限」三個層級進行優化。

### 第 1 層：動態模板載入

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // 根據環境變數動態載入對應的版型路由
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

說明：

- 專案有 27 個版型，但用戶只會使用其中 1 個
- 透過 environment.json 判斷當前是哪個品牌
- 只載入該品牌的路由配置，其他 26 個版型完全不載入

效果：

- 首次載入減少約 85% 的路由配置程式碼

### 第 2 層：頁面 Lazy Loading

```typescript
// 傳統寫法（X - 不好）
import HomePage from './pages/HomePage.vue';
component: HomePage; // 所有頁面都會被打包進 main.js

// 我們的寫法（✓ - 好）
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- 每個路由使用 箭頭函式 + import() 包裹
- 只有當用戶真正訪問該頁面時，才會下載對應的 JS chunk
- Vite 會自動將每個頁面打包成獨立的檔案

### 第 3 層：按需載入策略

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // 未登入用戶不會載入「代理中心」等需要登入的頁面
    return next({ name: 'HomePage' });
  }
  next();
});
```

## ✅ 優化成效（Result）

**優化前：**

```
首次載入：main.js (12.5 MB)
首屏時間：8-12 秒
包含所有 27 個版型 + 所有頁面
```

**優化後：**

```markdown
首次載入：main.js (850 KB) ↓ 93%
首屏時間：1.5-2.5 秒 ↑ 70%
僅包含核心程式碼 + 當前首頁
```

**具體數據：**

- ✅ JavaScript 體積減少：**12.5 MB → 850 KB（減少 93%）**
- ✅ 首屏時間縮短：**10 秒 → 2 秒（提升 70%）**
- ✅ 後續頁面載入：**平均 300-500 KB per page**
- ✅ 使用者體驗評分：**從 45 分提升至 92 分（Lighthouse）**

**商業價值：**

- 跳出率下降 35%
- 頁面停留時間增加 50%
- 轉換率提升 25%

## 面試重點

**常見延伸問題：**

1. **Q: 為什麼不用 React.lazy() 或 Vue 的異步組件？**  
   A: 我們確實有用 Vue 的異步組件（`() => import()`），但關鍵是**三層架構**：

   - 第 1 層（版型）：編譯時決定（Vite 配置）
   - 第 2 層（頁面）：運行時 Lazy Loading
   - 第 3 層（權限）：導航守衛控制

   單純的 lazy loading 只做到第 2 層，我們多做了版型層級的分離。

2. **Q: 如何決定哪些程式碼該放在 main.js？**  
   A: 使用 Vite 的 `manualChunks` 配置：

   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor': ['vue', 'pinia', 'vue-router'],
           'ui': ['element-plus'],
         }
       }
     }
   }
   ```

   原則：只有「每個頁面都會用到」的才放 vendor chunk。

3. **Q: Lazy Loading 會不會影響用戶體驗（等待時間）？**  
   A: 有兩個策略應對：

   - **預載（Prefetch）**：在閒置時預先載入可能訪問的頁面
   - **Loading 狀態**：使用 Skeleton Screen 代替白屏

   實際測試：後續頁面平均載入時間 < 500ms，用戶無感知。

4. **Q: 如何測量優化效果？**  
   A: 使用多種工具：

   - **Lighthouse**：Performance Score（45 → 92）
   - **Webpack Bundle Analyzer**：視覺化分析 chunk 大小
   - **Chrome DevTools**：Network waterfall、Coverage
   - **Real User Monitoring (RUM)**：真實用戶數據

5. **Q: 有什麼 Trade-off（權衡）？**  
   A:
   - ❌ 開發時可能遇到循環依賴問題（需要調整模組結構）
   - ❌ 首次路由切換會有短暫載入時間（用 prefetch 解決）
   - ✅ 但整體利大於弊，尤其對手機用戶體驗提升明顯

