---
id: login-lv1-session-vs-token
title: '[Lv1] Apa Perbedaan Antara Autentikasi Berbasis Session dan Berbasis Token?'
slug: /experience/login/lv1-session-vs-token
tags: [Experience, Interview, Login, Lv1]
---

> Pertanyaan lanjutan wawancara yang umum: Apakah Anda memahami perbedaan antara Session tradisional dan Token modern? Kuasai poin-poin kunci berikut untuk mengorganisasi pemikiran Anda dengan cepat.

---

## 1. Konsep Inti Kedua Model Autentikasi

### Autentikasi Berbasis Session

- **State disimpan di server**: Setelah login pertama pengguna, server membuat Session di memori atau database dan mengembalikan Session ID yang disimpan di Cookie.
- **Permintaan berikutnya bergantung pada Session ID**: Browser secara otomatis mengirim Session Cookie untuk domain yang sama, dan server mencari informasi pengguna yang sesuai menggunakan Session ID.
- **Umum pada aplikasi MVC tradisional / monolitik**: Server bertanggung jawab untuk merender halaman dan memelihara state pengguna.

### Autentikasi Berbasis Token (misalnya JWT)

- **State disimpan di klien**: Setelah login berhasil, Token (yang dapat membawa informasi dan izin pengguna) dihasilkan dan disimpan oleh frontend.
- **Token dikirim dengan setiap permintaan**: Biasanya ditempatkan di `Authorization: Bearer <token>`. Server memverifikasi signature untuk mengambil informasi pengguna.
- **Umum pada SPA / microservice**: Backend hanya perlu memverifikasi Token tanpa menyimpan state pengguna.

---

## 2. Perbandingan Alur Permintaan

| Langkah        | Berbasis Session                                        | Berbasis Token (JWT)                                                  |
| -------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Login berhasil | Server membuat Session, mengembalikan `Set-Cookie: session_id=...` | Server menerbitkan Token, mengembalikan JSON: `{ access_token, expires_in, ... }` |
| Penyimpanan    | Cookie browser (biasanya httpOnly)                      | Pilihan frontend: `localStorage`, `sessionStorage`, Cookie, Memory    |
| Permintaan berikutnya | Browser otomatis mengirim Cookie; server mencari info pengguna | Frontend secara manual menambahkan header `Authorization`            |
| Verifikasi     | Query Session Store                                     | Verifikasi signature Token, atau periksa blacklist/whitelist          |
| Logout         | Hapus Session server; kembalikan `Set-Cookie` untuk menghapus Cookie | Frontend menghapus Token; invalidasi paksa memerlukan blacklist atau rotasi key |

---

## 3. Ringkasan Kelebihan dan Kekurangan

| Aspek          | Berbasis Session                                                              | Berbasis Token (JWT)                                                              |
| -------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Kelebihan      | - Cookie dikirim otomatis, sederhana di sisi browser<br />- Session dapat menyimpan data dalam jumlah besar<br />- Mudah untuk mencabut dan memaksa logout | - Stateless, skalabel secara horizontal<br />- Cocok untuk SPA, mobile, microservice<br />- Token berfungsi lintas domain dan perangkat |
| Kekurangan     | - Server harus memelihara Session Store, mengonsumsi memori<br />- Deployment terdistribusi memerlukan sinkronisasi Session | - Token lebih besar, dikirimkan setiap permintaan<br />- Tidak dapat dicabut dengan mudah; memerlukan mekanisme blacklist/rotasi key |
| Risiko Keamanan | - Rentan terhadap serangan CSRF (Cookie dikirim otomatis)<br />- Jika Session ID bocor, harus segera dihapus | - Rentan terhadap XSS (jika disimpan di lokasi yang dapat dibaca)<br />- Jika Token dicuri sebelum kedaluwarsa, permintaan dapat diulang |
| Kasus Penggunaan | - Web tradisional (SSR) + domain yang sama<br />- Halaman yang dirender server | - RESTful API / GraphQL<br />- Aplikasi mobile, SPA, microservice                |

---

## 4. Bagaimana Cara Memilih?

### Ajukan Tiga Pertanyaan pada Diri Sendiri

1. **Apakah Anda memerlukan state login bersama lintas domain atau multi-platform?**
   - Ya → Berbasis Token lebih fleksibel.
   - Tidak → Berbasis Session lebih sederhana.

2. **Apakah deployment multi-server atau microservice?**
   - Ya → Berbasis Token mengurangi kebutuhan replikasi atau sentralisasi Session.
   - Tidak → Berbasis Session mudah dan aman.

3. **Apakah ada persyaratan keamanan tinggi (perbankan, sistem enterprise)?**
   - Persyaratan lebih tinggi → Berbasis Session + httpOnly Cookie + proteksi CSRF tetap mainstream.
   - API ringan atau layanan mobile → Berbasis Token + HTTPS + Refresh Token + strategi blacklist.

### Strategi Kombinasi Umum

- **Sistem internal enterprise**: Berbasis Session + sinkronisasi Redis / Database.
- **SPA Modern + Aplikasi Mobile**: Berbasis Token (Access Token + Refresh Token).
- **Microservice skala besar**: Berbasis Token (JWT) dengan verifikasi API Gateway.

---

## 5. Template Jawaban Wawancara

> "Session tradisional menyimpan state di server dan mengembalikan session ID di Cookie. Browser secara otomatis mengirim Cookie dengan setiap permintaan, menjadikannya cocok untuk Web App domain yang sama. Kekurangannya adalah server harus memelihara Session Store, dan deployment multi-server memerlukan sinkronisasi.
> Sebaliknya, berbasis Token (misalnya JWT) meng-encode informasi pengguna ke dalam Token yang disimpan di klien, dan frontend secara manual menyertakannya di Header dengan setiap permintaan. Pendekatan ini stateless, menjadikannya cocok untuk SPA dan microservice, dan lebih mudah untuk diskalakan.
> Mengenai keamanan, Session perlu mewaspadai CSRF, sementara Token perlu mewaspadai XSS. Jika saya memerlukan lintas domain, perangkat mobile, atau integrasi multi-layanan, saya akan memilih Token. Untuk sistem enterprise tradisional dengan server-side rendering, saya akan memilih Session dengan httpOnly Cookie."

---

## 6. Catatan Pertanyaan Lanjutan Wawancara

- Session → Fokus pada **proteksi CSRF, strategi sinkronisasi Session, dan frekuensi pembersihan**.
- Token → Fokus pada **lokasi penyimpanan (Cookie vs localStorage)**, **mekanisme Refresh Token**, dan **blacklist / rotasi key**.
- Anda dapat menyebutkan pendekatan kompromi umum yang digunakan di enterprise: menyimpan Token di `httpOnly Cookie`, yang juga dapat dipasangkan dengan CSRF Token.

---

## 7. Referensi

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Auth0: Session vs Token Based Authentication](https://auth0.com/blog/cookies-vs-tokens-definitive-guide/)
- [OWASP: Cross Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf)
