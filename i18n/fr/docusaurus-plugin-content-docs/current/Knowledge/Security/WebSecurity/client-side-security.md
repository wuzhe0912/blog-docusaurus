---
id: client-side-security
title: "[Easy] Client Side Security"
slug: /client-side-security
---

## 1. Pouvez-vous expliquer ce qu'est le CSP (Content Security Policy) ?

> Can you explain what CSP (Content Security Policy) is?

En principe, le CSP est un mecanisme qui renforce la securite des pages web. Il permet, via la configuration d'un en-tete HTTP, de restreindre les sources de donnees que le contenu de la page peut charger (liste blanche), afin d'empecher un attaquant d'injecter des scripts malveillants pour voler les donnees des utilisateurs.

Du point de vue du front-end, pour prevenir les attaques XSS (Cross-site scripting), on utilise generalement des frameworks modernes qui fournissent des mecanismes de protection de base. Par exemple, le JSX de React echappe automatiquement le HTML, tandis que Vue procede a un echappement automatique des balises HTML lors du binding de donnees via `{{ data }}`.

Bien que le front-end ait des possibilites limitees dans ce domaine, certaines optimisations de detail restent possibles :

1. Pour les formulaires avec saisie de contenu, on peut valider les caracteres speciaux pour eviter les attaques (bien qu'il soit difficile d'anticiper tous les scenarios). On privilegie donc souvent la limitation de la longueur pour controler le contenu saisi cote client, ou la restriction du type d'entree.
2. Lors de la reference a des liens externes, eviter les URL http et utiliser des URL https.
3. Pour les sites statiques, on peut definir des meta tags pour restreindre les sources, comme suit :

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; img-src https://*; child-src 'none';"
/>
```

- `default-src 'self'` : par defaut, seules les ressources provenant de la meme origine (le meme domaine) sont autorisees.
- `img-src https://*` : seules les images chargees via le protocole HTTPS sont autorisees.
- `child-src 'none'` : aucune incorporation de sous-ressources externes n'est autorisee, par exemple les `<iframe>`.

## 2. Qu'est-ce qu'une attaque XSS (Cross-site scripting) ?

> What is XSS (Cross-site scripting) attack?

Le XSS, ou Cross-site scripting, est une attaque ou l'attaquant injecte des scripts malveillants qui s'executent dans le navigateur de l'utilisateur, permettant ainsi de recuperer des donnees sensibles comme les cookies, ou de modifier directement le contenu de la page pour rediriger l'utilisateur vers un site malveillant.

### Prevention du XSS stocke

Un attaquant peut volontairement inserer du HTML ou des scripts malveillants dans la base de donnees via un commentaire. Outre l'echappement effectue par le back-end, les frameworks front-end modernes comme le JSX de React ou les templates Vue `{{ data }}` effectuent egalement un echappement, ce qui reduit les risques d'attaque XSS.

### Prevention du XSS reflechi

Eviter l'utilisation de `innerHTML` pour manipuler le DOM, car cela pourrait permettre l'execution de balises HTML. Il est recommande d'utiliser `textContent` a la place.

### Prevention du XSS base sur le DOM

En principe, on evite autant que possible de laisser les utilisateurs inserer directement du HTML dans la page. Si le besoin existe, les frameworks fournissent des directives dediees, comme `dangerouslySetInnerHTML` dans React ou `v-html` dans Vue, qui offrent une protection automatique contre le XSS. Si l'on doit utiliser du JavaScript natif, il est preferable d'utiliser `textContent`, `createElement`, `setAttribute` pour manipuler le DOM.
