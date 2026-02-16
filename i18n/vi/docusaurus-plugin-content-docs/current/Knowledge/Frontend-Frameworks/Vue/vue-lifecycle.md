---
id: vue-lifecycle
title: '[Medium] Lifecycle Hooks của Vue'
slug: /vue-lifecycle
tags: [Vue, Quiz, Medium]
---

## 1. Please explain Vue lifecycle hooks (include Vue 2 & Vue 3)

> Giải thích các lifecycle hook của Vue (bao gồm Vue 2 và Vue 3).

Component Vue trải qua một chuỗi các giai đoạn từ khi tạo đến khi hủy. Trong các giai đoạn này, các hàm đặc biệt được gọi tự động, đó chính là "lifecycle hook". Hiểu rõ lifecycle rất quan trọng để nắm vững hành vi của component.

### Sơ đồ lifecycle Vue

```
Giai đoạn tạo → Giai đoạn mount → Giai đoạn cập nhật → Giai đoạn hủy
      ↓               ↓                 ↓                  ↓
   Created         Mounted           Updated           Unmounted
```

### Bảng so sánh lifecycle Vue 2 vs Vue 3

| Vue 2 (Options API) | Vue 3 (Options API) | Vue 3 (Composition API) | Mô tả                                |
| ------------------- | ------------------- | ----------------------- | ------------------------------------- |
| `beforeCreate`      | `beforeCreate`      | `setup()`               | Trước khi khởi tạo instance          |
| `created`           | `created`           | `setup()`               | Instance đã được tạo                 |
| `beforeMount`       | `beforeMount`       | `onBeforeMount`         | Trước khi mount vào DOM              |
| `mounted`           | `mounted`           | `onMounted`             | Sau khi mount vào DOM                |
| `beforeUpdate`      | `beforeUpdate`      | `onBeforeUpdate`        | Trước khi cập nhật dữ liệu          |
| `updated`           | `updated`           | `onUpdated`             | Sau khi cập nhật dữ liệu            |
| `beforeDestroy`     | `beforeUnmount`     | `onBeforeUnmount`       | Trước khi unmount component          |
| `destroyed`         | `unmounted`         | `onUnmounted`           | Sau khi unmount component            |
| `activated`         | `activated`         | `onActivated`           | Khi component keep-alive được kích hoạt |
| `deactivated`       | `deactivated`       | `onDeactivated`         | Khi component keep-alive bị ngừng    |
| `errorCaptured`     | `errorCaptured`     | `onErrorCaptured`       | Khi bắt được lỗi từ component con   |

### 1. Giai đoạn tạo (Creation Phase)

#### `beforeCreate` / `created`

```vue
<script>
export default {
  data() {
    return {
      message: 'Hello Vue',
    };
  },

  beforeCreate() {
    // data, methods chưa được khởi tạo
    console.log('beforeCreate');
    console.log(this.message); // undefined
    console.log(this.$el); // undefined
  },

  created() {
    // data, computed, methods, watch đã được khởi tạo
    console.log('created');
    console.log(this.message); // 'Hello Vue'
    console.log(this.$el); // undefined (chưa mount vào DOM)

    // Thời điểm phù hợp để gửi request API
    this.fetchData();
  },

  methods: {
    async fetchData() {
      const response = await fetch('/api/data');
      this.data = await response.json();
    },
  },
};
</script>
```

**Thời điểm sử dụng:**

- `beforeCreate`: ít sử dụng, thường dùng cho phát triển plugin
- `created`:
  - Gửi request API
  - Khởi tạo dữ liệu không reactive
  - Thiết lập event listener
  - Không thể thao tác DOM (chưa mount)

### 2. Giai đoạn mount (Mounting Phase)

#### `beforeMount` / `mounted`

```vue
<template>
  <div ref="myElement">
    <h1>{{ title }}</h1>
    <canvas ref="myCanvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Vue Lifecycle',
    };
  },

  beforeMount() {
    // Virtual DOM đã được tạo, nhưng chưa render vào DOM thực
    console.log('beforeMount');
    console.log(this.$el); // Tồn tại, nhưng nội dung là cũ
    console.log(this.$refs.myElement); // undefined
  },

  mounted() {
    // Component đã mount vào DOM, có thể thao tác phần tử DOM
    console.log('mounted');
    console.log(this.$el); // Phần tử DOM thực
    console.log(this.$refs.myElement); // Có thể truy cập ref

    // Thời điểm phù hợp để thao tác DOM
    this.initCanvas();

    // Thời điểm phù hợp để dùng package DOM bên thứ ba
    this.initChart();
  },

  methods: {
    initCanvas() {
      const canvas = this.$refs.myCanvas;
      const ctx = canvas.getContext('2d');
      // Vẽ canvas...
    },

    initChart() {
      // Khởi tạo package biểu đồ (như Chart.js, ECharts)
      new Chart(this.$refs.myCanvas, {
        type: 'bar',
        data: {
          /* ... */
        },
      });
    },
  },
};
</script>
```

**Thời điểm sử dụng:**

- `beforeMount`: ít sử dụng
- `mounted`:
  - Thao tác phần tử DOM
  - Khởi tạo package DOM bên thứ ba (biểu đồ, bản đồ)
  - Thiết lập event listener cần DOM
  - Khởi động timer
  - **Lưu ý**: `mounted` của component con thực thi trước `mounted` của component cha

### 3. Giai đoạn cập nhật (Updating Phase)

#### `beforeUpdate` / `updated`

```vue
<template>
  <div>
    <p>Bộ đếm: {{ count }}</p>
    <button @click="count++">Tăng</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },

  beforeUpdate() {
    // Dữ liệu đã cập nhật, nhưng DOM chưa cập nhật
    console.log('beforeUpdate');
    console.log('data count:', this.count); // Giá trị mới
    console.log('DOM count:', this.$el.querySelector('p').textContent); // Giá trị cũ

    // Có thể truy cập trạng thái DOM trước khi cập nhật
  },

  updated() {
    // Dữ liệu và DOM đều đã cập nhật
    console.log('updated');
    console.log('data count:', this.count); // Giá trị mới
    console.log('DOM count:', this.$el.querySelector('p').textContent); // Giá trị mới

    // Lưu ý: không sửa đổi dữ liệu ở đây, sẽ gây vòng lặp vô hạn
    // this.count++; // Sai! Gây cập nhật vô hạn
  },
};
</script>
```

**Thời điểm sử dụng:**

- `beforeUpdate`: khi cần truy cập trạng thái DOM trước khi cập nhật
- `updated`:
  - Thao tác sau khi DOM cập nhật (như tính lại kích thước phần tử)
  - **Không sửa đổi dữ liệu ở đây**, sẽ gây vòng lặp cập nhật vô hạn
  - Nếu cần thực hiện thao tác sau khi dữ liệu thay đổi, nên dùng `watch` hoặc `nextTick`

### 4. Giai đoạn hủy (Unmounting Phase)

#### `beforeUnmount` / `unmounted` (Vue 3) / `beforeDestroy` / `destroyed` (Vue 2)

```vue
<script>
export default {
  data() {
    return {
      timer: null,
      ws: null,
    };
  },

  mounted() {
    // Thiết lập timer
    this.timer = setInterval(() => {
      console.log('Timer đang chạy...');
    }, 1000);

    // Tạo kết nối WebSocket
    this.ws = new WebSocket('ws://example.com');
    this.ws.onmessage = (event) => {
      console.log('Nhận tin nhắn:', event.data);
    };

    // Thiết lập event listener
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClick);
  },

  beforeUnmount() {
    // Vue 3 dùng beforeUnmount
    // Vue 2 dùng beforeDestroy
    console.log('beforeUnmount');
    // Component sắp bị hủy, nhưng vẫn có thể truy cập dữ liệu và DOM
  },

  unmounted() {
    // Vue 3 dùng unmounted
    // Vue 2 dùng destroyed
    console.log('unmounted');

    // Dọn dẹp timer
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Đóng kết nối WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Gỡ bỏ event listener
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClick);
  },

  methods: {
    handleResize() {
      console.log('Kích thước cửa sổ thay đổi');
    },
    handleClick() {
      console.log('Sự kiện click');
    },
  },
};
</script>
```

**Thời điểm sử dụng:**

- `beforeUnmount` / `beforeDestroy`: ít sử dụng
- `unmounted` / `destroyed`:
  - Dọn dẹp timer (`setInterval`, `setTimeout`)
  - Gỡ bỏ event listener
  - Đóng kết nối WebSocket
  - Hủy request API chưa hoàn thành
  - Dọn dẹp instance package bên thứ ba

### 5. Component đặc biệt: KeepAlive

#### `<KeepAlive>` là gì?

`<KeepAlive>` là component tích hợp của Vue, chức năng chính là **cache instance component**, tránh component bị hủy khi chuyển đổi.

- **Hành vi mặc định**: khi component chuyển đổi (ví dụ chuyển route hoặc `v-if`), Vue hủy component cũ và tạo component mới.
- **Hành vi KeepAlive**: component được bọc bởi `<KeepAlive>` giữ trạng thái trong bộ nhớ khi chuyển đổi, không bị hủy.

#### Chức năng và đặc tính chính

1. **Cache trạng thái**: giữ nội dung form, vị trí cuộn, v.v.
2. **Tối ưu hiệu năng**: tránh render lặp lại và request API trùng lặp.
3. **Lifecycle riêng**: cung cấp hai hook đặc biệt `activated` và `deactivated`.

#### Trường hợp sử dụng

1. **Chuyển đổi nhiều tab**: ví dụ tab trong hệ thống quản trị.
2. **Chuyển đổi danh sách và chi tiết**: từ trang chi tiết quay lại danh sách, muốn giữ vị trí cuộn và bộ lọc.
3. **Form phức tạp**: điền form dở dang, chuyển sang trang khác xem thông tin rồi quay lại, nội dung form không bị mất.

#### Ví dụ sử dụng

```vue
<template>
  <KeepAlive include="UserList,ProductList">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
```

- `include`: chỉ component có tên khớp mới được cache.
- `exclude`: component có tên khớp **không** được cache.
- `max`: số lượng tối đa instance component được cache.

### 6. Lifecycle hook đặc biệt

#### `activated` / `deactivated` (dùng với `<KeepAlive>`)

```vue
<template>
  <div>
    <button @click="toggleComponent">Chuyển đổi component</button>

    <!-- keep-alive cache component, không tạo lại -->
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </div>
</template>

<script>
// ChildComponent.vue
export default {
  name: 'ChildComponent',

  mounted() {
    console.log('mounted - chỉ thực thi một lần');
  },

  activated() {
    console.log('activated - thực thi mỗi khi component được kích hoạt');
    // Thời điểm phù hợp để tải lại dữ liệu
    this.refreshData();
  },

  deactivated() {
    console.log('deactivated - thực thi mỗi khi component bị ngừng');
    // Thời điểm phù hợp để tạm dừng thao tác (như phát video)
    this.pauseVideo();
  },

  unmounted() {
    console.log('unmounted - không thực thi (vì được cache bởi keep-alive)');
  },

  methods: {
    refreshData() {
      // Tải lại dữ liệu
    },
    pauseVideo() {
      // Tạm dừng phát video
    },
  },
};
</script>
```

#### `errorCaptured` (xử lý lỗi)

```vue
<script>
// ParentComponent.vue
export default {
  errorCaptured(err, instance, info) {
    console.error('Bắt được lỗi từ component con:', err);
    console.log('Component nguồn lỗi:', instance);
    console.log('Thông tin lỗi:', info);

    // Trả về false để ngăn lỗi lan truyền lên trên
    return false;
  },
};
</script>
```

### Lifecycle với Composition API của Vue 3

```vue
<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured,
} from 'vue';

const count = ref(0);

// setup() tương đương với beforeCreate + created
console.log('setup thực thi');

onBeforeMount(() => {
  console.log('onBeforeMount');
});

onMounted(() => {
  console.log('onMounted');
  // Thao tác DOM, khởi tạo package
});

onBeforeUpdate(() => {
  console.log('onBeforeUpdate');
});

onUpdated(() => {
  console.log('onUpdated');
});

onBeforeUnmount(() => {
  console.log('onBeforeUnmount');
});

onUnmounted(() => {
  console.log('onUnmounted');
  // Dọn dẹp tài nguyên
});

onActivated(() => {
  console.log('onActivated');
});

onDeactivated(() => {
  console.log('onDeactivated');
});

onErrorCaptured((err, instance, info) => {
  console.error('Lỗi:', err);
  return false;
});
</script>
```

## 2. What's the execution order of parent and child component lifecycle hooks?

> Thứ tự thực thi lifecycle hook của component cha và con là gì?

Đây là câu hỏi phỏng vấn rất quan trọng. Hiểu thứ tự thực thi lifecycle cha-con giúp nắm vững tương tác giữa các component.

### Thứ tự thực thi

```
Cha beforeCreate
→ Cha created
→ Cha beforeMount
→ Con beforeCreate
→ Con created
→ Con beforeMount
→ Con mounted
→ Cha mounted
```

**Ghi nhớ: "Tạo từ ngoài vào trong, mount từ trong ra ngoài"**

### Ví dụ thực tế

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <h1>Component cha</h1>
    <child-component />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  name: 'ParentComponent',
  components: { ChildComponent },

  beforeCreate() {
    console.log('1. Cha beforeCreate');
  },
  created() {
    console.log('2. Cha created');
  },
  beforeMount() {
    console.log('3. Cha beforeMount');
  },
  mounted() {
    console.log('8. Cha mounted');
  },
  beforeUpdate() {
    console.log('Cha beforeUpdate');
  },
  updated() {
    console.log('Cha updated');
  },
  beforeUnmount() {
    console.log('9. Cha beforeUnmount');
  },
  unmounted() {
    console.log('12. Cha unmounted');
  },
};
</script>
```

```vue
<!-- ChildComponent.vue -->
<template>
  <div>
    <h2>Component con</h2>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',

  beforeCreate() {
    console.log('4. Con beforeCreate');
  },
  created() {
    console.log('5. Con created');
  },
  beforeMount() {
    console.log('6. Con beforeMount');
  },
  mounted() {
    console.log('7. Con mounted');
  },
  beforeUpdate() {
    console.log('Con beforeUpdate');
  },
  updated() {
    console.log('Con updated');
  },
  beforeUnmount() {
    console.log('10. Con beforeUnmount');
  },
  unmounted() {
    console.log('11. Con unmounted');
  },
};
</script>
```

### Thứ tự thực thi theo từng giai đoạn

#### 1. Giai đoạn tạo và mount

```
1. Cha beforeCreate
2. Cha created
3. Cha beforeMount
4. Con beforeCreate
5. Con created
6. Con beforeMount
7. Con mounted        ← Component con hoàn thành mount trước
8. Cha mounted        ← Component cha hoàn thành mount sau
```

**Lý do**: component cha cần đợi component con hoàn thành mount để đảm bảo toàn bộ cây component đã render xong.

#### 2. Giai đoạn cập nhật

```
Dữ liệu component cha thay đổi:
1. Cha beforeUpdate
2. Con beforeUpdate  ← Nếu component con sử dụng dữ liệu cha
3. Con updated
4. Cha updated

Dữ liệu component con thay đổi:
1. Con beforeUpdate
2. Con updated
(Component cha không kích hoạt cập nhật)
```

#### 3. Giai đoạn hủy

```
9. Cha beforeUnmount
10. Con beforeUnmount
11. Con unmounted     ← Component con bị hủy trước
12. Cha unmounted     ← Component cha bị hủy sau
```

### Trường hợp nhiều component con

```vue
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-a />
    <child-b />
    <child-c />
  </div>
</template>
```

Thứ tự thực thi:

```
1. Cha beforeCreate
2. Cha created
3. Cha beforeMount
4. ConA beforeCreate
5. ConA created
6. ConA beforeMount
7. ConB beforeCreate
8. ConB created
9. ConB beforeMount
10. ConC beforeCreate
11. ConC created
12. ConC beforeMount
13. ConA mounted
14. ConB mounted
15. ConC mounted
16. Cha mounted
```

### Tại sao lại theo thứ tự này?

#### Giai đoạn mount (Mounting)

Quá trình mount của Vue tương tự "duyệt theo chiều sâu":

1. Component cha bắt đầu tạo
2. Khi phân tích template, phát hiện component con
3. Hoàn thành mount đầy đủ component con trước
4. Sau khi tất cả component con đã mount, component cha mới hoàn thành mount

```
Component cha chuẩn bị mount
    ↓
Phát hiện component con
    ↓
Component con mount đầy đủ (beforeMount → mounted)
    ↓
Component cha hoàn thành mount (mounted)
```

#### Giai đoạn hủy (Unmounting)

Thứ tự hủy là "thông báo component cha sắp hủy trước, rồi hủy tuần tự component con":

```
Component cha chuẩn bị hủy (beforeUnmount)
    ↓
Thông báo component con chuẩn bị hủy (beforeUnmount)
    ↓
Component con hoàn thành hủy (unmounted)
    ↓
Component cha hoàn thành hủy (unmounted)
```

### Tình huống ứng dụng thực tế

#### Tình huống 1: Component cha cần đợi component con tải dữ liệu xong

```vue
<!-- ParentComponent.vue -->
<script>
export default {
  data() {
    return {
      childrenReady: false,
    };
  },

  mounted() {
    // Tất cả component con đã mount xong
    console.log('Tất cả component con đã sẵn sàng');
    this.childrenReady = true;
  },
};
</script>
```

#### Tình huống 2: Component con cần truy cập dữ liệu từ component cha

```vue
<!-- ChildComponent.vue -->
<script>
export default {
  inject: ['parentData'], // Nhận dữ liệu từ component cha

  created() {
    // Có thể truy cập dữ liệu cha (created của cha đã thực thi)
    console.log('Dữ liệu cha:', this.parentData);
  },
};
</script>
```

#### Tình huống 3: Tránh truy cập component con chưa mount trong mounted

```vue
<!-- ParentComponent.vue -->
<template>
  <child-component ref="child" />
</template>

<script>
export default {
  mounted() {
    // Component con đã mount, truy cập an toàn
    this.$refs.child.someMethod();
  },
};
</script>
```

### Lỗi thường gặp

#### Lỗi 1: Truy cập ref component con trong created của cha

```vue
<!-- Sai -->
<script>
export default {
  created() {
    // Component con chưa được tạo
    console.log(this.$refs.child); // undefined
  },
};
</script>

<!-- Đúng -->
<script>
export default {
  mounted() {
    // Component con đã mount
    console.log(this.$refs.child); // Có thể truy cập
  },
};
</script>
```

#### Lỗi 2: Giả định component con mount trước component cha

```vue
<!-- Sai -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // Giả định component cha đã mount (sai!)
    this.$parent.someMethod(); // Có thể lỗi
  },
};
</script>

<!-- Đúng -->
<script>
// ChildComponent.vue
export default {
  mounted() {
    // Dùng $nextTick để đảm bảo component cha cũng đã mount
    this.$nextTick(() => {
      this.$parent.someMethod();
    });
  },
};
</script>
```

## 3. When should we use each lifecycle hook?

> Khi nào nên sử dụng các lifecycle hook?

Đây là tổng hợp các trường hợp sử dụng tốt nhất cho từng lifecycle hook.

### Bảng tổng kết trường hợp sử dụng

| Lifecycle     | Mục đích thường gặp                   | Nội dung truy cập được              |
| ------------- | -------------------------------------- | ----------------------------------- |
| `created`     | Request API, khởi tạo dữ liệu         | data, methods (không có DOM)        |
| `mounted`     | Thao tác DOM, khởi tạo package         | data, methods, DOM                  |
| `updated`     | Thao tác sau khi DOM cập nhật          | DOM mới                             |
| `unmounted`   | Dọn dẹp tài nguyên                    | Dọn dẹp timer, event               |
| `activated`   | Khi keep-alive được kích hoạt          | Tải lại dữ liệu                    |

### Ví dụ ứng dụng thực tế

#### 1. `created`: Gửi request API

```vue
<script>
export default {
  data() {
    return {
      users: [],
      loading: true,
      error: null,
    };
  },

  created() {
    // Thời điểm phù hợp để gửi request API
    this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      try {
        this.loading = true;
        const response = await fetch('/api/users');
        this.users = await response.json();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
```

#### 2. `mounted`: Khởi tạo package bên thứ ba

```vue
<template>
  <div>
    <div ref="chart" style="width: 600px; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartInstance: null,
    };
  },

  mounted() {
    // Thời điểm phù hợp để khởi tạo package cần DOM
    this.initChart();
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        title: { text: 'Dữ liệu bán hàng' },
        xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: {},
        series: [{ type: 'bar', data: [10, 20, 30, 40, 50] }],
      });
    },
  },

  unmounted() {
    // Nhớ dọn dẹp instance biểu đồ
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  },
};
</script>
```

#### 3. `unmounted`: Dọn dẹp tài nguyên

```vue
<script>
export default {
  data() {
    return {
      intervalId: null,
      observer: null,
    };
  },

  mounted() {
    // Khởi động timer
    this.intervalId = setInterval(() => {
      console.log('Đang chạy...');
    }, 1000);

    // Tạo Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      console.log(entries);
    });
    this.observer.observe(this.$el);

    // Lắng nghe sự kiện toàn cục
    window.addEventListener('resize', this.handleResize);
  },

  unmounted() {
    // Dọn dẹp timer
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Dọn dẹp Observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Gỡ bỏ event listener
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      console.log('Kích thước cửa sổ thay đổi');
    },
  },
};
</script>
```

### Mẹo ghi nhớ

1. **`created`**: "Tạo xong, dùng được dữ liệu" -> Request API
2. **`mounted`**: "Mount xong, dùng được DOM" -> Thao tác DOM, package bên thứ ba
3. **`updated`**: "Cập nhật xong, DOM đã đồng bộ" -> Thao tác sau khi DOM cập nhật
4. **`unmounted`**: "Unmount xong, nhớ dọn dẹp" -> Dọn dẹp tài nguyên

## Reference

- [Vue 3 Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
- [Vue 2 Lifecycle Diagram](https://v2.vuejs.org/v2/guide/instance.html#Lifecycle-Diagram)
- [Vue 3 Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html)
- [Composition API: Lifecycle Hooks](https://vuejs.org/api/composition-api-lifecycle.html)
