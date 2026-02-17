---
title: '[Lv2] Nuxt 3 Rendering Modes: Chiến lược lựa chọn SSR, SSG, CSR'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Hiểu các Rendering Modes của Nuxt 3, có thể lựa chọn chiến lược render phù hợp (SSR, SSG, CSR) dựa trên yêu cầu dự án.

---

## 1. Trục trả lời phỏng vấn

1. **Phân loại Rendering Modes**: Nuxt 3 hỗ trợ bốn chế độ: SSR, SSG, CSR, Hybrid Rendering
2. **Chiến lược lựa chọn**: Chọn chế độ phù hợp dựa trên yêu cầu SEO, tính động của nội dung và yêu cầu hiệu năng
3. **Kinh nghiệm triển khai**: Cách cấu hình và lựa chọn các Rendering Modes khác nhau trong dự án

---

## 2. Giới thiệu Rendering Modes của Nuxt 3

### 2.1 Bốn Rendering Modes

Nuxt 3 hỗ trợ bốn Rendering Modes chính:

| Chế độ | Tên đầy đủ | Thời điểm render | Kịch bản áp dụng |
|------|------|---------|---------|
| **SSR** | Server-Side Rendering | Render phía Server mỗi lần yêu cầu | Cần SEO + nội dung động |
| **SSG** | Static Site Generation | Tạo trước HTML khi build | Cần SEO + nội dung cố định |
| **CSR** | Client-Side Rendering | Render phía trình duyệt | Không cần SEO + tương tác cao |
| **Hybrid** | Hybrid Rendering | Sử dụng kết hợp nhiều chế độ | Các trang khác nhau có yêu cầu khác nhau |

### 2.2 SSR (Server-Side Rendering)

**Định nghĩa:** Mỗi lần yêu cầu, JavaScript được thực thi phía Server để tạo HTML hoàn chỉnh, sau đó gửi đến trình duyệt.

**Cấu hình:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Mặc định là true
});
```

**Quy trình:**
1. Trình duyệt yêu cầu trang
2. Server thực thi JavaScript, tạo HTML hoàn chỉnh
3. Gửi HTML đến trình duyệt
4. Trình duyệt thực hiện Hydration (kích hoạt chức năng tương tác)

**Ưu điểm:**
- ✅ Thân thiện với SEO (công cụ tìm kiếm có thể thấy nội dung đầy đủ)
- ✅ Tải lần đầu nhanh (không cần đợi JavaScript thực thi)
- ✅ Hỗ trợ nội dung động (dữ liệu mới nhất mỗi lần yêu cầu)

**Nhược điểm:**
- ❌ Tải Server nặng (mỗi yêu cầu đều cần render)
- ❌ TTFB (Time To First Byte) có thể dài
- ❌ Cần môi trường Server

**Kịch bản áp dụng:**
- Trang sản phẩm thương mại điện tử (cần SEO + giá/tồn kho động)
- Trang bài viết tin tức (cần SEO + nội dung động)
- Trang hồ sơ người dùng (cần SEO + nội dung cá nhân hóa)

### 2.3 SSG (Static Site Generation)

**Định nghĩa:** Tại thời điểm build (Build Time), tạo trước tất cả trang HTML và triển khai dưới dạng file tĩnh.

**Cấu hình:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSG cần SSR là true
  nitro: {
    prerender: {
      routes: ['/about', '/contact'], // Chỉ định route cần pre-render
    },
  },
});

// Hoặc sử dụng routeRules
export default defineNuxtConfig({
  routeRules: {
    '/about': { prerender: true },
    '/contact': { prerender: true },
  },
});
```

**Quy trình:**
1. Khi build, thực thi JavaScript để tạo HTML cho tất cả các trang
2. Triển khai file HTML lên CDN
3. Khi trình duyệt yêu cầu, trả về trực tiếp HTML đã tạo trước

**Ưu điểm:**
- ✅ Hiệu năng tốt nhất (cache CDN, phản hồi nhanh)
- ✅ Thân thiện với SEO (nội dung HTML đầy đủ)
- ✅ Tải Server tối thiểu (không cần render runtime)
- ✅ Chi phí thấp (có thể triển khai lên CDN)

**Nhược điểm:**
- ❌ Không phù hợp nội dung động (cần rebuild để cập nhật)
- ❌ Thời gian build có thể dài (khi có nhiều trang)
- ❌ Không thể xử lý nội dung riêng của người dùng

**Kịch bản áp dụng:**
- Trang giới thiệu (nội dung cố định)
- Trang mô tả sản phẩm (nội dung tương đối cố định)
- Bài viết blog (không thay đổi thường xuyên sau khi đăng)

### 2.4 CSR (Client-Side Rendering)

**Định nghĩa:** Thực thi JavaScript trong trình duyệt để tạo nội dung HTML động.

**Cấu hình:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // Tắt SSR toàn cục
});

// Hoặc cho route cụ thể
export default defineNuxtConfig({
  routeRules: {
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});

// Hoặc cấu hình trong trang
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false,
});
</script>
```

**Quy trình:**
1. Trình duyệt yêu cầu HTML (thường là shell rỗng)
2. Tải xuống JavaScript bundle
3. Thực thi JavaScript, tạo nội dung động
4. Render trang

**Ưu điểm:**
- ✅ Tương tác cao, phù hợp SPA
- ✅ Giảm tải Server
- ✅ Chuyển trang mượt (không cần tải lại)

**Nhược điểm:**
- ❌ Không thân thiện SEO (công cụ tìm kiếm có thể không index đúng)
- ❌ Thời gian tải lần đầu dài (cần tải và thực thi JavaScript)
- ❌ Cần JavaScript để xem nội dung

**Kịch bản áp dụng:**
- Hệ thống quản trị backend (không cần SEO)
- Dashboard người dùng (không cần SEO)
- Ứng dụng tương tác (game, công cụ, v.v.)

### 2.5 Hybrid Rendering (Render hỗn hợp)

**Định nghĩa:** Tùy theo yêu cầu của các trang khác nhau, sử dụng kết hợp nhiều Rendering Modes.

**Cấu hình:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // Mặc định SSR
  routeRules: {
    // Trang cần SEO: SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // Trang nội dung cố định: SSG
    '/about': { prerender: true },
    '/contact': { prerender: true },

    // Trang không cần SEO: CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**Ưu điểm:**
- ✅ Lựa chọn chế độ phù hợp theo đặc tính trang
- ✅ Cân bằng giữa SEO, hiệu năng và trải nghiệm phát triển
- ✅ Linh hoạt cao

**Kịch bản áp dụng:**
- Dự án lớn (các trang khác nhau có yêu cầu khác nhau)
- Nền tảng thương mại điện tử (trang sản phẩm SSR, backend CSR, trang giới thiệu SSG)

### 2.6 ISR (Incremental Static Regeneration)

**Định nghĩa:** Tái tạo tĩnh tăng dần. Kết hợp hiệu năng của SSG với tính động của SSR. Trang tạo HTML tĩnh khi build hoặc lần yêu cầu đầu tiên, và được cache trong một khoảng thời gian (TTL). Khi cache hết hạn, yêu cầu tiếp theo sẽ tái tạo trang ở nền trong khi trả về nội dung cache cũ (Stale-While-Revalidate).

**Cấu hình:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // Kích hoạt ISR, cache 1 giờ (3600 giây)
    '/blog/**': { swr: 3600 },
    // Hoặc sử dụng thuộc tính isr (hỗ trợ đặc biệt trên Netlify/Vercel, v.v.)
    '/products/**': { isr: 600 },
  },
});
```

**Quy trình:**
1. Yêu cầu A đến: Server render trang, trả về và cache (Cache MISS -> HIT).
2. Yêu cầu B đến (trong TTL): Trả về trực tiếp nội dung cache (Cache HIT).
3. Yêu cầu C đến (sau TTL): Trả về cache cũ (Stale), đồng thời re-render ở nền và cập nhật cache (Revalidate).
4. Yêu cầu D đến: Trả về nội dung cache mới.

**Ưu điểm:**
- ✅ Hiệu năng gần đạt mức tối ưu của SSG
- ✅ Giải quyết vấn đề thời gian build dài của SSG
- ✅ Nội dung có thể cập nhật định kỳ

**Kịch bản áp dụng:**
- Blog lớn
- Trang chi tiết sản phẩm thương mại điện tử
- Trang tin tức

### 2.7 Route Rules và chiến lược cache

Nuxt 3 sử dụng `routeRules` để quản lý thống nhất render hỗn hợp và chiến lược cache. Điều này được xử lý ở cấp Nitro.

| Thuộc tính | Ý nghĩa | Kịch bản áp dụng |
|------|------|---------|
| `ssr: true` | Bắt buộc Server-Side Rendering | SEO + độ động cao |
| `ssr: false` | Bắt buộc Client-Side Rendering (SPA) | Backend, dashboard |
| `prerender: true` | Pre-render khi build (SSG) | Giới thiệu, trang điều khoản |
| `swr: true` | Kích hoạt cache SWR (không hết hạn, cho đến khi triển khai lại) | Nội dung ít thay đổi |
| `swr: 60` | Kích hoạt ISR, cache 60 giây | Trang danh sách, trang sự kiện |
| `cache: { maxAge: 60 }` | Đặt header Cache-Control (cache trình duyệt/CDN) | Tài nguyên tĩnh |

---

## 3. Chiến lược lựa chọn

### 3.1 Chọn Rendering Mode theo yêu cầu

**Sơ đồ quyết định:**

```
Cần SEO?
├─ Có → Nội dung thay đổi thường xuyên?
│   ├─ Có → SSR
│   └─ Không → SSG
└─ Không → CSR
```

**Bảng so sánh:**

| Yêu cầu | Chế độ khuyến nghị | Lý do |
|------|---------|------|
| **Cần SEO** | SSR / SSG | Công cụ tìm kiếm có thể thấy nội dung đầy đủ |
| **Nội dung thay đổi thường xuyên** | SSR | Lấy nội dung mới nhất mỗi lần yêu cầu |
| **Nội dung tương đối cố định** | SSG | Hiệu năng tốt nhất, chi phí thấp nhất |
| **Không cần SEO** | CSR | Tương tác cao, chuyển trang mượt |
| **Nhiều trang** | SSG | Tạo khi build, cache CDN |
| **Nội dung riêng người dùng** | SSR / CSR | Cần tạo động |

### 3.2 Ví dụ thực tế

#### Ví dụ 1: Nền tảng thương mại điện tử

**Yêu cầu:**
- Trang sản phẩm cần SEO (Google index)
- Nội dung sản phẩm thay đổi thường xuyên (giá, tồn kho)
- Trang cá nhân người dùng không cần SEO

**Giải pháp:**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // Trang sản phẩm: SSR (cần SEO + nội dung động)
    '/products/**': { ssr: true },

    // Giới thiệu: SSG (nội dung cố định)
    '/about': { prerender: true },

    // Trang người dùng: CSR (không cần SEO)
    '/user/**': { ssr: false },
  },
});
```

#### Ví dụ 2: Trang blog

**Yêu cầu:**
- Trang bài viết cần SEO
- Nội dung bài viết tương đối cố định (không thay đổi thường xuyên sau khi đăng)
- Cần tải nhanh

**Giải pháp:**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // Trang bài viết: SSG (nội dung cố định + cần SEO)
    '/articles/**': { prerender: true },

    // Trang chủ: SSG (nội dung cố định)
    '/': { prerender: true },

    // Quản trị backend: CSR (không cần SEO)
    '/admin/**': { ssr: false },
  },
});
```

---

## 4. Điểm trọng tâm phỏng vấn

### 4.1 Rendering Modes của Nuxt 3

**Bạn có thể trả lời như sau:**

> Nuxt 3 hỗ trợ bốn Rendering Modes: SSR render phía Server mỗi lần yêu cầu, phù hợp với trang cần SEO và nội dung động; SSG tạo trước HTML khi build, phù hợp với trang cần SEO và nội dung cố định, hiệu năng tốt nhất; CSR render phía trình duyệt, phù hợp với trang không cần SEO và tương tác cao; Hybrid Rendering kết hợp nhiều chế độ, chọn chế độ phù hợp theo yêu cầu từng trang.

**Điểm chính:**
- ✅ Đặc tính và sự khác biệt của bốn chế độ
- ✅ Kịch bản áp dụng và tiêu chí lựa chọn
- ✅ Ưu điểm của Hybrid Rendering

### 4.2 Cách chọn Rendering Mode?

**Bạn có thể trả lời như sau:**

> Lựa chọn Rendering Mode chủ yếu xem xét ba yếu tố: yêu cầu SEO, tính động của nội dung và yêu cầu hiệu năng. Trang cần SEO chọn SSR hoặc SSG; nội dung thay đổi thường xuyên chọn SSR; nội dung cố định chọn SSG; trang không cần SEO có thể chọn CSR. Trong dự án thực tế thường sử dụng Hybrid Rendering, chọn chế độ phù hợp theo đặc tính từng trang. Ví dụ, nền tảng thương mại điện tử sử dụng SSR cho trang sản phẩm (cần SEO + nội dung động), SSG cho trang giới thiệu (nội dung cố định), CSR cho trang cá nhân người dùng (không cần SEO).

**Điểm chính:**
- ✅ Lựa chọn dựa trên yêu cầu SEO, tính động nội dung và yêu cầu hiệu năng
- ✅ Sử dụng kết hợp nhiều chế độ trong dự án thực tế
- ✅ Giải thích bằng ví dụ cụ thể

### 4.3 ISR và Route Rules
**Q: Làm thế nào để triển khai ISR (Incremental Static Regeneration)? Các cơ chế caching của Nuxt 3 gồm những gì?**

> **Ví dụ trả lời:**
> Trong Nuxt 3, chúng ta có thể triển khai ISR thông qua `routeRules`.
> Chỉ cần cấu hình `{ swr: số giây }` trong `nuxt.config.ts`, Nitro sẽ tự động kích hoạt cơ chế Stale-While-Revalidate.
> Ví dụ `'/blog/**': { swr: 3600 }` nghĩa là các trang dưới đường dẫn đó sẽ được cache 1 giờ.
> `routeRules` rất mạnh mẽ, cho phép cấu hình chiến lược khác nhau cho các đường dẫn khác nhau: một số trang dùng SSR, một số dùng SSG (`prerender: true`), một số dùng ISR (`swr`), một số dùng CSR (`ssr: false`), đó chính là tinh hoa của Hybrid Rendering.

---

## 5. Thực tiễn tốt nhất

### 5.1 Nguyên tắc lựa chọn

1. **Trang cần SEO**
   - Nội dung cố định → SSG
   - Nội dung động → SSR

2. **Trang không cần SEO**
   - Tương tác cao → CSR
   - Cần logic phía Server → SSR

3. **Chiến lược hỗn hợp**
   - Chọn chế độ phù hợp theo đặc tính trang
   - Quản lý thống nhất bằng `routeRules`

### 5.2 Khuyến nghị cấu hình

1. **Mặc định sử dụng SSR**
   - Đảm bảo thân thiện SEO
   - Có thể điều chỉnh sau cho trang cụ thể

2. **Quản lý thống nhất bằng routeRules**
   - Cấu hình tập trung, dễ bảo trì
   - Đánh dấu rõ chế độ render của từng trang

3. **Kiểm tra và tối ưu định kỳ**
   - Điều chỉnh theo tình hình sử dụng thực tế
   - Giám sát các chỉ số hiệu năng

---

## 6. Tổng kết phỏng vấn

**Bạn có thể trả lời như sau:**

> Nuxt 3 hỗ trợ bốn Rendering Modes: SSR, SSG, CSR và Hybrid Rendering. SSR phù hợp với trang cần SEO và nội dung động; SSG phù hợp với trang cần SEO và nội dung cố định, hiệu năng tốt nhất; CSR phù hợp với trang không cần SEO và tương tác cao. Khi lựa chọn chủ yếu xem xét yêu cầu SEO, tính động nội dung và yêu cầu hiệu năng. Trong dự án thực tế thường sử dụng Hybrid Rendering, chọn chế độ phù hợp theo đặc tính từng trang. Ví dụ, nền tảng thương mại điện tử sử dụng SSR cho trang sản phẩm, SSG cho trang giới thiệu, CSR cho trang cá nhân người dùng.

**Điểm chính:**
- ✅ Đặc tính và sự khác biệt của bốn Rendering Modes
- ✅ Chiến lược lựa chọn và yếu tố đánh giá
- ✅ Kinh nghiệm triển khai Hybrid Rendering
- ✅ Ví dụ dự án thực tế

---

## 7. Reference

- [Nuxt 3 Rendering Modes](https://nuxt.com/docs/guide/concepts/rendering)
- [Nuxt 3 Route Rules](https://nuxt.com/docs/api/nuxt-config#routerules)
