---
id: cross-origin-resource-sharing
title: "\U0001F4C4 CORS"
slug: /cross-origin-resource-sharing
---

## 1. Sự khác biệt giữa JSONP và CORS là gì?

JSONP (JSON with Padding) và CORS (Cross-Origin Resource Sharing) là hai kỹ thuật cho phép thực hiện request cross-origin, cho phép trang web yêu cầu dữ liệu từ các tên miền (website) khác nhau.

### JSONP

JSONP là một kỹ thuật khá cũ, được dùng để giải quyết hạn chế của Same-Origin Policy, cho phép trang web yêu cầu dữ liệu từ các nguồn gốc khác nhau (domain, protocol hoặc port). Vì việc tải thẻ `<script>` không bị giới hạn bởi Same-Origin Policy, JSONP hoạt động bằng cách thêm động một thẻ `<script>` trỏ đến một URL trả về dữ liệu JSON. Response của URL đó được bọc trong một lời gọi hàm, và JavaScript trên trang sẽ định nghĩa trước hàm này để nhận dữ liệu.

```javascript
// client-side
function receiveData(jsonData) {
  console.log(jsonData);
}

let script = document.createElement('script');
script.src = 'http://example.com/data?callback=receiveData';
document.body.appendChild(script);
```

```javascript
// server-side
receiveData({ name: 'PittWu', type: 'player' });
```

Nhược điểm là rủi ro bảo mật cao (vì có thể thực thi JavaScript tùy ý) và chỉ hỗ trợ request GET.

### CORS

CORS là kỹ thuật an toàn và hiện đại hơn JSONP. Nó sử dụng HTTP header `Access-Control-Allow-Origin` để cho trình duyệt biết rằng request được phép. Server thiết lập các header CORS phù hợp để xác định nguồn gốc nào có thể truy cập tài nguyên của nó.

Nếu front-end của `http://client.com` muốn truy cập tài nguyên của `http://api.example.com`, `api.example.com` cần bao gồm HTTP header sau trong response:

```http
Access-Control-Allow-Origin: http://client.com
```

Hoặc nếu cho phép mọi nguồn gốc:

```http
Access-Control-Allow-Origin: *
```

CORS có thể được sử dụng cho mọi loại HTTP request và là phương thức chuẩn hóa, an toàn để thực hiện request cross-origin.
