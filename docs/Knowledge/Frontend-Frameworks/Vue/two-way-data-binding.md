---
id: vue-two-way-data-binding
title: '[Hard] 📄 Two-way Data Binding'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> Please explain the underlying mechanism of two-way binding in Vue2 and Vue3.

To understand Vue two-way binding, you need to understand how the reactivity system works and how Vue2 and Vue3 implement it differently.

### Vue2 implementation

Vue2 uses `Object.defineProperty` to implement reactivity. It wraps object properties with `getter` and `setter`, so reads/writes can be tracked.

#### 1. Data hijacking

When component data is initialized in Vue2, Vue traverses each property and converts it into `getter`/`setter` via `Object.defineProperty`, so reads and writes can be observed.

#### 2. Dependency collection

When a render function executes and reads reactive properties, the `getter` runs. Vue records dependencies so affected components can be notified later.

#### 3. Dispatching updates

When data changes, the `setter` runs. Vue notifies dependent watchers/components and triggers re-render to update DOM.

#### Vue2 example

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

console.log(data.name); // triggers getter
data.name = 'Vue2 Reactivity'; // triggers setter
```

#### Vue2 limitations

`Object.defineProperty` has several limitations:

- **Cannot detect property addition/deletion** without `Vue.set()` / `Vue.delete()`
- **Cannot detect direct array index mutation** reliably without patched array methods
- **Performance overhead** from deep traversal and upfront getter/setter definition

### Vue3 implementation

Vue3 uses ES6 `Proxy`, which provides broader interception capability and better performance characteristics.

#### 1. Proxy-based data hijacking

Vue3 wraps whole objects with `new Proxy` instead of defining getter/setter per key. This allows interception of more operations, including property add/delete.

#### 2. More efficient dependency tracking

Vue3 no longer needs upfront getter/setter definition for every property. Proxy traps can handle operations dynamically (e.g., `get`, `set`, `has`, `deleteProperty`, etc.).

#### 3. More precise update triggering

Vue3 can track dependencies more precisely and reduce unnecessary re-renders.

#### Vue3 example

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`get ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`set ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name);
data.name = 'Vue 3 Reactivity';
console.log(data.name);
```

### Vue2 vs Vue3 comparison

| Feature | Vue2 | Vue3 |
| --- | --- | --- |
| Core mechanism | `Object.defineProperty` | `Proxy` |
| Detect new properties | ❌ requires `Vue.set()` | ✅ native support |
| Detect property deletion | ❌ requires `Vue.delete()` | ✅ native support |
| Detect array index assignment | ❌ limited | ✅ native support |
| Performance | upfront deep walk | lazy + more efficient |
| Browser support | IE9+ | no IE11 support |

### Conclusion

Vue2 uses `Object.defineProperty`, which works but has known limitations.
Vue3 uses `Proxy`, giving a more complete and flexible reactivity system with better performance.

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> Why did Vue3 choose `Proxy` over `Object.defineProperty`?

### Main reasons

#### 1. Stronger interception capability

`Proxy` can intercept many operations, while `Object.defineProperty` only covers property get/set.

```js
// Operations Proxy can intercept
const handler = {
  get() {},
  set() {},
  has() {},
  deleteProperty() {},
  ownKeys() {},
  getOwnPropertyDescriptor() {},
  defineProperty() {},
  preventExtensions() {},
  getPrototypeOf() {},
  isExtensible() {},
  setPrototypeOf() {},
  apply() {},
  construct() {},
};
```

#### 2. Native array index tracking

```js
// Vue2 limitation
const arr = [1, 2, 3];
arr[0] = 10; // often not tracked in Vue2-style defineProperty model

// Vue3
const arr2 = reactive([1, 2, 3]);
arr2[0] = 10; // tracked
```

#### 3. Native support for dynamic property add/delete

```js
// Vue2 needs special API
Vue.set(obj, 'newKey', 'value');

// Vue3 native
const obj = reactive({});
obj.newKey = 'value';
delete obj.newKey;
```

#### 4. Better performance model

```js
// Vue2: deep traversal + defineReactive for each key
function observe(obj) {
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3: proxy wrapper
function reactive(obj) {
  return new Proxy(obj, handler);
}
```

#### 5. Simpler internal implementation

Vue3 reactivity core is cleaner and easier to maintain.

### Why Vue2 did not use Proxy

Mainly **browser compatibility**:

- Vue2 (released in 2016) needed broad support including IE
- `Proxy` cannot be fully polyfilled
- Vue3 dropped IE11 support, so Proxy became viable

### Practical comparison

```js
// ===== Vue2 limitations =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3],
  },
});

// not reliably reactive in Vue2 without special APIs
vm.obj.b = 2;
delete vm.obj.a;
vm.arr[0] = 10;
vm.arr.length = 0;

// Vue2 workaround
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Vue3 native support =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3],
});

state.obj.b = 2;
delete state.obj.a;
state.arr[0] = 10;
state.arr.length = 0;
```

### Summary

Vue3 uses `Proxy` to:

1. ✅ Provide complete reactivity coverage (add/delete/index changes)
2. ✅ Improve performance (less upfront traversal)
3. ✅ Simplify implementation
4. ✅ Improve developer experience (fewer special APIs)

Tradeoff: no support for legacy IE11, which is acceptable for modern web targets.

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
