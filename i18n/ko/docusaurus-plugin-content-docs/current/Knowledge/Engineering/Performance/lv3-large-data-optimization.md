---
id: performance-lv3-large-data-optimization
title: '[Lv3] 대량 데이터 최적화 전략: 방안 선택 및 구현'
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> 화면에 수만 건의 데이터를 표시해야 할 때, 성능, 사용자 경험, 개발 비용 사이에서 어떻게 균형을 잡을 수 있을까요?

## 면접 상황 문제

**Q: 화면에 수만 건의 데이터가 있을 때, 어떻게 최적화해야 하나요?**

이것은 개방형 질문으로, 면접관이 기대하는 것은 단일 솔루션이 아니라:

1. **요구사항 평가**: 정말로 한 번에 이렇게 많은 데이터를 표시할 필요가 있나요?
2. **방안 선택**: 어떤 방안이 있나요? 각각의 장단점은?
3. **전체적 사고**: 프론트엔드 + 백엔드 + UX의 종합적 고려
4. **실제 경험**: 선택 이유와 구현 효과

---

## 첫 번째 단계: 요구사항 평가

기술 방안을 선택하기 전에, 스스로에게 다음 질문을 해보세요:

### 핵심 질문

```markdown
❓ 사용자가 정말로 모든 데이터를 봐야 하나요?
→ 대부분의 경우, 사용자는 처음 50-100건에만 관심이 있음
→ 필터링, 검색, 정렬을 통해 범위를 좁힐 수 있음

❓ 데이터가 실시간으로 업데이트되어야 하나요?
→ WebSocket 실시간 업데이트 vs 주기적 폴링 vs 최초 로드만

❓ 사용자의 조작 패턴은 무엇인가요?
→ 탐색 위주 → Virtual Scroll
→ 특정 데이터 검색 → 검색 + 페이징
→ 순차적 확인 → 무한 스크롤

❓ 데이터 구조가 고정인가요?
→ 높이 고정 → Virtual Scroll 구현 용이
→ 높이 가변 → 동적 높이 계산 필요

❓ 전체 선택, 인쇄, 내보내기가 필요한가요?
→ 필요 → Virtual Scroll에 제한이 있음
→ 불필요 → Virtual Scroll이 최적의 선택
```

### 실제 사례 분석

```javascript
// 사례 1: 거래 내역 (10,000건 이상)
사용자 행동: 최근 거래 확인, 가끔 특정 날짜 검색
최적 방안: 백엔드 페이징 + 검색

// 사례 2: 실시간 게임 목록 (3,000개 이상)
사용자 행동: 탐색, 카테고리 필터링, 매끄러운 스크롤
최적 방안: Virtual Scroll + 프론트엔드 필터링

// 사례 3: 소셜 피드 (무한 증가)
사용자 행동: 계속 아래로 스크롤, 페이지 이동 불필요
최적 방안: 무한 스크롤 + 배치 로딩

// 사례 4: 데이터 리포트 (복잡한 테이블)
사용자 행동: 조회, 정렬, 내보내기
최적 방안: 백엔드 페이징 + 내보내기 API
```

---

## 최적화 방안 총정리

### 방안 비교표

| 방안           | 적합 시나리오         | 장점                   | 단점                   | 구현 난이도 | 성능     |
| -------------- | -------------------- | ---------------------- | ---------------------- | -------- | -------- |
| **백엔드 페이징** | 대부분의 시나리오     | 간단하고 안정적, SEO 친화적 | 페이지 전환 필요, 경험 중단 | 1/5 간단 | 3/5 보통 |
| **Virtual Scroll** | 대량 고정 높이 데이터 | 극한 성능, 매끄러운 스크롤 | 구현 복잡, 네이티브 검색 불가 | 4/5 복잡 | 5/5 최상 |
| **무한 스크롤** | 소셜 미디어, 뉴스 피드 | 연속적 경험, 구현 간단   | 메모리 누적, 페이지 이동 불가 | 2/5 간단 | 3/5 보통 |
| **배치 로딩**   | 초기 로딩 최적화      | 점진적 로딩, Skeleton Screen과 호환 | 백엔드 협조 필요 | 2/5 간단 | 3/5 보통 |
| **Web Worker** | 대량 계산, 정렬, 필터링 | 메인 스레드 차단 없음   | 통신 오버헤드, 디버깅 어려움 | 3/5 보통 | 4/5 양호 |
| **혼합 방안**   | 복잡한 요구사항       | 여러 방안의 장점 결합   | 복잡도 높음             | 4/5 복잡 | 4/5 양호 |

---

## 방안 상세 설명

### 1. 백엔드 페이징 (Pagination) - 첫 번째 선택

> **추천도: 5/5 (강력 추천)**
> 가장 일반적이고 안정적인 방안으로, 80%의 시나리오에 적합

#### 구현 방식

```javascript
// 프론트엔드 요청
async function fetchData(page = 1, pageSize = 20) {
  const response = await fetch(`/api/data?page=${page}&pageSize=${pageSize}`);
  return response.json();
}

// 백엔드 API (Node.js + MongoDB 예시)
app.get('/api/data', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const skip = (page - 1) * pageSize;

  const data = await Collection.find().skip(skip).limit(pageSize).lean(); // 순수 객체만 반환, Mongoose 메서드 미포함

  const total = await Collection.countDocuments();

  res.json({
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});
```

#### 최적화 팁

```javascript
// 1. Cursor-based Pagination (커서 기반 페이징)
// 실시간 업데이트 데이터에 적합, 중복이나 누락 방지
const data = await Collection.find({ _id: { $gt: cursor } })
  .limit(20)
  .sort({ _id: 1 });

// 2. 인기 페이지 캐싱
const cacheKey = `data:page:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// 3. 필요한 필드만 반환
const data = await Collection.find()
  .select('id name price status') // 필요한 필드만 선택
  .skip(skip)
  .limit(pageSize);
```

#### 적합 시나리오

```markdown
✅ 적합
├─ 관리자 대시보드 (주문 목록, 사용자 목록)
├─ 데이터 조회 시스템 (거래 내역)
├─ 공개 웹사이트 (블로그, 뉴스)
└─ SEO가 필요한 페이지

❌ 부적합
├─ 매끄러운 스크롤 경험이 필요한 경우
├─ 실시간 업데이트 목록 (페이징이 점프할 수 있음)
└─ 소셜 미디어 류 애플리케이션
```

---

### 2. Virtual Scroll (가상 스크롤) - 극한 성능

> **추천도: 4/5 (추천)**
> 성능이 가장 우수하며, 대량 고정 높이 데이터에 적합

Virtual Scroll은 가시 영역만 렌더링하는 기술로, DOM 노드를 10,000+에서 20-30개로 줄이고, 메모리 사용을 80% 감소시킵니다.

#### 핵심 개념

```javascript
// 가시 범위의 데이터만 렌더링
const itemHeight = 50; // 각 항목 높이
const containerHeight = 600; // 컨테이너 높이
const visibleCount = Math.ceil(containerHeight / itemHeight); // 가시 수량 = 12

// 현재 어떤 항목을 표시해야 하는지 계산
const scrollTop = container.scrollTop;
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + visibleCount;

// 이 범위만 렌더링
const visibleItems = allItems.slice(startIndex, endIndex);

// padding으로 높이 보상 (스크롤바 올바르게 표시)
const paddingTop = startIndex * itemHeight;
const paddingBottom = (allItems.length - endIndex) * itemHeight;
```

#### 구현 방식

```vue
<!-- vue-virtual-scroller 사용 -->
<template>
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">{{ item.name }}</div>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const items = ref(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }))
);
</script>
```

#### 성능 비교

| 지표       | 전통적 렌더링 | Virtual Scroll | 개선 폭 |
| ---------- | ------------ | -------------- | -------- |
| DOM 노드 수 | 10,000+      | 20-30          | ↓ 99.7%  |
| 메모리 사용 | 150 MB       | 30 MB          | ↓ 80%    |
| 첫 렌더링   | 3-5초        | 0.3초          | ↑ 90%    |
| 스크롤 FPS  | < 20         | 55-60          | ↑ 200%   |

#### 상세 설명

**자세히 알아보기: [Virtual Scroll 완전 구현 →](/docs/experience/performance/lv3-virtual-scroll)**

---

### 3. 무한 스크롤 (Infinite Scroll) - 연속적 경험

> **추천도: 3/5 (고려 가능)**
> 소셜 미디어, 뉴스 피드 등 연속 탐색 시나리오에 적합

#### 구현 방식

```vue
<template>
  <div ref="scrollContainer" @scroll="handleScroll">
    <div v-for="item in displayedItems" :key="item.id">
      {{ item.name }}
    </div>
    <div v-if="loading" class="loading">로딩 중...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const displayedItems = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const hasMore = ref(true);

// 초기 로딩
onMounted(() => {
  loadMore();
});

// 추가 데이터 로딩
async function loadMore() {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  const { data, hasNext } = await fetchData(currentPage.value);
  displayedItems.value.push(...data);
  hasMore.value = hasNext;
  currentPage.value++;
  loading.value = false;
}

// 스크롤 감시
function handleScroll(e) {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  // 하단 100px 거리에서 로딩 트리거
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore();
  }
}
</script>
```

#### 최적화 팁

```javascript
// 1. IntersectionObserver 사용 (성능 우수)
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMore();
    }
  },
  { rootMargin: '100px' } // 100px 미리 트리거
);

// 마지막 요소 관찰
const lastItem = document.querySelector('.item:last-child');
observer.observe(lastItem);

// 2. Throttle 제어 (빠른 스크롤 시 다중 트리거 방지)
import { throttle } from 'lodash';
const handleScroll = throttle(checkAndLoadMore, 200);

// 3. 가상화 해제 (메모리 누적 방지)
// 데이터가 500건 초과 시 앞쪽 데이터 제거
if (displayedItems.value.length > 500) {
  displayedItems.value = displayedItems.value.slice(-500);
}
```

#### 적합 시나리오

```markdown
✅ 적합
├─ 소셜 미디어 피드 (Facebook, Twitter)
├─ 뉴스 목록, 기사 목록
├─ 상품 워터폴 레이아웃
└─ 연속 탐색이 주된 시나리오

❌ 부적합
├─ 특정 데이터 페이지 이동 필요
├─ 데이터 총량 표시 필요 (예: "총 10,000건")
└─ 상단으로 돌아가야 하는 시나리오 (너무 오래 스크롤하면 돌아가기 어려움)
```

---

### 4. 배치 로딩 (Progressive Loading)

> **추천도: 3/5 (고려 가능)**
> 점진적 로딩으로 첫 화면 경험 향상

#### 구현 방식

```javascript
// 배치 로딩 전략
async function loadDataInBatches() {
  const batchSize = 50;
  const totalBatches = Math.ceil(totalItems / batchSize);

  // 첫 배치: 즉시 로딩 (첫 화면 데이터)
  const firstBatch = await fetchBatch(0, batchSize);
  displayedItems.value = firstBatch;

  // 후속 배치: 지연 로딩
  for (let i = 1; i < totalBatches; i++) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms 간격
    const batch = await fetchBatch(i * batchSize, batchSize);
    displayedItems.value.push(...batch);
  }
}

// Skeleton Screen과 함께 사용
<template>
  <div v-if="loading">
    <SkeletonItem v-for="i in 10" :key="i" />
  </div>
  <div v-else>
    <Item v-for="item in items" :key="item.id" :data="item" />
  </div>
</template>
```

#### requestIdleCallback 사용

```javascript
// 브라우저 유휴 시간에 후속 데이터 로딩
function loadBatchWhenIdle(batch) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      displayedItems.value.push(...batch);
    });
  } else {
    // Fallback: setTimeout 사용
    setTimeout(() => {
      displayedItems.value.push(...batch);
    }, 0);
  }
}
```

---

### 5. Web Worker 처리 (Heavy Computation)

> **추천도: 4/5 (추천)**
> 대량 계산 시 메인 스레드 차단 없음

#### 적합 시나리오

```markdown
✅ 적합
├─ 대량 데이터 정렬 (10,000건 이상)
├─ 복잡한 필터링, 검색
├─ 데이터 형식 변환
└─ 통계 계산 (차트 데이터 처리 등)

❌ 부적합
├─ DOM 조작 필요 (Worker에서 접근 불가)
├─ 간단한 계산 (통신 오버헤드가 계산보다 큼)
└─ 즉시 피드백이 필요한 인터랙션
```

#### 구현 방식

```javascript
// worker.js
self.addEventListener('message', (e) => {
  const { data, keyword } = e.data;

  // Worker에서 대량 데이터 필터링 처리
  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase())
  );

  // 결과 반환
  self.postMessage(filtered);
});

// main.js
const worker = new Worker('/worker.js');

function searchData(keyword) {
  worker.postMessage({ data: allData, keyword });

  worker.onmessage = (e) => {
    displayedItems.value = e.data;
    console.log('필터링 완료, 메인 스레드 버벅거림 없음');
  };
}
```

**상세 설명: [Web Worker 활용 →](/docs/experience/performance/lv3-web-worker)**

---

### 6. 혼합 방안 (Hybrid Approach)

복잡한 시나리오에 대해 여러 방안을 결합합니다:

#### 방안 A: Virtual Scroll + 백엔드 페이징

```javascript
// 매번 백엔드에서 500건 데이터 획득
// 프론트엔드에서 Virtual Scroll로 렌더링
// 하단까지 스크롤 시 다음 500건 로딩

const pageSize = 500;
const currentBatch = ref([]);

async function loadNextBatch() {
  const data = await fetchData(currentPage.value, pageSize);
  currentBatch.value.push(...data);
  currentPage.value++;
}

// Virtual Scroll로 currentBatch 렌더링
```

#### 방안 B: 무한 스크롤 + 가상화 해제

```javascript
// 무한 스크롤로 데이터 로딩
// 데이터가 1000건 초과 시 앞쪽 데이터 제거

function loadMore() {
  // 추가 데이터 로딩
  items.value.push(...newItems);

  // 가상화 해제 (최신 1000건 유지)
  if (items.value.length > 1000) {
    items.value = items.value.slice(-1000);
  }
}
```

#### 방안 C: 검색 최적화 + Virtual Scroll

```javascript
// 검색 시 백엔드 API 사용
// 검색 결과를 Virtual Scroll로 렌더링

async function search(keyword) {
  if (keyword) {
    // 키워드 있음: 백엔드 검색 (퍼지 검색, 전문 검색 지원)
    searchResults.value = await apiSearch(keyword);
  } else {
    // 키워드 없음: 전체 표시 (Virtual Scroll)
    searchResults.value = allItems.value;
  }
}
```

---

## 의사결정 흐름도

```
시작: 수만 건 데이터 표시 필요
    ↓
Q1: 사용자가 모든 데이터를 볼 필요가 있나요?
    ├─ 아니오 → 백엔드 페이징 + 검색/필터링 ✅
    ↓
    예
    ↓
Q2: 데이터 높이가 고정인가요?
    ├─ 예 → Virtual Scroll ✅
    ├─ 아니오 → 동적 높이 Virtual Scroll (복잡) 또는 무한 스크롤 ✅
    ↓
Q3: 연속적 탐색 경험이 필요한가요?
    ├─ 예 → 무한 스크롤 ✅
    ├─ 아니오 → 백엔드 페이징 ✅
    ↓
Q4: 대량 계산 요구사항이 있나요 (정렬, 필터링)?
    ├─ 예 → Web Worker + Virtual Scroll ✅
    ├─ 아니오 → Virtual Scroll ✅
```

---

## 보조 최적화 전략

어떤 방안을 선택하든 다음 최적화를 함께 적용할 수 있습니다:

### 1. 데이터 업데이트 빈도 제어

```javascript
// RequestAnimationFrame (애니메이션, 스크롤에 적합)
let latestData = null;
let scheduled = false;

socket.on('update', (data) => {
  latestData = data;
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(() => {
      updateUI(latestData);
      scheduled = false;
    });
  }
});

// Throttle (검색, resize에 적합)
import { throttle } from 'lodash';
const handleSearch = throttle(performSearch, 300);
```

### 2. Skeleton Screen

```vue
<template>
  <div v-if="loading">
    <!-- 로딩 중 Skeleton Screen 표시 -->
    <div class="skeleton-item" v-for="i in 10" :key="i">
      <div class="skeleton-avatar"></div>
      <div class="skeleton-text"></div>
    </div>
  </div>
  <div v-else>
    <!-- 실제 데이터 -->
    <Item v-for="item in items" :key="item.id" />
  </div>
</template>

<style>
.skeleton-item {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
```

### 3. 인덱싱 및 캐싱

```javascript
// 프론트엔드 인덱스 구축 (검색 가속)
const indexedData = new Map();
data.forEach((item) => {
  indexedData.set(item.id, item);
});

// 빠른 조회
const item = indexedData.get(targetId); // O(1), O(n) 대신

// IndexedDB로 대량 데이터 캐싱
import { openDB } from 'idb';

const db = await openDB('myDB', 1, {
  upgrade(db) {
    db.createObjectStore('items', { keyPath: 'id' });
  },
});

// 데이터 저장
await db.put('items', item);

// 데이터 조회
const item = await db.get('items', id);
```

### 4. 백엔드 API 최적화

```javascript
// 1. 필요한 필드만 반환
GET /api/items?fields=id,name,price

// 2. 압축 사용 (gzip/brotli)
// Express에서 활성화
app.use(compression());

// 3. HTTP/2 Server Push
// 필요할 수 있는 데이터 사전 푸시

// 4. GraphQL (필요한 데이터 정확히 쿼리)
query {
  items(first: 20) {
    id
    name
    price
  }
}
```

---

## 성능 평가 지표

방안 선택 후, 다음 지표로 효과를 평가합니다:

### 기술 지표

```markdown
1. 첫 렌더링 시간 (FCP): < 1초
2. 인터랙션 가능 시간 (TTI): < 3초
3. 스크롤 FPS: > 50 (목표 60)
4. 메모리 사용: < 50 MB
5. DOM 노드 수: < 1000
```

### 사용자 경험 지표

```markdown
1. 이탈률: 20%+ 감소
2. 체류 시간: 30%+ 증가
3. 인터랙션 횟수: 40%+ 증가
4. 에러율: < 0.1%
```

### 측정 도구

```markdown
1. Chrome DevTools
   ├─ Performance: Long Task, FPS
   ├─ Memory: 메모리 사용
   └─ Network: 요청 수, 크기

2. Lighthouse
   ├─ Performance Score
   ├─ FCP / LCP / TTI
   └─ CLS

3. 커스텀 모니터링
   ├─ Performance API
   ├─ User Timing API
   └─ RUM (Real User Monitoring)
```

---

## 면접 답변 템플릿

### 구조화된 답변 (STAR 방법)

**면접관: 화면에 수만 건의 데이터가 있을 때, 어떻게 최적화하나요?**

**답변:**

> "좋은 질문입니다. 방안을 선택하기 전에 실제 요구사항을 먼저 평가하겠습니다:
>
> **1. 요구사항 분석 (30초)**
>
> - 사용자가 모든 데이터를 볼 필요가 있나요? 대부분의 경우 불필요
> - 데이터의 높이가 고정인가요? 기술 선택에 영향
> - 사용자의 주요 조작은 무엇인가요? 탐색, 검색, 특정 항목 찾기 중 어디에 해당
>
> **2. 방안 선택 (1분)**
>
> 시나리오별로 선택하겠습니다:
>
> - **일반 관리 대시보드** → 백엔드 페이징 (가장 간단하고 안정적)
> - **매끄러운 스크롤 필요** → Virtual Scroll (성능 최상)
> - **소셜 미디어 유형** → 무한 스크롤 (경험 최상)
> - **복잡한 계산 요구사항** → Web Worker + Virtual Scroll
>
> **3. 실제 사례 (1분)**
>
> 이전 프로젝트에서 3000+개 게임을 표시해야 하는 게임 목록 상황이 있었습니다.
> Virtual Scroll 방안을 선택하여 최종적으로:
>
> - DOM 노드 10,000+에서 20-30개로 (↓ 99.7%)
> - 메모리 사용 80% 감소 (150MB → 30MB)
> - 첫 렌더링 시간 3-5초에서 0.3초로
> - 스크롤 매끄러움 60 FPS 달성
>
> 프론트엔드 필터링, RAF 업데이트 제어, Skeleton Screen 등의 최적화와 함께 사용자 경험이 크게 향상되었습니다.
>
> **4. 보조 최적화 (30초)**
>
> 어떤 방안을 선택하든 함께 적용하는 것들:
>
> - 백엔드 API 최적화 (필요한 필드만 반환, 압축, 캐싱)
> - Skeleton Screen으로 로딩 경험 향상
> - Debounce/Throttle로 업데이트 빈도 제어
> - Lighthouse 등의 도구로 지속적 성능 모니터링"

### 자주 묻는 추가 질문

**Q: 서드파티 패키지를 사용할 수 없다면?**

A: Virtual Scroll의 핵심 원리는 복잡하지 않으며 직접 구현할 수 있습니다. 주요 작업은 가시 범위 계산(startIndex/endIndex), 데이터 동적 로딩(slice), padding으로 높이 보상입니다. 실제 프로젝트에서는 개발 비용을 평가하여, 일정이 허용하면 직접 구현하되, 성숙한 패키지를 우선 사용하여 함정을 피하는 것이 좋습니다.

**Q: Virtual Scroll의 단점은 무엇인가요?**

A: 주요 trade-off들:

1. 브라우저 네이티브 검색(Ctrl+F) 사용 불가
2. 전체 선택 기능 불가 (특수 처리 필요)
3. 구현 복잡도 높음
4. 접근성 기능에 추가 처리 필요

따라서 실제 요구사항을 기반으로 사용 가치가 있는지 평가해야 합니다.

**Q: 최적화 효과를 어떻게 테스트하나요?**

A: 여러 도구를 조합하여 사용합니다:

- Chrome DevTools Performance (Long Task, FPS)
- Lighthouse (전체 점수)
- 커스텀 성능 모니터링 (Performance API)
- 사용자 행동 추적 (이탈률, 체류 시간)

---

## 관련 노트

- [Virtual Scroll 완전 구현 →](/docs/experience/performance/lv3-virtual-scroll)
- [웹 성능 최적화 총정리 →](/docs/experience/performance)
- [Web Worker 활용 →](/docs/experience/performance/lv3-web-worker)

---

## 결론

"수만 건 데이터 최적화" 문제에 대해:

1. **먼저 요구사항을 평가**: 기술 선택을 서두르지 마세요
2. **다양한 방안을 이해**: 백엔드 페이징, Virtual Scroll, 무한 스크롤 등
3. **트레이드오프 고려**: 성능 vs 개발 비용 vs 사용자 경험
4. **지속적 최적화**: 모니터링 도구와 함께 지속적으로 개선
5. **데이터로 증명**: 실제 성능 데이터로 최적화 성과를 증명

기억하세요: **은탄환은 없으며, 현재 시나리오에 가장 적합한 방안만 있습니다**.
