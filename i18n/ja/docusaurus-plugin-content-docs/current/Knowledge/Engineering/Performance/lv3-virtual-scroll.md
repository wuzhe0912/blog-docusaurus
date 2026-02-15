---
id: performance-lv3-virtual-scroll
title: '[Lv3] 仮想スクロールの実装：大量データレンダリングの処理'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> ページに 1000+ 件のデータをレンダリングする必要がある場合、仮想スクロールで DOM ノードを 1000+ から 20-30 に削減し、メモリ使用量を 80% 低減できます。

---

## 面接シナリオ問題

**Q: ページに複数の table があり、それぞれ 100 件以上のデータがあり、さらに DOM を頻繁に更新するイベントがある場合、どんな方法でこのページのパフォーマンスを最適化しますか？**

---

## 問題分析（Situation）

### 実際のプロジェクトシーン

プラットフォームプロジェクトで、大量データを処理する必要があるページ：

```markdown
📊 あるページの履歴ページ
├─ 入金記録テーブル：1000+ 件
├─ 出金記録テーブル：800+ 件
├─ ベット記録テーブル：5000+ 件
└─ 各レコード 8-10 フィールド（時間、金額、ステータスなど）

❌ 最適化前の問題
├─ DOM ノード数：1000 件 × 10 フィールド = 10,000+ ノード
├─ メモリ消費：約 150-200 MB
├─ 初回レンダリング時間：3-5 秒（白画面）
├─ スクロールのカクつき：FPS < 20
└─ WebSocket 更新時：テーブル全体が再レンダリング（非常にカクつく）
```

### 問題の深刻さ

```javascript
// ❌ 従来の方法
<tr v-for="record in allRecords">  // 1000+ 件すべてをレンダリング
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8-10 フィールド
</tr>

// 結果：
// - 初回レンダリング：10,000+ DOM ノード
// - ユーザーが実際に見えるのは：20-30 件
// - 無駄：99% のノードはユーザーに見えない
```

---

## 解決策（Action）

### Virtual Scrolling（仮想スクロール）

まず仮想スクロールの最適化を考えます。大きく2つの方向があり、1つは公式推奨のサードパーティパッケージ [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller) を使用し、パラメータと要件に基づいて可視範囲の row を決定する方法です。

```js
// 可視領域の row のみレンダリング。例：
// - 100 件のデータで、可視の 20 件のみレンダリング
// - DOM ノード数を大幅に削減
```

もう1つは自前で実装する方法ですが、実際の開発コストやカバーすべきシナリオを考慮すると、公式推奨のサードパーティパッケージを採用する方が良いでしょう。

### データ更新頻度の制御

> 解法1：requestAnimationFrame（RAF）
> コンセプト：ブラウザは毎秒最大 60 回再描画（60 FPS）。それ以上速く更新しても人間の目には見えないので、画面のリフレッシュレートに合わせて更新

```js
// ❌ 元の方法：データを受け取ったら即座に更新（毎秒 100 回になる可能性）
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// ✅ 改良：データを収集し、画面リフレッシュレートに合わせて一括更新（毎秒最大 60 回）
let latestPrice = null;
let isScheduled = false;

socket.on('price', (newPrice) => {
  latestPrice = newPrice; // 最新価格を一時保存

  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(() => {
      btcPrice.value = latestPrice; // ブラウザが再描画の準備ができた時に更新
      isScheduled = false;
    });
  }
});
```

解法2：throttle（スロットル）
コンセプト：更新頻度を強制的に制限。例えば「100ms に最大 1 回の更新」

```js
// lodash の throttle（プロジェクトで使用している場合）
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100); // 100ms あたり最大 1 回実行

socket.on('price', updatePrice);
```

### Vue3 固有の最適化

Vue3 のシンタックスシュガーにはパフォーマンス最適化を提供するものがあります。例えば v-memo ですが、個人的にはこのシナリオではあまり使用しません。

```js
// 1. v-memo - 変更が少ない列をメモ化
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // これらのフィールドが変化した時のみ再レンダリング
</tr>

// 2. 静的データをフリーズし、リアクティブのオーバーヘッドを回避
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef で大きな配列を処理
const tableData = shallowRef([...])  // 配列自体のみ追跡、内部オブジェクトは追跡しない

// 4. key で diff アルゴリズムを最適化（ユニークな id で各 item を追跡し、DOM の更新を変更があったノードに限定してパフォーマンスを節約）
<tr v-for="row in data" :key="row.id">  // 安定した key
```

RAF：画面リフレッシュに同期（約 16ms）、アニメーション・スクロールに適合
throttle：カスタム間隔（例：100ms）、検索・resize に適合

### DOM レンダリングの最適化

```scss
// top/left の代わりに CSS transform を使用
.row-update {
  transform: translateY(0); /* GPU アクセラレーションをトリガー */
  will-change: transform; /* ブラウザに最適化をヒント */
}

// CSS containment でレンダリング範囲を分離
.table-container {
  contain: layout style paint;
}
```

---

## 最適化成果（Result）

### パフォーマンス比較

| 指標       | 最適化前   | 最適化後   | 改善幅   |
| ---------- | ---------- | ---------- | -------- |
| DOM ノード数 | 10,000+  | 20-30      | ↓ 99.7%  |
| メモリ使用量 | 150-200 MB | 30-40 MB | ↓ 80%    |
| 初回レンダリング | 3-5 秒 | 0.3-0.5 秒 | ↑ 90%   |
| スクロール FPS | < 20   | 55-60      | ↑ 200%   |
| 更新レスポンス | 500-800 ms | 16-33 ms | ↑ 95%   |

### 実際の効果

```markdown
✅ 仮想スクロール
├─ 可視の 20-30 件のみレンダリング
├─ スクロール時に可視範囲を動的に更新
├─ ユーザーが気づかない（スムーズな体験）
└─ メモリが安定（データ量の増加に伴わない）

✅ RAF データ更新
├─ WebSocket 毎秒 100 回更新 → 最大 60 回レンダリング
├─ 画面リフレッシュレートに同期（60 FPS）
└─ CPU 使用率 60% 低減

✅ Vue3 最適化
├─ v-memo：不要な再レンダリングを回避
├─ shallowRef：リアクティブのオーバーヘッドを削減
└─ 安定した :key：diff アルゴリズムを最適化
```

---

## 面接のポイント

### よくある追加質問

**Q: サードパーティ library を使えない場合は？**
A: 仮想スクロールのコアロジックを自前で実装：

```javascript
// コアコンセプト
const itemHeight = 50; // 各行の高さ
const containerHeight = 600; // コンテナの高さ
const visibleCount = Math.ceil(containerHeight / itemHeight); // 可視数

// 現在表示すべきアイテムを計算
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// 可視範囲のみレンダリング
const visibleItems = allItems.slice(startIndex, endIndex);

// padding で高さを補完（スクロールバーを正しく表示）
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

**ポイント：**

- 可視範囲の計算（startIndex → endIndex）
- 動的データ読み込み（slice）
- 高さの補完（padding top/bottom）
- スクロールイベントの監視（throttle で最適化）

**Q: WebSocket の切断再接続はどう処理しますか？**
A: 指数バックオフ再接続戦略を実装：

```javascript
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000; // 1 秒

function reconnect() {
  if (retryCount >= maxRetries) {
    showError('接続できません。ページをリロードしてください');
    return;
  }

  // 指数バックオフ：1s → 2s → 4s → 8s → 16s
  const delay = baseDelay * Math.pow(2, retryCount);

  setTimeout(() => {
    retryCount++;
    connectWebSocket();
  }, delay);
}

// 再接続成功後
socket.on('connect', () => {
  retryCount = 0; // カウントリセット
  syncData(); // データ同期
  showSuccess('接続が復旧しました');
});
```

**Q: Virtual Scroll の欠点は？**
A: 注意すべき Trade-offs：

```markdown
❌ 欠点
├─ ブラウザのネイティブ検索（Ctrl+F）が使えない
├─ 「全選択」機能が使えない（特別な処理が必要）
├─ 実装の複雑度が高い
├─ 固定高さまたは事前の高さ計算が必要
└─ アクセシビリティ機能の追加対応が必要

✅ 適したシーン
├─ データ量 > 100 件
├─ 各データの構造が類似（高さ固定）
├─ 高パフォーマンスのスクロールが必要
└─ 閲覧メイン（編集ではない）

❌ 適さないシーン
├─ データ量 < 50 件（オーバーエンジニアリング）
├─ 高さが不定（実装が困難）
├─ 大量のインタラクションが必要（複数選択、ドラッグ&ドロップなど）
└─ テーブル全体の印刷が必要
```

---

## 技術比較

### Virtual Scroll vs ページネーション

| 比較項目     | Virtual Scroll       | 従来のページネーション |
| ------------ | -------------------- | ---------------------- |
| ユーザー体験 | 連続スクロール（良い） | ページ切り替えが必要（中断） |
| パフォーマンス | 常に可視範囲のみレンダリング | 各ページを全てレンダリング |
| 実装難度     | 比較的複雑           | シンプル               |
| SEO 対応     | 劣る                 | 優れている             |
| アクセシビリティ | 特別な処理が必要   | ネイティブサポート     |

**推奨：**

- 管理画面、Dashboard → Virtual Scroll
- 公開サイト、ブログ → 従来のページネーション
- ハイブリッド方式：Virtual Scroll + 「もっと見る」ボタン
