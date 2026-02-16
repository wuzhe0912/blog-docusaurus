---
id: ref-vs-reactive
title: '[Medium] ref vs reactive'
slug: /ref-vs-reactive
tags: [Vue, Quiz, Medium]
---

## 1. What are ref and reactive?

> ref và reactive là gì?

`ref` và `reactive` là hai API cốt lõi trong Composition API của Vue 3 để tạo dữ liệu phản ứng (reactive).

### ref

**Định nghĩa**: `ref` dùng để tạo một **giá trị kiểu nguyên thủy** hoặc **tham chiếu đối tượng** có tính phản ứng.

<details>
<summary>Nhấp để xem ví dụ cơ bản của ref</summary>

```vue
<script setup>
import { ref } from 'vue';

// Kiểu nguyên thủy
const count = ref(0);
const message = ref('Hello');
const isActive = ref(true);

// Đối tượng (cũng có thể dùng ref)
const user = ref({
  name: 'John',
  age: 30,
});

// Truy cập cần sử dụng .value
console.log(count.value); // 0
count.value++; // Sửa đổi giá trị
</script>
```

</details>

### reactive

**Định nghĩa**: `reactive` dùng để tạo một **đối tượng** có tính phản ứng (không thể dùng trực tiếp cho kiểu nguyên thủy).

<details>
<summary>Nhấp để xem ví dụ cơ bản của reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

// Chỉ dùng cho đối tượng
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'John',
    age: 30,
  },
});

// Truy cập trực tiếp thuộc tính, không cần .value
console.log(state.count); // 0
state.count++; // Sửa đổi giá trị
</script>
```

</details>

## 2. ref vs reactive: Key Differences

> Sự khác biệt chính giữa ref và reactive

### 1. Kiểu dữ liệu áp dụng

**ref**: Có thể dùng cho mọi kiểu

```typescript
const count = ref(0); // Số
const message = ref('Hello'); // Chuỗi
const isActive = ref(true); // Boolean
const user = ref({ name: 'John' }); // Đối tượng
const items = ref([1, 2, 3]); // Mảng
```

**reactive**: Chỉ dùng cho đối tượng

```typescript
const state = reactive({ count: 0 }); // Đối tượng
const state = reactive([1, 2, 3]); // Mảng (cũng là đối tượng)
const count = reactive(0); // Lỗi: kiểu nguyên thủy không được
const message = reactive('Hello'); // Lỗi: kiểu nguyên thủy không được
```

### 2. Cách truy cập

**ref**: Cần sử dụng `.value` để truy cập

<details>
<summary>Nhấp để xem ví dụ truy cập ref</summary>

```vue
<script setup>
import { ref } from 'vue';

const count = ref(0);

// Trong JavaScript cần sử dụng .value
console.log(count.value); // 0
count.value = 10;

// Trong template tự động unwrap, không cần .value
</script>

<template>
  <div>{{ count }}</div>
  <!-- Tự động unwrap, không cần .value -->
</template>
```

</details>

**reactive**: Truy cập trực tiếp thuộc tính

<details>
<summary>Nhấp để xem ví dụ truy cập reactive</summary>

```vue
<script setup>
import { reactive } from 'vue';

const state = reactive({ count: 0 });

// Truy cập trực tiếp thuộc tính
console.log(state.count); // 0
state.count = 10;
</script>

<template>
  <div>{{ state.count }}</div>
</template>
```

</details>

### 3. Gán lại giá trị

**ref**: Có thể gán lại

```typescript
const user = ref({ name: 'John' });
user.value = { name: 'Jane' }; // Có thể gán lại
```

**reactive**: Không thể gán lại (mất tính phản ứng)

```typescript
let state = reactive({ count: 0 });
state = { count: 10 }; // Mất tính phản ứng, không kích hoạt cập nhật
```

### 4. Phân rã (Destructuring)

**ref**: Phân rã vẫn giữ tính phản ứng

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value; // Phân rã giá trị nguyên thủy, mất tính phản ứng

// Nhưng có thể phân rã bản thân ref
const nameRef = ref('John');
const ageRef = ref(30);
```

**reactive**: Phân rã mất tính phản ứng

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state; // Mất tính phản ứng

// Cần sử dụng toRefs để giữ tính phản ứng
import { toRefs } from 'vue';
const { count, message } = toRefs(state); // Giữ tính phản ứng
```

## 3. When to Use ref vs reactive?

> Khi nào dùng ref? Khi nào dùng reactive?

### Trường hợp dùng ref

1. **Giá trị kiểu nguyên thủy**

   ```typescript
   const count = ref(0);
   const message = ref('Hello');
   ```

2. **Đối tượng cần gán lại**

   ```typescript
   const user = ref({ name: 'John' });
   user.value = { name: 'Jane' }; // Có thể gán lại
   ```

3. **Template Refs**

   ```vue
   <template>
     <div ref="container"></div>
   </template>
   <script setup>
   const container = ref(null);
   </script>
   ```

4. **Trường hợp cần phân rã**
   ```typescript
   const state = ref({ count: 0, message: 'Hello' });
   // Phân rã giá trị nguyên thủy không vấn đề
   ```

### Trường hợp dùng reactive

1. **Trạng thái đối tượng phức tạp**

   ```typescript
   const formState = reactive({
     username: '',
     password: '',
     errors: {},
   });
   ```

2. **Trạng thái không cần gán lại**

   ```typescript
   const config = reactive({
     apiUrl: 'https://api.example.com',
     timeout: 5000,
   });
   ```

3. **Nhiều thuộc tính liên quan được nhóm lại**
   ```typescript
   const userState = reactive({
     user: null,
     loading: false,
     error: null,
   });
   ```

## 4. Common Interview Questions

> Câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Khác biệt cơ bản

Giải thích sự khác biệt và kết quả đầu ra của đoạn mã sau.

```typescript
// Trường hợp 1: Dùng ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // ?

// Trường hợp 2: Dùng reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // ?

// Trường hợp 3: Gán lại reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 };
console.log(state2.count); // ?
```

<details>
<summary>Nhấp để xem đáp án</summary>

```typescript
// Trường hợp 1: Dùng ref
const count1 = ref(0);
count1.value = 10;
console.log(count1.value); // 10

// Trường hợp 2: Dùng reactive
const state = reactive({ count: 0 });
state.count = 10;
console.log(state.count); // 10

// Trường hợp 3: Gán lại reactive
let state2 = reactive({ count: 0 });
state2 = { count: 10 }; // Mất tính phản ứng
console.log(state2.count); // 10 (giá trị đúng, nhưng mất tính phản ứng)
// Các sửa đổi sau này cho state2.count sẽ không kích hoạt cập nhật giao diện
```

**Khác biệt chính**:

- `ref` cần `.value` để truy cập
- `reactive` truy cập trực tiếp thuộc tính
- `reactive` không thể gán lại, sẽ mất tính phản ứng

</details>

### Câu hỏi 2: Vấn đề phân rã

Giải thích vấn đề của đoạn mã sau và đề xuất giải pháp.

```typescript
// Trường hợp 1: Phân rã ref
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // ?

// Trường hợp 2: Phân rã reactive
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // ?
```

<details>
<summary>Nhấp để xem đáp án</summary>

**Trường hợp 1: Phân rã ref**

```typescript
const user = ref({ name: 'John', age: 30 });
const { name, age } = user.value;
name = 'Jane'; // Không cập nhật user.value.name

// Cách đúng: sửa giá trị của ref
user.value.name = 'Jane';
// Hoặc gán lại
user.value = { name: 'Jane', age: 30 };
```

**Trường hợp 2: Phân rã reactive**

```typescript
const state = reactive({ count: 0, message: 'Hello' });
const { count, message } = state;
count = 10; // Mất tính phản ứng, không kích hoạt cập nhật

// Cách đúng 1: sửa trực tiếp thuộc tính
state.count = 10;

// Cách đúng 2: dùng toRefs giữ tính phản ứng
import { toRefs } from 'vue';
const { count, message } = toRefs(state);
count.value = 10; // Bây giờ là ref, cần dùng .value
```

**Tổng kết**:

- Phân rã giá trị nguyên thủy sẽ mất tính phản ứng
- Phân rã `reactive` cần dùng `toRefs` để giữ tính phản ứng
- Phân rã thuộc tính đối tượng của `ref` cũng mất tính phản ứng, nên sửa `.value` trực tiếp

</details>

### Câu hỏi 3: Chọn ref hay reactive?

Cho biết các tình huống sau nên dùng `ref` hay `reactive`.

```typescript
// Tình huống 1: Bộ đếm
const count = ?;

// Tình huống 2: Trạng thái form
const form = ?;

// Tình huống 3: Dữ liệu người dùng (có thể cần gán lại)
const user = ?;

// Tình huống 4: Tham chiếu template
const inputRef = ?;
```

<details>
<summary>Nhấp để xem đáp án</summary>

```typescript
// Tình huống 1: Bộ đếm (kiểu nguyên thủy)
const count = ref(0); // ref

// Tình huống 2: Trạng thái form (đối tượng phức tạp, không cần gán lại)
const form = reactive({
  username: '',
  password: '',
  errors: {},
}); // reactive

// Tình huống 3: Dữ liệu người dùng (có thể cần gán lại)
const user = ref({ name: 'John', age: 30 }); // ref (có thể gán lại)

// Tình huống 4: Tham chiếu template
const inputRef = ref(null); // ref (tham chiếu template phải dùng ref)
```

**Nguyên tắc chọn**:

- Kiểu nguyên thủy -> `ref`
- Đối tượng cần gán lại -> `ref`
- Tham chiếu template -> `ref`
- Trạng thái đối tượng phức tạp, không cần gán lại -> `reactive`

</details>

## 5. Best Practices

> Thực hành tốt nhất

### Phương pháp được khuyến nghị

```typescript
// 1. Kiểu nguyên thủy dùng ref
const count = ref(0);
const message = ref('Hello');

// 2. Trạng thái phức tạp dùng reactive
const formState = reactive({
  username: '',
  password: '',
  errors: {},
});

// 3. Cần gán lại dùng ref
const user = ref({ name: 'John' });
user.value = { name: 'Jane' };

// 4. Phân rã reactive dùng toRefs
import { toRefs } from 'vue';
const { count, message } = toRefs(state);

// 5. Thống nhất phong cách: nhóm có thể chọn dùng chủ yếu ref hoặc reactive
```

### Phương pháp cần tránh

```typescript
// 1. Không dùng reactive cho kiểu nguyên thủy
const count = reactive(0); // Lỗi

// 2. Không gán lại reactive
let state = reactive({ count: 0 });
state = { count: 10 }; // Mất tính phản ứng

// 3. Không phân rã trực tiếp reactive
const { count } = reactive({ count: 0 }); // Mất tính phản ứng

// 4. Không quên .value trong template (trường hợp ref)
// Trong template không cần .value, nhưng trong JavaScript cần
```

## 6. Interview Summary

> Tổng kết phỏng vấn

### Ghi nhớ nhanh

**ref**:

- Áp dụng cho mọi kiểu
- Cần `.value` để truy cập
- Có thể gán lại
- Tự động unwrap trong template

**reactive**:

- Chỉ dùng cho đối tượng
- Truy cập trực tiếp thuộc tính
- Không thể gán lại
- Phân rã cần dùng `toRefs`

**Nguyên tắc chọn**:

- Kiểu nguyên thủy -> `ref`
- Cần gán lại -> `ref`
- Trạng thái đối tượng phức tạp -> `reactive`

### Ví dụ trả lời phỏng vấn

**Q: Sự khác biệt giữa ref và reactive là gì?**

> "ref và reactive đều là API của Vue 3 để tạo dữ liệu phản ứng. Sự khác biệt chính bao gồm: 1) Kiểu áp dụng: ref có thể dùng cho mọi kiểu, reactive chỉ dùng cho đối tượng; 2) Cách truy cập: ref cần .value, reactive truy cập trực tiếp thuộc tính; 3) Gán lại: ref có thể gán lại, reactive không thể gán lại nếu không sẽ mất tính phản ứng; 4) Phân rã: phân rã reactive cần dùng toRefs để giữ tính phản ứng. Thông thường, kiểu nguyên thủy và đối tượng cần gán lại dùng ref, trạng thái đối tượng phức tạp dùng reactive."

**Q: Khi nào nên dùng ref? Khi nào dùng reactive?**

> "Dùng ref khi: 1) giá trị kiểu nguyên thủy; 2) đối tượng cần gán lại; 3) tham chiếu template. Dùng reactive khi: 1) trạng thái đối tượng phức tạp, nhiều thuộc tính liên quan nhóm lại; 2) trạng thái không cần gán lại. Trong thực tế, nhiều nhóm thống nhất dùng ref vì nó linh hoạt hơn và phạm vi áp dụng rộng hơn."

## Reference

- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 ref()](https://vuejs.org/api/reactivity-core.html#ref)
- [Vue 3 reactive()](https://vuejs.org/api/reactivity-core.html#reactive)
