---
id: project-architecture-browser-compatibility
title: 'Xử lý tương thích trình duyệt'
slug: /experience/project-architecture/browser-compatibility
tags: [Experience, Interview, Project-Architecture]
---

> Xử lý các vấn đề tương thích giữa các trình duyệt, đặc biệt là xử lý đặc biệt cho Safari và thiết bị di động.

---

## Tương thích trình duyệt

> Đơn vị viewport nhỏ (Small Viewport Units): svh
> Đơn vị viewport lớn (Large Viewport Units): lvh
> Đơn vị viewport động (Dynamic Viewport Units): dvh

Trong các tình huống cụ thể, cho phép sử dụng cú pháp mới dvh để giải quyết vấn đề thanh nổi của Safari do thiết kế kém. Nếu cần buộc tương thích với các trình duyệt cũ hoặc ít phổ biến, thì sử dụng JS để phát hiện chiều cao.

## Ngăn chặn iOS Safari tự động điều chỉnh kích thước văn bản

```css
-webkit-text-size-adjust: none;
text-size-adjust: none;
```

## Tiền tố nhà cung cấp

Tiền tố nhà cung cấp được xử lý thông qua cấu hình thủ công kết hợp với cấu hình tự động của Autoprefixer.
