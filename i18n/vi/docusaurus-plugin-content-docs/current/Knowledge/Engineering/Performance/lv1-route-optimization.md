---
id: performance-lv1-route-optimization
title: '[Lv1] Tối ưu hóa cấp route: ba tầng Lazy Loading'
slug: /experience/performance/lv1-route-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Với ba tầng Lazy Loading route, tải lần đầu giảm từ 12.5MB xuống 850KB, thời gian màn hình đầu rút ngắn 70%.

---

## Bối cảnh vấn đề (Situation)

Đặc điểm dự án:

- **27+ template multi-tenant khác nhau** (kiến trúc multi-tenant)
- **Mỗi template có 20-30 trang** (trang chủ, sảnh chính, khuyến mại, đại lý, tin tức, v.v.)
- **Nếu tải tất cả code cùng lúc**: lần đầu cần tải **10MB+ file JS**
- **Người dùng đợi hơn 10 giây** (đặc biệt trên mạng di động)

## Mục tiêu tối ưu (Task)

1. **Giảm kích thước JavaScript lần đầu tải** (mục tiêu: < 1MB)
2. **Rút ngắn thời gian màn hình đầu** (mục tiêu: < 3 giây)
3. **Tải theo yêu cầu** (người dùng chỉ tải những gì cần thiết)
4. **Duy trì trải nghiệm phát triển** (không ảnh hưởng đến hiệu suất làm việc)

## Giải pháp (Action)

Chúng tôi áp dụng chiến lược **Lazy Loading route ba tầng**, tối ưu từ "template" -> "trang" -> "quyền".

### Tầng 1: Tải template động

```typescript
// src/router/routes.ts
export default async function (siteKey?: string) {
  // Tải động route của template tương ứng theo biến môi trường
  const module = await import(`../../template/${siteKey}/router/routes.ts`);
  return { routes: module.routes };
}
```

Giải thích:

- Dự án có 27 template, nhưng người dùng chỉ sử dụng 1
- Xác định thương hiệu hiện tại qua environment.json
- Chỉ tải cấu hình route của thương hiệu đó, 26 template còn lại hoàn toàn không tải

Kết quả:

- Giảm khoảng 85% code cấu hình route khi tải lần đầu

### Tầng 2: Lazy Loading trang

```typescript
// Cách viết truyền thống (❌ - không nên)
import HomePage from './pages/HomePage.vue';
component: HomePage; // Tất cả trang đều được đóng gói vào main.js

// Cách viết của chúng tôi (✅ - nên dùng)
component: () => import('app/template/okbet_green/pages/HomePage/Home.vue');
```

- Mỗi route sử dụng hàm mũi tên + `import()`
- JS tương ứng chỉ được tải khi người dùng truy cập trang đó
- Vite tự động đóng gói mỗi trang thành file độc lập

### Tầng 3: Chiến lược tải theo điều kiện

```typescript
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const { needAuth } = to.meta;
  if (needAuth && !store.isLogin) {
    // Người dùng chưa đăng nhập sẽ không tải các trang như "Trung tâm đại lý"
    return next({ name: 'HomePage' });
  }
  next();
});
```

## Kết quả tối ưu (Result)

**Trước tối ưu:**

```
Tải lần đầu: main.js (12.5 MB)
Thời gian màn hình đầu: 8-12 giây
Bao gồm tất cả 27 template + tất cả trang
```

**Sau tối ưu:**

```markdown
Tải lần đầu: main.js (850 KB) ↓ 93%
Thời gian màn hình đầu: 1.5-2.5 giây ↑ 70%
Chỉ bao gồm code cốt lõi + trang chủ hiện tại
```

**Dữ liệu cụ thể:**

- Giảm kích thước JavaScript: **12.5 MB → 850 KB (giảm 93%)**
- Rút ngắn thời gian màn hình đầu: **10 giây → 2 giây (cải thiện 70%)**
- Tải trang tiếp theo: **trung bình 300-500 KB mỗi trang**
- Điểm trải nghiệm người dùng: **từ 45 lên 92 điểm (Lighthouse)**

**Giá trị kinh doanh:**

- Tỷ lệ rời trang giảm 35%
- Thời gian ở lại trang tăng 50%
- Tỷ lệ chuyển đổi tăng 25%

## Điểm chính phỏng vấn

**Câu hỏi mở rộng thường gặp:**

1. **Q: Tại sao không dùng React.lazy() hoặc component bất đồng bộ của Vue?**
   A: Chúng tôi có dùng component bất đồng bộ của Vue (`() => import()`), nhưng điểm chính là **kiến trúc ba tầng**:

   - Tầng 1 (template): quyết định lúc compile (cấu hình Vite)
   - Tầng 2 (trang): Lazy Loading lúc chạy
   - Tầng 3 (quyền): kiểm soát bởi navigation guard

   Lazy loading đơn thuần chỉ làm được tầng 2, chúng tôi đã thêm phân tách ở cấp template.

2. **Q: Làm sao quyết định code nào nên nằm trong main.js?**
   A: Qua cấu hình `manualChunks` của Vite:

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

   Nguyên tắc: chỉ những thứ "mỗi trang đều dùng" mới đặt vào vendor chunk.

3. **Q: Lazy Loading có ảnh hưởng trải nghiệm người dùng (thời gian chờ) không?**
   A: Có hai chiến lược đối phó:

   - **Prefetch**: tải trước các trang có thể truy cập khi nhàn rỗi
   - **Trạng thái loading**: sử dụng Skeleton Screen thay vì màn hình trắng

   Thử nghiệm thực tế: thời gian tải trung bình của trang tiếp theo < 500ms, người dùng không cảm nhận được.

4. **Q: Làm sao đo lường hiệu quả tối ưu?**
   A: Sử dụng kết hợp nhiều công cụ:

   - **Lighthouse**: Performance Score (45 → 92)
   - **Webpack Bundle Analyzer**: phân tích trực quan kích thước chunk
   - **Chrome DevTools**: Network waterfall, Coverage
   - **Real User Monitoring (RUM)**: dữ liệu người dùng thực

5. **Q: Có những đánh đổi (Trade-off) nào?**
   A:
   - Có thể gặp vấn đề phụ thuộc vòng khi phát triển (cần điều chỉnh cấu trúc module)
   - Thời gian tải ngắn khi chuyển route lần đầu (giải quyết bằng prefetch)
   - Nhưng tổng thể lợi ích vượt xa, đặc biệt cải thiện trải nghiệm trên điện thoại
