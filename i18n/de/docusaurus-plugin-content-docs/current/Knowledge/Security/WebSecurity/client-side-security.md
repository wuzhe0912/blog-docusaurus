---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Können Sie erklären, was CSP (Content Security Policy) ist?

> Can you explain what CSP (Content Security Policy) is?

Grundsätzlich ist CSP ein Mechanismus zur Verbesserung der Websicherheit. Durch die Konfiguration von HTTP-Headern kann man die Datenquellen einschränken, aus denen Webinhalte geladen werden können (Whitelist), um zu verhindern, dass bösartige Angreifer Benutzerdaten durch Einschleusen schädlicher Scripts stehlen.

Aus Front-end-Sicht werden zur Vermeidung von XSS (Cross-site Scripting)-Angriffen häufig moderne Frameworks verwendet, da diese grundlegende Schutzmechanismen bieten. Zum Beispiel führt React's JSX automatisch HTML-Escaping durch, und Vue escapt HTML-Tags automatisch bei der Datenbindung mit `{{ data }}`.

Obwohl das Front-end in diesem Bereich nur begrenzte Möglichkeiten hat, gibt es einige Detailoptimierungen:

1. Bei Formularen, die Inhaltseingabe erfordern, kann man Sonderzeichen validieren, um Angriffe zu vermeiden (aber es ist schwer, alle Szenarien vorherzusehen), daher wird häufig die Längenbegrenzung verwendet, um Client-seitige Eingaben zu kontrollieren, oder der Eingabetyp wird eingeschränkt.
2. Bei Verweisen auf externe Links vermeiden Sie http-URLs und verwenden Sie https-URLs.
3. Bei statischen Websites kann man Meta-Tags zur Einschränkung konfigurieren, wie folgt:

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'`: Standardmäßig dürfen Daten nur vom gleichen Ursprung (gleiche Domain) geladen werden.
- `img-src https://*`: Bilder dürfen nur über HTTPS-Protokoll geladen werden.
- `child-src 'none'`: Es dürfen keine externen Unterressourcen eingebettet werden, z.B. `<iframe>`.

## 2. Was ist ein XSS (Cross-site Scripting)-Angriff?

> What is XSS (Cross-site scripting) attack?

XSS, also Cross-site Scripting, bezeichnet einen Angriff, bei dem der Angreifer bösartige Scripts einschleust, die im Browser des Benutzers ausgeführt werden, um sensible Daten wie Cookies zu erlangen oder Webinhalte direkt zu verändern und Benutzer auf schadhafte Websites umzuleiten.

### Vermeidung von gespeichertem XSS

Angreifer können über Kommentare absichtlich schadhaftes HTML oder Scripts in die Datenbank einschleusen. In diesem Fall führt neben dem Backend-Escaping auch das Front-end mit modernen Frameworks wie React's JSX oder Vue's Template `{{ data }}` Escaping durch, um die Wahrscheinlichkeit von XSS-Angriffen zu reduzieren.

### Vermeidung von reflektiertem XSS

Vermeiden Sie die Verwendung von `innerHTML` zur DOM-Manipulation, da dies die Ausführung von HTML-Tags ermöglicht. Die allgemeine Empfehlung ist die Verwendung von `textContent` für die Manipulation.

### Vermeidung von DOM-basiertem XSS

Grundsätzlich verhindern wir, dass Benutzer HTML direkt in die Seite einfügen. Wenn es szenariobedingt erforderlich ist, bieten die Frameworks selbst ähnliche Direktiven, wie React's `dangerouslySetInnerHTML` und Vue's `v-html`, die automatisch XSS verhindern helfen. Wenn jedoch native JavaScript-Entwicklung erforderlich ist, verwenden Sie vorzugsweise `textContent`, `createElement` und `setAttribute` für die DOM-Manipulation.
