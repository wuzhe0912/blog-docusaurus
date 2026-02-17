---
id: performance-lv3-virtual-scroll
title: '[Lv3] Triển khai Virtual Scrolling: xử lý render dữ liệu lớn'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Khi trang cần render 1000+ dòng dữ liệu, Virtual Scrolling giảm node DOM từ 1000+ xuống 20-30, giảm sử dụng bộ nhớ 80%.

---

## Câu hỏi tình huống phỏng vấn

**Q: Khi trang có nhiều table, mỗi table có hơn trăm dòng dữ liệu, đồng thời có event cập nhật DOM thường xuyên, bạn sẽ dùng phương pháp gì để tối ưu hiệu năng trang này?**

---

## Phân tích vấn đề (Situation)

### Tình huống thực tế

Trong dự án platform, một số trang cần xử lý dữ liệu lớn:

```markdown
Trang lịch sử
├─ Bảng nạp tiền: 1000+ dòng
├─ Bảng rút tiền: 800+ dòng
├─ Bảng đặt cược: 5000+ dòng
└─ Mỗi dòng có 8-10 cột (thời gian, số tiền, trạng thái, v.v.)

Vấn đề khi chưa tối ưu
├─ Số node DOM: 1000 dòng × 10 cột = 10,000+ node
├─ Chiếm bộ nhớ: khoảng 150-200 MB
├─ Thời gian render đầu: 3-5 giây (màn hình trắng)
├─ Giật khi cuộn: FPS < 20
└─ Khi WebSocket cập nhật: toàn bộ table bị render lại (rất chậm)
```

### Mức độ nghiêm trọng

```javascript
// ❌ Cách truyền thống
<tr v-for="record in allRecords">  // 1000+ dòng render hết
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8-10 cột
</tr>

// Kết quả:
// - Render ban đầu: 10,000+ node DOM
// - Người dùng thực tế nhìn thấy: 20-30 dòng
// - Lãng phí: 99% node người dùng không nhìn thấy
```

---

## Giải pháp (Action)

### Virtual Scrolling

Xem xét tối ưu Virtual Scrolling, có hai hướng chính: một là chọn thư viện thứ ba được chính thức khuyên nghị như [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller), xác định phạm vi dòng hiển thị theo tham số và nhu cầu.

```js
// Chỉ render dòng hiển thị, ví dụ:
// - 100 dòng dữ liệu, chỉ render 20 dòng hiển thị
// - Giảm đáng kể số node DOM
```

Hướng khác là tự code tay, nhưng xét đến chi phí phát triển thực tế và các tình huống bao phủ, tôi sẽ nghiêng về thư viện thứ ba được khuyên nghị.

### Kiểm soát tần suất cập nhật dữ liệu

> Giải pháp 1: requestAnimationFrame (RAF)
> Khái niệm: trình duyệt tối đa chỉ vẽ lại 60 lần/giây (60 FPS), cập nhật nhanh hơn mắt người cũng không thấy, nên đồng bộ với tần suất làm mới màn hình

```js
// ❌ Trước: nhận dữ liệu là cập nhật ngay (có thể 100 lần/giây)
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// ✅ Cải thiện: thu thập dữ liệu, đồng bộ cập nhật với tần suất màn hình (tối đa 60 lần/giây)
let latestPrice = null;
let isScheduled = false;

socket.on('price', (newPrice) => {
  latestPrice = newPrice;

  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(() => {
      btcPrice.value = latestPrice;
      isScheduled = false;
    });
  }
});
```

Giải pháp 2: Throttle
Khái niệm: cưỡng chế giới hạn tần suất cập nhật, ví dụ "mỗi 100ms tối đa cập nhật 1 lần"

```js
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100);

socket.on('price', updatePrice);
```

### Tối ưu đặc thù Vue 3

Một số cú pháp đường của Vue 3 cung cấp tối ưu hiệu năng, như v-memo, dù cá nhân tôi ít khi sử dụng tình huống này.

```js
// 1. v-memo - ghi nhớ các cột ít thay đổi
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // Chỉ render lại khi các trường này thay đổi
</tr>

// 2. Đóng băng dữ liệu tĩnh, tránh chi phí reactive
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef cho mảng lớn
const tableData = shallowRef([...])  // Chỉ theo dõi mảng, không theo dõi object bên trong

// 4. Dùng key tối ưu thuật toán diff
<tr v-for="row in data" :key="row.id">  // Key ổn định
```

### Tối ưu render DOM

```scss
// Dùng CSS transform thay vì top/left
.row-update {
  transform: translateY(0); /* Kích hoạt GPU tăng tốc */
  will-change: transform; /* Gợi ý trình duyệt tối ưu */
}

// CSS containment cách ly phạm vi render
.table-container {
  contain: layout style paint;
}
```

---

## Kết quả tối ưu (Result)

### So sánh hiệu năng

| Chỉ số          | Trước tối ưu   | Sau tối ưu     | Cải thiện  |
| --------------- | -------------- | -------------- | ---------- |
| Số node DOM     | 10,000+        | 20-30          | ↓ 99.7%   |
| Sử dụng bộ nhớ  | 150-200 MB     | 30-40 MB       | ↓ 80%     |
| Render đầu      | 3-5 giây       | 0.3-0.5 giây   | ↑ 90%     |
| FPS cuộn        | < 20           | 55-60          | ↑ 200%    |
| Phản hồi cập nhật | 500-800 ms   | 16-33 ms       | ↑ 95%     |

### Kết quả thực tế

```markdown
✅ Virtual Scrolling
├─ Chỉ render 20-30 dòng hiển thị
├─ Cập nhật động phạm vi hiển thị khi cuộn
├─ Người dùng không cảm nhận (trải nghiệm mượt)
└─ Bộ nhớ ổn định (không tăng theo lượng dữ liệu)

✅ Cập nhật dữ liệu qua RAF
├─ WebSocket 100 cập nhật/giây → tối đa 60 render
├─ Đồng bộ với tần suất làm mới (60 FPS)
└─ Sử dụng CPU giảm 60%

✅ Tối ưu Vue 3
├─ v-memo: tránh render lại không cần thiết
├─ shallowRef: giảm chi phí reactive
└─ :key ổn định: tối ưu thuật toán diff
```

---

## Điểm chính phỏng vấn

### Câu hỏi mở rộng thường gặp

**Q: Nếu không dùng thư viện thứ ba thì sao?**
A: Tự triển khai logic cốt lõi của Virtual Scrolling:

```javascript
const itemHeight = 50;
const containerHeight = 600;
const visibleCount = Math.ceil(containerHeight / itemHeight);

const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

const visibleItems = allItems.slice(startIndex, endIndex);

const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

**Q: Xử lý kết nối lại khi WebSocket mất kết nối như thế nào?**
A: Triển khai chiến lược kết nối lại với exponential backoff:

```javascript
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000;

function reconnect() {
  if (retryCount >= maxRetries) {
    showError('Không thể kết nối, vui lòng tải lại trang');
    return;
  }

  const delay = baseDelay * Math.pow(2, retryCount);

  setTimeout(() => {
    retryCount++;
    connectWebSocket();
  }, delay);
}

socket.on('connect', () => {
  retryCount = 0;
  syncData();
  showSuccess('Đã kết nối lại');
});
```

**Q: Virtual Scroll có nhược điểm gì?**
A: Cần lưu ý các đánh đổi:

```markdown
❌ Nhược điểm
├─ Không thể dùng tìm kiếm gốc trình duyệt (Ctrl+F)
├─ Chức năng "chọn tất cả" cần xử lý đặc biệt
├─ Độ phức tạp triển khai cao
├─ Cần chiều cao cố định hoặc tính trước chiều cao
└─ Tính năng accessibility cần xử lý bổ sung

✅ Trường hợp phù hợp
├─ Lượng dữ liệu > 100 dòng
├─ Cấu trúc dữ liệu tương tự (chiều cao cố định)
├─ Cần cuộn hiệu năng cao
└─ Chủ yếu xem (không chỉnh sửa)

❌ Trường hợp không phù hợp
├─ Lượng dữ liệu < 50 dòng (thiết kế quá mức)
├─ Chiều cao không cố định (triển khai khó)
├─ Nhiều tương tác (multi-select, kéo thả)
└─ Cần in toàn bộ bảng
```

**Q: Tối ưu danh sách chiều cao không đều như thế nào?**
A: Dùng Virtual Scrolling chiều cao động:

```javascript
// Phương án 1: chiều cao ước tính + đo thực tế
const estimatedHeight = 50;
const measuredHeights = {};

onMounted(() => {
  const elements = document.querySelectorAll('.list-item');
  elements.forEach((el, index) => {
    measuredHeights[index] = el.offsetHeight;
  });
});

// Phương án 2: dùng thư viện hỗ trợ chiều cao động
<DynamicScroller
  :items="items"
  :min-item-size="50"
  :buffer="200"
/>
```

---

## So sánh kỹ thuật

### Virtual Scroll vs Phân trang

| Tiêu chí         | Virtual Scroll            | Phân trang truyền thống   |
| ---------------- | ------------------------- | ------------------------- |
| Trải nghiệm người dùng | Cuộn liên tục (tốt hơn) | Cần lật trang (gián đoạn) |
| Hiệu năng        | Luôn chỉ render vùng hiển thị | Render toàn bộ mỗi trang |
| Độ khó triển khai | Phức tạp hơn             | Đơn giản                  |
| SEO              | Kém hơn                   | Tốt hơn                   |
| Accessibility    | Cần xử lý đặc biệt        | Hỗ trợ gốc                |

**Khuyên nghị:**

- Back-office, Dashboard → Virtual Scroll
- Trang web công khai, blog → Phân trang truyền thống
- Giải pháp kết hợp: Virtual Scroll + nút "Tải thêm"
