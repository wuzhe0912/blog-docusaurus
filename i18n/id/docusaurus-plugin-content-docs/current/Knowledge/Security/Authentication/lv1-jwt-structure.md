---
id: login-lv1-jwt-structure
title: '[Lv1] Apa Struktur dari JWT?'
slug: /experience/login/lv1-jwt-structure
tags: [Experience, Interview, Login, Lv1, JWT]
---

> Pewawancara sering bertanya lanjutan: "Seperti apa bentuk JWT? Mengapa dirancang demikian?" Memahami struktur, metode encoding, dan alur verifikasi akan membantu Anda menjawab dengan cepat.

---

## 1. Gambaran Dasar

JWT (JSON Web Token) adalah format token yang **mandiri** (self-contained) yang digunakan untuk mengirimkan informasi secara aman antara dua pihak. Terdiri dari tiga string yang dihubungkan dengan `.`:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Jika diuraikan, ini adalah tiga segmen JSON yang di-encode dengan Base64URL:

1. **Header**: Mendeskripsikan algoritma dan tipe yang digunakan oleh token.
2. **Payload**: Berisi informasi pengguna dan klaim (claims).
3. **Signature**: Ditandatangani dengan secret key untuk memastikan konten tidak diubah.

---

## 2. Header, Payload, dan Signature secara Detail

### 2.1 Header

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: Algoritma penandatanganan, misalnya `HS256` (HMAC + SHA-256), `RS256` (RSA + SHA-256).
- `typ`: Tipe token, biasanya `JWT`.

### 2.2 Payload

```json
{
  "sub": "1234567890",
  "name": "Jane Doe",
  "iat": 1516239022,
  "exp": 1516242622,
  "role": "admin"
}
```

- **Registered Claims (dicadangkan secara resmi, tetapi tidak wajib)**:
  - `iss` (Issuer): Entitas yang menerbitkan token
  - `sub` (Subject): Subjek (biasanya ID pengguna)
  - `aud` (Audience): Penerima yang dituju
  - `exp` (Expiration Time): Waktu kedaluwarsa (Unix timestamp, dalam detik)
  - `nbf` (Not Before): Token tidak valid sebelum waktu ini
  - `iat` (Issued At): Waktu token diterbitkan
  - `jti` (JWT ID): Pengenal unik untuk token
- **Public / Private Claims**: Field kustom dapat ditambahkan (misalnya `role`, `permissions`), tetapi hindari membuat payload terlalu besar.

### 2.3 Signature

Proses pembuatan signature:

```text
signature = HMACSHA256(
  base64urlEncode(header) + "." + base64urlEncode(payload),
  secret
)
```

- Dua segmen pertama ditandatangani menggunakan secret key (atau private key).
- Ketika server menerima token, server menghitung ulang signature. Jika cocok, ini mengonfirmasi bahwa token tidak diubah dan diterbitkan oleh sumber yang sah.

> Catatan: JWT hanya menjamin integritas data, bukan kerahasiaan, kecuali enkripsi tambahan diterapkan.

---

## 3. Apa itu Base64URL Encoding?

JWT menggunakan **Base64URL** alih-alih Base64, dengan perbedaan berikut:

- `+` diganti dengan `-`, dan `/` diganti dengan `_`.
- Padding `=` di akhir dihapus.

Ini memastikan token dapat ditempatkan dengan aman di URL, Cookie, atau Header tanpa masalah yang disebabkan oleh karakter khusus.

---

## 4. Gambaran Alur Verifikasi

1. Klien menyertakan `Authorization: Bearer <JWT>` di header permintaan.
2. Server menerima token dan:
   - Mem-parse Header dan Payload.
   - Mengambil algoritma yang ditentukan oleh `alg`.
   - Menghitung ulang signature menggunakan shared secret atau public key.
   - Membandingkan signature dan memeriksa field terkait waktu seperti `exp` dan `nbf`.
3. Hanya setelah verifikasi berhasil, server dapat mempercayai konten Payload.

---

## 5. Kerangka Jawaban Wawancara

> "JWT terdiri dari tiga bagian — Header, Payload, dan Signature — yang dihubungkan dengan `.`.
> Header mendeskripsikan algoritma dan tipe; Payload berisi informasi pengguna dan field standar seperti `iss`, `sub`, dan `exp`; Signature menandatangani dua bagian pertama dengan secret key untuk memverifikasi bahwa konten tidak diubah.
> Kontennya adalah JSON yang di-encode dengan Base64URL, tetapi tidak dienkripsi — hanya di-encode. Jadi data sensitif tidak boleh ditempatkan langsung di dalamnya. Ketika server menerima token, server menghitung ulang signature untuk perbandingan. Jika cocok dan belum kedaluwarsa, token dianggap valid."

---

## 6. Pengingat Pertanyaan Lanjutan Wawancara

- **Keamanan**: Payload dapat di-decode — jangan pernah menyimpan kata sandi, nomor kartu kredit, atau informasi sensitif lainnya di dalamnya.
- **Kedaluwarsa dan Pembaruan**: Biasanya dipasangkan dengan Access Token berumur pendek + Refresh Token berumur panjang.
- **Algoritma Penandatanganan**: Anda dapat menyebutkan perbedaan antara pendekatan simetris (HMAC) dan asimetris (RSA, ECDSA).
- **Mengapa tidak bisa sangat panjang?**: Token yang terlalu besar meningkatkan biaya transmisi jaringan dan mungkin ditolak oleh browser.

---

## 7. Referensi

- [JWT Official Website](https://jwt.io/)
- [RFC 7519: JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [Auth0: Anatomy of a JWT](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-structure)
