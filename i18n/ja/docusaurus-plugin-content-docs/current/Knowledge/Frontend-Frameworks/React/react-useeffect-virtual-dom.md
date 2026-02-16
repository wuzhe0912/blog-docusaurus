---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect と Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> `useEffect` とは何か？

### 核心概念

`useEffect` は React の関数コンポーネントで副作用（side effects）を管理するための Hook です。コンポーネントのレンダリング後に非同期データ取得、サブスクリプション、DOM 操作、状態の手動同期などを実行します。class コンポーネントの `componentDidMount`、`componentDidUpdate`、`componentWillUnmount` に相当します。

### よくある用途

- リモートデータの取得とコンポーネント状態の更新
- サブスクリプションやイベントリスナーの管理（`resize`、`scroll` など）
- ブラウザ API との連携（`document.title` の更新、`localStorage` の操作など）
- 前回のレンダリングで残ったリソースのクリーンアップ（リクエストのキャンセル、リスナーの解除など）

<details>
<summary>基本的な使用例を展開</summary>

```javascript
import { useEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `クリック回数：${count}`;
  });

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      クリック
    </button>
  );
}
```

</details>

## 2. When does `useEffect` run?

> `useEffect` はいつ実行されるのか？

`useEffect` の第二引数は**依存配列（dependency array）**で、副作用の実行タイミングを制御します。React は配列内の各値を比較し、変化を検知した際に副作用を再実行し、次の実行前にクリーンアップ関数を呼び出します。

### 2.1 よくある依存パターン

```javascript
// 1. 毎回のレンダリング後に実行（初回を含む）
useEffect(() => {
  console.log('任意の state 変更で発火');
});

// 2. 初回レンダリング時のみ実行
useEffect(() => {
  console.log('component mount 時にのみ実行');
}, []);

// 3. 指定した依存変数の変更時のみ
useEffect(() => {
  console.log('selectedId が変更された時のみ発火');
}, [selectedId]);
```

### 2.2 クリーンアップ関数とリソース回収

```javascript
useEffect(() => {
  const handler = () => {
    console.log('リスニング中');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
    console.log('リスナー解除');
  };
}, []);
```

上記の例ではクリーンアップ関数でイベントリスナーを解除しています。React はコンポーネントのアンマウント時や依存変数の更新前にクリーンアップ関数を実行し、メモリリークや重複リスニングを防ぎます。

## 3. What is the difference between Real DOM and Virtual DOM?

> Real DOM と Virtual DOM の違いは？

| 比較項目     | Real DOM（実 DOM）                   | Virtual DOM（仮想 DOM）          |
| ------------ | ------------------------------------ | -------------------------------- |
| 構造         | ブラウザが管理する実体ノード         | JavaScript オブジェクトで記述    |
| 更新コスト   | 直接操作はレイアウトと再描画が発生   | 差分を計算してからバッチ適用     |
| 更新戦略     | 即座に画面に反映                     | メモリ上に新ツリーを構築し差分比較 |
| 拡張性       | 更新フローを手動制御する必要がある   | 中間ロジック（Diff、バッチ処理）を挟める |

### React が Virtual DOM を採用する理由

```javascript
// 簡略化したフロー（実際の React ソースコードではありません）
function renderWithVirtualDOM(newVNode, container) {
  const prevVNode = container.__vnode;
  const patches = diff(prevVNode, newVNode);
  applyPatches(container, patches);
  container.__vnode = newVNode;
}
```

Virtual DOM により、React はメモリ上で Diff を行い、最小限の更新リストを取得してから実 DOM に一括同期できます。これにより頻繁なリフローと再描画を回避します。

## 4. How to coordinate `useEffect` and Virtual DOM?

> `useEffect` と Virtual DOM はどのように連携するのか？

React のレンダリングフローは Render Phase と Commit Phase に分かれます。`useEffect` と Virtual DOM の連携のポイントは、副作用は実 DOM の更新完了後に実行される必要があるということです。

### Render Phase（レンダリングフェーズ）

- React が新しい Virtual DOM を構築し、前回の Virtual DOM との差分を計算
- このフェーズは純粋な関数演算で、中断や再実行が可能

### Commit Phase（コミットフェーズ）

- React が差分を実 DOM に適用
- `useLayoutEffect` はこのフェーズで同期的に実行され、DOM が更新済みであることが保証される

### Effect Execution（副作用の実行タイミング）

- `useEffect` は Commit Phase 終了後、ブラウザの描画完了後に実行
- これにより副作用が画面更新をブロックすることを防ぎ、ユーザー体験を向上させる

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/profile', { signal: controller.signal })
    .then((res) => res.json())
    .then(setProfile)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('読み込み失敗', error);
      }
    });

  return () => {
    controller.abort(); // 依存変数の更新やコンポーネントのアンマウント時にリクエストをキャンセル
  };
}, [userId]);
```

## 5. Quiz Time

> クイズタイム
> 面接シミュレーション

### 問題：以下のコードの実行順序と出力結果を説明してください

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
      <p>状態：{visible ? '表示' : '非表示'}</p>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        切替
      </button>
    </>
  );
}
```

<details>
<summary>回答を表示</summary>

- 初回レンダリング後に `effect 1`、`effect 2` の順で出力されます。最初の `useEffect` には依存配列がなく、2つ目の `useEffect` は `visible` に依存していますが、初期値 `false` でも初回は実行されます。
- ボタンクリック後に `setVisible` が発火し、次のレンダリングでまず前回のクリーンアップ関数が実行されて `cleanup 1` が出力され、その後新しい `effect 1` と `effect 2` が実行されます。
- `visible` は切替のたびに変化するため、`effect 2` も毎回再実行されます。

最終的な出力順序：`effect 1` → `effect 2` → （クリック後）`cleanup 1` → `effect 1` → `effect 2`

</details>

## 6. Best Practices

> ベストプラクティス

### 推奨事項

- 依存配列を慎重に管理し、ESLint ルール `react-hooks/exhaustive-deps` を活用する。
- 責務ごとに `useEffect` を分割し、大きな副作用による結合度を下げる。
- クリーンアップ関数でリスナーの解除や非同期リクエストのキャンセルを行い、メモリリークを防ぐ。
- DOM 更新後すぐにレイアウト情報を読み取る必要がある場合は `useLayoutEffect` を使用するが、パフォーマンスへの影響を評価すること。

### 例：責務ごとに分割

```javascript
useEffect(() => {
  document.title = `現在のユーザー：${user.name}`;
}, [user.name]); // document.title の管理

useEffect(() => {
  const subscription = chatClient.subscribe(roomId);
  return () => subscription.unsubscribe();
}, [roomId]); // チャットルーム接続の管理
```

## 7. Interview Summary

> 面接まとめ

### クイックレビュー

1. `useEffect` は依存配列で実行タイミングを制御し、クリーンアップ関数がリソース回収を担当する。
2. Virtual DOM は Diff アルゴリズムで最小更新セットを特定し、実 DOM 操作コストを削減する。
3. Render Phase と Commit Phase を理解することで、副作用とレンダリングフローの関係を正確に説明できる。
4. 面接ではパフォーマンス向上戦略（バッチ更新、遅延読み込み、memoization など）も補足できると良い。

### 面接回答テンプレート

> 「React はレンダリング時にまず Virtual DOM を構築し、差分を計算してから Commit Phase で実 DOM を更新します。`useEffect` はコミット完了後、ブラウザの描画後に実行されるため、非同期リクエストやイベントリスニングの処理に適しています。正しい依存配列を維持しクリーンアップ関数を忘れなければ、メモリリークや競合状態を回避できます。」

## Reference

> 参考資料

- [React 公式ドキュメント：Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [React 公式ドキュメント：Rendering](https://react.dev/learn/rendering)
- [React 公式ドキュメント：Rendering Optimizations](https://react.dev/learn/escape-hatches#removing-effect-dependencies)
