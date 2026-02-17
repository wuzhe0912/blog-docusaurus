---
id: login-lv1-jwt-structure
title: '[Lv1] Cấu trúc của JWT là gì?'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> Người phỏng vấn thường hỏi tiếp: "JWT trông như thế nào? Tại sao lại thiết kế như vậy?" Hiểu rõ cấu trúc, cách mã hóa và quy trình xác minh sẽ giúp bạn trả lời nhanh chóng.

---

## 1. Tổng quan

JWT (JSON Web Token) là một định dạng Token **tự chứa (self-contained)**, dùng để truyền thông tin một cách an toàn giữa hai bên. Nội dung gồm ba chuỗi ký tự nối với nhau bằng dấu `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Tách ra sẽ là ba khối JSON được mã hóa Base64URL:

1. **Header**: mô tả thuật toán và loại của Token.
2. **Payload**: chứa thông tin người dùng và các khai báo (claims).
3. **Signature**: được ký bằng khóa bí mật để đảm bảo nội dung không bị thay đổi.

---

## 2. Chi tiết Header, Payload, Signature

### 2.1 Header (Phần đầu)

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: thuật toán ký, ví dụ `HS256` (HMAC + SHA-256), `RS256` (RSA + SHA-256).
- `typ`: loại Token, thường là `JWT`.

### 2.2 Payload (Tải trọng)

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims (được đăng ký theo đặc tả, không bắt buộc)**:
  - `iss` (Issuer): bên phát hành
  - `sub` (Subject): chủ đề (thường là ID người dùng)
  - `aud` (Audience): bên nhận
  - `exp` (Expiration Time): thời gian hết hạn (Unix timestamp, tính bằng giây)
  - `nbf` (Not Before): không hợp lệ trước thời điểm này
  - `iat` (Issued At): thời gian phát hành
  - `jti` (JWT ID): mã định danh duy nhất của Token
- **Public / Private Claims**: có thể thêm các trường tùy chỉnh (ví dụ `role`, `permissions`), nhưng tránh quá dài dòng.

### 2.3 Signature (Chữ ký)

Quy trình tạo chữ ký:

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- Sử dụng khóa bí mật (hoặc khóa riêng tư) để ký lên hai phần đầu tiên.
- Khi server nhận được Token, sẽ tính lại chữ ký. Nếu khớp, có nghĩa là Token chưa bị thay đổi và được phát hành từ nguồn hợp pháp.

> Lưu ý: JWT chỉ đảm bảo tính toàn vẹn dữ liệu (Integrity), không đảm bảo tính bảo mật (Confidentiality), trừ khi được mã hóa thêm.

---

## 3. Mã hóa Base64URL là gì?

JWT sử dụng **Base64URL** thay vì Base64 thông thường, sự khác biệt là:

- Thay `+` bằng `-`, thay `/` bằng `_`.
- Loại bỏ dấu `=` ở cuối.

Như vậy Token có thể được sử dụng an toàn trong URL, Cookie hoặc Header mà không gây vấn đề với các ký tự đặc biệt.

---

## 4. Sơ đồ quy trình xác minh

1. Client gửi Token trong Header: `Authorization: Bearer <JWT>`.
2. Server nhận được và:
   - Phân tích Header và Payload.
   - Xác định thuật toán được chỉ định bởi `alg`.
   - Tính lại chữ ký bằng khóa chia sẻ hoặc khóa công khai.
   - So sánh chữ ký và kiểm tra các trường thời gian (`exp`, `nbf`, v.v.).
3. Chỉ sau khi xác minh thành công mới tin tưởng nội dung Payload.

---

## 5. Khung trả lời phỏng vấn

> "JWT gồm ba phần: Header, Payload và Signature, nối với nhau bằng dấu `.`.
> Header mô tả thuật toán và loại; Payload chứa thông tin người dùng và một số trường chuẩn như `iss`, `sub`, `exp`; Signature ký lên hai phần đầu bằng khóa bí mật để xác nhận nội dung chưa bị thay đổi.
> Nội dung là JSON được mã hóa Base64URL, nhưng không được mã hóa, chỉ là chuyển đổi, nên dữ liệu nhạy cảm không nên đặt trực tiếp vào trong. Server nhận Token sẽ tính lại chữ ký để so sánh, nếu khớp và chưa hết hạn thì Token hợp lệ."

---

## 6. Gợi ý mở rộng trong phỏng vấn

- **Bảo mật**: Payload có thể được giải mã, tuyệt đối không lưu mật khẩu, số thẻ tín dụng và các thông tin nhạy cảm.
- **Hết hạn và làm mới**: thường kết hợp Access Token ngắn hạn + Refresh Token dài hạn.
- **Thuật toán ký**: có thể đề cập sự khác biệt giữa đối xứng (HMAC) và bất đối xứng (RSA, ECDSA).
- **Tại sao không thể tạo Token vô hạn?**: Token quá lớn sẽ tăng chi phí truyền tải mạng và có thể bị trình duyệt từ chối.

---

## 7. Tài liệu tham khảo

- [Trang web chính thức JWT](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0: Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
