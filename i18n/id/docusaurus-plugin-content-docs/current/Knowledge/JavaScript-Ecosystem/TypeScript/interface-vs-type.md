---
id: interface-vs-type
title: '[Medium] Interface vs Type Alias'
slug: /interface-vs-type
tags: [TypeScript, Quiz, Medium]
---

## 1. Apa itu `interface` dan `type`?

> Bagaimana `interface` dan `type` berbeda di TypeScript?

Keduanya mendefinisikan tipe, dan keduanya tumpang tindih untuk banyak kasus penggunaan bentuk objek.

### `interface`

```ts
interface User {
  id: number;
  name: string;
  email?: string;
}
```

### `type`

```ts
type User = {
  id: number;
  name: string;
  email?: string;
};
```

Untuk pemodelan objek dasar, keduanya valid.

## 2. Perbedaan utama (Key Differences)

| Topik | `interface` | `type` |
| --- | --- | --- |
| Bentuk objek | Sangat baik | Sangat baik |
| Alias primitif | Tidak didukung | Didukung |
| Tipe union | Tidak didukung langsung | Didukung |
| Tipe tuple | Tidak didukung langsung | Didukung |
| Declaration merging | Didukung | Tidak didukung |
| Tipe mapped/conditional | Terbatas | First-class |

## 3. Declaration merging

Deklarasi `interface` dengan nama yang sama digabungkan.

```ts
interface Config {
  apiBase: string;
}

interface Config {
  timeout: number;
}

const cfg: Config = {
  apiBase: '/api',
  timeout: 5000,
};
```

`type` tidak bisa dibuka kembali dengan nama yang sama.

## 4. Union, tuple, dan komposisi lanjutan

Ini natural dengan `type`.

```ts
type Status = 'idle' | 'loading' | 'success' | 'error';
type Point = [number, number];

type ApiSuccess<T> = { ok: true; data: T };
type ApiFail = { ok: false; message: string };
type ApiResult<T> = ApiSuccess<T> | ApiFail;
```

## 5. Extending dan combining

### Interface extends

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}
```

### Type intersection

```ts
type Animal = { name: string };
type Dog = Animal & { bark(): void };
```

Kedua pola umum digunakan. Pilih yang sesuai dengan konvensi tim Anda.

## 6. Tipe fungsi (Function Types)

```ts
interface Formatter {
  (value: string): string;
}

type Parser = (input: string) => number;
```

Keduanya bekerja baik untuk signature fungsi.

## 7. Panduan keputusan praktis

Gunakan `interface` ketika:

- Anda terutama memodelkan kontrak objek
- Anda menginginkan perilaku declaration merging
- Anda mendefinisikan kontrak API publik di library

Gunakan `type` ketika:

- Anda memerlukan alias union/tuple/primitif
- Anda mengandalkan tipe mapped atau conditional
- Anda ingin menyusun logika tipe yang canggih

## 8. Rekomendasi untuk sebagian besar tim

- Mulai dengan `interface` untuk kontrak objek sederhana
- Gunakan `type` untuk union, tuple, dan pemrograman level tipe
- Jaga konsistensi di setiap codebase untuk mengurangi beban kognitif

## 9. Jawaban cepat wawancara

### Q1: Apakah salah satu secara tegas lebih baik?

Tidak. Keduanya sangat tumpang tindih; perbedaan muncul di skenario lanjutan.

### Q2: Mengapa penulis library mungkin lebih suka `interface`?

Declaration merging bisa meningkatkan extensibility untuk consumer.

### Q3: Mengapa kode aplikasi mungkin lebih suka `type`?

Kode aplikasi sering menggunakan union dan komposisi bergaya utility.
