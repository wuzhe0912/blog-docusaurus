---
id: login-lv1-project-implementation
title: '[Lv1] 過去のプロジェクトのログイン機構はどのように実装したか？'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> 目標：3〜5分で「フロントエンドがログイン、状態管理、ページ保護をどう処理しているか」を明確に説明し、面接時に素早く思い出せるようにする。

---

## 1. 面接回答の主軸

1. **ログインフローの3段階**：フォーム送信 → バックエンド検証 → Token 保存とナビゲーション。
2. **状態と Token 管理**：Pinia と永続化、Axios Interceptor で自動的に Bearer Token を付与。
3. **後続処理と保護**：共通データの初期化、ルートガード、ログアウトと例外ケース（OTP、パスワード強制変更）。

まずこの3つのポイントから始め、必要に応じて詳細を展開することで、面接官に全体像を把握していることを示します。

---

## 2. システム構成と責任分担

| モジュール       | 配置場所                            | 役割                                         |
| ---------------- | ----------------------------------- | -------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | ログイン状態の保存、Token の永続化、getter 提供 |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | ログイン・ログアウトフローのカプセル化、統一レスポンス形式 |
| ログイン API     | `src/api/login.ts`                  | バックエンドの `POST /login`、`POST /logout` を呼び出し |
| Axios ユーティリティ | `src/common/utils/request.ts`   | Request / Response Interceptor、統一エラー処理 |
| ルートガード     | `src/router/index.ts`               | `meta` に基づいてログイン要否を判断、ログインページへ誘導 |
| 初期化フロー     | `src/common/composables/useInit.ts` | App 起動時に Token の有無を判断、必要なデータを読み込み |

> 覚え方：**「Store が状態管理、Hook がフロー管理、Interceptor が通信管理、Guard がページ管理」**。

---

## 3. ログインフロー（ステップごとの分解）

### Step 0. フォームと事前検証

- パスワードログインと SMS 認証コードログインの2つの方式に対応。
- 送信前に基本検証（必須項目、フォーマット、二重送信防止）を実施。

### Step 1. ログイン API の呼び出し

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` で統一エラー処理と loading 管理。
- 成功時、`data` には Token とユーザーの基本情報が含まれます。

### Step 2. バックエンドレスポンスの処理

| ケース                                     | 動作                                              |
| ------------------------------------------ | ------------------------------------------------- |
| **追加認証が必要**（初回ログイン時の本人確認など） | `authStore.onBoarding` を `true` に設定、認証ページへ誘導 |
| **パスワード強制変更**                     | レスポンスフラグに基づきパスワード変更フローへ誘導 |
| **通常の成功**                             | `authStore.$patch()` で Token とユーザー情報を保存 |

### Step 3. ログイン完了後の共通処理

1. ユーザー基本情報とウォレット一覧を取得。
2. パーソナライズされたコンテンツ（ギフト一覧、通知など）を初期化。
3. `redirect` または既定のルートで内部ページへナビゲーション。

> ログイン成功は半分に過ぎません。**後続の共通データをこのタイミングで揃える**ことで、各ページが個別に API を呼び出す必要をなくします。

---

## 4. Token のライフサイクル管理

### 4.1 保存戦略

- `authStore` で `persist: true` を有効にし、重要なフィールドを `localStorage` に書き込み。
- メリット：リロード後も状態が自動復元。デメリット：XSS とセキュリティに自ら注意が必要。

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- 認証が必要な API には自動的に Bearer Token を付与。
- API に `needToken: false`（ログイン、登録など）が明示されている場合は付与をスキップ。

### 4.3 有効期限と例外処理

- バックエンドが Token の期限切れや無効を返した場合、Response Interceptor が統一的にエラー表示に変換し、ログアウトフローをトリガー。
- 必要に応じて Refresh Token メカニズムに拡張可能。現在のプロジェクトでは簡易戦略を採用。

---

## 5. ルート保護と初期化

### 5.1 ルートガード

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- `meta.needAuth` によりログイン状態のチェック要否を判断。
- 未ログイン時はログインページまたは指定のパブリックページへ誘導。

### 5.2 アプリ起動時の初期化

`useInit` が App 起動時に処理：

1. URL に `login_token` または `platform_token` が含まれていれば、自動ログインまたは Token を設定。
2. Store に Token があればユーザー情報と共通データを読み込み。
3. Token がなければパブリックページに留まり、ユーザーの手動ログインを待機。

---

## 6. ログアウトフロー（後処理とクリーンアップ）

1. `POST /logout` でバックエンドに通知。
2. `reset()` を実行：
   - `authStore.$reset()` でログイン情報をクリア。
   - 関連 Store（ユーザー情報、お気に入り、招待コードなど）も一括リセット。
3. ブラウザ側のキャッシュ（localStorage 内のキャッシュなど）をクリーンアップ。
4. ログインページまたはトップページへ戻る。

> ログアウトはログインの鏡像：Token を削除するだけでなく、すべての依存状態がクリアされていることを確認し、残留データを防ぐ必要があります。

---

## 7. よくある質問とベストプラクティス

- **フロー分離**：ログインとログイン後の初期化を分離し、hook を簡潔に保つ。
- **エラー処理**：`useApi` と Response Interceptor で統一し、UI 表示の一貫性を確保。
- **セキュリティ**：
  - 全通信で HTTPS を使用。
  - Token を `localStorage` に保存する場合、機密操作では XSS に注意。
  - 必要に応じて httpOnly Cookie や Refresh Token に拡張。
- **拡張対応**：OTP、パスワード強制変更などのケースは柔軟性を持たせ、hook が状態を返して画面側で処理。

---

## 8. 面接用クイックメモ

1. **「入力 → 検証 → 保存 → ナビゲーション」**：この順序で全体フローを説明。
2. **「Store で状態管理、Interceptor でヘッダー付与、Guard でアクセス制御」**：アーキテクチャの分担を強調。
3. **「ログイン後すぐに共通データを揃える」**：ユーザー体験への意識をアピール。
4. **「ログアウトはワンクリックリセット + 安全なページへ戻る」**：セキュリティとフロー完結を意識。
