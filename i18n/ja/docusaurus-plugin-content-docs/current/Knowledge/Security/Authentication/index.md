---
id: login-interview-index
title: 'ログイン機構の面接問題一覧'
slug: /experience/login
tags: [Experience, Interview, Login]
---

> ログイン関連の面接問題と回答のポイントを、難易度順に整理しています。

---

## Lv1 基礎

- [過去のプロジェクトのログイン機構はどのように実装したか？](/docs/experience/login/lv1-project-implementation)
- [Session-based と Token-based の違いは？](/docs/experience/login/lv1-session-vs-token)
- [JWT の構造とは？](/docs/experience/login/lv1-jwt-structure)

## Lv2 応用

- Token はどこに保存できるか？注意すべきセキュリティの問題は？（整理中）
- フロントエンドで各 API リクエストに自動的に Token を付与するには？（整理中）
- Token の有効期限切れはどう処理するか？（整理中）

## Lv3 システム設計問題

- マイクロサービスアーキテクチャで JWT が好まれる理由は？（整理中）
- JWT の欠点は？能動的なログアウトをどう処理するか？（整理中）
- Token の盗用を減らす・防ぐにはどうするか？（整理中）

## Lv4 発展問題

- 「全デバイスの強制ログアウト」を実装する場合、Session と Token アーキテクチャではそれぞれどうするか？（整理中）
- SSO（Single Sign-On）で一般的に採用されるログイン戦略は？（整理中）
