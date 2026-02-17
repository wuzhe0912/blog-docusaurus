---
id: cross-origin-resource-sharing
title: "\U0001F4C4 CORS"
slug: /cross-origin-resource-sharing
---

## 1. Was ist der Unterschied zwischen JSONP und CORS?

JSONP (JSON with Padding) und CORS (Cross-Origin Resource Sharing) sind zwei Techniken zur Durchführung von Cross-Origin-Anfragen, die es Webseiten ermöglichen, Daten von anderen Domänen (Websites) anzufordern.

### JSONP

JSONP ist eine ältere Technik, die verwendet wird, um die Einschränkungen der Same-Origin-Policy zu umgehen, und es Webseiten ermöglicht, Daten von anderen Ursprüngen (Domain, Protokoll oder Port) anzufordern. Da das Laden von `<script>`-Tags nicht durch die Same-Origin-Policy eingeschränkt wird, funktioniert JSONP, indem dynamisch ein `<script>`-Tag hinzugefügt wird, das auf eine URL zeigt, die JSON-Daten zurückgibt. Die Antwort dieser URL ist in einen Funktionsaufruf eingehüllt, und JavaScript auf der Seite definiert diese Funktion im Voraus, um die Daten zu empfangen.

```javascript
// client-side
function receiveData(jsonData) {
  console.log(jsonData);
}

let script = document.createElement('script');
script.src = 'http://example.com/data?callback=receiveData';
document.body.appendChild(script);
```

```javascript
// server-side
receiveData({ name: 'PittWu', type: 'player' });
```

Der Nachteil ist ein höheres Sicherheitsrisiko (da beliebiges JavaScript ausgeführt werden kann) und es werden nur GET-Anfragen unterstützt.

### CORS

CORS ist eine sicherere und modernere Technik als JSONP. Es verwendet den HTTP-Header `Access-Control-Allow-Origin`, um dem Browser mitzuteilen, dass die Anfrage erlaubt ist. Der Server konfiguriert die entsprechenden CORS-Header, um festzulegen, welche Ursprünge auf seine Ressourcen zugreifen dürfen.

Wenn das Frontend unter `http://client.com` auf die Ressourcen von `http://api.example.com` zugreifen möchte, muss `api.example.com` den folgenden HTTP-Header in seine Antwort aufnehmen:

```http
Access-Control-Allow-Origin: http://client.com
```

Oder wenn jeder Ursprung erlaubt sein soll:

```http
Access-Control-Allow-Origin: *
```

CORS kann für jede Art von HTTP-Anfrage verwendet werden und ist eine standardisierte und sichere Methode zur Durchführung von Cross-Origin-Anfragen.
