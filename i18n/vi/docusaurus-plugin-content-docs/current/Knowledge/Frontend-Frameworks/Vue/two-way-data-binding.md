---
id: vue-two-way-data-binding
title: '[Hard] Ràng buộc dữ liệu hai chiều'
slug: /vue-two-way-data-binding
tags: [Vue, Quiz, Hard]
---

## 1. Please explain the underlying principle of how Vue2 and Vue3 each implement two-way binding

> Giải thích nguyên lý cơ bản của ràng buộc hai chiều trong Vue 2 và Vue 3.

Để hiểu ràng buộc hai chiều của Vue, trước tiên cần nắm cơ chế hoạt động của hệ thống reactive, cũng như sự khác biệt trong cách triển khai giữa Vue 2 và Vue 3.

### Cách triển khai của Vue 2

Vue 2 sử dụng `Object.defineProperty` để triển khai ràng buộc hai chiều. Phương thức này cho phép đóng gói thuộc tính của đối tượng thành `getter` và `setter` để theo dõi thay đổi.

#### 1. Data Hijacking (Chiếm quyền dữ liệu)

Trong Vue 2, khi đối tượng dữ liệu của component được tạo, Vue duyệt qua tất cả thuộc tính và sử dụng `Object.defineProperty` để chuyển chúng thành `getter` và `setter`, cho phép Vue theo dõi việc đọc và sửa đổi dữ liệu.

#### 2. Dependency Collection (Thu thập phụ thuộc)

Mỗi khi hàm render của component được thực thi, nó đọc các thuộc tính trong data, kích hoạt `getter`. Vue ghi lại các phụ thuộc này để đảm bảo rằng khi dữ liệu thay đổi, các component phụ thuộc được thông báo.

#### 3. Dispatching Updates (Phát đi cập nhật)

Khi dữ liệu bị sửa đổi, `setter` được kích hoạt. Vue thông báo cho tất cả component phụ thuộc và thực thi lại hàm render để cập nhật DOM.

#### Ví dụ mã Vue 2

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

console.log(data.name); // Kích hoạt getter, in "get name: Pitt"
data.name = 'Vue2 Reactivity'; // Kích hoạt setter, in "set name: Vue2 Reactivity"
```

#### Hạn chế của Vue 2

Sử dụng `Object.defineProperty` có một số hạn chế:

- **Không thể phát hiện thêm hoặc xóa thuộc tính**: phải dùng `Vue.set()` hoặc `Vue.delete()`
- **Không thể phát hiện thay đổi chỉ số mảng**: phải dùng các phương thức mảng của Vue (như `push`, `pop`, v.v.)
- **Vấn đề hiệu năng**: cần duyệt đệ quy tất cả thuộc tính, định nghĩa trước getter và setter

### Cách triển khai của Vue 3

Vue 3 giới thiệu `Proxy` của ES6, cho phép đóng gói đối tượng thành proxy và theo dõi thay đổi thuộc tính, đồng thời tối ưu hiệu năng hơn.

#### 1. Chiếm quyền dữ liệu bằng Proxy

Trong Vue 3, `new Proxy` được dùng để tạo proxy cho dữ liệu, thay vì định nghĩa `getter` và `setter` từng thuộc tính. Điều này cho phép theo dõi chi tiết hơn và chặn nhiều loại thao tác hơn, như thêm hoặc xóa thuộc tính.

#### 2. Theo dõi phụ thuộc hiệu quả hơn

Với Proxy, Vue 3 theo dõi phụ thuộc hiệu quả hơn vì không cần định nghĩa trước `getter/setter`. Proxy có thể chặn tới 13 loại thao tác (`get`, `set`, `has`, `deleteProperty`, v.v.).

#### 3. Render lại tối thiểu tự động

Khi dữ liệu thay đổi, Vue 3 xác định chính xác hơn phần nào của giao diện cần cập nhật, giảm render lại không cần thiết.

#### Ví dụ mã Vue 3

```js
function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      console.log(`Lấy ${key}: ${result}`);
      return result;
    },
    set(target, key, value, receiver) {
      const success = Reflect.set(target, key, value, receiver);
      console.log(`Đặt ${key}: ${value}`);
      return success;
    },
  };

  return new Proxy(target, handler);
}

const data = reactive({ name: 'Vue 3' });

console.log(data.name); // Đọc dữ liệu, kích hoạt get của Proxy
data.name = 'Vue 3 Reactivity'; // Sửa dữ liệu, kích hoạt set của Proxy
console.log(data.name);
```

### Bảng so sánh Vue 2 vs Vue 3

| Đặc điểm | Vue 2 | Vue 3 |
| --- | --- | --- |
| Triển khai | `Object.defineProperty` | `Proxy` |
| Phát hiện thêm thuộc tính | Cần `Vue.set()` | Hỗ trợ native |
| Phát hiện xóa thuộc tính | Cần `Vue.delete()` | Hỗ trợ native |
| Phát hiện chỉ số mảng | Cần phương thức đặc biệt | Hỗ trợ native |
| Hiệu năng | Duyệt đệ quy tất cả thuộc tính | Xử lý lười, hiệu năng tốt hơn |
| Hỗ trợ trình duyệt | IE9+ | Không hỗ trợ IE11 |

### Kết luận

Vue 2 sử dụng `Object.defineProperty` để triển khai ràng buộc hai chiều, nhưng phương thức này có hạn chế (như không phát hiện được thêm hoặc xóa thuộc tính). Vue 3 giới thiệu `Proxy` của ES6, cung cấp hệ thống reactive mạnh mẽ và linh hoạt hơn, đồng thời cải thiện hiệu năng. Đây là một trong những cải tiến quan trọng nhất của Vue 3 so với Vue 2.

## 2. Why does Vue3 use `Proxy` instead of `Object.defineProperty`?

> Tại sao Vue 3 sử dụng `Proxy` thay vì `Object.defineProperty`?

### Lý do chính

#### 1. Khả năng chặn mạnh mẽ hơn

`Proxy` có thể chặn tới 13 loại thao tác, trong khi `Object.defineProperty` chỉ chặn được đọc và ghi thuộc tính:

```js
const handler = {
  get() {},              // Đọc thuộc tính
  set() {},              // Ghi thuộc tính
  has() {},              // Toán tử in
  deleteProperty() {},   // Toán tử delete
  ownKeys() {},          // Object.keys()
  getOwnPropertyDescriptor() {},
  defineProperty() {},
  preventExtensions() {},
  getPrototypeOf() {},
  isExtensible() {},
  setPrototypeOf() {},
  apply() {},            // Gọi hàm
  construct() {}         // Toán tử new
};
```

#### 2. Hỗ trợ native theo dõi chỉ số mảng

```js
// Vue 2 không phát hiện được
const arr = [1, 2, 3];
arr[0] = 10; // Không kích hoạt cập nhật

// Vue 3 phát hiện được
const arr = reactive([1, 2, 3]);
arr[0] = 10; // Kích hoạt cập nhật
```

#### 3. Hỗ trợ native thêm/xóa thuộc tính động

```js
// Vue 2 cần xử lý đặc biệt
Vue.set(obj, 'newKey', 'value');
obj.newKey = 'value'; // Không kích hoạt cập nhật

// Vue 3 hỗ trợ native
const obj = reactive({});
obj.newKey = 'value'; // Kích hoạt cập nhật
delete obj.newKey; // Cũng kích hoạt cập nhật
```

#### 4. Hiệu năng tốt hơn

```js
// Vue 2: duyệt đệ quy tất cả thuộc tính
function observe(obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key]);
    if (typeof obj[key] === 'object') {
      observe(obj[key]);
    }
  });
}

// Vue 3: xử lý lười, chỉ proxy khi truy cập
function reactive(obj) {
  return new Proxy(obj, handler); // Không cần đệ quy
}
```

#### 5. Mã ngắn gọn hơn

Mã triển khai reactive của Vue 3 giảm đáng kể, chi phí bảo trì thấp hơn.

### Tại sao Vue 2 không dùng Proxy?

Chủ yếu do **tương thích trình duyệt**:

- Khi Vue 2 ra mắt (2016), Proxy chưa được hỗ trợ rộng rãi
- Vue 2 cần hỗ trợ IE9+, và Proxy không thể polyfill
- Vue 3 bỏ hỗ trợ IE11, nên có thể dùng Proxy

### Ví dụ so sánh thực tế

```js
// ===== Hạn chế của Vue 2 =====
const vm = new Vue({
  data: {
    obj: { a: 1 },
    arr: [1, 2, 3]
  }
});

// Các thao tác sau không kích hoạt cập nhật
vm.obj.b = 2;           // Thêm thuộc tính
delete vm.obj.a;        // Xóa thuộc tính
vm.arr[0] = 10;         // Sửa chỉ số mảng
vm.arr.length = 0;      // Sửa độ dài mảng

// Cần dùng phương thức đặc biệt
Vue.set(vm.obj, 'b', 2);
Vue.delete(vm.obj, 'a');
vm.arr.splice(0, 1, 10);

// ===== Vue 3 hỗ trợ native =====
const state = reactive({
  obj: { a: 1 },
  arr: [1, 2, 3]
});

// Tất cả thao tác sau đều kích hoạt cập nhật
state.obj.b = 2;        // Thêm thuộc tính
delete state.obj.a;     // Xóa thuộc tính
state.arr[0] = 10;      // Sửa chỉ số mảng
state.arr.length = 0;   // Sửa độ dài mảng
```

### Tổng kết

Vue 3 sử dụng `Proxy` để:

1. Cung cấp hỗ trợ reactive đầy đủ hơn (thêm/xóa thuộc tính, chỉ số mảng, v.v.)
2. Cải thiện hiệu năng (xử lý lười, không cần duyệt đệ quy trước)
3. Đơn giản hóa mã (triển khai ngắn gọn hơn)
4. Mang lại trải nghiệm phát triển tốt hơn (không cần nhớ API đặc biệt)

Đánh đổi duy nhất là bỏ hỗ trợ trình duyệt cũ (IE11), nhưng đây là đánh đổi xứng đáng.

## Reference

- [Vue 2 Reactivity in Depth](https://v2.vuejs.org/v2/guide/reactivity.html)
- [Vue 3 Reactivity in Depth](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [MDN - Object.defineProperty](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [MDN - Proxy](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN - Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
