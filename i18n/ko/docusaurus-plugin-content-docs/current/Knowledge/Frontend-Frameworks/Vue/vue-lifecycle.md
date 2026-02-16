---
id: vue-lifecycle
title: '[Medium] Vue Lifecycle Hooks'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Please explain Vue lifecycle hooks (include Vue 2 & Vue 3)

> Vue의 생명주기 훅을 설명하세요 (Vue 2와 Vue 3 포함).

Vue 컴포넌트는 생성부터 소멸까지 일련의 과정을 거치며, 이 과정에서 특정 함수가 자동으로 호출됩니다. 이 함수들이 바로 "생명주기 훅"입니다. 생명주기를 이해하는 것은 컴포넌트의 동작을 파악하는 데 매우 중요합니다.

### Vue 생명주기 다이어그램

```
생성 단계 → 마운트 단계 → 업데이트 단계 → 소멸 단계
   ↓          ↓          ↓          ↓
Created    Mounted    Updated   Unmounted
```

### Vue 2 vs Vue 3 생명주기 대조표

| Vue 2 (Options API) | Vue 3 (Options API) | Vue 3 (Composition API) | 설명                       |
| ------------------- | ------------------- | ----------------------- | -------------------------- |
| `beforeCreate`      | `beforeCreate`      | `setup()`               | 컴포넌트 인스턴스 초기화 전 |
| `created`           | `created`           | `setup()`               | 컴포넌트 인스턴스 생성 완료 |
| `beforeMount`       | `beforeMount`       | `onBeforeMount`         | DOM에 마운트되기 전         |
| `mounted`           | `mounted`           | `onMounted`             | DOM에 마운트된 후           |
| `beforeUpdate`      | `beforeUpdate`      | `onBeforeUpdate`        | 데이터 업데이트 전          |
| `updated`           | `updated`           | `onUpdated`             | 데이터 업데이트 후          |
| `beforeDestroy`     | `beforeUnmount`     | `onBeforeUnmount`       | 컴포넌트 언마운트 전        |
| `destroyed`         | `unmounted`         | `onUnmounted`           | 컴포넌트 언마운트 후        |
| `activated`         | `activated`         | `onActivated`           | keep-alive 컴포넌트 활성화 시 |
| `deactivated`       | `deactivated`       | `onDeactivated`         | keep-alive 컴포넌트 비활성화 시 |
| `errorCaptured`     | `errorCaptured`     | `onErrorCaptured`       | 자식 컴포넌트 에러 캡처 시  |

### 1. 생성 단계 (Creation Phase)

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // ❌ 이 시점에서는 data, methods가 아직 초기화되지 않음
    console.log('beforeCreate');
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // ✅ 이 시점에서 data, computed, methods, watch가 모두 초기화됨
    console.log('created');
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined (아직 DOM에 마운트되지 않음)

    // ✅ 여기서 API 요청을 보내기 적합
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**사용 시점:**

- `beforeCreate`: 거의 사용하지 않으며, 주로 플러그인 개발에 사용
- `created`:
  - ✅ API 요청 보내기
  - ✅ 비반응형 데이터 초기화
  - ✅ 이벤트 리스너 설정
  - ❌ DOM 조작 불가 (아직 마운트되지 않음)

### 2. 마운트 단계 (Mounting Phase)

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Vue Lifecycle',
    };
  },

  beforeMount() {
    // ❌ 이 시점에서 Virtual DOM은 생성되었지만, 실제 DOM에 렌더링되지 않음
    console.log('beforeMount');
    console.log(this.$el); // 존재하지만, 내용은 이전 것
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    // ✅ 이 시점에서 컴포넌트가 DOM에 마운트됨, DOM 요소를 조작할 수 있음
    console.log('mounted');
    console.log(this.$el); // 실제 DOM 요소
    console.log(this.$refs.myElement); // ref에 접근 가능

    // ✅ 여기서 DOM을 조작하기 적합
    this.initCanvas();

    // ✅ 여기서 서드파티 DOM 패키지를 사용하기 적합
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // canvas 그리기...
    },

    initChart() {
      // 차트 패키지 초기화 (예: Chart.js, ECharts)
      new Chart(this.$refs.myCanvas, {
        type: 'bar',
        data: {
          /* ... */
        },
      });
    },
  },
};
</script>
```

**사용 시점:**

- `beforeMount`: 거의 사용하지 않음
- `mounted`:
  - ✅ DOM 요소 조작
  - ✅ 서드파티 DOM 패키지 초기화 (차트, 지도 등)
  - ✅ DOM이 필요한 이벤트 리스너 설정
  - ✅ 타이머 시작
  - ⚠️ **주의**: 자식 컴포넌트의 `mounted`가 부모 컴포넌트의 `mounted`보다 먼저 실행됨

### 3. 업데이트 단계 (Updating Phase)

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>카운트: {{ count }}</p>
    <button @click="count++">증가</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },

  beforeUpdate() {
    // ✅ 데이터는 업데이트되었지만, DOM은 아직 업데이트되지 않음
    console.log('beforeUpdate');
    console.log('data count:', this.count); // 새 값
    console.log('DOM count:', this.$el.querySelector('p').textContent); // 이전 값

    // 여기서 업데이트 전 DOM 상태에 접근할 수 있음
  },

  updated() {
    // ✅ 데이터와 DOM이 모두 업데이트됨
    console.log('updated');
    console.log('data count:', this.count); // 새 값
    console.log('DOM count:', this.$el.querySelector('p').textContent); // 새 값

    // ⚠️ 주의: 여기서 데이터를 수정하면 무한 루프가 발생함
    // this.count++; // ❌ 잘못됨! 무한 업데이트 발생
  },
};
</script>
```

**사용 시점:**

- `beforeUpdate`: DOM 업데이트 전에 이전 DOM 상태에 접근해야 할 때
- `updated`:
  - ✅ DOM 업데이트 후 수행해야 할 작업 (예: 요소 크기 재계산)
  - ❌ **여기서 데이터를 수정하지 마세요**, 무한 업데이트 루프가 발생함
  - ⚠️ 데이터 변화 후 작업을 수행해야 한다면, `watch` 또는 `nextTick` 사용을 권장

### 4. 소멸 단계 (Unmounting Phase)

#### `beforeUnmount` / `unmounted` (Vue 3) / `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    // 타이머 설정
    this.timer = setInterval(() => {
      console.log('타이머 실행 중...');
    }, 1000);

    // WebSocket 연결 생성
    this.ws = new WebSocket('ws://example.com');
    this.ws.onmessage = (event) => {
      console.log('메시지 수신:', event.data);
    };

    // 이벤트 리스너 설정
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  },

  beforeUnmount() {
    // Vue 3에서는 beforeUnmount 사용
    // Vue 2에서는 beforeDestroy 사용
    console.log('beforeUnmount');
    // 컴포넌트가 곧 소멸되지만, 아직 데이터와 DOM에 접근 가능
  },

  unmounted() {
    // Vue 3에서는 unmounted 사용
    // Vue 2에서는 destroyed 사용
    console.log('unmounted');

    // ✅ 타이머 정리
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // ✅ WebSocket 연결 닫기
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // ✅ 이벤트 리스너 제거
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  },

  methods: {
    handleResize() {
      console.log('창 크기 변경');
    },
    handleClick() {
      console.log('클릭 이벤트');
    },
  },
};
</script>
```

**사용 시점:**

- `beforeUnmount` / `beforeDestroy`: 거의 사용하지 않음
- `unmounted` / `destroyed`:
  - ✅ 타이머 정리 (`setInterval`, `setTimeout`)
  - ✅ 이벤트 리스너 제거
  - ✅ WebSocket 연결 닫기
  - ✅ 미완료 API 요청 취소
  - ✅ 서드파티 패키지 인스턴스 정리

### 5. 특수 컴포넌트: KeepAlive

#### `<KeepAlive>`란?

`<KeepAlive>`는 Vue의 내장 컴포넌트로, 주요 기능은 **컴포넌트 인스턴스를 캐싱**하여 전환 시 컴포넌트가 소멸되지 않도록 하는 것입니다.

- **기본 동작**: 컴포넌트가 전환될 때 (예: 라우트 전환이나 `v-if` 전환), Vue는 이전 컴포넌트를 소멸시키고 새 컴포넌트를 생성합니다.
- **KeepAlive 동작**: `<KeepAlive>`로 감싼 컴포넌트는 전환 시 상태가 메모리에 보존되며 소멸되지 않습니다.

#### 핵심 기능과 특성

1. **상태 캐싱**: 폼 입력 내용, 스크롤 위치 등을 보존합니다.
2. **성능 최적화**: 반복적인 렌더링과 반복적인 API 요청을 방지합니다.
3. **전용 생명주기**: `activated`와 `deactivated` 두 개의 고유 훅을 제공합니다.

#### 적용 시나리오

1. **멀티 탭 전환**: 예를 들어 관리자 시스템의 Tabs.
2. **리스트와 상세 페이지 전환**: 리스트 페이지에서 상세 페이지로 이동 후 돌아올 때, 리스트의 스크롤 위치와 필터 조건을 보존하고 싶은 경우.
3. **복잡한 폼**: 작성 중간에 다른 페이지로 전환하여 데이터를 확인하고 돌아왔을 때 폼 내용이 사라지지 않아야 하는 경우.

#### 사용 예제

```vue
<template>
  <KeepAlive include="UserList,ProductList">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

- `include`: 이름이 일치하는 컴포넌트만 캐싱됩니다.
- `exclude`: 이름이 일치하는 컴포넌트는 캐싱되지 **않습니다**.
- `max`: 최대 캐싱할 컴포넌트 인스턴스 수.

### 6. 특수 생명주기 훅

#### `activated` / `deactivated` (`<KeepAlive>`와 함께 사용)

```vue
<template>
  <div>
    <button @click="toggleComponent">컴포넌트 전환</button>

    <!-- keep-alive는 컴포넌트를 캐싱하여, 다시 생성하지 않음 -->
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script>
// ChildComponent.vue
export default {
  name: 'ChildComponent',

  mounted() {
    console.log('mounted - 한 번만 실행됨');
  },

  activated() {
    console.log('activated - 컴포넌트가 활성화될 때마다 실행됨');
    // ✅ 여기서 데이터를 다시 가져오기 적합
    this.refreshData();
  },

  deactivated() {
    console.log('deactivated - 컴포넌트가 비활성화될 때마다 실행됨');
    // ✅ 여기서 작업을 일시 중지하기 적합 (예: 동영상 재생)
    this.pauseVideo();
  },

  unmounted() {
    console.log('unmounted - 실행되지 않음 (keep-alive로 캐싱되었으므로)');
  },

  methods: {
    refreshData() {
      // 데이터 새로고침
    },
    pauseVideo() {
      // 동영상 재생 일시 중지
    },
  },
};
</script>
```

#### `errorCaptured` (에러 처리)

```vue
<script>
// ParentComponent.vue
export default {
  errorCaptured(err, instance, info) {
    console.error('자식 컴포넌트 에러 캡처:', err);
    console.log('에러 발생 컴포넌트:', instance);
    console.log('에러 정보:', info);

    // false를 반환하면 에러가 상위로 전파되는 것을 방지할 수 있음
    return false;
  },
};
</script>
```

### Vue 3 Composition API의 생명주기

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() 자체가 beforeCreate + created에 해당
console.log('setup 실행');

onBeforeMount(() => {
  console.log('onBeforeMount');
});

onMounted(() => {
  console.log('onMounted');
  // ✅ DOM 조작, 패키지 초기화
});

onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
});

onUpdated(() => {
  console.log('onUpdated');
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
});

onUnmounted(() => {
  console.log('onUnmounted');
  // ✅ 리소스 정리
});

onActivated(() => {
  console.log('onActivated');
});

onDeactivated(() => {
  console.log('onDeactivated');
});

onErrorCaptured((err, instance, info) => {
  console.error('에러:', err);
  return false;
});
</script>
```

## 2. What's the execution order of parent and child component lifecycle hooks?

> 부모-자식 컴포넌트의 생명주기 실행 순서는 무엇인가요?

이것은 매우 중요한 면접 질문으로, 부모-자식 컴포넌트의 생명주기 실행 순서를 이해하면 컴포넌트 간의 상호작용을 파악하는 데 도움이 됩니다.

### 실행 순서

```
부모 beforeCreate
→ 부모 created
→ 부모 beforeMount
→ 자식 beforeCreate
→ 자식 created
→ 자식 beforeMount
→ 자식 mounted
→ 부모 mounted
```

**핵심 포인트: "생성은 바깥에서 안으로, 마운트는 안에서 바깥으로"**

### 실제 예제

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>부모 컴포넌트</h1>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentComponent',
  components: { ChildComponent },

  beforeCreate() {
    console.log('1. 부모 beforeCreate');
  },
  created() {
    console.log('2. 부모 created');
  },
  beforeMount() {
    console.log('3. 부모 beforeMount');
  },
  mounted() {
    console.log('8. 부모 mounted');
  },
  beforeUpdate() {
    console.log('부모 beforeUpdate');
  },
  updated() {
    console.log('부모 updated');
  },
  beforeUnmount() {
    console.log('9. 부모 beforeUnmount');
  },
  unmounted() {
    console.log('12. 부모 unmounted');
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>자식 컴포넌트</h2>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',

  beforeCreate() {
    console.log('4. 자식 beforeCreate');
  },
  created() {
    console.log('5. 자식 created');
  },
  beforeMount() {
    console.log('6. 자식 beforeMount');
  },
  mounted() {
    console.log('7. 자식 mounted');
  },
  beforeUpdate() {
    console.log('자식 beforeUpdate');
  },
  updated() {
    console.log('자식 updated');
  },
  beforeUnmount() {
    console.log('10. 자식 beforeUnmount');
  },
  unmounted() {
    console.log('11. 자식 unmounted');
  },
};
</script>
```

### 각 단계별 실행 순서

#### 1. 생성 및 마운트 단계

```
1. 부모 beforeCreate
2. 부모 created
3. 부모 beforeMount
4. 자식 beforeCreate
5. 자식 created
6. 자식 beforeMount
7. 자식 mounted        ← 자식 컴포넌트가 먼저 마운트 완료
8. 부모 mounted        ← 부모 컴포넌트가 나중에 마운트 완료
```

**이유**: 부모 컴포넌트는 자식 컴포넌트가 마운트를 완료한 후에야 전체 컴포넌트 트리가 완전히 렌더링되었음을 확인할 수 있습니다.

#### 2. 업데이트 단계

```
부모 컴포넌트 데이터 변경:
1. 부모 beforeUpdate
2. 자식 beforeUpdate  ← 자식 컴포넌트가 부모 컴포넌트의 데이터를 사용하는 경우
3. 자식 updated
4. 부모 updated

자식 컴포넌트 데이터 변경:
1. 자식 beforeUpdate
2. 자식 updated
(부모 컴포넌트는 업데이트가 트리거되지 않음)
```

#### 3. 소멸 단계

```
9. 부모 beforeUnmount
10. 자식 beforeUnmount
11. 자식 unmounted     ← 자식 컴포넌트가 먼저 소멸
12. 부모 unmounted     ← 부모 컴포넌트가 나중에 소멸
```

### 여러 자식 컴포넌트의 경우

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-a />
    <child-b />
    <child-c />
  </div>
</template>
```

실행 순서:

```
1. 부모 beforeCreate
2. 부모 created
3. 부모 beforeMount
4. 자식A beforeCreate
5. 자식A created
6. 자식A beforeMount
7. 자식B beforeCreate
8. 자식B created
9. 자식B beforeMount
10. 자식C beforeCreate
11. 자식C created
12. 자식C beforeMount
13. 자식A mounted
14. 자식B mounted
15. 자식C mounted
16. 부모 mounted
```

### 이 순서인 이유

#### 마운트 단계 (Mounting)

Vue의 마운트 과정은 "깊이 우선 탐색"과 유사합니다:

1. 부모 컴포넌트가 생성을 시작
2. 템플릿을 파싱하면서 자식 컴포넌트를 발견
3. 자식 컴포넌트의 완전한 마운트를 먼저 완료
4. 모든 자식 컴포넌트가 마운트된 후 부모 컴포넌트가 마운트를 완료

```
부모 컴포넌트 마운트 준비
    ↓
자식 컴포넌트 발견
    ↓
자식 컴포넌트 완전 마운트 (beforeMount → mounted)
    ↓
부모 컴포넌트 마운트 완료 (mounted)
```

#### 소멸 단계 (Unmounting)

소멸 순서는 "먼저 부모 컴포넌트에 소멸 예정을 통지한 후, 순서대로 자식 컴포넌트를 소멸"합니다:

```
부모 컴포넌트 소멸 준비 (beforeUnmount)
    ↓
자식 컴포넌트에 소멸 준비 통지 (beforeUnmount)
    ↓
자식 컴포넌트 소멸 완료 (unmounted)
    ↓
부모 컴포넌트 소멸 완료 (unmounted)
```

### 실제 활용 시나리오

#### 시나리오 1: 부모 컴포넌트가 자식 컴포넌트 데이터 로딩 완료를 기다려야 하는 경우

```vue
<!-- ParentComponent.vue -->
<script>
export default {
  data() {
    return {
      childrenReady: false,
    };
  },

  mounted() {
    // ✅ 이 시점에서 모든 자식 컴포넌트가 마운트 완료
    console.log('모든 자식 컴포넌트가 준비됨');
    this.childrenReady = true;
  },
};
</script>
```

#### 시나리오 2: 자식 컴포넌트가 부모 컴포넌트에서 제공하는 데이터에 접근해야 하는 경우

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  inject: ['parentData'], // 부모 컴포넌트에서 제공하는 데이터 수신

  created() {
    // ✅ 이 시점에서 부모 컴포넌트의 데이터에 접근 가능 (부모의 created가 이미 실행됨)
    console.log('부모 컴포넌트 데이터:', this.parentData);
  },
};
</script>
```

#### 시나리오 3: `mounted`에서 아직 마운트되지 않은 자식 컴포넌트에 접근하는 것을 피하기

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="child" />
</template>

<script>
export default {
  mounted() {
    // ✅ 이 시점에서 자식 컴포넌트가 마운트됨, 안전하게 접근 가능
    this.$refs.child.someMethod();
  },
};
</script>
```

### 흔한 실수

#### 실수 1: 부모 컴포넌트의 `created`에서 자식 컴포넌트의 ref에 접근

```vue
<!-- ❌ 잘못됨 -->
<script>
export default {
  created() {
    // 이 시점에서 자식 컴포넌트는 아직 생성되지 않음
    console.log(this.$refs.child); // undefined
  },
};
</script>

<!-- ✅ 올바름 -->
<script>
export default {
  mounted() {
    // 이 시점에서 자식 컴포넌트가 마운트됨
    console.log(this.$refs.child); // 접근 가능
  },
};
</script>
```

#### 실수 2: 자식 컴포넌트가 부모 컴포넌트보다 먼저 마운트된다고 가정

```vue
<!-- ❌ 잘못됨 -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // 부모 컴포넌트가 이미 마운트되었다고 가정 (잘못됨!)
    this.$parent.someMethod(); // 에러가 발생할 수 있음
  },
};
</script>

<!-- ✅ 올바름 -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // $nextTick을 사용하여 부모 컴포넌트도 마운트되었는지 확인
    this.$nextTick(() => {
      this.$parent.someMethod();
    });
  },
};
</script>
```

## 3. When should we use each lifecycle hook?

> 각 생명주기 훅은 언제 사용해야 하나요?

여기서는 각 생명주기 훅의 최적 사용 시나리오를 정리합니다.

### 생명주기 사용 시나리오 요약표

| 생명주기    | 일반적인 용도          | 접근 가능한 내용            |
| ----------- | ---------------------- | --------------------------- |
| `created`   | API 요청, 데이터 초기화 | ✅ data, methods ❌ DOM     |
| `mounted`   | DOM 조작, 패키지 초기화 | ✅ data, methods, DOM       |
| `updated`   | DOM 업데이트 후 작업    | ✅ 새로운 DOM               |
| `unmounted` | 리소스 정리            | ✅ 타이머, 이벤트 정리      |
| `activated` | keep-alive 활성화 시   | ✅ 데이터 다시 가져오기     |

### 실제 활용 예제

#### 1. `created`: API 요청 보내기

```vue
<script>
export default {
  data() {
    return {
      users: [],
      loading: true,
      error: null,
    };
  },

  created() {
    // ✅ 여기서 API 요청을 보내기 적합
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2. `mounted`: 서드파티 패키지 초기화

```vue
<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartInstance: null,
    };
  },

  mounted() {
    // ✅ 여기서 DOM이 필요한 패키지를 초기화하기 적합
    this.initChart();
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: { text: '판매 데이터' },
        xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: {},
        series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
      });
    },
  },

  unmounted() {
    // ✅ 차트 인스턴스 정리를 잊지 마세요
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>
```

#### 3. `unmounted`: 리소스 정리

```vue
<script>
export default {
  data() {
    return {
      intervalId: null,
      observer: null,
    };
  },

  mounted() {
    // 타이머 시작
    this.intervalId = setInterval(() => {
      console.log('실행 중...');
    }, 1000);

    // Intersection Observer 생성
    this.observer = new IntersectionObserver((entries) => {
      console.log(entries);
    });
    this.observer.observe(this.$el);

    // 전역 이벤트 리스닝
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    // ✅ 타이머 정리
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // ✅ Observer 정리
    if (this.observer) {
      this.observer.disconnect();
    }

    // ✅ 이벤트 리스너 제거
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      console.log('창 크기 변경');
    },
  },
};
</script>
```

### 기억 요령

1. **`created`**: "생성 완료, 데이터 사용 가능" → API 요청
2. **`mounted`**: "마운트 완료, DOM 사용 가능" → DOM 조작, 서드파티 패키지
3. **`updated`**: "업데이트 완료, DOM 동기화됨" → DOM 업데이트 후 작업
4. **`unmounted`**: "언마운트 완료, 정리를 잊지 말 것" → 리소스 정리

## Reference

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Vue 2 Lifecycle Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Vue 3 Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html)
- [Composition API: Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
