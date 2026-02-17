---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Pouvez-vous expliquer ce qu'est le CSP (Content Security Policy) ?

> Can you explain what CSP (Content Security Policy) is?

En principe, le CSP est un mécanisme qui renforce la sécurité des pages web. Il permet, via la configuration d'un en-tête HTTP, de restreindre les sources de données que le contenu de la page peut charger (liste blanche), afin d'empêcher un attaquant d'injecter des scripts malveillants pour voler les données des utilisateurs.

Du point de vue du front-end, pour prévenir les attaques XSS (Cross-site scripting), on utilise généralement des frameworks modernes qui fournissent des mécanismes de protection de base. Par exemple, le JSX de React échappe automatiquement le HTML, tandis que Vue procède à un échappement automatique des balises HTML lors du binding de données via `{{ data }}`.

Bien que le front-end ait des possibilités limitées dans ce domaine, certaines optimisations de détail restent possibles :

1. Pour les formulaires avec saisie de contenu, on peut valider les caractères spéciaux pour éviter les attaques (bien qu'il soit difficile d'anticiper tous les scénarios). On privilégie donc souvent la limitation de la longueur pour contrôler le contenu saisi côté client, ou la restriction du type d'entrée.
2. Lors de la référence à des liens externes, éviter les URL http et utiliser des URL https.
3. Pour les sites statiques, on peut définir des meta tags pour restreindre les sources, comme suit :

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'` : par défaut, seules les ressources provenant de la même origine (le même domaine) sont autorisées.
- `img-src https://*` : seules les images chargées via le protocole HTTPS sont autorisées.
- `child-src 'none'` : aucune incorporation de sous-ressources externes n'est autorisée, par exemple les `<iframe>`.

## 2. Qu'est-ce qu'une attaque XSS (Cross-site scripting) ?

> What is XSS (Cross-site scripting) attack?

Le XSS, ou Cross-site scripting, est une attaque où l'attaquant injecte des scripts malveillants qui s'exécutent dans le navigateur de l'utilisateur, permettant ainsi de récupérer des données sensibles comme les cookies, ou de modifier directement le contenu de la page pour rediriger l'utilisateur vers un site malveillant.

### Prévention du XSS stocké

Un attaquant peut volontairement insérer du HTML ou des scripts malveillants dans la base de données via un commentaire. Outre l'échappement effectué par le back-end, les frameworks front-end modernes comme le JSX de React ou les templates Vue `{{ data }}` effectuent également un échappement, ce qui réduit les risques d'attaque XSS.

### Prévention du XSS réfléchi

Éviter l'utilisation de `innerHTML` pour manipuler le DOM, car cela pourrait permettre l'exécution de balises HTML. Il est recommandé d'utiliser `textContent` à la place.

### Prévention du XSS basé sur le DOM

En principe, on évite autant que possible de laisser les utilisateurs insérer directement du HTML dans la page. Si le besoin existe, les frameworks fournissent des directives dédiées, comme `dangerouslySetInnerHTML` dans React ou `v-html` dans Vue, qui offrent une protection automatique contre le XSS. Si l'on doit utiliser du JavaScript natif, il est préférable d'utiliser `textContent`, `createElement`, `setAttribute` pour manipuler le DOM.
