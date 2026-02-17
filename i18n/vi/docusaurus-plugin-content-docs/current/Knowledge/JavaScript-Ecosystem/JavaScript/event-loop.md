---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> Tại sao JavaScript cần xử lý bất đồng bộ? Và hãy giải thích callback và event loop

Bản chất của JavaScript là ngôn ngữ đơn luồng (single-thread), vì một trong những nhiệm vụ của nó là thao tác cấu trúc DOM của trình duyệt. Nếu đa luồng đồng thời sửa đổi cùng một node, tình huống sẽ trở nên rất phức tạp. Để tránh điều này, đơn luồng được áp dụng.

Xử lý bất đồng bộ là một giải pháp khả thi trong bối cảnh đơn luồng. Giả sử một thao tác cần đợi 2 giây, trình duyệt không thể đứng yên chờ 2 giây. Vì vậy, nó sẽ thực hiện tất cả các công việc đồng bộ trước, còn các công việc bất đồng bộ được đặt vào task queue (hàng đợi tác vụ).

Môi trường nơi trình duyệt thực hiện công việc đồng bộ có thể hiểu là call stack. Trình duyệt thực hiện tuần tự các tác vụ trong call stack. Khi phát hiện call stack trống, nó lấy các tác vụ đang chờ từ task queue và đặt vào call stack để thực hiện tuần tự.

1. Trình duyệt kiểm tra call stack có trống không => Không => Tiếp tục thực hiện tác vụ trong call stack
2. Trình duyệt kiểm tra call stack có trống không => Có => Kiểm tra task queue có tác vụ đang chờ không => Có => Chuyển vào call stack để thực hiện

Quá trình lặp đi lặp lại này chính là khái niệm event loop.

```js
console.log(1);

// Hàm bất đồng bộ này chính là callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// In ra theo thứ tự 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> Tại sao `setInterval` không chính xác về mặt thời gian?

1. Do JavaScript là ngôn ngữ đơn luồng (chỉ có thể thực hiện một tác vụ tại một thời điểm, các tác vụ khác phải chờ trong Queue), khi thời gian thực hiện callback của setInterval vượt quá khoảng thời gian đã thiết lập, lần thực hiện tiếp theo sẽ bị trễ. Ví dụ, nếu setInterval được thiết lập để thực hiện hàm mỗi giây, nhưng một thao tác trong hàm mất 2 giây, lần thực hiện tiếp theo sẽ bị trễ 1 giây. Tích lũy dần, setInterval sẽ ngày càng không chính xác.

2. Trình duyệt hoặc môi trường chạy cũng giới hạn. Trong hầu hết các trình duyệt chính (Chrome, Firefox, Safari, v.v.), khoảng thời gian tối thiểu là khoảng 4 mili giây. Dù thiết lập 1 mili giây, thực tế chỉ thực hiện mỗi 4 mili giây.

3. Khi hệ thống thực hiện các tác vụ tốn nhiều bộ nhớ hoặc CPU, cũng gây ra trễ. Các thao tác như chỉnh sửa video hoặc xử lý hình ảnh có khả năng cao gây trễ.

4. JavaScript có cơ chế Garbage Collection. Nếu trong hàm setInterval tạo nhiều object mà không được sử dụng sau khi thực hiện, chúng sẽ bị GC thu hồi, điều này cũng gây trễ thời gian thực hiện.

### Phương án thay thế

#### requestAnimationFrame

Nếu hiện tại sử dụng `setInterval` để triển khai animation, có thể xem xét sử dụng `requestAnimationFrame` thay thế.

- Đồng bộ với repaint của trình duyệt: Thực hiện khi trình duyệt sẵn sàng vẽ frame mới. Chính xác hơn nhiều so với việc đoán thời điểm repaint bằng setInterval hoặc setTimeout.
- Hiệu suất: Vì đồng bộ với repaint, nó không chạy khi trình duyệt cho rằng không cần repaint. Tiết kiệm tài nguyên tính toán, đặc biệt khi tab không được focus hoặc bị thu nhỏ.
- Tự động điều tiết: Tự động điều chỉnh tần suất thực hiện theo thiết bị và tình huống, thường là 60 frame mỗi giây.
- Tham số thời gian độ chính xác cao: Có thể nhận tham số thời gian độ chính xác cao (kiểu DOMHighResTimeStamp, chính xác đến micro giây) để kiểm soát animation hoặc các thao tác nhạy cảm với thời gian chính xác hơn.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // Nếu phần tử chưa đến đích, tiếp tục animation
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()` cập nhật vị trí phần tử ở mỗi frame (thường là 60 frame mỗi giây) cho đến khi đạt 500 pixel. Phương pháp này tạo hiệu ứng animation mượt mà và tự nhiên hơn so với `setInterval`.
