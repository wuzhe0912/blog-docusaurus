---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> Was ist das schwierigste technische Problem, das du gelöst hast?

### Webauthn

Das technische Problem, das ich kürzlich bearbeitet habe und das relativ neu war mit wenig einschlägiger Erfahrung, war die Implementierung der Webauthn-Anmeldung. Die Anforderungsseite wünschte sich, dass Benutzer beim Einloggen auf der Webseite denselben Face ID / Touch ID Mechanismus wie in der App auslösen können, um ein reibungsloseres Benutzererlebnis zu schaffen.

Referenzmaterialien vor der Implementierung:

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

Nach der vorläufigen Bestätigung der Machbarkeit wurde mit der PM-Seite der gesamte Anmelde- und Registrierungsablauf abgestimmt, einschließlich der Frage, ob bei der ersten Anmeldung eine biometrische Verifizierung ausgelöst wird, sowie die Bestimmungsmechanismen. Die größte Herausforderung während der Implementierung war die ständige Feinabstimmung verschiedener Eingabeparameter, da die verfügbaren Referenzmaterialien noch zu begrenzt waren und die Bedeutung vieler Parameter unklar war - es blieb nur ständiges Ausprobieren. Bei den Geräten waren iOS-Telefone relativ einfach zu handhaben, aber bei Android-Telefonen trat das Problem auf, dass Touch ID schwer auszulösen war, was die Unterstützung des Backends bei der Anpassung einiger Parameter für die Kompatibilität erforderte. Nach Abschluss der Funktion bot die Kombination mit dem zuvor eingeführten PWA ein insgesamt App-näheres Nutzungserlebnis auf der Webseite.
