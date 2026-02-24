---
id: web-browsing-process
title: 📄 Proses Browsing Web
slug: /web-browsing-process
---

## 1. Jelaskan bagaimana browser memperoleh HTML dari server dan bagaimana browser merender HTML di layar

> Jelaskan bagaimana browser mengambil HTML dari server dan merendernya di layar.

### 1. Menginisiasi Permintaan (Request)

- **Input URL**: Ketika pengguna memasukkan URL di browser atau mengklik tautan, browser mulai mem-parsing URL untuk menentukan server mana yang akan menerima permintaan.
- **DNS Lookup**: Browser melakukan DNS lookup untuk menyelesaikan (resolve) alamat IP server yang sesuai.
- **Membuat Koneksi**: Browser mengirim permintaan ke alamat IP server melalui internet menggunakan protokol HTTP atau HTTPS. Jika menggunakan HTTPS, koneksi SSL/TLS juga harus dibuat.

### 2. Respons Server

- **Memproses Permintaan**: Setelah menerima permintaan, server membaca data yang sesuai dari database berdasarkan path dan parameter permintaan.
- **Mengirim Respons**: Server kemudian mengirim dokumen HTML sebagai bagian dari respons HTTP kembali ke browser. Respons juga mencakup informasi seperti status code dan parameter lainnya (CORS, content-type, dll.).

### 3. Mem-parsing HTML

- **Membangun DOM Tree**: Browser membaca dokumen HTML dan mengubahnya menjadi node DOM berdasarkan tag dan atribut HTML, membangun DOM Tree di memori.
- **Meminta Subresource**: Saat mem-parsing HTML, jika browser menemukan resource eksternal seperti CSS, JavaScript, atau gambar, browser mengirim permintaan tambahan ke server untuk mengambil resource tersebut.

### 4. Merender Halaman

- **Membangun CSSOM Tree**: Browser mem-parsing file CSS untuk membuat CSSOM Tree.
- **Render Tree**: Browser menggabungkan DOM Tree dan CSSOM Tree menjadi Render Tree, yang berisi semua node yang terlihat dan gaya yang sesuai.
- **Layout**: Browser melakukan layout (juga disebut Reflow), menghitung posisi dan ukuran setiap node.
- **Paint**: Akhirnya, browser melalui tahap painting, menggambar konten setiap node ke halaman.

### 5. Interaksi JavaScript

- **Menjalankan JavaScript**: Jika HTML berisi JavaScript, browser mem-parsing dan menjalankannya. Ini dapat memodifikasi DOM dan memperbarui gaya.

Seluruh proses bersifat progresif. Secara teori, pengguna akan melihat sebagian konten halaman terlebih dahulu sebelum halaman lengkap dimuat. Selama proses ini, beberapa reflow dan repaint dapat terpicu, terutama ketika halaman berisi gaya yang kompleks atau efek interaktif. Selain optimisasi bawaan browser, pengembang biasanya menggunakan berbagai teknik untuk membuat pengalaman pengguna lebih lancar.

## 2. Jelaskan Reflow dan Repaint

### Reflow

Reflow mengacu pada perubahan DOM halaman web yang menyebabkan browser menghitung ulang posisi elemen dan menempatkannya di lokasi yang benar. Dengan kata sederhana, layout perlu diregenerasi untuk mengatur ulang elemen.

#### Pemicu Reflow

Reflow terjadi dalam dua skenario: satu adalah perubahan global yang memengaruhi seluruh halaman, dan yang lainnya adalah perubahan parsial yang memengaruhi area komponen tertentu.

- Pemuatan halaman awal adalah reflow yang paling signifikan.
- Menambahkan atau menghapus elemen DOM.
- Mengubah dimensi elemen, seperti menambah konten atau mengubah ukuran font.
- Menyesuaikan layout elemen, seperti mengubah margin atau padding.
- Mengubah ukuran jendela browser.
- Memicu pseudo-class, seperti efek hover.

### Repaint

Repaint terjadi ketika tampilan elemen berubah tanpa memengaruhi layout. Karena elemen terkandung dalam layout, reflow akan selalu memicu repaint. Namun, repaint saja tidak selalu menyebabkan reflow.

#### Pemicu Repaint

- Mengubah warna atau latar belakang elemen, seperti menambahkan warna atau memodifikasi properti background.
- Mengubah box-shadow atau border elemen juga termasuk repaint.

### Cara Mengoptimalkan Reflow dan Repaint

- Hindari menggunakan layout table. Properti table cenderung menyebabkan penghitungan ulang layout saat dimodifikasi. Jika table tidak terhindarkan, pertimbangkan untuk menambahkan properti seperti `table-layout: auto;` atau `table-layout: fixed;` untuk merender satu baris pada satu waktu dan membatasi area yang terpengaruh.
- Alih-alih memanipulasi DOM untuk mengubah gaya satu per satu, definisikan gaya yang dibutuhkan dalam class CSS dan toggle melalui JavaScript.
  - Misalnya, di Vue, Anda dapat menggunakan class binding untuk toggle gaya daripada memodifikasi gaya secara langsung melalui fungsi.
- Untuk skenario yang membutuhkan toggle sering (misalnya, tab switching), gunakan `v-show` daripada `v-if`. Yang pertama hanya menggunakan CSS `display: none;` untuk menyembunyikan elemen, sedangkan yang kedua memicu lifecycle komponen dengan membuat atau menghancurkan elemen, yang menghasilkan overhead performa lebih besar.
- Jika reflow tidak terhindarkan, gunakan `requestAnimationFrame` untuk optimisasi (karena API ini dirancang untuk animasi dan sinkron dengan frame rate browser). Ini dapat menggabungkan beberapa reflow menjadi satu, mengurangi jumlah repaint.
  - Misalnya, jika animasi perlu bergerak menuju target di halaman, Anda dapat menggunakan `requestAnimationFrame` untuk menghitung setiap langkah gerakan.
  - Demikian pula, properti CSS3 tertentu dapat memicu hardware acceleration di sisi klien, meningkatkan performa animasi, seperti `transform`, `opacity`, `filters`, dan `Will-change`.
- Jika memungkinkan, modifikasi gaya pada node DOM level rendah untuk menghindari pemicuan perubahan gaya elemen parent yang menyebar ke semua elemen anak.
- Untuk animasi, gunakan elemen dengan posisi `absolute` atau `fixed`. Ini meminimalkan dampak pada elemen lain, hanya memicu repaint tanpa reflow.

### Contoh

```js
// buruk
const element = document.querySelector('.wrapper');
element.style.margin = '4px';
element.style.padding = '6px';
element.style.borderRadius = '10px';
```

```js
// baik
.update {
  margin: 4px;
  padding: 6px;
  border-radius: 10px;
}

const element = document.querySelector('.wrapper');
element.classList.add('update');
```

### Referensi

- [Render-tree Construction, Layout, and Paint](https://web.dev/articles/critical-rendering-path/render-tree-construction)
- [浏览器的回流与重绘 (Reflow & Repaint)](https://juejin.cn/post/6844903569087266823)
- [介绍回流与重绘（Reflow & Repaint），以及如何进行优化?](https://juejin.cn/post/7064077572132323365)

## 3. Jelaskan kapan browser mengirim permintaan OPTIONS ke server

> Jelaskan kapan browser mengirim permintaan OPTIONS ke server.

Dalam kebanyakan kasus, ini berlaku untuk skenario CORS. Sebelum mengirim permintaan yang sebenarnya, terjadi pemeriksaan preflight di mana browser terlebih dahulu mengirim permintaan OPTIONS untuk menanyakan server apakah permintaan cross-origin diizinkan. Jika server merespons dengan izin, browser melanjutkan untuk mengirim permintaan yang sebenarnya. Jika tidak, browser melempar error.

Selain itu, jika metode permintaan bukan `GET`, `HEAD`, atau `POST`, itu juga akan memicu permintaan OPTIONS.
