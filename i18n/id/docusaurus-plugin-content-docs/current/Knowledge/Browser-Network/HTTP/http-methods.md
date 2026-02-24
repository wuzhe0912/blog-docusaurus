---
id: http-methods
title: 📄 HTTP Methods
slug: /http-methods
---

## 1. Apa itu RESTful API?

RESTful API mengikuti gaya desain terstandarisasi yang memfasilitasi komunikasi antara sistem yang berbeda di jaringan. Untuk mematuhi prinsip REST, sebuah API harus mudah diprediksi dan dipahami. Sebagai pengembang frontend, fokus utamanya adalah pada tiga aspek:

- **URL Path**: Mengidentifikasi cakupan permintaan klien, misalnya:
  - `/products`: Kemungkinan mengembalikan daftar produk
  - `/products/abc`: Memberikan detail untuk produk dengan ID "abc"
- **HTTP Methods**: Mendefinisikan tindakan spesifik yang akan dilakukan:
  - `GET`: Digunakan untuk mengambil data
  - `POST`: Digunakan untuk membuat data baru
  - `PUT`: Digunakan untuk memperbarui data yang ada
  - `DELETE`: Digunakan untuk menghapus data
- **Status Code**: Memberikan indikasi cepat apakah permintaan berhasil dan, jika tidak, di mana masalahnya. Status code yang umum termasuk:
  - `200`: Berhasil
  - `404`: Resource yang diminta tidak ditemukan
  - `500`: Error server

## 2. Jika GET juga bisa membawa data dalam permintaan, mengapa kita harus menggunakan POST?

> Karena GET juga bisa mengirim permintaan dengan data, mengapa kita masih perlu menggunakan POST?

Ini terutama berdasarkan empat pertimbangan:

1. **Keamanan**: Karena data GET ditambahkan ke URL, data sensitif mudah terekspos. POST menempatkan data di request body, yang relatif lebih aman.
2. **Batas Ukuran Data**: Dengan GET, browser dan server memberlakukan batas panjang URL (meskipun sedikit berbeda antar browser, umumnya sekitar 2048 byte), yang membatasi jumlah data. POST secara nominal tidak memiliki batas, tetapi dalam praktiknya, middleware biasanya dikonfigurasi untuk membatasi ukuran data guna mencegah serangan berbahaya yang membanjiri dengan payload besar. Misalnya, `body-parser` dari Express.
3. **Kejelasan Semantik**: Memastikan pengembang dapat memahami tujuan permintaan dengan jelas. GET biasanya digunakan untuk mengambil data, sedangkan POST lebih cocok untuk membuat atau memperbarui data.
4. **Immutabilitas**: Dalam protokol HTTP, metode GET dirancang untuk "aman" -- berapa pun jumlah permintaan yang dikirim, tidak ada kekhawatiran tentang memodifikasi data di server.

## 3. Apa fungsi metode PUT dalam HTTP?

> Apa tujuan dari metode PUT?

Metode ini terutama memiliki dua tujuan:

1. Memperbarui resource yang ada (misalnya, memodifikasi informasi pengguna)
2. Membuat resource baru jika belum ada

### Contoh

```js
const axios = require('axios');

async function updateUser(userId, newName) {
  const url = `https://api.example.com/users/${userId}`; // URL API
  const data = {
    name: newName,
  };

  try {
    const response = await axios.put(url, data); // Jalankan permintaan PUT
    console.log('Pengguna diperbarui:', response.data); // Tampilkan info pengguna yang diperbarui
  } catch (error) {
    console.log('Error memperbarui pengguna:', error); // Tampilkan info error
  }
}

updateUser(1, 'Pitt Wu');
```
