---
id: performance-lv1-route-optimization
title: '[Lv1] 路由层级优化：三层 Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> 通过三层路由 Lazy Loading，将首次加载从 12.5MB 降至 850KB，首屏时间缩短 70%。

---

## 问题背景（Situation）

项目特性：

- **27+ 个不同的多租户版型**（多租户架构）
- **每个版型有 20-30 个页面**（首页、大厅、促销、代理、新闻等）
- **如果一次加载所有代码**：首次进入需要下载 **10MB+ 的 JS 文件**
- **用户等待时间超过 10 秒**（尤其在手机网络环境下）

## 优化目标（Task）

1. **减少首次加载的 JavaScript 体积**（目标：< 1MB）
2. **缩短首屏时间**（目标：< 3 秒）
3. **按需加载**（用户只下载需要的内容）
4. **维持开发体验**（不能影响开发效率）

## 解决方案（Action）

我们采用了**三层路由 Lazy Loading** 的策略，从「版型」→「页面」→「权限」三个层级进行优化。

### 第 1 层：动态模板加载

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // 根据环境变量动态加载对应的版型路由
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

说明：

- 项目有 27 个版型，但用户只会使用其中 1 个
- 通过 environment.json 判断当前是哪个品牌
- 只加载该品牌的路由配置，其他 26 个版型完全不加载

效果：

- 首次加载减少约 85% 的路由配置代码

### 第 2 层：页面 Lazy Loading

```typescript
// 传统写法（X - 不好）
import HomePage from './pages/HomePage.vue';
component: HomePage; // 所有页面都会被打包进 main.js

// 我们的写法（✓ - 好）
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- 每个路由使用 箭头函数 + import() 包裹
- 只有当用户真正访问该页面时，才会下载对应的 JS chunk
- Vite 会自动将每个页面打包成独立的文件

### 第 3 层：按需加载策略

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // 未登录用户不会加载「代理中心」等需要登录的页面
    return next({ name: 'HomePage' });
  }
  next();
});
```

## 优化成效（Result）

**优化前：**

```
首次加载：main.js (12.5 MB)
首屏时间：8-12 秒
包含所有 27 个版型 + 所有页面
```

**优化后：**

```markdown
首次加载：main.js (850 KB) ↓ 93%
首屏时间：1.5-2.5 秒 ↑ 70%
仅包含核心代码 + 当前首页
```

**具体数据：**

- JavaScript 体积减少：**12.5 MB → 850 KB（减少 93%）**
- 首屏时间缩短：**10 秒 → 2 秒（提升 70%）**
- 后续页面加载：**平均 300-500 KB per page**
- 用户体验评分：**从 45 分提升至 92 分（Lighthouse）**

**商业价值：**

- 跳出率下降 35%
- 页面停留时间增加 50%
- 转化率提升 25%

## 面试重点

**常见延伸问题：**

1. **Q: 为什么不用 React.lazy() 或 Vue 的异步组件？**
   A: 我们确实有用 Vue 的异步组件（`() => import()`），但关键是**三层架构**：

   - 第 1 层（版型）：编译时决定（Vite 配置）
   - 第 2 层（页面）：运行时 Lazy Loading
   - 第 3 层（权限）：导航守卫控制

   单纯的 lazy loading 只做到第 2 层，我们多做了版型层级的分离。

2. **Q: 如何决定哪些代码该放在 main.js？**
   A: 使用 Vite 的 `manualChunks` 配置：

   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor': ['vue', 'pinia', 'vue-router'],
           'ui': ['element-plus'],
         }
       }
     }
   }
   ```

   原则：只有「每个页面都会用到」的才放 vendor chunk。

3. **Q: Lazy Loading 会不会影响用户体验（等待时间）？**
   A: 有两个策略应对：

   - **预加载（Prefetch）**：在闲置时预先加载可能访问的页面
   - **Loading 状态**：使用 Skeleton Screen 代替白屏

   实际测试：后续页面平均加载时间 < 500ms，用户无感知。

4. **Q: 如何测量优化效果？**
   A: 使用多种工具：

   - **Lighthouse**：Performance Score（45 → 92）
   - **Webpack Bundle Analyzer**：可视化分析 chunk 大小
   - **Chrome DevTools**：Network waterfall、Coverage
   - **Real User Monitoring (RUM)**：真实用户数据

5. **Q: 有什么 Trade-off（权衡）？**
   A:
   - 开发时可能遇到循环依赖问题（需要调整模块结构）
   - 首次路由切换会有短暂加载时间（用 prefetch 解决）
   - 但整体利大于弊，尤其对手机用户体验提升明显
