---
id: let-var-const-differences
title: '[Medium] 📄 var, let, const'
slug: /let-var-const-differences
tags: [JavaScript, Quiz, Medium]
---

## Tổng quan

Trong JavaScript có ba từ khóa để khai báo biến: `var`, `let` và `const`. Mặc dù chúng đều dùng để khai báo biến, nhưng chúng khác nhau về phạm vi, khởi tạo, khai báo trùng lặp, gán lại và thời điểm truy cập.

## Những khác biệt chính

| Hành vi              | `var`                       | `let`                | `const`              |
| -------------------- | --------------------------- | -------------------- | -------------------- |
| Phạm vi              | Hàm hoặc toàn cục           | Khối                 | Khối                 |
| Khởi tạo             | Tùy chọn                    | Tùy chọn             | Bắt buộc             |
| Khai báo trùng lặp   | Cho phép                    | Không cho phép       | Không cho phép       |
| Gán lại              | Cho phép                    | Cho phép             | Không cho phép       |
| Truy cập trước khai báo | Trả về undefined         | Ném ReferenceError   | Ném ReferenceError   |

## Giải thích chi tiết

### Phạm vi

Phạm vi của `var` là phạm vi hàm hoặc toàn cục, trong khi `let` và `const` có phạm vi khối (bao gồm hàm, khối if-else hoặc vòng lặp for).

```javascript
function scopeExample() {
  var varVariable = 'var';
  let letVariable = 'let';
  const constVariable = 'const';

  console.log(varVariable); // 'var'
  console.log(letVariable); // 'let'
  console.log(constVariable); // 'const'
}

scopeExample();

console.log(varVariable); // ReferenceError: varVariable is not defined
console.log(letVariable); // ReferenceError: letVariable is not defined
console.log(constVariable); // ReferenceError: constVariable is not defined

if (true) {
  var varInBlock = 'var in block';
  let letInBlock = 'let in block';
  const constInBlock = 'const in block';
}

console.log(varInBlock); // 'var in block'
console.log(letInBlock); // ReferenceError: letInBlock is not defined
console.log(constInBlock); // ReferenceError: constInBlock is not defined
```

### Khởi tạo

`var` và `let` có thể khai báo mà không cần khởi tạo, trong khi `const` bắt buộc phải khởi tạo khi khai báo.

```javascript
var varVariable;  // Hợp lệ
let letVariable;  // Hợp lệ
const constVariable;  // SyntaxError: Missing initializer in const declaration
```

### Khai báo trùng lặp

Trong cùng một phạm vi, `var` cho phép khai báo trùng lặp cùng một biến, trong khi `let` và `const` không cho phép.

```javascript
var x = 1;
var x = 2; // Hợp lệ, x bây giờ bằng 2

let y = 1;
let y = 2; // SyntaxError: Identifier 'y' has already been declared

const z = 1;
const z = 2; // SyntaxError: Identifier 'z' has already been declared
```

### Gán lại

Biến được khai báo với `var` và `let` có thể gán lại, nhưng biến khai báo với `const` không thể gán lại.

```javascript
var x = 1;
x = 2; // Hợp lệ

let y = 1;
y = 2; // Hợp lệ

const z = 1;
z = 2; // TypeError: Assignment to a constant variable
```

Lưu ý: Mặc dù biến khai báo với `const` không thể gán lại, nhưng nếu nó là một object hoặc array, nội dung của nó vẫn có thể thay đổi.

```javascript
const obj = { key: 'value' };
obj.key = 'new value'; // Hợp lệ
console.log(obj); // { key: 'new value' }

const arr = [1, 2, 3];
arr.push(4); // Hợp lệ
console.log(arr); // [1, 2, 3, 4]
```

### Truy cập trước khai báo (Temporal Dead Zone)

Biến khai báo với `var` được đưa lên và tự động khởi tạo thành `undefined`. Biến khai báo với `let` và `const` cũng được đưa lên nhưng không được khởi tạo, truy cập trước khai báo sẽ ném `ReferenceError`.

```javascript
console.log(x); // undefined
var x = 5;

console.log(y); // ReferenceError: Cannot access 'y' before initialization
let y = 5;

console.log(z); // ReferenceError: Cannot access 'z' before initialization
const z = 5;
```

## Câu hỏi phỏng vấn

### Đề bài: Bẫy cổ điển của setTimeout + var

Hãy xác định kết quả đầu ra của đoạn code sau:

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
```

#### Đáp án sai (hiểu nhầm phổ biến)

Nhiều người cho rằng đầu ra là: `1 2 3 4 5`

#### Kết quả thực tế

```
6
6
6
6
6
```

#### Tại sao?

Vấn đề này liên quan đến ba khái niệm cốt lõi:

**1. Phạm vi hàm của var**

```javascript
// var không tạo phạm vi khối trong vòng lặp
for (var i = 1; i <= 5; i++) {
  // i nằm ở phạm vi ngoài, tất cả các lần lặp đều chia sẻ cùng một i
}
console.log(i); // 6 (giá trị của i sau khi vòng lặp kết thúc)

// Trường hợp var
{
  var i;
  i = 1;
  i = 2;
  i = 3;
  i = 4; // vòng lặp kết thúc
}
```

**2. Thực thi bất đồng bộ của setTimeout**

```javascript
// setTimeout là bất đồng bộ, thực thi sau khi code đồng bộ hiện tại chạy xong
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    // Code này được đặt vào hàng đợi tác vụ của Event Loop
    console.log(i);
  }, 0);
}
// Vòng lặp chạy xong trước (i trở thành 6), sau đó các callback của setTimeout mới bắt đầu thực thi
```

**3. Tham chiếu Closure**

```javascript
// Tất cả các hàm callback của setTimeout đều tham chiếu cùng một i
// Khi các callback thực thi, i đã trở thành 6
```

#### Giải pháp

**Giải pháp 1: Sử dụng let (khuyên dùng) ★**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// Đầu ra: 1 2 3 4 5

// Trường hợp let
{
  let i = 1; // i của lần lặp thứ nhất
}
{
  let i = 2; // i của lần lặp thứ hai
}
{
  let i = 3; // i của lần lặp thứ ba
}
```

**Nguyên lý**: `let` tạo một phạm vi khối mới ở mỗi lần lặp, mỗi callback `setTimeout` bắt được giá trị `i` của lần lặp hiện tại.

```javascript
// Tương đương với
{
  let i = 1;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
{
  let i = 2;
  setTimeout(function () {
    console.log(i);
  }, 0);
}
// ... tương tự
```

**Giải pháp 2: Sử dụng IIFE (Hàm Thực Thi Ngay Lập Tức)**

```javascript
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j);
    }, 0);
  })(i);
}
// Đầu ra: 1 2 3 4 5
```

**Nguyên lý**: IIFE tạo một phạm vi hàm mới, mỗi lần lặp đều truyền giá trị `i` hiện tại làm tham số `j`, hình thành Closure.

**Giải pháp 3: Sử dụng tham số thứ ba của setTimeout**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    },
    0,
    i
  ); // Tham số thứ ba được truyền cho hàm callback
}
// Đầu ra: 1 2 3 4 5
```

**Nguyên lý**: Tham số thứ ba và các tham số tiếp theo của `setTimeout` được truyền làm đối số cho hàm callback.

**Giải pháp 4: Sử dụng bind**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(
    function (j) {
      console.log(j);
    }.bind(null, i),
    0
  );
}
// Đầu ra: 1 2 3 4 5
```

**Nguyên lý**: `bind` tạo một hàm mới và ràng buộc giá trị `i` hiện tại làm tham số.

#### So sánh các giải pháp

| Giải pháp           | Ưu điểm                          | Nhược điểm           | Mức khuyên dùng           |
| ------------------- | -------------------------------- | -------------------- | ------------------------- |
| `let`               | Gọn, hiện đại, dễ hiểu           | ES6+                 | 5/5 Rất khuyên dùng       |
| IIFE                | Tương thích tốt                  | Cú pháp phức tạp     | 3/5 Có thể xem xét        |
| Tham số setTimeout  | Đơn giản, trực tiếp              | Ít người biết        | 4/5 Khuyên dùng            |
| `bind`              | Phong cách hàm                   | Đọc hơi khó hơn      | 3/5 Có thể xem xét        |

#### Câu hỏi mở rộng

**Q1: Nếu đổi thành thế này thì sao?**

```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
```

**Đáp án**: Mỗi giây xuất ra `6` một lần, tổng cộng 5 lần (lần lượt tại giây thứ 1, 2, 3, 4, 5).

**Q2: Nếu muốn xuất ra 1, 2, 3, 4, 5 theo thứ tự mỗi giây thì sao?**

```javascript
for (let i = 1; i <= 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
// Sau 1 giây xuất ra 1
// Sau 2 giây xuất ra 2
// Sau 3 giây xuất ra 3
// Sau 4 giây xuất ra 4
// Sau 5 giây xuất ra 5
```

#### Trọng điểm phỏng vấn

Câu hỏi này kiểm tra:

1. **Phạm vi của var**: Phạm vi hàm vs phạm vi khối
2. **Event Loop**: Thực thi đồng bộ vs bất đồng bộ
3. **Closure**: Hàm bắt biến bên ngoài như thế nào
4. **Giải pháp**: Nhiều cách giải và so sánh ưu nhược điểm

Khi trả lời nên:

- Nói đáp án đúng trước (6 6 6 6 6)
- Giải thích lý do (phạm vi var + setTimeout bất đồng bộ)
- Đưa ra giải pháp (ưu tiên let và giải thích các phương án khác)
- Thể hiện sự hiểu biết về cơ chế bên trong của JavaScript

## Best practice

1. Ưu tiên sử dụng `const`: Với những biến không cần gán lại, sử dụng `const` giúp tăng khả năng đọc và bảo trì code.
2. Tiếp theo sử dụng `let`: Khi cần gán lại giá trị, sử dụng `let`.
3. Tránh sử dụng `var`: Vì phạm vi và hành vi Hoisting của `var` có thể gây ra vấn đề không mong muốn, khuyến nghị tránh sử dụng trong phát triển JavaScript hiện đại.
4. Chú ý tương thích trình duyệt: Nếu cần hỗ trợ các trình duyệt cũ, có thể sử dụng các công cụ như Babel để transpile `let` và `const` thành `var`.

## Chủ đề liên quan

- [Closure](/docs/closure)
- [Event Loop](/docs/event-loop)
- [Hoisting](/docs/hoisting)
