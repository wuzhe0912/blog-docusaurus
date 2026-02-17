---
id: web-storage
title: '[Medium] 📄 cookie, sessionStorage, localStorage'
slug: /web-storage
tags: [HTML, JavaScript, Quiz, Medium]
---

## Comparaison

| Propriete | `cookie` | `sessionStorage` | `localStorage` |
| --- | --- | --- | --- |
| Cycle de vie | Supprime par defaut a la fermeture de la page, sauf si un delai d'expiration (Expires) ou une duree maximale de conservation (Max-Age) est defini | Supprime a la fermeture de la page | Stockage permanent jusqu'a suppression explicite |
| HTTP Request | Oui, peut etre envoye au serveur via le header Cookie | Non | Non |
| Capacite totale | 4KB | 5MB | 5MB |
| Portee d'acces | Inter-fenetres/onglets | Meme onglet uniquement | Inter-fenetres/onglets |
| Securite | JavaScript ne peut pas acceder aux `HttpOnly cookies` | Aucune | Aucune |

## Explication des termes

> Que sont les Persistent cookies ?

Les cookies persistants sont une methode pour stocker des donnees a long terme dans le navigateur de l'utilisateur. L'implementation concrete se fait en definissant un delai d'expiration comme mentionne ci-dessus (`Expires` ou `Max-Age`).

## Experience personnelle d'implementation

### `cookie`

#### 1. Verification de securite

Certains projets legacy avaient une mauvaise situation de securite, avec des vols de comptes frequents qui augmentaient considerablement les couts operationnels. La bibliotheque [Fingerprint](https://fingerprint.com/) (version communautaire avec une precision d'environ 60%, version payante avec un quota mensuel gratuit de 20 000) a d'abord ete adoptee pour identifier chaque utilisateur connecte comme un visitID unique via les parametres d'appareil et de localisation. Ensuite, en exploitant la caracteristique des cookies d'etre envoyes a chaque requete HTTP, le backend pouvait verifier la situation actuelle de l'utilisateur (changement d'appareil ou deviation anormale de localisation). Lorsque des anomalies etaient detectees, une verification OTP (email ou SMS selon les besoins de l'entreprise) etait forcee dans le flux de connexion.

#### 2. URL de code promotionnel

Lors de la gestion de sites web de produits, des strategies de marketing d'affiliation etaient frequemment proposees, fournissant des URLs exclusives aux promoteurs partenaires pour faciliter l'acquisition de trafic. Pour s'assurer que les clients arrives par ce biais soient attribues au promoteur correspondant, la propriete `expires` de `cookie` a ete utilisee. A partir du moment ou l'utilisateur entre sur le site via la redirection, pendant 24 heures (la duree peut etre decidee par l'operateur), le code promotionnel reste obligatoirement valide. Meme si l'utilisateur supprime intentionnellement le parametre du code promotionnel de l'URL, lors de l'inscription, le parametre correspondant est recupere depuis le `cookie`, expirant automatiquement apres 24 heures.

### `localStorage`

#### 1. Stockage des preferences utilisateur

- Couramment utilise pour stocker les preferences personnelles de l'utilisateur, comme le dark mode, les parametres de langue i18n, etc.
- Ou pour stocker le token de connexion.
