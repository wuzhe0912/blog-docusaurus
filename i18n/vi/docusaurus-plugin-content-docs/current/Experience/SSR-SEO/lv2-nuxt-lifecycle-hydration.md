---
title: '[Lv2] Nuxt 3 Lifecycle và Nguyên lý Hydration'
slug: /experience/ssr-seo/lv2-nuxt-lifecycle-hydration
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Hiểu sâu về Lifecycle, State Management và cơ chế Hydration của Nuxt 3, tránh các vấn đề Hydration Mismatch thường gặp.

---

## 1. Trọng tâm trả lời phỏng vấn

1. **Sự khác biệt về Lifecycle**: Phân biệt các Hook chạy phía Server-side và Client-side. `setup` chạy ở cả hai phía, `onMounted` chỉ chạy ở phía Client.
2. **Quản lý trạng thái**: Hiểu sự khác biệt giữa `useState` và `ref` trong kịch bản SSR. `useState` có thể đồng bộ trạng thái giữa Server và Client, tránh Hydration Mismatch.
3. **Cơ chế Hydration**: Giải thích Hydration biến HTML tĩnh thành ứng dụng tương tác như thế nào, và các nguyên nhân Mismatch phổ biến (cấu trúc HTML không nhất quán, nội dung ngẫu nhiên, v.v.).

---

## 2. Server-side vs Client-side Lifecycle

### 2.1 Môi trường thực thi của Lifecycle Hooks

Trong Nuxt 3 (Vue 3 SSR), các Hook khác nhau sẽ chạy trong các môi trường khác nhau:

| Lifecycle Hook | Server-side | Client-side | Giải thích |
|----------------|-------------|-------------|------------|
| **setup()** | ✅ Chạy | ✅ Chạy | Logic khởi tạo component. **Lưu ý: Tránh sử dụng API chỉ dành cho Client (như window, document) trong setup**. |
| **onBeforeMount** | ❌ Không chạy | ✅ Chạy | Trước khi mount. |
| **onMounted** | ❌ Không chạy | ✅ Chạy | Mount hoàn tất. **Thao tác DOM, gọi Browser API nên đặt ở đây**. |
| **onBeforeUpdate** | ❌ Không chạy | ✅ Chạy | Trước khi cập nhật dữ liệu. |
| **onUpdated** | ❌ Không chạy | ✅ Chạy | Sau khi cập nhật dữ liệu. |
| **onBeforeUnmount** | ❌ Không chạy | ✅ Chạy | Trước khi unmount. |
| **onUnmounted** | ❌ Không chạy | ✅ Chạy | Sau khi unmount. |

### 2.2 Câu hỏi phỏng vấn phổ biến: onMounted có chạy ở phía Server không?

**Trả lời:**
Không. `onMounted` chỉ chạy ở phía Client (trình duyệt). Quá trình render phía Server chỉ chịu trách nhiệm tạo ra chuỗi HTML, không thực hiện việc mount DOM.

**Câu hỏi mở rộng: Nếu cần thực thi logic cụ thể ở phía Server thì làm thế nào?**
- Sử dụng `setup()` hoặc `useAsyncData` / `useFetch`.
- Nếu cần phân biệt môi trường, có thể dùng `process.server` hoặc `process.client` để kiểm tra.

```typescript
<script setup>
// Cả Server và Client đều chạy
console.log('Setup executed');

if (process.server) {
  console.log('Only on Server');
}

onMounted(() => {
  // Chỉ Client chạy
  console.log('Mounted (Client Only)');
  // Sử dụng window an toàn
  window.alert('Hello');
});
</script>
```

---

## 3. Nuxt 3 useState vs Vue ref

### 3.1 Tại sao Nuxt cần useState?

Trong ứng dụng SSR, sau khi Server render xong HTML, sẽ serialize trạng thái (State) và gửi cho Client, để Client thực hiện Hydration (tiếp quản trạng thái).

- **Vue `ref`**: Là trạng thái cục bộ trong component. Trong quá trình SSR, giá trị `ref` được tạo ở phía Server **sẽ không** được tự động truyền cho Client. Khi Client khởi tạo sẽ tạo lại `ref` (thường reset về giá trị ban đầu), dẫn đến nội dung render của Server không nhất quán với trạng thái khởi tạo của Client, gây ra Hydration Mismatch.
- **Nuxt `useState`**: Là quản lý trạng thái thân thiện với SSR. Nó lưu trạng thái vào `NuxtPayload`, được gửi cùng với HTML cho Client. Khi Client khởi tạo sẽ đọc Payload này, khôi phục trạng thái, đảm bảo Server và Client đồng bộ trạng thái.

### 3.2 Bảng so sánh

| Đặc tính | Vue `ref` / `reactive` | Nuxt `useState` |
|----------|------------------------|-----------------|
| **Phạm vi** | Trong component / module | Toàn cục (có thể chia sẻ qua key trong phạm vi App) |
| **Đồng bộ trạng thái SSR** | ❌ Không đồng bộ | ✅ Tự động serialize và đồng bộ với Client |
| **Trường hợp sử dụng** | Trạng thái tương tác chỉ phía Client, dữ liệu không cần đồng bộ SSR | Trạng thái liên component, dữ liệu cần mang từ Server sang Client (như User Info) |

### 3.3 Ví dụ triển khai

**Ví dụ sai (dùng ref cho trạng thái xuyên phía):**

```typescript
// Server tạo số ngẫu nhiên -> HTML hiển thị 5
const count = ref(Math.random());

// Client chạy lại -> tạo số ngẫu nhiên mới là 3
// Kết quả: Hydration Mismatch (Server: 5, Client: 3)
```

**Ví dụ đúng (dùng useState):**

```typescript
// Server tạo số ngẫu nhiên -> lưu vào Payload (key: 'random-count')
const count = useState('random-count', () => Math.random());

// Client đọc Payload -> lấy giá trị do Server tạo
// Kết quả: trạng thái nhất quán
```

---

## 4. Hydration và Hydration Mismatch

### 4.1 Hydration là gì?

Hydration (chú nước) là quá trình JavaScript phía Client tiếp quản HTML tĩnh được render từ phía Server.

1. **Server Rendering**: Server chạy ứng dụng Vue, tạo ra chuỗi HTML (bao gồm nội dung và CSS).
2. **Tải HTML**: Trình duyệt tải và hiển thị HTML tĩnh (First Paint).
3. **Tải và chạy JS**: Trình duyệt tải JS bundle của Vue/Nuxt.
4. **Hydration**: Vue tạo lại Virtual DOM ở phía Client, so sánh với DOM thực hiện có. Nếu cấu trúc nhất quán, Vue sẽ "kích hoạt" các phần tử DOM đó (gắn event listener), làm cho trang trở nên tương tác.

### 4.2 Hydration Mismatch là gì?

Khi cấu trúc Virtual DOM được tạo ra ở phía Client **không nhất quán** với cấu trúc HTML render từ phía Server, Vue sẽ báo cảnh báo Hydration Mismatch. Điều này thường có nghĩa là Client phải bỏ HTML của Server và render lại, dẫn đến giảm hiệu suất và màn hình nhấp nháy.

### 4.3 Nguyên nhân Mismatch phổ biến và giải pháp

#### 1. Cấu trúc HTML không hợp lệ
Trình duyệt tự động sửa cấu trúc HTML sai, dẫn đến không khớp với kỳ vọng của Vue.
- **Ví dụ**: Thẻ `<p>` chứa `<div>` bên trong.
- **Giải pháp**: Kiểm tra cú pháp HTML, đảm bảo cấu trúc lồng nhau hợp lệ.

#### 2. Nội dung ngẫu nhiên hoặc timestamp
Server và Client tạo ra nội dung khác nhau khi thực thi.
- **Ví dụ**: `new Date()`, `Math.random()`.
- **Giải pháp**:
    - Dùng `useState` để cố định giá trị.
    - Hoặc chuyển logic như vậy vào `onMounted` để chạy (chỉ render ở Client, Server để trống hoặc hiển thị Placeholder).

```typescript
// Sai
const time = new Date().toISOString();

// Đúng (dùng onMounted)
const time = ref('');
onMounted(() => {
  time.value = new Date().toISOString();
});

// Hoặc dùng <ClientOnly>
<ClientOnly>
  <div>{{ new Date() }}</div>
</ClientOnly>
```

#### 3. Render có điều kiện phụ thuộc vào window/document
- **Ví dụ**: `v-if="window.innerWidth > 768"`
- **Nguyên nhân**: Phía Server không có window, đánh giá là false; phía Client đánh giá là true.
- **Giải pháp**: Cập nhật trạng thái trong `onMounted`, hoặc dùng các Client-only hooks như `useWindowSize`.

---

## 5. Tóm tắt phỏng vấn

**Có thể trả lời như sau:**

> Sự khác biệt chính giữa Server-side và Client-side nằm ở việc thực thi Lifecycle Hooks. Phía Server chủ yếu chạy `setup`, còn các Hook liên quan đến DOM như `onMounted` chỉ chạy ở phía Client. Điều này dẫn đến khái niệm Hydration, tức là quá trình Client tiếp quản HTML từ Server.
>
> Để tránh Hydration Mismatch, chúng ta phải đảm bảo nội dung render ban đầu của Server và Client nhất quán. Đó là lý do tại sao Nuxt cung cấp `useState`. Khác với `ref` của Vue, `useState` serialize trạng thái và truyền cho Client, đảm bảo đồng bộ trạng thái giữa hai phía. Nếu dùng `ref` để lưu dữ liệu được tạo ở phía Server, khi Client reset sẽ xảy ra không nhất quán.
>
> Các Mismatch phổ biến như số ngẫu nhiên, timestamp hoặc cấu trúc HTML lồng nhau không hợp lệ. Cách giải quyết là chuyển nội dung thay đổi sang `onMounted` hoặc dùng component `<ClientOnly>`.

**Điểm chính:**
- ✅ `onMounted` chỉ chạy ở phía Client
- ✅ `useState` hỗ trợ đồng bộ trạng thái SSR, `ref` thì không
- ✅ Nguyên nhân Hydration Mismatch (cấu trúc, giá trị ngẫu nhiên) và giải pháp (`<ClientOnly>`, `onMounted`)
