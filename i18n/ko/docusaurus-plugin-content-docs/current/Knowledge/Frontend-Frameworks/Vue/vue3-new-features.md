---
id: vue3-new-features
title: '[Easy] Vue3 새로운 기능'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> Vue 3에는 어떤 새로운 기능이 있나요?

Vue 3는 많은 새로운 기능과 개선 사항을 도입했으며, 주요 내용은 다음과 같습니다:

### 주요 새로운 기능

1. **Composition API**: 새로운 컴포넌트 작성 방식
2. **Teleport**: 컴포넌트를 DOM의 다른 위치에 렌더링
3. **Fragment**: 컴포넌트가 여러 루트 노드를 가질 수 있음
4. **Suspense**: 비동기 컴포넌트 로딩 처리
5. **다중 v-model**: 여러 v-model 지원
6. **향상된 TypeScript 지원**
7. **성능 최적화**: 더 작은 번들 크기, 더 빠른 렌더링 속도

## 2. Teleport

> Teleport란 무엇인가요?

**정의**: `Teleport`는 컴포넌트의 콘텐츠를 DOM 트리의 다른 위치에 렌더링하면서, 컴포넌트의 논리적 구조는 변경하지 않는 기능입니다.

### 사용 시나리오

**일반적인 시나리오**: Modal, Tooltip, Notification 등 body에 렌더링해야 하는 컴포넌트

<details>
<summary>클릭하여 Teleport 예제 보기</summary>

```vue
<template>
  <div>
    <button @click="showModal = true">Modal 열기</button>

    <!-- Teleport를 사용하여 Modal을 body에 렌더링 -->
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Modal 제목</h2>
          <p>Modal 내용</p>
          <button @click="showModal = false">닫기</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

</details>

### 장점

1. **z-index 문제 해결**: Modal이 body에 렌더링되어, 부모 컴포넌트의 스타일에 영향받지 않음
2. **논리적 구조 유지**: 컴포넌트 로직은 원래 위치에 남아있고, DOM 위치만 다름
3. **더 나은 유지보수성**: Modal 관련 코드가 컴포넌트에 집중됨

## 3. Fragment (다중 루트 노드)

> Fragment란 무엇인가요?

**정의**: Vue 3에서는 컴포넌트가 여러 루트 노드를 가질 수 있어, 단일 요소로 감쌀 필요가 없습니다. 이것은 암시적인 Fragment로, React처럼 `<Fragment>` 태그를 사용할 필요가 없습니다.

### Vue 2 vs Vue 3

**Vue 2**: 반드시 단일 루트 노드가 있어야 함

```vue
<!-- Vue 2: 단일 요소로 감싸야 함 -->
<template>
  <div>
    <h1>제목</h1>
    <p>내용</p>
  </div>
</template>
```

**Vue 3**: 여러 루트 노드를 가질 수 있음

```vue
<!-- Vue 3: 여러 루트 노드 가능 -->
<template>
  <h1>제목</h1>
  <p>내용</p>
</template>
```

### Fragment가 필요한 이유

Vue 2에서는 컴포넌트가 반드시 단일 루트 노드를 가져야 했기 때문에, 개발자들은 자주 추가적인 래핑 요소(예: `<div>`)를 추가해야 했습니다. 이러한 요소들은:

1. **시맨틱 HTML을 깨뜨림**: 의미 없는 래핑 요소 추가
2. **DOM 레벨 증가**: 스타일 선택자와 성능에 영향
3. **스타일 제어 어려움**: 추가 래핑 요소의 스타일을 처리해야 함

### 사용 시나리오

#### 시나리오 1: 시맨틱 HTML 구조

```vue
<template>
  <!-- 추가 래핑 요소 불필요 -->
  <header>
    <h1>사이트 제목</h1>
  </header>
  <main>
    <p>주요 내용</p>
  </main>
  <footer>
    <p>페이지 하단</p>
  </footer>
</template>
```

#### 시나리오 2: 리스트 항목 컴포넌트

```vue
<!-- ListItem.vue -->
<template>
  <li class="item-title">{{ title }}</li>
  <li class="item-description">{{ description }}</li>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
</script>
```

#### 시나리오 3: 조건부 렌더링으로 여러 요소

```vue
<template>
  <div v-if="showHeader" class="header">제목</div>
  <div v-if="showContent" class="content">내용</div>
  <div v-if="showFooter" class="footer">하단</div>
</template>
```

### 속성 상속 (Attribute Inheritance)

컴포넌트에 여러 루트 노드가 있을 때, 속성 상속 동작이 달라집니다.

**단일 루트 노드**: 속성이 자동으로 루트 요소에 상속됨

```vue
<!-- 부모 컴포넌트 -->
<MyComponent class="custom-class" id="my-id" />

<!-- 자식 컴포넌트 (단일 루트) -->
<template>
  <div>내용</div>
</template>

<!-- 렌더링 결과 -->
<div class="custom-class" id="my-id">내용</div>
```

**다중 루트 노드**: 속성이 자동으로 상속되지 않으며, 수동으로 지정해야 함

```vue
<!-- 부모 컴포넌트 -->
<MyComponent class="custom-class" id="my-id" />

<!-- 자식 컴포넌트 (다중 루트) -->
<template>
  <div>첫 번째 루트</div>
  <div>두 번째 루트</div>
</template>

<!-- 렌더링 결과: 속성이 자동 상속되지 않음 -->
<div>첫 번째 루트</div>
<div>두 번째 루트</div>
```

**해결 방법**: `$attrs`를 사용하여 속성을 수동 바인딩

```vue
<!-- 자식 컴포넌트 -->
<template>
  <div v-bind="$attrs">첫 번째 루트</div>
  <div>두 번째 루트</div>
</template>

<!-- 렌더링 결과 -->
<div class="custom-class" id="my-id">첫 번째 루트</div>
<div>두 번째 루트</div>
```

**`inheritAttrs: false`로 상속 동작 제어**:

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // 자동 상속 비활성화
});
</script>

<template>
  <div v-bind="$attrs">첫 번째 루트</div>
  <div>두 번째 루트</div>
</template>
```

### Fragment vs React Fragment

| 특성         | Vue 3 Fragment     | React Fragment                    |
| ------------ | ------------------ | --------------------------------- |
| **문법**     | 암시적 (태그 불필요) | 명시적 (`<Fragment>` 또는 `<>` 필요) |
| **Key 속성** | 불필요             | 필요 시 `<Fragment key={...}>` 사용 |
| **속성 상속** | 수동 처리 필요     | 속성 미지원                       |

**Vue 3**:

```vue
<!-- Vue 3: 암시적 Fragment -->
<template>
  <h1>제목</h1>
  <p>내용</p>
</template>
```

**React**:

```jsx
// React: 명시적 Fragment
function Component() {
  return (
    <>
      <h1>제목</h1>
      <p>내용</p>
    </>
  );
}
```

### 주의사항

1. **속성 상속**: 다중 루트 노드일 때 속성이 자동 상속되지 않으며, `$attrs`를 사용하여 수동 바인딩해야 함
2. **스타일 범위**: 다중 루트 노드일 때 `scoped` 스타일이 모든 루트 노드에 적용됨
3. **논리적 래핑**: 논리적으로 래핑이 필요한 경우 여전히 단일 루트 노드를 사용해야 함

```vue
<!-- ✅ 좋은 방법: 논리적으로 래핑이 필요한 경우 -->
<template>
  <div class="card">
    <h2>제목</h2>
    <p>내용</p>
  </div>
</template>

<!-- ⚠️ 피해야 할 방법: 다중 루트를 위한 다중 루트 -->
<template>
  <h2>제목</h2>
  <p>내용</p>
  <!-- 이 두 요소가 논리적으로 하나의 그룹이어야 한다면, 래핑해야 함 -->
</template>
```

## 4. Suspense

> Suspense란 무엇인가요?

**정의**: `Suspense`는 비동기 컴포넌트 로딩 시 로딩 상태를 처리하는 내장 컴포넌트입니다.

### 기본 사용법

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>로딩 중...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### 사용 시나리오

1. **비동기 컴포넌트 로딩**

   ```vue
   <Suspense>
     <AsyncUserProfile :userId="userId" />
     <template #fallback>
       <UserProfileSkeleton />
     </template>
   </Suspense>
   ```

2. **비동기 데이터 로딩**
   ```vue
   <script setup>
   const data = await fetchData(); // setup에서 await 사용
   </script>
   ```

## 5. Multiple v-model

> 다중 v-model

**정의**: Vue 3에서는 컴포넌트가 여러 `v-model`을 사용할 수 있으며, 각 `v-model`은 서로 다른 prop에 대응합니다.

### Vue 2 vs Vue 3

**Vue 2**: 하나의 `v-model`만 가능

```vue
<!-- Vue 2: 하나의 v-model만 가능 -->
<CustomInput v-model="value" />
```

**Vue 3**: 여러 `v-model` 가능

```vue
<!-- Vue 3: 여러 v-model 가능 -->
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### 구현 예제

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input :value="email" @input="$emit('update:email', $event.target.value)" />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Common Interview Questions

> 일반적인 면접 질문

### 질문 1: Teleport의 사용 시나리오

`Teleport`를 언제 사용해야 하는지 설명하세요.

<details>
<summary>클릭하여 답변 보기</summary>

**Teleport를 사용하는 시나리오**:

1. **Modal 다이얼로그**

   ```vue
   <Teleport to="body">
     <Modal v-if="showModal" />
   </Teleport>
   ```

   - z-index 문제 해결
   - 부모 컴포넌트 스타일에 영향받지 않음

2. **Tooltip 안내**

   ```vue
   <Teleport to="body">
     <Tooltip v-if="showTooltip" />
   </Teleport>
   ```

   - 부모 컴포넌트의 overflow에 의해 숨겨지는 것을 방지

3. **Notification 알림**
   ```vue
   <Teleport to="#notifications">
     <Notification v-for="msg in messages" :key="msg.id" />
   </Teleport>
   ```
   - 알림 위치를 통합 관리

**Teleport를 사용하지 않는 경우**:

- 일반적인 콘텐츠에는 필요 없음
- 특별한 DOM 위치가 필요하지 않은 컴포넌트

</details>

### 질문 2: Fragment의 장점

Vue 3에서 여러 루트 노드를 허용하는 것의 장점을 설명하세요.

<details>
<summary>클릭하여 답변 보기</summary>

**장점**:

1. **불필요한 DOM 요소 감소**

   ```vue
   <!-- Vue 2: 추가 div 필요 -->
   <template>
     <div>
       <header>...</header>
       <main>...</main>
     </div>
   </template>

   <!-- Vue 3: 추가 요소 불필요 -->
   <template>
     <header>...</header>
     <main>...</main>
   </template>
   ```

2. **더 나은 시맨틱 HTML**

   - Vue의 제한 때문에 의미 없는 래핑 요소를 추가할 필요 없음
   - HTML 구조의 시맨틱을 유지

3. **더 유연한 스타일 제어**

   - 추가 래핑 요소의 스타일을 처리할 필요 없음
   - CSS 선택자의 복잡도 감소

4. **DOM 레벨 감소**

   - 더 얕은 DOM 트리로 성능이 향상됨
   - 브라우저 렌더링 비용 감소

5. **더 나은 유지보수성**
   - 코드가 더 간결하고, 추가 래핑 요소 불필요
   - 컴포넌트 구조가 더 명확

</details>

### 질문 3: Fragment 속성 상속 문제

컴포넌트에 여러 루트 노드가 있을 때 속성 상속의 동작은 어떻게 되나요? 어떻게 해결하나요?

<details>
<summary>클릭하여 답변 보기</summary>

**문제**:

컴포넌트에 여러 루트 노드가 있을 때, 부모 컴포넌트가 전달하는 속성(예: `class`, `id` 등)이 어떤 루트 노드에도 자동으로 상속되지 않습니다.

**예제**:

```vue
<!-- 부모 컴포넌트 -->
<MyComponent class="custom-class" id="my-id" />

<!-- 자식 컴포넌트 (다중 루트) -->
<template>
  <div>첫 번째 루트</div>
  <div>두 번째 루트</div>
</template>

<!-- 렌더링 결과: 속성이 자동 상속되지 않음 -->
<div>첫 번째 루트</div>
<div>두 번째 루트</div>
```

**해결 방법**:

1. **`$attrs`를 사용하여 속성 수동 바인딩**

```vue
<!-- 자식 컴포넌트 -->
<template>
  <div v-bind="$attrs">첫 번째 루트</div>
  <div>두 번째 루트</div>
</template>

<!-- 렌더링 결과 -->
<div class="custom-class" id="my-id">첫 번째 루트</div>
<div>두 번째 루트</div>
```

2. **`inheritAttrs: false`로 상속 동작 제어**

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // 자동 상속 비활성화
});
</script>

<template>
  <div v-bind="$attrs">첫 번째 루트</div>
  <div>두 번째 루트</div>
</template>
```

3. **특정 속성만 선택적으로 바인딩**

```vue
<template>
  <div :class="$attrs.class">첫 번째 루트</div>
  <div :id="$attrs.id">두 번째 루트</div>
</template>
```

**핵심 포인트**:

- 단일 루트 노드: 속성이 자동 상속됨
- 다중 루트 노드: 속성이 자동 상속되지 않으므로, 수동으로 처리해야 함
- `$attrs`를 사용하여 `props`에 정의되지 않은 모든 속성에 접근할 수 있음

</details>

### 질문 4: Fragment vs React Fragment

Vue 3 Fragment와 React Fragment의 차이를 비교하세요.

<details>
<summary>클릭하여 답변 보기</summary>

**주요 차이점**:

| 특성         | Vue 3 Fragment             | React Fragment                    |
| ------------ | -------------------------- | --------------------------------- |
| **문법**     | 암시적 (태그 불필요)       | 명시적 (`<Fragment>` 또는 `<>` 필요) |
| **Key 속성** | 불필요                     | 필요 시 `<Fragment key={...}>` 사용 |
| **속성 상속** | 수동 처리 필요 (`$attrs`)  | 속성 미지원                       |

**Vue 3**:

```vue
<!-- Vue 3: 암시적 Fragment, 직접 여러 루트 노드 작성 -->
<template>
  <h1>제목</h1>
  <p>내용</p>
</template>
```

**React**:

```jsx
// React: 명시적 Fragment, 태그 사용 필요
function Component() {
  return (
    <>
      <h1>제목</h1>
      <p>내용</p>
    </>
  );
}

// 또는 Fragment 사용
import { Fragment } from 'react';
function Component() {
  return (
    <Fragment>
      <h1>제목</h1>
      <p>내용</p>
    </Fragment>
  );
}
```

**장점 비교**:

- **Vue 3**: 문법이 더 간결, 추가 태그 불필요
- **React**: 더 명확, key 속성 추가 가능

</details>

### 질문 5: Suspense 사용

`Suspense`를 사용하여 비동기 컴포넌트를 로드하는 예제를 구현하세요.

<details>
<summary>클릭하여 답변 보기</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>사용자 데이터 로딩 중...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);

// 비동기 컴포넌트 정의
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

**고급 사용법: 에러 처리**

```vue
<template>
  <Suspense @resolve="onResolve" @reject="onReject">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>로딩 중...</div>
    </template>
  </Suspense>
</template>

<script setup>
const onResolve = () => {
  console.log('컴포넌트 로드 성공');
};

const onReject = (error) => {
  console.error('컴포넌트 로드 실패:', error);
};
</script>
```

</details>

## 7. Best Practices

> 모범 사례

### 권장 방법

```vue
<!-- 1. Modal에 Teleport 사용 -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2. 다중 루트 노드는 시맨틱 유지 -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3. 비동기 컴포넌트에 Suspense 사용 -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4. 다중 v-model은 명확한 이름 사용 -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### 피해야 할 방법

```vue
<!-- 1. Teleport를 과도하게 사용하지 않기 -->
<Teleport to="body">
  <div>일반 콘텐츠</div> <!-- ❌ 불필요 -->
</Teleport>

<!-- 2. 다중 루트 노드를 위해 구조를 깨뜨리지 않기 -->
<template>
  <h1>제목</h1>
  <p>내용</p>
  <!-- ⚠️ 논리적으로 래핑이 필요하다면, 단일 루트 노드를 사용해야 함 -->
</template>

<!-- 3. Suspense의 에러 처리를 무시하지 않기 -->
<Suspense>
  <AsyncComponent />
  <!-- ⚠️ 로드 실패 상황을 처리해야 함 -->
</Suspense>
```

## 8. Interview Summary

> 면접 요약

### 빠른 기억

**Vue 3 주요 새로운 기능**:

- **Composition API**: 새로운 컴포넌트 작성 방식
- **Teleport**: 컴포넌트를 다른 DOM 위치에 렌더링
- **Fragment**: 여러 루트 노드 지원
- **Suspense**: 비동기 컴포넌트 로딩 처리
- **다중 v-model**: 여러 v-model 바인딩 지원

**사용 시나리오**:

- Modal/Tooltip → `Teleport`
- 시맨틱 HTML → `Fragment`
- 비동기 컴포넌트 → `Suspense`
- 폼 컴포넌트 → 다중 `v-model`

### 면접 답변 예시

**Q: Vue 3의 주요 새로운 기능은 무엇인가요?**

> "Vue 3는 많은 새로운 기능을 도입했습니다. 주요 내용은: 1) Composition API로 새로운 컴포넌트 작성 방식을 제공하여 로직 구성과 코드 재사용을 개선; 2) Teleport로 컴포넌트 콘텐츠를 DOM 트리의 다른 위치에 렌더링할 수 있어 Modal, Tooltip 등에 자주 사용; 3) Fragment로 컴포넌트가 여러 루트 노드를 가질 수 있어 추가 래핑 요소가 불필요; 4) Suspense로 비동기 컴포넌트 로딩 시 로딩 상태를 처리; 5) 다중 v-model 지원으로 컴포넌트가 여러 v-model 바인딩을 사용; 6) 향상된 TypeScript 지원과 성능 최적화. 이러한 새 기능으로 Vue 3는 더 강력하고 유연해졌으며, 하위 호환성도 유지하고 있습니다."

**Q: Teleport의 사용 시나리오는 무엇인가요?**

> "Teleport는 주로 컴포넌트를 DOM 트리의 다른 위치에 렌더링해야 하는 시나리오에 사용됩니다. 일반적인 사용 시나리오는: 1) Modal 다이얼로그로 z-index 문제를 피하기 위해 body에 렌더링; 2) Tooltip 안내로 부모 컴포넌트의 overflow에 의해 숨겨지는 것을 방지; 3) Notification 알림으로 알림 위치를 통합 관리. Teleport의 장점은 컴포넌트의 논리적 구조를 유지하면서 DOM의 렌더링 위치만 변경하여, 스타일 문제를 해결하면서도 코드의 유지보수성을 유지하는 것입니다."

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
