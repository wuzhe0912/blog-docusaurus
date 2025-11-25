---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Please explain and compare the advantages and disadvantages of SPA and SSR

> 請解釋並比較 SPA 和 SSR 的優缺點

### SPA(單頁式應用程式)

#### SPA 優點

1. 使用者體驗：SPA 的本質就是一個頁面，只是透過動態載入資料，結合前端的路由，讓使用者認為有在切換頁面，但實際上只是切換 component，這樣的使用體驗自然更為絲滑快速。
2. 前後端分離：前端只需要負責頁面渲染與互動，而後端則只需要提供數據 API，不但減輕彼此開發的負擔，也更易維護。
3. 網路優化：因為只需要載入一次頁面，不像傳統多頁面結構，每次切換頁面都需要重新載入，自然也就減少了請求的次數，降低 server 端的負擔。

#### SPA 缺點

1. 搜尋引擎優化(SEO)：SPA 的頁面都是動態載入的，因此搜尋引擎無法直接抓取到頁面內容(雖然近年 Google 聲稱有在改善這點)，面對搜尋引擎的爬蟲，還是不如傳統的 HTML。
2. 首頁載入時間：SPA 需要在 client 端載入並執行 Javascript，才能渲染出頁面，因此首頁的載入時間會比較長，尤其是在網路狀況不佳的情況下，可能會導致首次載入時間延遲。

### SSR(伺服器端渲染)

#### SSR 優點

1. 搜尋引擎優化(SEO)：因為 SSR 是在 server 端就已經渲染好包含數據的頁面，因此搜尋引擎可以直接抓取到頁面內容，這也是 SSR 最大的優勢。
2. 載入時間：因為 SSR 將原本的渲染負擔轉移到 server 端，可以縮短首次進入的渲染時間。

#### SSR 缺點

1. 學習成本和複雜度：以 Next 和 Nuxt 為例，雖然他們本質都是奠基在 React 和 Vue 上，但是他們已經各自衍生出自己的生態系，無形中抬高了學習成本，以近期的 Next.js 14 改版來看，客觀來說，並不是每個開發者都能接受這樣的改變。
2. 伺服器負擔：因為渲染的工作轉移到 server 端，可能會對 server 造成更大的負擔，尤其如果是遇到高流量的應用場景。

### 結論

原則上，如果是後台的系統，在沒有 SEO 的需求下，應該是沒必要使用 SSR 框架，除非是仰賴搜尋引擎的產品網頁，那確實可以評估採用 SSR 框架開發。

## 2. 請闡述使用過的 Web Framework，並比較其優缺點

**兩者近年都往「以函式為主的組件開發」收斂：**

> Vue 3 透過 Composition API，把邏輯拆成可重用的 composable；React 則以 Hooks 為核心。在開發者體驗上兩者相當接近，不過整體而言，Vue 的上手成本較低，React 則在生態與彈性上更強。

### Vue（以 Vue 3 為主）

**優點：**

- **學習曲線較平滑**：  
  SFC（Single File Component）把 template / script / style 聚在一起，對於從傳統前端（後端模板）轉過來的開發者很友善。
- **官方約定明確、對團隊有利**：  
  官方提供的風格指南與慣例清楚（檔案結構、命名、組件拆分方式），新成員接手專案時較容易維持一致性。
- **核心生態完整**：  
  官方維護 Vue Router、Pinia（或 Vuex）、CLI / Vite Plugin 等，從建專案到狀態管理、路由都有「官方解法」，降低選型成本。
- **Composition API 提升可維護性**：  
  可以依功能拆出 composable（例如 useAuth、useForm），在大型專案中共用邏輯、減少重複程式碼。

**缺點：**

- **生態與社群規模略小於 React**：  
  第三方套件數量與多樣性不如 React，有些前沿工具或整合（例如設計系統、特殊場景的 library）會先以 React 為主。
- **就業市場相對集中在特定區域／產業**：  
  相較 React，國外或跨國團隊多半以 React 為主，在職涯彈性上相對劣勢很多（但在華語圈則持各半）。

---

### React

**優點：**

- **生態圈龐大、技術更新速度快**：  
  幾乎所有前端新技術、設計系統或第三方服務，都會優先提供 React 版本（例如各種 UI Library、Chart、Editor、Design System）。
- **彈性高、可因專案自由組合技術棧**：  
  可搭配 Redux / Zustand / Recoil 等多種狀態管理，也有 Next.js、Remix 等 Meta Framework，從 SPA 到 SSR、SSG、CSR 都有成熟方案。
- **與 TypeScript、前端工程化整合成熟**：  
  社群對型別與大型專案的最佳實務討論很多，對長期維護的大型專案有幫助。

**缺點：**

- **自由度高，團隊需要自訂規範**：  
  在沒有明確 coding style、架構約定的情況下，不同開發者可能用完全不同的寫法與狀態管理方式，後續維護成本會提高。
- **學習曲線實際上不低**：  
  除了 React 本身（JSX、Hooks 思維）以外，還要面對 Router、狀態管理、資料抓取、SSR 等一連串選型，新手容易迷失在「要選哪個 library」。
- **API 變動與最佳實務演進較快**：  
  例如從 Class Component 到 Function Component + Hooks、再到 Server Components 等，老專案與新寫法共存時，需要額外的遷移與維護成本。
