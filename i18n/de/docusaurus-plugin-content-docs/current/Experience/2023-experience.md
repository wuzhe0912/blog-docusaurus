---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> Was ist das schwierigste technische Problem, das du geloest hast?

### Webauthn

Das technische Problem, das ich kuerzlich bearbeitet habe und das relativ neu war mit wenig einschlaegiger Erfahrung, war die Implementierung der Webauthn-Anmeldung. Die Anforderungsseite wuenschte sich, dass Benutzer beim Einloggen auf der Webseite denselben Face ID / Touch ID Mechanismus wie in der App ausloesen koennen, um ein reibungsloseres Benutzererlebnis zu schaffen.

Referenzmaterialien vor der Implementierung:

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

Nach der vorlaeufigen Bestaetigung der Machbarkeit wurde mit der PM-Seite der gesamte Anmelde- und Registrierungsablauf abgestimmt, einschliesslich der Frage, ob bei der ersten Anmeldung eine biometrische Verifizierung ausgeloest wird, sowie die Bestimmungsmechanismen. Die groesste Herausforderung waehrend der Implementierung war die staendige Feinabstimmung verschiedener Eingabeparameter, da die verfuegbaren Referenzmaterialien noch zu begrenzt waren und die Bedeutung vieler Parameter unklar war - es blieb nur staendiges Ausprobieren. Bei den Geraeten waren iOS-Telefone relativ einfach zu handhaben, aber bei Android-Telefonen trat das Problem auf, dass Touch ID schwer auszuloesen war, was die Unterstuetzung des Backends bei der Anpassung einiger Parameter fuer die Kompatibilitaet erforderte. Nach Abschluss der Funktion bot die Kombination mit dem zuvor eingefuehrten PWA ein insgesamt App-naeheres Nutzungserlebnis auf der Webseite.
