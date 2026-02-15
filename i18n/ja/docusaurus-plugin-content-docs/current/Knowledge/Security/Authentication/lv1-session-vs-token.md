---
id: login-lv1-session-vs-token
title: '[Lv1] Session-based と Token-based の違いは？'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> 面接でよく聞かれる追加質問：従来の Session と現代の Token の違いを理解していますか？以下のポイントを押さえれば、素早く整理できます。

---

## 1. 2つの認証モデルの基本概念

### Session-based Authentication

- **状態はサーバー側に保存**：ユーザーが初めてログインした後、サーバーがメモリまたはデータベースに Session を作成し、Session ID を Cookie に格納して返却。
- **後続リクエストは Session ID に依存**：ブラウザは同一ドメインで自動的に Session Cookie を送信し、サーバーが Session ID からユーザー情報を取得。
- **従来の MVC / モノリスアプリケーションで一般的**：サーバーがページのレンダリングとユーザー状態の維持を担当。

### Token-based Authentication（例：JWT）

- **状態はクライアント側に保存**：ログイン成功後に Token（ユーザー情報と権限を含む）を生成し、フロントエンドが保存。
- **各リクエストに Token を付与**：通常 `Authorization: Bearer <token>` に配置。サーバーは署名を検証するだけでユーザー情報を取得可能。
- **SPA / マイクロサービスで一般的**：バックエンドは Token の検証のみ行い、ユーザー状態の保存は不要。

---

## 2. リクエストフローの比較

| フローステップ | Session-based                                           | Token-based (JWT)                                                     |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| ログイン成功   | サーバーが Session を作成、`Set-Cookie: session_id=...` を返却 | サーバーが Token を発行、JSON を返却：`{ access_token, expires_in, ... }` |
| 保存場所       | ブラウザの Cookie（通常は httponly）                     | フロントエンドが選択：`localStorage`、`sessionStorage`、Cookie、Memory |
| 後続リクエスト | ブラウザが自動的に Cookie を送信、サーバーが参照してユーザー情報取得 | フロントエンドが手動で Header に `Authorization` を付与               |
| 検証方法       | Session Store を参照                                    | Token の署名を検証、またはブラックリスト / ホワイトリストと照合       |
| ログアウト     | サーバーの Session を削除、`Set-Cookie` で Cookie をクリア | フロントエンドが Token を削除；強制無効化にはブラックリストまたは鍵ローテーションが必要 |

---

## 3. メリット・デメリットまとめ

| 観点       | Session-based                                                                 | Token-based (JWT)                                                                 |
| ---------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| メリット   | - Cookie が自動送信されるためブラウザ側はシンプル<br />- Session に大量のデータを保存可能<br />- 取り消しと強制ログアウトが容易 | - ステートレスで水平スケーリング可能<br />- SPA、モバイル、マイクロサービスに適合<br />- Token はクロスドメイン・クロスデバイスで使用可能 |
| デメリット | - サーバーが Session Store を維持する必要がありメモリを消費<br />- 分散デプロイでは Session の同期が必要 | - Token のサイズが大きく、毎回のリクエストで転送<br />- 簡単には取り消せず、ブラックリスト / 鍵ローテーション機構が別途必要 |
| セキュリティリスク | - CSRF 攻撃を受けやすい（Cookie が自動送信されるため）<br />- Session ID が漏洩した場合、即座にクリアが必要 | - XSS の影響を受けやすい（読み取り可能な場所に保存した場合）<br />- Token が期限切れ前に盗まれた場合、リプレイ攻撃が可能 |
| 使用シーン | - 従来の Web (SSR) + 同一ドメイン<br />- サーバーサイドレンダリング | - RESTful API / GraphQL<br />- モバイルアプリ、SPA、マイクロサービス |

---

## 4. どう選ぶか？

### まず自分に3つの質問をする

1. **クロスドメインまたはマルチプラットフォームでログイン状態を共有する必要があるか？**
   - 必要 → Token-based がより柔軟。
   - 不要 → Session-based がよりシンプル。

2. **デプロイは複数サーバーまたはマイクロサービスか？**
   - はい → Token-based で Session の複製や集中管理の必要性を削減。
   - いいえ → Session-based が手軽かつ安全。

3. **高いセキュリティ要件があるか（銀行、エンタープライズシステム）？**
   - 高い要件 → Session-based + httponly Cookie + CSRF 対策がまだ主流。
   - 軽量 API やモバイルサービス → Token-based + HTTPS + Refresh Token + ブラックリスト戦略。

### よくある組み合わせ戦略

- **エンタープライズ内部システム**：Session-based + Redis / Database 同期。
- **モダン SPA + モバイルアプリ**：Token-based（Access Token + Refresh Token）。
- **大規模マイクロサービス**：Token-based（JWT）+ API Gateway 検証。

---

## 5. 面接回答テンプレート

> 「従来の Session はサーバー側に状態を保存し、session id を Cookie に格納して返します。ブラウザは毎回のリクエストで自動的に Cookie を送信するため、同一ドメインの Web App に非常に適しています。デメリットは、サーバーが Session Store を維持する必要があり、複数サーバーにデプロイする場合は同期も必要な点です。
> 一方、Token-based（例えば JWT）はユーザー情報を Token にエンコードしてクライアント側に保存し、各リクエストでフロントエンドが手動で Header に付与します。ステートレスなので SPA やマイクロサービスに適しており、スケールしやすいです。
> セキュリティの観点では、Session は CSRF に注意が必要で、Token は XSS に注意が必要です。クロスドメイン、モバイルデバイス、複数サービスの統合であれば Token を選び、従来のエンタープライズシステムやサーバーサイドレンダリングであれば Session + httponly Cookie を選びます。」

---

## 6. 面接での補足メモ

- Session → **CSRF 対策、Session 同期戦略、クリアのタイミング** を重点的に。
- Token → **保存場所（Cookie vs localStorage）**、**Refresh Token メカニズム**、**ブラックリスト / 鍵ローテーション** を重点的に。
- エンタープライズでよく使われる折衷案として、`httpOnly Cookie` に Token を保存し、CSRF Token と組み合わせる方法を補足できます。

---

## 7. 参考資料

- [MDN：HTTP Cookies](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies)
- [Auth0：Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP：Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
