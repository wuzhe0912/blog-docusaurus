---
id: performance-lv3-virtual-scroll
title: '[Lv3] 虚拟滚动实现：处理大量数据渲染'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> 当页面需要渲染 1000+ 条数据时，虚拟滚动可以将 DOM 节点从 1000+ 降至 20-30 个，内存使用降低 80%。

---

## 面试情境题

**Q: 页面上的 table 有不止一个，且如果各自有超过一百条数据，同时又有频繁更新 DOM 的事件，会用什么方法去优化这页的性能？**

---

## 问题分析（Situation）

### 实际项目场景

在平台项目中，我们可能有页面需要处理大量数据：

```markdown
📊 某页面历史记录页面
├─ 充值记录表格：1000+ 条
├─ 提款记录表格：800+ 条
├─ 投注记录表格：5000+ 条
└─ 每条记录 8-10 个字段（时间、金额、状态等）

❌ 未优化的问题
├─ DOM 节点数：1000 条 × 10 字段 = 10,000+ 个节点
├─ 内存占用：约 150-200 MB
├─ 首次渲染时间：3-5 秒（白屏）
├─ 滚动卡顿：FPS < 20
└─ WebSocket 更新时：整个表格重新渲染（非常卡）
```

### 问题严重性

```javascript
// ❌ 传统做法
<tr v-for="record in allRecords">  // 1000+ 条全部渲染
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8-10 个字段
</tr>

// 结果：
// - 初始渲染：10,000+ 个 DOM 节点
// - 用户实际可见：20-30 条
// - 浪费：99% 的节点用户根本看不到
```

---

## 解决方案（Action）

### Virtual Scrolling（虚拟滚动）

先考虑虚拟滚动的优化问题，从这个角度出发，大概有两个方向，一个是选择官方背书的第三方套件 [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)，根据参数和需求，来决定可视范围的 row。

```js
// 只渲染可见区域的 row，例如：
// - 100 条数据，只渲染可见的 20 条
// - 大幅减少 DOM 节点数量
```

另一种则是选择自己手写，但考虑到实际开发的成本，以及涵盖的情境，我应该会比较倾向采用官方背书的第三方套件。

### 数据更新频率控制

> 解法一：requestAnimationFrame（RAF）
> 概念：浏览器每秒最多重绘 60 次（60 FPS），更新再快人眼也看不到，所以我们配合屏幕刷新率更新

```js
// ❌ 原本：收到数据就立刻更新（每秒可能 100 次）
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// ✅ 改良：收集数据，配合屏幕刷新率一次更新（每秒最多 60 次）
let latestPrice = null;
let isScheduled = false;

socket.on('price', (newPrice) => {
  latestPrice = newPrice; // 暂存最新价格

  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(() => {
      btcPrice.value = latestPrice; // 在浏览器准备重绘时才更新
      isScheduled = false;
    });
  }
});
```

解法二：throttle（节流）
概念：强制限制更新频率，例如「每 100ms 最多更新 1 次」

```js
// lodash 的 throttle（如果项目有用）
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100); // 每 100ms 最多执行 1 次

socket.on('price', updatePrice);
```

### Vue3 特定优化

有一些 Vue3 的语法糖会提供优化性能，例如 v-memo，但我个人很少使用这个场景。

```js
// 1. v-memo - 记忆化不常变动的列
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // 只在这些字段变化时重新渲染
</tr>

// 2. 冻结静态数据，避免响应式开销
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef 处理大数组
const tableData = shallowRef([...])  // 只追踪数组本身，不追踪内部对象

// 4. 使用 key 优化 diff 算法（让唯一值的 id 来追踪每个 item，让 DOM 的更新可以局限在有变化的节点，节省性能）
<tr v-for="row in data" :key="row.id">  // 稳定的 key**
```

RAF：配合屏幕刷新（约 16ms），适合动画、滚动
throttle：自定义间隔（如 100ms），适合搜索、resize

### DOM 渲染优化

```scss
// 使用 CSS transform 而非 top/left
.row-update {
  transform: translateY(0); /* 触发 GPU 加速 */
  will-change: transform; /* 提示浏览器优化 */
}

// CSS containment 隔离渲染范围
.table-container {
  contain: layout style paint;
}
```

---

## 优化成效（Result）

### 性能对比

| 指标       | 优化前     | 优化后     | 改善幅度 |
| ---------- | ---------- | ---------- | -------- |
| DOM 节点数 | 10,000+    | 20-30      | ↓ 99.7%  |
| 内存使用   | 150-200 MB | 30-40 MB   | ↓ 80%    |
| 首次渲染   | 3-5 秒     | 0.3-0.5 秒 | ↑ 90%    |
| 滚动 FPS   | < 20       | 55-60      | ↑ 200%   |
| 更新响应   | 500-800 ms | 16-33 ms   | ↑ 95%    |

### 实际效果

```markdown
✅ 虚拟滚动
├─ 只渲染可见的 20-30 条
├─ 滚动时动态更新可见范围
├─ 用户无感知（体验流畅）
└─ 内存稳定（不会随数据量增长）

✅ RAF 数据更新
├─ WebSocket 每秒 100 次更新 → 最多 60 次渲染
├─ 配合屏幕刷新率（60 FPS）
└─ CPU 使用降低 60%

✅ Vue3 优化
├─ v-memo：避免不必要的重新渲染
├─ shallowRef：减少响应式开销
└─ 稳定的 :key：优化 diff 算法
```

---

## 面试重点

### 常见延伸问题

**Q: 如果不能用第三方 library 怎么办？**
A: 自行实现虚拟滚动的核心逻辑：

```javascript
// 核心概念
const itemHeight = 50; // 每行高度
const containerHeight = 600; // 容器高度
const visibleCount = Math.ceil(containerHeight / itemHeight); // 可见数量

// 计算当前应该显示哪些项目
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// 只渲染可见范围
const visibleItems = allItems.slice(startIndex, endIndex);

// 用 padding 补偿高度（让滚动条正确）
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

**关键点：**

- 计算可见范围（startIndex → endIndex）
- 动态加载数据（slice）
- 补偿高度（padding top/bottom）
- 监听滚动事件（throttle 优化）

**Q: WebSocket 断线重连如何处理？**
A: 实现指数退避重连策略：

```javascript
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000; // 1 秒

function reconnect() {
  if (retryCount >= maxRetries) {
    showError('无法连线，请刷新页面');
    return;
  }

  // 指数退避：1s → 2s → 4s → 8s → 16s
  const delay = baseDelay * Math.pow(2, retryCount);

  setTimeout(() => {
    retryCount++;
    connectWebSocket();
  }, delay);
}

// 重连成功后
socket.on('connect', () => {
  retryCount = 0; // 重置计数
  syncData(); // 同步数据
  showSuccess('连线已恢复');
});
```

**Q: 如何测试性能优化效果？**
A: 使用多种工具组合：

```javascript
// 1. Performance API 测量 FPS
let lastTime = performance.now();
let frames = 0;

function measureFPS() {
  frames++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    console.log(`FPS: ${frames}`);
    frames = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(measureFPS);
}

// 2. Memory Profiling（Chrome DevTools）
// - 渲染前拍快照
// - 渲染后拍快照
// - 比较内存差异

// 3. Lighthouse / Performance Tab
// - Long Task 时间
// - Total Blocking Time
// - Cumulative Layout Shift

// 4. 自动化测试（Playwright）
const { test } = require('@playwright/test');

test('virtual scroll performance', async ({ page }) => {
  await page.goto('/records');

  // 测量首次渲染时间
  const renderTime = await page.evaluate(() => {
    const start = performance.now();
    // 触发渲染
    const end = performance.now();
    return end - start;
  });

  expect(renderTime).toBeLessThan(500); // < 500ms
});
```

**Q: Virtual Scroll 有什么缺点？**
A: Trade-offs 需要注意：

```markdown
❌ 缺点
├─ 无法使用浏览器原生搜索（Ctrl+F）
├─ 无法使用「全选」功能（需要特殊处理）
├─ 实现复杂度较高
├─ 需要固定高度或提前计算高度
└─ 无障碍功能（Accessibility）需额外处理

✅ 适合场景
├─ 数据量 > 100 条
├─ 每条数据结构相似（高度固定）
├─ 需要高性能滚动
└─ 以查看为主（非编辑）

❌ 不适合场景
├─ 数据量 < 50 条（过度设计）
├─ 高度不固定（实现困难）
├─ 需要大量交互（如多选、拖拽）
└─ 需要打印整个表格
```

**Q: 如何优化不等高的列表？**
A: 使用动态高度虚拟滚动：

```javascript
// 方案一：预估高度 + 实际测量
const estimatedHeight = 50; // 预估高度
const measuredHeights = {}; // 记录实际高度

// 渲染后测量
onMounted(() => {
  const elements = document.querySelectorAll('.list-item');
  elements.forEach((el, index) => {
    measuredHeights[index] = el.offsetHeight;
  });
});

// 方案二：使用支持动态高度的套件
// vue-virtual-scroller 支持 dynamic-height
<DynamicScroller
  :items="items"
  :min-item-size="50"  // 最小高度
  :buffer="200"        // 缓冲区
/>
```

---

## 技术对比

### Virtual Scroll vs 分页

| 比较项目   | Virtual Scroll     | 传统分页         |
| ---------- | ------------------ | ---------------- |
| 用户体验   | 连续滚动（更好）   | 需要翻页（中断） |
| 性能       | 始终只渲染可见范围 | 每页全部渲染     |
| 实现难度   | 较复杂             | 简单             |
| SEO 友好   | 较差               | 较好             |
| 无障碍     | 需特殊处理         | 原生支持         |

**建议：**

- 后台系统、Dashboard → Virtual Scroll
- 公开网站、博客 → 传统分页
- 混合方案：Virtual Scroll + 「加载更多」按钮
