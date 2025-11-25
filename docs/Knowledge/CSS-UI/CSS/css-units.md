---
id: css-units
title: '[Medium] 🏷️ CSS Units'
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. 請說明 `px`, `em`, `rem`, `vw`, `vh` 的差異

### 快速比較表

| 單位  | 類型     | 相對於                 | 是否受父元素影響 | 常見用途                       |
| ----- | -------- | ---------------------- | ---------------- | ------------------------------ |
| `px`  | 絕對單位 | 螢幕像素               | ❌               | 邊框、陰影、小細節             |
| `em`  | 相對單位 | **父元素**的 font-size | ✅               | 內距、邊距（需要跟隨字體大小） |
| `rem` | 相對單位 | **根元素**的 font-size | ❌               | 字體、間距、通用尺寸           |
| `vw`  | 相對單位 | 視窗寬度的 1%          | ❌               | 響應式寬度、全寬元素           |
| `vh`  | 相對單位 | 視窗高度的 1%          | ❌               | 響應式高度、全屏區塊           |

### 詳細說明

#### `px` (Pixels)

**定義**：絕對單位，1px = 螢幕上的一個像素點

**特性**：

- 固定大小，不會因為任何設定改變
- 精確控制，但缺乏彈性
- 不利於響應式設計和無障礙設計

**使用時機**：

```css
/* ✅ 適合用於 */
border: 1px solid #000; /* 邊框 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 陰影 */
border-radius: 4px; /* 小圓角 */

/* ❌ 不建議用於 */
font-size: 16px; /* 字體建議用 rem */
width: 1200px; /* 寬度建議用 % 或 vw */
```

#### `em`

**定義**：相對於**父元素** font-size 的倍數

**特性**：

- 會累加繼承（巢狀結構會疊加）
- 彈性高但容易失控
- 適合需要跟隨父元素縮放的場景

**計算範例**：

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
  padding: 1em; /* 24px × 1 = 24px（相對於自己的 font-size）*/
}

.grandchild {
  font-size: 1.5em; /* 24px × 1.5 = 36px（累加效應！）*/
}
```

**使用時機**：

```css
/* ✅ 適合用於 */
.button {
  font-size: 1rem;
  padding: 0.5em 1em; /* 內距跟隨按鈕字體大小 */
}

.card-title {
  font-size: 1.2em; /* 相對於卡片的基礎字體 */
  margin-bottom: 0.5em; /* 間距跟隨標題大小 */
}

/* ⚠️ 小心巢狀累加 */
```

#### `rem` (Root em)

**定義**：相對於**根元素**（`<html>`）font-size 的倍數

**特性**：

- 不會累加繼承（始終相對於根元素）
- 易於管理和維護
- 方便實現全域縮放
- 最推薦的單位之一

**計算範例**：

```css
html {
  font-size: 16px; /* 瀏覽器預設 */
}

.element {
  font-size: 1.5rem; /* 16px × 1.5 = 24px */
  padding: 2rem; /* 16px × 2 = 32px */
  margin: 1rem 0; /* 16px × 1 = 16px */
}

.nested .element {
  font-size: 1.5rem; /* 還是 24px，不會累加！ */
}
```

**使用時機**：

```css
/* ✅ 最推薦用於 */
html {
  font-size: 16px; /* 設定基準 */
}

body {
  font-size: 1rem; /* 正文 16px */
}

h1 {
  font-size: 2.5rem; /* 40px */
}

p {
  font-size: 1rem; /* 16px */
  margin-bottom: 1rem; /* 16px */
}

.container {
  padding: 2rem; /* 32px */
  max-width: 75rem; /* 1200px */
}

/* ✅ 方便實現暗黑模式或無障礙調整 */
@media (prefers-reduced-motion: reduce) {
  html {
    font-size: 18px; /* 所有 rem 單位自動放大 */
  }
}
```

#### `vw` (Viewport Width)

**定義**：相對於視窗寬度的 1%（100vw = 視窗寬度）

**特性**：

- 真正的響應式單位
- 會隨瀏覽器視窗大小即時改變
- 注意：100vw 包含滾動條寬度

**計算範例**：

```css
/* 假設視窗寬度 1920px */
.element {
  width: 50vw; /* 1920px × 50% = 960px */
  font-size: 5vw; /* 1920px × 5% = 96px */
}

/* 假設視窗寬度 375px（手機） */
.element {
  width: 50vw; /* 375px × 50% = 187.5px */
  font-size: 5vw; /* 375px × 5% = 18.75px */
}
```

**使用時機**：

```css
/* ✅ 適合用於 */
.hero {
  width: 100vw; /* 全寬橫幅 */
  margin-left: calc(-50vw + 50%); /* 突破容器限制 */
}

.hero-title {
  font-size: clamp(2rem, 5vw, 5rem); /* 響應式字體 */
}

.responsive-box {
  width: 80vw;
  max-width: 1200px; /* 加上最大值限制 */
}

/* ❌ 避免 */
body {
  width: 100vw; /* 會導致水平滾動條（因為包含滾動條寬度）*/
}
```

#### `vh` (Viewport Height)

**定義**：相對於視窗高度的 1%（100vh = 視窗高度）

**特性**：

- 適合製作全屏效果
- 移動裝置需注意地址欄的問題
- 可能會受到鍵盤彈出影響

**使用時機**：

```css
/* ✅ 適合用於 */
.hero-section {
  height: 100vh; /* 全屏首頁 */
}

.fullscreen-modal {
  height: 100vh;
  width: 100vw;
}

.sidebar {
  height: 100vh;
  position: sticky;
  top: 0;
}

/* ⚠️ 移動裝置的替代方案 */
.hero-section {
  height: 100vh;
  height: 100dvh; /* 動態視窗高度（較新的單位）*/
}

/* ✅ 垂直置中 */
.center-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 實務建議與最佳實踐

#### 1. 建立響應式字體系統

```css
/* 設定基準 */
html {
  font-size: 16px; /* 桌面預設 */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* 平板 */
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px; /* 手機 */
  }
}

/* 所有使用 rem 的元素會自動縮放 */
h1 {
  font-size: 2.5rem;
} /* 桌面 40px, 手機 30px */
p {
  font-size: 1rem;
} /* 桌面 16px, 手機 12px */
```

#### 2. 混合使用不同單位

```css
.card {
  /* 響應式寬度 + 限制範圍 */
  width: 90vw;
  max-width: 75rem;

  /* rem 用於間距 */
  padding: 2rem;
  margin: 1rem auto;

  /* px 用於細節 */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  /* clamp 結合多種單位，實現流暢縮放 */
  font-size: clamp(1.25rem, 3vw, 2rem);
}
```

### 面試回答範例

**回答結構**：

```markdown
1. **px**：像素小細節 → 邊框、陰影、小圓角
2. **rem**：根基穩不變 → 字體、間距、主要尺寸
3. **em**：跟隨父元素
4. **vw**：視窗寬度變 → 響應式寬度
5. **vh**：視窗高度滿 → 全屏區塊
```

1. **快速定義**

   - px 是絕對單位，其他都是相對單位
   - em 相對父元素，rem 相對根元素
   - vw/vh 相對視窗尺寸

2. **關鍵差異**

   - rem 不會累加，em 會累加（這是主要區別）
   - vw/vh 真正響應式，但要注意滾動條問題

3. **實務應用**

   - **px**：1px 邊框、陰影等細節
   - **rem**：字體、間距、容器（最常用，易維護）
   - **em**：按鈕內距（需要跟隨字體縮放時）
   - **vw/vh**：全寬橫幅、全屏區塊、響應式字體配合 clamp

4. **最佳實踐**
   - 設定 html font-size 作為基準
   - 使用 clamp() 結合不同單位
   - 注意移動裝置的 vh 問題（可用 dvh）

### Reference

- [MDN - CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Units - A Complete Guide](https://www.freecodecamp.org/news/css-unit-guide/)
- [Modern CSS Solutions](https://moderncss.dev/generating-font-size-css-rules-and-creating-a-fluid-type-scale/)
