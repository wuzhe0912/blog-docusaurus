---
id: login-lv1-session-vs-token
title: '[Lv1] Session-based와 Token-based의 차이점은 무엇인가요?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> 면접에서 흔한 추가 질문: 전통적인 Session과 현대적인 Token의 차이를 이해하고 있나요? 아래 핵심 사항을 파악하면 빠르게 정리할 수 있습니다.

---

## 1. 두 가지 인증 방식의 핵심 개념

### Session-based Authentication

- **상태가 서버에 저장됨**: 사용자가 처음 로그인하면 서버가 메모리 또는 데이터베이스에 Session을 생성하고, Session ID를 Cookie에 담아 반환합니다.
- **후속 요청은 Session ID에 의존**: 브라우저가 동일 도메인에서 자동으로 Session Cookie를 전송하고, 서버는 Session ID로 해당 사용자 정보를 찾습니다.
- **전통적인 MVC / 모놀리식 애플리케이션에서 주로 사용**: 서버가 페이지를 렌더링하고 사용자 상태를 유지합니다.

### Token-based Authentication (예: JWT)

- **상태가 클라이언트에 저장됨**: 로그인 성공 후 Token(사용자 정보와 권한 포함)이 생성되어 프론트엔드에서 보관합니다.
- **매 요청마다 Token을 전송**: 보통 `Authorization: Bearer <token>`에 넣으며, 서버는 서명을 검증하여 사용자 정보를 얻습니다.
- **SPA / 마이크로서비스에서 주로 사용**: 백엔드는 Token만 검증하면 되며, 사용자 상태를 저장할 필요가 없습니다.

---

## 2. 요청 흐름 비교

| 흐름 단계 | Session-based                                           | Token-based (JWT)                                                     |
| -------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| 로그인 성공 | 서버가 Session 생성, `Set-Cookie: session_id=...` 반환    | 서버가 Token 발급, JSON 반환: `{ access_token, expires_in, ... }`      |
| 저장 위치 | 브라우저 Cookie (보통 httponly)                         | 프론트엔드가 선택: `localStorage`, `sessionStorage`, Cookie, Memory        |
| 후속 요청 | 브라우저가 자동으로 Cookie 전송, 서버가 테이블 조회로 사용자 정보 획득 | 프론트엔드가 수동으로 Header에 `Authorization` 포함                    |
| 검증 방식 | Session Store 조회                                      | Token 서명 검증, 또는 블랙리스트 / 화이트리스트 비교                   |
| 로그아웃 | 서버 Session 삭제, `Set-Cookie`로 Cookie 제거            | 프론트엔드에서 Token 삭제; 강제 무효화 시 블랙리스트 기록 또는 키 순환 필요 |

---

## 3. 장단점 종합 정리

| 측면     | Session-based                                                                 | Token-based (JWT)                                                                 |
| -------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 장점     | - Cookie 자동 전송, 브라우저 측 간단<br />- Session에 대량 데이터 저장 가능<br />- 취소 및 강제 로그아웃 용이 | - Stateless, 수평 확장 가능<br />- SPA, 모바일 기기, 마이크로서비스에 적합<br />- Token이 크로스 도메인, 크로스 디바이스 사용 가능 |
| 단점     | - 서버가 Session Store를 유지해야 하며 메모리 소비<br />- 분산 배포 시 Session 동기화 필요 | - Token 크기가 커서 매 요청마다 전송<br />- 쉽게 취소할 수 없어 블랙리스트 / 키 순환 메커니즘 필요 |
| 보안 위험 | - CSRF 공격에 취약 (Cookie가 자동 전송됨)<br />- Session ID 유출 시 즉시 삭제 필요 | - XSS에 취약 (읽을 수 있는 위치에 저장된 경우)<br />- Token 만료 전 탈취 시 리플레이 공격 가능 |
| 사용 시나리오 | - 전통적인 Web (SSR) + 동일 도메인<br />- 서버가 페이지 렌더링 담당 | - RESTful API / GraphQL<br />- 모바일 App, SPA, 마이크로서비스                    |

---

## 4. 어떻게 선택할까?

### 스스로에게 세 가지 질문

1. **크로스 도메인이나 멀티 플랫폼에서 로그인 상태를 공유해야 하나요?**
   - 필요함 → Token-based가 더 유연합니다.
   - 필요 없음 → Session-based가 더 간결합니다.

2. **배포가 다중 서버 또는 마이크로서비스인가요?**
   - 예 → Token-based는 Session 복제나 집중화의 필요성을 줄여줍니다.
   - 아니오 → Session-based가 간편하고 안전합니다.

3. **높은 보안 요구사항이 있나요 (은행, 기업 시스템)?**
   - 높은 요구사항 → Session-based + httponly Cookie + CSRF 방어가 주류입니다.
   - 가벼운 API 또는 모바일 서비스 → Token-based + HTTPS + Refresh Token + 블랙리스트 전략.

### 일반적인 조합 전략

- **기업 내부 시스템**: Session-based + Redis / Database 동기화.
- **현대 SPA + 모바일 App**: Token-based (Access Token + Refresh Token).
- **대규모 마이크로서비스**: Token-based (JWT) + API Gateway 검증.

---

## 5. 면접 답변 템플릿

> "전통적인 Session은 상태를 서버에 저장하고, session id를 Cookie에 담아 반환하며, 브라우저가 매 요청마다 자동으로 Cookie를 전송하기 때문에 동일 도메인의 Web App에 매우 적합합니다. 단점은 서버가 Session Store를 유지해야 하고, 다중 서버 배포 시 동기화가 필요하다는 것입니다.
> 반면 Token-based(예: JWT)는 사용자 정보를 Token으로 인코딩하여 클라이언트에 저장하고, 매 요청 시 프론트엔드가 수동으로 Header에 포함합니다. 이 방식은 Stateless이며 SPA와 마이크로서비스에 적합하고, 확장이 비교적 용이합니다.
> 보안 측면에서 Session은 CSRF를 중시해야 하고, Token은 XSS에 주의해야 합니다. 크로스 도메인, 모바일 기기 또는 다중 서비스 통합이 필요하다면 Token을 선택하고, 전통적인 기업 시스템이나 서버 사이드 렌더링이라면 Session + httponly Cookie를 선택하겠습니다."

---

## 6. 면접 확장 메모

- Session → **CSRF 방어, Session 동기화 전략, 만료 삭제 시기**에 중점.
- Token → **저장 위치 (Cookie vs localStorage)**, **Refresh Token 메커니즘**, **블랙리스트 / 키 순환**에 중점.
- 기업에서 흔히 사용하는 절충안을 보충할 수 있습니다: `httpOnly Cookie`에 Token을 저장하고, CSRF Token도 함께 사용.

---

## 7. 참고 자료

- [MDN: HTTP Cookies](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
