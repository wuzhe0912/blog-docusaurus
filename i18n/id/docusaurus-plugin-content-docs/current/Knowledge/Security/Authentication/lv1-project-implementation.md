---
id: login-lv1-project-implementation
title: '[Lv1] Bagaimana Autentikasi Diimplementasikan di Proyek Sebelumnya?'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Tujuan: Menjelaskan dengan jelas "bagaimana frontend menangani login, manajemen state, dan proteksi halaman" dalam 3-5 menit, sehingga mudah diingat saat wawancara.

---

## 1. Poin-poin Kunci Jawaban Wawancara

1. **Tiga Tahap Alur Login**: Kirim formulir → Verifikasi backend → Simpan token dan redirect.
2. **Manajemen State dan Token**: Pinia dengan persistensi, Axios Interceptor untuk melampirkan Bearer Token secara otomatis.
3. **Penanganan Pasca-login dan Proteksi**: Inisialisasi data bersama, route guard, logout, dan kasus tepi (OTP, paksa ganti kata sandi).

Awali dengan tiga poin kunci ini, lalu perluas ke detail sesuai kebutuhan, tunjukkan kepada pewawancara bahwa Anda memiliki perspektif holistik.

---

## 2. Komponen Sistem dan Tanggung Jawab

| Modul            | Lokasi                              | Peran                                                     |
| ---------------- | ----------------------------------- | --------------------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Menyimpan state login, mempertahankan token, menyediakan getter |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Mengenkapsulasi alur login/logout, format return terpadu  |
| Login API        | `src/api/login.ts`                  | Memanggil backend `POST /login`, `POST /logout`           |
| Axios Utility    | `src/common/utils/request.ts`       | Request/Response Interceptor, penanganan error terpadu    |
| Route Guard      | `src/router/index.ts`               | Memeriksa `meta` untuk menentukan apakah login diperlukan |
| Inisialisasi     | `src/common/composables/useInit.ts` | Memeriksa token yang ada saat app startup, memuat data yang diperlukan |

> Mnemonik: **"Store mengelola state, Hook mengelola alur, Interceptor mengelola kanal, Guard mengelola halaman."**

---

## 3. Alur Login (Langkah demi Langkah)

### Langkah 0. Formulir dan Pra-validasi

- Mendukung dua metode login: kata sandi dan kode verifikasi SMS.
- Validasi dasar sebelum pengiriman (field wajib, format, debounce).

### Langkah 1. Panggil Login API

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` menangani manajemen error dan state loading secara seragam.
- Jika berhasil, `data` mengembalikan token dan informasi inti pengguna.

### Langkah 2. Tangani Respons Backend

| Skenario                                            | Perilaku                                                         |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| **Verifikasi tambahan diperlukan** (misalnya, konfirmasi identitas login pertama) | Set `authStore.onBoarding` ke `true`, redirect ke halaman verifikasi |
| **Paksa ganti kata sandi**                          | Redirect ke alur ganti kata sandi dengan parameter yang diperlukan |
| **Sukses normal**                                   | Panggil `authStore.$patch()` untuk menyimpan token dan informasi pengguna |

### Langkah 3. Aksi Bersama Setelah Login

1. Ambil profil pengguna dan daftar wallet.
2. Inisialisasi konten yang dipersonalisasi (misalnya, daftar hadiah, notifikasi).
3. Redirect ke halaman dalam berdasarkan `redirect` atau route yang telah ditentukan.

> Login yang berhasil hanya setengah dari pekerjaan — **data bersama harus dimuat pada titik ini** untuk menghindari setiap halaman melakukan panggilan API terpisah.

---

## 4. Manajemen Siklus Hidup Token

### 4.1 Strategi Penyimpanan

- `authStore` mengaktifkan `persist: true`, menulis field kunci ke `localStorage`.
- Kelebihan: State pulih secara otomatis setelah refresh halaman. Kekurangan: Harus waspada terhadap XSS dan keamanan.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- API yang memerlukan otorisasi secara otomatis menyertakan Bearer Token.
- API yang secara eksplisit ditandai dengan `needToken: false` (login, registrasi, dll.) melewatkan pelampiran token.

### 4.3 Penanganan Kedaluwarsa dan Pengecualian

- Jika backend mengembalikan respons token-expired atau invalid-token, Response Interceptor secara seragam mengonversinya menjadi notifikasi error dan memicu alur logout.
- Mekanisme Refresh Token dapat ditambahkan sebagai ekstensi, tetapi proyek saat ini menggunakan strategi yang disederhanakan.

---

## 5. Proteksi Route dan Inisialisasi

### 5.1 Route Guard

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- Menggunakan `meta.needAuth` untuk menentukan apakah perlu memeriksa status login.
- Redirect ke halaman login atau halaman publik yang ditentukan saat belum login.

### 5.2 Inisialisasi Saat App Startup

`useInit` menangani hal berikut saat app startup:

1. Memeriksa apakah URL berisi `login_token` atau `platform_token` — jika ya, lakukan login otomatis atau set token.
2. Jika Store sudah memiliki token, muat informasi pengguna dan data bersama.
3. Jika tidak ada token, tetap di halaman publik dan tunggu pengguna login secara manual.

---

## 6. Alur Logout (Pembersihan)

1. Panggil `POST /logout` untuk memberitahu backend.
2. Jalankan `reset()`:
   - `authStore.$reset()` menghapus informasi login.
   - Store terkait (info pengguna, favorit, kode undangan, dll.) juga di-reset.
3. Hapus cache sisi browser (misalnya, cache localStorage).
4. Redirect ke halaman login atau beranda.

> Logout adalah cerminan dari login: bukan hanya menghapus token — Anda harus memastikan semua state yang bergantung dihapus untuk menghindari kebocoran data.

---

## 7. Pertanyaan Umum dan Praktik Terbaik

- **Dekomposisi Alur**: Pisahkan login dan inisialisasi pasca-login agar hook tetap ringkas.
- **Penanganan Error**: Disatukan melalui `useApi` dan Response Interceptor untuk memastikan perilaku UI yang konsisten.
- **Keamanan**:
  - Selalu gunakan HTTPS.
  - Saat menyimpan token di `localStorage`, waspada terhadap XSS untuk operasi sensitif.
  - Pertimbangkan ekstensi dengan httpOnly Cookie atau Refresh Token sesuai kebutuhan.
- **Ekstensibilitas**: Kasus tepi seperti OTP dan paksa ganti kata sandi ditangani secara fleksibel — hook mengembalikan status untuk diproses oleh lapisan tampilan.

---

## 8. Mnemonik Referensi Cepat Wawancara

1. **"Input → Validasi → Simpan → Redirect"**: Gunakan urutan ini untuk mendeskripsikan alur keseluruhan.
2. **"Store mengelola state, Interceptor menangani header, Guard memblokir akses tidak sah"**: Soroti pemisahan arsitektur.
3. **"Muat data bersama segera setelah login"**: Menunjukkan kepekaan terhadap pengalaman pengguna.
4. **"Logout adalah reset satu klik + redirect ke halaman aman"**: Mencakup keamanan dan kelengkapan alur.
