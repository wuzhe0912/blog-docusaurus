---
title: '[Lv3] Nuxt 3 다국어 (i18n)와 SEO 모범 사례'
slug: /experience/ssr-seo/lv3-i18n-seo
tags: [Experience, Interview, SSR-SEO, Nuxt, Lv3, i18n]
---

> SSR 아키텍처에서 다국어(Internationalization)를 구현하는 것은 텍스트 번역뿐만 아니라, 라우팅 전략, SEO 태그(hreflang), 상태 관리, Hydration 일관성까지 관련됩니다.

---

## 1. 면접 답변 핵심

1.  **라우팅 전략**: `@nuxtjs/i18n`의 URL 접두사 전략(예: `/en/about`, `/jp/about`)을 사용하여 언어를 구분. 이것이 SEO에 가장 적합.
2.  **SEO 태그**: 정확한 `<link rel="alternate" hreflang="..." />`와 Canonical URL 자동 생성을 보장하여 중복 콘텐츠 페널티 방지.
3.  **상태 관리**: SSR 단계에서 사용자 언어를 정확히 감지(Cookie/Header)하고, Client 측 Hydration 시 언어가 일치하는지 확인.

---

## 2. Nuxt 3 i18n 구현 전략

### 2.1 왜 `@nuxtjs/i18n`을 선택하는가?

공식 모듈 `@nuxtjs/i18n`은 `vue-i18n` 기반으로, Nuxt에 최적화되어 있습니다. 수동으로 i18n을 구현할 때 자주 만나는 문제점들을 해결합니다:

- 언어 접두사가 포함된 라우트 자동 생성 (Auto-generated routes).
- SEO Meta Tags 자동 처리 (hreflang, og:locale).
- Lazy Loading 언어팩 지원 (Bundle Size 최적화).

### 2.2 설치 및 설정

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
    lazy: true, // Lazy Loading 활성화
    langDir: 'locales', // 언어 파일 디렉토리
    strategy: 'prefix_and_default', // 핵심 라우팅 전략
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // 루트 경로에서만 감지 후 리다이렉트
    },
  },
});
```

### 2.3 라우팅 전략 (Routing Strategy)

이것이 SEO의 핵심입니다. `@nuxtjs/i18n`은 여러 전략을 제공합니다:

1.  **prefix_except_default** (권장):

    - 기본 언어 (tw)는 접두사 없음: `example.com/about`
    - 다른 언어 (en)는 접두사 추가: `example.com/en/about`
    - 장점: URL이 깔끔하고 SEO 가중치 집중.

2.  **prefix_and_default**:

    - 모든 언어에 접두사: `example.com/tw/about`, `example.com/en/about`
    - 장점: 구조 통일, 리다이렉트 처리 용이.

3.  **no_prefix** (SEO에 비권장):
    - 모든 언어가 같은 URL, Cookie로 전환.
    - 단점: 검색 엔진이 다른 언어 버전을 인덱싱할 수 없음.

---

## 3. SEO 핵심 구현

### 3.1 hreflang 태그

검색 엔진은 "이 페이지에 어떤 언어 버전이 있는지" 알아야 합니다. `@nuxtjs/i18n`은 `<head>`에 자동 생성합니다:

```html
<link rel="alternate" href="https://example.com/about" hreflang="zh-TW" />
<link rel="alternate" href="https://example.com/en/about" hreflang="en-US" />
<link rel="alternate" href="https://example.com/about" hreflang="x-default" />
```

**주의:** `nuxt.config.ts`에서 `baseUrl`을 설정해야 합니다. 그렇지 않으면 hreflang이 상대 경로(무효)를 생성합니다.

```typescript
export default defineNuxtConfig({
  i18n: {
    baseUrl: 'https://example.com', // 반드시 설정!
  },
});
```

### 3.2 Canonical URL

각 언어 버전 페이지가 자신을 가리키는 Canonical URL을 갖도록 하여 중복 콘텐츠로 간주되는 것을 방지.

### 3.3 동적 콘텐츠 번역 (API)

백엔드 API도 다국어를 지원해야 합니다. 보통 요청 시 `Accept-Language` header를 추가합니다.

```typescript
// composables/useApi.ts
export const useApi = (url: string) => {
  const { locale } = useI18n();
  return useFetch(url, {
    headers: {
      'Accept-Language': locale.value, // 현재 언어를 백엔드에 전송
    },
  });
};
```

---

## 4. 일반적인 과제와 해결법

### 4.1 Hydration Mismatch

**문제:** Server 측에서 영어를 감지하여 영어 HTML 렌더링. Client 측 브라우저 기본이 중국어이고, Vue i18n이 중국어로 초기화되어 화면 깜박임이나 Hydration Error 발생.

**해결법:**

- `detectBrowserLanguage` 설정으로 Client 측 초기화 시 브라우저 설정이 아닌 URL 또는 Cookie 설정을 우선하도록 함.
- Server와 Client의 `defaultLocale` 설정이 일치하는지 확인.

### 4.2 언어 전환

수동으로 문자열을 조합하는 대신 `switchLocalePath`를 사용하여 링크 생성.

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

## 5. 면접 포인트 정리

### 5.1 i18n과 SEO

**Q: 다국어(i18n)를 SSR 환경에서 구현할 때 주의할 점은? SEO는 어떻게 처리하나요?**

> **답변 예시:**
> SSR 환경에서 i18n을 할 때 가장 중요한 것은 **SEO**와 **Hydration 일관성**입니다.
>
> **SEO** 관련:
>
> 1.  **URL 구조**: "서브패스" 전략(예: `/en/`, `/tw/`)을 사용하여 다른 언어에 독립적인 URL을 부여합니다. 이렇게 해야 검색 엔진이 인덱싱할 수 있습니다.
> 2.  **hreflang**: `<link rel="alternate" hreflang="..." />`를 올바르게 설정하여 Google에 이 페이지들이 동일 콘텐츠의 다른 언어 버전임을 알리고, 중복 콘텐츠 페널티를 방지합니다. 보통 `@nuxtjs/i18n` 모듈을 사용하여 이 태그를 자동 생성합니다.
>
> **Hydration** 관련:
> Server 측에서 렌더링하는 언어와 Client 측에서 초기화하는 언어가 일치하는지 확인합니다. URL 접두사 또는 Cookie에서 언어를 결정하고, API 요청 header에 해당 locale을 추가합니다.

### 5.2 라우팅과 상태

**Q: 언어 전환 기능을 어떻게 구현하나요?**

> **답변 예시:**
> `@nuxtjs/i18n`이 제공하는 `useSwitchLocalePath` composable을 사용합니다.
> 현재 라우트를 기반으로 해당 언어의 URL을 자동 생성하고(query parameters 유지), 라우트 접두사 변환을 처리합니다. 이렇게 하면 수동 문자열 조합의 오류를 방지할 수 있고, 언어 전환 시 사용자가 원래 페이지 콘텐츠에 머무르는 것도 보장됩니다.

---

## 6. Reference

- [Nuxt I18n Module](https://v8.i18n.nuxtjs.org/)
- [Google Search Central: Multi-regional and multilingual sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
