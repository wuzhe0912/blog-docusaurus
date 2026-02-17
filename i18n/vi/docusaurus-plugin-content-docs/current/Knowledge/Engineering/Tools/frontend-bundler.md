---
id: frontend-bundler
title: Bundler
slug: /frontend-bundler
---

## Tại sao phát triển front-end cần bundler? Chức năng chính của nó là gì?

> Why is a bundler necessary for front-end development? What is its primary function?

### Quản lý module và plugin

Trước khi có công cụ bundling front-end, chúng ta sử dụng CDN hoặc thẻ `<script>` để tải file (có thể bao gồm JS, CSS, HTML). Cách làm này ngoài việc lãng phí hiệu năng (HTTP có thể cần nhiều request), còn dễ gây ra lỗi do sự khác biệt về thứ tự tải, dẫn đến lỗi xảy ra thường xuyên hoặc khó xử lý. Bundler giúp lập trình viên gộp nhiều file thành một hoặc vài file. Cách quản lý module hóa này không chỉ dễ bảo trì hơn khi phát triển, mà còn tiện lợi cho việc mở rộng trong tương lai. Mặt khác, việc gộp file cũng đồng thời giảm số lượng request HTTP, tự nhiên cải thiện hiệu năng.

### Dịch và tương thích

Các nhà phát triển trình duyệt không thể hoàn toàn theo kịp tốc độ phát hành cú pháp mới, và sự khác biệt giữa cú pháp cũ và mới có thể gây ra lỗi trong triển khai. Để tương thích tốt hơn giữa hai bên, chúng ta cần bundler để chuyển đổi cú pháp mới sang cú pháp cũ, đảm bảo code hoạt động bình thường. Trường hợp điển hình là Babel sẽ chuyển đổi cú pháp ES6+ sang ES5.

### Tối ưu tài nguyên

Để giảm hiệu quả kích thước dự án và cải thiện hiệu năng, cấu hình bundler để xử lý là cách làm chủ đạo hiện nay:

- Minification (thu nhỏ, làm xấu): nén code JavaScript, CSS và HTML, xóa khoảng trắng, comment và thụt đầu dòng không cần thiết để giảm kích thước file (ví dụ là cho máy đọc chứ không phải cho người đọc).
- Tree Shaking: loại bỏ code không được sử dụng hoặc không thể truy cập, tiếp tục giảm kích thước bundle.
- Code Splitting: chia code thành nhiều phần nhỏ (chunks) để tải theo yêu cầu, cải thiện tốc độ tải trang tốt nhất có thể.
- Lazy Loading: tải trì hoãn, tài nguyên chỉ được tải khi người dùng cần, giảm thời gian tải ban đầu (cũng là vì trải nghiệm người dùng).
- Cache dài hạn: hash hóa nội dung bundle và đưa vào tên file, như vậy miễn là nội dung không thay đổi, cache trình duyệt có thể sử dụng vĩnh viễn, giảm số lượng request. Đồng thời mỗi lần triển khai, chỉ cập nhật file đã thay đổi, không phải tải lại tất cả.

### Môi trường triển khai

Trong thực tế, triển khai được chia thành các môi trường phát triển, test và production. Để đảm bảo hành vi nhất quán, thường cấu hình qua bundler, đảm bảo tải đúng trong môi trường tương ứng.
