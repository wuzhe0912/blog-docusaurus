---
id: http-methods
title: "\U0001F4C4 Méthodes HTTP"
slug: /http-methods
---

## 1. Qu'est-ce qu'une API RESTful ?

L'écriture d'une API RESTful adopte un ensemble de styles de conception standardisés, facilitant la communication entre différents systèmes sur le réseau. Pour respecter les principes REST, une API doit être prévisible et facile à comprendre. En tant que développeur front-end, nous nous concentrons principalement sur les trois points suivants :

- **Chemin URL (url path)** : Identifie la portée de la requête côté client, par exemple :
  - `/products` : peut retourner une liste de produits
  - `/products/abc` : fournit les détails du produit dont l'ID est abc
- **Méthodes HTTP** : Définissent l'action spécifique à exécuter :
  - `GET` : pour récupérer des données
  - `POST` : pour créer de nouvelles données
  - `PUT` : pour mettre à jour des données existantes
  - `DELETE` : pour supprimer des données
- **Codes de statut (status code)** : Fournissent une indication rapide sur le succès ou l'échec de la requête, et le cas échéant, sur la nature du problème. Les codes de statut courants incluent :
  - `200` : succès
  - `404` : ressource demandée introuvable
  - `500` : erreur serveur

## 2. Si GET peut aussi transporter des données dans une requête, pourquoi utiliser POST ?

> Puisque `GET` peut également envoyer des requêtes contenant des données, pourquoi avons-nous besoin d'utiliser `POST` ?

Principalement pour quatre raisons :

1. Sécurité : Comme les données de `GET` sont attachées à l'URL, les données sensibles sont facilement exposées. `POST` place les données dans le `body` de la requête, ce qui est relativement plus sécurisé.
2. Limite de taille des données : Avec `GET`, la longueur de l'URL est limitée par le navigateur et le serveur (bien que cela varie selon les navigateurs, la limite est généralement autour de 2048 bytes), ce qui restreint la quantité de données. `POST` n'a théoriquement pas de limite, mais en pratique, pour éviter les attaques malveillantes injectant de grandes quantités de données, des middlewares sont généralement configurés pour limiter la taille des données. Par exemple, `body-parser` d'`express`.
3. Clarté sémantique : Permet aux développeurs de comprendre clairement l'objectif de la requête. `GET` est généralement utilisé pour récupérer des données, tandis que `POST` est plus adapté à la création ou la mise à jour de données.
4. Immutabilité (Immutability) : Dans le protocole HTTP, la méthode `GET` est conçue comme "sûre". Quel que soit le nombre de requêtes envoyées, il n'y a pas lieu de craindre que cela modifie les données sur le serveur.

## 3. Que fait la méthode PUT en HTTP ?

> Quelle est l'utilité de la méthode `PUT` ?

Elle a principalement deux usages :

1. Mettre à jour une donnée existante (par exemple, modifier les informations d'un utilisateur)
2. Si la donnée n'existe pas, en créer une nouvelle

### Example

```js
const axios = require('axios');

async function updateUser(userId, newName) {
  const url = `https://api.example.com/users/${userId}`; // api URL
  const data = {
    name: newName,
  };

  try {
    const response = await axios.put(url, data); // 執行 PUT 請求
    console.log('User updated:', response.data); // 輸出更新後的用戶信息
  } catch (error) {
    console.log('Error updating user:', error); // 輸出錯誤信息
  }
}

updateUser(1, 'Pitt Wu');
```
