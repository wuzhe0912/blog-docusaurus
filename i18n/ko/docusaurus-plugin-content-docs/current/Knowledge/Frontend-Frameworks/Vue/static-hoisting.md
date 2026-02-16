---
id: static-hoisting
title: '[Medium] Vue3 정적 호이스팅'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> Vue3의 정적 호이스팅이란 무엇인가?

Vue3에서 **정적 호이스팅(Static Hoisting)**은 컴파일 단계의 최적화 기법입니다.

### 정의

**정적 호이스팅**은 Vue 3 컴파일러가 template을 컴파일할 때, reactive 상태에 전혀 의존하지 않고 절대 변하지 않는 노드를 분석하여 파일 상단의 상수로 추출합니다. 이 노드들은 초기 렌더링 시 한 번만 생성되고, 이후 재렌더링 시에는 직접 재사용되어 VNode 생성 및 diff 비용을 줄일 수 있습니다.

### 동작 원리

컴파일러는 template을 분석하여, reactive 상태에 전혀 의존하지 않고 절대 변하지 않는 노드를 추출해 파일 상단의 상수로 만듭니다. 초기 렌더링 시 한 번만 생성하고, 이후 재렌더링 시에는 직접 재사용합니다.

### 컴파일 전후 비교

**컴파일 전 Template**:

<details>
<summary>Template 예제 펼치기</summary>

```vue
<template>
  <div>
    <h1>정적 제목</h1>
    <p>정적 콘텐츠</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

</details>

**컴파일 후 JavaScript** (간략 버전):

<details>
<summary>컴파일 후 JavaScript 예제 펼치기</summary>

```js
// 정적 노드가 상단으로 호이스팅되어 한 번만 생성
const _hoisted_1 = /*#__PURE__*/ h('h1', null, '정적 제목');
const _hoisted_2 = /*#__PURE__*/ h('p', null, '정적 콘텐츠');

function render() {
  return h('div', null, [
    _hoisted_1, // 직접 재사용, 재생성 불필요
    _hoisted_2, // 직접 재사용, 재생성 불필요
    h('div', null, dynamicContent.value), // 동적 콘텐츠는 재생성 필요
  ]);
}
```

</details>

### 장점

1. **VNode 생성 비용 감소**: 정적 노드는 한 번만 생성, 이후 직접 재사용
2. **diff 비용 감소**: 정적 노드는 diff 비교에 참여하지 않음
3. **렌더링 성능 향상**: 특히 대량의 정적 콘텐츠가 있는 컴포넌트에서 효과가 뚜렷
4. **자동 최적화**: 개발자가 특별히 작성할 필요 없이 자동으로 최적화

## 2. How Static Hoisting Works

> 정적 호이스팅은 어떻게 동작하는가?

### 컴파일러 분석 과정

컴파일러는 template의 각 노드를 분석합니다:

1. **노드에 동적 바인딩이 포함되어 있는지 검사**

   - `{{ }}`, `v-bind`, `v-if`, `v-for` 등의 동적 지시문이 있는지 검사
   - 속성 값에 변수가 포함되어 있는지 검사

2. **정적 노드 표시**

   - 노드와 그 하위 노드 모두 동적 바인딩이 없으면 정적 노드로 표시

3. **정적 노드 호이스팅**
   - 정적 노드를 render 함수 외부로 추출
   - 모듈 상단에서 상수로 정의

### 예제 1: 기본 정적 호이스팅

<details>
<summary>기본 정적 호이스팅 예제 펼치기</summary>

```vue
<template>
  <div>
    <h1>제목</h1>
    <p>정적 콘텐츠입니다</p>
    <div>정적 블록</div>
  </div>
</template>
```

</details>

**컴파일 후**:

<details>
<summary>컴파일 후 결과 펼치기</summary>

```js
// 모든 정적 노드가 호이스팅됨
const _hoisted_1 = h('h1', null, '제목');
const _hoisted_2 = h('p', null, '정적 콘텐츠입니다');
const _hoisted_3 = h('div', null, '정적 블록');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

</details>

### 예제 2: 정적과 동적 콘텐츠 혼합

<details>
<summary>혼합 콘텐츠 예제 펼치기</summary>

```vue
<template>
  <div>
    <h1>정적 제목</h1>
    <p>{{ message }}</p>
    <div class="static-class">정적 콘텐츠</div>
    <span :class="dynamicClass">동적 콘텐츠</span>
  </div>
</template>
```

</details>

**컴파일 후**:

<details>
<summary>컴파일 후 결과 펼치기</summary>

```js
// 완전히 정적인 노드만 호이스팅됨
const _hoisted_1 = h('h1', null, '정적 제목');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, '정적 콘텐츠');

function render() {
  return h('div', null, [
    _hoisted_1, // 정적 노드, 재사용
    h('p', null, message.value), // 동적 콘텐츠, 재생성 필요
    _hoisted_3, // 정적 노드, 재사용
    h('span', { class: dynamicClass.value }, '동적 콘텐츠'), // 동적 속성, 재생성 필요
  ]);
}
```

</details>

### 예제 3: 정적 속성 호이스팅

<details>
<summary>정적 속성 예제 펼치기</summary>

```vue
<template>
  <div>
    <div class="container" id="main">콘텐츠</div>
    <button disabled>버튼</button>
  </div>
</template>
```

</details>

**컴파일 후**:

<details>
<summary>컴파일 후 결과 펼치기</summary>

```js
// 정적 속성 객체도 호이스팅됨
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, '콘텐츠');
const _hoisted_4 = h('button', _hoisted_2, '버튼');

function render() {
  return h('div', null, [_hoisted_3, _hoisted_4]);
}
```

</details>

## 3. v-once Directive

> v-once 지시문

개발자가 절대 변하지 않는 큰 블록의 콘텐츠를 직접 표시하고 싶다면, `v-once` 지시문을 사용할 수 있습니다.

### v-once의 역할

`v-once`는 컴파일러에게 이 요소와 하위 요소가 한 번만 렌더링되어야 한다고 알려줍니다. 동적 바인딩이 포함되어 있더라도 초기 렌더링 시에만 한 번 계산되고, 이후에는 업데이트되지 않습니다.

### 기본 사용법

<details>
<summary>v-once 기본 예제 펼치기</summary>

```vue
<template>
  <div>
    <!-- v-once로 정적 콘텐츠 표시 -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- v-once 미사용, 반응형 업데이트 -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('초기 제목');
const content = ref('초기 콘텐츠');

// 이 값들을 수정해도 v-once 블록은 업데이트되지 않음
setTimeout(() => {
  title.value = '새 제목';
  content.value = '새 콘텐츠';
}, 1000);
</script>
```

</details>

### v-once vs 정적 호이스팅

| 특성         | 정적 호이스팅           | v-once                    |
| ------------ | ----------------------- | ------------------------- |
| **트리거 방식** | 자동 (컴파일러 분석)   | 수동 (개발자 표시)        |
| **적용 시나리오** | 완전히 정적인 콘텐츠   | 동적 바인딩 포함하지만 한 번만 렌더링 |
| **성능**     | 최고 (diff에 참여하지 않음) | 양호 (한 번만 렌더링)    |
| **사용 시기** | 컴파일 시 자동 판단     | 개발자가 변하지 않을 것을 명확히 알 때 |

### 사용 시나리오

```vue
<template>
  <!-- 시나리오 1: 일회성 데이터 표시 -->
  <div v-once>
    <p>생성 시간: {{ createdAt }}</p>
    <p>생성자: {{ creator }}</p>
  </div>

  <!-- 시나리오 2: 복잡한 정적 구조 -->
  <div v-once>
    <div class="header">
      <h1>제목</h1>
      <nav>내비게이션</nav>
    </div>
  </div>

  <!-- 시나리오 3: 리스트의 정적 항목 -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Common Interview Questions

> 자주 나오는 면접 질문

### 질문 1: 정적 호이스팅의 원리

Vue3 정적 호이스팅의 동작 원리를 설명하고, 어떻게 성능을 향상시키는지 설명하세요.

<details>
<summary>정답 보기</summary>

**정적 호이스팅의 동작 원리**:

1. **컴파일 단계 분석**: 컴파일러가 template의 각 노드를 분석하여, 동적 바인딩이 포함되어 있는지 검사하고, 노드와 하위 노드 모두 동적 바인딩이 없으면 정적 노드로 표시합니다.

2. **노드 호이스팅**: 정적 노드를 render 함수 외부로 추출하여 모듈 상단에 상수로 정의하고, 초기 렌더링 시 한 번만 생성합니다.

3. **재사용 메커니즘**: 이후 재렌더링 시 이 정적 노드를 직접 재사용하여, VNode를 다시 생성할 필요 없고, diff 비교에 참여할 필요도 없습니다.

**성능 향상**:

- **VNode 생성 비용 감소**: 정적 노드는 한 번만 생성
- **diff 비용 감소**: 정적 노드는 diff 비교를 건너뜀
- **메모리 사용 감소**: 여러 컴포넌트 인스턴스가 정적 노드를 공유 가능
- **렌더링 속도 향상**: 특히 대량의 정적 콘텐츠가 있는 컴포넌트에서 효과가 뚜렷

</details>

### 질문 2: 정적 호이스팅과 v-once의 차이

정적 호이스팅과 `v-once`의 차이점 및 각각의 적용 시나리오를 설명하세요.

<details>
<summary>정답 보기</summary>

**주요 차이점**:

| 특성         | 정적 호이스팅           | v-once                    |
| ------------ | ----------------------- | ------------------------- |
| **트리거 방식** | 자동 (컴파일러 분석)   | 수동 (개발자 표시)        |
| **적용 콘텐츠** | 완전히 정적인 콘텐츠   | 동적 바인딩 포함하지만 한 번만 렌더링 |
| **컴파일 시기** | 컴파일 시 자동 판단   | 개발자가 명시적으로 표시  |
| **성능**     | 최고 (diff에 참여하지 않음) | 양호 (한 번만 렌더링)   |
| **업데이트 동작** | 절대 업데이트되지 않음 | 초기 렌더링 후 더 이상 업데이트되지 않음 |

**선택 권장**:

- 콘텐츠가 완전히 정적이면 → 컴파일러가 자동으로 처리 (정적 호이스팅)
- 동적 바인딩을 포함하지만 한 번만 렌더링되면 → `v-once` 사용
- 콘텐츠가 반응형 업데이트가 필요하면 → `v-once` 사용하지 않음

</details>

### 질문 3: 실제 적용 시나리오

어떤 상황에서 정적 호이스팅이 명확한 성능 향상을 가져올 수 있는지 설명하세요.

<details>
<summary>정답 보기</summary>

**정적 호이스팅이 명확한 성능 향상을 가져오는 시나리오**:

1. **대량의 정적 콘텐츠가 있는 컴포넌트**: 정적 HTML 구조가 많고 동적 콘텐츠가 적은 경우
2. **리스트의 정적 항목**: 리스트 내에서 반복되는 정적 구조
3. **빈번하게 업데이트되는 컴포넌트**: 정적 부분이 업데이트에 참여하지 않음
4. **여러 컴포넌트 인스턴스**: 정적 노드를 여러 인스턴스 간 공유 가능

**성능 향상의 핵심 요소**:

- **정적 콘텐츠 비율**: 정적 콘텐츠가 많을수록 향상이 뚜렷
- **업데이트 빈도**: 업데이트가 빈번할수록 diff 비용 절감 효과가 뚜렷
- **컴포넌트 인스턴스 수**: 인스턴스가 많을수록 정적 노드 공유 이점이 뚜렷

**실측치**: 대량의 정적 콘텐츠가 있는 컴포넌트에서 정적 호이스팅은 30-50%의 VNode 생성 시간 감소, 40-60%의 diff 비교 시간 감소, 메모리 사용 감소 (다중 인스턴스 공유)를 달성할 수 있습니다.

</details>

## 5. Best Practices

> 모범 사례

### 권장 사항

```vue
<!-- 1. 컴파일러가 정적 콘텐츠를 자동으로 처리하게 함 -->
<template>
  <div>
    <h1>제목</h1>
    <p>정적 콘텐츠</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2. v-once를 사용하여 한 번만 렌더링할 콘텐츠를 명시적으로 표시 -->
<template>
  <div v-once>
    <p>생성 시간: {{ createdAt }}</p>
    <p>생성자: {{ creator }}</p>
  </div>
</template>

<!-- 3. 정적 구조와 동적 콘텐츠를 분리 -->
<template>
  <div>
    <!-- 정적 구조 -->
    <div class="container">
      <header>제목</header>
      <!-- 동적 콘텐츠 -->
      <main>{{ content }}</main>
    </div>
  </div>
</template>
```

### 피해야 할 사항

```vue
<!-- 1. v-once를 과도하게 사용하지 않기 -->
<template>
  <!-- ❌ 콘텐츠 업데이트가 필요하면 v-once를 사용해서는 안 됨 -->
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2. 동적 콘텐츠에 v-once를 사용하지 않기 -->
<template>
  <!-- ❌ 리스트 항목 업데이트가 필요하면 v-once를 사용해서는 안 됨 -->
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>

<!-- 3. 최적화를 위해 구조를 깨뜨리지 않기 -->
<template>
  <!-- ⚠️ 정적 호이스팅을 위해 논리적으로 관련된 콘텐츠를 강제로 분리하지 않기 -->
  <div>
    <h1>제목</h1>
    <p>콘텐츠</p>
  </div>
</template>
```

## 6. Interview Summary

> 면접 요약

### 빠른 기억

**정적 호이스팅**:

- **정의**: 컴파일 단계에서 정적 노드를 상수로 호이스팅, 한 번만 생성
- **장점**: VNode 생성 및 diff 비용 감소
- **자동화**: 컴파일러가 자동으로 처리, 개발자 인식 불필요
- **적용**: reactive 상태에 전혀 의존하지 않는 노드

**v-once**:

- **정의**: 한 번만 렌더링할 콘텐츠를 수동으로 표시
- **적용**: 동적 바인딩을 포함하지만 한 번만 렌더링하는 블록
- **성능**: 불필요한 업데이트 감소

**핵심 차이점**:

- 정적 호이스팅: 자동, 완전히 정적
- v-once: 수동, 동적 바인딩 포함 가능

### 면접 답변 예시

**Q: Vue3의 정적 호이스팅이란 무엇인가?**

> "Vue3에서 정적 호이스팅은 컴파일 단계의 최적화입니다. 컴파일러가 template을 분석하여, reactive 상태에 전혀 의존하지 않고 절대 변하지 않는 노드를 추출해 파일 상단의 상수로 만듭니다. 초기 렌더링 시 한 번만 생성하고, 이후 재렌더링 시에는 직접 재사용하여 VNode 생성 및 diff 비용을 줄입니다. 개발자가 특별히 작성할 필요 없이 일반적인 template만 작성하면 컴파일러가 자동으로 어떤 노드를 hoist할 수 있는지 결정합니다. 절대 변하지 않는 콘텐츠를 직접 표시하고 싶다면 v-once를 사용할 수 있습니다."

**Q: 정적 호이스팅은 어떻게 성능을 향상시키는가?**

> "정적 호이스팅은 주로 세 가지 측면에서 성능을 향상시킵니다: 1) VNode 생성 비용 감소, 정적 노드는 한 번만 생성하고 이후 직접 재사용; 2) diff 비용 감소, 정적 노드는 diff 비교에 참여할 필요 없음; 3) 메모리 사용 감소, 여러 컴포넌트 인스턴스가 정적 노드를 공유 가능. 이 최적화는 대량의 정적 콘텐츠가 있는 컴포넌트에서 특히 효과가 뚜렷하며, 30-50%의 VNode 생성 시간과 40-60%의 diff 비교 시간을 줄일 수 있습니다."

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
