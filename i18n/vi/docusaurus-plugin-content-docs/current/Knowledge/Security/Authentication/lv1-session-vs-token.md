---
id: login-lv1-session-vs-token
title: '[Lv1] Sự khác biệt giữa Session-based và Token-based là gì?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Câu hỏi thường gặp trong phỏng vấn: bạn có hiểu sự khác biệt giữa Session truyền thống và Token hiện đại không? Nắm vững các điểm chính dưới đây để nhanh chóng sắp xếp câu trả lời.

---

## 1. Khái niệm cốt lõi của hai phương thức xác thực

### Session-based Authentication

- **Trạng thái lưu trên server**: sau khi người dùng đăng nhập lần đầu, server tạo Session trong bộ nhớ hoặc cơ sở dữ liệu, trả về Session ID lưu trong Cookie.
- **Các request tiếp theo dựa vào Session ID**: trình duyệt tự động gửi Cookie trên cùng domain, server tìm thông tin người dùng tương ứng qua Session ID.
- **Phổ biến trong ứng dụng MVC / monolithic truyền thống**: server đảm nhận render trang và duy trì trạng thái người dùng.

### Token-based Authentication (ví dụ JWT)

- **Trạng thái lưu trên client**: sau khi đăng nhập thành công, một Token được tạo ra (có thể mang thông tin người dùng và quyền hạn), front-end lưu trữ.
- **Mỗi request gửi kèm Token**: thường đặt trong `Authorization: Bearer <token>`, server xác minh chữ ký là có thể lấy được thông tin người dùng.
- **Phổ biến trong SPA / microservices**: back-end chỉ cần xác minh Token, không cần lưu trạng thái người dùng.

---

## 2. So sánh luồng request

| Bước luồng     | Session-based                                           | Token-based (JWT)                                                     |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Đăng nhập thành công | Server tạo Session, trả về `Set-Cookie: session_id=...` | Server ký Token, trả về JSON: `{ access_token, expires_in, ... }` |
| Vị trí lưu trữ | Cookie trình duyệt (thường là httponly)                  | Front-end tự chọn: `localStorage`, `sessionStorage`, Cookie, Memory   |
| Request tiếp theo | Trình duyệt tự động gửi Cookie, server tra cứu bảng để lấy thông tin người dùng | Front-end thủ công đính kèm `Authorization` trong Header |
| Phương thức xác minh | Tra cứu Session Store                               | Xác minh chữ ký Token, hoặc đối chiếu danh sách đen / trắng          |
| Đăng xuất      | Xóa Session trên server, gửi `Set-Cookie` để xóa Cookie | Front-end xóa Token; nếu cần vô hiệu hóa thì phải ghi vào danh sách đen hoặc thay đổi khóa |

---

## 3. Tổng hợp ưu nhược điểm

| Khía cạnh      | Session-based                                                                 | Token-based (JWT)                                                                 |
| -------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Ưu điểm        | - Cookie tự động gửi, đơn giản phía trình duyệt<br />- Session có thể lưu nhiều dữ liệu<br />- Dễ thu hồi và buộc đăng xuất | - Không trạng thái, dễ mở rộng ngang<br />- Phù hợp SPA, mobile, microservices<br />- Token có thể sử dụng xuyên domain và xuyên thiết bị |
| Nhược điểm     | - Server phải duy trì Session Store, tốn bộ nhớ<br />- Triển khai phân tán cần đồng bộ Session | - Token có kích thước lớn hơn, gửi trong mỗi request<br />- Khó thu hồi, cần cơ chế danh sách đen / xoay khóa |
| Rủi ro bảo mật | - Dễ bị tấn công CSRF (Cookie tự động gửi)<br />- Nếu lộ Session ID, cần xóa ngay | - Dễ bị ảnh hưởng bởi XSS (nếu lưu ở vị trí có thể đọc)<br />- Nếu Token bị đánh cắp trước khi hết hạn, có thể bị tái sử dụng |
| Trường hợp sử dụng | - Web truyền thống (SSR) + cùng domain<br />- Server đảm nhận render trang | - API RESTful / GraphQL<br />- App mobile, SPA, microservices |

---

## 4. Cách chọn lựa?

### Tự hỏi ba câu hỏi

1. **Có cần trạng thái đăng nhập dùng chung giữa các domain hoặc thiết bị không?**
   - Có -> Token-based linh hoạt hơn.
   - Không -> Session-based đơn giản hơn.

2. **Triển khai có nhiều server hoặc microservices không?**
   - Có -> Token-based giảm nhu cầu sao chép hoặc tập trung Session.
   - Không -> Session-based đơn giản và an toàn.

3. **Có yêu cầu bảo mật cao (ngân hàng, hệ thống doanh nghiệp) không?**
   - Yêu cầu cao -> Session-based + httponly Cookie + bảo vệ CSRF vẫn là chủ đạo.
   - API nhẹ hoặc dịch vụ mobile -> Token-based + HTTPS + Refresh Token + chiến lược danh sách đen.

### Các chiến lược kết hợp phổ biến

- **Hệ thống nội bộ doanh nghiệp**: Session-based + đồng bộ Redis / database.
- **SPA hiện đại + app mobile**: Token-based (Access Token + Refresh Token).
- **Microservices lớn**: Token-based (JWT) kết hợp xác minh qua API Gateway.

---

## 5. Mẫu trả lời phỏng vấn

> "Session truyền thống lưu trạng thái trên server, trả về session id trong Cookie, trình duyệt tự động gửi Cookie trong mỗi request, nên rất phù hợp với Web App trên cùng domain. Nhược điểm là server phải duy trì Session Store, nếu triển khai nhiều máy thì phải đồng bộ.
> Ngược lại, Token-based (ví dụ JWT) mã hóa thông tin người dùng thành Token lưu trên client, front-end thủ công đính kèm trong Header mỗi request. Cách này là không trạng thái, phù hợp với SPA và microservices, dễ mở rộng hơn.
> Về bảo mật, Session cần chú ý CSRF, Token cần chú ý XSS. Nếu tôi cần làm việc xuyên domain, mobile hoặc tích hợp nhiều dịch vụ, tôi sẽ chọn Token; nếu là hệ thống doanh nghiệp truyền thống, server render, tôi sẽ chọn Session kết hợp httponly Cookie."

---

## 6. Ghi nhớ mở rộng trong phỏng vấn

- Session -> tập trung vào **bảo vệ CSRF, chiến lược đồng bộ Session, bao lâu thì xóa**.
- Token -> tập trung vào **vị trí lưu trữ (Cookie vs localStorage)**, **cơ chế Refresh Token**, **danh sách đen / xoay khóa**.
- Có thể bổ sung giải pháp thỏa hiệp phổ biến trong doanh nghiệp: lưu Token trong `httpOnly Cookie`, kết hợp thêm CSRF Token.

---

## 7. Tài liệu tham khảo

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
