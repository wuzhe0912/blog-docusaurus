---
title: '[Lv1] SEO 기초 구현: Router 모드와 Meta Tags'
slug: /experience/ssr-seo/lv1-seo-basic
tags: [Experience, Interview, SSR-SEO, Lv1]
---

> 멀티 브랜드 플랫폼 프로젝트에서 SEO 기초 설정 구현: Router History Mode, Meta Tags 구조, 정적 페이지 SEO.

---

## 1. 면접 답변 핵심

1. **Router 모드 선택**: Hash Mode 대신 History Mode를 사용하여 깔끔한 URL 구조 제공.
2. **Meta Tags 기초**: Open Graph와 Twitter Card를 포함한 완전한 SEO meta tags 구현.
3. **정적 페이지 SEO**: Landing Page에 완전한 SEO 요소 설정.

---

## 2. Router History Mode 설정

### 2.1 왜 History Mode를 선택하는가?

**파일 위치:** `quasar.config.js`

```javascript
// 82번째 줄
vueRouterMode: "history", // hash 모드 대신 history 모드 사용
```

**SEO 이점:**

| 모드             | URL 예시  | SEO 영향                     |
| ---------------- | --------- | ---------------------------- |
| **Hash Mode**    | `/#/home` | ❌ 검색 엔진이 인덱싱하기 어려움 |
| **History Mode** | `/home`   | ✅ 깔끔한 URL, 인덱싱 용이    |

**핵심 차이점:**

- History Mode는 깔끔한 URL 생성 (예: `/#/home` 대신 `/home`)
- 검색 엔진이 인덱싱 및 크롤링하기 더 쉬움
- 더 나은 사용자 경험과 공유 경험
- 백엔드 설정 필요 (404 오류 방지)

### 2.2 백엔드 설정 요구사항

History Mode 사용 시 백엔드 설정이 필요합니다:

```nginx
# Nginx 예시
location / {
  try_files $uri $uri/ /index.html;
}
```

이렇게 하면 모든 라우트가 `index.html`을 반환하고, 프론트엔드 Router가 처리합니다.

---

## 3. Meta Tags 기본 구조

### 3.1 기본 SEO Meta Tags

**파일 위치:** `template/*/public/landingPage/index.html`

```html
<!-- 기본 Meta Tags -->
<meta charset="UTF-8" />
<title>AMUSE VIP</title>
<meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
<meta
  name="description"
  content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
/>
```

**설명:**

- `title`: 페이지 제목, 검색 결과 표시에 영향
- `keywords`: 키워드 (현대 SEO에서 중요성은 낮지만 설정 권장)
- `description`: 페이지 설명, 검색 결과에 표시됨

### 3.2 Open Graph Tags (소셜 미디어 공유)

```html
<!-- Open Graph Tags -->
<meta property="og:site_name" content="AMUSE VIP" />
<meta property="og:title" content="AMUSE VIP" />
<meta property="og:type" content="website" />
<meta property="og:url" content="#" />
<meta property="og:description" content="..." />
<meta property="og:image" content="images/amuse.webp" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

**용도:**

- Facebook, LinkedIn 등 소셜 미디어 공유 시 표시되는 미리보기
- `og:image` 권장 크기: 1200x630px
- `og:type`은 `website`, `article` 등으로 설정 가능

### 3.3 Twitter Card Tags

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="AMUSE VIP" />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="images/amuse.webp" />
```

**Twitter Card 유형:**

- `summary`: 작은 카드
- `summary_large_image`: 큰 이미지 카드 (권장)

---

## 4. 정적 Landing Page SEO 구현

### 4.1 완전한 SEO 요소 목록

프로젝트의 Landing Page에서 다음 SEO 요소를 구현했습니다:

```html
✅ Title 태그 ✅ Keywords meta tag ✅ Description meta tag ✅ Open Graph
tags (Facebook, LinkedIn 등) ✅ Twitter Card tags ✅ Canonical URL ✅ Favicon
설정
```

### 4.2 구현 예시

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- 기본 SEO -->
    <title>AMUSE VIP</title>
    <meta name="keywords" content="カジノ,Jackpot,オンカジ,VIP" />
    <meta
      name="description"
      content="いつでもどこでも0秒反映。先着100名限定のVIP会員テストプログラムキャンペーン"
    />

    <!-- Open Graph -->
    <meta property="og:site_name" content="AMUSE VIP" />
    <meta property="og:title" content="AMUSE VIP" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://example.com" />
    <meta property="og:description" content="..." />
    <meta property="og:image" content="images/amuse.webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="AMUSE VIP" />
    <meta name="twitter:description" content="..." />
    <meta name="twitter:image" content="images/amuse.webp" />

    <!-- Canonical URL -->
    <link rel="canonical" href="https://example.com" />

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="favicon.png" />
  </head>
  <body>
    <!-- 페이지 콘텐츠 -->
  </body>
</html>
```

---

## 5. 면접 포인트 정리

### 5.1 Router 모드 선택

**왜 History Mode를 선택하는가?**

- 깔끔한 URL 제공으로 SEO 효과 향상
- 검색 엔진이 인덱싱하기 쉬움
- 더 나은 사용자 경험

**주의할 점은?**

- 백엔드 설정 지원 필요 (라우트 직접 접근 시 404 방지)
- fallback 메커니즘 설정 필요

### 5.2 Meta Tags의 중요성

**기본 Meta Tags:**

- `title`: 검색 결과 표시에 영향
- `description`: 클릭률에 영향
- `keywords`: 현대 SEO에서 중요성은 낮지만 설정 권장

**소셜 미디어 Meta Tags:**

- Open Graph: Facebook, LinkedIn 등 플랫폼 공유 미리보기
- Twitter Card: Twitter 공유 미리보기
- 이미지 크기 권장: 1200x630px

---

## 6. 모범 사례

1. **Title 태그**

   - 길이를 50-60자로 제어
   - 주요 키워드 포함
   - 각 페이지마다 고유한 title 설정

2. **Description**

   - 길이를 150-160자로 제어
   - 페이지 내용을 간결하게 설명
   - CTA(행동 유도) 포함

3. **Open Graph 이미지**

   - 크기: 1200x630px
   - 파일 크기: < 1MB
   - 고품질 이미지 사용

4. **Canonical URL**
   - 중복 콘텐츠 문제 방지
   - 주요 버전의 URL 지정

---

## 7. 면접 요약

**이렇게 답변할 수 있습니다:**

> 프로젝트에서 Vue Router의 Hash Mode 대신 History Mode를 선택했습니다. History Mode가 깔끔한 URL 구조를 제공하여 SEO에 더 유리하기 때문입니다. 동시에 Landing Page에 완전한 SEO meta tags를 구현했습니다. 기본 title, description, keywords와 함께 Open Graph 및 Twitter Card tags를 포함하여 소셜 미디어 공유 시 미리보기가 올바르게 표시되도록 했습니다.

**핵심 포인트:**

- ✅ Router History Mode 선택과 그 이유
- ✅ Meta Tags의 완전한 구조
- ✅ 소셜 미디어 공유 최적화
- ✅ 실제 프로젝트 경험
