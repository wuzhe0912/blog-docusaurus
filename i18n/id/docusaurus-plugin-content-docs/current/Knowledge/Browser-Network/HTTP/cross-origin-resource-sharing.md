---
id: cross-origin-resource-sharing
title: 📄 CORS
slug: /cross-origin-resource-sharing
---

## 1. Apa perbedaan antara JSONP dan CORS?

JSONP (JSON with Padding) dan CORS (Cross-Origin Resource Sharing) adalah dua teknik untuk mengimplementasikan permintaan cross-origin, yang memungkinkan halaman web meminta data dari domain yang berbeda.

### JSONP

JSONP adalah teknik lama yang digunakan untuk mengatasi pembatasan same-origin policy, yang memungkinkan halaman web meminta data dari origin yang berbeda (domain, protokol, atau port). Karena pemuatan tag `<script>` tidak tunduk pada same-origin policy, JSONP bekerja dengan menambahkan tag `<script>` secara dinamis yang mengarah ke URL yang mengembalikan data JSON. Respons dari URL tersebut dibungkus dalam pemanggilan fungsi, dan JavaScript di halaman mendefinisikan fungsi ini terlebih dahulu untuk menerima data.

```javascript
// sisi klien
function receiveData(jsonData) {
  console.log(jsonData);
}

let script = document.createElement('script');
script.src = 'http://example.com/data?callback=receiveData';
document.body.appendChild(script);
```

```javascript
// sisi server
receiveData({ name: 'PittWu', type: 'player' });
```

Kekurangannya adalah risiko keamanan yang lebih tinggi (karena dapat menjalankan JavaScript sembarang) dan hanya mendukung permintaan GET.

### CORS

CORS adalah teknik yang lebih aman dan modern dibandingkan JSONP. Teknik ini menggunakan header HTTP `Access-Control-Allow-Origin` untuk menginformasikan browser bahwa permintaan tersebut diizinkan. Server mengonfigurasi header CORS yang relevan untuk menentukan origin mana yang dapat mengakses resource-nya.

Misalnya, jika frontend di `http://client.com` ingin mengakses resource di `http://api.example.com`, `api.example.com` perlu menyertakan header HTTP berikut dalam responsnya:

```http
Access-Control-Allow-Origin: http://client.com
```

Atau untuk mengizinkan origin mana pun:

```http
Access-Control-Allow-Origin: *
```

CORS dapat digunakan dengan jenis permintaan HTTP apa pun dan merupakan cara yang terstandarisasi dan aman untuk melakukan permintaan cross-origin.
