---
id: login-lv1-project-implementation
title: '[Lv1] Wie wurde der Login-Mechanismus in früheren Projekten implementiert?'
slug: /experience/login/lv1-project-implementation
tags: [Experience, Interview, Login, Lv1]
---

> Ziel: In 3 bis 5 Minuten klar erklären, "wie das Front-end Login, Zustandsverwaltung und Seitenschutz handhabt", um sich im Interview schnell erinnern zu können.

---

## 1. Hauptachse der Interview-Antwort

1. **Drei Phasen des Login-Ablaufs**: Formular absenden -> Backend-Verifizierung -> Token speichern und weiterleiten.
2. **Zustands- und Token-Verwaltung**: Pinia mit Persistierung, Axios Interceptor fügt automatisch den Bearer Token hinzu.
3. **Nachfolgende Behandlung und Schutz**: Gemeinsame Daten initialisieren, Route Guards, Logout und Ausnahmeszenarien (OTP, erzwungene Passwortänderung).

Beginnen Sie mit diesen drei Kernpunkten und erweitern Sie die Details nach Bedarf, damit der Interviewer erkennt, dass Sie einen Gesamtüberblick haben.

---

## 2. Systemkomposition und Aufgabenverteilung

| Modul            | Speicherort                         | Rolle                                          |
| ---------------- | ----------------------------------- | ---------------------------------------------- |
| `authStore`      | `src/stores/authStore.ts`           | Speichert Login-Zustand, persistiert Token, bietet Getters |
| `useAuth` Hook   | `src/common/hooks/useAuth.ts`       | Kapselt Login/Logout-Ablauf, einheitliches Rückgabeformat |
| Login API        | `src/api/login.ts`                  | Ruft Backend `POST /login`, `POST /logout` auf |
| Axios Utility    | `src/common/utils/request.ts`       | Request/Response Interceptor, einheitliche Fehlerbehandlung |
| Route Guard      | `src/router/index.ts`               | Prüft anhand von `meta`, ob Login erforderlich ist, leitet zur Login-Seite weiter |
| Initialisierungsablauf | `src/common/composables/useInit.ts` | Prüft beim App-Start, ob bereits ein Token vorhanden ist, lädt notwendige Daten |

> Merkhilfe: **"Store verwaltet Zustand, Hook verwaltet Ablauf, Interceptor verwaltet Kanal, Guard verwaltet Seiten"**.

---

## 3. Login-Ablauf (Schritt für Schritt)

### Step 0. Formular und Vorvalidierung

- Unterstützt zwei Login-Methoden: konventionelles Passwort und SMS-Verifizierungscode.
- Vor dem Absenden: grundlegende Validierung (Pflichtfelder, Format, Schutz vor Doppel-Submissions).

### Step 1. Login-API aufrufen

```typescript
const { status, data, code } = await useApi(login, payload);
```

- `useApi` vereinheitlicht Fehlerbehandlung und Loading-Management.
- Bei Erfolg enthält `data` den Token und die wesentlichen Benutzerinformationen.

### Step 2. Backend-Antwort verarbeiten

| Szenario                                         | Verhalten                                               |
| ------------------------------------------------ | ------------------------------------------------------- |
| **Zusätzliche Verifizierung erforderlich** (z.B. Identitätsbestätigung beim Erstlogin) | Setzt `authStore.onBoarding` auf `true`, leitet zur Verifizierungsseite weiter |
| **Erzwungene Passwortänderung**                 | Leitet gemäß dem zurückgegebenen Flag zum Passwortänderungsablauf weiter, mit notwendigen Parametern |
| **Normaler Erfolg**                              | Ruft `authStore.$patch()` auf, um Token und Benutzerinformationen zu speichern |

### Step 3. Gemeinsame Aktionen nach erfolgreichem Login

1. Benutzerbasisdaten und Wallet-Liste abrufen.
2. Personalisierten Inhalt initialisieren (z.B. Geschenkeliste, Benachrichtigungen).
3. Anhand von `redirect` oder festgelegter Route zur internen Seite weiterleiten.

> Erfolgreiches Login ist nur die halbe Miete. **Die nachfolgenden gemeinsamen Daten müssen zu diesem Zeitpunkt geladen werden**, um zu vermeiden, dass jede Seite separate API-Aufrufe macht.

---

## 4. Token-Lebenszyklus-Verwaltung

### 4.1 Speicherstrategie

- `authStore` mit aktiviertem `persist: true`, schreibt Schlüsselfelder in `localStorage`.
- Vorteil: Zustand wird nach Seitenaktualisierung automatisch wiederhergestellt; Nachteil: Man muss auf XSS und Sicherheit achten.

### 4.2 Axios Request Interceptor

```typescript
if (needToken) {
  const { access_token } = auth.value;
  config.headers.Authorization = `Bearer ${access_token}`;
}
```

- APIs, die Autorisierung erfordern, fügen automatisch den Bearer Token ein.
- Wenn eine API explizit `needToken: false` markiert ist (Login, Registrierung etc.), wird das Einfügen übersprungen.

### 4.3 Ablauf- und Ausnahmebehandlung

- Wenn das Backend einen abgelaufenen oder ungültigen Token zurückgibt, wandelt der Response Interceptor dies in eine einheitliche Fehlermeldung um und löst den Logout-Ablauf aus.
- Zur Erweiterung kann ein Refresh Token-Mechanismus hinzugefügt werden; das aktuelle Projekt verwendet eine vereinfachte Strategie.

---

## 5. Routenschutz und Initialisierung

### 5.1 Route Guard

```typescript
router.beforeEach((to, from, next) => {
  const { needAuth, goRouteIfNoToken } = to.meta;
  if (needAuth && !authStore.isLogin) {
    return next({ name: goRouteIfNoToken || 'Login' });
  }
  next();
});
```

- Prüft den Login-Zustand anhand von `meta.needAuth`.
- Leitet bei fehlendem Login zur Login-Seite oder einer bestimmten öffentlichen Seite weiter.

### 5.2 Anwendungsinitialisierung

`useInit` behandelt beim App-Start:

1. Prüft, ob die URL `login_token` oder `platform_token` enthält; wenn ja, automatischer Login oder Token-Konfiguration.
2. Wenn der Store bereits einen Token hat, werden Benutzerinformationen und gemeinsame Daten geladen.
3. Ohne Token verbleibt man auf der öffentlichen Seite und wartet auf manuellen Login des Benutzers.

---

## 6. Logout-Ablauf (Abschluss und Bereinigung)

1. `POST /logout` aufrufen, um das Backend zu informieren.
2. `reset()` ausführen:
   - `authStore.$reset()` löscht Login-Informationen.
   - Zugehörige Stores (Benutzerinformationen, Favoriten, Einladungscodes etc.) werden zurückgesetzt.
3. Browser-Cache bereinigen (z.B. Cache im localStorage).
4. Zurück zur Login-Seite oder Startseite leiten.

> Logout ist das Spiegelbild des Logins: Es reicht nicht, nur den Token zu löschen; alle abhängigen Zustände müssen bereinigt werden, um Restdaten zu vermeiden.

---

## 7. Häufige Fragen und Best Practices

- **Ablauftrennung**: Login und Post-Login-Initialisierung getrennt halten, damit der Hook schlank bleibt.
- **Fehlerbehandlung**: Einheitlich über `useApi` und Response Interceptor, um konsistente UI-Anzeige zu gewährleisten.
- **Sicherheit**:
  - Durchgehend HTTPS verwenden.
  - Bei Token-Speicherung im `localStorage` müssen sensible Operationen XSS berücksichtigen.
  - Bei Bedarf auf httpOnly Cookie oder Refresh Token erweitern.
- **Notfallplan**: Szenarien wie OTP und erzwungene Passwortänderung bleiben flexibel; der Hook gibt den Zustand zurück, damit die Ansicht ihn verarbeiten kann.

---

## 8. Schnelle Merkhilfe fürs Interview

1. **"Eingabe -> Verifizierung -> Speicherung -> Weiterleitung"**: Beschreiben Sie den Gesamtablauf in dieser Reihenfolge.
2. **"Store speichert Zustand, Interceptor hilft beim Header, Guard blockiert Unbefugte"**: Betonen Sie die architektonische Aufgabenverteilung.
3. **"Nach dem Login sofort gemeinsame Daten laden"**: Zeigen Sie Sensibilität für Benutzererfahrung.
4. **"Logout ist ein Ein-Klick-Reset + Zurück zur sicheren Seite"**: Decken Sie Sicherheit und Ablaufabschluss ab.
