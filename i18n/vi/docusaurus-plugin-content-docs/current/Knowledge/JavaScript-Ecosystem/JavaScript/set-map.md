---
id: set-map
title: '[Medium] Set & Map'
slug: /set-map
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Set and Map?

> Set và Map là gì?

`Set` và `Map` là hai cấu trúc dữ liệu mới được giới thiệu trong ES6, cung cấp các giải pháp phù hợp hơn cho các tình huống cụ thể so với object và array truyền thống.

### Set (Tập hợp)

**Định nghĩa**: `Set` là một tập hợp các **giá trị duy nhất**, tương tự khái niệm tập hợp trong toán học.

**Đặc điểm**:

- Các giá trị được lưu trữ **không trùng lặp**
- Sử dụng `===` để xác định sự bằng nhau của các giá trị
- Duy trì thứ tự chèn
- Có thể lưu trữ bất kỳ kiểu giá trị nào (kiểu nguyên thủy hoặc object)

**Cách sử dụng cơ bản**:

```javascript
// Tạo Set
const set = new Set();

// Thêm giá trị
set.add(1);
set.add(2);
set.add(2); // Giá trị trùng lặp không được thêm
set.add('hello');
set.add({ name: 'John' });

console.log(set.size); // 4
console.log(set); // Set(4) { 1, 2, 'hello', { name: 'John' } }

// Kiểm tra giá trị có tồn tại không
console.log(set.has(1)); // true
console.log(set.has(3)); // false

// Xóa giá trị
set.delete(2);
console.log(set.has(2)); // false

// Xóa toàn bộ Set
set.clear();
console.log(set.size); // 0
```

**Tạo Set từ mảng**:

```javascript
// Loại bỏ giá trị trùng lặp trong mảng
const arr = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(arr);
console.log(uniqueSet); // Set(3) { 1, 2, 3 }

// Chuyển đổi lại thành mảng
const uniqueArr = [...uniqueSet];
console.log(uniqueArr); // [1, 2, 3]

// Viết tắt
const uniqueArr2 = [...new Set(arr)];
```

### Map (Ánh xạ)

**Định nghĩa**: `Map` là một tập hợp các **cặp khóa-giá trị**, tương tự object, nhưng khóa có thể là bất kỳ kiểu nào.

**Đặc điểm**:

- Khóa có thể là bất kỳ kiểu nào (chuỗi, số, object, hàm, v.v.)
- Duy trì thứ tự chèn
- Có thuộc tính `size`
- Thứ tự lặp trùng với thứ tự chèn

**Cách sử dụng cơ bản**:

```javascript
// Tạo Map
const map = new Map();

// Thêm cặp khóa-giá trị
map.set('name', 'John');
map.set(1, 'one');
map.set(true, 'boolean');
map.set({ id: 1 }, 'object key');

// Lấy giá trị
console.log(map.get('name')); // 'John'
console.log(map.get(1)); // 'one'

// Kiểm tra khóa có tồn tại không
console.log(map.has('name')); // true

// Xóa cặp khóa-giá trị
map.delete('name');

// Lấy kích thước
console.log(map.size); // 3

// Xóa toàn bộ Map
map.clear();
```

**Tạo Map từ mảng**:

```javascript
// Tạo từ mảng hai chiều
const entries = [
  ['name', 'John'],
  ['age', 30],
  ['city', 'Taipei'],
];
const map = new Map(entries);
console.log(map.get('name')); // 'John'

// Tạo từ object
const obj = { name: 'John', age: 30 };
const map2 = new Map(Object.entries(obj));
console.log(map2.get('name')); // 'John'
```

## 2. Set vs Array

> Sự khác biệt giữa Set và Array

| Đặc tính          | Set                    | Array                    |
| ------------------ | ---------------------- | ------------------------ |
| Giá trị trùng lặp  | Không cho phép         | Cho phép                 |
| Truy cập theo chỉ số | Không hỗ trợ        | Hỗ trợ                   |
| Hiệu suất tìm kiếm | O(1)                  | O(n)                     |
| Thứ tự chèn        | Duy trì               | Duy trì                  |
| Phương thức phổ biến | `add`, `has`, `delete` | `push`, `pop`, `indexOf` |

**Tình huống sử dụng**:

```javascript
// ✅ Phù hợp với Set: cần giá trị duy nhất
const userIds = new Set([1, 2, 3, 2, 1]);
console.log([...userIds]); // [1, 2, 3]

// ✅ Phù hợp với Set: kiểm tra sự tồn tại nhanh chóng
const visitedPages = new Set();
visitedPages.add('/home');
visitedPages.add('/about');
if (visitedPages.has('/home')) {
  console.log('Đã truy cập trang chủ');
}

// ✅ Phù hợp với Array: cần chỉ số hoặc giá trị trùng lặp
const scores = [100, 95, 100, 90]; // Cho phép trùng lặp
console.log(scores[0]); // 100
```

## 3. Map vs Object

> Sự khác biệt giữa Map và Object

| Đặc tính          | Map              | Object                     |
| ------------------ | ---------------- | -------------------------- |
| Kiểu khóa         | Bất kỳ kiểu nào  | Chuỗi hoặc Symbol         |
| Kích thước         | Thuộc tính `size` | Cần tính thủ công          |
| Khóa mặc định      | Không            | Có chuỗi prototype         |
| Thứ tự lặp         | Thứ tự chèn      | ES2015+ duy trì thứ tự chèn |
| Hiệu suất          | Nhanh hơn khi thêm/xóa thường xuyên | Nhanh hơn trong trường hợp chung |
| JSON               | Không hỗ trợ trực tiếp | Hỗ trợ gốc             |

**Tình huống sử dụng**:

```javascript
// ✅ Phù hợp với Map: khóa không phải chuỗi
const userMetadata = new Map();
const user1 = { id: 1 };
const user2 = { id: 2 };

userMetadata.set(user1, { lastLogin: '2024-01-01' });
userMetadata.set(user2, { lastLogin: '2024-01-02' });

console.log(userMetadata.get(user1)); // { lastLogin: '2024-01-01' }

// ✅ Phù hợp với Map: cần thêm/xóa thường xuyên
const cache = new Map();
cache.set('key1', 'value1');
cache.delete('key1');
cache.set('key2', 'value2');

// ✅ Phù hợp với Object: cấu trúc tĩnh, cần JSON
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};
const json = JSON.stringify(config); // Có thể serialize trực tiếp
```

## 4. Common Interview Questions

> Các câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Loại bỏ giá trị trùng lặp trong mảng

Hãy triển khai một hàm để loại bỏ các giá trị trùng lặp trong mảng.

```javascript
function removeDuplicates(arr) {
  // Triển khai của bạn
}
```

<details>
<summary>Nhấp để xem đáp án</summary>

**Phương pháp 1: Sử dụng Set (khuyến nghị)**

```javascript
function removeDuplicates(arr) {
  return [...new Set(arr)];
}

console.log(removeDuplicates([1, 2, 2, 3, 3, 3])); // [1, 2, 3]
console.log(removeDuplicates(['a', 'b', 'a', 'c'])); // ['a', 'b', 'c']
```

**Phương pháp 2: Sử dụng filter + indexOf**

```javascript
function removeDuplicates(arr) {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}
```

**Phương pháp 3: Sử dụng reduce**

```javascript
function removeDuplicates(arr) {
  return arr.reduce((acc, value) => {
    if (!acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
}
```

**So sánh hiệu suất**:

- Phương pháp Set: O(n), nhanh nhất
- filter + indexOf: O(n²), chậm hơn
- reduce + includes: O(n²), chậm hơn

</details>

### Câu hỏi 2: Kiểm tra mảng có giá trị trùng lặp không

Hãy triển khai một hàm để kiểm tra xem mảng có chứa giá trị trùng lặp không.

```javascript
function hasDuplicates(arr) {
  // Triển khai của bạn
}
```

<details>
<summary>Nhấp để xem đáp án</summary>

**Phương pháp 1: Sử dụng Set (khuyến nghị)**

```javascript
function hasDuplicates(arr) {
  return new Set(arr).size !== arr.length;
}

console.log(hasDuplicates([1, 2, 3])); // false
console.log(hasDuplicates([1, 2, 2, 3])); // true
```

**Phương pháp 2: Sử dụng phương thức has của Set**

```javascript
function hasDuplicates(arr) {
  const seen = new Set();
  for (const value of arr) {
    if (seen.has(value)) {
      return true;
    }
    seen.add(value);
  }
  return false;
}
```

**Phương pháp 3: Sử dụng indexOf**

```javascript
function hasDuplicates(arr) {
  return arr.some((value, index) => arr.indexOf(value) !== index);
}
```

**So sánh hiệu suất**:

- Phương pháp Set 1: O(n), nhanh nhất
- Phương pháp Set 2: O(n), trung bình có thể kết thúc sớm
- Phương pháp indexOf: O(n²), chậm hơn

</details>

### Câu hỏi 3: Đếm số lần xuất hiện của phần tử

Hãy triển khai một hàm để đếm số lần xuất hiện của mỗi phần tử trong mảng.

```javascript
function countOccurrences(arr) {
  // Triển khai của bạn
}
```

<details>
<summary>Nhấp để xem đáp án</summary>

**Phương pháp 1: Sử dụng Map (khuyến nghị)**

```javascript
function countOccurrences(arr) {
  const map = new Map();

  for (const value of arr) {
    map.set(value, (map.get(value) || 0) + 1);
  }

  return map;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts.get('a')); // 3
console.log(counts.get('b')); // 2
console.log(counts.get('c')); // 1
```

**Phương pháp 2: Sử dụng reduce + Map**

```javascript
function countOccurrences(arr) {
  return arr.reduce((map, value) => {
    map.set(value, (map.get(value) || 0) + 1);
    return map;
  }, new Map());
}
```

**Phương pháp 3: Chuyển đổi thành object**

```javascript
function countOccurrences(arr) {
  const counts = {};
  for (const value of arr) {
    counts[value] = (counts[value] || 0) + 1;
  }
  return counts;
}

const arr = ['a', 'b', 'a', 'c', 'b', 'a'];
const counts = countOccurrences(arr);
console.log(counts); // { a: 3, b: 2, c: 1 }
```

**Ưu điểm khi sử dụng Map**:

- Khóa có thể là bất kỳ kiểu nào (object, hàm, v.v.)
- Có thuộc tính `size`
- Thứ tự lặp trùng với thứ tự chèn

</details>

### Câu hỏi 4: Tìm giao của hai mảng

Hãy triển khai một hàm để tìm giao (các phần tử chung) của hai mảng.

```javascript
function intersection(arr1, arr2) {
  // Triển khai của bạn
}
```

<details>
<summary>Nhấp để xem đáp án</summary>

**Phương pháp 1: Sử dụng Set**

```javascript
function intersection(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  const result = [];

  for (const value of set1) {
    if (set2.has(value)) {
      result.push(value);
    }
  }

  return result;
}

console.log(intersection([1, 2, 3], [2, 3, 4])); // [2, 3]
```

**Phương pháp 2: Sử dụng filter + Set**

```javascript
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1)].filter((value) => set2.has(value));
}
```

**Phương pháp 3: Sử dụng filter + includes**

```javascript
function intersection(arr1, arr2) {
  return arr1.filter((value) => arr2.includes(value));
}
```

**So sánh hiệu suất**:

- Phương pháp Set: O(n + m), nhanh nhất
- filter + includes: O(n × m), chậm hơn

</details>

### Câu hỏi 5: Tìm hiệu của hai mảng

Hãy triển khai một hàm để tìm hiệu của hai mảng (các phần tử có trong arr1 nhưng không có trong arr2).

```javascript
function difference(arr1, arr2) {
  // Triển khai của bạn
}
```

<details>
<summary>Nhấp để xem đáp án</summary>

**Phương pháp 1: Sử dụng Set**

```javascript
function difference(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter((value) => !set2.has(value));
}

console.log(difference([1, 2, 3, 4], [2, 3])); // [1, 4]
```

**Phương pháp 2: Sử dụng Set loại bỏ trùng lặp rồi lọc**

```javascript
function difference(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return [...set1].filter((value) => !set2.has(value));
}
```

**Phương pháp 3: Sử dụng includes**

```javascript
function difference(arr1, arr2) {
  return arr1.filter((value) => !arr2.includes(value));
}
```

**So sánh hiệu suất**:

- Phương pháp Set: O(n + m), nhanh nhất
- Phương pháp includes: O(n × m), chậm hơn

</details>

### Câu hỏi 6: Triển khai LRU Cache

Hãy sử dụng Map để triển khai một bộ nhớ đệm LRU (Least Recently Used).

```javascript
class LRUCache {
  constructor(capacity) {
    // Triển khai của bạn
  }

  get(key) {
    // Triển khai của bạn
  }

  put(key, value) {
    // Triển khai của bạn
  }
}
```

<details>
<summary>Nhấp để xem đáp án</summary>

**Triển khai**:

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    // Di chuyển khóa này đến cuối (biểu thị đã sử dụng gần đây)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    // Nếu khóa đã tồn tại, xóa trước
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Nếu đã đầy dung lượng, xóa khóa cũ nhất (đầu tiên)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    // Thêm cặp khóa-giá trị (tự động đặt ở cuối)
    this.cache.set(key, value);
  }
}

// Ví dụ sử dụng
const cache = new LRUCache(2);
cache.put(1, 'one');
cache.put(2, 'two');
console.log(cache.get(1)); // 'one'
cache.put(3, 'three'); // Xóa khóa 2
console.log(cache.get(2)); // -1 (đã bị xóa)
console.log(cache.get(3)); // 'three'
```

**Giải thích**:

- Map duy trì thứ tự chèn, khóa đầu tiên là cũ nhất
- Khi `get`, khóa được di chuyển đến cuối để biểu thị sử dụng gần đây
- Khi `put`, nếu đã đầy dung lượng, xóa khóa đầu tiên

</details>

### Câu hỏi 7: Sử dụng object làm khóa của Map

Hãy giải thích kết quả đầu ra của đoạn mã sau.

```javascript
const map = new Map();
const obj1 = { id: 1 };
const obj2 = { id: 1 };

map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1));
console.log(map.get(obj2));
console.log(map.size);
```

<details>
<summary>Nhấp để xem đáp án</summary>

```javascript
// 'first'
// 'second'
// 2
```

**Giải thích**:

- `obj1` và `obj2` có nội dung giống nhau nhưng là **các instance object khác nhau**
- Map sử dụng **so sánh tham chiếu** (reference comparison), không phải so sánh giá trị
- Do đó `obj1` và `obj2` được coi là các khóa khác nhau
- Nếu sử dụng object thông thường làm Map, object sẽ bị chuyển thành chuỗi `[object Object]`, khiến tất cả object trở thành cùng một khóa

**So sánh với object thông thường**:

```javascript
// Object thông thường: khóa sẽ bị chuyển thành chuỗi
const obj = {};
const obj1 = { id: 1 };
const obj2 = { id: 1 };

obj[obj1] = 'first';
obj[obj2] = 'second';

console.log(obj[obj1]); // 'second' (bị ghi đè)
console.log(obj[obj2]); // 'second'
console.log(Object.keys(obj)); // ['[object Object]'] (chỉ có một khóa)

// Map: duy trì tham chiếu object
const map = new Map();
map.set(obj1, 'first');
map.set(obj2, 'second');

console.log(map.get(obj1)); // 'first'
console.log(map.get(obj2)); // 'second'
console.log(map.size); // 2
```

</details>

## 5. WeakSet và WeakMap

> Sự khác biệt giữa WeakSet và WeakMap

### WeakSet

**Đặc điểm**:

- Chỉ có thể lưu trữ **object** (không thể lưu trữ kiểu nguyên thủy)
- **Tham chiếu yếu**: nếu object không có tham chiếu khác, sẽ bị garbage collection thu hồi
- Không có thuộc tính `size`
- Không thể lặp
- Không có phương thức `clear`

**Tình huống sử dụng**: Đánh dấu object, tránh rò rỉ bộ nhớ

```javascript
const weakSet = new WeakSet();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1)); // true

// Khi obj1 không còn tham chiếu khác, sẽ bị garbage collection thu hồi
// Tham chiếu trong weakSet cũng sẽ tự động được xóa
```

### WeakMap

**Đặc điểm**:

- Khóa chỉ có thể là **object** (không thể là kiểu nguyên thủy)
- **Tham chiếu yếu**: nếu object khóa không có tham chiếu khác, sẽ bị garbage collection thu hồi
- Không có thuộc tính `size`
- Không thể lặp
- Không có phương thức `clear`

**Tình huống sử dụng**: Lưu trữ dữ liệu riêng tư của object, tránh rò rỉ bộ nhớ

```javascript
const weakMap = new WeakMap();

const obj1 = { id: 1 };
const obj2 = { id: 2 };

weakMap.set(obj1, 'data1');
weakMap.set(obj2, 'data2');

console.log(weakMap.get(obj1)); // 'data1'

// Khi obj1 không còn tham chiếu khác, sẽ bị garbage collection thu hồi
// Cặp khóa-giá trị trong weakMap cũng sẽ tự động được xóa
```

### So sánh WeakSet/WeakMap vs Set/Map

| Đặc tính            | Set/Map            | WeakSet/WeakMap        |
| -------------------- | ------------------ | ---------------------- |
| Kiểu khóa/giá trị   | Bất kỳ kiểu nào    | Chỉ object             |
| Tham chiếu yếu       | Không              | Có                     |
| Có thể lặp           | Có                 | Không                  |
| Thuộc tính size       | Có                 | Không                  |
| Phương thức clear     | Có                 | Không                  |
| Garbage collection    | Không tự động xóa  | Tự động xóa            |

## 6. Best Practices

> Các phương pháp tốt nhất

### Cách làm khuyến nghị

```javascript
// 1. Sử dụng Set khi cần giá trị duy nhất
const uniqueIds = new Set([1, 2, 3, 2, 1]);
console.log([...uniqueIds]); // [1, 2, 3]

// 2. Sử dụng Set khi cần tìm kiếm nhanh
const allowedUsers = new Set(['user1', 'user2', 'user3']);
if (allowedUsers.has(currentUser)) {
  // Cho phép truy cập
}

// 3. Sử dụng Map khi khóa không phải chuỗi
const metadata = new Map();
const user = { id: 1 };
metadata.set(user, { lastLogin: new Date() });

// 4. Sử dụng Map khi cần thêm/xóa thường xuyên
const cache = new Map();
cache.set('key', 'value');
cache.delete('key');

// 5. Sử dụng WeakMap để liên kết dữ liệu object và tránh rò rỉ bộ nhớ
const privateData = new WeakMap();
class User {
  constructor(name) {
    privateData.set(this, { name });
  }
  getName() {
    return privateData.get(this).name;
  }
}
```

### Cách làm nên tránh

```javascript
// 1. Không dùng Set thay thế mọi chức năng của mảng
// ❌ Không tốt: dùng Set khi cần chỉ số
const set = new Set([1, 2, 3]);
// set[0] // undefined, không thể truy cập bằng chỉ số

// ✅ Tốt: dùng mảng khi cần chỉ số
const arr = [1, 2, 3];
arr[0]; // 1

// 2. Không dùng Map thay thế mọi chức năng của object
// ❌ Không tốt: dùng Map cho cấu trúc tĩnh đơn giản
const config = new Map();
config.set('apiUrl', 'https://api.example.com');
config.set('timeout', 5000);

// ✅ Tốt: dùng object cho cấu trúc đơn giản
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

// 3. Không nhầm lẫn Set và Map
// ❌ Sai: Set không có cặp khóa-giá trị
const set = new Set();
set.set('key', 'value'); // TypeError: set.set is not a function

// ✅ Đúng: Map có cặp khóa-giá trị
const map = new Map();
map.set('key', 'value');
```

## 7. Interview Summary

> Tổng kết phỏng vấn

### Ghi nhớ nhanh

**Set (Tập hợp)**:

- Giá trị duy nhất, không trùng lặp
- Tìm kiếm nhanh: O(1)
- Phù hợp: loại bỏ trùng lặp, kiểm tra sự tồn tại nhanh

**Map (Ánh xạ)**:

- Cặp khóa-giá trị, khóa có thể là bất kỳ kiểu nào
- Duy trì thứ tự chèn
- Phù hợp: khóa không phải chuỗi, thêm/xóa thường xuyên

**WeakSet/WeakMap**:

- Tham chiếu yếu, garbage collection tự động
- Khóa/giá trị chỉ có thể là object
- Phù hợp: tránh rò rỉ bộ nhớ

### Ví dụ trả lời phỏng vấn

**Q: Khi nào nên sử dụng Set thay vì mảng?**

> "Nên sử dụng Set khi cần đảm bảo tính duy nhất của giá trị hoặc cần kiểm tra nhanh xem giá trị có tồn tại không. Phương thức `has` của Set có độ phức tạp thời gian O(1), trong khi `includes` của mảng là O(n). Ví dụ, khi loại bỏ giá trị trùng lặp trong mảng hoặc kiểm tra quyền người dùng, Set hiệu quả hơn."

**Q: Sự khác biệt giữa Map và Object là gì?**

> "Khóa của Map có thể là bất kỳ kiểu nào, bao gồm object, hàm, v.v., trong khi khóa của object chỉ có thể là chuỗi hoặc Symbol. Map có thuộc tính `size` để lấy kích thước trực tiếp, trong khi object cần tính thủ công. Map duy trì thứ tự chèn và không có chuỗi prototype, phù hợp để lưu trữ dữ liệu thuần túy. Khi cần sử dụng object làm khóa hoặc cần thêm/xóa thường xuyên, Map là lựa chọn tốt hơn."

**Q: Sự khác biệt giữa WeakMap và Map là gì?**

> "Khóa của WeakMap chỉ có thể là object và sử dụng tham chiếu yếu. Khi object khóa không còn tham chiếu khác, mục tương ứng trong WeakMap sẽ tự động bị garbage collection thu hồi, giúp tránh rò rỉ bộ nhớ. WeakMap không thể lặp và không có thuộc tính `size`. Phù hợp để lưu trữ dữ liệu riêng tư hoặc metadata của object; khi object bị hủy, dữ liệu liên quan cũng tự động được xóa."

## Reference

- [MDN - Set](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [JavaScript.info - Map and Set](https://javascript.info/map-set)
