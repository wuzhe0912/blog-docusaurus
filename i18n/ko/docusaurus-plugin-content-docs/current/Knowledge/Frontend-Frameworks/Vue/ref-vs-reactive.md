---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> ref와 reactive란 무엇인가?

`ref`와 `reactive`는 Vue 3 Composition API에서 반응형 데이터를 생성하는 두 가지 핵심 API입니다.

### ref

**정의**: `ref`는 반응형 **기본 타입 값** 또는 **객체 참조**를 생성하는 데 사용됩니다.

<details>
<summary>ref 기본 예제 펼치기</summary>

```vue
<script setup>
import { ref } from 'vue';

// 기본 타입
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// 객체 (ref로도 사용 가능)
const user = ref({
  name: 'John',
  age: 30,
});

// 접근 시 .value 사용 필요
console.log(count.value); // 0
count.value++; // 값 수정
</script>
```

</details>

### reactive

**정의**: `reactive`는 반응형 **객체**를 생성하는 데 사용됩니다 (기본 타입에는 직접 사용 불가).

<details>
<summary>reactive 기본 예제 펼치기</summary>

```vue
<script setup>
import { reactive } from 'vue';

// 객체에만 사용 가능
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// 속성에 직접 접근, .value 불필요
console.log(state.count); // 0
state.count++; // 값 수정
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> ref와 reactive의 주요 차이점

### 1. 적용 가능한 타입

**ref**: 모든 타입에 사용 가능

```typescript
const count = ref(0); // ✅ 숫자
const message = ref('Hello'); // ✅ 문자열
const isActive = ref(true); // ✅ 불리언
const user = ref({ name: 'John' }); // ✅ 객체
const items = ref([1, 2, 3]); // ✅ 배열
```

**reactive**: 객체에만 사용 가능

```typescript
const state = reactive({ count: 0 }); // ✅ 객체
const state = reactive([1, 2, 3]); // ✅ 배열 (객체의 일종)
const count = reactive(0); // ❌ 오류: 기본 타입 불가
const message = reactive('Hello'); // ❌ 오류: 기본 타입 불가
```

### 2. 접근 방식

**ref**: `.value`를 사용하여 접근

<details>
<summary>ref 접근 예제 펼치기</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

// JavaScript에서 .value 사용 필요
console.log(count.value); // 0
count.value = 10;

// 템플릿에서 자동 언래핑, .value 불필요
</script>

<template>
  <div>{{ count }}</div>
  <!-- 자동 언래핑, .value 불필요 -->
</template>
```

</details>

**reactive**: 속성에 직접 접근

<details>
<summary>reactive 접근 예제 펼치기</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

// 속성에 직접 접근
console.log(state.count); // 0
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. 재할당

**ref**: 재할당 가능

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // ✅ 재할당 가능
```

**reactive**: 재할당 불가 (반응성을 잃음)

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // ❌ 반응성을 잃음, 업데이트가 트리거되지 않음
```

### 4. 구조 분해

**ref**: 구조 분해 후에도 반응성 유지

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // 기본값 구조 분해, 반응성 상실

// 하지만 ref 자체를 구조 분해할 수 있음
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive**: 구조 분해 후 반응성 상실

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // ❌ 반응성 상실

// toRefs를 사용하여 반응성 유지
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // ✅ 반응성 유지
```

## 3. When to Use ref vs reactive?

> 언제 ref를 사용하고 언제 reactive를 사용하는가?

### ref를 사용하는 경우

1. **기본 타입 값**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **재할당이 필요한 객체**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // 재할당 가능
   ```

3. **Template Refs**

   ```vue
   <template>
     <div ref="container"></div>
   </template>
   <script setup>
   const container = ref(null);
   </script>
   ```

4. **구조 분해가 필요한 경우**
   ```typescript
   const state = ref({ count: 0, message: 'Hello' });
   // 기본값 구조 분해는 문제 없음
   ```

### reactive를 사용하는 경우

1. **복잡한 객체 상태**

   ```typescript
   const formState = reactive({
     username: '',
     password: '',
     errors: {},
   });
   ```

2. **재할당이 필요 없는 상태**

   ```typescript
   const config = reactive({
     apiUrl: 'https://api.example.com',
     timeout: 5000,
   });
   ```

3. **여러 관련 속성을 하나로 묶을 때**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> 자주 나오는 면접 질문

### 질문 1: 기본 차이점

다음 코드의 차이점과 출력 결과를 설명하세요.

```typescript
// 경우 1: ref 사용
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// 경우 2: reactive 사용
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// 경우 3: reactive 재할당
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>정답 보기</summary>

```typescript
// 경우 1: ref 사용
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // 10 ✅

// 경우 2: reactive 사용
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // 10 ✅

// 경우 3: reactive 재할당
let state2 = reactive({ count: 0 });
state2 = { count: 10 }; // ❌ 반응성 상실
console.log(state2.count); // 10 (값은 맞지만 반응성 상실)
// 이후 state2.count 수정은 뷰 업데이트를 트리거하지 않음
```

**핵심 차이점**:

- `ref`는 `.value`로 접근해야 함
- `reactive`는 속성에 직접 접근
- `reactive`는 재할당하면 반응성을 잃음

</details>

### 질문 2: 구조 분해 문제

다음 코드의 문제점을 설명하고 해결 방안을 제시하세요.

```typescript
// 경우 1: ref 구조 분해
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// 경우 2: reactive 구조 분해
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>정답 보기</summary>

**경우 1: ref 구조 분해**

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ❌ user.value.name을 업데이트하지 않음

// 올바른 방법: ref의 값을 수정
user.value.name = 'Jane'; // ✅
// 또는 재할당
user.value = { name: 'Jane', age: 30 }; // ✅
```

**경우 2: reactive 구조 분해**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ❌ 반응성 상실, 업데이트를 트리거하지 않음

// 올바른 방법 1: 속성을 직접 수정
state.count = 10; // ✅

// 올바른 방법 2: toRefs를 사용하여 반응성 유지
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // ✅ 이제 ref이므로 .value 사용 필요
```

**요약**:

- 기본값 구조 분해는 반응성을 잃음
- `reactive` 구조 분해는 `toRefs`를 사용하여 반응성을 유지해야 함
- `ref` 객체 속성 구조 분해도 반응성을 잃으므로, `.value`를 직접 수정해야 함

</details>

### 질문 3: ref와 reactive 중 선택

다음 시나리오에서 `ref`와 `reactive` 중 어떤 것을 사용해야 하는지 설명하세요.

```typescript
// 시나리오 1: 카운터
const count = ?;

// 시나리오 2: 폼 상태
const form = ?;

// 시나리오 3: 사용자 데이터 (재할당이 필요할 수 있음)
const user = ?;

// 시나리오 4: 템플릿 참조
const inputRef = ?;
```

<details>
<summary>정답 보기</summary>

```typescript
// 시나리오 1: 카운터 (기본 타입)
const count = ref(0); // ✅ ref

// 시나리오 2: 폼 상태 (복잡한 객체, 재할당 불필요)
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // ✅ reactive

// 시나리오 3: 사용자 데이터 (재할당이 필요할 수 있음)
const user = ref({ name: 'John', age: 30 }); // ✅ ref (재할당 가능)

// 시나리오 4: 템플릿 참조
const inputRef = ref(null); // ✅ ref (템플릿 참조는 반드시 ref 사용)
```

**선택 원칙**:

- 기본 타입 → `ref`
- 재할당이 필요한 객체 → `ref`
- 템플릿 참조 → `ref`
- 복잡한 객체 상태, 재할당 불필요 → `reactive`

</details>

## 5. Best Practices

> 모범 사례

### 권장 사항

```typescript
// 1. 기본 타입은 ref 사용
const count = ref(0);
const message = ref('Hello');

// 2. 복잡한 상태는 reactive 사용
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3. 재할당이 필요하면 ref 사용
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // ✅

// 4. reactive 구조 분해는 toRefs 사용
import { toRefs } from 'vue';
const { count, message } = toRefs(state);

// 5. 스타일 통일: 팀에서 ref 또는 reactive 중 하나를 주로 사용
```

### 피해야 할 사항

```typescript
// 1. reactive로 기본 타입을 생성하지 않기
const count = reactive(0); // ❌ 오류

// 2. reactive를 재할당하지 않기
let state = reactive({ count: 0 });
state = { count: 10 }; // ❌ 반응성 상실

// 3. reactive를 직접 구조 분해하지 않기
const { count } = reactive({ count: 0 }); // ❌ 반응성 상실

// 4. 템플릿에서 .value를 빠뜨리지 않기 (ref의 경우)
// 템플릿에서는 .value 불필요, JavaScript에서는 필요
```

## 6. Interview Summary

> 면접 요약

### 빠른 기억

**ref**:

- 모든 타입에 적용 가능
- `.value`로 접근해야 함
- 재할당 가능
- 템플릿에서 자동 언래핑

**reactive**:

- 객체에만 사용 가능
- 속성에 직접 접근
- 재할당 불가
- 구조 분해 시 `toRefs` 사용 필요

**선택 원칙**:

- 기본 타입 → `ref`
- 재할당 필요 → `ref`
- 복잡한 객체 상태 → `reactive`

### 면접 답변 예시

**Q: ref와 reactive의 차이점은 무엇인가?**

> "ref와 reactive는 모두 Vue 3에서 반응형 데이터를 생성하는 API입니다. 주요 차이점은 다음과 같습니다: 1) 적용 타입: ref는 모든 타입에 사용 가능하고, reactive는 객체에만 사용 가능합니다. 2) 접근 방식: ref는 .value로 접근해야 하고, reactive는 속성에 직접 접근합니다. 3) 재할당: ref는 재할당이 가능하지만, reactive는 재할당하면 반응성을 잃습니다. 4) 구조 분해: reactive 구조 분해 시 toRefs를 사용하여 반응성을 유지해야 합니다. 일반적으로 기본 타입과 재할당이 필요한 객체에는 ref를, 복잡한 객체 상태에는 reactive를 사용합니다."

**Q: 언제 ref를 사용하고 언제 reactive를 사용해야 하는가?**

> "ref를 사용하는 경우: 1) 기본 타입 값 (숫자, 문자열, 불리언), 2) 재할당이 필요한 객체, 3) 템플릿 참조. reactive를 사용하는 경우: 1) 복잡한 객체 상태로 여러 관련 속성을 하나로 묶을 때, 2) 재할당이 필요 없는 상태. 실제 개발에서는 많은 팀이 ref를 통일적으로 사용하는데, 이는 더 유연하고 적용 범위가 넓기 때문입니다."

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
