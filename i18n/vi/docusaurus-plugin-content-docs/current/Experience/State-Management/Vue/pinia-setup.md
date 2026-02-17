---
id: state-management-vue-pinia-setup
title: 'Khởi tạo và Cấu hình Pinia'
slug: /experience/state-management/vue/pinia-setup
tags: [Experience, Interview, State-Management, Vue]
---

> Cấu hình khởi tạo Pinia và thiết kế cấu trúc dự án trong dự án nền tảng đa thương hiệu.

---

## 1. Trục chính trả lời phỏng vấn

1. **Lý do chọn Pinia**: Hỗ trợ TypeScript tốt hơn, API đơn giản hơn, thiết kế module hóa, trải nghiệm phát triển tốt hơn.
2. **Cấu hình khởi tạo**: Sử dụng `piniaPluginPersistedstate` cho lưu trữ bền vững, mở rộng interface `PiniaCustomProperties`.
3. **Cấu trúc dự án**: 30+ Store, quản lý theo phân loại lĩnh vực chức năng.

---

## 2. Tại sao chọn Pinia?

### 2.1 Pinia vs Vuex

**Pinia** là công cụ quản lý trạng thái chính thức cho Vue 3, là phiên bản kế thừa của Vuex, cung cấp API đơn giản hơn và hỗ trợ TypeScript tốt hơn.

**Câu trả lời trọng tâm phỏng vấn**:

1. **Hỗ trợ TypeScript tốt hơn**
   - Pinia cung cấp suy luận kiểu đầy đủ
   - Không cần hàm helper bổ sung (như `mapState`, `mapGetters`)

2. **API đơn giản hơn**
   - Không cần mutations (lớp thao tác đồng bộ trong Vuex)
   - Thực thi thao tác đồng bộ/bất đồng bộ trực tiếp trong actions

3. **Thiết kế module hóa**
   - Không cần module lồng nhau
   - Mỗi Store độc lập

4. **Trải nghiệm phát triển tốt hơn**
   - Hỗ trợ Vue Devtools
   - Hot Module Replacement (HMR)
   - Kích thước nhỏ hơn (khoảng 1KB)

5. **Vue 3 khuyến nghị chính thức**
   - Pinia là công cụ quản lý trạng thái chính thức của Vue 3

### 2.2 Thành phần cốt lõi của Pinia

```typescript
// Ba yếu tố cốt lõi của Store
{
  state: () => ({ ... }),      // Dữ liệu trạng thái
  getters: { ... },            // Thuộc tính tính toán
  actions: { ... }             // Phương thức (đồng bộ/bất đồng bộ)
}
```

**Mối quan hệ tương ứng với Vue component**:
- `state` ≈ `data`
- `getters` ≈ `computed`
- `actions` ≈ `methods`

---

## 3. Cấu hình khởi tạo Pinia

### 3.1 Cấu hình cơ bản

**Vị trí file:** `src/stores/index.ts`

```typescript
import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { Router } from 'vue-router';

// Mở rộng thuộc tính tùy chỉnh của Pinia
declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router;
  }
}

export default store(() => {
  const pinia = createPinia();

  // Đăng ký plugin lưu trữ bền vững
  pinia.use(piniaPluginPersistedstate);

  return pinia;
});
```

**Điểm trọng tâm phỏng vấn**:
- ✅ Sử dụng `piniaPluginPersistedstate` cho lưu trữ bền vững trạng thái
- ✅ Mở rộng interface `PiniaCustomProperties` để tất cả Store có thể truy cập router
- ✅ Tích hợp thông qua `store` wrapper của Quasar

### 3.2 Cấu trúc file Store

```
src/stores/
├── index.ts                    # Cấu hình instance Pinia
├── store-flag.d.ts            # Khai báo kiểu TypeScript
│
├── authStore.ts               # Xác thực
├── userInfoStore.ts           # Thông tin người dùng
├── gameStore.ts               # Thông tin game
├── productStore.ts            # Thông tin sản phẩm
├── languageStore.ts           # Cài đặt ngôn ngữ
├── darkModeStore.ts          # Chế độ giao diện
├── envStore.ts               # Cấu hình môi trường
└── ... (tổng cộng 30+ Store)
```

**Nguyên tắc thiết kế**:
- Mỗi Store chịu trách nhiệm một lĩnh vực chức năng duy nhất
- Quy tắc đặt tên file: `tênChứcNăng + Store.ts`
- Sử dụng định nghĩa kiểu TypeScript đầy đủ

---

## 4. Tổng hợp điểm trọng tâm phỏng vấn

### 4.1 Lý do chọn Pinia

**Có thể trả lời như sau:**

> Trong dự án, chúng tôi chọn Pinia thay vì Vuex chủ yếu vì: 1) Hỗ trợ TypeScript tốt hơn với suy luận kiểu đầy đủ, không cần cấu hình thêm; 2) API đơn giản hơn, không cần mutations, thực thi thao tác đồng bộ/bất đồng bộ trực tiếp trong actions; 3) Thiết kế module hóa, không cần module lồng nhau, mỗi Store độc lập; 4) Trải nghiệm phát triển tốt hơn với Vue Devtools, HMR, kích thước nhỏ hơn; 5) Vue 3 khuyến nghị chính thức.

**Điểm chính:**
- ✅ Hỗ trợ TypeScript
- ✅ Sự đơn giản của API
- ✅ Thiết kế module hóa
- ✅ Trải nghiệm phát triển

### 4.2 Trọng tâm cấu hình khởi tạo

**Có thể trả lời như sau:**

> Khi khởi tạo Pinia, tôi thực hiện một số cấu hình quan trọng: 1) Sử dụng `piniaPluginPersistedstate` cho lưu trữ bền vững trạng thái, cho phép Store tự động lưu vào localStorage; 2) Mở rộng interface `PiniaCustomProperties` để tất cả Store có thể truy cập router, giúp thao tác routing trong actions dễ dàng hơn; 3) Tích hợp thông qua `store` wrapper của Quasar để đảm bảo tính tích hợp với framework.

**Điểm chính:**
- ✅ Cấu hình plugin lưu trữ bền vững
- ✅ Mở rộng thuộc tính tùy chỉnh
- ✅ Tích hợp framework

---

## 5. Tổng kết phỏng vấn

**Có thể trả lời như sau:**

> Trong dự án, tôi sử dụng Pinia làm công cụ quản lý trạng thái. Chọn Pinia vì nó cung cấp hỗ trợ TypeScript tốt hơn, API đơn giản hơn và trải nghiệm phát triển tốt hơn. Trong cấu hình khởi tạo, sử dụng `piniaPluginPersistedstate` cho lưu trữ bền vững và mở rộng `PiniaCustomProperties` để tất cả Store có thể truy cập router. Dự án có 30+ Store, quản lý theo phân loại lĩnh vực chức năng, mỗi Store chịu trách nhiệm một lĩnh vực chức năng duy nhất.

**Điểm chính:**
- ✅ Lý do chọn Pinia
- ✅ Trọng tâm cấu hình khởi tạo
- ✅ Thiết kế cấu trúc dự án
- ✅ Kinh nghiệm dự án thực tế
