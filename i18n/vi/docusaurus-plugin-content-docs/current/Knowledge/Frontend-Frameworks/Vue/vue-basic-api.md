---
id: vue-basic-api
title: '[Medium] Nguyên lý cơ bản và API của Vue'
slug: /vue-basic-api
tags: [Vue, Quiz, Medium]
---

## 1. Can you describe the core principles and advantages of the framework Vue?

> Mô tả các nguyên lý cốt lõi và ưu điểm của framework Vue.

### Nguyên lý cốt lõi

Vue là một framework JavaScript tiến bộ, các nguyên lý cốt lõi bao gồm các khái niệm quan trọng sau:

#### 1. Virtual DOM

Sử dụng Virtual DOM để nâng cao hiệu năng. Chỉ cập nhật các node DOM đã thay đổi, thay vì render lại toàn bộ cây DOM. Thuật toán diff so sánh sự khác biệt giữa Virtual DOM cũ và mới, chỉ thực hiện thao tác DOM thực trên phần khác biệt.

```js
// Minh họa khái niệm Virtual DOM
const vnode = {
  tag: 'div',
  props: { class: 'container' },
  children: [
    { tag: 'h1', children: 'Hello' },
    { tag: 'p', children: 'World' },
  ],
};
```

#### 2. Ràng buộc dữ liệu hai chiều (Two-way Data Binding)

Sử dụng ràng buộc dữ liệu hai chiều: khi Model thay đổi, View tự động cập nhật và ngược lại. Điều này giúp lập trình viên không cần thao tác DOM thủ công, chỉ cần quan tâm đến sự thay đổi dữ liệu.

```vue
<!-- Vue 3 cách viết khuyến nghị: <script setup> -->
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue');
</script>
```

<details>
<summary>Cách viết Options API</summary>

```vue
<template>
  <input v-model="message" />
  <p>{{ message }}</p>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },
};
</script>
```

</details>

#### 3. Kiến trúc dựa trên component (Component-based)

Chia toàn bộ ứng dụng thành các component riêng lẻ, nâng cao khả năng tái sử dụng và giúp bảo trì, phát triển hiệu quả hơn. Mỗi component có trạng thái, style và logic riêng, có thể phát triển và kiểm thử độc lập.

```vue
<!-- Button.vue - Vue 3 <script setup> -->
<template>
  <button @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>
```

#### 4. Lifecycle Hooks

Có vòng đời riêng. Khi dữ liệu thay đổi, các hook lifecycle tương ứng được kích hoạt, cho phép thực hiện các thao tác cụ thể ở từng giai đoạn của vòng đời.

```vue
<!-- Vue 3 cách viết <script setup> -->
<script setup>
import { onMounted, onUpdated, onUnmounted } from 'vue';

onMounted(() => {
  // Thực thi sau khi component được mount
  console.log('Component mounted!');
});

onUpdated(() => {
  // Thực thi sau khi dữ liệu cập nhật
  console.log('Component updated!');
});

onUnmounted(() => {
  // Thực thi sau khi component bị gỡ bỏ
  console.log('Component unmounted!');
});
</script>
```

#### 5. Hệ thống directive (Directives)

Cung cấp các directive thường dùng như `v-if`, `v-for`, `v-bind`, `v-model`, v.v., giúp lập trình viên phát triển nhanh hơn.

```vue
<template>
  <!-- Render có điều kiện -->
  <div v-if="isVisible">Nội dung hiển thị</div>

  <!-- Render danh sách -->
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>

  <!-- Ràng buộc thuộc tính -->
  <img :src="imageUrl" :alt="imageAlt" />

  <!-- Ràng buộc hai chiều -->
  <input v-model="username" />
</template>
```

#### 6. Cú pháp template (Template Syntax)

Sử dụng template để viết HTML, cho phép render dữ liệu trực tiếp vào template thông qua nội suy.

```vue
<template>
  <div>
    <!-- Nội suy văn bản -->
    <p>{{ message }}</p>

    <!-- Biểu thức -->
    <p>{{ count + 1 }}</p>

    <!-- Gọi phương thức -->
    <p>{{ formatDate(date) }}</p>
  </div>
</template>
```

### Ưu điểm riêng biệt của Vue (so với React)

#### 1. Đường cong học tập thấp hơn

Chênh lệch trình độ giữa các thành viên trong nhóm không quá lớn, đồng thời phong cách viết code được quy định thống nhất bởi tổ chức chính thức, tránh sự tự do quá mức. Điều này cũng giúp tiếp cận nhanh hơn khi bảo trì các dự án khác nhau.

```vue
<!-- Cấu trúc rõ ràng của Single File Component -->
<template>
  <!-- Template HTML -->
</template>

<script>
// Logic JavaScript
</script>

<style>
/* Style CSS */
</style>
```

#### 2. Cú pháp directive riêng biệt

Mặc dù điều này có thể tùy quan điểm, hệ thống directive của Vue cung cấp cách trực quan hơn để xử lý logic UI thông dụng:

```vue
<!-- Directive Vue -->
<div v-if="isLoggedIn">Chào mừng trở lại</div>
<button @click="handleClick">Nhấp</button>

<!-- React JSX -->
<div>{isLoggedIn && 'Chào mừng trở lại'}</div>
<button onClick="{handleClick}">Nhấp</button>
```

#### 3. Ràng buộc dữ liệu hai chiều dễ thực hiện hơn

Nhờ có directive riêng, lập trình viên có thể thực hiện ràng buộc dữ liệu hai chiều rất dễ dàng (`v-model`). Mặc dù React cũng có thể triển khai tính năng tương tự, nhưng không trực quan bằng Vue.

```vue
<!-- Ràng buộc hai chiều Vue -->
<input v-model="username" />

<!-- React cần xử lý thủ công -->
<input value={username} onChange={(e) => setUsername(e.target.value)} />
```

#### 4. Tách biệt template và logic

JSX của React vẫn bị một số lập trình viên chỉ trích. Trong một số tình huống phát triển, tách biệt logic và UI giúp code dễ đọc và bảo trì hơn.

```vue
<!-- Vue: cấu trúc rõ ràng -->
<template>
  <div class="user-card">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: 'John',
        email: 'john@example.com',
      },
    };
  },
};
</script>
```

#### 5. Hệ sinh thái chính thức hoàn chỉnh

Vue cung cấp bộ giải pháp hoàn chỉnh từ tổ chức chính thức (Vue Router, Vuex/Pinia, Vue CLI), không cần phải chọn lựa giữa nhiều package bên thứ ba.

## 2. Please explain the usage of `v-model`, `v-bind` and `v-html`

> Giải thích cách sử dụng `v-model`, `v-bind` và `v-html`.

### `v-model`: Ràng buộc dữ liệu hai chiều

Khi thay đổi dữ liệu, nội dung hiển thị trên template được cập nhật ngay lập tức. Ngược lại, thay đổi nội dung trên template cũng cập nhật dữ liệu.

```vue
<template>
  <div>
    <!-- Ô nhập văn bản -->
    <input v-model="message" />
    <p>Nội dung nhập: {{ message }}</p>

    <!-- Hộp kiểm -->
    <input type="checkbox" v-model="checked" />
    <p>Đã chọn: {{ checked }}</p>

    <!-- Danh sách chọn -->
    <select v-model="selected">
      <option value="A">Tùy chọn A</option>
      <option value="B">Tùy chọn B</option>
    </select>
    <p>Tùy chọn đã chọn: {{ selected }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
      checked: false,
      selected: 'A',
    };
  },
};
</script>
```

#### Modifier của `v-model`

```vue
<!-- .lazy: cập nhật sau sự kiện change -->
<input v-model.lazy="msg" />

<!-- .number: tự động chuyển đổi thành số -->
<input v-model.number="age" type="number" />

<!-- .trim: tự động loại bỏ khoảng trắng đầu cuối -->
<input v-model.trim="msg" />
```

### `v-bind`: Ràng buộc thuộc tính động

Thường dùng để ràng buộc class, link, hình ảnh, v.v. Khi ràng buộc class qua `v-bind`, có thể quyết định class có được áp dụng hay không thông qua thay đổi dữ liệu. Tương tự, đường dẫn hình ảnh, URL trả về từ API cũng có thể được cập nhật động qua ràng buộc.

```vue
<template>
  <div>
    <!-- Ràng buộc class (viết tắt :class) -->
    <div :class="{ active: isActive, 'text-danger': hasError }">Class động</div>

    <!-- Ràng buộc style -->
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }">Style động</div>

    <!-- Ràng buộc đường dẫn hình ảnh -->
    <img :src="imageUrl" :alt="imageAlt" />

    <!-- Ràng buộc liên kết -->
    <a :href="linkUrl">Đi đến liên kết</a>

    <!-- Ràng buộc thuộc tính tùy chỉnh -->
    <div :data-id="userId" :data-name="userName"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActive: true,
      hasError: false,
      textColor: 'red',
      fontSize: 16,
      imageUrl: 'https://example.com/image.jpg',
      imageAlt: 'Mô tả hình ảnh',
      linkUrl: 'https://example.com',
      userId: 123,
      userName: 'John',
    };
  },
};
</script>
```

#### Viết tắt của `v-bind`

```vue
<!-- Viết đầy đủ -->
<img v-bind:src="imageUrl" />

<!-- Viết tắt -->
<img :src="imageUrl" />

<!-- Ràng buộc nhiều thuộc tính -->
<div v-bind="objectOfAttrs"></div>
```

### `v-html`: Render chuỗi HTML

Khi dữ liệu trả về chứa thẻ HTML, có thể dùng directive này để render, ví dụ hiển thị cú pháp Markdown hoặc đường dẫn hình ảnh chứa thẻ `<img>`.

```vue
<template>
  <div>
    <!-- Nội suy thông thường: hiển thị thẻ HTML dạng văn bản -->
    <p>{{ rawHtml }}</p>
    <!-- Đầu ra: <span style="color: red">Văn bản đỏ</span> -->

    <!-- v-html: render HTML -->
    <p v-html="rawHtml"></p>
    <!-- Đầu ra: Văn bản đỏ (thực sự render màu đỏ) -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      rawHtml: '<span style="color: red">Văn bản đỏ</span>',
    };
  },
};
</script>
```

#### Cảnh báo bảo mật

**Tuyệt đối không sử dụng `v-html` với nội dung do người dùng cung cấp**, điều này sẽ gây ra lỗ hổng XSS (Cross-Site Scripting)!

```vue
<!-- Nguy hiểm: người dùng có thể tiêm script độc hại -->
<div v-html="userProvidedContent"></div>

<!-- An toàn: chỉ dùng cho nội dung đáng tin cậy -->
<div v-html="markdownRenderedContent"></div>
```

#### Giải pháp thay thế an toàn

```vue
<template>
  <div>
    <!-- Sử dụng package để làm sạch HTML -->
    <div v-html="sanitizedHtml"></div>
  </div>
</template>

<script>
import DOMPurify from 'dompurify';

export default {
  data() {
    return {
      userInput: '<img src=x onerror=alert("XSS")>',
    };
  },
  computed: {
    sanitizedHtml() {
      // Sử dụng DOMPurify để làm sạch HTML
      return DOMPurify.sanitize(this.userInput);
    },
  },
};
</script>
```

### Bảng tổng kết so sánh ba directive

| Directive | Mục đích                           | Viết tắt | Ví dụ                         |
| --------- | ---------------------------------- | -------- | ----------------------------- |
| `v-model` | Ràng buộc hai chiều phần tử form   | Không    | `<input v-model="msg">`       |
| `v-bind`  | Ràng buộc một chiều thuộc tính     | `:`      | `<img :src="url">`            |
| `v-html`  | Render chuỗi HTML                  | Không    | `<div v-html="html"></div>`   |

## 3. How to access HTML elements (Template Refs)?

> Trong Vue, nếu muốn thao tác phần tử HTML, ví dụ lấy phần tử input và focus vào nó thì làm thế nào?

Trong Vue, không nên sử dụng `document.querySelector` để lấy phần tử DOM, mà nên dùng **Template Refs**.

### Options API (Vue 2 / Vue 3)

Sử dụng thuộc tính `ref` để đánh dấu phần tử trong template, sau đó truy cập qua `this.$refs`.

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script>
export default {
  methods: {
    focusInput() {
      // Truy cập phần tử DOM
      this.$refs.inputElement.focus();
    },
  },
  mounted() {
    // Đảm bảo component đã mount trước khi truy cập
    console.log(this.$refs.inputElement);
  },
};
</script>
```

### Composition API (Vue 3)

Trong `<script setup>`, khai báo một biến `ref` cùng tên để lấy phần tử.

```vue
<template>
  <div>
    <input ref="inputElement" />
    <button @click="focusInput">Focus Input</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. Khai báo biến cùng tên với template ref, giá trị khởi tạo là null
const inputElement = ref(null);

const focusInput = () => {
  // 2. Truy cập DOM qua .value
  inputElement.value?.focus();
};

onMounted(() => {
  // 3. Đảm bảo component đã mount trước khi truy cập
  console.log(inputElement.value);
});
</script>
```

**Lưu ý**:

- Tên biến phải khớp chính xác với giá trị thuộc tính `ref` trong template.
- Phần tử DOM chỉ truy cập được sau khi component đã mount (`onMounted`), nếu không sẽ là `null`.
- Nếu dùng trong vòng lặp `v-for`, ref sẽ là một mảng.

## 4. Please explain the difference between `v-show` and `v-if`

> Giải thích sự khác biệt giữa `v-show` và `v-if`.

### Điểm giống nhau

Cả hai đều dùng để điều khiển hiển thị và ẩn phần tử DOM, quyết định nội dung có được hiển thị hay không dựa trên điều kiện.

```vue
<template>
  <!-- Khi isVisible là true, cả hai đều hiển thị nội dung -->
  <div v-if="isVisible">Dùng v-if</div>
  <div v-show="isVisible">Dùng v-show</div>
</template>
```

### Điểm khác nhau

#### 1. Cách thao tác DOM khác nhau

```vue
<template>
  <div>
    <!-- v-show: điều khiển qua thuộc tính CSS display -->
    <div v-show="false">Phần tử này vẫn tồn tại trong DOM, chỉ display: none</div>

    <!-- v-if: xóa hoặc thêm trực tiếp trong DOM -->
    <div v-if="false">Phần tử này không xuất hiện trong DOM</div>
  </div>
</template>
```

Kết quả render thực tế:

```html
<!-- Kết quả v-show -->
<div style="display: none;">Phần tử này vẫn tồn tại trong DOM, chỉ display: none</div>

<!-- Kết quả v-if: khi false hoàn toàn không tồn tại -->
<!-- Không có node DOM nào -->
```

#### 2. Sự khác biệt về hiệu năng

**`v-show`**:

- Chi phí render ban đầu cao hơn (phần tử luôn được tạo)
- Chi phí chuyển đổi thấp (chỉ thay đổi CSS)
- Phù hợp với tình huống **chuyển đổi thường xuyên**

**`v-if`**:

- Chi phí render ban đầu thấp hơn (không render khi điều kiện false)
- Chi phí chuyển đổi cao hơn (cần hủy/tạo lại phần tử)
- Phù hợp với tình huống **điều kiện ít thay đổi**

```vue
<template>
  <div>
    <!-- Chuyển đổi thường xuyên: dùng v-show -->
    <button @click="toggleModal">Bật/tắt popup</button>
    <div v-show="showModal" class="modal">
      Nội dung popup (mở đóng thường xuyên, v-show hiệu năng tốt hơn)
    </div>

    <!-- Ít chuyển đổi: dùng v-if -->
    <div v-if="userRole === 'admin'" class="admin-panel">
      Bảng quản trị (hầu như không thay đổi sau khi đăng nhập, dùng v-if)
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showModal: false,
      userRole: 'user',
    };
  },
  methods: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
  },
};
</script>
```

#### 3. Kích hoạt lifecycle

**`v-if`**:

- Kích hoạt **toàn bộ lifecycle** của component
- Khi điều kiện false, hook `unmounted` được thực thi
- Khi điều kiện true, hook `mounted` được thực thi

```vue
<template>
  <child-component v-if="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('Component đã mount'); // Thực thi khi v-if chuyển từ false sang true
  },
  unmounted() {
    console.log('Component đã unmount'); // Thực thi khi v-if chuyển từ true sang false
  },
};
</script>
```

**`v-show`**:

- **Không kích hoạt** lifecycle của component
- Component luôn giữ trạng thái mounted
- Chỉ ẩn qua CSS

```vue
<template>
  <child-component v-show="showChild" />
</template>

<script>
// ChildComponent.vue
export default {
  mounted() {
    console.log('Component đã mount'); // Chỉ thực thi một lần khi render lần đầu
  },
  unmounted() {
    console.log('Component đã unmount'); // Không thực thi (trừ khi component cha bị hủy)
  },
};
</script>
```

#### 4. Chi phí render ban đầu

```vue
<template>
  <div>
    <!-- v-if: ban đầu false thì hoàn toàn không render -->
    <heavy-component v-if="false" />

    <!-- v-show: ban đầu false vẫn render nhưng ẩn -->
    <heavy-component v-show="false" />
  </div>
</template>
```

Nếu `heavy-component` là component nặng:

- `v-if="false"`: tải ban đầu nhanh hơn (không render)
- `v-show="false"`: tải ban đầu chậm hơn (render nhưng ẩn)

#### 5. Kết hợp với directive khác

`v-if` có thể kết hợp với `v-else-if` và `v-else`:

```vue
<template>
  <div>
    <div v-if="type === 'A'">Loại A</div>
    <div v-else-if="type === 'B'">Loại B</div>
    <div v-else>Loại khác</div>
  </div>
</template>
```

`v-show` không thể kết hợp với `v-else`:

```vue
<!-- Sai: v-show không thể dùng v-else -->
<div v-show="type === 'A'">Loại A</div>
<div v-else>Loại khác</div>

<!-- Đúng: cần đặt điều kiện riêng biệt -->
<div v-show="type === 'A'">Loại A</div>
<div v-show="type !== 'A'">Loại khác</div>
```

### Khuyến nghị sử dụng computed và watch

#### Tình huống dùng `v-if`

1. Điều kiện ít thay đổi
2. Điều kiện ban đầu false và có thể không bao giờ thành true
3. Cần kết hợp với `v-else-if` hoặc `v-else`
4. Component có tài nguyên cần dọn dẹp (như timer, event listener)

```vue
<template>
  <!-- Kiểm soát quyền: hầu như không thay đổi sau khi đăng nhập -->
  <admin-panel v-if="isAdmin" />

  <!-- Liên quan đến routing: chỉ thay đổi khi chuyển trang -->
  <home-page v-if="currentRoute === 'home'" />
  <about-page v-else-if="currentRoute === 'about'" />
</template>
```

#### Tình huống dùng `v-show`

1. Cần chuyển đổi trạng thái hiển thị thường xuyên
2. Chi phí khởi tạo component cao, muốn giữ trạng thái
3. Không cần kích hoạt lifecycle hook

```vue
<template>
  <!-- Chuyển tab: người dùng thường xuyên chuyển đổi -->
  <div v-show="activeTab === 'profile'">Hồ sơ cá nhân</div>
  <div v-show="activeTab === 'settings'">Cài đặt</div>

  <!-- Popup: mở đóng thường xuyên -->
  <modal v-show="isModalVisible" />

  <!-- Animation loading: hiển thị/ẩn thường xuyên -->
  <loading-spinner v-show="isLoading" />
</template>
```

### Bảng tổng kết so sánh hiệu năng

| Đặc điểm              | v-if                                    | v-show                          |
| ---------------------- | --------------------------------------- | ------------------------------- |
| Chi phí render ban đầu | Thấp (không render khi điều kiện false) | Cao (luôn render)               |
| Chi phí chuyển đổi     | Cao (hủy/tạo lại phần tử)              | Thấp (chỉ thay đổi CSS)        |
| Tình huống phù hợp     | Điều kiện ít thay đổi                  | Chuyển đổi thường xuyên         |
| Lifecycle              | Kích hoạt                               | Không kích hoạt                 |
| Kết hợp                | v-else-if, v-else                       | Không                           |

### Ví dụ so sánh thực tế

```vue
<template>
  <div>
    <!-- Ví dụ 1: Bảng quản trị (dùng v-if) -->
    <!-- Lý do: hầu như không thay đổi sau khi đăng nhập, có kiểm soát quyền -->
    <div v-if="userRole === 'admin'">
      <h2>Bảng quản trị</h2>
      <button @click="deleteUser">Xóa người dùng</button>
    </div>

    <!-- Ví dụ 2: Popup (dùng v-show) -->
    <!-- Lý do: người dùng mở đóng thường xuyên -->
    <div v-show="isModalOpen" class="modal">
      <h2>Tiêu đề popup</h2>
      <p>Nội dung popup</p>
      <button @click="isModalOpen = false">Đóng</button>
    </div>

    <!-- Ví dụ 3: Animation loading (dùng v-show) -->
    <!-- Lý do: hiển thị/ẩn thường xuyên khi gọi API -->
    <div v-show="isLoading" class="loading">
      <spinner />
    </div>

    <!-- Ví dụ 4: Thông báo lỗi (dùng v-if) -->
    <!-- Lý do: ít xuất hiện, và cần render lại khi xuất hiện -->
    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userRole: 'user',
      isModalOpen: false,
      isLoading: false,
      errorMessage: '',
    };
  },
};
</script>
```

### Ghi nhớ v-if và v-show

> - `v-if`: không hiển thị thì không render, phù hợp với điều kiện ít thay đổi
> - `v-show`: render sẵn từ đầu, luôn sẵn sàng hiển thị, phù hợp chuyển đổi thường xuyên

## 5. What's the difference between `computed` and `watch`?

> `computed` và `watch` khác nhau thế nào?

Đây là hai tính năng reactive rất quan trọng trong Vue. Mặc dù cả hai đều có thể theo dõi thay đổi dữ liệu, nhưng trường hợp sử dụng và đặc tính hoàn toàn khác nhau.

### `computed` (thuộc tính tính toán)

#### Đặc tính chính (computed)

1. **Cơ chế cache**: kết quả `computed` được cache, chỉ tính toán lại khi dữ liệu reactive phụ thuộc thay đổi
2. **Tự động theo dõi phụ thuộc**: tự động theo dõi dữ liệu reactive được sử dụng trong quá trình tính toán
3. **Tính toán đồng bộ**: phải là thao tác đồng bộ và phải có giá trị trả về
4. **Cú pháp ngắn gọn**: có thể sử dụng trực tiếp trong template, giống như thuộc tính trong data

#### Trường hợp sử dụng thường gặp (computed)

```vue
<!-- Vue 3 cách viết <script setup> -->
<template>
  <div>
    <!-- Ví dụ 1: Định dạng dữ liệu -->
    <p>Họ tên đầy đủ: {{ fullName }}</p>
    <p>Email: {{ emailLowerCase }}</p>

    <!-- Ví dụ 2: Tính tổng giỏ hàng -->
    <ul>
      <li v-for="item in cart" :key="item.id">
        {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
      </li>
    </ul>
    <p>Tổng cộng: ${{ cartTotal }}</p>

    <!-- Ví dụ 3: Lọc danh sách -->
    <input v-model="searchText" placeholder="Tìm kiếm..." />
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const email = ref('JOHN@EXAMPLE.COM');
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);
const searchText = ref('');
const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cherry' },
]);

// Ví dụ 1: Kết hợp dữ liệu
const fullName = computed(() => {
  console.log('Tính toán fullName'); // Chỉ thực thi khi phụ thuộc thay đổi
  return `${firstName.value} ${lastName.value}`;
});

// Ví dụ 2: Định dạng dữ liệu
const emailLowerCase = computed(() => {
  return email.value.toLowerCase();
});

// Ví dụ 3: Tính tổng
const cartTotal = computed(() => {
  console.log('Tính toán cartTotal'); // Chỉ thực thi khi cart thay đổi
  return cart.value.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
});

// Ví dụ 4: Lọc danh sách
const filteredItems = computed(() => {
  if (!searchText.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchText.value.toLowerCase())
  );
});
</script>
```

#### Ưu điểm của `computed`: cơ chế cache

```vue
<template>
  <div>
    <!-- Dùng computed nhiều lần, nhưng chỉ tính một lần -->
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>
    <p>{{ expensiveComputed }}</p>

    <!-- Dùng method, mỗi lần đều tính lại -->
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
    <p>{{ expensiveMethod() }}</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const items = ref(Array.from({ length: 1000 }, (_, index) => index));

const expensiveComputed = computed(() => {
  console.log('computed thực thi'); // Chỉ thực thi một lần
  return items.value.reduce((sum, item) => sum + item, 0);
});

const expensiveMethod = () => {
  console.log('method thực thi'); // Tính lại mỗi lần gọi
  return items.value.reduce((sum, item) => sum + item, 0);
};
</script>
```

#### getter và setter của `computed`

```vue
<script setup>
import { computed, onMounted, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

const fullName = computed({
  // getter: thực thi khi đọc
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  // setter: thực thi khi gán giá trị
  set(newValue) {
    const names = newValue.split(' ');
    firstName.value = names[0] ?? '';
    lastName.value = names[names.length - 1] ?? '';
  },
});

onMounted(() => {
  console.log(fullName.value); // 'John Doe' (kích hoạt getter)
  fullName.value = 'Jane Smith'; // Kích hoạt setter
  console.log(firstName.value); // 'Jane'
  console.log(lastName.value); // 'Smith'
});
</script>
```

### `watch` (theo dõi thuộc tính)

#### Đặc tính chính (watch)

1. **Theo dõi thủ công thay đổi dữ liệu**: cần chỉ định rõ ràng dữ liệu nào cần theo dõi
2. **Có thể thực hiện thao tác bất đồng bộ**: phù hợp gọi API, đặt timer, v.v.
3. **Không cần giá trị trả về**: chủ yếu dùng để thực hiện side effects
4. **Có thể theo dõi nhiều dữ liệu**: qua mảng hoặc theo dõi sâu đối tượng
5. **Cung cấp giá trị cũ và mới**: có thể lấy giá trị trước và sau khi thay đổi

#### Trường hợp sử dụng thường gặp (watch)

```vue
<!-- Vue 3 cách viết <script setup> -->
<template>
  <div>
    <!-- Ví dụ 1: Tìm kiếm thời gian thực -->
    <input v-model="searchQuery" placeholder="Tìm kiếm người dùng..." />
    <div v-if="isSearching">Đang tìm kiếm...</div>
    <ul>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.name }}
      </li>
    </ul>

    <!-- Ví dụ 2: Xác thực form -->
    <input v-model="username" placeholder="Tên người dùng" />
    <p v-if="usernameError" class="error">{{ usernameError }}</p>

    <!-- Ví dụ 3: Tự động lưu -->
    <textarea v-model="content" placeholder="Nhập nội dung..."></textarea>
    <p v-if="isSaving">Đang lưu...</p>
    <p v-if="lastSaved">Lần lưu cuối: {{ lastSaved }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const username = ref('');
const usernameError = ref('');
const content = ref('');
const isSaving = ref(false);
const lastSaved = ref(null);

let searchTimer = null;
let saveTimer = null;

// Ví dụ 1: Tìm kiếm thời gian thực (debounce)
watch(searchQuery, async (newQuery, oldQuery) => {
  console.log(`Tìm kiếm thay đổi từ "${oldQuery}" thành "${newQuery}"`);

  // Xóa timer trước đó
  clearTimeout(searchTimer);

  if (!newQuery) {
    searchResults.value = [];
    return;
  }

  isSearching.value = true;

  // Debounce: thực hiện tìm kiếm sau 500ms
  searchTimer = setTimeout(async () => {
    try {
      const response = await fetch(`/api/users?q=${newQuery}`);
      searchResults.value = await response.json();
    } catch (error) {
      console.error('Tìm kiếm thất bại', error);
    } finally {
      isSearching.value = false;
    }
  }, 500);
});

// Ví dụ 2: Xác thực form
watch(username, (newUsername) => {
  if (newUsername.length < 3) {
    usernameError.value = 'Tên người dùng phải có ít nhất 3 ký tự';
  } else if (newUsername.length > 20) {
    usernameError.value = 'Tên người dùng không được vượt quá 20 ký tự';
  } else if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
    usernameError.value = 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới';
  } else {
    usernameError.value = '';
  }
});

// Ví dụ 3: Tự động lưu
watch(content, (newContent) => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    isSaving.value = true;
    try {
      await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ content: newContent }),
      });
      lastSaved.value = new Date().toLocaleTimeString();
    } catch (error) {
      console.error('Lưu thất bại', error);
    } finally {
      isSaving.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  // Dọn dẹp timer
  clearTimeout(searchTimer);
  clearTimeout(saveTimer);
});
</script>
```

#### Tùy chọn của `watch`

```vue
<!-- Vue 3 cách viết <script setup> -->
<script setup>
import { ref, watch, onMounted } from 'vue';

const user = ref({
  name: 'John',
  profile: {
    age: 30,
    city: 'Taipei',
  },
});
const items = ref([1, 2, 3]);

// Tùy chọn 1: immediate (thực thi ngay lập tức)
watch(
  () => user.value.name,
  (newName, oldName) => {
    console.log(`Tên thay đổi từ ${oldName} thành ${newName}`);
  },
  { immediate: true } // Thực thi ngay khi component được tạo
);

// Tùy chọn 2: deep (theo dõi sâu)
watch(
  user,
  (newUser, oldUser) => {
    console.log('Đối tượng user thay đổi bên trong');
    console.log('Giá trị mới:', newUser);
  },
  { deep: true } // Theo dõi thay đổi của tất cả thuộc tính bên trong
);

// Tùy chọn 3: flush (thời điểm thực thi)
watch(
  items,
  (newItems) => {
    console.log('items thay đổi');
  },
  { flush: 'post' } // Thực thi sau khi DOM cập nhật (mặc định là 'pre')
);

onMounted(() => {
  // Kiểm tra theo dõi sâu
  setTimeout(() => {
    user.value.profile.age = 31; // Sẽ kích hoạt deep watch
  }, 1000);
});
</script>
```

#### Theo dõi nhiều nguồn dữ liệu

```vue
<!-- Vue 3 cách viết <script setup> -->
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// Vue 3 Composition API: theo dõi nhiều dữ liệu
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Tên thay đổi từ ${oldFirst} ${oldLast} thành ${newFirst} ${newLast}`);
});
</script>
```

### So sánh `computed` vs `watch`

| Đặc tính               | computed                               | watch                                            |
| ----------------------- | -------------------------------------- | ------------------------------------------------ |
| **Mục đích chính**      | Tính toán dữ liệu mới từ dữ liệu có sẵn | Theo dõi thay đổi và thực hiện side effect       |
| **Giá trị trả về**      | Bắt buộc                               | Không cần                                        |
| **Cache**               | Có                                     | Không                                            |
| **Theo dõi phụ thuộc**  | Tự động                                | Thủ công                                         |
| **Thao tác bất đồng bộ** | Không hỗ trợ                          | Hỗ trợ                                           |
| **Giá trị cũ/mới**      | Không lấy được                         | Lấy được                                         |
| **Dùng trong template**  | Dùng trực tiếp được                    | Không dùng trực tiếp được                        |
| **Thời điểm thực thi**  | Khi phụ thuộc thay đổi                 | Khi dữ liệu theo dõi thay đổi                   |

### Khuyến nghị sử dụng

#### Tình huống dùng `computed`

1. Cần **tính toán dữ liệu mới từ dữ liệu có sẵn**
2. Kết quả được **sử dụng nhiều lần** trong template (tận dụng cache)
3. **Tính toán đồng bộ**, không cần thao tác bất đồng bộ
4. Cần **định dạng, lọc, sắp xếp** dữ liệu

```vue
<script setup>
import { computed, ref } from 'vue';

const timestamp = ref(Date.now());
const users = ref([
  { id: 1, name: 'Alice', isActive: true },
  { id: 2, name: 'Bob', isActive: false },
  { id: 3, name: 'Carol', isActive: true },
]);
const cart = ref([
  { id: 1, name: 'Apple', price: 2, quantity: 3 },
  { id: 2, name: 'Banana', price: 1, quantity: 5 },
]);

// Định dạng dữ liệu
const formattedDate = computed(() => {
  return new Date(timestamp.value).toLocaleDateString();
});

// Lọc danh sách
const activeUsers = computed(() => {
  return users.value.filter((user) => user.isActive);
});

// Tính tổng
const totalPrice = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price, 0);
});
</script>
```

#### Tình huống dùng `watch`

1. Cần **thực hiện thao tác bất đồng bộ** (như gọi API)
2. Cần **thực hiện side effect** (như cập nhật localStorage)
3. Cần **debounce hoặc throttle**
4. Cần **lấy giá trị cũ và mới để so sánh**
5. Cần **thực thi có điều kiện** logic phức tạp

```vue
<script setup>
import { ref, watch } from 'vue';

const userId = ref(1);
const user = ref(null);

// Gọi API
watch(userId, async (newId) => {
  user.value = await fetch(`/api/users/${newId}`).then((response) =>
    response.json()
  );
});

const settings = ref({
  theme: 'dark',
  notifications: true,
});

// Đồng bộ localStorage
watch(
  settings,
  (newSettings) => {
    localStorage.setItem('settings', JSON.stringify(newSettings));
  },
  { deep: true }
);

const searchQuery = ref('');
let searchTimer = null;

const performSearch = (keyword) => {
  console.log(`Tìm kiếm: ${keyword}`);
};

// Tìm kiếm debounce
watch(searchQuery, (newQuery) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  searchTimer = setTimeout(() => {
    performSearch(newQuery);
  }, 500);
});
</script>
```

### Ví dụ so sánh thực tế

#### Cách dùng sai

```vue
<script setup>
import { ref, watch } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');
const fullName = ref('');

// Sai: nên dùng computed thay vì watch
watch(firstName, (newFirst) => {
  fullName.value = `${newFirst} ${lastName.value}`;
});

watch(lastName, (newLast) => {
  fullName.value = `${firstName.value} ${newLast}`;
});
</script>
```

#### Cách dùng đúng

```vue
<script setup>
import { computed, ref } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// Đúng: dùng computed cho dữ liệu dẫn xuất
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
</script>
```

### Ghi nhớ computed và watch

> **"computed tính toán dữ liệu, watch thực hiện hành động"**
>
> - `computed`: dùng để **tính toán dữ liệu mới** (định dạng, lọc, tổng)
> - `watch`: dùng để **thực hiện hành động** (gọi API, lưu dữ liệu, hiển thị thông báo)

### Bài tập thực hành: tính x \* y

> Đề bài: x=0, y=5. Có một nút mỗi lần nhấp thì x tăng 1. Sử dụng computed hoặc watch để triển khai kết quả x \* y.

#### Cách giải 1: Dùng `computed` (khuyến nghị)

Đây là tình huống phù hợp nhất, vì kết quả là dữ liệu mới được tính từ x và y.

```vue
<template>
  <div>
    <p>X: {{ x }}, Y: {{ y }}</p>
    <p>Result (X * Y): {{ result }}</p>
    <button @click="x++">Increment X</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const x = ref(0);
const y = ref(5);

// Khuyến nghị: đơn giản, trực quan, tự động theo dõi phụ thuộc
const result = computed(() => x.value * y.value);
</script>
```

#### Cách giải 2: Dùng `watch` (phức tạp hơn)

Mặc dù cũng có thể làm được, nhưng cần duy trì thủ công biến `result` và cần xử lý giá trị khởi tạo.

```vue
<script setup>
import { ref, watch } from 'vue';

const x = ref(0);
const y = ref(5);
const result = ref(0);

// Ít khuyến nghị: cần cập nhật thủ công, cần đặt immediate để tính lúc khởi tạo
watch(
  [x, y],
  ([newX, newY]) => {
    result.value = newX * newY;
  },
  { immediate: true }
);
</script>
```

## Reference

- [Vue 3 Official Documentation](https://vuejs.org/)
- [Vue 2 to Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue Directives](https://vuejs.org/api/built-in-directives.html)
- [Computed Properties and Watchers](https://vuejs.org/guide/essentials/computed.html)
