---
title: '[Lv2] Nuxt 3 Rendering Modes：SSR、SSG、CSR 選擇策略'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> 理解 Nuxt 3 的 Rendering Modes，能夠根據專案需求選擇合適的渲染策略（SSR、SSG、CSR）。

---

## 1. 面試回答主軸

1. **Rendering Modes 分類**：Nuxt 3 支援 SSR、SSG、CSR、Hybrid Rendering 四種模式
2. **選擇策略**：根據 SEO 需求、內容動態性、效能要求選擇合適的模式
3. **實作經驗**：在專案中如何配置與選擇不同的 Rendering Modes

---

## 2. Nuxt 3 Rendering Modes 介紹

### 2.1 四種 Rendering Modes

Nuxt 3 支援四種主要的 Rendering Modes：

| 模式 | 全名 | 渲染時機 | 適用場景 |
|------|------|---------|---------|
| **SSR** | Server-Side Rendering | 每次請求時在 Server 端渲染 | 需要 SEO + 動態內容 |
| **SSG** | Static Site Generation | 建置時預先生成 HTML | 需要 SEO + 內容固定 |
| **CSR** | Client-Side Rendering | 在瀏覽器端渲染 | 不需要 SEO + 互動性高 |
| **Hybrid** | Hybrid Rendering | 混合使用多種模式 | 不同頁面有不同需求 |

### 2.2 SSR (Server-Side Rendering)

**定義：** 每次請求時，在 Server 端執行 JavaScript，生成完整的 HTML，然後傳送給瀏覽器。

**配置方式：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // 預設為 true
});
```

**流程：**
1. 瀏覽器請求頁面
2. Server 執行 JavaScript，生成完整 HTML
3. 傳送 HTML 給瀏覽器
4. 瀏覽器 Hydration（啟用互動功能）

**優點：**
- ✅ SEO 友善（搜尋引擎可以看到完整內容）
- ✅ 首次載入速度快（不需要等待 JavaScript 執行）
- ✅ 支援動態內容（每次請求都能取得最新資料）

**缺點：**
- ❌ Server 負擔較重（每個請求都需要執行渲染）
- ❌ TTFB（Time To First Byte）可能較長
- ❌ 需要 Server 環境

**適用場景：**
- 電商產品頁（需要 SEO + 動態價格/庫存）
- 新聞文章頁（需要 SEO + 動態內容）
- 使用者個人頁面（需要 SEO + 個人化內容）

### 2.3 SSG (Static Site Generation)

**定義：** 在建置時（Build Time）預先生成所有 HTML 頁面，部署為靜態檔案。

**配置方式：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSG 需要 SSR 為 true
  nitro: {
    prerender: {
      routes: ['/about', '/contact'], // 指定要預渲染的路由
    },
  },
});

// 或使用 routeRules
export default defineNuxtConfig({
  routeRules: {
    '/about': { prerender: true },
    '/contact': { prerender: true },
  },
});
```

**流程：**
1. 建置時執行 JavaScript，生成所有頁面的 HTML
2. 將 HTML 檔案部署到 CDN
3. 瀏覽器請求時直接回傳預先生成的 HTML

**優點：**
- ✅ 效能最佳（CDN 快取，回應速度快）
- ✅ SEO 友善（完整 HTML 內容）
- ✅ Server 負擔最小（不需要執行時渲染）
- ✅ 成本低（可以部署到 CDN）

**缺點：**
- ❌ 不適合動態內容（需要重新建置才能更新）
- ❌ 建置時間可能較長（大量頁面時）
- ❌ 無法處理使用者特定的內容

**適用場景：**
- 關於我們頁面（內容固定）
- 產品說明頁（內容相對固定）
- 部落格文章（發布後不會頻繁變動）

### 2.4 CSR (Client-Side Rendering)

**定義：** 在瀏覽器中執行 JavaScript，動態生成 HTML 內容。

**配置方式：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // 全域關閉 SSR
});

// 或針對特定路由
export default defineNuxtConfig({
  routeRules: {
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});

// 或在頁面中設定
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false,
});
</script>
```

**流程：**
1. 瀏覽器請求 HTML（通常是空的 shell）
2. 下載 JavaScript bundle
3. 執行 JavaScript，動態生成內容
4. 渲染頁面

**優點：**
- ✅ 互動性高，適合 SPA
- ✅ 減少 Server 負擔
- ✅ 頁面切換流暢（不需要重新載入）

**缺點：**
- ❌ SEO 不友善（搜尋引擎可能無法正確索引）
- ❌ 首次載入時間較長（需要下載並執行 JavaScript）
- ❌ 需要 JavaScript 才能看到內容

**適用場景：**
- 後台管理系統（不需要 SEO）
- 使用者儀表板（不需要 SEO）
- 互動式應用（如遊戲、工具）

### 2.5 Hybrid Rendering（混合渲染）

**定義：** 根據不同頁面的需求，混合使用多種 Rendering Modes。

**配置方式：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // 預設 SSR
  routeRules: {
    // 需要 SEO 的頁面：SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },
    
    // 內容固定的頁面：SSG
    '/about': { prerender: true },
    '/contact': { prerender: true },
    
    // 不需要 SEO 的頁面：CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**優點：**
- ✅ 根據頁面特性選擇合適的模式
- ✅ 平衡 SEO、效能、開發體驗
- ✅ 靈活度高

**適用場景：**
- 大型專案（不同頁面有不同需求）
- 電商平台（產品頁 SSR、後台 CSR、關於頁 SSG）

### 2.6 ISR (Incremental Static Regeneration)

**定義：** 增量靜態再生。結合了 SSG 的效能與 SSR 的動態性。頁面在建置時或第一次請求時生成靜態 HTML，並在一段時間（TTL）內快取。當快取過期後的下一次請求，會觸發後台重新生成頁面，同時回傳舊的快取內容（Stale-While-Revalidate）。

**配置方式：**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 啟用 ISR，快取 1 小時 (3600 秒)
    '/blog/**': { swr: 3600 },
    // 或者使用 isr 屬性 (在 Netlify/Vercel 等平台有特定支援)
    '/products/**': { isr: 600 },
  },
});
```

**流程：**
1. 請求 A 到達：Server 渲染頁面，回傳並快取 (Cache MISS -> HIT)。
2. 請求 B 到達 (TTL 內)：直接回傳快取內容 (Cache HIT)。
3. 請求 C 到達 (TTL 後)：直接回傳舊快取 (Stale)，同時在背景重新渲染並更新快取 (Revalidate)。
4. 請求 D 到達：回傳新的快取內容。

**優點：**
- ✅ 接近 SSG 的極致效能
- ✅ 解決 SSG 建置時間過長的問題
- ✅ 內容可以定期更新

**適用場景：**
- 大型部落格
- 電商產品詳情頁
- 新聞網站

### 2.7 Route Rules 與快取策略

Nuxt 3 使用 `routeRules` 來統一管理混合渲染與快取策略。這是在 Nitro 層級處理的。

| 屬性 | 意義 | 適用場景 |
|------|------|---------|
| `ssr: true` | 強制 Server-Side Rendering | SEO + 高度動態 |
| `ssr: false` | 強制 Client-Side Rendering (SPA) | 後台、儀表板 |
| `prerender: true` | 建置時預渲染 (SSG) | 關於我們、條款頁 |
| `swr: true` | 啟用 SWR 快取 (無過期時間，直到重新部署) | 變動極少的內容 |
| `swr: 60` | 啟用 ISR，快取 60 秒 | 列表頁、活動頁 |
| `cache: { maxAge: 60 }` | 設定 Cache-Control header (瀏覽器/CDN 快取) | 靜態資源 |

---

## 3. 選擇策略

### 3.1 根據需求選擇 Rendering Mode

**決策流程圖：**

```
需要 SEO？
├─ 是 → 內容經常變動？
│   ├─ 是 → SSR
│   └─ 否 → SSG
└─ 否 → CSR
```

**選擇對照表：**

| 需求 | 推薦模式 | 原因 |
|------|---------|------|
| **需要 SEO** | SSR / SSG | 搜尋引擎可以看到完整內容 |
| **內容經常變動** | SSR | 每次請求都能取得最新內容 |
| **內容相對固定** | SSG | 效能最佳，成本最低 |
| **不需要 SEO** | CSR | 互動性高，頁面切換流暢 |
| **大量頁面** | SSG | 建置時生成，CDN 快取 |
| **使用者特定內容** | SSR / CSR | 需要動態生成 |

### 3.2 實戰案例

#### 案例 1：電商平台

**需求：**
- 產品頁需要 SEO（讓 Google 索引）
- 產品內容經常變動（價格、庫存）
- 使用者個人頁面不需要 SEO

**解決方案：**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // 產品頁：SSR（需要 SEO + 動態內容）
    '/products/**': { ssr: true },
    
    // 關於我們：SSG（內容固定）
    '/about': { prerender: true },
    
    // 使用者頁面：CSR（不需要 SEO）
    '/user/**': { ssr: false },
  },
});
```

#### 案例 2：部落格網站

**需求：**
- 文章頁需要 SEO
- 文章內容相對固定（發布後不會頻繁變動）
- 需要快速載入

**解決方案：**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // 文章頁：SSG（內容固定 + 需要 SEO）
    '/articles/**': { prerender: true },
    
    // 首頁：SSG（內容固定）
    '/': { prerender: true },
    
    // 後台管理：CSR（不需要 SEO）
    '/admin/**': { ssr: false },
  },
});
```

---

## 4. 面試重點整理

### 4.1 Nuxt 3 的 Rendering Modes

**可以這樣回答：**

> Nuxt 3 支援四種 Rendering Modes：SSR 是在 Server 端每次請求時渲染，適合需要 SEO 且內容動態的頁面；SSG 是在建置時預先生成 HTML，適合需要 SEO 且內容固定的頁面，效能最佳；CSR 是在瀏覽器端渲染，適合不需要 SEO 且互動性高的頁面；Hybrid Rendering 是混合使用多種模式，根據不同頁面的需求選擇合適的模式。

**關鍵點：**
- ✅ 四種模式的特性與差異
- ✅ 適用場景與選擇考量
- ✅ Hybrid Rendering 的優勢

### 4.2 如何選擇 Rendering Mode？

**可以這樣回答：**

> 選擇 Rendering Mode 主要考量三個因素：SEO 需求、內容動態性、效能要求。需要 SEO 的頁面選擇 SSR 或 SSG；內容經常變動的選擇 SSR；內容固定的選擇 SSG；不需要 SEO 的頁面可以選擇 CSR。實際專案中通常會使用 Hybrid Rendering，根據不同頁面的特性選擇合適的模式。例如，電商平台的產品頁使用 SSR（需要 SEO + 動態內容），關於我們頁面使用 SSG（內容固定），使用者個人頁面使用 CSR（不需要 SEO）。

**關鍵點：**
- ✅ 根據 SEO 需求、內容動態性、效能要求選擇
- ✅ 實際專案中混合使用多種模式
- ✅ 具體案例說明

### 4.3 ISR 與 Route Rules
**Q: 如何實作 ISR（Incremental Static Regeneration）？Nuxt 3 的 caching 機制有哪些？**

> **回答範例：**
> 在 Nuxt 3 中，我們可以透過 `routeRules` 來實作 ISR。
> 只要在 `nuxt.config.ts` 中設定 `{ swr: 秒數 }`，Nitro 就會自動啟用 Stale-While-Revalidate 機制。
> 例如 `'/blog/**': { swr: 3600 }` 代表該路徑下的頁面會被快取 1 小時。
> `routeRules` 非常強大，可以針對不同路徑設定不同的策略：有的頁面走 SSR，有的走 SSG (`prerender: true`)，有的走 ISR (`swr`)，有的走 CSR (`ssr: false`)，這就是 Hybrid Rendering 的精隨。

---

## 5. 最佳實踐

### 5.1 選擇原則

1. **需要 SEO 的頁面**
   - 內容固定 → SSG
   - 內容動態 → SSR

2. **不需要 SEO 的頁面**
   - 互動性高 → CSR
   - 需要 Server 端邏輯 → SSR

3. **混合策略**
   - 根據頁面特性選擇合適的模式
   - 使用 `routeRules` 統一管理

### 5.2 配置建議

1. **預設使用 SSR**
   - 確保 SEO 友善
   - 可以後續針對特定頁面調整

2. **使用 routeRules 統一管理**
   - 集中配置，易於維護
   - 清楚標示每個頁面的渲染模式

3. **定期檢視與優化**
   - 根據實際使用情況調整
   - 監控效能指標

---

## 6. 面試總結

**可以這樣回答：**

> Nuxt 3 支援四種 Rendering Modes：SSR、SSG、CSR 和 Hybrid Rendering。SSR 適合需要 SEO 且內容動態的頁面；SSG 適合需要 SEO 且內容固定的頁面，效能最佳；CSR 適合不需要 SEO 且互動性高的頁面。選擇時主要考量 SEO 需求、內容動態性和效能要求。實際專案中通常會使用 Hybrid Rendering，根據不同頁面的特性選擇合適的模式。例如，電商平台的產品頁使用 SSR，關於我們頁面使用 SSG，使用者個人頁面使用 CSR。

**關鍵點：**
- ✅ 四種 Rendering Modes 的特性與差異
- ✅ 選擇策略與考量因素
- ✅ Hybrid Rendering 的實作經驗
- ✅ 實際專案案例

---

## 7. Reference

- [Nuxt 3 Rendering Modes](https://nuxt.com/docs/guide/concepts/rendering)
- [Nuxt 3 Route Rules](https://nuxt.com/docs/api/nuxt-config#routerules)

