---
slug: rebuilding-blog-with-ai
title: 'Membangun Ulang Seluruh Blog Saya dengan Claude Code'
authors: wuzhe0912
tags: [ai-tools, engineering]
---

Sebelum 2023-2024, saya masih berpikir blog teknologi tradisional memiliki nilai nyata. Anda bisa mengonsolidasi catatan, pengalaman wawancara, masalah yang pernah dihadapi, jebakan yang pernah terjebak. Basis pengetahuan pribadi yang benar-benar berarti.

Tapi dari pertengahan 2025 ke depan, model mulai beriterasi lebih cepat dan menjadi jauh lebih kuat. Bahkan Cursor -- yang sangat saya sukai di awal 2025 sebagai AI code editor -- terasa jelas kalah kelas dibandingkan Claude Code di paruh kedua tahun itu. Saat itulah saya tahu sudah waktunya membongkar seluruh blog dan membangunnya kembali dari awal (berharap bisa mempertahankan nilai apa pun yang masih tersisa).

<!--truncate-->

## Angka-Angkanya

Izinkan saya mulai dengan datanya, karena volume pekerjaan di sini akan sangat menghancurkan jika dilakukan secara manual. Saya bisa mengatakan dengan penuh keyakinan bahwa prokrastinasi saya akan membunuh proyek ini sepuluh kali lipat. Tapi dengan AI tooling, selesai dalam 10 hari (saat Tahun Baru Imlek, pula) -- kualitasnya lumayan, keajaiban kecil sejujurnya.

| Metrik                           | Nilai                        |
| -------------------------------- | ---------------------------- |
| Durasi                           | 10 hari (8-18 Feb 2026)     |
| Total commit                     | 104                          |
| File yang diubah                 | 1.078                        |
| Baris yang ditambahkan           | 263.000+                     |
| Baris yang dihapus               | 21.000+                      |
| Locale                           | 4 → 10                       |
| Dokumen diterjemahkan ke Inggris | 89                           |
| File terjemahan yang dihasilkan  | 801 (89 docs × 9 locale)    |
| Post blog dengan i18n lengkap    | 5                            |
| Alat yang digunakan              | Claude Code                  |

## Apa yang Sebenarnya Saya Lakukan

### Fase 1: Fondasi (8-9 Feb) -- 8 commit

Mendesain ulang homepage dan halaman About dari awal. Menyiapkan `CLAUDE.md` sebagai konstitusi proyek -- format commit, aturan i18n, konvensi struktur file. Memperluas locale dari 4 menjadi 6. Semua dilakukan secara interaktif dengan Claude Code.

Fase ini sebagian besar tentang keputusan arsitektur: Seperti apa seharusnya homepage? Bagaimana seharusnya halaman About distrukturkan? Konvensi apa yang harus diikuti seluruh proyek? Pertanyaan-pertanyaan ini semua dikerjakan melalui diskusi bolak-balik dengan Claude -- terutama rencana eksekusi. Saya hanya melakukan review dan penyesuaian.

### Fase 2: Peningkatan Skala (11-12 Feb) -- 14 commit

Menambahkan 4 locale lagi (pt-BR, de, fr, vi) untuk mencapai total 10. Menghasilkan file terjemahan tema. Mendesain ulang navbar dan sidebar untuk organisasi konten yang lebih baik. Mengganti `defaultLocale` ke `en` dengan routing i18n Vercel. Memperbarui dependensi. Ekspansi locale hampir sepenuhnya pekerjaan mekanis -- persis jenis pekerjaan yang cocok untuk AI. Menghabiskan banyak Token, tapi melakukan ini secara manual dalam jangka waktu sependek ini pada dasarnya mustahil.

### Fase 3: Konten (13-14 Feb) -- 14 commit

Membersihkan post blog lama. Menulis refleksi akhir tahun. Menerjemahkan semua post blog ke 10 locale. Membangun halaman showcase Projects. Menyelesaikan i18n homepage. Memperbaiki bug komponen UI (penyelarasan tombol ShowcaseCard, pemotongan dropdown).

Masalah yang saya temui di sini: AI tidak bagus dalam menangkap layout yang rusak di percobaan pertama. Butuh beberapa putaran saya menunjukkan persis apa yang salah dengan UI sebelum semuanya diperbaiki dengan benar. Anda masih butuh mata manusia untuk hal-hal visual.

### Fase 4: Sidebar + Blog (15 Feb) -- 7 commit

Mereorganisasi seluruh struktur sidebar docs. Menerjemahkan label kategori sidebar untuk semua 10 locale. Membersihkan 206 kunci terjemahan mati yang tersisa dari restrukturisasi sebelumnya. Menulis dan menerjemahkan post blog negosiasi PHK ke semua locale.

### Fase 5: i18n Docs (16-17 Feb) -- 14 commit

Batch besar: menerjemahkan 89 dokumen ke 9 locale non-Inggris, menghasilkan 801 file terjemahan. Mencakup bagian Knowledge (JavaScript, TypeScript, CSS, Vue, React, Browser, Security, Engineering), Experience, dan Coding.

Fase ini dan fase berikutnya sama-sama menghabiskan Token besar-besaran -- hanya membuang pekerjaan terjemahan yang sangat mekanis ke AI dan membiarkannya bekerja (saya tidak bisa membaca sebagian besar bahasa itu juga).

### Fase 6: Perbaikan Kualitas (17-18 Feb) -- 24 commit

Fase ini ada karena output Fase 5 tidak cukup bersih. Dua puluh empat commit, semuanya memperbaiki terjemahan yang dihasilkan AI:

- **Jerman**: Umlaut dirender sebagai ASCII (`ue` alih-alih `ü`, `ae` alih-alih `ä`)
- **Prancis**: Aksen dihilangkan (`e` alih-alih `é`, `a` alih-alih `à`)
- **Vietnam**: Diakritik sepenuhnya hilang (bahasa Vietnam tanpa diakritik hampir tidak terbaca)
- **Spanyol/Portugis**: Tanda aksen hilang di seluruh teks
- **Mandarin Sederhana**: Karakter Tradisional tercampur (AI terkadang tidak bisa membedakan dua sistem penulisan)
- **Sisa CJK**: Komentar Mandarin tidak diterjemahkan di blok kode di es, pt-BR, ja, ko, vi

Setiap perbaikan memunculkan perbaikan lain. Memperbaiki aksen Portugis terlalu berlebihan dan merusak field frontmatter `id` dan `slug`. Memperbaiki diakritik Vietnam melewatkan satu file. Perbaikan aksen Spanyol memiliki false positive yang membutuhkan commit koreksi lagi.

Jujur, kecuali Anda benar-benar berbicara bahasa tertentu, tidak ada cara bagi manusia untuk melakukan intervensi yang bermakna di sini. Anda sepenuhnya bergantung pada validasi silang dengan model yang berbeda.

**Hal-hal yang tidak bagus dikerjakan AI:**

```markdown
// Contoh:

- Mendapatkan diakritik yang benar di percobaan pertama (aksen, umlaut, tanda tonal)
- Membedakan Mandarin Tradisional dari Mandarin Sederhana secara andal
- Memutuskan apakah komentar kode harus tetap dalam bahasa asli atau diterjemahkan
- Menjaga field frontmatter selama transformasi konten
```

## Apa yang Salah

**Bencana aksen dan diakritik.** AI mengganti karakter non-ASCII dengan perkiraan ASCII di lima bahasa. Ini menghasilkan 24 commit perbaikan -- hampir seperempat dari total. Vietnam adalah kasus terburuk: tanpa diakritik, seluruh bahasa pada dasarnya tidak bisa dikenali.

**Pencampuran Mandarin Tradisional/Sederhana.** Terjemahan `zh-cn` memiliki karakter Mandarin Tradisional yang muncul di komentar kode dan referensi inline. AI memang tidak bisa membedakan dua sistem penulisan secara andal.

**Kerusakan frontmatter.** Saat menerjemahkan dokumen, AI terkadang memodifikasi field `id` dan `slug` di frontmatter, merusak routing Docusaurus. Satu commit ada semata-mata untuk memperbaiki nilai `id` dan `slug` Portugis yang rusak selama koreksi aksen.

**Reaksi berantai koreksi berlebihan.** Memperbaiki satu masalah sering menciptakan masalah lain. Perbaikan aksen Portugis terlalu berlebihan pada beberapa istilah teknis. Perbaikan diakritik Vietnam melewatkan satu file. Setiap commit "perbaikan" memiliki peluang non-nol untuk menimbulkan masalah baru.

## Di Mana Manusia Masih Penting

**Keputusan arsitektur.** 10 locale mana yang didukung. Bagaimana mengorganisasi sidebar. Apa yang masuk dropdown navbar vs. level atas. Keputusan-keputusan ini membentuk semua pekerjaan selanjutnya.

**Penilaian kualitas.** Apakah UI-nya rusak? Apakah layout-nya sesuai spek desain? Apakah ada kesalahan terjemahan yang jelas -- seperti memeriksa apakah pengalihan locale default benar-benar memetakan dengan benar? Anda butuh mata untuk ini.

**File `CLAUDE.md`.** Ini pada dasarnya adalah konstitusi repo yang mengajarkan AI konvensi proyek Anda: format commit, struktur file, aturan i18n, hal-hal yang tidak boleh terjadi. Semakin lengkap file ini, semakin sedikit kesalahan AI dan semakin sedikit intervensi manusia yang dibutuhkan. File ini membutuhkan iterasi dan pembaruan yang sering.

## Kesimpulan

**Mulai dengan `CLAUDE.md` yang solid.** Setiap konvensi yang Anda masukkan di sana menghemat puluhan siklus koreksi di kemudian hari. Milik saya berkembang dari beberapa baris menjadi dokumen lengkap yang mencakup format commit, aturan i18n, struktur proyek, dan larangan eksplisit.

**Batch pekerjaan serupa, review secara batch.** Jangan terjemahkan satu file per satu. Lemparkan 15 file serupa ke AI sekaligus, lalu review outputnya secara batch. Menghemat Anda dari harus menyetujui setiap detail kecil secara individual.

**Paralelkan alat Anda kapan pun memungkinkan.** Menjalankan Claude Code untuk pekerjaan interaktif sambil menyerahkan pekerjaan batch ke Gemini, Codex, dll. -- itu adalah peningkatan efisiensi terbesar. Jangan serialkan apa yang bisa diparalelkan.

**Dokumentasikan semuanya.** Setiap pesan commit, setiap batas fase, setiap perbaikan -- semuanya ada di histori. Jika Anda melakukan proyek besar yang dibantu AI, histori commit Anda adalah dokumentasi Anda.
