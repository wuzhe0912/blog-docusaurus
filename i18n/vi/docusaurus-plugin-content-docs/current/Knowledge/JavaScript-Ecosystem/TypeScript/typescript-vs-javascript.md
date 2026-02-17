---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. What is TypeScript?

> TypeScript là gì?

TypeScript là ngôn ngữ lập trình mã nguồn mở do Microsoft phát triển, là **tập cha (Superset)** của JavaScript. Điều này có nghĩa là tất cả mã JavaScript hợp lệ đều là mã TypeScript hợp lệ.

**Đặc điểm cốt lõi**:

- Thêm **hệ thống kiểu tĩnh** trên nền tảng JavaScript
- Thực hiện kiểm tra kiểu khi biên dịch
- Chuyển đổi thành JavaScript thuần sau khi biên dịch
- Cung cấp trải nghiệm phát triển và hỗ trợ công cụ tốt hơn

## 2. What are the differences between TypeScript and JavaScript?

> Sự khác biệt giữa TypeScript và JavaScript là gì?

### Khác biệt chính

| Đặc điểm     | JavaScript              | TypeScript              |
| ------------ | ----------------------- | ----------------------- |
| Hệ thống kiểu | Động (kiểm tra runtime) | Tĩnh (kiểm tra khi biên dịch) |
| Biên dịch    | Không cần               | Cần biên dịch sang JavaScript |
| Chú thích kiểu | Không hỗ trợ           | Hỗ trợ chú thích kiểu   |
| Phát hiện lỗi | Khi chạy               | Khi biên dịch           |
| Hỗ trợ IDE   | Cơ bản                  | Tự động hoàn thành và refactoring mạnh |
| Độ khó học   | Thấp                    | Cao                     |

### Khác biệt hệ thống kiểu

**JavaScript (kiểu động)**:

```javascript
let value = 10;
value = 'hello'; // Có thể thay đổi kiểu
function add(a, b) { return a + b; }
add(1, 2); // 3
add('1', '2'); // '12' (nối chuỗi)
add(1, '2'); // '12' (chuyển đổi kiểu)
```

**TypeScript (kiểu tĩnh)**:

```typescript
let value: number = 10;
value = 'hello'; // ❌ Lỗi biên dịch

function add(a: number, b: number): number { return a + b; }
add(1, 2); // ✅ 3
add('1', '2'); // ❌ Lỗi biên dịch
```

### Quá trình biên dịch

```typescript
// Mã nguồn TypeScript
let message: string = 'Hello World';
console.log(message);

// ↓ Sau khi biên dịch chuyển thành JavaScript
let message = 'Hello World';
console.log(message);
```

## 3. Why use TypeScript?

> Tại sao sử dụng TypeScript?

### Ưu điểm

1. **Phát hiện lỗi sớm** - Phát hiện lỗi kiểu khi biên dịch
2. **Hỗ trợ IDE tốt hơn** - Tự động hoàn thành và refactoring
3. **Độ đọc code** - Chú thích kiểu làm rõ ý định hàm
4. **Refactoring an toàn hơn** - Tự động phát hiện vị trí cần cập nhật

### Nhược điểm

1. **Cần bước biên dịch** - Tăng độ phức tạp quy trình phát triển
2. **Độ khó học** - Cần học hệ thống kiểu
3. **Kích thước file** - Thông tin kiểu tăng kích thước mã nguồn (không ảnh hưởng sau khi biên dịch)
4. **Cấu hình phức tạp** - Cần cấu hình `tsconfig.json`

## 4. Common Interview Questions

> Các câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Thời điểm kiểm tra kiểu

<details>
<summary>Nhấn để xem đáp án</summary>

- JavaScript thực hiện chuyển đổi kiểu khi **chạy**, có thể tạo ra kết quả không mong đợi
- TypeScript kiểm tra kiểu khi **biên dịch**, phát hiện lỗi sớm

</details>

### Câu hỏi 2: Suy luận kiểu

<details>
<summary>Nhấn để xem đáp án</summary>

TypeScript tự động suy luận kiểu từ giá trị khởi tạo. Sau khi suy luận, không thể thay đổi kiểu (trừ khi khai báo rõ ràng là `any` hoặc kiểu `union`).

</details>

### Câu hỏi 3: Hành vi runtime

<details>
<summary>Nhấn để xem đáp án</summary>

- **Chú thích kiểu của TypeScript biến mất hoàn toàn sau khi biên dịch**
- JavaScript sau biên dịch giống hệt JavaScript thuần
- TypeScript chỉ cung cấp kiểm tra kiểu trong **giai đoạn phát triển**, không ảnh hưởng hiệu suất runtime

</details>

### Câu hỏi 4: Lỗi kiểu vs Lỗi runtime

<details>
<summary>Nhấn để xem đáp án</summary>

- **Lỗi biên dịch TypeScript**: Phát hiện trong giai đoạn phát triển, chương trình không thể chạy
- **Lỗi runtime JavaScript**: Phát hiện khi sử dụng, gây crash chương trình

TypeScript có thể ngăn chặn nhiều lỗi runtime thông qua kiểm tra kiểu.

</details>

## 5. Best Practices

> Thực hành tốt nhất

### Cách làm khuyên dùng

```typescript
// 1. Chỉ định rõ ràng kiểu trả về của hàm
function add(a: number, b: number): number { return a + b; }

// 2. Sử dụng interface cho cấu trúc đối tượng phức tạp
interface User { name: string; age: number; email?: string; }

// 3. Ưu tiên unknown thay vì any
function processValue(value: unknown): void {
  if (typeof value === 'string') { console.log(value.toUpperCase()); }
}

// 4. Sử dụng bí danh kiểu để tăng độ đọc
type UserID = string;
```

## 6. Interview Summary

> Tóm tắt phỏng vấn

**Q: Sự khác biệt chính giữa TypeScript và JavaScript là gì?**

> "TypeScript là tập cha của JavaScript, khác biệt chính là thêm hệ thống kiểu tĩnh. JavaScript là ngôn ngữ kiểu động với kiểm tra kiểu khi chạy; TypeScript là ngôn ngữ kiểu tĩnh với kiểm tra kiểu khi biên dịch. Điều này cho phép phát hiện lỗi liên quan đến kiểu ngay trong giai đoạn phát triển. Sau khi biên dịch, TypeScript chuyển thành JavaScript thuần, nên hành vi runtime giống hệt JavaScript."

**Q: Tại sao sử dụng TypeScript?**

> "Các ưu điểm chính là: 1) Phát hiện lỗi sớm khi biên dịch; 2) Hỗ trợ IDE tốt hơn với tự động hoàn thành và refactoring; 3) Tăng độ đọc code với chú thích kiểu; 4) Refactoring an toàn hơn với tự động phát hiện vị trí cần cập nhật. Tuy nhiên cần xem xét độ khó học và chi phí thêm của bước biên dịch."

## Reference

- [Tài liệu chính thức TypeScript](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
