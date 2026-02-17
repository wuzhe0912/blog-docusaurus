---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Vergleich

| Eigenschaft | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| Lebenszyklus | Wird standardmäßig beim Schließen der Seite gelöscht, es sei denn, es wurde eine Ablaufzeit (Expires) oder maximale Speicherzeit (Max-Age) festgelegt | Wird beim Schließen der Seite gelöscht | Permanent gespeichert bis zur expliziten Löschung |
| HTTP Request | Ja, kann über den Cookie-Header an den Server gesendet werden | Nein | Nein |
| Gesamtkapazität | 4KB | 5MB | 5MB |
| Zugriffsbereich | Fenster-/Tab-übergreifend | Nur derselbe Tab | Fenster-/Tab-übergreifend |
| Sicherheit | JavaScript kann nicht auf `HttpOnly cookies` zugreifen | Keine | Keine |

## Begriffserläuterung

> Was sind Persistent Cookies?

Persistente Cookies sind eine Methode, um Daten langfristig im Browser des Benutzers zu speichern. Die konkrete Umsetzung erfolgt wie oben erwähnt durch das Setzen einer Ablaufzeit (`Expires` oder `Max-Age`).

## Persönliche Implementierungserfahrung

### `cookie`

#### 1. Sicherheitsverifizierung

Bei einigen Legacy-Projekten war die Sicherheitslage schlecht, und es kam häufig zu Kontodiebstählen, was die Betriebskosten erheblich erhöhte. Zunächst wurde die [Fingerprint](https://fingerprint.com/)-Bibliothek (Community-Version mit einer Genauigkeit von ca. 60%, kostenpflichtige Version mit einem monatlichen Freikontingent von 20.000) eingesetzt, um jeden eingeloggten Benutzer anhand von Geräte- und Standortparametern als eindeutige visitID zu identifizieren. Dann wurde die Eigenschaft von Cookies genutzt, dass sie bei jeder HTTP-Anfrage mitgesendet werden, um das Backend die aktuelle Situation des Benutzers überprüfen zu lassen (Gerätewechsel oder auffällige Standortänderungen). Bei erkannten Anomalien wurde im Login-Prozess eine OTP-Verifizierung (je nach Unternehmensbedarf per E-Mail oder SMS) erzwungen.

#### 2. Promotion-Code-URLs

Bei der Verwaltung von Produktwebsites wurden häufig Affiliate-Marketing-Strategien eingesetzt, bei denen Kooperationspartnern exklusive URLs für Traffic-Weiterleitung und Werbung bereitgestellt wurden. Um sicherzustellen, dass über die Weiterleitung eintreffende Kunden dem jeweiligen Promoter zugeordnet werden, wurde die `expires`-Eigenschaft von `cookie` verwendet. Ab dem Zeitpunkt, an dem der Benutzer über die Weiterleitung auf die Website gelangt, bleibt der Promotion-Code 24 Stunden lang (die Frist kann vom Betreiber festgelegt werden) zwingend gültig. Selbst wenn der Benutzer absichtlich den Promotion-Code-Parameter aus der URL entfernt, wird bei der Registrierung der entsprechende Parameter aus dem `cookie` ausgelesen und angewendet, bis er nach 24 Stunden automatisch abläuft.

### `localStorage`

#### 1. Speicherung von Benutzereinstellungen

- Wird häufig für die Speicherung persönlicher Benutzereinstellungen verwendet, z.B. Dark Mode, i18n-Spracheinstellungen usw.
- Oder die Speicherung eines Login-Tokens.
