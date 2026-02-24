---
id: state-management-vue-pinia-usage
title: 'Penggunaan Pinia di Komponen dan Composable'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> Pola penggunaan yang benar mencegah bug reaktivitas dan menjaga logika bisnis tetap mudah diuji.

---

## 1. Fokus wawancara

1. Pola penggunaan tingkat komponen
2. `storeToRefs` dan reaktivitas
3. Orkestrasi multi-store di composable

## 2. Penggunaan di komponen

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/auth.store';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { token, isLoggedIn } = storeToRefs(authStore);

function logout() {
  authStore.clearSession();
}
</script>
```

State/getter sebaiknya diekstrak dengan `storeToRefs`.

## 3. Pola orkestrasi composable

```ts
export function useCheckoutFlow() {
  const cartStore = useCartStore();
  const userStore = useUserStore();

  async function checkout() {
    await checkoutApi({
      items: cartStore.items,
      userId: userStore.id,
    });
    cartStore.clear();
  }

  return { checkout };
}
```

Taruh alur bisnis lintas store di composable, bukan di dalam satu store.

## 4. Panduan komunikasi

- Prioritaskan composable sebagai layer koordinasi
- Hindari impor store melingkar secara langsung
- Jaga action store tetap fokus pada satu domain

## 5. Tips pengujian

- Mock action store untuk tes composable
- Verifikasi transisi state, bukan detail implementasi
- Tambahkan regression test untuk workflow lintas store

## 6. Ringkasan siap wawancara

> Di komponen, saya menggunakan `storeToRefs` untuk ekstraksi state yang reaktif. Untuk workflow multi-store, saya menyusun store di composable agar dependensi tetap searah dan logika mudah diuji.
