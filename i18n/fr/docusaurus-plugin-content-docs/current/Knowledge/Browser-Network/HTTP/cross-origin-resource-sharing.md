---
id: cross-origin-resource-sharing
title: "\U0001F4C4 CORS"
slug: /cross-origin-resource-sharing
---

## 1. Quelle est la différence entre JSONP et CORS ?

JSONP (JSON with Padding) et CORS (Cross-Origin Resource Sharing) sont deux techniques permettant d'effectuer des requêtes cross-origin, autorisant les pages web à demander des données depuis des noms de domaine (sites web) différents.

### JSONP

JSONP est une technique plus ancienne, utilisée pour contourner les restrictions de la politique de même origine (Same-Origin Policy), permettant aux pages web de demander des données depuis des origines différentes (domaine, protocole ou port). Comme le chargement des balises `<script>` n'est pas soumis à la politique de même origine, JSONP fonctionne en ajoutant dynamiquement une balise `<script>` pointant vers une URL qui renvoie des données JSON. La réponse de cette URL est encapsulée dans un appel de fonction, et le JavaScript de la page définit cette fonction à l'avance pour recevoir les données.

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

L'inconvénient est un risque de sécurité élevé (car du JavaScript arbitraire peut être exécuté) et la prise en charge limitée aux requêtes GET uniquement.

### CORS

CORS est une technique plus sécurisée et plus moderne que JSONP. Elle utilise l'en-tête HTTP `Access-Control-Allow-Origin` pour indiquer au navigateur que la requête est autorisée. Le serveur configure les en-têtes CORS appropriés pour déterminer quelles origines peuvent accéder à ses ressources.

Si le front-end de `http://client.com` souhaite accéder aux ressources de `http://api.example.com`, `api.example.com` doit inclure l'en-tête HTTP suivant dans sa réponse :

```http
Access-Control-Allow-Origin: http://client.com
```

Ou, si toute origine est autorisée :

```http
Access-Control-Allow-Origin: *
```

CORS peut être utilisé pour tout type de requête HTTP et constitue un moyen standardisé et sécurisé pour effectuer des requêtes cross-origin.
