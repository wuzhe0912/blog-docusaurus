---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Vergleich

| Eigenschaft | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| Lebenszyklus | Wird standardmaessig beim Schliessen der Seite geloescht, es sei denn, es wurde eine Ablaufzeit (Expires) oder maximale Speicherzeit (Max-Age) festgelegt | Wird beim Schliessen der Seite geloescht | Permanent gespeichert bis zur expliziten Loeschung |
| HTTP Request | Ja, kann ueber den Cookie-Header an den Server gesendet werden | Nein | Nein |
| Gesamtkapazitaet | 4KB | 5MB | 5MB |
| Zugriffsbereich | Fenster-/Tab-uebergreifend | Nur derselbe Tab | Fenster-/Tab-uebergreifend |
| Sicherheit | JavaScript kann nicht auf `HttpOnly cookies` zugreifen | Keine | Keine |

## Begriffserlaeuterung

> Was sind Persistent Cookies?

Persistente Cookies sind eine Methode, um Daten langfristig im Browser des Benutzers zu speichern. Die konkrete Umsetzung erfolgt wie oben erwaehnt durch das Setzen einer Ablaufzeit (`Expires` oder `Max-Age`).

## Persoenliche Implementierungserfahrung

### `cookie`

#### 1. Sicherheitsverifizierung

Bei einigen Legacy-Projekten war die Sicherheitslage schlecht, und es kam haeufig zu Kontodiebstaehlen, was die Betriebskosten erheblich erhoehte. Zunaechst wurde die [Fingerprint](https://fingerprint.com/)-Bibliothek (Community-Version mit einer Genauigkeit von ca. 60%, kostenpflichtige Version mit einem monatlichen Freikontingent von 20.000) eingesetzt, um jeden eingeloggten Benutzer anhand von Geraete- und Standortparametern als eindeutige visitID zu identifizieren. Dann wurde die Eigenschaft von Cookies genutzt, dass sie bei jeder HTTP-Anfrage mitgesendet werden, um das Backend die aktuelle Situation des Benutzers ueberpruefen zu lassen (Geraetewechsel oder auffaellige Standortaenderungen). Bei erkannten Anomalien wurde im Login-Prozess eine OTP-Verifizierung (je nach Unternehmensbedarf per E-Mail oder SMS) erzwungen.

#### 2. Promotion-Code-URLs

Bei der Verwaltung von Produktwebsites wurden haeufig Affiliate-Marketing-Strategien eingesetzt, bei denen Kooperationspartnern exklusive URLs fuer Traffic-Weiterleitung und Werbung bereitgestellt wurden. Um sicherzustellen, dass ueber die Weiterleitung eintreffende Kunden dem jeweiligen Promoter zugeordnet werden, wurde die `expires`-Eigenschaft von `cookie` verwendet. Ab dem Zeitpunkt, an dem der Benutzer ueber die Weiterleitung auf die Website gelangt, bleibt der Promotion-Code 24 Stunden lang (die Frist kann vom Betreiber festgelegt werden) zwingend gueltig. Selbst wenn der Benutzer absichtlich den Promotion-Code-Parameter aus der URL entfernt, wird bei der Registrierung der entsprechende Parameter aus dem `cookie` ausgelesen und angewendet, bis er nach 24 Stunden automatisch ablaeuft.

### `localStorage`

#### 1. Speicherung von Benutzereinstellungen

- Wird haeufig fuer die Speicherung persoenlicher Benutzereinstellungen verwendet, z.B. Dark Mode, i18n-Spracheinstellungen usw.
- Oder die Speicherung eines Login-Tokens.
