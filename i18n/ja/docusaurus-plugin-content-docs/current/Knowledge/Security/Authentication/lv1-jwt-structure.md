---
id: login-lv1-jwt-structure
title: '[Lv1] JWT の構造とは？'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> 面接官からよく聞かれる質問：「JWT はどんな形をしているか？なぜこのように設計されているか？」構造、エンコード方式、検証フローを理解すれば、素早く回答できます。

---

## 1. 基本的な構造

JWT（JSON Web Token）は **自己完結型（self-contained）** の Token フォーマットで、二者間で安全に情報を伝達するために使われます。内容は3つの文字列で構成され、`.` で連結されています：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

分解すると、3つの Base64URL エンコードされた JSON になります：

1. **Header**：Token が使用するアルゴリズムと種類を記述。
2. **Payload**：ユーザー情報とクレーム（claims）を格納。
3. **Signature**：秘密鍵で署名し、内容が改ざんされていないことを保証。

---

## 2. Header、Payload、Signature の詳細

### 2.1 Header（ヘッダー）

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`：署名アルゴリズム。例：`HS256`（HMAC + SHA-256）、`RS256`（RSA + SHA-256）。
- `typ`：Token の種類。通常は `JWT`。

### 2.2 Payload（ペイロード）

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims（公式予約済み、ただし必須ではない）**：
  - `iss`（Issuer）：発行者
  - `sub`（Subject）：主題（通常はユーザー ID）
  - `aud`（Audience）：受信者
  - `exp`（Expiration Time）：有効期限（Unix timestamp、秒）
  - `nbf`（Not Before）：この時刻より前は無効
  - `iat`（Issued At）：発行時刻
  - `jti`（JWT ID）：Token の一意識別子
- **Public / Private Claims**：カスタムフィールド（例：`role`、`permissions`）を追加可能。ただし、過度に長くならないよう注意。

### 2.3 Signature（署名）

署名の生成フロー：

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- 秘密鍵（`secret` または秘密鍵）を使って前2つのセグメントに署名。
- サーバーは Token を受け取った後、署名を再計算し、一致すれば Token が改ざんされておらず、正当なソースから発行されたことを確認できます。

> 注意：JWT はデータの完整性（Integrity）のみを保証し、機密性（Confidentiality）は保証しません。別途暗号化が必要です。

---

## 3. Base64URL エンコードとは？

JWT は Base64 ではなく **Base64URL** を使用しています。違いは：

- `+` を `-` に、`/` を `_` に変換。
- 末尾の `=` を削除。

これにより、Token を URL、Cookie、Header に安全に配置でき、特殊文字による問題を回避できます。

---

## 4. 検証フローの概要

1. クライアントが Header に `Authorization: Bearer <JWT>` を含める。
2. サーバーが受け取った後：
   - Header と Payload を解析。
   - `alg` で指定されたアルゴリズムを取得。
   - 共有秘密鍵または公開鍵で署名を再計算。
   - 署名の一致を確認し、`exp`、`nbf` などの時間フィールドをチェック。
3. 検証に合格して初めて Payload の内容を信頼できます。

---

## 5. 面接回答のフレームワーク

> 「JWT は Header、Payload、Signature の3つのセグメントで構成され、`.` で連結されています。
> Header はアルゴリズムと種類を記述し、Payload にはユーザー情報と `iss`、`sub`、`exp` などの標準フィールドが格納されています。Signature は秘密鍵で前2つのセグメントに署名したもので、内容が改ざんされていないことを確認するためのものです。
> 内容は Base64URL エンコードされた JSON ですが、暗号化されているわけではなく、単なるエンコードです。そのため、機密データを直接含めてはいけません。サーバーは Token を受け取ると署名を再計算して照合し、一致して有効期限内であれば Token が有効であることを確認します。」

---

## 6. 面接での補足ポイント

- **セキュリティ**：Payload はデコード可能なため、パスワードやクレジットカード情報などの機密情報を含めないこと。
- **有効期限と更新**：通常は短命の Access Token + 長命の Refresh Token を組み合わせて使用。
- **署名アルゴリズム**：対称暗号（HMAC）と非対称暗号（RSA、ECDSA）の違いに触れること。
- **なぜ無制限の長さにできないのか？**：Token が大きすぎるとネットワーク転送コストが増加し、ブラウザに拒否される可能性も。

---

## 7. 参考資料

- [JWT 公式サイト](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0：Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
