---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## So sánh

| Thuộc tính | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| Vòng đời | Mặc định sẽ bị xóa khi đóng trang, trừ khi đặt thời gian hết hạn (Expires) hoặc thời gian lưu trữ tối đa (Max-Age) | Xóa khi đóng trang | Lưu trữ vĩnh viễn cho đến khi xóa thủ công |
| HTTP Request | Có, có thể gửi đến Server thông qua Cookie header | Không | Không |
| Tổng dung lượng | 4KB | 5MB | 5MB |
| Phạm vi truy cập | Giữa các cửa sổ/tab | Chỉ trong cùng tab | Giữa các cửa sổ/tab |
| Bảo mật | JavaScript không thể truy cập `HttpOnly cookies` | Không | Không |

## Giải thích thuật ngữ

> Persistent cookies là gì?

Persistent cookie hay còn gọi là cookie vĩnh viễn, là cách lưu trữ dữ liệu lâu dài trên trình duyệt của người dùng. Cách thức cụ thể là thông qua việc thiết lập thời gian hết hạn như đã đề cập ở trên (`Expires` hoặc `Max-Age`).

## Kinh nghiệm triển khai cá nhân

### `cookie`

#### 1. Xác minh bảo mật

Một số dự án cũ có tình hình bảo mật không tốt, thường xuyên xảy ra vấn đề bị đánh cắp tài khoản, khiến chi phí vận hành tăng mạnh. Trước tiên chọn sử dụng thư viện [Fingerprint](https://fingerprint.com/) (bản cộng đồng có độ chính xác khoảng 60%, bản trả phí có hạn mức miễn phí hàng tháng 20.000), nhận diện mỗi người dùng đăng nhập thành visitID duy nhất thông qua các tham số thiết bị và vị trí địa lý. Sau đó tận dụng đặc tính cookie được gửi kèm mỗi yêu cầu HTTP, để backend kiểm tra tình hình hiện tại của người dùng, xem có thay đổi thiết bị hoặc vị trí có sự lệch bất thường không. Khi phát hiện bất thường, bắt buộc kích hoạt xác minh OTP (email hoặc SMS tùy theo yêu cầu của công ty) trong quy trình đăng nhập.

#### 2. URL mã khuyến mại

Khi vận hành trang web sản phẩm, thường cung cấp các chiến lược tiếp thị liên kết, cung cấp URL độc quyền cho các đối tác quảng bá để họ dễ dàng dẫn lưu lượng và quảng bá. Để đảm bảo những khách hàng đến thông qua dẫn lưu lượng thuộc về thành tích của người quảng bá, đã chọn sử dụng tính năng `expires` của `cookie` để triển khai. Từ khi người dùng vào trang web qua dẫn lưu lượng, trong vòng 24 giờ (thời gian giới hạn có thể do bên vận hành quyết định) mã khuyến mại bắt buộc có hiệu lực. Kể cả khi người dùng cố tình xóa tham số mã khuyến mại trên URL, khi đăng ký vẫn lấy tham số tương ứng từ `cookie`, và tự động hết hạn sau 24 giờ.

### `localStorage`

#### 1. Lưu trữ tùy chọn người dùng

- Thường dùng để lưu trữ các tùy chọn cá nhân của người dùng, ví dụ: dark mode, cài đặt ngôn ngữ i18n, v.v.
- Hoặc lưu trữ token đăng nhập.
