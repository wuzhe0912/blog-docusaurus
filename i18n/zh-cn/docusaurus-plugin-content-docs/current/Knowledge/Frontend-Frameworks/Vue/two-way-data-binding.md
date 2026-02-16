---
id: vue-two-way-data-binding
title: '[Hard] 📄 双向数据绑定'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> 请解释 Vue2 和 Vue3 各自如何实现双向绑定的底层原理？

要理解 Vue 的双向绑定，需要先明白响应式系统的运作机制，以及 Vue2 与 Vue3 在实现上的差异。

### Vue2 的实现方式

Vue2 使用 `Object.defineProperty` 来实现双向绑定，这个方法可以将一个对象的属性包装成 `getter` 和 `setter`，并且可以监听对象属性的变化。流程如下：

#### 1. Data Hijacking（数据劫持）

在 Vue2 中，当一个组件中某个数据的对象被创建时，Vue 会遍历整个对象中的所有属性，并使用 `Object.defineProperty` 将这些属性转换成 `getter` 和 `setter`，这才使 Vue 可以追踪数据的读取和修改。

#### 2. Dependency Collection（依赖收集）

每当组件中的渲染函数被执行时，会读取 data 中的属性，这时候就会触发 `getter`，Vue 会记录这些依赖，确保当数据变化时，能够通知到依赖这些数据的组件。

#### 3. Dispatching Updates（派发更新）

当数据被修改时，会触发 `setter`，这时候 Vue 会通知到所有依赖这些数据的组件，并且重新执行渲染函数，更新 DOM。

#### Vue2 代码示例

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

console.log(data.name); // 触发 getter，输出 "get name: Pitt"
data.name = 'Vue2 Reactivity'; // 触发 setter，输出 "set name: Vue2 Reactivity"
```

#### Vue2 的限制

使用 `Object.defineProperty` 存在一些限制：

- **无法侦测对象属性的新增或删除**：必须使用 `Vue.set()` 或 `Vue.delete()`
- **无法侦测数组索引的变化**：必须使用 Vue 提供的数组方法（如 `push`、`pop` 等）
- **性能问题**：需要递归遍历所有属性，预先定义 getter 和 setter

### Vue3 的实现方式

Vue3 引入了 ES6 的 `Proxy`，这个方法可以将一个对象包装成一个代理，并且可以监听对象属性的变化，同时性能更加优化。流程如下：

#### 1. 使用 Proxy 进行数据劫持

在 Vue3 中会使用 `new Proxy` 创建对数据的代理，而不再是逐一对数据的属性进行定义 `getter` 和 `setter`，这样除了可以针对更细致的层面追踪数据变化，同时也能拦截更多类型的操作，例如属性的新增或删除。

#### 2. 更高效的依赖追踪

使用 Proxy，Vue3 能够更高效追踪依赖，因为不再需要预先定义 `getter / setter`，而且 Proxy 的拦截能力更强，可以拦截多达 13 种操作（如 `get`、`set`、`has`、`deleteProperty` 等）。

#### 3. 自动的最小化重新渲染

当数据变化时，Vue3 可以更精准地确定哪部分的 UI 需要进行更新，从而减少不必要的重新渲染，提升网页性能。

#### Vue3 代码示例

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`获取 ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`设置 ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name); // 读取数据，触发 Proxy 的 get，输出 "获取 name: Vue 3"
data.name = 'Vue 3 Reactivity'; // 修改数据，触发 Proxy 的 set，输出 "设置 name: Vue 3 Reactivity"
console.log(data.name); // 输出 "获取 name: Vue 3 Reactivity"
```

### Vue2 vs Vue3 比较表

| 特性 | Vue2 | Vue3 |
| --- | --- | --- |
| 实现方式 | `Object.defineProperty` | `Proxy` |
| 侦测新增属性 | ❌ 需使用 `Vue.set()` | ✅ 原生支持 |
| 侦测属性删除 | ❌ 需使用 `Vue.delete()` | ✅ 原生支持 |
| 侦测数组索引 | ❌ 需使用特定方法 | ✅ 原生支持 |
| 性能 | 需递归遍历所有属性 | 惰性处理，性能更好 |
| 浏览器支持 | IE9+ | 不支持 IE11 |

### 结论

Vue2 使用 `Object.defineProperty` 来实现双向绑定，但这种方法存在一定的限制（比如无法侦测对象的属性新增或删除）。Vue3 引入了 ES6 的 `Proxy`，提供了更强大与灵活的响应式系统，同时也能提升性能。这是 Vue3 相较于 Vue2 的重大改进之一。

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> 为什么 Vue3 要使用 `Proxy` 而不是 `Object.defineProperty`？

### 主要原因

#### 1. 更强大的拦截能力

`Proxy` 可以拦截多达 13 种操作，而 `Object.defineProperty` 只能拦截属性的读取和设置：

```js
// Proxy 可以拦截的操作
const handler = {
  get() {},              // 属性读取
  set() {},              // 属性设置
  has() {},              // in 运算符
  deleteProperty() {},   // delete 运算符
  ownKeys() {},          // Object.keys()
  getOwnPropertyDescriptor() {},
  defineProperty() {},
  preventExtensions() {},
  getPrototypeOf() {},
  isExtensible() {},
  setPrototypeOf() {},
  apply() {},            // 函数调用
  construct() {}         // new 运算符
};
```

#### 2. 原生支持数组索引监听

```js
// Vue2 无法侦测
const arr = [1, 2, 3];
arr[0] = 10; // ❌ 无法触发更新

// Vue3 可以侦测
const arr = reactive([1, 2, 3]);
arr[0] = 10; // ✅ 可以触发更新
```

#### 3. 原生支持对象属性的动态新增/删除

```js
// Vue2 需要特殊处理
Vue.set(obj, 'newKey', 'value'); // ✅
obj.newKey = 'value'; // ❌ 无法触发更新

// Vue3 原生支持
const obj = reactive({});
obj.newKey = 'value'; // ✅ 可以触发更新
delete obj.newKey; // ✅ 也可以触发更新
```

#### 4. 性能更好

```js
// Vue2：需要递归遍历所有属性
function observe(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
    // 如果值是对象，需要递归处理
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3：惰性处理，只在访问时才进行代理
function reactive(obj) {
  return new Proxy(obj, handler); // 不需要递归
}
```

#### 5. 代码更简洁

Vue3 的响应式实现代码量大幅减少，维护成本更低。

### 为什么 Vue2 不使用 Proxy？

主要是因为**浏览器兼容性**：

- Vue2 发布时（2016年），Proxy 还未被广泛支持
- Vue2 需要支持 IE9+，而 Proxy 无法被 polyfill
- Vue3 放弃了对 IE11 的支持，因此可以采用 Proxy

### 实际示例对比

```js
// ===== Vue2 的限制 =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3]
  }
});

// ❌ 以下操作无法触发更新
vm.obj.b = 2;           // 新增属性
delete vm.obj.a;        // 删除属性
vm.arr[0] = 10;         // 修改数组索引
vm.arr.length = 0;      // 修改数组长度

// ✅ 需要使用特殊方法
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Vue3 原生支持 =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3]
});

// ✅ 以下操作都可以触发更新
state.obj.b = 2;        // 新增属性
delete state.obj.a;     // 删除属性
state.arr[0] = 10;      // 修改数组索引
state.arr.length = 0;   // 修改数组长度
```

### 总结

Vue3 使用 `Proxy` 是为了：

1. ✅ 提供更完整的响应式支持（对象属性新增/删除、数组索引等）
2. ✅ 提升性能（惰性处理，不需要预先递归）
3. ✅ 简化代码（实现更简洁）
4. ✅ 提供更好的开发体验（不需要记忆特殊 API）

唯一的代价是放弃对旧版浏览器（IE11）的支持，但这是值得的取舍。

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
