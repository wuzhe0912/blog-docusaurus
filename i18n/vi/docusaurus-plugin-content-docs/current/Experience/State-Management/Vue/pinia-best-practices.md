---
id: state-management-vue-pinia-best-practices
title: 'Best Practices và Lỗi Thường Gặp của Pinia'
slug: /experience/state-management/vue/pinia-best-practices
tags: [Experience, Interview, State-Management, Vue]
---

> Best practices và xử lý lỗi thường gặp của Pinia Store trong dự án nền tảng đa thương hiệu.

---

## 1. Trục chính trả lời phỏng vấn

1. **Nguyên tắc thiết kế**: Nguyên tắc đơn trách nhiệm, giữ Store gọn nhẹ, không gọi API trực tiếp trong Store.
2. **Lỗi thường gặp**: Mất tính phản ứng khi destructure trực tiếp, gọi Store ngoài Setup, phá vỡ tính phản ứng khi sửa State, phụ thuộc vòng.
3. **Best practices**: Sử dụng TypeScript, phân tách trách nhiệm, kết hợp nhiều Store trong Composable.

---

## 2. Nguyên tắc thiết kế Store

### 2.1 Nguyên tắc đơn trách nhiệm

```typescript
// ✅ Thiết kế tốt: Mỗi Store chỉ chịu trách nhiệm một lĩnh vực
useAuthStore(); // Chỉ quản lý xác thực
useUserInfoStore(); // Chỉ quản lý thông tin người dùng
useGameStore(); // Chỉ quản lý thông tin game

// ❌ Thiết kế xấu: Một Store quản lý tất cả
useAppStore(); // Quản lý xác thực, người dùng, game, cài đặt...
```

### 2.2 Giữ Store gọn nhẹ

```typescript
// ✅ Khuyến nghị
export const useBannerStore = defineStore('bannerStore', () => {
  const bannerState = reactive({ list: [] });
  function setStoreBannerList(list: Response.BannerList) {
    bannerState.list = list;
  }
  return { bannerState, setStoreBannerList };
});

// ❌ Không khuyến nghị: Store chứa logic nghiệp vụ phức tạp
// Nên đặt trong composable
```

### 2.3 Không gọi API trực tiếp trong Store

```typescript
// ❌ Không khuyến nghị: Gọi API trực tiếp trong Store
export const useGameStore = defineStore('gameStore', {
  actions: {
    async fetchGames() {
      const data = await api.getGames(); // Gọi API
      this.list = data;
    },
  },
});

// ✅ Khuyến nghị: Gọi API trong Composable, Store chỉ lưu trữ
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
    const { status, data } = await api.getGames(); // Gọi API trong Composable
    if (status) {
      gameStore.setGameList(data); // Store chỉ lưu trữ
    }
  }
  return { fetchGames };
}
```

---

## 3. Sử dụng TypeScript

```typescript
// ✅ Định nghĩa kiểu đầy đủ
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

## 4. Lỗi thường gặp

### 4.1 Lỗi 1: Mất tính phản ứng khi destructure trực tiếp

```typescript
// ❌ Sai
const { count } = useCounterStore();
count; // Không phản ứng

// ✅ Đúng
const { count } = storeToRefs(useCounterStore());
count.value; // Phản ứng
```

### 4.2 Lỗi 2: Gọi Store ngoài Setup

```typescript
// ❌ Sai: Gọi ở cấp module
const authStore = useAuthStore(); // ❌ Sai thời điểm

export function useAuth() {
  return {
    isLogin: authStore.isLogin,
  };
}

// ✅ Đúng: Gọi bên trong hàm
export function useAuth() {
  const authStore = useAuthStore(); // ✅ Đúng thời điểm
  return {
    isLogin: authStore.isLogin,
  };
}
```

### 4.3 Lỗi 3: Phá vỡ tính phản ứng khi sửa State

```typescript
// ❌ Sai: Gán trực tiếp mảng mới
function updateList(newList) {
  gameState.list = newList; // Có thể mất tính phản ứng
}

// ✅ Đúng: Dùng splice hoặc push
function updateList(newList) {
  gameState.list.length = 0;
  gameState.list.push(...newList);
}

// ✅ Cũng có thể dùng phép gán reactive
function updateList(newList) {
  Object.assign(gameState, { list: newList });
}
```

### 4.4 Lỗi 4: Phụ thuộc vòng

```typescript
// ❌ Sai: Store phụ thuộc lẫn nhau
// authStore.ts
import { useUserInfoStore } from './userInfoStore';
export const useAuthStore = defineStore('authStore', () => {
  const userInfoStore = useUserInfoStore(); // Phụ thuộc vào userInfoStore
});

// userInfoStore.ts
import { useAuthStore } from './authStore';
export const useUserInfoStore = defineStore('useInfoStore', () => {
  const authStore = useAuthStore(); // Phụ thuộc vào authStore ❌ Phụ thuộc vòng
});

// ✅ Đúng: Kết hợp trong Composable
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

### 4.5 Lỗi 5: Quên return

```typescript
// ❌ Sai: Quên return
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  // ❌ Quên return, component không thể truy cập
});

// ✅ Đúng
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({ list: [] });
  function updateList(list) {
    gameState.list = list;
  }
  return { gameState, updateList }; // ✅ Bắt buộc phải return
});
```

---

## 5. Tổng hợp điểm trọng tâm phỏng vấn

### 5.1 Nguyên tắc thiết kế Store

**Có thể trả lời như sau:**

> Khi thiết kế Pinia Store, tôi tuân theo một số nguyên tắc: 1) Nguyên tắc đơn trách nhiệm, mỗi Store chỉ chịu trách nhiệm một lĩnh vực; 2) Giữ Store gọn nhẹ, không chứa logic nghiệp vụ phức tạp; 3) Không gọi API trực tiếp trong Store, gọi API trong Composable, Store chỉ lưu trữ; 4) Sử dụng định nghĩa kiểu TypeScript đầy đủ để nâng cao trải nghiệm phát triển.

**Điểm chính:**
- ✅ Nguyên tắc đơn trách nhiệm
- ✅ Store gọn nhẹ
- ✅ Phân tách trách nhiệm
- ✅ Sử dụng TypeScript

### 5.2 Lỗi thường gặp và cách tránh

**Có thể trả lời như sau:**

> Các lỗi thường gặp khi sử dụng Pinia bao gồm: 1) Mất tính phản ứng khi destructure trực tiếp, phải dùng `storeToRefs`; 2) Gọi Store ngoài Setup, nên gọi bên trong hàm; 3) Phá vỡ tính phản ứng khi sửa State, dùng `.length = 0` hoặc `Object.assign`; 4) Phụ thuộc vòng, kết hợp nhiều Store trong Composable; 5) Quên return, Store Composition API phải có return.

**Điểm chính:**
- ✅ Duy trì tính phản ứng
- ✅ Thời điểm gọi đúng
- ✅ Phương thức sửa đổi trạng thái
- ✅ Tránh phụ thuộc vòng

---

## 6. Tổng kết phỏng vấn

**Có thể trả lời như sau:**

> Khi sử dụng Pinia trong dự án, tôi tuân theo một số best practices: 1) Thiết kế Store theo nguyên tắc đơn trách nhiệm và giữ gọn nhẹ; 2) Không gọi API trực tiếp trong Store mà gọi trong Composable; 3) Sử dụng định nghĩa kiểu TypeScript đầy đủ; 4) Chú ý đến các lỗi thường gặp như mất tính phản ứng, phụ thuộc vòng, v.v. Những practices này đảm bảo tính bảo trì và khả năng mở rộng của Store.

**Điểm chính:**
- ✅ Nguyên tắc thiết kế Store
- ✅ Lỗi thường gặp và cách tránh
- ✅ Best practices
- ✅ Kinh nghiệm dự án thực tế
