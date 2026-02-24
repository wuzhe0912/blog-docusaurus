---
id: react-useeffect-virtual-dom
title: '[Medium] React useEffect dan Virtual DOM'
slug: /react-useeffect-virtual-dom
tags: [React, Quiz, Medium, Hooks, VirtualDOM]
---

## 1. Apa itu `useEffect`?

> Apa yang dilakukan `useEffect` di React?

`useEffect` menjalankan efek samping setelah React menyelesaikan pembaruan UI.

Efek samping yang umum:

- Mengambil data remote
- Berlangganan event browser
- Sinkronisasi dengan API seperti `document.title` atau `localStorage`
- Memulai dan membersihkan timer

```tsx
import { useEffect, useState } from 'react';

export default function CounterTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <button type="button" onClick={() => setCount((v) => v + 1)}>
      Klik {count}
    </button>
  );
}
```

## 2. Bagaimana cara kerja dependency array?

### Tanpa dependency array

Berjalan setelah setiap render.

```tsx
useEffect(() => {
  console.log('berjalan setelah setiap render');
});
```

### Dependency array kosong `[]`

Berjalan sekali saat mount dan cleanup saat unmount.

```tsx
useEffect(() => {
  console.log('hanya saat mount');
  return () => console.log('cleanup saat unmount');
}, []);
```

### Dependensi spesifik

Berjalan saat mount dan setiap kali salah satu nilai tersebut berubah.

```tsx
useEffect(() => {
  console.log('query berubah:', query);
}, [query]);
```

## 3. Mengapa cleanup penting

Kembalikan fungsi dari `useEffect` untuk melepaskan resource.

```tsx
useEffect(() => {
  const onResize = () => console.log(window.innerWidth);
  window.addEventListener('resize', onResize);

  return () => {
    window.removeEventListener('resize', onResize);
  };
}, []);
```

Tanpa cleanup, Anda dapat membocorkan listener, timer, atau pekerjaan async yang sudah usang.

## 4. Kesalahan umum `useEffect`

### 1) Render ulang tak terbatas

```tsx
// buruk: memperbarui state setiap render
useEffect(() => {
  setCount((v) => v + 1);
});
```

Perbaiki dengan menambahkan dependency array yang benar atau memindahkan logika ke tempat lain.

### 2) Dependensi yang hilang

Jika Anda menggunakan variabel di dalam effect, sertakan di dependensi kecuali sengaja dibuat stabil.

### 3) Closure yang usang

Effect menangkap nilai dari render yang membuatnya. Gunakan refs atau pembaruan dependensi saat diperlukan.

### 4) Melakukan kalkulasi turunan di effect

Jika nilai dapat dihitung langsung dari props/state, lebih baik gunakan `useMemo` atau komputasi biasa daripada `useEffect`.

## 5. Apa itu Virtual DOM?

Virtual DOM adalah representasi UI di memori. React membandingkan pohon virtual sebelumnya dan berikutnya, lalu memperbarui hanya bagian DOM asli yang diperlukan.

### Mengapa ini membantu

- Mengurangi pembaruan DOM manual
- Memberikan pembaruan UI yang dapat diprediksi dari state
- Bekerja dengan heuristik reconciliation untuk efisiensi

Ini tidak selalu "gratis"; pembuatan dan perbandingan pohon tetap memiliki biaya.

## 6. Reconciliation secara sederhana

Saat state berubah:

1. React membangun pohon virtual baru
2. React membandingkannya dengan pohon sebelumnya
3. React menerapkan perubahan DOM asli yang minimal

Key di list sangat penting karena membantu React mencocokkan node lama dan baru dengan benar.

```tsx
{items.map((item) => (
  <li key={item.id}>{item.label}</li>
))}
```

Key yang stabil mencegah penggunaan ulang yang salah dan remount yang tidak perlu.

## 7. Hubungan antara `useEffect` dan Virtual DOM

- Diffing Virtual DOM terjadi selama fase render/reconciliation
- `useEffect` berjalan setelah fase commit
- Jadi `useEffect` tidak memblokir painting dalam kebanyakan kasus

Jika Anda harus membaca/menulis layout secara sinkron sebelum paint, gunakan `useLayoutEffect` dengan hati-hati.

## 8. Pola praktis

### Pengambilan data dengan guard pembatalan

```tsx
useEffect(() => {
  let cancelled = false;

  async function load() {
    const res = await fetch('/api/user');
    const data = await res.json();
    if (!cancelled) setUser(data);
  }

  load();

  return () => {
    cancelled = true;
  };
}, []);
```

### Ekstrak logika effect yang dapat digunakan ulang ke custom hooks

```tsx
function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
```

## 9. Jawaban wawancara cepat

### P1: Apakah `useEffect` setara dengan method lifecycle class?

Secara konseptual ya untuk efek samping, tetapi model mentalnya adalah "setelah render" dengan eksekusi ulang berdasarkan dependensi.

### P2: Apakah Virtual DOM berarti pembaruan React selalu cepat?

Tidak selalu. Performa tetap bergantung pada struktur component, frekuensi render, memoization, dan stabilitas key.

### P3: Kapan saya harus menghindari `useEffect`?

Hindari untuk nilai turunan murni dan event handler yang tidak memerlukan sinkronisasi eksternal.
