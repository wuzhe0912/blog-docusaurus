---
id: state-management-vue-pinia-setup
title: 'Pinia 초기화 및 설정'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> 멀티 브랜드 플랫폼 프로젝트에서의 Pinia 초기화 설정과 프로젝트 구조 설계.

---

## 1. 면접 답변 핵심 축

1. **Pinia 선택 이유**: 더 나은 TypeScript 지원, 더 간결한 API, 모듈화 설계, 더 나은 개발 경험.
2. **초기화 설정**: `piniaPluginPersistedstate`를 사용한 영속화, `PiniaCustomProperties` 인터페이스 확장.
3. **프로젝트 구조**: 30+ 개의 Store, 기능 영역별 분류 관리.

---

## 2. 왜 Pinia인가?

### 2.1 Pinia vs Vuex

**Pinia**는 Vue 3의 공식 상태 관리 도구로, Vuex의 후속으로서 더 간결한 API와 더 나은 TypeScript 지원을 제공합니다.

**면접 핵심 답변**:

1. **더 나은 TypeScript 지원**
   - Pinia는 완전한 타입 추론 제공
   - 추가 헬퍼 함수 불필요 (`mapState`, `mapGetters` 등)

2. **더 간결한 API**
   - mutations 불필요 (Vuex의 동기 작업 레이어)
   - actions에서 직접 동기/비동기 작업 실행

3. **모듈화 설계**
   - 중첩 모듈 불필요
   - 각 Store가 독립적

4. **더 나은 개발 경험**
   - Vue Devtools 지원
   - Hot Module Replacement (HMR)
   - 더 작은 크기 (약 1KB)

5. **Vue 3 공식 권장**
   - Pinia는 Vue 3의 공식 상태 관리 도구

### 2.2 Pinia의 핵심 구성

```typescript
// Store의 3대 핵심 요소
{
  state: () => ({ ... }),      // 상태 데이터
  getters: { ... },            // 계산 속성
  actions: { ... }             // 메서드 (동기/비동기)
}
```

**Vue 컴포넌트와의 대응 관계**:
- `state` ≈ `data`
- `getters` ≈ `computed`
- `actions` ≈ `methods`

---

## 3. Pinia 초기화 설정

### 3.1 기본 설정

**파일 위치:** `src/stores/index.ts`

```typescript
import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Router } from 'vue-router';

// Pinia 커스텀 속성 확장
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(() => {
  const pinia = createPinia();

  // 영속화 플러그인 등록
  pinia.use(piniaPluginPersistedstate);

  return pinia;
});
```

**면접 핵심 포인트**:
- ✅ `piniaPluginPersistedstate`를 사용한 상태 영속화
- ✅ `PiniaCustomProperties` 인터페이스 확장으로 모든 Store에서 router 접근 가능
- ✅ Quasar의 `store` wrapper를 통한 통합

### 3.2 Store 파일 구조

```
src/stores/
├── index.ts                    # Pinia 인스턴스 설정
├── store-flag.d.ts            # TypeScript 타입 선언
│
├── authStore.ts               # 인증 관련
├── userInfoStore.ts           # 사용자 정보
├── gameStore.ts               # 게임 정보
├── productStore.ts            # 상품 정보
├── languageStore.ts           # 언어 설정
├── darkModeStore.ts          # 테마 모드
├── envStore.ts               # 환경 설정
└── ... (총 30+ Store)
```

**설계 원칙**:
- 각 Store는 단일 기능 영역 담당
- 파일 네이밍 규칙: `기능명 + Store.ts`
- TypeScript 완전한 타입 정의 사용

---

## 4. 면접 핵심 포인트 정리

### 4.1 Pinia 선택 이유

**이렇게 답변할 수 있습니다:**

> 프로젝트에서 Vuex 대신 Pinia를 선택한 주요 이유는: 1) 더 나은 TypeScript 지원으로 완전한 타입 추론 제공, 추가 설정 불필요; 2) 더 간결한 API로 mutations 불필요, actions에서 직접 동기/비동기 작업 실행; 3) 모듈화 설계로 중첩 모듈 불필요, 각 Store가 독립적; 4) 더 나은 개발 경험으로 Vue Devtools, HMR 지원, 더 작은 크기; 5) Vue 3 공식 권장.

**핵심 포인트:**
- ✅ TypeScript 지원
- ✅ API 간결성
- ✅ 모듈화 설계
- ✅ 개발 경험

### 4.2 초기화 설정 핵심

**이렇게 답변할 수 있습니다:**

> Pinia 초기화 시 몇 가지 주요 설정을 했습니다: 1) `piniaPluginPersistedstate`를 사용한 상태 영속화로 Store가 자동으로 localStorage에 저장 가능; 2) `PiniaCustomProperties` 인터페이스를 확장하여 모든 Store에서 router에 접근 가능하게 하여 actions에서의 라우팅 작업을 용이하게; 3) Quasar의 `store` wrapper를 통한 통합으로 프레임워크와의 통합성 확보.

**핵심 포인트:**
- ✅ 영속화 플러그인 설정
- ✅ 커스텀 속성 확장
- ✅ 프레임워크 통합

---

## 5. 면접 총정리

**이렇게 답변할 수 있습니다:**

> 프로젝트에서 Pinia를 상태 관리 도구로 사용합니다. Pinia를 선택한 것은 더 나은 TypeScript 지원, 더 간결한 API, 더 나은 개발 경험을 제공하기 때문입니다. 초기화 설정에서 `piniaPluginPersistedstate`로 영속화를 구현하고 `PiniaCustomProperties`를 확장하여 모든 Store에서 router에 접근 가능하게 했습니다. 프로젝트에는 30+ 개의 Store가 있으며 기능 영역별로 분류 관리되고, 각 Store는 단일 기능 영역을 담당합니다.

**핵심 포인트:**
- ✅ Pinia 선택 이유
- ✅ 초기화 설정 핵심
- ✅ 프로젝트 구조 설계
- ✅ 실제 프로젝트 경험
