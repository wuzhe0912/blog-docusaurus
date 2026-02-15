---
id: performance-lv1-image-optimization
title: '[Lv1] 이미지 로딩 최적화: 4단계 Lazy Load'
slug: /experience/performance/lv1-image-optimization
tags: [Experience, Interview, Performance, Lv1]
---

> 4단계 이미지 Lazy Loading 전략을 통해 첫 화면 이미지 트래픽을 60MB에서 2MB로 줄이고, 로딩 시간을 85% 향상시켰습니다.

---

## 문제 배경 (Situation)

> 스마트폰으로 웹 페이지를 스크롤하는 상황을 상상해 보세요. 화면에는 10장의 이미지만 표시되지만, 웹 페이지가 한 번에 500장의 이미지 데이터를 전부 로드합니다. 스마트폰은 심하게 버벅거리고, 데이터도 순식간에 50MB가 소모됩니다.

**프로젝트의 실제 상황:**

```markdown
📊 특정 페이지 홈 통계
├─ 300+ 개 썸네일 (각 150-300KB)
├─ 50+ 개 프로모션 배너
└─ 전부 로드 시: 300 × 200KB = 60MB+ 이미지 데이터

❌ 실제 문제
├─ 첫 화면에 보이는 이미지는 8-12장
├─ 사용자가 30번째 이미지까지만 스크롤하고 떠날 수 있음
└─ 나머지 270장은 완전히 낭비 (트래픽 낭비 + 속도 저하)

📉 영향
├─ 최초 로딩 시간: 15-20초
├─ 트래픽 소비: 60MB+ (사용자 불만)
├─ 페이지 버벅거림: 스크롤 불편
└─ 이탈률: 42% (매우 높음)
```

## 최적화 목표 (Task)

1. **보이는 영역의 이미지만 로드**
2. **곧 뷰포트에 진입할 이미지 사전 로드** (50px 미리 로딩 시작)
3. **동시 로딩 수량 제어** (너무 많은 이미지 동시 로딩 방지)
4. **빠른 전환으로 인한 리소스 낭비 방지**
5. **첫 화면 이미지 트래픽 < 3MB**

## 솔루션 (Action)

### v-lazy-load.ts 구현

> 4단계 이미지 Lazy Load

#### 1단계: 뷰포트 가시성 감지 (IntersectionObserver)

```js
// 옵저버 생성, 이미지가 뷰포트에 진입하는지 감시
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 이미지가 가시 영역에 진입
        // 이미지 로딩 시작
      }
    });
  },
  {
    rootMargin: '50px 0px', // 50px 미리 로딩 시작 (사전 로딩)
    threshold: 0.1, // 10%만 보여도 트리거
  }
);
```

- 브라우저 네이티브 IntersectionObserver API 사용 (scroll 이벤트보다 성능이 훨씬 우수)
- rootMargin: "50px" → 이미지가 아직 아래쪽 50px에 있을 때 로딩 시작, 사용자가 스크롤했을 때 이미 준비 완료 (더 매끄러운 느낌)
- 뷰포트에 없는 이미지는 전혀 로딩하지 않음

#### 2단계: 동시 로딩 제어 메커니즘 (Queue 관리)

```js
class LazyLoadQueue {
  private loadingCount = 0
  private maxConcurrent = 6  // 동시 최대 6장 로딩
  private queue: (() => void)[] = []

  enqueue(loadFn: () => void) {
    if (this.loadingCount < this.maxConcurrent) {
      this.executeLoad(loadFn)  // 빈자리 있으면 바로 로딩
    } else {
      this.queue.push(loadFn)   // 빈자리 없으면 대기열에 추가
    }
  }
}
```

- 20장의 이미지가 동시에 뷰포트에 진입해도 6장만 동시 로딩
- "폭포수식 로딩"으로 인한 브라우저 차단 방지 (Chrome 기본 최대 동시 요청 6개)
- 로딩 완료 후 대기열의 다음 이미지 자동 처리

```md
사용자가 빠르게 하단까지 스크롤 → 30장 이미지 동시 트리거
대기열 관리 없음: 30개 요청 동시 발송 → 브라우저 버벅거림
대기열 관리 있음: 처음 6장 먼저 로딩 → 완료 후 다음 6장 → 매끄러움
```

#### 3단계: 리소스 경쟁 상태 해결 (버전 제어)

```js
// 로딩 시 버전 번호 설정
el.setAttribute('data-version', Date.now().toString());

// 로딩 완료 후 버전 검증
img.onload = () => {
  const currentVersion = img.getAttribute('data-version');
  if (loadVersion === currentVersion) {
    // 버전 일치, 이미지 표시
  } else {
    // 버전 불일치, 사용자가 이미 다른 콘텐츠로 전환, 표시하지 않음
  }
};
```

실제 사례:

```md
사용자 조작:

1. "뉴스" 카테고리 클릭 → 100장 이미지 로딩 트리거 (버전 1001)
2. 0.5초 후 "프로모션" 클릭 → 80장 이미지 로딩 트리거 (버전 1002)
3. 뉴스 이미지는 1초 후에야 로딩 완료

버전 제어 없음: 뉴스 이미지 표시 (오류!)
버전 제어 있음: 버전 불일치 확인, 뉴스 이미지 폐기 (정확!)
```

#### 4단계: 플레이스홀더 전략 (Base64 투명 이미지)

```js
// 기본으로 1×1 투명 SVG 표시, 레이아웃 이동 방지
el.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIi...';

// 실제 이미지 URL은 data-src에 저장
el.setAttribute('data-src', realImageUrl);
```

- Base64 인코딩된 투명 SVG 사용 (겨우 100 bytes)
- CLS(Cumulative Layout Shift, 누적 레이아웃 이동) 방지
- 사용자가 "이미지가 갑자기 나타나는" 현상을 보지 않음

## 최적화 성과 (Result)

**최적화 전:**

```markdown
첫 화면 이미지: 한 번에 300장 로딩 (60MB)
로딩 시간: 15-20초
스크롤 매끄러움: 심각하게 버벅거림
이탈률: 42%
```

**최적화 후:**

```markdown
첫 화면 이미지: 8-12장만 로딩 (2MB) ↓ 97%
로딩 시간: 2-3초 ↑ 85%
스크롤 매끄러움: 매끄러움 (60fps)
이탈률: 28% ↓ 33%
```

**구체적 수치:**

- 첫 화면 이미지 트래픽: **60 MB → 2 MB (97% 감소)**
- 이미지 로딩 시간: **15초 → 2초 (85% 향상)**
- 페이지 스크롤 FPS: **20-30에서 55-60으로 향상**
- 메모리 사용: **65% 감소** (미로딩 이미지는 메모리를 차지하지 않으므로)

**기술 지표:**

- IntersectionObserver 성능: 전통적인 scroll 이벤트보다 훨씬 우수 (CPU 사용률 80% 감소)
- 동시 로딩 제어 효과: 브라우저 요청 차단 방지
- 버전 제어 적중률: 99.5% (잘못된 이미지 거의 없음)

## 면접 포인트

**자주 묻는 확장 질문:**

1. **Q: 왜 `loading="lazy"` 속성을 직접 사용하지 않나요?**
   A: 네이티브 `loading="lazy"`에는 몇 가지 제한이 있습니다:

   - 사전 로딩 거리를 제어할 수 없음 (브라우저가 결정)
   - 동시 로딩 수량을 제어할 수 없음
   - 버전 제어를 처리할 수 없음 (빠른 전환 문제)
   - 구형 브라우저 미지원

   커스텀 directive는 더 세밀한 제어를 제공하며, 우리의 복잡한 시나리오에 적합합니다.

2. **Q: IntersectionObserver가 scroll 이벤트보다 어떤 점이 좋나요?**
   A:

   ```javascript
   // ❌ 전통적인 scroll 이벤트
   window.addEventListener('scroll', () => {
     // 매 스크롤마다 트리거 (초당 60회)
     // 요소 위치 계산 필요 (getBoundingClientRect)
     // 강제 reflow 발생 가능 (성능 킬러)
   });

   // ✅ IntersectionObserver
   const observer = new IntersectionObserver(callback);
   // 요소가 뷰포트에 출입할 때만 트리거
   // 브라우저 네이티브 최적화, 메인 스레드 차단 없음
   // 성능 80% 향상
   ```

3. **Q: 동시 로딩 6장 제한은 어디서 온 건가요?**
   A: 이는 브라우저의 **HTTP/1.1 동일 출처 동시 연결 제한**에 기반합니다:

   - Chrome/Firefox: 각 도메인당 최대 6개 동시 연결
   - 제한 초과 요청은 대기
   - HTTP/2는 더 많이 가능하지만, 호환성을 고려하여 6으로 제어
   - 실제 테스트: 6장 동시 로딩이 성능과 경험의 최적 균형점

4. **Q: 버전 제어에 타임스탬프를 사용하고 UUID를 쓰지 않는 이유는?**
   A:

   - 타임스탬프: `Date.now()` (간단하고 충분하며 정렬 가능)
   - UUID: `crypto.randomUUID()` (더 엄격하지만 과도한 설계)
   - 우리의 시나리오: 타임스탬프로 이미 충분히 고유 (밀리초 수준)
   - 성능 고려: 타임스탬프 생성이 더 빠름

5. **Q: 이미지 로딩 실패는 어떻게 처리하나요?**
   A: 다중 레이어 fallback을 구현했습니다:

   ```javascript
   img.onerror = () => {
     if (retryCount < 3) {
       // 1. 3회 재시도
       setTimeout(() => reload(), 1000 * retryCount);
     } else {
       // 2. 기본 이미지 표시
       img.src = '/images/game-placeholder.png';
     }
   };
   ```

6. **Q: CLS(누적 레이아웃 이동) 문제가 발생할 수 있나요?**
   A: 세 가지 전략으로 방지합니다:

   ```html
   <!-- 1. 기본 플레이스홀더 SVG -->
   <img src="data:image/svg+xml..." />

   <!-- 2. CSS aspect-ratio로 비율 고정 -->
   <img style="aspect-ratio: 16/9;" />

   <!-- 3. Skeleton Screen -->
   <div class="skeleton-box"></div>
   ```

   최종 CLS 점수: < 0.1 (우수)
