---
title: '[Lv3] Nuxt 3 성능 최적화: Bundle Size, SSR 속도 및 이미지 최적화'
slug: /experience/performance/lv3-nuxt-performance
tags: [Experience, Interview, Performance, Nuxt, Lv3]
---

> Nuxt 3 성능 최적화 완전 가이드: Bundle Size 최소화, SSR 속도 최적화부터 이미지 로딩 전략까지, 극한 성능 경험을 구축합니다.

---

## 1. 면접 답변 핵심

1. **Bundle Size 최적화**: 분석(`nuxi analyze`), 분할(`SplitChunks`), Tree Shaking, Lazy Loading.
2. **SSR 속도 최적화 (TTFB)**: Redis 캐시, Nitro Cache, 블로킹 API 호출 감소, Streaming SSR.
3. **이미지 최적화**: `@nuxt/image`, WebP 형식, CDN, Lazy Loading.
4. **대량 데이터 최적화**: Virtual Scrolling, Infinite Scroll, Pagination.

---

## 2. Nuxt 3의 Bundle Size를 어떻게 줄이나요?

### 2.1 진단 도구

먼저 병목 지점을 파악해야 합니다. `nuxi analyze`를 사용하여 Bundle 구조를 시각화합니다.

```bash
npx nuxi analyze
```

이를 통해 어떤 패키지가 가장 큰 공간을 차지하는지 보여주는 보고서가 생성됩니다.

### 2.2 최적화 전략

#### 1. Code Splitting (코드 분할)
Nuxt 3은 기본적으로 Route-based Code Splitting을 수행합니다. 하지만 대형 패키지(ECharts, Lodash 등)의 경우 수동 최적화가 필요합니다.

**Nuxt Config 설정 (Vite/Webpack):**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // node_modules의 대형 패키지를 분리
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

#### 2. Tree Shaking 및 주문형 Import
필요한 모듈만 import하고, 전체 패키지를 가져오지 않도록 합니다.

```typescript
// ❌ 잘못된 방법: lodash 전체 import
import _ from 'lodash';
_.debounce(() => {}, 100);

// ✅ 올바른 방법: debounce만 import
import debounce from 'lodash/debounce';
debounce(() => {}, 100);

// ✅ 추천: vueuse 사용 (Vue 전용 및 Tree-shakable)
import { useDebounceFn } from '@vueuse/core';
```

#### 3. 컴포넌트 Lazy Loading
첫 화면에 필요하지 않은 컴포넌트에 `Lazy` 접두사를 사용하여 동적 import합니다.

```vue
<template>
  <div>
    <!-- show가 true일 때만 해당 컴포넌트 코드를 로딩 -->
    <LazyHeavyComponent v-if="show" />
  </div>
</template>
```

#### 4. 불필요한 Server-side 패키지 제거
Server 측에서만 사용하는 패키지(데이터베이스 드라이버, fs 작업 등)가 Client에 번들링되지 않도록 합니다. Nuxt 3은 `.server.ts` 확장자 파일이나 `server/` 디렉토리를 자동으로 처리합니다.

---

## 3. SSR 속도(TTFB) 최적화 방법

### 3.1 왜 TTFB가 길어지나요?
TTFB(Time To First Byte)는 SSR 성능의 핵심 지표입니다. 과도하게 긴 원인은 보통:
1. **API 응답 지연**: Server가 백엔드 API 응답을 기다린 후 HTML을 렌더링해야 함.
2. **직렬 요청**: 여러 API 요청이 병렬이 아닌 순차적으로 실행.
3. **무거운 계산**: Server 측에서 과도한 CPU 집약적 작업 수행.

### 3.2 최적화 방안

#### 1. Server-Side Caching (Nitro Cache)
Nitro의 캐시 기능을 사용하여 API 응답이나 렌더링 결과를 캐싱합니다.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // 홈페이지 1시간 캐시 (SWR: Stale-While-Revalidate)
    '/': { swr: 3600 },
    // 상품 페이지 10분 캐시
    '/products/**': { swr: 600 },
    // API 캐시
    '/api/**': { cache: { maxAge: 60 } },
  },
});
```

#### 2. 병렬 요청 (Parallel Fetching)
`Promise.all`로 여러 요청을 병렬 발송하고, `await`으로 하나씩 순차 실행하지 않습니다.

```typescript
// ❌ 느림: 직렬 실행 (총 시간 = A + B)
const { data: user } = await useFetch('/api/user');
const { data: posts } = await useFetch('/api/posts');

// ✅ 빠름: 병렬 실행 (총 시간 = Max(A, B))
const [{ data: user }, { data: posts }] = await Promise.all([
  useFetch('/api/user'),
  useFetch('/api/posts'),
]);
```

#### 3. 비핵심 데이터 지연 로딩 (Lazy Fetching)
첫 화면에 필요하지 않은 데이터는 Client 측에서 로드(`lazy: true`)하여 SSR을 차단하지 않습니다.

```typescript
// 댓글 데이터는 SEO 불필요, Client 측에서 로드 가능
const { data: comments } = await useFetch('/api/comments', {
  lazy: true,
  server: false, // Server 측에서 전혀 실행하지 않음
});
```

#### 4. Streaming SSR (실험적)
Nuxt 3은 HTML Streaming을 지원하여, 렌더링하면서 반환할 수 있어 사용자가 더 빠르게 콘텐츠를 볼 수 있습니다.

---

## 4. Nuxt 3 이미지 최적화

### 4.1 @nuxt/image 사용
공식 모듈 `@nuxt/image`이 최적의 솔루션으로, 다음을 제공합니다:
- **자동 형식 변환**: WebP/AVIF 자동 변환.
- **자동 크기 조정**: 화면 크기에 따른 해당 크기 이미지 생성.
- **Lazy Loading**: 내장 Lazy Loading.
- **CDN 통합**: Cloudinary, Imgix 등 다양한 Provider 지원.

### 4.2 구현 예시

```bash
npm install @nuxt/image
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/image'],
  image: {
    // 기본 옵션
    format: ['webp'],
  },
});
```

```vue
<template>
  <!-- webp로 자동 변환, 너비 300px, lazy load 활성화 -->
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

## 5. 대량 데이터의 페이징과 스크롤

### 5.1 방안 선택
대량 데이터(예: 10,000건 상품)에 대해 주로 세 가지 전략이 있으며, **SEO**를 고려해야 합니다:

| 전략 | 적합 시나리오 | SEO 친화도 |
| :--- | :--- | :--- |
| **전통적 페이징 (Pagination)** | 이커머스 목록, 기사 목록 | 최상 |
| **무한 스크롤 (Infinite Scroll)** | 소셜 피드, 이미지 갤러리 | 특수 처리 필요 |
| **Virtual Scroll** | 복잡한 리포트, 초장 목록 | 콘텐츠가 DOM에 없음 |

### 5.2 무한 스크롤의 SEO를 유지하는 방법
무한 스크롤의 경우 검색 엔진은 보통 첫 페이지만 크롤링합니다. 해결 방안:
1. **페이징 모드와 결합**: `<link rel="next" href="...">` 태그를 제공하여 크롤러에게 다음 페이지가 있음을 알림.
2. **Noscript Fallback**: 크롤러를 위한 전통적 페이징 `<noscript>` 버전 제공.
3. **Load More 버튼**: 첫 화면에서 SSR로 20건 렌더링, 이후 "더 보기" 클릭 또는 스크롤로 Client-side fetch 트리거.

### 5.3 구현 예시 (Load More + SEO)

```vue
<script setup>
// 첫 화면 데이터 (SSR)
const page = ref(1);
const { data: posts } = await useFetch('/api/posts', {
  query: { page: page.value }
});

// Client 측 추가 로딩
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
    <button @click="loadMore">더 보기</button>

    <!-- SEO 최적화: 크롤러에게 다음 페이지가 있음을 알림 -->
    <Head>
      <Link rel="next" :href="`/posts?page=${page + 1}`" />
    </Head>
  </div>
</template>
```

---

## 6. SSR 환경에서의 Lazy Loading

### 6.1 문제 설명
SSR 환경에서 `IntersectionObserver`로 Lazy Loading을 구현하면, Server 측에 `window`나 `document`가 없어 에러 또는 Hydration Mismatch가 발생합니다.

### 6.2 해결 방안

#### 1. Nuxt 내장 컴포넌트 사용
- `<LazyComponent>`
- `<NuxtImg loading="lazy">`

#### 2. 커스텀 Directive (SSR 처리 필요)

```typescript
// plugins/lazy-load.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazy', {
    mounted(el, binding) {
      // Client 측에서만 실행
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          el.src = binding.value;
          observer.disconnect();
        }
      });
      observer.observe(el);
    },
    getSSRProps(binding) {
      // Server 측 렌더링 시 placeholder 또는 원본 이미지 (SEO 요구사항에 따라)
      return {
        src: 'placeholder.png'
      };
    }
  });
});
```

---

## 7. SSR 성능 모니터링 및 추적

### 7.1 왜 모니터링이 필요한가요?
SSR 애플리케이션의 성능 병목은 종종 Server 측에서 발생하며, 브라우저의 DevTools로는 볼 수 없습니다. 모니터링하지 않으면 API 응답 지연, Memory Leak, CPU 급증이 TTFB 증가의 원인인지 파악하기 어렵습니다.

### 7.2 자주 사용하는 도구

1. **Nuxt DevTools (개발 단계)**:
   - Nuxt 3에 내장.
   - Server Routes의 응답 시간 확인 가능.
   - **Open Graph** SEO 미리보기.
   - **Server Routes** 패널에서 API 호출 소요 시간 모니터링.

2. **Lighthouse / PageSpeed Insights (배포 후)**:
   - Core Web Vitals (LCP, CLS, FID/INP) 모니터링.
   - LCP(Largest Contentful Paint)는 SSR의 TTFB에 크게 의존.

3. **Server-Side Monitoring (APM)**:
   - **Sentry / Datadog**: Server 측 에러 및 성능 추적.
   - **OpenTelemetry**: 완전한 Request Trace 추적 (Nuxt Server → API Server → DB).

### 7.3 간단한 시간 추적 구현

`server/middleware`에서 간단한 타이머를 구현할 수 있습니다:

```typescript
// server/middleware/timing.ts
export default defineEventHandler((event) => {
  const start = performance.now();

  event.node.res.on('finish', () => {
    const duration = performance.now() - start;
    console.log(`[${event.method}] ${event.path} - ${duration.toFixed(2)}ms`);

    // Server-Timing header를 추가하여 브라우저 DevTools에서 확인 가능
    // event.node.res.setHeader('Server-Timing', `total;dur=${duration}`);
  });
});
```

---

## 8. 면접 총정리

**Q: SSR 성능 문제를 어떻게 추적하고 모니터링하나요?**
> 개발 단계에서는 주로 **Nuxt DevTools**를 사용하여 Server Routes의 응답 시간과 Payload 크기를 확인합니다.
> Production 환경에서는 **Core Web Vitals** (특히 LCP)와 **TTFB**에 주목합니다.
> Server 측 병목을 심층 추적해야 하는 경우, 커스텀 Server Middleware로 요청 시간을 기록하고 `Server-Timing` header로 데이터를 브라우저에 전달하거나, **Sentry** / **OpenTelemetry**를 통합하여 전체 경로 추적을 수행합니다.

**Q: Nuxt 3의 Bundle Size를 어떻게 줄이나요?**
> 먼저 `nuxi analyze`로 분석합니다. 대형 패키지(lodash 등)에 Tree Shaking이나 수동 분할(`manualChunks`)을 적용합니다. 첫 화면에 불필요한 컴포넌트에는 `<LazyComponent>`로 동적 import합니다.

**Q: SSR 속도를 어떻게 최적화하나요?**
> 핵심은 TTFB 감소입니다. Nitro의 `routeRules`로 Server-side caching(SWR)을 설정합니다. API 요청은 가능한 `Promise.all`로 병렬 처리합니다. 비핵심 데이터는 `lazy: true`로 Client 측에서 로드합니다.

**Q: 이미지 최적화는 어떻게 하나요?**
> `@nuxt/image` 모듈을 사용합니다. WebP 자동 변환, 자동 크기 조정, Lazy Loading을 지원하여 전송량을 대폭 줄입니다.

**Q: 무한 스크롤에서 SEO를 어떻게 양립시키나요?**
> 무한 스크롤은 SEO에 불리합니다. 콘텐츠형 웹사이트라면 전통적 페이징을 우선 선택합니다. 반드시 무한 스크롤을 사용해야 한다면 SSR로 첫 페이지를 렌더링하고, Meta Tags(`rel="next"`)로 크롤러에게 페이징 구조를 알리거나, Noscript 페이징 링크를 제공합니다.
