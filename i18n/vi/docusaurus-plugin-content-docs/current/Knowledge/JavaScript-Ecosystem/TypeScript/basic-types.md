---
id: basic-types
title: '[Easy] Các kiểu dữ liệu cơ bản và chú thích kiểu'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> Các kiểu dữ liệu cơ bản của TypeScript là gì?

TypeScript cung cấp nhiều kiểu dữ liệu cơ bản để định nghĩa kiểu cho biến, tham số hàm và giá trị trả về.

### Các kiểu cơ bản

```typescript
// 1. number: số (số nguyên, số thực)
let age: number = 30;
let price: number = 99.99;

// 2. string: chuỗi ký tự
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean: giá trị boolean
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null: giá trị rỗng
let data: null = null;

// 5. undefined: chưa định nghĩa
let value: undefined = undefined;

// 6. void: không có giá trị trả về (chủ yếu dùng cho hàm)
function logMessage(): void {
  console.log('Hello');
}

// 7. any: kiểu bất kỳ (nên tránh sử dụng)
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown: kiểu chưa biết (an toàn hơn any)
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ Lỗi: cần kiểm tra kiểu trước

// 9. never: giá trị không bao giờ xảy ra (cho hàm không bao giờ trả về)
function throwError(): never {
  throw new Error('Error');
}

// 10. object: đối tượng (ít dùng, khuyên dùng interface)
let user: object = { name: 'John' };

// 11. array: mảng
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple: tuple (mảng có độ dài và kiểu cố định)
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> Chú thích kiểu vs Suy luận kiểu

### Chú thích kiểu (Type Annotations)

**Định nghĩa**: Chỉ định rõ ràng kiểu của biến.

```typescript
// Chỉ định kiểu rõ ràng
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// Tham số hàm và giá trị trả về
function add(a: number, b: number): number {
  return a + b;
}
```

### Suy luận kiểu (Type Inference)

**Định nghĩa**: TypeScript tự động suy luận kiểu dựa trên giá trị khởi tạo.

```typescript
// TypeScript tự động suy luận là number
let age = 30;        // age: number

// TypeScript tự động suy luận là string
let name = 'John';   // name: string

// TypeScript tự động suy luận là boolean
let isActive = true;  // isActive: boolean

// Giá trị trả về của hàm cũng được tự động suy luận
function add(a: number, b: number) {
  return a + b;  // Tự động suy luận giá trị trả về là number
}
```

### Khi nào nên sử dụng chú thích kiểu

**Các trường hợp cần chỉ định kiểu rõ ràng**:

```typescript
// 1. Khai báo biến mà không có giá trị khởi tạo
let value: number;
value = 10;

// 2. Tham số hàm (bắt buộc chỉ định)
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. Giá trị trả về của hàm (khuyên chỉ định rõ ràng)
function calculate(): number {
  return 42;
}

// 4. Kiểu phức tạp, suy luận có thể không chính xác
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> Các câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Suy luận kiểu

Hãy giải thích kiểu của mỗi biến trong đoạn code sau.

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>Nhấn để xem đáp án</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**Giải thích**:
- TypeScript tự động suy luận kiểu dựa trên giá trị khởi tạo
- Mảng được suy luận là mảng của kiểu phần tử
- Đối tượng được suy luận là kiểu cấu trúc của đối tượng

</details>

### Câu hỏi 2: Lỗi kiểu

Hãy tìm các lỗi kiểu trong đoạn code sau.

```typescript
let age: number = 30;
age = 'thirty';

let name: string = 'John';
name = 42;

let isActive: boolean = true;
isActive = 'yes';

let numbers: number[] = [1, 2, 3];
numbers.push('4');
```

<details>
<summary>Nhấn để xem đáp án</summary>

```typescript
let age: number = 30;
age = 'thirty'; // ❌ Type 'string' is not assignable to type 'number'

let name: string = 'John';
name = 42; // ❌ Type 'number' is not assignable to type 'string'

let isActive: boolean = true;
isActive = 'yes'; // ❌ Type 'string' is not assignable to type 'boolean'

let numbers: number[] = [1, 2, 3];
numbers.push('4'); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'
```

**Cách viết đúng**:
```typescript
let age: number = 30;
age = 30; // ✅

let name: string = 'John';
name = 'Jane'; // ✅

let isActive: boolean = true;
isActive = false; // ✅

let numbers: number[] = [1, 2, 3];
numbers.push(4); // ✅
```

</details>

### Câu hỏi 3: any vs unknown

Hãy giải thích sự khác biệt giữa `any` và `unknown`, và cho biết nên sử dụng cái nào.

```typescript
// Trường hợp 1: sử dụng any
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ?
}

// Trường hợp 2: sử dụng unknown
function processUnknown(value: unknown): void {
  console.log(value.toUpperCase()); // ?
}
```

<details>
<summary>Nhấn để xem đáp án</summary>

**Trường hợp 1: sử dụng any**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ Biên dịch thành công, nhưng có thể lỗi khi chạy
}

processAny('hello');  // ✅ Chạy bình thường
processAny(42);       // ❌ Lỗi runtime: value.toUpperCase is not a function
```

**Trường hợp 2: sử dụng unknown**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ Lỗi biên dịch: Object is of type 'unknown'

  // Cần kiểm tra kiểu trước
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ An toàn
  }
}
```

**So sánh sự khác biệt**:

| Đặc điểm | any | unknown |
| --- | --- | --- |
| Kiểm tra kiểu | Tắt hoàn toàn | Cần kiểm tra trước khi sử dụng |
| Độ an toàn | Không an toàn | An toàn |
| Khuyên dùng | Tránh sử dụng | Khuyên dùng |

**Thực hành tốt nhất**:
```typescript
// ✅ Khuyên dùng: sử dụng unknown và kiểm tra kiểu
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  }
}

// ❌ Tránh: sử dụng any
function processValue(value: any): void {
  console.log(value.toUpperCase()); // Không an toàn
}
```

</details>

### Câu hỏi 4: Kiểu mảng

Hãy giải thích sự khác biệt giữa các khai báo kiểu mảng sau.

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>Nhấn để xem đáp án</summary>

```typescript
// 1. number[]: mảng số (cách viết khuyên dùng)
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ Lỗi

// 2. Array<number>: mảng generic (tương đương với number[])
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ Lỗi

// 3. [number, string]: tuple (Tuple) - độ dài và kiểu cố định
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ Lỗi: độ dài vượt quá 2
arr3.push('test');   // ⚠️ TypeScript cho phép, nhưng không khuyên dùng

// 4. any[]: mảng kiểu bất kỳ (không khuyên dùng)
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅ (nhưng mất kiểm tra kiểu)
```

**Khuyến nghị sử dụng**:
- Mảng thông thường: sử dụng `number[]` hoặc `Array<number>`
- Cấu trúc cố định: sử dụng tuple `[type1, type2]`
- Tránh sử dụng `any[]`, ưu tiên sử dụng kiểu cụ thể hoặc `unknown[]`

</details>

### Câu hỏi 5: void vs never

Hãy giải thích sự khác biệt và các trường hợp sử dụng của `void` và `never`.

```typescript
// Trường hợp 1: void
function logMessage(): void {
  console.log('Hello');
}

// Trường hợp 2: never
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {
    // Vòng lặp vô hạn
  }
}
```

<details>
<summary>Nhấn để xem đáp án</summary>

**void**:
- **Mục đích**: Biểu thị hàm không trả về giá trị
- **Đặc điểm**: Hàm kết thúc bình thường, chỉ không trả về giá trị
- **Trường hợp sử dụng**: Hàm xử lý sự kiện, hàm có tác dụng phụ

```typescript
function logMessage(): void {
  console.log('Hello');
  // Hàm kết thúc bình thường, không trả về giá trị
}

function onClick(): void {
  // Xử lý sự kiện click, không cần giá trị trả về
}
```

**never**:
- **Mục đích**: Biểu thị hàm không bao giờ kết thúc bình thường
- **Đặc điểm**: Hàm sẽ ném lỗi hoặc đi vào vòng lặp vô hạn
- **Trường hợp sử dụng**: Xử lý lỗi, vòng lặp vô hạn, type guard

```typescript
function throwError(): never {
  throw new Error('Error');
  // Không bao giờ thực thi đến đây
}

function infiniteLoop(): never {
  while (true) {
    // Không bao giờ kết thúc
  }
}

// Sử dụng trong type guard
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

**So sánh sự khác biệt**:

| Đặc điểm | void | never |
| --- | --- | --- |
| Kết thúc hàm | Kết thúc bình thường | Không bao giờ kết thúc |
| Giá trị trả về | undefined | Không có giá trị trả về |
| Trường hợp sử dụng | Hàm không trả về giá trị | Xử lý lỗi, vòng lặp vô hạn |

</details>

## 4. Best Practices

> Thực hành tốt nhất

### Cách làm khuyên dùng

```typescript
// 1. Ưu tiên sử dụng suy luận kiểu
let age = 30;  // ✅ Để TypeScript suy luận
let name = 'John';  // ✅

// 2. Chỉ định rõ ràng kiểu cho tham số và giá trị trả về của hàm
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. Sử dụng unknown thay vì any
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. Sử dụng kiểu mảng cụ thể
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. Sử dụng tuple để biểu diễn cấu trúc cố định
let person: [string, number] = ['John', 30];  // ✅
```

### Cách làm nên tránh

```typescript
// 1. Tránh sử dụng any
let value: any = 'hello';  // ❌

// 2. Tránh chú thích kiểu không cần thiết
let age: number = 30;  // ⚠️ Có thể đơn giản thành let age = 30;

// 3. Tránh sử dụng kiểu object
let user: object = { name: 'John' };  // ❌ Sử dụng interface tốt hơn

// 4. Tránh mảng kiểu hỗn hợp (trừ khi cần thiết)
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ Xem xét có thực sự cần thiết không
```

## 5. Interview Summary

> Tóm tắt phỏng vấn

### Tham khảo nhanh

**Các kiểu cơ bản**:
- `number`, `string`, `boolean`, `null`, `undefined`
- `void` (không có giá trị trả về), `never` (không bao giờ trả về)
- `any` (kiểu bất kỳ, tránh sử dụng), `unknown` (kiểu chưa biết, khuyên dùng)

**Chú thích kiểu vs Suy luận**:
- Chú thích kiểu: chỉ định rõ ràng `let age: number = 30`
- Suy luận kiểu: tự động suy luận `let age = 30`

**Kiểu mảng**:
- `number[]` hoặc `Array<number>`: mảng thông thường
- `[number, string]`: tuple (cấu trúc cố định)

### Ví dụ trả lời phỏng vấn

**Q: TypeScript có những kiểu cơ bản nào?**

> "TypeScript cung cấp nhiều kiểu cơ bản, bao gồm number, string, boolean, null, undefined. Còn có một số kiểu đặc biệt: void biểu thị không có giá trị trả về, chủ yếu dùng cho hàm; never biểu thị giá trị không bao giờ xảy ra, dùng cho hàm không bao giờ trả về; any là kiểu bất kỳ nhưng nên tránh sử dụng; unknown là kiểu chưa biết, an toàn hơn any, cần kiểm tra kiểu trước khi sử dụng. Ngoài ra còn có kiểu mảng number[] và kiểu tuple [number, string]."

**Q: Sự khác biệt giữa any và unknown là gì?**

> "any sẽ tắt hoàn toàn kiểm tra kiểu, có thể sử dụng trực tiếp bất kỳ thuộc tính hoặc phương thức nào, nhưng điều này không an toàn. unknown cần kiểm tra kiểu trước khi sử dụng, an toàn hơn. Ví dụ khi sử dụng unknown, cần kiểm tra kiểu bằng typeof trước, xác nhận xong mới có thể gọi phương thức tương ứng. Khuyên sử dụng unknown hơn là any."

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
