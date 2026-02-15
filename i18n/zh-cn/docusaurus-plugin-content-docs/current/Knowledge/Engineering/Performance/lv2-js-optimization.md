---
id: performance-lv2-js-optimization
title: '[Lv2] JavaScript 运算性能优化：防抖、节流、时间切片'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> 通过防抖、节流、时间切片和 requestAnimationFrame 等技术，优化 JavaScript 运算性能，提升用户体验。

---

## 问题背景

在平台项目中，用户会频繁进行以下操作：

- **搜索**（输入关键字即时过滤 3000+ 款产品）
- **滚动列表**（滚动时追踪位置、加载更多）
- **切换分类**（筛选显示特定类型的产品）
- **动画效果**（平滑滚动、礼物特效）

这些操作如果没有优化，会导致页面卡顿、CPU 占用过高。

---

## 策略 1：防抖（Debounce） - 搜索输入优化

```javascript
import { useDebounceFn } from '@vueuse/core';

// 防抖函数：500ms 内如果再次输入，重新计时
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // 只在停止输入 500ms 后执行
  }
);
```

```md
优化前：输入 "slot game" (9 字符)

- 触发 9 次搜索
- 过滤 3000 款游戏 × 9 次 = 27,000 次运算
- 耗时：约 1.8 秒（页面卡顿）

优化后：输入 "slot game"

- 触发 1 次搜索（停止输入后）
- 过滤 3000 款游戏 × 1 次 = 3,000 次运算
- 耗时：约 0.2 秒
- 性能提升：90%
```

## 策略 2：节流（Throttle）— 滚动事件优化

> 应用场景： 滚动位置追踪、无限滚动加载

```javascript
import { throttle } from 'lodash';

// 节流函数：100ms 内只执行 1 次
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
优化前：

- 滚动事件每秒触发 60 次（60 FPS）
- 每次触发都计算滚动位置
- 耗时：约 600ms（页面卡顿）

优化后：

- 滚动事件每秒最多触发 1 次（100ms 内只执行 1 次）
- 耗时：约 100ms
- 性能提升：90%
```

## 策略 3：时间切片（Time Slicing）— 大量数据处理

> 应用场景：标签云、菜单组合、3000+ 款游戏筛选、金流历史记录渲染

```javascript
// 自定义时间切片函数
function processInBatches(
  array: GameList, // 3000 款游戏
  batchSize: number, // 每批处理 200 款
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // 处理完成

    const batch = array.slice(index, index + batchSize); // 切片
    callback(batch); // 处理这一批
    index += batchSize;

    setTimeout(processNextBatch, 0); // 下一批放到微任务队列
  }

  processNextBatch();
}
```

使用示例：

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // 将 3000 款游戏分成 15 批，每批 200 款
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

## 策略 4：requestAnimationFrame — 动画优化

> 应用场景： 平滑滚动、Canvas 动画、礼物特效

```javascript
const scrollToTopAnimated = (el: any, speed = 500) => {
  const startPosition = el.scrollTop;
  const duration = speed;
  let startTime = null;

  // 使用缓动函数（Easing Function）
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(
      timeElapsed,
      startPosition,
      -startPosition,
      duration
    );
    el.scrollTop = run;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll); // 递归调用
    }
  };

  requestAnimationFrame(animateScroll);
};
```

为什么用 requestAnimationFrame？

```javascript
// 错误做法：使用 setInterval
setInterval(() => {
  el.scrollTop += 10;
}, 16); // 想要 60fps (1000ms / 60 ≈ 16ms)
// 问题：
// 1. 不会跟浏览器重绘同步（可能在重绘之间执行多次）
// 2. 在后台标签页也会执行（浪费资源）
// 3. 可能导致掉帧（Jank）

// 正确做法：使用 requestAnimationFrame
requestAnimationFrame(animateScroll);
// 优势：
// 1. 与浏览器重绘同步（60fps 或 120fps）
// 2. 标签页不可见时自动暂停（省电）
// 3. 更流畅，不会掉帧
```

---

## 面试重点

### 防抖 vs 节流

| 特性     | 防抖（Debounce）              | 节流（Throttle）              |
| -------- | ----------------------------- | ----------------------------- |
| 触发时机 | 停止操作后等待一段时间        | 固定时间间隔内只执行一次      |
| 适用场景 | 搜索输入、窗口 resize         | 滚动事件、鼠标移动            |
| 执行次数 | 可能不执行（如果持续触发）    | 保证执行（固定频率）          |
| 延迟     | 有延迟（等待停止）            | 立即执行，后续限制            |

### 时间切片 vs Web Worker

| 特性         | 时间切片（Time Slicing）      | Web Worker                    |
| ------------ | ----------------------------- | ----------------------------- |
| 执行环境     | 主线程                        | 后台线程                      |
| 适用场景     | 需要操作 DOM 的任务          | 纯计算任务                    |
| 实现复杂度   | 较简单                        | 较复杂（需要通信）            |
| 性能提升     | 避免阻塞主线程                | 真正并行运算                  |

### 常见面试问题

**Q: 防抖和节流如何选择？**

A: 根据使用场景：

- **防抖**：适合「等待用户完成操作」的场景（如搜索输入）
- **节流**：适合「需要持续更新但不需要太频繁」的场景（如滚动追踪）

**Q: 时间切片和 Web Worker 如何选择？**

A:

- **时间切片**：需要操作 DOM、简单的数据处理
- **Web Worker**：纯计算、大量数据处理、不需要 DOM 操作

**Q: requestAnimationFrame 的优势是什么？**

A:

1. 与浏览器重绘同步（60fps）
2. 标签页不可见时自动暂停（省电）
3. 避免掉帧（Jank）
4. 性能优于 setInterval/setTimeout
