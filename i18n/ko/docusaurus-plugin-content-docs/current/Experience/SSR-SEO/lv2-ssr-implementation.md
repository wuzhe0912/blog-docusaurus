---
title: '[Lv2] SSR 구현: Data Fetching과 SEO Meta 관리'
slug: /experience/ssr-seo/lv2-ssr-implementation
tags: [Experience, Interview, SSR-SEO, Lv2]
---

> Nuxt 3 프로젝트에서 SSR 데이터 로딩과 SEO Meta Tags 동적 관리를 구현하여, 검색 엔진이 동적 라우트 페이지를 올바르게 인덱싱할 수 있도록 보장한다.

---

## 1. 면접 답변 핵심

1. **Data Fetching 전략**: `useFetch`/`useAsyncData`를 사용하여 Server Side에서 데이터를 미리 로딩하여 SEO 콘텐츠 완전성을 보장.
2. **동적 Meta Tags**: `useHead`를 사용하여 데이터 기반으로 SEO meta tags를 동적 생성하고 동적 라우트 페이지를 지원.
3. **성능 최적화**: request deduplication, server-side caching 구현, SSR/CSR 페이지 구분.

---

## 2. useFetch / useAsyncData의 올바른 사용

### 2.1 왜 SSR Data Fetching이 필요한가?

**문제 상황:**

- 동적 라우트 페이지(예: `/products/[id]`)에서 API로부터 데이터를 로딩해야 함
- 클라이언트 측에서만 로딩하면 검색 엔진이 완전한 콘텐츠를 볼 수 없음
- Server Side에서 데이터를 미리 로딩하여 완전한 HTML을 생성해야 함

**해결 방안:** Nuxt 3의 `useFetch` 또는 `useAsyncData` 사용

### 2.2 useFetch 기본 사용법

**파일 위치:** `pages/products/[id].vue`

```typescript
// 기본 사용법
const { data: product } = await useFetch(`/api/products/${route.params.id}`);
```

**주요 매개변수 설명:**

| 매개변수        | 설명                                   | 기본값   |
| ----------- | -------------------------------------- | -------- |
| `key`       | 고유 식별자, request deduplication에 사용 | 자동 생성 |
| `lazy`      | 지연 로딩 여부(SSR을 차단하지 않음)             | `false`  |
| `server`    | Server Side에서 실행할지 여부                | `true`   |
| `default`   | 기본값                                 | `null`   |
| `transform` | 데이터 변환 함수                           | -        |

### 2.3 완전한 구현 예시

```typescript
// pages/products/[id].vue
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`, // 중복 요청 방지
  lazy: false, // SSR 시 완료 대기
  server: true, // server side 실행 보장
  default: () => ({
    id: null,
    name: '',
    description: '',
    image: '',
  }),
  transform: (data: any) => {
    // 데이터 변환 로직
    return {
      ...data,
      formattedPrice: formatPrice(data.price),
    };
  },
});
```

**핵심 포인트 설명:**

1. **`key` 매개변수** - request deduplication(중복 요청 방지)에 사용, 같은 key의 요청은 병합됨
2. **`lazy: false`** - SSR 시 데이터 로딩 완료까지 대기 후 렌더링, 검색 엔진이 완전한 콘텐츠를 볼 수 있도록 보장
3. **`server: true`** - Server Side에서의 실행을 보장, SSR의 핵심 설정

### 2.4 useAsyncData vs useFetch

| 기능         | useFetch                 | useAsyncData           |
| ------------ | ------------------------ | ---------------------- |
| **용도**     | API 직접 호출             | 임의의 비동기 작업 실행     |
| **자동 처리** | ✅ URL, headers 자동 처리 | ❌ 수동 처리 필요        |
| **적용 시나리오** | API 요청                 | 데이터베이스 쿼리, 파일 읽기 등 |

### 2.5 $fetch vs useFetch

**면접 빈출: 언제 `$fetch`를 사용하고, 언제 `useFetch`를 사용해야 하는가?**

**1. $fetch**
- **정의**: Nuxt 3가 내부적으로 사용하는 HTTP 클라이언트(`ofetch` 기반).
- **동작**: 순수 HTTP 요청만 발송, SSR 상태 동기화(Hydration)를 **처리하지 않음**.
- **위험**: `setup()`에서 직접 `$fetch`를 사용하면, Server 측에서 1회 요청, Client 측 Hydration 시 **재요청**(Double Fetch), Hydration Mismatch 발생 가능.
- **적용 시나리오**: 사용자 인터랙션 요청(버튼 클릭 폼 제출 등), Client-side only 로직, Middleware 또는 Server API route 내부.

**2. useFetch**
- **정의**: `useAsyncData` + `$fetch`를 래핑한 Composable.
- **동작**: 자동 key 생성으로 Request Deduplication, SSR 상태 전달(Server 데이터를 Client에 전달, Client 재요청 방지), 반응형 반환값 제공(`data`, `pending`, `error`, `refresh`).
- **적용 시나리오**: 페이지 초기화 데이터(Page Load), URL 매개변수 변동에 의존하는 데이터 가져오기.

**요약 비교:**

| 특성             | useFetch                     | $fetch                         |
| ---------------- | ---------------------------- | ------------------------------ |
| **SSR 상태 동기화** | ✅ 있음 (Hydration Friendly)   | ❌ 없음 (Double Fetch 가능)      |
| **반응형 (Ref)** | ✅ Ref 객체 반환             | ❌ Promise 반환 (Raw Data)     |
| **주요 용도**     | 페이지 데이터 로딩 (Data Fetching) | 이벤트 처리, 작업형 요청 (Actions) |

```typescript
// ⭕️ 올바름: 페이지 로딩에 useFetch 사용
const { data } = await useFetch('/api/user');

// ⭕️ 올바름: 클릭 이벤트에 $fetch 사용
const submitForm = async () => {
  await $fetch('/api/submit', { method: 'POST', body: form });
};

// ❌ 잘못됨: setup에서 직접 $fetch 사용 (Double Fetch 유발)
const data = await $fetch('/api/user');
```

---

## 3. SEO Meta 관리 (useHead)

### 3.1 왜 동적 Meta Tags가 필요한가?

**문제 상황:**

- 동적 라우트 페이지(예: 상품 페이지, 기사 페이지)에서 데이터 기반으로 Meta Tags를 동적 생성해야 함
- 각 페이지에 고유한 title, description, og:image가 필요
- Open Graph, Twitter Card 등 소셜 미디어 태그 지원 필요

**해결 방안:** Nuxt 3의 `useHead` 또는 `useSeoMeta` 사용

### 3.2 useHead 기본 사용법

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

### 3.3 useSeoMeta 간소화 작성법

```typescript
useSeoMeta({
  title: () => product.value?.name,
  description: () => product.value?.description,
  ogTitle: () => product.value?.name,
  ogDescription: () => product.value?.description,
  ogImage: () => product.value?.image,
  twitterCard: 'summary_large_image',
});
```

### 3.4 완전한 구현 예시

```typescript
// pages/products/[id].vue
<script setup lang="ts">
const route = useRoute();

// 1. 상품 데이터 로딩 (SSR)
const { data: product } = await useFetch(`/api/products/${route.params.id}`, {
  key: `product-${route.params.id}`,
  lazy: false,
  server: true,
});

// 2. SEO Meta Tags 동적 생성
useHead({
  title: () => product.value?.name || '상품 페이지',
  meta: [
    { name: 'description', content: () => product.value?.description || '' },
    { property: 'og:title', content: () => product.value?.name || '' },
    { property: 'og:description', content: () => product.value?.description || '' },
    { property: 'og:image', content: () => product.value?.image || '' },
    { property: 'og:type', content: 'product' },
  ],
  link: [
    { rel: 'canonical', href: () => `https://example.com/products/${product.value?.id}` },
  ],
});
</script>
```

---

## 4. 실전 Case 1: 동적 라우트 SEO 최적화

### 4.1 문제 배경

**상황:** 이커머스 플랫폼에 10만+ SKU가 있으며, 각 상품 페이지가 Google에 올바르게 인덱싱되어야 함.

### 4.2 해결 방안

#### Step 1: useFetch로 데이터 미리 로딩

```typescript
const { data: product, error } = await useFetch(
  `/api/products/${route.params.id}`,
  { key: `product-${route.params.id}`, lazy: false, server: true }
);

if (error.value || !product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' });
}
```

#### Step 2: Meta Tags 동적 생성

#### Step 3: 404 시나리오 처리

```typescript
// error.vue
<script setup lang="ts">
useHead({
  title: '404 - 페이지를 찾을 수 없습니다',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});
</script>
```

---

## 5. 실전 Case 2: 성능 최적화

### 5.1 문제 배경

**상황:** SSR은 server loading을 증가시키므로 성능 최적화가 필요.

### 5.2 해결 방안

#### 전략 1: Request Deduplication - `key` 매개변수로 중복 요청 방지
#### 전략 2: Server-Side Caching - Nitro Cache로 서버 측 캐싱
#### 전략 3: SSR / CSR 페이지 구분 - SEO 불필요 페이지는 CSR 사용
#### 전략 4: Critical CSS Inline - FCP 시간 단축

---

## 6. 면접 핵심 정리

### 6.1 useFetch / useAsyncData

> Nuxt 3 프로젝트에서 `useFetch`를 사용하여 Server Side에서 데이터를 미리 로딩합니다. 핵심 설정으로 `key`는 request deduplication에, `lazy: false`는 SSR 시 데이터 로딩 완료 대기, `server: true`는 Server Side 실행 보장에 사용합니다.

### 6.2 동적 Meta Tags

> `useHead` 또는 `useSeoMeta`를 사용하여 데이터 기반으로 SEO Meta Tags를 동적 생성합니다. 핵심은 함수 반환값(예: `() => product.value?.name`)을 사용하여 데이터 업데이트 시 Meta Tags도 업데이트되도록 보장하는 것입니다.

### 6.3 성능 최적화

> SSR 성능 최적화를 위해 `key` 매개변수로 request deduplication, Nitro Cache로 server-side caching, SEO 필요/불필요 페이지 구분을 구현했습니다.

---

## 7. 모범 사례

### 7.1 Data Fetching
1. 항상 `key` 설정 - 중복 요청 방지
2. 요구사항에 따라 `lazy` 선택 - SEO 필요: `lazy: false`, 불필요: `lazy: true`
3. 에러 시나리오 처리 - 404 올바른 처리

### 7.2 SEO Meta Tags
1. 함수 반환값 사용 - 반응형 업데이트 지원
2. 완전한 SEO 요소 설정 - title, description, Open Graph, canonical URL
3. 404 페이지 처리 - `noindex, nofollow` 설정

### 7.3 성능 최적화
1. 캐시 메커니즘 사용 - Server-side caching
2. SSR/CSR 구분 - SEO 필요: SSR, 불필요: CSR
3. Critical CSS - Inline critical CSS

---

## 8. 면접 요약

> Nuxt 3 프로젝트에서 완전한 SSR 데이터 로딩과 SEO Meta Tags 관리를 구현했습니다. `useFetch`로 Server Side에서 데이터를 미리 로딩하고, `useHead`로 동적 Meta Tags를 생성하며, request deduplication, server-side caching, SSR/CSR 페이지 구분으로 성능을 최적화했습니다.

**핵심 포인트:**
- ✅ useFetch/useAsyncData의 올바른 사용
- ✅ 동적 Meta Tags 관리 (useHead)
- ✅ 동적 라우트 SEO 최적화
- ✅ 성능 최적화 전략
- ✅ 실제 프로젝트 경험
