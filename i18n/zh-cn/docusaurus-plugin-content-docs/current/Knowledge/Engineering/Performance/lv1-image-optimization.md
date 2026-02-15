---
id: performance-lv1-image-optimization
title: '[Lv1] 图片加载优化：四层 Lazy Load'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> 通过四层图片懒加载策略，将首屏图片流量从 60MB 降至 2MB，加载时间提升 85%。

---

## 问题背景 (Situation)

> 想象你在滑手机看网页，屏幕只能显示 10 张图片，但网页一次加载了 500 张图片的完整数据，你的手机会卡到爆，流量也瞬间烧掉 50MB。

**对应到项目的实际情况：**

```markdown
📊 某页面首页统计
├─ 300+ 张缩略图（每张 150-300KB）
├─ 50+ 张促销 Banner
└─ 如果全部加载：300 × 200KB = 60MB+ 的图片数据

❌ 实际问题
├─ 首屏只看得到 8-12 张图片
├─ 用户可能只滚动到第 30 张就离开了
└─ 剩下 270 张图片完全白加载（浪费流量 + 拖慢速度）

📉 影响
├─ 首次加载时间：15-20 秒
├─ 流量消耗：60MB+（用户怨声载道）
├─ 页面卡顿：滚动不流畅
└─ 跳出率：42%（极高）
```

## 优化目标 (Task)

1. **只加载可视范围内的图片**
2. **预加载即将进入视窗的图片**（提前 50px 开始加载）
3. **控制并发数量**（避免同时加载过多图片）
4. **防止快速切换导致的资源浪费**
5. **首屏图片流量 < 3MB**

## 解决方案（Action）

### v-lazy-load.ts 实现

> 四层 image lazy load

#### 第一层：视窗可见性检测（IntersectionObserver）

```js
// 创建观察器，监测图片是否进入视窗
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 图片进入可视区域
        // 开始加载图片
      }
    });
  },
  {
    rootMargin: '50px 0px', // 提前 50px 开始加载（预加载）
    threshold: 0.1, // 只要露出 10% 就触发
  }
);
```

- 使用浏览器原生 IntersectionObserver API（性能远胜过 scroll 事件）
- rootMargin: "50px" → 当图片还在下方 50px 时就开始加载，用户滑到时已经好了（感觉更顺畅）
- 不在视窗的图片完全不加载

#### 第二层：并发控制机制（Queue 管理）

```js
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent = 6  // 同时最多加载 6 张
  private queue: (() => void)[] = []

  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)  // 有空位，马上加载
    } else {
      this.queue.push(loadFn)   // 没空位，排队等候
    }
  }
}
```

- 即使 20 张图片同时进入视窗，也只会同时加载 6 张
- 避免「瀑布式加载」阻塞浏览器（Chrome 默认最多并发 6 个请求）
- 加载完成后自动处理队列中的下一张

```md
用户快速滚动到底部 → 30 张图片同时触发
没有队列管理：30 个请求同时发出 → 浏览器卡顿
有队列管理：前 6 张先加载 → 完成后加载下 6 张 → 流畅
```

#### 第三层：资源竞态问题解决（版本控制）

```js
// 设置加载时的版本号
el.setAttribute('data-version', Date.now().toString());

// 加载完成后验证版本
img.onload = () => {
  const currentVersion = img.getAttribute('data-version');
  if (loadVersion === currentVersion) {
    // 版本一致，显示图片
  } else {
    // 版本不一致，用户已经切换到其他游戏了，不显示
  }
};
```

实际案例：

```md
用户操作：

1. 点击「新闻」分类 → 触发加载 100 张图片（版本 1001）
2. 0.5 秒后点击「优惠活动」→ 触发加载 80 张图片（版本 1002）
3. 新闻的图片 1 秒后才加载完成

没有版本控制：显示新闻图片（错误！）
有版本控制：检查版本不一致，丢弃新闻图片（正确！）
```

#### 第四层：占位符策略（Base64 透明图）

```js
// 默认显示 1×1 透明 SVG，避免版面位移
el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi...';

// 真实图片 URL 存在 data-src
el.setAttribute('data-src', realImageUrl);
```

- 使用 Base64 编码的透明 SVG（只有 100 bytes）
- 避免 CLS（Cumulative Layout Shift，累积版面位移）
- 用户不会看到「图片突然跳出来」的现象

## 优化成效（Result）

**优化前：**

```markdown
首屏图片：一次加载 300 张（60MB）
加载时间：15-20 秒
滚动流畅度：卡顿严重
跳出率：42%
```

**优化后：**

```markdown
首屏图片：只加载 8-12 张（2MB） ↓ 97%
加载时间：2-3 秒 ↑ 85%
滚动流畅度：流畅（60fps）
跳出率：28% ↓ 33%
```

**具体数据：**

- 首屏图片流量：**60 MB → 2 MB（减少 97%）**
- 图片加载时间：**15 秒 → 2 秒（提升 85%）**
- 页面滚动 FPS：**从 20-30 提升至 55-60**
- 内存使用：**降低 65%**（因为未加载的图片不占内存）

**技术指标：**

- IntersectionObserver 性能：远胜于传统 scroll 事件（CPU 使用降低 80%）
- 并发控制效果：避免浏览器请求阻塞
- 版本控制命中率：99.5%（极少出现错误图片）

## 面试重点

**常见延伸问题：**

1. **Q: 为什么不直接用 `loading="lazy"` 属性？**
   A: 原生 `loading="lazy"` 有几个限制：

   - 无法控制预加载距离（浏览器决定）
   - 无法控制并发数量
   - 无法处理版本控制（快速切换问题）
   - 旧版浏览器不支持

   自定义指令提供更精细的控制，适合我们的复杂场景。

2. **Q: IntersectionObserver 相比 scroll 事件好在哪？**
   A:

   ```javascript
   // ❌ 传统 scroll 事件
   window.addEventListener('scroll', () => {
     // 每次滚动都触发（60次/秒）
     // 需要计算元素位置（getBoundingClientRect）
     // 可能导致强制 reflow（性能杀手）
   });

   // ✅ IntersectionObserver
   const observer = new IntersectionObserver(callback);
   // 只在元素进出视窗时触发
   // 浏览器原生优化，不阻塞主线程
   // 性能提升 80%
   ```

3. **Q: 并发控制的 6 张限制是怎么来的？**
   A: 这是基于浏览器的 **HTTP/1.1 同源并发限制**：

   - Chrome/Firefox：每个域名最多 6 个并发连接
   - 超过限制的请求会排队等待
   - HTTP/2 可以更多，但考虑兼容性还是控制在 6
   - 实际测试：6 张并发是性能与体验的最佳平衡点

4. **Q: 版本控制为什么用时间戳而不是 UUID？**
   A:

   - 时间戳：`Date.now()`（简单、够用、可排序）
   - UUID：`crypto.randomUUID()`（更严谨，但过度设计）
   - 我们的场景：时间戳已经足够唯一（毫秒级别）
   - 性能考量：时间戳生成更快

5. **Q: 如何处理图片加载失败？**
   A: 实现了多层 fallback：

   ```javascript
   img.onerror = () => {
     if (retryCount < 3) {
       // 1. 重试 3 次
       setTimeout(() => reload(), 1000 * retryCount);
     } else {
       // 2. 显示默认图片
       img.src = '/images/game-placeholder.png';
     }
   };
   ```

6. **Q: 会不会遇到 CLS（累积版面位移）问题？**
   A: 有三个策略避免：

   ```html
   <!-- 1. 默认占位 SVG -->
   <img src="data:image/svg+xml..." />

   <!-- 2. CSS aspect-ratio 固定比例 -->
   <img style="aspect-ratio: 16/9;" />

   <!-- 3. Skeleton Screen -->
   <div class="skeleton-box"></div>
   ```

   最终 CLS 分数：< 0.1（优秀）
