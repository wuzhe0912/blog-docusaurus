---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> Interface và Type Alias là gì?

### Interface (Giao diện)

**Định nghĩa**: Dùng để định nghĩa cấu trúc của đối tượng, mô tả các thuộc tính và phương thức mà đối tượng cần có.

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // Thuộc tính tùy chọn
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias (Bí danh kiểu)

**Định nghĩa**: Tạo bí danh cho kiểu, có thể sử dụng với bất kỳ kiểu nào, không chỉ giới hạn ở đối tượng.

```typescript
type User = {
  name: string;
  age: number;
  email?: string;
};

const user: User = {
  name: 'John',
  age: 30,
};
```

## 2. Interface vs Type Alias: Key Differences

> Sự khác biệt chính giữa Interface và Type Alias

### 1. Cách mở rộng

**Interface: sử dụng extends**

```typescript
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

**Type Alias: sử dụng kiểu giao (Intersection)**

```typescript
type Animal = { name: string; };
type Dog = Animal & { breed: string; };
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

### 2. Gộp (Declaration Merging)

**Interface: hỗ trợ gộp**

```typescript
interface User { name: string; }
interface User { age: number; }
// Tự động gộp thành { name: string; age: number; }
const user: User = { name: 'John', age: 30 };
```

**Type Alias: không hỗ trợ gộp**

```typescript
type User = { name: string; };
type User = { age: number; };  // ❌ Lỗi: Duplicate identifier 'User'
```

### 3. Phạm vi áp dụng

**Interface: chủ yếu cho cấu trúc đối tượng**

```typescript
interface User { name: string; age: number; }
```

**Type Alias: có thể sử dụng với bất kỳ kiểu nào**

```typescript
type ID = string | number;
type Greet = (name: string) => string;
type Status = 'active' | 'inactive' | 'pending';
type Point = [number, number];
type User = { name: string; age: number; };
```

### 4. Thuộc tính tính toán

**Interface: không hỗ trợ thuộc tính tính toán**

```typescript
interface User { [key: string]: any; }
```

**Type Alias: hỗ trợ phép toán kiểu phức tạp hơn**

```typescript
type Keys = 'name' | 'age' | 'email';
type User = { [K in Keys]: string; };
```

## 3. When to Use Interface vs Type Alias?

> Khi nào sử dụng Interface? Khi nào sử dụng Type Alias?

### Sử dụng Interface khi

1. **Định nghĩa cấu trúc đối tượng** (phổ biến nhất)
2. **Cần gộp khai báo** (ví dụ: mở rộng kiểu của gói thư ba)
3. **Định nghĩa hợp đồng cho class**

### Sử dụng Type Alias khi

1. **Định nghĩa kiểu union hoặc intersection**: `type ID = string | number;`
2. **Định nghĩa kiểu hàm**: `type EventHandler = (event: Event) => void;`
3. **Định nghĩa tuple**: `type Point = [number, number];`
4. **Cần kiểu mapped hoặc kiểu điều kiện**

## 4. Common Interview Questions

> Các câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Khác biệt cơ bản

Hãy giải thích sự khác biệt giữa hai cách định nghĩa sau.

```typescript
interface User { name: string; age: number; }
type User = { name: string; age: number; };
```

<details>
<summary>Nhấn để xem đáp án</summary>

**Giống nhau**: Cả hai đều có thể định nghĩa cấu trúc đối tượng, sử dụng giống nhau, cả hai đều có thể mở rộng.

**Khác nhau**:
1. **Gộp khai báo**: Interface hỗ trợ; Type Alias không.
2. **Phạm vi**: Interface chủ yếu cho đối tượng; Type Alias cho bất kỳ kiểu nào.

**Khuyến nghị**: Cho cấu trúc đối tượng, cả hai đều đúng. Cho gộp khai báo, dùng Interface. Cho kiểu không phải đối tượng, dùng Type Alias.

</details>

### Câu hỏi 2: Cách mở rộng

Hãy giải thích sự khác biệt giữa `extends` và intersection `&`.

<details>
<summary>Nhấn để xem đáp án</summary>

- **Cú pháp**: Interface dùng `extends`, Type dùng `&`
- **Kết quả**: Cả hai cho kết quả giống nhau
- **Độ đọc**: `extends` của Interface trực quan hơn
- **Linh hoạt**: `&` của Type có thể kết hợp nhiều kiểu

</details>

### Câu hỏi 3: Gộp khai báo

```typescript
interface User { name: string; }
interface User { age: number; }
const user: User = { name: 'John' };  // Thiếu age?
```

<details>
<summary>Nhấn để xem đáp án</summary>

Hai khai báo tự động gộp lại. Thiếu `age` sẽ tạo lỗi. Type Alias không hỗ trợ gộp khai báo.

</details>

### Câu hỏi 4: Hiện thực (implements)

<details>
<summary>Nhấn để xem đáp án</summary>

Cả hai đều có thể dùng với `implements`. Interface phổ biến hơn cho hợp đồng class. Type Alias của hàm không thể hiện thực.

</details>

## 5. Best Practices

> Thực hành tốt nhất

### Cách làm khuyên dùng

```typescript
// 1. Cho đối tượng, ưu tiên Interface
interface User { name: string; age: number; }

// 2. Cho kiểu union, dùng Type Alias
type Status = 'active' | 'inactive' | 'pending';

// 3. Cho kiểu hàm, dùng Type Alias
type EventHandler = (event: Event) => void;

// 4. Cho gộp khai báo, dùng Interface
interface Window { customProperty: string; }

// 5. Cho hợp đồng class, dùng Interface
interface Flyable { fly(): void; }
class Bird implements Flyable { fly(): void {} }
```

### Cách làm nên tránh

```typescript
// 1. Không trộn lẫn Interface và Type Alias cho cùng cấu trúc
// 2. Không dùng Type Alias cho đối tượng đơn giản (Interface phù hợp hơn)
// 3. Không dùng Interface cho kiểu không phải đối tượng
```

## 6. Interview Summary

> Tóm tắt phỏng vấn

### Tham khảo nhanh

**Interface**: đối tượng, Declaration Merging, `extends`, hợp đồng class.

**Type Alias**: bất kỳ kiểu nào, không Declaration Merging, `&` intersection, union/hàm/tuple.

### Ví dụ trả lời phỏng vấn

**Q: Sự khác biệt giữa Interface và Type Alias là gì?**

> "Interface và Type Alias đều có thể dùng để định nghĩa cấu trúc đối tượng, nhưng có một số khác biệt chính: 1) Interface hỗ trợ gộp khai báo; Type Alias không. 2) Interface chủ yếu cho đối tượng; Type Alias cho bất kỳ kiểu nào. 3) Interface dùng extends; Type Alias dùng &. 4) Interface phù hợp hơn cho hợp đồng class. Cho đối tượng, cả hai đều đúng. Cho gộp khai báo, dùng Interface. Cho kiểu không phải đối tượng, dùng Type Alias."

**Q: Khi nào nên dùng Interface và khi nào nên dùng Type Alias?**

> "Dùng Interface cho: cấu trúc đối tượng, gộp khai báo, hợp đồng class. Dùng Type Alias cho: kiểu union/intersection, kiểu hàm, tuple, kiểu mapped/điều kiện. Tóm lại, ưu tiên Interface cho đối tượng, Type Alias cho các kiểu còn lại."

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)
