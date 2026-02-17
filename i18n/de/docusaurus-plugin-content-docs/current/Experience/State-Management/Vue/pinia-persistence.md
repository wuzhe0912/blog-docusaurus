---
id: state-management-vue-pinia-persistence
title: 'Pinia Persistenzstrategien'
slug: /experience/state-management/vue/pinia-persistence
tags: [Experience, Interview, State-Management, Vue]
---

> Persistenzstrategien für Pinia Store in einem Multi-Brand-Plattformprojekt: Verwendung von `piniaPluginPersistedstate` und VueUse's `useSessionStorage`.

---

## 1. Kernpunkte für die Interviewantwort

1. **Drei Persistenzmethoden**: `persist: true`, `useSessionStorage`, manuelle Persistenz.
2. **Auswahlstrategie**: Für den gesamten Store `persist: true`, für bestimmte Felder `useSessionStorage`.
3. **Sicherheitsaspekte**: Sensible Informationen nicht persistieren, Benutzereinstellungen persistieren.

---

## 2. Persistenzmethoden

### 2.1 Pinia Plugin Persistedstate

**Options API:**

```typescript
export const useLanguageStore = defineStore('languageStore', {
  state: () => ({ lang: '', defaultLang: '' }),
  persist: true, // Automatische Persistenz in localStorage
});
```

**Benutzerdefinierte Konfiguration:**

```typescript
persist: {
  key: 'my-store',
  storage: sessionStorage,
  paths: ['lang'], // Nur bestimmte Felder persistieren
}
```

### 2.2 VueUse's useSessionStorage / useLocalStorage

```typescript
import { useSessionStorage } from '@vueuse/core';

export const useDarkModeStore = defineStore('darkMode', () => {
  // Automatische Persistenz in sessionStorage
  const isDarkMode = useSessionStorage<boolean>('isDarkMode', false);
  return { isDarkMode };
});
```

### 2.3 Manuelle Persistenz (nicht empfohlen)

```typescript
export const useCustomStore = defineStore('custom', {
  state: () => ({ token: '' }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token); // Manuelles Speichern
    },
  },
});
```

---

## 3. Vergleichstabelle

| Methode               | Vorteile              | Nachteile                        | Anwendungsfall                     |
| --------------------- | --------------------- | -------------------------------- | ---------------------------------- |
| **persist: true**     | Automatisch, einfach  | Gesamter State wird persistiert  | Gesamter Store muss persistiert werden |
| **useSessionStorage** | Flexibel, typsicher   | Muss einzeln definiert werden    | Bestimmte Felder persistieren      |
| **Manuelle Persistenz** | Volle Kontrolle     | Fehleranfällig, schwer wartbar   | Nicht empfohlen                    |

---

## 4. Store-Zustand zurücksetzen

### 4.1 Pinias eingebautes `$reset()`

```typescript
// Options API Store unterstützt
const store = useMyStore();
store.$reset(); // Auf Initialzustand zurücksetzen
```

### 4.2 Benutzerdefinierte Reset-Methode

```typescript
// Composition API Store
export const useGameStore = defineStore('gameStore', () => {
  const gameState = reactive({
    list: [],
    favoriteList: [],
  });

  function resetGameStore() {
    gameState.list = [];
    gameState.favoriteList = [];
  }

  return { gameState, resetGameStore };
});
```

### 4.3 Batch-Reset (Praxisbeispiel)

```typescript
// src/common/hooks/useAuth.ts
export function useAuth() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  function reset() {
    // Mehrere Stores zurücksetzen
    authStore.$reset();
    userInfoStore.$reset();
    gameStore.resetGameStore();
  }

  async function handleLogout() {
    await api.logout();
    reset(); // Alle Zustände beim Abmelden zurücksetzen
    router.push('/');
  }

  return { reset, handleLogout };
}
```

---

## 5. Best Practices

### 5.1 Persistenzstrategie

```typescript
// ✅ Sensible Informationen nicht persistieren
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined, // Persistieren
    user_password: undefined, // ❌ Niemals Passwörter persistieren
  }),
  persist: {
    paths: ['access_token'], // Nur Token persistieren
  },
});
```

### 5.2 Batch-Update mit `$patch`

```typescript
// ❌ Nicht empfohlen: Mehrfache Updates (löst mehrere Reaktionen aus)
authStore.access_token = data.access_token;
authStore.user_id = data.user_id;
authStore.agent_id = data.agent_id;

// ✅ Empfohlen: Batch-Update (löst nur eine Reaktion aus)
authStore.$patch({
  access_token: data.access_token,
  user_id: data.user_id,
  agent_id: data.agent_id,
});

// ✅ Funktionsform ist ebenfalls möglich
authStore.$patch((state) => {
  state.access_token = data.access_token;
  state.user_id = data.user_id;
  state.agent_id = data.agent_id;
});
```

---

## 6. Zusammenfassung der Interviewschwerpunkte

### 6.1 Auswahl der Persistenzmethode

**Mögliche Antwort:**

> Im Projekt verwende ich drei Persistenzmethoden: 1) `persist: true`, der gesamte Store wird automatisch in localStorage persistiert, geeignet für Stores, die vollständig persistiert werden müssen; 2) `useSessionStorage` oder `useLocalStorage`, bestimmte Felder persistieren, flexibler und typsicher; 3) Manuelle Persistenz, nicht empfohlen. Bei der Auswahl gilt: Sensible Informationen nicht persistieren, Benutzereinstellungen persistieren.

**Kernpunkte:**
- ✅ Drei Persistenzmethoden
- ✅ Auswahlstrategie
- ✅ Sicherheitsaspekte

### 6.2 Batch-Update und Reset

**Mögliche Antwort:**

> Beim Aktualisieren des Store-Zustands verwende ich `$patch` für Batch-Updates, das nur eine Reaktion auslöst und die Leistung verbessert. Beim Zurücksetzen des Zustands können Options API Stores `$reset()` verwenden, Composition API Stores benötigen eine benutzerdefinierte Reset-Methode. Beim Abmelden können mehrere Stores gleichzeitig zurückgesetzt werden, um sicherzustellen, dass der Zustand sauber bereinigt wird.

**Kernpunkte:**
- ✅ `$patch` Batch-Update
- ✅ Methoden zum Zurücksetzen des Zustands
- ✅ Batch-Reset-Strategie

---

## 7. Interview-Zusammenfassung

**Mögliche Antwort:**

> Bei der Implementierung der Pinia Store Persistenz im Projekt verwende ich `persist: true` für die automatische Persistenz des gesamten Stores oder `useSessionStorage` für die Persistenz bestimmter Felder. Die Auswahlstrategie ist: Sensible Informationen nicht persistieren, Benutzereinstellungen persistieren. Beim Aktualisieren des Zustands verwende ich `$patch` für Batch-Updates zur Leistungsverbesserung. Beim Zurücksetzen des Zustands verwenden Options API Stores `$reset()`, Composition API Stores benutzerdefinierte Reset-Methoden.

**Kernpunkte:**
- ✅ Persistenzmethoden und Auswahl
- ✅ Batch-Update-Strategie
- ✅ Methoden zum Zurücksetzen des Zustands
- ✅ Praktische Projekterfahrung
