---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Why Javascript need asynchronous ? And please explain callback and event loop

> JavaScript에 비동기가 필요한 이유는? 그리고 callback과 event loop를 설명해주세요

JavaScript는 본질적으로 싱글 스레드 언어입니다. 브라우저의 DOM 구조를 조작하는 것이 주요 역할 중 하나인데, 멀티 스레드로 같은 노드를 동시에 수정하면 상황이 매우 복잡해지므로 이를 피하기 위해 싱글 스레드를 채택했습니다.

비동기는 싱글 스레드라는 배경에서의 해결책입니다. 특정 동작이 2초의 대기가 필요할 때, 브라우저가 2초를 기다릴 수는 없으므로 모든 동기 작업을 먼저 실행하고, 비동기 작업은 task queue(작업 대기열)에 넣어둡니다.

브라우저가 동기 작업을 실행하는 환경은 call stack으로 이해할 수 있습니다. 브라우저는 먼저 call stack 내의 작업을 순서대로 실행하고, call stack이 비어있음을 감지하면 task queue에서 대기 중인 작업을 call stack으로 옮겨 순서대로 실행합니다.

1. 브라우저가 call stack이 비어있는지 확인 => 아니오 => call stack 내 작업 계속 실행
2. 브라우저가 call stack이 비어있는지 확인 => 예 => task queue에 대기 중인 작업이 있는지 확인 => 있음 => call stack으로 옮겨 실행

이렇게 끊임없이 반복되는 과정이 event loop의 개념입니다.

```js
console.log(1);

// 這個非同步的函式就是 callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// 依序印出 1 3 2
```

## 2. Why is setInterval not accurate in terms of timing ?

> 왜 `setInterval`의 타이밍은 정확하지 않은가?

1. JavaScript가 싱글 스레드 프로그래밍 언어이므로(한 번에 하나의 작업만 실행 가능, 다른 작업은 Queue에서 대기), setInterval의 callback 실행 시간이 설정된 간격을 초과하면 다음 callback 실행이 지연됩니다. 예를 들어 1초마다 함수를 실행하도록 설정했지만 함수 내에 2초 걸리는 작업이 있다면 다음 실행은 1초 지연됩니다. 누적되면 실행 타이밍이 점점 부정확해집니다.

2. 브라우저나 실행 환경의 제한도 있습니다. 현재 주요 브라우저(Chrome, Firefox, Safari 등)의 최소 간격 시간은 대략 4밀리초입니다. 1밀리초마다 실행하도록 설정해도 실제로는 4밀리초마다 실행됩니다.

3. 시스템이 메모리나 CPU를 많이 사용하는 작업을 실행할 때도 실행 시간 지연을 유발합니다. 영상 편집이나 이미지 처리 같은 작업 시 지연 가능성이 높아집니다.

4. JavaScript에는 Garbage Collection 메커니즘이 있어, setInterval 함수 내에서 대량의 객체를 생성하고 사용되지 않으면 GC에 의해 회수됩니다. 이 또한 실행 시간 지연의 원인이 됩니다.

### 대안

#### requestAnimationFrame

현재 `setInterval`을 애니메이션 구현 목적으로 사용하고 있다면, `requestAnimationFrame`으로 대체를 고려할 수 있습니다.

- 브라우저 리페인트와 동기화: 브라우저가 새 프레임을 그릴 준비가 되었을 때 실행됩니다. setInterval이나 setTimeout으로 타이밍을 추측하는 것보다 훨씬 정확합니다.
- 성능: 브라우저 리페인트와 동기화되므로 리페인트가 필요 없을 때는 실행되지 않습니다. 탭이 비활성화되거나 최소화될 때 특히 효과적입니다.
- 자동 스로틀링: 장치와 상황에 따라 실행 빈도를 자동 조절하며, 보통 초당 60프레임입니다.
- 고정밀 시간 매개변수: DOMHighResTimeStamp 타입의 마이크로초 정밀도 시간 매개변수를 받을 수 있어, 시간에 민감한 작업을 더 정확하게 제어할 수 있습니다.

##### Example

```js
let startPos = 0;

function moveElement(timestamp) {
  // update DOM position
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // 如果元素還沒有到達目的地，繼續動畫
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// start the animation
requestAnimationFrame(moveElement);
```

`moveElement()`은 각 프레임(보통 초당 60프레임)마다 요소의 위치를 업데이트하여 500 pixel에 도달할 때까지 계속합니다. 이 방법은 `setInterval`보다 더 부드럽고 자연스러운 애니메이션 효과를 구현합니다.
