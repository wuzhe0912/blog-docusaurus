---
id: vue3-new-features
title: '[Easy] Tính năng mới của Vue 3'
slug: /vue3-new-features
tags: [Vue, Quiz, Easy]
---

## 1. What are the new features in Vue 3?

> Vue 3 có những tính năng mới nào?

Vue 3 đã giới thiệu nhiều tính năng mới và cải tiến, bao gồm:

### Các tính năng mới chính

1. **Composition API**: cách viết component mới
2. **Teleport**: render nội dung component đến vị trí khác trong DOM
3. **Fragment**: component có thể có nhiều node gốc
4. **Suspense**: xử lý trạng thái tải component bất đồng bộ
5. **Nhiều v-model**: hỗ trợ nhiều v-model
6. **Hỗ trợ TypeScript tốt hơn**
7. **Tối ưu hiệu năng**: bundle nhỏ hơn, tốc độ render nhanh hơn

## 2. Teleport

> Teleport là gì?

**Định nghĩa**: `Teleport` cho phép render nội dung component đến vị trí khác trong cây DOM mà không thay đổi cấu trúc logic của component.

### Trường hợp sử dụng

**Trường hợp thường gặp**: Modal, Tooltip, Notification và các component cần render vào body

<details>
<summary>Nhấp để xem ví dụ Teleport</summary>

```vue
<template>
  <div>
    <button @click="showModal = true">Mở Modal</button>

    <!-- Dùng Teleport để render Modal vào body -->
    <Teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <h2>Tiêu đề Modal</h2>
          <p>Nội dung Modal</p>
          <button @click="showModal = false">Đóng</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showModal = ref(false);
</script>
```

</details>

### Ưu điểm

1. **Giải quyết vấn đề z-index**: Modal render vào body, không bị ảnh hưởng bởi style của component cha
2. **Giữ cấu trúc logic**: logic component vẫn ở vị trí ban đầu, chỉ vị trí DOM khác
3. **Bảo trì tốt hơn**: code liên quan đến Modal tập trung trong component

## 3. Fragment (nhiều node gốc)

> Fragment là gì?

**Định nghĩa**: Vue 3 cho phép component có nhiều node gốc, không cần bọc trong một phần tử duy nhất. Đây là Fragment ngầm định, không cần dùng thẻ `<Fragment>` như React.

### Vue 2 vs Vue 3

**Vue 2**: phải có một node gốc duy nhất

```vue
<!-- Vue 2: phải bọc trong một phần tử duy nhất -->
<template>
  <div>
    <h1>Tiêu đề</h1>
    <p>Nội dung</p>
  </div>
</template>
```

**Vue 3**: có thể có nhiều node gốc

```vue
<!-- Vue 3: có thể có nhiều node gốc -->
<template>
  <h1>Tiêu đề</h1>
  <p>Nội dung</p>
</template>
```

### Tại sao cần Fragment?

Trong Vue 2, component phải có một node gốc duy nhất, buộc lập trình viên thường phải thêm phần tử bọc (như `<div>`), những phần tử này:

1. **Phá vỡ HTML ngữ nghĩa**: thêm phần tử bọc không có ý nghĩa
2. **Tăng độ sâu DOM**: ảnh hưởng đến CSS selector và hiệu năng
3. **Khó kiểm soát style**: cần xử lý style cho phần tử bọc thêm

### Trường hợp sử dụng

#### Trường hợp 1: Cấu trúc HTML ngữ nghĩa

```vue
<template>
  <!-- Không cần phần tử bọc thêm -->
  <header>
    <h1>Tiêu đề trang web</h1>
  </header>
  <main>
    <p>Nội dung chính</p>
  </main>
  <footer>
    <p>Chân trang</p>
  </footer>
</template>
```

#### Trường hợp 2: Component mục danh sách

```vue
<!-- ListItem.vue -->
<template>
  <li class="item-title">{{ title }}</li>
  <li class="item-description">{{ description }}</li>
</template>

<script setup>
defineProps({
  title: String,
  description: String,
});
</script>
```

#### Trường hợp 3: Render có điều kiện nhiều phần tử

```vue
<template>
  <div v-if="showHeader" class="header">Tiêu đề</div>
  <div v-if="showContent" class="content">Nội dung</div>
  <div v-if="showFooter" class="footer">Chân trang</div>
</template>
```

### Kế thừa thuộc tính (Attribute Inheritance)

Khi component có nhiều node gốc, hành vi kế thừa thuộc tính sẽ khác.

**Node gốc đơn**: thuộc tính tự động kế thừa vào phần tử gốc

```vue
<!-- Component cha -->
<MyComponent class="custom-class" id="my-id" />

<!-- Component con (gốc đơn) -->
<template>
  <div>Nội dung</div>
</template>

<!-- Kết quả render -->
<div class="custom-class" id="my-id">Nội dung</div>
```

**Nhiều node gốc**: thuộc tính không tự động kế thừa, cần chỉ định thủ công

```vue
<!-- Component cha -->
<MyComponent class="custom-class" id="my-id" />

<!-- Component con (nhiều gốc) -->
<template>
  <div>Node gốc thứ nhất</div>
  <div>Node gốc thứ hai</div>
</template>

<!-- Kết quả render: thuộc tính không được kế thừa -->
<div>Node gốc thứ nhất</div>
<div>Node gốc thứ hai</div>
```

**Giải pháp**: dùng `$attrs` để ràng buộc thuộc tính thủ công

```vue
<!-- Component con -->
<template>
  <div v-bind="$attrs">Node gốc thứ nhất</div>
  <div>Node gốc thứ hai</div>
</template>

<!-- Kết quả render -->
<div class="custom-class" id="my-id">Node gốc thứ nhất</div>
<div>Node gốc thứ hai</div>
```

**Dùng `inheritAttrs: false` để kiểm soát kế thừa**:

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Tắt kế thừa tự động
});
</script>

<template>
  <div v-bind="$attrs">Node gốc thứ nhất</div>
  <div>Node gốc thứ hai</div>
</template>
```

### Fragment vs React Fragment

| Đặc điểm              | Vue 3 Fragment            | React Fragment                    |
| ---------------------- | ------------------------- | --------------------------------- |
| **Cú pháp**           | Ngầm định (không cần thẻ) | Tường minh (`<Fragment>` hoặc `<>`) |
| **Thuộc tính Key**    | Không cần                 | Cần khi dùng `<Fragment key={...}>` |
| **Kế thừa thuộc tính** | Cần xử lý thủ công       | Không hỗ trợ                      |

**Vue 3**:

```vue
<!-- Vue 3: Fragment ngầm định -->
<template>
  <h1>Tiêu đề</h1>
  <p>Nội dung</p>
</template>
```

**React**:

```jsx
// React: Fragment tường minh
function Component() {
  return (
    <>
      <h1>Tiêu đề</h1>
      <p>Nội dung</p>
    </>
  );
}
```

### Lưu ý

1. **Kế thừa thuộc tính**: khi có nhiều node gốc, thuộc tính không tự động kế thừa, cần dùng `$attrs` ràng buộc thủ công
2. **Phạm vi style**: khi có nhiều node gốc, style `scoped` áp dụng cho tất cả node gốc
3. **Bọc logic**: nếu cần bọc theo logic, vẫn nên dùng một node gốc duy nhất

```vue
<!-- Cách làm tốt: bọc cần thiết theo logic -->
<template>
  <div class="card">
    <h2>Tiêu đề</h2>
    <p>Nội dung</p>
  </div>
</template>

<!-- Cần tránh: nhiều gốc không có lý do -->
<template>
  <h2>Tiêu đề</h2>
  <p>Nội dung</p>
  <!-- Nếu hai phần tử này thuộc về một nhóm logic, nên bọc lại -->
</template>
```

## 4. Suspense

> Suspense là gì?

**Định nghĩa**: `Suspense` là component tích hợp, dùng để xử lý trạng thái tải của component bất đồng bộ.

### Cách sử dụng cơ bản

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Đang tải...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);
</script>
```

### Trường hợp sử dụng

1. **Tải component bất đồng bộ**

   ```vue
   <Suspense>
     <AsyncUserProfile :userId="userId" />
     <template #fallback>
       <UserProfileSkeleton />
     </template>
   </Suspense>
   ```

2. **Tải dữ liệu bất đồng bộ**
   ```vue
   <script setup>
   const data = await fetchData(); // Dùng await trong setup
   </script>
   ```

## 5. Multiple v-model

> Nhiều v-model

**Định nghĩa**: Vue 3 cho phép component sử dụng nhiều `v-model`, mỗi `v-model` tương ứng với một prop khác nhau.

### Vue 2 vs Vue 3

**Vue 2**: chỉ có thể có một `v-model`

```vue
<!-- Vue 2: chỉ một v-model -->
<CustomInput v-model="value" />
```

**Vue 3**: có thể có nhiều `v-model`

```vue
<!-- Vue 3: nhiều v-model -->
<CustomForm
  v-model:username="username"
  v-model:email="email"
  v-model:password="password"
/>
```

### Ví dụ triển khai

```vue
<!-- CustomForm.vue -->
<template>
  <div>
    <input
      :value="username"
      @input="$emit('update:username', $event.target.value)"
    />
    <input :value="email" @input="$emit('update:email', $event.target.value)" />
    <input
      :value="password"
      @input="$emit('update:password', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps(['username', 'email', 'password']);
defineEmits(['update:username', 'update:email', 'update:password']);
</script>
```

## 6. Common Interview Questions

> Câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Trường hợp sử dụng Teleport

Hãy cho biết khi nào nên sử dụng `Teleport`.

<details>
<summary>Nhấp để xem đáp án</summary>

**Trường hợp sử dụng Teleport**:

1. **Hộp thoại Modal**

   ```vue
   <Teleport to="body">
     <Modal v-if="showModal" />
   </Teleport>
   ```

   - Giải quyết vấn đề z-index
   - Không bị ảnh hưởng bởi style component cha

2. **Tooltip**

   ```vue
   <Teleport to="body">
     <Tooltip v-if="showTooltip" />
   </Teleport>
   ```

   - Tránh bị ẩn bởi overflow của cha

3. **Notification**
   ```vue
   <Teleport to="#notifications">
     <Notification v-for="msg in messages" :key="msg.id" />
   </Teleport>
   ```
   - Quản lý thống nhất vị trí thông báo

**Trường hợp không cần Teleport**:

- Nội dung thông thường
- Component không cần vị trí DOM đặc biệt

</details>

### Câu hỏi 2: Ưu điểm của Fragment

Hãy cho biết ưu điểm của việc Vue 3 cho phép nhiều node gốc.

<details>
<summary>Nhấp để xem đáp án</summary>

**Ưu điểm**:

1. **Giảm phần tử DOM không cần thiết**

   ```vue
   <!-- Vue 2: cần div thêm -->
   <template>
     <div>
       <header>...</header>
       <main>...</main>
     </div>
   </template>

   <!-- Vue 3: không cần phần tử thêm -->
   <template>
     <header>...</header>
     <main>...</main>
   </template>
   ```

2. **HTML ngữ nghĩa tốt hơn**

   - Không cần thêm phần tử bọc không có ý nghĩa
   - Giữ tính ngữ nghĩa của cấu trúc HTML

3. **Kiểm soát style linh hoạt hơn**

   - Không cần xử lý style cho phần tử bọc thêm
   - Giảm độ phức tạp CSS selector

4. **Giảm độ sâu DOM**

   - Cây DOM nông hơn, hiệu năng tốt hơn
   - Giảm chi phí render của trình duyệt

5. **Bảo trì tốt hơn**
   - Code ngắn gọn hơn, không cần phần tử bọc thêm
   - Cấu trúc component rõ ràng hơn

</details>

### Câu hỏi 3: Vấn đề kế thừa thuộc tính với Fragment

Hãy giải thích hành vi kế thừa thuộc tính khi component có nhiều node gốc và cách giải quyết.

<details>
<summary>Nhấp để xem đáp án</summary>

**Vấn đề**:

Khi component có nhiều node gốc, các thuộc tính truyền từ component cha (như `class`, `id`, v.v.) không tự động kế thừa vào bất kỳ node gốc nào.

**Ví dụ**:

```vue
<!-- Component cha -->
<MyComponent class="custom-class" id="my-id" />

<!-- Component con (nhiều gốc) -->
<template>
  <div>Node gốc thứ nhất</div>
  <div>Node gốc thứ hai</div>
</template>

<!-- Kết quả: thuộc tính không được kế thừa -->
<div>Node gốc thứ nhất</div>
<div>Node gốc thứ hai</div>
```

**Giải pháp**:

1. **Dùng `$attrs` ràng buộc thuộc tính thủ công**

```vue
<!-- Component con -->
<template>
  <div v-bind="$attrs">Node gốc thứ nhất</div>
  <div>Node gốc thứ hai</div>
</template>

<!-- Kết quả -->
<div class="custom-class" id="my-id">Node gốc thứ nhất</div>
<div>Node gốc thứ hai</div>
```

2. **Dùng `inheritAttrs: false` kiểm soát kế thừa**

```vue
<script setup>
defineOptions({
  inheritAttrs: false, // Tắt kế thừa tự động
});
</script>

<template>
  <div v-bind="$attrs">Node gốc thứ nhất</div>
  <div>Node gốc thứ hai</div>
</template>
```

3. **Ràng buộc có chọn lọc thuộc tính cụ thể**

```vue
<template>
  <div :class="$attrs.class">Node gốc thứ nhất</div>
  <div :id="$attrs.id">Node gốc thứ hai</div>
</template>
```

**Điểm chính**:

- Node gốc đơn: thuộc tính tự động kế thừa
- Nhiều node gốc: thuộc tính không tự động kế thừa, cần xử lý thủ công
- `$attrs` cho phép truy cập tất cả thuộc tính chưa định nghĩa trong `props`

</details>

### Câu hỏi 4: Fragment vs React Fragment

So sánh sự khác biệt giữa Vue 3 Fragment và React Fragment.

<details>
<summary>Nhấp để xem đáp án</summary>

**Khác biệt chính**:

| Đặc điểm              | Vue 3 Fragment            | React Fragment                    |
| ---------------------- | ------------------------- | --------------------------------- |
| **Cú pháp**           | Ngầm định (không cần thẻ) | Tường minh (`<Fragment>` hoặc `<>`) |
| **Thuộc tính Key**    | Không cần                 | Cần khi dùng `<Fragment key={...}>` |
| **Kế thừa thuộc tính** | Cần xử lý thủ công (`$attrs`) | Không hỗ trợ                 |

**Vue 3**:

```vue
<!-- Vue 3: Fragment ngầm định, viết trực tiếp nhiều node gốc -->
<template>
  <h1>Tiêu đề</h1>
  <p>Nội dung</p>
</template>
```

**React**:

```jsx
// React: Fragment tường minh, cần dùng thẻ
function Component() {
  return (
    <>
      <h1>Tiêu đề</h1>
      <p>Nội dung</p>
    </>
  );
}

// Hoặc dùng Fragment
import { Fragment } from 'react';
function Component() {
  return (
    <Fragment>
      <h1>Tiêu đề</h1>
      <p>Nội dung</p>
    </Fragment>
  );
}
```

**So sánh ưu điểm**:

- **Vue 3**: cú pháp ngắn gọn hơn, không cần thẻ thêm
- **React**: tường minh hơn, có thể thêm thuộc tính key

</details>

### Câu hỏi 5: Sử dụng Suspense

Hãy triển khai ví dụ dùng `Suspense` để tải component bất đồng bộ.

<details>
<summary>Nhấp để xem đáp án</summary>

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncUserProfile :userId="userId" />
    </template>
    <template #fallback>
      <div class="loading">
        <Spinner />
        <p>Đang tải dữ liệu người dùng...</p>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue';
import { defineAsyncComponent } from 'vue';
import Spinner from './Spinner.vue';

const userId = ref(1);

// Định nghĩa component bất đồng bộ
const AsyncUserProfile = defineAsyncComponent(() =>
  import('./UserProfile.vue')
);
</script>
```

**Sử dụng nâng cao: xử lý lỗi**

```vue
<template>
  <Suspense @resolve="onResolve" @reject="onReject">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Đang tải...</div>
    </template>
  </Suspense>
</template>

<script setup>
const onResolve = () => {
  console.log('Component tải thành công');
};

const onReject = (error) => {
  console.error('Component tải thất bại:', error);
};
</script>
```

</details>

## 7. Best Practices

> Thực hành tốt nhất

### Cách làm khuyến nghị

```vue
<!-- 1. Dùng Teleport cho Modal -->
<Teleport to="body">
  <Modal v-if="showModal" />
</Teleport>

<!-- 2. Giữ tính ngữ nghĩa cho nhiều node gốc -->
<template>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</template>

<!-- 3. Dùng Suspense cho component bất đồng bộ -->
<Suspense>
  <AsyncComponent />
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>

<!-- 4. Dùng tên rõ ràng cho nhiều v-model -->
<CustomForm v-model:username="username" v-model:email="email" />
```

### Cách làm cần tránh

```vue
<!-- 1. Không lạm dụng Teleport -->
<Teleport to="body">
  <div>Nội dung thông thường</div> <!-- Không cần thiết -->
</Teleport>

<!-- 2. Không phá vỡ cấu trúc chỉ vì muốn nhiều node gốc -->
<template>
  <h1>Tiêu đề</h1>
  <p>Nội dung</p>
  <!-- Nếu logic cần bọc lại, vẫn nên dùng một node gốc -->
</template>

<!-- 3. Không bỏ qua xử lý lỗi với Suspense -->
<Suspense>
  <AsyncComponent />
  <!-- Nên xử lý trường hợp tải thất bại -->
</Suspense>
```

## 8. Interview Summary

> Tổng kết phỏng vấn

### Ghi nhớ nhanh

**Tính năng mới chính của Vue 3**:

- **Composition API**: cách viết component mới
- **Teleport**: render nội dung đến vị trí DOM khác
- **Fragment**: hỗ trợ nhiều node gốc
- **Suspense**: xử lý tải component bất đồng bộ
- **Nhiều v-model**: hỗ trợ nhiều ràng buộc v-model

**Trường hợp sử dụng**:

- Modal/Tooltip -> `Teleport`
- HTML ngữ nghĩa -> `Fragment`
- Component bất đồng bộ -> `Suspense`
- Component form -> Nhiều `v-model`

### Ví dụ trả lời phỏng vấn

**Q: Vue 3 có những tính năng mới chính nào?**

> "Vue 3 đã giới thiệu nhiều tính năng mới, bao gồm: 1) Composition API, cung cấp cách viết component mới với tổ chức logic và tái sử dụng code tốt hơn; 2) Teleport, cho phép render nội dung component đến vị trí khác trong cây DOM, thường dùng cho Modal, Tooltip; 3) Fragment, cho phép component có nhiều node gốc, không cần phần tử bọc thêm; 4) Suspense, xử lý trạng thái tải component bất đồng bộ; 5) Nhiều v-model, hỗ trợ nhiều ràng buộc v-model trong component; 6) Hỗ trợ TypeScript tốt hơn và tối ưu hiệu năng. Các tính năng mới này làm Vue 3 mạnh mẽ và linh hoạt hơn, đồng thời duy trì tính tương thích ngược."

**Q: Trường hợp sử dụng Teleport là gì?**

> "Teleport chủ yếu dùng cho các tình huống cần render nội dung component đến vị trí khác trong cây DOM. Trường hợp thường gặp bao gồm: 1) Hộp thoại Modal, cần render vào body để tránh vấn đề z-index; 2) Tooltip, tránh bị ẩn bởi overflow của cha; 3) Notification, quản lý thống nhất vị trí thông báo. Ưu điểm của Teleport là giữ nguyên cấu trúc logic của component, chỉ thay đổi vị trí render trong DOM, vừa giải quyết vấn đề style vừa giữ tính bảo trì của code."

## Reference

- [Vue 3 Teleport](https://vuejs.org/guide/built-ins/teleport.html)
- [Vue 3 Fragment](https://v3-migration.vuejs.org/breaking-changes/fragments.html)
- [Vue 3 Suspense](https://vuejs.org/guide/built-ins/suspense.html)
- [Vue 3 Multiple v-model](https://vuejs.org/guide/components/v-model.html#multiple-v-model-bindings)
