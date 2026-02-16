---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect와 Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. What is `useEffect`?

> `useEffect`란 무엇인가?

### 핵심 개념

`useEffect`는 React 함수형 컴포넌트에서 사이드 이펙트(side effects)를 관리하는 Hook입니다. 컴포넌트 렌더링 후 비동기 데이터 요청, 구독, DOM 조작, 수동 상태 동기화 등을 수행하며, class 컴포넌트의 `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` 등의 생명주기 메서드에 대응합니다.

### 일반적인 용도

- 원격 데이터를 가져와 컴포넌트 상태 업데이트
- 구독 또는 이벤트 리스너 관리 (예: `resize`, `scroll`)
- 브라우저 API와 상호작용 (예: `document.title` 업데이트, `localStorage` 조작)
- 이전 렌더링에서 남은 리소스 정리 (예: 요청 취소, 리스너 제거)

<details>
<summary>기본 사용 예제 펼치기</summary>

```javascript
import { useEffect, useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `클릭 횟수：${count}`;
  });

  return (
    <button type="button" onClick={() => setCount((prev) => prev + 1)}>
      클릭
    </button>
  );
}
```

</details>

## 2. When does `useEffect` run?

> `useEffect`는 언제 실행되는가?

`useEffect`의 두 번째 인자는 **의존성 배열(dependency array)**로, 사이드 이펙트의 실행 시점을 제어합니다. React는 배열의 각 값을 하나씩 비교하여 변경이 감지되면 사이드 이펙트를 다시 실행하고, 다음 실행 전에 정리 함수를 호출합니다.

### 2.1 일반적인 의존성 패턴

```javascript
// 1. 매 렌더링 후 실행 (첫 렌더링 포함)
useEffect(() => {
  console.log('어떤 state가 변경되어도 트리거됨');
});

// 2. 초기 렌더링 시 한 번만 실행
useEffect(() => {
  console.log('컴포넌트 mount 시에만 실행');
}, []);

// 3. 특정 의존성 변수 지정
useEffect(() => {
  console.log('selectedId가 변경될 때만 트리거됨');
}, [selectedId]);
```

### 2.2 정리 함수와 리소스 해제

```javascript
useEffect(() => {
  const handler = () => {
    console.log('리스닝 중');
  };

  window.addEventListener('resize', handler);

  return () => {
    window.removeEventListener('resize', handler);
    console.log('리스너 해제');
  };
}, []);
```

위 예제는 정리 함수를 활용하여 이벤트 리스너를 해제합니다. React는 컴포넌트 언마운트 또는 의존성 변수 업데이트 전에 먼저 정리 함수를 실행하여 메모리 누수와 중복 리스너를 방지합니다.

## 3. What is the difference between Real DOM and Virtual DOM?

> Real DOM과 Virtual DOM의 차이점은 무엇인가?

| 비교 항목 | Real DOM (실제 DOM)              | Virtual DOM (가상 DOM)           |
| --------- | -------------------------------- | -------------------------------- |
| 구조      | 브라우저가 관리하는 실제 노드    | JavaScript 객체로 기술된 노드    |
| 업데이트 비용 | 직접 조작 시 리플로우와 리페인트 발생, 비용 높음 | 먼저 차이를 계산한 후 일괄 적용, 비용 낮음 |
| 업데이트 전략 | 즉시 화면에 반영                | 메모리에서 새 트리를 생성한 후 차이 비교 |
| 확장성    | 업데이트 흐름을 수동으로 제어해야 함 | 중간 로직 삽입 가능 (Diff, 배치 처리) |

### React가 Virtual DOM을 채택한 이유

```javascript
// 간략한 흐름 설명 (실제 React 소스코드가 아님)
function renderWithVirtualDOM(newVNode, container) {
  const prevVNode = container.__vnode;
  const patches = diff(prevVNode, newVNode);
  applyPatches(container, patches);
  container.__vnode = newVNode;
}
```

Virtual DOM은 React가 먼저 메모리에서 Diff를 수행하여 최소한의 업데이트 목록을 얻은 후, 한 번에 Real DOM에 동기화할 수 있게 하여 빈번한 리플로우와 리페인트를 방지합니다.

## 4. How to coordinate `useEffect` and Virtual DOM?

> `useEffect`와 Virtual DOM은 어떻게 협력하는가?

React의 렌더링 흐름은 Render Phase와 Commit Phase로 나뉩니다. `useEffect`와 Virtual DOM의 핵심 협력 포인트는 사이드 이펙트가 Real DOM 업데이트 완료 후에야 실행된다는 점입니다.

### Render Phase (렌더 단계)

- React가 새로운 Virtual DOM을 생성하고, 이전 Virtual DOM과의 차이를 계산
- 이 단계는 순수 함수 연산으로, 중단되거나 다시 실행될 수 있음

### Commit Phase (커밋 단계)

- React가 차이를 Real DOM에 적용
- `useLayoutEffect`는 이 단계에서 동기적으로 실행되어 DOM이 업데이트된 것을 보장

### Effect Execution (사이드 이펙트 실행 시점)

- `useEffect`는 Commit Phase 종료 후, 브라우저 페인트 완료 후 실행
- 이를 통해 사이드 이펙트가 화면 업데이트를 차단하지 않아 사용자 경험이 향상

```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/profile', { signal: controller.signal })
    .then((res) => res.json())
    .then(setProfile)
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('로딩 실패', error);
      }
    });

  return () => {
    controller.abort(); // 의존성 변수 업데이트 또는 컴포넌트 언마운트 시 요청 취소 보장
  };
}, [userId]);
```

## 5. Quiz Time

> 퀴즈 시간
> 모의 면접 시나리오

### 문제: 다음 코드의 실행 순서를 설명하고 출력 결과를 작성하세요

```javascript
import { useEffect, useState } from 'react';

function Demo() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('effect 1');
    return () => {
      console.log('cleanup 1');
    };
  });

  useEffect(() => {
    console.log('effect 2');
  }, [visible]);

  return (
    <>
      <p>상태：{visible ? '표시' : '숨김'}</p>
      <button type="button" onClick={() => setVisible((prev) => !prev)}>
        전환
      </button>
    </>
  );
}
```

<details>
<summary>정답 보기</summary>

- 초기 렌더링 후 순서대로 `effect 1`, `effect 2`를 출력합니다. 첫 번째 `useEffect`는 의존성 배열이 없고, 두 번째 `useEffect`는 `visible`에 의존하며 초기값이 `false`여도 한 번은 실행됩니다.
- 전환 버튼 클릭 후 `setVisible`이 트리거되면, 다음 렌더링에서 먼저 이전 렌더링의 정리 함수를 실행하여 `cleanup 1`을 출력한 다음, 새로운 `effect 1`과 `effect 2`를 실행합니다.
- `visible`은 매번 전환 시 변경되므로, `effect 2`는 매 전환마다 다시 실행됩니다.

최종 출력 순서: `effect 1` → `effect 2` → (클릭 후) `cleanup 1` → `effect 1` → `effect 2`.

</details>

## 6. Best Practices

> 모범 사례

### 권장 사항

- 의존성 배열을 신중하게 관리하고, ESLint 규칙 `react-hooks/exhaustive-deps`를 활용하세요.
- 책임에 따라 여러 `useEffect`로 분리하여 대규모 사이드 이펙트로 인한 결합을 줄이세요.
- 정리 함수에서 리스너 해제 또는 비동기 요청 취소를 통해 메모리 누수를 방지하세요.
- DOM 업데이트 후 즉시 레이아웃 정보를 읽어야 할 때는 `useLayoutEffect`를 사용하되, 성능 영향을 평가하세요.

### 예제: 다른 책임으로 분리

```javascript
useEffect(() => {
  document.title = `현재 사용자：${user.name}`;
}, [user.name]); // document.title 관리

useEffect(() => {
  const subscription = chatClient.subscribe(roomId);
  return () => subscription.unsubscribe();
}, [roomId]); // 채팅방 연결 관리
```

## 7. Interview Summary

> 면접 요약

### 빠른 복습

1. `useEffect`는 의존성 배열로 실행 시점을 제어하며, 정리 함수는 리소스 해제를 담당합니다.
2. Virtual DOM은 Diff 알고리즘으로 최소 업데이트 집합을 찾아 Real DOM 조작 비용을 줄입니다.
3. Render Phase와 Commit Phase를 이해하면 사이드 이펙트와 렌더링 흐름의 관계를 정확히 답할 수 있습니다.
4. 면접에서는 배치 업데이트, 지연 로딩, memoization 등의 성능 향상 전략을 추가로 언급할 수 있습니다.

### 면접 답변 템플릿

> "React는 렌더링 시 먼저 Virtual DOM을 생성하고, 차이를 계산한 후 Commit Phase에 진입하여 Real DOM을 업데이트합니다. `useEffect`는 커밋 완료 후 브라우저 페인트 이후에 실행되므로, 비동기 요청이나 이벤트 리스너 처리에 적합합니다. 올바른 의존성 배열을 유지하고 정리 함수를 기억하면 메모리 누수와 경쟁 조건 문제를 피할 수 있습니다."

## Reference

> 참고 자료

- [React 공식 문서: Using the Effect Hook](https://react.dev/reference/react/useEffect)
- [React 공식 문서: Rendering](https://react.dev/learn/rendering)
- [React 공식 문서: Rendering Optimizations](https://react.dev/learn/escape-hatches#removing-effect-dependencies)
