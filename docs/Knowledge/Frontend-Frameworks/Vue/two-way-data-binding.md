---
id: vue-two-way-data-binding
title: '[Hard] 📄 Two-way Data Binding'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> 請解釋 Vue2 和 Vue3 各自如何實現雙向綁定的底層原理？

要理解 Vue 的雙向綁定，需要先明白響應式系統的運作機制，以及 Vue2 與 Vue3 在實作上的差異。

### Vue2 的實作方式

Vue2 使用 `Object.defineProperty` 來實現雙向綁定，這個方法可以將一個物件的屬性包裝成 `getter` 和 `setter`，並且可以監聽物件屬性的變化。流程如下：

#### 1. Data Hijacking（資料劫持）

在 Vue2 中，當一個元件中某個資料的物件被建立時，Vue 會遍歷整個物件中的所有屬性，並使用 `Object.defineProperty` 將這些屬性轉換成 `getter` 和 `setter`，這才使 Vue 可以追蹤資料的讀取和修改。

#### 2. Dependency Collection（依賴收集）

每當元件中的渲染函式被執行時，會讀取 data 中的屬性，這時候就會觸發 `getter`，Vue 會記錄這些依賴，確保當資料變化時，能夠通知到依賴這些資料的元件。

#### 3. Dispatching Updates（派發更新）

當資料被修改時，會觸發 `setter`，這時候 Vue 會通知到所有依賴這些資料的元件，並且重新執行渲染函式，更新 DOM。

#### Vue2 程式碼範例

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

console.log(data.name); // 觸發 getter，印出 "get name: Pitt"
data.name = 'Vue2 Reactivity'; // 觸發 setter，印出 "set name: Vue2 Reactivity"
```

#### Vue2 的限制

使用 `Object.defineProperty` 存在一些限制：

- **無法偵測物件屬性的新增或刪除**：必須使用 `Vue.set()` 或 `Vue.delete()`
- **無法偵測陣列索引的變化**：必須使用 Vue 提供的陣列方法（如 `push`、`pop` 等）
- **效能問題**：需要遞迴遍歷所有屬性，預先定義 getter 和 setter

### Vue3 的實作方式

Vue3 引入了 ES6 的 `Proxy`，這個方法可以將一個物件包裝成一個代理，並且可以監聽物件屬性的變化，同時效能更加優化。流程如下：

#### 1. 使用 Proxy 進行資料劫持

在 Vue3 中會使用 `new Proxy` 建立對資料的代理，而不再是逐一對資料的屬性進行定義 `getter` 和 `setter`，這樣除了可以針對更細緻的層面追蹤資料變化，同時也能攔截更多類型的操作，例如屬性的新增或刪除。

#### 2. 更高效的依賴追蹤

使用 Proxy，Vue3 能夠更高效追蹤依賴，因為不再需要預先定義 `getter / setter`，而且 Proxy 的攔截能力更強，可以攔截多達 13 種操作（如 `get`、`set`、`has`、`deleteProperty` 等）。

#### 3. 自動的最小化重新渲染

當資料變化時，Vue3 可以更精準地確定哪部分的 UI 需要進行更新，從而減少不必要的重新渲染，提升網頁效能。

#### Vue3 程式碼範例

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`獲取 ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`設置 ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name); // 讀取資料，觸發 Proxy 的 get，印出 "獲取 name: Vue 3"
data.name = 'Vue 3 Reactivity'; // 修改資料，觸發 Proxy 的 set，印出 "設置 name: Vue 3 Reactivity"
console.log(data.name); // 印出 "獲取 name: Vue 3 Reactivity"
```

### Vue2 vs Vue3 比較表

| 特性 | Vue2 | Vue3 |
| --- | --- | --- |
| 實作方式 | `Object.defineProperty` | `Proxy` |
| 偵測新增屬性 | ❌ 需使用 `Vue.set()` | ✅ 原生支援 |
| 偵測屬性刪除 | ❌ 需使用 `Vue.delete()` | ✅ 原生支援 |
| 偵測陣列索引 | ❌ 需使用特定方法 | ✅ 原生支援 |
| 效能 | 需遞迴遍歷所有屬性 | 惰性處理，效能更好 |
| 瀏覽器支援 | IE9+ | 不支援 IE11 |

### 結論

Vue2 使用 `Object.defineProperty` 來實現雙向綁定，但這種方法存在一定的限制（比如無法偵測物件的屬性新增或刪除）。Vue3 引入了 ES6 的 `Proxy`，提供了更強大與靈活的響應式系統，同時也能提升效能。這是 Vue3 相較於 Vue2 的重大改進之一。

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> 為什麼 Vue3 要使用 `Proxy` 而不是 `Object.defineProperty`？

### 主要原因

#### 1. 更強大的攔截能力

`Proxy` 可以攔截多達 13 種操作，而 `Object.defineProperty` 只能攔截屬性的讀取和設置：

```js
// Proxy 可以攔截的操作
const handler = {
  get() {},              // 屬性讀取
  set() {},              // 屬性設置
  has() {},              // in 運算符
  deleteProperty() {},   // delete 運算符
  ownKeys() {},          // Object.keys()
  getOwnPropertyDescriptor() {},
  defineProperty() {},
  preventExtensions() {},
  getPrototypeOf() {},
  isExtensible() {},
  setPrototypeOf() {},
  apply() {},            // 函式呼叫
  construct() {}         // new 運算符
};
```

#### 2. 原生支援陣列索引監聽

```js
// Vue2 無法偵測
const arr = [1, 2, 3];
arr[0] = 10; // ❌ 無法觸發更新

// Vue3 可以偵測
const arr = reactive([1, 2, 3]);
arr[0] = 10; // ✅ 可以觸發更新
```

#### 3. 原生支援物件屬性的動態新增/刪除

```js
// Vue2 需要特殊處理
Vue.set(obj, 'newKey', 'value'); // ✅
obj.newKey = 'value'; // ❌ 無法觸發更新

// Vue3 原生支援
const obj = reactive({});
obj.newKey = 'value'; // ✅ 可以觸發更新
delete obj.newKey; // ✅ 也可以觸發更新
```

#### 4. 效能更好

```js
// Vue2：需要遞迴遍歷所有屬性
function observe(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
    // 如果值是物件，需要遞迴處理
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3：惰性處理，只在存取時才進行代理
function reactive(obj) {
  return new Proxy(obj, handler); // 不需要遞迴
}
```

#### 5. 程式碼更簡潔

Vue3 的響應式實作程式碼量大幅減少，維護成本更低。

### 為什麼 Vue2 不使用 Proxy？

主要是因為**瀏覽器相容性**：

- Vue2 發布時（2016年），Proxy 還未被廣泛支援
- Vue2 需要支援 IE9+，而 Proxy 無法被 polyfill
- Vue3 放棄了對 IE11 的支援，因此可以採用 Proxy

### 實際範例對比

```js
// ===== Vue2 的限制 =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3]
  }
});

// ❌ 以下操作無法觸發更新
vm.obj.b = 2;           // 新增屬性
delete vm.obj.a;        // 刪除屬性
vm.arr[0] = 10;         // 修改陣列索引
vm.arr.length = 0;      // 修改陣列長度

// ✅ 需要使用特殊方法
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Vue3 原生支援 =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3]
});

// ✅ 以下操作都可以觸發更新
state.obj.b = 2;        // 新增屬性
delete state.obj.a;     // 刪除屬性
state.arr[0] = 10;      // 修改陣列索引
state.arr.length = 0;   // 修改陣列長度
```

### 總結

Vue3 使用 `Proxy` 是為了：

1. ✅ 提供更完整的響應式支援（物件屬性新增/刪除、陣列索引等）
2. ✅ 提升效能（惰性處理，不需要預先遞迴）
3. ✅ 簡化程式碼（實作更簡潔）
4. ✅ 提供更好的開發體驗（不需要記憶特殊 API）

唯一的代價是放棄對舊版瀏覽器（IE11）的支援，但這是值得的取捨。

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)

