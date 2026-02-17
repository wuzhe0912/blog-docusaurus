---
title: '[Lv3] Thách thức triển khai SSR và giải pháp'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> Các vấn đề phổ biến khi làm SSR và cách giải quyết: Hydration Mismatch, biến môi trường, tương thích thư viện bên thứ ba, hiệu năng và kiến trúc deploy.

---

## Tình huống phỏng vấn

**Câu hỏi: Khi triển khai SSR, bạn gặp khó khăn gì và giải quyết như thế nào?**

Nhà tuyển dụng thường đánh giá:

1. **Kinh nghiệm thực tế**: đã từng làm SSR trong dự án thật hay chưa.
2. **Tư duy giải quyết vấn đề**: tìm nguyên nhân gốc và ưu tiên xử lý.
3. **Độ sâu kỹ thuật**: rendering, hydration, cache, deploy.
4. **Best practices**: giải pháp bền vững, dễ bảo trì, đo lường được.

---

## Thách thức 1: Hydration Mismatch

### Mô tả vấn đề

Cảnh báo phổ biến:

```text
[Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
```

Nguyên nhân thường gặp:

- Output khác nhau giữa server render và client render
- Dùng API chỉ có trên browser trong đường SSR (`window`, `document`, `localStorage`)
- Giá trị không xác định (`Date.now()`, `Math.random()`)

### Giải pháp

#### Cách A: dùng `ClientOnly`

```vue
<template>
  <div>
    <h1>Nội dung SSR</h1>
    <ClientOnly>
      <BrowserOnlyComponent />
      <template #fallback>
        <div>Đang tải...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

#### Cách B: đặt guard phía client

```vue
<script setup lang="ts">
const ua = ref('');

onMounted(() => {
  if (process.client) {
    ua.value = window.navigator.userAgent;
  }
});
</script>
```

**Thông điệp chính:** output SSR phải deterministic; logic chỉ-trên-browser phải tách rõ sang client.

---

## Thách thức 2: Biến môi trường

### Mô tả vấn đề

- Secret phía server có thể bị lộ ra client.
- Dùng `process.env` lung tung làm cấu hình khó theo dõi.

### Giải pháp

Tách bằng runtime config:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
});
```

```ts
// sử dụng
const config = useRuntimeConfig();
const apiBase = config.public.apiBase; // client + server
const secret = config.apiSecret; // chỉ server
```

**Thông điệp chính:** secret chỉ để ở server; config public đặt rõ trong block `public`.

---

## Thách thức 3: Thư viện bên thứ ba không hỗ trợ SSR

### Mô tả vấn đề

- Một số package chạm vào DOM trong quá trình SSR.
- Hậu quả: lỗi build/runtime hoặc hydration mismatch.

### Giải pháp

1. Chỉ load thư viện ở client (plugin `.client.ts`)
2. Import động trong context client
3. Cân nhắc thư viện thay thế có SSR support

```ts
let chartLib: any;
if (process.client) {
  chartLib = await import('chart.js/auto');
}
```

**Thông điệp chính:** cô lập nguyên nhân trước, sau đó mới chọn client-isolation hay đổi thư viện.

---

## Thách thức 4: Xử lý cookie và header

### Mô tả vấn đề

- Auth trong SSR cần đọc cookie ở server.
- Header cần đồng nhất giữa client, SSR, và API.

### Giải pháp

```ts
const token = useCookie('access_token');

const { data } = await useFetch('/api/me', {
  headers: process.server
    ? useRequestHeaders(['cookie'])
    : undefined,
  credentials: 'include',
});
```

**Thông điệp chính:** request SSR không được mất auth context.

---

## Thách thức 5: Timing khi tải bất đồng bộ

### Mô tả vấn đề

- Nhiều component cùng tải một dữ liệu.
- Request trùng lặp và loading state không nhất quán.

### Giải pháp

- Dùng key thống nhất cho deduplication
- Dùng shared composable để trung tâm hóa truy cập data
- Tách rõ initial load và user action

```ts
const { data, refresh } = await useFetch('/api/products', {
  key: 'products-list',
  lazy: false,
  server: true,
});
```

**Thông điệp chính:** trung tâm hóa data flow, không fetch lặp lại ở từng component.

---

## Thách thức 6: Hiệu năng và tải server

### Mô tả vấn đề

- SSR tăng CPU và I/O.
- Khi tải cao, TTFB tăng.

### Giải pháp

1. Cache với Nitro
2. Tối ưu query DB
3. Tách SSR/CSR theo mục tiêu SEO
4. Đặt CDN đúng cách

```ts
export default defineCachedEventHandler(
  async () => await getProductsFromDB(),
  { maxAge: 60 * 10, swr: true },
);
```

**Thông điệp chính:** performance là bài toán kiến trúc, không chỉ là frontend detail.

---

## Thách thức 7: Xử lý lỗi và 404

### Mô tả vấn đề

- ID động có thể không hợp lệ.
- Nếu 404 semantic sai, SEO có thể index trang lỗi.

### Giải pháp

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}
```

Bổ sung:

- `error.vue` để hiển thị lỗi rõ ràng
- Trang lỗi đặt `noindex, nofollow`

**Thông điệp chính:** HTTP status, UX và SEO phải nhất quán.

---

## Thách thức 8: Browser-only APIs

### Mô tả vấn đề

- SSR context không có `window`/`document`.
- Truy cập trực tiếp sẽ gây runtime error.

### Giải pháp

```ts
const width = ref<number | null>(null);

onMounted(() => {
  width.value = window.innerWidth;
});
```

Hoặc guard:

```ts
if (process.client) {
  localStorage.setItem('theme', 'dark');
}
```

**Thông điệp chính:** API của browser chỉ dùng trong pha client đã được bảo bọc.

---

## Thách thức 9: Memory leak trên server

### Mô tả vấn đề

- Node process chạy lâu bị tăng memory liên tục.
- Thường do global mutable state, timer/listener không cleanup.

### Giải pháp

1. Không giữ state theo request trong biến global
2. Cleanup listener/interval đầy đủ
3. Theo dõi bằng heap snapshot và `process.memoryUsage()`

```ts
setInterval(() => {
  const mem = process.memoryUsage();
  console.log('rss', mem.rss);
}, 60_000);
```

**Thông điệp chính:** leak trong SSR là rủi ro vận hành và cả bảo mật.

---

## Thách thức 10: Script quảng cáo và tracking

### Mô tả vấn đề

- Script bên thứ ba có thể block main thread hoặc phá hydration.
- CLS/FID/INP xấu đi.

### Giải pháp

- Load script bất đồng bộ và tiêm gần cuối trang
- Đặt sẵn khung cho ad để tránh layout shift
- UI quan trọng không phụ thuộc tracking

```ts
useHead({
  script: [
    { src: 'https://example.com/tracker.js', async: true, tagPosition: 'bodyClose' },
  ],
});
```

**Thông điệp chính:** monetization không được đánh đổi rendering stability.

---

## Thách thức 11: Kiến trúc deploy (SSR vs SPA)

### Mô tả vấn đề

- SPA deploy static, đơn giản.
- SSR cần compute layer, observability, và quản lý process.

### So sánh

| Khía cạnh      | SPA (Static)         | SSR (Node/Edge)                  |
| -------------- | -------------------- | -------------------------------- |
| Hạ tầng        | Storage + CDN        | Compute + CDN                    |
| Vận hành       | Rất đơn giản         | Độ phức tạp trung bình           |
| Chi phí        | Thấp                 | Cao hơn do chi phí compute       |
| Giám sát       | Ít                   | Logs, metrics, memory, cold start|

### Khuyên nghị

1. Dùng PM2 hoặc container để tăng độ ổn định
2. Cấu hình CDN và Cache-Control đúng
3. Có staging và load test trước production
4. Định nghĩa error budget và alerting

**Thông điệp chính:** SSR không chỉ là render, mà là kiến trúc vận hành.

---

## Tổng kết cho phỏng vấn

**Câu trả lời mẫu (30-45 giây):**

> Khi làm SSR, tôi chia vấn đề thành bốn nhóm: render deterministic để tránh hydration mismatch, tách biệt rõ config server/client, tối ưu performance bằng deduplication-cache-splitting, và đảm bảo vận hành ổn định với xử lý lỗi, memory monitoring, và kiến trúc deploy phù hợp.

**Checklist:**
- ✅ Nêu ít nhất một vấn đề cụ thể và nguyên nhân
- ✅ Trình bày giải pháp kỹ thuật rõ ràng
- ✅ Kết nối tác động đến SEO/performance/vận hành
- ✅ Chốt bằng bối cảnh dự án thực tế
