---
id: login-lv1-project-implementation
title: '[Lv1] Cơ chế đăng nhập trong các dự án trước đây được triển khai như thế nào?'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Mục tiêu: trình bày rõ ràng trong 3-5 phút cách front-end xử lý đăng nhập, duy trì trạng thái và bảo vệ trang, để có thể nhắc lại nhanh trong phỏng vấn.

---

## 1. Các trục chính trả lời phỏng vấn

1. **Ba giai đoạn đăng nhập**: gửi form -> back-end xác thực -> lưu Token và chuyển trang.
2. **Quản lý trạng thái và Token**: Pinia kết hợp lưu trữ bền vững, Axios Interceptor tự động đính kèm Bearer Token.
3. **Xử lý tiếp theo và bảo vệ**: khởi tạo dữ liệu dùng chung, route guard, đăng xuất và các trường hợp đặc biệt (OTP, buộc đổi mật khẩu).

Bắt đầu với ba điểm chính này, sau đó mở rộng chi tiết theo yêu cầu để người phỏng vấn cảm nhận bạn có tầm nhìn tổng thể.

---

## 2. Cấu trúc hệ thống và phân công trách nhiệm

| Module           | Vị trí                              | Vai trò                                                    |
| ---------------- | ----------------------------------- | ---------------------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Lưu trạng thái đăng nhập, lưu trữ Token bền vững, cung cấp getter |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Đóng gói luồng đăng nhập / đăng xuất, format trả về thống nhất |
| API đăng nhập    | `src/api/login.ts`                  | Gọi `POST /login`, `POST /logout` đến back-end             |
| Axios Utility    | `src/common/utils/request.ts`       | Request / Response Interceptor, xử lý lỗi thống nhất       |
| Route Guard      | `src/router/index.ts`               | Kiểm tra theo `meta` xem có cần đăng nhập không, chuyển hướng đến trang đăng nhập |
| Luồng khởi tạo   | `src/common/composables/useInit.ts` | Khi app khởi động, kiểm tra có Token chưa, tải dữ liệu cần thiết |

> Cách nhớ: **"Store quản lý trạng thái, Hook quản lý luồng, Interceptor quản lý kênh, Guard quản lý trang"**.

---

## 3. Luồng đăng nhập (phân tích từng bước)

### Bước 0. Form và kiểm tra trước

- Hỗ trợ hai cách đăng nhập: mật khẩu thông thường và mã xác minh SMS.
- Kiểm tra cơ bản trước khi gửi (trường bắt buộc, định dạng, chống gửi trùng).

### Bước 1. Gọi API đăng nhập

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` xử lý lỗi và quản lý loading thống nhất.
- Khi thành công, `data` sẽ trả về Token và thông tin cơ bản của người dùng.

### Bước 2. Xử lý phản hồi từ back-end

| Tình huống                                         | Hành động                                                  |
| -------------------------------------------------- | ---------------------------------------------------------- |
| **Cần xác minh bổ sung** (vd. đăng nhập lần đầu cần xác nhận danh tính) | Đặt `authStore.onBoarding` thành `true`, chuyển đến trang xác minh |
| **Buộc đổi mật khẩu**                              | Chuyển đến luồng đổi mật khẩu với các tham số cần thiết    |
| **Thành công bình thường**                         | Gọi `authStore.$patch()` lưu Token và thông tin người dùng |

### Bước 3. Hành động chung sau khi đăng nhập

1. Lấy thông tin cơ bản người dùng và danh sách ví.
2. Khởi tạo nội dung cá nhân (ví dụ: danh sách quà tặng, thông báo).
3. Chuyển đến trang nội bộ theo `redirect` hoặc route đã định.

> Đăng nhập thành công chỉ là một nửa, **dữ liệu dùng chung cần được bổ sung tại thời điểm này** để tránh mỗi trang lại gọi API riêng.

---

## 4. Quản lý vòng đời Token

### 4.1 Chiến lược lưu trữ

- `authStore` bật `persist: true`, ghi các trường quan trọng vào `localStorage`.
- Ưu điểm: trạng thái tự động phục hồi sau khi tải lại trang; nhược điểm: cần tự quản lý rủi ro XSS.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- Các API cần xác thực sẽ tự động đính kèm Bearer Token.
- Nếu API được đánh dấu rõ ràng `needToken: false` (đăng nhập, đăng ký, v.v.), sẽ bỏ qua việc đính kèm.

### 4.3 Xử lý hết hạn và ngoại lệ

- Nếu back-end trả về Token hết hạn hoặc không hợp lệ, Response Interceptor sẽ thống nhất chuyển thành thông báo lỗi và kích hoạt luồng đăng xuất.
- Có thể mở rộng thêm cơ chế Refresh Token, hiện tại dự án sử dụng chiến lược đơn giản.

---

## 5. Bảo vệ route và khởi tạo

### 5.1 Route Guard

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- `meta.needAuth` quyết định có kiểm tra trạng thái đăng nhập không.
- Khi chưa đăng nhập, chuyển đến trang đăng nhập hoặc trang công khai được chỉ định.

### 5.2 Khởi tạo khi ứng dụng khởi động

`useInit` xử lý khi App khởi động:

1. Kiểm tra URL có chứa `login_token` hoặc `platform_token` không; nếu có thì tự động đăng nhập hoặc thiết lập Token.
2. Nếu Store đã có Token, tải thông tin người dùng và dữ liệu dùng chung.
3. Không có Token thì ở lại trang công khai, đợi người dùng đăng nhập thủ công.

---

## 6. Luồng đăng xuất (dọn dẹp và kết thúc)

1. Gọi `POST /logout` thông báo cho back-end.
2. Thực thi `reset()`:
   - `authStore.$reset()` xóa thông tin đăng nhập.
   - Các Store liên quan (thông tin người dùng, yêu thích, mã giới thiệu, v.v.) cũng được reset.
3. Dọn dẹp cache phía trình duyệt (ví dụ: cache trong `localStorage`).
4. Chuyển về trang đăng nhập hoặc trang chủ.

> Đăng xuất là hình ảnh phản chiếu của đăng nhập: không chỉ là xóa Token, mà còn phải đảm bảo tất cả trạng thái phụ thuộc được dọn sạch để tránh dữ liệu còn sót.

---

## 7. Các vấn đề thường gặp và thực hành tốt nhất

- **Tách luồng**: tách riêng đăng nhập và khởi tạo sau đăng nhập để giữ hook gọn gàng.
- **Xử lý lỗi**: thống nhất qua `useApi` và Response Interceptor, đảm bảo giao diện hiển thị nhất quán.
- **Bảo mật**:
  - Sử dụng HTTPS toàn trình.
  - Khi Token lưu trong `localStorage`, cần lưu ý XSS với các thao tác nhạy cảm.
  - Cân nhắc httpOnly Cookie hoặc Refresh Token khi cần thiết.
- **Phương án dự phòng**: các tình huống OTP, buộc đổi mật khẩu được giữ linh hoạt, hook trả về trạng thái để giao diện xử lý.

---

## 8. Ghi nhớ nhanh cho phỏng vấn

1. **"Nhập -> Xác thực -> Lưu trữ -> Chuyển trang"**: mô tả luồng tổng thể theo thứ tự này.
2. **"Store nhớ trạng thái, Interceptor đính kèm header, Guard chặn người lạ"**: nhấn mạnh phân công kiến trúc.
3. **"Bổ sung dữ liệu dùng chung ngay sau đăng nhập"**: thể hiện sự nhạy cảm với trải nghiệm người dùng.
4. **"Đăng xuất là reset một lần + quay về trang an toàn"**: quan tâm đến bảo mật và kết thúc luồng.
