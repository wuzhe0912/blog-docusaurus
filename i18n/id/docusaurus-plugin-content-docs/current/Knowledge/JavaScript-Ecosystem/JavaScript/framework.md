---
id: framework
title: '[Hard] 📄 Framework'
slug: /framework
tags: [JavaScript, Quiz, Hard]
---

## 1. Jelaskan dan bandingkan kelebihan serta kekurangan SPA dan SSR

> Jelaskan dan bandingkan kelebihan serta kekurangan SPA dan SSR.

### SPA (Single-Page Application)

#### Kelebihan SPA

1. Pengalaman pengguna: SPA pada dasarnya adalah satu halaman. Dengan pemuatan data dinamis dan client-side routing, pengguna merasa seperti halaman berpindah, tapi aplikasi sebenarnya mengganti komponen, yang terasa lebih halus dan cepat.
2. Pemisahan frontend-backend: frontend fokus pada rendering dan interaksi, sementara backend menyediakan API data. Ini mengurangi keterkaitan dan meningkatkan kemudahan pemeliharaan.
3. Optimisasi jaringan: karena halaman dimuat sekali, ini menghindari pemuatan ulang halaman penuh pada setiap navigasi (seperti pada aplikasi multi-halaman tradisional), mengurangi jumlah permintaan dan beban server.

#### Kekurangan SPA

1. Tantangan SEO: konten SPA sering di-render secara dinamis, sehingga mesin pencari mungkin tidak mengindeksnya se-andal HTML tradisional (meskipun Google telah memperbaiki hal ini).
2. Waktu muat awal: SPA harus mengunduh dan menjalankan JavaScript di klien sebelum rendering, sehingga pemuatan pertama bisa lebih lambat, terutama pada jaringan lemah.

### SSR (Server-Side Rendering)

#### Kelebihan SSR

1. SEO: SSR me-render HTML yang berisi data di server, sehingga mesin pencari bisa langsung merayapi konten halaman. Ini adalah keunggulan terbesar SSR.
2. Kecepatan rendering awal: pekerjaan rendering dipindahkan ke server, yang biasanya meningkatkan first paint/pengiriman konten pertama.

#### Kekurangan SSR

1. Kurva pembelajaran dan kompleksitas: framework seperti Next dan Nuxt berbasis React/Vue tapi memiliki ekosistem dan konvensi sendiri, yang menaikkan biaya pembelajaran dan migrasi.
2. Beban server lebih tinggi: karena rendering dilakukan di server, lonjakan traffic bisa meningkatkan tekanan infrastruktur.

### Kesimpulan

Secara umum, jika Anda membangun sistem admin internal tanpa kebutuhan SEO, SSR biasanya tidak diperlukan.
Untuk website produk yang digerakkan pencarian, mengadopsi SSR layak untuk dievaluasi.

## 2. Jelaskan framework web yang pernah Anda gunakan dan bandingkan kelebihan serta kekurangannya

**Dalam beberapa tahun terakhir, keduanya telah mengarah ke pengembangan komponen berbasis fungsi:**

> Vue 3 menggunakan Composition API untuk memecah logika menjadi composable yang dapat digunakan ulang, sementara React berpusat pada Hooks. Pengalaman pengembang cukup mirip, tapi secara keseluruhan Vue lebih mudah untuk memulai, dan React lebih kuat dalam ukuran ekosistem dan fleksibilitas.

### Vue (terutama Vue 3)

**Kelebihan:**

- **Kurva pembelajaran lebih landai**:
  SFC (Single File Component) menyimpan template/script/style bersama, yang ramah bagi developer yang berasal dari alur kerja templating tradisional.
- **Konvensi resmi yang jelas, baik untuk tim**:
  Vue menyediakan panduan gaya dan konvensi yang jelas (struktur, penamaan, dekomposisi komponen), membuat konsistensi tim lebih mudah.
- **Ekosistem inti yang lengkap**:
  Tool yang dikelola secara resmi seperti Vue Router dan Pinia (atau Vuex), ditambah build tooling, mengurangi overhead keputusan.
- **Composition API meningkatkan kemudahan pemeliharaan**:
  Logika bisa diekstrak menjadi composable (misalnya `useAuth`, `useForm`) untuk berbagi perilaku dan mengurangi duplikasi di proyek besar.

**Kekurangan:**

- **Ekosistem/komunitas lebih kecil dari React**:
  Volume dan variasi paket pihak ketiga lebih rendah. Beberapa tool mutakhir atau integrasi (design system, library niche) mengutamakan React.
- **Konsentrasi pasar kerja berdasarkan wilayah/industri**:
  Dibandingkan dengan React, banyak tim global atau lintas negara lebih memilih React, yang bisa mengurangi fleksibilitas karir di beberapa pasar.

---

### React

**Kelebihan:**

- **Ekosistem besar dan inovasi cepat**:
  Sebagian besar teknologi frontend, design system, dan layanan pihak ketiga menyediakan dukungan React terlebih dahulu (library UI, chart, editor, design system, dll.).
- **Fleksibilitas tinggi untuk komposisi stack**:
  Bekerja dengan Redux/Zustand/Recoil dan meta-framework seperti Next.js/Remix. Pilihan matang tersedia untuk SPA, SSR, SSG, dan CSR.
- **Integrasi matang dengan TypeScript dan tooling**:
  Komunitas memiliki best practice yang luas untuk typing dan engineering skala besar, berguna untuk pemeliharaan jangka panjang.

**Kekurangan:**

- **Terlalu banyak kebebasan memerlukan konvensi tim**:
  Tanpa standar coding dan arsitektur yang jelas, tim mungkin menghasilkan pola yang tidak konsisten, meningkatkan biaya pemeliharaan.
- **Kurva pembelajaran tidak rendah dalam praktiknya**:
  Selain React sendiri (JSX dan Hooks), developer harus memilih routing, state management, data fetching, dan pendekatan SSR.
- **Evolusi API dan best practice yang cepat**:
  Dari class component ke function component + hooks ke server component, koeksistensi pola lama/baru meningkatkan overhead migrasi.
