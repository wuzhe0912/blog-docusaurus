---
id: login-lv1-jwt-structure
title: '[Lv1] JWT 的結構是什麼？'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> 面試官常會接著問：「JWT 長什麼樣子？為什麼要這樣設計？」搞清楚結構、編碼方式與驗證流程，就能快速回答。

---

## 1. 基本輪廓

JWT（JSON Web Token）是一種 **自包含（self-contained）** 的 Token 格式，用來在雙方之間安全地傳遞資訊。內容由三段字串構成，使用 `.` 串接：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

拆開來看就是三個 Base64URL 編碼的 JSON：

1. **Header**：描述 Token 使用的演算法、類型。
2. **Payload**：存放使用者資訊與宣告（claims）。
3. **Signature**：用密鑰簽章，確保內容未被竄改。

---

## 2. Header、Payload、Signature 詳解

### 2.1 Header（標頭）

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`：簽章演算法，例如 `HS256`（HMAC + SHA-256）、`RS256`（RSA + SHA-256）。
- `typ`：Token 類型，通常為 `JWT`。

### 2.2 Payload（載荷）

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims（官方保留，但非必填）**：
  - `iss`（Issuer）：簽發者
  - `sub`（Subject）：主題（通常是使用者 ID）
  - `aud`（Audience）：接收對象
  - `exp`（Expiration Time）：到期時間（Unix timestamp，秒）
  - `nbf`（Not Before）：在此時間前無效
  - `iat`（Issued At）：簽發時間
  - `jti`（JWT ID）：Token 唯一識別碼
- **Public / Private Claims**：可加入自訂欄位（例如 `role`、`permissions`），但要避免過度冗長。

### 2.3 Signature（簽章）

簽章生成流程：

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- 使用密鑰（`secret` 或私鑰）對前兩段進行簽名。
- 伺服器收到 Token 後重新計算簽章，如果一致，代表 Token 未被竄改且確實由合法來源簽發。

> 注意：JWT 只保證資料完整性（Integrity），不保證機密性（Confidentiality），除非額外加密。

---

## 3. Base64URL 編碼是什麼？

JWT 使用 **Base64URL** 而非 Base64，差異在於：

- 把 `+` 改成 `-`，`/` 改成 `_`。
- 移除結尾 `=`。

這樣做的好處是 Token 可以安全地放在 URL、Cookie 或 Header 中，不會因為特殊字元造成問題。

---

## 4. 驗證流程簡圖

1. 客戶端在 Header 帶入 `Authorization: Bearer <JWT>`。
2. 伺服器收到後：
   - 解析 Header、Payload。
   - 取得 `alg` 指定的演算法。
   - 使用共享密鑰或公開金鑰重新計算簽章。
   - 比對簽章是否一致，並檢查 `exp`、`nbf` 等時間欄位。
3. 驗證通過後才能信任 Payload 內容。

---

## 5. 面試回答框架

> 「JWT 由 Header、Payload、Signature 三段組成，用 `.` 串接。  
> Header 描述演算法與類型；Payload 存放使用者資訊與一些標準欄位，例如 `iss`、`sub`、`exp`；Signature 則是用密鑰對前兩段簽名，用來確認內容沒有被改動過。  
> 內容是 Base64URL 編碼的 JSON，但並沒有加密，只是轉碼，所以敏感資料不能直接塞進去。伺服器拿到 Token 後會重新計算簽章比對，如果一致且沒過期，就代表 Token 有效。 」

---

## 6. 面試延伸提醒

- **安全性**：Payload 可被解碼，請勿放密碼、信用卡等敏感資訊。
- **到期與更新**：通常會搭配短效 Access Token + 長效 Refresh Token。
- **簽章演算法**：可提到對稱式（HMAC）與非對稱式（RSA、ECDSA）的差別。
- **為什麼不能無限長？**：Token 太大會增加網路傳輸成本，也可能被瀏覽器拒絕。

---

## 7. 參考資料

- [JWT 官方網站](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0：Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)

