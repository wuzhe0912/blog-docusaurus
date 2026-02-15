---
id: http-methods
title: "\U0001F4C4 Các phương thức HTTP"
slug: /http-methods
---

## 1. API RESTful là gì?

Viết API RESTful áp dụng một bộ phong cách thiết kế chuẩn hóa, giúp các hệ thống khác nhau trên mạng giao tiếp dễ dàng. Để tuân thủ nguyên tắc REST, API cần phải dễ dự đoán và dễ hiểu. Là một lập trình viên front-end, chúng ta tập trung chủ yếu vào ba điểm sau:

- **Đường dẫn URL (url path)** : Xác định phạm vi request phía client, ví dụ:
  - `/products` : có thể trả về danh sách sản phẩm
  - `/products/abc` : cung cấp chi tiết sản phẩm có ID là abc
- **Phương thức HTTP** : Định nghĩa hành động cụ thể cần thực hiện:
  - `GET` : dùng để lấy dữ liệu
  - `POST` : dùng để tạo dữ liệu mới
  - `PUT` : dùng để cập nhật dữ liệu hiện có
  - `DELETE` : dùng để xóa dữ liệu
- **Mã trạng thái (status code)** : Cung cấp chỉ báo nhanh về việc request thành công hay thất bại, và nếu thất bại thì vấn đề có thể nằm ở đâu. Các mã trạng thái phổ biến bao gồm:
  - `200` : thành công
  - `404` : không tìm thấy tài nguyên được yêu cầu
  - `500` : lỗi server

## 2. Nếu GET cũng có thể mang dữ liệu trong request, tại sao phải dùng POST?

> Vì `GET` cũng có thể gửi request chứa dữ liệu, tại sao chúng ta vẫn cần sử dụng `POST`?

Chủ yếu dựa trên bốn lý do:

1. Bảo mật: Vì dữ liệu của `GET` được gắn trên URL nên dễ lộ dữ liệu nhạy cảm, trong khi `POST` đặt dữ liệu trong `body` của request, tương đối an toàn hơn.
2. Giới hạn kích thước dữ liệu: Khi sử dụng `GET`, do trình duyệt và server giới hạn độ dài URL (mặc dù mỗi trình duyệt khác nhau một chút, nhưng nhìn chung khoảng 2048 bytes), nên lượng dữ liệu bị hạn chế. `POST` về lý thuyết không có giới hạn, nhưng trong thực tế, để tránh bị tấn công bằng cách đẩy vào lượng lớn dữ liệu, thường sẽ thiết lập middleware để giới hạn kích thước dữ liệu. Ví dụ `body-parser` của `express`.
3. Rõ ràng về ngữ nghĩa: Đảm bảo lập trình viên hiểu rõ mục đích của request. `GET` thường dùng để lấy dữ liệu, còn `POST` phù hợp hơn để tạo mới hoặc cập nhật dữ liệu.
4. Tính bất biến (Immutability): Trong giao thức HTTP, phương thức `GET` được thiết kế là "an toàn", dù gửi bao nhiêu request cũng không cần lo lắng việc này sẽ thay đổi dữ liệu trên server.

## 3. Phương thức PUT trong HTTP làm gì?

> Mục đích sử dụng của phương thức `PUT` là gì?

Chủ yếu có hai mục đích:

1. Cập nhật một dữ liệu đã tồn tại (ví dụ, sửa thông tin người dùng)
2. Nếu dữ liệu không tồn tại, tạo mới một dữ liệu

### Example

```js
const axios = require('axios');

async function updateUser(userId, newName) {
  const url = `https://api.example.com/users/${userId}`; // api URL
  const data = {
    name: newName,
  };

  try {
    const response = await axios.put(url, data); // 執行 PUT 請求
    console.log('User updated:', response.data); // 輸出更新後的用戶信息
  } catch (error) {
    console.log('Error updating user:', error); // 輸出錯誤信息
  }
}

updateUser(1, 'Pitt Wu');
```
