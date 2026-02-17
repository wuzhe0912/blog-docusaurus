---
title: '[Lv2] Nuxt 3 Lifecycle 與 Hydration 原理'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> 深入理解 Nuxt 3 的生命週期（Lifecycle）、狀態管理（State Management）與 Hydration 機制，避免常見的 Hydration Mismatch 問題。

---

## 1. 面試回答主軸

1. **Lifecycle 差異**：區分 Server-side 與 Client-side 執行的 Hooks。`setup` 兩端都會執行，`onMounted` 僅在 Client 端執行。
2. **狀態管理**：理解 `useState` 與 `ref` 在 SSR 場景下的差異。`useState` 能在 Server 與 Client 間同步狀態，避免 Hydration Mismatch。
3. **Hydration 機制**：解釋 Hydration 是如何讓靜態 HTML 變為可互動應用，以及常見的 Mismatch 原因（HTML 結構不一致、隨機內容等）。

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Lifecycle Hooks 執行環境

在 Nuxt 3 (Vue 3 SSR) 中，不同的 Hooks 會在不同的環境下執行：

| Lifecycle Hook | Server-side | Client-side | 說明 |
|----------------|-------------|-------------|------|
| **setup()** | ✅ 執行 | ✅ 執行 | 組件初始化邏輯。**注意：避免在 setup 中使用僅 Client 端的 API（如 window, document）**。 |
| **onBeforeMount** | ❌ 不執行 | ✅ 執行 | 掛載前。 |
| **onMounted** | ❌ 不執行 | ✅ 執行 | 掛載完成。**DOM 操作、Browser API 呼叫應放在這裡**。 |
| **onBeforeUpdate** | ❌ 不執行 | ✅ 執行 | 資料更新前。 |
| **onUpdated** | ❌ 不執行 | ✅ 執行 | 資料更新後。 |
| **onBeforeUnmount** | ❌ 不執行 | ✅ 執行 | 卸載前。 |
| **onUnmounted** | ❌ 不執行 | ✅ 執行 | 卸載後。 |

### 2.2 常見面試題：onMounted 在 Server 端會執行嗎？

**回答：**
不會。`onMounted` 只會在 Client 端（瀏覽器）執行。Server 端渲染只負責生成 HTML 字串，不會進行 DOM 的掛載（Mounting）。

**延伸問題：如果在 Server 端需要執行特定邏輯怎麼辦？**
- 使用 `setup()` 或 `useAsyncData` / `useFetch`。
- 如果需要區分環境，可以使用 `process.server` 或 `process.client` 判斷。

```typescript
<script setup>
// Server 和 Client 都會執行
console.log('Setup executed');

if (process.server) {
  console.log('Only on Server');
}

onMounted(() => {
  // 只有 Client 會執行
  console.log('Mounted (Client Only)');
  // 安全地使用 window
  window.alert('Hello');
});
</script>
```

---

## 3. Nuxt 3 useState vs Vue ref

### 3.1 為什麼 Nuxt 需要 useState？

在 SSR 應用中，Server 端渲染完 HTML 後，會將狀態（State）序列化並傳送給 Client 端，以便 Client 端進行 Hydration（接手狀態）。

- **Vue `ref`**：是組件內的局部狀態。在 SSR 過程中，Server 端建立的 `ref` 值**不會**自動傳輸給 Client 端。Client 端初始化時會重新建立 `ref`（通常重置為初始值），導致 Server 渲染的內容與 Client 初始狀態不一致，產生 Hydration Mismatch。
- **Nuxt `useState`**：是 SSR 友善的狀態管理。它會將狀態儲存在 `NuxtPayload` 中，隨著 HTML 一起傳送給 Client。Client 端初始化時會讀取這個 Payload，還原狀態，確保 Server 與 Client 狀態一致。

### 3.2 比較表

| 特性 | Vue `ref` / `reactive` | Nuxt `useState` |
|------|------------------------|-----------------|
| **作用域** | 組件內 / 模組內 | 全域（App 範圍內可透過 key 共享） |
| **SSR 狀態同步** | ❌ 不會同步 | ✅ 自動序列化並同步到 Client |
| **適用場景** | 僅 Client 端互動狀態、不需要 SSR 同步的資料 | 跨組件狀態、需要從 Server 帶到 Client 的資料（如 User Info） |

### 3.3 實作範例

**錯誤示範（使用 ref 做跨端狀態）：**

```typescript
// Server 端產生隨機數 -> HTML 顯示 5
const count = ref(Math.random());

// Client 端重新執行 -> 產生新的隨機數 3
// 結果：Hydration Mismatch (Server: 5, Client: 3)
```

**正確示範（使用 useState）：**

```typescript
// Server 端產生隨機數 -> 存入 Payload (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client 端讀取 Payload -> 取得 Server 產生的值
// 結果：狀態一致
```

---

## 4. Hydration 與 Hydration Mismatch

### 4.1 什麼是 Hydration？

Hydration（注水）是指 Client 端 JavaScript 接管由 Server 端渲染的靜態 HTML 的過程。

1. **Server Rendering**：Server 執行 Vue 應用，生成 HTML 字串（包含內容與 CSS）。
2. **HTML 下載**：瀏覽器下載並顯示靜態 HTML（First Paint）。
3. **JS 下載與執行**：瀏覽器下載 Vue/Nuxt 的 JS bundle。
4. **Hydration**：Vue 在 Client 端重新建立虛擬 DOM (Virtual DOM)，比對現有的真實 DOM。如果結構一致，Vue 就會「啟用」這些 DOM 元素（綁定事件監聽器），讓頁面變為可互動。

### 4.2 什麼是 Hydration Mismatch？

當 Client 端生成的 Virtual DOM 結構與 Server 端渲染的 HTML 結構**不一致**時，Vue 就會報出 Hydration Mismatch 警告。這通常意味著 Client 端必須丟棄 Server 的 HTML 並重新渲染，導致效能下降與畫面閃爍。

### 4.3 常見的 Mismatch 原因與解法

#### 1. HTML 結構不合法
瀏覽器會自動修正錯誤的 HTML 結構，導致與 Vue 預期不符。
- **例子**：`<p>` 標籤內包含 `<div>`。
- **解法**：檢查 HTML 語法，確保巢狀結構合法。

#### 2. 隨機內容或時間戳記
Server 與 Client 執行時產生不同的內容。
- **例子**：`new Date()`、`Math.random()`。
- **解法**：
    - 使用 `useState` 固定值。
    - 或將這類邏輯移到 `onMounted` 中執行（只在 Client 渲染，Server 留白或顯示 Placeholder）。

```typescript
// 錯誤
const time = new Date().toISOString();

// 正確 (使用 onMounted)
const time = ref('');
onMounted(() => {
  time.value = new Date().toISOString();
});

// 或使用 <ClientOnly>
<ClientOnly>
  <div>{{ new Date() }}</div>
</ClientOnly>
```

#### 3. 條件渲染依賴於 window/document
- **例子**：`v-if="window.innerWidth > 768"`
- **原因**：Server 端沒有 window，判定為 false；Client 端判定為 true。
- **解法**：在 `onMounted` 更新狀態，或使用 `useWindowSize` 等 Client-only hooks。

---

## 5. 面試總結

**可以這樣回答：**

> Server-side 與 Client-side 的主要差異在於 Lifecycle Hooks 的執行。Server 端主要執行 `setup`，而 `onMounted` 等 DOM 相關 Hooks 只在 Client 端執行。這也引出了 Hydration 的概念，即 Client 端接管 Server HTML 的過程。
>
> 為了避免 Hydration Mismatch，我們必須確保 Server 與 Client 初始渲染的內容一致。這就是為什麼 Nuxt 提供了 `useState`。不同於 Vue 的 `ref`，`useState` 會將狀態序列化傳給 Client，確保兩端狀態同步。如果使用了 `ref` 儲存 Server 端生成的資料，Client 端重置時就會發生不一致。
>
> 常見的 Mismatch 像是隨機數、時間戳記或不合法的 HTML 巢狀結構。解決方式是將變動內容移至 `onMounted` 或使用 `<ClientOnly>` 組件。

**關鍵點：**
- ✅ `onMounted` 僅在 Client 執行
- ✅ `useState` 支援 SSR 狀態同步，`ref` 不支援
- ✅ Hydration Mismatch 的原因（結構、隨機值）與解法（`<ClientOnly>`、`onMounted`）

