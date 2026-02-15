---
id: login-lv1-jwt-structure
title: '[Lv1] JWT 的结构是什么？'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> 面试官常会接着问：「JWT 长什么样子？为什么要这样设计？」搞清楚结构、编码方式与验证流程，就能快速回答。

---

## 1. 基本轮廓

JWT（JSON Web Token）是一种 **自包含（self-contained）** 的 Token 格式，用来在双方之间安全地传递信息。内容由三段字符串构成，使用 `.` 串接：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

拆开来看就是三个 Base64URL 编码的 JSON：

1. **Header**：描述 Token 使用的算法、类型。
2. **Payload**：存放用户信息与声明（claims）。
3. **Signature**：用密钥签章，确保内容未被篡改。

---

## 2. Header、Payload、Signature 详解

### 2.1 Header（标头）

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`：签章算法，例如 `HS256`（HMAC + SHA-256）、`RS256`（RSA + SHA-256）。
- `typ`：Token 类型，通常为 `JWT`。

### 2.2 Payload（载荷）

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
  - `iss`（Issuer）：签发者
  - `sub`（Subject）：主题（通常是用户 ID）
  - `aud`（Audience）：接收对象
  - `exp`（Expiration Time）：到期时间（Unix timestamp，秒）
  - `nbf`（Not Before）：在此时间前无效
  - `iat`（Issued At）：签发时间
  - `jti`（JWT ID）：Token 唯一识别码
- **Public / Private Claims**：可加入自定义字段（例如 `role`、`permissions`），但要避免过度冗长。

### 2.3 Signature（签章）

签章生成流程：

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- 使用密钥（`secret` 或私钥）对前两段进行签名。
- 服务器收到 Token 后重新计算签章，如果一致，代表 Token 未被篡改且确实由合法来源签发。

> 注意：JWT 只保证数据完整性（Integrity），不保证机密性（Confidentiality），除非额外加密。

---

## 3. Base64URL 编码是什么？

JWT 使用 **Base64URL** 而非 Base64，差异在于：

- 把 `+` 改成 `-`，`/` 改成 `_`。
- 移除结尾 `=`。

这样做的好处是 Token 可以安全地放在 URL、Cookie 或 Header 中，不会因为特殊字符造成问题。

---

## 4. 验证流程简图

1. 客户端在 Header 带入 `Authorization: Bearer <JWT>`。
2. 服务器收到后：
   - 解析 Header、Payload。
   - 取得 `alg` 指定的算法。
   - 使用共享密钥或公开密钥重新计算签章。
   - 比对签章是否一致，并检查 `exp`、`nbf` 等时间字段。
3. 验证通过后才能信任 Payload 内容。

---

## 5. 面试回答框架

> 「JWT 由 Header、Payload、Signature 三段组成，用 `.` 串接。
> Header 描述算法与类型；Payload 存放用户信息与一些标准字段，例如 `iss`、`sub`、`exp`；Signature 则是用密钥对前两段签名，用来确认内容没有被改动过。
> 内容是 Base64URL 编码的 JSON，但并没有加密，只是转码，所以敏感数据不能直接塞进去。服务器拿到 Token 后会重新计算签章比对，如果一致且没过期，就代表 Token 有效。」

---

## 6. 面试延伸提醒

- **安全性**：Payload 可被解码，请勿放密码、信用卡等敏感信息。
- **到期与更新**：通常会搭配短效 Access Token + 长效 Refresh Token。
- **签章算法**：可提到对称式（HMAC）与非对称式（RSA、ECDSA）的差别。
- **为什么不能无限长？**：Token 太大会增加网络传输成本，也可能被浏览器拒绝。

---

## 7. 参考资料

- [JWT 官方网站](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0：Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
