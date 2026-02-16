---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> watch와 watchEffect란 무엇인가요?

`watch`와 `watchEffect`는 Vue 3 Composition API에서 반응형 데이터 변화를 감시하는 두 가지 API입니다.

### watch

**정의**: 감시할 데이터 소스를 명시적으로 지정하고, 데이터가 변할 때 콜백 함수를 실행합니다.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// 단일 데이터 소스 감시
watch(count, (newValue, oldValue) => {
  console.log(`count가 ${oldValue}에서 ${newValue}로 변경됨`);
});

// 여러 데이터 소스 감시
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count 또는 message가 변경됨');
});
</script>
```

### watchEffect

**정의**: 콜백 함수 내에서 사용된 반응형 데이터를 자동으로 추적하고, 해당 데이터가 변할 때 자동으로 실행합니다.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// count와 message를 자동으로 추적
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // count 또는 message가 변경되면 자동으로 실행
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> watch와 watchEffect의 주요 차이점

### 1. 데이터 소스 지정

**watch**: 감시할 데이터를 명시적으로 지정

```typescript
const count = ref(0);
const message = ref('Hello');

// count를 명시적으로 감시
watch(count, (newVal, oldVal) => {
  console.log('count가 변경됨');
});

// 여러 데이터를 명시적으로 감시
watch([count, message], ([newCount, newMessage]) => {
  console.log('count 또는 message가 변경됨');
});
```

**watchEffect**: 사용된 데이터를 자동으로 추적

```typescript
const count = ref(0);
const message = ref('Hello');

// count와 message를 자동으로 추적 (콜백에서 사용되므로)
watchEffect(() => {
  console.log(count.value); // count를 자동 추적
  console.log(message.value); // message를 자동 추적
});
```

### 2. 실행 시점

**watch**: 기본적으로 지연 실행(lazy), 데이터가 변할 때만 실행

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('실행됨'); // count가 변경될 때만 실행
});

count.value = 1; // 실행 트리거
```

**watchEffect**: 즉시 실행 후, 변화를 추적

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('실행됨'); // 즉시 한 번 실행
  console.log(count.value);
});

count.value = 1; // 다시 실행
```

### 3. 이전 값 접근

**watch**: 이전 값에 접근 가능

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`${oldVal}에서 ${newVal}로 변경됨`);
});
```

**watchEffect**: 이전 값에 접근 불가

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // 현재 값만 접근 가능
  // 이전 값을 가져올 수 없음
});
```

### 4. 감시 중지

**watch**: 중지 함수를 반환

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// 감시 중지
stopWatch();
```

**watchEffect**: 중지 함수를 반환

```typescript
const count = ref(0);

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

// 감시 중지
stopEffect();
```

## 3. When to Use watch vs watchEffect?

> 언제 watch를 사용하고, 언제 watchEffect를 사용해야 하나요?

### watch를 사용하는 경우

1. **감시할 데이터를 명시적으로 지정해야 하는 경우**
   ```typescript
   watch(userId, (newId) => {
     fetchUser(newId);
   });
   ```

2. **이전 값에 접근해야 하는 경우**
   ```typescript
   watch(count, (newVal, oldVal) => {
     console.log(`${oldVal}에서 ${newVal}로 변경됨`);
   });
   ```

3. **지연 실행이 필요한 경우 (변할 때만 실행)**
   ```typescript
   watch(searchQuery, (newQuery) => {
     if (newQuery.length > 2) {
       search(newQuery);
     }
   });
   ```

4. **더 세밀한 제어가 필요한 경우**
   ```typescript
   watch(
     () => user.value.id,
     (newId) => {
       fetchUser(newId);
     },
     { immediate: true, deep: true }
   );
   ```

### watchEffect를 사용하는 경우

1. **여러 관련 데이터를 자동으로 추적**
   ```typescript
   watchEffect(() => {
     // 사용된 모든 반응형 데이터를 자동 추적
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **이전 값이 필요 없는 경우**
   ```typescript
   watchEffect(() => {
     console.log(`현재 카운트: ${count.value}`);
   });
   ```

3. **즉시 실행이 필요한 경우**
   ```typescript
   watchEffect(() => {
     // 즉시 실행 후, 변화를 추적
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> 일반적인 면접 질문

### 질문 1: 기본 차이점

다음 코드의 실행 순서와 출력 결과를 설명하세요.

```typescript
const count = ref(0);
const message = ref('Hello');

// watch
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>클릭하여 답변 보기</summary>

```typescript
const count = ref(0);
const message = ref('Hello');

// watch: 지연 실행, 즉시 실행되지 않음
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect: 즉시 실행
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // 즉시 출력: watchEffect: 0 Hello
});

count.value = 1;
// watch 트리거: watch: 1
// watchEffect 트리거: watchEffect: 1 Hello

message.value = 'World';
// watch는 message를 감시하지 않으므로, 실행되지 않음
// watchEffect는 message를 감시하므로, 실행: watchEffect: 1 World
```

**출력 순서**:
1. `watchEffect: 0 Hello` (즉시 실행)
2. `watch: 1` (count 변경)
3. `watchEffect: 1 Hello` (count 변경)
4. `watchEffect: 1 World` (message 변경)

**핵심 차이점**:
- `watch`는 지연 실행으로, 감시하는 데이터가 변할 때만 실행
- `watchEffect`는 즉시 실행 후, 사용된 모든 데이터를 추적

</details>

### 질문 2: 이전 값 접근

`watchEffect`를 사용할 때 이전 값을 어떻게 얻을 수 있는지 설명하세요.

<details>
<summary>클릭하여 답변 보기</summary>

**문제**: `watchEffect`는 이전 값에 직접 접근할 수 없음

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // 현재 값만 접근 가능
  // 이전 값을 가져올 수 없음
});
```

**해결 방법 1: ref를 사용하여 이전 값 저장**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`${prevCount.value}에서 ${count.value}로 변경됨`);
  prevCount.value = count.value; // 이전 값 업데이트
});
```

**해결 방법 2: watch 사용 (이전 값이 필요한 경우)**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`${oldVal}에서 ${newVal}로 변경됨`);
});
```

**권장 사항**:
- 이전 값이 필요하면, `watch`를 우선 사용
- `watchEffect`는 이전 값이 필요 없는 시나리오에 적합

</details>

### 질문 3: watch와 watchEffect 중 어떤 것을 선택해야 하나요?

다음 시나리오에서 `watch`와 `watchEffect` 중 어떤 것을 사용해야 하는지 설명하세요.

```typescript
// 시나리오 1: 사용자 ID 변경 감시, 사용자 데이터 다시 로드
const userId = ref(1);
// ?

// 시나리오 2: 폼 유효성 검사가 통과되면, 제출 버튼 자동 활성화
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// 시나리오 3: 검색 키워드 감시, 검색 실행 (디바운스 필요)
const searchQuery = ref('');
// ?
```

<details>
<summary>클릭하여 답변 보기</summary>

**시나리오 1: 사용자 ID 감시**

```typescript
const userId = ref(1);

// ✅ watch 사용: 감시할 데이터를 명시적으로 지정
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**시나리오 2: 폼 유효성 검사**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// ✅ watchEffect 사용: 관련 데이터를 자동 추적
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**시나리오 3: 검색 (디바운스 필요)**

```typescript
const searchQuery = ref('');

// ✅ watch 사용: 더 세밀한 제어 필요 (디바운스)
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

**선택 원칙**:
- 감시할 데이터를 명시적으로 지정 → `watch`
- 여러 관련 데이터를 자동 추적 → `watchEffect`
- 이전 값이 필요하거나 세밀한 제어 → `watch`
- 즉시 실행이 필요 → `watchEffect`

</details>

## 5. Best Practices

> 모범 사례

### 권장 방법

```typescript
// 1. 감시할 데이터를 명시적으로 지정할 때 watch 사용
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. 여러 관련 데이터를 자동 추적할 때 watchEffect 사용
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3. 이전 값이 필요할 때 watch 사용
watch(count, (newVal, oldVal) => {
  console.log(`${oldVal}에서 ${newVal}로 변경됨`);
});

// 4. 감시자 정리를 잊지 말 것
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### 피해야 할 방법

```typescript
// 1. watchEffect에서 비동기 작업 시 정리를 처리하지 않는 것
watchEffect(async () => {
  const data = await fetchData(); // ❌ 메모리 누수 가능성
  // ...
});

// 2. watchEffect를 과도하게 사용하지 말 것
// 특정 데이터만 감시해야 한다면, watch가 더 명확함
watchEffect(() => {
  console.log(count.value); // ⚠️ count만 감시해야 한다면, watch가 더 적합
});

// 3. watchEffect에서 감시하는 데이터를 수정하지 말 것 (무한 루프 가능)
watchEffect(() => {
  count.value++; // ❌ 무한 루프 가능
});
```

## 6. Interview Summary

> 면접 요약

### 빠른 기억

**watch**:
- 감시할 데이터를 명시적으로 지정
- 지연 실행 (기본)
- 이전 값에 접근 가능
- 세밀한 제어가 필요한 시나리오에 적합

**watchEffect**:
- 사용된 데이터를 자동 추적
- 즉시 실행
- 이전 값에 접근 불가
- 여러 관련 데이터를 자동 추적하는 경우에 적합

**선택 원칙**:
- 명시적 감시 → `watch`
- 자동 추적 → `watchEffect`
- 이전 값 필요 → `watch`
- 즉시 실행 필요 → `watchEffect`

### 면접 답변 예시

**Q: watch와 watchEffect의 차이점은 무엇인가요?**

> "watch와 watchEffect는 모두 Vue 3에서 반응형 데이터 변화를 감시하는 API입니다. 주요 차이점은: 1) 데이터 소스: watch는 감시할 데이터를 명시적으로 지정해야 하지만, watchEffect는 콜백 함수에서 사용된 반응형 데이터를 자동으로 추적합니다; 2) 실행 시점: watch는 기본적으로 지연 실행으로 데이터가 변할 때만 실행되지만, watchEffect는 즉시 실행 후 변화를 추적합니다; 3) 이전 값 접근: watch는 이전 값에 접근 가능하지만, watchEffect는 불가능합니다; 4) 사용 시나리오: watch는 감시할 데이터를 명시적으로 지정하거나 이전 값이 필요한 시나리오에 적합하고, watchEffect는 여러 관련 데이터를 자동으로 추적하는 시나리오에 적합합니다."

**Q: 언제 watch를 사용하고, 언제 watchEffect를 사용해야 하나요?**

> "watch를 사용하는 경우: 1) 감시할 데이터를 명시적으로 지정해야 할 때; 2) 이전 값에 접근해야 할 때; 3) 변할 때만 지연 실행이 필요할 때; 4) 더 세밀한 제어가 필요할 때 (immediate, deep 옵션 등). watchEffect를 사용하는 경우: 1) 여러 관련 데이터를 자동으로 추적할 때; 2) 이전 값이 필요 없을 때; 3) 즉시 실행이 필요할 때. 일반적으로, 특정 데이터만 감시해야 한다면 watch가 더 명확하고, 여러 관련 데이터를 자동 추적해야 한다면 watchEffect가 더 편리합니다."

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
