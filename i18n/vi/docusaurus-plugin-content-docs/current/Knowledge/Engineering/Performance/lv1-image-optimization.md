---
id: performance-lv1-image-optimization
title: '[Lv1] Toi uu hoa tai hinh anh: bon tang Lazy Load'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Voi chien luoc Lazy Loading hinh anh bon tang, luu luong hinh anh man hinh dau tien giam tu 60MB xuong 2MB, thoi gian tai cai thien 85%.

---

## Boi canh van de (Situation)

> Hay tuong tuong ban dang luot web tren dien thoai, man hinh chi hien thi duoc 10 hinh anh, nhung trang web tai ca 500 hinh anh cung luc. Dien thoai se lag nghiem trong va luu luong bi dot chay 50MB.

**Tinh huong thuc te trong du an:**

```markdown
Thong ke trang chu mot trang
├─ 300+ hinh thu nho (moi hinh 150-300KB)
├─ 50+ banner khuyen mai
└─ Neu tai tat ca: 300 × 200KB = 60MB+ du lieu hinh anh

Van de thuc te
├─ Man hinh dau chi hien thi 8-12 hinh
├─ Nguoi dung co the chi cuon den hinh thu 30 roi roi di
└─ 270 hinh con lai tai hoan toan vo ich (lang phi luu luong + cham)

Anh huong
├─ Thoi gian tai lan dau: 15-20 giay
├─ Tieu hao luu luong: 60MB+ (nguoi dung phan nan)
├─ Trang bi giat: cuon khong muot
└─ Ty le roi trang: 42% (rat cao)
```

## Muc tieu toi uu (Task)

1. **Chi tai hinh anh trong vung hien thi**
2. **Tai truoc hinh anh sap vao cua so** (bat dau tai truoc 50px)
3. **Kiem soat so luong tai dong thoi** (tranh tai qua nhieu hinh cung luc)
4. **Ngan chan lang phi tai nguyen khi chuyen doi nhanh**
5. **Luu luong hinh man hinh dau < 3MB**

## Giai phap (Action)

### Trien khai v-lazy-load.ts

> Bon tang image lazy load

#### Tang 1: Phat hien kha nang hien thi trong cua so (IntersectionObserver)

```js
// Tao observer de giam sat hinh anh co vao cua so khong
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Hinh anh da vao vung hien thi
        // Bat dau tai hinh anh
      }
    });
  },
  {
    rootMargin: '50px 0px', // Bat dau tai truoc 50px (tai truoc)
    threshold: 0.1, // Chi can lo 10% la kich hoat
  }
);
```

- Su dung API IntersectionObserver goc cua trinh duyet (hieu nang vuot troi hon event scroll)
- rootMargin: "50px" -> khi hinh anh con cach 50px ben duoi da bat dau tai, nguoi dung cuon den thi da san sang (cam giac muot hon)
- Hinh anh ngoai cua so hoan toan khong tai

#### Tang 2: Co che kiem soat dong thoi (quan ly hang doi)

```js
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent = 6  // Toi da 6 hinh tai dong thoi
  private queue: (() => void)[] = []

  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)  // Con cho trong, tai ngay
    } else {
      this.queue.push(loadFn)   // Het cho, xep hang cho
    }
  }
}
```

- Ngay ca khi 20 hinh vao cua so cung luc, chi tai 6 hinh dong thoi
- Tranh "tai thac" lam nghen trinh duyet (Chrome mac dinh toi da 6 ket noi dong thoi)
- Khi tai xong mot hinh, tu dong xu ly hinh tiep theo trong hang doi

```md
Nguoi dung cuon nhanh xuong cuoi → 30 hinh kich hoat dong thoi
Khong co hang doi: 30 request gui cung luc → trinh duyet giat
Co hang doi: 6 hinh dau tai truoc → xong roi tai 6 hinh tiep → muot
```

#### Tang 3: Giai quyet van de race condition (kiem soat phien ban)

```js
// Dat so phien ban khi tai
el.setAttribute('data-version', Date.now().toString());

// Kiem tra phien ban khi tai xong
img.onload = () => {
  const currentVersion = img.getAttribute('data-version');
  if (loadVersion === currentVersion) {
    // Phien ban khop, hien thi hinh anh
  } else {
    // Phien ban khong khop, nguoi dung da chuyen sang danh muc khac, khong hien thi
  }
};
```

Vi du thuc te:

```md
Thao tac nguoi dung:

1. Click "Tin tuc" → kich hoat tai 100 hinh (phien ban 1001)
2. 0.5 giay sau click "Khuyen mai" → kich hoat tai 80 hinh (phien ban 1002)
3. Hinh tin tuc 1 giay sau moi tai xong

Khong co kiem soat phien ban: hien thi hinh tin tuc (sai!)
Co kiem soat phien ban: kiem tra phien ban khong khop, huy hinh tin tuc (dung!)
```

#### Tang 4: Chien luoc placeholder (hinh trong suot Base64)

```js
// Mac dinh hien thi SVG trong suot 1×1, tranh dich chuyen bo cuc
el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi...';

// URL hinh anh that luu trong data-src
el.setAttribute('data-src', realImageUrl);
```

- Su dung SVG trong suot ma hoa Base64 (chi 100 bytes)
- Tranh CLS (Cumulative Layout Shift)
- Nguoi dung khong thay hien tuong "hinh anh dot ngot nhay ra"

## Ket qua toi uu (Result)

**Truoc toi uu:**

```markdown
Hinh man hinh dau: tai 300 hinh cung luc (60MB)
Thoi gian tai: 15-20 giay
Do muot khi cuon: giat nghiem trong
Ty le roi trang: 42%
```

**Sau toi uu:**

```markdown
Hinh man hinh dau: chi tai 8-12 hinh (2MB) ↓ 97%
Thoi gian tai: 2-3 giay ↑ 85%
Do muot khi cuon: muot (60fps)
Ty le roi trang: 28% ↓ 33%
```

**Du lieu cu the:**

- Luu luong hinh man hinh dau: **60 MB → 2 MB (giam 97%)**
- Thoi gian tai hinh: **15 giay → 2 giay (cai thien 85%)**
- FPS khi cuon trang: **tu 20-30 tang len 55-60**
- Su dung bo nho: **giam 65%** (hinh chua tai khong chiem bo nho)

**Chi so ky thuat:**

- Hieu nang IntersectionObserver: vuot troi so voi event scroll truyen thong (su dung CPU giam 80%)
- Hieu qua kiem soat dong thoi: tranh nghen request trinh duyet
- Ty le chinh xac kiem soat phien ban: 99.5% (rat it hinh sai)

## Diem chinh phong van

**Cau hoi mo rong thuong gap:**

1. **Q: Tai sao khong dung truc tiep thuoc tinh `loading="lazy"`?**
   A: Thuoc tinh goc `loading="lazy"` co mot so han che:

   - Khong the kiem soat khoang cach tai truoc (trinh duyet quyet dinh)
   - Khong the kiem soat so luong tai dong thoi
   - Khong the xu ly kiem soat phien ban (van de chuyen doi nhanh)
   - Trinh duyet cu khong ho tro

   Directive tuy chinh cung cap kiem soat chi tiet hon, phu hop voi cac tinh huong phuc tap.

2. **Q: IntersectionObserver tot hon event scroll o diem nao?**
   A:

   ```javascript
   // ❌ Event scroll truyen thong
   window.addEventListener('scroll', () => {
     // Kich hoat moi lan cuon (60 lan/giay)
     // Can tinh toan vi tri phan tu (getBoundingClientRect)
     // Co the gay reflow cuong che (sat thu hieu nang)
   });

   // ✅ IntersectionObserver
   const observer = new IntersectionObserver(callback);
   // Chi kich hoat khi phan tu vao/ra cua so
   // Toi uu goc cua trinh duyet, khong chan thread chinh
   // Cai thien hieu nang 80%
   ```

3. **Q: Gioi han 6 hinh dong thoi den tu dau?**
   A: Dua tren **gioi han dong thoi HTTP/1.1 cung nguon** cua trinh duyet:

   - Chrome/Firefox: toi da 6 ket noi dong thoi moi domain
   - Request vuot gioi han se xep hang doi
   - HTTP/2 co the nhieu hon, nhung vi tuong thich van giu o 6
   - Thu nghiem thuc te: 6 hinh dong thoi la diem can bang tot nhat giua hieu nang va trai nghiem

4. **Q: Tai sao dung timestamp thay vi UUID cho kiem soat phien ban?**
   A:

   - Timestamp: `Date.now()` (don gian, du dung, co the sap xep)
   - UUID: `crypto.randomUUID()` (nghiem ngat hon, nhung thua thiet ke)
   - Tinh huong cua chung toi: timestamp da du duy nhat (cap do mili giay)
   - Can nhac hieu nang: tao timestamp nhanh hon

5. **Q: Xu ly nhu the nao khi tai hinh that bai?**
   A: Da trien khai fallback nhieu tang:

   ```javascript
   img.onerror = () => {
     if (retryCount < 3) {
       // 1. Thu lai 3 lan
       setTimeout(() => reload(), 1000 * retryCount);
     } else {
       // 2. Hien thi hinh mac dinh
       img.src = '/images/game-placeholder.png';
     }
   };
   ```

6. **Q: Co gap van de CLS (Cumulative Layout Shift) khong?**
   A: Co ba chien luoc de tranh:

   ```html
   <!-- 1. SVG placeholder mac dinh -->
   <img src="data:image/svg+xml..." />

   <!-- 2. CSS aspect-ratio co dinh ty le -->
   <img style="aspect-ratio: 16/9;" />

   <!-- 3. Skeleton Screen -->
   <div class="skeleton-box"></div>
   ```

   Diem CLS cuoi cung: < 0.1 (xuat sac)
