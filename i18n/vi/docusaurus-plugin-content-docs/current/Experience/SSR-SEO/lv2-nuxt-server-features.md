---
title: '[Lv2] Tính năng Nuxt 3 Server: Server Routes và Sitemap Động'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Nắm vững tính năng Nitro Server Engine của Nuxt 3, triển khai Server Routes (API Routes), Sitemap động và Robots.txt, nâng cao SEO và tính linh hoạt của kiến trúc website.

---

## 1. Trọng tâm trả lời phỏng vấn

1.  **Server Routes (API Routes)**: Dùng `server/api` hoặc `server/routes` để xây dựng logic backend. Thường dùng để ẩn API Key, xử lý CORS, kiến trúc BFF (Backend for Frontend).
2.  **Sitemap động**: Tạo XML động qua Server Routes (`server/routes/sitemap.xml.ts`), đảm bảo công cụ tìm kiếm có thể index nội dung mới nhất.
3.  **Robots.txt**: Cũng được tạo động qua Server Routes, hoặc cấu hình qua Nuxt Config, kiểm soát quyền truy cập của crawler.

---

## 2. Nuxt 3 Server Engine: Nitro

### 2.1 Nitro là gì?

Nitro là engine server hoàn toàn mới của Nuxt 3, cho phép ứng dụng Nuxt triển khai ở bất kỳ đâu (Universal Deployment). Nó không chỉ là một server, mà còn là công cụ build và runtime mạnh mẽ.

### 2.2 Tính năng cốt lõi của Nitro

1.  **Triển khai đa nền tảng (Universal Deployment)**:
    Có thể biên dịch thành Node.js server, Serverless Functions (Vercel, AWS Lambda, Netlify), Service Workers và nhiều định dạng khác. Triển khai đến các nền tảng chính không cần cấu hình (Zero-config).

2.  **Nhẹ và nhanh (Lightweight & Fast)**:
    Thời gian Cold start cực ngắn, và bundle size được tạo ra rất nhỏ (tối thiểu có thể đạt < 1MB).

3.  **Tự động chia nhỏ code (Auto Code Splitting)**:
    Tự động phân tích dependency của Server Routes và thực hiện code splitting, đảm bảo tốc độ khởi động.

4.  **HMR (Hot Module Replacement)**:
    Không chỉ frontend có HMR, Nitro còn cho phép phát triển backend API cũng được hưởng HMR, chỉnh sửa file trong `server/` mà không cần khởi động lại server.

5.  **Storage Layer (Unstorage)**:
    Tích hợp Storage API thống nhất, dễ dàng kết nối với Redis, GitHub, FS, Memory và các giao diện lưu trữ khác nhau.

6.  **Server Assets**:
    Dễ dàng truy cập file tài nguyên tĩnh ở phía Server.

---

## 3. Nuxt 3 Server Routes (API Routes)

### 3.1 Server Routes là gì?

Nuxt 3 tích hợp sẵn engine server **Nitro**, cho phép developer viết API backend trực tiếp trong dự án. Các file này đặt trong thư mục `server/api` hoặc `server/routes`, sẽ tự động được ánh xạ thành API endpoint.

- `server/api/hello.ts` -> `/api/hello`
- `server/routes/hello.ts` -> `/hello`

### 2.2 Khi nào sẽ dùng? (Câu hỏi phỏng vấn phổ biến)

**1. Ẩn thông tin nhạy cảm (Secret Management)**
Frontend không thể lưu trữ Private API Key một cách an toàn. Thông qua Server Routes làm trung gian, có thể sử dụng biến môi trường để truy cập Key ở phía Server, chỉ trả về kết quả cho frontend.

```typescript
// server/api/weather.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // API Key chỉ dùng ở phía Server, không bị lộ ra Client
  const data = await $fetch(
    `https://api.weather.com/v1?key=${config.weatherApiKey}`
  );
  return data;
});
```

**2. Xử lý vấn đề CORS (Proxy)**
Khi API bên ngoài không hỗ trợ CORS, có thể dùng Server Routes làm Proxy. Trình duyệt gửi request đến Nuxt Server (cùng origin), Nuxt Server gửi request đến API bên ngoài (không có giới hạn CORS).

**3. Backend for Frontend (BFF)**
Tổng hợp, lọc hoặc chuyển đổi định dạng dữ liệu từ nhiều API backend ở phía Nuxt Server, sau đó trả về cho frontend một lần. Giảm số lần request từ frontend và kích thước Payload.

**4. Xử lý Webhook**
Nhận thông báo Webhook từ các dịch vụ bên thứ ba (như cổng thanh toán, CMS).

---

## 4. Triển khai Sitemap động

### 3.1 Tại sao cần Sitemap động?

Đối với các website có nội dung thay đổi thường xuyên (như thương mại điện tử, trang tin tức), `sitemap.xml` được tạo tĩnh sẽ nhanh chóng lỗi thời. Sử dụng Server Routes có thể tạo Sitemap mới nhất mỗi khi có request.

### 3.2 Cách triển khai: Tạo thủ công

Tạo `server/routes/sitemap.xml.ts`:

```typescript
// server/routes/sitemap.xml.ts
import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // 1. Lấy tất cả dữ liệu route động từ database hoặc API
  const posts = await $fetch('https://api.example.com/posts');

  const sitemap = new SitemapStream({
    hostname: 'https://example.com',
  });

  // 2. Thêm trang tĩnh
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

  // 3. Thêm trang động
  posts.forEach((post) => {
    sitemap.write({
      url: `/posts/${post.id}`,
      changefreq: 'weekly',
      lastmod: post.updatedAt,
    });
  });

  sitemap.end();

  // 4. Thiết lập Header và trả về XML
  setHeader(event, 'content-type', 'application/xml');
  return streamToPromise(sitemap);
});
```

### 3.3 Cách triển khai: Dùng module (`@nuxtjs/sitemap`)

Với các nhu cầu tiêu chuẩn, khuyến nghị dùng module chính thức:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    siteUrl: 'https://example.com',
    sources: [
      '/api/sitemap-urls', // Chỉ định một API để cung cấp danh sách URL động
    ],
  },
});
```

---

## 5. Triển khai Robots.txt động

### 4.1 Cách triển khai

Tạo `server/routes/robots.txt.ts`:

```typescript
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProduction = config.public.siteEnv === 'production';

  // Quyết định quy tắc động dựa trên môi trường
  const robots = isProduction
    ? `User-agent: *
Disallow: /admin
Disallow: /private
Sitemap: https://example.com/sitemap.xml`
    : `User-agent: *
Disallow: /`; // Môi trường không chính thức cấm index

  setHeader(event, 'content-type', 'text/plain');
  return robots;
});
```

---

## 6. Tổng hợp điểm mấu chốt phỏng vấn

### 5.1 Nitro Engine & Server Routes

**Q: Server engine của Nuxt 3 là gì? Đặc điểm của Nitro là gì?**

> **Ví dụ trả lời:**
> Server engine của Nuxt 3 được gọi là **Nitro**.
> Đặc điểm lớn nhất của nó là **Universal Deployment**, tức là có thể triển khai đến bất kỳ môi trường nào mà không cần cấu hình (Node.js, Vercel, AWS Lambda, Edge Workers, v.v.).
> Các đặc điểm khác bao gồm: **HMR** cho backend API (chỉnh sửa không cần khởi động lại), **Auto Code Splitting** (tăng tốc độ khởi động), và **Storage Layer** tích hợp sẵn (dễ dàng kết nối Redis hoặc KV Storage).

**Q: Server Routes của Nuxt 3 là gì? Bạn đã triển khai chưa?**

> **Ví dụ trả lời:**
> Có, tôi đã triển khai. Server Routes là tính năng backend mà Nuxt 3 cung cấp thông qua engine Nitro, đặt trong thư mục `server/api`.
> Tôi chủ yếu sử dụng trong các tình huống sau:
>
> 1.  **Ẩn API Key**: Ví dụ khi kết nối dịch vụ bên thứ ba, tránh lộ Secret Key trong code frontend.
> 2.  **CORS Proxy**: Giải quyết vấn đề cross-origin request.
> 3.  **BFF (Backend for Frontend)**: Tổng hợp nhiều API request thành một, giảm số lần request từ frontend và tối ưu cấu trúc dữ liệu.

### 5.2 Sitemap và Robots.txt

**Q: Làm thế nào để triển khai sitemap động và robots.txt trong Nuxt 3?**

> **Ví dụ trả lời:**
> Tôi sẽ dùng Server Routes của Nuxt để triển khai.
> Với **Sitemap**, tôi sẽ tạo `server/routes/sitemap.xml.ts`, trong đó gọi API backend để lấy danh sách bài viết hoặc sản phẩm mới nhất, sau đó dùng package `sitemap` để tạo chuỗi XML và trả về. Cách này đảm bảo công cụ tìm kiếm mỗi lần crawl đều lấy được các liên kết mới nhất.
> Với **Robots.txt**, tôi sẽ tạo `server/routes/robots.txt.ts`, và dựa trên biến môi trường (Production hoặc Staging) để trả về các quy tắc khác nhau, ví dụ thiết lập `Disallow: /` trong môi trường Staging để tránh bị index.

### 5.3 SEO Meta Tags (Bổ sung)

**Q: Bạn xử lý SEO meta tags trong Nuxt 3 như thế nào? Có dùng useHead hoặc useSeoMeta không?**

> **Ví dụ trả lời:**
> Tôi chủ yếu sử dụng các Composables tích hợp sẵn của Nuxt 3 là `useHead` và `useSeoMeta`.
> `useHead` cho phép tôi định nghĩa các thẻ `title`, `meta`, `link`. Nếu chỉ cần thiết lập SEO đơn thuần, tôi ưu tiên dùng `useSeoMeta` vì cú pháp ngắn gọn hơn và có gợi ý kiểu (Type-safe), ví dụ thiết lập trực tiếp các thuộc tính `ogTitle`, `description`.
> Trên các trang động (như trang sản phẩm), tôi sẽ truyền vào một Getter Function (ví dụ `title: () => product.value.name`), để khi dữ liệu cập nhật, Meta Tags cũng tự động phản hồi cập nhật.

---

## 7. Reference liên quan

- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt SEO Module](https://nuxtseo.com/)
