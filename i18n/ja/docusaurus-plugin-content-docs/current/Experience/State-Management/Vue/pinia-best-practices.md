---
id: state-management-vue-pinia-best-practices
title: 'Pinia ベストプラクティスとよくあるエラー'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> マルチブランドプラットフォームプロジェクトにおける Pinia Store のベストプラクティスとよくあるエラーの対処法。

---

## 1. 面接回答の主軸

1. **設計原則**: 単一責任の原則、Store をシンプルに保つ、Store 内で直接 API を呼び出さない。
2. **よくあるエラー**: 直接分割代入によるリアクティビティの喪失、Setup 外での Store 呼び出し、State 変更時のリアクティビティ破壊、循環依存。
3. **ベストプラクティス**: TypeScript の使用、責務分離、Composable 内で複数の Store を組み合わせる。

---

## 2. Store 設計原則

### 2.1 単一責任の原則

```typescript
// ✅ 良い設計：各 Store は1つの領域のみ担当
useAuthStore(); // 認証のみ
useUserInfoStore(); // ユーザー情報のみ
useGameStore(); // ゲーム情報のみ

// ❌ 悪い設計：1つの Store ですべてを管理
useAppStore(); // 認証、ユーザー、ゲーム、設定を管理...
```

### 2.2 Store をシンプルに保つ

```typescript
// ✅ 推奨
export const useBannerStore = defineStore('bannerStore', () => {
  const bannerState = reactive({ list: [] });
  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list;
  }
  return { bannerState, setStoreBannerList };
});

// ❌ 非推奨：Store に複雑なビジネスロジックを含む
// Composable に配置すべき
```

### 2.3 Store 内で直接 API を呼び出さない

```typescript
// ❌ 非推奨：Store 内で直接 API を呼び出す
export const useGameStore = defineStore('gameStore', {
  actions: {
    async fetchGames() {
      const data = await api.getGames(); // API 呼び出し
      this.list = data;
    },
  },
});

// ✅ 推奨：Composable 内で API を呼び出し、Store はデータ保存のみ
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
    const { status, data } = await api.getGames(); // Composable 内で API 呼び出し
    if (status) {
      gameStore.setGameList(data); // Store はデータ保存のみ
    }
  }
  return { fetchGames };
}
```

---

## 3. TypeScript の使用

```typescript
// ✅ 完全な型定義
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

## 4. よくあるエラー

### 4.1 エラー 1：直接分割代入によるリアクティビティの喪失

```typescript
// ❌ 間違い
const { count } = useCounterStore();
count; // リアクティブではない

// ✅ 正しい
const { count } = storeToRefs(useCounterStore());
count.value; // リアクティブ
```

### 4.2 エラー 2：Setup 外での Store 呼び出し

```typescript
// ❌ 間違い：モジュールトップレベルで呼び出し
const authStore = useAuthStore(); // ❌ 間違ったタイミング

export function useAuth() {
  return {
    isLogin: authStore.isLogin,
  };
}

// ✅ 正しい：関数内部で呼び出し
export function useAuth() {
  const authStore = useAuthStore(); // ✅ 正しいタイミング
  return {
    isLogin: authStore.isLogin,
  };
}
```

### 4.3 エラー 3：State 変更時のリアクティビティ破壊

```typescript
// ❌ 間違い：新しい配列を直接代入
function updateList(newList) {
  gameState.list = newList; // リアクティビティが失われる可能性
}

// ✅ 正しい：splice または push を使用
function updateList(newList) {
  gameState.list.length = 0;
  gameState.list.push(...newList);
}

// ✅ reactive の代入でも可能
function updateList(newList) {
  Object.assign(gameState, { list: newList });
}
```

### 4.4 エラー 4：循環依存

```typescript
// ❌ 間違い：Store 間の相互依存
// authStore.ts
import { useUserInfoStore } from './userInfoStore';
export const useAuthStore = defineStore('authStore', () => {
  const userInfoStore = useUserInfoStore(); // userInfoStore に依存
});

// userInfoStore.ts
import { useAuthStore } from './authStore';
export const useUserInfoStore = defineStore('useInfoStore', () => {
  const authStore = useAuthStore(); // authStore に依存 ❌ 循環依存
});

// ✅ 正しい：Composable 内で組み合わせ
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

### 4.5 エラー 5：return の忘れ

```typescript
// ❌ 間違い：return を忘れた
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  // ❌ return を忘れ、コンポーネントからアクセスできない
});

// ✅ 正しい
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  return { gameState, updateList }; // ✅ return は必須
});
```

---

## 5. 面接ポイントまとめ

### 5.1 Store 設計原則

**回答例：**

> Pinia Store の設計において、いくつかの原則に従っています：1) 単一責任の原則、各 Store は1つの領域のみ担当；2) Store をシンプルに保ち、複雑なビジネスロジックを含めない；3) Store 内で直接 API を呼び出さず、Composable 内で API を呼び出し、Store はデータ保存のみ担当；4) TypeScript の完全な型定義を使用し、開発体験を向上させる。

**キーポイント：**
- ✅ 単一責任の原則
- ✅ Store をシンプルに
- ✅ 責務分離
- ✅ TypeScript の使用

### 5.2 よくあるエラーと回避方法

**回答例：**

> Pinia を使用する際のよくあるエラーには：1) 直接分割代入によるリアクティビティの喪失、`storeToRefs` を使用する必要がある；2) Setup 外での Store 呼び出し、関数内部で呼び出すべき；3) State 変更時のリアクティビティ破壊、`.length = 0` または `Object.assign` を使用；4) 循環依存、Composable 内で複数の Store を組み合わせる；5) return の忘れ、Composition API Store には return が必須。

**キーポイント：**
- ✅ リアクティビティの維持
- ✅ 正しい呼び出しタイミング
- ✅ State の変更方法
- ✅ 循環依存の回避

---

## 6. 面接総括

**回答例：**

> プロジェクトで Pinia を使用する際、いくつかのベストプラクティスに従っています：1) Store 設計は単一責任の原則に従い、シンプルに保つ；2) Store 内で直接 API を呼び出さず、Composable 内で呼び出す；3) TypeScript の完全な型定義を使用；4) リアクティビティの喪失、循環依存などのよくあるエラーに注意する。これらのプラクティスにより Store の保守性と拡張性を確保しています。

**キーポイント：**
- ✅ Store 設計原則
- ✅ よくあるエラーと回避方法
- ✅ ベストプラクティス
- ✅ 実際のプロジェクト経験
