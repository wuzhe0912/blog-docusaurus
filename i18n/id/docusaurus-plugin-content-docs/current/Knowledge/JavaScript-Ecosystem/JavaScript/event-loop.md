---
id: event-loop
title: '[Medium] 📄 Event Loop'
slug: /event-loop
tags: [JavaScript, Quiz, Medium]
---

## 1. Mengapa JavaScript memerlukan asinkron? Jelaskan callback dan event loop

> Mengapa JavaScript memerlukan perilaku asinkron? Jelaskan callback dan event loop.

JavaScript pada dasarnya bersifat single-threaded. Salah satu tugas utamanya adalah memanipulasi DOM browser. Jika banyak thread memodifikasi node yang sama secara bersamaan, perilakunya akan menjadi sangat kompleks. Untuk menghindari hal tersebut, JavaScript berjalan dengan model single-threaded.

Perilaku asinkron adalah solusi praktis di atas model tersebut.
Jika sebuah operasi perlu menunggu 2 detik, browser tidak bisa hanya membeku. Browser mengeksekusi tugas sinkron terlebih dahulu, sementara tugas asinkron diantrekan di task queue.

Konteks eksekusi sinkron dapat dipahami sebagai call stack.
Browser mengeksekusi tugas di call stack terlebih dahulu. Ketika call stack kosong, browser mengambil tugas yang menunggu dari task queue ke call stack.

1. Browser memeriksa apakah call stack kosong => Tidak => lanjutkan mengeksekusi tugas call stack.
2. Browser memeriksa apakah call stack kosong => Ya => periksa task queue => jika ada tugas, pindahkan satu ke call stack.

Siklus yang berulang ini adalah konsep event loop.

```js
console.log(1);

// Fungsi asinkron ini adalah callback
setTimeout(function () {
  console.log(2);
}, 0);

console.log(3);

// Urutan output: 1 3 2
```

## 2. Mengapa setInterval tidak akurat dalam hal waktu?

> Mengapa `setInterval` tidak akurat dalam pengaturan waktu?

1. JavaScript bersifat single-threaded (satu tugas pada satu waktu, yang lain menunggu di antrian). Jika callback `setInterval` memakan waktu lebih lama dari intervalnya sendiri, callback berikutnya tertunda.
   Contoh: interval 1 detik, tapi satu callback memakan 2 detik. Eksekusi berikutnya sudah terlambat 1 detik. Keterlambatan ini terakumulasi seiring waktu.

2. Browser dan runtime juga memberlakukan batasan. Di sebagian besar browser utama (Chrome, Firefox, Safari), interval minimum praktis biasanya sekitar 4ms.
   Jadi bahkan jika Anda mengatur 1ms, biasanya berjalan sekitar setiap 4ms.

3. Penggunaan CPU atau memori yang berat bisa menunda eksekusi. Tugas seperti pengeditan video atau pemrosesan gambar sering menyebabkan keterlambatan timer.

4. JavaScript memiliki garbage collection. Jika callback interval membuat banyak objek, pekerjaan GC bisa menambah keterlambatan tambahan.

### Alternatif

#### requestAnimationFrame

Jika Anda menggunakan `setInterval` untuk animasi, pertimbangkan untuk menggantinya dengan `requestAnimationFrame`.

- Sinkron dengan repaint: berjalan saat browser siap menggambar frame berikutnya. Ini jauh lebih akurat daripada menebak waktu repaint dengan `setInterval` atau `setTimeout`.
- Performa lebih baik: karena selaras dengan siklus repaint, tidak akan berjalan saat repaint tidak diperlukan (misalnya, tab di background), menghemat komputasi.
- Throttling otomatis: menyesuaikan frekuensi eksekusi berdasarkan kondisi perangkat, biasanya sekitar 60 FPS.
- Timestamp presisi tinggi: menerima parameter `DOMHighResTimeStamp` (presisi mikrodetik), berguna untuk pengaturan waktu animasi yang tepat.

##### Contoh

```js
let startPos = 0;

function moveElement(timestamp) {
  // perbarui posisi DOM
  startPos += 5;
  document.getElementById(
    'myElement'
  ).style.transform = `translateX(${startPos}px)`;

  // Lanjutkan animasi sampai elemen mencapai posisi target
  if (startPos < 500) {
    requestAnimationFrame(moveElement);
  }
}

// mulai animasi
requestAnimationFrame(moveElement);
```

`moveElement()` memperbarui posisi pada setiap frame (biasanya 60 FPS) sampai mencapai 500 piksel.
Ini biasanya menghasilkan animasi yang lebih halus dan lebih alami dibandingkan `setInterval`.
