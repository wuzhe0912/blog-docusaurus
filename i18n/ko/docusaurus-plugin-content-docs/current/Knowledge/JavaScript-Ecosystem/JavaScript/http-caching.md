---
id: http-caching
title: '[Medium] 📄 HTTP Caching'
slug: /http-caching
tags: [JavaScript, HTTP, Quiz, Medium]
---

## 1. What is HTTP caching and why is it important?

> HTTP 캐시란 무엇인가? 왜 중요한가?

HTTP 캐시는 클라이언트(브라우저) 또는 중간 서버에 HTTP 응답을 임시로 저장하는 기술로, 후속 요청 시 캐시된 데이터를 직접 사용하여 서버에 다시 요청할 필요가 없게 합니다.

### 캐시 vs 임시 저장: 무엇이 다른가?

기술 문서에서 이 두 용어는 종종 혼용되지만, 실제로는 다른 의미를 가지고 있습니다.

#### Cache(캐시)

**정의**: **성능 최적화**를 위해 저장된 데이터의 사본으로, "재사용"과 "접근 속도 향상"을 강조합니다.

**특징**:

- ✅ 성능 향상이 목적
- ✅ 데이터를 반복적으로 사용 가능
- ✅ 명확한 만료 정책이 있음
- ✅ 일반적으로 원본 데이터의 사본

**예시**:

```javascript
// HTTP Cache - API 응답 캐시
Cache-Control: max-age=3600  // 1시간 캐시

// Memory Cache - 계산 결과 캐시
const cache = new Map();
function fibonacci(n) {
  if (cache.has(n)) return cache.get(n);  // 캐시 재사용
  const result = /* 계산 */;
  cache.set(n, result);
  return result;
}
```

#### Temporary Storage(임시 저장)

**정의**: **임시로 저장**되는 데이터로, "일시성"과 "삭제됨"을 강조합니다.

**특징**:

- ✅ 임시 보관이 목적
- ✅ 반드시 재사용되는 것은 아님
- ✅ 생명 주기가 일반적으로 짧음
- ✅ 중간 상태를 포함할 수 있음

**예시**:

```javascript
// sessionStorage - 사용자 입력 임시 저장
sessionStorage.setItem('formData', JSON.stringify(form)); // 탭을 닫으면 삭제

// 파일 업로드 임시 저장
const tempFile = await uploadToTemp(file); // 처리 후 삭제
await processFile(tempFile);
await deleteTempFile(tempFile);
```

#### 비교표

| 특성         | Cache(캐시)              | Temporary Storage(임시 저장) |
| ------------ | ------------------------ | ---------------------------- |
| **주요 목적** | 성능 최적화              | 임시 보관                    |
| **재사용**   | 예, 여러 번 읽기         | 반드시 그렇지는 않음         |
| **생명 주기** | 정책에 따라 결정         | 일반적으로 짧음              |
| **대표적 용도** | HTTP Cache, Memory Cache | sessionStorage, 임시 파일   |
| **영어 대응** | Cache                    | Temp / Temporary / Buffer    |

#### 실제 사용에서의 차이

```javascript
// ===== Cache(캐시)의 사용 시나리오 =====

// 1. HTTP 캐시: API 응답 재사용
fetch('/api/users') // 첫 번째 요청
  .then((response) => response.json());

fetch('/api/users') // 두 번째는 캐시에서 읽기
  .then((response) => response.json());

// 2. 계산 결과 캐시
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // 재사용
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// ===== Temporary Storage(임시 저장)의 사용 시나리오 =====

// 1. 폼 데이터 임시 저장(실수로 닫는 것 방지)
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('formDraft', JSON.stringify(formData));
});

// 2. 업로드 파일 임시 저장
async function handleUpload(file) {
  const tempPath = await uploadToTempStorage(file); // 임시 저장
  const processed = await processFile(tempPath);
  await deleteTempFile(tempPath); // 사용 후 삭제
  return processed;
}

// 3. 중간 계산 결과 임시 저장
const tempResults = []; // 중간 결과 임시 저장
for (const item of items) {
  tempResults.push(process(item));
}
const final = combine(tempResults); // 사용 후 더 이상 필요 없음
```

#### Web 개발에서의 응용

```javascript
// HTTP Cache(캐시) - 장기 저장, 반복 사용
Cache-Control: public, max-age=31536000, immutable
// → 브라우저가 이 파일을 1년간 캐시하고 반복 사용

// sessionStorage(임시 저장) - 임시 저장, 닫으면 삭제
sessionStorage.setItem('tempData', data);
// → 현재 탭에서만 유효, 닫으면 삭제

// localStorage(장기 저장) - 두 가지의 중간
localStorage.setItem('userPreferences', prefs);
// → 영구 저장이지만 성능 최적화를 위한 것은 아님
```

### 왜 이 두 개념을 구분하는 것이 중요한가?

1. **설계 결정**:

   - 성능 최적화가 필요한가? → 캐시 사용
   - 임시 보관이 필요한가? → 임시 저장 사용

2. **리소스 관리**:

   - 캐시: 적중률, 만료 정책에 주목
   - 임시 저장: 정리 시기, 용량 제한에 주목

3. **면접 답변**:

   - "성능을 어떻게 최적화하는가" → 캐시 전략에 대해 이야기
   - "임시 데이터를 어떻게 처리하는가" → 임시 저장 방법에 대해 이야기

이 글에서는 주로 **Cache(캐시)**, 특히 HTTP 캐시 메커니즘에 대해 설명합니다.

### 캐시의 장점

1. **네트워크 요청 감소**: 로컬 캐시에서 직접 읽어 HTTP 요청을 보낼 필요가 없음
2. **서버 부하 감소**: 서버가 처리해야 하는 요청 수를 줄임
3. **페이지 로딩 속도 향상**: 로컬 캐시 읽기 속도가 네트워크 요청보다 훨씬 빠름
4. **대역폭 절약**: 데이터 전송량 감소
5. **사용자 경험 개선**: 페이지 응답이 빨라지고 더 부드럽게 사용 가능

### 캐시의 종류

```text
┌─────────────────────────────────────┐
│        브라우저 캐시 계층             │
├─────────────────────────────────────┤
│  1. Memory Cache (메모리 캐시)       │
│     - 가장 빠름, 용량 작음           │
│     - 탭을 닫으면 삭제               │
├─────────────────────────────────────┤
│  2. Disk Cache (디스크 캐시)         │
│     - 더 느림, 용량 큼               │
│     - 영구 저장                      │
├─────────────────────────────────────┤
│  3. Service Worker Cache            │
│     - 개발자가 완전히 제어           │
│     - 오프라인 앱 지원               │
└─────────────────────────────────────┘
```

## 2. What are the HTTP caching strategies?

> HTTP 캐시 전략에는 어떤 것들이 있는가?

### 캐시 전략 분류

```text
HTTP 캐시 전략
├── 강력한 캐시 (Strong Cache)
│   ├── Cache-Control
│   └── Expires
└── 협상 캐시 (Negotiation Cache)
    ├── Last-Modified / If-Modified-Since
    └── ETag / If-None-Match
```

### 1. 강력한 캐시(Strong Cache / Fresh)

**특징**: 브라우저가 로컬 캐시에서 직접 읽으며, 서버에 요청을 보내지 않습니다.

#### Cache-Control(HTTP/1.1)

```http
Cache-Control: max-age=3600
```

**자주 사용되는 디렉티브**:

```javascript
// 1. max-age: 캐시 유효 시간(초)
Cache-Control: max-age=3600  // 1시간 캐시

// 2. no-cache: 서버 검증 필요(협상 캐시 사용)
Cache-Control: no-cache

// 3. no-store: 전혀 캐시하지 않음
Cache-Control: no-store

// 4. public: 어떤 캐시든 저장 가능(브라우저, CDN)
Cache-Control: public, max-age=31536000

// 5. private: 브라우저만 캐시 가능
Cache-Control: private, max-age=3600

// 6. immutable: 리소스가 절대 변하지 않음(hash 파일명과 함께 사용)
Cache-Control: public, max-age=31536000, immutable

// 7. must-revalidate: 만료 후 반드시 서버 검증 필요
Cache-Control: max-age=3600, must-revalidate
```

#### Expires(HTTP/1.0, 더 이상 사용되지 않음)

```http
Expires: Wed, 21 Oct 2025 07:28:00 GMT
```

**문제점**:

- 절대 시간을 사용하며, 클라이언트 시간에 의존
- 클라이언트 시간이 정확하지 않으면 캐시가 올바르게 작동하지 않음
- `Cache-Control`로 대체됨

### 2. 협상 캐시(Negotiation Cache / Validation)

**특징**: 브라우저가 서버에 요청을 보내 리소스가 업데이트되었는지 확인합니다.

#### Last-Modified / If-Modified-Since

```http
# 서버 응답(첫 번째 요청)
Last-Modified: Wed, 21 Oct 2024 07:28:00 GMT

# 브라우저 요청(후속 요청)
If-Modified-Since: Wed, 21 Oct 2024 07:28:00 GMT
```

**흐름**:

1. 첫 번째 요청: 서버가 `Last-Modified`를 반환
2. 후속 요청: 브라우저가 `If-Modified-Since`를 포함
3. 리소스 미변경: 서버가 `304 Not Modified`를 반환
4. 리소스 변경됨: 서버가 `200 OK`와 새 리소스를 반환

#### ETag / If-None-Match

```http
# 서버 응답(첫 번째 요청)
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"

# 브라우저 요청(후속 요청)
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**장점**:

- `Last-Modified`보다 더 정확
- 시간에 의존하지 않고 콘텐츠 hash 사용
- 초 이하의 변경도 감지 가능

### Last-Modified vs ETag

| 특성       | Last-Modified      | ETag                    |
| ---------- | ------------------ | ----------------------- |
| 정확도     | 초 단위            | 콘텐츠 hash, 더 정확    |
| 성능       | 더 빠름            | hash 계산 필요, 더 느림 |
| 적용 시나리오 | 일반 정적 리소스 | 정밀한 제어가 필요한 리소스 |
| 우선순위   | 낮음               | 높음(ETag 우선)         |

## 3. How does browser caching work?

> 브라우저 캐시의 동작 흐름은 무엇인가?

### 전체 캐시 흐름

```text
┌──────────────────────────────────────────────┐
│        브라우저 리소스 요청 흐름               │
└──────────────────────────────────────────────┘
                    ↓
         1. Memory Cache 확인
                    ↓
            ┌───────┴────────┐
            │   캐시 발견?    │
            └───────┬────────┘
                Yes │ No
                    ↓
         2. Disk Cache 확인
                    ↓
            ┌───────┴────────┐
            │   캐시 발견?    │
            └───────┬────────┘
                Yes │ No
                    ↓
         3. Service Worker 확인
                    ↓
            ┌───────┴────────┐
            │   캐시 발견?    │
            └───────┬────────┘
                Yes │ No
                    ↓
         4. 캐시 만료 여부 확인
                    ↓
            ┌───────┴────────┐
            │    만료됨?      │
            └───────┬────────┘
                Yes │ No
                    ↓
         5. 협상 캐시로 검증
                    ↓
            ┌───────┴────────┐
            │  리소스 변경?    │
            └───────┬────────┘
                Yes │ No (304)
                    ↓
         6. 서버에 새 리소스 요청
                    ↓
            ┌───────┴────────┐
            │  새 리소스 반환  │
            │  (200 OK)       │
            └────────────────┘
```

### 실제 예시

```javascript
// 첫 번째 요청
GET /api/data.json
Response:
  200 OK
  Cache-Control: max-age=3600
  ETag: "abc123"

  { data: "..." }

// ========== 1시간 이내 재요청 ==========
// 강력한 캐시: 로컬에서 직접 읽기, 요청 보내지 않음
// Status: 200 OK (from disk cache)

// ========== 1시간 후 재요청 ==========
// 협상 캐시: 검증 요청 전송
GET /api/data.json
If-None-Match: "abc123"

// 리소스 미변경
Response:
  304 Not Modified
  (body를 반환하지 않고 로컬 캐시 사용)

// 리소스 변경됨
Response:
  200 OK
  ETag: "def456"

  { data: "new data" }
```

## 4. What are the common caching strategies?

> 일반적인 캐시 전략에는 어떤 것들이 있는가?

### 1. 영구 캐시 전략(정적 리소스에 적용)

```javascript
// HTML: 캐시하지 않음, 매번 확인
Cache-Control: no-cache

// CSS/JS(hash 포함): 영구 캐시
Cache-Control: public, max-age=31536000, immutable
// 파일명: main.abc123.js
```

**원리**:

- HTML은 캐시하지 않아 사용자가 최신 버전을 받도록 보장
- CSS/JS는 hash 파일명을 사용하여 내용이 바뀌면 파일명도 변경
- 이전 버전은 사용되지 않고 새 버전이 다시 다운로드됨

### 2. 자주 업데이트되는 리소스 전략

```javascript
// API 데이터: 짧은 시간 캐시 + 협상 캐시
Cache-Control: max-age=60, must-revalidate
ETag: "abc123"
```

### 3. 이미지 리소스 전략

```javascript
// 사용자 아바타: 중기 캐시
Cache-Control: public, max-age=86400  // 1일

// 로고, 아이콘: 장기 캐시
Cache-Control: public, max-age=2592000  // 30일

// 동적 이미지: 협상 캐시
Cache-Control: no-cache
ETag: "image-hash"
```

### 4. 리소스 유형별 캐시 권장 사항

```javascript
const cachingStrategies = {
  // HTML 파일
  html: 'Cache-Control: no-cache',

  // hash 포함 정적 리소스
  staticWithHash: 'Cache-Control: public, max-age=31536000, immutable',

  // 자주 업데이트되지 않는 정적 리소스
  staticAssets: 'Cache-Control: public, max-age=2592000',

  // API 데이터
  apiData: 'Cache-Control: private, max-age=60',

  // 사용자별 데이터
  userData: 'Cache-Control: private, no-cache',

  // 민감한 데이터
  sensitive: 'Cache-Control: no-store',
};
```

## 5. Service Worker caching

> Service Worker 캐시

Service Worker는 가장 유연한 캐시 제어를 제공하며, 개발자가 캐시 로직을 완전히 제어할 수 있습니다.

### 기본 사용법

```javascript
// Service Worker 등록
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

```javascript
// sw.js - Service Worker 파일
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png',
];

// 설치 이벤트: 정적 리소스 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 요청 인터셉트: 캐시 전략 사용
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시 우선 전략
      return response || fetch(event.request);
    })
  );
});

// 업데이트 이벤트: 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### 자주 사용되는 캐시 전략

#### 1. Cache First(캐시 우선)

```javascript
// 적용: 정적 리소스
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

#### 2. Network First(네트워크 우선)

```javascript
// 적용: API 요청
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 캐시 업데이트
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // 네트워크 실패, 캐시 사용
        return caches.match(event.request);
      })
  );
});
```

#### 3. Stale While Revalidate(만료 후 재검증)

```javascript
// 적용: 빠른 응답이 필요하지만 업데이트도 유지해야 하는 리소스
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      // 캐시를 반환하고 백그라운드에서 업데이트
      return cachedResponse || fetchPromise;
    })
  );
});
```

## 6. How to implement cache busting?

> Cache Busting을 어떻게 구현하는가?

Cache Busting은 사용자가 최신 리소스를 가져오도록 보장하는 기술입니다.

### 방법 1: 파일명 Hash(권장)

```javascript
// Webpack/Vite 등 번들 도구 사용
// 출력: main.abc123.js

// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[contenthash].js',
  },
};
```

```html
<!-- 참조 자동 업데이트 -->
<script src="/js/main.abc123.js"></script>
```

**장점**:

- ✅ 파일명이 변경되어 새 파일 다운로드 강제
- ✅ 이전 버전은 캐시에 유지, 낭비 없음
- ✅ 모범 사례

### 방법 2: Query String 버전 번호

```html
<!-- 버전 번호 수동 업데이트 -->
<script src="/js/main.js?v=1.2.3"></script>
<link rel="stylesheet" href="/css/style.css?v=1.2.3" />
```

**단점**:

- ❌ 일부 CDN은 query string이 있는 리소스를 캐시하지 않음
- ❌ 버전 번호를 수동으로 관리해야 함

### 방법 3: 타임스탬프

```javascript
// 개발 환경에서 사용
const timestamp = Date.now();
const script = document.createElement('script');
script.src = `/js/main.js?t=${timestamp}`;
document.body.appendChild(script);
```

**용도**:

- 개발 환경에서 캐시 방지
- 프로덕션 환경에는 부적합(매번 새 요청)

## 7. Common caching interview questions

> 자주 나오는 캐시 면접 질문

### 질문 1: HTML이 캐시되지 않도록 하려면?

<details>
<summary>클릭하여 답변 보기</summary>

```http
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

또는 meta 태그 사용:

```html
<meta
  http-equiv="Cache-Control"
  content="no-cache, no-store, must-revalidate"
/>
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
```

</details>

### 질문 2: Last-Modified만 사용하지 않고 왜 ETag를 사용해야 하는가?

<details>
<summary>클릭하여 답변 보기</summary>

**ETag의 장점**:

1. **더 정확**: 초 이하의 변경도 감지 가능
2. **콘텐츠 기반**: 시간이 아닌 콘텐츠 hash에 기반
3. **시간 문제 방지**:
   - 파일 내용은 변경되지 않았지만 시간이 변경된 경우(재배포 등)
   - 주기적으로 동일한 내용으로 돌아오는 리소스
4. **분산 시스템**: 서로 다른 서버의 시간이 동기화되지 않을 수 있음

**예시**:

```javascript
// 파일 내용은 변경되지 않았지만 Last-Modified가 변경됨
// 2024-01-01 12:00 - 버전 A 배포(내용: abc)
// 2024-01-02 12:00 - 버전 A 재배포(내용: abc)
// Last-Modified는 변경되었지만 내용은 동일!

// ETag에는 이 문제가 없음
ETag: 'hash-of-abc'; // 항상 동일
```

</details>

### 질문 3: from disk cache와 from memory cache의 차이는?

<details>
<summary>클릭하여 답변 보기</summary>

| 특성       | Memory Cache       | Disk Cache    |
| ---------- | ------------------ | ------------- |
| 저장 위치  | 메모리(RAM)        | 하드 디스크   |
| 속도       | 매우 빠름          | 상대적으로 느림|
| 용량       | 작음(MB 수준)      | 큼(GB 수준)   |
| 지속성     | 탭을 닫으면 삭제   | 영구 저장     |
| 우선순위   | 높음(우선 사용)    | 낮음          |

**로딩 우선순위**:

```text
1. Memory Cache(가장 빠름)
2. Service Worker Cache
3. Disk Cache
4. HTTP Cache
5. 네트워크 요청(가장 느림)
```

**트리거 조건**:

- **Memory Cache**: 방금 접근한 리소스(페이지 새로고침 등)
- **Disk Cache**: 이전에 접근한 리소스 또는 파일 크기가 큰 리소스

</details>

### 질문 4: 브라우저에서 리소스를 강제로 다시 로드하려면?

<details>
<summary>클릭하여 답변 보기</summary>

**개발 단계**:

```javascript
// 1. Hard Reload(Ctrl/Cmd + Shift + R)
// 2. 캐시 삭제 후 다시 로드

// 3. 코드에 타임스탬프 추가
const script = document.createElement('script');
script.src = `/js/main.js?t=${Date.now()}`;
```

**프로덕션 환경**:

```javascript
// 1. 파일명 hash 사용(모범 사례)
main.abc123.js  // Webpack/Vite 자동 생성

// 2. 버전 번호 업데이트
<script src="/js/main.js?v=2.0.0"></script>

// 3. Cache-Control 설정
Cache-Control: no-cache  // 강제 검증
Cache-Control: no-store  // 전혀 캐시하지 않음
```

</details>

### 질문 5: PWA 오프라인 캐시는 어떻게 구현하는가?

<details>
<summary>클릭하여 답변 보기</summary>

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'pwa-v1';
const OFFLINE_URL = '/offline.html';

// 설치 시 오프라인 페이지 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/styles/offline.css',
        '/images/offline-icon.png',
      ]);
    })
  );
});

// 요청 인터셉트
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // 네트워크 실패, 오프라인 페이지 표시
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
```

**완전한 PWA 캐시 전략**:

```javascript
// 1. 정적 리소스 캐시
caches.addAll(['/css/', '/js/', '/images/']);

// 2. API 요청: Network First
// 3. 이미지: Cache First
// 4. HTML: Network First, 실패 시 오프라인 페이지 표시
```

</details>

## 8. Best practices

> 모범 사례

### ✅ 권장하는 방법

```javascript
// 1. HTML - 캐시하지 않음, 사용자가 최신 버전을 받도록 보장
// Response Headers:
Cache-Control: no-cache

// 2. CSS/JS(hash 포함) - 영구 캐시
// 파일명: main.abc123.js
Cache-Control: public, max-age=31536000, immutable

// 3. 이미지 - 장기 캐시
Cache-Control: public, max-age=2592000  // 30일

// 4. API 데이터 - 단기 캐시 + 협상 캐시
Cache-Control: private, max-age=60
ETag: "api-response-hash"

// 5. Service Worker를 사용하여 오프라인 지원 구현
```

### ❌ 피해야 할 방법

```javascript
// ❌ 나쁜 예: HTML에 장기 캐시 설정
Cache-Control: max-age=31536000  // 사용자가 이전 버전을 볼 수 있음

// ❌ 나쁜 예: Cache-Control 대신 Expires 사용
Expires: Wed, 21 Oct 2025 07:28:00 GMT  // HTTP/1.0, 더 이상 사용되지 않음

// ❌ 나쁜 예: 캐시를 전혀 설정하지 않음
// 캐시 헤더가 없으면 브라우저 동작이 불확실

// ❌ 나쁜 예: 모든 리소스에 동일한 전략 사용
Cache-Control: max-age=3600  // 리소스 유형에 따라 조정해야 함
```

### 캐시 전략 결정 트리

```text
정적 리소스인가?
├─ 예 → 파일명에 hash가 있는가?
│      ├─ 예 → 영구 캐시(max-age=31536000, immutable)
│      └─ 아니오 → 중장기 캐시(max-age=2592000)
└─ 아니오 → HTML인가?
           ├─ 예 → 캐시하지 않음(no-cache)
           └─ 아니오 → API인가?
                  ├─ 예 → 단기 캐시 + 협상(max-age=60, ETag)
                  └─ 아니오 → 업데이트 빈도에 따라 결정
```

## Reference

- [MDN - HTTP Caching](https://developer.mozilla.org/ko/docs/Web/HTTP/Caching)
- [Google - HTTP Caching](https://web.dev/http-cache/)
- [MDN - Cache-Control](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control)
- [Service Worker API](https://developer.mozilla.org/ko/docs/Web/API/Service_Worker_API)
- [Workbox - Service Worker Library](https://developers.google.com/web/tools/workbox)
