---
id: cross-origin-resource-sharing
title: "\U0001F4C4 CORS"
slug: /cross-origin-resource-sharing
---

## 1. В чём разница между JSONP и CORS?

JSONP (JSON with Padding) и CORS (Cross-Origin Resource Sharing) — это два метода реализации межсайтовых запросов, позволяющие веб-страницам запрашивать данные с различных доменов.

### JSONP

JSONP — это старый метод, используемый для обхода ограничений политики одного источника (same-origin policy), позволяющий веб-страницам запрашивать данные из других источников (домен, протокол или порт). Поскольку загрузка через тег `<script>` не подчиняется политике одного источника, JSONP работает путём динамического добавления тега `<script>`, указывающего на URL, возвращающий JSON-данные. Ответ от этого URL оборачивается в вызов функции, а JavaScript на странице заранее определяет эту функцию для получения данных.

```javascript
// клиентская сторона
function receiveData(jsonData) {
  console.log(jsonData);
}

let script = document.createElement('script');
script.src = 'http://example.com/data?callback=receiveData';
document.body.appendChild(script);
```

```javascript
// серверная сторона
receiveData({ name: 'PittWu', type: 'player' });
```

Недостаток — более высокий риск безопасности (поскольку может выполнять произвольный JavaScript) и поддержка только GET-запросов.

### CORS

CORS — это более безопасный и современный метод по сравнению с JSONP. Он использует HTTP-заголовок `Access-Control-Allow-Origin`, чтобы сообщить браузеру, что запрос разрешён. Сервер настраивает соответствующие CORS-заголовки, чтобы определить, какие источники могут получить доступ к его ресурсам.

Например, если фронтенд на `http://client.com` хочет получить доступ к ресурсам на `http://api.example.com`, серверу `api.example.com` необходимо включить следующий HTTP-заголовок в свой ответ:

```http
Access-Control-Allow-Origin: http://client.com
```

Или для разрешения любого источника:

```http
Access-Control-Allow-Origin: *
```

CORS можно использовать с любым типом HTTP-запроса, и это стандартизированный, безопасный способ выполнения межсайтовых запросов.
