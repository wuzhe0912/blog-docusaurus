---
title: '[Lv2] Nuxt 3 Rendering Modes: SSR, SSG, CSR 선택 전략'
slug: /experience/ssr-seo/lv2-nuxt-rendering-modes
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv2]
---

> Nuxt 3의 Rendering Modes를 이해하고, 프로젝트 요구사항에 따라 적절한 렌더링 전략(SSR, SSG, CSR)을 선택할 수 있다.

---

## 1. 면접 답변 핵심

1. **Rendering Modes 분류**: Nuxt 3는 SSR, SSG, CSR, Hybrid Rendering 4가지 모드를 지원
2. **선택 전략**: SEO 요구사항, 콘텐츠 동적성, 성능 요구에 따라 적절한 모드 선택
3. **구현 경험**: 프로젝트에서 다양한 Rendering Modes를 구성하고 선택하는 방법

---

## 2. Nuxt 3 Rendering Modes 소개

### 2.1 4가지 Rendering Modes

Nuxt 3는 4가지 주요 Rendering Modes를 지원합니다:

| 모드 | 전체 이름 | 렌더링 시점 | 적용 시나리오 |
|------|------|---------|---------|
| **SSR** | Server-Side Rendering | 각 요청 시 Server 측에서 렌더링 | SEO + 동적 콘텐츠 필요 |
| **SSG** | Static Site Generation | 빌드 시 HTML 사전 생성 | SEO + 고정 콘텐츠 필요 |
| **CSR** | Client-Side Rendering | 브라우저 측에서 렌더링 | SEO 불필요 + 높은 상호작용성 |
| **Hybrid** | Hybrid Rendering | 여러 모드를 혼합 사용 | 페이지마다 다른 요구사항 |

### 2.2 SSR (Server-Side Rendering)

**정의:** 각 요청 시 Server 측에서 JavaScript를 실행하여 완전한 HTML을 생성한 후 브라우저에 전송한다.

**설정 방법:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // 기본값은 true
});
```

**프로세스:**
1. 브라우저가 페이지 요청
2. Server가 JavaScript를 실행하여 완전한 HTML 생성
3. HTML을 브라우저에 전송
4. 브라우저 Hydration(인터랙티브 기능 활성화)

**장점:**
- ✅ SEO 친화적(검색 엔진이 전체 콘텐츠를 인식 가능)
- ✅ 첫 로딩 속도가 빠름(JavaScript 실행 대기 불필요)
- ✅ 동적 콘텐츠 지원(각 요청마다 최신 데이터 가져오기 가능)

**단점:**
- ❌ Server 부담이 큼(각 요청마다 렌더링 실행 필요)
- ❌ TTFB(Time To First Byte)가 길어질 수 있음
- ❌ Server 환경 필요

**적용 시나리오:**
- 이커머스 상품 페이지(SEO + 동적 가격/재고 필요)
- 뉴스 기사 페이지(SEO + 동적 콘텐츠 필요)
- 사용자 프로필 페이지(SEO + 개인화 콘텐츠 필요)

### 2.3 SSG (Static Site Generation)

**정의:** 빌드 시(Build Time)에 모든 HTML 페이지를 사전 생성하여 정적 파일로 배포한다.

**설정 방법:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // SSG에는 SSR이 true여야 함
  nitro: {
    prerender: {
      routes: ['/about', '/contact'], // 프리렌더링할 라우트 지정
    },
  },
});

// 또는 routeRules 사용
export default defineNuxtConfig({
  routeRules: {
    '/about': { prerender: true },
    '/contact': { prerender: true },
  },
});
```

**프로세스:**
1. 빌드 시 JavaScript를 실행하여 모든 페이지의 HTML 생성
2. HTML 파일을 CDN에 배포
3. 브라우저 요청 시 사전 생성된 HTML을 직접 반환

**장점:**
- ✅ 최고의 성능(CDN 캐시, 빠른 응답 속도)
- ✅ SEO 친화적(완전한 HTML 콘텐츠)
- ✅ Server 부담 최소(런타임 렌더링 불필요)
- ✅ 저비용(CDN에 배포 가능)

**단점:**
- ❌ 동적 콘텐츠에 부적합(업데이트하려면 재빌드 필요)
- ❌ 빌드 시간이 길어질 수 있음(대량의 페이지인 경우)
- ❌ 사용자 특정 콘텐츠를 처리할 수 없음

**적용 시나리오:**
- 회사 소개 페이지(고정 콘텐츠)
- 제품 설명 페이지(비교적 고정된 콘텐츠)
- 블로그 글(게시 후 자주 변경되지 않음)

### 2.4 CSR (Client-Side Rendering)

**정의:** 브라우저에서 JavaScript를 실행하여 동적으로 HTML 콘텐츠를 생성한다.

**설정 방법:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // 전역 SSR 비활성화
});

// 또는 특정 라우트에 대해
export default defineNuxtConfig({
  routeRules: {
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});

// 또는 페이지에서 설정
// pages/dashboard.vue
<script setup lang="ts">
definePageMeta({
  ssr: false,
});
</script>
```

**프로세스:**
1. 브라우저가 HTML 요청(보통 빈 shell)
2. JavaScript bundle 다운로드
3. JavaScript 실행, 동적으로 콘텐츠 생성
4. 페이지 렌더링

**장점:**
- ✅ 높은 상호작용성, SPA에 적합
- ✅ Server 부담 감소
- ✅ 페이지 전환이 매끄러움(리로드 불필요)

**단점:**
- ❌ SEO에 불리(검색 엔진이 올바르게 인덱싱하지 못할 수 있음)
- ❌ 첫 로딩 시간이 김(JavaScript 다운로드 및 실행 필요)
- ❌ JavaScript가 있어야 콘텐츠 표시 가능

**적용 시나리오:**
- 관리자 시스템(SEO 불필요)
- 사용자 대시보드(SEO 불필요)
- 인터랙티브 애플리케이션(게임, 도구 등)

### 2.5 Hybrid Rendering(하이브리드 렌더링)

**정의:** 페이지별 요구사항에 따라 여러 Rendering Modes를 혼합 사용한다.

**설정 방법:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // 기본 SSR
  routeRules: {
    // SEO가 필요한 페이지: SSR
    '/products/**': { ssr: true },
    '/articles/**': { ssr: true },

    // 고정 콘텐츠 페이지: SSG
    '/about': { prerender: true },
    '/contact': { prerender: true },

    // SEO가 필요 없는 페이지: CSR
    '/dashboard/**': { ssr: false },
    '/user/**': { ssr: false },
  },
});
```

**장점:**
- ✅ 페이지 특성에 따라 적절한 모드 선택
- ✅ SEO, 성능, 개발 경험의 균형
- ✅ 높은 유연성

**적용 시나리오:**
- 대규모 프로젝트(페이지마다 다른 요구사항)
- 이커머스 플랫폼(상품 페이지 SSR, 관리자 CSR, 회사 소개 SSG)

### 2.6 ISR (Incremental Static Regeneration)

**정의:** 증분 정적 재생성. SSG의 성능과 SSR의 동적성을 결합한 것. 페이지는 빌드 시 또는 첫 번째 요청 시 정적 HTML을 생성하고, 일정 기간(TTL) 동안 캐싱된다. 캐시 만료 후 다음 요청 시 백그라운드에서 페이지를 재생성하면서 이전 캐시 콘텐츠를 반환한다(Stale-While-Revalidate).

**설정 방법:**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    // ISR 활성화, 1시간 캐시 (3600초)
    '/blog/**': { swr: 3600 },
    // 또는 isr 속성 사용 (Netlify/Vercel 등 플랫폼에서 특정 지원)
    '/products/**': { isr: 600 },
  },
});
```

**프로세스:**
1. 요청 A 도착: Server가 페이지를 렌더링하고 반환 후 캐시 (Cache MISS -> HIT).
2. 요청 B 도착 (TTL 내): 캐시된 콘텐츠를 직접 반환 (Cache HIT).
3. 요청 C 도착 (TTL 후): 이전 캐시를 반환 (Stale)하고, 백그라운드에서 재렌더링하여 캐시 업데이트 (Revalidate).
4. 요청 D 도착: 새로운 캐시 콘텐츠를 반환.

**장점:**
- ✅ SSG에 가까운 극한의 성능
- ✅ SSG 빌드 시간이 긴 문제를 해결
- ✅ 콘텐츠를 주기적으로 업데이트 가능

**적용 시나리오:**
- 대규모 블로그
- 이커머스 상품 상세 페이지
- 뉴스 사이트

### 2.7 Route Rules와 캐시 전략

Nuxt 3는 `routeRules`를 사용하여 하이브리드 렌더링과 캐시 전략을 통합 관리한다. 이는 Nitro 레벨에서 처리된다.

| 속성 | 의미 | 적용 시나리오 |
|------|------|---------|
| `ssr: true` | Server-Side Rendering 강제 | SEO + 높은 동적성 |
| `ssr: false` | Client-Side Rendering (SPA) 강제 | 관리자, 대시보드 |
| `prerender: true` | 빌드 시 프리렌더링 (SSG) | 회사 소개, 약관 페이지 |
| `swr: true` | SWR 캐시 활성화 (만료 시간 없음, 재배포까지) | 변경이 거의 없는 콘텐츠 |
| `swr: 60` | ISR 활성화, 60초 캐시 | 목록 페이지, 이벤트 페이지 |
| `cache: { maxAge: 60 }` | Cache-Control header 설정 (브라우저/CDN 캐시) | 정적 리소스 |

---

## 3. 선택 전략

### 3.1 요구사항에 따른 Rendering Mode 선택

**의사결정 흐름도:**

```
SEO가 필요한가?
├─ 예 → 콘텐츠가 자주 변경되는가?
│   ├─ 예 → SSR
│   └─ 아니오 → SSG
└─ 아니오 → CSR
```

**선택 비교표:**

| 요구사항 | 추천 모드 | 이유 |
|------|---------|------|
| **SEO 필요** | SSR / SSG | 검색 엔진이 전체 콘텐츠를 인식 가능 |
| **콘텐츠가 자주 변경** | SSR | 각 요청마다 최신 콘텐츠 가져오기 |
| **비교적 고정된 콘텐츠** | SSG | 최고의 성능, 최저 비용 |
| **SEO 불필요** | CSR | 높은 상호작용성, 매끄러운 페이지 전환 |
| **대량의 페이지** | SSG | 빌드 시 생성, CDN 캐시 |
| **사용자 특정 콘텐츠** | SSR / CSR | 동적 생성 필요 |

### 3.2 실전 사례

#### 사례 1: 이커머스 플랫폼

**요구사항:**
- 상품 페이지에 SEO 필요(Google 인덱싱)
- 상품 내용이 자주 변동(가격, 재고)
- 사용자 개인 페이지에는 SEO 불필요

**솔루션:**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // 상품 페이지: SSR(SEO + 동적 콘텐츠 필요)
    '/products/**': { ssr: true },

    // 회사 소개: SSG(고정 콘텐츠)
    '/about': { prerender: true },

    // 사용자 페이지: CSR(SEO 불필요)
    '/user/**': { ssr: false },
  },
});
```

#### 사례 2: 블로그 사이트

**요구사항:**
- 기사 페이지에 SEO 필요
- 기사 내용이 비교적 고정(게시 후 자주 변경되지 않음)
- 빠른 로딩 필요

**솔루션:**

```typescript
export default defineNuxtConfig({
  ssr: true,
  routeRules: {
    // 기사 페이지: SSG(고정 콘텐츠 + SEO 필요)
    '/articles/**': { prerender: true },

    // 홈페이지: SSG(고정 콘텐츠)
    '/': { prerender: true },

    // 관리자: CSR(SEO 불필요)
    '/admin/**': { ssr: false },
  },
});
```

---

## 4. 면접 핵심 정리

### 4.1 Nuxt 3의 Rendering Modes

**이렇게 답변할 수 있습니다:**

> Nuxt 3는 4가지 Rendering Modes를 지원합니다: SSR은 Server 측에서 각 요청 시 렌더링하며, SEO가 필요하고 동적 콘텐츠가 있는 페이지에 적합합니다. SSG는 빌드 시 HTML을 사전 생성하며, SEO가 필요하고 고정 콘텐츠인 페이지에 적합하고 성능이 가장 좋습니다. CSR은 브라우저 측에서 렌더링하며, SEO가 불필요하고 상호작용성이 높은 페이지에 적합합니다. Hybrid Rendering은 여러 모드를 혼합 사용하며, 페이지별 요구사항에 따라 적절한 모드를 선택합니다.

**핵심 포인트:**
- ✅ 4가지 모드의 특성과 차이점
- ✅ 적용 시나리오와 선택 고려사항
- ✅ Hybrid Rendering의 장점

### 4.2 Rendering Mode 선택 방법

**이렇게 답변할 수 있습니다:**

> Rendering Mode 선택은 주로 3가지 요소를 고려합니다: SEO 요구사항, 콘텐츠 동적성, 성능 요구. SEO가 필요한 페이지는 SSR 또는 SSG를 선택하고, 콘텐츠가 자주 변경되면 SSR, 고정 콘텐츠이면 SSG, SEO가 불필요한 페이지는 CSR을 선택할 수 있습니다. 실제 프로젝트에서는 보통 Hybrid Rendering을 사용하여 페이지별 특성에 따라 적절한 모드를 선택합니다. 예를 들어, 이커머스 플랫폼의 상품 페이지는 SSR(SEO + 동적 콘텐츠 필요), 회사 소개 페이지는 SSG(고정 콘텐츠), 사용자 개인 페이지는 CSR(SEO 불필요)을 사용합니다.

**핵심 포인트:**
- ✅ SEO 요구사항, 콘텐츠 동적성, 성능 요구에 따른 선택
- ✅ 실제 프로젝트에서 여러 모드의 혼합 사용
- ✅ 구체적인 사례 설명

### 4.3 ISR과 Route Rules
**Q: ISR(Incremental Static Regeneration)을 어떻게 구현하나요? Nuxt 3의 caching 메커니즘에는 어떤 것들이 있나요?**

> **답변 예시:**
> Nuxt 3에서는 `routeRules`를 통해 ISR을 구현할 수 있습니다.
> `nuxt.config.ts`에서 `{ swr: 초 }` 를 설정하면, Nitro가 자동으로 Stale-While-Revalidate 메커니즘을 활성화합니다.
> 예를 들어 `'/blog/**': { swr: 3600 }`은 해당 경로 하위 페이지가 1시간 동안 캐시됨을 의미합니다.
> `routeRules`는 매우 강력하여, 다른 경로에 다른 전략을 설정할 수 있습니다: SSR 페이지, SSG (`prerender: true`) 페이지, ISR (`swr`) 페이지, CSR (`ssr: false`) 페이지가 있으며, 이것이 Hybrid Rendering의 핵심입니다.

---

## 5. 모범 사례

### 5.1 선택 원칙

1. **SEO가 필요한 페이지**
   - 고정 콘텐츠 → SSG
   - 동적 콘텐츠 → SSR

2. **SEO가 필요 없는 페이지**
   - 높은 상호작용성 → CSR
   - Server 측 로직 필요 → SSR

3. **혼합 전략**
   - 페이지 특성에 따라 적절한 모드 선택
   - `routeRules`로 통합 관리

### 5.2 설정 권장사항

1. **기본적으로 SSR 사용**
   - SEO 친화적 보장
   - 이후 특정 페이지에 대해 조정 가능

2. **routeRules로 통합 관리**
   - 설정 집중화, 유지보수 용이
   - 각 페이지의 렌더링 모드를 명확히 표시

3. **정기적인 검토 및 최적화**
   - 실제 사용 상황에 따라 조정
   - 성능 지표 모니터링

---

## 6. 면접 요약

**이렇게 답변할 수 있습니다:**

> Nuxt 3는 4가지 Rendering Modes를 지원합니다: SSR, SSG, CSR, Hybrid Rendering. SSR은 SEO가 필요하고 동적 콘텐츠인 페이지에 적합하고, SSG는 SEO가 필요하고 고정 콘텐츠인 페이지에 적합하며 성능이 가장 좋고, CSR은 SEO가 불필요하고 상호작용성이 높은 페이지에 적합합니다. 선택 시 주로 SEO 요구사항, 콘텐츠 동적성, 성능 요구를 고려합니다. 실제 프로젝트에서는 보통 Hybrid Rendering을 사용하여 페이지별 특성에 따라 적절한 모드를 선택합니다. 예를 들어, 이커머스 플랫폼의 상품 페이지는 SSR, 회사 소개 페이지는 SSG, 사용자 개인 페이지는 CSR을 사용합니다.

**핵심 포인트:**
- ✅ 4가지 Rendering Modes의 특성과 차이점
- ✅ 선택 전략과 고려 요소
- ✅ Hybrid Rendering 구현 경험
- ✅ 실제 프로젝트 사례

---

## 7. Reference

- [Nuxt 3 Rendering Modes](https://nuxt.com/docs/guide/concepts/rendering)
- [Nuxt 3 Route Rules](https://nuxt.com/docs/api/nuxt-config#routerules)
