---
id: cross-origin-resource-sharing
title: "\U0001F4C4 CORS"
slug: /cross-origin-resource-sharing
---

## 1. Was ist der Unterschied zwischen JSONP und CORS?

JSONP (JSON with Padding) und CORS (Cross-Origin Resource Sharing) sind zwei Techniken zur Durchfuehrung von Cross-Origin-Anfragen, die es Webseiten ermoeglichen, Daten von anderen Domaenen (Websites) anzufordern.

### JSONP

JSONP ist eine aeltere Technik, die verwendet wird, um die Einschraenkungen der Same-Origin-Policy zu umgehen, und es Webseiten ermoeglicht, Daten von anderen Urspruengen (Domain, Protokoll oder Port) anzufordern. Da das Laden von `<script>`-Tags nicht durch die Same-Origin-Policy eingeschraenkt wird, funktioniert JSONP, indem dynamisch ein `<script>`-Tag hinzugefuegt wird, das auf eine URL zeigt, die JSON-Daten zurueckgibt. Die Antwort dieser URL ist in einen Funktionsaufruf eingehuellt, und JavaScript auf der Seite definiert diese Funktion im Voraus, um die Daten zu empfangen.

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

Der Nachteil ist ein hoeheres Sicherheitsrisiko (da beliebiges JavaScript ausgefuehrt werden kann) und es werden nur GET-Anfragen unterstuetzt.

### CORS

CORS ist eine sicherere und modernere Technik als JSONP. Es verwendet den HTTP-Header `Access-Control-Allow-Origin`, um dem Browser mitzuteilen, dass die Anfrage erlaubt ist. Der Server konfiguriert die entsprechenden CORS-Header, um festzulegen, welche Urspruenge auf seine Ressourcen zugreifen duerfen.

Wenn das Frontend unter `http://client.com` auf die Ressourcen von `http://api.example.com` zugreifen moechte, muss `api.example.com` den folgenden HTTP-Header in seine Antwort aufnehmen:

```http
Access-Control-Allow-Origin: http://client.com
```

Oder wenn jeder Ursprung erlaubt sein soll:

```http
Access-Control-Allow-Origin: *
```

CORS kann fuer jede Art von HTTP-Anfrage verwendet werden und ist eine standardisierte und sichere Methode zur Durchfuehrung von Cross-Origin-Anfragen.
