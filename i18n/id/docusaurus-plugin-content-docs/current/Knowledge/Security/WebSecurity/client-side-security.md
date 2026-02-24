---
id: client-side-security
title: "[Easy] 📄 Keamanan Sisi Klien"
slug: /client-side-security
---

## 1. Bisakah Anda menjelaskan apa itu CSP (Content Security Policy)?

> Bisakah Anda menjelaskan apa itu CSP (Content Security Policy)?

Pada prinsipnya, CSP adalah mekanisme yang meningkatkan keamanan halaman web. Dengan mengonfigurasi HTTP header, CSP membatasi sumber dari mana konten halaman dapat dimuat (whitelist), mencegah penyerang jahat mencuri data pengguna melalui script yang diinjeksi.

Dari perspektif frontend, untuk mencegah serangan XSS (Cross-Site Scripting), framework modern umum digunakan untuk pengembangan karena menyediakan mekanisme proteksi bawaan. Misalnya, JSX di React secara otomatis melakukan escape HTML, dan Vue menggunakan binding `{{ data }}` yang juga secara otomatis melakukan escape tag HTML.

Meskipun tindakan yang dapat dilakukan frontend di area ini terbatas, masih ada beberapa optimasi:

1. Untuk formulir yang menerima input pengguna, Anda dapat memvalidasi karakter khusus untuk mencegah serangan (meskipun sulit mencakup semua skenario). Lebih umum untuk membatasi panjang input untuk mengontrol konten sisi klien, atau membatasi tipe input.
2. Saat mereferensikan link eksternal, utamakan URL HTTPS daripada URL HTTP.
3. Untuk situs web statis, Anda dapat membatasi konten melalui meta tag, sebagai berikut:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: Secara default, hanya izinkan pemuatan resource dari origin yang sama (domain yang sama).
- `img-src https://*`: Hanya izinkan pemuatan gambar melalui HTTPS.
- `child-src 'none'`: Larang penyematan resource anak eksternal apa pun, seperti `<iframe>`.

## 2. Apa itu serangan XSS (Cross-site scripting)?

> Apa itu serangan XSS (Cross-Site Scripting)?

XSS, atau Cross-Site Scripting, adalah serangan di mana penyerang menginjeksi script jahat yang dieksekusi di browser pengguna, memungkinkan mereka mencuri data sensitif seperti cookie, atau langsung memodifikasi konten halaman untuk mengarahkan pengguna ke situs web jahat.

### Mencegah Stored XSS

Penyerang mungkin sengaja menginjeksi HTML atau script jahat ke dalam database melalui formulir komentar. Selain escaping di backend, framework frontend modern seperti JSX di React dan sintaks template `{{ data }}` di Vue juga melakukan escaping untuk mengurangi risiko serangan XSS.

### Mencegah Reflected XSS

Hindari menggunakan `innerHTML` untuk memanipulasi DOM, karena dapat mengeksekusi tag HTML. Disarankan untuk menggunakan `textContent` sebagai gantinya.

### Mencegah DOM-based XSS

Pada prinsipnya, kita harus menghindari membiarkan pengguna langsung menyisipkan HTML ke halaman. Jika diperlukan oleh kasus penggunaan tertentu, framework menyediakan direktif untuk membantu — misalnya, `dangerouslySetInnerHTML` di React dan `v-html` di Vue — yang membantu mencegah XSS secara otomatis. Jika JavaScript native diperlukan, utamakan penggunaan `textContent`, `createElement`, dan `setAttribute` untuk memanipulasi DOM.
