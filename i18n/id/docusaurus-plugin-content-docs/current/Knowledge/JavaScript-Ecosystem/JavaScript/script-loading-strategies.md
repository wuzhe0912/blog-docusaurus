---
id: script-loading-strategies
title: '[Easy] 📄 <script>, <script async>, <script defer>'
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## Ringkasan (Overview)

Dalam HTML, ada tiga cara utama untuk memuat file JavaScript:

1. `<script>`
2. `<script async>`
3. `<script defer>`

Ketiga metode ini berperilaku berbeda selama pemuatan dan eksekusi script.

## Perbandingan Detail (Detailed Comparison)

### `<script>`

- **Perilaku**: Saat browser menemukan tag ini, browser menghentikan parsing HTML, mengunduh dan mengeksekusi script, lalu melanjutkan parsing.
- **Kapan digunakan**: Untuk script yang kritikal terhadap rendering.
- **Kelebihan**: Memastikan script dieksekusi secara berurutan.
- **Kekurangan**: Bisa menunda rendering halaman.

```html
<script src="important.js"></script>
```

### `<script async>`

- **Perilaku**: Browser mengunduh script di background sambil melanjutkan parsing HTML. Setelah terunduh, script langsung dieksekusi dan mungkin menginterupsi parsing.
- **Kapan digunakan**: Untuk script independen seperti analitik atau iklan.
- **Kelebihan**: Tidak memblokir parsing HTML dan bisa meningkatkan kecepatan pemuatan.
- **Kekurangan**: Urutan eksekusi tidak dijamin dan script mungkin berjalan sebelum DOM sepenuhnya siap.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **Perilaku**: Browser mengunduh script di background tapi mengeksekusinya hanya setelah parsing HTML selesai. Beberapa script yang di-defer dieksekusi sesuai urutan dokumen.
- **Kapan digunakan**: Untuk script yang memerlukan DOM lengkap tapi tidak diperlukan segera.
- **Kelebihan**: Tidak memblokir parsing HTML, mempertahankan urutan, dan bekerja baik untuk script yang bergantung pada DOM.
- **Kekurangan**: Jika script kritikal, bisa menunda interaktivitas.

```html
<script defer src="ui-enhancements.js"></script>
```

## Analogi

Bayangkan Anda sedang bersiap untuk kencan:

1. **`<script>`**:
   Anda berhenti dari semua aktivitas dan menelepon pasangan untuk mengonfirmasi detail. Komunikasi jelas, tapi persiapan tertunda.

2. **`<script async>`**:
   Anda bersiap sambil bicara melalui earbuds Bluetooth. Efisien, tapi Anda mungkin kehilangan fokus dan membuat kesalahan.

3. **`<script defer>`**:
   Anda mengirim pesan bahwa Anda akan menelepon setelah selesai bersiap. Anda bisa menyelesaikan persiapan dulu, lalu berkomunikasi dengan baik.

## Penggunaan Saat Ini (Current Usage)

Dalam framework modern, Anda biasanya tidak mengonfigurasi perilaku `<script>` secara manual.
Misalnya, Vite secara default menggunakan `type="module"`, yang berperilaku mirip dengan `defer`.

```javascript
<script type="module" src="/src/main.js"></script>
```

Pengecualiannya adalah script pihak ketiga, seperti Google Analytics.

```javascript
<script async src="https://www.google-analytics.com/analytics.js"></script>
```
