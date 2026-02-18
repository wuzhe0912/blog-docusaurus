---
id: state-management-vue-pinia-persistence
title: 'Pinia Persistence Strategies'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> Persistence should be intentional: not all state should survive refresh.

---

## 1. Interview focus

1. Persistence options in Pinia
2. Field-level storage decisions
3. Security boundaries

## 2. Persistence options

### Option A: `pinia-plugin-persistedstate`

```ts
export const usePrefsStore = defineStore('prefs', {
  state: () => ({ theme: 'light', locale: 'en' }),
  persist: true,
});
```

Can also configure custom storage and picked paths.

### Option B: VueUse storage composables

```ts
const theme = useLocalStorage<'light' | 'dark'>('theme', 'light');
const dismissedTips = useSessionStorage<boolean>('dismissedTips', false);
```

Useful when only specific fields need persistence.

### Option C: Manual persistence

Possible but easy to get wrong and harder to maintain.

## 3. What to persist vs not persist

Persist:

- theme / locale
- UI preferences
- non-sensitive filters

Do not persist:

- raw access tokens in insecure contexts
- sensitive user profile fields without clear policy
- short-lived transient loading state

## 4. Production recommendations

- Define a store-by-store persistence matrix
- Use `sessionStorage` for short-session data
- Use explicit version keys for migration
- Provide safe fallback when stored schema changes

## 5. Interview-ready summary

> I choose persistence per data sensitivity and lifetime. I use plugin or VueUse for predictable persistence, avoid persisting sensitive values blindly, and maintain migration-safe keys.
