---
title: '[Lv2] Nuxt 3 Lifecycle と Hydration の原理'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Nuxt 3 のライフサイクル（Lifecycle）、状態管理（State Management）、Hydration メカニズムを深く理解し、よくある Hydration Mismatch の問題を回避する。

---

## 1. 面接回答の要点

1. **Lifecycle の違い**：Server-side と Client-side で実行される Hooks を区別する。`setup` は両方で実行され、`onMounted` は Client 側でのみ実行される。
2. **状態管理**：SSR シナリオにおける `useState` と `ref` の違いを理解する。`useState` は Server と Client 間で状態を同期し、Hydration Mismatch を回避できる。
3. **Hydration メカニズム**：Hydration が静的 HTML をインタラクティブなアプリケーションに変換する方法と、よくある Mismatch の原因（HTML 構造の不一致、ランダムコンテンツなど）を説明する。

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Lifecycle Hooks の実行環境

Nuxt 3 (Vue 3 SSR) では、異なる Hooks が異なる環境で実行されます：

| Lifecycle Hook | Server-side | Client-side | 説明 |
|----------------|-------------|-------------|------|
| **setup()** | ✅ 実行 | ✅ 実行 | コンポーネントの初期化ロジック。**注意：setup 内で Client 側のみの API（window, document など）を使用しないこと**。 |
| **onBeforeMount** | ❌ 実行しない | ✅ 実行 | マウント前。 |
| **onMounted** | ❌ 実行しない | ✅ 実行 | マウント完了。**DOM 操作、Browser API の呼び出しはここで行う**。 |
| **onBeforeUpdate** | ❌ 実行しない | ✅ 実行 | データ更新前。 |
| **onUpdated** | ❌ 実行しない | ✅ 実行 | データ更新後。 |
| **onBeforeUnmount** | ❌ 実行しない | ✅ 実行 | アンマウント前。 |
| **onUnmounted** | ❌ 実行しない | ✅ 実行 | アンマウント後。 |

### 2.2 よくある面接問題：onMounted は Server 側で実行されますか？

**回答：**
いいえ。`onMounted` は Client 側（ブラウザ）でのみ実行されます。Server 側のレンダリングは HTML 文字列の生成のみを担当し、DOM のマウント（Mounting）は行いません。

**追加質問：Server 側で特定のロジックを実行する必要がある場合は？**
- `setup()` または `useAsyncData` / `useFetch` を使用する。
- 環境を区別する必要がある場合は、`process.server` または `process.client` で判定する。

```typescript
<script setup>
// Server と Client の両方で実行
console.log('Setup executed');

if (process.server) {
  console.log('Only on Server');
}

onMounted(() => {
  // Client でのみ実行
  console.log('Mounted (Client Only)');
  // 安全に window を使用
  window.alert('Hello');
});
</script>
```

---

## 3. Nuxt 3 useState vs Vue ref

### 3.1 なぜ Nuxt には useState が必要なのか？

SSR アプリケーションでは、Server 側で HTML をレンダリングした後、状態（State）をシリアライズして Client 側に送信し、Client 側で Hydration（状態の引き継ぎ）を行います。

- **Vue `ref`**：コンポーネント内のローカル状態です。SSR プロセスにおいて、Server 側で作成された `ref` の値は Client 側に**自動的には転送されません**。Client 側の初期化時に `ref` が再作成され（通常は初期値にリセット）、Server でレンダリングされた内容と Client の初期状態が不一致になり、Hydration Mismatch が発生します。
- **Nuxt `useState`**：SSR フレンドリーな状態管理です。状態を `NuxtPayload` に保存し、HTML と一緒に Client に送信します。Client 側の初期化時にこの Payload を読み取り、状態を復元し、Server と Client の状態の一貫性を確保します。

### 3.2 比較表

| 特性 | Vue `ref` / `reactive` | Nuxt `useState` |
|------|------------------------|-----------------|
| **スコープ** | コンポーネント内 / モジュール内 | グローバル（App 全体で key を通じて共有可能） |
| **SSR 状態同期** | ❌ 同期しない | ✅ 自動的にシリアライズして Client に同期 |
| **適用シーン** | Client 側のみのインタラクション状態、SSR 同期が不要なデータ | クロスコンポーネント状態、Server から Client に持っていく必要があるデータ（User Info など） |

### 3.3 実装例

**悪い例（ref でクロスプラットフォーム状態を管理）：**

```typescript
// Server 側でランダム数を生成 -> HTML に 5 を表示
const count = ref(Math.random());

// Client 側で再実行 -> 新しいランダム数 3 を生成
// 結果：Hydration Mismatch (Server: 5, Client: 3)
```

**良い例（useState を使用）：**

```typescript
// Server 側でランダム数を生成 -> Payload に保存 (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client 側で Payload を読み取り -> Server が生成した値を取得
// 結果：状態が一致
```

---

## 4. Hydration と Hydration Mismatch

### 4.1 Hydration とは？

Hydration（ハイドレーション）は、Client 側の JavaScript が Server 側でレンダリングされた静的 HTML を引き継ぐプロセスです。

1. **Server Rendering**：Server が Vue アプリケーションを実行し、HTML 文字列（コンテンツと CSS を含む）を生成。
2. **HTML ダウンロード**：ブラウザが静的 HTML をダウンロードして表示（First Paint）。
3. **JS ダウンロードと実行**：ブラウザが Vue/Nuxt の JS bundle をダウンロード。
4. **Hydration**：Vue が Client 側で仮想 DOM (Virtual DOM) を再構築し、既存の実際の DOM と比較。構造が一致すれば、Vue はこれらの DOM 要素を「アクティブ化」し（イベントリスナーをバインド）、ページをインタラクティブにする。

### 4.2 Hydration Mismatch とは？

Client 側で生成された Virtual DOM の構造と Server 側でレンダリングされた HTML の構造が**一致しない**場合、Vue は Hydration Mismatch の警告を出します。これは通常、Client 側が Server の HTML を破棄して再レンダリングする必要があることを意味し、パフォーマンスの低下と画面のちらつきを引き起こします。

### 4.3 よくある Mismatch の原因と解決法

#### 1. 不正な HTML 構造
ブラウザが不正な HTML 構造を自動修正し、Vue の期待と一致しなくなる。
- **例**：`<p>` タグ内に `<div>` を含める。
- **解決法**：HTML 構文を確認し、ネスト構造が正しいことを確認する。

#### 2. ランダムコンテンツやタイムスタンプ
Server と Client の実行時に異なるコンテンツが生成される。
- **例**：`new Date()`、`Math.random()`。
- **解決法**：
    - `useState` で値を固定する。
    - またはこのようなロジックを `onMounted` に移動する（Client でのみレンダリング、Server では空白または Placeholder を表示）。

```typescript
// 誤り
const time = new Date().toISOString();

// 正しい (onMounted を使用)
const time = ref('');
onMounted(() => {
  time.value = new Date().toISOString();
});

// または <ClientOnly> を使用
<ClientOnly>
  <div>{{ new Date() }}</div>
</ClientOnly>
```

#### 3. window/document に依存する条件付きレンダリング
- **例**：`v-if="window.innerWidth > 768"`
- **原因**：Server 側には window がなく false と判定、Client 側では true と判定。
- **解決法**：`onMounted` で状態を更新するか、`useWindowSize` などの Client-only hooks を使用する。

---

## 5. 面接のまとめ

**このように回答できます：**

> Server-side と Client-side の主な違いは Lifecycle Hooks の実行にあります。Server 側は主に `setup` を実行し、`onMounted` などの DOM 関連の Hooks は Client 側でのみ実行されます。これが Hydration の概念につながります。つまり、Client 側が Server の HTML を引き継ぐプロセスです。
>
> Hydration Mismatch を避けるために、Server と Client の初期レンダリングの内容が一致することを確認する必要があります。これが Nuxt が `useState` を提供する理由です。Vue の `ref` とは異なり、`useState` は状態をシリアライズして Client に送信し、両端の状態を同期します。`ref` で Server 側で生成されたデータを保存すると、Client 側がリセットされた際に不一致が発生します。
>
> よくある Mismatch としては、ランダム数、タイムスタンプ、不正な HTML のネスト構造があります。解決方法は、変動するコンテンツを `onMounted` に移動するか、`<ClientOnly>` コンポーネントを使用することです。

**キーポイント：**
- ✅ `onMounted` は Client でのみ実行
- ✅ `useState` は SSR 状態同期をサポート、`ref` はサポートしない
- ✅ Hydration Mismatch の原因（構造、ランダム値）と解決法（`<ClientOnly>`、`onMounted`）
