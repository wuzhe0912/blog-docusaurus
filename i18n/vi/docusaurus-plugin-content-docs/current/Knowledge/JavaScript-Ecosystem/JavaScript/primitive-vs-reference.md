---
id: primitive-vs-reference
title: '[Medium] 📄 Primitive vs Reference Types'
slug: /primitive-vs-reference
tags: [JavaScript, Quiz, Medium]
---

## 1. What are Primitive Types and Reference Types?

> Kiểu nguyên thủy (Primitive Types) và kiểu tham chiếu (Reference Types) là gì?

Các kiểu dữ liệu trong JavaScript được chia thành hai loại lớn: **kiểu nguyên thủy** và **kiểu tham chiếu**. Chúng có sự khác biệt cơ bản về cách lưu trữ trong bộ nhớ và hành vi truyền dữ liệu.

### Kiểu nguyên thủy (Primitive Types)

**Đặc điểm**:

- Được lưu trữ trong **Stack (ngăn xếp)**
- Khi truyền sẽ **sao chép giá trị** (Call by Value)
- Bất biến (Immutable)

**Bao gồm 7 loại**:

```javascript
// 1. String (chuỗi)
const str = 'hello';

// 2. Number (số)
const num = 42;

// 3. Boolean (luận lý)
const bool = true;

// 4. Undefined
let undef;

// 5. Null
const n = null;

// 6. Symbol (ES6)
const sym = Symbol('unique');

// 7. BigInt (ES2020)
const bigInt = 9007199254740991n;
```

### Kiểu tham chiếu (Reference Types)

**Đặc điểm**:

- Được lưu trữ trong **Heap (vùng nhớ heap)**
- Khi truyền sẽ **sao chép tham chiếu (địa chỉ bộ nhớ)** (Call by Reference)
- Có thể thay đổi (Mutable)

**Bao gồm**:

```javascript
// 1. Object (đối tượng)
const obj = { name: 'John' };

// 2. Array (mảng)
const arr = [1, 2, 3];

// 3. Function (hàm)
const func = function () {};

// 4. Date
const date = new Date();

// 5. RegExp
const regex = /abc/;

// 6. Map, Set, WeakMap, WeakSet (ES6)
const map = new Map();
const set = new Set();
```

## 2. Call by Value vs Call by Reference

> Truyền theo giá trị (Call by Value) vs Truyền theo tham chiếu (Call by Reference)

### Truyền theo giá trị (Call by Value) - Kiểu nguyên thủy

**Hành vi**: Sao chép giá trị, việc sửa đổi bản sao không ảnh hưởng đến giá trị gốc.

```javascript
// Kiểu nguyên thủy: truyền theo giá trị
let a = 10;
let b = a; // Sao chép giá trị

b = 20; // Sửa đổi b

console.log(a); // 10 (không bị ảnh hưởng)
console.log(b); // 20
```

**Sơ đồ bộ nhớ**:

```text
┌─────────┐
│ Stack   │
├─────────┤
│ a: 10   │ ← Giá trị độc lập
├─────────┤
│ b: 20   │ ← Giá trị độc lập (đã sửa sau khi sao chép)
└─────────┘
```

### Truyền theo tham chiếu (Call by Reference) - Kiểu tham chiếu

**Hành vi**: Sao chép địa chỉ bộ nhớ, hai biến trỏ đến cùng một đối tượng.

```javascript
// Kiểu tham chiếu: truyền theo tham chiếu
let obj1 = { name: 'John' };
let obj2 = obj1; // Sao chép địa chỉ bộ nhớ

obj2.name = 'Jane'; // Sửa đổi thông qua obj2

console.log(obj1.name); // 'Jane' (bị ảnh hưởng!)
console.log(obj2.name); // 'Jane'
console.log(obj1 === obj2); // true (trỏ đến cùng một đối tượng)
```

**Sơ đồ bộ nhớ**:

```text
┌─────────┐                    ┌──────────────────┐
│ Stack   │                    │ Heap             │
├─────────┤                    ├──────────────────┤
│ obj1 ───┼───────────────────>│ { name: 'Jane' } │
├─────────┤                    │                  │
│ obj2 ───┼───────────────────>│ (cùng đối tượng) │
└─────────┘                    └──────────────────┘
```

## 3. Common Quiz Questions

> Các câu hỏi quiz thường gặp

### Câu hỏi 1: Truyền kiểu nguyên thủy

```javascript
function changeValue(x) {
  x = 100;
  console.log('x trong hàm:', x);
}

let num = 50;
changeValue(num);
console.log('num ngoài hàm:', num);
```

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
// x trong hàm: 100
// num ngoài hàm: 50
```

**Giải thích**:

- `num` là kiểu nguyên thủy (Number)
- Khi truyền vào hàm, **giá trị được sao chép**, `x` và `num` là hai biến độc lập
- Sửa đổi `x` không ảnh hưởng đến `num`

```javascript
// Luồng thực thi
let num = 50; // Stack: num = 50
changeValue(num); // Stack: x = 50 (sao chép)
x = 100; // Stack: x = 100 (chỉ sửa x)
console.log(num); // Stack: num = 50 (không bị ảnh hưởng)
```

</details>

### Câu hỏi 2: Truyền kiểu tham chiếu

```javascript
function changeObject(obj) {
  obj.name = 'Changed';
  console.log('obj.name trong hàm:', obj.name);
}

let person = { name: 'Original' };
changeObject(person);
console.log('person.name ngoài hàm:', person.name);
```

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
// obj.name trong hàm: Changed
// person.name ngoài hàm: Changed
```

**Giải thích**:

- `person` là kiểu tham chiếu (Object)
- Khi truyền vào hàm, **địa chỉ bộ nhớ được sao chép**
- `obj` và `person` trỏ đến **cùng một đối tượng**
- Sửa đổi nội dung đối tượng thông qua `obj` cũng ảnh hưởng đến `person`

```javascript
// Sơ đồ bộ nhớ
let person = { name: 'Original' }; // Heap: tạo đối tượng @0x001
changeObject(person); // Stack: obj = @0x001 (sao chép địa chỉ)
obj.name = 'Changed'; // Heap: @0x001.name = 'Changed'
console.log(person.name); // Heap: @0x001.name (cùng đối tượng)
```

</details>

### Câu hỏi 3: Gán lại vs sửa đổi thuộc tính

```javascript
function test1(obj) {
  obj.name = 'Modified'; // Sửa đổi thuộc tính
}

function test2(obj) {
  obj = { name: 'New Object' }; // Gán lại
}

let person = { name: 'Original' };

test1(person);
console.log('A:', person.name);

test2(person);
console.log('B:', person.name);
```

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
// A: Modified
// B: Modified (không phải 'New Object'!)
```

**Giải thích**:

**test1: Sửa đổi thuộc tính**

```javascript
function test1(obj) {
  obj.name = 'Modified'; // ✅ Sửa đổi thuộc tính của đối tượng gốc
}
// person và obj trỏ đến cùng một đối tượng, nên được sửa đổi
```

**test2: Gán lại**

```javascript
function test2(obj) {
  obj = { name: 'New Object' }; // ❌ Chỉ thay đổi tham chiếu của obj
}
// obj bây giờ trỏ đến đối tượng mới, nhưng person vẫn trỏ đến đối tượng gốc
```

**Sơ đồ bộ nhớ**:

```text
// Trước test1
person ────> { name: 'Original' }
obj    ────> { name: 'Original' } (cùng một)

// Sau test1
person ────> { name: 'Modified' }
obj    ────> { name: 'Modified' } (cùng một)

// Thực thi test2
person ────> { name: 'Modified' }    (không đổi)
obj    ────> { name: 'New Object' }  (đối tượng mới)

// Sau test2
person ────> { name: 'Modified' }    (vẫn không đổi)
// obj bị hủy, đối tượng mới được garbage collector thu hồi
```

</details>

### Câu hỏi 4: Truyền mảng

```javascript
function modifyArray(arr) {
  arr.push(4);
  console.log('1:', arr);
}

function reassignArray(arr) {
  arr = [5, 6, 7];
  console.log('2:', arr);
}

let numbers = [1, 2, 3];
modifyArray(numbers);
console.log('3:', numbers);

reassignArray(numbers);
console.log('4:', numbers);
```

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
// 1: [1, 2, 3, 4]
// 3: [1, 2, 3, 4]
// 2: [5, 6, 7]
// 4: [1, 2, 3, 4]
```

**Giải thích**:

- `modifyArray`: Sửa đổi nội dung mảng gốc, `numbers` bị ảnh hưởng
- `reassignArray`: Chỉ thay đổi tham chiếu của tham số, `numbers` không bị ảnh hưởng

</details>

### Câu hỏi 5: Phép so sánh

```javascript
// So sánh kiểu nguyên thủy
let a = 10;
let b = 10;
console.log('A:', a === b);

// So sánh kiểu tham chiếu
let obj1 = { value: 10 };
let obj2 = { value: 10 };
let obj3 = obj1;
console.log('B:', obj1 === obj2);
console.log('C:', obj1 === obj3);
```

<details>
<summary>Nhấn để xem đáp án</summary>

```javascript
// A: true
// B: false
// C: true
```

**Giải thích**:

**Kiểu nguyên thủy**: So sánh giá trị

```javascript
10 === 10; // true (cùng giá trị)
```

**Kiểu tham chiếu**: So sánh địa chỉ bộ nhớ

```javascript
obj1 === obj2; // false (khác đối tượng, khác địa chỉ)
obj1 === obj3; // true (trỏ đến cùng một đối tượng)
```

**Sơ đồ bộ nhớ**:

```text
obj1 ────> @0x001: { value: 10 }
obj2 ────> @0x002: { value: 10 } (cùng nội dung nhưng khác địa chỉ)
obj3 ────> @0x001: { value: 10 } (cùng địa chỉ với obj1)
```

</details>

## 4. Shallow Copy vs Deep Copy

> Sao chép nông vs Sao chép sâu

### Sao chép nông (Shallow Copy)

**Định nghĩa**: Chỉ sao chép tầng đầu tiên, các đối tượng lồng nhau vẫn là tham chiếu.

#### Phương pháp 1: Toán tử spread (Spread Operator)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = { ...original };

// Sửa đổi tầng đầu tiên: không ảnh hưởng đối tượng gốc
copy.name = 'Jane';
console.log(original.name); // 'John' (không bị ảnh hưởng)

// Sửa đổi đối tượng lồng nhau: ảnh hưởng đối tượng gốc!
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Kaohsiung' (bị ảnh hưởng!)
```

#### Phương pháp 2: Object.assign()

```javascript
const original = { name: 'John', age: 30 };
const copy = Object.assign({}, original);

copy.name = 'Jane';
console.log(original.name); // 'John' (không bị ảnh hưởng)
```

#### Phương pháp 3: Sao chép nông mảng

```javascript
const arr1 = [1, 2, 3];

// Phương pháp 1: Toán tử spread
const arr2 = [...arr1];

// Phương pháp 2: slice()
const arr3 = arr1.slice();

// Phương pháp 3: Array.from()
const arr4 = Array.from(arr1);

arr2[0] = 999;
console.log(arr1[0]); // 1 (không bị ảnh hưởng)
```

### Sao chép sâu (Deep Copy)

**Định nghĩa**: Sao chép hoàn toàn tất cả các tầng, bao gồm đối tượng lồng nhau.

#### Phương pháp 1: JSON.parse + JSON.stringify (phổ biến nhất)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading', 'gaming'],
};

const copy = JSON.parse(JSON.stringify(original));

// Sửa đổi đối tượng lồng nhau: không ảnh hưởng đối tượng gốc
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (không bị ảnh hưởng)

copy.hobbies.push('coding');
console.log(original.hobbies); // ['reading', 'gaming'] (không bị ảnh hưởng)
```

**Hạn chế**:

```javascript
const obj = {
  date: new Date(), // ❌ Sẽ thành chuỗi
  func: () => {}, // ❌ Sẽ bị bỏ qua
  undef: undefined, // ❌ Sẽ bị bỏ qua
  symbol: Symbol('test'), // ❌ Sẽ bị bỏ qua
  regexp: /abc/, // ❌ Sẽ thành {}
  circular: null, // ❌ Tham chiếu vòng sẽ gây lỗi
};
obj.circular = obj; // Tham chiếu vòng

JSON.parse(JSON.stringify(obj)); // Lỗi hoặc mất dữ liệu
```

#### Phương pháp 2: structuredClone() (trình duyệt hiện đại)

```javascript
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  date: new Date(),
};

const copy = structuredClone(original);

// Có thể sao chép chính xác các đối tượng đặc biệt như Date
console.log(copy.date instanceof Date); // true
```

**Ưu điểm**:

- ✅ Hỗ trợ Date, RegExp, Map, Set, v.v.
- ✅ Hỗ trợ tham chiếu vòng
- ✅ Hiệu suất tốt hơn

**Hạn chế**:

- ❌ Không hỗ trợ hàm
- ❌ Không hỗ trợ Symbol

#### Phương pháp 3: Triển khai đệ quy sao chép sâu

```javascript
function deepClone(obj) {
  // Xử lý null và phi đối tượng
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Xử lý mảng
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }

  // Xử lý Date
  if (obj instanceof Date) {
    return new Date(obj);
  }

  // Xử lý RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }

  // Xử lý đối tượng
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Ví dụ sử dụng
const original = {
  name: 'John',
  address: { city: 'Taipei' },
  hobbies: ['reading'],
  date: new Date(),
};

const copy = deepClone(original);
copy.address.city = 'Kaohsiung';
console.log(original.address.city); // 'Taipei' (không bị ảnh hưởng)
```

#### Phương pháp 4: Sử dụng Lodash

```javascript
import _ from 'lodash';

const original = {
  name: 'John',
  address: { city: 'Taipei' },
};

const copy = _.cloneDeep(original);
```

### So sánh sao chép nông vs sao chép sâu

| Đặc điểm           | Sao chép nông       | Sao chép sâu            |
| ------------------- | -------------------- | ------------------------ |
| Mức sao chép        | Chỉ tầng đầu tiên   | Tất cả các tầng         |
| Đối tượng lồng nhau | Vẫn là tham chiếu    | Hoàn toàn độc lập       |
| Hiệu suất           | Nhanh                | Chậm                    |
| Bộ nhớ              | Ít                   | Nhiều                   |
| Trường hợp sử dụng  | Đối tượng đơn giản   | Cấu trúc lồng phức tạp  |

## 5. Common Pitfalls

> Các bẫy thường gặp

### Bẫy 1: Nghĩ rằng truyền tham số có thể thay đổi kiểu nguyên thủy

```javascript
// ❌ Hiểu sai
function increment(num) {
  num = num + 1;
  return num;
}

let count = 5;
increment(count);
console.log(count); // 5 (không trở thành 6!)

// ✅ Cách viết đúng
count = increment(count); // Cần nhận giá trị trả về
console.log(count); // 6
```

### Bẫy 2: Nghĩ rằng gán lại có thể thay đổi đối tượng bên ngoài

```javascript
// ❌ Hiểu sai
function resetObject(obj) {
  obj = { name: 'Reset' }; // Chỉ thay đổi tham chiếu của tham số
}

let person = { name: 'Original' };
resetObject(person);
console.log(person.name); // 'Original' (không được reset!)

// ✅ Cách viết đúng 1: Sửa đổi thuộc tính
function resetObject(obj) {
  obj.name = 'Reset';
}

// ✅ Cách viết đúng 2: Trả về đối tượng mới
function resetObject(obj) {
  return { name: 'Reset' };
}
person = resetObject(person);
```

### Bẫy 3: Nghĩ rằng toán tử spread là sao chép sâu

```javascript
// ❌ Hiểu sai
const original = {
  user: { name: 'John' },
};

const copy = { ...original }; // Sao chép nông!

copy.user.name = 'Jane';
console.log(original.user.name); // 'Jane' (bị ảnh hưởng!)

// ✅ Cách viết đúng: Sao chép sâu
const copy = JSON.parse(JSON.stringify(original));
// hoặc
const copy = structuredClone(original);
```

### Bẫy 4: Hiểu sai về const

```javascript
// const chỉ không cho gán lại, không phải bất biến!

const obj = { name: 'John' };

// ❌ Không thể gán lại
obj = { name: 'Jane' }; // TypeError: Assignment to constant variable

// ✅ Có thể sửa đổi thuộc tính
obj.name = 'Jane'; // Hoạt động bình thường
obj.age = 30; // Hoạt động bình thường

// Nếu muốn thực sự bất biến
const immutableObj = Object.freeze({ name: 'John' });
immutableObj.name = 'Jane'; // Thất bại im lặng (ở chế độ strict sẽ báo lỗi)
console.log(immutableObj.name); // 'John' (không bị sửa đổi)
```

### Bẫy 5: Vấn đề tham chiếu trong vòng lặp

```javascript
// ❌ Lỗi phổ biến
const arr = [];
const obj = { value: 0 };

for (let i = 0; i < 3; i++) {
  obj.value = i;
  arr.push(obj); // Tất cả trỏ đến cùng một đối tượng!
}

console.log(arr);
// [{ value: 2 }, { value: 2 }, { value: 2 }]
// Tất cả đều là cùng một đối tượng, giá trị cuối cùng đều là 2

// ✅ Cách viết đúng: Tạo đối tượng mới mỗi lần
const arr = [];

for (let i = 0; i < 3; i++) {
  arr.push({ value: i }); // Tạo đối tượng mới mỗi lần
}

console.log(arr);
// [{ value: 0 }, { value: 1 }, { value: 2 }]
```

## 6. Best Practices

> Các phương pháp tốt nhất

### ✅ Cách làm khuyến nghị

```javascript
// 1. Khi cần sao chép đối tượng, sử dụng rõ ràng phương pháp sao chép
const original = { name: 'John', age: 30 };

// Sao chép nông (đối tượng đơn giản)
const copy1 = { ...original };

// Sao chép sâu (đối tượng lồng nhau)
const copy2 = structuredClone(original);

// 2. Hàm không nên dựa vào tác dụng phụ để sửa đổi tham số
// ❌ Không tốt
function addItem(arr, item) {
  arr.push(item); // Sửa đổi mảng gốc
}

// ✅ Tốt
function addItem(arr, item) {
  return [...arr, item]; // Trả về mảng mới
}

// 3. Sử dụng const để ngăn gán lại ngoài ý muốn
const config = { theme: 'dark' };
// config = {}; // Sẽ báo lỗi

// 4. Sử dụng Object.freeze khi cần đối tượng bất biến
const constants = Object.freeze({
  PI: 3.14159,
  MAX_SIZE: 100,
});
```

### ❌ Cách làm cần tránh

```javascript
// 1. Không dựa vào truyền tham số để sửa đổi kiểu nguyên thủy
function increment(num) {
  num++; // ❌ Không có tác dụng
}

// 2. Không nhầm lẫn sao chép nông và sao chép sâu
const copy = { ...nested }; // ❌ Tưởng là sao chép sâu

// 3. Không tái sử dụng cùng tham chiếu đối tượng trong vòng lặp
for (let i = 0; i < 3; i++) {
  arr.push(obj); // ❌ Tất cả trỏ đến cùng một đối tượng
}
```

## 7. Interview Summary

> Tóm tắt phỏng vấn

### Ghi nhớ nhanh

**Kiểu nguyên thủy (Primitive)**:

- String, Number, Boolean, Undefined, Null, Symbol, BigInt
- Truyền theo giá trị (Call by Value)
- Lưu trữ trong Stack
- Bất biến (Immutable)

**Kiểu tham chiếu (Reference)**:

- Object, Array, Function, Date, RegExp, v.v.
- Truyền theo tham chiếu (Call by Reference)
- Lưu trữ trong Heap
- Có thể thay đổi (Mutable)

### Ví dụ trả lời phỏng vấn

**Q: JavaScript là Call by Value hay Call by Reference?**

> JavaScript **sử dụng Call by Value cho tất cả các kiểu**, nhưng "giá trị" được truyền cho kiểu tham chiếu là địa chỉ bộ nhớ.
>
> - Kiểu nguyên thủy: Truyền bản sao của giá trị, sửa đổi không ảnh hưởng đến giá trị gốc
> - Kiểu tham chiếu: Truyền bản sao của địa chỉ, thông qua địa chỉ có thể sửa đổi đối tượng gốc
> - Tuy nhiên, nếu gán lại (thay đổi địa chỉ), đối tượng gốc không bị ảnh hưởng

## Reference

- [MDN - Data Structures](https://developer.mozilla.org/vi/docs/Web/JavaScript/Data_structures)
- [MDN - Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN - structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN - Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [Hiểu sâu về JavaScript](https://javascript.info/object-copy)
