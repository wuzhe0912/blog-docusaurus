---
id: script-loading-strategies
title: '[Easy] 📄 <script>, <script async>, <script defer>'
slug: /script-loading-strategies
tags: [JavaScript, Quiz, Easy]
---

## Aperçu

En HTML, il existe trois méthodes principales pour charger des fichiers JavaScript :

1. `<script>`
2. `<script async>`
3. `<script defer>`

Ces trois méthodes ont des comportements différents lors du chargement et de l'exécution des scripts.

## Comparaison détaillée

### `<script>`

- **Comportement** : Lorsque le navigateur rencontre cette balise, il arrête l'analyse du HTML, télécharge et exécute le script, puis reprend l'analyse du HTML.
- **Quand l'utiliser** : Adapté aux scripts essentiels au rendu de la page.
- **Avantage** : Garantit que les scripts sont exécutés dans l'ordre.
- **Inconvénient** : Peut retarder le rendu de la page.

```html
<script src="important.js"></script>
```

### `<script async>`

- **Comportement** : Le navigateur télécharge le script en arrière-plan tout en continuant l'analyse du HTML. Une fois le téléchargement terminé, le script est exécuté immédiatement, ce qui peut interrompre l'analyse du HTML.
- **Quand l'utiliser** : Adapté aux scripts indépendants, tels que les scripts d'analyse ou de publicité.
- **Avantage** : Ne bloque pas l'analyse du HTML et peut améliorer la vitesse de chargement de la page.
- **Inconvénient** : L'ordre d'exécution n'est pas garanti ; le script peut s'exécuter avant que le DOM ne soit entièrement chargé.

```html
<script async src="analytics.js"></script>
```

### `<script defer>`

- **Comportement** : Le navigateur télécharge le script en arrière-plan, mais attend que l'analyse du HTML soit terminée avant de l'exécuter. Plusieurs scripts defer sont exécutés dans l'ordre dans lequel ils apparaissent dans le HTML.
- **Quand l'utiliser** : Adapté aux scripts qui nécessitent la structure complète du DOM, mais qui ne sont pas nécessaires immédiatement.
- **Avantage** : Ne bloque pas l'analyse du HTML, garantit l'ordre d'exécution et convient aux scripts dépendants du DOM.
- **Inconvénient** : Si le script est important, cela peut retarder le temps d'interactivité de la page.

```html
<script defer src="ui-enhancements.js"></script>
```

## Exemple

Imaginez que vous vous préparez pour un rendez-vous :

1. **`<script>`** :
   C'est comme arrêter tous vos préparatifs pour appeler votre partenaire et confirmer les détails du rendez-vous. La communication est assurée, mais votre temps de préparation risque d'être retardé.

2. **`<script async>`** :
   C'est comme vous préparer tout en parlant à votre partenaire via des écouteurs Bluetooth. L'efficacité augmente, mais vous pourriez mettre les mauvais vêtements à force de vous concentrer sur l'appel.

3. **`<script defer>`** :
   C'est comme envoyer un message à votre partenaire pour lui dire que vous le rappellerez une fois prêt. Ainsi, vous pouvez vous concentrer sur vos préparatifs et communiquer sereinement une fois que tout est en place.

## Utilisation actuelle

Dans le développement avec des frameworks modernes, il n'est généralement pas nécessaire de configurer `<script>` manuellement. Par exemple, Vite utilise par défaut module, ce qui correspond au comportement de defer.

```javascript
<script type="module" src="/src/main.js"></script>
```

Sauf dans le cas de scripts tiers spéciaux, comme Google Analytics.

```javascript
<script async src="https://www.google-analytics.com/analytics.js"></script>
```
