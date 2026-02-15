---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Koennen Sie erklaeren, was CSP (Content Security Policy) ist?

> Can you explain what CSP (Content Security Policy) is?

Grundsaetzlich ist CSP ein Mechanismus zur Verbesserung der Websicherheit. Durch die Konfiguration von HTTP-Headern kann man die Datenquellen einschraenken, aus denen Webinhalte geladen werden koennen (Whitelist), um zu verhindern, dass boesartige Angreifer Benutzerdaten durch Einschleusen schaedlicher Scripts stehlen.

Aus Front-end-Sicht werden zur Vermeidung von XSS (Cross-site Scripting)-Angriffen haeufig moderne Frameworks verwendet, da diese grundlegende Schutzmechanismen bieten. Zum Beispiel fuehrt React's JSX automatisch HTML-Escaping durch, und Vue escapt HTML-Tags automatisch bei der Datenbindung mit `{{ data }}`.

Obwohl das Front-end in diesem Bereich nur begrenzte Moeglichkeiten hat, gibt es einige Detailoptimierungen:

1. Bei Formularen, die Inhaltseingabe erfordern, kann man Sonderzeichen validieren, um Angriffe zu vermeiden (aber es ist schwer, alle Szenarien vorherzusehen), daher wird haeufig die Laengenbegrenzung verwendet, um Client-seitige Eingaben zu kontrollieren, oder der Eingabetyp wird eingeschraenkt.
2. Bei Verweisen auf externe Links vermeiden Sie http-URLs und verwenden Sie https-URLs.
3. Bei statischen Websites kann man Meta-Tags zur Einschraenkung konfigurieren, wie folgt:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: Standardmaessig duerfen Daten nur vom gleichen Ursprung (gleiche Domain) geladen werden.
- `img-src https://*`: Bilder duerfen nur ueber HTTPS-Protokoll geladen werden.
- `child-src 'none'`: Es duerfen keine externen Unterressourcen eingebettet werden, z.B. `<iframe>`.

## 2. Was ist ein XSS (Cross-site Scripting)-Angriff?

> What is XSS (Cross-site scripting) attack?

XSS, also Cross-site Scripting, bezeichnet einen Angriff, bei dem der Angreifer boesartige Scripts einschleust, die im Browser des Benutzers ausgefuehrt werden, um sensible Daten wie Cookies zu erlangen oder Webinhalte direkt zu veraendern und Benutzer auf schadhafte Websites umzuleiten.

### Vermeidung von gespeichertem XSS

Angreifer koennen ueber Kommentare absichtlich schadhaftes HTML oder Scripts in die Datenbank einschleusen. In diesem Fall fuehrt neben dem Backend-Escaping auch das Front-end mit modernen Frameworks wie React's JSX oder Vue's Template `{{ data }}` Escaping durch, um die Wahrscheinlichkeit von XSS-Angriffen zu reduzieren.

### Vermeidung von reflektiertem XSS

Vermeiden Sie die Verwendung von `innerHTML` zur DOM-Manipulation, da dies die Ausfuehrung von HTML-Tags ermoeglicht. Die allgemeine Empfehlung ist die Verwendung von `textContent` fuer die Manipulation.

### Vermeidung von DOM-basiertem XSS

Grundsaetzlich verhindern wir, dass Benutzer HTML direkt in die Seite einfuegen. Wenn es szenariobedingt erforderlich ist, bieten die Frameworks selbst aehnliche Direktiven, wie React's `dangerouslySetInnerHTML` und Vue's `v-html`, die automatisch XSS verhindern helfen. Wenn jedoch native JavaScript-Entwicklung erforderlich ist, verwenden Sie vorzugsweise `textContent`, `createElement` und `setAttribute` fuer die DOM-Manipulation.
