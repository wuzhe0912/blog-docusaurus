---
id: 2023-experience
title: 'Pengalaman 2023'
slug: /2023-experience
---

## Apa masalah teknis paling menantang yang pernah Anda selesaikan?

Tantangan terbaru adalah mengimplementasikan login WebAuthn agar pengguna web bisa melakukan autentikasi dengan pengalaman seperti Face ID/Touch ID yang sebanding dengan aplikasi native.

### Konteks

- Tujuan: UX login web yang lebih mulus dan lebih cepat
- Batasan: pengalaman produksi sebelumnya dengan WebAuthn masih terbatas
- Kompleksitas: perbedaan perilaku platform di iOS dan Android

### Apa yang membuatnya sulit

- Penyesuaian parameter dan opsi ceremony sangat sensitif
- Contoh dokumentasi belum sepenuhnya mencakup edge case produk nyata
- Pemicu biometrik Android membutuhkan penyesuaian kompatibilitas di sisi backend

### Apa yang saya lakukan

1. Memvalidasi kelayakan dengan referensi prototipe
2. Menyelaraskan alur keputusan registrasi/login dengan PM dan backend
3. Menguji opsi authenticator dan perilaku fallback secara iteratif
4. Bekerja sama dengan backend untuk menyesuaikan challenge dan penanganan credential demi konsistensi lintas perangkat

### Hasil

- Pengalaman login web menjadi lebih mendekati alur aplikasi native
- Dikombinasikan dengan peningkatan PWA, friksi pengguna berkurang
- Tim memperoleh pengetahuan implementasi yang bisa dipakai ulang untuk peningkatan autentikasi berikutnya

### Referensi yang digunakan saat implementasi

- [webauthn.io](https://webauthn.io/)
- [Introduction to WebAuthn API](https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285)
