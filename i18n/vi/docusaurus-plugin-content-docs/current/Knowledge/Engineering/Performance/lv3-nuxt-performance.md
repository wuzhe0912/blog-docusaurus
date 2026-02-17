---
title: '[Lv3] Tối ưu hiệu năng Nuxt 3: Bundle Size, tốc độ SSR và tối ưu hình ảnh'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Hướng dẫn tối ưu hiệu năng Nuxt 3 toàn diện: từ giảm Bundle Size, tối ưu tốc độ SSR đến chiến lược tải hình ảnh, tạo trải nghiệm hiệu năng tối ưu.

---

## 1. Các trục chính trả lời phỏng vấn

1. **Tối ưu Bundle Size**: phân tích (`nuxi analyze`), tách (`SplitChunks`), Tree Shaking, tải trì hoãn (Lazy Loading).
2. **Tối ưu tốc độ SSR (TTFB)**: cache Redis, Nitro Cache, giảm các cuộc gọi API chặn, Streaming SSR.
3. **Tối ưu hình ảnh**: `@nuxt/image`, định dạng WebP, CDN, Lazy Loading.
4. **Tối ưu dữ liệu lớn**: Virtual Scrolling, cuộn vô hạn (Infinite Scroll), phân trang (Pagination).

---

## 2. Làm sao giảm Bundle Size của Nuxt 3?

### 2.1 Công cụ chẩn đoán

Trước tiên, phải biết bottleneck ở đâu. Dùng `nuxi analyze` để trực quan hóa cấu trúc Bundle.

```bash
npx nuxi analyze
```

Lệnh này sẽ tạo báo cáo hiển thị package nào chiếm nhiều không gian nhất.

### 2.2 Chiến lược tối ưu

#### 1. Code Splitting (tách code)
Nuxt 3 mặc định đã thực hiện Code Splitting dựa trên route. Nhưng với các package lớn (như ECharts, Lodash), cần tối ưu thủ công.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('lodash')) return 'lodash';
              if (id.includes('echarts')) return 'echarts';
            }
          },
        },
      },
    },
  },
});
```

#### 2. Tree Shaking và import theo yêu cầu

```typescript
// ❌ Sai: import toàn bộ lodash
import _ from 'lodash';
_.debounce(() => {}, 100);

// ✅ Đúng: chỉ import debounce
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// ✅ Khuyên nghị: dùng vueuse (chuyên cho Vue và Tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. Lazy Loading component

```vue
<template>
  <div>
    <!-- Code component chỉ được tải khi show là true -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. Loại bỏ package Server-side không cần thiết
Đảm bảo các package chỉ dùng ở Server (database driver, thao tác fs) không bị đóng gói vào Client. Nuxt 3 tự động xử lý các file kết thúc bằng `.server.ts`, hoặc dùng thư mục `server/`.

---

## 3. Làm sao tối ưu tốc độ SSR (TTFB)?

### 3.1 Tại sao TTFB quá lâu?
TTFB (Time To First Byte) là chỉ số then chốt của hiệu năng SSR. Nguyên nhân thường gặp:
1. **API trả lời chậm**: Server phải đợi back-end trả dữ liệu mới render HTML.
2. **Request nối tiếp**: nhiều API request chạy liên tiếp thay vì song song.
3. **Tính toán nặng**: Server thực thi quá nhiều tác vụ CPU-intensive.

### 3.2 Giải pháp tối ưu

#### 1. Cache phía Server (Nitro Cache)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { swr: 3600 },
    '/products/**': { swr: 600 },
    '/api/**': { cache: { maxAge: 60 } },
  },
});
```

#### 2. Request song song (Parallel Fetching)

```typescript
// ❌ Chậm: chạy nối tiếp (tổng thời gian = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// ✅ Nhanh: chạy song song (tổng thời gian = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. Trì hoãn dữ liệu không quan trọng (Lazy Fetching)

```typescript
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false,
});
```

#### 4. Streaming SSR (thử nghiệm)
Nuxt 3 hỗ trợ HTML Streaming, cho phép gửi nội dung trong khi render, giúp người dùng thấy nội dung nhanh hơn.

---

## 4. Tối ưu hình ảnh Nuxt 3

### 4.1 Sử dụng @nuxt/image
Module chính thức `@nuxt/image` là giải pháp tốt nhất:
- **Tự động chuyển đổi định dạng**: tự động chuyển sang WebP/AVIF.
- **Tự động thay đổi kích thước**: tạo hình ảnh theo kích thước màn hình.
- **Lazy Loading**: tích hợp sẵn.
- **Tích hợp CDN**: hỗ trợ Cloudinary, Imgix và nhiều provider khác.

### 4.2 Ví dụ triển khai

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    format: ['webp'],
  },
});
```

```vue
<template>
  <NuxtImg
    src="/hero.jpg"
    format="webp"
    width="300"
    loading="lazy"
    placeholder
  />
</template>
```

---

## 5. Phân trang và cuộn cho dữ liệu lớn

### 5.1 Chọn giải pháp
Với dữ liệu lớn (vd. 10,000 sản phẩm), ba chiến lược chính, cần xem xét **SEO**:

| Chiến lược | Trường hợp áp dụng | Tương thích SEO |
| :--- | :--- | :--- |
| **Phân trang truyền thống** | Danh sách e-commerce, bài viết | Xuất sắc (tốt nhất) |
| **Cuộn vô hạn** | Feed xã hội, tường ảnh | Thấp (cần xử lý đặc biệt) |
| **Virtual Scrolling** | Báo cáo phức tạp, danh sách rất dài | Rất thấp (nội dung không có trong DOM) |

### 5.2 Làm sao duy trì SEO với cuộn vô hạn?
Với cuộn vô hạn, công cụ tìm kiếm thường chỉ crawl được trang đầu. Giải pháp:
1. **Kết hợp chế độ phân trang**: cung cấp thẻ `<link rel="next" href="...">` để crawler biết trang tiếp theo.
2. **Noscript Fallback**: cung cấp phiên bản phân trang truyền thống trong `<noscript>` cho crawler.
3. **Nút "Tải thêm"**: SSR render 20 dòng đầu, phần còn lại tải qua click "Tải thêm" hoặc cuộn.

### 5.3 Ví dụ triển khai (Load More + SEO)

```vue
<script setup>
const page = ref(1);
const { data: posts } = await useFetch('/api/posts', {
  query: { page: page.value }
});

const loadMore = async () => {
  page.value++;
  const newPosts = await $fetch('/api/posts', {
      query: { page: page.value }
  });
  posts.value.push(...newPosts);
};
</script>

<template>
  <div>
    <div v-for="post in posts" :key="post.id">{{ post.title }}</div>
    <button @click="loadMore">Tải thêm</button>

    <Head>
      <Link rel="next" :href="`/posts?page=${page + 1}`" />
    </Head>
  </div>
</template>
```

---

## 6. Lazy Loading trong môi trường SSR

### 6.1 Mô tả vấn đề
Trong môi trường SSR, sử dụng `IntersectionObserver` sẽ gây lỗi hoặc Hydration Mismatch vì Server không có `window` hay `document`.

### 6.2 Giải pháp

#### 1. Dùng component tích hợp của Nuxt
- `<LazyComponent>`
- `<NuxtImg loading="lazy">`

#### 2. Directive tùy chỉnh (xử lý SSR)

```typescript
// plugins/lazy-load.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value;
          observer.disconnect();
        }
      });
      observer.observe(el);
    },
    getSSRProps(binding) {
      return {
        src: 'placeholder.png'
      };
    }
  });
});
```

---

## 7. Giám sát và theo dõi hiệu năng SSR

### 7.1 Tại sao cần giám sát?
Bottleneck của ứng dụng SSR thường ở phía Server, DevTools trình duyệt không thấy được. Nếu không giám sát, khó phát hiện API trả lời chậm, Memory Leak hay CPU cao là nguyên nhân TTFB tăng.

### 7.2 Công cụ thường dùng

1. **Nuxt DevTools (giai đoạn phát triển)**:
    - Tích hợp sẵn trong Nuxt 3.
    - Xem thời gian phản hồi của Server Routes.

2. **Lighthouse / PageSpeed Insights (sau triển khai)**:
    - Giám sát Core Web Vitals (LCP, CLS, FID/INP).

3. **Giám sát phía Server (APM)**:
    - **Sentry / Datadog**: theo dõi lỗi và hiệu năng phía Server.
    - **OpenTelemetry**: theo dõi toàn bộ Request Trace.

### 7.3 Triển khai theo dõi thời gian đơn giản

```typescript
// server/middleware/timing.ts
export default defineEventHandler((event) => {
  const start = performance.now();

  event.node.res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[${event.method}] ${event.path} - ${duration.toFixed(2)}ms`);
  });
});
```

---

## 8. Tổng kết phỏng vấn

**Q: Làm sao theo dõi và giám sát vấn đề hiệu năng SSR?**
> Trong giai đoạn phát triển, tôi chủ yếu dùng **Nuxt DevTools** để xem thời gian phản hồi Server Routes và kích thước Payload. Trong Production, tôi theo dõi **Core Web Vitals** (đặc biệt LCP) và **TTFB**. Nếu cần phân tích sâu, tôi dùng Server Middleware tùy chỉnh ghi thời gian request, hoặc tích hợp **Sentry** / **OpenTelemetry**.

**Q: Làm sao giảm Bundle Size của Nuxt 3?**
> Tôi bắt đầu phân tích bằng `nuxi analyze`. Với các package lớn (như lodash) thì Tree Shaking hoặc tách thủ công (`manualChunks`). Component không cần cho màn hình đầu thì dùng `<LazyComponent>`.

**Q: Làm sao tối ưu tốc độ SSR?**
> Trọng tâm là giảm TTFB. Tôi dùng `routeRules` của Nitro để cấu hình cache phía Server (SWR). Request API chạy song song bằng `Promise.all`. Dữ liệu không quan trọng đặt `lazy: true` để tải phía Client.

**Q: Tối ưu hình ảnh như thế nào?**
> Tôi dùng module `@nuxt/image`, tự động chuyển WebP, tự động thay đổi kích thước và hỗ trợ Lazy Loading, giảm đáng kể lượng truyền tải.

**Q: Cuộn vô hạn làm sao đảm bảo SEO?**
> Cuộn vô hạn không tốt cho SEO. Với trang nội dung, tôi ưu tiên phân trang truyền thống. Nếu bắt buộc dùng cuộn vô hạn, tôi render trang đầu bằng SSR và dùng Meta Tags (`rel="next"`) để báo crawler cấu trúc phân trang.
