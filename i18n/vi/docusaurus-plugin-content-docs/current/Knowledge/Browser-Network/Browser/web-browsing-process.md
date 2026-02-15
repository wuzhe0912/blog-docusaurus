---
id: web-browsing-process
title: "\U0001F4C4 Quy trình duyệt web"
slug: /web-browsing-process
---

## 1. Giải thích cách trình duyệt lấy HTML từ server và render HTML lên màn hình

> Mô tả cách trình duyệt lấy HTML từ phía server và cách render HTML trên trình duyệt.

### 1. Gửi request

- **Nhập URL** : Người dùng nhập URL vào trình duyệt hoặc nhấp vào một liên kết, trình duyệt sẽ bắt đầu phân tích URL này để xác định server nào cần gửi request.
- **Tra cứu DNS** : Trình duyệt thực hiện tra cứu DNS để tìm địa chỉ IP của server tương ứng.
- **Thiết lập kết nối** : Trình duyệt gửi request đến địa chỉ IP của server thông qua giao thức HTTP hoặc HTTPS. Nếu là HTTPS, cần thực hiện thêm kết nối SSL/TLS.

### 2. Server phản hồi

- **Xử lý request** : Server nhận request và dựa trên đường dẫn cùng tham số, đọc dữ liệu tương ứng từ cơ sở dữ liệu.
- **Gửi Response** : Sau đó server gửi tài liệu HTML như một phần của HTTP Response về trình duyệt. Response còn bao gồm các thông tin như mã trạng thái và các tham số khác (CORS, content-type), v.v.

### 3. Phân tích HTML

- **Xây dựng DOM Tree** : Trình duyệt bắt đầu đọc tài liệu HTML, dựa trên các thẻ và thuộc tính HTML, chuyển đổi thành DOM và xây dựng DOM Tree trong bộ nhớ.
- **Requesting subresources (yêu cầu tài nguyên phụ)** : Trong quá trình phân tích HTML, nếu gặp tài nguyên bên ngoài như CSS, JavaScript, hình ảnh, trình duyệt sẽ gửi thêm request đến server để lấy các tài nguyên này.

### 4. Render Page (render trang)

- **Xây dựng CSSOM Tree** : Trình duyệt phân tích các file CSS và xây dựng CSSOM Tree.
- **Render Tree** : Trình duyệt kết hợp DOM Tree và CSSOM Tree thành một Render Tree, chứa tất cả các node cần render cùng với style tương ứng.
- **Layout (bố cục)** : Trình duyệt thực hiện bố cục (Layout hoặc Reflow), tính toán vị trí và kích thước của mỗi node.
- **Paint (vẽ)** : Cuối cùng, trình duyệt đi qua giai đoạn vẽ (painting), vẽ nội dung của mỗi node lên trang.

### 5. Tương tác JavaScript

- **Thực thi JavaScript** : Nếu HTML chứa JavaScript, trình duyệt sẽ phân tích và thực thi. Hành động này có thể thay đổi DOM và chỉnh sửa style.

Toàn bộ quy trình diễn ra theo hình thức tuần tự. Về lý thuyết, người dùng sẽ thấy một phần nội dung trang web trước, sau đó mới thấy trang hoàn chỉnh. Trong quá trình này, có thể xảy ra nhiều lần reflow và repaint, đặc biệt khi trang chứa các style phức tạp hoặc hiệu ứng tương tác. Ngoài các tối ưu hóa tích hợp của trình duyệt, lập trình viên thường áp dụng các kỹ thuật khác nhau để mang lại trải nghiệm người dùng mượt mà hơn.

## 2. Mô tả Reflow và Repaint

### Reflow (tái bố cục)

Reflow đề cập đến các thay đổi trong DOM của trang web khiến trình duyệt phải tính toán lại vị trí của các phần tử và đặt chúng vào đúng vị trí. Nói đơn giản, Layout cần sắp xếp lại các phần tử.

#### Kích hoạt Reflow

Reflow xảy ra trong hai tình huống: một là thay đổi toàn cục ảnh hưởng toàn bộ trang, hai là thay đổi cục bộ ảnh hưởng một khối component.

- Lần tải trang đầu tiên là lần reflow có ảnh hưởng lớn nhất.
- Thêm hoặc xóa phần tử DOM.
- Thay đổi kích thước phần tử, ví dụ thêm nội dung hoặc thay đổi cỡ chữ.
- Điều chỉnh cách bố cục phần tử, ví dụ thông qua margin hoặc padding.
- Thay đổi kích thước cửa sổ trình duyệt.
- Kích hoạt pseudo-class, ví dụ hiệu ứng hover.

### Repaint (vẽ lại)

Repaint xảy ra khi không có thay đổi Layout, chỉ đơn thuần cập nhật hoặc thay đổi giao diện phần tử. Vì phần tử nằm trong Layout, nên nếu xảy ra reflow thì chắc chắn sẽ dẫn đến repaint. Ngược lại, chỉ xảy ra repaint thì không nhất thiết gây ra reflow.

#### Kích hoạt Repaint

- Thay đổi màu sắc hoặc nền của phần tử, ví dụ thêm thuộc tính color hoặc điều chỉnh thuộc tính background.
- Thay đổi bóng đổ hoặc border của phần tử cũng thuộc về repaint.

### Cách tối ưu Reflow hoặc Repaint

- Không sử dụng table để bố cục. Thuộc tính của table dễ gây ra sắp xếp lại bố cục khi thay đổi. Nếu bắt buộc phải sử dụng, nên thêm thuộc tính sau để chỉ render một hàng mỗi lần, tránh ảnh hưởng toàn bộ bảng: `table-layout: auto;` hoặc `table-layout: fixed;`.
- Không nên thao tác DOM để điều chỉnh style từng cái một, mà nên định nghĩa các style cần thay đổi trong class, sau đó chuyển đổi qua JavaScript.
  - Lấy ví dụ framework Vue, có thể dùng binding class để chuyển đổi style thay vì dùng function để trực tiếp sửa style.
- Đối với các tình huống cần chuyển đổi thường xuyên, ví dụ chuyển tab, nên ưu tiên sử dụng `v-show` thay vì `v-if`. Cái trước chỉ sử dụng thuộc tính CSS `display: none;` để ẩn, trong khi cái sau kích hoạt lifecycle, tạo mới hoặc hủy phần tử, tốn nhiều hiệu năng hơn.
- Nếu thực sự bắt buộc phải kích hoạt reflow, có thể tối ưu bằng `requestAnimationFrame` (chủ yếu vì API này được thiết kế cho animation và đồng bộ với tốc độ khung hình của trình duyệt), giúp gộp nhiều lần reflow thành một lần và giảm số lần repaint.
  - Ví dụ, với animation cần di chuyển đến mục tiêu trên trang, có thể dùng `requestAnimationFrame` để tính toán mỗi lần di chuyển.
  - Tương tự, một số thuộc tính CSS3 có thể kích hoạt tăng tốc phần cứng phía client, cải thiện hiệu năng animation: `transform`, `opacity`, `filters`, `Will-change`.
- Nếu điều kiện cho phép, hãy thay đổi style trên các node DOM cấp thấp hơn để tránh thay đổi style phần tử cha ảnh hưởng đến tất cả phần tử con.
- Nếu cần thực hiện animation, hãy sử dụng trên các phần tử có vị trí tuyệt đối (`absolute`, `fixed`), ít ảnh hưởng đến các phần tử khác, chỉ kích hoạt repaint và tránh reflow.

### Example

```js
// bad
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// good
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

### Reference

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
- [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)

## 3. Mô tả khi nào trình duyệt gửi request OPTIONS đến server

> Giải thích trình duyệt gửi OPTIONS đến server trong trường hợp nào.

Trong phần lớn trường hợp, điều này được áp dụng trong ngữ cảnh CORS. Trước khi gửi request thực tế, sẽ có một hành động preflight (kiểm tra trước): trình duyệt gửi trước một request OPTIONS để hỏi server có cho phép request cross-origin này hay không. Nếu server phản hồi cho phép, trình duyệt mới gửi request thực sự. Ngược lại, nếu không cho phép, trình duyệt sẽ hiển thị lỗi.

Ngoài ra, nếu method của request không phải là `GET`, `HEAD`, `POST` cũng sẽ kích hoạt request OPTIONS.
