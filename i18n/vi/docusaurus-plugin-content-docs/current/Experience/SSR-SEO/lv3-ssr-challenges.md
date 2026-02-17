---
title: '[Lv3] Thach thuc trien khai SSR va giai phap'
slug: /experience/ssr-seo/lv3-ssr-challenges
tags: [Experience, Interview, SSR-SEO, Lv3]
---

> Cac van de pho bien khi lam SSR va cach giai quyet: Hydration Mismatch, bien moi truong, tuong thich thu vien ben thu ba, hieu nang va kien truc deploy.

---

## Tinh huong phong van

**Cau hoi: Khi trien khai SSR, ban gap kho khan gi va giai quyet nhu the nao?**

Nha tuyen dung thuong danh gia:

1. **Kinh nghiem thuc te**: da tung lam SSR trong du an that hay chua.
2. **Tu duy giai quyet van de**: tim nguyen nhan goc va uu tien xu ly.
3. **Do sau ky thuat**: rendering, hydration, cache, deploy.
4. **Best practices**: giai phap ben vung, de bao tri, do luong duoc.

---

## Thach thuc 1: Hydration Mismatch

### Mo ta van de

Canh bao pho bien:

```text
[Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
```

Nguyen nhan thuong gap:

- Output khac nhau giua server render va client render
- Dung API chi co tren browser trong duong SSR (`window`, `document`, `localStorage`)
- Gia tri khong xac dinh (`Date.now()`, `Math.random()`)

### Giai phap

#### Cach A: dung `ClientOnly`

```vue
<template>
  <div>
    <h1>Noi dung SSR</h1>
    <ClientOnly>
      <BrowserOnlyComponent />
      <template #fallback>
        <div>Dang tai...</div>
      </template>
    </ClientOnly>
  </div>
</template>
```

#### Cach B: dat guard phia client

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

**Thong diep chinh:** output SSR phai deterministc; logic chi-tren-browser phai tach ro sang client.

---

## Thach thuc 2: Bien moi truong

### Mo ta van de

- Secret phia server co the bi lo ra client.
- Dung `process.env` lung tung lam cau hinh kho theo doi.

### Giai phap

Tach bang runtime config:

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
// su dung
const config = useRuntimeConfig();
const apiBase = config.public.apiBase; // client + server
const secret = config.apiSecret; // chi server
```

**Thong diep chinh:** secret chi de o server; config public dat ro trong block `public`.

---

## Thach thuc 3: Thu vien ben thu ba khong ho tro SSR

### Mo ta van de

- Mot so package cham vao DOM trong qua trinh SSR.
- Hau qua: loi build/runtime hoac hydration mismatch.

### Giai phap

1. Chi load thu vien o client (plugin `.client.ts`)
2. Import dong trong context client
3. Can nhac thu vien thay the co SSR support

```ts
let chartLib: any;
if (process.client) {
  chartLib = await import('chart.js/auto');
}
```

**Thong diep chinh:** co lap nguyen nhan truoc, sau do moi chon client-isolation hay doi thu vien.

---

## Thach thuc 4: Xu ly cookie va header

### Mo ta van de

- Auth trong SSR can doc cookie o server.
- Header can dong nhat giua client, SSR, va API.

### Giai phap

```ts
const token = useCookie('access_token');

const { data } = await useFetch('/api/me', {
  headers: process.server
    ? useRequestHeaders(['cookie'])
    : undefined,
  credentials: 'include',
});
```

**Thong diep chinh:** request SSR khong duoc mat auth context.

---

## Thach thuc 5: Timing khi tai bat dong bo

### Mo ta van de

- Nhieu component cung tai mot du lieu.
- Request trung lap va loading state khong nhat quan.

### Giai phap

- Dung key thong nhat cho deduplication
- Dung shared composable de trung tam hoa truy cap data
- Tach ro initial load va user action

```ts
const { data, refresh } = await useFetch('/api/products', {
  key: 'products-list',
  lazy: false,
  server: true,
});
```

**Thong diep chinh:** trung tam hoa data flow, khong fetch lap lai o tung component.

---

## Thach thuc 6: Hieu nang va tai server

### Mo ta van de

- SSR tang CPU va I/O.
- Khi tai cao, TTFB tang.

### Giai phap

1. Cache voi Nitro
2. Toi uu query DB
3. Tach SSR/CSR theo muc tieu SEO
4. Dat CDN dung cach

```ts
export default defineCachedEventHandler(
  async () => await getProductsFromDB(),
  { maxAge: 60 * 10, swr: true },
);
```

**Thong diep chinh:** performance la bai toan kien truc, khong chi la frontend detail.

---

## Thach thuc 7: Xu ly loi va 404

### Mo ta van de

- ID dong co the khong hop le.
- Neu 404 sematic sai, SEO co the index trang loi.

### Giai phap

```ts
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}
```

Bo sung:

- `error.vue` de hien thi loi ro rang
- Trang loi dat `noindex, nofollow`

**Thong diep chinh:** HTTP status, UX va SEO phai nhat quan.

---

## Thach thuc 8: Browser-only APIs

### Mo ta van de

- SSR context khong co `window`/`document`.
- Truy cap truc tiep se gay runtime error.

### Giai phap

```ts
const width = ref<number | null>(null);

onMounted(() => {
  width.value = window.innerWidth;
});
```

Hoac guard:

```ts
if (process.client) {
  localStorage.setItem('theme', 'dark');
}
```

**Thong diep chinh:** API cua browser chi dung trong pha client da duoc bao bo.

---

## Thach thuc 9: Memory leak tren server

### Mo ta van de

- Node process chay lau bi tang memory lien tuc.
- Thuong do global mutable state, timer/listener khong cleanup.

### Giai phap

1. Khong giu state theo request trong bien global
2. Cleanup listener/interval day du
3. Theo doi bang heap snapshot va `process.memoryUsage()`

```ts
setInterval(() => {
  const mem = process.memoryUsage();
  console.log('rss', mem.rss);
}, 60_000);
```

**Thong diep chinh:** leak trong SSR la rui ro van hanh va ca bao mat.

---

## Thach thuc 10: Script quang cao va tracking

### Mo ta van de

- Script ben thu ba co the block main thread hoac pha hydration.
- CLS/FID/INP xau di.

### Giai phap

- Load script bat dong bo va tiem can cuoi trang
- Dat san khung cho ad de tranh layout shift
- UI quan trong khong phu thuoc tracking

```ts
useHead({
  script: [
    { src: 'https://example.com/tracker.js', async: true, tagPosition: 'bodyClose' },
  ],
});
```

**Thong diep chinh:** monetization khong duoc danh doi rendering stability.

---

## Thach thuc 11: Kien truc deploy (SSR vs SPA)

### Mo ta van de

- SPA deploy static, don gian.
- SSR can compute layer, observability, va quan ly process.

### So sanh

| Khia canh      | SPA (Static)         | SSR (Node/Edge)                  |
| -------------- | -------------------- | -------------------------------- |
| Ha tang        | Storage + CDN        | Compute + CDN                    |
| Van hanh       | Rat don gian         | Do phuc tap trung binh           |
| Chi phi        | Thap                 | Cao hon do chi phi compute       |
| Giam sat       | It                   | Logs, metrics, memory, cold start|

### Khuyen nghi

1. Dung PM2 hoac container de tang do on dinh
2. Cau hinh CDN va Cache-Control dung
3. Co staging va load test truoc production
4. Dinh nghia error budget va alerting

**Thong diep chinh:** SSR khong chi la render, ma la kien truc van hanh.

---

## Tong ket cho phong van

**Cau tra loi mau (30-45 giay):**

> Khi lam SSR, toi chia van de thanh bon nhom: render deterministc de tranh hydration mismatch, tach biet ro config server/client, toi uu performance bang deduplication-cache-splitting, va dam bao van hanh on dinh voi xu ly loi, memory monitoring, va kien truc deploy phu hop.

**Checklist:**
- ✅ Neu it nhat mot van de cu the va nguyen nhan
- ✅ Trinh bay giai phap ky thuat ro rang
- ✅ Ket noi tac dong den SEO/performance/van hanh
- ✅ Chot bang boi canh du an thuc te
