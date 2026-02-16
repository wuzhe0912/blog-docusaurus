---
id: static-hoisting
title: '[Medium] Static Hoisting trong Vue 3'
slug: /static-hoisting
tags: [Vue, Quiz, Medium]
---

## 1. What is Static Hoisting in Vue 3?

> Static Hoisting trong Vue 3 là gì?

Trong Vue 3, **Static Hoisting (nâng tĩnh)** là một kỹ thuật tối ưu hóa ở giai đoạn biên dịch.

### Định nghĩa

**Static Hoisting** là kỹ thuật tối ưu hóa của trình biên dịch Vue 3 khi biên dịch template. Trình biên dịch sẽ phân tích những nút nào hoàn toàn không phụ thuộc vào trạng thái reactive và sẽ không bao giờ thay đổi, sau đó trích xuất chúng thành hằng số ở đầu file, chỉ tạo một lần khi render lần đầu và tái sử dụng trực tiếp trong các lần render tiếp theo, giảm chi phí tạo VNode và diff.

### Nguyên lý hoạt động

Trình biên dịch phân tích template, trích xuất các nút hoàn toàn không phụ thuộc vào trạng thái reactive và không bao giờ thay đổi, biến chúng thành hằng số ở đầu file, chỉ tạo một lần khi render lần đầu và tái sử dụng trực tiếp trong các lần render tiếp theo.

### So sánh trước và sau biên dịch

**Template trước biên dịch**:

<details>
<summary>Nhấp để xem ví dụ template</summary>

```vue
<template>
  <div>
    <h1>Tiêu đề tĩnh</h1>
    <p>Nội dung tĩnh</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

</details>

**JavaScript sau biên dịch** (phiên bản đơn giản):

<details>
<summary>Nhấp để xem JavaScript sau biên dịch</summary>

```js
// Các nút tĩnh được nâng lên đầu, chỉ tạo một lần
const _hoisted_1 = /*#__PURE__*/ h('h1', null, 'Tiêu đề tĩnh');
const _hoisted_2 = /*#__PURE__*/ h('p', null, 'Nội dung tĩnh');

function render() {
  return h('div', null, [
    _hoisted_1, // Tái sử dụng trực tiếp, không cần tạo lại
    _hoisted_2, // Tái sử dụng trực tiếp, không cần tạo lại
    h('div', null, dynamicContent.value), // Nội dung động cần tạo lại
  ]);
}
```

</details>

### Ưu điểm

1. **Giảm chi phí tạo VNode**: Các nút tĩnh chỉ tạo một lần và được tái sử dụng
2. **Giảm chi phí diff**: Các nút tĩnh không tham gia so sánh diff
3. **Cải thiện hiệu năng render**: Đặc biệt hiệu quả trong các component có nhiều nội dung tĩnh
4. **Tối ưu tự động**: Lập trình viên không cần viết gì đặc biệt để hưởng lợi từ tối ưu này

## 2. How Static Hoisting Works

> Static Hoisting hoạt động như thế nào?

### Quy trình phân tích của trình biên dịch

Trình biên dịch phân tích từng nút trong template:

1. **Kiểm tra liên kết động**

   - Kiểm tra có `{{ }}`, `v-bind`, `v-if`, `v-for` và các directive động khác không
   - Kiểm tra giá trị thuộc tính có chứa biến không

2. **Đánh dấu nút tĩnh**

   - Nếu nút và tất cả con của nó không có liên kết động, đánh dấu là nút tĩnh

3. **Nâng nút tĩnh**
   - Trích xuất nút tĩnh ra ngoài hàm render
   - Định nghĩa là hằng số ở đầu module

### Ví dụ 1: Nâng tĩnh cơ bản

<details>
<summary>Nhấp để xem ví dụ nâng tĩnh cơ bản</summary>

```vue
<template>
  <div>
    <h1>Tiêu đề</h1>
    <p>Đây là nội dung tĩnh</p>
    <div>Khối tĩnh</div>
  </div>
</template>
```

</details>

**Sau biên dịch**:

<details>
<summary>Nhấp để xem kết quả biên dịch</summary>

```js
// Tất cả nút tĩnh đều được nâng lên
const _hoisted_1 = h('h1', null, 'Tiêu đề');
const _hoisted_2 = h('p', null, 'Đây là nội dung tĩnh');
const _hoisted_3 = h('div', null, 'Khối tĩnh');

function render() {
  return h('div', null, [_hoisted_1, _hoisted_2, _hoisted_3]);
}
```

</details>

### Ví dụ 2: Kết hợp nội dung tĩnh và động

<details>
<summary>Nhấp để xem ví dụ nội dung hỗn hợp</summary>

```vue
<template>
  <div>
    <h1>Tiêu đề tĩnh</h1>
    <p>{{ message }}</p>
    <div class="static-class">Nội dung tĩnh</div>
    <span :class="dynamicClass">Nội dung động</span>
  </div>
</template>
```

</details>

**Sau biên dịch**:

<details>
<summary>Nhấp để xem kết quả biên dịch</summary>

```js
// Chỉ các nút hoàn toàn tĩnh được nâng lên
const _hoisted_1 = h('h1', null, 'Tiêu đề tĩnh');
const _hoisted_2 = { class: 'static-class' };
const _hoisted_3 = h('div', _hoisted_2, 'Nội dung tĩnh');

function render() {
  return h('div', null, [
    _hoisted_1, // Nút tĩnh, tái sử dụng
    h('p', null, message.value), // Nội dung động, cần tạo lại
    _hoisted_3, // Nút tĩnh, tái sử dụng
    h('span', { class: dynamicClass.value }, 'Nội dung động'), // Thuộc tính động, cần tạo lại
  ]);
}
```

</details>

### Ví dụ 3: Nâng thuộc tính tĩnh

<details>
<summary>Nhấp để xem ví dụ thuộc tính tĩnh</summary>

```vue
<template>
  <div>
    <div class="container" id="main">Nội dung</div>
    <button disabled>Nút</button>
  </div>
</template>
```

</details>

**Sau biên dịch**:

<details>
<summary>Nhấp để xem kết quả biên dịch</summary>

```js
// Đối tượng thuộc tính tĩnh cũng được nâng lên
const _hoisted_1 = { class: 'container', id: 'main' };
const _hoisted_2 = { disabled: true };
const _hoisted_3 = h('div', _hoisted_1, 'Nội dung');
const _hoisted_4 = h('button', _hoisted_2, 'Nút');

function render() {
  return h('div', null, [_hoisted_3, _hoisted_4]);
}
```

</details>

## 3. v-once Directive

> Directive v-once

Nếu lập trình viên muốn chủ động đánh dấu một khối nội dung lớn không bao giờ thay đổi, có thể sử dụng directive `v-once`.

### Tác dụng của v-once

`v-once` cho trình biên dịch biết rằng phần tử này và các phần tử con chỉ nên được render một lần, ngay cả khi chứa liên kết động, chúng chỉ được tính toán một lần khi render lần đầu và không được cập nhật sau đó.

### Cách dùng cơ bản

<details>
<summary>Nhấp để xem ví dụ cơ bản của v-once</summary>

```vue
<template>
  <div>
    <!-- Dùng v-once đánh dấu nội dung tĩnh -->
    <div v-once>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>

    <!-- Không dùng v-once, sẽ cập nhật reactive -->
    <div>
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Tiêu đề ban đầu');
const content = ref('Nội dung ban đầu');

// Ngay cả khi sửa các giá trị này, khối v-once cũng không cập nhật
setTimeout(() => {
  title.value = 'Tiêu đề mới';
  content.value = 'Nội dung mới';
}, 1000);
</script>
```

</details>

### v-once vs Static Hoisting

| Đặc điểm | Static Hoisting | v-once |
| ------------ | ------------------- | ------------------------ |
| **Kích hoạt** | Tự động (phân tích trình biên dịch) | Thủ công (lập trình viên đánh dấu) |
| **Trường hợp áp dụng** | Nội dung hoàn toàn tĩnh | Chứa liên kết động nhưng chỉ render một lần |
| **Hiệu năng** | Tốt nhất (không tham gia diff) | Tốt (chỉ render một lần) |
| **Thời điểm sử dụng** | Tự động quyết định khi biên dịch | Lập trình viên biết rõ không thay đổi |

### Trường hợp sử dụng

```vue
<template>
  <!-- Tình huống 1: Dữ liệu hiển thị một lần -->
  <div v-once>
    <p>Thời gian tạo: {{ createdAt }}</p>
    <p>Người tạo: {{ creator }}</p>
  </div>

  <!-- Tình huống 2: Cấu trúc tĩnh phức tạp -->
  <div v-once>
    <div class="header">
      <h1>Tiêu đề</h1>
      <nav>Điều hướng</nav>
    </div>
  </div>

  <!-- Tình huống 3: Mục tĩnh trong danh sách -->
  <div v-for="item in items" :key="item.id">
    <div v-once>
      <h2>{{ item.title }}</h2>
      <p>{{ item.description }}</p>
    </div>
  </div>
</template>
```

## 4. Common Interview Questions

> Câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Nguyên lý Static Hoisting

Giải thích nguyên lý hoạt động của Static Hoisting trong Vue 3 và cách nó cải thiện hiệu năng.

<details>
<summary>Nhấp để xem đáp án</summary>

**Nguyên lý hoạt động**:

1. **Phân tích khi biên dịch**: Trình biên dịch phân tích từng nút, kiểm tra liên kết động, đánh dấu nút tĩnh
2. **Nâng nút**: Trích xuất nút tĩnh ra ngoài hàm render, định nghĩa là hằng số ở đầu module
3. **Cơ chế tái sử dụng**: Các lần render tiếp theo tái sử dụng trực tiếp, không tạo lại VNode, không tham gia diff

**Cải thiện hiệu năng**:

- Giảm chi phí tạo VNode, giảm chi phí diff, giảm sử dụng bộ nhớ, cải thiện tốc độ render

</details>

### Câu hỏi 2: Khác biệt giữa Static Hoisting và v-once

<details>
<summary>Nhấp để xem đáp án</summary>

- Static Hoisting: tự động, nội dung hoàn toàn tĩnh, tối ưu nhất
- v-once: thủ công, có thể chứa liên kết động, chỉ render một lần
- Nếu nội dung hoàn toàn tĩnh -> để trình biên dịch tự xử lý
- Nếu nội dung có liên kết động nhưng chỉ render một lần -> dùng `v-once`

</details>

### Câu hỏi 3: Tình huống ứng dụng thực tế

<details>
<summary>Nhấp để xem đáp án</summary>

Static Hoisting hiệu quả rõ rệt nhất khi: component có nhiều nội dung tĩnh, mục tĩnh trong danh sách, component cập nhật thường xuyên, nhiều instance component. Có thể giảm 30-50% thời gian tạo VNode và 40-60% thời gian so sánh diff.

</details>

## 5. Best Practices

> Thực hành tốt nhất

### Phương pháp được khuyến nghị

```vue
<!-- 1. Để trình biên dịch tự động xử lý nội dung tĩnh -->
<template>
  <div>
    <h1>Tiêu đề</h1>
    <p>Nội dung tĩnh</p>
    <div>{{ dynamicContent }}</div>
  </div>
</template>

<!-- 2. Dùng v-once rõ ràng cho nội dung chỉ render một lần -->
<template>
  <div v-once>
    <p>Thời gian tạo: {{ createdAt }}</p>
    <p>Người tạo: {{ creator }}</p>
  </div>
</template>

<!-- 3. Tách cấu trúc tĩnh và nội dung động -->
<template>
  <div>
    <div class="container">
      <header>Tiêu đề</header>
      <main>{{ content }}</main>
    </div>
  </div>
</template>
```

### Phương pháp cần tránh

```vue
<!-- 1. Không lạm dụng v-once -->
<template>
  <div v-once>
    <p>{{ shouldUpdateContent }}</p>
  </div>
</template>

<!-- 2. Không dùng v-once trên nội dung động -->
<template>
  <div v-for="item in items" :key="item.id" v-once>
    <p>{{ item.content }}</p>
  </div>
</template>
```

## 6. Interview Summary

> Tổng kết phỏng vấn

### Ghi nhớ nhanh

- **Static Hoisting**: Trích xuất nút tĩnh thành hằng số khi biên dịch, chỉ tạo một lần, tự động, hiệu năng tốt nhất
- **v-once**: Đánh dấu thủ công nội dung chỉ render một lần, có thể chứa liên kết động

### Ví dụ trả lời phỏng vấn

**Q: Static Hoisting trong Vue 3 là gì?**

> "Trong Vue 3, Static Hoisting là một tối ưu hóa ở giai đoạn biên dịch. Trình biên dịch phân tích template, trích xuất các nút hoàn toàn không phụ thuộc trạng thái reactive và không bao giờ thay đổi, biến chúng thành hằng số ở đầu file, chỉ tạo một lần khi render đầu tiên và tái sử dụng trực tiếp trong các lần render tiếp theo, giảm chi phí tạo VNode và diff. Lập trình viên không cần viết gì đặc biệt, chỉ cần viết template bình thường, trình biên dịch sẽ tự quyết định nút nào có thể được nâng lên. Nếu muốn chủ động đánh dấu khối nội dung không thay đổi, có thể dùng v-once."

## Reference

- [Vue 3 Compiler Optimization](https://vuejs.org/guide/extras/rendering-mechanism.html#static-hoisting)
- [Vue 3 v-once](https://vuejs.org/api/built-in-directives.html#v-once)
- [Vue 3 Template Compilation](https://vuejs.org/guide/extras/rendering-mechanism.html)
