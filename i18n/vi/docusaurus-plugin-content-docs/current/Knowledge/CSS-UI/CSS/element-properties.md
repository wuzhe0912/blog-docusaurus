---
id: element-properties
title: "[Easy] \U0001F3F7️ Thuộc tính phần tử"
slug: /element-properties
tags: [CSS, Quiz, Easy]
---

## 1. Phần tử inline và block là gì? Sự khác biệt giữa chúng?

> Phần tử inline (nội tuyến) và block (khối) là gì? Chúng khác nhau như thế nào?

### Block Elements

> Các phần tử inline hoặc block liệt kê dưới đây chỉ bao gồm các thẻ thường dùng. Các thẻ ít phổ biến chỉ tra cứu khi có nhu cầu sử dụng.

Phần tử cấp khối mặc định chiếm trọn một hàng. Do đó, nếu có nhiều phần tử block, khi chưa sử dụng CSS để bố cục, mặc định chúng sẽ xếp chồng theo chiều dọc từ trên xuống dưới. Phần tử block chỉ có thể viết bên trong `<body></body>`.

#### Danh sách phần tử block thường dùng

div, article, aside, footer, header, footer, main, nav, section, ul, li, ol, video, form.

### Inline Elements

Phần tử inline không chiếm trọn một hàng. Do đó, khi nhiều phần tử inline nằm cạnh nhau, chúng sẽ sắp xếp theo chiều ngang. Phần tử block không thể đặt bên trong phần tử inline, phần tử inline chỉ dùng để trình bày dữ liệu. Tuy nhiên, có thể thay đổi thuộc tính phần tử inline thông qua `CSS`, ví dụ thêm `display : block;` cho `span`.

#### Danh sách phần tử inline thường dùng

a, br, button, br, code, img, input, span, strong, svg, textarea, label.

### inline-block

Trong thuộc tính display có một loại `inline-block` cho phép chuyển phần tử block thành phần tử inline nhưng vẫn giữ các đặc tính của phần tử block, ví dụ có thể thiết lập chiều rộng, chiều cao, margin, padding. Điều này có nghĩa phần tử này trong bố cục sẽ sắp xếp ngang như phần tử inline, nhưng vẫn có thể dùng thuộc tính block để đẩy các phần tử khác.

### Reference

- [Inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements)
- [Block-level elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
- [CSS 教學-關於 display:inline、block、inline-block 的差別](https://ytclion.medium.com/css%E6%95%99%E5%AD%B8-%E9%97%9C%E6%96%BCdisplay-inline-inline-block-block%E7%9A%84%E5%B7%AE%E5%88%A5-1034f38eda82)

## 2. `* { box-sizing: border-box; }` làm gì?

