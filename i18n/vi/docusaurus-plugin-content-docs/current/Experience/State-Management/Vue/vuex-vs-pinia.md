---
id: state-management-vue-vuex-vs-pinia
title: 'So sánh sự khác biệt giữa Vuex và Pinia'
slug: /experience/state-management/vue/vuex-vs-pinia
tags: [Experience, Interview, State-Management, Vue]
---

> So sánh các khác biệt cốt lõi giữa Vuex và Pinia, bao gồm thiết kế API, hỗ trợ TypeScript, cách module hóa, và cung cấp hướng dẫn di chuyển.

---

## 1. Trục trả lời phỏng vấn

1. **Khác biệt cốt lõi**: Vuex cần mutations, Pinia không cần; Pinia hỗ trợ TypeScript tốt hơn; cách module hóa khác nhau.
2. **Khuyến nghị lựa chọn**: Dự án mới Vue 3 nên dùng Pinia, dự án Vue 2 dùng Vuex.
3. **Cân nhắc di chuyển**: Các bước và lưu ý khi di chuyển từ Vuex sang Pinia.

---

## 2. Tổng quan khác biệt cốt lõi

| Đặc điểm             | Vuex                          | Pinia                            |
| --------------------- | ----------------------------- | -------------------------------- |
| **Phiên bản Vue**     | Vue 2                         | Vue 3                            |
| **Độ phức tạp API**   | Phức tạp hơn (cần mutations) | Gọn gàng hơn (không cần mutations) |
| **Hỗ trợ TypeScript** | Cần cấu hình thêm            | Hỗ trợ đầy đủ ngay từ đầu       |
| **Module hóa**        | Module lồng nhau              | Phẳng hóa, mỗi store độc lập    |
| **Kích thước**        | Lớn hơn                      | Nhỏ hơn (khoảng 1KB)            |
| **Trải nghiệm phát triển** | Tốt                     | Tốt hơn (HMR, Devtools)         |

---

## 3. So sánh khác biệt API

### 3.1 Mutations vs Actions

**Vuex**: Cần `mutations` để sửa đổi state đồng bộ

```javascript
// Vuex
export default createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
  },
});
```

**Pinia**: Không cần `mutations`, sửa đổi state trực tiếp trong `actions`

```typescript
// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++; // Sửa đổi trực tiếp
    },
  },
});
```

**Khác biệt chính**:
- **Vuex**: Bắt buộc sửa đổi state đồng bộ thông qua `mutations`, `actions` gọi `mutations` thông qua `commit`
- **Pinia**: Không cần `mutations`, `actions` có thể sửa đổi state trực tiếp (cả đồng bộ lẫn bất đồng bộ đều được)

### 3.2 Định nghĩa State

**Vuex**: `state` có thể là object hoặc function

```javascript
state: {
  count: 0,
}
```

**Pinia**: `state` **bắt buộc phải là function**, tránh chia sẻ trạng thái giữa nhiều instance

```typescript
state: () => ({
  count: 0,
})
```

### 3.3 Getters

**Vuex**: getters nhận `(state, getters)` làm tham số

```javascript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne: (state, getters) => getters.doubleCount + 1,
}
```

**Pinia**: getters có thể dùng `this` để truy cập các getters khác

```typescript
getters: {
  doubleCount: (state) => state.count * 2,
  doubleCountPlusOne(): number {
    return this.doubleCount + 1;
  },
}
```

### 3.4 Sử dụng trong component

**Vuex**: Dùng các hàm hỗ trợ `mapState`, `mapGetters`, `mapActions`

```javascript
computed: {
  ...mapState(['count']),
  ...mapGetters(['doubleCount']),
},
methods: {
  ...mapActions(['increment']),
}
```

**Pinia**: Dùng trực tiếp instance của store, dùng `storeToRefs` để giữ tính phản ứng

```typescript
const store = useCounterStore();
const { count, doubleCount } = storeToRefs(store);
const { increment } = store;
```

---

## 4. Khác biệt module hóa

### 4.1 Vuex Modules (Module lồng nhau)

**Vuex**: Dùng module lồng nhau, cần `namespaced: true`

```javascript
// stores/user.js
export default {
  namespaced: true,
  state: { name: 'John' },
  mutations: {
    SET_NAME(state, name) {
      state.name = name;
    },
  },
};

// Sử dụng trong component
this.$store.dispatch('user/SET_NAME', 'Jane'); // Cần tiền tố namespace
```

### 4.2 Pinia Stores (Phẳng hóa)

**Pinia**: Mỗi store đều độc lập, không cần lồng nhau

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  state: () => ({ name: 'John' }),
  actions: {
    setName(name: string) {
      this.name = name;
    },
  },
});

// Sử dụng trong component
const userStore = useUserStore();
userStore.setName('Jane'); // Gọi trực tiếp, không cần namespace
```

**Khác biệt chính**:
- **Vuex**: Cần module lồng nhau, dùng `namespaced: true`, khi gọi cần tiền tố namespace
- **Pinia**: Mỗi store độc lập, không cần namespace, gọi trực tiếp

---

## 5. Khác biệt hỗ trợ TypeScript

### 5.1 Hỗ trợ TypeScript của Vuex

**Vuex**: Cần cấu hình kiểu dữ liệu thêm

```typescript
// stores/types.ts
export interface State {
  count: number;
  user: { name: string; age: number };
}

// stores/index.ts
import { createStore, Store } from 'vuex';
import { State } from './types';

export default createStore<State>({
  state: { count: 0, user: { name: 'John', age: 30 } },
});

// Sử dụng trong component
const store = useStore<State>();
// Cần định nghĩa kiểu dữ liệu thủ công, không có suy luận kiểu đầy đủ
```

### 5.2 Hỗ trợ TypeScript của Pinia

**Pinia**: Hỗ trợ đầy đủ ngay từ đầu, tự động suy luận kiểu dữ liệu

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    user: { name: 'John', age: 30 },
  }),
  getters: {
    doubleCount: (state) => state.count * 2, // Tự động suy luận kiểu
  },
  actions: {
    increment() {
      this.count++; // Suy luận kiểu đầy đủ và tự động hoàn thành
    },
  },
});

// Sử dụng trong component
const store = useCounterStore();
store.count; // Suy luận kiểu đầy đủ
store.doubleCount; // Suy luận kiểu đầy đủ
store.increment(); // Suy luận kiểu đầy đủ
```

**Khác biệt chính**:
- **Vuex**: Cần định nghĩa kiểu dữ liệu thủ công, suy luận kiểu không đầy đủ
- **Pinia**: Hỗ trợ đầy đủ ngay từ đầu, tự động suy luận kiểu, trải nghiệm phát triển tốt hơn

---

## 6. Hướng dẫn di chuyển

### 6.1 Các bước di chuyển cơ bản

1. **Cài đặt Pinia**

```bash
npm install pinia
```

2. **Thay thế Vuex Store**

```javascript
// Vuex cũ
import { createStore } from 'vuex';
export default createStore({ ... });

// Pinia mới
import { createPinia } from 'pinia';
const pinia = createPinia();
app.use(pinia);
```

3. **Chuyển đổi định nghĩa Store**

```javascript
// Vuex
export default createStore({
  state: { count: 0 },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
  },
});

// Pinia
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

4. **Cập nhật cách sử dụng trong component**

```javascript
// Vuex
import { mapState, mapActions } from 'vuex';
computed: { ...mapState(['count']) },
methods: { ...mapActions(['increment']) },

// Pinia
import { storeToRefs } from 'pinia';
const store = useCounterStore();
const { count } = storeToRefs(store);
const { increment } = store;
```

### 6.2 Các vấn đề thường gặp khi di chuyển

**Vấn đề 1: Xử lý Vuex modules như thế nào?**

```javascript
// Vuex modules
modules: {
  user: userModule,
  product: productModule,
}

// Pinia: Mỗi module trở thành một store độc lập
// stores/user.ts
export const useUserStore = defineStore('user', { ... });

// stores/product.ts
export const useProductStore = defineStore('product', { ... });
```

**Vấn đề 2: Xử lý namespace như thế nào?**

```javascript
// Vuex: Cần tiền tố namespace
this.$store.dispatch('user/SET_NAME', 'John');

// Pinia: Gọi trực tiếp, không cần namespace
const userStore = useUserStore();
userStore.setName('John');
```

---

## 7. Tại sao Pinia không cần mutations?

**Lý do**:

1. **Hệ thống phản ứng của Vue 3**
   - Vue 3 sử dụng Proxy, có thể theo dõi trực tiếp việc sửa đổi object
   - Không cần thông qua mutations để theo dõi thay đổi trạng thái như Vue 2

2. **Đơn giản hóa API**
   - Loại bỏ mutations giúp đơn giản hóa API, giảm mã boilerplate
   - Actions có thể sửa đổi state trực tiếp, dù là thao tác đồng bộ hay bất đồng bộ

3. **Trải nghiệm phát triển**
   - Giảm một tầng trừu tượng, lập trình viên dễ hiểu và sử dụng hơn
   - Không cần nhớ sự khác biệt giữa `commit` và `dispatch`

**Ví dụ**:

```typescript
// Vuex: Cần mutations
mutations: { SET_COUNT(state, count) { state.count = count; } },
actions: { setCount({ commit }, count) { commit('SET_COUNT', count); } },

// Pinia: Sửa đổi trực tiếp
actions: { setCount(count) { this.count = count; } },
```

---

## 8. Nên chọn Vuex hay Pinia?

**Khuyến nghị lựa chọn**:

1. **Dự án mới**
   - Dự án Vue 3: **Khuyến nghị dùng Pinia**
   - Dự án Vue 2: Dùng Vuex

2. **Dự án hiện có**
   - Vue 2 + Vuex: Có thể tiếp tục dùng Vuex, hoặc cân nhắc nâng cấp lên Vue 3 + Pinia
   - Vue 3 + Vuex: Có thể cân nhắc di chuyển sang Pinia (nhưng không bắt buộc)

3. **Yêu cầu dự án**
   - Cần hỗ trợ TypeScript đầy đủ: **Chọn Pinia**
   - Cần API gọn gàng hơn: **Chọn Pinia**
   - Đội ngũ quen thuộc với Vuex: Có thể tiếp tục dùng Vuex

**Tóm tắt**:
- Dự án mới Vue 3: **Rất khuyến nghị dùng Pinia**
- Dự án Vue 2: Dùng Vuex
- Dự án Vue 3 + Vuex hiện có: Có thể cân nhắc di chuyển, nhưng không bắt buộc

---

## 9. Tổng hợp trọng điểm phỏng vấn

### 9.1 Khác biệt cốt lõi

**Có thể trả lời như sau:**

> Vuex và Pinia đều là công cụ quản lý trạng thái của Vue, các khác biệt chính bao gồm: 1) Độ phức tạp API: Vuex cần mutations để sửa đổi state đồng bộ, Pinia không cần mutations, actions có thể sửa đổi state trực tiếp; 2) Hỗ trợ TypeScript: Vuex cần cấu hình thêm, suy luận kiểu không đầy đủ, Pinia hỗ trợ đầy đủ ngay từ đầu, tự động suy luận kiểu; 3) Module hóa: Vuex dùng module lồng nhau, cần namespaced, Pinia mỗi store độc lập, không cần namespace; 4) Trải nghiệm phát triển: Pinia kích thước nhỏ hơn, hỗ trợ HMR, hỗ trợ Devtools tốt hơn; 5) Phiên bản Vue: Vuex chủ yếu dùng cho Vue 2, Pinia là khuyến nghị chính thức của Vue 3. Đối với dự án mới Vue 3, tôi khuyến nghị dùng Pinia.

**Điểm chính:**
- ✅ Khác biệt độ phức tạp API
- ✅ Khác biệt hỗ trợ TypeScript
- ✅ Khác biệt cách module hóa
- ✅ Khuyến nghị lựa chọn

### 9.2 Tại sao Pinia không cần mutations?

**Có thể trả lời như sau:**

> Pinia không cần mutations chủ yếu vì ba lý do: 1) Vue 3 sử dụng Proxy làm hệ thống phản ứng, có thể theo dõi trực tiếp việc sửa đổi object, không cần thông qua mutations để theo dõi thay đổi trạng thái như Vue 2; 2) Đơn giản hóa API, loại bỏ mutations giúp giảm mã boilerplate, actions có thể sửa đổi state trực tiếp, dù là thao tác đồng bộ hay bất đồng bộ; 3) Nâng cao trải nghiệm phát triển, giảm một tầng trừu tượng, lập trình viên dễ hiểu và sử dụng hơn, không cần nhớ sự khác biệt giữa commit và dispatch.

**Điểm chính:**
- ✅ Hệ thống phản ứng Vue 3
- ✅ Đơn giản hóa API
- ✅ Nâng cao trải nghiệm phát triển

---

## 10. Tổng kết phỏng vấn

**Có thể trả lời như sau:**

> Khác biệt chính giữa Vuex và Pinia nằm ở thiết kế API, hỗ trợ TypeScript và cách module hóa. Vuex cần mutations, Pinia không cần; Pinia hỗ trợ TypeScript tốt hơn; Vuex dùng module lồng nhau, Pinia dùng thiết kế phẳng hóa. Đối với dự án mới Vue 3, tôi khuyến nghị dùng Pinia vì nó mang lại trải nghiệm phát triển tốt hơn và API gọn gàng hơn. Nếu dự án cần di chuyển từ Vuex sang Pinia, các bước chính là loại bỏ mutations, chuyển đổi modules thành các stores độc lập, và cập nhật cách sử dụng trong component.

**Điểm chính:**
- ✅ Tóm tắt khác biệt cốt lõi
- ✅ Khuyến nghị lựa chọn
- ✅ Hướng dẫn di chuyển
- ✅ Kinh nghiệm dự án thực tế

## Reference

- [Tài liệu chính thức Vuex](https://vuex.vuejs.org/)
- [Tài liệu chính thức Pinia](https://pinia.vuejs.org/)
- [Di chuyển từ Vuex sang Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)
