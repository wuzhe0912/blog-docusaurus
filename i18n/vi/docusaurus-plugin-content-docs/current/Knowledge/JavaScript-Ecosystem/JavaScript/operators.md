---
id: operators
title: '[Easy] 📄 JavaScript Operators'
slug: /operators
tags: [JavaScript, Quiz, Easy]
---

## 1. What is the difference between `==` and `===` ?

> `==` và `===` khác nhau như thế nào?

Cả hai đều là toán tử so sánh. `==` so sánh xem hai giá trị có bằng nhau không, trong khi `===` so sánh xem hai giá trị có bằng nhau và cùng kiểu dữ liệu hay không. Do đó, toán tử sau có thể được coi là chế độ nghiêm ngặt.

Toán tử đầu tiên, do thiết kế của JavaScript, tự động thực hiện chuyển đổi kiểu, dẫn đến nhiều kết quả không trực quan. Ví dụ:

```js
1 == '1'; // true
1 == [1]; // true
1 == true; // true
0 == ''; // true
0 == '0'; // true
0 == false; // true
```

Điều này tạo ra gánh nặng nhận thức lớn cho các nhà phát triển, vì vậy việc sử dụng `===` thay vì `==` được khuyến nghị phổ biến để tránh các lỗi không mong muốn.

**Thực hành tốt nhất**: Luôn sử dụng `===` và `!==`, trừ khi bạn hiểu rất rõ tại sao cần dùng `==`.

### Câu hỏi phỏng vấn

#### Câu hỏi 1: So sánh kiểu cơ bản

Hãy xác định kết quả của các biểu thức sau:

```javascript
1 == '1'; // ?
1 === '1'; // ?
```

**Đáp án:**

```javascript
1 == '1'; // true
1 === '1'; // false
```

**Giải thích:**

- **`==` (toán tử bằng)**: Thực hiện chuyển đổi kiểu
  - Chuỗi `'1'` được chuyển đổi thành số `1`
  - Sau đó so sánh `1 == 1`, kết quả là `true`
- **`===` (toán tử bằng nghiêm ngặt)**: Không thực hiện chuyển đổi kiểu
  - `number` và `string` là kiểu khác nhau, trả về trực tiếp `false`

**Quy tắc chuyển đổi kiểu:**

```javascript
// Thứ tự ưu tiên chuyển đổi kiểu của ==
// 1. Nếu có number, chuyển đổi phía còn lại thành number
'1' == 1; // '1' → 1, kết quả true
'2' == 2; // '2' → 2, kết quả true
'0' == 0; // '0' → 0, kết quả true

// 2. Nếu có boolean, chuyển đổi boolean thành number
true == 1; // true → 1, kết quả true
false == 0; // false → 0, kết quả true
'1' == true; // '1' → 1, true → 1, kết quả true

// 3. Bẫy khi chuyển đổi chuỗi sang số
'' == 0; // '' → 0, kết quả true
' ' == 0; // ' ' → 0, kết quả true (chuỗi khoảng trắng chuyển thành 0)
```

#### Câu hỏi 2: So sánh null và undefined

Hãy xác định kết quả của các biểu thức sau:

```javascript
undefined == null; // ?
undefined === null; // ?
```

**Đáp án:**

```javascript
undefined == null; // true
undefined === null; // false
```

**Giải thích:**

Đây là **quy tắc đặc biệt** của JavaScript:

- **`undefined == null`**: `true`
  - Đặc tả ES quy định đặc biệt: `null` và `undefined` bằng nhau khi so sánh bằng `==`
  - Đây là tình huống duy nhất mà `==` hữu ích: kiểm tra xem biến có phải là `null` hoặc `undefined` không
- **`undefined === null`**: `false`
  - Chúng là các kiểu khác nhau (`undefined` là kiểu `undefined`, `null` là kiểu `object`)
  - Không bằng nhau trong so sánh nghiêm ngặt

**Ứng dụng thực tế:**

```javascript
// Kiểm tra xem biến có phải là null hoặc undefined không
function isNullOrUndefined(value) {
  return value == null; // Kiểm tra đồng thời null và undefined
}

isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(0); // false
isNullOrUndefined(''); // false

// Tương đương (nhưng ngắn gọn hơn)
function isNullOrUndefined(value) {
  return value === null || value === undefined;
}
```

**Bẫy cần chú ý:**

```javascript
// null và undefined chỉ bằng nhau với nhau
null == undefined; // true
null == 0; // false
null == false; // false
null == ''; // false

undefined == 0; // false
undefined == false; // false
undefined == ''; // false

// Nhưng với ===, chúng chỉ bằng chính mình
null === null; // true
undefined === undefined; // true
null === undefined; // false
```

#### Câu hỏi 3: So sánh tổng hợp

Hãy xác định kết quả của các biểu thức sau:

```javascript
0 == false; // ?
0 === false; // ?
'' == false; // ?
'' === false; // ?
null == false; // ?
undefined == false; // ?
```

**Đáp án:**

```javascript
0 == false; // true (false → 0)
0 === false; // false (kiểu khác nhau: number vs boolean)
'' == false; // true ('' → 0, false → 0)
'' === false; // false (kiểu khác nhau: string vs boolean)
null == false; // false (null chỉ bằng null và undefined)
undefined == false; // false (undefined chỉ bằng null và undefined)
```

**Sơ đồ luồng chuyển đổi:**

```javascript
// Quá trình chuyển đổi của 0 == false
0 == false;
0 == 0; // false được chuyển đổi thành số 0
true; // kết quả

// Quá trình chuyển đổi của '' == false
'' == false;
'' == 0; // false được chuyển đổi thành số 0
0 == 0; // '' được chuyển đổi thành số 0
true; // kết quả

// Trường hợp đặc biệt của null == false
null == false;
// null không được chuyển đổi! Theo đặc tả, null chỉ bằng null và undefined
false; // kết quả
```

#### Câu hỏi 4: So sánh đối tượng

Hãy xác định kết quả của các biểu thức sau:

```javascript
[] == []; // ?
[] === []; // ?
{} == {}; // ?
{} === {}; // ?
```

**Đáp án:**

```javascript
[] == []; // false
[] === []; // false
{} == {}; // false
{} === {}; // false
```

**Giải thích:**

- So sánh đối tượng (bao gồm mảng và đối tượng) là **so sánh tham chiếu**
- Ngay cả khi nội dung giống nhau, nhưng nếu là các thể hiện đối tượng khác nhau thì không bằng nhau
- `==` và `===` hoạt động giống nhau đối với đối tượng (cả hai đều so sánh tham chiếu)

```javascript
// Chỉ bằng nhau khi tham chiếu giống nhau
const arr1 = [];
const arr2 = arr1; // Tham chiếu đến cùng một mảng
arr1 == arr2; // true
arr1 === arr2; // true

// Nội dung giống nhau nhưng là các thể hiện khác nhau
const arr3 = [1, 2, 3];
const arr4 = [1, 2, 3];
arr3 == arr4; // false (tham chiếu khác nhau)
arr3 === arr4; // false (tham chiếu khác nhau)

// Đối tượng cũng tương tự
const obj1 = { name: 'Alice' };
const obj2 = { name: 'Alice' };
obj1 == obj2; // false
obj1 === obj2; // false
```

#### Ghi nhớ nhanh cho phỏng vấn

**Quy tắc chuyển đổi kiểu của `==` (ưu tiên từ trên xuống):**

1. `null == undefined` → `true` (quy tắc đặc biệt)
2. `number == string` → chuyển string thành number
3. `number == boolean` → chuyển boolean thành number
4. `string == boolean` → chuyển cả hai thành number
5. Đối tượng so sánh tham chiếu, không chuyển đổi

**Quy tắc của `===` (đơn giản):**

1. Kiểu khác nhau → `false`
2. Cùng kiểu → so sánh giá trị (kiểu cơ bản) hoặc tham chiếu (kiểu đối tượng)

**Thực hành tốt nhất:**

```javascript
// ✅ Luôn sử dụng ===
if (value === 0) {
}
if (name === 'Alice') {
}

// ✅ Ngoại lệ duy nhất: kiểm tra null/undefined
if (value == null) {
  // value là null hoặc undefined
}

// ❌ Tránh sử dụng == (trừ ngoại lệ trên)
if (value == 0) {
} // không khuyến nghị
if (name == 'Alice') {
} // không khuyến nghị
```

**Ví dụ trả lời phỏng vấn:**

> "`==` thực hiện chuyển đổi kiểu, có thể dẫn đến kết quả không trực quan, ví dụ `0 == '0'` là `true`. `===` là so sánh nghiêm ngặt, không thực hiện chuyển đổi kiểu, nếu kiểu khác nhau thì trả về trực tiếp `false`.
>
> Thực hành tốt nhất là luôn sử dụng `===`, ngoại lệ duy nhất là `value == null` có thể kiểm tra đồng thời `null` và `undefined`.
>
> Đặc biệt chú ý `null == undefined` là `true`, nhưng `null === undefined` là `false`, đây là quy tắc đặc biệt của JavaScript."

---

## 2. What is the difference between `&&` and `||` ? Please explain short-circuit evaluation

> `&&` và `||` khác nhau như thế nào? Hãy giải thích đánh giá ngắn mạch

### Khái niệm cơ bản

- **`&&` (AND)**: Khi bên trái là `falsy`, trả về trực tiếp giá trị bên trái, không thực thi bên phải
- **`||` (OR)**: Khi bên trái là `truthy`, trả về trực tiếp giá trị bên trái, không thực thi bên phải

### Ví dụ đánh giá ngắn mạch

```js
// && đánh giá ngắn mạch
const user = null;
const name = user && user.name; // user là falsy, trả về null trực tiếp, không truy cập user.name
console.log(name); // null (không lỗi)

// || đánh giá ngắn mạch
const defaultName = 'Guest';
const userName = user || defaultName; // user là falsy, trả về defaultName bên phải
console.log(userName); // 'Guest'

// Ứng dụng thực tế
function greet(name) {
  const displayName = name || 'Anonymous'; // Nếu không truyền name, sử dụng giá trị mặc định
  console.log(`Hello, ${displayName}!`);
}

greet('Alice'); // Hello, Alice!
greet(); // Hello, Anonymous!
```

### Bẫy thường gặp ⚠️

```js
// Vấn đề: 0 và '' cũng là falsy
const count = 0;
const result = count || 10; // 0 là falsy, trả về 10
console.log(result); // 10 (có thể không phải kết quả bạn muốn)

// Giải pháp: Sử dụng ?? (Nullish Coalescing)
const betterResult = count ?? 10; // Chỉ trả về 10 cho null/undefined
console.log(betterResult); // 0
```

---

## 3. What is the `?.` (Optional Chaining) operator ?

> Toán tử Optional Chaining `?.` là gì?

### Tình huống vấn đề

Cách viết truyền thống dễ gây lỗi:

```js
const user = {
  name: 'Alice',
  address: {
    city: 'Taipei',
  },
};

// ❌ Nguy hiểm: Nếu address không tồn tại sẽ báo lỗi
console.log(user.address.city); // Bình thường
console.log(otherUser.address.city); // TypeError: Cannot read property 'city' of undefined

// ✅ An toàn nhưng dài dòng
const city = user && user.address && user.address.city;
```

### Sử dụng Optional Chaining

```js
// ✅ Ngắn gọn và an toàn
const city = user?.address?.city; // 'Taipei'
const missingCity = otherUser?.address?.city; // undefined (không báo lỗi)

// Cũng có thể dùng cho gọi phương thức
user?.getName?.(); // Chỉ thực thi nếu getName tồn tại

// Cũng có thể dùng cho mảng
const firstItem = users?.[0]?.name; // Truy cập an toàn tên của người dùng đầu tiên
```

### Ứng dụng thực tế

```js
// Xử lý phản hồi API
function displayUserInfo(response) {
  const userName = response?.data?.user?.name ?? 'Unknown User';
  const email = response?.data?.user?.email ?? 'No email';

  console.log(`User: ${userName}`);
  console.log(`Email: ${email}`);
}

// Thao tác DOM
const buttonText = document.querySelector('.submit-btn')?.textContent;
```

---

## 4. What is the `??` (Nullish Coalescing) operator ?

> Toán tử Nullish Coalescing `??` là gì?

### Sự khác biệt với `||`

```js
// || coi tất cả giá trị falsy là sai
const value1 = 0 || 'default'; // 'default'
const value2 = '' || 'default'; // 'default'
const value3 = false || 'default'; // 'default'

// ?? chỉ coi null và undefined là giá trị rỗng
const value4 = 0 ?? 'default'; // 0
const value5 = '' ?? 'default'; // ''
const value6 = false ?? 'default'; // false
const value7 = null ?? 'default'; // 'default'
const value8 = undefined ?? 'default'; // 'default'
```

### Ứng dụng thực tế

```js
// Xử lý giá trị có thể bằng 0
function updateScore(newScore) {
  // ✅ Đúng: 0 là điểm hợp lệ
  const score = newScore ?? 100; // Nếu là 0 giữ nguyên 0, chỉ dùng 100 cho null/undefined
  return score;
}

updateScore(0); // 0
updateScore(null); // 100
updateScore(undefined); // 100

// Xử lý giá trị cấu hình
const config = {
  timeout: 0, // 0 mili giây là cấu hình hợp lệ
  maxRetries: null,
};

const timeout = config.timeout ?? 3000; // 0 (giữ nguyên cấu hình 0)
const retries = config.maxRetries ?? 3; // 3 (null sử dụng giá trị mặc định)
```

### Sử dụng kết hợp

```js
// ?? và ?. thường được sử dụng cùng nhau
const userAge = user?.profile?.age ?? 18; // Nếu không có dữ liệu tuổi, mặc định 18

// Trường hợp thực tế: Giá trị mặc định của biểu mẫu
function initForm(data) {
  return {
    name: data?.name ?? '',
    age: data?.age ?? 0, // 0 là tuổi hợp lệ
    isActive: data?.isActive ?? true,
  };
}
```

---

## 5. What is the difference between `i++` and `++i` ?

> `i++` và `++i` khác nhau như thế nào?

### Sự khác biệt cơ bản

- **`i++` (hậu tố)**: Trả về giá trị hiện tại trước, sau đó cộng 1
- **`++i` (tiền tố)**: Cộng 1 trước, sau đó trả về giá trị mới

### Ví dụ

```js
let a = 5;
let b = a++; // b = 5, a = 6 (gán cho b trước, rồi tăng)
console.log(a, b); // 6, 5

let c = 5;
let d = ++c; // d = 6, c = 6 (tăng trước, rồi gán cho d)
console.log(c, d); // 6, 6
```

### Ảnh hưởng thực tế

```js
// Trong vòng lặp thường không có sự khác biệt (vì không sử dụng giá trị trả về)
for (let i = 0; i < 5; i++) {} // ✅ Phổ biến
for (let i = 0; i < 5; ++i) {} // ✅ Cũng được, một số người cho rằng nhanh hơn một chút (thực tế không có sự khác biệt trong các engine JS hiện đại)

// Nhưng trong biểu thức có sự khác biệt
let arr = [1, 2, 3];
let i = 0;
console.log(arr[i++]); // 1 (dùng i=0 lấy giá trị trước, rồi i thành 1)
console.log(arr[++i]); // 3 (i thành 2 trước, rồi lấy giá trị)
```

### Thực hành tốt nhất

```js
// ✅ Rõ ràng: viết tách biệt
let count = 0;
const value = arr[count];
count++;

// ⚠️ Không khuyến nghị: dễ nhầm lẫn
const value = arr[count++];
```

---

## 6. What is the Ternary Operator ? When should you use it ?

> Toán tử ba ngôi là gì? Khi nào nên sử dụng?

### Cú pháp cơ bản

```js
condition ? valueIfTrue : valueIfFalse;
```

### Ví dụ đơn giản

```js
// if-else truyền thống
let message;
if (age >= 18) {
  message = 'Adult';
} else {
  message = 'Minor';
}

// ✅ Toán tử ba ngôi: ngắn gọn hơn
const message = age >= 18 ? 'Adult' : 'Minor';
```

### Tình huống phù hợp để sử dụng

```js
// 1. Gán có điều kiện đơn giản
const status = isLoggedIn ? 'Online' : 'Offline';

// 2. Render có điều kiện trong JSX/template
return <div>{isLoading ? <Spinner /> : <Content />}</div>;

// 3. Đặt giá trị mặc định (kết hợp với các toán tử khác)
const displayName = user?.name ?? 'Guest';
const greeting = isVIP ? `Welcome, ${displayName}!` : `Hello, ${displayName}`;

// 4. Giá trị trả về của hàm
function getDiscount(isMember) {
  return isMember ? 0.2 : 0;
}
```

### Tình huống nên tránh sử dụng

```js
// ❌ Lồng nhau quá sâu, khó đọc
const result = condition1
  ? value1
  : condition2
  ? value2
  : condition3
  ? value3
  : value4;

// ✅ Sử dụng if-else hoặc switch rõ ràng hơn
let result;
if (condition1) result = value1;
else if (condition2) result = value2;
else if (condition3) result = value3;
else result = value4;

// ❌ Logic phức tạp
const canAccess =
  user?.role === 'admin'
    ? true
    : user?.permissions?.includes('read')
    ? true
    : false;

// ✅ Tách thành nhiều dòng
const isAdmin = user?.role === 'admin';
const hasReadPermission = user?.permissions?.includes('read');
const canAccess = isAdmin || hasReadPermission;
```

---

## Thẻ ghi nhớ nhanh

| Toán tử       | Công dụng            | Điểm ghi nhớ                                |
| ------------- | -------------------- | -------------------------------------------- |
| `===`         | Bằng nghiêm ngặt    | Luôn dùng cái này, quên `==` đi             |
| `&&`          | Ngắn mạch AND        | Trái sai thì dừng, trả giá trị sai          |
| `\|\|`        | Ngắn mạch OR         | Trái đúng thì dừng, trả giá trị đúng        |
| `?.`          | Optional Chaining    | Truy cập an toàn, không lỗi                 |
| `??`          | Nullish Coalescing   | Chỉ xử lý null/undefined                    |
| `++i` / `i++` | Tự tăng             | Tiền tố tăng trước, hậu tố tăng sau         |
| `? :`         | Toán tử ba ngôi      | Dùng cho điều kiện đơn giản, tránh lồng nhau |

## Reference

- [MDN - Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript Equality Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [Nullish Coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
