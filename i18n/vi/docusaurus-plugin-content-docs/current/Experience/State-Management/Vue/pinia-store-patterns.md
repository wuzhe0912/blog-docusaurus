---
id: state-management-vue-pinia-store-patterns
title: 'Các Mẫu Triển Khai Pinia Store'
slug: /experience/state-management/vue/pinia-store-patterns
tags: [Experience, Interview, State-Management, Vue]
---

> Trong dự án nền tảng đa thương hiệu, triển khai Pinia Store bằng hai cách viết Options API và Composition API, chọn mẫu phù hợp theo từng tình huống.

---

## 1. Trục chính trả lời phỏng vấn

1. **Hai cách viết**: Options API và Composition API, chọn theo tình huống.
2. **Chiến lược lựa chọn**: Store đơn giản dùng Composition API, cần lưu trữ bền vững dùng Options API, logic phức tạp dùng Composition API.
3. **Điểm khác biệt chính**: State phải là hàm, `this` trong Actions trỏ đến instance Store, hai cách viết Getters.

---

## 2. Options API (Cách viết truyền thống)

### 2.1 Cấu trúc cơ bản

```typescript
import { defineStore } from 'pinia';
import type * as Response from 'src/api/response.type';
import { computed } from 'vue';

type State = Response.login & {
  onBoarding: boolean;
  totpStatus: Response.GetTotpStatus;
};

export const useAuthStore = defineStore('authStore', {
  // 1️⃣ State: Định nghĩa trạng thái
  state: (): Partial<State> => ({
    access_token: undefined,
    agent_id: undefined,
    user_id: undefined,
    onBoarding: false,
    totpStatus: undefined,
  }),

  // 2️⃣ Actions: Định nghĩa phương thức
  actions: {
    setTotpStatus(data: Response.GetTotpStatus) {
      this.totpStatus = data;
    },
    setToptVerified(status: boolean) {
      this.toptVerified = status;
    },
  },

  // 3️⃣ Getters: Định nghĩa thuộc tính tính toán
  getters: {
    isLogin: (state) => !!state.access_token,
    isOnBoarding: (state) => computed(() => state.onBoarding ?? false),
    isToptEnabled: (state) =>
      computed(() => state.totpStatus?.is_enabled ?? false),
  },

  // 4️⃣ Cấu hình lưu trữ bền vững
  persist: true, // Tự động lưu trữ vào localStorage
});
```

### 2.2 Điểm quan trọng

**1. State phải là hàm**

```typescript
// ✅ Đúng
state: () => ({ count: 0 });

// ❌ Sai (nhiều instance sẽ chia sẻ trạng thái)
state: {
  count: 0;
}
```

**2. `this` trong Actions trỏ đến instance Store**

```typescript
actions: {
  increment() {
    this.count++; // Sửa trực tiếp State
  },
};
```

**3. Hai cách viết Getters**

```typescript
getters: {
  // Cách 1: Trả về giá trị trực tiếp (khuyến nghị)
  doubleCount: (state) => state.count * 2,

  // Cách 2: Trả về computed (cập nhật phản ứng)
  tripleCount: (state) => computed(() => state.count * 3),
};
```

---

## 3. Composition API / Setup (Cách viết hiện đại)

### 3.1 Ví dụ Store đơn giản

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

**Điểm trọng tâm phỏng vấn**:
- Sử dụng `useSessionStorage` của `@vueuse/core` cho lưu trữ bền vững
- Gần hơn với cách viết Composition API
- Tất cả `ref` hoặc `reactive` là State
- Tất cả hàm là Actions
- Tất cả `computed` là Getters

### 3.2 Ví dụ Store phức tạp

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
  // 📦 State (dùng reactive)
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
    gameState.favoriteList.length = 0; // Giữ tính phản ứng
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

**Điểm quan trọng**:

**1. Sử dụng `reactive` vs `ref`**

```typescript
// 📌 Dùng reactive (khuyến nghị cho object phức tạp)
const state = reactive({
  count: 0,
  user: { name: 'John' },
});
state.count++; // Truy cập trực tiếp

// 📌 Dùng ref (khuyến nghị cho kiểu nguyên thủy)
const count = ref(0);
count.value++; // Cần .value
```

**2. Tại sao dùng `.length = 0` để xóa mảng?**

```typescript
// ✅ Giữ tính phản ứng (khuyến nghị)
gameState.favoriteList.length = 0;

// ❌ Mất tính phản ứng
gameState.favoriteList = [];
```

---

## 4. So sánh hai cách viết

| Đặc điểm             | Options API              | Composition API (Setup)            |
| --------------------- | ------------------------ | ---------------------------------- |
| **Phong cách cú pháp** | Cấu hình đối tượng     | Hàm                               |
| **Đường cong học tập** | Thấp hơn (giống Vue 2) | Cao hơn (cần hiểu Composition API) |
| **Hỗ trợ TypeScript** | Tốt                     | Tốt hơn                           |
| **Tính linh hoạt**    | Trung bình               | Cao (tự do tổ hợp logic)          |
| **Tính dễ đọc**       | Cấu trúc rõ ràng        | Cần tổ chức tốt                   |
| **Tình huống khuyến nghị** | Store đơn giản      | Logic phức tạp, tổ hợp chức năng  |

**Chiến lược lựa chọn của dự án**:
- **Store đơn giản (< 5 state)**: Composition API
- **Store cần lưu trữ bền vững**: Options API + `persist: true`
- **Logic nghiệp vụ phức tạp**: Composition API (linh hoạt hơn)
- **Store cần Getter**: Options API (cú pháp rõ ràng hơn)

---

## 5. Tổng hợp điểm trọng tâm phỏng vấn

### 5.1 Lựa chọn giữa hai cách viết

**Có thể trả lời như sau:**

> Trong dự án, tôi sử dụng hai phương pháp định nghĩa Store: Options API và Composition API. Options API dùng cấu hình đối tượng, cú pháp giống Vue 2, đường cong học tập thấp hơn, phù hợp cho Store đơn giản và Store cần lưu trữ bền vững. Composition API dùng cách viết hàm, linh hoạt hơn, hỗ trợ TypeScript tốt hơn, phù hợp cho logic phức tạp. Chiến lược lựa chọn: Store đơn giản dùng Composition API, cần lưu trữ bền vững dùng Options API, logic nghiệp vụ phức tạp dùng Composition API.

**Điểm chính:**
- ✅ Sự khác biệt giữa hai cách viết
- ✅ Chiến lược lựa chọn
- ✅ Kinh nghiệm dự án thực tế

### 5.2 Điểm kỹ thuật chính

**Có thể trả lời như sau:**

> Khi triển khai Store, có một số điểm kỹ thuật chính: 1) State phải là hàm, tránh chia sẻ trạng thái giữa nhiều instance; 2) `this` trong Actions trỏ đến instance Store, có thể sửa State trực tiếp; 3) Getters có hai cách viết, có thể trả về giá trị trực tiếp hoặc trả về computed; 4) Dùng `reactive` cho object phức tạp, `ref` cho kiểu nguyên thủy; 5) Xóa mảng bằng `.length = 0` để giữ tính phản ứng.

**Điểm chính:**
- ✅ State phải là hàm
- ✅ Sử dụng `this` trong Actions
- ✅ Cách viết Getters
- ✅ reactive vs ref
- ✅ Giữ tính phản ứng

---

## 6. Tổng kết phỏng vấn

**Có thể trả lời như sau:**

> Trong dự án, tôi sử dụng Options API và Composition API hai cách viết để triển khai Pinia Store. Options API phù hợp cho Store đơn giản và Store cần lưu trữ bền vững, cú pháp rõ ràng. Composition API phù hợp cho logic phức tạp, linh hoạt hơn và hỗ trợ TypeScript tốt hơn. Chiến lược lựa chọn dựa trên độ phức tạp và yêu cầu của Store. Điểm kỹ thuật chính bao gồm: State phải là hàm, sử dụng `this` trong Actions, hai cách viết Getters và giữ tính phản ứng.

**Điểm chính:**
- ✅ Sự khác biệt và lựa chọn giữa hai cách viết
- ✅ Điểm kỹ thuật chính
- ✅ Kinh nghiệm dự án thực tế
