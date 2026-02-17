---
id: performance-lv2-js-optimization
title: '[Lv2] Tối ưu hiệu năng JavaScript: Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Tối ưu hiệu năng JavaScript thông qua Debounce, Throttle, Time Slicing và requestAnimationFrame, nâng cao trải nghiệm người dùng.

---

## Bối cảnh vấn đề

Trong dự án platform, người dùng thường xuyên thực hiện các thao tác sau:

- **Tìm kiếm** (nhập từ khóa lọc tức thì trong 3000+ sản phẩm)
- **Cuộn danh sách** (theo dõi vị trí và tải thêm khi cuộn)
- **Chuyển danh mục** (lọc hiển thị theo loại sản phẩm)
- **Hiệu ứng animation** (cuộn mượt, hiệu ứng quà tặng)

Các thao tác này nếu không tối ưu sẽ gây giật trang và CPU chiếm dụng quá cao.

---

## Chiến lược 1: Debounce (chống rung) - Tối ưu nhập tìm kiếm

```javascript
import { useDebounceFn } from '@vueuse/core';

// Hàm debounce: nếu nhập lại trong 500ms, đếm lại từ đầu
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // Chỉ thực thi sau 500ms ngừng nhập
  }
);
```

```md
Trước tối ưu: nhập "slot game" (9 ký tự)

- Kích hoạt 9 lần tìm kiếm
- Lọc 3000 game × 9 lần = 27,000 phép tính
- Thời gian: khoảng 1.8 giây (trang giật)

Sau tối ưu: nhập "slot game"

- Kích hoạt 1 lần tìm kiếm (sau khi ngừng nhập)
- Lọc 3000 game × 1 lần = 3,000 phép tính
- Thời gian: khoảng 0.2 giây
- Cải thiện hiệu năng: 90%
```

## Chiến lược 2: Throttle (giảm tần) - Tối ưu sự kiện cuộn

> Trường hợp áp dụng: theo dõi vị trí cuộn, tải vô hạn

```javascript
import { throttle } from 'lodash';

// Hàm throttle: trong 100ms chỉ thực thi 1 lần
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
Trước tối ưu:

- Sự kiện scroll kích hoạt 60 lần/giây (60 FPS)
- Mỗi lần kích hoạt đều tính toán vị trí cuộn
- Thời gian: khoảng 600ms (trang giật)

Sau tối ưu:

- Sự kiện scroll tối đa 1 lần mỗi 100ms
- Thời gian: khoảng 100ms
- Cải thiện hiệu năng: 90%
```

## Chiến lược 3: Time Slicing (cắt thời gian) - Xử lý dữ liệu lớn

> Trường hợp áp dụng: tag cloud, kết hợp menu, lọc 3000+ game, render lịch sử giao dịch

```javascript
// Hàm Time Slicing tùy chỉnh
function processInBatches(
  array: GameList, // 3000 game
  batchSize: number, // Mỗi lô xử lý 200
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // Xử lý xong

    const batch = array.slice(index, index + batchSize); // Cắt lô
    callback(batch); // Xử lý lô này
    index += batchSize;

    setTimeout(processNextBatch, 0); // Lô tiếp theo đặt vào hàng đợi
  }

  processNextBatch();
}
```

Ví dụ sử dụng:

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // Cắt 3000 game thành 15 lô, mỗi lô 200
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

## Chiến lược 4: requestAnimationFrame - Tối ưu animation

> Trường hợp áp dụng: cuộn mượt, animation Canvas, hiệu ứng quà tặng

```javascript
const scrollToTopAnimated = (el: any, speed = 500) => {
  const startPosition = el.scrollTop;
  const duration = speed;
  let startTime = null;

  // Sử dụng hàm easing (Easing Function)
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(
      timeElapsed,
      startPosition,
      -startPosition,
      duration
    );
    el.scrollTop = run;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll); // Gọi đệ quy
    }
  };

  requestAnimationFrame(animateScroll);
};
```

Tại sao dùng requestAnimationFrame?

```javascript
// Cách làm sai: dùng setInterval
setInterval(() => {
  el.scrollTop += 10;
}, 16); // Muốn 60fps (1000ms / 60 ≈ 16ms)
// Vấn đề:
// 1. Không đồng bộ với render trình duyệt (có thể thực thi nhiều lần giữa hai lần vẽ)
// 2. Vẫn chạy ở tab ẩn (lãng phí tài nguyên)
// 3. Có thể gây giật khung hình (Jank)

// Cách làm đúng: dùng requestAnimationFrame
requestAnimationFrame(animateScroll);
// Ưu điểm:
// 1. Đồng bộ với render trình duyệt (60fps hoặc 120fps)
// 2. Tự động dừng khi tab không hiển thị (tiết kiệm pin)
// 3. Mượt hơn, không giật khung hình
```

---

## Điểm chính phỏng vấn

### Debounce vs Throttle

| Đặc điểm       | Debounce                              | Throttle                              |
| -------------- | ------------------------------------- | ------------------------------------- |
| Thời điểm kích hoạt | Sau khi ngừng thao tác một khoảng thời gian | Chỉ thực thi 1 lần trong khoảng thời gian cố định |
| Trường hợp áp dụng | Nhập tìm kiếm, resize cửa sổ     | Sự kiện scroll, di chuyển chuột       |
| Số lần thực thi | Có thể không thực thi (nếu kích hoạt liên tục) | Đảm bảo thực thi (tần suất cố định) |
| Độ trễ         | Có độ trễ (đợi ngừng)                 | Thực thi ngay, sau đó giới hạn        |

### Time Slicing vs Web Worker

| Đặc điểm         | Time Slicing                          | Web Worker                            |
| ---------------- | ------------------------------------- | ------------------------------------- |
| Môi trường thực thi | Thread chính                       | Thread nền                            |
| Trường hợp áp dụng | Nhiệm vụ cần thao tác DOM          | Nhiệm vụ tính toán thuần              |
| Độ phức tạp triển khai | Đơn giản hơn                     | Phức tạp hơn (cần giao tiếp)          |
| Cải thiện hiệu năng | Tránh chặn thread chính            | Tính toán song song thực sự           |

### Câu hỏi phỏng vấn thường gặp

**Q: Chọn Debounce hay Throttle như thế nào?**

A: Theo trường hợp sử dụng:

- **Debounce**: phù hợp với tình huống "đợi người dùng hoàn thành thao tác" (như nhập tìm kiếm)
- **Throttle**: phù hợp với tình huống "cần cập nhật liên tục nhưng không quá thường xuyên" (như theo dõi cuộn)

**Q: Chọn Time Slicing hay Web Worker như thế nào?**

A:

- **Time Slicing**: cần thao tác DOM, xử lý dữ liệu đơn giản
- **Web Worker**: tính toán thuần, xử lý dữ liệu lớn, không cần DOM

**Q: Ưu điểm của requestAnimationFrame là gì?**

A:

1. Đồng bộ với render trình duyệt (60fps)
2. Tự động dừng khi tab không hiển thị (tiết kiệm pin)
3. Không giật khung hình (Jank)
4. Hiệu năng tốt hơn setInterval/setTimeout
