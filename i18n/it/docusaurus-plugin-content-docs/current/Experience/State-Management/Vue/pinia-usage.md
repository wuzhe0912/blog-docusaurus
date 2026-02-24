---
id: state-management-vue-pinia-usage
title: 'Uso di Pinia in componenti e composable'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> Pattern d'uso corretti prevengono bug di reattività e mantengono testabile la logica di business.

---

## 1. Focus da colloquio

1. Pattern d'uso a livello componente
2. `storeToRefs` e reattività
3. Orchestrazione multi-store nei composable

## 2. Uso nei componenti

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

State/getter dovrebbero essere estratti con `storeToRefs`.

## 3. Pattern di orchestrazione nei composable

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

Metti i flussi business cross-store nei composable, non dentro un singolo store.

## 4. Linee guida di comunicazione

- Preferisci i composable come livello di coordinamento
- Evita import circolari diretti tra store
- Mantieni le action dello store focalizzate su un dominio

## 5. Suggerimenti di testing

- Mocka le action degli store nei test dei composable
- Verifica le transizioni di stato, non i dettagli implementativi
- Aggiungi regression test per i workflow cross-store

## 6. Sintesi pronta per il colloquio

> Nei componenti uso `storeToRefs` per estrarre stato reattivo. Per i workflow multi-store compongo gli store nei composable per mantenere dipendenze direzionali e logica testabile.
