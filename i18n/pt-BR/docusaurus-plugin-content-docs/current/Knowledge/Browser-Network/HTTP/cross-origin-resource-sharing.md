---
id: cross-origin-resource-sharing
title: "\U0001F4C4 CORS"
slug: /cross-origin-resource-sharing
---

## 1. Qual é a diferença entre JSONP e CORS?

JSONP (JSON with Padding) e CORS (Cross-Origin Resource Sharing) são duas técnicas para realizar requisições cross-origin, permitindo que páginas web solicitem dados de domínios (sites) diferentes.

### JSONP

JSONP é uma técnica mais antiga usada para contornar as restrições da política de mesma origem, permitindo que páginas web solicitem dados de origens diferentes (domínio, protocolo ou porta). Como o carregamento de tags `<script>` não é restringido pela política de mesma origem, o JSONP funciona adicionando dinamicamente uma tag `<script>` que aponta para uma URL que retorna dados JSON. A resposta dessa URL é envolvida em uma chamada de função, e o JavaScript na página define essa função antecipadamente para receber os dados.

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

A desvantagem é que o risco de segurança é maior (pois pode executar JavaScript arbitrário) e suporta apenas requisições GET.

### CORS

CORS é uma técnica mais segura e moderna que o JSONP. Ele usa o header HTTP `Access-Control-Allow-Origin` para informar ao navegador que a requisição é permitida. O servidor configura os headers CORS relevantes para determinar quais origens podem acessar seus recursos.

Se o frontend em `http://client.com` quiser acessar os recursos de `http://api.example.com`, `api.example.com` precisa incluir o seguinte HTTP header na sua resposta:

```http
Access-Control-Allow-Origin: http://client.com
```

Ou, se permitir qualquer origem:

```http
Access-Control-Allow-Origin: *
```

O CORS pode ser usado para qualquer tipo de requisição HTTP e é uma forma padronizada e segura de realizar requisições cross-origin.
