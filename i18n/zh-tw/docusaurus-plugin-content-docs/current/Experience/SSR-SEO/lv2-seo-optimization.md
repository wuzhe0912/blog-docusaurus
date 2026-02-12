---
title: '[Lv2] SEO 進階優化：動態 Meta Tags 與追蹤整合'
slug: /experience/ssr-seo/lv2-seo-optimization
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> 在多品牌平台專案中，實作動態 SEO 管理機制：動態 Meta Tags 注入、第三方追蹤整合（Google Analytics、Facebook Pixel），以及集中化的 SEO 設定管理。

---

## 1. 面試回答主軸

1. **動態 Meta Tags 注入**：實作可透過後台 API 動態更新 Meta Tags 的機制，支援多品牌/多站點配置。
2. **第三方追蹤整合**：整合 Google Tag Manager、Google Analytics 和 Facebook Pixel，支援非同步載入不阻塞頁面。
3. **集中化管理**：使用 Pinia Store 集中管理 SEO 設定，易於維護和擴展。

---

## 2. 動態 Meta Tags 注入機制

### 2.1 為什麼需要動態 Meta Tags？

**問題情境：**

- 多品牌平台，每個品牌需要不同的 SEO 設定
- 需要透過後台管理系統動態更新 SEO 內容
- 避免每次修改都要重新部署前端

**解決方案：** 實作動態 Meta Tags 注入機制

### 2.2 實作細節

**檔案位置：** `src/common/hooks/useTrafficAnalysis.ts`

```typescript
// 第 38-47 行
case TRAFFIC_ANALYSIS.Enums.meta_tag:
  Object.keys(trafficAnalysisConfig).forEach((name) => {
    const metaObj = trafficAnalysisConfig as { [key: string]: string }
    const content = metaObj[name]

    const meta = document.createElement("meta")
    meta.setAttribute("name", name)
    meta.setAttribute("content", content)
    document.head.appendChild(meta)
  })
  break
```

**功能說明：**

- 支援動態注入多種 meta tags
- 可透過後台設定配置不同的 meta 內容
- 支援不同品牌/站點的客製化 SEO 設定
- 在客戶端執行時動態插入到 `<head>` 中

### 2.3 使用範例

```typescript
// 從後台 API 取得的設定
const trafficAnalysisConfig = {
  description: '多品牌遊戲平台',
  keywords: '遊戲,娛樂,線上遊戲',
  author: 'Company Name',
};

// 動態注入 Meta Tags
trafficAnalysisConfig.forEach((config) => {
  // 建立並插入 meta tag
});
```

**優點：**

- ✅ 無需重新部署即可更新 SEO 內容
- ✅ 支援多品牌配置
- ✅ 集中化管理

**限制：**

- ⚠️ 客戶端注入，搜尋引擎可能無法完整抓取
- ⚠️ 建議搭配 SSR 使用效果更佳

---

## 3. Google Tag Manager / Google Analytics 整合

### 3.1 非同步載入機制

**檔案位置：** `src/common/hooks/useTrafficAnalysis.ts`

```typescript
// 第 13-35 行
case TRAFFIC_ANALYSIS.Enums.google_tag:
  if (!trafficAnalysisConfig.tag_id) {
    console.warn("tag_id is empty")
    return
  }

  try {
    const script = document.createElement("script")
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trafficAnalysisConfig.tag_id}`
    document.head.appendChild(script)

    const script2 = document.createElement("script")
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trafficAnalysisConfig.tag_id}');
    `
    document.head.appendChild(script2)
  } catch (error) {
    console.error("Error loading GTM:", error)
  }
  break
```

**關鍵實作：**

- 使用 `script.async = true` 非同步載入，不阻塞頁面渲染
- 動態建立 `<script>` 標籤並插入
- 支援透過後台配置不同的追蹤 ID
- 包含錯誤處理機制

### 3.2 為什麼使用非同步載入？

| 載入方式       | 影響                | 建議    |
| -------------- | ------------------- | ------- |
| **同步載入**   | ❌ 阻塞頁面渲染     | 不建議  |
| **非同步載入** | ✅ 不阻塞頁面       | ✅ 推薦 |
| **延遲載入**   | ✅ 頁面載入後再載入 | 可考慮  |

**效能考量：**

- 追蹤腳本不應影響頁面載入速度
- 使用 `async` 屬性確保非阻塞
- 錯誤處理避免載入失敗影響頁面

---

## 4. Facebook Pixel 追蹤

### 4.1 頁面瀏覽追蹤

**檔案位置：** `src/router/index.ts`

```typescript
// 第 102-106 行
router.afterEach(() => {
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
});
```

**功能說明：**

- 在每個路由切換後觸發 Facebook Pixel 頁面瀏覽追蹤
- 支援 Facebook 廣告轉換追蹤
- 使用 `router.afterEach` 確保路由切換完成後才觸發

### 4.2 為什麼在 Router 中實作？

**優點：**

- ✅ 集中管理，所有路由自動追蹤
- ✅ 不需要在每個頁面手動加入追蹤碼
- ✅ 確保追蹤的一致性

**注意事項：**

- 需要確認 `window.fbq` 已載入
- 避免在 SSR 環境中執行（需要檢查環境）

---

## 5. SEO 設定集中化管理

### 5.1 Pinia Store 管理

**檔案位置：** `src/stores/TrafficAnalysisStore.ts`

```typescript
// 第 25-38 行
function updateTrafficAnalysisConfigMap(data: Response.ISetting) {
  if ('digital_analytics' in data) {
    const analytics = JSON.parse(data.digital_analytics);
    Object.keys(analytics).forEach((service) => {
      const analysisKey = service as TrafficAnalysisKey;
      if (analysisKey in trafficAnalysisConfigMap) {
        trafficAnalysisConfigMap[analysisKey] = {
          ...trafficAnalysisConfigMap[analysisKey],
          ...analytics[analysisKey],
        };
      }
    });
  }
}
```

**功能說明：**

- 透過 Pinia Store 集中管理 SEO 相關設定
- 支援從後台 API 動態更新設定
- 集中管理多種 SEO 服務配置（Meta Tags、GA、GTM、Facebook Pixel 等）

### 5.2 架構優勢

```
┌─────────────────────────────────────┐
│   SEO Configuration Store            │
│   (TrafficAnalysisStore.ts)         │
├─────────────────────────────────────┤
│   - Centralized management          │
│   - API-driven updates               │
│   - Multi-service support            │
└─────────────────────────────────────┘
         │
         ├──> Meta Tags Injection
         ├──> Google Analytics
         ├──> Google Tag Manager
         └──> Facebook Pixel
```

**優點：**

- ✅ 單一資料來源，易於維護
- ✅ 支援動態更新，無需重新部署
- ✅ 統一的錯誤處理和驗證
- ✅ 易於擴展新的追蹤服務

---

## 6. 完整實作流程

### 6.1 初始化流程

```typescript
// 1. App 啟動時從 Store 取得設定
const trafficAnalysisStore = useTrafficAnalysisStore();

// 2. 從後台 API 載入設定
await trafficAnalysisStore.fetchSettings();

// 3. 根據設定類型執行對應的注入邏輯
const config = trafficAnalysisStore.getConfig('meta_tag');
if (config) {
  injectMetaTags(config);
}

const gaConfig = trafficAnalysisStore.getConfig('google_tag');
if (gaConfig) {
  loadGoogleAnalytics(gaConfig.tag_id);
}
```

### 6.2 多品牌支援

```typescript
// 不同品牌可以有不同的 SEO 設定
const brandAConfig = {
  meta_tag: {
    description: '品牌 A 的描述',
    keywords: '品牌A,遊戲',
  },
  google_tag: {
    tag_id: 'GA-XXXXX-A',
  },
};

const brandBConfig = {
  meta_tag: {
    description: '品牌 B 的描述',
    keywords: '品牌B,娛樂',
  },
  google_tag: {
    tag_id: 'GA-YYYYY-B',
  },
};
```

---

## 7. 面試重點整理

### 7.1 動態 Meta Tags

**可以這樣回答：**

> 在專案中，實作了動態 Meta Tags 注入機制。因為這是多品牌平台，每個品牌需要不同的 SEO 設定，而且需要透過後台管理系統動態更新。使用 JavaScript 動態建立 `<meta>` 標籤並插入到 `<head>` 中，這樣可以無需重新部署就更新 SEO 內容。

**關鍵點：**

- ✅ 動態注入的實作方式
- ✅ 多品牌/多站點支援
- ✅ 後台管理整合

### 7.2 第三方追蹤整合

**可以這樣回答：**

> 整合了 Google Analytics、Google Tag Manager 和 Facebook Pixel。為了不影響頁面效能，使用非同步載入的方式，設定 `script.async = true`，確保追蹤腳本不會阻塞頁面渲染。同時，在 Router 的 `afterEach` hook 中加入 Facebook Pixel 的頁面瀏覽追蹤，確保所有路由切換都會被正確追蹤。

**關鍵點：**

- ✅ 非同步載入的實作
- ✅ 效能考量
- ✅ Router 整合

### 7.3 集中化管理

**可以這樣回答：**

> 使用 Pinia Store 集中管理所有 SEO 相關設定，包括 Meta Tags、Google Analytics、Facebook Pixel 等。這樣的好處是單一資料來源，易於維護，而且可以從後台 API 動態更新設定，無需重新部署前端。

**關鍵點：**

- ✅ 集中化管理的優勢
- ✅ API 驅動的更新機制
- ✅ 易於擴展

---

## 8. 改進建議

### 8.1 SSR 支援

**目前限制：**

- 動態 Meta Tags 在客戶端注入，搜尋引擎可能無法完整抓取

**改進方向：**

- 將 Meta Tags 注入改為 SSR 模式
- 在伺服器端生成完整的 HTML，而非客戶端注入

### 8.2 結構化資料

**建議實作：**

- JSON-LD 結構化資料
- 支援 Schema.org 標記
- 提升搜尋結果的豐富度

### 8.3 Sitemap 與 Robots.txt

**建議實作：**

- 自動生成 XML sitemap
- 動態更新路由資訊
- 配置 robots.txt

---

## 9. 面試總結

**可以這樣回答：**

> 在專案中，實作了完整的 SEO 優化機制。首先，實作了動態 Meta Tags 注入，支援透過後台 API 動態更新 SEO 內容，這對於多品牌平台特別重要。其次，整合了 Google Analytics、Google Tag Manager 和 Facebook Pixel，使用非同步載入確保不影響頁面效能。最後，使用 Pinia Store 集中管理所有 SEO 設定，讓維護和擴展都更容易。

**關鍵點：**

- ✅ 動態 Meta Tags 注入機制
- ✅ 第三方追蹤整合（非同步載入）
- ✅ 集中化管理架構
- ✅ 多品牌/多站點支援
- ✅ 實際專案經驗
