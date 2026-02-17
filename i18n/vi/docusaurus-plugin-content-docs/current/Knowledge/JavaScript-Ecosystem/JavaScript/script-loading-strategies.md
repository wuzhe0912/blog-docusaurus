---
id: script-loading-strategies
title: '[Easy] 📄 <script>, <script async>, <script defer>'
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## Tổng quan

Trong HTML, chúng ta có ba cách chính để tải file JavaScript:

1. `<script>`
2. `<script async>`
3. `<script defer>`

Ba cách này có hành vi khác nhau khi tải và thực thi script.

## So sánh chi tiết

### `<script>`

- **Hành vi**: Khi trình duyệt gặp thẻ này, nó sẽ dừng phân tích HTML, tải xuống và thực thi script, sau đó tiếp tục phân tích HTML.
- **Khi nào sử dụng**: Phù hợp với các script quan trọng cho việc render trang.
- **Ưu điểm**: Đảm bảo các script được thực thi theo thứ tự.
- **Nhược điểm**: Có thể làm chậm quá trình render trang.

```html
<script src="important.js"></script>
```

### `<script async>`

- **Hành vi**: Trình duyệt tải script ở chế độ nền trong khi tiếp tục phân tích HTML. Khi tải xuống xong, script được thực thi ngay lập tức, có thể làm gián đoạn việc phân tích HTML.
- **Khi nào sử dụng**: Phù hợp với các script độc lập như script phân tích hoặc quảng cáo.
- **Ưu điểm**: Không chặn việc phân tích HTML, có thể cải thiện tốc độ tải trang.
- **Nhược điểm**: Không đảm bảo thứ tự thực thi, có thể thực thi trước khi DOM được tải hoàn toàn.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **Hành vi**: Trình duyệt tải script ở chế độ nền, nhưng đợi đến khi phân tích HTML hoàn tất mới thực thi. Nhiều script defer sẽ được thực thi theo thứ tự xuất hiện trong HTML.
- **Khi nào sử dụng**: Phù hợp với các script cần cấu trúc DOM hoàn chỉnh nhưng không cần thiết ngay lập tức.
- **Ưu điểm**: Không chặn việc phân tích HTML, đảm bảo thứ tự thực thi, phù hợp với các script phụ thuộc vào DOM.
- **Nhược điểm**: Nếu script quan trọng, có thể làm chậm thời gian tương tác của trang.

```html
<script defer src="ui-enhancements.js"></script>
```

## Ví dụ

Hãy tưởng tượng bạn đang chuẩn bị cho một buổi hẹn:

1. **`<script>`**:
   Giống như bạn dừng mọi việc chuẩn bị để gọi điện cho người ấy xác nhận chi tiết buổi hẹn. Việc giao tiếp được đảm bảo, nhưng thời gian chuẩn bị của bạn có thể bị trì hoãn.

2. **`<script async>`**:
   Giống như bạn vừa chuẩn bị vừa nói chuyện với người ấy qua tai nghe Bluetooth. Hiệu quả tăng lên, nhưng có thể vì quá tập trung vào cuộc gọi mà mặc nhầm quần áo.

3. **`<script defer>`**:
   Giống như bạn nhắn tin cho người ấy rằng sẽ gọi lại sau khi chuẩn bị xong. Như vậy bạn có thể tập trung chuẩn bị, và giao tiếp thoải mái khi mọi thứ đã sẵn sàng.

## Tình hình sử dụng hiện tại

Trong hệ thống phát triển với các framework hiện đại, thường không cần cấu hình `<script>` thủ công. Ví dụ, Vite mặc định sử dụng module, tức là hành vi defer.

```javascript
<script type="module" src="/src/main.js"></script>
```

Trừ khi là các script bên thứ ba đặc biệt, ví dụ như Google Analytics.

```javascript
<script async src="https://www.google-analytics.com/analytics.js"></script>
```
