---
id: closure
title: '[Hard] 📄 Closure'
slug: /closure
tags: [JavaScript, Quiz, Hard]
---

## 1. What is Closure ?

> Closure là gì?

Để hiểu closure, trước tiên cần nắm rõ phạm vi biến (variable scope) trong JavaScript và cách function truy cập các biến bên ngoài.

### Variable Scope (Phạm vi biến)

Trong JavaScript, phạm vi biến được chia thành hai loại: global scope và function scope.

```js
// global scope
let a = 1;

function parentFunction() {
  // function scope
  let b = 2;

  function childFunction() {
    let c = 3;
    console.log(a, b, c); // print 1 2 3, can access global scope & function scope
  }

  childFunction();
}

parentFunction();
console.log(a); // print 1, can access global scope
console.log(b, c); // Phát sinh lỗi, không thể truy cập biến trong function scope
```

### Closure example

Điều kiện kích hoạt Closure là có một hàm con được định nghĩa bên trong hàm cha và được trả về thông qua return, nhằm bảo toàn các biến môi trường trong hàm con (tức là né tránh `Garbage Collection`).

```js
function parentFunction() {
  let count = 0;

  return function childFunction() {
    count += 1;
    console.log(`Số đếm hiện tại: ${count}`);
  };
}

const counter = parentFunction();

counter(); // print Số đếm hiện tại: 1
counter(); // print Số đếm hiện tại: 2
// Biến count không bị thu hồi, vì childFunction vẫn tồn tại và mỗi lần gọi đều cập nhật giá trị của count
```

Tuy nhiên cần lưu ý, vì closure sẽ lưu giữ biến trong bộ nhớ, nên nếu có quá nhiều biến sẽ dẫn đến chiếm dụng bộ nhớ quá lớn (không được lạm dụng closure), từ đó ảnh hưởng đến hiệu suất.

## 2. Create a function that meets the following conditions

> Tạo function thỏa mãn các điều kiện dưới đây (sử dụng khái niệm closure để xử lý)

```js
plus(2, 5); // output 7
plus(2)(5); // output 7
```

### First Solution : two functions

Tách thành hai function để xử lý

```js
function plus(value, subValue) {
  return value + subValue;
}

console.log(plus(2, 5));
```

```js
// use closure save variable

function plus(value) {
  return function (subValue) {
    return value + subValue;
  };
}

console.log(plus(2)(5));
```

### Second Solution : single function

Tất nhiên cách giải đầu tiên có xác suất bị reject không nhỏ, nên cần thử gộp vào cùng một function.

```js
function plus(value, subValue) {
  // Dựa vào số lượng tham số truyền vào mỗi lần để phán đoán
  if (arguments.length > 1) {
    return value + subValue;
  } else {
    return function (item) {
      return value + item;
    };
  }
}

console.log(plus(2, 5));
console.log(plus(2)(5));
```

## 3. Please take advantage of the closure feature to increase the number

> Hãy tận dụng đặc tính của closure để tăng dần số

```js
function plus() {
  // code
}

var obj = plus();
obj.add(); // print 1
obj.add(); // print 2
```

### First Solution : return variable

Ở đây không sử dụng Arrow Function, mà dùng dạng function thông thường.

```js
function plus() {
  let cash = 0;
  let counter = {
    add() {
      cash += 1;
      console.log(cash);
    },
  };
  return counter;
}

var obj = plus();
obj.add();
obj.add();
```

### Second Solution : return object

Trong cách giải trước, cũng có thể đặt trực tiếp object bên trong return

```js
function plus() {
  let cash = 0;
  return {
    add: function () {
      cash += 1;
      console.log(cash);
    },
  };
}

var obj = plus();
obj.add();
obj.add();
```

## 4. What will be printed in this nested function call?

> Lời gọi hàm lồng nhau này sẽ in ra gì?

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

a(b(c));
```

### Phân tích

**Kết quả thực thi**:

```
hello
TypeError: aa is not a function
```

### Luồng thực thi chi tiết

```js
// Thực thi a(b(c))
// JavaScript thực thi hàm từ trong ra ngoài

// Bước 1: Thực thi hàm trong cùng b(c)
b(c)
  ↓
// Hàm c được truyền vào b như tham số
// Bên trong hàm b thực thi bb(), tức là c()
c() // In ra 'hello'
  ↓
// Hàm b không có câu lệnh return
// Nên trả về undefined
return undefined

// Bước 2: Thực thi a(undefined)
a(undefined)
  ↓
// undefined được truyền vào a như tham số
// Bên trong hàm a cố gắng thực thi aa()
// Tức là undefined()
undefined() // ❌ Lỗi: TypeError: aa is not a function
```

### Tại sao lại như vậy?

#### 1. Thứ tự thực thi hàm (từ trong ra ngoài)

```js
// Ví dụ
console.log(add(multiply(2, 3)));
           ↑    ↑
           |    └─ 2. Thực thi multiply(2, 3) trước → 6
           └────── 3. Sau đó thực thi add(6)

// Cùng khái niệm
a(b(c))
  ↑ ↑
  | └─ 1. Thực thi b(c) trước
  └─── 2. Sau đó thực thi a(kết quả của b(c))
```

#### 2. Hàm không có return sẽ trả về undefined

```js
function b(bb) {
  bb(); // Đã thực thi, nhưng không có return
} // Ngầm định return undefined

// Tương đương với
function b(bb) {
  bb();
  return undefined; // JavaScript tự động thêm vào
}
```

#### 3. Cố gắng gọi thứ không phải function sẽ báo lỗi

```js
const notAFunction = undefined;
notAFunction(); // TypeError: notAFunction is not a function

// Các trường hợp khác cũng báo lỗi
null(); // TypeError
123(); // TypeError
'string'(); // TypeError
```

### Cách sửa?

#### Cách 1: Cho hàm b trả về một function

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
  return function () {
    console.log('b executed');
  };
}

function c() {
  console.log('hello');
}

a(b(c));
// Kết quả:
// hello
// b executed
```

#### Cách 2: Truyền trực tiếp function, không thực thi trước

```js
function a(aa) {
  aa();
}

function b(bb) {
  return function () {
    bb();
  };
}

function c() {
  console.log('hello');
}

a(b(c)); // Chỉ in ra 'hello'

// Hoặc viết như thế này
a(() => b(c)); // In ra 'hello'
```

#### Cách 3: Thay đổi logic thực thi

```js
function a(aa) {
  aa();
}

function b(bb) {
  bb();
}

function c() {
  console.log('hello');
}

// Thực thi riêng biệt
b(c); // In ra 'hello'
a(() => console.log('a executed')); // In ra 'a executed'
```

### Câu hỏi liên quan

#### Câu hỏi 1: Nếu đổi thành như thế này thì sao?

```js
function a(aa) {
  return aa();
}

function b(bb) {
  return bb();
}

function c() {
  console.log('hello');
  return 'world';
}

console.log(a(b(c)));
```

<details>
<summary>Nhấn để xem đáp án</summary>

```
hello
TypeError: aa is not a function
```

**Phân tích**:

1. `b(c)` → Thực thi `c()`, in ra `'hello'`, trả về `'world'`
2. `a('world')` → Thực thi `'world'()`... khoan, cái này vẫn báo lỗi!

**Đáp án đúng**:

```
hello
TypeError: aa is not a function
```

Vì `b(c)` trả về `'world'` (chuỗi), `a('world')` cố gắng thực thi `'world'()`, chuỗi không phải là function, nên báo lỗi.

</details>

#### Câu hỏi 2: Nếu tất cả đều có return thì sao?

```js
function a(aa) {
  return aa;
}

function b(bb) {
  return bb;
}

function c() {
  return 'hello';
}

const result = a(b(c));
console.log(result);
console.log(result());
```

<details>
<summary>Nhấn để xem đáp án</summary>

```
[Function: c]
hello
```

**Phân tích**:

1. `b(c)` → Trả về chính hàm `c` (không thực thi)
2. `a(c)` → Trả về chính hàm `c`
3. `result` là hàm `c`
4. `result()` → Thực thi `c()`, trả về `'hello'`

</details>

### Điểm ghi nhớ

```javascript
// Ưu tiên gọi hàm
a(b(c))
  ↓
// 1. Thực thi hàm trong cùng trước
b(c) // Nếu b không có return thì là undefined
  ↓
// 2. Sau đó thực thi hàm ngoài
a(undefined) // Cố gắng thực thi undefined() sẽ báo lỗi

// Cách giải quyết
// ✅ 1. Đảm bảo hàm trung gian có trả về function
// ✅ 2. Hoặc sử dụng arrow function để bọc lại
a(() => b(c))
```

## Reference

- [Closures](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Closures)
- [Day6 [JavaScript Cơ bản] Cơ chế thu gom rác](https://ithelp.ithome.com.tw/articles/10214185)
- [MDN - Quản lý bộ nhớ JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- [MDN - Functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Functions)
- [MDN - TypeError](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/TypeError)
