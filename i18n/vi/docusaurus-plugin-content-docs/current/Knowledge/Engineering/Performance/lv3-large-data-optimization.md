---
id: performance-lv3-large-data-optimization
title: '[Lv3] Chien luoc toi uu du lieu lon: lua chon giai phap va trien khai'
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> Khi giao dien can hien thi hang van du lieu, lam the nao de can bang giua hieu nang, trai nghiem nguoi dung va chi phi phat trien?

## Cau hoi tinh huong phong van

**Q: Khi giao dien co hang van du lieu, ban se toi uu nhu the nao?**

Day la cau hoi mo, nguoi phong van mong doi nghe khong chi mot giai phap duy nhat:

1. **Danh gia nhu cau**: co thuc su can hien thi nhieu du lieu cung luc nhu vay khong?
2. **Lua chon giai phap**: co nhung phuong an nao? Uu nhuoc diem cua tung cai?
3. **Suy nghi toan dien**: front-end + back-end + UX ket hop
4. **Kinh nghiem thuc te**: ly do chon va ket qua trien khai

---

## Buoc dau tien: Danh gia nhu cau

Truoc khi chon giai phap ky thuat, hay tu hoi nhung cau hoi nay:

### Cau hoi cot loi

```markdown
❓ Nguoi dung co thuc su can nhin thay tat ca du lieu khong?
→ Phan lon truong hop, nguoi dung chi quan tam 50-100 dong dau
→ Co the thu hep pham vi qua loc, tim kiem, sap xep

❓ Du lieu co can cap nhat thoi gian thuc khong?
→ WebSocket thoi gian thuc vs polling dinh ky vs chi tai lan dau

❓ Che do thao tac cua nguoi dung la gi?
→ Duyet la chinh → Virtual Scrolling
→ Tim du lieu cu the → tim kiem + phan trang
→ Xem tung dong → cuon vo han

❓ Cau truc du lieu co co dinh khong?
→ Chieu cao co dinh → Virtual Scrolling de trien khai
→ Chieu cao khong co dinh → can tinh toan chieu cao dong

❓ Co can chon tat ca, in hoac xuat khong?
→ Can → Virtual Scrolling co gioi han
→ Khong can → Virtual Scrolling la lua chon tot nhat
```

### Phan tich truong hop thuc te

```javascript
// Truong hop 1: Lich su giao dich (10,000+ dong)
Hanh vi nguoi dung: xem giao dich gan day, thinh thoang tim theo ngay
Giai phap tot nhat: phan trang back-end + tim kiem

// Truong hop 2: Danh sach game thoi gian thuc (3,000+ tua)
Hanh vi nguoi dung: duyet, loc theo danh muc, cuon muot
Giai phap tot nhat: Virtual Scrolling + loc front-end

// Truong hop 3: Feed mang xa hoi (tang truong vo han)
Hanh vi nguoi dung: cuon lien tuc xuong, khong can chuyen trang
Giai phap tot nhat: cuon vo han + tai theo lo

// Truong hop 4: Bao cao du lieu (bang phuc tap)
Hanh vi nguoi dung: xem, sap xep, xuat
Giai phap tot nhat: phan trang back-end + API xuat
```

---

## Tong quan cac giai phap toi uu

### Bang so sanh giai phap

| Giai phap        | Truong hop ap dung           | Uu diem                    | Nhuoc diem                 | Do kho     | Hieu nang  |
| ---------------- | ---------------------------- | -------------------------- | -------------------------- | ---------- | ---------- |
| **Phan trang back-end** | Phan lon truong hop    | Don gian, dang tin cay, SEO friendly | Can lat trang, gian doan trai nghiem | 1/5 Don gian | 3/5 Trung binh |
| **Virtual Scrolling** | Du lieu lon chieu cao co dinh | Hieu nang toi da, cuon muot | Trien khai phuc tap, khong tim kiem goc | 4/5 Phuc tap | 5/5 Xuat sac |
| **Cuon vo han**  | Mang xa hoi, tin tuc         | Trai nghiem lien tuc, trien khai don gian | Tich luy bo nho, khong nhay trang | 2/5 Don gian | 3/5 Trung binh |
| **Tai theo lo**  | Toi uu tai lan dau           | Tai dan, ket hop skeleton screen | Can back-end phoi hop | 2/5 Don gian | 3/5 Trung binh |
| **Web Worker**   | Tinh toan lon, sap xep, loc  | Khong chan thread chinh     | Chi phi giao tiep, debug kho | 3/5 Trung binh | 4/5 Tot |
| **Giai phap ket hop** | Nhu cau phuc tap         | Ket hop uu diem nhieu giai phap | Do phuc tap cao          | 4/5 Phuc tap | 4/5 Tot |

---

## Chi tiet giai phap

### 1. Phan trang back-end (Pagination) - Giai phap uu tien

> **Diem khuyen nghi: 5/5 (khuyen nghi manh)**
> Giai phap pho bien va dang tin cay nhat, phu hop 80% truong hop

#### Trien khai

```javascript
// Request front-end
async function fetchData(page = 1, pageSize = 20) {
  const response = await fetch(`/api/data?page=${page}&pageSize=${pageSize}`);
  return response.json();
}

// API back-end (vi du Node.js + MongoDB)
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

#### Meo toi uu

```javascript
// 1. Phan trang theo con tro (Cursor-based Pagination)
// Phu hop du lieu cap nhat thoi gian thuc, tranh trung lap hoac thieu sot
const data = await Collection.find({ _id: { $gt: cursor } })
  .limit(20)
  .sort({ _id: 1 });

// 2. Cache cac trang pho bien
const cacheKey = `data:page:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// 3. Chi tra ve cac truong can thiet
const data = await Collection.find()
  .select('id name price status')
  .skip(skip)
  .limit(pageSize);
```

---

### 2. Virtual Scrolling - Hieu nang toi da

> **Diem khuyen nghi: 4/5 (khuyen nghi)**
> Hieu nang tot nhat, phu hop du lieu lon chieu cao co dinh

#### Khai niem cot loi

```javascript
// Chi render du lieu trong vung hien thi
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

#### Trien khai

```vue
<!-- Su dung vue-virtual-scroller -->
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

#### So sanh hieu nang

| Chi so          | Render truyen thong | Virtual Scrolling | Cai thien  |
| --------------- | ------------------- | ----------------- | ---------- |
| So node DOM     | 10,000+             | 20-30             | ↓ 99.7%   |
| Su dung bo nho  | 150 MB              | 30 MB             | ↓ 80%     |
| Render lan dau  | 3-5 giay            | 0.3 giay          | ↑ 90%     |
| FPS cuon        | < 20                | 55-60             | ↑ 200%    |

Chi tiet: [Trien khai Virtual Scrolling day du ->](/docs/experience/performance/lv3-virtual-scroll)

---

### 3. Cuon vo han (Infinite Scroll) - Trai nghiem lien tuc

> **Diem khuyen nghi: 3/5 (co the can nhac)**

#### Trien khai

```vue
<template>
  <div ref="scrollContainer" @scroll="handleScroll">
    <div v-for="item in displayedItems" :key="item.id">
      {{ item.name }}
    </div>
    <div v-if="loading" class="loading">Dang tai...</div>
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

### 4. Tai theo lo (Progressive Loading)

> **Diem khuyen nghi: 3/5 (co the can nhac)**

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

### 5. Xu ly bang Web Worker

> **Diem khuyen nghi: 4/5 (khuyen nghi)**

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

Chi tiet: [Ung dung Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

### 6. Giai phap ket hop (Hybrid Approach)

#### Phuong an A: Virtual Scrolling + phan trang back-end

```javascript
const pageSize = 500;
const currentBatch = ref([]);

async function loadNextBatch() {
  const data = await fetchData(currentPage.value, pageSize);
  currentBatch.value.push(...data);
  currentPage.value++;
}
```

#### Phuong an B: Cuon vo han + giai phong ao

```javascript
function loadMore() {
  items.value.push(...newItems);
  if (items.value.length > 1000) {
    items.value = items.value.slice(-1000);
  }
}
```

#### Phuong an C: Toi uu tim kiem + Virtual Scrolling

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

## Cay quyet dinh

```
Bat dau: hang van du lieu can hien thi
    ↓
Q1: Nguoi dung co can nhin tat ca du lieu khong?
    ├─ Khong → Phan trang back-end + tim kiem/loc ✅
    ↓
    Co
    ↓
Q2: Chieu cao du lieu co co dinh khong?
    ├─ Co → Virtual Scrolling ✅
    ├─ Khong → Virtual Scrolling chieu cao dong (phuc tap) hoac cuon vo han ✅
    ↓
Q3: Co can trai nghiem duyet lien tuc khong?
    ├─ Co → Cuon vo han ✅
    ├─ Khong → Phan trang back-end ✅
    ↓
Q4: Co nhu cau tinh toan lon (sap xep, loc) khong?
    ├─ Co → Web Worker + Virtual Scrolling ✅
    ├─ Khong → Virtual Scrolling ✅
```

---

## Chien luoc toi uu bo sung

### 1. Kiem soat tan suat cap nhat du lieu

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

### 3. Danh muc va cache

```javascript
const indexedData = new Map();
data.forEach((item) => {
  indexedData.set(item.id, item);
});

const item = indexedData.get(targetId); // O(1) thay vi O(n)
```

### 4. Toi uu API back-end

```javascript
// 1. Chi tra ve truong can thiet
GET /api/items?fields=id,name,price

// 2. Su dung nen (gzip/brotli)
app.use(compression());

// 3. GraphQL (truy van chinh xac)
query {
  items(first: 20) {
    id
    name
    price
  }
}
```

---

## Chi so danh gia hieu nang

### Chi so ky thuat

```markdown
1. Thoi gian hien thi dau tien (FCP): < 1 giay
2. Thoi gian tuong tac (TTI): < 3 giay
3. FPS cuon: > 50 (muc tieu 60)
4. Su dung bo nho: < 50 MB
5. So node DOM: < 1000
```

### Chi so trai nghiem nguoi dung

```markdown
1. Ty le roi trang: giam 20%+
2. Thoi gian o lai: tang 30%+
3. So luong tuong tac: tang 40%+
4. Ty le loi: < 0.1%
```

---

## Mau tra loi phong van

**Nguoi phong van: Khi co hang van du lieu tren man hinh, toi uu nhu the nao?**

> "Day la cau hoi rat hay. Truoc khi chon giai phap, toi se danh gia nhu cau thuc te truoc:
>
> **1. Phan tich nhu cau (30 giay)**
> - Nguoi dung co can nhin tat ca du lieu khong? Phan lon la khong
> - Chieu cao du lieu co co dinh khong? Dieu nay anh huong lua chon ky thuat
> - Thao tac chinh cua nguoi dung la gi? Duyet, tim kiem hay tim muc cu the
>
> **2. Chon giai phap (1 phut)**
> Theo tinh huong:
> - **Back-office** → phan trang back-end (don gian, dang tin cay nhat)
> - **Can cuon muot** → Virtual Scrolling (hieu nang tot nhat)
> - **Kieu mang xa hoi** → cuon vo han (trai nghiem tot nhat)
> - **Can tinh toan phuc tap** → Web Worker + Virtual Scrolling
>
> **3. Truong hop thuc te (1 phut)**
> Trong du an truoc, toi gap tinh huong can hien thi danh sach 3000+ game.
> Toi chon Virtual Scrolling, ket qua:
> - Node DOM tu 10,000+ giam xuong 20-30 (↓ 99.7%)
> - Su dung bo nho giam 80% (150MB → 30MB)
> - Thoi gian render dau tien tu 3-5 giay giam xuong 0.3 giay
> - Do muot cuon dat 60 FPS"

---

## Ghi chu lien quan

- [Trien khai Virtual Scrolling day du ->](/docs/experience/performance/lv3-virtual-scroll)
- [Tong quan toi uu hieu nang web ->](/docs/experience/performance)
- [Ung dung Web Worker ->](/docs/experience/performance/lv3-web-worker)

---

## Tong ket

Doi mat voi cau hoi "toi uu hang van du lieu":

1. **Danh gia nhu cau truoc**: dung voi vang chon cong nghe
2. **Hieu nhieu giai phap**: phan trang back-end, Virtual Scrolling, cuon vo han, v.v.
3. **Can nhac danh doi**: hieu nang vs chi phi phat trien vs trai nghiem nguoi dung
4. **Toi uu lien tuc**: su dung cong cu giam sat, cai thien khong ngung
5. **De du lieu noi**: chung minh hieu qua toi uu bang du lieu hieu nang thuc te

Nho rang: **khong co vien dan bac, chi co giai phap phu hop nhat voi tinh huong hien tai**.
