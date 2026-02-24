---
id: typescript-vs-javascript
title: '[Easy] TypeScript vs JavaScript'
slug: /typescript-vs-javascript
tags: [TypeScript, Quiz, Easy]
---

## 1. Apa itu TypeScript?

> Bagaimana hubungan TypeScript dengan JavaScript?

TypeScript adalah superset dari JavaScript yang menambahkan typing statis dan tooling developer.

- Semua JavaScript yang valid adalah TypeScript yang valid
- Kode TypeScript dikompilasi menjadi JavaScript sebelum dijalankan
- Error tipe ditemukan selama pengembangan, bukan hanya saat runtime

## 2. TypeScript vs JavaScript secara sekilas

| Topik | JavaScript | TypeScript |
| --- | --- | --- |
| Sistem tipe | Dinamis | Statis + disimpulkan |
| Langkah kompilasi | Tidak diperlukan | Diperlukan (`tsc` atau bundler) |
| Deteksi error | Sebagian besar runtime | Waktu kompilasi + runtime |
| Dukungan refactoring | Dasar | Kuat |
| Kurva pembelajaran | Lebih rendah | Lebih tinggi |

## 3. Perbandingan contoh

### JavaScript

```js
function add(a, b) {
  return a + b;
}

console.log(add(1, '2')); // "12" (mungkin tidak diinginkan)
```

### TypeScript

```ts
function add(a: number, b: number): number {
  return a + b;
}

// add(1, '2'); // error waktu kompilasi
console.log(add(1, 2));
```

TypeScript membantu mencegah bug coercion yang tidak disengaja.

## 4. Alur kompilasi (Compilation Flow)

1. Tulis `.ts` atau `.tsx`
2. Periksa tipe dengan kompiler TypeScript
3. Hasilkan JavaScript
4. Jalankan JavaScript di browser atau Node.js

Anda tetap mengirimkan JavaScript ke production.

## 5. Keunggulan TypeScript

- Deteksi bug lebih awal
- Autocomplete dan navigasi IDE yang lebih baik
- Refactoring skala besar yang lebih aman
- Kontrak API yang lebih jelas antar tim

## 6. Trade-off TypeScript

- Memerlukan setup (`tsconfig`, build pipeline)
- Menambahkan sintaks tipe dan konsep
- Bisa terlalu verbose jika disalahgunakan

## 7. Kapan memilih yang mana

Pilih JavaScript ketika:

- Kecepatan prototype adalah prioritas utama
- Cakupan proyek kecil dan berumur pendek

Pilih TypeScript ketika:

- Ukuran proyek atau tim menengah atau besar
- Pemeliharaan jangka panjang penting
- API publik memerlukan kontrak yang kuat

## 8. Strategi migrasi dari JavaScript

1. Aktifkan TypeScript dengan `allowJs`
2. Konversi modul berisiko tinggi terlebih dahulu
3. Aktifkan `strict` secara bertahap
4. Ganti `any` dengan tipe yang tepat seiring waktu

Jalur inkremental ini meminimalkan gangguan.

## 9. Jawaban cepat wawancara

### Q1: Apakah TypeScript dieksekusi langsung oleh browser?

Tidak. Browser mengeksekusi JavaScript, jadi TypeScript harus dikompilasi terlebih dahulu.

### Q2: Apakah TypeScript menjamin nol bug runtime?

Tidak. TypeScript menangkap banyak bug terkait tipe, tapi error logika runtime tetap bisa terjadi.

### Q3: Apakah TypeScript wajib untuk React?

Tidak. React bekerja dengan JavaScript dan TypeScript; TypeScript opsional tapi umum di aplikasi production.
