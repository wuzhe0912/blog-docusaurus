---
id: hoisting
title: '[Medium] 📄 Hoisting'
slug: /hoisting
tags: [JavaScript, Quiz, Medium]
---

## 1. What's Hoisting ?

Quá trình thực thi JS có thể được chia thành hai giai đoạn: giai đoạn tạo và giai đoạn thực thi:

```js
var name = 'Pitt';
console.log(name); // print Pitt
```

Với đặc tính Hoisting, đoạn code trên cần được hiểu là: trước tiên khai báo biến, sau đó mới thực hiện gán giá trị.

```js
// create
var name;

// execute
name = 'Pitt';
console.log(name);
```

Còn function thì khác với biến, nó được gán vào bộ nhớ ngay trong giai đoạn tạo. Khai báo hàm như sau:

```js
getName();

function getName() {
  console.log('string'); // print string
}
```

Đoạn code trên có thể chạy bình thường và in ra console.log mà không báo lỗi là nhờ logic sau: function được đưa lên trên cùng trước, sau đó mới thực hiện lệnh gọi function.

```js
// create
function getName() {
  console.log('string');
}

// execute
getName();
```

Tuy nhiên cần lưu ý rằng, với đặc tính Hoisting này, khi sử dụng biểu thức cần chú ý đến thứ tự viết code.

Trong giai đoạn tạo, function được ưu tiên cao nhất, tiếp theo mới là biến.

### Correct

```js
name = 'Yumy';
console.log(name); // print Yumy
var name;

// --- Equal to ---

// create
var name;

// execute
name = 'Yumy';
console.log(name); // print Yumy
```

### Wrong

```js
console.log(name); // print undefined
var name = 'Jane';

// --- Equal to ---

// create
var name;

// execute
console.log(name); // print undefined，vì chưa được gán giá trị, chỉ nhận được undefined mặc định
name = 'Pitt';
```

## 2. What's `name` printed ?

```js
whoseName();

function whoseName() {
  if (name) {
    name = 'Nini';
  }
}

var name = 'Pitt';
console.log(name);
```

### Answer

```js
// create
function whoseName() {
  if (name) {
    name = 'Nini';
  }
}
var name;

// execute
whoseName();
name = 'Pitt';
console.log(name); // print Pitt
```

name trong `whoseName()` nhận được undefined nên không đi vào điều kiện.

Tuy nhiên, vì phía dưới khai báo hàm còn có một phép gán nữa, nên dù có vào điều kiện trong function đi chăng nữa, kết quả cuối cùng vẫn sẽ in ra Pitt.

---

## 3. Khai báo hàm vs Khai báo biến: Thứ tự ưu tiên Hoisting

### Đề bài: Hàm và biến cùng tên

Hãy xác định kết quả đầu ra của đoạn code sau:

```js
console.log(foo);
var foo = '1';
function foo() {}
```

### Đáp án sai (hiểu nhầm phổ biến)

Nhiều người nghĩ rằng:

- Xuất ra `undefined` (cho rằng var được đưa lên trước)
- Xuất ra `'1'` (cho rằng phép gán có ảnh hưởng)
- Báo lỗi (cho rằng trùng tên sẽ xung đột)

### Kết quả thực tế

```js
[Function: foo]
```

### Tại sao?

Câu hỏi này kiểm tra **quy tắc ưu tiên** của Hoisting:

**Thứ tự ưu tiên Hoisting: Khai báo hàm > Khai báo biến**

```js
// Mã nguồn gốc
console.log(foo);
var foo = '1';
function foo() {}

// Tương đương với (sau khi Hoisting)
// Giai đoạn 1: Giai đoạn tạo (Hoisting)
function foo() {} // 1. Khai báo hàm được hoisting trước
var foo; // 2. Khai báo biến được hoisting (nhưng không ghi đè hàm đã tồn tại)

// Giai đoạn 2: Giai đoạn thực thi
console.log(foo); // Lúc này foo là hàm, xuất ra [Function: foo]
foo = '1'; // 3. Gán biến (ghi đè hàm)
```

### Khái niệm then chốt

**1. Khai báo hàm được đưa lên hoàn toàn**

```js
console.log(myFunc); // [Function: myFunc]

function myFunc() {
  return 'Hello';
}
```

**2. Khai báo biến var chỉ đưa lên phần khai báo, không đưa lên phần gán giá trị**

```js
console.log(myVar); // undefined

var myVar = 'Hello';
```

**3. Khi khai báo hàm và khai báo biến cùng tên**

```js
// Thứ tự sau khi hoisting
function foo() {} // Hàm được hoisting và gán giá trị trước
var foo; // Khai báo biến được hoisting, nhưng không ghi đè hàm đã tồn tại

// Do đó foo là hàm
console.log(foo); // [Function: foo]
```

### Luồng thực thi đầy đủ

```js
// Mã nguồn gốc
console.log(foo); // ?
var foo = '1';
function foo() {}
console.log(foo); // ?

// ======== Tương đương với ========

// Giai đoạn tạo (Hoisting)
function foo() {} // 1️⃣ Khai báo hàm được hoisting (hoisting toàn bộ, bao gồm thân hàm)
var foo; // 2️⃣ Khai báo biến được hoisting (nhưng không ghi đè foo, vì đã là hàm rồi)

// Giai đoạn thực thi
console.log(foo); // [Function: foo] - foo là hàm
foo = '1'; // 3️⃣ Gán biến (lúc này mới ghi đè hàm)
console.log(foo); // '1' - foo trở thành chuỗi
```

### Bài tập nâng cao

#### Bài tập A: Ảnh hưởng của thứ tự

```js
console.log(foo); // ?
function foo() {}
var foo = '1';
console.log(foo); // ?
```

**Đáp án:**

```js
[Function: foo] // Lần xuất đầu tiên
'1' // Lần xuất thứ hai
```

**Lý do:** Thứ tự code không ảnh hưởng đến kết quả Hoisting. Thứ tự ưu tiên đưa lên vẫn là: hàm > biến.

#### Bài tập B: Nhiều hàm cùng tên

```js
console.log(foo); // ?

function foo() {
  return 1;
}

var foo = '1';

function foo() {
  return 2;
}

console.log(foo); // ?
```

**Đáp án:**

```js
[Function: foo] { return 2; } // Lần xuất đầu tiên (hàm sau ghi đè hàm trước)
'1' // Lần xuất thứ hai (gán biến ghi đè hàm)
```

**Lý do:**

```js
// Sau khi hoisting
function foo() {
  return 1;
} // Hàm thứ nhất

function foo() {
  return 2;
} // Hàm thứ hai ghi đè hàm thứ nhất

var foo; // Khai báo biến (không ghi đè hàm)

console.log(foo); // [Function: foo] { return 2; }
foo = '1'; // Gán biến (ghi đè hàm)
console.log(foo); // '1'
```

#### Bài tập C: Biểu thức hàm vs Khai báo hàm

```js
console.log(foo); // ?
console.log(bar); // ?

var foo = function () {
  return 1;
};

function bar() {
  return 2;
}
```

**Đáp án:**

```js
undefined; // foo là undefined
[Function: bar] // bar là hàm
```

**Lý do:**

```js
// Sau khi hoisting
var foo; // Khai báo biến được hoisting (biểu thức hàm chỉ hoisting tên biến)
function bar() {
  return 2;
} // Khai báo hàm được hoisting toàn bộ

console.log(foo); // undefined
console.log(bar); // [Function: bar]

foo = function () {
  return 1;
}; // Gán biểu thức hàm
```

**Điểm khác biệt then chốt:**

- **Khai báo hàm**: `function foo() {}` → được đưa lên hoàn toàn (bao gồm thân hàm)
- **Biểu thức hàm**: `var foo = function() {}` → chỉ tên biến được đưa lên, thân hàm không được đưa lên

### let/const không gặp vấn đề này

```js
// ❌ var có vấn đề hoisting
console.log(foo); // undefined
var foo = '1';

// ✅ let/const có TDZ (Vùng chết tạm thời)
console.log(bar); // ReferenceError: Cannot access 'bar' before initialization
let bar = '1';

// ✅ let/const trùng tên với hàm sẽ báo lỗi
function baz() {} // SyntaxError: Identifier 'baz' has already been declared
let baz = '1';
```

### Tổng kết thứ tự ưu tiên Hoisting

```
Thứ tự ưu tiên Hoisting (từ cao đến thấp):

1. Khai báo hàm (Function Declaration)
   ├─ function foo() {} ✅ được đưa lên hoàn toàn
   └─ ưu tiên cao nhất

2. Khai báo biến (Variable Declaration)
   ├─ var foo ⚠️ chỉ đưa lên phần khai báo, không đưa lên phần gán
   └─ không ghi đè hàm đã tồn tại

3. Gán giá trị biến (Variable Assignment)
   ├─ foo = '1' ✅ sẽ ghi đè hàm
   └─ xảy ra trong giai đoạn thực thi

4. Biểu thức hàm (Function Expression)
   ├─ var foo = function() {} ⚠️ được coi là gán giá trị biến
   └─ chỉ tên biến được đưa lên, thân hàm không được đưa lên
```

### Trọng điểm phỏng vấn

Khi trả lời loại câu hỏi này, nên:

1. **Giải thích cơ chế Hoisting**: Chia thành giai đoạn tạo và giai đoạn thực thi
2. **Nhấn mạnh thứ tự ưu tiên**: Khai báo hàm > Khai báo biến
3. **Vẽ ra code sau khi Hoisting**: Cho người phỏng vấn thấy sự hiểu biết của bạn
4. **Đề cập đến best practice**: Sử dụng let/const, tránh vấn đề Hoisting của var

**Ví dụ trả lời phỏng vấn:**

> "Câu hỏi này kiểm tra thứ tự ưu tiên của Hoisting. Trong JavaScript, khai báo hàm có thứ tự ưu tiên đưa lên cao hơn khai báo biến.
>
> Quá trình thực thi chia thành hai giai đoạn:
>
> 1. Giai đoạn tạo: `function foo() {}` được đưa lên hoàn toàn lên trên cùng, tiếp theo khai báo `var foo` được đưa lên nhưng không ghi đè hàm đã tồn tại.
> 2. Giai đoạn thực thi: Tại `console.log(foo)`, lúc này foo là hàm nên xuất ra `[Function: foo]`. Sau đó `foo = '1'` mới ghi đè foo thành chuỗi.
>
> Best practice là sử dụng `let`/`const` thay thế `var`, và đặt khai báo hàm lên trên cùng để tránh loại nhầm lẫn này."

---

## Chủ đề liên quan

- [Sự khác biệt giữa var, let, const](/docs/let-var-const-differences)
