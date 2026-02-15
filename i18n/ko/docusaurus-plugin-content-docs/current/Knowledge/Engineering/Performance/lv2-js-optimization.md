---
id: performance-lv2-js-optimization
title: '[Lv2] JavaScript 연산 성능 최적화: Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Debounce, Throttle, Time Slicing, requestAnimationFrame 등의 기술을 통해 JavaScript 연산 성능을 최적화하고 사용자 경험을 향상시킵니다.

---

## 문제 배경

플랫폼 프로젝트에서 사용자가 빈번하게 수행하는 작업:

- **검색** (키워드 입력 시 3000+개 제품 실시간 필터링)
- **목록 스크롤** (스크롤 시 위치 추적, 추가 로딩)
- **카테고리 전환** (특정 유형의 제품 필터링 표시)
- **애니메이션 효과** (부드러운 스크롤, 선물 이펙트)

이러한 작업을 최적화하지 않으면 페이지 버벅거림과 CPU 점유율 과다가 발생합니다.

---

## 전략 1: Debounce (방어적 지연) - 검색 입력 최적화

```javascript
import { useDebounceFn } from '@vueuse/core';

// Debounce 함수: 500ms 내 재입력 시 타이머 재시작
const debounceKeyword = useDebounceFn((keyword) => {
  searchGameKeyword(gameState.list, keyword.toLowerCase());
}, 500);

watch(
  () => searchState.keyword,
  (newValue) => {
    debounceKeyword(newValue); // 입력을 멈춘 후 500ms 뒤에만 실행
  }
);
```

```md
최적화 전: "slot game" 입력 (9자)

- 9회 검색 트리거
- 3000개 게임 필터 × 9회 = 27,000회 연산
- 소요 시간: 약 1.8초 (페이지 버벅거림)

최적화 후: "slot game" 입력

- 1회 검색 트리거 (입력 멈춘 후)
- 3000개 게임 필터 × 1회 = 3,000회 연산
- 소요 시간: 약 0.2초
- 성능 향상: 90%
```

## 전략 2: Throttle (절류) - 스크롤 이벤트 최적화

> 적용 시나리오: 스크롤 위치 추적, 무한 스크롤 로딩

```javascript
import { throttle } from 'lodash';

// Throttle 함수: 100ms 내 1회만 실행
const handleScroll = throttle(() => {
  scrollTop.value = document.documentElement.scrollTop;
}, 100);

window.addEventListener('scroll', handleScroll);
```

```md
최적화 전:

- 스크롤 이벤트 초당 60회 트리거 (60 FPS)
- 매번 스크롤 위치 계산
- 소요 시간: 약 600ms (페이지 버벅거림)

최적화 후:

- 스크롤 이벤트 초당 최대 1회 (100ms 내 1회만 실행)
- 소요 시간: 약 100ms
- 성능 향상: 90%
```

## 전략 3: Time Slicing (시간 분할) - 대량 데이터 처리

> 적용 시나리오: 태그 클라우드, 메뉴 조합, 3000+개 게임 필터링, 금융 거래 내역 렌더링

```javascript
// 커스텀 Time Slicing 함수
function processInBatches(
  array: GameList, // 3000개 게임
  batchSize: number, // 배치당 200개 처리
  callback: Function
) {
  let index = 0;

  function processNextBatch() {
    if (index >= array.length) return; // 처리 완료

    const batch = array.slice(index, index + batchSize); // 분할
    callback(batch); // 이 배치 처리
    index += batchSize;

    setTimeout(processNextBatch, 0); // 다음 배치를 마이크로태스크 큐에 추가
  }

  processNextBatch();
}
```

사용 예시:

```javascript
function searchGameKeyword(games: GameList, keyword: string) {
  searchState.gameList.length = 0;

  // 3000개 게임을 15배치로 분할, 배치당 200개
  processInBatches(games, 200, (batch) => {
    const filteredBatch = batch.filter((game) =>
      game.game_name.toLowerCase().includes(keyword)
    );
    searchState.gameList.push(...filteredBatch);
  });
}
```

## 전략 4: requestAnimationFrame - 애니메이션 최적화

> 적용 시나리오: 부드러운 스크롤, Canvas 애니메이션, 선물 이펙트

```javascript
const scrollToTopAnimated = (el: any, speed = 500) => {
  const startPosition = el.scrollTop;
  const duration = speed;
  let startTime = null;

  // Easing Function (감속 함수) 사용
  const easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(
      timeElapsed,
      startPosition,
      -startPosition,
      duration
    );
    el.scrollTop = run;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll); // 재귀 호출
    }
  };

  requestAnimationFrame(animateScroll);
};
```

왜 requestAnimationFrame을 사용하나요?

```javascript
// 잘못된 방법: setInterval 사용
setInterval(() => {
  el.scrollTop += 10;
}, 16); // 60fps 목표 (1000ms / 60 ≈ 16ms)
// 문제:
// 1. 브라우저 리페인트와 동기화되지 않음 (리페인트 사이에 여러 번 실행 가능)
// 2. 백그라운드 탭에서도 실행 (리소스 낭비)
// 3. 프레임 드롭(Jank) 발생 가능

// 올바른 방법: requestAnimationFrame 사용
requestAnimationFrame(animateScroll);
// 장점:
// 1. 브라우저 리페인트와 동기화 (60fps 또는 120fps)
// 2. 탭이 보이지 않을 때 자동 일시정지 (절전)
// 3. 더 매끄럽고, 프레임 드롭 없음
```

---

## 면접 포인트

### Debounce vs Throttle

| 특성     | Debounce                       | Throttle                        |
| -------- | ------------------------------ | ------------------------------- |
| 트리거 시점 | 조작을 멈춘 후 일정 시간 대기 | 고정 시간 간격 내 1회만 실행     |
| 적용 시나리오 | 검색 입력, 윈도우 resize       | 스크롤 이벤트, 마우스 이동       |
| 실행 횟수 | 미실행 가능 (지속 트리거 시)   | 실행 보장 (고정 빈도)           |
| 지연     | 지연 있음 (멈춤 대기)          | 즉시 실행, 이후 제한             |

### Time Slicing vs Web Worker

| 특성         | Time Slicing                   | Web Worker                      |
| ------------ | ------------------------------ | ------------------------------- |
| 실행 환경    | 메인 스레드                    | 백그라운드 스레드               |
| 적용 시나리오 | DOM 조작이 필요한 작업         | 순수 계산 작업                   |
| 구현 복잡도  | 비교적 간단                    | 비교적 복잡 (통신 필요)          |
| 성능 향상    | 메인 스레드 차단 방지          | 진정한 병렬 연산                 |

### 자주 묻는 면접 질문

**Q: Debounce와 Throttle은 어떻게 선택하나요?**

A: 사용 시나리오에 따라:

- **Debounce**: "사용자가 조작을 완료하기를 기다리는" 시나리오에 적합 (예: 검색 입력)
- **Throttle**: "지속적으로 업데이트해야 하지만 너무 빈번할 필요 없는" 시나리오에 적합 (예: 스크롤 추적)

**Q: Time Slicing과 Web Worker는 어떻게 선택하나요?**

A:

- **Time Slicing**: DOM 조작이 필요하거나 간단한 데이터 처리
- **Web Worker**: 순수 계산, 대량 데이터 처리, DOM 조작이 불필요한 경우

**Q: requestAnimationFrame의 장점은 무엇인가요?**

A:

1. 브라우저 리페인트와 동기화 (60fps)
2. 탭이 보이지 않을 때 자동 일시정지 (절전)
3. 프레임 드롭(Jank) 방지
4. setInterval/setTimeout보다 성능 우수
