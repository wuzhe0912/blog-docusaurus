---
title: '[Lv3] Nuxt 3 Đa ngôn ngữ (i18n) và Thực hành tốt nhất về SEO'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> Triển khai đa ngôn ngữ (Internationalization) trong kiến trúc SSR, không chỉ là dịch văn bản mà còn liên quan đến chiến lược route, SEO tags (hreflang), quản lý trạng thái và tính nhất quán của Hydration.

---

## 1. Trọng tâm trả lời phỏng vấn

1.  **Chiến lược route**: Sử dụng chiến lược tiền tố URL của `@nuxtjs/i18n` (như `/en/about`, `/jp/about`) để phân biệt ngôn ngữ, thân thiện nhất với SEO.
2.  **SEO tags**: Đảm bảo tự động tạo đúng `<link rel="alternate" hreflang="..." />` và Canonical URL, tránh bị phạt do nội dung trùng lặp.
3.  **Quản lý trạng thái**: Phát hiện đúng ngôn ngữ của người dùng (Cookie/Header) trong giai đoạn SSR, và đảm bảo ngôn ngữ nhất quán khi Client Hydration.

---

## 2. Chiến lược triển khai i18n trong Nuxt 3

### 2.1 Tại sao chọn `@nuxtjs/i18n`?

Module chính thức `@nuxtjs/i18n` được xây dựng trên `vue-i18n`, được tối ưu hóa đặc biệt cho Nuxt. Nó giải quyết các điểm khó thường gặp khi triển khai i18n thủ công:

- Tự động tạo route có tiền tố ngôn ngữ (Auto-generated routes).
- Tự động xử lý SEO Meta Tags (hreflang, og:locale).
- Hỗ trợ Lazy Loading gói ngôn ngữ (tối ưu Bundle Size).

### 2.2 Cài đặt và cấu hình

```bash
npm install @nuxtjs/i18n
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'tw', iso: 'zh-TW', file: 'tw.json', name: '繁體中文' },
    ],
    defaultLocale: 'tw',
    lazy: true, // Bật Lazy Loading
    langDir: 'locales', // Thư mục file ngôn ngữ
    strategy: 'prefix_and_default', // Chiến lược route quan trọng
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // Chỉ phát hiện và chuyển hướng ở đường dẫn gốc
    },
  },
});
```

### 2.3 Chiến lược Route (Routing Strategy)

Đây là yếu tố then chốt của SEO. `@nuxtjs/i18n` cung cấp một số chiến lược:

1.  **prefix_except_default** (Khuyến nghị):

    - Ngôn ngữ mặc định (tw) không thêm tiền tố: `example.com/about`
    - Ngôn ngữ khác (en) thêm tiền tố: `example.com/en/about`
    - Ưu điểm: URL gọn gàng, trọng số tập trung.

2.  **prefix_and_default**:

    - Tất cả ngôn ngữ đều thêm tiền tố: `example.com/tw/about`, `example.com/en/about`
    - Ưu điểm: Cấu trúc thống nhất, dễ xử lý redirect.

3.  **no_prefix** (Không khuyến nghị cho SEO):
    - Tất cả ngôn ngữ có URL giống nhau, chuyển đổi bằng Cookie.
    - Nhược điểm: Công cụ tìm kiếm không thể index các phiên bản ngôn ngữ khác nhau.

---

## 3. Triển khai SEO quan trọng

### 3.1 Thẻ hreflang

Công cụ tìm kiếm cần biết "trang này có những phiên bản ngôn ngữ nào". `@nuxtjs/i18n` sẽ tự động tạo trong `<head>`:

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**Lưu ý:** Phải thiết lập `baseUrl` trong `nuxt.config.ts`, nếu không hreflang sẽ tạo ra đường dẫn tương đối (không hợp lệ).

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // Bắt buộc phải thiết lập!
  },
});
```

### 3.2 Canonical URL

Đảm bảo mỗi trang phiên bản ngôn ngữ đều có Canonical URL trỏ đến chính nó, tránh bị coi là nội dung trùng lặp.

### 3.3 Dịch nội dung động (API)

API backend cũng cần hỗ trợ đa ngôn ngữ. Thông thường sẽ gửi kèm header `Accept-Language` trong request.

```typescript
// composables/useApi.ts
export const useApi = (url: string) => {
  const { locale } = useI18n();
  return useFetch(url, {
    headers: {
      'Accept-Language': locale.value, // Gửi ngôn ngữ hiện tại cho backend
    },
  });
};
```

---

## 4. Các thách thức phổ biến và giải pháp

### 4.1 Hydration Mismatch

**Vấn đề:** Server phát hiện tiếng Anh, render HTML tiếng Anh; trình duyệt phía Client mặc định là tiếng Trung, Vue i18n khởi tạo bằng tiếng Trung, dẫn đến màn hình nhấp nháy hoặc Hydration Error.

**Giải pháp:**

- Sử dụng cấu hình `detectBrowserLanguage`, để khi Client khởi tạo tôn trọng thiết lập URL hoặc Cookie, thay vì thiết lập của trình duyệt.
- Đảm bảo cấu hình `defaultLocale` của Server và Client nhất quán.

### 4.2 Chuyển đổi ngôn ngữ

Dùng `switchLocalePath` để tạo liên kết, thay vì ghép chuỗi thủ công.

```vue
<script setup>
const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <nav>
    <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
    <NuxtLink :to="switchLocalePath('tw')">繁體中文</NuxtLink>
  </nav>
</template>
```

---

## 5. Tổng hợp điểm mấu chốt phỏng vấn

### 5.1 i18n và SEO

**Q: Cần lưu ý gì khi làm đa ngôn ngữ (i18n) trong môi trường SSR? Làm thế nào để xử lý SEO?**

> **Ví dụ trả lời:**
> Khi làm i18n trong môi trường SSR, điều quan trọng nhất là **SEO** và **tính nhất quán của Hydration**.
>
> Về **SEO**:
>
> 1.  **Cấu trúc URL**: Tôi sẽ dùng chiến lược "sub-path" (như `/en/`, `/tw/`), để các ngôn ngữ khác nhau có URL độc lập, công cụ tìm kiếm mới có thể index được.
> 2.  **hreflang**: Phải thiết lập đúng `<link rel="alternate" hreflang="..." />`, báo cho Google biết các trang này là các phiên bản ngôn ngữ khác nhau của cùng một nội dung, tránh bị phạt do nội dung trùng lặp. Tôi thường dùng module `@nuxtjs/i18n` để tự động tạo các thẻ này.
>
> Về **Hydration**:
> Đảm bảo ngôn ngữ render ở phía Server và ngôn ngữ khởi tạo ở phía Client nhất quán. Tôi sẽ thiết lập ngôn ngữ được quyết định từ tiền tố URL hoặc Cookie, và gửi kèm locale tương ứng trong header của API request.

### 5.2 Route và trạng thái

**Q: Làm thế nào để triển khai tính năng chuyển đổi ngôn ngữ?**

> **Ví dụ trả lời:**
> Tôi sẽ dùng composable `useSwitchLocalePath` do `@nuxtjs/i18n` cung cấp.
> Nó sẽ tự động tạo URL ngôn ngữ tương ứng dựa trên route hiện tại (giữ lại query parameters), và xử lý việc chuyển đổi tiền tố route. Cách này tránh được lỗi khi xử lý ghép chuỗi thủ công, đồng thời đảm bảo người dùng vẫn ở lại nội dung trang hiện tại khi chuyển ngôn ngữ.

---

## 6. Reference

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
