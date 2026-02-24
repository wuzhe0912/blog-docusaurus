---
id: vue-two-way-data-binding
title: '[Hard] 📄 Двустороннее связывание данных'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Объясните базовый принцип реализации двустороннего связывания в Vue2 и Vue3

> Объясните внутренний механизм двустороннего связывания в Vue2 и Vue3.

Чтобы понять двустороннее связывание Vue, необходимо разобраться в том, как работает система реактивности и как Vue2 и Vue3 реализуют её по-разному.

### Реализация Vue2

Vue2 использует `Object.defineProperty` для реализации реактивности. Он оборачивает свойства объекта с помощью `getter` и `setter`, чтобы отслеживать чтение/запись.

#### 1. Перехват данных

При инициализации данных компонента в Vue2 Vue обходит каждое свойство и конвертирует его в `getter`/`setter` через `Object.defineProperty`, чтобы можно было наблюдать за чтением и записью.

#### 2. Сбор зависимостей

Когда функция рендеринга выполняется и читает реактивные свойства, срабатывает `getter`. Vue записывает зависимости, чтобы затронутые компоненты могли быть уведомлены позже.

#### 3. Отправка обновлений

Когда данные изменяются, срабатывает `setter`. Vue уведомляет зависимые watchers/компоненты и запускает перерисовку для обновления DOM.

#### Пример Vue2

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

console.log(data.name); // срабатывает getter
data.name = 'Vue2 Reactivity'; // срабатывает setter
```

#### Ограничения Vue2

`Object.defineProperty` имеет ряд ограничений:

- **Не может обнаружить добавление/удаление свойств** без `Vue.set()` / `Vue.delete()`
- **Не может надёжно обнаружить прямое присваивание по индексу массива** без патченных методов массива
- **Накладные расходы на производительность** из-за глубокого обхода и предварительного определения getter/setter

### Реализация Vue3

Vue3 использует ES6 `Proxy`, что обеспечивает более широкие возможности перехвата и лучшие характеристики производительности.

#### 1. Перехват данных на основе Proxy

Vue3 оборачивает целые объекты с помощью `new Proxy` вместо определения getter/setter для каждого ключа. Это позволяет перехватывать больше операций, включая добавление/удаление свойств.

#### 2. Более эффективное отслеживание зависимостей

Vue3 больше не нуждается в предварительном определении getter/setter для каждого свойства. Ловушки Proxy могут обрабатывать операции динамически (например, `get`, `set`, `has`, `deleteProperty` и т.д.).

#### 3. Более точное срабатывание обновлений

Vue3 может отслеживать зависимости более точно и уменьшать количество ненужных перерисовок.

#### Пример Vue3

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

### Сравнение Vue2 и Vue3

| Характеристика | Vue2 | Vue3 |
| --- | --- | --- |
| Основной механизм | `Object.defineProperty` | `Proxy` |
| Обнаружение новых свойств | Требуется `Vue.set()` | Нативная поддержка |
| Обнаружение удаления свойств | Требуется `Vue.delete()` | Нативная поддержка |
| Обнаружение присваивания по индексу массива | Ограничено | Нативная поддержка |
| Производительность | Предварительный глубокий обход | Ленивый + более эффективный |
| Поддержка браузеров | IE9+ | Без поддержки IE11 |

### Заключение

Vue2 использует `Object.defineProperty`, который работает, но имеет известные ограничения.
Vue3 использует `Proxy`, обеспечивая более полную и гибкую систему реактивности с лучшей производительностью.

## 2. Почему Vue3 использует `Proxy` вместо `Object.defineProperty`?

> Почему Vue3 выбрал `Proxy` вместо `Object.defineProperty`?

### Основные причины

#### 1. Более широкие возможности перехвата

`Proxy` может перехватывать множество операций, тогда как `Object.defineProperty` покрывает только get/set свойств.

```js
// Операции, которые может перехватывать Proxy
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

#### 2. Нативное отслеживание индексов массива

```js
// Ограничение Vue2
const arr = [1, 2, 3];
arr[0] = 10; // часто не отслеживается в модели defineProperty Vue2

// Vue3
const arr2 = reactive([1, 2, 3]);
arr2[0] = 10; // отслеживается
```

#### 3. Нативная поддержка динамического добавления/удаления свойств

```js
// Vue2 требует специальный API
Vue.set(obj, 'newKey', 'value');

// Vue3 нативно
const obj = reactive({});
obj.newKey = 'value';
delete obj.newKey;
```

#### 4. Лучшая модель производительности

```js
// Vue2: глубокий обход + defineReactive для каждого ключа
function observe(obj) {
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue3: обёртка proxy
function reactive(obj) {
  return new Proxy(obj, handler);
}
```

#### 5. Более простая внутренняя реализация

Ядро реактивности Vue3 чище и проще в поддержке.

### Почему Vue2 не использовал Proxy

Главная причина — **совместимость с браузерами**:

- Vue2 (выпущен в 2016) нуждался в широкой поддержке, включая IE
- `Proxy` нельзя полностью полифиллить
- Vue3 отказался от поддержки IE11, поэтому Proxy стал допустимым решением

### Практическое сравнение

```js
// ===== Ограничения Vue2 =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3],
  },
});

// ненадёжно реактивно в Vue2 без специальных API
vm.obj.b = 2;
delete vm.obj.a;
vm.arr[0] = 10;
vm.arr.length = 0;

// Обходное решение Vue2
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Нативная поддержка Vue3 =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3],
});

state.obj.b = 2;
delete state.obj.a;
state.arr[0] = 10;
state.arr.length = 0;
```

### Резюме

Vue3 использует `Proxy`, чтобы:

1. Обеспечить полное покрытие реактивности (добавление/удаление/изменение по индексу)
2. Улучшить производительность (меньше предварительного обхода)
3. Упростить реализацию
4. Улучшить опыт разработчика (меньше специальных API)

Компромисс: отсутствие поддержки устаревшего IE11, что приемлемо для современных веб-целей.

## Справочные материалы

- [Реактивность Vue 2 в деталях](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Реактивность Vue 3 в деталях](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
