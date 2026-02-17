---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Comparaison

| Propriété | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| Cycle de vie | Supprimé par défaut à la fermeture de la page, sauf si un délai d'expiration (Expires) ou une durée maximale de conservation (Max-Age) est défini | Supprimé à la fermeture de la page | Stockage permanent jusqu'à suppression explicite |
| HTTP Request | Oui, peut être envoyé au serveur via le header Cookie | Non | Non |
| Capacité totale | 4KB | 5MB | 5MB |
| Portée d'accès | Inter-fenêtres/onglets | Même onglet uniquement | Inter-fenêtres/onglets |
| Sécurité | JavaScript ne peut pas accéder aux `HttpOnly cookies` | Aucune | Aucune |

## Explication des termes

> Que sont les Persistent cookies ?

Les cookies persistants sont une méthode pour stocker des données à long terme dans le navigateur de l'utilisateur. L'implémentation concrète se fait en définissant un délai d'expiration comme mentionné ci-dessus (`Expires` ou `Max-Age`).

## Expérience personnelle d'implémentation

### `cookie`

#### 1. Vérification de sécurité

Certains projets legacy avaient une mauvaise situation de sécurité, avec des vols de comptes fréquents qui augmentaient considérablement les coûts opérationnels. La bibliothèque [Fingerprint](https://fingerprint.com/) (version communautaire avec une précision d'environ 60%, version payante avec un quota mensuel gratuit de 20 000) a d'abord été adoptée pour identifier chaque utilisateur connecté comme un visitID unique via les paramètres d'appareil et de localisation. Ensuite, en exploitant la caractéristique des cookies d'être envoyés à chaque requête HTTP, le backend pouvait vérifier la situation actuelle de l'utilisateur (changement d'appareil ou déviation anormale de localisation). Lorsque des anomalies étaient détectées, une vérification OTP (email ou SMS selon les besoins de l'entreprise) était forcée dans le flux de connexion.

#### 2. URL de code promotionnel

Lors de la gestion de sites web de produits, des stratégies de marketing d'affiliation étaient fréquemment proposées, fournissant des URLs exclusives aux promoteurs partenaires pour faciliter l'acquisition de trafic. Pour s'assurer que les clients arrivés par ce biais soient attribués au promoteur correspondant, la propriété `expires` de `cookie` a été utilisée. À partir du moment où l'utilisateur entre sur le site via la redirection, pendant 24 heures (la durée peut être décidée par l'opérateur), le code promotionnel reste obligatoirement valide. Même si l'utilisateur supprime intentionnellement le paramètre du code promotionnel de l'URL, lors de l'inscription, le paramètre correspondant est récupéré depuis le `cookie`, expirant automatiquement après 24 heures.

### `localStorage`

#### 1. Stockage des préférences utilisateur

- Couramment utilisé pour stocker les préférences personnelles de l'utilisateur, comme le dark mode, les paramètres de langue i18n, etc.
- Ou pour stocker le token de connexion.
