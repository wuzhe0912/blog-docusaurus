---
id: state-management-vue-pinia-usage
title: 'Thực hành sử dụng Pinia'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> Trong dự án nền tảng đa thương hiệu, cách sử dụng Pinia Store trong component và Composables, cũng như các mô hình giao tiếp giữa các Store.

---

## 1. Trục trả lời phỏng vấn

1. **Sử dụng trong component**: Dùng `storeToRefs` để giữ tính phản ứng, Actions có thể destructure trực tiếp.
2. **Kết hợp Composables**: Kết hợp nhiều Store trong Composables, đóng gói logic nghiệp vụ.
3. **Giao tiếp Store**: Khuyến nghị kết hợp trong Composable, tránh phụ thuộc vòng.

---

## 2. Sử dụng Store trong component

### 2.1 Sử dụng cơ bản

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';

// Sử dụng trực tiếp instance của store
const authStore = useAuthStore();

// Truy cập state
console.log(authStore.access_token);

// Gọi action
authStore.setToptVerified(true);

// Truy cập getter
console.log(authStore.isLogin);
</script>
```

### 2.2 Destructure bằng `storeToRefs` (Quan trọng!)

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

// ❌ Sai: Sẽ mất tính phản ứng
const { access_token, isLogin } = authStore;

// ✅ Đúng: Giữ được tính phản ứng
const { access_token, isLogin } = storeToRefs(authStore);

// ✅ Actions có thể destructure trực tiếp (không cần storeToRefs)
const { setToptVerified } = authStore;
</script>
```

**Tại sao destructure trực tiếp lại mất tính phản ứng?**

- State và getters của Pinia có tính phản ứng (reactive)
- Destructure trực tiếp sẽ phá vỡ kết nối phản ứng
- `storeToRefs` sẽ chuyển đổi mỗi thuộc tính thành `ref`, giữ được tính phản ứng
- Actions bản thân không phải là reactive, nên có thể destructure trực tiếp

---

## 3. Sử dụng Store trong Composables

### 3.1 Ví dụ thực tế: useGame.ts

Composables là nơi tốt nhất để kết hợp logic Store.

```typescript
import { useGameStore } from 'stores/gameStore';
import { useProductStore } from 'stores/productStore';
import { storeToRefs } from 'pinia';

export function useGame() {
  // 1️⃣ Import nhiều stores
  const gameStore = useGameStore();
  const productStore = useProductStore();

  // 2️⃣ Destructure state và getters (dùng storeToRefs)
  const { gameState } = storeToRefs(gameStore);
  const { productState } = storeToRefs(productStore);

  // 3️⃣ Destructure actions (destructure trực tiếp)
  const { initAllGameList, updateAllGameList } = gameStore;

  // 4️⃣ Kết hợp logic
  async function initGameTypeList() {
    const { status, data } = await useApi(getGameTypes);
    if (status) {
      setGameTypeList(data.list);
      setGameTypeMap(data.map);
    }
  }

  // 5️⃣ Trả về cho component sử dụng
  return {
    gameState,
    productState,
    initGameTypeList,
    initAllGameList,
  };
}
```

**Điểm trọng tâm phỏng vấn**:
- Composables là nơi tốt nhất để kết hợp logic Store
- Dùng `storeToRefs` để đảm bảo tính phản ứng
- Actions có thể destructure trực tiếp
- Đóng gói logic nghiệp vụ phức tạp trong composable

---

## 4. Giao tiếp giữa các Store

### 4.1 Cách 1: Gọi Store khác bên trong Store

```typescript
import { defineStore } from 'pinia';
import { useUserInfoStore } from './userInfoStore';

export const useAuthStore = defineStore('authStore', {
  actions: {
    async login(credentials) {
      const { status, data } = await api.login(credentials);
      if (status) {
        this.access_token = data.access_token;

        // Gọi phương thức của store khác
        const userInfoStore = useUserInfoStore();
        userInfoStore.setStoreUserInfo(data.user);
      }
    },
  },
});
```

### 4.2 Cách 2: Kết hợp nhiều Store trong Composable (Khuyến nghị)

```typescript
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  async function initialize() {
    // Thực thi khởi tạo nhiều store theo thứ tự
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
      await gameStore.initGameList();
    }
  }

  return { initialize };
}
```

**Điểm trọng tâm phỏng vấn**:
- ✅ Khuyến nghị kết hợp nhiều Store trong Composable
- ❌ Tránh phụ thuộc vòng giữa các Store
- 🎯 Giữ nguyên tắc đơn trách nhiệm của Store

---

## 5. Ví dụ thực chiến: Luồng đăng nhập người dùng

Đây là một luồng sử dụng Store hoàn chỉnh, bao gồm sự phối hợp của nhiều Store.

### 5.1 Sơ đồ luồng

```
Người dùng nhấn nút đăng nhập
     ↓
Gọi useAuth().handleLogin()
     ↓
API yêu cầu đăng nhập
     ↓
Thành công → authStore lưu trữ token
     ↓
useUserInfo().getUserInfo()
     ↓
userInfoStore lưu trữ thông tin người dùng
     ↓
useGame().initGameList()
     ↓
gameStore lưu trữ danh sách trò chơi
     ↓
Chuyển hướng đến trang chủ
```

### 5.2 Triển khai mã nguồn

```typescript
// 1️⃣ authStore.ts - Quản lý trạng thái xác thực
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined as string | undefined,
    user_id: undefined as number | undefined,
  }),
  getters: {
    isLogin: (state) => !!state.access_token,
  },
  persist: true, // Lưu trữ bền vững thông tin xác thực
});

// 2️⃣ userInfoStore.ts - Quản lý thông tin người dùng
export const useUserInfoStore = defineStore('useInfoStore', {
  state: () => ({
    info: {} as Response.UserInfo,
  }),
  actions: {
    setStoreUserInfo(userInfo: Response.UserInfo) {
      this.info = userInfo;
    },
  },
  persist: false, // Không lưu trữ bền vững (thông tin nhạy cảm)
});

// 3️⃣ useAuth.ts - Kết hợp logic xác thực
export function useAuth() {
  const authStore = useAuthStore();
  const { access_token } = storeToRefs(authStore);
  const { isLogin } = storeToRefs(authStore);

  async function handleLogin(credentials: LoginCredentials) {
    const { status, data } = await api.login(credentials);
    if (status) {
      // Cập nhật authStore
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

// 4️⃣ LoginPage.vue - Trang đăng nhập
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
  // Bước 1: Đăng nhập
  const success = await handleLogin(formData);
  if (success) {
    // Bước 2: Lấy thông tin người dùng
    await getUserInfo();
    // Bước 3: Khởi tạo danh sách trò chơi
    await initGameList();
    // Bước 4: Chuyển hướng trang chủ
    router.push('/');
  }
};
</script>
```

**Điểm trọng tâm phỏng vấn**:

1. **Phân tách trách nhiệm**
   - `authStore`: Chỉ quản lý trạng thái xác thực
   - `userInfoStore`: Chỉ quản lý thông tin người dùng
   - `useAuth`: Đóng gói logic nghiệp vụ liên quan đến xác thực
   - `useUserInfo`: Đóng gói logic nghiệp vụ liên quan đến thông tin người dùng

2. **Luồng dữ liệu phản ứng**
   - Dùng `storeToRefs` để giữ tính phản ứng
   - Khi Store cập nhật sẽ tự động kích hoạt cập nhật component

3. **Chiến lược lưu trữ bền vững**
   - `authStore` lưu trữ bền vững (giữ trạng thái đăng nhập khi người dùng làm mới trang)
   - `userInfoStore` không lưu trữ bền vững (vì lý do bảo mật)

---

## 6. Tổng hợp điểm trọng tâm phỏng vấn

### 6.1 Sử dụng storeToRefs

**Bạn có thể trả lời như sau:**

> Khi sử dụng Pinia Store trong component, nếu muốn destructure state và getters, bắt buộc phải dùng `storeToRefs` để giữ tính phản ứng. Destructure trực tiếp sẽ phá vỡ kết nối phản ứng, vì state và getters của Pinia có tính phản ứng. `storeToRefs` sẽ chuyển đổi mỗi thuộc tính thành `ref`, giữ được tính phản ứng. Actions có thể destructure trực tiếp, không cần `storeToRefs`, vì bản thân chúng không phải là reactive.

**Điểm mấu chốt:**
- ✅ Tác dụng của `storeToRefs`
- ✅ Tại sao cần `storeToRefs`
- ✅ Actions có thể destructure trực tiếp

### 6.2 Giao tiếp giữa các Store

**Bạn có thể trả lời như sau:**

> Giao tiếp giữa các Store có hai cách: 1) Gọi Store khác bên trong Store, nhưng cần chú ý tránh phụ thuộc vòng; 2) Kết hợp nhiều Store trong Composable, đây là cách được khuyến nghị. Thực hành tốt nhất là giữ nguyên tắc đơn trách nhiệm của Store, đóng gói logic nghiệp vụ phức tạp trong Composable, tránh phụ thuộc trực tiếp giữa các Store.

**Điểm mấu chốt:**
- ✅ Hai cách giao tiếp
- ✅ Khuyến nghị kết hợp trong Composable
- ✅ Tránh phụ thuộc vòng

---

## 7. Tổng kết phỏng vấn

**Bạn có thể trả lời như sau:**

> Khi sử dụng Pinia Store trong dự án, có một số thực hành quan trọng: 1) Trong component dùng `storeToRefs` để destructure state và getters, giữ tính phản ứng; 2) Trong Composables kết hợp nhiều Store, đóng gói logic nghiệp vụ; 3) Giao tiếp giữa các Store khuyến nghị kết hợp trong Composable, tránh phụ thuộc vòng; 4) Giữ nguyên tắc đơn trách nhiệm của Store, đặt logic phức tạp trong Composable.

**Điểm mấu chốt:**
- ✅ Sử dụng `storeToRefs`
- ✅ Composables kết hợp Store
- ✅ Mô hình giao tiếp Store
- ✅ Nguyên tắc phân tách trách nhiệm
