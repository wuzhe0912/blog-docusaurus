---
id: css-units
title: '[Medium] 🏷️ CSS 单位'
slug: /css-units
tags: [CSS, Quiz, Medium]
---

## 1. 请说明 `px`, `em`, `rem`, `vw`, `vh` 的差异

### 快速比较表

| 单位  | 类型     | 相对于                 | 是否受父元素影响 | 常见用途                       |
| ----- | -------- | ---------------------- | ---------------- | ------------------------------ |
| `px`  | 绝对单位 | 屏幕像素               | ❌               | 边框、阴影、小细节             |
| `em`  | 相对单位 | **父元素**的 font-size | ✅               | 内距、边距（需要跟随字体大小） |
| `rem` | 相对单位 | **根元素**的 font-size | ❌               | 字体、间距、通用尺寸           |
| `vw`  | 相对单位 | 视窗宽度的 1%          | ❌               | 响应式宽度、全宽元素           |
| `vh`  | 相对单位 | 视窗高度的 1%          | ❌               | 响应式高度、全屏区块           |

### 详细说明

#### `px` (Pixels)

**定义**：绝对单位，1px = 屏幕上的一个像素点

**特性**：

- 固定大小，不会因为任何设定改变
- 精确控制，但缺乏弹性
- 不利于响应式设计和无障碍设计

**使用时机**：

```css
/* ✅ 适合用于 */
border: 1px solid #000; /* 边框 */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 阴影 */
border-radius: 4px; /* 小圆角 */

/* ❌ 不建议用于 */
font-size: 16px; /* 字体建议用 rem */
width: 1200px; /* 宽度建议用 % 或 vw */
```

#### `em`

**定义**：相对于**父元素** font-size 的倍数

**特性**：

- 会累加继承（嵌套结构会叠加）
- 弹性高但容易失控
- 适合需要跟随父元素缩放的场景

**计算范例**：

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em; /* 16px × 1.5 = 24px */
  padding: 1em; /* 24px × 1 = 24px（相对于自己的 font-size）*/
}

.grandchild {
  font-size: 1.5em; /* 24px × 1.5 = 36px（累加效应！）*/
}
```

**使用时机**：

```css
/* ✅ 适合用于 */
.button {
  font-size: 1rem;
  padding: 0.5em 1em; /* 内距跟随按钮字体大小 */
}

.card-title {
  font-size: 1.2em; /* 相对于卡片的基础字体 */
  margin-bottom: 0.5em; /* 间距跟随标题大小 */
}

/* ⚠️ 小心嵌套累加 */
```

#### `rem` (Root em)

**定义**：相对于**根元素**（`<html>`）font-size 的倍数

**特性**：

- 不会累加继承（始终相对于根元素）
- 易于管理和维护
- 方便实现全局缩放
- 最推荐的单位之一

**计算范例**：

```css
html {
  font-size: 16px; /* 浏览器预设 */
}

.element {
  font-size: 1.5rem; /* 16px × 1.5 = 24px */
  padding: 2rem; /* 16px × 2 = 32px */
  margin: 1rem 0; /* 16px × 1 = 16px */
}

.nested .element {
  font-size: 1.5rem; /* 还是 24px，不会累加！ */
}
```

**使用时机**：

```css
/* ✅ 最推荐用于 */
html {
  font-size: 16px; /* 设定基准 */
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

/* ✅ 方便实现暗黑模式或无障碍调整 */
@media (prefers-reduced-motion: reduce) {
  html {
    font-size: 18px; /* 所有 rem 单位自动放大 */
  }
}
```

#### `vw` (Viewport Width)

**定义**：相对于视窗宽度的 1%（100vw = 视窗宽度）

**特性**：

- 真正的响应式单位
- 会随浏览器视窗大小即时改变
- 注意：100vw 包含滚动条宽度

**计算范例**：

```css
/* 假设视窗宽度 1920px */
.element {
  width: 50vw; /* 1920px × 50% = 960px */
  font-size: 5vw; /* 1920px × 5% = 96px */
}

/* 假设视窗宽度 375px（手机） */
.element {
  width: 50vw; /* 375px × 50% = 187.5px */
  font-size: 5vw; /* 375px × 5% = 18.75px */
}
```

**使用时机**：

```css
/* ✅ 适合用于 */
.hero {
  width: 100vw; /* 全宽横幅 */
  margin-left: calc(-50vw + 50%); /* 突破容器限制 */
}

.hero-title {
  font-size: clamp(2rem, 5vw, 5rem); /* 响应式字体 */
}

.responsive-box {
  width: 80vw;
  max-width: 1200px; /* 加上最大值限制 */
}

/* ❌ 避免 */
body {
  width: 100vw; /* 会导致水平滚动条（因为包含滚动条宽度）*/
}
```

#### `vh` (Viewport Height)

**定义**：相对于视窗高度的 1%（100vh = 视窗高度）

**特性**：

- 适合制作全屏效果
- 移动设备需注意地址栏的问题
- 可能会受到键盘弹出影响

**使用时机**：

```css
/* ✅ 适合用于 */
.hero-section {
  height: 100vh; /* 全屏首页 */
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

/* ⚠️ 移动设备的替代方案 */
.hero-section {
  height: 100vh;
  height: 100dvh; /* 动态视窗高度（较新的单位）*/
}

/* ✅ 垂直居中 */
.center-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### 实务建议与最佳实践

#### 1. 建立响应式字体系统

```css
/* 设定基准 */
html {
  font-size: 16px; /* 桌面预设 */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* 平板 */
  }
}

@media (max-width: 480px) {
  html {
    font-size: 12px; /* 手机 */
  }
}

/* 所有使用 rem 的元素会自动缩放 */
h1 {
  font-size: 2.5rem;
} /* 桌面 40px, 手机 30px */
p {
  font-size: 1rem;
} /* 桌面 16px, 手机 12px */
```

#### 2. 混合使用不同单位

```css
.card {
  /* 响应式宽度 + 限制范围 */
  width: 90vw;
  max-width: 75rem;

  /* rem 用于间距 */
  padding: 2rem;
  margin: 1rem auto;

  /* px 用于细节 */
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  /* clamp 结合多种单位，实现流畅缩放 */
  font-size: clamp(1.25rem, 3vw, 2rem);
}
```

### 面试回答范例

**回答结构**：

```markdown
1. **px**：像素小细节 → 边框、阴影、小圆角
2. **rem**：根基稳不变 → 字体、间距、主要尺寸
3. **em**：跟随父元素
4. **vw**：视窗宽度变 → 响应式宽度
5. **vh**：视窗高度满 → 全屏区块
```

1. **快速定义**

   - px 是绝对单位，其他都是相对单位
   - em 相对父元素，rem 相对根元素
   - vw/vh 相对视窗尺寸

2. **关键差异**

   - rem 不会累加，em 会累加（这是主要区别）
   - vw/vh 真正响应式，但要注意滚动条问题

3. **实务应用**

   - **px**：1px 边框、阴影等细节
   - **rem**：字体、间距、容器（最常用，易维护）
   - **em**：按钮内距（需要跟随字体缩放时）
   - **vw/vh**：全宽横幅、全屏区块、响应式字体配合 clamp

4. **最佳实践**
   - 设定 html font-size 作为基准
   - 使用 clamp() 结合不同单位
   - 注意移动设备的 vh 问题（可用 dvh）

### Reference

- [MDN - CSS values and units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Units - A Complete Guide](https://www.freecodecamp.org/news/css-unit-guide/)
- [Modern CSS Solutions](https://moderncss.dev/generating-font-size-css-rules-and-creating-a-fluid-type-scale/)
