---
id: state-management-vue-pinia-best-practices
title: 'Pinia 베스트 프랙티스 및 흔한 오류'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> 멀티 브랜드 플랫폼 프로젝트에서의 Pinia Store 베스트 프랙티스와 흔한 오류 처리.

---

## 1. 면접 답변 핵심 축

1. **설계 원칙**: 단일 책임 원칙, Store 간결하게 유지, Store에서 직접 API 호출 금지.
2. **흔한 오류**: 직접 구조 분해로 인한 반응성 손실, Setup 외부에서 Store 호출, State 수정 시 반응성 파괴, 순환 의존성.
3. **베스트 프랙티스**: TypeScript 사용, 책임 분리, Composable에서 여러 Store 조합.

---

## 2. Store 설계 원칙

### 2.1 단일 책임 원칙

```typescript
// ✅ 좋은 설계: 각 Store는 하나의 영역만 담당
useAuthStore(); // 인증만 관리
useUserInfoStore(); // 사용자 정보만 관리
useGameStore(); // 게임 정보만 관리

// ❌ 나쁜 설계: 하나의 Store가 모든 것을 관리
useAppStore(); // 인증, 사용자, 게임, 설정 관리...
```

### 2.2 Store 간결하게 유지

```typescript
// ✅ 권장
export const useBannerStore = defineStore('bannerStore', () => {
  const bannerState = reactive({ list: [] });
  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list;
  }
  return { bannerState, setStoreBannerList };
});

// ❌ 비권장: Store에 복잡한 비즈니스 로직 포함
// Composable에 배치해야 함
```

### 2.3 Store에서 직접 API 호출 금지

```typescript
// ❌ 비권장: Store에서 직접 API 호출
export const useGameStore = defineStore('gameStore', {
  actions: {
    async fetchGames() {
      const data = await api.getGames(); // API 호출
      this.list = data;
    },
  },
});

// ✅ 권장: Composable에서 API 호출, Store는 저장만 담당
export const useGameStore = defineStore('gameStore', {
  actions: {
    setGameList(list: Game[]) {
      this.list = list;
    },
  },
});

export function useGame() {
  const gameStore = useGameStore();
  async function fetchGames() {
    const { status, data } = await api.getGames(); // Composable에서 API 호출
    if (status) {
      gameStore.setGameList(data); // Store는 저장만 담당
    }
  }
  return { fetchGames };
}
```

---

## 3. TypeScript 사용

```typescript
// ✅ 완전한 타입 정의
type UserState = {
  info: Response.UserInfo;
  walletList: Response.UserWalletList;
};

export const useUserInfoStore = defineStore('useInfoStore', () => {
  const state = reactive<UserState>({
    info: {} as Response.UserInfo,
    walletList: [],
  });
  return { state };
});
```

---

## 4. 흔한 오류

### 4.1 오류 1: 직접 구조 분해로 인한 반응성 손실

```typescript
// ❌ 잘못된 방법
const { count } = useCounterStore();
count; // 반응형이 아님

// ✅ 올바른 방법
const { count } = storeToRefs(useCounterStore());
count.value; // 반응형
```

### 4.2 오류 2: Setup 외부에서 Store 호출

```typescript
// ❌ 잘못된 방법: 모듈 최상위에서 호출
const authStore = useAuthStore(); // ❌ 잘못된 타이밍

export function useAuth() {
  return {
    isLogin: authStore.isLogin,
  };
}

// ✅ 올바른 방법: 함수 내부에서 호출
export function useAuth() {
  const authStore = useAuthStore(); // ✅ 올바른 타이밍
  return {
    isLogin: authStore.isLogin,
  };
}
```

### 4.3 오류 3: State 수정 시 반응성 파괴

```typescript
// ❌ 잘못된 방법: 새 배열 직접 할당
function updateList(newList) {
  gameState.list = newList; // 반응성이 사라질 수 있음
}

// ✅ 올바른 방법: splice 또는 push 사용
function updateList(newList) {
  gameState.list.length = 0;
  gameState.list.push(...newList);
}

// ✅ reactive의 할당도 가능
function updateList(newList) {
  Object.assign(gameState, { list: newList });
}
```

### 4.4 오류 4: 순환 의존성

```typescript
// ❌ 잘못된 방법: Store 간 상호 의존
// authStore.ts
import { useUserInfoStore } from './userInfoStore';
export const useAuthStore = defineStore('authStore', () => {
  const userInfoStore = useUserInfoStore(); // userInfoStore에 의존
});

// userInfoStore.ts
import { useAuthStore } from './authStore';
export const useUserInfoStore = defineStore('useInfoStore', () => {
  const authStore = useAuthStore(); // authStore에 의존 ❌ 순환 의존성
});

// ✅ 올바른 방법: Composable에서 조합
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  async function initialize() {
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
    }
  }
  return { initialize };
}
```

### 4.5 오류 5: return 빠뜨림

```typescript
// ❌ 잘못된 방법: return을 빠뜨림
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  // ❌ return을 빠뜨려서 컴포넌트에서 접근 불가
});

// ✅ 올바른 방법
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  return { gameState, updateList }; // ✅ return 필수
});
```

---

## 5. 면접 핵심 포인트 정리

### 5.1 Store 설계 원칙

**이렇게 답변할 수 있습니다:**

> Pinia Store를 설계할 때 몇 가지 원칙을 따릅니다: 1) 단일 책임 원칙, 각 Store는 하나의 영역만 담당; 2) Store를 간결하게 유지하고 복잡한 비즈니스 로직을 포함하지 않음; 3) Store에서 직접 API를 호출하지 않고 Composable에서 API를 호출하며 Store는 저장만 담당; 4) TypeScript의 완전한 타입 정의를 사용하여 개발 경험을 향상시킵니다.

**핵심 포인트:**
- ✅ 단일 책임 원칙
- ✅ Store 간결하게 유지
- ✅ 책임 분리
- ✅ TypeScript 사용

### 5.2 흔한 오류와 회피 방법

**이렇게 답변할 수 있습니다:**

> Pinia를 사용할 때 흔한 오류에는: 1) 직접 구조 분해로 인한 반응성 손실, `storeToRefs`를 사용해야 함; 2) Setup 외부에서 Store 호출, 함수 내부에서 호출해야 함; 3) State 수정 시 반응성 파괴, `.length = 0` 또는 `Object.assign` 사용; 4) 순환 의존성, Composable에서 여러 Store를 조합; 5) return 빠뜨림, Composition API Store는 반드시 return이 필요합니다.

**핵심 포인트:**
- ✅ 반응성 유지
- ✅ 올바른 호출 타이밍
- ✅ 상태 수정 방법
- ✅ 순환 의존성 회피

---

## 6. 면접 총정리

**이렇게 답변할 수 있습니다:**

> 프로젝트에서 Pinia를 사용할 때 몇 가지 베스트 프랙티스를 따릅니다: 1) Store 설계는 단일 책임 원칙을 따르고 간결하게 유지; 2) Store에서 직접 API를 호출하지 않고 Composable에서 호출; 3) TypeScript의 완전한 타입 정의 사용; 4) 반응성 손실, 순환 의존성 등 흔한 오류에 주의. 이러한 프랙티스로 Store의 유지보수성과 확장성을 보장합니다.

**핵심 포인트:**
- ✅ Store 설계 원칙
- ✅ 흔한 오류와 회피 방법
- ✅ 베스트 프랙티스
- ✅ 실제 프로젝트 경험
