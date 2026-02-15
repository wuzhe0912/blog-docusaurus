---
id: login-interview-index
title: "Vue d'ensemble des questions d'entretien sur l'authentification"
slug: /experience/login
tags: [Experience, Interview, Login]
---

> Compilation progressive des questions d'entretien liées au login et des points de reponse cles, organises par niveau de difficulte.

---

## Lv1 Les bases

- [Comment le mecanisme de login a-t-il ete implemente dans vos projets precedents ?](/docs/experience/login/lv1-project-implementation)
- [Quelle est la difference entre Session-based et Token-based ?](/docs/experience/login/lv1-session-vs-token)
- [Quelle est la structure d'un JWT ?](/docs/experience/login/lv1-jwt-structure)

## Lv2 Intermediaire

- Dans quels emplacements le Token peut-il etre stocke ? Quels sont les enjeux de securite a considerer ? (a venir)
- Comment le front-end attache-t-il automatiquement le Token a chaque requete API ? (a venir)
- Comment gerer l'expiration du Token ? (a venir)

## Lv3 Conception systeme

- Pourquoi l'architecture microservices prefere-t-elle le JWT ? (a venir)
- Quels sont les inconvenients du JWT ? Comment gerer la deconnexion active ? (a venir)
- Comment reduire ou empecher le vol de Token ? (a venir)

## Lv4 Questions avancees

- Si l'on doit implementer une "deconnexion forcee de tous les appareils", comment faire avec Session et avec Token ? (a venir)
- Avec quelle strategie d'authentification le SSO (Single Sign-On) est-il generalement associe ? (a venir)
