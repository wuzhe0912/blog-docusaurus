---
id: state-management-vue-pinia-persistence
title: 'Pinia 永続化戦略'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> マルチブランドプラットフォームプロジェクトにおける Pinia Store の永続化戦略：`piniaPluginPersistedstate` と VueUse の `useSessionStorage` の使用。

---

## 1. 面接回答の主軸

1. **3つの永続化方法**: `persist: true`、`useSessionStorage`、手動永続化。
2. **選択戦略**: Store 全体の永続化には `persist: true`、特定フィールドには `useSessionStorage`。
3. **セキュリティの考慮**: 機密情報は永続化しない、ユーザー設定は永続化する。

---

## 2. 永続化方法

### 2.1 Pinia Plugin Persistedstate

**Options API：**

```typescript
export const useLanguageStore = defineStore('languageStore', {
  state: () => ({ lang: '', defaultLang: '' }),
  persist: true, // localStorage に自動永続化
});
```

**カスタム設定：**

```typescript
persist: {
  key: 'my-store',
  storage: sessionStorage,
  paths: ['lang'], // 特定フィールドのみ永続化
}
```

### 2.2 VueUse の useSessionStorage / useLocalStorage

```typescript
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // sessionStorage に自動永続化
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);
  return { isDarkMode };
});
```

### 2.3 手動永続化（非推奨）

```typescript
export const useCustomStore = defineStore('custom', {
  state: () => ({ token: '' }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // 手動保存
    },
  },
});
```

---

## 3. 比較表

| 方法                  | メリット         | デメリット               | 使用シーン                 |
| --------------------- | ---------------- | ------------------------ | -------------------------- |
| **persist: true**     | 自動、シンプル   | State 全体が永続化される | Store 全体の永続化が必要   |
| **useSessionStorage** | 柔軟、型安全     | 個別に定義が必要         | 特定フィールドの永続化     |
| **手動永続化**        | 完全制御         | エラーが起きやすい、保守困難 | 非推奨                 |

---

## 4. Store 状態のリセット

### 4.1 Pinia 組み込みの `$reset()`

```typescript
// Options API Store でサポート
const store = useMyStore();
store.$reset(); // 初期状態にリセット
```

### 4.2 カスタムリセットメソッド

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

### 4.3 一括リセット（実際のケース）

```typescript
// src/common/hooks/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  function reset() {
    // 複数の Store をリセット
    authStore.$reset();
    userInfoStore.$reset();
    gameStore.resetGameStore();
  }

  async function handleLogout() {
    await api.logout();
    reset(); // ログアウト時にすべての状態をリセット
    router.push('/');
  }

  return { reset, handleLogout };
}
```

---

## 5. ベストプラクティス

### 5.1 永続化戦略

```typescript
// ✅ 機密情報は永続化しない
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined, // 永続化する
    user_password: undefined, // ❌ パスワードは絶対に永続化しない
  }),
  persist: {
    paths: ['access_token'], // Token のみ永続化
  },
});
```

### 5.2 `$patch` による一括更新

```typescript
// ❌ 非推奨：複数回の更新（複数の反応をトリガー）
authStore.access_token = data.access_token;
authStore.user_id = data.user_id;
authStore.agent_id = data.agent_id;

// ✅ 推奨：一括更新（1回の反応のみトリガー）
authStore.$patch({
  access_token: data.access_token,
  user_id: data.user_id,
  agent_id: data.agent_id,
});

// ✅ 関数形式も使用可能
authStore.$patch((state) => {
  state.access_token = data.access_token;
  state.user_id = data.user_id;
  state.agent_id = data.agent_id;
});
```

---

## 6. 面接ポイントまとめ

### 6.1 永続化方法の選択

**回答例：**

> プロジェクトでは3つの永続化方法を使用しています：1) `persist: true`、Store 全体が自動的に localStorage に永続化され、Store 全体の永続化が必要な場合に適しています；2) `useSessionStorage` または `useLocalStorage`、特定フィールドの永続化でより柔軟かつ型安全；3) 手動永続化、非推奨。選択においては、機密情報は永続化せず、ユーザー設定は永続化します。

**キーポイント：**
- ✅ 3つの永続化方法
- ✅ 選択戦略
- ✅ セキュリティの考慮

### 6.2 一括更新とリセット

**回答例：**

> Store 状態を更新する際は `$patch` による一括更新を使用し、1回の反応のみトリガーしてパフォーマンスを向上させます。状態のリセットには、Options API Store は `$reset()` を使用でき、Composition API Store はカスタムリセットメソッドが必要です。ログアウト時には複数の Store を一括でリセットし、状態が確実にクリーンアップされるようにします。

**キーポイント：**
- ✅ `$patch` 一括更新
- ✅ 状態リセットの方法
- ✅ 一括リセット戦略

---

## 7. 面接総括

**回答例：**

> プロジェクトで Pinia Store の永続化を実装する際、`persist: true` で Store 全体の自動永続化、または `useSessionStorage` で特定フィールドの永続化を実現しています。選択戦略は機密情報は永続化せず、ユーザー設定は永続化します。状態更新時は `$patch` による一括更新でパフォーマンスを向上させます。状態リセットには Options API は `$reset()`、Composition API はカスタムリセットメソッドを使用します。

**キーポイント：**
- ✅ 永続化方法と選択
- ✅ 一括更新戦略
- ✅ 状態リセットの方法
- ✅ 実際のプロジェクト経験
