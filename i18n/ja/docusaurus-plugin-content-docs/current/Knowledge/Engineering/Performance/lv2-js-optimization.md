---
id: performance-lv2-js-optimization
title: '[Lv2] JavaScript 演算パフォーマンス最適化：デバウンス、スロットル、タイムスライス'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> デバウンス、スロットル、タイムスライス、requestAnimationFrame などの技術で JavaScript の演算パフォーマンスを最適化し、ユーザー体験を向上。

---

## 問題背景

プラットフォームプロジェクトでは、ユーザーが頻繁に以下の操作を行います：

- **検索**（キーワード入力で 3000+ 製品をリアルタイムフィルタリング）
- **リストスクロール**（スクロール時の位置追跡、追加読み込み）
- **カテゴリ切り替え**（特定タイプの製品をフィルタリング表示）
- **アニメーション効果**（スムーズスクロール、ギフトエフェクト）

これらの操作を最適化しないと、ページのカクつきや CPU 使用率の上昇を招きます。

---

## 戦略 1：デバウンス（Debounce）- 検索入力の最適化

```javascript
import { useDebounceFn } from '@vueuse/core';

// デバウンス関数：500ms 以内に再入力があればタイマーリセット
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // 入力停止後 500ms 経ってから実行
  }
);
```

```md
最適化前："slot game"（9文字）を入力

- 検索が 9 回トリガー
- 3000 ゲームのフィルタリング × 9 回 = 27,000 回の演算
- 所要時間：約 1.8 秒（ページがカクつく）

最適化後："slot game" を入力

- 検索が 1 回トリガー（入力停止後）
- 3000 ゲームのフィルタリング × 1 回 = 3,000 回の演算
- 所要時間：約 0.2 秒
- パフォーマンス向上：90%
```

## 戦略 2：スロットル（Throttle）— スクロールイベントの最適化

> 適用シーン：スクロール位置追跡、無限スクロール読み込み

```javascript
import { throttle } from 'lodash';

// スロットル関数：100ms 以内に 1 回のみ実行
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
最適化前：

- スクロールイベントが毎秒 60 回トリガー（60 FPS）
- トリガーごとにスクロール位置を計算
- 所要時間：約 600ms（ページがカクつく）

最適化後：

- スクロールイベントが毎秒最大 1 回（100ms 以内に 1 回のみ）
- 所要時間：約 100ms
- パフォーマンス向上：90%
```

## 戦略 3：タイムスライス（Time Slicing）— 大量データ処理

> 適用シーン：タグクラウド、メニュー組み合わせ、3000+ ゲームのフィルタリング、取引履歴のレンダリング

```javascript
// カスタムタイムスライス関数
function processInBatches(
  array: GameList, // 3000 ゲーム
  batchSize: number, // バッチあたり 200 件
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // 処理完了

    const batch = array.slice(index, index + batchSize); // スライス
    callback(batch); // このバッチを処理
    index += batchSize;

    setTimeout(processNextBatch, 0); // 次のバッチをタスクキューへ
  }

  processNextBatch();
}
```

使用例：

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // 3000 ゲームを 15 バッチに分割、各バッチ 200 件
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

## 戦略 4：requestAnimationFrame — アニメーションの最適化

> 適用シーン：スムーズスクロール、Canvas アニメーション、ギフトエフェクト

```javascript
const scrollToTopAnimated = (el: any, speed = 500) => {
  const startPosition = el.scrollTop;
  const duration = speed;
  let startTime = null;

  // イージング関数（Easing Function）を使用
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
      requestAnimationFrame(animateScroll); // 再帰呼び出し
    }
  };

  requestAnimationFrame(animateScroll);
};
```

なぜ requestAnimationFrame を使うのか？

```javascript
// 間違った方法：setInterval を使用
setInterval(() => {
  el.scrollTop += 10;
}, 16); // 60fps を目指す (1000ms / 60 ≈ 16ms)
// 問題：
// 1. ブラウザの再描画と同期しない（再描画間に複数回実行される可能性）
// 2. バックグラウンドタブでも実行される（リソースの無駄）
// 3. フレーム落ち（Jank）の原因になる

// 正しい方法：requestAnimationFrame を使用
requestAnimationFrame(animateScroll);
// メリット：
// 1. ブラウザの再描画と同期（60fps または 120fps）
// 2. タブが非表示時は自動的に一時停止（省電力）
// 3. よりスムーズで、フレーム落ちしない
```

---

## 面接のポイント

### デバウンス vs スロットル

| 特性       | デバウンス（Debounce）          | スロットル（Throttle）          |
| ---------- | ------------------------------- | ------------------------------- |
| トリガー   | 操作停止後に一定時間待機        | 固定時間間隔内で 1 回のみ実行   |
| 適用シーン | 検索入力、ウィンドウ resize     | スクロールイベント、マウス移動   |
| 実行回数   | 実行されない場合あり（継続トリガー時） | 実行保証（固定頻度）      |
| 遅延       | あり（停止を待つ）              | 即座に実行、以降は制限          |

### タイムスライス vs Web Worker

| 特性       | タイムスライス（Time Slicing）  | Web Worker                      |
| ---------- | ------------------------------- | ------------------------------- |
| 実行環境   | メインスレッド                  | バックグラウンドスレッド        |
| 適用シーン | DOM 操作が必要なタスク          | 純粋な計算タスク                |
| 実装の複雑さ | 比較的シンプル                | 比較的複雑（通信が必要）        |
| パフォーマンス向上 | メインスレッドのブロック回避 | 真の並列演算                  |

### よくある面接問題

**Q: デバウンスとスロットルはどう選択しますか？**

A: 使用シーンに基づきます：

- **デバウンス**：「ユーザーの操作完了を待つ」シーンに適合（検索入力など）
- **スロットル**：「継続的な更新が必要だが頻繁すぎない」シーンに適合（スクロール追跡など）

**Q: タイムスライスと Web Worker はどう選択しますか？**

A:

- **タイムスライス**：DOM 操作が必要、シンプルなデータ処理
- **Web Worker**：純粋な計算、大量データ処理、DOM 操作不要

**Q: requestAnimationFrame のメリットは何ですか？**

A:

1. ブラウザの再描画と同期（60fps）
2. タブが非表示時は自動的に一時停止（省電力）
3. フレーム落ち（Jank）を回避
4. setInterval/setTimeout よりも高パフォーマンス
