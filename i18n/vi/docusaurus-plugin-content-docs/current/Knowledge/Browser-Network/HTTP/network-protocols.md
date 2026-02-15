---
id: network-protocols
title: "\U0001F4C4 Giao thức mạng"
slug: /network-protocols
---

## 1. Mô tả TCP, HTTP, HTTPS, WebSocket

1. **TCP (Transmission Control Protocol)** :
   TCP là giao thức đáng tin cậy, hướng kết nối, được dùng để truyền dữ liệu một cách đáng tin cậy giữa hai máy tính trên Internet. Nó đảm bảo thứ tự và độ tin cậy của các gói dữ liệu, nghĩa là dữ liệu sẽ đến đích nguyên vẹn bất kể điều kiện mạng như thế nào.

2. **HTTP (Hypertext Transfer Protocol)** :
   HTTP là giao thức dùng để truyền tải hypertext (tức là trang web). Nó được xây dựng trên giao thức TCP, cung cấp phương thức giao tiếp giữa trình duyệt và server. HTTP là stateless, nghĩa là server không lưu giữ bất kỳ thông tin nào về người dùng.

3. **HTTPS (Hypertext Transfer Protocol Secure)** :
   HTTPS là phiên bản bảo mật của HTTP. Nó mã hóa việc truyền dữ liệu HTTP thông qua giao thức SSL/TLS, bảo vệ an toàn dữ liệu trao đổi, ngăn chặn tấn công man-in-the-middle, đảm bảo tính riêng tư và toàn vẹn của dữ liệu.

4. **WebSocket** :
   Giao thức WebSocket cung cấp phương thức thiết lập kết nối bền vững giữa client và server, cho phép hai bên truyền dữ liệu theo thời gian thực và hai chiều sau khi kết nối được thiết lập. Khác với request HTTP truyền thống, nơi mỗi lần truyền đều cần thiết lập kết nối mới, WebSocket phù hợp hơn cho ứng dụng nhắn tin tức thời và các ứng dụng cần cập nhật dữ liệu nhanh chóng.

## 2. Three Way Handshake (bắt tay ba bước) là gì?

Three Way Handshake là quá trình thiết lập kết nối giữa server và client trong mạng `TCP/IP`. Quá trình này trải qua ba bước để xác nhận khả năng nhận và gửi của cả hai bên đều hoạt động bình thường, đồng thời đồng bộ số thứ tự ban đầu (ISN) để đảm bảo đồng bộ hóa và bảo mật dữ liệu.

### TCP Message Type

Trước khi hiểu các bước, cần biết chức năng chính của mỗi loại message.

| Message | Description                                                                          |
| ------- | ------------------------------------------------------------------------------------ |
| SYN     | Dùng để khởi tạo và thiết lập kết nối, đồng thời đồng bộ số thứ tự giữa các thiết bị |
| ACK     | Dùng để xác nhận với bên kia đã nhận được SYN                                       |
| SYN-ACK | Đồng bộ xác nhận, gửi SYN của mình và ACK                                          |
| FIN     | Kết thúc kết nối                                                                     |

### Steps

1. Client bắt đầu thiết lập kết nối với server và gửi message SYN, thông báo cho server rằng đã sẵn sàng giao tiếp và số thứ tự gửi đi là bao nhiêu.
2. Server nhận message SYN, chuẩn bị phản hồi cho client: tăng số thứ tự SYN nhận được thêm 1 và gửi lại qua ACK, đồng thời gửi message SYN của riêng mình.
3. Client xác nhận server đã phản hồi, cả hai bên đã thiết lập kết nối ổn định và bắt đầu truyền dữ liệu.

### Example

Host A gửi một gói TCP SYN đến server, chứa một số thứ tự ngẫu nhiên, giả sử ở đây là 1000:

```bash
Host A ===(SYN=1000)===> Server
```

Server cần phản hồi số thứ tự mà Host A đưa ra, nên tăng số thứ tự thêm 1 và đồng thời đưa ra SYN của mình:

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Host A nhận được SYN của Server, cần gửi số thứ tự xác nhận để phản hồi, nên tăng số thứ tự của Server thêm 1:

```bash
Host A ===(ACK=2001)===> Server
```

### Chỉ bắt tay hai bước có được không?

1. Mục đích của bắt tay ba bước là xác nhận khả năng nhận và gửi của cả hai phía (client và server) đều hoạt động bình thường. Nếu chỉ có hai bước, server không thể xác định khả năng nhận của client.
2. Vì thiếu bước thứ ba, client sẽ không nhận được số thứ tự của server, tự nhiên không thể gửi xác nhận, điều này có thể gây nghi ngờ về bảo mật dữ liệu.
3. Trong môi trường mạng yếu, thời gian dữ liệu đến có thể khác nhau. Nếu dữ liệu cũ và mới đến lộn xộn, nếu không có xác nhận SYN ở bước thứ ba mà đã thiết lập kết nối, có thể phát sinh lỗi mạng.

### ISN là gì?

ISN là viết tắt của Initial Sequence Number, dùng để thông báo cho bên nhận số thứ tự khi bên gửi truyền dữ liệu. Đây là số thứ tự được tạo ngẫu nhiên và động, để tránh bị bên thứ ba xâm nhập đoán được và từ đó giả mạo thông tin.

### Tại thời điểm nào trong bắt tay ba bước thì bắt đầu truyền dữ liệu?

Mục đích của bước thứ nhất và thứ hai là xác nhận khả năng nhận gửi của cả hai bên, không thể truyền dữ liệu. Giả sử ở bước đầu tiên đã có thể truyền dữ liệu, thì bên thứ ba ác ý có thể gửi số lượng lớn dữ liệu giả, buộc server tiêu tốn bộ nhớ để cache, tạo cơ hội bị tấn công.

Chỉ ở bước thứ ba, khi cả hai bên đã đồng bộ xác nhận xong và đang ở trạng thái kết nối, mới cho phép truyền dữ liệu.

### Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)

## 3. Mô tả cơ chế cache HTTP

Cơ chế cache HTTP là kỹ thuật trong giao thức HTTP dùng để lưu trữ tạm thời (hay "cache") dữ liệu trang web, nhằm giảm tải cho server, giảm độ trễ và tăng tốc độ tải trang. Dưới đây là các chiến lược cache chính:

1. **Cache mạnh (Freshness)** : Bằng cách thiết lập header response `Expires` hoặc `Cache-Control: max-age`, chỉ ra rằng dữ liệu có thể được coi là mới trong một khoảng thời gian cụ thể. Phía client không cần xác nhận với server mà có thể sử dụng trực tiếp.

2. **Cache xác thực (Validation)** : Sử dụng header response `Last-Modified` và `ETag`, phía client có thể gửi request có điều kiện đến server. Nếu dữ liệu chưa được sửa đổi, server trả về mã trạng thái 304 (Not Modified), cho biết có thể sử dụng dữ liệu cache cục bộ.

3. **Cache thương lượng (Negotiation)** : Phương thức này dựa vào header response `Vary`. Server dựa trên request của client (như `Accept-Language`) để quyết định có cung cấp phiên bản cache khác hay không.

4. **Không cache (No-store)** : Nếu thiết lập `Cache-Control: no-store`, nghĩa là dữ liệu không nên được cache, mỗi request đều cần lấy dữ liệu mới nhất từ server.

Việc lựa chọn chiến lược cache phụ thuộc vào các yếu tố như loại dữ liệu và tần suất cập nhật. Chiến lược cache hiệu quả có thể cải thiện đáng kể hiệu năng của ứng dụng web.

### Service Worker

Theo kinh nghiệm cá nhân, sau khi thiết lập PWA cho Web App, có thể cache một số style cơ bản, logo, thậm chí chuẩn bị file offline.html cho sử dụng ngoại tuyến, đăng ký trong service-worker.js. Như vậy, ngay cả khi người dùng mất kết nối, nhờ cơ chế cache này, họ vẫn có thể biết trạng thái hiện tại của website hoặc mạng, duy trì một mức độ trải nghiệm người dùng nhất định.
