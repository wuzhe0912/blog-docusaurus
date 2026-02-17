---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. What are Interface and Type Alias?

> Interface va Type Alias la gi?

### Interface (Giao dien)

**Dinh nghia**: Dung de dinh nghia cau truc cua doi tuong, mo ta cac thuoc tinh va phuong thuc ma doi tuong can co.

```typescript
interface User {
  name: string;
  age: number;
  email?: string;  // Thuoc tinh tuy chon
}

const user: User = {
  name: 'John',
  age: 30,
};
```

### Type Alias (Bi danh kieu)

**Dinh nghia**: Tao bi danh cho kieu, co the su dung voi bat ky kieu nao, khong chi gioi han o doi tuong.

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

> Su khac biet chinh giua Interface va Type Alias

### 1. Cach mo rong

**Interface: su dung extends**

```typescript
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

**Type Alias: su dung kieu giao (Intersection)**

```typescript
type Animal = { name: string; };
type Dog = Animal & { breed: string; };
const dog: Dog = { name: 'Buddy', breed: 'Golden Retriever' };
```

### 2. Gop (Declaration Merging)

**Interface: ho tro gop**

```typescript
interface User { name: string; }
interface User { age: number; }
// Tu dong gop thanh { name: string; age: number; }
const user: User = { name: 'John', age: 30 };
```

**Type Alias: khong ho tro gop**

```typescript
type User = { name: string; };
type User = { age: number; };  // ❌ Loi: Duplicate identifier 'User'
```

### 3. Pham vi ap dung

**Interface: chu yeu cho cau truc doi tuong**

```typescript
interface User { name: string; age: number; }
```

**Type Alias: co the su dung voi bat ky kieu nao**

```typescript
type ID = string | number;
type Greet = (name: string) => string;
type Status = 'active' | 'inactive' | 'pending';
type Point = [number, number];
type User = { name: string; age: number; };
```

### 4. Thuoc tinh tinh toan

**Interface: khong ho tro thuoc tinh tinh toan**

```typescript
interface User { [key: string]: any; }
```

**Type Alias: ho tro phep toan kieu phuc tap hon**

```typescript
type Keys = 'name' | 'age' | 'email';
type User = { [K in Keys]: string; };
```

## 3. When to Use Interface vs Type Alias?

> Khi nao su dung Interface? Khi nao su dung Type Alias?

### Su dung Interface khi

1. **Dinh nghia cau truc doi tuong** (pho bien nhat)
2. **Can gop khai bao** (vi du: mo rong kieu cua goi thu ba)
3. **Dinh nghia hop dong cho class**

### Su dung Type Alias khi

1. **Dinh nghia kieu union hoac intersection**: `type ID = string | number;`
2. **Dinh nghia kieu ham**: `type EventHandler = (event: Event) => void;`
3. **Dinh nghia tuple**: `type Point = [number, number];`
4. **Can kieu mapped hoac kieu dieu kien**

## 4. Common Interview Questions

> Cac cau hoi phong van thuong gap

### Cau hoi 1: Khac biet co ban

Hay giai thich su khac biet giua hai cach dinh nghia sau.

```typescript
interface User { name: string; age: number; }
type User = { name: string; age: number; };
```

<details>
<summary>Nhan de xem dap an</summary>

**Giong nhau**: Ca hai deu co the dinh nghia cau truc doi tuong, su dung giong nhau, ca hai deu co the mo rong.

**Khac nhau**:
1. **Gop khai bao**: Interface ho tro; Type Alias khong.
2. **Pham vi**: Interface chu yeu cho doi tuong; Type Alias cho bat ky kieu nao.

**Khuyen nghi**: Cho cau truc doi tuong, ca hai deu dung. Cho gop khai bao, dung Interface. Cho kieu khong phai doi tuong, dung Type Alias.

</details>

### Cau hoi 2: Cach mo rong

Hay giai thich su khac biet giua `extends` va intersection `&`.

<details>
<summary>Nhan de xem dap an</summary>

- **Cu phap**: Interface dung `extends`, Type dung `&`
- **Ket qua**: Ca hai cho ket qua giong nhau
- **Do doc**: `extends` cua Interface truc quan hon
- **Linh hoat**: `&` cua Type co the ket hop nhieu kieu

</details>

### Cau hoi 3: Gop khai bao

```typescript
interface User { name: string; }
interface User { age: number; }
const user: User = { name: 'John' };  // Thieu age?
```

<details>
<summary>Nhan de xem dap an</summary>

Hai khai bao tu dong gop lai. Thieu `age` se tao loi. Type Alias khong ho tro gop khai bao.

</details>

### Cau hoi 4: Hien thuc (implements)

<details>
<summary>Nhan de xem dap an</summary>

Ca hai deu co the dung voi `implements`. Interface pho bien hon cho hop dong class. Type Alias cua ham khong the hien thuc.

</details>

## 5. Best Practices

> Thuc hanh tot nhat

### Cach lam khuyen dung

```typescript
// 1. Cho doi tuong, uu tien Interface
interface User { name: string; age: number; }

// 2. Cho kieu union, dung Type Alias
type Status = 'active' | 'inactive' | 'pending';

// 3. Cho kieu ham, dung Type Alias
type EventHandler = (event: Event) => void;

// 4. Cho gop khai bao, dung Interface
interface Window { customProperty: string; }

// 5. Cho hop dong class, dung Interface
interface Flyable { fly(): void; }
class Bird implements Flyable { fly(): void {} }
```

### Cach lam nen tranh

```typescript
// 1. Khong tron lan Interface va Type Alias cho cung cau truc
// 2. Khong dung Type Alias cho doi tuong don gian (Interface phu hop hon)
// 3. Khong dung Interface cho kieu khong phai doi tuong
```

## 6. Interview Summary

> Tom tat phong van

### Tham khao nhanh

**Interface**: doi tuong, Declaration Merging, `extends`, hop dong class.

**Type Alias**: bat ky kieu nao, khong Declaration Merging, `&` intersection, union/ham/tuple.

### Vi du tra loi phong van

**Q: Su khac biet giua Interface va Type Alias la gi?**

> "Interface va Type Alias deu co the dung de dinh nghia cau truc doi tuong, nhung co mot so khac biet chinh: 1) Interface ho tro gop khai bao; Type Alias khong. 2) Interface chu yeu cho doi tuong; Type Alias cho bat ky kieu nao. 3) Interface dung extends; Type Alias dung &. 4) Interface phu hop hon cho hop dong class. Cho doi tuong, ca hai deu dung. Cho gop khai bao, dung Interface. Cho kieu khong phai doi tuong, dung Type Alias."

**Q: Khi nao nen dung Interface va khi nao nen dung Type Alias?**

> "Dung Interface cho: cau truc doi tuong, gop khai bao, hop dong class. Dung Type Alias cho: kieu union/intersection, kieu ham, tuple, kieu mapped/dieu kien. Tom lai, uu tien Interface cho doi tuong, Type Alias cho cac kieu con lai."

## Reference

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [TypeScript Deep Dive - Interfaces vs Type Aliases](https://basarat.gitbook.io/typescript/type-system/interfaces#interfaces-vs-type-aliases)
