---
id: two-way-data-binding
title: 📄 Two-way Data Binding(雙向綁定)
slug: /two-way-data-binding
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding ?

> 請解釋 Vue2 和 Vue3 各自如何實現雙向綁定的原理？

### Vue2

Vue2 使用 `Object.defineProperty` 來實現雙向綁定，這個方法可以將一個 object 的屬性包裝成 `getter` 和 `setter`，並且可以監聽 object 屬性的變化。流程如下：

1. **Data Hijacking(資料劫持)**

   在 Vue2 中，當一個 component 中某個資料的 object 被創建時，Vue 會遍歷整個 object 中的所有屬性，並使用 `Object.defineProperty` 將這些屬性轉換成 `getter` 和 `setter`，這才使 Vue 可以追蹤資料的讀取和修改。

2. **Dependency Collection(依賴收集)**

   每當組件中的渲染函式被執行時，會讀取 data 中的屬性，這時候就會觸發 `getter`，Vue 會記錄這些 Dependency，確保當資料變化時，能夠通知到依賴這些資料的 component。

3. **Dispatching Updates(派發更新)**

   當資料被修改時，會觸發 `setter`，這時候 Vue 會通知到所有依賴這些資料的 component，並且重新執行渲染函式，更新 DOM。

#### Vue2 Simple Example

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
console.log(data.name);
data.name = 'Vue2 Reactivity';
```

### Vue3

Vue3 引入了 ES6 的 `Proxy`，這個方法可以將一個 object 包裝成一個代理，並且可以監聽 object 屬性的變化，同時性能更加優化。流程如下：

1. **使用 Proxy 進行資料劫持**

   在 Vue3 中會使用 `new Proxy` 建立對資料的代理，而不再是逐一對資料的屬性進行定義 `getter` 和 `setter`，這樣除了可以針對更細緻的層面追蹤資料變化，同時也能攔截更多類型的操作，例如屬性的添加或刪除。

2. **更高效的依賴追蹤**

   使用 Proxy，Vue3 能夠更高效追蹤依賴，因為不再需要預先定義 `getter / setter`，而且 Proxy 的攔截能力更強。

3. **自動的最小化重新渲染**

   當資料變化時，Vuu3 可以更精準的確定哪部分的 UI 需要進行更新，從而減少不必要的重新渲染，提昇網頁性能。

#### Vue3 Simple Example

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(1, `獲取 ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(2, `設置 ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(3, data.name); // 讀取數據，觸發 Proxy 的 get
data.name = 'Vue 3 Reactivity'; // 修改數據，觸發 Proxy 的 set
console.log(4, data.name);
```

### 結論

Vue2 使用 `Object.defineProperty` 來實現雙向綁定，但這種方法存在一定的限制(比如無法偵測 object 的屬性添加或刪除)。Vue3 引入了 ES6 的 `Proxy`，提供了更強大與靈活反應式系統，同時也能提升性能。
