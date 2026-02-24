---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Perbandingan (Comparison)

| Properti       | `cookie`                                                                                           | `sessionStorage`              | `localStorage`                  |
| -------------- | -------------------------------------------------------------------------------------------------- | ----------------------------- | ------------------------------- |
| Masa berlaku   | Dihapus saat halaman ditutup kecuali ada pengaturan kedaluwarsa (`Expires`) atau usia maksimum (`Max-Age`) | Dihapus saat tab ditutup      | Bertahan sampai dihapus secara manual |
| Permintaan HTTP| Ya, dikirim ke server melalui header Cookie                                                        | Tidak                         | Tidak                           |
| Batas penyimpanan | 4KB                                                                                             | 5MB                           | 5MB                             |
| Cakupan akses  | Lintas window/tab                                                                                  | Hanya tab yang sama           | Lintas window/tab               |
| Keamanan       | JavaScript tidak bisa mengakses `HttpOnly cookies`                                                 | Tidak ada perlindungan khusus secara default | Tidak ada perlindungan khusus secara default |

## Terminologi

> Apa itu persistent cookie?

Persistent cookie (juga disebut permanent cookie) menyimpan data di browser pengguna untuk jangka waktu yang lama.
Seperti yang disebutkan di atas, ini dilakukan dengan mengatur nilai kedaluwarsa (`Expires` atau `Max-Age`).

## Pengalaman Praktis (Practical Experience)

### `cookie`

#### 1. Verifikasi keamanan

Beberapa proyek legacy memiliki keamanan yang lemah dan sering mengalami pencurian akun, yang secara signifikan meningkatkan biaya operasional.
Saya menggunakan [Fingerprint](https://fingerprint.com/) terlebih dahulu (versi komunitas secara resmi digambarkan sekitar 60% akurat, dan versi berbayar mencakup 20.000 permintaan gratis per bulan).
Setiap pengguna yang login diidentifikasi sebagai visit ID unik berdasarkan parameter perangkat dan geolokasi. Kemudian, memanfaatkan fakta bahwa cookie dikirim dengan setiap permintaan HTTP, backend bisa memverifikasi apakah pengguna telah berganti perangkat atau menunjukkan perpindahan lokasi yang mencurigakan. Jika anomali terdeteksi, alur login secara paksa memicu verifikasi OTP (email atau SMS, tergantung kebijakan perusahaan).

#### 2. URL kode referral

Saat mengoperasikan website produk, affiliate marketing adalah hal umum: setiap promotor mendapat URL khusus untuk atribusi.
Untuk memastikan pengguna yang diperoleh melalui traffic tersebut tetap dikreditkan ke promotor, saya mengimplementasikan solusi dengan atribut `expires` cookie. Begitu pengguna masuk melalui link referral, kode referral tetap berlaku selama 24 jam (jendela waktu bisa dikonfigurasi oleh operasional). Bahkan jika pengguna menghapus parameter referral dari URL, pendaftaran tetap membaca nilai dari `cookie` sampai kedaluwarsa secara otomatis.

### `localStorage`

#### 1. Menyimpan preferensi pengguna

- Umum digunakan untuk menyimpan preferensi pengguna seperti dark mode dan locale i18n.
- Bisa juga menyimpan token login.
