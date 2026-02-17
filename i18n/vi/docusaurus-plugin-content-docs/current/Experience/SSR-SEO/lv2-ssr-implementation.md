---
title: '[Lv2] Trien khai SSR: Data Fetching va quan ly SEO Meta'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Trong du an Nuxt 3: trien khai tai du lieu bang SSR va quan ly SEO Meta dong de cong cu tim kiem index dung cac route dong.

---

## 1. Trong tam tra loi phong van

1. **Chien luoc data fetching**: dung `useFetch`/`useAsyncData` de preload tren server, dam bao HTML day du cho SEO.
2. **Meta tags dong**: dung `useHead` hoac `useSeoMeta` de tao metadata theo tung resource.
3. **Hieu nang**: ap dung request deduplication, cache phia server, va tach ro trang SSR/CSR.

---

## 2. Cach dung dung useFetch / useAsyncData

### 2.1 Tai sao data fetching trong SSR quan trong

**Tinh huong pho bien:**

- Route dong (vi du `/products/[id]`) can du lieu tu API.
- Neu chi load o client, crawler co the thay noi dung khong day du.
- Muc tieu: tra ve HTML da render day du du lieu tu server.

**Giai phap:** dung `useFetch` hoac `useAsyncData` trong Nuxt 3.

### 2.2 Vi du co ban voi useFetch

**File:** `pages/products/[id].vue`

```typescript
// cach dung co ban
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**Cac option quan trong:**

| Option      | Muc dich                                      | Default  |
| ----------- | --------------------------------------------- | -------- |
| `key`       | Khoa duy nhat de deduplicate request          | auto     |
| `lazy`      | Tai tre (khong block SSR)                     | `false`  |
| `server`    | Chay tren server                              | `true`   |
| `default`   | Gia tri fallback                              | `null`   |
| `transform` | Bien doi response truoc khi su dung           | -        |

### 2.3 Vi du day du

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // tranh request trung lap
  lazy: false, // SSR doi du lieu
  server: true, // dam bao chay o server
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // chuan hoa du lieu
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**Vi sao cac option nay quan trong:**

1. **`key`**
   - Cho phep request deduplication.
   - Cung key -> mot request hieu luc.
2. **`lazy: false`**
   - Server chi render sau khi co du lieu.
   - Crawler nhan duoc noi dung cuoi.
3. **`server: true`**
   - Fetch chay tren duong SSR.
   - Khong phu thuoc chi vao client.

### 2.4 useAsyncData vs useFetch

| Tieu chi        | useFetch                    | useAsyncData                        |
| --------------- | --------------------------- | ----------------------------------- |
| Muc dich chinh  | Goi API                     | Moi tac vu bat dong bo              |
| Muc do tien loi | URL/header tich hop         | Tu viet logic                       |
| Tinh huong dung | HTTP data fetching          | DB query, tong hop, doc file        |

```typescript
// useFetch: tap trung vao API
const { data } = await useFetch('/api/products/123');

// useAsyncData: logic async tuy bien
const { data } = await useAsyncData('products', async () => {
  const result = await someAsyncOperation();
  return result;
});
```

### 2.5 $fetch vs useFetch

**Quy tac ngan cho phong van:**

- **`$fetch`** cho hanh dong nguoi dung (click, submit, refresh).
- **`useFetch`** cho tai lan dau, dong bo voi SSR/Hydration.

**`$fetch` dac diem:**

- HTTP client thuan (`ofetch`)
- Khong chuyen state SSR
- Dung truc tiep trong `setup()` de gay double fetch

**`useFetch` dac diem:**

- Ket hop `useAsyncData` + `$fetch`
- Than thien voi hydration
- Tra ve `data`, `pending`, `error`, `refresh`

**So sanh:**

| Muc               | useFetch                        | $fetch                         |
| ----------------- | ------------------------------- | ------------------------------ |
| Chuyen state SSR  | Co                              | Khong                          |
| Gia tri tra ve    | Ref reactive                    | Promise du lieu raw            |
| Muc dich chinh    | Tai du lieu ban dau cua trang   | Tac vu theo su kien            |

```typescript
// dung: tai ban dau
const { data } = await useFetch('/api/user');

// dung: hanh dong nguoi dung
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// tranh: setup + $fetch truc tiep
const data = await $fetch('/api/user');
```

---

## 3. Quan ly SEO Meta voi useHead

### 3.1 Tai sao can meta tags dong

**Tinh huong pho bien:**

- Trang san pham va bai viet la dong.
- Moi URL can `title`, `description`, `og:image`, canonical rieng.
- Chia se social (Open Graph/Twitter) can dong nhat.

**Giai phap:** `useHead` hoac `useSeoMeta`.

### 3.2 Vi du useHead

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

1. Truyen gia tri dang ham (`() => ...`) de metadata cap nhat theo du lieu.
2. Dat day du cau truc SEO: title, description, OG, canonical.
3. Voi 404, dat `noindex, nofollow`.

### 3.3 Ban gon voi useSeoMeta

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

## 4. Tinh huong thuc te 1: SEO cho route dong

### 4.1 Boi canh

Kich ban e-commerce co nhieu trang SKU (`/products/[id]`).

**Thach thuc:**

- Nhieu URL dong
- SEO rieng cho tung URL
- Xu ly 404 dung
- Tranh duplicate content

### 4.2 Chien luoc

1. Preload tren server (`lazy: false`, `server: true`)
2. Nem loi 404 voi `createError`
3. Tao meta va canonical dong

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

### 4.3 Ket qua

**Truoc do:**
- Crawler thay noi dung thieu
- Nhieu trang trung metadata
- 404 khong nhat quan

**Sau khi lam:**
- HTML SSR day du cho crawler
- Metadata rieng theo route
- Xu ly loi nhat quan va an toan cho SEO

---

## 5. Tinh huong thuc te 2: Toi uu hieu nang

### 5.1 Van de

SSR tang tai cho server. Khong toi uu se tang do tre va chi phi.

### 5.2 Chien luoc

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

3. **Tach SSR/CSR**
- Trang quan trong cho SEO: SSR
- Trang noi bo khong can index: CSR

4. **Critical CSS va chien luoc assets**
- Uu tien CSS above-the-fold
- Tai tai nguyen khong quan trong sau

### 5.3 Tac dong

**Truoc do:**
- Tai server cao
- Request lap lai
- Khong co chien luoc cache

**Sau khi lam:**
- Thoi gian phan hoi tot hon
- Giam ap luc backend/DB
- On dinh hon khi co tai cao

---

## 6. Cau tra loi phong van ngan gon

### 6.1 useFetch / useAsyncData

> Toi dung `useFetch` cho tai ban dau voi `key`, `lazy: false`, `server: true` de dam bao SSR day du va HTML co ich cho index.

### 6.2 Meta tags dong

> Toi dung `useHead`/`useSeoMeta` voi gia tri dang ham de metadata cap nhat theo du lieu, bao gom OG va canonical.

### 6.3 Hieu nang

> Toi ket hop deduplication, cache server, va tach SSR/CSR de giam TTFB ma van giu chat luong SEO.

---

## 7. Best practices

### 7.1 Data fetching

1. Luon dat `key`.
2. Chon `lazy` theo nhu cau SEO.
3. Xu ly loi (404/5xx) ro rang.

### 7.2 SEO Meta

1. Gia tri dang ham cho cap nhat reactive.
2. Cau truc day du (title/description/OG/canonical).
3. Bao ve trang loi voi `noindex, nofollow`.

### 7.3 Hieu nang

1. Dung cache tren server.
2. Chi dung SSR o noi SEO can.
3. Giam chi phi render bang chien luoc CSS/assets.

---

## 8. Tong ket phong van

> Trong Nuxt 3, toi da trien khai SSR data fetching va SEO Meta dong de dat hai muc tieu: index dung va trai nghiem nhanh. Cach lam gom preload tren server, metadata theo route, va toi uu bang deduplication, cache, va tach SSR/CSR.

**Diem chinh:**
- ✅ Dung `useFetch`/`useAsyncData` dung cach
- ✅ Quan ly metadata dong bang `useHead`/`useSeoMeta`
- ✅ SEO cho route dong
- ✅ Toi uu hieu nang cho du an thuc te
