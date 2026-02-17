---
id: state-management-vue-pinia-store-patterns
title: 'Pinia Store 구현 패턴'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> 멀티 브랜드 플랫폼 프로젝트에서 Options API와 Composition API 두 가지 방식으로 Pinia Store를 구현하고, 시나리오에 따라 적합한 패턴을 선택합니다.

---

## 1. 면접 답변 핵심 축

1. **두 가지 작성 방식**: Options API와 Composition API, 시나리오에 따라 선택.
2. **선택 전략**: 간단한 Store는 Composition API, 영속화가 필요한 경우 Options API, 복잡한 로직은 Composition API.
3. **주요 차이점**: State는 함수여야 함, Actions의 `this`는 Store 인스턴스를 가리킴, Getters의 두 가지 작성 방식.

---

## 2. Options API (전통적 방식)

### 2.1 기본 구조

```typescript
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';
import { computed } from 'vue';

type State = Response.login & {
  onBoarding: boolean;
  totpStatus: Response.GetTotpStatus;
};

export const useAuthStore = defineStore('authStore', {
  // 1️⃣ State: 상태 정의
  state: (): Partial<State> => ({
    access_token: undefined,
    agent_id: undefined,
    user_id: undefined,
    onBoarding: false,
    totpStatus: undefined,
  }),

  // 2️⃣ Actions: 메서드 정의
  actions: {
    setTotpStatus(data: Response.GetTotpStatus) {
      this.totpStatus = data;
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status;
    },
  },

  // 3️⃣ Getters: 계산 속성 정의
  getters: {
    isLogin: (state) => !!state.access_token,
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) =>
      computed(() => state.totpStatus?.is_enabled ?? false),
  },

  // 4️⃣ 영속화 설정
  persist: true, // localStorage에 자동 영속화
});
```

### 2.2 핵심 포인트

**1. State는 함수여야 함**

```typescript
// ✅ 올바른 방법
state: () => ({ count: 0 });

// ❌ 잘못된 방법 (여러 인스턴스가 상태를 공유하게 됨)
state: {
  count: 0;
}
```

**2. Actions의 `this`는 Store 인스턴스를 가리킴**

```typescript
actions: {
  increment() {
    this.count++; // State 직접 수정
  },
};
```

**3. Getters의 두 가지 작성 방식**

```typescript
getters: {
  // 방법 1: 값을 직접 반환 (권장)
  doubleCount: (state) => state.count * 2,

  // 방법 2: computed 반환 (반응형 업데이트)
  tripleCount: (state) => computed(() => state.count * 3),
};
```

---

## 3. Composition API / Setup (현대적 방식)

### 3.1 간단한 Store 예시

```typescript
import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // 📦 State
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);

  // 🔧 Actions
  const updateIsDarkMode = (status: boolean) => {
    isDarkMode.value = status;
  };

  // 📤 Export
  return {
    isDarkMode,
    updateIsDarkMode,
  };
});
```

**면접 핵심 포인트**:
- `@vueuse/core`의 `useSessionStorage`를 사용한 영속화
- Composition API 방식에 더 가까움
- 모든 `ref` 또는 `reactive`는 State
- 모든 함수는 Actions
- 모든 `computed`는 Getters

### 3.2 복잡한 Store 예시

```typescript
import { reactive } from 'vue';
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';

type GameState = {
  list: Response.GameList;
  allGameList: Response.AllGameList;
  favoriteList: Response.FavoriteList;
  favoriteMap: Response.FavoriteMap;
};

export const useGameStore = defineStore('gameStore', () => {
  // 📦 State (reactive 사용)
  const gameState = reactive<GameState>({
    list: [],
    allGameList: {
      FISHING: [],
      LIVE_CASINO: [],
      SLOT: [],
    },
    favoriteList: [],
    favoriteMap: {},
  });

  // 🔧 Actions
  function updateAllGameList(data: Response.AllGameList) {
    gameState.allGameList.FISHING = data.FISHING;
    gameState.allGameList.LIVE_CASINO = data.LIVE_CASINO;
    gameState.allGameList.SLOT = data.SLOT;
  }

  function updateFavoriteList(data: Response.FavoriteList) {
    gameState.favoriteList = data;
    gameState.favoriteMap = {};
    data.forEach((gameId) => {
      gameState.favoriteMap[gameId] = true;
    });
  }

  function removeFavoriteList() {
    gameState.favoriteList.length = 0; // 반응성 유지
    gameState.favoriteMap = {};
  }

  // 📤 Export
  return {
    gameState,
    updateAllGameList,
    updateFavoriteList,
    removeFavoriteList,
  };
});
```

**핵심 포인트**:

**1. `reactive` vs `ref` 사용**

```typescript
// 📌 reactive 사용 (복잡한 객체에 권장)
const state = reactive({
  count: 0,
  user: { name: 'John' },
});
state.count++; // 직접 접근

// 📌 ref 사용 (기본 타입에 권장)
const count = ref(0);
count.value++; // .value 필요
```

**2. 왜 `.length = 0`으로 배열을 비우는가?**

```typescript
// ✅ 반응성 유지 (권장)
gameState.favoriteList.length = 0;

// ❌ 반응성 손실
gameState.favoriteList = [];
```

---

## 4. 두 가지 방식 비교

| 특성                | Options API              | Composition API (Setup)            |
| ------------------- | ------------------------ | ---------------------------------- |
| **구문 스타일**     | 객체 설정                | 함수형                             |
| **학습 곡선**       | 낮음 (Vue 2와 유사)      | 높음 (Composition API 이해 필요)   |
| **TypeScript 지원** | 좋음                     | 더 좋음                            |
| **유연성**          | 중간                     | 높음 (로직 자유 조합)              |
| **가독성**          | 구조가 명확              | 좋은 정리 필요                     |
| **권장 시나리오**   | 간단한 Store             | 복잡한 로직, 기능 조합             |

**프로젝트의 선택 전략**:
- **간단한 Store (State < 5개)**: Composition API
- **영속화가 필요한 Store**: Options API + `persist: true`
- **복잡한 비즈니스 로직**: Composition API (더 유연)
- **Getter가 필요한 Store**: Options API (구문이 더 명확)

---

## 5. 면접 핵심 포인트 정리

### 5.1 두 가지 방식의 선택

**이렇게 답변할 수 있습니다:**

> 프로젝트에서 Options API와 Composition API 두 가지 Store 정의 방식을 사용합니다. Options API는 객체 설정을 사용하고 Vue 2와 유사한 구문으로 학습 곡선이 낮으며 간단한 Store와 영속화가 필요한 Store에 적합합니다. Composition API는 함수형 방식으로 더 유연하고 TypeScript 지원이 더 좋으며 복잡한 로직에 적합합니다. 선택 전략: 간단한 Store는 Composition API, 영속화가 필요한 경우 Options API, 복잡한 비즈니스 로직은 Composition API.

**핵심 포인트:**
- ✅ 두 가지 방식의 차이점
- ✅ 선택 전략
- ✅ 실제 프로젝트 경험

### 5.2 핵심 기술 포인트

**이렇게 답변할 수 있습니다:**

> Store를 구현할 때 몇 가지 핵심 기술 포인트가 있습니다: 1) State는 함수여야 하며, 여러 인스턴스의 상태 공유를 방지; 2) Actions의 `this`는 Store 인스턴스를 가리키며 State를 직접 수정 가능; 3) Getters는 두 가지 방식이 있으며 값을 직접 반환하거나 computed를 반환 가능; 4) 복잡한 객체에는 `reactive`, 기본 타입에는 `ref` 사용; 5) 배열 비우기에 `.length = 0`을 사용하여 반응성 유지.

**핵심 포인트:**
- ✅ State는 함수여야 함
- ✅ Actions에서 `this` 사용
- ✅ Getters 작성 방식
- ✅ reactive vs ref
- ✅ 반응성 유지

---

## 6. 면접 총정리

**이렇게 답변할 수 있습니다:**

> 프로젝트에서 Options API와 Composition API 두 가지 방식으로 Pinia Store를 구현합니다. Options API는 간단한 Store와 영속화가 필요한 Store에 적합하며 구문이 명확합니다. Composition API는 복잡한 로직에 적합하며 더 유연하고 TypeScript 지원도 더 좋습니다. 선택 전략은 Store의 복잡도와 요구 사항에 따라 결정합니다. 핵심 기술 포인트로는 State는 함수여야 함, Actions에서 `this` 사용, Getters의 두 가지 방식, 반응성 유지가 포함됩니다.

**핵심 포인트:**
- ✅ 두 가지 방식의 차이점과 선택
- ✅ 핵심 기술 포인트
- ✅ 실제 프로젝트 경험
