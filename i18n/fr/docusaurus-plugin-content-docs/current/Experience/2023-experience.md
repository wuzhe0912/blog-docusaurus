---
id: 2023-experience
title: 📄 2023 Experience
slug: /2023-experience
---

## What is the most challenging technical problem you have solved ?

> Quel est le problème technique le plus difficile que tu as résolu ?

### Webauthn

Le problème technique que j'ai traité récemment et qui était relativement nouveau avec peu d'expérience pertinente était l'implémentation de la connexion Webauthn. L'équipe en charge des exigences souhaitait que les utilisateurs puissent déclencher le même mécanisme Face ID / Touch ID que dans l'application lors de la connexion au site web, pour une expérience utilisateur plus fluide.

Matériaux de référence avant l'implémentation :

- https://webauthn.io/
- https://medium.com/@herrjemand/introduction-to-webauthn-api-5fd1fb46c285

Après confirmation préliminaire de la faisabilité, le flux complet d'inscription et de connexion a été coordonné avec l'équipe PM, y compris la question de savoir si la vérification biométrique est déclenchée lors de la première connexion, ainsi que les mécanismes de détermination. Le plus grand défi lors de l'implémentation était l'ajustement constant de divers paramètres d'entrée, car les matériaux de référence disponibles étaient encore trop limités et la signification de nombreux paramètres n'était pas claire — il ne restait qu'à essayer continuellement. Concernant les appareils, les téléphones iOS étaient relativement faciles à gérer, mais les téléphones Android présentaient le problème que Touch ID était difficile à déclencher, nécessitant l'aide du backend pour ajuster certains paramètres de compatibilité. Une fois la fonctionnalité terminée, combinée avec le PWA précédemment mis en place, le site web offrait une expérience d'utilisation plus proche d'une application.
