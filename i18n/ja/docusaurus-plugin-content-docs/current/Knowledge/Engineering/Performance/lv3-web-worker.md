---
id: performance-lv3-web-worker
title: '[Lv3] Web Worker の活用：バックグラウンド計算で UI をブロックしない'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker** はブラウザのバックグラウンドスレッドで JavaScript を実行する API で、時間のかかる計算をメインスレッド（UI スレッド）をブロックせずに実行できます。

## コアコンセプト

### 問題背景

JavaScript は本来**シングルスレッド**で、すべてのコードがメインスレッドで実行されます：

```javascript
// ❌ 時間のかかる計算がメインスレッドをブロック
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // 複雑な計算
  }
  return result;
}

// 実行中はページ全体がフリーズ
const result = heavyComputation(); // UI 操作不可 😢
```

**問題：**

- ページがフリーズし、ユーザーはクリックもスクロールもできない
- アニメーションが停止
- ユーザー体験が極めて悪い

### Web Worker による解決

Web Worker は**マルチスレッド**機能を提供し、時間のかかるタスクをバックグラウンドで実行：

```javascript
// ✅ Worker を使ってバックグラウンドで実行
const worker = new Worker('worker.js');

// メインスレッドはブロックされず、ページは引き続き操作可能
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('バックグラウンド計算完了:', e.data);
};
```

---

## シナリオ 1：大規模データ処理

```javascript
// main.js
const worker = new Worker('worker.js');

// 大規模 JSON データの処理
worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('処理結果:', e.data);
};

// worker.js
self.onmessage = function (e) {
  const { data, action } = e.data;

  if (action === 'process') {
    // 時間のかかるデータ処理を実行
    const result = data.map((item) => {
      // 複雑な計算
      return heavyComputation(item);
    });

    self.postMessage(result);
  }
};
```

## シナリオ 2：画像処理

画像フィルター、圧縮、ピクセル操作など。UI のフリーズを回避。

## シナリオ 3：複雑な計算

数学演算（素数計算、暗号化/復号化など）
大規模ファイルのハッシュ値計算
データ分析と統計

## 使用制限と注意事項

### Worker 内でできないこと

- DOM の直接操作
- window、document、parent オブジェクトへのアクセス
- 一部の Web API の使用（alert など）

### Worker 内で使えるもの

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- タイマー（setTimeout、setInterval）
- 一部のブラウザ API

```javascript
// Worker が不適切なケース
// 1. シンプルで高速な計算（Worker 作成のオーバーヘッドの方が大きい）
const result = 1 + 1; // Worker は不要

// 2. メインスレッドとの頻繁な通信が必要
// 通信自体にコストがあり、マルチスレッドの利点を打ち消す可能性

// Worker が適切なケース
// 1. 1回の長時間計算
const result = calculatePrimes(1000000);

// 2. 大量データのバッチ処理
const processed = largeArray.map(complexOperation);
```

---

## 実際のプロジェクト適用例

### ケース：ゲームデータの暗号化処理

ゲームプラットフォームで、機密データの暗号化/復号化が必要：

```javascript
// main.js - メインスレッド
const cryptoWorker = new Worker('/workers/crypto-worker.js');

// プレイヤーデータの暗号化
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
// ページはカクつかず、ユーザーは操作を続行可能

// crypto-worker.js - Worker スレッド
self.onmessage = function (e) {
  const { action, data, key } = e.data;

  try {
    if (action === 'encrypt') {
      // 時間のかかる暗号化演算
      const encrypted = performHeavyEncryption(data, key);
      self.postMessage({ success: true, encrypted });
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
```

### ケース：大量ゲームデータのフィルタリング

```javascript
// 3000+ 本のゲームで複雑なフィルタリング
const filterWorker = new Worker('/workers/game-filter.js');

// フィルタ条件
const filters = {
  provider: ['PG', 'PP', 'EVO'],
  type: ['slot', 'live'],
  minRTP: 96.5,
  tags: ['popular', 'new'],
};

filterWorker.postMessage({
  games: allGames, // 3000+ 本
  filters: filters,
});

filterWorker.onmessage = (e) => {
  displayGames(e.data.filtered); // フィルタ結果を表示
};

// メインスレッドはカクつかず、ユーザーはスクロール・クリックを続行可能
```

---

## 面接のポイント

### よくある面接問題

**Q1: Web Worker とメインスレッドはどう通信しますか？**

A: `postMessage` と `onmessage` を通じて：

```javascript
// メインスレッド → Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker → メインスレッド
self.postMessage({ type: 'RESULT', result: processedData });

// 注意：データは「構造化クローン」（Structured Clone）されます
// つまり：
// ✅ 転送可能：Number, String, Object, Array, Date, RegExp
// ❌ 転送不可：Function, DOM 要素, Symbol
```

**Q2: Web Worker のパフォーマンスオーバーヘッドは？**

A: 主に2つのオーバーヘッド：

```javascript
// 1. Worker 作成のオーバーヘッド（約 30-50ms）
const worker = new Worker('worker.js'); // ファイルの読み込みが必要

// 2. 通信のオーバーヘッド（データのコピー）
worker.postMessage(largeData); // 大きなデータのコピーに時間がかかる

// 解決策：
// 1. Worker を再利用（毎回作成しない）
// 2. Transferable Objects を使用（所有権を移転、コピーしない）
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // 所有権を移転
```

**Q3: Transferable Objects とは？**

A: データのコピーではなく、所有権を移転：

```javascript
// ❌ 通常の方法：データをコピー（遅い）
const largeArray = new Uint8Array(10000000); // 10MB
worker.postMessage(largeArray); // 10MB をコピー（時間がかかる）

// ✅ Transferable：所有権を移転（速い）
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // 所有権を移転（ミリ秒レベル）

// 注意：移転後、メインスレッドではそのデータを使用できなくなる
console.log(largeArray.length); // 0（移転済み）
```

**対応する Transferable 型：**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**Q4: いつ Web Worker を使うべきですか？**

A: 判断ツリー：

```
時間のかかる計算か（> 50ms）？
├─ いいえ → Worker は不要
└─ はい → 判断を続行
    │
    ├─ DOM 操作が必要か？
    │   ├─ はい → Worker は使えない（requestIdleCallback を検討）
    │   └─ いいえ → 判断を続行
    │
    └─ 通信頻度は高いか（> 60回/秒）？
        ├─ はい → 適さない可能性（通信オーバーヘッドが大きい）
        └─ いいえ → ✅ Worker の使用に適合
```

**適したシーン：**

- 暗号化/復号化
- 画像処理（フィルター、圧縮）
- 大量データのソート/フィルタリング
- 複雑な数学演算
- ファイル解析（JSON、CSV）

**適さないシーン：**

- シンプルな計算（オーバーヘッドが利益を上回る）
- 頻繁な通信が必要
- DOM 操作が必要
- サポートされていない API の使用が必要

**Q5: Web Worker にはどんな種類がありますか？**

A: 3つの種類：

```javascript
// 1. Dedicated Worker（専用）
const worker = new Worker('worker.js');
// 作成したページとのみ通信可能

// 2. Shared Worker（共有）
const sharedWorker = new SharedWorker('shared-worker.js');
// 複数のページ/タブで共有可能

// 3. Service Worker（サービス）
navigator.serviceWorker.register('sw.js');
// キャッシュ、オフラインサポート、プッシュ通知用
```

**比較：**

| 特性       | Dedicated    | Shared             | Service      |
| ---------- | ------------ | ------------------ | ------------ |
| 共有性     | 単一ページ   | 複数ページで共有   | サイト全体   |
| ライフサイクル | ページ終了と共に | 最後のページ終了時 | ページから独立 |
| 主な用途   | バックグラウンド計算 | クロスページ通信 | キャッシュ、オフライン |

---

## パフォーマンス比較

### 実測データ（100 万件のデータ処理）

| 方法                     | 実行時間 | UI カクつき | メモリピーク |
| ------------------------ | -------- | ----------- | ------------ |
| メインスレッド（同期）   | 2.5 秒   | 完全にフリーズ | 250 MB     |
| メインスレッド（タイムスライス） | 3.2 秒 | 時々カクつく | 280 MB     |
| Web Worker               | 2.3 秒   | 完全にスムーズ | 180 MB     |

**結論：**

- Web Worker は UI をブロックしないだけでなく、マルチコア並列処理によりさらに高速
- メモリ使用量も少ない（メインスレッドが大量データを保持する必要がない）

---

## 関連技術

### Web Worker vs 他の方式

```javascript
// 1. setTimeout（疑似非同期）
setTimeout(() => heavyTask(), 0);
// ❌ メインスレッドで実行されるのでカクつく

// 2. requestIdleCallback（アイドル時に実行）
requestIdleCallback(() => heavyTask());
// ⚠️ アイドル時のみ実行、完了時間は保証されない

// 3. Web Worker（真のマルチスレッド）
worker.postMessage(task);
// ✅ 真の並列処理、UI をブロックしない
```

### 発展：Comlink で Worker 通信を簡素化

[Comlink](https://github.com/GoogleChromeLabs/comlink) を使えば、Worker を通常の関数のように使えます：

```javascript
// 従来の方法（煩雑）
worker.postMessage({ action: 'add', a: 1, b: 2 });
worker.onmessage = (e) => console.log(e.data);

// Comlink を使用（簡潔）
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap(worker);

// 通常の関数のように呼び出し
const result = await api.add(1, 2);
console.log(result); // 3
```

---

## 学習アドバイス

**面接準備：**

1. 「なぜ Worker が必要か」を理解する（シングルスレッドの問題）
2. 「いつ使うか」を知る（時間のかかる計算）
3. 「通信メカニズム」を理解する（postMessage）
4. 「制限」を認識する（DOM 操作不可）
5. 少なくとも1つの Worker のケースを実装した経験

**実践アドバイス：**

- シンプルなケースから始める（素数計算など）
- Chrome DevTools でデバッグ
- パフォーマンスの差を測定
- Comlink などのツールを検討

---

## 関連トピック

- [ルーティング階層の最適化 →](/docs/experience/performance/lv1-route-optimization)
- [画像読み込みの最適化 →](/docs/experience/performance/lv1-image-optimization)
- [仮想スクロールの実装 →](/docs/experience/performance/lv3-virtual-scroll)
- [大量データの最適化戦略 →](/docs/experience/performance/lv3-large-data-optimization)
