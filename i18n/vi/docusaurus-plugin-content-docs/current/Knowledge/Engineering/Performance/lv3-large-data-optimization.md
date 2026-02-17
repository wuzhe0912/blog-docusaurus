---
id: performance-lv3-large-data-optimization
title: '[Lv3] Chiến lược tối ưu dữ liệu lớn: lựa chọn giải pháp và triển khai'
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> Khi giao diện cần hiển thị hàng vạn dữ liệu, làm thế nào để cân bằng giữa hiệu năng, trải nghiệm người dùng và chi phí phát triển?

## Câu hỏi tình huống phỏng vấn

**Q: Khi giao diện có hàng vạn dữ liệu, bạn sẽ tối ưu như thế nào?**

Đây là câu hỏi mở, người phỏng vấn mong đợi nghe không chỉ một giải pháp duy nhất:

1. **Đánh giá nhu cầu**: có thực sự cần hiển thị nhiều dữ liệu cùng lúc như vậy không?
2. **Lựa chọn giải pháp**: có những phương án nào? Ưu nhược điểm của từng cái?
3. **Suy nghĩ toàn diện**: front-end + back-end + UX kết hợp
4. **Kinh nghiệm thực tế**: lý do chọn và kết quả triển khai

---

## Bước đầu tiên: Đánh giá nhu cầu

Trước khi chọn giải pháp kỹ thuật, hãy tự hỏi những câu hỏi này:

### Câu hỏi cốt lõi

```markdown
❓ Người dùng có thực sự cần nhìn thấy tất cả dữ liệu không?
→ Phần lớn trường hợp, người dùng chỉ quan tâm 50-100 dòng đầu
→ Có thể thu hẹp phạm vi qua lọc, tìm kiếm, sắp xếp

❓ Dữ liệu có cần cập nhật thời gian thực không?
→ WebSocket thời gian thực vs polling định kỳ vs chỉ tải lần đầu

❓ Chế độ thao tác của người dùng là gì?
→ Duyệt là chính → Virtual Scrolling
→ Tìm dữ liệu cụ thể → tìm kiếm + phân trang
→ Xem từng dòng → cuộn vô hạn

❓ Cấu trúc dữ liệu có cố định không?
→ Chiều cao cố định → Virtual Scrolling dễ triển khai
→ Chiều cao không cố định → cần tính toán chiều cao dòng

❓ Có cần chọn tất cả, in hoặc xuất không?
→ Cần → Virtual Scrolling có giới hạn
→ Không cần → Virtual Scrolling là lựa chọn tốt nhất
```

### Phân tích trường hợp thực tế

```javascript
// Trường hợp 1: Lịch sử giao dịch (10,000+ dòng)
Hành vi người dùng: xem giao dịch gần đây, thỉnh thoảng tìm theo ngày
Giải pháp tốt nhất: phân trang back-end + tìm kiếm

// Trường hợp 2: Danh sách game thời gian thực (3,000+ tựa)
Hành vi người dùng: duyệt, lọc theo danh mục, cuộn mượt
Giải pháp tốt nhất: Virtual Scrolling + lọc front-end

// Trường hợp 3: Feed mạng xã hội (tăng trưởng vô hạn)
Hành vi người dùng: cuộn liên tục xuống, không cần chuyển trang
Giải pháp tốt nhất: cuộn vô hạn + tải theo lô

// Trường hợp 4: Báo cáo dữ liệu (bảng phức tạp)
Hành vi người dùng: xem, sắp xếp, xuất
Giải pháp tốt nhất: phân trang back-end + API xuất
```

---

## Tổng quan các giải pháp tối ưu

### Bảng so sánh giải pháp

| Giải pháp        | Trường hợp áp dụng           | Ưu điểm                    | Nhược điểm                 | Độ khó     | Hiệu năng  |
| ---------------- | ---------------------------- | -------------------------- | -------------------------- | ---------- | ---------- |
| **Phân trang back-end** | Phần lớn trường hợp    | Đơn giản, đáng tin cậy, SEO friendly | Cần lật trang, gián đoạn trải nghiệm | 1/5 Đơn giản | 3/5 Trung bình |
| **Virtual Scrolling** | Dữ liệu lớn chiều cao cố định | Hiệu năng tối đa, cuộn mượt | Triển khai phức tạp, không tìm kiếm gốc | 4/5 Phức tạp | 5/5 Xuất sắc |
| **Cuộn vô hạn**  | Mạng xã hội, tin tức         | Trải nghiệm liên tục, triển khai đơn giản | Tích lũy bộ nhớ, không nhảy trang | 2/5 Đơn giản | 3/5 Trung bình |
| **Tải theo lô**  | Tối ưu tải lần đầu           | Tải dần, kết hợp skeleton screen | Cần back-end phối hợp | 2/5 Đơn giản | 3/5 Trung bình |
| **Web Worker**   | Tính toán lớn, sắp xếp, lọc  | Không chặn thread chính     | Chi phí giao tiếp, debug khó | 3/5 Trung bình | 4/5 Tốt |
| **Giải pháp kết hợp** | Nhu cầu phức tạp         | Kết hợp ưu điểm nhiều giải pháp | Độ phức tạp cao          | 4/5 Phức tạp | 4/5 Tốt |

---

## Chi tiết giải pháp

### 1. Phân trang back-end (Pagination) - Giải pháp ưu tiên

> **Điểm khuyên nghị: 5/5 (khuyên nghị mạnh)**
> Giải pháp phổ biến và đáng tin cậy nhất, phù hợp 80% trường hợp

#### Triển khai

```javascript
// Request front-end
async function fetchData(page = 1, pageSize = 20) {
  const response = await fetch(`/api/data?page=${page}&pageSize=${pageSize}`);
  return response.json();
}

// API back-end (ví dụ Node.js + MongoDB)
app.get('/api/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;

  const data = await Collection.find().skip(skip).limit(pageSize).lean();

  const total = await Collection.countDocuments();

  res.json({
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});
```

#### Mẹo tối ưu

```javascript
// 1. Phân trang theo con trỏ (Cursor-based Pagination)
// Phù hợp dữ liệu cập nhật thời gian thực, tránh trùng lặp hoặc thiếu sót
const data = await Collection.find({ _id: { $gt: cursor } })
  .limit(20)
  .sort({ _id: 1 });

// 2. Cache các trang phổ biến
const cacheKey = `data:page:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// 3. Chỉ trả về các trường cần thiết
const data = await Collection.find()
  .select('id name price status')
  .skip(skip)
  .limit(pageSize);
```

---

### 2. Virtual Scrolling - Hiệu năng tối đa

> **Điểm khuyên nghị: 4/5 (khuyên nghị)**
> Hiệu năng tốt nhất, phù hợp dữ liệu lớn chiều cao cố định

#### Khái niệm cốt lõi

```javascript
// Chỉ render dữ liệu trong vùng hiển thị
const itemHeight = 50;
const containerHeight = 600;
const visibleCount = Math.ceil(containerHeight / itemHeight); // = 12

const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

const visibleItems = allItems.slice(startIndex, endIndex);

const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

#### Triển khai

```vue
<!-- Sử dụng vue-virtual-scroller -->
<template>
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">{{ item.name }}</div>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }))
);
</script>
```

#### So sánh hiệu năng

| Chỉ số          | Render truyền thống | Virtual Scrolling | Cải thiện  |
| --------------- | ------------------- | ----------------- | ---------- |
| Số node DOM     | 10,000+             | 20-30             | ↓ 99.7%   |
| Sử dụng bộ nhớ  | 150 MB              | 30 MB             | ↓ 80%     |
| Render lần đầu  | 3-5 giây            | 0.3 giây          | ↑ 90%     |
| FPS cuộn        | < 20                | 55-60             | ↑ 200%    |

Chi tiết: [Triển khai Virtual Scrolling đầy đủ ->](/docs/experience/performance/lv3-virtual-scroll)

---

### 3. Cuộn vô hạn (Infinite Scroll) - Trải nghiệm liên tục

> **Điểm khuyên nghị: 3/5 (có thể cân nhắc)**

#### Triển khai

```vue
<template>
  <div ref="scrollContainer" @scroll="handleScroll">
    <div v-for="item in displayedItems" :key="item.id">
      {{ item.name }}
    </div>
    <div v-if="loading" class="loading">Đang tải...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const displayedItems = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);

onMounted(() => {
  loadMore();
});

async function loadMore() {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  const { data, hasNext } = await fetchData(currentPage.value);
  displayedItems.value.push(...data);
  hasMore.value = hasNext;
  currentPage.value++;
  loading.value = false;
}

function handleScroll(e) {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore();
  }
}
</script>
```

---

### 4. Tải theo lô (Progressive Loading)

> **Điểm khuyên nghị: 3/5 (có thể cân nhắc)**

```javascript
async function loadDataInBatches() {
  const batchSize = 50;
  const totalBatches = Math.ceil(totalItems / batchSize);

  const firstBatch = await fetchBatch(0, batchSize);
  displayedItems.value = firstBatch;

  for (let i = 1; i < totalBatches; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const batch = await fetchBatch(i * batchSize, batchSize);
    displayedItems.value.push(...batch);
  }
}
```

---

### 5. Xử lý bằng Web Worker

> **Điểm khuyên nghị: 4/5 (khuyên nghị)**

```javascript
// worker.js
self.addEventListener('message', (e) => {
  const { data, keyword } = e.data;
  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );
  self.postMessage(filtered);
});

// main.js
const worker = new Worker('/worker.js');

function searchData(keyword) {
  worker.postMessage({ data: allData, keyword });
  worker.onmessage = (e) => {
    displayedItems.value = e.data;
  };
}
```

Chi tiết: [Ứng dụng Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

### 6. Giải pháp kết hợp (Hybrid Approach)

#### Phương án A: Virtual Scrolling + phân trang back-end

```javascript
const pageSize = 500;
const currentBatch = ref([]);

async function loadNextBatch() {
  const data = await fetchData(currentPage.value, pageSize);
  currentBatch.value.push(...data);
  currentPage.value++;
}
```

#### Phương án B: Cuộn vô hạn + giải phóng ảo

```javascript
function loadMore() {
  items.value.push(...newItems);
  if (items.value.length > 1000) {
    items.value = items.value.slice(-1000);
  }
}
```

#### Phương án C: Tối ưu tìm kiếm + Virtual Scrolling

```javascript
async function search(keyword) {
  if (keyword) {
    searchResults.value = await apiSearch(keyword);
  } else {
    searchResults.value = allItems.value;
  }
}
```

---

## Cây quyết định

```
Bắt đầu: hàng vạn dữ liệu cần hiển thị
    ↓
Q1: Người dùng có cần nhìn tất cả dữ liệu không?
    ├─ Không → Phân trang back-end + tìm kiếm/lọc ✅
    ↓
    Có
    ↓
Q2: Chiều cao dữ liệu có cố định không?
    ├─ Có → Virtual Scrolling ✅
    ├─ Không → Virtual Scrolling chiều cao động (phức tạp) hoặc cuộn vô hạn ✅
    ↓
Q3: Có cần trải nghiệm duyệt liên tục không?
    ├─ Có → Cuộn vô hạn ✅
    ├─ Không → Phân trang back-end ✅
    ↓
Q4: Có nhu cầu tính toán lớn (sắp xếp, lọc) không?
    ├─ Có → Web Worker + Virtual Scrolling ✅
    ├─ Không → Virtual Scrolling ✅
```

---

## Chiến lược tối ưu bổ sung

### 1. Kiểm soát tần suất cập nhật dữ liệu

```javascript
let latestData = null;
let scheduled = false;

socket.on('update', (data) => {
  latestData = data;
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(() => {
      updateUI(latestData);
      scheduled = false;
    });
  }
});
```

### 2. Skeleton Screen

```vue
<template>
  <div v-if="loading">
    <div class="skeleton-item" v-for="i in 10" :key="i">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-text"></div>
    </div>
  </div>
  <div v-else>
    <Item v-for="item in items" :key="item.id" />
  </div>
</template>

<style>
.skeleton-item {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
```

### 3. Danh mục và cache

```javascript
const indexedData = new Map();
data.forEach((item) => {
  indexedData.set(item.id, item);
});

const item = indexedData.get(targetId); // O(1) thay vì O(n)
```

### 4. Tối ưu API back-end

```javascript
// 1. Chỉ trả về trường cần thiết
GET /api/items?fields=id,name,price

// 2. Sử dụng nén (gzip/brotli)
app.use(compression());

// 3. GraphQL (truy vấn chính xác)
query {
  items(first: 20) {
    id
    name
    price
  }
}
```

---

## Chỉ số đánh giá hiệu năng

### Chỉ số kỹ thuật

```markdown
1. Thời gian hiển thị đầu tiên (FCP): < 1 giây
2. Thời gian tương tác (TTI): < 3 giây
3. FPS cuộn: > 50 (mục tiêu 60)
4. Sử dụng bộ nhớ: < 50 MB
5. Số node DOM: < 1000
```

### Chỉ số trải nghiệm người dùng

```markdown
1. Tỷ lệ rời trang: giảm 20%+
2. Thời gian ở lại: tăng 30%+
3. Số lượng tương tác: tăng 40%+
4. Tỷ lệ lỗi: < 0.1%
```

---

## Mẫu trả lời phỏng vấn

**Người phỏng vấn: Khi có hàng vạn dữ liệu trên màn hình, tối ưu như thế nào?**

> "Đây là câu hỏi rất hay. Trước khi chọn giải pháp, tôi sẽ đánh giá nhu cầu thực tế trước:
>
> **1. Phân tích nhu cầu (30 giây)**
> - Người dùng có cần nhìn tất cả dữ liệu không? Phần lớn là không
> - Chiều cao dữ liệu có cố định không? Điều này ảnh hưởng lựa chọn kỹ thuật
> - Thao tác chính của người dùng là gì? Duyệt, tìm kiếm hay tìm mục cụ thể
>
> **2. Chọn giải pháp (1 phút)**
> Theo tình huống:
> - **Back-office** → phân trang back-end (đơn giản, đáng tin cậy nhất)
> - **Cần cuộn mượt** → Virtual Scrolling (hiệu năng tốt nhất)
> - **Kiểu mạng xã hội** → cuộn vô hạn (trải nghiệm tốt nhất)
> - **Cần tính toán phức tạp** → Web Worker + Virtual Scrolling
>
> **3. Trường hợp thực tế (1 phút)**
> Trong dự án trước, tôi gặp tình huống cần hiển thị danh sách 3000+ game.
> Tôi chọn Virtual Scrolling, kết quả:
> - Node DOM từ 10,000+ giảm xuống 20-30 (↓ 99.7%)
> - Sử dụng bộ nhớ giảm 80% (150MB → 30MB)
> - Thời gian render đầu tiên từ 3-5 giây giảm xuống 0.3 giây
> - Độ mượt cuộn đạt 60 FPS"

---

## Ghi chú liên quan

- [Triển khai Virtual Scrolling đầy đủ ->](/docs/experience/performance/lv3-virtual-scroll)
- [Tổng quan tối ưu hiệu năng web ->](/docs/experience/performance)
- [Ứng dụng Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

## Tổng kết

Đối mặt với câu hỏi "tối ưu hàng vạn dữ liệu":

1. **Đánh giá nhu cầu trước**: đừng vội vàng chọn công nghệ
2. **Hiểu nhiều giải pháp**: phân trang back-end, Virtual Scrolling, cuộn vô hạn, v.v.
3. **Cân nhắc đánh đổi**: hiệu năng vs chi phí phát triển vs trải nghiệm người dùng
4. **Tối ưu liên tục**: sử dụng công cụ giám sát, cải thiện không ngừng
5. **Để dữ liệu nói**: chứng minh hiệu quả tối ưu bằng dữ liệu hiệu năng thực tế

Nhớ rằng: **không có viên đạn bạc, chỉ có giải pháp phù hợp nhất với tình huống hiện tại**.
