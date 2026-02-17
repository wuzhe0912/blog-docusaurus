---
id: state-management-vue-pinia-setup
title: 'Pinia 初期化と設定'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> マルチブランドプラットフォームプロジェクトにおける Pinia の初期化設定とプロジェクト構造設計。

---

## 1. 面接回答の主軸

1. **Pinia を選んだ理由**: より良い TypeScript サポート、よりシンプルな API、モジュラー設計、より良い開発体験。
2. **初期化設定**: `piniaPluginPersistedstate` を使用した永続化、`PiniaCustomProperties` インターフェースの拡張。
3. **プロジェクト構造**: 30+ の Store を機能領域別にカテゴリ管理。

---

## 2. なぜ Pinia か？

### 2.1 Pinia vs Vuex

**Pinia** は Vue 3 の公式状態管理ツールで、Vuex の後継としてよりシンプルな API とより良い TypeScript サポートを提供します。

**面接重点回答**:

1. **より良い TypeScript サポート**
   - Pinia は完全な型推論を提供
   - 追加のヘルパー関数が不要（`mapState`、`mapGetters` など）

2. **よりシンプルな API**
   - mutations が不要（Vuex における同期操作レイヤー）
   - actions 内で同期/非同期操作を直接実行

3. **モジュラー設計**
   - ネストされたモジュールが不要
   - 各 Store は独立

4. **より良い開発体験**
   - Vue Devtools サポート
   - Hot Module Replacement (HMR)
   - より小さいサイズ（約 1KB）

5. **Vue 3 公式推奨**
   - Pinia は Vue 3 の公式状態管理ツール

### 2.2 Pinia のコア構成

```typescript
// Store の3つのコア要素
{
  state: () => ({ ... }),      // 状態データ
  getters: { ... },            // 計算プロパティ
  actions: { ... }             // メソッド（同期/非同期）
}
```

**Vue コンポーネントとの対応関係**:
- `state` ≈ `data`
- `getters` ≈ `computed`
- `actions` ≈ `methods`

---

## 3. Pinia 初期化設定

### 3.1 基本設定

**ファイルパス:** `src/stores/index.ts`

```typescript
import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Router } from 'vue-router';

// Pinia のカスタムプロパティを拡張
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(() => {
  const pinia = createPinia();

  // 永続化プラグインを登録
  pinia.use(piniaPluginPersistedstate);

  return pinia;
});
```

**面接重点**:
- ✅ `piniaPluginPersistedstate` を使用した状態永続化
- ✅ `PiniaCustomProperties` インターフェースの拡張で全 Store から Router にアクセス可能
- ✅ Quasar の `store` ラッパーによる統合

### 3.2 Store ファイル構造

```
src/stores/
├── index.ts                    # Pinia インスタンス設定
├── store-flag.d.ts            # TypeScript 型宣言
│
├── authStore.ts               # 認証関連
├── userInfoStore.ts           # ユーザー情報
├── gameStore.ts               # ゲーム情報
├── productStore.ts            # 商品情報
├── languageStore.ts           # 言語設定
├── darkModeStore.ts          # テーマモード
├── envStore.ts               # 環境設定
└── ... (合計 30+ Store)
```

**設計原則**:
- 各 Store は単一の機能領域を担当
- ファイル命名規則: `機能名 + Store.ts`
- TypeScript の完全な型定義を使用

---

## 4. 面接ポイントまとめ

### 4.1 Pinia を選んだ理由

**回答例：**

> プロジェクトで Vuex ではなく Pinia を選んだ主な理由は：1) より良い TypeScript サポートで完全な型推論を提供し、追加設定が不要；2) よりシンプルな API で mutations が不要、actions 内で直接同期/非同期操作を実行；3) モジュラー設計でネストされたモジュールが不要、各 Store が独立；4) より良い開発体験で Vue Devtools、HMR をサポートし、サイズも小さい；5) Vue 3 公式推奨。

**キーポイント：**
- ✅ TypeScript サポート
- ✅ API のシンプルさ
- ✅ モジュラー設計
- ✅ 開発体験

### 4.2 初期化設定の重点

**回答例：**

> Pinia の初期化では、いくつかの重要な設定を行いました：1) `piniaPluginPersistedstate` を使用した状態永続化で、Store を自動的に localStorage に保存可能；2) `PiniaCustomProperties` インターフェースを拡張し、全 Store から Router にアクセス可能にすることで actions 内でのルーティング操作を容易に；3) Quasar の `store` ラッパーによる統合で、フレームワークとの統合性を確保。

**キーポイント：**
- ✅ 永続化プラグインの設定
- ✅ カスタムプロパティの拡張
- ✅ フレームワーク統合

---

## 5. 面接総括

**回答例：**

> プロジェクトでは Pinia を状態管理ツールとして使用しています。Pinia を選んだのは、より良い TypeScript サポート、よりシンプルな API、より良い開発体験を提供するためです。初期化設定では `piniaPluginPersistedstate` で永続化を実現し、`PiniaCustomProperties` を拡張して全 Store から Router にアクセス可能にしています。プロジェクトには 30+ の Store があり、機能領域別にカテゴリ管理され、各 Store は単一の機能領域を担当しています。

**キーポイント：**
- ✅ Pinia を選んだ理由
- ✅ 初期化設定の重点
- ✅ プロジェクト構造設計
- ✅ 実際のプロジェクト経験
