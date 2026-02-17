---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> Vấn đề kỹ thuật khó khăn nhất mà bạn đã giải quyết là gì?

### Webauthn

Vấn đề kỹ thuật gần đây tôi xử lý mà tương đối mới và ít kinh nghiệm liên quan là triển khai đăng nhập bằng Webauthn. Phía yêu cầu mong muốn rằng người dùng khi đăng nhập vào trang web có thể kích hoạt cơ chế Face ID / Touch ID giống như trong ứng dụng, mang lại trải nghiệm người dùng mượt mà hơn.

Tài liệu tham khảo trước khi triển khai:

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

Sau khi xác nhận sơ bộ tính khả thi, đã phối hợp với phía PM xác nhận toàn bộ quy trình đăng nhập và đăng ký, bao gồm việc có kích hoạt xác thực sinh trắc học khi đăng nhập lần đầu hay không, cũng như các cơ chế xác định. Thách thức lớn nhất trong quá trình triển khai là phải liên tục tinh chỉnh các tham số đầu vào, vì tài liệu tham khảo còn quá ít và ý nghĩa của nhiều tham số không rõ ràng, chỉ có thể liên tục thử nghiệm. Về thiết bị, điện thoại iOS tương đối dễ xử lý, nhưng điện thoại Android xuất hiện vấn đề Touch ID khó kích hoạt, cần sự hỗ trợ của backend để điều chỉnh một số tham số tương thích. Cuối cùng sau khi hoàn thành chức năng, kết hợp với PWA đã được triển khai trước đó, toàn bộ trang web mang lại trải nghiệm sử dụng gần gũi hơn với ứng dụng.
