---
id: state-management-vue-pinia-persistence
title: 'Chiến Lược Lưu Trữ Bền Vững Pinia'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> Chiến lược lưu trữ bền vững cho Pinia Store trong dự án nền tảng đa thương hiệu: sử dụng `piniaPluginPersistedstate` và `useSessionStorage` của VueUse.

---

## 1. Trục chính trả lời phỏng vấn

1. **Ba phương pháp lưu trữ bền vững**: `persist: true`, `useSessionStorage`, lưu trữ thủ công.
2. **Chiến lược lựa chọn**: Toàn bộ Store dùng `persist: true`, trường cụ thể dùng `useSessionStorage`.
3. **Cân nhắc bảo mật**: Không lưu trữ bền vững thông tin nhạy cảm, lưu trữ tùy chọn người dùng.

---

## 2. Phương pháp lưu trữ bền vững

### 2.1 Pinia Plugin Persistedstate

**Options API:**

```typescript
export const useLanguageStore = defineStore('languageStore', {
  state: () => ({ lang: '', defaultLang: '' }),
  persist: true, // Tự động lưu trữ vào localStorage
});
```

**Cấu hình tùy chỉnh:**

```typescript
persist: {
  key: 'my-store',
  storage: sessionStorage,
  paths: ['lang'], // Chỉ lưu trữ các trường cụ thể
}
```

### 2.2 useSessionStorage / useLocalStorage của VueUse

```typescript
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // Tự động lưu trữ vào sessionStorage
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);
  return { isDarkMode };
});
```

### 2.3 Lưu trữ thủ công (không khuyến nghị)

```typescript
export const useCustomStore = defineStore('custom', {
  state: () => ({ token: '' }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // Lưu thủ công
    },
  },
});
```

---

## 3. Bảng so sánh

| Phương pháp           | Ưu điểm              | Nhược điểm                     | Trường hợp sử dụng                |
| --------------------- | --------------------- | ------------------------------ | ---------------------------------- |
| **persist: true**     | Tự động, đơn giản    | Toàn bộ state được lưu trữ    | Toàn bộ Store cần lưu trữ bền vững |
| **useSessionStorage** | Linh hoạt, type-safe  | Cần định nghĩa từng cái       | Lưu trữ các trường cụ thể         |
| **Lưu trữ thủ công** | Kiểm soát hoàn toàn  | Dễ lỗi, khó bảo trì           | Không khuyến nghị                  |

---

## 4. Reset trạng thái Store

### 4.1 `$reset()` tích hợp của Pinia

```typescript
// Hỗ trợ Options API Store
const store = useMyStore();
store.$reset(); // Reset về trạng thái ban đầu
```

### 4.2 Phương thức reset tùy chỉnh

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

### 4.3 Reset hàng loạt (trường hợp thực tế)

```typescript
// src/common/hooks/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  function reset() {
    // Reset nhiều store
    authStore.$reset();
    userInfoStore.$reset();
    gameStore.resetGameStore();
  }

  async function handleLogout() {
    await api.logout();
    reset(); // Reset tất cả trạng thái khi đăng xuất
    router.push('/');
  }

  return { reset, handleLogout };
}
```

---

## 5. Best practices

### 5.1 Chiến lược lưu trữ bền vững

```typescript
// ✅ Không lưu trữ bền vững thông tin nhạy cảm
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined, // Lưu trữ bền vững
    user_password: undefined, // ❌ Tuyệt đối không lưu trữ mật khẩu
  }),
  persist: {
    paths: ['access_token'], // Chỉ lưu trữ token
  },
});
```

### 5.2 Cập nhật hàng loạt với `$patch`

```typescript
// ❌ Không khuyến nghị: Nhiều lần cập nhật (kích hoạt nhiều phản ứng)
authStore.access_token = data.access_token;
authStore.user_id = data.user_id;
authStore.agent_id = data.agent_id;

// ✅ Khuyến nghị: Cập nhật hàng loạt (chỉ kích hoạt một phản ứng)
authStore.$patch({
  access_token: data.access_token,
  user_id: data.user_id,
  agent_id: data.agent_id,
});

// ✅ Dạng hàm cũng được
authStore.$patch((state) => {
  state.access_token = data.access_token;
  state.user_id = data.user_id;
  state.agent_id = data.agent_id;
});
```

---

## 6. Tổng hợp điểm trọng tâm phỏng vấn

### 6.1 Lựa chọn phương pháp lưu trữ bền vững

**Có thể trả lời như sau:**

> Trong dự án, tôi sử dụng ba phương pháp lưu trữ bền vững: 1) `persist: true`, toàn bộ Store tự động lưu trữ vào localStorage, phù hợp cho Store cần lưu trữ bền vững toàn bộ; 2) `useSessionStorage` hoặc `useLocalStorage`, lưu trữ trường cụ thể, linh hoạt và type-safe hơn; 3) Lưu trữ thủ công, không khuyến nghị. Trong lựa chọn: thông tin nhạy cảm không lưu trữ bền vững, tùy chọn người dùng thì lưu trữ bền vững.

**Điểm chính:**
- ✅ Ba phương pháp lưu trữ bền vững
- ✅ Chiến lược lựa chọn
- ✅ Cân nhắc bảo mật

### 6.2 Cập nhật hàng loạt và reset

**Có thể trả lời như sau:**

> Khi cập nhật trạng thái Store, sử dụng `$patch` để cập nhật hàng loạt, chỉ kích hoạt một phản ứng để tăng hiệu suất. Khi reset trạng thái, Options API Store có thể dùng `$reset()`, Composition API Store cần phương thức reset tùy chỉnh. Khi đăng xuất, có thể reset nhiều Store hàng loạt để đảm bảo trạng thái được dọn dẹp sạch sẽ.

**Điểm chính:**
- ✅ `$patch` cập nhật hàng loạt
- ✅ Phương pháp reset trạng thái
- ✅ Chiến lược reset hàng loạt

---

## 7. Tổng kết phỏng vấn

**Có thể trả lời như sau:**

> Khi triển khai lưu trữ bền vững Pinia Store trong dự án, tôi sử dụng `persist: true` để tự động lưu trữ toàn bộ Store hoặc `useSessionStorage` để lưu trữ trường cụ thể. Chiến lược lựa chọn là thông tin nhạy cảm không lưu trữ bền vững, tùy chọn người dùng thì lưu trữ bền vững. Khi cập nhật trạng thái, sử dụng `$patch` để cập nhật hàng loạt nhằm tăng hiệu suất. Khi reset trạng thái, Options API dùng `$reset()`, Composition API dùng phương thức reset tùy chỉnh.

**Điểm chính:**
- ✅ Phương pháp lưu trữ bền vững và lựa chọn
- ✅ Chiến lược cập nhật hàng loạt
- ✅ Phương pháp reset trạng thái
- ✅ Kinh nghiệm dự án thực tế
