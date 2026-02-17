---
title: '[Lv2] Triển khai SSR: Data Fetching và quản lý SEO Meta'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Trong dự án Nuxt 3: triển khai tải dữ liệu bằng SSR và quản lý SEO Meta động để công cụ tìm kiếm index đúng các route động.

---

## 1. Trọng tâm trả lời phỏng vấn

1. **Chiến lược data fetching**: dùng `useFetch`/`useAsyncData` để preload trên server, đảm bảo HTML đầy đủ cho SEO.
2. **Meta tags động**: dùng `useHead` hoặc `useSeoMeta` để tạo metadata theo từng resource.
3. **Hiệu năng**: áp dụng request deduplication, cache phía server, và tách rõ trang SSR/CSR.

---

## 2. Cách dùng đúng useFetch / useAsyncData

### 2.1 Tại sao data fetching trong SSR quan trọng

**Tình huống phổ biến:**

- Route động (ví dụ `/products/[id]`) cần dữ liệu từ API.
- Nếu chỉ load ở client, crawler có thể thấy nội dung không đầy đủ.
- Mục tiêu: trả về HTML đã render đầy đủ dữ liệu từ server.

**Giải pháp:** dùng `useFetch` hoặc `useAsyncData` trong Nuxt 3.

### 2.2 Ví dụ cơ bản với useFetch

**File:** `pages/products/[id].vue`

```typescript
// cách dùng cơ bản
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**Các option quan trọng:**

| Option      | Mục đích                                      | Default  |
| ----------- | --------------------------------------------- | -------- |
| `key`       | Khóa duy nhất để deduplicate request          | auto     |
| `lazy`      | Tải trễ (không block SSR)                     | `false`  |
| `server`    | Chạy trên server                              | `true`   |
| `default`   | Giá trị fallback                              | `null`   |
| `transform` | Biến đổi response trước khi sử dụng           | -        |

### 2.3 Ví dụ đầy đủ

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // tránh request trùng lặp
  lazy: false, // SSR đợi dữ liệu
  server: true, // đảm bảo chạy ở server
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // chuẩn hóa dữ liệu
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**Vì sao các option này quan trọng:**

1. **`key`**
   - Cho phép request deduplication.
   - Cùng key -> một request hiệu lực.
2. **`lazy: false`**
   - Server chỉ render sau khi có dữ liệu.
   - Crawler nhận được nội dung cuối.
3. **`server: true`**
   - Fetch chạy trên đường SSR.
   - Không phụ thuộc chỉ vào client.

### 2.4 useAsyncData vs useFetch

| Tiêu chí        | useFetch                    | useAsyncData                        |
| --------------- | --------------------------- | ----------------------------------- |
| Mục đích chính  | Gọi API                     | Mọi tác vụ bất đồng bộ              |
| Mức độ tiện lợi | URL/header tích hợp         | Tự viết logic                       |
| Tình huống dùng | HTTP data fetching          | DB query, tổng hợp, đọc file        |

```typescript
// useFetch: tập trung vào API
const { data } = await useFetch('/api/products/123');

// useAsyncData: logic async tùy biến
const { data } = await useAsyncData('products', async () => {
  const result = await someAsyncOperation();
  return result;
});
```

### 2.5 $fetch vs useFetch

**Quy tắc ngắn cho phỏng vấn:**

- **`$fetch`** cho hành động người dùng (click, submit, refresh).
- **`useFetch`** cho tải lần đầu, đồng bộ với SSR/Hydration.

**`$fetch` đặc điểm:**

- HTTP client thuần (`ofetch`)
- Không chuyển state SSR
- Dùng trực tiếp trong `setup()` dễ gây double fetch

**`useFetch` đặc điểm:**

- Kết hợp `useAsyncData` + `$fetch`
- Thân thiện với hydration
- Trả về `data`, `pending`, `error`, `refresh`

**So sánh:**

| Mục               | useFetch                        | $fetch                         |
| ----------------- | ------------------------------- | ------------------------------ |
| Chuyển state SSR  | Có                              | Không                          |
| Giá trị trả về    | Ref reactive                    | Promise dữ liệu raw            |
| Mục đích chính    | Tải dữ liệu ban đầu của trang   | Tác vụ theo sự kiện            |

```typescript
// đúng: tải ban đầu
const { data } = await useFetch('/api/user');

// đúng: hành động người dùng
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// tránh: setup + $fetch trực tiếp
const data = await $fetch('/api/user');
```

---

## 3. Quản lý SEO Meta với useHead

### 3.1 Tại sao cần meta tags động

**Tình huống phổ biến:**

- Trang sản phẩm và bài viết là động.
- Mỗi URL cần `title`, `description`, `og:image`, canonical riêng.
- Chia sẻ social (Open Graph/Twitter) cần động nhất.

**Giải pháp:** `useHead` hoặc `useSeoMeta`.

### 3.2 Ví dụ useHead

```typescript
useHead({
  title: () => product.value?.name,
  meta: [
    { name: 'description', content: () => product.value?.description },
    { property: 'og:title', content: () => product.value?.name },
    { property: 'og:image', content: () => product.value?.image },
  ],
  link: [
    {
      rel: 'canonical',
      href: () => `https://example.com/products/${product.value?.id}`,
    },
  ],
});
```

**Best practices:**

1. Truyền giá trị dạng hàm (`() => ...`) để metadata cập nhật theo dữ liệu.
2. Đặt đầy đủ cấu trúc SEO: title, description, OG, canonical.
3. Với 404, đặt `noindex, nofollow`.

### 3.3 Bản gọn với useSeoMeta

```typescript
useSeoMeta({
  title: () => product.value?.name,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
});
```

---

## 4. Tình huống thực tế 1: SEO cho route động

### 4.1 Bối cảnh

Kịch bản e-commerce có nhiều trang SKU (`/products/[id]`).

**Thách thức:**

- Nhiều URL động
- SEO riêng cho từng URL
- Xử lý 404 đúng
- Tránh duplicate content

### 4.2 Chiến lược

1. Preload trên server (`lazy: false`, `server: true`)
2. Ném lỗi 404 với `createError`
3. Tạo meta và canonical động

```typescript
const { data: product, error } = await useFetch(`/api/products/${id}`, {
  key: `product-${id}`,
  lazy: false,
  server: true,
});

if (error.value || !product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}

useSeoMeta({
  title: () => `${product.value?.name} - Product`,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
});
```

### 4.3 Kết quả

**Trước đó:**
- Crawler thấy nội dung thiếu
- Nhiều trang trùng metadata
- 404 không nhất quán

**Sau khi làm:**
- HTML SSR đầy đủ cho crawler
- Metadata riêng theo route
- Xử lý lỗi nhất quán và an toàn cho SEO

---

## 5. Tình huống thực tế 2: Tối ưu hiệu năng

### 5.1 Vấn đề

SSR tăng tải cho server. Không tối ưu sẽ tăng độ trễ và chi phí.

### 5.2 Chiến lược

1. **Request deduplication**

```typescript
const { data } = await useFetch('/api/product/123', {
  key: 'product-123',
});
```

2. **Cache server (Nitro)**

```typescript
export default defineCachedEventHandler(
  async (event) => {
    return await getProductsFromDB();
  },
  {
    maxAge: 60 * 60,
    swr: true,
  },
);
```

3. **Tách SSR/CSR**
- Trang quan trọng cho SEO: SSR
- Trang nội bộ không cần index: CSR

4. **Critical CSS và chiến lược assets**
- Ưu tiên CSS above-the-fold
- Tải tài nguyên không quan trọng sau

### 5.3 Tác động

**Trước đó:**
- Tải server cao
- Request lặp lại
- Không có chiến lược cache

**Sau khi làm:**
- Thời gian phản hồi tốt hơn
- Giảm áp lực backend/DB
- Ổn định hơn khi có tải cao

---

## 6. Câu trả lời phỏng vấn ngắn gọn

### 6.1 useFetch / useAsyncData

> Tôi dùng `useFetch` cho tải ban đầu với `key`, `lazy: false`, `server: true` để đảm bảo SSR đầy đủ và HTML có ích cho index.

### 6.2 Meta tags động

> Tôi dùng `useHead`/`useSeoMeta` với giá trị dạng hàm để metadata cập nhật theo dữ liệu, bao gồm OG và canonical.

### 6.3 Hiệu năng

> Tôi kết hợp deduplication, cache server, và tách SSR/CSR để giảm TTFB mà vẫn giữ chất lượng SEO.

---

## 7. Best practices

### 7.1 Data fetching

1. Luôn đặt `key`.
2. Chọn `lazy` theo nhu cầu SEO.
3. Xử lý lỗi (404/5xx) rõ ràng.

### 7.2 SEO Meta

1. Giá trị dạng hàm cho cập nhật reactive.
2. Cấu trúc đầy đủ (title/description/OG/canonical).
3. Bảo vệ trang lỗi với `noindex, nofollow`.

### 7.3 Hiệu năng

1. Dùng cache trên server.
2. Chỉ dùng SSR ở nơi SEO cần.
3. Giảm chi phí render bằng chiến lược CSS/assets.

---

## 8. Tổng kết phỏng vấn

> Trong Nuxt 3, tôi đã triển khai SSR data fetching và SEO Meta động để đạt hai mục tiêu: index đúng và trải nghiệm nhanh. Cách làm gồm preload trên server, metadata theo route, và tối ưu bằng deduplication, cache, và tách SSR/CSR.

**Điểm chính:**
- ✅ Dùng `useFetch`/`useAsyncData` đúng cách
- ✅ Quản lý metadata động bằng `useHead`/`useSeoMeta`
- ✅ SEO cho route động
- ✅ Tối ưu hiệu năng cho dự án thực tế
