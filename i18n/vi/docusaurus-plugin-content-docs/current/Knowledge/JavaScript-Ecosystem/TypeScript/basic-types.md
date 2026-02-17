---
id: basic-types
title: '[Easy] Cac kieu du lieu co ban va chu thich kieu'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. What are TypeScript Basic Types?

> Cac kieu du lieu co ban cua TypeScript la gi?

TypeScript cung cap nhieu kieu du lieu co ban de dinh nghia kieu cho bien, tham so ham va gia tri tra ve.

### Cac kieu co ban

```typescript
// 1. number: so (so nguyen, so thuc)
let age: number = 30;
let price: number = 99.99;

// 2. string: chuoi ky tu
let name: string = 'John';
let message: string = `Hello, ${name}!`;

// 3. boolean: gia tri boolean
let isActive: boolean = true;
let isCompleted: boolean = false;

// 4. null: gia tri rong
let data: null = null;

// 5. undefined: chua dinh nghia
let value: undefined = undefined;

// 6. void: khong co gia tri tra ve (chu yeu dung cho ham)
function logMessage(): void {
  console.log('Hello');
}

// 7. any: kieu bat ky (nen tranh su dung)
let anything: any = 'hello';
anything = 42;
anything = true;

// 8. unknown: kieu chua biet (an toan hon any)
let userInput: unknown = 'hello';
// userInput.toUpperCase(); // ❌ Loi: can kiem tra kieu truoc

// 9. never: gia tri khong bao gio xay ra (cho ham khong bao gio tra ve)
function throwError(): never {
  throw new Error('Error');
}

// 10. object: doi tuong (it dung, khuyen dung interface)
let user: object = { name: 'John' };

// 11. array: mang
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['John', 'Jane'];

// 12. tuple: tuple (mang co do dai va kieu co dinh)
let person: [string, number] = ['John', 30];
```

## 2. Type Annotations vs Type Inference

> Chu thich kieu vs Suy luan kieu

### Chu thich kieu (Type Annotations)

**Dinh nghia**: Chi dinh ro rang kieu cua bien.

```typescript
// Chi dinh kieu ro rang
let age: number = 30;
let name: string = 'John';
let isActive: boolean = true;

// Tham so ham va gia tri tra ve
function add(a: number, b: number): number {
  return a + b;
}
```

### Suy luan kieu (Type Inference)

**Dinh nghia**: TypeScript tu dong suy luan kieu dua tren gia tri khoi tao.

```typescript
// TypeScript tu dong suy luan la number
let age = 30;        // age: number

// TypeScript tu dong suy luan la string
let name = 'John';   // name: string

// TypeScript tu dong suy luan la boolean
let isActive = true;  // isActive: boolean

// Gia tri tra ve cua ham cung duoc tu dong suy luan
function add(a: number, b: number) {
  return a + b;  // Tu dong suy luan gia tri tra ve la number
}
```

### Khi nao nen su dung chu thich kieu

**Cac truong hop can chi dinh kieu ro rang**:

```typescript
// 1. Khai bao bien ma khong co gia tri khoi tao
let value: number;
value = 10;

// 2. Tham so ham (bat buoc chi dinh)
function greet(name: string): void {
  console.log(`Hello, ${name}!`);
}

// 3. Gia tri tra ve cua ham (khuyen chi dinh ro rang)
function calculate(): number {
  return 42;
}

// 4. Kieu phuc tap, suy luan co the khong chinh xac
let data: { name: string; age: number } = {
  name: 'John',
  age: 30,
};
```

## 3. Common Interview Questions

> Cac cau hoi phong van thuong gap

### Cau hoi 1: Suy luan kieu

Hay giai thich kieu cua moi bien trong doan code sau.

```typescript
let value1 = 10;
let value2 = 'hello';
let value3 = true;
let value4 = [1, 2, 3];
let value5 = { name: 'John', age: 30 };
```

<details>
<summary>Nhan de xem dap an</summary>

```typescript
let value1 = 10;                    // number
let value2 = 'hello';               // string
let value3 = true;                   // boolean
let value4 = [1, 2, 3];             // number[]
let value5 = { name: 'John', age: 30 }; // { name: string; age: number }
```

**Giai thich**:
- TypeScript tu dong suy luan kieu dua tren gia tri khoi tao
- Mang duoc suy luan la mang cua kieu phan tu
- Doi tuong duoc suy luan la kieu cau truc cua doi tuong

</details>

### Cau hoi 2: Loi kieu

Hay tim cac loi kieu trong doan code sau.

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
<summary>Nhan de xem dap an</summary>

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

**Cach viet dung**:
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

### Cau hoi 3: any vs unknown

Hay giai thich su khac biet giua `any` va `unknown`, va cho biet nen su dung cai nao.

```typescript
// Truong hop 1: su dung any
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ?
}

// Truong hop 2: su dung unknown
function processUnknown(value: unknown): void {
  console.log(value.toUpperCase()); // ?
}
```

<details>
<summary>Nhan de xem dap an</summary>

**Truong hop 1: su dung any**
```typescript
function processAny(value: any): void {
  console.log(value.toUpperCase()); // ⚠️ Bien dich thanh cong, nhung co the loi khi chay
}

processAny('hello');  // ✅ Chay binh thuong
processAny(42);       // ❌ Loi runtime: value.toUpperCase is not a function
```

**Truong hop 2: su dung unknown**
```typescript
function processUnknown(value: unknown): void {
  // console.log(value.toUpperCase()); // ❌ Loi bien dich: Object is of type 'unknown'

  // Can kiem tra kieu truoc
  if (typeof value === 'string') {
    console.log(value.toUpperCase()); // ✅ An toan
  }
}
```

**So sanh su khac biet**:

| Dac diem | any | unknown |
| --- | --- | --- |
| Kiem tra kieu | Tat hoan toan | Can kiem tra truoc khi su dung |
| Do an toan | Khong an toan | An toan |
| Khuyen dung | Tranh su dung | Khuyen dung |

**Thuc hanh tot nhat**:
```typescript
// ✅ Khuyen dung: su dung unknown va kiem tra kieu
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log(value.toFixed(2));
  }
}

// ❌ Tranh: su dung any
function processValue(value: any): void {
  console.log(value.toUpperCase()); // Khong an toan
}
```

</details>

### Cau hoi 4: Kieu mang

Hay giai thich su khac biet giua cac khai bao kieu mang sau.

```typescript
let arr1: number[];
let arr2: Array<number>;
let arr3: [number, string];
let arr4: any[];
```

<details>
<summary>Nhan de xem dap an</summary>

```typescript
// 1. number[]: mang so (cach viet khuyen dung)
let arr1: number[] = [1, 2, 3];
arr1.push(4);        // ✅
arr1.push('4');     // ❌ Loi

// 2. Array<number>: mang generic (tuong duong voi number[])
let arr2: Array<number> = [1, 2, 3];
arr2.push(4);        // ✅
arr2.push('4');      // ❌ Loi

// 3. [number, string]: tuple (Tuple) - do dai va kieu co dinh
let arr3: [number, string] = [1, 'hello'];
arr3[0] = 2;         // ✅
arr3[1] = 'world';   // ✅
arr3[2] = true;      // ❌ Loi: do dai vuot qua 2
arr3.push('test');   // ⚠️ TypeScript cho phep, nhung khong khuyen dung

// 4. any[]: mang kieu bat ky (khong khuyen dung)
let arr4: any[] = [1, 'hello', true];
arr4.push(42);       // ✅
arr4.push('world');  // ✅
arr4.push(false);    // ✅ (nhung mat kiem tra kieu)
```

**Khuyen nghi su dung**:
- Mang thong thuong: su dung `number[]` hoac `Array<number>`
- Cau truc co dinh: su dung tuple `[type1, type2]`
- Tranh su dung `any[]`, uu tien su dung kieu cu the hoac `unknown[]`

</details>

### Cau hoi 5: void vs never

Hay giai thich su khac biet va cac truong hop su dung cua `void` va `never`.

```typescript
// Truong hop 1: void
function logMessage(): void {
  console.log('Hello');
}

// Truong hop 2: never
function throwError(): never {
  throw new Error('Error');
}

function infiniteLoop(): never {
  while (true) {
    // Vong lap vo han
  }
}
```

<details>
<summary>Nhan de xem dap an</summary>

**void**:
- **Muc dich**: Bieu thi ham khong tra ve gia tri
- **Dac diem**: Ham ket thuc binh thuong, chi khong tra ve gia tri
- **Truong hop su dung**: Ham xu ly su kien, ham co tac dung phu

```typescript
function logMessage(): void {
  console.log('Hello');
  // Ham ket thuc binh thuong, khong tra ve gia tri
}

function onClick(): void {
  // Xu ly su kien click, khong can gia tri tra ve
}
```

**never**:
- **Muc dich**: Bieu thi ham khong bao gio ket thuc binh thuong
- **Dac diem**: Ham se nem loi hoac di vao vong lap vo han
- **Truong hop su dung**: Xu ly loi, vong lap vo han, type guard

```typescript
function throwError(): never {
  throw new Error('Error');
  // Khong bao gio thuc thi den day
}

function infiniteLoop(): never {
  while (true) {
    // Khong bao gio ket thuc
  }
}

// Su dung trong type guard
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}
```

**So sanh su khac biet**:

| Dac diem | void | never |
| --- | --- | --- |
| Ket thuc ham | Ket thuc binh thuong | Khong bao gio ket thuc |
| Gia tri tra ve | undefined | Khong co gia tri tra ve |
| Truong hop su dung | Ham khong tra ve gia tri | Xu ly loi, vong lap vo han |

</details>

## 4. Best Practices

> Thuc hanh tot nhat

### Cach lam khuyen dung

```typescript
// 1. Uu tien su dung suy luan kieu
let age = 30;  // ✅ De TypeScript suy luan
let name = 'John';  // ✅

// 2. Chi dinh ro rang kieu cho tham so va gia tri tra ve cua ham
function calculate(a: number, b: number): number {
  return a + b;
}

// 3. Su dung unknown thay vi any
function processValue(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  }
}

// 4. Su dung kieu mang cu the
let numbers: number[] = [1, 2, 3];  // ✅
let names: Array<string> = ['John', 'Jane'];  // ✅

// 5. Su dung tuple de bieu dien cau truc co dinh
let person: [string, number] = ['John', 30];  // ✅
```

### Cach lam nen tranh

```typescript
// 1. Tranh su dung any
let value: any = 'hello';  // ❌

// 2. Tranh chu thich kieu khong can thiet
let age: number = 30;  // ⚠️ Co the don gian thanh let age = 30;

// 3. Tranh su dung kieu object
let user: object = { name: 'John' };  // ❌ Su dung interface tot hon

// 4. Tranh mang kieu hon hop (tru khi can thiet)
let mixed: (string | number)[] = ['hello', 42];  // ⚠️ Xem xet co thuc su can thiet khong
```

## 5. Interview Summary

> Tom tat phong van

### Tham khao nhanh

**Cac kieu co ban**:
- `number`, `string`, `boolean`, `null`, `undefined`
- `void` (khong co gia tri tra ve), `never` (khong bao gio tra ve)
- `any` (kieu bat ky, tranh su dung), `unknown` (kieu chua biet, khuyen dung)

**Chu thich kieu vs Suy luan**:
- Chu thich kieu: chi dinh ro rang `let age: number = 30`
- Suy luan kieu: tu dong suy luan `let age = 30`

**Kieu mang**:
- `number[]` hoac `Array<number>`: mang thong thuong
- `[number, string]`: tuple (cau truc co dinh)

### Vi du tra loi phong van

**Q: TypeScript co nhung kieu co ban nao?**

> "TypeScript cung cap nhieu kieu co ban, bao gom number, string, boolean, null, undefined. Con co mot so kieu dac biet: void bieu thi khong co gia tri tra ve, chu yeu dung cho ham; never bieu thi gia tri khong bao gio xay ra, dung cho ham khong bao gio tra ve; any la kieu bat ky nhung nen tranh su dung; unknown la kieu chua biet, an toan hon any, can kiem tra kieu truoc khi su dung. Ngoai ra con co kieu mang number[] va kieu tuple [number, string]."

**Q: Su khac biet giua any va unknown la gi?**

> "any se tat hoan toan kiem tra kieu, co the su dung truc tiep bat ky thuoc tinh hoac phuong thuc nao, nhung dieu nay khong an toan. unknown can kiem tra kieu truoc khi su dung, an toan hon. Vi du khi su dung unknown, can kiem tra kieu bang typeof truoc, xac nhan xong moi co the goi phuong thuc tuong ung. Khuyen su dung unknown hon la any."

## Reference

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [MDN - TypeScript](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/JavaScript_technologies_overview#typescript)
