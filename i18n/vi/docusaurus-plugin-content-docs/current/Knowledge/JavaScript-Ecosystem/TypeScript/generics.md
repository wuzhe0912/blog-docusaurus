---
id: generics
title: '[Medium] Kieu tong quat (Generics)'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Generics?

> Generics la gi?

Generics la mot tinh nang manh me trong TypeScript, cho phep chung ta tao cac thanh phan tai su dung co the xu ly nhieu kieu du lieu thay vi chi mot kieu duy nhat.

**Khai niem cot loi**: Khi dinh nghia ham, interface hoac class, khong chi dinh truoc kieu cu the ma chi dinh khi su dung.

### Tai sao can Generics?

**Van de khi khong co Generics**:

```typescript
// Van de: can viet mot ham cho moi kieu
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

**Giai phap voi Generics**:

```typescript
// Mot ham xu ly tat ca cac kieu
function getItem<T>(arr: T[]): T {
  return arr[0];
}

getItem<string>(['a', 'b']);      // string
getItem<number>([1, 2, 3]);       // number
getItem<boolean>([true, false]);  // boolean
```

## 2. Basic Generic Syntax

> Cu phap Generics co ban

### Ham generic

```typescript
// Cu phap: <T> bieu thi tham so kieu
function identity<T>(arg: T): T {
  return arg;
}

// Cach su dung 1: chi dinh kieu ro rang
let output1 = identity<string>('hello');  // output1: string

// Cach su dung 2: de TypeScript suy luan kieu
let output2 = identity('hello');  // output2: string (tu dong suy luan)
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

> Rang buoc generic

### Rang buoc co ban

**Cu phap**: Su dung tu khoa `extends` de gioi han kieu generic.

```typescript
// T phai co thuoc tinh length
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

getLength('hello');        // ✅ 5
getLength([1, 2, 3]);      // ✅ 3
getLength({ length: 10 }); // ✅ 10
getLength(42);             // ❌ Loi: number khong co thuoc tinh length
```

### Rang buoc voi keyof

```typescript
// K phai la khoa cua T
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
getProperty(user, 'id');    // ❌ Loi: 'id' khong phai la khoa cua user
```

### Nhieu rang buoc

```typescript
// T phai thoa man nhieu dieu kien dong thoi
function process<T extends string | number>(value: T): T {
  return value;
}

process('hello');  // ✅
process(42);       // ✅
process(true);     // ❌ Loi: boolean nam ngoai pham vi rang buoc
```

## 4. Common Interview Questions

> Cac cau hoi phong van thuong gap

### Cau hoi 1: Hien thuc ham generic

Hay hien thuc mot ham generic `first`, tra ve phan tu dau tien cua mang.

```typescript
function first<T>(arr: T[]): T | undefined {
  // Hien thuc cua ban
}
```

<details>
<summary>Nhan de xem dap an</summary>

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr.length > 0 ? arr[0] : undefined;
}

// Vi du su dung
const firstString = first<string>(['a', 'b', 'c']);  // 'a'
const firstNumber = first<number>([1, 2, 3]);        // 1
const firstEmpty = first<number>([]);                 // undefined
```

**Giai thich**:
- `<T>` dinh nghia tham so kieu generic
- `arr: T[]` bieu thi mang kieu T
- Gia tri tra ve `T | undefined` bieu thi co the la kieu T hoac undefined

</details>

### Cau hoi 2: Rang buoc generic

Hay hien thuc mot ham gop hai doi tuong, nhung chi gop cac thuoc tinh ton tai trong doi tuong dau tien.

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  // Hien thuc cua ban
}
```

<details>
<summary>Nhan de xem dap an</summary>

```typescript
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

// Vi du su dung
const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31, email: 'john@example.com' };

const merged = merge(obj1, obj2);
// { name: 'John', age: 31, email: 'john@example.com' }
```

**Phien ban nang cao (chi gop thuoc tinh cua doi tuong dau tien)**:

```typescript
function merge<T extends object, U extends Partial<T>>(
  obj1: T,
  obj2: U
): T {
  return { ...obj1, ...obj2 };
}

const obj1 = { name: 'John', age: 30 };
const obj2 = { age: 31 };  // Chi co the chua thuoc tinh cua obj1

const merged = merge(obj1, obj2);
// { name: 'John', age: 31 }
```

</details>

### Cau hoi 3: Interface generic

Hay dinh nghia mot interface generic `Repository` cho cac thao tac truy cap du lieu.

```typescript
interface Repository<T> {
  // Dinh nghia cua ban
}
```

<details>
<summary>Nhan de xem dap an</summary>

```typescript
interface Repository<T> {
  findById(id: string): T | undefined;
  findAll(): T[];
  save(entity: T): void;
  delete(id: string): void;
}

// Vi du hien thuc
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

### Cau hoi 4: Rang buoc generic va keyof

Hay hien thuc mot ham lay gia tri thuoc tinh cua doi tuong theo ten khoa, dam bao an toan kieu.

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  // Hien thuc cua ban
}
```

<details>
<summary>Nhan de xem dap an</summary>

```typescript
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Vi du su dung
const user = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
};

const name = getValue(user, 'name');   // string
const age = getValue(user, 'age');     // number
const email = getValue(user, 'email');  // string
// const id = getValue(user, 'id');    // ❌ Loi: 'id' khong phai la khoa cua user
```

**Giai thich**:
- `K extends keyof T` dam bao K phai la mot trong cac khoa cua T
- `T[K]` bieu thi kieu gia tri tuong ung voi khoa K trong doi tuong T
- Dieu nay dam bao an toan kieu, phat hien loi ngay luc bien dich

</details>

### Cau hoi 5: Kieu dieu kien va generics

Hay giai thich ket qua suy luan kieu cua doan code sau.

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;
type B = NonNullable<number | undefined>;
type C = NonNullable<string | number>;
```

<details>
<summary>Nhan de xem dap an</summary>

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;      // string
type B = NonNullable<number | undefined>; // number
type C = NonNullable<string | number>;    // string | number
```

**Giai thich**:
- `NonNullable<T>` la mot kieu dieu kien (Conditional Type)
- Neu T co the gan cho `null | undefined` thi tra ve `never`, nguoc lai tra ve `T`
- Trong `string | null`, `string` khong thoa dieu kien, `null` thoa dieu kien, nen ket qua la `string`
- Trong `string | number`, ca hai deu khong thoa dieu kien, nen ket qua la `string | number`

**Ung dung thuc te**:
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

> Cac mau generic nang cao

### Tham so kieu mac dinh

```typescript
interface Container<T = string> {
  value: T;
}

const container1: Container = { value: 'hello' };  // Su dung kieu mac dinh string
const container2: Container<number> = { value: 42 };
```

### Nhieu tham so kieu

```typescript
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

const numbers = [1, 2, 3];
const strings = map(numbers, (n) => n.toString());  // string[]
```

### Cac kieu tien ich generic

```typescript
// Partial: tat ca thuoc tinh tro thanh tuy chon
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Required: tat ca thuoc tinh tro thanh bat buoc
type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick: chon cac thuoc tinh cu the
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit: loai tru cac thuoc tinh cu the
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
```

## 6. Best Practices

> Thuc hanh tot nhat

### Cach lam khuyen dung

```typescript
// 1. Su dung ten generic co y nghia
function process<TData, TResponse>(data: TData): TResponse {
  // ...
}

// 2. Su dung rang buoc de gioi han pham vi generic
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}

// 3. Cung cap tham so kieu mac dinh
interface Config<T = string> {
  value: T;
}

// 4. Su dung cac kieu tien ich generic
type UserUpdate = Partial<User>;
type UserKeys = keyof User;
```

### Cach lam nen tranh

```typescript
// 1. Khong lam dung generics
function process<T>(value: T): T {  // ⚠️ Neu chi co mot kieu, khong can generics
  return value;
}

// 2. Khong su dung ten generic mot chu cai (tru truong hop don gian)
function process<A, B, C>(a: A, b: B, c: C) {  // ❌ Y nghia khong ro rang
  // ...
}

// 3. Khong bo qua rang buoc
function process<T>(value: T) {  // ⚠️ Neu co gioi han, nen them rang buoc
  return value.length;  // Co the loi
}
```

## 7. Interview Summary

> Tom tat phong van

### Tham khao nhanh

**Khai niem cot loi cua Generics**:
- Khong chi dinh kieu cu the khi dinh nghia, chi dinh khi su dung
- Cu phap: `<T>` dinh nghia tham so kieu
- Co the ap dung cho ham, interface, class

**Rang buoc generic**:
- Su dung `extends` de gioi han pham vi generic
- `K extends keyof T` dam bao K la khoa cua T
- Co the ket hop nhieu rang buoc

**Cac mau thuong gap**:
- Ham generic: `function identity<T>(arg: T): T`
- Interface generic: `interface Box<T> { value: T; }`
- Class generic: `class Container<T> { ... }`

### Vi du tra loi phong van

**Q: Generics la gi? Tai sao can Generics?**

> "Generics la mot co che trong TypeScript de tao cac thanh phan tai su dung, cho phep khong chi dinh kieu cu the khi dinh nghia ma chi dinh khi su dung. Cac uu diem chinh cua Generics la: 1) Tang kha nang tai su dung code - mot ham co the xu ly nhieu kieu; 2) Duy tri an toan kieu - kiem tra loi kieu ngay luc bien dich; 3) Giam code trung lap - khong can viet mot ham cho moi kieu. Vi du `function identity<T>(arg: T): T` co the xu ly bat ky kieu nao ma khong can viet ham rieng cho string, number, v.v."

**Q: Rang buoc generic la gi? Su dung nhu the nao?**

> "Rang buoc generic su dung tu khoa `extends` de gioi han pham vi cua kieu generic. Vi du `function getLength<T extends { length: number }>(arg: T)` dam bao T phai co thuoc tinh length. Mot rang buoc thuong gap khac la `K extends keyof T`, dam bao K phai la mot trong cac khoa cua T, giup hien thuc truy cap thuoc tinh an toan kieu. Rang buoc giup chung ta duy tri an toan kieu khi su dung generics, dong thoi cung cap thong tin kieu can thiet."

## Reference

- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook - Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [TypeScript Deep Dive - Generics](https://basarat.gitbook.io/typescript/type-system/generics)
