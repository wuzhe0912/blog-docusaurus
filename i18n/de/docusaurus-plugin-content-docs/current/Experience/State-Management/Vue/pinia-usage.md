---
id: state-management-vue-pinia-usage
title: 'Pinia Nutzung in der Praxis'
slug: /experience/state-management/vue/pinia-usage
tags: [Experience, Interview, State-Management, Vue]
---

> In einem Multi-Brand-Projekt: Wie Pinia Stores in Komponenten und Composables eingesetzt werden und wie Stores miteinander kommunizieren.

---

## 1. Kernpunkte fuer das Interview

1. **Nutzung in Komponenten**: Fuer reaktive Werte `storeToRefs` verwenden, Actions koennen direkt destrukturiert werden.
2. **Kombination in Composables**: Mehrere Stores in Composables zusammenfuehren und Business-Logik kapseln.
3. **Store-Kommunikation**: Bevorzugt in Composables orchestrieren, um zyklische Abhaengigkeiten zu vermeiden.

---

## 2. Store-Nutzung in Komponenten

### 2.1 Basisnutzung

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';

// Store-Instanz direkt verwenden
const authStore = useAuthStore();

// State lesen
console.log(authStore.access_token);

// Action aufrufen
authStore.setToptVerified(true);

// Getter lesen
console.log(authStore.isLogin);
</script>
```

### 2.2 Destrukturieren mit `storeToRefs` (wichtig)

```vue
<script setup lang="ts">
import { useAuthStore } from 'stores/authStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

// ❌ Falsch: Reaktivitaet geht verloren
const { access_token, isLogin } = authStore;

// ✅ Richtig: Reaktivitaet bleibt erhalten
const { access_token, isLogin } = storeToRefs(authStore);

// ✅ Actions koennen direkt destrukturiert werden
const { setToptVerified } = authStore;
</script>
```

**Warum geht Reaktivitaet bei direkter Destrukturierung verloren?**

- Pinia state und getters sind reaktiv
- Direkte Destrukturierung trennt die reaktive Verbindung
- `storeToRefs` konvertiert Eigenschaften in `ref`s und erhaelt Reaktivitaet
- Actions selbst sind nicht reaktiv und koennen direkt destrukturiert werden

---

## 3. Store-Nutzung in Composables

### 3.1 Praxisbeispiel: useGame.ts

Composables sind der beste Ort, um Store-Logik zu kombinieren.

```typescript
import { useGameStore } from 'stores/gameStore';
import { useProductStore } from 'stores/productStore';
import { storeToRefs } from 'pinia';

export function useGame() {
  // 1) Mehrere Stores einbinden
  const gameStore = useGameStore();
  const productStore = useProductStore();

  // 2) State und getters ueber storeToRefs destrukturieren
  const { gameState } = storeToRefs(gameStore);
  const { productState } = storeToRefs(productStore);

  // 3) Actions direkt destrukturieren
  const { initAllGameList, updateAllGameList } = gameStore;

  // 4) Kombinierte Logik kapseln
  async function initGameTypeList() {
    const { status, data } = await useApi(getGameTypes);
    if (status) {
      setGameTypeList(data.list);
      setGameTypeMap(data.map);
    }
  }

  // 5) Fuer Komponenten exportieren
  return {
    gameState,
    productState,
    initGameTypeList,
    initAllGameList,
  };
}
```

**Interview-Fokus**:
- Composables als Orchestrierungsschicht fuer mehrere Stores
- `storeToRefs` fuer reaktive Werte
- Actions direkt destrukturieren
- Komplexe Business-Logik aus Komponenten herausziehen

---

## 4. Kommunikation zwischen Stores

### 4.1 Methode 1: Einen anderen Store im Store aufrufen

```typescript
import { defineStore } from 'pinia';
import { useUserInfoStore } from './userInfoStore';

export const useAuthStore = defineStore('authStore', {
  actions: {
    async login(credentials) {
      const { status, data } = await api.login(credentials);
      if (status) {
        this.access_token = data.access_token;

        // Methode aus anderem Store aufrufen
        const userInfoStore = useUserInfoStore();
        userInfoStore.setStoreUserInfo(data.user);
      }
    },
  },
});
```

### 4.2 Methode 2: Mehrere Stores im Composable kombinieren (empfohlen)

```typescript
export function useInit() {
  const authStore = useAuthStore();
  const userInfoStore = useUserInfoStore();
  const gameStore = useGameStore();

  async function initialize() {
    // Initialisierung geordnet ausfuehren
    await authStore.checkAuth();
    if (authStore.isLogin) {
      await userInfoStore.getUserInfo();
      await gameStore.initGameList();
    }
  }

  return { initialize };
}
```

**Interview-Fokus**:
- ✅ Mehrere Stores bevorzugt in Composables kombinieren
- ❌ Zyklische Abhaengigkeiten zwischen Stores vermeiden
- 🎯 Single-Responsibility pro Store beibehalten

---

## 5. Praxisfall: Login-Flow

Ein kompletter Ablauf mit Zusammenarbeit mehrerer Stores.

### 5.1 Ablaufdiagramm

```
Benutzer klickt auf Login
     ↓
useAuth().handleLogin() aufrufen
     ↓
API-Login anfordern
     ↓
Erfolg -> authStore speichert token
     ↓
useUserInfo().getUserInfo()
     ↓
userInfoStore speichert Benutzerdaten
     ↓
useGame().initGameList()
     ↓
gameStore speichert Spielliste
     ↓
Weiterleitung zur Startseite
```

### 5.2 Codebeispiel

```typescript
// 1) authStore.ts - Authentifizierungsstatus verwalten
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    access_token: undefined as string | undefined,
    user_id: undefined as number | undefined,
  }),
  getters: {
    isLogin: (state) => !!state.access_token,
  },
  persist: true, // Auth-Daten persistieren
});

// 2) userInfoStore.ts - Benutzerdaten verwalten
export const useUserInfoStore = defineStore('useInfoStore', {
  state: () => ({
    info: {} as Response.UserInfo,
  }),
  actions: {
    setStoreUserInfo(userInfo: Response.UserInfo) {
      this.info = userInfo;
    },
  },
  persist: false, // Keine Persistenz fuer sensible Daten
});

// 3) useAuth.ts - Auth-Logik kapseln
export function useAuth() {
  const authStore = useAuthStore();
  const { access_token } = storeToRefs(authStore);
  const { isLogin } = storeToRefs(authStore);

  async function handleLogin(credentials: LoginCredentials) {
    const { status, data } = await api.login(credentials);
    if (status) {
      // authStore aktualisieren
      authStore.$patch({
        access_token: data.access_token,
        user_id: data.user_id,
      });
      return true;
    }
    return false;
  }

  return {
    access_token,
    isLogin,
    handleLogin,
  };
}

// 4) LoginPage.vue - Login-Seite
<script setup lang="ts">
import { useAuth } from 'src/common/hooks/useAuth';
import { useUserInfo } from 'src/common/composables/useUserInfo';
import { useGame } from 'src/common/composables/useGame';
import { useRouter } from 'vue-router';

const { handleLogin } = useAuth();
const { getUserInfo } = useUserInfo();
const { initGameList } = useGame();
const router = useRouter();

const onSubmit = async (formData: LoginForm) => {
  // Schritt 1: Login
  const success = await handleLogin(formData);
  if (success) {
    // Schritt 2: Benutzerdaten laden
    await getUserInfo();
    // Schritt 3: Spielliste initialisieren
    await initGameList();
    // Schritt 4: Zur Startseite navigieren
    router.push('/');
  }
};
</script>
```

**Interview-Fokus**:

1. **Klare Verantwortungen**
   - `authStore`: Nur Auth-Status
   - `userInfoStore`: Nur Benutzerdaten
   - `useAuth`: Auth-bezogene Business-Logik
   - `useUserInfo`: Business-Logik fuer Benutzerdaten

2. **Reaktiver Datenfluss**
   - `storeToRefs` fuer reaktive Bindung
   - Store-Updates aktualisieren Komponenten automatisch

3. **Persistenzstrategie**
   - `authStore` persistieren (Login bleibt nach Reload)
   - `userInfoStore` nicht persistieren (Sicherheitsaspekt)

---

## 6. Interview-Antwort kompakt

### 6.1 Einsatz von `storeToRefs`

**Moegliche Antwort:**

> Wenn ich in Komponenten state und getters aus einem Pinia Store destrukturiere, nutze ich `storeToRefs`, damit Reaktivitaet erhalten bleibt. Direkte Destrukturierung trennt die reaktive Verbindung. Actions kann ich direkt destrukturieren, weil sie selbst nicht reaktiv sind.

**Wichtige Punkte:**
- ✅ Zweck von `storeToRefs`
- ✅ Grund fuer den Einsatz
- ✅ Unterschied zu Actions

### 6.2 Kommunikation zwischen Stores

**Moegliche Antwort:**

> Fuer Store-Kommunikation gibt es zwei Wege: direkter Aufruf eines anderen Stores innerhalb eines Stores oder Orchestrierung in einem Composable. In der Praxis bevorzuge ich Composables, weil so zyklische Abhaengigkeiten reduziert und Verantwortlichkeiten klar bleiben.

**Wichtige Punkte:**
- ✅ Zwei Kommunikationsmuster
- ✅ Composable-Ansatz als Best Practice
- ✅ Zyklische Abhaengigkeiten vermeiden

---

## 7. Interview-Zusammenfassung

**Moegliche Antwort:**

> Beim Einsatz von Pinia achte ich auf vier Dinge: erstens `storeToRefs` fuer reaktive Werte in Komponenten, zweitens Orchestrierung mehrerer Stores in Composables, drittens klare Kommunikationsgrenzen zwischen Stores und viertens saubere Verantwortungsaufteilung zwischen Store und Business-Logik.

**Wichtige Punkte:**
- ✅ `storeToRefs` korrekt einsetzen
- ✅ Stores ueber Composables kombinieren
- ✅ Kommunikation sauber gestalten
- ✅ Verantwortungen klar trennen
