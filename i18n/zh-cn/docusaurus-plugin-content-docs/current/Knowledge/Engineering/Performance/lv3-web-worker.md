---
id: performance-lv3-web-worker
title: '[Lv3] Web Worker 应用：后台运算不阻塞 UI'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker** 是一个在浏览器后台线程中运行 JavaScript 的 API，让你能够执行耗时的运算而不会阻塞主线程（UI 线程）。

## 核心概念

### 问题背景

JavaScript 原本是**单线程**的，所有代码都在主线程执行：

```javascript
// ❌ 耗时运算阻塞主线程
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // 复杂计算
  }
  return result;
}

// 执行时整个页面冻结
const result = heavyComputation(); // UI 无法交互 😢
```

**问题：**

- 页面卡住，用户无法点击、滚动
- 动画停止
- 用户体验极差

### Web Worker 解决方案

Web Worker 提供**多线程**能力，让耗时任务在后台执行：

```javascript
// ✅ 使用 Worker 在后台执行
const worker = new Worker('worker.js');

// 主线程不阻塞，页面依然可以交互
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('后台运算完成:', e.data);
};
```

---

## 情境 1：大数据处理

```javascript
// main.js
const worker = new Worker('worker.js');

// 处理大型 JSON 数据
worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('处理结果:', e.data);
};

// worker.js
self.onmessage = function (e) {
  const { data, action } = e.data;

  if (action === 'process') {
    // 执行耗时的数据处理
    const result = data.map((item) => {
      // 复杂运算
      return heavyComputation(item);
    });

    self.postMessage(result);
  }
};
```

## 情境 2：图片处理

处理图片滤镜、压缩、像素操作等，避免冻结 UI。

## 情境 3：复杂计算

数学运算（如质数计算、加密解密）
大型文件的哈希值计算
数据分析和统计

## 使用限制与注意事项

### 不能在 Worker 中做的事

- 直接操作 DOM
- 访问 window、document、parent 对象
- 使用某些 Web API（如 alert）

### 可以在 Worker 中使用

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- 定时器（setTimeout、setInterval）
- 部分浏览器 API

```javascript
// 不适合用 Worker 的情况
// 1. 简单快速的运算（创建 Worker 本身有开销）
const result = 1 + 1; // 不需要 Worker

// 2. 需要频繁与主线程通信
// 通信本身有成本，可能抵消多线程优势

// 适合用 Worker 的情况
// 1. 单次长时间运算
const result = calculatePrimes(1000000);

// 2. 批次处理大量数据
const processed = largeArray.map(complexOperation);
```

---

## 实际项目应用案例

### 案例：游戏数据加密处理

在游戏平台中，我们需要对敏感数据进行加密/解密：

```javascript
// main.js - 主线程
const cryptoWorker = new Worker('/workers/crypto-worker.js');

// 加密玩家数据
function encryptPlayerData(data) {
  return new Promise((resolve, reject) => {
    cryptoWorker.postMessage({
      action: 'encrypt',
      data: data,
      key: SECRET_KEY,
    });

    cryptoWorker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.encrypted);
      } else {
        reject(e.data.error);
      }
    };
  });
}

// 使用
const encrypted = await encryptPlayerData(sensitiveData);
// 页面不会卡顿，用户可以继续操作

// crypto-worker.js - Worker 线程
self.onmessage = function (e) {
  const { action, data, key } = e.data;

  try {
    if (action === 'encrypt') {
      // 耗时的加密运算
      const encrypted = performHeavyEncryption(data, key);
      self.postMessage({ success: true, encrypted });
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
```

### 案例：大量游戏数据筛选

```javascript
// 在 3000+ 款游戏中进行复杂筛选
const filterWorker = new Worker('/workers/game-filter.js');

// 筛选条件
const filters = {
  provider: ['PG', 'PP', 'EVO'],
  type: ['slot', 'live'],
  minRTP: 96.5,
  tags: ['popular', 'new'],
};

filterWorker.postMessage({
  games: allGames, // 3000+ 款
  filters: filters,
});

filterWorker.onmessage = (e) => {
  displayGames(e.data.filtered); // 显示筛选结果
};

// 主线程不卡顿，用户可以继续滚动、点击
```

---

## 面试重点

### 常见面试问题

**Q1: Web Worker 和主线程如何通信？**

A: 通过 `postMessage` 和 `onmessage`：

```javascript
// 主线程 → Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker → 主线程
self.postMessage({ type: 'RESULT', result: processedData });

// 注意：数据会被「结构化克隆」（Structured Clone）
// 这意味着：
// ✅ 可以传递：Number, String, Object, Array, Date, RegExp
// ❌ 不能传递：Function, DOM 元素, Symbol
```

**Q2: Web Worker 的性能开销是什么？**

A: 主要有两个开销：

```javascript
// 1. 创建 Worker 的开销（约 30-50ms）
const worker = new Worker('worker.js'); // 需要加载文件

// 2. 通信的开销（数据复制）
worker.postMessage(largeData); // 大数据复制耗时

// 解决方案：
// 1. 重用 Worker（不要每次都创建）
// 2. 使用 Transferable Objects（转移所有权，不复制）
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // 转移所有权
```

**Q3: Transferable Objects 是什么？**

A: 转移数据所有权，而不是复制：

```javascript
// ❌ 一般做法：复制数据（慢）
const largeArray = new Uint8Array(10000000); // 10MB
worker.postMessage(largeArray); // 复制 10MB（耗时）

// ✅ Transferable：转移所有权（快）
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // 转移所有权（毫秒级）

// 注意：转移后，主线程无法再使用该数据
console.log(largeArray.length); // 0（已转移）
```

**支持的 Transferable 类型：**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**Q4: 什么时候应该使用 Web Worker？**

A: 使用决策树：

```
是否为耗时运算（> 50ms）？
├─ 否 → 不需要 Worker
└─ 是 → 继续判断
    │
    ├─ 是否需要操作 DOM？
    │   ├─ 是 → 不能用 Worker（考虑 requestIdleCallback）
    │   └─ 否 → 继续判断
    │
    └─ 通信频率是否很高（> 60次/秒）？
        ├─ 是 → 可能不适合（通信开销大）
        └─ 否 → ✅ 适合使用 Worker
```

**适合的场景：**

- 加密/解密
- 图片处理（滤镜、压缩）
- 大数据排序/筛选
- 复杂数学运算
- 文件解析（JSON、CSV）

**不适合的场景：**

- 简单计算（开销大于收益）
- 需要频繁通信
- 需要操作 DOM
- 需要使用不支持的 API

**Q5: Web Worker 有哪些类型？**

A: 三种类型：

```javascript
// 1. Dedicated Worker（专用）
const worker = new Worker('worker.js');
// 只能与创建它的页面通信

// 2. Shared Worker（共享）
const sharedWorker = new SharedWorker('shared-worker.js');
// 可以被多个页面/标签共享

// 3. Service Worker（服务）
navigator.serviceWorker.register('sw.js');
// 用于缓存、离线支持、推送通知
```

**比较：**

| 特性     | Dedicated  | Shared           | Service    |
| -------- | ---------- | ---------------- | ---------- |
| 共享性   | 单一页面   | 多页面共享       | 全站共享   |
| 生命周期 | 随页面关闭 | 最后一个页面关闭 | 独立于页面 |
| 主要用途 | 后台运算   | 跨页面通信       | 缓存、离线 |

**Q6: 如何调试 Web Worker？**

A: Chrome DevTools 支持：

```javascript
// 1. 在 Sources 面板可以看到 Worker 文件
// 2. 可以设置断点
// 3. 可以在 Console 执行代码

// 实用技巧：在 Worker 中使用 console
self.addEventListener('message', (e) => {
  console.log('Worker received:', e.data);
  // 可以在 DevTools Console 看到
});

// 错误处理
worker.onerror = (error) => {
  console.error('Worker error:', error.message);
  console.error('File:', error.filename);
  console.error('Line:', error.lineno);
};
```

---

## 性能对比

### 实测数据（处理 100 万条数据）

| 方法                 | 执行时间 | UI 是否卡顿 | 内存峰值 |
| -------------------- | -------- | ----------- | -------- |
| 主线程（同步）       | 2.5 秒   | 完全卡死    | 250 MB   |
| 主线程（时间切片）   | 3.2 秒   | 偶尔卡顿    | 280 MB   |
| Web Worker           | 2.3 秒   | 完全流畅    | 180 MB   |

**结论：**

- Web Worker 不仅不卡 UI，还因为多核心并行而更快
- 内存使用更少（主线程不需要保留大量数据）

---

## 相关技术

### Web Worker vs 其他方案

```javascript
// 1. setTimeout（伪异步）
setTimeout(() => heavyTask(), 0);
// ❌ 还是在主线程，会卡

// 2. requestIdleCallback（空闲时执行）
requestIdleCallback(() => heavyTask());
// ⚠️ 只在闲置时执行，不保证完成时间

// 3. Web Worker（真正多线程）
worker.postMessage(task);
// ✅ 真正并行，不阻塞 UI
```

### 进阶：使用 Comlink 简化 Worker 通信

[Comlink](https://github.com/GoogleChromeLabs/comlink) 让 Worker 使用起来像普通函数：

```javascript
// 传统方式（繁琐）
worker.postMessage({ action: 'add', a: 1, b: 2 });
worker.onmessage = (e) => console.log(e.data);

// 使用 Comlink（简洁）
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap(worker);

// 像调用普通函数一样
const result = await api.add(1, 2);
console.log(result); // 3
```

---

## 学习建议

**面试准备：**

1. 理解「为什么需要 Worker」（单线程问题）
2. 知道「什么时候用」（耗时运算）
3. 了解「通信机制」（postMessage）
4. 认识「限制」（无法操作 DOM）
5. 实现过至少一个 Worker 案例

**实战建议：**

- 从简单案例开始（如质数计算）
- 使用 Chrome DevTools 调试
- 测量性能差异
- 考虑 Comlink 等工具

---

## 相关主题

- [路由层级优化 →](/docs/experience/performance/lv1-route-optimization)
- [图片加载优化 →](/docs/experience/performance/lv1-image-optimization)
- [虚拟滚动实现 →](/docs/experience/performance/lv3-virtual-scroll)
- [大量数据优化策略 →](/docs/experience/performance/lv3-large-data-optimization)
