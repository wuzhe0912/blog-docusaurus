---
id: performance-lv2-js-optimization
title: '[Lv2] Optimasi Runtime JavaScript: Debounce, Throttle, Time Slicing'
slug: /experience/performance/lv2-js-optimization
tags: [Experience, Interview, Performance, Lv2]
---

> Optimalkan biaya runtime JavaScript dengan mengontrol frekuensi, menjadwalkan tugas berat, dan mencegah pemblokiran main thread.

---

## 1. Debounce untuk input bertubi-tubi

Gunakan debounce ketika pembaruan yang sering seharusnya hanya berjalan setelah pengguna berhenti.

```ts
function debounce<T extends (...args: any[]) => void>(fn: T, wait = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
```

Kasus penggunaan:

- Pemfilteran input pencarian
- Saran API
- Validasi langsung

## 2. Throttle untuk event berkelanjutan

Gunakan throttle ketika event berjalan terus-menerus dan harus dijalankan pada laju tetap.

```ts
function throttle<T extends (...args: any[]) => void>(fn: T, wait = 100) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn(...args);
    }
  };
}
```

Kasus penggunaan:

- Pembaruan posisi scroll
- Perhitungan ulang saat resize
- Pelacakan pergerakan mouse

## 3. `requestAnimationFrame` untuk pembaruan visual

```ts
let rafId = 0;
window.addEventListener('scroll', () => {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    updateStickyHeader();
  });
});
```

Selaraskan pembaruan visual dengan siklus paint browser.

## 4. Time slicing untuk perulangan besar

```ts
async function processInChunks<T>(items: T[], chunkSize = 500) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    chunk.forEach(handleItem);
    await new Promise((r) => setTimeout(r, 0));
  }
}
```

Menjaga UI tetap responsif selama pemrosesan berat.

## 5. Alihkan pekerjaan berat ke Web Worker

```ts
const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
worker.postMessage({ action: 'aggregate', payload: largeData });
worker.onmessage = (event) => {
  renderResult(event.data);
};
```

Main thread tetap interaktif sementara komputasi berjalan di latar belakang.

## 6. Pengukuran terlebih dahulu

Pantau peningkatan dengan:

- Panel Performance (long tasks)
- Web Vitals
- Custom marks/measures

```ts
performance.mark('filter-start');
runFilter();
performance.mark('filter-end');
performance.measure('filter-cost', 'filter-start', 'filter-end');
```

## Ringkasan siap wawancara

> Saya menggunakan debounce untuk input bertubi-tubi, throttle untuk event berkelanjutan, `requestAnimationFrame` untuk pembaruan visual, time slicing untuk perulangan besar, dan Web Worker untuk tugas yang berat secara CPU. Saya memvalidasi peningkatan dengan metrik performa yang konkret.
