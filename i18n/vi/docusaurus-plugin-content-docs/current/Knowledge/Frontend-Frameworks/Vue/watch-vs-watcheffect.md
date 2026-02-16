---
id: watch-vs-watcheffect
title: '[Medium] watch vs watchEffect'
slug: /watch-vs-watcheffect
tags: [Vue, Quiz, Medium]
---

## 1. What are watch and watchEffect?

> watch và watchEffect là gì?

`watch` và `watchEffect` là hai API trong Vue 3 Composition API dùng để theo dõi thay đổi dữ liệu reactive.

### watch

**Định nghĩa**: chỉ định rõ ràng nguồn dữ liệu cần theo dõi, thực thi hàm callback khi dữ liệu thay đổi.

```vue
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Theo dõi một nguồn dữ liệu
watch(count, (newValue, oldValue) => {
  console.log(`count thay đổi từ ${oldValue} thành ${newValue}`);
});

// Theo dõi nhiều nguồn dữ liệu
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('count hoặc message đã thay đổi');
});
</script>
```

### watchEffect

**Định nghĩa**: tự động theo dõi dữ liệu reactive được sử dụng trong hàm callback, tự động thực thi khi các dữ liệu đó thay đổi.

```vue
<script setup>
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// Tự động theo dõi count và message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
  // Tự động thực thi khi count hoặc message thay đổi
});
</script>
```

## 2. watch vs watchEffect: Key Differences

> Sự khác biệt chính giữa watch và watchEffect

### 1. Chỉ định nguồn dữ liệu

**watch**: chỉ định rõ ràng dữ liệu cần theo dõi

```typescript
const count = ref(0);
const message = ref('Hello');

// Chỉ định rõ ràng theo dõi count
watch(count, (newVal, oldVal) => {
  console.log('count đã thay đổi');
});

// Chỉ định rõ ràng theo dõi nhiều dữ liệu
watch([count, message], ([newCount, newMessage]) => {
  console.log('count hoặc message đã thay đổi');
});
```

**watchEffect**: tự động theo dõi dữ liệu được sử dụng

```typescript
const count = ref(0);
const message = ref('Hello');

// Tự động theo dõi count và message (vì được sử dụng trong callback)
watchEffect(() => {
  console.log(count.value); // Tự động theo dõi count
  console.log(message.value); // Tự động theo dõi message
});
```

### 2. Thời điểm thực thi

**watch**: thực thi lười (lazy) theo mặc định, chỉ thực thi khi dữ liệu thay đổi

```typescript
const count = ref(0);

watch(count, (newVal) => {
  console.log('Thực thi'); // Chỉ thực thi khi count thay đổi
});

count.value = 1; // Kích hoạt thực thi
```

**watchEffect**: thực thi ngay lập tức, sau đó theo dõi thay đổi

```typescript
const count = ref(0);

watchEffect(() => {
  console.log('Thực thi'); // Thực thi ngay lập tức một lần
  console.log(count.value);
});

count.value = 1; // Thực thi lần nữa
```

### 3. Truy cập giá trị cũ

**watch**: có thể truy cập giá trị cũ

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Từ ${oldVal} thành ${newVal}`);
});
```

**watchEffect**: không thể truy cập giá trị cũ

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // Chỉ truy cập được giá trị hiện tại
  // Không thể lấy giá trị cũ
});
```

### 4. Dừng theo dõi

**watch**: trả về hàm dừng

```typescript
const count = ref(0);

const stopWatch = watch(count, (newVal) => {
  console.log(newVal);
});

// Dừng theo dõi
stopWatch();
```

**watchEffect**: trả về hàm dừng

```typescript
const count = ref(0);

const stopEffect = watchEffect(() => {
  console.log(count.value);
});

// Dừng theo dõi
stopEffect();
```

## 3. When to Use watch vs watchEffect?

> Khi nào dùng watch? Khi nào dùng watchEffect?

### Trường hợp dùng watch

1. **Cần chỉ định rõ ràng dữ liệu theo dõi**
   ```typescript
   watch(userId, (newId) => {
     fetchUser(newId);
   });
   ```

2. **Cần truy cập giá trị cũ**
   ```typescript
   watch(count, (newVal, oldVal) => {
     console.log(`Từ ${oldVal} thành ${newVal}`);
   });
   ```

3. **Cần thực thi lười (chỉ khi thay đổi)**
   ```typescript
   watch(searchQuery, (newQuery) => {
     if (newQuery.length > 2) {
       search(newQuery);
     }
   });
   ```

4. **Cần kiểm soát chi tiết hơn**
   ```typescript
   watch(
     () => user.value.id,
     (newId) => {
       fetchUser(newId);
     },
     { immediate: true, deep: true }
   );
   ```

### Trường hợp dùng watchEffect

1. **Tự động theo dõi nhiều dữ liệu liên quan**
   ```typescript
   watchEffect(() => {
     // Tự động theo dõi tất cả dữ liệu reactive được sử dụng
     if (user.value && permissions.value.includes('admin')) {
       loadAdminData();
     }
   });
   ```

2. **Không cần giá trị cũ**
   ```typescript
   watchEffect(() => {
     console.log(`Bộ đếm hiện tại: ${count.value}`);
   });
   ```

3. **Cần thực thi ngay lập tức**
   ```typescript
   watchEffect(() => {
     // Thực thi ngay, sau đó theo dõi thay đổi
     updateChart(count.value, message.value);
   });
   ```

## 4. Common Interview Questions

> Câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Khác biệt cơ bản

Giải thích thứ tự thực thi và kết quả đầu ra của đoạn code sau.

```typescript
const count = ref(0);
const message = ref('Hello');

// watch
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
});

count.value = 1;
message.value = 'World';
```

<details>
<summary>Nhấp để xem đáp án</summary>

```typescript
const count = ref(0);
const message = ref('Hello');

// watch: thực thi lười, không thực thi ngay
watch(count, (newVal) => {
  console.log('watch:', newVal);
});

// watchEffect: thực thi ngay lập tức
watchEffect(() => {
  console.log('watchEffect:', count.value, message.value);
  // In ngay: watchEffect: 0 Hello
});

count.value = 1;
// Kích hoạt watch: watch: 1
// Kích hoạt watchEffect: watchEffect: 1 Hello

message.value = 'World';
// watch không theo dõi message, không thực thi
// watchEffect theo dõi message, thực thi: watchEffect: 1 World
```

**Thứ tự đầu ra**:
1. `watchEffect: 0 Hello` (thực thi ngay)
2. `watch: 1` (count thay đổi)
3. `watchEffect: 1 Hello` (count thay đổi)
4. `watchEffect: 1 World` (message thay đổi)

**Khác biệt chính**:
- `watch` thực thi lười, chỉ thực thi khi dữ liệu theo dõi thay đổi
- `watchEffect` thực thi ngay, sau đó theo dõi tất cả dữ liệu được sử dụng

</details>

### Câu hỏi 2: Truy cập giá trị cũ

Giải thích cách lấy giá trị cũ khi dùng `watchEffect`.

<details>
<summary>Nhấp để xem đáp án</summary>

**Vấn đề**: `watchEffect` không thể truy cập trực tiếp giá trị cũ

```typescript
const count = ref(0);

watchEffect(() => {
  console.log(count.value); // Chỉ truy cập được giá trị hiện tại
  // Không thể lấy giá trị cũ
});
```

**Giải pháp 1: Dùng ref lưu giá trị cũ**

```typescript
const count = ref(0);
const prevCount = ref(0);

watchEffect(() => {
  console.log(`Từ ${prevCount.value} thành ${count.value}`);
  prevCount.value = count.value; // Cập nhật giá trị cũ
});
```

**Giải pháp 2: Dùng watch (nếu cần giá trị cũ)**

```typescript
const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Từ ${oldVal} thành ${newVal}`);
});
```

**Khuyến nghị**:
- Nếu cần giá trị cũ, ưu tiên dùng `watch`
- `watchEffect` phù hợp với tình huống không cần giá trị cũ

</details>

### Câu hỏi 3: Chọn watch hay watchEffect?

Cho biết các tình huống sau nên dùng `watch` hay `watchEffect`.

```typescript
// Tình huống 1: Theo dõi ID người dùng thay đổi, tải lại dữ liệu
const userId = ref(1);
// ?

// Tình huống 2: Tự động bật nút gửi khi form hợp lệ
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);
// ?

// Tình huống 3: Theo dõi từ khóa tìm kiếm, thực hiện tìm kiếm (cần debounce)
const searchQuery = ref('');
// ?
```

<details>
<summary>Nhấp để xem đáp án</summary>

**Tình huống 1: Theo dõi ID người dùng**

```typescript
const userId = ref(1);

// Dùng watch: chỉ định rõ ràng dữ liệu theo dõi
watch(userId, (newId) => {
  fetchUser(newId);
});
```

**Tình huống 2: Xác thực form**

```typescript
const form = reactive({ username: '', password: '' });
const isValid = computed(() => form.username && form.password);

// Dùng watchEffect: tự động theo dõi dữ liệu liên quan
watchEffect(() => {
  submitButton.disabled = !isValid.value;
});
```

**Tình huống 3: Tìm kiếm (cần debounce)**

```typescript
const searchQuery = ref('');

// Dùng watch: cần kiểm soát chi tiết hơn (debounce)
let timeoutId;
watch(searchQuery, (newQuery) => {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    search(newQuery);
  }, 300);
});
```

**Nguyên tắc chọn**:
- Chỉ định rõ ràng dữ liệu theo dõi -> `watch`
- Tự động theo dõi nhiều dữ liệu liên quan -> `watchEffect`
- Cần giá trị cũ hoặc kiểm soát chi tiết -> `watch`
- Cần thực thi ngay lập tức -> `watchEffect`

</details>

## 5. Best Practices

> Thực hành tốt nhất

### Cách làm khuyến nghị

```typescript
// 1. Dùng watch khi chỉ định rõ ràng dữ liệu theo dõi
watch(userId, (newId) => {
  fetchUser(newId);
});

// 2. Dùng watchEffect khi tự động theo dõi nhiều dữ liệu liên quan
watchEffect(() => {
  if (user.value && permissions.value.includes('admin')) {
    loadAdminData();
  }
});

// 3. Dùng watch khi cần giá trị cũ
watch(count, (newVal, oldVal) => {
  console.log(`Từ ${oldVal} thành ${newVal}`);
});

// 4. Nhớ dọn dẹp watcher
onUnmounted(() => {
  stopWatch();
  stopEffect();
});
```

### Cách làm cần tránh

```typescript
// 1. Không thực hiện thao tác bất đồng bộ trong watchEffect mà không xử lý dọn dẹp
watchEffect(async () => {
  const data = await fetchData(); // Có thể gây rò rỉ bộ nhớ
  // ...
});

// 2. Không lạm dụng watchEffect
// Nếu chỉ cần theo dõi dữ liệu cụ thể, watch rõ ràng hơn
watchEffect(() => {
  console.log(count.value); // Nếu chỉ cần theo dõi count, watch phù hợp hơn
});

// 3. Không sửa đổi dữ liệu theo dõi trong watchEffect (có thể gây vòng lặp vô hạn)
watchEffect(() => {
  count.value++; // Có thể gây vòng lặp vô hạn
});
```

## 6. Interview Summary

> Tổng kết phỏng vấn

### Ghi nhớ nhanh

**watch**:
- Chỉ định rõ ràng dữ liệu theo dõi
- Thực thi lười (mặc định)
- Có thể truy cập giá trị cũ
- Phù hợp tình huống cần kiểm soát chi tiết

**watchEffect**:
- Tự động theo dõi dữ liệu được sử dụng
- Thực thi ngay lập tức
- Không thể truy cập giá trị cũ
- Phù hợp tự động theo dõi nhiều dữ liệu liên quan

**Nguyên tắc chọn**:
- Chỉ định rõ ràng theo dõi -> `watch`
- Tự động theo dõi -> `watchEffect`
- Cần giá trị cũ -> `watch`
- Cần thực thi ngay -> `watchEffect`

### Ví dụ trả lời phỏng vấn

**Q: Sự khác biệt giữa watch và watchEffect là gì?**

> "watch và watchEffect đều là API của Vue 3 dùng để theo dõi thay đổi dữ liệu reactive. Các khác biệt chính bao gồm: 1) Nguồn dữ liệu: watch cần chỉ định rõ ràng dữ liệu theo dõi, watchEffect tự động theo dõi dữ liệu reactive được sử dụng trong callback; 2) Thời điểm thực thi: watch thực thi lười theo mặc định, chỉ thực thi khi dữ liệu thay đổi, watchEffect thực thi ngay rồi theo dõi thay đổi; 3) Truy cập giá trị cũ: watch có thể truy cập giá trị cũ, watchEffect thì không; 4) Trường hợp sử dụng: watch phù hợp khi cần chỉ định dữ liệu theo dõi hoặc cần giá trị cũ, watchEffect phù hợp khi tự động theo dõi nhiều dữ liệu liên quan."

**Q: Khi nào nên dùng watch? Khi nào dùng watchEffect?**

> "Dùng watch khi: 1) cần chỉ định rõ ràng dữ liệu theo dõi; 2) cần truy cập giá trị cũ; 3) cần thực thi lười, chỉ khi thay đổi; 4) cần kiểm soát chi tiết hơn (tùy chọn immediate, deep). Dùng watchEffect khi: 1) tự động theo dõi nhiều dữ liệu liên quan; 2) không cần giá trị cũ; 3) cần thực thi ngay lập tức. Nói chung, nếu chỉ cần theo dõi dữ liệu cụ thể, watch rõ ràng hơn; nếu cần tự động theo dõi nhiều dữ liệu liên quan, watchEffect tiện hơn."

## Reference

- [Vue 3 watch()](https://vuejs.org/api/reactivity-core.html#watch)
- [Vue 3 watchEffect()](https://vuejs.org/api/reactivity-core.html#watcheffect)
- [Vue 3 Watchers Guide](https://vuejs.org/guide/essentials/watchers.html)
