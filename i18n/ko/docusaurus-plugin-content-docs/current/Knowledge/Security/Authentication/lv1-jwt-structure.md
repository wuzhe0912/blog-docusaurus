---
id: login-lv1-jwt-structure
title: '[Lv1] JWT의 구조는 어떻게 되어 있나요?'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> 면접관이 자주 물어보는 질문: "JWT는 어떻게 생겼나요? 왜 이런 구조로 설계되었나요?" 구조, 인코딩 방식, 검증 흐름을 파악하면 빠르게 답변할 수 있습니다.

---

## 1. 기본 구조

JWT(JSON Web Token)는 **자기 포함형(self-contained)** Token 형식으로, 양측 간에 안전하게 정보를 전달하기 위해 사용됩니다. 세 개의 문자열로 구성되며 `.`으로 연결됩니다:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

분해하면 세 개의 Base64URL 인코딩된 JSON입니다:

1. **Header**: Token이 사용하는 알고리즘과 유형을 설명합니다.
2. **Payload**: 사용자 정보와 클레임(claims)을 저장합니다.
3. **Signature**: 비밀 키로 서명하여 내용이 변조되지 않았음을 보장합니다.

---

## 2. Header, Payload, Signature 상세 설명

### 2.1 Header(헤더)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: 서명 알고리즘, 예를 들어 `HS256`(HMAC + SHA-256), `RS256`(RSA + SHA-256).
- `typ`: Token 유형, 보통 `JWT`.

### 2.2 Payload(페이로드)

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims(공식 예약 클레임, 필수는 아님)**:
  - `iss`(Issuer): 발급자
  - `sub`(Subject): 주체 (보통 사용자 ID)
  - `aud`(Audience): 수신 대상
  - `exp`(Expiration Time): 만료 시간 (Unix timestamp, 초 단위)
  - `nbf`(Not Before): 이 시간 이전에는 유효하지 않음
  - `iat`(Issued At): 발급 시간
  - `jti`(JWT ID): Token 고유 식별자
- **Public / Private Claims**: 커스텀 필드를 추가할 수 있습니다(예: `role`, `permissions`). 단, 과도하게 길어지지 않도록 주의해야 합니다.

### 2.3 Signature(서명)

서명 생성 과정:

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- 비밀 키(`secret` 또는 개인 키)를 사용하여 앞의 두 부분에 서명합니다.
- 서버가 Token을 수신한 후 서명을 다시 계산하여 일치하면, Token이 변조되지 않았으며 합법적인 출처에서 발급되었음을 의미합니다.

> 주의: JWT는 데이터 무결성(Integrity)만 보장하며, 기밀성(Confidentiality)은 보장하지 않습니다. 기밀성이 필요하면 추가 암호화가 필요합니다.

---

## 3. Base64URL 인코딩이란?

JWT는 Base64가 아닌 **Base64URL**을 사용하며, 차이점은 다음과 같습니다:

- `+`를 `-`로, `/`를 `_`로 변경합니다.
- 끝의 `=`를 제거합니다.

이렇게 하면 Token을 URL, Cookie, Header에 안전하게 넣을 수 있으며, 특수 문자로 인한 문제가 발생하지 않습니다.

---

## 4. 검증 흐름 간략도

1. 클라이언트가 Header에 `Authorization: Bearer <JWT>`를 포함합니다.
2. 서버가 수신 후:
   - Header와 Payload를 파싱합니다.
   - `alg`에 지정된 알고리즘을 확인합니다.
   - 공유 비밀 키 또는 공개 키로 서명을 다시 계산합니다.
   - 서명이 일치하는지 비교하고, `exp`, `nbf` 등 시간 필드를 검사합니다.
3. 검증을 통과한 후에만 Payload 내용을 신뢰합니다.

---

## 5. 면접 답변 프레임워크

> "JWT는 Header, Payload, Signature 세 부분으로 구성되며 `.`으로 연결됩니다.
> Header는 알고리즘과 유형을 설명하고, Payload는 사용자 정보와 `iss`, `sub`, `exp` 같은 표준 필드를 저장하며, Signature는 비밀 키로 앞의 두 부분을 서명하여 내용이 변조되지 않았는지 확인합니다.
> 내용은 Base64URL 인코딩된 JSON이지만 암호화된 것이 아니라 단순 인코딩이므로, 민감한 데이터를 직접 넣으면 안 됩니다. 서버는 Token을 수신하면 서명을 다시 계산하여 비교하고, 일치하며 만료되지 않았다면 유효한 Token입니다."

---

## 6. 면접 확장 포인트

- **보안**: Payload는 디코딩할 수 있으므로 비밀번호, 신용카드 등 민감 정보를 넣지 마세요.
- **만료와 갱신**: 보통 단기 Access Token + 장기 Refresh Token을 함께 사용합니다.
- **서명 알고리즘**: 대칭 방식(HMAC)과 비대칭 방식(RSA, ECDSA)의 차이를 언급할 수 있습니다.
- **왜 무한히 길면 안 되나요?**: Token이 너무 크면 네트워크 전송 비용이 증가하고, 브라우저에서 거부될 수 있습니다.

---

## 7. 참고 자료

- [JWT 공식 웹사이트](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0: Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
