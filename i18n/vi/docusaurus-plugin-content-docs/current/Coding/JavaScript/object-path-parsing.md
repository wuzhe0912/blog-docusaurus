---
id: object-path-parsing
title: '[Medium] Phân tích đường dẫn Object'
slug: /object-path-parsing
tags: [JavaScript, Coding, Medium]
---

## 1. Question Description

> Mô tả bài toán

Triển khai hàm phân tích đường dẫn Object, có thể lấy và thiết lập giá trị của Object lồng nhau dựa trên chuỗi đường dẫn.

### Yêu cầu

1. **Hàm `get`**: Lấy giá trị Object theo đường dẫn

```javascript
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1
get(obj, 'a.b.d', 'default'); // 'default'
```

2. **Hàm `set`**: Thiết lập giá trị Object theo đường dẫn

```javascript
const obj = {};
set(obj, 'a.b.c', 1);
// obj = { a: { b: { c: 1 } } }
```

## 2. Implementation: get Function

> Triển khai hàm get

### Cách 1: Sử dụng split và reduce

**Ý tưởng**: Tách chuỗi đường dẫn thành mảng, sau đó sử dụng `reduce` để truy cập Object theo từng tầng.

```javascript
function get(obj, path, defaultValue) {
  // Xử lý trường hợp biên
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Tách chuỗi đường dẫn thành mảng
  const keys = path.split('.');

  // Sử dụng reduce để truy cập theo từng tầng
  const result = keys.reduce((current, key) => {
    // Nếu giá trị hiện tại là null hoặc undefined, trả về undefined
    if (current == null) {
      return undefined;
    }
    return current[key];
  }, obj);

  // Nếu kết quả là undefined, trả về giá trị mặc định
  return result !== undefined ? result : defaultValue;
}

// Kiểm thử
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // undefined (cần xử lý chỉ mục mảng)
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
```

### Cách 2: Hỗ trợ chỉ mục mảng

**Ý tưởng**: Xử lý chỉ mục mảng trong đường dẫn, ví dụ `'a.b[0].c'`.

```javascript
function get(obj, path, defaultValue) {
  if (!obj || typeof path !== 'string') {
    return defaultValue;
  }

  // Biểu thức chính quy khớp: tên thuộc tính hoặc chỉ mục mảng
  // Khớp 'a', 'b', '[0]', 'c' v.v.
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  const result = keys.reduce((current, key) => {
    if (current == null) {
      return undefined;
    }

    // Xử lý chỉ mục mảng [0] -> 0
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      return current[index];
    }

    return current[key];
  }, obj);

  return result !== undefined ? result : defaultValue;
}

// Kiểm thử
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
};

console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.d[0]')); // 2
console.log(get(obj, 'a.b.d[5]', 'not found')); // 'not found'
```

### Cách 3: Triển khai đầy đủ (xử lý trường hợp biên)

```javascript
function get(obj, path, defaultValue) {
  // Xử lý trường hợp biên
  if (obj == null) {
    return defaultValue;
  }

  if (typeof path !== 'string' || path === '') {
    return obj;
  }

  // Phân tích đường dẫn: hỗ trợ định dạng 'a.b.c' và 'a.b[0].c'
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  let result = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    // Nếu giá trị hiện tại là null hoặc undefined, trả về giá trị mặc định
    if (result == null) {
      return defaultValue;
    }

    // Xử lý chỉ mục mảng
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Kiểm thử
const obj = {
  a: {
    b: {
      c: 1,
      d: [2, 3, { e: 4 }],
    },
  },
  x: null,
  y: undefined,
};

console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d[2].e')); // 4
console.log(get(obj, 'a.b.f', 'default')); // 'default'
console.log(get(obj, 'x.y', 'default')); // 'default'
console.log(get(obj, 'y.z', 'default')); // 'default'
console.log(get(null, 'a.b', 'default')); // 'default'
console.log(get(obj, '', obj)); // obj (đường dẫn rỗng trả về Object gốc)
```

## 3. Implementation: set Function

> Triển khai hàm set

### Cách 1: Triển khai cơ bản

**Ý tưởng**: Tạo cấu trúc Object lồng nhau theo đường dẫn, sau đó thiết lập giá trị.

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  // Phân tích đường dẫn
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  // Tạo cấu trúc lồng nhau
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Xử lý chỉ mục mảng
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      if (!Array.isArray(current[index])) {
        current[index] = {};
      }
      current = current[index];
    } else {
      // Nếu key không tồn tại hoặc không phải Object, tạo Object mới
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  }

  // Thiết lập giá trị cho key cuối cùng
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);
    if (!Array.isArray(current)) {
      // Nếu hiện tại không phải mảng, cần chuyển đổi
      const temp = { ...current };
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }
    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Kiểm thử
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }
```

### Cách 2: Triển khai đầy đủ (xử lý mảng và Object)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Duyệt đến key áp chót, tạo cấu trúc lồng nhau
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Xử lý chỉ mục mảng
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      // Đảm bảo là mảng
      if (!Array.isArray(current)) {
        // Chuyển đổi Object thành mảng (giữ lại các chỉ mục hiện có)
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      // Đảm bảo chỉ mục tồn tại
      if (current[index] == null) {
        // Xác định key tiếp theo là mảng hay Object
        const nextKey = keys[i + 1];
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      // Xử lý key của Object
      if (current[key] == null) {
        // Xác định key tiếp theo là mảng hay Object
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        // Nếu đã tồn tại nhưng không phải Object, cần chuyển đổi
        const nextKey = keys[i + 1];
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Thiết lập giá trị cho key cuối cùng
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Kiểm thử
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d[0]', 2);
console.log(obj); // { a: { b: { c: 1, d: [2] } } }

set(obj, 'x[0].y', 3);
console.log(obj); // { a: { b: { c: 1, d: [2] } }, x: [{ y: 3 }] }
```

### Cách 3: Phiên bản rút gọn (chỉ xử lý Object, không xử lý chỉ mục mảng)

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Tạo cấu trúc lồng nhau (trừ key cuối cùng)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Thiết lập giá trị cho key cuối cùng
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Kiểm thử
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

## 4. Common Interview Questions

> Các câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Triển khai hàm get cơ bản

Hãy triển khai một hàm `get`, lấy giá trị của Object lồng nhau theo chuỗi đường dẫn.

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

// Kiểm thử
const obj = { a: { b: { c: 1 } } };
console.log(get(obj, 'a.b.c')); // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
```

**Điểm mấu chốt**:

- Xử lý trường hợp null/undefined
- Sử dụng split để tách đường dẫn
- Truy cập thuộc tính Object theo từng tầng
- Trả về giá trị mặc định khi đường dẫn không tồn tại

</details>

### Câu hỏi 2: Hàm get hỗ trợ chỉ mục mảng

Hãy mở rộng hàm `get` để hỗ trợ chỉ mục mảng, ví dụ `'a.b[0].c'`.

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }

  // Sử dụng biểu thức chính quy để phân tích đường dẫn
  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    // Xử lý chỉ mục mảng
    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Kiểm thử
const obj = {
  a: {
    b: [2, 3, { c: 4 }],
  },
};

console.log(get(obj, 'a.b[0]')); // 2
console.log(get(obj, 'a.b[2].c')); // 4
console.log(get(obj, 'a.b[5]', 'not found')); // 'not found'
```

**Điểm mấu chốt**:

- Sử dụng biểu thức chính quy `/[^.[\]]+|\[(\d+)\]/g` để phân tích đường dẫn
- Xử lý chỉ mục mảng định dạng `[0]`
- Chuyển đổi chỉ mục chuỗi thành số

</details>

### Câu hỏi 3: Triển khai hàm set

Hãy triển khai một hàm `set`, thiết lập giá trị của Object lồng nhau theo chuỗi đường dẫn.

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.split('.');
  let current = obj;

  // Tạo cấu trúc lồng nhau (trừ key cuối cùng)
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }

    current = current[key];
  }

  // Thiết lập giá trị cho key cuối cùng
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;

  return obj;
}

// Kiểm thử
const obj = {};
set(obj, 'a.b.c', 1);
console.log(obj); // { a: { b: { c: 1 } } }

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }
```

**Điểm mấu chốt**:

- Tạo cấu trúc Object lồng nhau theo từng tầng
- Đảm bảo các Object trung gian trên đường dẫn tồn tại
- Cuối cùng thiết lập giá trị đích

</details>

### Câu hỏi 4: Triển khai đầy đủ get và set

Hãy triển khai đầy đủ hàm `get` và `set`, hỗ trợ chỉ mục mảng và xử lý các trường hợp biên khác nhau.

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
// Hàm get
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string' || path === '') {
    return obj ?? defaultValue;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];
  let result = obj;

  for (const key of keys) {
    if (result == null) {
      return defaultValue;
    }

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);
      result = result[index];
    } else {
      result = result[key];
    }
  }

  return result !== undefined ? result : defaultValue;
}

// Hàm set
function set(obj, path, value) {
  if (!obj || typeof path !== 'string' || path === '') {
    return obj;
  }

  const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

  if (keys.length === 0) {
    return obj;
  }

  let current = obj;

  // Tạo cấu trúc lồng nhau
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    if (key.startsWith('[') && key.endsWith(']')) {
      const index = parseInt(key.slice(1, -1), 10);

      if (!Array.isArray(current)) {
        const temp = current;
        current = [];
        Object.keys(temp).forEach((k) => {
          current[k] = temp[k];
        });
      }

      if (current[index] == null) {
        current[index] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[index];
    } else {
      if (current[key] == null) {
        current[key] = nextKey.startsWith('[') ? [] : {};
      } else if (typeof current[key] !== 'object') {
        current[key] = nextKey.startsWith('[') ? [] : {};
      }

      current = current[key];
    }
  }

  // Thiết lập giá trị
  const lastKey = keys[keys.length - 1];
  if (lastKey.startsWith('[') && lastKey.endsWith(']')) {
    const index = parseInt(lastKey.slice(1, -1), 10);

    if (!Array.isArray(current)) {
      const temp = current;
      current = [];
      Object.keys(temp).forEach((k) => {
        current[k] = temp[k];
      });
    }

    current[index] = value;
  } else {
    current[lastKey] = value;
  }

  return obj;
}

// Kiểm thử
const obj = {};
set(obj, 'a.b.c', 1);
console.log(get(obj, 'a.b.c')); // 1

set(obj, 'a.b.d[0]', 2);
console.log(get(obj, 'a.b.d[0]')); // 2
```

</details>

## 5. Best Practices

> Các phương pháp tốt nhất

### Nên làm

```javascript
// 1. Xử lý trường hợp biên
function get(obj, path, defaultValue) {
  if (obj == null || typeof path !== 'string') {
    return defaultValue;
  }
  // ...
}

// 2. Sử dụng biểu thức chính quy để phân tích đường dẫn phức tạp
const keys = path.match(/[^.[\]]+|\[(\d+)\]/g) || [];

// 3. Trong set, xác định loại của key tiếp theo
const nextKey = keys[i + 1];
current[key] = nextKey.startsWith('[') ? [] : {};

// 4. Sử dụng nullish coalescing để xử lý giá trị mặc định
return result ?? defaultValue;
```

### Không nên làm

```javascript
// 1. Không được quên xử lý null/undefined
function get(obj, path) {
  const keys = path.split('.');
  return keys.reduce((acc, key) => acc[key], obj); // Có thể gây lỗi
}

// 2. Không nên trực tiếp thay đổi Object gốc (trừ khi được yêu cầu rõ ràng)
function set(obj, path, value) {
  // Nên trả về Object đã sửa đổi, không phải trực tiếp thay đổi
}

// 3. Không được bỏ qua sự khác biệt giữa mảng và Object
// Cần xác định key tiếp theo là chỉ mục mảng hay key của Object
```

## 6. Interview Summary

> Tổng kết phỏng vấn

### Ghi nhớ nhanh

**Phân tích đường dẫn Object**:

- **Hàm get**: Lấy giá trị theo đường dẫn, xử lý null/undefined, hỗ trợ giá trị mặc định
- **Hàm set**: Thiết lập giá trị theo đường dẫn, tự động tạo cấu trúc lồng nhau
- **Phân tích đường dẫn**: Sử dụng biểu thức chính quy xử lý định dạng `'a.b.c'` và `'a.b[0].c'`
- **Xử lý biên**: Xử lý null, undefined, chuỗi rỗng v.v.

**Các điểm triển khai chính**:

1. Phân tích đường dẫn: `split('.')` hoặc biểu thức chính quy
2. Truy cập theo từng tầng: Sử dụng vòng lặp hoặc `reduce`
3. Xử lý biên: Kiểm tra null/undefined
4. Hỗ trợ mảng: Xử lý chỉ mục định dạng `[0]`

### Ví dụ trả lời phỏng vấn

**Q: Hãy triển khai một hàm lấy giá trị Object theo đường dẫn.**

> "Triển khai một hàm `get`, nhận vào Object, chuỗi đường dẫn và giá trị mặc định. Đầu tiên xử lý các trường hợp biên, nếu Object là null hoặc đường dẫn không phải chuỗi thì trả về giá trị mặc định. Sau đó sử dụng `split('.')` để tách đường dẫn thành mảng các key, sử dụng vòng lặp để truy cập thuộc tính Object theo từng tầng. Mỗi lần truy cập đều kiểm tra giá trị hiện tại có phải null hoặc undefined không, nếu có thì trả về giá trị mặc định. Cuối cùng nếu kết quả là undefined thì trả về giá trị mặc định, ngược lại trả về kết quả. Nếu cần hỗ trợ chỉ mục mảng, có thể sử dụng biểu thức chính quy `/[^.[\]]+|\[(\d+)\]/g` để phân tích đường dẫn và xử lý chỉ mục định dạng `[0]`."

**Q: Làm thế nào để triển khai hàm thiết lập giá trị Object theo đường dẫn?**

> "Triển khai một hàm `set`, nhận vào Object, chuỗi đường dẫn và giá trị. Đầu tiên phân tích đường dẫn thành mảng các key, sau đó duyệt đến key áp chót, tạo cấu trúc Object lồng nhau theo từng tầng. Với mỗi key trung gian, nếu không tồn tại hoặc không phải Object thì tạo Object mới. Nếu key tiếp theo có định dạng chỉ mục mảng thì tạo mảng. Cuối cùng thiết lập giá trị cho key cuối cùng. Như vậy đảm bảo tất cả các Object trung gian trên đường dẫn đều tồn tại, sau đó thiết lập chính xác giá trị đích."

## Reference

- [Lodash get](https://lodash.com/docs/4.17.15#get)
- [Lodash set](https://lodash.com/docs/4.17.15#set)
- [MDN - String.prototype.split()](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/String/split)
- [MDN - RegExp](https://developer.mozilla.org/vi/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
