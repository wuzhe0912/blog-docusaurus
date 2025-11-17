---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect 與 Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> 什麼是 `useEffect`？

### 核心概念

`useEffect` 是 React 函式元件中負責管理副作用（side effects）的 Hook。它會在元件渲染之後執行非同步資料請求、訂閱、DOM 操作或手動同步狀態，對應 class 元件的 `componentDidMount`、`componentDidUpdate` 與 `componentWillUnmount` 等生命週期方法。

### 常見用途

- 取得遠端資料並更新元件狀態
- 維護訂閱或事件監聽（如 `resize`、`scroll`）
- 與瀏覽器 API 互動（如更新 `document.title`、操作 `localStorage`）
- 清除前一次渲染遺留的資源（如取消請求、移除監聽器）

<details>
<summary>點此展開基本使用範例</summary>

```javascript
import { useEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `點擊次數：${count}`;
  });

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      點我
    </button>
  );
}
```

</details>

## 2. When does `useEffect` run?

> `useEffect` 何時會執行？

`useEffect` 的第二個參數是**相依陣列（dependency array）**，用來控制副作用的執行時機。React 會逐一比較陣列中的每個值，在偵測到變化時重新執行副作用，並於下一輪執行前觸發清除函式。

### 2.1 常見依賴模式

```javascript
// 1. 每次渲染後執行（含第一次）
useEffect(() => {
  console.log('任意 state 改變都會觸發');
});

// 2. 僅在初次渲染時執行一次
useEffect(() => {
  console.log('只會在 component mount 時執行');
}, []);

// 3. 指定相依變數
useEffect(() => {
  console.log('僅在 selectedId 改變時觸發');
}, [selectedId]);
```

### 2.2 清除函式與資源回收

```javascript
useEffect(() => {
  const handler = () => {
    console.log('監聽中');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
    console.log('解除監聽');
  };
}, []);
```

上述範例運用清除函式解除事件監聽。React 會在元件卸載或依賴變數更新之前先執行清除函式，確保不留下記憶體洩漏與重複監聽。

## 3. What is the difference between Real DOM and Virtual DOM?

> 真實 DOM 與虛擬 DOM 的差異是什麼？

| 比較面向 | Real DOM（真實 DOM）             | Virtual DOM（虛擬 DOM）        |
| -------- | -------------------------------- | ------------------------------ |
| 結構     | 由瀏覽器維護的實體節點           | 由 JavaScript 物件描述的節點   |
| 更新成本 | 直接操作會觸發排版與重繪，成本高 | 先計算差異再批次套用，成本低   |
| 更新策略 | 立即反映至畫面                   | 先在記憶體建立新樹再比較差異   |
| 擴充性   | 需手動控制更新流程               | 可以插入中介邏輯（Diff、批次） |

### React 為何採用虛擬 DOM

```javascript
// 簡化流程示意（非實際 React 原始碼）
function renderWithVirtualDOM(newVNode, container) {
  const prevVNode = container.__vnode;
  const patches = diff(prevVNode, newVNode);
  applyPatches(container, patches);
  container.__vnode = newVNode;
}
```

虛擬 DOM 讓 React 可以先在記憶體中進行 Diff，取得最小化的更新清單，再一次同步至真實 DOM，避免頻繁的重排與重繪。

## 4. How to coordinate `useEffect` and Virtual DOM?

> `useEffect` 與虛擬 DOM 如何協作？

React 的渲染流程分成 Render Phase 與 Commit Phase。`useEffect` 與虛擬 DOM 的配合重點在於：副作用必須等待真實 DOM 更新完成後才能執行。

### Render Phase（渲染階段）

- React 建立新的虛擬 DOM，並計算上一版虛擬 DOM 的差異
- 此階段是純函式運算，可被中斷或重新執行

### Commit Phase（提交階段）

- React 將差異套用到真實 DOM
- `useLayoutEffect` 會在此階段同步執行，以確保 DOM 已更新

### Effect Execution（副作用執行時機）

- `useEffect` 會在 Commit Phase 結束、瀏覽器繪製完成後執行
- 這樣可以避免副作用阻塞畫面更新，提升使用者體驗

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/profile', { signal: controller.signal })
    .then((res) => res.json())
    .then(setProfile)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('載入失敗', error);
      }
    });

  return () => {
    controller.abort(); // 確保在相依變數更新或元件卸載時取消請求
  };
}, [userId]);
```

## 5. Quiz Time

> 小測驗時間
> 模擬面試情境

### 題目：請說明下列程式碼的執行順序並寫出輸出結果

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
      <p>狀態：{visible ? '顯示' : '隱藏'}</p>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        切換
      </button>
    </>
  );
}
```

<details>
<summary>點擊查看答案</summary>

- 初次渲染後依序輸出 `effect 1`、`effect 2`。第一個 `useEffect` 沒有相依陣列，第二個 `useEffect` 依賴 `visible`，初始值為 `false` 仍會執行一次。
- 切換按鈕後觸發 `setVisible`，下一輪渲染會先執行上一輪的清除函式，輸出 `cleanup 1`，再執行新的 `effect 1` 與 `effect 2`。
- 由於 `visible` 每次切換都會改變，`effect 2` 會在每次切換後重新執行。

最終輸出順序為：`effect 1` → `effect 2` → （點擊後）`cleanup 1` → `effect 1` → `effect 2`。

</details>

## 6. Best Practices

> 最佳實務

### 推薦做法

- 審慎維護依賴陣列，搭配 ESLint 規則 `react-hooks/exhaustive-deps`。
- 依據職責拆分多個 `useEffect`，減少大型副作用造成的耦合。
- 在清除函式中釋放監聽器或取消非同步請求，避免記憶體洩漏。
- 需要在 DOM 更新後立即讀取布局資訊時改用 `useLayoutEffect`，但要評估效能影響。

### 範例：拆分不同職責

```javascript
useEffect(() => {
  document.title = `目前使用者：${user.name}`;
}, [user.name]); // 管理 document.title

useEffect(() => {
  const subscription = chatClient.subscribe(roomId);
  return () => subscription.unsubscribe();
}, [roomId]); // 管理聊天室連線
```

## 7. Interview Summary

> 面試總結

### 快速複習

1. `useEffect` 透過依賴陣列控制執行時機，清除函式負責資源回收。
2. 虛擬 DOM 透過 Diff 演算法找出最小更新集，減少真實 DOM 操作成本。
3. 理解 Render Phase 與 Commit Phase，可以精準回答副作用與渲染流程的關聯。
4. 面試延伸可補充效能提升策略，例如批次更新、懶載入與 memoization。

### 面試回答模板

> "React 在渲染時會先建立虛擬 DOM，計算差異後才進入 Commit Phase 更新真實 DOM。`useEffect` 會在提交完成、瀏覽器繪製後執行，因此適合處理非同步請求或事件監聽。只要維護正確的依賴陣列並記得清除函式，就能避免記憶體洩漏與競態問題。"

## Reference

> 參考資料

- [React 官方文件：Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [React 官方文件：Rendering](https://react.dev/learn/rendering)
- [React 官方文件：Rendering Optimizations](https://react.dev/learn/escape-hatches#removing-effect-dependencies)
