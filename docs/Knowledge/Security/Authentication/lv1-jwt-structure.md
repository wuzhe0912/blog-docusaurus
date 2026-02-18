---
id: login-lv1-jwt-structure
title: '[Lv1] What is the Structure of JWT?'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> Interviewers often follow up with: "What does a JWT look like? Why is it designed this way?" Understanding the structure, encoding method, and verification flow will help you answer quickly.

---

## 1. Basic Overview

JWT (JSON Web Token) is a **self-contained** token format used to securely transmit information between two parties. It consists of three strings joined by `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Breaking it down, it's three Base64URL-encoded JSON segments:

1. **Header**: Describes the algorithm and type used by the token.
2. **Payload**: Contains user information and claims.
3. **Signature**: Signed with a secret key to ensure the content hasn't been tampered with.

---

## 2. Header, Payload, and Signature in Detail

### 2.1 Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: The signing algorithm, e.g., `HS256` (HMAC + SHA-256), `RS256` (RSA + SHA-256).
- `typ`: The token type, typically `JWT`.

### 2.2 Payload

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims (officially reserved, but not required)**:
  - `iss` (Issuer): The entity that issued the token
  - `sub` (Subject): The subject (usually the user ID)
  - `aud` (Audience): The intended recipient
  - `exp` (Expiration Time): Expiration time (Unix timestamp, in seconds)
  - `nbf` (Not Before): The token is not valid before this time
  - `iat` (Issued At): The time the token was issued
  - `jti` (JWT ID): A unique identifier for the token
- **Public / Private Claims**: Custom fields can be added (e.g., `role`, `permissions`), but avoid making the payload excessively large.

### 2.3 Signature

The signature generation process:

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- The first two segments are signed using a secret key (or private key).
- When the server receives the token, it recalculates the signature. If it matches, it confirms the token hasn't been tampered with and was issued by a legitimate source.

> Note: JWT only guarantees data integrity, not confidentiality, unless additional encryption is applied.

---

## 3. What is Base64URL Encoding?

JWT uses **Base64URL** instead of Base64, with the following differences:

- `+` is replaced with `-`, and `/` is replaced with `_`.
- Trailing `=` padding is removed.

This ensures the token can be safely placed in URLs, Cookies, or Headers without issues caused by special characters.

---

## 4. Verification Flow Overview

1. The client includes `Authorization: Bearer <JWT>` in the request header.
2. The server receives the token and:
   - Parses the Header and Payload.
   - Retrieves the algorithm specified by `alg`.
   - Recalculates the signature using the shared secret or public key.
   - Compares the signatures and checks time-related fields like `exp` and `nbf`.
3. Only after verification passes can the server trust the Payload content.

---

## 5. Interview Answer Framework

> "JWT consists of three parts — Header, Payload, and Signature — joined by `.`.
> The Header describes the algorithm and type; the Payload contains user information and standard fields like `iss`, `sub`, and `exp`; the Signature signs the first two parts with a secret key to verify the content hasn't been altered.
> The content is Base64URL-encoded JSON, but it's not encrypted — just encoded. So sensitive data shouldn't be placed directly in it. When the server receives the token, it recalculates the signature for comparison. If it matches and hasn't expired, the token is considered valid."

---

## 6. Interview Follow-up Reminders

- **Security**: The Payload can be decoded — never put passwords, credit card numbers, or other sensitive information in it.
- **Expiration and Renewal**: Typically paired with a short-lived Access Token + a long-lived Refresh Token.
- **Signing Algorithms**: You can mention the difference between symmetric (HMAC) and asymmetric (RSA, ECDSA) approaches.
- **Why can't it be infinitely long?**: An oversized token increases network transmission cost and may be rejected by the browser.

---

## 7. References

- [JWT Official Website](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0: Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
