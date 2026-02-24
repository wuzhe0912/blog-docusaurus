---
id: performance-lv3-large-data-optimization
title: '[Lv3] Strategi Optimasi Data Besar: Memilih dan Menerapkan Pendekatan yang Tepat'
slug: /experience/performance/lv3-large-data-optimization
tags: [Experience, Interview, Performance, Lv3]
---

> Ketika UI perlu menangani ribuan atau jutaan record, keberhasilan bergantung pada pemilihan kombinasi strategi produk, backend, dan frontend yang tepat.

## Skenario Wawancara

**T: Bagaimana Anda mengoptimasi halaman yang menampilkan dataset yang sangat besar?**

Jawaban yang kuat harus mencakup:

1. Validasi kebutuhan
2. Analisis trade-off
3. Arsitektur end-to-end
4. Implementasi dan hasil yang terukur

---

## 1. Validasi kebutuhan terlebih dahulu

Sebelum memilih teknik, tanyakan:

- Apakah pengguna benar-benar memerlukan semua baris sekaligus?
- Apakah pembaruan real-time diperlukan?
- Apakah perilaku dominan adalah browsing, pencarian, atau ekspor?
- Apakah tinggi baris tetap atau dinamis?
- Apakah kita perlu memilih/cetak/ekspor secara massal di semua record?

Ini menentukan apakah paginasi, infinite loading, virtualisasi, atau server push yang paling cocok.

## 2. Matriks strategi

| Strategi | Cocok untuk | Kelebihan | Trade-off |
| --- | --- | --- | --- |
| Paginasi sisi server | Data admin dengan banyak pencarian | Memori rendah, dapat diprediksi | Overhead navigasi tambahan |
| Infinite scroll | Browsing gaya feed | Eksplorasi yang lancar | Aksi footer/jump lebih sulit |
| Virtual scrolling | Daftar besar yang terlihat | Node DOM minimal | Kompleksitas dengan tinggi baris dinamis |
| Pemfilteran/pengurutan sisi server | Data besar dan ketepatan yang ketat | Lebih sedikit CPU klien | Beban backend meningkat |
| Cache + fetch inkremental | Alur kunjungan berulang | Penggunaan ulang lebih cepat | Kompleksitas invalidasi cache |

## 3. Pola arsitektur yang direkomendasikan

### Pipeline data

1. Parameter query mendefinisikan sort/filter/page
2. Backend mengembalikan field minimal dan total count
3. Frontend menormalisasi dan meng-cache berdasarkan query key
4. UI merender hanya baris yang terlihat

### Rendering

- Utamakan virtualisasi ketika jumlah baris besar
- Memoize komponen baris
- Jaga dependensi reaktif per baris tetap kecil

### Interaksi

- Debounce input pencarian
- Batalkan permintaan yang sudah usang
- Pertahankan posisi scroll selama refresh

## 4. Contoh implementasi (virtualized list + server query)

```ts
const query = reactive({ keyword: '', page: 1, pageSize: 50, sort: 'createdAt:desc' });

const { data, isLoading } = useQuery({
  queryKey: ['records', query],
  queryFn: () => fetchRecords(query),
});
```

```tsx
<VirtualList
  data={data.items}
  itemHeight={48}
  overscan={8}
  renderItem={(row) => <RecordRow row={row} />}
/>
```

## 5. Pagar pengaman performa

- Jaga jumlah node DOM stabil saat scroll berat
- Gunakan pembatalan permintaan dengan `AbortController`
- Batch update untuk mengurangi ledakan render
- Utamakan komputasi latar belakang untuk transformasi yang mahal

## 6. Metrik yang dilaporkan

- Waktu render awal
- Time-to-interactive
- Stabilitas FPS saat scroll
- Tren penggunaan memori
- Latensi API dan jumlah permintaan

## Ringkasan siap wawancara

> Saya mulai dari perilaku pengguna, lalu memilih matriks strategi daripada satu solusi tetap. Untuk tampilan data besar, saya biasanya menggabungkan optimasi query sisi server dengan virtualisasi, pembatalan permintaan, dan pagar pengaman performa yang terukur.
