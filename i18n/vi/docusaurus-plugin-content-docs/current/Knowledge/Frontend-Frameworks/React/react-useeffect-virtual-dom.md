---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect và Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> `useEffect` là gì?

### Khái niệm cốt lõi

`useEffect` là một Hook chịu trách nhiệm quản lý các hiệu ứng phụ (side effects) trong các component hàm của React. Nó được thực thi sau khi component render để thực hiện các yêu cầu dữ liệu bất đồng bộ, đăng ký, thao tác DOM hoặc đồng bộ hóa trạng thái thủ công, tương ứng với các phương thức vòng đời `componentDidMount`, `componentDidUpdate` và `componentWillUnmount` của class component.

### Các trường hợp sử dụng phổ biến

- Lấy dữ liệu từ xa và cập nhật trạng thái component
- Duy trì các đăng ký hoặc trình lắng nghe sự kiện (như `resize`, `scroll`)
- Tương tác với các API của trình duyệt (như cập nhật `document.title`, thao tác `localStorage`)
- Dọn dẹp tài nguyên còn sót lại từ lần render trước (như hủy yêu cầu, xóa trình lắng nghe)

<details>
<summary>Nhấp để xem ví dụ sử dụng cơ bản</summary>

```javascript
import { useEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Số lần nhấp: ${count}`;
  });

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      Nhấp vào đây
    </button>
  );
}
```

</details>

## 2. When does `useEffect` run?

> `useEffect` được thực thi khi nào?

Tham số thứ hai của `useEffect` là **mảng phụ thuộc (dependency array)**, được sử dụng để kiểm soát thời điểm thực thi hiệu ứng phụ. React so sánh từng giá trị trong mảng và thực thi lại hiệu ứng phụ khi phát hiện thay đổi, đồng thời kích hoạt hàm dọn dẹp trước lần thực thi tiếp theo.

### 2.1 Các mẫu phụ thuộc phổ biến

```javascript
// 1. Thực thi sau mỗi lần render (bao gồm lần đầu tiên)
useEffect(() => {
  console.log('Kích hoạt khi bất kỳ state nào thay đổi');
});

// 2. Chỉ thực thi một lần khi render lần đầu
useEffect(() => {
  console.log('Chỉ thực thi khi component mount');
}, []);

// 3. Chỉ định biến phụ thuộc
useEffect(() => {
  console.log('Chỉ kích hoạt khi selectedId thay đổi');
}, [selectedId]);
```

### 2.2 Hàm dọn dẹp và giải phóng tài nguyên

```javascript
useEffect(() => {
  const handler = () => {
    console.log('Đang lắng nghe');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
    console.log('Đã hủy lắng nghe');
  };
}, []);
```

Ví dụ trên sử dụng hàm dọn dẹp để hủy trình lắng nghe sự kiện. React sẽ thực thi hàm dọn dẹp trước khi component bị unmount hoặc trước khi các biến phụ thuộc được cập nhật, đảm bảo không có rò rỉ bộ nhớ và trình lắng nghe trùng lặp.

## 3. What is the difference between Real DOM and Virtual DOM?

> Sự khác biệt giữa Real DOM và Virtual DOM là gì?

| Khía cạnh | Real DOM | Virtual DOM |
| -------- | -------------------------------- | ------------------------------ |
| Cấu trúc | Các nút vật lý được trình duyệt duy trì | Các nút được mô tả bằng đối tượng JavaScript |
| Chi phí cập nhật | Thao tác trực tiếp kích hoạt reflow và repaint, chi phí cao | Tính toán sự khác biệt trước rồi áp dụng theo lô, chi phí thấp |
| Chiến lược cập nhật | Phản ánh ngay lập tức lên màn hình | Xây dựng cây mới trong bộ nhớ trước rồi so sánh sự khác biệt |
| Khả năng mở rộng | Cần kiểm soát thủ công quy trình cập nhật | Có thể chèn logic trung gian (Diff, xử lý theo lô) |

### Tại sao React sử dụng Virtual DOM

```javascript
// Minh họa quy trình đơn giản hóa (không phải mã nguồn thực tế của React)
function renderWithVirtualDOM(newVNode, container) {
  const prevVNode = container.__vnode;
  const patches = diff(prevVNode, newVNode);
  applyPatches(container, patches);
  container.__vnode = newVNode;
}
```

Virtual DOM cho phép React thực hiện Diff trong bộ nhớ trước, lấy danh sách cập nhật tối thiểu, sau đó đồng bộ hóa một lần duy nhất tới Real DOM, tránh các reflow và repaint thường xuyên.

## 4. How to coordinate `useEffect` and Virtual DOM?

> `useEffect` và Virtual DOM phối hợp như thế nào?

Quy trình render của React được chia thành Render Phase và Commit Phase. Điểm quan trọng trong sự phối hợp giữa `useEffect` và Virtual DOM là: hiệu ứng phụ phải đợi cho đến khi việc cập nhật Real DOM hoàn tất mới được thực thi.

### Render Phase (Giai đoạn render)

- React xây dựng Virtual DOM mới và tính toán sự khác biệt với phiên bản trước
- Giai đoạn này là phép tính hàm thuần, có thể bị gián đoạn hoặc thực thi lại

### Commit Phase (Giai đoạn commit)

- React áp dụng sự khác biệt lên Real DOM
- `useLayoutEffect` được thực thi đồng bộ trong giai đoạn này, đảm bảo DOM đã được cập nhật

### Effect Execution (Thời điểm thực thi hiệu ứng phụ)

- `useEffect` được thực thi sau khi Commit Phase kết thúc và trình duyệt đã vẽ xong
- Điều này tránh cho hiệu ứng phụ chặn việc cập nhật giao diện, cải thiện trải nghiệm người dùng

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/profile', { signal: controller.signal })
    .then((res) => res.json())
    .then(setProfile)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Tải thất bại', error);
      }
    });

  return () => {
    controller.abort(); // Đảm bảo hủy yêu cầu khi phụ thuộc cập nhật hoặc component unmount
  };
}, [userId]);
```

## 5. Quiz Time

> Bài kiểm tra
> Mô phỏng tình huống phỏng vấn

### Câu hỏi: Giải thích thứ tự thực thi của đoạn mã sau và viết kết quả đầu ra

```javascript
import { useEffect, useState } from 'react';

function Demo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('effect 1');
    return () => {
      console.log('cleanup 1');
    };
  });

  useEffect(() => {
    console.log('effect 2');
  }, [visible]);

  return (
    <>
      <p>Trạng thái: {visible ? 'Hiển thị' : 'Ẩn'}</p>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        Chuyển đổi
      </button>
    </>
  );
}
```

<details>
<summary>Nhấp để xem đáp án</summary>

- Sau lần render đầu tiên, `effect 1` rồi `effect 2` được xuất theo thứ tự. `useEffect` đầu tiên không có mảng phụ thuộc, `useEffect` thứ hai phụ thuộc vào `visible`, giá trị ban đầu là `false` nhưng vẫn thực thi một lần.
- Sau khi nhấn nút, `setVisible` được kích hoạt. Ở lần render tiếp theo, hàm dọn dẹp của lần trước sẽ được thực thi trước, xuất `cleanup 1`, sau đó thực thi `effect 1` và `effect 2` mới.
- Vì `visible` thay đổi mỗi lần chuyển đổi, `effect 2` sẽ được thực thi lại sau mỗi lần chuyển đổi.

Thứ tự đầu ra cuối cùng là: `effect 1` → `effect 2` → (sau khi nhấp) `cleanup 1` → `effect 1` → `effect 2`.

</details>

## 6. Best Practices

> Thực hành tốt nhất

### Các phương pháp được khuyến nghị

- Duy trì cẩn thận mảng phụ thuộc, kết hợp với quy tắc ESLint `react-hooks/exhaustive-deps`.
- Tách các `useEffect` theo trách nhiệm để giảm sự ghép nối do các hiệu ứng phụ lớn gây ra.
- Giải phóng trình lắng nghe hoặc hủy các yêu cầu bất đồng bộ trong hàm dọn dẹp để tránh rò rỉ bộ nhớ.
- Sử dụng `useLayoutEffect` khi cần đọc thông tin bố cục ngay sau khi DOM được cập nhật, nhưng cần đánh giá tác động hiệu năng.

### Ví dụ: Tách các trách nhiệm khác nhau

```javascript
useEffect(() => {
  document.title = `Người dùng hiện tại: ${user.name}`;
}, [user.name]); // Quản lý document.title

useEffect(() => {
  const subscription = chatClient.subscribe(roomId);
  return () => subscription.unsubscribe();
}, [roomId]); // Quản lý kết nối phòng chat
```

## 7. Interview Summary

> Tổng kết phỏng vấn

### Ôn tập nhanh

1. `useEffect` kiểm soát thời điểm thực thi thông qua mảng phụ thuộc; hàm dọn dẹp chịu trách nhiệm giải phóng tài nguyên.
2. Virtual DOM sử dụng thuật toán Diff để tìm tập cập nhật tối thiểu, giảm chi phí thao tác Real DOM.
3. Hiểu Render Phase và Commit Phase giúp trả lời chính xác mối quan hệ giữa hiệu ứng phụ và quy trình render.
4. Mở rộng phỏng vấn có thể bổ sung chiến lược tối ưu hiệu năng, như cập nhật theo lô, tải chậm và memoization.

### Mẫu trả lời phỏng vấn

> "React khi render sẽ xây dựng Virtual DOM trước, tính toán sự khác biệt rồi mới vào Commit Phase để cập nhật Real DOM. `useEffect` được thực thi sau khi commit hoàn tất và trình duyệt đã vẽ xong, vì vậy phù hợp để xử lý các yêu cầu bất đồng bộ hoặc lắng nghe sự kiện. Chỉ cần duy trì đúng mảng phụ thuộc và nhớ sử dụng hàm dọn dẹp, có thể tránh được rò rỉ bộ nhớ và vấn đề race condition."

## Reference

> Tài liệu tham khảo

- [Tài liệu chính thức React: Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [Tài liệu chính thức React: Rendering](https://react.dev/learn/rendering)
- [Tài liệu chính thức React: Rendering Optimizations](https://react.dev/learn/escape-hatches#removing-effect-dependencies)
