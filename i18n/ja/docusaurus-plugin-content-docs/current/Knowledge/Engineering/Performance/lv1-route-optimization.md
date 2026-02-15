---
id: performance-lv1-route-optimization
title: '[Lv1] ルーティング階層の最適化：3層 Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> 3層のルーティング Lazy Loading により、初回読み込みを 12.5MB から 850KB に削減し、ファーストビュー時間を 70% 短縮。

---

## 問題背景（Situation）

プロジェクトの特徴：

- **27 以上の異なるマルチテナントテンプレート**（マルチテナントアーキテクチャ）
- **各テンプレートに 20-30 ページ**（トップページ、ロビー、プロモーション、エージェント、ニュースなど）
- **全コードを一括読み込みした場合**：初回アクセスで **10MB+ の JS ファイル** のダウンロードが必要
- **ユーザーの待機時間が 10 秒超**（特にモバイルネットワーク環境で）

## 最適化目標（Task）

1. **初回読み込みの JavaScript サイズを削減**（目標：< 1MB）
2. **ファーストビュー時間を短縮**（目標：< 3 秒）
3. **オンデマンド読み込み**（ユーザーは必要なコンテンツだけダウンロード）
4. **開発体験の維持**（開発効率に影響しないこと）

## 解決策（Action）

**3層ルーティング Lazy Loading** 戦略を採用し、「テンプレート」→「ページ」→「権限」の3つの階層で最適化。

### 第1層：動的テンプレート読み込み

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // 環境変数に基づいて対応するテンプレートルートを動的に読み込み
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

説明：

- プロジェクトには 27 のテンプレートがあるが、ユーザーが使用するのは 1 つだけ
- environment.json で現在のブランドを判定
- 該当ブランドのルート設定のみ読み込み、残り 26 のテンプレートは一切読み込まない

効果：

- 初回読み込みでルート設定コードが約 85% 削減

### 第2層：ページ Lazy Loading

```typescript
// 従来の書き方（X - 良くない）
import HomePage from './pages/HomePage.vue';
component: HomePage; // 全ページが main.js にバンドルされる

// 採用した書き方（✓ - 良い）
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- 各ルートでアロー関数 + import() を使用
- ユーザーが実際にそのページにアクセスした時のみ、対応する JS chunk をダウンロード
- Vite が自動的に各ページを独立したファイルにバンドル

### 第3層：オンデマンド読み込み戦略

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // 未ログインユーザーは「エージェントセンター」などのログイン必須ページを読み込まない
    return next({ name: 'HomePage' });
  }
  next();
});
```

## 最適化成果（Result）

**最適化前：**

```
初回読み込み：main.js (12.5 MB)
ファーストビュー時間：8-12 秒
全 27 テンプレート + 全ページを含む
```

**最適化後：**

```markdown
初回読み込み：main.js (850 KB) ↓ 93%
ファーストビュー時間：1.5-2.5 秒 ↑ 70%
コアコード + 現在のトップページのみ含む
```

**具体的なデータ：**

- JavaScript サイズ削減：**12.5 MB → 850 KB（93% 削減）**
- ファーストビュー時間短縮：**10 秒 → 2 秒（70% 改善）**
- 後続ページの読み込み：**平均 300-500 KB per page**
- ユーザー体験スコア：**45 から 92 に向上（Lighthouse）**

**ビジネス価値：**

- 直帰率 35% 低下
- ページ滞在時間 50% 増加
- コンバージョン率 25% 向上

## 面接のポイント

**よくある追加質問：**

1. **Q: React.lazy() や Vue の非同期コンポーネントを使わないのはなぜですか？**
   A: 実際に Vue の非同期コンポーネント（`() => import()`）は使用していますが、ポイントは **3層アーキテクチャ** です：

   - 第1層（テンプレート）：ビルド時に決定（Vite 設定）
   - 第2層（ページ）：ランタイム Lazy Loading
   - 第3層（権限）：ナビゲーションガードで制御

   単純な lazy loading は第2層だけですが、テンプレート階層の分離を追加しました。

2. **Q: main.js に含めるコードはどう決めますか？**
   A: Vite の `manualChunks` 設定を使用：

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

   原則：「全ページで使用されるもの」のみ vendor chunk に配置。

3. **Q: Lazy Loading はユーザー体験（待機時間）に影響しませんか？**
   A: 2つの戦略で対応：

   - **Prefetch**：アイドル時に訪問する可能性のあるページを先読み
   - **Loading 状態**：白画面の代わりに Skeleton Screen を使用

   実際のテスト：後続ページの平均読み込み時間 < 500ms で、ユーザーは気づきません。

4. **Q: 最適化効果はどう測定しますか？**
   A: 複数のツールを使用：

   - **Lighthouse**：Performance Score（45 → 92）
   - **Webpack Bundle Analyzer**：chunk サイズの可視化分析
   - **Chrome DevTools**：Network waterfall、Coverage
   - **Real User Monitoring (RUM)**：実ユーザーデータ

5. **Q: Trade-off はありますか？**
   A:
   - 開発時に循環依存の問題が発生する可能性（モジュール構造の調整が必要）
   - 初回ルート切り替え時にわずかな読み込み時間が発生（prefetch で解決）
   - 全体的にはメリットがデメリットを上回り、特にモバイルユーザーの体験向上が顕著
