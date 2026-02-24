---
id: generics
title: '[Medium] Generics'
slug: /generics
tags: [TypeScript, Quiz, Medium]
---

## 1. Apa itu generics?

> Masalah apa yang diselesaikan generics di TypeScript?

Generics memungkinkan Anda menulis kode yang dapat digunakan ulang dan type-safe tanpa harus meng-hardcode satu tipe konkret.

Tanpa generics, Anda sering menduplikasi fungsi untuk setiap tipe. Dengan generics, satu implementasi bisa bekerja untuk banyak tipe sambil mempertahankan informasi tipe.

## 2. Fungsi generic (Generic Functions)

### Sintaks dasar

```ts
function identity<T>(value: T): T {
  return value;
}

const n = identity<number>(123);
const s = identity('hello'); // tipe disimpulkan sebagai string
```

### Helper array generic

```ts
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstNumber = firstItem([1, 2, 3]);
const firstString = firstItem(['a', 'b']);
```

## 3. Constraint generic (Generic Constraints)

Terkadang Anda memerlukan tipe generic dengan field yang diperlukan.

```ts
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength('TypeScript');
getLength([1, 2, 3]);
// getLength(123); // Error: number tidak punya length
```

`extends` di sini berarti "harus memenuhi bentuk ini".

## 4. Parameter tipe ganda (Multiple Type Parameters)

```ts
function toPair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const pair = toPair('id', 1001); // [string, number]
```

Ini umum di map, dictionary, dan utilitas transformasi data.

## 5. Interface dan type alias generic

### Interface generic

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const userResponse: ApiResponse<{ id: number; name: string }> = {
  success: true,
  data: { id: 1, name: 'Pitt' },
};
```

### Type alias generic

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };
```

## 6. Class generic (Generic Classes)

```ts
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }
}

const numberQueue = new Queue<number>();
numberQueue.enqueue(10);
```

## 7. Tipe generic default (Default Generic Types)

Anda bisa mendefinisikan tipe fallback.

```ts
type ApiResult<T = string> = {
  data: T;
  status: number;
};

const a: ApiResult = { data: 'ok', status: 200 };
const b: ApiResult<number> = { data: 1, status: 200 };
```

## 8. `keyof` dengan generics

```ts
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Alex' };
const name = pick(user, 'name'); // string
```

Pola ini adalah inti dari banyak utility type.

## 9. Kesalahan umum dan best practice

### Kesalahan umum

- Menggunakan terlalu banyak parameter generic tanpa tujuan yang jelas
- Menamai semuanya `T` di API yang kompleks
- Kembali ke `any` daripada constraint yang tepat

### Best practice

- Gunakan nama deskriptif untuk kasus kompleks (`TItem`, `TValue`)
- Tambahkan constraint di mana perilaku bergantung pada bentuk
- Utamakan inference dulu, argumen tipe eksplisit hanya saat diperlukan
- Jaga API generic tetap kecil dan fokus

## 10. Jawaban cepat wawancara

### Q1: Apa manfaat terbesar dari generics?

Kode yang dapat digunakan ulang dengan keamanan tipe pada waktu kompilasi.

### Q2: Apa arti `T extends U`?

`T` harus bisa di-assign ke `U`; ini adalah constraint generic.

### Q3: Kapan harus menghindari generics?

Ketika abstraksi tidak meningkatkan kejelasan atau hanya mendukung satu tipe konkret.
