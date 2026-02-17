---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Bạn có thể giải thích CSP (Content Security Policy) là gì không?

> Can you explain what CSP (Content Security Policy) is?

Về nguyên tắc, CSP là một cơ chế tăng cường bảo mật cho trang web, cho phép cấu hình HTTP header để giới hạn các nguồn dữ liệu mà nội dung trang web có thể tải (danh sách trắng), nhằm ngăn chặn kẻ tấn công tiêm script độc hại để đánh cắp dữ liệu người dùng.

Từ góc độ front-end, để phòng chống tấn công XSS (Cross-site scripting), phần lớn sử dụng các framework hiện đại để phát triển, vì chúng cung cấp cơ chế bảo vệ cơ bản. Ví dụ, JSX của React tự động escape HTML, Vue thì thông qua cách bind dữ liệu `{{ data }}` đồng thời tự động escape các thẻ HTML.

Mặc dù front-end có khá hạn chế trong lĩnh vực này, vẫn có một số tối ưu chi tiết có thể xử lý:

1. Nếu có form nhập nội dung, có thể xác thực các ký tự đặc biệt để tránh tấn công (nhưng thực tế rất khó lường trước mọi tình huống), nên phần lớn chọn cách giới hạn độ dài để kiểm soát nội dung nhập từ client, hoặc giới hạn loại dữ liệu đầu vào.
2. Khi cần tham chiếu liên kết ngoài, tránh dùng http url mà dùng https url.
3. Với trang web tĩnh, có thể cấu hình meta tag để giới hạn, như sau:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: mặc định chỉ cho phép tải dữ liệu từ cùng nguồn gốc (cùng domain).
- `img-src https://*`: chỉ cho phép tải hình ảnh qua giao thức HTTPS.
- `child-src 'none'`: không cho phép nhúng bất kỳ tài nguyên con bên ngoài nào, ví dụ `<iframe>`.

## 2. Tấn công XSS (Cross-site scripting) là gì?

> What is XSS (Cross-site scripting) attack?

XSS, hay tấn công scripting xuyên trang, là khi kẻ tấn công tiêm script độc hại, khiến nó chạy trên trình duyệt của người dùng, từ đó lấy cắp dữ liệu nhạy cảm như cookie, hoặc trực tiếp thay đổi nội dung trang web để dẫn người dùng đến trang web độc hại.

### Phòng chống XSS kiểu lưu trữ

Kẻ tấn công có thể thông qua bình luận, cố tình chèn HTML hoặc script độc hại vào cơ sở dữ liệu. Lúc này ngoài việc back-end sẽ escape, các framework front-end hiện đại như JSX của React hoặc template Vue `{{ data }}` cũng hỗ trợ escape, giảm thiểu khả năng tấn công XSS.

### Phòng chống XSS kiểu phản xạ

Tránh sử dụng `innerHTML` để thao tác DOM, vì như vậy có cơ hội thực thi các thẻ HTML. Thường khuyến nghị sử dụng `textContent` để thao tác.

### Phòng chống XSS dựa trên DOM

Về nguyên tắc, chúng ta cố gắng không cho người dùng trực tiếp chèn HTML vào trang. Nếu có nhu cầu về tình huống, bản thân framework cũng có các directive tương tự để hỗ trợ, ví dụ `dangerouslySetInnerHTML` của React, `v-html` của Vue, cố gắng tự động phòng chống XSS. Nhưng nếu cần phát triển bằng JS thuần, cũng nên sử dụng `textContent`, `createElement`, `setAttribute` để thao tác DOM.
