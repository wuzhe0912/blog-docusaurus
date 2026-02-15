---
id: performance-lv3-virtual-scroll
title: '[Lv3] Trien khai Virtual Scrolling: xu ly render du lieu lon'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> Khi trang can render 1000+ dong du lieu, Virtual Scrolling giam node DOM tu 1000+ xuong 20-30, giam su dung bo nho 80%.

---

## Cau hoi tinh huong phong van

**Q: Khi trang co nhieu table, moi table co hon tram dong du lieu, dong thoi co event cap nhat DOM thuong xuyen, ban se dung phuong phap gi de toi uu hieu nang trang nay?**

---

## Phan tich van de (Situation)

### Tinh huong thuc te

Trong du an platform, mot so trang can xu ly du lieu lon:

```markdown
Trang lich su
├─ Bang nap tien: 1000+ dong
├─ Bang rut tien: 800+ dong
├─ Bang dat cuoc: 5000+ dong
└─ Moi dong co 8-10 cot (thoi gian, so tien, trang thai, v.v.)

Van de khi chua toi uu
├─ So node DOM: 1000 dong × 10 cot = 10,000+ node
├─ Chiem bo nho: khoang 150-200 MB
├─ Thoi gian render dau: 3-5 giay (man hinh trang)
├─ Giat khi cuon: FPS < 20
└─ Khi WebSocket cap nhat: toan bo table bi render lai (rat cham)
```

### Muc do nghiem trong

```javascript
// ❌ Cach truyen thong
<tr v-for="record in allRecords">  // 1000+ dong render het
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8-10 cot
</tr>

// Ket qua:
// - Render ban dau: 10,000+ node DOM
// - Nguoi dung thuc te nhin thay: 20-30 dong
// - Lang phi: 99% node nguoi dung khong nhin thay
```

---

## Giai phap (Action)

### Virtual Scrolling

Xem xet toi uu Virtual Scrolling, co hai huong chinh: mot la chon thu vien thu ba duoc chinh thuc khuyen nghi nhu [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller), xac dinh pham vi dong hien thi theo tham so va nhu cau.

```js
// Chi render dong hien thi, vi du:
// - 100 dong du lieu, chi render 20 dong hien thi
// - Giam dang ke so node DOM
```

Huong khac la tu code tay, nhung xet den chi phi phat trien thuc te va cac tinh huong bao phu, toi se nghieng ve thu vien thu ba duoc khuyen nghi.

### Kiem soat tan suat cap nhat du lieu

> Giai phap 1: requestAnimationFrame (RAF)
> Khai niem: trinh duyet toi da chi ve lai 60 lan/giay (60 FPS), cap nhat nhanh hon mat nguoi cung khong thay, nen dong bo voi tan suat lam moi man hinh

```js
// ❌ Truoc: nhan du lieu la cap nhat ngay (co the 100 lan/giay)
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// ✅ Cai thien: thu thap du lieu, dong bo cap nhat voi tan suat man hinh (toi da 60 lan/giay)
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

Giai phap 2: Throttle
Khai niem: cuong che gioi han tan suat cap nhat, vi du "moi 100ms toi da cap nhat 1 lan"

```js
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100);

socket.on('price', updatePrice);
```

### Toi uu dac thu Vue 3

Mot so cu phap duong cua Vue 3 cung cap toi uu hieu nang, nhu v-memo, du ca nhan toi it khi su dung tinh huong nay.

```js
// 1. v-memo - ghi nho cac cot it thay doi
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // Chi render lai khi cac truong nay thay doi
</tr>

// 2. Dong bang du lieu tinh, tranh chi phi reactive
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef cho mang lon
const tableData = shallowRef([...])  // Chi theo doi mang, khong theo doi object ben trong

// 4. Dung key toi uu thuat toan diff
<tr v-for="row in data" :key="row.id">  // Key on dinh
```

### Toi uu render DOM

```scss
// Dung CSS transform thay vi top/left
.row-update {
  transform: translateY(0); /* Kich hoat GPU tang toc */
  will-change: transform; /* Goi y trinh duyet toi uu */
}

// CSS containment cach ly pham vi render
.table-container {
  contain: layout style paint;
}
```

---

## Ket qua toi uu (Result)

### So sanh hieu nang

| Chi so          | Truoc toi uu   | Sau toi uu     | Cai thien  |
| --------------- | -------------- | -------------- | ---------- |
| So node DOM     | 10,000+        | 20-30          | ↓ 99.7%   |
| Su dung bo nho  | 150-200 MB     | 30-40 MB       | ↓ 80%     |
| Render dau      | 3-5 giay       | 0.3-0.5 giay   | ↑ 90%     |
| FPS cuon        | < 20           | 55-60          | ↑ 200%    |
| Phan hoi cap nhat | 500-800 ms   | 16-33 ms       | ↑ 95%     |

### Ket qua thuc te

```markdown
✅ Virtual Scrolling
├─ Chi render 20-30 dong hien thi
├─ Cap nhat dong pham vi hien thi khi cuon
├─ Nguoi dung khong cam nhan (trai nghiem muot)
└─ Bo nho on dinh (khong tang theo luong du lieu)

✅ Cap nhat du lieu qua RAF
├─ WebSocket 100 cap nhat/giay → toi da 60 render
├─ Dong bo voi tan suat lam moi (60 FPS)
└─ Su dung CPU giam 60%

✅ Toi uu Vue 3
├─ v-memo: tranh render lai khong can thiet
├─ shallowRef: giam chi phi reactive
└─ :key on dinh: toi uu thuat toan diff
```

---

## Diem chinh phong van

### Cau hoi mo rong thuong gap

**Q: Neu khong dung thu vien thu ba thi sao?**
A: Tu trien khai logic cot loi cua Virtual Scrolling:

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

**Q: Xu ly ket noi lai khi WebSocket mat ket noi nhu the nao?**
A: Trien khai chien luoc ket noi lai voi exponential backoff:

```javascript
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000;

function reconnect() {
  if (retryCount >= maxRetries) {
    showError('Khong the ket noi, vui long tai lai trang');
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
  showSuccess('Da ket noi lai');
});
```

**Q: Virtual Scroll co nhuoc diem gi?**
A: Can luu y cac danh doi:

```markdown
❌ Nhuoc diem
├─ Khong the dung tim kiem goc trinh duyet (Ctrl+F)
├─ Chuc nang "chon tat ca" can xu ly dac biet
├─ Do phuc tap trien khai cao
├─ Can chieu cao co dinh hoac tinh truoc chieu cao
└─ Tinh nang accessibility can xu ly bo sung

✅ Truong hop phu hop
├─ Luong du lieu > 100 dong
├─ Cau truc du lieu tuong tu (chieu cao co dinh)
├─ Can cuon hieu nang cao
└─ Chu yeu xem (khong chinh sua)

❌ Truong hop khong phu hop
├─ Luong du lieu < 50 dong (thiet ke qua muc)
├─ Chieu cao khong co dinh (trien khai kho)
├─ Nhieu tuong tac (multi-select, keo tha)
└─ Can in toan bo bang
```

**Q: Toi uu danh sach chieu cao khong deu nhu the nao?**
A: Dung Virtual Scrolling chieu cao dong:

```javascript
// Phuong an 1: chieu cao uoc tinh + do thuc te
const estimatedHeight = 50;
const measuredHeights = {};

onMounted(() => {
  const elements = document.querySelectorAll('.list-item');
  elements.forEach((el, index) => {
    measuredHeights[index] = el.offsetHeight;
  });
});

// Phuong an 2: dung thu vien ho tro chieu cao dong
<DynamicScroller
  :items="items"
  :min-item-size="50"
  :buffer="200"
/>
```

---

## So sanh ky thuat

### Virtual Scroll vs Phan trang

| Tieu chi         | Virtual Scroll            | Phan trang truyen thong   |
| ---------------- | ------------------------- | ------------------------- |
| Trai nghiem nguoi dung | Cuon lien tuc (tot hon) | Can lat trang (gian doan) |
| Hieu nang        | Luon chi render vung hien thi | Render toan bo moi trang |
| Do kho trien khai | Phuc tap hon             | Don gian                  |
| SEO              | Kem hon                   | Tot hon                   |
| Accessibility    | Can xu ly dac biet        | Ho tro goc                |

**Khuyen nghi:**

- Back-office, Dashboard → Virtual Scroll
- Trang web cong khai, blog → Phan trang truyen thong
- Giai phap ket hop: Virtual Scroll + nut "Tai them"
