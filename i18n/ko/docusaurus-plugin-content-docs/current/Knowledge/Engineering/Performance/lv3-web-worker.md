---
id: performance-lv3-web-worker
title: '[Lv3] Web Worker 활용: 백그라운드 연산으로 UI 블로킹 방지'
slug: /experience/performance/lv3-web-worker
tags: [Experience, Interview, Performance, Lv3]
---

> **Web Worker**는 브라우저의 백그라운드 스레드에서 JavaScript를 실행하는 API로, 시간이 많이 걸리는 연산을 수행하면서도 메인 스레드(UI 스레드)를 차단하지 않습니다.

## 핵심 개념

### 문제 배경

JavaScript는 원래 **단일 스레드**로, 모든 코드가 메인 스레드에서 실행됩니다:

```javascript
// ❌ 시간이 걸리는 연산이 메인 스레드를 차단
function heavyComputation() {
  for (let i = 0; i < 10000000000; i++) {
    // 복잡한 계산
  }
  return result;
}

// 실행 시 전체 페이지가 멈춤
const result = heavyComputation(); // UI 인터랙션 불가
```

**문제:**

- 페이지가 멈추고 사용자가 클릭이나 스크롤 불가
- 애니메이션 정지
- 사용자 경험 매우 나쁨

### Web Worker 솔루션

Web Worker는 **멀티 스레드** 기능을 제공하여 시간이 걸리는 작업을 백그라운드에서 실행합니다:

```javascript
// ✅ Worker로 백그라운드에서 실행
const worker = new Worker('worker.js');

// 메인 스레드 차단 없음, 페이지 인터랙션 가능
worker.postMessage({ data: largeData });

worker.onmessage = (e) => {
  console.log('백그라운드 연산 완료:', e.data);
};
```

---

## 시나리오 1: 대규모 데이터 처리

```javascript
// main.js
const worker = new Worker('worker.js');

// 대용량 JSON 데이터 처리
worker.postMessage({ data: largeDataArray, action: 'process' });

worker.onmessage = function (e) {
  console.log('처리 결과:', e.data);
};

// worker.js
self.onmessage = function (e) {
  const { data, action } = e.data;

  if (action === 'process') {
    // 시간이 걸리는 데이터 처리 실행
    const result = data.map((item) => {
      // 복잡한 연산
      return heavyComputation(item);
    });

    self.postMessage(result);
  }
};
```

## 시나리오 2: 이미지 처리

이미지 필터, 압축, 픽셀 조작 등을 처리하여 UI 멈춤을 방지합니다.

## 시나리오 3: 복잡한 계산

수학 연산(소수 계산, 암호화/복호화 등)
대용량 파일의 해시값 계산
데이터 분석 및 통계

## 사용 제한 및 주의사항

### Worker에서 할 수 없는 것

- DOM 직접 조작
- window, document, parent 객체 접근
- 일부 Web API 사용 (예: alert)

### Worker에서 사용 가능한 것

- XMLHttpRequest / Fetch API
- WebSocket
- IndexedDB
- 타이머 (setTimeout, setInterval)
- 일부 브라우저 API

```javascript
// Worker 사용이 적합하지 않은 경우
// 1. 간단하고 빠른 연산 (Worker 생성 자체에 오버헤드)
const result = 1 + 1; // Worker 불필요

// 2. 메인 스레드와 빈번한 통신 필요
// 통신 자체에 비용이 있어 멀티 스레드 이점을 상쇄할 수 있음

// Worker 사용이 적합한 경우
// 1. 단일 장시간 연산
const result = calculatePrimes(1000000);

// 2. 대량 데이터 배치 처리
const processed = largeArray.map(complexOperation);
```

---

## 실제 프로젝트 적용 사례

### 사례: 게임 데이터 암호화 처리

게임 플랫폼에서 민감한 데이터에 대한 암호화/복호화가 필요합니다:

```javascript
// main.js - 메인 스레드
const cryptoWorker = new Worker('/workers/crypto-worker.js');

// 플레이어 데이터 암호화
function encryptPlayerData(data) {
  return new Promise((resolve, reject) => {
    cryptoWorker.postMessage({
      action: 'encrypt',
      data: data,
      key: SECRET_KEY,
    });

    cryptoWorker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.encrypted);
      } else {
        reject(e.data.error);
      }
    };
  });
}

// 사용
const encrypted = await encryptPlayerData(sensitiveData);
// 페이지 버벅거림 없음, 사용자는 계속 조작 가능

// crypto-worker.js - Worker 스레드
self.onmessage = function (e) {
  const { action, data, key } = e.data;

  try {
    if (action === 'encrypt') {
      // 시간이 걸리는 암호화 연산
      const encrypted = performHeavyEncryption(data, key);
      self.postMessage({ success: true, encrypted });
    }
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
```

### 사례: 대량 게임 데이터 필터링

```javascript
// 3000+개 게임에서 복잡한 필터링 수행
const filterWorker = new Worker('/workers/game-filter.js');

// 필터 조건
const filters = {
  provider: ['PG', 'PP', 'EVO'],
  type: ['slot', 'live'],
  minRTP: 96.5,
  tags: ['popular', 'new'],
};

filterWorker.postMessage({
  games: allGames, // 3000+개
  filters: filters,
});

filterWorker.onmessage = (e) => {
  displayGames(e.data.filtered); // 필터링 결과 표시
};

// 메인 스레드 버벅거림 없음, 사용자는 계속 스크롤하고 클릭 가능
```

---

## 면접 포인트

### 자주 묻는 면접 질문

**Q1: Web Worker와 메인 스레드는 어떻게 통신하나요?**

A: `postMessage`와 `onmessage`를 통해:

```javascript
// 메인 스레드 → Worker
worker.postMessage({ type: 'START', data: [1, 2, 3] });

// Worker → 메인 스레드
self.postMessage({ type: 'RESULT', result: processedData });

// 주의: 데이터는 "구조화된 복제(Structured Clone)"됩니다
// 이는:
// ✅ 전달 가능: Number, String, Object, Array, Date, RegExp
// ❌ 전달 불가: Function, DOM 요소, Symbol
```

**Q2: Web Worker의 성능 오버헤드는 무엇인가요?**

A: 주로 두 가지 오버헤드:

```javascript
// 1. Worker 생성 오버헤드 (약 30-50ms)
const worker = new Worker('worker.js'); // 파일 로딩 필요

// 2. 통신 오버헤드 (데이터 복제)
worker.postMessage(largeData); // 대용량 데이터 복제 소요

// 해결 방안:
// 1. Worker 재사용 (매번 새로 생성하지 않음)
// 2. Transferable Objects 사용 (소유권 이전, 복제 없음)
const buffer = new ArrayBuffer(1024 * 1024); // 1MB
worker.postMessage(buffer, [buffer]); // 소유권 이전
```

**Q3: Transferable Objects란 무엇인가요?**

A: 데이터 소유권을 이전하며 복제하지 않음:

```javascript
// ❌ 일반 방법: 데이터 복제 (느림)
const largeArray = new Uint8Array(10000000); // 10MB
worker.postMessage(largeArray); // 10MB 복제 (소요 시간 있음)

// ✅ Transferable: 소유권 이전 (빠름)
const buffer = largeArray.buffer;
worker.postMessage(buffer, [buffer]); // 소유권 이전 (밀리초 수준)

// 주의: 이전 후 메인 스레드에서 해당 데이터 사용 불가
console.log(largeArray.length); // 0 (이전 완료)
```

**지원되는 Transferable 타입:**

- `ArrayBuffer`
- `MessagePort`
- `ImageBitmap`
- `OffscreenCanvas`

**Q4: 언제 Web Worker를 사용해야 하나요?**

A: 의사결정 트리:

```
시간이 걸리는 연산인가요 (> 50ms)?
├─ 아니오 → Worker 불필요
└─ 예 → 계속 판단
    │
    ├─ DOM 조작이 필요한가요?
    │   ├─ 예 → Worker 사용 불가 (requestIdleCallback 고려)
    │   └─ 아니오 → 계속 판단
    │
    └─ 통신 빈도가 매우 높은가요 (> 초당 60회)?
        ├─ 예 → 적합하지 않을 수 있음 (통신 오버헤드 큼)
        └─ 아니오 → ✅ Worker 사용 적합
```

**적합한 시나리오:**

- 암호화/복호화
- 이미지 처리 (필터, 압축)
- 대규모 데이터 정렬/필터링
- 복잡한 수학 연산
- 파일 파싱 (JSON, CSV)

**부적합한 시나리오:**

- 간단한 계산 (오버헤드가 이점보다 큼)
- 빈번한 통신 필요
- DOM 조작 필요
- 지원되지 않는 API 사용 필요

**Q5: Web Worker의 유형은 어떤 것이 있나요?**

A: 세 가지 유형:

```javascript
// 1. Dedicated Worker (전용)
const worker = new Worker('worker.js');
// 생성한 페이지와만 통신 가능

// 2. Shared Worker (공유)
const sharedWorker = new SharedWorker('shared-worker.js');
// 여러 페이지/탭에서 공유 가능

// 3. Service Worker (서비스)
navigator.serviceWorker.register('sw.js');
// 캐싱, 오프라인 지원, 푸시 알림에 사용
```

**비교:**

| 특성     | Dedicated  | Shared           | Service    |
| -------- | ---------- | ---------------- | ---------- |
| 공유성   | 단일 페이지 | 다중 페이지 공유  | 전체 사이트 공유 |
| 생명주기 | 페이지 닫힘과 함께 | 마지막 페이지 닫힐 때 | 페이지와 독립 |
| 주요 용도 | 백그라운드 연산 | 크로스 페이지 통신 | 캐싱, 오프라인 |

**Q6: Web Worker를 어떻게 디버깅하나요?**

A: Chrome DevTools 지원:

```javascript
// 1. Sources 패널에서 Worker 파일 확인 가능
// 2. 브레이크포인트 설정 가능
// 3. Console에서 코드 실행 가능

// 실용 팁: Worker에서 console 사용
self.addEventListener('message', (e) => {
  console.log('Worker received:', e.data);
  // DevTools Console에서 확인 가능
});

// 에러 처리
worker.onerror = (error) => {
  console.error('Worker error:', error.message);
  console.error('File:', error.filename);
  console.error('Line:', error.lineno);
};
```

---

## 성능 비교

### 실측 데이터 (100만 건 데이터 처리)

| 방법                 | 실행 시간 | UI 버벅거림 | 메모리 피크 |
| -------------------- | -------- | ----------- | ---------- |
| 메인 스레드 (동기)    | 2.5초    | 완전 멈춤   | 250 MB     |
| 메인 스레드 (Time Slicing) | 3.2초 | 가끔 버벅거림 | 280 MB   |
| Web Worker           | 2.3초    | 완전 매끄러움 | 180 MB    |

**결론:**

- Web Worker는 UI를 차단하지 않을 뿐 아니라, 멀티코어 병렬로 더 빠름
- 메모리 사용 더 적음 (메인 스레드에서 대량 데이터 유지 불필요)

---

## 관련 기술

### Web Worker vs 다른 방안

```javascript
// 1. setTimeout (의사 비동기)
setTimeout(() => heavyTask(), 0);
// ❌ 여전히 메인 스레드, 버벅거림 발생

// 2. requestIdleCallback (유휴 시간 실행)
requestIdleCallback(() => heavyTask());
// ⚠️ 유휴 시간에만 실행, 완료 시간 보장 없음

// 3. Web Worker (진정한 멀티 스레드)
worker.postMessage(task);
// ✅ 진정한 병렬, UI 차단 없음
```

### 고급: Comlink으로 Worker 통신 간소화

[Comlink](https://github.com/GoogleChromeLabs/comlink)은 Worker를 일반 함수처럼 사용할 수 있게 합니다:

```javascript
// 전통적 방법 (번거로움)
worker.postMessage({ action: 'add', a: 1, b: 2 });
worker.onmessage = (e) => console.log(e.data);

// Comlink 사용 (간결)
import * as Comlink from 'comlink';

const worker = new Worker('worker.js');
const api = Comlink.wrap(worker);

// 일반 함수 호출처럼 사용
const result = await api.add(1, 2);
console.log(result); // 3
```

---

## 학습 가이드

**면접 준비:**

1. "왜 Worker가 필요한지" 이해 (단일 스레드 문제)
2. "언제 사용하는지" 파악 (시간이 걸리는 연산)
3. "통신 메커니즘" 이해 (postMessage)
4. "제한 사항" 인식 (DOM 조작 불가)
5. 최소 하나의 Worker 사례 구현 경험

**실전 조언:**

- 간단한 사례부터 시작 (예: 소수 계산)
- Chrome DevTools로 디버깅
- 성능 차이 측정
- Comlink 등의 도구 고려

---

## 관련 주제

- [라우트 레벨 최적화 →](/docs/experience/performance/lv1-route-optimization)
- [이미지 로딩 최적화 →](/docs/experience/performance/lv1-image-optimization)
- [Virtual Scroll 구현 →](/docs/experience/performance/lv3-virtual-scroll)
- [대량 데이터 최적화 전략 →](/docs/experience/performance/lv3-large-data-optimization)
