---
id: network-protocols
title: 📄 Network Protocols
slug: /network-protocols
---

## 1. Jelaskan TCP, HTTP, HTTPS, WebSocket

1. **TCP (Transmission Control Protocol)**:
   TCP adalah protokol yang andal dan berorientasi koneksi yang digunakan untuk mentransmisikan data secara andal antara dua komputer di internet. TCP menjamin urutan paket dan keandalan -- artinya data tiba di tujuan secara utuh tanpa memandang kondisi jaringan.

2. **HTTP (Hypertext Transfer Protocol)**:
   HTTP adalah protokol untuk mentransmisikan hypertext (yaitu halaman web). HTTP dibangun di atas TCP dan menyediakan cara bagi browser dan server untuk berkomunikasi. HTTP bersifat stateless, artinya server tidak menyimpan informasi apa pun tentang pengguna.

3. **HTTPS (Hypertext Transfer Protocol Secure)**:
   HTTPS adalah versi aman dari HTTP. HTTPS mengenkripsi transmisi data HTTP melalui protokol SSL/TLS, melindungi keamanan data yang dipertukarkan dan mencegah serangan man-in-the-middle, sehingga memastikan privasi dan integritas data.

4. **WebSocket**:
   Protokol WebSocket menyediakan cara untuk membuat koneksi persisten antara klien dan server, memungkinkan transmisi data dua arah secara real-time setelah koneksi dibuat. Ini berbeda dari permintaan HTTP tradisional, di mana setiap transmisi membutuhkan pembuatan koneksi baru. WebSocket lebih cocok untuk komunikasi real-time dan aplikasi yang membutuhkan pembaruan data cepat.

## 2. Apa itu Three Way Handshake?

Three-way handshake adalah proses pembuatan koneksi antara server dan klien dalam jaringan TCP/IP. Proses ini melibatkan tiga langkah untuk mengonfirmasi bahwa kemampuan kirim dan terima kedua belah pihak berfungsi normal, sekaligus menyinkronkan Initial Sequence Number (ISN) untuk memastikan integritas dan keamanan data.

### Jenis Pesan TCP

Sebelum memahami langkahnya, Anda perlu mengetahui fungsi utama setiap jenis pesan:

| Pesan | Deskripsi |
| ------- | ------------------------------------------------------------------------------ |
| SYN     | Digunakan untuk memulai dan membuat koneksi, serta menyinkronkan sequence number |
| ACK     | Digunakan untuk mengonfirmasi penerimaan SYN |
| SYN-ACK | Acknowledgment sinkronisasi -- mengirim SYN sendiri bersama dengan ACK |
| FIN     | Mengakhiri koneksi |

### Langkah-langkah

1. Klien memulai koneksi dengan server dan mengirim pesan SYN, menginformasikan server bahwa klien siap berkomunikasi dan berapa sequence number awalnya.
2. Setelah menerima SYN, server menyiapkan respons. Server menambahkan sequence number SYN yang diterima dengan 1 dan mengirimkannya kembali melalui ACK, sekaligus mengirimkan pesan SYN-nya sendiri.
3. Klien mengonfirmasi respons server. Kedua belah pihak telah membuat koneksi yang stabil dan mulai mentransmisikan data.

### Contoh

Host A mengirim paket TCP SYN yang berisi sequence number acak, anggap saja 1000:

```bash
Host A ===(SYN=1000)===> Server
```

Server perlu mengakui sequence number Host A, jadi menambahkannya dengan 1 dan juga mengirim SYN-nya sendiri:

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Setelah menerima SYN server, Host A mengirim acknowledgment dengan menambahkan sequence number server dengan 1:

```bash
Host A ===(ACK=2001)===> Server
```

### Apakah two-way handshake bisa berhasil?

1. Tujuan three-way handshake adalah untuk mengonfirmasi bahwa baik klien maupun server dapat mengirim dan menerima dengan benar. Dengan hanya dua handshake, server tidak akan dapat memverifikasi kemampuan penerimaan klien.
2. Tanpa handshake ketiga, klien tidak dapat menerima sequence number server dan oleh karena itu tidak dapat mengirim konfirmasi. Ini dapat membahayakan keamanan data.
3. Dalam kondisi jaringan yang buruk, data mungkin tiba pada waktu yang berbeda. Jika data lama dan baru tiba tidak berurutan, membuat koneksi tanpa konfirmasi SYN handshake ketiga dapat menyebabkan error jaringan.

### Apa itu ISN?

ISN singkatan dari Initial Sequence Number. ISN memberitahu penerima sequence number apa yang akan digunakan pengirim saat mentransmisikan data. Ini adalah sequence number yang dihasilkan secara acak untuk mencegah penyerang pihak ketiga menebaknya dan memalsukan pesan.

### Pada titik mana selama three-way handshake transmisi data dapat dimulai?

Handshake pertama dan kedua adalah untuk mengonfirmasi kemampuan kirim/terima kedua belah pihak dan tidak dapat membawa data. Jika data dapat ditransmisikan selama handshake pertama, pihak ketiga yang berbahaya dapat membanjiri server dengan data palsu, memaksa server menggunakan memori untuk buffering -- menciptakan peluang untuk serangan.

Hanya selama handshake ketiga, setelah kedua belah pihak mengonfirmasi sinkronisasi dan berada dalam state terhubung, transmisi data diizinkan.

### Referensi

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)

## 3. Jelaskan mekanisme caching HTTP

Mekanisme caching HTTP adalah teknik yang digunakan dalam protokol HTTP untuk menyimpan sementara (atau "cache") data web, yang bertujuan untuk mengurangi beban server, menurunkan latensi, dan meningkatkan kecepatan pemuatan halaman. Ada beberapa strategi caching utama:

1. **Freshness (Strong Cache)**: Dengan mengatur header respons `Expires` atau `Cache-Control: max-age`, data dapat dianggap segar selama durasi tertentu. Klien dapat menggunakan data yang di-cache secara langsung tanpa mengonfirmasi ke server.

2. **Validation Cache**: Menggunakan header respons `Last-Modified` dan `ETag`, klien dapat mengirim permintaan bersyarat ke server. Jika data belum dimodifikasi, server mengembalikan status code 304 (Not Modified), yang menunjukkan bahwa data cache lokal dapat digunakan.

3. **Negotiation Cache**: Pendekatan ini mengandalkan header respons `Vary`. Server memutuskan apakah akan menyediakan versi konten cache yang berbeda berdasarkan permintaan klien (misalnya, `Accept-Language`).

4. **No-store**: Jika `Cache-Control: no-store` diatur, data tidak boleh di-cache sama sekali, dan setiap permintaan harus mengambil data terbaru dari server.

Pilihan strategi caching bergantung pada faktor seperti jenis data dan frekuensi pembaruan. Strategi caching yang efektif dapat meningkatkan performa aplikasi web secara signifikan.

### Service Worker

Dari pengalaman pribadi, setelah menyiapkan PWA untuk Web App, Anda dapat mendaftarkan gaya dasar, logo, atau bahkan halaman `offline.html` di `service-worker.js`. Dengan cara ini, bahkan ketika pengguna sedang offline, melalui mekanisme caching ini, mereka masih dapat mengetahui status website atau jaringan saat ini, menjaga pengalaman pengguna yang wajar.
