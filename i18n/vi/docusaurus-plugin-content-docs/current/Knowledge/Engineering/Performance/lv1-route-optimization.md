---
id: performance-lv1-route-optimization
title: '[Lv1] Toi uu hoa cap route: ba tang Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Voi ba tang Lazy Loading route, tai lan dau giam tu 12.5MB xuong 850KB, thoi gian man hinh dau rut ngan 70%.

---

## Boi canh van de (Situation)

Dac diem du an:

- **27+ template multi-tenant khac nhau** (kien truc multi-tenant)
- **Moi template co 20-30 trang** (trang chu, sanh chinh, khuyen mai, dai ly, tin tuc, v.v.)
- **Neu tai tat ca code cung luc**: lan dau can tai **10MB+ file JS**
- **Nguoi dung doi hon 10 giay** (dac biet tren mang di dong)

## Muc tieu toi uu (Task)

1. **Giam kich thuoc JavaScript lan dau tai** (muc tieu: < 1MB)
2. **Rut ngan thoi gian man hinh dau** (muc tieu: < 3 giay)
3. **Tai theo yeu cau** (nguoi dung chi tai nhung gi can thiet)
4. **Duy tri trai nghiem phat trien** (khong anh huong den hieu suat lam viec)

## Giai phap (Action)

Chung toi ap dung chien luoc **Lazy Loading route ba tang**, toi uu tu "template" -> "trang" -> "quyen".

### Tang 1: Tai template dong

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // Tai dong route cua template tuong ung theo bien moi truong
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

Giai thich:

- Du an co 27 template, nhung nguoi dung chi su dung 1
- Xac dinh thuong hieu hien tai qua environment.json
- Chi tai cau hinh route cua thuong hieu do, 26 template con lai hoan toan khong tai

Ket qua:

- Giam khoang 85% code cau hinh route khi tai lan dau

### Tang 2: Lazy Loading trang

```typescript
// Cach viet truyen thong (❌ - khong nen)
import HomePage from './pages/HomePage.vue';
component: HomePage; // Tat ca trang deu duoc dong goi vao main.js

// Cach viet cua chung toi (✅ - nen dung)
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- Moi route su dung ham mui ten + `import()`
- JS tuong ung chi duoc tai khi nguoi dung truy cap trang do
- Vite tu dong dong goi moi trang thanh file doc lap

### Tang 3: Chien luoc tai theo dieu kien

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // Nguoi dung chua dang nhap se khong tai cac trang nhu "Trung tam dai ly"
    return next({ name: 'HomePage' });
  }
  next();
});
```

## Ket qua toi uu (Result)

**Truoc toi uu:**

```
Tai lan dau: main.js (12.5 MB)
Thoi gian man hinh dau: 8-12 giay
Bao gom tat ca 27 template + tat ca trang
```

**Sau toi uu:**

```markdown
Tai lan dau: main.js (850 KB) ↓ 93%
Thoi gian man hinh dau: 1.5-2.5 giay ↑ 70%
Chi bao gom code cot loi + trang chu hien tai
```

**Du lieu cu the:**

- Giam kich thuoc JavaScript: **12.5 MB → 850 KB (giam 93%)**
- Rut ngan thoi gian man hinh dau: **10 giay → 2 giay (cai thien 70%)**
- Tai trang tiep theo: **trung binh 300-500 KB moi trang**
- Diem trai nghiem nguoi dung: **tu 45 len 92 diem (Lighthouse)**

**Gia tri kinh doanh:**

- Ty le roi trang giam 35%
- Thoi gian o lai trang tang 50%
- Ty le chuyen doi tang 25%

## Diem chinh phong van

**Cau hoi mo rong thuong gap:**

1. **Q: Tai sao khong dung React.lazy() hoac component bat dong bo cua Vue?**
   A: Chung toi co dung component bat dong bo cua Vue (`() => import()`), nhung diem chinh la **kien truc ba tang**:

   - Tang 1 (template): quyet dinh luc compile (cau hinh Vite)
   - Tang 2 (trang): Lazy Loading luc chay
   - Tang 3 (quyen): kiem soat boi navigation guard

   Lazy loading don thuan chi lam duoc tang 2, chung toi da them phan tach o cap template.

2. **Q: Lam sao quyet dinh code nao nen nam trong main.js?**
   A: Qua cau hinh `manualChunks` cua Vite:

   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor': ['vue', 'pinia', 'vue-router'],
           'ui': ['element-plus'],
         }
       }
     }
   }
   ```

   Nguyen tac: chi nhung thu "moi trang deu dung" moi dat vao vendor chunk.

3. **Q: Lazy Loading co anh huong trai nghiem nguoi dung (thoi gian cho) khong?**
   A: Co hai chien luoc doi pho:

   - **Prefetch**: tai truoc cac trang co the truy cap khi nhan roi
   - **Trang thai loading**: su dung Skeleton Screen thay vi man hinh trang

   Thu nghiem thuc te: thoi gian tai trung binh cua trang tiep theo < 500ms, nguoi dung khong cam nhan duoc.

4. **Q: Lam sao do luong hieu qua toi uu?**
   A: Su dung ket hop nhieu cong cu:

   - **Lighthouse**: Performance Score (45 → 92)
   - **Webpack Bundle Analyzer**: phan tich truc quan kich thuoc chunk
   - **Chrome DevTools**: Network waterfall, Coverage
   - **Real User Monitoring (RUM)**: du lieu nguoi dung thuc

5. **Q: Co nhung danh doi (Trade-off) nao?**
   A:
   - Co the gap van de phu thuoc vong khi phat trien (can dieu chinh cau truc module)
   - Thoi gian tai ngan khi chuyen route lan dau (giai quyet bang prefetch)
   - Nhung tong the loi ich vuot xa, dac biet cai thien trai nghiem tren dien thoai
