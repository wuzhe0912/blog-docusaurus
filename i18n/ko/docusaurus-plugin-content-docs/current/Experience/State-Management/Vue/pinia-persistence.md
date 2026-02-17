---
id: state-management-vue-pinia-persistence
title: 'Pinia 영속화 전략'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> 멀티 브랜드 플랫폼 프로젝트에서의 Pinia Store 영속화 전략: `piniaPluginPersistedstate`와 VueUse의 `useSessionStorage` 사용.

---

## 1. 면접 답변 핵심 축

1. **세 가지 영속화 방법**: `persist: true`, `useSessionStorage`, 수동 영속화.
2. **선택 전략**: Store 전체 영속화에는 `persist: true`, 특정 필드에는 `useSessionStorage`.
3. **보안 고려**: 민감한 정보는 영속화하지 않음, 사용자 설정은 영속화.

---

## 2. 영속화 방법

### 2.1 Pinia Plugin Persistedstate

**Options API:**

```typescript
export const useLanguageStore = defineStore('languageStore', {
  state: () => ({ lang: '', defaultLang: '' }),
  persist: true, // localStorage에 자동 영속화
});
```

**커스텀 설정:**

```typescript
persist: {
  key: 'my-store',
  storage: sessionStorage,
  paths: ['lang'], // 특정 필드만 영속화
}
```

### 2.2 VueUse의 useSessionStorage / useLocalStorage

```typescript
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // sessionStorage에 자동 영속화
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);
  return { isDarkMode };
});
```

### 2.3 수동 영속화 (비권장)

```typescript
export const useCustomStore = defineStore('custom', {
  state: () => ({ token: '' }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // 수동 저장
    },
  },
});
```

---

## 3. 비교 표

| 방법                  | 장점               | 단점                      | 사용 시나리오                |
| --------------------- | ------------------ | ------------------------- | ---------------------------- |
| **persist: true**     | 자동, 간단         | 전체 state가 영속화됨    | Store 전체 영속화 필요 시    |
| **useSessionStorage** | 유연, 타입 안전    | 개별 정의 필요            | 특정 필드 영속화             |
| **수동 영속화**       | 완전한 제어        | 오류 발생 쉬움, 유지보수 어려움 | 비권장                 |

---

## 4. Store 상태 리셋

### 4.1 Pinia 내장 `$reset()`

```typescript
// Options API Store 지원
const store = useMyStore();
store.$reset(); // 초기 상태로 리셋
```

### 4.2 커스텀 리셋 메서드

```typescript
// Composition API Store
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({
    list: [],
    favoriteList: [],
  });

  function resetGameStore() {
    gameState.list = [];
    gameState.favoriteList = [];
  }

  return { gameState, resetGameStore };
});
```

### 4.3 일괄 리셋 (실제 사례)

```typescript
// src/common/hooks/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  function reset() {
    // 여러 store 리셋
    authStore.$reset();
    userInfoStore.$reset();
    gameStore.resetGameStore();
  }

  async function handleLogout() {
    await api.logout();
    reset(); // 로그아웃 시 모든 상태 리셋
    router.push('/');
  }

  return { reset, handleLogout };
}
```

---

## 5. 베스트 프랙티스

### 5.1 영속화 전략

```typescript
// ✅ 민감한 정보는 영속화하지 않음
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined, // 영속화
    user_password: undefined, // ❌ 절대로 비밀번호를 영속화하지 않음
  }),
  persist: {
    paths: ['access_token'], // token만 영속화
  },
});
```

### 5.2 `$patch`로 일괄 업데이트

```typescript
// ❌ 비권장: 여러 번 업데이트 (여러 반응 트리거)
authStore.access_token = data.access_token;
authStore.user_id = data.user_id;
authStore.agent_id = data.agent_id;

// ✅ 권장: 일괄 업데이트 (한 번의 반응만 트리거)
authStore.$patch({
  access_token: data.access_token,
  user_id: data.user_id,
  agent_id: data.agent_id,
});

// ✅ 함수 형태도 가능
authStore.$patch((state) => {
  state.access_token = data.access_token;
  state.user_id = data.user_id;
  state.agent_id = data.agent_id;
});
```

---

## 6. 면접 핵심 포인트 정리

### 6.1 영속화 방법 선택

**이렇게 답변할 수 있습니다:**

> 프로젝트에서 세 가지 영속화 방법을 사용합니다: 1) `persist: true`, Store 전체가 자동으로 localStorage에 영속화되며 Store 전체가 영속화가 필요한 시나리오에 적합; 2) `useSessionStorage` 또는 `useLocalStorage`, 특정 필드 영속화로 더 유연하고 타입 안전; 3) 수동 영속화, 비권장. 선택에 있어서 민감한 정보는 영속화하지 않고 사용자 설정은 영속화합니다.

**핵심 포인트:**
- ✅ 세 가지 영속화 방법
- ✅ 선택 전략
- ✅ 보안 고려

### 6.2 일괄 업데이트와 리셋

**이렇게 답변할 수 있습니다:**

> Store 상태를 업데이트할 때 `$patch`를 사용하여 일괄 업데이트하며 한 번의 반응만 트리거하여 성능을 향상시킵니다. 상태 리셋 시 Options API Store는 `$reset()`을 사용할 수 있고, Composition API Store는 커스텀 리셋 메서드가 필요합니다. 로그아웃 시 여러 Store를 일괄 리셋하여 상태가 깨끗하게 정리되도록 합니다.

**핵심 포인트:**
- ✅ `$patch` 일괄 업데이트
- ✅ 상태 리셋 방법
- ✅ 일괄 리셋 전략

---

## 7. 면접 총정리

**이렇게 답변할 수 있습니다:**

> 프로젝트에서 Pinia Store 영속화를 구현할 때, `persist: true`로 Store 전체의 자동 영속화를 구현하거나 `useSessionStorage`로 특정 필드의 영속화를 구현합니다. 선택 전략은 민감한 정보는 영속화하지 않고 사용자 설정은 영속화하는 것입니다. 상태 업데이트 시 `$patch`를 사용한 일괄 업데이트로 성능을 향상시킵니다. 상태 리셋 시 Options API는 `$reset()`, Composition API는 커스텀 리셋 메서드를 사용합니다.

**핵심 포인트:**
- ✅ 영속화 방법과 선택
- ✅ 일괄 업데이트 전략
- ✅ 상태 리셋 방법
- ✅ 실제 프로젝트 경험
