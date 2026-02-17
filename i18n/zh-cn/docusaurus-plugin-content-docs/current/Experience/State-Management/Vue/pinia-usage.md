---
id: state-management-vue-pinia-usage
title: 'Pinia 使用实践'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> 在多品牌平台项目中，Pinia Store 在组件和 Composables 中的使用方式，以及 Store 之间的通讯模式。

---

## 1. 面试回答主轴

1. **组件使用**：使用 `storeToRefs` 保持响应性，Actions 可以直接解构。
2. **Composables 组合**：在 Composables 中组合多个 Store，封装业务逻辑。
3. **Store 通讯**：推荐在 Composable 中组合，避免循环依赖。

---

## 2. 在组件中使用 Store

### 2.1 基本使用

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';

// 直接使用 store 实例
const authStore = useAuthStore();

// 访问 state
console.log(authStore.access_token);

// 调用 action
authStore.setToptVerified(true);

// 访问 getter
console.log(authStore.isLogin);
</script>
```

### 2.2 使用 `storeToRefs` 解构（重要！）

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

// ❌ 错误：会失去响应性
const { access_token, isLogin } = authStore;

// ✅ 正确：保持响应性
const { access_token, isLogin } = storeToRefs(authStore);

// ✅ Actions 可以直接解构（不需要 storeToRefs）
const { setToptVerified } = authStore;
</script>
```

**为什么直接解构会失去响应性？**

- Pinia 的 state 和 getters 是响应式的
- 直接解构会破坏响应式连接
- `storeToRefs` 会将每个属性转换为 `ref`，保持响应性
- Actions 本身不是响应式的，所以可以直接解构

---

## 3. 在 Composables 中使用 Store

### 3.1 实际案例：useGame.ts

Composables 是组合 Store 逻辑的最佳场所。

```typescript
import { useGameStore } from 'stores/gameStore';
import { useProductStore } from 'stores/productStore';
import { storeToRefs } from 'pinia';

export function useGame() {
  // 1️⃣ 引入多个 stores
  const gameStore = useGameStore();
  const productStore = useProductStore();

  // 2️⃣ 解构 state 和 getters（使用 storeToRefs）
  const { gameState } = storeToRefs(gameStore);
  const { productState } = storeToRefs(productStore);

  // 3️⃣ 解构 actions（直接解构）
  const { initAllGameList, updateAllGameList } = gameStore;

  // 4️⃣ 组合逻辑
  async function initGameTypeList() {
    const { status, data } = await useApi(getGameTypes);
    if (status) {
      setGameTypeList(data.list);
      setGameTypeMap(data.map);
    }
  }

  // 5️⃣ 返回给组件使用
  return {
    gameState,
    productState,
    initGameTypeList,
    initAllGameList,
  };
}
```

**面试重点**：
- Composables 是组合 Store 逻辑的最佳场所
- 使用 `storeToRefs` 确保响应性
- Actions 可以直接解构
- 将复杂的业务逻辑封装在 composable 中

---

## 4. Store 之间的通讯

### 4.1 方法一：在 Store 内部调用其他 Store

```typescript
import { defineStore } from 'pinia';
import { useUserInfoStore } from './userInfoStore';

export const useAuthStore = defineStore('authStore', {
  actions: {
    async login(credentials) {
      const { status, data } = await api.login(credentials);
      if (status) {
        this.access_token = data.access_token;

        // 调用其他 store 的方法
        const userInfoStore = useUserInfoStore();
        userInfoStore.setStoreUserInfo(data.user);
      }
    },
  },
});
```

### 4.2 方法二：在 Composable 中组合多个 Store（推荐）

```typescript
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  async function initialize() {
    // 依序执行多个 store 的初始化
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
      await gameStore.initGameList();
    }
  }

  return { initialize };
}
```

**面试重点**：
- ✅ 推荐在 Composable 中组合多个 Store
- ❌ 避免 Store 之间的循环依赖
- 保持 Store 的单一职责原则

---

## 5. 实战案例：用户登入流程

这是一个完整的 Store 使用流程，涵盖了多个 Store 的协作。

### 5.1 流程图

```
用户点击登入按钮
     ↓
调用 useAuth().handleLogin()
     ↓
API 请求登入
     ↓
成功 → authStore 储存 token
     ↓
useUserInfo().getUserInfo()
     ↓
userInfoStore 储存用户信息
     ↓
useGame().initGameList()
     ↓
gameStore 储存游戏列表
     ↓
跳转到首页
```

### 5.2 程序代码实作

```typescript
// 1️⃣ authStore.ts - 管理认证状态
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined as string | undefined,
    user_id: undefined as number | undefined,
  }),
  getters: {
    isLogin: (state) => !!state.access_token,
  },
  persist: true, // 持久化认证信息
});

// 2️⃣ userInfoStore.ts - 管理用户信息
export const useUserInfoStore = defineStore('useInfoStore', {
  state: () => ({
    info: {} as Response.UserInfo,
  }),
  actions: {
    setStoreUserInfo(userInfo: Response.UserInfo) {
      this.info = userInfo;
    },
  },
  persist: false, // 不持久化（敏感信息）
});

// 3️⃣ useAuth.ts - 组合认证逻辑
export function useAuth() {
  const authStore = useAuthStore();
  const { access_token } = storeToRefs(authStore);
  const { isLogin } = storeToRefs(authStore);

  async function handleLogin(credentials: LoginCredentials) {
    const { status, data } = await api.login(credentials);
    if (status) {
      // 更新 authStore
      authStore.$patch({
        access_token: data.access_token,
        user_id: data.user_id,
      });
      return true;
    }
    return false;
  }

  return {
    access_token,
    isLogin,
    handleLogin,
  };
}

// 4️⃣ LoginPage.vue - 登入页面
<script setup lang="ts">
import { useAuth } from 'src/common/hooks/useAuth';
import { useUserInfo } from 'src/common/composables/useUserInfo';
import { useGame } from 'src/common/composables/useGame';
import { useRouter } from 'vue-router';

const { handleLogin } = useAuth();
const { getUserInfo } = useUserInfo();
const { initGameList } = useGame();
const router = useRouter();

const onSubmit = async (formData: LoginForm) => {
  // 步骤 1: 登入
  const success = await handleLogin(formData);
  if (success) {
    // 步骤 2: 获取用户信息
    await getUserInfo();
    // 步骤 3: 初始化游戏列表
    await initGameList();
    // 步骤 4: 跳转首页
    router.push('/');
  }
};
</script>
```

**面试重点**：

1. **职责分离**
   - `authStore`: 只管理认证状态
   - `userInfoStore`: 只管理用户信息
   - `useAuth`: 封装认证相关业务逻辑
   - `useUserInfo`: 封装用户信息相关业务逻辑

2. **响应式数据流**
   - 使用 `storeToRefs` 保持响应性
   - Store 更新会自动触发组件更新

3. **持久化策略**
   - `authStore` 持久化（用户刷新页面后保持登入）
   - `userInfoStore` 不持久化（安全考量）

---

## 6. 面试重点整理

### 6.1 storeToRefs 的使用

**可以这样回答：**

> 在组件中使用 Pinia Store 时，如果要解构 state 和 getters，必须使用 `storeToRefs` 保持响应性。直接解构会破坏响应式连接，因为 Pinia 的 state 和 getters 是响应式的。`storeToRefs` 会将每个属性转换为 `ref`，保持响应性。Actions 可以直接解构，不需要 `storeToRefs`，因为它们本身不是响应式的。

**关键点：**
- ✅ `storeToRefs` 的作用
- ✅ 为什么需要 `storeToRefs`
- ✅ Actions 可以直接解构

### 6.2 Store 之间通讯

**可以这样回答：**

> Store 之间的通讯有两种方式：1) 在 Store 内部调用其他 Store，但要注意避免循环依赖；2) 在 Composable 中组合多个 Store，这是推荐的方式。最佳实践是保持 Store 的单一职责原则，将复杂的业务逻辑封装在 Composable 中，避免 Store 之间的直接依赖。

**关键点：**
- ✅ 两种通讯方式
- ✅ 推荐在 Composable 中组合
- ✅ 避免循环依赖

---

## 7. 面试总结

**可以这样回答：**

> 在项目中使用 Pinia Store 时，有几个关键实践：1) 在组件中使用 `storeToRefs` 解构 state 和 getters，保持响应性；2) 在 Composables 中组合多个 Store，封装业务逻辑；3) Store 之间的通讯推荐在 Composable 中组合，避免循环依赖；4) 保持 Store 的单一职责原则，将复杂逻辑放在 Composable 中。

**关键点：**
- ✅ `storeToRefs` 的使用
- ✅ Composables 组合 Store
- ✅ Store 通讯模式
- ✅ 职责分离原则
