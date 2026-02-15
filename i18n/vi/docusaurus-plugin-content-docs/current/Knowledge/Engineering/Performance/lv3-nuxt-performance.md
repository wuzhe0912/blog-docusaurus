---
title: '[Lv3] Toi uu hieu nang Nuxt 3: Bundle Size, toc do SSR va toi uu hinh anh'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Huong dan toi uu hieu nang Nuxt 3 toan dien: tu giam Bundle Size, toi uu toc do SSR den chien luoc tai hinh anh, tao trai nghiem hieu nang toi uu.

---

## 1. Cac truc chinh tra loi phong van

1. **Toi uu Bundle Size**: phan tich (`nuxi analyze`), tach (`SplitChunks`), Tree Shaking, tai tri hoan (Lazy Loading).
2. **Toi uu toc do SSR (TTFB)**: cache Redis, Nitro Cache, giam cac cuoc goi API chan, Streaming SSR.
3. **Toi uu hinh anh**: `@nuxt/image`, dinh dang WebP, CDN, Lazy Loading.
4. **Toi uu du lieu lon**: Virtual Scrolling, cuon vo han (Infinite Scroll), phan trang (Pagination).

---

## 2. Lam sao giam Bundle Size cua Nuxt 3?

### 2.1 Cong cu chan doan

Truoc tien, phai biet bottleneck o dau. Dung `nuxi analyze` de truc quan hoa cau truc Bundle.

```bash
npx nuxi analyze
```

Lenh nay se tao bao cao hien thi package nao chiem nhieu khong gian nhat.

### 2.2 Chien luoc toi uu

#### 1. Code Splitting (tach code)
Nuxt 3 mac dinh da thuc hien Code Splitting dua tren route. Nhung voi cac package lon (nhu ECharts, Lodash), can toi uu thu cong.

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

#### 2. Tree Shaking va import theo yeu cau

```typescript
// ❌ Sai: import toan bo lodash
import _ from 'lodash';
_.debounce(() => {}, 100);

// ✅ Dung: chi import debounce
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// ✅ Khuyen nghi: dung vueuse (chuyen cho Vue va Tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. Lazy Loading component

```vue
<template>
  <div>
    <!-- Code component chi duoc tai khi show la true -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. Loai bo package Server-side khong can thiet
Dam bao cac package chi dung o Server (database driver, thao tac fs) khong bi dong goi vao Client. Nuxt 3 tu dong xu ly cac file ket thuc bang `.server.ts`, hoac dung thu muc `server/`.

---

## 3. Lam sao toi uu toc do SSR (TTFB)?

### 3.1 Tai sao TTFB qua lau?
TTFB (Time To First Byte) la chi so then chot cua hieu nang SSR. Nguyen nhan thuong gap:
1. **API tra loi cham**: Server phai doi back-end tra du lieu moi render HTML.
2. **Request noi tiep**: nhieu API request chay lien tiep thay vi song song.
3. **Tinh toan nang**: Server thuc thi qua nhieu tac vu CPU-intensive.

### 3.2 Giai phap toi uu

#### 1. Cache phia Server (Nitro Cache)

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
// ❌ Cham: chay noi tiep (tong thoi gian = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// ✅ Nhanh: chay song song (tong thoi gian = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. Tri hoan du lieu khong quan trong (Lazy Fetching)

```typescript
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false,
});
```

#### 4. Streaming SSR (thu nghiem)
Nuxt 3 ho tro HTML Streaming, cho phep gui noi dung trong khi render, giup nguoi dung thay noi dung nhanh hon.

---

## 4. Toi uu hinh anh Nuxt 3

### 4.1 Su dung @nuxt/image
Module chinh thuc `@nuxt/image` la giai phap tot nhat:
- **Tu dong chuyen doi dinh dang**: tu dong chuyen sang WebP/AVIF.
- **Tu dong thay doi kich thuoc**: tao hinh anh theo kich thuoc man hinh.
- **Lazy Loading**: tich hop san.
- **Tich hop CDN**: ho tro Cloudinary, Imgix va nhieu provider khac.

### 4.2 Vi du trien khai

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

## 5. Phan trang va cuon cho du lieu lon

### 5.1 Chon giai phap
Voi du lieu lon (vd. 10,000 san pham), ba chien luoc chinh, can xem xet **SEO**:

| Chien luoc | Truong hop ap dung | Tuong thich SEO |
| :--- | :--- | :--- |
| **Phan trang truyen thong** | Danh sach e-commerce, bai viet | Xuat sac (tot nhat) |
| **Cuon vo han** | Feed xa hoi, tuong anh | Thap (can xu ly dac biet) |
| **Virtual Scrolling** | Bao cao phuc tap, danh sach rat dai | Rat thap (noi dung khong co trong DOM) |

### 5.2 Lam sao duy tri SEO voi cuon vo han?
Voi cuon vo han, cong cu tim kiem thuong chi crawl duoc trang dau. Giai phap:
1. **Ket hop che do phan trang**: cung cap the `<link rel="next" href="...">` de crawler biet trang tiep theo.
2. **Noscript Fallback**: cung cap phien ban phan trang truyen thong trong `<noscript>` cho crawler.
3. **Nut "Tai them"**: SSR render 20 dong dau, phan con lai tai qua click "Tai them" hoac cuon.

### 5.3 Vi du trien khai (Load More + SEO)

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
    <button @click="loadMore">Tai them</button>

    <Head>
      <Link rel="next" :href="`/posts?page=${page + 1}`" />
    </Head>
  </div>
</template>
```

---

## 6. Lazy Loading trong moi truong SSR

### 6.1 Mo ta van de
Trong moi truong SSR, su dung `IntersectionObserver` se gay loi hoac Hydration Mismatch vi Server khong co `window` hay `document`.

### 6.2 Giai phap

#### 1. Dung component tich hop cua Nuxt
- `<LazyComponent>`
- `<NuxtImg loading="lazy">`

#### 2. Directive tuy chinh (xu ly SSR)

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

## 7. Giam sat va theo doi hieu nang SSR

### 7.1 Tai sao can giam sat?
Bottleneck cua ung dung SSR thuong o phia Server, DevTools trinh duyet khong thay duoc. Neu khong giam sat, kho phat hien API tra loi cham, Memory Leak hay CPU cao la nguyen nhan TTFB tang.

### 7.2 Cong cu thuong dung

1. **Nuxt DevTools (giai doan phat trien)**:
    - Tich hop san trong Nuxt 3.
    - Xem thoi gian phan hoi cua Server Routes.

2. **Lighthouse / PageSpeed Insights (sau trien khai)**:
    - Giam sat Core Web Vitals (LCP, CLS, FID/INP).

3. **Giam sat phia Server (APM)**:
    - **Sentry / Datadog**: theo doi loi va hieu nang phia Server.
    - **OpenTelemetry**: theo doi toan bo Request Trace.

### 7.3 Trien khai theo doi thoi gian don gian

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

## 8. Tong ket phong van

**Q: Lam sao theo doi va giam sat van de hieu nang SSR?**
> Trong giai doan phat trien, toi chu yeu dung **Nuxt DevTools** de xem thoi gian phan hoi Server Routes va kich thuoc Payload. Trong Production, toi theo doi **Core Web Vitals** (dac biet LCP) va **TTFB**. Neu can phan tich sau, toi dung Server Middleware tuy chinh ghi thoi gian request, hoac tich hop **Sentry** / **OpenTelemetry**.

**Q: Lam sao giam Bundle Size cua Nuxt 3?**
> Toi bat dau phan tich bang `nuxi analyze`. Voi cac package lon (nhu lodash) thi Tree Shaking hoac tach thu cong (`manualChunks`). Component khong can cho man hinh dau thi dung `<LazyComponent>`.

**Q: Lam sao toi uu toc do SSR?**
> Trong tam la giam TTFB. Toi dung `routeRules` cua Nitro de cau hinh cache phia Server (SWR). Request API chay song song bang `Promise.all`. Du lieu khong quan trong dat `lazy: true` de tai phia Client.

**Q: Toi uu hinh anh nhu the nao?**
> Toi dung module `@nuxt/image`, tu dong chuyen WebP, tu dong thay doi kich thuoc va ho tro Lazy Loading, giam dang ke luong truyen tai.

**Q: Cuon vo han lam sao dam bao SEO?**
> Cuon vo han khong tot cho SEO. Voi trang noi dung, toi uu tien phan trang truyen thong. Neu bat buoc dung cuon vo han, toi render trang dau bang SSR va dung Meta Tags (`rel="next"`) de bao crawler cau truc phan trang.
