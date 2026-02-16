---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect 与 Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> 什么是 `useEffect`？

### 核心概念

`useEffect` 是 React 函数组件中负责管理副作用（side effects）的 Hook。它会在组件渲染之后执行异步数据请求、订阅、DOM 操作或手动同步状态，对应 class 组件的 `componentDidMount`、`componentDidUpdate` 与 `componentWillUnmount` 等生命周期方法。

### 常见用途

- 获取远程数据并更新组件状态
- 维护订阅或事件监听（如 `resize`、`scroll`）
- 与浏览器 API 交互（如更新 `document.title`、操作 `localStorage`）
- 清除前一次渲染遗留的资源（如取消请求、移除监听器）

<details>
<summary>点此展开基本使用示例</summary>

```javascript
import { useEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `点击次数：${count}`;
  });

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      点我
    </button>
  );
}
```

</details>

## 2. When does `useEffect` run?

> `useEffect` 何时会执行？

`useEffect` 的第二个参数是**依赖数组（dependency array）**，用来控制副作用的执行时机。React 会逐一比较数组中的每个值，在检测到变化时重新执行副作用，并于下一轮执行前触发清除函数。

### 2.1 常见依赖模式

```javascript
// 1. 每次渲染后执行（含第一次）
useEffect(() => {
  console.log('任意 state 改变都会触发');
});

// 2. 仅在初次渲染时执行一次
useEffect(() => {
  console.log('只会在 component mount 时执行');
}, []);

// 3. 指定依赖变量
useEffect(() => {
  console.log('仅在 selectedId 改变时触发');
}, [selectedId]);
```

### 2.2 清除函数与资源回收

```javascript
useEffect(() => {
  const handler = () => {
    console.log('监听中');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
    console.log('解除监听');
  };
}, []);
```

上述示例运用清除函数解除事件监听。React 会在组件卸载或依赖变量更新之前先执行清除函数，确保不留下内存泄漏与重复监听。

## 3. What is the difference between Real DOM and Virtual DOM?

> 真实 DOM 与虚拟 DOM 的差异是什么？

| 比较维度 | Real DOM（真实 DOM）             | Virtual DOM（虚拟 DOM）        |
| -------- | -------------------------------- | ------------------------------ |
| 结构     | 由浏览器维护的实体节点           | 由 JavaScript 对象描述的节点   |
| 更新成本 | 直接操作会触发排版与重绘，成本高 | 先计算差异再批次应用，成本低   |
| 更新策略 | 立即反映至画面                   | 先在内存建立新树再比较差异     |
| 扩展性   | 需手动控制更新流程               | 可以插入中间逻辑（Diff、批次） |

### React 为何采用虚拟 DOM

```javascript
// 简化流程示意（非实际 React 源码）
function renderWithVirtualDOM(newVNode, container) {
  const prevVNode = container.__vnode;
  const patches = diff(prevVNode, newVNode);
  applyPatches(container, patches);
  container.__vnode = newVNode;
}
```

虚拟 DOM 让 React 可以先在内存中进行 Diff，取得最小化的更新清单，再一次同步至真实 DOM，避免频繁的重排与重绘。

## 4. How to coordinate `useEffect` and Virtual DOM?

> `useEffect` 与虚拟 DOM 如何协作？

React 的渲染流程分成 Render Phase 与 Commit Phase。`useEffect` 与虚拟 DOM 的配合重点在于：副作用必须等待真实 DOM 更新完成后才能执行。

### Render Phase（渲染阶段）

- React 建立新的虚拟 DOM，并计算上一版虚拟 DOM 的差异
- 此阶段是纯函数运算，可被中断或重新执行

### Commit Phase（提交阶段）

- React 将差异应用到真实 DOM
- `useLayoutEffect` 会在此阶段同步执行，以确保 DOM 已更新

### Effect Execution（副作用执行时机）

- `useEffect` 会在 Commit Phase 结束、浏览器绘制完成后执行
- 这样可以避免副作用阻塞画面更新，提升用户体验

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/profile', { signal: controller.signal })
    .then((res) => res.json())
    .then(setProfile)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('加载失败', error);
      }
    });

  return () => {
    controller.abort(); // 确保在依赖变量更新或组件卸载时取消请求
  };
}, [userId]);
```

## 5. Quiz Time

> 小测验时间
> 模拟面试情境

### 题目：请说明下列代码的执行顺序并写出输出结果

```javascript
import { useEffect, useState } from 'react';

function Demo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('effect 1');
    return () => {
      console.log('cleanup 1');
    };
  });

  useEffect(() => {
    console.log('effect 2');
  }, [visible]);

  return (
    <>
      <p>状态：{visible ? '显示' : '隐藏'}</p>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        切换
      </button>
    </>
  );
}
```

<details>
<summary>点击查看答案</summary>

- 初次渲染后依序输出 `effect 1`、`effect 2`。第一个 `useEffect` 没有依赖数组，第二个 `useEffect` 依赖 `visible`，初始值为 `false` 仍会执行一次。
- 切换按钮后触发 `setVisible`，下一轮渲染会先执行上一轮的清除函数，输出 `cleanup 1`，再执行新的 `effect 1` 与 `effect 2`。
- 由于 `visible` 每次切换都会改变，`effect 2` 会在每次切换后重新执行。

最终输出顺序为：`effect 1` → `effect 2` → （点击后）`cleanup 1` → `effect 1` → `effect 2`。

</details>

## 6. Best Practices

> 最佳实践

### 推荐做法

- 审慎维护依赖数组，搭配 ESLint 规则 `react-hooks/exhaustive-deps`。
- 依据职责拆分多个 `useEffect`，减少大型副作用造成的耦合。
- 在清除函数中释放监听器或取消异步请求，避免内存泄漏。
- 需要在 DOM 更新后立即读取布局信息时改用 `useLayoutEffect`，但要评估性能影响。

### 示例：拆分不同职责

```javascript
useEffect(() => {
  document.title = `当前用户：${user.name}`;
}, [user.name]); // 管理 document.title

useEffect(() => {
  const subscription = chatClient.subscribe(roomId);
  return () => subscription.unsubscribe();
}, [roomId]); // 管理聊天室连接
```

## 7. Interview Summary

> 面试总结

### 快速复习

1. `useEffect` 通过依赖数组控制执行时机，清除函数负责资源回收。
2. 虚拟 DOM 通过 Diff 算法找出最小更新集，减少真实 DOM 操作成本。
3. 理解 Render Phase 与 Commit Phase，可以精准回答副作用与渲染流程的关联。
4. 面试延伸可补充性能提升策略，例如批次更新、懒加载与 memoization。

### 面试回答模板

> "React 在渲染时会先建立虚拟 DOM，计算差异后才进入 Commit Phase 更新真实 DOM。`useEffect` 会在提交完成、浏览器绘制后执行，因此适合处理异步请求或事件监听。只要维护正确的依赖数组并记得清除函数，就能避免内存泄漏与竞态问题。"

## Reference

> 参考资料

- [React 官方文档：Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [React 官方文档：Rendering](https://react.dev/learn/rendering)
- [React 官方文档：Rendering Optimizations](https://react.dev/learn/escape-hatches#removing-effect-dependencies)
