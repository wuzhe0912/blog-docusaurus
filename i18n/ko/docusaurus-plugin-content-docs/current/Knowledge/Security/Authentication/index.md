---
id: login-interview-index
title: '로그인 메커니즘 면접 질문 총정리'
slug: /experience/login
tags: [Experience, Interview, Login]
---

> 로그인 관련 면접 질문과 답변 포인트를 난이도별로 정리하며 지속적으로 축적합니다.

---

## Lv1 기초

- [이전 프로젝트의 로그인 메커니즘은 어떻게 구현했나요?](/docs/experience/login/lv1-project-implementation)
- [Session-based와 Token-based의 차이점은 무엇인가요?](/docs/experience/login/lv1-session-vs-token)
- [JWT의 구조는 어떻게 되어 있나요?](/docs/experience/login/lv1-jwt-structure)

## Lv2 심화

- Token은 어디에 저장할 수 있나요? 어떤 보안 이슈에 주의해야 하나요? (정리 예정)
- 프론트엔드에서 모든 API 요청에 자동으로 Token을 포함시키는 방법은? (정리 예정)
- Token 만료 시 어떻게 처리해야 하나요? (정리 예정)

## Lv3 시스템 설계 문제

- 마이크로서비스 아키텍처에서 JWT를 선호하는 이유는? (정리 예정)
- JWT의 단점은 무엇이며 능동적 로그아웃은 어떻게 처리하나요? (정리 예정)
- Token 탈취를 어떻게 줄이거나 방지할 수 있나요? (정리 예정)

## Lv4 고급 확장 문제

- "모든 기기에서 강제 로그아웃"을 구현하려면 Session과 Token 아키텍처에서 각각 어떻게 해야 하나요? (정리 예정)
- SSO(Single Sign-On)는 주로 어떤 로그인 전략과 함께 사용되나요? (정리 예정)
