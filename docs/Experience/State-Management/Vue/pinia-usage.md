---
id: state-management-vue-pinia-usage
title: 'Pinia Usage in Components and Composables'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> Correct usage patterns prevent reactivity bugs and keep business logic testable.

---

## 1. Interview focus

1. Component-level usage patterns
2. `storeToRefs` and reactivity
3. Multi-store orchestration in composables

## 2. Component usage

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

State/getters should be extracted with `storeToRefs`.

## 3. Composable orchestration pattern

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

Put cross-store business flow in composables, not inside one store.

## 4. Communication guidelines

- Prefer composables as coordination layer
- Avoid direct circular store imports
- Keep store actions focused on one domain

## 5. Testing tips

- Mock store actions for composable tests
- Verify state transitions, not implementation details
- Add regression tests for cross-store workflows

## 6. Interview-ready summary

> In components, I use `storeToRefs` for reactive state extraction. For multi-store workflows, I compose stores in composables to keep dependencies directional and logic testable.
