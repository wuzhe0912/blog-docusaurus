---
id: vue-basic-api
title: '[Medium] Vue Basic & API'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> Vue 프레임워크의 핵심 원리와 장점을 설명하세요.

### 핵심 원리

Vue는 점진적인 JavaScript 프레임워크로, 핵심 원리는 다음과 같은 중요한 개념들을 포함합니다:

#### 1. Virtual DOM

Virtual DOM을 사용하여 성능을 향상시킵니다. 변경된 DOM 노드만 업데이트하며, 전체 DOM Tree를 다시 렌더링하지 않습니다. diff 알고리즘으로 신구 Virtual DOM의 차이를 비교하여, 차이가 있는 부분에 대해서만 실제 DOM 조작을 수행합니다.

```js
// Virtual DOM 개념 예시
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. 양방향 데이터 바인딩 (Two-way Data Binding)

양방향 데이터 바인딩을 사용하여 모델(Model)이 변경되면 뷰(View)가 자동으로 업데이트되고, 그 반대도 마찬가지입니다. 개발자가 DOM을 직접 조작할 필요 없이 데이터의 변화에만 집중할 수 있습니다.

```vue
<!-- Vue 3 권장 작성법: <script setup> -->
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue');
</script>
```

<details>
<summary>Options API 작성법</summary>

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },
};
</script>
```

</details>

#### 3. 컴포넌트 기반 (Component-based)

전체 애플리케이션을 개별 컴포넌트로 분리하여 재사용성을 높이고, 유지보수와 개발을 더 효율적으로 만듭니다. 각 컴포넌트는 자체적인 상태, 스타일, 로직을 가지며 독립적으로 개발하고 테스트할 수 있습니다.

```vue
<!-- Button.vue - Vue 3 <script setup> -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>
```

#### 4. Lifecycle Hooks

자체적인 생명주기를 가지고 있어, 데이터가 변경될 때 해당하는 생명주기 훅이 트리거되므로, 특정 생명주기에서 적절한 작업을 수행할 수 있습니다.

```vue
<!-- Vue 3 <script setup> 작성법 -->
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  // 컴포넌트 마운트 후 실행
  console.log('Component mounted!');
});

onUpdated(() => {
  // 데이터 업데이트 후 실행
  console.log('Component updated!');
});

onUnmounted(() => {
  // 컴포넌트 언마운트 후 실행
  console.log('Component unmounted!');
});
</script>
```

#### 5. 디렉티브 시스템 (Directives)

`v-if`, `v-for`, `v-bind`, `v-model` 등 자주 사용되는 디렉티브를 제공하여, 개발자가 더 빠르게 개발할 수 있도록 합니다.

```vue
<template>
  <!-- 조건부 렌더링 -->
  <div v-if="isVisible">콘텐츠 표시</div>

  <!-- 리스트 렌더링 -->
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <!-- 속성 바인딩 -->
  <img :src="imageUrl" :alt="imageAlt" />

  <!-- 양방향 바인딩 -->
  <input v-model="username" />
</template>
```

#### 6. 템플릿 문법 (Template Syntax)

template을 사용하여 HTML을 작성하며, 보간법(interpolation)을 통해 데이터를 직접 template에 렌더링할 수 있습니다.

```vue
<template>
  <div>
    <!-- 텍스트 보간 -->
    <p>{{ message }}</p>

    <!-- 표현식 -->
    <p>{{ count + 1 }}</p>

    <!-- 메서드 호출 -->
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Vue의 고유 장점 (React와 비교)

#### 1. 낮은 학습 곡선

팀 구성원 간의 실력 격차가 크지 않으며, 공식적으로 통일된 코딩 스타일을 규정하여 과도한 자유를 방지합니다. 또한 서로 다른 프로젝트 유지보수에도 더 빠르게 적응할 수 있습니다.

```vue
<!-- Vue의 단일 파일 컴포넌트 구조가 명확함 -->
<template>
  <!-- HTML 템플릿 -->
</template>

<script>
// JavaScript 로직
</script>

<style>
/* CSS 스타일 */
</style>
```

#### 2. 고유한 디렉티브 문법

이 점은 호불호가 갈릴 수 있지만, Vue의 디렉티브 시스템은 일반적인 UI 로직을 처리하는 더 직관적인 방법을 제공합니다:

```vue
<!-- Vue 디렉티브 -->
<div v-if="isLoggedIn">환영합니다</div>
<button @click="handleClick">클릭</button>

<!-- React JSX -->
<div>{isLoggedIn && '환영합니다'}</div>
<button onClick="{handleClick}">클릭</button>
```

#### 3. 양방향 데이터 바인딩이 더 쉬움

자체 디렉티브를 가지고 있어 개발자가 양방향 데이터 바인딩을 매우 쉽게 구현할 수 있습니다(`v-model`). React도 유사한 기능을 구현할 수 있지만, Vue만큼 직관적이지는 않습니다.

```vue
<!-- Vue 양방향 바인딩 -->
<input v-model="username" />

<!-- React는 수동 처리 필요 -->
<input value={username} onChange={(e) => setUsername(e.target.value)} />
```

#### 4. 템플릿과 로직의 분리

React의 JSX는 일부 개발자들에게 비판을 받기도 하며, 특정 개발 환경에서는 로직과 UI를 분리하는 것이 더 읽기 쉽고 유지보수하기 좋습니다.

```vue
<!-- Vue: 구조가 명확함 -->
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: 'John',
        email: 'john@example.com',
      },
    };
  },
};
</script>
```

#### 5. 완전한 공식 생태계

Vue 공식에서 완전한 솔루션(Vue Router, Vuex/Pinia, Vue CLI)을 제공하므로, 수많은 서드파티 패키지 중에서 선택할 필요가 없습니다.

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> `v-model`, `v-bind`, `v-html`의 사용법을 설명하세요.

### `v-model`: 양방향 데이터 바인딩

데이터를 변경하면 동시에 template에 렌더링되는 내용이 변경되고, 반대로 template의 내용을 변경하면 데이터도 업데이트됩니다.

```vue
<template>
  <div>
    <!-- 텍스트 입력 -->
    <input v-model="message" />
    <p>입력 내용: {{ message }}</p>

    <!-- 체크박스 -->
    <input type="checkbox" v-model="checked" />
    <p>체크 여부: {{ checked }}</p>

    <!-- 선택 목록 -->
    <select v-model="selected">
      <option value="A">옵션 A</option>
      <option value="B">옵션 B</option>
    </select>
    <p>선택된 옵션: {{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      selected: 'A',
    };
  },
};
</script>
```

#### `v-model`의 수식어

```vue
<!-- .lazy: change 이벤트 후에 업데이트 -->
<input v-model.lazy="msg" />

<!-- .number: 자동으로 숫자로 변환 -->
<input v-model.number="age" type="number" />

<!-- .trim: 앞뒤 공백 자동 제거 -->
<input v-model.trim="msg" />
```

### `v-bind`: 동적 속성 바인딩

class나 링크, 이미지 등을 바인딩할 때 자주 사용됩니다. `v-bind`로 class를 바인딩하면 데이터 변동에 따라 해당 class 스타일의 적용 여부를 결정할 수 있습니다. 마찬가지로 API에서 반환하는 이미지 경로나 링크 URL도 바인딩을 통해 동적 업데이트를 유지할 수 있습니다.

```vue
<template>
  <div>
    <!-- class 바인딩 (:class로 축약 가능) -->
    <div :class="{ active: isActive, 'text-danger': hasError }">동적 class</div>

    <!-- style 바인딩 -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">동적 스타일</div>

    <!-- 이미지 경로 바인딩 -->
    <img :src="imageUrl" :alt="imageAlt" />

    <!-- 링크 바인딩 -->
    <a :href="linkUrl">링크로 이동</a>

    <!-- 커스텀 속성 바인딩 -->
    <div :data-id="userId" :data-name="userName"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      textColor: 'red',
      fontSize: 16,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: '이미지 설명',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### `v-bind`의 축약

```vue
<!-- 전체 작성법 -->
<img v-bind:src="imageUrl" />

<!-- 축약 -->
<img :src="imageUrl" />

<!-- 여러 속성 바인딩 -->
<div v-bind="objectOfAttrs"></div>
```

### `v-html`: HTML 문자열 렌더링

데이터에 HTML 태그가 포함된 경우 이 디렉티브를 사용하여 렌더링할 수 있습니다. 예를 들어 Markdown 문법이나 `<img>` 태그가 포함된 이미지 경로를 표시할 때 사용합니다.

```vue
<template>
  <div>
    <!-- 일반 보간: HTML 태그가 그대로 표시됨 -->
    <p>{{ rawHtml }}</p>
    <!-- 출력: <span style="color: red">빨간 텍스트</span> -->

    <!-- v-html: HTML을 렌더링함 -->
    <p v-html="rawHtml"></p>
    <!-- 출력: 빨간 텍스트 (실제로 빨간색으로 렌더링) -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">빨간 텍스트</span>',
    };
  },
};
</script>
```

#### 보안 경고

**사용자가 제공한 콘텐츠에 `v-html`을 절대 사용하지 마세요**. XSS(크로스 사이트 스크립팅) 취약점을 유발할 수 있습니다!

```vue
<!-- ❌ 위험: 사용자가 악성 스크립트를 주입할 수 있음 -->
<div v-html="userProvidedContent"></div>

<!-- ✅ 안전: 신뢰할 수 있는 콘텐츠에만 사용 -->
<div v-html="markdownRenderedContent"></div>
```

#### 안전한 대안

```vue
<template>
  <div>
    <!-- 패키지를 사용하여 HTML 정화 -->
    <div v-html="sanitizedHtml"></div>
  </div>
</template>

<script>
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      userInput: '<img src=x onerror=alert("XSS")>',
    };
  },
  computed: {
    sanitizedHtml() {
      // DOMPurify를 사용하여 HTML 정화
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### 세 가지 비교 요약

| 디렉티브  | 용도                | 축약 | 예시                        |
| --------- | ------------------- | ---- | --------------------------- |
| `v-model` | 양방향 폼 요소 바인딩 | 없음 | `<input v-model="msg">`     |
| `v-bind`  | 단방향 속성 바인딩  | `:`  | `<img :src="url">`          |
| `v-html`  | HTML 문자열 렌더링  | 없음 | `<div v-html="html"></div>` |

## 3. How to access HTML elements (Template Refs)?

> Vue에서 HTML 요소를 조작하려면, 예를 들어 input 요소를 가져와서 포커스(focus)를 주려면 어떻게 해야 하나요?

Vue에서는 `document.querySelector`를 사용하여 DOM 요소를 가져오는 것을 권장하지 않으며, **Template Refs**를 사용합니다.

### Options API (Vue 2 / Vue 3)

`ref` 속성을 사용하여 템플릿에서 요소를 표시하고, `this.$refs`를 통해 접근합니다.

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      // DOM 요소 접근
      this.$refs.inputElement.focus();
    },
  },
  mounted() {
    // 컴포넌트 마운트 후에 접근해야 함
    console.log(this.$refs.inputElement);
  },
};
</script>
```

### Composition API (Vue 3)

`<script setup>`에서 동일한 이름의 `ref` 변수를 선언하여 요소를 가져옵니다.

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. template ref와 동일한 이름의 변수를 선언하고, 초기값은 null
const inputElement = ref(null);

const focusInput = () => {
  // 2. .value를 통해 DOM에 접근
  inputElement.value?.focus();
};

onMounted(() => {
  // 3. 컴포넌트 마운트 후에 접근해야 함
  console.log(inputElement.value);
});
</script>
```

**주의사항**:

- 변수 이름은 template의 `ref` 속성 값과 정확히 일치해야 합니다.
- 컴포넌트 마운트(`onMounted`) 이후에만 DOM 요소에 접근할 수 있으며, 그렇지 않으면 `null`입니다.
- `v-for` 루프에서 사용할 경우, ref는 배열이 됩니다.

## 4. Please explain the difference between `v-show` and `v-if`

> `v-show`와 `v-if`의 차이를 설명하세요.

### 공통점

둘 다 DOM 요소의 표시/숨김을 제어하며, 조건에 따라 콘텐츠를 표시할지 여부를 결정합니다.

```vue
<template>
  <!-- isVisible이 true일 때, 둘 다 콘텐츠를 표시 -->
  <div v-if="isVisible">v-if 사용</div>
  <div v-show="isVisible">v-show 사용</div>
</template>
```

### 차이점

#### 1. DOM 조작 방식이 다름

```vue
<template>
  <div>
    <!-- v-show: CSS display 속성으로 제어 -->
    <div v-show="false">이 요소는 DOM에 존재하지만, display: none 상태</div>

    <!-- v-if: DOM에서 직접 제거하거나 추가 -->
    <div v-if="false">이 요소는 DOM에 존재하지 않음</div>
  </div>
</template>
```

실제 렌더링 결과:

```html
<!-- v-show 렌더링 결과 -->
<div style="display: none;">이 요소는 DOM에 존재하지만, display: none 상태</div>

<!-- v-if 렌더링 결과: false일 때 완전히 존재하지 않음 -->
<!-- DOM 노드 없음 -->
```

#### 2. 성능 차이

**`v-show`**:

- 초기 렌더링 비용이 큼 (요소가 반드시 생성됨)
- 전환 비용이 작음 (CSS만 변경)
- **빈번한 전환**에 적합

**`v-if`**:

- 초기 렌더링 비용이 작음 (조건이 false이면 렌더링하지 않음)
- 전환 비용이 큼 (요소 파괴/재생성 필요)
- **조건이 자주 변경되지 않는** 경우에 적합

```vue
<template>
  <div>
    <!-- 빈번한 전환: v-show 사용 -->
    <button @click="toggleModal">모달 토글</button>
    <div v-show="showModal" class="modal">
      모달 내용 (빈번하게 열고 닫으므로, v-show가 성능이 더 좋음)
    </div>

    <!-- 거의 변경되지 않음: v-if 사용 -->
    <div v-if="userRole === 'admin'" class="admin-panel">
      관리자 패널 (로그인 후 거의 변경되지 않으므로, v-if 사용)
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      userRole: 'user',
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
  },
};
</script>
```

#### 3. 생명주기 트리거

**`v-if`**:

- 컴포넌트의 **전체 생명주기**를 트리거
- 조건이 false일 때 `unmounted` 훅이 실행됨
- 조건이 true일 때 `mounted` 훅이 실행됨

```vue
<template>
  <child-component v-if="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('컴포넌트 마운트됨'); // v-if가 false에서 true로 변경 시 실행
  },
  unmounted() {
    console.log('컴포넌트 언마운트됨'); // v-if가 true에서 false로 변경 시 실행
  },
};
</script>
```

**`v-show`**:

- 컴포넌트의 생명주기를 **트리거하지 않음**
- 컴포넌트가 항상 마운트된 상태 유지
- CSS로만 숨김

```vue
<template>
  <child-component v-show="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('컴포넌트 마운트됨'); // 첫 번째 렌더링 시 한 번만 실행
  },
  unmounted() {
    console.log('컴포넌트 언마운트됨'); // 실행되지 않음 (부모 컴포넌트가 파괴되지 않는 한)
  },
};
</script>
```

#### 4. 초기 렌더링 비용

```vue
<template>
  <div>
    <!-- v-if: 초기값이 false이면 완전히 렌더링하지 않음 -->
    <heavy-component v-if="false" />

    <!-- v-show: 초기값이 false여도 렌더링 후 숨김 -->
    <heavy-component v-show="false" />
  </div>
</template>
```

`heavy-component`가 무거운 컴포넌트인 경우:

- `v-if="false"`: 초기 로딩이 더 빠름 (렌더링하지 않음)
- `v-show="false"`: 초기 로딩이 더 느림 (렌더링 후 숨김)

#### 5. 다른 디렉티브와의 조합

`v-if`는 `v-else-if`와 `v-else`와 함께 사용할 수 있습니다:

```vue
<template>
  <div>
    <div v-if="type === 'A'">유형 A</div>
    <div v-else-if="type === 'B'">유형 B</div>
    <div v-else>기타 유형</div>
  </div>
</template>
```

`v-show`는 `v-else`와 함께 사용할 수 없습니다:

```vue
<!-- ❌ 오류: v-show는 v-else를 사용할 수 없음 -->
<div v-show="type === 'A'">유형 A</div>
<div v-else>기타 유형</div>

<!-- ✅ 올바름: 각각 조건을 설정해야 함 -->
<div v-show="type === 'A'">유형 A</div>
<div v-show="type !== 'A'">기타 유형</div>
```

### computed와 watch 사용 권장 사항

#### `v-if`를 사용해야 하는 상황

1. 조건이 거의 변경되지 않음
2. 초기 조건이 false이며, 영원히 true가 되지 않을 수 있음
3. `v-else-if` 또는 `v-else`와 함께 사용해야 함
4. 컴포넌트 내에 정리해야 할 리소스가 있음 (타이머, 이벤트 리스너 등)

```vue
<template>
  <!-- 권한 제어: 로그인 후 거의 변경되지 않음 -->
  <admin-panel v-if="isAdmin" />

  <!-- 라우팅 관련: 페이지 전환 시에만 변경 -->
  <home-page v-if="currentRoute === 'home'" />
  <about-page v-else-if="currentRoute === 'about'" />
</template>
```

#### `v-show`를 사용해야 하는 상황

1. 표시 상태를 빈번하게 전환해야 함
2. 컴포넌트 초기화 비용이 높아 상태를 유지하고 싶음
3. 생명주기 훅을 트리거할 필요가 없음

```vue
<template>
  <!-- 탭 전환: 사용자가 자주 전환 -->
  <div v-show="activeTab === 'profile'">프로필</div>
  <div v-show="activeTab === 'settings'">설정</div>

  <!-- 모달: 빈번하게 열고 닫음 -->
  <modal v-show="isModalVisible" />

  <!-- 로딩 애니메이션: 빈번하게 표시/숨김 -->
  <loading-spinner v-show="isLoading" />
</template>
```

### 성능 비교 요약

| 특성           | v-if                        | v-show             |
| -------------- | --------------------------- | ------------------ |
| 초기 렌더링 비용 | 작음 (조건이 false이면 렌더링 안 함) | 큼 (반드시 렌더링) |
| 전환 비용      | 큼 (요소 파괴/재생성)       | 작음 (CSS만 변경)  |
| 적용 시나리오  | 조건이 자주 변경되지 않음   | 빈번한 전환 필요   |
| 생명주기       | 트리거됨                    | 트리거되지 않음    |
| 조합 사용      | v-else-if, v-else           | 없음               |

### 실제 예제 비교

```vue
<template>
  <div>
    <!-- 예제 1: 관리자 패널 (v-if 사용) -->
    <!-- 이유: 로그인 후 거의 변경되지 않으며, 권한 제어가 있음 -->
    <div v-if="userRole === 'admin'">
      <h2>관리자 패널</h2>
      <button @click="deleteUser">사용자 삭제</button>
    </div>

    <!-- 예제 2: 모달 (v-show 사용) -->
    <!-- 이유: 사용자가 빈번하게 모달을 열고 닫음 -->
    <div v-show="isModalOpen" class="modal">
      <h2>모달 제목</h2>
      <p>모달 내용</p>
      <button @click="isModalOpen = false">닫기</button>
    </div>

    <!-- 예제 3: 로딩 애니메이션 (v-show 사용) -->
    <!-- 이유: API 요청 시 빈번하게 표시/숨김 -->
    <div v-show="isLoading" class="loading">
      <spinner />
    </div>

    <!-- 예제 4: 에러 메시지 (v-if 사용) -->
    <!-- 이유: 자주 나타나지 않으며, 나타날 때 다시 렌더링 필요 -->
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: 'user',
      isModalOpen: false,
      isLoading: false,
      errorMessage: '',
    };
  },
};
</script>
```

### v-if와 v-show 핵심 포인트

> - `v-if`: 표시하지 않을 때는 렌더링하지 않음, 조건이 자주 변경되지 않을 때 적합
> - `v-show`: 처음부터 렌더링해 놓고, 언제든 표시할 준비가 됨, 빈번한 전환에 적합

## 5. What's the difference between `computed` and `watch`?

> `computed`와 `watch`의 차이점은 무엇인가요?

이 두 가지는 Vue에서 매우 중요한 반응형 기능으로, 둘 다 데이터 변화를 감시할 수 있지만 사용 시나리오와 특성이 완전히 다릅니다.

### `computed` (계산된 속성)

#### 핵심 특성 (computed)

1. **캐싱 메커니즘**: `computed`로 계산된 결과는 캐싱되며, 의존하는 반응형 데이터가 변경될 때만 다시 계산됨
2. **자동 의존성 추적**: 계산 과정에서 사용된 반응형 데이터를 자동으로 추적
3. **동기 계산**: 반드시 동기 작업이어야 하며, 반환값이 있어야 함
4. **간결한 문법**: template에서 data의 속성처럼 직접 사용할 수 있음

#### 일반적인 사용 시나리오 (computed)

```vue
<!-- Vue 3 <script setup> 작성법 -->
<template>
  <div>
    <!-- 예제 1: 데이터 포맷팅 -->
    <p>전체 이름: {{ fullName }}</p>
    <p>이메일: {{ emailLowerCase }}</p>

    <!-- 예제 2: 장바구니 총액 계산 -->
    <ul>
      <li v-for="item in cart" :key="item.id">
        {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
      </li>
    </ul>
    <p>합계: ${{ cartTotal }}</p>

    <!-- 예제 3: 리스트 필터링 -->
    <input v-model="searchText" placeholder="검색..." />
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const email = ref('JOHN@EXAMPLE.COM');
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);
const searchText = ref('');
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
]);

// 예제 1: 데이터 조합
const fullName = computed(() => {
  console.log('fullName 계산'); // 의존성이 변경될 때만 실행
  return `${firstName.value} ${lastName.value}`;
});

// 예제 2: 데이터 포맷팅
const emailLowerCase = computed(() => {
  return email.value.toLowerCase();
});

// 예제 3: 총액 계산
const cartTotal = computed(() => {
  console.log('cartTotal 계산'); // cart가 변경될 때만 실행
  return cart.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// 예제 4: 리스트 필터링
const filteredItems = computed(() => {
  if (!searchText.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});
</script>
```

#### `computed`의 장점: 캐싱 메커니즘

```vue
<template>
  <div>
    <!-- computed를 여러 번 사용해도 한 번만 계산 -->
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>

    <!-- method를 사용하면 매번 다시 계산 -->
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, index) => index));

const expensiveComputed = computed(() => {
  console.log('computed 실행'); // 한 번만 실행
  return items.value.reduce((sum, item) => sum + item, 0);
});

const expensiveMethod = () => {
  console.log('method 실행'); // 호출할 때마다 다시 계산
  return items.value.reduce((sum, item) => sum + item, 0);
};
</script>
```

#### `computed`의 getter와 setter

```vue
<script setup>
import { computed, onMounted, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  // getter: 읽을 때 실행
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  // setter: 설정할 때 실행
  set(newValue) {
    const names = newValue.split(' ');
    firstName.value = names[0] ?? '';
    lastName.value = names[names.length - 1] ?? '';
  },
});

onMounted(() => {
  console.log(fullName.value); // 'John Doe' (getter 트리거)
  fullName.value = 'Jane Smith'; // setter 트리거
  console.log(firstName.value); // 'Jane'
  console.log(lastName.value); // 'Smith'
});
</script>
```

### `watch` (감시 속성)

#### 핵심 특성 (watch)

1. **수동 데이터 변화 추적**: 감시할 데이터를 명시적으로 지정해야 함
2. **비동기 작업 가능**: API 호출, 타이머 설정 등에 적합
3. **반환값 불필요**: 주로 사이드 이펙트(side effects) 실행에 사용
4. **여러 데이터 감시 가능**: 배열이나 객체 깊은 감시를 통해
5. **신구 값 제공**: 변경 전후의 값을 얻을 수 있음

#### 일반적인 사용 시나리오 (watch)

```vue
<!-- Vue 3 <script setup> 작성법 -->
<template>
  <div>
    <!-- 예제 1: 실시간 검색 -->
    <input v-model="searchQuery" placeholder="사용자 검색..." />
    <div v-if="isSearching">검색 중...</div>
    <ul>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.name }}
      </li>
    </ul>

    <!-- 예제 2: 폼 유효성 검사 -->
    <input v-model="username" placeholder="사용자 이름" />
    <p v-if="usernameError" class="error">{{ usernameError }}</p>

    <!-- 예제 3: 자동 저장 -->
    <textarea v-model="content" placeholder="내용 입력..."></textarea>
    <p v-if="isSaving">저장 중...</p>
    <p v-if="lastSaved">마지막 저장: {{ lastSaved }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const username = ref('');
const usernameError = ref('');
const content = ref('');
const isSaving = ref(false);
const lastSaved = ref(null);

let searchTimer = null;
let saveTimer = null;

// 예제 1: 실시간 검색 (디바운스)
watch(searchQuery, async (newQuery, oldQuery) => {
  console.log(`검색어가 "${oldQuery}"에서 "${newQuery}"로 변경됨`);

  // 이전 타이머 정리
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  // 디바운스 설정: 500ms 후에 검색 실행
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } catch (error) {
      console.error('검색 실패', error);
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// 예제 2: 폼 유효성 검사
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = '사용자 이름은 최소 3자 이상이어야 합니다';
  } else if (newUsername.length > 20) {
    usernameError.value = '사용자 이름은 20자를 초과할 수 없습니다';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value = '사용자 이름은 영문, 숫자, 밑줄만 포함할 수 있습니다';
  } else {
    usernameError.value = '';
  }
});

// 예제 3: 자동 저장
watch(content, (newContent) => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    isSaving.value = true;
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content: newContent }),
      });
      lastSaved.value = new Date().toLocaleTimeString();
    } catch (error) {
      console.error('저장 실패', error);
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  // 타이머 정리
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### `watch`의 옵션

```vue
<!-- Vue 3 <script setup> 작성법 -->
<script setup>
import { ref, watch, onMounted } from 'vue';

const user = ref({
  name: 'John',
  profile: {
    age: 30,
    city: 'Taipei',
  },
});
const items = ref([1, 2, 3]);

// 옵션 1: immediate (즉시 실행)
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`이름이 ${oldName}에서 ${newName}으로 변경됨`);
  },
  { immediate: true } // 컴포넌트 생성 시 즉시 한 번 실행
);

// 옵션 2: deep (깊은 감시)
watch(
  user,
  (newUser, oldUser) => {
    console.log('user 객체 내부가 변경됨');
    console.log('새 값:', newUser);
  },
  { deep: true } // 객체 내부의 모든 속성 변화를 감시
);

// 옵션 3: flush (실행 시점)
watch(
  items,
  (newItems) => {
    console.log('items 변경됨');
  },
  { flush: 'post' } // DOM 업데이트 후 실행 (기본값은 'pre')
);

onMounted(() => {
  // 깊은 감시 테스트
  setTimeout(() => {
    user.value.profile.age = 31; // deep watch를 트리거
  }, 1000);
});
</script>
```

#### 여러 데이터 소스 감시

```vue
<!-- Vue 3 <script setup> 작성법 -->
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// Vue 3 Composition API: 여러 데이터 감시
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`이름이 ${oldFirst} ${oldLast}에서 ${newFirst} ${newLast}으로 변경됨`);
});
</script>
```

### `computed` vs `watch` 비교

| 특성              | computed                   | watch                      |
| ----------------- | -------------------------- | -------------------------- |
| **주요 용도**     | 기존 데이터로 새 데이터 계산 | 데이터 변화 감시 후 사이드 이펙트 실행 |
| **반환값**        | 반드시 반환값 필요         | 반환값 불필요              |
| **캐싱**          | 캐싱 메커니즘 있음         | 캐싱 없음                  |
| **의존성 추적**   | 자동 추적                  | 수동 지정                  |
| **비동기 작업**   | 지원 안 함                 | 지원                       |
| **신구 값**       | 얻을 수 없음               | 얻을 수 있음               |
| **Template 사용** | 직접 사용 가능             | 직접 사용 불가             |
| **실행 시점**     | 의존성 변경 시             | 감시하는 데이터 변경 시    |

### 사용 시나리오 권장 사항

#### `computed`를 사용해야 하는 경우

1. **기존 데이터를 기반으로 새 데이터를 계산**해야 하는 경우
2. 계산 결과를 template에서 **여러 번 사용**해야 하는 경우 (캐싱 활용)
3. **동기 계산**으로 비동기 작업이 필요 없는 경우
4. 데이터 **포맷팅, 필터링, 정렬**이 필요한 경우

```vue
<script setup>
import { computed, ref } from 'vue';

const timestamp = ref(Date.now());
const users = ref([
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false },
  { id: 3, name: 'Carol', isActive: true },
]);
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);

// ✅ 데이터 포맷팅
const formattedDate = computed(() => {
  return new Date(timestamp.value).toLocaleDateString();
});

// ✅ 리스트 필터링
const activeUsers = computed(() => {
  return users.value.filter((user) => user.isActive);
});

// ✅ 합계 계산
const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});
</script>
```

#### `watch`를 사용해야 하는 경우

1. **비동기 작업**이 필요한 경우 (API 요청 등)
2. **사이드 이펙트**를 실행해야 하는 경우 (localStorage 업데이트 등)
3. **디바운스나 스로틀**이 필요한 경우
4. **신구 값을 비교**해야 하는 경우
5. **조건부로 복잡한 로직**을 실행해야 하는 경우

```vue
<script setup>
import { ref, watch } from 'vue';

const userId = ref(1);
const user = ref(null);

// ✅ API 요청
watch(userId, async (newId) => {
  user.value = await fetch(`/api/users/${newId}`).then((response) =>
    response.json()
  );
});

const settings = ref({
  theme: 'dark',
  notifications: true,
});

// ✅ localStorage 동기화
watch(
  settings,
  (newSettings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings));
  },
  { deep: true }
);

const searchQuery = ref('');
let searchTimer = null;

const performSearch = (keyword) => {
  console.log(`검색: ${keyword}`);
};

// ✅ 디바운스 검색
watch(searchQuery, (newQuery) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    performSearch(newQuery);
  }, 500);
});
</script>
```

### 실제 사례 비교

#### 잘못된 사용법 ❌

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const fullName = ref('');

// ❌ 잘못됨: watch 대신 computed를 사용해야 함
watch(firstName, (newFirst) => {
  fullName.value = `${newFirst} ${lastName.value}`;
});

watch(lastName, (newLast) => {
  fullName.value = `${firstName.value} ${newLast}`;
});
</script>
```

#### 올바른 사용법 ✅

```vue
<script setup>
import { computed, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// ✅ 올바름: computed로 파생 데이터 계산
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
</script>
```

### computed와 watch 핵심 포인트

> **"`computed`는 데이터를 계산하고, `watch`는 작업을 수행한다"**
>
> - `computed`: **새로운 데이터를 계산**할 때 사용 (포맷팅, 필터링, 합계 등)
> - `watch`: **동작을 실행**할 때 사용 (API 요청, 데이터 저장, 알림 표시 등)

### 실습 문제: x \* y 계산

> 문제: x=0, y=5 이고 버튼을 클릭할 때마다 x가 1씩 증가합니다. Vue의 computed 또는 watch 중 하나를 사용하여 "x \* y의 결과"를 구현하세요.

#### 풀이 1: `computed` 사용 (권장)

이 시나리오에 가장 적합합니다. 결과가 x와 y에 의존하여 계산되는 새로운 데이터이기 때문입니다.

```vue
<template>
  <div>
    <p>X: {{ x }}, Y: {{ y }}</p>
    <p>Result (X * Y): {{ result }}</p>
    <button @click="x++">Increment X</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const x = ref(0);
const y = ref(5);

// ✅ 권장: 간단하고 직관적이며, 자동으로 의존성 추적
const result = computed(() => x.value * y.value);
</script>
```

#### 풀이 2: `watch` 사용 (더 번거로움)

가능하지만, `result` 변수를 수동으로 관리해야 하며, 초기값 문제를 고려해야 합니다.

```vue
<script setup>
import { ref, watch } from 'vue';

const x = ref(0);
const y = ref(5);
const result = ref(0);

// ❌ 비권장: 수동 업데이트가 필요하고, immediate를 설정해야 초기 계산이 됨
watch(
  [x, y],
  ([newX, newY]) => {
    result.value = newX * newY;
  },
  { immediate: true }
);
</script>
```

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
