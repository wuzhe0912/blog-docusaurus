---
id: performance-lv3-virtual-scroll
title: '[Lv3] Virtual Scroll 구현: 대량 데이터 렌더링 처리'
slug: /experience/performance/lv3-virtual-scroll
tags: [Experience, Interview, Performance, Lv3]
---

> 페이지에 1000건 이상의 데이터를 렌더링해야 할 때, Virtual Scroll은 DOM 노드를 1000+에서 20-30개로 줄이고, 메모리 사용을 80% 감소시킵니다.

---

## 면접 상황 문제

**Q: 화면에 테이블이 하나가 아니고, 각각 100건 이상의 데이터가 있으면서 동시에 빈번한 DOM 업데이트 이벤트가 있다면, 어떤 방법으로 이 페이지의 성능을 최적화하시겠습니까?**

---

## 문제 분석 (Situation)

### 실제 프로젝트 시나리오

플랫폼 프로젝트에서 대량 데이터를 처리해야 하는 페이지:

```markdown
📊 특정 거래 내역 페이지
├─ 충전 기록 테이블: 1000건 이상
├─ 출금 기록 테이블: 800건 이상
├─ 베팅 기록 테이블: 5000건 이상
└─ 각 기록 8-10개 필드 (시간, 금액, 상태 등)

❌ 미최적화 문제
├─ DOM 노드 수: 1000건 × 10필드 = 10,000개 이상 노드
├─ 메모리 점유: 약 150-200 MB
├─ 첫 렌더링 시간: 3-5초 (빈 화면)
├─ 스크롤 버벅거림: FPS < 20
└─ WebSocket 업데이트 시: 전체 테이블 리렌더링 (매우 느림)
```

### 문제 심각성

```javascript
// ❌ 전통적 방법
<tr v-for="record in allRecords">  // 1000건 이상 전부 렌더링
  <td>{{ record.time }}</td>
  <td>{{ record.amount }}</td>
  // ... 8-10개 필드
</tr>

// 결과:
// - 초기 렌더링: 10,000개 이상 DOM 노드
// - 사용자가 실제로 보는 것: 20-30건
// - 낭비: 99%의 노드를 사용자가 전혀 볼 수 없음
```

---

## 솔루션 (Action)

### Virtual Scrolling (가상 스크롤)

Virtual Scroll 최적화를 먼저 고려하면, 크게 두 가지 방향이 있습니다. 하나는 공식 지원 서드파티 패키지인 [vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)를 선택하여 파라미터와 요구사항에 따라 가시 범위의 row를 결정하는 것입니다.

```js
// 가시 영역의 row만 렌더링, 예:
// - 100건 데이터에서 가시적인 20건만 렌더링
// - DOM 노드 수를 대폭 감소
```

다른 하나는 직접 구현하는 것이지만, 실제 개발 비용과 커버해야 할 시나리오를 고려하면 공식 지원 서드파티 패키지를 채택하는 것이 더 나을 것 같습니다.

### 데이터 업데이트 빈도 제어

> 해결법 1: requestAnimationFrame (RAF)
> 개념: 브라우저는 초당 최대 60회 리페인트(60 FPS)하며, 더 빠르게 업데이트해도 사람의 눈으로 볼 수 없으므로 화면 주사율에 맞춰 업데이트

```js
// ❌ 기존: 데이터를 수신하면 즉시 업데이트 (초당 100회 가능)
socket.on('price', (newPrice) => {
  btcPrice.value = newPrice;
});

// ✅ 개선: 데이터를 모으고, 화면 주사율에 맞춰 한 번에 업데이트 (초당 최대 60회)
let latestPrice = null;
let isScheduled = false;

socket.on('price', (newPrice) => {
  latestPrice = newPrice; // 최신 가격 임시 저장

  if (!isScheduled) {
    isScheduled = true;
    requestAnimationFrame(() => {
      btcPrice.value = latestPrice; // 브라우저가 리페인트할 때 업데이트
      isScheduled = false;
    });
  }
});
```

해결법 2: Throttle (절류)
개념: 업데이트 빈도를 강제 제한, 예를 들어 "100ms당 최대 1회 업데이트"

```js
// lodash의 throttle (프로젝트에서 사용하는 경우)
import { throttle } from 'lodash-es';

const updatePrice = throttle((newPrice) => {
  btcPrice.value = newPrice;
}, 100); // 100ms당 최대 1회 실행

socket.on('price', updatePrice);
```

### Vue3 전용 최적화

Vue3의 일부 문법 설탕이 성능 최적화를 제공합니다. 예를 들어 v-memo이지만, 이 시나리오는 개인적으로 거의 사용하지 않습니다.

```js
// 1. v-memo - 자주 변하지 않는 열 메모이제이션
<tr v-for="row in data"
  :key="row.id"
  v-memo="[row.price, row.volume]">  // 이 필드가 변경될 때만 리렌더링
</tr>

// 2. 정적 데이터 동결, 반응성 오버헤드 방지
const staticData = Object.freeze(largeDataArray)

// 3. shallowRef로 대규모 배열 처리
const tableData = shallowRef([...])  // 배열 자체만 추적, 내부 객체는 추적하지 않음

// 4. key로 diff 알고리즘 최적화 (고유 id로 각 item 추적, DOM 업데이트를 변경된 노드로 한정)
<tr v-for="row in data" :key="row.id">  // 안정적인 key**
```

RAF: 화면 주사율에 맞춤 (약 16ms), 애니메이션, 스크롤에 적합
Throttle: 커스텀 간격 (예: 100ms), 검색, resize에 적합

### DOM 렌더링 최적화

```scss
// CSS transform 사용 (top/left 대신)
.row-update {
  transform: translateY(0); /* GPU 가속 트리거 */
  will-change: transform; /* 브라우저에 최적화 힌트 */
}

// CSS containment로 렌더링 범위 격리
.table-container {
  contain: layout style paint;
}
```

---

## 최적화 성과 (Result)

### 성능 비교

| 지표       | 최적화 전   | 최적화 후   | 개선 폭 |
| ---------- | ---------- | ---------- | -------- |
| DOM 노드 수 | 10,000+    | 20-30      | ↓ 99.7%  |
| 메모리 사용 | 150-200 MB | 30-40 MB   | ↓ 80%    |
| 첫 렌더링   | 3-5초      | 0.3-0.5초  | ↑ 90%    |
| 스크롤 FPS  | < 20       | 55-60      | ↑ 200%   |
| 업데이트 응답 | 500-800 ms | 16-33 ms   | ↑ 95%    |

### 실제 효과

```markdown
✅ Virtual Scroll
├─ 가시적인 20-30건만 렌더링
├─ 스크롤 시 가시 범위 동적 업데이트
├─ 사용자 인지 불가 (경험 매끄러움)
└─ 메모리 안정 (데이터량에 따라 증가하지 않음)

✅ RAF 데이터 업데이트
├─ WebSocket 초당 100회 업데이트 → 최대 60회 렌더링
├─ 화면 주사율과 동기화 (60 FPS)
└─ CPU 사용 60% 감소

✅ Vue3 최적화
├─ v-memo: 불필요한 리렌더링 방지
├─ shallowRef: 반응성 오버헤드 감소
└─ 안정적인 :key: diff 알고리즘 최적화
```

---

## 면접 포인트

### 자주 묻는 확장 질문

**Q: 서드파티 라이브러리를 사용할 수 없다면?**
A: Virtual Scroll의 핵심 로직을 직접 구현합니다:

```javascript
// 핵심 개념
const itemHeight = 50; // 각 행 높이
const containerHeight = 600; // 컨테이너 높이
const visibleCount = Math.ceil(containerHeight / itemHeight); // 가시 수량

// 현재 어떤 항목을 표시해야 하는지 계산
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// 가시 범위만 렌더링
const visibleItems = allItems.slice(startIndex, endIndex);

// padding으로 높이 보상 (스크롤바 올바르게 표시)
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

**핵심 포인트:**

- 가시 범위 계산 (startIndex → endIndex)
- 데이터 동적 로딩 (slice)
- 높이 보상 (padding top/bottom)
- 스크롤 이벤트 감시 (throttle 최적화)

**Q: WebSocket 연결 끊김 재연결은 어떻게 처리하나요?**
A: 지수 백오프 재연결 전략 구현:

```javascript
let retryCount = 0;
const maxRetries = 5;
const baseDelay = 1000; // 1초

function reconnect() {
  if (retryCount >= maxRetries) {
    showError('연결할 수 없습니다. 페이지를 새로고침해 주세요');
    return;
  }

  // 지수 백오프: 1s → 2s → 4s → 8s → 16s
  const delay = baseDelay * Math.pow(2, retryCount);

  setTimeout(() => {
    retryCount++;
    connectWebSocket();
  }, delay);
}

// 재연결 성공 시
socket.on('connect', () => {
  retryCount = 0; // 카운트 리셋
  syncData(); // 데이터 동기화
  showSuccess('연결이 복구되었습니다');
});
```

**Q: 성능 최적화 효과를 어떻게 테스트하나요?**
A: 여러 도구 조합:

```javascript
// 1. Performance API로 FPS 측정
let lastTime = performance.now();
let frames = 0;

function measureFPS() {
  frames++;
  const currentTime = performance.now();
  if (currentTime >= lastTime + 1000) {
    console.log(`FPS: ${frames}`);
    frames = 0;
    lastTime = currentTime;
  }
  requestAnimationFrame(measureFPS);
}

// 2. Memory Profiling (Chrome DevTools)
// - 렌더링 전 스냅샷
// - 렌더링 후 스냅샷
// - 메모리 차이 비교

// 3. Lighthouse / Performance Tab
// - Long Task 시간
// - Total Blocking Time
// - Cumulative Layout Shift

// 4. 자동화 테스트 (Playwright)
const { test } = require('@playwright/test');

test('virtual scroll performance', async ({ page }) => {
  await page.goto('/records');

  // 첫 렌더링 시간 측정
  const renderTime = await page.evaluate(() => {
    const start = performance.now();
    // 렌더링 트리거
    const end = performance.now();
    return end - start;
  });

  expect(renderTime).toBeLessThan(500); // < 500ms
});
```

**Q: Virtual Scroll의 단점은 무엇인가요?**
A: Trade-off 주의:

```markdown
❌ 단점
├─ 브라우저 네이티브 검색(Ctrl+F) 사용 불가
├─ "전체 선택" 기능 사용 불가 (특수 처리 필요)
├─ 구현 복잡도 높음
├─ 고정 높이 또는 사전 높이 계산 필요
└─ 접근성(Accessibility) 추가 처리 필요

✅ 적합 시나리오
├─ 데이터량 > 100건
├─ 각 데이터 구조 유사 (높이 고정)
├─ 고성능 스크롤 필요
└─ 조회 위주 (편집 아님)

❌ 부적합 시나리오
├─ 데이터량 < 50건 (과잉 설계)
├─ 높이 가변 (구현 어려움)
├─ 대량 인터랙션 필요 (다중 선택, 드래그 등)
└─ 전체 테이블 인쇄 필요
```

**Q: 높이가 일정하지 않은 목록은 어떻게 최적화하나요?**
A: 동적 높이 Virtual Scroll 사용:

```javascript
// 방안 1: 예상 높이 + 실제 측정
const estimatedHeight = 50; // 예상 높이
const measuredHeights = {}; // 실제 높이 기록

// 렌더링 후 측정
onMounted(() => {
  const elements = document.querySelectorAll('.list-item');
  elements.forEach((el, index) => {
    measuredHeights[index] = el.offsetHeight;
  });
});

// 방안 2: 동적 높이 지원 패키지 사용
// vue-virtual-scroller의 dynamic-height 지원
<DynamicScroller
  :items="items"
  :min-item-size="50"  // 최소 높이
  :buffer="200"        // 버퍼 영역
/>
```

---

## 기술 비교

### Virtual Scroll vs 페이징

| 비교 항목   | Virtual Scroll     | 전통적 페이징      |
| ---------- | ------------------ | ---------------- |
| 사용자 경험 | 연속 스크롤 (더 좋음) | 페이지 전환 필요 (중단) |
| 성능       | 항상 가시 범위만 렌더링 | 페이지당 전부 렌더링 |
| 구현 난이도 | 비교적 복잡         | 간단             |
| SEO 친화   | 낮음               | 높음             |
| 접근성     | 특수 처리 필요       | 네이티브 지원     |

**권장 사항:**

- 백오피스 시스템, Dashboard → Virtual Scroll
- 공개 웹사이트, 블로그 → 전통적 페이징
- 혼합 방안: Virtual Scroll + "더 보기" 버튼
