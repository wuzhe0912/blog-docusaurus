---
id: login-lv1-project-implementation
title: '[Lv1] 이전 프로젝트의 로그인 메커니즘은 어떻게 구현했나요?'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> 목표: 3~5분 안에 "프론트엔드에서 로그인, 상태 유지, 페이지 보호를 어떻게 처리했는지" 명확하게 설명하여, 면접 시 빠르게 떠올릴 수 있도록 합니다.

---

## 1. 면접 답변 핵심

1. **로그인 흐름 3단계**: 폼 제출 → 백엔드 검증 → Token 저장 및 페이지 이동.
2. **상태 및 Token 관리**: Pinia와 영속화(persist) 연동, Axios Interceptor로 Bearer Token 자동 첨부.
3. **후속 처리 및 보호**: 공통 데이터 초기화, 라우터 가드, 로그아웃, 예외 시나리오(OTP, 비밀번호 강제 변경).

이 세 가지 핵심으로 시작한 뒤, 필요에 따라 세부 사항을 전개하면 면접관에게 전체적인 시야를 갖추고 있다는 인상을 줄 수 있습니다.

---

## 2. 시스템 구성 및 역할 분담

| 모듈           | 위치                                | 역할                                         |
| -------------- | ----------------------------------- | -------------------------------------------- |
| `authStore`    | `src/stores/authStore.ts`           | 로그인 상태 저장, Token 영속화, getter 제공   |
| `useAuth` Hook | `src/common/hooks/useAuth.ts`       | 로그인/로그아웃 흐름 캡슐화, 통일된 반환 형식 |
| 로그인 API     | `src/api/login.ts`                  | 백엔드 `POST /login`, `POST /logout` 호출    |
| Axios 유틸     | `src/common/utils/request.ts`       | Request/Response Interceptor, 통합 에러 처리 |
| 라우터 가드    | `src/router/index.ts`               | `meta`에 따라 로그인 필요 여부 판단, 로그인 페이지로 리다이렉트 |
| 초기화 흐름    | `src/common/composables/useInit.ts` | App 시작 시 Token 존재 여부 판단, 필요한 데이터 로드 |

> 기억법: **"Store는 상태 관리, Hook은 흐름 관리, Interceptor는 통신 관리, Guard는 페이지 관리"**.

---

## 3. 로그인 흐름 (단계별 분석)

### Step 0. 폼 및 사전 검증

- 일반 비밀번호와 SMS 인증 코드 두 가지 로그인 방식을 지원합니다.
- 제출 전 기본 검증(필수 입력, 형식, 중복 제출 방지)을 수행합니다.

### Step 1. 로그인 API 호출

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi`로 에러 처리 및 loading 관리를 통합합니다.
- 성공 시 `data`에 Token과 사용자 핵심 정보가 포함됩니다.

### Step 2. 백엔드 응답 처리

| 상황                                     | 동작                                              |
| ---------------------------------------- | ------------------------------------------------- |
| **추가 인증 필요**(예: 최초 로그인 시 본인 확인) | `authStore.onBoarding`을 `true`로 설정, 인증 페이지로 이동 |
| **비밀번호 강제 변경**                   | 반환된 플래그에 따라 비밀번호 변경 흐름으로 이동 및 필요 파라미터 전달 |
| **일반 성공**                           | `authStore.$patch()`를 호출하여 Token과 사용자 정보 저장 |

### Step 3. 로그인 완료 후 공통 동작

1. 사용자 기본 정보와 지갑 목록을 가져옵니다.
2. 개인화 콘텐츠(예: 선물 목록, 알림)를 초기화합니다.
3. `redirect` 또는 기본 라우트에 따라 내부 페이지로 이동합니다.

> 로그인 성공은 절반에 불과하며, **후속 공통 데이터를 이 시점에 모두 준비해야** 각 페이지에서 개별적으로 API를 호출하는 것을 방지할 수 있습니다.

---

## 4. Token 생명주기 관리

### 4.1 저장 전략

- `authStore`에서 `persist: true`를 활성화하여 주요 필드를 `localStorage`에 기록합니다.
- 장점: 새로고침 후 상태가 자동으로 복원됩니다. 단점: XSS 및 보안에 직접 주의해야 합니다.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- 인증이 필요한 API는 자동으로 Bearer Token을 포함합니다.
- API가 명시적으로 `needToken: false`(로그인, 회원가입 등)로 표시된 경우, Token 포함 과정을 건너뜁니다.

### 4.3 만료 및 예외 처리

- 백엔드가 Token 만료 또는 유효하지 않음을 반환하면, Response Interceptor가 통합적으로 에러 메시지로 변환하고 로그아웃 흐름을 실행합니다.
- 확장이 필요하면 Refresh Token 메커니즘을 추가할 수 있으며, 현재 프로젝트는 간소화 전략을 채택합니다.

---

## 5. 라우트 보호 및 초기화

### 5.1 라우터 가드

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- `meta.needAuth`를 통해 로그인 상태 확인 여부를 결정합니다.
- 미로그인 시 로그인 페이지 또는 지정된 공용 페이지로 이동합니다.

### 5.2 앱 시작 초기화

`useInit`은 App 시작 시 다음을 처리합니다:

1. URL에 `login_token` 또는 `platform_token`이 포함되어 있는지 확인하고, 있으면 자동 로그인 또는 Token 설정을 수행합니다.
2. Store에 이미 Token이 있으면 사용자 정보와 공통 데이터를 로드합니다.
3. Token이 없으면 공용 페이지에 머물며 사용자가 수동으로 로그인하기를 기다립니다.

---

## 6. 로그아웃 흐름 (마무리 및 정리)

1. `POST /logout`을 호출하여 백엔드에 알립니다.
2. `reset()` 실행:
   - `authStore.$reset()`으로 로그인 정보를 삭제합니다.
   - 관련 Store(사용자 정보, 즐겨찾기, 초대 코드 등)를 함께 초기화합니다.
3. 브라우저 측 캐시(예: localStorage의 캐시)를 정리합니다.
4. 로그인 페이지 또는 홈페이지로 이동합니다.

> 로그아웃은 로그인의 반대입니다: Token을 삭제하는 것만으로는 부족하며, 의존하는 모든 상태가 초기화되어야 잔여 데이터를 방지할 수 있습니다.

---

## 7. 자주 묻는 질문 및 모범 사례

- **흐름 분리**: 로그인과 로그인 후 초기화를 분리하여 hook을 간결하게 유지합니다.
- **에러 처리**: `useApi`와 Response Interceptor를 통해 통합 처리하여 UI 표시 일관성을 보장합니다.
- **보안**:
  - 전 과정에서 HTTPS를 사용합니다.
  - Token을 `localStorage`에 저장할 때, 민감한 작업에서는 XSS에 주의해야 합니다.
  - 상황에 따라 httpOnly Cookie 또는 Refresh Token으로 확장합니다.
- **확장 대비**: OTP, 비밀번호 강제 변경 등의 시나리오에 유연성을 유지하며, hook의 반환 상태를 통해 화면에서 처리합니다.

---

## 8. 면접 빠른 암기 포인트

1. **"입력 → 검증 → 저장 → 페이지 이동"**: 이 순서로 전체 흐름을 설명합니다.
2. **"Store가 상태 기록, Interceptor가 헤더 전달, Guard가 비인가 접근 차단"**: 아키텍처 분업을 부각합니다.
3. **"로그인 후 즉시 공통 데이터 보충"**: 사용자 경험에 대한 민감성을 보여줍니다.
4. **"로그아웃은 원클릭 초기화 + 안전 페이지로 이동"**: 보안과 흐름 수렴을 고려합니다.
