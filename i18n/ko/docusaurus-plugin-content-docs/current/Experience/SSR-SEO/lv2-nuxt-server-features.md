---
title: '[Lv2] Nuxt 3 Server 기능 구현: Server Routes와 동적 Sitemap'
slug: /experience/ssr-seo/lv2-nuxt-server-features
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Nuxt 3의 Nitro Server Engine 기능을 습득하여 Server Routes (API Routes), 동적 Sitemap, Robots.txt를 구현하고, 웹사이트의 SEO와 아키텍처 유연성을 향상시킵니다.

---

## 1. 면접 답변 핵심

1.  **Server Routes (API Routes)**: `server/api` 또는 `server/routes`를 사용하여 백엔드 로직 구축. API Key 숨기기, CORS 처리, BFF (Backend for Frontend) 아키텍처에 자주 사용.
2.  **동적 Sitemap**: Server Routes (`server/routes/sitemap.xml.ts`)를 통해 XML을 동적 생성하여 검색 엔진이 최신 콘텐츠를 인덱싱할 수 있도록 보장.
3.  **Robots.txt**: 마찬가지로 Server Routes로 동적 생성하거나 Nuxt Config으로 설정하여 크롤러 접근 권한 제어.

---

## 2. Nuxt 3 Server Engine: Nitro

### 2.1 Nitro란?

Nitro는 Nuxt 3의 새로운 서버 엔진으로, Nuxt 애플리케이션을 어디에나 배포 가능하게 합니다 (Universal Deployment). 단순한 서버가 아닌, 강력한 빌드 및 런타임 도구입니다.

### 2.2 Nitro의 핵심 기능

1.  **크로스 플랫폼 배포 (Universal Deployment)**:
    Node.js server, Serverless Functions (Vercel, AWS Lambda, Netlify), Service Workers 등 다양한 형식으로 컴파일 가능. Zero-config으로 주요 플랫폼에 배포 가능.

2.  **경량 및 고속 (Lightweight & Fast)**:
    Cold start 시간이 매우 짧고 생성되는 bundle size가 매우 작음 (최소 < 1MB).

3.  **자동 코드 분할 (Auto Code Splitting)**:
    Server Routes의 의존성을 자동 분석하고 code splitting을 수행하여 시작 속도 보장.

4.  **HMR (Hot Module Replacement)**:
    프론트엔드뿐 아니라 Nitro를 통해 백엔드 API 개발에서도 HMR 사용 가능. `server/` 파일 수정 시 서버 재시작 불필요.

5.  **Storage Layer (Unstorage)**:
    통합 Storage API를 내장하여 Redis, GitHub, FS, Memory 등 다양한 저장소 인터페이스에 쉽게 연결 가능.

6.  **Server Assets**:
    Server 측에서 정적 리소스 파일에 편리하게 접근 가능.

---

## 3. Nuxt 3 Server Routes (API Routes)

### 3.1 Server Routes란?

Nuxt 3은 **Nitro** 서버 엔진을 내장하여 개발자가 프로젝트 내에서 백엔드 API를 직접 작성할 수 있습니다. 이 파일들은 `server/api` 또는 `server/routes` 디렉토리에 배치되며, 자동으로 API endpoint로 매핑됩니다.

- `server/api/hello.ts` -> `/api/hello`
- `server/routes/hello.ts` -> `/hello`

### 2.2 어떤 상황에서 사용하는가? (일반적인 면접 문제)

**1. 민감 정보 숨기기 (Secret Management)**
프론트엔드에서는 Private API Key를 안전하게 저장할 수 없습니다. Server Routes를 중개로 사용하여 Server 측에서 환경 변수로 Key에 접근하고, 결과만 프론트엔드에 반환합니다.

```typescript
// server/api/weather.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // API Key는 Server 측에서만 사용되며, Client에 노출되지 않음
  const data = await $fetch(
    `https://api.weather.com/v1?key=${config.weatherApiKey}`
  );
  return data;
});
```

**2. CORS 문제 처리 (Proxy)**
외부 API가 CORS를 지원하지 않을 때, Server Routes를 Proxy로 사용할 수 있습니다. 브라우저가 Nuxt Server(동일 출처)에 요청하고, Nuxt Server가 외부 API에 요청(CORS 제한 없음)합니다.

**3. Backend for Frontend (BFF)**
여러 백엔드 API 데이터를 Nuxt Server 측에서 집계, 필터링 또는 포맷 변환 후 프론트엔드에 일괄 반환. 프론트엔드 요청 횟수와 Payload 크기 감소.

**4. Webhook 처리**
서드파티 서비스(결제, CMS 등)의 Webhook 알림 수신.

---

## 4. 동적 Sitemap 구현

### 3.1 왜 동적 Sitemap이 필요한가?

콘텐츠가 자주 변경되는 웹사이트(전자상거래, 뉴스 사이트 등)에서는 정적으로 생성된 `sitemap.xml`이 빠르게 만료됩니다. Server Routes를 사용하면 요청마다 최신 Sitemap을 동적으로 생성할 수 있습니다.

### 3.2 구현 방법: 수동 생성

`server/routes/sitemap.xml.ts` 생성:

```typescript
// server/routes/sitemap.xml.ts
import { SitemapStream, streamToPromise } from 'sitemap';

export default defineEventHandler(async (event) => {
  // 1. 데이터베이스 또는 API에서 모든 동적 라우트 데이터 가져오기
  const posts = await $fetch('https://api.example.com/posts');

  const sitemap = new SitemapStream({
    hostname: 'https://example.com',
  });

  // 2. 정적 페이지 추가
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.5 });

  // 3. 동적 페이지 추가
  posts.forEach((post) => {
    sitemap.write({
      url: `/posts/${post.id}`,
      changefreq: 'weekly',
      lastmod: post.updatedAt,
    });
  });

  sitemap.end();

  // 4. Header 설정 후 XML 반환
  setHeader(event, 'content-type', 'application/xml');
  return streamToPromise(sitemap);
});
```

### 3.3 구현 방법: 모듈 사용 (`@nuxtjs/sitemap`)

표준 요구사항에는 공식 모듈 사용 권장:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    siteUrl: 'https://example.com',
    sources: [
      '/api/sitemap-urls', // 동적 URL 목록을 제공하는 API 지정
    ],
  },
});
```

---

## 5. 동적 Robots.txt 구현

### 4.1 구현 방법

`server/routes/robots.txt.ts` 생성:

```typescript
// server/routes/robots.txt.ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();
  const isProduction = config.public.siteEnv === 'production';

  // 환경에 따라 규칙을 동적으로 결정
  const robots = isProduction
    ? `User-agent: *
Disallow: /admin
Disallow: /private
Sitemap: https://example.com/sitemap.xml`
    : `User-agent: *
Disallow: /`; // 비프로덕션 환경에서는 인덱싱 금지

  setHeader(event, 'content-type', 'text/plain');
  return robots;
});
```

---

## 6. 면접 포인트 정리

### 5.1 Nitro Engine & Server Routes

**Q: Nuxt 3의 server engine은 무엇인가요? Nitro의 특징은?**

> **답변 예시:**
> Nuxt 3의 server engine은 **Nitro**입니다.
> 가장 큰 특징은 **Universal Deployment**로, 모든 환경(Node.js, Vercel, AWS Lambda, Edge Workers 등)에 제로 컨피그로 배포 가능합니다.
> 그 외 특징으로는 백엔드 API의 **HMR**(수정 시 재시작 불필요), **Auto Code Splitting**(시작 속도 향상), 내장 **Storage Layer**(Redis나 KV Storage 연결 용이)가 있습니다.

**Q: Nuxt 3의 Server Routes는 무엇인가요? 구현해 본 적이 있나요?**

> **답변 예시:**
> 네, 구현해 본 적이 있습니다. Server Routes는 Nuxt 3이 Nitro 엔진을 통해 제공하는 백엔드 기능으로, `server/api` 디렉토리에 배치합니다.
> 저는 주로 다음 시나리오에서 사용했습니다:
>
> 1.  **API Key 숨기기**: 서드파티 서비스 연동 시 Secret Key가 프론트엔드 코드에 노출되지 않도록.
> 2.  **CORS Proxy**: 교차 출처 요청 문제 해결.
> 3.  **BFF (Backend for Frontend)**: 여러 API 요청을 하나로 통합하여 프론트엔드 요청 횟수를 줄이고 데이터 구조 최적화.

### 5.2 Sitemap과 Robots.txt

**Q: Nuxt 3에서 동적 sitemap과 robots.txt를 어떻게 구현하나요?**

> **답변 예시:**
> Nuxt의 Server Routes를 사용하여 구현합니다.
> **Sitemap**의 경우, `server/routes/sitemap.xml.ts`를 생성하고 백엔드 API를 호출하여 최신 게시물 또는 제품 목록을 가져온 후, `sitemap` 패키지를 사용하여 XML 문자열을 생성하고 반환합니다. 이렇게 하면 검색 엔진이 크롤링할 때마다 최신 링크를 얻을 수 있습니다.
> **Robots.txt**의 경우, `server/routes/robots.txt.ts`를 생성하고 환경 변수(Production 또는 Staging)에 따라 다른 규칙을 동적으로 반환합니다. 예를 들어 Staging 환경에서는 `Disallow: /`를 설정하여 인덱싱을 방지합니다.

### 5.3 SEO Meta Tags (보충)

**Q: Nuxt 3의 SEO meta tags를 어떻게 처리하나요? useHead나 useSeoMeta를 사용해 본 적이 있나요?**

> **답변 예시:**
> 주로 Nuxt 3 내장 `useHead`와 `useSeoMeta` Composables를 사용합니다.
> `useHead`로 `title`, `meta`, `link` 등의 태그를 정의할 수 있습니다. 순수 SEO 설정의 경우 `useSeoMeta`를 우선 사용합니다. 문법이 더 간결하고 타입 힌트(Type-safe)가 있어 `ogTitle`, `description` 등의 속성을 직접 설정할 수 있기 때문입니다.
> 동적 페이지(제품 페이지 등)에서는 Getter Function(예: `title: () => product.value.name`)을 전달하여 데이터 업데이트 시 Meta Tags도 자동으로 반응적으로 업데이트되도록 합니다.

---

## 7. 관련 Reference

- [Nuxt 3 Server Routes](https://nuxt.com/docs/guide/directory-structure/server)
- [Nuxt SEO Module](https://nuxtseo.com/)
