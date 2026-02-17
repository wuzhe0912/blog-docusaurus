---
id: generics
title: '[Medium] Kiểu tổng quát (Generics)'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> Generics là gì?

Generics là một tính năng mạnh mẽ trong TypeScript, cho phép chúng ta tạo các thành phần tái sử dụng có thể xử lý nhiều kiểu dữ liệu thay vì chỉ một kiểu duy nhất.

**Khái niệm cốt lõi**: Khi định nghĩa hàm, interface hoặc class, không chỉ định trước kiểu cụ thể mà chỉ định khi sử dụng.

### Tại sao cần Generics?

**Vấn đề khi không có Generics**:

```typescript
// Vấn đề: cần viết một hàm cho mỗi kiểu
function getStringItem(arr: string[]): string {
  return arr[0];
}

function getNumberItem(arr: number[]): number {
  return arr[0];
}

function getBooleanItem(arr: boolean[]): boolean {
  return arr[0];
}
```

**Giải pháp với Generics**:

```typescript
// Một hàm xử lý tất cả các kiểu
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> Cú pháp Generics cơ bản

### Hàm generic

```typescript
// Cú pháp: <T> biểu thị tham số kiểu
function identity<T>(arg: T): T {
  return arg;
}

// Cách sử dụng 1: chỉ định kiểu rõ ràng
let output1 = identity<string>('hello');  // output1: string

// Cách sử dụng 2: để TypeScript suy luận kiểu
let output2 = identity('hello');  // output2: string (tự động suy luận)
```

### Interface generic

```typescript
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = {
  value: 'hello',
};

const numberBox: Box<number> = {
  value: 42,
};
```

### Class generic

```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T {
    return this.items[index];
  }
}

const stringContainer = new Container<string>();
stringContainer.add('hello');
stringContainer.add('world');

const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
```

## 3. Generic Constraints

> Ràng buộc generic

### Ràng buộc cơ bản

**Cú pháp**: Sử dụng từ khóa `extends` để giới hạn kiểu generic.

```typescript
// T phải có thuộc tính length
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ Lỗi: number không có thuộc tính length
```

### Ràng buộc với keyof

```typescript
// K phải là khóa của T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

getProperty(user, 'name');  // ✅ 'John'
getProperty(user, 'age');   // ✅ 30
getProperty(user, 'id');    // ❌ Lỗi: 'id' không phải là khóa của user
```

### Nhiều ràng buộc

```typescript
// T phải thỏa mãn nhiều điều kiện đồng thời
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ Lỗi: boolean nằm ngoài phạm vi ràng buộc
```

## 4. Common Interview Questions

> Các câu hỏi phỏng vấn thường gặp

### Câu hỏi 1: Hiện thực hàm generic

Hãy hiện thực một hàm generic `first`, trả về phần tử đầu tiên của mảng.

```typescript
function first<T>(arr: T[]): T | undefined {
  // Hiện thực của bạn
}
```

<details>
<summary>Nhấn để xem đáp án</summary>

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// Ví dụ sử dụng
const firstString = first<string>(['a', 'b', 'c']);  // 'a'
const firstNumber = first<number>([1, 2, 3]);        // 1
const firstEmpty = first<number>([]);                 // undefined
```

**Giải thích**:
- `<T>` định nghĩa tham số kiểu generic
- `arr: T[]` biểu thị mảng kiểu T
- Giá trị trả về `T | undefined` biểu thị có thể là kiểu T hoặc undefined

</details>

### Câu hỏi 2: Ràng buộc generic

Hãy hiện thực một hàm gộp hai đối tượng, nhưng chỉ gộp các thuộc tính tồn tại trong đối tượng đầu tiên.

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // Hiện thực của bạn
}
```

<details>
<summary>Nhấn để xem đáp án</summary>

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// Ví dụ sử dụng
const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31, email: 'john@example.com' };

const merged = merge(obj1, obj2);
// { name: 'John', age: 31, email: 'john@example.com' }
```

**Phiên bản nâng cao (chỉ gộp thuộc tính của đối tượng đầu tiên)**:

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // Chỉ có thể chứa thuộc tính của obj1

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### Câu hỏi 3: Interface generic

Hãy định nghĩa một interface generic `Repository` cho các thao tác truy cập dữ liệu.

```typescript
interface Repository<T> {
  // Định nghĩa của bạn
}
```

<details>
<summary>Nhấn để xem đáp án</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// Ví dụ hiện thực
class UserRepository implements Repository<User> {
  private users: User[] = [];

  findById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  findAll(): User[] {
    return this.users;
  }

  save(entity: User): void {
    const index = this.users.findIndex(user => user.id === entity.id);
    if (index >= 0) {
      this.users[index] = entity;
    } else {
      this.users.push(entity);
    }
  }

  delete(id: string): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}
```

</details>

### Câu hỏi 4: Ràng buộc generic và keyof

Hãy hiện thực một hàm lấy giá trị thuộc tính của đối tượng theo tên khóa, đảm bảo an toàn kiểu.

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // Hiện thực của bạn
}
```

<details>
<summary>Nhấn để xem đáp án</summary>

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Ví dụ sử dụng
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const name = getValue(user, 'name');   // string
const age = getValue(user, 'age');     // number
const email = getValue(user, 'email');  // string
// const id = getValue(user, 'id');    // ❌ Lỗi: 'id' không phải là khóa của user
```

**Giải thích**:
- `K extends keyof T` đảm bảo K phải là một trong các khóa của T
- `T[K]` biểu thị kiểu giá trị tương ứng với khóa K trong đối tượng T
- Điều này đảm bảo an toàn kiểu, phát hiện lỗi ngay lúc biên dịch

</details>

### Câu hỏi 5: Kiểu điều kiện và generics

Hãy giải thích kết quả suy luận kiểu của đoạn code sau.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>Nhấn để xem đáp án</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**Giải thích**:
- `NonNullable<T>` là một kiểu điều kiện (Conditional Type)
- Nếu T có thể gán cho `null | undefined` thì trả về `never`, ngược lại trả về `T`
- Trong `string | null`, `string` không thỏa điều kiện, `null` thỏa điều kiện, nên kết quả là `string`
- Trong `string | number`, cả hai đều không thỏa điều kiện, nên kết quả là `string | number`

**Ứng dụng thực tế**:
```typescript
function processValue<T>(value: T): NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value cannot be null or undefined');
  }
  return value as NonNullable<T>;
}

const result = processValue<string | null>('hello');  // string
```

</details>

## 5. Advanced Generic Patterns

> Các mẫu generic nâng cao

### Tham số kiểu mặc định

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // Sử dụng kiểu mặc định string
const container2: Container<number> = { value: 42 };
```

### Nhiều tham số kiểu

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### Các kiểu tiện ích generic

```typescript
// Partial: tất cả thuộc tính trở thành tùy chọn
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required: tất cả thuộc tính trở thành bắt buộc
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick: chọn các thuộc tính cụ thể
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit: loại trừ các thuộc tính cụ thể
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> Thực hành tốt nhất

### Cách làm khuyên dùng

```typescript
// 1. Sử dụng tên generic có ý nghĩa
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. Sử dụng ràng buộc để giới hạn phạm vi generic
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. Cung cấp tham số kiểu mặc định
interface Config<T = string> {
  value: T;
}

// 4. Sử dụng các kiểu tiện ích generic
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### Cách làm nên tránh

```typescript
// 1. Không lạm dụng generics
function process<T>(value: T): T {  // ⚠️ Nếu chỉ có một kiểu, không cần generics
  return value;
}

// 2. Không sử dụng tên generic một chữ cái (trừ trường hợp đơn giản)
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ Ý nghĩa không rõ ràng
  // ...
}

// 3. Không bỏ qua ràng buộc
function process<T>(value: T) {  // ⚠️ Nếu có giới hạn, nên thêm ràng buộc
  return value.length;  // Có thể lỗi
}
```

## 7. Interview Summary

> Tóm tắt phỏng vấn

### Tham khảo nhanh

**Khái niệm cốt lõi của Generics**:
- Không chỉ định kiểu cụ thể khi định nghĩa, chỉ định khi sử dụng
- Cú pháp: `<T>` định nghĩa tham số kiểu
- Có thể áp dụng cho hàm, interface, class

**Ràng buộc generic**:
- Sử dụng `extends` để giới hạn phạm vi generic
- `K extends keyof T` đảm bảo K là khóa của T
- Có thể kết hợp nhiều ràng buộc

**Các mẫu thường gặp**:
- Hàm generic: `function identity<T>(arg: T): T`
- Interface generic: `interface Box<T> { value: T; }`
- Class generic: `class Container<T> { ... }`

### Ví dụ trả lời phỏng vấn

**Q: Generics là gì? Tại sao cần Generics?**

> "Generics là một cơ chế trong TypeScript để tạo các thành phần tái sử dụng, cho phép không chỉ định kiểu cụ thể khi định nghĩa mà chỉ định khi sử dụng. Các ưu điểm chính của Generics là: 1) Tăng khả năng tái sử dụng code - một hàm có thể xử lý nhiều kiểu; 2) Duy trì an toàn kiểu - kiểm tra lỗi kiểu ngay lúc biên dịch; 3) Giảm code trùng lặp - không cần viết một hàm cho mỗi kiểu. Ví dụ `function identity<T>(arg: T): T` có thể xử lý bất kỳ kiểu nào mà không cần viết hàm riêng cho string, number, v.v."

**Q: Ràng buộc generic là gì? Sử dụng như thế nào?**

> "Ràng buộc generic sử dụng từ khóa `extends` để giới hạn phạm vi của kiểu generic. Ví dụ `function getLength<T extends { length: number }>(arg: T)` đảm bảo T phải có thuộc tính length. Một ràng buộc thường gặp khác là `K extends keyof T`, đảm bảo K phải là một trong các khóa của T, giúp hiện thực truy cập thuộc tính an toàn kiểu. Ràng buộc giúp chúng ta duy trì an toàn kiểu khi sử dụng generics, đồng thời cung cấp thông tin kiểu cần thiết."

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
