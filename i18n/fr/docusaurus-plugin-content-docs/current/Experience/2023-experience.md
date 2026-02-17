---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> Quel est le probleme technique le plus difficile que tu as resolu ?

### Webauthn

Le probleme technique que j'ai traite recemment et qui etait relativement nouveau avec peu d'experience pertinente etait l'implementation de la connexion Webauthn. L'equipe en charge des exigences souhaitait que les utilisateurs puissent declencher le meme mecanisme Face ID / Touch ID que dans l'application lors de la connexion au site web, pour une experience utilisateur plus fluide.

Materiaux de reference avant l'implementation :

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

Apres confirmation preliminaire de la faisabilite, le flux complet d'inscription et de connexion a ete coordonne avec l'equipe PM, y compris la question de savoir si la verification biometrique est declenchee lors de la premiere connexion, ainsi que les mecanismes de determination. Le plus grand defi lors de l'implementation etait l'ajustement constant de divers parametres d'entree, car les materiaux de reference disponibles etaient encore trop limites et la signification de nombreux parametres n'etait pas claire — il ne restait qu'a essayer continuellement. Concernant les appareils, les telephones iOS etaient relativement faciles a gerer, mais les telephones Android presentaient le probleme que Touch ID etait difficile a declencher, necessitant l'aide du backend pour ajuster certains parametres de compatibilite. Une fois la fonctionnalite terminee, combinee avec le PWA precedemment mis en place, le site web offrait une experience d'utilisation plus proche d'une application.
