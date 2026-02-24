---
id: state-management-vue-pinia-usage
title: "Использование Pinia в компонентах и composable'ах"
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> Корректные паттерны использования предотвращают баги реактивности и сохраняют тестируемость бизнес-логики.

---

## 1. Фокус на интервью

1. Паттерны использования на уровне компонентов
2. `storeToRefs` и реактивность
3. Оркестрация нескольких store в composable'ах

## 2. Использование в компонентах

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

State/getters нужно извлекать через `storeToRefs`.

## 3. Паттерн оркестрации в composable

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

Размещайте cross-store бизнес-флоу в composable'ах, а не внутри одного store.

## 4. Правила коммуникации

- Предпочитайте composable'ы как слой координации
- Избегайте прямых циклических импортов store
- Держите store actions сфокусированными на одном домене

## 5. Советы по тестированию

- Мокайте store actions в тестах composable'ов
- Проверяйте переходы состояния, а не детали реализации
- Добавляйте регрессионные тесты для cross-store workflow

## 6. Краткое резюме для интервью

> В компонентах я использую `storeToRefs` для реактивного извлечения состояния. Для multi-store workflow я композирую store в composable'ах, чтобы зависимости оставались направленными, а логика — тестируемой.
