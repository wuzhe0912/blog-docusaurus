---
id: vue-two-way-data-binding
title: '[Hard] 양방향 데이터 바인딩'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> Vue2와 Vue3 각각의 양방향 바인딩 구현 원리를 설명하세요.

Vue의 양방향 바인딩을 이해하려면 먼저 반응형 시스템의 동작 메커니즘과 Vue2와 Vue3의 구현 차이를 이해해야 합니다.

### Vue2의 구현 방식

Vue2는 `Object.defineProperty`를 사용하여 양방향 바인딩을 구현합니다. 이 메서드는 객체의 속성을 `getter`와 `setter`로 래핑하여 객체 속성의 변화를 감시할 수 있습니다. 흐름은 다음과 같습니다:

#### 1. Data Hijacking (데이터 하이재킹)

Vue2에서 컴포넌트의 데이터 객체가 생성될 때, Vue는 객체의 모든 속성을 순회하며 `Object.defineProperty`를 사용하여 이 속성들을 `getter`와 `setter`로 변환합니다. 이를 통해 Vue가 데이터의 읽기와 수정을 추적할 수 있습니다.

#### 2. Dependency Collection (의존성 수집)

컴포넌트의 렌더링 함수가 실행될 때, data의 속성을 읽으면 `getter`가 트리거됩니다. Vue는 이 의존성들을 기록하여 데이터가 변경될 때 해당 데이터에 의존하는 컴포넌트에 알림을 보낼 수 있습니다.

#### 3. Dispatching Updates (업데이트 디스패치)

데이터가 수정되면 `setter`가 트리거되고, Vue는 해당 데이터에 의존하는 모든 컴포넌트에 알림을 보내 렌더링 함수를 다시 실행하여 DOM을 업데이트합니다.

#### Vue2 코드 예제

```js
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      console.log(`get ${key}: ${val}`);
      return val;
    },
    set: function reactiveSetter(newVal) {
      console.log(`set ${key}: ${newVal}`);
      val = newVal;
    },
  });
}

const data = { name: 'Pitt' };
defineReactive(data, 'name', data.name);

console.log(data.name); // getter 트리거, "get name: Pitt" 출력
data.name = 'Vue2 Reactivity'; // setter 트리거, "set name: Vue2 Reactivity" 출력
```

#### Vue2의 한계

`Object.defineProperty` 사용에는 몇 가지 한계가 있습니다:

- **객체 속성의 추가/삭제를 감지할 수 없음**: `Vue.set()` 또는 `Vue.delete()`를 사용해야 함
- **배열 인덱스 변화를 감지할 수 없음**: Vue가 제공하는 배열 메서드(`push`, `pop` 등)를 사용해야 함
- **성능 문제**: 모든 속성을 재귀적으로 순회하여 getter와 setter를 미리 정의해야 함

### Vue3의 구현 방식

Vue3는 ES6의 `Proxy`를 도입했습니다. 이 메서드는 객체를 프록시로 래핑하여 객체 속성의 변화를 감시할 수 있으며, 동시에 성능이 더 최적화되었습니다. 흐름은 다음과 같습니다:

#### 1. Proxy를 사용한 데이터 하이재킹

Vue3에서는 `new Proxy`를 사용하여 데이터에 대한 프록시를 생성합니다. 각 속성마다 `getter`와 `setter`를 정의하는 대신, 더 세밀한 수준에서 데이터 변화를 추적하고 속성 추가/삭제 등 더 많은 유형의 작업을 가로챌 수 있습니다.

#### 2. 더 효율적인 의존성 추적

Proxy를 사용함으로써 Vue3는 더 효율적으로 의존성을 추적할 수 있습니다. `getter/setter`를 미리 정의할 필요가 없고, Proxy의 가로채기 능력이 더 강력하여 최대 13가지 작업(`get`, `set`, `has`, `deleteProperty` 등)을 가로챌 수 있습니다.

#### 3. 자동 최소화 재렌더링

데이터가 변경될 때, Vue3는 UI의 어떤 부분이 업데이트되어야 하는지 더 정확하게 판단할 수 있어 불필요한 재렌더링을 줄이고 성능을 향상시킵니다.

#### Vue3 코드 예제

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`가져오기 ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`설정 ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name); // 데이터 읽기, Proxy의 get 트리거, "가져오기 name: Vue 3" 출력
data.name = 'Vue 3 Reactivity'; // 데이터 수정, Proxy의 set 트리거, "설정 name: Vue 3 Reactivity" 출력
console.log(data.name); // "가져오기 name: Vue 3 Reactivity" 출력
```

### Vue2 vs Vue3 비교표

| 특성 | Vue2 | Vue3 |
| --- | --- | --- |
| 구현 방식 | `Object.defineProperty` | `Proxy` |
| 속성 추가 감지 | ❌ `Vue.set()` 필요 | ✅ 네이티브 지원 |
| 속성 삭제 감지 | ❌ `Vue.delete()` 필요 | ✅ 네이티브 지원 |
| 배열 인덱스 감지 | ❌ 특정 메서드 필요 | ✅ 네이티브 지원 |
| 성능 | 모든 속성을 재귀적으로 순회 | 지연 처리, 성능이 더 좋음 |
| 브라우저 지원 | IE9+ | IE11 지원 안 함 |

### 결론

Vue2는 `Object.defineProperty`를 사용하여 양방향 바인딩을 구현하지만, 이 방법에는 일정한 한계가 있습니다(예: 객체의 속성 추가/삭제를 감지할 수 없음). Vue3는 ES6의 `Proxy`를 도입하여 더 강력하고 유연한 반응형 시스템을 제공하며 성능도 향상시켰습니다. 이것은 Vue3의 Vue2 대비 주요 개선 사항 중 하나입니다.

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> Vue3는 왜 `Object.defineProperty` 대신 `Proxy`를 사용하는가?

### 주요 이유

#### 1. 더 강력한 가로채기 능력

`Proxy`는 최대 13가지 작업을 가로챌 수 있지만, `Object.defineProperty`는 속성의 읽기와 설정만 가로챌 수 있습니다:

```js
// Proxy가 가로챌 수 있는 작업
const handler = {
  get() {},              // 속성 읽기
  set() {},              // 속성 설정
  has() {},              // in 연산자
  deleteProperty() {},   // delete 연산자
  ownKeys() {},          // Object.keys()
  getOwnPropertyDescriptor() {},
  defineProperty() {},
  preventExtensions() {},
  getPrototypeOf() {},
  isExtensible() {},
  setPrototypeOf() {},
  apply() {},            // 함수 호출
  construct() {}         // new 연산자
};
```

#### 2. 배열 인덱스 모니터링 네이티브 지원

```js
// Vue2에서 감지 불가
const arr = [1, 2, 3];
arr[0] = 10; // ❌ 업데이트 트리거 불가

// Vue3에서 감지 가능
const arr = reactive([1, 2, 3]);
arr[0] = 10; // ✅ 업데이트 트리거 가능
```

#### 3. 객체 속성 동적 추가/삭제 네이티브 지원

```js
// Vue2에서는 특별한 처리 필요
Vue.set(obj, 'newKey', 'value'); // ✅
obj.newKey = 'value'; // ❌ 업데이트 트리거 불가

// Vue3에서는 네이티브 지원
const obj = reactive({});
obj.newKey = 'value'; // ✅ 업데이트 트리거 가능
delete obj.newKey; // ✅ 업데이트 트리거 가능
```

#### 4. 더 나은 성능

```js
// Vue2: 모든 속성을 재귀적으로 순회 필요
function observe(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
    // 값이 객체이면 재귀 처리 필요
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3: 지연 처리, 접근 시에만 프록시 생성
function reactive(obj) {
  return new Proxy(obj, handler); // 재귀 불필요
}
```

#### 5. 더 간결한 코드

Vue3의 반응형 구현 코드량이 대폭 감소하여 유지보수 비용이 낮아졌습니다.

### Vue2가 Proxy를 사용하지 않은 이유

주된 이유는 **브라우저 호환성**입니다:

- Vue2 출시 당시(2016년), Proxy는 아직 널리 지원되지 않았음
- Vue2는 IE9+를 지원해야 했고, Proxy는 polyfill이 불가능
- Vue3는 IE11 지원을 포기하여 Proxy를 채택 가능

### 실제 예제 비교

```js
// ===== Vue2의 한계 =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3]
  }
});

// ❌ 다음 작업은 업데이트를 트리거하지 않음
vm.obj.b = 2;           // 속성 추가
delete vm.obj.a;        // 속성 삭제
vm.arr[0] = 10;         // 배열 인덱스 수정
vm.arr.length = 0;      // 배열 길이 수정

// ✅ 특별한 메서드 사용 필요
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Vue3 네이티브 지원 =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3]
});

// ✅ 다음 작업 모두 업데이트를 트리거
state.obj.b = 2;        // 속성 추가
delete state.obj.a;     // 속성 삭제
state.arr[0] = 10;      // 배열 인덱스 수정
state.arr.length = 0;   // 배열 길이 수정
```

### 요약

Vue3가 `Proxy`를 사용하는 이유:

1. ✅ 더 완전한 반응형 지원 (객체 속성 추가/삭제, 배열 인덱스 등)
2. ✅ 성능 향상 (지연 처리, 미리 재귀할 필요 없음)
3. ✅ 코드 간소화 (구현이 더 간결)
4. ✅ 더 나은 개발 경험 (특별한 API를 기억할 필요 없음)

유일한 대가는 구 버전 브라우저(IE11) 지원을 포기한 것이지만, 이는 가치 있는 트레이드오프입니다.

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
