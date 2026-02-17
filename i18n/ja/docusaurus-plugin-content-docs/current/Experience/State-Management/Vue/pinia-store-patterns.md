---
id: state-management-vue-pinia-store-patterns
title: 'Pinia Store 実装パターン'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> マルチブランドプラットフォームプロジェクトにおいて、Options API と Composition API の2つの書き方で Pinia Store を実装し、シナリオに応じて適切なパターンを選択。

---

## 1. 面接回答の主軸

1. **2つの書き方**: Options API と Composition API、シナリオに応じて選択。
2. **選択戦略**: シンプルな Store は Composition API、永続化が必要な場合は Options API、複雑なロジックは Composition API。
3. **主要な違い**: State は関数でなければならない、Actions の `this` は Store インスタンスを指す、Getters の2つの書き方。

---

## 2. Options API（従来の書き方）

### 2.1 基本構造

```typescript
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';
import { computed } from 'vue';

type State = Response.login & {
  onBoarding: boolean;
  totpStatus: Response.GetTotpStatus;
};

export const useAuthStore = defineStore('authStore', {
  // 1️⃣ State: 状態を定義
  state: (): Partial<State> => ({
    access_token: undefined,
    agent_id: undefined,
    user_id: undefined,
    onBoarding: false,
    totpStatus: undefined,
  }),

  // 2️⃣ Actions: メソッドを定義
  actions: {
    setTotpStatus(data: Response.GetTotpStatus) {
      this.totpStatus = data;
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status;
    },
  },

  // 3️⃣ Getters: 計算プロパティを定義
  getters: {
    isLogin: (state) => !!state.access_token,
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) =>
      computed(() => state.totpStatus?.is_enabled ?? false),
  },

  // 4️⃣ 永続化設定
  persist: true, // localStorage に自動永続化
});
```

### 2.2 重要ポイント

**1. State は関数でなければならない**

```typescript
// ✅ 正しい
state: () => ({ count: 0 });

// ❌ 間違い（複数インスタンスで状態が共有される）
state: {
  count: 0;
}
```

**2. Actions の `this` は Store インスタンスを指す**

```typescript
actions: {
  increment() {
    this.count++; // State を直接変更
  },
};
```

**3. Getters の2つの書き方**

```typescript
getters: {
  // 方法1: 値を直接返す（推奨）
  doubleCount: (state) => state.count * 2,

  // 方法2: computed を返す（リアクティブ更新）
  tripleCount: (state) => computed(() => state.count * 3),
};
```

---

## 3. Composition API / Setup（モダンな書き方）

### 3.1 シンプルな Store の例

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

**面接重点**:
- `@vueuse/core` の `useSessionStorage` を使用して永続化
- Composition API の書き方により近い
- すべての `ref` や `reactive` は State
- すべての関数は Actions
- すべての `computed` は Getters

### 3.2 複雑な Store の例

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
  // 📦 State（reactive を使用）
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
    gameState.favoriteList.length = 0; // リアクティビティを維持
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

**重要ポイント**:

**1. `reactive` vs `ref` の使い分け**

```typescript
// 📌 reactive を使用（複雑なオブジェクトに推奨）
const state = reactive({
  count: 0,
  user: { name: 'John' },
});
state.count++; // 直接アクセス

// 📌 ref を使用（プリミティブ型に推奨）
const count = ref(0);
count.value++; // .value が必要
```

**2. なぜ `.length = 0` で配列をクリアするのか？**

```typescript
// ✅ リアクティビティを維持（推奨）
gameState.favoriteList.length = 0;

// ❌ リアクティビティが失われる
gameState.favoriteList = [];
```

---

## 4. 2つの書き方の比較

| 特性                | Options API              | Composition API (Setup)            |
| ------------------- | ------------------------ | ---------------------------------- |
| **構文スタイル**    | オブジェクト設定         | 関数型                             |
| **学習曲線**        | 低い（Vue 2 に類似）     | 高い（Composition API の理解が必要） |
| **TypeScript サポート** | 良好                 | より良い                           |
| **柔軟性**          | 中程度                   | 高い（ロジックの自由な組み合わせ） |
| **可読性**          | 構造が明確               | 良い整理が必要                     |
| **推奨シナリオ**    | シンプルな Store          | 複雑なロジック、機能の組み合わせ   |

**プロジェクトの選択戦略**:
- **シンプルな Store（State < 5個）**: Composition API
- **永続化が必要な Store**: Options API + `persist: true`
- **複雑なビジネスロジック**: Composition API（より柔軟）
- **Getter が必要な Store**: Options API（構文がより明確）

---

## 5. 面接ポイントまとめ

### 5.1 2つの書き方の選択

**回答例：**

> プロジェクトでは Options API と Composition API の2つの Store 定義方法を使用しています。Options API はオブジェクト設定を使用し、Vue 2 に似た構文で学習曲線が低く、シンプルな Store や永続化が必要な Store に適しています。Composition API は関数型の書き方でより柔軟、TypeScript サポートがより良く、複雑なロジックに適しています。選択戦略は：シンプルな Store は Composition API、永続化が必要な場合は Options API、複雑なビジネスロジックは Composition API です。

**キーポイント：**
- ✅ 2つの書き方の違い
- ✅ 選択戦略
- ✅ 実際のプロジェクト経験

### 5.2 技術的な重要ポイント

**回答例：**

> Store を実装する際、いくつかの技術的な重要ポイントがあります：1) State は関数でなければならない、複数インスタンスでの状態共有を避ける；2) Actions の `this` は Store インスタンスを指し、State を直接変更可能；3) Getters には2つの書き方があり、値を直接返すか computed を返す；4) 複雑なオブジェクトには `reactive`、プリミティブ型には `ref` を使用；5) 配列のクリアには `.length = 0` を使用してリアクティビティを維持。

**キーポイント：**
- ✅ State は関数でなければならない
- ✅ Actions での `this` の使用
- ✅ Getters の書き方
- ✅ reactive vs ref
- ✅ リアクティビティの維持

---

## 6. 面接総括

**回答例：**

> プロジェクトでは Options API と Composition API の2つの書き方で Pinia Store を実装しています。Options API はシンプルな Store や永続化が必要な Store に適しており、構文が明確です。Composition API は複雑なロジックに適しており、より柔軟で TypeScript サポートもより良いです。選択戦略は Store の複雑さと要件に基づいて決定します。技術的な重要ポイントには：State は関数でなければならない、Actions での `this` の使用、Getters の2つの書き方、リアクティビティの維持が含まれます。

**キーポイント：**
- ✅ 2つの書き方の違いと選択
- ✅ 技術的な重要ポイント
- ✅ 実際のプロジェクト経験
