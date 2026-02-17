---
id: performance-lv1-image-optimization
title: '[Lv1] Tối ưu hóa tải hình ảnh: bốn tầng Lazy Load'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> Với chiến lược Lazy Loading hình ảnh bốn tầng, lưu lượng hình ảnh màn hình đầu tiên giảm từ 60MB xuống 2MB, thời gian tải cải thiện 85%.

---

## Bối cảnh vấn đề (Situation)

> Hãy tưởng tượng bạn đang lướt web trên điện thoại, màn hình chỉ hiển thị được 10 hình ảnh, nhưng trang web tải cả 500 hình ảnh cùng lúc. Điện thoại sẽ lag nghiêm trọng và lưu lượng bị đốt cháy 50MB.

**Tình huống thực tế trong dự án:**

```markdown
Thống kê trang chủ một trang
├─ 300+ hình thu nhỏ (mỗi hình 150-300KB)
├─ 50+ banner khuyến mại
└─ Nếu tải tất cả: 300 × 200KB = 60MB+ dữ liệu hình ảnh

Vấn đề thực tế
├─ Màn hình đầu chỉ hiển thị 8-12 hình
├─ Người dùng có thể chỉ cuộn đến hình thứ 30 rồi rời đi
└─ 270 hình còn lại tải hoàn toàn vô ích (lãng phí lưu lượng + chậm)

Ảnh hưởng
├─ Thời gian tải lần đầu: 15-20 giây
├─ Tiêu hao lưu lượng: 60MB+ (người dùng phàn nàn)
├─ Trang bị giật: cuộn không mượt
└─ Tỷ lệ rời trang: 42% (rất cao)
```

## Mục tiêu tối ưu (Task)

1. **Chỉ tải hình ảnh trong vùng hiển thị**
2. **Tải trước hình ảnh sắp vào cửa sổ** (bắt đầu tải trước 50px)
3. **Kiểm soát số lượng tải đồng thời** (tránh tải quá nhiều hình cùng lúc)
4. **Ngăn chặn lãng phí tài nguyên khi chuyển đổi nhanh**
5. **Lưu lượng hình màn hình đầu < 3MB**

## Giải pháp (Action)

### Triển khai v-lazy-load.ts

> Bốn tầng image lazy load

#### Tầng 1: Phát hiện khả năng hiển thị trong cửa sổ (IntersectionObserver)

```js
// Tạo observer để giám sát hình ảnh có vào cửa sổ không
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Hình ảnh đã vào vùng hiển thị
        // Bắt đầu tải hình ảnh
      }
    });
  },
  {
    rootMargin: '50px 0px', // Bắt đầu tải trước 50px (tải trước)
    threshold: 0.1, // Chỉ cần lộ 10% là kích hoạt
  }
);
```

- Sử dụng API IntersectionObserver gốc của trình duyệt (hiệu năng vượt trội hơn event scroll)
- rootMargin: "50px" -> khi hình ảnh còn cách 50px bên dưới đã bắt đầu tải, người dùng cuộn đến thì đã sẵn sàng (cảm giác mượt hơn)
- Hình ảnh ngoài cửa sổ hoàn toàn không tải

#### Tầng 2: Cơ chế kiểm soát đồng thời (quản lý hàng đợi)

```js
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent = 6  // Tối đa 6 hình tải đồng thời
  private queue: (() => void)[] = []

  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)  // Còn chỗ trống, tải ngay
    } else {
      this.queue.push(loadFn)   // Hết chỗ, xếp hàng chờ
    }
  }
}
```

- Ngay cả khi 20 hình vào cửa sổ cùng lúc, chỉ tải 6 hình đồng thời
- Tránh "tải thác" làm nghẽn trình duyệt (Chrome mặc định tối đa 6 kết nối đồng thời)
- Khi tải xong một hình, tự động xử lý hình tiếp theo trong hàng đợi

```md
Người dùng cuộn nhanh xuống cuối → 30 hình kích hoạt đồng thời
Không có hàng đợi: 30 request gửi cùng lúc → trình duyệt giật
Có hàng đợi: 6 hình đầu tải trước → xong rồi tải 6 hình tiếp → mượt
```

#### Tầng 3: Giải quyết vấn đề race condition (kiểm soát phiên bản)

```js
// Đặt số phiên bản khi tải
el.setAttribute('data-version', Date.now().toString());

// Kiểm tra phiên bản khi tải xong
img.onload = () => {
  const currentVersion = img.getAttribute('data-version');
  if (loadVersion === currentVersion) {
    // Phiên bản khớp, hiển thị hình ảnh
  } else {
    // Phiên bản không khớp, người dùng đã chuyển sang danh mục khác, không hiển thị
  }
};
```

Ví dụ thực tế:

```md
Thao tác người dùng:

1. Click "Tin tức" → kích hoạt tải 100 hình (phiên bản 1001)
2. 0.5 giây sau click "Khuyến mại" → kích hoạt tải 80 hình (phiên bản 1002)
3. Hình tin tức 1 giây sau mới tải xong

Không có kiểm soát phiên bản: hiển thị hình tin tức (sai!)
Có kiểm soát phiên bản: kiểm tra phiên bản không khớp, hủy hình tin tức (đúng!)
```

#### Tầng 4: Chiến lược placeholder (hình trong suốt Base64)

```js
// Mặc định hiển thị SVG trong suốt 1×1, tránh dịch chuyển bố cục
el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi...';

// URL hình ảnh thật lưu trong data-src
el.setAttribute('data-src', realImageUrl);
```

- Sử dụng SVG trong suốt mã hóa Base64 (chỉ 100 bytes)
- Tránh CLS (Cumulative Layout Shift)
- Người dùng không thấy hiện tượng "hình ảnh đột ngột nhảy ra"

## Kết quả tối ưu (Result)

**Trước tối ưu:**

```markdown
Hình màn hình đầu: tải 300 hình cùng lúc (60MB)
Thời gian tải: 15-20 giây
Độ mượt khi cuộn: giật nghiêm trọng
Tỷ lệ rời trang: 42%
```

**Sau tối ưu:**

```markdown
Hình màn hình đầu: chỉ tải 8-12 hình (2MB) ↓ 97%
Thời gian tải: 2-3 giây ↑ 85%
Độ mượt khi cuộn: mượt (60fps)
Tỷ lệ rời trang: 28% ↓ 33%
```

**Dữ liệu cụ thể:**

- Lưu lượng hình màn hình đầu: **60 MB → 2 MB (giảm 97%)**
- Thời gian tải hình: **15 giây → 2 giây (cải thiện 85%)**
- FPS khi cuộn trang: **từ 20-30 tăng lên 55-60**
- Sử dụng bộ nhớ: **giảm 65%** (hình chưa tải không chiếm bộ nhớ)

**Chỉ số kỹ thuật:**

- Hiệu năng IntersectionObserver: vượt trội so với event scroll truyền thống (sử dụng CPU giảm 80%)
- Hiệu quả kiểm soát đồng thời: tránh nghẽn request trình duyệt
- Tỷ lệ chính xác kiểm soát phiên bản: 99.5% (rất ít hình sai)

## Điểm chính phỏng vấn

**Câu hỏi mở rộng thường gặp:**

1. **Q: Tại sao không dùng trực tiếp thuộc tính `loading="lazy"`?**
   A: Thuộc tính gốc `loading="lazy"` có một số hạn chế:

   - Không thể kiểm soát khoảng cách tải trước (trình duyệt quyết định)
   - Không thể kiểm soát số lượng tải đồng thời
   - Không thể xử lý kiểm soát phiên bản (vấn đề chuyển đổi nhanh)
   - Trình duyệt cũ không hỗ trợ

   Directive tùy chỉnh cung cấp kiểm soát chi tiết hơn, phù hợp với các tình huống phức tạp.

2. **Q: IntersectionObserver tốt hơn event scroll ở điểm nào?**
   A:

   ```javascript
   // ❌ Event scroll truyền thống
   window.addEventListener('scroll', () => {
     // Kích hoạt mỗi lần cuộn (60 lần/giây)
     // Cần tính toán vị trí phần tử (getBoundingClientRect)
     // Có thể gây reflow cưỡng chế (sát thủ hiệu năng)
   });

   // ✅ IntersectionObserver
   const observer = new IntersectionObserver(callback);
   // Chỉ kích hoạt khi phần tử vào/ra cửa sổ
   // Tối ưu gốc của trình duyệt, không chặn thread chính
   // Cải thiện hiệu năng 80%
   ```

3. **Q: Giới hạn 6 hình đồng thời đến từ đâu?**
   A: Dựa trên **giới hạn đồng thời HTTP/1.1 cùng nguồn** của trình duyệt:

   - Chrome/Firefox: tối đa 6 kết nối đồng thời mỗi domain
   - Request vượt giới hạn sẽ xếp hàng đợi
   - HTTP/2 có thể nhiều hơn, nhưng vì tương thích vẫn giữ ở 6
   - Thử nghiệm thực tế: 6 hình đồng thời là điểm cân bằng tốt nhất giữa hiệu năng và trải nghiệm

4. **Q: Tại sao dùng timestamp thay vì UUID cho kiểm soát phiên bản?**
   A:

   - Timestamp: `Date.now()` (đơn giản, đủ dùng, có thể sắp xếp)
   - UUID: `crypto.randomUUID()` (nghiêm ngặt hơn, nhưng thừa thiết kế)
   - Tình huống của chúng tôi: timestamp đã đủ duy nhất (cấp độ mili giây)
   - Cân nhắc hiệu năng: tạo timestamp nhanh hơn

5. **Q: Xử lý như thế nào khi tải hình thất bại?**
   A: Đã triển khai fallback nhiều tầng:

   ```javascript
   img.onerror = () => {
     if (retryCount < 3) {
       // 1. Thử lại 3 lần
       setTimeout(() => reload(), 1000 * retryCount);
     } else {
       // 2. Hiển thị hình mặc định
       img.src = '/images/game-placeholder.png';
     }
   };
   ```

6. **Q: Có gặp vấn đề CLS (Cumulative Layout Shift) không?**
   A: Có ba chiến lược để tránh:

   ```html
   <!-- 1. SVG placeholder mặc định -->
   <img src="data:image/svg+xml..." />

   <!-- 2. CSS aspect-ratio cố định tỷ lệ -->
   <img style="aspect-ratio: 16/9;" />

   <!-- 3. Skeleton Screen -->
   <div class="skeleton-box"></div>
   ```

   Điểm CLS cuối cùng: < 0.1 (xuất sắc)
