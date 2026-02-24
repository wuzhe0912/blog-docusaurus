---
id: basic-types
title: '[Easy] Tipe Dasar dan Anotasi Tipe'
slug: /basic-types
tags: [TypeScript, Quiz, Easy]
---

## 1. Apa saja tipe dasar TypeScript?

> Tipe dasar apa yang disediakan TypeScript?

TypeScript menambahkan sistem tipe statis di atas JavaScript. Anda bisa memberi anotasi pada variabel, parameter fungsi, dan nilai return untuk menangkap kesalahan sebelum runtime.

### Tipe primitif umum

```ts
let age: number = 30;
let price: number = 99.99;

let userName: string = 'John';
let message: string = `Hello, ${userName}`;

let isActive: boolean = true;
```

### `null` dan `undefined`

```ts
let emptyValue: null = null;
let notAssigned: undefined = undefined;
```

Dengan `strictNullChecks` diaktifkan, `null` dan `undefined` tidak bisa ditugaskan ke setiap tipe.

## 2. Apa itu tipe objek, array, dan tuple?

### Tipe objek (Object Type)

```ts
type User = {
  id: number;
  name: string;
  email?: string;
};

const user: User = {
  id: 1,
  name: 'Pitt',
};
```

### Tipe array (Array Type)

```ts
const scores: number[] = [80, 90, 100];
const tags: Array<string> = ['ts', 'react'];
```

### Tipe tuple (Tuple Type)

Tuple memiliki panjang tetap dan posisi yang tetap.

```ts
const point: [number, number] = [10, 20];
const userRecord: [number, string, boolean] = [1, 'Alice', true];
```

## 3. Apa itu tipe union dan literal?

### Tipe union (Union Type)

```ts
let id: string | number = 'A001';
id = 1001;
```

### Tipe literal (Literal Type)

```ts
type Status = 'idle' | 'loading' | 'success' | 'error';

let requestStatus: Status = 'idle';
requestStatus = 'success';
```

Union dan literal berguna untuk memodelkan state yang terbatas.

## 4. Apa itu `any`, `unknown`, `void`, dan `never`?

### `any`

`any` menonaktifkan keamanan tipe. Gunakan hanya sebagai jalan keluar sementara.

```ts
let data: any = 10;
data = 'text';
data = { ok: true };
```

### `unknown`

`unknown` lebih aman dari `any`. Anda harus mempersempit tipe sebelum menggunakan.

```ts
function printLength(value: unknown): void {
  if (typeof value === 'string') {
    console.log(value.length);
  }
}
```

### `void`

`void` biasanya berarti sebuah fungsi tidak mengembalikan nilai.

```ts
function logMessage(message: string): void {
  console.log(message);
}
```

### `never`

`never` berarti sebuah nilai tidak pernah bisa terjadi.

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

## 5. Bagaimana cara kerja anotasi tipe fungsi?

```ts
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;
```

### Parameter opsional dan default

```ts
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}

function formatPrice(price: number, currency: string = 'USD'): string {
  return `${currency} ${price.toFixed(2)}`;
}
```

## 6. Apa itu type inference?

TypeScript bisa menyimpulkan tipe dari nilai.

```ts
let count = 0; // disimpulkan sebagai number
const framework = 'React'; // disimpulkan sebagai string literal 'React'
```

Anda tidak perlu anotasi di mana-mana. Tambahkan anotasi eksplisit di mana API atau batasan harus jelas.

## 7. Kesalahan umum dan best practice

### Kesalahan umum

- Penggunaan `any` berlebihan
- Lupa mode `strict`
- Menggunakan tipe luas di mana union literal lebih baik

### Best practice

- Aktifkan strict mode di `tsconfig.json`
- Lebih baik `unknown` daripada `any`
- Gunakan tipe union/literal untuk pemodelan state
- Buat signature fungsi publik secara eksplisit

## 8. Jawaban cepat wawancara

### Q1: Mengapa menggunakan tipe dasar TypeScript?

Untuk menangkap ketidakcocokan tipe pada waktu kompilasi dan meningkatkan tooling IDE.

### Q2: `any` vs `unknown`?

`any` keluar dari pengecekan. `unknown` memaksa penyempitan tipe sebelum penggunaan.

### Q3: Kapan harus menggunakan tuple daripada array?

Gunakan tuple ketika posisi dan panjang tetap dan bermakna.
