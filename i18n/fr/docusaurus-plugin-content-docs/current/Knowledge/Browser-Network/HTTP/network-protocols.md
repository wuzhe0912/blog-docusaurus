---
id: network-protocols
title: "\U0001F4C4 Protocoles réseau"
slug: /network-protocols
---

## 1. Décrivez TCP, HTTP, HTTPS, WebSocket

1. **TCP (Transmission Control Protocol)** :
   TCP est un protocole fiable, orienté connexion, utilisé pour transmettre des données de manière fiable entre deux ordinateurs sur Internet. Il garantit l'ordre et la fiabilité des paquets de données, ce qui signifie que les données arrivent intactes à destination, quelles que soient les conditions du réseau.

2. **HTTP (Hypertext Transfer Protocol)** :
   HTTP est le protocole utilisé pour transmettre de l'hypertexte (c'est-à-dire des pages web). Il est construit au-dessus du protocole TCP et fournit un moyen de communication entre le navigateur et le serveur. HTTP est sans état, ce qui signifie que le serveur ne conserve aucune information sur l'utilisateur.

3. **HTTPS (Hypertext Transfer Protocol Secure)** :
   HTTPS est la version sécurisée de HTTP. Il chiffre la transmission des données HTTP via le protocole SSL/TLS, protégeant ainsi la sécurité des données échangées et empêchant les attaques de type "man-in-the-middle", garantissant la confidentialité et l'intégrité des données.

4. **WebSocket** :
   Le protocole WebSocket fournit un moyen d'établir une connexion persistante entre le client et le serveur, permettant aux deux parties de transmettre des données en temps réel et de manière bidirectionnelle une fois la connexion établie. Contrairement aux requêtes HTTP traditionnelles, où chaque transmission nécessite l'établissement d'une nouvelle connexion, WebSocket est plus adapté aux applications de messagerie instantanée et aux applications nécessitant des mises à jour rapides de données.

## 2. Qu'est-ce que le Three Way Handshake (poignée de main en trois étapes) ?

Le Three Way Handshake désigne le processus d'établissement de connexion entre le serveur et le client dans un réseau `TCP/IP`. Ce processus passe par trois étapes pour confirmer que les capacités de réception et d'envoi des deux parties fonctionnent normalement, tout en synchronisant les numéros de séquence initiaux (ISN) pour assurer la synchronisation et la sécurité des données.

### TCP Message Type

Avant de comprendre les étapes, il faut d'abord connaître la fonction principale de chaque type de message.

| Message | Description                                                                      |
| ------- | -------------------------------------------------------------------------------- |
| SYN     | Utilisé pour initier et établir une connexion, et aussi synchroniser les numéros de séquence |
| ACK     | Utilisé pour confirmer à l'autre partie la réception du SYN                      |
| SYN-ACK | Synchronisation et confirmation, envoie son propre SYN et un ACK                 |
| FIN     | Terminer la connexion                                                            |

### Steps

1. Le client commence à établir une connexion avec le serveur et envoie un message SYN, informant le serveur qu'il est prêt à communiquer et quel est son numéro de séquence.
2. Le serveur reçoit le message SYN, prépare sa réponse au client : il incrémente de 1 le numéro de séquence SYN reçu et le renvoie via ACK, tout en envoyant son propre message SYN.
3. Le client confirme la réponse du serveur, les deux parties ont établi une connexion stable et commencent à transmettre des données.

### Example

Host A envoie un paquet TCP SYN au serveur, contenant un numéro de séquence aléatoire, supposons ici 1000 :

```bash
Host A ===(SYN=1000)===> Server
```

Le serveur doit répondre au numéro de séquence donné par Host A, il incrémente donc le numéro de séquence de 1 et fournit son propre SYN :

```bash
Host A <===(SYN=2000 ACK=1001)=== Server
```

Host A, après avoir reçu le SYN du serveur, doit envoyer un numéro de séquence de confirmation en réponse, il incrémente donc de 1 le numéro de séquence du serveur :

```bash
Host A ===(ACK=2001)===> Server
```

### Est-ce possible avec seulement deux étapes de handshake ?

1. L'objectif du three-way handshake est de confirmer que les capacités de réception et d'envoi des deux côtés (client et serveur) fonctionnent normalement. Avec seulement deux étapes, le serveur ne pourrait pas vérifier la capacité de réception du client.
2. Sans la troisième étape, le client ne recevrait pas le numéro de séquence du serveur et ne pourrait pas envoyer de confirmation, ce qui pourrait compromettre la sécurité des données.
3. Dans un environnement réseau instable, le temps d'arrivée des données peut varier. Si les anciennes et nouvelles données arrivent dans un ordre mélangé, sans la confirmation SYN de la troisième étape pour établir la connexion, des erreurs réseau pourraient se produire.

### Qu'est-ce que l'ISN ?

ISN signifie Initial Sequence Number. Il sert à informer le récepteur du numéro de séquence utilisé pour l'envoi des données. C'est un numéro de séquence généré dynamiquement et aléatoirement, pour éviter qu'un tiers malveillant ne le devine et ne falsifie les messages.

### À quel moment les données commencent-elles à être transmises lors du three-way handshake ?

Les première et deuxième étapes du handshake ont pour but de confirmer les capacités d'envoi et de réception des deux parties, et ne permettent pas la transmission de données. Si la transmission de données était possible dès la première étape, un tiers malveillant pourrait envoyer massivement de fausses données, forçant le serveur à consommer de la mémoire pour les mettre en cache, créant ainsi une opportunité d'attaque.

Ce n'est qu'à la troisième étape, lorsque les deux parties ont confirmé la synchronisation et sont en état de connexion, que la transmission de données est autorisée.

### Reference

- [TCP 3-Way Handshake (SYN, SYN-ACK,ACK)](https://www.guru99.com/tcp-3-way-handshake.html)
- [淘宝二面，面试官居然把 TCP 三次握手问的这么详细](https://www.eet-china.com/mp/a44399.html)

## 3. Décrivez le mécanisme de cache HTTP

Le mécanisme de cache HTTP est une technique du protocole HTTP utilisée pour stocker temporairement (ou "mettre en cache") les données de pages web, dans le but de réduire la charge du serveur, diminuer la latence et améliorer la vitesse de chargement des pages. Voici les principales stratégies de cache :

1. **Cache fort (Freshness)** : En définissant les en-têtes de réponse `Expires` ou `Cache-Control: max-age`, on indique que les données peuvent être considérées comme fraîches pendant une durée spécifique. Le client peut les utiliser directement sans avoir à les confirmer auprès du serveur.

2. **Cache de validation (Validation)** : En utilisant les en-têtes de réponse `Last-Modified` et `ETag`, le client peut envoyer une requête conditionnelle au serveur. Si les données n'ont pas été modifiées, le serveur retourne un code de statut 304 (Not Modified), indiquant que le cache local peut être utilisé.

3. **Cache négocié (Negotiation)** : Cette méthode repose sur l'en-tête de réponse `Vary`. Le serveur décide, en fonction de la requête du client (comme `Accept-Language`), s'il doit fournir une version différente du contenu mis en cache.

4. **Pas de cache (No-store)** : Si `Cache-Control: no-store` est défini, cela signifie que les données ne doivent pas être mises en cache, et chaque requête doit récupérer les données les plus récentes depuis le serveur.

Le choix de la stratégie de cache dépend de facteurs tels que le type de données et la fréquence de mise à jour. Une stratégie de cache efficace peut améliorer considérablement les performances des applications web.

### Service Worker

D'après mon expérience personnelle, après avoir configuré le PWA pour une Web App, il est possible de mettre en cache des styles de base, des logos, et même de préparer un fichier offline.html pour une utilisation hors ligne, le tout enregistré dans service-worker.js. Ainsi, même lorsque l'utilisateur est déconnecté, grâce à ce mécanisme de cache, il peut connaître l'état actuel du site ou du réseau et maintenir un certain niveau d'expérience utilisateur.
